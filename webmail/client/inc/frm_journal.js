_me = frm_journal.prototype;
function frm_journal(){};

_me.__constructor = function() {

	this._defaultSize(-1,-1,650,620);

	var me = this,
		aData = {};

	if (this._aValues.EVNFLAGS && this._aValues.EVNFLAGS&2)
		aData.schedule = true;
/*
	if (this._aValues.EVNORGANIZER){
		var tmp = MailAddress.splitEmailsAndNames(this._aValues.EVNORGANIZER);
		if (tmp && tmp[0] && tmp[0].email && tmp[0].email != sPrimaryAccount)
			aData.schedule = true;
	}
*/
	this._draw('frm_journal', 'main', aData);

	msiebox(this.maintab.tab1._getAnchor('msiebox'));

	//HTML Mode switcher
	this.maintab.tab1.EVNNOTE.select._fillLang({'enabled': "COMPOSE::HTML", 'disabled': "COMPOSE::TEXT", 'code':'RICH::CODE'});

	this.maintab.tab1.X_TYPE._fillLang({
		'Conversation': "JOURNAL::CONVERSATION",
		'Document': "JOURNAL::DOCUMENT",
		'E-mail Message': "JOURNAL::E-MAIL_MESSAGE",
		'Fax': "JOURNAL::FAX",
		'Letter': "JOURNAL::LETTER",
		'Conference': "JOURNAL::CONFERENCE",
		'Conference Cancellation': "JOURNAL::CONFERENCE_CANCELLATION",
		'Conference Request': "JOURNAL::CONFERENCE_REQUEST",
		'Conference Response': "JOURNAL::CONFERENCE_RESPONSE",
		'Microsoft Office Access': "JOURNAL::MICROSOFT_OFFICE_ACCESS",
		'Microsoft Office Excel': "JOURNAL::MICROSOFT_OFFICE_EXCEL",
		'Microsoft PowerPoint': "JOURNAL::MICROSOFT_POWERPOINT",
		'Microsoft Visio': "JOURNAL::MICROSOFT_VISIO",
		'Microsoft Word': "JOURNAL::MICROSOFT_WORD",
		'Note': "JOURNAL::NOTE",
		'Phone Call': "JOURNAL::PHONE_CALL",
		'Remote Session': "JOURNAL::REMOTE_SESSION",
		'Task': "JOURNAL::TASK",
		'Task Request': "JOURNAL::TASK_REQUEST",
		'Task Response': "JOURNAL::TASK_RESPONSE"
	});
	this.maintab.tab1.X_TYPE._value('Phone Call');

	if (Is.Defined(this._aValues._TZID)){
		this._aValues['EVNSTARTDATE'] = this._aValues._TZEVNSTARTDATE;
 		this._aValues['EVNENDDATE'] = this._aValues._TZEVNENDDATE;
		this._aValues['EVNSTARTTIME'] = this._aValues._TZEVNSTARTTIME;
		this._aValues['EVNENDTIME'] = this._aValues._TZEVNENDTIME;
		this._aValues['TZID'] = this._aValues._TZID;
	}

	this.__initForm('JOURNAL::JOURNAL');

	//Add DropZone
	this.maintab.tab3.X_ATTACHMENTS.file._dropzone(this.__eContainer);
	this.maintab.tab3.X_ATTACHMENTS._onuploadstart = function (){
		this._parent._active();
		me.x_btn_ok._disabled(true);
	};
	this.maintab.tab3.X_ATTACHMENTS._onuploadend = function(){
		me.x_btn_ok._disabled(false);
	};
};

