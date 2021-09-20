_me = frm_main_calendar.prototype;
function frm_main_calendar() {}
;

_me.__constructor = function (sDataset){
	//Reset Title
	gui.frm_main._title();

	var me = this;

	this._hasWorkView = parseInt(GWOthers.getItem('CALENDAR_SETTINGS', 'workweek_begins')) && parseInt(GWOthers.getItem('CALENDAR_SETTINGS', 'workweek_ends'));

	this.__sDataset = sDataset;
	dataSet.obey(this, null, sDataset);

	dataSet.remove('main_calendar');
	this.calendar._listen_data('main_calendar');

	this.calendar._onchange = function (aValues, bRefresh) {
		me._onItemChange(1, aValues, false, bRefresh);
	};
	this.calendar._onactivate = function (aValues) {
		gui.__exeEvent('itemSelected', [me.__aid, me.__fid].concat(aValues.length?aValues:[]));
	};
	this.calendar._onadd = function (aValues) {
		me._onItemAdd(aValues);
	};
	this.calendar._onremove = function (id, shift_key) {
		var oRepeating;
		if (Item.hasReccurence([me.__aid, me.__fid, id])) {
			oRepeating = dataSet.get('items', [me.__aid, me.__fid, id]);
		}

		Item.remove([me.__aid, me.__fid, [me._stripPipe(id)]], shift_key || false, oRepeating, this);
	};

	this.calendar._ondblclick = function (e, elm, arg) {
		switch (arg._event) {
			case 'event':
				var oRepeating = dataSet.get('items', [me.__aid, me.__fid, arg['id']]);
				Item.open([me.__aid, me.__fid, me._stripPipe(arg['id'])], oRepeating);
				break;

			case 'allday':
			case 'blank':
				if (!this.__rights.write)
					return;

				arg['enddate'] = arg['startdate'];

				if (arg._event == 'allday')
					arg['enddate']++;

				var nStartTime = (arg['starttime'] >= 0) ? arg['starttime'] / 60 : -1;
				var nEndTime = (arg['starttime'] >= 0) ? (arg['starttime'] / 60) + 30 : -1;

				if (arg._event == 'blank' && nEndTime == 1440){
					nEndTime = 0;
					arg['enddate']++;
				}

				var aInterval = {'EVNSTARTDATE': arg['startdate'], 'EVNSTARTTIME': nStartTime, 'EVNENDDATE': arg['enddate'], 'EVNENDTIME': nEndTime};
				Item.openwindow([me.__aid, me.__fid], aInterval);

				break;
		}
	};

	this.calendar._oncontext = function (e, elm, arg) {
		var aMenu = '',
			cmenu;

		arg['aid'] = me.__aid;
		arg['fid'] = me.__fid;

		switch (arg._event) {
			case 'allday':
			case 'blank':
				arg['enddate'] = arg['startdate'];

				if (arg._event == 'allday') {
					arg['enddate']++;
				}

				var nStartTime = (arg['starttime'] >= 0) ? arg['starttime'] / 60 : -1,
						nEndTime = (arg['starttime'] >= 0) ? (arg['starttime'] / 60) + 30 : -1,
						date = IcewarpDate.julian(arg['startdate']);

				aMenu = [
					{"title": 'POPUP_ITEMS::NEW', 'arg': [Item.createInFolder, [arg['aid'], arg['fid'], {
									'EVNSTARTDATE': arg['startdate'],
									'EVNSTARTTIME': nStartTime,
									'EVNENDDATE': arg['enddate'],
									'EVNENDTIME': nEndTime
								}]], 'disabled': !this.__rights.write}
				];
				break;

			case 'selection':
				var nStartTime;

				if (arg['starttime'] >= 0) {
					nStartTime = arg['starttime'] / 60;
				} else {
					nStartTime = -1;
					arg['enddate']++;
				}

				var nEndTime = (arg['endtime'] >= 0) ? arg['endtime'] / 60 : -1;

				aMenu = [{"title": 'POPUP_ITEMS::NEW', 'arg': [Item.createInFolder, [arg['aid'], arg['fid'], {
									'EVNSTARTDATE': arg['startdate'],
									'EVNSTARTTIME': nStartTime,
									'EVNENDDATE': arg['enddate'],
									'EVNENDTIME': nEndTime
								}]], 'disabled': !this.__rights.write}];


				//DELETE SELECTION 1
				if (!Is.Empty(arg['contains'])) {
					for (var i in arg['contains']) {
						if (arg['contains'][i].indexOf('|') < 0) {
							aMenu.push({"title": '-'}, {"title": 'POPUP_ITEMS::DELETE_SELECTED', 'arg': [Item.remove, [[arg['aid'], arg['fid'], arg['contains']]]], 'disabled': !this.__rights.remove});
							break;
						}
					}
				}

				break;

			case 'event':

				var origItem = me._stripPipe(arg['id']),
						id = [arg['aid'], arg['fid'], origItem],
						ids = [arg['aid'], arg['fid'], [origItem]];

				if (Item.hasReccurence([arg['aid'], arg['fid'], arg['id']])) {
					var oRepeating = dataSet.get('items', [arg['aid'], arg['fid'], arg['id']]);
				}
				var itmRights = {'read': true, 'write': true, 'modify': true, 'remove': true, 'owner': true};
				// overwrite rights if the event is not user's
				if (arg.owner != sPrimaryAccountGWID) {
//					itmRights = WMFolders.getAccess({'aid': sPrimaryAccount, 'fid': arg.evnfolder});
					itmRights = this.__rights;
				}

				cmenu = gui._create("cmenu", "obj_context_item");
				aMenu = cmenu.__createGWMenu(id, ids, 'E', false, oRepeating, itmRights);

				var nStartTime = (arg['starttime'] >= 0) ? arg['starttime'] / 60 : -1,
						nEndTime = (arg['starttime'] >= 0) ? (arg['starttime'] / 60) + 30 : -1;

				for (var i in aMenu) {
					if (aMenu[i].title == 'MAIN_MENU::NEW') {
						aMenu[i].arg = [Item.createInFolder, [arg['aid'], arg['fid'], {
									'EVNSTARTDATE': arg['startdate'],
									'EVNSTARTTIME': nStartTime,
									'EVNENDDATE': arg['enddate'],
									'EVNENDTIME': nEndTime
								}]];

						break;
					}
				}

				break;
		}

		if (aMenu) {

			if (arg._event != 'event') {
				aMenu.push(
						{"title": '-'},
						{"title": 'MAIN_MENU::DAY_VIEW', 'arg': [gui.frm_main, '_selectView', [{aid: me.__aid, fid: me.__fid}, 'day_view', true, date]]},
						{"title": 'MAIN_MENU::WEEK_VIEW', 'arg': [gui.frm_main, '_selectView', [{aid: me.__aid, fid: me.__fid}, 'week_view', true, date]]}
				);

				if (me._hasWorkView) {
					aMenu.push({"title": 'MAIN_MENU::WORKWEEK_VIEW', 'arg': [gui.frm_main, '_selectView', [{aid: me.__aid, fid: me.__fid}, 'workweek_view', true, date]]});
				}

				aMenu.push(
						{"title": 'MAIN_MENU::MONTH_VIEW', 'arg': [gui.frm_main, '_selectView', [{aid: me.__aid, fid: me.__fid}, 'month_view', true, date]]},
						{"title": 'MAIN_MENU::EVENTS_LIST', 'arg': [gui.frm_main, '_selectView', [{aid: me.__aid, fid: me.__fid}, 'list_view', true]]}
				);
			}

			if (!cmenu) {
				cmenu = gui._create("cmenu", "obj_context_item");
			}
			cmenu._fill(aMenu);
			cmenu._place(e.clientX, e.clientY);
		} else {
			cmenu._destruct();
		}
	};
};


