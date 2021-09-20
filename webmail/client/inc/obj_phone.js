_me = obj_phone.prototype;
function obj_phone() {
	this.__disabled = false;
};

_me.__constructor = function(){

	//pole jiz vyplnenych telefonu (editace)
	this.__data = {};
	var aData = storage.aStorage.language['PHONE'];

	var me = this;

	this.PHNTYPE._fill(aData);
	this.PHNTYPE._onchange = function(){
		var data = me._listener?dataSet.get(me._listener,me._listenerPath):this.__data;
		if (data){
			if (this._value() == 'SIP'){
				if (data.LCTPHNOTHER && data.LCTPHNOTHER.toLowerCase().indexOf('sip:')==0)
					me.PHNNUMBER._value(data.LCTPHNOTHER.substring(data.LCTPHNOTHER.indexOf(':')+1),true);
				else
					me.PHNNUMBER._value('',true);
			}
			else
				me.PHNNUMBER._value(data[this._value()] || '',true);

		}

		me.PHNNUMBER._sms(this._value() == 'LCTPHNMOBILE');
	};

	this.PHNNUMBER.inp._onblur = function(){
		if (!me._destructed){
			var n = me.PHNTYPE._value(),
				v = me.PHNNUMBER._value() || '';

			if (n == 'SIP'){
				n = 'LCTPHNOTHER';

				if (v.length)
					v = 'sip:'+v;
			}

			if (me._listener)
				dataSet.add(me._listener, (me._listenerPath || []).concat(n), v);
			else
				me.__data[n] = v;
		}
	};
};

_me.__update = function(sDSName, aDSPath){

	var t = this.PHNTYPE._value();
		t = t == 'SIP'?'LCTPHNOTHER':t;

	if (aDSPath && aDSPath.slice(-1)[0] === t){
		var n = dataSet.get(this._listener,(this._listenerPath || []).concat(t));
		if (n != this.PHNNUMBER._value())
			this.PHNNUMBER._value(n || '', true);
	}
};

_me._value = function(sName,aData) {

	if (sName) {

		if (typeof aData == 'object')
			this.__data = aData;

		if (sName == 'LCTPHNOTHER' && (this.__data[sName] || '').toLowerCase().indexOf('sip:')==0)
			this.PHNTYPE._value('SIP',true);
		else
			this.PHNTYPE._value(sName.toUpperCase(),true);

		this.PHNTYPE._onchange();
	}
	else
		return {PHNTYPE:this.PHNTYPE._value(),PHNNUMBER:this.PHNNUMBER._value(),DATA:this._listener?dataSet.get(this._listener,this._listenerPath):this.__data};
};

_me._readonly = function(bReadOnly) {
	if (typeof bReadOnly == "undefined")
		return this.__readonly;
	else{
		this.__readonly = bReadOnly?true:false;
		this.PHNTYPE._disabled(bReadOnly);
		this.PHNNUMBER._readonly(bReadOnly);
	}
};

_me._disabled = function(bDisable) {
	if (typeof bDisable == "undefined")
		return this.__disabled;
	else{
		this.__disabled = bDisable?true:false;
		this.PHNTYPE._disabled(bDisable);
		this.PHNNUMBER._disabled(bDisable);
	}
};

//Pass tabindexes to nasted objects
_me._tabIndex = function(sContainer,i,oDock){
	this.PHNNUMBER._tabIndex(sContainer,i,oDock);
	this.PHNTYPE._tabIndex(sContainer,i?++i:i,oDock);
};
_me._focus = function (b){
	return this.PHNNUMBER._focus(b);
};