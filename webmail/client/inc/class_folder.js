(function() {

	//PRIVATE
	function _deleteFolder (sAccountID,sFolderID){

		var aFolders = dataSet.get('folders',[sAccountID], true),
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

		if (bRefresh)
			gui.frm_main._selectView(_getNextFolder({aid:sAccountID, fid:sFolderID}, aFolders));

		if (bPerfm)
			dataSet.add('folders',[sAccountID],aFolders);

		WMFolders.remove({'aid':sAccountID,'fid':sFolderID},'folders');
	};

	function _getNextFolder (arg, aFolders){
		var sNextFolder,
			sType = WMFolders.getType(arg);

		switch(sType){
			case 'X':
				return;

			case 'I':
				//look for 1st Room, preferebly Private Room
				var aFolders = aFolders || dataSet.get('folders', [arg.aid]),
					fid, fidPrivate;

				for(var i in aFolders){
					if (i != arg.fid && aFolders[i].TYPE == 'I'){
						if (aFolders[i].OWNER == wm_folders.aux.private_owner){
							fidPrivate = i;
							break;
						}
						if (!fid)
							fid = i;
					} else if (aFolders[i].TYPE === 'Y') {
						fidRoot = i;
					}
				}

				sNextFolder = fidPrivate || fid || fidRoot;
				break;

			case 'M':
				sNextFolder = 'INBOX';
				break;

			default:
				sNextFolder = Mapping.getDefaultFolderForGWType(sType);
		}

		if (sNextFolder && WMFolders.getType({aid:sPrimaryAccount, fid: sNextFolder}))
			return {aid:sPrimaryAccount, fid: sNextFolder};
	};

	function _moveFolder (sAccount, sOldFolder, sNewFolder, bDeactivate){

		var	sActive = dataSet.get('active_folder');

		//Moving active folder or its parent?
		if (sActive == sAccount+'/'+sOldFolder || sActive.indexOf(sAccount+'/'+sOldFolder+'/') == 0){

			//Remove selection from main tree
			gui.frm_main.bar.tree.folders._invalidateActive();

			//Force redraw for "Move to trash" add moving parent
			if (bDeactivate || sActive != sAccount+'/'+sOldFolder)
				gui.frm_main._selectView(_getNextFolder({aid:sAccount,fid:sOldFolder}));
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
							Folder.openFolder(aData);
						}
						else
							gui.frm_main._selectView(_getNextFolder({aid:sAccount,fid:sOldFolder}));
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

	function _copyOrMoveAll(sDestAccount, sDestFolder, arg){
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

	// function _activateFolder (arg){
	// 	if (dataSet.get('active_folder') == arg.aid+'/'+arg.fid){
	// 		if (arg.name)
	// 			arg.fid = arg.name;

	// 		try{
	// 			gui.frm_main.bar.tree.folders._setActive(arg.aid+'/'+arg.fid);
	// 		}
	// 		catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r);}
	// 	}
	// };

	function _addSharedFolder (bOK, aAddresses){
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

			WMAccounts.subscribe(aAccountInfo,[_addSharedFolderResult]);
		}
	};
		function _addSharedFolderResult (aData){
			try{
				if (aData.IQ[0].ERROR)
					gui.notifier._value({type: 'alert', args: {header: '', text: 'ERROR::SUBSCRIBE_ERROR', args: [aData.IQ[0].ERROR[0].VALUE]}});
			}
			catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r);}
		};



	//PUBLIC
	function Folder(){}

	Folder.addAccount = function(){
		gui._create('add_account', 'frm_addaddress', '', '',[_addSharedFolder], ['ADDRESS_BOOK::SELECTED_ADDRESSES'],[''],'','',3);
	};

	Folder.setDefault = function(arg){
		WMFolders.add({'aid': arg.aid, 'fid': arg.fid, 'default': arg['default']}, 'folders','');
	};

	Folder.share = function(arg){
		gui._create('frm_sharing','frm_sharing','', ~['I', 'Y'].indexOf(WMFolders.getType(arg)) ? 'teamchat_folder' : '', void 0, {aid:arg.aid,fid:arg.fid});
	};

	Folder.synchronize = function(arg, bSync, cb){
		WMFolders.subscribe(arg,'folders','',bSync?1:0, cb);
	};

	Folder.unsubscribe = function(arg, cb){
		if (dataSet.get('folders', [arg.aid, arg.fid, 'SUBSCRIPTION_TYPE']) == 'folder'){
			WMAccounts.unsubscribe({aid:arg.aid,subscription:[arg.fid]}, [function(bOK){
				executeCallbackFunction(cb,bOK);
			}]);
		}
	};

	Folder.addVirtual = function(arg, cb){
		gui._create('frm_virtual','frm_virtual','','',arg.fid,'', cb);
	};

	Folder.addFolder = function(arg, cb){
		var sType = WMFolders.getType(arg);
		if (sType == 'I' || sType == 'Y')
			gui._create('frm_addroom','frm_addroom','','',arg.aid,(sType == 'I'?Path.basedir(arg.fid):arg.fid), cb, true);
		else
			gui._create('frm_add_folder','frm_add_folder','','',arg.aid,arg.fid,cb);
	};

	Folder.clone = function(arg, cb){
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
					//_activateFolder(aData);
					Folder.openFolder(aData);

					if (cb)
						executeCallbackFunction(cb, aData);
				}
			}]);
		}
	};

	Folder.delete = function(arg){
		var ftype = WMFolders.getType(arg);

		if (ftype!='X' && WMFolders.getRights(arg,'remove')){
			var frm = null;
			//Shared Account
			if (ftype == 'VA')
				frm = gui._create('frm_confirm','frm_confirm','','',[_deleteFolder, [arg.aid, arg.fid]],'CONFIRMATION::DELETE_ACCOUNT_CONFIRMATION','CONFIRMATION::DELETE_ACCOUNT',[Path.basename(arg['fid']).substr(sPrimaryAccountSPREFIX.length)]);
			//Folder
			else{

				// Delete search folders directly
				if (arg.fid.indexOf('__@@VIRTUAL@@__')===0)
					_deleteFolder(arg.aid, arg.fid);
				else {
					// Move other folders to trash
					var sTrashFolder = Path.split(GWOthers.getItem('DEFAULT_FOLDERS','trash'))[1],
						owner = dataSet.get('folders',[arg.aid, arg.fid,'OWNER']);

					//Move Folder to Trash (SUBSCRIPTION_TYPE filters Shared and Public)
					if (sPrimaryAccount == arg.aid && (ftype == 'M' || (ftype == 'E' && sPrimaryAccountGWTRASH != 'true')) && sTrashFolder && (!owner || owner == sPrimaryAccount) && !dataSet.get('folders',[arg.aid,arg.fid,'SUBSCRIPTION_TYPE']) && arg.fid.indexOf(sTrashFolder+'/')<0 && parseInt(GWOthers.getItem('MAIL_SETTINGS_GENERAL','move_to_trash'))>0 && WMFolders.getRights(arg,'modify')) {
						var org = dataSet.get('folders', [arg.aid, arg.fid]),
							sTargetPathOriginal =  sTrashFolder +'/'+ (org.NAME || (org.RELATIVE_PATH && Path.basename(org.RELATIVE_PATH)) || arg.fid.split('/').pop()),
							sTargetPath = sTargetPathOriginal,
							inc = 0;

						//check target duplicity
						while(dataSet.get('folders',[sPrimaryAccount, sTargetPath])){
							sTargetPath = sTargetPathOriginal + ' ' + (++inc);
						}

						_moveFolder(sPrimaryAccount, arg.fid, sTargetPath, true);
					}
					//Remove Folder
					else
						frm = gui._create('frm_confirm','frm_confirm','','',[_deleteFolder, [arg.aid, arg.fid]],'CONFIRMATION::DELETE_FOLDER_CONFIRMATION','CONFIRMATION::DELETE_FOLDER',[dataSet.get('folders',[arg.aid,arg.fid,'NAME']) || Path.basename(arg['fid'])]);
				}
			}

			if (frm && frm.x_btn_ok)
				addcss(frm.x_btn_ok._main,'color2');
		}
		else
			gui.notifier._value({type: 'alert', args: {header: '', text: 'CONTEXT_FOLDER::CANTDELETE'}});
	};

	Folder.move = function(arg){
		var ftype = WMFolders.getType(arg);

		if (ftype!='X' && WMFolders.getRights(arg,'modify')){
			var frm = gui._create('frm_select_folder','frm_select_folder','','','POPUP_FOLDERS::MOVE_FOLDER',arg['aid'],arg['fid'],[function (aid, fid, f){
					_moveFolder(aid, f, (fid?fid + '/':'') + Path.basename(f));
				},[arg['fid']]],false,true);

			//Make all node types selectable
			frm.tree_folder._isSelectable = function(idt){
				return idt.ftype != "X" || !!idt['public'];
			};
		}
		else
			gui.notifier._value({type: 'alert', args: {header: '', text: 'CONTEXT_FOLDER::CANTMOVE'}});
	};

	Folder.rename = function(arg){
		__moveFolder(arg);
	};

	Folder.save = function(arg){
		WMFolders.save_folder(arg);
	};

	Folder.empty = function(arg){
		var sFullPath = arg['aid'] + '/' + arg['fid'],
			sTrashFolder = GWOthers.getItem('DEFAULT_FOLDERS', 'trash'),
			sFolderType = WMFolders.getType(arg),
			frm;

		if (sFullPath == sTrashFolder || sFolderType == 'R' || sFolderType == 'G' || parseInt(GWOthers.getItem('MAIL_SETTINGS_GENERAL', 'delete_emptyfolder'))>0)
			frm = gui._create('frm_confirm', 'frm_confirm', '', '',[function() {
				WMFolders.__emptyFolder(arg['aid'], arg['fid']);
			}],
				'CONFIRMATION::EMPTY_FOLDER_CONFIRMATION', 'CONFIRMATION::EMPTY_FOLDER'
			);
		else
			frm = gui._create('frm_confirm', 'frm_confirm', '', '',[function() {
				WMFolders.__emptyFolder(arg['aid'], arg['fid'], true);
			}],
				'CONFIRMATION::EMPTY_FOLDER_CONFIRMATION', 'CONFIRMATION::EMPTY_TO_TRASH'
			);

		addcss(frm.x_btn_ok._main,'color2');
	};

	Folder.markRead = function(arg){
		if (gui.frm_main.main && gui.frm_main.main.list && gui.frm_main.main.list._SQLsearch) {
			OldMessage.markWithFlag([arg.aid, arg.fid, Object.getOwnPropertyNames(gui.frm_main.main.list._aData)],{'SEEN': true},true);
		} else {
			WMFolders.markItemsRead({'aid':arg.aid,'fid':arg.fid},'folders','',true);
		}
	};

	Folder.markUnread = function(arg){
		if (gui.frm_main.main && gui.frm_main.main.list && gui.frm_main.main.list._SQLsearch) {
			OldMessage.markWithFlag([arg.aid, arg.fid, Object.getOwnPropertyNames(gui.frm_main.main.list._aData)],{'SEEN': false},true);
		} else {
			WMFolders.markItemsRead({'aid':arg.aid,'fid':arg.fid},'folders','',false);
		}
	};

	Folder.copyAll = function(arg){
		gui._create('frm_select_folder', 'frm_select_folder', '', '', 'POPUP_ITEMS::COPY_MAIL_TO', arg['aid'],arg['fid'],
		[_copyOrMoveAll, [arg]], false, false, dataSet.get("folders", [arg['aid'],arg['fid'], 'TYPE']),'w');
	};
	Folder.moveAll = function(arg){
		gui._create('frm_select_folder', 'frm_select_folder', '', '', 'POPUP_ITEMS::MOVE_MAIL_TO', arg['aid'],arg['fid'],
		[_copyOrMoveAll, [arg]], false, false, dataSet.get("folders", [arg['aid'],arg['fid'], 'TYPE']),'w');
	};

	Folder.changeChannel = function(arg){
		gui._create('frm_change_channel','frm_change_channel','','',arg.aid,arg.fid);
	};

	Folder.getActiveCalendar = function(){
		var f = dataSet.get('folders',[sPrimaryAccount, '__@@VIRTUAL@@__/__@@EVENTS@@__', 'VIRTUAL', 'FOLDERS']) || {};
		for(var id in f){
			if (f[id])
				return id;
		}
	};

	//ui aux
	Folder.openFolder = function (arg){
		if (arg.name)
			arg.fid = arg.name;

		try{
			var p;
			if ((p = arg.fid.lastIndexOf('/'))>-1)
				gui.frm_main.bar.tree.folders._open(arg.aid +'/'+ arg.fid.substr(0,p),'minus');
			else
				gui.frm_main.bar.tree.folders._open(arg.aid,'minus');
		}
		catch(r){gui._REQUEST_VARS.debug && console.log('Folder',r)};
	};

	Folder.lastId = function(arg, value){
		var id = 0;
		if (arg && arg.aid && arg.fid){

			if (!value){
				id = dataSet.get('last_item', [arg.aid, arg.fid, 'id']);
				if (!id){
					value = id = dataSet.get('folders', [arg.aid, arg.fid, 'GROUPCHAT_LASTREADID']);
				}
			}

			if (value){
				id = value;
				dataSet.add('last_item', [arg.aid, arg.fid, 'id'], id);
			}
		}

		return id || 0;
	};

	window.Folder = Folder;

})();
