_me = obj_storage_usage.prototype;
function obj_storage_usage() {}

_me.__constructor = function (quota, usage, id) {
	this._draw('obj_storage_usage');

	var label = '';
	quota = (quota || 0) * 1024;
	usage = (usage || 0) * 1024;
	if (quota) {
		this.progress._range(quota);
		this.progress._value(usage);
		this.progress._title(100 / quota * usage > 90 ? getLang('USAGE::ALMOST_FULL') : '');
		label = getLang('USAGE::LABEL', [this._format(usage), this._format(quota)]);
	} else {
		label = getLang('USAGE::LABEL2', [this._format(usage)]);
		this._getAnchor('progress').classList.add('no-progress');
	}
	this._getAnchor('label').textContent = label;

	this._getAnchor('manage').onclick = function () {
		gui._create('storage', 'frm_storage', '', '', id, quota, usage);
	};
};

_me._format = function (bytes, decimals) {
	if (!bytes) {
		return '0 B';
	}
	var i = Math.floor(Math.log(bytes) / Math.log(1024));
	return parseFloat((bytes / Math.pow(1024, i)).toFixed(decimals || 1)) + ' ' + ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'][i];
};
