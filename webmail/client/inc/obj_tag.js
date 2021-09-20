_me = obj_tag.prototype;
function obj_tag(){}

/**
 * @brief: CONSTRUCTOR
 * @date : 29.1.2013
 **/
_me.__constructor = function(){
	var me = this;

	this.__tagFocus = null;
	this.__plus_placeholder = '';
	this.__collapse_limit = 2;

	this.__etag = this._getAnchor('tag');
	this.__etag.onclick = function(e){
		if (me._readonly() || this.__collapsed) {return true}

		var e = e || window.event,
			elm = e.target || e.srcElement;

		switch(elm.tagName)	{
			case 'SPAN':

				if (me._scrollbar){
					me._focusTag(elm);

					e.cancelBubble = true;
					try{e.preventDefault()}catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r)}
					try{e.stopPropagation()}catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r)}
					return false;
				} else {
					me._focusTag(elm);
				}

				break;

			case 'EM':
				me._focusNextTag(elm);
				if ((elm = elm.parentNode)) {elm.parentNode.removeChild(elm)}

				if (me._onchange) {me._onchange()}
				me.__exeEvent('onchange',e,{'owner':me});
				break;

			case 'B':
				if ((elm = elm.parentNode)){
					me._focusTag(elm);

					if (me._onexpand) {me._onexpand(elm)}

					me.__exeEvent('onexpand',e,{'owner':me, elm:elm});

					e.cancelBubble = true;
					try{e.preventDefault()}catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r)}
					try{e.stopPropagation()}catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r)}
					return false;
				}

				break;
		}
	};


	this.__etag.ondblclick = function(e){
		var e = e || window.event,
			elm = e.target || e.srcElement;

		switch(elm.tagName)	{
			case 'SPAN':
				me._editTag(elm);
				break;
		}
	};


	this._main.onclick = function(e){
		var e = e || window.event,
			elm = e.target || e.srcElement;

		if (elm.tagName != 'INPUT') {me._focus()}

		//me.__exeEvent('click',e);
	};

	this._readonly(false);
};

_me._value = function(v, bCollapse, sCollapsedLang){

	if (Is.Defined(v)){

		bCollapse = bCollapse && this.plus;

		//cancel edit, clean up
		this._editTag();
		this.__etag.innerHTML = '';

		//fill new values
		var aVal = this._decode(v), c = 0;
		for (var i in aVal){
			//collapse part 1
			if (bCollapse && c && !this.__collapsed){
				aVal[i].css = (aVal[i].css?' ':'') + 'collapsed';
			}

			this._addTag(aVal[i]);
			c++;
		}

		if (this.__collapsed){
			this._expandInput();
		} else
		//collapse part 2
		if (bCollapse && c>this.__collapse_limit){
			this.__collapsed = true;
			addcss(this._main, 'collapsed');
			this._placeholder(getLang(sCollapsedLang || 'CHAT::REACTIONS_BUBBLE', [--c]), true);

			this.plus._obeyEvent('onfocus',[function(){
				this._expandInput();
				return false;
			}.bind(this)]);
		}

		if (this._onChange){
			var iHash = this.__etag.innerHTML.hashCode();
			if (this.__lastHash !== iHash){
				this._onChange();
				this.__lastHash = iHash;
			}
		}
	} else{
		var a = this.__etag.getElementsByTagName('SPAN'),
			aTags = [];

		for (var i = 0; i<a.length; i++) {aTags.push(a[i].getAttribute('val'))}

		return this._encode(aTags);
	}
};

_me._expandInput = function(){
	if (this.__collapsed){
		[].map.call(this._main.querySelectorAll('SPAN.tag.collapsed'), function(a){
			removecss(a,'collapsed');
		});

		this._placeholder(this._placeholder());
		this.__collapsed = false;
		removecss(this._main, 'collapsed');
	}
};

_me._readonly = function(b){

	if (Is.Defined(b)){
		if (!(this.__readonly = b?true:false)){

			removecss(this._main,'readonly');

			if (!this.plus){
				this._create('plus','obj_input_dynamic','plus','ico plus');
				this.plus.__eIN.setAttribute('placeholder', this._placeholder());

				this.plus._value('');

				//For obj_tag
				this.plus._obeyEvent('onkeydown', [this,'__inpKey'], true);
				this.plus._obeyEvent('onblur', [this,'__inpBlur'], true);

				//For obj_suggest
				this.plus._obeyEvent('onfocus',[this,'__inpEvent_plus']);
				this.plus._obeyEvent('onblur',[this,'__inpEvent_plus']);
				this.plus._obeyEvent('onkeyup',[this,'__inpEvent_plus']);
				this.plus._obeyEvent('click',[this,'__inpEvent_plus']);

				//bubble evn
				var me = this;
				this.plus._onkeydown = function(e){
					if (me._onkeydown && me._onkeydown(e) === false) {return false}

					me.__exeEvent('onkeydown', e);
				};
				this.plus._onsubmit = function(e){ if (me._onsubmit) {return me._onsubmit(e)} };
			}
		} else{
			addcss(this._main,'readonly');
			this._focusTag(null);

			if (this.plus) {this.plus._destruct()}
		}
	} else {return this.__readonly}
};

