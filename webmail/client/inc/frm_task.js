_me = frm_task.prototype;
function frm_task(){};
_me.__constructor = function() {
	var me = this;

	this._defaultSize(-1,-1,800,640);

	storage.library('purify.wrapper', 'purify');

    var aData = {
		disable_html : !GWOthers.getItemAccess('MAIL_SETTINGS_DEFAULT','html_message') && '0' === GWOthers.getItem('MAIL_SETTINGS_DEFAULT','html_message')
	};

	var tmpf = Path.split(this._sFolderID)[0];
    if (dataSet.get('folders',[this._sAccountID,tmpf,'TYPE'])=='A')
		aData.owner = tmpf;
	else
	    aData.owner = this._sAccountID;

	if (this._aValues.EVNFLAGS && this._aValues.EVNFLAGS&2)
		aData.attendees = true;

	this._draw('frm_task', 'main', aData);

	var tab1 = this.maintab.tab1;
	msiebox(tab1._getAnchor('msiebox'));

	//HTML Mode switcher
	tab1.EVNNOTE.select._fillLang({'enabled': "COMPOSE::HTML", 'disabled': "COMPOSE::TEXT", 'code':'RICH::CODE'});
	//tab1.EVNNOTE.select._value(gui._rtl?'enabled':'disabled');

	// Keyboard esc from rich text area to close window
	tab1.EVNNOTE._onesc = function() {
		me._close(true);
	};


	tab1.EVNSTATUS._fillLang({
		'B':["TASK::NOT_STARTED",'','ico not_started'],
		'I':["TASK::IN_PROGRESS",'','ico in_progress'],
		'M':["TASK::COMPLETED",'','ico completed'],
		'Q':["TASK::DEFERRED",'','ico deferred'],
		'N':["TASK::WAITING",'','ico waiting']
	});

	setTimeout(function() {
		this.__initForm('TASK::TASK');
	}.bind(this), 5);

    tab1.EVNSTARTDATE._ondateselect = function(){
		var tmp0 = this._getObjectDate(),
			tmp1 = this._parent.EVNENDDATE._getObjectDate();

		if (tmp0){
			if (tmp1 && tmp0 < tmp1)
				this._parent.EVNENDDATE._value(this._value(), true);
		}
		else
			this._parent.EVNENDDATE._value('empty',true);

		//set STARTDATE for RCR default date
		me._aValues['EVNSTARTDATE'] = this._value();
	};

    tab1.EVNENDDATE._ondateselect = function(){
		var tmp0 = this._getObjectDate(),
			tmp1 = this._parent.EVNSTARTDATE._getObjectDate();

		if (tmp0 && (!tmp1 || tmp0> tmp1))
			this._parent.EVNSTARTDATE._value(this._value(), true);

		//set ENDDATE for RCR default date
  		me._aValues['EVNENDDATE'] = this._value();
	};

	tab1.EVNSTATUS._onchange = function() { me.__setEvncomplete(); }
	tab1.X_EVNCOMPLETE._onchange = function() { me.__setEvnstatus(); }

	//Add DropZone
	this.maintab.tab4.X_ATTACHMENTS.file._dropzone(this.__eContainer);
	this.maintab.tab4.X_ATTACHMENTS._onuploadstart = function (){
		me.x_btn_ok._disabled(true);
		this._parent._active();
	};
	this.maintab.tab4.X_ATTACHMENTS._onuploadend = function(){
		me.x_btn_ok._disabled(false);
	};

	// Refresh list and preview in case tags were changed
	tab1.EVNTYPE.input._onChange = function(){
		this.__refreshView = true;
	}.bind(this);
};

_me.__print = function(aValues){
	aValues = aValues.values;
   	aValues.COUNT_DATE = '';

	if ('text/html' === aValues.EVNDESCFORMAT) {
		aValues.EVNNOTE = DOMPurify.sanitize(aValues.EVNNOTE);
	}

	if (aValues.EVNENDDATE>0){
        aValues.COUNT_DATE = IcewarpDate.julian(aValues.EVNENDDATE).format('L');

	}
	if (aValues.EVNSTARTDATE>0){
		aValues.COUNT_DATE += ' - ' + IcewarpDate.julian(aValues.EVNSTARTDATE).format('L');
	}

	if (!gui.print)
		gui._create('print','frm_print');

	gui.print._add('T', aValues);
};

_me.__setEvncomplete = function(sValue){
	var tab1 = this.maintab.tab1;

	switch (tab1.EVNSTATUS._value()[0]){
		case 'B':
			tab1.X_EVNCOMPLETE._value(0);
			tab1.X_EVNCOMPLETE._disabled(true);
			break;
		case 'M':
			tab1.X_EVNCOMPLETE._value(100);
			tab1.X_EVNCOMPLETE._disabled(true);
			break;
		default:
			if (Is.Defined(sValue)) tab1.X_EVNCOMPLETE._value(sValue);
			tab1.X_EVNCOMPLETE._disabled(false);
			break;
	}
};

_me.__setEvnstatus = function() {
	var tab1 = this.maintab.tab1,
		curval = parseInt(tab1.X_EVNCOMPLETE._value());

	/*
	if (!Is.Number(curval) || curval <= 0)
		tab1.EVNSTATUS._value('B');
	else
		*/
	if (curval >= 100)
		tab1.EVNSTATUS._value('M');
};

