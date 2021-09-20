
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
	config.stun_servers = [];	// "stun:stun.l.google.com:19302"
	if(!config.ws_servers)
		config.ws_servers = (location.protocol=='https:'?'wss://':'ws://') + document.location.host;

	config.register_expires = 120;

	// PeerConstraint: {optional: [{DtlsSrtpKeyAgreement: 'true'}]}

	// Create SIP client
	this.sip = new JsSIP.UA(config);

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
		if(e.data && e.data.session) {

			// Monitor user media access
			e.data.session.on('mediaRequested',function(e){
				me.onmedia({constraints: e.data});
			});
			e.data.session.on('mediaGranted',function(e){
				me.onmedia({granted: true});
			});
			e.data.session.on('mediaDenied',function(e){
				me.onmedia({granted: false, reason: e.data && e.data.name || e.data});
			});

			// Handle incoming calls
			if(e.data.originator=='remote') {

				// Do not allow more than one call
				for(var i in me.sip.sessions)
					if(e.data.session.id!=i) {
						e.data.session.terminate({status_code: 486});
						return;
					}

				me.activity = 'Ringing';
				var call = new IceSIP.Call(me,e.data.session);
				var peer = e.data.session.rtcMediaHandler.peerConnection
				var ended = (function(call){
					return function(e) {
						if(call.session.audio)
							call.session.audio.pause();

						call.onhangup({reason: e.data.cause || 'Ended', remote: e.data.originator=='remote'});
					}
				}(call));
				e.data.session.on('ended',ended);
				e.data.session.on('failed',ended);
				e.data.session.on('started',(function(call){
					return function(e) {
						me.activity = 'Talking';
						call.session = e.sender;
						// Manage remote streams
						var streams = call.session.getRemoteStreams(),
							videostreams = [],
							audiostreams = [];
						for(var i in streams) {
							if(streams[i].getVideoTracks()[0])
								videostreams.push(streams[i]);
							else
							if(streams[i].getAudioTracks()[0])
								audiostreams.push(streams[i]);
						}
						// Check for local strams
						var localstream = call.session.getLocalStreams();
						var camera = localstream.length && localstream[0].getVideoTracks().length;

						var audio = false;

						// Adding pure audio streams
						if(audiostreams.length) {
							if(JsSIP.WebRTC.Plugin) {
								// Add remote audio to page
								var elmId = 'WebRTCPluginAudio' + Math.random().toString(36).slice(2);
								var elm = document.createElement('div');
								elm.innerHTML = '<object id="' + elmId + '" type="application/x-temwebrtcplugin">' +
									'<param name="pluginId" value="' + elmId + '" /> ' +
									'<param name="pageId" value="' + JsSIP.WebRTC.PlugId + '" /> ' +
									'<param name="windowless" value="true" /> ' +
									'<param name="streamId" value="' + audiostreams[0].id + '" /> ' +
									'<param name="tag" value="audio" /> ' +
								'</object>';
								audio = elm.firstChild;
								document.body.appendChild(audio);
								audio.play();
								// Latest version of plugin defaults audio tracks to disabled
								audiostreams[0].getAudioTracks()[0].enabled = true;
							} else {
								call.session.audio = audio = new Audio();
								call.session.audio.src = window.URL.createObjectURL(audiostreams[0]);
								call.session.audio.play();
							//	call.session.audio.srcObject = audiostreams[0];
							}
						}

						// Adding video streams
						var remote = false,
							local = false;
						if(videostreams.length) {
							if(JsSIP.WebRTC.Plugin) {
								// Add remote video to page
								var elmId = 'WebRTCPluginVideo' + Math.random().toString(36).slice(2);
								var elm = document.createElement('div');
								elm.innerHTML = '<object id="' + elmId + '" type="application/x-temwebrtcplugin">' + 
									'<param name="pluginId" value="' + elmId + '" /> ' + 
									'<param name="pageId" value="' + JsSIP.WebRTC.PlugId + '" /> ' + 
									'<param name="windowless" value="true" /> ' + 
									'<param name="streamId" value="' + videostreams[0].id + '" /> ' + 
									'<param name="tag" value="video" /> ' +
								'</object>';
								remote = elm.firstChild;
								// Add own camera element to page
								var elmId = 'WebRTCPluginCamera' + Math.random().toString(36).slice(2);
								var elm = document.createElement('div');
								elm.innerHTML = '<object id="' + elmId + '" type="application/x-temwebrtcplugin">' + 
									'<param name="pluginId" value="' + elmId + '" /> ' + 
									'<param name="pageId" value="' + JsSIP.WebRTC.PlugId + '" /> ' + 
									'<param name="windowless" value="true" /> ' + 
									'<param name="streamId" value="' + localstream[0].id + '" /> ' + 
									'<param name="tag" value="video" /> ' +
								'</object>';
								local = elm.firstChild;
								// Latest version of plugin defaults audio tracks to disabled, must be enabled after object element is inserted
								if(videostreams[0].getAudioTracks().length)
									setTimeout((function(audio){
										return function(){ audio.enabled = true; }
									})(videostreams[0].getAudioTracks()[0]),0);
							} else {
								remote = document.createElement('video');
								remote.autoplay = true;
								remote.src = window.URL.createObjectURL(videostreams[0]);
								if(camera) {
									local = document.createElement('video');
									local.autoplay = true;
									local.muted = true;
									local.src = window.URL.createObjectURL(localstream[0]);
								}

							}
						}

						var video = remote || local ? {remote: remote, local: camera ? local : false} : false;
						call.peer = call.session.rtcMediaHandler.peerConnection;
						call.onanswer({
							name: call.session.remote_identity.display_name,
							user: call.session.remote_identity.uri.user + '@' + call.session.remote_identity.uri.host,
							camera: camera ? true : false,
							video: video,
							audio: audiostreams.length ? audiostreams[0] : false
						});
					}}(call))
				);
				// Only remote stream is ready in this stage
				var video = peer.remoteDescription.sdp.split("m=video")[1];
				var	send = video && video.indexOf("a=sendrecv")!=-1 ? true : false;
				var	show = video && video.indexOf("a=sendonly")!=-1 ? true : false;
				me.oncall({
					name: e.data.session.remote_identity.display_name,
					user: e.data.session.remote_identity.uri.user + '@' + e.data.session.remote_identity.uri.host,
					call: call,
					video: send,
					show: show
				});
			}
		}
	});

	// Monitor incoming messages - both conference and common
	this.sip.on('newMessage',function(e){
		// Remote incoming message
		if(e.data && e.data.originator=='remote' && e.data.message) {
			var message = new IceSIP.Message(me,e.data.message.request.body);
			message.from = e.data.message.remote_identity.user + '@' + e.data.message.remote_identity.host;
			// Propagate to conference if it has conference header
			if(e.data.message.request.getHeader('X-IceWarp-Conference')) {
				var id = e.data.message.request.getHeader('X-IceWarp-Conference').match(/id=([0-9]+)/);
				if(id)
					message.conference_id = id[1];
				var data = e.data.message.request.getHeader('X-IceWarp-Message').split(',');
				var tmp = data.pop();
				do {
					if(tmp.indexOf("is_private=")===0)
						message.group = tmp=="is_private=0" ? true : false;
				//	else if(tmp.indexOf("to_id=")===0)
				//		message.to_id = tmp.substr(6);
					else if(tmp.indexOf("from_id=")===0)
						message.from_id = tmp.substr(8);
				} while(tmp=data.pop());
			}
			me.onmessage(message);
		}
	});

}

