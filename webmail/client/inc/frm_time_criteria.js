_me = frm_time_criteria.prototype;
function frm_time_criteria() {}

_me.__constructor = function (aValue, aResponse) {
	var me = this;

	this._size(450, 300, true);
	this._modal(true);
	this._dockable(false);
	this._resizable(false);

	this._draw('frm_time_criteria', 'main');
	var days = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'];

	this.weekdays_enabled._onchange = function () {
		days.forEach(function (day) {
			me['weekdays_' + day]._disabled(!this._checked());
		}, this);
	};
	this.weekdays_enabled._checked(aValue ? aValue.WEEKDAYS[0].ENABLED[0].VALUE : false);
	this.weekdays_enabled._onchange.call(this.weekdays_enabled);

	days.forEach(function (day) {
		this['weekdays_' + day]._checked(aValue ? aValue.WEEKDAYS[0][day.toUpperCase()][0].VALUE : false);
	}, this);

	this.times_from._value(aValue ? aValue.TIMES[0].FROM[0].VALUE : '00:00');
	this.times_to._value(aValue ? aValue.TIMES[0].TO[0].VALUE : '00:00');

	this.times_from._restrict([this, '_timecheck']);
	this.times_to._restrict([this, '_timecheck']);

	this.times_enabled._onchange = function () {
		me.times_from._disabled(!this._checked());
		me.times_to._disabled(!this._checked());
	};
	this.times_enabled._checked(aValue ? aValue.TIMES[0].ENABLED[0].VALUE : false);
	this.times_enabled._onchange.call(this.times_enabled);

	this.dates_enabled._onchange = function () {
		me.dates_from._disabled(!this._checked());
		me.dates_to._disabled(!this._checked());
	};
	this.dates_enabled._checked(aValue ? aValue.DATES[0].ENABLED[0].VALUE : false);
	this.dates_enabled._onchange.call(this.dates_enabled);

	if (aValue) {
		this.dates_from._value(new IcewarpDate(aValue.DATES[0].FROM[0].VALUE, {format: 'YYYY/MM/DD'}));
		this.dates_to._value(new IcewarpDate(aValue.DATES[0].TO[0].VALUE, {format: 'YYYY/MM/DD'}));
	}

	this._title('FILTERS::TIME_CRITERIA');

	this._create('x_btn_ok', 'obj_button', 'footer', 'noborder ok color1');
	this.x_btn_ok._value('FORM_BUTTONS::OK');
	this.x_btn_ok._onclick = function () {
		executeCallbackFunction(aResponse, [{
			WEEKDAYS: [{
				ENABLED: [{
					VALUE: +me.weekdays_enabled._checked()
				}],
				SU: [{
					VALUE: +me.weekdays_su._checked()
				}],
				MO: [{
					VALUE: +me.weekdays_mo._checked()
				}],
				TU: [{
					VALUE: +me.weekdays_tu._checked()
				}],
				WE: [{
					VALUE: +me.weekdays_we._checked()
				}],
				TH: [{
					VALUE: +me.weekdays_th._checked()
				}],
				FR: [{
					VALUE: +me.weekdays_fr._checked()
				}],
				SA: [{
					VALUE: +me.weekdays_sa._checked()
				}]
			}],
			TIMES: [{
				ENABLED: [{
					VALUE: +me.times_enabled._checked()
				}],
				FROM: [{
					VALUE: me.times_from._value()
				}],
				TO: [{
					VALUE: me.times_to._value()
				}]
			}],
			DATES: [{
				ENABLED: [{
					VALUE: +me.dates_enabled._checked()
				}],
				FROM: [{
					VALUE: me.dates_from.__value.format('YYYY/MM/DD')
				}],
				TO: [{
					VALUE: me.dates_to.__value.format('YYYY/MM/DD')
				}]
			}]
		}]);
		me._destruct();
	};

	// Create 'CANCEL' button
	this._create('x_btn_cancel', 'obj_button', 'footer', 'cancel noborder');
	this.x_btn_cancel._tabIndex();
	this.x_btn_cancel._value('FORM_BUTTONS::CANCEL');
	this.x_btn_cancel._onclick = function () {
		me._destruct();
	};

	this.x_btn_ok._focus();
};

_me._timecheck = function(value) {
	var match = !!value.match(/^[012]?\d:\d{2}$/);
	this.x_btn_ok && this.x_btn_ok._disabled(!match);
	return match;
};
