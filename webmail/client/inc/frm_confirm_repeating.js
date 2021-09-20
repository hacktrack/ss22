_me = frm_confirm_repeating.prototype;
function frm_confirm_repeating(){};

/**
 * @brief: Confirm dialog for editing Events with Recurence
 *
 * Martin 20/5/2013: extended this a little to be used also for other choises (maybe better would be to generalise this to a frm_confirm_choises...)
 */
_me.__constructor = function(aResponse, sLabel1, sLabel2, aSubstitution, bNoFollowing, sButton1Label, sButton2Label) {

    this._draw('frm_confirm', 'main');

	var me = this;

	this._size(350,300,true);
    this._resizable(false);
    this._dockable(false);
	this._modal(true);

	if (sLabel1) this._title(sLabel1);

	if (sLabel2) this.obj_label._value(getLang(sLabel2, aSubstitution));

	// Create first button
	this._create('btn_0', 'obj_button', 'footer','button1 color1 max');
	this.btn_0._tabIndex();
	this.btn_0._value(sButton1Label || 'REPEATING_CONFIRM::BTN_THIS');
	this.btn_0._onclick = function() {
        executeCallbackFunction(aResponse,0);
        me._remove_destructor('_onclose');
		me._destruct();
	}
	
	// Create second button
	if (!bNoFollowing){
		this._create('btn_1', 'obj_button', 'footer','button3 max');
		this.btn_1._tabIndex();
		this.btn_1._value('REPEATING_CONFIRM::BTN_ALLFROMNOW');
		this.btn_1._onclick = function() {
	        executeCallbackFunction(aResponse,2);
	        me._remove_destructor('_onclose');
			me._destruct();
		}
	}

	// Create third button
	this._create('btn_2', 'obj_button', 'footer','button2 max');
	this.btn_2._tabIndex();
	this.btn_2._value(sButton2Label || 'REPEATING_CONFIRM::BTN_ALL');
	this.btn_2._onclick = function() {
        executeCallbackFunction(aResponse,1);
        me._remove_destructor('_onclose');
		me._destruct();
	}

	this.btn_0._focus();
};