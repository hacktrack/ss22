_me = obj_timeinterval.prototype;
function obj_timeinterval(){};

_me.__constructor = function(bWithAllDay, bWithTZ, oControls) {
	var me = this;

	if (oControls){
		for (var n in oControls)
			this[n] = oControls[n];
	}
	else
		this._draw('obj_timeinterval');

	//START
	this.startDate._ondateselect = function() {
		me.__setFrom();
	};
	this.startTime._onchange = function() {
		me.__setFrom();
	};

	//END
	this.endDate._ondateselect = function() {
		me.__setEnd();
	};
	this.endTime._onchange = function() {
		me.__setEnd();
	};

	//DURATION
	this.durationTime._onchange = function() {
		me.__setFrom();
	};
	this.durationDays._onkeyup = function() {
		//blank to 0 (or 1 in case of All Day)
		if (this._value()==='' || this._value()=='0')
			this._value(me.__allDayEvent()?1:0,true);

		me.__setFrom();
	};
	this.durationDays._onkeydown = function(e){
		// 01 format is not allowed
		var key = e.keyCode;

		if (key>46 && key<58) key+=48;

		if (this._value() == 0){
			if (key==96)
				return false;
			else
			if (key>96 && key<106){
			    this._value(key-96,true);
			    return false;
			}
		}

		if((key>95 && key<106) || (key>36 && key<41) || key == 8 || key == 46 || key == 16)
		    return true;
		else
		    return false;
	};

	if (bWithTZ){

		if(!this.timezone)
			this._create('timezone', 'obj_timezones', 'tz','max');

		if(!this.tzlink)
			this._create('tzlink', 'obj_label','dtzl','tzlink');

		this.tzlink._value(getLang('TIME_INTERVAL::CHANGE_DEFAULT'));
		this.tzlink._onclick = function(){
			gui._create('settings','frm_settings','','','calendar_settings');
		};

        storage.library('wm_tools');
		this.timezone.__tools = new wm_tools();

		this.timezone._onchange = function(){
			if (me.__tzid != this._value()){
				if (me.__tzid == 'F' || this._value() == 'F')
					me.__tzid = this._value();
				else{
					me._disabled(true);
					this.__tools.timezone({'from':me.__tzid,'to':this._value(),'times':{
						'start':{'date':me.startDate._value(),'time':Math.floor(me.startTime._value()/60000)},
		                'end':{'date':me.endDate._value(),'time':Math.floor(me.endTime._value()/60000)}
					}},[me,'__updateTZ',[this._value()]]);
				}
			}
		};

		this.__updateTZ = function(aData,sTZid){
			if (this.timezone._value() == sTZid){
				this.startDate._value(aData['start'].date, true);
				this.startTime._value(aData['start'].time*60000, true);
				this.endDate._value(aData['end'].date, true);
				this.endTime._value(aData['end'].time*60000, true);

				this.__tzid = sTZid;

				this.__setEnd();
				this._disabled(false);
				this.timezone._focus();
			}
		};
	}

	//All Day checkbox
	if (bWithAllDay === true || bWithAllDay == 'true') {

		if(!this.allDay)
			this._create('allDay', 'obj_checkbox', 'all_day')._title('TIME_INTERVAL::ALL_DAY_EVENT');

		this.allDay._onchange = function (){

			var bDisable = false;
			if (this._value()){
				bDisable = true;

				me.startTime._value(0, true);
				me.endTime._value(0, true);
			}
			else{
				var v = me._value();
				if (!v.EVNSTARTTIME && !v.EVNENDTIME){
					var aActual = getActualEventTime();
					me.startTime._value(aActual.EVNSTARTTIME*60000, true);
					me.endTime._value(aActual.EVNENDTIME*60000, true);
				}
			}

			me.__setEnd();

			me.startTime._disabled(bDisable);
			me.endTime._disabled(bDisable);
			me.durationTime._disabled(bDisable);

			if (me.timezone)
				me.timezone._disabled(bDisable);
		};
	}
};

_me._disabled = function(b){
	this.startDate._disabled(b);
	this.startTime._disabled(b);
	this.endDate._disabled(b);
	this.endTime._disabled(b);
	this.durationTime._disabled(b);
	this.durationDays._disabled(b);

	if (this.timezone)
		this.timezone._disabled(b);

	if (this.allDay)
		this.allDay._disabled(b);
};

