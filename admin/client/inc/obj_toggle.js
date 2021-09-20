/*****************************************************
 * Extension script: TextArea form object
 *
 * INHERITS FROM obj_form_generic
 *    _me._value
 *    _me._disabled
 *    _me.__update
 *
 *****************************************************/

_me = obj_toggle.prototype;
function obj_toggle(){};

/**
* @brief: CONSTRUCTOR, create input HTML element to __eIN variable
* @date : 20.4.2006 17:24:21
**/
_me.__constructor = function(){
	var me=this;
	me.__negated=false;
	this._draw('obj_toggle', '', {name:this._pathName+'#main'});
	
	/* use IW attributes */
	for(var key in this.__attributes){
		if(key.substr(0,3)=='iw-'){
			this._main.setAttribute(key,this.__attributes[key]);
		}
	}
	/* */
	
	this._toggleTarget=false;
	this._initialValue=false;
	this._elm=this._getAnchor('input');
	this._visual=this._getAnchor('visual');
	this._dependentFields = [];
	
	me._elm.onblur=function(){
		me._blurTimeout=setTimeout(function(){
			log.log(['toggle-construct','blurred',me._onblur]);
			if(me._onblur){
				me._onblur();
			}
		},100);
	};
	me._elm.onfocus=function(){
		if(me._onfocus){
			me._onfocus();
		}
	};
	
	this._visual.onmousedown = this._elm.onmousedown=function(){
		if(me._elm.focus){
			if(me._blurTimeout){
				clearTimeout(me._blurTimeout);
			}
			return false;
		}
	}
	
	/*** ADD EVENTS ***/
	/*this._elm.onclick = */this._visual.onclick = function (e){
		
		// ee -for fun
		if(gui.__sound_on){
			gui.frm_main.impact3._play(false,150);
		}
		//
		
		var e = e || window.event,
			elm = e.target || e.srcElement;
		
		if (!me._disabled()){
			
			me._elm.checked=!me._elm.checked;
			
			log.log(['toggle-onclick','2']);
			var checked = me._checked();
			if(me.__changed){
				me.__changed(checked);
			}
			me._doTheToggle();
			me._dependentFieldsAccess(checked);

			log.log(['toggle-onclick','onchange']);
			if(me._onchangeLocal){
				me._onchangeLocal(checked);
			}
			
			if (me._onclick){
				me._onclick(e);
			}
			me._elm.focus();
		}
		
		return false;
	};
	
	// onchange
	this._elm.onchange=function(){
		log.log(['toggle-onclick','onchange']);
		var checked = me._checked();
		if(me.__changed){me.__changed(checked);}
		me._doTheToggle();
		me._dependentFieldsAccess(checked);
		if(me._onchangeLocal){me._onchangeLocal(checked);}
	}
	
	// ONFOCUS
	this._elm.onfocus = function(e){
		var e = e || window.event;
		me.__hasFocus = true;

		if (me._onfocus) me._onfocus(e);
		me.__exeEvent('onfocus',e,{"owner":me});

		log.log('Element "'+this.id+'" focused');

		addcss(me._main, 'focus');
		return true;
	};

	// ONBLUR
	this._elm.onblur = function(e){
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
};

// Set which objects should be disabled when the toggle is off
_me._enables = function(sAnchors) {
	// Save fields dependent on the toggle
	this._dependentFields = sAnchors.replace(/ /g,'').split(',');
	// Apply current toggle state
	this._dependentFieldsAccess(this._checked());
}

// Set which objects should be hidden when the toggle is off
_me._toggle = function(sToggle){
	this._toggleTarget=sToggle;
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
	
	if(typeof sDisabled != 'undefined' && !this._readonly())
	{
		if(sDisabled){
			addcss(this._main,'is-disabled');
		}else{
			removecss(this._main,'is-disabled');
		}
		this._elm.disabled = sDisabled;
	}
	return this._elm.disabled;
};

_me._negated=function(negated){
	if(typeof negated != 'undefined'){
		var checked=this._checked();
		this.__negated=negated;
		if(negated!=checked){
			this._checked(checked);
		}
	}
	
	return this.__negated
}

_me._value = function(sValue){
	if(typeof sValue!='undefined'){
		this._changed(true);
		return this._elm.__value = sValue;
	}else{
		if(this._elm.__value){
			return this._elm.__value;
		}else{
			return (this._checked()?1:0);
		}
	}
};

_me._setValue = function(apiprop, ignore_onchange) {
	var me = this;

	this.__apivalue = apiprop;

	this._checked(apiprop.inversed ? apiprop.value!=1 : apiprop.value==1, ignore_onchange === void 0 ? true : ignore_onchange);

	if(apiprop.readonly) {
		this._readonly(true);
	}

	if(apiprop.denied) {
		this._main.setAttribute('is-hidden','1');
	}
}

_me._label=function(text,toToggleWith_checked){
	var me=this;
	if(toToggleWith_checked){
		log.log(['toggle-label-defined']);
		this.__changed=function(state){
			log.log(['toggle-label',state]);
			me._label((state?toToggleWith_checked:text));
		}
		this.__changed(this._checked());
	}else{
		if(text.search('::')>0){
			text=getLang(text);
		}
		
		me._getAnchor('label').setAttribute('title',text);
		
		me._getAnchor('label').innerHTML=helper.htmlspecialchars(text);
		me._getAnchor('label').removeAttribute('is-hidden');
	}
};

_me._placeholder = function(sPlaceholder){
	return this._elm.placeholder = sPlaceholder?getLang(sPlaceholder):this._elm.placeholder;
};

_me._title = function(sValue){
	if (Is.String(sValue))
		this._elm.title = (sValue.indexOf('::')!=-1 ? getLang(sValue) : sValue);
	else
		return this._elm.title || '';
};

// Disable objects when toggle is off
_me._dependentFieldsAccess=function(checked){
	var i = this._dependentFields.length;
	while(i--) {
		var obj = this._parent[this._dependentFields[i]];
		obj && obj._disabled && obj._disabled(!checked);
	}
}

// Hide or show related object depending on toggle
_me._doTheToggle=function(){
	// Toggle visibility of object/anchor/element (only one per toggle switch)
	if(this._toggleTarget){
		if(this._parent[this._toggleTarget] && this._parent[this._toggleTarget]._toggle) {
			//Use the native toggle method if exists
			this._parent[this._toggleTarget]._toggle(this);
		} else {
			// Otherwise find the dom element
			var elm=false;
			if(this._parent[this._toggleTarget]){
				elm=this._parent[this._toggleTarget]._main;
			} else if(this._parent._getAnchor(this._toggleTarget)){
				elm=this._parent._getAnchor(this._toggleTarget);
			} else if(document.getElementById(this._toggleTarget)){
				elm=document.getElementById(this._toggleTarget);
			}
			// Make it hidden or shown with attribute
			if(elm){
				if(elm.getAttribute('is-hidden')){
					elm.removeAttribute('is-hidden');
				}else{
					elm.setAttribute('is-hidden',1);
				}
			}
		}
	}
}

_me._onclick = function(e){
	
}

_me._readonly = function(bReadonly){
	if(typeof bReadonly!='undefined')
	{
		if(bReadonly){
			this._disabled(true);
			addcss(this._main,'is-readonly');
			this._elm.setAttribute('readonly','readonly');
		}else{
			removecss(this._main,'is-readonly');
			this._elm.removeAttribute('readonly');
			this._disabled(false);
		}
	}
	return this._elm.hasAttribute('readonly');
};

_me._checked = function(checked,ignore_onchange){
	
	if(typeof checked != 'undefined' && this.__negated){
		checked=!checked;
	}
	
	if(typeof checked != 'undefined'){
		if(this.__changed){this.__changed(checked);}

		if((checked && !this._elm.checked)||(!checked && this._elm.checked)){
			this._doTheToggle();
			this._dependentFieldsAccess(checked);
		}
		this._elm.checked=checked;
		this._changed(true);
		if(!ignore_onchange && this._onchangeLocal){this._onchangeLocal(this._checked());}
	}else{
		if(this.__negated){
			return !this._elm.checked;
		}else{
			return this._elm.checked;
		}
	}
};


_me._onchangeLocal=function(v){
	if(this.__apivalue && !this.__apivalue.readonly) {
		var checked = this._checked();
		if(this.__apivalue.inversed) {
			checked = !checked;
		}
		this.__apivalue.value = checked ? 1 : 0;
	}

	this._onchange(v);

	this._triggerLocalObey('_onchange',[v]);
}

_me._onchange=function(){
	
}

_me._hide=function(status){
	if(status){
		addcss(this._main,'hide');
	}else{
		removecss(this._main,'hide');
	}
}

_me._changed=function(clear){
	if(clear){
		this._initialValue=this._checked();
	}
	return this._initialValue!=this._checked();
}
