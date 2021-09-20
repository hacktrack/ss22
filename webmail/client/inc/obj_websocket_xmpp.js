
_me = obj_websocket_xmpp.prototype;
function obj_websocket_xmpp(){};

_me.__constructor = function(){
	this._idPrefix = 'xmpp-';
	this._add_destructor('_close');

	this._opt = {
		status: '',
		statusText: '',
		resource: 'WebClient-WS',
		resourceHash: '',
		imageHash: '',
		carbons: false
	};

	this.__streamBuffer	= {};
};

_me._init = function(){
	//Connection to already OPENned socket
	if (this._parent._getState() === 1){
		this._onopen();
	}
};

_me._close = function(e){
	if (this._state()){
		this._state(0);
		this._parent._sendArray({'CLOSE':[{ATTRIBUTES:{XMLNS:'urn:ietf:params:xml:ns:xmpp-framing'}}]});
	}
};

//// SOCKET EVENTS ////
_me._onstatechange = function(state){

	console.log('xmpp.state', state);

	//Offline
	if (state === 0){
		if (dataSet.get('xmpp',['status']) !== 'offline'){

			//update IM status
			dataSet.add('xmpp',['status'], 'offline');
			this.__exeEvent('status',{
				status:'offline',
				state:0
			});

			//update roster statuses
			var ds = dataSet.get('xmpp', ['roster']),
				bUpdate = false;

			for(var jid in ds){
				if (ds.hasOwnProperty(jid)){
					//set offline
					if (ds[jid].show && ds[jid].show != 'offline'){
						ds[jid].show = 'offline';
						ds[jid].status = '';

						//update active chats directly
						if (Is.Defined(ds[jid].active)){
							dataSet.update('xmpp', ['roster', jid]);
						}

						bUpdate = true;
					}

					//invalidate history
					if (ds[jid].history){
						if (ds[jid].active){
							ds[jid].invalid_history = true;
						}
						else{
							delete ds[jid].history;
							delete ds[jid].last_history;
						}
					}
				}
			}
			bUpdate && dataSet.update('xmpp', ['roster']);

			//global activity monitor
			dataSet.update('main', ['im']);
		}
	}
};

_me._onclose = function(e){
	this._state(0);
};

_me._onopen = function(e){
	if (this._state() === 0 && this._opt.status && this._opt.status != 'offline'){
		this._state(1);
		this._parent._sendArray({'OPEN':[{ATTRIBUTES:{XMLNS:'urn:ietf:params:xml:ns:xmpp-framing', VERSION:'1.0', TO:dataSet.get('main',['domain'])}}]});
	}
};

_me._onerror = function(e, bTerminate){
	console.warn('xmpp.error', e);

	if (bTerminate && this._state()>0){
		this._state(0);
		this._close();
	}
};

_me._getResourceHash = function() {
	var hash;
	var account = SHA1(sPrimaryAccount);
	var xmpp_resource_hash = JSON.parse(localStorage.getItem('xmpp_resource_hash') || '{}');
	var account_resource_hashes = xmpp_resource_hash[account] || {};
	for (var i in account_resource_hashes) {
		if (account_resource_hashes[i] + 60000 < +new Date()) {
			hash = i;
			break;
		}
	}

	if (!hash) {
		hash = SHA1(unique_id()).slice(-6);
		xmpp_resource_hash[account] = xmpp_resource_hash[account] || {};
		this.__resourceHashUpdateInterval = setInterval(function() {
			xmpp_resource_hash[account][hash] = +new Date();
			localStorage.setItem('xmpp_resource_hash', JSON.stringify(xmpp_resource_hash));
		}, 59000);
	}

	xmpp_resource_hash[account][hash] = +new Date();
	localStorage.setItem('xmpp_resource_hash', JSON.stringify(xmpp_resource_hash));

	return hash;
};

