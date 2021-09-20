_me = obj_repeating.prototype;
function obj_repeating() {};

_me.__constructor = function() {
	var me = this;

	this.__date = new IcewarpDate();
	this.__values = {};

	this.__aMonths = {'1':'MONTHS::JANUARY','2':'MONTHS::FEBRUARY','3':'MONTHS::MARCH','4':'MONTHS::APRIL','5':'MONTHS::MAY','6':'MONTHS::JUNE','7':'MONTHS::JULY','8':'MONTHS::AUGUST','9':'MONTHS::SEPTEMBER','10':'MONTHS::OCTOBER','11':'MONTHS::NOVEMBER','12':'MONTHS::DECEMBER'};
	this.__aWeekNo = {'1': 'REPEATING::FIRST', '2': 'REPEATING::SECOND', '3': 'REPEATING::THIRD', '4': 'REPEATING::FOURTH', '-1': 'REPEATING::LAST'};
	this.__aDays = {'127': 'REPEATING::DAY_LIST', '62': 'REPEATING::WEEKDAY', '65': 'REPEATING::WEEKEND_DAY',
		'1': 'DAYS::SUNDAY', '2': 'DAYS::MONDAY', '4': 'DAYS::TUESDAY', '8': 'DAYS::WEDNESDAY',
		'16': 'DAYS::THURSDAY', '32': 'DAYS::FRIDAY', '64': 'DAYS::SATURDAY'
	};

	this.__sSelected = undefined;
	this.__aValues = [];

	this.radio_repeats._onchange = function() {
		// Save values
		if (me.__sSelected && me.__sSelected != 'no_repeats') {
			// If the me.__sSelected is defined, it contains the old value yet (the
			// name of previously selected item)
			me.__aValues[me.__sSelected] = {};
			storeDataFromForm(me.container, me.__aValues[me.__sSelected]);
		}
		me.__sSelected = this._value();

		if (me.container) me.container._destruct();
		me._create('container', 'obj_form', 'container');

		switch (this._value()) {
			case 'no_repeats':
				me.__disableForm(true);
				me.__aValues = [];

				me.__validate();
				break;
			case 'daily':
				me.__disableForm(false);
				me.__drawDaily();
				break;
			case 'weekly':
				me.__disableForm(false);
				me.__drawWeekly();
				break;
			case 'monthly':
				me.__disableForm(false);
				me.__drawMonthly();
				break;
			case 'yearly':
				me.__disableForm(false);
				me.__drawYearly();
				break;
		}
		if (Is.Defined(me.__aValues[this._value()]))
			loadDataIntoForm(me.container, me.__aValues[this._value()]);
	};
	this.radio_ends._onchange = function() {

		switch(this._value()){
		case '1':
            me.RCRCOUNT._disabled(true);
            me.RCRENDDATE._disabled(false);
		    break;
		case '2':
            me.RCRCOUNT._disabled(false);
            me.RCRENDDATE._disabled(true);
		    break;
		default :
            me.RCRCOUNT._disabled(true);
            me.RCRENDDATE._disabled(true);
		}
		me.__validate();
	};

	this.RCRCOUNT._restrict([this,'__numerical',[void 0, 0]]);
	this.RCRCOUNT._onerror = function(has_error) {
		if (this._onerror)
			this._onerror(has_error);
	}.bind(this);
	AttachEvent(this.RCRCOUNT._main.getElementsByTagName('input')[0], 'onchange', function(e){
		this.value = parseInt(this.value) || 1;
		me.RCRCOUNT.__check();
	});

	// Default values
	this.radio_repeats._value('no_repeats');
	this.radio_ends._value('0');
	this.__disableForm(true);
};

_me.__drawYearly = function() {
	this.container._draw('obj_repeating_yearly', 'main');
	this.container.year_no._fill({'1': '1', '2': '2', '3': '3', '4': '4', '5': '5'});
	this.container.week_no._fillLang(this.__aWeekNo);
	this.container.day_of_week._fillLang(this.__aDays);
	this.container.the_month._fillLang(this.__aMonths);

	this.container.type._value('1');
	this.container.year_no._value('1');
	this.container.week_no._value('1');
	var nDay = this.__date.day();
	nDay = (nDay == '7') ? '1' : Math.pow(2, nDay);
	this.container.day_of_week._value(nDay);
	this.container.the_month._value(this.__date.month()+1);

	this.__validate();
};

