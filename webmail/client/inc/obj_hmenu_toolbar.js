_me = obj_hmenu_toolbar.prototype;
function obj_hmenu_toolbar() {}

_me.__constructor = function () {
	storage.library('gw_others');

	this.__currentFolder = [];

	gui._obeyEvent('viewSelected', [this, '__viewSelect_handler']);
	gui._obeyEvent('folderSelected', [this, '__folderSelect_handler']);
	gui._obeyEvent('itemSelected', [this, '__itemSelect_handler']);

	this._add_destructor('__destructor');
};
	_me.__viewSelect_handler = function(arg){
		if (this.__currentFolder.length && ~['day_view','week_view','workweek_view','month_view'].indexOf(arg)){
			this.__currentView = arg;
			this.__menu(this.__currentFolder);
		}
	};

	_me.__folderSelect_handler = function(arg){
		var arg_copy = clone(arg);

		//Get primary Calendar folder
		if (arg.aid == sPrimaryAccount && arg.fid == '__@@VIRTUAL@@__/__@@EVENTS@@__'){
			arg_copy.fid = Folder.getActiveCalendar();
		}

		if (this.__currentFolder.length){
			if ((arg.ftype && this.__currentIDs.length == 3) || this.__currentFolder[0] != arg.aid || (this.__currentFolderTranslated[1] != arg_copy.fid))
				this.__menu([arg.aid, arg_copy.fid]);
		}
		else{
			this.__menu([arg.aid, arg_copy.fid]);
		}
	};

	_me.__itemSelect_handler = function(arg){
		if (!this.__currentFolder.length || !compareObj(this.__currentIDs,arg,true)){
			this.__menu(arg);
		}
	};


_me.__destructor = function () {
	gui._disobeyEvent('viewSelected', [this, '__viewSelect_handler']);
	gui._disobeyEvent('folderSelected', [this, '__folder_select_handler']);
	gui._disobeyEvent('itemSelected', [this, '__itemSelect_handler']);
};

