_me = frm_main_resize.prototype;
function frm_main_resize(){};

_me._initResize = function(){
	var me = this,
		slider = this._getAnchor('slider'),
		slider2 = this._getAnchor('slider2');

	this._add_destructor('_destructResizeEvn');

	slider.ondragstart = function(e){ return false };
	slider.onmousedown = function(e){
		var e = e || window.event;
			e.cancelBubble = true;
		if (e.preventDefault) e.preventDefault();
		if (e.stopPropagation) e.stopPropagation();

		me.__activeSlider = this.id.substr(me._pathName.length+1);

		var epos = getSize(this).x,
			cpos = getSize(me._getAnchor('container')).x,
			spos = e.clientX - epos,
			iPos = null,
			max,
			dw = document.getElementsByTagName('body')[0].offsetWidth;

		addcss(this,'active',true);

		if (me.__activeSlider == 'slider'){
			max = 450>dw-cpos?dw-cpos:450;
		}
		else{
			// Calculate max x to leave space space for main content (IM resize)
			if (me.main && me.main._type == 'frm_main_mail_wide')
				max = getSize(me.main._getAnchor('slider')).x + (gui._rtl?-260:260);
			else {
				max = getSize(me._getAnchor('slider')).x;
				max = max || dw - 68;
				max = gui._rtl ? max-300 : max+300;
			}
		}

		if (!me._mousemove_bar){
			me._mousemove_bar = function (e){
				iPos = e.clientX - spos;

				if (me.__activeSlider == 'slider'){
					iPos -= cpos;

					if (gui._rtl)
						iPos = dw-iPos-64;

					iPos = iPos>max?max:iPos;
					iPos = iPos<180?180:iPos;

					me._getAnchor('slider').style[gui._rtl?'right':'left'] = iPos + 'px';
				}
				else{
					// IM resizing, width between 100 and 300 (or less if there is not enough space)
					if(gui._rtl) {
						iPos = iPos>300?300:iPos;
						iPos = iPos>max?max:iPos;
						iPos = iPos<100?100:iPos;
					} else {
						iPos = iPos<max?max:iPos;
						iPos = iPos>dw-100?dw-100:iPos;
						iPos = (dw - iPos>300?dw - 300:iPos);
					}

					me._getAnchor('slider2').style[gui._rtl?'left':'right'] = (gui._rtl ? iPos : dw - iPos - 6) + 'px';
				}
			};

			gui._obeyEvent('mousemove',[me._mousemove_bar]);
		}

		if (!me._mouseup_bar){
			me._mouseup_bar = function (e){
				//disobey
				gui._disobeyEvent('mousemove',[me._mousemove_bar]);
				gui._disobeyEvent('mouseup',[me._mouseup_bar]);

				me._mousemove_bar = null;
				me._mouseup_bar = null;

				//remove class
				removecss(me._getAnchor(me.__activeSlider),'active',true);

				//save position
				if (iPos !== null){
					if (me.__activeSlider == 'slider')
						me._resize(iPos);
					else
						me._resize(gui._rtl ? iPos + 6 : dw - iPos);
				}
			};
			gui._obeyEvent('mouseup',[me._mouseup_bar]);
		}

		return false;
	};

	if (slider2) {
		if ((!GWOthers.getItem('BANNER_OPTIONS', 'below_type') || GWOthers.getItem('BANNER_OPTIONS', 'below_type') === 'none')) {
			slider2.onmousedown = slider.onmousedown;
			slider2.ondragstart = slider.ondragstart;
		} else {
			slider2.classList.remove('y');
		}
	}


	//Hide tree
	function closeTree(e){
		var e = e || window.event,
			m = me._getAnchor('menu4'),
			l = me._getAnchor('left'),
			elm = e.target || e.srcElement;

		if (!hascss(l,'small') && !Is.Child(elm, m) && !Is.Child(elm,l)){
			l.__keep = false;
			addcss(l, 'small');

			//disobey event
			return false;
		}
	};


	this._getAnchor('menu4').onmouseover = function(e){
		var	e = e || window.event,
			elm = e.target || e.srcElement,
			menu = this;

		if (elm.tagName == 'SPAN' || (elm.tagName == 'I' && (elm = elm.parentNode)))
			if (this.__lastTarget != elm){
				this.__lastTarget == elm;

				if (this.__timer)
					window.clearTimeout(this.__timer);

				if (hascss(me._getAnchor('left'), 'small'))
					this.__timer = window.setTimeout(function(){
						if (e)
							menu.onmousedown(e, true);
					},300);
			}
	};

	this._getAnchor('menu4').onmouseout = function(e){
		if (this.__timer)
			window.clearTimeout(this.__timer);

		delete this.__lastTarget;

		var l = me._getAnchor('left');
		if (!l.__keep)
			if (!e.relatedTarget || !Is.Child(e.relatedTarget, l)){

				addcss(l, 'small');

				if (l.__tout)
					window.clearTimeout(l.__tout);

				l.__tout = setTimeout(function(){
					me.__resetleft();
				},300);
			}
	};

	this._getAnchor('menu4').onmousedown = function(e, bOpen){

		if (this.__timer)
			window.clearTimeout(this.__timer);

		var l = me._getAnchor('left'),
			e = e || window.event,
			elm = e.target || e.srcElement;

		//left click only
		if (!e || e.button>0)
		 	return;

		if (elm.tagName == 'I')
			elm = elm.parentNode;

		if (bOpen || hascss(l, 'small')){

			removecss(l, 'small');
			gui._obeyEvent('click', [closeTree]);

			if (l.__tout){
				window.clearTimeout(l.__tout);
				delete l.__tout;
			}

			l.onmouseover = function(){

				if (this.__tout){
					window.clearTimeout(this.__tout);
					delete this.__tout;
				}

				removecss(this, 'small');
				gui._obeyEvent('click', [closeTree]);
			};

			l.onmouseout = function(e){

				var e = e || window.event;

				if (!l.__keep){

					var menu = me._getAnchor('menu4');

					if (!e.relatedTarget || (e.relatedTarget != menu && !hascss(e.relatedTarget, 'obj_tooltip') && !Is.Child(e.relatedTarget, menu))){

						addcss(l, 'small');

						if (l.__tout)
							window.clearTimeout(l.__tout);

						l.__tout = setTimeout(function(){
							me.__resetleft();
						},300);
					}
				}
			};
		}
		else
		if (!hascss(l, 'small'))
			if (!bOpen && l._lastTarget == elm){
				addcss(l, 'small');
				me.__resetleft();
			}


		if (!bOpen)
			l._lastTarget = elm;
	};

	//MS Touch support
	if (window.navigator.msPointerEnabled){
		this._getAnchor('menu4').onmspointerup = function(e){
			var e = e || window.event;
    		if (e.pointerType && (e.pointerType == 'touch' || e.pointerType == 'pen')){
				var l = me._getAnchor('left');
					l.__keep = true;
					removecss(l, 'small');

				gui._obeyEvent('click', [closeTree]);
			}
		};
	}
	else
	if ('ontouchstart' in window){
		this._getAnchor('menu4').ontouchstart = function(e){
			var l = me._getAnchor('left');
				l.__keep = true;
				removecss(l, 'small');
			gui._obeyEvent('click', [closeTree]);
		};
	}

	gui.frm_main.bar._obeyEvent('click',[function(e){
		if (e.type == 'contextmenu'){

			var l = me._getAnchor('left');
				l.__keep = true;
				removecss(l,'small');

			gui._obeyEvent('click', [closeTree]);
		}
	}]);


	//initial size
	this.__activeSlider = 'slider';
	this._resize(Cookie.get(['vertical_slider',screen.width+'x'+screen.height]) || 197,true);

	this.__resetleft();

	gui._obeyEvent('resize',[me, '_resize_handler']);
	this._resize_handler();
};

