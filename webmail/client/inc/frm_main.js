_me = frm_main.prototype;
function frm_main(){};
frm_main.recent_sorted = false;

_me.__constructor = function(bAlreadySynced)
{
	var me = this;

	this.__refreshFolderTimeout = {};

	this._main.setAttribute('selected', 'folder');

	//Always open system menu on Ctrl+Rclick
	gui._main.addEventListener('contextmenu', function(e){
		var e = e || window.event;
		e.ctrlKey && e.stopPropagation && e.stopPropagation();
		return true;
	}, true);

	//Create TITLE object
	this._create('title', 'obj_title');

	//Disable History buttons
	if ('onpopstate' in window && 'pushState' in history){
		window.onpopstate = function(e){
			history.pushState(parseURL(), document.title, document.pathname);
			me.title._refresh(true);
		};
	}

	//Create focus management object
	gui._create('focus','obj_focus');

	//Create DRAG AND DROP
	storage.library('dragndrop');
	this.dnd = new cDnD();

	// Create global custom tooltip
	gui._create('tooltip','obj_tooltip');

	if (!Is.Defined(gui._REQUEST_VARS['mailto']) && !gui._REQUEST_VARS['cc'] && !gui._REQUEST_VARS['bcc']){

		//Create SOUND object
		this.sound = gui._create('sound','obj_sound');
		this.audio = gui._create('audio','obj_audio');

		//Create Notifier
		gui._create('notifier','obj_notifier');

		//Create global print object
		gui._create('printer','obj_print');

		//Page leave confirmation dialog
		//Do not apply in debug mode
		window.onbeforeunload= function(e){
			e = e || window.event;

			//MSIE think that href="javascript: void(0)" is a link...
			if (typeof e.clientX == 'undefined' || e.clientX<0 || e.clientY<0){
				switch(GWOthers.getItem('LAYOUT_SETTINGS','confirm_exit').toString()){
				case '1':
					if (gui._getChildObjects('main','frm_compose').length<1)
						break;

				case '2':
					e.cancelBubble = true;

						//e.stopPropagation works in Firefox.
					if (e.stopPropagation) {
						e.stopPropagation();
						e.preventDefault();
					}

						//This is displayed on the dialog
					return getLang('CONFIRMATION::UNLOAD');
				}

				if (!e.explicitOriginalTarget || e.explicitOriginalTarget == document){
					//kill Connection Manager
					if (gui.connection)
						gui.connection._destruct();

					if (gui.frm_main){
						//kill IM
						if (gui.frm_main.im)
							gui.frm_main.im._destruct();

						//kill SIP
		                gui.frm_main.__onDestruct();
					}
				}
			}
		};

		//WebSocket
		if (window.WebSocket){
			gui._create('socket','obj_websocket');
			gui.socket._create('api','obj_websocket_api');
			gui._create('subscriber','obj_subscriber');

			if (!sPrimaryAccountGUEST)
				gui.socket._create('xmpp','obj_websocket_xmpp');

			//Team Chat - Notifier
			var refresh_timeout;
			gui.socket.api._obeyEvent('onnotify', [function(aData){
				if ((aData['ORIGINATOR-EMAIL'] || aData.EMAIL) !== sPrimaryAccount && aData['ITEM-TYPE'] === 'F' && aData['TYPE'] === 'item' && ~['update', 'add'].indexOf(aData.ACTION)) {
					var sFolder, aFolders = dataSet.get('folders', [sPrimaryAccount]);
					for (var sFolder in aFolders) {
						if (((aData.EMAIL === sPrimaryAccount && !aFolders[sFolder].OWNER) || (aFolders[sFolder].OWNER === aData.EMAIL)) && aFolders[sFolder].RELATIVE_PATH === Path.slash(aData.FOLDER)) {
							break;
						}
					}
					if(dataSet.get('folders', [sPrimaryAccount, sFolder, 'TYPE']) !== 'F' && (GWOthers.getItem('CHAT','visual_notify') == '0' || dataSet.get('folders', [sPrimaryAccount, sFolder, 'NOTIFY']) != '1')) {
						return;
					}
					WMItems.list({"aid": sPrimaryAccount, "fid": sFolder, "iid": aData.ITEM}, '', '', '', [function(response) {
						aData.data = response[sPrimaryAccount][sFolder]['*' + aData.ITEM];
						aData.data && gui.notifier._value({
							type: 'document_' + (aData.ACTION === 'add' ? 'added' : 'edited'),
							args: aData,
							// group: 'document_' + aData.ITEM + '_' + (aData['ORIGINATOR-NAME'] || aData['ORIGINATOR-EMAIL']),
							save: true
						});
					}]);
					return;
				}

				if (aData && aData.EMAIL){

					if (
						aData.ACTION &&
						aData.EMAIL != sPrimaryAccount &&
							(
								'folder' === aData.TYPE || // Case when new room is created by another user
								'acl' == aData.TYPE ||
								('item' === aData.TYPE && 'W' === aData['ITEM-TYPE'] && aData.ACTION === 'add') // Case when invitation to private room is sent (must be treated as creation of new public room)
							)
						){

						switch(aData.ACTION){
						case 'delete':
						case 'update':

							// var sPath = sPrimaryAccount;

							// // check if active, set to home
							// if (aData.EMAIL == sPrimaryAccount){
							// 	sPath += '/'+ Path.slash(aData.ITEM);
							// }
							// //OWNER && RELATIVE_PATH
							// else
							// if (aData.EMAIL && aData.FOLDER){
							// 	var aFolders = dataSet.get('folders', [sPrimaryAccount]);
							// 	for (var id in aFolders)
							// 		if (aFolders[id].OWNER === aData.EMAIL && aFolders[id].RELATIVE_PATH === Path.slash(aData.FOLDER)) {
							// 			sPath += '/'+ id;
							// 			break;
							// 		}
							// }

							// //Go to HOME
							// if (dataSet.get('active_folder') == sPath){
							// 	gui.frm_main._selectView();
							// }

						// New temchat folder (room) was created
						case 'add':
							refresh_timeout && clearTimeout(refresh_timeout);
							refresh_timeout = setTimeout(function() {
								WMAccounts.refresh({'aid':sPrimaryAccount},'folders', undefined, [me, me.__newTeamchatRoomCallback, [aData]]);
							}, 1000);
						}
					}
					else
					if (aData.ACTION == 'add' && aData['FOLDER-TYPE'] == 'I' && aData.FOLDER) {
						switch(aData['ITEM-TYPE']){
						case 'R':
							if (aData.COMEVNID)
								break;
						case 'I':
						case 'W':
						case 'Y':
						case 'Q':
						case 'S':
							//Recent +1
							var folder = Path.slash(aData.FOLDER),
								aFolders = dataSet.get('folders',[sPrimaryAccount]),
								aActive = Path.split(dataSet.get('active_folder'));

							for(var fid in aFolders)
								if (aFolders[fid].OWNER == aData.EMAIL && aFolders[fid].RELATIVE_PATH == folder){

									if (!aFolders[fid].SYNC || aFolders[fid].SYNC === '0'){
										return;
									}

									var i;
									if ((aActive[0] == sPrimaryAccount) && (aActive[1] == fid) && gui.frm_main.main.tabs.room._isActive) {
										i = 0;
									}
									else {
										//i = ((dataSet.get('teamchat', [fid, 'recent']) || 0) + 1);
										i = parseInt(aFolders[fid].RECENT || 0) + 1;
									}

									//dataSet.add('teamchat', [fid,'recent'], i, true);
									//dataSet.update('teamchat');
									dataSet.add('folders', [sPrimaryAccount, fid, 'RECENT'], i.toString());

									me.__addTeamchatFolderToRecent(fid);

									break;
								}

							dataSet.add('folders', [sPrimaryAccount, fid, 'GROUPCHAT_LASTACTIVITY'], Math.floor(new Date().getTime() / 1000).toString());

							//Notifications
							if (dataSet.get('folders', [sPrimaryAccount, fid, 'NOTIFY']) == '1' && (aData.TITLE || aData.BODY || '').indexOf('/') !== 0){

								var aFolder = dataSet.get('folders', aActive);
								if (/*gui.__focus && */aFolder.OWNER == aData.EMAIL && aFolder.RELATIVE_PATH == folder && gui.frm_main.main.tabs.room._isActive)
									return;

								//Visual (Message only)
								if (GWOthers.getItem('CHAT','visual_notify')>'0'){
									gui.notifier._value({
										type: 'teamchat',
										save: true,
										args: { data: aData, text_plain: aData.TITLE || aData.BODY },
										//group: 'teamchat_' + folder,
										timeout: 5000,
										aHandler: [function(aData){

											var folder = Path.slash(aData.FOLDER),
												aFolders = dataSet.get('folders',[sPrimaryAccount]);

											if (folder)
												for(var fid in aFolders)
													if (aFolders[fid].OWNER == aData.EMAIL && aFolders[fid].RELATIVE_PATH == folder){
														// gui.frm_main.bar.tree.folders._setActive(sPrimaryAccount+'/'+fid);
														gui.frm_main._selectView({aid:sPrimaryAccount,fid:fid});
														gui.frm_main.filter.__filter('I');
														break;
													}
										}, [aData]]
									});
								}

								//Sound
								if (GWOthers.getItem('CHAT','sound_notify')>'0' && gui.frm_main.sound){
									gui.frm_main.sound._play('chat');
								}
							}
						}
					}
					else
					if (aData.FOLDER && aData.ACTION && aData.ITEM && ~['F', 'I', 'Y'].indexOf(aData['FOLDER-TYPE'])) {
						var folder = Path.slash(aData.FOLDER),
							aFolders = dataSet.get('folders',[sPrimaryAccount]),
							fid = null;

						for(var i in aFolders) {
							if ((aFolders[i].OWNER || sPrimaryAccount) == aData.EMAIL && aFolders[i].RELATIVE_PATH == folder){
								fid = i;
								break;
							}
						}

						var ds;
						if(fid && (ds = dataSet.get('items', [sPrimaryAccount, fid, WMItems.__clientID(aData.ITEM)]))) {
							var bUpdate = false;
							switch (aData.ACTION) {
							case "lock":
								ds.EVNLOCKOWN_EMAIL = aData['ORIGINATOR-EMAIL'];
								ds.EVNLOCKOWN_ID = aData['ORIGINATOR-ID'];
								bUpdate = true;
								break;

							case "unlock":
								ds.EVNLOCKOWN_EMAIL = sPrimaryAccount;
								ds.EVNLOCKOWN_ID = '';
								bUpdate = true;
								break;

							case "start_edit":
							case "join_edit":
							case "stop_edit":
							case "edit_session_finished":
								// ds.EVN_DOCUMENTEDITINGINFO = aData.BODY;
								bUpdate = true;
								break;

							case "update":
							case "add":
								if (aData.TIME>0){
									ds.EVN_MODIFIED = aData.TIME;
									bUpdate = true;
								}
							}

							if (bUpdate){
								dataSet.update('items', [sPrimaryAccount, fid, WMItems.__clientID(aData.ITEM)]);
							}
						}
					}
					else
					//update for inbox
					if (aData.SERVICE === 'SMTP' && aData.EMAIL === sPrimaryAccount && aData.ACTION === 'add'){

						me.__refreshFolderTimeout[aData.FOLDER] = me.__refreshFolderTimeout[aData.FOLDER] || setTimeout(function() {
							delete me.__refreshFolderTimeout[aData.FOLDER];
							WMFolders.sync({ aid: sPrimaryAccount, fid: aData.FOLDER }, 'folders', '', [gui.frm_main, '_refreshItems', [sPrimaryAccount]]);
						}, Math.max(Math.random() * 60000, 15000));

						// var af = Path.split(dataSet.get('active_folder'));
						// if (af[0] === sPrimaryAccount && af[1] == aData.FOLDER){
						// 	me.__refreshFolderTimeout[af[0]+'/'+af[1]] = me.__refreshFolderTimeout[af[0]+'/'+af[1]] || setTimeout(function() {
						// 		delete me.__refreshFolderTimeout[af[0]+'/'+af[1]];
						// 		WMFolders.sync({ aid: af[0], fid: af[1] }, 'folders', '', [gui.frm_main, '_refreshItems', [sPrimaryAccount]]);
						// 	}, Math.random() * 60000);
						// }
						// else{
						// 	dataSet.add('folders',[aData.EMAIL, aData.FOLDER, 'RECENT'], +(dataSet.get('folders',[aData.EMAIL, aData.FOLDER, 'RECENT']) || 0) + 1);

						// 	if (aData.FOLDER === 'INBOX' && parseInt(GWOthers.getItem('MAIL_SETTINGS_GENERAL','sound_notify'))>0 && gui.frm_main && gui.frm_main.sound)
						// 		gui.frm_main.sound._play('mail');
						// }
					}
				}

			}]);
		}
	}

	//FullScrean Fix
	// function fschange(e){
	// 	console.log(e);

	// 	if (e && e.originalTarget){
	// 		var elm = e.originalTarget.activeElement;
	// 		if (elm && elm.tagName == 'IFRAME'){
	// 			if (elm.style.position == 'fixed')
	// 				elm.style.position = '';
	// 			else
	// 				elm.style.position = 'fixed';
	// 		}
	// 	}
	// };
	// document.addEventListener("fullscreenchange", fschange, false);
	// //document.addEventListener("webkitfullscreenchange", fschange, false);
	// //document.addEventListener("mozfullscreenchange", fschange, false);

	// load libraries
	storage.library('class_folder');
	storage.library('class_item');
	storage.library('class_items_recover_helper');
	storage.library('class_old_message');
	storage.library('class_new_message');

	//Synchro-set folders dataset
	var aAccounts = dataSet.get('accounts');
	this.__goNextCount = 0;
	for (var sAccId in aAccounts)
		if (aAccounts[sAccId])
			if (aAccounts[sAccId]['PRIMARY']){
				if (!bAlreadySynced)
					dataSet.add('folders',[sAccId],WMAccounts.refresh({'aid':sAccId})[sAccId]);
			}
			else
			if ((GWOthers.getItem('RESTRICTIONS','disable_otheraccounts') || 0)<1 || aAccounts[sAccId].TYPE == 'rss'){
				this.__goNextCount++;
				WMFolders.list({'aid':sAccId},'folders',[sAccId],[this,'_goNext']);
			}

	//Telemetry
	if (sPrimaryTelemetry){
		storage.library('telemetry');
		gui._create('telemetry','telemetry');
	}

	//Continue...
	if (!this.__goNextCount)
		this.__constructor2();
};

