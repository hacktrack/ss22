function obj_domainlimits(){};

var _me = obj_domainlimits.prototype;

/**
 * @brief:
 * @date : 01.12.2014
 **/
_me.__constructor = function(){
};


_me._load = function(e,aData) {
	var me = this;

	var view = this._view = new DomainLimitsView(this);
	view.addSaveButton();
	view.draw();

	try
	{

		var parent=this._parent;
		
		log.log('Domain limits should be loaded');
		
		// Hide sections which are globally disabled
		if(!global._accounts_global_domains_useuserlimits){
			this._getAnchor('fs_user_limits').setAttribute('is-hidden','1');
		}
		if(!global._accounts_global_domains_useexpiration){
			this._getAnchor('fs_domain_expiration').setAttribute('is-hidden','1');
		}		
		if(!global._accounts_global_domains_usediskquota){
			this._getAnchor('fi_domain_disk_quota').setAttribute('is-hidden','1');
		}
		if(!global._accounts_global_domains_usedomainlimits){
			this._getAnchor('fi_domain_daily_send_out_limit').setAttribute('is-hidden','1');
			addcss(this._getAnchor('domain_daily_send_out_limit'),'hide');
		}

		this.toggle_domain_notify_before_expiration._disabled(true);
		this.toggle_domain_delete_domain_when_expired._disabled(true);
		
		// Expires on toggle enables Notify before and Delete expired
		this.toggle_domain_expires_on._onchange = function(status){
			me.toggle_domain_notify_before_expiration._disabled(!status);
			me.toggle_domain_delete_domain_when_expired._disabled(!status);
		}
		
	}
	catch(e){
		log.error(e);
	}

	var domain = new Domain(location.parsed_query.domain);
	domain.getProperties([
		'd_volumelimit',
		'd_accountnumber',
		'd_diskquota',
		'd_disablelogin',
		'd_usermb',
		'd_expires',
		'd_expireson_date',
		'd_notifyexpire',
		'd_notifybeforeexpires',
		'd_deleteexpired',
		
		'd_usermailbox',
		'd_usermsg',
		'd_numberlimit',
		'd_usernumber',
		'd_spamdeleteolder'
	],function(limit){
		this._data = limit;
		// Domain limits
		this.input_domain_maximum_number_of_accounts._setValue(limit.d_accountnumber);

		this.toggle_domain_disk_quota._checked(limit.d_diskquota>0);
		this.input_domain_disk_quota._setValue(limit.d_diskquota);

		this.toggle_domain_daily_send_out_limit._checked(limit.d_volumelimit>0 || limit.d_numberlimit>0);
		this.input_domain_daily_data_limit._setValue(limit.d_volumelimit);
		this.input_domain_daily_message_count_limit._setValue(limit.d_numberlimit);

		this.toggle_domain_disable_login._setValue(limit.d_disablelogin);

		// Domain expiration
		this.toggle_domain_expires_on._setValue(limit.d_expires, false);
		this.input_domain_expires_on._setValue(limit.d_expireson_date);

		this.toggle_domain_notify_before_expiration._setValue(limit.d_notifyexpire);
		this.input_domain_notify_before_expiration._setValue(limit.d_notifybeforeexpires);
		this.toggle_domain_delete_domain_when_expired._setValue(limit.d_deleteexpired);

		// User limits
		this.input_domain_account_size._setValue(limit.d_usermailbox);
		this.input_domain_default_max_message_size._setValue(limit.d_usermsg);

		this.toggle_domain_default_daily_send_out_limit._checked(limit.d_usermb>0 || limit.d_usernumber>0);
		this.input_domain_user_daily_data_limit._setValue(limit.d_usermb);
		this.input_domain_user_daily_message_count_limit._setValue(limit.d_usernumber);

		this.input_delete_spam_older_than._setValue(limit.d_spamdeleteolder);
		this.toggle_delete_spam_older_than._checked(limit.d_spamdeleteolder>0);

	}.bind(this));
}

_me._issaved = function(target) {
	return !this._data.hasChanged();
}

_me._save = function(callback){
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

var DomainLimitsView = function(controller) {
	this._control = controller;

}
DomainLimitsView.prototype = Object.create(CoreView.prototype);
DomainLimitsView.prototype.draw = function() {
	var ctrl = this._control;

	ctrl._draw('obj_domainlimits', '', {});

	// UI behaviour
	ctrl.toggle_delete_spam_older_than._onchange = function(state) {
		if(!state) {
			ctrl._data.d_spamdeleteolder.value = 0;
			ctrl.input_delete_spam_older_than._value('');
		}
	}
	ctrl.toggle_domain_disk_quota._onchange = function(state) {
		if(!state) {
			ctrl._data.d_diskquota.value = 0;
			ctrl.input_domain_disk_quota._value('');
		}
	}
	ctrl.toggle_domain_daily_send_out_limit._onchange = function(state) {
		if(!state) {
			ctrl._data.d_volumelimit.value = 0;
			ctrl.input_domain_daily_data_limit._value('');
			ctrl._data.d_numberlimit.value = 0;
			ctrl.input_domain_daily_message_count_limit._value('');
		}
	}
	ctrl.toggle_domain_default_daily_send_out_limit._onchange = function(state) {
		if(!state) {
			ctrl._data.d_usermb.value = 0;
			ctrl.input_domain_user_daily_data_limit._value('');
			ctrl._data.d_usernumber.value = 0;
			ctrl.input_domain_user_daily_message_count_limit._value('');
		}
	}

}