_me.__print = function(aValues){
	aValues = aValues.values;
	if ((aValues._TZEVNSTARTDATE || aValues.EVNSTARTDATE)>0){
		if ((aValues._TZEVNSTARTTIME || aValues.EVNSTARTTIME) > 0) {
			aValues.COUNT_DATE = IcewarpDate.julian(aValues._TZEVNSTARTDATE || aValues.EVNSTARTDATE).setTime(aValues._TZEVNSTARTTIME || aValues.EVNSTARTTIME, true).format('L LT');
		} else {
			aValues.COUNT_DATE = IcewarpDate.julian(aValues._TZEVNSTARTDATE || aValues.EVNSTARTDATE).setTime(0, true).format('L');
		}
		if ((aValues._TZEVNENDTIME || aValues.EVNENDTIME) > 0) {
			aValues.COUNT_DATE += ' - ' +IcewarpDate.julian(aValues._TZEVNENDDATE || aValues.EVNENDDATE).setTime(aValues._TZEVNENDTIME || aValues.EVNENDTIME, true).format('L LT');
		} else {
			aValues.COUNT_DATE += ' - ' + IcewarpDate.julian(aValues._TZEVNENDDATE || aValues.EVNENDDATE).setTime(0, true).format('L');
		}
	}
	else
    	aValues.COUNT_DATE = '';

	if (!gui.print)
		gui._create('print','frm_print');

	gui.print._add('J',aValues);
};

_me.__loadItems = function() {

    if (!this._aValues.TZID){
    	this._aValues.TZID = GWOthers.getItem('CALENDAR_SETTINGS','timezone');
    	this._aValues.EVNTIMEFORMAT = 'Z';
    }

	//TAB 1
	var me = this,
		tab1 = this.maintab.tab1;

	if (gui._rtl || !this._aValues || !this._aValues.EVNDESCFORMAT || this._aValues.EVNDESCFORMAT.toLowerCase() != 'text/plain')
		tab1.EVNNOTE.select._value('enabled');
	else
		tab1.EVNNOTE.select._value('disabled');

	tab1.X_TIMEINTERVAL._value(this._aValues);

	loadDataIntoForm(tab1,this._aValues);

	//Copy contact name into window title
	tab1.EVNTITLE._onkeyup = function(){
		var sTitle = this._value();
		if (sTitle){
			if (sTitle.length>32)
			    sTitle = sTitle.substr(0,32)+'...';

			me._title(sTitle + (me._aValues.EVNFOLDER?' - '+me._aValues.EVNFOLDER:''),true);
		}
		else
			me._title(getLang('JOURNAL::JOURNAL') + (me._aValues.EVNFOLDER?' - '+me._aValues.EVNFOLDER:''),true);
	};
	tab1.EVNTITLE._onkeyup();

	if (Is.Defined(this._aValues['EVNLOCATION']) && this._aValues['EVNLOCATION'] != 'undefined') {
		var aTypeLocation = this._aValues['EVNLOCATION'].split('|');
		tab1.X_TYPE._value(aTypeLocation[0]);
		tab1.X_COMPANY._value(aTypeLocation[1]);
	}

	// TAB2 (attendees)
	if (this.maintab.tab2)
	this.maintab.tab2._onactive = function (bFirstTime) {
		if (bFirstTime){
			if (Is.Defined(me._aValues['CONTACTS']))
				this.X_ATTENDEES._value(me._aValues['CONTACTS']);
		}

		/*
		if (me._aValues['EVNFLAGS']&1)
			this.X_SCHEDULE.X_TIMETABLE.invitation._value(1);
		else
		if (me._aValues['EVNFLAGS']&2)
			this.X_SCHEDULE.X_TIMETABLE.invitation._disabled(true);
		*/
	}

	// TAB3 (attachments)
	if (this.maintab.tab3)
	this.maintab.tab3._onactive = function (bFirstTime) {
		if (bFirstTime){
			if (me._aValues['ATTACHMENTS']){
				var out = [];
				for (var i in me._aValues['ATTACHMENTS'])
					out.push({
						'name': me._aValues['ATTACHMENTS'][i]['values']['ATTDESC'],
						'class': me._aValues['ATTACHMENTS'][i]['values']['ATTTYPE'],
						'id': i,
						'ticket': me._aValues['ATTACHMENTS'][i]['values']['TICKET'],
						'fullpath': me._aValues.fullpath,
						'size': me._aValues['ATTACHMENTS'][i]['values']['ATTSIZE']}
						);

				if (me._aValues.fullpath)
					this.X_ATTACHMENTS._value({'values': out});
				else
					this.X_ATTACHMENTS._value({'path': me._sAccountID+'/'+me._sFolderID+'/'+WMItems.__serverID(me._sItemID), 'values': out});
			}
			else
			if (me._aValues['PUSH_ATTACHMENTS']){
				var out = [];
				for (var i in me._aValues['PUSH_ATTACHMENTS'])
					out.push({
						'name': me._aValues['PUSH_ATTACHMENTS'][i]['title'],
						'id': me._aValues['PUSH_ATTACHMENTS'][i]['id'],
						'size': me._aValues['PUSH_ATTACHMENTS'][i]['size'],
						'class': me._aValues['PUSH_ATTACHMENTS'][i]['embedded'] ? 'item' : 'itemlink',
						'fullpath': me._aValues['PUSH_ATTACHMENTS'][i]['fullpath']
					});

				this.X_ATTACHMENTS._value({
					path:me._aValues['PUSH_ATTACHMENTS'][0]['fullpath'].substr(0,me._aValues['PUSH_ATTACHMENTS'][0]['fullpath'].lastIndexOf('/')),
					values:out
				});
			}
		}
	}

	if (me._aValues['PUSH_ATTACHMENTS'] && this.maintab.tab3)
		this.maintab.tab3._active();
};