_me.__mkAd = function () {
	return mkElement('ins', {
		'class': 'adsbygoogle',
		'data-ad-client': GWOthers.getItem('BANNER_OPTIONS', 'customer_id').trim(),
		'data-ad-slot': GWOthers.getItem('BANNER_OPTIONS', 'below_code')});
};

_me.__prepareTopBanner = function () {
	var sEnabled = GWOthers.getItem('RESTRICTIONS', 'enable_adsense');

	if ('1' !== sEnabled) {
		return;
	}

	var top_type = GWOthers.getItem('BANNER_OPTIONS', 'top_type');
	var banner;
	if (!top_type || top_type === 'none') {
		return;
	}
	if (top_type === 'url') {
		this._main.classList.add('has-banner');
		document.getElementById('banner-container').style.backgroundImage = 'url(' + GWOthers.getItem('BANNER_OPTIONS', 'top_url') + ')';
		return;
	}
	if (top_type === 'code') {
		(window.adsbygoogle = window.adsbygoogle || []).push({});
		if (!document.getElementById('adsbygoogle')) {
			var script = document.createElement('script');
			script.id = 'adsbygoogle';
			script.type = 'text/javascript';
			script.src = "//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
			document.head.appendChild(script);
		}
		this._main.classList.add('has-banner');
		banner = this.__mkAd();
		document.getElementById('banner-container').appendChild(banner);
		return;
	}
};
_me.__prepareIMBanner = function () {
	var sEnabled = GWOthers.getItem('RESTRICTIONS', 'enable_adsense');

	if ('1' !== sEnabled) {
		return;
	}

	var top_type = GWOthers.getItem('BANNER_OPTIONS', 'below_type');
	var below_code = GWOthers.getItem('BANNER_OPTIONS', 'below_code');
	var below_url = GWOthers.getItem('BANNER_OPTIONS', 'below_url');
	var ad,banner;
	if (!top_type || top_type === 'none' || !this.im || (top_type === 'code' && !below_code) || (top_type === 'url' && !below_url)) {
		return;
	}
	ad = mkElement('div', {'class': 'adsense-im'});
	banner;
	if (top_type === 'url') {
		banner = mkElement('div', {'class': 'adsense-im-banner'});
		banner.style.backgroundImage = 'url(' + GWOthers.getItem('BANNER_OPTIONS', 'below_url') + ')';
	}
	if (top_type === 'code') {
		(window.adsbygoogle = window.adsbygoogle || []).push({});
		if (!document.getElementById('adsbygoogle')) {
			var script = document.createElement('script');
			script.id = 'adsbygoogle';
			script.type = 'text/javascript';
			script.src = "//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
			document.head.appendChild(script);
		}
		banner = this.__mkAd();
		banner.classList.add('adsense-im-banner');
	}
	ad.appendChild(banner);
	this.im._main.appendChild(ad);
	this.im._main.classList.add('with-banner');
};

_me._goNext = function(){
	this.__goNextCount--;
	if (!this.__goNextCount)
		this.__constructor2();
};

