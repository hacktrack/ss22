/*
MSIE8:
toStaticHTML(str) //odebere dynamicke prvky

*/

////////////////////////////////////////////////////
//      EVENT HANDLERS CROSS BROWSER EMULATION
////////////////////////////////////////////////////
/*
window.onerror = function(msg, url, linenumber){
try{
	- otevrit JS window
	- error template
	- doplnit info o browseru
	- vytvorit chybovou hlasku
	- copy to clipboard button
}
catch(e){
	alert(msg + "\n\nurl: " + url +"\n\nline: "+ linenumber);
}
return true;
}
*/

/*
var evt = document.createEvent('MouseEvents');
	evt.initMouseEvent(
	   'click'          // event type
	   ,true           // can bubble?
	   ,true           // cancelable?
	   ,window      // the event's abstract view (should always be window)
	   ,1              // mouse click count (or event "detail")
	   ,100           // event's screen x coordinate
	   ,200           // event's screen y coordinate
	   ,100           // event's client x coordinate
	   ,200           // event's client y coordinate
	   ,false         // whether or not CTRL was pressed during event
	   ,false         // whether or not ALT was pressed during event
	   ,false         // whether or not SHIFT was pressed during event
	   ,false         // whether or not the meta key was pressed during event
	   ,1             // indicates which button (if any) caused the mouse event (1 = primary button)
	   ,null          // relatedTarget (only applicable for mouseover/mouseout events)
	);
	elm.dispatchEvent(evt);
*/

function callEvent (elm, type) {
	var event;
	if (typeof Event === 'function') {
		event = new Event(type);
	} else {
		event = document.createEvent('Event');
		event.initEvent(type, true, true);
	}

	elm.dispatchEvent(event);
}

/* MSIE9-10 height fix */
function msiebox (elm){
	if (currentBrowser() == 'MSIE9'){
		elm.onresize = function(e){
			do{
				var elm = this.firstChild;
			}
			while (elm.nodeType != 1);

			if (this.offsetHeight != elm.offsetHeight)
				elm.style.height = (this.offsetHeight) + 'px';
		};
	}
};

function getStyle(elm,styleProp,doc){
	if (window.getComputedStyle)
		return (doc || document).defaultView.getComputedStyle(elm,null).getPropertyValue(styleProp) || '';
	else
	if (elm.currentStyle)
		return elm.currentStyle[styleProp] || '';
};

/**
 * @brief	Event handler emulator for Gecko browsers
 * @author	DRZ 10.03.2005
 */
function emulateEventHandlers(eventNames) {
	for (var i = 0; i < eventNames.length; i++) {
		document.addEventListener(eventNames[i], function (e) {
			window.event = e;
		}, true);
	}
};
typeof(window.event)=="object" ? "" : emulateEventHandlers(["mousemove","mousedown","mouseover"]);

/**
 * @brief   ContextMenu for Opera Browser <10.5
 * @date    22.6.2009 17:03:35
 **/
if (window.opera && parseInt(window.opera.version(),10)<11 && typeof document.getElementsByTagName('html')[0].oncontextmenu == 'undefined'){ //opera.buildNumber &&  opera.buildNumber('inconspicuous')<3296

	window.addEventListener('mousedown',
		function (e) {
			//Alt+LeftClick
			if (e.altKey){
				e.preventDefault();
				e.cancelBubble=true;
				return false;
			}
			else
			//RightClick
			if (e.button == 2){
   				var elm = e.srcElement;

				do{
					if (elm.oncontextmenu){
						e.preventDefault();
						e.cancelBubble=true;


						if (window.opera.__overrideBtn){
		                    window.opera.__overrideBtn.parentNode.removeChild(window.opera.__overrideBtn);
		                    window.opera.__overrideBtn = null;
						}

						window.opera.__overrideBtn = document.createElement('input');
		    			window.opera.__overrideBtn.type = 'button';
		    			window.opera.__overrideBtn.style.position = 'absolute';
		    			window.opera.__overrideBtn.style.zIndex = 10000;
		    			window.opera.__overrideBtn.style.width = '5px;';
		    			window.opera.__overrideBtn.style.height = '5px;';
		    			window.opera.__overrideBtn.style.left = (e.clientX - 2)+'px';
		    			window.opera.__overrideBtn.style.top = (e.clientY - 2)+'px';
		    			window.opera.__overrideBtn.style.opacity = 0.01;
		    			
						document.body.appendChild(window.opera.__overrideBtn);

						var evt = {
						'type':'contextmenu',
						'srcElement':e.srcElement,
						'clientX':e.clientX,
						'clientY':e.clientY,
						'button':2
						};

						elm.oncontextmenu(evt);
						break;
					}
					elm = elm.parentNode;
				}
				while(elm!=document)
			}
		},
		true
	);

	//RightClick
	window.addEventListener('mouseup',
		function (e) {
			if (window.opera.__overrideBtn){
                window.opera.__overrideBtn.parentNode.removeChild(window.opera.__overrideBtn);
                window.opera.__overrideBtn = null;
			}
		}
		,
		true
	);

	//Alt+LeftClick
	window.addEventListener('click',
		function (e) {
			if(e.altKey){
				var elm = e.srcElement;
				do{
					if (elm.oncontextmenu){
						e.preventDefault();
						e.cancelBubble=true;

						var evt = {
						'type':'contextmenu',
						'srcElement':e.srcElement,
						'clientX':e.clientX,
						'clientY':e.clientY,
						'button':2
						};

						elm.oncontextmenu(evt);
						break;
					}
					elm = elm.parentNode;
				}
				while(elm!=document)
				return false;
			}
		},
		true
	);
};

/**
 * @brief: cross browser compatible helper to register for events
 **/
function AttachEvent (obj, eventname, handler) {
	//W3C
	if(obj.addEventListener) {

		var eventname = eventname.substr(2);
		if (eventname == "mousewheel"){
			// NEW & IE9+
			if (Is.Defined(document.documentElement.onwheel) || (document.documentMode || 0)>8)
				eventname = 'wheel';
			else
			// Older FF
			if (currentBrowser() == 'Mozilla')
				eventname = "DOMMouseScroll";

			obj.addEventListener(eventname, function(e){
				var e = e || window.event,
					evn = {
						originalEvent:e,
						type:e.type,
						srcElement: e.target || e.srcElement,
						deltaX:0,
						deltaY:0
					};

				// calculate deltaY (and deltaX) according to the event
				if (e.type == "mousewheel") {
					// Opera (and earlier versions of Chrome with wheelDeltaX/Y and IE with wheelDelta)
					if (Is.Defined(e.wheelDeltaX))
						evn.deltaX = e.wheelDeltaX/-40;          

					if (Is.Defined(e.wheelDeltaY))
						evn.deltaY = e.wheelDeltaY/-40;
					else
						evn.deltaY = e.wheelDelta/-40;
				}
				else
				if (e.type == "wheel"){
					// IE9+ and Chrome (IE version check not actually needed, IE8 will never get here)
					if (document.documentMode && document.documentMode>8 || navigator.userAgent.indexOf('WebKit')!=-1){
						evn.deltaX = e.deltaX/40;
						evn.deltaY = e.deltaY/40;
					}
					// FF 17+
					else{
						evn.deltaX = e.deltaX;
						evn.deltaY = e.deltaY;
					}
				}
				else
				// Old FF (DOMMouseScroll event)
				if (Is.Defined(e.axis) && e.axis === e.HORIZONTAL_AXIS)
					evn.deltaX = e.detail;
				else
					evn.deltaY = e.detail;

				handler(evn);

			}, false);
		}
		else	
			obj.addEventListener(eventname, handler, false);
	}
	else
	// MSIE 8
	if(obj.attachEvent){
		//this points to window
		//obj.attachEvent(eventname, handler);

		//this point to element itself!
		obj.attachEvent(eventname,function(){
			if (eventname == 'onmousewheel'){
				var e = arguments[0] || window.event,
					evn = {
						originalEvent:e,
						type:e.type,
						srcElement: e.target || e.srcElement,
						deltaX:0,
						deltaY:e.wheelDelta/-40
					};

				handler.apply(obj, [evn]);
			}
			else
				handler.apply(obj, arguments);
		});
	}	
};

function unique_id(){
	return (Math.random()*1000000000000000000)+''+(new Date).getTime();
};

/**
 * @brief	sends given download.php url into iframe
 * @date	24.7.2014
 */
function downloadItem(path,full){

	if (currentBrowser() == 'MSIE7' || (full && location.protocol == 'https:')){
		var win = window.open(full?path:'server/download.php?'+path, "file", "scrollbars=yes,location=yes,toolbar=yes,status=yes,menubar=yes,resizable=yes,width=200,height=200");
		if (win && win.document){
			win.document.onload = function(){
				window.close();
			};

			return;
		}
	}

	var id = 'ifrm_download_'+unique_id(),
		frm = mkElement('iframe',{id:id, src:full?path:'server/download.php?'+path});
		frm.style.position = 'absolute';
		frm.style.width = '1px';
		frm.style.height = '1px';
		frm.style.top = '0';
		frm.style.left = '-1000px';

	document.getElementsByTagName('body')[0].appendChild(frm);
	setTimeout("try{ var elm; if ((elm = document.getElementById('"+id+"'))) elm.parentNode.removeChild(elm); }catch(r){}",120000);

	frm = null;
};

// Open in separate window - Martin 2013
function openItem(path,full,label) {
	window.open(full?path:'server/download.php?'+path, label || 'file','menubar=no,resizable=yes,status=no,location=no');
}

var GSM0338_To_Unicode_Charset = [
    0x40, /*£ 0xA3,*/ 0x24, 0xA5, 0xE8, 0xE9, 0xF9, 0xEC, 0xF2, 0xE7, 0x0A, 0xD8, 0xF8, 0x0D, 0xC5, 0xE5,
    0x394, 0x5F, 0x3A6, 0x393, 0x39B, 0x3A9, 0x3A0, 0x3A8, 0x3A3, 0x398, 0x39E, 0x1B, 0xC6, 0xE6, 0xDF, 0xC9,
    0x20, 0x21, 0x22, 0x23, 0xA4, 0x25, 0x26, 0x27, 0x28, 0x29, 0x2A, 0x2B, 0x2C, 0x2D, 0x2E, 0x2F,
    0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3A, 0x3B, 0x3C, 0x3D, 0x3E, 0x3F,
    0xA1, 0x41, 0x42, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48, 0x49, 0x4A, 0x4B, 0x4C, 0x4D, 0x4E, 0x4F,
    0x50, 0x51, 0x52, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58, 0x59, 0x5A, 0xC4, 0xD6, 0xD1, 0xDC, 0xA7,
    0xBF, 0x61, 0x62, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69, 0x6A, 0x6B, 0x6C, 0x6D, 0x6E, 0x6F,
    0x70, 0x71, 0x72, 0x73, 0x74, 0x75, 0x76, 0x77, 0x78, 0x79, 0x7A, 0xE4, 0xF6, 0xF1, 0xFC, 0xE0
  ];



/**
 * @brief: MATH extensions
 **/
Math.ceilFloat = function(num,n){
	n = this.pow(10, parseInt(n,10)) || 1;
	return this.ceil(parseFloat(num) * n)/n;
};

Math.rand = function(n){
	n = n || 10000000000000000;
	return (this.floor ( this.random ( ) * n + 1 ));
};

/**
 * @brief: Z-index whatever class :)
 **/
_me = cMaxZIndex.prototype;
function cMaxZIndex(){
	this.zindex = [500];
};
	_me.get = function(b){
		var z = this.zindex[this.zindex.length-1]+1;
		if(!b) this.zindex.push(z);
		return z;
	};

	_me.remove = function(z){
		var pos = inArray(this.zindex,z);
		if (pos>-1) this.zindex.splice(pos,1);
	};
maxZIndex = new cMaxZIndex();


function setSelectAll(eElement){
	//MOZILA (pozor nefachaj pak inputy!!!)
	try{
		eElement.style.setProperty ('MozUserSelect', 'text', '');
		eElement.style.setProperty ('-moz-user-select', 'text', '');
	}
	catch(e){}
	
	//MSIE
	try{ eElement.unselectable = "off"; }catch(e){};
	//KHTM
	try{ eElement.style.KhtmlUserSelect = "text"; }catch(e){}
	//Safari
	try{ eElement.style.WebkitUserSelect = "text"; }catch(e){}
};

function setSelectNone(eElement){
	return;
	
	//MOZILA (pozor nefachaj pak inputy!!!)
	try{
		eElement.style.setProperty ('MozUserSelect', '-moz-none', '');
		eElement.style.setProperty ('-moz-user-select', '-moz-none', '');
	}
	catch(e){}
	//MSIE
	try{ eElement.unselectable = "on"; }catch(e){};
	//KHTM
	try{ eElement.style.KhtmlUserSelect = "none"; }catch(e){}
	//Safari
	try{ eElement.style.WebkitUserSelect = "none"; }catch(e){}
};

/**
 * @brief   Eval JScode in public space (outside parent function)
 * @author  DRZ 28.03.2005
 *
 * Safari 1.2 cant Eval vars defined as:         var name; :(
 */
function pubEval(val){
	if (!val) return false;

	var nav = navigator.userAgent.toLowerCase();

	try{
		//MSIE
		if (typeof window.execScript == 'object')
			window.execScript(val);
		else{
			// Note: this whole chunk (for Webkit/Gecko) could be replaced with: eval.call(null,val);
			var tmp;
			//KHTML (Safari)
			if (currentBrowser() == 'Safari' || currentBrowser() == 'KHTML'){
				window.tmp_codeEval = val;

				var script_tag = document.createElement('script');
					script_tag.type = 'text/javascript';
					script_tag.innerHTML = 'eval(window.tmp_codeEval); window.tmp_codeEval = "";';

				document.getElementsByTagName('head')[0].appendChild(script_tag);
				script_tag.parentNode.removeChild(script_tag);
			}
			//Gecko
			else
				window.eval(val);
		}
	}
	catch(e){
		throw new Error("pubEval() - unable to Eval: \r\n" + val);
		return false;
	}
};

/**
 * @brief   One-row createElement function
 * @author  DRZ 28.03.2005
 */
function mkElement(tElm,eatt,doc) {
	var elm = (doc || document).createElement(tElm);
	if (typeof eatt == 'object') {
		for (var i in eatt){
			try {
				switch(i) {
					case 'style':
						if (Is.Object(eatt[i])){
							for (var j in eatt[i])
								elm.style[j] = eatt[i][j];
							break;
						}	
					case 'href': 
						if (eatt[i]) elm[i] = eatt[i];
						break;
					case 'for': elm.setAttribute(i,eatt[i]);
						break;
					case 'text':
						elm.appendChild((doc || document).createTextNode(eatt[i]));
						break;	

					default: elm[i] = eatt[i];
				}
			} catch(e) {}
		}
	}

	return elm;
};

