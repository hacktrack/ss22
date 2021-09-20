_me = frm_main_wide_resize.prototype;
function frm_main_wide_resize(){};
_me.__constructor = function(){
	var me = this;

	this._add_destructor('_destructResizeEvn');

	this._getAnchor('slider').ondragstart = function(e){ return false };
	this._getAnchor('slider').onmousedown = function(e){
		var e = e || window.event;
		e.cancelBubble = true;
		if (e.preventDefault) e.preventDefault();
		if (e.stopPropagation) e.stopPropagation();

		addcss(me._getAnchor('slider'),'active');

		var pos_main = getSize(me._main).x,
			epos = getSize(this).x,
			spos = e.clientX - epos,
			iPos = null,
			space = {
				width: me._main.offsetWidth,
				min_x: pos_main+260,	// content are not smaller than 200px
				max_x: pos_main+me._main.offsetWidth-300	// list area not smaller than 300px
			},
			dw;

		if (me._parent.__rightDock)
			dw = getSize(me._parent._getAnchor('im')).x - 300;
		else
			dw = document.getElementsByTagName('body')[0].offsetWidth - 300;

		if (!me._mousemove){
			me._mousemove = function (e){

				iPos = e.clientX - spos;

				if (gui._rtl) {
					iPos += 6;
					iPos = iPos<space.min_x ? space.min_x : iPos;
					iPos = iPos>space.max_x ? space.max_x : iPos;
				} else {
					iPos = iPos>dw?dw:iPos;
					iPos = iPos<pos_main+260?pos_main+260:iPos;
				}

				iPos = iPos-pos_main;

				me._getAnchor('slider').style[gui._rtl?'right':'left'] = (gui._rtl ? space.width - iPos : iPos) + 'px';
			};
			gui._obeyEvent('mousemove',[me._mousemove]);
		}

		if (!me._mouseup){
			me._mouseup = function(e){
				//disobey
				gui._disobeyEvent('mousemove',[me._mousemove]);
				gui._disobeyEvent('mouseup',[me._mouseup]);

				me._mousemove = null;
				me._mouseup = null;

				//remove active style
				removecss(me._getAnchor('slider'),'active');

				//save position
				if (iPos !== null)
					me._resize(gui._rtl ? space.width - iPos : iPos);
			};
			gui._obeyEvent('mouseup',[me._mouseup]);
		}

		return false;
	};

	if (!this._checksize())
		this._resize(Cookie.get([this._getCookieName(), screen.width+'x'+screen.height]),true);

	gui._obeyEvent('resize',[this,'_checksize']);
};


_me._checksize = function(){

	var w = this._getAnchor('container').offsetWidth;

	if (w<300){
		this._resize(this._main.offsetWidth-305,true);
		return true;
	}
	else{

		var ws = Cookie.get([this._getCookieName(), screen.width+'x'+screen.height]),
			w = this._getAnchor('list').offsetWidth;

		if (ws!=w){
			w = this._main.offsetWidth-305;
			this._resize(w>(ws || 0)?ws:w,true);
			return true;
		}
	}
};

_me._destructResizeEvn = function(){
	if (this._mousemove){
		gui._disobeyEvent('mousemove',[this._mousemove]);
		this._mousemove = null;
	}

	if (this._mouseup){
		gui._disobeyEvent('mouseup',[this._mouseup]);
		this._mouseup = null;
	}

	gui._disobeyEvent('resize',[this,'_checksize']);
};

/**
 * slider position from left side
 **/
_me._resize = function(x,bNoUpdate){

	x = parseInt(x);
	x = Is.Number(x)?x:0;
	x = x<260?(x==0?400:260):x;

	this._getAnchor('list').style.width = (x+1) + 'px';
	this._getAnchor('slider').style[gui._rtl?'right':'left'] = x + 'px';
	this._getAnchor('container2').style[gui._rtl?'paddingRight':'paddingLeft'] = (x+1) + 'px';

	if (!bNoUpdate)
		Cookie.set([this._getCookieName(), screen.width+'x'+screen.height],x);
};


_me._getCookieName = function(){
	var sFolder = dataSet.get('current_folder'),
		sType = WMFolders.getType(Path.split(sFolder));

	// if (sType === 'M')
	// 	switch(sFolder){
	// 	case GWOthers.getItem('DEFAULT_FOLDERS','trash'):
	// 		sType = 'MT';
	// 		break;
	// 	case GWOthers.getItem('DEFAULT_FOLDERS','drafts'):
	// 		sType = 'MD';
	// 		break;
	// 	case GWOthers.getItem('DEFAULT_FOLDERS','spam'):
	// 		sType = 'MS';
	// 		break;
	// 	case GWOthers.getItem('DEFAULT_FOLDERS','sent'):
	// 		sType = 'ME';
	// 		break;
	// 	}

	return 'vertical_slider_' + sType.toLowerCase();
};