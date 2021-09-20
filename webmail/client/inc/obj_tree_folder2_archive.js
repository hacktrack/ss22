function obj_tree_folder2_archive() {}
_me = obj_tree_folder2_archive.prototype;

_me.__constructor = function () {
	this._opt.privateRootActive = false;
	this._filter_folder(['Y','I']);
	this._fill();

	this._add_destructor('__off');

	dataSet.on('active_folder',[], this.__activate, this)
		.on('cookies',['active_groupchat_view'], this.__activate, this);
};

_me._filterData = function(aData){
	return !(aData.data.TYPE == 'Y' || (aData.data.SYNC || 0) == 0);
};

_me._onclick = function(e,elm,id,arg){

	// TYPE contextmenu
	if (e.type == 'contextmenu'){
		var sFolType = WMFolders.getType(arg);
		if (sFolType == 'I'){
			var aMenu = this.__createMenu(arg);
			if (aMenu.length){
				var cmenu = gui._create("cmenu","obj_context_folder",'','',this);
					cmenu._fill(aMenu);
					cmenu._place(e.clientX,e.clientY);
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

_me.__createMenu = function(arg){
	var rights = WMFolders.getRights(arg);
	return [
		{'title': 'FORM_BUTTONS::RENAME', css:'ico2 edit_folder', 'arg': {aid: sPrimaryAccount, fid: arg.fid, ftype: 'I', method: 'rename_folder'}, disabled: !rights.edit_folder},
		{title: 'FORM_BUTTONS::SUBSCRIBE', css:'ico2 sync_folder', 'arg': {aid: sPrimaryAccount, fid: arg.fid, ftype: 'I', method: 'subscribe', callback:[this,'__subscribe_cb',[arg]]}},
		rights.owner ? {'title': 'POPUP_FOLDERS::MEMBERS', css:'ico2 color1 members', 'arg': {aid: sPrimaryAccount, fid: arg.fid, method: 'share'}} : false,
		{'title': 'POPUP_ITEMS::DELETE', css:'ico2 color2 delete_folder', 'arg': {aid: sPrimaryAccount, fid: arg.fid, method: 'delete_folder'}, disabled: !rights.remove}
	].filter(Boolean);
};

_me._handleNode = function(arg){
	if (arg.ftype == 'I'){
		//Naposledy otevřený folder
		var aFolder = dataSet.get('active_folder');

		//Neotvíráme již otevřený folder?
		if (aFolder != arg['aid']+'/'+arg['fid'])
			gui.frm_main._selectView(arg);
		else
			gui.__exeEvent('folderSelected',arg);
	}
};

_me.__subscribe_cb = function(bOK, arg){
	// console.warn(arguments);
};

_me.__activate = function(){
	if (Cookie.get(['active_groupchat_view']) == 3)
	 	this._setActive(dataSet.get('active_folder'), false, true);
};

_me.__off = function(){
	dataSet.off('active_folder',[], this.__activate)
		.off('cookies',['active_groupchat_view'], this.__activate);
};