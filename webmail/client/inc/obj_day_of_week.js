_me = obj_day_of_week.prototype;
function obj_day_of_week(){};

_me.__constructor = function() {
	var sOptName;

	this._aDays = {
		'sunday': 0,
		'monday': 1,
		'tuesday': 2,
		'wednesday': 3,
		'thursday': 4,
		'friday': 5,
		'saturday': 6
	};
	var aLabels = {
		'sunday': "DAYS::SUNDAY",
		'monday': "DAYS::MONDAY",
		'tuesday': "DAYS::TUESDAY",
		'wednesday': "DAYS::WEDNESDAY",
		'thursday': "DAYS::THURSDAY",
		'friday': "DAYS::FRIDAY",
		'saturday': "DAYS::SATURDAY"
	};
	storage.library('gw_others');
	// this is a bit tricky, don't try to understand it :-) (sets the start day of the week)
	var which = (7 - this._aDays[GWOthers.getItem('CALENDAR_SETTINGS','week_begins')]) % 7;

	for (var day in this._aDays) {
		sOptName = 'day_' + which;
		this._create(day, 'obj_checkbox', sOptName,'', aLabels[day]);
		which = (which + 1) % 7;
	}

	this._objects = getSubobjects(this, this._objects);
};

_me._value = function(v) {
	var n;

	if (Is.Defined(v)) {
		for (var i in this._objects) {
			n = Math.pow(2, this._aDays[i]);
			this._objects[i]._value(v&n);
		}
	} else {
		var nResult = 0;
		for (var i in this._objects) {
			if (this._objects[i]._value()) nResult |= Math.pow(2, this._aDays[i]);
		}
		return nResult;
	}
};

_me._disabled = function(b) {
	for (var i in this._objects) this._objects[i]._disabled(b);
};
