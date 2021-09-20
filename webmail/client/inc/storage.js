/**
 * @brief  : This class provides storage for GUI data and takes care about JS and CSS loading into page
 * @require: httprequest, browser_ext
 * @status : final
 * @date   : 6.3.2006 13:59:51
 **/
function cStorage(){
	this.aStorage = {"css":{},"library":{},"language":{},"template":{},"object":{}};

	this.aStorage.library = {
	//preloaded in startscript.js
	'client/inc/debug':'enabled','client/inc/object_ext':'enabled','client/inc/browser_ext':'enabled','client/inc/template':'enabled','client/inc/xmltools':'enabled',
	'client/inc/request':'enabled','client/inc/dataset':'enabled','client/inc/storage':'enabled','client/inc/gui':'enabled','client/inc/wm_generic':'enabled',
	'client/inc/wm_auth':'enabled','client/inc/wm_accounts':'enabled','client/inc/wm_folders':'enabled','client/inc/wm_items':'enabled','client/inc/wm_settings':'enabled','client/inc/wm_storage':'enabled','client/inc/init':'enabled',
	'client/inc/gw_others':'enabled','client/inc/json':'enabled',

	'client/inc/obj_loader':'enabled','client/inc/obj_form_generic':'enabled','client/inc/obj_form_tab':'enabled','client/inc/obj_button':'enabled','client/inc/obj_connection':'enabled'
	};
};

/**
 * @brief: Append CSS file into page or enabled previously appended one
 * @date: 6.3.2006 13:56:53
 */
cStorage.prototype.css = function(sName,bForce,callback) {

	if (!bForce){

		// MSIE workaround because 31 link tag limitation  (style.css contains all *.css)
		if (this.aStorage.css['style']) return true;

		//check cache
		if (this.aStorage.css[sName]) {
			if (this.aStorage.css[sName] == 'disabled') {
				document.getElementById('css_' + sName).disabled = false;
				this.aStorage.css[sName] = 2;
			}
			callback && callback();
			return true;
		}
	}

	//save name to cache
	this.aStorage.css[sName] = 1;

	var me = this,
		aData = {"id":'css_' + sName, "rel":'stylesheet',"type":'text/css', onload:function(){
			if (me.aStorage.css[sName])
				me.aStorage.css[sName] = 2;
			callback && callback();
		}};

	var skin = GWOthers.getItem('LAYOUT_SETTINGS', 'skin'),
		skin_style = GWOthers.getItem('LAYOUT_SETTINGS', 'skin_style');

	if (skin_style && storage && storage.aStorage.language && storage.aStorage.language.SKIN_STYLE && !storage.aStorage.language.SKIN_STYLE[skin_style.toUpperCase()])
		skin_style = 'default';

	if (sName == 'font')
		aData['href'] = 'client/skins/'+ skin +'/css/font.css';
	else
	if (sName == 'style')
		aData['href'] = 'client/skins/'+ skin +'/css/style.'+ skin_style +'.css';
	else
		aData['href'] = 'client/skins/'+ skin +'/css/css.php?'+ buildURL({skin:skin, palette:skin_style, file:sName+'.css'});

	if (bForce){
		var elm = document.getElementById('css_' + sName);
		aData.onload = callback;
		document.head.appendChild(mkElement('link', aData));
		elm && document.head.removeChild(elm);
		return true;
	}
	else
	//Fallback to Default
	if (skin != 'default' || skin_style != 'default'){
		var href = '';
		if (sName == 'font')
			href = 'client/skins/default/css/font.css';
		else
		if (sName == 'style')
			href = 'client/skins/default/css/style.default.css';
		else
			href = 'client/skins/default/css/css.php?'+ buildURL({skin:'default', palette:'default', file:sName+'.css'});

	 	aData.onerror = function(e){
	 		this.href = href;
		};
	}

	//append CSS into page
	document.head.appendChild(mkElement('link', aData));
	return true;
};

cStorage.prototype.css_status = function(sName){
	switch(this.aStorage.css['style'] || this.aStorage.css[sName]){
		case 'disabled':
			return 'disabled';
		case 1:
			return 'loading';
		case 2:
			return 'loaded';
		default:
			return false;
	}
};
/**
 * @brief: disable given css in document
 * (remove doesnt work in MSIE - needs some research here!)
 * @date: 6.3.2006 13:56:21
 */
cStorage.prototype.remove_css = function (sName) {
	if (this.aStorage.css[sName]) {
		if (this.aStorage.css[sName] != 'disabled') {
			document.getElementById('css_' + sName).disabled = true;
			this.aStorage.css[sName] = 'disabled';
		}
		return true;
	}
	return false;
};

cStorage.prototype.remove_all_css = function (){
	var tmp;
	for (var i in this.aStorage.css){
		if ((tmp = document.getElementById('css_' + i))){
			tmp.disabled = true;
			tmp.parentNode.removeChild(tmp);
		}

		delete this.aStorage.css[i];
	}
};
/**/

