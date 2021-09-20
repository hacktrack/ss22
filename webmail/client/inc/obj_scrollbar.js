_me = obj_scrollbar.prototype;
function obj_scrollbar(){};

_me.__constructor = function(){
	this.__scrollbars = {};
	this._add_destructor('__sbar_disobey');
};

_me._disable_scrolbar = function(elm, bX, bY){
	if (this.__scrollbars[elm]){
		this.__scrollbars[elm].disabledX = bX === true;
		this.__scrollbars[elm].disabledY = Is.Defined(bY)?(bY?true:false):(bX?true:false);

		if (bX)
			addcss(elm, 'scroll_disabled_x');
		else
			removecss(elm, 'scroll_disabled_x');

		if (bY)
			addcss(elm, 'scroll_disabled_y');
		else
			removecss(elm, 'scroll_disabled_y');
	}
};

/*
	elm		target scrolling block
	elm2	scrollbar parent element [optional]
	elm3	dimension element (viewable area) [optional]

	bX [optional][bool]
	bY [optional][bool]


For Mobile use:

overflow: auto;
-webkit-overflow-scrolling: touch;
-ms-scroll-snap-type: mandatory;
-ms-scroll-snap-points-x: snapInterval(0%, 100%);

*/

_me._scrollbar = function(elm, elm2, elm3, bX, bY){
	var me = this;
	var fx_version = parseInt((window.navigator.userAgent.match(/Firefox\/([0-9]+)\./) || [])[1]) || 0;

	if (navigator.userAgent.indexOf('Mobile')>0){
		this.__sbar_init = function(){};

		elm.style.overflow = 'auto';
		addcss(elm,'scroll_mobile');
		return;
	}
	else
	// Browser with either Touch Events of Pointer Events running on touch-capable device
	// We can not hide scrollbars in FFox < 64
	if (gui.__BROWSER.touch && (currentBrowser() != 'Mozilla' || fx_version>=64)){
		addcss(elm,'scroll_tablet');
	}
	else{
		switch(currentBrowser()){
		case 'MSIE11':
		case 'Chrome':
		case 'Safari':
		case 'Mozilla':
			if (currentBrowser() != 'Mozilla' || fx_version>=64){
				addcss(elm,'scroll_tablet');
				break;
			}

		//legacy, js driven scrolling
		default:

			elm.style.overflow = 'hidden';

			AttachEvent(elm, "onmousewheel", function(e){
				var eSrc = e.srcElement,
					deltaY = e.deltaY,
					deltaX = e.deltaX;

				//Textarea only
				if (eSrc && eSrc !== this && (eSrc.tagName == 'TEXTAREA' || (eSrc.clientHeight<eSrc.scrollHeight && getComputedStyle(eSrc).overflow != 'hidden')) && ((deltaY<0 && eSrc.scrollTop>0) || (deltaY>0 && eSrc.scrollTop+eSrc.clientHeight < eSrc.scrollHeight))){
					return;
				}

				//Invert axis for blocks with horizontal scrollbar only
				if (!deltaX && deltaY && this.scrollHeight<=this.clientHeight){
					deltaX = deltaY;
					deltaY = 0;
				}

				//Propagate if on limit
				if (me.__sbar_wheel(this,deltaX,deltaY) && e.originalEvent){
					e.originalEvent.cancelBubble = true;
					//e.originalEvent.returnValue = false;
					if (e.originalEvent.stopPropagation)
						e.originalEvent.stopPropagation();
				}
			}.bind(elm));

			//bind keyboard scrolling for legacy browser support
			var focusElm = this._main || this._parent._main || elm;
			if (!focusElm.getAttribute('tabindex'))
				focusElm.setAttribute('tabindex',-1);

			AttachEvent(focusElm,'onkeydown',function(e){
				if (e.srcElement === focusElm){
					var deltaX = 0,
						deltaY = 0;

					switch(e.keyCode){
						case 38:
							deltaY = -3;
							break;
						case 40:
							deltaY = 3;
							break;
						case 37:
							deltaX = -3;
							break;
						case 39:
							deltaX = 3;
							break;
						default:
							return;
					}

					me.__sbar_wheel(this,deltaX,deltaY);
				}
			}.bind(elm));
		}
	}

 	this.__scrollbars[elm] = {dock:elm2, dime:elm3, disabledX: (bX===false?true:false), disabledY: (bY===false?true:false)};

	//check size & show scrollbar
	AttachEvent(elm,'onmousemove',function(e){
		me.__sbar_init(this);
	}.bind(elm));
	AttachEvent(elm,'onclick',function(e){
		setTimeout(function(){me.__sbar_init && me.__sbar_init(this)}.bind(this),100);
	}.bind(elm));
	AttachEvent(elm, "onscroll", function(e){
		me.__sbar_init(this,false,true);
	}.bind(elm));
};

