storage.library('json-xml', 'icewarpapi/json-xml');

(function (scope) {
	var Json = scope.JsonXML;
	var processResponse = {};

	function processData(message) {
		var response = Json.fromXml(message.document.querySelector('iq'));
		if (response._attributes.type === 'error' || response.query.result === '0') {
			return this.callback(
				'error',
				message.callback,
				((response.query.error || {})._attributes || {}).uid || this.constructor.ERRORS.UNSPECIFIED,
				response
			);
		}
		this.callback('success', message.callback, response.query.result, response);
	}

	processResponse.onMessage = function (data, id) {
		processData.call(this, this.iq.getCallbacks(data, id));
	};
	processResponse.onError = function (id) {
		var iqs = [];
		if (id) {
			iqs = [this.iq.getCallbacksById(id)];
		} else {
			var iqs_obj = this.iq.getPendingIqs();
			for (var i in iqs_obj) {
				iqs.push(iqs_obj[i]);
			}
		}
		iqs.forEach(function (callback) {
			this.callback('error', callback, this.constructor.ERRORS.SERVER);
		}, this);
	};
	processResponse.onClose = function () {

	};
	processResponse.onOpen = function () {

	};

	scope.processResponse = processResponse;
})(window);
