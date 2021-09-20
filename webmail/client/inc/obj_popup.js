_me = obj_popup.prototype;
function obj_popup(){

};
/**
 *
 *		_ondock
 *		_onundock
 *		_onresize
 **/

obj_popup._oldPositioning = currentBrowser() == 'MSIE7' || (navigator && navigator.browser && navigator.browser.engine == 'WebKit');

obj_popup.activeStack = {
	//PRIVATE
	__stack: [],

	//PUBLIC
	add: function(obj){
		this.remove(obj);
		this.__stack.unshift(obj);
		return true;
	},
	// Remove docked windows from active windows stack
	remove: function(obj){
		for(var i = this.__stack.length; i--;)
			if (this.__stack[i] === obj) {
				this.__stack.splice(i,1);
				return true;
			}
	},
	// Focus next window below the docked one
	focusNext: function(){
		var obj = this.get();
		return obj && obj._focus && obj._focus();
	},
	get: function(id){
		return this.__stack[id || 0];
	},
	//Re-order modal popups
	order: function(){
		for (var i = 0, j = this.__stack.length; i<j; i++)
			if (this.__stack[i] && this.__stack[i]._isModal() && this.__stack[i]._focus){
				this.__stack[i]._focus();
				break;
			}
	}
};

AttachEvent(document, "onkeydown", function(e) {
	if (e && e.keyCode==27){
		// Escape will close top most recent window
		var p = obj_popup.activeStack.get();
		if (p){
			if ((e.target.nodeName === 'INPUT' || e.target.nodeName === 'TEXTAREA')){
				if (!p._docked && !p.__hidden && p.__closable && p._main.contains(e.target)){
					p._close(true, e);
				}
			}
			else
			if (!p._docked && !p.__hidden && p.__closable){
				p._close(true, e);
			}
		}
	}
});