_me._onmessage = function(e, aResponse){
	//Skip API calls
	if (aResponse.IQ && aResponse.IQ[0].ATTRIBUTES && aResponse.IQ[0].ATTRIBUTES.XMLNS === 'http://icewarp.com/api/')
		return;

	if (aResponse.OPEN){
		this._state(2);
	}
	else
	if (aResponse['STREAM:FEATURES']){
		//<stream:features><starttls xmlns="urn:ietf:params:xml:ns:xmpp-tls"/><mechanisms xmlns="urn:ietf:params:xml:ns:xmpp-sasl"><mechanism>DIGEST-MD5</mechanism><mechanism>SCRAM-SHA-1</mechanism></mechanisms><feature xmlns="http://icewarp.com/ns/"/></stream:features>
		// if (aResponse['STREAM:FEATURES'][0].MECHANISMS){
			// if ((aResponse['STREAM:FEATURES'][0].MECHANISMS[0].MECHANISM || []).some(function(m){
			// 	return m.VALUE === 'DIGEST-MD5';
			// })){
				this._login();
				return;
			// }
		// }

		this._onerror('STREAM:FEATURES', true);
	}
	else
	if (aResponse['STREAM:ERROR']){
		console.warn('xmpp.error', aResponse);

		//client hash conflict -> generate new hash
		if (aResponse['STREAM:ERROR'][0].CONFLICT){
			this._opt.resourceHash = this._getResourceHash();
		}
	}
	else
	if (aResponse.CHALLENGE){
		this.__login_challenge(aResponse);
	}
	else
	if (aResponse.SUCCESS){

		//resource hash allows multiple connections
		this._opt.resourceHash = this._opt.resourceHash || this._getResourceHash();

		//<iq type="set"><bind xmlns="urn:ietf:params:xml:ns:xmpp-bind"/></iq>
		this._create_iq({BIND:[{ATTRIBUTES:{XMLNS:"urn:ietf:params:xml:ns:xmpp-bind"}, RESOURCE:[{VALUE:this._opt.resource + '-' + this._opt.resourceHash}]}]}, {type:'set'},
			[function(aData){

				this._state(4);

				this._gateway_list(dataSet.get('main',['domain']),[function(){

					this._roster_get(
						[function(){

							this._vcard('', '',
								[function () {

									//<iq type="set"><session xmlns="urn:ietf:params:xml:ns:xmpp-session"/></iq>
									this._create_iq({SESSION:[{ATTRIBUTES:{XMLNS:"urn:ietf:params:xml:ns:xmpp-session"}}]}, {type:'set'}, [function(){

										console.log('xmpp.session', 'started');

										//Fully logged in
										this._state(5);

										this._presence();
										this.__carbons_support();

										this._buffer_flush();

									}.bind(this)],[function(){
										this._onerror('session.start', true);
									}.bind(this)],
									true);

								}.bind(this)],
								[function () {
									this._onerror('vcard.get', true);
								}.bind(this)]);

						}.bind(this)],
						[function(){
							this._onerror('roster.get', true);
						}.bind(this)],
						true);

				}.bind(this)],
				[function(){
					this._onerror('gateway.list', true);
				}.bind(this)],
				true);

			}.bind(this)],
			[function(){
				this._onerror('bind', true);
			}.bind(this)],
			true);

	}
	else
	if (aResponse.FAILURE){
		this._state(0);
	}
	else
	if (aResponse.CLOSE){
		if (this._state()){
			this._state(0);
			return this._parent.__socket.onclose({
				wasClean: false
			});
		}
	}

	//QUERY
	if (aResponse.IQ){

		for(var i in aResponse.IQ){

			//HANDLERS
			var id = aResponse.IQ[i].ATTRIBUTES.ID;
			if (id && this.__requests[id]){

				//Error
				var bError = false;
				if (aResponse.IQ[i].ATTRIBUTES.TYPE == 'error'){
					bError = true;
				}

				if (bError && this.__requests[id].error)
					aHandler = this.__requests[id].error;
				else
					aHandler = this.__requests[id].response;

				delete this.__requests[id];

				if (aHandler)
					executeCallbackFunction(aHandler, aResponse);
			}

			//RESPONSE
			var query;
			if (aResponse.IQ[i].QUERY && (query = aResponse.IQ[i].QUERY[0]) && query.ATTRIBUTES){
				var sIQType = aResponse.IQ[i].ATTRIBUTES.TYPE;

				switch(query.ATTRIBUTES.XMLNS){
					//ROSTER
					case 'jabber:iq:roster':
						this.__exeEvent('response', 'roster', query);
						break;

					//OOB SUPPORT (for download)
					case 'http://jabber.org/protocol/disco#info':
						if (sIQType == 'get'){
							var q = this._create_query({

							IDENTITY:[{ATTRIBUTES:{CATEGORY:'client',NAME:'IceWarp '+GWOthers.getItem('LOGIN_SETTINGS','version'),TYPE:'pc'}}],
								FEATURE:[
									{ATTRIBUTES:{VAR:'http://jabber.org/protocol/bytestreams'}},
									{ATTRIBUTES:{VAR:'http://jabber.org/protocol/si'}},
									{ATTRIBUTES:{VAR:'http://jabber.org/protocol/si/profile/file-transfer'}},
									{ATTRIBUTES:{VAR:'http://jabber.org/protocol/disco#info'}},
									{ATTRIBUTES:{VAR:'http://jabber.org/protocol/commands'}},
									{ATTRIBUTES:{VAR:'jabber:x:data'}},
									//GEO
									{ATTRIBUTES:{VAR:'http://jabber.org/protocol/geoloc+notify'}},
									//XEP-0066
									//{ATTRIBUTES:{VAR:'jabber:iq:oob'}},
									{ATTRIBUTES:{VAR:'jabber:x:oob'}}
								]
							},'http://jabber.org/protocol/disco#info');

							q.QUERY[0].ATTRIBUTES.NODE = 'http://icewarp.com#'+GWOthers.getItem('LOGIN_SETTINGS','version');

							this._create_iq(q, {type:'result', id:aResponse.IQ[i].ATTRIBUTES.ID, to:aResponse.IQ[i].ATTRIBUTES.FROM});
						}
						break;

					//DOWNLOAD
					case 'jabber:iq:oob':
						if (sIQType == 'set'){
							var aX = {X:[query], ATTRIBUTES: aResponse.IQ[i].ATTRIBUTES};
							this.__exeEvent('response', 'x', aX);
						}
						break;

					//Incoming stream
					case 'http://jabber.org/protocol/bytestreams':
						if (query.STREAMHOST && query.ATTRIBUTES && query.ATTRIBUTES.SID && this.__streamBuffer[query.ATTRIBUTES.SID]){

							//Check connection by wm_upload
							storage.library('sha1');
							var out = [];

							//SHA1(SID + Initiator JID + Target JID)
							var sHash = SHA1(query.ATTRIBUTES.SID + aResponse.IQ[i].ATTRIBUTES.FROM + aResponse.IQ[i].ATTRIBUTES.TO);
							for (var j in query.STREAMHOST){
								out.push({
									jid:query.STREAMHOST[j].ATTRIBUTES.JID,
									host:query.STREAMHOST[j].ATTRIBUTES.HOST + (query.STREAMHOST[j].ATTRIBUTES.PORT?':'+ query.STREAMHOST[j].ATTRIBUTES.PORT:''),
									hash:sHash
								});
							}

							var oUpload = new wm_upload();
								oUpload.socks_connect(out,[this,'_socks_connect',[query.ATTRIBUTES.SID, aResponse.IQ[i].ATTRIBUTES.ID, aResponse.IQ[i].ATTRIBUTES.FROM]]);
						}
						break;
				}

			}

			//SOCKS download
			if (aResponse.IQ[i].SI && aResponse.IQ[i].SI[0].FILE){
				var si = aResponse.IQ[i].SI[0];
					si.FROM = [{VALUE:aResponse.IQ[i].ATTRIBUTES.FROM}];
					si.ID = [{VALUE:id}];

				this.__exeEvent('response', 'download', si);
			}
		}
	}

	//PRESENCE
	if (aResponse.PRESENCE){
		var attr,
			presenceBuffer = {};

		//Move unavailable presences to the top
		aResponse.PRESENCE.sort(function(a, b){
			var a = a.ATTRIBUTES || {},
				b = b.ATTRIBUTES || {};

			if (a.TYPE == b.TYPE)
				return 0;
			else
			if (a.TYPE == 'unavailable')
				return -1;
			else
			if (b.TYPE == 'unavailable')
				return 1;
		});

		for(var i in aResponse.PRESENCE){

			if (aResponse.PRESENCE[i].ERROR){
				this.__exeEvent('response', 'error', aResponse.PRESENCE[i].ERROR[0]);
				continue;
			}

			attr = aResponse.PRESENCE[i].ATTRIBUTES || {};

			//Probe presence of all remaining resources when one resource goes offline
			if (attr.FROM){
				var sFrom = attr.FROM.split('/').shift().toLowerCase();
				if (sFrom !== sPrimaryAccount){

					if (!presenceBuffer[sFrom])
						presenceBuffer[sFrom] = {status:this._user_status(sFrom), probe: false};

					presenceBuffer[sFrom].probe = presenceBuffer[sFrom].status !== 'offline' && attr.TYPE === 'unavailable';
				}
			}

			if (!~['subscribe','unavailable','subscribed','unsubscribe','unsubscribed'].indexOf(attr.TYPE)){
				attr.TYPE = 'state_change';
			}

			this.__exeEvent('response', attr.TYPE, aResponse.PRESENCE[i]);
		}

		//Probe presence of all remaining resources when one resource goes offline
		for(var sFrom in presenceBuffer){
			if (presenceBuffer.hasOwnProperty(sFrom) && presenceBuffer[sFrom].probe)
				this._request(this._create_presence('','probe', sFrom));
		}
	}

	//MESSAGE
	if (aResponse.MESSAGE){
		for(var i in aResponse.MESSAGE){

			var aMessage = aResponse.MESSAGE[i], sType = '', data = '';

			if (aMessage.ERROR){
				sType = 'error';
				data = aMessage.ERROR[0];
			}
			else
			if (aMessage.COMPOSING){
				sType = 'composing',
				data = aMessage.ATTRIBUTES.FROM;
			}
			else
			if (aMessage.PAUSED){
				sType = 'paused',
				data = aMessage.ATTRIBUTES.FROM;
			}
			else
			if (aMessage.GONE){
				sType = 'gone',
				data = aMessage.ATTRIBUTES.FROM;
			}
			else
			if (aMessage.EVENT){
				sType = 'event',
				data = aMessage;
			}
			else
			if (aMessage.X){
				sType = 'x',
				data = aMessage;
			}
			else
			if (aMessage.BODY){
				sType = 'message',
				data = aMessage;
			}
			else
			if (aMessage.SENT && aMessage.SENT[0].FORWARDED){
				sType = 'sent',
				data = aMessage.SENT[0].FORWARDED[0];
			}
			else
			if (aMessage.RECEIVED && aMessage.RECEIVED[0].FORWARDED){
				sType = 'received',
				data = aMessage.RECEIVED[0].FORWARDED[0];
			}

			this.__exeEvent('response', sType, data);
		}
	}
};

