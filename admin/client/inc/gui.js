/**
 * @brief : Graphic User Interface builder
 *          Abstract class for GUI Objects, instances of this class
 *          constructs object tree of whole application
 *
 * @date  : 25.3.2006 16:36:27
 * @status: in development
 *
 * - load page
 * - load css
 * - load js
 * - create container??
 * - load template
 * - exe template
 * - PRINT as invisible
 * - exe JS
 *
 * gui.__focus = boolen; window focus
 *
 * DODELAT
 *   - zmena xml structury: zrusit onload/extension|function a pridat root/extend + root/onload
 *
 */

_me = cObject.prototype;
function cObject(sName,sType,oParent){

	// PUBLIC
	this._name		= sName;
	this._type		= sType || 'document';
	this._parent	= oParent;
	this._pathName	= this.__genPathName();
	this._destructed = false;

	if (!sType && !oParent){

		this._main = mkElement('div',{id:sName});
		// this._main.style.width = "100%";
		// this._main.style.height = "100%";
		// this._main.style.overflow = "hidden";
		document.getElementsByTagName('body')[0].appendChild(this._main);

		this.__X = 0;
		this.__Y = 0;

		this.__UNIQ = unique_id();

		var me = this;

		// Ctrl+F11 Fullscreen
		AttachEvent(document, "onkeydown", function(e) {
		  if ((e.ctrlKey || e.metaKey) && e.keyCode == 122) 
			if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement) {
				if (document.documentElement.requestFullscreen) {
					document.documentElement.requestFullscreen();
				} else if (document.documentElement.mozRequestFullScreen) {
					document.documentElement.mozRequestFullScreen();
				} else if (document.documentElement.webkitRequestFullscreen) {
					document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
				}
			} else {
				if (document.cancelFullScreen) {
					document.cancelFullScreen();
				} else if (document.mozCancelFullScreen) {
					document.mozCancelFullScreen();
				} else if (document.webkitCancelFullScreen) {
					document.webkitCancelFullScreen();
				}
			}	 
		});

		//DOCUMENT EVENT Handlers
		function evn (e){
			var e = e || window.event;
			me.__exeEvent(e.type,e);
		};

		window.onresize = function(e){
			evn(e);
		};
		
		//changed from document to window, for chrome
		this.__focus = true;
		window.onfocus = function(e){
			me.__focus = true;
			evn(e);
		};
		window.onblur = function(e){
			me.__focus = false;
			evn(e);
		};

		//window.navigator && window.navigator.onLine === false

		this.__online = true;
		document.body.ononline = function(e){
			me.__online = true;
			evn(e);
		};
		document.body.onoffline  = function(e){
			me.__online = false;
			evn(e);
		};

		document.onclick = function(e){
			//Chrome fix...
			if (!me.__focus)
				me.__focus = true;

			evn(e);
		};
		document.onmousedown = evn;
		document.onmouseup = function(e){
			//Chrome fix...
			if (!me.__focus)
				me.__focus = true;

			evn(e);
		};

		//WheelSpin
	    var wheel = function(e){
			    var e = e || window.event;
				evn({type:'mousewheel', delta:Is.Defined(e.detail)? e.detail : e.wheelDelta/-120});
			};

		AttachEvent(document, "onmousewheel", wheel);

		document.onmousemove = function(e){
			var e = e || window.event;

			me.__X = e.clientX;
			me.__Y = e.clientY;

			evn(e);
		};
		document.onkeydown = function (e){
			var e = e || window.event;
				evn(e);

			//stops F5 (refresh) propagation to browser
			//it caused unwanted refresh(es) because of placement in NB keyboard
			//stops Esc because it cancel actual open http connection
			if (/*e.keyCode == 116 || */e.keyCode == 27){
				e.cancelBubble = true;
				try{e.preventDefault();}catch(r){}
				try{e.stopPropagation();}catch(r){}
				return false;
			}
			else
			//Ctrl+F11 for Full Screen Mode
			if (e.keyCode == 122 && (e.ctrlKey || e.metaKey)){
				if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement) {
					if (document.documentElement.requestFullscreen)
						document.documentElement.requestFullscreen();
					else
					if (document.documentElement.mozRequestFullScreen)
						document.documentElement.mozRequestFullScreen();
					else
					if (document.documentElement.webkitRequestFullscreen)
						document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
				}
				else
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
		document.onkeyup = function (e){
			var e = e || window.event;
				evn(e);

			//stops Esc because it cancel actual open http connection
			if (e.keyCode == 27){
				e.cancelBubble = true;
				try{e.preventDefault();}catch(r){}
				try{e.stopPropagation();}catch(r){}
				return false;
			}
		};

		this.__loading_counter = 0; //loading counter
		this._loading = function(b){
			if (this.__loading_obj){
				if (b)
					this.__loading_counter++;
				else
				if (this.__loading_counter>0)
					this.__loading_counter--;

				try{
					this.__loading_obj._loading(this.__loading_counter);
				}
				catch(r){}
			}
			else
				this.__loading_counter = 0;
		};

		//MSIE page scrolling fix
		if (currentBrowser().indexOf('MSIE')===0)
			setInterval(function(){
				if (me._main.scrollTop>0)
					me._main.scrollTop = 0;
			},1000);
	}

	// for main gui obj. only
	this._anchors  = {'main':''};
	this._template = '';

	// PRIVATE
	/* destructors */
	this._destructors = {};		// array of destructor methods           Predelat na PROTECTED!!

	/* events handlers */
	this._events = {};

	/* dataSet properties */
	this._listener;				// dataset listener
	this._listenerPath;			// Array - dataset listener path (optional)

	/* saving properties */
	this._saver = null;			// dataset for storage obj value
	this._saverPath = null;		// Array - dataset path for storage obj value (optional)
	this._skipsaving = false;	// do not save obj. value at all
	this._noupdate = false;		// update dataset after _saveme()

	/* update or refresh */
	this._norefresh = false;	// in update, fill methods
	this._updateBuffer = false;	// True if there was any update during "norefresh" state
};

