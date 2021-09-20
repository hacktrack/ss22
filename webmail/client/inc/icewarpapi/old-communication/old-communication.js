storage.library('processResponse', 'icewarpapi/old-communication');
storage.library('callback', 'icewarpapi/callback');
storage.library('json-xml', 'icewarpapi/json-xml');
storage.library('iq-protocol', 'icewarpapi/iq-protocol');
storage.library('xhr-connection', 'icewarpapi/xhr-connection');

(function (scope) {
	var IQ = scope.IQProtocol;
	var Json = scope.JsonXML;
	var processResponse = scope.processResponse;
	var connections = {};
	var main = 'default';

	function createConnection(type) {
		this.setConnection(new OldCommunication.connections[type](this.getOptions()));
	}
	/**
	 * @class OldCommunication
	 * @param {number} type type of connection XHR|Scoket
	 * @param {string} name will be used as ke for storing this instance in global storage
	 * @param {object} options
	 * @returns {OldCommunication}
	 */
	function OldCommunication(type, name, options) {
		this.host = options.host;
		this.email = options.email;
		this.subscriptions = options.subscriptions || [];
		this.password = options.password;
		this.login_type = options.login_type || OldCommunication.PLAIN;
		this.send_type = options.send_type || OldCommunication.XML;
		options.iq_options = options.iq_options || {};
		options.iq_options.id_attr = options.iq_options.id_attr || 'uid';
		this.iq = new IQ(options.iq_options);
		this.iq.query.addAttribute('xmlns', options.xmlns || "admin:iq:rpc");
		options.session_id && this.iq.addAttribute('sid', options.session_id);
		createConnection.call(this, type);
		connections[name || main] = this;
	}
	/**
	 * @constant
	 * XHR connection
	 */
	OldCommunication.XHR = 1;
	/**
	 * @constant
	 * Socket connection
	 */
	OldCommunication.SOCKET = 2;
	/**
	 * @type {object}
	 * @static
	 * @description List of connection libs
	 */
	OldCommunication.connections = {};
	OldCommunication.connections[OldCommunication.XHR] = scope.XHRConnection;
	OldCommunication.connections[OldCommunication.SOCKET] = scope.Socket;

	/**
	 * @constant
	 * Plain auth const
	 */
	OldCommunication.PLAIN = 1;
	/**
	 * @constant
	 * Auth via RSA digest
	 */
	OldCommunication.DIGEST = 2;

	OldCommunication.XML = 'xml';

	/**
	 * @static
	 * @type {object}
	 * Error types
	 */
	OldCommunication.ERRORS = {
		UNSPECIFIED: 'unspecified',
		SERVER: 'server'
	};

	OldCommunication.prototype.callback = scope.Callback;

	OldCommunication.prototype.getOptions = function () {
		return {
			protocol: "xmpp",
			listeners: {
				onopen: {
					func: processResponse.onOpen,
					context: this
				},
				onclose: {
					func: processResponse.onClose,
					context: this
				},
				onerror: {
					func: processResponse.onError,
					context: this
				},
				onmessage: {
					func: processResponse.onMessage,
					context: this
				}
			},
			host: this.host
		};
	};

	/**
	 *
	 * @param {object} json
	 * @param {@icewarp/Callback} callback
	 * @returns {OldCommunication}
	 */
	OldCommunication.prototype.send = function (json, callback) {
		this.connection.send(this.iq.getIQ(Json.toXmlString(json), callback), this.iq.id);
		return this;
	};
	/**
	 * Set chosen connection instance
	 * @param {Xhr|Socket} connection
	 * @returns {Xhr|Socket}
	 */
	OldCommunication.prototype.setConnection = function (connection) {
		return this.connection = connection;
	};
	/**
	 * get OldCommunication from global storage
	 * @param {string} name
	 * @returns {OldCommunication}
	 */
	OldCommunication.getConnection = function (name) {
		return connections[name || main];
	};

	scope.OldCommunication = OldCommunication;
})(window);