_me._showsearch = function (aFolder, bFocus) {
	if (aFolder) {
		gui.frm_main.search._setFolder(aFolder);
		gui.frm_main.search._deactivate();

		gui.frm_main.search._onsearch = function (v) {
			gui.frm_main._selectView(aFolder, 'list_view', true, '', '', this._value());
		};
		gui.frm_main.search._focus(bFocus);
	}
};


_me._print = function (bCalendar) {

	this.__getFolder();
	var range = this.calendar._range();

	//Print Calendar view as it is
	if (bCalendar && this.calendar) {

		var frame = mkElement('iframe', {style: {left: '-500px', top: 0, height: '1px', width: '1px', position: 'absolute', zIndex: 0}});

		document.body.appendChild(frame);

		var doc = frame.contentDocument || frame.contentWindow.document,
				html = "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\"\n\"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">" +
				'<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">' +
				"\n<head>\n" +
				'<meta http-equiv="x-dns-prefetch-control" content="off" />' +
				'<base href="' + document.location.protocol + '//' + document.location.hostname + (document.location.port ? ':' + document.location.port : '') + document.location.pathname + '" />' +
				"\n</head>\n<body></body>\n</html>";

		doc.open('text/html', 'replace');
		doc.write(html);

		//STYLES
		doc.getElementsByTagName('head')[0].appendChild(mkElement('link', {type: "text/css", rel: "stylesheet", href: "client/skins/index.css"}, doc));
		doc.getElementsByTagName('head')[0].appendChild(mkElement('link', {type: "text/css", rel: "stylesheet", href: 'client/skins/' + GWOthers.getItem('LAYOUT_SETTINGS', 'skin') + '/css/css.php?' + buildURL({skin: GWOthers.getItem('LAYOUT_SETTINGS', 'skin'), palette: GWOthers.getItem('LAYOUT_SETTINGS', 'skin_style'), file: 'style.css'})}, doc));
		//print calendar styles
		doc.getElementsByTagName('head')[0].appendChild(mkElement('link', {type: "text/css", rel: "stylesheet", href: 'client/skins/' + GWOthers.getItem('LAYOUT_SETTINGS', 'skin') + '/css/css.php?' + buildURL({skin: GWOthers.getItem('LAYOUT_SETTINGS', 'skin'), palette: GWOthers.getItem('LAYOUT_SETTINGS', 'skin_style'), file: 'print_calendar.css'})}, doc));

		//HEADER
		var header = mkElement('div', {className: 'print_calendar'}, doc);

		//Date
		var dstr = IcewarpDate.julian(range.start).format('L');
		if (range.start < range.end) {
			dstr += ' - ' + IcewarpDate.julian(range.end).format('L');
		}

		//Legend
		var cal = false;
		if (this.__aid == sPrimaryAccount && this.__fid == '__@@VIRTUAL@@__/__@@EVENTS@@__') {

			cal = [];
			var cf = dataSet.get('folders', [this.__aid, this.__fid, 'VIRTUAL', 'FOLDERS']);
			if (cf) {
				for (var i in cf) {
					cal.push({name: i, color: getCalendarColor(i.str_replace('\\', '/'))});
				}
			}
		}

		header.innerHTML = template.tmp('print_calendar', {date: dstr, calendars: cal});

		//BODY
		doc.body.appendChild(header);
		var tree = this.calendar._main.cloneNode(true);
		// Remove time slots with no appointments from view
		if (hascss(tree, 'day') || hascss(tree, 'week')) {
			var top = GWOthers.getItem('CALENDAR_SETTINGS', 'day_begins') || 9;		// default beginning hour of day
			var bottom = GWOthers.getItem('CALENDAR_SETTINGS', 'day_ends') || 15;	// default ending hour of day

			var events = tree.getElementsByClassName('obj_evnviewevn');
			var original_events = this.calendar._main.getElementsByClassName('obj_evnviewevn');
			var times = tree.getElementsByClassName('tline');

			// Calculate beginning of first, and end of last, event
			var i = events.length;
			while (i--) {
				var day = original_events[i];
				if (day) {
					var y = parseInt(day.offsetTop);
					var t = Math.floor(y / 52);
					var b = Math.ceil((y + parseInt(day.style.height)) / 52);
					top = Math.min(top, t);
					bottom = Math.max(bottom, b);
				}
			}
			top = Math.floor(top);
			// Move events up to new first hour
			var i = events.length;
			while (i--) {
				var day = events[i];
				if (day) {
					day.style.top = parseInt(day.style.top) - top * 52 + 'px';
				}
			}
			// Shorten layout to new height
			var h = (bottom - top) * 52;
			tree.getElementsByClassName('obj_evnview_main')[0].style.height = h + 'px';
			tree.style.height = 'auto';
			// Remove time labeling after last last event
			while (times[0] && times[0].hasChildNodes() && times[0].children[bottom]) {
				times[0].removeChild(times[0].children[bottom]);
			}
			// Remove time labeling before the first event
			while (times[0] && top--) {
				times[0].removeChild(times[0].children[0]);
			}
			// Remove dimming of work hours
			times[0].parentNode.removeChild(tree.getElementsByClassName('time1')[0]);
			times[0].parentNode.removeChild(tree.getElementsByClassName('time2')[0]);
		}
		var add = tree.querySelector('.obj_evnviewblock');
		add && add.parentNode.removeChild(add);
		doc.body.appendChild(tree);

		doc.body.onload = function () {
			frame.contentWindow.focus();
			if (frame.contentWindow.document.queryCommandSupported('print')) {
				frame.contentWindow.document.execCommand('print', false, null);
			} else {
				frame.contentWindow.print();
			}

			setTimeout(function () {
//				frame.parentNode.removeChild(frame);
			}, 1000);
		};

		doc.close();

	}
	//Print list of events
	else {

		var aValues = ['EVNTITLE', 'EVNLOCATION', 'EVNSTARTDATE', 'EVNSTARTTIME', 'EVNENDDATE', 'EVNENDTIME', 'EVNRCR_ID', 'EVNCLASS', 'EVNTYPE', 'EVNNOTE'];
		WMItems.list({"aid": this.__aid, "fid": this.__fid, "values": aValues, "filter": {'interval': range['start'] + '-' + range['end']}}, '', '', '', [this, '__print']);
	}
};
_me.__print = function (aData) {

	var tmp = [];
//gui._create('print','frm_print');
	for (var i in aData)
		for (var j in aData[i]) {
			for (var k in aData[i][j])
				if (typeof aData[i][j][k] == 'object' && (aData[i][j][k].EVNCLASS == 'E' || aData[i][j][k].EVNCLASS == 'O')) {

					if (aData[i][j][k].EVNSTARTDATE > 0) {
						if (aData[i][j][k].EVNSTARTTIME > 0) {
							aData[i][j][k].COUNT_DATE = IcewarpDate.julian(aData[i][j][k].EVNSTARTDATE).setTime(aData[i][j][k].EVNSTARTTIME, true).format('L LT');
						} else {
							aData[i][j][k].COUNT_DATE = IcewarpDate.julian(aData[i][j][k].EVNSTARTDATE).setTime(0, true).format('L');
						}

						if (aData[i][j][k].EVNENDTIME > 0) {
							aData[i][j][k].COUNT_DATE += ' - ' + IcewarpDate.julian(aData[i][j][k].EVNSTARTDATE).setTime(aData[i][j][k].EVNENDTIME, true).format('L LT');
						} else {
							aData[i][j][k].COUNT_DATE += ' - ' + IcewarpDate.julian(aData[i][j][k].EVNENDDATE).setTime(0, true).format('L');
						}
					} else
						aData[i][j][k].COUNT_DATE = '';

					tmp.push(aData[i][j][k]);

				}

			tmp = tmp.sort(function (a, b) {
				var x = a['EVNSTARTDATE'] - b['EVNSTARTDATE'];
				if (x == 0)
					x = (a['EVNSTARTTIME'] - b['EVNSTARTTIME']);
				if (x == 0)
					x = a['EVNENDDATE'] - b['EVNENDDATE'];
				if (x == 0)
					x = (a['EVNENDTIME'] - b['EVNENDTIME']);
				return x;
			});

			for (var i = 0; i < tmp.length; i++)
				(gui.print || gui._create('print', 'frm_print'))._add('E', tmp[i]);

			return;
		}
};

