_me = obj_attach_old.prototype;
function obj_attach_old(){};

_me.__constructor = function(sButtonValue){

	//<form name="{_ins}form" enctype="multipart/form-data" method="post" action="server/upload.php" target="{_ins}frame">
	this._main.setAttribute('enctype',"multipart/form-data");
	this._main.setAttribute('method',"post");
	this._main.setAttribute('action',"server/upload.php");
	this._main.setAttribute('target',this._pathName+'#frame');

	this.__idtable = [];

	this.__settings = {post_params:{sid:dataSet.get('main',['sid']),obj:this._pathName}};

	///// INIT Frame
	this.__eFrame = this._getAnchor('frame');
	if (this.__eFrame.contentWindow.stop)
		this.__eFrame.contentWindow.stop();
	else{
		var doc = this.__eFrame.contentDocument;
		if (typeof doc == 'undefined' || doc == null)
			doc = this.__eFrame.contentWindow.document;

		doc.execCommand('Stop');
		doc = null;
	}

	//init params
    this._setPostParam();
    
	//init File
	this.__initFile();

	if (sButtonValue)
		this._getAnchor('button').value = getLang(sButtonValue);
	else
		this.__eIN.title = getLang('ATTACHMENT::UPLOAD');

};

_me._disabled = function(b){
	if (Is.Defined(b)){
		this.__disabled = b?true:false;
		if (this.__eIN)
			this.__eIN.disabled = b;
	}
	else
		return this.__disabled;
};

_me.__initFile = function (bDisabled){
	var me = this;

	if (this.__eIN){
		this.__eIN.parentNode.removeChild(me.__eIN);
		this.__eIN = null;
	}

	this.__eIN = mkElement('input',{type:'file',name:'file',className:'file',size:1,tabindex:1000,disabled:bDisabled?true:false});
	this.__eIN.disabled = this.__disabled;
	this.__eIN.onchange  = function(){
		if (this.value){

			this.form.submit();

			if (me._onuploadstart)
			    me._onuploadstart(this.value);

            me.__initFile(1);
		}
	};

	this._getAnchor('file').appendChild(me.__eIN);
};

/**
 * PUBLIC: nastavi dalsi promene postu       OK
 **/
_me._setPostParam = function(name,value){
	if (name){
		if (typeof value == 'undefined')
        	delete this.__settings.post_params[name];
		else
			this.__settings.post_params[name] = value;
	}

	var ePost = this._getAnchor('post');
	    ePost.innerHTML = '';
	for(var i in this.__settings.post_params)
        ePost.appendChild(mkElement('input',{type:'hidden',name:i, value:this.__settings.post_params[i]}));
};

/**
 * SYSTEM: server vrati info o uploadnutem file     OK
 **/
_me._add = function(aArg){

    aArg.folder = this.__settings.post_params.folder;
	this.__idtable.push(aArg);

	if (this.__eIN && this.__eIN.disabled == true){
		this.__eIN.disabled = false;
	}

	if (this._onuploadsuccess)
		this._onuploadsuccess(aArg);

    if (this._onuploadend)
		this._onuploadend();
}
/**
 * SYSTEM: server vrati info o folder      OK
 **/
_me._setFolder = function(sFolder){
	if (sFolder)
		this._setPostParam('folder', WMItems.__serverID(String(sFolder)));
	else
		this._setPostParam('folder', Math.rand());
};
_me._getFolder = function (){
	return this.__settings.post_params['folder'];
};