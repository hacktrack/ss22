_me = frm_sharing.prototype;
function frm_sharing(){};

frm_sharing.RIGHTS_GROUP = {};
frm_sharing.RIGHTS_GROUP.Y = {
	FULL: 'abcdeiklrtwx',
	WRITE: 'beiklr',
	OWNER: 'bcdeiklrx',
	ALL: 'bcdeiklrtwx',
	READ: 'lr',
	NONE: '-'
};
frm_sharing.RIGHTS_GROUP.I = frm_sharing.RIGHTS_GROUP.Y;
frm_sharing.RIGHTS_GROUP.DEFAULT = {
	FULL: 'aiklrtwx',
	WRITE: 'iklrw',
	AUTHOR: 'ilr',
	OWNER: 'iklrwx',
	ALL: 'iklrtwx',
	READ: 'lr',
	NONE: '-'
};

_me.__getRightsGroup = function(folder_info, group) {
	return (frm_sharing.RIGHTS_GROUP[WMFolders.getType(folder_info)] || frm_sharing.RIGHTS_GROUP.DEFAULT)[group];
};

_me.__constructor = function(aHandler, aFolderInfo){
	this.__aFolderInfo = aFolderInfo;

	var me = this;

	this.__bFormEnabled = false;
	this.inp_add._disabled(!this.__bFormEnabled);

	if(aFolderInfo.fid) {
		var folder = dataSet.get('folders', [aFolderInfo.aid, aFolderInfo.fid]) || {};
		this._title(getLang('POPUP_FOLDERS::SHARING') + ' (' + (folder.NAME || (folder.RELATIVE_PATH || aFolderInfo.fid).replace(/^\~/g, '')) + ')', true);
	} else {
		this._title(getLang('POPUP_FOLDERS::SHARING_ACCOUNT') + ' - ' + aFolderInfo.aid, true);
	}

	// Create 'INHERIT' button
	if (aFolderInfo.fid){
		this._create('x_btn_inherit', 'obj_button', 'footer','noborder ok');
		this.x_btn_inherit._disabled(true);

		this.x_btn_inherit._value('FORM_BUTTONS::INHERIT');
		this.x_btn_inherit._onclick = function() {
			//SMAZ PRAVA
			me.__aData = {};
			me.x_btn_ok._onclick();
		};
		this.x_btn_inherit._main.parentNode.insertBefore(this.x_btn_inherit._main, this.x_btn_inherit._main.previousSibling);
	}


	this.users._addColumns({
		user:{title:"SHARING::PEOPLE_YOU_INVITED", width:100, mode:'%', type:'static'},
		perm:{title:"SHARING::PERMISSIONS", width:140, css:'ico more', type:'static'},
		x: {width: 30, mode: 'px', css: 'remove', type: 'static'}
	});


	//Load Data
	var bEnable = true;

	try{
		var tmp;
		if (this.__aFolderInfo.fid)
			tmp = WMFolders.list(this.__aFolderInfo)[this.__aFolderInfo.aid][this.__aFolderInfo.fid];
		else
			tmp = WMAccounts.list(this.__aFolderInfo)[this.__aFolderInfo.aid];

		if (tmp){

			if (tmp.INHERITED_ACL == '1')
				this._title(getLang('POPUP_FOLDERS::SHARING')+' - '+(aFolderInfo.fid?aFolderInfo.fid.replace(/^\~/g,''):aFolderInfo.aid) + ' ('+ getLang('SHARING::INHERITED') +')',true);

			if (tmp.RIGHTS && tmp.RIGHTS.indexOf('a')<0)
			    bEnable = false;

			tmp = tmp.ACL;
		}

		for(var i in tmp)
			this.__aData[i]  = tmp[i];

		tmp = null;
	}
	catch(r){
		bEnable = true;
	}

	var bPublic = dataSet.get('folders',[aFolderInfo.aid,aFolderInfo.fid,'PUBLIC']);

	//check for shared folder
	if (this.__aFolderInfo && this.__aFolderInfo.fid && (this.__aFolderInfo.fid.indexOf(sPrimaryAccountSPREFIX) === 0 || bPublic)){
		if (bPublic || this.__aFolderInfo.fid.indexOf('@')>0){
			var a = this.__aData[sPrimaryAccount]||this.__aData['['+aFolderInfo.fid+']'] || this.__aData.anyone;
			if (Is.Array(a) && inArray(a,'a')>-1){
				//Enable All
				this.__bFormEnabled = true;
				this.x_btn_ok._disabled(false);
				this.inp_add._disabled(false);

				if (this.x_btn_inherit)
					this.x_btn_inherit._disabled(false);
			}
		}
	}
	//Enable All
	else
	if (bEnable){
		this.__bFormEnabled = true;
		this.x_btn_ok._disabled(false);
		this.inp_add._disabled(false);

		if (this.x_btn_inherit)
			this.x_btn_inherit._disabled(false);
	}

	this.__aData2 = clone(this.__aData,true);

	this._fill();

	this.users._obeyEvent('onclick', [function (e,args){
		var elm = args.elm,
			arg = args.arg,
			cell = args.cell;
		if (me.__bFormEnabled && arg && arg.user && Is.Array(me.__aData[arg.user])){

			switch(cell){
				case 'perm':

					if (arg && me.__aData[arg.user]){
						var r = me.__aData[arg.user].sort().join(''),
							pos = getSize(elm),
							custom = !~[
								me.__getRightsGroup(aFolderInfo, 'READ'),
								me.__getRightsGroup(aFolderInfo, 'AUTHOR'),
								me.__getRightsGroup(aFolderInfo, 'WRITE'),
								me.__getRightsGroup(aFolderInfo, 'OWNER'),
								me.__getRightsGroup(aFolderInfo, 'ALL'),
								me.__getRightsGroup(aFolderInfo, 'FULL'),
								'-'
							].indexOf(r);

						me.cmenu = gui._create('cmenu','obj_context');
						me.cmenu._fill([
							{title:'SETTINGS::READ', arg:me.__getRightsGroup(aFolderInfo, 'READ').split(''), css: 'ico2' + (r==me.__getRightsGroup(aFolderInfo, 'READ')?' check':'')},
							(WMFolders.getType(aFolderInfo) === 'Y' || WMFolders.getType(aFolderInfo) === 'I') ? false :
							{title:'SETTINGS::AUTHOR', arg:me.__getRightsGroup(aFolderInfo, 'AUTHOR').split(''), css: 'ico2' + (r==me.__getRightsGroup(aFolderInfo, 'AUTHOR')?' check':'')},
							{title:'SETTINGS::WRITE', arg:me.__getRightsGroup(aFolderInfo, 'WRITE').split(''), css: 'ico2' + (r==me.__getRightsGroup(aFolderInfo, 'WRITE')?' check':'')},
							(WMFolders.getType(aFolderInfo) === 'Y' || WMFolders.getType(aFolderInfo) === 'I') ? {
								title:'SETTINGS::OWNER', arg:me.__getRightsGroup(aFolderInfo, 'OWNER').split(''), css: 'ico2' + (r==me.__getRightsGroup(aFolderInfo, 'OWNER')?' check':'')
							} : false,
							{title:'SETTINGS::ALL', arg:me.__getRightsGroup(aFolderInfo, 'ALL').split(''), css: 'ico2' + (r==me.__getRightsGroup(aFolderInfo, 'ALL')?' check':'')},
							{title:'SETTINGS::FULL', arg:me.__getRightsGroup(aFolderInfo, 'FULL').split(''), css: 'ico2' + (r==me.__getRightsGroup(aFolderInfo, 'FULL')?' check':'')},
							{title:'-'},
							{title:'SHARING::CUSTOM', arg:'custom', css: 'ico2' + (custom ? ' check' : '')},
							{title:'-'},
							{title:'SHARING::NONE', arg:[], css: 'ico2' + (r=='-'?' check':'')}
						].filter(Boolean));
						me.cmenu._place(pos.x+pos.w/2,pos.y+pos.h,null,1);

						me.cmenu._onclick = function(e, elm, id, arg2){
							if (arg && arg.user){
								if(arg2 === 'custom') {
									gui._create('frm_permissions', 'frm_permissions', '', '', {
										permissions: me.__aData[arg.user],
										teamchat: ~'IY'.indexOf(WMFolders.getType(aFolderInfo)),
										callback: function(perms) {
											me.__aData[arg.user] = perms;
											me._fill();
										}
									});
								} else if(Is.Array(arg2)) {
									me.__aData[arg.user] = arg2;
									me._fill();
								}
							}
						};

						//Stop Propagation
						e.cancelBubble = true;
						if (e.stopPropagation) e.stopPropagation();
					}
			}

		}
	}]);
};

