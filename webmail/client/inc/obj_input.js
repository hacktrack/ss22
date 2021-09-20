/*****************************************************
 * Extension script: Input form object
 *
 * INHERITS FROM obj_form_generic
 *    _me._value
 *    _me._disabled
 *    _me.__update
 *
 * EVN: _onblur
 *      _onfocus
 *      _onsubmit
 *      _onclose
 *      _onerror
 *
 *****************************************************/

_me = obj_input.prototype;
function obj_input(){};

/**
 * @brief: CONSTRUCTOR, create input form object to __eIN variable
 * @date : 20.4.2006 17:24:21
 **/
_me.__constructor = function(){
    var me = this;

	this.__placeholder = '';

	/* creates ELM directly, because simlicity of object */
	this.__eIN = mkElement('input',{
				"type":'text',
				"name":this._pathName+'#main',
				"id":this._pathName+'#main',
				"className":this._type!='obj_input'?'obj_input '+this._type:'obj_input'
				});

	if (this._type == 'obj_password'){
		this.__eIN.setAttribute('type','password');
		AttachEvent(this.__eIN, 'onkeydown', function(e){
			var e = e || window.event,
				is_lowercase = /^[a-z]$/.test(e.key);

			if(is_lowercase === e.shiftKey && e.key.length === 1)
				addcss(this,'caps');
			else
				removecss(this,'caps');
		});
		this.__eIN.setAttribute('autocomplete',"new-password");
	} else {
		this.__eIN.setAttribute('autocomplete',"off");
	}

	this._main.appendChild(this.__eIN);

	// ONKEYUP
	this.__eIN.onkeyup = function(e){
		var e = e || window.event;
		if (me._onkeyup && me._onkeyup(e) == false) return false;
		me.__exeEvent('onkeyup',e,{"owner":me});
	};

	// KEY DOWN
	this.__eIN.onkeydown = function(e){
		var e = e || window.event;

		switch (e.keyCode) {
			// Enter
			case 13:
				//stop FFox download dialog
				if (e.ctrlKey){
					if (e.preventDefault) e.preventDefault();
					if (e.stopPropagation) e.stopPropagation();
					e.cancelBubble = true;
				}
				break;
			// Esc
			case 27:
				if (me._onclose && me._onclose(e) == false) return false;
				break;
			// Tab
			case 9 : break;
		}

		if (me._onkeydown && me._onkeydown(e) === false) return false;
        me.__exeEvent('onkeydown',e,{"owner":me});

		// Enter
		if (e.keyCode == 13 && me._onsubmit)
			setTimeout(function () {
				try {
					me._onsubmit({
						ctrlKey: e.ctrlKey
					});
				} catch (r) {
					gui._REQUEST_VARS.debug && console.log(this._name || false, r);
				}
			}, 0);

		return e.keyCode==13?false:true;
	};

	AttachEvent(this.__eIN, 'onkeyup', function(e){
		if (me._onchange) me._onchange();
		me.__exeEvent('change',null,{"owner":me});
	});
	AttachEvent(this.__eIN, 'onpaste', function(e){
		if (me._onchange) me._onchange();
		me.__exeEvent('change',null,{"owner":me});
	});
	AttachEvent(this.__eIN, 'oninput', function(e){
		if (me._onchange) me._onchange();
		me.__exeEvent('change',null,{"owner":me});
	});

	// ONFOCUS
	this.__eIN.onfocus = function(e){
		var e = e || window.event;
		me.__hasFocus = true;

		if (me.__placeholder && this.value == me.__placeholder){
			removecss(this,'placeholder');
            this.value = '';
		}

		if (me._onfocus) me._onfocus(e);
		me.__exeEvent('onfocus',e,{"owner":me});

		addcss(me._main, 'focus');

		return true;
	};

	// ONBLUR
	this.__eIN.onblur = function(e){
		var e = e || window.event;
        me.__hasFocus = false;

        if (me._type == 'obj_password')
			removecss(this,'caps');

		if (me.__placeholder && !this.value){
			addcss(this,'placeholder');
            this.value = me.__placeholder;
		}

		if (me._onblur && me._onblur(e) === false) return false;
		me.__exeEvent('onblur',e,{"owner":me});

		removecss(me._main, 'focus');

		return true;
	};

	this.__eIN.onclick = function(e){
		var e = e || window.event;

		if (me._onclick && me._onclick(e) === false)
			return false;

		me.__exeEvent('click',e,{"owner":me});
		return true;
	};

	this._main.onfocus = function(e){
		me._focus(true);
	};

	// Drag & Drop
	if (window.FormData){
		this.__eIN.addEventListener("drag", function(e){
			gui.frm_main.__filedrag = false;
		}, false);
		this.__eIN.addEventListener("dragstart", function(e){
			gui.frm_main.__filedrag = false;
		}, false);
		this.__eIN.addEventListener("dragend", function(e){
            gui.frm_main.__filedrag = true;
		}, true);
	}
};

_me._maxlength = function(i){
	if (Is.Defined(i)){
		if (i>0)
			this.__eIN.setAttribute('maxlength', i);
		else
			this.__eIN.removeAttribute('maxlength');
	}
	else
		return this.__eIN.getAttribute('maxlength') || 0;
};

_me._value = function(v,bSkipPH){
	if (Is.Defined(v)){

		this.__eIN.value = v;

		if (this.__restrictions && this.__restrictions.length)
			this.__check();

		if (!bSkipPH && this.__placeholder)
			if (this.__eIN.value.length>0)
				removecss(this.__eIN,'placeholder');
			else
			if (!this._hasFocus()){
				this.__eIN.value = this.__placeholder;
				addcss(this.__eIN,'placeholder');
			}

		this.__showMaskHelper();

		if (!bSkipPH){
			if (this._onchange) this._onchange();
			this.__exeEvent('change',null,{"owner":this});
		}
	}
	else
		return (this.__eIN.value == this.__placeholder?'':this.__eIN.value);
};