_me.__update = function ()
{
	if (Is.Defined(this.calendar)) {
		//set rights for calendar object
		this.calendar._rights(WMFolders.getAccess({'aid': this.__aid, 'fid': this.__fid}));

		this.__refresh();
	}
};

_me._serverSort = function (sView)
{
	this.__getFolder();

	var range = this.calendar._range();

	if (!Is.Defined(range['start'])) {
		//set rights for calendar object
		this.calendar._rights(WMFolders.getAccess({'aid': this.__aid, 'fid': this.__fid}));
		return;
	}

	var aValues = WMItems.default_values('EI');
	WMItems.list({"aid": this.__aid, "fid": this.__fid, "values": aValues, "filter": {'interval': range['start'] + '-' + range['end']}}, 'items');

	if(!this.calendar_view) {
		this._create("calendar_view", "obj_hmenu_calendar_view", 'change_view');
	}
	this.calendar_view.__menu({aid: this.__aid, fid: this.__fid});
};

_me._onItemAdd = function (aValues) {

	/*
	 aResultValues = {values:{
	 'EVNTITLE':aValues.title,
	 'EVNSHARETYPE':GWOthers.getItem('DEFAULT_CALENDAR_SETTINGS','event_sharing'),
	 'EVNFLAGS':{F:4,T:8,O:16,S:0}[GWOthers.getItem('DEFAULT_CALENDAR_SETTINGS','event_show_as')] || 0,

	 '_TZEVNSTARTTIME':aValues.starttime<0?-1:aValues.starttime/60,
	 '_TZEVNENDTIME':aValues.endtime<0?-1:aValues.endtime/60,
	 '_TZEVNSTARTDATE':aValues.startdate,
	 '_TZEVNENDDATE':aValues.enddate,
	 '_TZID': GWOthers.getItem('CALENDAR_SETTINGS','timezone'),
	 'EVNTIMEFORMAT':'Z'
	 }};
	 */

	var aResultValues = {
		'EVNTITLE': aValues.title,
		'EVNSHARETYPE': GWOthers.getItem('DEFAULT_CALENDAR_SETTINGS', 'event_sharing'),
		'EVNFLAGS': {F: 4, T: 8, O: 16, S: 0}[GWOthers.getItem('DEFAULT_CALENDAR_SETTINGS', 'event_show_as')] || 0
	};

	if (aValues.starttime < 0) {
		aResultValues['EVNSTARTTIME'] = -1;
		aResultValues['EVNENDTIME'] = -1;
		aResultValues['EVNSTARTDATE'] = aValues.startdate;
		aResultValues['EVNENDDATE'] = aValues.enddate;
		aResultValues['EVNTIMEFORMAT'] = 'F';
	} else {
		aResultValues['_TZEVNSTARTTIME'] = aValues.starttime / 60;
		aResultValues['_TZEVNENDTIME'] = aValues.endtime / 60;
		aResultValues['_TZEVNSTARTDATE'] = aValues.startdate;
		aResultValues['_TZEVNENDDATE'] = aValues.enddate;
		aResultValues['_TZID'] = GWOthers.getItem('CALENDAR_SETTINGS', 'timezone');
		aResultValues['EVNTIMEFORMAT'] = 'Z';
	}
	aResultValues = {values: aResultValues};

	//Resources Folder
	if (this.__aid == sPrimaryAccount) {
		var fid = this.__fid;
		if (fid == '__@@VIRTUAL@@__/__@@EVENTS@@__') {
			var aCalendars = dataSet.get('folders', [sPrimaryAccount, '__@@VIRTUAL@@__/__@@EVENTS@@__', 'VIRTUAL', 'FOLDERS']);
			for (var i in aCalendars)
				if (aCalendars[i]) {
					fid = i;
					break;
				}
		}

		if (fid.indexOf(dataSet.get('main', ['resources_path']) + '/') == 0) {
			aResultValues.values.EVNFLAGS |= 1;

			aResultValues['CONTACTS'] = [{
					values: {
						CNTEMAIL: sPrimaryAccount,
						CNTROLE: 'Q'
					}
				}];
		}
	}

	if (aResultValues.values.EVNSTARTTIME < 0)
		aResultValues.values.EVNENDDATE++;

	var aReminderDefault = GWOthers.get('EVENT_SETTINGS', 'storage');
	if (aReminderDefault && (aReminderDefault = aReminderDefault['VALUES']) && aReminderDefault.default_reminder == '1') {

		var time = aReminderDefault.time,
				days = 0,
				hours = 0,
				minutes = 0;

		if (time > 0) {
			var days = Math.floor(time / 86400000);
			time %= 86400000;
			var hours = Math.floor(time / 3600000);
			time %= 3600000;
			var minutes = Math.floor(time / 60000);
		}

		aResultValues.REMINDERS = [{values: {
					RMNDAYSBEFORE: days,
					RMNHOURSBEFORE: hours,
					RMNMINUTESBEFORE: minutes
				}}];
	}

	WMItems.add([this.__aid, this.__fid], aResultValues, 'dummy', '', '', [this, '__addEventHandler', [this.__aid, this.__fid, true]]);
};
/*
 nEditType:
 0 .. edit only this instance
 1 .. edit all instances
 2 .. all following*
 */
