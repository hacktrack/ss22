/**
 * PopUp menu
 * Inherite: obj_hmenu
 **/
_me = obj_context.prototype;
function obj_context(){};

_me.__constructor = function(owner){
	var me = this;

	this._owner = owner;
	this._zindex = new cMaxZIndex();

	//pass itself as event attribute
	AttachEvent (this._main, 'onclick', function(e){
		var e = (e || window.event);
			e.__source = {obj:me, skip:true, type:'obj_context'};
	});

	gui._obeyEvent('click',[this,'__destructCmenu']);

	this._add_destructor('__destructClickEvn');
};

_me.__destructCmenu = function(e){

	var elm;
	if (Is.Child(e.target || e.srcElement, this._main) && (elm = Is.Child(e.target || e.srcElement, 'LI', this._main)) && (elm = elm.firstChild) && elm.tagName == 'DIV' && Is.Defined(elm.id)){
		var id = elm.id.substr(this._pathName.length+1);
		if (this.__idtable[id] && this.__idtable[id].keep){
			e.cancelBubble = true;
			if (e.stopPropagation) e.stopPropagation();
			return true;
		}
	}

	if (!this._onclose || this._onclose(true) !== false)
		this._destruct();
};

	_me.__destructClickEvn = function(){

		gui._disobeyEvent('click',[this,'__destructCmenu']);

		if (this._onclose)
			this._onclose();

		if (this.__zindex)
			this._zindex.remove(this.__zindex);

	};

_me._onclick = function(e, elm, id, arg) {
	if (arg)
		executeCallbackFunction(arg);
};

/*
	x, y 		positon
	ws 			optional width
	vertical	1 from top
				2 from top if possible
				3 from bottom
*/
_me._place = function(x,y,ws,vertical,right){

	if (!this.__eArrow)
		this.__eArrow = this._main.appendChild(mkElement('div'));

	//Width
	if (Is.Number(ws)){
		var ul = this._main.getElementsByTagName('UL');
		if (ul && (ul = ul[0])) ul.style.width = ws +'px';
	}

	var pos = getSize(this._main),
		h = window.innerHeight || window.document.body.clientHeight,
		w = window.innerWidth || window.document.body.offsetWidth,
		bottom = false;

	//stupid MSIE fix
	if (pos.w>300) pos.w = 220;

	if (vertical){
		ex = x;
		x -= pos.w/2;

		// X
		x = x<0?0:x;
		if (x+pos.w>w)
			x = w-pos.w;
	}
	else{

		//Arrow
		if (h && y+pos.h>h){
			this.__eArrow.style.top = (y - h + pos.h + 9) + 'px';
			y = h - pos.h;
		}

		y -= 16;

		//WIDTH
		if ((w && x+pos.w+7>w)){
			// If there is no space to the right
			x -= pos.w + 9;
			addcss(this._main,'left');
		}
		else
			x += 7;
	}

	if ((!right && gui._rtl) || (right && !gui._rtl)){
		addcss(this._main, 'right');
		this._main.style.left = 'auto';
		this._main.style.right = (document.body.clientWidth - x - pos.w) + 'px';

		//Arrow
		if (vertical){
			this.__eArrow.style.left = 'auto';
			this.__eArrow.style.right = (document.body.clientWidth - (document.body.clientWidth - x - pos.w) - ex) + 'px';
		}
	}
	else{
		removecss(this._main, 'right');
		this._main.style.left = x +'px';

		//Arrow
		if (vertical){
			this.__eArrow.style.left = (ex - x) + 'px';
			this.__eArrow.style.right = 'auto';
		}
	}

	// Reverse
	if(pos.h > h) {
		addcss(this._main,'scrollable');
	}
	else
	if (vertical==3 || (vertical==2 && y+pos.h>h)){
		if(pos.h > y) {
			addcss(this._main,'scrollable');
		} else {
			addcss(this._main,'bottom');
			this._main.style.bottom = (h-y) +'px';

			bottom = true;
		}
	}
	else{
		if (vertical)
			addcss(this._main,'top');

		this._main.style.top = y +'px';
	}

	//Zindex
	if (this.__zindex)
		this._zindex.remove(this.__zindex);

	this._main.style.zIndex = this.__zindex = this._zindex.get();

	//Save position
	this.__position = {
		x:x,
		y:y,
		bottom:bottom,
		right:right
	};

	if (!this.__position.bottom && !this.__position.right){
		gui._obeyEvent('resize', [this, '__onGuiResize']);
		this._add_destructor('__destructResizeEvn');
	}
};

_me.__onGuiResize = function(){
	var pos = getSize(this._main),
		h = window.innerHeight || window.document.body.clientHeight,
		w = window.innerWidth || window.document.body.offsetWidth;

	//Y
	if (!this.__position.bottom){
		if (pos.y + pos.h + 7 > h || pos.y != this.__position.y) {
			this._main.style.top = Math.min(h - pos.h - 7, this.__position.y) + 'px';
		}
	}

	//X
	if (!this.__position.right){
		if (pos.x + pos.w + 7 > w || pos.x != this.__position.x) {
			this._main.style.left = Math.min(w - pos.w - 7, this.__position.x) + 'px';
		}
	}
};

	_me.__destructResizeEvn = function(){
		gui._disobeyEvent('resize', [this, '__onGuiResize']);
	};
