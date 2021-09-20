
/*
	SIP bridge class
	Martin Ekblom 2014
*/

/*
	SIP states:
		online, offline, error

	SIP activities (busy state):
		ready, ringing, talking, calling, meeting

	SIP types:
		conference | phone
*/

var IceSIP = function(config) {
	IceSIP.instantiated = true;

	var me = this;

	// Internal state
	this.activity = null;
	this.state = null;
	this.type = null;

	// Custom parameters for IceWarp
	config.stun_servers = []; // "stun:stun.l.google.com:19302"
	var ws = location.protocol.replace('http','ws') + '//' + document.location.host;
	config.sockets = [new JsSIP.WebSocketInterface(ws)];

	config.register_expires = 120;
	config.session_timers = false;

	// PeerConstraint: {optional: [{DtlsSrtpKeyAgreement: 'true'}]}

	// Create SIP client
	this.sip = new JsSIP.UA(config);

	// Intercept and modify INFO requests because JsSIP does not support RFC 6068
	// this.sip.on('connected',function(e) {
	// 	var socket = e.socket;
	// });

	// Connecting registation events
	this.sip.on('registered',function(e){
		if(me.state!='online') {
			me.state = 'online';
			me.activity = 'ready';
			var host = e && e.data && e.data.response && e.data.response.from && e.data.response.from.uri && e.data.response.from.uri.host ? e.data.response.from.uri.host : '';
			me.onconnect({host: host});
		}
	});
	this.sip.on('unregistered',function(e){
		me.state = 'offline';
		me.activity = null;
		me.ondisconnect({reason: 'offline'});
	});
	this.sip.on('registrationFailed',function(e){
		me.state = 'failed';
		me.activity = null;
		me.ondisconnect({reason: 'failed'});
	});

	// Monitor incoming calls
	this.sip.on('newRTCSession', function(e){

		if(e.session) {

			// Monitor user media access
	/*		e.session.on('mediaRequested',function(e){
				me.onmedia({constraints: e});
			});
			e.session.on('mediaGranted',function(e){
				me.onmedia({granted: true});
			});
	*/		e.session.on('getusermediafailed',function(e){
				me.onmedia({granted: false, reason: e && e.name});
			});

			// Handle incoming calls
			if(e.originator=='remote') {

				// Do not allow more than one call
				for(var i in me.sip._sessions)
					if(e.session._id!=i) {
						e.session.terminate({status_code: 486});
						return;
					}

				me.activity = 'Ringing';

				// Initiate call and keep reference
				var call = new IceSIP.Call(me,e.session);
				var session = e.session;

				// Local references to media players
				var audio = false;
				var video = false;

				// Handling failed or ended call
				var ended = function(e) {
					if (audio)
						audio.pause();

					call.onhangup({reason: e.cause || 'Ended', remote: e.originator=='remote'});
				};
				session.on('ended',ended);
				session.on('failed',ended);

				// Handling started call
				session.on('confirmed',(function(call){
					return function(e) {
						me.activity = 'Talking';

						call.onanswer({
							name: session._remote_identity._display_name,
							user: session._remote_identity._uri._user + '@' + session._remote_identity._uri._host
						});
					};}(call))
				);

				// Determine if it's a audio, video or presentation call
				var sdp = e.request.body;
				var presentation = sdp && sdp.indexOf("m=video")!=-1 && sdp.indexOf("a=sendonly")!=-1;
				var video = presentation || sdp && sdp.indexOf("m=video")!=-1 && sdp.indexOf("a=sendrecv")!=-1;

				// Only remote stream is ready in this stage
				me.oncall({
					name: session._remote_identity._display_name,
					user: session._remote_identity._uri._user + '@' + session._remote_identity._uri._host,
					call: call,
					video: video,
					show: presentation
				});
			}
		}
	});

	// Monitor incoming messages - both conference and common
	this.sip.on('newMessage',function(e){
		// Remote incoming message
		if(e && e.originator=='remote' && e.message) {
			var message = new IceSIP.Message(me, e.message._request.body);
			message.from = e.message._remote_identity._uri._user + '@' + e.message._remote_identity._uri._host;
			// Propagate to conference if it has conference header
			if(e.message._request.getHeader('X-IceWarp-Conference')) {
				var id = e.message._request.getHeader('X-IceWarp-Conference').match(/id=([0-9]+)/);
				if(id)
					message.conference_id = id[1];
				var data = e.message._request.getHeader('X-IceWarp-Message').split(',');
				var tmp = data.pop();
				do {
					if(tmp.indexOf("is_private=")===0)
						message.group = tmp=="is_private=0" ? true : false;
					else if(tmp.indexOf("from_id=")===0)
						message.from_id = tmp.substr(8);
				} while(tmp=data.pop());
			}
			me.onmessage(message);
		}
	});

};

