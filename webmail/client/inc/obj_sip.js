_me = obj_sip.prototype;
function obj_sip(){};

/*
	aHandler is executed once when sip goes online, used for direct Call when offline
*/
_me.__constructor = function(aHandler){

	this.__aHandler = aHandler;
	this.__playSounds = true;

	// Determine if SIP via WebRTC and js should be used
	storage.library('sip_bridge');
	this._use_webrtc = window.JsSIP && IceSIP && IceSIP.supported();

	// Check if connection is secure, otherwise abort
	if(document.location.protocol!='https:') {
		var nortc = gui._create('no_webrtc','frm_confirm','','',[function(){
			window.open('https://www.icewarp.com/support/troubleshoot_webrtc/?' + buildURL({ishttps:(location.protocol.indexOf("https")===0?'1':'0'),lang:GWOthers.getItem('LAYOUT_SETTINGS','language')}));
		}],'SIP::SIP','SIP::NOTSECURE');
		nortc.x_btn_ok._value('ERROR::TROUBLESHOOT');
		addcss(nortc.x_btn_ok._main, 'help');
		this._destruct();
		return false;
	}

	// Add ringtones
	var ext = navigator.browser && navigator.browser.application=='Opera' ? 'ogg' : 'mp3';
	var loc = GWOthers.getItem('LAYOUT_SETTINGS','language')=='en' ? 'uk' : 'eu';

	this._ringtone = new Audio();
	this._ringtone.src = 'client/inc/sip/tones/phone.'+ext;
	this._ringtone.loop = true;

	this._busytone = new Audio();
	this._busytone.src = 'client/inc/sip/tones/busy.'+ext;

	this._calltone = new Audio();
	this._calltone.src = 'client/inc/sip/tones/'+loc+'/call.'+ext;
	this._calltone.loop = true;

	this._failtone = new Audio();
	this._failtone.src = 'client/inc/sip/tones/fail.'+ext;

	// Call history
	this.__callBuffer = [];

	//Destructor
	this._add_destructor('__destructor');

	this.__init();
};

_me.__init = function (){
	var me = this;

	if (this.__timeout)
		clearTimeout(this.__timeout);

	// Initation using WebRTC
	if(this._use_webrtc) {

		obj_sip._activity('');

		this.__started = true;

		// Set SIP parameters
		var c = {display_name: dataSet.get('main',['fullname']),trace_sip: true};
		if (GWOthers.getItem('SIP','external')>0 && (GWOthers.getItem('RESTRICTIONS', 'disable_esip') || 0)<1 && GWOthers.getItem('SIP','user') && GWOthers.getItem('SIP','pass') && (GWOthers.getItem('SIP','server') || GWOthers.getItem('SIP','user').indexOf('@'))) {
			var tmp = GWOthers.getItem('SIP','user').split('@');
			var user = tmp[0];
			var server = tmp.length==1 ? GWOthers.getItem('SIP','server') : tmp[1];

			// If applicable, add user name used for authentication (used by Cisco)
			if(GWOthers.getItem('SIP','ext')) {
				c.authorization_user = user;
				c.uri = 'sip:' + GWOthers.getItem('SIP','ext') + '@' + server;
			} else
			// Adding unique idetifier (SIP username)
				c.uri = 'sip:' + user + '@' + server;

			// Add password for authentication
			c.password = GWOthers.getItem('SIP','pass');

		} else {
			var user = sPrimaryAccount.split('@');
			var port = dataSet.get('accounts',[sPrimaryAccount,'SIP_PORT']);
			c.uri = 'sip:' + (dataSet.get('accounts',[sPrimaryAccount,'SIP_EXTENSION']) || dataSet.get('accounts',[sPrimaryAccount,'SIP_USERNAME']) || user[0]) + '@' + ((dataSet.get('accounts',[sPrimaryAccount,'SIP_HOST'])+(port ? ':'+port : '')) || user[1]);
			c.ha1 = dataSet.get('accounts',[sPrimaryAccount,'SIP_HASH']);
			c.authorization_user = dataSet.get('accounts',[sPrimaryAccount,'SIP_USERNAME']) || user[0];
			c.realm = dataSet.get('accounts',[sPrimaryAccount,'SIP_HOST']) || user[1];
		}

		// Create SIP client
		this.phone = new IceSIP(c);

		// Handle connection status
		this.phone.onconnect = function(e) {
			dataSet.add('sip',['state'],'online');	// e.host

			if (me.__aHandler){
				me.__aHandler.call(me,true);
				delete me.__aHandler;
			}
		};
		this.phone.ondisconnect = function(e) {
			dataSet.add('sip',['state'],'offline');	// e.reason

			// if (e.reason=='offline')
			// 	gui.notifier._value({type: 'sip_not_reachable', args: {header: 'SIP::ERROR', text_plain: getLang('SIP::WENT_OFFLINE')}});

			if (me.__aHandler && e.reason=='failed'){
				me.__aHandler.call(me,false);
				delete me.__aHandler;
			}

		};

		// Handle media requests
		this.phone.onmedia = function(e) {
			if(e.constraints)
				me.__process('UserMediaRequested','',e.constraints);
			else if(e.granted)
				me.__process('UserMediaGranted');
			else
				me.__process('UserMediaDenied','',e.reason);
		};

		// Handle incoming call
		this.phone.oncall = function(e) {
			me.call = e.call;

			// Using external phone, silently ignore alias call
			var alias = dataSet.get('accounts',[sPrimaryAccount,'SIP_CALLERALIAS']) || '';
			var domain = sPrimaryAccount.split('@')[1];
			alias += '@' + domain;
			if(domain && e.user==alias) {
				me.call.onhangup = function(e) {};
				me.call.hangup(488);
				return;
			}

			var email = MailAddress.createEmail(e.name,e.user);

			// Notify about incoming call
			me.call.onhangup = function(e) {
				obj_sip._activity("",true);
				me.__process(e.remote?'CallCanceled':'CallFinished', email, e.reason);
			};
			me.__presentation = e.show;

			obj_sip._activity("Ringing",true);
			me.__process('IncomingCall',email,e.video,e.show);
		};

		// Connect phone
		this.phone.start();

		return true;
	} else
		return false;
};

