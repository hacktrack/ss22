/*****************************************************
 *	Byte input with units object
 *
 * 	Automatically converts value with units to
 * 	real value based on the base unit
 *****************************************************/

_me = obj_input_bytes.prototype;
function obj_input_bytes(){};

obj_input_bytes._units = ['b','kb','mb','gb','tb','pb'];

obj_input_bytes._unitlabels = {
	b: getLang('generic::size_b'),
	kb: getLang('generic::size_kb'),
	mb: getLang('generic::size_mb'),
	gb: getLang('generic::size_gb'),
	tb: getLang('generic::size_tb'),
	pb: getLang('generic::size_pb')
};

obj_input_bytes._unitmap = {b: 0, kb: 1, mb: 2, gb: 3, tb: 4, pb: 5};


/**
* @brief: CONSTRUCTOR
* @date : 23.1.2018
**/
_me.__constructor = function(){
	this.__eIN.setAttribute('type','number');

	this.__baseunit = 1;	// By default use kB as lowest unit
	this.__maxunit = 4;		// By default use TB as highest unit

	var change = function(e) {
		var v = parseFloat(this.__eIN.value);
		var u = obj_input_bytes._unitmap[this._dropdown._value()]-this.__baseunit;
		var v = v * Math.pow(1024,u);
		if(isNaN(v)) {
			v = '';
		}
		this.__apivalue.value = v;
	}.bind(this);
	this.__eIN.addEventListener('input',change,true);
	this.__eSE.addEventListener('change',change,true);

	this._refill();
};

_me._setValue = function(data){
	var me = this;
	this.__apivalue = data;

	function split(v,u) {
		var pow = 1024;
		var max = me.__maxunit - me.__baseunit;
		u = u || 0;
		if(v>=pow && max>u) {
			if(u === 0) {
				v = Math.round(v);
			}
			return split(v/1024,++u);
		} else {
			return {value: v, unit: u};
		}
	}

	// Disable input for readonly values
	if(data.readonly) {
		this._readonly(true);
	}

	// Hide field with access denied
	if(data.denied) {
		this._main.setAttribute('is-hidden','1');
	}

	if(data.value==0) {
		this.__eIN.value = '';
	} else {
		// @todo: undefined value, check for data.default
		var bytes = parseInt(data.value);
		if(!isNaN(bytes)) {
			bytes = split(bytes);
			this.__eIN.value = bytes.value;
			this._dropdown._value(obj_input_bytes._units[bytes.unit+this.__baseunit]);
		}
	}
	
};

_me._getValue = function(){
	return this.__apivalue;
};

_me._refill = function() {
		// Fill byte units labels for dropdown
		var units = {};
		for(var i=this.__baseunit, j=this.__maxunit; i<=j; i++) {
			units[obj_input_bytes._units[i]] = obj_input_bytes._unitlabels[obj_input_bytes._units[i]];
		}
		this._dropdown._fill(units);
}

_me._baseunit = function(unit) {
	unit = unit.toLowerCase();
	this.__baseunit = obj_input_bytes._unitmap[unit];
	this._refill();
}

_me._maxunit = function(unit) {
	unit = unit.toLowerCase();
	this.__maxunit = obj_input_bytes._unitmap[unit];
	this._refill();
}
