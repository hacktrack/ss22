function Item() {};

Item.COLORS = {
	'RED': '1', 'BLUE': '2', 'GREEN': '3', 'GREY': '4', 'ORANGE': '5', 'CYAN': '6', 'BROWN': '7',
	'PURPLE': '8', 'LIGHT_BLUE': '9', 'YELLOW': 'A', 'COMPLETE': 'Y', 'CLEAR': 'Z'
};

Item.open = function(id, aOtherData, aValues, sFolderType, bForce) {
	if (gui.frm_main && gui.frm_main.main && gui.frm_main.main.itemview){

		if (!bForce && dataSet.get('preview', id)) return;

		dataSet.add('active_items', [id[0],id[1]], id[2]);

		var
			aItemsInfo = {"aid": id[0], "fid": id[1], "iid": id[2]},
			sFolderType = WMFolders.getType(id);

		if (sFolderType == 'F')
			aItemsInfo.values = [
				'EVN_ID',
				'EVNGRP_ID',
				'EVNOWN_ID',
				'EVN_METADATA',
				'EVNLOCKOWN_ID',
				'EVNMODIFIEDOWN_ID',
				'EVN_EDITCOUNTER',
				'EVN_CREATED',
				'EVN_MODIFIED',
				'EVNFOLDER',
				'EVNORIGINALFOLDER',
				'EVNTITLE',
				'EVNTYPE',
				'EVNNOTE',
				'EVNDESCFORMAT',
				'EVNLOCATION',
				'EVNCOMPLETE',
				'EVNCOLOR',
				'EVNCLASS',
				'EVNSHARETYPE',
				'EVNTIMEFORMAT',
				'EVNSTATUS',
				'EVNURL',
				'EVNSTARTDATE',
				'EVNSTARTTIME',
				'EVNENDDATE',
				'EVNENDTIME',
				'EVNRID',
				'EVNUID',
				'EVNFLAGS',
				'EVNLOCKHASH',
				'EVNLOCKINFO',
				'EVNLOCKOWN_EMAIL',
				'EVNLOCKAPPMASK',
				//'DATA',
				'TICKET'];

		// send extra XML tag only for Notes, Tasks, Contacts, Calendar Events, Documents (F)
		if (sFolderType === 'N' || sFolderType === 'T' || sFolderType === 'C' || sFolderType === 'E' || sFolderType === 'F') {
			// do not use strict checking - settings are stored as strings
			if (1 == GWOthers.getItem('MAIL_SETTINGS_GENERAL', 'show_inline_images')) {
				aItemsInfo.values = ['show_inline_images']; // show external images
			}
		}

		WMItems.list(aItemsInfo, 'preview'); //,'','',[gui.frm_main.main.itemview,'_value']
	}
	else
		Item.openwindow(id, aValues, aOtherData, sFolderType);
};

/**
 * Open GW item for CREATE or EDIT in Item.Property window
 *
 * @param {array} id			[account_id, folder_id, item_id] item_id is optional
 * @param {object} aValues		item data, optional
 * @param {object} aOtherData	aux data usually Event.Recurrence
 * @param {string} sFolderType	force item type eg. 'E' will be determined from id when null or undefined
 * @param {cb} oResponse		executed on exit
 * @param {cb} oFinished		executed when frm initialised
 * @param {boolean} bClone
 */
Item.openwindow = function(id, aValues, aOtherData, sFolderType, oResponse, oFinished, bClone) {

	if (!sFolderType){
		sFolderType = dataSet.get("folders", [id[0], id[1], 'TYPE']);
		if (!sFolderType)
			if (id[0]==sPrimaryAccount){
				if (id[1] == '__@@ADDRESSBOOK@@__' || id[1] == '@@mycard@@')
					sFolderType = 'C';
			}
			else
				return;
	}

	var type = Mapping.getFormNameByGWType(sFolderType);

	if (!aValues && id[2]){

		//Search for already opened window
		var popups = gui._getChildObjects('main',type);
		for(var i in popups)
			if (popups[i]._type === type && popups[i]._sAccountID === id[0] && popups[i]._sFolderID === id[1] && popups[i]._sItemID === id[2])
				return popups[i]._focus();

		//Get Values from server
		var aItemsInfo = {"aid": id[0], "fid": id[1], "iid": id[2]};
		if (aOtherData && Is.Defined(aOtherData.EVNRCR_ID) && Is.Defined(aOtherData.EVNSTARTDATE))
			aItemsInfo.date = aOtherData.EVNSTARTDATE;

		// send extra XML tag only for Notes, Tasks, Contacts, Calendar Events, Documents (F)
		if (sFolderType === 'N' || sFolderType === 'T' || sFolderType === 'C' || sFolderType === 'E' || sFolderType === 'F') {
			// do not use strict checking - settings are stored as strings
			if (1 == GWOthers.getItem('MAIL_SETTINGS_GENERAL', 'show_inline_images')) {
				aItemsInfo.values = ['show_inline_images']; // show external images
			}
		}

		WMItems.list(aItemsInfo, null, null, null, [function(aData){
			if (aData && aData[id[0]] && aData[id[0]][id[1]]){
				if (id[1] == '@@mycard@@'){
					id[2] = '';

					aValues = aData[id[0]][id[1]];
					delete aValues['/'];
					delete aValues['$'];
					delete aValues['#'];
					delete aValues['@'];

					for(var i in aValues)
						if (Is.Object(aValues[i])){
							id[2] = i;
							break;
						}

					aValues = aValues[id[2]] || {};
				}
				else
					aValues = aData[id[0]][id[1]][id[2]];
			}
			else
			if (id[1] == '@@mycard@@'){
				id[2] = '';
				aValues = {LOCATIONS:[{values:{LCTEMAIL1:sPrimaryAccount,LCTTYPE:'H'}}]};
			}
			else
				aValues = {};

			var frm = gui._create('gw', type, '', '', id[0], id[1], id[2], aValues, aOtherData, oResponse, bClone);
			if (oFinished)
				executeCallbackFunction(oFinished, frm);

		}]);

		return;
	}

	var frm = gui._create('gw', type, '', '', id[0], id[1], id[2], aValues, aOtherData, oResponse, bClone);
	if (oFinished)
		executeCallbackFunction(oFinished, frm);
	return frm;
};


/**
 * Clone only for events! Copies event and opens edit dialog with cloned event
 *
 * @returns {undefined}
 */
Item.cloneEvent = function(id) {
	WMItems.list({aid: id[0], fid: id[1], iid: id[2]}, null, null, null,
		[
			function (aRes){
				if (aRes && (aRes = aRes[id[0]]) && (aRes = aRes[id[1]]) && (aRes = aRes[id[2]])){

					var aItemsInfo = {
						aid: id[0],
						fid: id[1],
						iid: [id[2]],
						account: id[0],
						folder: Path.slash(aRes['EVNFOLDER'])
					};

					WMItems.copy(aItemsInfo,'items','','folders',
						[
							function(bOK, aData){
								if (bOK){
									Item.__refreshView([id[0],id[1]],true);
									Item.openwindow([id[0],id[1],WMItems.__clientID(aData.Array.IQ[0].RESULT[0].ID[0].VALUE)]);
								}
							}
						]
					);
				}
			}
		]
	);
};

