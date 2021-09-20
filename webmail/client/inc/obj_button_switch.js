_me = obj_button_switch.prototype;
function obj_button_switch() {}

_me.__constructor = function () {
	this.__value = 0;
	this.__width = 100;

	this._main.onclick = function (e) {
		var e = e || window.event,
			elm = (e.target || e.srcElement).parentNode;

		if (hascss(elm, 'button'))
			this._value(elm.getAttribute('iw-id'));

	}.bind(this);
};

// v  0|1|2|*
_me._value = function (v, bNoUpdate) {
	if (Is.Defined(v)) {
		v = +v;

		if (this.__value != v && !bNoUpdate) {

			var btn = this._getAnchor('buttons').querySelectorAll('.button');

			if (this.__value>0 && btn[this.__value-1]){
				removecss(btn[this.__value-1], 'active');
			}

			this.__value = v || 0;

			if (btn[v-1]){
				addcss(btn[v-1], 'active');
			}

			this.__updSlider();

			// onchange event
			this._onchange && this._onchange();
			this.__exeEvent('onchange', null, {"owner": this, value: this.__value});
		}
	} else {
		return this.__value;
	}
};

_me.__updSlider = function(){
	var sli = this._getAnchor('slider');
	sli.style[gui._rtl?'right':'left'] = (this.__width*(this.__value-1)) + '%';
	sli.style.width = this.__width + '%';
};

// aButtons array of buttons
_me._fill = function (aButtons) {
	if (Is.Array(aButtons)){
		var btn = this._getAnchor('buttons');

		btn.innerHTML = '';

		var len = aButtons.length;
		this.__width = Math.round(10000/len)/100;
		var rest = 100 - (this.__width*(len-1));

		for (var i = 0;i<len;i++) {
			btn.appendChild(mkElement('div', {
				className: 'button' + (this._value() === i + 1 ? ' active' : ''),
				'iw-id': i + 1,
				style: {
					width: (i + 1 === len ? rest : this.__width) + '%'
				}
			}, null, [mkElement('div', {
				text: getLang(aButtons[i]),
				className: 'label',
			})]));
		}

		this.__updSlider();
	}
};