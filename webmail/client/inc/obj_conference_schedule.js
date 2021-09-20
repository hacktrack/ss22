_me = obj_conference_schedule.prototype;

function obj_conference_schedule() {};

_me.__constructor = function () {
	this.__opt = {
		back_button: getLang('FORM_BUTTONS::BACK')
	};

	this.__aValues = {
		values:{
			_TZID: GWOthers.getItem('CALENDAR_SETTINGS', 'timezone')
		}
	};

	this._draw('obj_conference_schedule','cell');

	//Set default date
	this.__init_date();

	this.title._onerror = function(b){
		this.btn_save._disabled(b);
	}.bind(this);
	this.title._restrict(".+");

	this.btn_save._onclick = function(){
		this.__save();
	}.bind(this);

	this._getAnchor('link_more').onclick = function(){
		var val = this.__value(),
			aOut = val.values;

		Object.keys(val).forEach(function(k){
			if (k != 'values')
				aOut[k] = val[k];
		});

		//convert attachments
		if (Is.Array(aOut.ATTACHMENTS)){
			aOut.ATTACHMENTS = aOut.ATTACHMENTS.map(function(att){
				return {values:{
					ATTDESC:att.values.description,
					ATTTYPE:att.values.class,
					FULLPATH:att.values.fullpath,
					ATTSIZE:att.values.size
				}};
			});
		}

		var frm = Item.openwindow([sPrimaryAccount, Mapping.getDefaultFolderForGWType('E')], aOut, null, null, [function() {}]);

		frm._modal(true);

		frm.MEETING_ACTION._disabled(true);
		frm.X_PATH._disabled(true);

		frm.x_btn_cancel._destruct();
		frm.x_btn_ok._value('FORM_BUTTONS::OK');
		frm.x_btn_ok._onclick = function(){
			frm._closeNote()
			this.__value(frm.__readItems(true));
			frm._destruct();
		}.bind(this);

	}.bind(this);

	this.label._onclick = function() {
		var aPassword = this._getAnchor('password');
		if(hascss(aPassword, 'hidden')) {
			storage.library('wordGen', 'wordGen');
			this.password._value(this.password._value() || (wordGen() + (Math.random() * 899999999 + 100000000)).slice(0, 10));
			this.label._value(getLang('CONFERENCE::REMOVE_PASSWORD'));
			removecss(aPassword, 'hidden');
			this.password.__eIN.select();
		} else {
			this.label._value(getLang('CONFERENCE::SET_PASSWORD'));
			addcss(aPassword, 'hidden');
			this.title._focus();
		}
	}.bind(this);

	this._create('scrollbar','obj_scrollbar')._scrollbar(this._main.querySelector('div.scroll'), this._main);

	this.note.__maxHeight = 350;
};

_me.__init_date = function(){
	var d = new IcewarpDate();
	this.__start(d);
	this.__end(d.add(30, 'minutes'));

	this.starttime._onchange = this.startdate._ondateselect = function(){
		var ds = this.__start();

		if (!this.starttime._disabled()){
			ds.add(15,'minutes');
		}

		if (!ds.isBefore(this.__end())){
			this.__end(ds);
		}

	}.bind(this);

	this.endtime._onchange = this.enddate._ondateselect = function(){
		var de = this.__end();

		if (!this.endtime._disabled()){
			de.subtract(15,'minutes');
		}

		if (!de.isAfter(this.__start())){
			this.__start(de);
		}

	}.bind(this);
};

_me.__start = function(d){
	var startDate;

	if (d){
		startDate = IcewarpDate.unix(Math.ceil((+d/1000)/(15*60))*15*60);

		this.startdate._value(startDate, true);
		this.starttime._value(startDate.format(IcewarpDate.JULIAN_TIME)*60000, true);
	}
	else
	if (this.starttime._disabled())
		return IcewarpDate.julian(this.startdate._value());
	else
		return IcewarpDate.julian(this.startdate._value(), this.starttime._value()/60000);
};

_me.__end = function(d){
	if (d){
		var endDate = IcewarpDate.unix(Math.ceil((+d/1000)/(15*60))*15*60);

		this.enddate._value(endDate, true);
		this.endtime._value(endDate.format(IcewarpDate.JULIAN_TIME)*60000, true);
	}
	else
	if (this.endtime._disabled())
		return IcewarpDate.julian(this.enddate._value());
	else
		return IcewarpDate.julian(this.enddate._value(), this.endtime._value()/60000);
};

