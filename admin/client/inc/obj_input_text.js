/*****************************************************
 * Extension script: TextArea form object
 *
 * INHERITS FROM obj_form_generic
 *    _me._value
 *    _me._disabled
 *    _me.__update
 *
 *****************************************************/

_me = obj_input_text.prototype;
function obj_input_text(){};

/**
* @brief: CONSTRUCTOR, create input HTML element to __eIN variable
* @date : 20.4.2006 17:24:21
**/
_me.__constructor = function(){
	var me=this;
	
	storage.library("markdown");
	
	/* creates ELM directly, because simlicity of object */
	var elm = mkElement('input',{"type":"text","name":this._pathName+'#main',"id":this._pathName+'#main'});
	var bubble = mkElement('div',{"name":this._pathName+'#bubble',"id":this._pathName+'#bubble'});
		addcss(bubble,'bubble');
	this._main.appendChild(elm);
	this._main.appendChild(bubble);
	this._initialValue='';
	this.__eIN = elm.form[elm.name];
	this.__value = null;

	this._bubble=bubble;
	this._elm=elm;

	this._main.onsubmit=function(){
		if(me._onsubmit){
			me._onsubmit();
			return false;
		}
	}
	
	if(this.__attributes.markdown && (this.__attributes.markdown == "true" || this.__attributes.markdown == "1")){
		this._markdown(true);
	}

	var me = this;

	/*** ADD EVENTS ***/
	/*
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
	*/
	
	// ONCHANGE
	this.__eIN.onchange=function(e){
		me._message();
	}
	// ONFOCUS
	this.__eIN.onfocus = function(e){
		var e = e || window.event;
		me.__hasFocus = true;

		if (me._onfocus) me._onfocus(e);
		me.__exeEvent('onfocus',e,{"owner":me});

		log.log('Element "'+this.id+'" focused');

		addcss(me._main, 'focus');
		return true;
	};

	// ONBLUR
	this.__eIN.onblur = function(e){
		var e = e || window.event;
        me.__hasFocus = false;
        
        log.log(me._onblur);
		if (me._onblur && me._onblur(e) === false) return false;
		me.__exeEvent('onblur',e,{"owner":me});
		
		log.log('Element "'+this.id+'" blured');
		
		removecss(me._main, 'focus');
		return true;
	};

	this.__eIN.oninput = function(e) {
		me.__value = this.value;
	}

	this._main.oncontextmenu = function(e){
		var e = e || window.event,
			elm = e.target || e.srcElement;

		if (me._oncontext && me._oncontext(e) !== false)
			me.__exeEvent('oncontext',e,{"owner":me});		

		//return false;
	};

	this._main.onkeydown = function(e){
		var e = e || window.event;
		if (!me._disabled() && me._onkeypress)
			me._onkeypress(e);

		return true;
	};
	
	this._main.onkeyup = function(e){
		var e = e || window.event;
		if (!me._disabled() && me._onkeyup)
		{
			me._hideError();
			me._onkeyup(e);
		}

		return true;
	};

};

_me._hideError=function(){
	this._message();
}

_me._selectValue=function(){
	this._elm.setSelectionRange(0, this._elm.value.length);
}

_me._copyToClipboard = function() {
	this.__eIN.select();
	document.execCommand('Copy');
//	getSelection().removeAllRanges();
}

_me._setType=function(type){
	this._elm.type=type;
}

_me._message=function(text,type,position){
	if(!position){position='';}
	if(text)
	{
		removecss(this._bubble,'error');
		removecss(this._bubble,'warning');
		removecss(this._bubble,'success');
		removecss(this._bubble,'top');
		removecss(this._bubble,'bottom');
		removecss(this._bubble,'left');
		removecss(this._bubble,'right');
		removecss(this._main,'has-error');
		this._bubble.innerHTML=helper.htmlspecialchars(text);
		addcss(this._bubble,'is-visible '+type+' '+position);
		if(type=='error'){
			addcss(this._main,'has-error');
		}
	}
	else
	{
		this._bubble.innerHTML='';
		removecss(this._bubble,'is-visible');
		removecss(this._main,'has-error');
	}
}

_me._error=function(text,position){
	this._message(text,'error',position);
}

_me._warning=function(text,position){
	this._message(text,'warning',position);
}

_me._success=function(text,position){
	this._message(text,'success',position);
}

