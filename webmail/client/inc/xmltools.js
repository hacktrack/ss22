/************* XmlTool *************
* @brief   XML tools
* @author  DRZ 16.05.2005
*
* mozna najit lepsi cestu jak vytvaret XMLDoc, aby se to nevolalo pokazdy kdyz XML2Array
*/
function cXMLTools(){

	this.noparse = {'http://www.w3.org/1999/xhtml':true};
};

/**
 * @brief: Return latest supported DomDocument
 */
cXMLTools.prototype.XMLDoc = function(){
	try {
		//MSIE (including IE9)
		if (window.ActiveXObject){
			if (!this.prefix){

				//'Msxml2.DOMDocument.6.0'
				var o,prefixes = ['Msxml2.DOMDocument.3.0','MSXML.DomDocument']; //["MSXML2", "Microsoft", "MSXML", "MSXML3"]

				for (var i = 0; i < prefixes.length; i++) {
					// try to create the objects
					try {
						o = new ActiveXObject(prefixes[i]);  //  + ".DomDocument"
						this.prefix = prefixes[i];
						break;
					}
					catch (ex) {};
				}
				if(!this.prefix)
					throw new Error("cXMLTools.XMLDoc() - Could not find an installed XML parser");
				else
				    return o;
			}
			else
				return new ActiveXObject(this.prefix);   // + ".DomDocument"
		}
		else
		//Others
		if (document.implementation && document.implementation.createDocument)
			return document.implementation.createDocument("", "", null);
		else
			throw true;
	}
	catch (ex) {
		throw new Error("Your browser does not support XmlDocument objects");
	}
};

/**
 * @brief: Converts XMLObj into JS Array
 */
cXMLTools.prototype.XML2Arr = function(xInput,bNasted){

	var aOutput = {}, iKey;

	for(var i=0;;i++){
		if (i==0)
			var xTag = xInput.firstChild;
		else
		if (xTag.nextSibling)
			var xTag = xTag.nextSibling;
		else{

			//Throw error
			if (!bNasted && (!aOutput || (aOutput.PARSERERROR && aOutput.PARSERERROR[0])))
				throw "XML parsing error: "+aOutput.PARSERERROR[0].VALUE;

			return aOutput;
		}

		//MSIE xml header fix
		if(!i && !xTag.tagName) continue;

		//get upercase name
		var sTagname = xTag.tagName.toUpperCase();

		//get position key number
		if (aOutput[sTagname]){
			//aOutput[sTagname][iKey] = [];
			aOutput[sTagname].push({});
			iKey = aOutput[sTagname].length-1;
		}
		else{
			iKey = 0;
			aOutput[sTagname] = [{}];
			//aOutput[sTagname][iKey] = [];
		}

		//html
		var ns = xTag.getAttribute('xmlns');
		if (ns && this.noparse[ns]){
			var v = this.XML2Str(xTag);
			v = v.substring(v.indexOf('>')+1,v.lastIndexOf('<'));

			aOutput[sTagname][iKey]['VALUE'] = v;
		}
		else
		//xml
		if (xTag.hasChildNodes()){
			if (xTag.firstChild.nodeValue){
				var tmpTag = xTag.firstChild;

				aOutput[sTagname][iKey]['VALUE'] = tmpTag.nodeValue;

				while (1){
					if((tmpTag = tmpTag.nextSibling)){
						if (tmpTag.nodeValue)
							aOutput[sTagname][iKey]['VALUE'] += tmpTag.nodeValue;
					}
					else{
						tmpTag = null;
						break;
					}
				}
			}
			else
				aOutput[sTagname][iKey] = this.XML2Arr(xTag,true);
		}

		//get attributes
		if (xTag.attributes.length){
			aOutput[sTagname][iKey]['ATTRIBUTES'] = {};
			for (var i=0;i<xTag.attributes.length;i++)
				aOutput[sTagname][iKey]['ATTRIBUTES'][xTag.attributes.item(i).nodeName.toUpperCase()] = xTag.attributes.item(i).nodeValue;
		}
	}
};

/** OK
 * @brief: Converts JS Array into XMLObj
 * @note : Opera 8.5 doesnt suport ID attribute for tags!
 */