// aHandler is executed once when sip goes online, used for direct Call when offline
_me._login = function (aHandler){
	if (this.phone && !this.phone.online()){

		if (aHandler)
			this.__aHandler = aHandler;

		this.phone.register();
	}
};

_me._logout = function (){
	if(this.phone && this.phone.online())
		this.phone.unregister();

	dataSet.update('main',['sip']);
};


// CALLBACK
_me._add_callbeck = function (aHandler){
	var tmp = getCallbackFunction(aHandler);
	for(var i = this.__callBuffer.length-1; i>=0; i--)
		if (getCallbackFunction(this.__callBuffer[i])===tmp)
			return;

	this.__callBuffer.push(aHandler);
};
_me._execute = function (aData){
	for(var i = this.__callBuffer.length-1; i>=0; i--)
		if (!getCallbackFunction(this.__callBuffer[i]) || executeCallbackFunction(this.__callBuffer[i],aData) === false)
			this.__callBuffer.splice(i,1);
};



/*
 *	General information about possible
 *
 *   parametr type     | vyznam udalosti                              | param1                                      |   param2
 *   __________________|______________________________________________|_____________________________________________|____________
 *   UserMediaRequested| Request to use media devices (waiting for user to allow)
 *   UserMediaGranted  | The requested media devices are available and allowed
 *   UserMediaDenied   | The user denied use or the system blocked or could not provide access to the device

 *   Joining           | User attempts to join conference
 *   ConferenceStarted | Conference started and is running
 *   ConferenceCanceled| Conference ended for some reason
 *   ConferenceFinished| User left the conference
 *
 *   PreparingCall     | Outgoing call initated by user
 *   Calling           | The outgoing call is in progress but waiting for remote user to decline or answer
 *   IncomingCall      | Receiving a remote call (local user can decline or answer call)
 *   CallEstablished   | Call started and is ongoing
 *   UserBusy          | Remote user is busy (in call with somebody else)
 *   CallFinished      | Local user ended the call
 *   CallCanceled      | Remote user ended the call
 *
 *   Notification      | Not used
 *   Info              | Not used
 *
 *   Error             | Primarily legacy handling
 */