//// LOGIN SEQUENCE ////
_me._login = function(){
	switch(this._state()){
		case 0:
			this._init();
			break;
		case 2:
			this._state(3);
			this._parent._sendArray({'AUTH':[{ATTRIBUTES:{XMLNS:'jabber:iq:auth'}, MECHANISM:[{VALUE:'DIGEST-MD5'}]}]});
	}
};
	_me.__login_challenge = function(aResponse){
		auth.get_digest({
			hash:aResponse.CHALLENGE[0].VALUE,
			command:'AUTHENTICATE'
		}, 'WEBSOCKET', [function(aData){
			this._parent._sendArray({'RESPONSE':[{ATTRIBUTES:{XMLNS:'urn:ietf:params:xml:ns:xmpp-sasl'}, VALUE:aData}]});
		}.bind(this)]);
	};

//// AUX METHODS ////

_me._request = function(aRq, aHandler, bNoBuffer){
	if (bNoBuffer || this._state() > 3){
		this._parent._sendArray(aRq);
		aHandler && executeCallbackFunction(aHandler);
	}
	else{
		this.__buffer_queue(aRq, aHandler);

		if (this._parent._getState() === 1 && this._state() === 0)
			this._login();
	}
};

_me._create_iq = function(aData, opt, aHandler, aErrHandler, bNoBuffer){

	var sType = opt.type || 'get',
		sTo = opt.to,
		id = opt.id;

	//get free ID
	if (!Is.Defined(id))
		do { var id = this._idPrefix + unique_id() } while (this.__requests[id]);

	var aData = aData || {};

	if (!aData.ATTRIBUTES)
		aData.ATTRIBUTES = {};

	aData.ATTRIBUTES.ID = id;
	//aData.ATTRIBUTES.XMLNS = "jabber:client";

	if (sType)
		aData.ATTRIBUTES.TYPE = sType;
	if (sTo)
		aData.ATTRIBUTES.TO = sTo;

	var iq = {IQ:[aData]};

	this.__requests[id] = {type:'iq', request: iq, data: aData, response:aHandler, error:aErrHandler};

	this._request(iq, null, bNoBuffer);
};

_me._create_query = function(aData,sXMLns){

	var aRequest = {'QUERY':[{}]};

	if (aData)
		aRequest.QUERY = [aData];

	if (sXMLns){
		if (!aRequest.QUERY[0].ATTRIBUTES)
			aRequest.QUERY[0].ATTRIBUTES = {};

		aRequest.QUERY[0].ATTRIBUTES['XMLNS'] = sXMLns;
	}

	return aRequest;
};

_me._create_message = function(aData, sType, sTo){
	var aRequest = {MESSAGE:[]},
		tmp = {};

	if (typeof sTo == 'string')
		sTo = [sTo];

	for (var i in sTo)
		if (sTo[i]){
			if (aData)
				tmp = clone(aData,true);
			else
				    tmp = {};

			if (!tmp.ATTRIBUTES)
				tmp.ATTRIBUTES = {};

			if (sType)
				tmp.ATTRIBUTES.TYPE = sType;

			tmp.ATTRIBUTES.TO = sTo[i];

			aRequest.MESSAGE.push(tmp);
		}

	return aRequest;
};

_me._create_presence = function(aData,sType,sTo){

	var aRequest = {PRESENCE:[{}]};

	if (aData)
		aRequest.PRESENCE = [aData];

	if (!aRequest.PRESENCE[0].ATTRIBUTES)
		aRequest.PRESENCE[0].ATTRIBUTES = {};

	aRequest.PRESENCE[0].ATTRIBUTES.XMLNS = "jabber:client";
	aRequest.PRESENCE[0].ATTRIBUTES.FROM = sPrimaryAccount + '/' + this._opt.resource + '-' + this._opt.resourceHash;

	if (sType)
		aRequest.PRESENCE[0].ATTRIBUTES.TYPE = sType;

	if (sTo)
		aRequest.PRESENCE[0].ATTRIBUTES.TO = sTo;

	return aRequest;
};

//// PRIVATE METHODS ////

/**
 * PRIVATE Enable Carbons - part of login sequence
 * https://xmpp.org/extensions/xep-0280.html#disco
 */
_me.__carbons_support = function(){
	this._create_iq(this._create_query('','http://jabber.org/protocol/disco#info'), {type:'get', to:dataSet.get('main',['domain'])}, [function(aData){
		if (aData.IQ){
			aData = aData.IQ[0];
			if (aData.QUERY){
				var aFeatures = aData.QUERY[0].FEATURE;
				for(var id in aFeatures){
					if (aFeatures.hasOwnProperty(id) && aFeatures[id].ATTRIBUTES && aFeatures[id].ATTRIBUTES.VAR === "urn:xmpp:carbons:2"){

						var aData = {ENABLE:[{ATTRIBUTES:{XMLNS:"urn:xmpp:carbons:2"}}]};

						this._create_iq(aData, {type:'set'}, [function(aData){
							if (aData.IQ){
								aData = aData.IQ[0];
								if (aData && aData.ATTRIBUTES && aData.ATTRIBUTES.TYPE === "result"){
									console.log('xmpp.carbons', 'active');
									this._opt.carbons = true;
								}
							}
						}.bind(this)]);

						break;
					}
				}
			}
		}

	}.bind(this)]);
};

//// PUBLIC METHODS ////

