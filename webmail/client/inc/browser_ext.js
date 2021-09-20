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

//Mouse Event
if (event.initMouseEvent) {     // all browsers except IE before version 9
    var clickEvent = document.createEvent ("MouseEvent");
    clickEvent.initMouseEvent ("click", true, true, window, 0,
                                event.screenX, event.screenY, event.clientX, event.clientY,
                                event.ctrlKey, event.altKey, event.shiftKey, event.metaKey,
                                0, null);
    event.target.dispatchEvent (clickEvent);
} else {
    if (document.createEventObject) {   // IE before version 9
        var clickEvent = document.createEventObject (window.event);
        clickEvent.button = 1;  // left click
        event.srcElement.fireEvent ("onclick", clickEvent);
    }
}

//CUSTOM EVENT

Modern way
function dispatchCustomEvent(doc) {
  var eventDetail = {foo: 'bar', __exposedProps__ : { foo : "r"}};
  var myEvent = doc.defaultView.CustomEvent("mytype", eventDetail);
  doc.dispatchEvent(myEvent);
}

  var event; // The custom event that will be created
  if (document.createEvent) {
    event = document.createEvent("HTMLEvents");
    event.initEvent("dataavailable", true, true);
  } else {
    event = document.createEventObject();
    event.eventType = "dataavailable";
  }

  event.eventName = "dataavailable";

  if (document.createEvent) {
    element.dispatchEvent(event);
  } else {
    element.fireEvent("on" + event.eventType, event);
  }

*/
function browserEvent(event) {
	if (('on' + event) in window || event.replace(/end|start|update$/, '') in document.body.style) {
		return event;
	}
	if (('onwebkit' + event) in window) {
		return 'webkit' + this.capitalize(event[0]).replace(/(end|start|update)$/, this.capitalize);
	}
	return false;
}

/* MSIE9-10 height fix */
function msiebox (elm){
	if (currentBrowser() == 'MSIE9'){
		elm.onresize = function(e){
			var elm = this.firstElementChild;
			if (elm && this.clientHeight != elm.offsetHeight)
				elm.style.height = this.clientHeight + 'px';
		};
	}
};

function toClipboard(v, notification_type){
	var inp = mkElement('textarea', {value:v, style:'width: 1px; height: 1px; position: absolute; top: -100%; left: -100%'});
	document.body.appendChild(inp);
	inp.select();

	if (document.queryCommandSupported('copy') && document.queryCommandEnabled('copy') && document.execCommand('copy')) {
		gui.notifier && gui.notifier._value({type: 'success', args: { text_plain: getLang('notification::' + (notification_type || 'clipboard_link')) }});

		setTimeout(function() {
			if (inp.parentNode)
				inp.parentNode.removeChild(inp);
		}, 220);

		return true;
	}

	gui.notifier && gui.notifier._value({type: 'alert', args: {header: '', text: 'ERROR::CLIPBOARD'}});
	return false;
}
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
				while(elm!=document);
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
				while(elm!=document);
				return false;
			}
		},
		true
	);
};

var supportsPassive = false;
try {
	var opts = Object.defineProperty({}, 'passive', {
		get: function () {
			supportsPassive = true;
		}
	});
	window.addEventListener("test", null, opts);
} catch (e) {
}

//Object.assign IE11 polyfill
if (typeof Object.assign != 'function') {
	// Must be writable: true, enumerable: false, configurable: true
	Object.defineProperty(Object, "assign", {
		value: function assign(target, varArgs) { // .length of function is 2
			'use strict';
			if (target == null) { // TypeError if undefined or null
				throw new TypeError('Cannot convert undefined or null to object');
			}

			var to = Object(target);

			for (var index = 1; index < arguments.length; index++) {
				var nextSource = arguments[index];

				if (nextSource != null) { // Skip over if undefined or null
					for (var nextKey in nextSource) {
						// Avoid bugs when hasOwnProperty is shadowed
						if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
							to[nextKey] = nextSource[nextKey];
						}
					}
				}
			}
			return to;
		},
		writable: true,
		configurable: true
	});
}

if (!Element.prototype.matches) {
	Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
	Element.prototype.closest = function(s) {
		var el = this;
		do {
			if (el.matches(s)) {
				return el;
			}
			el = el.parentElement || el.parentNode;
		} while (el !== null && el.nodeType === 1);
		return null;
	};
}

/**
 * @brief: cross browser compatible helper to register for events
 **/
function AttachEvent (obj, eventname, handler) {
	//W3C
	if(obj.addEventListener) {

		var eventname = eventname.substr(2);
		if (eventname == "mousewheel"){

			//Firefox on Mac fast scrolling hot-fix
			if ((window.navigator.platform || '').toLowerCase().indexOf('mac') == 0 && currentBrowser() == 'Mozilla'){
				eventname = "DOMMouseScroll";
			}
			else{
				// NEW & IE9+
				if (Is.Defined(document.documentElement.onwheel) || (document.documentMode || 0)>8)
					eventname = 'wheel';
				else
				// Older FF
				if (currentBrowser() == 'Mozilla')
					eventname = "DOMMouseScroll";
			}

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

			}, supportsPassive ? { passive: true } : false);
		}
		else{

			// Prefixer
			// var pfx = ["webkit", "moz", "MS", "o", ""];
			// for (var p = 0; p < pfx.length; p++) {
			// 	if (!pfx[p]) type = type.toLowerCase();
			// 		element.addEventListener(pfx[p]+eventname, handler, false);
			// }

			obj.addEventListener(eventname, handler, false);
		}
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

var sAvatarNo = Date.now();

function getAvatarURL(email, hash) {

	if (email === sPrimaryAccount)
		hash = sAvatarNo;
	else
	if (!hash)
		hash = 0;

	try {
		return '/teamchatapi/files.avatar?' + buildURL({token: sPrimaryAccountTeamchatToken, email: email || '', skin: GWOthers.getItem('LAYOUT_SETTINGS', 'skin') || 'default', no: hash});
	} catch (r) {
		console.log('getAvatarURL', r);
		console.log(sPrimaryAccountTeamchatToken, email);
		return '';
	}
};

