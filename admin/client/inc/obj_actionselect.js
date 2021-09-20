/*****************************************************
 * Extension script: TextArea form object
 *
 * INHERITS FROM obj_form_generic
 *    _me._value
 *    _me._disabled
 *    _me.__update
 *
 *****************************************************/

_me = obj_actionselect.prototype;
function obj_actionselect(){};

/**
* @brief: CONSTRUCTOR, create button HTML element to __eIN variable
* @date : 20.4.2006 17:24:21
**/
_me.__constructor = function(){
	var me=this;
	this._shown=false;
	this.__filleddata=[];
	
	this._create('button','obj_button');

	if(this.__attributes['button_css']){
		this.button._addcss(this.__attributes['button_css']);
	}else{
		this.button._addcss('text secondary');
		this.button._iwAttr('type','select');
	}
	
	// if display="select", actionselect object will change button's value to tabmenu selected value
	this._displayselect=false;
	if(this.__attributes.display && this.__attributes.display.toLocaleLowerCase()=='select'){
		this._displayselect=true;
	}
	
	this._create('actions','obj_tabmenu');
	addcss(this.actions._main,'menu obj_tabmenu');
	this.actions._iwAttr('type','selector');
	this._hideBubble();
	
	this.button._onclick=function(e){
		if(me._onclick()!==false){
			if(me._shown)
			{
				me._hideBubble();
			}
			else
			{
				me._showBubble();
			}
		}
	};
	
	this.button._main.onmouseup=function(e){
		e.stopPropagation();
		e.cancelBubble=true;
	}
	gui._obeyEvent('mouseup', [this,'_onouterclick']);
	gui._obeyEvent('blur', [this,'_onouterclick']);
	
	this._add_destructor('__onbeforedestruct');
};

_me._fill=function(data){
	var me=this;
	this.__filleddata=data;
	if(this._displayselect){
		for(var i=0; i<data.length; i++){
			var oc=(data[i].onclick?data[i].onclick:function(){});
			data[i].onclick=function(x,value){
				me._value(value);
				oc(x,value);
				return false;
			}
		}
	}
	
	this.actions._fill(data);
	
	if(this._displayselect){
		if(data[0]){
			this._value(data[0].name);
		}
	}
}


_me.__onbeforedestruct=function(){
	gui._disobeyEvent('mouseup', [this,'_onouterclick']);
	gui._disobeyEvent('blur', [this,'_onouterclick']);
};


_me._showBubble=function(){
	/* cause blur on body to blur all bubbles */
	
	if (document.createEvent) {
		var evt = document.createEvent("HTMLEvents");
		evt.initEvent("blur", false, true);
		window.dispatchEvent(evt);
	} else {
		window.fireEvent("onblur");
	}
	/* */
	
	this._shown=true;
	this.actions._main.removeAttribute('is-hidden');
}

_me._hideBubble=function(){
	this._shown=false;
	this.actions._main.setAttribute('is-hidden',1);
}

_me._onclick=function(){
	
}

_me._disabled = function(sDisabled){
	this.button._disabled(sDisabled);
};

_me._addcss=function(css,onbox){
	if(onbox){
		addcss(this._main,css);
	}else{
		this.button._addcss(css);
	}
}

_me._removecss=function(css,onbox){
	if(onbox){
		removecss(this._main,css);
	}else{
		this.button._removecss(css);
	}
}

_me._value = function(sValue,ignoreonchange){
	if(this._displayselect){
		if(this.__filleddata[0]){
			if(typeof sValue != 'undefined')
			{
				for(var i=0; i<this.__filleddata.length; i++){
					if(this.__filleddata[i].name==sValue){
						this.button._value(this.__filleddata[i].value);
						this._selectvalue=sValue;
						if(this._onchange && !ignoreonchange){
							this._onchange(sValue);
						}
						return sValue;
					}
				}
			}
			else
			{
				return this._selectvalue;
			}
		}
	}
	return this.button._value(sValue);
};

_me._text = function(sValue){
	return this.button._text(sValue);
};

_me._title = function(sValue){
	return this.button._title(sValue);
};

_me._hide = function(){
	addcss(this._main,'hide');
}

_me._show = function(){
	removecss(this._main,'hide');
}

_me._onouterclick=function(){
	var me=this;
	if(me._shown)
	{
		me._hideBubble();
	}
}