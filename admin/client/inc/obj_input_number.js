/*****************************************************
 * Extension script: TextArea form object
 *
 * INHERITS FROM obj_form_generic
 *    _me._value
 *    _me._disabled
 *    _me.__update
 *
 *****************************************************/

_me = obj_input_number.prototype;
function obj_input_number(){};

/**
* @brief: CONSTRUCTOR, create input HTML element to __eIN variable
* @date : 20.4.2006 17:24:21
**/
_me.__constructor = function(){
	this.__eIN.setAttribute('type','number');

	this.__eIN.addEventListener('keydown',function(e){
		switch(e.key) {
			case '-':
				if(!this.__allow_negative) {
					e.preventDefault();
				}
				break;
			case '.':
				if(!this.__allow_decimal) {
					e.preventDefault();
				}
				break;
			case 'e':
				e.preventDefault();
				break;
		}
	},true);

	this.__eIN.addEventListener('input',function(e){
		this.value = this.value.replace(/[^0-9]/g,'');
	},true);
};

_me._allowNegative = function(bAllow) {
	this.__allow_decimal = bAllow;
}

_me._allowDecimal = function(bAllow) {
	this.__allow_decimal = bAllow;
}

_me._value = function(sValue,donotclear){
	if(sValue===null) {
		this.__value = null;
		this.__eIN.value = "";
	} else
	if(typeof sValue != 'undefined') {
		sValue = sValue.toString().replace(/ /g,'');

		this.__value = sValue;

		this.__eIN.value = sValue==0 ? '' : sValue;

		this._changed(donotclear?false:true);
		if(this._onchange){
			this._onchange();
		}
	}

	var v = this.__eIN.value;
	if(v=="" || isNaN(parseFloat(v))) {
		return null;
	} else {
		return v;
	}

};