_me.__resetleft = function(){
	var menu = this._getAnchor('menu4'),
		l = this._getAnchor('left');

		l.onmouseover = function(e){
			var e = e || window.event;

			if (l.__tout)
				clearTimeout(l.__tout);

			l.__tout = setTimeout(function(){
				if (e)
					menu.onmousedown(e, true);
			},300);
		};

		l.onmouseout = function(e){
			if (l.__tout){
				clearTimeout(l.__tout);
				delete l.__tout;
			}
		};

		l._lastTarget = null;
};

_me._resize_handler = function(){
	//IM
	switch((Cookie.get(['hide_im']) || '').toString()){
		case '1':
			addcss(this._main, 'rd_small');
			break;
		case '2':
			removecss(this._main, 'rd_small');
			break;
		default:
			if (document.body.clientWidth < 1350)
				addcss(this._main, 'rd_small');
			else
				removecss(this._main, 'rd_small');
	}

	//TREE
	var hide_tree = (Cookie.get(['hide_tree']) || '').toString();
	switch ((TeamChatAPI && TeamChatAPI.teamChatOnly()) ? '2' : hide_tree) {
		case '1':
			addcss(this._main, 'ld_small');
			break;
		case '2':
			removecss(this._main, 'ld_small');
			break;
		default:
			if (document.body.clientWidth < 1100)
				addcss(this._main, 'ld_small');
			else
				removecss(this._main, 'ld_small');
	}
};

_me._destructResizeEvn = function(){

	gui._disobeyEvent('resize',[this._resize_handler]);

	if (this._mousemove_bar){
		gui._disobeyEvent('mousemove',[this._mousemove_bar]);
		this._mousemove_bar = null;
	}

	if (this._mouseup_bar){
		gui._disobeyEvent('mouseup',[this._mouseup_bar]);
		this._mouseup_bar = null;
	}
};