/* Static support method */

IceSIP.supported = function() {
	if(window.webkitAudioContext && navigator.webkitGetUserMedia || window.AudioContext && navigator.mozGetUserMedia) // Native support in Chrome or Firefox
		return true;
	else if(document.body && 'WebSocket' in window && 'ActiveXObject' in window) { // IE browser with WebSockets, check for plugin
		var supported = false;
		try {
			if(new ActiveXObject('Tem.TemWebRTCPlugin'))
				supported = true;
		} catch(e) {}
		return supported; 
	} else if(window.webkitAudioContext && !(window.webkitRTCPeerConnection||window.RTCPeerConnection)) { // WebKit engine without native support (Safari), check for plugin
		if(navigator.plugins && navigator.plugins.namedItem && navigator.plugins.namedItem('TemWebRTCPlugin'))
			return true;
		else
			return false;
	} else return false;
}

/* Check connected devices */

IceSIP.devices = function(callback) {
	if(window.MediaStreamTrack && MediaStreamTrack.getSources) {
		var media = {microphone: false, camera: false};
		MediaStreamTrack.getSources(function(sources){
			var i = sources.length;
			while(i--) {
				switch(sources[i].kind){
					case 'audio':
						media.microphone = true;
						break;
					case 'video':
						media.camera = true;
						break;
				}
			}
			callback(media);
		});
	} else callback({});
}