_me.__menu = function (ids) {

	if (Is.String(ids[2]))
		ids[2] = [ids[2]];

	this.__currentIDs = ids;
	this.__currentFolder = ids.slice(0,2);

	this.__currentFolderTranslated = this.__currentFolder.concat();
	if (this.__currentFolder[0] == sPrimaryAccount && this.__currentFolder[1] == '__@@VIRTUAL@@__/__@@EVENTS@@__'){
		this.__currentFolder[1] = Folder.getActiveCalendar();
		this.__currentFolderTranslated[1] = Folder.getActiveCalendar();
	}

	var aMenu = [],
		sType = WMFolders.getType(this.__currentFolder),
		bShort = false,
		aFolder = dataSet.get('folders', this.__currentFolder),
		aRights = WMFolders.getRights(this.__currentFolder),
		aAccess = WMFolders.getAccess(this.__currentFolder),
		del = false,
		bNoMore = false,
		bIsFavorite = (dataSet.get('cookies', ['favorites']) || []).some(function(fav) {
			return fav.arg.aid === this.__currentFolder[0] && fav.arg.fid === this.__currentFolder[1];
		}.bind(this));

	//FOLDERS
	if (ids.length == 2){
		switch(sType){
			case 'M':
				if (aFolder.RSS){
					aMenu.push(
						{"title": 'POPUP_FOLDERS::CHANGE_CHANNEL', css: 'ico2 change_channel', "arg": 'change_channel', disabled:!aRights.modify}
					);
				}

				if (!aFolder.SPAM)
					aMenu.push({"title": 'MAIN_MENU::ADD_FOLDER', css: 'ico2 add_folder', "arg": 'add_folder'});

				if (aFolder.SPAM || aFolder.DEFAULT === 'H' || aFolder.DEFAULT == 'S')
					aMenu.push({"title": 'MAIN_MENU::EMPTY_FOLDER', css: 'ico2 empty_folder', "arg": 'empty'});

				if (GWOthers.getItem('LAYOUT_SETTINGS','favorites')>0 && !bIsFavorite)
					aMenu.push({title: 'POPUP_FOLDERS::ADD_FAVORITES', arg: 'add_favorite', css:'ico2 fav_folder'});

				break;

			case 'E':
				if (~['day_view','week_view','workweek_view','month_view'].indexOf(this.__currentView))
					aMenu.push({"title": 'MAIN_MENU::PRINT', css: 'ico2 print noarrow', "arg": 'print', nodetype: 'click', nodes:[
						{"title": 'MAIN_MENU::PRINT_CALENDAR', css:'ico2 print_calendar', "arg": 'print_calendar'},
						{"title": 'MAIN_MENU::EVENTS_LIST',  css:'ico2 print_list', "arg": 'print_list'},
					]});

				aMenu.push({"title": 'MAIN_MENU::ADD_CALENDAR', css: 'ico2 add_calendar', "arg": 'add_folder'});

				break;

			case 'F':
				var aDoc = [
					{"title": 'MAIN_MENU::NEW_WORD', "arg": {arg:'new_item', type:'.docx'}, css: 'ico2 doc shorten', disabled:!aAccess.write},
					{"title": 'MAIN_MENU::NEW_EXCEL', "arg": {arg:'new_item', type:'.xlsx'}, css: 'ico2 xls shorten', disabled:!aAccess.write},
					{"title": 'MAIN_MENU::NEW_PPOINT', "arg": {arg:'new_item', type:'.pptx'}, css: 'ico2 ppt shorten', disabled:!aAccess.write}
				];
				aMenu = aMenu.concat(aDoc);
				aMenu.push(
					{"title": 'MAIN_MENU::NEW_DOCUMENT', css: 'ico2 add_doc short', disabled:!aAccess.write, nodes:aDoc},
					{"title": 'MAIN_MENU::NEW_UPLOAD', css: 'ico2 upload', "arg": 'upload_file', disabled:!aAccess.write},
					{"title": 'MAIN_MENU::ADD_FOLDER', css: 'ico2 add_folder', "arg": 'add_folder'}
				);
				break;

			case 'C':
				aMenu.push(
					{"title": 'MAIN_MENU::ADD_FOLDER', css: 'ico2 add_folder', "arg": 'add_folder'}
				);
				break;

			case 'T':
				aMenu.push(
					{"title": 'MAIN_MENU::ADD_FOLDER', css: 'ico2 add_folder', "arg": 'add_folder'}
				);
				break;

			case 'N':
				aMenu.push(
					{"title": 'MAIN_MENU::ADD_FOLDER', css: 'ico2 add_folder', "arg": 'add_folder'}
				);
				break;

			case 'I':
				aMenu.push(
					{"title": 'CONFERENCE::INVITE', css: 'ico2 invite', "arg": 'invite', disabled:!aRights.write},
					{"title": 'MAIN_MENU::NEW_UPLOAD', css: 'ico2 upload', "arg": 'tch_upload', disabled:!aAccess.write}
				);
				break;

			case 'X':
				aMenu.push(
					{"title": 'MAIN_MENU::ADD_FOLDER', css: 'ico2 add_folder', "arg": 'add_folder'},
					{"title": 'POPUP_FOLDERS::ADD_SHARED_ACCOUNT', css:'ico2 share_account', "arg":'add_account', disabled:ids[0]!=sPrimaryAccount || !sPrimaryAccountSHARING}
				);

				bNoMore = true;
				break;

			//Items wo Share & More
			default:

					bShort = true;

					switch(sType){
						//Quarantine
						case 'Q':
							aMenu.push(
								{"title": 'MAIN_MENU::DELIVER', css: 'ico2 deliver', disabled:true},
								{"title": 'MAIN_MENU::BLACK_LIST', css: 'ico2 blacklist', disabled:true},
								{"title": 'MAIN_MENU::WHITE_LIST', css: 'ico2 whitelist', disabled:true}
							);
							del = {
								disabled: true
							};
							break;

						//Blacklist & Whitelist
						case 'QL':
							aMenu.push({"title": 'MAIN_MENU::NEW', "arg": 'new_ql', css: 'ico2 new'});

							if (ids[1] === 'SPAM_QUEUE/Blacklist')
								aMenu.push({"title": 'MAIN_MENU::WHITE_LIST', css: 'ico2 whitelist', disabled:true});
							else
								aMenu.push({"title": 'MAIN_MENU::BLACK_LIST', css: 'ico2 blacklist', disabled:true});

							aMenu.push({"title": 'POPUP_ITEMS::SEND_EMAIL_TO', css: 'ico2 send', disabled:true});
							del = {
								disabled: true
							};
							break;

						//Recovery
						case 'G':
							
							aMenu.push(
								{"title": 'POPUP_ITEMS::RECOVER', css: 'ico2 recover', disabled:true}
							);
							if (!dataSet.get('main',['keep_deleted_items_force_expiration'])) {
								aMenu.push(
									{"title": 'MAIN_MENU::EMPTY_FOLDER', "arg": 'empty', css: 'color2 ico2 empty'}
								);
								del = {
									disabled: true
								};
							}
							break;
					}
		}

	}
	//ITEM(s)
	else
	if (ids.length === 3){
		var bSingle = ids[2].length === 1,
			id = bSingle?ids.slice(0,2).concat(ids[2][0]):null;

		switch(sType){
			case 'M':
				var sPath = this.__currentFolder.join('/'),
					bTemplates = sPath === GWOthers.getItem('DEFAULT_FOLDERS','templates'),
					bSent = aFolder.DEFAULT == 'S';

				//SINGLE ITEM
				if (bSingle){

					//Templates
					if (bTemplates){
						aMenu.push(
							{"title": 'MAIN_MENU::NEW_FROM_TEMPLATE', 'arg': 'edit_message', css:'ico2 from_template'},
							{"title": 'POPUP_ITEMS::EDIT', 'arg': 'edit_template', css:'ico2 edit'}
						);
					}
					else{
						//Drafts
						if (aFolder.DEFAULT == 'D'){
							aMenu.push({"title": 'POPUP_ITEMS::EDIT', css: 'ico2 edit', 'arg': 'edit_message', disabled:!aAccess.modify});
						}

						if (aFolder.SPAM){
							aMenu.push(
								{"title": 'MAIN_MENU::REPLY_TO_SENDER', "arg": 'reply', css: 'ico2 reply'}
							);
						}
						else
						if (!aFolder.RSS){
							aMenu.push(
								{"title": 'MAIN_MENU::REPLY_TO_SENDER', "arg": 'reply', css: 'ico2 reply', disabled:bSent},
								{"title": 'MAIN_MENU::REPLY_TO_ALL', "arg": 'reply_all', css: 'ico2 reply_all'}
							);
						}

						aMenu.push(
							{"title": 'MAIN_MENU::FORWARD', 'arg': 'forward', css:'ico2 forward'}
						);
					}

					if (!bTemplates && !aFolder.RSS && aFolder.DEFAULT !== 'D') {
						if (aFolder.SPAM){
							if (dataSet.get('folders', [sPrimaryAccount, 'SPAM_QUEUE/Whitelist'])){
								aMenu.push(
									{"title": 'MAIN_MENU::WHITE_LIST', "arg": 'whitelist_sender', css: 'ico2 whitelist'}
								);
							}
						}
						else
						if (dataSet.get('folders', [sPrimaryAccount, 'SPAM_QUEUE/Blacklist'])){
							aMenu.push(
								{"title": 'MAIN_MENU::BLACK_LIST', "arg": 'blacklist_sender', css: 'ico2 blacklist'}
							);
						}
					}

					if (this.__currentView != 'mail_view_list' && aFolder.DEFAULT != 'H'){
						aMenu.push({'title': 'MAIN_MENU::PRINT', 'arg': 'print', css: 'ico2 print'});
					}

				}
				//MULTIPLE ITEMS
				else{
					aMenu.push(
						{"title":'POPUP_ITEMS::MOVE_MAIL_TO', 'arg': 'move', css: 'ico2 move', disabled:!aAccess.remove},
						{"title":'POPUP_ITEMS::COPY_MAIL_TO', 'arg': 'copy', css: 'ico2 copy'},
						{"title":'POPUP_ITEMS::MARK_AS_READ', 'arg': 'mark_read', css: 'ico2 markread', disabled:!aAccess.modify},
						{"title":'POPUP_ITEMS::MARK_AS_UNREAD', 'arg': 'mark_unread', css: 'ico2 markunread', disabled:!aAccess.modify}
					);
					if (!bTemplates && !aFolder.RSS && aFolder.DEFAULT !== 'D') {
						aMenu.push(aFolder.SPAM ?
							{"title": 'MAIN_MENU::WHITE_LIST', "arg": 'whitelist_sender', css: 'ico2 whitelist'} :
							{"title": 'MAIN_MENU::BLACK_LIST', "arg": 'blacklist_sender', css: 'ico2 blacklist'}
						);
					}
				}

				del = {
					disabled: !aAccess.remove
				};
				break;

			case 'E':

				//SINGLE ITEM
				if (bSingle){
					var iFlags = dataSet.get('items',id.concat('EVNFLAGS'));

					aMenu.push(
						{"title":'MAIL_VIEW::ACCEPT', 'arg': 'accept', css: 'ico2 accept', disabled:!(iFlags&32)},
						{"title":iFlags&2?'MAIL_VIEW::DECLINE':'MAIN_MENU::DELETE', 'arg': 'delete', css: 'ico2 ' + (iFlags&2?'decline':'delete'), disabled:!aAccess.remove}
					);
				}
				//MULTIPLE ITEMS
				else{
					aMenu.push(
						{"title":'POPUP_ITEMS::MOVE_ITEM_TO', 'arg': 'move', css: 'ico2 move', disabled:!aAccess.remove},
						{"title":'POPUP_ITEMS::COPY_ITEM_TO', 'arg': 'copy', css: 'ico2 copy'}
					);
				}

				break;

			case 'F':

			var bLocked = false;

			//SINGLE ITEM
				if (bSingle){
					sLockID = dataSet.get('items', id.concat('EVNLOCKOWN_ID'));
					bLocked = sLockID && sLockID != sPrimaryAccountGWID,
					sName = dataSet.get('items',id.concat('EVNTITLE'));

					if (Item.officeSupport(sName)){

						var aArgAuto = [Item.officeOpen, [{aid:id[0],fid:id[1],iid:id[2]},[Item.downloadFile,[id]], Path.extension(sName)]],
							aArgWeb = [Item.officeOpen, [{aid:id[0],fid:id[1],iid:id[2]},[Item.downloadFile,[id]], Path.extension(sName)]],
							aArgWebView = [Item.officeOpen, [{aid:id[0],fid:id[1],iid:id[2]}, [Item.downloadFile, [id]], Path.extension(sName), 'view']],
							aArgExt = [Item.officeOpen, [{aid:id[0],fid:id[1],iid:id[2]},[Item.downloadFile,[id]], Path.extension(sName),'external']],
							bIWD = dataSet.get('accounts', [sPrimaryAccount, 'OFFICE_SUPPORT']) == 'true';

						aMenu.push(
							{"title":'POPUP_ITEMS::OPEN', css: 'ico2 open', "arg": aArgAuto, nodes:[
								{"title":'DOCUMENT::OPENDOCUMENT', css:'ico2 open_edit', 'arg': aArgWeb, disabled: !bIWD},
								{"title":'DOCUMENT::OPENDOCUMENTVIEW', css:'ico2 open_edit', 'arg': aArgWebView, disabled: !bIWD},
								{"title":'OFFICELAUNCHER::OFFICESUITE', css:'ico2 open_suite', 'arg': aArgExt}
							]},
							{"title":'POPUP_ITEMS::DOWNLOAD_FILE', css: 'ico2 download', "arg": 'download_file'}
						);
					}
					else
						aMenu.push({"title":'POPUP_ITEMS::DOWNLOAD_FILE', css: 'ico2 download', "arg": 'download_file'});

				}
				//MULTIPLE ITEMS
				else{
					aMenu.push(
						{"title":'POPUP_ITEMS::MOVE_ITEM_TO', 'arg': 'move', css: 'ico2 move', disabled:!aAccess.remove},
						{"title":'POPUP_ITEMS::COPY_ITEM_TO', 'arg': 'copy', css: 'ico2 copy'}
					);
				}

				del = {
					disabled: !aAccess.remove || bLocked
				};
				break;

			case 'C':
				//SINGLE ITEM
				if (bSingle){
					var item = dataSet.get('items',id) || {};

					aMenu.push(
						{"title": 'IM::SEND_MAIL', css: 'ico2 send', "arg": 'send'},
						{"title": 'MAIN_MENU::DIAL', css: 'ico2 dial', "arg": 'dial', disabled: item.ITMCLASS == 'L'}
					);
					if(sPrimaryAccountCHAT)
						aMenu.push({title: 'POPUP_ITEMS::INVITE_TEAMCHAT', css: 'ico2 teamchat', arg: 'invite_to_teamchat'});
				}
				//MULTIPLE ITEMS
				else{
					aMenu.push(
						{"title":'POPUP_ITEMS::MOVE_ITEM_TO', 'arg': 'move', css: 'ico2 move', disabled:!aAccess.remove},
						{"title":'POPUP_ITEMS::COPY_ITEM_TO', 'arg': 'copy', css: 'ico2 copy'},
						{"title": 'MAIN_MENU::PRINT', css: 'ico2 print', "arg": 'print'}
					);
				}

				del = {
					disabled: !aAccess.remove
				};
				break;

			case 'T':
				//MULTIPLE ITEM
				if (!bSingle){
					aMenu.push(
						{"title":'POPUP_ITEMS::MOVE_ITEM_TO', 'arg': 'move', css: 'ico2 move', disabled:!aAccess.remove},
						{"title":'POPUP_ITEMS::COPY_ITEM_TO', 'arg': 'copy', css: 'ico2 copy'}
					);
				}

				aMenu.push(
					{"title": 'MAIN_MENU::PRINT', css: 'ico2 print', "arg": 'print'}
				);
				del = {
					disabled: !aAccess.remove
				};
				break;

			case 'N':
				//MULTIPLE ITEMS
				if (!bSingle){
					aMenu.push(
						{"title":'POPUP_ITEMS::MOVE_ITEM_TO', 'arg': 'move', css: 'ico2 move', disabled:!aAccess.remove},
						{"title":'POPUP_ITEMS::COPY_ITEM_TO', 'arg': 'copy', css: 'ico2 copy'}
					);
				}

				aMenu.push(
					{"title": 'MAIN_MENU::PRINT', css: 'ico2 print', "arg": 'print'}
				);

				del = {
					disabled: !aAccess.remove
				};
				break;

			default:
				bShort = true;
				switch(sType){

					//Quarantine
					case 'Q':
						aMenu.push({"title": 'MAIN_MENU::DELIVER', "arg": 'new_doc', css: 'ico2 deliver'},
							{"title": 'MAIN_MENU::BLACK_LIST', "arg": 'blacklist', css: 'ico2 blacklist'},
							{"title": 'MAIN_MENU::WHITE_LIST', "arg": 'whitelist', css: 'ico2 whitelist'}
						);
						del = true;
						break;

					//Blacklist & Whitelist
					case 'QL':
						aMenu.push({"title": 'MAIN_MENU::NEW', "arg": 'new_ql', css: 'ico2 new'});

						if (ids[1] === 'SPAM_QUEUE/Blacklist')
							aMenu.push({"title": 'MAIN_MENU::WHITE_LIST', "arg": 'whitelist', css: 'ico2 whitelist'});
						else
							aMenu.push({"title": 'MAIN_MENU::BLACK_LIST', "arg": 'blacklist', css: 'ico2 blacklist'});

						aMenu.push({"title": 'POPUP_ITEMS::SEND_EMAIL_TO', "arg": 'send', css: 'ico2 send'});
						del = true;
						break;

					//Recovery
					case 'G':
						
						aMenu.push(
							{"title": 'POPUP_ITEMS::RECOVER', "arg": 'recover', css: 'ico2 recover'}
						);
						if (!dataSet.get('main',['keep_deleted_items_force_expiration'])) {
							del = true;
							aMenu.push(
								{"title": 'MAIN_MENU::EMPTY_FOLDER', "arg": 'empty', css: 'color2 ico2 empty'}
							);
						}
						break;
				}
		}
	}

	if (!bNoMore && (!bShort && aMenu.length))
		aMenu.push({"title":'COMMON::MORE', css: 'ico2 more noarrow', "arg": 'more', nodetype: 'click', keep:true, callback: [this, '__more_menu', [dataSet.get('items', [ids[0], ids[1], ids[2]])]]});

	if (ids.length === 2 && !bShort && sType != 'I' && aRights.owner) {
		var title = 'POPUP_FOLDERS::SHARING';
		if(sType === 'E') {
			title = 'POPUP_FOLDERS::SHARING_CALENDAR';
		} else if(sType === 'X') {
			title = 'POPUP_FOLDERS::SHARING_ACCOUNT';
		}
		aMenu.push({"title": title, css: 'ico2 share_folder', "arg": 'share', disabled:ids[0] != sPrimaryAccount});
	}

	del && aMenu && aMenu.push({"title": 'MAIN_MENU::DELETE', "arg": 'delete', css: 'color2 ico2 delete', disabled: (del || {}).disabled});

	this._fill(aMenu, 'static');
};