/* Static support method */

IceSIP.supported = function() {
	if(window.RTCPeerConnection && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) // Cross browser check for native WebRTC support
		return true;
	else if(document.body && 'WebSocket' in window && 'ActiveXObject' in window) { // IE browser with WebSockets, check for plugin
		var supported = false;
		try {
			if(new ActiveXObject('Tem.TemWebRTCPlugin'))
				supported = true;
		} catch(e) {}
		return supported;
	} else if(window.webkitAudioContext) { // WebKit engine without native support (Safari), check for plugin
		if(navigator.plugins && navigator.plugins.namedItem && navigator.plugins.namedItem('TemWebRTCPlugin'))
			return true;
		else
			return false;
	} else return false;
};

/* Check connected devices */

IceSIP.devices = function(callback) {
	// Latest cross browser standard device detection
	if(navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
		navigator.mediaDevices.enumerateDevices()
		.then(function(devices) {
			var media = {microphone: false, camera: false};
			devices.forEach(function(device) {
				switch(device.kind) {
					case 'audioinput':
						media.microphone = true;
						break;
					case 'videoinput':
						media.camera = true;
						break;
				}
			});
			callback(media);
		})
		.catch(function(err) {
			callback({});
		});
	} else callback({});
};

IceSIP.instantiated = false;

/* SIP connetion handling */

// Start SIP, initial start of all SIP functionality
IceSIP.prototype.start = function() {
	this.sip.start();
};

// Stop SIP, fully stop all SIP functionality
IceSIP.prototype.stop = function() {
	this.sip.stop();
};

// Temoporarily unregister (be offline)
IceSIP.prototype.unregister = function() {
	this.sip.unregister();
};

// Re-register after going offline
IceSIP.prototype.register = function() {
	this.sip.register();
};

// Force end calls
IceSIP.prototype.terminate = function() {
	for(var i in this.sip.sessions)
		this.sip.sessions[i].terminate();
};

// Check if SIP is online
IceSIP.prototype.online = function() {
	return this.sip.isConnected() && this.sip.isRegistered();
};

// Check if SIP is ready to make or accept calls
IceSIP.prototype.busy = function() {
	return !this.sip.isConnected() || !this.sip.isRegistered() || this.activity!='ready';
};

IceSIP.prototype.onconnect = function(e) {
	// Abstract method
	console.warn('No handler assigned: Connected to '+e.host);
	// You are connected to host
};

IceSIP.prototype.ondisconnect = function(e) {
	// Abstract method
	console.warn('No handler assigned: Disconnected');
	// Connection was lost
};

IceSIP.prototype.onmedia = function(e) {
	// Abstract method
	console.warn('No handler assigned: Media');
	// Asking for or granted access to media
};

/* General helper functions */

IceSIP.attachVideoStream = function(stream) {
	var video;
	if(window.AdapterJS && AdapterJS.WebRTCPlugin && AdapterJS.WebRTCPlugin.plugin) {
		var elmId = 'WebRTCPluginVideo' + Math.random().toString(36).slice(2);
		var elm = document.createElement('div');
		// AdapterJS.WebRTCPlugin.pluginInfo.type
		elm.innerHTML =
		'<object id="' + elmId + '" type="application/x-temwebrtcplugin">' +
			'<param name="pluginId" value="' + elmId + '" /> ' +
			'<param name="pageId" value="' +  AdapterJS.WebRTCPlugin.pageId + '" /> ' +
			'<param name="windowless" value="true" /> ' +
			'<param name="streamId" value="' + stream.id + '" /> ' +
			'<param name="tag" value="video" /> ' +
		'</object>';
		video = elm.firstChild;
	} else {
		video = document.createElement('video');
		//video.setAttribute('muted', true);
		video.setAttribute('autoplay', true);

		// video.onloadeddata = function(e){
		// 	console.warn('loadeddata', e);
		// };
		// video.oncanplay = function(e){
		// 	console.warn('canplay', e);
		// };
		// video.oncanplaythrough = function(e){
		// 	setTimeout(function(){
		// 		this.play();
		// 		console.warn('oncanplaythrough',e);
		// 	}.bind(this), 1000);
		// };

		video.srcObject = stream;

	}
	return video;
};