/**
 * slider position from left side
 **/
_me._resize = function(x, bNoUpdate){

    //set width
	x = parseInt(x);
	x = Is.Number(x)?x:0;

    var dw = document.getElementsByTagName('body')[0].offsetWidth;

	if (this.__activeSlider == 'slider'){

		var max;
		if (this.__rightDock === true){

			max = getSize(this._getAnchor('slider2')).x - 300;

			if (this.main && (this.main._type == 'frm_main_mail_wide' || this.main._type == 'frm_main_datagrid_wide'))
				max -= getSize(this.main._getAnchor('slider')).x - getSize(this._getAnchor('slider')).x - 260;
		}
		else
		if (this.__rightDock === false)
			max = dw - 300 - 34;
		else
			max = dw - 300;

		x = x>max?max:x;
		x = x<180?180:x;

		this._getAnchor('left').style.width = (x+3) + 'px';
		this._getAnchor('container').style[gui._rtl?'paddingRight':'paddingLeft'] = (x+3) + 'px';
		this._getAnchor('slider').style[gui._rtl?'right':'left'] = x + 'px';

		if (!bNoUpdate)	Cookie.set(['vertical_slider',screen.width+'x'+screen.height],x);
	}
	else{

		x = dw - x;

		var min;
		if (this.main && this.main._type == 'frm_main_mail_wide')
			min = getSize(this.main._getAnchor('slider')).x + (gui._rtl?-260:260);
		else
			min = getSize(this._getAnchor('slider')).x + (gui._rtl?-300:300);

		x = x<min?min:x;
		x = (dw - x)>100?x:(x==0?dw - 150:dw - 100);
		x = dw - x>300?dw - 300:x;

		this._getAnchor('container').style[gui._rtl?'paddingLeft':'paddingRight'] = (dw - x - 3) + 'px';
		this._getAnchor('slider2').style[gui._rtl?'left':'right'] = (dw - x - 6) + 'px';
		this._getAnchor('im').style.width = (dw - x - 3) + 'px';

		if (!bNoUpdate)	Cookie.set(['vertical_slider2',screen.width+'x'+screen.height],dw-x);
	}

	//Call window.onresize event handler
	gui.__exeEvent('resize');
};

_me._rightDock = function (bShow){

	var eIM = this._getAnchor('im');

	//Bind hover
	if (!Is.Defined(this.__rightDock)){

		function closeEvn (e){
			var e = e || window.event,
				elm = e.target || e.srcElement,
				im = gui.frm_main._getAnchor('im');

			if ((elm != im || !Is.Child(elm, im)) && (!e.__source || !(e.__source.skip == true || e.__source.type == 'obj_im'))){
				im.__keep = false;
				addcss(im, 'small');
				return false;
			}

		};

		eIM.onclick = function(e){
			var e = e || window.event;
				e.__source = {obj:null, skip: true, type:'obj_im'};

			this.__keep = true;
			removecss(this, 'small');

			gui._obeyEvent('click', [closeEvn]);
		};
		eIM.oncontextmenu = function(e){
			this.onclick(e);
		};

		eIM.onmouseover = function(e){
			var e = e || window.event,
				p = getSize(this);

			if (p.y + p.h - e.pageY > 37)
				removecss(this,'small');
		};

		eIM.onmouseout = function(e){
			var e = e || window.event;

			if (e.relatedTarget != this && !Is.Child(e.relatedTarget, this) && !this.__keep)
				addcss(this,'small');
		};
	}

	var bResize = false;

	if (bShow === true){
		if (!this.__rightDock){

			addcss(this._main,'rdock');

			if (this.__rightDock === false)
				eIM.onclick({});

			this.__rightDock = true;

			bResize = true;
		}
	}
	else{

		bResize = !!this.__rightDock;

		this.__rightDock = bShow;

		if (bShow === false){
			addcss(this._main,'rdock');

			eIM.__keep = false;
			addcss(eIM, 'small');

			//set minimal value (no slider hot fix)
			if (Cookie.get(['vertical_slider2',screen.width+'x'+screen.height])<260)
				Cookie.set(['vertical_slider2',screen.width+'x'+screen.height], 260);
		}
		else{

			eIM.onmouseover = null;
			eIM.onmouseout = null;
			eIM.onclick = null;

			this._getAnchor('container').style[gui._rtl?'paddingLeft':'paddingRight'] = '';

			removecss(this._main,'rdock');

			bResize = !bResize;
		}
	}

	//Set Size
	if (Is.Boolean(this.__rightDock)){
		this.__activeSlider = 'slider2';
		this._resize(Cookie.get(['vertical_slider2',screen.width+'x'+screen.height]) || 260,true);
	}

	//Call window.onresize event handler
	if (bResize)
		gui.__exeEvent('resize');
};