_me._onItemChange = function (nEditType, aValues, bIgnoreRepeating, bRefresh) {

	var sAccId = this.__aid;
	var sFolId = this.__fid;
	var sItId = aValues['id'] ? this._stripPipe(aValues['id']) : '';
	var bRepeats = sItId ? Item.hasReccurence([sAccId, sFolId, aValues['id']]) : false;

	// New - Do not ask, just apply "Only this instance" option
	if (bRepeats) {
		nEditType = 0;
	}

	/* Old
	 if (bRepeats && !bIgnoreRepeating){
	 // invoke dialog to confirm type of the repeating (only this item or all items) and callback this function again
	 var cfm = gui._create('frm_confirm','frm_confirm_repeating', '','', [this, '_onItemChange', [aValues, true]],'REPEATING_CONFIRM::TITLE_EDIT','REPEATING_CONFIRM::TEXT_EDIT_2');
	 var me = this;
	 cfm._onclose = function(){
	 me.__refresh();
	 return true;
	 };
	 return;
	 }
	 */

	var nStartTime = (aValues['starttime'] >= 0) ? aValues['starttime'] / 60 : -1;
	var nEndTime = (aValues['endtime'] >= 0) ? aValues['endtime'] / 60 : -1;

	var aResultValues = {'EVNSTARTTIME': nStartTime, 'EVNENDTIME': nEndTime};

	if (Is.Defined(aValues['evntimeformat'])) {
		aResultValues.EVNTIMEFORMAT = aValues['evntimeformat'];
	}

	if (Is.Defined(aValues['title']) && aValues['title']) {
		aResultValues.EVNTITLE = aValues['title'];
	}

	switch (nEditType.toString()) {
		//all following
		case '2':
			if (bRepeats)
				aResultValues['EXPFOLLOWING'] = 'true';

			//this instance
		case '0':
			if (bRepeats) {
				var oRepeating = dataSet.get('items', [sAccId, sFolId, aValues['id']]);
				aResultValues['EXPDATE'] = oRepeating['EVNSTARTDATE'];
				aResultValues['EVNSTARTDATE'] = aValues['startdate'];
				aResultValues['EVNENDDATE'] = (nStartTime >= 0) ? aValues['enddate'] : aValues['enddate'] + 1;
				break;
			}
			//all
		default:

			/*
			 Pokud se posouva instanci uvnitr opakovani <-->
			 chova se to jako by se posouvalo 1. instanci opakovani
			 */

			if (!bRepeats || sItId == aValues['id']) {
				aResultValues['EVNSTARTDATE'] = aValues['startdate'];
				aResultValues['EVNENDDATE'] = (nStartTime >= 0) ? aValues['enddate'] : aValues['enddate'] + 1;
			} else {
				var oRepeating1 = dataSet.get('items', [sAccId, sFolId, aValues['id']]);

				aResultValues['EVNSTARTDATE'] = parseInt(aValues.osd) + parseInt(aValues.startdate) - parseInt(oRepeating1.EVNSTARTDATE);
				aResultValues['EVNENDDATE'] = parseInt(aValues.oed) + parseInt(aValues.enddate) - parseInt(oRepeating1.EVNENDDATE);
			}
	}

	//Posíláme update na server
	WMItems.add([sAccId, sFolId, sItId], {"values": aResultValues}, 'dummy', '', '', [this, '__addEventHandler', [sAccId, sFolId, bRepeats, bRefresh]]);
};

