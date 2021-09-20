function obj_oauth_wizard() {};

obj_oauth_wizard.prototype.__validate = function () {
	this._parent.btn_save._disabled(!this.input_name._value() || !this.input_description._value() || !this.input_redirect_uri._value());
};

obj_oauth_wizard.prototype._load = function (oauth) {
	this.__edit = oauth;
	this._draw('obj_oauth_wizard', false, {
		new: !oauth
	});

	this.dropdown_auth_type._fill(wm_oauth._AUTH_TYPES);
	this.input_name._onchange = this.__validate.bind(this);
	this.input_description._onchange = this.__validate.bind(this);
	this.input_redirect_uri._onchange = this.__validate.bind(this);

	if(oauth) {
		this.input_id._value(oauth.clientid);
		this.input_name._value(oauth.name);
		this.input_description._value(oauth.description);
		this.input_redirect_uri._value(oauth.redirecturi);
		this.dropdown_auth_type._value(oauth.authtype);
	}

	this.__validate();
};

obj_oauth_wizard.prototype._save = function () {
	var me = this;

	var data = {
		name: this.input_name._value(),
		description: this.input_description._value(),
		redirecturi: this.input_redirect_uri._value(),
		authtype: this.dropdown_auth_type._value()
	};
	if(this.__edit) {
		data.clientid = this.__edit.clientid;
	}

	com.oauth[this.__edit ? 'edit' : 'add'](data, function (success, response) {
		if (success) {
			gui.message.toast(getLang("message::save_successfull"));
			me._oauthList._load();
			me._close();

			var secret = ((response.SECRET || [])[0] || {}).VALUE;
			secret && gui.message.success(secret, getLang('OAUTH::SECRET'));
		} else {
			gui.message.error(getLang("error::action_failed"), getLang("error::failed"));
		}
	});
};
