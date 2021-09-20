storage.library('old-communication', 'icewarpapi/old-communication');

(function (scope) {
	var index = 0;
	var default_host = '//' + location.host + '/icewarpapi/';
	var OldCommunication = scope.OldCommunication;
	var connection;

	/**
	 * Create new IceWarpAPI connection
	 * @param {Object} options
	 * @param {String} options.session_id Session under which to authenticate IceWarpAPI connection
	 * @param {String} [option.host] default is `/icewarpapi`
	 */
	scope.IceWarpAPI = function (options) {
		var authenticateRetries = 0;

		options = options || {};
		options.host = options.host || default_host;

		connection = new OldCommunication(OldCommunication.XHR, 'icewarpapi_' + index++, {
			host: options.host,
			xmlns: 'admin:iq:rpc'
		});

		function authenticate(callback) {
			connection.iq.removeAttribute('sid');
			connection.send({
				commandname: 'authenticatewebclient',
				commandparams: {
					webclientsessionid: dataSet.get('main', ['sid'])
				}
			}, {
				success: function (result, response) {
					authenticateRetries = 0;
					if (result == 0) {
						return scope.Callback(scope.Callback.ERROR, callback);
					}
					connection.iq.addAttribute('sid', response._attributes.sid);
					scope.Callback(scope.Callback.SUCCESS, callback, connection);
				},
				error: function (error) {
					if (error === 'unspecified' && authenticateRetries++ < 5) {
						return authenticate(callback);
					}
					console.error(error);
				},
				context: this
			});
		}

		return {
			authenticate: authenticate,
			send: function (data, callback) {
				connection.send(data, {
					success: function (response) {
						scope.Callback(scope.Callback.SUCCESS, callback, response);
					},
					error: function (error) {
						if (error === 'session_invalid') {
							return authenticate({
								success: function() {
									this.send(data, callback);
								},
								context: this
							});
						}
						scope.Callback(scope.Callback.ERROR, callback, error);
					},
					context: this
				});
			}
		}
	};
})(window);
