_me = obj_sharing.prototype;
function obj_sharing() {};

_me.__constructor = function(sPrivate) {
	this.__privateValue = sPrivate || 'P';
	this._create('btn','obj_button_check','main','ico img private simple noborder transparent');
	this.btn._title('SHARING::PRIVATE');
};

_me._value = function(v) {
	if (Is.Defined(v)) {
		if (v === true || v == this.__privateValue || v == 'C' || v == 'P')
			this.btn._checked(true);
		else
			this.btn._checked(false);
	}
	else
		return (this.btn._checked()) ? this.__privateValue : 'U';
};

_me._disabled = function(b){
	return this.btn._disabled(b);
};