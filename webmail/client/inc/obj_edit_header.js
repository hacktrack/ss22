_me = obj_edit_header.prototype;
function obj_edit_header() {};

_me.__constructor = function() {
	var me = this;
	this.__aValues = '';

	this._create('button','obj_button');
	this.button._value('FILTERS::THREE_DOTS');
	this.button._onclick = function(){
		gui._create('edit_header', 'frm_edit_header', '', '', me);
	};
};

_me._value = function(v) {
	if (Is.Defined(v))
		this.__aValues = v;
	else
		return this.__aValues;
};

_me._disabled = function(b){
	this.button._disabled(b);
};