/**
 * create object structure
 * !! if object is unique than existing instance is destroyed. May be Attr destroy=true for <unigue>...
 */
_me._create = function (sName,sType,sTarget,sClass,aData){

	// load object XML descriptor from storage cache
	var aObj  = storage.object(sType);

	// check parent type for allowed type
	if (aObj['PARENTS']){
		var er = true;
		for (var i in aObj['PARENTS'][0]['OBJ'])
			if (this._type == aObj['PARENTS'][0]['OBJ'][i]['VALUE']){
				er = false;
				break;
			}

		if (er){
			throw new Error("gui._create() -  OBJ "+ sType +"\n disallowed parent "+ this._type);
			return false;
		}
	}

	// create name for new cObject instnce
	if (aObj['UNIQUE'] && typeof(aObj['UNIQUE'][0]['VALUE']) != 'undefined'){
		if (typeof this[sName]!='undefined'){
			if (aObj['UNIQUE'][0]['VALUE'] == 'keep')
				return this[sName];
			else
				this[sName]._destruct();
		}	
	}
	else{
		//generate name
		var sApx = '';
		for(var i=0;;i++){
			if (typeof this[sName+sApx] == 'undefined'){
				sName = sName+sApx;
				break;
			}
			sApx = "_"+i;
		}
		sApx = null;
	}

	// create _main htmlobj in parent's anchor
	sTarget = sTarget || 'main';

	// create clone of cObject class
	this[sName] = new cObject(sName,sType,this);
	
	this[sName]['__attributes']=(aData&&aData.__attributes?aData.__attributes:{});

	// add anchors pointes (as text representations)
	if (aObj['ANCHORS'] && typeof(aObj['ANCHORS'][0]['ELM']) != 'undefined'){
		var sAnchor = '',aAnchors = {};
		for (var i in aObj['ANCHORS'][0]['ELM']){
			sAnchor = aObj['ANCHORS'][0]['ELM'][i]['VALUE'];
			aAnchors[sAnchor] = this._pathName + "." + sName + "#" + sAnchor;
		}
		this[sName]['_anchors'] = aAnchors;
	}

	this[sName]['_anchor'] = sTarget;


	// TYPE
	var chld;
	switch(aObj['TYPE']?aObj['TYPE'][0]['VALUE']:''){
	case 'none':
		break;
	case 'inline':
		chld = mkElement('span');
		break;
	case 'tr':
		chld = mkElement('tr');
		break;
	case 'td':
		chld = mkElement('td');
		break;
	case 'form'	:
		chld = mkElement('form');
		chld.onsubmit = function(){return false;}
		chld.name = this[sName]._pathName;
		/*
		chld.style.margin = 0;
		chld.style.padding = 0;
		*/
		
		break;
	default:
		chld = mkElement('div');
	}

	if (chld){
		chld.id = this[sName]._pathName;

		//must be before className because of MSIE 6 slowdown
		var main;
		if (!(main = this._getAnchor(sTarget)))
			throw 'Anchor "'+ sTarget +'" doesn\'t exist in "'+ this._type +'" object';

		main.appendChild(chld);
		
		// check scroll top attribute
		if(main.getAttribute('scrollTop') && main.getAttribute('scrolltop')=='onobjectappend'){
			if(main.scrollTop){
				main.scrollTop=0;
			}
		}
		
		// clean
		main = null;

		// Container's CSS can be set as name attr. of <object> tag "<type>" is always used as class descriptor
		this[sName]['_allcss'] = chld.className = (aObj['ATTRIBUTES'] && aObj['ATTRIBUTES']['CSS']?aObj['ATTRIBUTES']['CSS']+' ':'') + sType + (sClass?' '+sClass:'');
		this[sName]['_main'] = chld;
		chld = null;
		
		/* use IW attributes */
		if(this[sName]['__attributes']){
			for(var key in this[sName]['__attributes']){
				if(
					key.substr(0,3)=='iw-' ||
					key == 'style'
				){
					this[sName]['_main'].setAttribute(key,this[sName]['__attributes'][key]);
				}
			}
		}
		/* */
	}

	this[sName]['_css'] = sClass;

	/* Prepare Arguments for __construcor */
	var aArg = [];
	for (var i = 4;i<arguments.length;i++)
		aArg.push(arguments[i]);

	// inherit defined methods from extensions and execute their __constructor methods for BEFORE
	if (aObj['BEFORE']){
		var sobj;
		for (var i in aObj['BEFORE']){
			if (aObj['BEFORE'][i]['ATTRIBUTES'] && aObj['BEFORE'][i]['ATTRIBUTES']['CLASS'])
				sobj = aObj['BEFORE'][i]['ATTRIBUTES']['CLASS'];
			else
				sobj = aObj['BEFORE'][i]['VALUE'];

			if (typeof window[sobj] == 'function'){
				inherits(this[sName],window[sobj]);
				
				// do not create object if before.__constructor returns FALSE!
				if (window[sobj].prototype.__constructor && this[sName].__constructor.apply(this[sName],aArg) === false)
					return false;
			}
		}
	}

	// add template name (just template name from XML)
	if (aObj['TEMPLATE'] && typeof aObj['TEMPLATE'][0]['VALUE'] != 'undefined'){

		this[sName]['_template'] = aObj['TEMPLATE'][0]['VALUE'];

		// DRAW
		if (Is.Defined(this._parent) && Is.Defined(this._parent._aTemplateData))
			this[sName]._draw(null,null,this._parent._aTemplateData);
		else
		if (Is.Defined(this._aTemplateData))
			this[sName]._draw(null,null,this._aTemplateData);
		else
			this[sName]._draw();
	}

	/* add destructors
	may be created before obj. inicialization...!? */
	if (aObj['ONUNLOAD'])
		for (var i in aObj['ONUNLOAD'])
			this[sName]._add_destructor(aObj['ONUNLOAD'][i]['VALUE'],aObj['ONUNLOAD'][i]['ATTRIBUTES']);

	 // inherit defined methods from extensions and execute their __constructor methods for LIRBARY
	if (aObj['LIBRARY']){
		var sobj;
		for (var i in aObj['LIBRARY']){

			if (this[sName] && this[sName]._destructed) return;

			if (aObj['LIBRARY'][i]['ATTRIBUTES'] && aObj['LIBRARY'][i]['ATTRIBUTES']['CLASS'])
				sobj = aObj['LIBRARY'][i]['ATTRIBUTES']['CLASS'];
			else
				sobj = aObj['LIBRARY'][i]['VALUE'];

			if (typeof window[sobj] == 'function'){
				inherits(this[sName],window[sobj]);
				if (window[sobj].prototype.__constructor)
					this[sName].__constructor.apply(this[sName],aArg);
			}
		}
	}
	
	// Object was fully constructed
	if (this[sName] && this[sName]._finished)
		this[sName]._finished();

	//Call oncreate Event
	if (this.__onCreateChild)
		this.__onCreateChild(sName,sType,sTarget,sClass);

	return this[sName];
};


