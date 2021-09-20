_me = obj_hmenu_basic2.prototype;
function obj_hmenu_basic2(){};

// Hide Labels when size smaller then 1200px;
_me.__constructor = function(){
	gui._obeyEvent('resize', [this,'__checkSize']);
	this._add_destructor('__destructCheck');
};
	_me.__checkSize = function (){

		if (document.body.clientWidth<1200 && this._main.firstChild){
			var tmp = mkElement('div',{className:'obj_hmenu obj_hmenu_basic2',style:{position: 'absolute', top: '-100px', left: 0, visibility: 'hidden'}});
				tmp.innerHTML = this._main.innerHTML;

			document.body.appendChild(tmp);

			var w = tmp.offsetWidth || 0;

			if (tmp.parentNode)
				tmp.parentNode.removeChild(tmp);

			if (w && w > document.body.clientWidth-380-gui.frm_main.hmenu1._main.offsetWidth){
				addcss(this._main,'short');
				return;
			}
		}

		if (hascss(this._main,'short'))
			removecss(this._main,'short');
	};
	_me.__destructCheck = function(){
		gui._disobeyEvent('resize', [this,'__checkSize']);
	};

// Refill menu when selected items change in datagrid
_me._contextRefill = function(ids) {
	var a = this.__currentFill;
	if (a)
		this._contextFill(a[0],a[1],a[2],a[3],ids);
};