_me.__constructor2 = function (){
	var me = this;

	//Drop File, registr Events
	if (window.FormData){
		this.__dropzones = [];
		this.__dragtimer = null;
		this.__filedrag = true;

		document.addEventListener("dragover", function(e){
			if (me.__filedrag){

				e.preventDefault();

				if (me.__dragtimer == null)
					me.__file_dragover(e);
		        else
		            window.clearTimeout(me.__dragtimer);

				me.__dragtimer = window.setTimeout(function(){
					me.__dragtimer = null;
					me.__file_dragover(false);
				},500);
			}
		}, false);

		document.addEventListener("drop", function(e){ if (me.__filedrag) e.preventDefault(); }, false);

		document.addEventListener("dragstart", function(e){
			me.__filedrag = false;
		}, true);
		document.addEventListener("dragend", function(e){
			me.__filedrag = true;
		}, true);
	}

	//// Auto-Compose - Mailto parametr ////
	if (Is.Defined(gui._REQUEST_VARS['mailto']) || gui._REQUEST_VARS['cc'] || gui._REQUEST_VARS['bcc']){

		var head = {
			to:unescape(gui._REQUEST_VARS['mailto'] || ''),
			subject:unescape(gui._REQUEST_VARS['subject'] || ''),
			cc:unescape(gui._REQUEST_VARS['cc'] || ''),
			bcc:unescape(gui._REQUEST_VARS['bcc'] || ''),
			mailBody:unescape(gui._REQUEST_VARS['body'] || '')
		};

		var frm = NewMessage.compose(head);
		frm._maximize();
		frm._resizable(false);
		frm._dockable(false);
		frm._onclose = function(b){
			if (b)
				self.close();

			return false;
		};

		frm._obeyEvent('onhide',[function(){
			if (!gui.loader)
				gui._create('loader','obj_loader');

			gui.loader._value(getLang('COMMON::SENDING'));
		}]);

		frm._obeyEvent('onshow',[function(){
			if (gui.loader)
				gui.loader._destruct();
		}]);

		frm._obeyEvent('onsend',[function(){
			addcss(gui.loader._main,'alert');
			gui.loader._value(getLang('MESSAGE::CLOSE_WINDOW'));
			self.close();
		}]);

		return;
	}

	//Preload TAGs
	this._loadTags(true);



	//COOKIE FILTRING, remove all
	// 2Do, include: rights, tree
	var aFolders = dataSet.get('folders','',true),
		aItems = Cookie.get(['folders']);
	if (typeof aItems == 'object'){
		for(var aid in aItems){
			if (!aFolders[aid]){
				Cookie.set(['folders',aid],'');
			}
			else
			for(var fid in aItems[aid])
				if (!aFolders[aid][fid])
					Cookie.set(['rights',aid,fid],'');
		}
	}

	//FILTER RIGHTS
	var	aRights = Cookie.get(['rights']);
	if (typeof aRights == 'object'){
		for(var sAccId in aRights){

			if (!aFolders[sAccId]){
				Cookie.set(['rights',sAccId],'');
				continue;
			}

			for(var sFolId in aRights[sAccId]){
				if (!aFolders[sAccId][sFolId])
					Cookie.set(['rights',sAccId,sFolId],'');
			}
		}
	}
	Cookie.get(['rights',sAccId,sFolId],'');


	//FILTER VIEWS
	if (typeof Cookie.get(['views']) == 'object')
		Cookie.set(['views']);


	//FILTER TREE NODES
	var aTree = Cookie.get(['tree']);
	if (Is.Array(aTree) && aTree.length){
		Cookie.set(['tree'], aTree.filter(function(v){

			if (v.indexOf('other/') === 0){
				v = v.substring(6);
			}

			var p = Path.split(v, true);

			if (p.fid.length){

				//check for subdirs
				var bSub = false;
				for(var f in aFolders[p.aid])
					if (f != p.fid && f.indexOf(p.fid + '/') == 0){
						bSub = true;
						break;
					}

				return bSub && aFolders[p.aid] && (aFolders[p.aid][p.fid] || p.fid!='SPAM_QUEUE' || p.fid!='__@@VIRTUAL@@__');
			}
			else
			if (p.aid === 'root::other'){
				return true;
			}
			else
			if (p.aid){
				return aFolders[p.aid];
			}
		}));
	}


	//*** Activate last opened folder ***
	var oActiveFolder = {},
		sActiveFolder = '',
		sFilter = '',
		sInitPage = '';

	if (sPrimaryAccountGUEST || (TeamChatAPI && TeamChatAPI.teamChatOnly())){
		Cookie.set(['filter_tree'], 'I,Y');
		if (Cookie.get(['last']) && Cookie.get(['last'].I)) {
			var __parts = Cookie.get(['last']).I.split('/');
			var __email = __parts.shift();
			var __relative = __parts.join('/');
			var folder = dataSet.get('folders', [__email, __relative]);
			if (folder) {
				oActiveFolder = {aid: __email, fid: __relative};
				sActiveFolder = Cookie.get(['last']).I;
			}
		}
		if (!sActiveFolder) {
			for (var n in aFolders[sPrimaryAccount])
				if (aFolders[sPrimaryAccount][n].TYPE == 'I') {
					oActiveFolder = {aid: sPrimaryAccount, fid: n};
					sActiveFolder = oActiveFolder.aid + '/' + oActiveFolder.fid;
					break;
				}

			if (!sActiveFolder)
				sInitPage = 'h';
		}
	}
	else{

		sInitPage = GWOthers.getItem('LAYOUT_SETTINGS', 'init_page');
		if (gui._REQUEST_VARS['page']){
			var page = gui._REQUEST_VARS['page'].toLowerCase();

			switch(page){
	  			//Special
	 			case 'home':
	 				sInitPage = 'h';
	 				Cookie.set(['filter_tree'], '');
	 				break;

	  			// Mail
	  			case 'inbox':
	 				sInitPage = 'i';
					Cookie.set(['filter_tree'], 'M');
	 				break;

	 			//GW
	 			default:
	 				if (!sPrimaryAccountGW || (page === 'chat' && !sPrimaryAccountCHAT))
	 					break;

					 var filter = {
	 						tasks:'T',
	 						contacts:'C',
	 						documents:'F',
	 						journal:'J',
	 						notes:'N',
	 						calendar:'E',
	 						chat:'I,Y'
	 					}[page];

	 				if (filter && (GWOthers.getItem('RESTRICTIONS', 'disable_gw_types') || '').indexOf(filter)==-1){

						sInitPage = '';
						Cookie.set(['filter_tree'], filter);

						if (page === 'chat') {
							oActiveFolder = {aid: sPrimaryAccount, fid:gui._REQUEST_VARS.RoomID};
							dataSet.add('teamchat', ['forced_last_read_id'], WMItems.__serverID(gui._REQUEST_VARS.PostID || ''));
						}
						else
							oActiveFolder = {aid:sPrimaryAccount, fid:Mapping.getDefaultFolderForGWType(filter)};

						sActiveFolder = oActiveFolder.aid + '/' + oActiveFolder.fid;
					}
			}
		}
	}


	this._draw('frm_main');
	this.dock._onchange = function(b){
		window[b?'addcss':'removecss'](me._getAnchor('container'),'dock');
	};

	/*** BAR MENU ***/
	this._create('bar','obj_barmenu','left');
	this.bar._listen('cookies',['barmenu']);

	//User account
	this.bar._create('top','obj_barmenu_block','top','obj_barmenu_main')._size(0);

	//Favorites
	if (GWOthers.getItem('LAYOUT_SETTINGS', 'favorites') > 0) {
		this.bar._create('fav', 'obj_barmenu_favorites', {target: 'top', first: false}, '', 0, 'FAVORITES::FAVORITES');
	}

	/*** TREE ***/
	this.bar._create('tree','obj_barmenu_block','middle', 'all');
	this.bar.tree._create('slide','obj_slide')._create('1','obj_slide_panel')._create('folders','obj_tree_folder2_context');

	//temporary
	this.bar.tree.folders = this.bar.tree.slide['1'].folders;
	// this.bar.tree.folders._disable_scrolbar(this.bar.tree.folders.__eBody, true, false);

	if (!sPrimaryAccountGUEST){
		var btn = this.bar.tree._create('add_container', 'obj_block', '', 'add_container')._create('btn_add', 'obj_button', '', 'btn_add ico add color1 simple btn_important');
			btn._onclick = function(e){

				var sFolderID = Path.split(dataSet.get('active_folder'));

				//Pass sFolderID only for TeamChat
				if (sFolderID && sFolderID[0] == sPrimaryAccount && sFolderID[1] && ~['I','Y'].indexOf(WMFolders.getType({aid:sPrimaryAccount,fid:sFolderID[1]})))
					sFolderID = sFolderID[1];
				else
					sFolderID = '';

				//Add room focus fix
				try{this._getFocusElement().blur()}catch(r){}

				Folder.addFolder({aid:sPrimaryAccount,fid:sFolderID}, [Folder.openFolder]);
			};
	}

	dataSet.on('active_folder',[],function(){

		var sActiveFolder = dataSet.get('active_folder'),
			aPath = Path.split(sActiveFolder, true),
			sType = WMFolders.getType(aPath);

		if (aPath.aid && aPath.fid == '~')
			this.tree.folders._setActive(aPath.aid);
		else
			this.tree.folders._setActive(sActiveFolder);

		if (sType === "I" || sType === 'Y') {

			this.tree.add_container && this.tree.add_container.btn_add._value('CHAT::ADD_ROOM');

			gui.frm_main.main.text && gui.frm_main.main.text._private();

			//Remove favorites
			this.fav && this.fav._destruct();

			//Add recent switch
			if (!this.top.switch){
				this.top._create('switch', 'obj_button_recent', '', 'switch');
				this.top._size(55);

				this.tree.folders.inp_search._placeholder(getLang('CHAT::FILTER_ROOMS'));
			}

			//Add recent rooms
			if (!this.tree.slide['2']){
				this.tree.slide._create('2', 'obj_slide_panel')._create('recent', 'obj_tree_list');
				this.tree.slide['2'].recent.inp_search._placeholder(getLang('CHAT::FILTER_ROOMS'));
			}

			//Add unsubscribed rooms
			if (!this.tree.slide['3']){
				this.tree.slide._create('3', 'obj_slide_panel')._create('unsubscribed', 'obj_tree_folder2_archive');
				this.tree.slide['3'].unsubscribed.inp_search._placeholder(getLang('CHAT::FILTER_ROOMS'));
			}

			//Select last pane
			var active_groupchat_view = +dataSet.get('cookies', ['active_groupchat_view']);
			if (active_groupchat_view === 2 && !~(dataSet.get('cookies', ['recent']) || []).indexOf(dataSet.get('cookies', ['last', 'I'])))
				active_groupchat_view = 1;

			this.top.switch._value(active_groupchat_view);
		}
		else {

			this.tree.add_container.btn_add._value('MAIN_MENU::ADD_FOLDER');
			this.tree.add_container.btn_add._disabled(false);

			if (this.top.switch) {
				this.top.switch._destruct();
				this.top._size(0);

				this.tree.folders.inp_search._placeholder(getLang('POPUP_FOLDERS::FILTER_FOLDERS'));
			}

			if (!this.fav && GWOthers.getItem('LAYOUT_SETTINGS', 'favorites') > 0)
				this._create('fav', 'obj_barmenu_favorites', {target: 'top', first: false}, '', 0, 'FAVORITES::FAVORITES');

			this.tree.slide._value('1');
			this.tree.folders.btn_all._disabled(sPrimaryAccountGUEST || (TeamChatAPI && TeamChatAPI.teamChatOnly()));

			if (this.tree.slide['2'])
				this.tree.slide['2']._destruct();

			if (this.tree.slide['3'])
				this.tree.slide['3']._destruct();
		}

	}, this.bar);



	// Create show all folders toggle button
	this.bar.tree.folders._create('btn_all','obj_button','search','simple noborder transparent ico img all');
	if (sPrimaryAccountGUEST || (TeamChatAPI && TeamChatAPI.teamChatOnly()))
		this.bar.tree.folders.btn_all._disabled(true);
	else{
		this.bar.tree.folders.btn_all._title('COMMON::SHOW_ALL');
		this.bar.tree.folders.btn_all._onclick = function(){
			if(hascss(this._main,'active')) {
				// Unclick, show folder beloning to currently active folder
				var aFolder = Path.split(dataSet.get('active_folder'));
				if(aFolder[1]) {

					var sType = WMFolders.getType(aFolder);

					switch(sType) {
					case 'QL':
					case 'G':
						sType = 'B';
					case 'M':
						if (GWOthers.getItem('DEFAULT_FOLDERS','trash').split('/')[1] == aFolder)
							sType = 'B';
					case 'C':
					case 'E':
					case 'F':
					case 'N':
					case 'T':
					case 'I':
						gui.frm_main.filter.__filter(sType);
						removecss(this._main,'active');
						break;
					}
				}
			} else {
				// Click, show all available folders
				addcss(this._main,'active');
				gui.frm_main.filter.__filter('A');
			}
			Cookie.set(['show_all_folders'], +hascss(this._main,'active'));
		};
	}

	// Add new folder to tree
	// this.bar.tree.folders._create('btn_add','obj_button','search','simple noborder transparent ico img add');
	// if (sPrimaryAccountGUEST)
	// 	this.bar.tree.folders.btn_add._disabled(true);
	// else{
	// 	this.bar.tree.folders.btn_add._title('POPUP_FOLDERS::ADD_FOLDER');
	// 	this.bar.tree.folders.btn_add._onclick = function(){
	// 		var sFolderID = gui.frm_main.bar.tree.folders._getActive();
	// 		if (sFolderID && sFolderID[1])
	// 			sFolderID = sFolderID[1];
	// 		else
	// 			sFolderID = '';

	// 		Folder.addFolder({aid:sPrimaryAccount,fid:sFolderID}, [Folder.openFolder]);
	// 	};
	// }

	/*** SET LAYOUT SIZE ***/
	this._changeViewSize(GWOthers.getItem('LAYOUT_SETTINGS', 'compact_view') || "0", true);

	/*** TOP MENU 1 ***/
	this._create('hmenu1','obj_hmenu_basic','menu1','obj_hmenu_basic');
	//this._create('hmenu3','obj_hmenu_basic2','menu2','obj_hmenu_basic2');

	/*** TOP TOOLBAR 1 ***/
	this._create('toolbar','obj_hmenu_toolbar','toolbar1','transparent');

	//// logout ////
	this._create('preview','obj_hmenu_preview','menu3');
	this._create('density','obj_hmenu_density','menu3');
	this._create('notifications','obj_hmenu_notifications','menu3');
	this._create('stat','obj_hmenu_status','menu3','obj_hmenu_status');

	//// search (with auto-resize events) ////
	this.search = this._create('search','obj_item_search','menu2');

	function toggleSearch(e){
		if (me.search._main.classList.contains('collapsed')) {
			me.search._main.classList.remove('collapsed');
			me.search.search._focus();
		} else if(e.offsetX > 120 && !me.search._value()) {
			me.search._main.classList.add('collapsed');
		}
	};

	this.search.search._obeyEvent('change', [function(e, arg){
		if (arg.owner._value().length){
			toggleSearch({});
		}
	}]);
	this.search._main.addEventListener('click', toggleSearch);

	this.search._tabIndex();
/*
	this.search.__transend = function(){
		if (me.search.search.suggest)
			try{
				var pos = getSize(me.search.search._main);
				me.search.search.suggest._main.style.width = pos.w + 'px';
				me.search.search.suggest._main.style.left = pos.x + 'px';
			}
			catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r)}
	};
	this.search.__resize = function(){
		if (me.search.search._value()){

			if (me.search._main.addEventListener){
				me.search._main.addEventListener('transitionend', me.search.__transend);
				me.search._main.addEventListener('oTransitionEnd', me.search.__transend);
				me.search._main.addEventListener('webkitTransitionEnd', me.search.__transend);
			}

			gui._obeyEvent('resize',[me.search,'__resize2']);
			me.search.__resize2();
		}
		else{
			addcss(me.search._main,'anim');
			gui._disobeyEvent('resize',[me.search,'__resize2']);
			me.search._main.style.width = '';
		}
	};
	this.search.__resize2 = function(e){

		if (e) removecss(me.search._main,'anim');

		var w = 282;

		//resize input
		// if (gui.frm_main.hmenu3){
		// 	var pos1 = getSize(gui.frm_main.hmenu3._main),
		// 		pos2 = getSize(me.search._main);

		// 	w = (pos2.x + pos2.w) - (pos1.x + pos1.w) - 10;
		// 	w = w>282?282:(w<200?200:w);
		// }

		me.search._main.style.width = w + 'px';

		//resize suggest
		me.search.__transend();
	};
*/
	if(this.search.__resize) {
		this.search.search._obeyEvent('onkeyup',[this.search.__resize]);
		this.search.search._obeyEvent('change',[this.search.__resize]);
	}

	//// resize interface ////
	this._initResize();

	//// IM ////
	if (window.sPrimaryAccountIM && (GWOthers.getItem('RESTRICTIONS', 'disable_im') || 0)<1) {
		// Create IM object
		this._create('im','obj_im','im');
		//IM Autologin performed by obj_im constructor
		//Show IM dock action performed by obj_hmenu_status
	}

	//// Auto-Start SIP ////
	if (window.sPrimaryAccountSIP && (GWOthers.getItem('RESTRICTIONS', 'disable_sip') || 0)<1) {
		//SIP Autologin
		if (GWOthers.getItem('SIP','mode')=='integrate' && GWOthers.getItem('SIP','start')>0)
			this.__sipAutoLogin = setTimeout(function(){
				if (me && GWOthers.getItem('SIP','start')>0 && !me.sip)
					me._create('sip','obj_sip');
			},GWOthers.getItem('SIP','webrtc')==1 ? 2000 : 15000);
	}

	if (!sActiveFolder){

		if (sInitPage == 'r'){
			if (sActiveFolder = Cookie.get(['last_folder'])){
				var aTmp = Path.split(sActiveFolder);

				if (WMFolders.getType(aTmp) == 'X')		//if (!aFolders[aTmp[0]] || (aTmp[1] && !aFolders[aTmp[0]][aTmp[1]]))
					sActiveFolder = '';
				else{
					oActiveFolder.aid = aTmp[0];
					if (aTmp[1])
						oActiveFolder.fid = aTmp[1];
				}
			}
			else {
				sActiveFolder = sPrimaryAccount+'/INBOX';
				oActiveFolder = {'aid':sPrimaryAccount,'fid':'INBOX'};
			}
		}
		else
		if (sInitPage == 'i'){
			sActiveFolder = sPrimaryAccount+'/INBOX';
			oActiveFolder = {'aid':sPrimaryAccount,'fid':'INBOX'};
		}

		if (!sActiveFolder || sInitPage == 'h'){
			sActiveFolder = sPrimaryAccount;
			oActiveFolder = {'aid':sPrimaryAccount};
		}
	}

	// this.bar.tree.folders._setActive(sActiveFolder);
	this.bar.tree.folders._handleNode(oActiveFolder);

	//Set Filter
	sFilter = ((TeamChatAPI && TeamChatAPI.teamChatOnly() && 'I,Y') || Cookie.get(['filter_tree']) || WMFolders.getType(oActiveFolder));

	if (!Is.String(sFilter) || sFilter == 'X')
		sFilter = 'M';

	if (sFilter == 'M' || (sInitPage == 'i' && sFilter.indexOf('M')<0))
		sFilter = 'M,R,QL,Q';
	else
	if (sFilter == 'B')
		sFilter = 'B,G,QL,Q';
	else
	if (sFilter == 'E')
		if (dataSet.get('folders',[sPrimaryAccount,'__@@VIRTUAL@@__/__@@EVENTS@@__'])){
			dataSet.add('active_folder','',sPrimaryAccount + '/__@@VIRTUAL@@__/__@@EVENTS@@__',true);
		}
		else{
			sFilter = '';
			Cookie.set(['filter_tree'],'');
		}

	if (sFilter){
		this.bar.tree.folders._filter_folder(sFilter.split(','));
		this.bar.tree.folders._fill();
	}

	if(+Cookie.get(['show_all_folders'])) {
		this.bar.tree.folders.btn_all._active(true);
		gui.frm_main.filter.__filter('A');
	}

	if (gui._REQUEST_VARS['page'] === 'chat' && sPrimaryAccountCHAT) {
		gui.frm_main.filter.__filter('I');
	}

	//*** Set page title = account ***
	this._title();

	// [ASync] Refresh after login
	if (oWM_INIT && !oWM_INIT.__refreshed)
		this._getNew(true);



	//Add destructor because of SIP
	this._add_destructor('__onDestruct');

	//// Reminders ////
	if (sPrimaryAccountGW){
		this.__RMN_get();
		this.__rmnInterval1 = setInterval(function(){ me.__RMN_get() },600000);
		// check reminders every 60 seconds
		this.__rmnInterval2 = setInterval(function(){ me.__RMN_check() },20000);
	}

	//// Activity Monitoring
	if (GWOthers.getItem('LAYOUT_SETTINGS','activity')>0 && !gui._REQUEST_VARS['tconly']){
		var activity_last = new IcewarpDate(),
			activity_time = parseInt(GWOthers.getItem('LAYOUT_SETTINGS','activity'),10);
		activity_time = (activity_time>5?activity_time:5)*60;

		this.__activity = function(){
			activity_last = new IcewarpDate();
		};

		//Bind events
		gui._obeyEvent('click',[this,'__activity']);
		gui._obeyEvent('mousemove',[this,'__activity']);
		gui._obeyEvent('focus',[this,'__activity']);

		//Check for Activity
		setInterval(function(){
			if ((new IcewarpDate()).unix() - activity_last.unix()>activity_time)
				me.__logout(true);
		},60000);
	}

	function whatsNew (){
		if (GWOthers.getItem('GLOBAL_SETTINGS','disable_whatsnew') != '1' && (!TeamChatAPI || !TeamChatAPI.teamChatOnly())) {
			var tmp = (GWOthers.getItem('LOGIN_SETTINGS', 'version') || '').split('.');
			if (Cookie.get(['whatsnew']) != tmp[0]+'.'+tmp[1]+'.'+tmp[2])
				setTimeout(function(){
					// Display whats new popup one second after login
					gui._create('whatsnew','frm_whatsnew');
					// If my details popup is display, focus that to show first
					if (gui.gw) gui.gw._focus();
				},1000);
		}
	};

	// Expired Account warning check
	if (dataSet.get('accounts',[sPrimaryAccount,'PASSEXPIRED']))
		gui._create('expired','frm_changepass','','', [whatsNew] ,true);
	// Show What's New popup if not disabled or already shown for this version
	else
		whatsNew();

	// Force user to enter personal data if set by admin
	if (GWOthers.getItem('RESTRICTIONS','mandatory_user_info') == '1' && Cookie.get(['suppressmandatory'])!=1) {
		Item.openwindow([sPrimaryAccount, '@@mycard@@','@@mycard@@'], '', '', 'C', null, [
			function(frm){
				frm._closable(false);
				frm._modal(true);
				frm._title("POPUP_ITEMS::MANDATORYDETAILS");

				// Strict checking of fields, no cancel
				if (GWOthers.getItem('GLOBAL_SETTINGS','mandatory_contact_fields')) {
					if (frm.x_btn_cancel)
						frm.x_btn_cancel._main.style.display = 'none';
				}
				else
					Cookie.set(['suppressmandatory'],1);
			}
		]);
	}


	//Handle "open" url parameter
	if (gui._REQUEST_VARS['open']){
		var sFolder = Path.basedir(gui._REQUEST_VARS['open']),
			sRID = WMItems.__clientID(Path.basename(gui._REQUEST_VARS['open']));

		if (sFolder && sRID){
			WMItems.list({aid:sPrimaryAccount, fid:sFolder, rid:sRID}, '','','',[function(aData){
				if (aData && (aData = aData[sPrimaryAccount]) && (aData = aData[sFolder])){
					for (var i in aData)
						if (aData[i].aid){

							var aPath = [sPrimaryAccount, sFolder, i];

							//M
							if (WMFolders.getType(aPath) == 'M'){
								//Draft
								if (GWOthers.getItem('DEFAULT_FOLDERS', 'drafts') == sPrimaryAccount+'/'+sFolder)
									OldMessage.edit(aPath);
								//Mail
								else
									OldMessage.openwindow(aPath);
							}
							//GW
							else
								Item.openwindow(aPath);

							break;
						}
				}
				else{
					//invalid path;
				}
			}]);
		}
		else{
			//invalid attr
		}
	}

	if (gui._REQUEST_VARS.telemetry)
		gui._create('frm_telemetry','frm_telemetry');

	//Registr Drop for Tree Auto-Expanding
	this.dnd.registr_drop(this, ['item','folder']);

	//////////////// DEV /////////////////
	//if (gui._REQUEST_VARS['frm'] != 'main') return;

	// var f = gui._create('test','obj_popup'),
	// 	i = mkElement('input',{type:'file'});

	// 	f._getAnchor('main').appendChild(i);

	// var b = f._create('b','obj_button','footer');
	// 	b._onclick = function(){
	// 		i.click();
	// 	}


	// gui._create('f','obj_popup')._create('inp','obj_smart_input','','max');
	// gui.f.inp._placeholder('some placeholder');

	this.__prepareTopBanner();
	this.__prepareIMBanner();

	function hashChangeHandler(arg) {
		var view = (arg.hash.match(/view=(\w+)/) || [])[1];
		var filter = view && gui.frm_main.filter._main.querySelector('.' + view);
		filter && filter.click();
	}

	this._create('hash','hash');
	this.hash._obeyEvent('hashchange', [hashChangeHandler]);
	hashChangeHandler({
		hash: this.hash._getHash()
	});

	gui._obeyEvent('folderSelected', [this, '__select_handler',['folder']]);
	gui._obeyEvent('itemSelected', [this, '__select_handler',['item']]);

	//jitsi
	this._create('jitsi', 'frm_jitsi', 'self', '');
	gui._obeyEvent('conference_started', [this, '_updateConferenceTopBar']);
	gui._obeyEvent('conference_ended', [this, '_updateConferenceTopBar']);
};

