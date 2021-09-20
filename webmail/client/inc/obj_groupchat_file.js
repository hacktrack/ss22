_me = obj_groupchat_file.prototype;
function obj_groupchat_file(){};

_me.__constructor = function() {

	var me = this,
		aData = this.__aData,
		aTmp = {},
		linkextras = {};

	this._main.setAttribute('evnclass',aData.EVNCLASS);

	if (aData.EVNLINKEXTRAS){
		linkextras = parseURL(aData.EVNLINKEXTRAS);
		var ico;
		if (aData.EVNCLASS === 'R' && aData.EVNLINKTYPE == 9){
			ico = 'conference-record';
		}
		else{
			ico = Path.extension(linkextras.EvnTitle);
		}

		if (linkextras.EvnTicket){

			aTmp.size = parseFileSize(linkextras.EvnComplete);
			aTmp.filename = linkextras.EvnTitle;

			aTmp.preview = linkextras.EvnThumbnailId?'':'ico ico_none ico_'+ico;

			//Encode attachment ID with %20
			linkextras.EvnLocation = encodeURIComponent(linkextras.EvnLocation).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A');

			if (aData.EVNCLASS == 'Z'){
				var ticketUrl = parseURL(linkextras.EvnTicket.split('#').pop());
				aTmp.url = document.location.origin + '/teamchatapi/files.download?' + buildURL({ticket:ticketUrl.ticket});
				aTmp.filename = aData.EVNTITLE;
			}
			else{
				aTmp.menubutton = true;
				aTmp.url = linkextras.EvnTicket;
			}

			if (Item.imageSupport(aTmp.filename)){
				this._fileinfo = {
					title:aTmp.filename,
					evn_id:aData.EVN_ID
				};

				if (aData.EVNCLASS == 'Z'){
					this._fileinfo.url = aTmp.url;
				}
				else{
					//resize images bigger then 10MB
					var ratio = window.retina || window.devicePixelRatio || 1;
					if (linkextras.EvnComplete>10485760)
						this._fileinfo.url = 'server/download.php?' + buildURL({'sid':dataSet.get('main',['sid']),'class':'file_attachment','fullpath':aData.aid+'/'+aData.fid+'/'+aData.EVNLINKID, 'resize':1, 'width':window.screen.availWidth * ratio, 'height':window.screen.availHeight * ratio});
					else
						this._fileinfo.url = 'server/download.php?' + buildURL({'sid':dataSet.get('main',['sid']),'class':'file_attachment','fullpath':aData.aid+'/'+aData.fid+'/'+aData.EVNLINKID});
				}
			}
		}

		this.__dimensions(linkextras);
	}


	switch(Path.extension(aTmp.filename)) {
		case 'mp3':
			aTmp.play = true;
			break;
		case 'wav':
			// do not try to playback wav in Internet Explorer & Safari
			aTmp.play = !(window.ActiveXObject || "ActiveXObject" in window) && !/^((?!chrome|android).)*safari/i.test(navigator.userAgent);
			break;
	}

	aTmp.shareable = !sPrimaryAccountGUEST && aData.EVNCLASS !== 'Z';


	this._draw('obj_groupchat_file', 'addon', aTmp);
/*
	this.label._onclick = function(){

		var iid = WMItems.__clientID(aData.EVNLINKID);

		if (Path.extension(aTmp.filename) == 'pdf')
			gui._create('pdf', 'frm_pdf')._load(aTmp.url, aTmp.filename);
		else
		if (Item.imageSupport(aTmp.filename)){
			var img = gui._create('imgview','frm_imgview');
				img._fill([{url:aTmp.url,title:aTmp.filename}]);
				img._value(0);
		}
		else
		if (Item.editSupport(aTmp.filename))
			Item.editFile([aData.aid, aData.fid, iid]);
		else
		if (Item.officeSupport(aTmp.filename))
			Item.officeOpen({aid: aData.aid, fid: aData.fid, iid: iid},[Item.downloadFile, [aData.aid, aData.fid, iid]], Path.extension(aTmp.filename), false, 'edit_document');
		else
		if (aTmp.url)
			downloadItem(aTmp.url,true);
	};
*/
	this._getAnchor('fname').onclick = function(e){
		var e = e || window.event,
			iid = WMItems.__clientID(aData.EVNLINKID);

		if (Path.extension(aTmp.filename) == 'pdf' && GWOthers.getItem('LAYOUT_SETTINGS','disable_pdf') != 1 && !currentBrowser().match(/^MSIE([6-9]|10)$/))
			gui._create('pdf', 'frm_pdf')._load(aTmp.url, aTmp.filename);
		else
		if (Item.imageSupport(aTmp.filename)){

			//GET All images in
			var arr = [me._fileinfo],
				tmp = {};

			(me.__list._getChildObjects('','obj_groupchat_file') || []).forEach(function(obj){
				if (obj._fileinfo && obj._fileinfo.evn_id && obj._fileinfo.evn_id !== me.__aData.EVN_ID && !tmp[obj._fileinfo.url]){
					arr.push(obj._fileinfo);
					tmp[obj._fileinfo.url] = true;
				}
			});

			//sort by evn_id
			arr.sort(function(a,b){
				if (a.evn_id < b.evn_id)
					return -1;

				if (a.evn_id > b.evn_id)
					return 1;

				return 0;
			});

			//get current img position
			var value = 0;
			for (var i = 0, l = arr.length; i<l; i++)
				if (arr[i].evn_id === me.__aData.EVN_ID){
					value = i;
					break;
				}

			var img = gui._create('imgview','frm_imgview');
				img._fill(arr);
				img._value(value);
		}
		else
		if (Item.editSupport(aTmp.filename))
			if (aData.EVNCLASS === 'Z') {
				getRemoteFileContent(aTmp.url, function(content) {
					gui._create('text','frm_editor')._loadContent(aTmp.filename, content);
				});
			} else {
				Item.editFile([aData.aid, aData.fid, iid]);
			}
		else
		if (Item.officeSupport(aTmp.filename)) {
			var data = clone(aData);

			if (aData.EVNCLASS == 'Z'){
				data.ticket = ticketUrl.ticket;
				Item.officeOpen(data,[downloadItem, [aTmp.url, true]], Path.extension(aTmp.filename));
			}
			else{
				data.iid = iid;
				Item.officeOpen(data,[Item.downloadFile, [[aData.aid, aData.fid, iid]]], Path.extension(aTmp.filename));
			}
		}
		else
		if (aTmp.url) {
			downloadItem(aTmp.url,true);
		}

		e.cancelBubble = true;
		if (e.stopPropagation) e.stopPropagation();
		return false;
	};

	this._getAnchor('preview').onclick = function(e){
		var e = e || window.event;

		me._getAnchor('fname').onclick();

		e.cancelBubble = true;
		if (e.stopPropagation) e.stopPropagation();
		return false;
	};

	//this.download
	this.download._onclick = function(){
		if (aTmp.url)
			downloadItem(aTmp.url,true);
	};

	if (aTmp.menubutton){
		this.download._menu(function(){

			var arr = [{
				title: 'ATTACHMENT::DOWNLOAD',
				arg: [
					function(){
						me.download._onclick();
					}
				]
			}];

			if (!sPrimaryAccountGUEST && !(TeamChatAPI && TeamChatAPI.teamChatOnly()))
				arr.push(
					{
						title: 'ATTACHMENT::SAVE_TO_FOLDER',
						arg: [function() {
							gui._create('select_folder','frm_select_folder','','','POPUP_FOLDERS::SELECT_FOLDER',sPrimaryAccount,Mapping.getDefaultFolderForGWType('F'),[me,'_saveFolder'],true,false,'F','i',true);
						}]
					}
				);

			return arr;
		}, 'groupchat_file_menu');
	}

	if (this.share) {
		this.share._onclick = function(){
			me._share(aData);
		};
	}

	// Share
	this._getAnchor('close').onclick = function(e){
		e.cancelBubble = true;
		if (e.stopPropagation) e.stopPropagation();
		me._share(false);

		return false;
	};

	this.url._readonly(true);
	this.url._value(aTmp.url);
	this.url._onclick = this.url._onfocus = function(){
		this._select();
	};

	this.email._single = true;
	this.email._onchange = function(){
		me.send._disabled(!this._value().trim().length);
	};
	this.email._onclose = function(){
		if (this._value().length == 0)
			me._share(false);
	};
	this.email._onsubmit = function(){
		me.send._onclick();
	};

	this.send._onclick = function(){
		var email = MailAddress.splitEmailsAndNames(me.email._value());
		if (!this._disabled() && email && (email = email[0]) && (email = email.email)){

			me.email._disabled(true);
			this._disabled(true);

			WMItems.action({aid:aData.aid, fid:aData.fid, iid:aData.EVNLINKID, values:{EMAIL:email}},'notify_groupchat',[
				function(bOK){

					if (bOK){
						me._share(false);
						me.email._value('');

						//notify OK
						gui.notifier._value({type: 'message_sent'});
					}

					me.email._disabled(false);
					me.send._disabled(false);

					if (!bOK){
						me.email._select();

						//notify Error

					}
				}
			]);

		}
	};

	//Preview with Thumb
	if (linkextras.EvnThumbnailTicket){
		this.__dimensions(linkextras);
		this._preview_image(linkextras.EvnThumbnailTicket  + '&' + buildURL({'resize':1, 'width':150, 'height':600}));
	}
	else
	if (linkextras.EvnThumbnailId){
		var src = 'server/download.php?' + buildURL({'sid':dataSet.get('main',['sid']), 'class':'attachment', 'fullpath': [aData.aid, aData.fid, aData.EVNLINKID, linkextras.EvnThumbnailId].join('/'),'resize':1, 'width':150, 'height':600, 't':linkextras.EvnThumbnailTime});
		this.__dimensions(linkextras);
		this._preview_image(src);
	}
	else
	//Image preview
	if (linkextras.EvnProcessingQueued == '0' && linkextras.EvnTicket && Item.imageSupport(linkextras.EvnTitle)){
		this.__dimensions(linkextras);
		this._preview_image(linkextras.EvnTicket);
	}

	//Reload preview
	if (!gui.socket && linkextras.EvnProcessingQueued == 1){
		this.__timeout = setTimeout(function(){
			me.__update();
		}, 5000);
	}

	this._add_destructor('__destructor');
};

