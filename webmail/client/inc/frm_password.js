_me = frm_password.prototype;
function frm_password(){};

/**
 * @brief
 * 
 * @see  Options/security password
 */
_me.__constructor = function(aResponse, sLabel1, sLabel2, sPlaceholder) {

	var me = this;

	this._size(250,145,true);
    this._resizable(false);
	this._dockable(false);
	this._modal(true);
    
    this._draw('frm_input','main');
	this._create('obj_input','obj_password','input','obj_input_100');

    this.obj_input._focus();
	this.obj_input._onsubmit = function (){
		me.x_btn_ok._onclick();
	};
	this.obj_input._onclose = function (){
		me.x_btn_cancel._onclick();
	};
	
	if (sLabel1) this._title(sLabel1);
	if (sLabel2) this.obj_input._value(sLabel2);
	this.obj_input._onchange = function() {
		this.x_btn_ok._disabled(!this.obj_input._value());
	}.bind(this);
	this.x_btn_ok._disabled(!this.obj_input._value());
	if (sPlaceholder) this.obj_input._placeholder(sPlaceholder);

	// Create 'OK' button
	this.x_btn_ok._onclick = function() {
		executeCallbackFunction(aResponse,me.obj_input._value());
		me._destruct();
	};
};