_me.__constructor = function(owner){
	this._owner = owner;

	this.__resizable= true;
	this.__closable	= true;
	this.__dockable	= true;
	this.__moveble	= true;

	this.__zindex;
	this.__position = {}; // position memory for fullscrean
	this.__positionShadow = {}; //real possition memory (when shifted)
	this.__hidden = false;

	var me = this;

	/* docking */
	this._mydock;

	/* target elements */
	this.__eTitle		= this._getAnchor('title_text');
	this.__eContainer	= this._getAnchor('container');
	this.__eMain		= this._getAnchor('main');

	/* set zindex */
	this.__eContainer.style.zIndex = this.__zindex = maxZIndex.get();

	// Add to active windows stack
	obj_popup.activeStack.add(this);

	/* onclose event */
	this._add_destructor('_onclose');
	this._add_destructor('__destructor');

	var sResize;

	this.__eContainer.onmousemove = function(e){
		var e = e || window.event,
			elm = e.target || e.srcElement;

		if (this !== elm || !me.__resizable || me.__position.max) {
			this.style.cursor = 'default';
			return;
		}

		var elmleft  = me.__positionShadow.x,
			elmtop   = me.__positionShadow.y,
			elmwidth = elm.offsetWidth,
			elmheight= elm.offsetHeight;

		// left part
		if (e.clientX - elmleft<9){
			// top corner
			if (e.clientY - elmtop<9){
				this.style.cursor = 'nwse-resize';
				sResize = 'lt';
			}
			// bottom corner
			else
			if ((elmtop + elmheight) - e.clientY < 9){
				this.style.cursor = 'nesw-resize';
				sResize = 'lb';
			}
			// side
			else{
				this.style.cursor = 'ew-resize';
				sResize = 'l';
			}
		}
		// right part
		else
		if ((elmleft + elmwidth) - e.clientX<9){
			// top corner
			if (e.clientY - elmtop<9){
				this.style.cursor = 'nesw-resize';
				sResize = 'rt';
			}
			// bottom corner
			else
			if((elmtop + elmheight) - e.clientY < 9){
				this.style.cursor = 'nwse-resize';
				sResize = 'rb';
			}
			// side
			else{
				this.style.cursor = 'ew-resize';
				sResize = 'r';
			}
		}
		// center
		else{
			this.style.cursor = 'ns-resize';

			// top
			if (e.clientY - elmtop < 8)
				sResize = 't';
			// bottom
			else
			if ((elmtop + elmheight) - e.clientY < 8)
				sResize = 'b';
		}
	};
	//msie9 fix, cursor is hanging
	this.__eContainer.onmouseout = function(e){
		this.style.cursor = 'default';
	};

	/* REMOVE EVENT */
	function dispatch(e){
		me.__hideBlock();
		gui._disobeyEvent('mousemove',[me,'__move_handler']);

		if (me._onresize_end)
			me._onresize_end();

		return false;
	};


	//DblClick on Title and Ico for MSIE
	if (currentBrowser() == 'MSIE7')
		this.__eContainer.ondblclick = function(e){
			var e = e || window.event;
			var elm = e.target || e.srcElement;
			switch (elm.id){
			case me._anchors['top']:
			case me._anchors['title']:
				me._maximize();
				if (me._onresize) me._onresize(e,'max');
				me.__exeEvent('onresize',e,{"owner":me,"main":me._main,"body":me.__eContainer,"type":'max'});

				return;

			case me._pathName + '#ico':
			    me._close(true, e);
			}
		};

	this.__eContainer.onmousedown = function(e){

		var e = e || window.event,
			elm = e.target || e.srcElement,
			disp = false,
			bStop = false;

		// set max zindex
		me._focus();

		// resize event
		if (this === elm){
			if (!me.__resizable || me.__position.max)
				return;

			me.__resize (e,sResize);
			disp = true;
		}
		else
		switch (elm.id.substr(me._pathName.length)){
			// move
			case '#top':
			case '#title_text':
			case '#title':

				//DblClick on title for other then MSIE browsers
				if (!this.ondblclick)
					var t = +new IcewarpDate();
					if (this.__lastClick && this.__lastClick+600>t){
						this.__lastClick = 0;

						me._maximize();
						if (me._onresize) me._onresize(e,'max');
						me.__exeEvent('onresize',e,{"owner":me,"main":me._main,"body":me.__eContainer,"type":'max'});

						return;
					}
					else
						this.__lastClick = t;


				if (!me.__moveble) return;

				me.__showBlock('m');

				// var difX = e.clientX - me.__eContainer.offsetLeft;
				// var difY = e.clientY - me.__eContainer.offsetTop;

				var difX = e.clientX - me.__positionShadow.x,
					difY = e.clientY - me.__positionShadow.y;

				if (me.__move_handler)
					gui._disobeyEvent('mousemove',[me,'__move_handler']);

				me.__move_handler = function(e){
					me._place(e.clientX - difX,e.clientY - difY);
				};
				gui._obeyEvent('mousemove',[me,'__move_handler']);
				if (me._onmove)
					me._onmove(e);

				disp = true;

				break;

			// maximalize
			case '#max':
				if (e.button<2){
					me._maximize();
					if (me._onresize) me._onresize(e,'max');
					me.__exeEvent('onresize',e,{"owner":me,"main":me._main,"body":me.__eContainer,"type":'max'});
				}

				bStop = true;
				break;
			// minimalize
			case '#min':
				if (!me._isModal() && e.button<2)
					me._dock();

				bStop = true;
				break;
			// close by ico for other then MSIE
			case '#ico':
                if (this.ondblclick)
                    break;
				else
				{
					var t = +new IcewarpDate();
					if (!this.__lastClick || this.__lastClick+600<t){
						this.__lastClick = t;
						break;
					}
				}
			// close
			case '#rem':
				if (me.__closable && e.button<2)
					me._close(true, e);

				bStop = true;
				break;
		}

		if (disp || bStop){
			//propagate click to close context-menus, etc...
			document.onclick({type:'click', 'clientY':e.clientY, 'clientX':e.clientX,'target':elm});

			if (disp)
				gui._obeyEvent('mouseup',[dispatch,[e]]);

			if (bStop){
				e.cancelBubble = true;
				if (e.preventDefault) e.preventDefault();
				if (e.stopPropagation) e.stopPropagation();
			}
			return false;
		}
	};

	// Focus the field user typed in last
	this.__eContainer.onmouseup = function(e){
		if (!Is.Child(e.target, me.__eMain))
			if (!me._preventfocus && me._activeElement) {
				if (document.activeElement != me._activeElement)
					me._activeElement.focus();
			}
			else
				document.activeElement && document.activeElement.blur && document.activeElement.blur();
	};

	this.__eMain.scrollTop = 0;
	this.__eContainer.scrollTop = 0;

	// Monitor any elements getting selected within the popup
	this._activeElement = null;
	if (document.addEventListener) {

		// Remember last active element in this popup
		this.__eContainer.addEventListener('focus', function(e){
			var elm = e.target;

			// Handle special case of rich text area focus OLD
			if (elm.nodeName=='DIV' && elm.getElementsByTagName('iframe').length) {
				elm = elm.getElementsByTagName('iframe')[0];
				elm = elm.contentWindow.document.body;
			}

			if (elm.nodeName=='BODY' || (('onfocus' in elm) && elm.getAttribute('iw-focus') != 'false'))
				me._activeElement = elm;

		},true);
	}

	obj_popup.activeStack.order();

	//window resize
	gui._obeyEvent('resize',[this,'__checkPosition']);

	AttachEvent(this._main, "onfocusin", function(e) {
		me._activate();
	});

};

