/*****************************************************
 * Extension script: TextArea form object
 *
 * INHERITS FROM obj_form_generic
 *    _me._value
 *    _me._disabled
 *    _me.__update
 *
 *****************************************************/

_me = obj_textarea.prototype;
function obj_textarea(){};

/**
* @brief: CONSTRUCTOR, create input HTML element to __eIN variable
* @date : 20.4.2006 17:24:21
**/
_me.__constructor = function(){
	
	storage.library("markdown");
	
	/* creates ELM directly, because simlicity of object */
	var elm = mkElement('textarea',{"name":this._pathName+'#main',"id":this._pathName+'#main'});
	this._main.appendChild(elm);
	this._initialValue='';
	this.__eIN = elm.form[elm.name];

	this._elm=elm;

	var me = this;

	if(this.__attributes.markdown && (this.__attributes.markdown == "true" || this.__attributes.markdown == "1")){
		this._markdown(true);
	}

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
        
		if (me._onblur && me._onblur(e) === false) return false;
		me.__exeEvent('onblur',e,{"owner":me});
		
		log.log('Element "'+this.id+'" blured');
		
		removecss(me._main, 'focus');
		return true;
	};


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
			me._onkeyup(e);

		return true;
	};
};

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

_me._readonly = function(sDisabled){
	if(typeof sDisabled!='undefined'){
	
		if(sDisabled)
		{
			addcss(this._main,'is-readonly');
			this._elm.setAttribute('readonly',1)
		}
		else
		{
			this._elm.removeAttribute('readonly')
			removecss(this._main,'is-readonly');
		}
	
	}
	
	return this._main.hasAttribute('readonly');
};

_me._copyToClipboard = function() {
	this.__eIN.select();
	document.execCommand('Copy');
//	getSelection().removeAllRanges();
}

_me._placeholder = function(sPlaceholder){
	return this.__eIN.placeholder = sPlaceholder?getLang(sPlaceholder):this.__eIN.placeholder;
};

_me._label = function(sLabel,translated){
	
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
	return true;
};

_me._title = function(sValue){
	if (Is.String(sValue))
		this.__eIN.title = (sValue.indexOf('::')!=-1 ? getLang(sValue) : sValue);
	else
		return this.__eIN.title || '';
};

_me._value = function(sValue,donotclear){
	if(typeof sValue != 'undefined')
	{
		if(this._markdownEnabled){
			sValue = markdown.decode(sValue);
		}
		
		this.__eIN.value = sValue;
		this._changed((donotclear?false:true));
		if(this._onchange){
			this._onchange();
		}
	}
	
	if(this._markdownEnabled){
		return markdown.encode(this.__eIN.value);
	}
	
	return this.__eIN.value;
};

_me._toggle = function(agent) {
	if(this._ishidden){
		this._show(agent);
	}else{
		this._hide(agent);
	}
}

_me._show = function(agent) {
	this._main.style.display='';
	this._ishidden=false;
};

_me._hide = function(agent) {
	this._main.style.display='none';
	this._ishidden=true;
};

_me._changed=function(clear){
	if(clear){
		this._initialValue=this._value();
	}
	return this._initialValue!=this._value();
}

_me._markdown = function(enable){
	var me= this;
	if(enable !== void 0){
		me._markdownEnabled = enable;
	}
	return ( me._markdownEnabled ? true : false )
}