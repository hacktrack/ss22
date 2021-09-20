/*
._onactive(bool)
*/
_me = obj_tab_core.prototype;
function obj_tab_core(){};

_me.__constructor = function(){

	this._telemetry = 'off'; //telemetry log

	this._isActive = false;
	this._isDisabled = false;
	this._wasActivated = false;

	var me = this;

	this.__drawTpl = null;
	this.__drawObj = null;
	this.__drawData = null;

	// clear memory
	this._add_destructor('__destruct');

	//body onclick
	this._getAnchor('main').onclick = function(e){
		var e = e || window.event,
			elm = e.target || e.srcElement;

		if (me._onclick) me._onclick(e,elm);
		me.__exeEvent('onclick',e,{"elm":elm,"owner":me});
	};
};

_me._disabled = function(b){
	if (b == this._isDisabled) return;
	if (b){
		if (this.__eLi)
			addcss(this.__eLi,'disabled');
		if (this._main)
			addcss(this._main,'obj_tabdisabled');
	}
	else{
		if (this.__eLi)
			removecss(this.__eLi,'disabled');
		if (this._main)
			removecss(this._main,'obj_tabdisabled');
	}

	this._isDisabled = b;
};

_me._readonly = function(){
	if (this._main)
		addcss(this._main,'obj_tabreadonly');

	var obj = this._getChildObjects();
	for (var i in obj)
		if (obj[i]._readonly)
			obj[i]._readonly(true);
		else
		if (obj[i]._disabled)
			obj[i]._disabled(true);
};

/**
 * @Brief: Public function
 **/
_me._active = function(draw, bClick){

	if (this._isDisabled) return;

	if (!Is.Boolean(draw))
		if (!this._wasActivated)
			draw = true;
		else
			draw = false;

	if (!this._isActive){
		this._isActive = true;
		this._wasActivated = true;


		// deactivate previous tab
		var old = this._parent._value();

		this._parent.__value = this._name;

		if (old && this._parent[old])
		this._parent[old].__deactive();

		addcss(this._parent._main,'active');
		if (this._main)
			addcss(this._main,'obj_tab_active');
		if (this.__eLi)
			addcss(this.__eLi,'active');

		// add <draw>
		if (this.__drawTpl){
			if (count(this.__drawTpl[2]) <= 0 && count(this.__drawData) > 0)
				this.__drawTpl[2] = this.__drawData;
			this._draw(this.__drawTpl[0],this.__drawTpl[1],this.__drawTpl[2]);
			this.__drawTpl = null;
		}

		// add <obj>
		if (this.__drawObj){
			this.__addObjects(this.__drawObj,null,this.__drawData);
			this.__drawObj = null;
		}

		//scroll to be visible
		if (this.__eLi)
			this._parent._scrollHeader(this.__eLi);

		//Execute handlers
		if (this._onactive) this._onactive(draw, bClick);
		this.__exeEvent('onactive',null,{"draw":draw, "click":bClick, "owner":this});

		//Select 1st input if no focus was set
		if (this.__tabIndexes && this.__tabIndexes.main && !this.__lastFocus){
			try{
				var tmp = window;
				this.__tabIndexes.main[0].split('.').forEach(function(part) {
					tmp = tmp[part];
				});
				if (tmp._focus && (!tmp._disabled || !tmp._disabled()) && (!tmp._readonly || !tmp._readonly()))
					tmp._focus();
			}
			catch(e){gui._REQUEST_VARS.debug && console.log(this._name||false,e);}
		}

		if (this._parent._onchange)
			this._parent._onchange(this._name);
		this._parent.__exeEvent('onchange',null,{"value":this._name,"owner":this._parent});
	}
	else{
		//Execute handlers
		if (this._onactive) this._onactive(draw, bClick);
		this.__exeEvent('onactive',null,{"draw":draw, "click":bClick, "owner":this});

		if (draw)
			this._wasActivated = true;
	}

	// Re-focus text inputs that were focused last time
	if(!draw && this.__last_focused_field)
		this.__last_focused_field.focus();

	if (draw && this._scrollbar)
		this._scrollbar(this._getAnchor('main'));
};

/**
 * @Brief: Private function to deactivating tab
 * @Date : 3.5.2006 18:55:40
 **/
_me.__deactive = function(bNoEvent){
	if (this._isActive == false) return;

	if (this._main){
		removecss(this._main,'obj_tab_active');

		// Remember last active text input element in this tab
		this.__last_focused_field = document.activeElement && document.activeElement.nodeName=='INPUT' && document.activeElement.type=='text' && Is.Child(document.activeElement,this._main) ? document.activeElement : null;

		// Remove focus from text inputs and remember for next open, strictly necessary only for IE
		var input = this._main.getElementsByTagName('input');
		for(var n = input.length-1; n>0; n--)
			if (input[n].type == "text")
				input[n].blur();
	}

	if (this.__eLi)
		removecss(this.__eLi,'active');

	this._isActive = false;

	if (this._parent._value() == this._name)
		this._parent._value('');

	//Execute handlers
	if (!bNoEvent){
		if (this._ondeactive) this._ondeactive();
		this.__exeEvent('ondeactive',null,{"owner":this});

		if (this._parent._onchange)
			this._parent._onchange('');
	}
};

/**
 * switch to other tab and destroy itself
 **/
_me._close = function (){
	if (this._isActive){

		var aObj = this._parent._getChildObjects(),
			oPrev;

		for (var i in aObj)
			if (aObj[i]._name == this._name){
				if (oPrev){
				    oPrev._active();
				    break;
				}
				else
					oPrev = 1;
			}
		    else
		    if (aObj[i]._active){
				if (oPrev === 1){
					aObj[i]._active();
					break;
				}
				else
					oPrev = aObj[i];
			}
	}

	this._destruct();
};

_me.__destruct = function(){
	if (this._isActive && this._parent._value() == this._name)
		this._parent._value('');

	if (this.__eLi) {
		this.__eLi.parentNode.removeChild(this.__eLi);
		this.__eLi = null;
	}

	this.__eMain = null;

	if (this._onclose)
	    this._onclose();
};