_me.__drawMonthly = function() {
	var me = this;
	this.container._draw('obj_repeating_monthly', 'main');
	this.container.week_no._fillLang(this.__aWeekNo);
	this.container.day_of_week._fillLang(this.__aDays);

	this.container.day_repetition._value(this.__date.date());
	this.container.day_repetition._restrict([this,'__numerical',[31, 0]]);
	this.container.day_repetition._onerror = function(has_error) {
		if (this._onerror)
			this._onerror(has_error);
	}.bind(this);
	AttachEvent(this.container.day_repetition._main.getElementsByTagName('input')[0], 'onchange', function(e){
		this.value = parseInt(this.value) || 1;
		me.container.day_repetition.__check();
	});
	this.container.month_repetition1._value('1');
	this.container.month_repetition1._restrict([this,'__numerical',[void 0, 0]]);
	this.container.month_repetition1._onerror = function(has_error) {
		if (this._onerror)
			this._onerror(has_error);
	}.bind(this);
	AttachEvent(this.container.month_repetition1._main.getElementsByTagName('input')[0], 'onchange', function(e){
		this.value = parseInt(this.value) || 1;
		me.container.month_repetition1.__check();
	});
	this.container.type._value('1');
	this.container.week_no._value('1');
	var nDay = this.__date.day();
	nDay = (nDay == '7') ? '1' : Math.pow(2, nDay);
	this.container.day_of_week._value(nDay);
	this.container.month_repetition2._value('1');
	this.container.month_repetition2._restrict([this,'__numerical',[void 0, 0]]);
	this.container.month_repetition2._onerror = function(has_error) {
		if (this._onerror)
			this._onerror(has_error);
	}.bind(this);
	AttachEvent(this.container.month_repetition2._main.getElementsByTagName('input')[0], 'onchange', function(e){
		this.value = parseInt(this.value) || 1;
		me.container.month_repetition2.__check();
	});

	this.__validate();
};

_me.__drawWeekly = function() {
	var me = this;
	this.container._draw('obj_repeating_weekly', 'main');
	this.container.week_repetition._value('1');
	this.container.week_repetition._restrict([this,'__numerical',[void 0, 0]]);
	this.container.week_repetition._onerror = function(has_error) {
		if (this._onerror)
			this._onerror(has_error);
	}.bind(this);
	AttachEvent(this.container.week_repetition._main.getElementsByTagName('input')[0], 'onchange', function(e){
		this.value = parseInt(this.value) || 1;
		me.container.week_repetition.__check();
	});
	var nDay = this.__date.day();
		nDay = (nDay == '7') ? '1' : Math.pow(2, nDay);

	this.container.day_of_week._value(nDay);

	this.__validate();
};

_me.__drawDaily = function() {
	var me = this;
	this.container._draw('obj_repeating_daily', 'main');
	this.container.type._value('1');
	this.container.day_repetition._value('1');
	this.container.day_repetition._restrict([this,'__numerical',[void 0, 0]]);
	this.container.day_repetition._onerror = function(has_error) {
		if (this._onerror)
			this._onerror(has_error);
	}.bind(this);
	AttachEvent(this.container.day_repetition._main.getElementsByTagName('input')[0], 'onchange', function(e){
		this.value = parseInt(this.value) || 1;
		me.container.day_repetition.__check();
	});

	this.__validate();
};

_me.__validate = function() {
	var has_error = false;
	this.container._getChildObjects('main', 'obj_input').forEach(function(input) {
		input._checkError = [];
		input._validate();
		has_error = !!input._checkError.length || has_error;
	});
	if(!this.RCRCOUNT._disabled()) {
		this.RCRCOUNT._checkError = [];
		this.RCRCOUNT._validate();
		has_error = !!this.RCRCOUNT._checkError.length || has_error;
	}

	if (this._onerror)
		this._onerror(has_error);
};

