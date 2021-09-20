/**
 * @brief   JS Object debug funtion
 * @author  DRZ 10.03.2005
 */
function inspect(obj,win) {
	var str = "";
	for(var prop in obj)
		try{
			if (obj[prop]===obj)
            	str += "obj." + prop + " = SELF";
			else
				str += "obj." + prop + " = " + obj[prop] + (win?"<br>":"\r\n");
		}
		catch(er){
			str += 'obj.' + prop + " = NO ACCESS" + (win?"<br>":"\r\n");
		};

	if (win){
		var kokos = window.open("","");
			kokos.document.writeln(str);
	}
	else
		alert(str);
};

/**
 * @brief: JS multidimensional array debug funtion
 * @input: array
 * @date : 21.7.2006 10:45:05
 */
function inspect2(arr,win){
	if (win){
		var kokos = window.open("","");
			kokos.document.writeln(var_dump(arr).replace(/\>/g,"&gt;").replace(/\</g,"&lt;").replace(/\n/g,"<br>"));
	}
	else
		alert(var_dump(arr));
};


function var_dump(arr,fce,num){
	var ap="",out="",tstr="";
	num = num || 0;

	if (Is.String(arr)) return arr;

	for (var ii=0; ii<num; ii++) ap += ".";
	for (var i in arr){
		if (typeof arr[i] == 'object'){
			if (arr[i].constructor == Date)
				out += ap+" ["+i+"](date) = " + arr[i].toString()+"\n";
			else
			if (arr[i] == null)
				out += ap+" ["+i+"](Null)\n";
			else
			if (arr[i]._name && arr[i]._type)
				out += ap+" ["+i+"]("+ arr[i]._type +") = "+ arr[i]._name +"\n";
			else
				out += ap+" ["+i+"]\n" + var_dump(arr[i],fce,num+2);
		}
		else{
			if (typeof arr[i] == 'undefined')
				tstr = 'undefined'; //continue;
			else
				tstr = arr[i].toString();

			out += ap+" ["+i+"]("+typeof arr[i] +") = "+tstr+"\n";
		}
	}
	return out;
};

/*
 *	New Debugger object - Martin Ekblom 2012-2013
 *
 *	How to use: (Make sure popups are not blocked - popup window is the default output)
 *
 *	debug.note("I'm here in the code!");			// Will output message in debugger
 *	debug.dump(someVariable);						// Will output the content, type and other relevant information about the variable (variable can be any type)
 *	debug.dump('myVariableLabelX',someVariable);	// Dumps the variable with a label (eg variable name) to avoid confusion
 *	debug.console = true;							// Will channel all output to the console instead of window
 *	debug.info();									// Will show browser name, engine and version as well as support for xhr2, html5, etc
 *
 *	Public methods
 *		note		string		display simple message
 *		dump 		*			dump variable of any kind
 *		see						returns the most recently inspected variable
 *		open		string		opens the named property of the most recently inspected variable
 *	(	status 					current status							)
 *		info					browser and support information	
 *
 *	Public properties
 *		focus		bool			bring debug window to focus when outputting (true by default)
 *		output		bool			suppress all output
 *		console		bool			use native console or other output
 *		whiteboard	readonly		node in which output will be added (if console is false)
 *
 *	Public static methods
 *		getType			*		returns a pseudotype like typeof but with NaN, Null and Undefined as own types
 *		getClass		*		returns the "class" of an object, eg Number, Date, Funktion, ...
 *		getConstructor	object	returns the constructor of the object
 */

GlobalDebugger.version = "1.3.3";

function GlobalDebugger(el) { // Constructor
	this.output = true;
//	this.console = console ? true : false;
	this.console = false;
	this.whiteboard = el || document.createElement('div');
	this.xml = false;
	this.lognum = 0;
	this.focus = false;
	this.init();
}

