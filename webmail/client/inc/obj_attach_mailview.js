_me = obj_attach_mailview.prototype;
function obj_attach_mailview(){};

_me.__constructor = function(){
	this.__idtable = [];

	this.__eAttach = this._getAnchor('attach');

	if (this.__eAttach){
		var me = this;
		this.__eAttach.onclick = function(e){
			var e = e || window.event,
				elm = e.target || e.srcElement;

			if (elm.tagName == 'B'){
				e.cancelBubble = true;
				if (e.preventDefault)
					e.preventDefault();
			}

			if (elm.tagName != 'A' && !(elm = Is.Child(elm,'A',this)))
				return false;

			var id = me.__getId(elm.id);
			if (me._onclick) me._onclick(e,elm,id,me.__idtable[id]);

			me.__exeEvent('onclick',e,{"arg":me.__idtable[id],"elm":elm,"id":id,"owner":me});

			return false;
		};

		this.__eAttach.oncontextmenu = this.__eAttach.onclick;
		this.__eAttach.ondblclick 	 = this.__eAttach.onclick;
	}
};

_me._value = function(v){
	if (v && Is.Array(v['attachments'])){

		//All Attachments
		if (v['attachments'].length > 1){
			var bAll = false;

			for (var i in v['attachments']){
				if (v['attachments'][i].allurl){
					bAll = true;
					this._add({name:getLang('ATTACHMENT::ALL'),type:'allsa',url:v['attachments'][i].allurl});
					break;
				}
			}

			if (!bAll)
				for (var i in v['attachments'])
					if (v['attachments'][i].size && !v['attachments'][i].url){
						this._add({name:getLang('ATTACHMENT::ALL'),type:'all'});
						break;
					}
		}

		//Attachments
		for (var i in v['attachments'])
			this._add(v['attachments'][i]);
	}
};

_me._add = function(aArg){
	this.__idtable.push(aArg);
	this._addGuiElement(aArg, this.__idtable.length-1);
};

_me._addGuiElement = function(aArg,id) {
	if (!this.__eAttach || !Is.String(aArg.name)) return;

	var att = mkElement('a', {
		"href": '',
		"id": this.__getElmId(id),
		className: (aArg.css?aArg.css:'') + (aArg.size?' ico_' + Path.extension(aArg.name):'')
	});

	att.onmousedown = function(){
		if (event.preventDefault)
			event.preventDefault();
	};

	att.innerHTML = '<span' + (aArg.name.length > 36 ? ' title="' + aArg.name.escapeXML(true) + '"' : '') + '>' + (aArg.name.length > 36 ? aArg.name.substr(0, 30).escapeXML() + '...' + Path.extension(aArg.name) : aArg.name.escapeXML()) + (aArg.size ? ' <i>(' + parseFileSize(aArg.size) + ')</i>' : '') + '</span><b></b>';

	this.__eAttach.appendChild(att);

	if (this._onchange)
		this._onchange();
};

   /**
    * @brief: return DOM Element ID
    **/
   _me.__getElmId = function (id){
	  return this._pathName +'/'+ id;
   };
   /**
    * @brief: return obj ID
    **/
   _me.__getId = function (eid){
	  return eid.substr(this._pathName.length+1);
   };

/**
 * @date : 14.7.2006 10:26:59
 **/
