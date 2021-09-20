_me = frm_confirm_threestates.prototype;
function frm_confirm_threestates(){};

_me.__constructor = function(aResponse, sLabel1, sLabel2, aSubstitution, sOKLabel, sCancelLabel, sCancel2Label) {
	var me = this;

	// aResponse, sLabel1, sLabel2 and aSubstitution is handled in parent

	// Create 'OK' button
	this.x_btn_ok._value(sOKLabel || '');
	this.x_btn_ok._onclick = function() {
		executeCallbackFunction(aResponse, true);
		me._destruct();
	};

	// Redefine 'CANCEL1' button
	this.x_btn_cancel._value(sCancelLabel || '');
	this.x_btn_cancel._onclick = function() {
		executeCallbackFunction(aResponse, false);
		me._destruct();
	};

	// Create 'CANCEL2' button
	this._create('x_btn_cancel2', 'obj_button', 'footer','noborder simple cancel');
	this.x_btn_cancel2._tabIndex();
	this.x_btn_cancel2._value(sCancel2Label || 'FORM_BUTTONS::CANCEL');
	this.x_btn_cancel2._onclick = function() { me._destruct() };
};