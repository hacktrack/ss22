_me = obj_context_folder.prototype;
function obj_context_folder(){};

_me._onclick = function(e,elm,id,arg){
	var me = this;

	if (!arg) return true;

	var ftype = dataSet.get('folders',[arg.aid,arg.fid,'TYPE']);

	switch(arg['method'])
	{
		case 'upload':
			gui._create('insert_item', 'frm_insert_item', '', 'frm_insert_item_nobottomdiv', [gui.frm_main, '__copyItem', [[arg.aid, arg.fid]]], arg.aid, arg.fid, '', 'r', false, ['F', 'I', 'X'], 'X');
			break;
        case 'tree_mode':
			Cookie.set(['hide_tree'], arg.v || '');
			gui.frm_main._resize_handler();
        	break;

        case 'view':
            //activate tree node
			gui.frm_main.bar.tree.folders._setActive(arg.aid+'/'+arg.fid,true);
            //change view
			gui.frm_main._selectView({'aid': arg.aid, 'fid': arg.fid},'',false,'',arg.search?true:false,arg.search);
			break;

		//DEFAULT Folder
		case 'default':
			WMFolders.add({'aid': arg.aid, 'fid': arg.fid, 'default': arg['default']}, 'folders','');
		    break;

		case 'filter':
			addcss(this._owner._main,'obj_tree_search');
			this._owner.inp_search._focus();
			break;

		//SHARING
		case 'share':
			gui._create('frm_sharing','frm_sharing','', ~['I', 'Y'].indexOf(WMFolders.getType(arg)) ? 'teamchat_folder' : '',void 0, {aid:arg.aid,fid:arg.fid});
			break;

		case 'add_favorite':
		 	if (gui.frm_main.bar && gui.frm_main.bar.fav)
		 		gui.frm_main.bar.fav._ondrop({value:[{aid:arg.aid, fid:arg.fid}], type:'folder'});
			 break;

		case 'new_template':
			NewMessage.compose({template:true});
			break;

		//SYNC
		case 'subscribe':
		case 'unsubscribe':
			//Teamchat folder
			if (gui.frm_main.bar && gui.frm_main.bar.top && gui.frm_main.bar.top.switch){
				if (this._owner._getTreeId){
					elm = document.getElementById(this._owner._getElmId(this._owner._getTreeId(arg.aid + '/' + arg.fid)));
					gui.frm_main.bar.top.switch.__unsubscribeRoom(elm, arg, [function(){
						WMFolders.subscribe(arg, 'folders', '', arg['method'] == 'subscribe' ? 1 : 0);
					}]);
				}
				else{
					WMFolders.subscribe(arg, 'folders', '', arg['method'] == 'subscribe' ? 1 : 0, [function(){
						gui.frm_main.bar.top.switch.__unsubscribeRoom(null, arg);
					}]);
				}
			}
			//Mail folder
			else
				WMFolders.subscribe(arg, 'folders', '', arg['method'] == 'subscribe' ? 1 : 0);

			break;

		//ACCOUNTS
		case 'add_account':
			gui._create('add_account', 'frm_addaddress', '', '',[this, '__addSharedFolder'], ['ADDRESS_BOOK::SELECTED_ADDRESSES'],[''],'','',3);
			break;

		//FOLDERS
		case 'unsubscribe_folder':
			var sSType = dataSet.get('folders', [arg.aid, arg.fid, 'SUBSCRIPTION_TYPE']);

			if (sSType == 'folder')
				WMAccounts.unsubscribe({aid:arg.aid,subscription:[arg.fid]}, [function(bOK){
					if (bOK){
						if (dataSet.get('active_folder') == arg.aid+'/'+arg.fid)
							gui.frm_main._selectView();
					}
				}]);

			break;

		case 'cal_color':
			if (arg.fid && arg.color){
				getCalendarColor(arg.fid.str_replace('\\','/'), arg.color);

				//refres tree
				me._owner.__update('folders');

				//refresh ALL
				gui.frm_main._selectView({aid:sPrimaryAccount,fid:'__@@VIRTUAL@@__/__@@EVENTS@@__'},'',true);
			}
			break;

		case 'add_virtual':
			gui._create('frm_virtual','frm_virtual','','',arg.fid,'',[obj_context_folder.__openFolder]);
			break;

		case 'add_folder':
			Folder.addFolder(arg, [obj_context_folder.__openFolder]);
			break;

		case 'add_room':
			gui._create('frm_addroom','frm_addroom','','',arg.aid,arg.fid, [obj_context_folder.__openFolder]);
			break;

		case 'clone':

			var org = dataSet.get('folders', [arg.aid, arg.fid]);
			if (org.TYPE == 'I' && (org.NAME || org.RELATIVE_PATH)){

				var sFolderName = [org.NAME || Path.basename(org.RELATIVE_PATH), getLang('CHAT::CLONE')].join(' '),
					aData = {
						'type':org.TYPE,
						'aid':sPrimaryAccount,
						'clone':arg.aid +'/'+ arg.fid
					};

				//PRIVATE
				if (org.OWNER && ~org.OWNER.indexOf('##internalservicedomain.icewarp.com##')){
					aData.name = org.OWNER + '/TeamChat/' + sFolderName;
					aData.private = true;
				}
				else
					aData.name = Path.basedir(arg.fid) + '/' + sFolderName;

				WMFolders.add(aData,'folders','', [function(aFolderInfo){
					if (aFolderInfo){
						var aData = {
							aid:aFolderInfo.aid,
							fid:aFolderInfo.name
						};

						gui.frm_main._selectView(aData);
						obj_context_folder.__openFolder(aData);
					}
				}]);
			}

			break;

		case 'delete_folder':
			Folder.delete(arg);
			break;

		case 'sendEmailToAllMembers':
			if (!arg.aid || !arg.fid){
				return;
			}
			var newMessage = new NewMessage();
			newMessage.addSignature();
			var name = dataSet.get('folders', [arg.aid, arg.fid, 'NAME']) || dataSet.get('folders', [arg.aid, arg.fid, 'RELATIVE_PATH']);
			newMessage.sTo = '[' + arg.fid + '::' + name + ']';

			newMessage.sSubject = '';

			gui._create('frm_compose', 'frm_compose', '', '', newMessage);
			break;

		case 'move_folder':
			if (ftype!='X' && WMFolders.getRights(arg,'modify')){
				var frm = gui._create('frm_select_folder','frm_select_folder','','','POPUP_FOLDERS::MOVE_FOLDER',arg['aid'],arg['fid'],[function (aid, fid, f){
						obj_context_folder.__moveFolder(aid, f, (fid?fid + '/':'') + Path.basename(f));
					},[arg['fid']]],false,true);

				//Make all node types selectable
				frm.tree_folder._isSelectable = function(idt){
					return idt.ftype != "X" || !!idt['public'];
				};
			}
			else
				gui.notifier._value({type: 'alert', args: {header: '', text: 'CONTEXT_FOLDER::CANTMOVE'}});
			break;

		case 'save_folder':
			WMFolders.save_folder(arg);
			break;

		case 'empty_folder':
			var sFullPath = arg['aid'] + '/' + arg['fid'],
				sTrashFolder = GWOthers.getItem('DEFAULT_FOLDERS', 'trash'),
				sFolderType = WMFolders.getType(arg),
				frm;

			if (sFullPath == sTrashFolder || sFolderType == 'R' || sFolderType == 'G' || parseInt(GWOthers.getItem('MAIL_SETTINGS_GENERAL', 'delete_emptyfolder'))>0)
				frm = gui._create('frm_confirm', 'frm_confirm', '', '',[function() {
					WMFolders.__emptyFolder(arg['aid'], arg['fid'], false, gui.frm_main.main.list._SQLsearch);
				}],
					'CONFIRMATION::EMPTY_FOLDER_CONFIRMATION', 'CONFIRMATION::EMPTY_FOLDER'
				);
			else
				frm = gui._create('frm_confirm', 'frm_confirm', '', '',[function() {
					WMFolders.__emptyFolder(arg['aid'], arg['fid'], true, gui.frm_main.main.list._SQLsearch);
				}],
					'CONFIRMATION::EMPTY_FOLDER_CONFIRMATION', 'CONFIRMATION::EMPTY_TO_TRASH'
				);

			addcss(frm.x_btn_ok._main,'color2');
			break;

		case 'mark_all_as_read':
		case 'mark_all_as_unread':
			var bRead = arg['method'] == 'mark_all_as_read' ? true : false;

			if (gui.frm_main.main && gui.frm_main.main.list && gui.frm_main.main.list._SQLsearch) {
				OldMessage.markWithFlag([arg.aid, arg.fid, Object.getOwnPropertyNames(gui.frm_main.main.list._aData)],{'SEEN': bRead},true);
			} else {
				WMFolders.markItemsRead({'aid':arg.aid,'fid':arg.fid},'folders','',bRead);
			}
			break;

		case 'copyall':
		case 'moveall':
			gui._create('frm_select_folder', 'frm_select_folder', '', '', 'POPUP_ITEMS::' + (arg['method']=='copyall'?'COPY_MAIL_TO':'MOVE_MAIL_TO'), arg['aid'],arg['fid'],
				[this,'__copyOrMoveAll', [arg]], false, false, dataSet.get("folders", [arg['aid'],arg['fid'], 'TYPE']),'w');
			break;

		case 'change_channel':
			gui._create('frm_change_channel','frm_change_channel','','',arg.aid,arg.fid);
			break;

		case 'rename_folder':
			if ((ftype!='X' && WMFolders.getRights(arg,'modify')) || (ftype == 'I' && WMFolders.getRights(arg,'write')) && this._owner._rename)
				this._owner._rename(arg);
			else
				gui.notifier._value({type: 'alert', args: {header: '', text: 'CONTEXT_FOLDER::CANTRENAME'}});

		break;
		default:
			return true;
	}
};

