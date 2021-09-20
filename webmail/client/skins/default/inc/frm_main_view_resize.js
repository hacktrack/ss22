_me = frm_main_view_resize.prototype;
function frm_main_view_resize(){};
_me.__constructor = function(){
	var me = this;

	this._add_destructor('_destructResizeEvn');

	//slider 1
	this._getAnchor('slider').ondragstart = function(e){ return false };
	this._getAnchor('slider').onmousedown = function(e){
		var e = e || window.event;
		e.cancelBubble = true;
		if (e.preventDefault) e.preventDefault();
		if (e.stopPropagation) e.stopPropagation();

		var Y = e.clientY,
		    slider = this,
			iPos = offsetTop = slider.offsetTop;

		addcss(this,'active');

		if (!me._mousemove){
			me._mousemove = function (e){
				iPos = offsetTop + e.clientY - Y;

				if (iPos<100)
					iPos = 100;
				else{
					var dh = document.getElementsByTagName('body')[0].offsetHeight - 100;
					iPos = iPos>dh?dh:iPos;
				}

				slider.style.top = iPos + 'px';
			};
	        gui._obeyEvent('mousemove',[me._mousemove]);
	    }

		if (!me._mouseup){
			me._mouseup = function (e){
				//disobey
				gui._disobeyEvent('mousemove',[me._mousemove]);
				gui._disobeyEvent('mouseup',[me._mouseup]);

				me._mousemove = null;
				me._mouseup = null;

				//remove class
				if (!slider) return;

				removecss(slider,'active');
				slider = null;

				//save position
				me._resize(iPos);
			};
			gui._obeyEvent('mouseup',[me._mouseup]);
		}

		return false;
	};

	if (!this._checksize(true))
		this._resize(Cookie.get([this._getCookieName(), screen.width+'x'+screen.height]), true);

	gui._obeyEvent('resize',[this,'_checksize']);
};

_me._checksize = function(bInit){
	var h = this._getAnchor('container').offsetHeight;
	if (h<100){

		//loading css fix
		if (bInit === true && document.body.clientHeight>350){
			var me = this;
			setTimeout(function(){me._checksize(true)},100);
			return true;
		}

		h = this._main.parentNode.clientHeight-100;
		this._resize(h<100?100:h,true);
		return true;
	}
	else{
		var hs = Cookie.get([this._getCookieName(), screen.width+'x'+screen.height]),
			h = this._getAnchor('list').offsetHeight-1;

		if (hs!=h){
			h = this._main.parentNode.clientHeight-100;
			this._resize(h>(hs || 0)?hs:h,true);
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
_me._resize = function(y,bNoUpdate){

	y = parseInt(y,10);
	y = Is.Number(y)?y:260;
	y = y<100?100:y;

	var tmp = this._getAnchor('list');
	    tmp.style.height = (y+1) + 'px';

	tmp = this._getAnchor('slider');
	tmp.style.top = y + 'px';

	this._main.style.paddingTop = (y+1) + 'px';

	if (!bNoUpdate)
		Cookie.set([this._getCookieName(), screen.width+'x'+screen.height],y);
};

_me._getCookieName = function(){
	var sFolder = dataSet.get('current_folder'),
		sType = WMFolders.getType(Path.split(sFolder));

	if (sType === 'M')
		switch(sFolder){
		case GWOthers.getItem('DEFAULT_FOLDERS','trash'):
			sType = 'MT';
			break;
		case GWOthers.getItem('DEFAULT_FOLDERS','drafts'):
			sType = 'MD';
			break;
		case GWOthers.getItem('DEFAULT_FOLDERS','spam'):
			sType = 'MS';
			break;
		case GWOthers.getItem('DEFAULT_FOLDERS','sent'):
			sType = 'ME';
			break;
		}

	return 'horizontal_slider_' + sType.toLowerCase();
};
