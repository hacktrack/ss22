function obj_permissions(){};
var _me = obj_permissions.prototype;
/**
 * @brief:
 * @date : 01.12.2014
 **/
_me.__constructor = function(s){
	var me = this;
	storage.library('wm_user');
	storage.library('obj_accountpicker');
	
	this._permissionsDropdownContent = {
		general: {
			'lr':getLang('permissions::read'),
			'lrswipk':getLang('permissions::write'),
			'lrswipktexdc':getLang('permissions::all'),
			'lrswipktexadc':getLang('permissions::full'),
			'*':getLang('permissions::none')
		},
		owner: {
			'lr':getLang('permissions::read'),
			'lripkzu':getLang('permissions::write'),
			'lripkxzyvuc':getLang('permissions::owner'),
			'lrswipktexzyvudc':getLang('permissions::all'),
			'lrswipktexazyvudc':getLang('permissions::full'),
			'*':getLang('permissions::none')
		}
	}
	
	this._itemsList=[];
	this._lastFolder=false;
};

_me._showMore=function(){
	var me=this;
	
	this._parent.btn_inherit._hide(true);
	this._parent.btn_save._hide(true);
	this._parent.btn_cancel._hide(true);
	this._parent.btn_done._hide(false);
	
	if(!this._treeLoaded){
		this._treeLoaded=true;
		com.user.folderList(location.parsed_query.account,false,function(result){
			var root=result.Array.IQ[0].QUERY[0].RESULT[0];
			
			try
			{
				var rootElm=me._drawFolder(root);
				
				if(rootElm)
				{
					me._getAnchor('folders').appendChild(rootElm);
				}
			}
			catch(e)
			{
				log.error(e);
			}
		});
	}
}

_me._findDefaultFolder=function(data,type,subtype){
	try
	{
		if(data.SUBFOLDERS[0]){
			for(var i=0; i<data.SUBFOLDERS[0].ITEM.length; i++){
				if(data.SUBFOLDERS[0].ITEM[i].FOLDERTYPE[0].VALUE==type){
					if(
						subtype &&
						data.SUBFOLDERS[0].ITEM[i].DEFAULTTYPE &&
						data.SUBFOLDERS[0].ITEM[i].DEFAULTTYPE[0] &&
						data.SUBFOLDERS[0].ITEM[i].DEFAULTTYPE[0].VALUE &&
						data.SUBFOLDERS[0].ITEM[i].DEFAULTTYPE[0].VALUE==subtype
					){
						return data.SUBFOLDERS[0].ITEM[i];
					}
					if(!subtype){
						return data.SUBFOLDERS[0].ITEM[i];
					}
				}
				if(data.SUBFOLDERS[0].ITEM[i].SUBFOLDERS[0] && data.SUBFOLDERS[0].ITEM[i].SUBFOLDERS[0].ITEM){
					var ret=this._findDefaultFolder(data.SUBFOLDERS[0].ITEM[i],type,subtype);
					if(ret){
						return ret;
					}
				}
			}
		}
	}
	catch(e)
	{
		log.error(e);
	}
	return false;
}

