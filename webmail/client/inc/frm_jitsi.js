function frm_jitsi() {};

frm_jitsi.prototype.__constructor = function () {
	if (!sPrimaryAccountCONFERENCE) {
		return;
	}

	this._draw('frm_jitsi');
	this.focus._onclick = this._focus.bind(this);
	this.leave._onclick = this._close.bind(this);

	gui._obeyEvent('conference_started', [this, '_updateGUI']);
	gui._obeyEvent('conference_started', [this, '_createConferenceJournal']);
	gui._obeyEvent('conference_ended', [this, '_updateGUI']);

	addEventListener('message', function (event) {
		if (event.data.type === 'conference') {
			wm_conference.get(event.data.cid).receiveMessage(event);
		}
	}, false);

	var last_running_conference_timstamp = localStorage.getItem('last_running_conference_timestamp');
	if (last_running_conference_timstamp && last_running_conference_timstamp > (+new Date() - 10000)) {
		this.__brc = this._bindRunningConference.bind(this);
		addEventListener('click', this.__brc);
		addEventListener('keypress', this.__brc);
	}

	addEventListener('click', function (event) {
		var tmp;

		if (event.target.tagName === 'A' && (tmp = event.target.href.match(wm_conference.linkRegExp))) {
			event.preventDefault();
			event.stopPropagation();
			event.stopImmediatePropagation();

			wm_conference.get(tmp[2] + '_' + tmp[1]).join();
		}
	});
};

frm_jitsi.prototype._bindRunningConference = function () {
	removeEventListener('click', this.__brc);
	removeEventListener('keypress', this.__brc);
	this.window = window.open('', 'jitsi_' + sPrimaryAccount, 'menubar=no,location=no,scrollbars=no,status=no,width=100,height=100');
	try {
		if (this.window.document.body.innerHTML) {} else {
			this.window.close();
			this.window = null;
		}
	} catch (e) {}

	if (this.window) {
		var id = this.window.location.toString().split('/').pop().replace('#', '') + '_' + this.window.location.hostname;
		var conference = wm_conference.get(id);
		conference.window = this.window;

		conference.isRunning = true;
		dataSet.add('main', ['conference'], id);
		conference.postMessage({
			event: 'load'
		});
		conference.getDetail(function () {
			gui.__exeEvent('conference_started');
		});
	}
};

frm_jitsi.prototype._focus = function () {
	wm_conference.get(dataSet.get('main', ['conference'])).focus();
	gui.frm_main._selectView({
		aid: sPrimaryAccount,
		fid: '__@@VIRTUAL@@__/__@@MEETINGS@@__'
	});
	gui.frm_main.main._view('progress');
};

frm_jitsi.prototype._close = function () {
	wm_conference.get(dataSet.get('main', ['conference'])).close();
};

frm_jitsi.prototype._updateGUI = function () {
	var conference = wm_conference.get(dataSet.get('main', ['conference']));

	this.focus.__eIN.value = getLang('CONFERENCE::CONFERENCE_IN_PROGRESS', [conference.data.subject || conference.id || getLang('CONFERENCE::TITLE')]);
};

frm_jitsi.prototype._createConferenceJournal = function () {
	var conference = wm_conference.get(dataSet.get('main', ['conference']));
	var now = new IcewarpDate();
	var then = now.clone().add(30, 'minutes');
	var contacts = [];

	if (!conference) {
		return;
	}

	for (var i in conference.data.CONTACTS || []) {
		contacts.push(conference.data.CONTACTS[i]);
	}

	// create Journal entry
	WMItems.add(
		GWOthers.getItem('DEFAULT_FOLDERS', 'JOURNAL').split('/'), {
			values: {
				EVNTITLE: conference.data.subject,
				EVNNOTE: conference.data.EVNNOTE || ('<a href="' + conference.getLink() + '">' + getLang('CONFERENCE::LINK') + '</a>'),
				EVNDESCFORMAT: conference.data.EVNDESCFORMAT || 'text/html',
				EVNLOCATION: 'Conference|',
				EVNMEETINGID: conference.id.split(/[_@]/)[0],
				EVNFLAGS: 1,
				EVNSHARETYPE: 'U',
				EVNTIMEFORMAT: 'Z',
				_TZEVNSTARTDATE: now.format(IcewarpDate.JULIAN),
				_TZEVNSTARTTIME: now.format(IcewarpDate.JULIAN_TIME),
				_TZEVNENDDATE: then.format(IcewarpDate.JULIAN),
				_TZEVNENDTIME: then.format(IcewarpDate.JULIAN_TIME),
				_TZID: GWOthers.getItem('CALENDAR_SETTINGS', 'timezone')
			},
			CONTACTS: contacts.length ? contacts : void 0
		},
		'', '', '',
		[function (bOk, aData) {
			if (!bOk || !gui.socket) {
				return;
			}
			var f = dataSet.get('folders', [sPrimaryAccount, Mapping.getDefaultFolderForGWType('J')]);
			f && gui.socket.api._notify({
				ACTION: 'add',
				TYPE: 'item',
				ITEM: aData.id,
				FOLDER: f.RELATIVE_PATH,
				'FOLDER-TYPE': f.TYPE,
				EMAIL: sPrimaryAccount,
				'ITEM-TYPE': 'J'
			});
		}.bind(this)]
	);
};
