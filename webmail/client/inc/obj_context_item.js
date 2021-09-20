_me = obj_context_item.prototype;
function obj_context_item() {};

obj_context_item.createColorMailMenu = function(id) {
	return [
	{"title": 'COLOR_LABELS::RED_FLAG', "css": 'ico2 bg_red', 'arg': [OldMessage.setColor, [id, Item.COLORS.RED]]},
	{"title": 'COLOR_LABELS::BLUE_FLAG', "css": 'ico2 bg_blue', 'arg': [OldMessage.setColor, [id, Item.COLORS.BLUE]]},
	{"title": 'COLOR_LABELS::GREEN_FLAG', "css": 'ico2 bg_green', 'arg': [OldMessage.setColor, [id, Item.COLORS.GREEN]]},
	{"title": 'COLOR_LABELS::ORANGE_FLAG', "css": 'ico2 bg_orange', 'arg': [OldMessage.setColor, [id, Item.COLORS.ORANGE]]},
	{"title": 'COLOR_LABELS::PURPLE_FLAG', "css": 'ico2 bg_purple', 'arg': [OldMessage.setColor, [id, Item.COLORS.PURPLE]]},
	{"title": 'COLOR_LABELS::YELLOW_FLAG', "css": 'ico2 bg_yellow', 'arg': [OldMessage.setColor, [id, Item.COLORS.YELLOW]]},
	{"title": '-'},
	{"title": 'COLOR_LABELS::FLAG_COMPLETE', "css": 'ico2 bg_complete', 'arg': [OldMessage.setColor, [id, Item.COLORS.COMPLETE]]},
	{"title": 'COLOR_LABELS::CLEAR_FLAG', "css": 'ico2 bg_none', 'arg': [OldMessage.setColor, [id, Item.COLORS.CLEAR]]}
	];
};

