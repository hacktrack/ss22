_me = frm_pdf.prototype;
function frm_pdf(){};

/**
 * License
 */
_me.__constructor = function() {
	this._defaultSize(-1,-1,900,620);
	this._title('ATTACHMENT::PDF');

	this._create('frame','obj_frame');
};

_me._load = function(url,sTitle){
	if (url){

		if (url.indexOf('http')!=0)
			url = '../../../../' + url;

		this.frame._src('client/inc/pdfjs/web/?'+ buildURL({file:url + (sTitle?'#'+sTitle:''), lang:GWOthers.getItem('LAYOUT_SETTINGS','language')}) );

		if (sTitle)
			this._title(sTitle, true);
	}
};