/**
 * @brief: DOM isDescendent function
 **/
function isDescendent(x, y){
	while ((y = y.parentNode)) if (y == x) return true;
	return false;
};
/**
 * Returns count of actually added styles
 * If style already exists it doesnt count to $out but it is styll placed to the end
 **/

function addcss(elm){
    if (!elm) return;

	var arg = [];
	for (var a = 1;a<arguments.length;a++)
		if (Is.String(arguments[a]))
			arg = arg.concat(arguments[a].trim().split(' '));

	//FFox 3.6
	if (elm.classList && elm.classList.add){
		for (var a = 0;a<arg.length;a++)
			elm.classList.add(arg[a]);
	}
	else{
/*
		var css = elm.className, r;
		for (var a = 0;a<arg.length;a++){
			r = new RegExp("\\b" + arg[a] + "\\b",'gi');
			css = css.replace(r,'');
			css += ' '+arg[a];
			r = null;
		}

		if (elm.className != css)
			elm.className = css;
*/
		var css = elm.className?elm.className.split(' '):[];
		
		if (css.length){
			//trim
			for(var i in css)
				if (css[i])
					css[i] = css[i].trim();
			
			for (var a = 0;a<arg.length;a++)
				if (inArray(css,arg[a])<0)
					css.push(arg[a]);

			css = css.join(' ');

			if (elm.className != css)
				elm.className = css;
		}
		else
			elm.className = arg.join(' ');

	}
};

function removecss(elm){
    if (!elm) return;

	if (arguments.length<2)
		elm.className = '';
	else{
		//FFox 3.6
		if (elm.classList && elm.classList.remove){
			for (var a = 1;a<arguments.length;a++)
				if (Is.String(arguments[a]))
					elm.classList.remove(arguments[a].indexOf(' ')>-1?arguments[a].trim():arguments[a]);
		}
		else{
			var css = (elm.className?elm.className.split(' '):[]),
				l = css.length;

			for (var a = 1;a<arguments.length;a++)
				if (Is.String(arguments[a]))
					for (var i = css.length-1;i>-1;i--)
						if (css[i].toLowerCase() == arguments[a].toLowerCase())
							css.splice(i,1);
			
			if (css.length != l)
				elm.className = css.join(' ');
		}
	}
};

function hascss(elm,sClass){
	return inArray((elm.className || '').split(' '),sClass)>-1;
};

/**
 * @brief   returns array containing element's size and position
 * @author  DRZ 10.03.2005
 *
 * @NOTE: ELEMENTS WITH owerflow: auto MUST HAVE position: relative
 **/
 
function getSize(elm, doc){
	var r = {x:0,y:0,h:elm.offsetHeight,w:elm.offsetWidth};

	//Mozilla 3 + MSIE
	if (elm.getBoundingClientRect){

	    doc = doc || document;
		var box = elm.getBoundingClientRect();

			// Add the document scroll offsets
			r.x = box.left + Math.max(doc.documentElement.scrollLeft, doc.body.scrollLeft);
			r.y = box.top + Math.max(doc.documentElement.scrollTop, doc.body.scrollTop);

			if (currentBrowser() == 'MSIE7'){
				r.x--;
				r.y--;
			}
	}
	//Others  - doesnt wotk scrollTop in Safari
	else{
		r.x = elm.offsetLeft;
		r.y = elm.offsetTop;

		while((elm = elm.offsetParent)){
			if (!elm || elm.tagName == 'BODY') break;
			r.x += elm.offsetLeft - elm.scrollLeft;
			r.y += elm.offsetTop - elm.scrollTop;
		}
	}

	return r;
};


////////////////////////////////////////////////////
//           TYPE DETECTION FUNCTIONS
////////////////////////////////////////////////////
window.Is = {
	Boolean: function(a)  {
		return typeof a == 'boolean';
	},
	Array: function(a) {
		return Is.Object(a) && a.constructor == Array;
	},
	Empty: function(o) {
		if (Is.Object(o))
			if (Is.Array(o)){
				if (o.length)
					return false;
			}
			else
			for (var i in o)
				if (!Is.Undefined(o[i]))
					return false;

		return true;
	},
/*
	Empty: function(o) {
		if (Is.Object(o))
			for (var i in o)
				if (!Is.Undefined(o[i]))
					return false;

		return true;
	},
*/
	Function: function(a) {
		return typeof a == 'function';
	},
	Null: function(a) {
		return typeof a == 'object' && !a;
	},
	Number: function(a) {
		return typeof a == 'number' && isFinite(a);
	},
	Object: function(a) {
		return (a && typeof a == 'object') || Is.Function(a);
	},
	String: function(a) {
		return typeof a == 'string';
	},
	Email: function(a) {
		if (!Is.String(a)) return false;

		//^([a-z0-9\'\!\#\$\%\&\+\-\/\=\?\^\_\`\{\|\}\~\*][\.]?)+\@[a-z0-9]+([\.\-\_]?[a-z0-9])*\.[a-z]{2,4}$

		return (new RegExp("^([a-z0-9\\'\\!\\#\\$\\%\\&\\+\\-\\/\\=\\?\\^\\_\\`\\{\\|\\}\\~\\*][\\.]?)+\\@[a-z0-9]+([\\.\\-\\_]?[a-z0-9])*\\.[a-z]{2,6}$",'gim')).test(a);
	},
	Domain: function(a) {
		if (!Is.String(a)) return false;
		return /^([a-z0-9][\\-\\_\\.]?)*\\.[a-z]{2,6}$/gim.test(a);
	},
	Undefined: function(a) {
		return typeof (a) == 'undefined';
	},
	URL: function(a) {
	    if (!Is.String(a)) return false;
		return /^http(s?):\/\/[a-z0-9]*/gim.test(a);
	},
	Filename: function(a){
		if (!Is.String(a) || !a.length) return false;
		return !(/[\/\\\|\?\<\>\:\*]/gm.test(a));
	},	
	Defined: function(x){
		return !Is.Undefined(x);
	},
	/**
	 * @fn   _Is.Date()
	 * @brief   Check whether the provided date is valid.
	 * @param[in]  nYear    [number] Any year, etc. 1836
	 * @param[in]  nMonth   [number] 1 <= nMonth <= 12
	 * @param[in]  nDay     [number] 1 <= nDay <= 31
	 * @return  [boolean]   true/false
	 *
	 * Examples:
	 *    - Is.Date(2000,2,29) == true
	 *    - Is.Date(2004,2,29) == true
	 *    - Is.Date(1900,2,29) == false
	 */
	Date: function(nYear,nMonth,nDay){
		var arMonth = new Array(31,28,31,30,31,30,31,31,30,31,30,31),
			intMaxDay = 0,
			nnYear = parseInt(nYear,10),
			nnMonth = parseInt(nMonth,10),
			nnDay = parseInt(nDay,10);

		if (!Is.Number(nnYear) || !Is.Number(nnMonth) || !Is.Number(nnDay)) return false;

		if((nnYear%4==0 && nnYear%100!=0) || nnYear%400==0)
			arMonth[1]=29;
		else
			arMonth[1]=28;

		intMaxDay = arMonth[nnMonth-1];

		if (nnYear < 0) return false;
		if (nnMonth > 12 || nnMonth < 1) return false;
		if (nnDay > intMaxDay || nnDay < 1) return false;
		return true;
	},
	Child: function (elm,eParent,eStop){

		if (Is.String(eParent)){
			eParent = eParent.toUpperCase();
			try{
				do {
					if (elm.tagName == eParent)
						return elm;

					if (eStop && eStop == elm)
						return false;
				} 
				while(elm = elm.parentNode);
			}
			catch(r){}		
		}
		else
		try{
			do {
				if (elm == eParent) 
					return elm;

				if (eStop && eStop == elm)
					return false;
			} 
			while(elm = elm.parentNode);
		}
		catch(r){}

		return false;	
	}
};


////////////////////////////////////////////////////
//               STRING EXTENSIONS
////////////////////////////////////////////////////

/**
 * @brief	Replace & < > " by &amp; &lt; &gt; &quot;;
 * Example:
 *    - "&<>\"'".entityify() == "&amp;&lt;&gt;&quot;"
 */
