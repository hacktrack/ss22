_me = obj_input_url.prototype;
function obj_input_url(){
	this.__disabled = false;
};

_me.__constructor = function(bText){
	var me = this;
	this._features = 'toolbar=1,menubar=1,status=1,location=1,scrollbars=1';

	if (bText)
		this._create('inp','obj_text');
	else
		this._create('inp','obj_input','','obj_input_100');
		
	this.inp._onclick = function(){
		if (me._onclick && !me.__disabled)
			me._onclick();
	};

	this._create('btn','obj_button','','simple ico img');
	this.btn._onclick = function (){
		if(me.__disabled) return;

		var url = this._parent.inp._value();
		if (url){
            if (url.indexOf('://')<0)
                url = 'http://'+url;
            
			window.open(url,'',me._features);
		}
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

//Input
_me._value = function (v){
	return this.inp._value(v);
};
_me._readonly = function (b){
	return this.inp._readonly(b);
};
_me._setRange = function(pos1,pos2){
	return this.inp._setRange(pos1,pos2);
};

//Focus
_me._getFocusElement = function (){
	return this.inp._getFocusElement();
};
_me._focus = function (b){
	return this.inp._focus(b);
};