_me._stripPipe = function (s) {
	return s.split('|')[0];
};

_me._createEvent = function ()
{
	var aSelection = clone(this.calendar._selection);

	if (!Is.Empty(aSelection)) {
		var nStartTime;

		if (aSelection['starttime'] >= 0)
			nStartTime = aSelection['starttime'] / 60;
		else {
			nStartTime = -1;
			aSelection['enddate']++;
		}

		var nEndTime = (aSelection['endtime'] >= 0) ? aSelection['endtime'] / 60 : -1;
		var aInterval = {'EVNSTARTDATE': aSelection['startdate'], 'EVNSTARTTIME': nStartTime, 'EVNENDDATE': aSelection['enddate'], 'EVNENDTIME': nEndTime};
		Item.openwindow([this.__aid, this.__fid], aInterval);
	} else {
		Item.openwindow([this.__aid, this.__fid], getActualEventTime());
	}
};

_me._getDate = function () {
	var aSelection = this.calendar._selection;
	if (aSelection && aSelection.startdate) {
		var date = new IcewarpDate(aSelection.startdate, {format:IcewarpDate.JULIAN});
		return date;
	} else {
		return (this.__date) ? this.__date : new IcewarpDate();
	}
};


_me.__onServerResponse = function (sAccId, sFolId, nStart, nEnd)
{
	if (!Is.Defined(this.calendar))
		return;
	var aRange = this.calendar._range();

	if (this.__aid == sAccId && this.__fid == sFolId && aRange['start'] == nStart && aRange['end'] == nEnd)
		this.__refresh();
};