// parsed linkextras
_me.__dimensions = function(linkextras){
	if (linkextras.EvnSizeInfo){
		var tmp = parseURL(linkextras.EvnSizeInfo);

		if (tmp.tw>0){
			this.__aData.dim = {w:tmp.tw, h:tmp.th};
			return;
		}
		else
		if (tmp.ow>0){
			if (tmp.o>4)
				this.__aData.dim = {w:tmp.oh, h:tmp.ow};
			else
				this.__aData.dim = {w:tmp.ow, h:tmp.oh};

			return;
		}
	}

	delete this.__aData.dim;
};

_me._share = function(aData){
	Item.collaborate([aData.aid,aData.fid,[WMItems.__clientID(aData.EVNLINKID)]]);
};
_me.__update_preview = function(){
	//update preview only
	this.__update();
};
_me.__update = function(){
	var aItemsInfo = {aid:this.__aData.aid, fid:this.__aData.fid, iid:this.__aData.iid, values:['EVNNOTE','EVN_CREATED','EVN_MODIFIED','EVNLINKEXTRAS']};

	WMItems.list(aItemsInfo,'','','',[function(aData){

		if (aData && (aData = aData[this.__aData.aid]) && (aData = aData[this.__aData.fid]) && (aData = aData[this.__aData.iid]) && aData.EVNLINKEXTRAS){

			if (this.__timeout){
				clearTimeout(this.__timeout);
				delete this.__timeout;
			}

			//preview
			var linkextras = parseURL(aData.EVNLINKEXTRAS);
			if (linkextras){
				 if (linkextras.EvnProcessingQueued == '0'){

					//Preview with Thumb
					var src;
					if (linkextras.EvnThumbnailTicket)
						src = linkextras.EvnThumbnailTicket  + '&' + buildURL({'resize':1, 'width':150, 'height':600, 't':linkextras.EvnThumbnailTime});
					else
					if (linkextras.EvnThumbnailId)
						src = 'server/download.php?' + buildURL({'sid':dataSet.get('main',['sid']), 'class':'attachment', 'fullpath': [this.__aData.aid, this.__aData.fid, this.__aData.EVNLINKID, linkextras.EvnThumbnailId].join('/'),'resize':1, 'width':150, 'height':600, 't':linkextras.EvnThumbnailTime});

					this.__dimensions(linkextras);

					this._preview_image(src);


				}
				else{
					this.__timeout = setTimeout(this.__update.bind(this), 5000);
				}

				//Reactions
				if (!aData.REACTIONS && linkextras.Evn_MetaData){
					this.__aData.REAVALUE = linkextras.ReaValue || '';
					var meta = parseURL(linkextras.Evn_MetaData);
					aData.REACTIONS = meta.core_reactions_data?parseURL(meta.core_reactions_data):{};
				}
			}

			this.__aData.EVNLINKEXTRAS = aData.EVNLINKEXTRAS;

			//Body
			if (this.__aData.EVNNOTE != aData.EVNNOTE)
				this._init_body(aData);

			this._init_reactions(aData);
		}

	}.bind(this)]);
};

