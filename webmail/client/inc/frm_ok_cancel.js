_me = frm_ok_cancel.prototype;
function frm_ok_cancel(){};

_me.__constructor = function(){

	var me = this;

    // Create 'OK' button
	this._create('x_btn_ok', 'obj_button', 'footer', 'ok noborder color1');
	this.x_btn_ok._value('FORM_BUTTONS::OK');
	this.x_btn_ok._onclick = function() { me._destruct(); };

	// Create 'CANCEL' button
	this._create('x_btn_cancel', 'obj_button', 'footer', 'cancel noborder');
	this.x_btn_cancel._value('FORM_BUTTONS::CANCEL');
	this.x_btn_cancel._onclick = function() { me._destruct(); };
};
