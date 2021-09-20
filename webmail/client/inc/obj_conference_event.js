_me = obj_conference_event.prototype;

function obj_conference_event() {};

_me.__constructor = function (aData) {
	this._draw('obj_conference_event', 'main', {
		text: JSON.stringify(aData),
		title: aData.EVNTITLE,
		in_progress: Math.random() > 0.5,
		datetime: this._getDateTime(aData),
		organiser: {
			avatar: getAvatarURL(aData.EVNOWNEREMAIL),
			name: getLang('CONFRENCE::ORGANISED_BY', [
				aData.EVNOWNEREMAIL
			])
		},
		ends_in: {
			time: 'Ends in 15 minutes',
			progress: 80
		},
		participants: 'Ja, Ty a On'
	});
	this._add_destructor('__destructor');
};

_me.__destructor = function () {

};

_me._getDateTime = function (aData) {
	return new IcewarpDate().format();
};