_me._updateConferenceTopBar = function(){
	gui.frm_main._main.classList[dataSet.get('main', ['conference']) ? 'add' : 'remove']('conference_in_progress');
};

_me.__select_handler = function(aData,e,sType){
	if (sType !== 'item' || aData.length == 3)
		this._main.setAttribute('selected', sType);
};

// _me._createObjHmenuBasic2 = function(){
// 	this.hmenu1 && this.hmenu1._destruct();
// 	this._create('hmenu1','obj_hmenu_basic','menu1','obj_hmenu_basic');
// 	this._getAnchor('menu1').insertBefore(this.hmenu1._main, this._getAnchor('menu1').firstChild);
// };

_me._active_dropzone = function(v){
	var l = this._getAnchor('left');

	if (v)
		removecss(l, 'small');
	else
	if (!l.__keep)
		addcss(l, 'small');

	return false;
};

/**
 * SIP
 **/
_me._call = function(n, bVideo, bExt, bScreen){
	// Do not allow making any calls when conference is running
	if (gui.conference) {
		gui.notifier._value({type: 'alert', args: {header: 'MAIN_MENU::CONFERENCE', text: 'CONFERENCE::NOCALLALLOWED'}});
		return false;
	}

	if (n)
		//Direct Call over SIP
		if (!bExt && this.sip){
			if (dataSet.get('sip',['state']) == 'online')
				this.sip._call(n,bVideo,bScreen);
			else
				this.sip._login(function(bOK){
					if(bOK)
						gui.frm_main.sip._call(n,bVideo,bScreen);
					else
						gui._create('alert', 'frm_alert', '', '', '', 'SIP::ERROR', 'SIP::REGISTRATION_FAILED');
				});
		}
		else
		//Open Dial, fill number and login to SIP
		if (!bExt && window.sPrimaryAccountSIP && (GWOthers.getItem('RESTRICTIONS', 'disable_sip') || 0)<1 && GWOthers.getItem('SIP', 'mode') == 'integrate'){
			this._create('sip','obj_sip','','',function(bOK){
				if(bOK)
					gui.frm_main.sip._call(n,bVideo,bScreen);
				else
					gui._create('alert', 'frm_alert', '', '', '', 'SIP::ERROR', 'SIP::REGISTRATION_FAILED');
			});
		}
		//Direct Call over External
		else{
			storage.library('wm_messages');
			message.dial(n,[function(bOK){
		 		if (bOK && gui.notifier)
					gui.notifier._value({type: 'sip_external'});
			}]);
		}
};