_me.__copyOrMoveAll = function(sDestAccount, sDestFolder, arg){
	if (gui.frm_main.main && gui.frm_main.main.list && gui.frm_main.main.list._SQLsearch) {
		var ids = [
			arg.aid,
			arg.fid,
			Object.getOwnPropertyNames(gui.frm_main.main.list._aData)
		],
		sAction = 'moveall' === arg.method ? 'move' : 'copy';

		Item.__copyOrMoveItems(sDestAccount, sDestFolder, sAction, ids);
	} else {
		if (sDestAccount != arg.aid || sDestFolder != arg.fid)
			WMFolders.action(arg,'folders','',arg.method,{aid:sDestAccount,fid:sDestFolder});
	}
};

_me.__addSharedFolder = function(bOK, aAddresses){
	if (bOK && aAddresses[0].length){

		var tmp, aAccountInfo = {aid:sPrimaryAccount,subscription:[]};
		for(var i = 0; i<aAddresses[0].length; i++){
			tmp = MailAddress.splitEmailsAndNames(aAddresses[0][i]);
			if (tmp && tmp[0] && tmp[0].email){
				if (tmp[0].email.indexOf('@')<0)
				    tmp[0].email+= '@'+dataSet.get('main',['domain']);

				aAccountInfo.subscription.push(tmp[0].email);
			}
		}

		WMAccounts.subscribe(aAccountInfo,[this,'__addSharedFolderResult']);
	}
};
_me.__addSharedFolderResult = function(aData){
	try{
		if (aData.IQ[0].ERROR)
			gui.notifier._value({type: 'alert', args: {header: '', text: 'ERROR::SUBSCRIBE_ERROR', args: [aData.IQ[0].ERROR[0].VALUE]}});
	}
	catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r);}
};