Item.print = function(ids){

	if (!ids || !ids[2].length)
		return;

	var ids = ids,
		aItemsInfo = {aid:ids[0],fid:ids[1]},
		sType = WMFolders.getType(ids);

	aItemsInfo.filter = {search:'items:(' + ids[2].join(' or ').replace(/\*/g,'') + ')'};

	switch(sType){

	case 'T':
		aItemsInfo.values = [
			'EVNTITLE','EVNLOCATION','EVNNOTE','EVNDESCFORMAT','EVNSTATUS','EVNCOMPLETE','EVNENDDATE','EVNSTARTDATE','EVNTYPE'
		];

		WMItems.list(aItemsInfo, '', '','', [function(aData){

			if (aData && (aData = aData[aItemsInfo.aid]) && (aData = aData[aItemsInfo.fid])){
				var out = [];

				for(var i in ids[2])
					if (aData[ids[2][i]])
						out.push(aData[ids[2][i]]);

				if (out.length){
					var frm;
					if (!(frm = gui.print))
						frm = gui._create('print', 'frm_print');

					frm._add(sType, out);
				}
			}

		}]);

		break;
	case 'N':
		aItemsInfo.filter = false;
		aItemsInfo.values = ['show_inline_images'];
		aItemsInfo.iid = WMItems.__serverID(ids[2][0]);

		WMItems.list(aItemsInfo, '', '','', [function(aData){
			if (aData && (aData = aData[aItemsInfo.aid]) && (aData = aData[aItemsInfo.fid]) && (aData = aData[ids[2][0]])){
				aData.NOTE_TEXT = aData.NOTES[0].values.NOTE_TEXT;
				var frm;
				if (!(frm = gui.print))
					frm = gui._create('print', 'frm_print');

				frm._add(sType, aData);
			}

		}]);

		break;
	case 'C':

		aItemsInfo.values = [

			'ITMCLASSIFYAS','ITMTITLE','ITMFIRSTNAME','ITMMIDDLENAME','ITMSURNAME','ITMCLASS','ITMSUFFIX','ITMCOMPANY','ITMJOBTITLE','ITMDEPARTMENT',
			'LCTEMAIL1','LCTEMAIL2','LCTEMAIL3',

			//ALL Phones
			'LCTPHNPRIMARY',
			'LCTPHNWORK1','LCTPHNWORK2','LCTPHNFAXWORK',
			'LCTPHNHOME1','LCTPHNHOME2','LCTPHNFAXHOME',
			'LCTPHNASSISTANT','LCTPHNCALLBACK','LCTPHNCOMPANY','LCTPHNCAR','LCTPHNISDN','LCTPHNOTHER','LCTPHNOTHERFAX','LCTPHNPAGER',
			'LCTPHNFAXWORK','LCTPHNMOBILE','LCTPHNRADIO','LCTPHNTELEX','LCTPHNHEARING'
		];

		//Loactions
		aItemsInfo.locations = true;

		aItemsInfo.filter.sort = 'ITMSURNAME,ITMFIRSTNAME,ITMCLASSIFYAS';

		WMItems.list(aItemsInfo, '', '','', [function(aData){

			if (aData && (aData = aData[aItemsInfo.aid]) && (aData = aData[aItemsInfo.fid])){
				var tmp,out = [], loc;

				for(var i in ids[2])
					//Contacts only
					if (aData[ids[2][i]] && aData[ids[2][i]].ITMCLASS == 'C'){
						tmp = {PHONES:[]};
						for(var j in aData[ids[2][i]])
							//Parse Locatons
							if (j === 'LOCATIONS'){
								for(var k in aData[ids[2][i]][j])
									if ((loc = aData[ids[2][i]][j][k]) && (loc = loc.values)){
										//expose home loc
										if (loc.LCTTYPE === 'H'){
											for(var l in loc)
												loc[l] && (tmp[l] = loc[l]);
										}
										else{
											tmp[loc.LCTTYPE] = {};
											for(var l in loc)
												loc[l] && (tmp[loc.LCTTYPE][l] = loc[l]);
										}
									}
							}
							else
							//phones
							if (j.indexOf('LCTPHN') == 0){
								if (aData[ids[2][i]][j])
									tmp.PHONES.push({PHNTYPE:getLang('PHONE::'+ j.toUpperCase()), PHNNUMBER:aData[ids[2][i]][j]});
							}
							else
								tmp[j] = aData[ids[2][i]][j];

						out.push(tmp);
					}

				out.length && (gui.print || gui._create('print', 'frm_print'))._add(sType, out);
			}

		}]);

		break;
	}
};

Item.create = function(sType, sAccount, sFolder) {
	// TODO	move code from obj_hmenu_basic to here
	gui.frm_main.hmenu1.__createNewGW(sType);
};

Item.createInFolder = function(sAccount, sFolder, aValues, sFolderType) {
	sFolderType = dataSet.get("folders", [sAccount, sFolder, 'TYPE']) || sFolderType;

	if (sFolderType == 'M'){

		newMessage = new NewMessage();
		newMessage.addSignature();

		if (aValues.PUSH_ATTACHMENTS){
			newMessage.aAttachments = {'attachments': []};
			for (var i in aValues.PUSH_ATTACHMENTS)
				if (aValues.PUSH_ATTACHMENTS[i].fullpath)
					newMessage.aAttachments.attachments.push({'values': {'class': 'item', 'fullpath':aValues.PUSH_ATTACHMENTS[i].fullpath, 'name':aValues.PUSH_ATTACHMENTS[i]['title']}});
		}

		if (aValues.EVNTITLE)
			newMessage.sSubject = aValues.EVNTITLE;

		gui._create('frm_compose', 'frm_compose', '', '', newMessage);
	}
	else
	if (sFolderType === 'F' && !aValues) {
		gui._create('insert_item', 'frm_insert_item', '', 'frm_insert_item_nobottomdiv', [gui.frm_main, '__copyItem', [[sAccount, sFolder]]], sAccount, sFolder, '', 'r', false, ['F', 'I', 'X'], 'X');
	}
	else
	if (sFolderType === 'I' && aValues.PUSH_ATTACHMENTS) {

		var aBuffer = [];
		aValues.PUSH_ATTACHMENTS.forEach(function(att){
			aBuffer.push({
				class: 'item',
				description: att.title,
				size: att.size,
				fullpath: att.fullpath
			});
		});

		if (aBuffer.length == 1){
			gui._create('chat_upload', 'frm_chat_upload', '', '', aBuffer[0].description, '', {aid:sAccount, fid:sFolder}, [function (sName, sDesc, aArg) {
				Item.CopyToChat(aBuffer, sName, sDesc, aArg, null, {aid:sAccount, fid:sFolder});
			}]);
		}
		else{
			Item.CopyToChat(aBuffer, null, null, null, null, {aid:sAccount, fid:sFolder});
		}

	} else{
		Item.openwindow ([sAccount, sFolder], aValues, null, sFolderType);
	}
};



Item.CopyToChat = function(aBuffer, sName, sDesc, aArg, comevnid, aPath, aHandler){
	if (aBuffer && aBuffer.length){

		var d = new IcewarpDate(),
			aItemInfo = {values:{},ATTACHMENTS:[]};

		aItemInfo.values.EVNSHARETYPE = 'U';
		aItemInfo.values.EVNCLASS = 'F';
		aItemInfo.values.EVNSTARTDATE = d.format(IcewarpDate.JULIAN);
		aItemInfo.values.EVNSTARTTIME = d.hour()*60 + d.minute();

		if (comevnid)
			aItemInfo.values.EVNCOMEVNID = comevnid;

		if (aBuffer.length == 1){

			aItemInfo['values']['EVNRID'] = aItemInfo['values']['EVNLOCATION'] = aItemInfo['values']['EVNTITLE'] = sName || aBuffer[0].name;
			aItemInfo['values']['EVNCOMPLETE'] = aBuffer[0].size;

			if (Is.String(sDesc) && sDesc.length){
				aItemInfo['values']['EVNNOTE'] = sDesc;
				aItemInfo['values']['EVNDESCFORMAT'] = 'text/plain';
			}
		}

		for(var i=0, j = aBuffer.length;i<j;i++)
			aItemInfo['ATTACHMENTS'].push({values:aBuffer[i]});

		//Sent to server
		WMItems.add([aPath.aid,aPath.fid], aItemInfo,'','','', [function(bOK, aData){
			if (bOK && aHandler){
				executeCallbackFunction(aHandler,[bOK, aData, aArg]);
			}
		}]);
	}
};

Item.notify = function(id, sAction, sItemType, aVal){
	if (gui.socket){
		var f = dataSet.get('folders',[id[0],id[1]]);
		if (f){
			var aOut = {
				'ACTION':sAction,
				'TYPE':'item',
				'ITEM':WMItems.__serverID(id[2]),
				'FOLDER':f.RELATIVE_PATH || id[1],
				'FOLDER-TYPE':f.TYPE,
				'EMAIL':f.OWNER,
				'ORIGINATOR-ID': sPrimaryAccountGWID,
				'ORIGINATOR-NAME': dataSet.get('main',['fullname']),
				'ORIGINATOR-EMAIL': sPrimaryAccount,
				'ITEM-TYPE':sItemType || f.TYPE
			};

			if (aVal)
				for(var k in aVal)
					aOut[k] = aVal[k];

			gui.socket.api._notify(aOut);
		}
	}
};

Item.emailAttendees = function(id) {
	return WMItems.list({ aid: id[0], fid: id[1], iid: id[2] }, null, null, null, [function(aData) {
		var aTo = [];
		aData = ((aData[id[0]] || {})[id[1]] || {})[id[2]] || {};
		var contacts = aData.CONTACTS || {};
		for(var i in contacts) {
			aTo.push(MailAddress.createEmail(contacts[i].values.CNTCONTACTNAME, contacts[i].values.CNTEMAIL));
		}

		var newMessage = new NewMessage();
		newMessage.sSubject = aData.EVNTITLE;
		newMessage.sTo = aTo.join(',');
		newMessage.addSignature();

		gui._create('frm_compose', 'frm_compose', '', '', newMessage, void 0, {
			context: 'Item',
			fun: ['emailAttendees'],
			args: [id]
		});
	}]);
}