_me.__sbar_scroll = function(e,arg,elm,elm2,sType,iScroll,iStart){
	try{
		if (sType == 'Y')
			elm.scrollTop = iScroll + ((elm.scrollHeight - elm.clientHeight) * ((gui['__Y']-iStart)/((elm2.firstChild.offsetHeight)*((100-this.__scrollbars[elm]['y_size'])/100))));
		else {
			var move = ((elm.scrollWidth - elm.clientWidth) * ((gui['__X']-iStart)/(elm2.firstChild.offsetWidth*(100-this.__scrollbars[elm]['x_size'])/100)));

			// For rtl environment calculate offsetRight, offsetLeft implemented differently in each browser
			var ua = navigator.browser;

			if (gui._rtl && ua) {
				elm.scrollLeft = ua.engine=='Trident' || ua.engine=='Spartan' ? iScroll - move : iScroll + move;
				elm.scrollRight = ua.engine=='WebKit' ? elm.scrollWidth - (elm.scrollLeft + elm.offsetWidth) : Math.abs(elm.scrollLeft);
			} else
				elm.scrollLeft = iScroll + move;
		}
	}
	catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r)}
};

_me.__sbar_wheel = function(elm, deltaX, deltaY){
	if (this.__scrollbars[elm]){
		var st1 = elm.scrollTop,
			st2 = elm.scrollLeft;

		if (!this.__scrollbars[elm].disabledX)
			elm.scrollLeft = elm.scrollLeft + (deltaX*12);

		if (!this.__scrollbars[elm].disabledY)
			elm.scrollTop = elm.scrollTop + (deltaY*12);

		return (st1 != elm.scrollTop || st2 != elm.scrollLeft);
	}
};

