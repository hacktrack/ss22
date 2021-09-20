_me = frm_input.prototype;
function frm_input(){};

/**
 * @brief
 *
 * @see  IM/new group
 */
_me.__constructor = function(aResponse, sLabel1, sLabel2, sLabel3) {

	var me = this;

	this._size(300,145,true);
    this._resizable(false);
    this._dockable(false);
	this._modal(true);

	this._draw('frm_input','main');
	this._create('obj_input','obj_input','input','obj_input_100');

	this.obj_input._onsubmit = function (){
		me.x_btn_ok._onclick();
	};
	this.obj_input._onclose = function (){
		me.x_btn_cancel._onclick();
	};

	if (sLabel1) this._title(sLabel1);
	if (sLabel2) this.obj_input._value(sLabel2);
	if (sLabel3) this.obj_input._placeholder(sLabel3);

	// Create 'OK' button
	this.x_btn_ok._onclick = function() {
		executeCallbackFunction(aResponse,me.obj_input._value());
		me._destruct();
	};

	this.obj_input._focus();
};