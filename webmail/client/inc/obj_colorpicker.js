_me = obj_colorpicker.prototype;
function obj_colorpicker(){};

_me.__constructor = function() {

	var me = this;

	this.__value = [0,0,0.5]; //HSL COLOR

	this.__eCross = this._getAnchor('cross');
	this.__ePallete = this._getAnchor('palette');

	this.__eLight = this._getAnchor('light');
	this.__eArrow = this._getAnchor('arrow');

	this.__ePallete.onmousedown = function(e){
		var e = e || window.event;
		
		this.__size = getSize(this);
		gui._obeyEvent('mouseup', [me,'_disobey_movecolor']);
		gui._obeyEvent('mousemove', [me,'_movecolor']);

		me._movecolor(e);
	};

	this.__eLight.onmousedown = function(e){
		var e = e || window.event;

		this.__size = getSize(this);
		gui._obeyEvent('mouseup', [me,'_disobey_movelight']);
		gui._obeyEvent('mousemove', [me,'_movelight']);

		me._movelight(e);
	};

	this.r._range(0,255);
	this.g._range(0,255);
	this.b._range(0,255);

	this._value('#888888');

	this.r._onchange = function(){
		me._rgb_value([me.r._value(),me.g._value(),me.b._value()]);
	};
	this.g._onchange = function(){
		me._rgb_value([me.r._value(),me.g._value(),me.b._value()]);
	};
	this.b._onchange = function(){
		me._rgb_value([me.r._value(),me.g._value(),me.b._value()]);
	};

	this._getAnchor('standard').onclick = function(e){
		var e = e || window.event,
			elm = e.target || e.srcElement;

		if (elm.getAttribute('rel'))
			me._value(elm.getAttribute('rel'))
	};

	this.rgb._restrict('^#[0-9a-f]{6}$',true);
	this.rgb._onchange = function(e){
		if (this._checkError.length == 0)
			me._value(this._value());
	};
};

_me._movecolor = function(){
	var x = gui.__X - this.__ePallete.__size.x,
		y = gui.__Y - this.__ePallete.__size.y;

		x = x>0?(x<this.__ePallete.__size.w?x:this.__ePallete.__size.w):0;
		y = y>0?(y<this.__ePallete.__size.h?y:this.__ePallete.__size.h):0;

		this._hsl_value([x/this.__ePallete.clientWidth, (this.__ePallete.clientHeight-y)/this.__ePallete.clientHeight]);
};
	_me._disobey_movecolor = function(){
		gui._disobeyEvent('mousemove', [this,'_movecolor']);
		return false;
	};

_me._movelight = function(){
	var y = gui.__Y - this.__eLight.__size.y;
		y = y>0?(y<this.__eLight.__size.h?y:this.__eLight.__size.h):0;

	var l = (this.__eLight.__size.h - y)/this.__eLight.__size.h;

	this._hsl_value(['','',l]);
};
	_me._disobey_movelight = function(){
		gui._disobeyEvent('mousemove', [this,'_movelight']);
		return false;
	};

_me._rgb_value = function(v){
	if (Is.Array(v)){
		var hsl = colors.rgb2hsl(v[0],v[1],v[2]);
		this._hsl_value([hsl[0], hsl[1], hsl[2]]);
	}
	else
		return colors.hsl2rgb(this.__value[0],this.__value[1],this.__value[2]);
};
_me._hsl_value = function(v){
	if (Is.Array(v)){

		var old = this._value();

		//set value
		if (Is.Number(v[0]))
			this.__value[0] = v[0];
		if (Is.Number(v[1]))
			this.__value[1] = v[1];
		if (Is.Number(v[2]))
			this.__value[2] = v[2];
		
		//palette
		this.__eCross.style.left = (this.__value[0]*this.__ePallete.clientWidth - this.__eCross.offsetWidth/2) + 'px';
		this.__eCross.style.bottom = (this.__value[1]*this.__ePallete.clientHeight - this.__eCross.offsetHeight/2) + 'px';

		//lightnes
		var c = colors.hsl2rgb(this.__value[0],this.__value[1],0.5),
			regEx = /^(\d{1})$/g;

		this.__eLight.style.background = '#' + c[0].toString(16).replace(regEx,'0$1') + c[1].toString(16).replace(regEx,'0$1') + c[2].toString(16).replace(regEx,'0$1');
		this.__eArrow.style.bottom = (this.__value[2] * this.__eLight.clientHeight - this.__eArrow.offsetHeight/2) + 'px';
		

		c = this._value();
		if (old == c) return;
		
		//Set Inputs
		var rgb = this._rgb_value();
		this.r._value(rgb[0], true);
		this.g._value(rgb[1], true);
		this.b._value(rgb[2], true);
		this.rgb._value(c, true);
		this._getAnchor('color').style.background = c;
	}
	else
		this.__value;
};

_me._value = function(v){

	//RGB Hex
	if (Is.String(v)){

		if (v.indexOf('#') === 0)
			v = v.substr(1);

		this._rgb_value([parseInt(v.substring(0,2),16), parseInt(v.substring(2,4),16), parseInt(v.substring(4,6),16)]);
	}
	else{
		var rgb = this._rgb_value(),
			regEx = /^(\d{1})$/g;
		return '#' + rgb[0].toString(16).replace(regEx,'0$1') + rgb[1].toString(16).replace(regEx,'0$1') + rgb[2].toString(16).replace(regEx,'0$1');
	}
};