_me._onclick = function(e,elm,id,arg){
	var srcElm = e.target || e.srcElement;
	var me = this;

	if (e.type == 'contextmenu' || srcElm.tagName == 'B'){
		var cmenu = gui._create("cmenu","obj_context",'','',this),
        	aMenu = [];

		if (arg.type == 'all'){
			aMenu.push(
				{"title":'ATTACHMENT::SAVE','arg':[this,'_saveAll',[this._fullpath()]]}
			);

			if (sPrimaryAccountGW>0){
				var dgw = GWOthers.getItem('RESTRICTIONS', 'disable_gw_types');
				var att = [];
				for(var i in this.__idtable)
					if (this.__idtable[i].id)
						att.push({'name':this.__idtable[i]['name'],'size':this.__idtable[i].size,'fullpath':this._fullpath(this.__idtable[i].id)});

				if (att.length>0) {
					if (!dgw || dgw.indexOf('f')<0){
						aMenu.push({"title":'ATTACHMENT::SAVE_TO_FOLDER','arg':[this,'_saveFolder',[att]]});
					}
					if (Alfresco.enabled()){
						aMenu.push({"title":'ATTACHMENT::SAVE_TO_ALFRESCO','arg':[this,'_saveFolderToAlfresco',[att]]});
					}
				}
			}
		}
		else
		if (arg.type == 'certificate'){
			aMenu.push(
				{"title":'ATTACHMENT::SAVE','arg':[this,'_save_cert',[this._fullpath()]]},
				{"title":'ATTACHMENT::SHOW_CERT','arg':[this,'_open_cert',[arg]]},
				{"title":'ATTACHMENT::APPEND_CERT','arg':[Item.addCert,[[this._aid,this._fid,this._iid]]]});
		}
		else{

			if (arg.url){
				aMenu.push({"title":'ATTACHMENT::SAVE','arg':[downloadItem,[arg['url'],true]]});
				if (arg['allurl'])
					aMenu.push({"title":'ATTACHMENT::SAVE_ALL','arg':[downloadItem,[arg['allurl'],true]]});
			}
			else{

				switch (Path.extension(arg.name)){
				case 'eml':
					arg.type = 'message/rfc822'; break;
				case 'vcf':
					arg.type = 'text/x-vcard'; break;
				case 'ics':
					arg.type = 'text/x-vcalendar'; break;
				}

				if (arg.type)
					switch(arg.type.toLowerCase()){
					case 'message/rfc822':

						//GW has up to two |, M only max one
						var pos, sID;
						if ((pos = this._iid.lastIndexOf('|'))>-1 && (WMFolders.getType([this._aid,this._fid]) == 'M' || (this._iid.match(/\|/g) || []).length>1))
							sID = this._iid.substr(0,pos+1)+arg.id;
						else
							sID = this._iid+'|'+arg.id;

						aMenu.push({"title":'ATTACHMENT::OPEN_WINDOW','arg':[this,'_open', [this._aid,this._fid,sID]]});
					break;

					case 'text/x-vcalendar':
					case 'text/x-vcard':
						aMenu.push({"title":'ATTACHMENT::IMPORT','arg':[this,'_import', [this._aid,this._fid,this._iid+'|'+arg.id]]});
					}

				aMenu.push({"title":'ATTACHMENT::SAVE','arg':[this,'_save',[this._fullpath(arg['id'])]]});
			}

			if (arg.type != 'allsa'){
				if (sPrimaryAccountGW>0){
		            var dgw = GWOthers.getItem('RESTRICTIONS', 'disable_gw_types');
		            if (!dgw || dgw.indexOf('f')<0)
						aMenu.push({"title":'ATTACHMENT::SAVE_TO_FOLDER','arg':[this,'_saveFolder',[[{'name':arg['name'],'size':arg.size,'fullpath':this._fullpath(arg['id'])}]]]});

					if (Alfresco.enabled()){
						aMenu.push({"title":'ATTACHMENT::SAVE_TO_ALFRESCO','arg':[this,'_saveFolderToAlfresco',[[{'name':arg['name'],'size':arg.size,'fullpath':this._fullpath(arg['id'])}]]]});
					}
				}

				//Preview
				switch(Path.extension(arg.name)){
				case "jpg":
				case "jpeg":
				case "bmp":
				case "gif":
				case "png":
					var sFullPath = this._fullpath(arg['id']);
					aMenu.push({"title":'-'}, {"title":'ATTACHMENT::SHOW_IMAGE', arg:[function(){
						var img = gui._create('imgview','frm_imgview');
							img._fill([{title:arg.name, url: (arg['url']?arg['url']:'server/download.php?' + buildURL({'sid':dataSet.get('main',['sid']),'class':'attachment','fullpath':sFullPath}))}]);
							img._value(0);
					}]});
					break;

				case "pdf":
					var sURL = arg['url']?arg['url']:'server/download.php?' + buildURL({'sid':dataSet.get('main',['sid']),'class':'attachment','fullpath':this._fullpath(arg['id'])});
					if (GWOthers.getItem('LAYOUT_SETTINGS','disable_pdf') != 1 || currentBrowser().match(/^MSIE([6-9]|10)$/)){
						aMenu.push({"title":'-'}, {"title":'POPUP_ITEMS::OPEN', arg:[function(){
							gui._create('pdf','frm_pdf')._load(sURL, arg.name);
						}]});
					} else {
						downloadItem(sURL, true);
					}
					break;

				case "mp3":
					if (gui.audio){
						var sURL = arg['url']?arg['url']:'server/download.php?' + buildURL({'sid':dataSet.get('main',['sid']),'class':'attachment','fullpath':this._fullpath(arg['id'])});

						aMenu.push({"title":'-'}, {"title":'ATTACHMENT::PLAY_SOUND', arg:[function(){
							gui.audio._value(sURL, arg.name);
						}]});
					}
					break;

				// default:
					// if (Item.officeSupport(arg.name)){
					// 	var bIWD = dataSet.get('accounts', [sPrimaryAccount, 'OFFICE_SUPPORT']) == 'true';
					// 	aMenu.push({
					// 		title:'POPUP_ITEMS::OPEN',
					// 		arg: [this,'_openOffice',[arg,'force']],
					// 		'nodes':[
					// 			{"title":'DOCUMENT::OPENDOCUMENT','arg':[this,'_openOffice',[arg,'edit']], disabled: !bIWD},
					// 			{"title":'DOCUMENT::OPENDOCUMENTVIEW','arg':[this,'_openOffice',[arg,'view']], disabled: !bIWD},
					// 			{"title":'OFFICELAUNCHER::OFFICESUITE','arg':[this,'_openOffice',[arg,'external']]}
					// 		]
					// 	});
					// }
				}
			}
			sPrimaryAccountCHAT && aMenu.push({title: 'ATTACHMENT::SAVE_TO_TEAMCHAT', arg:[function(arg) {

				function __uploadhandler(aTo, aBuffer, sName, sDesc, aArg) {
					if (aBuffer && aBuffer.length){
						var d = new IcewarpDate(),
							aItemInfo = {values: {}, ATTACHMENTS: []};

						aItemInfo.values.EVNSHARETYPE = 'U';
						aItemInfo.values.EVNCLASS = 'F';
						aItemInfo.values.EVNSTARTDATE = d.format(IcewarpDate.JULIAN);
						aItemInfo.values.EVNSTARTTIME = d.hour()*60 + d.minute();

						if (aBuffer.length == 1){
							aItemInfo['values']['EVNRID'] = aItemInfo['values']['EVNLOCATION'] = aItemInfo['values']['EVNTITLE'] = sName || aBuffer[0].name;
							aItemInfo['values']['EVNCOMPLETE'] = aBuffer[0].size;

							if (Is.String(sDesc) && sDesc.length){
								aItemInfo['values']['EVNNOTE'] = sDesc;
								aItemInfo['values']['EVNDESCFORMAT'] = 'text/plain';
							}
						}

						for (var i = 0, j = aBuffer.length; i < j; i++) {
							aItemInfo['ATTACHMENTS'].push({values:aBuffer[i]});
						}

						//Sent to server
						WMItems.add(aTo, aItemInfo,'','','', [function(bOK, aData){
							if (bOK){
								gui.notifier._value({type: 'message_sent_tch', args: [dataSet.get('folders', aTo).NAME || dataSet.get('folders', aTo).RELATIVE_PATH || '']});
							} else {
								if(aData === 'item_create') {
									aData = 'ALERTS::FOLDER_INSUFFICIENT_RIGHTS';
								} else {
									aData = 'ERROR::' + aData;
								}
								gui.notifier._value({type: 'alert', args: {header: 'ALERTS::MESSAGE_NOT_SAVED', text: aData}});
							}
						}]);
					}
				};

				var sFolder;
				var f = dataSet.get('folders', [sPrimaryAccount]);
				for(var id in f){
					if (f[id].TYPE === 'I'){
						sFolder = id;
						break;
					}
				}

				if (sFolder) {
					gui._create('frm_select_folder', 'frm_select_folder', '', '', 'CHAT::SELECT', sPrimaryAccount, sFolder,
						[function(aid, fid) {
							var __upload_buffer = [{
								'class': 'attachment',
								'description': (arg.name || '').replace(/[<>:\/\\|?*""\[\]]/g, ''),
								'size': arg.size,
								'fullpath': me._fullpath(arg['id'])
							}];

							gui._create('chat_upload', 'frm_chat_upload', '', '', __upload_buffer[0].description, '', {aid: aid, fid: fid}, [function (sName, sDesc, aArg) {
								__uploadhandler([aid, fid], __upload_buffer, sName, sDesc, aArg);
							}]);
						}], true, true, ['Y','I'], '', true
					);
				}

			}, [arg]]});
		}

		cmenu._fill(aMenu);

		if (srcElm.tagName != 'A')
			srcElm = Is.Child(srcElm,'A');

		var pos = getSize(srcElm);
		cmenu._place(pos.x+(pos.w/2),pos.y+pos.h,'',2);
	}
	else
	if (arg.type && arg.type.toLowerCase().indexOf('message/rfc822') === 0){

		var pos, sID;

		//GW has up to two |, M only max one
		if ((pos = this._iid.lastIndexOf('|'))>-1 && (WMFolders.getType([this._aid,this._fid]) == 'M' || (this._iid.match(/\|/g) || []).length>1))
			sID = this._iid.substr(0,pos+1)+arg.id;
		else
			sID = this._iid+'|'+arg.id;

		this._open(this._aid,this._fid,sID);
	}
	else
	if (arg.type == 'all')
		this._saveAll(this._fullpath());
	else
	if (arg.type == 'certificate')
        this._open_cert(arg);
	else
	if (dataSet.get('accounts', [sPrimaryAccount, 'OFFICE_SUPPORT']) === "true" && (GWOthers.getItem('DOCUMENTS', 'disable_office') || 0) != 1 && Item.officeSupport(arg.url || arg.name) && (GWOthers.getItem('RESTRICTIONS', 'disable_gw_types') || '').indexOf('f') == -1) {
		this._openOffice(arg);
	}
	else
	if (Path.extension(arg.name) == 'pdf' && GWOthers.getItem('LAYOUT_SETTINGS','disable_pdf') != 1 && !currentBrowser().match(/^MSIE([6-9]|10)$/)){
		var sURL = arg['url']?arg['url']:'server/download.php?' + buildURL({'sid':dataSet.get('main',['sid']),'class':'attachment','fullpath':this._fullpath(arg['id'])});
		gui._create('pdf','frm_pdf')._load(sURL, arg.name);
	}
	else
	if (arg['url']) {
		downloadItem(arg['url'], true);
	}
	else {
		this._save(this._fullpath(arg['id']));
	}
};