String.prototype.entityify = function() {
	return this.replace(/&/g,"&amp;").replace(/\"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
};
String.prototype.unentityify = function() {
	return this.replace(/&gt;/g,">").replace(/&lt;/g,"<").replace(/&quot;/g,"\"").replace(/&amp;/g,"&");
};

String.prototype.urlEncode = function() {
	return escape(this).replace(/\+/g,'%2B').replace(/%20/g, '+').replace(/\*/g, '%2A').replace(/\//g, '%2F').replace(/@/g, '%40');
};

String.prototype.highlight_links = function (on1){
    var tmp = this;
	if (this.indexOf('@')>0 && this.indexOf('/')<0){
		on1 = on1 || '';
		var emailPattern = /(([a-z0-9]{,32}[\-\_\.]?){,5}[a-z0-9]{1,32}\@[a-z0-9]{1,32}([\.\-\_]?[a-z0-9]){,32}\.[a-z]{2,4})/g;
		tmp = tmp.replace(emailPattern, "<a href=\"mailto:$1\""+(on1?' '+on1:'')+">$1</a>");
	}

	//var urlPattern = /([A-Za-z]{3,5}:\/\/[A-Za-z0-9-_\:]+(\.|\/)(&[a-zA-Z]+;|[A-Za-z0-9\-\_%&\@\?\#\:\/\.=\+\!\~])+[^\!\?\. ])/g;
	var urlPattern = /([A-Za-z]{3,5}:\/\/[A-Za-z0-9-_\:]+(\.|\/)(&[a-zA-Z]+;|[A-Za-z0-9\-\_%&\@\?\#\:\/\.=\+\!\~])+[^\s\W])/g;
	tmp = tmp.replace(urlPattern, "<a href=\"$1\" target=\"_blank\">$1</a>");

	return tmp;
};

String.prototype.str_replace=function(search, replace)
{
	var f=[].concat(search),
		r=[].concat(replace),
		s = this;

	for (var j=0, fl=f.length; j<fl; j++)
		s = s.split(f[j]).join(r[j] || '');

	return s.toString();
};

// Charactar data escape complying with xml 1.0 rfc, http://www.w3.org/TR/REC-xml/#syntax

String.prototype.escapeXML = function(bAttr) {
	var s = this.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
	if(bAttr) s = s.replace(/'/g,"&apos;").replace(/"/g,"&quot;");
	return s;
}

String.prototype.unescapeXML = function() {
	return this.replace(/&gt;/gi,">").replace(/&lt;/gi,"<").replace(/&quot;/gi,'"').replace(/&apos;/gi,'"').replace(/&amp;/gi,'&');
}

/**
 * @brief	Replace &amp; &lt; &gt; &quot; &#039; by & < > " '
 *  htmlspecialchars
 * Example:
 *		"&amp;&lt;&gt;&quot;&#039;".unentityify() == "&<>\"'"
 */

String.prototype.escapeHTML = function() {
	if(currentBrowser()=='MSIE7' && this.indexOf("\n")!=-1) {
		return this.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
	} else {
		var div = document.createElement('div');
			div.appendChild(document.createTextNode(this));
	}
	if (currentBrowser() == 'Safari' || currentBrowser() == 'KHTML')
		return div.innerHTML.replace(/>/gm,'&gt;');
	else
		return div.innerHTML;
};

String.prototype.unescapeHTML = function() {
	if (this.indexOf('&')<0) return this.toString();

	var div = document.createElement('div');
		div.innerHTML = this.toString();
		div = div.childNodes[0];

	var out = div.nodeValue;
	while (1){
		if((div = div.nextSibling)){
			if (div.nodeValue)
				out += div.nodeValue;
		}
		else
			break;
	}

	div = null;

	return out;
};

/**
 * @brief	Analogy to quote meta in PHP
 * Example:
 *    - '\b\f\n\r\t'.quote() == '"\\b\\f\\n\\r\\t"'
 */
String.prototype.quote = function() {
	var c, i, l = this.length, o = '"';

	for (i = 0; i < l; i += 1) {
		c = this.charAt(i);
		if (c >= ' ') {
			if (c == '\\' || c == '"') o += '\\';
			o += c;
		}
		else {
			switch (c) {
				case '\b':
					o += '\\b';
					break;
				case '\f':
					o += '\\f';
					break;
				case '\n':
					o += '\\n';
					break;
				case '\r':
					o += '\\r';
					break;
				case '\t':
					o += '\\t';
					break;
				default:
					c = c.charCodeAt().toString(16);
					if (c.length == 1) {
						o += '\\u000'+c;
					} else {
						o += '\\u00' + c;
					}
			}
		}
	}
	return o + '"';
};

/**
 * @brief   Strip whitespace from the beginning and end of a string.
 * Example:
 *    - "   Lorem ipsum dolor sit amet  ".trim() == "Lorem ipsum dolor sit amet"
 */
if(!String.prototype.trim){
	String.prototype.trim = function () {
		return this.replace(/^\s+|\s+$/g,'');
	};
}

// Making pre-IE9 split behave like other browsers
// Martin Ekblom 2012
if("a".split(/a/gi).length) // Behaving browsers
	String.prototype.realsplit = String.prototype.split;
else // IE exception
	String.prototype.realsplit = function(s) {
		if(s instanceof RegExp) {
			var a = [], m, last = 0;
			while(m = s.exec(this)) {
				a.push(this.slice(last,m.index));
				if(m[1]) a.push(m[1]);
				last = s.lastIndex;
			}
			a.push(this.slice(last));
			return a;
		} else return String.prototype.split.apply(this,arguments);
	}

/**
 * @brief   Remove substrin specified by regular expression.
 * @param[in]  sRegExp  [string|regexp]   Etc. 'abc' or /abc/
 * @param[in]  sOption  [string] Regular expression flag. Possible values are:
 *    - 'g'   Global replace
 *    - 'i'   Ignore case
 *    - 'm'   Multiline
 * Default value is 'g'. This parametr has only meaning when the first
 * parametr is 'string'. When it is is regular expression, this parametr is
 * ignored.
 *
 * Examples:
 *    - "aadvark".remove('a', '') == "advark"
 *    - "aadvark".remove('a') == "dvrk"
 *    - "aadvark".remove('a', 'g') == "dvrk"
 *    - "aadvark".remove(/a/) == "dvrk"
 *
 *    - "Aadvark".remove('a', '') == "Advark"
 *    - "Aadvark".remove('a', 'i') == "advark"
 *    - "Aadvark".remove('a', 'gi') == "dvrk"
 *
 *    - "ten\nton\ntin".remove('n$', '') == "ten\nton\nti"
 *    - "ten\nton\ntin".remove('n$', 'm') == "te\nton\ntin"
 *    - "ten\nton\ntin".remove('n$', 'gm') == "te\nto\nti"
 */
String.prototype.remove = function(sRegExp,sOption){
	var regEx;
	if (Is.String(sRegExp))
		regEx = new RegExp(sRegExp,(typeof sOption != "undefined")?sOption:"g");
	else
		regEx = sRegExp;
	return this.replace(regEx,"");
};

String.prototype.wrap = function(){
	return this.replace(/(\r\n)|(\r)|(\n)/gm, "<br />");
};

/**
 * @brief   Remove HTML tags from string.
 *			inline	= ''
 *			block   = ' '
 * Example:
 * 			"<b>Lorem ipsum <i>dolor</i> sit amet</b>".removeTags() == "Lorem ipsum dolor sit amet"
 */
String.prototype.removeTags = function(str){
	return this.replace(/<[\!\/]?([\-a-zA-Z0-9]+)[^>^<]*>/gm,str || '').replace(/\&nbsp\;/g,' ');
};

/**
 * @brief   Quote characters that are not digits nor alphas.
 * Example:
 *    - "@#$%".quoteMeta() == "\@\#\$\%"
 */
String.prototype.quoteSQL =  function(){
	return this.replace(/([\'])/g, "$1$1").replace(/([%])/g , "\\$1");
};
String.prototype.quoteMeta = function(){
	return this.replace(/([\!\#\$\%\^\@\.\&\*\(\)\-\_\=\+\:\;\"\'\\\/\?\<\>\~\[\]\{\}\`])/g , "\\$1" );
};
// .replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");

// Extend Number to display localised currencies - Martin Ekblom 2017
Number.prototype.toCurrency = function(currency,nofraction) {
	var format = currency ? {style: 'currency', currency: currency} : {};
	if(nofraction)
		format.maximumFractionDigits = 0;
	var lang = document.documentElement.lang;
	return this.toLocaleString(lang,format);
}

// Extend Number to display bytes with units
Number.prototype.toComputerByteUnits = function(fractions,unit) {
	unit = Number.byteunits[(unit || "").toLowerCase()] || 0;
	return relativeByteSize(this,fractions,unit);
}
Number.prototype.toDecimalByteUnits = function(fractions,unit) {
	unit = Number.byteunits[(unit || "").toLowerCase()] || 0;
	return relativeByteSize(this,fractions,unit,1000);
}
Number.byteunits = {b: 0, kb: 1, mb: 2, gb: 3, tb: 4};

// General manipulation functionality
var GlobalTools = {
	// String search - constructor
	search: function(within) {
		this.text = within;
		this.word = '';
	}
}
// Find the string in the text
GlobalTools.search.prototype.find = function(str) {
	if(str) {
		this.word = str;
		this.re = new RegExp('('+this.word.quoteMeta()+')','gi');
	}
	if(this.text && this.word) {
		this.matches = this.text.realsplit(this.re);
		return this.matches.length>1 ? (this.matches.length-1)/2 : false;
	} else {
		this.matches = null;
		return false;
	}
}
// Set a new source text
GlobalTools.search.prototype.within = function(within) {
	this.text = within;
	return this;
}
// Return hits highlighted with html-tags (default strong) 
GlobalTools.search.prototype.highlight = function(tag) {
	if(!tag) tag = 'strong';
	var m = this.matches.slice(0),
		i = this.matches.length;
	if(i) {
		while(i--) {
			if(i&1)
				m[i] = '<'+tag+'>'+m[i].escapeXML()+'</'+tag+'>'
			else 
				m[i] = m[i].escapeXML();
		}
		return m.join('');
	} else return false;
}

////////////////////////////////////////////////////
//                 MATH TOOLS
////////////////////////////////////////////////////
function dec2hex(d) {return d.toString(16);}
function hex2dec(h) {return parseInt(h,16);}

////////////////////////////////////////////////////
//                 DATE TOOLS
////////////////////////////////////////////////////

/**
 * @brief   Return date in "webmail" format.
 * @param	bDateOnly	[boolean]
 * Example:
 *		(new Date()).toWMString() == '11/21/06 09:58'
 *		(new Date()).toWMString(true) == '11/21/06'
 */
Date.prototype.toWMString = function(bDateOnly,bTimeOnly,bShort, bNoYesterday){
	var regEx = /^(\d{1})$/g;

	if (bShort){
		var date = new Date();
		if (this.getFullYear() == date.getFullYear()){
			if (this.getMonth() == date.getMonth() && this.getDate() == date.getDate())
				bTimeOnly = true;
		}
		else
			bShort = false;
	}

		var full = '', last = '';
		if (!bTimeOnly){
			var year = this.getFullYear().toString(),
				month = (this.getMonth()+1).toString().replace(regEx,'0$1'),
				day = this.getDate().toString().replace(regEx,'0$1');

			if (bShort && !bNoYesterday && date.getJulianDate() == this.getJulianDate()+1)
				last = getLang('CALENDAR::YESTERDAY');
			else{
				storage.library('gw_others');
				switch(parseInt(GWOthers.getItem('LAYOUT_SETTINGS','date_format'),10)) {
					default:
					case 0: // 'mm/dd/yy'
						full = month + '/' + day + (bShort?'':'/' + year.substr(2));
						break;

					case 1: // 'mm/dd/yyyy'
						full = month + '/' + day + (bShort?'':'/' + year);
						break;

					case 2: // 'dd-mm-yyyy'
						full = day + '-' + month + (bShort?'':'-' + year);
						break;

					case 3: // 'dd/mm/yyyy'
						full = day + '/' + month + (bShort?'':'/' + year);
						break;

					case 4: // 'yyyy-mm-dd'
						full = (bShort?'':year + '-') + month + '-' + day;
						break;

					case 5: // 'dd-mm-yy'
						full = day + '-' + month + (bShort?'':'-' + year.substr(2));
						break;

					case 6: // 'dd/mm/yy'
						full = day + '/' + month + (bShort?'':'/' + year.substr(2));
						break;

					case 7: // 'dd.mm.yy'
						full = day + '.' + month + (bShort?'':'.' + year.substr(2));
						break;

					case 8: // 'dd.mm.yyyy'
						full = day + '.' + month + (bShort?'':'.' + year);
						break;

					case 9: // 'dd mmm yy'
						full = day + ' ' + getLang('SHORT_MONTHS::' + ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][this.getMonth()]) + (bShort?'':' ' + year.substr(2));
						break;
					case 10:// 'dd mmm yyyy'
						full = day + ' ' + getLang('SHORT_MONTHS::' + ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][this.getMonth()]) + (bShort?'':' ' + year);
						break;
				}
			}
		}

		if (bDateOnly)
			return full ? full : last;
		else{
            if (GWOthers.getItem('LAYOUT_SETTINGS','time_format')>0)
				return (full?full + ' ':'') + dateFormat(this,'hh:MM TT') + (last?' '+last:'');
            else
				return (full?full + ' ':'') + this.getHours().toString().replace(regEx,'0$1') + ':' + this.getMinutes().toString().replace(regEx,'0$1') + (last?' '+last:'');
		}
};

/*
 * @brief	Get relative date (without time), use if date with tomorrow/today/yesterday is required
 * @returns	String with localised and relative date without time (without year if bNoYear is true)
 */

Date.prototype.toRelativeDateString = function(bNoYear) {
	if(this.isTomorrow()) return getLang('CALENDAR::TOMORROW');
	if(this.isToday()) return getLang('CALENDAR::TODAY');
	if(this.isYesterday()) return getLang('CALENDAR::YESTERDAY');
	return this.toWMString(true,false,bNoYear,true);
}

/*
 * @brief	Get relative date and time, use if time with tomorrow/today/yesterday is required, year is omitted if current year, use with bTimeRelative to omit time component for non-relative dates
 * @returns	String with localised and relative date with time 
 */

Date.prototype.toRelativeTimeString = function(bTimeRelative) {
	var rel = '';
	var bNoYear = this.getFullYear() == new Date().getFullYear();
	if(this.isTomorrow()) 
		rel = getLang('CALENDAR::TOMORROW');
	if(this.isToday())
		rel = getLang('CALENDAR::TODAY');
	if(this.isYesterday())
		rel = getLang('CALENDAR::YESTERDAY');
	return rel ? 
		this.toWMString(false,true,bNoYear,true) + ' ' + rel : 
		this.toWMString(bTimeRelative,false,bNoYear,true);
}


/**
 * @brief	Get actual unix time (number of seconds since 1970-01-01).
 * @return	[number] UNIX time.
 */
Date.prototype.getUNIX = function(){
	return Math.floor(this.getTime()/1000);
};

/**
 * @brief	Set Date object by UNIX time.
 * @param[in]	iSec	[number]
 */
Date.prototype.setUNIX = function(iSec){
	this.setTime(iSec*1000);
	return this;
};

/**
 * @brief	Set Date to next month (the 1st of that month).
 */
Date.prototype.nextMonth = function() {
	this.setMonth(this.getMonth()+1,1);
	return this;
}

/**
 * @brief	Set Date to the previous month (the last of that month).
 */
Date.prototype.lastMonth = function() {
	this.setDate(0);
	return this;
}

/**
 * @brief	Set Date to last day of current month (28-31).
 */
Date.prototype.lastDayOfMonth = function() {
	this.setMonth(this.getMonth()+1,0);
	return this;
}

/**
 * @brief	Check if date is today.
 */
Date.prototype.isToday = function() {
	var d = new Date();
	return this.getFullYear()==d.getFullYear() && this.getMonth()==d.getMonth() && this.getDate()==d.getDate();
}

/**
 * @brief	Check if date is tomorrow.
 */
Date.prototype.isTomorrow = function() {
	var d = new Date();
	d.setDate(d.getDate()+1);
	return this.getFullYear()==d.getFullYear() && this.getMonth()==d.getMonth() && this.getDate()==d.getDate();
}

/**
 * @brief	Check if date is yesterday.
 */
Date.prototype.isYesterday = function() {
	var d = new Date();
	d.setDate(d.getDate()-1);
	return this.getFullYear()==d.getFullYear() && this.getMonth()==d.getMonth() && this.getDate()==d.getDate();
}

/**
 * @brief	Set Date by juliand date and number of minutes.
 * @param[in]	iDate	[number]	Julian date.
 * @param[in]	iIimte	[number]	Number of minutes.
 * Example:
 * 		var date1 = new Date();
 *		var date2 = new Date();
 *
 * 		date1.setGWTime((new Date()).getJulianDate(), 120);
 *		date2.setHours(2, 0, 0);
 *
 *		// date1.toString() == date2.toString();
 */
Date.prototype.setGWTime = function(iDate,iTime){
	return this.setQTime(iDate, iTime ? iTime*60 : 0);
};

/**
 * @brief	Set Date by juliand date and number of seconds.
 * @param[in]	iDate	[number]	Julian date.
 * @param[in]	iIimte	[number]	Number of seconds.
 * Example:
 *		var date1 = new Date();
 *		var date2 = new Date();
 *
 * 		date1.setQTime((new Date()).getJulianDate(), 3600);
 *		date2.setHours(1, 0, 0);
 *
 *		// date1.toString() == date2.toString();
 */
Date.prototype.setQTime = function(iDate,iTime){
	if (typeof iTime == 'undefined' || isNaN(iTime) || iTime == -1)
		iTime = 0;

	var hours,mins,secs;
	with (Math) {
		hours = floor(iTime/3600);
		mins = floor((iTime%3600)/60);
		secs = (iTime%3600)%60;
	}

	var oDate = parseJulianDate(iDate);
	this.setFullYear(oDate.year,oDate.month-1,oDate.day);
	this.setHours(hours, mins, secs, 0);
	
	return this;
};

Date.prototype.setUTCT = function(iDate){
	var x = /([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2})(Z)?/g;

	var r = x.exec(iDate);
	if (!r) //In case of FFox bug
		r = x.exec(iDate);
	x = null;

	this[r[8]?'setUTCFullYear':'setFullYear'](('20'+r[1])*1,(r[2]*1)-1,r[3]*1);
	this[r[8]?'setUTCHours':'setHours'](r[4]*1,r[5]*1,r[6]*1);
	
	return this;
};

Date.prototype.setVersit = function(iDate,sec_offset){

    iDate = iDate.replace(/[\:\-]/g,'');

	var x = /([0-9]{4})([0-9]{2})([0-9]{2})(T([0-9]{2})([0-9]{2})([0-9]{2})(Z)?)?/g;

	var r = x.exec(iDate);
	if (!r) //In case of FFox bug
		r = x.exec(iDate);
	x = null;

	if (r){
		this[r[8]?'setUTCFullYear':'setFullYear'](r[1]*1,(r[2]*1)-1,r[3]*1);

        r[5] = r[5] || 0;
        r[6] = r[6] || 0;
        r[7] = r[7] || 0;

		this[r[8]?'setUTCHours':'setHours'](r[5]*1,r[6]*1,(r[7]*1) + (sec_offset*1 || 0));
	}
};

/**
 * @brief	Get julian date of current object.
 * @return	[number]	Julian date.
 * Example:
 * 		// Prints current julian date
 * 		alert((new Date()).getJulianDate());
 */
Date.prototype.getJulianDate = function() {
	return getJulianDate(this.getDate(), this.getMonth()+1, this.getFullYear());
};

/**
 * @brief	Get week of year (1 - 53).
 * 			getWeek() was developed by Nick Baicoianu at MeanFreePath: http://www.meanfreepath.com
 *
 * @param 	[int] dowOffset (0-6, 1 is Monday)
 * @return	[int]	Week of year (1 - 53).
 *
 * Example:
 *		var date = new Date();
 *		date.setFullYear(2006, 0, 1);
 *		date.getWeekOfYear() == 1;
 */

Date.prototype.getWeekOfYear = function (dowOffset) {
	dowOffset = typeof(dowOffset) == 'int' ? dowOffset : 0; //default dowOffset to zero
	var newYear = new Date(this.getFullYear(),0,1),
		day = newYear.getDay() - dowOffset; //the day of week the year begins on
		day = (day >= 0 ? day : day + 7);
	
	var weeknum,
		daynum = Math.floor((this.getTime() - newYear.getTime() - (this.getTimezoneOffset()-newYear.getTimezoneOffset())*60000)/86400000) + 1;

	//if the year starts before the middle of a week
	if (day < 4) {
		weeknum = Math.floor((daynum+day-1)/7) + 1;
		if(weeknum > 52) {
			nYear = new Date(this.getFullYear() + 1,0,1);
			nday = nYear.getDay() - dowOffset;
			nday = nday >= 0 ? nday : nday + 7;
			
			//if the next year starts before the middle of the week, it is week #1 of that year
			weeknum = nday < 4 ? 1 : 53;
		}
	}
	else
		weeknum = Math.floor((daynum+day-1)/7);

	return weeknum;
};

/**
 * Translates day, month and year into julian date.
 * This function is opposite to parseJulianDate().
 * @param[in]	day		[number]
 * @param[in]	month	[number]
 * @param[in]	year	[number]
 * @return		[number]	Julian date.
 * @see		parseJulianDate()
 */
function getJulianDate(day, month, year){

	var greg,julian,sign,absm,jul;

    day = day*1;
	month = month*1;
	year = year*1

	with (Math) {

		if (year <= 1585)
			greg = 0;
		else
			greg = 1;

		if ((month - 9)<0)
			sign=-1;
		else
			sign=1;

		julian = -1 * floor(7 * (floor((month + 9) / 12) + year) / 4);

		absm = abs(month - 9);
		jul = floor(year + sign * floor(absm / 7));
		jul = -1 * floor((floor(jul / 100) + 1) * 3 / 4);
		julian = julian + floor(275 * month / 9) + day + (greg * jul);
		julian = julian + 1721027 + 2 * greg + 367 * year;
	}

	return julian;
};

/**
 * Translates julian date into day, month and year.
 * This function is opposite to getJulianDate().
 * @param[in]	julian	[number]	Julian date.
 * @return		[array]		Associative array {'date': 1-31, 'month': 1-12, 'year': [number]}.
 * @see		getJulianDate()
 */
function parseJulianDate(julian){

	var juli,base1,base2,year,month,day;
	var date = new Object();

	with (Math) {
		juli = floor(julian);
		base1 = floor(juli + 68569);
		base2 = floor(4 * base1 / 146097);
		base1 = base1 - floor((146097*base2 + 3)/4);
		year = floor(4000*(base1 + 1)/1461001);
		base1 = base1 - floor(1461 * year / 4) + 31;
		month = floor(80 * base1 / 2447);
		day = base1 - floor(2447 * month / 80);
		base1 = floor(month/11);
		month = month + 2 - 12*base1;
		year = 100*(base2 - 49) + year + base1;
	}

	date.day = day;
	date.month = month;
	date.year = year;

	return date;
};

/**
 * Translates seconds to minutes and seconds.
 * @param[in]	iTime	[number]	Number of seconds.
 *
 * @return	[string]	Of format 'minutes:seconds'.
 * Example:
 * 		parseJulianTime(3601) == '1:01';
 */
function parseJulianTime(iTime){
	var H  = (iTime-iTime%3600)/3600,
		M = Math.ceil(iTime%3600/60);
		M = M<10?'0'+M:M;
		
	if (GWOthers.getItem('LAYOUT_SETTINGS','time_format')>0)
    	return (H % 12 || 12) + ':' + M + (H<12?" AM":" PM");
	else
		return H + ':' + M;
};

/**
 *	Date Format 1.1
 *	(c) 2007 Steven Levithan <stevenlevithan.com>
 *	MIT license
 *	With code by Scott Trenda (Z and o flags, and enhanced brevity)
 **/
var dateFormat = function (){

	var	token        = /d{1,4}|m{1,4}|D{3,4}|M{4}|yy(?:yy)?|([HhMsTtn])\1?|[LloZ]|"[^"]*"|'[^']*'/g,
		timezone     = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
		timezoneClip = /[^-+\dA-Z]/g,
		pad = function (value, length) {
			value = String(value);
			length = parseInt(length) || 2;
			while (value.length < length)
				value = "0" + value;
			return value;
		};

	// Regexes and supporting functions are cached through closure
	return function (date, mask) {

		// Treat the first argument as a mask if it doesn't contain any numbers
		if (arguments.length == 1 && (typeof date == "string" || date instanceof String) && !/\d/.test(date)) {
			mask = date;
			date = undefined;
		}

		date = date ? new Date(date) : new Date();
		if (isNaN(date))
			throw "invalid date";

		var dF = dateFormat;
		mask   = String(dF.masks[mask] || mask || dF.masks["default"]);

		var	d = date.getDate(),
			D = date.getDay(),
			m = date.getMonth(),
			y = date.getFullYear(),
			H = date.getHours(),
			M = date.getMinutes(),
			s = date.getSeconds(),
			L = date.getMilliseconds(),
			o = date.getTimezoneOffset(),
			flags = {
				d:		d,
				dd:		pad(d),
				ddd:	dF.i18n.dayNames[D],
				dddd:	dF.i18n.dayNames[D + 7],
				DDD:	getLang('DATETIME::'+ (['SUN','MON','TUE','WED','THU','FRI','SAT'])[D]),
				DDDD:	getLang('DATETIME::'+ (['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'])[D]),
				m:		m + 1,
				mm:		pad(m + 1),
				mmm:	dF.i18n.monthNames[m],
				mmmm:	dF.i18n.monthNames[m + 12],
				MMMM:	getLang('DATETIME::'+ (['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'])[m]),
				yy:		String(y).slice(2),
				yyyy:	y,
				h:		H % 12 || 12,
				hh:		pad(H % 12 || 12),
				H:		H,
				HH:		pad(H),
				M:		M,
				MM:		pad(M),
				n:		M,
				nn:		pad(M),
				s:		s,
				ss:		pad(s),
				l:		pad(L, 3),
				L:		pad(L > 99 ? Math.round(L / 10) : L),
				t:		H < 12 ? "a"  : "p",
				tt:		H < 12 ? "am" : "pm",
				T:		H < 12 ? "A"  : "P",
				TT:		H < 12 ? "AM" : "PM",
				Z:		(String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
				o:		(o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4)
			};

		return mask.replace(token, function ($0) {
			return ($0 in flags) ? flags[$0] : $0.slice(1, $0.length - 1);
		});
	};
}();

// Some common format strings
dateFormat.masks = {
	"default":"ddd mmm d yyyy HH:MM:ss",
	shortDate:"m/d/yy",
	mediumDate:"mmm d, yyyy",
	longDate:"mmmm d, yyyy",
	fullDate:"dddd, mmmm d, yyyy",
	shortTime:"h:MM TT",
	mediumTime:"h:MM:ss TT",
	longTime:"h:MM:ss TT Z",
	imDateTime:"yyyy-mm-dd'T'HH:MM:ssZ",
	searchDate:"yyyy/mm/dd",
	isoDate:"yyyy-mm-dd",
	isoTime:"HH:MM:ss",
	isoDateTime:"yyyy-mm-dd'T'HH:MM:ss",
	isoFullDateTime:"yyyy-mm-dd'T'HH:MM:ss.lo",
	rfc2822:"ddd, dd mmm yyyy HH:MM:ss o",
	//mail:"DDD, d MMMM, yyyy",
	mediumDate:"m/d/yy HH:MM"
};

// Internationalization strings
dateFormat.i18n = {
	dayNames: [
		"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
		"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
	],
	monthNames: [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
		"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
	]
};

// For convenience...
Date.prototype.format = function (mask) {
	return dateFormat(this, mask);
};

////////////////////////////////////////////////////
//                 ARRAY  TOOLS
////////////////////////////////////////////////////

/**
 * @brief   Returns keys of array (or object).
 * If the parametr is object, take only non-null properties.
 * @param[in]  arr   [array|object]
 * @author  DRZ 10.03.2005
 * @return  Array of keys.
 * Example:
 *    arrayKeys(["lorem", "ipsum"]); // == [0, 1]
 *    arrayKeys({"lorem": true, "ipsum": false}) // == ["lorem", "ipsum"]
 *
 *    var oObject = new Object();
 *    oObject.a = 10;
 *    oObject.b = null;
 *    oObject.c = "test";
 *
 *    arrayKeys(oObject); // == ["a", "c"]
 */
function arrayKeys(arr){
	var keys = new Array();
	for (var i in arr)
		if (arr[i] != null)
			keys.push(i);

	return keys;
};

/**
 * @brief   Search value in string, array or object.
 * @param[in]  sElm  [string|array|object]
 * @author  DRZ 10.03.2005
 * @return  If the parameter is:
 *    - string: then returns position of 'sElm' in string.
 *    - array:  index in the array.
 *    - object: name of the property which has the same value as 'sElm'.
 *
 *    If the value isn't found, return -1.
 *
 * Example:
 *    - inArray("lorem ipsum", "ipsum") == 6
 *    - inArray("lorem ipsum", "dolor") == -1
 *    - inArray(["lorem", "ipsum"], "ipsum") == 1
 *    - inArray({"prop1": "lorem", "prop2": "ipsum"}, "ipsum") == "prop2"
 */
function inArray (aArray,sElm)
{
	if (typeof aArray.indexOf != 'undefined' && Is.Array(aArray))
		return aArray.indexOf(sElm);
	else
	for(var i in aArray)
		if(aArray[i]==sElm) return i;

	return -1;
};

/**
 * @brief   Reverse the order of items in the array of object.
 * @param[in]  oObj  [array|object]
 * @return  Array or object with items in reversed order.
 *
 * Example:
 *    - reverse(["lorem", "ipsum"] == ["ipsum", "lorem"]
 *    - reverse({"lorem": 1, "ipsum": 2}) == {"ipsum": 2, "lorem": 1}
 */
function reverse (oObj){
	// reverse array
	if (oObj.constructor == Array)
		return oObj.reverse();

	// reverse object
	var key=[],oOut = {};
	for (var i in oObj)
		key.push(i);

	key.reverse();
	for (var i in key)
		oOut[key[i]] = oObj[key[i]];

	return oOut;
};

/**
 * @brief   Concat unlimited number of associative arrays.
 * @param[in]  '...'  [object] Unlimited number of associative arrays.
 * @author  DRZ 22.05.2005
 * @warning Doesn't work on normal arrays!
 * @return  Union of all arrays.
 *
 * Example:
 *    // {"color": "red", "shape": "triangle", "size": "small", "position": "bottom"}
 *    arrConcat({"color": "red", "shape": "triangle"}, {"size": "small"}, {"position": "bottom"});
 *
 *     // BAD USAGE, returns ["blue", "green"]
 *    arrConcat(["red", "green"], ["blue"]);
 */
function arrConcat(){
	var main = {};
	for (var a = 0;a<arguments.length;a++)
		for (var i in arguments[a]) main[i] = arguments[a][i];

	return main;
};

/**
 * @brief   : concat & unique array
 *            doesnt affect original array
 * @warning : work on normal array ONLY!
 **/
function arrConcatValues(){

	var main = clone(arguments[0]);

	for (var a = 1;a<arguments.length;a++)
		for (var i in arguments[a])
			if (inArray(main,arguments[a][i])<0)
				main.push(arguments[a][i]);

	return main;
};

/**
 * @brief   Makes multidimensional array.
 * @param[in]  keys  [array]  List of keys.
 * @param[out]  arr   [array]  Optional, create subarray into alredy exising array.
 * @author  DRZ 01.05.2005
 * @return  Multidimensional array indexed by keys from 'keys' argument.
 *
 * Example:
 *    var aArray = {"first": []};
 *
 *    // Prints only structure of created subarray.
 *    // [first]
 *    //    [second]
 *
 *
 *    // But the whole array looks like this:
 *    // [first]
 *    //    [second]
 *    //       [third]
 *
 *
 * 22.7.2008 12:01:58 -  zmena z [] na {}
 */
function mkArrayPath(keys,arr,val){

	if(typeof arr != 'object') arr = {};

	var out = arr;

	for (var i in keys){

		if (arguments.length>2 && keys.length-1 == i)
			arr[keys[i]] = val;
		else
		if (typeof arr[keys[i]] != 'object')
			arr[keys[i]]={};

		arr = arr[keys[i]];
	}
	
	return out;
};

function arrayPath(aData,aDPath){
	for(var i in aDPath){
        aData = aData[aDPath[i]];
		if (typeof aData == 'undefined')
		    return;
	}

	return aData;
};

/**
 * @brief: Search in array for substrings.
 * @param[in]  aArray   [array]  List of strings. Non-string items are ignored.
 * @param[in]  sNeedle  [string] Searched substring, e.g. "html".
 * @param[in]  bCase    [boolean]   Ignore case, default false.
 * @date : 25.3.2006 18:25:40
 * @note : DODELAT ADDSLASHES
 * @return  Array of items containing substring 'sNeedle'.
 *
 * Example:
 *    - arraySearch(["he", "she", "there"], "he") == ["he", "she", "there"]
 *    - arraySearch(["he", "she", "there"], "re") == ["there"]
 */
function arraySearch(aArray,sNeedle,bCase){
	var sFlag = 'g',aOut = [];
	if(bCase) sFlag = 'gi';

	if(!Is.Array(aArray) || !Is.String(sNeedle)) return aOut;

	var rRe = new RegExp(sNeedle.quoteMeta(),sFlag);

	for (var i in aArray)
		if (aArray[i].match && aArray[i].match(rRe)) aOut.push(aArray[i]);

	return aOut;
};

/**
 * @fn   substract(Array1,Array2[,Array3...])
 * @brief   Removes values from Array1 which are contained in remaining arguments.
 * @param[in]  main  [array|object]  Main array from which the values are removed.
 * @param[in]  '...' [array|object]  List of arrays of values which are removed from the 'main'.
 * @return  Array of values which are contained in 'main' but NOT in the rest arrays.
 * @note Resulted array can cantain 'gaps', if you want classic array starting from zero
 * use compact() moreover.
 * @see  compact()
 * @date    12.5.2006 14:01:36
 *
 * Example:
 *    - substract(["red", "green", "blue", "black"], ["red", "blue"], ["black"]) == {"1": "green"}
 *    - substract({"one": "green", "two": "red"}, {"three": "green"}) == {"two": "red"}
 */
function substract(main){
	if (arguments.length<2) return main;
	var a,n;
	for (var ii = 1;ii<arguments.length;ii++){
		a = arguments[ii];
		for(var i in a)
			if((n = inArray(main,a[i])) != -1) delete main[n];
	}
	return main;
};

/**
 * @brief   Return lowest free key in array. (Array must be classical starting from zero!).
 * @param[in]  arr   [array]
 * @return  The first index which isn't defined. If array doesn't contain any gaps,
 * return index rigth after the last item.
 * @date : 10.5.2006 9:32:22
 *
 * Example:
 *    var aArray = ["one", "two", "three"];
 *    delete aArray[1]; // make 'hole'
 *
 *    // prints 1
 *    alert(getFreeKey(aArray));
 */
function getFreeKey(arr){
	/*
	for(var i = 0;i <= arr.length;i++)
		if (typeof arr[i] == 'undefined')
		  return i;
	*/

	for(var i = 0;;i++)
		if (typeof arr[i] == 'undefined')
		    return i;
};

/**
 * @brief   Leave only specified keys from arr2 in arr1.
 * @param[in]  arr1  [object] Associative array {key1:value,key2:value}.
 * @param[in]  arr2  [array] Array [key1,key2,...].
 * @return  Array containing only specified items.
 * @todo What is it good for when the second parametr is assoc. array?
 * @date : 16.5.2006 11:14:05
 *
 * Example:
 *    - arrKeySlice({"one": "red", "two": "green", "three": "blue"}, ["two"]) == {"two": "green"}
 */
function arrKeySlice(arr1,arr2){
	/* create Arrr or object along to arr1 type */
	var k,isa = false,out = [];
	if (arr2.constructor == Array) isa=true;

	if (!arr1 || !arr2) return isa?out:compact(arr2);

	for (var i in arr2){
		if (isa)
			k = arr2[i]
		else
			k = i;

		if(!isa && !arr1[k] && arr2[k])
			out[k] = arr2[k];  // TODO: what is it good for?
		else if (typeof arr1[k] != 'undefined')
			out[k] = arr1[k];
	}
	return out;
};

/**
 * @brief	Remove empty and null items from the array.
 * @param[in]  a  [array|object]
 * @return	New array (the old one is left unchanged) with stripped null and
 * empty strings.
 *
 * Example:
 *		compact([1, '2', '', 3, null, '4']) => [1, '2', 3, '4']
 */
function compact(a){
	var b;
	if (Is.Array(a)){
		b = [];
		for(var i in a)
			if(a[i]) b.push(a[i]);
	}
	else{
		b = {};
		for(var i in a)
			if(a[i]) b[i] = a[i];
	}
	return b;
};


/**
 * @brief   Return number of values in array or object.
 * @param[in]  arr   [array|object]
 * @date : 10.5.2006 9:31:05
 *
 * Example:
 *    - count({"one": "red", "two": "green"}) == 2
 *    - count(["one", "two", "three"]) == 3
 */
function count (arr){
	var i = 0;
	//if (arr.constructor == Array) return arr.length;  - nahovno arraycount == maxkey+1
	if (typeof arr == 'object') {
		for (var v in arr) i++;
		return i;
	}
	return -1;  // invalid argument
};

/**
 * @brief   Check if two one dimensional arrays are identical (keys must be the same!).
 * Items are compared one by one so be careful when comparing multidimensional arrays.
 * This function works on one-dimensional array as you expected (items are atomic values).
 * When comparing subarrays, the are considered the same only if they are the same
 * references (they point to the same address in the memory).
 * @param[in]  arr1  [array]
 * @param[in]  arr2  [array]
 * @return  true/false
 *
 * @warning arrayCompare(["one", "two"], ["two", "one"]) == false because of different order!
 * (["one", "two"] == {"0": "one", "1": "two"} != {"0": "two", "1": "one"}).
 * @warning Only first dimension is compared so arrayCompare([[1]], [[1]]) == false.
 *
 * Example:
 *    - arrayCompare(["one", "two"], ["one", "two"]) == true
 *    - arrayCompare(["one", "two"], ["two", "one"]) == false
 *    - arrayCompare(["one", "two"], {"1": "two", "0": "one"}) == true
 *    - arrayCompare([[1]], [[1]]) == false
 *
 *    // Special case with multidimensional array
 *    var aArray = [1];
 *    arrayCompare([aArray], [aArray]); // == true
 */
function arrayCompare(arr1, arr2) {
	var length = 0;

	for (var key in arr1) {
		if (arr1[key] != arr2[key]) {
			return false;
		}
		length++;
	}
	if (count(arr2) == length)
		return true;
	else
		return false;
};

////////////////////////////////////////////////////
//                   URL  TOOLS
////////////////////////////////////////////////////

/**
 * @brief   Function build URL GET string from JS array.
 * Don't worry about special characters like & or %, they are URL encoded.
 * @param[in]  varList  [object] Associative array of name->value.
 * @return GET string composed from pairs (name,value) from 'varList'.
 * @author DRZ 06.12.2012
 *
 * Example:
 *    - buildURL({"size": "normal", "special": "%^&"}) == "size=normal&special=%25%5E%26"
 */
function buildURL(varList) {
	var url = [];
	for (var name in varList )
		url.push(encodeURIComponent(name)+ '=' + encodeURIComponent(varList[name]));

	return url.join('&');
};

/**
 * @brief   Function parses URL GET variables to JS array.
 * @param[in]  url   [string] URL encoded string.
 * @return  Associative array of name->value obtained from url.
 * @author  DRZ 06.12.2012
 * 
 * DOESNT WORK WITH UTF16 (%uXXXX)!
 *
 * Example:
 *    - parseURL("size=normal&special=%25%5E%26") == {"size": "normal", "special": "%^&"}
 */
function parseURL(url){
	var p,r,argList,newArg,output = [];
	
	if (!url)
		url = self.location.href;

	//strip # part
	if ((p = url.indexOf('#')) > -1)
		url = url.substr(0,p);

	if ((p = url.indexOf('?'))>-1 && (p<url.indexOf('=')))
		url = url.substr(p+1);

	argList = url.split('&');
	for (var i = 0; i<argList.length; i++){
		newArg = argList[i].split('=');

		try{
			output[decodeURIComponent(newArg[0])] = decodeURIComponent(newArg[1]);
		}
		catch(r){
			return [];
		}
	}
	return output;
};


/**
 *	parse filesize from bytes to kB/MB
 *	1.2.2010 16:16:39
 */
function parseFileSize(i){
	if ((i = parseInt(i,10)) && Is.Number(i)){
		i = Math.ceilFloat(i/1024,1);
		if (i>1024)
			return Math.ceilFloat(i/1024,1) + ' MB';
		else
		    return i + ' kB';
	}
	else
	    return '0 kB';
};

/*	Add unit after rounded byte value
 *
 *	i: value in bytes (see u for other units)
 *	p: precision, by default no fractions [optional]
 *	u: initial unit for the value i, by default bytes - 1 for kB, 2 for MB, etc [optional]
 *
 *	Martin Ekblom 2017	
 */
function relativeByteSize(i,p,u,b) {
	u = u || 0;
	p = p || 0;
	b = b || 1024;

	// Used locale
	var lang = document.documentElement.lang;

	// Localised units
	if(!relativeByteSize.unit) {
		relativeByteSize.unit = [
			getLang('generic::size_b'),
			getLang('generic::size_kb'),
			getLang('generic::size_mb'),
			getLang('generic::size_gb'),
			getLang('generic::size_tb'),
			getLang('generic::size_pb')
		];
	}

	// Number formatting
	var format = {maximumFractionDigits: p};

	// Finding suitable unit and returning it
	var d = i/b;
	if(d>=1) {
		return relativeByteSize(d,p,++u,b);
	} else {
		return (+i).toLocaleString(lang,format) + ' ' + relativeByteSize.unit[u];
	}
}

////////////////////////////////////////////////////
//                COOKIES  MANAGER
//      https://github.com/js-cookie/js-cookie
////////////////////////////////////////////////////

!function(e){var n;if("function"==typeof define&&define.amd&&(define(e),n=!0),"object"==typeof exports&&(module.exports=e(),n=!0),!n){var t=window.Cookies,o=window.Cookies=e();o.noConflict=function(){return window.Cookies=t,o}}}(function(){function e(){for(var e=0,n={};e<arguments.length;e++){var t=arguments[e];for(var o in t)n[o]=t[o]}return n}function n(e){return e.replace(/(%[0-9A-Z]{2})+/g,decodeURIComponent)}return function t(o){function r(){}function i(n,t,i){if("undefined"!=typeof document){"number"==typeof(i=e({path:"/"},r.defaults,i)).expires&&(i.expires=new Date(1*new Date+864e5*i.expires)),i.expires=i.expires?i.expires.toUTCString():"";try{var c=JSON.stringify(t);/^[\{\[]/.test(c)&&(t=c)}catch(e){}t=o.write?o.write(t,n):encodeURIComponent(String(t)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,decodeURIComponent),n=encodeURIComponent(String(n)).replace(/%(23|24|26|2B|5E|60|7C)/g,decodeURIComponent).replace(/[\(\)]/g,escape);var f="";for(var u in i)i[u]&&(f+="; "+u,!0!==i[u]&&(f+="="+i[u].split(";")[0]));return document.cookie=n+"="+t+f}}function c(e,t){if("undefined"!=typeof document){for(var r={},i=document.cookie?document.cookie.split("; "):[],c=0;c<i.length;c++){var f=i[c].split("="),u=f.slice(1).join("=");t||'"'!==u.charAt(0)||(u=u.slice(1,-1));try{var a=n(f[0]);if(u=(o.read||o)(u,a)||n(u),t)try{u=JSON.parse(u)}catch(e){}if(r[a]=u,e===a)break}catch(e){}}return e?r[e]:r}}return r.set=i,r.get=function(e){return c(e,!1)},r.getJSON=function(e){return c(e,!0)},r.remove=function(n,t){i(n,"",e(t,{expires:-1}))},r.defaults={},r.withConverter=t,r}(function(){})});

////////////////////////////////////////////////////
//                 Miscellaneous
////////////////////////////////////////////////////

// TODO unless executeCallbackFunction reorders the parameters
// this hacker function wouldn't be nedeed
function pushParameterToCallback(aResponse, arg) {
	if (Is.Function(aResponse[0])) {
		if (Is.Array(aResponse[1]))
			aResponse[1].push(arg);
		else
			aResponse[1] = [arg];
	}
	else
	if (Is.Object(aResponse[0])) {
		if (Is.Array(aResponse[2]))
			aResponse[2].push(arg);
		else
			aResponse[2] = [arg];
	}
	else
		throw 'pushParameterToCallback - Invalid argument';
};

/**
 * @brief	Implements calling registered function.
 * This function is used everywhere the callback is needed, mostly in reaction on some event
 * in the form. Etc. when the user submit some form and we need extra actions connected to that event.
 * @param[in]	aResponse	[array]
 * 		[0] - [Object|Function]		Depends on whether we call standalone function or member function.
 * 		[1] - [String|Array|Function]
 * 									If the first parameter is Object, the second must be string (name
 * 									of the function, otherwise array containing arguments to the function.
 * 		[3]	- [Array]				Optional. It can be preset in case the first parameter is object and
 * 									it represents argument to the function.
 *
 * @param[in]				[all]	Optional. The callback function is then called with these parameters and
 * 									they have 'higher priority' to aResponse[3] in that way they are first.
 *
 * @TODO	Don't reorder parameters!
 *
 * Example 1:
 * 		var func = function(arg) {
 * 			alert(arg1);
 * 			alert(arg2);
 * 		}
 *
 *		executeCallbackFunction([func, ['2']], '1');	// Will print '1' and '2'
 *
 * Example 2:
 * 		var date = new Date();
 *
 *		executeCallbackFunction([date, 'setHours', [2, 3, 0], xml|array (default)|text], 1);	// Sets 1 hours, 2 minutes, 3 seconds and 0 milliseconds.
 */




function getCallbackFunction(aResponse,bAlways){
	if (Is.Function(aResponse[0]))
	    return aResponse[0];
	else
	if (Is.Function(aResponse[1]))
	    return aResponse[1];
	else
	if (bAlways || !aResponse[0]._destructed)
		try{
			return aResponse[0][aResponse[1]];
		}
		catch(r){
			return false;
		}
	else
		return false;
};

function executeCallbackFunction(aResponse)
{
	if (Is.Array(aResponse) && ((Is.Object(aResponse[0]) && (Is.String(aResponse[1]) || Is.Function(aResponse[1]))) || Is.Function(aResponse[0])))
		try
		{
			//Method or function?
			var nIndex;
			if (Is.Function(aResponse[0]))
				nIndex = 1;
			else
				nIndex = 2;

			//Prepare arguments
			var args = [];
			for (var i = 1; i < arguments.length; i++)
				args.push(arguments[i]);

			if (Is.Array(aResponse[nIndex]))
				args = args.concat(aResponse[nIndex]);

			// [this,'method',[argument after],argument before, argument before...]
			for (var i = nIndex+1; i < aResponse.length; i++)
				args.unshift(aResponse[i]);

			var bOut;
			// function, [args]
			if (nIndex == 1) //Is.Function(aResponse[0])
                bOut = aResponse[0].apply(null,args);
			else
			// object, method, [args]
			if (Is.Function(aResponse[1]))
				bOut = aResponse[1].apply(aResponse[0], args);
			// object, "method", [args]
			else{
				bOut = aResponse[0][aResponse[1]].apply(aResponse[0],args);

				if (aResponse[0]._destructed == true)
					return false;
			}

			return bOut; //true;
		}
		catch(e){

			var err = '';
			if (Is.String(aResponse[0]))
				err = "Error while executing "+aResponse[0]+"() in browser_ext:executeCallbackFunction()";
			else
				err = "Error while executing "+(aResponse[0] && aResponse[0]._pathName?aResponse[0]._pathName:'oObject')+"."+aResponse[1]+"() in browser_ext:executeCallbackFunction()";

			err +="\nCode:\n"+getCallbackFunction(aResponse);

            throw err;
		}
	else
		return false;
};

function createNameFromLocation(aLCTval){
    if (Is.Object(aLCTval)){
		var a = [];
		if (aLCTval.ITMFIRSTNAME)
		    a.push(aLCTval.ITMFIRSTNAME);
		if (aLCTval.ITMMIDDLENAME)
		    a.push(aLCTval.ITMMIDDLENAME);
		if (aLCTval.ITMSURNAME)
		    a.push(aLCTval.ITMSURNAME);
		if (aLCTval.ITMSUFFIX)
		    a.push(aLCTval.ITMSUFFIX);

		return (aLCTval.ITMTITLE?aLCTval.ITMTITLE+' ':'') + a.join(' ');
	}

	return '';
};
function parseNameToLocation(sName,aLCTval){
	sName = (sName || '').trim();

	if (Is.Object(aLCTval)){
		aLCTval.ITMCLASSIFYAS = sName;
		aLCTval.ITMTITLE = '';
		aLCTval.ITMFIRSTNAME = '';
		aLCTval.ITMMIDDLENAME = '';
		aLCTval.ITMSURNAME = '';
		aLCTval.ITMSUFFIX = '';
	}
	else
		var aLCTval = {ITMCLASSIFYAS:sName};

	if (!sName.length) return aLCTval;	

	var	tmp,p,aName = sName.split(' ');

	//clear blank spaces
	for (var i = aName.length-1;i>-1;i--)
	    if (!(aName[i] = aName[i].trim()))
	    	aName.splice(i,1);

	if (aName.length){

		//Prepare from Lang
		var aLang = getLang('NAME_PREFIX'),
			aPref = {},aSuff = {};
		for (var i in aLang)
            if (aLang[i])
				aPref[aLang[i].toUpperCase()] = true;

		aLang = getLang('NAME_SUFFIX');
		for (var i in aLang)
            if (aLang[i])
				aSuff[aLang[i].toUpperCase()] = true;

		//Prefix
		while (Is.String(aName[0]))
			if (aPref[aName[0].toUpperCase()])
	            aLCTval.ITMTITLE = (aLCTval.ITMTITLE || '') + aName.shift();
			else
			if ((p = aName[0].lastIndexOf('.'))>-1){
				if (p == aName[0].length-1)
	                aLCTval.ITMTITLE = (aLCTval.ITMTITLE || '') + aName.shift();
				else{
	               tmp = aName[0].split('.');
	               aName[0] = tmp.pop();
	               aLCTval.ITMTITLE = (aLCTval.ITMTITLE || '') + tmp.join('.') + '.';
				}
			}
			else
			    break;

		//FirstName
		aLCTval.ITMFIRSTNAME = aName.shift();

        //Suffix 1
		while(true){
			if ((tmp = aName[aName.length-1]) && (tmp.toUpperCase() === tmp || (p = tmp.indexOf('.'))>-1 || aSuff[tmp.toUpperCase()])){
				if (p>-1){
					tmp = tmp.split('.');
					if (tmp[0] && tmp[1]){
						aLCTval.ITMSUFFIX = tmp[1];
						aName[aName.length-1] = tmp[0];
					}
					else
						aLCTval.ITMSUFFIX = aName.pop() + (aLCTval.ITMSUFFIX?' '+aLCTval.ITMSUFFIX:'');
				}
				else
					aLCTval.ITMSUFFIX = aName.pop() + (aLCTval.ITMSUFFIX?' '+aLCTval.ITMSUFFIX:'');
			}
			else
			    break;
		}

		//MiddleName
		if (aName.length>1 && aName[0].indexOf('.')<0)
			aLCTval.ITMMIDDLENAME = aName.shift();

		//SurName
		if ((tmp = aName.shift())){
			aLCTval.ITMSURNAME = tmp;

			//Suffix 2
			if ((tmp = aName.join(' ')))
				aLCTval.ITMSUFFIX = tmp + (aLCTval.ITMSUFFIX?' '+aLCTval.ITMSUFFIX:'');
		}
		else
		if (aLCTval.ITMMIDDLENAME){
            aLCTval.ITMSURNAME = aLCTval.ITMMIDDLENAME;
			delete aLCTval.ITMMIDDLENAME;
		}
		else
		if (aLCTval.ITMFIRSTNAME){
			aLCTval.ITMSURNAME = aLCTval.ITMFIRSTNAME;
			delete aLCTval.ITMFIRSTNAME;
		}
	}

	return aLCTval;
};

function getPrimaryAccountFromAddress() {
	var aAccInfo = dataSet.get('accounts',[sPrimaryAccount]);
	if (aAccInfo['FULLNAME'])
		return MailAddress.createEmail(aAccInfo['FULLNAME'],sPrimaryAccount);
	else
		return sPrimaryAccount;
}

function getSubobjects(oObject,aObjects) {
    aObjects = aObjects || {};
	for (var i in oObject)
		if (i.charAt(0) != '_' && i.substr(0,2) != 'X_' && i.substr(0,2) != 'x_')
			if (oObject[i]._type == 'obj_tabs' || oObject[i]._type == 'obj_tab')
				getSubobjects(oObject[i], aObjects);
			else
				aObjects[i] = oObject[i];

	return aObjects;
};

function getAuxiliarySubobjects(oObject,aObjects) {
    aObjects = aObjects || {};
	for (var i in oObject)
		if (i.charAt(0) != '_')
			if (i.substr(0,2) == 'X_' || i.substr(0,2) == 'x_')
				aObjects[i] = oObject[i];
			else
			if (oObject[i]._type == 'obj_tabs' || oObject[i]._type == 'obj_tab')
				getAuxiliarySubobjects(oObject[i], aObjects);

	return aObjects;
};

function loadDataIntoForm(oObject, aValues) {
	var aObjects = getSubobjects(oObject);
	for (var i in aObjects)
		if (Is.Defined(aValues[i]) && aValues[i] != 'undefined')
			aObjects[i]._value(aValues[i]);
};

function loadDataIntoFormOnAccess(oObject, aValues, bIgnoreDomain){
	var aObjects = getSubobjects(oObject,aObjects);
	if (aValues['USERACCESS'] || aValues['DOMAINADMINACCESS'])
		var aAuxiliaryObjects = getAuxiliarySubobjects(oObject);

	for (var i in aObjects) {
		if (aValues['ACCESS'][i]) {
			switch(aValues['ACCESS'][i]){
				case 'full':
					aObjects[i]._value(aValues['VALUES'][i]);
					break;
				case 'view':
					aObjects[i]._value(aValues['VALUES'][i]);
					aObjects[i]._disabled(true);
					break;

				case 'none':
					aObjects[i]._main.parentNode.style.display = "none";
			}
		}
		if (aValues['DOMAINADMINACCESS'] && !bIgnoreDomain) {
			if (aAuxiliaryObjects['x_'+i+'_set']) {
				aAuxiliaryObjects['x_'+i+'_set'].domadmin._value((aValues['DOMAINADMINACCESS'][i] == 'view') ? true : false);

				if (aValues['ACCESS'][i] == 'view')
					aAuxiliaryObjects['x_'+i+'_set'].domadmin._disabled(true);
			}
		}
		if (aValues['USERACCESS']) {
			if (aAuxiliaryObjects['x_'+i+'_set']) {
				aAuxiliaryObjects['x_'+i+'_set'].user._value((aValues['USERACCESS'][i] == 'view') ? true : false);

				if (aValues['ACCESS'][i] == 'view')
					aAuxiliaryObjects['x_'+i+'_set'].user._disabled(true);
			}
		}
	}
};

function storeDataFromFormWithAccess(oObject, aValues, aAccess) {
	var aObjects = getSubobjects(oObject);
	var aAuxiliaryObjects = getAuxiliarySubobjects(oObject);

	var value;
	for(var i in aObjects) {
		if (Is.Defined((value = aObjects[i]._value())))
			aValues[i] = value;
		else
			aValues[i] = '';

		if (aAuxiliaryObjects['x_'+i+'_set'] && aAuxiliaryObjects['x_'+i+'_set'].domadmin) {
			if (!aAccess['DOMAINADMINACCESS']) aAccess['DOMAINADMINACCESS'] = {};
			aAccess['DOMAINADMINACCESS'][i] = aAuxiliaryObjects['x_'+i+'_set'].domadmin._value() ? 'view' : 'full';
		}

		if (aAuxiliaryObjects['x_'+i+'_set']) {
			if (!aAccess['USERACCESS']) aAccess['USERACCESS'] = {};
			aAccess['USERACCESS'][i] = aAuxiliaryObjects['x_'+i+'_set'].user._value() ? 'view' : 'full';
		}
	}
};

function storeDataFromForm(oObject, aValues) {
	var aObjects = getSubobjects(oObject);
	var value;
	for(var i in aObjects){
		if (Is.Defined((value = aObjects[i]._value())))
			aValues[i] = value;
		else
			aValues[i] = '';
	}
};

function firstIndex(oObject) {
	if (Is.Object(oObject)) {
		for(var i in oObject)
			return i;
		return null;
	}
	else
		return null;
}

function firstValue(oObject) {
	if (Is.Object(oObject)) {
		for (var i in oObject)
			return oObject[i];
		return null;
	}
	else
		return null;
}

function shiftObject(oObject) {
	if (Is.Object(oObject)) {
		for (var i in oObject) {
			var result = oObject[i];
			delete oObject[i];
			return result;
		}
		return null;
	}
	else
		return null;
}

function isFormEmpty(aValues) {
	for (var i in aValues) {
		if (Is.Object(aValues[i])) {
			if (!isFormEmpty(aValues[i])) return false;
		}
		else
		if (aValues[i] != '') return false;
	}
	return true;
}

function translateFolder(sFolder) {
	switch(sFolder){
	case 'INBOX':
		return getLang('COMMON_FOLDERS::INBOX');
	case '__@@VIRTUAL@@__':
		return getLang('COMMON_FOLDERS::VIRTUAL-FOLDERS');
	default:
		return sFolder;
	}
}


////////////////////////////////////////////////////
//                 COLOE TOOLS
////////////////////////////////////////////////////

/**
 * @brief: color conversions etc...
 * @note : adopted from http://www.easyrgb.com/math.html
 * @date : 19.9.2006 10:38:52
 **/

_me = cColors.prototype;
function cColors(){
	this.hexchars = "0123456789ABCDEF";
};

//Used for Tags
_me.fast_contrast = function (hexcolor, dark, light) {
	return ((hex2dec(hexcolor.substr(1,2)) + hex2dec(hexcolor.substr(3,2)) + hex2dec(hexcolor.substr(5,2)))/3) > 128 ? (dark || '#000000') : (light || '#FFFFFF');
};

_me.rgb2hsv = function(r,g,b){

	var R = r/255;                     //RGB values = 0 Ă· 255
	var G = g/255;
	var B = b/255;

	var iMin = Math.min(R, G, B);    //Min. value of RGB
	var iMax = Math.max(R, G, B);    //Max. value of RGB
	var dMax = iMax - iMin;          //Delta RGB value

	var H,S,V = iMax;

	//This is a gray, no chroma... HSV results = 0 Ă· 1
	if (dMax == 0){
		H = 0;
		S = 0;
	}
    //Chromatic data...
	else{
		S = dMax/iMax;

		var dR = (((iMax - R) / 6) + (dMax/2)) / dMax;
		var dG = (((iMax - G) / 6) + (dMax/2)) / dMax;
		var dB = (((iMax - B) / 6) + (dMax/2)) / dMax;

		if (R == iMax) H = dB - dG;
		else
		if (G == iMax) H = (1/3) + dR - dB;
		else
		if (B == iMax) H = (2/3) + dG - dR;

		if (H < 0) H += 1;
		if (H > 1) H -= 1;
	}

	return [H*255,S*255,V*255];
};

_me.rgb2hsl = function(r,g,b){
	var R = r / 255;                 //Where RGB values = 0 Ă· 255
	var G = g / 255;
	var B = b / 255;

	var iMin = Math.min(R, G, B);    //Min. value of RGB
	var iMax = Math.max(R, G, B);    //Max. value of RGB
	var dMax = iMax - iMin;			 //Delta RGB value

	var H,S,L = (iMax + iMin)/2;

	if (dMax == 0){                  //This is a gray, no chroma...
		H = 0;                       //HSL results = 0 Ă· 1
		S = 0;
	}
	else{                            //Chromatic data...
		if (L < 0.5)
			S = dMax / (iMax + iMin);
		else
			S = dMax / (2 - iMax - iMin);

		var dR = ( ( ( iMax - R ) / 6 ) + ( dMax / 2 ) ) / dMax;
		var dG = ( ( ( iMax - G ) / 6 ) + ( dMax / 2 ) ) / dMax;
		var dB = ( ( ( iMax - B ) / 6 ) + ( dMax / 2 ) ) / dMax;

		if (R == iMax )
			H = dB - dG;
		else
		if (G == iMax)
			H = ( 1 / 3 ) + dR - dB;
		else
		if (B == iMax)
			H = ( 2 / 3 ) + dG - dR;

		if (H < 0) H += 1;
		if (H > 1) H -= 1;
	}
	return [Math.ceil(H*255),Math.ceil(S*255),Math.ceil(L*255)];
};

_me.isValidRGB = function(aRGB){
	if ((!aRGB[0] && aRGB[0] !=0) || isNaN(aRGB[0]) || aRGB[0] < 0 || aRGB[0] > 255 ||
		(!aRGB[1] && aRGB[1] !=0) || isNaN(aRGB[1]) || aRGB[1] < 0 || aRGB[1] > 255 ||
		(!aRGB[2] && aRGB[2] !=0) || isNaN(aRGB[2]) || aRGB[2] < 0 || aRGB[2] > 255) return false;

	return true;
};

_me.hex2rgb = function(str) {
	str = str.replace('#','');
	return	[
			(this.toDec(str.substr(0, 1)) * 16) + this.toDec(str.substr(1, 1)),
			(this.toDec(str.substr(2, 1)) * 16) + this.toDec(str.substr(3, 1)),
			(this.toDec(str.substr(4, 1)) * 16) + this.toDec(str.substr(5, 1))
			];

	return rgb;
};

_me.toDec = function(hexchar) {
	return this.hexchars.indexOf(hexchar.toUpperCase());
};

_me.rgb2hex = function(r,g,b) {
	return this.toHex(r) + this.toHex(g) + this.toHex(b);
};

_me.toHex = function(n) {
	n = n || 0;
	n = parseInt(n, 10);
	if (isNaN(n)) n = 0;
	n = Math.round(Math.min(Math.max(0, n), 255));

	return this.hexchars.charAt((n - n % 16) / 16) + this.hexchars.charAt(n % 16);
};
colors = new cColors();

function getActualEventTime() {
	var now = new Date();
	var julian = now.getJulianDate();
	var time = now.getHours()*60 + now.getMinutes();
	time -= time%30;

	return {
		'EVNSTARTDATE': julian,
		'EVNSTARTTIME': time,
		'EVNENDDATE': julian,
		'EVNENDTIME': time+30
	};
};

function arrToString(arr){
	if (arr === null)
		return 'null';

	var tmp;

	switch(typeof arr){
		case 'string':             //este CRLF
			return "'" + arr.replace(/\'/g,"\\'") + "'";

		case 'number':
			return arr;

		case 'object':

            var aResult = [],bEnd = false;

			if (Is.Array(arr)){
                aResult.push('[');
				for (var i = 0; i<arr.length;i++){

                    if ((tmp = arrToString(arr[i]))!==false){
                      //  tmp = arrToString(arr[i]);
                        
						if (bEnd)
							aResult.push(',');

						aResult.push(tmp);
						bEnd = true;
					}
                }
                aResult.push(']');
			}
			else{

				aResult.push('{');

				for(var i in arr) {
                    if ((tmp = arrToString(arr[i]))!==false){
                      //  tmp = arrToString(arr[i]);
                        
						if (bEnd)
							aResult.push(',');

						aResult.push("'" + i + "'", ':', tmp);
						bEnd = true;
					}
				}
				aResult.push('}');
			}

			return aResult.join('');

		case 'undefined':
		    return false;
	}
};

function valuesToString(arr){
	var sResult = '';

	for(var n in arr)
		sResult += arr[n] + '|';

	return sResult.substr(0,sResult.length-1);
};

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                       Class MailAddress
////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @class	MailAddress
 * @date    26.4.2012 11:29:10
 */
var MailAddress = {
	//Create Email address
	createEmail:function(name,email){
		var out = '';
		if (name){
			name = name.replace(/([\"\\])/g,'\\$1').trim();
			out = (
				name.indexOf(' ')>-1 ||
				name.indexOf('\\')>-1 ||
				name.indexOf(',')>-1 ||
				name.indexOf(';')>-1 ||
				name.indexOf('@')>-1 ||
				name.indexOf('<')>-1?'"'+name+'"':name);
		}

		if (email){
			if (out) out += ' ';
			out += '<'+ email.toLowerCase() +'>';
		}

		return out;
	},
	appendEmail:function(sIn, email){

		if (email){

			if (!sIn)
				return email;

			var aMail = splitEmailsAndNames(email),
				aTmp = splitEmailsAndNames(sIn);

			if ((aMail = aMail[0]) && aMail.email){
				for(var i = aTmp.length-1;i>-1;i--)
					if (aTmp[i].email == aMail.email)
						return sIn;
				
				aTmp.push(aMail);

				for(var aOut = [],i = 0; i<aMail.length;i++){
					aOut.push(createEmail(aMail[i].name,aMail[i].email));
				}
				
				return aOut.join(', ');
			}
		}

		return sIn;			
	},
	//Split Emails into Array
	splitEmails:function(sIn){
		var aOut = [],
			sChar,
			sTemp = '',
			f = {block:false, block2:false, slash:false};

		if (Is.String(sIn)){
			for(var i = 0;i<sIn.length;i++){
				sChar = sIn.charAt(i);

				switch(sChar){
				case ',':
				case ';':
					if (!f.block && !f.block2 && !f.slash){
						if ((sTemp = sTemp.trim()).length){
							aOut.push(sTemp);
							sTemp = '';
						}

						continue;
					}

					break;

				case '"':
					if (!f.slash)
						if (sTemp == '' || f.block)	//Edit 21.9. ab <a"b@ab.com>, ab <email2>';
							f.block = !f.block;

					break;

				case '[':
					if (!f.block && !f.slash)
						f.block2 = true;

					break;

				case ']':
					if (f.block2 && !f.slash)
						f.block2 = false;

					break;

				case '\\':
					if (!f.slash){
						f.slash = true;
						sTemp += sChar;
						continue;
					}
				
				//ltrim
				case ' ':
					if (sTemp == '')
						continue;	
				}

				sTemp += sChar;
				f.slash = false;
			}

			if ((sTemp = sTemp.trim()).length)
				aOut.push(sTemp);
		}

		return aOut;
	},
	//Split Emails and Names into Array
	splitEmailsAndNames:function(sIn){
		var aOut = [],
			aMails = MailAddress.splitEmails(sIn),
			aUniq = {};

		for (var i = 0;i<aMails.length;i++){
			//do parsing
			if (aMails[i].charAt(aMails[i].length-1) == '>'){

				var sTemp = '',
					sEmail,
					sChar,
					f = {block:false, slash:false};

				for(var j = 0, k = aMails[i].length;j<k;j++){
					sChar = aMails[i].charAt(j);

					switch(sChar){
					case '<':
						if (!f.block && !f.slash){
							sTemp = sTemp.trim();
							sEmail = aMails[i].substring(j+1,k-1).trim();

							if (sEmail && !aUniq[sEmail]){
								aUniq[sEmail] = true;

								aOut.push({
									name:sTemp,
									email:sEmail
								});
							}

							//end automat
							j = k;
							continue;
						}

						break;

					case '"':
						if (!f.slash){
							if (sTemp == '' || f.block){ //Edit 21.9. " only on the begining
								f.block = !f.block;
								continue;
							}	
						}
						break;

					case '\\':
						if (!f.slash){
							f.slash = true;
							continue;
						}
					}

					sTemp += sChar;
					f.slash = false;
				}

			}
			//its email
			else
			if (!aUniq[aMails[i]]){
				aUniq[aMails[i]] = true;
				aOut.push({name:'',email:aMails[i]});
			}
		}

		return aOut;
	},
	//Use instead of name_list
	splitNames:function(sIn){
		var aMails = MailAddress.splitEmailsAndNames(sIn),
			aOut = [];

		for(var i = 0; i<aMails.length;i++)
			aOut.push(aMails[i].name || aMails[i].email);

		return aOut.join(', ');
	},
	//Distribution Lists
	findDistribList:function(aType)
	{
		var aEmails,sEmail,sDistribList,aDistribList,sAccId,sFolId,aName,sName;
		var aResult = {};
		var aDistrib = {};

		//Procházíme jednotlivé typy
		for(var sType in aType)
		{
			aResult[sType] = '';

			if (!aType[sType])
				continue;

			aEmails = MailAddress.splitEmails(aType[sType])

			//Procházíme jednotlivé emaily
			for(var n in aEmails)
			{
				sEmail = aEmails[n];

				//Nasli jsme distribuční seznam?
				if (sEmail.charAt(0) == '[' && sEmail.charAt(sEmail.length-1) == ']')
				{
					sDistribList = sEmail.substr(1,sEmail.length-2);
					aDistribList = sDistribList.split('::');

					sAccId = '';
					sFolId = '';
					aName = [];

					//Identifikace moľného distribučního seznamu
					switch(aDistribList.length <= 3 ? aDistribList.length : 3)
					{
						case 3:
							sAccId = aDistribList.shift();

						case 2:
						sFolId = aDistribList.shift();

						case 1:
							for(var m in aDistribList)
								aName.push(aDistribList[m]);

							sName = aName.join('::');
					}
					//Není-li zadán account, bereme primární
					if (!sAccId)
						sAccId = sPrimaryAccount;

					//Není-li zadán folder, bereme __@@ADDRESSBOOK@@__
					if (!sFolId)
						sFolId = "__@@ADDRESSBOOK@@__";//Mapping.getDefaultFolderForGWType('C');

					//Naplnění distribučního seznamu
					if (!aDistrib[sAccId])
						aDistrib[sAccId] = {};

					if (!aDistrib[sAccId][sFolId])
						aDistrib[sAccId][sFolId] = {'to':[],'cc':[],'bcc':[]};

					aDistrib[sAccId][sFolId][sType].push(sName);
				}
				else
				aResult[sType] += sEmail + ',';
			}
			aResult[sType] = aResult[sType].substr(0,aResult[sType].length-1);
		}
		aResult['distrib'] = aDistrib;

		return aResult;
	}
};

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                       Class Path
////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @class	Path
 */
function Path() {}

/**
 * @brief   Split forder path into account path and folderID.
 * This function is used with function which operate with AccountID and FolderID,
 * e.g. item.copy(), item.move() etc.
 *
 * @param[in]  sFolderPath [string] Full folder name, e.g. 'admin@merakdemo.com/INBOX'.
 * @return aOut  [object]
 *    - [0]  Contains account id, e.g. 'admin@merakdemo.com'.
 *    - [1]   Contains folder id, e.g. 'INBOX'. When only account is
 *    specified, empty string is returned in this item.
 *
 * Example:
 *    - Path.split(false) => ['', '']
 *    - Path.split('admin@merakdemon.com/INBOX') == ['admin@merakdemon.com', 'INBOX']
 *    - Path.split('admin@merakdemon.com') == ['admin@merakdemon.com', '']
 */
Path.split = function(sFolderPath) {
	if (Is.String(sFolderPath)){
		var tmp = sFolderPath.split('/');
		return [tmp.shift(), tmp.join('/')];
	}
	else
		return ['',''];

	return aRet;
};

/**
 * @brief   Returns filename component of path.
 * Given string containing a path to a file, this function will return the base name of the file.
 * @param[in]	sPath	[string]	String containing a path to a file.
 * @return	[string]    Filename component of path.
 *
 * Example: Path.basename('/home/httpd/html/index.php') == 'index.php'
 */
Path.basename = function(sPath) {
	if (!Is.String(sPath)) return false;
	return sPath.split('/').pop();
};

Path.basedir = function (sPath){
	if (!Is.String(sPath)) return '';
    var tmp = sPath.split('/');
		tmp.pop();

	return tmp.join('/');
};

Path.extension = function(sFile){
	return sFile&&sFile.indexOf('.')!=-1?sFile.split('.').pop().toLowerCase():'';
};
////////////////////////////////////////////////////////////////////////////////////////////////////
//                                       Class Mapping
////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @class	Mapping
 */
function Mapping() {}

/**
 * @brief   Get default folder for GW item depending on its type.
 * @param[in]   sType   [string]    One character type, e.g. 'C' or 'T'.
 * @return  [string]    Default folder, e.g. 'Contacts'. This mapping is used:
 *  - 'C' => 'Contacts'
 *  - 'E' => 'Events'
 *  - 'J' => 'Journal'
 *  - 'N' => 'Notes'
 *  - 'T' => 'Tasks'
 *  - 'F' => 'Files'
 */
Mapping.getDefaultFolderForGWType = function(sType) {
	var sName = '';
	switch (sType) {
		case 'C':
		case 'L': sName = 'contacts'; break;
		case 'E': sName = 'events'; break;
		case 'J': sName = 'journal'; break;
		case 'N': sName = 'notes'; break;
		case 'T': sName = 'tasks'; break;
		case 'F': sName = 'files'; break;
		default: throw new Error('Not implemented'); return false;
	}
	
	return Path.split(GWOthers.getItem('DEFAULT_FOLDERS',sName))[1];
};

/**
 * @brief   Get form name depending on GW type.
 * @param[in]   sType   [string]    One character type, e.g. 'C' or 'T'.
 * @return  [string]    Default folder, e.g. 'frm_contact' or 'frm_event'.
 */
Mapping.getFormNameByGWType = function(sType) {
	switch (sType) {
		case 'C': return 'frm_contact';
		case 'E': return 'frm_event';
		case 'N': return 'frm_note';
		case 'T': return 'frm_task';
		case 'J': return 'frm_journal';
		case 'L': return 'frm_distrib';
		case 'F': return 'frm_file';
		default: throw new Error('Not implemented');return false;
	}
};

function toString(o) {
	return (o == undefined || o == null) ? '' : o.toString();
};

function makeIDFromIDS(ids, j) {
	try{
		return [ids[0], ids[1], ids[2][j]];
	}
	catch(r){
		return;
	}
};

function makeIDSFromID(id) {
	return [id[0], id[1], [id[2]]];
};

function getPathFromDataset(sDataset) {
	var items = dataSet.get(sDataset);
	for (var sAccId in items)
		for (var sFolId in items[sAccId])
			return [sAccId, sFolId];
};

/**
 * get browser
 * Edit: 13.6.2008 12:15:57
 **/
window.currentBrowser = function (){
	var out = '',
	    v = '',
		str = navigator.userAgent.toUpperCase();

    if (str.indexOf('CHROME')>-1)
        out = 'Chrome';
	else
	if (str.indexOf('WEBKIT')>-1){
		out = 'Safari';

		// 525 = 3.x
		// 528 = 4.x
		v = parseInt(str.substr(str.indexOf('SAFARI/')+7),10);
	}
	else
	if (str.indexOf('KHTML')>-1)
		out = 'KHTML';
	else
	if (str.indexOf('OPERA')>-1)
		out = 'Opera';
	else
	if (str.indexOf('MSIE 9')>-1){
		if (document.documentMode && document.documentMode<9)
			out = 'MSIE7';
		else
			out = 'MSIE9';
	}
	else
	if (str.indexOf('MSIE 10')>-1)
		out = 'MSIE9';
	else
	if (str.indexOf('MSIE 7')>-1)
		out = 'MSIE7';
	else
	if (str.indexOf('MSIE 8')>-1){
		out = 'MSIE7';
		v = 8;
	}
	else
	if (str.indexOf('MSIE 6.0')>-1)
		out = 'MSIE6';
	else
	if (str.indexOf('TRIDENT/')>-1)
		out = 'MSIE11';
	else
	if (str.indexOf('GECKO')>-1){
		out = 'Mozilla';
		v = parseInt(str.substr(str.indexOf('GECKO/')+6),10);
	}

	return function(bV){
		return bV?v:out;
	}
}();

function IsBrowserPluginInstalled(a) {
	return navigator.mimeTypes && navigator.mimeTypes[a] && navigator.mimeTypes[a].enabledPlugin;
};

/*
 *	Helper API to more easily access application data
 *	retrieved from server for using in client
 */

var IWAPI = {};

/*
 *	Attributes
 *
 *	Functionality for handling xml style attributes
 *
 *	Used to extend xml functionality for Value, List and Collection
 *	
 *	Instatiate:
 *		Used only as extention to Value, List and Collection, handled by those object
 *	Methods:
 *		setAttribute(name,value)		- set attribute name and value as strings
 *		getAttribute(name)				- fetch attribute with that name
 *		removeAttribute(name)			- remove the attribute
 *		setAttributes({name: value,...})- set multiple attributes with values at one time
 */
IWAPI.Attributes = function() {}
IWAPI.Attributes.prototype.setAttribute = function(name,value) {
	var o = {};
	o[name] = value;
	return this.setAttributes(o);
}
IWAPI.Attributes.prototype.getAttribute = function(name) {
	if('attributeSet' in this) {
		return this.attributeSet[name];
	} else {
		return null;
	}
}
IWAPI.Attributes.prototype.removeAttribute = function(name) {
	if('attributeSet' in this) {
		return this.attributeSet.removeItem(name);
	} else {
		return false;
	}
}
IWAPI.Attributes.prototype.setAttributes = function(valuepairs) {
	if(!('attributeSet' in this)) {
		Object.defineProperty(this,"attributeSet",{
			enumerable: false,
			writable: false,
			configurable: false,
			value: new IWAPI.Set()
		});
	}
	return this.attributeSet.addItems(valuepairs);
}
/*
 *	XML Options for serialization
 * 
 *	Send as argument to toXMLString to customise serialisation
 */
 
IWAPI.XmlOptions = function(format,onlychanges,reset) {
	// Format the xml with tabs and newlines
	Object.defineProperty(this,"format",{
		enumerable: false,
		writable: true,
		configurable: false,
		value: format || false
	});
	// Serialize only changed values
	Object.defineProperty(this,"changes",{
		enumerable: false,
		writable: true,
		configurable: false,
		value: onlychanges || false
	});
	// A reset alternative  if implemented by inheriting objects
	Object.defineProperty(this,"reset",{
		enumerable: false,
		writable: true,
		configurable: false,
		value: reset || false
	});
}

/*
 *	Value
 *
 *	Container for values
 *
 *	Keeps value data associated with it's label
 *	Allows for comparing with inital value
 *	
 *	Instatiate:
 *		new IWAPI.Value(value [,name])
 *	Methods:
 *		changeValue(value)	- change the primitive value of the item
 *		hasChanged()		- indicates if the value has changed since created
 *	Properties:
 *		label				- readonly name of the value item
 */
IWAPI.Value = function(v,label) {
	// Public properties for easy debugging (never change directly!)
	this.initialValue = v;
	this.currentValue = v;

	// Private properties
	var readonly = false;

	// Add label if supplied
	if(label) {
		Object.defineProperty(this,"label",{
			enumerable: true,
			writable: false,
			configurable: false,
			value: label
		});
	}

	// The primitive value can be accessed from value property
	Object.defineProperty(this,"value",{
		get: function() {
			return this.currentValue;
		},
		set: function(v) {
			if(!this.readonly) {
				//@todo: implement onchange event trigger (if hasChanged)
				this.currentValue = v;
				if(v !== void 0) {
					this.propertyClass = 'TPropertyString';
				} else {
					this.propertyClass = 'TPropertyNoValue';
				}
			} else {
				console.warn("Attempt to change a readonly value of "+this.label);
			}
		},
		enumerable: false,
		configurable: false
	});

	// Allow to set the persistency of a value
	Object.defineProperty(this,"persist",{
		get: function() {
			return this.persistent;
		},
		set: function(v) {
			this.persistent = v;
		},
		enumerable: false,
		configurable: false
	});

	// Handle default values
	Object.defineProperty(this,"default",{
		get: function() {
			return this.defaultValue;
		},
		set: function(v) {
			this.defaultValue = v;
		},
		enumerable: false,
		configurable: false
	});

	// Handle readonly state
	Object.defineProperty(this,"readonly",{
		get: function() {
			return readonly;
		},
		set: function(v) {
			readonly = v;
		},
		enumerable: false,
		configurable: false
	});
	// To be consistent with lists and collection, readonly can be read or changed also with function
	Object.defineProperty(this,'readOnly',{
		enumerable: false,
		writable: false,
		value: function(immutable) {
			if(typeof immutable == 'boolean') {
				readonly = immutable;
			} else {
				return readonly;
			}
		}
	});

}

IWAPI.Value.prototype.hasChanged = function() {
	return this.currentValue!=this.initialValue;
}
IWAPI.Value.prototype.commitChanges = function() {
	this.initialValue = this.currentValue;
}
IWAPI.Value.prototype.revertChanges = function() {
	this.currentValue = this.initialValue;
}

IWAPI.Value.prototype.toString = function() {
	if(this.currentValue==undefined) {
		return '';
	} else {
		return this.currentValue;
	}
}
IWAPI.Value.prototype.toXMLString = function(options,depth) {
	options = options || new IWAPI.XmlOptions();
	if(options.changes && !this.persistent && !this.hasChanged()) {
		return '';
	}

	var s = (options.format?depth||"":"") + '<'+this.label;
	var a = [];
	if(this.attributeSet) {
		for(var attr in this.attributeSet) {
			a.push(attr+'="'+this.attributeSet[attr].toString().escapeXML(true)+'"');
		}
	}
	if(this.currentValue==undefined || this.currentValue===null) {
		return s + (a.length?' '+a.join(' '):'') + '/>' + (options.format?"\n":"");
	} else {
		return s + (a.length?' '+a.join(' '):'') + '>'+this.currentValue.toString().escapeXML()+'</'+this.label+'>' + (options.format?"\n":"");
	}
}

// Add attribute functionality for xml 
IWAPI.Value.prototype.setAttribute = IWAPI.Attributes.prototype.setAttribute;
IWAPI.Value.prototype.getAttribute = IWAPI.Attributes.prototype.getAttribute;
IWAPI.Value.prototype.removeAttribute = IWAPI.Attributes.prototype.removeAttribute;
IWAPI.Value.prototype.setAttributes = IWAPI.Attributes.prototype.setAttributes;

// Container for storing persistent values
IWAPI.PersistentValue = function(v, label) {
	this.persistent = true;

	// Call super constructor
	IWAPI.Value.apply(this,arguments);

}
// Inherit from Value
IWAPI.PersistentValue.prototype = Object.create(IWAPI.Value.prototype);

/*
 *	Collection
 *
 *	Use to store unordered items in as a collection
 *
 *	Collections does not allow multiple items with the same identifier
 *	Values are retrieved using normal dot notation, eg collection.name=='value'
 *	Names and values can also be retrieved by iterating with for..in loops
 *	
 *	Instatiate:
 *		new IWAPI.Collection('name')
 *	Methods:
 *		addItem(name,value) - name is a identifier for the item, value is either a primitve value or a collection/list
 *		removeItem(name)	- removes the item with the identifier from the collection
 *		countItems()		- returns the current number of items
 *	Properties:
 *		collectionLabel		- readonly name of the collection
 */
IWAPI.Collection = function(name) {
	Object.defineProperty(this,"collectionLabel",{
		enumerable: false,
		writable: false,
		configurable: false,
		value: name
	});
};
Object.defineProperty(IWAPI.Collection.prototype,'addItem',{
	enumerable: false,
	writable: false,
	value: function(content,label){
		if(content instanceof IWAPI.Value || content instanceof IWAPI.List || content instanceof IWAPI.Collection) {
			label = label || content.label || content.listLabel || content.collectionLabel;
		} else if(typeof content=="string") {
			// Note incoming values are swapped
			content = new IWAPI.Value(label,content);
			label = content.label;
		} else {
			console.warn("Collection items must have a label",label);
		}
		// Not allowed to overwrite existent property
		if(!label || label in this) {
			return false;
		}

		Object.defineProperty(this, label, {
			writable: false,
			value: content,
			enumerable: true,
			configurable: true
		});

		return true;
	}
});
Object.defineProperty(IWAPI.Collection.prototype,'removeItem',{
	enumerable: false,
	writable: false,
	value: function(name) {
		delete this[name];
	}
});
Object.defineProperty(IWAPI.Collection.prototype,'countItems',{
	enumerable: false,
	writable: false,
	value: function() {
		return Object.keys(this).length;
	}
});

// Check or change readonly state of members, setting changes all members, checking returns true if collection contains any readonly values
Object.defineProperty(IWAPI.Collection.prototype,"readOnly",{
	enumerable: false,
	writable: false,
	value: function(immutable) {
		if(typeof immutable == 'boolean') {
			for(var i in this) {
				this[i].readOnly(immutable);
			}
		} else {
			for(var i in this) {
				if(this[i].readOnly()) {
					return true;
				}
			}
			return false;
		}
	}
});

Object.defineProperty(IWAPI.Collection.prototype,'hasChanged',{
	enumerable: false,
	writable: false,
	value: function() {
		for(var i in this) {
			if(this[i].hasChanged()) {
				return true;
			}
		}
		return false;
	}
});
Object.defineProperty(IWAPI.Collection.prototype,'commitChanges',{
	enumerable: false,
	writable: false,
	value: function() {
		for(var i in this) {
			this[i].commitChanges();
		}
	}
});
Object.defineProperty(IWAPI.Collection.prototype,'revertChanges',{
	enumerable: false,
	writable: false,
	value: function() {
		for(var i in this) {
			this[i].revertChanges();
		}
	}
});

Object.defineProperty(IWAPI.Collection.prototype,'toString',{
	enumerable: false,
	writable: false,
	value: function() {
		return Object.keys(this).join();
	}
});
Object.defineProperty(IWAPI.Collection.prototype,'toXMLString',{
	enumerable: false,
	writable: false,
	value: function(options,depth) {
		options = options || new IWAPI.XmlOptions();
		var a = [];
		if(this.attributeSet) {
			for(var attr in this.attributeSet) {
				a.push(attr+'="'+this.attributeSet[attr].toString().escapeXML(true)+'"');
			}
		}
		a = a.length ? ' '+a.join(' ') : '';
		if(this.countItems()==0) {
			return (options.format?depth:"") + '<'+this.collectionLabel+a+'/>' + (options.format?"\n":"");
		} else {
			var content = [];
			depth = depth || "";
			var d = depth;
			depth += "\t";
			for(var i in this) {
				if(this[i].toXMLString) {
					content.push(this[i].toXMLString(options,depth));
				}
			}
			return (options.format?d:"")+'<'+this.collectionLabel+a+'>'+(options.format?"\n":"")+content.join('')+(options.format?d:"")+'</'+this.collectionLabel+'>'+(options.format?"\n":"");
		}
	}
});
// Extend Collection with attribute functionality
Object.defineProperties(IWAPI.Collection.prototype,{
	setAttribute: {
		value: IWAPI.Attributes.prototype.setAttribute
	},
	getAttribute: {
		value: IWAPI.Attributes.prototype.getAttribute
	},
	removeAttribute: {
		value: IWAPI.Attributes.prototype.removeAttribute
	},
	setAttributes: {
		value: IWAPI.Attributes.prototype.setAttributes
	}
});

/*
 *	List
 *
 *	Use to store ordered items in as a list
 *
 *	Values are retrieved using array notation, eg list[n]=='value'
 *	Use when order is needed or labals are not unique
 *	
 *	Instatiate:
 *		new IWAPI.List('name')
 *	Methods:
 *		addItem(name,value) - name is a non-unique label for the item, value is either a primitve value or a collection/list
 *		removeItem(n)		- removes the item based on the index from the list 
 *		countItems()		- returns the current number of items in the list
 *		getItem(name)		- returns the first found item with the label name
 *		getItems(name)		- returns all items with the name as an Array
 *	Properties:
 *		listLabel			- readonly name of the list
 */

IWAPI.List = function(name) {

	Array.apply(this,arguments);

	Object.defineProperty(this,"listLabel",{
		enumerable: false,
		writable: false,
		configurable: false,
		value: name
	});

};
// List inherits from Array
IWAPI.List.prototype = Object.create(Array.prototype);

IWAPI.List.prototype.addItem = function(item,v){
	if(item instanceof IWAPI.List || item instanceof IWAPI.Collection || item instanceof IWAPI.Value) {
		this.push(item);
	} else {
		item = new IWAPI.Value(v,item);
		this.push(item);
	}
	return item;
}
IWAPI.List.prototype.removeItem = function(name){
	var i = this.length;
	while(i--) {
		if(
			this[i].label && this[i].label==name ||
			this[i].listLabel && this[i].listLabel==name ||
			this[i].collectionLabel && this[i].collectionLabel==name
		) {
			this.splice(i,1);
			break;
		}
	}
}
IWAPI.List.prototype.getItem = function(name){
	var i = this.length;
	while(i--) {
		if(
			this[i].label && this[i].label==name ||
			this[i].listLabel && this[i].listLabel==name ||
			this[i].collectionLabel && this[i].collectionLabel==name
		) {
			return this[i];
		}
	}
}
IWAPI.List.prototype.getItems = function(name){
	var i = this.length;
	var content = [];
	while(i--) {
		if(
			this[i].label && this[i].label==name ||
			this[i].listLabel && this[i].listLabel==name ||
			this[i].collectionLabel && this[i].collectionLabel==name
		) {
			content.push(this[i]);
		}
	}
	return content;
}

// Check or change readonly state of members, setting changes all members, checking returns true if list contains any readonly values
IWAPI.List.prototype.readOnly = function(immutable){
	var i = this.length;
	if(typeof immutable == 'boolean') {
		while(i--) {
			this[i].readOnly(immutable);
		}
		return false;
	} else {
		while(i--) {
			if(this[i].readOnly()) {
				return true;
			}
		}
		return false;
	}
}


IWAPI.List.prototype.hasChanged = function(){
	var i = this.length;
	while(i--) {
		if(this[i].hasChanged()) {
			return true;
		}
	}
	return false;
}
IWAPI.List.prototype.commitChanges = function(){
	var i = this.length;
	while(i--) {
		this[i].commitChanges();
	}
}
IWAPI.List.prototype.revertChanges = function(){
	var i = this.length;
	while(i--) {
		this[i].revertChanges();
	}
}

// Add attribute functionality for xml 
IWAPI.List.prototype.setAttribute = IWAPI.Attributes.prototype.setAttribute;
IWAPI.List.prototype.getAttribute = IWAPI.Attributes.prototype.getAttribute;
IWAPI.List.prototype.removeAttribute = IWAPI.Attributes.prototype.removeAttribute;
IWAPI.List.prototype.setAttributes = IWAPI.Attributes.prototype.setAttributes;

IWAPI.List.prototype.toXMLString = function(options,depth) {
	options = options || new IWAPI.XmlOptions();
	var a = [];
	if(this.attributeSet) {
		for(var attr in this.attributeSet) {
			a.push(attr+'="'+this.attributeSet[attr].toString().escapeXML(true)+'"');
		}
	}
	a = a.length ? ' '+a.join(' ') : '';
	if(this.length==0) {
		return (options.format?depth:"") + '<'+this.listLabel+a+'/>' + (options.format?"\n":"");
	} else {
		var content = [];
		depth = depth || "";
		var d = depth;
		depth += "\t";
		for(var i in this) {
			if(this[i].toXMLString) {
				content.push(this[i].toXMLString(options,depth));
			}
		}
		return (options.format?d:"")+'<'+this.listLabel+a+'>'+(options.format?"\n":"")+content.join('')+(options.format?d:"")+'</'+this.listLabel+'>'+(options.format?"\n":"");
	}
}
/*
 *	Set
 *
 *	Use to store labled values as a unordered set
 *
 *	Values are retrieved using array notation, eg list[n]=='value'
 *	
 *	Instatiate:
 *		new IWAPI.Set('name')
 *	Methods:
 *		addItems({name: value, ...}) - name is a unique label for each the item
 *		removeItem(name)		- removes the item based with the name from the set
 *		countItems()		- returns the current number of items the set
 *	Properties:
 *		setLabel			- readonly name of the list
 */

IWAPI.Set = function(name) {
	if(name) {
		Object.defineProperty(this,"setLabel",{
			enumerable: false,
			writable: false,
			configurable: false,
			value: name
		});
	}
};
IWAPI.Set.prototype = Object.create(null,{
	constructor: IWAPI.Set,
	addItem: {
		value: function(item) {
			this.addItems(item);
		}
	},
	addItems: {
		value: function(items) {
			for(var label in items) {
				this[label] = items[label];
			}
		}
	},
	removeItem: {
		value: function(label) {
			if(label in this) {
				delete this[label];
				return true;
			} else {
				return false;
			}
		}
	}

});


IWAPI.Item = function(items,label) {
	label = label || 'item';
	var c = new IWAPI.Collection(label);
	for(var i in items) {
		c.addItem(i,items[i]);
	}
	return c;
}