_me.__createMailMenu = function(id, ids, bMultiple, sFrom, aRights, bLimit, aOpt) {
	// In Drafts or Sent folders some items should not be available:
	var folders = GWOthers.get('DEFAULT_FOLDERS', 'storage')['VALUES'],
		sFolderID = id[0] + '/' + id[1],
		aOpt = aOpt || {};

	// If SPAM_QUEUE/Blacklist folder doesn't exist, some items should not be available:
	var bDraft = (sFolderID == folders['drafts']),
		bTemplate = (sFolderID == folders['templates']),
		bSent = (sFolderID == folders['sent']),
		bRSS = dataSet.get('folders',[id[0],id[1],'RSS'])?true:false,
		bTeamChat = WMFolders.getType(id) === 'I',
		bArchive = false;

	if (dataSet.get('main',['archive_path']) && sFolderID.indexOf(dataSet.get('main',['archive_path'])+'/') === 0){
		bArchive = true;

		if (sFolderID.indexOf(dataSet.get('main',['archive_path'])+'/Sent/') === 0)
			bSent = true;
	}

	var aMenu = [];

	if (bDraft) {
		aMenu.push({"title": 'POPUP_ITEMS::EDIT', css:'ico2 edit', 'disabled': bMultiple, 'arg': [OldMessage.edit, [id]]});
	} else if (bTemplate && !bLimit) {
		aMenu.push({"title": 'MAIN_MENU::NEW_FROM_TEMPLATE', css:'ico2 from_template', 'disabled': bMultiple, 'arg': [NewMessage.compose,[new OldMessage(id)]]});
		aMenu.push({"title": 'POPUP_ITEMS::EDIT', css:'ico2 edit', 'disabled': bMultiple, 'arg': [OldMessage.edit, [id,{template:true}]]});
	}

	if (!bLimit) {
		aMenu.push({"title": 'POPUP_ITEMS::OPEN_WINDOW', css:'ico2 open', 'disabled': bMultiple, 'arg': [OldMessage.openwindow, [id]]});
	}

	if (!aOpt.noactions) {
		if (!bRSS && !bDraft && !bTemplate) {
			aMenu.push({"title": bSent?'POPUP_ITEMS::REPLY_TO_ALL':'POPUP_ITEMS::REPLY_TO_SENDER', css:'ico2 ' + (bSent?'reply_all':'reply'), 'disabled': bMultiple, 'arg': [OldMessage.reply, [id, bSent]],
				nodes: [
					{"title": 'POPUP_ITEMS::REPLY_TO_SENDER', css:'ico2 reply', 'disabled': bMultiple || bSent, 'arg': [OldMessage.reply, [id, false]]},
					{"title": 'POPUP_ITEMS::REPLY_TO_ALL', css:'ico2 reply_all', 'disabled': bMultiple, 'arg': [OldMessage.reply, [id, true]]},
					{"title": 'MAIN_MENU::REPLY_TO_ALL_ATT', css:'ico2 reply_all_att', 'disabled': bMultiple, 'arg': [OldMessage.reply, [id, true, null, false, void 0, true]]},
					{"title": '-'},
					{"title": 'MAIN_MENU::REPLY_TO_SENDER_T', css:'ico2 reply_template', 'disabled': bMultiple || bSent, 'arg': [OldMessage.replyTemplate, [id, false]]},
					{"title": 'MAIN_MENU::REPLY_TO_ALL_T', css:'ico2 reply_all_template', 'disabled': bMultiple, 'arg': [OldMessage.replyTemplate, [id, true]]}
				]});
		}

		if (bTemplate)
			aMenu.push({"title": 'POPUP_ITEMS::FORWARD_AS_MESSAGE', css:'ico2 forward', 'arg': [OldMessage.forward, [ids, true, false]]});
		else{
			var tmp = [
				{"title": 'POPUP_ITEMS::FORWARD', css:'ico2 forward', 'disabled': bMultiple, 'arg': [OldMessage.forward, [id, false, false]]},
				{"title": 'POPUP_ITEMS::FORWARD_RESEND', css:'ico2 forward', 'disabled': bMultiple, 'arg': [OldMessage.forward, [id, false, true]]},
				{"title": 'POPUP_ITEMS::FORWARD_AS_MESSAGE', css:'ico2 reply_all_att', 'arg': [OldMessage.forward, [ids, true, false]]}
			];

			if ((GWOthers.getItem('RESTRICTIONS', 'disable_redirect') || 0)<1)
				tmp.push({"title": 'POPUP_ITEMS::REDIRECT', css:'ico2 redirect', 'disabled': bMultiple, 'arg': [OldMessage.redirect, [id]]});

			aMenu.push({"title": 'POPUP_ITEMS::FORWARD', css:'ico2 forward', 'disabled': false, 'arg': [OldMessage.forward, [id, false, false]],
				nodes:tmp
			});
		}
	} else {
		aMenu.push({"title": 'POPUP_ITEMS::FORWARD_AS_MESSAGE', css:'ico2 reply_all_att', 'arg': [OldMessage.forward, [ids, true, false]]});
	}

	if (bSent && sPrimaryAccountDELIVERY && !bLimit)
		aMenu.push({"title": 'POPUP_ITEMS::DELIVERY_REPORT', css:'ico2 delivery', 'disabled': bMultiple, 'arg': [OldMessage.delivery_report, [id]]});

	if (!bTeamChat) {
		aMenu.push(
			{"title": 'POPUP_ITEMS::MARK_AS_READ', css:'ico2 markread', 'arg': [OldMessage.markAsRead, [ids]],'disabled':!aRights.modify},
			{"title": 'POPUP_ITEMS::MARK_AS_UNREAD', css:'ico2 markunread', 'arg': [OldMessage.markAsUnread, [ids]],'disabled':!aRights.modify},
			{"title": '-'}
		);

		if (aRights.remove){
			aMenu.push(
				{"title": 'POPUP_ITEMS::MOVE_MAIL_TO', css:'ico2 move_folder', 'arg': [Item.move, [ids]],
					nodes:[
						{"title": 'POPUP_ITEMS::MOVE_MAIL_TO', css:'ico2 move_folder', 'arg': [Item.move, [ids]]},
						{"title": 'POPUP_ITEMS::COPY_MAIL_TO', css:'ico2 copy_folder', 'arg': [Item.copy, [ids]]},
						Alfresco.enabled() && {"title": 'POPUP_ITEMS::COPY_MAIL_TO_ALFRESCO', css:'ico2 alfresco', 'arg': [Item.copyToAlfresco, [ids]]}
					].filter(Boolean)
				}
			);
		}
		else{
			aMenu.push(
				{"title": 'POPUP_ITEMS::COPY_MAIL_TO', css:'ico2 move_folder', 'arg': [Item.copy, [ids]]}
			);
		}

		// Add black/white list
		if (!bRSS && !bDraft && !bSent && (dataSet.get('folders', [sPrimaryAccount, 'SPAM_QUEUE/Blacklist']) || dataSet.get('folders', [sPrimaryAccount, 'SPAM_QUEUE/Whitelist']))){
			var blist = dataSet.get('folders', [sPrimaryAccount, 'SPAM_QUEUE/Blacklist']),
				wlist = dataSet.get('folders', [sPrimaryAccount, 'SPAM_QUEUE/Whitelist']);

			aMenu.push(
				{"title":'-'},
				{"title": 'POPUP_ITEMS::WHITELIST_SENDER', css:'ico2 whitelist', 'arg': [OldMessage.whitelistSender, [ids]],'disabled':!wlist, nodes:[
					{"title": 'POPUP_ITEMS::WHITELIST_SENDER', 'arg': [OldMessage.whitelistSender, [ids]]},
					{"title": 'POPUP_ITEMS::WHITELIST_DOMAIN', 'arg': [OldMessage.whitelistDomain, [ids]]}
				]},
				{"title": 'POPUP_ITEMS::BLACKLIST_SENDER', css:'ico2 blacklist','arg': [OldMessage.blacklistSender, [ids]],'disabled':!blist, nodes:[
					{"title": 'POPUP_ITEMS::BLACKLIST_SENDER', 'arg': [OldMessage.blacklistSender, [ids]]},
					{"title": 'POPUP_ITEMS::BLACKLIST_DOMAIN', 'arg': [OldMessage.blacklistDomain, [ids]]}
				]}
			);
		}

		aMenu.push({"title":'-'}, {"title": 'TAGS::TAGS', css:'ico2 tag', 'disabled': bArchive, 'arg': [Item.edit_tags, [ids]],'disabled':!aRights.modify});

		//More options...
		var tmp_cert,
		tmp_amenu = [
			{"title": 'POPUP_ITEMS::SAVE_AS', css:'ico2 save', 'arg': [Item.downloadSource, [id,'text']],
				"nodes":[
					{"title": 'POPUP_ITEMS::TEXT', css:'ico2 text', 'disabled': bMultiple, 'arg': [Item.downloadSource, [id,'text']]},
					{"title": 'POPUP_ITEMS::EML', css:'ico2 eml', 'arg': [bMultiple?Item.downloadMultiple:Item.downloadSource, [bMultiple?ids:id]]},
					{"title": 'POPUP_ITEMS::HTML', css:'ico2 html', 'disabled': bMultiple, 'arg': [Item.downloadSource, [id,'html']]}
				]
			},
			{"title": 'POPUP_ITEMS::SOURCE', css:'ico2 source', 'arg': [OldMessage.source, [id]]}
		];


		var aFrom = MailAddress.splitEmailsAndNames(sFrom)[0];
		if (aFrom && !bDraft){

			if (sPrimaryAccountGW>0){
				//Parse email (the same in frm_addaddress)
				var dgw = GWOthers.getItem('RESTRICTIONS', 'disable_gw_types') || '';

				// Invite to appointment
				if (dgw.indexOf('e')<0 && aFrom.email !== sPrimaryAccount)
					tmp_amenu.push({
						"title": 'POPUP_ITEMS::INVITE_APPOINTMENT', css:'ico2 add_calendar', disabled: false, arg: [Item.createInFolder, [id[0], "__@@VIRTUAL@@__/__@@EVENTS@@__",
						{CONTACTS: [{values:{CNTEMAIL: aFrom.email,CNTCONTACTNAME: aFrom.name,CNTROLE: 'Q', NEW: true}}]}, 'E']]
					});

				// Add to Contact
				if (dgw.indexOf('c')<0){

					var aLCTval = {};
					if (aFrom && aFrom.name)
						aLCTval = parseNameToLocation(aFrom.name,aLCTval);

					if (aFrom.email)
						aLCTval.LOCATIONS = [{'values': {'LCTEMAIL1':aFrom.email,'LCTTYPE': 'H'}}];

					//Add Certificate
					if (dataSet.get('items',[id[0],id[1],id[2],'SMIME_STATUS'])>3)
						aLCTval.CERTIFICATES = [{values:{'class':'item','fullpath':id[0] +'/'+ id[1] +'/'+ WMItems.__serverID(id[2])}}];

					tmp_amenu.push({"title": 'POPUP_ITEMS::ADD_CONTACT', css:'ico2 add_contact', disabled: bMultiple,'arg': [gui, '_create', ['frm_contact', 'frm_contact', '', '', sPrimaryAccount, Mapping.getDefaultFolderForGWType('C'), '',aLCTval]]});
					tmp_cert = {"title": 'POPUP_ITEMS::CERT_TO_CONTACT', css:'ico2 add_cert', disabled: bMultiple || dataSet.get('items',[id[0],id[1],id[2],'SMIME_STATUS'])<4, 'arg': [Item.addCert,[id]]};
				}
			}

			//Add to IM Roster
			if (window.sPrimaryAccountIM && (GWOthers.getItem('RESTRICTIONS', 'disable_im') || 0)<1 && gui.frm_main && gui.frm_main.im)
				tmp_amenu.push({"title": 'POPUP_ITEMS::ADD_IM', css:'ico2 add_im', disabled: !gui.frm_main.im._is_active() || bMultiple,'arg': [gui.frm_main.im, '_add_item', ['', aFrom.email, aFrom.name]]});
		}

		// Add Certificate after IM and Appointment
		if (tmp_cert)
			tmp_amenu.push(tmp_cert);

		aMenu.push({"title":'COMMON::MORE_OPTIONS', css:'ico2 more', nodes:tmp_amenu});

		if (sPrimaryAccountCHAT) {
			aMenu.push({"title": 'POPUP_ITEMS::COPY_ITEM_TO_TEAMCHAT', css:'ico2 color1 share_folder teamchat', 'arg':[Item.copy_tch,[ids]]});
		}
		else{
			aMenu.push({"title":'-'});
		}
	}

	if (!bLimit) {
		// var aOptions = {alias:Item.getAliasFromPath(sFolderID)};
		// aOptions.template = bTemplate;

		// aMenu.push({"title": 'MAIN_MENU::NEW', 'arg': [NewMessage.compose,[aOptions]]});

		// if (!bTemplate) {
		// 	aMenu.push({"title": 'MAIN_MENU::NEW_FROM_TEMPLATE', 'arg': [NewMessage.composeTemplate, [aOptions]]});
		// }

		aMenu.push(
			{"title": 'POPUP_ITEMS::DELETE', 'arg': [this,'__deleteFromDG', [ids]], css:'color2 ico2 delete', 'disabled':!aRights.remove}
		);
	}

	return aMenu;
};