_me.__more_menu = function (e, id, parentData, aData) {
	var aMenu,
		sType = WMFolders.getType(this.__currentFolder),
		aAccess = WMFolders.getAccess(this.__currentFolder),
		ids = this.__currentIDs;

	try{
		//Item
		if (ids[2] && ids[2].length){
			storage.library('obj_context_item');

			var id = ids.slice(0,2).concat(ids[2][0]);
			switch(sType){
				case 'M':
					aMenu = obj_context_item.prototype.__createMailMenu.call(null,
						id,
						ids,
						ids[2] && ids[2].length>1,
						dataSet.get('items', id.concat('FROM')),
						aAccess,
						true
					);
					break;

				default:

					if (sType == 'C' && aData.ITMCLASS == 'L')
						sType = 'L';

					aMenu = obj_context_item.prototype.__createGWMenu.call(null,
						id,
						ids,
						sType,
						ids[2] && ids[2].length>1,
						"",
						aAccess,
						{C:'ITMCLASSIFYAS', F:'EVNFILENAME'}[sType] ||  "EVNTITLE",
						gui.frm_main.main.list,
						true,
						aData
					);
				break;
			}
		}
		//Folder
		else{
			storage.library('obj_tree_folder_context');
			storage.library('obj_context_folder');
			aMenu = obj_tree_folder_context.__createFolderMenu({aid:this.__currentFolder[0], fid:this.__currentFolder[1]}, true);
			parentData.arg2 = obj_context_folder.prototype._onclick;
		}
	}
	catch(r){
		aMenu = false;
	}

	return aMenu || false;
};

