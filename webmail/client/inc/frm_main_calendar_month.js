_me = frm_main_calendar_month.prototype;
function frm_main_calendar_month() {};

_me.__constructor = function (sDataset, _date) {
	this.__date = new IcewarpDate(_date);

	var me = this;
	this._main.querySelector('.frmtbl tr').appendChild(mkElement('td', {class:"alternative_calendar"}));

	this.inp_month._ondateselect = function () {
		if (this._value() != me.__date.format(IcewarpDate.JULIAN)) {
			var d = this._getObjectDate();
			me.__date.month(d.month());
			me.__date.year(d.year());
			me._updateLabel();
		}
	};

	this.previous._onclick = function () {
		me.__date.subtract(1, 'month');
		me._updateLabel();
	};

	this.next._onclick = function () {
		me.__date.add(1, 'month');
		me._updateLabel();
	};

	this.today._onclick = function () {
		me.__date = new IcewarpDate();
		me._updateLabel();
	};

	this._updateLabel(true);
};

_me._updateLabel = function (bSkip) {
	this.inp_month._value(this.__date, true);
	this.calendar._range(this.__date.format(IcewarpDate.JULIAN));

	if (!bSkip)
		this._serverSort();
};