// @note: use aHandler only for offline!
_me._presence = function(sStatus, sStatusText, aHandler){

	var state = this._state(),
		aExtHandler = [function(){

			dataSet.add('xmpp',['statusText'], this._opt.statusText);

			if (dataSet.get('xmpp',['status']) !== this._opt.status){
				dataSet.add('xmpp',['status'], this._opt.status);

				this.__exeEvent('status',{
					status:this._opt.status,
					state:state
				});

				//global activity monitor
				dataSet.update('main', ['im']);
			}

			aHandler && executeCallbackFunction(aHandler);

		}.bind(this)];

	this._opt.status = (sStatus || this._opt.status || '').toLowerCase();
	this._opt.statusText = Is.Defined(sStatusText)?sStatusText:this._opt.statusText;

	if (this._opt.status == 'offline'){
		if (state === 5){

			var rq = this._create_presence({STATUS:[{VALUE:'Logged out'}]}, 'unavailable');

			this._request(rq, [function(){
				this._close();
				executeCallbackFunction(aExtHandler);
			}.bind(this)]);
		}
		else{
			if (state>0)
				this._close();

			executeCallbackFunction(aExtHandler);
		}
	}
	else
	if (this._opt.status){
		switch(state){
			case 5:
				var aPresence = {
					PRIORITY:[{VALUE:5}],
					STATUS:[{VALUE:this._opt.statusText}],
					C:[{ATTRIBUTES:{
						XMLNS:"http://jabber.org/protocol/caps",
						NODE:"http://psi-im.org/caps",
						VER:GWOthers.getItem('LOGIN_SETTINGS','version')
					}}],
					//Avatar Update <x xmlns='vcard-temp:x:update'><photo>sha1-hash-of-image</photo></x>
					X:[{ATTRIBUTES:{XMLNS:'vcard-temp:x:update'},PHOTO:[{VALUE:this._opt.imageHash}]}]
				};

				if (this._opt.status != 'online')
					aPresence.SHOW = [{VALUE:this._opt.status}];

				this._request(this._create_presence(aPresence), aExtHandler);
				break;

			default:
				//relogin
				this._close();

			case 0:
				this._init();
		}
	}
};

/*
# List
<iq xmlns="jabber:client" type="get" id="5987343346676919001244638385735">
<query xmlns="http://jabber.org/protocol/disco#items"/>
</iq>

<iq from="icewarp.com" type="result" id="ab07a" to="tonda@icewarp.com/Office" >
<query xmlns="http://jabber.org/protocol/disco#items">
<item category="gateway" type="icq" name="ICQ Transport Gateway" jid="icq.icewarp.com" />
<item category="gateway" type="service" name="E-mail Transport" jid="email.icewarp.com" />
</query>
</iq>
*/
// GATEWAY
_me._gateway_list = function(sDomain, aHandler, aErrHandler, bNoBuffer){
	this._create_iq(this._create_query('','http://jabber.org/protocol/disco#items'), {to:sDomain}, [this,'__gateways_parse', [aHandler]], aErrHandler, bNoBuffer);
};
	_me.__gateways_parse = function(aData, aHandler){
		var aGateways = {};
		if (aData && aData.IQ && (aData = aData.IQ[0]) && aData.QUERY && aData.QUERY[0] && (aData = aData.QUERY[0].ITEM)){
			for (var i in aData){
				aData[i].ATTRIBUTES.TYPE && aData[i].ATTRIBUTES.TYPE.toLowerCase();
				aGateways[aData[i].ATTRIBUTES.JID] = aData[i].ATTRIBUTES;
			}

			dataSet.add('xmpp', ['gateways'], aGateways);
		}

		if (aHandler)
			executeCallbackFunction(aHandler, aGateways);
	};
/*
# Ask for reg info
<iq type="get" to="007guard.com" id="ab4ba" >
<query xmlns="jabber:iq:register"/>
</iq>

<iq from="007guard.com" type="result" id="ab4ba" to="user@merakdemo.com/Work" >
<query xmlns="jabber:iq:register">
<username/>
<password/>
<instructions>Please enter your username and password</instructions>
</query>
</iq>

# Do registration
<iq type="set" to="007guard.com" id="ab48a" >
<query xmlns="jabber:iq:register">
<username>abc</username>
<password>cda</password>
</query>
</iq>
*/
_me._gateway_registr = function(aData, sTo, aHandler){
	this._create_iq(this._create_query(aData,'jabber:iq:register'), {type:aData?'set':'get', to:sTo}, aHandler);
};

_me._vcard = function(sTo, aValue, aHandler, aErrHandler){

	/*
	GET
	<iq type="get" to="admin@merakdemo.com" id="aabda" >
		<vCard xmlns="vcard-temp" version="2.0" prodid="-//HandGen//NONSGML vGen v1.0//EN" />
	</iq>

	SET
	<iq type="set" id="aabea" >
		<vCard xmlns="vcard-temp" version="2.0" prodid="-//HandGen//NONSGML vGen v1.0//EN" >
			<FN>Administrator</FN>
			<NICKNAME>zork</NICKNAME>
			<BDAY>10.02.1900</BDAY>
			<URL>www</URL>
		</vCard>
	</iq>
	*/

	var aData = {vCard:[{}]};

	if (aValue)
		aData.vCard[0] = aValue;

	aData.vCard[0].ATTRIBUTES = {xmlns:"vcard-temp",version:'2.0',prodid:'-//HandGen//NONSGML vGen v1.0//EN'};

	//SET is CaseSensitive
	this._create_iq(aData, {type:aValue?'set':'get', to:sTo || sPrimaryAccount}, sTo?aHandler:[this,'__photo_hash',[aHandler]], aErrHandler, !aValue && !sTo);
};

	/**
	 * PRIVATE Updates vCard photo Hash
	 *
	 * @param {xml array} aData
	 * @param {handler} aHandler
	 */
	_me.__photo_hash = function(aData, aHandler){

		//Avatar Photo
		if (aData && aData.IQ && (aData = aData.IQ[0]) && aData.VCARD && aData.VCARD[0] && (aData = aData.VCARD[0])){
			if (aData.PHOTO && aData.PHOTO[0] && aData.PHOTO[0].TYPE && aData.PHOTO[0].BINVAL){
				storage.library('sha1');
				this._opt.imageHash = SHA1(base64.decode(aData.PHOTO[0].BINVAL[0].VALUE));
			}
			else
				this._opt.imageHash = '';
		}

		if (aHandler){
			executeCallbackFunction(aHandler, aData);
		}
	};

// DOWNLOAD
_me._oob_cancel = function(aData, sTo){
	if (sTo){

		var q = this._create_query(aData,'jabber:iq:oob');
			q.ERROR = [{ATTRIBUTES:{CODE:406,TYPE:'modify'},'NOT-ACCEPTABLE':[{ATTRIBUTES:{XMLNS:'urn:ietf:params:xml:ns:xmpp-stanzas'}}]}];

		this._create_iq(q, {type:'error', to:sTo});
	}
};