_me._preview_image = function(src){

	if (!this._destructed && src && this._getAnchor('preview')){

		var img = new Image();
			img.onload = function(e){
				try{
					if (!this._destructed){

						//get scroll
						var ePrev = this._getAnchor('preview'),
							bScroll = false,
							bSafari = false,
							h = this._main.offsetHeight;

						if (this.__list && this.__list._scroll){
							var pos1 = getSize(this.__list.__body),
								pos2 = getSize(this._main);

							bScroll = pos1.y + pos1.h >= pos2.y + pos2.h;

							if (bScroll)
								bSafari = window.navigator && window.navigator.browser && window.navigator.browser.application && window.navigator.browser.application.toLowerCase() == 'safari';
						}

						removecss(ePrev,'ico', 'convert');

						if (this.__aData.dim){

							ePrev.firstElementChild.style.height = Math.round(this.__aData.dim.h/(this.__aData.dim.w/150)) + 'px';

							if (bScroll)
								this.__list._scrollBy(Math.abs(this._main.offsetHeight - h));
						}

						if (!this.__preview){
							this.__preview = mkElement('img');
							ePrev.firstElementChild.appendChild(this.__preview);
						}

						if (img.naturalHeight && img.naturalWidth){
							this.__preview.style.maxHeight = img.naturalHeight + 'px';
							this.__preview.style.maxWidth = img.naturalWidth + 'px';
						}

						if (bScroll && bSafari)
							this.__preview.onload = function(){
								try{
									if (!this._destructed){
										ePrev.firstElementChild.style.height = 'auto';
										if (this._main.offsetHeight - h != 0)
											this.__list._scrollBy(Math.abs(this._main.offsetHeight - h));
									}
								}
								catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r);}
							}.bind(this);

						this.__preview.src = img.src;

						if (!bSafari){
							ePrev.firstElementChild.style.height = 'auto';
							if (bScroll && this._main.offsetHeight - h != 0)
								this.__list._scrollBy(Math.abs(this._main.offsetHeight - h));
						}
					}
				}
				catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r);}

			}.bind(this);

			img.src = src;
	}
};

