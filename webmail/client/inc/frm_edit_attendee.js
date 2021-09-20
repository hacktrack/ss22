_me = frm_edit_attendee.prototype;
function frm_edit_attendee() {};

_me.__constructor = function(sFormName, sTitle, aResponse, aValues, sID, bAttendee) {
	var me = this;

	this._title(sTitle);
	this._size(350,250,true);
	this._draw(sFormName, 'main');
	this._modal(true);

	if (bAttendee){
		this.CNTCONTACTNAME._disabled(true);
		this.CNTEMAIL._disabled(true);
		this.CNTROLE._disabled(true);
		this.CNTSTATUS._disabled(true);
	}

	this._sID = sID;

	this._create('x_ok','obj_button','footer','ok noborder');
	this.x_ok._value('FORM_BUTTONS::OK');
	this.x_ok._disabled(true);
	this.x_ok._onclick = function() {
        if ((me.CNTEMAIL && me.CNTEMAIL._checkError.length) || (me.LCTEMAIL1 && me.LCTEMAIL1._checkError.length))
            return;

		executeCallbackFunction(aResponse, me._value(), me._sID);
		me._destruct();
	};

	this._create('x_cancel','obj_button','footer','cancel noborder');
	this.x_cancel._value('FORM_BUTTONS::CANCEL');
	this.x_cancel._onclick = function() { me._destruct() };

	if (!bAttendee){
		if (this.CNTEMAIL)
			this.CNTEMAIL._onerror = function(b){
				me.x_ok._disabled(b);
			};

		if (this.LCTEMAIL1)
			this.LCTEMAIL1._onerror = function(b){
				me.x_ok._disabled(b);
			};
	}

	if (Is.Object(aValues))
		this._value(aValues);
};

_me._value = function (aValues) {
	if (Is.Object(aValues))
		loadDataIntoForm(this, aValues);
	else {
		var aValues = {};
		storeDataFromForm(this,aValues);
		return aValues;
	}
};