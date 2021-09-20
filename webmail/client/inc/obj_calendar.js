_me = obj_calendar.prototype;
function obj_calendar() {};

_me.__constructor = function (opt) {
	var me = this;
	this.__timeout;

	this.__opt = opt || {};

	var aTemplateData = {month_names:IcewarpDate.months().map(function (month, i) {
			return {index: i, month: month};
		}, this)};

	if (this.__opt.week){
		addcss(this._main, 'week');
		aTemplateData.week = true;
	}

	this._draw('obj_calendar', '', aTemplateData);

	this.__eMain = this._getAnchor('main');

	this.__eMain.onclick = function (e) {
		var e = e || window.event,
			elm = e.target || e.srcElement;

		if (me.__opt.week && elm.tagName == 'SPAN' && hascss(elm,'week')){
			var dDate = new IcewarpDate();
			dDate.week(parseInt(elm.textContent));
		}
		else
		if (elm.tagName !== 'A') {
			return;
		}
		else{
			var rel = hascss(elm, 'last') ? -1 : (hascss(elm, 'next') ? 1 : 0),
				id = me.__getId(elm.id),
				dDate = me.__getDate(id, rel);
		}

		me._value(dDate); 	// pozor dela refresh
		if (me._onclick) {
			me._onclick(e, elm);
		}
		me.__exeEvent('onclick', e, {"owner": me, "elm": elm, "date": dDate});
	};

	if (this.week){
		this.week._fillWeek = function(dDate){
			for(var aFill = {}, i = 0, j = dDate.weeksInYear(); i<=j; i++)
				aFill[i] = i;

			this._fill(aFill);
		};
		this.week._onchange = function () {
			me._dDate.week(this._value());
			me.__draw();
		};
	}

	this.month._onchange = function () {
		me._setDate('', this._value());
		return true;
	};

	this.year._onchange = function () {
		var date = new IcewarpDate();
		if(date.calendar_type === IcewarpDate.Calendars.HIJRI && (this._value() < 1356 || this._value() > 1500)){
			return true;
		}

		this._value() && (me._dDate.year() !== this._value()) && me._setDate(this._value());
		return true;
	};

	this.year._fillYear = function(v){
		for(var aFill = {}, i = v-25, j = v + 25; i<=j; i++)
			aFill[i] = i;

		this._fill(aFill);
	};

	this.year._onkeydown = function (e) {
		if ((e.keyCode > 47 && e.keyCode < 58) || (e.keyCode > 95 && e.keyCode < 106)) {
			var v = me.year._value();
			if (!v && !(e.keyCode === 49 || e.keyCode === 50 || e.keyCode === 97 || e.keyCode === 98)) {
				return false;
			}

			if (e.keyCode !== 37 && e.keyCode !== 39) {
				if (me.__timeout) {
					window.clearTimeout(me.__timeout);
				}
				me.__timeout = window.setTimeout(function () {
					try {
						me.__setYear();
					} catch (e) {
						gui._REQUEST_VARS.debug && console.log(me._name || false, e);
					}
				}, 300);
			}

			if (v && v.length === 4 && (e.target.selectionStart === e.target.selectionEnd)) {
				return false;
			}

			return true;
		}
		// Allow erase and moving cursor
		else
			return e.keyCode === 8 || e.keyCode === 46 || e.keyCode === 37 || e.keyCode === 39;
	};

	this.left1._onclick = function () {
		if (me._dDate.year() > 1 || me._dDate.month() > 0) {
			me._dDate.subtract(1, 'month');
			me.__draw();
		}
	};
	this.right1._onclick = function () {
		me._dDate.add(1, 'month');
		me.__draw();
	};

	this.today._onclick = function () {
		me._value(new IcewarpDate());
	};

	this.close._onclick = function (e) {
		me._parent._destruct();
	};

	this._value(new IcewarpDate(), true);

	this._add_destructor('__destruct');
};

_me.__destruct = function(){
	if (this.__timeout)
		window.clearTimeout(this.__timeout);
};
/**
 * This method is called in timeslip by this.year selectbox
 **/
_me.__setYear = function () {
	var date = new IcewarpDate();
	this.year.__restrictions = [].slice.call(this.year.__restrictions);
	if(date.calendar_type === IcewarpDate.Calendars.HIJRI && ~!this.year.__restrictions.indexOf('<1500i')){
		this.year.__restrictions.push('<1500i');
		this.year.__restrictions.push('2');
	}
	try {
		var year = parseInt(this.year._value());
		if (date.calendar_type !== IcewarpDate.Calendars.HIJRI || (year > 1355 && year < 1501)) {
			this._setDate(year);
		}
	} catch (er) {
		gui._REQUEST_VARS.debug && console.log(this._name || false, er);
	}
};

