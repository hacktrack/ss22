_me = obj_frame.prototype;
function obj_frame(){};
/**
 *
 **/
_me.__constructor = function(){

	this._resize = false; //Content resizing

 	this.__eFrame = this._getAnchor('frame');

	//Allow Full Frame access
	this.__eFrame.setAttribute('allowfullscreen','true');
	this.__eFrame.setAttribute('mozallowfullscreen','true');
	this.__eFrame.setAttribute('webkitallowfullscreen','true');

	this.__doc = this.__eFrame.contentDocument || this.__eFrame.contentWindow.document;

	// stops Esc because it cancel actual open http connection
	if (this.__eFrame.contentWindow.addEventListener)
		this.__eFrame.contentWindow.addEventListener("keydown", function(e){
			var e = e || this.event;
			if (e.keyCode == 27){
				e.cancelBubble = true;
				try{e.preventDefault();}catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r);}
				try{e.stopPropagation();}catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r);}
				return false;
			}
		},false);

	//important for Mozilla browser!
	this._write();
};
_me._sandbox = function(arr){
	this.__eFrame.setAttribute('sandbox', (arr || []).join(' '));
};
_me._src = function(sURL){
	this.__eFrame.src = sURL;
};

_me._write = function(html, headers){

	this.__doc.open('text/html','replace');

	//fix html content if broken
	var html = html?mkElement('div',{innerHTML:html}).innerHTML:'';

	//Using write because of onload method
	var html =	"<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01 Transitional//EN\">\n"+
				'<html lang="'+document.documentElement.lang+'">\n<head>\n'+
				'<meta http-equiv="x-dns-prefetch-control" content="off">'+
				"\n</head>\n"+
				'<body'+ (html?' onload="if (window.parent.'+ this._pathName + '._resize) window.parent.'+ this._pathName + '._onresize(true);"':'')+'><div style="height: auto!important; overflow: hidden">'+ html +"</div></body>\n</html>";

	this.__doc.write(html);

	if (Is.Array(headers)){
		for (var i in headers){
			for (var node in headers[i]){
				this.__doc.head.appendChild(mkElement(node,headers[i][node],this.__doc));
			}
		}
	}

	var me = this;
	// window.onload will fire before images are fully loaded/displayed in Chrome, thus also onload on images
	if (html && navigator.userAgent.indexOf('WebKit')!=-1) {
		var img = this.__doc.getElementsByTagName('img');
		for(var i = img.length-1; i>=0; i--)
			if (img[i].nodeName=='IMG')
				img[i].addEventListener('load',function(e){if (me._onresize) me._onresize(me.__doc);},false);
	}

	// Scroll
	if (this.__doc.body){
		this.__eFrame.onload = function(){
			if (this.contentDocument){
				//Reset scroll
				if (this.contentDocument.scrollingElement)
					this.contentDocument.scrollingElement.scrollTop = 0;

				//Listen
				this.contentDocument.addEventListener('scroll', function(e) {
					if (me._onscroll)
						me._onscroll(e, this.scrollingElement.scrollTop);
					me.__exeEvent('onscroll',e,{"value":this.scrollingElement.scrollTop,"owner":this});
				}, false);
			}
		};
	}

	this.__handlers();

	this.__doc.close();
};

_me.__handlers = function(){
	var me = this;

	// destruct contextmenus
	this.__doc.oncontextmenu = function(e){
		if (gui.cmenu)
			gui.cmenu._destruct();
	};

	// document Events Forwarding
	function mouseEvn(e){

		var e = e || me.__eFrame.contentWindow.event,
			pos = getSize(me.__eFrame);

		// dispatch for IE
		if (document.createEventObject){
			var evt = document.createEventObject();
				evt.clientX = e.clientX + pos.x;
				evt.clientY = e.clientY + pos.y;

			return me.__eFrame.fireEvent('on'+e.type,evt)?true:false;
		}
		// dispatch for firefox + others
		else{
			var evt = document.createEvent("MouseEvents");
				evt.initMouseEvent (e.type, true, true, window, 0, 0, 0, e.clientX + pos.x , e.clientY + pos.y, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, e.button, null);

			return me.__eFrame.dispatchEvent(evt);
		}
	};

	this.__doc.onmousemove = mouseEvn;
	this.__doc.onmousedown = mouseEvn;
	this.__doc.onmouseup = mouseEvn;
	this.__doc.onclick = mouseEvn;
	this.__doc.onmouseover = mouseEvn;

	AttachEvent(this.__doc, "onmousewheel", function(e){
		if (me._onmousewheel)
			me._onmousewheel(e);
	});

	this.__eFrame.contentWindow.onresize = function (e){
		if (me._resize && this.__width != me.__eFrame.offsetWidth){
			this.__width = me.__eFrame.offsetWidth;
			me._onresize();
		}
	};
};

_me._onresize = function(){
	var div = this.__doc.getElementsByTagName('div');

	this.__eFrame.style.height = (div && (div = div[0])?(div.offsetHeight + 40):0) + 'px';
};

_me._print = function(){
	this.__eFrame.contentWindow.focus();
	if (this.__eFrame.contentWindow.document.queryCommandSupported('print')) {
		this.__eFrame.contentWindow.document.execCommand('print', false, null);
	} else {
		this.__eFrame.contentWindow.print();
	}
};
