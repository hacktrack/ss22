function obj_troubleshooting() {};

obj_troubleshooting.prototype.__constructor = function () {
	this._render();
};

obj_troubleshooting.prototype._render = function () {
	var ts = Cookie.get(['troubleshooting']);
	if (ts && ts.timestamp && (ts.timestamp * 1000 < +new Date())) {
		auth.deleteTroubleshooting(ts.session); // remove outdated troubleshooting session
		ts = false;
	}

	this._clean();
	this._draw('obj_troubleshooting', '', ts && {
		link: location.origin + location.pathname + '?sid=' + ts.session,
		validity: new IcewarpDate(new Date(ts.timestamp * 1000)).format('D/M/Y HH:mm:ss')
	});

	(this.generate || {})._onclick = function () {
		auth.troubleshootingSession(this.validity._value(), [this, '_render']);
	}.bind(this);

	(this.remove || {})._onclick = function () {
		auth.deleteTroubleshooting(ts.session, [this, '_render']);
	}.bind(this);
};
