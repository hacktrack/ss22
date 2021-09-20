_me = frm_alert.prototype;
function frm_alert(){};

/**
 * ALERT!!!
 */
_me.__constructor = function(aResponse, sLabel1, sLabel2, aSubstitution) {
	var me = this;

	this._size(450,150,true);
	this._modal(true);
	this._dockable(false);
	this._resizable(false);

    this._draw('frm_confirm', 'main');

	this._title(sLabel1 || 'ALERTS::ALERT');

	this.obj_label._onchange = function(elm){
		me._size(450,this._main.offsetHeight + 110,true);
	};

    if (typeof aSubstitution == 'string')
		this.obj_label._value(aSubstitution);
    else
	if (sLabel2)
		this.obj_label._value(getLang(sLabel2, aSubstitution));

	// Create 'OK' button
	this._create('x_btn_ok', 'obj_button', 'footer', 'noborder ok');
	this.x_btn_ok._value('FORM_BUTTONS::OK');
	this.x_btn_ok._onclick = function() {
		executeCallbackFunction(aResponse);
		me._destruct();
	};

	this.x_btn_ok._focus();

	this._onclose = function (bClose){
		if (bClose && aResponse)
			if (executeCallbackFunction(aResponse) === false)
				return false;

		return true;
	};
};