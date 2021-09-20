_me = obj_bar.prototype;
function obj_bar(){};

/**
* @brief: CONSTRUCTOR, create input HTML element to __eIN variable
* @date : 20.4.2006 17:24:21
**/
_me.__constructor = function(){
	
	var me = this;
	
	try
	{
		//var elm = mkElement('div',{"name":this._pathName+'#main',"id":this._pathName+'#main'});
		var elmlabel = mkElement('span',{});
			addcss(elmlabel,'bar-text');
		var elmfill = mkElement('div',{});
			addcss(elmfill,'bar-fill');
		this._main.appendChild(elmlabel);
		this._main.appendChild(elmfill);
		//this._main.appendChild(elm);
		
		//this.__eIN = elm.form[elm.name];
	
		this._elmfill=elmfill;
		this._elmlabel=elmlabel;
		this._elm=this._main;
		
		addcss(this._elm,'bar');
	}
	catch(e)
	{
		log.error(e);
	}

	/*** ADD EVENTS ***/
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
};

_me._label = function(sValue){
	return this._elmlabel.innerHTML = helper.htmlspecialchars(sValue);
};

_me._value = function(percent){
	this._elmfill.style.width=percent+"%";
}

_me._disabled = function(){
	
}