_me._dockable = function(b){
	this._getAnchor('min').style.display = (this.__dockable = (b?true:false))?'':'none';
};
_me._resizable = function(b){
	this._getAnchor('max').style.display = (this.__resizable	= (b?true:false))?'':'none';
};
_me._closable = function(b){
	if ((this.__closable = b?true:false))
		removecss(this._getAnchor('rem'),'dim');
	else
		addcss(this._getAnchor('rem'),'dim');
};
_me._moveble = function(b){
	this.__moveble	= b?true:false;
};
_me._autofocusfields = function(b) {
	this._preventfocus = !b;
};

// Show in full screen mode (elm to show, by default popup content)
_me._fullscreen = function(elm) {
	if(!elm)
		elm = this._getAnchor('box') || this.__eMain;

	var fullelm = this._isfullscreen();
	var fullscreen = elm.requestFullscreen || elm.msRequestFullscreen || elm.mozRequestFullScreen || elm.webkitRequestFullscreen;
	if(fullscreen && !fullelm) {
		// Request fullscreen for element
		fullscreen.apply(elm);
		// Prevent key press events from propagating to normal interface
		if(fullelm = this._isfullscreen())
			fullelm.onkeydown = function(e) {
				e.stopPropagation();
			};
	} else if(fullelm) {
		// Exit full screen mode
		var exit = document.exitFullscreen || document.msExitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen;
		exit.apply(document);
	}
};
// Check if currently in full screen mode
_me._isfullscreen = function() {
	return document.fullscreenElement || document.msFullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
};

_me.__onCreateChild = function(sName,sType,sTarget){
	if (sTarget == 'footer' || sTarget == 'header'){
		var elm = this._getAnchor(sTarget);
			elm.style.display = 'block';

		this._getAnchor('box').style[sTarget=='header'?'paddingTop':'paddingBottom'] = elm.offsetHeight + 'px';
		elm = null;
	}
};
_me.__onDestroyChild = function(sName,sType,sTarget){
	if (sTarget == 'footer' || sTarget == 'header'){
		if (this._getChildObjects(sTarget).length>0)
			this._getAnchor('box').style[sTarget=='header'?'paddingTop':'paddingBottom'] = this._getAnchor(sTarget).offsetHeight + 'px';
		else{
			this._getAnchor(sTarget).style.display = 'none';
			this._getAnchor('box').style[sTarget=='header'?'paddingTop':'paddingBottom'] = 0;
		}
	}
};

_me.__hide = function(){
	this.__eContainer.style.zIndex = -1000;

	this.__hidden = true;

	if (this._isModal()){
		this.__modaldiv.style.display = 'none';
	}

	// Remove docked windows from active windows stack
	obj_popup.activeStack.remove(this);
	// Focus next window below the docked one
	obj_popup.activeStack.focusNext();

	this.__exeEvent('onhide','',{"owner":this});
};
_me.__show = function(){
	this.__eContainer.style.zIndex = this.__zindex;

	this.__hidden = false;

	if (this._isModal()){
		this.__modaldiv.style.display = 'block';
	}

	obj_popup.activeStack.add(this);

	this.__exeEvent('onshow','',{"owner":this});
};

/**
 * Hidden over-div
 * It avoind of gui selections
 * 22.5.2008 14:06:40
 **/
