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
 */

/*

	!! NEVER ADD OBJECT SPECIFIC CODE IN TO MASTER OBJECT !!

*/

function Gui(sName,sType,oParent){

	// PUBLIC
	this._name		= sName;
	this._type		= sType || 'document';
	this._parent	= oParent;
	this._pathName	= (this._parent && this._parent._pathName)?this._parent._pathName + '.' + sName:sName;
	this._destructed = false;

	// for main gui obj. only
	this._anchors  = {'main':''};
	this._template = '';

	// destructors
	this._destructors = {};		// array of destructor methods

	// events handlers
	this._events = {};

	// dataSet properties
	this._listener;				// dataset listener
	this._listenerPath;			// Array - dataset listener path (optional)

	// saving properties
	this._saver = null;			// dataset for storage obj value
	this._saverPath = null;		// Array - dataset path for storage obj value (optional)
	this._skipsaving = false;	// do not save obj. value at all
	this._noupdate = false;		// update dataset after _saveme()

	// update or refresh
	this._norefresh = false;	// in update, fill methods
	this._updateBuffer = false;	// True if there was any update during "norefresh" state

	//Call __root for main gui wrapper init
	if (!sType && !oParent)
		Gui.__root.call(this);
};

/**
 * create object structure
 * !! if object is unique than existing instance is destroyed. May be Attr destroy=true for <unigue>...
 *
 *		@target: 	can be string or object	{target:<string>, first:<bool>}
 */
