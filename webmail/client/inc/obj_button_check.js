/*****************************************************
 * Extension script: TextArea form object
 *
 * INHERITS FROM obj_form_generic
 *    _me._value
 *    _me._disabled
 *    _me.__update
 *
 *****************************************************/

_me = obj_button_check.prototype;
function obj_button_check(){};

/**
* @brief:
* @date : 30.4.2013 17:24:21
**/
_me.__constructor = function(){
	var me = this;
	this.__checked = false;

	/*** ADD EVENTS ***/
	this.__eIN.onclick = this._main.onclick = function (e){
		var e = e || window.event,
			elm = e.target || e.srcElement;

		if (this == elm){
			if (!me._disabled()){
				if (elm == me._main)
					me._focus();

				me._checked(!me._checked());

				if (me._onclick)
					me._onclick(e);
			}
			return false;
		}
	};

	AttachEvent(this.__eIN, 'onkeydown', function(e){
		var e = e || window.event,
			elm = e.target || e.srcElement;

		if (this == elm && !me._disabled()){
			if (me._onkeypress)
				me._onkeypress(e);
		}
	});
};

_me._checked = function(v){
	if (Is.Defined(v)){
		if ((this.__checked = v?true:false))
			addcss(this._main,'active');
		else
			removecss(this._main,'active');
	}
	else
		return this.__checked;
};