/**
* @brief: obj path generator, path is used for HTML elm ID and is passed into template as {_ins}
* @scope: PRIVATE
* @date : 1.5.2006 17:53:31
**/
_me.__genPathName = function(){
	var sPN = this._name;
	if (this._parent && this._parent._pathName)
		sPN =  this._parent._pathName + '.' + sPN;   // jeste ui anchoru
	return sPN;
};


	 /**
	  * @param: sTmpName  - optional, name of template
	  * 	    Anchor    - optional, can by string or directly DOM element
	  **/
	_me._draw = function (sTmpName,sTarget,aData,append){
		if (typeof aData != 'object')
			aData = {_ins:this._pathName};
		else
			aData._ins = this._pathName;
			
		if (GWOthers)
			aData._skin = 'client/skins/'+GWOthers.getItem('LAYOUT_SETTINGS', 'skin');

		/* retrieve template */
		var sHtml = template.tmp((sTmpName?sTmpName:this._template),aData);

		/* parse <OBJ>
		   <obj> can be parsed from gui objects only because of _ins var requirement */
		var id,obj = [],tmpObj = [],MSIE,xTpl;
		
		if (sHtml.indexOf('<obj ')>-1/* || sHtml.indexOf('<anchor ')>-1*/){

			// MSIE 6-8 works as XML
			if (typeof ActiveXObject !='undefined' && currentBrowser()=='MSIE7'){
				MSIE = true;
				xTpl = XMLTools.Str2XML('<root>'+ sHtml.replace(/\&/g,'&amp;') +'</root>');
			}
			// Others as XHTML
			else{
				MSIE = false;
				xTpl = mkElement('backquote');

				//Safari title tag hack
				if ((currentBrowser()=='Safari' || currentBrowser()=='Chrome') && sHtml.indexOf('<title')>-1)
					sHtml = sHtml.replace(/\<title/ig,'<safari_title').replace(/\<\/title/ig,'</safari_title');

				xTpl.innerHTML = sHtml;
			}
/*
			//ANCHORS
			var aList = xTpl.getElementsByTagName("anchor");
			if (aList.length)
				for (var i = aList.length-1; i>=0; i--){
					aList[i].parentNode.setAttribute('id', this._pathName + aList[i].attributes.item(i).nodeName);
					aList[i].parentNode.removeChild(aList[i]);
				}
*/
			//OBJECTS
			var aList = xTpl.getElementsByTagName("obj");
			if (aList.length){

				//if (MSIE && !aList.length) throw "Syntax error in template: "+(sTmpName?sTmpName:this._template);

				var ep,etmp,etmptag,sType,sName,sCSS,sWidth,sHeight,iTabindex,sTabContainer,oid = 0;

					/* PRIVATE, <ITEM> -> Array parser
					   @param: etmp - parent dom element */

					function parseitem(etmp){
						var etmp2,key,n = etmp.getElementsByTagName("item"),
							out1 = [], out2 = {};

						if (!n.length){
							n = null;
							return etmp.textContent || (typeof etmp.text == 'string'?etmp.text.unescapeHTML():null);
						}
						
						for (var i = 0,l = n.length; i < l ;i++)
							if  ((key = n[i].getAttribute('key')))
								out2[key] = parseitem(n[i]);
							else
								out1.push(parseitem(n[i]));

						n = null;

						return Is.Empty(out2)?out1:out2;
					};

				var prevObj = [];
				for (var i =0; i < aList.length; i++){

					ep = aList[i].parentNode;
					sType = aList[i].getAttribute('type');
					sName = aList[i].getAttribute('name');

					if (!sName || !sType) continue;

					// nasted <obj>
					if (ep.tagName.toLowerCase() == 'obj')
						sAnchor = aList[i].getAttribute('anchor') || 'main';
					else{
						// set id to parent HTML elm. & create anchor in parent gui object
						if ((id = ep.getAttribute('id'))){
							sAnchor = inArray(this._anchors,id);
							if (sAnchor == -1){
								do{sAnchor = Math.rand();}while(this._anchors[sAnchor]);
								this._anchors[sAnchor] = id;
							}
						}
						else{
							do{sAnchor = Math.rand();}while(this._anchors[sAnchor]);
							this._anchors[sAnchor] = (this._pathName || '') + "#" + sAnchor;
							ep.setAttribute('id',this._anchors[sAnchor]);
						}
					}

					// CREATE OBJ FOR ARRAY
					tmpObj = {"type":sType,"name":sName,"anchor":sAnchor};

					// all attributes
					tmpObj['attr']={};
					if(aList[i].attributes){
						Array.prototype.slice.call(aList[i].attributes).forEach(function(item) {
							tmpObj['attr'][item.name]=item.value;
						});
					}
					//

					if ((sCSS = aList[i].getAttribute('css'))) tmpObj['css'] = sCSS;
					if ((sWidth = aList[i].getAttribute('width'))) tmpObj['width'] = sWidth;
					if ((sHeight = aList[i].getAttribute('height'))) tmpObj['height'] = sHeight;

					if ((iTabindex = aList[i].getAttribute('tabindex'))) tmpObj['tabindex'] = iTabindex;
					if ((sTabContainer = aList[i].getAttribute('tabcontainer'))) tmpObj['tabcontainer'] = sTabContainer;

					if (aList[i].getAttribute('focus')) tmpObj['focus'] = true;
					if (aList[i].getAttribute('ondemand')) tmpObj['ondemand'] = true;

					// PARSE OBJECT'S PROPERTIES
					for (var nlen = aList[i].childNodes.length -1; nlen>=0;nlen--){

						etmp = aList[i].childNodes[nlen];
						if ((etmptag = etmp.tagName?etmp.tagName.toLowerCase():''))	
							switch (etmptag){
							case 'readonly':
								var tval = etmp.textContent || (typeof etmp.text == 'string'?etmp.text.unescapeHTML():'');
								if (tval && (tval!='false' || tval!='0'))
									tmpObj[etmptag] = true;
							break;
							case 'disabled':
								var tval = etmp.textContent || (typeof etmp.text == 'string'?etmp.text.unescapeHTML():'');
								if (tval && (tval!='false' || tval!='0'))
								{
									if(tval=='true' || tval=='disabled' || tval=='1'){
										tmpObj[etmptag] = true;
									}else{
										tmpObj[etmptag] = tval.replace(/,/gi,';').split(';');
									}
								}
								else
								{
									tmpObj[etmptag] = false;
								}
								/*
								var tval = etmp.textContent || (typeof etmp.text == 'string'?etmp.text.unescapeHTML():'');
								if (tval && (tval!='false' || tval!='0'))
									tmpObj[etmptag] = true;
								*/
							break;

							case 'draw' :
								tmpObj['draw'] = [etmp.getAttribute('form'),etmp.getAttribute('anchor') || 'main',parseitem (etmp)];
								break;


							case 'safari_title': //safari is removing <title> tag
								etmptag = 'title';
							case 'enabled':
							case 'restrictions':
							case 'init' :
							case 'fill' :
							case 'filllang' :
							case 'value':
							case 'src':
							case 'title':
							case 'text' :
							case 'class' :
							case 'placeholder':
							case 'placeholderplain':
							case 'baseunit':
							case 'maxunit':
							case 'label' :
							case 'toggle' :
							case 'enables':
								tmpObj[etmptag] = parseitem (etmp);
								break;
							}
					}
					etmp = null;

					// APPEND OBJ INTO ARRAY
					if (ep.tagName.toLowerCase() == 'obj'){

						// child
						for (var iLPos = aList.length-1;iLPos>=0;iLPos--)
							if (aList[iLPos]===ep) break;

						if (prevObj[iLPos]['objects'])
							prevObj[iLPos]['objects'].push(tmpObj);
						else
							prevObj[iLPos]['objects'] = [tmpObj];
					}
					else
						obj[++oid] = tmpObj;

					prevObj.push(tmpObj);
					tmpObj = null;
				}
				prevObj = null;

				// REMOVE <OBJ> ELEMENTS FROM TEMPLATE (faster way)
				for(var j = aList.length-1; j>=0;j--){
					var oTextNode = aList[0].ownerDocument.createTextNode("");
					//aList[j].parentNode.replaceChild(oTextNode,aList[j]);
					aList[j].parentNode.appendChild(oTextNode);
					aList[j].parentNode.removeChild(aList[j]);
					oTextNode = null;
				}
			}	

			if (MSIE){
				sHtml = XMLTools.XML2Str(xTpl).replace(/\&amp;/g,'&');
				sHtml = sHtml.substring(6,sHtml.lastIndexOf('</root>'));
			}
			else
				sHtml = xTpl.innerHTML;

			ep = null; // xTplDoc = null;

			xTpl = null;
		}
		else
			var sAnchor = sTarget;

		/* inner template into page */
		var child=false;
		var wrapper=false;

		if(!append)
		{
			if (sTmpName && sAnchor)
			{
				this._getAnchor(sTarget).innerHTML = sHtml;
				wrapper=this._getAnchor(sTarget);
			}
			else
			{
				this._main.innerHTML = sHtml;
				wrapper=this._main.innerHTML;
			}
		}
		else
		{
			var e = document.createElement('div');
			e.innerHTML = helper.trim(sHtml);
			
			if(e.firstChild){
				wrapper=e.firstChild;
			}
			
			while(e.firstChild) {
				if (sTmpName && sAnchor)
					child=this._getAnchor(sTarget).appendChild(e.firstChild);
				else
					child=this._main.innerHTML.appendChild(e.firstChild);
			}
		}

		/* add GUI objects from template */
		delete aData['_ins'];

		if (Is.Empty(aData))
			this.__addObjects(obj);
		else
			this.__addObjects(obj,null,aData);
			
		if (this.__onCreateChild)
			this.__onCreateChild('','',sTarget);
			
		return wrapper;
	};


