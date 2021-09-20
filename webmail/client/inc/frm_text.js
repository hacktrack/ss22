_me = frm_text.prototype;
function frm_text(){};

/**
 * @brief
 * 
 * @see  IM/new group
 */
_me.__constructor = function(aResponse, sLabel1, sLabel2) {

	var me = this;

	this._size(400,300,true);
    this._resizable(false);
    this._dockable(false);
	this._modal(true);
    
	this._draw('frm_input','main');
	this._create('obj_input','obj_text','input','obj_text100');	

	this.obj_input._onsubmit = function (){
		me.x_btn_ok._onclick();
	};
	this.obj_input._onclose = function (){
		me.x_btn_cancel._onclick();
	};
	
	if (sLabel1) this._title(sLabel1);
	if (sLabel2) this.obj_input._value(sLabel2);

	// Create 'OK' button
	this.x_btn_ok._onclick = function() {
		if (aResponse)
			executeCallbackFunction(aResponse,me.obj_input._value());
		
		me._destruct();
	};

	this.obj_input._focus();
};