/**
 * @brief: Append library into page
 * (little odd behaviour in Safari, "var" definitions aren't eval as public!)
 */
cStorage.prototype.library = function(sName,sPath,bASync,aHandler) {

	var sFile;
	switch (sPath || ''){
		//client/inc
		case '':
			// JS preloader
			if (this.aStorage.library['client/inc/javascript'] == 'enabled') return true;
			sFile = 'client/inc/'+sName;
			break;

		//libs
		case 'libs':
			sFile = 'libs/'+sName;
			break;

		//client/skins
		case 'skin':
			sFile = 'client/skins/'+GWOthers.getItem('LAYOUT_SETTINGS', 'skin')+'/inc/'+sName;
			break;

		//client/inc/<sPath>
		default:
			if (/^[\w//-]+$/gi.test(sPath))
				sFile = 'client/inc/'+ sPath +'/'+ sName;
			break;
	}

	//check cache
	if (this.aStorage.library[sFile] == 'enabled') return true;

	//import external file
	/*
	if (sPath == 'URL'){

		var elm = window.document.createElement('script');
			elm.setAttribute('src',sFile);
			elm.setAttribute('type',"text/javascript");
		document.getElementsByTagName('head')[0].appendChild(elm);

		//save name to cache
	    this.aStorage.library[sFile]='enabled';
		return true;
	}
	*/

    //retrieve Lib from server

	if (bASync){
		if (!this.aStorage.library[sFile]){
			this.aStorage.library[sFile] = 'loading';
			request.get(sFile + '.js', [this,'preloadLib',[sFile, aHandler], 'Text']);
		}
	}
    else{
    	var iq = request.get(sFile + '.js');
    	if (iq){
    		var str = iq.getString();
			if (str){
				//append library into page
				pubEval(str);

				//save name to cache
				this.aStorage.library[sFile] = 'enabled';
			}
			else{
			    iq = null;
				return false;
			}
    	}
    }

	return true;
};

cStorage.prototype.preloadLib = function(sType, aData, sFile, aHandler){
	if (aData && aData.Text){
		if (this.aStorage.library[sFile] != 'enabled'){
			//append library into page
			pubEval(aData.Text);

			//save name to cache
			this.aStorage.library[sFile] = 'enabled';
		}

		if (aHandler)
			executeCallbackFunction(aHandler);
	}
};

/**
 * Synchronous preload f selected objects in advance
 * (MUST be in synchro mode)
 **/
cStorage.prototype.preloadObj = function(){
	//retrieve object from server
	var q = request.get('client/objects/objects.xml');
	if (q){
		var aObjects = q.getArray();
		for(var i in aObjects.OBJECTS[0])
			this.object(i.toLowerCase(),aObjects.OBJECTS[0][i][0]);
	}
};

/**
 * Asynchronous preload of selected templates
 **/
cStorage.prototype.preloadTpl = function(aResponseData,sName){
	if (aResponseData && sName){
		if (sName == 'templates'){
			if (aResponseData.Array && aResponseData.Array.TEMPLATE && aResponseData.Array.TEMPLATE[0])
				for(var i in aResponseData.Array.TEMPLATE[0])
					this.aStorage.template[i.toLowerCase()] = aResponseData.Array.TEMPLATE[0][i][0].VALUE || '';
		}
		else
			this.aStorage.template[sName] = aResponseData.Text || '';

		return;
	}
};

/**
 * @brief:  load and reconstruct language array from server
 * @return: language array
 */
cStorage.prototype.language = function(sName){

    sName = sName || 'en';

	//check cache
	if (typeof this.aStorage.language["_ACTIVE_LANG"] != 'undefined' && this.aStorage.language["_ACTIVE_LANG"] == sName)
		return sName;

	//retrieve language from server
    var lang;
	try{
		lang = request.get('client/languages/'+sName+'/data.xml').getArray();
	}
	catch(e){
		lang = null;
	}

	// try to load default language
	if (sName!='en' && !Is.Object(lang))
		try{
            sName = 'en';
			lang = request.get('client/languages/'+sName+'/data.xml').getArray();
		}
		catch(e){
			lang = null;
		}

	if (!Is.Object(lang))
		throw new Error("cStorage.language() - bad language file syntax: " + sName);

    this.aStorage.language = {'_ACTIVE_LANG':sName};

	//construct storage
	lang = lang['LANGUAGE'][0];

    var i,j,v;
	for (i in lang){
		this.aStorage.language[i] = {};
		for (j in lang[i][0])
			if (j != 'VALUE'){
				if (lang[i][0][j].length>1)
					v = lang[i][0][j];
				else
					v = lang[i][0][j][0]['VALUE'];

				this.aStorage.language[i][j] = (Is.Defined(v)) ? v : '';
			}
	}

	return sName;
};


/**
 * @brief :  load and template file from sever
 * @return: template as string
 * @date  : 4.7.2006 12:37:13
 */
cStorage.prototype.template = function(sName,bASync) {
	//check cache
	if (typeof this.aStorage.template[sName]!='undefined')
		return this.aStorage.template[sName];


	var skin = GWOthers.getItem('LAYOUT_SETTINGS', 'skin'),
		q;

	if (bASync){
		request.get('client/skins/'+skin+'/templates/'+sName+(sName=='templates'?'.xml':'.tpl'), [this,'preloadTpl',[sName],(sName=='templates'?'Array':'Text')]);
		return true;
	}
	else
	if (sName == 'templates'){
		if ((q = request.get('client/skins/'+skin+'/templates/templates.xml'))){
			this.preloadTpl({Array:q.getArray()},'templates');
			return true;
		}
	}
	else
	if ((q = request.get('client/skins/'+skin+'/templates/'+sName+'.tpl')))
		return this.aStorage.template[sName] = q.getString();

	throw new Error("cStorage.template() - blank template file: " + skin+'/'+sName);
};

/**
 * @brief:  load  page descriptor from sever
 * @return: page as array
 */
cStorage.prototype.object = function(sName, aObject) {

	//check cache
	if (typeof this.aStorage.object[sName]!='undefined')
		return this.aStorage.object[sName];

	try{
		//retrieve object from server
		if (!aObject)
			aObject = request.get('client/objects/'+sName+'.xml').getArray();

		//check for <object> root and remove it
		if (aObject['OBJECT'])
			aObject = aObject['OBJECT'][0];
	}
	catch(e){
		throw "cStorage.object() - blank xml: " + sName;
	}

	//load CSS
	if (aObject['CSS'])
		for(var i in aObject['CSS'])
			this.css(aObject['CSS'][i]['VALUE']);

	//load JS
	if (aObject['BEFORE'])
		for(var i in aObject['BEFORE']){
            if (aObject['BEFORE'][i]['ATTRIBUTES'] && aObject['BEFORE'][i]['ATTRIBUTES']['PATH'])
            	this.library(aObject['BEFORE'][i]['VALUE'],aObject['BEFORE'][i]['ATTRIBUTES']['PATH']);
			else
				this.library(aObject['BEFORE'][i]['VALUE']);
		}

	if (aObject['LIBRARY'])
		for(var i in aObject['LIBRARY']){
            if (aObject['LIBRARY'][i]['ATTRIBUTES'] && aObject['LIBRARY'][i]['ATTRIBUTES']['PATH'])
            	this.library(aObject['LIBRARY'][i]['VALUE'],aObject['LIBRARY'][i]['ATTRIBUTES']['PATH']);
			else
				this.library(aObject['LIBRARY'][i]['VALUE']);
		}

	//save to cache
	return this.aStorage.object[sName] = aObject;
};

storage = new cStorage();

///////////////////////////
/*
function getLang(str,aSubstitute,nobr){

	if (typeof str != 'string' || !str) return '';

	var out = '',
		a = str.toUpperCase().split('::');

	try{
		if (typeof a[1] == 'undefined')
			out = storage.aStorage.language[a[0]];
		else
			out = storage.aStorage.language[a[0]][a[1]];

		if (typeof out == 'string'){
			if (aSubstitute && out.length){

				var i = 0;
				out = out.replace(/\%[sS0-9]/g, function(v){
					if (v.toLowerCase() == '%s'){
						return aSubstitute[i];
						i++;
					}
					else
						return aSubstitute[+(v.substr(1))];
				});

				// var parts = out.split('%s');
				// out = parts.shift();
				// for (var i in parts)
				// 	out += aSubstitute.shift() + parts[i];

			}

			return out;
		}
		else
		if (typeof out == 'object')
			return out;
	}
	catch(e){gui._REQUEST_VARS.debug && console.log(this._name||false,e);}

	if (nobr == 2)
	    return '';
	else
	return (nobr?str:'{'+str+'}');
};
*/


window.getLang = function (){

	var regx = /\%[sS0-9]/g;

	return function(str, aSubstitute, nobr){

		if (typeof str != 'string' || !str) return '';

		var out = '',
			a = str.toUpperCase().split('::');

		try{
			if (typeof a[1] == 'undefined')
				out = storage.aStorage.language[a[0]];
			else
				out = storage.aStorage.language[a[0]][a[1]];

			if (typeof out == 'string'){
				if (aSubstitute && out.length){

					var i = 0;
					out = out.replace(regx, function(v){
						if (v.toLowerCase() == '%s'){
							return aSubstitute[i++];
						}
						else
							return aSubstitute[+(v.substr(1))];
					});
				}

				return out;
			}
			else
			if (typeof out == 'object')
				return out;
		}
		catch(e){gui._REQUEST_VARS.debug && console.log(this._name||false,e);}

	    return nobr == 2?'':(nobr?str:'{'+str+'}');
	};
}();
