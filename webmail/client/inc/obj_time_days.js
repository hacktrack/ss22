_me = obj_time_days.prototype;
function obj_time_days(){};

_me._value = function(nMilliSeconds, bNoUpdate) {
	var minute = 60000;
	var hour = 60*minute;
	var day = 24*hour;

	if (Is.Defined(nMilliSeconds)) {
		var which,val,negative;	       

		if (nMilliSeconds != 0) {
			var time = nMilliSeconds;

                        if (time<0) {
 				time = time * -1;
				negative = true;
			}

			var days = Math.floor(time/day);
			time %= day;
			var hours = Math.floor(time/hour);
			time %= hour;
			var minutes = Math.floor(time/minute);
			
			if (minutes == 0) {
				if (hours == 0) {
					val = days;
					which = 'days';
				} else {
					val = hours + 24*days;
					which = 'hours';
				}
			} else {
				val = minutes + 60*(hours + 24*days);
				which = 'mins';
			}
		} else {
			val = '0';
			which = 'mins';
		}

		if (negative) val = val * -1;

		this.x_text._value(val);
		this.x_type._value(which);

		if (!bNoUpdate) if (this._onchange) this._onchange();
	} else {
		var number = parseInt(this.x_text._value());
		if (Is.Number(number))
			return number*this.__getMultiplier()*60000;
		else
			return 0; 
	}
}

_me._disabled = function(b) {
	this.x_text._disabled(b);
	this.x_type._disabled(b);
}

_me.__getMultiplier = function () {
	var multiplier;
	switch (this.x_type._value()) {
		case 'mins':  multiplier = 1; break;
		case 'hours': multiplier = 60; break;
		case 'days':  multiplier = 60*24; break;
	}
	return multiplier;
}

_me._getMinutes = function() {
	if (Is.Defined(this.x_text._value()))
		return this.x_text._value()*this.__getMultiplier();
	else
		return 0;
}

//FOCUS
_me._tabIndex = function(sContainer,i,oDock){
	this.x_text._tabIndex(sContainer,i,oDock);
	this.x_type._tabIndex(sContainer,i?++i:i,oDock);
};
_me._focus = function (b){
	return this.x_text._focus(b);
};