//static method
obj_context_folder.__deleteFolder = function(sAccountID,sFolderID){

	var aFolders = dataSet.get('folders',[sAccountID]),
		bPerfm = false,
		bRefresh = false,
		sActive = dataSet.get('active_folder');

	for(var i in aFolders)
		if (i == sFolderID || i.indexOf(sFolderID+'/') === 0){
			bPerfm = true;
			if (sActive && !bRefresh && (sActive == sAccountID+'/'+i || sActive.indexOf(sAccountID+'/'+i+'/') == 0))
				bRefresh = true;

			delete aFolders[i];
		}

	//	bNoRefresh = true protoze pracujeme primo s datasetem, proto po add neni zmena dat (add je jen pro sychr)
    //	Notne vyvolat refresh manualne
	if (bPerfm){
		dataSet.add('folders',[sAccountID],aFolders,true);
		dataSet.update('folders',[sAccountID]);
	}

	if (bRefresh)
		gui.frm_main._selectView();

	WMFolders.remove({'aid':sAccountID,'fid':sFolderID},'folders');
};

obj_context_folder.__moveFolder = function(sAccount, sOldFolder, sNewFolder, bDeactivate){
	//var sNewFolder = (sNewFolder?sNewFolder + '/':'') + Path.basename(sOldFolder),
	var	sActive = dataSet.get('active_folder');

	//Moving active folder or its parent?
	if (sActive == sAccount+'/'+sOldFolder || sActive.indexOf(sAccount+'/'+sOldFolder+'/') == 0){

		//Remove selection from main tree
		gui.frm_main.bar.tree.folders._invalidateActive();

		//Force redraw for "Move to trash" add moving parent
		if (bDeactivate || sActive != sAccount+'/'+sOldFolder)
			gui.frm_main._selectView();
		else{

			WMFolders.add({'aid':sAccount,'fid':sOldFolder,'name':sNewFolder},'folders','',
				//Success
				[function(aData){
					if(gui.frm_main && gui.frm_main.bar && gui.frm_main.bar.tree && gui.frm_main.bar.tree.folders && gui.frm_main.bar.tree.folders.recent) {
						gui.frm_main.bar.tree.folders.recent.recent = [];
						gui.frm_main.bar.tree.folders.recent.__search('');
					}
					if (aData.aid && aData.name){
						aData = {aid:aData.aid, fid:aData.fid};

						gui.frm_main._selectView(aData);
						//obj_context_folder.__activateFolder(aData);
						obj_context_folder.__openFolder(aData);
					}
					else
						gui.frm_main._selectView();
				}]
			);

			return;
		}
	}

	WMFolders.add({'aid':sAccount,'fid':sOldFolder,'name':sNewFolder},'folders','',
		[
			function() {
				if(gui.frm_main && gui.frm_main.bar && gui.frm_main.bar.tree && gui.frm_main.bar.tree.folders && gui.frm_main.bar.tree.folders.recent) {
					gui.frm_main.bar.tree.folders.recent.recent = [];
					gui.frm_main.bar.tree.folders.recent.__search('');
				}
			}
		]
	);
};

// obj_context_folder.__activateFolder = function (aFolderInfo){
//     if (dataSet.get('active_folder') == aFolderInfo.aid+'/'+aFolderInfo.fid){
// 		if (aFolderInfo.name)
// 			aFolderInfo.fid = aFolderInfo.name;

// 		try{
// 			gui.frm_main.bar.tree.folders._setActive(aFolderInfo.aid+'/'+aFolderInfo.fid);
// 		}
// 		catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r);}
// 	}
// };

obj_context_folder.__openFolder = function (aFolderInfo){
	if (aFolderInfo.name)
		aFolderInfo.fid = aFolderInfo.name;

	try{
		var p;
		if ((p = aFolderInfo.fid.lastIndexOf('/'))>-1)
			gui.frm_main.bar.tree.folders._open(aFolderInfo.aid +'/'+ aFolderInfo.fid.substr(0,p),'minus');
		else
			gui.frm_main.bar.tree.folders._open(aFolderInfo.aid,'minus');
	}
	catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r);}
};