/* SIP Phone, Call handling */

IceSIP.Call = function(gear,session) {
	this.sip = gear.sip;
	this.state = session ? 'Ringing' : 'Calling';
	this.sip.activity = this.state;
	this.incoming = !!session;
	this.session = session;
};

IceSIP.Call.prototype.getLocalStreams = function(){
	var stream = new MediaStream(),
		senders = this.session._connection.getSenders();

	senders.forEach(function(sender) {
		stream.addTrack(sender.track);
		if (sender.track.kind === 'video')
			camera = true;
	});

	return stream;
};
IceSIP.Call.prototype.getRemoteStreams = function(){
	var stream = new MediaStream();
	this.session._connection.getReceivers().forEach(function(receiver) {
		stream.addTrack(receiver.track);
	});

	return stream;
};


// Make an outgoing call
IceSIP.Call.prototype.make = function(address,bVideo,bScreen) {
	var me = this;

	var mc = {audio: true, video: bVideo || false};
	if(bScreen)
		mc.screen = true;

	var oc = {
		offerToReceiveAudio: true,
		offerToReceiveVideo: bVideo || false
	};

	var audio = false;

	this.session = this.sip.call('sip:'+address,{eventHandlers: {
		progress: function(e) {
			me.state = 'Calling';
		},
		connecting: function(e) {
			me.oncalling({
				call: me.session,
				name: me.session._remote_identity._display_name,
				user: me.session._remote_identity._uri._user + '@' + me.session._remote_identity._uri._host
			});

		},
		failed: function(e) {
			me.state = 'Failed';
			me.onhangup({reason: e.cause ? e.cause : 'Unknown', remote: e.originator=='remote'});
		},
		confirmed: function(e) {
			if(me.session && me.session._remote_identity) {
				me.state = 'Talking';

				me.onanswer({
					name: me.session._remote_identity._display_name,
					user: me.session._remote_identity._uri._user + '@' + me.session._remote_identity._uri._host
				});
			}
		},
		ended: function(e) {
			me.state = 'Ended';
			if(audio)
				audio.pause();
			me.onhangup({reason: 'Ended', remote: e.originator=='remote'});
		},
		newDTMF: function(e) {
			if(e.originator=='remote')
				me.ondial({tone: e.dtmf.tone});
		},
		newInfo: function(e) {
			if(e.info) {
				if(e.info.contentType=="application/media_control+xml") {
					var xml = e.info.body;
					xml = new DOMParser().parseFromString(xml, 'text/xml');
					var command = xml.getElementsByTagName('to_encoder')[0];
					command = command.firstElementChild.nodeName;
					if(command=="picture_fast_update" && pc) {
						var videotrack = pc.getLocalStreams()[0].getVideoTracks()[0];
						videotrack.enabled = false;
						setTimeout(function(){
							videotrack.enabled = true;
						},250);
					}
				}
			}
		},
		refer: function(e) {
			e.accept();
		},
		replaces: function(e) {
			e.accept();
		}/*,
		reinvite: function(e) {
			e.callback = function() {
				if(!gui.video || gui.video._destructed) {
					var stream = pc.getRemoteStreams()[0];
					if(stream.getVideoTracks().length) {
						var localstream = pc.getLocalStreams();
						var camera = localstream.length && localstream[0].getVideoTracks().length;
						var video = {
							remote: IceSIP.attachVideoStream(stream),
							local: camera ? IceSIP.attachVideoStream(localstream[0]) : false
						};
						me.onstreaming({
							camera: camera ? true : false,
							video: video,
							audio: false
						});
					}
				}
			}
		}*/
	},
	mediaConstraints: mc,
	rtcOfferConstraints: oc
	});

	var pc = this.session._connection;
	pc.addEventListener('addstream',function(e){

		// Handle local streams
		var localstream = me.getLocalStreams(),
			camera = !mc.screen && localstream.getVideoTracks().length;

		var remote = false,
			local = false;

		var audiostream = false, videostream = false;
		if (e.stream.getVideoTracks().length) {
			videostream = e.stream;
		}
		else
		if (e.stream.getAudioTracks().length) {
			audiostream = e.stream;
			audiostream.onaddtrack = function(e) {
				// Video track added to audio after renegotiation
				if(e.track.kind=='video') {
					var localstream = me.getLocalStreams(),
						camera = localstream.getVideoTracks().length>0;

					var video = {
						remote: IceSIP.attachVideoStream(e.target),
						local: camera ? IceSIP.attachVideoStream(localstream) : false
					};
					me.onstreaming({
						camera: camera ? true : false,
						video: video,
						audio: false
					});
				}
			};
		}

		if (audiostream) {
			me.session.audio = audio = new Audio();
			me.session.audio.srcObject = e.stream;
			me.session.audio.play();
		}
		else
		if (videostream) {
			remote = IceSIP.attachVideoStream(e.stream);
			if(camera) {
				local = IceSIP.attachVideoStream(localstream);
				local.muted = true;
			}
		}

		var video = remote || local ? {remote: remote, local: camera ? local : false} : false;
		me.onstreaming({
			camera: camera ? true : false,
			video: video,
			audio: audiostream
		});
	},false);

};

