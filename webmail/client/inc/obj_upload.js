_me = obj_upload.prototype;
function obj_upload(){};

_me.__constructor = function(sButtonValue, noFlash){
	var me = this;

	////// INIT upload //////
	this.__idtable = [];

	// multiple file support (FFox 4+, Chrome 11)
	if (window.FormData){
		this._create('file','obj_attach_multiple','main',sButtonValue?'':'img',sButtonValue);
		this.__info = this.file._getAnchor('info');
	}
	else{
		this._create('file','obj_attach_old','main',sButtonValue?'':'img',sButtonValue);
	}

	//Zacalo se uploadovat
	this.file._onuploadstart = function (){
		me.__idtable = [];

		me._info_show();
		if (me._onuploadstart)
			me._onuploadstart();
	};

	//[FLASH] Soubor se stahuje
	this.file._onuploadprogress = function(file,a,b,xhr){

		me._info_progress(file, Math.min(100, a/(b/100)));

		if (me._onuploadprogress)
			me._onuploadprogress(file,a,b,xhr);
	};

	this.file._onuploadaborted = function(){
		if (me._onuploadaborted)
			me._onuploadaborted();
	};

	//Pribyl soubor
	/*
	HTTP
	.. [id](string) = 4b1z719aa80f0
	.. [name](string) = 156.jpg
	.. [size](string) = 17933
	.. [folder](string) = 2009-12-08-4b1z71962660d
	*/
	this.file._onuploadsuccess = function(file){
		me.__idtable.push(file);
		if (me._onuploadsuccess)
			me._onuploadsuccess(file);
	};

	//Upload skocil
	this.file._onuploadend = function (){
		me._info_hide();
		if (me._onuploadend)
			me._onuploadend(me.__idtable);
	};

	//DropZone Anchor
	this._add_destructor('__destructor');
};

_me._setPostParam = function (sName,sVal){
	if (this.file._setPostParam)
		this.file._setPostParam(sName,sVal);
};

_me._getFolder = function (){
	return this.file._getFolder();
};
_me._setFolder = function (sFolder){
	this.file._setFolder(sFolder);
};

_me._setFileQueueLimit = function (i){
	if (this.file._setFileQueueLimit)
		this.file._setFileQueueLimit(i);
};
_me._setMultipleSelection = function (b){
	if (this.file._setMultipleSelection)
		this.file._setMultipleSelection(b);
};
_me._setFileTypes = function (sTypes, sDescription){
	if (this.file._setFileTypes)
		this.file._setFileTypes(sTypes, sDescription);
};

//Progress
_me._info_show = function(){
	if (this.__info)
		this.__info.style.display = 'block';
};

_me._info_progress = function(file,i){
	if (this.__info){
		this.__info.style.backgroundPosition = ((this.__info.clientWidth/100)*i-300)+'px';
		document.title = getLang('UPLOAD::TITLE',[file.name, Math.ceil(parseInt(i,10))]);
	}
};

_me._info_hide = function(){
	if (this.__info){
		this.__info.style.display = 'none';
		gui.frm_main.title._reset();
	}
};

_me.__destructor = function (){
	if (this.__info)
		gui.frm_main.title._reset();
};

_me._disabled = function(b){
	if (this.file._disabled)
		return this.file._disabled(b);
};

_me._value = function (){
	return {
		path:this._getFolder(),
		values:this.__idtable
	};
};
_me._click = function(){
	if (!this.file.__eIN || (this.file._disabled && this._disabled()))
		return;

	this.file.__eIN.click();
};
_me._reset = function(bFolder){
	this.__idtable = [];
	if (bFolder)
		this._setFolder = '';
};
/**
 * Drag & Drop Upload HTML 5
 * 29.6.2011 15:44:38
 * @import: dropzone.js
 **/
_me.__ondropfile = function(aFiles,aHandler){
	if (window.FormData && this.file.__ondropfile)
		this.file.__ondropfile(aFiles,aHandler);
};