_me._placeholder = function(s, bTmp){
	if (Is.String(s)){
		if (!bTmp) {this.__plus_placeholder = s}

		this.plus && this.plus.__eIN && this.plus.__eIN.setAttribute('placeholder', s);
	} else {return this.__plus_placeholder}
};

_me._disabled = function(b){
	return this._readonly(b);
};

_me._getFocusedInput = function(){
	return this.edit || this.plus;
};

_me._getFocusElement = function (){
	var o = this._getFocusedInput();
	if (o) {return o.__eIN}
};
_me._focus = function(){
	if (this.plus) {return this.plus._focus()}
};

_me._getCartPos = function(){
	var inp = this._getFocusedInput();
	return inp && inp._getCartPos?inp._getCartPos():0;
};

_me._focusTag = function(elm){
	if (typeof elm != 'undefined' && (!this.__readonly || elm == null)){

		if (this.__tagFocus && this.__tagFocus.parentNode){
			if (this.__tagFocus === elm) {return} else {removecss(this.__tagFocus,'active')}
		}

		if (elm != null){
			addcss(elm,'active');
			this.__tagFocus = elm;

			//Scroll to
			if (elm && this._scrollbar){
				var ec = this._getAnchor('container'),
					p1 = getSize(ec),
					p2 = getSize(elm);

				if (p2.y<p1.y) {ec.scrollTop -= p1.y-p2.y} else
				if (p2.y+p2.h>p1.y+p1.h) {ec.scrollTop += p2.y+p2.h - p1.y-p1.h}
			}
		}
	}

	if (this.__tagFocus!= null && !this.__tagFocus.parentNode) {this.__tagFocus = null}

	return this.__tagFocus;
};

_me._focusNextTag = function(elm){
	var elm = elm || this._focusTag();

	if (elm && (elm = elm.nextSibling)) {return this._focusTag(elm)} else {return this._focusTag(null)}
};
_me._focusPrevTag = function(elm){
	var elm = elm || this._focusTag();

	if (elm == null) {
		if ((elm = this.__etag.lastChild)) {return this._focusTag(elm)} else {return null}
	}

	if (elm && (elm = elm.previousSibling)) {return this._focusTag(elm)}
};


// @Input format: {tag:<tag>[, label:<text>, css:<className>, bgcolor:<#FFFFFF>, color:<#FFFFFF>]}
_me._addTag = function(aTag, elm){
	if (aTag.tag){

		if (!elm){
			elm = mkElement('SPAN',{className:'tag'});
			this.__etag.appendChild(elm);
		} else {elm.className = 'tag'}

		if (aTag.css) {addcss(elm, aTag.css)}

		if (aTag.err) {addcss(elm,'error')}

		elm.innerHTML = (aTag.label || aTag.tag).escapeHTML();
		elm.setAttribute('val', aTag.tag);

		if (aTag.expand){
			addcss(elm,'expand');
			elm.appendChild(mkElement('B'));
		}

		if (!this.__readonly) {elm.appendChild(mkElement('EM'))}

		elm.style.backgroundColor = aTag.bgcolor || '';
		elm.style.color = aTag.color || '';

		if (this._onchange){
			this._onchange();
		}

		this.__exeEvent('onchange',null,{'owner':this});
	}
};

/////////////////////////////////////////

// Listen to events for inherited objects
_me.__inpEvent = function(e,arg){
	if (e.type == 'focus'){
		this.__hasFocus = true;
		addcss(this._main, 'focus');
	} else
	if (e.type == 'blur'){
		this.__hasFocus = false;
		removecss(this._main, 'focus');
	}

	this.__exeEvent('on'+e.type,e,arg);
};
_me.__inpEvent_plus = function(e,arg){
	if (e.type == 'keyup' && this.plus._value().length) {this._focusTag(null)}

	this.__inpEvent(e,arg);
};

// Input Handling
_me.__inpBlur = function(e,arg){
	if (this.edit && arg.owner === this.edit) {this.edit._onsubmit()} else {this.__inpKey({keyCode:13},arg)}
};