_me.__process = function (sType, sParam1, sParam2, sParam3){
	var me = this;
	var sValue = '';

	// Stop ringtone for incoming call
	if (this._ringtone)
		this._ringtone.pause();

	// Stop ringtone for outgoing call
	if (this._calltone)
		this._calltone.pause();

	// Error handling - legacy code
	if (sType == 'Error'){

		var str = '';
		if (sParam1 == 'server'){
			str = getLang('SIP::UNREACHABLE');
			dataSet.add('sip',['info'],getLang('SIP::OFFLINE'));
		}
		else{
			if(sParam1=='unhandled_exception') return;
			var arr = sParam1.split(',');
			for (var i = 0;i<arr.length;i++)
				str += (str?"\n":'') + getLang('SIP::' + arr[i]);
		}

		gui.notifier._value({type: 'sip_not_reachable', args: {header: 'SIP::ERROR', text_plain: str}});

	//	dataSet.update('main',['sip']);
		gui.__exeEvent('sip',{type:'error', p1:sParam1, p2:sParam2, p3:sParam3});

 		return;
	}

	switch (sType.toString()){
	case 'UserMediaRequested':
		me.__mrfrm = true;
		setTimeout(function(){
			if(me.__mrfrm) {
				me.__mrfrm = gui._create('sip_alert','frm_alert','','sip',[function(){}],'SIP::WEBPHONE_SETUP','SIP::MEDIAREQUEST' + (me.__bVideo ? '_VIDEO' : ''));
				me.__mrfrm._size(620);

				var browser = false;
				switch(currentBrowser()) {
					case 'Chrome':
					case 'Safari':
					case 'Opera':
						browser = currentBrowser().toLowerCase();
						break;
					case 'MSIE7':
					case 'MSIE9':
					case 'MSIE11':
						browser = 'IE';
					case 'Mozilla':
						browser = 'firefox';
				}

				var label = mkElement('div', {
					className: 'label',
					textContent: getLang('SIP::ACCESS_' + (me.__bVideo ? 'CAMERA' : 'MICROPHONE'))
				});
				me.__mrfrm.obj_label._main.insertBefore(label, me.__mrfrm.obj_label._main.firstChild);

				if (browser) {
					var image = mkElement('img', {
						className: 'image ' + browser + (currentBrowser.HighDensity ? ' x2' : ''),
						src: './client/skins/default/images/allow_dialogs_cross_bws/' + browser + '/' + (me.__bVideo ? 'camera' : 'microphone') + '@' + (currentBrowser.HighDensity ? '2' : '1') + 'x.png'
					});
					me.__mrfrm.obj_label._main.insertBefore(image, me.__mrfrm.obj_label._main.firstChild);
					image.onload = function() {
						me.__mrfrm._size(620, me.__mrfrm.obj_label._main.offsetHeight + 110);
					};
				}

				var test = mkElement('div', {
					className: 'test',
					textContent: getLang('SIP::BEGIN_TEST')
				});
				me.__mrfrm.obj_label._main.appendChild(test);
				test.onclick = function(){
					window.open('https://www.icewarp.com/support/troubleshoot_webrtc/?' + buildURL({ishttps:(location.protocol.indexOf("https")===0?'1':'0'),lang:GWOthers.getItem('LAYOUT_SETTINGS','language')}));
				};

				me.__mrfrm._size(620, me.__mrfrm.obj_label._main.offsetHeight + 110);
			}
		},location.protocol.indexOf('https')===0?2500:0);

		// Browser request for media devices is displayed
		dataSet.add('sip',['media'],'requesting',false);
		return;
	case 'UserMediaGranted':
		// Remove warning if displayed
		if (me.__mrfrm && me.__mrfrm._destruct)
			me.__mrfrm._destruct();
		// Make sure timeout will not display warning
		delete me.__mrfrm;

		// Make note that user allowed device use
		dataSet.add('sip',['media'],'granted',false);
		return;
	case 'UserMediaDenied':
		// User media access failed

		// Remove warning if displayed
		if (me.__mrfrm && me.__mrfrm._destruct)
			me.__mrfrm._destruct();
		// Make sure timeout will not display warning
		delete me.__mrfrm;

		// Explain error
		var m;
		switch(sParam2) {
			case 'InvalidStateError': // This media requires a secure connection
				m = "SIP::INVALIDSTATE";
				break;
			case 'PermissionDeniedError': // User clicked deny access (or has done before so it's saved in prefs)
			case 'PERMISSION_DENIED':
				m = "SIP::NOPERMISSION";
				break;
			case 'TrackStartError': // Could not access media (camera already in use, etc)
			default:
				m = "SIP::MEDIADENIED";
		}
	//	gui.notifier._value({type: 'alert', args: {header: 'SIP::ERROR', text: m}});
		gui._create('alert', 'frm_alert', '', '', '', 'SIP::ERROR', m);
		// Remember that user denied device (will remain block for this login session)
		dataSet.add('sip',['media'],'denied',false);
		return;

	case 'PreparingCall':
		dataSet.add('sip',['video'],!!sParam2,false);
		return;

	case 'Calling':
		// Get name and identity of person calling
		var tmp = MailAddress.splitEmailsAndNames(sParam1)[0] || {};
		var name = tmp.name || tmp.email.split('@')[0];

		dataSet.add('sip',['remote'],{name: name, id: sParam1},false);

		if (this._calltone)
			this._calltone.play();

		break;

	case 'IncomingCall':
		// sParam1: (string) remote user
		// sParam2: (boolean) incoming video call
		// sParam3: (boolean) incoming presentation

		var tmp = MailAddress.splitEmailsAndNames(sParam1)[0] || {};
		var name = tmp.name || tmp.email.split('@')[0];

		sValue = getLang('SIP::INCOMINGCALL', [name]);
		gui.notifier._value({type: 'sip_incoming', args: {header: 'SIP::SIP', text_plain: sValue}, group: 'sip'});

		dataSet.add('sip',['remote'],{name: name, id: tmp.email || '', video: sParam2 || false},false);
		dataSet.add('sip',['video'],!!sParam2,false);

		if (this._ringtone)
			this._ringtone.play();

		break;

	case 'Joining':
		// Conference joining is handled in frm_conference
		break;

	case 'ConferenceStarted':
		// Conference start is handled in frm_conference
		break;

	case 'ConferenceCanceled':
	case 'ConferenceFinished':
		// Conference end is handled in frm_conference
		break;

	case 'CallEstablished':

		if(!dataSet.get('sip',['remote','id']))
			dataSet.add('sip',['remote'],{id: sParam1},false);

		sValue = getLang('SIP::CALLESTABLISHED',[sParam1]);
		gui.notifier._value({type: 'sip_established', args: {header: 'SIP::SIP', text_plain: sValue}, group: 'sip'});

		break;
	case 'UserBusy':

		// Play busy tone
		if(this._busytone)
			this._busytone.play();

		sValue = getLang('SIP::USERBUSY',[dataSet.get('sip',['remote','name'])]);
		gui.notifier._value({type: 'sip_user_busy', args: {header: 'SIP::SIP', text_plain: sValue}, group: 'sip'});

		dataSet.add('sip',['remote'],{},false);

		break;

	case 'CallFinished':

		// Local user ended call
		switch(sParam2) {
			case 'Rejected':
				sValue = getLang('SIP::CALLDECLINED');
				gui.notifier._value({type: 'sip_declined', args: {header: 'SIP::SIP', text_plain: sValue}, group: 'sip'});
				break;
			default:
				sValue = getLang('SIP::CALLFINISHED');
				gui.notifier._value({type: 'sip_finished', args: {header: 'SIP::SIP', text_plain: sValue}, group: 'sip'});
			}

		dataSet.add('sip',['remote'],{},false);
		dataSet.add('sip',['onhold'],false);

		break;

	case 'CallCanceled':

		// Remote user ended call
		switch(sParam2) {
			case 'Not Found':
				sValue = getLang('SIP::NOTAVAILABLE');
				gui.notifier._value({type: 'sip_not_reachable', args: {header: 'SIP::SIP', text_plain: sValue}, group: 'sip'});

				// Play failure tone when not reachable
				if(this._failtone)
					this._failtone.play();

				break;
			case 'Unavailable':
				sValue = getLang('SIP::USERBUSY',[dataSet.get('sip',['remote','name'])]);
				gui.notifier._value({type: 'sip_user_busy', args: {header: 'SIP::SIP', text_plain: sValue}, group: 'sip'});

				// Play busy tone when not available
				if(this._busytone)
					this._busytone.play();

				break;
			default:
				var tmp = MailAddress.splitEmailsAndNames(sParam1)[0] || {};
				var name = tmp.name || tmp.email.split('@')[0];
				sValue = getLang('SIP::CALLFINISHED');
				gui.notifier._value({type: 'sip_canceled', args: {header: 'SIP::SIP', text_plain: sValue, data: { NAME: name, EMAIL: tmp.email }}, group: 'sip', save: true});
			}

		dataSet.add('sip',['remote'],{},false);
		dataSet.add('sip',['onhold'],false);

		break;

	case 'Info':
		sValue = getLang('SIP::INFO',[sParam1]);
		gui.notifier._value({type: 'sip_external', args: {header: 'SIP::SIP', text_plain: sValue}, group: 'sip'});
		break;

	case 'Notification':
		sValue = getLang('SIP::NOTIFICATION',[sParam1,sParam2]);
		gui.notifier._value({type: 'sip_external', args: {header: 'SIP::SIP', text_plain: sValue}, group: 'sip'});
		break;

	}

	// Updating parameters for legacy support
	dataSet.add('sip',['info'],sValue,true);
	dataSet.add('sip',['type'],sType,true);
	dataSet.add('sip',['p1'],sParam1,true);
	dataSet.add('sip',['p2'],sParam2,true);
	dataSet.update('sip');

	//Events
	this._execute({type:sType,value:sValue,p1:sParam1,p2:sParam2});
};