cXMLTools.prototype.Arr2XML = function(aIn,xElm,bPreserveCase){

	/* clone input array */
	var aInput = (xElm?aIn:clone(aIn,true)),
		bSafari = currentBrowser() == 'Safari' && currentBrowser(true)<526,
		elm;

	/* prepare new XMLDocument */
	if (!xElm){
		this.xDoc = null;
		this.xDoc = this.XMLDoc();
	}

	for(var i in aInput){
		for(var ii in aInput[i]){

			/*
				Gran Paradiso doesnt support setAttribute('xmlns') so we have to use createElementNS
				BUT
				Safari 3 works with setAttribute('xmlns') only :-/
			*/
			if (!bSafari && aInput[i][ii]['ATTRIBUTES'] && (aInput[i][ii]['ATTRIBUTES'].XMLNS || aInput[i][ii]['ATTRIBUTES'].xmlns) && this.xDoc.createElementNS){
				elm = this.xDoc.createElementNS(aInput[i][ii]['ATTRIBUTES'].XMLNS || aInput[i][ii]['ATTRIBUTES'].xmlns ,(bPreserveCase) ? i : i.toLowerCase());
				delete aInput[i][ii]['ATTRIBUTES'].XMLNS;
				delete aInput[i][ii]['ATTRIBUTES'].xmlns;
			}
			else
			if (xElm && xElm.namespaceURI && this.xDoc.createElementNS)
				elm = this.xDoc.createElementNS(xElm.namespaceURI,(bPreserveCase) ? i : i.toLowerCase());
			else
				elm = this.xDoc.createElement((bPreserveCase) ? i : i.toLowerCase());

			//Add attributes
			if (typeof aInput[i][ii]['ATTRIBUTES'] == 'object' && aInput[i][ii]['ATTRIBUTES'].constructor != Array){
				for(var ai in aInput[i][ii]['ATTRIBUTES'])
					elm.setAttribute((bPreserveCase) ? ai : ai.toLowerCase(),aInput[i][ii]['ATTRIBUTES'][ai]);

				delete aInput[i][ii]['ATTRIBUTES'];
			}

			//Add values
			if (typeof aInput[i][ii]['VALUE'] != 'undefined' && typeof aInput[i][ii]['VALUE'] != 'object'){
				//Safari 3.0.3b Win HACK
				if (typeof aInput[i][ii]['VALUE'] == 'string' && bSafari)
					elm.appendChild(this.xDoc.createTextNode(aInput[i][ii]['VALUE'].escapeHTML()));
				else
					elm.appendChild(this.xDoc.createTextNode(aInput[i][ii]['VALUE']));
			}
			//Add childs
			else
				this.Arr2XML(aInput[i][ii],elm,bPreserveCase);

			//Append element
			if (!xElm){
				// opera needs just elm, not whole document
				if (currentBrowser() == 'Opera') return elm;
				this.xDoc.appendChild(elm);

				return this.xDoc;
			}
			else
				xElm.appendChild(elm);
		}
	}
};

/** OK
 * @brief   Converts String into XMLObj
 */
cXMLTools.prototype.Str2XML = function(sInput){

	if (DOMParser){
		var xParser = new DOMParser(),
		 	xOutput = xParser.parseFromString(sInput, 'text/xml');

		this.stripWhiteSpace(xOutput);
		return xOutput;
	}

	//Not used anymore
	var xOutput = null;
	try {
		xOutput = this.XMLDoc();
		xOutput.async = false;
    	xOutput.validateOnParse = false;
		xOutput.loadXML(sInput);

		if (xOutput.parseError.errorCode)
			console.log("Error code: "+ xOutput.parseError.errorCode +
				"\nLine: " + xOutput.parseError.line + ':'+ xOutput.parseError.linePos +
				"\nReason: "+ xOutput.parseError.reason +
				"\n" + xOutput.parseError.srcText);

		return xOutput;
	}
	catch (e) {}
};

/** OK
* @brief   Converts XMLObj into String
*/
cXMLTools.prototype.XML2Str  = function(xInput){
	try{
		var sOut;
		if (xInput.xml)
			sOut = xInput.xml;
		else
			sOut = (new XMLSerializer()).serializeToString(xInput);

		return sOut;
	}
	catch (e){return ''}
};

/**
 * @brief: Converts String into Array
 */
cXMLTools.prototype.Str2Arr  = function(sInput){
	try{
		return this.XML2Arr(this.Str2XML(sInput));
	}
	catch (e){
		console.warn('Str2Arr', e, sInput);
		return [];
	}
};

cXMLTools.prototype.Arr2Str = function(aInput,bPreserveCase) {
	try {
		return this.XML2Str(this.Arr2XML(aInput,null,bPreserveCase));
	}
	catch (e) { if (console) console.log('Arr2Str', e); }
};

/**
 * @brief: strip WhiteSpaces from XML
 */
cXMLTools.prototype.stripWhiteSpace = function (node) {
	nodesToDelete = Array();
	this.findWhiteSpace(node, 0);
	for(var i = nodesToDelete.length; i--; ) {
		nodeRef = nodesToDelete[i];
		nodeRef.parentNode.removeChild(nodeRef);
	}

	return node;
};

cXMLTools.prototype.is_ws = function (nod) {
	return !(/[^\t\n\r ]/.test(nod.data));
};

cXMLTools.prototype.findWhiteSpace = function (node, nodeNo) {
	for (var i = node.childNodes.length; i--; ) {

		//if (node.childNodes[i].nodeType == 3 && this.is_ws(node.childNodes[i]))
		if (node.childNodes[i].splitText !== undefined && this.is_ws(node.childNodes[i]))
			nodesToDelete[nodesToDelete.length] = node.childNodes[i];
		if (node.childNodes[i].hasChildNodes())
			this.findWhiteSpace(node.childNodes[i], i);
	}
	node = node.parentNode;
	i = nodeNo;
};

/////////////////////////////////////

var XMLTools = new cXMLTools();

/*
Needs DTD for XHTML with <obj> tags because of MSIE template parsing thru XMLparser
and problem with &nbsp; and such entities

var text =
'<?xml version="1.0" encoding="utf-8"?>'+
//'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">'+
'<html xmlns="http://www.w3.org/1999/xhtml"><body>prdelni &nbsp; opice</body></html>';

var xmlDoc = XMLTools.XMLDoc();// new ActiveXObject("Microsoft.XMLDOM");
	xmlDoc.async = "false";
//if (!xmlDoc.loadXML(text))
if (!xmlDoc.load('test.xml'))
	alert(	"Error code: "+ xmlDoc.parseError.errorCode +
            "\nLine: " + xmlDoc.parseError.line +
			"\nReason: "+ xmlDoc.parseError.reason +
			"\n" + xmlDoc.parseError.srcText);

alert(xmlDoc.getElementsByTagName('body')[0]);
*/