(function() {	// GlobalDebugger private namespace
	var doc = null;
	var win = null;
	var log = null;

	GlobalDebugger.browser = (function(){
		var b = {};
		b.application = navigator.userAgent.match(/(msie|firefox|chrome|safari|opera)/i);
		b.application = b.application instanceof Array ? b.application[1] : null;

		var opr = navigator.userAgent.match(/opr\/([0-9]+\.[0-9]+(\.[0-9]+)*)$/i);
		if(opr instanceof Array) {
			b.application = 'Opera';
			b.version = opr[1];
		}

		b.engine = navigator.userAgent.match(/(trident|webkit|gecko|presto)/i);
		b.engine = b.engine instanceof Array ? b.engine[1] : null;
		var re = /(AppleWebKit|Gecko|Trident|Presto)\/([0-9]+(\.[0-9]+)*)/;
		b.build = navigator.userAgent.match(re);
		b.build = b.build instanceof Array ? b.build[2] : null;

		if(b.engine=='Trident' && !b.application)
			b.application = 'MSIE';

		if(!b.version) {
			var re = /(version\/|firefox\/|chrome\/|msie |rv:)([0-9]+\.[0-9]+(\.[0-9]+)?)/i;
			b.version = navigator.userAgent.match(re);
			b.version = b.version instanceof Array ? b.version[2] : null;
		}
		b.release = parseInt(b.version) || 0;

		navigator.browser = b;
		return b;
	})();

	GlobalDebugger.os = (function(){
		var os = {}, ua = navigator.userAgent;
		if(ua.indexOf('Windows')!=-1 || ua.indexOf('Win9')!=-1) {
			os.vendor = "MicroSoft";
			os.name = "Windows";
			var win = ua.match(/Windows NT ([456]\.[012])/);
			if(win)
				os.version = {'6.3': "8.1", '6.2': "8", '6.1': "7", '6.0': "Vista", '5.2': "Server 2003", '5.1': "XP", '5.0': "2000", 'NT': "NT"}[win[1]];
			else if(win = ua.match(/Windows (NT|XP|2000|ME)/))
				os.version = win[1];
			else if(win = ua.match(/Win(dows[ _])?(9[58]|NT)/))
				os.version = win[2];
		} else
		if(ua.indexOf('Macintosh')!=-1) {
			os.vendor = "Apple";
			os.name = "OS X";
			var mac = ua.match(/Mac OS X 10[_.]([1-9])/);	// /(PPC|Intel) Mac OS X( 10_([1-9]))?/
			if(mac)
				os.version = '10.'+mac[1];
		} else
		if(ua.indexOf('iPhone')!=-1 || ua.indexOf('iPad')!=-1 || ua.indexOf('iPod')!=-1) {
			os.vendor = "Apple";
			os.name = "iOS";	// iPad; U; CPU OS 3_2 like Mac OS X; iPhone; U; CPU iPhone OS 4_3 like Mac OS X; iPod; U; CPU iPhone OS 4_3_3 like Mac OS X
			var ios = ua.match(/OS ([1-9])_([0-9])/);
			if(ios)
				os.version = ios[1]+'.'+ios[2];
		} else
		if(ua.indexOf('Android')!=-1) {
			os.vendor = "Google";
			os.name = "Android";
			var droid = ua.match(/Android ([1-9])\.([0-9]+)/);
			if(droid)
				os.version = droid[1]+'.'+droid[2];
		} else
		// OpenBSD, SunOS
		if(ua.indexOf('Linux')!=-1 || ua.indexOf('X11')!=-1) {
			os.name = "Linux";
		} 
		navigator.os = os;
		return os;
	})();

	function Note(t) { // Note constructor
		this.title = t;
		this.wrap = false;
		this.info = true;
		this.message = null;
		this.warning = null;
		this.data = [];
	}

	Note.prototype.publish = function(c) {
		if(c) {	// Output to console
			if(this.wrap) {
				if(console.group)
					console.group(this.title); 
				else
					console.info('---'+this.title+'------------------------------');
			}
			while(this.data.length) {
				var a = this.data.shift();
				for(var n in a) {
					if(a[n] instanceof Array)
						console[n](a[n][0],a[n][1]);
					else
						console[n](a[n]);
				}
			}
			if(this.wrap) 
				if(console.groupEnd) 
					console.groupEnd();
				else
					console.info('---End----------------------------------------------------------------------');
		} else { // Output to window or node

			function style(data) {
				if(typeof data=='string') return '<q>'+data.replace(/\r/g,'\\r').replace(/\n/g,'\\n').replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")+'</q>';
				if(typeof data=='number' && !isNaN(data)) return '<em>'+data+'</em>';
				if(typeof data=='boolean') return '<b>'+data+'</b>';
				if(data===null || data===undefined || typeof data=='number'&&isNaN(data)) return '<strong>'+data+'</strong>';
				if(typeof data=='object') {
					return '<a href="javascript: void(0)">[object '+GlobalDebugger.getConstructor(data)+']</a>';
				}
				if(typeof data=='function') {
					var re = /^function\s*[A-Z0-9_]*\([^)]*\)/i;
					if(re.test(data)) return '<var>'+re.exec(data).pop()+' { ... }</var>'; else return '<var>'+data+'</var>';
				}
				return data;
			}

			function propertyList(prop) {
				var list = doc.createElement('ul');
				for(var v in prop) {
					var item = doc.createElement('li');
					try {
						item.innerHTML = '<span>'+(typeof prop[v])+'</span> '+v+": "+style(prop[v]);
					} catch(e) {
						item.innerHTML = '<span>private</span> '+v+": <span>?</span>";
					}
					list.appendChild(item);
					var a = item.lastChild;
					if(a.tagName=='A') {
						a.onclick = (function(name,variable) {
							return function (e) {
								var exp = propertyList(variable);
								this.parentNode.replaceChild(exp,this);
							}	
						})(v,prop[v]);	
					}
				}
				return list;
			} 

			if(!log.parentNode || win && !win.document) {
				win = window.open('', 'debug', "resizable=yes,scrollbars=1,status=0,width=400,height=600");
				win.document.write('<html><head><title>IceWarp Debug Logger</title><style>html,body{font:10px Tahoma,Arial,Helvetica,sans-serif;margin:0;padding:0} h1{width:100%} h1+form+div{padding-top:3em;padding-bottom:3em} form{text-align:center;border-top:1px solid #666;background-color:#444;width:100%;margin:0;padding:3px;opacity:0.7} input{border:1px solid #333;color:#c2f4a9;width:90%;background-color:#444;background-color:#111} div.debugbox{margin:7px 4px} div.debugdata{background-color:#424046;padding:4px 7px;border-radius:0 0 9px 9px} h2{margin:0;padding:3px;font-size:13px;background-color:#525056;cursor:pointer;text-shadow:1px 1px 2px #888} p{font-size:12px;color:#828086;margin:0;padding:0} q{color:#aef47b} em{color:#f06f9a} strong{color: #f4408c} b{color:#dbd956;font-weight:normal} var{color:#727076} ul{margin:0;padding:0;list-style:none;padding-left:1em} li{margin:0;padding:0;font-size:11px;color:#929096} li span{color: #626066} li a{color: #74a7e1}</style></head><body></body></html>');
				win.document.close();
				win.document.title = "IceWarp Debug Logger";
				win.document.body.onunload = function() {log = document.createElement('div');}
				doc = win.document;
				var h = doc.createElement('h1');
				h.appendChild(doc.createTextNode('JavaScript Debug Logging'));
				h.style.backgroundColor = 'black';
				h.style.color = 'white';
				h.style.margin = '0';
				h.style.padding = '7px';
				h.style.textAlign = 'center';
				h.style.font = 'bold 14px Arial,Helvetica,sans-serif';
				h.style.opacity = '0.7';
				h.style.position = 'fixed';
				var cmds = [], cmdp = 0;
				var c = doc.createElement('form');
				c.onsubmit = function(e) {
					var ipt = this.getElementsByTagName('input')[0], run;
					cmds.unshift(ipt.value);
					try {
						if(window.execScript) // IE
							try {
								execScript('GlobalDebugger.tmpIEexecVal=('+ipt.value+')');
								run = GlobalDebugger.tmpIEexecVal;
							}catch(e){ // Note this causes IE to report 80020101 error
								execScript(ipt.value);
							}
						else
							run = eval.call(null,ipt.value);
						if(run!==undefined)
							debug.dump(run);
						else
							debug.note('JavaScript executed, no return value');
					} catch(e) {
						debug.note('JavaScript Execution Error');
					}
					ipt.value = '';
					cmdp = 0;
					return false;
				}
				c.style.opacity = '0.7';
				c.style.position = 'fixed';
				c.style.bottom = '0px';
				var i = doc.createElement('input');
				i.onkeydown = function(e) {
  					e = e || win.event;
  					if(!cmds.length) return true;
  					switch(e.keyCode) {
						case 38:
 							this.value = cmds[cmdp];
							if(++cmdp>=cmds.length) cmdp=0;
							break;
 						case 40:
							if(--cmdp<0) cmdp = cmds.length-1;
							this.value = cmds[cmdp];
							break;
						case 27:
							this.value = '';
							break;
 					}
				}
				c.appendChild(i);
				log = doc.body.appendChild(doc.createElement('div'));
				doc.body.appendChild(h);
				doc.body.appendChild(c);
				doc.body.appendChild(log);
				doc.body.style.backgroundColor = '#323036';
			}
			var box = doc.createElement('div');
			box.className = "debugbox";
			var h = doc.createElement('h2');
			h.appendChild(doc.createTextNode(this.title));
			box.appendChild(h);
			var c = doc.createElement('div');
			c.className = "debugdata";
			if(this.warning) {
				var w = doc.createElement('p');
				w.appendChild(doc.createTextNode(this.warning));
				c.appendChild(w);
				w.style.color = '#dbd956';
			}
			if(this.info) {
				var info = this.info;
				if(typeof this.variable=='string'|| typeof this.variable=='number' || typeof this.variable=='boolean' || typeof this.variable=='function' || this.variable===null || this.variable===undefined) info += style(this.variable);
				var i = doc.createElement('p');
				i.innerHTML = info;
				c.appendChild(i);
				if(typeof this.variable=="object") {
					c.appendChild(propertyList(this.variable));
				}
			}

			box.appendChild(c);
			log.appendChild(box);

			h.onclick = function(e) {
				if(this.className!='hidden') {
					this.nextSibling.style.display = 'none';
					this.className='hidden';
				} else {
					this.nextSibling.style.display = 'block';
					this.className='';
				}
			}

			win.scrollTo(0, doc.body.scrollHeight);
			if(this.focus) win.focus();

		}
	}

	GlobalDebugger.getType = function(v) {
		if(v===undefined)
			return 'undefined';
		else if(v===null)
			return 'null';
		else
			return typeof v;
	}

	GlobalDebugger.getClass = function(v) {
		if(v===null) return "Null";
		if(v===undefined) return "Undefined";
		return Object.prototype.toString.call(v).slice(8,-1);
	}

	GlobalDebugger.getConstructor = function(v) {
		var c,
			re = /^function\s*([A-Z0-9_]+)\(/i,
			ie = /^\[object ([A-Z0-9_]+)\]$/i;
		if(typeof v=='object' && v!==null) {
			if(v instanceof Object && v.constructor && re.test(v.constructor.toString()))
				return v.constructor.toString().match(re).pop();
			else if(v.constructor && ie.test(v.constructor.toString())) // in IE native objects are not instances of Object...
				return v.constructor.toString().match(ie).pop();
			else { // Special case only IE
				if(v instanceof Date) return "Date";
				if(v instanceof RegExp) return "Array";
				if(v instanceof RegExp) return "RegExp";
				return 'Object';
			}
		} else return false;
	}

	GlobalDebugger.prototype.init = function() {
		log = this.whiteboard;
		doc = log;
		while(doc.parentNode) doc = doc.parentNode;
	}

	GlobalDebugger.prototype.note = function(m) {
		if(!this.output) return;
		var note = new Note('IceWarp Debug Message');
		note.wrap = true;
		note.data.push({'info': m});
		note.info = '';
		note.warning = m;
		note.publish(this.console);
	}

	// Arguments either only variable (v) or varname and var (n,v)
	GlobalDebugger.prototype.dump = function() {
		if(!this.output) return;

		var n,v;
		if(arguments.length==2) {
			v = arguments[1];
			n = arguments[0];
		} else v = arguments[0];

		this.current = {name: n, variable: v};

		var type = GlobalDebugger.getType(v);
		var clas = GlobalDebugger.getClass(v);
		var cnst = GlobalDebugger.getConstructor(v);
		if(cnst) {
			clas = cnst;
			type = "instance";
		}

		var note = new Note("IceWarp Debug Log ("+(++this.lognum)+"): "+type+(n?" "+n:'')+" of type "+clas);
		note.wrap = true;

		var len = clas=="Array" ? " (lenght: "+v.length+")" : '';
		clas =(clas=='String' || clas=='Number' || clas=='Boolean') ? '' : clas+' ';
		if(type=="null"||type=="undefined"||type=="number"&&isNaN(v)) {
			note.info = "The value of the variable"+(n?" '"+n+"'":'')+" is ";
			note.warning = "The value "+type+" is unspecified!";
		} else if(type=="function") {
			note.info = n ? "The value of the variable '"+n+"' is " : "The value of this variable is ";
			note.warning = "The variable is pointing to a function!";
		} else if(v instanceof Date) {
			note.info = n ? "The parsed value of this Date '"+n+"' is " : "The parsed value of this Date is ";
			v = {
				'Milliseconds': v.valueOf(),
				'Local time': v.toString(),
				'Julian date': v.getJulianDate ? v.getJulianDate() : undefined,
				'Unix time': v.getUNIX ? v.getUNIX() : undefined
			}
		} else if(v instanceof RegExp) {
			note.info = n ? "The RegExp instance '"+n+"' holds the regex " : "This RegExp instance holds the regex ";
			v = {
				Expression: v.source,
				'Current Position': v.lastIndex,
				'Multiple Matches': v.global,
				'Treat as one line': v.multiline,
				'Ignore Case': v.ignoreCase
			};
		} else {
			var empty = false;
			if(typeof v == "object") {
				empty = true;
				for(var p in v) {
					empty=false;
					break;
				}
			}
			if(empty) {
				note.warning = v instanceof Array ? "This array is empty!" : "This object is empty!";
				note.info = n ? "The "+clas+type+" '"+n+"' has no properties" : "The "+clas+type+" has no properties";
			} else
				note.info = n? 
				"The value of the "+clas+type+" '"+n+"'"+len+" is: " : 
				"The value of this "+clas+type+len+" is: ";
		}

		if(note.warning)
			note.data.push({'warn': note.warning});

		switch(type) {
			case 'string':
			case 'number':
			case 'null':
			case 'undefined':
				note.data.push({'info': [note.info,v]});
				break;
			default:
				note.data.push({'info': note.info});
		}

		if(v instanceof Element && this.console && console.dirxml) {
			note.data.push({'dirxml': v});
		} else if(typeof v == "object" && this.console && console.dir && console.debug) {
			if(navigator.userAgent.indexOf('WebKit')!=-1) { // Safari prints label above (we already have that)
				for(var i in v) note.data.push({'log': ["\t"+i+': ',v[i]]});
			} else note.data.push({'dir': v});
		} else if(typeof v == "object" && console.log && this.console && !console.debug) { // IE does not expand objects
			for(var i in v) note.data.push({'log': i+': '+v[i]});
		}

		note.variable = v;
		note.varname = n;

		note.publish(this.console);

		return 'Debug Dump Finished - Console mode';
	}

	GlobalDebugger.prototype.see = function() {
		if(this.current) return this.current.variable;
	}

	GlobalDebugger.prototype.open = function(p) {
		this.dump(this.see()[p]);
	}

	GlobalDebugger.prototype.status = function() {
		// Not implemented
	}

	GlobalDebugger.prototype.info = function(w) {
		var note = new Note('Browser Infomation');
		note.info = "GlobalDebugger "+GlobalDebugger.version;
		note.variable = GlobalDebugger.browser;
		var xhr = new XMLHttpRequest();
		if(xhr) 
			note.variable['XHR 2 Support'] = {
				'upload': 'upload' in xhr,
				'onload': 'onload' in xhr,
				'onabort': 'onabort' in xhr,
				'onerror': 'onerror' in xhr,
				'onprogress': 'onprogress' in xhr,
				'onloadend': 'onloadend' in xhr
			};
		else note.variable.xhrsupport = 'none';
		note.variable['W3C Event Support'] = {
			'addEventListener': window.addEventListener ? true : false
		};
		note.variable['Class Attribute Manipulation Support'] = {
			'classList': document.documentElement.classList ? true : false,
			'getElementsByClassName': document.documentElement.getElementsByClassName ? true : false
		};
		note.variable['General HTML5 Support'] = {
			'FormData': window.FormData ? true : false
		};
		note.variable['XML Parsing Support'] = {
			'DOMParser': 'DOMParser' in window ? true : false,
			'XMLSerializer': typeof XMLSerializer!==undefined ? true : false
		};
		var elm = document.createElement('div');
		note.variable['Element Support'] = {
			'textContent Property': elm.textContent!==undefined ? true : false,
			'innerText Property': elm.innerText!==undefined ? true : false,
			'innerHTML Property': elm.innerHTML!==undefined ? true : false,
			'outerHTML Property': elm.outerHTML!==undefined ? true : false
		}
		note.publish(this.console);
	}

})();

var debug = new GlobalDebugger();
/* Short hand functions for use on devel 
function msg() {return debug.note.apply(debug,arguments);}
function dmp() {return debug.dump.apply(debug,arguments);}
function opn(o) {return dmp(debug.see()[o])}
*/
/*
//DEBUG 1
var date = new Date();
var t1 = date.getSeconds() + (date.getMilliseconds()/1000);

//DEBUG2
date = new Date();
var t2 = date.getSeconds() + (date.getMilliseconds()/1000);
document.title = t2 - t1;
*/