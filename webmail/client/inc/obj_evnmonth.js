_me = obj_evnmonth.prototype;
function obj_evnmonth() {};

_me.__constructor = function () {
	var me = this;

	this._active = new IcewarpDate();
	this._dDate = new IcewarpDate();

	this.__range = {};
	this.__value;
	this.__idTable = [];
	this.__activeEvent;
	this.__iToday;

	this._row_height = 24; // Height + 2 (margin)

	//access rights
	this.__rights = {'read': true, 'write': true, 'modify': true, 'remove': true};

	this.__holidays = false; //Byly vykresleny holidays v danem range?

	this._selection = {startdate: 0, enddate: 0};
	this.__noRefresh = false;

	//Get offset & Create calendar header
	storage.library('gw_others');
//	var aDays = {'monday': 1, 'tuesday': 2, 'wednesday': 3, 'thursday': 4, 'friday': 5, 'saturday': 6, 'sunday': 0};
//	try {
//		this.__offset = aDays[GWOthers.get('CALENDAR_SETTINGS', 'storage')['VALUES']['week_begins']];
//	} catch (er) {
//		this.__offset = 1;
//	}
//	IcewarpDate.setCustomWeekStart(this.__offset);
	var aData = {"days": IcewarpDate.weekdaysShort()};

	this._getAnchor('header').innerHTML = template.tmp('obj_evnmonth_header', aData);

	//Quick Edit/Add
	this.__edit = false;
	this.__editEvent = '';

	this.__eIN = this._getAnchor('input');
	this.__eIN.onkeyup = function (e) {

		if (!me.__edit) {

			var e = e || window.event,
					newEvn = {};

			if (!me.__rights.modify) {
				if (!me.__activeEvent || !(newEvn = me._useItem(me.__activeEvent)) || newEvn.owner != sPrimaryAccountGWID)
					return;
			}

			switch (e.keyCode) {
				//Enter
				case 13:
					//Esc
				case 27:
					this.value = '';
					return false;

					//Delete
				case 46:
					gui.generaltooltip && !gui.generaltooltip._destructed && gui.generaltooltip._destruct();
					if (me.__activeEvent && (newEvn = me._useItem(me.__activeEvent)) && !newEvn.disabled && me.__rights.remove) {
						if (me._onremove)
							me._onremove(me.__activeEvent, e.shiftKey);
						me.__exeEvent('_onremove', null, {"owner": me, "event": me.__activeEvent});
					}

					break;

					//F2 (edit)
				case 1000:
				case 113:

					if (me.__activeEvent && (newEvn = me._useItem(me.__activeEvent))) {

						if (newEvn.disabled || newEvn.startdate < me.__range['start'] || newEvn.startdate > me.__range['end'])
							return;

						me.__edit = true;
						if (e.keyCode == 113)
							this.value = newEvn.title;
						me.__editEvent = me.__activeEvent;
						me.__createEdit();
						me.__edit = false;
					}

					return false;

					//KeyPress (add)
				default:
					if (this.value.length) {
						// check if selection is in current range
						if (!me._selection.startdate && me._selection.startdate >= me.__range['start'] && me._selection.startdate <= me.__range['end']) {
							newEvn = clone(me._selection);
							newEvn.starttime = -1;
							newEvn.endtime = -1;
							newEvn.evnclass = 'E';
							newEvn.id = 'edit';
							newEvn.title = this.value || '';

							//me._selection = {};

							me.__edit = true;

							me.__activeEvent = newEvn.id;
							me.__value.push(newEvn);

							me.__editEvent = me.__activeEvent;
							me._fill(me.__value);
							me.__edit = false;
						} else
						if (me.__activeEvent && (newEvn = me._useItem(me.__activeEvent)))
							this.onkeyup({keyCode: 1000});
						/*
						 else
						 me.__activeEvent = '';
						 */
					}
			}
		}
	};

	this._main.onmousedown = function (e) {
		var e = e || window.event,
				elm = e.target || e.srcElement;

		if (elm.tagName !== 'INPUT') {
			me._focus();
		}
	};
	//MSIE needs onmouseup too...
	this._main.onmouseup = this._main.onmousedown;

	this.__eMain = this._getAnchor('main');
	this._scrollbar(this.__eMain, this.__eMain.parentNode);

	// Events handling
	this.__eMain.ondblclick = function (e) {
		var e = e || window.event,
				elm = e.target || e.srcElement;
		if (elm === this) {
			return;
		}

		var info = me.__getInfo(e, elm), arg = null;
		switch (info['type']) {
			case 'TD':
			case 'TH':
				var d = new Date(), e = new Date(d);
				var msSinceMidnight = e - d.setHours(0,0,0,0);
				arg = {"startdate": info.pos, "starttime": msSinceMidnight / 1000, "_event": 'blank'};
				break;

			case 'SPAN':
			case 'B':
			case 'INS':
			case 'I':
			case 'P':
			for (var i = 0; i < me.__idTable.length; i++)
				if (me.__idTable[i].id == info.id) {
					arg = clone(me.__idTable[i]);
					arg._event = 'event';
					if (arg.starttime < 0)
						arg.enddate = parseInt(arg.enddate) + 1;

					break;
				}
		}

		if (arg && !arg.disabled) {
			if (me._ondblclick) {
				me._ondblclick(e, elm, arg);
			}
			me.__exeEvent('ondblclick', e, {"elm": elm, "owner": me, "arg": arg});
		}
	};

	// CONTEXT MENU HANDLER
	this.__eMain.oncontextmenu = function (e) {
		var e = e || window.event,
				elm = e.target || e.srcElement;
		if (elm === this) {
			return;
		}

		var info = me.__getInfo(e, elm), arg = null;

		switch (info['type']) {
			case 'TD':
			case 'TH':
				if (info.pos < me._selection.startdate || info.pos > me._selection.enddate) {
					me.__draw_selection(info.pos);
				}

				arg = {"startdate": me._selection.startdate, "enddate": me._selection.enddate, "_event": 'selection'};

				//Obsazene Events
				arg.contains = [];
				for (var i in me.__value) {
					if (me.__value[i].evnclass == 'E' && me.__value[i].startdate >= me._selection.startdate && me.__value[i].enddate <= me._selection.enddate) {
						arg.contains.push(me.__value[i].id);
					}
				}
				break;
			case 'SPAN':
			case 'INS':
			case 'B':
			case 'I':
			case 'P':
				for (var i = 0; i < me.__idTable.length; i++) {
					if (me.__idTable[i].id == info.id) {
						arg = clone(me.__idTable[i]);
						arg._event = 'event';
						break;
					}
				}

				me._activate(info);

				if (arg.starttime < 0) {
					arg.enddate = parseInt(arg.enddate) + 1;
				}
		}

		if (arg) {
			if (me._oncontext) {
				me._oncontext(e, elm, arg);
			}
			me.__exeEvent('oncontext', e, {"elm": elm, "owner": me, "arg": arg});
		}
		return false;
	};

	this.__eMain.ondrag = function () {
		return false;
	};

	this.__eMain.onclick = function (e) {
		var e = e || window.event,
				elm = e.target || e.srcElement;

		if (elm.tagName == 'EM') {

			e.__source = {obj: me, skip: true, type: me._type, name: me._pathName};

			var cell = getSize(elm.parentNode),
					view = getSize(me._main),
					w = cell.w > 250 ? cell.w : 250;

			this.preview = gui._create('preview', 'obj_dayview', '', '', me);
			this.preview._place(view.x + view.w < cell.x + w + 20 ? view.x + view.w - w + 20 : cell.x, view.y, w, view.h);

			var info = me.__getInfo(e, elm);
			this.preview._setRange(info.pos);
			this.preview._listen_data(me._listener_data, me._listenerPath_data);
		}
	};

	this.__eMain.onmousedown = function (e) {

		var e = e || window.event,
				elm = e.target || e.srcElement;

		if (elm.tagName == 'INPUT' || elm === this || e.button == 2)
			return;

		var sAction = 'move';
		var info = me.__getInfo(e, elm);


		switch (info['type']) {

			case 'TH':
			case 'TD':

				me.__draw_selection(info.pos);

				//Create selection
				gui._obeyEvent('mouseup', [me, '__mouseup']);
				this.onmousemove = function (e) {
					var e = e || window.event,
							elm = e.target || e.srcElement;
					if (elm == this)
						return;

					var info2 = me.__getInfo(e, elm);
					if (info2.pos >= info.pos)
						me.__draw_selection(info.pos, info2.pos);
					else
						me.__draw_selection(info2.pos, info.pos);
				};

				break;

			case 'SPAN':
				if (elm.parentNode.tagName == 'P')
					sAction = (Math.abs(e.layerX || e.offsetX) < 10) ? 'start' : 'end';
			case 'INS':
			case 'B':
			case 'I':
			case 'P':
				//Activate selected Event
				me._activate(info);

				//get Item
				var arg = null, itm = null;
				for (var i = 0; i < me.__value.length; i++)
					if (me.__value[i].id == info.id) {
						itm = me.__value[i];
						arg = clone(itm);
						break;
					}

				//Previously edited event (waiting for refresh)
				if (arg != null && !arg.disabled) {

					if (!me.__rights.modify && (!itm || itm.owner != sPrimaryAccountGWID))
						return false;

					//if (e.preventDefault) e.preventDefault();

					var cursor_offset = info.pos - arg['start'];
					if (!Is.Number(cursor_offset))
						return false;

					//stop
					gui._obeyEvent('mouseup', [me, '__mouseup', [arg, itm]]);
					this.onmousemove = function (evn) {
						var evn = evn || window.event,
								elm = evn.target || evn.srcElement;
						if (elm == this)
							return;

						var info2 = me.__getInfo(evn, elm);

						//Do some magic
						if (info2.pos > 0) {

							if (sAction == 'move' && itm.startdate != info2.pos - cursor_offset) {
								info2.pos -= cursor_offset;
								var tmp = parseInt(itm.enddate, 10) - parseInt(itm.startdate, 10);
								itm.startdate = parseInt(info2.pos, 10);
								itm.enddate = parseInt(info2.pos, 10) + tmp;
								me._fill(me.__value);
							} else
							if (sAction == 'start' && itm.startdate != info2.pos && info2.pos <= itm.enddate) {
								itm.startdate = info2.pos;
								me._fill(me.__value);
							} else
							if (sAction == 'end' && info2.pos >= itm.startdate) {

								//Evn ends at 0:00
								if (itm.endtime === 0)
									itm.enddate = info2.pos+1;
								else
									itm.enddate = info2.pos;

								me._fill(me.__value);
							} else
								return;

							if (!hascss(this, 'dragged'))
								addcss(this, 'dragged');
						}
					};
				}
		}

		return false;
	};
};
_me.__mouseup = function (e, tmp, arg, itm) {
	gui._disobeyEvent('mouseup', [this, '__mouseup']);
	this.__eMain.onmousemove = null;

	removecss(this.__eMain, 'dragged');

	if (arg && itm && (arg.startdate != itm.startdate || arg.enddate != itm.enddate)) {
		var out = {
			starttime: itm.starttime,
			endtime: itm.endtime,
			startdate: itm.startdate,
			enddate: itm.enddate,
			evnclass: itm.evnclass,
			evntimeformat: itm.evntimeformat,
			id: itm.id,
			tmp_id: itm.tmp_id
		};

		if (this._onchange)
			this._onchange(out);
		this.__exeEvent('onchange', null, {"owner": this, "event": out});
	}
};
_me.__getIDs = function (id) {
	var out = [], i;
	for (i = 0; i < this.__idTable.length; i++)
		if (this.__idTable[i].id == id)
			out.push(this.__idTable[i].tmp_id);

	return out;
};
_me.__getInfo = function (evn, elm) {
	var pos, elm = elm, sType, id, tmp_id;

	switch (elm.tagName) {
		case 'EM':
		case 'H3':
		case 'DIV':
			while (true) {
				elm = elm.parentNode;
				if (elm.tagName == 'TD' || elm.tagName == 'TH')
					break;
				if (elm == this)
					return;
			}

		case 'TD':
		case 'TH':
			sType = elm.tagName;
			if (elm.id)
				pos = parseInt(elm.id.substr(elm.id.lastIndexOf(elm.id.indexOf('#') > -1 ? '#' : '/') + 1), 10);

			break;
		case 'SPAN':
		case 'INS':
		case 'B':
		case 'I':
			sType = 'SPAN';

			if (elm.parentNode.tagName == 'SPAN')
				offset = 8;

			elm = Is.Child(elm, 'P');
		case 'P':

			if (elm.id && (tmp_id = id = elm.id.substr(elm.id.lastIndexOf(elm.id.indexOf('#') > -1 ? '#' : '/') + 1))) {
				sType = sType || 'P';

				pos = parseInt(elm.getAttribute('rel'), 10);

				//more days
				var iDays;
				if ((iDays = parseInt(elm.style.width, 10) / 100) > 1) {
					var aPos = getSize(elm);
					pos += Math.floor((evn.clientX - aPos.x) / (aPos.w / iDays));
				}

				var p;
				if ((p = id.indexOf('-')) > -1)
					id = id.substr(0, p);
			}
	}

	return {pos: pos, elm: elm, 'type': sType, tmp_id: tmp_id, id: id};
};