_me.__inpKey = function(e,arg){
	switch(e.keyCode){
		//F2 Edit
		case 113:
			var elm;
			if (this.plus._value() == '' && (elm = this._focusTag())) {this._editTag(elm)}

			e.cancelBubble = true;
			try{e.preventDefault()}catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r)}
			try{e.stopPropagation()}catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r)}

			break;
		//Backspace
		case 8:
			if (this.plus._value() == ''){
				var elm = this._focusPrevTag();
				if (elm){
					this._focusNextTag(elm);
					elm.parentNode.removeChild(elm);

					if (this._onchange) {this._onchange()}
					this.__exeEvent('onchange',null,{'owner':this});
				}
			}
			break;

		//delete
		case 46:
			var elm;
			if (this.plus._value() == '' && (elm = this._focusTag())){
				this._focusNextTag(elm);
				elm.parentNode.removeChild(elm);

				if (this._onchange) {this._onchange()}
				this.__exeEvent('onchange',null,{'owner':this});
			}
			break;

		//Enter
		case 13:
			var v = this.plus._value();
			if (v){
				this.plus._value('');

				var a = this._decode(v);
				for (var i in a) {this._addTag(a[i])}
			}
			break;

		//esc
		case 27:

			//close suggest
			if (this.suggest) {this.__hide()} else
			//clear input
			if (arg.owner._value().length) {arg.owner._value('')}
			//bubble up
			else {break}

			e.cancelBubble = true;
			try{e.preventDefault()}catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r)}
			try{e.stopPropagation()}catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r)}

			break;

		//left
		case 37:
			if (this.plus._value() == ''){

				e.cancelBubble = true;
				try{e.preventDefault()}catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r)}
				try{e.stopPropagation()}catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r)}

				this._focusPrevTag();
			}

			break;

		//right
		case 39:
			if (this.plus._value() == ''){

				e.cancelBubble = true;
				try{e.preventDefault()}catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r)}
				try{e.stopPropagation()}catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r)}

				this._focusNextTag();
			}

			break;

		//Home
		case 36:
		//End
		case 35:
			if (!e.shiftKey && !e.ctrlKey){
				this._focusTag(null);
				this.plus._focus();
			}
			break;
	}
};

///////////////////////////////////////////

_me._editTag = function(elm){
	if (this._readonly() || this.__collapsed) {return}

	if (this.edit){

		var v = this.edit._value(),
			elm = this.edit._main.parentNode;

		this.edit._destruct();

		if (this.suggest) {this.__hide()}

		if (elm){

			//edit
			if (v){

				removecss(elm,'edit');
				elm.removeAttribute('id');

				var a = this._decode(v);
				for (var i in a){
					this._addTag(a[i], elm);
					elm = '';
				}
			} else
			//remove
			if (elm.parentNode) {elm.parentNode.removeChild(elm)}

			this._focus();

			if (this._onchange) {this._onchange()}
			this.__exeEvent('onchange',null,{'owner':this});
		}
	} else
	if (elm){
		elm.innerHTML = '';
		elm.id = this._pathName +'/'+ unique_id();
		this._anchors.edit = elm.id;
		addcss(elm,'edit');

		var me = this;
		this._create('edit','obj_input_dynamic','edit','noborder edit');

		this.edit.__maxWidth = parseInt(getComputedStyle(this.edit._main.parentElement).getPropertyValue('max-width') || 400, 10);

		this.edit._onsubmit = function(){
			me._editTag();
			me._focusTag(null);
		};
		this.edit._onblur = function(){
			me._editTag();
		};

		this.edit._onclose  = function (e){
			this._value(elm.getAttribute('val'));
			me._editTag();

			e.cancelBubble = true;
			try{e.preventDefault()}catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r)}
			try{e.stopPropagation()}catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r)}
		};

		//For obj_suggest
		this.edit._obeyEvent('onfocus',[this,'__inpEvent']);
		this.edit._obeyEvent('onblur',[this,'__inpEvent']);
		this.edit._obeyEvent('onkeyup',[this,'__inpEvent']);
		this.edit._obeyEvent('onkeydown',[this,'__onkeydown']);
		this.edit._obeyEvent('click',[this,'__inpEvent']);

		this.edit._onkeydown = function(e){

			//Tab button behavior
			if (e.keyCode == 9){
				me._editTag();

				if (e.shiftKey) {me._focusPrevTag()} else {me._focusNextTag()}

				me._editTag(me._focusTag());
			} else
			if (me._onkeydown && me._onkeydown(e) === false) {return false} else {this.__exeEvent('onkeydown', e)}
		};

		this.edit._value(elm.getAttribute('val'));
		this.edit._focus();
	}
};



///////////////////////////////////////////
// decode input
// @Output format: {tag:<tag>[css:<className>,bgcolor:<#FFFFFF>,color:<#FFFFFF>]}
_me._decode = function(v){

	var aIN = v.split(','),
		aOut = [];

	for (var i in aIN) {
		if ((aIN[i] = aIN[i].trim())){
			aOut.push({tag:aIN[i]});
		}
	}

	return aOut;
};

//encode output
_me._encode = function(a){
	var aOut = [],
		aUnq = {};

	//Tags are Unique
	for (var i in a) {
		if ((a[i] = a[i].trim()) && !aUnq[a[i]]){
			aOut.push(a[i]);
			aUnq[a[i]] = true;
		}
	}

	return aOut.join(',');
};