// Fill menu with custom options depending on type when changing folder type
_me._contextFill = function(sType, oFolder, sView, bEnabled, ids)
{
	this.__currentFill = arguments;

	var bEnabled = bEnabled?true:false,
		aMenu = [];

	ids = ids || [];

	var oFolder = clone(oFolder); //important!

	this.__oFolder = oFolder;
	this.__bEnabled = bEnabled;

	switch(sType)
	{
		case 'G':
			aMenu.push(
				{"title": 'POPUP_ITEMS::RECOVER', 'arg': 'recover', disabled: !ids.length},
				{"title": '-'},
				{"title": 'MAIN_MENU::DELETE', 'arg': 'delete', disabled: !ids.length},
				{"title": 'MAIN_MENU::EMPTY_FOLDER', 'arg': 'empty_folder', disabled: false});
			break;

		case 'M':
			var folders = GWOthers.get('DEFAULT_FOLDERS','storage')['VALUES'],
				sTrashFolder = folders['trash'],
				sDraftFolder = folders['drafts'],
				sTemplateFolder = folders['templates'],
				sSentFolder = folders['sent'],
				sSpamFolder = dataSet.get('main',['spam_path']),
				bRSS = dataSet.get('folders',[oFolder['aid'],oFolder['fid'],'RSS'])?true:false,
				sFolderID = oFolder['aid'] + '/' + oFolder['fid'];

			if (sFolderID == sTemplateFolder){
				aMenu.push(
					{"title": 'MAIN_MENU::NEW_MESSAGE', 'arg': 'edit_message', disabled:!bEnabled || ids.length!=1},
					{"title": 'POPUP_ITEMS::EDIT', 'arg': 'edit_template', disabled:!bEnabled || ids.length!=1}
				);
			}
			else
			if (sFolderID!=sTrashFolder)
			{
				if (sFolderID == sDraftFolder)
					aMenu.push({"title": 'POPUP_ITEMS::EDIT', 'arg': 'edit_message', disabled:!bEnabled || ids.length!=1});
				else
				if (!bRSS){
/*
					if (sFolderID != sSentFolder)
						aMenu.push({"title": 'MAIN_MENU::REPLY_TO_SENDER', 'arg': 'reply_to_sender', css: 'ico reply', disabled:!bEnabled || ids.length!=1});

					aMenu.push({"title": 'MAIN_MENU::REPLY_TO_ALL', 'arg': 'reply_to_all', css: 'ico reply_all', disabled:!bEnabled || ids.length!=1});
*/
					if (sFolderID != sSentFolder)
						aMenu.push({"title": 'MAIN_MENU::REPLY_TO_SENDER', 'arg': 'reply_to_sender', css: 'ico reply', disabled:!bEnabled || ids.length!=1},
								{"title": 'MAIN_MENU::REPLY_TO_ALL', 'arg': 'reply_to_all', css: 'ico reply_all', disabled:!bEnabled || ids.length!=1});
					else
						aMenu.push({"title": 'MAIN_MENU::REPLY_TO_ALL', 'arg': 'reply_to_all', css: 'ico reply', disabled:!bEnabled || ids.length!=1});
				}

				aMenu.push({"title": 'MAIN_MENU::FORWARD', 'arg': 'forward_from_hmenu', css:'ico forward', disabled:!bEnabled || ids.length!=1});
				// if ((GWOthers.getItem('RESTRICTIONS', 'disable_redirect') || 0)<1)
				// 	aMenu[aMenu.length-1].nodes = [{"title": 'POPUP_ITEMS::REDIRECT', 'disabled': !bEnabled || ids.length!=1, 'arg': [OldMessage.redirect, [ids[0]]]}];
			}

			if (sFolderID == sTrashFolder || sFolderID == sSpamFolder)
				aMenu.push({"title":'MAIN_MENU::EMPTY_FOLDER', 'arg': 'empty_folder', css: 'ico empty'});

			aMenu.push(
				{"title": '-'},
				{"text": '', tooltip: 'COMMON::MORE', 'arg': 'options', 'css': 'ico img menu noarrow', disabled: !ids.length, keep:true, nodetype: 'click', callback: [
					function(){
						var aMenu = [];

						if (ids.length){
							try{
								aMenu = obj_context_item.prototype.__createMailMenu.call(this,
									[oFolder.aid,oFolder.fid,oFolder.iid || ids[0]],
									[oFolder.aid,oFolder.fid,ids],
									ids.length>1,
									dataSet.get('items',[oFolder.aid,oFolder.fid,oFolder.iid || ids[0],'FROM']),
									WMFolders.getAccess(oFolder),
									true
								) || [];
							}
							catch(r){
								aMenu = [];
							}
						}

						return aMenu;
					}
				]},
				{"text":'', tooltip: 'MAIN_MENU::DELETE', 'arg': 'delete', css: 'ico img delete', disabled:!bEnabled || !ids.length});

			if (sView != 'mail_view_list' && sFolderID != sTrashFolder)
				aMenu.push({"text":'', tooltip: 'MAIN_MENU::PRINT', 'arg': 'print', css: 'ico img print', disabled: !ids.length});

			break;

		case 'E':
			// Check if work week is specified and not same as full week
			var bgn = GWOthers.getItem('CALENDAR_SETTINGS','workweek_begins');
			var end = GWOthers.getItem('CALENDAR_SETTINGS','workweek_ends');
			var workweek = bgn>0 && end>0 && !(bgn==1 && end==7);
			// Add day and week view for calendar
			aMenu = [
				{"title": 'MAIN_MENU::DAY_VIEW', 'arg': 'day_view', css: 'ico day' + (sView == 'day_view'?' active':'')},
				{"title": (workweek?'MAIN_MENU::FULLWEEK_VIEW':'MAIN_MENU::WEEK_VIEW'), 'arg':  'week_view', css: 'ico week' + (sView == 'week_view'?' active':'')}
			];
			// Add work view
			if(workweek)
				aMenu.push({"title": 'MAIN_MENU::WORKWEEK_VIEW', 'arg':  'workweek_view', css: 'ico week' + (sView == 'workweek_view'?' active':'')});
			// Month and list view and rest
			aMenu.push(
				{"title": 'MAIN_MENU::MONTH_VIEW', 'arg': 'month_view', css: 'ico month' + (sView == 'month_view'?' active':'')},
				{"title": 'MAIN_MENU::EVENTS_LIST', 'arg': 'goto_list', css: 'ico list' + (sView == 'list_wide' || sView == 'list_view' || sView == 'list'?' active':'')},
				{"title": '-'},
				{"text": '', tooltip: 'COMMON::MORE', 'arg': 'options', 'css': 'ico img menu noarrow', disabled: !ids.length, keep: true, nodetype: 'click', callback: [
					function(){
						var aMenu = [];

						if (ids.length){
							try{
								aMenu = obj_context_item.prototype.__createGWMenu.call(this,
									[oFolder.aid,oFolder.fid,oFolder.iid || ids[0]],
									[oFolder.aid,oFolder.fid,ids],
									'E',
									ids.length>1,
									"",
									WMFolders.getAccess(oFolder),
									"EVNTITLE",
									undefined,
									true
								) || [];
							}
							catch(r){
								aMenu = [];
							}
						}

						return aMenu;
					}
				]},
				{"text": '', tooltip: 'MAIN_MENU::DELETE', 'arg': 'delete', css: 'ico img delete', disabled: !ids.length}
			);

			if (sView == 'day_view' || sView == 'week_view' || sView == 'workweek_view' || sView == 'month_view')
				aMenu.push({"text": '', tooltip: 'MAIN_MENU::PRINT', 'arg': 'print_calendar', css: 'ico img print noarrow', nodes:[
					{"title": 'MAIN_MENU::PRINT_CALENDAR', 'arg': 'print_calendar', css: 'ico print'},
					{"title": 'MAIN_MENU::EVENTS_LIST', 'arg': 'print_list', css: 'ico print'}
				]});

			break;

		case 'C':

			if (sPrimaryAccountSIP || sPrimaryAccountSMS || sPrimaryAccountCONFERENCE){
				if (sPrimaryAccountSIP)
					aMenu.push({"title": 'MAIN_MENU::DIAL', 'arg': 'dial', css: 'ico dial'});

				if (sPrimaryAccountCONFERENCE)
					aMenu.push({"title": 'MAIN_MENU::CONFERENCE', 'arg': 'conference', css: 'ico conference'});

				if (sPrimaryAccountSMS)
					aMenu.push({"title": 'MAIN_MENU::SMS', 'arg': 'sms', css: 'ico sms', disabled: !ids.length});

				aMenu.push({"title": '-'});
			}

			aMenu.push(
				{"text": '', tooltip: 'COMMON::MORE', 'arg': 'options', 'css': 'ico img menu noarrow', disabled: !ids.length, keep: true, nodetype: 'click', callback: [
					function(){
						var aMenu = [];

						if (ids.length){
							try{
								aMenu = obj_context_item.prototype.__createGWMenu.call(this,
									[oFolder.aid,oFolder.fid,oFolder.iid || ids[0]],
									[oFolder.aid,oFolder.fid,ids],
									'C',
									ids.length>1,
									"",
									WMFolders.getAccess(oFolder),
									"ITMCLASSIFYAS",
									undefined,
									true
								) || [];
							}
							catch(r){
								aMenu = [];
							}
						}

						return aMenu;
					}
				]},
				{"text":'', tooltip: 'MAIN_MENU::DELETE', 'arg': 'delete', css: 'ico img delete', disabled: !ids.length}
			);
			break;

		case 'F':
			aMenu.push(
				{"title": 'ATTACHMENT::UPLOAD', 'arg': 'upload', css: 'ico open'},
				/*{"title": 'MAIN_MENU::NEW_DOCUMENT', css: 'ico plus', nodes:[
					{"title": 'MAIN_MENU::NEW_WORD', "arg": 'new_file_w'},
					{"title": 'MAIN_MENU::NEW_EXCEL', "arg": 'new_file_e'},
					{"title": 'MAIN_MENU::NEW_PPOINT', "arg": 'new_file_p'},
					{"title": '-'},
					{"title": 'MAIN_MENU::NEW_TEXT', "arg": 'new_file_t'},
					{"title": 'MAIN_MENU::NEW_HTML', "arg": 'new_file_h'}
				]},*/
				//{"text":'', tooltip: 'FILE::LOCK', 'arg': 'lock', css: 'ico img lock', disabled: !ids.length},
				{"title": '-'}
			);

		case 'T':
		case 'J':
		case 'N':
			aMenu.push(
				{"text": '', tooltip: 'COMMON::MORE', 'arg': 'options', 'css': 'ico img menu noarrow', disabled: !ids.length, keep: true, nodetype: 'click', callback: [
					function(){
						var aMenu = [];

						if (ids.length)
							try{
								aMenu = obj_context_item.prototype.__createGWMenu.call(this,
									[oFolder.aid,oFolder.fid,oFolder.iid || ids[0]],
									[oFolder.aid,oFolder.fid,ids],
									sType,
									ids.length>1,
									"",
									WMFolders.getAccess(oFolder),
									sType=='F' ? "EVNFILENAME" : "EVNTITLE",
									gui.frm_main.main.list,
									true
								) || [];
							}
							catch(r){
								aMenu = [];
							}

						return aMenu;
					}
				]},
				{"text":'', tooltip: 'MAIN_MENU::DELETE', 'arg': 'delete', css: 'ico img delete', disabled: !ids.length}
			);

			break;

		case 'Q':
			aMenu = [
				/*
				{"title": 'MAIN_MENU::WHITE_LISTED', 'arg': 'Whitelist'},
				{"title": 'MAIN_MENU::BLACK_LISTED', 'arg': 'Blacklist'},
				{"title": '-'},
				*/
				{"title": 'MAIN_MENU::DELIVER', 'arg': 'deliver', css: 'ico deliver', disabled: !ids.length},
				{"title": 'MAIN_MENU::WHITE_LIST', 'arg': 'whitelist', disabled: !ids.length},
				{"title": 'MAIN_MENU::BLACK_LIST', 'arg': 'blacklist', disabled: !ids.length},
				{"title": '-'},
				{"text":'', tooltip: 'MAIN_MENU::DELETE', 'arg': 'delete', css: 'ico img delete', disabled: !ids.length}];
			break;

		case 'QL':
			if (oFolder['fid'].indexOf('White') >= 0) {
				aMenu = [
					{"title": 'MAIN_MENU::BLACK_LIST', 'arg': 'blacklist', disabled: !ids.length},
					{"title": '-'},
					{"text":'', tooltip: 'MAIN_MENU::DELETE', 'arg': 'delete', css: 'ico img delete', disabled: !ids.length}];
			}
			else {
				aMenu = [
					{"title": 'MAIN_MENU::WHITE_LIST', 'arg': 'whitelist', disabled: !ids.length},
					{"title": '-'},
					{"text":'', tooltip: 'MAIN_MENU::DELETE', 'arg': 'delete', css: 'ico img delete', disabled: !ids.length}];
			}
			break;
	}

	//Preview
	switch (sType){
		case 'QL':
		case 'G':
		case 'X':
			break;
		case 'E':
			if (sView == 'day_view' || sView == 'week_view' || sView == 'workweek_view' || sView == 'month_view')
				break;

		default:
			var ico = 'preview';
			switch(sView){
				case 'mail_view_wide':
				case 'list_wide':
					ico = 'wpreview';
				break;
				case 'mail_view_list':
				case 'list':
					ico = 'lpreview';
				break;
			}

			if (aMenu.length)
			aMenu.push(
				{"title": '-'},
				{"text":'', tooltip: 'ITEMVIEW::PREVIEW', 'css':'noarrow ico img '+ico, nodetype: 'click', callback:[this,'__previewMenu',[sType,sView]]});
	}

	this._main.style.display = aMenu.length?'block':'none';

	this._fill(aMenu,'dynamic');

	this.__checkSize();
};

