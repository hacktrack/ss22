_me = obj_time.prototype;
function obj_time(){};

obj_time.HOURSONLY = /^[0-2]?[0-9]$/;
obj_time.HOURSMERIDIEM = /^([0-9]|1[0-2]) ?([pa]m)$/i;
obj_time.WITHOUTCOLON = /^([0-2]?[0-9])([0-5][0-9])$/;

_me.__constructor = function(bLength){
	var me = this;
	if (bLength){
		this.__regExp = /^([0-2]?[0-9])\:([0-5][0-9])$/;
		this.__12Format = 0;
	}
	else{
		this.__regExp = /^([0-2]?[0-9])\:([0-5][0-9]) *(pm|am)?$/i;
		this.__12Format = GWOthers.getItem('LAYOUT_SETTINGS','time_format')>0;
	}
	
	AttachEvent(this.__eIN,'onblur',
		function(e){
			var v = this.value, m;
			if(v.search(obj_time.HOURSONLY)!=-1)
				this.value = v + ':00';
			else if(m = v.match(obj_time.HOURSMERIDIEM))
				this.value = m[1] + ':00 ' + m[2];
			else if(m = v.match(obj_time.WITHOUTCOLON))
				this.value = m[1] + ':' + m[2];

			if(v!=this.value)
				me._validate();

			if (me._onchange)
				me._onchange(null);
		});

	this._restrict(this.__regExp);
};

_me._oncreateOptionList = function(){

	this.__idTable = {};

	var iValue = this.__value;

	if (iValue){
		var sMinValue = Math.ceil((iValue%3600000)/60000);
		if (sMinValue<10)
			sMinValue = '0'+sMinValue.toString();
	}

	var iWStart = GWOthers.getItem('CALENDAR_SETTINGS','day_begins'),
		iWEnd = GWOthers.getItem('CALENDAR_SETTINGS','day_ends');

	//fill select
	for (var j,k='',i=0;i<24;i++) {
		j = i;
		if (this.__12Format){
			k = ' PM';
			if (i<12){
				j = i?i:12;
				k = ' AM';
			}
			else
			if(i>12)
				j = i-12;
		}

		this.__idTable[i*3600000] = j+':'+'00'+k;

		if (iValue && iValue>i*3600000 && iValue<(i+0.5)*3600000)
			this.__idTable[iValue] = j+':'+sMinValue+k;

		if (i>=iWStart && i<iWEnd){
			this.__idTable[(i+0.25)*3600000] = j+':'+'15'+k;
			this.__idTable[(i+0.5)*3600000] = j+':'+'30'+k;
			this.__idTable[(i+0.75)*3600000] = j+':'+'45'+k;
		}
		else
			this.__idTable[(i+0.5)*3600000] = j+':'+'30'+k;

		if (iValue && iValue>(i+0.5)*3600000 && iValue<(i+1)*3600000)
			this.__idTable[iValue] = j+':'+sMinValue+k;
	}
};

_me.__inputValue = function (v){
	var minute = 60000;
	var hour = 3600000;
	var day = 86400000;

	if (Is.Defined(v)){
		v = parseInt(v);
		v = (v === NaN?0:v%day);

		// Storing last set value
		this.__value = v;

		// Format time for display in input
		var pos = '',
			hours = Math.floor(v/hour),
			minutes = Math.floor((v % hour)/minute);
			
		if (minutes < 10)
			minutes = '0'+minutes;

		if (this.__12Format){
			pos = ' AM';
			if (!hours)
				hours = 12;
			else
			if (hours>11){
				pos = ' PM';
				if (hours>12)
					hours -= 12;
			}
		}

		this.__eIN.value = hours+':'+minutes+pos;	
	}		
	else{
		// Parsing currently specified time
		var m = this.__eIN.value.match(this.__regExp);
		if (m){
			m[1] = parseInt(m[1]);
			m[2] = parseInt(m[2]);

			//AM|PM
			if (m[3])
				switch(m[3].toLowerCase()){
				case 'am':
					if (m[1]>11)
						m[1] = 0;

					break;
				case 'pm':
					if (m[1]>=12)
						m[1] = 12;
					else
						m[1] += 12;

					break;
				}
			else
			if (m[1]>23)
				m[1] = 23;

			// Storing last valid time from input
			this.__value = (m[1]*3600000)+(m[2]*60000) || 0;
		}

		return this.__value;
	}	
};