_me.__sbar_init = function(elm, bRedraw, bShow){

	if (!this.__scrollbars[elm]){
		if (bRedraw) return;
		this.__scrollbars[elm] = {};
	}

	if ((this.__scrollbars[elm].disabledX && this.__scrollbars[elm].disabledY) || (bRedraw && ((this.__scrollbars[elm].disabledX && !this.__scrollbars[elm].y) || (this.__scrollbars[elm].disabledY && !this.__scrollbars[elm].x))))
		return;

	var x = Math.ceil(elm.clientWidth/(elm.scrollWidth/100)),
		y = Math.ceil(elm.clientHeight/(elm.scrollHeight/100)),
		me = this;

	//SHOW Vertical
	if (!this.__scrollbars[elm].disabledY && y<100){

		//Min Size - no division by zero
		var iMin = elm.clientHeight ? 20/(elm.clientHeight/100) : 1;

		y = y<iMin?Math.ceil(iMin):y;

		this.__scrollbars[elm].y_size = y;

		if (this.__scrollbars[elm].y && this.__scrollbars[elm].y.parentNode == (this.__scrollbars[elm].dock || elm)){
			if (bShow){
				if (Is.Defined(this.__scrollbars[elm].t))
					window.clearTimeout(this.__scrollbars[elm].t);

				removecss(this.__scrollbars[elm].y, 'hide');
			}
		}
		else{
			this.__scrollbars[elm].y = mkElement('em',{className:'sbarY'});
			this.__scrollbars[elm].y.innerHTML = '<ins><sub ondragstart="return false;" unselectable="on"></sub></ins><b ondragstart="return false;" unselectable="on"></b><i ondragstart="return false;" unselectable="on"></i>';

			//obey Events
			this.__scrollbars[elm].y.ondblclick = this.__scrollbars[elm].y.onclick = function(e){
				var e = e || window.event;
				e.cancelBubble = true;
				if (e.preventDefault) e.preventDefault();
				if (e.stopPropagation) e.stopPropagation();
				return false;
			};

			this.__scrollbars[elm].y.onmousedown = function(e, bScrollInt){
				var e = e || window.event,
					tmp = e.target || e.srcElement;

				switch(tmp.tagName){
					//scroll
				case 'SUB':
					addcss(this,'active');
					gui._obeyEvent('mouseup',[me,'__sbar_disobey',[this]]);
					gui._obeyEvent('mousemove',[me,'__sbar_scroll',[elm,this,'Y',elm.scrollTop,gui.__Y]]);

					bScrollInt = true;
					break;

					//buttons
				case 'B':
					elm.scrollTop -= Math.ceil(elm.clientHeight/4);
					break;

				case 'I':
					elm.scrollTop += Math.ceil(elm.clientHeight/4);
					break;

				case 'EM':
				case 'INS':

					//page
					var sub = this.firstChild.firstChild,
						pos2 = getSize(sub),
						y = gui.__Y; //(Is.Number(e.layerY)?e.layerY:e.y)- pos1.y

					//PgUp
					if (y<pos2.y)
						elm.scrollTop -= elm.clientHeight;
					else
					//PgDown
					if (y>pos2.y+pos2.h)
						elm.scrollTop += elm.clientHeight;
					else{
						if (y<pos2.y + (pos2.h*0.25))
							elm.scrollTop -= elm.clientHeight/3;
						else
						if (y>pos2.y + (pos2.h*0.75))
							elm.scrollTop += elm.clientHeight/3;
					}
					break;

				default:
					bScrollInt = true;
				}

				this.onclick(e);

				if (!bScrollInt){

					if (Is.Defined(me.__scrollbars[elm].__scrollint))
						window.clearInterval(me.__scrollbars[elm].__scrollint);

					me.__scrollbars[elm].__scrollint = window.setInterval(function(){
						me.__scrollbars[elm].y.onmousedown({srcElement:tmp},true);
					},500);

					gui._obeyEvent('mouseup',[function(){
						if (Is.Defined(me.__scrollbars[elm].__scrollint))
							window.clearInterval(me.__scrollbars[elm].__scrollint);
						return false;
					}]);
				}

				return false;
			};

			(this.__scrollbars[elm].dock || elm).appendChild(this.__scrollbars[elm].y);
		}

		if(this.__scrollbars[elm].dime)
			this.__scrollbars[elm].y.style.height = this.__scrollbars[elm].dime.offsetHeight + 'px';

		this.__scrollbars[elm].y.firstChild.firstChild.style.height = y + '%';
		this.__scrollbars[elm].y.firstChild.firstChild.style.top = (100-y)*(elm.scrollTop/(elm.scrollHeight-elm.clientHeight)) + '%';

		//Show Buttons for detail scrolling
		if (elm.scrollHeight/elm.clientHeight>3)
			addcss(this.__scrollbars[elm].y, 'long');
		else
			removecss(this.__scrollbars[elm].y, 'long');
	}
	else
	if (this.__scrollbars[elm].y){
		if (this.__scrollbars[elm].y.parentNode)
			(this.__scrollbars[elm].dock || elm).removeChild(this.__scrollbars[elm].y);

		delete this.__scrollbars[elm].y;
	}

	//SHOW Horizontal
	if (!this.__scrollbars[elm].disabledX && x<100){

		if (gui._rtl)
		 	elm.scrollRight = navigator.browser && navigator.browser.engine=='WebKit' ? elm.scrollWidth - (elm.scrollLeft + elm.offsetWidth) : Math.abs(elm.scrollLeft);

		//Min Size - no division by zero
		var iMin = elm.clientWidth ? 20/(elm.clientWidth/100) : 1;
		x = x<iMin?Math.ceil(iMin):x;

		this.__scrollbars[elm].x_size = x;

		if (this.__scrollbars[elm].x && this.__scrollbars[elm].x.parentNode == (this.__scrollbars[elm].dock || elm)){
			if (bShow){
				if (Is.Defined(this.__scrollbars[elm].t))
					window.clearTimeout(this.__scrollbars[elm].t);

				removecss(this.__scrollbars[elm].x, 'hide');
			}
		}
		else{
			this.__scrollbars[elm].x = mkElement('em',{className:'sbarX'});
			this.__scrollbars[elm].x.innerHTML = '<ins><sub ondragstart="return false;" unselectable="on"></sub></ins>';


			//obey Events
			this.__scrollbars[elm].x.ondblclick = this.__scrollbars[elm].x.onclick = function(e){
				var e = e || window.event;
				e.cancelBubble = true;
				if (e.preventDefault) e.preventDefault();
				if (e.stopPropagation) e.stopPropagation();
				return false;
			};

			//obey Events
			this.__scrollbars[elm].x.onmousedown = function(e,bScrollInt){
				var e = e || window.event,
					tmp = e.target || e.srcElement;

				e.cancelBubble = true;
				if (e.preventDefault) e.preventDefault();
				if (e.stopPropagation) e.stopPropagation();

				switch(tmp.tagName){
				case 'SUB':
					addcss(this,'active');

					me.__scrollbars[elm].sl = elm.scrollLeft;

					gui._obeyEvent('mouseup',[me,'__sbar_disobey',[this]]);
					gui._obeyEvent('mousemove',[me,'__sbar_scroll',[elm,this,'X',elm.scrollLeft,gui.__X]]);

					bScrollInt = true;
					break;

				case 'INS':
				case 'EM':

					var sub = this.firstChild.firstChild,
						pos2 = getSize(sub),
						x = gui.__X/*(Is.Number(e.layerX)?e.layerX:e.x) + pos1.x*/;

						//PgUp
					if (x<pos2.x)
						elm.scrollLeft -= elm.clientWidth;
					else
					//PgDown
					if (x>pos2.x+pos2.w)
						elm.scrollLeft += elm.clientWidth;
					else{
						if (x<pos2.x + (pos2.w*0.25))
							elm.scrollLeft -= elm.clientWidth/3;
						else
						if (x>pos2.x + (pos2.w*0.75))
							elm.scrollLeft += elm.clientWidth/3;
					}

					break;

				default:
					bScrollInt = true;
				}

				this.onclick(e);

				if (!bScrollInt){

					if (Is.Defined(me.__scrollbars[elm].__scrollint))
						window.clearInterval(me.__scrollbars[elm].__scrollint);

					me.__scrollbars[elm].__scrollint = window.setInterval(function(){
						//me.__scrollbars[elm].x.onmousedown({srcElement:tmp},true);
						this.onmousedown({srcElement:tmp},true);
					}.bind(this),500);

					gui._obeyEvent('mouseup',[function(){
						if (Is.Defined(me.__scrollbars[elm].__scrollint))
							window.clearInterval(me.__scrollbars[elm].__scrollint);
						return false;
					}]);
				}

				return false;
			};

			(this.__scrollbars[elm].dock || elm).appendChild(this.__scrollbars[elm].x);
		}

		this.__scrollbars[elm].x.firstChild.firstChild.style.width = x + '%';
		this.__scrollbars[elm].x.firstChild.firstChild.style[gui._rtl?'right':'left'] = (100-x)*(elm[gui._rtl?'scrollRight':'scrollLeft']/(elm.scrollWidth-elm.clientWidth)) + '%';
	}
	else
	if (this.__scrollbars[elm].x){
		if (this.__scrollbars[elm].x.parentNode)
			(this.__scrollbars[elm].dock || elm).removeChild(this.__scrollbars[elm].x);

		delete this.__scrollbars[elm].x;
	}

	if (y<100 || x<100){
		var me = this;
		this.__scrollbars[elm].t = window.setTimeout(function(){
			try{
				me.__sbar_hide(elm);
			}catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r)}
		},1000);
	}
};

//Hide all scollbars
_me.__sbar_hide = function(elm){
	if (this.__scrollbars[elm]){
		if (this.__scrollbars[elm].x)
			addcss(this.__scrollbars[elm].x,'hide');

		if (this.__scrollbars[elm].y)
			addcss(this.__scrollbars[elm].y,'hide');
	}
};

_me.__sbar_disobey = function(e,arg,elm){

	for (var bar in this.__scrollbars){
		if ((!elm || bar === elm) && Is.Defined(this.__scrollbars[bar].__scrollint))
			window.clearInterval(this.__scrollbars[bar].__scrollint);
	}

	gui._disobeyEvent('mouseup',[this,'__sbar_disobey']);
	gui._disobeyEvent('mousemove',[this,'__sbar_scroll']);

	if (elm)
		removecss(elm,'active');

	//remove scrollbar DOM elements
	for(var bar in this.__scrollbars){
		if (bar.x && bar.x.parentNode)
			bar.x.parentNode.removeChild(bar.x);

		if (bar.y && bar.y.parentNode)
			bar.y.parentNode.removeChild(bar.y);
	};
};
