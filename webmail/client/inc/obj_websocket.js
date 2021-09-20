/*
*/
_me = obj_websocket.prototype;
function obj_websocket(){};

_me.__constructor = function(sURL){

	//Default URL
	this.__sURL = sURL || (location.protocol == 'https:'?'wss:':'ws:') + '//' + location.hostname + (location.port?':'+location.port:'');

	// Communication protocol (Optional)
	this.__sProtocol = 'xmpp';
	this.__buffer = [];
	this.__heartBeatTimer = 0;

	this._add_destructor('__destruct');

	this.reopenTimeout;
	this._open();
};

// CONNECTING	0 	The connection is not yet open.
// OPEN 		1 	The connection is open and ready to communicate.
// CLOSING 		2 	The connection is in the process of closing.
// CLOSED 		3 	The connection is closed or couldn't be opened.
_me._open = function(){

	if (!this.__socket && WebSocket){
		console.log('obj_websocket','Connecting', this.__sURL);

		try{
			this.__socket = new WebSocket(this.__sURL, this.__sProtocol);
		}
		catch(r){
			console.log("obj_websocket", "Your browser does not support WebSocket object", r);
			return;
		}

		this.__socket.onopen = function (e) {

			this.__heartBeat();

			if (this._onopen)
				this._onopen();

			this.__exeEvent('onopen',e,{"owner":this});
			this._buffer_flush();

		}.bind(this);

		this.__socket.onmessage = function(e){
			if (this.__socket !== e.target) {
				return; // message on forceclosed socket
			}

			this.__heartBeat();

			//WSS message can contain multiple root tags, Str2Arr support only valid XML
			//XMPP strips <stream:stream> tag so its content can be unparseble dut to lack of defined NS
			//var aResponse = XMLTools.Str2Arr('<root xmlns:stream="http://etherx.jabber.org/streams">' + e.data + '</root>');

			var aResponse = XMLTools.Str2Arr('<root>' + e.data + '</root>');
			if (aResponse && aResponse.ROOT){
				aResponse = aResponse.ROOT[0];

				if (this._onmessage)
					this._onmessage(e, aResponse);

				this.__exeEvent('onmessage', e, aResponse, {"owner":this});
			}

		}.bind(this);

		this.__socket.onerror = function(e){

			console.log('websocket','ERROR', e);

			if (this._onerror)
				this._onerror();

			this.__exeEvent('onerror',e,{"owner":this});
		}.bind(this);

		//Error codes 	http://tools.ietf.org/html/rfc6455#section-7.4
		//				https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent#Status_codes
		//1013 	Try Again Later
		//1000	Normal
		this.__socket.onclose = function(e){
			if (this.__socket !== e.target) {
				return; // ignore closing forceclosed socket
			}

			console.log('websocket','CLOSE', e);

			this.__cancelHeartBeat();

			if (this._onclose)
				this._onclose(e);

			this.__exeEvent('onclose',e,{"owner":this});

			if (this.__socket) {
				delete this.__socket.onopen;
				delete this.__socket.onmessage;
				delete this.__socket.onerror;
				delete this.__socket.onclose;
				delete this.__socket;
			}

			//wasClean doesnt work with icewarp correctly
			if (e.wasClean == false && !this._destructed){
				if (gui.__online) {
					clearTimeout(this.reopenTimeout);
					this.reopenTimeout = setTimeout(function(){
						if (!this._destructed)
							this._open();
					}.bind(this), e.code === 1013?10000:5000);
				} else {
					gui._obeyEvent('online', [function(){
						if (!this._destructed) {
							clearTimeout(this.reopenTimeout);
							this.reopenTimeout = setTimeout(function() {
								this._open();
							}.bind(this), 5);
						}
						return false;
					}.bind(this)]);
				}
			}

		}.bind(this);
	}
};

/* code 1000 is not propagated correctly to onclose() */
_me._close = function(forceClose){
	var socket = this.__socket;
	if (socket && (socket.readyState < 2 || forceClose)) {
		socket.close(1000, 'bye bye');

		setTimeout(function() {
			if (socket === this.__socket) {
				// socket.onclose has not been called
				this.__socket && this.__socket.onclose({
					wasClean: false
				});
			}
		}.bind(this), 5);
	}
};

_me._getState = function(){
	return this.__socket?this.__socket.readyState:3;
};

_me._send = function(sData){

	if (!this.__socket) {
		sData && this.__buffer_queue(sData);
		clearTimeout(this.reopenTimeout);
		this.reopenTimeout = setTimeout(function() {
			this._open();
		}.bind(this), 5000);
	} else if (this.__socket.readyState > this.__socket.OPEN) {
		sData && this.__buffer_queue(sData);
		this._close(true);
	}
	else
	if (this.__socket.readyState === this.__socket.OPEN){
		try{
			this.__socket.send(sData);

			if (sData)
				this.__heartBeat();

			return true;
		}
		catch(r){
			console.log("obj_websocket", "Unable to send request:", sData);
		}
	}
	else
	if (sData)
		this.__buffer_queue(sData);

	return false;
};

	// PUBLIC
	_me._sendArray = function(aData, bPreserveCase){
		this._send(XMLTools.Arr2Str(aData,'',bPreserveCase));
	};
	_me._sendJSON = function(aData){
		this._send(JSON.stringify(aData));
	};
	_me._sendText = function(sData){
		this._send(sData);
	};

// Heart Beat
_me.__heartBeat = function() {
    this.__cancelHeartBeat();

	this.__heartBeatTimer = setTimeout(function(){
		if (this._getState() === 1){
			this.__socket.send('');
			this.__heartBeat();
		}
	}.bind(this), 20000);
};

_me.__cancelHeartBeat = function () {
    this.__heartBeatTimer && clearTimeout(this.__heartBeatTimer);
};

// BUFFER
_me.__buffer_queue = function(sXML) {
	this.__buffer.push(sXML);
};

_me._buffer_flush = function() {
	while(this.__buffer.length) {
		setTimeout(function(message) {
			this._send(message);
		}.bind(this, this.__buffer.shift()), 5)
	}
};

_me._buffer_clear = function() {
	this.__buffer = [];
};

_me._buffer_size = function() {
	return this.__buffer.length;
};

_me.__destruct = function(){
	this.__cancelHeartBeat();
	this._buffer_clear();

	//kill onclose
	delete this._onclose;

	this._close();
};