_me.__addObjects = function(obj,str,aData){
	var newObj,aInit,oParent = str?eval(str):this;

	if (aData)
		this._aTemplateData = aData;

	for (var i in obj){

		aInit = [obj[i]["name"],obj[i]["type"],obj[i]["anchor"],obj[i]['css'],{
			__attributes:(obj[i].attr?obj[i].attr:{})
		}];

		// <init> tag
		if (obj[i]['init']){
			//pole
			if (typeof obj[i]['init'] == 'object'){
				for (var j in obj[i]['init'])
					aInit.push(obj[i]['init'][j]);
			}
			//string
			else
				aInit.push(obj[i]['init']);
		}

		if (this._aTemplateData && oParent)
			oParent._aTemplateData = aData;

		newObj = oParent._create.apply(oParent,aInit);

		// _title
		if (obj[i]['title'] && Is.Function(newObj._title))
			newObj._title(obj[i]['title']);

		// _text
		if (obj[i]['text'] && Is.Function(newObj._text))
			newObj._text(obj[i]['text']);

		// _fill
		if (obj[i]['fill'] && Is.Function(newObj._fill))
			newObj._fill(obj[i]['fill']);

		// _fillLang
		if (obj[i]['filllang'] && Is.Function(newObj._fillLang))
			newObj._fillLang(obj[i]['filllang']);

		// _value
		if (obj[i]['value'] && Is.Function(newObj._value))
			newObj._value(obj[i]['value']);
		
		// _src
		if (obj[i]['src'] && Is.Function(newObj._src))
			newObj._src(obj[i]['src']);

		// READONLY
		if (obj[i]['readonly'] && Is.Function(newObj._readonly))
			newObj._readonly(obj[i]['readonly']);
			
		// toggle
		if (obj[i]['toggle'] && Is.Function(newObj._toggle))
			newObj._toggle(obj[i]['toggle']);

		// enables - toggle objects can enable other anchors
		if (obj[i]['enables'] && Is.Function(newObj._enables))
			newObj._enables(obj[i]['enables']);

		// DISABLED
		if (obj[i]['disabled'] && Is.Function(newObj._disabled))
			newObj._disabled(obj[i]['disabled']);
		
		// ENABLED
		if (obj[i]['enabled'] && Is.Function(newObj._disabled)){
			if(obj[i]['enabled']===false || obj[i]['enabled']=='0' || obj[i]['enabled']=='disabled'){
				newObj._disabled(true);
			}else{
				newObj._disabled(obj[i]['enabled'].replace(/,/gi,';').split(';'));
				newObj._disabled(false);
			}
		}
		
		// PLACEHOLDER
		if (obj[i]['placeholder'] && Is.Function(newObj._placeholder))
			newObj._placeholder(obj[i]['placeholder']);
		
		if (obj[i]['placeholderplain'] && Is.Function(newObj._placeholder)) {
			newObj._placeholder(obj[i]['placeholderplain'], true);
		}

		// Base Unit for Byte inputs
		if (obj[i]['baseunit'] && Is.Function(newObj._baseunit))
			newObj._baseunit(obj[i]['baseunit']);

		// Max Unit for Byte inputs
		if (obj[i]['maxunit'] && Is.Function(newObj._maxunit))
			newObj._maxunit(obj[i]['maxunit']);
	
		// LABEL
		if (obj[i]['label'] && Is.Function(newObj._label))
			newObj._label(obj[i]['label']);
			
		// CLASS
		if (obj[i]['class'] && Is.Function(newObj._class))
			newObj._class(obj[i]['class']);
			
		// TABINDEX
		if (obj[i]['tabindex'] && Is.Function(newObj._tabIndex))
			newObj._tabIndex(obj[i]['tabcontainer'],obj[i]['tabindex'] == 'true'?undefined:parseInt(obj[i]['tabindex'],10));

		// FOCUS
		if (obj[i]['focus'] && Is.Function(newObj._focus))
			newObj._focus(obj[i]['focus']);
			
		// WIDTH & HEIGHT
		if ((obj[i]['width'] || obj[i]['height']) && Is.Function(newObj._size))
			newObj._size(obj[i]['width'],obj[i]['height']);

		// RESTRICTIONS
		if ((obj[i]['restrictions']) && Is.Function(newObj._restrict)){

			var atmp = [];

			if (typeof obj[i]['restrictions'] == 'object'){
				for(var j in obj[i]['restrictions'])
					atmp.push(obj[i]['restrictions'][j],j);
			}
			else
			if (typeof obj[i]['restrictions'] == 'string')
				atmp.push(obj[i]['restrictions']);

			try{
				if (atmp.length)
					newObj._restrict.apply(newObj,atmp);
			}
			catch(er){
				throw "invalid input array for restrictions in:\n"+oParent._pathName+'.'+obj[i]["name"];
			}
		}

		// _draw
		if (obj[i]['draw'] && Is.Function(newObj._draw))
			if (typeof newObj.__drawTpl != 'undefined' && !newObj._isActive && obj[i]['ondemand']) {
				newObj.__drawTpl = obj[i]['draw'];
				newObj.__drawData = aData;
			}
			else{
				aData = arrConcat(aData,obj[i]['draw'][2]);
				newObj._draw(obj[i]['draw'][0],obj[i]['draw'][1],aData);
				if (newObj._isActive && newObj._active) newObj._active(true);
			}


		// nasted objects
		if (obj[i]['objects'] && obj[i]['objects'].length)
			if (typeof newObj.__drawObj != 'undefined' && !newObj._isActive && obj[i]['ondemand']) {
				newObj.__drawObj = obj[i]['objects'];
				newObj.__drawData = aData;
			}
			else{
				this.__addObjects(obj[i]['objects'],newObj._pathName,aData);
				if (newObj._isActive && newObj._active) newObj._active(true);
			}
	}
};

