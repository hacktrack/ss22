_me = frm_confirm_select.prototype;
function frm_confirm_select(){};

/**
 * @brief
 *
 *	Confirm popup with select dropdown
 */

_me.__constructor = function(aResponse, sLabel1, sLabel2, aSubstitution, aFill, sDefault, bCompulsory) {
	var me = this;

	// Create and fill dropdown select
	this._create('select','obj_select','message');
	this.select._fill(aFill);
	if(sDefault)
		this.select._value(sDefault);
	this.select._onchange = function() {
		me.x_btn_ok._disabled(false);
	}

	// Adjust size (height + header&footer + padding)
	this._size(400,this._getAnchor('message').offsetHeight+82+30,true);

	// Disable Ok button until chosen (if applicable)
	if(bCompulsory)
		me.x_btn_ok._disabled(true);

	// 'OK' button
	this.x_btn_ok._onclick = function() {
		this._disabled(true);
		me.select._disabled(true);
		executeCallbackFunction(aResponse,me.select._value());
		me._destruct();
	};

	// 'CANCEL' button
	this.x_btn_cancel._onclick = function() { me._destruct(); }

	this.x_btn_ok._onkeypress = this.x_btn_cancel._onkeypress = function(e){
		if (e.keyCode == 27)
			this._onclick();
	};
	this.x_btn_ok._focus();
};