_me = obj_slider.prototype;

function obj_slider() {}

_me.__constructor = function (aValues) {
	var isIE = document.documentMode || /Edge/.test(navigator.userAgent);
	this.__slider = this._getAnchor('slider');
	this.__slider.addEventListener(isIE ? 'change' : 'input', function() {
		this._value(this._aValues[this.__slider.value].value);
	}.bind(this));
	aValues && this._fill(aValues);
	this._getAnchor('before').addEventListener('click', function() {
		var v = this._aValues[+this.__slider.value - 1];
		v && this._value(v.value);
	}.bind(this));
	this._getAnchor('after').addEventListener('click', function() {
		var v = this._aValues[+this.__slider.value + 1];
		v && this._value(v.value);
	}.bind(this));
	this._main.className += isIE ? ' IE' : '';
};

_me._value = function (v, bNoSave) {
	if (!Is.Defined(v)) {
		return this.__value;
	}

	if (this.__value != v) {
		var i = false;
		for(i in this._aValues) {
			if(this._aValues[i].value == v) {
				break;
			}
		}
		if(i !== false) {
			this.__slider.value = i;
			this.__value = v;

			if (this._onchange)
				this._onchange(this.__value, bNoSave);
			this.__exeEvent('onchange', null, {
				"owner": this
			});
		}
	}
};

_me._fill = function (aValues) {
	if (aValues){
		this._aValues = aValues;
		this.__slider.setAttribute('min', 0);
		this.__slider.setAttribute('max', this._aValues.length - 1);
	}
	else
		return this._aValues;
};