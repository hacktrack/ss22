_me = obj_upload_info.prototype;
function obj_upload_info(){};

_me.__constructor = function(aAbortHandler){
	this.__eSize = this._getAnchor('size');
	this.__eName = this._getAnchor('name');

	this._create('progress', 'obj_progress','','noborder max transparent simple mono');

	this._getAnchor('close').onclick = function(){
		if (this.__handler)
			executeCallbackFunction(this.__handler);
	}.bind(this);
};

_me._value = function(oName, iDone, iSize, aAbortHandler){
	this.__eName.innerText = oName;
	this.__updateSize(iDone, iSize);
	this._handler(aAbortHandler);
};

_me._handler = function(aAbortHandler){
	this.__handler = aAbortHandler;
};

_me.__updateSize = function(iDone,iSize){

	iDone = Math.min(iDone, iSize);

	var p = iDone/(iSize/100);

	this.__eSize.innerText = getLang('UPLOAD::SIZE_INFO', [Math.floor(p), parseFileSize(iDone), parseFileSize(iSize)]);

	this.progress._value(p);
};