obj_sip._activity = function(sVal, bNoUpd){
	// Reset mute if no activity ended
	if(!sVal)
		dataSet.add('sip',['muted'],false,false);

	// Add timer in case a call or conference has started
	switch (sVal){
		case 'Phoning':
		case 'Conference':
			dataSet.add('sip', ['timer'], new Date(), true);
			break;
		default:
			dataSet.remove('sip', ['timer'], true);
	}

	dataSet.add('sip',['activity'], sVal, bNoUpd);
};

/**
 * Funkce, ktera inicializuje hovor na predanou adresu pripadne tel. cislo
 * @param address adresa uzivatele, kteremu se ma volat
 * */
_me._call = function(address,bVideo,bScreen) {
	var me = this;
	me.__bVideo = bVideo;

	// Remove whitespace
	address = address.replace(/\s/g,'');

	// Remove sip protocol indicator
	if(address.indexOf('sip:')==0)
		address = address.substr(4);

	// If there is no number abort call
	if(!address)
		return false;

	// Compose address when domain part is missing
	if (address.indexOf('@')<0){
		//External account
		if (GWOthers.getItem('SIP','external')>0 && (GWOthers.getItem('RESTRICTIONS', 'disable_esip') || 0)<1){
			var server = (GWOthers.getItem('SIP','user') || "").indexOf('@');
			server = server==-1 ? GWOthers.getItem('SIP','server') : GWOthers.getItem('SIP','user').substr(server+1);
			address += '@' + server;
		}
		else // Add domain if missing
			address += '@' + dataSet.get('accounts',[sPrimaryAccount,'SIP_HOST']);
	}

	// Remeber last called number
	this.__lastCalled = address;

	if (this.phone && this.phone.online()) {
		// Use WebRTC
		this.call = new IceSIP.Call(this.phone);

		this.__process('PreparingCall',address,bVideo);

		this.call.oncalling = function(e) {
			obj_sip._activity("Calling",true);

			me.__process('Calling',address,'true');
		};

		this.call.onanswer = function(e) {
			obj_sip._activity("Phoning",true);

			me.__process('CallEstablished',e.user,{});

		//	if(e.video)
		//		me.__video(e.video.remote,e.video.local);

		};

		this.call.onstreaming = function(e) {
			me.__process('Broadcasting','',{});

			if(e.video)
				me.__video(e.video.remote,e.video.local);

		};

		this.call.onhangup = function(e) {
			obj_sip._activity("",true);

			if(e.reason=='Busy')
				me.__process('UserBusy');
			else
				me.__process(e.remote?'CallCanceled':'CallFinished',address,e.reason);
		};

		this.call.make(address,bVideo,bScreen);

		return true;
	} else
		return false;
};