Item.set_lock = function(ids, bLock, bRefreshPreview, aHandler){ //, sItemType
	WMItems.action({"aid": ids[0], "fid": ids[1], "iid": ids[2]}, (bLock?'lock':'unlock'), [function(bOK){
		if (bOK){
			//Notify
			Item.notify(ids, (bLock?'lock':'unlock'), '-', {BODY:'1'}); //sItemType

			//Refresh DataGrid
			if (bRefreshPreview)
				Item.__refreshView(ids, true);
		}

		/*		//called in __refreshView
		//Refresh preview
		if (bRefreshPreview){
			if (gui.frm_main && gui.frm_main.main && gui.frm_main.main.itemview){

				if (!Is.Array(ids[2]))
					ids[2] = [ids[2]];

				for (var i in ids[2])
					if (dataSet.get('preview', [ids[0], ids[1], ids[2][i]])){
						dataSet.remove('preview');
						Item.open([ids[0], ids[1], ids[2][i]]);
						break;
					}
			}
		}
*/
		if (aHandler)
			executeCallbackFunction(aHandler, bOK);
	}]);
};


Item.edit_value = function(sValue,id,sColumn,aOut){
	var	aOut = aOut || {values:{}};

	if (sColumn == 'EVNFILENAME' || sColumn == 'CONVERT'){
		WMItems.list({"aid": id[0], "fid": id[1], "iid": id[2], "values": ['ATTACHMENTS']},'','','',[
			function(aData){
				if ((aData = aData[id[0]]) && (aData = aData[id[1]]) && (aData = aData[id[2]]) && (aData = aData.ATTACHMENTS)){
					for(var uid in aData){

						if (sColumn == 'CONVERT'){
							aOut = {ATTACHMENTS:[{"uid":uid,"values":{"convert":sValue}}]};
						}
						else{
							aOut.values['EVNTITLE'] = sValue;
							aOut.values['EVNLOCATION'] = sValue;
							aOut.values['EVNRID'] = sValue;
							aOut.ATTACHMENTS = [{"uid":uid,"values":{"description":sValue}}];
						}

						Item.edit_value('',id,'',aOut);
						return;
					}
				}

				//Some Error...
				Item.__refreshView(id,true);
			}
		]);
		return;
	}
	else
	if (sColumn)
		aOut.values[sColumn] = sValue;

	WMItems.add(id,aOut,'items','','',[
		function(bOK){
			Item.__refreshView(id,true);

			//Refresh preview
			// if (gui.frm_main && gui.frm_main.main && gui.frm_main.main.itemview){

			// 	if (!Is.Array(id[2]))
			// 		id[2] = [id[2]];

			// 	for (var i in id[2])
			// 		if (dataSet.get('preview', [id[0], id[1], id[2][i]])){
			// 			dataSet.remove('preview');
			// 			Item.open([id[0], id[1], id[2][i]]);
			// 			break;
			// 		}
			// }


		}
	]);
};

Item.edit_tags = function(ids, aHandler) {
	try{
		var iid = ids[2][0].replace(/\|\w+/, '');
		var tag_elm = {M:'TAGS',C:'ITMCATEGORY'}[dataSet.get("folders", [ids[0], ids[1], 'TYPE']) || 'M'] || 'EVNTYPE',
			sInitString = WMItems.list({"aid": ids[0], "fid": ids[1], "iid": iid, "values": [tag_elm]})[ids[0]][ids[1]][iid][tag_elm];
	}
	catch(r){
		return;
	}

	var dialog = gui._create('categories', 'frm_categories', '', '', sInitString,[
		function(sTags,ids){
			var	out = {values:{}};
			out.values[tag_elm] = sTags;

			if((sTags || '').split(',').sort().join(',') !== (sInitString || '').split(',').sort().join(',')) {
				WMItems.add(ids, out, 'items', '', '',[
					function(bOK, aData, ids){

						if (bOK && Is.Array(ids))
							Item.__refreshView(ids, WMFolders.getType(ids) != 'M');

					},[ids]
				]);
			}

			if (aHandler)
				executeCallbackFunction(aHandler);

		},[ids]]);

	dialog._onChange = function() {
		if (Is.Array(ids))
			Item.__refreshView(ids, WMFolders.getType(ids) == 'M');
	};
};

Item.addCert = function(id) {
	gui._create('add_cert','frm_insert_item','','frm_insert_item_nobottomdiv',[Item.addCert_request, [id]],sPrimaryAccount,Mapping.getDefaultFolderForGWType('C'),'C','w',void 0, ['C']);
};
Item.addCert_request = function(aItem,ids) {
	if (aItem && aItem[0]){
		aItem = aItem[0];
		WMItems.certificate({account:ids[0],folder:ids[1],item:ids[2],aid:aItem.aid,fid:aItem.fid,iid:aItem.id}, [Item.addCert_response]);
	}
};
Item.addCert_response = function(aData){
	//Error
	if (aData.error){
		var tmp = 'CERTIFICATE::';
		switch(aData.error){
		case 'account_invalid_id':
		case 'item_invalid_id':
		case 'folder_does_not_exist':
			tmp += 'INVALIDITEM';
			break;
		case 'certificate_data_missing':
			    tmp += 'MISSING';
		}

		gui.notifier._value({type: 'alert', args: {header: '', text: tmp}});
	}
	// OK
	else{
		var obj = gui._create('confirm','frm_confirm','','',[Item.open,[[aData.data.aid, aData.data.fid, aData.data.iid]]],'CERTIFICATE::CERTIFICATE','CERTIFICATE::ASSIGNED');
		    obj.x_btn_ok._value('POPUP_ITEMS::OPEN');
		    obj = null;
	}

/*
 [data]
.. [aid](string) = admin@merakdemo.com
.. [fid](string) = Contacts
.. [iid](string) = 3a2c8e2a3005
*/

};

/**
 * Recover items from recovery folder to their original folders
 *
 * @param Array   aIds Standard ids array (0: account id, 1: folder id, 2: array of item ids)
 * @param Boolean bAsk Show confirmation dialog at the beginning
 *
 * @return undefined
 */
Item.recover = function(aIds, bAsk) {
	var helper;

	helper = new ItemsRecoverHelper(
		aIds,
		bAsk,
		[Item.__recoverCallback] // Argument for executeCallbackFunction
	);

	helper.process();
};

/**
 * Callback which is called at the end of items recovery
 *
 * @param Array aFoldersMapping Folders mapping (format: [{source: 'xy', destination: 'xy'}, ...])
 * @param Array aIds            Standard ids array (0: account id, 1: folder id, 2: array of item ids)
 *
 * @return undefined
 */
Item.__recoverCallback = function(aFoldersMapping, aIds) {
	WMItems.recover(
		{
			'aid':aIds[0],
			'fid':aIds[1],
			'iid':aIds[2],
			'action': 'recover'
		},
		'items',
		'',
		'folders',
		aFoldersMapping
	);

	if (!Item.__removeFromDataset(aIds))
		Item.__refreshView(aIds, true);
};

Item.copy = function(ids) {
	gui._create('frm_select_folder', 'frm_select_folder', '', '', 'POPUP_ITEMS::COPY_MAIL_TO', ids[0], ids[1],
		[Item.__copyOrMoveItems, ['copy', ids]], false, false, dataSet.get("folders", [ids[0], ids[1], 'TYPE']),'w'
	);
};

Item.copyToAlfresco = function(ids) {
	gui._create('frm_select_folder', 'frm_select_folder', '', '', 'POPUP_ITEMS::COPY_MAIL_TO', '@@alfresco@@', '', [Item.__copyOrMoveItems, ['copy', ids]], false, true, 'K');
};

Item.clone = function(ids) {
	WMItems.copy({
		'aid': ids[0],
		'fid': ids[1],
		'iid': ids[2],
		'account': ids[0],
		'folder': ids[1],
		'duplicity':"rename"
	}, 'items', '', 'folders', [function (bOK) {
		Item.__refreshView([ids[0], ids[1]], true);
	}]);
};

Item.move = function(ids) {
	gui._create('frm_select_folder', 'frm_select_folder', '', '', 'POPUP_ITEMS::MOVE_MAIL_TO', ids[0], ids[1],
		[Item.__copyOrMoveItems, ['move', ids]], false, true, dataSet.get("folders", [ids[0], ids[1], 'TYPE']),'w'
	);
};

/**
 * Share to Teamchat
 *
 * @param {object} files
 * @param {object} opt
 */
