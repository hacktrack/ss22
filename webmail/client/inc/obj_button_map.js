_me = obj_button_map.prototype;
function obj_button_map(){};

_me.__constructor = function (){
	this._title(getLang('FORM_BUTTONS::MAP_IT'));
};

_me._onclick = function(){
	var v = this._value();
	if (v)
		this._showmap(v);
};

_me._value = function(data){
	if (typeof data == 'undefined'){
		if (Is.String(this.__address))
			return this.__address;
		else
		if (Is.Object(this.__address))
			return executeCallbackFunction(this.__address);

		return '';
	}	
	else	
		this.__address = data;
};

_me._showmap = function (v){
	gui._create('map','frm_gmap','','', v, this._callback_function);
};