_me.__showBlock = function(sResize){

	if (!this.__maskDIV){
		this.__maskDIV = mkElement('div',{className:'obj_popup_mask'});

		var me = this;
		this.__maskDIV.onclick = function(){
			me.__hideBlock();
		};

		document.getElementsByTagName('body')[0].appendChild(this.__maskDIV);
	}

	if (sResize)
		this.__maskDIV.style.cursor = {m:'Move',tl:'se-resize',lb:'sw-resize',l:'w-resize',rt:'sw-resize',rb:'se-resize',r:'w-resize',t:'s-resize',b:'s-resize'}[sResize];

};
_me.__hideBlock = function(){
	if (this.__maskDIV){
		try{
			this.__maskDIV.parentNode.removeChild(this.__maskDIV);
		}catch(e){gui._REQUEST_VARS.debug && console.log(this._name||false,e);}
		this.__maskDIV = null;

		return true;
	}
	return false;
};


_me._dock = function (skip){
	var dock = this._mydock || gui._dock,
		sTitle = false,
		sCSS = '';

	if (!this.__dockable || !dock) return;

	// If implemented, fire ondock
	if (this._ondock){
		var out = this._ondock(dock);
		// If returns falsy value, skip docking
		if (!out)
			return;
		else
		// Otherwise, try to get title
		if (Is.String(out))
			sTitle = out;
		else
		if (Is.Object(out)){
			if (Is.Defined(out.title))
				sTitle = out.title;
			if (Is.Defined(out.css))
				sCSS = out.css;
		}
	}

	// If no title was supplied use popup title
	if (!Is.String(sTitle))
		sTitle = this._title().unescapeHTML();

	// Remove docked windows from active windows stack
	obj_popup.activeStack.remove(this);
	// Focus next window below the docked one
	obj_popup.activeStack.focusNext();

	// Visually docking;
	this.__eContainer.style.marginLeft = '-300%';
	this.__eContainer.style.visibility = 'hidden';

	//visibility:hidden doesn't prevent FFox of keeping focus
	if ('activeElement' in document){
		var elm = document.activeElement;
		if (elm && elm !== document.body && typeof elm.blur == 'function' && Is.Child(elm,this._main)){
			elm.blur();
		}
	}

	this._docked = true;

	if (!skip) dock._add(this,sTitle,sCSS);

	return true;
};


_me._undock = function (skip){
	var dock = this._mydock || gui._dock;
	if (dock && this._docked){

		this.__eContainer.style.marginLeft = 'auto';
		this.__eContainer.style.visibility = 'visible';

		this._docked = false;

		if (!skip)
			dock._remove(this);

		this._focus();

		if (this._onundock)
			this._onundock(dock);

		return true;
	}
};

// _me._ondock = function(){};
// _me._onundock = function(){};