_me.__value = function(aValue){
	if (aValue){

		//store all values
		this.__aValues = aValue;

		//fill form values
		this.title._value(aValue.values.EVNTITLE);
		if(aValue.values.MEETING_PASSWORD) {
			this.password._value(aValue.values.MEETING_PASSWORD);
			this.label._value(getLang('CONFERENCE::REMOVE_PASSWORD'));
			removecss(this._getAnchor('password'), 'hidden');
		}
		this.startdate._value(aValue.values._TZEVNSTARTDATE, true);

		if (aValue.values.EVNSTARTTIME == -1){
			this.starttime._disabled(true);
			this.starttime._value(0, true);
		}
		else{
			this.starttime._disabled(false);
			this.starttime._value(aValue.values._TZEVNSTARTTIME*60000, true);
		}

		this.enddate._value(aValue.values._TZEVNENDDATE, true);

		if (aValue.values.EVNENDTIME == -1){
			this.endtime._disabled(true);
			this.endtime._value(0, true);
		}
		else{
			this.endtime._disabled(false);
			this.endtime._value(aValue.values._TZEVNENDTIME*60000, true);
		}

		this.note._value(aValue.values.EVNNOTE);

		if (aValue.CONTACTS){
			this.attendees._value(aValue.CONTACTS.map(function(cnt){
				return MailAddress.createEmail(cnt.values.CNTCONTACTNAME, cnt.values.CNTEMAIL);
			}).join(';'));
		}
		else
			this.attendees._value('');
	}
	else{
		var cnt = [];
		MailAddress.splitEmailsAndNames(this.attendees._value()).forEach(function(user){
			cnt.push({'values': {
				CNTCONTACTNAME: user.name,
				CNTEMAIL: user.email,
				CNTROLE:'Q'
			}});
		});

		var aDate;
		if (this.startdate._disabled()){
			aDate = {
				EVNSTARTDATE:this.startdate._value(),
				EVNSTARTTIME:-1,
				EVNENDDATE:this.enddate._value(),
				EVNENDTIME:-1
			};
		}
		else{
			aDate = {
				_TZEVNSTARTDATE:this.startdate._value(),
				_TZEVNSTARTTIME:this.starttime._value()/60000,
				_TZEVNENDDATE:this.enddate._value(),
				_TZEVNENDTIME:this.endtime._value()/60000,
			};
		}

		var aOut = this.__aValues;

		aOut.values = Object.assign(this.__aValues.values, {
			conference:true,
			EVNSHARETYPE: 'U',
			EVNTIMEFORMAT: 'Z',
			EVNFLAGS: 1,
			MEETING_ACTION: 1,
			MEETING_PASSWORD: hascss(this._getAnchor('password'), 'hidden') ? '' : this.password._value(),
			EVNTITLE:this.title._value(),
			EVNNOTE:this.note._value(),
			EVNDESCFORMAT: 'text/html'
		}, aDate);

		if (cnt.length)
			aOut.CONTACTS = cnt;

		//Strip TZ time
		if (this.starttime._disabled()){
			Object.keys(aOut.values).forEach(function(k){
				if (k.indexOf('_TZ') === 0)
					delete aOut.values[k];
			});
		}

		return aOut;
	}
};

_me.__save = function(){
	this.btn_save._disabled(true);
	this._create('loader', 'obj_loader', '');
	WMItems.add([sPrimaryAccount, Mapping.getDefaultFolderForGWType('E')], this.__value(), '', '', '', [function(bOK, aData) {
		this.btn_save._disabled(false);
		this.loader._destruct();
		gui.notifier._value({type: 'item_saved', args: [sPrimaryAccount, Mapping.getDefaultFolderForGWType('E')]});
		this.__updateList(bOK, aData);
	}.bind(this)]);
};

_me.__updateList = function(bOk, aData){
	if (bOk){

		//Notification
		if (gui.socket){
			var f = dataSet.get('folders',[sPrimaryAccount, Mapping.getDefaultFolderForGWType('E')]);
			if (f){

				var aOut = {
					'ACTION': 'add',
					'TYPE':'item',
					'ITEM': aData.id,
					'FOLDER':f.RELATIVE_PATH,
					'FOLDER-TYPE':f.TYPE,
					'EMAIL':sPrimaryAccount,
					'ITEM-TYPE': 'E',
					'owner': this._pathName
				};

				gui.socket.api._notify(aOut);
			}
		}

		this._parent._view('home', null, true);
	}
};