/*
<iq from="Vaio" type="error" id="ac7ca" to="t61" >
<error code="403" >Declined</error>
</iq>
*/
_me._stream_cancel = function(sTo){
	if (sTo)
		this._create_iq({ERROR:[{ATTRIBUTES:{CODE:403},VALUE:'Declined'}]}, {type:'error', to:sTo});
};

/*
<iq type="result" to="imap@icewarp.com/Development" id="aac1a" >
<si xmlns="http://jabber.org/protocol/si">
<feature xmlns="http://jabber.org/protocol/feature-neg">
<x xmlns="jabber:x:data" type="submit" >
<field var="stream-method" >
<value>http://jabber.org/protocol/bytestreams</value>
</field>
</x>
</feature>
</si>
</iq>
*/
_me._stream_accept = function(aData, sID, sTo){

	if (sID && sTo && aData && aData.ATTRIBUTES && aData.ATTRIBUTES.ID && aData.FILE && aData.FILE[0].ATTRIBUTES && aData.FILE[0].ATTRIBUTES.NAME && aData.FILE[0].ATTRIBUTES.SIZE){

		var si = {
			SI: [{
				ATTRIBUTES: {
					XMLNS: 'http://jabber.org/protocol/si'
				},
				FEATURE: [{
					ATTRIBUTES: {
						XMLNS: 'http://jabber.org/protocol/feature-neg'
					},
					X: [{
						ATTRIBUTES: {
							XMLNS: 'jabber:x:data',
							TYPE: 'submit'
						},
						FIELD: [{
							ATTRIBUTES: {
								VAR: 'stream-method'
							},
							VALUE: [{
								VALUE: 'http://jabber.org/protocol/bytestreams-oob'
							}]
						}]
					}]
				}]
			}]
		};

		//Insert into stream buffer
		this.__streamBuffer[aData.ATTRIBUTES.ID] = {
			name:aData.FILE[0].ATTRIBUTES.NAME,
			size:aData.FILE[0].ATTRIBUTES.SIZE
		};

		this._create_iq(si, {type:'result', id:sID, to:sTo});
	}
};
_me._socks_connect = function (aData,sSID,sFrom){
	if (aData){
		var out = this.__streamBuffer[sSID];
		if (out && sFrom){
			out.jid = aData.jid;
			out.socket = aData.socket;

			this._create_iq(this._create_query({'STREAMHOST-USED':[{ATTRIBUTES:{JID:out.jid}}]},'http://jabber.org/protocol/bytestreams'), {type:'result', to:sFrom}, [
				function(){
					this.__exeEvent('response', 'streamhost', out);
				}.bind(this)
			]);
		}
	}
	//Handle Error (Socket can not be open)
	else
		this.__exeEvent('response', 'streamhost');

	delete this.__streamBuffer[sSID];
};
// UPLOAD

_me._stream_send = function (sFolder, sFile, sClass, iSize, sName, sTo, sDesc) {

	//Do Upload.Extract when size is 0 (GW Object)
	if (!iSize){
	    storage.library('wm_upload');
		var up = new wm_upload();
			up.extract(sFolder,sFile,sClass,[this, '_stream_send', [sTo, sDesc]]);

		return;
	}

	/*
	<<<
	<?xml version="1.0" encoding="utf-8" ?>
	<iq sid="008e4086edb67dfb0869437385289a49" type="result">
		<query xmlns="webmail:iq:upload">
			<upload>
				<name>basic login.png</name>
				<type>application/octet-stream</type>
				<size>80532</size>
			</upload>
		</query>
	</iq>

	>>>
	<iq from="imap@icewarp.com/Development" type="set" id="aac1a" to="klos@icewarp.com/Development" >
		<si xmlns="http://jabber.org/protocol/si" profile="http://jabber.org/protocol/si/profile/file-transfer" id="s5b_f5c122943d5604d5" >
			<file xmlns="http://jabber.org/protocol/si/profile/file-transfer" size="821" name="w7.txt" >
				<range/>
			</file>
			<feature xmlns="http://jabber.org/protocol/feature-neg">
				<x xmlns="jabber:x:data" type="form" >
					<field type="list-single" var="stream-method" >
						<option>
							<value>http://jabber.org/protocol/bytestreams</value>
						</option>
					</field>
				</x>
			</feature>
		</si>
	</iq>

	<iq from="admin@merakdemo.com/WebClient" type="set" id="4877309432968767401262613910041" to="user@merakdemo.com" >
		<si xmlns="http://jabber.org/protocol/si" profile="http://jabber.org/protocol/si/profile/file-transfer" id="a611dcb32f8151ace9a48b51190a54432b7eadd3" >
			<file xmlns="http://jabber.org/protocol/si/profile/file-transfer" size="80532" name="basic login.png" >
				<desc>ahojte</desc>
			</file>
			<feature xmlns="http://jabber.org/protocol/feature-neg">
				<x xmlns="jabber:x:data" var="stream-method" >
					<option>
						<value>http://jabber.org/protocol/bytestreams</value>
					</option>
				</x>
			</feature>
		</si>
	</iq>
	*/
	storage.library('sha1');
	var sHash = SHA1(unique_id()+sPrimaryAccount+'/WebClient'+sTo);
	var q = {SI:[{
		ATTRIBUTES:{XMLNS:"http://jabber.org/protocol/si",PROFILE:"http://jabber.org/protocol/si/profile/file-transfer",ID:sHash},
		FILE:[{
			ATTRIBUTES:{XMLNS:"http://jabber.org/protocol/si/profile/file-transfer", SIZE:iSize || '0', NAME:sName},
			DESC:[{VALUE:sDesc}]
		}],
		FEATURE:[{
			    ATTRIBUTES:{XMLNS:"http://jabber.org/protocol/feature-neg"},
			    X:[{
			    	ATTRIBUTES:{XMLNS:"jabber:x:data", TYPE:"form"},
			    	FIELD:[{
			    	    ATTRIBUTES:{TYPE:"list-single", VAR:"stream-method"},
				    	OPTION:[{
						VALUE:[{VALUE:'http://jabber.org/protocol/bytestreams'}]
					}]
				}]
			}]
		}]
	}]};

	//check oob support
	this._create_iq(q, {type:'set', to:sTo}, [this,'_stream_support',[sHash, sFolder, sFile, sClass, sDesc]]);
};