_me._fullpath = function(attId) {
	return this._aid+'/'+this._fid+'/'+WMItems.__serverID(this._iid) + (Is.Defined(attId)?'/'+attId:'');
};

/** OPEN **/
_me._open_cert = function (arg){
    if (arg && arg.cert && arg.cert.INFO)
		gui._create('certificate','frm_certificate','','',arg.cert.INFO[0]);
};

_me._open = function(aid,fid,iid){
	OldMessage.openwindow([aid,fid,iid]);
};

// _me._openOffice = function(arg, sMode){
// 	var sURL = arg.url || document.location.origin + document.location.pathname + 'server/download.php?' + buildURL({'sid':dataSet.get('main',['sid']),'class':'attachment','fullpath':this._fullpath(arg['id'])});
// 	Item.officeOpen({EVNTITLE:arg.name, url:sURL},[this,'_save',[this._fullpath(arg['id'])]], Path.extension(arg.name), sMode, 'edit_document');
// };

/** IMPORT ITEM **/
_me._import = function(aid,fid,iid){
	WMItems.action({aid:aid,fid:fid,iid:iid},'importattachment',[this,'_openImport']);
};
_me._openImport = function(bOK,xResponse){
	if (bOK){
		var aValues = WMItems.parse(xResponse);
		for(var aid in aValues)
			for (var fid in aValues[aid]){
				delete aValues[aid][fid]['/'];
				delete aValues[aid][fid]['#'];
				delete aValues[aid][fid]['$'];
				delete aValues[aid][fid]['@'];

				for (var iid in aValues[aid][fid]){
					aValues = aValues[aid][fid][iid];

					var frm = Item.openwindow([aid,fid,iid],aValues);

					frm._userEdited = function() {
						return true; // force save
					};
					//Add destructor
					frm.__removeItem = function(ids){
						if (!frm.__stored)
							Item.remove([aid,fid,[iid]],true);
					};

					frm._add_destructor('__removeItem');
				}
	        }
	}
	//Import Error
	else{
		try{
			if (xResponse.IQ[0].ERROR[0].ATTRIBUTES.UID == 'item_invalid_type'){
				gui.notifier._value({type: 'alert', args: {header: 'ATTACHMENT::IMPORT', text: 'ATTACHMENT::IMPORT_ERROR'}});
				return;
			}
		}catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r);}

		gui.notifier._value({type: 'alert', args: {header: 'ATTACHMENT::IMPORT', text: 'ATTACHMENT::IMPORT_ERROR'}});
