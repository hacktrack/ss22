_me = obj_categories.prototype;
function obj_categories() {};

_me.__constructor = function() {
	this.button._onclick = function() {
		gui._create('categories', 'frm_categories', '', '', this.input._value(), [this, '__callback']);
	}.bind(this);
};

_me.__callback = function(sText) {
	this.input._value(sText);
};

_me._value = function(v) {
	if (v)
		this.input._value(v);
	else
		return this.input._value(v);
};

//Focus
_me._getFocusElement = function (){
	return this.input._getFocusElement();
};
_me._focus = function (b){
	return this.input._focus(b);
};

_me._readonly = function(b){
	this.button._disabled(b);
	this.input._readonly(b);
};