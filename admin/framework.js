require=(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({"BaseController":[function(require,module,exports){
(function (global){(function (){
"use strict";
var mix = require('@icewarp/mix');
var extend = require('@icewarp/extend');
var Callback = require('@icewarp/callback');
var EventTarget = require('./EventTarget.js');
var Template = require('@icewarp/icebrace-runtime');
var logger = require('@icewarp/logger');
var escape_string = require('@icewarp/escape-string');
var function_name = require('@icewarp/function-name');
var Debugger = require('@icewarp/debugger');
var Breakpoint = require('./Breakpoint.js');
var Promise = window.Promise || (global || {}).Promise || require('promise-polyfill');

/**
 * @typedef {Object} StoredModelListener
 * @description Stored object of listener to model event.
 * @property {BaseModel} target - Target model
 * @property {string} type - type of event (name of the event)
 * @property {function} func - handler function, this function will be executed with `this` of this controller.
 */

/**
 * @typedef {Object} StoredGlobalListener
 * @description Stored object of listener to model event.
 * @property {BaseController} target - Target is always instance of controller which is adding this listener
 * @property {string} type - type of event (name of the event)
 * @property {function} func - handler function, this function will be executed with `this` of this controller.
 */

/**
 * @typedef {Object} StoredDOMListener
 * @description Stored object of listener to DOM Element.
 * @property {HTMLElement} target - Target DOM Element
 * @property {string} type - type of event (name of the event)
 * @property {function} func - handler function, this function will be executed with `this` of this controller.
 */

/*             Privates               */

/**
 * @summary Model listeners storage
 * @description Storage for model listeners. Every time `addModelListener` is called `StoredModelListener` is stored here and if `removeListeners` is called with this storage, it's emptied. 
 * @type {Object}
 * @property {Object} [controller_name]
 * @property {StoredModelListener[]} [controller_name.listener_id]
 */
var modelListeners = {};

/**
 * @summary global listeners storage
 * @description Storage for global listeners, every time `addGlobalListener` is called `StoredGlobalListener` is stored here  and if `removeListeners` is called with this storage, it's emptied. 
 * @type {Object}
 * @property {Object} [controller_name]
 * @property {StoredGlobalListener[]} [controller_name.listener_id]
 */
var globalListeners = {};

/**
 * @summary DOM listeners storage
 * @description Storage for DOM listeners, every time `addDOMListener` or `addDelegatedDOMListener` is called `StoredGlobalListener` is stored here  and if `removeListeners` is called with this storage, it's emptied. 
 * @type {Object}
 * @property {Object} [controller_name]
 * @property {StoredDOMListener[]} [controller_name.listener_id]
 */
var DOMListeners = {};

/**
 * @summary instances storage
 * @description Contains instances for all controllers stored by `class_name` and id. This is necessary to target existing instance by ID.
 * @type {Object}
 */
var instances = {};

/**
 * @summary controllers storage
 * @description Storage for all controllers in application. Used as single entry point for creating and getting all controllers in application
 * @type {Object}
 */
var controllers = {};

/**
 *  IDs storage
 */
var ids = {};

/**
 * @summary destructors storage
 * @description Contains destructors for all controllers stored by `class_name` and id.
 * @type {Object}
 */
var destructors = {};

Callback.addMiddleware(Callback.SUCCESS, function () {
	return false; //cancel propagation of callbacks for controllers without dom
}, function () {
	return this instanceof BaseController && !this.DOMElement && !this.DOMShadowElement;
});

/**
 * Merge two objects
 * @param {object} target
 * @param {object} source
 * @returns {undefined}
 */
function mergeData(target, source) {
	Object.keys(source).forEach(function (key) {
		target[key] = source[key];
	});
}

/**
 * @description Flats mixed sync and async data into flat promise
 * @param {*} data
 * @param {number} depth
 * @param {array} entities
 * @returns {Promise}
 */
function flatPromisedData(data, depth, entities) {
	depth = depth || 0;
	entities = entities || [];
	if (typeof data !== 'object' || data === null) {
		return data;
	}
	if (data instanceof Promise) {
		return data.then(function (data) {
			return flatPromisedData(data, depth + 1, entities);
		});
	}
	if (~entities.indexOf(data)) {
		return false;
	}
	entities.push(data);
	if (data instanceof Array) {
		return Promise.all(data.map(function (data) {
			if (depth > 300) {
				return new Promise(function (resolve) {
					setTimeout(function () {
						resolve(flatPromisedData(data, 0, entities.slice(0)));
					});
				});
			}
			return flatPromisedData(data, depth + 1, entities.slice(0));
		}));
	}
	if (data instanceof BaseController) {
		return data.resolveHelper(depth + 1, entities);
	}
	return new Promise(function (resolve) {
		var resolved = {};
		var promises = [];
		Object.keys(data).forEach(function (key) {
			var value;
			if (depth > 300) {
				value = new Promise(function (resolve) {
					setTimeout(function () {
						resolve(flatPromisedData(data[key], 0, entities.slice(0)));
					});
				});
			} else {
				value = flatPromisedData(data[key], depth + 1, entities.slice(0));
			}
			if (value instanceof Promise) {
				return promises.push(value.then(function (value) {
					resolved[key] = value;
				}));
			}
			resolved[key] = value;
		});
		resolve(Promise.all(promises).then(function () {
			return resolved;
		}));
	});
}

/**
 * Convert camelcase to snake case
 * @param {string} camelcase 
 * @returns {string}
 */
function camelcaseToLowercaseWithDashes(camelcase) {
	return camelcase.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Returns name of template used in Controller
 * @this {BaseController}
 * @returns {string}
 */
function getTemplateName() {
	return camelcaseToLowercaseWithDashes(this.getClassname()).match(/((?:[a-zA-Z-]|_{2})+)/g)[0];
}
/**
 * returns modifier string
 * @returns {string}
 */
function getTemplateModifier() {
	return camelcaseToLowercaseWithDashes(this.getClassname()).match(/((?:[a-zA-Z-]|_{2})+)/g)[1];
}

/**
 * Remove bound listeners
 * @param {type} listeners
 * @returns {nm$_BaseController.prototype}
 */
function removeListeners(listeners) {
	var listener;
	if (!listeners) {
		throw new Error('listeners to remove not specified');
	}
	while (listeners[this._name] && listeners[this._name][this.id] && listeners[this._name][this.id].length) {
		listener = listeners[this._name][this.id].pop();
		listener.target.removeEventListener(listener.type, listener.func);
	}
	return this;
}

/**
 * Removes breakpoint listeners attached to the controller
 * @returns {nm$_BaseController.prototype}
 */
function removeBreakpointListeners() {
	Breakpoint.removeListeners(this);
	return this;
}

/** Push listener to listener storage
 *
 * @param {array} listeners listeners storage
 * @param {object} listener listener object {target,type,function}
 * @returns {BaseController.prototype}
 */
function pushListener(listeners, listener) {
	if (!listeners[this._name]) {
		listeners[this._name] = {};
	}
	if (!listeners[this._name][this.id]) {
		listeners[this._name][this.id] = [];
	}
	listeners[this._name][this.id].push(listener);
	return this;
}

/**
 *
 * @param {function} fn
 * @param {object} data
 * @param {string} selector
 * @param {string} event_type
 * @param {boolean} once
 * @param {object} listeners
 * @param {Event} event
 * @returns {Array|undefined}
 */
function eventHandler(fn, data, selector, event_type, once, listeners, event) {
	var elements;
	Debugger.logEvent(fn, data, selector, event_type, event, this);
	if (!fn) {
		return logger.error(this._name, this.id, 'Missing callback function for ' + selector);
	}
	elements = selector ? (typeof selector === 'string' ? this.selectAll(selector) : [selector]) : [this.DOMElement || this.DOMShadowElement];
	if (!elements.length) {
		return logger.warning('No elements for selector "' + selector + '" found');
	}
	if (event_type === 'clickoutside') {
		return [].forEach.call(elements, function (element) {
			if (element !== event.target && !element.contains(event.target)) {
				logger.groupCollapsed(selector + ' ' + event_type);
				logger.info(event, element);
				logger.groupEnd();
				fn.call(this, event, data);
				if (once) {
					listeners[this._name][this.id] = listeners[this._name][this.id].filter(function (listener) {
						if (listener.fn === fn && listener.type === 'click') {
							listener.target.removeEventListener(listener.type, listener.func);
						} else {
							return true;
						}
					});
				}
			}
		}, this);
	}
	[].forEach.call(elements, function (element) {
		if (element === event.target || element === window || element.contains(event.target)) {
			event.element = element;
			logger.groupCollapsed(selector + ' ' + event_type);
			logger.info(event, element);
			logger.groupEnd();
			fn.call(this, event, data);
			if (once) {
				listeners[this._name][this.id] = listeners[this._name][this.id].filter(function (listener) {
					if (listener.fn === fn && listener.type === event_type) {
						listener.target.removeEventListener(listener.type, listener.func);
					} else {
						return true;
					}
				});
			}
		}
	}, this);
}

/**
 *
 * @param {Node} parent_element
 * @param {function} controller_callback
 * @returns {undefined}
 */
function subcontrollersCallback(parent_element, controller_callback) {
	[].forEach.call(parent_element.querySelectorAll('[data-component]'), function (element) {
		controller_callback(this.getInstanceByElement(element), element);
	}, this);
}

/**
 * Remove listeners, call beforeDestroy, unbind DOMElements if soft === false, call all destructors and call afterDestroy
 * @param {type} soft unbind DOMElements if soft === false
 * @returns {nm$_BaseController.prototype}
 */
function destroy(soft) {
	if (!instances[this._name][this.id]) {
		return this;
	}

	removeListeners.call(this, DOMListeners);
	removeListeners.call(this, globalListeners);
	removeListeners.call(this, modelListeners);
	removeBreakpointListeners.call(this);

	this.beforeDestroy && this.beforeDestroy(soft);

	destructors[this._name][this.id] = destructors[this._name][this.id].filter(function (destructor) {
		destructor.call(this);
		return false;
	}, this);

	if (!soft) {
		this.DOMElement = null;
		this.DOMShadowElement = null;
		setTimeout(function () {
			if (!this.DOMElement) {
				delete instances[this._name][this.id];
			}
		}.bind(this), 5);
	}

	this.afterDestroy && this.afterDestroy(soft);

	return this;
}

/** Check if storage for class is already initialized
 *
 * @param {string} class_name
 * @returns {undefined}
 */
function checkInstance(class_name) {
	if (!instances[class_name]) {
		instances[class_name] = {};
		ids[class_name] = 0;
	}
}

/**
 *
 * @param {Object} instance
 * @returns {undefined}
 */
function set(instance) {
	var id;
	checkInstance(instance._name);
	id = ++ids[instance._name];
	instances[instance._name][id] = instance;
	instance.setId(id);
}

/*            /Privates               */

/** Control for view module
 * @class
 *
 * @param {object} context data to render module with
 * @returns {BaseController}
 */
function BaseController(context) {
	this.data = context || this.data || {};
	this._name = getTemplateName.call(this);
	this._mod = getTemplateModifier.call(this);
	this._resolved_helper = {};

	set(this);

	destructors[this._name] = destructors[this._name] || {};
	destructors[this._name][this.id] = destructors[this._name][this.id] || [];

	EventTarget.call(this, true);
}
extend(EventTarget, BaseController);

/**
 * Add BaseController instance to instances storage
 * @param {BaseController} instance
 * @returns {BaseController}
 */
BaseController.reinstance = function (instance) {
	instances[instance._name][instance.id] = instance;
	return instance;
};

/**
 * @description Persistent data to be cloned on every rerender.
 * @type String[]
 */
BaseController.PERSISTENT_DATA_KEYS = ['styleModifier'];

/** Default function for adding listeners, this is called on every execute
 *  To be overridden by child
 *
 * @returns {undefined}
 */
BaseController.prototype.addListeners = function () {};

/** Function called before render, To be overridden by child
 *
 * @returns {undefined}
 */
BaseController.prototype.beforeRender = function () {};

/** Function called befor destroy, To be overridden by child
 *
 * @returns {undefined}
 */
BaseController.prototype.beforeDestroy = function () {};

/** function called after render, To be overridden by child
 *
 * @returns {undefined}
 */
BaseController.prototype.afterRender = function () {};

/** Function called after destroy. To be overridden by child
 *
 * @returns {undefined}
 */
BaseController.prototype.afterDestroy = function () {};

/**
 *
 * @param {number|string} id
 * @returns {BaseController.prototype}
 */
BaseController.prototype.setId = function (id) {
	this.id = id;
	return this;
};

/**
 *
 * @param {DOMElement|string} element - element or selector
 * @returns {BaseController}
 */
BaseController.prototype.getInstanceByElement = function (element) {
	var parts, id;
	if (!element) {
		return null;
	}
	parts = (typeof element === 'string' ? this.select(element) : element).getAttribute('data-component');
	if (!parts) {
		return null;
	}
	parts = parts.split('-');
	id = parts.pop();
	return instances[parts.join('-').split('~')[0]][id];
};

/**
 * Return parent controller
 * @param {string} name - controller name
 * @param {function} [callback]
 * @returns {BaseController|null} parent controller or null in case no parent matched
 */
BaseController.prototype.getParent = function (name, callback) {
	var result;
	var parent = this.DOMElement || this.DOMShadowElement;
	parent && (parent = parent.parentNode);
	while (
		parent !== null && !(
			parent.hasAttribute('data-component') &&
			((!name || !parent.getAttribute('data-component').indexOf(name + '-')))
		)
	) {
		parent = parent.parentNode;
		if (parent.classList === void 0) {
			return null;
		}
	}
	result = this.getInstanceByElement(parent);
	callback && result && callback(result);
	return result;
};

/**
 *
 * @param {string} name - controller name
 * @param {function} [callback]
 * @returns {array} array of child controllers
 */
BaseController.prototype.getChildren = function (name, callback) {
	var selector;
	name && !Array.isArray(name) && (name = [name]);
	selector = name ? name.map(function (name) {
		return '[data-component^="' + name + '-"], [data-component^="' + name + '~"]';
	}).join(',') : '[data-component]';
	if (callback) {
		return this.selectAll(selector, function (children) {
			callback(children.map(this.getInstanceByElement).filter(Boolean));
		}.bind(this));
	}
	return this.selectAll(selector).map(this.getInstanceByElement).filter(Boolean);
};
/**
 *
 * @param {Function|String} constructor
 * @param {function} [callback]
 * @returns {BaseController[]}
 */
BaseController.prototype.getChildrenByClass = function (constructor, callback) {
	if (callback) {
		return this.getChildren(false, function (children) {
			callback(children.filter(function (instance) {
				return instance instanceof constructor || (instance.mixes && !!~instance.mixes.indexOf(function_name(constructor)));
			}));
		});
	}
	return this.getChildren().filter(function (instance) {
		return instance instanceof constructor || (instance.mixes && !!~instance.mixes.indexOf(function_name(constructor)));
	});
};

/**
 *
 * @returns {String}
 */
BaseController.prototype.getClassname = function () {
	return function_name(this.constructor);
};

/**
 * Extract persistent data from this.data property
 * @returns {undefined}
 */
BaseController.prototype.getPersistentData = function () {
	var persistent = {};
	if (this.data && typeof this.data === 'object') {
		BaseController.PERSISTENT_DATA_KEYS.forEach(function (KEY) {
			if (this.data[KEY] === void 0) {
				return;
			}
			persistent[KEY] = this.data[KEY];
		}, this);
	}
	return persistent;
};

/**
 * Returns proper parent element tag name (eg. table for tr, tr for td, div otherwise)
 * @param {String} tag_name tag name
 * @returns {String} parent tag name
 */
function chooseParentElementTagName(tag_name) {
	return {
		thead: 'table',
		tbody: 'table',
		tr: 'tbody',
		td: 'tr'
	} [tag_name] || 'div';
}

/**
 * Execute template function, parse HTML to DOM and setup listeners
 * @param {Object} data
 * @returns {Promise}
 */
BaseController.prototype.execute = function (data) {
	var template = getTemplateName.call(this);
	var template_data, html, first_tag;
	var persistent_data = this.getPersistentData();
	if (!Template.t(template)) {
		throw new Error(template, 'template not set');
	}
	this.data = data || this.data || {};
	return this.resolveHelper().then(function () {
		template_data = this.getView();
		mergeData(this.data, persistent_data);
		mergeData(template_data, persistent_data);
		html = Template.t(template)()(template_data);
		first_tag = (html.match(/<([\w-]+)/) || [])[1];
		this.DOMShadowElement = document.createElement(chooseParentElementTagName(first_tag));
		this.DOMShadowElement.insertAdjacentHTML('afterbegin', html);
		this.DOMShadowElement.normalize();
		if (this.DOMShadowElement.firstElementChild) {
			this.DOMShadowElement = this.DOMShadowElement.firstElementChild;
		}
		this.DOMShadowElement.setAttribute('data-component', this._name + '-' + this.id);
		this.DOMShadowElement.classList.add(this._name);
		template !== this._name && this.DOMShadowElement.classList.add(template);
		this.addListeners && this.addListeners();
		subcontrollersCallback.call(this, this.DOMShadowElement, function (controller, element) {
			controller.DOMShadowElement = element;
			controller.addListeners && controller.addListeners();
		});
		return this;
	}.bind(this));

};

/**
 * 
 * @description Add listener to BaseController global context. Listening to all event across all BaseController instances.
 * @param {string} event_type - type of event to listen to
 * @param {function} fn  - event handler
 * @param {boolean} once - remove after first trigger
 * @returns {BaseController}
 */
BaseController.prototype.addGlobalListener = function (event_type, fn, once) {
	var func = fn.bind(this);
	this.on(event_type, func, this, false, once);
	return pushListener.call(this, globalListeners, {
		target: this,
		type: event_type,
		func: func
	});
};

/**
 * @description Add destructor function to controller if not already added to be called on destroy.
 * @param {function} fn - destructor function
 * @returns {BaseController}
 */
BaseController.prototype.addDestructor = function (fn) {
	!~destructors[this._name][this.id].indexOf(fn) && destructors[this._name][this.id].push(fn);
	return this;
};

/** 
 * @description Add a delegated listener on elements specified by selector, Listener is attached to controller root element and triggered if selector is matched in bubbling phase. This can be used for triggering actions from dynamically changed parts of component.
 *
 * @param {string|DOMElement} selector
 * @param {string|string[]} event_type - type of event to listen to; multiple event types as array or space delimited string
 * @param {function} fn function to be executed on event
 * @param {object} [data] optional data for event callback
 * @returns {BaseController}
 */
BaseController.prototype.addDelegatedDOMListener = function (selector, event_type, fn, data) {
	var eventFn;
	if (Array.isArray(event_type) || (event_type.split(' ').length > 1 && (event_type = event_type.split(' ')))) {
		return event_type.forEach(function (event_type) {
			this.addDelegatedDOMListener(selector, event_type, fn, data);
		}, this);
	}

	eventFn = eventHandler.bind(this, fn, data, selector, event_type, false, void 0);
	this.DOMShadowElement.addEventListener(event_type, eventFn);
	return pushListener.call(this, DOMListeners, {
		target: this.DOMShadowElement,
		type: event_type,
		func: eventFn
	});
};
/** 
 * @description Shortcut for adding delegated listener on data-hook, same as delegatedDOMListener, but selector is created dynamically using hook. Hook selector is matched in bubbling phase. This can be used for triggering actions from dynamically changed parts of component.
 *
 * @param {string} hook - name of the hook
 * @param {string} event_type
 * @param {function} fn function to be executed on event
 * @param {object} [data] optional data for event callback
 * @returns {BaseController.prototype}
 */
BaseController.prototype.addDelegatedHookListener = function (hook, event_type, fn, data) {
	return this.addDelegatedDOMListener('[data-hook="' + hook + '"]', event_type, fn, data);
};
/**
 * @description Adding delegated listener on namespaced hook. More on listening on delegated events on addDelegatedHookListener. Namespaced hook is hook created by createNSHook() function, it's hook prefixed by name of the controller.
 * @param {string} hook - hook name
 * @param {string} event_type - type of event
 * @param {function} fn - function to be executed on event trigger
 * @param {object} [data] - optional data to be passed to event handler
 * @returns {BaseController} 
 */
BaseController.prototype.addDelegatedNSHookListener = function (hook, event_type, fn, data) {
	return this.addDelegatedDOMListener('[data-hook="' + function_name(this.constructor) + '-' + hook + '"]', event_type, fn, data);
};

BaseController.prototype.addDelegatedPartialListener = function (name, event_type, fn, data) {
	return this.addDelegatedDOMListener('[data-component^="' + name + '-"], [data-component^="' + name + '~"]', event_type, fn, data);
};

/** 
 * 
 * @description Shortcut for adding listener on data-hook, selector is constructed automatically from hook name, Hook is data attribute create by createHook() function. This data attribute is used for marking some parts of component as controllable. 
 *
 * @param {string} hook - name of the hook
 * @param {string} event_type
 * @param {function} fn function to be executed on event
 * @param {object} [data] optional data for event callback
 * @param {boolean} once fire listener only once
 * @returns {BaseController.prototype}
 */
BaseController.prototype.addHookListener = function (hook, event_type, fn, data, once) {
	return this.addDOMListener('[data-hook="' + hook + '"]', event_type, fn, data, once);
};

/**
 * @description Shortcut for adding listener on namespaced data-hook, selector is constructed automatically from hook name and controller name, Namespaced Hook is data attribute create by createNSHook() function.
 * @param {string} hook 
 * @param {string} event_type 
 * @param {function} fn 
 * @param {object} [data] 
 * @param {boolean} [once] 
 * @returns {BaseController}
 */
BaseController.prototype.addNSHookListener = function (hook, event_type, fn, data, once) {
	return this.addDOMListener('[data-hook="' + function_name(this.constructor) + '-' + hook + '"]', event_type, fn, data, once);
};

BaseController.prototype.addPartialListener = function (name, event_type, fn, data, once) {
	return this.addDOMListener('[data-component^="' + name + '-"], [data-component^="' + name + '~"]', event_type, fn, data, once);
};

/** 
 * 
 * @description Add a listener on elements specified by css selector. 
 *
 * @param {string|DOMElement} selector
 * @param {string|string[]} event_type Event type, array of event types or space separated event types
 * @param {function} fn function to be executed on event
 * @param {object} [data] optional data for event callback
 * @param {boolean} once fire listener only once
 * @returns {BaseController.prototype}
 */
BaseController.prototype.addDOMListener = function (selector, event_type, fn, data, once) {
	var eventFn, elements, i;
	if (Array.isArray(event_type) || (event_type.split(' ').length > 1 && (event_type = event_type.split(' ')))) {
		return event_type.forEach(function (event_type) {
			this.addDOMListener(selector, event_type, fn, data, once);
		}, this);
	}
	eventFn = eventHandler.bind(this, fn, data, selector, event_type, once, DOMListeners);
	elements = selector ? (typeof selector === 'string' ? this.selectAll(selector) : [selector]) : [this.DOMShadowElement];
	if (!elements.length) {
		logger.groupCollapsed('Cannot bind listener to non-existing elements');
		logger.error(selector, this);
		logger.groupEnd();
		return this;
	}
	for (i in elements) {
		elements[i].addEventListener(event_type, eventFn);
		pushListener.call(this, DOMListeners, {
			target: elements[i],
			type: event_type,
			func: eventFn,
			fn: fn
		});
	}
	return this;
};

/** Add click-outside listener on elements specified by selector
 *
 * @param {string|DOMElement} selector
 * @param {function} fn function to be executed on event
 * @param {object} [data] optional data for event callback
 * @param {boolean} once fire listener only once
 * @returns {BaseController.prototype}
 */
BaseController.prototype.addClickOutsideListener = function (selector, fn, data, once) {
	var eventFn = eventHandler.bind(this, fn, data, selector, 'clickoutside', once, DOMListeners);
	document.body.addEventListener('click', eventFn);
	return pushListener.call(this, DOMListeners, {
		target: document.body,
		type: 'click',
		func: eventFn,
		fn: fn
	});
};

/** Add listener to given model
 *
 * @param {BaseModel} model
 * @param {string} event_type
 * @param {function} fn
 * @param {boolean} once listen only once and delete listener
 * @returns {BaseController.prototype}
 */
BaseController.prototype.addModelListener = function (model, event_type, fn, once) {
	if (Array.isArray(event_type) || (event_type.split(' ').length > 1 && (event_type = event_type.split(' ')))) {
		return event_type.forEach(function (event_type) {
			this.addModelListener(model, event_type, fn, once);
		}, this);
	}
	model.on(event_type, fn, this, false, once);
	return pushListener.call(this, modelListeners, {
		target: model,
		type: event_type,
		func: fn
	});
};

/**
 * Add breakpoint listener
 *
 * @param {array} breakpoints
 * @param {function} fn
 * @returns {BaseController.prototype}
 */
BaseController.prototype.addBreakpointListener = function (breakpoints, fn) {
	(Array.isArray(breakpoints) ? breakpoints : [breakpoints]).forEach(function (breakpoint) {
		Breakpoint.addListener(this, breakpoint, fn);
	}, this);
	return this;
};

/** Rerender this module if already rendered
 *
 * @param {object} [data] - New data that will replace current controller this.data
 * @returns {Promise}
 */
BaseController.prototype.rerender = function (data) {
	if (!this.DOMElement && !this.DOMShadowElement) {
		return Promise.resolve(this);
	}
	this.remove(true);
	return this.execute(data).then(function (control) {
		control.render(control.DOMElement);
		return control;
	});
};

/**
 * Renders executed controller to the page
 * @param {DOMElement} element
 * @param {string} render_type - [beforebegin | afterbegin | beforeend | afterend | replaceWith (default)]
 * @returns {BaseController.prototype}
 */
BaseController.prototype.render = function (element, render_type) {
	var replaced_controller = null;
	var children = this.getChildren();

	this.beforeRender && this.beforeRender();
	subcontrollersCallback.call(this, this.DOMShadowElement, function (controller) {
		controller.beforeRender && controller.beforeRender();
	});
	switch (render_type) {
		case 'beforebegin':
		case 'afterbegin':
		case 'beforeend':
		case 'afterend':
			element.insertAdjacentElement(render_type, this.DOMShadowElement);
			break;
		default:
			subcontrollersCallback.call(this, element || this.DOMElement, function (controller) {
				if (!~children.indexOf(controller)) {
					destroy.call(controller);
				}
			});
			(element || this.DOMElement).parentNode.replaceChild(this.DOMShadowElement, (element || this.DOMElement));
			replaced_controller = this.getInstanceByElement(element);
			if (replaced_controller && replaced_controller !== this) {
				destroy.call(replaced_controller);
			}
	}
	this.DOMElement = this.DOMShadowElement;
	this.DOMShadowElement = null;
	subcontrollersCallback.call(this, this.DOMElement, function (controller) {
		controller.DOMElement = controller.DOMShadowElement;
		controller.DOMShadowElement = null;
	});
	this.afterRender && this.afterRender();
	subcontrollersCallback.call(this, this.DOMElement, function (controller) {
		controller.afterRender && controller.afterRender();
	});
	return this;
};

/** 
 * 
 * @description Select node inside this component by given  css selector, Cannot be used for selecting component itself.
 *
 * @param {string} selector
 * @param {function} [callback]
 * @returns {Element}
 */
BaseController.prototype.select = function (selector, callback) {
	var result = null;
	var element = this.DOMShadowElement || this.DOMElement;
	if (!element) {
		return result;
	}

	result = selector ? element.querySelector(selector) : element;
	callback && result && callback(result);
	return result;
};

/** 
 * @description Select nodes inside this component by given  css selector.
 *
 * @param {string} selector
 * @param {function} [callback]
 * @returns {Array}
 */
BaseController.prototype.selectAll = function (selector, callback) {
	var result = [];
	var element = this.DOMShadowElement || this.DOMElement;
	if (!element) {
		return result;
	}

	result = [].slice.call(element.querySelectorAll(selector));
	callback && result && callback(result);
	return result;
};

/**
 * Select data-hook="selector"
 * @param {String} selector
 * @param {function} [callback]
 * @returns {Element}
 */
BaseController.prototype.hook = function (selector, callback) {
	return this.select('[data-hook="' + selector + '"]', callback);
};
/**
 * Select data-hook="ns-selector"
 * @param {String} selector
 * @param {function} [callback]
 * @returns {Element}
 */
BaseController.prototype.nsHook = function (selector, callback) {
	return this.select('[data-hook="' + escape_string(this.getClassname() + '-' + selector) + '"]', callback);
};

/**
 * Select all data-hook="selector"
 * @param {string} selector
 * @param {function} [callback]
 * @returns {Element[]}
 */
BaseController.prototype.hooks = function (selector, callback) {
	return this.selectAll('[data-hook="' + selector + '"]', callback);
};

/**
 * Returns closest data-hook="selector"
 * @param {string} selector
 * @param {Element} element
 * @param {function} [callback]
 * @returns {Element}
 */
BaseController.prototype.closestHook = function (selector, element, callback) {
	var result = null;
	element = element || this.DOMShadowElement || this.DOMElement;
	if (!element) {
		return result;
	}

	result = element.closest('[data-hook="' + selector + '"]');
	callback && result && callback(result);
	return result;
};

/**
 * Creates data-hook attribute
 * @param {String} hook
 * @returns {String}
 */
BaseController.prototype.createHook = function (hook) {
	return ' data-hook="' + escape_string(hook) + '" ';
};

/**
 * Creates data-hook attribute in module namespace
 * @param {String} hook
 * @returns {String}
 */
BaseController.prototype.createNSHook = function (hook) {
	return ' data-hook="' + escape_string(function_name(this.constructor) + '-' + hook) + '" ';
};

/** Default helper for all controllers, to be overridden in children
 *
 * @returns {object}
 */
BaseController.prototype.helper = function () {
	return this.data;
};

/**
 * Provides custom modifications and adding mod flags for module data
 * @returns {object}
 */
BaseController.prototype.getView = function () {
	var _data = this._resolved_helper;
	var parts = function_name(this.constructor).match(/((?:[a-zA-Z-]|_{2})+)/g);
	if (_data) {
		_data._mod = camelcaseToLowercaseWithDashes(parts[1] || '');
		_data._name = camelcaseToLowercaseWithDashes(parts[0]);
	}
	this.view_data = _data;
	return _data;
};

/**
 * @description Resolves async data in helper
 * @param {number} [depth]
 * @param {array} [entities]
 * @returns {Promise}
 */
BaseController.prototype.resolveHelper = function (depth, entities) {
	return flatPromisedData(this.helper(), depth, entities).then(function (data) {
		this._resolved_helper = data;
		return this;
	}.bind(this), function (error) {
		logger.error(error);
		this._resolved_helper = {};
		return this;
	}.bind(this));
};

/**
 * 
 * @param {Object} data 
 * @returns {BaseController}
 */
BaseController.prototype.setViewData = function (data) {
	this.view_data = data;
	return this;
};

/**
 * Set controllers to work with
 * @param {Object} controllersToSet object with controllers {controller_name: controller return function}
 * @returns {undefined}
 */
BaseController.setControllers = function (controllersToSet) {
	controllers = controllersToSet;
};

/**
 * Get controller from static_controllers
 * @param {String} class_name
 * @returns {BaseController}
 */
BaseController.static = function (class_name) {
	class_name = camelcaseToLowercaseWithDashes(class_name);
	if (!controllers[class_name]) {
		logger.info('Creating non-existing controller ' + class_name);
		controllers[class_name] = function () {
			return BaseController.create(class_name.replace('~', '_').replace(/(?:^|-|\b)(\w)/g, function (match, $1) {
				return $1.toUpperCase();
			}));
		};
	}
	return controllers[class_name]();
};

/**
 * Create new instance of BaseController
 * @param {string} class_name - name of controller class
 * @param {Object} context - data context for inner usage
 * @returns {BaseController}
 */
BaseController.new = function (class_name, context) {
	return new(this.static(class_name))(context);
};

/**
 * Creates a controller
 * @param {String} controller_name
 * @param {Object} extend_controller controller to inherit from
 * @param {Object} mixins controller or array of controllers to mix with the new controller
 * @returns {BaseController} a class with className as its name
 */
BaseController.create = function (controller_name, extend_controller, mixins) {
	var controller = new Function('BaseController', 'function ' + controller_name + '(){BaseController.apply(this,arguments);this.onCreate&&this.onCreate()}return ' + controller_name)(BaseController);
	extend(extend_controller || BaseController, controller);
	mixins && (Array.isArray(mixins) ? mixins : [mixins]).forEach(function (mixin) {
		mix(mixin, controller);
	});
	return controller;
};

/** Remove element from
 *
 * @param {Boolean} soft Do not remove DOMElement
 * @returns {undefined}
 */
BaseController.prototype.remove = function (soft) {
	this.DOMElement && subcontrollersCallback.call(this, this.DOMElement, function (controller) {
		destroy.call(controller, soft);
	});
	!soft && (this.DOMElement || {}).parentNode && this.DOMElement.parentNode.removeChild(this.DOMElement);
	destroy.call(this, soft);
};

module.exports = BaseController;

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./Breakpoint.js":"Breakpoint","./EventTarget.js":3,"@icewarp/callback":"Callback","@icewarp/debugger":"debugger","@icewarp/escape-string":2,"@icewarp/extend":"extend","@icewarp/function-name":"function-name","@icewarp/icebrace-runtime":"icebrace-runtime","@icewarp/logger":"logger","@icewarp/mix":"mix","promise-polyfill":12}],"BaseEvent":[function(require,module,exports){
"use strict";
/** Parent of all event models
 * @class
 * 
 * @param {object} data data to store inside event
 * @returns {BaseEvent}
 */
function BaseEvent(data) {
	this.data = data;
	this.immediatePropagationStopped = false;
}
/** Stop propagation 
 * 
 * @returns {undefined}
 */
BaseEvent.prototype.stopImmediatePropagation = function () {
	this.immediatePropagationStopped = true;
};
module.exports =  BaseEvent;

},{}],"BaseModel":[function(require,module,exports){
"use strict";
var extend = require('@icewarp/extend');
var delayed = require('@icewarp/delayed');
var mix = require('@icewarp/mix');
var EventTarget = require('./EventTarget.js');
var ModelData = require('./ModelData.js');
var BaseEvent = require('./BaseEvent.js');
var overtype = require('@icewarp/overtype');

var tmp_id = 0;


/*             Privates               */


/** Instances Storage
 *
 */
var instances = {};

/** Models storage, To be filled up in app
 *
 */
var models = {};

/**
 * Storage for class_name route rules
 * @type Object
 */
var name_route_rule = {};

/**
 * Storage for class_name routes
 * @type Object
 */
var name_route = {};


/**
 *
 * @param {object} instance
 * @returns {undefined}
 */
var set = function (instance) {
	var class_name = instance.getClassname();
	checkInstance(class_name);
	instances[class_name][instance.getId()] = instance;
};
var checkInstance = function (class_name) {
	if (!instances[class_name]) {
		instances[class_name] = {};
	}
};

/**
 * Generates auto incremental id for temporary models
 * @returns {string}
 */
function getTmpID() {
	return '_tmp_' + ++tmp_id;
}

/**
 * Set itself to working data in all references
 * @this BaseModel
 * @argument {boolean} [recursive] - propagate recursively in entire reference chain
 * @argument {BaseModel[]} [instances] - Array of instances that was already processed
 * @returns {undefined}
 */
function propagateChange(recursive, instances) {
	var class_name, id, key;
	instances = instances || [];
	if (~instances.indexOf(this)) {
		return;
	}
	instances.push(this);
	for (class_name in this.references) {
		for (id in this.references[class_name]) {
			for (key in this.references[class_name][id]) {
				BaseModel.instance(class_name, id)[(this.references[class_name][id][key] & BaseModel.REFERENCE_MASK.IS_ARRAY) ? 'pushData' : 'setData'](key, this);
				if (recursive) {
					propagateChange.call(BaseModel.instance(class_name, id), recursive, instances);
				}
			}
		}
	}
}

/**
 * Propagate changes in defined upstream path
 * @param {string[]} path - Array of class names defining upstream path
 * @returns {undefined}
 */
function propagateChangeUpstreamPath(path) {
	var next_stop, id, key;
	if (!path.length) {
		return;
	}
	next_stop = path.shift();
	if (!this.references[next_stop]) {
		return;
	}
	for (id in this.references[next_stop]) {
		for (key in this.references[next_stop][id]) {
			BaseModel.instance(next_stop, id)[(this.references[next_stop][id][key] & BaseModel.REFERENCE_MASK.IS_ARRAY) ? 'pushData' : 'setData'](key, this);
			propagateChangeUpstreamPath.call(BaseModel.instance(next_stop, id), path);
		}
	}

}

/*             /Privates              */

/** Parent of all models
 * @class
 *
 * @requires extend
 *
 * @param {number|string} id
 * @returns {BaseModel}
 */
function BaseModel(id) {
	var data;
	EventTarget.call(this);
	data = new ModelData();
	this.getId = function () {
		return id;
	};
	this.setId = function (new_id) {
		if (new_id === this.getId()) {
			return;
		}
		if (instances[this.getClassname()][new_id]) {
			throw new Error('Model ' + this.getClassname() + ' with id ' + new_id + ' already exists');
		}
		this.tmp = (typeof new_id === 'string' && !!~new_id.indexOf('_tmp_'));
		delete instances[this.getClassname()][id];
		id = new_id;
		set.call(BaseModel, this);
	};
	this.caller = data.caller.bind(data);
	this.tmp = (typeof id === 'string' && !!~id.indexOf('_tmp_'));
	this.references = {};
	set.call(BaseModel, this);
}
extend(EventTarget, BaseModel);
BaseModel.prototype.callback = require('@icewarp/callback');

/**
 * @type Object
 * @property {number} IN_ARRAY - if property is array property
 * @property {number} IS_IN_SERVER_DATA - if property is in server data
 */
BaseModel.REFERENCE_MASK = {
	IS_ARRAY: 1,
	IS_IN_SERVER_DATA: 2
};


/**
 * Destructor
 * @description Clears references in models with references to this instance.
 * Removes instance from Instances Storage.
 * 
 * @returns {undefined}
 */
BaseModel.prototype.destroy = function () {
	this.caller('destroy');
	this.clearReferences();
	delete instances[this.getClassname()][this.getId()];
};
/**
 * Clear references to this object from other BaseModel object
 * @param {BaseModel} [reference] reference to clear 
 * @param {String} [modeldata_key] key to clear from
 * @returns {BaseModel.prototype}
 */
BaseModel.prototype.clearReferences = function (reference, modeldata_key) {
	var i, model, j, key, instance, tmp_instance;
	for (i in this.references) {
		model = this.references[i];
		for (j in model) {
			instance = model[j];
			for (key in instance) {
				if(modeldata_key && modeldata_key !== key) {
					continue;
				}
				if(reference && reference !== BaseModel.instance(i, j)) {
					continue;
				}
				tmp_instance = instance[key];
				delete instance[key];
				if (tmp_instance & BaseModel.REFERENCE_MASK.IS_ARRAY) {
					BaseModel.instance(i, j).spliceData(key, this, {
						server_data: tmp_instance & BaseModel.REFERENCE_MASK.IS_IN_SERVER_DATA
					});
				} else {
					BaseModel.instance(i, j).unsetData(key, {
						server_data: tmp_instance & BaseModel.REFERENCE_MASK.IS_IN_SERVER_DATA
					});
				}
			}
			if(!Object.keys(instance).length) {
				delete model[j];
			}
		}
		if(!Object.keys(model).length) {
			delete this.references[i];
		}
	}

	return this;
};
/**
 * @param {boolean} real - Return real class name, not overridden
 * @returns {String}
 */
BaseModel.prototype.getClassname = function (real) {
	return this.constructor.getClassname(real);
};

BaseModel.getClassname = function (real) {
	if (!real && this.classNameOverride) {
		return this.classNameOverride;
	}
	return this['name'] || (/function (.*?)\(/.exec((this).toString())[1] || '').trim();
};

/**
 * @type {string}
 * @description Can override actual class name of model, This is used when you need several models to share same ID namespace, for example Model A has two children Model B and Model C. But A, B and C has same ID line and you want to prevent duplications so you set classNameOverride for B and C to A.
 */
BaseModel.classNameOverride = '';

/**
 * @type {array}
 * @description Array of class names which classes can this model overtype to self.
 */
BaseModel.canOvertype = [];

/** Getter for data, if exist working data of given key then it's value is returned otherwise server data of given key is returned
 *
 * @description gets value from model data by given key.
 * @param {string} key
 * @param {object} [options]
 * @param {boolean} [options.server_data] - return server data directly
 * @returns {*} - If no key is provided returned value will be false, If key is provided but there is undefined value in working_data value from server_data is returned, If there is undefined value in both server and working data, undefined is returned.
 */
BaseModel.prototype.getData = function (key, options) {
	return this.caller('getData', key, options && options.server_data);
};

/** Getter for data array, if exist working data of given key then it's value is returned otherwise server data of given key is returned
 *
 * @param {string} key
 * @param {object} [options]
 * @param {boolean} [options.server_data]
 * @returns {*}
 */
BaseModel.prototype.getArray = function (key, options) {
	return this.caller('getArray', key, options && options.server_data);
};

/** Inits an array if undefined
 *
 * @param {string} key
 * @param {object} [options]
 * @param {boolean} [options.server_data] (default value: true)
 * @returns {*}
 */
BaseModel.prototype.initArray = function (key, options) {
	this.caller('initArray', key, (!options || options.server_data === undefined) ? true : options.server_data);
	return this;
};

/** Setter for all data
 *
 * @param {string} key
 * @param {*} value
 * @param {object} [options]
 * @param {string} [options.type]
 * @param {boolean} [options.server_data] true if you want to set server data. Like to save response from server
 * @param {boolean} [options.propagate_change] - propagate change to the upper model
 * @param {boolean} [options.propagate_recursive] - propagate change all the way up
 * @param {boolean} [options.upstream_path] - propagate change by the specified upstream path
 * @returns {BaseModel}
 */
BaseModel.prototype.setData = function (key, value, options) {
	var old_value;
	if (!key) {
		throw 'Undefined key for setData ' + this.getClassname();
	}
	old_value = this.getData(key, options);
	if(old_value instanceof BaseModel && old_value !== value) {
		old_value.clearReferences(this, key);
	}
	if (options && options.type) {
		value = overtype(options.type, value);
	}
	if (value === undefined) {
		return this;
	}
	if (value instanceof BaseModel) {
		value.addReference(this, key);
	}
	if (options && options.propagate_change) {
		propagateChange.call(this, options && options.propagate_recursive);
	}
	if (options && options.upstream_path) {
		propagateChangeUpstreamPath.call(this, options && options.upstream_path);
	}
	this.caller('setData', key, value, options && options.server_data) && (old_value !== value) && this.trigger(key + '_set', new BaseEvent({
		model: this,
		old_value: old_value,
		new_value: value
	})) && update.call(this, key);
	return this;
};
/** Push new value to data array
 *
 * @param {string} key
 * @param {*} value
 * @param {object} [options]
 * @param {boolean} [options.unshift]
 * @param {boolean} [options.server_data] true if you want to set server data. Like to save response from server
 * @param {boolean} [options.propagate_change] - propagate change to the upper model
 * @param {boolean} [options.propagate_recursive] - propagate change all the way up
 * @param {boolean} [options.upstream_path] - propagate change by the specified upstream path
 * @returns {BaseModel}
 */
BaseModel.prototype.pushData = function (key, value, options) {
	if (value instanceof BaseModel) {
		value.addReference(this, key, true);
	}
	if (options && options.propagate_change) {
		propagateChange.call(this, options && options.propagate_recursive);
	}
	if (options && options.upstream_path) {
		propagateChangeUpstreamPath.call(this, options.upstream_path);
	}
	this.caller('pushData', key, value, options && options.unshift, options && options.server_data) && this.trigger(key + '_pushed', new BaseEvent({
		model: this,
		new_value: value
	})) && update.call(this, key);
	return this;
};
/** remove value from array data
 *
 * @param {string} key
 * @param {*} value
 * @param {options} [options]
 * @param {boolean} [options.server_data]
 * @param {boolean} [options.propagate_change] - propagate change to the upper model
 * @param {boolean} [options.propagate_recursive] - propagate change all the way up
 * @param {boolean} [options.upstream_path] - propagate change by the specified upstream path
 * @returns {BaseModel}
 */
BaseModel.prototype.spliceData = function (key, value, options) {
	if (options && options.propagate_change) {
		propagateChange.call(this, options && options.propagate_recursive);
	}
	if (options && options.upstream_path) {
		propagateChangeUpstreamPath.call(this, options && options.upstream_path);
	}
	this.caller('spliceData', key, value, options && options.server_data) && this.trigger(key + '_spliced', new BaseEvent({
		model: this,
		old_value: value
	})) && update.call(this, key);
	if(value instanceof BaseModel) {
		value.clearReferences(this, key);
	}
	return this;
};

/**
 * Get difference object between server_data array and working_data array
 * @param {string} key - key which array to compare
 * @returns {Object} - returns object with added property containing items newly added to array and removed property with items removed from array
 */
BaseModel.prototype.getDataDiff = function (key) {
	var i;
	var working = this.getArray(key);
	var server = this.getArray(key, {
		server_data: true
	});
	var removed = [];
	var added = [];
	var length = (working.length > server.length ? working.length : server.length);
	for (i = 0; i < length; i++) {
		working[i] && !~server.indexOf(working[i]) && added.push(working[i]);
		server[i] && !~working.indexOf(server[i]) && removed.push(server[i]);
	}
	return {
		added: added,
		removed: removed
	};
};

/**
 * remove model property
 * @param {string} key
 * @param {object} [options]
 * @param {boolean} [options.server_data]
 * @param {boolean} [options.propagate_change] - propagate change to the upper model
 * @param {boolean} [options.propagate_recursive] - propagate change all the way up
 * @param {boolean} [options.upstream_path] - propagate change by the specified upstream path
 * @returns {BaseModel}
 */
BaseModel.prototype.unsetData = function (key, options) {
	if (options && options.propagate_change) {
		propagateChange.call(this, options && options.propagate_recursive);
	}
	if (options && options.upstream_path) {
		propagateChangeUpstreamPath.call(this, options && options.upstream_path);
	}
	this.getArray(key, options).forEach(function(value) {
		if(value instanceof BaseModel) {
			value.clearReferences(this, key);
		}
	}, this);
	this.caller('unsetData', key, options && options.server_data) && this.trigger(key + '_unset', new BaseEvent({
		model: this
	})) && update.call(this, key);
	return this;
};

/**
 * Filter function to remove duplicity
 * @param {*} value 
 * @param {number} index 
 * @param {Array} self 
 * @returns {Boolean}
 */
function onlyUnique(value, index, self) {
	return self.indexOf(value) === index;
}

/**
 * 
 * Trigger update event on data change
 * @this {BaseModel}
 * @param {string} key 
 * @returns {undefined}
 */
function update(key) {
	this.keys = this.keys || [];
	this.keys.push(key);
	delayed(function () {
		this.trigger('update', new BaseEvent({
			model: this,
			keys: this.keys.filter(onlyUnique)
		}));
		this.keys = [];
	}, this, 5, this.getClassname() + '_' + this.getId() + '_update');
}

/**
 * Add model to referential table
 * @param {BaseModel} reference_model
 * @param {string} key
 * @param {boolean} in_array
 * @param {boolean} server_data
 * @returns {BaseModel}
 */
BaseModel.prototype.addReference = function (reference_model, key, in_array, server_data) {
	this.references = this.references || {};
	this.references[reference_model.getClassname()] = this.references[reference_model.getClassname()] || {};
	this.references[reference_model.getClassname()][reference_model.getId()] = this.references[reference_model.getClassname()][reference_model.getId()] || {};
	this.references[reference_model.getClassname()][reference_model.getId()][key] = 0 + (in_array ? BaseModel.REFERENCE_MASK.IS_ARRAY : 0) + (server_data ? BaseModel.REFERENCE_MASK.IS_IN_SERVER_DATA : 0);
	return this;
};
/** Propagate working data to server data
 * @param {object} [options]
 * @param {boolean} [options.recursive] - save recursively 
 * @returns {BaseModel}
 */
BaseModel.prototype.saveWorkingData = function (options) {
	var working_data, key;
	if (options && options.recursive) {
		options.saved = options.saved || [];
		if (~options.saved.indexOf(this)) {
			return this;
		}
		options.saved.push(this);
		working_data = this.getWorkingData();
		for (key in working_data) {
			if (working_data[key] instanceof BaseModel) {
				working_data[key].saveWorkingData(options);
			}
		}
	}
	this.caller('saveWorkingData');
	return this;
};
/** Returns all working data
 *
 * @returns {object}
 */
BaseModel.prototype.getWorkingData = function () {
	return this.caller('getWorkingData');
};
/** get keys of all working data
 *
 * @returns {array}
 */
BaseModel.prototype.getWorkingDataKeys = function () {
	return this.caller('getWorkingDataKeys');
};
/** Flush all working data
 * @param {object} [options]
 * @param {boolean} [options.recursive] - save recursively 
 * @returns {BaseModel}
 */
BaseModel.prototype.flushWorkingData = function (options) {
	var key;
	var working_data = this.getWorkingData();
	if (options && options.recursive) {
		options.flushed = options.flushed || [];
		if (~options.flushed.indexOf(this)) {
			return this;
		}
		options.flushed.push(this);
		for (key in working_data) {
			if (working_data[key] instanceof BaseModel) {
				working_data[key].flushWorkingData(options);
			}
		}
	}

	this.caller('flushWorkingData');

	for (key in working_data) {
		this.trigger(key + '_set', new BaseEvent({
			model: this,
			old_value: working_data[key],
			new_value: this.getData(key)
		}));
	}

	return this;
};

/**
 * @description Overtype this to arg model, this function will go thur all references and adds new instance to all references. Calling destroy on old instance will remove model from all references in the end.
 * @param {BaseModel} model - static class of overtype target
 * @param {array} args - arguments for constructor
 * @returns {BaseModel} - returns overtype instance
 */
BaseModel.prototype.overtypeTo = function (model, args) {
	var key, reference_classname, reference_id, new_instance, rm, rmi;
	var server_data = this.caller('getServerData');
	var working_data = this.getWorkingData();
	var references = JSON.parse(JSON.stringify(this.references));
	this.destroy();
	new_instance = new(model.bind.apply(model, args));
	for (reference_classname in references) {
		rm = references[reference_classname];
		for (reference_id in rm) {
			rmi = rm[reference_id];
			for (key in rmi) {
				BaseModel.instance(reference_classname, reference_id)[rmi[key] & BaseModel.REFERENCE_MASK.IS_ARRAY ? 'pushData' : 'setData'](key, new_instance, {
					server_data: rmi[key] & BaseModel.REFERENCE_MASK.IS_IN_SERVER_DATA
				});
			}
		}
	}
	for (key in server_data) {
		new_instance.setData(key, server_data[key], {
			server_data: true
		});
	}
	for (key in working_data) {
		new_instance.setData(key, working_data[key]);
	}
	references = null;
	return new_instance;
};

/** Factory for Model instances
 *
 * @param {string} class_name name of the class you want to create
 * @param {string|number} [id] if there is no id given system generates tmp id based on timestamp, models like this are used for temporary data storage before saving on server.
 * @param {*} args any arguments will be passed to the constructor and to the onCreate function
 * @returns {BaseModel}
 */
BaseModel.instance = function (class_name, id, args) {
	var model = this.static(class_name);
	var argumenty = [].slice.call(arguments);
	class_name = model.getClassname();
	argumenty[1] = id = id !== void 0 ? id : model.singleton ? 0 : (getTmpID());
	checkInstance(class_name);
	if (instances[class_name][id]) {
		if (model.getClassname(true) !== instances[class_name][id].getClassname(true) && ~model.canOvertype.indexOf(class_name)) {
			return instances[class_name][id].overtypeTo(model, argumenty);
		}
		return instances[class_name][id];
	}
	return new(model.bind.apply(model, argumenty));
};

BaseModel.instanceExists = function (class_name, id) {
	return !!(instances[class_name] && instances[class_name][id]);
};

/**
 * Returns whether passed instance is an instance of class_name
 * @param {object} instance
 * @param {String} class_name instance class_name to compare with
 * @returns {Boolean}
 */
BaseModel.instanceof = function (instance, class_name) {
	return instance instanceof BaseModel && instance.instanceof(class_name);
};

/**
 * Returns whether model is instance of class_name
 * @param {String} class_name instance class_name to compare with
 * @returns {Boolean}
 */
BaseModel.prototype.instanceof = function (class_name) {
	return this instanceof BaseModel.static(class_name);
};

BaseModel.modelExists = function (class_name) {
	return !!models[this.checkNameRoute(class_name)];
};
/**
 * Sets models to central storage
 * @param {object} modelsToSet
 * @returns {undefined}
 */
BaseModel.setModels = function (modelsToSet) {
	if (Object.keys(models).length) {
		return Object.keys(modelsToSet).forEach(function (key) {
			models[key] = modelsToSet[key];
		});
	}
	models = modelsToSet;
};
/**
 * Sets single model to global storage
 * @param {BaseModel} model
 * @returns {undefined}
 */
BaseModel.setModel = function (model) {
	models[model.getClassname()] = function () {
		return model;
	};
};

/**
 * @summary Check name_route for remapping to real class name
 * @description Check name_route storage for route to real class_name for this link, if there is no route, go thru all rules and test ling againts them. If there is match cache found link to name_route storage.
 * @param {String} link
 * @returns {unresolved}
 */
BaseModel.checkNameRoute = function (link) {
	var result, match, source;
	if (name_route[link]) {
		return name_route[link];
	}
	for (source in name_route_rule) {
		if ((result = link.match(name_route_rule[source]))) {
			match = source; //partial match
			if (result[0] === result.input) {
				return name_route[link] = source; //fullmatch
			}
		}
	}
	return match ? (name_route[link] = match) : link;
};
/**
 * @summary Register classname routing
 * @description Register class_name link to ream class_name, if you register string you are creating direct link from one string to another. You can also register regular expression. Be carful with regular expression, because it will be evaluated against every class_name in eventy BaseModel static call, that may cause performance issues with many registered rules, or with badly written regexp.
 * @param {string|RegExp} link
 * @param {string} source
 * @returns {nm$_BaseModel.BaseModel}
 */
BaseModel.registerNameRoute = function (link, source) {
	if (link instanceof RegExp) {
		name_route_rule[source] = link;
		return this;
	}
	name_route[link] = source;
	return this;
};

/**
 * Returns static object of class_name
 * @param {string} class_name
 * @returns {BaseModel}
 */
BaseModel.static = function (class_name) {
	class_name = this.checkNameRoute(class_name);
	if (!this.modelExists(class_name)) {
		throw class_name + ' model doesn\'t exist';
	}
	return models[class_name]();
};

/**
 * Creates a model
 * @param {type} modelName
 * @param {Object} extend_model model to inherit from
 * @param {Object} mixins model or array of models to mix with the new model
 * @returns {BaseModel}
 */
BaseModel.create = function (modelName, extend_model, mixins) {
	var model = new Function('BaseModel', 'function ' + modelName + '(){BaseModel.apply(this,arguments);this.onCreate&&this.onCreate.apply(this, arguments)}return ' + modelName)(BaseModel);
	extend(extend_model || BaseModel, model);
	mixins && (Array.isArray(mixins) ? mixins : [mixins]).forEach(function (mixin) {
		mix(mixin, model);
	});
	return model;
};

/**
 * Get temporary instances by class_name
 * @param {string} class_name
 * @returns {BaseModel[]}
 */
BaseModel.getTmpInstances = function (class_name) {
	return Object.keys((instances[class_name] || {})).map(function (id) {
		return BaseModel.instance(class_name, id);
	}).filter(function (instance) {
		return instance.tmp;
	});
};

module.exports = BaseModel;

},{"./BaseEvent.js":"BaseEvent","./EventTarget.js":3,"./ModelData.js":4,"@icewarp/callback":"Callback","@icewarp/delayed":"delayed","@icewarp/extend":"extend","@icewarp/mix":"mix","@icewarp/overtype":8}],"Breakpoint":[function(require,module,exports){
"use strict";
var functionName = require('@icewarp/function-name');
var delayed = require('@icewarp/delayed');

var Breakpoint = {
	all: []
};

var breakpoint_listeners = {};

// lower boundries
var breakpoints = {
	xs: [0, 543],
	sm: [544, 767],
	md: [768, 991],
	lg: [992, 1199],
	xl: [1200, 99999]
};

var i, listeners;

for (i in breakpoints) {
	Breakpoint['all'].push(i);
	Breakpoint[i] = i;
	breakpoint_listeners[i] = [];
	'matchMedia' in window && matchMedia('(min-width: ' + breakpoints[i][0] + 'px) and (max-width: ' + breakpoints[i][1] + 'px)').addListener(function (breakpoint, event) {
		if (!event.matches) {
			return;
		}
		listeners = breakpoint_listeners[breakpoint].slice();
		listeners.forEach(function (listener) {
			delayed(function () {
				if (~breakpoint_listeners[breakpoint].indexOf(listener)) {
					listener.fn ? listener.fn.call(listener.context, breakpoint, breakpoints[breakpoint]) : listener.context.rerender();
				}
			}, this, 50, functionName(listener.context) + listener.context.id);
		});
	}.bind(null, i));
}

Breakpoint.getCurrent = function () {
	var client_width = document.body.clientWidth;
	var i;
	for (i in breakpoints) {
		if (client_width >= breakpoints[i][0] && client_width <= breakpoints[i][1]) {
			return i;
		}
	}
	return i;
};

Breakpoint.addListener = function (context, breakpoint, fn) {
	breakpoint_listeners[breakpoint].push({
		context: context,
		fn: fn
	});
};

Breakpoint.removeListeners = function (self) {
	var breakpoint;
	for (breakpoint in breakpoint_listeners) {
		breakpoint_listeners[breakpoint] = breakpoint_listeners[breakpoint].filter(function (listener) {
			return listener.context !== self;
		});
	}
};

module.exports = Breakpoint;

},{"@icewarp/delayed":"delayed","@icewarp/function-name":"function-name"}],1:[function(require,module,exports){
"use strict";
var mouse_movement = [];
var log_length = 50000;
var dump_handeler = false;
var logging = true;
//var start = 0;
var start_x = 0;
var start_y = 0;

var previous_x = 0;
var previous_y = 0;
var previous_time = 0;

function createCursor() {
	var cursor = document.createElement('div');
	cursor.style.zIndex = '99999';
	cursor.style.position = 'absolute';
	cursor.style.width = '0';
	cursor.style.height = '0';
	cursor.style.borderColor = '#ff0000 transparent transparent transparent';
	cursor.style.borderWidth = '20px 20px 0 0';
	cursor.style.borderStyle = 'solid';
	return cursor;
}

function moveMouse(cursor, index) {
	if (mouse_movement[index + 3]) {
		cursor.style.top = (start_y += mouse_movement[index + 2]) + 'px';
		cursor.style.left = (start_x += mouse_movement[index + 1]) + 'px';
		setTimeout(function () {
			moveMouse(cursor, index + 3);
		}, mouse_movement[index + 3]);
	} else {
		cursor.parentElement.removeChild(cursor);
		cursor = null;
	}
}

function log(e) {
	mouse_movement.push((new Date().getTime() - previous_time));
	mouse_movement.push(e.clientX - previous_x);
	mouse_movement.push(e.clientY - previous_y);
	if (mouse_movement.length > log_length) {
		if (dump_handeler && dump_handeler.fn) {
			dump_handeler.fn.call(dump_handeler.context || this, 'mouse', JSON.stringify(mouse_movement));
			mouse_movement = [];
		} else {
			mouse_movement.shift();
			mouse_movement.shift();
			mouse_movement.shift();
		}
	}
	previous_time = new Date().getTime();
	previous_x = e.clientX;
	previous_y = e.clientY;
	logging = false;
}
function enableLogging() {
	logging = true;
}
function onMouseMove(e) {
	if (!logging) {
		return;
	}
	log(e);
	setTimeout(enableLogging, 5);
}


module.exports = {
	initTracking: function (length, dump) {
		log_length = length;
		dump_handeler = dump;
		document.body.addEventListener('mousemove', onMouseMove);
	},
	mousePlay: function () {
		var cursor = createCursor();
		document.body.appendChild(cursor);
		moveMouse(cursor, 0);
	},
	getData: function () {
		return mouse_movement;
	}
};
},{}],2:[function(require,module,exports){
"use strict";
/**
 * map of substitutions
 */
var entity_map = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&#39;',
	'/': '&#x2F;',
	'`': '&#x60;',
	'=': '&#x3D;'
};

/**
 * function to escape &<>"'`=\/ in string
 * @param string string to escape
 */
var escapeString = function(string) {
	return String(string).replace(/[&<>"'`=/]/g, function (match) {
		return entity_map[match];
	});
};

/**
 * @module escape-string
 */
module.exports = escapeString;

},{}],3:[function(require,module,exports){
"use strict";
var Debugger = require('@icewarp/debugger');

/** Delete listener by given function
 * 
 * @param {function} fn
 * @param {object} callbacks
 * @returns {undefined}
 */
var deleteListener = function (fn, callbacks) {
	var i;
	for ( i = 0; i < callbacks.length; i++) {
		if (callbacks[i].fn === fn) {
			callbacks.splice(i, 1);
		}
	}
};
/**
 * Global storage for callbacks
 * @
 * @type Object
 */
var global_callbacks = {};

/** 
 * @classdesc Class for handling listeners and triggers. There are two options how to use EventTarget class. You can specify global flag in constructor. If global is true class is using global storage for listeners shared by all other instances created with global flag. If global is false listeners are scoped only cor current insance.
 * @class EventTarget
 * @example var instance = new EventTarget();
 * instance.on('event', someHandler); //adding event handler called someHandler
 * instance.trigger('event', {}); //only someHandler is triggered
 * @example var instance1 = new EventTarget(true);
 * var instance2 = new EventTarget(true);
 * instance1.on('event', someHandler); //adding event handler called someHandler
 * instance2.on('event', someOtherHandler); //adding event handler called someOtherHandler
 * instance1.trigger('event', {}); //someHandler and someOtherHandler are both triggered
 * @param {boolean} [global] Flag for global callback storage
 * 
 * @returns {EventTarget}
 */
function EventTarget(global) {
	/**
	 * Local storage for callbacks
	 * @type Object
	 */
	this.callbacks = global ? global_callbacks : {};
}
/**
 * @description Trigger event by given type.
 * @param {string} type type of event you want to trigger
 * @param {object} event instance of event
 * @returns {EventTarget}
 */
EventTarget.prototype.trigger = function (type, event) {
	if (!type) {
		throw Error('Missing Event Type');
	}
	setTimeout(function() {
		var cb, i;
		Debugger.logAction({type: type, event: event}, Debugger.levels.MODEL_EVENT);
		cb = (this.callbacks[type] || []).splice(0);

		this.callbacks[type] = cb.filter(function (c) {
			return !c.once;
		});

		for (i = 0; i < cb.length; i++) {
			cb[i].fn.call(cb[i].context || this, event || {}, type);
			if (event && event.immediatePropagationStopped) {
				break;
			}
		}
	}.bind(this), 0);
	return this;
};
/** 
 * @description Function for removing listeners, you can remove all listeners or listeners by type only, that will remove all listeners of given type, or by type and handler that will remove all listeners with same type and handler.
 * @param {string|function} [type] If type is supplied only listeners on given type are removed. If function is supplied only listener using that function is removed.
 * @param {function} [fn] If function is supplied only listener using that function is removed.
 * @returns {EventTarget}
 */
EventTarget.prototype.off = function (type, fn) {
	var event_type;
	switch (arguments.length) {
		case 0:
			this.callbacks = {};
			break;
		case 1:
			if (typeof arguments[0] === 'function') {
				for (event_type in this.callbacks) {
					deleteListener.call(this, arguments[0], this.callbacks[event_type]);
				}
			} else {
				this.callbacks[arguments[0]] = [];
			}
			break;
		default:
			deleteListener.call(this, arguments[1], this.callbacks[arguments[0]]);
	}
	return this;
};
/** 
 * @description Add function handler on specified event type
 * @example var eventTarget = new EventTarget();
 * eventTarget.on('SomeEvent', function(){
 * 		//this is eventTarget object
 * });
 * eventTarget.trigger('SomeEvent', {});//triggering event with empty event
 * 
 * @param {string} type - type of event, string that identifies even type and is used for triggering events
 * @param {function} fn - event handler, function thats gonna be called when event is triggered. First argument of this function is event
 * @param {object} context - Context to call event handler with. default is context of class which is calling this function.
 * @param {boolean} unshift - Put event listener on start of listeners stack. This can be used if you want to stop immediate propagation on element
 * @param {boolean} once - Handler will be called only once then listener is removed.
 * @returns {EventTarget}
 */
EventTarget.prototype.on = function (type, fn, context, unshift, once) {
	if (!this.callbacks[type]) {
		this.callbacks[type] = [];
	}
	this.callbacks[type][unshift ? 'unshift' : 'push']({fn: fn, context: context || this, once: once || false});
	return this;
};
/** 
 * @description Adding listener that are only triggered once and then removed.
 * @param {string} type
 * @param {function} fn
 * @param {object} context
 * @param {boolean} unshift
 * @returns {EventTarget}
 */
EventTarget.prototype.once = function (type, fn, context, unshift) {
	return this.on(type, fn, context, unshift, true);
};

/**
 * Alias to off function
 * @param {type} type
 * @param {type} fn
 * @returns {unresolved}
 */
EventTarget.prototype.removeEventListener = function (type, fn) {
	return this.off.apply(this, arguments);
};



module.exports = EventTarget;

},{"@icewarp/debugger":"debugger"}],4:[function(require,module,exports){
"use strict";
var ModelDataArray = require('./ModelDataArray.js');

/**
 * array of functions allowed to be accessed
 */
var allowed_fns = [
	'getData',
	'getArray',
	'setData',
	'initArray',
	'pushData',
	'spliceData',
	'unsetData',
	'getWorkingDataKeys',
	'getServerData',
	'getWorkingData',
	'saveWorkingData',
	'flushWorkingData',
	'destroy'
];

/**
 * @class ModelData
 * @property {object} working_data object to hold unsaved object data
 * @property {object} server_data object to hold saved object data
 * @returns {ModelData}
 */
function ModelData() {
	this.working_data = {};
	this.server_data = {};
}

/**
 * encapsulating function
 * @argument {string} function_name name of function to call
 * @argument {*} function_params arguments passed to function
 * @returns {boolean|undefined}
 */
ModelData.prototype.caller = function (function_name, function_params) {
	var args = Array.prototype.slice.apply(arguments);
	var fn = args.shift();

	if (~allowed_fns.indexOf(fn)) {
		return this[fn].apply(this, args);
	}
};

/**
 * Getter for data, if exist working data of given key then it's value is returned otherwise server data of given key is returned
 * @param {string} key
 * @param {boolean} get_server_data
 * @returns {*}
 */
ModelData.prototype.getData = function (key, get_server_data) {
	return !key ? false : (!get_server_data && typeof this.working_data[key] !== 'undefined' ? this.working_data[key] : this.server_data[key]);
};

/**
 * Getter for data array, if exist working data of given key then it's value is returned otherwise server data of given key is returned
 * @param {string} key
 * @param {boolean} get_server_data
 * @returns {*}
 */
ModelData.prototype.getArray = function (key, get_server_data) {
	var a = this.getData(key, get_server_data);
	return a instanceof ModelDataArray ? a : new ModelDataArray(a);
};

/**
 *
 * @param {type} key
 * @param {type} modify_server_data
 * @returns {undefined}
 */
ModelData.prototype.initArray = function (key, modify_server_data) {
	(modify_server_data ? this.server_data : this.working_data)[key] = (modify_server_data ? (this.server_data[key] === void 0 ? new ModelDataArray() : this.server_data[key]) : (this.working_data[key] === void 0 ? (this.server_data[key] === void 0 ? new ModelDataArray() : this.server_data[key].clone()) : this.working_data[key]));
};

/** remove value from array data
 *
 * @param {string} key
 * @param {*} value
 * @param {boolean} modify_server_data
 * @returns {boolean|undefined}
 */
ModelData.prototype.spliceData = function (key, value, modify_server_data) {
	var model_data_array;
	var index;
	this.initArray(key, modify_server_data);
	model_data_array = this.getArray(key, modify_server_data);
	index = model_data_array.indexOf(value);
	if (~index) {
		Array.prototype.splice.call(model_data_array, index, 1);
		return true;
	}
};

/** Push new value to data array
 *
 * @param {string} key
 * @param {*} value
 * @param {boolean} unshift
 * @param {boolean} modify_server_data true if you want to set server data. Like to save response from server
 * @returns {boolean|undefined}
 */
ModelData.prototype.pushData = function (key, value, unshift, modify_server_data) {
	this.initArray(key, modify_server_data);
	if (!~this.getArray(key).indexOf(value)) {
		Array.prototype[unshift ? 'unshift' : 'push'].call((modify_server_data ? this.server_data : this.working_data)[key], value);
		return true;
	}
};

/** Setter for all data
 *
 * @param {string} key
 * @param {*} value
 * @param {boolean} modify_server_data true if you want to set server data. Like to save response from server
 * @returns {boolean|undefined}
 */
ModelData.prototype.setData = function (key, value, modify_server_data) {
	(modify_server_data ? this.server_data : this.working_data)[key] = Array.isArray(value) ? new (ModelDataArray.bind.apply(ModelDataArray, [ModelDataArray].concat(value))) : value;
	return true;
};

/**
 * Unset model property
 *
 * @param {string} key
 * @param {boolean}  modify_server_data true if you want to unset server data
 * @returns {Boolean}
 */
ModelData.prototype.unsetData = function (key, modify_server_data) {
	var data = modify_server_data ? this.server_data : this.working_data;
	data[key] = void 0;
	delete data[key];
	return true;
};

/** Propagate working data to server data
 *
 * @returns {BaseModel}
 */
ModelData.prototype.saveWorkingData = function () {
	var i;
	for (i in this.working_data) {
		this.server_data[i] = this.working_data[i];
	}
	return this.flushWorkingData();
};

/** Returns all working data
 *
 * @returns {object}
 */
ModelData.prototype.getWorkingData = function () {
	return this.working_data;
};
ModelData.prototype.getServerData = function () {
	return this.server_data;
};

/** get keys of all working data
 *
 * @returns {array}
 */
ModelData.prototype.getWorkingDataKeys = function () {
	return Object.keys(this.getWorkingData());
};

/** Flush all working data
 *
 * @returns {BaseModel}
 */
ModelData.prototype.flushWorkingData = function () {
	this.working_data = {};
	return this;
};

/**
 * Destructor
 * @returns {ModelData.prototype}
 */
ModelData.prototype.destroy = function () {
	this.working_data = {};
	this.server_data = {};
	return this;
};

module.exports = ModelData;

},{"./ModelDataArray.js":5}],5:[function(require,module,exports){
"use strict";
/**
 * @class
 * @extends Array
 * @description Special ArrayLike class that restricts mutable actions
 */
function ModelDataArray() {
	Array.prototype.forEach.call(arguments, function (v) {
		Array.prototype.push.call(this, v);
	}, this);
}
ModelDataArray.prototype = Object.create(Array.prototype);
ModelDataArray.prototype.constructor = ModelDataArray;

[
	'fill',
	'pop',
	'push',
	'reverse',
	'shift',
	'splice',
	'unshift'
].forEach(function (action) {
	ModelDataArray.prototype[action] = function () {
		console.error('Action', action, 'is not allowed. Use ModelData functions instead', this);
	};
});

/**
 * Creates clone of this array, If items are objects they are shared by reference.
 * @returns {ModelDataArray}
 */
ModelDataArray.prototype.clone = function () {
	var clone = new ModelDataArray();
	var i;
	for (i = 0; i < this.length; i++) {
		Array.prototype.push.call(clone, this[i]);
	}
	return clone;
};

module.exports = ModelDataArray;

},{}],6:[function(require,module,exports){
"use strict";
var Template = require('@icewarp/icebrace-runtime');
var BaseController = require('./BaseController.js');
var logger = require('@icewarp/logger');

/**
 * Handle subcomponent.
 * @param {string} name 
 * @param {Object} context 
 * @returns {string}
 */
module.exports = function (name, context) {
	var style_mod = name.split(':');
	var no_mod, controller;
	var styleModifier = '';
	var template;
	name = style_mod[0];
	if (style_mod[1]) {
		styleModifier = (' ' + style_mod[1].split('|').join(' ') + ' ');
	}
	if (context instanceof BaseController) {
		controller = context;
		controller.data.styleModifier = styleModifier;
		context = controller.getView();
		controller.view_data = context;
		BaseController.reinstance(controller);
	}
	context.styleModifier = styleModifier;
	context.hook = context.hook || '';
	name = context[name] || name;
	no_mod = name.split('~')[0];
	if (!Template.t(no_mod)) {
		logger.warning('Missing template "' + no_mod + '"');
		return '';
	}
	template = Template.t(no_mod)()(context);
	name = context._mod ? (no_mod + '~' + context._mod) : name;
	if (!/^\s*(<[\w\d]+\s+data-component)/.test(template)) { // component with a wrapper
		template = template.replace(/^\s*(<[\w\d]+)/, '$1' + ' data-component="' + name + '-' + (controller || new (BaseController.static(name))(context)).id + '"');
	}
	return template;
};

},{"./BaseController.js":"BaseController","@icewarp/icebrace-runtime":"icebrace-runtime","@icewarp/logger":"logger"}],7:[function(require,module,exports){
"use strict";
var Debugger = require('@icewarp/debugger');
var Template = require('@icewarp/icebrace-runtime');

Template.c = require('./component_handler');

Debugger.addLogLevel('MODEL_EVENT');
/* eslint-disable */
/** Static core of framework
 *

 * @type Object
 */
var Core = {
};
/* eslint-enable */
/**
 * @external @icewarp/socket
 * @see {@link ../../socket/1.0.8/|@icewarp/socket}
 */
/**
 * @external @icewarp/extend
 * @see {@link ../../extend/1.0.4/|@icewarp/extend}
 */
/**
 * @external @icewarp/delayed
 * @see {@link http://192.168.6.5/jsframework/delayed/1.0.7/|@icewarp/delayed}
 */
/**
 * @external @icewarp/request
 * @see {@link http://192.168.6.5/jsframework/request/1.0.3/|@icewarp/request}
 */
/**
 * @external @icewarp/logger
 * @see {@link http://192.168.6.5/jsframework/logger/1.0.1/|@icewarp/logger}
 */
/**
 * @external @icewarp/overtype
 * @see {@link http://192.168.6.5/jsframework/overtype/1.0.0/|@icewarp/overtype}
 */
/**
 * @external @icewarp/icebrace-runtime
 * @see {@link http://192.168.6.5/jsframework/icebrace-runtime/1.0.5/|@icewarp/icebrace-runtime}

 */

},{"./component_handler":6,"@icewarp/debugger":"debugger","@icewarp/icebrace-runtime":"icebrace-runtime"}],8:[function(require,module,exports){
"use strict";
/** Module of evertyping properties
 *  @module overtype
 * @param {string} type
 * @param {*} value
 * @returns {Array|Number|undefined|String|Boolean|Object}
 */
module.exports = function (type, value) {
	if(!type) {
		return value;
	}
	switch (type.toLowerCase()) {
		case 'array':
			return Array.isArray(value) ? value : [value];
		case 'boolean':
			return Array.isArray(value) && !value.length ? false : !!value;
		case 'null':
			return null;
		case 'undefined':
			return undefined;
		case 'number':
			return value * 1;
		case 'string':
			return '' + value;
		case 'symbol':
			return value; // todo
	}
	return value;
};

},{}],9:[function(require,module,exports){
"use strict";
/** Eception on missing key in required options in request
 * @class
 * @param {string} key
 * @returns {MissingOptionException}
 */
function MissingOptionException(key) {
	this.key = key;
	this.message = "Missing required key " + key;
}
module.exports = MissingOptionException;
},{}],10:[function(require,module,exports){
"use strict";
/**
 * @external @icewarp/delayed
 */
var delayed = require('@icewarp/delayed');
/**
 * @external @icewarp/logger
 */
var Logger = require('@icewarp/logger');


/** Function that decides how long to wait before another reconnect
 * 
 * @returns {Number}
 */
var howLongToWait = function () {
	if (!this.wait) {
		this.wait = 0;
	}
	this.wait = (this.wait + 1) % 30;
	return this.wait * 1000;
};

/** Init ping timer
 * 
 * @returns {undefined}
 */
var initPing = function () {
	clearInterval(this.pingID);
	this.pingID = setInterval(function () {
		ping.call(this);
	}.bind(this), 14000);
};

/** send ping message
 * 
 * @returns {undefined}
 */
var ping = function () {
	this.send({ping: 1});
};
/**
 * 
 * @param {object} options object with listeners objects
 * @returns {undefined}
 */
var setListeners = function (options) {
	this.connection.onclose = function () {
		Logger.info("Closing connection");
		this.autoreconnect && reconnect.call(this);
		this.autoreconnect = true;
		if (options.onclose) {
			options.onclose.func.call(options.onclose.context);
		}
	}.bind(this);
	this.connection.onopen = function (e) {
		Logger.info("Connection open");
		this.allow_ping && initPing.call(this);
		this.interval = 0;
		clearInterval(this._retry_interval);
		clearInterval(this._close_interval);
		if (options.onopen) {
			options.onopen.func.call(options.onopen.context);
		}
	}.bind(this);
	if (options.onerror) {
		this.connection.onerror = options.onerror.func.bind(options.onerror.context);
	}
	if (options.onmessage) {
		this.connection.onmessage = options.onmessage.func.bind(options.onmessage.context);
	}
};

/** Connect to endpoint
 * 
 * @returns {undefined}
 */
var connect = function () {
	if (!this.connection) {
		try {
			this.connection = new Connection.websocket(this.host, this.protocol);
		} catch (e) {
			return;
		}
		setListeners.call(this, this.listeners);
	}
	this._close_interval = setTimeout(function () {
		this.close();
	}.bind(this), howLongToWait.call(this));
};

/** Recconect to endpoint
 * 
 * @returns {undefined}
 */
var reconnect = function () {
	this._retry_interval = setTimeout(function () {
		Logger.info("Recconect");
		if (!this.connection || (!!this.connection && (this.connection.readyState === this.connection.CLOSED || this.connection.readyState === this.connection.CLOSING))) {
			clearInterval(this._close_interval);
			this.connection = false;
			connect.call(this);
		}
	}.bind(this), howLongToWait.call(this));
};

/** Encode message by given type
 * 
 * @param {object} data
 * @param {string} content_type
 * @returns {String}
 */
var contentType = function (data, content_type) {
	switch (content_type) {
		case "json":
			return JSON.stringify(data);
	}
	return data;
};

/**
 * @class
 * @param {object} options
 * @requires module:@icewarp/delayed
 * @requires module:@icewarp/logger
 * @property {number} _retry_interval id of timeout for reconnection on connection failure
 * @property {number} _close_interval id of timeout for closing pending connection
 * @property {boolean} autoreconnect flag for aout reconect if connections fails (can be set from options)
 * @property {array} dataToSend queue for messages if connections fails
 * @property {string} host host
 * @property {string} protocol protocol for we connection default '' 
 * @property {number} _retry_time how long to wait before another reconnect attempt
 * @property {object} listeners object of listeners attaached on connection
 * @property {boolean} allow_ping allow browser to ping server
 * @returns {Connection}
 */
function Connection(options) {
	this._retry_interval = 0;
	this._close_interval = 0;
	this.autoreconnect = options.autoreconnect || true;
	this.dataToSend = [];
	this.host = options.host;
	this.protocol = options.protocol || '';
	this._retry_time = options.retry_time || 5000;
	this.listeners = options.listeners || {};
	this.allow_ping = options.allow_ping || false;
	connect.call(this);
}
/**
 * 
 * @param {object} data data payload
 * @param {string} content_type xml|json
 * @returns {Boolean}
 */
Connection.prototype.send = function (data, content_type) {
	content_type = content_type || "json";
	Logger.info("Sending Data", data);
	if (!!this.connection && this.connection.readyState === 1) {
		this.connection.send(contentType(data, content_type));
		return true;
	} else {
		this.dataToSend.push(data);
		delayed(function () {
			while (this.dataToSend.length) {
				if (!this.send(this.dataToSend.pop())) {
					break;
				}
			}
		}, this, 1000);
		return false;
	}
};

/**
 * Close connection
 * @returns {undefined}
 */
Connection.prototype.close = function () {
	this.connection && this.connection.close && this.connection.close();
};

/** WS unification
 * 
 */
Connection.websocket = window.WebSocket || window.MozWebSocket;

module.exports = Connection;

},{"@icewarp/delayed":"delayed","@icewarp/logger":"logger"}],11:[function(require,module,exports){
"use strict";
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],12:[function(require,module,exports){
(function (setImmediate){(function (){
"use strict";
'use strict';

/**
 * @this {Promise}
 */
function finallyConstructor(callback) {
  var constructor = this.constructor;
  return this.then(
    function(value) {
      // @ts-ignore
      return constructor.resolve(callback()).then(function() {
        return value;
      });
    },
    function(reason) {
      // @ts-ignore
      return constructor.resolve(callback()).then(function() {
        // @ts-ignore
        return constructor.reject(reason);
      });
    }
  );
}

function allSettled(arr) {
  var P = this;
  return new P(function(resolve, reject) {
    if (!(arr && typeof arr.length !== 'undefined')) {
      return reject(
        new TypeError(
          typeof arr +
            ' ' +
            arr +
            ' is not iterable(cannot read property Symbol(Symbol.iterator))'
        )
      );
    }
    var args = Array.prototype.slice.call(arr);
    if (args.length === 0) return resolve([]);
    var remaining = args.length;

    function res(i, val) {
      if (val && (typeof val === 'object' || typeof val === 'function')) {
        var then = val.then;
        if (typeof then === 'function') {
          then.call(
            val,
            function(val) {
              res(i, val);
            },
            function(e) {
              args[i] = { status: 'rejected', reason: e };
              if (--remaining === 0) {
                resolve(args);
              }
            }
          );
          return;
        }
      }
      args[i] = { status: 'fulfilled', value: val };
      if (--remaining === 0) {
        resolve(args);
      }
    }

    for (var i = 0; i < args.length; i++) {
      res(i, args[i]);
    }
  });
}

// Store setTimeout reference so promise-polyfill will be unaffected by
// other code modifying setTimeout (like sinon.useFakeTimers())
var setTimeoutFunc = setTimeout;

function isArray(x) {
  return Boolean(x && typeof x.length !== 'undefined');
}

function noop() {}

// Polyfill for Function.prototype.bind
function bind(fn, thisArg) {
  return function() {
    fn.apply(thisArg, arguments);
  };
}

/**
 * @constructor
 * @param {Function} fn
 */
function Promise(fn) {
  if (!(this instanceof Promise))
    throw new TypeError('Promises must be constructed via new');
  if (typeof fn !== 'function') throw new TypeError('not a function');
  /** @type {!number} */
  this._state = 0;
  /** @type {!boolean} */
  this._handled = false;
  /** @type {Promise|undefined} */
  this._value = undefined;
  /** @type {!Array<!Function>} */
  this._deferreds = [];

  doResolve(fn, this);
}

function handle(self, deferred) {
  while (self._state === 3) {
    self = self._value;
  }
  if (self._state === 0) {
    self._deferreds.push(deferred);
    return;
  }
  self._handled = true;
  Promise._immediateFn(function() {
    var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
    if (cb === null) {
      (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
      return;
    }
    var ret;
    try {
      ret = cb(self._value);
    } catch (e) {
      reject(deferred.promise, e);
      return;
    }
    resolve(deferred.promise, ret);
  });
}

function resolve(self, newValue) {
  try {
    // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
    if (newValue === self)
      throw new TypeError('A promise cannot be resolved with itself.');
    if (
      newValue &&
      (typeof newValue === 'object' || typeof newValue === 'function')
    ) {
      var then = newValue.then;
      if (newValue instanceof Promise) {
        self._state = 3;
        self._value = newValue;
        finale(self);
        return;
      } else if (typeof then === 'function') {
        doResolve(bind(then, newValue), self);
        return;
      }
    }
    self._state = 1;
    self._value = newValue;
    finale(self);
  } catch (e) {
    reject(self, e);
  }
}

function reject(self, newValue) {
  self._state = 2;
  self._value = newValue;
  finale(self);
}

function finale(self) {
  if (self._state === 2 && self._deferreds.length === 0) {
    Promise._immediateFn(function() {
      if (!self._handled) {
        Promise._unhandledRejectionFn(self._value);
      }
    });
  }

  for (var i = 0, len = self._deferreds.length; i < len; i++) {
    handle(self, self._deferreds[i]);
  }
  self._deferreds = null;
}

/**
 * @constructor
 */
function Handler(onFulfilled, onRejected, promise) {
  this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
  this.onRejected = typeof onRejected === 'function' ? onRejected : null;
  this.promise = promise;
}

/**
 * Take a potentially misbehaving resolver function and make sure
 * onFulfilled and onRejected are only called once.
 *
 * Makes no guarantees about asynchrony.
 */
function doResolve(fn, self) {
  var done = false;
  try {
    fn(
      function(value) {
        if (done) return;
        done = true;
        resolve(self, value);
      },
      function(reason) {
        if (done) return;
        done = true;
        reject(self, reason);
      }
    );
  } catch (ex) {
    if (done) return;
    done = true;
    reject(self, ex);
  }
}

Promise.prototype['catch'] = function(onRejected) {
  return this.then(null, onRejected);
};

Promise.prototype.then = function(onFulfilled, onRejected) {
  // @ts-ignore
  var prom = new this.constructor(noop);

  handle(this, new Handler(onFulfilled, onRejected, prom));
  return prom;
};

Promise.prototype['finally'] = finallyConstructor;

Promise.all = function(arr) {
  return new Promise(function(resolve, reject) {
    if (!isArray(arr)) {
      return reject(new TypeError('Promise.all accepts an array'));
    }

    var args = Array.prototype.slice.call(arr);
    if (args.length === 0) return resolve([]);
    var remaining = args.length;

    function res(i, val) {
      try {
        if (val && (typeof val === 'object' || typeof val === 'function')) {
          var then = val.then;
          if (typeof then === 'function') {
            then.call(
              val,
              function(val) {
                res(i, val);
              },
              reject
            );
            return;
          }
        }
        args[i] = val;
        if (--remaining === 0) {
          resolve(args);
        }
      } catch (ex) {
        reject(ex);
      }
    }

    for (var i = 0; i < args.length; i++) {
      res(i, args[i]);
    }
  });
};

Promise.allSettled = allSettled;

Promise.resolve = function(value) {
  if (value && typeof value === 'object' && value.constructor === Promise) {
    return value;
  }

  return new Promise(function(resolve) {
    resolve(value);
  });
};

Promise.reject = function(value) {
  return new Promise(function(resolve, reject) {
    reject(value);
  });
};

Promise.race = function(arr) {
  return new Promise(function(resolve, reject) {
    if (!isArray(arr)) {
      return reject(new TypeError('Promise.race accepts an array'));
    }

    for (var i = 0, len = arr.length; i < len; i++) {
      Promise.resolve(arr[i]).then(resolve, reject);
    }
  });
};

// Use polyfill for setImmediate for performance gains
Promise._immediateFn =
  // @ts-ignore
  (typeof setImmediate === 'function' &&
    function(fn) {
      // @ts-ignore
      setImmediate(fn);
    }) ||
  function(fn) {
    setTimeoutFunc(fn, 0);
  };

Promise._unhandledRejectionFn = function _unhandledRejectionFn(err) {
  if (typeof console !== 'undefined' && console) {
    console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
  }
};

module.exports = Promise;

}).call(this)}).call(this,require("timers").setImmediate)
},{"timers":13}],13:[function(require,module,exports){
(function (setImmediate,clearImmediate){(function (){
var nextTick = require('process/browser.js').nextTick;
var apply = Function.prototype.apply;
var slice = Array.prototype.slice;
var immediateIds = {};
var nextImmediateId = 0;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) { timeout.close(); };

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// That's not how node.js implements it but the exposed api is the same.
exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
  var id = nextImmediateId++;
  var args = arguments.length < 2 ? false : slice.call(arguments, 1);

  immediateIds[id] = true;

  nextTick(function onNextTick() {
    if (immediateIds[id]) {
      // fn.call() is faster so we optimize for the common use-case
      // @see http://jsperf.com/call-apply-segu
      if (args) {
        fn.apply(null, args);
      } else {
        fn.call(null);
      }
      // Prevent ids from leaking
      exports.clearImmediate(id);
    }
  });

  return id;
};

exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
  delete immediateIds[id];
};
}).call(this)}).call(this,require("timers").setImmediate,require("timers").clearImmediate)
},{"process/browser.js":11,"timers":13}],"Callback":[function(require,module,exports){
"use strict";
var Logger = require('@icewarp/logger');
var defaults = {
	error: Logger.error
};
/**
 * @type {Object}
 * @description Defined middlewares by type
 */
var middlewares = {

};

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

module.exports = Callback;

},{"@icewarp/logger":"logger"}],"Library":[function(require,module,exports){
"use strict";
var Request = require('@icewarp/request');
var Callback = require('@icewarp/callback');
var Library = {};

var storage = {};
var path = './libs/';

/**
 * Set new library path
 * @param {string} new_path
 * @returns {undefined}
 */
Library.setPath = function (new_path) {
	path = new_path;
};

/**
 * Get library
 * @param {string} name
 * @param {@icewarp/callback} callback
 * @param {string} [custom_path] custom path only for this request
 * @param {object} lib_storage custom storage for required lib
 * @returns {unresolved}
 */
Library.get = function (name, callback, custom_path, lib_storage) {
	var _storage = lib_storage || storage;
	var request;
	if (_storage[name]) {
		return Callback('success', callback, _storage[name]);
	}
	request = new Request({
		url: (custom_path || path) + name + '.js',
		method: 'GET'
	});
	request.on('load', function (event, response) {
		if (response.status === 200) {
			new Function('window', response.response)(_storage);
			return Callback('success', callback, _storage[name]);
		}
		Callback('error', callback, response);
	});

	request.on('error', function () {
		Callback('error', callback);
	});
	request.on('abort', function () {
		Callback('error', callback);
	});
	request.send();
};

/**
 * Clean lib storage
 * @param {string} [name]
 * @returns {undefined}
 */
Library.clean = function (name) {
	if (name) {
		delete storage[name];
	} else {
		storage = {};
	}
};

module.exports = Library;

},{"@icewarp/callback":"Callback","@icewarp/request":"request"}],"debugger":[function(require,module,exports){
"use strict";
/**
 * Log storage
 * @type Array
 */
var log = [];
/**
 * Actual log level
 * @type Number
 */
var log_level = 0;
var MouseTracking = require('./MouseTracking');
/**
 * Power of last level
 * @type Number
 */
var power = 0;
/**
 * Dynamic Entry Classes Storage
 */
var entries = {};

/**
 * 
 * @param {string} name
 * @param {number} level
 * @returns {debug}
 */
function entryFactory(name, level) {
	name = name.toLowerCase().split('_').map(function (part) {
		return part[0].toUpperCase() + part.slice(1);
	}).join('');
	entries[level] = new Function("return function " + name + "Entry(data){this.data = data;this.data.stamp = Date.now();}")();
	return this;
}

function transform(element, x, y, unit) {
	unit = unit || 'px';
	['-webkit-', '-ms-', ''].forEach(function (prefix) {
		element.style[prefix + "transform"] = "translate(" + x + unit + ", " + y + unit + ")";
	});
}

function rulerEventHandler(event) {
	transform(document.getElementById('ruler'), event.clientX, event.clientY);
	document.getElementById('rulerCoordinates').textContent = "X: " + event.clientX + " Y: " + event.clientY;
}

/**
 * @class Debugger
 * class for logging errors and actions thru App for easier debugging
 */
var Debugger = {
	logEvent: function (fn, data, selector, event_type, event, module) {
		this.logAction({module: module.getClassname()/*, fn: fn.toString()*/, data: data, selector: selector.toString(), event_type: event_type/*, event: event*/}, this.levels.EVENT);
	},
	/**
	 * Log action
	 * @param {object} data
	 * @param {number} type
	 * @returns {Debugger}
	 */
	logAction: function (data, type) {
		if (log_level & type) {
			log.push(new entries[type](data));
			if (log.length > this.log_length) {
				if (this.dump && this.dump.fn) {
					this.dump.fn.call(this.dump.context || this, 'mouse', JSON.stringify(log));
					log = [];
				} else {
					log.shift();
				}
			}
		}
		return this;
	},
	/**
	 * Disable js error handeling
	 * @type boolean
	 */
	swallow: false,
	/** length of stored log
	 * @type number
	 */
	log_length: 500,
	/**
	 * @type object|boolean
	 */
	error_handler: false,
	/**
	 * Set external error handler
	 * @param {function} fn
	 * @param {object} context
	 * @returns {undefined}
	 */
	setErrorHandler: function (fn, context) {
		this.error_handler = {fn: fn, context: context};
		return this;
	},
	/**
	 * Init Debugger
	 * @param {object} options
	 * @returns {Debugger}
	 */
	init: function (options) {
		log_level = options.level;
		this.swallow = options.swallow || false;
		this.log_length = options.log_length || 500;
		this.dump = options.dump || false;
		options.error_handler && this.setErrorHandler(options.error_handler, options.error_handler_context);
		(log_level & this.levels.MOUSE_TRACKING) && MouseTracking.initTracking(options.mouse_log_length, this.dump);
		return this;
	},
	/**
	 * Show Logs
	 * @returns {undefined}
	 */
	show: function () {
		var data = {};
		log.forEach(function (entry, i) {
			data[entry.data.stamp + "." + i] = entry;
		});
		console.log(data);
		console.log(MouseTracking.getData());
	},
	/**
	 * Play mouse movements
	 * @returns {undefined}
	 */
	mousePlay: function () {
		MouseTracking.mousePlay();
	},
	/**
	 * Dynamic levels storage
	 */
	levels: {},
	/**
	 * Add new log level to Debugger, This action will also creates new log entry class
	 * @param {string} key
	 * @returns {Debugger}
	 */
	addLogLevel: function (key) {
		if (this.levels[key]) {
			throw Error('Level ' + key + ' already exists');
		}
		this.levels[key] = Math.pow(2, power++);
		return entryFactory.call(this, key, this.levels[key]);
	},
	/**
	 * enables ruller
	 * @returns {Debugger}
	 */
	enableRuler: function () {
		if (document.getElementById('ruler')) {
			return;
		}

		var ruler = document.createElement('i');
		ruler.setAttribute('id', 'ruler');
		var style = document.createElement('style');
		style.textContent = "\
			#ruler {\
				position: absolute;\
				top: 0;\
				left: 0;\
				will-change: transform;\
			}\
			#rulerCoordinates {\
				position: static;\
				opacity: 0.5;\
				background-color: #000;\
				color: #fff;\
				padding: 2px 5px;\
			}\
			#ruler::after, #ruler::before {\
				position: absolute;\
				content: '';\
				background-color: #00ff00;\
			}\
			#ruler::before {\
				width:1px;\
				height: 200vh;\
				top: -100vh;\
			}\
			#ruler::after {\
				height:1px;\
				width: 200vw;\
				left: -100vw;\
			}\
			body {\
				overflow: hidden !important;\
			}\
			* {\
				cursor: none !important;\
			}\
		";
		ruler.appendChild(style);
		document.body.appendChild(ruler);

		var rulerCoordinates = document.createElement('span');
		rulerCoordinates.setAttribute('id', 'rulerCoordinates');
		document.body.appendChild(rulerCoordinates);

		document.body.addEventListener('mousemove', rulerEventHandler);
		return this;
	},
	/**
	 * disables ruler
	 * @returns {Debugger}
	 */
	disableRuler: function () {
		document.body.removeEventListener('mousemove', rulerEventHandler);
		var ruler = document.getElementById('ruler');
		ruler.parentNode.removeChild(ruler);
		return this;
	}

};
typeof window !== 'undefined' && (window.onerror = function (message, source, lineno, colno, error) {
	Debugger.logAction({message: message, source: source, lineno: lineno, colno: colno, error: error}, Debugger.levels.ERRORS);
	this.error_handler && this.error_handler.fn.apply(this.error_handler.context || this, arguments);
	if (Debugger.swallow) {
		return false;
	}
});

Debugger.addLogLevel("ERROR")
	.addLogLevel("XHR")
	.addLogLevel("WS")
	.addLogLevel("EVENT")
	.addLogLevel("MOUSE_TRACKING");
module.exports = Debugger;
},{"./MouseTracking":1}],"delayed":[function(require,module,exports){
"use strict";
/**
 * stack of delayed functions
 * @type {object}
 */
var list = {};
/**
 * Function to delay function run
 * @param {function} func
 * @param {object} context
 * @param {number} delay
 * @param {string} ns - Namespace
 * @returns {undefined}
 */
function delayed(func, context, delay, ns) {
	ns = ns || func.toString().replace(/\s/g, "");
	list[ns] && clearTimeout(list[ns].timeout);
	list[ns] = {
		func: func, context: context, timeout: setTimeout(function () {
			func.call(context);
			delete list[ns];
		}, delay || 1000)
	};
	return list[ns].timeout;
}

/**
 * @module @icewarp/delayed
 */
module.exports = delayed;

},{}],"extend":[function(require,module,exports){
"use strict";
function defineFunction(parent, propKey) {
	return function () {
		return parent[propKey].apply(this, arguments);
	};
}

/** Module for extending
 * @description Set child prototype to parent prototype and copy parents static properties to child
 * @module extend
 * @param {object} parent
 * @param {object} child
 * @returns {undefined}
 */
module.exports = function (parent, child) {
	var _constructor = child.prototype.constructor;
	child.prototype = Object.create(parent.prototype);
	child.prototype.constructor = _constructor;
	/*for(var propKey in parent) {
	 parent.hasOwnProperty(propKey) && Object.defineProperty(child, propKey, Object.getOwnPropertyDescriptor(parent, propKey));
	 };*/
	for (var propKey in parent) {
		if (!parent.hasOwnProperty(propKey)) {
			continue;
		}
		if (typeof parent[propKey] === 'function') {
			child[propKey] = defineFunction(parent, propKey);
		} else {
			Object.defineProperty(child, propKey, Object.getOwnPropertyDescriptor(parent, propKey));
		}
	}
};

},{}],"function-name":[function(require,module,exports){
"use strict";
/**
 * Module to return function name
 * @param {Object} object
 * @returns {String}
 */
module.exports = function (object) {
	return object.name || function() {
		var funcNameRegex = /function\s+([^(]+)\s*\(/;
		var results = (funcNameRegex).exec(object.toString());
		return (results && results.length > 1) ? results[1] : "";
	}();
};

},{}],"icebrace-runtime":[function(require,module,exports){
"use strict";
var Escape = require('@icewarp/escape-string');

/**
 * @class Template
 */
var Template = {
	/**
	 * object to store template functions
	 */
	cache: {},
	/**
	 * @param {string} string - String representation of the compiled template function
	 * @returns {function} template function
	 */
	getFunction: function (string) {
		if (Template.cache[string]) {
			return Template.cache[string];
		}
		return Template.cache[string] = new Function('s','c','v','T','return ' + string);
	},
	/**
	 * returns an object with value and context
	 * @param {string[]} level array of keys
	 * @param {object} data context
	 * @param {object} current_data_level current context
	 * @returns {object} object with value and context
	 */
	resolvePath: function (level, data, current_data_level) {
		var ret = data.c;
		for (var i = 0; i < level.length; i++) {
			if (ret.hasOwnProperty(level[i])) {
				ret = ret[level[i]];
			} else if (data.p) {
				return Template.resolvePath(level, data.p, current_data_level);
			} else {
				return {v: '', c: current_data_level};
			}
		}
		return {v: ret, c: current_data_level};
	},
	/**
	 * 
	 * @param {object} context data
	 * @param {*} current
	 * @param {string} key
	 * @returns {mixed} value of the key
	 */
	getVar: function (context, current, key) {
		if (key === '.') {
			return (typeof context.c === 'object' ? current : context.c);
		}
		var value = Template.resolvePath(key.split('.'), context, context.c);
		if (typeof value.v === 'function') {
			return value.v.call(value.c);
		}
		return value.v;
	},
	/**
	 * 
	 * @param {object} context
	 * @param {*} value
	 * @param {string} key
	 * @returns {string} escaped string
	 */
	escapedString: function (context, value, key) {
		return Escape(toExport.u(context, value, key));
	},
	/**
	 * 
	 * @param {object} context
	 * @param {*} value
	 * @param {string} key
	 * @returns {string} non-escaped string
	 */
	unescapedString: function (context, value, key) {
		var variable = Template.getVar(context, value, key);
		return (variable !== null && typeof variable !== 'undefined') ? variable : '';
	},
	/**
	 * positive condition
	 * @param {object} strings
	 * @param {object} context
	 * @param {*} value
	 * @param {string} key
	 * @param {string} callback
	 * @returns {string}
	 */
	section: function (strings, context, value, key, callback) {
		var variable = Template.getVar(context, value, key), buffer;
		if (!variable) {
			return '';
		}
		if (Array.isArray(variable)) {
			buffer = variable.map(function (c) {
				return Template.getFunction(callback)(strings, {c: c, p: {c: variable, p: context}}, c, toExport);
			}, this).join('');
		} else if (typeof variable === 'string' || typeof variable === 'number' || typeof variable === 'boolean') {
			buffer = Template.getFunction(callback)(strings, context, variable, toExport);
		} else if (typeof variable === 'object' && variable !== null) {
			buffer = Template.getFunction(callback)(strings, {c: variable, p: context}, variable, toExport);
		}
		return buffer ? buffer : '';
	},
	/**
	 * 
	 * @param {object} context 
	 * @param {string} name name of component
	 * @returns {string}
	 */
	component: function (name, context) {
		return (Template.getTemplate(name, context)())(context);
	},
	/**
	 * else condition
	 * @param {object} strings
	 * @param {object} context
	 * @param {*} value
	 * @param {string} name
	 * @param {string} callback
	 * @returns {string}
	 */
	inverted: function (strings, context, value, name, callback) {
		var variable = this.getVar(context, value, name);
		return (!variable || (Array.isArray(variable) && !variable.length)) ? Template.getFunction(callback)(strings, context, value, toExport) : '';
	},
	getTemplate: function (name, context) {
		return name ? Template.templates[name] : name === void 0 ? Template.templates : false;
	}
};
/**
 * object to store templates
 */
Template.templates = {};

/**
 * @typedef {Function} Template~component Component function
 * @argument {string} name name of component
 * @argument {object} context context to be passed to component
 */

var toExport = {
	i: function () {
		return Template.inverted.apply(Template, arguments);
	},
	s: function () {
		return Template.section.apply(Template, arguments);
	},
	c: function () {
		return Template.component.apply(Template, arguments);
	},
	u: function () {
		return Template.unescapedString.apply(Template, arguments);
	},
	e: function () {
		return Template.escapedString.apply(Template, arguments);
	},
	t: function (name) {
		return Template.getTemplate.call(Template, name);
	},
	setTemplates: function (templates) {
		Template.templates = templates;
	},
	/**
	 * Replace component handler with new one for handeling custom template structures
	 * @param {Template~component} fn
	 * @returns {undefined}
	 */
	setComponentHandler: function (fn) {
		this.c = fn;
	}
};

/**
 * @module @icewarp/icebrace
 */
module.exports = toExport;
},{"@icewarp/escape-string":2}],"logger":[function(require,module,exports){
"use strict";
/**
 * function to log arguments to console
 * @param {mixed} args
 * @param {string} type
 * @returns {undefined}
 */
function log(args, type) {
	if (current_level & Logger[type]) {
		args = [].slice.call(args);
		if (!console[type.toLowerCase()]) {
			type = 'LOG';
		}

		if (enable_stack_trace) {
			console.groupCollapsed(new Date().toLocaleString() + ' ' + args[0]);
		} else {
			args.unshift(new Date().toLocaleString());
		}

		for (var i = 0; i < open_groups.length; i++) {
			args = args.map(function (arg) {
				return typeof arg === "string" ? "    " + arg : arg;
			});
		}

		console[type.toLowerCase()].apply(console, args);

		if (enable_stack_trace) {
			console.error('TRACE');
			console.groupEnd();
		}
	}
}

/**
 * Variable to store open console groups if console.group is not defined
 * @type String[]
 */
var open_groups = [];

var enable_stack_trace = false;

/**
 * @class Logger
 */
var Logger = {
	/**
	 * Set logging level
	 * @param {number} level
	 * @returns {Logger}
	 */
	setLevel: function (level) {
		current_level = level;
		return this;
	},
	/**
	 * Enable stack trace in console
	 * @param {Boolean} enable
	 * @returns {Logger}
	 */
	enableStackTrace: function (enable) {
		enable_stack_trace = enable;
		return this;
	},
	/**
	 * Log log message
	 * @returns {Logger}
	 */
	log: function () {
		log(arguments, "LOG");
		return this;
	},
	/**
	 * Log info message
	 * @returns {Logger}
	 */
	info: function () {
		log(arguments, "INFO");
		return this;
	},
	/**
	 * Log warn message
	 * @returns {Logger}
	 */
	warning: function () {
		log(arguments, "WARN");
		return this;
	},
	/**
	 * Log error message
	 * @returns {Logger}
	 */
	error: function () {
		log(arguments, "ERROR");
		return this;
	},
	/**
	 * Start console group if console.group is defined
	 * @param {String} groupname
	 * @returns {Logger}
	 */
	group: function (groupname) {
		if (console.group) {
			console.group(groupname);
		} else {
			log([groupname + ' console group start'], "LOG");
			open_groups.push(groupname);
		}
		return this;
	},

	/**
	 * Start collapsed console group if console.group is defined
	 * @param {String} groupname
	 * @returns {Logger}
	 */
	groupCollapsed: function (groupname) {
		if (console.groupCollapsed) {
			console.groupCollapsed(groupname);
		} else {
			log([groupname + ' console group start'], "LOG");
			open_groups.push(groupname);
		}
		return this;
	},

	/**
	 * End console group if console.group is defined
	 * @returns {Logger}
	 */
	groupEnd: function () {
		if (console.groupEnd) {
			console.groupEnd();
		} else {
			open_groups.shift();
		}
		return this;
	},

	/** @const {number} 8 */
	LOG: 8,
	/** @const {number} 4 */
	INFO: 4,
	/** @const {number} 2 */
	WARN: 2,
	/** @const {number} 1 */
	ERROR: 1,
	/** @const {number} 0 */
	NONE: 0,
	/** @const {number} 15 */
	ALL: 15
};

/**
 * Variable to store current log level
 * @type Number
 */
var current_level = Logger.ALL;

console.log = console.log || function () {
	alert([].slice.call(arguments).join("\n"));
};
console.info = console.info || console.log;
console.warn = console.warn || console.log;
console.error = console.error || console.log;

/**
 * @module @icewarp/logger
 */
module.exports = Logger;

},{}],"mix":[function(require,module,exports){
"use strict";
var function_name = require('@icewarp/function-name');

function defineOwnFunction(mixin, propKey) {
	return function () {
		return mixin[propKey].apply(this, arguments);
	};
}

function definePrototypeFunction(mixin, propKey) {
	return function () {
		return mixin.prototype[propKey].apply(this, arguments);
	};
}

/** Module for mixins
 * @description Copy parents properties to child (both static and prototype functions, except for constructor)
 * @module mix
 * @param {object} mixin
 * @param {object} target
 * @returns {undefined}
 */
module.exports = function (mixin, target) {
	for (var propKey in mixin) {
		if (!mixin.hasOwnProperty(propKey)) {
			continue;
		}
		if (typeof mixin[propKey] === 'function') {
			target[propKey] = defineOwnFunction(mixin, propKey);
		} else {
			Object.defineProperty(target, propKey, Object.getOwnPropertyDescriptor(mixin, propKey));
		}
	}
	for (propKey in mixin.prototype) {
		if (propKey === 'constructor' || !mixin.prototype.hasOwnProperty(propKey)) {
			continue;
		}
		if (typeof mixin.prototype[propKey] === 'function') {
			target.prototype[propKey] = definePrototypeFunction(mixin, propKey);
		} else {
			Object.defineProperty(target.prototype, propKey, Object.getOwnPropertyDescriptor(mixin.prototype, propKey));
		}
	}
	target.prototype.mixes = (target.prototype.mixes || []).concat([function_name(mixin)]);
};
},{"@icewarp/function-name":"function-name"}],"request":[function(require,module,exports){
"use strict";
/** Allowed events to listen on
 * 
 */
var events = ['progress', 'load', 'error', 'abort', 'always'];
/**
 * @type MissingOptionException
 */
var MissingOptionException = require('./missing_option_exception.js');
var Debugger = require('@icewarp/debugger');

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

/** Request module for handeling XHR requests
 * @class
 * @param {object} options
 * @returns {Request}
 */
function Request(options) {
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
 * @returns {Request}
 */
Request.prototype.on = function (event, callback, context) {
	this.events[event] = {func: callback, context: context || this};
	return this;
};
/** Send XHR
 * 
 * @param {object} payload
 * @returns {void}
 */
Request.prototype.send = function (payload) {
	Debugger.logAction({options: this.options, payload: payload}, Debugger.levels.XHR);
	this.xhr.send(payload || null);
};

/**
 *  @module Request
 *  @requires MissingOptionException
 */
module.exports = Request;
},{"./missing_option_exception.js":9,"@icewarp/debugger":"debugger"}],"socket":[function(require,module,exports){
"use strict";
var Connection = require('./connection.js');


/** Object containing all open connections
 * @type Object
 */
var connections = {};

/** Socket wrapper class for connection
 * @class 
 * @returns {nm$_socket.Socket}
 */
function Socket() {
}
/**
 * 
 * @param {string} name
 * @param {object} options options to initialize connection with
 * @returns {Connection}
 */
Socket.createConnection = function (name, options) {
	return (connections[name] = new Connection(options));
};
/** Getter for connection instance
 * 
 * @param {string} name
 * @returns {Connection}
 */
Socket.getConnection = function (name) {
	return connections[name];
};

/**
 * @module Socket
 * @exports Socket
 */
module.exports = Socket;

},{"./connection.js":10}]},{},[7]);
