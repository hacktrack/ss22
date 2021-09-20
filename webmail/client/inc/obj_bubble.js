_me = obj_bubble.prototype;
function obj_bubble(){};

_me.__constructor = function(){
	this.__timer = null;
	this.__state = 'hidden';
	this.__aPos = {};

	this.__modal = false;

	this._add_destructor('_destructor');

	this._main.onmouseover = function(e){
		if (!this._onshow || this._onshow(e) !== false)
			this._show();
	}.bind(this);

	this._main.onmouseout = function(e){
		if (!this.__modal)
			if (!Is.Child(e.relatedTarget,this))
				if (!this._onhide || this._onhide(e) !== false)
					this._hide();
	}.bind(this);

	this._main.style.zIndex = this.__zindex = maxZIndex.get() + 1000;
};

_me._modal = function(b){

	if (b && !this.__modaldiv){

		// Remove previous z-index and assign new top value
		maxZIndex.remove(this.__zindex);
		this._main.style.zIndex = this.__zindex = maxZIndex.get() + 1000;

		//modal window
		this.__modal = true;

		this.__modaldiv = mkElement("div",{className:'obj_bubble_modaldiv'});
		this.__modaldiv.style.zIndex = parseInt(this.__zindex)-1;
		this.__modaldiv.onclick = function(e){
			if (this._onclose)
				this._onclose(e);
		}.bind(this);

		this._main.parentNode.insertBefore(this.__modaldiv,this._main);
	}
	else
	if (!b && this.__modaldiv){
		if (this.__modaldiv.parentNode)
			this.__modaldiv.parentNode.removeChild(this.__modaldiv);

		this.__modaldiv = null;
	}
};

_me._place = function(aPos){
	this.__aPos = aPos;

	if (this.__state == 'visible'){
		this._main.style.left = aPos.left || '';
		this._main.style.right = aPos.right || '';
		this._main.style.top = aPos.top || '';
		this._main.style.bottom = aPos.bottom || '';
	}
};

_me._hide = function(bForce){

	if (this.__timer)
		clearTimeout(this.__timer);

	if (bForce){
		this._main.style.left = '';
		this._main.style.right = '';
		this._main.style.top = '';
		this._main.style.bottom = '';

		removecss(this._main, 'show');
		this.__state = 'hidden';

		this.__modal && this._modal(false);

		if (this._onstate)
			this._onstate(this.__state);
	}
	else
	this.__timer = setTimeout(function(){
		if (this && !this._destructed)
			this._hide(true);
	}.bind(this), 400);
};

_me._show = function(){
	if (this.__timer)
		clearTimeout(this.__timer);

	this._main.style.left = this.__aPos.left || '';
	this._main.style.right = this.__aPos.right || '';
	this._main.style.top = this.__aPos.top || '';
	this._main.style.bottom = this.__aPos.bottom || '';
	//this._main.style.position = this.__aPos.position || '';

	addcss(this._main, 'show');
	this.__state = 'visible';

	this.__modal && this._modal(true);

	if (this._onstate)
		this._onstate(this.__state);
};

_me._destructor = function(){
	if (this.__timer)
		clearTimeout(this.__timer);

	if (this.__modaldiv)
		this._modal(false);
};