_me.__resize = function(e,sResize){

	var me = this;
	var difX,difY,dif1,dif2,dif3,dif4;

	//remove old handler
	if (this.__move_handler){
		gui._disobeyEvent('mousemove',[this,'__move_handler']);
		this.__move_handler = null;
	}

	this.__showBlock(sResize);

	var position = getSize(this.__eContainer);

	switch(sResize){
	case 't' :
		difY = e.clientY;
		dif1 = position.h;
		dif2 = position.y;

		me.__move_handler = function(evn){
			var evn = evn || window.event,
				Y = evn.clientY;

		    Y = Y<0?0:Y;
			Y -= difY;

			if (dif1 - 101<Y)
				Y = dif1 - 100;

			me._place('',(dif2 + Y),'',(dif1 - Y));

			/*** resize event ***/
			if (me._onresize) me._onresize(e,'t');
			me.__exeEvent('onresize',e,{"owner":me,"main":me.__eContainer,"body":me.__eMain,"type":'t'});
		};

		break;

	case 'lt':
		difY = e.clientY;
		difX = e.clientX;
		dif1 = position.h;
		dif2 = position.y;
		dif3 = position.w;
		dif4 = position.x;

		me.__move_handler = function(evn){
			var evn = evn || window.event,
				X = evn.clientX,
				Y = evn.clientY;

			X = X<0?0:X;
			Y = Y<0?0:Y;

			var size1 = dif1 - Y + difY;
			if (size1<101){
				  Y = dif1 + difY - 100;
				  size1 = 100;
			}

			var size3 = dif3 - X + difX;
			if (size3<201){
				X = dif3 + difX - 200;
				size3 = 200;
			}

			var size2 = dif2 + Y - difY;
			var size4 = dif4 - difX + X;

			me._place(size4,size2,size3,size1);

			/*** resize event ***/
			if (me._onresize) me._onresize(e,'lt');
			me.__exeEvent('onresize',e,{"owner":me,"main":me.__eContainer,"body":me.__eMain,"type":'lt'});
		};

		break;

	case 'l' :
		difX = e.clientX;
		dif1 = position.w;
		dif2 = position.x;

		me.__move_handler = function(evn){
			var evn = evn || window.event,
				X = evn.clientX;

			X = X<0?0:X;

			var size1 = dif1 - X + difX;
			if (size1<201){
				X = dif1 - 200 + difX;
				size1 = 200;
			}

			var size2 = dif2 - difX + X;

			me._place(size2,'',size1);

			/*** resize event ***/
			if (me._onresize) me._onresize(e,'l');
			me.__exeEvent('onresize',e,{"owner":me,"main":me.__eContainer,"body":me.__eMain,"type":'l'});
		};

		break;

	case 'lb':
		difX = e.clientX;
		difY = e.clientY;
		dif1 = position.w;
		dif2 = position.x;
		dif3 = position.h;

		me.__move_handler = function(evn){
			var evn = evn || window.event,
				X = evn.clientX,
				Y = evn.clientY;

			X = X<0?0:X;
			Y = Y<0?0:Y;

			var size1 = dif1 - X + difX;
			if (size1<200){
                X = dif1 - 200 + difX;
                size1 = 200;
			}

			var size2 = dif2 - difX + X;

			var size3 = dif3 + Y - difY;
			if (size3<100)
				size3 = 100;

			me._place(size2,'',size1,size3);

			/*** resize event ***/
			if (me._onresize) me._onresize(e,'lb');
			me.__exeEvent('onresize',e,{"owner":me,"main":me.__eContainer,"body":me.__eMain,"type":'lb'});
		};

		break;
	case 'b' :
		difY = e.clientY;
		dif1 = position.h;

		me.__move_handler = function(evn){
			var evn = evn || window.event,
				Y = evn.clientY;
				Y = Y<0?0:Y;

			var size = dif1 + Y - difY;
				size = size<100?100:size;

			me._size('',size);

			/*** resize event ***/
			if (me._onresize) me._onresize(e,'b');
			me.__exeEvent('onresize',e,{"owner":me,"main":me.__eContainer,"body":me.__eMain,"type":'b'});
		};

		break;
	case 'rb':
		difX = e.clientX;
		difY = e.clientY;
		dif1 = position.w;
		dif2 = position.h;

		me.__move_handler = function(evn){
			var evn = evn || window.event,
				X = evn.clientX,
				Y = evn.clientY;

			X = X<0?0:X;
			Y = Y<0?0:Y;

			var size1 = dif1 + X - difX;
				size1 = size1<200?200:size1;
			var size2 = dif2 + Y - difY;
			    size2 = size2<100?100:size2;

			me._size(size1,size2);

			/*** resize event ***/
			if (me._onresize) me._onresize(e,'rb');
			me.__exeEvent('onresize',e,{"owner":me,"main":me._main,"body":me.__eContainer,"type":'rb'});
		};

		break;
	case 'r' :
		difX = e.clientX;
		dif1 = position.w;

		me.__move_handler = function(evn){
			var evn = evn || window.event,
				X = evn.clientX;
				X = X<0?0:X;

			var size1 = dif1 + X - difX;
   				size1 = size1<200?200:size1;

			me._size(size1);

			/*** resize event ***/
			if (me._onresize) me._onresize(e,'r');
			me.__exeEvent('onresize',e,{"owner":me,"main":me._main,"body":me.__eContainer,"type":'r'});
		};

		break;
	case 'rt':
		difX = e.clientX;
		difY = e.clientY;
		dif1 = position.w;
		dif2 = position.h;
		dif3 = position.y;

		me.__move_handler = function(evn){
			var evn = evn || window.event,
				Y = evn.clientY,
				X = evn.clientX;

			Y = Y<0?0:Y;
			X = X<0?0:X;

			var size2 = dif2 - Y + difY;
			if (size2<100){
				Y = dif2 - 100 + difY;
                size2 = 100;
			}

			var size3 = dif3 + Y - difY;

			var size1 = dif1 + X - difX;
            	size1 = size1<200?200:size1;

			me._place('',size3,size1,size2);

			/*** resize event ***/
			if (me._onresize) me._onresize(e,'rt');
			me.__exeEvent('onresize',e,{"owner":me,"main":me._main,"body":me.__eContainer,"type":'rt'});
		};

		break;
	}

	if (this.__move_handler && this.__move_handler!= null)
		gui._obeyEvent('mousemove',[this,'__move_handler']);
};