/**
 *
 * @param:	sType	- event type
 * 			oEvn	- [object,"method",['arg1','arg2',...]]
 *
 *			info	- internal privat scope pourpose
 **/
_me._obeyEvent = function(sType, oEvn, info){

	//check if already doesnt exist
	if (this._events[sType])
		this._disobeyEvent(sType, oEvn);
	else
		this._events[sType] = {};

	var id = unique_id();
	this._events[sType][id] = [oEvn, info];

	return id;
};

_me._disobeyEvent = function(sType, oEvn){

	var obj = getCallbackFunction(oEvn, true);
	
	if (Is.Function(obj)){

		if (!this._events[sType]) 
			return true;

		for (var i in this._events[sType]){
			if (this._events[sType][i]){
				var oEvn_old = this._events[sType][i][0];

				if ((Is.Function(oEvn_old[0]) && Is.Function(oEvn[0]) && oEvn_old[0] === oEvn[0]) || 
					(Is.Function(oEvn_old[1]) && Is.Function(oEvn[1]) && oEvn_old[0] === oEvn[0] && oEvn_old[1] === oEvn[1]) || 
					(oEvn_old[0]._pathName == oEvn[0]._pathName && obj === getCallbackFunction(oEvn_old, true)))
				{
					delete this._events[sType][i];
					return true;
				}	
			}
		}
	}	

	return false;
};