// Open popup for video for webcam calls
_me.__video = function(remoteStream,localStream) {
	return gui._create('video','frm_video','','',remoteStream,localStream);
};

_me._dtmf = function(sChar){
	if(Is.Defined(sChar)) {
		if(this.phone) {
			if(this.call && this.call.state!='Ended')
				this.call.dial(sChar,dataSet.get('accounts',[sPrimaryAccount,'SIP_DTMF'])=="0");
		}
	}
};

// User ending call by hanging up
_me._hangup = function() {
	this.__lastCalled = '';

	if(this.phone) {
		// Terminate sip call
		if(this.call) {
			this.call.hangup();
			this.call = null;
		}
	}
};

// User answers an incoming call
_me._answerCall = function() {
	var me = this;

	this.__lastCalled = '';

	if(this.phone) {
		if(this.call) {
			this.call.onanswer = function(e){
				obj_sip._activity("Phoning",true);

				me.__process('CallEstablished',e.user,{});
			};

			this.call.onstreaming = function(e){
				obj_sip._activity("Phoning",true);

				if(e.video)
					me.__video(e.video.remote,e.video.local);
			};

			this.call.answer(me.__presentation);
		}
	}
};

// User declines an incoming call
_me._declineCall = function() {
	if (this.phone) {
		if (this.call)
			this.call.hangup();	//Possibly with decline header
	}
};