_me._fill = function (aDataIn) {
	//*** Draw GRID ***
	var today = new IcewarpDate();
	var aData = {"days": IcewarpDate.weekdaysShort()};
	var aTags = dataSet.get('tags') || {};

	this._getAnchor('header').innerHTML = template.tmp('obj_evnmonth_header', aData);
	if (gui._rtl) {
		this._getAnchor('header').querySelector('.table_header').setAttribute('dir', 'rtl');
	}

	if (this._dDate.format(IcewarpDate.JULIAN) !== +this.__range['start'] || this.__iToday !== today.format(IcewarpDate.JULIAN)) {
		var start_day = new IcewarpDate(+this._dDate).startOf('month').startOf('week');
		var month = today.month();
		var end_day = new IcewarpDate(+this._dDate).endOf('month').endOf('week').add(1, 'day');
		var aWeek = [];
		var week = [];
		var start = start_day.clone();
		this.__range['start'] = start_day.format(IcewarpDate.JULIAN);
		while (!start_day.isSame(end_day, 'day')) {
			var current_month = start_day.month();
			week.push({
				julian: start_day.format(IcewarpDate.JULIAN),
				value: start_day.date(),
				_date: +GWOthers.getItem('CALENDAR_SETTINGS', 'alternative_calendar') >= 0 ? start_day.clone({calendar: +GWOthers.getItem('CALENDAR_SETTINGS', 'alternative_calendar')}) : false,
				class: (start_day.isSame(today, 'day') ? 'today ' : '') + (current_month === month ? 'month ' : '')
			});
			start_day.add(1, 'day');
			if (start_day.day() === IcewarpDate.firstDayOfWeek()) {
				aWeek.push(week.slice(0));
				week = [];
			}
		}
		var end = start_day.clone().subtract(1, 'days');
		this.__range['end'] = start_day.format(IcewarpDate.JULIAN);

		if (+GWOthers.getItem('CALENDAR_SETTINGS', 'alternative_calendar') >= 0) {
			start = start.clone({calendar: +GWOthers.getItem('CALENDAR_SETTINGS', 'alternative_calendar')});
			end = end.clone({calendar: +GWOthers.getItem('CALENDAR_SETTINGS', 'alternative_calendar')});
			gui.frm_main.main._main.querySelector('.alternative_calendar').textContent = start.format('LL') + ' - ' + end.format('LL');
		}

		//Draw Month Grid
		var str;
		if(gui._rtl) {
			str = ['<table border="0" class="evnmonth_calendar" dir="rtl"><tbody>'];
		} else {
			str = ['<table border="0" class="evnmonth_calendar"><tbody>'];
		}
		for (var i = 0; i < aWeek.length; i++) {
			str.push('<tr class="day_header">');
			for (var j = 0; j < aWeek[i].length; j++)
				str.push('<th id="' + this._pathName + '#' + aWeek[i][j].julian + '"' + (aWeek[i][j]['class'] ? ' class="' + aWeek[i][j]['class'] + '"' : '') + '><h3 unselectable="on"><em></em>' + aWeek[i][j].value + (aWeek[i][j]._date ? ('<span style="font-weight: normal;"> / ' + aWeek[i][j]._date.date()+ '</span>') : '') + '</h3></th>');

			str.push('</tr><tr class="days">');

			for (var j = 0; j < aWeek[i].length; j++) {
				str.push('<td id="' + this._pathName + '/' + aWeek[i][j].julian + '"' + (aWeek[i][j]['class'] ? ' class="' + aWeek[i][j]['class'] + '"' : '') + ' unselectable="on">');
				str.push('</td>');
			}
			str.push('</tr>');
		}
		str.push('</tbody></table>');

		this.__eMain.innerHTML = str.join('');

		//Smazem holidays aby se vytvorili znova
		this.__holidays = false;

		//Vykresli selection
		this.__draw_selection();

		//Auto-scroll to Today
		this.__autoscroll = true;
	}


//////////////////////////////////////////////


	//*** Prepare Data ***
	var holidays = {},
		bBreak = false,
		tmpEvn, tmpEvn2;

	if (typeof aDataIn == 'object') {
		this.__value = aDataIn; //clone?
		this.__idTable = [];

		var bCelsius = GWOthers.getItem('CALENDAR_SETTINGS', 'temperature') == 'C',
				aLoc;

		for (var i in this.__value) {
			this.__value[i].startdate = parseInt(this.__value[i].startdate, 10);
			this.__value[i].enddate = parseInt(this.__value[i].enddate, 10);

			//holidays
			if (this.__value[i].evnclass == 'H') {
				if (!this.__holidays)
					for (var j = this.__value[i]['startdate']; j <= this.__value[i]['enddate']; j++) {

						if (!holidays[j])
							holidays[j] = [this.__value[i]];
						else
							holidays[j].push(this.__value[i]);

						/*
						 if (this.__value[i]['location']){
						 //Weather
						 if (this.__value[i]['location'].indexOf('type=weather')==0){
						 aLoc = parseURL(this.__value[i]['location']);
						 holidays[j].push([(bCelsius?aLoc.c_hi+'°C':aLoc.f_hi+'°F')+ ' ' + aLoc.loc,(bCelsius?aLoc.c_hi+'°C / '+aLoc.c_lo+'°C':aLoc.f_hi+'°F / '+aLoc.f_lo+'°F')+' '+aLoc.loc,'weather ico_'+aLoc.icon,'%'+aLoc.loc]);
						 }
						 //Holiday
						 else
						 holidays[j].push([this.__value[i]['title'],'',this.__value[i]['location'].indexOf('type=public')==0?'public':'',this.__value[i]['title']]);
						 }
						 //Old system (can be removed)
						 else
						 holidays[j].push([this.__value[i]['title'],'',this.__value[i].evntype == 'Public Holiday'?'public':'',this.__value[i]['title']]);

						 holidays[j].sort(function(a,b){
						 return a[3]<b[3]?-1:(a[3]>b[3]?1:0);
						 });
						 */
					}
			}
			//Ostatni
			else {
				this.__value[i].starttime = parseInt(this.__value[i].starttime, 10);
				this.__value[i].endtime = parseInt(this.__value[i].endtime, 10);

				tmpEvn = this.__value[i];

				//**** oriznout presahujici udalosti
				tmpEvn['start'] = tmpEvn.startdate < this.__range['start'] ? this.__range['start'] : tmpEvn.startdate;
				tmpEvn['end'] = tmpEvn.enddate > this.__range['end'] ? this.__range['end'] : tmpEvn.enddate;
				tmpEvn['startt'] = tmpEvn.starttime;
				tmpEvn['endt'] = tmpEvn.endtime;
				tmpEvn['tmp_id'] = tmpEvn.id;

				//Evn ends at 0:00
				if (tmpEvn['startdate']<tmpEvn['enddate'] && tmpEvn['endtime'] === 0)
				 	tmpEvn['end']--;

				//**** doplnit barvicky
				tmpEvn.color = '';
				tmpEvn.taglist = '';
				if (tmpEvn.evntype) {
					var arr = tmpEvn.evntype.split(','),
							at = {}, sColor;

					for (var t in arr)
						if ((arr[t] = arr[t].trim()).length) {
							sColor = aTags[arr[t]] && aTags[arr[t]].TAGCOLOR ? aTags[arr[t]].TAGCOLOR : '#FFFFFF';

							if (!at[sColor])
								at[sColor] = [];

							at[sColor].push(arr[t]);
						}

					for (var t in at) {
						tmpEvn.color += '<ins title="' + at[t].join(', ').escapeHTML().replace(/"/g, '&quot;') + '" style="background-color:' + t + '"></ins>';
						tmpEvn.taglist += '<li><ins style="background-color:' + t + '"></ins>' + at[t].join(', ').escapeHTML() + '</li>';
					}
				}

				//**** rozsekat eventy
				//Vicedenni?
				bBreak = false;
				if (tmpEvn['start'] != tmpEvn['end']) {
					var no = 0;
					//deli se v tydnu?
					for (var j = tmpEvn['start'] + 1; j <= tmpEvn['end']; j++) {
						if (!((j - this.__range['start']) % 7)) {
							bBreak = true;

							if (j - tmpEvn['start'] < 8) {
								tmpEvn2 = clone(tmpEvn);
								tmpEvn2['end'] = j - 1;
								tmpEvn2['endt'] = 86400;
								tmpEvn2['tmp_id'] = tmpEvn2.id + '-' + (no++);
								this.__idTable.push(tmpEvn2);
							}

							tmpEvn2 = clone(tmpEvn);
							tmpEvn2['start'] = j;
							tmpEvn2['startt'] = 0;
							tmpEvn2.tmp_id = tmpEvn2.id + '-' + (no++);

							if (tmpEvn2['end'] - j > 6) {
								tmpEvn2['end'] = j + 6;
								tmpEvn2['endt'] = 86400;
							}
							this.__idTable.push(tmpEvn2);
						}
					}
				}
				if (!bBreak)
					this.__idTable.push(tmpEvn);
			}




		}

		//**** Draw holidays
		if (!this.__holidays && !Is.Empty(holidays)) {
			this.__holidays = true;

			var aLoc;
			for (var i in holidays)
				if ((elm = document.getElementById(this._pathName + '#' + i))) {

					//Sort
					holidays[i].sort(this.__holSort);

					for (var j = 0; j < holidays[i].length; j++) {

						var div = document.createElement('div');
						div.unselectable = "on";

						if (holidays[i][j].evntype == 'Weather') {
							// {c_hi: "18",c_lo: "8",cond: "Partly Cloudy",f_hi: "64",f_lo: "46",icon: "partly_cloudy",length: 0,loc: "Stockholm, Sweden (EN)",type: "weather"}
							aLoc = parseURL(holidays[i][j]['location']);

							if (!Is.Empty(aLoc) && GWOthers.getItem('RESTRICTIONS', 'DISABLE_WEATHER_SETTING') == 0) {
								aLoc.city = aLoc.loc.split(',')[0];
								aLoc.low = bCelsius ? aLoc.c_lo + '°C' : aLoc.f_lo + '°F';
								aLoc.high = bCelsius ? aLoc.c_hi + '°C' : aLoc.f_hi + '°F';
								div.appendChild(document.createTextNode(aLoc.high + ' ' + aLoc.city));
								div.className = "weather ico_" + aLoc.icon;
								AttachEvent(div, 'onmouseover', this._showTooltip({template: 'obj_event_weather', values: aLoc}));
							}
						} else {
							div.appendChild(document.createTextNode(holidays[i][j]['title']));
							div.title = holidays[i][j]['title'];

							if (holidays[i][j]['location'] && holidays[i][j]['location'].indexOf('type=public') > -1)
								div.className = "holiday public";
							else
								div.className = "holiday";
						}

						elm.appendChild(div);
					}
				}
		}

		//**** Draw Events
		//Rozradit do Weeku
		var aOut = {}, iWeek, elm;

		for (var i = parseInt(this.__range['start'], 10); i < this.__range['end']; i += 7)
			aOut[i] = [];

		for (var i = 0; i < this.__idTable.length; i++) {
			iWeek = Math.floor((this.__idTable[i]['start'] - this.__range['start']) / 7) * 7 + this.__range['start'];
			if (aOut[iWeek])
				aOut[iWeek].push(this.__idTable[i]);
		}

		//Seradit weeky
		var elm, sHTML, infos, skip, ymax, css, noTitle = getLang('EVENT_VIEW::NO_TITLE'), privateTitle = getLang('EVENT_VIEW::PRIVATE'), t1;
		for (var iWeek in aOut) {
			aOut[iWeek].sort(this.__evnSort);

			//RENDER
			sHTML = '';
			y = 0;
			ymax = 0, infos = [];
			if ((elm = document.getElementById(this._pathName + '/' + iWeek))) {
				for (var i in aOut[iWeek]) {
					infos[i] = {};
					aOut[iWeek][i].y = 0;
					skip = {};
					infos[i].title = aOut[iWeek][i].title ? aOut[iWeek][i].title : (aOut[iWeek][i].evnsharetype === 'U' ? noTitle : privateTitle);

					for (var j in aOut[iWeek]) {
						if (j == i)
							break;
						if (aOut[iWeek][j]['start'] <= aOut[iWeek][i]['start'] && aOut[iWeek][j]['end'] >= aOut[iWeek][i]['start']) {
							if (aOut[iWeek][i].y == aOut[iWeek][j].y) {
								while (true)
									if (!skip[++aOut[iWeek][i].y])
										break;
							} else
							if (aOut[iWeek][i].y < aOut[iWeek][j].y)
								skip[aOut[iWeek][j].y] = true;
						}
					}

					ymax = ymax < aOut[iWeek][i].y ? aOut[iWeek][i].y : ymax;

					//CSS
					css = [];
					if (aOut[iWeek][i]['start'] != aOut[iWeek][i]['startdate'])
						css.push('openStart');
					if (aOut[iWeek][i]['end'] != aOut[iWeek][i]['enddate'] && !(aOut[iWeek][i]['endtime'] === 0 && aOut[iWeek][i]['end']+1 === aOut[iWeek][i]['enddate']))
						css.push('openEnd');

					if (!this.__rights.modify && aOut[iWeek][i].owner != sPrimaryAccountGWID)
						css.push('disabled');
					else
					if (aOut[iWeek][i].id == this.__activeEvent)
						css.push('active');

					if (aOut[iWeek][i].conferenceid)
						css.push('conference');

					if (aOut[iWeek][i].color)
						css.push('color');

					if (aOut[iWeek][i].fcolor)
						css.push(aOut[iWeek][i].fcolor);

					if (aOut[iWeek][i].evnflags & 32)
						css.push('unresponded');

					if (aOut[iWeek][i].evnflags & 4)
						css.push('F');
					if (aOut[iWeek][i].evnflags & 8)
						css.push('T');
					if (aOut[iWeek][i].evnflags & 16)
						css.push('O');

					// Preparing date and time information for display
					t1 = t2 = false;
					infos[i].start = IcewarpDate.julian(aOut[iWeek][i].startdate).setTime(aOut[iWeek][i].starttime);
					infos[i].end = IcewarpDate.julian(aOut[iWeek][i].enddate).setTime(aOut[iWeek][i].endtime);
					if(aOut[iWeek][i].endtime === -1){
						infos[i].end.add(1, 'day');
						infos[i].start.add(1, 'day');
					}
					if (aOut[iWeek][i].starttime > -1) { // Add time info if any
						infos[i].starttime = infos[i].start.format('LT');
						infos[i].endtime = infos[i].end.format('LT');
						if (iWeek <= aOut[iWeek][i].startdate) // Starting this week (not before)
							t1 = infos[i].starttime;
						if (parseInt(iWeek, 10) + 6 >= aOut[iWeek][i].enddate) // Ending this week (not later)
							t2 = infos[i].endtime;
					} else {
						infos[i].starttime = '';
						infos[i].endtime = '';
					}
					infos[i].duration = aOut[iWeek][i].enddate - aOut[iWeek][i].startdate;

					if (infos[i].duration) { // Longer than one day
						infos[i].duration = new IcewarpNumber(infos[i].duration + 1).localize() + ' ' + getLang(infos[i].duration + 1 ? 'TIME::MOREDAYS' : 'TIME::ONEDAY');
					} else {
						if (infos[i].starttime && infos[i].endtime) { // During day with time
							infos[i].duration = IcewarpDate.duration(infos[i].end.diff(infos[i].start)).humanize();
						} else { // Allday
							infos[i].duration = '1 ' + getLang('TIME::ONEDAY');
						}
					}
					if(infos[i].start.isSame(infos[i].end, 'day')){
						infos[i].end = '';
					}else{
						infos[i].end = infos[i].end.format('L');
					}
					infos[i].start = infos[i].start.format('L');
					infos[i].reminder = !!aOut[iWeek][i].rmnevn_id;
					infos[i].recurrent = !!aOut[iWeek][i].evnrcr_id;
					infos[i].location = aOut[iWeek][i].location || '';
					infos[i].tags = aOut[iWeek][i].taglist;

					// for tooltip
					//if (aOut[iWeek][i].evnowneremail != sPrimaryAccount)
					infos[i].owner = aOut[iWeek][i].evnowneremail;

					// Putting together html to display
					sHTML += '<p rel="' + aOut[iWeek][i]['start'] + '" id="' + this._pathName + '/' + aOut[iWeek][i].tmp_id + '" style="' +
							'width:' + ((aOut[iWeek][i]['end'] - aOut[iWeek][i]['start'] + 1) * 100) + '%;' +
							(gui._rtl ? 'right' : 'left') + ':' + ((aOut[iWeek][i]['start'] - iWeek) * 100) + '%;' +
							'top:' + (aOut[iWeek][i].y * this._row_height + 10) + 'px;' +
							'" ' + (css.length ? 'class="' + css.join(' ') + '"' : '') + //<B> for OPERA
							'>' +
							'<span unselectable="on"><span unselectable="on">' +
							aOut[iWeek][i].color +
							'<b unselectable="on">' +
							(t1 ? '<i unselectable="on">' + t1 + '</i>' : '') +
							//(t1?'<i unselectable="on"'+ (t1&&t2?' class="nopadding"':'') +'>'+ t1 +'</i>':'') +
							//(t1&&t2?'<i class="middot">&middot;</i>':'') +
							//(t2?'<i unselectable="on">'+ t2 +'</i>':'') +
							infos[i].title.entityify() + '</b></span></span></p>';
				}

				elm.style.height = (((ymax + 1) * this._row_height) + 30) + 'px';
				elm.innerHTML = '<div style="height: 100%">' + sHTML + '</div>';

				// Adding tooltip with more information
				var p = elm.getElementsByTagName('P');
				for (var i = 0; i < p.length; i++){
					AttachEvent(p[i], 'onmouseover', this._showTooltip({template: 'obj_event_tooltip', values: infos[i]}));
				}
			}
		}
	}

	//Activate Edit
	if (this.__edit)
		this.__createEdit();
	else
	//Auto Scroll to Today
	if (this.__autoscroll && Is.Defined(aDataIn)) {
		this.__autoscroll = false;
		var id = 'gui.frm_main.main.calendar/'+(new IcewarpDate().format(IcewarpDate.JULIAN));
		var element = document.getElementById(id);
		if(element && element.parentElement && element.parentElement.previousElementSibling){
			element.parentElement.previousElementSibling.scrollIntoView();
		}
		var go;
		if (this._selection.startdate && this._selection.startdate > this.__range['start'] && this._selection.startdate < this.__range['end'])
			go = this._selection.startdate;
		else
		if (this.__iToday > this.__range['start'] && this.__iToday < this.__range['end'])
			go = this.__iToday;
		else
			return;

		var elm = document.getElementById(this._pathName + '/' + go);
		if (elm) {
			var p1 = getSize(this.__eMain),
					p2 = getSize(elm);

			if (p1.y > p2.y)
				this.__eMain.scrollTop -= p1.y - p2.y + 50;
			else
			if (p1.y + p1.h < p2.y + p2.h)
				this.__eMain.scrollTop += p2.y + p2.h - p1.y - p1.h + 50;
		}


	}
};


_me.__createEdit = function () {

	if (this.__edit && this.__editEvent) {
		var me = this, elm, ids, inp,
				itm = this._useItem(this.__editEvent);

		if (!itm || (!(elm = document.getElementById(this._pathName + '/' + this.__editEvent)) && (!(ids = this.__getIDs(this.__editEvent)) || !(elm = document.getElementById(this._pathName + '/' + ids[0]))))) {
			this.__noRefresh = false;
			return;
		}

		//draw INPUT
		this.__noRefresh = true;
		elm.innerHTML = '<span><input type="text" /></span>';

		//clear TITLE from remaining parts
		if (ids) {
			var tmp;
			for (var i = 1; i < ids.length; i++)
				if ((tmp = document.getElementById(this._pathName + '/' + ids[i])))
					tmp.innerHTML = '<span><span></span></span>';
			tmp = null;
		}

		//Bind input actions
		if ((inp = elm.getElementsByTagName('INPUT')) && (inp = inp[0])) {
			inp.onkeydown = function (e) {
				var e = e || window.event;
				switch (e.keyCode) {
					case 27:
						this.value = '';
					case 13:
						this.onblur();
						return false;
				}
			};

			inp.ondblclick = function (e) {
				var e = e || window.event;
				e.cancelBubble = true;
				if (e.preventDefault)
					e.preventDefault();
				return false;
			};

			inp.onblur = function (e) {

				// save
				if (this.value.length) {
					//update in __value
					for (var i = me.__value.length - 1; i > - 1; i--)
						if (me.__value[i].id == me.__editEvent) {

							//save only different Title
							if (me.__value[i].title != this.value) {
								me.__value[i].title = this.value.trim();

								//send to server
								me.__noRefresh = false;

								if (me.__editEvent == 'edit') {
									me.__value[i].disabled = true;
									if (me._onadd)
										me._onadd(me.__value[i]);
									me.__exeEvent('onadd', null, {"owner": me, "event": me.__value[i]});
								} else {
									delete me.__value[i].disabled;
									if (me._onchange)
										me._onchange(me.__value[i]);
									me.__exeEvent('onchange', null, {"owner": me, "event": me.__value[i]});
								}
							} else
								delete me.__value[i].disabled;

							break;
						}
				} else
				// destroy on Esc
				if (me.__editEvent == 'edit')
					for (var i = me.__value.length - 1; i > - 1; i--)
						if (me.__value[i].id == me.__activeEvent) {
							me.__value.splice(i, 1)[0];
							break;
						}

				me.__editEvent = '';

				if (me.__activeEvent == 'edit')
					me.__activeEvent = '';

				me.__noRefresh = false;
				me._fill(me.__value);

				//Return focus back
				me._focus();
			};

			inp.focus();
			inp.value = this.__eIN.value || '';
		}
	}
};


_me.__draw_selection = function (iStart, iEnd) {
	var bForce = false;
	if (typeof iStart == 'undefined') {
		iStart = this._selection.startdate;
		iEnd = this._selection.enddate;
		bForce = true;
	} else {
		iEnd = !iEnd || iEnd < iStart ? iStart : iEnd;
		for (var elm, i = this._selection.startdate; i <= this._selection.enddate; i++)
			if ((i < iStart || i > iEnd) && (elm = this.__getCol(i))) {
				removecss(elm[0], 'selected');
				removecss(elm[1], 'selected');
			}
	}

	for (i = iStart; i <= iEnd; i++)
		if ((bForce || i < this._selection.startdate || i > this._selection.enddate) && (elm = this.__getCol(i))) {
			addcss(elm[0], 'selected');
			addcss(elm[1], 'selected');
		}

	this._selection = {startdate: iStart, enddate: iEnd};

	if (iStart > 0)
		this._activate('');
};

_me.__getCol = function (iJulian) {
	var elm, out = [];
	if ((elm = document.getElementById(this._pathName + '#' + iJulian))) {
		out.push(elm);
		if ((elm = document.getElementById(this._pathName + '/' + iJulian))) {
			out.push(elm);
			return out;
		}
	}

	return false;
};

_me.__holSort = function (a, b) {
	//Holidays vs Weather
	if (a.evntype == 'Weather' && b.evntype != 'Weather')
		return -1;
	else
	if (a.evntype != 'Weather' && b.evntype == 'Weather')
		return 1;
	else
	//Holiday Location
	if (a.evntype != 'Weather' && a.evnfolder && b.evnfolder) {
		if (a.evnfolder < b.evnfolder)
			return -1;
		else
		if (a.evnfolder > b.evnfolder)
			return 1;
	}

	//Title
	if (a['title'] && b['title']) {
		if (a['title'] < b['title'])
			return -1;
		else
		if (a['title'] == b['title'])
			return 0;
		else
			return 1;
	} else
	//ID
	if (a['id'] < b['id'])
		return -1;
	else
	if (a['id'] == b['id'])
		return 0;
	else
		return 1;
};

_me.__evnSort = function (a, b) {
	var tmp = (a['start'] + a['startt'] / 100000) - (b['start'] + b['startt'] / 100000) || (b['end'] + b['endt'] / 100000) - (a['end'] + a['endt'] / 100000);
	if (tmp == 0) {
		if (a.title < b.title)
			return -1;
		else
		if (a.title > b.title)
			return 1;
	}

	return tmp;
};

_me._value = function (v) {
	if (!this.__noRefresh && Is.Object(v))
		this._fill(v);
	else
		return this.__value;
};
_me._range = function (aData) {
	if (aData) {
		this._active = new IcewarpDate();
		this._dDate = new IcewarpDate();

		if (aData instanceof IcewarpDate) {
			this._active = aData;
			this._dDate.year(aData.year()).month(aData.month()).date(1);
		} else {
			this._active = new IcewarpDate(aData, {format: IcewarpDate.JULIAN});
			this._dDate = new IcewarpDate(aData, {format: IcewarpDate.JULIAN}).date(1);
		}

		this._fill();
	} else
		return this.__range;
};

_me._rights = function (v) {
	if (!v)
		return this.__rights;
	this.__rights = v;
	/*
	 if (this.__rights.modify)
	 removecss(this.__eMain,'obj_evnmonth_nomove');
	 else
	 addcss(this.__eMain,'obj_evnmonth_nomove');
	 */
};


_me.__update = function (sDataSet) {

	if (!sDataSet || this.__noRefresh)
		return;

	/* update evenst */
	if (this._listener_data == sDataSet)
		this._value(dataSet.get(this._listener_data, this._listenerPath_data));

	/* update range */
	if (this._listener == sDataSet)
		this._range(dataSet.get(this._listener, this._listenerPath));
};
_me._listen_data = function (sDataSet, aDataPath) {
	this._listener_data = sDataSet;
	if (typeof aDataPath == 'object')
		this._listenerPath_data = aDataPath;
	dataSet.obey(this, '_listener_data', sDataSet);
};


_me._activate = function (info) {
	if (Is.Defined(info) && (info.id || '') != this.__activeEvent) {
		var elm;
		//deactivate
		if (this.__activeEvent) {
			if ((elm = document.getElementById(this._pathName + '/' + this.__activeEvent)))
				removecss(elm, 'active');
			else {
				var ids = this.__getIDs(this.__activeEvent);
				for (var i = 0; i < ids.length; i++)
					if ((tmp = document.getElementById(this._pathName + '/' + ids[i])))
						removecss(tmp, 'active');
			}
		}

		//activate
		var itm;
		if (info.id && (this.__rights.modify || ((itm = this._useItem(info.id)) && itm.owner == sPrimaryAccountGWID))) {

			this.__activeEvent = info.id;

			if (info.tmp_id != info.id) {
				ids = this.__getIDs(info.id);
				for (var i = 0; i < ids.length; i++)
					if ((tmp = document.getElementById(this._pathName + '/' + ids[i])))
						addcss(tmp, 'active');
			} else {
				addcss(info.elm, 'active');
			}

			// Update top menu bar to enable context editing
			gui.__exeEvent('itemSelected', [this._parent.__aid, this._parent.__fid, [this.__activeEvent]]);

			//clear selection
			this.__draw_selection(0);
		} else {
			this.__activeEvent = '';

			// Update top menu bar
			gui.__exeEvent('folderSelected', [this._parent.__aid, this._parent.__fid]);
		}

		if (this._onactivate)
			this._onactivate([this.__activeEvent]);
		this.__exeEvent('onactivate',null,{"value":[this.__activeEvent],"owner":this});

	} else
		return this.__activeEvent;
};

_me._useItem = function (id, aValue) {
	for (var i = this.__value.length - 1; i > - 1; i--)
		if (this.__value[i].id == id)
			if (aValue) {
				this.__value[i] = aValue;
				break;
			} else
				return clone(this.__value[i]);
};

_me._focus = function () {
	this.__eIN.value = '';
	this.__eIN.focus();
};
/**
 * Returns active Item or Item(s) inside of selection
 * 21.6.2011 13:53:27
 **/
_me._selectedItems = function () {
	var ids = [];
	if (this.__activeEvent) {
		//check if exists
		if (this._useItem(this.__activeEvent))
			ids.push(this.__activeEvent);
	} else
	if (this._selection.startdate && this._selection.startdate >= this.__range['start'] && this._selection.enddate <= this.__range['end'])
		for (var i in this.__value)
			if (this.__value[i].startdate >= this._selection.startdate && this.__value[i].enddate <= this._selection.enddate)
				ids.push(this.__value[i].id);

	return ids;
};
