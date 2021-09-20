_me = frm_imgview.prototype;
function frm_imgview(){};

_me.__constructor = function(){
	var me = this;

	storage.library('load-image.all.min', 'loadimage');

	this._place('0%','0%',"100%","100%");
	this._zIndex();

	this.__queue = [];

	//close
	this._getAnchor('close').onclick = function(){
		me._destruct();
	};

	//Full Screen toggle
	this._getAnchor('full').onclick = function(){
		if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement) {

			if (me._main.requestFullscreen)
				me._main.requestFullscreen();
			else
			if (me._main.mozRequestFullScreen)
				me._main.mozRequestFullScreen();
			else
			if (me._main.webkitRequestFullscreen)
				me._main.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
		}
		else {
			if (document.cancelFullScreen)
				document.cancelFullScreen();
			else
			if (document.mozCancelFullScreen)
				document.mozCancelFullScreen();
			else
			if (document.webkitCancelFullScreen)
				document.webkitCancelFullScreen();
		}
	};

	this._getAnchor('container').onclick = function (e) {
		var e = e || window.event,
			elm = e.target || e.srcElement;

		if (elm.tagName == 'DIV')
			if (hascss(elm,'go')){
				//Previous
				if (hascss(elm,'prev'))
					me._prev();
				//Next
				else
					me._next();
			}
			else
				me._destruct();
	};


	//input
	var eInput = this._getAnchor('input');
		eInput.focus();
		eInput.onkeydown = function(e){
			var e = e || window.event;

			this.value = '';

			switch(e.keyCode){
				case 37:
				case 38:
				case 33:
					me._prev();
					break;

				case 39:
				case 40:
				case 34:
				case 32:
					me._next();
					break;

				case 27:
					me._destruct();
					break;

				case 107: //+
				case 109: //-

				case 13:
				case 9:
					break;

				default:
					return true;
			}

			e.cancelBubble = true;
			if (e.stopPropagation)
				e.stopPropagation();
			return false;
		};

	AttachEvent(this._main,'onclick', function(e){
		eInput.focus();
	});

	//loader

	//destructor!
	gui._obeyEvent('resize',[this,'__resize']);
	this._add_destructor('__resizeDestruct');
};

_me._next = function(){

	var bFound = false;
	for(var i in this.__queue){
		if (i == this.__value)
			bFound = true;
		else
		if (bFound){
			this._value(i);
			return i;
		}
	}

	//fallback
	for(var i in this.__queue){
		this._value(i);
		return i;
	}
};

_me._prev = function(){
	var out;
	for(var i in this.__queue){
		if (Is.Defined(out) && i == this.__value)
			break;

		out = i;
	}

	this._value(out);
	return out;
};

_me._fill = function(aData){
	this.__queue = Is.Object(aData)?aData:[];

	if (this.__queue.length == 1)
		addcss(this._main, 'single');
	else
		removecss(this._main, 'single');
};

_me._value = function(v){
	if (Is.Defined(v)){
		if (this.__queue[v] && this.__value != v){

			addcss(this._main, 'loading');

			//show image
			var me = this,
				imageUrl = this.__queue[v].url;

			var anchor = me._getAnchor('image'),
				oldElm = anchor.firstChild;

			if (oldElm)
				removecss(oldElm,'show');

			//show image
			if(this.__queue[v].title.match(/\.gif[^\w]?/)) {

				this.__gif = true;

				var me = this,
				img = new Image();
				img.onload = function(){
					if(me._destructed) {
						img = null;
						return;
					}
					var anchor = me._getAnchor('image');
					while(anchor.firstChild) {
						anchor.removeChild(anchor.firstChild);
					}
					removecss(me._main, 'loading');
					anchor.appendChild(this);
					me.__resize();
				};
				img.onerror = function() {
					console.log("Error loading image " + imageUrl);
				};
				img.src = this.__queue[v].url;
			} else {

				this.__gif = false;

				loadImage(
					imageUrl,
					function (img) {
						if(me._destructed) {
							img = null;
							return;
						}

						if (img.type === "error") {
							console.log("Error loading image " + imageUrl);
						}
						else {

							//remove old
							if (oldElm){
								oldElm.parentNode.removeChild(oldElm);
								oldElm = null;
							}

							//append new
							anchor.appendChild(img);

							me.__resize();
							removecss(me._main, 'loading');
							addcss(img,'show');
						}
					},
					{
						orientation: true
					}
				);
			}

			this._getAnchor('label').innerHTML = this.__queue[v].title?this.__queue[v].title.toString().escapeHTML():'';

			this.__value = v;
			return true;
		}

		return false;
	}
	else
		return this.__value || null;
};

_me.__resize = function(e,w,h){
	var anchor = this._getAnchor('image'),
		img;

	if ((img = anchor.firstChild)){

		if (this.__gif){
			w = w || img.naturalWidth;
			h = h || img.naturalHeight;
		}
		else{
			w = w || img.width;
			h = h || img.height;
		}

		if (anchor.clientWidth>w  && anchor.clientHeight>h){
			img.style.width = w + 'px';
			img.style.height = h + 'px';
		}
		else
		if ((w/h)<(anchor.clientWidth/anchor.clientHeight)){
			img.style.height = anchor.clientHeight + 'px';
			img.style.width = (w/h*anchor.clientHeight) + 'px';
			//img.style.width = 'auto';
		}
		else{
			// img.style.height = 'auto';
			img.style.height = (h/w*anchor.clientWidth) + 'px';
			img.style.width = anchor.clientWidth + 'px';
		}

		img.style.left = Math.ceil((anchor.clientWidth - img.offsetWidth)/2) + 'px';
		img.style.top = Math.ceil((anchor.clientHeight - img.offsetHeight)/2) + 'px';
	}
};
_me.__resizeDestruct = function(){
	gui._disobeyEvent('resize',[this,'__resize']);
};
