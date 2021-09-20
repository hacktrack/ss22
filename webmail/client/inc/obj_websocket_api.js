
_me = obj_websocket_api.prototype;
function obj_websocket_api(){};

_me.__constructor = function(){
	this._idPrefix = 'api-';
	this._xmlns = 'http://icewarp.com/api/';

	if (this._parent._getState() == 1)
		this._login();
};

_me._onmessage = function(e, aResponse){
	if (aResponse.IQ && aResponse.IQ[0].ATTRIBUTES && aResponse.IQ[0].ATTRIBUTES.XMLNS === this._xmlns){
		var id = aResponse.IQ[0].ATTRIBUTES.ID,
			bFailure = false,
			aHandler;

		if (id && this.__requests[id]){
			//Error
			if (aResponse.IQ[0].FAILURE){

				//Authnetification
				if (aResponse.IQ[0].FAILURE[0].STATUS && aResponse.IQ[0].FAILURE[0].STATUS[0].VALUE == 'User not authenticated'){
					this._state(0);

					//Put request back to the beginning of the buffer
					this.__buffer_queue(this.__requests[id].iq, true);

					this._login();
					return;
				}

				bFailure = true;
			}

			if (bFailure && this.__requests[id].error)
				aHandler = this.__requests[id].error;
			else
				aHandler = this.__requests[id].response;

			if (aHandler)
				executeCallbackFunction(aHandler, aResponse);

			delete this.__requests[id];
		}
		//SERVER PUSH
		else{
			//console.log('PUSH', aResponse);

			if (aResponse.IQ[0].STATUSLIST)
				this.__exeEvent('onStatusChange', aResponse.IQ[0].STATUSLIST[0].ITEM, {"owner":this});

			//Notifications
			if (aResponse.IQ[0].NOTIFY)
				for (var i in aResponse.IQ[0].NOTIFY)
					this._notify(aResponse.IQ[0].NOTIFY[i].ATTRIBUTES);

			if (aResponse.IQ[0].URLINFO)
				for (var i in aResponse.IQ[0].URLINFO)
					this.__exeEvent('onurlinfo', aResponse.IQ[0].URLINFO[i], {"owner":this});
		}
	}
};

_me._onclose = function(e){
	this._state(0);
};

_me._onopen = function(e){
	if (gui.connection && this.__errorID)
		gui.connection._hide(this.__errorID);

	this._login();
};

_me._onerror = function(e){
	if (gui.connection){
		if (this.__errorID)
			gui.connection._hide(this.__errorID);

		this.__errorID = gui.connection._queue(500);
	}
};

_me._create_iq = function(aData, aHandler, aErrHandler, bNoBuffer){
	//get free ID
	do { var id = this._idPrefix + unique_id() } while (this.__requests[id]);

	var aData = aData || {};
	aData.ATTRIBUTES = {XMLNS:"http://icewarp.com/api/", ID:id};
	var iq = {IQ:[aData]};

	this.__requests[id] = {type:'iq', request: iq, data: aData, response:aHandler, error:aErrHandler};

	this._request(iq, null, bNoBuffer);
};

_me._login = function(aData, bSkip){

	//Step 1 get Challenge
	if (!aData){

		this._state(1);

		//console.log('API', 'Login', 'Challenge');

		this._create_iq({'AUTH':[{ATTRIBUTES:{XMLNS:'urn:ietf:params:xml:ns:xmpp-sasl'}, MECHANISM:[{VALUE:'DIGEST-MD5'}]}]}, [this,'_login'], '', true);
	}
	else{

		if (aData.IQ){
			if (aData.IQ[0].CHALLENGE) {

				//Step 4 Final
				if (bSkip){

					//console.log('API', 'Login', 'Finalisation');

					this._create_iq({'RESPONSE':[{ATTRIBUTES:{XMLNS:'urn:ietf:params:xml:ns:xmpp-sasl'}}]}, [this,'_login'],'',true);
				}
				//Step 2 get Digest
				else{

					//console.log('API', 'Login', 'Digest');

					auth.get_digest({
						hash:aData.IQ[0].CHALLENGE[0].VALUE,
						command:'AUTHENTICATE'
					}, 'WEBSOCKET', [this,'_login']);
				}
			}
			else
			//Step 5 Success
			if (aData.IQ[0].SUCCESS){

				//console.log('API', 'Login', 'Success');

				this._state(2);
				this._buffer_flush();
			}
			else
			if (aData.IQ[0].FAILURE){

				//console.log('API', 'Login', 'Failure', aData);

				this._state(0);
			}
		}
		else
		//Step 3 use Digest
		if (Is.String(aData)){
			this._create_iq({'RESPONSE':[{ATTRIBUTES:{XMLNS:'urn:ietf:params:xml:ns:xmpp-sasl'}, VALUE:aData}]}, [this,'_login',[true]], '', true);
		}

	}

};