_me.__refresh = function () {
	var aValues = dataSet.get('items', [this.__aid, this.__fid]),
			aFillData = [];

	for (var i in aValues) {
		if (i === '/' || i === '#' || i === '$' || i === '@') {
			continue;
		}
		try {
			aFillData.push({
				'starttime': (aValues[i]['EVNSTARTTIME'] >= 0) ? aValues[i]['EVNSTARTTIME'] * 60 : -1,
				'endtime': (aValues[i]['EVNENDTIME'] >= 0) ? aValues[i]['EVNENDTIME'] * 60 : -1,
				'startdate': aValues[i]['EVNSTARTDATE'],
				'enddate': parseInt(aValues[i]['EVNENDDATE'], 10) + (aValues[i]['EVNSTARTTIME'] < 0 ? -1 : 0),
				'evntimeformat': aValues[i]['EVNTIMEFORMAT'],
				'evnflags': aValues[i]['EVNFLAGS'],
				'title': aValues[i]['EVNTITLE'],
				'conferenceid': aValues[i]['EVNMEETINGID'] ? parseInt(aValues[i]['EVNMEETINGID']) : undefined,
				'osd': aValues[i]['OSD'],
				'oed': aValues[i]['OED'],
				'evnrcr_id': aValues[i]['EVNRCR_ID'],
				'rmnevn_id': aValues[i]['RMNEVN_ID'],
				'evnclass': aValues[i]['EVNCLASS'],
				'evntype': aValues[i]['EVNTYPE'],
				'evnsharetype': aValues[i]['EVNSHARETYPE'],
				'location': aValues[i]['EVNLOCATION'],
				'owner': aValues[i]['EVNOWN_ID'],
				'evnfolder': aValues[i]['EVNFOLDER'],
				'evnowneremail': aValues[i]['EVNOWNEREMAIL'],
				'fcolor': (this.__aid == sPrimaryAccount && this.__fid == '__@@VIRTUAL@@__/__@@EVENTS@@__' && aValues[i]['EVNFOLDER'] ? getCalendarColor(Path.slash(aValues[i]['EVNFOLDER'])) : ''),
				'id': i
			});
		} catch (e) {
			console.log(e);
		}
	}

	dataSet.add('main_calendar', '', aFillData, true);
	dataSet.update('main_calendar');
};