_me.__loadItems = function() {
	var me = this,
		tab1 = this.maintab.tab1;

	if (gui._rtl || !this._aValues || !this._aValues.EVNDESCFORMAT || this._aValues.EVNDESCFORMAT.toLowerCase() != 'text/plain')
		tab1.EVNNOTE.select._value('enabled');
	else
		tab1.EVNNOTE.select._value('enabled');

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
			me._title(getLang('TASK::TASK') + (me._aValues.EVNFOLDER?' - '+me._aValues.EVNFOLDER:''),true);
	};
	tab1.EVNTITLE._onkeyup();

	if (!this._aValues['EVNSTARTDATE'] || this._aValues['EVNSTARTDATE'] == 'undefined')
		tab1.EVNSTARTDATE._value('empty');

	if (!this._aValues['EVNENDDATE'] || this._aValues['EVNENDDATE'] == 'undefined')
		tab1.EVNENDDATE._value('empty');

	if (inArray(['B','I', 'M', 'Q', 'N'], this._aValues['EVNSTATUS']) == -1)
		tab1.EVNSTATUS._value('B');

	this.__setEvncomplete(this._aValues['EVNCOMPLETE']);

	if (typeof this._aValues['EVNPRIORITY'] == 'undefined') tab1.EVNPRIORITY._value('0');

	if (Is.Defined(this._aValues['REMINDERS']))
		tab1.X_REMINDERS._value(this._aValues['REMINDERS']);


	// TAB2 (recurrence)
	this.maintab.tab2._onactive = function (bFirstTime) {
		if (bFirstTime) {

			this.X_REPEATING._onerror = function(has_error){
				me.x_btn_ok._disabled(has_error);
			};

			var recurrence = shiftObject(me._aValues['RECURRENCES']);
			if (recurrence != null)
				this.X_REPEATING._value(recurrence);
		}

		if (Is.Defined(me._aValues['EVNENDDATE'] || me._aValues['EVNSTARTDATE'])) {
			this.X_REPEATING._setDate(IcewarpDate.julian(me._aValues['EVNENDDATE'] || me._aValues['EVNSTARTDATE']));
		}
	};

	// TAB5 (Attendee)
	if (this.maintab.tab5)
	this.maintab.tab5._onactive = function (bFirstTime) {
		if (bFirstTime)
			if (Is.Defined(me._aValues['CONTACTS']))
				this.X_ATTENDEES._value(me._aValues['CONTACTS']);
	};

	// TAB4 (attachments)
	if (this.maintab.tab4)
	this.maintab.tab4._onactive = function (bFirstTime) {
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

	if (me._aValues['PUSH_ATTACHMENTS'] && this.maintab.tab4)
		this.maintab.tab4._active();
};

_me.__onBeforeSave = function () {
	!this.maintab.tab1.EVNTITLE._value() && this.maintab.tab1.EVNTITLE._value(getLang('TASK::NEW'));
};

_me.__saveItems = function(aValues) {

	var tab1 = this.maintab.tab1;

	aValues['values']['EVNDESCFORMAT'] = tab1.EVNNOTE.select._value() == 'disabled'?'text/plain':'text/html';
	tab1.EVNNOTE.__output_format = aValues.values.EVNDESCFORMAT !== 'text/plain';
	aValues.values.EVNNOTE = tab1.EVNNOTE._value();

	aValues['values']['EVNSTARTDATE'] = aValues['values']['EVNSTARTDATE'] || 0;
	aValues['values']['EVNENDDATE'] = aValues['values']['EVNENDDATE'] || 0;

	aValues['values']['EVNSTARTTIME'] = -1;
	aValues['values']['EVNENDTIME'] = -1;
	aValues['values']['EVNCOMPLETE'] = tab1.X_EVNCOMPLETE._value();

	var addon;
	if (!Is.Empty(addon = tab1.X_REMINDERS._value()))
		aValues['REMINDERS'] = addon;

	// TAB2
	if (this.maintab.tab2.X_REPEATING && !Is.Empty(addon = this.maintab.tab2.X_REPEATING._value())){
		if (!aValues.values.EVNSTARTDATE) {
			aValues.values.EVNSTARTDATE = (new IcewarpDate()).format(IcewarpDate.JULIAN);
		}

		aValues['RECURRENCES'] = [addon];
	}
	else
	if (!aValues.values.EVNSTARTDATE && this._aValues && this._aValues.EVNRCR_ID)
    	aValues['RECURRENCES'] = [{uid:this._aValues.EVNRCR_ID}];

	// TAB4
	if (this.maintab.tab4 && this.maintab.tab4.X_ATTACHMENTS && !Is.Empty(addon = this.maintab.tab4.X_ATTACHMENTS._value()))
		aValues['ATTACHMENTS'] = addon;

	// TAB5
	if (this.maintab.tab5 && this.maintab.tab5.X_ATTENDEES){
		if (!Is.Empty(addon = this.maintab.tab5.X_ATTENDEES._value())){
			aValues['CONTACTS'] = [];
			addon.forEach(function (item) {
				if(!item.values) {
					return aValues['CONTACTS'].push(item);
				}
				item.values.CNTROLE = item.values.CNTROLE || 'Q';
				item.values.CNTSTATUS = item.values.CNTSTATUS || 'B';
				aValues['CONTACTS'].push(item);
			});
		}

		aValues['values'].EVNFLAGS = this._aValues.EVNFLAGS || 0;
		if (aValues['values'].EVNFLAGS & 2)
			aValues['values'].EVNFLAGS = aValues['values'].EVNFLAGS & ~1;
		else
			aValues['values'].EVNFLAGS = aValues['values'].EVNFLAGS | 1;
	}
};