_me._fill = function(){
	var aData = [],
		arr = {};

	arr[this.__getRightsGroup(this.__aFolderInfo, 'FULL')] = getLang('SETTINGS::FULL');
	arr[this.__getRightsGroup(this.__aFolderInfo, 'ALL')] = getLang('SETTINGS::ALL');
	arr[this.__getRightsGroup(this.__aFolderInfo, 'READ')] = getLang('SETTINGS::READ');
	arr[this.__getRightsGroup(this.__aFolderInfo, 'OWNER')] = getLang('SETTINGS::OWNER');
	arr[this.__getRightsGroup(this.__aFolderInfo, 'WRITE')] = getLang('SETTINGS::WRITE');
	arr[this.__getRightsGroup(this.__aFolderInfo, 'AUTHOR')] = getLang('SETTINGS::AUTHOR');
	arr[this.__getRightsGroup(this.__aFolderInfo, 'NONE')] = getLang('SETTINGS::NONE');
	arr['*'] = getLang('SETTINGS::CUSTOM');

	for(var i in this.__aData)
		if (this.__aData[i][0]!='~'){

			var r = this.__aData[i].sort().join('') || '-';

			aData.push({
				data:{
					user: '<img class="avatar" src="' + getAvatarURL(i) + '" /> ' + (i == 'anyone' ? getLang('SHARING::ANONYMOUS') : i.escapeHTML()),
					perm: '<span>' + (arr[r] || arr['*']).escapeHTML() +'</span>',
					x: ''
				},
				arg: {user:i,rights:this.__aData[i]},
				css: Is.Array(this.__aData[i])?this.__aData[i].join(' '):''});
		}

	this.users._fill(aData);
};

_me.__save = function(){

	this.x_btn_ok._disabled(true);
	if (this.x_btn_inherit)
		this.x_btn_inherit._disabled(true);

	var d1 = clone(this.__aData,true),
		d2 = clone(this.__aData2,true);

	if (!Is.Empty(this.__aData)){
		for(var i in d2)
			if (d1[i] && arrayCompare(d2[i],d1[i]))
				delete d1[i];

		//No change, do not save
		if (Is.Empty(d1)){
			this.__success_handler();
			return;
		}
	}

	this.__aFolderInfo.acl = d1;
	if (this.__aFolderInfo.fid)
		WMFolders.add(this.__aFolderInfo,'null','',[this,'__success_handler'],[this,'__error_handler']);
	else
		WMAccounts.add(this.__aFolderInfo,'null','',[function(id, str){
			if (id)
				this.__error_handler(null, id, str);
			else
				this.__success_handler();

		}.bind(this)]);
};
