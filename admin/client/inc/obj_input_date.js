/*****************************************************
 * Extension script: TextArea (?) form object
 *
 * INHERITS FROM obj_form_generic
 *    _me._disabled
 *    _me.__update
 *
 * OVERRIDES
 *    _me._value
 *    _me.toString
 *
 * Supported time formats (retrieved from localisation)
 * 20/9-2014, 9/20/2014, 2014-05-23, 1.11.2014, etc
 * Other separator are not supported, separators are mandatory.
 * Currently accepted php date types are Y, m, n, j and d (input
 * ignores zero padding). Only full years accepted.
 * No spaces are accepted in the date pattern localisation.
 *
 * Asking for a date which is not set will return an empty string
 *
 *****************************************************/

_me = obj_input_date.prototype;
function obj_input_date(){};

// Ordering of days in the week, 1 is Monday (create more patterns as needed)
obj_input_date.__weekStartsOnMonday = [1,2,3,4,5,6,7];
obj_input_date.__weekStartsOnSunday = [7,1,2,3,4,5,6];

/**
* @brief: CONSTRUCTOR, create input HTML element to __eIN variableS
* @date : 20.4.2006 17:24:21
**/
_me.__constructor = function(){
	var me = this;
	this._initialValue='';

	// Guess region from browser language property
	// @todo: read region (country) from settings and use that 
	var lang = navigator.language && navigator.language.split('-');
	switch(lang[1]) {
		case 'US':
			this.__week = obj_input_date.__weekStartsOnSunday;
			break;
		default:
			this.__week = obj_input_date.__weekStartsOnMonday;
	}

	// Localisation
	this.__days = ['mon','tue','wed','thu','fri','sat','sun'];
	this.__format = getLang('DATETIME::PHP_DATE');
	var m = this.__format.match(/^([jnmdY])([^a-zA-Z]+)([jnmdY])([^a-zA-Z]+)([jnmdY])$/);
	if(m) {
		// Detect date separators
		this.__primarySeparator = m[4];
		this.__secondarySeparator = m[2];
		// Assign date parts positioning index
		var idx = {Y: '__yearIndex',m: '__monthIndex',d: '__dayIndex',n: '__monthIndex',j: '__dayIndex'}
		this[idx[m[1]]] = 0;
		this[idx[m[3]]] = 1;
		this[idx[m[5]]] = 2;
		// Determine if date should be padded
		this.__paddedDay = m[1]=='d' || m[3]=='d' || m[5]=='d';
		this.__paddedMonth = m[1]=='m' || m[3]=='m' || m[5]=='m';
	} else
		log.error("Cannot localise date",this.__format);

	// Set type to date
	this.__eIN.setAttribute('type','date');
	
	// Internal date handling
	this.__native = this.__eIN.type=='date';
	this.__utctime = '00:00:00.000Z';
	this.__date = null;

	// Set initial value from input value
	if(this.__eIN.value)
		this._value(this.__eIN.value);

	// Monitor changes to date
	this.__eIN.addEventListener('change',function(e){
		var v = this.value;
		// Use internal date it's not in HTML5 format
		if(v) {
			if(!me.__native)
				me._fill();
			else
				me.__stringToDate(v);
		// Remember if date is set or not
		} else
			me.__date = null;
	},false);

	// Draw dropdown if there is no native support
	if(!this.__native) {
		this._draw('obj_input_date','main',false,true);

		// Create day labels for the week depending on start day
		var days = this._getAnchor("weekdays");
		for(var weekday = 0; weekday<7; weekday++) {
			var td = document.createElement(this.__week[weekday]==6 || this.__week[weekday]==7 ? 'th' : 'td');
			td.appendChild(
				document.createTextNode(
					getLang('DATETIME::'+this.__days[this.__week[weekday]-1].toUpperCase())
				)
			);
			days.appendChild(td);
		}
		
		// Notice changes in the input itself
		this.__eIN.addEventListener('keyup',function(e){
			// Leave input with esc or return
			if(e.keyCode==13) {
				me.__hide();
				me.__eIN.blur();
				return true;
			}

			var v = this.value.split(/[-.\s\/]+/);

			if(!me.__date)
				me.__date = new Date();

			var y = me.__date.getFullYear();
			var m = me.__date.getMonth()+1;
			var isYear = function(y) {
				return y.length==4 && y>1899 && y<2100;
			}
			var isMonth = function(m) {
				return m.length && m.length<3 && m<13 && m>0;
			}
			var isDate = function(m) {
				return m.length && m.length<3 && m<32 && m>0;
			}
			var refresh = true;
			switch(v.length) {
				case 1:
					// Date prediction for year or month only
					if(isYear(v[0]))
						me.__date = new Date(v[0]);
					else if(isMonth(v[0]))
						me.__date = new Date(y,v[0]-1);
					else if(isDate(v[0]))
						me.__date = new Date(y,m-1,v[0]);
					else
						refresh = false;
					break;
				case 2:
					// Date prediction with month and year or day and month
					if(isYear(v[1]) && isMonth(v[0])) {
						me.__date = new Date(v[1],v[0]-1);
					} else if(isYear(v[0]) && isMonth(v[1])) {
						me.__date = new Date(v[0],v[1]-1);
					} else if(me.__monthIndex==0 && isMonth(v[0]) && isDate(v[1])) {
						me.__date = new Date(y,v[0]-1,v[1]);
					} else if(isDate(v[0]) && isMonth(v[1])) {
						me.__date = new Date(y,v[1]-1,v[0]);
					} else
						refresh = false;
					break;
				case 3:
					// Full date, assign accoring to localisation
					if(isYear(v[me.__yearIndex]) && isMonth(v[me.__monthIndex]) && isDate(v[me.__dayIndex]))
						me.__date = new Date(v[me.__yearIndex],v[me.__monthIndex]-1,v[me.__dayIndex]);
					else
						refresh = false;
					break;
				default:
					refresh = false;
			}

			if(refresh)
				me._onfocus();

		},false);

		// Notice change of month in the dropdown
		var setMonthAndRefresh = function(m) {
			var dt = me.__date || new Date();
			me._setDate(dt.getFullYear(),m+1,dt.getDate());
			me._onfocus();
		}
		this._getAnchor("month").addEventListener('change',function(){
			setMonthAndRefresh(this.selectedIndex);
		},false);
		this._getAnchor("monthplus").addEventListener('click',function(){
			var dt = me.__date || new Date();
			setMonthAndRefresh(dt.getMonth()+1);
		},false);
		this._getAnchor("monthminus").addEventListener('click',function(){
			var dt = me.__date || new Date();
			setMonthAndRefresh(dt.getMonth()-1);
		},false);

		// Notice change of year in the dropdown
		var setYearAndRefresh = function(y) {
			var dt = me.__date || new Date();
			me._setDate(y,dt.getMonth()+1,dt.getDate());
			me._onfocus();			
		}
	//	this._getAnchor("year").addEventListener('change',function(){
	//		setYearAndRefresh(this.selectedIndex);
	//	},false);
		this._getAnchor("yearplus").addEventListener('click',function(){
			var dt = me.__date || new Date();
			setYearAndRefresh(dt.getFullYear()+1);
		},false);
		this._getAnchor("yearminus").addEventListener('click',function(){
			var dt = me.__date || new Date();
			setYearAndRefresh(dt.getFullYear()-1);
		},false);

		// Notice click of date in the dropdown
		this._getAnchor("calendar").addEventListener('click',function(e){
			if(e.target.nodeName=='TH' && e.target.firstChild && e.target.firstChild.nodeType==3) {
				var date = parseInt(e.target.firstChild.nodeValue);
				if(!isNaN(date)) {
					var dt = me.__date || new Date();
					var year = dt.getFullYear();
					var month = dt.getMonth()+1;
					me._setDate(year,month,date);
					me._onfocus();
					me.__hide();
				}
			}
		},false);

	}

	// When date is focused, show date dropdown
	this._onfocus=function(){
		if(!me.__native) {
			var elm = me._getAnchor('dropdown');
			elm.classList.add("show");

			// Determine position and avoid overflow
			var pos = elm.getBoundingClientRect();
			if(elm.clientWidth>=me._main.clientWidth) {
				elm.classList.add("narrow");
				if(pos.right>=document.body.clientWidth)
					elm.classList.add("right");
			}

			// Get date or create with today as default
			var dt = me.__date || new Date();

			// Add correct year for the date
			var year = me._getAnchor("year");
			year.innerHTML = dt.getFullYear();

			// Add correct month for the date
			var months = me._getAnchor("month");
			months.selectedIndex = dt.getMonth();

			// Get and empty calender space
			var dates = me._getAnchor("calendar");
			dates.innerHTML = '';
			// Get end and beginning of month
			var date = 1;
			var bgn = new Date(dt.getFullYear(),dt.getMonth(),1).getDay() || 7;
			var end = new Date(dt.getTime());
				end.setMonth(dt.getMonth()+1,0);
				end = end.getDate();
			// Append calender dates
			do {
				var tr = document.createElement('tr');
				for(var weekday = 1; weekday<8; weekday++) {
					if(date==1 && bgn!=me.__week[weekday-1] || date>end) {
						var td = document.createElement('td');
						tr.appendChild(td);
					} else {
						var th = document.createElement('th');
						if(date==dt.getDate())
							th.className = "selected";
						th.appendChild(document.createTextNode(date++));
						tr.appendChild(th);						
					}
				}
				dates.appendChild(tr);
			} while(date<end);
		}
	}

	// Handle showing and hiding of the dropdown
	this._main.addEventListener('click',function(e) {
		e.stopPropagation();
	},false);
	gui._obeyEvent('click',[this,'__hide']);
	gui._obeyEvent('blur',[this,'__hide']);
	this._add_destructor('__destruct');
};