_me.__previewMenu = function(e, id, sType,sView){
	//Preview
	var a = [];
	if (sType == 'M' || sType == 'Q'){
		a.push(
			{"title": 'ITEMVIEW::DOWN', 'arg':'mail_view', 'css':'ico ico2 preview' + (sView == 'mail_view'?' check':'')},
			{"title": 'ITEMVIEW::RIGHT', 'arg':'mail_view_wide', 'css':'ico ico2 wpreview' + (sView == 'mail_view_wide'?' check':'')},
			{"title": 'ITEMVIEW::NONE', 'arg':'mail_view_list', 'css':'ico ico2 lpreview' + (sView == 'mail_view_list'?' check':'')}
		);
	}
	else{
		a.push(
			{"title": 'ITEMVIEW::DOWN', 'arg':'list_view', 'css':'ico ico2 preview' + (sView == 'list_view'?' check':'')},
			{"title": 'ITEMVIEW::RIGHT', 'arg':'list_wide', 'css':'ico ico2 wpreview' + (sView == 'list_wide'?' check':'')},
			{"title": 'ITEMVIEW::NONE', 'arg':'list', 'css':'ico ico2 lpreview' + (sView == 'list'?' check':'')}
		);
	}

	//Folders
	var ld = Cookie.get(['hide_tree']);
	a.push(
		{title:'-'},
		{title:'MAIN_MENU::LEFTPANEL', css:'ico', nodes:[
			{"title": 'COMMON::EXPAND', 'arg':'lp_expand', 'css':'ico2' + (ld == '2'?' check':'')},
			{"title": 'COMMON::COLLAPSED', 'arg':'lp_collapsed', 'css':'ico2' + (ld == '1'?' check':'')},
			{"title": 'COMMON::AUTOCOLLAPSED', 'arg':'lp_auto', 'css':'ico2' + (!ld?' check':'')}
		]}
	);

	//IM
	if (window.sPrimaryAccountIM && (GWOthers.getItem('RESTRICTIONS', 'disable_im') || 0)<1) {
		var rd = Cookie.get(['hide_im']);
		a.push(
			{title:'MAIN_MENU::RIGHTPANEL', css:'ico', nodes:[
				{"title": 'COMMON::EXPAND', 'arg':'rp_expand', 'css':'ico2' + (rd == '2'?' check':'')},
				{"title": 'COMMON::COLLAPSED', 'arg':'rp_collapsed', 'css':'ico2' + (rd == '1'?' check':'')},
				{"title": 'COMMON::AUTOCOLLAPSED', 'arg':'rp_auto', 'css':'ico2' + (!rd?' check':'')}
			]}
		);
	}

	return a;
};