/*
[Error]
.. [IQ]
.... [0]
...... [ERROR]
........ [0]
.......... [ATTRIBUTES]
............ [UID](string) = folder_does_not_exist
...... [REQUEST]
........ [0]
...... [ATTRIBUTES]
........ [TYPE](string) = error
 */

	}
};

//download.php?sid={sid}&class=email_certificate&fullpath={account}/{folder}/{item}
_me._save_cert = function(sFullPath){
	var aUrl = {'sid':dataSet.get('main',['sid']),'class':'email_certificate','fullpath':sFullPath};
	downloadItem(buildURL(aUrl));
};

_me._save = function(sFullPath) {
	var aUrl = {'sid':dataSet.get('main',['sid']),'class':'attachment','fullpath':sFullPath};
	downloadItem(buildURL(aUrl));
};

_me._saveAll = function(sFullPath) {
	var aUrl = {'sid':dataSet.get('main',['sid']),'class':'allattachments','fullpath':sFullPath};
	downloadItem(buildURL(aUrl));
};

_me._openOffice = function(arg){

	WMItems.list({aid: sPrimaryAccount, fid: Mapping.getDefaultFolderForGWType('F'), filter:{search:'partid:"'+ WMItems.__serverID(this._iid) +'/'+ arg.id +'"'}},'','','',[function(aData){

		//Open existing file from Documents
		if ((aData = aData[sPrimaryAccount]) && (aData = aData[Mapping.getDefaultFolderForGWType('F')]) && aData['@'].COUNT == '1'){
			for(var iid in aData){
				if (iid.length>1){
					this.__openOffice(WMItems.__serverID(iid), arg);
					return;
				}
			}
		}

		//save to Documents and Open
		this.__saveFolder(sPrimaryAccount, Mapping.getDefaultFolderForGWType('F'), [{
			'name':arg.name,
			'size':arg.size,
			'fullpath':this._fullpath(arg.id),
		}], {
			success: function(result) {
				this.__openOffice(result.id, objConcat(arg, {name:result.name}));
			},
			context: this
		});

	}.bind(this)]);
};

	_me.__openOffice = function(file_id, arg){
		var iid = [
			sPrimaryAccount,
			Mapping.getDefaultFolderForGWType('F'),
			file_id
		];

		Item.officeOpen({aid: iid[0], fid: iid[1], iid: iid[2], 'EVNTITLE':arg.name}, [downloadItem, iid], Path.extension(arg.name), ~['I', 'Y'].indexOf(dataSet.get('folders', [this._aid, this._fid, 'TYPE'])) && 'view', {
			success: function(final_cb) {

				var frm = gui._create('send_back','frm_confirm', '', '', [function() {

					var messages = OldMessage.reply([this._aid, this._fid, this._iid], false, false, true),
						newMessage = messages[0];

					newMessage.aAttachments = newMessage.aAttachments || {};
					newMessage.aAttachments.attachments = newMessage.aAttachments.attachments || [];

					newMessage.aAttachments.attachments.push({values: {
						'class': 'item',
						fullpath: iid[0] + '/' + iid[1] + '/' + iid[2],// + '/' + encodeURIComponent(arg.name),
						name: arg.name,
						size: arg.size
					}});

					gui._create('frm_compose', 'frm_compose', '', '', newMessage, messages[1]);

					frm._destruct();

				}.bind(this)], 'COMPOSE::MODIFIED_FILE_TITLE', 'COMPOSE::MODIFIED_FILE_HELPER');

				//Disable OK button untill edit-session is finished
				frm.x_btn_ok._disabled(true);
				removecss(frm.x_btn_ok._main,'ok');
				addcss(frm.x_btn_ok._main,'ico loading');

				final_cb.success = function(){
					clearTimeout(timeout);

					if (frm && frm.x_btn_ok) {
						frm.x_btn_ok._disabled(false);
						removecss(frm.x_btn_ok._main,'ico');
					}
				};

				final_cb.error = function(){
					clearTimeout(timeout);

					if (frm && frm.x_btn_ok) {
						frm.x_btn_ok._disabled(true);
						addcss(frm.x_btn_ok._main,'ico');
					}
				};

				var timeout = setTimeout(function(){
					final_cb.success();
				}, 60000);

				//final_cb destructor
				frm._obeyEvent('ondestruct',[function(){
					final_cb = null;
				}]);
			},
			context: this
		});
	};

