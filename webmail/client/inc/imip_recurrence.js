/* Support for iMip parsing - rfc 2445
 *
 *  - only able to handle a single rrule (standard allows multiple)
 *  - rdate, exrule and exdate are ignored (not currently supported)
 *  - currently does not consider BYSETPOS (full support for this would require expanding the set of dates) http://www.imc.org/ietf-calendar/mail-archive/msg01762.html
 *  - BYSECOND, BYMINUTE, BYHOUR are currently not regarded (time is not displayed)
 *
 * Martin Ekblom, Nov. 2012
 */
function iMipRecurrence(sRecurence,bgn,bTime,end) {
	var rules = sRecurence.split(';');
	for(var r in rules) {
		var rule = rules[r].split('=');
		if(rule[0] && rule[1]) this[rule[0].toLowerCase()] = rule[1];
	}
	if(this.freq && !this.interval) this.interval = 1;	// Interval is optional but defaults to 1
	if(bgn) this.start = bgn;
	if(end) this.end = end;
	this.withtime = bTime ? true : false;
}
// Parsing to human readable
iMipRecurrence.prototype.toString = function(date_format) {
	var str = '';
	if(this.start && this.end) {
		if(!this.withtime) {
			this.start.add(1, 'day');
		}
		var same_date = this.start.format('L') === this.end.format('L');
		str = getLang('RECURRENCE::TIME' + (same_date ? '_SAMEDATE' : ''), [this.start.format(date_format || 'L'), this.timeToString(), same_date ? '' : this.end.format(date_format || 'L'), this.withtime ? this.end.format('LT') : getLang('TIME_INTERVAL::ALL_DAY_EVENT')]);
	}

	if(!this.freq) {
		return str;
	}
	if(str) {
		str += '<br>';
	}

	switch(this.freq.toLowerCase()) {
		case 'secondly':
		case 'minutely':
		case 'hourly':
			str += getLang('DATES::' + this.freq + (this.interval > 1 ? '_N' : ''), [this.interval]);
			break;
		case 'daily':
			if(this.byday === 'MO,TU,WE,TH,FR') {
				str += getLang('RECURRENCE::DAILY_WORKDAYS');
			} else if(this.byday === 'SU,SA') {
				str += getLang('RECURRENCE::DAILY_WEEKENDS');
			} else {
				str += getLang('RECURRENCE::DAILY' + (this.interval > 1 ? '_N' : ''), [this.interval]);
			}
			break;
		case 'weekly':
			str += getLang('RECURRENCE::WEEKLY' + (this.interval > 1 ? '_N' : ''), [this.interval, this.localizedByDay()]);
			break;
		case 'monthly':
			str += getLang('RECURRENCE::MONTHLY' + (this.interval > 1 ? '_N' : ''), [this.interval, this.localizedByDay(), this.localizedByMonthDay()]);
			break;
		case 'yearly':
			str += getLang('RECURRENCE::YEARLY' + (this.interval > 1 ? '_N' : ''), [this.interval, this.localizedByDay(), this.localizedByMonth(), this.localizedByWeekNo(), this.localizedByYearDay()]);
	}

	if (this.until) {
		str += ' ' + getLang('RECURRENCE::UNTIL', [new IcewarpDate(this.until).format('L')]);
	} else if (this.count) {
		str += ', ' + getLang('RECURRENCE::TIMES' + (this.count > 1 ? '_N' : ''), [this.count]);
	}

	return str;
};

iMipRecurrence.prototype.timeToString = function () {
	if (!this.withtime && !this.byhour && !this.byminute) {
		return '';
	}

	// Use DTSTART if no BY... rule applies
	var hour = this.start.hour(),
			minute = this.start.minute(),
			ms = new IcewarpDate(+this.start),
			at = [],
			tmp = [];

	// Parse hour, each value will set a time or fallback on dtstart hour
	if (this.byhour) {
		var hours = this.byhour.split(',');
		for (var h in hours) {
			tmp.push(ms.clone().hour(hours[h]));
		}
	} else {
		tmp.push(ms.clone().hour(hour));
	}

	// Parse minute, each value will set a time or fallback on dtstart minute
	if (this.byminute) {
		var minutes = this.byminute.split(',');
		for (var t in tmp) {
			for (var m in minutes) {
				at.push(tmp[t].clone().minute(minutes[m]));
			}
		}
	} else {
		for (var t in tmp) {
			at.push(tmp[t].clone().minute(minute));
		}
	}

	for (var a in at) {
		at[a] = at[a].format('LT');
	}
	var tmp = at.pop();
	return (at.length ? at.join(', ') + ' ' + getLang('DATES::AND') : '') + ' ' + tmp;
};