// Check that a valid number has been entered 1-max (or to infinity if no max is specified)
_me.__numerical = function(num,max,min) {
	if(!num) return true;	// Empty field is ok
	if(num == 0 || (max !== void 0 && num > max) || (min !== void 0 && num < min)) return false;	// Only zero or number higher than maximum is not ok
	// If it's a valid positive number it's ok
	return !isNaN(num);
};

_me.__disableForm = function(b) {
	this.radio_ends._disabled(b);
	if (b) {
		this.RCRENDDATE._disabled(true);
		this.RCRCOUNT._disabled(true);
	}
	else
	{

		switch(this.radio_ends._value()){
		case '1':
            this.RCRCOUNT._disabled(true);
            this.RCRENDDATE._disabled(false);
		    break;
		case '2':
            this.RCRCOUNT._disabled(false);
            this.RCRENDDATE._disabled(true);
		    break;
		default :
            this.RCRCOUNT._disabled(true);
            this.RCRENDDATE._disabled(true);
		}
	}
};

_me.__zeroNonsetVariables = function(aValues) {
	var aAttributes = ['RCRDAYREPETITION', 'RCRDAYOFWEEKNUMBER', 'RCRWEEKREPETITION',
		'RCRWEEKOFMONTHNUMBER', 'RCRMONTHREPETITION', 'RCRMONTHOFYEARNUMBER', 'RCRYEARREPETITION'
	];

	for (var i in aAttributes) {
		if (!Is.Defined(aValues[aAttributes[i]]))
			aValues[aAttributes[i]] = '0';
	}
};

_me.__setYearly = function(aValues) {
	this.radio_repeats._value('yearly');
	this.radio_repeats._onchange();

	if (aValues['RCRWEEKOFMONTHNUMBER'] == '0') {
		this.container.type._value('1');
		this.container.year_no._value(aValues['RCRYEARREPETITION']);
	} else {
		this.container.type._value('2');
		this.container.week_no._value(aValues['RCRWEEKOFMONTHNUMBER']);
		this.container.day_of_week._value(aValues['RCRDAYOFWEEKNUMBER']);
		this.container.the_month._value(aValues['RCRMONTHOFYEARNUMBER']);
	}
};

_me.__getYearly = function() {
	var aValues = {};

	switch (this.container.type._value()) {
		case '1':
			aValues['RCRYEARREPETITION'] = this.container.year_no._value();
			break;
		case '2':
			aValues['RCRWEEKOFMONTHNUMBER'] = this.container.week_no._value();
			aValues['RCRDAYOFWEEKNUMBER'] = this.container.day_of_week._value();
			aValues['RCRMONTHOFYEARNUMBER'] = this.container.the_month._value();
			aValues['RCRYEARREPETITION'] = '1';
			break;
	}

	return aValues;
};

_me.__setMonthly = function(aValues) {
	this.radio_repeats._value('monthly');
	this.radio_repeats._onchange();

	if (aValues['RCRWEEKOFMONTHNUMBER'] == '0') {
		this.container.type._value('1');
		this.container.day_repetition._value(aValues['RCRDAYREPETITION']);
		this.container.month_repetition1._value(aValues['RCRMONTHREPETITION']);
	} else {
		this.container.type._value('2');
		this.container.week_no._value(aValues['RCRWEEKOFMONTHNUMBER']);
		this.container.day_of_week._value(aValues['RCRDAYOFWEEKNUMBER']);
		this.container.month_repetition2._value(aValues['RCRMONTHREPETITION']);
	}
};

_me.__getMonthly = function() {
	var aValues = {};

	switch (this.container.type._value()) {
		case '1':
			aValues['RCRDAYREPETITION'] = this.container.day_repetition._value();
			aValues['RCRMONTHREPETITION'] = this.container.month_repetition1._value();
			break;
		case '2':
			aValues['RCRWEEKOFMONTHNUMBER'] = this.container.week_no._value();
			aValues['RCRDAYOFWEEKNUMBER'] = this.container.day_of_week._value();
			aValues['RCRMONTHREPETITION'] = this.container.month_repetition2._value();
			break;
	}

	return aValues;
};

_me.__setWeekly = function(aValues) {
	this.radio_repeats._value('weekly');
	this.radio_repeats._onchange();

	this.container.week_repetition._value(aValues['RCRWEEKREPETITION']);
	this.container.day_of_week._value(aValues['RCRDAYOFWEEKNUMBER']);
};