_me._setDate = function (year, month) {
	this._dDate.year(+(year || this._dDate.year())).month(+(month || this._dDate.month()));
	this.__draw();
};

_me._value = function (date, no_update) {
	if (date) {
		if (date instanceof IcewarpDate) {
			this._dDate = date.clone();
		} else if (Is.Number(date) || (Is.String(date) && !isNaN(parseInt(date)))) {
			this._dDate = new IcewarpDate(date, {format: IcewarpDate.JULIAN});
		} else {
			this._dDate = new IcewarpDate(date);
		}

		// selected date
		this._active = this._dDate.clone();
		this.__draw();
		if (!no_update) {

				if (this._onchange)
					this._onchange(this._dDate);
				this.__exeEvent('onchange', null, {"owner": this, "date": this._dDate});

		}

	} else {
		return this._active;
	}
};

_me.__update = function (sDataSet) {
	// update calendar data
	if (this._listener_data == sDataSet)
		this.__draw();

	// update calendar view
	if (this._listener == sDataSet)
		this._value(dataSet.get(this._listener, this._listenerPath));
};

_me._listen_data = function (sDataSet, aDataPath) {
	this._listener_data = sDataSet;
	if (typeof aDataPath == 'object')
		this._listenerPath_data = aDataPath;
	dataSet.obey(this, '_listener_data', sDataSet);
};

/**
 * @brief: Dataset Parser function
 **/
_me._fill = function (aData) {
	/*
	 PARSER BODY
	 */
	return aData;
};

_me.__draw = function () {
	var data = {
		"weeks": [],
		"days": [''].concat(IcewarpDate.weekdaysShort())
	};
	var today = new IcewarpDate();
	// Data from dataset
	if (this._listener_data)
		this._fill(dataSet.get(this._listener_data, this._listenerPath_data));

	//Week
	if (this.week){
		this.week._fillWeek(this._dDate);
		this.week._value(this._dDate.week(), true);
	}

	// Month select
	this.month._value(this._dDate.month(), true);

	// Year select
	this.year._fillYear(this._dDate.year());
	this.year._value(this._dDate.year(), true);

	//var month = this._dDate.month();
	var next_month = this._dDate.clone().add(1, 'month').month();
	var end_day = this._dDate.clone().endOf('month').endOf('week').add(1, 'day');
	if (end_day.month() !== next_month) {
		// fix for HIJRI calendar, in some cases endOf(month) returns wrong month
		// https://github.com/xsoh/moment-hijri/issues/22
		end_day = this._dDate.clone().month(next_month).startOf('month').subtract(1, 'day').endOf('week').add(1, 'day');
	}

	var start_day = this._dDate.clone().startOf('month').startOf('week');
	var week = [{week: start_day.isoWeekday() === 1 ? start_day.week() : start_day.clone().isoWeekday(8).week()}];
	while (!start_day.isSame(end_day, 'day')) {
		//var current_month = start_day.month();
		week.push({
			value: start_day.date(),
			label: new IcewarpNumber(start_day.date()).localize(),
			"class": (start_day.isAfter(this._dDate, 'month') ? 'next ' : (start_day.isBefore(this._dDate, 'month') ? 'last ' : '')) + (start_day.isSame(today, 'day') ? 'today ' : '') + (start_day.isSame(this._active, 'day') ? 'active' : '')
		});
		start_day.add(1, 'day');
		if (start_day.day() === IcewarpDate.firstDayOfWeek()) {
			data.weeks.push(week.slice(0));
			week = [{week: start_day.isoWeekday() === 1 ? start_day.week() : start_day.clone().isoWeekday(8).week()}];
		}
	}

	this._draw('obj_calendar_main', 'main', data);

	if (this.__opt.week){
		[].forEach.call(this.__eMain.querySelectorAll('span.week'), function(eWeek){
			eWeek.onmouseover = function(e){
				addcss(this.parentElement.parentElement,'week');
			};
			eWeek.onmouseout = function(e){
				removecss(this.parentElement.parentElement,'week');		};
		});
	}
};

_me.__getId = function (eid) {
	return eid.substr(this._pathName.length + 1);
};

_me.__getDate = function (id, rel) {
	rel = rel || 0;
	var month = this._dDate.month();
	return this._dDate.clone().month(rel > 0 ? (month + 1) : (rel < 0 ? month - 1 : month)).date(+id);
};
