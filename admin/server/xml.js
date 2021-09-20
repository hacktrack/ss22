function buildUrl(varList) {
   var separator = '';
   var url = '';
   for ( name in varList ) {
       url += separator + encodeURIComponent(name)
                 + '=' + encodeURIComponent(varList[name]);
       separator = '&';
   }
   return url;
}

function createXMLFromString (string) {
  var xmlDocument,xmlParser;
  try {
    xmlDocument = new ActiveXObject('Microsoft.XMLDOM');
    xmlDocument.async = false;
    xmlDocument.loadXML(string);
    return xmlDocument;
  }
  catch (e) {
    xmlParser = new DOMParser();
    xmlDocument = xmlParser.parseFromString(string, 'text/xml');
    return xmlDocument;
  }
}

//////////////////////////////////
// Function loads new JS from file
// Author: DRZ 03.10.2005
//////////////////////////////////
function addSCRIPT(path){
  var jsx = new XMLQuery(path,'','','GET');
  jsx.XMLExecute();
  var resp = jsx.xmlhttp.responseText;
  if(resp){
    if(typeof execScript == 'object')
       // MSIE window.eval doesnt work in MSIE
       window.execScript(resp);
    else
       window.eval(resp);
  }
}
/************* XMLQuery ****************/

function XMLQuery(XMLpath,XMLresponse,XMLdata,requestType)
{
   this.XMLdata = XMLdata || null;
   this.XMLresponse = XMLresponse;
   this.XMLpath = XMLpath;
   this.requestType = requestType || 'POST';

   //prepare request
   if(window.XMLHttpRequest)
            this.xmlhttp = new XMLHttpRequest();
   else if(!navigator.__ice_version && window.ActiveXObject)
            this.xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
   else{
           alert("ERR: XML or ActiveX disabled!"); return false;
   }
}

XMLQuery.prototype.XMLExecute = function(){

        var xmlhttp = this.xmlhttp;
        var XMLresponse = this.XMLresponse;
        var XMLpath = this.XMLpath;


        if(this.TXTdata)
        {
           this.XMLdata = createXMLFromString(this.TXTdata);
           delete this.TXTdata;
        }

        if(typeof XMLpath == 'undefined') { alert('ERR: XML NO path'); return false;}

        xmlhttp.open(this.requestType, XMLpath, XMLresponse?true:false);
        xmlhttp.send(this.XMLdata);

        delete this.XMLdata;

        if(!XMLresponse) return;

           xmlhttp.onreadystatechange = function () {
                 if (xmlhttp.readyState == 4) {
                   //xmlhttp.responseText
                   if (xmlhttp.status && xmlhttp.status!=200)
                     alert('ERR: XML '+XMLpath+' returned '+xmlhttp.status);
                   else
                     eval(XMLresponse);
                 }
           }

}