Gui.prototype._create = function (sName,sType,target,sClass){

	//Do not create child objects in destructed or removed object
	if (this._destructed || (this._main && !this._main.parentNode))
		return false;

	// load object XML descriptor from storage cache
	var sTarget, aObj = storage.object(sType);

	// check parent type for allowed type
	if (aObj.PARENTS){
		var er = true;
		for (var i in aObj.PARENTS[0].OBJ)
			if (this._type == aObj.PARENTS[0].OBJ[i].VALUE){
				er = false;
				break;
			}

		if (er)
			throw new Error("gui._create() -  OBJ "+ sType +"\n disallowed parent "+ this._type);
	}

	// create name for new Gui instnce
	if (aObj.UNIQUE){
		if (typeof this[sName]!='undefined'){
			if (aObj.UNIQUE[0].VALUE == 'keep')
				return this[sName];
			else
				this[sName]._destruct();
		}
	}
	else{
		//generate name
		var sApx = '';
		for(var i=0;;i++){
			if (this[sName+sApx] === undefined){
				sName += sApx;
				break;
			}
			sApx = "_"+i;
		}
		sApx = null;
	}

	// create _main htmlobj in parent's anchor
	if (Is.Object(target))
		sTarget = target.target || 'main';
	else
	if (Is.Defined(target) && (target = target.toString()).length)
		sTarget = target;
	else
		sTarget = 'main';

	// create instance of Gui
	this[sName] = new Gui(sName,sType,this);

	// add anchors pointers (as text representations)
	if (aObj.ANCHORS && typeof(aObj.ANCHORS[0].ELM) != 'undefined'){
		var sAnchor = '', aAnchors = {};
		for (var i in aObj.ANCHORS[0].ELM){
			if ((sAnchor = aObj.ANCHORS[0].ELM[i].VALUE))
				aAnchors[sAnchor] = this._pathName + "." + sName + "#" + sAnchor;
		}
		this[sName]._anchors = aAnchors;
	}

	this[sName]._anchor = sTarget;

	// create wrapper HTML element
	var chld = false;
	switch(aObj.TYPE?aObj.TYPE[0].VALUE:''){
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
		chld.onsubmit = function(){return false};
		chld.name = this[sName]._pathName;
		break;
	default:
		chld = mkElement('div');
	}

	if (chld){

		//must be before className because of MSIE 6 slowdown
		var main;
		if (!(main = this._getAnchor(sTarget)))
			throw 'Anchor "'+ sTarget +'" doesn\'t exists in "'+ this._type +'" object';

		chld.setAttribute('id', this[sName]._pathName);

		// when target = {first:true}
		if (Is.Object(target) && target.first && main.firstChild)
			main.insertBefore(chld, main.firstChild);
		else
			main.appendChild(chld);

		// Container's CSS can be set as name attr. of <object> tag "<type>" is always used as class descriptor
		this[sName]._css = sClass;
		this[sName]._allcss = chld.className = (aObj.ATTRIBUTES && aObj.ATTRIBUTES.CSS?aObj.ATTRIBUTES.CSS+' ':'') + sType + (sClass?' '+sClass:'');
		this[sName]._main = chld;

		main = null;
		chld = null;
	}

	// Prepare Arguments for __construcor
	var aArg = [].slice.call(arguments).splice(4);

	// inherit defined methods from extensions and execute their __constructor methods for BEFORE
	if (aObj.BEFORE){
		var sobj;
		for (var i in aObj.BEFORE){

			if (this[sName] && this[sName]._destructed) return;

			if (aObj.BEFORE[i].ATTRIBUTES && aObj.BEFORE[i].ATTRIBUTES.CLASS)
				sobj = aObj.BEFORE[i].ATTRIBUTES.CLASS;
			else
				sobj = aObj.BEFORE[i].VALUE;

			if (typeof window[sobj] == 'function'){
				inherits(this[sName], window[sobj]);

				// do not create object if before.__constructor returns FALSE!
				if (window[sobj].prototype.__constructor && this[sName].__constructor.apply(this[sName],aArg) === false){
					this[sName]._destruct();
					return false;
				}
			}
		}
	}

	// add template name (just template name from XML)
	if (aObj.TEMPLATE && typeof aObj.TEMPLATE[0].VALUE != 'undefined'){

		this[sName]._template = aObj.TEMPLATE[0].VALUE;

		// DRAW
		if (Is.Defined(this._parent) && Is.Defined(this._parent._aTemplateData))
			this[sName]._draw(null,null,this._parent._aTemplateData);
		else
		if (Is.Defined(this._aTemplateData))
			this[sName]._draw(null,null,this._aTemplateData);
		else
			this[sName]._draw();
	}

	// add destructors
	// may be created before obj. inicialization...!?
	if (aObj.ONUNLOAD)
		for (var i in aObj.ONUNLOAD)
			this[sName]._add_destructor(aObj.ONUNLOAD[i].VALUE,aObj.ONUNLOAD[i].ATTRIBUTES);

	 // inherit defined methods from extensions and execute their __constructor methods for LIRBARY
	if (aObj.LIBRARY)
		for (var sObj = '', i = 0, j = aObj.LIBRARY.length; i<j; i++){

			if (this[sName] && this[sName]._destructed) return;

			sObj = aObj.LIBRARY[i].VALUE;

			if (aObj.LIBRARY[i].ATTRIBUTES){

				// DO NOT INHERIT obj properties
				if (aObj.LIBRARY[i].ATTRIBUTES.INCLUDE)
					continue;

				if (aObj.LIBRARY[i].ATTRIBUTES.CLASS)
					sObj = aObj.LIBRARY[i].ATTRIBUTES.CLASS;
			}

			if (typeof window[sObj] == 'function'){
				inherits(this[sName],window[sObj]);

				if (window[sObj].prototype.__constructor)
					this[sName].__constructor.apply(this[sName],aArg);
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
 * @param: sTmpName  - optional, name of template
 * 	    Anchor    - optional, can by string or directly DOM element
 **/
Gui.prototype._draw = function (sTmpName,sTarget,aData,append){

	if (aData && typeof aData === 'object')
		aData._ins = this._pathName;
	else
		aData = {_ins:this._pathName};

	if (GWOthers)
		aData._skin = 'client/skins/'+GWOthers.getItem('LAYOUT_SETTINGS', 'skin');

	// retrieve template
	var sHtml = template.tmp((sTmpName?sTmpName:this._template),aData) || '';

	// parse <OBJ>
	// <obj> can be parsed from gui objects only because of _ins var requirement */
	var id, obj = [], tmpObj = [], sAnchor;

	var xTpl = mkElement('div', {innerHTML:sHtml});

	if (sHtml.indexOf('<obj ')>-1){

		//Safari title tag hack
		// if ((currentBrowser()=='Safari' || currentBrowser()=='Chrome') && sHtml.indexOf('<title')>-1)
		// 	sHtml = sHtml.replace(/<title/ig,'<safari_title').replace(/<\/title/ig,'</safari_title');

		//OBJECTS
		var aList = xTpl.getElementsByTagName("obj");
		if (aList.length){

			var ep,etmp,etmptag,sType,sName;

			/* PRIVATE, <ITEM> -> Array parser
					   @param: etmp - parent dom element */

			function parseitem(etmp){
				var key,n = etmp.getElementsByTagName("item"),
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
			for (var i = 0, l = aList.length; i < l; i++){

				ep = aList[i].parentNode;
				sType = aList[i].getAttribute('type');
				sName = aList[i].getAttribute('name');

				if (!sName || !sType) continue;

				// nasted <obj>
				if (ep.tagName === 'OBJ')
					sAnchor = aList[i].getAttribute('anchor') || 'main';
				else{
					// set id to parent HTML elm. & create anchor in parent gui object
					if ((id = ep.getAttribute('id'))){
						sAnchor = inArray(this._anchors,id);
						if (sAnchor == -1){
							do{
								sAnchor = Math.rand();
							}
							while(this._anchors[sAnchor]);

							this._anchors[sAnchor] = id;
						}
					}
					else{
						do{
							sAnchor = Math.rand();
						}
						while(this._anchors[sAnchor]);

						this._anchors[sAnchor] = (this._pathName || '') + "#" + sAnchor;
						ep.setAttribute('id',this._anchors[sAnchor]);
					}
				}

				// CREATE OBJ FOR ARRAY
				tmpObj = {"type":sType,"name":sName,"anchor":sAnchor};

				for(var attrs = aList[i].attributes, iAl = attrs.length; iAl--;) {
					if (tmpObj[attrs[iAl].name] === undefined)
						tmpObj[attrs[iAl].name] = attrs[iAl].value;
				}

				// PARSE OBJECT'S PROPERTIES
				for (var nlen = aList[i].childNodes.length; nlen--;){

					etmp = aList[i].childNodes[nlen];
					if ((etmptag = etmp.tagName?etmp.tagName.toLowerCase():false))
						switch (etmptag){
						case 'readonly':
						case 'disabled':
							var tval = etmp.textContent;
							if (tval && (tval!='false' || tval!='0'))
								tmpObj[etmptag] = true;
							break;

						case 'draw' :
							tmpObj.draw = [etmp.getAttribute('form'),etmp.getAttribute('anchor') || 'main',parseitem (etmp)];
							break;

						// case 'safari_title': //safari is removing <title> tag
						// 	etmptag = 'title';

						case 'restrictions':
						case 'init' :
						case 'fill' :
						case 'value':
						case 'src':
						case 'title':
						case 'text' :
						case 'placeholder' :
							tmpObj[etmptag] = parseitem (etmp);
							break;
						}
				}
				etmp = null;

				// APPEND OBJ INTO ARRAY
				if (ep.tagName.toLowerCase() == 'obj'){

					// child
					for (var iLPos = aList.length; iLPos--;)
						if (aList[iLPos] === ep) break;

					if (prevObj[iLPos].objects)
						prevObj[iLPos].objects.push(tmpObj);
					else
						prevObj[iLPos].objects = [tmpObj];
				}
				else
					obj.push(tmpObj);

				prevObj.push(tmpObj);
				tmpObj = null;
			}
			prevObj = null;

			// REMOVE <OBJ> ELEMENTS FROM TEMPLATE (faster way)
			for(var j = aList.length; j--;)
				aList[j].parentNode.removeChild(aList[j]);

			ep = null;
		}
	}
	else
		sAnchor = sTarget;

	var eTarget = sTmpName && sAnchor?this._getAnchor(sTarget):this._main;
	if (eTarget){
		//Prepend
		if (append === 2){
			var tmp = eTarget.firstChild || null;
			while(xTpl.firstChild) {
				eTarget.insertBefore(xTpl.firstChild, tmp);
			}
		}
		//Append & Replace
		else{
			//Replace
			if (!append)
				while(eTarget.firstChild)
					eTarget.removeChild(eTarget.firstChild);

			while(xTpl.firstChild) {
				eTarget.appendChild(xTpl.firstChild);
			}
		}
	}

	eTarget = null;
	xTpl = null;

	// add GUI objects from template
	delete aData._ins;

	if (Is.Empty(aData))
		this.__addObjects(obj);
	else
		this.__addObjects(obj,null,aData);

	if (this.__onCreateChild)
		this.__onCreateChild('','',sTarget);
};


Gui.prototype.__addObjects = function(obj,oParent,aData){

	var newObj, aInit, oParent = oParent || this;

	if (aData)
		this._aTemplateData = aData;

	for (var i = 0, l = obj.length; i<l; i++){

		aInit = [obj[i].name, obj[i].type, obj[i].anchor, obj[i].css];

		// <init> tag
		if (obj[i].init){
			//pole
			if (typeof obj[i].init == 'object'){
				for (var j in obj[i].init)
					aInit.push(obj[i].init[j]);
			}
			//string
			else
				aInit.push(obj[i].init);
		}

		if (this._aTemplateData && oParent)
			oParent._aTemplateData = aData;

		newObj = oParent._create.apply(oParent,aInit);

		// _title
		if (obj[i].title && Is.Function(newObj._title))
			newObj._title(obj[i].title);

		// _text
		if (obj[i].text && Is.Function(newObj._text))
			newObj._text(obj[i].text);

		// _fill
		if (obj[i].fill && Is.Function(newObj._fill))
			newObj._fill(obj[i].fill);

		// _value
		if (obj[i].value && Is.Function(newObj._value))
			newObj._value(obj[i].value);

		// _src
		if (obj[i].src && Is.Function(newObj._src))
			newObj._src(obj[i].src);

		// READONLY
		if (obj[i].readonly && Is.Function(newObj._readonly))
			newObj._readonly(obj[i].readonly);

		// DISABLED
		if (obj[i].disabled && Is.Function(newObj._disabled))
			newObj._disabled(obj[i].disabled);

		// PLACEHOLDER
		if (obj[i].placeholder && Is.Function(newObj._placeholder))
			newObj._placeholder(obj[i].placeholder);

		// TABINDEX
		if (obj[i].tabindex && Is.Function(newObj._tabIndex))
			newObj._tabIndex(obj[i].tabcontainer,obj[i].tabindex == 'true'?undefined:parseInt(obj[i].tabindex,10));

		// FOCUS
		if (obj[i].focus && Is.Function(newObj._focus))
			newObj._focus(obj[i].focus);

		// WIDTH & HEIGHT
		if ((obj[i].width || obj[i].height) && Is.Function(newObj._size))
			newObj._size(obj[i].width,obj[i].height);

		// RESTRICTIONS
		if ((obj[i].restrictions) && Is.Function(newObj._restrict)){

			var atmp = [];

			if (typeof obj[i].restrictions == 'object'){
				for(var j in obj[i].restrictions)
					atmp.push(obj[i].restrictions[j],j);
			}
			else
			if (typeof obj[i].restrictions == 'string')
				atmp.push(obj[i].restrictions);

			try{
				if (atmp.length)
					newObj._restrict.apply(newObj,atmp);
			}
			catch(er){
				throw "invalid input array for restrictions in:\n"+oParent._pathName+'.'+obj[i].name;
			}
		}

		// _draw
		if (obj[i].draw && Is.Function(newObj._draw))
			if (typeof newObj.__drawTpl != 'undefined' && !newObj._isActive && obj[i].ondemand) {
				newObj.__drawTpl = obj[i].draw;
				newObj.__drawData = aData;
			}
			else{
				aData = arrConcat(aData,obj[i].draw[2]);
				newObj._draw(obj[i].draw[0],obj[i].draw[1],aData);
				if (newObj._isActive && newObj._active) newObj._active(true);
			}


		// nasted objects
		if (obj[i].objects && obj[i].objects.length)
			if (typeof newObj.__drawObj != 'undefined' && !newObj._isActive && obj[i].ondemand) {
				newObj.__drawObj = obj[i].objects;
				newObj.__drawData = aData;
			}
			else{
				this.__addObjects(obj[i].objects,newObj,aData);

				if (newObj._isActive && newObj._active)
					newObj._active(true);
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
Gui.prototype._obeyEvent = function(sType, oEvn, info){

	//check if already doesnt exist
	if (this._events[sType])
		this._disobeyEvent(sType, oEvn);
	else
		this._events[sType] = {};

	var id = unique_id();
	this._events[sType][id] = [oEvn, info];

	return id;
};

Gui.prototype._disobeyEvent = function(sType, oEvn){

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

Gui.prototype.__exeEvent = function(sType,e,arg){

	if (this._events[sType])
		for (var j in this._events[sType])
			try{
				if (typeof this._events[sType][j] == 'undefined' || !Is.Object(this._events[sType][j][0]) || executeCallbackFunction(this._events[sType][j][0], e, arg) === false)
					delete this._events[sType][j];
			}
			catch(r){
				//debug
				gui._REQUEST_VARS.frm && console.log('exeEvent', r);
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
Gui.prototype._getChildObjects = function(sAnchor,sType){
	var aOut = [];

	if (Is.Defined(sAnchor))
		sAnchor = sAnchor.toString();

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
Gui.prototype._clean = function(sAnchor,sType){
	var aObj = this._getChildObjects(sAnchor,sType);
	for (var i in aObj)
		aObj[i]._destruct();

	return true;
};

Gui.prototype._getAnchor = function(sAnchor){

	if (Is.Defined(sAnchor))
		sAnchor = sAnchor.toString();

	if (this._anchors[sAnchor])
		return document.getElementById(this._anchors[sAnchor]);
	else
	if (sAnchor == 'main' || sAnchor == 'self')
		return this._main;
	else
		return document.getElementById(this._pathName + (sAnchor?'#' + sAnchor:''));
};

/**
 * obey on given dataset object
 */
Gui.prototype._listen = function(sDataSet,aDataPath,bNoUpdate){
	this._listener = sDataSet;
	if (typeof aDataPath == 'object') this._listenerPath = aDataPath;
	dataSet.obey(this,'_listener',sDataSet,bNoUpdate);
};


Gui.prototype._save = function(sDataSet,aDataPath){
	this._saver = sDataSet;
	if (typeof aDataPath == 'object') this._saverPath = aDataPath;
	dataSet.obey(this,'_saver',sDataSet);
};


Gui.prototype._saveme = function (noupd){
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


Gui.prototype._add_destructor = function (sMethod,aProperties){
	if(!sMethod) return false;
	this._destructors[sMethod] = aProperties;
};


Gui.prototype._remove_destructor = function (sMethod){
	delete this._destructors[sMethod];
};


/**
 * @breif: destruct object
 * @date : 30.6.2006 13:58:51
 **/
Gui.prototype._destruct = function(){

	if (this._destructed) return;
	this._destructed = true;

	// try to destruct already destructed object
	if (!this._parent[this._name]) return false;

	/*
	1. STEP
	execute all destructors
	useful for _saveall method etc.
	*/
	for (var val in this._destructors)
		if (Is.Function(this[val]))
			this[val].apply(this, Is.Array(this._destructors[val])?this._destructors[val]:arguments);

	this.__exeEvent('ondestruct', null, {"owner":this});

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

	// remove HTML
	try{
		this._main && this._main.parentNode && this._main.parentNode.removeChild(this._main);
	}
	catch(er){gui._REQUEST_VARS.debug && console.log(this._name||false,er)}

	// remove instance
	this._parent[this._name] = null;
	delete this._parent[this._name];

	if (this._parent.__onDestroyChild)
		this._parent.__onDestroyChild(this._name,this._type,this._anchor);

	// finalize object
	this.__exeEvent('destructed', null, this);
};

// root is not inherit into gui descendents
Gui.__root = function() {

	var me = this;

	this._main = mkElement('div',{
		id: this._name,
		style: {
			width:"100%",
			height:"100%",
			overflow:"hidden",
			//Auto-Scroll to Focus hack
			position:"absolute"
		}});

	//Auto-Scroll to Focus hack
	this._main.onscroll = function(e){
		var e = e || window.event;
		this.scrollTop = 0;
		this.scrollLeft = 0;
		e.preventDefault && e.preventDefault();
		return false;
	};

	document.getElementsByTagName('body')[0].appendChild(this._main);

	this.__X = 0;
	this.__Y = 0;

	this.__UNIQ = unique_id();
	this.__BROWSER = {
		touch:false,
		retina:function(){
			var mediaQuery = "(-webkit-min-device-pixel-ratio: 1.5),\
					(min--moz-device-pixel-ratio: 1.5),\
					(-o-min-device-pixel-ratio: 3/2),\
					(min-resolution: 1.5dppx)";
			if (window.devicePixelRatio > 1)
				return true;
			if (window.matchMedia && window.matchMedia(mediaQuery).matches)
				return true;
			return false;
		}()
	};

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

	// Touch prefix for touch enabled device
	if (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)) {
		addcss(this._main, 'touch');
		this.__BROWSER.touch = true;
	}


	//DOCUMENT EVENT Handlers
	function evn (e){
		var e = e || window.event;
		me.__exeEvent(e.type,e);
	};

	window.onresize = function(e){
		setTimeout(function() {
			evn(e);
		}, 5);
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
	AttachEvent(document, "onmousewheel", function(e){
		var e = e || window.event,
			delta;

		if (Is.Defined(e.deltaY))
			delta = e.deltaY;
		else{
			if (e.originalEvent)
				e = e.originalEvent;

			delta = Is.Defined(e.detail)? e.detail : e.wheelDelta/-120;
		}

		evn({type:'mousewheel', delta:delta});
	});

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
		if (e.keyCode == 116 || e.keyCode == 27){
			e.cancelBubble = true;
			e.preventDefault && e.preventDefault();
			e.stopPropagation && e.stopPropagation();
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
		if (e.keyCode == 116 || e.keyCode == 27){
			e.cancelBubble = true;
			e.preventDefault && e.preventDefault();
			e.stopPropagation && e.stopPropagation();
			e.keyCode == 116 && gui.frm_main._getNew();
			return false;
		}
	};
	document.onpaste = function (e){
		var e = e || window.event;
		evn(e);
	};

	this.__loading_stack = [];
	this._loading = function(xhr, b){
		var index;
		if (this.__loading_obj){
			if (b) {
				this.__loading_stack.push(xhr);
				setTimeout(this._loading.bind(this, xhr), 5000);
			} else if (~(index = this.__loading_stack.indexOf(xhr))) {
				this.__loading_stack.splice(index, 1);
			}

			try{
				this.__loading_obj._loading(this.__loading_stack.length);
			}
			catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r)}
		}
		else
			this.__loading_stack = [];
	};

	//MSIE page scrolling fix
	if (currentBrowser().indexOf('MSIE')===0)
		setInterval(function(){
			if (me._main.scrollTop>0)
				me._main.scrollTop = 0;
		},1000);
};
