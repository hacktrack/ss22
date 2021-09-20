(function (scope) {
	/** Exception on missing key in required options in request
	 * @class
	 * @param {string} key
	 * @returns {MissingOptionException}
	 */
	function MissingOptionException(key) {
		this.key = key;
		this.message = "Missing required key " + key;
	}

	/** Allowed events to listen on
	 * 
	 */
	var events = ['progress', 'load', 'error', 'abort', 'always'];

	/** Actual XHR event handler
	 * @listens progress
	 * @listens load
	 * @listens error
	 * @listens abort
	 * @param {object} e
	 * @returns {void}
	 */
	var eventHandler = function (e) {
		this.events[e.type] && this.events[e.type].func.call(this.events[e.type].context, e, this.xhr);
		((e.type === 'load' || e.type === 'error') && this.events['always']) && this.events['always'].func.call(this.events['always'].context, e);
	};

	/** Check if all required options are present
	 * 
	 * @param {object} options
	 * @throws {MissingOptionException}
	 * @throws {Error}
	 * @returns {undefined}
	 */
	var validateOptions = function (options) {
		var keys = Object.keys(options);
		required_options.forEach(function (key) {
			if (!~keys.indexOf(key)) {
				throw new MissingOptionException(key);
			}
		});
	};

	/** Required options Array
	 * @type string[]
	 * 
	 */
	var required_options = ['url'];

	/** IWAPIRequest module for handeling XHR requests
	 * @class
	 * @param {object} options
	 * @returns {Request}
	 */
	function IWAPIRequest(options) {
		validateOptions(options);
		/** Listeners storage
		 * @private 
		 */
		this.events = {};
		/** 
		 * @private
		 * @type XMLHttpRequest
		 */
		this.xhr = new XMLHttpRequest();
		this.xhr.open(options.method || "GET", options.url, options.async === void 0 ? true : options.async, options.user || '', options.password || '');
		events.forEach(function (event) {
			this.xhr.addEventListener(event, eventHandler.bind(this));
		}, this);
		this.options = options;
		return this;
	}
	/** Add listener on XHR object
	 * 
	 * @param {string} event
	 * @param {function} callback
	 * @param {object} context
	 * @returns {IWAPIRequest}
	 */
	IWAPIRequest.prototype.on = function (event, callback, context) {
		this.events[event] = {
			func: callback,
			context: context || this
		};
		return this;
	};
	/** Send XHR
	 * 
	 * @param {object} payload
	 * @returns {void}
	 */
	IWAPIRequest.prototype.send = function (payload) {
		this.xhr.send(payload || null);
	};

	/**
	 *  @module IWAPIRequest
	 *  @requires MissingOptionException
	 */
	scope.IWAPIRequest = IWAPIRequest;
})(window);