_me._stream_support = function(aData, sHash, sFolder, sFile, sClass, sDesc) {
/*
<<<
	[stream_upload]
.. [0]
.... [SI]
...... [0]
........ [FEATURE]
.......... [0]
............ [X]
.............. [0]
................ [FIELD]
.................. [0]
.................... [VALUE]
...................... [0]
........................ [VALUE](string) = http://jabber.org/protocol/bytestreams
.................... [ATTRIBUTES]
...................... [VAR](string) = stream-method
................ [ATTRIBUTES]
.................. [XMLNS](string) = jabber:x:data
.................. [TYPE](string) = submit
............ [ATTRIBUTES]
.............. [XMLNS](string) = http://jabber.org/protocol/feature-neg
........ [ATTRIBUTES]
.......... [XMLNS](string) = http://jabber.org/protocol/si
........ [FROM]
.......... [0]
............ [VALUE](string) = user@merakdemo.com/Work
........ [ID]
.......... [0]
............ [VALUE](string) = 9552796309779942001262614382663
.... [ATTRIBUTES]
...... [ID](string) = 9552796309779942001262614382663
...... [FROM](string) = user@merakdemo.com/Work
...... [TO](string) = admin@merakdemo.com/WebClient
...... [TYPE](string) = result
.. [1](undefined) = undefined
.. [2]
.... [JID](string) = proxy.merakdemo.com
.... [HOST](string) = 127.0.0.1
.... [PORT](string) = 1080
>>>

<iq from="imap@icewarp.com/Development" type="set" to="klos@icewarp.com/Development" id="aac3a" >
	<query xmlns="http://jabber.org/protocol/bytestreams" mode="tcp" sid="s5b_f5c122943d5604d5" >
		<streamhost port="1080" host="192.168.0.2" jid="proxy.icewarp.com" >
			<proxy xmlns="http://affinix.com/jabber/stream"/>
		</streamhost>
		<fast xmlns="http://affinix.com/jabber/stream"/>
	</query>
</iq>
*/


/*
	[IQ]
.. [0]
.... [QUERY]
...... [0]
........ [ATTRIBUTES]
.......... [XMLNS](string) = http://jabber.org/protocol/bytestreams
.......... [MODE](string) = tcp
.......... [SID](string) = 81d7fb4d1a173446d61e4032209e8078b091f87d
........ [STREAMHOST]
.......... [0]
............ [ATTRIBUTES]
.............. [JID](string) = proxy.merakdemo.com
.............. [HOST](string) = 127.0.0.1
.............. [PORT](string) = 1080
.... [ATTRIBUTES]
...... [XMLNS](string) = jabber:client
...... [TYPE](string) = set
...... [TO](string) = user@merakdemo.com/Work
...... [ID](string) = 310608205213506201262618697002
*/

	if (aData && aData.IQ && (aData = aData.IQ[0]) && aData.ATTRIBUTES && aData.ATTRIBUTES.TYPE == 'result'){
		var bSupport = false;
		try{
			bSupport = aData.SI[0].FEATURE[0].X[0].FIELD[0].VALUE[0].VALUE == 'http://jabber.org/protocol/bytestreams' && aData.SI[0].FEATURE[0].X[0].FIELD[0].ATTRIBUTES.VAR == 'stream-method';
		}
		catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r)}

		if (bSupport){
			var q = this._create_query('','http://jabber.org/protocol/bytestreams');
				q.QUERY[0].ATTRIBUTES.MODE = 'tcp';
				q.QUERY[0].ATTRIBUTES.SID = sHash;
				q.QUERY[0].STREAMHOST = [{ATTRIBUTES:{'JID':GWOthers.getItem('STREAMHOST', 'jid'),'HOST':GWOthers.getItem('STREAMHOST', 'host'),'PORT':GWOthers.getItem('STREAMHOST', 'port')}}];

			this._create_iq(q, {type:'set', to:aData.ATTRIBUTES.FROM}, [this,'_stream_upload',[sHash, sFolder, sFile, sClass]]);
		}
		else{
			this._oob_send(sFolder,sFile, sClass, aData.ATTRIBUTES.FROM, sDesc);
		}
	}
	//Error, User has canceled the request
	else{
		gui.notifier._value({type: 'alert', args: {header: 'IM::SEND_FILE', text: 'IM::ERROR_CANCEL'}});
		this.__exeEvent('response', 'notice', {FROM:aData.ATTRIBUTES.FROM,TEXT:getLang('IM::ERROR_CANCEL')});
	}
};

_me._stream_upload = function(aData, sHash, sFolder, sFile, sClass){

	if (aData && aData.IQ && (aData = aData.IQ[0]) && aData.ATTRIBUTES && aData.ATTRIBUTES.TYPE == 'result' && aData.QUERY && aData.QUERY[0]['STREAMHOST-USED'] && aData.QUERY[0]['STREAMHOST-USED'][0].ATTRIBUTES && aData.QUERY[0]['STREAMHOST-USED'][0].ATTRIBUTES.JID == GWOthers.getItem('STREAMHOST', 'jid')){
		storage.library('wm_upload');
		storage.library('sha1');

		var sHash = SHA1(sHash+sPrimaryAccount+'/WebClient'+aData.ATTRIBUTES.FROM);
		var up = new wm_upload();
			up.socket(sFolder, sFile, sClass, sHash, [function(){
				this.__exeEvent('response', 'bytestream', arguments);
			}.bind(this)]);
	}
	//Error
	else
		gui.notifier._value({type: 'alert', args: {header: 'IM::SEND_FILE', text: 'IM::ERROR_BYTESTREAM'}});
};
_me._oob_send = function (sFolder, sFile, sClass, sTo, sDesc) {
	storage.library('wm_upload');
	var up = new wm_upload();
		up.ticket(sFolder, sFile, sClass, [this, '_oob_support', [sTo, sDesc]]);
};

_me._oob_support = function(aData,sTo,sDesc){
	if (aData.ticket){
		//check oob support
		this._create_iq(this._create_query('','http://jabber.org/protocol/disco#info'), {to:sTo}, [this,'_oob_upload',[aData, sTo, sDesc]]);
	}
	//error creating ticket
	else
		gui.notifier._value({type: 'alert', args: {header: '', text: 'IM::ERROR_TICKET'}});
};

_me._oob_upload = function(aData, aTicket, sTo, sDesc){
	//build URL
	var sURL = document.location.href;
		sURL = sURL.substr(0,sURL.lastIndexOf('/')+1) + 'server/download.php/ticket/'+ encodeURIComponent(aTicket.ticket) +'/'+ encodeURIComponent(aTicket.name);

	//check OOB support
	var f;
	if (aData && aData.IQ && (aData = aData.IQ[0]) && aData.QUERY && aData.QUERY[0] && (f = aData.QUERY[0].FEATURE))
		for (var i in f)
			if (f[i].ATTRIBUTES && f[i].ATTRIBUTES.VAR == 'jabber:iq:oob'){

				//send OOB query
				var q = {URL:[{VALUE:sURL}],DESC:[{VALUE:sDesc}]};

				this._create_iq(this._create_query(q,'jabber:iq:oob'), {type:'set', to:sTo}, [this,'_oob_finish']);
				return;
			}

	//OOB unsupported, send message with link
	this._message(sTo, getLang('IM::FILE_MESSAGE',[sDesc || '', sURL]));
};