_me._showLess=function(){
	var me=this;
	
	this._parent.btn_inherit._hide(true);
	this._parent.btn_cancel._hide(true);
	this._parent.btn_save._hide(true);
	this._parent.btn_done._hide(false);
	this._parent._setBackButton();
	
	this._getAnchor('showless').removeAttribute('is-hidden');
	this._getAnchor('tree').setAttribute('is-hidden','1');
	this._getAnchor('detail').setAttribute('is-hidden','1');
	
	com.user.folderList(location.parsed_query.account,true,function(result){
		try
		{
			var root=result.Array.IQ[0].QUERY[0].RESULT[0];

			var inbox=me._findDefaultFolder(root,'M','I');
			var calendar=me._findDefaultFolder(root,'E');
			var tasks=me._findDefaultFolder(root,'T');
			var journal=me._findDefaultFolder(root,'J');
			var note=me._findDefaultFolder(root,'N');
			var contacts=me._findDefaultFolder(root,'C');
			var files=me._findDefaultFolder(root,'F');
			
			log.log(['permissions-showless-inbox',inbox]);
			log.log(['permissions-showless-calendar',calendar]);
			log.log(['permissions-showless-contacts',contacts]);
			log.log(['permissions-showless-tasks',tasks]);
			log.log(['permissions-showless-journal',journal]);
			log.log(['permissions-showless-note',note]);
			log.log(['permissions-showless-files',files]);
			
			// set data on "less" tiles and show less

			// inbox
			if(inbox){
				me.button_folder_inbox._data={_id:inbox.ID[0].VALUE,_name:inbox.NAME[0].VALUE};
				me.button_folder_inbox._onclick=function(){
					me._parent._setBackButton(function(){
						me._showLess();
					});
					me._openFolderDetail({id:this._data._id,name:this._data._name,ftype:'M'});
				}
			}else if (me._getAnchor('folder_inbox')) {
				me._getAnchor('folder_inbox').setAttribute('is-hidden',1);
			}
			
			// calendar
			if(calendar){
				me.button_folder_calendar._data={_id:calendar.ID[0].VALUE,_name:calendar.NAME[0].VALUE};
				me.button_folder_calendar._onclick=function(){
					me._parent._setBackButton(function(){
						me._showLess();
					});
					me._openFolderDetail({id:this._data._id,name:this._data._name,ftype:'E'});
				}
			}else if (me._getAnchor('folder_calendar')) {
				me._getAnchor('folder_calendar').setAttribute('is-hidden',1);
			}
			// contacts
			if(contacts){
				me.button_folder_contacts._data={_id:contacts.ID[0].VALUE,_name:contacts.NAME[0].VALUE};
				me.button_folder_contacts._onclick=function(){
					me._parent._setBackButton(function(){
						me._showLess();
					});
					me._openFolderDetail({id:this._data._id,name:this._data._name,ftype:'C'});
				}
			}else if (me._getAnchor('folder_contacts')) {
				me._getAnchor('folder_contacts').setAttribute('is-hidden',1);
			}
			
			// files
			if(files){
				me.button_folder_files._data={_id:files.ID[0].VALUE,_name:files.NAME[0].VALUE};
				me.button_folder_files._onclick=function(){
					me._parent._setBackButton(function(){
						me._showLess();
					});
					me._openFolderDetail({id:this._data._id,name:this._data._name,ftype:'F'});
				}
			}else if (me._getAnchor('folder_files')) {
				me._getAnchor('folder_files').setAttribute('is-hidden',1);
			}
			
			//
		}
		catch(e)
		{
			log.error(["permissions-showless",e]);
		}
	});
}

_me._load = function(domain)
{
	var that=this;
	var me=this;
	
	that._draw('obj_permissions', '', {items:{}});
	
	this._parent.btn_inherit._hide(true);
	this._parent.btn_cancel._hide(true);
	this._parent.btn_save._hide(true);
	
	this._parent.btn_cancel._onclick=function(e){
		me._parent.btn_back._onclick();
	};
	
	this._parent.btn_done._onclick=function(e){
		me._close();
	};
	
	this._parent.btn_inherit._onclick=function(e){
		me._inherit();
	};
	
	this.btn_add._onclick=function(){
		me._addUser();
	}
	
	this.btn_show_all_folders._onclick=function(){
		me._showTree();
	}
	this.btn_show_less._onclick=function(){
		me._showLess();
	}
	
	this._showLess();
	
	log.log(["permissions-load-done"]);
}

