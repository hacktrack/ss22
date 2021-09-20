
_me = obj_smart_input.prototype;
function obj_smart_input(){};

/**
 * @brief: CONSTRUCTOR, create input form object to __eIN variable
 * @date : 20.4.2006 17:24:21
 **/
_me.__constructor = function(){
    var me = this;

	this.__placeholder = '';

	/* creates ELM directly, because simlicity of object */
	this.__eIN = mkElement('div');
	this._main.appendChild(this.__eIN);
	this._readonly(false);

	// ONKEYUP
	this.__eIN.onkeyup = function(e){
		var e = e || window.event;
		if (me._onkeyup && me._onkeyup(e) == false) return false;
		me.__exeEvent('onkeyup',e,{"owner":me});
	};

	// KEY DOWN
	this.__eIN.onkeydown = function(e){
		var e = e || window.event;

//console.log(e.keyCode);

		switch (e.keyCode) {
			case 8:
				//FFox sometime looses focus during [backspace]
				me._focus();
				break;

			// "Q" key for test
			case 81:

				//document.execCommand("insertHTML", false, '<span></span>');

				if (window.getSelection) {
					var sel = window.getSelection();
					if (sel.getRangeAt && sel.rangeCount) {
						range = sel.getRangeAt(0);
						range.deleteContents();

						//Always BR
						var node = document.createElement('SPAN');
							node.contentEditable = false;
							node.innerHTML = 'ahoj';

						range.insertNode(node);
						range.setStartAfter(node);
						range.setEndAfter(node);
					}
				}

				return false;

			// Enter
			case 13:

				// if (e.ctrlKey){
				// 	if (e.preventDefault) e.preventDefault();
				// 	if (e.stopPropagation) e.stopPropagation();
				// 	e.cancelBubble = true;
				// }

				if (window.getSelection) {
					var sel = window.getSelection();
					if (sel.getRangeAt && sel.rangeCount) {
						range = sel.getRangeAt(0);
						range.deleteContents();

						var node = document.createTextNode("\r\n");
						range.insertNode(node);
						range.setStartAfter(node);
						range.setEndAfter(node);

						//Cursor fix
						var node = document.createTextNode("");
						range.insertNode(node);
						range.setStartAfter(node);
						range.setEndAfter(node);
					}
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
		if (e.keyCode == 13 && e.ctrlKey && me._onsubmit)
			setTimeout(function () {
				try {
					me._onsubmit({
						ctrlKey: true
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
		e.preventDefault();
		if (e.clipboardData && e.clipboardData.getData) {
			var text = e.clipboardData.getData("text/plain");
			document.execCommand("insertHTML", false, text);
		}
		else
		if (window.clipboardData && window.clipboardData.getData) {
			var text = window.clipboardData.getData("Text");
			insertTextAtCursor(text);
		}

		if (me._onchange) me._onchange();
		me.__exeEvent('change',null,{"owner":me});
	});

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

        if (me._type == 'obj_password')
			removecss(this,'caps');

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

	this._main.onfocus = function(er){
		me._focus(true);
	};

	/// SMART PASTE ///
	function insertTextAtCursor(text) {
		var sel, range;

		if (window.getSelection) {
			sel = window.getSelection();
			if (sel.getRangeAt && sel.rangeCount) {
				range = sel.getRangeAt(0);
				range.deleteContents();
				range.insertNode(document.createTextNode(text));
			}
		}
		else
		if (document.selection && document.selection.createRange)
			document.selection.createRange().text = text;
	};
};

//OK
_me._value = function(v){
	if (Is.Defined(v)){
		var v = v.replace(/<br[^>]*>/gi,"\r\n").trim();

		this.__eIN.innerHTML = v;

		if (this.__restrictions && this.__restrictions.length)
			this.__check();

		if (this._onchange) this._onchange();
		this.__exeEvent('change',null,{"owner":this});
	}
	else
		return this.__eIN.innerHTML.replace(/<br[^>]*>/gi,"\r\n").trim();
};

//OK
_me._placeholder = function(str){

	this.__placeholder = str;

	if (str){
		if (!this.__ePH){
			this.__ePH = mkElement('div',{className:'placeholder'});
			this._main.appendChild(this.__ePH);

			this._obeyEvent('change',[this,'__helper_ph']);
		}

		this.__ePH.innerHTML = str;
	}
	else
	if (this.__ePH){
		this._disobeyEvent('change',[this,'__helper_ph']);
		this.__ePH.parentNode.removeChild(this.__ePH);
	}

	this.__helper_ph();
};
	_me.__helper_ph = function(){
		if (this.__placeholder && this._value() === "")
			addcss(this._main,'placeholder');
		else
			removecss(this._main,'placeholder');
	};

//OK
_me._hasFocus = function(){
	return this.__eIN.__hasFocus;
};

//OK
_me._readonly = function(b){

	if (Is.Defined(b)){
		this.__eIN.contentEditable = !b;

		if (!!b)
			addcss(this._main,'readonly');
		else
			removecss(this._main,'readonly');
	}
	else
		return this.__eIN.contentEditable?false:true;
};

//OK
_me._select = function() {
	var range = document.createRange();
		range.selectNode(this.__eIN);

	var sel = window.getSelection();
		sel.removeAllRanges();
		sel.addRange(range);
};

//OK
_me._getCartPos = function(){

    var caretOffset = 0;

    if (this._hasFocus()){

		var element = this._main,
			doc = element.ownerDocument || element.document,
			win = doc.defaultView || doc.parentWindow,
			sel, range, preCaretRange;

		if (typeof win.getSelection != "undefined") {
			sel = win.getSelection();
			if (sel.rangeCount) {
				range = sel.getRangeAt(0);
				preCaretRange = range.cloneRange();
				preCaretRange.selectNodeContents(element);
				preCaretRange.setEnd(range.endContainer, range.endOffset);
				caretOffset = preCaretRange.toString().length;
			}
		}
		//IE<11
		else
		if ( (sel = doc.selection) && sel.type != "Control") {
			range = doc.selection.createRange();
			preCaretRange = doc.body.createTextRange();
			preCaretRange.moveToElementText(element);
			preCaretRange.setEndPoint("EndToEnd", textRange);
			caretOffset = preCaretTextRange.text.length;
		}
	}

    return caretOffset;
};




//OK (doesnt work between rows)
_me._setRange = function(pos1,pos2){
	pos1 = pos1 || 0;

    var range = document.createRange();

    try{
    	range.setStart(this.__eIN.firstChild, pos1);
		range.setEnd(this.__eIN.firstChild, pos2);
	}
	catch(r){
		range.selectNode(this.__eIN);
	}

	var sel = window.getSelection();
		sel.removeAllRanges();
		sel.addRange(range);

	this._focus(true);
};