_me._oob_finish = function (aData, aHandler){
	if (aData && aData.IQ && (aData = aData.IQ[0])){
		if (aData.ERROR)
			gui.notifier._value({type: 'alert', args: {header: '', text: 'IM::FILE_CANCEL'}});
		else
		if (aData.ATTRIBUTES && aData.ATTRIBUTES.TYPE == 'error')
			gui.notifier._value({type: 'alert', args: {header: '', text: 'IM::FILE_ERROR'}});
		else
			gui.notifier._value({type: 'alert', args: {header: '', text: 'IM::FILE_OK'}});

		aHandler && executeCallbackFunction(aHandler);
	}
};

//Initiate File upload
_me._file_upload = function (sTo, aArg, aHandler){
	var sStatus = Is.Array(sTo)?'offline':this._user_status(sTo);

	if (sStatus == 'offline')
		this._xlink(sTo, aArg, aHandler);
	else{
		//check support
		this._create_iq(this._create_query('','http://jabber.org/protocol/disco#info'), {to:sTo}, [this,'_file_upload_support',[sTo, aArg, aHandler]]);
	}
};

//Choose proper upload method
_me._file_upload_support = function (aData, sTo, aArg, aHandler){

	//check OOB support
	var f, s = 'msg';
	if (aData && aData.IQ && (aData = aData.IQ[0]) && aData.QUERY && aData.QUERY[0] && (f = aData.QUERY[0].FEATURE))
		for (var i in f)
			if (f[i].ATTRIBUTES && f[i].ATTRIBUTES.VAR)
				//Extended message
				if (f[i].ATTRIBUTES.VAR == 'jabber:x:oob')
					s = 'x';

	switch(s){
		case 'oob':
			//Not used anymore
			this._ooblink(sTo, aArg, aHandler);
			break;

		case 'x':
			this._xlink(sTo, aArg, aHandler);
			break;

		//OOB unsupported, use plain message
		default:
			var sBody = getLang('IM::FILE_MESSAGE',[aArg.desc || '', aArg.link]);
			this._message(sTo, sBody, aHandler);
	}

};
/**
 * Not used anymore
 *
 * @param {*} sTo
 * @param {*} aArg
 * @param {*} aHandler
 */
_me._ooblink = function(sTo, aArg, aHandler){
	if (sTo){

		//send OOB query
		var q = {
				URL:[{VALUE:aArg.link}],
				DESC:[{VALUE:aArg.desc || ''}],
				SIZE:[{VALUE:aArg.size || 0}]
			};

		this._create_iq(this._create_query(q, 'jabber:iq:oob'), {type:'set', to:sTo}, [this, '_oob_finish', [aHandler]]);
	}
};

_me._xlink = function(sTo, aArg, aHandler){
	if (sTo){

		var aData = {
			DISPLAYED:[{ATTRIBUTES:{XMLNS:"rn:xmpp:chat-markers:0"}}],
			X:[{
				ATTRIBUTES:{XMLNS:"jabber:x:oob"},
				URL:[{VALUE:aArg.link}],
				DESC:[{VALUE:aArg.desc || ''}],
				SIZE:[{VALUE:aArg.size || 0}]
			}]
		};

		this._request(this._create_message(aData,'chat',sTo), aHandler);
	}
};

// ROSTER
_me._roster_get = function(aHandler, aErrorHandler, bNoBuffer){
	//<iq type="get"><query xmlns="jabber:iq:roster"/></iq>
	this._create_iq({
			QUERY: [{
				ATTRIBUTES: {
					XMLNS: "jabber:iq:roster"
				}
			}]
		}, {},
		[this, '__roster_parse',[aHandler]],
		aErrorHandler,
		bNoBuffer);
};
	_me.__roster_parse = function(aData, aHandler){

		if (aData && aData.IQ && aData.IQ[0].QUERY && (aData = aData.IQ[0].QUERY[0])){

			var sSub, sJID,	sName, sGroup, oldShow,
				bRefresh, bRefreshJid,
				aGateways = dataSet.get('xmpp', ['gateways']) || {};

			for(var i in aData.ITEM){
				sSub = aData.ITEM[i].ATTRIBUTES.SUBSCRIPTION;
				sJID = aData.ITEM[i].ATTRIBUTES.JID;
				sName = aData.ITEM[i].ATTRIBUTES.NAME;
				sGroup = aData.ITEM[i].GROUP?aData.ITEM[i].GROUP[0].VALUE:'*';

				if (sSub == 'remove')
					dataSet.remove('xmpp', ['roster', sJID], true);
				else{
					//do not overwrite show icon with subscription ("both")
					oldShow = dataSet.get('xmpp', ['roster', sJID, 'show']);
					//refresh open chats directly
					bRefreshJid = Is.Boolean(dataSet.get('xmpp', ['roster', sJID, 'active']));

					if (!oldShow || sSub != 'both' || (sSub == 'both' && (oldShow == 'from' || oldShow == 'to')))
						dataSet.add('xmpp', ['roster', sJID, 'show'], sSub, !bRefreshJid);

					dataSet.add('xmpp', ['roster', sJID,'name'], sName, !bRefreshJid);
					dataSet.add('xmpp', ['roster', sJID,'user'], sJID, true);
					dataSet.add('xmpp', ['roster', sJID,'group'], sGroup, true);

					var tmp = aGateways[sJID];
					if (tmp || ((tmp = sJID.indexOf('@'))>-1 && (tmp = aGateways[sJID.substr(tmp+1)])))
						dataSet.add('xmpp', ['roster', sJID, 'type'], tmp.TYPE, true);
				}
				bRefresh = true;
			}

			if (bRefresh)
				dataSet.update('xmpp', ['roster']);
		}

		aHandler && executeCallbackFunction(aHandler);
	};

// HISTORY
_me._history_get = function(aData, aHandler){
	/*
	<retrieve xmlns='urn:xmpp:archive' with='juliet@capulet.com/chamber' start='1469-07-21T02:56:15Z'> // start UTC time
	[<body>optional body text search</body>]
	<set xmlns='http://jabber.org/protocol/rsm'>
	<max>100</max>
	[<after></after> // after x secs from start]
	[<before/> // from the end]
	[<before></before> // backwards before x secs from start]
	</set>
	</retrieve>
	*/

	var q = {RETRIEVE:[{ATTRIBUTES:{XMLNS:'urn:xmpp:archive',WITH:aData.from},SET:[{ATTRIBUTES:{XMLNS:'http://jabber.org/protocol/rsm'}}]}]};

	if (aData['start'])
		q.RETRIEVE[0].ATTRIBUTES.START = typeof aData['start'] == 'date'?aData['start'].format('imDateTime'):aData['start'];

	if (aData['search'])
		q.RETRIEVE[0].BODY = [{VALUE:aData['search']}];

	if (aData['max'])
		q.RETRIEVE[0].SET[0].MAX = [{VALUE:aData['max']}];

	if (typeof aData['before'] != 'undefined')
		q.RETRIEVE[0].SET[0].BEFORE = [{VALUE:aData['before'] || ''}];

	if (aData['after'])
		q.RETRIEVE[0].SET[0].AFTER = [{VALUE:aData['after']}];

	this._create_iq(q, {}, aHandler);
};