Item.copy_tch = function(files, opt){
		opt = opt || {};

		function __uploadhandler(aTo, aBuffer, sName, sDesc) {
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
				}.bind(this)]);
			}
		};

		var f = dataSet.get('folders', [sPrimaryAccount]);
		for(var id in f){
			if (f[id].TYPE == 'I'){
				sFolder = id;
				break;
			}
		}

		if (sFolder) {
			gui._create('frm_select_folder', 'frm_select_folder', '', '', 'CHAT::SELECT', sPrimaryAccount, sFolder,
				[function(aid, fid) {
					var __upload_buffer = [];

					files[2].forEach(function (file) {
						var data = dataSet.get('items', [files[0], files[1], file]);

						if (data){
							var sFileName = '';
							switch(WMFolders.getType([files[0], files[1]])){
								case 'F':
									sFileName = data.EVNTITLE;
									break;
								case 'M':
									sFileName = data.SUBJECT + '.eml';
									break;
								case 'C':
									sFileName = data.ITMCLASSIFYAS + '.vcf';
									break;
								default:
									sFileName = data.EVNTITLE + '.ics';
							}
						}

						__upload_buffer.push({
							'class': 'item',
							'description': sFileName.replace(/[<>:\/\\|?*""\[\]]/g, ''),
							'size': data.SIZE,
							'fullpath': files[0] + '/' + files[1] + '/' + WMItems.__serverID(file),
							'client_id': file
						});
					});

					if (__upload_buffer.length == 1) {
						gui._create('chat_upload', 'frm_chat_upload', '', '', __upload_buffer[0].description, '', {aid: aid, fid: fid}, [function (sName, sDesc, aArg) {

							//link one item
							if (opt.link){

								WMItems.action({"aid": files[0], "fid": files[1], "iid": __upload_buffer[0].client_id, nodes:{note:sDesc, folder:fid}}, 'document_link', [function(bOK){
									if (bOK)
										gui.notifier._value({type: 'message_sent_tch', args: [__upload_buffer[0].description]});
									else
										gui.notifier._value({type: 'alert', args: {header: 'ALERTS::MESSAGE_NOT_SAVED', text: 'ALERTS::FOLDER_INSUFFICIENT_RIGHTS'}});
								}]);

								return;
							}

							__uploadhandler([aid, fid], __upload_buffer, sName, sDesc, aArg);
						}]);
					}
					else
					//link multiple items
					if (opt.link){
						__upload_buffer.forEach(function(file){
							WMItems.action({"aid": files[0], "fid": files[1], "iid": file.client_id, nodes:{folder:fid}}, 'document_link', [function(bOK){
								if (bOK)
									gui.notifier._value({type: 'message_sent_tch', args: [file.description]});
								else
									gui.notifier._value({type: 'alert', args: {header: 'ALERTS::MESSAGE_NOT_SAVED', text: 'ALERTS::FOLDER_INSUFFICIENT_RIGHTS'}});
							}]);
						});
					}
					else{
						__uploadhandler([aid, fid], __upload_buffer);
					}
				}], true, true, ['Y','I'], '', true
			);
		}
};

Item.invite_tch = function(sMail){

	var f = dataSet.get('folders', [sPrimaryAccount]);
	for(var id in f){
		if (f[id].TYPE == 'I'){
			sFolder = id;
			break;
		}
	}

	if (sFolder) {
		gui._create('frm_select_folder', 'frm_select_folder', '', '', 'CHAT::SELECT', sPrimaryAccount, sFolder,
			[function(aid, fid) {
				gui._create('invite', 'frm_groupchat_invite','','',{aid:aid, fid:fid},[function(){
					gui.notifier._value({type: 'success', args: {text: 'CHAT::INVITATION_SENT'}});
				}],sMail);
			}], true, true, ['Y','I'], '', true
		);
	}
};

/**
 * Sends message to the TeamChat Room
 *
 * @param {*} sFolder
 * @param {*} sBody
 * @param {*} aHandler
 * @returns folder picker form
 */
Item.message_tch = function(sFolder, sBody, aHandler){

	function mssg (sFolder, sBody){
		var aItemInfo = {
			values:{
				EVNNOTE: sBody,
				EVNSHARETYPE: 'U'
			}
		};

		WMItems.add([sPrimaryAccount, sFolder], aItemInfo,'','','', aHandler);
	};

	if (!sFolder){
		var f = dataSet.get('folders', [sPrimaryAccount]);
		for(var id in f){
			if (f[id].TYPE == 'I'){
				sFolder = id;
				break;
			}
		}

		if (sFolder) {
			gui._create('frm_select_folder', 'frm_select_folder', '', '', 'CHAT::SELECT', sPrimaryAccount, sFolder,
				[function(aid, sFolder) {
					mssg(sFolder, sBody);
				}], true, true, ['Y','I'], '', true
			);
		}
	}
	else
		mssg(sFolder, sBody);
};

Item.downloadMultiple = function(ids) {
	WMItems.save_items({"aid": ids[0], "fid": ids[1], "iid": ids[2]},currentBrowser().indexOf('MSIE')<0);
};

Item.downloadSource = function(id,ext) {
	var aUrl = {'sid': dataSet.get('main', ['sid']), 'class': 'item'+(ext || ''), 'fullpath': id[0]+'/'+id[1]+'/'+WMItems.__serverID(id[2].replace(/\|\w+/, ''))};
	downloadItem(buildURL(aUrl));
};

Item.webdavURL = function(id,sAtId){
	try{
		if (!Is.Defined(sAtId)){
			var aData = WMItems.list({"aid": id[0], "fid": id[1], "iid": id[2], "values": ['EVN_ID']})[id[0]][id[1]][id[2]];
			for (var sAtId in aData['ATTACHMENTS'])
				break;

			if (!Is.Defined(sAtId))
				return false;
		}

		return 'server/download.php?' + buildURL({'sid':dataSet.get('main',['sid']),'class':(sAtId.length?'attachmentticket':'itemticket'),'fullpath':id[0]+'/'+id[1]+'/'+WMItems.__serverID(id[2])+(sAtId.length?'/'+sAtId:'')});
	}
	catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r)}

	return false;
};
Item.downloadFile = function(id) {
	try{
		var aData = WMItems.list({"aid": id[0], "fid": id[1], "iid": id[2], "values": ['EVN_ID']})[id[0]][id[1]][id[2]];
		for (var sAtId in aData['ATTACHMENTS']){
			downloadItem(buildURL({'sid':dataSet.get('main',['sid']),'class':'attachment','fullpath':id[0]+'/'+id[1]+'/'+WMItems.__serverID(id[2])+'/'+sAtId}));
			return true;
		}
	}
	catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r)}

	return false;
};
Item.getPublicUrl = function(id) {
	try{
		var aData = WMItems.list({"aid": id[0], "fid": id[1], "iid": id[2], "values": ['EVN_ID']})[id[0]][id[1]][id[2]];
		for (var sAtId in aData['ATTACHMENTS'])
			break;

		return aData.ATTACHMENTS[sAtId].values.TICKET || false;
	} catch(r) {}

	return false;
};

/**
 * oOriginator - object which will be focused after execution
 * iNext - originator next value
 */
