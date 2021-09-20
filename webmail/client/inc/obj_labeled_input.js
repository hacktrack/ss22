_me = obj_labeled_input.prototype;
function obj_labeled_input(){};

_me.__constructor = function(sTitle) {
	if (Is.Defined(sTitle))
	    this.label._value(sTitle);
};

_me._value = function(v) {
	return this.input._value(v);
};

_me._disabled = function(b)
{
	this.input._disabled(b);
};