IceSIP.instantiated = false;

/* SIP connetion handling */

// Start SIP, ie register, login and be online
IceSIP.prototype.start = function() {
	this.sip.start();
}

// Stop SIP, ie unregister, logout and stay offline
IceSIP.prototype.stop = function() {
	this.sip.stop();
}

// Temoporarily unregister (be offline)
IceSIP.prototype.unregister = function() {
	this.sip.unregister();
}

// Re-register after going offline
IceSIP.prototype.register = function() {
	this.sip.register();
}

// Force end calls
IceSIP.prototype.terminate = function() {
	for(var i in this.sip.sessions)
		this.sip.sessions[i].terminate();
}

// Check if SIP is online
IceSIP.prototype.online = function() {
	return this.sip.isConnected() && this.sip.isRegistered();
}

// Check if SIP is ready to make or accept calls
IceSIP.prototype.busy = function() {
	return !this.sip.isConnected() || !this.sip.isRegistered() || this.activity!='ready';
}

IceSIP.prototype.onconnect = function(e) {
	// Abstract method
	console.warn('No handler assigned: Connected to '+e.host);
	// You are connected to host
}

IceSIP.prototype.ondisconnect = function(e) {
	// Abstract method
	console.warn('No handler assigned: Disconnected');
	// Connection was lost
}

IceSIP.prototype.onmedia = function(e) {
	// Abstract method
	console.warn('No handler assigned: Media');
	// Asking for or granted access to media
}

/* SIP Phone, Call handling */

IceSIP.Call = function(gear,session) {
	this.sip = gear.sip;
	this.state = session ? 'Ringing' : 'Calling';
	this.sip.activity = this.state;
	this.incoming = !!session;
	this.session = session;
	this.sip.type = 'Phone';
}