_me._title = function(sVal,bText){
	if (typeof sVal == 'undefined')
		return this.__eTitle.innerHTML;
	else
	if (bText)
		this.__eTitle.innerHTML = sVal?sVal.escapeHTML():'';
	else{
		var tmp = getLang(sVal);
		this.__eTitle.innerHTML = tmp?tmp.escapeHTML():'';
	}
};

_me._close = function(b, e){
	if (!this.__closable || (this._onclose && !this._onclose(b, e))) return false;
    this._remove_destructor('_onclose');
	this._destruct();
	return true;
};

/**
 * e - optional event parameter
 **/
_me._focus = function (){
	if (this._docked && this._undock())
		return;

	// Remove previous z-index and assign new top value
	maxZIndex.remove(this.__zindex);
	this.__zindex = maxZIndex.get();

	// modal window
	/*if (this._isModal()){
		this.__eContainer.style.zIndex = this.__zindex + 1000/;
		if (this.__modaldiv){
			this.__modaldiv.style.zIndex = (this.__zindex + 1000 - 1);
		}
	}
	else*/
		this.__eContainer.style.zIndex = this.__zindex;
		if (this.__modaldiv){
			this.__modaldiv.style.zIndex = this.__zindex - 1;
		}

	// Remove docked windows from active windows stack
	obj_popup.activeStack.add(this);

	// Execute any specific focus action
	if (this._onfocus)
		this._onfocus();

	// Make sure that any modal windows always stays atop
	if (!this.__modaldiv)
		obj_popup.activeStack.order();

	this._activate();
};

_me._activate = function(){
	if (!hascss(this._main, 'active')){
		addcss(this._main, 'active');

		var pops = gui._main.querySelectorAll('div.obj_popup');
		for(var i = pops.length; i--;){
			if (this._main !== pops[i])
				removecss(pops[i], 'active');
		}
	}
};

_me._isModal = function(){
	return this.__modaldiv?true:false;
};

_me._modal = function(b){

	this._dockable(!b);

	if(b && !this.__modaldiv){
		// Remove previous z-index and assign new top value
		maxZIndex.remove(this.__zindex);
		this.__zindex = maxZIndex.get();

		this.__eContainer.style.zIndex = this.__zindex/* + 1000*/;

		//modal window
		this.__modaldiv = mkElement("div");
		this.__modaldiv.style.zIndex = this.__zindex/* + 1000*/ - 1;
		this._main.insertBefore(this.__modaldiv,this.__eContainer);

		this.__modaldiv.className = 'obj_popup_modaldiv';

		addcss(this._main,'modal');
	}
	else
	if(!b && this.__modaldiv){
		this._main.removeChild(this.__modaldiv);
		this.__modaldiv = null;

		this.__eContainer.style.zIndex = this.__zindex;

		removecss(this._main,'modal');
	}
};

_me._maximize = function(bWait){

	if (this.__resizable==false) return;

	if (this.__position.max){
		this.__moveble	= true;
		this.__position.max = 0;
		removecss(this.__eContainer,'maximized');
		this._place(this.__position.x,this.__position.y,this.__position.w,this.__position.h);
	}
	else{

		this.__position.max = 1;
		this.__moveble	= false;

		var tmp = clone(this.__position,true);

		if(bWait){
			var me = this;

			this.__position_tmp = tmp;

			window.setTimeout(function(){
				try{
					addcss(me.__eContainer,'maximized');
					me._place(0,0,document.body.offsetWidth ,document.body.offsetHeight + (me.__eMain.offsetHeight - me.__eContainer.offsetHeight));
					me.__position = me.__position_tmp;
				}
				catch(er){gui._REQUEST_VARS.debug && console.log(this._name||false,er);}
			},500);
		}
		else{
			addcss(this.__eContainer,'maximized');
			this._place(0,0,document.body.offsetWidth ,document.body.offsetHeight);
			this.__position = tmp;
		}
	}
};

