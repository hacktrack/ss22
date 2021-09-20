/**
 * @brief  : This class provides storage for GUI data and takes care about JS and CSS loading into page
 * @require: httprequest, browser_ext
 * @status : final
 * @date   : 6.3.2006 13:59:51
 **/
function cStorage(){
	this.aStorage = {"css":{},"library":{},"language":{},"template":{},"object":{}};

	this.ready={};

	this.aStorage.library = {
	//preloaded in startscript.js
	'client/inc/debug':true,'client/inc/object_ext':true,'client/inc/browser_ext':true,'client/inc/template':true,'client/inc/xmltools':true,
	'client/inc/request':true,'client/inc/dataset':true,'client/inc/storage':true,'client/inc/gui':true,
	'client/inc/wm_base':true,'client/inc/wm_generic':true,
	'client/inc/wa_server':true,'client/inc/wa_domains':true,'client/inc/wa_accounts':true,
	'client/inc/wm_auth':true,'client/inc/wm_accounts':true,'client/inc/wm_folders':true,'client/inc/wm_items':true,'client/inc/wm_settings':true,'client/inc/wm_storage':true,'client/inc/init':true,
	'client/inc/gw_others':true,'client/inc/json':true,

	'client/inc/popup':true,

	'client/inc/obj_loader':true,'client/inc/obj_form_generic':true,'client/inc/obj_form_tab':true,'client/inc/obj_button':true,'client/inc/obj_connection':true
	};
};

/**
 * @brief: Append CSS file into page or enabled previously appended one
 * @date: 6.3.2006 13:56:53
 */
cStorage.prototype.css = function(sName,bForce) {

	if (!bForce){
		
		// MSIE workaround because 31 link tag limitation  (style.css contains all *.css)
		if (this.aStorage.css['style']) return true;

		//check cache
		if (this.aStorage.css[sName]) {
			if (this.aStorage.css[sName] == 'disabled') {
				document.getElementById('css_' + sName).disabled = false;
				this.aStorage.css[sName] = 2;
			}
			return true;
		}
	}

	//save name to cache
	this.aStorage.css[sName] = 1;

	var me = this,
		aData = {"id":'css_' + sName, "rel":'stylesheet',"type":'text/css', onload:function(){
			if (me.aStorage.css[sName])
				me.aStorage.css[sName] = 2;
		}};

	if (sName == 'style')
		aData['href'] = 'client/skins/'+ GWOthers.getItem('LAYOUT_SETTINGS', 'skin') +'/css/style.'+ GWOthers.getItem('LAYOUT_SETTINGS', 'skin_style') +'.css';
	else
		aData['href'] = 'scssphp/css.php?file=client/skins/'+ GWOthers.getItem('LAYOUT_SETTINGS', 'skin') +'/css/'+sName+'.css';
		//aData['href'] = 'client/skins/'+ GWOthers.getItem('LAYOUT_SETTINGS', 'skin') +'/css/'+sName+'.css';
	
	if(!window.csscheck){window.csscheck={};}
	window.csscheck[sName]=false;
	aData['onload']=function(){window.csscheck[sName]=true;};

	if (bForce){
		var elm = document.getElementById('css_' + sName);
		if (elm){
			elm.href = aData['href'];
			return true;
		}
	}

	//append CSS into page
	document.getElementsByTagName('head')[0].appendChild(mkElement('link', aData));

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
cStorage.prototype.library = function(sName,sPath,bASync) {

	var sFile;
	switch (sPath){
		/*
		case 'URL':
		    sFile = sName;
		    break;
		*/
		case 'skin':
			sFile = 'client/skins/'+GWOthers.getItem('LAYOUT_SETTINGS', 'skin')+'/inc/'+sName;
			break;
		default:
			// JS preloader
			if (this.aStorage.library['client/inc/javascript']) return true;
			sFile = 'client/inc/'+sName;
	}

	//check cache
	if (this.aStorage.library[sFile]) return true;
	
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


	if (bASync)
    	request.get(sFile + '.js',[this,'preloadLib',['library',sFile,sName],'Text']);
    else{
    	var iq = request.get(sFile + '.js');
    	if (iq){
    		var str = iq.getString();
			if (str.length<1){
			    iq = null;
				return false;
			}

			//append library into page
			pubEval(str);

			//save name to cache
			this.aStorage.library[sFile] = 'enabled';
    	}
    }	

	return true;
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
	var tmp = {};
	
    var i,j,k,v;
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
				var parts = out.split('%s');
				out = parts.shift();
				for (var i in parts)
					out += aSubstitute.shift() + parts[i];
			}

			return out;
		}
		else
		if (typeof out == 'object')
			return out;
	}
	catch(e){}

	if (nobr == 2)
	    return '';
	else
	return (nobr?str:'{'+str+'}');
};