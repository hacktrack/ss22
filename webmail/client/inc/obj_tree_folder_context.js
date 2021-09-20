_me = obj_tree_folder_context.prototype;
function obj_tree_folder_context(){};

_me.__constructor = function(){
	//this._autofocus = false;
	this._listen_cookie('tree');

	if (sPrimaryAccountGUEST)
		addcss(this._main,'guest');
};
obj_tree_folder_context.__createFolderMenu = function(arg, bMoreMenu){
	var aMenu = [];
	if (arg){
		if (arg['fid']){

			var sFolType = WMFolders.getType(arg);

			if (sFolType == 'Y'){

				var aRights = WMFolders.getRights(arg),
					folder_write = ~(dataSet.get('folders', [arg.aid, arg.fid, 'RIGHTS']) || '').indexOf('k'),
					bPrivate = dataSet.get('folders',[arg.aid, Path.basedir(arg.fid),'PRIVATE_ROOT']) === "true";

				aMenu.push(
					{'title':'POPUP_FOLDERS::ADD_ROOM','arg':{'aid':arg['aid'],'fid':arg['fid'],'method':'add_room'}, css:'ico2 add_folder', 'disabled':!(folder_write || bPrivate)}
				);

				if (!bPrivate && aRights.owner)
					aMenu.push(
						{'title':'POPUP_FOLDERS::MEMBERS','arg':{'aid':arg['aid'],'fid':arg['fid'],'method':'share'}, css:'color1 ico2 members'}
					);

				if (~(dataSet.get('folders', [arg.aid, Path.basedir(arg.fid), 'RIGHTS']) || '').indexOf('a'))
					aMenu.push(
						{title: '-'},
						{anchor: 'storage'}
					);
			}
			else
			if (sFolType == 'I'){
				var aRights = WMFolders.getRights(arg);

				aMenu.push(
					{'title':'POPUP_FOLDERS::RENAME_ROOM','arg':{'aid':arg['aid'],'fid':arg['fid'],'ftype':arg['ftype'],'method':'rename_folder'}, css:'ico2 edit_folder', 'disabled':!aRights.edit_folder},
					{'title':'FORM_BUTTONS::UNSUBSCRIBE', css:'ico2 archive_folder','arg':{'aid':arg['aid'],'fid':arg['fid'],'ftype':arg['ftype'], method:'unsubscribe'
					// function(folder_info){
					// 	//'method':'unsubscribe',
					// 	var elm = document.getElementById(gui.frm_main.bar.tree.folders._getElmId(arg.aid+'/'+arg.fid));
					// 	if (elm)
					// 		gui.frm_main.bar.top.switch.__unsubscribeRoom(elm, arg, folder_info);
					// }.bind(this, arg)
					}}
				);

				aRights.owner && aMenu.push({'title':'POPUP_FOLDERS::MEMBERS','arg':{'aid':arg['aid'],'fid':arg['fid'],'method':'share'}, css:'color1 ico2 members'});

				!sPrimaryAccountGUEST && aMenu.push(
					{'title':'POPUP_FOLDERS::CLONE_ROOM','arg':{'aid':arg['aid'],'fid':arg['fid'],'method':'clone'}, css:'ico2 clone_room', 'disabled':!WMFolders.getRights([arg.aid, Path.basedir(arg.fid)]).write},
					{'title':'IM::SEND_MAIL_TO_ALL','arg':{'aid':arg['aid'],'fid':arg['fid'],'method':'sendEmailToAllMembers'}, css:'ico2 from_template'}
				);

				aMenu.push(
					{'title': '-'},
					{'title':'POPUP_FOLDERS::DELETE_ROOM','arg':{'aid':arg['aid'],'fid':arg['fid'],'method':'delete_folder'}, css:'ico2 color2 delete_folder','disabled':!aRights.remove}
				);
			}
			else
			if (sFolType == 'G'){
				if (!dataSet.get('main',['keep_deleted_items_force_expiration'])) {
					aMenu.push({'title':'MAIN_MENU::EMPTY_FOLDER','arg':{'aid':arg['aid'],'fid':arg['fid'],'method':'empty_folder', css:'ico2 color2 empty_folder'}});
				}
			}
			else
			{
				var bVirtual = arg['fid'].indexOf('__@@VIRTUAL@@__/') == 0,
					bArchive = dataSet.get('folders',[arg['aid'],arg['fid'].split('/')[0],'ARCHIVE'])?true:false,
					//get folder access rights
					aRights = WMFolders.getRights(arg),
					aAccess = WMFolders.getAccess(arg);

				if (sFolType == 'M') {
					var title;

					if (gui.frm_main.main && gui.frm_main.main.list && gui.frm_main.main.list._SQLsearch) {
						title = 'POPUP_FOLDERS::ITEM_ACTIONS_FILTERED';
					} else {
						title = 'POPUP_FOLDERS::ITEM_ACTIONS';
					}
					// Manage content items
					aMenu.push(
						{'title':title,css:'ico2 manage',nodes:[
							{'title':'POPUP_FOLDERS::MARK_ALL_AS_READ','arg':{'aid':arg['aid'],'fid':arg['fid'],'method':'mark_all_as_read'}, css:'ico2 markread', 'disabled':!aAccess.modify},
							{'title':'-'},
							{'title':'POPUP_ITEMS::COPY_MAIL_TO','arg':{'aid':arg['aid'],'fid':arg['fid'],'method':'copyall'}, css:'ico2 copy', 'disabled':bVirtual},
							{'title':'POPUP_ITEMS::MOVE_MAIL_TO','arg':{'aid':arg['aid'],'fid':arg['fid'],'method':'moveall'}, css:'ico2 move', 'disabled':!aAccess.remove || bVirtual},
							{'title':'-'},
							{'title':'MAIN_MENU::EMPTY_FOLDER','arg':{'aid':arg['aid'],'fid':arg['fid'],'method':'empty_folder'}, 'disabled':!aAccess.remove, 'css':'ico2 color2 empty_folder'}
						]},
						{'title':'-'}
					);

					if(bMoreMenu)
						aMenu.push({title: 'MAIN_MENU::NEW_MESSAGE', css: 'ico2 new_template', arg: {method: 'new_template'}});
				}

				if (sFolType == 'VA'){
					if (dataSet.get('folders',[arg['aid'],arg['fid'],'SUBSCRIPTION_TYPE']) == 'account')
						aMenu.push(
							{'title':'POPUP_FOLDERS::ADD_FOLDER','arg':{'aid':arg['aid'],'fid':arg['fid'],'method':'add_folder'}, css:'ico2 add_folder', 'disabled':!aRights.write},
							{'title':'POPUP_FOLDERS::SHARING','arg':{'aid':arg['aid'],'fid':arg['fid'],'method':'share'}, css:'ico2 color1 share_folder', 'disabled':!aRights.owner},
							{'title':'-'},
							{'title':'POPUP_FOLDERS::REMOVE_ACCOUNT','arg':{'aid':arg['aid'],'fid':arg['fid'],'method':'delete_folder'}, css:'ico2 color2 delete_folder', 'disabled':!aRights.remove}
						);
				}
				else
				if (sFolType == 'X' && arg['fid']=='__@@VIRTUAL@@__'){
					if (GWOthers.getItem('RESTRICTIONS','disable_virtual') != '1')
						aMenu.push(	{'title':'POPUP_FOLDERS::ADD_VIRTUAL', css:'ico2 add_vfolder', 'arg':{'method':'add_virtual'}});
				}
				else
				if (sFolType != 'Q' && sFolType != 'QL'){

					if (sFolType == 'E' && dataSet.get('active_folder') == sPrimaryAccount+'/__@@VIRTUAL@@__/__@@EVENTS@@__'){
						aMenu.push(
							{'title':'POPUP_FOLDERS::COLOR', nodes:
								[
									{'title':'COLORS::BLUE','arg':{'fid':arg['fid'], color:'blue', 'method':'cal_color'}, css:'ico2 color blue'},
									{'title':'COLORS::GREEN','arg':{'fid':arg['fid'], color:'green', 'method':'cal_color'}, css:'ico2 color green'},
									{'title':'COLORS::BROWN','arg':{'fid':arg['fid'], color:'brown', 'method':'cal_color'}, css:'ico2 color brown'},
									{'title':'COLORS::PURPLE','arg':{'fid':arg['fid'], color:'purple', 'method':'cal_color'}, css:'ico2 color purple'},
									{'title':'COLORS::YELLOW','arg':{'fid':arg['fid'], color:'yellow', 'method':'cal_color'}, css:'ico2 color yellow'},
									{'title':'COLORS::TEAL','arg':{'fid':arg['fid'], color:'teal', 'method':'cal_color'}, css:'ico2 color teal'},
									{'title':'COLORS::PLUM','arg':{'fid':arg['fid'], color:'plum', 'method':'cal_color'}, css:'ico2 color plum'},
									{'title':'COLORS::RED','arg':{'fid':arg['fid'], color:'red', 'method':'cal_color'}, css:'ico2 color red'},

									{'title':'COLORS::AQUA','arg':{'fid':arg['fid'], color:'aqua', 'method':'cal_color'}, css:'ico2 color aqua'},
									{'title':'COLORS::AQUAMARINE','arg':{'fid':arg['fid'], color:'aquamarine', 'method':'cal_color'}, css:'ico2 color aquamarine'},
									{'title':'COLORS::ORCHID','arg':{'fid':arg['fid'], color:'orchid', 'method':'cal_color'}, css:'ico2 color orchid'},
									{'title':'COLORS::PINK','arg':{'fid':arg['fid'], color:'pink', 'method':'cal_color'}, css:'ico2 color pink'},
									{'title':'COLORS::SILVER','arg':{'fid':arg['fid'], color:'silver', 'method':'cal_color'}, css:'ico2 color silver'},
									{'title':'COLORS::WHITE','arg':{'fid':arg['fid'], color:'white', 'method':'cal_color'}, css:'ico2 color white'},
									{'title':'COLORS::GRAY','arg':{'fid':arg['fid'], color:'gray', 'method':'cal_color'}, css:'ico2 color gray'},
									{'title':'COLORS::LEMON','arg':{'fid':arg['fid'], color:'lemon', 'method':'cal_color'}, css:'ico2 color lemon'}
								],
								css: 'ico2 color '+ getCalendarColor(arg['fid'])
							},
							{'title':'-'}
						);
					}


					if (bVirtual)
						aMenu.push(	{'title':'POPUP_FOLDERS::EDIT_VIRTUAL', css:'ico2 add_vfolder', 'arg':{'fid':arg['fid'], 'method':'add_virtual'}});
					else{
						aMenu.push(	{'title':'POPUP_FOLDERS::ADD_FOLDER','arg':{'aid':arg['aid'],'fid':arg['fid'],'method':'add_folder'}, css:'ico2 add_folder', 'disabled':!aRights.write});

						if (arg['aid']==sPrimaryAccount && GWOthers.getItem('RESTRICTIONS','disable_virtual') != '1' && sFolType!='X'){
							aMenu[aMenu.length-1].nodes = [
								{'title':'POPUP_FOLDERS::ADD_FOLDER','arg':{'aid':arg['aid'],'fid':arg['fid'],'method':'add_folder'}, css:'ico2 add_folder'},
								{'title':'POPUP_FOLDERS::ADD_VIRTUAL','arg':{'fid':arg['fid'], 'method':'add_virtual'}, css:'ico2 add_vfolder'}
							];
						}
					}

					if(sFolType === 'F') {
						aMenu.push({'title':'ATTACHMENT::UPLOAD','arg':{'aid':arg['aid'],'fid':arg['fid'],'ftype':arg['ftype'],'method':'upload'}, css:'ico2 upload', 'disabled': !aRights.write});
					}

					var rename_title = 'POPUP_FOLDERS::RENAME_FOLDER';
					if(sFolType === 'E') {
						rename_title = 'POPUP_FOLDERS::RENAME_CALENDAR';
					}
					aMenu.push({'title':rename_title,'arg':{'aid':arg['aid'],'fid':arg['fid'],'ftype':arg['ftype'],'method':'rename_folder'}, css:'ico2 edit_folder', 'disabled':bArchive || !aRights.modify || sFolType == 'A' || sFolType == 'X'/* || arg['fid'].indexOf(sPrimaryAccountSPREFIX)==0*/});
					if (!bVirtual)
						aMenu.push({'title':'POPUP_FOLDERS::MOVE_FOLDER','arg':{'aid':arg['aid'],'fid':arg['fid'],'method':'move_folder'}, css:'ico2 move_folder', 'disabled':bArchive || !aRights.modify || sFolType == 'A' || sFolType == 'X'});

					if (GWOthers.getItem('LAYOUT_SETTINGS','favorites')>0 && !bMoreMenu)
						aMenu.push({'title':'POPUP_FOLDERS::ADD_FAVORITES','arg':{aid:arg['aid'], fid:arg['fid'], 'method':'add_favorite'}, css:'ico2 fav_folder'});

					var aOtherMenu = {'title':'COMMON::MORE_OPTIONS', css:'ico2 more', nodes:[]};

					if (sFolType == 'M' && dataSet.get('folders',[arg['aid'],arg['fid'],'RSS']))
						aMenu.push(	{'title':'POPUP_FOLDERS::CHANGE_CHANNEL','arg':{'aid':arg['aid'],'fid':arg['fid'],'ftype':arg['ftype'],'method':'change_channel'}, css:'ico2 manage_rss', 'disabled':!aRights.modify});
					else
					if (arg['aid']==sPrimaryAccount && !bVirtual){

						//Default folders
						if (arg['fid'].indexOf(sPrimaryAccountSPREFIX) < 0)
							if (sFolType == 'M'){
								if (!bArchive  && arg['fid'].indexOf('/')<0 && arg['fid']!='INBOX' && !dataSet.get('folders',[arg['aid'],arg['fid'],'SPAM']) && !dataSet.get('folders',[arg['aid'],arg['fid'],'PUBLIC'])){
									aOtherMenu.nodes.push(
										{'title':'POPUP_FOLDERS::DEFAULT', css:'ico2 default_folder', nodes:[
											{'title':'COMMON_FOLDERS::DRAFTS','arg':{'aid':arg['aid'],'fid':arg['fid'],'default':'D','method':'default'}, css:'draft_folder',disabled:GWOthers.getItem('DEFAULT_FOLDERS','drafts') == arg['aid']+'/'+arg['fid']},
											{'title':'COMMON_FOLDERS::SENT','arg':{'aid':arg['aid'],'fid':arg['fid'],'default':'S','method':'default'}, css:'sent_folder',disabled:GWOthers.getItem('DEFAULT_FOLDERS','sent') == arg['aid']+'/'+arg['fid']},
											{'title':'COMMON_FOLDERS::TRASH','arg':{'aid':arg['aid'],'fid':arg['fid'],'default':'H','method':'default'}, css:'trash_folder',disabled:GWOthers.getItem('DEFAULT_FOLDERS','trash') == arg['aid']+'/'+arg['fid']},
											{'title':'COMMON_FOLDERS::TEMPLATES','arg':{'aid':arg['aid'],'fid':arg['fid'],'default':'P','method':'default'}, css:'template_folder',disabled:GWOthers.getItem('DEFAULT_FOLDERS','templates') == arg['aid']+'/'+arg['fid']}
										]}
									);
								}
							}
							else
							if (sFolType != 'A' && sFolType != 'X'){
								if (arg['fid'].indexOf('/')<0)
									aOtherMenu.nodes.push({'title':'POPUP_FOLDERS::DEFAULT', css:'ico2 default_folder','arg':{'aid':arg['aid'],'fid':arg['fid'],'default':sFolType,'method':'default'},disabled:GWOthers.getItem('DEFAULT_FOLDERS', {C:'CONTACTS',E:'EVENTS',T:'TASKS',N:'NOTES',J:'JOURNAL',F:'FILES'}[sFolType]) == arg['aid']+'/'+arg['fid']});
							}

					}

					if (sFolType != 'A' && sFolType != 'X') {
						aOtherMenu.nodes.push({'title': 'POPUP_FOLDERS::EXPORT', 'arg': {'aid': arg['aid'], 'fid': arg['fid'], 'method': 'save_folder'}, css:'ico2 export_folder', disabled: arg['aid'] != sPrimaryAccount});

						if (sFolType != 'M' && dataSet.get('folders',[sPrimaryAccount,'__@@GWTRASH@@__']))
							aOtherMenu.nodes.push({'title':'POPUP_FOLDERS::RECOVERY','arg':{'aid':sPrimaryAccount,'fid':'__@@GWTRASH@@__','search':'folder:"'+ Path.backslash(arg['fid']).replace(/\"/g,'\\\"') +'"','method':'view'}, css:'ico2 rec_folder', disabled:arg['aid'] != sPrimaryAccount});
					}

					if (sFolType == 'M' && arg['fid']!='INBOX' && !bArchive){
						if (dataSet.get("folders",[arg['aid'],arg['fid'],'SYNC']))
							aOtherMenu.nodes.push({'title':'POPUP_FOLDERS::SUBSCRIBED','arg':{'aid':arg['aid'],'fid':arg['fid'],'method':'unsubscribe'}, css:'ico2 check'});
						else
							aOtherMenu.nodes.push({'title':'POPUP_FOLDERS::SUBSCRIBE','arg':{'aid':arg['aid'],'fid':arg['fid'],'method':'subscribe'}, css:'ico2 sync_folder'});
					}

					if (aOtherMenu.nodes.length)
						aMenu.push(aOtherMenu);

					if (!bVirtual)
						aMenu.push({'title':'POPUP_FOLDERS::SHARING','arg':{'aid':arg['aid'],'fid':arg['fid'], 'method':'share'}, css:'ico2 color1 share_folder', disabled:(sFolType == 'M' && sPrimaryAccountProtocol!='imap') || !aRights.owner || bArchive || !sPrimaryAccountSHARING});
					else
						aMenu.push({'title':'-'});

					//check for default (sub)folders
					var bProtected = false;
					if (aRights.remove){
						var aSubFol = dataSet.get('folders',[arg['aid']]);
						for (var i in aSubFol)
							if ((arg['fid'] == i || i.indexOf(arg['fid']+'/')==0) && aSubFol[i].DEFAULT){
								bProtected = true;
								break;
							}
					}
					else
						bProtected = true;

					if (arg['aid'] == sPrimaryAccount && arg['fid'].indexOf(sPrimaryAccountSPREFIX)==0)
						aMenu.push({'title':'POPUP_FOLDERS::UNSUBSCRIBE_FOLDER','arg':{'aid':arg['aid'],'fid':arg['fid'],'method':'unsubscribe_folder'},'css':'ico2 color2 delete_folder','disabled':dataSet.get('folders', [arg.aid, arg.fid, 'SUBSCRIPTION_TYPE']) != 'folder'});

					aMenu.push({'title':'POPUP_FOLDERS::DELETE_FOLDER','arg':{'aid':arg['aid'],'fid':arg['fid'],'method':'delete_folder'},'css':'ico2 color2 delete_folder','disabled':bProtected || sFolType == 'X'});
				}
				else{
					if (GWOthers.getItem('LAYOUT_SETTINGS','favorites')>0 && !bMoreMenu)
						aMenu.push({'title':'POPUP_FOLDERS::ADD_FAVORITES','arg':{aid:arg['aid'], fid:arg['fid'], 'method':'add_favorite'}, css:'ico2 fav_folder'});

					if (sFolType == 'Q')
						aMenu = [{'title':'MAIN_MENU::EMPTY_FOLDER','css':'color2','arg':{'aid':arg['aid'],'fid':arg['fid'],'method':'empty_folder', css:'ico2 color2 empty_folder'}}];
				}
			}
		}
		else
		if (arg['aid']){

			if (!this._sFilterFolderType || !this._sFilterFolderType['Y']){
				aMenu.push({'title':'POPUP_FOLDERS::ADD_FOLDER','arg':{'aid':arg['aid'],'method':'add_folder'}, css:'ico2 add_folder'});

				if (GWOthers.getItem('RESTRICTIONS','disable_virtual') != '1')
					aMenu.push({'title':'POPUP_FOLDERS::ADD_VIRTUAL','arg':{'method':'add_virtual'}, css:'ico2 add_vfolder', 'disabled': arg['aid']!=sPrimaryAccount});

				aMenu.push(
					{'title':'-'},
					{'title':'POPUP_FOLDERS::ADD_SHARED_ACCOUNT', 'arg':{'aid':arg['aid'],'method':'add_account'}, css:'ico2 share_account',disabled:arg['aid']!=sPrimaryAccount || !sPrimaryAccountSHARING},
					{'title':'POPUP_FOLDERS::SHARING','arg':{'aid':arg['aid'], 'method':'share'}, css:'ico2 color1 share_folder', disabled:arg['aid']!=sPrimaryAccount || !sPrimaryAccountSHARING},
					{'title':'-'});
			}

			aMenu.push(
				{'title':'COMMON::APPEARANCE',
					nodes:[
						{'title':'COMMON::EXPAND','arg':{method:'tree_mode',v:2}, css:'ico2' + (Cookie.get(['hide_tree']) == 2?' check':'')},
						{'title':'COMMON::COLLAPSED','arg':{method:'tree_mode',v:1}, css:'ico2' + (Cookie.get(['hide_tree']) == 1?' check':'')},
						{'title':'COMMON::AUTOCOLLAPSED','arg':{method:'tree_mode'}, css:'ico2' + (Cookie.get(['hide_tree'])?'':' check')}
					]
				});
		}
	}

	return aMenu;
};
_me._onclick = function(e,elm,id,arg){

	if (arg.fid && arg.fid == '~')
		delete arg.fid;

	// TYPE contextmenu
	if (e.type == 'contextmenu'){

		var aMenu = obj_tree_folder_context.__createFolderMenu.call(this, arg),
			sFolType = WMFolders.getType(arg);

		if (aMenu.length){
			var cmenu = gui._create("cmenu","obj_context_folder",'','',this);
				cmenu._fill(aMenu);
				cmenu._place(e.clientX,e.clientY);

			if (sFolType === 'Y') {
				var args = {
					aid: arg['aid'],
					fid: arg['fid'].replace('/TeamChat', '')
				};
				if(~(dataSet.get('folders', [args.aid, args.fid]).RIGHTS || '').indexOf('a')) {
					WMFolders.list(args, '', '', [
						function (data) {
							if (cmenu && !cmenu._destructed){
								data = data[args.aid][args.fid];
								args.owner_id = dataSet.get('folders', [args.aid, args.fid + '/TeamChat', 'OWNER']);
								cmenu._create('storage', 'obj_storage_usage', 'storage', '', data.QUOTA, data.SIZE, args);
							}
						}
					]);
				}
			}
		}
	}
	else
	if (arg){
		if (arg['fid']=='__@@VIRTUAL@@__' || arg.ftype == 'X')
			this._open(id);
		else{
			arg = clone(arg);
			arg.elm = elm;
			return this._handleNode(arg);
		}
	}
};

_me._handleNode = function(arg,bUpdate)
{

	if (arg['aid']){
		var t = arg.ftype || dataSet.get("folders",[arg['aid'],arg['fid'],'TYPE']);

		//DO NOT handle Shared accounts
		if (arg['fid'] && (t=='A' || t=='VA' || t=='X'))
			return false;

		//DO NOT handle CHAT accounts
		// if (t == 'Y')
		// 	return false;

		//DO NOT handle RSS accounts
		if(!arg['fid'] && (t == 'rss' || arg['aid'].indexOf('_rss')==arg['aid'].length-4))
			return false;

		//Naposledy otevřený folder
		var aFolder = dataSet.get('active_folder');

		//MERGED CALENDARS
		if (aFolder == sPrimaryAccount+'/__@@VIRTUAL@@__/__@@EVENTS@@__' && t == 'E' && arg['fid']!='__@@VIRTUAL@@__/__@@EVENTS@@__'){

			var aVirtual = dataSet.get('folders',[sPrimaryAccount,'__@@VIRTUAL@@__/__@@EVENTS@@__','VIRTUAL','FOLDERS'],true) || {},
				bUpdate = false;

			//Add
			if (!Is.Defined(aVirtual[arg['fid']])){
				if (arg.elm && arg.elm.tagName == 'I')
					aVirtual[arg['fid']] = false;
				else{
					for (var i in aVirtual)
						aVirtual[i] = false;

					aVirtual[arg['fid']] = true;
				}

				bUpdate = true;
			}
			else
			//Remove
			if (arg.elm && arg.elm.tagName == 'I'){
				if (count(aVirtual)>1){
					if (aVirtual[arg['fid']] == true){
						delete aVirtual[arg['fid']];
						for (var sLast in aVirtual);
						if (sLast)
							aVirtual[sLast] = true;
					}
					else
						delete aVirtual[arg['fid']];

					bUpdate = true;
				}
			}
			//Set Primary
			else
			if (!aVirtual[arg['fid']]){

				for (var i in aVirtual)
					aVirtual[i] = false;

				aVirtual[arg['fid']] = true;
				bUpdate = true;
			}

			//Edit __@@EVENTS@@__
			this._setActive(sPrimaryAccount+'/__@@VIRTUAL@@__/__@@EVENTS@@__');
			this._fill();

			if (bUpdate)
				WMFolders.add({'aid':sPrimaryAccount,'fid':'__@@VIRTUAL@@__/__@@EVENTS@@__','name':'__@@VIRTUAL@@__/__@@EVENTS@@__','type':'E','virtual':{folders:aVirtual}},'folders','',[this,'__refresh',[arg]]);
			else
				gui.__exeEvent('folderSelected',arg);

			return false;
		}
		else{
			//Neotvíráme již otevřený folder?
			if (aFolder != arg['aid'] +'/'+ (arg['fid'] || '~') || bUpdate)
				gui.frm_main._selectView(arg);
			else
				gui.__exeEvent('folderSelected',arg);
		}

		return true;
	}
};

_me.__refresh = function(aData){
	if (aData && aData.virtual){
		//write
		dataSet.add('folders',[sPrimaryAccount,'__@@VIRTUAL@@__/__@@EVENTS@@__','VIRTUAL','FOLDERS'],aData.virtual.folders);
	}

	gui.frm_main._selectView({aid:sPrimaryAccount,fid:'__@@VIRTUAL@@__/__@@EVENTS@@__'},'',true);
};