Item.remove = function(ids, bForce, oRepeating, oOriginator, iNext, aHandler)
{
	if (Is.Object(oRepeating)){
		var frm = gui._create('frm_confirm','frm_confirm_repeating','','', [Item.__removeWithRepeating, [ids,oRepeating,void 0, bForce, aHandler]],'REPEATING_CONFIRM::TITLE_DELETE','REPEATING_CONFIRM::TEXT_DELETE');

		//return focus to originator object if any
		if (oOriginator && oOriginator._focus){
			frm.___returnFocus = function(){
				oOriginator._focus();
			};
			frm._add_destructor('___returnFocus');
		}

		return;
	}

	storage.library('gw_others');

	if (bForce){
		Item.__delete(ids,oOriginator,iNext, bForce, aHandler);
		return;
	}
	else
	if (dataSet.get("folders",[ids[0],ids[1],'TYPE']) == 'M' && parseInt(GWOthers.getItem('MAIL_SETTINGS_GENERAL','move_to_trash'))>0){

		//Primary Account
		var sTrashFolder = Path.split(GWOthers.getItem('DEFAULT_FOLDERS','trash'))[1];

		//Other Account
		if (sPrimaryAccount != ids[0]){
			var sTrash = dataSet.get('accounts',[ids[0],'TRASHFOLDER']);
			if (sTrash)
				sTrashFolder = Path.split(sTrash)[1];
		}

		if (sTrashFolder != ids[1]){

			var aFolders = dataSet.get('folders');
			if (!aFolders[ids[0]][sTrashFolder])
				dataSet.add('folders',[ids[0],sTrashFolder],{'NAME':sTrashFolder,'TYPE':'M','RIGHTS':'rwmd'});

			Item.__copyOrMoveItems(ids[0],sTrashFolder,'move',[ids[0],ids[1],ids[2]]);

			//return focus to originator object if any
			if (oOriginator){
				if (oOriginator._focus)
					oOriginator._focus();
				if (typeof iNext != 'undefined')
					oOriginator._value([iNext]);
			}

			return;
		}
	}

	if (gui.__bSkipDeleteConfirmation){
		Item.__delete(ids,oOriginator,iNext, false, aHandler);
		if (oOriginator && oOriginator._focus)
			oOriginator._focus();
	}
	else
	{
		var frm = gui._create('frm_confirm','frm_confirm', '', 'noblur', [Item.__delete, [ids,oOriginator,iNext,false,aHandler]],
			'CONFIRMATION::DELETE_ITEM_CONFIRMATION','CONFIRMATION::DELETE_ITEM'
		);
		frm._size(400, 180);

		if (sPrimaryAccountGWTRASH){
			switch(WMFolders.getType(ids)){
				case 'M':
				case 'G':
				case 'Q':
				case 'QL':
					addcss(frm.x_btn_ok._main,'color2');
					break;

				default:
					frm.obj_label.__eIN.innerHTML += '<br>' + getLang('CONFIRMATION::DELETE_ITEM_TRASH');
			}
		}
		else{
			addcss(frm.x_btn_ok._main,'color2');
		}

		var skip = frm._create('skip','obj_button_check','footer', 'transparent simple x_btn_right');
		skip._value('POPUP_ITEMS::SKIP_DELETE');
		skip._tabIndex();
		skip._onclick = function(){
			gui.__bSkipDeleteConfirmation = this._checked()>0;
		};

		//return focus to originator object if any
		if (oOriginator && oOriginator._focus){
			frm.___returnFocus = function(){
				if (oOriginator._focus)
					oOriginator._focus();
			};
			frm._add_destructor('___returnFocus');
		}
	}
};

Item.setColor = function(id, sColor) {
	var sOldColor = Item.getColor(id);

	if (!sOldColor || (sOldColor != sColor)) {
		// TODO rollback on error
		dataSet.add('items', id.concat(['EVNCOLOR']), sColor);
		WMItems.add(id, {'values': {'EVNCOLOR': sColor}}, 'items');
	}
};

Item.getColor = function(id) {
	return dataSet.get('items', id.concat(['EVNCOLOR']));
};

Item.hasReccurence = function(id,rcr_id) {
	if (!Is.Object(id))	return false;

	var tmpItm = dataSet.get('items',id);
	if (!Is.Object(tmpItm) || tmpItm.EVNCLASS == 'O') return false;

	if (!Is.Defined(rcr_id))
		rcr_id = tmpItm.EVNRCR_ID;

	return rcr_id?true:false;
};
Item.sendEmailTo = function(sLctEmail,aValues){
	if (sPrimaryAccountGUEST || (TeamChatAPI && TeamChatAPI.teamChatOnly())){
		window.location.href = "mailto:"+sLctEmail;
		return;
	}

	var newMessage = new NewMessage();
	newMessage.sTo = sLctEmail;
	newMessage.addSignature();

	if (aValues){
		for (var i in aValues)
			if (Is.Function(newMessage[i]))
				newMessage[i](aValues[i]);
			else
				newMessage[i] = aValues[i];
	}

	gui._create('frm_compose', 'frm_compose', '', '', newMessage);

};

Item.sendAsEmail = function(ids) {

	var aData, sName = '', sSize,
		sFTyle = (ids[1] == '@@mycard@@'?'C':dataSet.get('folders', [ids[0], ids[1], 'TYPE'])),
		newMessage = new NewMessage();
	newMessage.addSignature();
	newMessage.aAttachments = {'attachments': []};

	for (var i in ids[2]){
		if (!Is.Defined(sName = dataSet.get('items', [ids[0], ids[1], ids[2][i], sFTyle == 'C'?'ITMCLASSIFYAS':'EVNTITLE']))){
			aData = WMItems.list({"aid": ids[0], "fid": ids[1], "iid": ids[2][i], "values": [(sFTyle == 'C'?'ITMCLASSIFYAS':'EVNTITLE')]});
			try{
				sName = aData[ids[0]][ids[1]][ids[2][i]][sFTyle == 'C'?'ITMCLASSIFYAS':'EVNTITLE'] || '';
			}
			catch(r){
				continue;
			}
		}

		sSize = dataSet.get('items', [ids[0], ids[1], ids[2][i],'EVNCOMPLETE']);

		if (sName){
			newMessage.sSubject = sName;

			if (sFTyle != 'F')
				sName += sFTyle == 'C'?'.vcf':'.ics';

			newMessage.aAttachments.attachments.push({'values': {'class': 'item', 'fullpath': ids[0]+'/'+ids[1]+'/'+WMItems.__serverID(ids[2][i]), size: sSize, 'name': sName}});
		}
	}

	gui._create('frm_compose', 'frm_compose', '', '', newMessage);
};
/*
	acc, fol - destination folder
	v - drop values
*/
Item.__convertToFolder = function(acc,fol,v){
	var t1  = WMFolders.getType([acc,fol]),
		t2  = WMFolders.getType(v.value[0]);

	//create ids
	var ids = [v.value[0].aid,v.value[0].fid,[]];
	for(var i in v.value)
		ids[2].push(v.value[i].iid);

	//Drag & Drop doesnt work with popups because of event handlers.
	gui.frm_main.dnd.remove_drag(true);

	if (fol == 'SPAM_QUEUE/Whitelist' || fol == 'SPAM_QUEUE/Blacklist'){
		if (t2 == 'M')
			OldMessage.__blackOrWhiteList(ids, fol == 'SPAM_QUEUE/Whitelist');
	}
	else
	if (t1!=t2){
		var title = [], name, mail, q, note, arg, out = {}, att = [];
		for(var i in v.value){

			arg = {
				id:v.value[i].iid,
				fullpath:v.value[i].aid+'/'+v.value[i].fid+'/'+WMItems.__serverID(v.value[i].iid),
				embedded:true
			};

			//Detail Request
			var aReq = {"aid": v.value[i].aid, "fid": v.value[i].fid, "iid": v.value[i].iid};
			if (t2 == 'P' || t2 == 'M')
				aReq.values = ['SUBJECT','SIZE','FROM','HTML','STATIC_FLAGS'];

			if (!(q = WMItems.list(aReq)[v.value[i].aid][v.value[i].fid][v.value[i].iid]))
				return;

			switch(t2){
			case 'R':
				try{
					if (typeof title[0] == 'undefined')	title.push(q.SUBJECT);
					note = note || q.TEXT || q.HTML;
				}
				catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r)}

				break;

			case 'P':
			case 'M':
				arg.title = q.SUBJECT || '';
				arg.size =  q.SIZE || 0;

				if (typeof title[0] == 'undefined'){
					if (t1=='C'){
						var splited = MailAddress.splitEmailsAndNames(q.FROM);
						if (splited[0]){
							mail = splited[0].email;
							name = splited[0].name;
						}
					}
					title.push(arg.title);

					note = q.HTML;
					if (q.STATIC_FLAGS & 1)
						out[t1 == 'C' || t1 == 'D'?'ITMDESCFORMAT':'EVNDESCFORMAT'] = 'text/html';
				}

				arg.title += (arg.title?' - ':'')+ WMItems.__serverID(v.value[i].iid) +'.eml';

				break;

			case 'F':

				for (var sAtId in q['ATTACHMENTS'])
					break;

				arg.title = q.EVNLOCATION;
				arg.size = q.EVNCOMPLETE || 0;
			//	arg.fullpath += '/'+sAtId;
				arg.type = 'push_attachment';

				if (typeof title[0] == 'undefined' && !note)
					note = q.EVNNOTE;

				break;

			case 'C':
			case 'D':

				if (typeof title[0] == 'undefined' && !note)
					note = q.ITMDESCRIPTION;

				arg.title = q.ITMCLASSIFYAS + '.vcf';
				break;

			case 'N':
			case 'T':
			case 'E':
			case 'J':
				if (typeof title[0] == 'undefined' && !note)
					if (t2 == 'N')
						note = q.NOTES && q.NOTES[0].values?q.NOTES[0].values.NOTE_TEXT:'';
					else
						note = q.EVNNOTE;

				arg.title = (q.EVNTITLE || q.ITMTITLE || '') + '.ics';
			}

			att.push(arg);
		}

		if (name)
			parseNameToLocation(name,out);

		if (mail)
			out.LOCATIONS = [{values:{LCTTYPE:'H',LCTEMAIL1:mail}}];

		if (note){
			switch(t1){
			case 'C':
			case 'D':
				out.ITMDESCRIPTION = note;
				break;
			case 'N':
				out.NOTES = [{values:{NOTE_TEXT:note}}];
				break;
			case 'I':
				break;
			default:
				out.EVNNOTE = note;
			}
		}

		out.EVNTITLE = title.join(', ');

		if (t2 != 'R')
			out.PUSH_ATTACHMENTS = att;

		Item.createInFolder(acc, fol, out);
	}
	else
		Item.__copyOrMoveItems(acc, fol, (v.ctrl?'copy':'move') + (v.select_all ? 'all' : ''), ids);
};


