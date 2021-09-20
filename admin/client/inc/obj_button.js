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
	var elm = mkElement('input',{"type":'button',"name":this._pathName+'#main',"id":this._pathName+'#main'});
	this._main.appendChild(elm);
	elm.className = this._type == 'obj_button'?'obj_button':'obj_button ' + this._type;

	this.__eIN = elm.form[elm.name];

	this._elm=elm;

	var me = this;

	if(this.__attributes.title){
		this._title(this.__attributes.title);
	}

	/*** ADD EVENTS ***/
	this.__eIN.onclick = this._main.onclick = function (e){
		var e = e || window.event,
			elm = e.target || e.srcElement;

		if (!me._disabled()){
			if (elm == me._main)
				me._focus();
			
			if (me._onclick)
				me._onclick(e);
		}
		
		e.stopPropagation();
		e.cancelBubble=true;
		return false;
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

_me._addcss=function(css){
	addcss(this._main,css);
}

_me._removecss=function(css){
	removecss(this._main,css);
}

_me._value = function(sValue){
	if(sValue==''){this.__eIN.value=sValue;}
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
		this.__eIN.title = (sValue.indexOf('::')!=-1 ? getLang(sValue) : sValue);
	else
		return this.__eIN.title || '';
};

_me._hide = function(status){
	if(typeof status == 'undefined'){status=true;}	// to be compatible with older version
	if(status){
		addcss(this._main,'hide');
	}else{
		removecss(this._main,'hide');
	}
}

_me._show = function(){
	removecss(this._main,'hide');
}

_me._readonly = function(){
	
}

_me._iwAttr=function(arr,val){
	if(typeof arr != 'object'){
		n={};
		n[arr]=val;
		arr=n;
	}
	for(var key in arr){
		this._main.setAttribute('iw-'+key,arr[key]);
	}
}