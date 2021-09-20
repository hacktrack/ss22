_me = obj_conference_progress.prototype;

function obj_conference_progress() {};

_me.__constructor = function () {

	this.__opt = {
		participant_delay: 1000,
		show_all: false,
		back_button: getLang('CONFERENCE::BACK_TO_MAIN')
	};

	this.__init();
	this.__getParticipants(this.__opt.participant_delay, [this, '__updateParticipants']);
	this._add_destructor('__destructor');
};

_me.__destructor = function(){
	clearTimeout(this.__initTimeout);
	gui._disobeyEvent('conference_event', [this, '__updateEvent']);
};

_me.__getParticipants = function(iDelay, aHandler){
	clearTimeout(this.__initTimeout);

	this.__initTimeout = setTimeout(function(){
		var conference = wm_conference.get(dataSet.get('main',['conference']));

		if(!conference.data.server) {
			return this.__getParticipants(iDelay, aHandler);
		}
		getRemoteFileContent(conference.data.server + '/room?' + buildURL({
			token: conference.data.jwt,
			room: conference.data.roomname
		}), function (str) {
			//200 OK
			if (str){
				try{
					this.__participants = JSON.parse(str) || [];
				}
				catch(r){
					console.error('obj_conference_progress', 'unable to load participants list');
					this.__participants = [];
				}

				if(!this.__participants.length) {
					return this.__getParticipants(iDelay, aHandler);
				}

				executeCallbackFunction(aHandler);
			}
			//404
			else if (!this._destructed) {
				this.__getParticipants(iDelay, aHandler);
			}
		}.bind(this));
	}.bind(this),
	iDelay || 0);
};

