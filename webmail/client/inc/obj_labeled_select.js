_me = obj_labeled_select.prototype;
function obj_labeled_select(){};

_me.__constructor = function(sTitle) {
	if (Is.Defined(sTitle))
	    this.label._value(sTitle);
};

_me._value = function(v) {
	return this.select._value(v);
};

_me._disabled = function(b){
	this.select._disabled(b);
};

//Focus
_me._getFocusElement = function (){
	return this.select._getFocusElement();
};
_me._focus = function (b){
	return this.select._focus(b);
};