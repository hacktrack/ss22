(function (scope) {
	/**
	 * @type {Object}
	 * @description Defined middlewares by type
	 */
	var middlewares = {};

	var defaults = {};

	/**
	 * @description Applying all middlewares in series
	 * @param {function} cb  - callback handler for given type
	 * @param {string} type - type of callback
	 * @param {Object} ctx - context of callback handler
	 * @param {array} args  - array of arguments
	 * @returns {boolean} - true if is should stop propagation and false for continue
	 */
	function applyMiddlewares(cb, type, ctx, args) {
		var mid_obj;
		if (!middlewares[type] || !middlewares[type].length) {
			return true;
		}
		for (var i = 0; i < middlewares[type].length; i++) {
			mid_obj = middlewares[type][i];
			if (!mid_obj.condition || mid_obj.condition.apply(ctx, args)) {
				if (mid_obj.middleware.apply(ctx, args) === false) {
					return false;
				}
			}
		}
		return true;
	}
	/**
	 * Function to call function by type if exists
	 * @module Callback
	 * @param {string} type
	 * @param {function} callback_object
	 * @param {*} [args]
	 * @returns {undefined}
	 */
	function Callback(type, callback_object) {
		var cb, ctx = null;
		var args = [].slice.call(arguments).splice(2);
		if (callback_object && typeof callback_object[type] === 'function') {
			cb = callback_object[type];
			ctx = callback_object.context || null;
			if (!applyMiddlewares(cb, type, ctx, args)) {
				return;
			}
		} else if (typeof defaults[type] === 'function') {
			cb = defaults[type];
		}
		cb && cb.apply(ctx, args);
	}
	Callback.SUCCESS = 'success';
	Callback.ERROR = 'error';
	Callback.DONE = 'done';

	/**
	 * Set default Callback[type] function
	 * @param {String} type
	 * @param {Function} fn
	 * @return {Callback}
	 */
	Callback.setDefault = function (type, fn) {
		defaults[type] = fn;
		return this;
	};

	/**
	 * @description Add middleware function before async action and callback execution. Middleware function will be executed with callback function context and can be controller via condition function. Condition function ex executed with context and arguments of callback function
	 * @param {string} type - type of callback (success, error, done, etc...)
	 * @param {function} middleware - middleware function to run before
	 * @param {function} condition - function that returns boolean if middleware should be applied before callback
	 * @return {Callback}
	 */
	Callback.addMiddleware = function (type, middleware, condition) {
		middlewares[type] = middlewares[type] || [];
		middlewares[type].push({
			condition: condition,
			middleware: middleware
		});
		return this;
	};

	/**
	 * @description Remove middleware by middleware function and condition function
	 * @param {string} type - type of callback (success, error, done, etc...)
	 * @param {function} middleware - middleware function to run before
	 * @param {function} condition - function that returns boolean if middleware should be applied before callback
	 * @return {Callback}
	 */
	Callback.removeMiddleware = function (type, middleware, condition) {
		var index;
		if (!middlewares[type] || !middlewares[type].length) {
			return this;
		}
		middlewares[type].some(function (mid_obj, i) {
			if (mid_obj.middleware === middleware && (!mid_obj.condition || mid_obj.condition === condition)) {
				index = i;
				return true;
			}
			return false;
		});
		middlewares[type].splice(index, 1);
		return this;
	};

	scope.Callback = Callback;
})(window);