// Make an outgoing call
IceSIP.Call.prototype.make = function(address,bVideo,bScreen) {
	var me = this;

	var mc = {audio: true, video: bVideo || false};
	if(bScreen)
		mc.screen = true;

	var oc = bScreen ? {
		optional: [],
		mandatory: { 
			OfferToReceiveAudio: true,
			OfferToReceiveVideo: false
		}
	} : undefined;

	this.sip.call('sip:'+address,{eventHandlers: {
		progress: function(e) {
			me.session = e.sender;
			me.state = 'Calling';
			me.oncalling({
				call: me.session,
				name: me.session.remote_identity.display_name,
				user: me.session.remote_identity.uri.user + '@' + me.session.remote_identity.uri.host
			});
		},
		connecting: function(e) {
			// Have media access
		},
		failed: function(e) {
			me.state = 'Failed';
			me.sip.activity = 'Ready';
			me.onhangup({reason: e.data && e.data.cause ? e.data.cause : 'Unknown', remote: e.data.originator=='remote'});
		},
		started: function(e) {
			me.session = e.sender;
			if(me.session && me.session.remote_identity) {
				me.state = 'Talking';
				me.sip.activity = 'Talking';
				// Sort remote streams
				var streams = me.session.getRemoteStreams(),
					videostreams = [],
					audiostreams = [];
				for(var i in streams) {
					if(streams[i].getVideoTracks()[0])
						videostreams.push(streams[i]);
					else
					if(streams[i].getAudioTracks()[0])
						audiostreams.push(streams[i]);
				}
				// Handle local streams
				var localstream = me.session.getLocalStreams();
				var camera = localstream.length && localstream[0].getVideoTracks().length && !mc.screen;

				var remote = false,
					local = false;

				var audio = false;

				if(audiostreams.length) {
					if(JsSIP.WebRTC.Plugin) {
						// Add remote audio to page
						var elmId = 'WebRTCPluginAudio' + Math.random().toString(36).slice(2);
						var elm = document.createElement('div');
						elm.innerHTML = '<object id="' + elmId + '" type="application/x-temwebrtcplugin">' +
							'<param name="pluginId" value="' + elmId + '" /> ' +
							'<param name="pageId" value="' + JsSIP.WebRTC.PlugId + '" /> ' +
							'<param name="windowless" value="true" /> ' +
							'<param name="streamId" value="' + audiostreams[0].id + '" /> ' +
							'<param name="tag" value="audio" /> ' +
						'</object>';
						audio = elm.firstChild;
						document.body.appendChild(audio);
						audio.play();
						// Latest version of plugin defaults audio tracks to disabled
						audiostreams[0].getAudioTracks()[0].enabled = true;
					} else {
						me.session.audio = audio = new Audio();
					//	me.session.audio.srcObject = audiostreams[0];
						me.session.audio.src = window.URL.createObjectURL(audiostreams[0]);
						me.session.audio.play();
					}
				} else if(videostreams.length) {
					if(JsSIP.WebRTC.Plugin) {
						// Add remote video to page
						var elmId = 'WebRTCPluginVideo' + Math.random().toString(36).slice(2);
						var elm = document.createElement('div');
						elm.innerHTML = '<object id="' + elmId + '" type="application/x-temwebrtcplugin">' + 
							'<param name="pluginId" value="' + elmId + '" /> ' + 
							'<param name="pageId" value="' + JsSIP.WebRTC.PlugId + '" /> ' + 
							'<param name="windowless" value="true" /> ' + 
							'<param name="streamId" value="' + videostreams[0].id + '" /> ' + 
							'<param name="tag" value="video" /> ' +
						'</object>';
						remote = elm.firstChild;
						// Add own camera element to page
						var elmId = 'WebRTCPluginCamera' + Math.random().toString(36).slice(2);
						var elm = document.createElement('div');
						elm.innerHTML = '<object id="' + elmId + '" type="application/x-temwebrtcplugin">' + 
							'<param name="pluginId" value="' + elmId + '" /> ' + 
							'<param name="pageId" value="' + JsSIP.WebRTC.PlugId + '" /> ' + 
							'<param name="windowless" value="true" /> ' + 
							'<param name="streamId" value="' + localstream[0].id + '" /> ' + 
							'<param name="tag" value="video" /> ' +
						'</object>';
						local = elm.firstChild;
						// Latest version of plugin defaults audio tracks to disabled, must be enabled after object element is inserted
						if(videostreams[0].getAudioTracks().length)
							setTimeout((function(audio){
								return function(){ audio.enabled = true; }
							})(videostreams[0].getAudioTracks()[0]),0);
					} else {
						remote = document.createElement('video');
						remote.autoplay = true;
						remote.src = window.URL.createObjectURL(videostreams[0]);
						if(camera) {
							local = document.createElement('video');
							local.autoplay = true;
							local.muted = true;
							local.src = window.URL.createObjectURL(localstream[0]);
						}
					}
				}

				var video = remote || local ? {remote: remote, local: camera ? local : false} : false;
				me.peer = me.session.rtcMediaHandler.peerConnection;
				me.onanswer({
					name: me.session.remote_identity.display_name,
					user: me.session.remote_identity.uri.user + '@' + me.session.remote_identity.uri.host,
					camera: camera ? true : false,
					video: video,
					audio: audiostreams.length ? audiostreams[0] : false
				});
			}
		},
		ended: function(e) {
			me.state = 'Ended';
			me.sip.activity = 'Ready';
			if(me.session.audio)
				me.session.audio.pause();
			me.onhangup({reason: 'Ended', remote: e.data.originator=='remote'});
		},
		newDTMF: function(e) {
			if(e.data.originator=='remote')
				me.ondial({tone: e.data.dtmf.tone});
		}
	},
	mediaConstraints: mc,
	RTCOfferConstraints: oc
	});
}