_me._addVideo = function() {
	if (this.phone) {
		if (this.call)
			this.call.addvideo();
	}
};

// Join conference using WebRTC
_me._join = function(conferenceNumber) {
	var me = this;

	IceSIP.devices(function(d){
		me.__join(conferenceNumber,d.microphone===false);
	});
};
_me.__join = function(conferenceNumber,bSkipMic) {
	var me = this;

	this.conference = new IceSIP.Conference(this.phone);
	this._conference_id = conferenceNumber;

	if(bSkipMic)
		this.conference.microphone = false;

	obj_sip._activity("Joining",true);

	this.__process('Joining',conferenceNumber,'true');

	this.conference.onjoined = function(e) {
		me.callid = e.callid;

		obj_sip._activity("Conference",true);

		me.__process('ConferenceStarted',e.user,{
			stream: e.video && !bOrganise ? true : false,
			callid: e.callid
		});

		if(e.video)
			me.__video(e.video);

	};
	this.conference.onfailed = function(e) {
		// Failed, try again without microphone
		if(me.conference.microphone) {
			me.conference.microphone = false;
			me.conference.join(conferenceNumber);
		} else {
			obj_sip._activity("",true);
			me.__process('ConferenceCanceled','',e.reason);
		}
	};
	this.conference.onended = function(e) {
		obj_sip._activity("",true);
		me.__process('ConferenceFinished','',e.reason);
	};
	this.conference.oninfo = function(e) {
		me.__process('ConferenceInformation',e.mimetype,e.message);
	};
	this.phone.onmessage = function(e) {
		if(e.group)
			me.__process('IncomingConferenceMessage',e.from_id,e.content);
		else
			me.__process('IncomingParticipantMessage',e.from_id,e.content);
	};
	this.conference.onsent = function(e) {
	//	console.log('message SENT!',e.failed);
	};

	this.conference.tracking = 'data=client%3Dinternal';

	this.conference.join(conferenceNumber);
};

// Check microphone connected
_me._passive = function() {
	return !this.conference.microphone;
};

// Turn off microphone
_me._mute = function(mute) {
	if (Is.Boolean(mute)){
		var muted = false;

		if(this.call)
			muted = this.call.mute(mute);
		else if(this.conference)
			muted = this.conference.mute(mute);

		dataSet.add('sip',['muted'],mute&&muted);
	}
	else
		return dataSet.get('sip',['muted'])?true:false;
};

// Put call on hold
_me._hold = function(hold) {
	if (Is.Boolean(hold)){
		var onhold = false;

		if(this.call)
			onhold = this.call.hold(hold);

		dataSet.add('sip',['onhold'],hold&&onhold);
	}
	else
		return dataSet.get('sip',['onhold'])?true:false;
};

// Turn off sound for loudspeakers
_me._silence = function(quiet) {
	if(this.conference)
		this.conference.silence(!!quiet);
};

// Share screen
_me._share = function(bSend,callback) {
	if(this.conference) {
		this.conference.share = new IceSIP.Sharing(this.conference);

		this.conference.share.onstarted = function(e) {
			if(e.video)
				callback(e.video);
			else if(e.sending)
				callback(true);
		};

		this.conference.share.onfailed = function(e) {
			callback(false);
		};

		this.conference.share.onended = function(e) {
			callback(false);
		};

		if(bSend)
			this.conference.share.share();
		else
			this.conference.share.join();
	}

};

// Stop screen sharing in conference
_me._unshare = function() {
	if (this.conference && this.conference.share) {
		this.conference.share.stop();
		this.conference.share = null;
	}
};

// Leave conference started using WebRTC
_me._leave = function() {
	obj_sip._activity('');

	if (this.conference) {
		// Stop sharing if running
		this._unshare();
		// Leave conference
		if(this.conference.state!='Ended')
			this.conference.leave();
	}
	// Restore speaker volume
	this._silence(false);
};

// Send chat message
_me._send = function(from,message,to) {
	this.conference.send(from,message,to);
};

_me._alive = function() {
	return this.__started ? true : false;
};

_me.__destructor = function (){

	if (this.__timeout)
		window.clearTimeout(this.__timeout);

	// WebRTC unregistration and clean up
	if(this.phone)
		this.phone.stop();

};
