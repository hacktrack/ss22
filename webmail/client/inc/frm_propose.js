_me = frm_propose.prototype;
function frm_propose(){};

/**
 * 
 */         
_me.__constructor = function(aItem, aIMIP, aHandler) {
	this._size(750,570,true);
	this._dockable(false);
	this._closable(true);

	this._title('MAIL_VIEW::PROPOSE');
	this._draw('frm_propose','main');

	this.__aItem = clone(aItem,true);
	//this.__aHandler = aHandler;

	var DS = new cDataSet();
		DS.add('imip','',aIMIP.VCALENDAR[0]);

	var owner = DS.get('imip',['VEVENT',0,'ORGANIZER',0,'VALUE']).replace(/^mailto\:/ig,'');

	this._create('X_SCHEDULE','obj_schedule','body','',owner,true,null,true);

	var tmp = DS.get('imip',['VEVENT',0,'ATTENDEE']),
		aAtt = [],
		aRConv = {'REQ-PARTICIPANT':'Q','OPT-PARTICIPANT':'T'},
		aSConv = {'NEEDS-ACTION':'B','ACCEPTED':'A','DECLINED':'D','TENTATIVE':'T','DELEGATED':'E'};


	for(var i = 0; i<tmp.length; i++)
		aAtt.push({values:{
			CNTEMAIL: tmp[i].VALUE,
			CNTCONTACTNAME: tmp[i].ATTRIBUTES.CN || '',
			CNTROLE: aRConv[(tmp[i].ATTRIBUTES.ROLE || '').toUpperCase()] || 'Q',
			CNTSTATUS: aSConv[(tmp[i].ATTRIBUTES.PARTSTAT || '').toUpperCase()] || 'N',
			CNTRSVP: (tmp[i].ATTRIBUTES.RSVP || '').toUpperCase() == 'TRUE'?1:0,
			CNTEXPECT:''
		}});

	this.X_SCHEDULE._attendees(aAtt);

	//START
	var tmp = DS.get('imip', ['VEVENT', 0, 'DTSTART', 0]),
			time = tmp.VALUE.indexOf('T') > -1;
	var a = (tmp.ATTRIBUTES && tmp.ATTRIBUTES['X-UNIXTIME']) ? IcewarpDate.unix(tmp.ATTRIBUTES['X-UNIXTIME']) : new IcewarpDate(tmp.VALUE);

	//END DTEND
	var tmp = DS.get('imip',['VEVENT',0,'DTEND',0]);
	var b = (tmp.ATTRIBUTES && tmp.ATTRIBUTES['X-UNIXTIME']) ? IcewarpDate.unix(tmp.ATTRIBUTES['X-UNIXTIME']) : new IcewarpDate(tmp.VALUE);

	//SET DATE
	var old = {
		EVNSTARTDATE: a.format(IcewarpDate.JULIAN),
		EVNSTARTTIME: time ? a.format(IcewarpDate.JULIAN_TIME) : -1,
		EVNENDDATE: b.format(IcewarpDate.JULIAN),
		EVNENDTIME: time ? b.format(IcewarpDate.JULIAN_TIME) : -1,
		EVNTIMEFORMAT: 'Z'
	};

	this.X_SCHEDULE.X_TIMEINTERVAL._value(old, true);

	this.X_SCHEDULE.X_TIMEINTERVAL._onchange = function(noSync){
		var v  = this._value();
		if (noSync || v.EVNSTARTDATE != old.STARTDATE ||
			v.EVNSTARTTIME != old.STARTTIME ||
			v.EVNENDDATE != old.ENDDATE ||
			v.EVNENDTIME != old.ENDTIME){
				
				old.STARTDATE = v.EVNSTARTDATE;
				old.STARTTIME = v.EVNSTARTTIME;
				old.ENDDATE = v.EVNENDDATE;
				old.ENDTIME = v.EVNENDTIME;
				
				this._parent.X_TIMETABLE._value(old);
		}
	};
	
	this.X_SCHEDULE.X_TIMEINTERVAL._onchange(true);
	document.querySelector(':focus') || this.X_SCHEDULE.X_TIMEINTERVAL.startTime.__eIN.focus();

	this.x_btn_ok._onclick = function(){
		aItem.gwparams = this._parent.X_SCHEDULE.X_TIMEINTERVAL._value();

		WMItems.imip(aItem, 'propose', aHandler);

		this._parent._destruct();
	};
};