_me._onclick = function (e, elm, id, arg) {

	if (e.__arg2){
		if(!e.__arg2.apply({_owner:gui.frm_main.bar.tree.folders}, arguments)) {
			return;
		}
	}
	else
	//More -> obj_context_item uses callbacks directly
	if (Is.Array(arg)) {
		executeCallbackFunction(arg);
		return;
	}

	var sType = WMFolders.getType(this.__currentFolder),
		sPath = this.__currentFolder.join('/'),
		ids = this.__currentIDs,
		aFolderId = {aid:this.__currentFolder[0],fid:this.__currentFolder[1]};

	if (sType === 'X')
		delete aFolderId.fid;

	var args = clone(arg);
	if (Is.Object(arg))
		arg = arg.arg;

	//console.warn(arg, this.__currentFolder, sType, sPath);

	switch (arg) {
		//Mail
		case 'new_mail':
			NewMessage.compose({alias:Item.getAliasFromPath(sPath)});
			break;
		case 'new_template':
			NewMessage.compose({template:true});
			break;
		case 'add_folder':
			storage.library('obj_context_folder');
			Folder.addFolder(aFolderId, [obj_context_folder.__openFolder]);
			break;
		case 'add_account':
			storage.library('obj_context_folder');
			obj_context_folder.prototype._onclick.call(obj_context_folder.prototype,null,null,null,{aid:'',fid:'',method:'add_account'});
			break;
		case 'add_favorite':
			if (gui.frm_main.bar && gui.frm_main.bar.fav)
		 		gui.frm_main.bar.fav._ondrop({value: [{aid: this.__currentFolder[0], fid: this.__currentFolder[1]}], type:'folder'});
		 	break;
		//RSS
		case 'change_channel':
			Folder.changeChannel(aFolderId);
			break;
		//File
		case 'upload_file':
			gui._create('insert_item', 'frm_insert_item', '', 'frm_insert_item_nobottomdiv', [gui.frm_main, '__copyItem', [this.__currentFolder]], this.__currentFolder[0], this.__currentFolder[1], '', 'r', false, ['F', 'I', 'X'], 'X');
			break;
		case 'download_file':
			Item.downloadFile([ids[0],ids[1],ids[2][0]]);
			break;
		//B&W
		case 'new_ql':
			gui._create('frm_blackwhite', 'frm_blackwhite', '', '', this.__currentFolder[0], this.__currentFolder[1]);
			break;
		//All Folders
		case 'empty':
			Folder.empty(aFolderId);
			break;
		case 'share':
			Folder.share(aFolderId);
			break;

		case 'new_item':
			switch(sType){
				case 'E':
					if (gui.frm_main.main && (gui.frm_main.main._type === 'frm_main_calendar_dayweek' || gui.frm_main.main._type === 'frm_main_calendar_month'))
						gui.frm_main.main._createEvent();
					else
						Item.openwindow(this.__currentFolder, getActualEventTime(), null, sType);

					break;

				case 'I':
						var aMap = {'.docx':'_word','.xlsx':'_excel','.pptx':'_ppoint'};
						if (aMap[args.type] && gui.frm_main.main[aMap[args.type]])
							gui.frm_main.main[aMap[args.type]]();
					break;

				default:
					var aValues;
					if (args.type)
						aValues = {'ATTACHMENTS': [{'values': {'ATTTYPE': 'document', 'ATTDESC': args.type}}]};

					Item.openwindow(this.__currentFolder, aValues, null, sType);
			}
			break;
		case 'tch_upload':
			if (gui.frm_main.main._attachFile)
				gui.frm_main.main._attachFile();
			break;
		case 'add_room':
			Folder.addFolder(aFolderId, [Folder.openFolder]);
			break;
		case 'invite':
			if (gui.frm_main.main._addMember)
				gui.frm_main.main._addMember();
			break;
		case 'print_calendar':
		case 'print_list':
			if (gui.frm_main.main && gui.frm_main.main._print)
				gui.frm_main.main._print(arg == 'print_calendar');
			break;

		//ITEMS
		default:
			if (ids.length === 3){

				var id = this.__currentFolder.concat(ids[2].slice(0,1));

				switch(arg){
					//Recovery items
					case 'recover': Item.recover(ids);
						break;
					case 'deliver': OldMessage.deliver(ids);
						break;
					case 'whitelist': OldMessage.whitelist(ids);
						break;
					case 'blacklist': OldMessage.blacklist(ids);
						break;

					case 'send':
					case 'invite_to_teamchat':
						var item = dataSet.get('items', id),
							email;

						if (item.ITMCLASS == 'L')
							email = '[' + ids[1] + '::' + (item.ITMCLASSIFYAS || item.ITMTITLE)+']';
						else
							email = item.LCTEMAIL1 || item.LCTEMAIL2 || item.LCTEMAIL3 || item.SNDEMAIL;

						if (email){
							if (arg == 'send')
								NewMessage.compose({to:email});
							else{
								Item.invite_tch(email);
							}
						}
						break;

					case 'dial':
						gui.frm_main.__showDialDialog.apply(null, id);
						break;
					case 'delete':
							if (gui.frm_main && gui.frm_main.main && gui.frm_main.main.list && gui.frm_main.main.list.__deleteItems)
								gui.frm_main.main.list.__deleteItems({aid:ids[0],fid:ids[1]},ids[2]);
							else
							if (gui.frm_main && gui.frm_main.main && gui.frm_main.main.calendar){
								if (ids[2].length == 1){
									var aid = ids[0],
										fid = ids[1],
										id  = ids[2][0],
										oRepeating, n;

									if (Item.hasReccurence([aid, fid, id]))
										oRepeating = dataSet.get('items', [aid, fid, id]);

									//strip pipe
									if ((n = id.indexOf('|')) >= 0)
										id = id.substr(0,n);

									Item.remove([aid, fid, [id]], false, oRepeating, gui.frm_main.main.calendar);
								}
							}
							else
								Item.remove(ids);

						break;

					//Mail
					case 'mark_read':
						OldMessage.markAsRead(ids);
						break;
					case 'mark_unread':
						OldMessage.markAsUnread(ids);
						break;

					case 'reply':
						OldMessage.reply(id);
						break;
					case 'reply_all':
						OldMessage.reply(id,true);
						break;
					case 'forward':
						OldMessage.forward(id);
						break;
					case 'edit_message':
						OldMessage.edit(id);
						break;
					case 'edit_template':
							OldMessage.edit(id,{template:true});
						break;
					case 'blacklist_sender':
						OldMessage.blacklistSender(ids);
						break;
					case 'whitelist_sender':
						OldMessage.whitelistSender(ids);
						break;

					//Event
					case 'accept':
						WMItems.imip({aid: id[0], fid: id[1], iid: id[2]},'accept',[function(bOK){
							if (bOK){
								//redraw menu
								var itm = dataSet.get('items',id);
								if (itm['EVNFLAGS'] & 32){
									itm['EVNFLAGS'] -= 30;

									dataSet.update('items',id);
									this.__menu(this.__currentIDs);
								}
								//refresh view
								else
									Item.__refreshView(ids);
							}

						}.bind(this)]);
						break;

					//Generic item
					case 'move':
						Item.move(ids);
						break;
					case 'copy':
						Item.copy(ids);
						break;

					case 'print':
						switch(sType){
							case 'M':
								if (gui.frm_main.main && gui.frm_main.main.mailview)
									gui.frm_main.main.mailview._print();
							default:
								Item.print(ids);
						}
						break;
				}
			}
	}

};
