_me = obj_multistate_switch.prototype;

function obj_multistate_switch() {}

_me.__constructor = function (values, callback) {
	values && this._fill(values);
	var me = this;

	var radio_down = false;
	this._getAnchor('radios').addEventListener('mousedown', function (e) {
		var elm = e.target || e.srcElement;

		if (hascss(elm, 'radio'))
			radio_down = true;
	});
	this._getAnchor('radios').addEventListener('mouseup', function (e) {
		var elm = e.target || e.srcElement;


		if (hascss(elm, 'radio') && radio_down)
			me._value(elm.getAttribute('data-value'));
		radio_down = false;

	});
	this._getAnchor('minus').addEventListener('click', function (e) {
		var prev = me._getAnchor('radios').querySelector('div.radio.active').previousSibling;
		if (prev) {
			me._value(prev.getAttribute('data-value'));
		}
	});
	this._getAnchor('plus').addEventListener('click', function (e) {
		var next = me._getAnchor('radios').querySelector('div.radio.active').nextSibling;
		if (next) {
			me._value(next.getAttribute('data-value'));
		}
	});
};

_me._value = function (v, bNoSave) {
	if (Is.Defined(v)) {
		if (this.__value != v) {

			var active = this._main.querySelector('div.radio.active');
			if(active) {
				active.className = active.className.replace('active', '');
			}
			this._getAnchor('radios').querySelector('div.radio[data-value="' + v + '"]').className += ' active';

			this.__value = '' + v;

			// onchange event
			if (this._onchange)
				this._onchange(this.__value, bNoSave);
			this.__exeEvent('onchange', null, {
				"owner": this
			});
		}
	} else {
		return this.__value;
	}
};

// aButtons array of buttons
_me._fill = function (aRadios) {
	if (!Is.Array(aRadios)) return;

	while (this._getAnchor('radios').firstChild) {
		this._getAnchor('radios').removeChild(this._getAnchor('radios').lastChild);
	}

	for (var i in aRadios) {
		var radio = mkElement('div', {
			'data-value': aRadios[i].value,
			name: this._name + '-radio',
			title: aRadios[i].title,
			'class': 'radio'
		});
		this._getAnchor('radios').appendChild(radio);
	}
};