Item.__copyOrMoveItems = function(sDestAccount, sDestFolder, sAction, ids) {

	if (sDestAccount && sDestFolder && (sAction != 'move' || sDestAccount != ids[0] || sDestFolder != ids[1]))
	{
		// Refresh folders (folder tree)
		var aFolderProps = dataSet.get('folders', [ids[0], ids[1]], true),
			aNewFolderProps = dataSet.get('folders', [sDestAccount, sDestFolder], true),
			nFlag;

		if (aFolderProps && (aFolderProps['TYPE'] == 'M' || aFolderProps['TYPE'] == 'Q')){

			if (typeof aFolderProps['RECENT'] == 'undefined')
				aFolderProps['RECENT'] = 0;

			if (typeof aNewFolderProps != 'undefined' && !aNewFolderProps['RECENT'])
				aNewFolderProps['RECENT'] = 0;

			for (var n in ids[2]) {
				if (typeof aNewFolderProps != 'undefined' && !(nFlag = WMItems.getFlag([ids[0],ids[1],ids[2][n]],'SEEN','items'))) {
					dataSet.add('folders', [sDestAccount, sDestFolder, 'RECENT'], (++aNewFolderProps['RECENT']).toString(), true);
				}

				if (sAction == 'move' && !nFlag) {
					dataSet.add('folders', [ids[0], ids[1], 'RECENT'], (--aFolderProps['RECENT']).toString(), true);
				}

				if (typeof aFolderProps['COUNT'] !== 'undefined') {
					dataSet.add('folders', [ids[0], ids[1], 'COUNT'], (--aFolderProps['COUNT']).toString(), true);
				}
				if (typeof aNewFolderProps != 'undefined' && typeof aNewFolderProps['COUNT'] !== 'undefined') {
					dataSet.add('folders', [sDestAccount, sDestFolder, 'COUNT'], (++aNewFolderProps['COUNT']).toString(), true);
				}
			}
			dataSet.update('folders');
		}

		switch(sAction)
		{
		case 'copyall':
		case 'moveall':
			WMFolders.action({aid: ids[0], fid: ids[1]},'folders','',sAction,{aid:sDestAccount,fid:sDestFolder});
			break;
		case 'copy':
			//Async copy items and refresh folders (folder tree)
			WMItems.copy({'aid':ids[0],'fid':ids[1],'iid':ids[2],'account':sDestAccount,'folder':sDestFolder},'items','','folders',[function(bOK){
				bOK && gui.notifier._value({type: 'success', args: {text: 'NOTIFICATION::ITEMS_COPIED'}});
				Item.__refreshView([sDestAccount,sDestFolder],true);
			}]);
			break;

		case 'move': // synchronous

			if (sDestAccount != ids[0] || sDestFolder != ids[1])
			{
					/*
					//Async move items and refresh folders (folder tree)
					var aHandler = null;
					if (!Item.__removeFromDataset(ids))
						aHandler = [Item.__refreshView, [ids]];
						WMItems.move({'aid':ids[0],'fid':ids[1],'iid':ids[2],'account':sDestAccount,'folder':sDestFolder},'items','','folders',aHandler);
					*/

					//synchro move
				WMItems.move({'aid':ids[0],'fid':ids[1],'iid':ids[2],'account':sDestAccount,'folder':sDestFolder},'items','','folders',[
					function(){
						if (!Item.__removeFromDataset(ids))
							Item.__refreshView(ids,true);
					}]);
			}
			break;
		}
	}
};

Item.__removeWithRepeating = function(iState, ids, oRepeating,oOriginator, bForce, aHandler) {
	var aValues = {};
	bForce && (aValues.skip_trash = 1);
	switch(iState.toString()){
	case '2':
		aValues.EXPFOLLOWING = 'true';
	case '0':
		aValues.EXPDATE = oRepeating['EVNSTARTDATE'];
		WMItems.remove({'aid':ids[0],'fid':ids[1],'iid':ids[2],'values':ids[2].map(function(){return aValues})},'items','','folders',[function(bOK){
			if (aHandler)
				executeCallbackFunction(aHandler, true);
			else
				Item.__refreshView(ids,true);
		}]);
		break;
	default:
		Item.__delete(ids, void 0, void 0, bForce, aHandler);
	}
};

/**
 * optional oOriginator,iNext (for DataGrid purpose)
 **/
Item.__delete = function(ids,oOriginator,iNext, skip_trash,aHandler) {

	if (oOriginator && oOriginator._focus)
		oOriginator._focus();

	// DELETE SELECTION 2
	for (var i in ids[2])
		 if (ids[2][i].indexOf('|')>-1)
		 	delete ids[2][i];

	if (!count(ids[2])) return;

	// Refresh folders (folder tree)
	var aFolderProps = dataSet.get('folders',[ids[0],ids[1]]);
	if (aFolderProps && (aFolderProps['TYPE'] == 'M' || aFolderProps['TYPE'] == 'R')){
		var iRecent = aFolderProps['RECENT'] || 0;

		for(var n in ids[2])
			if (!WMItems.getFlag(makeIDFromIDS(ids,n),'SEEN','items'))
				iRecent--;

		dataSet.add('folders',[ids[0],ids[1],'RECENT'],(iRecent>0?aFolderProps['RECENT']:0).toString(),true);
		dataSet.update('folders',[ids[0],ids[1],'RECENT']);
	}
	var data = {
		'aid': ids[0],
		'fid': ids[1],
		'iid': ids[2]
	};
	if (skip_trash) {
		data.values = ids[2].map(function () {
			return {skip_trash: 1};
		});
	}

	WMItems.remove(data,'items','','folders',[function(bOK){
		if (bOK){
			if (oOriginator && typeof iNext != 'undefined')
				oOriginator._value([iNext]);

			// Async remove items
			if(!Item.__removeFromDataset(ids) && !aHandler)
				Item.__refreshView(ids);

		} else if (!aHandler) {
			Item.__refreshView(ids);
		}

		if (aHandler)
			executeCallbackFunction(aHandler, bOK);
	}]);
};

Item.__removeFromDataset = function(ids)
{
	var sFolType = WMFolders.getType(ids);
	if (sFolType && ids && ids[2]){
		// Vymazání položek z datasetu
		var n = 0, i;
		for(i in ids[2])
			if (dataSet.remove('items', makeIDFromIDS(ids, i), true))
				n++;

		// Correct Total (Count)
		var iTotal	= dataSet.get("items",[ids[0],ids[1],'/']);
		if (Is.Defined(iTotal))
			dataSet.add("items",[ids[0],ids[1],'/'],parseInt(iTotal,10)-n,true);

		// Mažeme mail, který byl aktivní pro náš folder?
		var sIt = dataSet.get('active_items',[ids[0],ids[1]]);
		if (Is.Defined(sIt) && inArray(ids[2], sIt) > -1){
			dataSet.remove('active_items',[ids[0],ids[1]]);
			dataSet.remove('preview');
		}

		if (sFolType != 'E' || Cookie.get(['views',ids[0],ids[1],'view']) == 'list_view'){
			dataSet.update('items');
			return true;
		}
		else
			// indicate that the view needs to be updated from the server
			return false;
	}
};

Item.__refreshView = function(ids,bNoRefresh) {
	var aActive = getPathFromDataset('items'),
		ids = clone(ids);

	if (aActive && ((aActive[0] == ids[0] && aActive[1] == ids[1]) || (WMFolders.getType(ids) == 'E' && aActive[1] == '__@@VIRTUAL@@__/__@@EVENTS@@__' && (ids[1] = '__@@VIRTUAL@@__/__@@EVENTS@@__')))){

		gui.frm_main._selectView({'aid':ids[0],'fid':ids[1]},null,false,null,(bNoRefresh?false:true));

		//Refresh preview
		if (bNoRefresh){
			if (gui.frm_main && gui.frm_main.main){

				if (!Is.Array(ids[2]))
					ids[2] = [ids[2]];

				if (gui.frm_main.main.mailview && WMFolders.getType(ids) == 'M'){
					for (var i in ids[2])
						if (dataSet.get('preview', [ids[0], ids[1], ids[2][i]])){
							dataSet.remove('preview');
							OldMessage.open([ids[0], ids[1], ids[2][i]]);
							break;
						}
				}
				else
				if (gui.frm_main.main.itemview){
					for (var i in ids[2])
						if (dataSet.get('preview', [ids[0], ids[1], ids[2][i]])){
							dataSet.remove('preview');
							Item.open([ids[0], ids[1], ids[2][i]]);
							break;
						}
				}

			}
		}
	}
};

