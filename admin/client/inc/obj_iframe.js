function obj_iframe() {};

/**
 **/
obj_iframe.prototype.__constructor = function () {
	this.error = this._getAnchor('error');
	this.iframe = this._getAnchor('iframe');
	this.loading = this._getAnchor('loading');

	this.iframe.addEventListener('load', this._onloadHandler.bind(this));
	this.iframe.addEventListener('error', this._onerrorHandler.bind(this));
	this.__messageHandler = this._onmessageHandler.bind(this);
	window.addEventListener('message', this.__messageHandler);

	this.reload._onclick = this._reload.bind(this);
	this._add_destructor('__onbeforedestruct');
};

obj_iframe.prototype.__onbeforedestruct = function () {
	window.removeEventListener('message', this.__messageHandler);
	if(this.__reload && confirm(getLang('subscription::page_reload'))) {
		location.reload();
	}
}

obj_iframe.prototype._load = function (link) {
	this.__link = link;
	this.iframe.src = link;
}

obj_iframe.prototype._onloadHandler = function () {
	this.loading.setAttribute('is-hidden', '');
	this.iframe.removeAttribute('is-hidden');
}

obj_iframe.prototype._onerrorHandler = function () {
	this.loading.setAttribute('is-hidden', '');
	this.error.removeAttribute('is-hidden');
}

obj_iframe.prototype._onmessageHandler = function (event) {
	var data = {};

	try {
		data = JSON.parse(event.data);
	} catch (e) {
		data.action = event.data;
	}
	switch (data.action) {
		case 'save':
			this._parent._parent._close();
			break;
		case 'refresh':
			this.__reload = true;
	}
}

obj_iframe.prototype._reload = function () {
	this.error.setAttribute('is-hidden', '');
	this.loading.removeAttribute('is-hidden');
	this.iframe.src = '';
	this.iframe.src = this.__link;
}