_me.__init = function(){
	var conference = wm_conference.get(dataSet.get('main',['conference']));

	this._draw('obj_conference_progress','cell');
	this._create('loader', 'obj_loader', 'list');

	this._create('scrollbar','obj_scrollbar')._scrollbar(this._main.querySelector('div.scroll'), this._main);

	this._getAnchor('title').textContent = conference.data.subject || getLang('CONFERENCE::UNSCHEDULED');
	if (conference.data.password) {
		this.MEETING_PASSWORD._value(conference.data.password);
		this.MEETING_PASSWORD.__setMask({
				'toggle': ['', getLang('COMMON::SHOW'), 2]
			},
			[function () {
				if (this.MEETING_PASSWORD.__eIN.getAttribute('type') === 'text') {
					this.MEETING_PASSWORD.__eIN.setAttribute('type', 'password');
				} else {
					this.MEETING_PASSWORD.__eIN.setAttribute('type', 'text');
				}
			}.bind(this)]
		);
	} else {
		this._getAnchor('password_wrapper').parentNode.removeChild(this._getAnchor('password_wrapper'));
	}

	if(conference.data.startdate != 0) {
		var sd = conference.data.startdate,
			st = conference.data.starttime,
			ed = conference.data.enddate,
			et = conference.data.endtime,
			start = IcewarpDate.julian(sd, st),
			end = IcewarpDate.julian(ed, et);

		//Allday
		if (st<0){
			if (sd == ed){
				this._getAnchor('date').textContent = CalendarFormatting.normal(start);
			}
			else{
				this._getAnchor('date').textContent = start.format('L') + ' - ' + end.format('L');
			}
		}
		else{
			this._getAnchor('date').textContent = CalendarFormatting.normalWithTime(start);
			if (sd < ed){
				this._getAnchor('date').textContent += ' - ' + CalendarFormatting.normalWithTime(end);
			} else{
				this._getAnchor('date').textContent += ' - ' + end.format('LT');
			}
		}
	}
	else
	if (!conference.data.subject) {
		this._getAnchor('date').textContent = conference.id;
	}

	this.avatar._value(conference.data.organizer);

	if (conference.data.organizer === sPrimaryAccount){
		this._getAnchor('organiser').innerHTML = getLang('CONFERENCE::YOU_ORGANISER');
	}
	else{
		WMItems.list({"aid": sPrimaryAccount, "fid": '__@@ADDRESSBOOK@@__', filter: {search: 'email:"' + conference.data.organizer + '"'}, values: ['ITMCLASSIFYAS']}, '', '', '', [
			function (aData) {

				if (aData && (aData = aData[sPrimaryAccount]) && (aData = aData['__@@ADDRESSBOOK@@__'])) {
					var name, i;
					for(i in aData) {
						if(aData[i].LCTTYPE === 'H') {
							name = aData[i].ITMCLASSIFYAS;
							break;
						}
					}
				}

				this._getAnchor('organiser').innerHTML = getLang('CONFERENCE::IS_ORGANISER',['<span class="progress-link">' + (name || conference.data.organizer).escapeHTML() + '</span>']);
				this._getAnchor('organiser').querySelector(".progress-link").onclick = function(e){
					var e = e || window.event;

					this.avatar._menu();

					if (e.preventDefault) e.preventDefault();
					e.cancelBubble=true;
					return false;
				}.bind(this);

			}.bind(this)
		]);
	}

	//bind
	gui._obeyEvent('conference_event', [this, '__updateEvent']);

	//Show All button
	this._getAnchor('show').onclick = function(){
		if (!this.__opt.show_all){
			this.__opt.show_all = true;
			removecss(this._main, 'show_all');
		}
	}.bind(this);

	//Action buttons
	this.btn_link._onclick = function(){
		toClipboard(conference.getLink());
	}.bind(this);


	this.btn_share._onclick = function(){

		//get 1st room in the tree
		var sFolder, f = dataSet.get('folders', [sPrimaryAccount]);
		for(var id in f){
			if (f[id].TYPE == 'I'){
				sFolder = id;
				break;
			}
		}

		if (sFolder){
			var frm = gui._create('frm_select_folder', 'frm_select_folder', '', 'frm_select_folder-conference', 'CHAT::SELECT', sPrimaryAccount, sFolder,
				[
					function (aid, sFolder) {
						var sBody = getLang('CONFERENCE::CHATINVITE', [conference.getLink()]);
						if (frm.pass && frm.pass._checked()){
							sBody += "\r\n" + getLang('CONFERENCE::CONFERENCE_PASSWORD', [conference.data.password]);
						}

						Item.message_tch(sFolder, sBody);
					}
				], true, true, ['Y', 'I'], '', true
			);

			if (conference.data.password)
				frm._create('pass', 'obj_checkbox', {
					target: 'footer',
					first: true
				}, 'pass-conference', 'CONFERENCE::INCLUDE_PASSWORD');
		}

	}.bind(this);


	this.btn_send._onclick = function(){
		var sBody = conference.getLink();
		if (conference.data.password){
			sBody += '<br>' + getLang('CONFERENCE::CONFERENCE_PASSWORD', [conference.data.password]);
		}

		NewMessage.compose({mailBody: sBody});

	}.bind(this);
};

_me.__updateParticipants = function(){

	//Show All button
	if (this.__participants.length>5){
		!this.__opt.show_all && addcss(this._main, 'show_all');
	}
	else{
		removecss(this._main, 'show_all');
	}

	//List of participants
	var eList = this._getAnchor('list');
	while (eList.firstChild) {
		eList.removeChild(eList.lastChild);
	}

	this.__participants.sort(function(a,b){
		return (a.display_name || a.email).localeCompare(b.display_name || b.email, undefined, {
				numeric: true,
				sensitivity: 'base'
		});
	}).forEach(function(user){
		var elm = mkElement('div','',null,[
			mkElement('span', {class:'avatar', style:'background-image: url("' + getAvatarURL(user.email) + '")'}),
			mkElement('span',{class:'name', text:user.display_name || user.email})
		]);
		eList.appendChild(elm);
	}.bind(this));
};

_me.__updateEvent = function(data){
	switch(data.event){
		case 'participantJoined':
		case 'participantLeft':
			this.__getParticipants(0, [this, '__updateParticipants']);
			break;
	}
};