/**
 * Load TAGs into DataSet
 **/
_me._loadTags = function(bSynchro){
	if (sPrimaryAccountGW){
		if (bSynchro)
			this.__parseTags(WMItems.list({aid:sPrimaryAccount,fid:'__@@TAGS@@__'}));
		else
			WMItems.list({aid:sPrimaryAccount,fid:'__@@TAGS@@__'},'','','',[this,'__parseTags']);
	}
};
_me.__parseTags = function(aData){
	var aOut = {};

	if (aData[sPrimaryAccount] && (aData = aData[sPrimaryAccount]['__@@TAGS@@__'])){

		delete aData['/'];
		delete aData['#'];
		delete aData['$'];
		delete aData['@'];

		var sColor;
		for (var i in aData)
			if (aData[i].TAGNAME){
				if (aData[i].TAGCOLOR)
					sColor = colors.fast_contrast(aData[i].TAGCOLOR);
				else
					sColor = '#000000';

				aOut[aData[i].TAGNAME] = {TAGNAME:aData[i].TAGNAME, TAGCOUNT:aData[i].TAGCOUNT, TAGCOLOR:aData[i].TAGCOLOR,TEXTCOLOR:sColor,ID:i};
			}
	}

	dataSet.add('tags','',aOut);
};


_me._changeViewSize = function(v, bNoSave) {
	document.body.className = document.body.className.replace('compact', '');
	document.body.className = document.body.className.replace('small', '');
	gui.frm_main.main && gui.frm_main.main.list && (gui.frm_main.main.list._original_height = 33);

	var rows = 2.8;

	switch(+v) {
		case 1:
			rows = 2;
			addcss(document.body, 'small');
			break;
		case 2:
			rows = 1;
			addcss(document.body, 'compact');
			gui.frm_main.main && gui.frm_main.main.list && (gui.frm_main.main.list._original_height = 25);
			break;
	}

	if (gui.dial) {
		gui.dial._list_options.rows = rows;
		gui.dial.list._small(gui.dial._list_options);
		gui.dial.list._serverSort();
	}

	if (!bNoSave){
		//gui.frm_main._getNew();
		if (gui.frm_main.main && gui.frm_main.main.list)
			gui.frm_main.main && gui.frm_main.main.list._serverSort();
	}

};

