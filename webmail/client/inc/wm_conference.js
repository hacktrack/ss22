function wm_conference(id, aData) {
	id = id || 'tmp';
	if (!~id.indexOf('_')) {
		id = id + '_' + location.hostname;
	}
	this.id = id;
	this.messageID = 1;
	this.messageCallbacks = {};
	this.data = aData || {};
	this.isRunning = false;
	wm_conference.conferences[id] = this;

	var windowExistsInterval = setInterval(function () {
		if (this.isRunning && (!this.window || this.window.closed)) {
			clearInterval(windowExistsInterval);
			this.close();
		}
	}.bind(this), 1000);

};

wm_conference.linkRegExp = /https?:\/\/([^\/]*)\/(?:conference\/|.*\?meeting=)([0-9]{5,})/;
wm_conference.conferences = {};

wm_conference.get = function (id, aData) {
	return wm_conference.conferences[id] || new wm_conference(id, aData);
};

wm_conference.create = function (callback, options) {
	options = options || {};

	icewarpapi.send({
		commandname: 'GWAddMeetingInfo',
		commandparams: {
			meetingtype: 'conference',
			organizer: sPrimaryAccount,
			summary: options.subject || '',
			password: options.password || '',
			folder: options.folder || ''
		}
	}, {
		success: function (response) {
			var conference = wm_conference.get(response.meetingid);
			Object.assign(conference.data, options);
			conference.getDetail(function () {
				callback(conference);
			});
		},
		error: function (error) {
			console.error('Unable to create conference', error);
		},
		context: this
	});
};

var _me = wm_conference.prototype;

_me.getDetail = function (callback) {
	icewarpapi.authenticate({
		success: function () {
			icewarpapi.send({
				commandname: 'GWGetMeetingInfo',
				commandparams: {
					meetingid: this.id
				}
			}, {
				success: function (response) {
					for (var i in response) {
						this.data[i] = response[i] || this.data[i];
					}
					this.data.organizer = this.data.organizer || sPrimaryAccount;

					callback(this.data);
				},
				error: function (error) {
					console.error('Unable to get conference detail', error);
				},
				context: this
			});
		},
		context: this
	});
};

_me.join = function () {
	if (this.isRunning) {
		return this.focus();
	}

	var conference = wm_conference.conferences[dataSet.get('main', ['conference'])];
	if (conference && conference.window) {
		gui.notifier._value({
			type: 'conference',
			args: {
				header: 'CONFERENCE::CANNOT_START_NEW',
				text: getLang('CONFERENCE::ALREADY_RUNNING')
			}
		});
		return conference.focus();
	}

	this.getDetail(function () {
		this.open();
	}.bind(this));
};

_me.invite = function (aRecipients) {
	gui.frm_main.im && (aRecipients || []).forEach(function (sRecipient) {
		gui.frm_main.im._send(sRecipient, getLang('CONFERENCE::CHATINVITE', [this.getLink()]), void 0, true);
	}, this);
};

_me.focus = function () {
	this.isRunning = true;
	this.window && !this.window.closed && this.window.focus();
};

_me.open = function () {
	this.window = open(
		this.getLink(),
		'jitsi_' + sPrimaryAccount,
		'menubar=no,location=no,resizable=yes,scrollbars=no,status=no'
	);

	this.isRunning = true;
};

_me.close = function () {
	this.isRunning = false;
	if (this.window && !this.window.closed) {
		this.postMessage({
			event: 'executeCommand',
			args: ['hangup']
		}, function () {
			this.window.close();
			this.window = null;
			dataSet.remove('main', ['conference']);
			gui.__exeEvent('conference_ended');
			gui.__exeEvent('conference_window_closed');
			delete wm_conference.conferences[this.id];
		}.bind(this));
	} else {
		dataSet.remove('main', ['conference']);
		gui.__exeEvent('conference_ended');
		gui.__exeEvent('conference_window_closed');
		delete wm_conference.conferences[this.id];
	}
};

_me.postMessage = function (data, callback) {
	if (!this.window || this.window.closed) {
		return;
	}

	if (callback) {
		this.messageCallbacks[this.messageID] = callback;
	}

	data.cid = this.id;
	data.mid = this.messageID++;
	this.window.postMessage(data, '*');
};

_me.receiveMessage = function (event) {
	switch (event.data.event) {
		case 'readyToClose':
			setTimeout(function () {
				this.close();
			}.bind(this), 500);
			break;

		case 'setup':
			this.postMessage({
				event: 'setup',
				data: {
					session: dataSet.get('main', ['sid']),
					password: this.data.password,
					language: (GWOthers.getItem('LAYOUT_SETTINGS', 'language') || navigator.language || navigator.userLanguage).split(/[_-]/)[0]
				}
			});
			break;

		case 'load':
			dataSet.add('main', ['conference'], this.id);
			Object.assign(this.data, event.data.data);
			this.isRunning = true;
			this.window = event.source;
			this.getDetail(function () {
				gui.__exeEvent('conference_started');
			}.bind(this));
			break;

		default:
			//participantRoleChanged participantJoined participantLeft
			gui.__exeEvent('conference_event', event.data);

	}

	if (event.data.mid && this.messageCallbacks[event.data.mid]) {
		this.messageCallbacks[event.data.mid](event.data.data);
		delete this.messageCallbacks[event.data.mid];
	}
};

_me.getLink = function () {
	var ids = this.id.split(/[_@]/);
	var host = ids[1] ? 'https://' + ids[1] : location.origin;

	return host + '/conference/' + ids[0];
};
