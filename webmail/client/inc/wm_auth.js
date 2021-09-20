/**
 * @brief: WebmailIqAuth handling class
 **/
function wm_auth(){
	this.xmlns='auth';
};

wm_auth.inherit(wm_generic);

var _me = wm_auth.prototype;

/**
 * param:
 *	auth_array[username]
 *	(auth_array[password] or auth_array[digest]) or auth_array[session]
 **/
_me.login = function(auth_array,sDataSet,sDataPath){
	if (auth_array['username'] && (auth_array['password'] || auth_array['digest'] || auth_array['auto_digest'])){

		// encrypt password
		if (auth_array.password){
			try{
				auth_array.digest = this.digest(auth_array['username'],auth_array['password']);
			}
			catch(e){
				this.error = {id:'RSA'};
				return false;
			}
		}
		else
		if (auth_array.auto_digest){
			try{
				auth_array.digest = this.digest(auth_array['username'],'',auth_array['auto_digest']);
			}
			catch(e){
				this.error = {id:'RSA'};
				return false;
			}
		}

		// Logout prevous user from dataset
		this.logout();

		// prepare data for request
		var request={"USERNAME":[{"VALUE":auth_array.username}],"DIGEST":[{"VALUE":auth_array.digest}],"METHOD":[{"VALUE":'RSA'}]};

		//autologin
		if (auth_array.auto_login)
			request.AUTO_LOGIN = [{"VALUE":'true'}];

		//language
		if (auth_array.language)
			request.LANGUAGE = [{"VALUE":auth_array.language}];

		if (auth_array.disable_ip_check)
			request.DISABLE_IP_CHECK = [{"VALUE":1}];
	}
	else
	if (auth_array.session){
		if(auth_array.session.indexOf('wmtr') === 0) {
			var request = { METHOD: [{ VALUE: 'troubleshootingsession' }], SESSION: [{ VALUE: auth_array.session }] };
		} else {
			// prepare data for request
			var request = {"SESSION":[{"VALUE":auth_array.session}]};

			//do not refresh session (&open URL parameter used)
			if (auth_array.from)
				request.FROM = [{"VALUE":auth_array.from}];

			//do not refresh session (&open URL parameter used)
			if (auth_array.keep)
				request.KEEP = [{"VALUE":'true'}];
		}
	}
	else
		return false;

	/*
	if (!auth_array['username'] || (!auth_array['password'] && !auth_array['digest'])) return false;

	// encrypt password
	if (!auth_array.digest)
		auth_array.digest = this.digest(auth_array['username'],auth_array['password']);

	// Logout prevous user from dataset
	this.logout();

	// prepare data for request
	var request={"USERNAME":[{"VALUE":auth_array.username}],"DIGEST":[{"VALUE":auth_array.digest}],"METHOD":[{"VALUE":'RSA'}]};

	// cookie check
	/*
	if (document.cookie){
		var uid = unique_id();

		//document.cookie = "auth_cookie=" + uid + "; path=/";

        var aCookie = cookieManager.get('auth_cookie');
        if (!aCookie || typeof aCookie != 'object')	aCookie = {};
		aCookie[auth_array.username] = uid;
		cookieManager.set ('auth_cookie',aCookie,-1);

		request.COOKIE = [{VALUE:uid}];
	}
	*/

	/* send data to server & set response handler */
	if(!sDataSet){
		var aData = this.create_iq(request,'','','set');
		if (this.error) return false;
		aData = aData["IQ"][0]["ATTRIBUTES"]["SID"];
		dataSet.add('main',['sid'],aData);

		return aData;
	}
	else
		this.create_iq(request,[this,'response',['login',sDataSet,sDataPath]],'','set');

	return true;
};


/* When a mismatch between IP and sessions occur it's possible to reconnect */
_me.reconnect = function(sUser,sPassword,aHandler) {
	// Create digest from user and password
	var digest = auth.digest(sUser,sPassword,undefined,auth.hashid({username: sUser},true));
	// Compile request
	var request = {
		"METHOD":[{"VALUE":'RSAIP'}],
		"USERNAME":[{"VALUE": dataSet.get('main',['user'])}],
		"DIGEST":[{"VALUE": digest}],
		"SESSION":[{"VALUE": dataSet.get('main',['sid'])}]
	};

	this.create_iq(request,[this,'response',['reconnect','main',['sid'],aHandler]],'','set');
};

_me.get_digest = function(hashID,sMethod,aHandler){
	var request = {METHOD:[{VALUE:sMethod}]};

	if (Is.String(hashID)){
		request.hashID = [{VALUE:hashID}];
	}
	else
	if (hashID.hash){
		request.hashID = [{VALUE:hashID.hash}];
		if (hashID.command){
			request.COMMAND = [{VALUE:hashID.command}];
			if (hashID.uri)
				request.URI = [{VALUE:hashID.uri || ''}];
		}
	}
	else{
		console.log('get_digest', 'Invalid hashID', hashID);
		return;
	}

	if (aHandler)
		this.create_iq(request,[this,'response',['digest','','',aHandler]],'','get');
	else{
		try{
		var aData = this.create_iq(request,'','','get');
			aData = aData["IQ"][0]["QUERY"][0]["DIGEST"][0]["VALUE"];
			return aData;
		}
		catch(r){
			return false;
		}
	}
};

_me.get_xmpp = function(aHandler){
	if (aHandler)
		this.create_iq({METHOD:[{VALUE:'xmpp'}]},[this,'response',['xmpp','','',aHandler]],'','get');
};