_me._saveFolder = function(arg){
	gui._create('select_folder','frm_select_folder','','','POPUP_FOLDERS::SELECT_FOLDER',sPrimaryAccount,Mapping.getDefaultFolderForGWType('F'),[this,'__saveFolder',[arg]],true,false,'F','i',true);
};

_me._saveFolderToAlfresco = function(arg){
	gui._create('select_folder', 'frm_select_folder', '', '', 'POPUP_FOLDERS::SELECT_FOLDER', '@@alfresco@@', Alfresco.getLastFolder(), [this,'__saveFolder',[arg]], true, true, 'K', false, true);
};

	_me.__saveFolder = function(aid,fid,arg,callback){

		//DIRECT
		var now = new IcewarpDate(),
			att = [];

		for (var i in arg)
			att.push({
				values:{
					'class': 'attachment',
					'description':arg[i].name,
					'size':arg[i].size,
					'fullpath':arg[i].fullpath
				}
			});

		WMItems.add([aid,fid],{
			values:{
				'EVNSHARETYPE':GWOthers.getItem('DEFAULT_CALENDAR_SETTINGS','file_sharing'),
				'EVNSTARTDATE':now.format(IcewarpDate.JULIAN),
				'EVNSTARTTIME':now.format(IcewarpDate.JULIAN_TIME)
			},
			duplicity:'rename',
			ATTACHMENTS:att
		},'','','',[
			function(bOK, result){
				//Notify user
				if (bOK && result && result.id){
					callback && callback.success && callback.success.call(callback.context || this, result);
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
			}
		]);

	};
