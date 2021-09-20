function obj_changepwd() {};

obj_changepwd.prototype.__constructor = function () {
	storage.library('wm_user');
	this.__policies = [];
};

obj_changepwd.prototype._load = function () {
	this._draw('obj_changepwd', '', {
		items: {}
	});

	com.properties.getWebmailResources('password_policy', function (aResult) {
		var items = [];

		log.info(aResult);

		try {
			items = aResult.list[0].list[0].list;
			this._getAnchor('pwdp').removeAttribute('is-hidden');
		} catch (e) {
			this._getAnchor('pwdp').setAttribute('is-hidden', '');
		}

		items.forEach(function (item) {
			var name = item.name.toString();
			var value = +item.value;
			var anchor = this._getAnchor('pwdp_' + name);
			this.__policies[name] = value;
			switch (name) {
				case 'user_alias':
					if (item.value) {
						anchor.removeAttribute('is-hidden');
					}
					break;
				case 'min_length':
				case 'numeric_chars':
				case 'non_alpha_num_chars':
				case 'alpha_chars':
				case 'upper_alpha_chars':
					if (value) {
						anchor.removeAttribute('is-hidden');
						anchor.querySelector('span').textContent = value;
					}
			}
		}, this);
	}.bind(this));

	this.timeout = setInterval(function () {
		if (storage.css_status('obj_changepwd')) {
			clearInterval(this.timeout);
		}
	}.bind(this), 100);
};

obj_changepwd.prototype._verify_password = function (new_pass, new_pass2) {
	if(new_pass.length < (this.__policies.min_length || 1)) {
		gui.message.error(getLang("error::password_too_short"), false);
		return false;
	}
	if(new_pass !== new_pass2) {
		gui.message.error(getLang("error::password_does_not_match"), false);
		return false;
	}
	if(this.__policies.user_alias && ~new_pass.indexOf(gui._globalInfo.email.split('@')[0])) {
		gui.message.error(getLang("error::password_contains_alias"), false);
		return false;
	}
	if(this.__policies.numeric_chars && (new_pass.match(/\d/g) || []).length < this.__policies.numeric_chars) {
		gui.message.error(getLang("error::password_numeric_chars"), false);
		return false;
	}
	if(this.__policies.non_alpha_num_chars && (new_pass.match(/[^A-Za-z0-9]/g) || []).length < this.__policies.non_alpha_num_chars) {
		gui.message.error(getLang("error::password_non_alpha_num_chars"), false);
		return false;
	}
	if(this.__policies.alpha_chars && (new_pass.match(/\w/g) || []).length < this.__policies.alpha_chars) {
		gui.message.error(getLang("error::password_alpha_chars"), false);
		return false;
	}
	if(this.__policies.upper_alpha_chars && (new_pass.match(/[A-Z]/g) || []).length < this.__policies.upper_alpha_chars) {
		gui.message.error(getLang("error::password_upper_alpha_chars"), false);
		return false;
	}

	return true;
};

obj_changepwd.prototype._save = function () {
	var old_pass = this.input_old_password._value();
	var new_pass = this.input_change_password._value();
	var new_pass2 = this.input_change_password_again._value();
	
	this._verify_password(new_pass, new_pass2) && com.user.change_user_password(gui._globalInfo.email, new_pass, old_pass, function (result) {
		if (result) {
			if (result.Array.IQ[0].QUERY[0].ERROR) {
				var message = result.Array.IQ[0].QUERY[0].ERROR[0].ATTRIBUTES.UID;
				if (message === 'auth_login_invalid') {
					message = 'wrong_password';
				}
				gui.message.error(getLang("error::" + message), false);

				return false;
			} else {
				gui._globalInfo.passwordexpired = false;
			}

			if (result.Array.IQ[0].QUERY[0].RESULT[0].VALUE == 0) {
				gui.message.error(getLang("error::save_unsuccessful"));
			} else {
				gui.message.toast(getLang("message::save_successfull"));
			}
			this._parent._parent._close();
		} else {
			this._getAnchor('error').removeAttribute('is-hidden');
		}
	}.bind(this));
};
