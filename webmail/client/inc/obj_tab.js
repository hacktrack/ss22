/*
._onactive(bool)
*/
_me = obj_tab.prototype;
function obj_tab(){};

_me.__constructor = function(bFirst){

	var me = this;

	this.__eLi = mkElement('li',{id:this._parent._pathName+"/"+this._name, className: this._css}); //ID is for automatic testing

	this.__eLi.onmousedown = function(e){
		var e = e || window.event;
			e.cancelBubble = true;
		try{e.preventDefault();}catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r);}
		try{e.stopPropagation();}catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r);}

		if (!me._isActive){
			me._active(null, true);

			if (gui.telemetry)
				gui.telemetry._add({id:this.id, type: me._parent._type});
		}
		else{
			//Execute handlers
			if (me._ondeactive) me._ondeactive();
			me.__exeEvent('ondeactive',null,{"owner":me});
		}

		return false;
	};
	this.__eLi.oncontextmenu = function(e){
		var e = e || window.event;

		if (me._oncontext)
			me._oncontext(e);

		return false;
	};

	var elm = this._parent._getAnchor('links');

	if (bFirst && elm.firstChild)
		elm.insertBefore(this.__eLi, elm.firstChild);
	else
		elm.appendChild(this.__eLi);
};

/**
 * @Brief: set TITLE for tab
 * @Note predelat na _title() a _text()
 **/
_me._value = function(v,bNoLang){
	if (v){
		this.__tabTitle = v;
		this.__eLi.innerHTML = '<span class="mask">'+ (bNoLang?v:getLang(v)) +'</span><span>'+ (bNoLang?v:getLang(v)) +'</span>';
	}
	else
	    return this.__tabTitle || '';
};

_me._incorrect = function(bError) {
	if (bError)
		addcss(this.__eLi,'error');
	else
		removecss(this.__eLi,'error');
};