_me._defaultSize = function(x,y,w,h,bMax) {

	//any change will be stored into cookie
	this.__defaultSize = {x:x,y:y,w:w,h:h,max:bMax};

	//get proper cookie
	var aSize;
	if (Cookie)
		aSize = Cookie.get(['popup_'+this._type,screen.width+'x'+screen.height]);

	if (Is.Defined(aSize)) {
		if (Is.Defined(aSize['x']) && (x = parseInt(aSize['x']) || 0))
			x = Math.max(0,x);

		if (Is.Defined(aSize['y']) && (y = parseInt(aSize['y']) || 0))
			y = Math.max(0,y);

		if (aSize['w'] && (w = parseInt(aSize['w'])))
			w = Math.max(200, w);

		if (aSize['h'] && (h = parseInt(aSize['h'])))
			h = Math.max(88, h);

		if (aSize['max'])
			bMax = !!aSize['max'];
	}

	this.__position.x = x;
	this.__position.y = y;
	this.__position.w = w;
	this.__position.h = h;
	this.__positionShadow = clone(this.__position);

	if (bMax){
		this._maximize();
	}
	else
	if (Is.Number(x) && Is.Number(y) && x >= 0 && y >= 0) {
		// Shift non-modal popups, set place
		this._placeShift();
	}
	else
	if (Is.Number(w) && w > 0) {
		if (Is.Number(h) && h > 0)
			this._size(w,h,1);
		else
			this._size(w,'',1);

		// Shift non-modal popups
		if (!this._isModal())
			this._placeShift(true);
	}

	// register function that will store current size
	this._add_destructor('__rememberSize');
};

	_me.__rememberSize = function(){
		if (Cookie){
			var tmp = clone(this.__position);

			for (var i in tmp)
				if (tmp[i] == this.__defaultSize[i])
					delete tmp[i];

			Cookie.set(['popup_'+this._type,screen.width+'x'+screen.height],tmp);
		}
	};

/**
 * @param {bool} bShiftOnly		do not set new position when no shift detected
 */
_me._placeShift	= function(bShiftOnly){

	var bForced = false;
	var x = this.__positionShadow.x,
		y = this.__positionShadow.y,
		w = this.__positionShadow.w,
		h = this.__positionShadow.h;

	if (!this._isModal()){
		//Get all instances
		var aPop = gui._getChildObjects('main', this._type),
			iH = gui._main.offsetHeight,
			iW = gui._main.offsetWidth,
			bShifted = false;

		for (var i = aPop.length; i--;){
			if (aPop[i] !== this && !aPop[i]._destructed && !aPop[i]._docked){
				if (x == aPop[i].__positionShadow.x && y == aPop[i].__positionShadow.y){
					bForced = true;

					x += 30;
					y += 30;

					if (!bShifted && (iH<y+h || iW<x+w)){
						y = 30;
						x = 30;
						bShifted = true;
					}

					i = aPop.length;
				}
			}
		}
	}

	if (!bShiftOnly || bForced){
		if (Is.Number(w) && w > 0) {
			if (Is.Number(h) && h > 0)
				this._place(x,y,w,h,bForced);
			else
				this._place(x,y,w, undefined, bForced);
		}
		else
			this._place(x,y, undefined, undefined, bForced);
	}
};

