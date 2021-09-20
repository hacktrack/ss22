/*****************************************************
 *	Object for multiple input fields (text, number, email fields, ...)
 *
 * 	Set values as an array, each item will be filled
 *  into a sepatare field. Reading value will return
 * 	array with the values of all contained fields.
 * 
 *	Martin Ekblom 2018
 *
 *****************************************************/

_me = obj_input_multiple.prototype;
function obj_input_multiple(){};

_me.__constructor = function(){
	this.__value = undefined;
	this.__num = 0;
	this.__type = 'text';

	var parent = this._main.parentNode;
	parent.removeChild(this._main);
	this._main = parent;
};

_me._add = function(v) {
	var me = this;

	var num = this.__num++;
	var aliasName = this._name+'_'+num;
	var alias = this._pathName+'#'+aliasName;

	var elm = mkElement('div',{id:alias});
		addcss(elm,'form-row');

	this._main.appendChild(elm);

	this._create(aliasName,'obj_input_'+this.__type,aliasName);
	var input = this[aliasName];
	if(this.__placeholder) {
		input._placeholder(this.__placeholder);
	}
	if(this.__label) {
		input._label(this.__label,true);
	}
	if(v instanceof IWAPI.Value) {
		input._setValue(v);
	} else if(v) {
		input._value(v);
	}

	var valuelist = this.__value;
	// Remove whole input if empty
	input.__eIN.addEventListener('blur',function(e) {
		if(input.__eIN.value=="") {
			valuelist.splice(num,1);
			input._destruct();
			elm.parentNode.removeChild(elm);
		}
	},true);
	// Monitor changes
	input.__eIN.addEventListener('input',function(e) {
		valuelist[num] = this.value;
		me._onchange && me._onchange(valuelist);
	},true);

}

//_me._remove = function(num) {}

_me._value = function(v){
	if(v===null) {
		this.__value = null;
	//	this.__eIN.value = "";
	} else
	if(v instanceof Array) {
		this.__value = v;
		for(var i=0, l=v.length; i<l; i++) {
			this._add(v[i]);
		}
	} else
	if(typeof v == 'string') {
		this.__value = [v];
		this._add([v]);
	}

	return this.__value;
};

_me._setValue = function(apiprop) {
	this.__value = [];
	this.__apivalue = apiprop;
	for(var i=0, l=apiprop.length; i<l; i++) {
		this._add(apiprop[i]);
		this.__value.push(apiprop[i].value);
	}
}

_me._type = function(sType) {
	this.__type = sType;
}

_me._label = function(sLabel) {
	this.__label = sLabel;
	return this.__label;
}

_me._placeholder = function(sText) {
	this.__placeholder = sText;
	return this.__placeholder;
}
