(function (scope) {
	/**
	 * Options for IQ setup.
	 * @typedef {Object} IQOptions
	 * @property {array} arguments - array of arguments to be addet to IQ tag (Optional).
	 * @property {string} id_attr - Custom rename of ID attribute (optional).
	 * @property {string} format - Change format of response (optional).
	 */

	/**
	 * Messages ID auto increment
	 * @type Number
	 */
	var i = 1;
	/**
	 * Crate IQ message and handle response for it.
	 * @class IQ
	 * @param {IQOptions} options
	 * @returns {IQ}
	 */
	function IQ(options) {
		options = options || {};
		/**
		 * IQ callbacks storage
		 * @type object
		 */
		this.iqs = {};
		/**
		 * Arguments to add to IQ
		 * @type Array
		 */
		this.arguments = options.arguments || [];
		/**
		 * Custom rename of ID attribute
		 * @type string
		 */
		this.id_attr = options.id_attr || 'id';
		/**
		 * Change type of response
		 * @type string
		 */
		this.format = options.format || 'text/xml';

		this.id = i++;
	}
	/**
	 * Add attribute to IQ tag
	 * @param {string} name
	 * @param {*} value
	 * @returns {undefined}
	 */
	IQ.prototype.addAttribute = function (name, value) {
		this.arguments.push({
			name: name,
			value: value
		});
		return this;
	};
	IQ.prototype.removeAttribute = function (name) {
		this.arguments = this.arguments.filter(function(argument) {
			return argument.name !== name;
		});
		return this;
	};
	/**
	 * Create IQ message, auto increment ID and save callbacks
	 * @param {string} body
	 * @param {object} callback
	 * @returns {String}
	 */
	IQ.prototype.getIQ = function (body, callback) {
		this.iqs[this.id] = callback;
		return "<iq " + this.id_attr + '="' + this.id + '" ' + (this.arguments.map(function (argument) {
			return argument.name + '="' + argument.value + '" ';
		}).join(' ')) + " format=\"" + this.format + "\"><query " + (this.query.arguments.map(function (argument) {
			return argument.name + '="' + argument.value + '" ';
		}).join(' ')) + ">" + body + "</query></iq>";
	};
	/**
	 * Process response and return callbacks by ID
	 * @param {string} response
	 * @returns {object}
	 */
	IQ.prototype.getCallbacks = function (response, id) {
		var xml = new DOMParser().parseFromString(response.replace(/>\s+</g, '><'), "text/xml");
		var iq;
		var callback;
		if ((iq = xml.getElementsByTagName('iq')).length) {
			callback = this.iqs[id || iq[0].getAttribute(this.id_attr)];
			delete this.iqs[id || iq[0].getAttribute(this.id_attr)];
			return {
				callback: callback,
				document: xml
			};
		}
		throw new Error("Malformed message");
	};
	/**
	 * Get IQ by it's ID
	 * @param {number} id
	 * @returns {object}
	 */
	IQ.prototype.getCallbacksById = function (id) {
		return this.iqs[id];
	};
	/**
	 * Get All pending IQs
	 * @returns {object}
	 */
	IQ.prototype.getPendingIqs = function () {
		return this.iqs;
	};
	IQ.prototype.query = {
		arguments: [],
		addAttribute: function (name, value) {
			this.arguments.push({
				name: name,
				value: value
			});
			return this;
		}
	};

	scope.IQProtocol = IQ;
})(window);
