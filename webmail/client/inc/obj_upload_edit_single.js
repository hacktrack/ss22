_me = obj_upload_edit_single.prototype;
function obj_upload_edit_single(){};

_me.__constructor = function(){
	////// FILE //////
	this.file._setFileQueueLimit(1);
	this.file._setMultipleSelection(false);

	this.__hasRemoveAll = false;
};

_me._add = function(aArg){

	if (this.__idtable.length>0)
	    this._remove();

	aArg.folder = this.file._getFolder();

	if (this.list._add(aArg) && this._onuploadsuccess)
		this._onuploadsuccess(aArg, id);
};