/**
	 * activate registred dropzones
	 * 28.6.2011 14:21:02
	 **/
_me.__file_dragover = function(e){

	for (var i = 0;i<this.__dropzones.length;i++)
	// Activate dropzone
		if (this.__dropzones[i] && !this.__dropzones[i]._destructed && this.__dropzones[i]._pathName && Is.Function(this.__dropzones[i]._showDropZone))
			this.__dropzones[i]._showDropZone(e);
		// Auto-Remove dropzone
		else
			    this.__dropzones.splice(i,1);
};

/**
	 *	Registr obj with dropzone,
	 *	obj._showDropZone(e) metod of such object will be called by dragover event
	 *	28.6.2011 14:14:57
	 **/
_me._registr_dropzone = function(obj){
	if (obj && !obj._destructed && Is.Function(obj._showDropZone)){
		for (var i = 0;i<this.__dropzones.length;i++)
			if(this.__dropzones[i]===obj) return true;

		this.__dropzones.push(obj);
		return true;
	}
	return false;
};

_me._remove_dropzone = function(obj){
	this.__dropzones = this.__dropzones || [];
	for (var i = 0;i<this.__dropzones.length;i++)
		if (this.__dropzones[i]===obj){
			this.__dropzones.splice(i,1);
			break;
		}
};

_me._title = function(sFolder,iSelected,iTotal){
	if (this.title){
		var sOut = '', aAccount, sPgTitle = GWOthers.getItem('LAYOUT_SETTINGS','title') || '';

		if ((aAccount = dataSet.get('accounts',[sPrimaryAccount]))){

			if (sFolder){
				sOut += sFolder;

				if (iTotal>0)
                	sOut += ' ['+(iSelected>0?iSelected+'/':'')+iTotal+']';

				sOut += ' - ';
			}

			this.title._add(sOut + (sPgTitle ? sPgTitle + ' - ' : '') + MailAddress.createEmail(aAccount.FULLNAME, sPrimaryAccountGUEST ? aAccount.USERNAME : sPrimaryAccount, true));
		}
	}
};


//Request for reminder list
_me.__RMN_get = function(){
	if(TeamChatAPI && TeamChatAPI.teamChatOnly()){
		return;
	}
	if (gui.__online){

		var iReminder = parseInt(Cookie.get(['reminders']),10),
			iDate = (new IcewarpDate()).format(IcewarpDate.JULIAN);

		if (!Is.Number(iReminder) || iReminder<iDate-7)
			iReminder = iDate-7;
		else
		if (iReminder>=iDate)
			iReminder = iDate-1;

		WMItems.list({aid:sPrimaryAccount,fid:'__@@REMINDERS@@__',values:['CTZ'],filter:{INTERVAL:iReminder+ '-' +(iDate+1)}},'','','',[this,'__RMN_parse']);
	}
	else{
		var d = new IcewarpDate();
		//	if (tStemp>0)
		//		d= IcewarpDate.unix(tStemp);

		Cookie.set(['reminders'],d.format(IcewarpDate.JULIAN));
	}
};

//Check for incoming reminders (executed every 1min)
_me.__RMN_check = function(bShow){
	var iTame = (new IcewarpDate()).unix(),
		aData = dataSet.get('reminders'),
		out = {},
		eventId;

	if (aData){
		for(var i in aData)
			    if (aData[i].unix<iTame)
				out[aData[i].sha1] = aData[i];

		if (!Is.Empty(out))
			if (bShow || gui.frm_reminder){
				if (!gui.frm_reminder) {
					gui._create('frm_reminder','frm_reminder');

					for (eventId in out) {
						gui.notifier._value({type: 'reminder', args: [out[eventId]]});
					}
				}

				gui.frm_reminder._fill(out);

				// If mandatory contact info is needed put it in front of reminders
				if(gui.gw && gui.gw._isModal())
					gui.gw._focus(true);

			}
			else
				this.__RMN_get();
	}

	// if (gui.frm_reminder && !gui.frm_reminder._destructed)
	//  	gui.frm_reminder._destruct();
};
//Parse RMN list into dataset
_me.__RMN_parse = function(aData){
	if (Is.Object(aData)){
		storage.library('sha1');

		var aOut = [], tStemp = 0;
		for (var i in aData)
			    for (var j in aData[i]){

				delete aData[i][j]['/'];
				delete aData[i][j]['#'];
				delete aData[i][j]['$'];
				delete aData[i][j]['@'];

				for (var k in aData[i][j]){

					if (!tStemp || tStemp>aData[i][j][k].REMINDERUNIXTIME)
						tStemp = aData[i][j][k].REMINDERUNIXTIME;

					aOut.push({
						aid:sPrimaryAccount,
						fid:aData[i][j][k].EVNFOLDER,
						iid:WMItems.__clientID(aData[i][j][k].EVN_ID),
						startdate:aData[i][j][k].EVNSTARTDATE,
						starttime:aData[i][j][k].EVNSTARTTIME,
						conferenceid:aData[i][j][k].EVNMEETINGID?parseInt(aData[i][j][k].EVNMEETINGID):'',
						organizer:aData[i][j][k].EVNORGANIZER,
						unix:aData[i][j][k].REMINDERUNIXTIME,
						rid:k,
						sha1:SHA1(k),
						'class':aData[i][j][k].EVNCLASS,
						'title':aData[i][j][k].EVNTITLE
					});
				}
			}

			//Sort by REMINDERUNIXTIME ASC
		aOut = aOut.sort(function(a,b){return a.unix - b.unix});

		var d = new IcewarpDate();
		if (tStemp>0)
			d = IcewarpDate.unix(tStemp);

		Cookie.set(['reminders'],d.format(IcewarpDate.JULIAN));

		dataSet.add('reminders','',aOut,true);

		this.__RMN_check(true);
	}
};

_me.__onDestruct = function (){
	//kill sip autologin timeout
	if (this.__sipAutoLogin)
	    clearTimeout(this.__sipAutoLogin);

	//destruct SIP before itself
	if (gui.dial)
		gui.dial._destruct();

	if (this.sip)
		this.sip._destruct();

	//clear reminder intervals
	if (sPrimaryAccountGW){
		clearInterval(this.__rmnInterval1);
		clearInterval(this.__rmnInterval2);
	}
};

/**
 * GetNew (Get New button)
 *
 * @param Boolean bMain True when called from startup, 1 when called from automatic refresh
 **/
_me._getNew = function(bMain){
	var aAccounts = dataSet.get('accounts');

	if (!aAccounts || !gui.__online) return;

	var disable_other = (GWOthers.getItem('RESTRICTIONS','disable_otheraccounts') == 1);

	if (!Is.Empty(this.__refreshFolderTimeout)) {
		Object.keys(this.__refreshFolderTimeout).forEach(function(s){
			clearTimeout(s);
		});
		this.__refreshFolderTimeout = {};
	}

	for(var sAccId in aAccounts){
		if (!aAccounts[sAccId] || (disable_other && !aAccounts[sAccId]['PRIMARY'] && aAccounts[sAccId]['TYPE']!='rss'))
			continue;

		accounts.refresh({'aid':sAccId},'folders','',[gui.frm_main,'_refreshItems',[sAccId]]);
	}
};

/**
 * refreshne pravou stranu je-li refreshovan account s prave aktivnim adresarem
 **/
_me._refreshItems = function(sAccId)
{
	var aSelected = this.bar.tree.folders._getActive();
	if (aSelected[0] == sAccId && aSelected[1])
	{
		var sFolID = aSelected[1];
		if (WMFolders.getType([sAccId,sFolID]) != 'X')
			this.bar.tree.folders._handleNode({'aid':sAccId,'fid':sFolID},true);
		else{
			dataSet.remove('items');
			dataSet.remove('preview');

			this.bar.tree.folders._handleNode({'aid':sPrimaryAccount,'fid':'~'},true);
		}
	}

	//refresh itemview if __reloadme == true (F, Lock by doc converting)
	var id;
	if (gui.frm_main.main && gui.frm_main.main.itemview && gui.frm_main.main.itemview.__reloadme && (id = gui.frm_main.main.itemview.__activeItemID) && id[0] == sAccId)
		Item.open(id,'','','',true);
};

/**
 * dataSet:current_folder	is changed before rendering
 * dataSet:active_folder	is changed after rendering
 */
