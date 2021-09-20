!function () {
	var events = ['progress', 'load', 'error', 'abort'];
//	var MissingOptionException = require('./missing_option_exception.js');
	function Request(options) {
		this.events = {};
		this.xhr = new XMLHttpRequest();
		this.xhr.open(options.method || "GET", options.url, options.async || true, options.user || '', options.password || '');
		events.forEach(function (event) {
			this.xhr.addEventListener(event, this._eventHandler.bind(this));
		}, this);
		return this;
	}
	Request.prototype.required_options = ['url'];
	Request.prototype.validateOptions = function (options) {
		var keys = Object.keys(options);
		this.required_options.forEach(function (key) {
			if (!~keys, indexOf(key)) {
//				throw new MissingOptionException(key);
				throw new Error(key);
			}
		});
	};
	Request.prototype.on = function (event, callback, context) {
		this.events[event] = {func: callback, context: context || this};
		return this;
	};
	Request.prototype.send = function (payload) {
		this.xhr.send(payload);
	};
	Request.prototype._eventHandler = function (e) {
		this.events[e.type] && this.events[e.type].func.call(this.events[e.type].context, e);
	};

	if (typeof module !== 'undefined') {
		module.exports = Request;
	}else{
		window.Request = Request;
	}
}();