_me.__saveItems = function(aValues) {
	aValues['values']['EVNDESCFORMAT'] = this.maintab.tab1.EVNNOTE.select._value() == 'disabled'?'text/plain':'text/html';

	aValues['values']['EVNLOCATION'] = this.maintab.tab1.X_TYPE._value() + '|' + this.maintab.tab1.X_COMPANY._value();
	aValues['values'] = arrConcat(aValues['values'], this.maintab.tab1.X_TIMEINTERVAL._value());

	if (aValues.values['TZID'] == 'F'){
		aValues.values['EVNTIMEFORMAT'] = 'F';
		delete aValues.values['TZID'];
	}
	else
	if (aValues.values['EVNTIMEFORMAT'] == 'Z'){
		aValues.values['_TZEVNSTARTDATE'] = aValues.values['EVNSTARTDATE'];
        aValues.values['_TZEVNENDDATE'] = aValues.values['EVNENDDATE'];
        aValues.values['_TZEVNSTARTTIME'] = aValues.values['EVNSTARTTIME'];
		aValues.values['_TZEVNENDTIME'] = aValues.values['EVNENDTIME'];
		aValues.values['_TZID'] = aValues.values['TZID'];

		delete aValues.values['EVNSTARTDATE'];
		delete aValues.values['EVNENDDATE'];
		delete aValues.values['EVNSTARTTIME'];
		delete aValues.values['EVNENDTIME'];
		delete aValues.values['TZID'];
	}

	var addon;
	if (this.maintab.tab2 && this.maintab.tab2.X_ATTENDEES){
		if (!Is.Empty(addon = this.maintab.tab2.X_ATTENDEES._value())){
			aValues['CONTACTS'] = [];
			addon.forEach(function (item) {
				if(!item.values) {
					return aValues['CONTACTS'].push(item);
				}
				item.values.CNTROLE = item.values.CNTROLE || 'Q';
				item.values.CNTSTATUS = item.values.CNTSTATUS || 'B';
				aValues['CONTACTS'].push(item);
			});
			aValues['values'].EVNFLAGS = 1;
		} else {
			aValues['values'].EVNFLAGS = '';
		}
	}

	if (this.maintab.tab3 && this.maintab.tab3.X_ATTACHMENTS && !Is.Empty(addon = this.maintab.tab3.X_ATTACHMENTS._value()))
		aValues['ATTACHMENTS'] = addon;
}