_me._readonly = function(b){
	if (Is.Defined(b)){
		this.__eIN.readOnly = b;
		if (b)
			addcss(this._main,'readonly');
		else
			removecss(this._main,'readonly');
	}
	else
		return this.__eIN.readOnly?true:false;
};

_me._hasFocus = function(){
	return this.__eIN.__hasFocus;
};

_me._getCartPos = function(){
	// Get cursor position
	if("selectionStart" in this.__eIN)
		return this.__eIN.selectionStart;
	else
	// old MSIE
	if (document.selection) {
		this.__eIN.focus();
		var r = document.selection.createRange().duplicate();
			r.moveEnd('character', this.__eIN.value.length);

		return r.text == ''?this.__eIN.value.length:this.__eIN.value.lastIndexOf(r.text);
	} else
		return 0;
};

_me._setRange = function(pos1,pos2){
	pos1 = pos1 || 0;

	try{
		// MSIE
		if (document.selection && this.__eIN.createTextRange){
			var r = this.__eIN.createTextRange();
			r.collapse(true);
			r.moveStart("character", pos1);
			if (pos2) r.moveEnd("character", pos2);
			r.select();
		}
		// OTHERS
		else
			this.__eIN.setSelectionRange(pos1, pos2 || pos1);
	}
	catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r) }

	this._focus(true);
};

_me._select = function() {
	this._setRange(0,this.__eIN.value.length);
};


_me._placeholder = function(str){
	//compatibility
	if (typeof this.__eIN.placeholder == 'undefined'){
		if (!this.__eIN.value || this.__placeholder == this.__eIN.value){
			this.__placeholder = str;
			if (this._hasFocus()){
				removecss(this.__eIN,'placeholder');
				this.__eIN.value = '';
			}
			else{
				this.__eIN.value = this.__placeholder;
				addcss(this.__eIN,'placeholder');
			}
		}
	}
	//HTML5
	else
		this.__eIN.placeholder = str;
};

/**
 * Mouse over MASK images
 *
 * aButtons param
 *      ID:[<ico url>,<title>,<show state>]
 *          <show state>	0 = onShow
 *                          1 = onHide
 *                          2 = always
 **/

_me.__setMask = function(aButtons,aHandler,bMouseDown){
	if (aButtons){

		this.__mask_size = [0,0]; //[<show width>,<hide width>]

		if (!this.__mask){
			this._main.appendChild((this.__mask = mkElement('div',{'className':'mask_container'})));
			this._obeyEvent('change',[this,'__showMaskHelper']);
			this._obeyEvent('onkeyup',[this,'__showMaskHelper']);
		}
		else
			this.__mask.innerHTML = '';

		var elm;
		for (var i in aButtons){
			elm = mkElement('a',{'href':'',rel:i,title:aButtons[i][1] || ''});
			elm.innerHTML = aButtons[i][0];

			switch (parseInt(aButtons[i][2] || 0)){
				case 1:
					elm.className = 'hide';
					this.__mask_size[1] += 16;
					break;
				case 2:
					elm.className = 'always';
					this.__mask_size[1] += 16;
				default:
					this.__mask_size[0] += 16;
					break;
			}

			this.__mask.appendChild(elm);
		}

		if (this.__mask_size[0])
			this.__mask_size[0] += 5;
		if (this.__mask_size[1])
			this.__mask_size[1] += 5;

		if (aHandler){
			var me = this;
			var mouse_down = false;
			var timeout;

			var event_handler = function(e){
				var e = e || window.event,
					elm = e.target || e.srcElement;

				if (timeout)
					clearTimeout(timeout);

				if (e.preventDefault) e.preventDefault();
				if (e.stopPropagation) e.stopPropagation();
				e.cancelBubble = true;

				if (!me._destructed){
					if (elm.tagName === 'A' && elm.rel)
						executeCallbackFunction(aHandler,elm.rel,me);

					timeout = setTimeout(function() {
						!me._destructed && mouse_down && event_handler(e);
					}, 175);
				}

				return false;
			};

			if (bMouseDown) {
				this.__mask.onmousedown = function(e) {
					mouse_down = true;
					event_handler(e);
				};
				this.__mask.onmouseup = function(e) {
					mouse_down = false;
				};
				this.__mask.onmouseout = function(e) {
					mouse_down = false;
				};

			} else {
				this.__mask.onclick = event_handler;
			}
		}
	}
	else
	if (this.__mask){
		this.__mask.removeChild(this.__mask);
		this.__eIN.style[gui._rtl?'paddingLeft':'paddingRight'] = '';
		this._disobeyEvent('change',[this,'__showMaskHelper']);
		this._disobeyEvent('onkeyup',[this,'__showMaskHelper']);
	}
};
_me.__showMask = function(){
	if (this.__mask){
		addcss(this.__mask,'show');

		this.__mask.style.width = this.__mask_size[0] + 'px';
		this.__eIN.style[gui._rtl?'paddingLeft':'paddingRight'] = (this.__mask_size[0] + 10) + 'px';
	}
};
_me.__hideMask = function(){
	if (this.__mask){
		removecss(this.__mask,'show');

		this.__mask.style.width = this.__mask_size[1] + 'px';
		this.__eIN.style[gui._rtl?'paddingLeft':'paddingRight'] = (this.__mask_size[1] + 10) + 'px';
	}
};
_me.__showMaskHelper = function(){
	if (this._value())
		this.__showMask();
	else
		this.__hideMask();
};