function getContactAvatarURL(contact_id) {
	try {
		return '/teamchatapi/files.avatar?' + buildURL({token: sPrimaryAccountTeamchatToken, email: '', contactid: WMItems.__serverID(contact_id) || '', skin: GWOthers.getItem('LAYOUT_SETTINGS', 'skin') || 'default'});
	} catch (r) {
		console.log('getContactAvatarURL', r);
		console.log(sPrimaryAccountTeamchatToken, contact_id);
		return '';
	}
};

/**
 * @brief	sends given download.php url into iframe
 * @date	24.7.2014
 */
window.downloadItem = function (path, full) {
	/**
	 * callback of the iframe onload
	 * - when server responds with 'text/html' content type and with an error in a body of the response
	 * - onload handler is not called when correct headers are sent in response (Content-Type: application/octet-stream)
	 * - content type cannot be 'application/json', because IE always downloads it (fixed in server)
	 * - content type cannot be checked in javascript - always try to JSON parse documentElement and get error from response
	 * - see WA-394 and/or WC-6923 and/or WC-6965 for details why it was implemented
	 * - note: SmartDiscover must be set-up correctly - opened URL in a browser must be same as the URL in SmartDiscover WebClient and teamchatapi
	 */
	function downloadItemOnloadCallback() {
		var	frm = this.contentDocument,
			body, error = '';

		try {
			body = frm.documentElement;
			error = JSON.parse(body.innerText || body.xtContent).error;
		}
		catch (e) {
			// no action
		}

		switch(error) {
			case 'no_permission':
				return gui.notifier._value({type: 'alert', args: {text: 'ERROR::E_ACCESS', args: [error]}});
			default:
				error && gui.notifier._value({type: 'alert', args: {text: 'ALERTS::GENERAL_ERROR', args: [error]}});
		}
	};

	return function(path, full){

		if (!Is.String(path)) {
			return;
		}

		var win,
			src = full ? path : 'server/download.php?' + path;

		// do not use IFRAME when https is currently used but download path is not secure (http)
		if (full && location.protocol == 'https:' && path.toLowerCase().indexOf('http:') == 0) {
			win = window.open(src, 'downloadFile');
			if (win && win.document) {
				win.document.onload = function() {
					window.close();
				};
				return;
			}
		}

		var id = 'ifrm_download_' + unique_id();
			frm = mkElement('iframe', {id: id, src: src});

		frm.style.position = 'absolute';
		frm.style.width = '1px';
		frm.style.height = '1px';
		frm.style.top = '0';
		frm.style.left = '-1000px';

		// this allows to get an error response when download is not available
		frm.onload = downloadItemOnloadCallback;

		// this executes the download action
		document.body.appendChild(frm);

		// remove created iframe after 2 minutes
		setTimeout(function(){
			try{
				if (frm && frm.parentNode)
					frm.parentNode.removeChild(frm);
			}
			catch(e){
				gui._REQUEST_VARS.debug && console.log("downloadItem",src, e);
			}
		}, 120000);
	};
}();

window.getRemoteFileContent = function(src, callback) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', src);
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4) {
			if (xhr.status === 200 || xhr.status == 0) {
				callback(xhr.responseText);
			}
			else{
				callback(false);
			}
		}
	};
	xhr.send();
};

// Open in separate window
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

function cMaxZIndex(){};
cMaxZIndex.prototype.zindex = [500];
cMaxZIndex.prototype.get = function(b){
	var z = this.zindex[this.zindex.length-1]+1;
	if (!b) this.zindex.push(z);
	return z;
};
cMaxZIndex.prototype.remove = function(z){
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
	catch(e){gui._REQUEST_VARS.debug && console.log(this._name||false,e)}

	//MSIE
	try{ eElement.unselectable = "off" }catch(e){gui._REQUEST_VARS.debug && console.log(this._name||false,e)};
	//KHTM
	try{ eElement.style.KhtmlUserSelect = "text" }catch(e){gui._REQUEST_VARS.debug && console.log(this._name||false,e)}
	//Safari
	try{ eElement.style.WebkitUserSelect = "text" }catch(e){gui._REQUEST_VARS.debug && console.log(this._name||false,e)}
};

function setSelectNone(eElement){
	//return;

	//MOZILA (pozor nefachaj pak inputy!!!)
	try{
		eElement.style.setProperty ('MozUserSelect', '-moz-none', '');
		eElement.style.setProperty ('-moz-user-select', '-moz-none', '');
	}
	catch(e){gui._REQUEST_VARS.debug && console.log(this._name||false,e)}
	//MSIE
	try{ eElement.unselectable = "on" }catch(e){gui._REQUEST_VARS.debug && console.log(this._name||false,e)};
	//KHTM
	try{ eElement.style.KhtmlUserSelect = "none" }catch(e){gui._REQUEST_VARS.debug && console.log(this._name||false,e)}
	//Safari
	try{ eElement.style.WebkitUserSelect = "none" }catch(e){gui._REQUEST_VARS.debug && console.log(this._name||false,e)}
};

/**
 * @brief   Eval JScode in public space (outside parent function)
 * @author  DRZ 28.03.2005
 *
 */
function pubEval(val){
	if (!val) return false;

	try{
		//MSIE
		if (typeof window.execScript == 'object')
			window.execScript(val);
		else{
			/*
			// Note: this whole chunk (for Webkit/Gecko) could be replaced with: eval.call(null,val);
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
			*/
			window.eval(val);
		}
	}
	catch(r){
		if (console){
			console.log('pubEval()', r);
		}
		else
			throw "pubEval() - unable to Eval: \r\n" + val;

		return false;
	}
};

