_me = obj_schedule.prototype;
function obj_schedule(){};

_me.__constructor = function(owner,bHasAllDay,evnid,bAttendee){
	this.__owner = MailAddress.splitEmailsAndNames(owner)[0].email || sPrimaryAccount;
	this._draw('obj_schedule','main',{'timeinterval':bHasAllDay});

	this._create('X_TIMETABLE',"obj_timetable",'table','',this.__owner,evnid || {},bAttendee);

	this.X_TIMETABLE._onselectend = function(){
		var v = this._value();
		this._parent.X_TIMEINTERVAL._value({EVNSTARTTIME:v.STARTTIME,EVNENDTIME:v.ENDTIME,EVNSTARTDATE:v.STARTDATE,EVNENDDATE:v.ENDDATE});
	};
};

_me._sync = function(oInterval){

	if (oInterval){
		var me = this;

		//timezone
		this.X_TIMETABLE.__tzid = oInterval._value().TZID;

		this.X_TIMEINTERVAL._onchange = null;
		this.X_TIMEINTERVAL._value(oInterval._value(),true);
		this.X_TIMEINTERVAL._onchange = function(noSync){
			var v  = this._value();

			if (!noSync)
				oInterval._value(v);

			var old = me.X_TIMETABLE._value();

			if (noSync || v.EVNSTARTDATE != old.STARTDATE ||
				v.EVNSTARTTIME != old.STARTTIME ||
				v.EVNENDDATE != old.ENDDATE ||
				v.EVNENDTIME != old.ENDTIME){
					old.STARTDATE = v.EVNSTARTDATE;
					old.STARTTIME = v.EVNSTARTTIME;
					old.ENDDATE = v.EVNENDDATE;
					old.ENDTIME = v.EVNENDTIME;
					me.X_TIMETABLE._value(old);
			}
		};
		
		this.X_TIMEINTERVAL._onchange(true);
	}
};

_me._attendees = function(aValues){

	if (Is.Defined(aValues)) {

		var acc = {css:'main_account',email:this.__owner,role:'G',status:'A'};
		var aAccInfo = dataSet.get('accounts',[this.__owner]);
		if (aAccInfo && aAccInfo['FULLNAME'])
			acc.name = aAccInfo['FULLNAME'];

		this.X_TIMETABLE._list.__users = [acc];

		for (var i in aValues)
			if (this.__owner != aValues[i].values.CNTEMAIL){
				if(aValues[i].values.CNTEMAIL === '__@@groupchat@@__') {
					aValues[i].values.CNTCONTACTNAME = 'All Attendees';
				}
				var user = {email:aValues[i].values.CNTEMAIL,
						name:aValues[i].values.CNTCONTACTNAME,
						role:aValues[i].values.CNTROLE,
						status:aValues[i].values.CNTSTATUS
						};
						
				if (aValues[i].values.NEW)
					user.action = 'new';
				else{
					user.id = i;
					user.action = 'ignore';
				}

				this.X_TIMETABLE._list.__users.push(user);
			}

		this.X_TIMETABLE._list._fill();
	}
	else {
		var users = this.X_TIMETABLE._list.__users;
		var aResult = [];
		for (var i in users) {
			if (i==0)
			    continue;
			    
			switch (users[i].action) {
				case 'remove':
					if (typeof users[i]['id'] != 'undefined')
						aResult.push({'uid': users[i]['id']});
					break;
				case 'edit':
                    if (typeof users[i]['id'] != 'undefined'){
						aResult.push({'uid': users[i]['id'], 'values': {CNTEMAIL:users[i].email,CNTCONTACTNAME:users[i].name,CNTROLE:users[i].role,CNTSTATUS:users[i].status}});
						break;
					}
				case 'new':
					aResult.push({'values': {CNTEMAIL:users[i].email,CNTCONTACTNAME:users[i].name,CNTROLE:users[i].role,CNTSTATUS:users[i].status}});
			}
		}
		return aResult;
	}
};