_me.__exeEvent = function(sType,e,arg){

	if (this._events[sType])
		for (var j in this._events[sType])
			try{
				if (typeof this._events[sType][j] == 'undefined' || !Is.Object(this._events[sType][j][0]) || executeCallbackFunction(this._events[sType][j][0], e, arg) === false)
					delete this._events[sType][j];
			}
			catch(r){

				//debug
				if (gui._REQUEST_VARS['frm'] && console && console.log)
					console.log('exeEvent',r);

				delete this._events[sType][j];
			}	
};


/**
 * @brief : return Array of child objects
 * @param : sAnchor - optional, return childs from this anchor only
 *          sType   - optional, return objects with given type
 * @output: Array of child objects
 * @date  : 30.6.2006 13:39:41
 **/
_me._getChildObjects = function(sAnchor,sType){
	var aOut = [];
	for (var i in this)
		if (i.indexOf('_') != 0 && this[i]/* && this[i]._parent == this*/)
			if ((!sAnchor || this[i]._anchor == sAnchor) && (!sType || this[i]._type == sType))
				aOut.push(this[i]);

	return aOut;
};


/**
 * @brief: destruct all child objects
 * @param: sAnchor
 **/
_me._clean = function(sAnchor,sType){
	var aObj = this._getChildObjects(sAnchor,sType);
	for (var i in aObj)
		aObj[i]._destruct();

	return true;
};