_me.__destruct = function() {
	gui._disobeyEvent('click',[this,'__hide']);
	gui._disobeyEvent('blur',[this,'__hide']);
}

_me.__hide = function() {
	this._getAnchor('dropdown').classList.remove("show");
}

// This setValue overrides the form_generic implementation
_me._setValue = function(p) {
	var me = this;

	// Setting the value in the form
	var v = p.value;
	if(v=="1899/12/30") {
		p.value = null;
		p.commitChanges();
	} else {
		v = v.split('/').join('-');
		this._value(v);
	}

	// Disable input for readonly values
	if(p.readonly) {
		this._readonly(true);
	}

	// Monitor user changes and update the api property (only assign listener on first call)
	if(this.__apivalue==undefined) {
		this.__eIN.addEventListener('input',function(e){
			me.__apivalue.value = this.value.split('-').join('/');
		},true);
	}
	
	this.__apivalue = p;
}

// Set date with year, month and day (in object form as returned by getDate or as arguments)
_me._setDate = function(y,m,d) {
	this._changed(true);
	if(arguments.length==1 && y.year && y.month && y.day) {
		d = y.day;
		m = y.month;
		y = y.year;
	}
	this.__date = new Date(y,m-1,d);
	if(this.__apivalue) {
		this.__apivalue.value = y+'-'+(m<10?'0':'')+m+'-'+(d<10?'0':'')+d;
	}
	this._fill();
}