// Answer to an incoming call
IceSIP.Call.prototype.answer = function(bShow) {
	var me = this;

	if(this.sip.isConnected() && this.sip.isRegistered() && this.session) {
		// Always send audio
		var mc = {audio: true /*, video: true */};

		// Only send video back if it's not a presentation
		if (bShow)
			mc.video = false;

		this.session.answer({
			mediaConstraints: mc /*,
			rtcAnswerConstraints: {
				mandatory: {
					OfferToReceiveAudio: true,
					OfferToReceiveVideo: true
				}
			}	*/
		});

		this.session._connection.addEventListener('addstream', function(e) {
			var remote, local;

			var ext_stream = me.getRemoteStreams(),
				video = ext_stream.getVideoTracks().length>0;

			var loc_stream = me.getLocalStreams(),
				camera = loc_stream.getVideoTracks().length>0;

			// Adding video stream
			if (video) {
				remote = IceSIP.attachVideoStream(ext_stream);
				if (camera){
					local = IceSIP.attachVideoStream(loc_stream);
					local.muted = true;
				}
			}
			else
			// Adding pure audio stream
			if (ext_stream.getAudioTracks().length) {
				me.session.audio = audio = new Audio();
				me.session.audio.srcObject = ext_stream;
				me.session.audio.play();
			}

			me.onstreaming({
				name: me.session._remote_identity._display_name,
				user: me.session._remote_identity._uri._user + '@' + me.session._remote_identity._uri._host,
				camera: camera,
				video: video ? {remote: remote, local: local} : false,
				audio: video ? false : ext_stream
			});

		},false);

		return true;
	} else
		return false;
};

// Decline an incoming call
IceSIP.Call.prototype.decline = function() {
	if(this.sip.isConnected() && this.sip.isRegistered() && this.session)
		this.session.terminate();
	else
		return false;
};

