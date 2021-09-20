function frm_addroom(){};

frm_addroom.prototype = {
    __constructor: function(sAccountID, sFolderID, aHandler, bMain){
		this._modal(true);
		this._size(400,480,true);
		this._title('CHAT::ADD_ROOM');

		this.__views = {
			'main':'frm_addroom_main',
			'public':'frm_addroom_public',
			'private':'frm_addroom_private'
		};

		this.__data = {
			aid:sAccountID,
			fid:sFolderID,
			handler: aHandler
		};

		//Default page logic
		if (bMain)
			this._view(!this._getGroups().length ? 'private' : 'main');
		else 
		if (!sFolderID)
			this._view('main');
		else
		if (dataSet.get('folders',[sAccountID, Path.basedir(sFolderID),'PRIVATE_ROOT']) === "true")
			this._view('private');
		else
			this._view('public');

		this._focus();
	},

	// returns all Y folders with WRITE right
	_getGroups:function(){
		var ds = dataSet.get('folders',[sPrimaryAccount]),
			folders = [];

		for(var id in ds){
			if (ds[id].TYPE == 'Y' && Path.basedir(id) && !(ds[Path.basedir(id)] || {}).PRIVATE_ROOT && ds[id].RIGHTS && ~ds[id].RIGHTS.indexOf('k')){
				folders.push([Path.basedir(id), id]);
			}
		}

		return folders;
	},

	_final:function(aData)
	{
		//Force predefined Group
		if (aData.type === 'private'){
			aData.group = 'private_' + dataSet.get('main',['domain']) + '@##internalservicedomain.icewarp.com##/TeamChat';
		}
		else
		//Check root (group) folder
		if (WMFolders.getType([sPrimaryAccount, aData.group]) !== 'Y'){
			gui.notifier._value({type: 'alert', args: {header: '', text: 'FORM_FOLDERS::CREATE_ERROR'}});
			return;
		}

		//LOADING
		this.btn_next._disabled(true);
		this._create('loader','obj_loader');

		var sFolderName = aData.group +'/'+ aData.name;
		WMFolders.add({'name':sFolderName,'type':'I','aid':sPrimaryAccount, 'private':aData.type === 'private'},'folders','', [this,'_response_handler',[aData]], [this,'_error_handler']);
	},

	_response_handler:function(aFolderInfo, aData){

		if (aFolderInfo){
			if (aData.type === 'private' && aData.members){

				var aDistribList = MailAddress.findDistribList({'to': aData.members});

				var aItemInfo = {
					aid:aFolderInfo.aid,
					fid:aFolderInfo.name,
					xmlarray:{
						TO:[{VALUE:aDistribList.to}]
					}
				};

				if (!Is.Empty(aDistribList.distrib)){
					storage.library('wm_messages');
					aItemInfo.xmlarray.DISTRIB = wm_messages.parse_distrib(aDistribList.distrib);
				}

				WMFolders.action(aItemInfo,'','','add_member','',[function(bOK){
					//ERROR
					if (!bOK){
						gui.notifier._value({type: 'alert', args: {header: '', text: 'FORM_FOLDERS::INVITE_ERROR'}});
					}

					this._success_handler(aFolderInfo);

				}.bind(this)]);
			}
			else{
				this._success_handler(aFolderInfo);
			}
		}
		//ERROR
		else{
			this._error_handler();
		}
	},

	_success_handler:function(aFolderInfo){

		this._destruct();

		this.__data.handler && executeCallbackFunction(this.__data.handler, aFolderInfo);
		gui.frm_main._selectView({aid: aFolderInfo.aid, fid: aFolderInfo.name});

		gui.frm_main.bar.tree.folders.inp_search._value('');
		gui.frm_main.bar.tree.folders.inp_search._onkeyup({keyCode: 27});
		gui.frm_main.bar.tree.folders.__filter = '';
	},

	_error_handler:function(){
		this.btn_next && this.btn_next._disabled(false);
		this.loader && this.loader._destruct();

		if (this.main && this.main.name)
			this.main.name._select();

		gui.notifier._value({type: 'alert', args: {header: '', text: 'FORM_FOLDERS::CREATE_ERROR'}});
	}
};
