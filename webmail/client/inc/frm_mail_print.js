_me = frm_mail_print.prototype;
function frm_mail_print(){};

/**
 *
 */
_me.__constructor = function(aResponse, aOpt) {
	var me = this;

	this._size(450,300,true);
	//this._modal(true);
	this._dockable(false);
	this._resizable(false);

    this._draw('frm_mail_print', 'main', aOpt);

	this._title('PRINT::OPTIONS');

	//Cookies
	var c = Cookie.get(['mailview_print']);
	for(var sObj in c)
		if (this[sObj] && this[sObj]._checked)
			this[sObj]._checked(true);

	// Create 'OK' button
	this._create('x_btn_ok', 'obj_button', 'footer', 'noborder ok color1');
	this.x_btn_ok._value('MAIN_MENU::PRINT');
	this.x_btn_ok._onclick = function() {

		var o = me._getChildObjects('', 'obj_checkbox'),
			aOpt = {};

		for(var i in o)
			if (o[i]._checked && o[i]._disabled() === false){
				aOpt[o[i]._name] = o[i]._checked();
				Cookie.set(['mailview_print',o[i]._name], aOpt[o[i]._name]?1:0);
			}

		me._destruct();
		executeCallbackFunction(aResponse, aOpt);
	};

	// Create 'CANCEL' button
	this._create('x_btn_cancel', 'obj_button', 'footer', 'cancel noborder simple');
	this.x_btn_cancel._value('FORM_BUTTONS::CANCEL');
	this.x_btn_cancel._onclick = function() { me._destruct(); };

	this.x_btn_ok._focus();
};