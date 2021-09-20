/*****************************************************
 * Extension script: TextArea form object
 *
 * INHERITS FROM obj_form_generic
 *    _me._value
 *    _me._disabled
 *    _me.__update
 *
 *****************************************************/

_me = obj_dropdown_single.prototype;
function obj_dropdown_single(){};

/**
* @brief: CONSTRUCTOR, create input HTML element to __eIN variable
* @date : 20.4.2006 17:24:21
**/
_me.__constructor = function(){
	var me=this;
	/* creates ELM directly, because simlicity of object */
	var elm = mkElement('select',{"size":"1","name":this._pathName+'#main',"id":this._pathName+'#main'});
	this._main.appendChild(elm);
	elm.className = this._type == 'obj_dropdown_single'?'obj_dropdown_single':'obj_dropdown_single ' + this._type;
	this._initialValue='';
	this._elm=elm;
	this.__eIN = elm.form[elm.name];
	this._options=[];

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

	// ONBLUR
	this.__eIN.onchange = function(e){
		var e = e || window.event;
		
		if (me._onchange && me._onchange(e,this) === false) {
			return false;
		}
		me.__exeEvent('onchange',e,{"owner":me});
		
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
};

_me._disabled = function(sDisabled,from_readonly){
	var me=this; 
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
	
	if(typeof sDisabled != 'undefined'){
		if(sDisabled){
			addcss(this._main,'is-disabled');
			me._disable_readonly=(from_readonly);
			this._elm.disabled = sDisabled;
		}else{
			if(this.__apivalue && this.__apivalue.readonly) {
				// Dropdowns with readonly api value shall never be enabled
			} else
			if((me._disable_readonly && from_readonly) || (!from_readonly && !me._disable_readonly)) {
				removecss(this._main,'is-disabled');
				this._elm.disabled = sDisabled;
			}
		}
	}
	return this._elm.disabled;
};


_me._value = function(sValue,ignoreonchange,skip_default){
	if(typeof sValue != 'undefined')
	{
		this.__eIN.value = sValue;
		
		if(this.__eIN.value!=sValue || (this.__eIN.value=='' && !skip_default)){
			var done=false;
			for(var key in this._options){
				if(!done){
					this.__eIN.value=key;
				}
				done=true;
			}
		}
		
		this._changed(true);
		
		if(!ignoreonchange&&this._onchange){
			this._onchange();
		}
	}

	if(this.__eIN.selectedIndex==-1) {
		return null;
	} else {
		return this.__eIN.value;
	}


};

_me._placeholder = function(sPlaceholder){
	return this.__eIN.placeholder = sPlaceholder?getLang(sPlaceholder):this.__eIN.placeholder;
};

_me._title = function(sValue){
	if (Is.String(sValue))
		this.__eIN.title = (sValue.indexOf('::')!=-1 ? getLang(sValue) : sValue);
	else
		return this.__eIN.title || '';
};

_me._readonly = function(bReadonly){
	log.log(['dropdown-readonly',bReadonly]);
	if(typeof bReadonly != 'undefined')
	{
		if(bReadonly){
			this._disabled(true,true);
			addcss(this._main,'is-readonly');
			this.__eIN.setAttribute('readonly','readonly');
		}else{
			this._disabled(false,true);
			removecss(this._main,'is-readonly');
			this.__eIN.removeAttribute('readonly');
		}
	}
	return this.__eIN.hasAttribute('readonly');
};

_me._fill=function(options,keepContent){
	
	if(!keepContent){
		this._elm.innerHTML='';
	}

	// Allow arrays or objects as source
	var isarray=false;
	if (Is.Array(options)){
		isarray=true;
	}else if (!Is.Object(options)){
		return false;
	}
	
	this._options=options;
	
	// Create dom elements and append
	for(var key in options){
		var ckey=key;
		if(key.substr(0,1)=='*'){ckey=key.substr(1,key.length-1);}
		var elm = mkElement('option',{"value":(isarray?options[key]:ckey)});
		elm.innerHTML=options[key];
		this._elm.appendChild(elm);
	}
	
	this._changed(true);
	
	return this._elm;
}

_me._fillLang = function(options,keepContent) {
	
	if(!keepContent){
		this._elm.innerHTML='';
	}

	// Convert string to Array
	if(typeof options == 'string') {
		options = options.replace(/ /g,'').split(',');
	}

	this._options=options;

	// Localise labels and add to DOM
	if(options instanceof Array) {
		for(var n=0, l=options.length; n<l; n++){
			this._elm.add(new Option(getLang(options[n]),n));
		}
	} else {
		for(var key in options){
			this._elm.add(new Option(getLang(options[key]),key));
		}
	}

	this._changed(true);
	
	return this._elm;
}

_me._addcss=function(css){
	addcss(this._main,css);
}

_me._removecss=function(css){
	removecss(this._main,css);
}

_me._changed=function(clear){
	if(clear){
		this._initialValue=this._value();
	}
	return this._initialValue!=this._value();
}
