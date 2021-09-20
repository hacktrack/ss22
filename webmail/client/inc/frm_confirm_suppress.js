_me = frm_confirm_suppress.prototype;
function frm_confirm_suppress(){};

/**
 * CONFIRM with possibility to suppress repeated questions (with checkbox "Do not ask again")
 * "do not show"-state is saved in Cookie for this particular message (if set alert will be
 * prevented already before being created in gui). Inherits from frm_confirm.
 *
 * Martin Ekblom 2013
 */

_me.__constructor = function(aResponse, sLabel1, sLabel2, aSubstitution) {
	var aPath;

	// Content of Suppress Alert must be localazition string (not translated)
	if(sLabel2 && sLabel2.indexOf('::')) {
		this.obj_label._value(getLang(sLabel2, aSubstitution));
		aPath = sLabel2.toLowerCase().split('::');
	}
	else
		return false;

	// Create checkbox for remembering suppress state, do not ask again
	this._create('conceal','obj_checkbox','message','','CONFIRMATION::SUPPRESS');
	this.conceal._onclick = function(e) {
		Cookie.set(['suppressed',aPath[0],aPath[1]],this._value()?0:1);
	};

	// Resize to fit message
	this._size(400,this._getAnchor('message').offsetHeight + 120,true);
};