_me._getAnchor = function(sAnchor){
	if (this._anchors[sAnchor])
		return document.getElementById(this._anchors[sAnchor]);
	else
	if (sAnchor == 'main')
		return this._main;
	else
		var elm=document.getElementById(this._pathName + (sAnchor?'#' + sAnchor:''));
		if(!elm){console.log('anchor "'+sAnchor+'" not found');}
		return elm;
};

/**
 * obey on given dataset object
 */
_me._listen = function(sDataSet,aDataPath,bNoUpdate){
	this._listener = sDataSet;
	if (typeof aDataPath == 'object') this._listenerPath = aDataPath;
	dataSet.obey(this,'_listener',sDataSet,bNoUpdate);
};


_me._save = function(sDataSet,aDataPath){
	this._saver = sDataSet;
	if (typeof aDataPath == 'object') this._saverPath = aDataPath;
		dataSet.obey(this,'_saver',sDataSet);
};


_me._saveme = function (noupd){
	if (this._skipsaving) return '';
	if (this._noupdate) noupd = this._noupdate;

	if (this._saver){
		dataSet.add(this._saver, this._saverPath, this._value(), noupd, this._pathName);
		return this._saver;
	}
	else
	if (this._listener){
		dataSet.add(this._listener, this._listenerPath, this._value(), noupd, this._pathName);
		return this._listener;
	}
};