_me._subscribe = function(aType, aHandler, aErrHandler){

	TeamChatAPI && TeamChatAPI.Notifier.action('deviceid', {deviceid:dataSet.get('main',['device_id'])});

	if (aType == 'ALL'){
		var aRequest = {'SUBSCRIBE':[{ATTRIBUTES:{XMLNS:'api:iq:control'}, 'DEVICEID':[{VALUE:dataSet.get('main',['device_id'])}], 'ITEMS':[{'ALL':[true]}]}]};
	}
	else
	//not used
	if (Is.Array(aType) && aType.length){

		var aRequest = {'SUBSCRIBE':[{ATTRIBUTES:{XMLNS:'api:iq:control'}, 'DEVICEID':[{VALUE:dataSet.get('main',['device_id'])}], 'ITEMS':[{'ITEM':[]}]}]};
		for(var i = 0; aType.length>i; i++)
			aRequest.SUBSCRIBE[0].ITEMS[0].ITEM.push({VALUE:aType[i]});
	}

	this._create_iq(aRequest, [this, '__subscribers', [aHandler]], aErrHandler);
};

//not used
_me._unsubscribe = function(aType, aHandler, aErrHandler){

	if (Is.Array(aType) && aType.length){

		var aRequest = {'UNSUBSCRIBE':[{ATTRIBUTES:{XMLNS:'api:iq:control'}, 'ITEMS':[{'ITEM':[]}]}]};

		for(var i = 0; aType.length>i; i++)
			aRequest.UNSUBSCRIBE[0].ITEMS[0].ITEM.push({VALUE:aType[i]});

		this._create_iq(aRequest, [this, '__subscribers', [aHandler]], aErrHandler);
	}

};

_me.__subscribers = function(aResponse, aHandler){
	var iq, arr = [];
	if (aResponse.IQ && (iq = aResponse.IQ[0])){

		var item,
			sub = iq.SUBSCRIBE || iq.UNSUBSCRIBE;

		if (sub[0].ITEMS && (item = sub[0].ITEMS[0].ITEM))
			for(var i in item)
				arr.push(item[i].VALUE);
	}

	if (aHandler)
		executeCallbackFunction(aHandler, arr);
};

//Public notify
_me._notify = function(attr){
	if (this._onnotify)
		this._onnotify(attr);
	this.__exeEvent('onnotify', attr, {"owner":this});
};

_me._linkpreview = function(sURL, aHandler, aErrHandler){
	if (Is.String(sURL)){
		var aRequest = {'LINKPREVIEW':[{ATTRIBUTES:{XMLNS:'api:iq:control'}, 'URL':[{VALUE:sURL}]}]};
		this._create_iq(aRequest, [this, '__response', [aHandler]], aErrHandler);
	}
};
_me._pushGroupChatStatus = function(status, statusparam, handler, errHandler){
	var parts = dataSet.get('active_folder');
	if (parts){
		parts = parts.split('/');

		var active_folder = dataSet.get('folders', [parts.shift(), parts.join('/')]);
		if (active_folder){
			var msg = {status:[{ATTRIBUTES:{xmlns:"api:iq:control"}, email:[{VALUE:active_folder.OWNER}], folder:[{VALUE:active_folder.RELATIVE_PATH.replace('/', '\\')}], status:[{VALUE:status}]}]};
			statusparam && (msg.status[0].statusparam = [{VALUE:statusparam}]);
			this._create_iq(msg, handler, errHandler);
		}
	}
};

// Generic Response
_me.__response = function(aResponse, aHandler){
	if (aHandler && aResponse.IQ && aResponse.IQ[0])
		executeCallbackFunction(aHandler, aResponse.IQ[0]);
};