// Accepts array or object
Item.playFile = function(id){
	if (gui.audio){
		var q;
		if (Is.Array(id))
			q = {"aid": id[0], "fid": id[1], "iid": id[2]};
		else
		if (Is.Object(id) && id.iid)
			q = {"aid": id.aid, "fid": id.fid, "iid": id.iid};
		else
			return;

		q.values =  ['EVN_ID'];

		try{
			WMItems.list(q,'','','',[function(aData){
				if (aData && (aData = aData[q.aid]) && (aData = aData[q.fid]) && (aData = aData[q.iid]))
					for (var sAtId in aData['ATTACHMENTS']){
						var sName = aData['ATTACHMENTS'][sAtId].values.ATTDESC || sAtId;
						if (Path.extension(sName) == 'mp3')
							gui.audio._value('server/download.php?' + buildURL({'sid':dataSet.get('main',['sid']),'class':'attachment','fullpath':q.aid+'/'+q.fid+'/'+WMItems.__serverID(q.iid)+'/'+sAtId}), sName);
					}
			}]);
		}
		catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r)}
	}
};

// Accepts array or object
Item.openPDF = function(id){
	var q;
	if (Is.Array(id))
		q = {aid: id[0], fid: id[1], iid: id[2]};
	else
	if (Is.Object(id) && id.iid)
		q = {aid: id.aid, fid: id.fid, iid: id.iid};
	else
		return;

	q.values =  ['EVN_ID'];

	try{
		WMItems.list(q,'','','',[function(aData){
			if (aData && (aData = aData[q.aid]) && (aData = aData[q.fid]) && (aData = aData[q.iid]))
				for (var sAtId in aData['ATTACHMENTS']){
					var sName = aData['ATTACHMENTS'][sAtId].values.ATTDESC || sAtId;
					if (Path.extension(sName) == 'pdf'){
						var url = 'server/download.php?' + buildURL({'sid':dataSet.get('main',['sid']),'class':'attachment','fullpath':q.aid+'/'+q.fid+'/'+WMItems.__serverID(q.iid)+'/'+sAtId});
						if(GWOthers.getItem('LAYOUT_SETTINGS','disable_pdf') == 1 || currentBrowser().match(/^MSIE([6-9]|10)$/)) {
							downloadItem(url, true);
						} else {
							gui._create('pdf','frm_pdf')._load(url, sName);
						}
						return;
					}
				}
		}]);
	}
	catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r)}
};

/**
 * Open in Dialog
 * 12.2.2013
 **/

Item.editFile = function(id){
	if (Is.Array(id)){
		var frm = gui._create('text','frm_editor');
		frm._load(id);
	}
};

/*

[aData]
.. [admin@merakdemo.com]
.... [Files/fff]
...... [$](string) = 0
...... [*424751d1f703]
........ [aid](string) = admin@merakdemo.com
........ [fid](string) = Files/fff
........ [EVNTITLE](string) = html.html
........ [DATA](string) = <head><title></title></head>
<body></body>

........ [ATTACHMENTS]
.......... [html.html]
............ [values]
.............. [ATTNAME](string) = html.html
.............. [ATTTYPE](string) = attachment
.............. [ATTTIME](string) = 1360228475
.............. [ATTSIZE](string) = 0
.............. [ATTDESC](string) = html.html
.............. [ATTPARAMS](undefined) = undefined
.............. [TICKET](string) = http://merakdemo.com/webdav/ticket/eJwVyjEOgCAMAMDX2E2F0gaWTib8Q7FVIi7q,6MuN90mwUiZUlDSAia5Nr07nswMimS4pEdP8QvMCCpQhZAi.9VbdGHcn7MNP3CI.dkhLpjSCy7eGDM_/html.html
 [id]
.. [0](string) = admin@merakdemo.com
.. [1](string) = Files/fff
.. [2](string) = *424751d1f703
 [sType](string) = html


*/

/**
 * Open in office by SharePoint or Java OfficeLauncher
 * 26.1.2012 15:21:07
 **/

Item.officeSupport = function(sFile){
	var bDisabled = GWOthers.getItem('DOCUMENTS', 'disable_office') == 1 || GWOthers.getItem('RESTRICTIONS', 'disable_doc_integration') == 1;
	var bSupport = dataSet.get('accounts', [sPrimaryAccount, 'OFFICE_SUPPORT']) == 'true';
	var editable = ~[
		'doc', 'docx', 'dot', 'docm', 'dotx', 'dotm', 'docb', 'odt', 'rtf',
		'xls', 'csv', 'xlsx', 'xla', 'xlam', 'xlsb', 'ods', 'xlsb', 'xlsm', 'xlt', 'xltm', 'xltx',
		'ppt', 'pptx', 'odp', 'pps', 'ppsm', 'ppsx', 'pptm', 'ppa', 'ppam'
	].indexOf(Path.extension(sFile));

	return editable && bSupport && !bDisabled;
};

Item.imageSupport = function(sFile){
	return inArray([
	 	'jpg', 'jpeg', 'png', 'gif'
	], Path.extension(sFile))>-1;
};

Item.editSupport = function(sFile){
	return inArray([
	 	'txt', 'html', 'htm'
	], Path.extension(sFile))>-1;
};


Item.officeOpen = function (aItemInfo, aErrHandler, sExtension, sMode, callback) {
	try {
		if (sMode === 'external') {
			if (!sPrimaryAccountWebDAV) {
				throw 'webdav';
			} else if (aItemInfo.url) {
				Item.officeWebdav(aItemInfo.url, aErrHandler, sExtension);
			} else {
				storage.library('wm_tools');
				new wm_tools().ticket(aItemInfo, 'rwil', [Item.officeWebdav, [aErrHandler, sExtension]]);
			}
			return;
		}

		//FOCUS already openned document
		var aii, mode = 0,
			folder_type = WMFolders.getType(aItemInfo),
			args = arguments,
			frm = gui._getChildObjects('main','frm_document_onlyoffice');

		args.has_access = WMFolders.getAccess(aItemInfo, folder_type === 'I' ? 'edit_document' : 'modify');

		for (var id in frm) {
			if ((aii = frm[id].aItemInfo) && ((aii.url && aii.url === aItemInfo.url) || (!aii.url && aii.aid === aItemInfo.aid && aii.fid === aItemInfo.fid && aii.iid === aItemInfo.iid && aii.attid === aItemInfo.attid))) {
				return frm[id]._focus && frm[id]._focus();
			}
		}

		if (sMode === 'view') {
			mode = 1;
		} else if (!aItemInfo.url){
			var data = dataSet.get('items', [aItemInfo.aid, aItemInfo.fid, aItemInfo.iid]) || {};
			if (data.EVNCOMPLETE > 50 * 1024 * 1024) {
				gui.notifier._value({type: 'alert', args: {text: 'ALERTS::TOO_LARGE_TO_EDIT'}});
				return Item.downloadFile([aItemInfo.aid, aItemInfo.fid, aItemInfo.iid]);
			}

			if(data.EVNLOCKOWN_EMAIL) {
				var document_editing_info = data.EVN_DOCUMENTEDITINGINFO && JSON.parse(data.EVN_DOCUMENTEDITINGINFO);
				if (document_editing_info) {
					if (document_editing_info.editor_ownid !== sPrimaryAccountGWID) {
						mode = document_editing_info.newparticipantsmode < 2;
					}
				} else {
					mode = ((data.EVNLOCKOWN_EMAIL === sPrimaryAccount) && args.has_access) ? 0 : 1;
				}
			}
		}

		Item.filesEdit(aItemInfo, mode, args, callback, aErrHandler);
	} catch(err){
		console.warn('officeOpen', err);
		aErrHandler && executeCallbackFunction(aErrHandler);
	}
};

Item.collaborate = function(aIds, callback) {
	var iid = Array.isArray(aIds[2]) ? aIds[2][0] : aIds[2];
	WMItems.list({
		aid: aIds[0],
		fid: aIds[1],
		iid: iid,
		values: ['evn_id', 'EVNDOCPASS_PLAIN']
	}, null, null, null, [function(aData){
		aData && gui._create('frm_collaboration', 'frm_collaboration', '', '', aData[aIds[0]][aIds[1]][iid] ||  aData[aIds[0]][aIds[1]][WMItems.__clientID(iid)], callback);
	}]);
};

