_me = obj_upload_edit.prototype;
function obj_upload_edit(){};

_me.__constructor = function(sAttLabel,sDropLabel){

	//Context menu PREDELAT NA .LIST
	this.__hasRename = true;
	this.__hasRemove = true;
	this.__hasRemoveAll = true;

	var me = this;

	this._create('list','obj_upload_list','list','', this.file.__dropzones.length>0, sAttLabel, sDropLabel);
	this.__idtable = this.list.__idtable;
	this.list.__hasRename = this.__hasRename;
	this.list.__hasRemove = this.__hasRemove;
	this.list.__hasRemoveAll = this.__hasRemoveAll;
	this.list._onchange = function(){
		if (me._onchange)
			me._onchange();
	};

	////// FILE //////
	this.file._onuploadsuccess = function(file){
		me._add(file);
	};
	this.file._onuploadstart = function (){
		if (me._onuploadstart)
			me._onuploadstart();
	};
	this.file._onuploadend = function (){
		if (me._onuploadend)
			me._onuploadend();
	};
	this.file._onuploadprogress = function (){
		if (me._onuploadprogress)
			me._onuploadprogress.apply(me, arguments);
	};
};

_me._remove = function (id){
	this.list._remove(id);
};

_me._rename = function (id){
	this.list._rename(id);
};

_me._add = function(aArg){
	if(this._destructed)
		return;

	aArg.folder = this.file._getFolder();
	if (this.list._add(aArg) && this._onuploadsuccess)
		this._onuploadsuccess(aArg);
};

/**
 * PUBLIC                                OK;
 **/
_me._value = function(v){
	if (typeof v == 'undefined')
		return this.list._value();
	else{
		if (v.path)
	        this.file._setFolder(v.path);

	    if (v.values)
	    	this.list._value(v);
	}
};


_me._dropzone = function(elm, body, css, callback) {
	this.file._dropzone(elm, body, css, callback);

	// Add "Drop Here" placeholder
	//if (this.file.__dropAnchor){
	if (this.file.__dropzones.length>0){
		this.list.__dropSupport = true;

	 	var list = this.list._getAnchor('list');
	 	if (list.getElementsByTagName('SPAN').length<1)
	 	 	this.list._getAnchor('list').innerHTML = '<i>'+ this.list.__labels[1] +'</i>';
	}
};

_me._disabled = function(b){
	if (Is.Defined(b)){
		this.__disabled = b?true:false;
		this.file._disabled(this.__disabled);
	}
	else
		return this.__disabled;
};

_me._getName = function(id) {
	return this.list._getName(id);
};
_me._getSize = function(id) {
	return this.list._getSize(id);
};
