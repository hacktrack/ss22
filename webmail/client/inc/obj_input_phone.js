_me = obj_input_phone.prototype;
function obj_input_phone(){
	this.__disabled = false;
};

_me.__constructor = function(){
	this._create('inp','obj_input','','obj_input_100');

	if (sPrimaryAccountSIP && (GWOthers.getItem('RESTRICTIONS', 'disable_sip') || 0)<1){
		this._create('btn','obj_button','','simple ico img');
		this.btn._onclick = function (){
			if(this.__disabled) return;

			//var aPhones = {};
			var	num = this._parent.inp._value();

			if (num){
				gui.frm_main._call(num);
				/*
			    aPhones[num] = num;
				gui._create('dial','frm_dial','','',this._parent.__email,aPhones);
				*/
			}
		};
	}
};


_me._value = function (v){
	return this.inp._value(v);
};

_me._disabled = function(bDisable) {
	if (typeof bDisable == "undefined")
		return this.__disabled;
	else {
		this.__disabled = bDisable?true:false;
		this.inp._disabled(bDisable);
	}
}

_me._sms = function(b){
	if (b && sPrimaryAccountSMS && (GWOthers.getItem('RESTRICTIONS', 'disable_sms') || 0)<1){
		if (!this.btn2){
			addcss(this._main,'sms');
			this._create('btn2','obj_button','','simple ico img sms')._onclick = function (){
				var num = this._parent.inp._value();
				if (num)
					NewMessage.compose({sms:num});
			};
		}
	}
	else
	if (this.btn2){
		removecss(this._main,'sms');
		this.btn2._destruct();
	}	
};

_me._readonly = function(b){
	return this.inp._readonly(b);
};

_me._value = function (v){
	return this.inp._value(v);
};

//FOCUS
_me._getFocusElement = function (){
	return this.inp._getFocusElement();
};
_me._focus = function (b){
	return this.inp._focus(b);
};