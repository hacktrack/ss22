_me = obj_input_calendar.prototype;
function obj_input_calendar() {};

_me.__constructor = function (empty, bNoEmpty, opt) {
	var me = this;
	this._create('input', 'obj_input');
	this.input._readonly(true);
	//this.input.__eIN.setAttribute('autocorrect', 'off');

	this.__opt = opt || {};
	if (this.__opt.week)
		addcss(this._main, 'week');

	if (empty) {
		this.__value = '';
		this.__empty = true;
	} else {
		this.__bNoEmpty = bNoEmpty;
		this.__value = new IcewarpDate();
		this.__empty = false;
		this._value(this.__value);
	}

	this.input._onkeydown = function (e) {
		var e = e || window.event,
				elm = e.target || e.srcElement;

		if (me.input.__eIN == elm) {
			switch(e.keyCode){
				case 27:
					if (me.block){
						me.__hideCal();
						e.cancelBubble = true;
						if (e.stopPropagation)
							e.stopPropagation();
					}
					break;
				case 9:
					if (me.block)
						me.__hideCal();
					return true;

				default:
					me.input._onclick();
			}

			return false;
		}
	};

	this.input._main.onclick = function (e) {
		var e = e || window.event,
				elm = e.target || e.srcElement;

		if (me.block && me.block._destructed == false) {
			if (elm == this)
				return true;
		} else
		if (elm == this)
			me.input._onclick();

		e.cancelBubble = true;
		if (e.stopPropagation)
			e.stopPropagation();
		return false;
	};

	this.input._onclick = function (e) {
		if (!this._disabled()) {
			if (me.block && me.block._destructed == false)
				me.__hideCal();
			else
				me.__showCal();
		}

		return true;
	};

	//Inherit noborder css prop
	if (hascss(this._main,'noborder')){
		addcss(this.input._main,'noborder');
	}
	if (hascss(this._main,'bold')){
		addcss(this.input._main,'bold');
	}
};

_me._weekMode = function(b){
	this.__opt.week = b;
	if (b){
		addcss(this._main, 'week');
		this.input._value(getLang('DATES::WEEK2')  +' '+ this.__value.week() +', '+ this.__value.format('L'));
	}
	else{
		removecss(this._main, 'week');
		this.input._value(this.__value.format('L'));
	}
};

_me.__showCal = function () {
	var me = this,
		pos = getSize(this.input._main);

	if (!this.block || this.block._destructed) {
		this.block = gui._create('calendar_block', 'obj_block_ext_uni','','',this._main);
		this.block._create('calendar', 'obj_calendar','','bubble2 obj_input_calendar_bubble', this.__opt);
		this.block.calendar._value(this._value());

		if (!this.__bNoEmpty) {
			this.block.calendar.empty._main.classList.add('show');
			this.block.calendar.empty._onclick = function () {
				me._value('empty');
				me.__hideCal();
				me._focus();

				if (me._ondateselect)
					me._ondateselect();
				me.__exeEvent('_ondateselect', null, {"owner": me});
			};
		}

		this.block.calendar._onchange = function (e) {

				var dDate = this._value();

				me.__empty = false;
				// save DATE
				me.__value = dDate;

				me.input._value(dDate.format('L'));

				me.__hideCal();
				me._focus();

				if (me.__restrictions)
					me.__check();

				if (me._ondateselect)
					me._ondateselect(dDate);
				me.__exeEvent('_ondateselect', null, {"date": dDate, "owner": me});
		};
	}

	//HEIGHT
	var h = 0;
	if (window.innerHeight)
		h = window.innerHeight;
	else
	if (window.document.body)
		h = window.document.body.clientHeight;

	var posh = Math.max(this.block.calendar._main.scrollHeight, 256);
	var w = document.body.offsetWidth;
	var x = pos.x;
	if (gui._rtl){
		x = (pos.x + pos.w) - 380;
		if (x<0) x = 0;
	}
	else
	if (pos.x + 380 > w)
		x = w - 380;

	if (h < (pos.y + posh))
		this.block._place(x, pos.y - posh + 1, 380, posh, 'bottom');
	else
		this.block._place(x, pos.y + pos.h + 4, 380, posh, 'top');
};

_me.__hideCal = function () {
	setTimeout(function(){
		if (this.block) {
			this.block._destruct();
			this.block = null;
			delete this.block;
		}
	}.bind(this), 0);
};

_me._value = function (aData) {

	if (aData) {
		this.__empty = false;

		if (aData instanceof IcewarpDate) {
			this.__value = aData;
		} else if (Is.Number(aData) || Is.String(aData) && !isNaN(parseInt(aData, 10))) {
			aData = parseInt(aData, 10);
			if (aData == 0) {
				this.__value = '';
				this.__empty = true;
			} else {
				this.__value = new IcewarpDate(aData, {format: IcewarpDate.JULIAN});
			}
		} else if (aData == 'empty') {
			this.__value = '';
			this.__empty = true;
		} else {
			this.__value = new IcewarpDate(aData);
			this.__value.hour(0);
			this.__value.minute(0);
			this.__value.second(0);
			this.__value.millisecond(0);
		}

		// set new date to calendar
		if (this.block && this.block.calendar) {
			if (this.__empty) {
				var oDate = new IcewarpDate();
				oDate.hour(0);
				oDate.minute(0);
				oDate.second(0);
				oDate.millisecond(0);
				this.block.calendar._value(oDate, true);
			} else
				this.block.calendar._value(this.__value);
		}

		// set the proper value into the visible input box
		if (this.__empty || +this.__value === 0) {
			this.input._value(' ');

		}
		else
		if (this.__opt.week){
			this.input._value(getLang('DATES::WEEK2')  +' '+ this.__value.week() +', '+ this.__value.format('L'));
		} else {
			this.input._value(this.__value.format('L'));
		}

		// If restricted, check for changes
		if (this.__restrictions) {
			this.__check();
		}
	} else {
		if (this.__empty) {
			return '';
		}
		return this.__value ? this.__value.format(IcewarpDate.JULIAN) : '';
	}
};

_me._getObjectDate = function () {
	if (this.__empty)
		return '';
	return this.__value;
};

/**
 * @brief: User definable date input parse function
 **/
_me._parseDate = function (y, m, d) {
	var tmpDate = new IcewarpDate([y, m - 1, d, 12, 0, 0]);

	if (d != tmpDate.getDate())
		tmpDate.hour(25);

	return tmpDate.format('L');
};

_me._disabled = function (b) {
	if (typeof b == 'undefined')
		return this.input._disabled();
	else
		this.input._disabled(b);
};


/**
 * @brief: Date picker implements it's own restrictions and test
 **/
_me._restrict = function () {
	this.__restrictions = true;
	this.__check();
};
_me.__check = function () {
	// Currently only checking if empty, could be improved to check if date exists
	if (this.__empty)
		addcss(this._main, 'error');
	else
		removecss(this._main, 'error');
};

//FOCUS
_me._tabIndex = function (sContainer, i, oDock) {
	this.input._tabIndex(sContainer, i, oDock);
};
_me._focus = function (b) {
	return this.input._focus(b);
};