// BYDAY, somewhat more complex than others, MO on monday, 1MO on first monday, -1MO last monday
iMipRecurrence.prototype.localizedByDay = function() {
	if(!this.byday) {
		return '';
	}
	var byday = this.byday;
	var numbers = byday.match(/[+-]?\d+/g);
	if(numbers && !numbers.some(function(number) {
		return number !== numbers[0];
	})) {
		byday = numbers[0] + byday.replace(new RegExp(numbers[0], 'g'), '');
	}
	var re = /([+-]?)(\d?)(\w+)/;
	var on = [];
	var days = this.sortWeekDays(byday);
	for (var d in days) {
		var m = days[d].match(re);
		m && on.push(getLang('RECURRENCE::' + (iMipRecurrence.week[m[3]] || m[3]) + (m[2] ? '_' + (m[1] === '-' ? '-' : '') + (m[2] < 5 && m[2] > -2 ? m[2] : 'N') : '')));
	}
	var tmp = on.pop();
	return (on.length ? on.join(', ') + ' ' + getLang('DATES::AND') + ' ' : '') + tmp;
};

iMipRecurrence.prototype.sortWeekDays = function (weekdays) {
	weekdays = (weekdays || this.byday).replace(/([+-]?\d*)S[AU],(.*)[+-]?\d*S[AU]/, '$1WEEKEND,$2').replace(/([+-]?\d*)MO,[+-]?\d*TU,[+-]?\d*WE,[+-]?\d*TH,[+-]?\d*FR/, '$1WORKWEEK').replace(/([+-]?\d*)WEEKEND,WORKWEEK/, '$1DAY');
	if (!weekdays) {
		return [];
	}
	weekdays = weekdays.split(',').filter(Boolean);
	weekdays_clean = weekdays.map(function(weekday) {
		return weekday.replace(/[+-]?\d*/, '');
	});

	var week_begins = {sunday: 0, monday: 2, tuesday: 3, wednesday: 4, thursday: 5, friday: 6, saturday: 8}[GWOthers.getItem('CALENDAR_SETTINGS', 'week_begins')];

	var a = ['SU', 'WEEKEND', 'MO', 'TU', 'WE', 'TH', 'FR', 'WORKWEEK', 'SA', 'DAY'];
	var ret = [];
	for (var i = 0; i < a.length; i++) {
		var key = ((week_begins + i) % a.length);
		var index = weekdays_clean.indexOf(a[key]);
		if (~index) {
			ret.push(weekdays[index]);
		}
	}
	return ret;
};

// BYWEEKNO -53≤x≤53 and x≠0; Negative week numbers unlikely to be commonly used, minus sign kept to indicate reversity
iMipRecurrence.prototype.localizedByWeekNo = function() {
	if(!this.byweekno) {
		return '';
	}
	var weeks = this.byweekno.split(',');
	var tmp = weeks.pop();
	return getLang('RECURRENCE::ONWEEKNO' + (weeks.length ? '_N' : ''), [(weeks.length ? weeks.join(', ') + ' ' + getLang('DATES::AND') + ' ' : '') + tmp]);
};

// BYMONTH 1≤x≤12, negative values not allowed
iMipRecurrence.prototype.localizedByMonth = function() {
	if(!this.bymonth) {
		return '';
	}
	var months = this.bymonth.split(',');
	var on = [];
	for(var m in months) {
		on.push(getLang('RECURRENCE::' + iMipRecurrence.month[months[m] - 1]));
	}
	var tmp = on.pop();
	return (on.length ? on.join(', ') + ' ' + getLang('DATES::AND') + ' ' : '') + tmp;
};

// BYMONTHDAY -31≤x≤31 and x≠0
iMipRecurrence.prototype.localizedByMonthDay = function() {
	if(!this.bymonthday) {
		return '';
	}
	var days = this.bymonthday.split(',');
	var tmp = days.pop();
	return getLang('RECURRENCE::ONMONTHDAY' + (days.length ? '_N' : ''), [(days.length ? days.join(', ') + ' ' + getLang('DATES::AND') + ' ' : '') + tmp]);
};

// BYYEARDAY -366≤x≤366 and x≠0; simplified parsing, unlikely to be used often
iMipRecurrence.prototype.localizedByYearDay = function() {
	if(!this.byyearday) {
		return '';
	}
	var days = this.byyearday.split(',');
	var tmp = days.pop();
	return getLang('RECURRENCE::ONYEARDAY' + (days.length ? '_N' : ''), (days.length ? days.join(', ') + ' ' + getLang('DATES::AND') + ' ' : '') + tmp);
};

iMipRecurrence.week = {MO: 'MONDAY', TU: 'TUESDAY', WE: 'WEDNESDAY', TH: 'THURSDAY', FR: 'FRIDAY', SA: 'SATURDAY', SU: 'SUNDAY'};
iMipRecurrence.month = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];

iMipRecurrence.prototype.toDates = function() {
	// Not implemented
};