// Dial numbers via keypad
IceSIP.Call.prototype.dial = function(n,bInband) {
	if(this.sip.isConnected() && this.sip.isRegistered() && this.session && /^[*0-9#]+$/.test(n)) {
		var stream = this.session._localMediaStream;
		var audio = stream.getAudioTracks() || null;
		var peer = this.session._connection.pc;

		if(bInband && audio && audio.length && peer && peer.createDTMFSender) {
			var dtmf = peer.createDTMFSender(audio[0]);
			dtmf.ontonechange = function(e){
				if(e.tone) {
				//	console.log('Sending DTMF over RTP: ',e.tone);
				}
			};
			if(dtmf.canInsertDTMF)
				dtmf.insertDTMF(n);
		} else
			this.session.sendDTMF(n);
	}
};

// Mute user (silence outgoing stream)
IceSIP.Call.prototype.mute = function(mute) {
	if(this.session) {
		if(mute)
			this.session.mute();
		else
			this.session.unmute();

		return true;
	} else
		return false;
};

// Put call on hold
IceSIP.Call.prototype.hold = function(hold) {
	if(this.session) {
		if(hold)
			return this.session.hold();
		else
			return this.session.unhold();
	} else
		return false;
};

// Transfer call to other recipient
IceSIP.Call.prototype.transfer = function(sip) {
	if(this.session) {
		this.session.refer('sip:'+sip);
	};
};

// Hang up a call, regardless on incoming or outgoing
IceSIP.Call.prototype.hangup = function(code) {
	if(this.sip.isConnected() && this.sip.isRegistered() && this.session) {
		this.state = 'Ended';
		this.sip.activity = 'Ready';

		if (this.session._state != 8){
			if (this.session.audio)
				this.session.audio.pause();

			if(code)
				this.session.terminate({status_code: code});
			else
				this.session.terminate();
		}
	}
};

IceSIP.Call.prototype.addvideo = function(code) {
	if(this.sip.isConnected() && this.sip.isRegistered() && this.session) {
		var session = this.session;
		var connection = this.session._connection;
		var promise = navigator.mediaDevices.getUserMedia({audio: false, video: true});

		promise.then(function(stream){

			if ('addTrack' in connection){
				stream.getTracks().forEach(function(track) {
					if (track.kind == 'video')
						connection.addTrack(track, stream);
				});
			}
			// else
			// connection.addStream(stream);

			session.renegotiate({useUpdate:false},function(){
				console.log("Renegotiate", arguments);
			});


		}).catch(function(){});
	}
};

// Add video to an ongoing call
IceSIP.Call.prototype.camera = function(conference_id,data) {
	var me = this;

	var constraints = {
		audio: true, video: true
	};

	// Add new mediastream
	var addStream = function(stream) {
		me.session.rtcMediaHandler.addStream(stream);
	};

	// Attempt to get media stream from screen
	try {
		navigator.webkitGetUserMedia(constraints,
			addStream,
			function(){
				console.log("No stream!");
			}
		);
	} catch(e){
		console.log('Failed',e);
	}

};


IceSIP.Call.prototype.ondial = function(e) {
	// Abstract method
	console.warn('No handler assigned: '+e.number+' was dialed');
	// You are connected to host
};

IceSIP.Call.prototype.onanswer = function(e) {
	// Abstract method
	console.warn('No handler assigned: '+e.user+' has picked up');
	// Outgoing call was answered
};

IceSIP.Call.prototype.ondecline = function(e) {
	// Abstract method
	console.warn('No handler assigned: '+e.user+' has declined call');
	// Outgoing call was declined
};

IceSIP.Call.prototype.oncalling = function(e) {
	// Abstract method
	console.warn('No handler assigned: you are calling '+e.user);
	// Outgoing call was terminated
};

IceSIP.Call.prototype.onhangup = function(e) {
	// Abstract method
	console.warn('No handler assigned: '+e.user+' has hanged up');
	// Outgoing call was terminated
};

/* Conference */

IceSIP.Conference = function(gear,session) {
	// Internal data
	this.sip = gear.sip;
	this.state = 'Calling';
	this.session = session;
	this.sip.type = 'Conference';
	// External reference
	IceSIP.Conference.current = this;
	// Configuration parameters
	this.microphone = true;
	this.tracking = '';
};

IceSIP.Conference.current = null;

IceSIP.Conference.prototype.join = function(conference_id) {
	var me = this;

	var id = conference_id.match(/^conference\*([0-9]+)/);
	id = id.length ? id[1] : 'null';

	this.full_id = conference_id;
	this.numeric_id = id;

	var mc = {audio: this.microphone || false, video: false};
	var oc = {offerToReceiveAudio: true,offerToReceiveVideo: false};

	var guest = window.sPrimaryAccountGUEST ? {
		email: dataSet.get('main',['user']),
		name: dataSet.get('main',['fullname'])
	} : false;

	this.session = this.sip.call('sip:'+conference_id,{
		eventHandlers: {
			progress: function(e) {
				me.state = 'Ringing';
			},
			failed: function(e) {
				me.state = 'Failed';
				me.onfailed({reason: e.data && e.data.cause ? e.data.cause : 'Unknown'});
			},
			confirmed: function(e) {
				if(me.session && me.session._request) {
					me.state = 'Joining';

					me.onjoined({
						audio: true,
						callid: me.session._request.call_id
					});
				}
			},
			ended: function(e) {
				me.state = 'Ended';

				if(me.session.audio)
					me.session.audio.pause();

				me.onended({reason: 'Ended'});
			},
			newInfo: function(e) {
				var speakers = e.info.body;
				if(speakers)
					me.oninfo({
						message: speakers,
						mimetype: e.info.contentType
					});
			}
		},
		mediaConstraints: mc,
		RTCOfferConstraints: oc,
		extraHeaders: [
			'X-IceWarp-Conference: id='+id,
			'X-IceWarp-ParticipantData: '+this.tracking
		],
		guest: guest
	});

	var pc = this.session._connection;
	pc.addEventListener('addstream', function(e) {
		if(me.session && me.session._remote_identity) {
			var audiostream = e.stream;
			if(audiostream) {
				me.session.audio = audio = new Audio();
				me.session.audio.srcObject = audiostream;
				var promise = me.session.audio.play();
				// Safari as default does not allow to play sound without user interaction
				if(promise) {
					promise.catch(function(){
						gui._create('alert', 'frm_alert', '', '', [function(){
							me.session.audio.play();
						}], 'SIP::ERROR', 'SIP::PLAYBLOCKED');
					}).then(function(){
					//	me.session.audio.play();
					});
				}
			}
		}
	},false);

};

// Screen sharing functionality for Conference

IceSIP.Sharing = function(conference) {
	this.sip = conference.sip;
	this.conference_id = conference.full_id;
	conference.share = this;
	//this.reference = conference._dialog.id.call_id;
	this.reference = conference.session._dialog._id.call_id;
	this.live = false;
};

// Join an ongoing screen sharing session
IceSIP.Sharing.prototype.join = function() {
	this.screen();
};

// Prepare for sharing screen to other users (Chrome only)
IceSIP.Sharing.prototype.share = function() {
	var me = this;

	if(navigator.browser && navigator.browser.application=="Chrome") {
		WebRTCSharing.getScreenId(function(error, screen_capture_id) {
			// Set screen constraints for screen capturing
			var screen_constraints = {audio: false,
				video: {
					mandatory: {
						chromeMediaSource: screen_capture_id ? 'desktop' : 'screen',
						maxWidth: screen.width > 1920 ? 1920 : screen.width,
						maxHeight: screen.height > 1080 ? 1080 : screen.height,
						maxFrameRate: 30
					},
					optional: [
						{minFrameRate: 10}
					]
				}
			};
			// Add capture id if available
			if(screen_capture_id)
				screen_constraints.video.mandatory.chromeMediaSourceId = screen_capture_id;
			// Send constrains and start shaing
			me.screen(screen_constraints);
		});
	} else if(navigator.browser && navigator.browser.application=="Firefox") {
		var screen_constraints = {
			video: {
				mediaSource: "window", // "screen",
				width: {max: '1920'},
				height: {max: '1080'},
				frameRate: {max: '10'}
			}
		};
		this.screen(screen_constraints);
	}

};

// Start sharing screen
IceSIP.Sharing.prototype.screen = function(mc) {
	var me = this;

	mc = mc || {audio: false, video: false};

	var conference_id = this.conference_id;
	var id = conference_id.match(/^conference\*([0-9]+)/);
	id = id.length ? id[1] : 'null';

	var oc = {offerToReceiveAudio: false,offerToReceiveVideo: !mc.video};

	var guest = window.sPrimaryAccountGUEST ? {
		email: dataSet.get('main',['user']),
		name: dataSet.get('main',['fullname'])
	} : false;

	var videostream = null;
	this.session = this.sip.call('sip:'+this.conference_id,{
		eventHandlers: {
		//	progress: function(e) {},
		//	sdp: function (e) {},
			failed: function(e) {
				// Screen shaing failed
				me.onfailed({reason: e && e.cause ? e.cause : 'Unknown'});
			},
			confirmed: function(e) {
				if(me.session && me.session._remote_identity) {
					me.onstarted({sending: !!mc.video});
				}
			},
			ended: function(e) {
				// Screen sharing ended
				me.onended({reason: 'Ended'});
			}
		},
		mediaConstraints: mc,
		rtcOfferConstraints: oc,
		extraHeaders: [
			'X-IceWarp-Conference: id='+id,
			'X-IceWarp-Reference: callid='+me.reference
		],
		guest: guest
	});

	var pc = this.session._connection;
	pc.addEventListener('addstream', function(e) {
		if(me.session && me.session._remote_identity) {

			if(e.stream.getVideoTracks()[0])
				videostream = e.stream;

			var video = false;
			if(videostream)
				video = IceSIP.attachVideoStream(videostream);

			// Screen sharing started
			me.onstarted({
				receiving: !mc.video,
				video: video
			});
		}
	},false);

};

// End screen sharing
IceSIP.Sharing.prototype.stop = function() {
	this.live = false;

	if (this.session)
		this.session.terminate();
};

// Conference mute is identical to call mute
IceSIP.Conference.prototype.mute = IceSIP.Call.prototype.mute;

// Conference silence loudspeakers
IceSIP.Conference.prototype.silence = function(quiet) {
	if(this.session && this.session.audio)
		this.session.audio.muted = quiet;
};

// Leave conference
IceSIP.Conference.prototype.leave = function() {
	if(this.sip.isConnected() && this.session) {
		this.state = 'Ended';
		this.sip.activity = 'Ready';
		if(this.session.audio)
			this.session.audio.pause();

		// Terminate conference, will throw exception if already cancelled or terminated
		try {
			this.session.terminate();
		} catch(e) {
		//	console.log("Termination failed :", this.session && this.session.status);
		}
	}
	IceSIP.Conference.current = null;
};

// Send text message to another participant
IceSIP.Conference.prototype.send = function(from,message,to) {
	var me = this;

	var guest = window.sPrimaryAccountGUEST ? {
		email: dataSet.get('main',['user']),
		name: dataSet.get('main',['fullname'])
	} : false;

	if(this.sip.isConnected() /*&& this.sip.isRegistered()*/) {
		this.sip.sendMessage('sip:'+this.full_id,message,{
			eventHandlers: {
				succeeded: function(e) {
					me.onsent({failed: false});
				},
				failed: function(e) {
					me.onsent({failed: true});
				}
			},
			extraHeaders: [
				'Content-Encoding: utf-8',
				'X-IceWarp-Conference: id='+this.numeric_id,
				'X-IceWarp-Message: from_id=sender,to_id='+(to||'*')+',is_private='+(!to?0:1)
			],
			guest: guest
		});
	} else
		this.onsent({failed: true});
};

// Incoming message, called by sip when message has icewarp header (private)
IceSIP.Conference.prototype.message = function(m) {
	if(IceSIP.Conference.current)
		IceSIP.Conference.current.onmessage(m);
};

IceSIP.Conference.prototype.onsent = function(e) {
	// Abstract method
	console.warn('No handler assigned: '+e.successful+' received');
	// User received a message
};

IceSIP.Conference.prototype.onmessage = function(e) {
	// Abstract method
	console.warn('No handler assigned: '+e.text+' received');
	// User received a message
};

IceSIP.Conference.prototype.oninfo = function(e) {
	// Abstract method
	console.warn('No handler assigned: '+e.message+' received');
	// Conference information sent
};

IceSIP.Conference.prototype.onjoined = function(e) {
	// Abstract method
	console.warn('No handler assigned: '+e.conference+' started');
	// User joined conference
};

IceSIP.Conference.prototype.onfailed = function(e) {
	// Abstract method
	console.warn('No handler assigned: '+e.conference+' failed');
	// User could not join conference
};

IceSIP.Conference.prototype.onended = function(e) {
	// Abstract method
	console.warn('No handler assigned: '+e.conference+' has ended');
	// Conference ended for this user
};

/* SIP Messages */

IceSIP.Message = function(connection,content) {
	this.sip = connection.sip;
	this.content = content;
};

// Send message
IceSIP.Message.prototype.send = function(to) {
	this.to = to;
	this.sip.sendMessage('sip:'+to,this.content,{
		eventHandlers: {
			succeeded: function(e) {
				me.onsent({failed: false});
			},
			failed: function(e) {
				me.onsent({failed: true});
			}
		},
		extraHeaders: []
	});
};

IceSIP.Conference.prototype.onsent = function(e) {
	// Abstract method
	console.warn('No handler assigned: Message sent '+e.failed);
	// Message sending success
};