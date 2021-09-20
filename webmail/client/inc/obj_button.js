/*****************************************************
 * Extension script: TextArea form object
 *
 * INHERITS FROM obj_form_generic
 *    _me._value
 *    _me._disabled
 *    _me.__update
 *
 *****************************************************/

_me = obj_button.prototype;
function obj_button(){};

/**
* @brief: CONSTRUCTOR, create button HTML element to __eIN variable
* @date : 20.4.2006 17:24:21
**/
_me.__constructor = function(){
	/* creates ELM directly, because simlicity of object */
	this.__eIN = mkElement('input',{"type":'button',"name":this._pathName+'#main',"id":this._pathName+'#main'});
	this._main.appendChild(this.__eIN);
	this.__eIN.className = this._type == 'obj_button'?'obj_button':'obj_button ' + this._type;

	var me = this;

	/*** ADD EVENTS ***/
	this.__eIN.onclick = this._main.onclick = function (e){
		var e = e || window.event,
			elm = e.target || e.srcElement;

		if (this == elm){
			if (!me._disabled()){
				if (elm == me._main)
					me._focus();

				if (me._onclick)
					me._onclick(e);
			}
			return false;
		}
	};

	// ONFOCUS
	this.__eIN.onfocus = function(e){
		var e = e || window.event;
		me.__hasFocus = true;

		if (me._onfocus) me._onfocus(e);
		me.__exeEvent('onfocus',e,{"owner":me});

		addcss(me._main, 'focus');
		return true;
	};

	// ONBLUR
	this.__eIN.onblur = function(e){
		var e = e || window.event;
		me.__hasFocus = false;

		if (me._onblur && me._onblur(e) === false) return false;
		me.__exeEvent('onblur',e,{"owner":me});

		removecss(me._main, 'focus');
		return true;
	};


	this._main.oncontextmenu = function(e){
		var e = e || window.event;

		if (me._oncontext && me._oncontext(e) !== false)
			me.__exeEvent('oncontext',e,{"owner":me});

		return false;
	};

	this._main.onkeydown = function(e){
		var e = e || window.event;
		if (!me._disabled() && me._onkeypress)
			me._onkeypress(e);

		return true;
	};
};

_me._value = function(sValue){
	return this.__eIN.value = sValue?getLang(sValue):this.__eIN.value;
};

_me._text = function(sValue){
	if (Is.String(sValue))
		this.__eIN.value = sValue;
	else
		return this.__eIN.value || '';
};

_me._title = function(sValue){
	if (Is.String(sValue))
		this._main.title = this.__eIN.title = (sValue.indexOf('::')!=-1 ? getLang(sValue) : sValue);
	else
		return this.__eIN.title || '';
};

_me._active = function(b){
	if (b === true)
		addcss(this._main, 'active');
	else
	if (b === false)
		removecss(this._main, 'active');
	else
		return hascss(this._main, 'active');
};