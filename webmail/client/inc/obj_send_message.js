_me = obj_send_message.prototype;
function obj_send_message() {};

_me.__constructor = function() {
	var me = this;
	this.__aValues = {};

    this._create('button','obj_button');
	this.button._value('FILTERS::THREE_DOTS');
	this.button._onclick = function(){
		gui._create('send_message', 'frm_send_message', '', '', me.__aValues);
	};
};

_me._value = function(v) {
	if (Is.Defined(v))
		this.__aValues = clone(v);
	else
		return this.__aValues;
};

_me._disabled = function(b){
	this.button._disabled(b);
};