_me._drawFolder=function(folder,depth){
	var me=this;
	var liElm=false;
	if(!depth){depth=0;}
	
	//log.log(['folder',folder]);
	
	liElm = mkElement('li',{});
		addcss(liElm,'folders-child type_'+folder.FOLDERTYPE[0].VALUE.toLowerCase());
		if(depth==0){
			addcss(liElm,'folders-root');
		}
		if(depth==1){
			addcss(liElm,'folders-top');
		}
		
		liElm._id=folder.ID[0].VALUE;
		liElm._name=folder.NAME[0].VALUE;

		liElm.onclick =
		(function(data) {
			return function(e){
				// Set back button
				me._parent._setBackButton(function(){
					me._showTree();
				});
				// Open folder and show permissions
				me._openFolderDetail(data);
				// Prevent to open also rights of folders above nested items
				e.stopPropagation();
			}
		})({
			id: folder.ID[0].VALUE,
			name: folder.NAME[0].VALUE,
			ftype:folder.FOLDERTYPE[0].VALUE
		});

	var spanElm = mkElement('span',{});
		addcss(spanElm,'folders-name');
		spanElm.innerHTML=(folder.NAME[0]&&folder.NAME[0].VALUE?folder.NAME[0].VALUE:'');
	
	liElm.appendChild(spanElm);
	
	// SUBFOLDERS[0].ITEM[0]
	if(folder.SUBFOLDERS && folder.SUBFOLDERS[0] && folder.SUBFOLDERS[0].ITEM && folder.SUBFOLDERS[0].ITEM[0]){
		addcss(liElm,'open');

		var ulElm = mkElement('ul',{});
		addcss(ulElm,'folders-parent');
		// Nesting subfolders recursively
		for(var i=0; i<folder.SUBFOLDERS[0].ITEM.length; i++){
			var sub=this._drawFolder(folder.SUBFOLDERS[0].ITEM[i],depth+1);
			ulElm.appendChild(sub);
		}
		
		liElm.appendChild(ulElm);
	}
	
	return liElm;
}

_me._showTree=function(){
	
	this._parent.btn_inherit._hide();
	
	var me=this;
	this._showMore();
	
	this._parent._setBackButton();
	
	this._getAnchor('showless').setAttribute('is-hidden','1');
	this._getAnchor('detail').setAttribute('is-hidden','1');
	this._getAnchor('tree').removeAttribute('is-hidden');
}

_me._showDetail=function(){
	this._getAnchor('showless').setAttribute('is-hidden','1');
	this._getAnchor('tree').setAttribute('is-hidden','1');
	this._getAnchor('detail').removeAttribute('is-hidden');
	this._parent.btn_save._hide(false);
	this._parent.btn_done._hide(true);
	this._parent.btn_cancel._hide(false);
	this._parent.btn_inherit._hide(false);
}

_me._activateLine=function(line,value,ftype){
	var me=this;
	ftype = {Y: 'owner', I: 'owner'}[ftype] || 'general';
	if(!value){value='';}
	if(line && line._objects)
	{
		for(var ii=0; ii<line._objects.length; ii++){
			if(line._objects[ii]._name.search('dropdown_permissions')==0){
				line._permissions=line._objects[ii];
				var contains=false;
				var custom={};
				for(var key in me._permissionsDropdownContent[ftype]){
					custom[key]=me._permissionsDropdownContent[ftype][key];
					if(key.replace('*','')==value){
						contains=true;
					}
				}
				if(!contains){
					custom[value]=getLang('permissions::custom')+' ('+helper.htmlspecialchars(value)+')';
				}
				line._objects[ii]._fill(custom);
				line._objects[ii]._value(value, false, true);
			}
			if(line._objects[ii]._name.search('btn_erase')==0){
				line._objects[ii]._onclick=function(){
					me._deleteItem(line);
				};
			}
		}
	}
}

_me._cleanList=function(){
	var me=this;
	var l=me._itemsList.length;
	for(var i=0; i<l; i++){
		this._deleteItem(me._itemsList[l-i-1]);
	}
}