_me.__createGWMenu = function(id, ids, sFolType, bMultiple, oRepeating, aAccess, sColumn, oObj, bLimit, aData) {

	var me = this;
	var oObj = oObj || this._owner,
		aMenu = [],
		iFlags = 0;

	if (sFolType == 'G'){
		aMenu.push(
			{"title":'POPUP_ITEMS::RECOVER', css:'ico2 recover', 'arg': [Item.recover, [ids]]}
		);
		if (!dataSet.get('main',['keep_deleted_items_force_expiration'])) {
			aMenu.push(
				{'title':"-"},
				{"title":'POPUP_ITEMS::DELETE', css:'ico2 color2 delete', 'arg': [this,'__deleteFromDG',[ids,oRepeating,oObj]],'disabled':!aAccess.remove}
			);
		}
		return aMenu;
	}

	// if (sFolType == 'L')
	// 	aMenu.push({"title": 'POPUP_ITEMS::OPEN_ITEM', 'disabled': bMultiple, 'arg': [Item.openwindow,[id,null,null,'L']]});
	// else
	if (sFolType == 'F'){

		if (!bMultiple && sPrimaryAccountWebDAV){
			var sName = (aData || dataSet.get('items', [id[0], id[1], id[2]])).EVNTITLE;
			if (sName){
				switch(Path.extension(sName)){
				case 'txt':
				case 'htm':
				case 'html':
					aMenu.push({"title":'POPUP_ITEMS::OPEN', css:'ico2 open', 'arg': [Item.editFile, [id]]});
					break;

				case 'pdf':
					aMenu.push({"title":'POPUP_ITEMS::OPEN', css:'ico2 open', 'arg': [Item.openPDF, [id]]});
					break;

				case 'mp3':
					if (gui.audio)
						aMenu.push({"title":'ATTACHMENT::PLAY_SOUND', css:'ico2 sound', 'arg': [Item.playFile, [id]]});
					break;

				default:
					if (Item.officeSupport(sName)) {
						var aArgAuto = [Item.officeOpen, [{aid:id[0],fid:id[1],iid:id[2]},[Item.downloadFile,[id]], Path.extension(sName)]];
						var aArgWeb = [Item.officeOpen, [{aid:id[0],fid:id[1],iid:id[2]},[Item.downloadFile,[id]], Path.extension(sName)]];
						var aArgWebView = [Item.officeOpen, [{aid:id[0],fid:id[1],iid:id[2]},[Item.downloadFile,[id]], Path.extension(sName),'view']];
						var aArgExt = [Item.officeOpen, [{aid:id[0],fid:id[1],iid:id[2]},[Item.downloadFile,[id]], Path.extension(sName),'external']];
						var bIWD = dataSet.get('accounts', [sPrimaryAccount, 'OFFICE_SUPPORT']) == 'true';

						aMenu.push({
							title:'POPUP_ITEMS::OPEN',
							css:'ico2 open',
							arg: aArgAuto,
							'nodes':[
								{"title":'DOCUMENT::OPENDOCUMENT', css:'ico2 open_edit', 'arg': aArgWeb, disabled: !bIWD},
								{"title":'DOCUMENT::OPENDOCUMENTVIEW', 'arg': aArgWebView, disabled: !bIWD},
								{"title":'OFFICELAUNCHER::OFFICESUITE', css:'ico2 open_suite', 'arg': aArgExt}
							]
						});

					}
				}
			}
		}

		if(!bLimit) {
			aMenu.push(	{"title":'POPUP_ITEMS::DOWNLOAD_FILE', css:'ico2 download', 'arg': [(bMultiple?Item.downloadMultiple:Item.downloadFile), [bMultiple?ids:id]]});
		}

		//Try to get Lock_id
		var sLockID;
		if (!(sLockID = dataSet.get('items',[id[0], id[1], Is.Array(id[2])?id[2][id[2].length-1]:id[2],'EVNLOCKOWN_ID'])))
			sLockID = dataSet.get('items', [id[0], id[1], Is.Array(id[2])?id[2][id[2].length-1]:id[2],'EVNLOCKOWN_ID']);

		var bLocked = sLockID && sLockID != sPrimaryAccountGWID,
			aRights = WMFolders.getRights({aid:id[0], fid:id[1]});

		// if(!bLimit) aMenu.push(
		// {	"title":'MAIN_MENU::NEW',
		// 	'arg': [Item.createInFolder, [id[0], id[1]]],
		// 	'disabled':!aAccess.write,
		// 	'nodes':[
		// 		{"title": 'MAIN_MENU::NEW_UPLOAD', 'arg': [Item.createInFolder, [id[0], id[1]]]},
		// 		{"title": '-'},
		// 		{"title": 'MAIN_MENU::NEW_WORD', 'arg': [Item.createInFolder, [id[0], id[1], {'ATTACHMENTS':[{'values':{'ATTTYPE':'document', 'ATTDESC': '.docx'}}]}]]},
		// 		{"title": 'MAIN_MENU::NEW_EXCEL', 'arg': [Item.createInFolder, [id[0], id[1], {'ATTACHMENTS':[{'values':{'ATTTYPE':'document', 'ATTDESC': '.xlsx'}}]}]]},
		// 		{"title": 'MAIN_MENU::NEW_PPOINT', 'arg': [Item.createInFolder, [id[0], id[1], {'ATTACHMENTS':[{'values':{'ATTTYPE':'document', 'ATTDESC': '.pptx'}}]}]]},
		// 		{"title": 'MAIN_MENU::NEW_TEXT', 'arg': [Item.createInFolder, [id[0], id[1], {'ATTACHMENTS':[{'values':{'ATTTYPE':'document', 'ATTDESC': '.txt'}}]}]]},
		// 		{"title": 'MAIN_MENU::NEW_HTML', 'arg': [Item.createInFolder, [id[0], id[1], {'ATTACHMENTS':[{'values':{'ATTTYPE':'document', 'ATTDESC': '.html'}}]}]]}
		// 	]
		// });



		//Rename File
		if (oObj){
			aMenu.push({"title":'FORM_BUTTONS::RENAME', css:'ico2 rename', 'arg': [
				function(){

					if (oObj._editColumn){
						oObj._editColumn(id[2],'EVNFILENAME',{restrictions: [[function(name) {
							return !!(name || '').trim() && name.match(/^[^\/\\:?"<>|~*]+$/);
						}]]},[Item.edit_value,[id,'EVNFILENAME']]);

						if (oObj.edit){
							var v = (oObj || me._owner).edit._value(),
								p = v.lastIndexOf('.');
							oObj.edit._setRange(0,p>-1?p:v.length);
						}
					}

				}], disabled:bMultiple || !aAccess.modify || !id[2] || bLocked}
			);
			var aData = dataSet.get('items', id);
			if (Item.officeSupport(aData.EVNTITLE) && (GWOthers.getItem('LAYOUT_SETTINGS','disable_pdf') == 0 || !currentBrowser().match(/^MSIE([6-9]|10)$/))) {
				aMenu.push({title: 'MAIN_MENU::PRINT', arg: [function() {
					Item.openPDF(id);
				}], css: 'ico2 print'});
			}
		}

		aMenu.push(
			{"title":'-'}
		);

	}
	else
	if(sFolType == 'E') {

		// For calender type, check if it is an open invitation and offer to accept it
		if (!bMultiple) { //ids[2].length==1
			iFlags = dataSet.get('items',id.concat('EVNFLAGS')) || 0;

			// If it is an invitation offer to accept it directly in calandar
			if (iFlags&32 || iFlags&8)
				aMenu.push({title:'FILTERS::ACCEPT', css:'ico2 accept', arg: [WMItems,'imip', [{aid: id[0], fid: id[1], iid: id[2]},'accept',[function(){Item.__refreshView(ids)}]]]});

			if(!(iFlags&8)) {
				aMenu.push({
					title: 'EVENT::TENTATIVE',
					css: 'ico2 tentative',
					arg: [WMItems, 'imip', [{aid: id[0], fid: id[1], iid: id[2]}, 'tentative', [function(){
						Item.__refreshView(ids);
					}]]]
				});
			}

			// Delete or if preliminary reject invitation
			if (iFlags&2)
				aMenu.push({"title":'MAIL_VIEW::DECLINE', css:'color2 ico2 decline', 'arg': [this,'__deleteFromDG',[ids,oRepeating,oObj]], 'disabled':!aAccess.remove || bLocked});

			if (aMenu.length)
				aMenu.push({"title":'-'});
		}

		aMenu.push(
			{
				title: 'POPUP_ITEMS::EDIT',
				css: 'ico2 edit',
				arg: [Item.open, [[id[0], id[1], id[2].split('|')[0]], dataSet.get('items', id)]],
				disabled: !aAccess.write || dataSet.get('items',id.concat('EVNCLASS')) == 'O'
			},
			{
				title: 'POPUP_ITEMS::CLONE',
				css: 'ico2 clone_room',
				arg: [Item.cloneEvent, [id]],
				disabled: !aAccess.write || dataSet.get('items',id.concat('EVNCLASS')) == 'O'
			}
		);
	}
	else
	if (sFolType == 'T')
		aMenu.push({"title": 'MAIN_MENU::PRINT', css:'ico2 print', 'arg':[Item.print,[ids]]});
	else
	if (sFolType == 'C'){
		var aContact = aData || dataSet.get('items', [id[0], id[1], id[2]]);
		if (!aContact) return aMenu;

		if (aContact.LCTEMAIL1 || aContact.LCTEMAIL2 || aContact.LCTEMAIL3){
			var sName = aContact.ITMCLASSIFYAS || ((aContact.ITMSURNAME || '') + (aContact.ITMFIRSTNAME?' '+aContact.ITMFIRSTNAME:'')) || '';

			aMenu.push(
				{"title":'POPUP_ITEMS::SEND_EMAIL_TO', "caption":true}
			);

			['LCTEMAIL1','LCTEMAIL2','LCTEMAIL3'].forEach(function(key){
				if (aContact[key])
					aMenu.push({"text":aContact[key].entityify(),'arg': [NewMessage.compose,[{to:MailAddress.createEmail(sName,aContact[key])}]]});
			});

			aMenu.push({title:'-'});
		}

		if (!bLimit){
			if (window.sPrimaryAccountSIP)
				aMenu.push({"title":'MAIN_MENU::DIAL', css:'ico2 dial', "arg":[obj_context_item.__call,[id]]});

			if (window.sPrimaryAccountCONFERENCE)
				aMenu.push({"title":'MAIN_MENU::CONFERENCE', css:'ico2 conference', "arg":[obj_context_item.__conference,[id]]});

			if (window.sPrimaryAccountSMS)
				aMenu.push({"title":'MAIN_MENU::SMS', css:'ico2 sms', "arg":[obj_context_item.__sms,[ids]]});
		}

		if (gui.frm_main && gui.frm_main.im){
			var sJID = '';

			if (gui.frm_main.im._is_active()){
				['LCTIM','LCTEMAIL1','LCTEMAIL2','LCTEMAIL3'].some(function(key){
					if (aContact[key] && gui.frm_main.im._inRoster(aContact[key])){
						sJID = aContact[key].toLowerCase();
						return true;
					}
				});
			}

			aMenu.push({"title": 'IM::CHAT', css:'ico2 chat', disabled: !sJID, 'arg':[gui.frm_main.im,'_chat',[sJID]]});
		}

		aMenu.push(
			{"title":'-'},
			{"title": 'MAIN_MENU::PRINT', css:'ico2 print', 'arg':[Item.print,[ids]]}
		);

	}
	else
	if (sFolType == 'L'){
		var aContact = aData || dataSet.get('items', [id[0], id[1], id[2]]);
		aMenu.push({"title":'POPUP_ITEMS::SEND_EMAIL_TO',css:'ico2 send', 'arg':[NewMessage.compose,[{to:'['+aContact.fid+'::'+(aContact.ITMCLASSIFYAS || aContact.ITMTITLE)+']'}]]});
	}

	if (aAccess.remove && !bLocked){
		aMenu.push(
			{"title":'POPUP_ITEMS::MOVE_ITEM_TO', css:'ico2 move_folder', 'arg': [Item.move, [ids]], nodes:[
				{"title":'POPUP_ITEMS::MOVE_ITEM_TO', css:'ico2 move_folder', 'arg': [Item.move, [ids]],'disabled':!aAccess.remove || bLocked},
				{"title":'POPUP_ITEMS::COPY_ITEM_TO', css:'ico2 copy_folder', 'arg': [Item.copy, [ids]]},
				Alfresco.enabled() && {"title": 'POPUP_ITEMS::COPY_ITEM_TO_ALFRESCO', css:'ico2 alfresco', 'arg': [Item.copyToAlfresco, [ids]]},
				{"title":'POPUP_ITEMS::CLONE_ITEM_TO', css:'ico2 copy_folder', 'arg': [Item.clone, [ids]]}
			].filter(Boolean)}
		);
	}
	else
		aMenu.push(
			{"title":'POPUP_ITEMS::COPY_ITEM_TO', css:'ico2 copy_folder', 'arg': [Item.copy, [ids]]}
		);

	//OTHER
	var tmp_amenu = [];

	if (sFolType == 'F'){
		tmp_amenu.push(
			{"title":'ITEM::UPLOAD_NEW_VERSION', css:'ico2 upload', 'arg': [function(){
				var aData = WMItems.list({"aid": ids[0], "fid": ids[1], "iid": ids[2][0], "values": ['ATTACHMENTS']},'','','');
				if(!gui.frm_main.main.X_ATTACHMENTS) {
					gui.frm_main.main._create('X_ATTACHMENTS','obj_upload_edit_single','','big noborder hidden absolute');
				}

				gui.frm_main.main.X_ATTACHMENTS._onuploadend = function(){

					var aOut = {values: {}};

					var addon;
					if (!Is.Empty(addon = gui.frm_main.main.X_ATTACHMENTS.list._value())) {
						var now = new IcewarpDate();
						aOut.values.EVNSTARTDATE = now.format(IcewarpDate.JULIAN);
						aOut.values.EVNSTARTTIME = now.format(IcewarpDate.JULIAN_TIME);

						var att = addon[addon.length-1];
							att.uid = addon[0].uid;

						aOut.values.EVNCOMPLETE = gui.frm_main.main.X_ATTACHMENTS.list._getSize();
						aOut.values.EVNTITLE = aOut.values.EVNLOCATION = aOut.values.EVNRID = att.values.description;
						aOut.values.EVNCLASS = 'F';
						aOut['ATTACHMENTS'] = [att];
					}
					WMItems.add(ids, aOut, '', '','',[function(bOK) {
						if(!bOK) {
							return;
						}
						if(gui.frm_main && gui.frm_main.main && gui.frm_main.main.list) {
							gui.frm_main.main.X_ATTACHMENTS._destruct();
							gui.frm_main.main.list._serverSort();
							Item.__refreshView(ids, true);
						}
					}]);
				};
				var attachement = {};
				var data = aData[ids[0]][ids[1]][ids[2][0]];
				for(var i in data.ATTACHMENTS) {
					if(data.ATTACHMENTS[i].values.ATTTYPE === 'attachment') {
						attachement = data.ATTACHMENTS[i].values;
					}
				}

				gui.frm_main.main.X_ATTACHMENTS.list._value({'path': ids[0]+'/'+ids[1]+'/'+WMItems.__serverID(ids[2][0]), 'values': [{
					'name': attachement['ATTDESC'],
					'class': attachement['ATTTYPE'],
					'id': attachement['ATTNAME'],
					'size': attachement['ATTSIZE']
				}]});
				gui.frm_main.main.X_ATTACHMENTS.file._click();
			}], 'disabled':!aAccess.modify || bMultiple},

			{"title":'ITEM::NEW_REVISION', css:'ico2 new_revision', 'arg': [function(){
				gui._create('revision', 'frm_revision','','',{aid:ids[0],fid:ids[1],iid:ids[2][0]});
			}], 'disabled':!aAccess.modify || bMultiple},

			{"title":'POPUP_ITEMS::SEND_NOTIFY', css:'ico2 notify', 'arg': [function(){
				gui._create('notify','frm_notify','','',ids);
			}], 'disabled':!aAccess.modify},

			{"title":(sLockID?'FILE::UNLOCK':'FILE::LOCK'), css:'ico2 ' + (sLockID?'unlock':'lock'), 'arg':[Item.set_lock, [ids,sLockID?false:true,true]], 'disabled':!aAccess.modify || (!aRights.owner && bLocked)}


		);
	}
	else{

		var sDownload,
			sDownloadIco = 'download';
		switch (sFolType) {
			case 'C':
			case 'L':
				sDownload = 'DOWNLOAD_VCARD';
				sDownloadIco = 'download_vcard';
				break;
			case 'E':
			case 'J':
			case 'T':
				if (!bMultiple) {
					tmp_amenu.push({
						title: 'EVENT::EMAIL_ATTENDEES',
						css:'ico2 eml',
						arg: [Item.emailAttendees, [id]]
					});
				}
				sDownload = 'DOWNLOAD_VCALENDAR';
				sDownloadIco = 'download_vcal';
				break;
			case 'N':
				sDownload = 'DOWNLOAD_VNOTE';
				sDownloadIco = 'download_vnote';
				break;
			default:
				sDownload = 'DOWNLOAD_SOURCE';
				break;
		}

		tmp_amenu.push(
			{"title":'POPUP_ITEMS::' + sDownload, css:'ico2 ' + sDownloadIco, 'arg': [bMultiple?Item.downloadMultiple:Item.downloadSource, [bMultiple?ids:id]]}
		);

		tmp_amenu.push({"title":'POPUP_ITEMS::ATTACH_TO_EMAIL', css:'ico2 reply_all_att', 'arg': [Item.sendAsEmail, [ids]]});

		if (sFolType == 'C'){
			if (sPrimaryAccountCHAT && !bMultiple)
				tmp_amenu.push({"title":'POPUP_ITEMS::COPY_ITEM_TO_TEAMCHAT', css:'ico2 teamchat', 'arg':[Item.copy_tch,[ids]]});

			if (gui.frm_main && gui.frm_main.im){
				var sName = aContact.ITMCLASSIFYAS || ((aContact.ITMSURNAME || '') + (aContact.ITMFIRSTNAME?' '+aContact.ITMFIRSTNAME:'')) || '';
				tmp_amenu.push({"title": 'POPUP_ITEMS::ADD_TO_IM', css:'ico2 add_im', disabled: !aContact.LCTIM || !gui.frm_main.im._is_active() || gui.frm_main.im._inRoster(aContact.LCTIM),'arg': [gui.frm_main.im, '_add_item', ['', aContact.LCTIM, sName]]});
			}
		}
	}

	if (sFolType == 'F'){
		aMenu.push({"title":'POPUP_ITEMS::PROPERTIES', css:'ico2 doc_properties', 'disabled': bMultiple || !aAccess.modify, 'arg': [Item.openwindow, [id,null,oRepeating]]});
	}

	aMenu.push({"title": 'TAGS::TAGS', css:'ico2 tag', 'arg': [Item.edit_tags, [ids]],'disabled':!aAccess.modify});

	if (tmp_amenu.length)
		aMenu.push({"title":'COMMON::MORE_OPTIONS', css:'ico2 more', nodes:tmp_amenu});


	if (sFolType == 'C'){

		var sLct = '',
			bDisabled = !aContact || !['LCTEMAIL1','LCTEMAIL2','LCTEMAIL3'].some(function(key){
				if (aContact[key]){
					sLct = aContact[key];
					return true;
				}
			});

		if(sPrimaryAccountCHAT && !bLimit)
			aMenu.push({"title":'POPUP_ITEMS::INVITE_TEAMCHAT', css:'ico2 color1 share_folder teamchat', 'arg':[Item.invite_tch,[sLct]], disabled:bDisabled});
	}
	else
	if (sFolType == 'F'){
		var tmp_nodes = [
			((aData || dataSet.get('items', [id[0], id[1], id[2]])).EVNOWN_ID === sPrimaryAccountGWID || aAccess.modify) && {title:'COLLABORATION::REALTIME_COLLABORATION', css:'ico2 share_folder', 'arg':[Item.collaborate,[ids]]},
			sPrimaryAccountCHAT && {"title":'POPUP_ITEMS::COPY_ITEM_TO_TEAMCHAT', css:'ico2 teamchat', 'arg':[Item.copy_tch,[ids]]},
			{"title":'POPUP_ITEMS::ATTACH_TO_EMAIL', css:'ico2 reply_all_att', 'arg': [Item.sendAsEmail, [ids]]}
		].filter(Boolean);

		aMenu.push({"title":'POPUP_ITEMS::SHARE', css:'ico2 color1 share_folder', nodes:tmp_nodes, arg:tmp_nodes[0].arg});
	}
	else
	if (sPrimaryAccountCHAT && !bMultiple){
		aMenu.push({"title":'POPUP_ITEMS::COPY_ITEM_TO_TEAMCHAT', css:'ico2 color1 share_folder teamchat', 'arg':[Item.copy_tch,[ids]]});
	}

	if (!bLimit && (!iFlags || !(iFlags&2)))
		aMenu.push({"title":'POPUP_ITEMS::DELETE', css:'color2 ico2 delete', 'arg': [this,'__deleteFromDG',[ids,oRepeating,oObj]], 'disabled':!aAccess.remove || bLocked});

	return aMenu;
};

obj_context_item.createQuarantineMenu = function(ids) {
	return [
	{"title": 'POPUP_ITEMS::DELIVER', css:'ico2 deliver', 'arg': [OldMessage.deliver, [ids]]},
	{"title":'-'},
	{"title": 'POPUP_ITEMS::WHITE_LIST', css:'ico2 whitelist', 'arg': [OldMessage.whitelist, [ids]]},
	{"title": 'POPUP_ITEMS::BLACK_LIST', css:'ico2 blacklist', 'arg': [OldMessage.blacklist, [ids]]},
	{"title":'-'},
	{"title": 'POPUP_ITEMS::DELETE', css:'color2 ico2 delete', 'arg': [Item.remove, [ids]]}
	];
};

obj_context_item.createBlacklistMenu = function(ids,arg) {
	return [
	{"title": 'POPUP_ITEMS::WHITE_LIST', css:'ico2 whitelist', 'arg': [OldMessage.whitelist, [ids]]},
	// {"title": 'MAIN_MENU::NEW', 'arg': [gui, '_create', ['frm_blackwhite', 'frm_blackwhite', '', '', ids[0], ids[1]]]},
	{"title": '-'},
	{"title": 'POPUP_ITEMS::SEND_EMAIL_TO', css:'ico2 send', 'arg': [NewMessage.compose, [{to:arg.data.SNDEMAIL}]]},
	{"title": '-'},
	{"title": 'POPUP_ITEMS::DELETE', 'css':'color2 ico2 delete', 'arg': [Item.remove, [ids]]}
	];
};

obj_context_item.createWhitelistMenu = function(ids,arg) {
	return [
	{"title": 'POPUP_ITEMS::BLACK_LIST', css:'ico2 blacklist', 'arg': [OldMessage.blacklist, [ids]]},
	// {"title": 'MAIN_MENU::NEW', 'arg': [gui, '_create', ['frm_blackwhite', 'frm_blackwhite', '', '', ids[0], ids[1]]]},
	{"title": '-'},
	{"title": 'POPUP_ITEMS::SEND_EMAIL_TO', css:'ico2 send', 'arg': [NewMessage.compose, [{to:arg.data.SNDEMAIL}]]},
	{"title": '-'},
	{"title": 'POPUP_ITEMS::DELETE', css:'ico2 color2 delete', 'arg': [Item.remove, [ids]]}
	];
};

_me._fillMenu = function(sType, arg, iid_list, bDisableOpen, aInitMenu, sColumn, oObj)
{
	var id = [arg['aid'], arg['fid'], arg['iid']],
		ids = [arg['aid'], arg['fid'], iid_list],
		bMultiple = iid_list.length > 1,
		aRights = WMFolders.getAccess(arg),
		aMenu = [];

	if (!bMultiple && arg.data && arg.data.EVNOWN_ID == sPrimaryAccountGWID)
		aRights = {'read':true,'write':true,'modify':true,'remove':true,'owner':true};



	if (sColumn == 'COLOR' && aRights.modify) {
		addcss(this._main,"obj_context_itemflags");
		aMenu = obj_context_item.createColorMailMenu(ids);
	}
	else
	switch (sType) {
		case 'E':
		case 'J':
		case 'T':
		case 'N':
		case 'F':
		case 'C':
		case 'G':
		case 'L':
			aMenu = this.__createGWMenu(id, ids, sType, bMultiple,'',aRights,sColumn,oObj);
			break;
		case 'M':
			var sFrom = dataSet.get('items', id.concat(['FROM']));
			aMenu = this.__createMailMenu(id, ids, bMultiple, sFrom, aRights);
			break;
		case 'Q':
			aMenu = obj_context_item.createQuarantineMenu(ids);
			break;
		case 'QL':
			if (arg['fid'].indexOf('White') >= 0)
				aMenu = obj_context_item.createWhitelistMenu(ids,arg);
			else
				aMenu = obj_context_item.createBlacklistMenu(ids,arg);
			break;
	}

	if (aInitMenu) {
		aInitMenu = reverse(aInitMenu);
		for (var i in aInitMenu)
			aMenu.unshift(aInitMenu[i]);
	}

	this._fill(aMenu);
};

obj_context_item.__call = function (id){
	if (id)
		gui.frm_main.__showDialDialog(id[0],id[1],id[2]);
};

obj_context_item.__sms = function (id){
	if (id)
		gui.frm_main.__showSMSDialog(id[0],id[1],id[2]);
};

obj_context_item.__conference = function (id){
	if (id)
		gui.frm_main.__showConferenceDialog(id[0],id[1],id[2]);
};

_me.__deleteFromDG = function (ids, oRepeating, oObj){
	if (ids){
		var oObj = oObj || this._owner;

		if (oObj && oObj._type == 'obj_datagrid2_ext' && oObj.__deleteItems){
			var ov = oObj._value();
			if (ids[2].length>1 || ov[0]==ids[2][0]){
				oObj.__deleteItems({aid:ids[0],fid:ids[1]},ids[2],false,oRepeating);
				return;
			}
		}

       	Item.remove(ids,false,oRepeating);
	}
};


_me._fillGeneralMenu = function(sType, oFolder) {
	var aMenu;

	if (oFolder){
		var aid = oFolder['aid'];
		var fid = oFolder['fid'];
		var aRights = WMFolders.getAccess(oFolder);
	}

	switch(sType) {
		case 'M':

			var aOpt = [];
			if (oFolder){
				aOpt = {alias:Item.getAliasFromPath(aid + '/' + fid)};

				if (aid+'/'+fid == GWOthers.getItem('DEFAULT_FOLDERS', 'templates'))
					aOpt.template = true;
			}

			aMenu = [{"title": 'MAIN_MENU::NEW', css:'ico2 send', 'arg': [NewMessage.compose, [aOpt]], 'disabled':!aRights.write}];

			if (!aOpt.template)
				aMenu.push({"title": 'MAIN_MENU::NEW_FROM_TEMPLATE', css:'ico2 from_template', 'arg': [NewMessage.composeTemplate, [aOpt]], 'disabled':!aRights.write});

			break;

		case 'QL':
			aMenu = [{"title": 'MAIN_MENU::NEW', css:'ico2 new', 'arg': [gui, '_create', ['frm_blackwhite', 'frm_blackwhite', '', '', aid, fid]]}];
			break;

		case 'E':
			aMenu =[
				{"title": 'MAIN_MENU::NEW', css:'ico2 new', 'arg': [Item.createInFolder, [aid, fid]],'disabled':!aRights.write},
				{"title": '-'},
				{"title": 'MAIN_MENU::DAY_VIEW', 'arg': [gui.frm_main, '_selectView', [oFolder, 'day_view', true]]},
				{"title": 'MAIN_MENU::WEEK_VIEW', 'arg': [gui.frm_main, '_selectView', [oFolder, 'week_view', true]]},
				{"title": 'MAIN_MENU::MONTH_VIEW', 'arg': [gui.frm_main, '_selectView', [oFolder, 'month_view', true]]},
				{"title": 'MAIN_MENU::EVENTS_LIST', 'arg': [gui.frm_main, '_selectView', [oFolder, 'list_view', true]]}
			];
			break;

		case 'C':
			aMenu = [
				{"title": 'MAIN_MENU::NEW', css:'ico2 new', 'arg': [Item.createInFolder, [aid, fid]],'disabled':!aRights.write},
				{"title": 'POPUP_ITEMS::NEW_DISTRIBLIST', css:'ico2 new_dl','arg': [Item.create, ['L', aid, fid]],'disabled':!aRights.write}
			];
			break;

		case 'T':
			aMenu = [{"title": 'MAIN_MENU::NEW', css:'ico2 new', 'arg': [Item.createInFolder, [aid, fid]],'disabled':!aRights.write}];
			break;

		case 'J':
			aMenu = [{"title": 'MAIN_MENU::NEW', css:'ico2 new', 'arg': [Item.createInFolder, [aid, fid]],'disabled':!aRights.write}];
			break;

		case 'N':
			aMenu = [{"title": 'MAIN_MENU::NEW', css:'ico2 new', 'arg': [Item.createInFolder, [aid, fid]],'disabled':!aRights.write}];
			break;

		case 'F':
			aMenu = [
				{"title": 'MAIN_MENU::NEW_UPLOAD', css:'ico2 upload', 'arg': [Item.createInFolder, [aid, fid]],'disabled':!aRights.write},
				{"title": '-'},
				{"title": 'MAIN_MENU::NEW_WORD', css:'ico2 word', 'arg': [Item.createInFolder, [aid, fid, {'ATTACHMENTS':[{'values':{'ATTTYPE':'document', 'ATTDESC': '.docx'}}]}]],'disabled':!aRights.write},
				{"title": 'MAIN_MENU::NEW_EXCEL', css:'ico2 xls', 'arg': [Item.createInFolder, [aid, fid, {'ATTACHMENTS':[{'values':{'ATTTYPE':'document', 'ATTDESC': '.xlsx'}}]}]],'disabled':!aRights.write},
				{"title": 'MAIN_MENU::NEW_PPOINT', css:'ico2 ppt', 'arg': [Item.createInFolder, [aid, fid, {'ATTACHMENTS':[{'values':{'ATTTYPE':'document', 'ATTDESC': '.pptx'}}]}]],'disabled':!aRights.write},
				{"title": 'MAIN_MENU::NEW_TEXT', css:'ico2 text', 'arg': [Item.createInFolder, [aid, fid, {'ATTACHMENTS':[{'values':{'ATTTYPE':'document', 'ATTDESC': '.txt'}}]}]],'disabled':!aRights.write},
				{"title": 'MAIN_MENU::NEW_HTML', css:'ico2 html', 'arg': [Item.createInFolder, [aid, fid, {'ATTACHMENTS':[{'values':{'ATTTYPE':'document', 'ATTDESC': '.html'}}]}]],'disabled':!aRights.write}
			];

			break;
	}

	this._fill(aMenu);
};