_me._saveFolder = function(aid,	fid){

	//DIRECT
	var extras = parseURL(this.__aData.EVNLINKEXTRAS),
		now = new IcewarpDate(),
		att = [{
			values:{
				'class': 'file_attachment',
				'description':extras.EvnLocation,
				'size':extras.EvnComplete,
				'fullpath':this.__aData.aid +'/'+ this.__aData.fid + '/' +  this.__aData.EVNLINKID
			}
		}];

	//For filetime use Evn_Created

	WMItems.add([aid,fid],{
		values:{
			'EVNSHARETYPE':GWOthers.getItem('DEFAULT_CALENDAR_SETTINGS','file_sharing'),
			'EVNSTARTDATE':now.format(IcewarpDate.JULIAN),
			'EVNSTARTTIME':now.format(IcewarpDate.JULIAN_TIME)
		},
		ATTACHMENTS:att
	},'','','',[
		function(bOK, result){
			//Notify user
			if (bOK && result && result.id){

				if (gui.notifier)
					gui.notifier._value({type: 'item_saved', args: [aid, fid]});

				//refresh Files folder if active
				var aItems = dataSet.get('items');
				for(var sAccId in aItems)
					for(var sFolId in aItems[sAccId])
						break;

				if (aid == sAccId && fid == sFolId)
					try{
						gui.frm_main.main.list._serverSort({aid:aid,fid:fid});
					}
					catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r);}
			}
			else
			if (gui.notifier)
				gui.notifier._value({type: 'alert', args: {text:'DOCUMENT::SAVE_ERROR'}});
		}
	]);
};

_me.__destructor = function(){
	if (this.__timeout){
		window.clearTimeout(this.__timeout);
		delete this.__timeout;
	}
};