// USER
_me._user_status = function(sJID, bReal){
	var sStatus;

	if (!sJID || sJID === sPrimaryAccount)
		sStatus = dataSet.get('xmpp', ['status']);
	else{
		sStatus = dataSet.get('xmpp', ['roster', sJID, 'show']);

		if (!bReal && (sStatus == 'none' || sStatus == 'both'))
			sStatus = 'offline';
	}

	return sStatus || 'offline';
};

_me._user_add = function(sJID, sName, sGroup, aHandler){
	this._user_rename(sJID, sName, sGroup, [this,'_user_subscribe',[sJID, aHandler]]);
};

_me._user_rename = function(sJID, sName, sGroup, aHandler){
	/*
	<iq type="set" id="ab16a" >
	<query xmlns="jabber:iq:roster">
	<item jid="domain@merakdemo.com" >
	<group>skupina</group>
	</item>
	</query>
	</iq>
	*/
	if (sJID){
		var aData = {ITEM:[{ATTRIBUTES:{jid:sJID}}]};

		if (sGroup)
			aData.ITEM[0].GROUP = [{VALUE:sGroup}];

		if (sName)
			aData.ITEM[0].ATTRIBUTES.NAME = sName;

		this._create_iq(this._create_query(aData,'jabber:iq:roster'), {type:'set'}, aHandler);
	}
};

/**
 * Group is removed when no sNewGroup is specified
 *
 * @param {id string} sGroup
 * @param {string} sNewGroup
 * @param {*} aHandler
 */
_me._group_rename = function(sGroup, sNewGroup, aHandler){
	var ds = dataSet.get('xmpp',['roster']);
	for (var sJID in ds)
		if (ds[sJID].group == sGroup)
			this._user_rename(sJID, ds[sJID].name, sNewGroup);

	aHandler && executeCallbackFunction(aHandler);
};

_me._user_remove = function(aJID, aHandler){
	/*
	Supports multiple IQ
	<iq type="set" id="aadaa" >
	<query xmlns="jabber:iq:roster">
	<item subscription="remove" jid="asd@merakdemo.com" />
	</query>
	</iq>

	Remove gateway
	<iq type="set" to="monitor.icewarp.com" id="aaf1a" ><query xmlns="jabber:iq:register"><remove/></query></iq>
	<iq xmlns="jabber:client" type="set"><query xmlns="jabber:iq:register"><remove/></query></iq>
	*/

	if (aJID.length){

		var aData;
		for(var i in aJID){
			aData = {ITEM:[{ATTRIBUTES:{subscription:'remove',jid:aJID[i]}}]};

			this._create_iq(this._create_query(aData,'jabber:iq:roster'), {type:'set'});

			//un-registr gateway
			if (aJID[i].indexOf('@')<0)
				this._create_iq(this._create_query({'REMOVE':[{}]},'jabber:iq:register'), {type:'set', to:aJID[i]});
		}

		if (aHandler)
			executeCallbackFunction(aHandler);
	}
};

//request subscription
_me._user_subscribe = function(sJID, aHandler){
	//<presence type="subscribe" to="user@merakdemo.com" >
	//<nick xmlns="http://jabber.org/protocol/nick">zork</nick>
	//</presence>
	if (sJID)
		this._request(this._create_presence('','subscribe',sJID), aHandler);
};

//re-send subscription
_me._user_subscribed = function(sJID, aHandler){
	//<presence type="subscribed" to="user@merakdemo.com" />
	if (sJID){
		this._request(this._create_presence('', 'subscribed', sJID));
		this._request(this._create_presence('', 'subscribe', sJID));
		executeCallbackFunction(aHandler);
	}
};

//remove subscription
_me._user_unsubscribed = function(sJID, aHandler){
	//<presence type="unsubscribed" to="user@merakdemo.com" />
	if (sJID)
		this._request(this._create_presence('','unsubscribed',sJID), aHandler);
};

// Conference Conference invitation - send
_me._invitation = function(sTo, sBody, aHandler){
	if (sTo) {
		var aData = {BODY:[{VALUE:sBody}],X:[{ATTRIBUTES:{XMLNS:"jabber:x:icewarpconference"},ID:[{VALUE: dataSet.get('conference',['id']) || 0}]}],ACTIVE:[{ATTRIBUTES:{XMLNS:"http://jabber.org/protocol/chatstates"}}]};
		this._request(this._create_message(aData,'chat',sTo), aHandler);
	}
};

// MESSAGE

_me._message = function(sTo, sBody, aHandler){
	var aData = {BODY:[{VALUE:sBody}],ACTIVE:[{ATTRIBUTES:{XMLNS:"http://jabber.org/protocol/chatstates"}}]};
	this._request(this._create_message(aData,'chat',sTo), aHandler);
};

_me._msg_status = function(sTo, sType, aHandler){
	if (sTo && this._state() === 5){
		var aData = {};
			aData[sType.toUpperCase()] = [{ATTRIBUTES:{XMLNS:"http://jabber.org/protocol/chatstates"}}];

		this._request(this._create_message(aData,'chat',sTo), aHandler);
	}
};

_me._geo = function(sTo, aArg, aHandler){
	if (sTo){

		var aData = {
			DISPLAYED:[{ATTRIBUTES:{XMLNS:"rn:xmpp:chat-markers:0"}}], //message id missing :-P
			EVENT:[{
				ATTRIBUTES:{XMLNS:"http://jabber.org/protocol/pubsub#event"},
				ITEMS:[{
					ATTRIBUTES:{NODE:"http://jabber.org/protocol/geoloc"},
					ITEM:[{
						GEOLOC:[{
 							ATTRIBUTES:{XMLNS:"http://jabber.org/protocol/geoloc", 'XML\:LANG':"en"},
 							LAT:[{VALUE:aArg.lat}],
 							LON:[{VALUE:aArg.lon}]
						}]
					}]
				}]
			}]
		};

		this._request(this._create_message(aData,'chat',sTo), aHandler);
	}
};

/**
 * Update Photo hash in PRESENCE
 */
_me._updatePresencePhoto = function(){
	if (this._user_status() !== 'offline'){
		this._vcard('', '', [
			function () {
				this._presence();
			}.bind(this)
		]);
	}
};
