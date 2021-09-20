/*****************************************************
 * Extension script: TextArea form object
 *
 * INHERITS FROM obj_form_generic
 *    _me._value
 *    _me._disabled
 *    _me.__update
 *
 *****************************************************/

_me = obj_radio.prototype;
function obj_radio(){};

/**
* @brief: CONSTRUCTOR, create input HTML element to __eIN variable
* @date : 20.4.2006 17:24:21
**/
_me.__constructor = function(){
	
	var me = this;
	
	try
	{
		
		var group=(this._anchor?this._anchor:'default');
		log.log(['radio-constructor',this.__attributes]);
		if(this.__attributes.group){
			this._group=this.__attributes.group;
		}else{
			this._group='_default_';
		}
		
		// sign to global list
		gui._obj_radio_list=gui._obj_radio_list||{};
		if(!gui._obj_radio_list[this._group]){
			gui._obj_radio_list[this._group]={list:{},onchange:function(that){
				var list=gui._obj_radio_list[me._group].list;
				for(var key in list){
					list[key]._groupOnchange(that);
				}
			}};
		}
		gui._obj_radio_list[this._group].list[this._name]=this;
		
		var elm = mkElement('input',{"type":"radio","name":this._group,"id":this._pathName+'#main'});
		var elmlabel = mkElement('i',{});
		var elmlabel_content = mkElement('label',{});
			addcss(elmlabel_content,'label');
		this._main.appendChild(elm);
		this._main.appendChild(elmlabel);
		this._main.appendChild(elmlabel_content);
		
		this._initialValue=false;
		
		this.__eIN = elm;
	
		elm._label=elmlabel_content;
		this._elm=elm;
	}
	catch(e)
	{
		log.error(e);
	}

	/*** ADD EVENTS ***/
	
	// onchange
	this._elm.onchange = function(e){
		if(me._checked()){
			gui._obj_radio_list[me._group].onchange(me);

			for(var i in gui._obj_radio_list[me._group].list) {
				if(gui._obj_radio_list[me._group].list[i].__apivalue) {
					gui._obj_radio_list[me._group].list[i].__apivalue.value = this.value;
				}
			}
		}
		me._onchange(e);
	}
	
	// onclick
	this._elm.onclick = this._main.onclick = function (e){
		var e = e || window.event,
			elm = e.target || e.srcElement;

		if (this == elm){
			if (!me._disabled()){
				if (me._onclick)
					me._onclick(e);
			}
		}
		return true;
	};
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
	//
	this._add_destructor('__onbeforedestruct');
	/* set onbefore destruct listener */
};

/** obbefore destruct listener */
_me.__onbeforedestruct=function(){
	delete gui._obj_radio_list[this._group].list[this._name];
}
/** */

_me._toggle = function(sToggle){
	/*
	var parts=this._pathName.split('.');
	parts[parts.length-1]=stoggle;
	var joined = parts.join('.');//+'#main';
	log.log(joined);
	this._toggleTarget=joined;
	*/
	this._toggleTarget=sToggle;
}

_me._readonly = function(bReadonly,single){
	
	if(!single && typeof bReadonly != 'undefined'){
		var list=gui._obj_radio_list[this._group].list;
		for(var key in list){
			list[key]._readonly(bReadonly,true);
		}
		return bReadonly;
	}else{
		if(typeof bReadonly!='undefined')
		{
			if(bReadonly){
				this._disabled(true);
				addcss(this._main,'is-readonly');
				this._elm.setAttribute('readonly','readonly');
			}else{
				this._disabled(false);
				removecss(this._main,'is-readonly');
				this._elm.removeAttribute('readonly');
			}
		}
		return this._elm.hasAttribute('readonly');
	}
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

// Setting API porperty Value object
_me._setValue = function(apiprop) {
	if(apiprop.value==undefined && apiprop.default) {
		this._groupValue(apiprop.default);
	} else {
		this._groupValue(apiprop.value);
	}

	if(apiprop.readonly) {
		this._readonly(true);
	}

	if(apiprop.denied) {
		this._main.setAttribute('is-hidden','1');
	}

	this.__apivalue = apiprop;
}

_me._value = function(sValue){
	if(typeof sValue != 'undefined')
	{
		this.__eIN.value = sValue;
		if(this._onchange){
			this._onchange();
		}
	}
	
	return this.__eIN.value;
};

_me._groupValue=function(value){
	
	var list=gui._obj_radio_list[this._group].list;
	for(var key in list){
		if(typeof value != 'undefined'){
			if(list[key]._value() == value){
				list[key]._checked(true);
				this._groupOnchange(list[key]);
				return list[key]._value();
			}
		}else{
			if(list[key]._checked()){
				return list[key]._value();
			}
		}
	}
	if(typeof value != 'undefined'){
		this._groupOnchange(this);
		return this._groupValue();
	}else{
		return false;
	}
}

_me._groupOnchange=function(e){
	
}

_me._placeholder = function(sPlaceholder){
	return this._elm.placeholder = sPlaceholder?getLang(sPlaceholder):this._elm.placeholder;
};

_me._title = function(sValue){
	if (Is.String(sValue))
		this._elm.title = (sValue.indexOf('::')!=-1 ? getLang(sValue) : sValue);
	else
		return this._elm.title || '';
};

_me._doTheToggle=function(){
	if(this._toggleTarget && this._parent[this._toggleTarget]){
		this._parent[this._toggleTarget]._toggle(this);
	}else if(this._toggleTarget){
		
		var elm=false;
		
		if(this._parent._getAnchor(this._toggleTarget)){
			var elm=this._parent._getAnchor(this._toggleTarget);
		}else if(document.getElementById(this._toggleTarget)){
			var elm=document.getElementById(this._toggleTarget);
		}
		
		if(elm){
			if(elm.getAttribute('is-hidden')){
				elm.removeAttribute('is-hidden');
			}else{
				elm.setAttribute('is-hidden',1);
			}
		}
	}
}

_me._onclick = function(e){
	this._doTheToggle();
}

_me._checked = function(checked,ignoreChange){
	if(typeof checked != 'undefined'){
		if(this._onchange && checked!=this._elm.checked){
			this._elm.checked=checked;
			if(!ignoreChange){this._onchange();}
		}
		this._elm.checked=checked;
		this._changed(true);
		this._groupChanged(true);
	}
	return this._elm.checked;
};

_me._onchange=function(){
	
}

_me._show = function(agent) {
	this._main.style.display='';
	this._ishidden=false;
};

_me._hide = function(agent) {
	this._main.style.display='none';
	this._ishidden=true;
};

_me._label=function(langstr){
	this._elm.setAttribute('title',getLang(langstr));
	this._elm._label.innerHTML=(langstr?helper.htmlspecialchars(getLang(langstr)):'');
}

_me._changed=function(clear){
	if(clear){
		this._initialValue=this._checked();
	}
	return this._initialValue!=this._checked();
}

_me._groupChanged=function(clear){
	var ret = false;
	var list=gui._obj_radio_list[this._group].list;
	for(var key in list){
		if(list[key]._changed(clear)){
			if(!ret){ret = true;}
		}
	}
	return ret;
}

_me._addcss=function(css){
	addcss(this._main,css);
}

_me._removecss=function(css){
	removecss(this._main,css);
}