if (typeof Object.assign != 'function') {
	// Must be writable: true, enumerable: false, configurable: true
	Object.defineProperty(Object, "assign", {
		value: function assign(target, varArgs) { // .length of function is 2
		'use strict';
		if (target == null) { // TypeError if undefined or null
			throw new TypeError('Cannot convert undefined or null to object');
		}

		var to = Object(target);

		for (var index = 1; index < arguments.length; index++) {
			var nextSource = arguments[index];

			if (nextSource != null) { // Skip over if undefined or null
			for (var nextKey in nextSource) {
				// Avoid bugs when hasOwnProperty is shadowed
				if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
				to[nextKey] = nextSource[nextKey];
				}
			}
			}
		}
		return to;
		},
		writable: true,
		configurable: true
	});
}

/**
 * @brief   One-row createElement function
 * @author  DRZ 28.03.2005
 */
function mkElement(tElm,eatt,doc,children) {
	var elm = (doc || document).createElement(tElm);
	if (typeof eatt === 'object') {
		for (var i in eatt){
			try {
				switch(i) {

					case 'contenteditable':
					case 'for': elm.setAttribute(i,eatt[i]);
						break;

					case 'text':
						elm.appendChild((doc || document).createTextNode(eatt[i]));
						break;

					case 'style':
						if (Is.Object(eatt[i])){
							for (var j in eatt[i])
								elm.style[j] = eatt[i][j];
							break;
						}

					case 'href':
						if (!eatt[i])
							break;

					default:
						if (i in elm)
							elm[i] = eatt[i];
						else
							elm.setAttribute(i, eatt[i]);
				}
			} catch(e) {}
		}
	}
	(Array.isArray(children) ? children : [children]).forEach(function (child) {
		child && elm.appendChild(child);
	});

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
			if (arg[a])
				elm.classList.add(arg[a]);
	}
	else{

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

/**
 * toggle css (using hascss and removecss or addcss)
 *
 * @param {object} elm
 * @param {string} sClass
 * @return {void}
 */
function togglecss(elm, sClass) {
	if (hascss(elm, sClass)) {
		removecss(elm, sClass);
	}
	else {
		addcss(elm, sClass);
	}
};

function hascss(elm,sClass){
	if (elm.classList)
		return elm.classList.contains(sClass);
	else
		return inArray((elm.className || '').split(' '),sClass)>-1;
};

function getStyle(elm,styleProp,doc){
	if (window.getComputedStyle)
		return (doc || document).defaultView.getComputedStyle(elm,null).getPropertyValue(styleProp) || '';
	else
	if (elm.currentStyle)
		return elm.currentStyle[styleProp] || '';
};

// CSS Support
(function(win){
    'use strict';

    var el = win.document.createElement('div'),
    camelRe = /-([a-z]|[0-9])/ig,
    support,
    camel;

    win.supportcss = function(prop, value){
        // If no value is supplied, use "inherit"
        value = arguments.length === 2 ? value : 'inherit';
        // Try the native standard method first
        if('CSS' in win && 'supports' in win.CSS){
            return win.CSS.supports(prop, value);
        }
        // Check Opera's native method
        if('supportsCSS' in win){
            return win.supportsCSS(prop, value);
        }
        // Convert to camel-case for DOM interactions
        camel = prop.replace(camelRe, function(all, letter){
            return (letter + '').toUpperCase();
        });
        // Check if the property is supported
        support = (camel in el.style);
        // Assign the property and value to invoke
        // the CSS interpreter
        el.style.cssText = prop + ':' + value;
        // Ensure both the property and value are
        // supported and return
        return support && (el.style[camel] !== '');
    };

})(this);


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
Is = (function(){
	var reg = {
		email:		/^([a-z0-9\'\!\#\$\%\&\+\-\/\=\?\^\_\`\{\|\}\~\*][\.]?)+\@[a-z0-9]+([\.\-\_]?[a-z0-9])*\.[a-z]{2,}$/gi,
		domain:		/^([a-z0-9][\-\_\.]?)*\.[a-z]{2,6}$/gi,
		url:		/^http(s?):\/\/[a-z0-9]*/gi,
		filename:	/^(?!\.)(?!com[0-9]$)(?!con$)(?!lpt[0-9]$)(?!nul$)(?!prn$)[^<>:\/\\|?*""]*$/gm
	};

	return {
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
			reg.email.lastIndex = 0;
			return Is.String(a)?!!a.match(reg.email):false;
		},
		Domain: function(a) {
			return Is.String(a)?!!a.match(reg.domain):false;
		},
		URL: function(a) {
			if (!Is.String(a)) return false;
			return !!a.match(reg.url);
		},
		Filename: function(a){
			return (!Is.String(a) || !a.trim().length) ? false : !!a.match(reg.filename);
		},
		Undefined: function(a) {
			return typeof (a) == 'undefined';
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
				catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r)}
			}
			else
			if (eParent)
				//Modern
				if ('contains' in document.body)
					try{
						return eParent.parentNode && eParent.contains(elm);
					}
					catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r)}
				//Old
				else
					try{
						do {
							if (elm == eParent)
								return true;

							if (eStop && eStop == elm)
								return false;
						}
						while(elm = elm.parentNode);
					}
					catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r)}

			return false;
		}
	};
})();


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
	return encodeURIComponent(this).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
};
String.prototype.urlDecode = function() {
	return decodeURIComponent(this.replace(/%(?![\da-f]{2})/gi, function() { return '%25' }).replace(/\+/g, '%20'));
};