// Get date in year, month and day form (returns object or null if not set)
_me._getDate = function() {
	return this.__date instanceof Date ? {
		year: this.__date.getFullYear(),
		month: this.__date.getMonth()+1,
		day: this.__date.getDate()
	} : null;
}

// Set Julian date
_me._setJulian = function(julian) {
	this._changed(true);
	this.__date.setGWTime(julian);
	this._fill();
}

// Get Julian date
_me._getJulian = function() {
	return this.__date instanceof Date ? this.__date.getJulianDate() : '';
}

// Set from timestamp in milliseconds
_me._setUnix = function(timestamp) {
	this._changed(true);
	this.__date = new Date(timestamp*1000);
	this._fill();
}

// Get timestamp in milliseconds
_me._getUnix = function() {
	return this.__date instanceof Date ? parseInt(this.__date.getTime()/1000) : '';
}

// Set date using full UTC time notation
_me._setUTC = function(utc) {
	this._changed(true);
	utc = utc.split('T');
	if(utc.length==2) {
		this.__utctime = utc[1];
		this._value(utc[0]);
	}
}

// Get date using UTC time notation
_me._getUTC = function(utc) {
	return this.__date instanceof Date ? this.toString()+'T'+this.__utctime : '';
}

/*
 * Convenience function for getting and setting date
 *
 * Accepts date object or string in 2015-02-18 format
 * No argument will return current date as date object
 */
_me._value = function(date) {
	if(date==undefined)
		return this.__date || '';
	else if(date instanceof Date){
		this.__date = date;
	}else if(typeof date=="string"){
		this.__stringToDate(date);
	}
	this._fill();
	this._changed(true);
}

// Private parse method for date in ISO 8601 notation
_me.__stringToDate = function(date) {
	if(typeof date=="string" && (date = date.match(/^([0-9]{4})-([01]?[0-9])-([0-3]?[0-9])$/)))
		this.__date = new Date(date[1],date[2]-1,date[3]);
}

// Update input field to show internal date (normally handled internally)
_me._fill = function() {
	var date = this._getDate();
	if(date) {
		if(this.__native)
			this.__eIN.value = date.year + '-' + (date.month<10?'0'+date.month:date.month) + '-' + (date.day<10?'0'+date.day:date.day);
		else {
			// Format date according to localisation
			var f = this.__format.replace('Y',date.year);
			f = f.replace('n',date.month).replace('m',date.month<10 ? '0'+date.month : date.month);
			f = f.replace('j',date.day).replace('d',date.day<10 ? '0'+date.day : date.day);
			this.__eIN.value = f;
		}
	} else 
		this._clear();
}

// Clear out date to show placeholder
_me._clear = function() {
	this.__date = null;
	this.__eIN.value = '';
	this._changed(true);
}

// Get date as standardised YYYY-MM-DD date
_me.toString = function() {
	var date = this._getDate();
	return date ? date.year + '-' + (date.month<10?'0'+date.month:date.month) + '-' + (date.day<10?'0'+date.day:date.day) : '0000-00-00';
}

_me._changed=function(clear){
	log.log([this._initialValue,this.__eIN.value]);
	if(clear){
		this._initialValue=this.__eIN.value;
	}
	return this._initialValue!=this.__eIN.value;
}