_me._selectView = function(aFolder,sView,bUpdate,oDate,bForceUpdate,sSearch,bNoTreeUpdate){
	// promazat datasety
	dataSet.remove('items','',true);

	if (sView === 'work_view') {
		sView = 'workweek_view';
	}
	if (this._lastView === 'work_view') {
		this._lastView = 'workweek_view';
	}

	// HomePage
 	aFolder = aFolder || {};
	if (!aFolder['fid']){

		if(!aFolder['aid'])
			aFolder['aid'] = sPrimaryAccount;

		aFolder['fid'] = '~';
	}

	//Ziskat pohled a jeho nastaveni
	var aView = Cookie.get(['views',aFolder.aid,aFolder.fid]),
		sFolType = aView.type;

	if (sFolType === 'E' && aView.view === 'work_view') {
		aView.view = 'workweek_view';
	}
	else
	if (sFolType === 'I' && aView.view) {
		aView.view = 'chat_view';
	}

	if (sView && aView.view != sView){
		if (sFolType == 'E' && sView.indexOf('list') == 0)
			Cookie.set(['views',aFolder['aid'],aFolder['fid'],'prev'],{'list_view':'1','list_wide':'2'}[sView]);

		Cookie.set(['views',aFolder['aid'],aFolder['fid'],'view'],sView);
	}
	else
	if (sFolType == 'X')
		sView = 'nothing';
	else
		sView = aView.view;

	if (sView != this._lastView){
		gui.__exeEvent('viewSelected', sView);
		this._main.setAttribute('view', sView || '');
	}

	// After creating lists, fill middle menu on top
	var bNewFolder = false;
	if (dataSet.get('current_folder') != aFolder['aid'] + '/' + aFolder['fid'] || this._lastView != sView){
		bNewFolder = true;
		dataSet.add('current_folder','',aFolder['aid'] + '/' + aFolder['fid']);
	}

	//Změnil se pohled?
	if (sView != this._lastView || (sView!='month_view' && bForceUpdate))
	{
		//Změnil se pohled v rámci stejného objektu?
		if ((sView == 'day_view' || sView =='week_view' || sView =='workweek_view') && (this._lastView == 'day_view' || this._lastView =='week_view' || this._lastView =='workweek_view'))
		{
			//NEni li zadan Date veme se range[start] z obj_evnview nebo dnesni den
			if (!oDate){
				var oDate = new IcewarpDate();
				if (this.main.calendar._selection && this.main.calendar._selection.startdate){
					 oDate = IcewarpDate.julian(this.main.calendar._selection.startdate);
				}
				else if (this.main.calendar.__allDaySelection && this.main.calendar.__allDaySelection.startdate){
					oDate = IcewarpDate.julian(this.main.calendar.__allDaySelection.startdate);
				}else {
					var aRange = this.main.calendar._range();
					if (aRange['start']){
						oDate = IcewarpDate.julian(aRange['start']);
					}
				}
			}
		}
		else {
			if (this.main){
				if (this._lastView == 'day_view' || this._lastView == 'week_view' || this._lastView == 'workweek_view' || this._lastView == 'month_view')
					oDate = oDate || this.main._getDate();
				else
					oDate = new IcewarpDate();

				this.main._destruct();
			}
			else
				oDate = new IcewarpDate();

			switch(sView){

			case 'mail_view':
			case 'mail_view_wide':
			case 'mail_view_list':
				dataSet.remove('preview');
				this._create('main',{
					mail_view:'frm_main_mail',
					mail_view_wide:'frm_main_mail_wide',
					mail_view_list:'frm_main_mail_list'}[sView]);

				break;

			case 'list':
			case 'list_wide':
			case 'list_view':
				dataSet.remove('preview');
				this._create('main',{
					list:'frm_main_datagrid',
					list_wide:'frm_main_datagrid_wide',
					list_view:'frm_main_datagrid_view'
				}[sView]);
				break;

			case 'day_view':
			case 'week_view':
			case 'workweek_view':
				this._create('main','frm_main_calendar_dayweek','','','items');
				break;
			case 'month_view':
				this._create('main','frm_main_calendar_month','','','items',oDate);
				break;

			case 'chat_view':
				this._create('main','frm_main_chat','','','items');
				break;

			case 'conference_view':
				this._create('main','frm_main_conference');
				break;

			case 'nothing':
			default:
				this._create('main','frm_main_home');
				break;
			}
		}

		if (gui.frm_main.main && gui.frm_main.main.list && (GWOthers.getItem('LAYOUT_SETTINGS', 'compact_view') == 2)) {
			gui.frm_main.main.list._original_height = 25;
		}

		//Search
		if (this.main && this.main._showsearch)
			this.main._showsearch(aFolder, sView=='list_view' || sView=='list' || sView=='list_wide' || sView=='frm_main_mail' || sView=='frm_main_mail_wide' || sView=='frm_main_mail_list', sSearch);

	}
	else{
		switch(sView){
		case 'day_view':
		case 'workweek_view':
		case 'week_view':
			//NEni li zadan Date veme se range[start] z obj_evnview nebo dnesni den
			if (!oDate){
				oDate = new IcewarpDate();
				if (this.main.calendar._selection && this.main.calendar._selection.startdate){
					oDate = new IcewarpDate(this.main.calendar._selection.startdate, {format:IcewarpDate.JULIAN});
				} else{
					var aRange = this.main.calendar._range();
					if (aRange['start']){
						oDate = new IcewarpDate(aRange['start'], {format:IcewarpDate.JULIAN});
					}
				}
			}
		}

		//Search
		if (this.main && this.main._showsearch && dataSet.get('active_folder') != aFolder['aid'] + '/' + aFolder['fid']){
			this.main._showsearch(aFolder, sView=='list' || sView=='list_view' || sView=='list_wide', sSearch);
		}
	}

	if (bNewFolder){
		dataSet.add('active_folder', '', aFolder['aid'] + '/' + aFolder['fid'], bNoTreeUpdate);
	}

	removecss(this._getAnchor('menu2'), 'hidden');
	// Sort list items if necessary
	var bSelectFolder = true;
	switch(sView){
	case 'nothing':
	case 'home':
		break;

	case 'conference_view':
		this.main._serverSort();
		if(dataSet.get('accounts',[sPrimaryAccount, 'MEETING_PROVIDER']) !== 'jitsi') {
			addcss(this._getAnchor('menu2'), 'hidden');
		}
		break;

	case 'day_view':
	case 'week_view':
	case 'workweek_view':
		this.main._setDate(oDate,sView == 'day_view'?1:7,sView=='workweek_view');
		this.main._serverSort(sView);
		break;

	case 'chat_view':
	case 'month_view':
		this.main._serverSort(sView);
		break;

	// Máme preview pohled?
	case 'mail_view':
	case 'mail_view_wide':
	case 'list_view':
	case 'list_wide':
		var aActiveMails = dataSet.get('active_items');
		if (!aActiveMails || !aActiveMails[aFolder['aid']] || !aActiveMails[aFolder['aid']][aFolder['fid']])
			dataSet.remove('preview');

		if (this.main.list){
			this.main.list._serverSort(aFolder,aView['sort']['column'],aView['sort']['type'],[this,'__synchroDatasetHandler',[aFolder['aid'],aFolder['fid'], !!aFolder.elm]]);
			bSelectFolder = false;
		}

		//force resize
		if (bNewFolder)
			gui.__exeEvent('resize');

		break;

	default:
		if (this.main.list){
			this.main.list._serverSort(aFolder,aView['sort']['column'],aView['sort']['type'], [this,'__taskReminderBellIconTooltip']);
			bSelectFolder = false;
		}
	}

	//this._main.setAttribute('view', sView || '');
	this._lastView = sView;

	if (bSelectFolder || aFolder.elm){
		gui.__exeEvent('folderSelected',aFolder);
	}

	// Set title for groupchat (no datagrid, not handled automatically)
	// if (sView=='chat_view') {
	// 	this.main._createRoomsStatus(aFolder);
	// 	this._title(dataSet.get('folders', [aFolder['aid'], aFolder['fid'], 'NAME']) || aFolder['fid'].split('/').pop());
	// }

	//zapsat do cookies last folder
	if (GWOthers.getItem('LAYOUT_SETTINGS','init_page')=='r'){
		Cookie.set(['last_folder'],aFolder['aid'] + '/' + aFolder['fid']);
	}

	//this.hash._setHash(dataSet.get('active_folder'), true);
	return bNewFolder;
};

_me.__taskReminderBellIconTooltip = function() {
	// load reminder on mouseenter over bell icon
	var me = this;
	setTimeout(function() {
		if(!me.main.list) {
			return;
		}
		[].forEach.call(me.main.list._main.querySelectorAll('.col_TASK_STARTDATE, .col.reminder .reminder'), function(elm) {
			if(!elm._mouseenter) {
				elm.addEventListener('mouseenter', function(e) {
					if(elm._mouseenter < 2) {
						var id = gui.frm_main.main.list._aData[e.target.getAttribute('id').split('/')[1]].arg;
						WMItems.list(id, '', '', '', [function(data) {
							var reminders = data[id.aid][id.fid][id.iid].REMINDERS;
							for(var i in reminders) {
								if(+reminders[i].values.RMNTIME) {
									e.target && e.target.setAttribute('title', IcewarpDate.unix(reminders[i].values.RMNTIME).format('DD/MM/YYYY HH:mm'));
									break;
								} else if(reminders[i].values.RMNMINUTESBEFORE) {
									e.target && e.target.setAttribute('title', frm_event2.prototype._reminderObjectToText(reminders[i]));
									break;
								}
							}
						}]);
						elm._mouseenter = 2;
					}
				});
				elm._mouseenter = 1;
			}
		});
	}, 50);
};

/* pokud je posledni aktivni email v danem folderu otevre ho v mailview */
_me.__synchroDatasetHandler = function(sAccId,sFolId,bNoSelect)
{
	var sActiveItem = dataSet.get('active_items', [sAccId, sFolId]);
	var preselected = false;
	var aItems = dataSet.get('items', [sAccId, sFolId]);

	if(!sActiveItem) {
		preselected = Object.keys(aItems).some(function (v) {
			if (v.indexOf('*') === 0) {
				sActiveItem = v;
				return true;
			}
		});
	}

	this.__taskReminderBellIconTooltip();

	if (sActiveItem){
		//check if folder is blank
		if (!aItems || !parseInt(aItems['/'] || 0)){
			dataSet.remove('active_items', [sAccId, sFolId]);
			dataSet.remove('preview');
			return;
		}

		//Select item in List
		if (this.main.list){
			var v = this.main.list._value();
			if (!v.length || (aItems && !aItems[v[0]])){
				this.main.list._value([sActiveItem], false, false, bNoSelect);
			}
		}

		//Open item in mailview
		if (this.main.mailview) {
			var keep_seen = dataSet.get('active_items', [sAccId, sFolId]);
			if (preselected) {
				clearTimeout(this.__mark_as_read_timeout);
				this.__mark_as_read_timeout = setTimeout(function () {
					keep_seen && dataSet.get('preview', [sAccId,sFolId,sActiveItem]) && dataSet.get('active_items', [sAccId, sFolId]) == sActiveItem && OldMessage.markAsRead([sAccId, sFolId, [sActiveItem]]);
				}, 5000);
			}

			OldMessage.open([sAccId, sFolId, sActiveItem], !keep_seen);
		}
		else
		if (this.main.itemview){
			Item.open([sAccId, sFolId, sActiveItem]);
		}
	}
};