_me.__addEventHandler = function (bOk, sAccId, sFolId, bRec, bRefresh) {

	if (bOk == false) {
		this.__update();
	}
	if (bRec || bRefresh) {
		this._serverSort();
	}
};

_me.__getStartDay = function () {
	storage.library('gw_others');
	var aCalendarSettings = (new gw_others).get('CALENDAR_SETTINGS', 'storage')['VALUES'];

	if (aCalendarSettings['begin_on_today'] != '0') {
		return (new IcewarpDate()).day();
	} else {
		if (Is.Defined(aCalendarSettings['week_begins'])) {
			var aDays = {'sunday': 0, 'monday': 1, 'tuesday': 2, 'wednesday': 3, 'thursday': 4, 'friday': 5, 'saturday': 6};
			return aDays[aCalendarSettings['week_begins']];
		} else {
			return 0;
		}
	}
};

_me.__getWorkingHours = function () {
	storage.library('gw_others');

	var sTime = {};
	sTime['start'] = GWOthers.getItem('CALENDAR_SETTINGS', 'day_begins');
	sTime['end'] = GWOthers.getItem('CALENDAR_SETTINGS', 'day_ends');

	return sTime;
};

_me.__getFolder = function () {
	// var aItems = dataSet.get(this.__sDataset);

	// for (var sAccId in aItems) {
	// 	for (var sFolId in aItems[sAccId]) {
	// 		this.__aid = sAccId;
	// 		this.__fid = sFolId;
	// 		return;
	// 	}
	// }
	var path = Path.split(dataSet.get('current_folder'), true);
	this.__aid = path.aid;
	this.__fid = path.fid;
};
