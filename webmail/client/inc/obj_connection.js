_me = obj_connection.prototype;
function obj_connection(){};

/**
 *  The purpose of the connection object is to display
 *	error messages to the end user when there are problems
 *	with the network
 */
_me.__constructor = function() {
	var me = this;

	this.__requests = [];
	this.__count = null;

	this.__dimmer = mkElement('div',{id:'dimmer'});
	document.body.appendChild(this.__dimmer);

	// Create 'accept' button
	this.btn_ok._onclick = function() {
		me.__requests.shift();
		me._show();
	};

	// Create 'retry' button
	this.btn_re._onclick = function() {
		me._flush();
	};

	// Create 'Cancel' button
	this.btn_cancel._onclick = function() {
		me._clear();
	};

	this._add_destructor('__destructor');
};

_me._queue = function(iCode, iDelay, aHandler, aErrorHandler){
	var arr = {id:unique_id(), code:iCode, delay:iDelay || 0, handler:aHandler, errorHandler:aErrorHandler},
		old = this._queueInRequests(arr);

	if (old)
		return old.id;

	this.__requests.push(arr);
	this.__exeEvent('_queue', false, {"owner":this, id:arr.id});

	// Prevent showing after computer sleep
	if (!cRequest || !(cRequest.lapse > 30 || cRequest.lapse < 1))
		this._show();

	return arr.id;
};

/**
 * Return whether passed object exists among this.__requests
 * specified by `obj.code`, `obj.delay`, `obj.handler` and `obj.errorHandler`
 * @param {Object} obj
 * @param {Number} [obj.id]
 * @param {Object} obj.code
 * @param {Number} obj.delay
 * @param {Array|Function} [obj.handler]
 * @param {Array|Function} [obj.errorHandler]
 * @returns {Boolean}
 */
_me._queueInRequests = function(obj) {
	return (this.__requests.filter(function(request) {
		return obj.code === request.code
			&& obj.delay === request.delay
			&& getCallbackFunction(obj.handler) === getCallbackFunction(request.handler)
			&& getCallbackFunction(obj.errorHandler) === getCallbackFunction(request.errorHandler);
	})).pop();
};

// Execute requests in buffer, if any
_me._flush = function() {
	for(var iq, i = 0, j = this.__requests.length; i<j;i++)
		if ((iq = this.__requests.shift()) && iq.handler)
			executeCallbackFunction(iq.handler);

	this.__exeEvent('_flush', false, {"owner":this});
	this._show();
};

// Clear out whole buffer
_me._clear = function() {
	for(var iq, i = 0, j = this.__requests.length; i<j;i++)
		if ((iq = this.__requests.shift()) && iq.errorHandler)
			executeCallbackFunction(iq.errorHandler, false);

	this.__exeEvent('_flush', false, {"owner":this});
	this._show();
};

_me._hide = function(id){
	if (Is.Defined(id)){
		var bShow = false;

		this.__requests = this.__requests.filter(function(a){
			if (id == a.id){
				bShow = true;
				return false;
			}
			return true;
		});

		if (bShow) this._show();
	}
};

// Display error message to end user according to error code and type
_me._show = function() {

	//reset title
	if (typeof this.__titleID != 'undefined' && gui.frm_main && gui.frm_main.title)
		gui.frm_main.title._remove(this.__titleID, true);

	var iq = this.__requests[0];
	if (iq){

		// Clear out any remaining countdown
		if (typeof this.__interval != 'undefined')
			window.clearInterval(this.__interval);

		// Start countdown if wait time (in seconds, minimum 1 sec) is set
		if (iq.delay>0){
			this.__count = iq.delay;
			this._getAnchor('countdown').innerHTML = getLang('ERROR::COUNTDOWN', [iq.delay]);
			this.__interval = window.setInterval(function(){
				try {
					this._refresh();
				} catch (r) {
					gui._REQUEST_VARS.debug && console.log(this._name || false, r);
				}
			}.bind(this), 1000);
		}
		else
			this.__count = 0;

		// Display warning box
		this._main.style.display = 'block';

		// Get and hide countdown and buttons
		this._getAnchor('retry').style.display = 'none';
		this._getAnchor('countdown').style.display = 'none';
		this._getAnchor('accept').style.display = 'none';
		this._getAnchor('cancel').style.display = iq.delay ? 'block' : 'none';

		// Determine error type (and map it to messages in template)
		// Show countdown/retry button according to http code and retry possible
		var error;
		switch(iq.code) {
			// Display only information, never retry
			case 404:
				this.__dimmer.style.display = 'block';
				error = 'ERROR::FILENOTFOUND';
				iq.delay = 0;
				break;

			case 500:
				error = 'ERROR::SERVERERROR';
				iq.delay = 0;
				break;

			// Display only information, no earlier retry possible
			case 503:
				this.__dimmer.style.display = 'block';
				error = 'ERROR::OVERLOADED';
				break;

			default:
				error = 'ERROR::CONNECTION';
		}
		//this.text._value(getLang(error));
		this._getAnchor('errors').innerHTML = getLang(error);

		if (iq.delay){
			if (iq.code == 503)
				this._getAnchor('countdown').style.display = 'block';
			else
				this._getAnchor('retry').style.display = 'block';	// Display button to retry directly
		}
		else
			this._getAnchor('accept').style.display = 'block';	// No repeat, only accept message

		// Show title notification
		if (gui.frm_main && gui.frm_main.title)
			this.__titleID = gui.frm_main.title._add(getLang('TITLE::CERROR'), 5);
	}
	else{

		this._main.style.display = 'none';
		this.__dimmer.style.display = 'none';

		if (typeof this.__interval != 'undefined')
			window.clearInterval(this.__interval);

		this.__count = 0;
	}
};

// Update countdown if applicable
_me._refresh = function() {
	if (this.__count>0) {
		this.btn_re._text(getLang('FORM_BUTTONS::RETRY') + ' ('+ (this.__count) +')');
		this._getAnchor('countdown').innerHTML = getLang('ERROR::COUNTDOWN', [this.__count--]);
	}
	else
		this.btn_re._onclick();
};

_me.__destructor = function(){
	if (typeof this.__interval != 'undefined')
		window.clearInterval(this.__interval);

	if (this.__dimmer)
		this.__dimmer.parentNode.removeChild(this.__dimmer);
};