_me._disabled = function(sDisabled){
	if(sDisabled && typeof sDisabled =='object'){
		this._disablealso_ids=sDisabled;
	}
	
	if(this._disablealso_ids)
	{
		var ids=this._disablealso_ids;
		for(var i=0; i<ids.length; i++){
			if(this._parent[ids[i]]){
				if(this._parent[ids[i]]._disabled){
					this._parent[ids[i]]._disabled(true);
				}
			}else if(this._parent._getAnchor(ids[i])){
				if(sDisabled){
					addcss(this._parent._getAnchor(ids[i]),'is-disabled');
				}else{
					removecss(this._parent._getAnchor(ids[i]),'is-disabled');
				}
			}
		}
	}
	
	if(sDisabled){
		addcss(this._main,'is-disabled');
	}else{
		removecss(this._main,'is-disabled');
	}
	return this._elm.disabled = sDisabled;
};

_me._placeholder = function(sPlaceholder,text){
	if(text){
		return this.__eIN.placeholder = sPlaceholder?sPlaceholder:this.__eIN.placeholder;
	}
	return this.__eIN.placeholder = sPlaceholder?getLang(sPlaceholder):this.__eIN.placeholder;
};

_me._required = function(sRequired){
	return this.__eIN.required = sRequired?true:false;
};

_me._readonly = function(bReadonly){
	if(typeof bReadonly != 'undefined')
	{
		if(bReadonly){
			addcss(this._main,'is-readonly');
			this.__eIN.setAttribute('readonly','readonly');
		}else{
			removecss(this._main,'is-readonly');
			this.__eIN.removeAttribute('readonly');
		}
	}
	return this.__eIN.hasAttribute('readonly');
};

_me._label = function(sLabel,translated){
	
	if(sLabel==''){
		sLabel=false;
	}
	if(typeof sLabel!='undefined')
	{
		if(sLabel)
		{
			if(!translated){
				sLabel=getLang(sLabel);
			}
			if(!this._labelSet)
			{
				addcss(this._main,'inner-label');
				var ch = mkElement('label',{});
					ch.innerHTML=helper.htmlspecialchars(sLabel);
					addcss(ch,'label');
				this._labelSet = ch;
				return this._main.appendChild(ch);
			}
			else
			{
				this._labelSet.innerHTML=helper.htmlspecialchars(sLabel);
			}
		}
		else
		{
		
			if(this._labelSet)
			{
				this._main.removeChild(this._labelSet);
				this._labelSet=false;
			}
		}
	}
	else
	{
		return this._labelSet.innerHTML;
	}
	return true;
};

_me._onchange=function(){
	
}

_me._onsubmit=function(){
	
}


_me._title = function(sValue){
	if (Is.String(sValue))
		this.__eIN.title = (sValue.indexOf('::')!=-1 ? getLang(sValue) : sValue);
	else
		return this.__eIN.title || '';
};

_me._onkeyup = function(){
	if(this._onchange){
		this._onchange();
	}
};

_me._value = function(sValue,donotclear){
	if(sValue===null) {
		this.__value = null;
		this.__eIN.value = "";
	} else
	if(typeof sValue != 'undefined') {
		sValue = sValue.toString();

		this.__value = sValue;

		if(this._markdownEnabled){
			sValue = markdown.decode(sValue);
		}

		this.__eIN.value = sValue;
		this._changed(donotclear?false:true);
		if(this._onchange){
			this._onchange();
		}
	}

	if(this._markdownEnabled){
		return markdown.encode(this.__eIN.value);
	}

	if(this.__eIN.value=="" && this.__value===null) {
		return null;
	} else {
		return this.__eIN.value;
	}

};

_me._toggle = function(agent) {
	if(this._ishidden){
		this._show(agent);
	}else{
		this._hide(agent);
	}
}

_me._addcss=function(css){
	addcss(this._main,css);
}

_me._removecss=function(css){
	removecss(this._main,css);
}

_me._show = function(agent) {
	this._main.style.display='';
	this._ishidden=false;
};

_me._hide = function(hide) {
	if(hide){
		this._main.setAttribute('is-hidden',1);
	}else{
		this._main.removeAttribute('is-hidden');
	}
	this._ishidden=hide;
};

_me._changed=function(clear){
	if(clear){
		this._initialValue=this._value();
	}
	return this._value()!==null && this._initialValue!=this._value();
}

_me._markdown = function(enable){
	var me= this;
	if(enable !== void 0){
		me._markdownEnabled = enable;
	}
	return ( me._markdownEnabled ? true : false )
}
