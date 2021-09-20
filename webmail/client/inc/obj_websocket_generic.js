
_me = obj_websocket_generic.prototype;
function obj_websocket_generic(){};

_me.__constructor = function(){
	this.__state = 0;		// binary; 1 is registred
	this.__requests = {};	// Sent requests
	this.__buffer = [];

	this._idPrefix = '';

	this.__errorID;			// connection manager

	//Listen to socket events
	this._parent._obeyEvent('onmessage', [this, '_onmessage']);

	this._parent._obeyEvent('onclose', [this, '_onclose']);
	this._parent._obeyEvent('onopen', [this, '_onopen']);
	this._parent._obeyEvent('onerror', [this, '_onerror']);
};


// _me._onclose = function(e){
// 	this._state(0);
// };

// _me._onopen = function(e){
// };

// _me._onerror = function(e){
// };

_me._state = function(v){
	if (Is.Defined(v)){
		this.__state = v;

		//call state change
		this._onstatechange && this._onstatechange(this.__state);
		this.__exeEvent('onstatechange',this.__state,{"owner":this});
	}
	else
		return this.__state;
};

// REQUEST
_me._request = function(aRq, aHandler, bNoBuffer){
	if (bNoBuffer || this._state() == 2){
		this._parent._sendArray(aRq);
		aHandler && executeCallbackFunction(aHandler);
	}
	else{
		this.__buffer_queue(aRq, aHandler);

		if (this._parent._getState() == 1 && this._state() == 0 && this._login)
			this._login();
	}
};

// REQUEST BUFFER in case user is not logged in
_me.__buffer_queue = function(aRq, aHandler, bTop) {
	if (bTop)
		this.__buffer.unshift({request:aRq, handler:aHandler});
	else
		this.__buffer.push({request:aRq, handler:aHandler});
};
_me._buffer_flush = function() {
	var aRq;
	while (this.__buffer.length){
		aRq = this.__buffer.shift();

		this._parent._sendArray(aRq.request);
		if (aRq.handler)
			executeCallbackFunction(aRq.handler);
	}
};
_me._buffer_size = function() {
	return this.__buffer.length;
};