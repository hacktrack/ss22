_me = frm_confirm.prototype;
function frm_confirm(){};

/**
 * @brief
 *
 * @see  objects/frm_select_folder.xml
 * @see  inc/frm_select_folder.js
 * @see  forms/select_folder.xml
 * @see  inc/obj_context_folder.js
 * @see  inc/obj_context_item.js
 */

_me.__constructor = function(aResponse, sLabel1, sLabel2, aSubstitution) {
	var me = this;

	this._size(400,200,true);

	this._resizable(false);
	// this._closable(false);
	this._dockable(false);
	this._modal(true);

	this._draw('frm_confirm', 'main');

	this.obj_label._onchange = function(elm){
		me._size(400,this._main.offsetHeight + 120,true);
	};

	if (sLabel1) this._title(sLabel1);
	if (sLabel2)
		this.obj_label._value(getLang(sLabel2, aSubstitution));
	else
	if (aSubstitution)
		this.obj_label._value(aSubstitution);

    // Create 'OK' button
	this._create('x_btn_ok', 'obj_button', 'footer', 'ok color1 noborder');
	this.x_btn_ok._tabIndex();
	this.x_btn_ok._value('FORM_BUTTONS::OK');
	this.x_btn_ok._onclick = function() {
		this._disabled(true);
		executeCallbackFunction(aResponse);
		me._destruct();
	};

	// Create 'CANCEL' button
	this._create('x_btn_cancel', 'obj_button', 'footer', 'cancel noborder');
	this.x_btn_cancel._tabIndex();
	this.x_btn_cancel._value('FORM_BUTTONS::CANCEL');
	this.x_btn_cancel._onclick = function() {me._destruct()};

	this.x_btn_ok._focus();

};