String.prototype.highlight_links = function (on){
	var str = this;

	if (this.indexOf('@')>0){ // && this.indexOf('/')<0
		on = on || '';
		var emailPattern = /(([a-z0-9\'\!\#\$\%\&\+\-\/\=\?\^\_\`\{\|\}\~\*][\.]?)+\@[a-z0-9]+([\.\-\_]?[a-z0-9])*\.[a-z]{2,})/gi;
		str = str.replace(emailPattern, "<a href=\"mailto:$1\""+(on?' '+on:'')+">$1</a>");
	}

	var urlPattern = /([A-Za-z]{3,5}:\/\/[^\s<]+?)([.,]\s|[\s<]|$)/g;
	str = str.replace(urlPattern, "<a href=\"$1\" target=\"_blank\">$1</a>$2");

	return str;
};

String.prototype.highlight_links_array = function (bShort){
	var str = [],
		sPrefix = '~░',
		sSuffix = '░~',
		arr = [],
		elm = bShort?mkElement('A'):null;

	var stripPattern = /@\[\S+\]/gi,
		emailPattern = /([a-z0-9\'\!\#\$\%\&\+\-\/\=\?\^\_\`\{\|\}\~\*][\.]?)+\@[a-z0-9]+([\.\-\_]?[a-z0-9])*\.[a-z]{2,}/gi,
		urlPattern = /([A-Za-z-]{3,}:\/\/[^\s<]+?)([.,]\s|[\s<]|$)/g,
		splitStr = '```';

	if (~this.indexOf(splitStr))
		str = this.split(splitStr);
	else
		str = [this];

	for (var i = 0, j = str.length; i<j; i += 2){

		//replace emails
		if (!str[i].match(urlPattern) && str[i].indexOf('@')>0){

			//skip mention @[email]
			str[i] = str[i].replace(stripPattern, function(v, pos){
				return sPrefix + (arr.push(arguments[0]) - 1) + sSuffix;
			});

			str[i] = str[i].replace(emailPattern, function(v, pos){
				return sPrefix + (arr.push('<a href="mailto:' + arguments[0] + '">' + arguments[0] + '</a>') - 1) + sSuffix;
			});
		}

		str[i] = str[i].replace(urlPattern, function(x, s){
			var uri = s;
			if (bShort && s.length>48){
				elm.href = s;
				s = elm.protocol + '//' + elm.hostname;

				if (elm.pathname.length>24)
					s += elm.pathname.substr(0,24) + '...';
				else{
					s += elm.pathname;
					if (elm.search)
						s+='?...';
				}
			}
			return sPrefix + (arr.push('<a href="'+ uri + '" target="_blank">'+ s.entityify() +'</a>') - 1) + sSuffix + arguments[2];
		});

	}

	return {string: str.join(splitStr), array: arr, replace: sPrefix +'(\\d+)'+ sSuffix};
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
};

String.prototype.unescapeXML = function() {
	return this.replace(/&gt;/gi,">").replace(/&lt;/gi,"<").replace(/&quot;/gi,'"').replace(/&apos;/gi,'"').replace(/&amp;/gi,'&');
};

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

	var out = div.textContent;
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

String.prototype.hashCode = function() {
	var hash = 0, i, chr;
	if (this.length === 0) return hash;
	for (i = 0; i < this.length; i++) {
	  chr   = this.charCodeAt(i);
	  hash  = ((hash << 5) - hash) + chr;
	  hash |= 0; // Convert to 32bit integer
	}
	return hash;
};

/*
 * @brief   Strip whitespace from the beginning and end of a string.
 * Example:
 *    - "   Lorem ipsum dolor sit amet  ".trim() == "Lorem ipsum dolor sit amet"

if(!String.prototype.trim){
	String.prototype.trim = function () {
		return this.replace(/^\s+|\s+$/g,'');
	};
}
*/

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
	};

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
	return this.replace(/(\r\n)|(\r)|(\n)/gm, "<br>");
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

String.prototype.quoteSQL =  function(){
	return this.replace(/([\'])/g, "$1$1").replace(/([%])/g , "\\$1");
};

/**
 * @brief   Quote characters that are not digits nor alphas.
 * Example:
 *    - "@#$%".quoteMeta() == "\@\#\$\%"
 */
String.prototype.quoteMeta = function(){
	return this.replace(/([\!\#\$\%\^\@\.\&\*\(\)\-\_\=\+\:\;\"\'\\\/\?\<\>\~\[\]\{\}\`])/g , "\\$1" );
};
// .replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");

// General manipulation functionality
var GlobalTools = {
	// String search - constructor
	search: function(within) {
		this.text = within;
		this.word = '';
	}
};
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
};
// Set a new source text
GlobalTools.search.prototype.within = function(within) {
	this.text = within;
	return this;
};
// Return hits highlighted with html-tags (default strong)
GlobalTools.search.prototype.highlight = function(tag) {
	if(!tag) tag = 'strong';
	var m = this.matches.slice(0),
		i = this.matches.length;
	if(i) {
		while(i--) {
			if(i&1)
				m[i] = '<'+tag+'>'+m[i].escapeXML()+'</'+tag+'>';
			else
				m[i] = m[i].escapeXML();
		}
		return m.join('');
	} else return false;
};

////////////////////////////////////////////////////
//                 MATH TOOLS
////////////////////////////////////////////////////
function dec2hex(d) {return d.toString(16)}
function hex2dec(h) {return parseInt(h,16)}

////////////////////////////////////////////////////obj_timetable
//                 DATE TOOLS
////////////////////////////////////////////////////

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
			k = arr2[i];
		else
			k = i;

		if(!isa && !arr1[k] && arr2[k])
			out[k] = arr2[k];  // TODO: what is it good for?
		else if (typeof arr1[k] != 'undefined')
			out[k] = arr1[k];
	}
	return out;
};

function arrUnique(arr){
	return arr.filter(function(v,i,a){
		return a.indexOf(v) === i;
	});
};
/**
 * @brief	Remove empty and null items from the array.
 * @param[in]  a  [array|object]
 * @return	New array (the old one is left unchanged) with stripped null and
 * empty strings.
 *
 * Example:
 *		compact([1, '2', '', 3, null, '4']) => [1, '2', 3, '4']

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
*/

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
	if (Array.isArray(arr))
		return arr.length;
	else
	if (arr != null && typeof arr == 'object')
		return Object.keys(arr).length;

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
	for (var name in varList)
		url.push(encodeURIComponent(name) + (varList[name] !== void 0 ? '=' + encodeURIComponent(varList[name].toString()) : ''));

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
	var p,argList,newArg,output = {};

	if (!Is.Defined(url))
		url = self.location.search;

	if (typeof url == 'string'){
		//strip # part
		if ((p = url.indexOf('#')) > -1)
			url = url.substr(0,p);

		if ((p = url.indexOf('?'))>-1 && (p<url.indexOf('=')))
			url = url.substr(p+1);

		argList = url.split('&');
		for (var i = 0; i<argList.length; i++)
			if (argList[i]){
				newArg = argList[i].split('=');
				try{
					output[decodeURIComponent(newArg[0])] = newArg[1] ? decodeURIComponent(newArg[1].toString()) : '';
				}
				catch(r){
					return {};
				}
			}
	}

	return output;
};

/**
 *	Container for Number output formating
 *	28.11.2016 Martin Ekblom
 */
var IcewarpNumber = function(num,unit) {
	this.value = parseInt(num);
	this.unit = unit;

	this.locale = document.documentElement.lang || 'en';
};
// Localised number
IcewarpNumber.prototype.localize = function(locale) {
	locale = locale || this.locale;
	return this.value.toLocaleString(locale);
};
// Format number as KB/MB (wrapper for old function)
IcewarpNumber.prototype.fileSize = function(locale) {
	parseFileSize(this.value);
};

/**
 *	parse filesize from bytes to kB/MB
 *	1.2.2010 16:16:39
 */
function parseFileSize(i){
	if ((i = parseInt(i,10)) && Is.Number(i)){
		i = Math.ceilFloat(i/1024,1);
		if (i>1024)
			return Math.ceilFloat(i/1024,1).toLocaleString(document.documentElement.lang) + ' ' + getLang('UNITS::MB');
		else
			return i.toLocaleString(document.documentElement.lang) + ' ' + getLang('UNITS::KB');
	}
	else {
		i = 0;
		return i.toLocaleString(document.documentElement.lang) + ' ' + getLang('UNITS::KB');
	}
};

////////////////////////////////////////////////////
//                COOKIES  MANAGER
////////////////////////////////////////////////////
_me = cCookieManager.prototype;
function cCookieManager(){}

/**
 * @brief   Set value of the cookie.
 * @param[in]  sName    [string] Name of the cookie.
 * @param[in]  aValue   [object] Associative array of name->value.
 * @param[in]  iDays    [number] Optional, in how many days should this cookie
 * expire.
 */

_me.set = function(sName,aValue,iDays) {
	var sExpires = "";
	var dDate = new Date();

	//Use localStorage instead of Cookies if possible
	var storage = null;
	try{
		if (window.localStorage)
			storage = window.localStorage;
		/*  removed because of buggy FFox 3.0.x with SSL/NonSSL switching
		else
		if (window.globalStorage)
			storage = window.globalStorage['merakdemo.com'];
		*/

	}
	catch(r){
		//In case of disabled cookies in FFox
	}

	if (storage){
		var aData = {};
		if (storage['cookie'])
			try{
				aData = JSON.parse(storage['cookie'].toString());
			}
			catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r)}

		if (aValue)
			aData[sName] = aValue;
		else
			delete aData[sName];

		storage['cookie'] = JSON.stringify(aData);

		//storage.removeItem(sName);
		return true;
	}
    else
	if (!Is.Defined(document.cookie))
		return false;

	if (iDays){
        if (iDays>0){
			dDate.setTime(dDate.getTime()+(iDays*86400000));
			sExpires = "; expires="+dDate.toGMTString();
		}
		else
			sExpires = "; expires=-1";
	}

	if (typeof aValue == 'string' || typeof aValue == 'number') aValue = [aValue];
	document.cookie = sName+ "=" + buildURL(aValue) + sExpires + ";"; //path=/

	return true;
};

/**
 * @brief   Get value of the cookie.
 * @param[in]  sName    [string] Name of the cookie.
 * @return  [object] Associative array of name->value.
 */
_me.get = function(sName) {

	//Use localStorage instead of Cookies if possible
	try{
		if (window.localStorage)
			return JSON.parse(window.localStorage['cookie'].toString())[sName];
		/*
		else
		if (window.globalStorage)
			return JSON.parse(window.globalStorage[document.location.hostname]['cookie'].toString())[sName];
		*/
		else
		if(!document.cookie)
			return;
	}
	catch(r){
		return;
	}

	var sSeek	= sName + "=";
	var sCookie	= "";
	var aCookie	= document.cookie.split(";");
	var sCookieValue;

	for (var i in aCookie){
		sCookie = aCookie[i].trim();
		if (sCookie.indexOf(sSeek)!=0) continue;

		sCookieValue = sCookie.substring(sSeek.length);

		if (sCookieValue)
			return parseURL(sCookie.substring(sSeek.length));
		else
			return;
	}

	return;
};

var cookieManager = new cCookieManager();

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
	if (aResponse){
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
			catch(r){}
	}
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
				err = "Error while executing "+aResponse[0]+"()";
			else
				err = "Error while executing "+(aResponse[0] && aResponse[0]._pathName?aResponse[0]._pathName:'oObject')+"."+aResponse[1]+"()";

			console.warn('browser_ext:executeCallbackFunction', err);
			console.error(e);
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
			aLCTval.ITMMIDDLENAME = '';
		}
		else
		if (aLCTval.ITMFIRSTNAME){
			aLCTval.ITMSURNAME = aLCTval.ITMFIRSTNAME;
			aLCTval.ITMFIRSTNAME = '';
		}
	}

	return aLCTval;
};

function getPrimaryAccountFromAddress(bPrintable) {
	var aAccInfo = dataSet.get('accounts',[sPrimaryAccount]);
	if (aAccInfo['FULLNAME'])
		return MailAddress.createEmail(aAccInfo['FULLNAME'],sPrimaryAccount,bPrintable);
	else
		return sPrimaryAccount;
}

function getSubobjects(oObject,aObjects) {
    aObjects = aObjects || {};
	for (var i in oObject)
		if (i.charAt(0) != '_' && i.substr(0,2) != 'X_' && i.substr(0,2) != 'x_' && oObject[i].constructor && oObject[i].constructor === Gui)
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
		if (aObjects.hasOwnProperty(i) && Is.Defined(aValues[i]) && aObjects[i]._value)
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
	var aObjects = getSubobjects(oObject),
		value;
	for(var i in aObjects){
		if (Is.Function(aObjects[i]._value)){
			if (Is.Defined((value = aObjects[i]._value())))
				aValues[i] = value;
			else
				aValues[i] = '';
		}
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

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  l       The lightness
 * @return  Array           The RGB representation
 */
_me.hsl2rgb = function(h,s,l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};

/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 *
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 * @return  Array           The HSL representation
 **/
_me.rgb2hsl = function(r, g, b){
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, l];
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
	var now = new IcewarpDate();
	var julian = now.format(IcewarpDate.JULIAN);
	var time = now.format(IcewarpDate.JULIAN_TIME);
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
	createEmail:function(name,email,bNoQuotes){
		var out = '';
		if(email.indexOf('[') === 0 && email.indexOf(']') === email.length - 1) {
			name = '';
		}
		if (name){
			if (bNoQuotes)
				out = name;
			else{
				name = name.replace(/([\"\\])/g,'\\$1').trim();
				out = /[\s,;@<]/.test(name)?'"'+name+'"':name;

				// out = (
				// 	name.indexOf(' ')>-1 ||
				// 	name.indexOf('\\')>-1 ||
				// 	name.indexOf(',')>-1 ||
				// 	name.indexOf(';')>-1 ||
				// 	name.indexOf('@')>-1 ||
				// 	name.indexOf('<')>-1?'"'+name+'"':name);
			}
		}

		if (email){
			if (bNoQuotes){
				if (out)
					out += ' ('+ email.toLowerCase() +')';
				else
					out = email.toLowerCase();
			}
			else{
				if (out) out += ' ';
				out += '<'+ email.toLowerCase() +'>';
			}
		}

		return out;
	},
	appendEmail:function(sIn, email){

		if (email){

			if (!sIn)
				return email;

			var aMail = MailAddress.splitEmailsAndNames(email),
				aTmp = MailAddress.splitEmailsAndNames(sIn);

			if ((aMail = aMail[0]) && aMail.email){
				for(var i = aTmp.length-1;i>-1;i--)
					if (aTmp[i].email == aMail.email)
						return sIn;

				aTmp.push(aMail);

				for(var aOut = [],i = 0; i<aTmp.length;i++){
					if (!aTmp[i].name && aTmp[i].email.indexOf('[') === 0 && aTmp[i].email.match(/^\[.+\]$/g))
						aOut.push(aTmp[i].email);
					else
						aOut.push(MailAddress.createEmail(aTmp[i].name,aTmp[i].email));
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
							if(!sEmail ){
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

			aEmails = MailAddress.splitEmails(aType[sType]);

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

var base64 = {
    encode: function( str )
    {
        if (window.btoa) // Internet Explorer 10 and above
            return window.btoa(str);
        else
        {
            // Cross-Browser Method (compressed)
            // Create Base64 Object
            var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}};
            // Encode the String
            return Base64.encode(str);
        }
    },

    decode: function( str )
    {
        if (window.atob) // Internet Explorer 10 and above
            return window.atob(str);
        else
        {
            // Cross-Browser Method (compressed)
            // Create Base64 Object
            var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}};
            // Encode the String
            return Base64.decode(str);
        }
    }
};

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                       Class Path
////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @class	Path
 */
var Path = {

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
	split:function(sFolderPath,bNamed) {
		if (Is.String(sFolderPath)){
			var tmp = sFolderPath.split('/');
			return bNamed?{aid:tmp.shift(),fid:tmp.join('/')}:[tmp.shift(), tmp.join('/')];
		}
		else
			return bNamed?{aid:'',fid:''}:['',''];
	},

	/**
	 * @brief   Returns filename component of path.
	 * Given string containing a path to a file, this function will return the base name of the file.
	 * @param[in]	sPath	[string]	String containing a path to a file.
	 * @return	[string]    Filename component of path.
	 *
	 * Example: Path.basename('/home/httpd/html/index.php') == 'index.php'
	 */
	basename:function(sPath) {
		if (!Is.String(sPath)) return false;
		return sPath.split('/').pop();
	},

	basedir:function (sPath){
		if (!Is.String(sPath)) return '';
	    var tmp = sPath.split('/');
			tmp.pop();

		return tmp.join('/');
	},

	extension:function(sFile){
		return sFile&&sFile.indexOf('.')!=-1?sFile.split('?')[0].split('.').pop().toLowerCase():'';
	},

	slash:function(sPath){
		return sPath?sPath.replace(/\\/g,'/'):'';
	},
	backslash:function(sPath){
		return sPath?sPath.replace(/\//g,'\\'):'';
	},
	build:function(aPath){
		return [aPath.aid || aPath[0], aPath.fid || aPath[1]].join('/');
	}
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
		default: return false;
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
		case 'E': return 'frm_event2';
		case 'N': return 'frm_note';
		case 'T': return 'frm_task';
		case 'J': return 'frm_journal';
		case 'L': return 'frm_distrib';
		case 'F': return 'frm_file';
		default: throw new Error('Not implemented');return false;
	}
};

Date.prototype.stdTimezoneOffset = function () {
	var jan = new Date(this.getFullYear(), 0, 1);
	var jul = new Date(this.getFullYear(), 6, 1);
	return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
};

Date.prototype.isDstObserved = function () {
	return this.getTimezoneOffset() < this.stdTimezoneOffset();
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

    if (str.indexOf('CHROME')>-1){
        out = 'Chrome';
		v = parseInt(str.substr(str.indexOf('CHROME/')+7).split('.')[0],10);
    }
	else
	if (str.indexOf('WEBKIT')>-1 || str.indexOf('SAFARI')>-1){
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
	};
}();
currentBrowser.HighDensity = ((window.matchMedia && (window.matchMedia('only screen and (min-resolution: 124dpi), only screen and (min-resolution: 1.3dppx), only screen and (min-resolution: 48.8dpcm)').matches || window.matchMedia('only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (min-device-pixel-ratio: 1.3)').matches)) || (window.devicePixelRatio && window.devicePixelRatio > 1.3));

function IsBrowserPluginInstalled(a) {
	return navigator.mimeTypes && navigator.mimeTypes[a] && navigator.mimeTypes[a].enabledPlugin;
};



/**
 * sColor is optional
 **/

window.getCalendarColor = (function(){
	var aPalette = {
		'blue':'','green':'','brown':'','purple':'','yellow':'','teal':'','plum':'','red':'',
		'aqua':'','aquamarine':'','orchid':'','pink':'','silver':'','white':'','gray':'','lemon':''
	};

	return function(fid, sColor){
		var aColors = Cookie.get(['calendar_colors']) || {};

		if (!fid)
			return aColors;

		if (sColor){

			var old = aColors[sColor] && aColors[sColor] != fid ? aColors[sColor] : '';

			for (var i in aColors)
				if (aColors[i] == fid){
					aColors[i] = '';
					Cookie.set(['calendar_colors', i]);
					break;
				}

			aColors[sColor] = fid;
			Cookie.set(['calendar_colors', sColor], fid);

			if (old)
				getCalendarColor(old);

			return sColor;
		}

		for (var sColor in aColors)
			if (aColors[sColor] == fid)
				return sColor;

		var aFolders = dataSet.get('folders',[sPrimaryAccount,'__@@VIRTUAL@@__/__@@EVENTS@@__','VIRTUAL','FOLDERS']) || {};

		for (var sColor in aPalette)
			if (!aColors[sColor] || !Is.Defined(aFolders[aColors[sColor]])){
				aColors[sColor] = fid;
				Cookie.set(['calendar_colors', sColor], fid);
				return sColor;
			}
	};
})();

/*
 window.__wmCalendarColors = {'blue':'','green':'','brown':'','purple':'','yellow':'','teal':'','pink':'','red':''};
function getCalendarColor(fid, sColor){

	if (sColor && sColor)

	for (var i in window.__wmCalendarColors)
		if (window.__wmCalendarColors[i] == fid)
			return i;

	var aFolders = dataSet.get('folders',[sPrimaryAccount,'__@@VIRTUAL@@__/__@@EVENTS@@__','VIRTUAL','FOLDERS']) || {};

	for (var i in window.__wmCalendarColors)
		if (!window.__wmCalendarColors[i] || !Is.Defined(aFolders[window.__wmCalendarColors[i]])){
			window.__wmCalendarColors[i] = fid;
			return i;
		}


		// if (window.__wmCalendarColors[i] && !Is.Defined(aFolders[window.__wmCalendarColors[i]]))
		// 	window.__wmCalendarColors[i] = '';

		// if (!window.__wmCalendarColors[i]){
		// 	window.__wmCalendarColors[i] = fid;
		// 	return i;
		// }

	return '';
};
*/

function parseParamLine (sData){

	var col, aOut = [];

	sData.split("\r\n").forEach(function(val,key){
		if (val)
			if (key == 0){
				var arr = val.toUpperCase().split('&');
				col = arr;
			}
			else{
				var arr = val.split('&'),
					tmp = {};

				col.forEach(function(v,k){
					if (v && Is.String(arr[k]))
						tmp[v] = arr[k].urlDecode();
				});

				aOut.push({values:tmp});
			}
	});

	return aOut;
};

var CalendarFormatting = {
	formats: {
		"0": 'MM/DD/YY',
		"1": 'MM/DD/YYYY',
		"5": 'DD-MM-YY',
		"2": 'DD-MM-YYYY',
		"6": 'DD/MM/YY',
		"3": 'DD/MM/YYYY',
		"4": 'YYYY-MM-DD',
		"7": 'DD.MM.YY',
		"8": 'DD.MM.YYYY',
		"9": 'DD MMM YY',
		"10": 'DD MMM YYYY'
	},
	rtl_formats : false,
	rtl_langs : ['ar', 'fa', 'ps', 'ur', 'he'],
	formatRtlTransform : function () {
		var key;
		this.rtl_formats = {};
		for (key in this.formats) {
			this.rtl_formats[key] = this.formats[key].split('').reverse().join('');
		}
		return this.rtl_formats;
	},
	getFormats: function () {
		if (~this.rtl_langs.indexOf(document.documentElement.lang)) {
			return this.rtl_formats ? this.rtl_formats : this.formatRtlTransform();
		}
		return this.formats;
	},
	getFormat: function (id) {
		if (~this.rtl_langs.indexOf(GWOthers.getItem('LAYOUT_SETTINGS', 'language')||'en')) {
			return this.rtl_formats ? this.rtl_formats[id] : this.formatRtlTransform()[id];
		}
		return this.formats[id];
	},
	simplified: function (date, override) {
		return date.calendar(null, Object.assign({
			sameDay: 'LT',
			nextDay: '[' + getLang('CALENDAR::TOMORROW') + '] LT',
			nextWeek: (date.getMoment().localeData().longDateFormat('L').replace(/[\/\-\.\s]?[ij]?Y+[\/\-\.\s]?/, '') + ' LT'),
			lastDay: '[' + getLang('CALENDAR::YESTERDAY') + '] LT',
			lastWeek: (date.getMoment().localeData().longDateFormat('L').replace(/[\/\-\.\s]?[ij]?Y+[\/\-\.\s]?/, '') + ' LT'),
			sameElse: date.isSame(new IcewarpDate(), 'year') ? (date.getMoment().localeData().longDateFormat('L').replace(/[\/\-\.\s]?[ij]?Y+[\/\-\.\s]?/, '') + ' LT') : 'L LT'
		}, override || {}));
	},
	normal: function (date, override) {
		return date.calendar(null, Object.assign({
			sameDay: '[' + getLang('CALENDAR::TODAY') + ']',
			nextDay: '[' + getLang('CALENDAR::TOMORROW') + ']',
			nextWeek: 'L',
			lastDay: '[' + getLang('CALENDAR::YESTERDAY') + ']',
			lastWeek: 'L',
			sameElse: 'L'
		}, override || {}));
	},
	normalWithTime: function (date, override) {
		return date.calendar(null, Object.assign({
			sameDay: '[' + getLang('CALENDAR::TODAY') + '] LT',
			nextDay: '[' + getLang('CALENDAR::TOMORROW') + '] LT',
			nextWeek: 'L LT',
			lastDay: '[' + getLang('CALENDAR::YESTERDAY') + '] LT',
			lastWeek: 'L LT',
			sameElse: 'L LT'
		}, override || {}));
	},
	normalWithWeekDay: function(date, override) {
		var diff = Math.abs(date.diff(new Date(), 'days'));
		var withWeekDay = diff < 7 ? '[' + this.weekdayToString(date.day(), date < new Date()) + ']' : 'L';
		return this.normal(date, Object.assign({
			sameElse: withWeekDay,
			lastWeek: withWeekDay,
			nextWeek: withWeekDay
		}, override || {}));
	},
	normalWithWeekDayAndTime: function(date, override) {
		var diff = Math.abs(date.diff(new Date(), 'days'));
		var withWeekDay = diff < 7 ? '[' + this.weekdayToString(date.day(), date < new Date()) + '] LT' : 'L LT';
		return this.normalWithTime(date, Object.assign({
			sameElse: withWeekDay,
			lastWeek: withWeekDay,
			nextWeek: withWeekDay
		}, override || {}));
	},


	formatStartDate: function (event) {
		var formattedDate = '';

		if (event.startdate>0){
			if (event.starttime > -1) {
				formattedDate = IcewarpDate.julian(event.startdate, event.starttime).format('L LT');
			} else {
				formattedDate = IcewarpDate.julian(event.startdate).format('L');
			}
		}

		return formattedDate;
	},
	weekdayToString: function(week_day, in_the_past) {
		return 'sunday,monday,tuesday,wednesday,thursday,friday,saturday'.split(',').map(function(day) {
			return getLang('DAYS::' + (in_the_past ? 'LAST_' : '') + day.toUpperCase());
		})[week_day];
	}
};

window.csstool = {
	//rx: /(^|[\s,])(body)([\s,]|$)/g,

	st: function(str, prefix){
		return str.split(',').map(function(v){
			v = v.trim();
			if (v.toLowerCase() == 'body')
				return prefix;
			else
				return prefix + ' ' + v;
		}).join(',');
	},

	// Prefix styleSheets in document
	// aOpt: 	tagOnly		- apply only on <style> tag in body
	//			removeIW	- removes styles with iw-style attribute
	prefix: function (prefix, target_document, aOpt) {
		var aOpt = aOpt || {},
			doc = target_document || document,
			arr = [].slice.call(doc.styleSheets);

		for (var style, i = arr.length-1; i>=0; i--){
			style = arr[i];

			//apply only on <style> tags inside of message
			if ((!aOpt.tagOnly || !style.href) && style.cssRules && style.ownerNode){

				//Remove iw-style
				if (aOpt.removeIW && style.ownerNode.hasAttribute('iwstyle'))
					style.ownerNode.parentNode.removeChild(style.ownerNode);
				else
				if (!style.ownerNode.hasAttribute('iwfix') && !style.ownerNode.hasAttribute('data-fr-style'))
					//change link.rules
					if (style.href){
						[].slice.call(style.cssRules).forEach(function (rule, i) {
							if (rule.type === 1)
								try{
									style.insertRule(csstool.st(rule.selectorText, prefix) + rule.cssText.substr(rule.selectorText.length), i);
									style.deleteRule(i + 1);
								}
								catch(e){
									console && console.log('csstool.prefix.link', e);
								}
						});

						style.setAttribute('iwfix', prefix);
					}
					//hack, we need to actually change html inside of <style>
					else{
						var elm = mkElement('style', {type:"text/css", iwfix:prefix}, doc);
						[].slice.call(style.cssRules).forEach(function (rule, i) {
							try{
								if (rule.type === 1)
									elm.appendChild(doc.createTextNode(csstool.st(rule.selectorText, prefix) + rule.cssText.substr(rule.selectorText.length) + "\r\n"));
								else
									elm.appendChild(doc.createTextNode(rule.cssText + "\r\n"));
							}
							catch(e){
								console && console.log('csstool.prefix.style', e);
							}
						});
						style.ownerNode.parentNode.replaceChild(elm, style.ownerNode);
					}
			}
		}
	},

	// Copy rules from <link> to <style>
	// aOpt 	useIW	- use iw-style in <style> element
	//			skipIW	- skip <links> with iw-style attribute
	copy: function (target_document, newStyle, aOpt) {
		var aOpt = aOpt || {},
			doc = target_document || document;

		if (doc.styleSheets){

			newStyle = newStyle || mkElement('style', {type:"text/css"}, doc);

			if (aOpt.useIW)
				newStyle.setAttribute('iwstyle','iwstyle');

			doc.body.insertBefore(newStyle, doc.body.firstChild || null);

			try{
				[].slice.call(doc.styleSheets).forEach(function (style) {
					if (style && style.cssRules && style.href && style.ownerNode && (!aOpt.skipIW/* || !style.ownerNode.hasAttribute('iwstyle')*/))
						style.cssRules && [].slice.call(style.cssRules).forEach(function (rule) {
							//hack, we need to actually change html inside of <style>
							if (rule.cssText)
								newStyle.appendChild(doc.createTextNode(rule.cssText + "\r\n"));

							//can not be used, <style> tag seems to be empty for innerHTML
							//newStyle.sheet.insertRule(rule.cssText);
						});
				});
			}
			catch(e){
				console && console.log('csstool.copy', e);
			}

		}
	}
};