//OK
_me.__setFrom = function (bNoChange){
	if(!this.startDate) {
		return;
	}
	var iEnd = (this.startDate._value() + (this.durationDays._value()*1)) * 86400000;
	if (!this.__allDayEvent())
		iEnd += this.startTime._value() + this.durationTime._value();

	if (this.__allDayEvent())
		iEnd--;
	else
		this.endTime._value(iEnd%86400000, true);

	this.endDate._value(Math.floor(iEnd/86400000), true);

	if(!bNoChange) {
		this.__setEnd();
	}
};

//OK
_me.__setEnd = function (bNoChange){

	var iStart	= this.startDate._value()*86400000,
		iEnd	= this.endDate._value()*86400000;

	if (!this.__allDayEvent()){
		iStart	+= this.startTime._value();
		iEnd 	+= this.endTime._value();
	}

	var iDays = 0, iTime = 0;
	//positive - change duration
	if (iEnd > iStart){
		iDays = Math.floor((iEnd-iStart)/86400000);

		if (!this.__allDayEvent())
			iTime = (iEnd-iStart)%86400000;
	}
	else
	//negatiove change from
	if (iEnd < iStart){
		this.startDate._value(this.endDate._value(), true);

		if (!this.__allDayEvent())
			this.startTime._value(this.endTime._value(), true);
	}

	if (this.__allDayEvent())
		iDays++;

    this.durationDays._value(iDays, true);
	this.durationTime._value(iTime, true);

	//On Change Event
	if (this._onchange && !bNoChange)
		this._onchange();
};

//OK
_me.__allDayEvent = function() {
	return Is.Defined(this.allDay) && this.allDay._value();
};

_me._value = function(aValues, bNoChange) {
	if (Is.Defined(aValues)) {

		if (Is.Defined(aValues['EVNSTARTDATE']) && aValues['EVNSTARTDATE'] != 'undefined')
			this.startDate._value(aValues['EVNSTARTDATE'], true);

		if (this.timezone && aValues.EVNTIMEFORMAT == 'Z' && aValues.TZID){
			this.__tzid = aValues.TZID;
			this.timezone._value(aValues.TZID,true);
		}

		if (Is.Defined(aValues['EVNSTARTTIME']) && aValues['EVNSTARTTIME'] != 'undefined' && Is.Defined(aValues['EVNENDDATE']) && aValues['EVNENDDATE'] != 'undefined'){
			if (aValues['EVNSTARTTIME'] > -1 && aValues['EVNENDTIME'] > -1){
				this.startTime._value(aValues['EVNSTARTTIME']*60000, true);
				this.endTime._value(aValues['EVNENDTIME']*60000, true);
				this.endDate._value(aValues['EVNENDDATE'], true);

                if (this.allDay)
					this.allDay._value(0);
			}
			else
			//all day
			if (this.allDay){
				if (Is.Defined(aValues['EVNENDDATE']) && aValues['EVNENDDATE'] != 'undefined')
					this.endDate._value(aValues['EVNENDDATE']-1, true);

				this.allDay._value(1);
				return;
            }
		}
		else
		if (this.allDay)
			this.allDay._value(0);

		if (Is.Defined(aValues['EVNENDDATE']) && aValues['EVNENDDATE'] != 'undefined')
			this.endDate._value(aValues['EVNENDDATE'], true);

		this.__setEnd(bNoChange);


	}
	else {
		var aReturn = {'EVNSTARTDATE':this.startDate._value(),'EVNENDDATE':this.endDate._value()};

		if (this.__allDayEvent()) {
			aReturn['EVNSTARTTIME'] = -1;
			aReturn['EVNENDTIME'] = -1;
			aReturn['EVNENDDATE']++;
			aReturn.EVNTIMEFORMAT = 'F';
		}
		else {
			aReturn['EVNSTARTTIME'] = this.startTime._value()/60000;
			aReturn['EVNENDTIME'] = this.endTime._value()/60000;

			if (this.timezone){
				if (this.__tzid){
			    	aReturn.TZID = this.__tzid;
			        aReturn.EVNTIMEFORMAT = 'Z';
				}
				else
			        aReturn.EVNTIMEFORMAT = 'L';
			}
		}
		return aReturn;
	}
};

//Pass tabindexes to nasted objects
_me._tabIndex = function(sContainer,i,oDock){
	this.startTime._tabIndex(sContainer,i,oDock);
	this.endTime._tabIndex(sContainer,i?++i:i,oDock);
	this.durationDays._tabIndex(sContainer,i?++i:i,oDock);
	this.durationTime._tabIndex(sContainer,i?++i:i,oDock);
	if (this.allDay)
		this.allDay._tabIndex(sContainer,i?++i:i,oDock);
};
_me._focus = function (b){
	return this.startTime._focus(b);
};