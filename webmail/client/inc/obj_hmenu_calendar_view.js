function obj_hmenu_calendar_view() {}

obj_hmenu_calendar_view.prototype.__menu = function (ids) {
	// Check if work week is specified and not same as full week
	var bgn = GWOthers.getItem('CALENDAR_SETTINGS', 'workweek_begins'),
		end = GWOthers.getItem('CALENDAR_SETTINGS', 'workweek_ends'),
		workweek = bgn > 0 && end > 0 && !(bgn == 1 && end == 7);

	this.__sCurrentView = Cookie.get(['views', ids['aid'], ids['fid'], 'view']);
	this.__ids = ids;

	var aMenu = [
		this.__menuItem('day_view'),
		this.__menuItem('week_view'),
		workweek && this.__menuItem('workweek_view'),
		this.__menuItem('month_view')
	].filter(Boolean);

	var itm = this.__menuItem(this.__sCurrentView);
		itm.css = 'short';
		itm.nodes = clone(aMenu,true).map(function(v){
			v.css = 'ico2' + (this.__sCurrentView == v.arg?' check':'');
			return v;
		}, this);

	this._fill(aMenu.concat(itm), 'static');
};

obj_hmenu_calendar_view.prototype.__menuItem = function (sView) {
	return {
		title: 'MAIN_MENU::' + sView.toUpperCase(),
		arg: sView,
		css: this.__sCurrentView == sView ? 'active' : ''
	};
};

obj_hmenu_calendar_view.prototype._onclick = function (e, elm, id, sView) {
	executeCallbackFunction([gui.frm_main, '_selectView', [this.__ids, sView]]);
};
