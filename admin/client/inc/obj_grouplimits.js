function obj_grouplimits(){};
var _me = obj_grouplimits.prototype;

/**
 * @brief:
 * @date : 01.12.2014
 **/
_me.__constructor = function(s){
	storage.library('wm_user');
};

_me._load = function(group) {
	log.log('Group limits for group '+group);
	
	var view = this._view = new GroupLimitsView(this);
	view.addSaveButton();

	var group = new Account(group || location.parsed_query.account);
	group.getProperties(['g_maxbox','g_maxboxsize','g_maxmessagesize'],function(p){
		this._data = p;

		view.draw();
		view.fill(p);

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
	this._view.fill(this._data);
}

/* View */

var GroupLimitsView = function(controller) {
	this._control = controller;

}
GroupLimitsView.prototype = Object.create(CoreView.prototype);
GroupLimitsView.prototype.draw = function(data) {
	var ctrl = this._control;

	data = data || {};
	this._control._draw('obj_grouplimits', '', {items: data});
}
GroupLimitsView.prototype.fill = function(data) {
	var ctrl = this._control;
	ctrl.toggle_account_quote_enabled._setValue(data.g_maxbox);
	ctrl.input_account_quote_enabled._setValue(data.g_maxboxsize);
	ctrl.input_max_file_size._setValue(data.g_maxmessagesize);
}