_me.__manageEmptyItems = function(id,sAction) {
	switch (sAction) {
		case 'print_calendar':
		case 'print_list':
			if (gui.frm_main.main && gui.frm_main.main._print)
				gui.frm_main.main._print(sAction == 'print_calendar');
		    return;

		case 'dial':
			if (id[2]) return false;
			gui.frm_main.__showDialDialog();
			return true;

		case 'conference':
			if (id[2]) return false;
			gui.frm_main.__showConferenceDialog();
			return true;

		case 'goto_list':
			var aView = Cookie.get(['views',this.__oFolder['aid'],this.__oFolder['fid']]);
			switch(aView.prev){
				case '1': sAction = 'list_view'; break;
				case '2': sAction = 'list_wide'; break;
				default: sAction = 'list';
			}

		case 'day_view':
		case 'week_view':
		case 'workweek_view':
		case 'month_view':
			gui.frm_main._selectView(this.__oFolder, sAction, true);
			return true;

		case 'empty_folder':
			gui._create('frm_confirm', 'frm_confirm', '', '',[function() {
				WMFolders.__emptyFolder(this.__oFolder['aid'], this.__oFolder['fid']);
			}],
				'CONFIRMATION::EMPTY_FOLDER_CONFIRMATION', 'CONFIRMATION::EMPTY_FOLDER'
			);
			return true;
	}

	return false;
};

