/*****************************************************
 * Extension script: TextArea form object
 *
 * INHERITS FROM obj_form_generic
 *    _me._value
 *    _me._disabled
 *    _me.__update
 *
 * @Date: 16.4.2006 16:33:51
 *****************************************************/

_me = obj_text.prototype;
function obj_text(){};

/**
 * @brief: CONSTRUCTOR, create textarea form object to __eIN variable
 * @date : 20.4.2006 17:24:21
 **/
_me.__constructor = function(bWrap){

	this.__placeholder = '';

	var me = this;

	this.__eIN = mkElement('textarea',{"name":this._pathName+'#main',"id":this._pathName+'#main'});

	if (bWrap)
		this.__eIN.setAttribute('wrap','off');

	this._main.appendChild(this.__eIN);
	this.__eIN.className = this._type;

	this.__eIN.onclick = function(e){
		var e = e || window.event;
		if (me._onclick) me._onclick(e);

		me.__exeEvent('onclick',e,{"owner":me});
		return true;
	};

	this.__eIN.onpaste = function(e){
		var e = e || window.event;
		if (me._onpaste) me._onpaste(e);

		me.__exeEvent('onpaste',e,{"owner":me});
		return true;
	};

	// ONFOCUS
	this.__eIN.onfocus = function(e){
		var e = e || window.event;
		me.__hasFocus = true;
		addcss(me._main, 'focus');

		if (me.__placeholder && this.value == me.__placeholder){
			removecss(this,'placeholder');
			this.value = '';
		}

		if (me._onfocus) me._onfocus(e);
		me.__exeEvent('onfocus',e,{"owner":me});
		return true;
	};

	// ONBLUR
	this.__eIN.onblur = function(e){
		var e = e || window.event;
		me.__hasFocus = false;
		removecss(me._main, 'focus');

		if (me.__placeholder && !this.value){
			addcss(this,'placeholder');
            this.value = me.__placeholder;
		}

		if (me._onblur) return me._onblur(e);
		me.__exeEvent('onblur',e,{"owner":me});
		return true;
	};

	// KEY DOWN
	this.__eIN.onkeydown = function(e){
		var e = e || window.event;

		if (me._onsubmit && e.keyCode == 13 && e.ctrlKey) {
			//stop FFox download dialog
			if (e.preventDefault) e.preventDefault();
			if (e.stopPropagation) e.stopPropagation();
			e.cancelBubble = true;

			setTimeout(function(){me._onsubmit()},0);
			return false;
		}
		else
		if (me._onclose && e.keyCode == 27)
			me._onclose(e);

		if (me._onkeydown && me._onkeydown(e) === false) return false;
        me.__exeEvent('onkeydown',e,{"owner":me});
		return true;
	};

	// KEY DOWN
	this.__eIN.onkeyup = function(e){
		var e = e || window.event;

		if (me._onkeyup && me._onkeyup(e) === false) return false;
        me.__exeEvent('onkeyup',e,{"owner":me});
		return true;
	};

	this._main.onfocus = function(er){
		me._focus(true);
	};
};

_me._readonly = function(b){
	this.__eIN.readOnly = b;

	if (b)
		addcss(this.__eIN,'readonly');
	else
		removecss(this.__eIN,'readonly');
};
_me._hasFocus = function(){
	return this.__eIN.__hasFocus;
};

_me._nowrap = function(b){
	this.__eIN.setAttribute('wrap',b?'off':'soft');
};


//stejne pro obj_text i obj_input
_me._setRange = function(pos1,pos2){
	pos1 = pos1 || 0;

	/* MSIE */
	if (document.selection){
		var r = this.__eIN.createTextRange();
		r.collapse(true);
		r.moveStart("character", pos1);
		if (pos2) r.moveEnd("character", pos2);
		r.select();

		this._focus(true);
	}
	/* OTHERS */
	else{
		this._focus(true);
		this.__eIN.setSelectionRange(pos1, pos2 || pos1);
	}
};

_me._getCartPos = function(){
	// Get cursor position
	if("selectionStart" in this.__eIN)
		return this.__eIN.selectionStart;
	else
	// only IE8
	if (document.selection) {
		this.__eIN.focus();
		var r = document.selection.createRange().duplicate();
			r.moveEnd('character', this.__eIN.value.length);

		return r.text == ''?this.__eIN.value.length:this.__eIN.value.lastIndexOf(r.text);
	} else
		return 0;
};

_me._value = function(v,bSkipPH, _, callback){
	if (typeof v != 'undefined'){

		this.__eIN.value = v;

		if (!bSkipPH){
			if (this.__restrictions && this.__restrictions.length)
				this.__check();

			if (this.__placeholder)
				if (v)
		            removecss(this.__eIN,'placeholder');
				else{
	                this.__eIN.value = this.__placeholder;
					addcss(this.__eIN,'placeholder');
				}
		}

		// If child object defines resize method, adjust size to new content
		if (this.__resize)
			this.__resize();

		// Cause change event if defined
		if (!bSkipPH){
			if (this._onchange) this._onchange();
			this.__exeEvent('change',null,{"owner":this});
		}
		callback && callback();
	}
	else
		return this.__eIN.value == this.__placeholder?'':this.__eIN.value.replace(/(\r\n|\r|\n)/gm,'\r\n');
};

_me._placeholder = function(str){
	//compatibility
	if (typeof this.__eIN.placeholder == 'undefined'){
		if (this.__placeholder && this.__placeholder == this.__eIN.value){
			removecss(this.__eIN,'placeholder');
			this.__eIN.value = '';
		}

		this.__placeholder = str;

		if (!this.__eIN.value && !this._hasFocus()){
			this.__eIN.value = this.__placeholder;
			addcss(this.__eIN,'placeholder');
		}
	}
	//HTML5
	else
		this.__eIN.placeholder = str;
};
