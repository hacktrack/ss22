_me = obj_input_email.prototype;
function obj_input_email(){
	this.__disabled = false;
};

_me.__constructor = function(){
	this._create('inp','obj_input','','obj_input_100');
	this._create('btn','obj_button','','simple ico img');
	this.btn._onclick = function (){
		if(this.__disabled) return;

		var mail = this._parent.inp._value();
		if (mail)
			NewMessage.compose({to:mail});
	};
};

_me._disabled = function(bDisable) {
	if(typeof bDisable!="boolean")
		return this.__disabled;
	else {
		this.__disabled = bDisable;
		this.inp._disabled(bDisable);
		this.btn._disabled(bDisable);
	}
}

_me._readonly = function(b){
	return this.inp._readonly(b);
};

_me._value = function (v){
	return this.inp._value(v);
};

_me._getFocusElement = function (){
	return this.inp._getFocusElement();
};
_me._focus = function (b){
	return this.inp._focus(b);
};
