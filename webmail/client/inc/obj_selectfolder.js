_me = obj_selectfolder.prototype;
function obj_selectfolder() {};

_me.__constructor = function(bOneAccount, sFolderType, sFilterRights, bFilterPublic, bForceShowFolderIcons)
{
	var me = this;
	this.__value = '';
	this.__primaryOnly = bOneAccount; 
	this.__folderTypes = sFolderType || '';
	this.__folderRights = sFilterRights;

	this._create('path','obj_button','main', 'ico '+(this.__folderTypes.split(',').map(function(ft) {
		return 'type_' + ft;
	}).join(' ')));

	this.path._onclick = function(){
		var aPath = Path.split(me.__value);
		gui._create('select_folder', 'frm_select_folder', '', '', 'SELECT_FOLDER::SELECT_FOLDER', aPath[0], aPath[1], [me, '__callback'], true, me.__primaryOnly, me.__folderTypes, me.__folderRights, false, undefined, bFilterPublic, bForceShowFolderIcons);
	}
};

_me.__callback = function(sAccount, sFolder) {
	if (sAccount && sFolder){

		//onbeforechange Event
		if (this.__value && this._onbeforechange)
			this._onbeforechange(this.__value, sAccount+'/'+sFolder);

		this.__value = sAccount+'/'+sFolder;
		
		var name = dataSet.get('folders', [sAccount, sFolder, 'NAME']);
		if(name) {
			sFolder = sFolder.split('/');
			sFolder.pop();
			sFolder = sFolder.join('/') + '/' + name;
		}
		this.path._text((this.__primaryOnly?'':sAccount+'/') + translateFolder(sFolder));
		this.path._title(sAccount+'/' + translateFolder(sFolder),true);

		//onchange Event
		if (this._onchange)
			this._onchange(this.__value);
	}
};

_me._setType = function(s){
	if (s){
		this.__folderTypes = s;

		var css = 'obj_button ico';
		if (Is.String(s))
			css += ' type_' + s;

		this.path._main.className = css;
	}		
};

_me._setRight = function(s){
	if (Is.Defined(s))
		this.__folderRights = s;
};

_me._value = function(v) {
	if (v) {
		var aPath = Path.split(v);
		this.__callback(aPath[0], aPath[1]);
	}
	else
		return this.__value;
};

_me._disabled = function(b){
	return this.path._disabled(b);
};
