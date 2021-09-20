_me = obj_month.prototype;
function obj_month() {};

_me.__constructor = function (opt) {
	var me = this;
	this.__timeout;

	this.__opt = opt || {};

	var aTemplateData = {month_names:IcewarpDate.months().map(function (month, i) {
			return {index: i, month: month};
		}, this)};

	this._draw('obj_month', '', aTemplateData);

	this.__eMain = this._getAnchor('main');

	this._create('_scrollbar', 'obj_scrollbar')._scrollbar(this.__eMain, this.__eMain.parentElement);

	this.__eMain.onclick = function (e) {
		var e = e || window.event,
			elm = e.target || e.srcElement;

		if (hascss(elm, 'month')){
			var rel = elm.getAttribute('rel');
			if (Is.Defined(rel)){
				var dDate = me._dDate.clone();
				dDate.month(rel);
				me._value(dDate);
			}
		}
	};

	this.year._onchange = function () {
		var date = new IcewarpDate();
		if (date.calendar_type === IcewarpDate.Calendars.HIJRI && (this._value() < 1356 || this._value() > 1500)){
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
			me._dDate.subtract(1, 'year');
			me.__draw();
		}
	};
	this.right1._onclick = function () {
		me._dDate.add(1, 'year');
		me.__draw();
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

_me.__draw = function () {

	var today = new IcewarpDate();

	// Year select
	this.year._fillYear(this._dDate.year());
	this.year._value(this._dDate.year(), true);

	// Main fill
	while(this.__eMain.firstChild)
		this.__eMain.removeChild(this.__eMain.firstChild);

	var elm, eActive;
	IcewarpDate.months().forEach(function (month, i) {
		elm = mkElement('div', {rel:i, text:month, className:'month'});

		if (today.year() == this._dDate.year() && today.month() == i)
			addcss(elm, 'today');

		if (this._dDate.month() == i){
			addcss(elm, 'active');
			eActive = elm;
		}

		this.__eMain.appendChild(elm);
	}, this);

	if (eActive)
		eActive.scrollIntoView({block: "nearest"});
};