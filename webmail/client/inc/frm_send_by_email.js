function frm_send_by_email() {};

frm_send_by_email.prototype.__constructor = function (aHandler, sEmails, bIsModal) {
	var me = this;
	this.__sEmails = sEmails;
	this._modal(bIsModal);
	this._resizable(false);

	this._title(getLang('COLLABORATION::SEND_BY_EMAIL'), true);

	this._draw('frm_send_by_email', 'main');

	this._size(700, 'auto', true);

	this._fill();

	this.send._onclick = function () {
		executeCallbackFunction(aHandler, me.to._value().split(',').filter(Boolean));
		me._destruct();
	};
	this.address_book._onclick = function () {
		gui._create('address_book', 'frm_addaddress', '', '', [me, '__onAddNewFromAddressbook'], ['ADDRESS_BOOK::SELECTED_ADDRESSES'], void 0, void 0, void 0, void 0, true, me._isModal());
	};
};

frm_send_by_email.prototype._fill = function () {
	this.to._value(this.__sEmails || '');
};

frm_send_by_email.prototype.__onAddNewFromAddressbook = function (bOK, aAddresses) {
	if (bOK && aAddresses && aAddresses[0]) {
		var emails = this.to._value().split(',');
		for (var i in aAddresses[0]) {
			emails.push(aAddresses[0][i]);
		}
		this.__sEmails = emails.filter(function(v, i, s) { 
			return s.indexOf(v) === i;
		}).join(',');

		this._fill();
	}
};