_me._deleteItem=function(line){
	var me=this;
	for(var i=0; i<me._itemsList.length; i++){
		if(me._itemsList[i]==line){
			me._itemsList.splice(i,1);
			var lol=line._objects.length;
			for(var ii=0; ii<lol; ii++){
				line._objects[ii]._destruct();
			}
			line.parentElement.removeChild(line);
		}
	}
}

_me._openFolderDetail=function(folder){
	var me=this;
	me._lastFolder=folder.id;

	me._cleanList();
	me._parent.btn_inherit._show();
	
	me.list.__foldertype = folder.ftype;

	com.user.getFolderPermissions(location.parsed_query.account,folder.id,function(result){
	try
	{
		me._parent.btn_inherit._main.removeAttribute('is-hidden');
		
		var items=[];
		if(result.Array.IQ[0].QUERY[0].RESULT[0].ITEM && result.Array.IQ[0].QUERY[0].RESULT[0].ITEM[0]){
			items=result.Array.IQ[0].QUERY[0].RESULT[0].ITEM;
		}
		
		// fill grid
		var anyone='';
		for(var i=0; i<items.length; i++){
			var name=(items[i].ACCOUNT[0]?items[i].ACCOUNT[0].VALUE:'');
			var permissions=(items[i].PERMISSIONS[0]?items[i].PERMISSIONS[0].VALUE:'');
			// draw line exept for everyone rights
			if(name!='anyone')									
				me._drawItem(name,permissions,folder.ftype);
			else
				anyone = permissions;
		}

		// draw anyone
		var line=me.list._drawItem({name:getLang('permissions::anyone'),permissions:anyone})
		me._activateLine(line,anyone);
		me._itemsList.push(line);
		//
		
		me._parent._setHeading(folder.name);
		
		me._showDetail();
	}
	catch(e)
	{
		log.error(e);
	}
	});
}

_me._drawItem=function(name,permissions,ftype){
	var line=this.list._drawItem({name:name,permissions:permissions});
	this._activateLine(line,permissions,ftype);
	line._name=name;
	this._itemsList.push(line);
}

_me._addUser=function(){
	var me=this;

	gui.accountpicker(function(items,type){
		if(type==0){
			for(var i=0; i<items.length; i++){
				me._drawItem("["+items[i].id+']','',me.list.__foldertype);
			}
		}else{
			for(var i=0; i<items.length; i++){
				me._drawItem(items[i].id,'',me.list.__foldertype);
			}
		}
	},{
		type:{
			allowed:[0,7]
		},
	});
}

_me._inherit=function(){
	var me=this;
	if(me._lastFolder)
	{
		com.user.inheritFolderPermissions(location.parsed_query.account,me._lastFolder,function(result){
			try
			{
				if(result.Array.IQ[0].QUERY[0].RESULT[0].VALUE==0){
					gui.message.error(getLang("error::save_unsuccessful"));
				}else{
					gui.message.toast(getLang("message::save_successfull"));
					me._parent.btn_back._onclick();
				}
			}
			catch(e)
			{
				log.error(e);
			}
		});
	}
}

_me._save=function(){
	var me=this;
	
	var items=[];
	for(var i=0; i<me._itemsList.length; i++){
		var obj=me._itemsList[i];
		items.push({
			account:[{VALUE:obj._name}],
			permissions:[{VALUE:obj._permissions._value()}]
		});
	}
	
	if(me._lastFolder)
	{
		com.user.setFolderPermissions(location.parsed_query.account,me._lastFolder,items,function(result){
			try
			{
				if(result.Array.IQ[0].QUERY[0].RESULT[0].VALUE==0){
					gui.message.error(getLang("error::save_unsuccessful"));
				}else{
					gui.message.toast(getLang("message::save_successfull"));
					me._parent.btn_back._onclick();
				}
			}
			catch(e)
			{
				log.error(['permissions-save',e]);
			}
		});
	}
}
