_me = frm_main_calendar_dayweek.prototype;
function frm_main_calendar_dayweek() {};

_me.__constructor = function () {
	var me = this;

	this.__step = 0;

	var wwbegin = parseInt(GWOthers.getItem('CALENDAR_SETTINGS', 'workweek_begins'));
	var wwends = parseInt(GWOthers.getItem('CALENDAR_SETTINGS', 'workweek_ends'));
	if (wwbegin && wwends) {
		this.__workweeklength = wwbegin > wwends ? 8 - wwbegin + wwends : wwends - wwbegin + 1;
		this.__workweekstarts = (new IcewarpDate()).day(wwbegin).weekday(); // convert work week begin from iso to custom
	}

	this._create('inp_calendar', 'obj_input_calendar', 'slot1', 'noborder bold', '', true, {week:true});
	this.inp_calendar._ondateselect = function () {
		if (this._value() != me.__date.format(IcewarpDate.JULIAN)) {
			me._setDate((new IcewarpDate(this._value(), {format: IcewarpDate.JULIAN})), me.__step, me.__workweek);
			me._serverSort();
		}
	};

	this.previous._onclick = function () {
		var range = me.calendar._range();

		// Set calender to jump back number of days or whole week
		var dStart = range['start'] - (me.__workweek ? 7 : me.__step);
		me.calendar._range(dStart, range['end'] - (me.__workweek ? 7 : me.__step));

		me._setDate(IcewarpDate.julian(dStart), me.__step, me.__workweek);
		me._serverSort();
	};
	this.next._onclick = function () {
		var range = me.calendar._range();

		// Set calender to jump forward number of days or whole week
		var dStart = range['start'] + (me.__workweek ? 7 : me.__step);
		me.calendar._range(dStart, range['end'] + (me.__workweek ? 7 : me.__step));

		me._setDate(IcewarpDate.julian(dStart), me.__step, me.__workweek);
		me._serverSort();
	};
	this.today._onclick = function () {
		me._setDate(new IcewarpDate(), me.__step, me.__workweek);
		me._serverSort();
	};

	this._main.querySelector('.frmtbl tr').appendChild(mkElement('td', {class:"alternative_calendar"}));
};

_me._updateLabel = function (juldate) {
	var oDate = new IcewarpDate(juldate, {format: IcewarpDate.JULIAN});

	if (this.inp_calendar) {
		this.inp_calendar._value(juldate);
		// this.inp_calendar._weekMode(this.__step != 1);
	} else {
		this.inp_month._value(oDate.month(), true);
		this.inp_year._value(oDate.year(), true);
	}

	// if (this.__step != 1) {
	// 	//Week Select
	// 	var me = this;
	// 	var str = getLang('DATES::WEEK2'),
	// 		out = {};

	// 	if (!this.week) {
	// 		this._create('week', 'obj_select', 'slot2', 'small');

	// 		for (var i = 1; i <= oDate.isoWeeksInYear(); i++) {
	// 			out[i] = str + ' ' + i;
	// 		}

	// 		this.week._fill(out);
	// 		this.week._onchange = function () {
	// 			var dif = parseInt(this._value(), 10) - me.__date.week();
	// 			me._setDate((new IcewarpDate(me.__date.format(IcewarpDate.JULIAN) + (dif * 7), {format: IcewarpDate.JULIAN})), me.__step, me.__workweek);
	// 			me._serverSort();
	// 		};
	// 	} else {
	// 		for (var i = 1; i <= oDate.isoWeeksInYear(); i++) {
	// 			out[i] = str + ' ' + i;
	// 		}

	// 		this.week._fill(out);
	// 	}

	// 	this.week._value(oDate.week(), true);
	// } else {
	// 	if (this.week) {
	// 		this.week._destruct();
	// 	}
	// }

};
_me._setDate = function (date, iStep, bWork) {
	this.__step = iStep || this.__step;
	this.__date = date || new IcewarpDate();

	var hours = this.__getWorkingHours();
	var julianDate = this.__date.format(IcewarpDate.JULIAN);
	this.__workweek = bWork || false;

	if (this.__step > 1) {
		// Get weekday according to settings
		// var nStartDay;
		if (bWork) {
			//nStartDay = this.__workweekstarts;
			this.__step = this.__workweeklength;
		}
		// else {
		// 	nStartDay = this.__getStartDay();
		// }

		// Calculate actual date for the weekday
		if (GWOthers.getItem('CALENDAR_SETTINGS', 'begin_on_today') != '0') {
			IcewarpDate.Locale.setCustomWeekStart((new IcewarpDate()).day());
			IcewarpDate.Locale.chooseLocale(GWOthers.getItem('LAYOUT_SETTINGS', 'language'));
		}
		bWork ? this.__date.weekday(this.__workweekstarts % 7) : this.__date.weekday(0);
		julianDate = this.__date.format(IcewarpDate.JULIAN);
//		if (nStartDay <= this.__date.day()) {
//			julianDate = (new IcewarpDate(this.__date.unix() - (this.__date.day() - nStartDay) * 3600000 * 24)).format(IcewarpDate.JULIAN);
//		} else {
//			julianDate = (new IcewarpDate(this.__date.unix() - (this.__date.day() - nStartDay + 7) * 3600000 * 24)).format(IcewarpDate.JULIAN);
//		}
		// Set label to reflect we are in week view
		this.today._value('CALENDAR::THIS_WEEK');
	} else {
		// We are in day view, no need to calculate first day in week
		this.today._value('CALENDAR::TODAY');
	}

	this._updateLabel(julianDate);

	this.calendar._range(julianDate, julianDate + this.__step - 1, hours['start'], hours['end']);
};