Item.filesEdit = function(aItemInfo, mode, args, callback, aErrHandler) {
	TeamChatAPI.filesEdit(aItemInfo, mode, {
		success: function (response) {
			gui._create('doc', 'frm_document_onlyoffice')._open(aItemInfo, mode, args, response, callback);
		},
		error: function (e) {
			if(e.error_details.indexOf('e_') === 0) {
				e.error = e.error_details;
			}
			switch(e.error) {
				case 'e_document_invite_password':
					var frm = gui._create('password', 'frm_password', '', '', [function(password) {
						aItemInfo.password = password;
						Item.filesEdit(aItemInfo, mode, args, callback, aErrHandler);
					}], 'COLLABORATION::PASSWORD', '', getLang('COLLABORATION::PASSWORD_PLACEHOLDER'));
					return frm._size(300,145,true);
				case 'gw_error':
					gui.notifier._value({type: 'alert', args: {text: 'ERROR::' + e.error_details.toUpperCase()}});
					break;
				default:
					gui.notifier._value({type: 'alert', args: {text: 'ERROR::' + e.error.toUpperCase()}});
			}

			aErrHandler && executeCallbackFunction(aErrHandler);
		},
		context: this
	});
}

Item.officeWebdav = function(sPath,aErrHandler,sExtension){

	if (sPath === false || !Item.officeSupport(Path.basename(sPath.indexOf('?')>-1?sPath.substr(0,sPath.indexOf('?')):sPath))){
		if (aErrHandler)
			executeCallbackFunction(aErrHandler);

		return;
	}

	var a = null;

	//MSIE
	if ("ActiveXObject" in window) {

		//MS Office
		try {
			a = new ActiveXObject("SharePoint.OpenDocuments.3");
		} catch (r) {
			a = null;
			try {
				a = new ActiveXObject("SharePoint.OpenDocuments.2");
			} catch (r) {
				a = null;
				try {
					a = new ActiveXObject("SharePoint.OpenDocuments.1");
				} catch (r) {
					a = null;
				}
			}
		}

		//Open Office
		if (a == null){
			try{
				if ((a = new ActiveXObject("com.sun.star.ServiceManager")))
					if ((a = a.createInstance("com.sun.star.frame.Desktop")))
						return a.LoadComponentFromURL(sPath, "_blank", 0, []);
			}
			catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r)}

			a = null;
		}
	}
	else
	if (currentBrowser()!='Chrome' || currentBrowser(true)<42)
	//Safari & FFox NPAPI plugin
	{
		var sType = '', a = document.getElementById("SharePointPlugin") || null;
		if (a == null){
			if (IsBrowserPluginInstalled("application/x-sharepoint-webkit"))
				sType = "application/x-sharepoint-webkit";
			else
				sType = "application/x-sharepoint";

			try{
				a = mkElement("object",{
					'id':"SharePointPlugin",
					'type':sType,
					'width':0,
					'height':0,
					'style':{'visibility':"hidden"}
				});
				document.body.appendChild(a);
			}
			catch(r){
				a = null;
			}
		}
	}

	try {
		if (a.EditDocument)
			setTimeout(function(){
				if (!a.EditDocument(sPath) && aErrHandler)
					executeCallbackFunction(aErrHandler);
			},0);
		else
			throw true;
	}
	//Go Java go...
	catch (r) {

		//Use Java
		if ((!sExtension || currentBrowser()!='Chrome' || currentBrowser(true)<42) && navigator.javaEnabled()){

			//Open in OfficeLauncher
			if ((a = document.getElementById("OfficeLauncher"))){
				try{
					a.openDocument(sPath, 0, -1);
					Item.__officeFilePath = '';
					return true;
				}
				catch(err){

					if (!sExtension || currentBrowser()!='Chrome' || currentBrowser(true)<42){
						gui._create('confirm','frm_confirm','','',[function(){
							if (sPath){
								downloadItem(sPath,true);
								Item.__officeFilePath = '';
							}
						}],'OFFICELAUNCHER::OFFICELAUNCHER','OFFICELAUNCHER::OPENFAILED');
						return false;
					}

				}
			}
			//Init OfficeLauncher
			else{
				Item.__officeFilePath = sPath;

				var elm = mkElement('div',{'style':{'position':"absolute",'top':"-1000px;"}});
				elm.innerHTML = '<applet code="com.elementit.OfficeLauncher.OfficeLauncher" codebase="'+ document.getElementsByTagName('base')[0].href +'client/inc/officelauncher/" archive="OfficeLauncher.jar" width="0" height="0" name="OfficeLauncher" id="OfficeLauncher" mayscript="true">'+
			 		'<param name="separate_jvm" value="true">'+
			 		'<param name="permissions" value="all-permissions">'+
			 		'<param name="MSOffice.Types.Access" value="accda,accdb,accdc,accde,accdp,accdr,accdt,accdu,ade,adp,maf,mam,maq,mar,mat,mda,mdb,mde,mdt,mdw,laccdb,snp">'+
			 		'<param name="MSOffice.Types.Excel" value="csv,dbf,dif,ods,pdf,prn,slk,xla,xlam,xls,xlsb,xlsm,xlsx,xlt,xltm,xltx,xlw,xml,xml,xps">'+
			 		'<param name="MSOffice.Types.Outlook" value="obi,oft,ost,prf,pst,msg,oab,iaf">'+
			 		'<param name="MSOffice.Types.PowerPoint" value="emf,odp,pdf,pot,potm,potx,ppa,ppam,pps,ppsm,ppsx,ppt,pptm,pptx,pptx,rtf,thmx,tif,wmf,xml,xps">'+
			 		'<param name="MSOffice.Types.Word" value="doc,docm,docx,dot,dotm,dotx,htm,html,mht,mhtml,odt,pdf,rtf,txt,wps,xml,xml,xps">'+
			 		'<param name="MSOffice.Types.FrontPage" value="btr,dwt,elm,fwp,htx,mso">'+
			 		'<param name="progressbar" value="true">'+
			 		'<param name="boxmessage" value="Loading OfficeLauncher Applet...">'+
					'</applet>';

				document.body.appendChild(elm);
				return;
			}
		}

		if ( sExtension){
			var type = '';
			switch(sExtension) {
				// Open Word for editing
			case 'doc': case 'dot': case 'docx':
			case 'docm': case 'dotx': case 'dotm':
			case 'docb': case 'odt': case 'rtf':
				type = 'ms-word:ofe';
				break;
				// Open Excel for editing
			case 'xls': case 'csv': case 'xlsx':
			case 'xla': case 'xlam': case 'xlsb':
			case 'ods': case 'xlsb': case 'xlsm':
			case 'xlt': case 'xltm': case 'xltx':
				type = 'ms-excel:ofe';
				break;
				// Open PowerPoint for viewing
			case 'ppt': case 'pptx': case 'odp':
			case 'pps': case 'ppsm': case 'ppsx':
			case 'pptm': case 'ppa': case 'ppam':
				type = 'ms-powerpoint:ofv';
				break;
				// Open Access for editing
			case 'accda': case 'accdb': case 'accdc':
			case 'accde': case 'accdr': case 'accdt':
			case 'ade': case 'adp': case 'mda':
				type = 'ms-access:ofe';
				break;
			}
			if(type){
				downloadItem(type + '|u|' + sPath, true);
			}
		}
		else{

			//No Java
			gui._create('officelauncher_error','frm_no_java','','','','OFFICELAUNCHER::OFFICELAUNCHER','',getLang('OFFICELAUNCHER::NOLAUNCH'));

			if (sPath){
				downloadItem(sPath,true);
				Item.__officeFilePath = '';
			}
		}
	}
};

Item.getAliasFromPath = function(sPath){
	if (sPath){

		var aPath = Path.split(sPath);

		//Other Account
		if (aPath[0] != sPrimaryAccount)
			return aPath[0].toLowerCase();
		else
		//Shared Account
		if (aPath[1].indexOf(sPrimaryAccountSPREFIX) === 0)
			return aPath[1].substr(sPrimaryAccountSPREFIX.length).split('/').shift().toLowerCase();
	}
	else
		console.warn('Item.getAliasFromPath', sPath);
};

//OfficeLauncher global functions
/*
function onLauncherInited(a) {};

function onOfficePathDetected(a) {
	if (Item.__officeFilePath && a>0){
		Item.officeWebdav(Item.__officeFilePath);
		Item.__officeFilePath = '';
	}
};

function onOfficePathNotDetected() {
	gui.notifier._value({type: 'alert', args: {header: 'OFFICELAUNCHER::OFFICELAUNCHER', text: 'OFFICELAUNCHER::NOAPPFOUND'}});

	if (Item.__officeFilePath){
		downloadItem(Item.__officeFilePath,true);
		Item.__officeFilePath = '';
	}
};
*/
