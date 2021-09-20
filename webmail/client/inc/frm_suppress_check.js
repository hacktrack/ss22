/*
 Do not create Suppressed Alerts and Confirmations

 @used:	frm_alert_suppress
		frm_confirm_suppress
*/			
function frm_suppress_check(sLabel2){};
frm_suppress_check.prototype.__constructor = function(aResponse, sLabel1, sLabel2, aSubstitution){
	return false;

	if (typeof sLabel2=="string" && sLabel2.indexOf('::')) {
		var aPath = sLabel2.toLowerCase().split('::');
		if (Cookie.get(['suppressed',aPath[0],aPath[1]])) {
			executeCallbackFunction(aResponse);	// Call callback as if user had clicked ok
			return false;	// Do not create suppressed alerts or confirms
		}
	}
};