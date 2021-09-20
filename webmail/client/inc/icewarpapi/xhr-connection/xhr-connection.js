storage.library('request', 'icewarpapi/request');

(function (scope) {
	var IWAPIRequest = scope.IWAPIRequest;

	function onLoad(id, event, response) {
		this.onMessage && this.onMessage.func.call(this.onMessage.context || this, response.response || response.responseText, id);
	}

	function onError(id, event, response) {
		this.onError && this.onError.func.call(this.onError.context || this, id);
	}

	function XHRConnection(options) {
		options.listeners = options.listeners || {};
		this.onMessage = options.listeners.onmessage;
		this.onError = options.listeners.onerror;
		this.host = options.host;
	}

	XHRConnection.prototype.send = function (payload, id) {
		var request = new IWAPIRequest({
			url: this.host,
			method: "POST"
		});
		request.on('load', onLoad.bind(this, id));
		request.on('error', onError.bind(this, id));
		request.on('abort', onError.bind(this, id));
		request.send(payload);
	};

	scope.XHRConnection = XHRConnection;
})(window);