// Answer to an incoming call
IceSIP.Call.prototype.answer = function(bShow) {
	if(this.sip.isConnected() && this.sip.isRegistered() && this.session) {
		// Always send audio
		var mc = {audio: true};
		// Only send video back if it's not a presentation
		if(bShow)
			mc.video = false;

		this.session.answer({
			mediaConstraints: mc
		});
		return true;
	} else
		return false;
}

// Decline an incoming call
IceSIP.Call.prototype.decline = function() {
	if(this.sip.isConnected() && this.sip.isRegistered() && this.session)
		this.session.terminate();
	else
		return false;
}

// Dial numbers via keypad
IceSIP.Call.prototype.dial = function(n,bInband) {
	if(this.sip.isConnected() && this.sip.isRegistered() && this.session && /^[*0-9#]+$/.test(n)) {
		var streams = this.session.getLocalStreams();
		var audio = streams.length && streams[0].getAudioTracks() || null;
		if(bInband && audio && this.peer && this.peer.createDTMFSender) {
			var dtmf = this.peer.createDTMFSender(audio[0]);
			dtmf.ontonechange = function(e){
				if(e.tone) console.log('Sending DTMF over RTP: ',e.tone);
			}
			if(dtmf.canInsertDTMF)
				dtmf.insertDTMF(n);
		} else
			this.session.sendDTMF(n);
	}
}

// Mute user (silence outgoing stream)
IceSIP.Call.prototype.mute = function(mute) {
	if(this.session) {
		var streams = this.session.getLocalStreams();
		for(var i in streams) {
			var mic = streams[i].getAudioTracks() && streams[i].getAudioTracks().length && streams[i].getAudioTracks()[0];
			if(mic) {
				mic.enabled = !mute;
				return true;
			}
		}
		return false;
	} else
		return false;
}

// Hang up a call, regardless on incoming or outgoing
IceSIP.Call.prototype.hangup = function(code) {
	if(this.sip.isConnected() && this.sip.isRegistered() && this.session) {
		this.state = 'Ended';
		this.sip.activity = 'Ready';

		if(this.session.audio)
			this.session.audio.pause();

		if(code)
			this.session.terminate({status_code: code});
		else
			this.session.terminate();
	}
}

// Add video to an ongoing call
IceSIP.Call.prototype.camera = function(conference_id,data) {
	var me = this;

	var constraints = {
		audio: true, video: true
	};

	// Add new mediastream
	var addStream = function(stream) {
		me.session.rtcMediaHandler.addStream(stream);
	}

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

}


IceSIP.Call.prototype.ondial = function(e) {
	// Abstract method
	console.warn('No handler assigned: '+e.number+' was dialed');
	// You are connected to host
}

IceSIP.Call.prototype.onanswer = function(e) {
	// Abstract method
	console.warn('No handler assigned: '+e.user+' has picked up');
	// Outgoing call was answered
}

IceSIP.Call.prototype.ondecline = function(e) {
	// Abstract method
	console.warn('No handler assigned: '+e.user+' has declined call');
	// Outgoing call was declined
}

IceSIP.Call.prototype.oncalling = function(e) {
	// Abstract method
	console.warn('No handler assigned: you are calling '+e.user);
	// Outgoing call was terminated
}

IceSIP.Call.prototype.onhangup = function(e) {
	// Abstract method
	console.warn('No handler assigned: '+e.user+' has hanged up');
	// Outgoing call was terminated
}

/* Conference */

IceSIP.Conference = function(gear,session) {
	// Internal data
	this.sip = gear.sip;
	this.state = 'Calling';
	this.sip.activity = this.state;
	this.session = session;
	this.sip.type = 'Conference';
	// External reference
	IceSIP.Conference.current = this;
	// Configuration parameters
	this.microphone = true;
	this.tracking = '';
}

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

	this.sip.call('sip:'+conference_id,{
		eventHandlers: {
			progress: function(e) {
				me.state = 'Ringing';
			},
			failed: function(e) {
				me.state = 'Failed';
				me.sip.activity = 'Ready';
				me.onfailed({reason: e.data && e.data.cause ? e.data.cause : 'Unknown'});
			},
			started: function(e) {
				me.session = e.sender;
				if(me.session && me.session.remote_identity) {
					me.state = 'Meeting';
					me.sip.activity = 'Meeting';

					var streams = me.session.getRemoteStreams(),
						videostreams = [],
						audiostreams = [];
					for(var i in streams) {
						if(streams[i].getVideoTracks()[0])
							videostreams.push(streams[i]);
						else
						if(streams[i].getAudioTracks()[0])
							audiostreams.push(streams[i]);
					}

					var audio = false;

					if(audiostreams.length) {
						if(JsSIP.WebRTC.Plugin) {
							// Keep stream
							me.audio = audiostreams[0];
							// Add remote audio to page
							var elmId = 'WebRTCPluginAudio' + Math.random().toString(36).slice(2);
							var elm = document.createElement('div');
							elm.innerHTML = '<object id="' + elmId + '" type="application/x-temwebrtcplugin">' +
								'<param name="pluginId" value="' + elmId + '" /> ' +
								'<param name="pageId" value="' + JsSIP.WebRTC.PlugId + '" /> ' +
								'<param name="windowless" value="true" /> ' +
								'<param name="streamId" value="' + audiostreams[0].id + '" /> ' +
								'<param name="tag" value="audio" /> ' +
							'</object>';
							audio = elm.firstChild;
							document.body.appendChild(audio);
							audio.play();
							// Latest version of plugin defaults audio tracks to disabled
							audiostreams[0].getAudioTracks()[0].enabled = true;
							me.session.audio = audio;
						} else {
							me.session.audio = audio = new Audio();
							me.session.audio.src = window.URL.createObjectURL(audiostreams[0]);
							me.session.audio.play();
						}
					}

					me.peer = me.session.rtcMediaHandler.peerConnection;
					me.onjoined({
						audio: !!audiostreams.length,
						callid: me.session.request.call_id
					});
				}
			},
			ended: function(e) {
				me.state = 'Ended';
				me.sip.activity = 'Ready';
				if(me.session.audio)
					me.session.audio.pause();
				me.onended({reason: 'Ended'});
			},
		//	newDTMF: function(e) {
		//		console.warn("DTMF",e);
		//	},
			newInfo: function(e) {
				me.oninfo({
					message: e.data.request.body,
					mimetype: e.data.request.getHeader('content-type')
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

}

// Screen sharing functionality for Conference

IceSIP.Sharing = function(conference) {
	this.sip = conference.sip;
	this.conference_id = conference.full_id;
	conference.share = this;
	this.reference = conference.session.dialog.id.call_id;
	this.live = false;
}

// Join an ongoing screen sharing session
IceSIP.Sharing.prototype.join = function() {
	this.screen(true);
}

// Start sharing screen
IceSIP.Sharing.prototype.screen = function(bReceive) {
	var me = this;

	var conference_id = this.conference_id;
	var id = conference_id.match(/^conference\*([0-9]+)/);
	id = id.length ? id[1] : 'null';

	var mc = {audio: false, video: false};
	if(!bReceive)
		mc.screen = true;

	var oc = navigator.browser && navigator.browser.engine=='Gecko' ? 
		// Latest W3C standard changed options syntax
		{offerToReceiveAudio: false,offerToReceiveVideo: !mc.screen} :
		// Older Chrome and the plugin still rely on old syntax
		{
			optional: [],
			mandatory: { 
				OfferToReceiveAudio: false,
				OfferToReceiveVideo: !mc.screen
		}
	};

	var guest = window.sPrimaryAccountGUEST ? {
		email: dataSet.get('main',['user']),
		name: dataSet.get('main',['fullname'])
	} : false;

	this.sip.call('sip:'+this.conference_id,{
		eventHandlers: {
			progress: function(e) {

			},
			failed: function(e) {
				// Screen shaing failed
				me.onfailed({reason: e.data && e.data.cause ? e.data.cause : 'Unknown'});
			},
			started: function(e) {
				me.session = e.sender;
				if(me.session && me.session.remote_identity) {

					var streams = me.session.getRemoteStreams(),
						videostreams = [];
					for(var i in streams) {
						if(streams[i].getVideoTracks()[0])
							videostreams.push(streams[i]);
					}

					var video = false;
					if(videostreams.length) {
						if(JsSIP.WebRTC.Plugin) {
							var elmId = 'WebRTCPluginVideo' + Math.random().toString(36).slice(2);
							var elm = document.createElement('div');
							elm.innerHTML = '<object id="' + elmId + '" type="application/x-temwebrtcplugin">' + 
								'<param name="pluginId" value="' + elmId + '" /> ' + 
								'<param name="pageId" value="' + JsSIP.WebRTC.PlugId + '" /> ' + 
								'<param name="windowless" value="true" /> ' + 
								'<param name="streamId" value="' + videostreams[0].id + '" /> ' + 
								'<param name="tag" value="video" /> ' +
							'</object>';
							video = elm.firstChild;
						} else {
							video = document.createElement('video');
							video.autoplay = true;
							video.src = window.URL.createObjectURL(videostreams[0]);
						}
					} else {
						var local = me.session.getLocalStreams();
						if(local.length && local[0].getVideoTracks().length)
							local[0].getVideoTracks()[0].onended = function(e){
								if(me.live) {
									me.live = false;
									me.session.terminate();
								}
							}
					}

					me.peer = me.session.rtcMediaHandler.peerConnection;
					// Screen sharing started
					me.onstarted({
						video: video
					});

					me.live = true;
				}
			},
			ended: function(e) {
				// Screen sharing ended, onstopped?
				me.onended({reason: 'Ended'});
			}
		}, 
		mediaConstraints: mc,
		RTCOfferConstraints: oc,
		extraHeaders: [
			'X-IceWarp-Conference: id='+id,
			'X-IceWarp-Reference: callid='+me.reference
		],
		guest: guest
	});

}

// End screen sharing
IceSIP.Sharing.prototype.stop = function() {
	this.live = false;

	if(this.session)
		this.session.terminate();
}

// Conference mute is identical to call mute
IceSIP.Conference.prototype.mute = IceSIP.Call.prototype.mute;

// Conference silence loudspeakers
IceSIP.Conference.prototype.silence = function(quiet) {
	if(this.session && this.session.audio)
		this.session.audio.muted = quiet;
}

// Leave conference
IceSIP.Conference.prototype.leave = function() {
	if(this.sip.isConnected() && this.session) {
		this.state = 'Ended';
		this.sip.activity = 'Ready';
		if(this.session.audio)
			this.session.audio.pause();
		// Terminate conference only if not already cancelled or terminated
		if(this.session.status!=JsSIP.RTCSession.C.STATUS_TERMINATED && this.session.status!=JsSIP.RTCSession.C.STATUS_CANCELED)
			this.session.terminate();
	}
	IceSIP.Conference.current = null;
}

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
}

// Incoming message, called by sip when message has icewarp header (private)
IceSIP.Conference.prototype.message = function(m) {
	if(IceSIP.Conference.current)
		IceSIP.Conference.current.onmessage(m);
}

IceSIP.Conference.prototype.onsent = function(e) {
	// Abstract method
	console.warn('No handler assigned: '+e.successful+' received');
	// User received a message
}

IceSIP.Conference.prototype.onmessage = function(e) {
	// Abstract method
	console.warn('No handler assigned: '+e.text+' received');
	// User received a message
}

IceSIP.Conference.prototype.oninfo = function(e) {
	// Abstract method
	console.warn('No handler assigned: '+e.message+' received');
	// Conference information sent
}

IceSIP.Conference.prototype.onjoined = function(e) {
	// Abstract method
	console.warn('No handler assigned: '+e.conference+' started');
	// User joined conference
}

IceSIP.Conference.prototype.onfailed = function(e) {
	// Abstract method
	console.warn('No handler assigned: '+e.conference+' failed');
	// User could not join conference
}

IceSIP.Conference.prototype.onended = function(e) {
	// Abstract method
	console.warn('No handler assigned: '+e.conference+' has ended');
	// Conference ended for this user
}

/* SIP Messages */

IceSIP.Message = function(connection,content) {
	this.sip = connection.sip;
	this.content = content;
}

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
}

IceSIP.Conference.prototype.onsent = function(e) {
	// Abstract method
	console.warn('No handler assigned: Message sent '+e.failed);
	// Message sending success
}