_me.logout = function(bIgnoreResponse){

	if (!dataSet.get("main",['sid'])) return true;

	//Login save state 0
	if (cookieManager.get('LoginState') == '3')
		cookieManager.set('LoginState','2');

	if (bIgnoreResponse) {
		this.create_iq(null,[this,'_void'],'','set');
		return true;
	}
	else
		this.create_iq(null,'','','set');

	dataSet.remove("main",['sid'],true);
	return true;
};

_me.troubleshootingSession = function(validity, aHandler){
	var aRequest = {
		METHOD: [{ VALUE: 'troubleshootingsession' }],
		VALIDITY: [{ VALUE: validity }]
	};

	this.create_iq(aRequest, [this, 'response', ['troubleshootingSession', null, null, aHandler]], '', 'get');
};

_me.deleteTroubleshooting = function(session, aHandler){
	var aRequest = {
		METHOD: [{ VALUE: 'deletetroubleshooting' }],
		SESSION: [{ VALUE: session }]
	};

	this.create_iq(aRequest, [this, 'response', ['deleteTroubleshooting', null, null, aHandler]], '', 'set');
};

_me._forgot = function(email,csid,captcha){

	var aRequest = {"EMAIL`" :[{"VALUE":email}],
					"CAPTCHA":[{'ATTRIBUTES':{'UID':csid},"VALUE":captcha}],
					"SUBJECT":[{"VALUE":GWOthers.getItem('RESET_SETTINGS','subject') || getLang('RESET_PASS::SUBJECT')}],
					"MESSAGE":[{"VALUE":GWOthers.getItem('RESET_SETTINGS','mail') || getLang('RESET_PASS::EMAIL')}]};

	var aResponse = (this.create_iq(aRequest,'','','set')).IQ[0];

	if (aResponse.ATTRIBUTES.TYPE == 'result'){
		var emails = [];
		for(var i in aResponse.QUERY[0].EMAIL)
			emails.push(aResponse.QUERY[0].EMAIL[i].VALUE);

		return emails;
	}
	else
	if (aResponse.ATTRIBUTES.TYPE == 'error')
		return aResponse.ERROR[0].ATTRIBUTES.UID;
	else
		return false;
};

_me._void = function(){};

_me.digest = function(user,pass,auto,hash){
	// encrypt password
	var tmp = hash ? hash : this.hashid({"username":user}),
		rsa = new RSAKey();
		rsa.setPublic(tmp.hash,'10001');

	try{
		return pass?rsa.encrypt(buildURL({p:pass,t:tmp.time})):rsa.encrypt(auto);
	}
	catch(r){
		console.error(r);
	}
};

/**
 * @brief: retrieve HashID from server
 * @query: <iq><query xmlns="webmail:iq:auth"><username>admin</username><method>rsa</method></query></iq>
 **/
_me.hashid = function(auth_array,anonymous)
{
	/* prepare data for request */
	var request={"USERNAME":[{"VALUE":auth_array['username']}],"METHOD":[{"VALUE":'RSA'}]};

	/* send data to server & get response */
	var response = anonymous ? this.create_iq(request,undefined,undefined,undefined,undefined,undefined,undefined,true) : this.create_iq(request);

	/* return HashId */
	return {hash:response["IQ"][0]["QUERY"][0]["HASHID"][0]["VALUE"],time:response["IQ"][0]["QUERY"][0]["TIMESTAMP"][0]["VALUE"]};
};

_me.response = function(aData,sMethodName,sDataSet,sDataPath,aHandler)
{
	var aXMLResponse = aData['Array'],
		aIQAttribute = aXMLResponse['IQ'][0]['ATTRIBUTES'];

	if (sDataSet == 'main')
		sDataPath = ['sid'];
	else
		sDataPath = sDataPath || ['sid'];

	switch(sMethodName) {
		case 'login':
		case 'reconnect':
			if (aIQAttribute['TYPE'] == 'result' && aXMLResponse["IQ"][0]["ATTRIBUTES"]["SID"])
				dataSet.add(sDataSet,sDataPath,aXMLResponse["IQ"][0]["ATTRIBUTES"]["SID"]);

			if (aHandler)
				executeCallbackFunction(aHandler, aData['Array']["IQ"][0]["ATTRIBUTES"]["TYPE"] == "result");

			break;

		case 'logout':
			dataSet.add(sDataSet,sDataPath,'');
			break;

		case 'digest':
			if (aIQAttribute['TYPE'] == 'result')
				executeCallbackFunction(aHandler, aXMLResponse["IQ"][0]["QUERY"][0]["DIGEST"][0]["VALUE"]);
			break;

		case 'xmpp':
			if (aIQAttribute['TYPE'] == 'result'){
				var aOut = {},
					aData = aXMLResponse["IQ"][0]["QUERY"][0];

				for(var n in aData)
					if (aData[n][0] && aData[n][0].VALUE)
						aOut[n] = aData[n][0].VALUE;

				executeCallbackFunction(aHandler, aOut);
			}
			break;

		case 'troubleshootingSession':
			Cookie.set(['troubleshooting'], {
				session: aXMLResponse.IQ[0].QUERY[0].DIGEST[0].VALUE,
				timestamp: aXMLResponse.IQ[0].QUERY[0].TIMESTAMP[0].VALUE
			});
			executeCallbackFunction(aHandler);
			break;

		case 'deleteTroubleshooting':
			Cookie.set(['troubleshooting']);
			executeCallbackFunction(aHandler);
			break;
	}

};

/////////////////////////
var auth = new wm_auth();