_me._add_destructor = function (sMethod,aProperties){
	if(typeof sMethod == 'undefined') return false;
	if(typeof sMethod == 'function'){
		this._destructors['function_'+aProperties] = sMethod;
	}else{
		this._destructors[sMethod] = aProperties;
	}
};


_me._remove_destructor = function (sMethod,fName){
	if(fName){
		delete this._destructors['function_'+fName];
	}else{
		delete this._destructors[sMethod];
	}
};


/**
 * @breif: destruct object
 * @date : 30.6.2006 13:58:51
 **/
_me._destruct = function(){

	if (this._destructed) return;
	this._destructed = true;

	// try to destruct already destructed object
	if (!this._parent[this._name]) return false;

	/*
	1. STEP
	execute all destructors
	useful for _saveall method etc.
	*/

	for (var val in this._destructors){
		if(typeof this._destructors[val] == 'function'){
			this._destructors[val]();
		}
		if (Is.Function(this[val])){
			this[val].apply(this, Is.Array(this._destructors[val])?this._destructors[val]:arguments);
		}
	}

	/*
	 2. STEP
	 excecute destructors of all childs
	*/
	for (var i in this){
		if (i.indexOf('_')==0 || typeof this[i] != 'object' || this[i]==null || typeof this[i]._destruct != 'function') continue;
		this[i]._destruct();
		delete this[i];
	}

	// remove listeners
	if (this._listener)
		dataSet.disobey(this);
	if (this._listener_data)
		dataSet.disobey(this,'_listener_data');

	this._main && this._main.parentNode && this._main.parentNode.removeChild(this._main);

	// remove instance
	this._parent[this._name] = null;
	delete this._parent[this._name];
	
	if (this._parent.__onDestroyChild)
		this._parent.__onDestroyChild(this._name,this._type,this._anchor);
};