_me.__manageOneItem = function(id, sAction) {
	switch (sAction) {
		case 'reply_to_sender': OldMessage.reply(id, false); return true;
		case 'reply_to_all': OldMessage.reply(id, true); return true;
		case 'reply_to_sender_t': OldMessage.replyTemplate(id, false); return true;
		case 'reply_to_all_t': OldMessage.replyTemplate(id, true); return true;
		case 'forward_from_hmenu': OldMessage.forward(id); return true;
		case 'edit_message': OldMessage.edit(id); return true;
		case 'edit_template': OldMessage.edit(id, {template:true}); return true;
		case 'dial':
			gui.frm_main.__showDialDialog(id[0], id[1], id[2]);
			return true;
		case 'conference':
			gui.frm_main.__showConferenceDialog(id[0], id[1], id[2]);
			return true;
		case 'sms':
			gui.frm_main.__showSMSDialog(id[0], id[1], id[2]);
			return true;
		case 'office':
			var arr = clone(id);
				arr.push('EVNTITLE');
			var sName = dataSet.get('items',arr) || '',
				ext = Path.extension(sName);

			//Open in Office
			switch(ext){
			case 'txt':
			case 'htm':
			case 'html':
				Item.editFile(id);
				break;

			case 'pdf':
				Item.openPDF(id);
				break;

			case 'mp3':
				Item.playFile(id);
				break;

			default:
				if (!sPrimaryAccountWebDAV || (sName && !Item.officeSupport(sName)))
					Item.downloadFile(id);
				else
					Item.officeOpen({aid:id[0],fid:id[1],iid:id[2]},[Item.downloadFile,[id]], ext);
			}

			return true;
	}

	return false;
};

_me.__manageMoreItems = function(ids, sAction) {
	switch (sAction) {
		case 'delete':
			if (ids){

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
			}
			break;

		case 'lock':

			//Try to get Lock_id
			var sLockID;
			if (!(sLockID = dataSet.get('items',[ids[0], ids[1], ids[2][ids[2].length-1],'EVNLOCKOWN_ID'])))
				sLockID = dataSet.get('items', [ids[0], ids[1], ids[2][ids[2].length-1],'EVNLOCKOWN_ID']);

			var aRights = WMFolders.getRights({aid:ids[0], fid:ids[1]}),
				bLocked = sLockID && sLockID != sPrimaryAccountGWID && !aRights.owner;

			if (!bLocked)
				Item.set_lock(ids, (sLockID?false:true), true);

			break;

		case 'office':
			Item.downloadMultiple(ids);
			break;

		case 'recover': Item.recover(ids); break;
		case 'deliver': OldMessage.deliver(ids); break;
		case 'whitelist': OldMessage.whitelist(ids); break;
		case 'blacklist': OldMessage.blacklist(ids); break;
		case 'sms':	gui.frm_main.__showSMSDialog(ids[0], ids[1], ids[2]);
	}
};

