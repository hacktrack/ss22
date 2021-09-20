/*
#datagrid:
	r(items read)
	i(items write)
	w(items modify)
	t(items delete)
	l(folder read)
	k(folder write)
	m(folder modify)
	x(folder delete)
	a(admin/owner)

	b(GWR_TeamchatInvite)
	c(GWR_TeamchatKick)
	d(GWR_TeamchatEditFolder)
	e(GWR_TeamchatEditDocument)

	lrswipkcdextabcde

	SPCDET
*/
function frm_permissions() {};

/**
 * @param {Object} options
 * @param {String} options.permissions
 * @param {Boolean} options.teamchat
 * @param {Function} options.callback
 */
frm_permissions.prototype.__constructor = function (options) {
	this.__options = options || {};
	this.__options.permissions = this.__options.permissions || [];

	this._modal(true);
	this._size(500, 210, true);
	this._title(getLang('SHARING::PERMISSIONS'), true);

	this._draw('frm_permissions', 'main', {
		teamchat: this.__options.teamchat
	});

	this.__options.permissions.forEach(function (permission) {
		this[permission]._checked(true);
	}, this);

	// Create 'OK' button
	this._create('x_btn_ok', 'obj_button', 'footer', 'noborder color1 ok');
	this.x_btn_ok._value('FORM_BUTTONS::OK');
	this.x_btn_ok._onclick = this.__save.bind(this);

	// Create 'CANCEL' button
	this._create('x_btn_cancel', 'obj_button', 'footer', 'noborder cancel simple');
	this.x_btn_cancel._value('FORM_BUTTONS::CANCEL');
	this.x_btn_cancel._onclick = function () {
		this._destruct();
	}.bind(this);
};

frm_permissions.prototype.__save = function () {
	if (this.__options.callback) {
		var permissions = this._getChildObjects('', 'obj_checkbox').map(function (checkbox) {
			return checkbox._value() && checkbox._name;
		}).filter(Boolean);

		executeCallbackFunction([this.__options.callback], permissions);
	}
	this._destruct();
};