_me.__getWeekly = function() {
	var aValues = {};

	aValues['RCRWEEKREPETITION'] = this.container.week_repetition._value();
	aValues['RCRDAYOFWEEKNUMBER'] = this.container.day_of_week._value();

	return aValues;
};

_me.__setDaily = function(aValues) {
	this.radio_repeats._value('daily');
	this.radio_repeats._onchange();

	if (aValues['RCRDAYREPETITION'] != '0') {
		this.container.type._value('1');
		this.container.day_repetition._value(aValues['RCRDAYREPETITION']);
	}
	else
		this.container.type._value('2');
};

_me.__getDaily = function() {
	var aValues = {};

	switch (this.container.type._value()) {
		case '1':
			aValues['RCRDAYREPETITION'] = this.container.day_repetition._value();
			break;
		case '2':

			aValues['RCRWEEKREPETITION'] = '1';

			var wwb = GWOthers.getItem('CALENDAR_SETTINGS','workweek_begins')%7,
				wwe = GWOthers.getItem('CALENDAR_SETTINGS','workweek_ends')%7;

			if (wwb>=0 && wwe>=0){
				var d = [1,2,4,8,16,32,64];
				if (wwb<=wwe)
					d = d.slice(wwb,++wwe);
				else
					d = [].concat(d.slice(0,++wwe),d.slice(wwb));

				aValues['RCRDAYOFWEEKNUMBER'] = d.reduce(function(a,v){return a + v});
			}
			else
				aValues['RCRDAYOFWEEKNUMBER'] = '62';

			break;
	}
	return aValues;
};

_me._setDate = function(oDate) {
	this.__date = oDate;

	if (!this.__values['RCRENDDATE'] && this.RCRENDDATE._value() < oDate.format(IcewarpDate.JULIAN))
		this.RCRENDDATE._value(oDate);
};

_me._value = function(aValues) {
	if (Is.Defined(aValues)) {
		if (Is.Defined(aValues['values']) && !Is.Empty(aValues['values'])){
			this.__values = aValues['values'];

			this.__zeroNonsetVariables(this.__values);
			if (this.__values['RCRYEARREPETITION'] != '0')
				this.__setYearly(this.__values);
			else
			if (this.__values['RCRMONTHREPETITION'] != '0')
				this.__setMonthly(this.__values);
			else
			if (this.__values['RCRWEEKREPETITION'] != '0')
				this.__setWeekly(this.__values);
			else
				this.__setDaily(this.__values);

			if (this.__values['RCRENDDATE'] && this.__values['RCRENDDATE'] != '0' && this.__values['RCRENDDATE'] != 'undefined') {
				this.radio_ends._value('1');
				this.RCRENDDATE._value(this.__values['RCRENDDATE']);
			}
			else
			if (this.__values['RCRCOUNT'] && this.__values['RCRCOUNT'] != '0' && this.__values['RCRCOUNT'] != 'undefined') {
				this.radio_ends._value('2');
				this.RCRCOUNT._value(this.__values['RCRCOUNT']);
			}
			else
				this.radio_ends._value('0');

			this.__disableForm(false);
			this._id = aValues['values']['RCR_ID'];
		}
	}
	else {
		var aResult = {};

		if (Is.Defined(this._id)) aResult['uid'] = this._id;

		switch (this.radio_repeats._value()) {
			case 'no_repeats':
				return aResult;
			case 'daily':
				aResult['values'] = this.__getDaily();
				break;
			case 'weekly':
				aResult['values'] = this.__getWeekly();
				break;
			case 'monthly':
				aResult['values'] = this.__getMonthly();
				break;
			case 'yearly':
				aResult['values'] = this.__getYearly();
				break;
		}
		this.__zeroNonsetVariables(aResult['values']);
		aResult['values']['RCRENDDATE'] = (this.radio_ends._value() != '1') ? '' : this.RCRENDDATE._value();
		aResult['values']['RCRCOUNT'] = (this.radio_ends._value() != '2') ? '' : this.RCRCOUNT._value();

		return aResult;
	}
};
