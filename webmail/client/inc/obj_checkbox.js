/*****************************************************
 * Extension script: CheckBox form object, supports only boolean values!
 *
 * INHERITS FROM obj_form_generic
 *    _me._disabled
 *    _me.__update
 *
 *****************************************************/

_me = obj_checkbox.prototype;
function obj_checkbox(){};

	/**
	 * @brief: CONSTRUCTOR, create checkbox HTML element to __eIN variable
	 * @date : 20.4.2006 17:46:08
	 **/
	_me.__constructor = function(sTitle){
		var me = this;

		//:after doesnt work properly in MSIE8
		this._main.appendChild(mkElement('span'));

		// creates ELM directly, because simlicity of object
		this.__eIN = mkElement('input',{"type":'checkbox',"name":this._pathName+'#main',"id":this._pathName+'#main'});
		this._main.appendChild(this.__eIN);
		this.__eIN.value = true;

		if (Is.Defined(sTitle)) this._title(sTitle);

		this.__eIN.onclick = function(e){
			var b = true,
				e = e || window.event;

			if (me._onclick) b = me._onclick(e);
			me.__exeEvent('onclick',e,{"owner":me});

			if (b === false)
				return false;

			window[this.checked?'addcss':'removecss'](me._main,'checked');

			if (me._onchange) me._onchange(e);
			me.__exeEvent('onchange',e,{"owner":me});

			return true;
		};

		// ONFOCUS
		this.__eIN.onfocus = function(e){
			addcss(me._main, 'focus');
		};
		// ONBLUR
		this.__eIN.onblur = function(e){
			removecss(me._main, 'focus');
		};

		this._main.onclick = function(e) {
			if (me.__eIN.disabled)
				return false;

			var b = true,
				e = e || window.event,
				elm = e.target || e.srcElement;

			if (elm.tagName == 'SPAN' || elm.tagName == 'LABEL'){

				//Warning _value() has old checked state!
				if (me._onclick) b = me._onclick(e);
				me.__exeEvent('onclick',e,{"owner":me});

				if (b !== false){
					me._checked(!me._checked());
					me._focus(true);

					if (me._onchange) me._onchange(e, me._checked());
					me.__exeEvent('onchange',e,{"owner":me});
				}
			}
		};
	};

	/**
	 * @brief : control element's "checked" html method
	 * @param : b - boolean value
	 * @return: bool;
	 * @date  : 20.4.2006 17:42:24
	 **/
	_me._value = function(b, bNoUpdate){
		var old = this._checked(),
			b = this._checked(b);

		if (!bNoUpdate && old != b){
			if (this._onchange) this._onchange(void 0, this._checked());
			this.__exeEvent('onchange',null,{"owner":this});
		}

		return b?1:0;
	};

	_me._checked = function(b){
		if (Is.Defined(b)){
			if (Is.String(b)) b = parseInt(b,10);
			this.__eIN.checked = b?1:0;

			window[this.__eIN.checked?'addcss':'removecss'](this._main,'checked');
		}

		return this.__eIN.checked?true:false;
	};

	_me._title = function(sTitle){
		var eLbl = this._main.getElementsByTagName('label');
			eLbl = eLbl[0] || false;

		if (sTitle){
			if (!eLbl){
				eLbl = mkElement('label',{className:'unselectable'}); //,{"for":this.__eIN.id} somehow doesnt work on checkbox in contextemu
				this._main.appendChild(eLbl);
			}

			this.__title = sTitle;
			eLbl.innerHTML = getLang(sTitle);
		}
		else
		if (typeof sTitle != 'undefined'){
			if (eLbl) eLbl.parentNode.removeChild(eLbl);
			this.__title = '';
		}

		eLbl = null;
		return this.__title;
	};