_me._place = function(x,y,w,h, bForced){

	if (!Is.Defined(x) && !Is.Defined(y) && !Is.Defined(w) && !Is.Defined(h))
		return this.__position;

	var iH = gui._main.offsetHeight,
		iW = gui._main.offsetWidth,
		bRender = this.__eContainer.style.transform == "";

	//check position (move window fully into view if part of it is outside of viewable area)
	if (!this.__position.max && Is.Defined(x) && Is.Defined(y) && Is.Defined(w) && Is.Defined(h)){
		if(h > window.innerHeight) {
			h = window.innerHeight;
		}
		//HEIGHT
		if (iH<y+h){
			y = iH-h;

			// if less space than popup size is available
			if (y<0){
				if (this.__resizable)
					h = Math.max(88, h+y);

				y = 0;
			}

			bForced = true;
		}

		//WIDTH
		if (iW<x+w){
			x = iW-w;

			// if less space than popup size is available
			if (x<0){
				if (this.__resizable)
					w = Math.max(200, w+x);

				x = 0;
			}

			bForced = true;
		}
	}

	if (Is.Number(x)){
		x = Math.max(0, (x>iW-100?iW-100:x));

		if (this.__positionShadow.x != x)
			bRender = true;

		this.__positionShadow.x = x;
		if (!bForced)
			this.__position.x = x;
	}

	if (Is.Number(y)){
		y = Math.max(0, (y>iH-100?iH-100:y));

		if (this.__positionShadow.y != y)
			bRender = true;

		this.__positionShadow.y = y;
		if (!bForced)
			this.__position.y = y;
	}

	if (bRender){
		if (obj_popup._oldPositioning){
			this.__eContainer.style.left = this.__positionShadow.x +'px';
			this.__eContainer.style.top = this.__positionShadow.y +'px';
		}
		else
			this.__eContainer.style.transform = 'translate('+ this.__positionShadow.x +'px,'+ this.__positionShadow.y +'px)';
	}

	if (Is.Number(w) || Is.Number(h))
		this._size(w,h,false, bForced);
};

_me._size = function (w, h, center, bForced){
	var tmp, bRender = false;

	if (w>=200 || w === 'auto'){
		if (this.__eContainer.offsetWidth != w) {
			this.__eContainer.style.width = w !== 'auto' ? w + 'px' : w;
			w = this.__eContainer.offsetWidth;
		}

		if (center){
			tmp = document.body.clientWidth - w;
			tmp = tmp<0?0:tmp;
			tmp = Math.round(tmp/2);

			this.__positionShadow.x = tmp;
			bRender = true;
		}

		this.__positionShadow.w = w;
		if (!bForced)
			this.__position.w = w;
	}

	if (h>=88 || h === 'auto'){
		if (h === 'auto' && this.__eContainer.clientHeight > window.innerHeight) {
			h = '100%';
		}

		if (this.__eContainer.offsetHeight != h) {
			this.__eContainer.style.height = Is.Number(h) ? h + 'px' : h;
			h = this.__eContainer.offsetHeight;
		}

		if (center){
			tmp = (document.body.clientHeight - h)/2;
			tmp = tmp<0?0:tmp;
			tmp = Math.round(tmp/2);

			this.__positionShadow.y = tmp;
			bRender = true;
		}

		this.__positionShadow.h = h;

		if (!bForced)
			this.__position.h = h;
	}

	if (bRender){
		if (obj_popup._oldPositioning){
			this.__eContainer.style.left = this.__positionShadow.x +'px';
			this.__eContainer.style.top = this.__positionShadow.y +'px';
		}
		else
			this.__eContainer.style.transform = 'translate('+ this.__positionShadow.x +'px,'+ this.__positionShadow.y +'px)';
	}

	// Container is initially hidden, until size is defined so is clear what to show
	this.__eContainer.style.visibility = 'visible';
};

_me.__checkPosition = function(){
	if (!this.__position.max){

		if (!Is.Defined(this.__position.x) || !Is.Defined(this.__position.y))
			var position = getSize(this.__eContainer);
		else
			var position = this.__position;

		this._place(position.x, position.y, position.w, position.h, true);
	}
};


// Check whether the current popup is the topmost
_me._isActive = function() {
	return this === obj_popup.activeStack.get();
};

/**
 * @brief: destructor
 * @date : 4.7.2006 14:38:46
 **/
_me.__destructor = function(){
	this._undock();
	this.__hideBlock();

	// remove object's zindex
	maxZIndex.remove(this.__zindex);

	// Remove docked windows from active windows stack
	obj_popup.activeStack.remove(this);
	// Focus next window below the docked one
	obj_popup.activeStack.focusNext();

	gui._disobeyEvent('resize',[this,'__checkPosition']);
};

/**
 * @brief: onclose method
 **/
//_me._onclose = function(){}