// Execute command when clicking on menu
_me._onclick = function(e, elm, id, sAction)
{

	// Execute callback when arg is not a string command
	if(typeof sAction != "string") {
		executeCallbackFunction(sAction);
	}

	// Handle normal string commands
	switch(sAction){
		case 'upload': gui.frm_main.upload.file._click(); return;
		case 'new_file_w': gui.frm_main.hmenu1.__createNewGW('F','.docx'); return;
		case 'new_file_e': gui.frm_main.hmenu1.__createNewGW('F','.xlsx'); return;
		case 'new_file_p': gui.frm_main.hmenu1.__createNewGW('F','.pptx'); return;
		case 'new_file_t': gui.frm_main.hmenu1.__createNewGW('F','.txt'); return;
		case 'new_file_h': gui.frm_main.hmenu1.__createNewGW('F','.html'); return;

		//Preview
		case 'mail_view':
		case 'mail_view_wide':
		case 'mail_view_list':
		case 'list_view':
		case 'list_wide':
		case 'list':

			// Temporary solution to ask user if upload should be cancelled
			// @todo: implement datagrid upload that does not fail when list view is changed (if list is destructed, upload should be saved correctly anyway)
			if(gui.frm_main.main) {
				if(gui.frm_main.main._uploading) {
					return gui._create('stop_upload','frm_confirm','','',[function(){
						gui.frm_main.main._uploading = false;
						gui.frm_main.main._changeview(sAction);
					}],'ALERTS::ALERT','CONFIRMATION::STOPUPLOAD');
				}
				gui.frm_main.main._changeview(sAction);
			}
			return;

		//Left Pane
		case 'lp_expand':
			Cookie.set(['hide_tree'], 2);
			gui.frm_main._resize_handler();
       		break;
		case 'lp_collapsed':
			Cookie.set(['hide_tree'], 1);
			gui.frm_main._resize_handler();
       		break;
		case 'lp_auto':
			Cookie.set(['hide_tree'], '');
			gui.frm_main._resize_handler();
       		break;

       	//Right Pane
		case 'rp_expand':
			Cookie.set(['hide_im'], 2);
			gui.frm_main._rightDock(true);
       		break;
		case 'rp_collapsed':
			Cookie.set(['hide_im'], 1);
			gui.frm_main._rightDock(false);
       		break;
		case 'rp_auto':
			Cookie.set(['hide_im'], '');
			gui.frm_main._rightDock(false);
       		break;
	}

	if (sAction == 'delete' && gui.frm_main.main.calendar){
        var aSelectedItems = gui.frm_main.main.calendar._selectedItems();
		if (aSelectedItems.length)
			this.__manageMoreItems([this.__oFolder['aid'], this.__oFolder['fid'], aSelectedItems], sAction);
	}
	else
	if (!gui.frm_main.main.list)
		this.__manageEmptyItems([aid, fid],sAction);
	else {

		switch(sAction){
		case 'print':
			if (gui.frm_main.main && gui.frm_main.main.mailview)
				gui.frm_main.main.mailview._print();
			return;
		case 'Whitelist':
		case 'Blacklist':
//		case 'Quarantine':
			//gui.frm_main.bar.tree.folders._setActive(this.__oFolder['aid']+'/SPAM_QUEUE/'+sAction);
			//gui.frm_main.bar.tree.folders._handleNode({aid:this.__oFolder['aid'],fid:'SPAM_QUEUE/'+sAction,ftype:'QL',candelete:false,canrename:false,disabled:false});
			gui.frm_main._selectView({'aid':this.__oFolder['aid'],'fid':'SPAM_QUEUE/'+sAction});

			return;
		}

		var aSelectedItems = gui.frm_main.main.list._value();
		var aid = this.__oFolder['aid'];
		var fid = this.__oFolder['fid'];

		if (Is.Empty(aSelectedItems))
			this.__manageEmptyItems([aid, fid],sAction);
		else
		if (count(aSelectedItems) == 1) {
			if (!this.__manageEmptyItems([aid, fid, aSelectedItems],sAction))
				if (!this.__manageOneItem([aid, fid, aSelectedItems[0]], sAction))
					this.__manageMoreItems([aid, fid, aSelectedItems], sAction);
		}
		else
		if (!this.__manageEmptyItems([aid, fid, aSelectedItems],sAction))
			this.__manageMoreItems([aid, fid, aSelectedItems], sAction);
	}
};
