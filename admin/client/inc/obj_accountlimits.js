function obj_accountlimits(){};

var _me = obj_accountlimits.prototype;

/**
 * @brief:
 * @date : 01.12.2014
 **/
_me.__constructor = function(s){
	var me = this;
	storage.library('wm_user');
};


_me._load = function(domain) {
	var me = this;

	log.log('Load list of users for domain '+domain);

	var view = this._view = new AccountLimitsView(this);
	view.addSaveButton();
	view.draw();

	this.toggle_expires_on._onchange=function(checked){
		me.input_expires_on._disabled(!checked);
	}
	
	this.dropdown_expiration_status._fill({
		'0':getLang("accountdetail::enabled"),
		'1':getLang("accountdetail::disabled_login"),
		'2':getLang("accountdetail::disabled_login_receive"),
		'3':getLang("accountdetail::spam_trap")
	});
	
	var user = new Account(location.parsed_query.account);
	user.getProperties([
		// Limits
		'u_maxbox','u_maxboxsize',
		'u_numbersendlimit','u_megabytesendlimit',
		'u_maxmessagesize',
		'u_deleteolder','u_deleteolderdays',
		'u_spamdeleteolder',
		'u_localdomain',
		'u_accounttype',
		// Expiration
		'a_state',
		'u_inactivefor',
		'u_accountvalid','u_accountvalidtill_date',
		'u_validityreport','u_validityreportdays',
		'u_deleteexpire'
	],function(p){
		this._data = p;

		// Disk Quota
		this.toggle_account_quote_enabled._setValue(p.u_maxbox);
		this.input_account_quote_enabled._setValue(p.u_maxboxsize);
		// Daily Send Limits, hide completely if no access
		if(p.u_megabytesendlimit.denied && p.u_numbersendlimit.denied) {
			this.toggle_send_out_limit._hide(true);
		} else {
			this.toggle_send_out_limit._checked(p.u_megabytesendlimit>0 || p.u_numbersendlimit>0);
			this.input_send_out_data_limit._setValue(p.u_megabytesendlimit);
			this.input_send_out_message_limit._setValue(p.u_numbersendlimit);
		}
		// Max Message Size
		this.input_max_message_size._setValue(p.u_maxmessagesize);
		// Delete Older Mail
		this.toggle_delete_mail_older_than._setValue(p.u_deleteolder);
		this.input_delete_mail_older_than._setValue(p.u_deleteolderdays);
		// Delete Older Spam
		this.toggle_delete_spam_older_than._checked(p.u_spamdeleteolder>0);
		this.input_delete_spam_older_than._setValue(p.u_spamdeleteolder);
		// Local Domains Only
		this.toggle_user_can_send_to_local_domains_only._setValue(p.u_localdomain);
		// Account Type is a three state toggle
		var v = p.u_accounttype.value;
		this.toggle_disable_access_to_pop3._setValue(p.u_accounttype.value);
		if(v==0) {
			this.toggle_disable_access_to_pop3._disabled(true);
		} else {
			this.toggle_disable_access_to_pop3._checked(v==2);
		}

		// Account expiration
		this.dropdown_expiration_status._setValue(p.a_state.state);
		this.input_expires_if_inactive_for._setValue(p.u_inactivefor);
		this.toggle_expires_on._setValue(p.u_accountvalid);
		this.input_expires_on._setValue(p.u_accountvalidtill_date);
		this.toggle_notify_before_expiration._setValue(p.u_validityreport);
		this.input_notify_before_expiration._setValue(p.u_validityreportdays);
		this.toggle_delete_account_when_expired._setValue(p.u_deleteexpire);

		// Disable expiry date input if expiry not applied
		this.input_expires_on._disabled(!this.toggle_expires_on._checked());

	}.bind(this));

}

_me._issaved = function(target) {
	return !this._data.hasChanged();
}

_me._save = function(callback) {
	var view = this._view;

	if(this._data.hasChanged()) {
		this._data.saveChanges(function(r){
			view.saveNotification(r==1);
			if(callback) {
				callback(r==1);
			}
		});
	}

}

_me._reset = function() {
	this._data.revertChanges();
}


/* View */

var AccountLimitsView = function(controller) {
	this._control = controller;

}
AccountLimitsView.prototype = Object.create(CoreView.prototype);
AccountLimitsView.prototype.draw = function() {
	var ctrl = this._control;

	ctrl._draw('obj_accountlimits', '', {});

	ctrl.input_account_quote_enabled._maxunit('GB');
	
	// UI behaviour
	ctrl.toggle_delete_spam_older_than._onchange = function(state) {
		if(!state) {
			ctrl._data.u_spamdeleteolder.value = 0;
			ctrl.input_delete_spam_older_than._value('');
		}
	}
	ctrl.toggle_send_out_limit._onchange = function(state) {
		if(!state) {
			ctrl._data.u_megabytesendlimit.value = 0;
			ctrl.input_send_out_data_limit._value('');
			ctrl._data.u_numbersendlimit.value = 0;
			ctrl.input_send_out_message_limit._value('');
		}
	}
	ctrl.toggle_disable_access_to_pop3._onchange = function(state) {
		ctrl._data.u_accounttype.value = state+1;
	}

}