// A change of ip was detected, ask if logout or sign in anew
_me._acceptChangedIP = function () {
	if(!gui.reauth || gui.reauth._destructed)
		gui._create('reauth','frm_reauth');
};

// Note, logout is also called from frm_change_ip
_me.__logout = function(bSkip){

	if (this._destructed) return;

	//#catch all opened compose windows
	if (!bSkip){
		var aChild = gui._getChildObjects('','frm_compose');
		for (var i in aChild){
			if (!aChild[i].__logoutOnDestruct && aChild[i]._onclose())
				aChild[i]._destruct();
			else{
				aChild[i].__show();
				aChild[i].__logoutOnDestruct = true;
				return;
			}
		}
	}

	//kill IM
	if (this.im && !this.im._destructed){
		this.im._destruct([this,'__logout',[true]]);
		return;
	}

	//kill SIP
	this.__onDestruct();

	//kill connection manager
	if (gui.connection)
		gui.connection._destruct();

	//stop cookies auto-saving
	if (window.Cookie)
		window.clearInterval(window.Cookie._interval);

	//if external login was used
	var sURL = GWOthers.getItem('LAYOUT_SETTINGS','logout_url') || dataSet.get('main',['referrer_url']) || (document.location.protocol +'//'+ document.location.hostname + (document.location.port?':'+document.location.port:'') + document.location.pathname);

	//TeamChat Desktop Client appendix
	if (TeamChatAPI && TeamChatAPI.teamChatOnly())
		sURL += '?' + buildURL({tconly:1, token:TeamChatAPI.getToken(), notifyuri:TeamChatAPI.getNotifyURI()});

	//logout user
	auth.logout();

	//remove datasets
	dataSet.remove('main','',true);
	dataSet.remove('cookies','',true);
	dataSet.remove('accounts','',true);
	dataSet.remove('folders','',true);
	dataSet.remove('items','',true);
	//MailView, ItemView
	dataSet.remove('preview','',true);

	dataSet.remove('active_items','',true);
	dataSet.remove('active_folder','',true);
	dataSet.remove('settings','',true);

	window.onbeforeunload = null;

	if (sURL && !sURL.match(/^https?:\/\//)) {
		sURL = document.location.protocol + '//' + sURL;
	}

	document.location.replace(sURL);
	return;
};

_me.__showConferenceDialog = function(aid, fid, iid) {
	if(aid && fid && iid && WMFolders.getType([aid,fid]) === 'C') {
		WMItems.list({"aid": aid, "fid": fid, "iid": iid},'','','',[function(aData){
			var aValues = aData[aid];
			if (aValues && (aValues = aValues[fid]) && (aValues = aValues[iid])){
				storage.library('wm_conference');
				wm_conference.create(function(conference) {
					var email, emails = [];
					for (var i in aValues['LOCATIONS']) {
						email = aValues['LOCATIONS'][i]['values']['LCTEMAIL1'] || aValues['LOCATIONS'][i]['values']['LCTEMAIL2'] || aValues['LOCATIONS'][i]['values']['LCTEMAIL3'];
						if (email) emails.push(email);
					}
					if (emails.length)
						conference.invite(emails);
				});
			}
		}]);
	}
	else {
		storage.library('wm_conference');
		wm_conference.create(function(conference) {
			conference.join();
		});
	}
};

_me.__showDialDialog = function(aid, fid, iid) {
	if (aid && fid && iid && WMFolders.getType([aid,fid]) === 'C') {
		WMItems.list({"aid": aid, "fid": fid, "iid": iid},'','','',[
			function(aData){
				var aValues = aData[aid];
				if (aValues && (aValues = aValues[fid]) && (aValues = aValues[iid])){

					var	aLocations = aValues['LOCATIONS'],
						v,nPhone,sName,aPhones = {};

					for (var i in aLocations){
						if (aLocations[i]['values']['LCTTYPE'] == 'H') {
							if ((v = aLocations[i].values)){

								//Phones
								for (var j in v)
									if (v[j] && j.indexOf('LCTPHN') == 0){

										nPhone = v[j].trim();

										if (j == 'LCTPHNOTHER' && nPhone.indexOf('sip:') === 0){
											nPhone = nPhone.substring(nPhone.indexOf(':') + 1);
											sName = getLang('PHONE::SIP');
										}
										else
											sName = getLang('PHONE::'+j.toUpperCase(),'',2);

										aPhones[nPhone] = (sName?'['+sName+'] ':'') + nPhone;
									}

								//Emails
								if (v.LCTEMAIL1)
									aPhones[v.LCTEMAIL1] = v.LCTEMAIL1;
								if (v.LCTEMAIL2)
									aPhones[v.LCTEMAIL2] = v.LCTEMAIL2;
								if (v.LCTEMAIL3)
									aPhones[v.LCTEMAIL3] = v.LCTEMAIL3;
							}

							break;
						}
					}

					var c = count(aPhones);
					if (c){
						for(var sPhone in aPhones){
							if (c>1)
								gui._create('im_phone','frm_confirm_select','','',[function(n){ gui.frm_main._call(n); }], 'MAIN_MENU::DIAL', 'DIAL::SELECT_CONTECT', null, aPhones, sPhone);
							else
								gui.frm_main._call(sPhone);

							break;
						}
					}
				}
			}
		]);
	}
};

_me.__showSMSDialog = function(aid, fid, ids) {
	if (ids && WMFolders.getType([aid,fid]) === 'C'){
		var tmp = Is.Array(ids)?ids:[ids];
		for (var i in tmp)
			tmp[i] = WMItems.__serverID(tmp[i]);

		var aFilter = {search: "has:mobile AND items:"+tmp.join(' OR ')},
			aValues = ['ITMCLASSIFYAS','LCTPHNMOBILE'];
		WMItems.list({'aid':aid,'fid':fid,'values':aValues,'filter':aFilter},'','','',[NewMessage.compose_sms]);
	}
	else
		NewMessage.compose_sms();
};

_me._pin_im = function(){

	var c = (Cookie.get(['hide_im']) || '').toString(),
		b = document.body.clientWidth < 1350,
		v = '';

	switch(c){
		//Collpased
	case '1':
		v = b?'2':'';
		break;

		//Expanded
	case '2':
		v = b?'':'1';
		break;

		//Auto
	default:
		v = b?'2':'1';
	}

	//Update
	Cookie.set(['hide_im'], v);
	gui.frm_main._rightDock(v == '2');
};

_me._pin_barmenu = function(){

	var c = (Cookie.get(['hide_tree']) || '').toString(),
		b = document.body.clientWidth < 1100,
		v = '';

	switch(c){
		//Collpased
	case '1':
		v = b?'2':'';
		break;

		//Expanded
	case '2':
		v = b?'':'1';
		break;

		//Auto
	default:
		v = b?'2':'1';
	}

	//Update
	Cookie.set(['hide_tree'], v);
	gui.frm_main._resize_handler();
};

/**
 * Adds given teamchat folder (room) to "Recent" rooms list
 *
 * @param {String} sFolderPath Folder path (i.e.: Public/TeamChat/5ad741c10bec)
 *
 * @returns {undefined}
 */
_me.__addTeamchatFolderToRecent = function(sFolderPath) {
	var aRecent = Cookie.get(['recent']) || [],
		sFolderAbsPath = sPrimaryAccount + '/' + sFolderPath,
		i;

	// Remove folder from recent folders
	i = aRecent.indexOf(sFolderAbsPath);
	if (-1 !== i) {
		aRecent.splice(i, 1);
	}

	// Add/move folder to the top of the list
	aRecent.unshift(sFolderAbsPath);
	Cookie.set(['recent'], aRecent);
};

/**
 * Callback function. Called when new teamchat room is added to the dataset
 *
 * @returns {undefined}
 */
_me.__newTeamchatRoomCallback = function(aData) {
	var aFolders = dataSet.get('folders', [sPrimaryAccount]),
		sFolderId;

	if(sPrimaryAccountGUEST && !Object.keys(aFolders).some(function(sFolder) {
		return aFolders[sFolder].TYPE === 'I';
	})) {
		return gui._create("confirm", "frm_alert", "", "", [function() {
			gui.frm_main.__logout();
		}], 'MAIN_MENU::LOGOUT', 'ERROR::MISSING_TEAMCHAT');
	}

	// Get folder path by id
	if (aData.ACTION == 'add'){
		for (sFolderId in aFolders){
			if (aFolders.hasOwnProperty(sFolderId) && aFolders[sFolderId].RELATIVE_PATH === Path.slash(aData.FOLDER)) {
				this.__addTeamchatFolderToRecent(sFolderId);
				return;
			}
		}
	}
	else
	//Active folder and doesn't exist, go to HOME
	if (WMFolders.getType(Path.split(dataSet.get('active_folder'))) === 'X'){
	 	gui.frm_main._selectView();
	}
};

_me.__copyItem = function(aIds, aDest) {
	var ids = [
			aIds[0].aid,
			aIds[0].fid,
			aIds.map(function(aId) {
				return aId.id;
			})
		];
	Item.__copyOrMoveItems(aDest[0], aDest[1], 'copy', ids);
};
