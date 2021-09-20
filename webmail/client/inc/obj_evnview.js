_me = obj_evnview.prototype;
function obj_evnview() {}
;

/*
 Input Array format
 [startdate] = julian int
 [enddate] = julian int
 [starttime] = int
 [endtime] = int
 [rmn] = bool
 [title] = string
 [id]

 1] seradit dle starttime

 2] ulozit do idTable + pridat start,end pro visual
 3] nahazet do sloupecku + nastavit TOP
 4] pustit fci na rozrezeni

 Fill Array
 [int]	[elm]
 [start]
 [top]
 [left]
 [width]
 */

_me.__constructor = function () {
	var me = this;

	if(gui._rtl) {
		this._getAnchor('htable').setAttribute('dir', 'rtl');
		this._getAnchor('htable2').setAttribute('dir', 'rtl');
	}

	if (GWOthers.getItem('LAYOUT_SETTINGS', 'time_format') > 0)
		addcss(this._main, 'obj_evnview12');

	var tline = '';
	if (GWOthers.getItem('LAYOUT_SETTINGS', 'time_format') > 0) {
		for (var i = 0; i < 24; i++) {
			tline += '<div>';

			if (i > 12)
				tline += (i - 12);
			else
				tline += (i == 0 ? '12' : i);

			tline += "<sup>" + (i < 12 ? 'am' : 'pm') + "</sup></div>\r\n";
		}
	} else {
		for (var i = 0; i < 24; i++)
			tline += '<div>' + i + "<sup>00</sup></div>\r\n";
	}
	this._getAnchor('tline').innerHTML = tline;
	delete tline;

	this.__topheight = 24;
	this.__rowheight = 26;

	this.__idTable;
	this.__value;

	//Prepare months and days
	//this.__months = IcewarpDate.months();
	//this.__days = IcewarpDate.weekdaysShort();

	//access rights
	this.__rights = {'read': true, 'write': true, 'modify': true, 'remove': true};

	this.__eTitle = this._getAnchor('title');
	this.__eAllDay = this._getAnchor('allday');

	this.__eHTable = this._getAnchor('htable');
	this.__eContainer = this._getAnchor('container');
	this.__eContainer2 = this._getAnchor('container2');
	this.__eMain = this._getAnchor('main');
	this.__eIN = this._getAnchor('input');

	this._scrollbar(this.__eContainer2, this.__eContainer2.parentNode);

	//setSelectNone(this.__eMain);

	this.__activeEvent;
	this.__noRefresh = false;

	this.__edivs = [];				// selection divs buffer
	this._selection = {};			// indexes "startdate", "starttime", "enddate", "endtime"
	this.__allDaySelection = {};	// indexes "startdate", "enddate"

	// Quick Edit
	this.__editMode = false;    	// edit mode
	this.__editEvent = '';			// edited ID

	var header = this._getAnchor('header');
	this._getAnchor('collapse').addEventListener('click', function(e) {
		if(header.classList.contains('collapsed')) {
			header.classList.remove('collapsed');
			Cookie.set(['collapse_allday'], false);
		} else {
			header.classList.add('collapsed');
			Cookie.set(['collapse_allday'], true);
		}
		this.__eContainer.style.paddingTop = parseInt(header.offsetHeight) + 'px';
	}.bind(this));

	this.__eIN.onkeyup = function (e) {
		var newEvn = {};

		if (!me.__rights.modify) {
			if (!me.__activeEvent || !(newEvn = me._useItem(me.__activeEvent)) || newEvn.owner != sPrimaryAccountGWID)
				return;
		}

		var e = e || window.event;

		if (!me.__editMode) {

			switch (e.keyCode) {
				//Enter
				case 13:
					//Esc
				case 27:
					this.value = '';
					return false;

					//Delete
				case 46:
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

						if (newEvn.disabled || newEvn.startdate < me.__start || newEvn.startdate > me.__end)
							return;

						me.__editMode = true;

						if (e.keyCode == 113)
							this.value = newEvn.title;

						me.__editEvent = me.__activeEvent;
						me.__createEdit();
						me.__editMode = false;
					}

					return false;

					//KeyPress (add)
				default:
					if (this.value.length) {

						if (me.__allDaySelection.startdate) {

							newEvn = clone(me.__allDaySelection);
							newEvn.starttime = -1;
							newEvn.endtime = -1;

							me.__allDaySelection = {};
						} else
						if (me._selection.startdate) {
							newEvn = clone(me._selection);

							me._selection = {};
						} else
						if (me.__activeEvent && (newEvn = me._useItem(me.__activeEvent))) {
							this.onkeyup({keyCode: 1000});
							return;
						}

						// check if selection is in current range
						if (!Is.Defined(newEvn.startdate) || newEvn.startdate < me.__start || newEvn.startdate > me.__end) {
							me.__editEvent = '';
							return;
						}

						me.__editMode = true;

						newEvn.evnclass = 'E';
						newEvn.id = 'edit';

						me.__activeEvent = newEvn.id;
						me.__value.push(newEvn);
					}

					me.__editEvent = me.__activeEvent;
					me._fill();
					me.__editMode = false;
			}
		}
	};
	this._main.onmousedown = function (e) {
		var e = e || window.event,
				elm = e.target || e.srcElement;

		if (elm.tagName == 'INPUT' || elm.tagName == 'TEXTAREA')
			return;

		me._focus();
		return false;
	};
	//MSIE needs onmouseup too...
	this._main.onmouseup = this._main.onmousedown;


	// TITLE (shared with oncontextmenu)
	this.__eTitle.ondblclick = function (e, bContext) {
		var e = e || window.event,
				elm = e.target || e.srcElement;

		//add allday event
		if (elm == this)
			return;

		if (elm.tagName != 'TD')
			elm = Is.Child(elm, 'TD');

		var id = elm.id.split('/')[1],
				arg = {"starttime": -1, "endtime": -1, "_event": 'allday'};

		if (me.__allDaySelection.startdate && me.__allDaySelection.startdate < me.__allDaySelection.enddate && me.__allDaySelection.startdate <= id && me.__allDaySelection.enddate >= id) {
			arg.startdate = me.__allDaySelection.startdate;
			arg.enddate = me.__allDaySelection.enddate;
			arg._event = 'selection';

			//Obsazene Events
			arg.contains = [];
			for (var i in me.__aAllDay)
				if (me.__aAllDay[i].evnclass == 'E' && me.__aAllDay[i].startdate >= me.__allDaySelection.startdate && me.__aAllDay[i].enddate <= me.__allDaySelection.enddate)
					arg.contains.push(me.__aAllDay[i].id);
		} else {
			arg.startdate = id;
			arg.enddate = parseInt(id) + 1;
		}

		if (bContext) {
			if (me._oncontext)
				me._oncontext(e, elm, arg);
			me.__exeEvent('oncontext', e, {"elm": elm, "owner": me, "arg": arg});
		} else {
			if (me._ondblclick)
				me._ondblclick(e, elm, arg);
			me.__exeEvent('ondblclick', e, {"elm": elm, "owner": me, "arg": arg});
		}
	};

	this.__eTitle.oncontextmenu = function (e) {
		this.ondblclick(e, true);
		return false;
	};

	this.__eTitle.onmousedown = function (e) {
		var e = e || window.event,
				elm = e.target || e.srcElement;

		me._main.onmousedown(e);

		if (e.button > 1 || elm == this)
			return true;
		if (elm.tagName != 'TD' && !(elm = Is.Child(elm, 'TD', this)))
			return;

		//Draw selection
		me.__selection2(elm.id.split('/')[1]);

		var aPos = getSize(this),
				iDiv = me.__eHTable.clientWidth / (me.__end - me.__start + 1),
				iStart = Math.floor((e.clientX - aPos.x) / iDiv);

		//MouseMove
		gui._obeyEvent('mouseup', [me, '__mouseup']);
		me.__eHTable.onmousemove = function (evn) {
			var evn = evn || window.event,
					iHop = Math.floor((evn.clientX - aPos.x) / iDiv) - iStart;

			me.__selection2(me.__start + iStart, me.__start + iStart + iHop);
			return false;
		};
	};

	// ALL DAY
	this.__eAllDay.ondrag = function () {
		return false;
	};
	this.__eAllDay.ondblclick = function (e) {
		var e = e || window.event,
				elm = e.target || e.srcElement;

		var arg = null, iOff = 0;
		switch (elm.tagName) {
			//blank space
			case 'DIV':
				if (gui._rtl ? elm.style.right : elm.style.left)
					iOff = parseInt(gui._rtl ? elm.style.right : elm.style.left, 10) / 100;

				elm = Is.Child(elm, 'TD');
			case 'TD':
				var jul = parseInt(elm.id.split('/')[2], 10) + iOff;
				arg = {"startdate": jul, "enddate": jul + 1, "starttime": -1, "endtime": -1, "_event": 'allday'};
				break;

				//Event
			case 'INS':
			case 'B':
			case 'I':
			case 'SPAN':
				elm = Is.Child(elm, 'P');
			case 'P':
				var id = elm.id.substr(me._pathName.length + 1);
				for (var i in me.__value)
					if (me.__value[i].id == id) {
						var arg = clone(me.__value[i]);
						arg._event = 'event';
						if (arg.starttime < 0)
							arg.enddate = parseInt(arg.enddate) + 1;
					}
		}

		if (arg != null && !arg.disabled) {
			if (me._ondblclick)
				me._ondblclick(e, elm, arg);
			me.__exeEvent('ondblclick', e, {"elm": elm, "owner": me, "arg": arg});
		}
	};

	this.__eAllDay.oncontextmenu = function (e) {
		var e = e || window.event,
				elm = e.target || e.srcElement,
				arg = null;

		switch (elm.tagName) {
			//blank space
			case 'DIV':
				if (elm.className == 'obj_evnviewblock') {
					arg = {"startdate": me.__allDaySelection.startdate, "enddate": me.__allDaySelection.enddate, "starttime": -1, "endtime": -1, "_event": 'selection'};

					//Obsazene Events
					arg.contains = [];
					for (var i in me.__aAllDay)
						if (me.__aAllDay[i].evnclass == 'E' && me.__aAllDay[i].startdate >= me.__allDaySelection.startdate && me.__aAllDay[i].enddate <= me.__allDaySelection.enddate)
							arg.contains.push(me.__aAllDay[i].id);

					break;
				}
				elm = Is.Child(elm, 'TD');

			case 'TD':
				var jul = elm.id.split('/')[2];
				arg = {"startdate": jul, "enddate": parseInt(jul), "starttime": -1, "endtime": -1, "_event": 'allday'};
				break;

				//Event
			case 'INS':
			case 'B':
			case 'I':
			case 'SPAN':
				elm = Is.Child(elm, 'P');
			case 'P':
				id = elm.id.split('/')[1];

				me._activate(id);

				for (var i in me.__value)
					if (me.__value[i].id == id) {
						var arg = clone(me.__value[i]);
						arg._event = 'event';
						if (arg.starttime < 0)
							arg.enddate = parseInt(arg.enddate);
					}
		}

		if (arg != null && !arg.disabled) {
			if (me._oncontext)
				me._oncontext(e, elm, arg);
			me.__exeEvent('oncontext', e, {"elm": elm, "owner": me, "arg": arg});
		}

		return false;
	};

	this.__eAllDay.onmousedown = function (e) {

		var e = e || window.event,
				elm = e.target || e.srcElement;

		me._main.onmousedown(e);
		if (elm.tagName == 'INPUT' || e.button > 1)
			return;

		//DESTROY CONTEXTMENU
		e.__source = {obj: me, type: me._type, path: me._pathName};
		gui.__exeEvent('click', e);

		var sAction = 'm';
		switch (elm.tagName) {
			case 'DIV':
			case 'TD':

				//Draw seelction
				var aPos = getSize(this),
						iDiv = me.__eHTable.clientWidth / (me.__end - me.__start + 1),
						iStart = Math.floor((e.clientX - aPos.x) / iDiv);

				me.__selection2(me.__start + iStart);

				//MouseMove
				gui._obeyEvent('mouseup', [me, '__mouseup']);
				me.__eHTable.onmousemove = function (evn) {
					var evn = evn || window.event,
							iHop = Math.floor((evn.clientX - aPos.x) / iDiv) - iStart;

					me.__selection2(me.__start + iStart, me.__start + iStart + iHop);
					return false;
				};

				return false;

			case 'INS':
			case 'B':
			case 'I':
			case 'SPAN':

				//It's <resize> event
				if (elm.parentNode.tagName == 'P') {
					elm = elm.parentNode;

					var aPos = getSize(elm);

					if (e.clientX - aPos.x < 10)
						sAction = 'l';
					else
					if (aPos.x + aPos.w - e.clientX < 10)
						sAction = 'r';
				} else
					elm = Is.Child(elm, 'P');

			case 'P':

				var id = elm.id.split('/')[1],
						itm = me._useItem(id);

				if (!me.__rights.modify && (!itm || itm.owner != sPrimaryAccountGWID))
					return false;

				me.__selection2();
				me._activate(id, true);

				// getItem
				for (var itm = null, i = 0; i < me.__aAllDay.length; i++)
					if (me.__aAllDay[i].id == id) {
						itm = clone(me.__aAllDay[i]);
						break;
					}

				if (itm && !itm.disabled) {
					//addcss(me.__eAllDay,'dragged');
					break;
				}

			default:
				return;
		}

		//Use Move only for weekview
		if (me.__end - me.__start < 1)
			return;

		// add onmouse up
		gui._obeyEvent('mouseup', [me, '__mouseup', [itm]]);

		// -- disable refresh

		var aPos = getSize(this),
				iDiv = me.__eHTable.clientWidth / (me.__end - me.__start + 1),
				iStart = Math.floor((e.clientX - aPos.x) / iDiv);

		//MouseMove
		me.__eHTable.onmousemove = function (evn) {
			var evn = evn || window.event,
				iHop = Math.floor((evn.clientX - aPos.x) / iDiv) - iStart;

			for (var i = 0; i < me.__aAllDay.length; i++)
				if (me.__aAllDay[i].id == itm.id) {

					if (iHop && !hascss(me.__eAllDay, 'dragged'))
						addcss(me.__eAllDay, 'dragged');

					if (sAction == 'l' || sAction == 'm') {

						if (me.__aAllDay[i].startdate == itm.startdate + iHop || (sAction == 'l' && (itm.startdate + iHop) > itm.enddate))
							return;

						me.__aAllDay[i].startdate = parseInt(itm.startdate) + iHop;
						me.__aAllDay[i].start = me.__aAllDay[i].startdate < me.__start ? me.__start : me.__aAllDay[i].startdate;
						me.__aAllDay[i].osd = parseInt(itm.osd) + iHop;
					}

					if (sAction == 'r' || sAction == 'm') {

						if (me.__aAllDay[i].enddate == itm.enddate + iHop || (sAction == 'r' && (itm.enddate + iHop) < itm.startdate))
							return;

						me.__aAllDay[i].enddate = parseInt(itm.enddate) + iHop;
						me.__aAllDay[i].end = me.__aAllDay[i].enddate > me.__end ? me.__end : me.__aAllDay[i].enddate;
						me.__aAllDay[i].oed = parseInt(itm.oed) + iHop;
					}

					me._fillAllDay();
					break;
				}
		};
		return false;
	};




	//EVENTS -----------------------------

	this.__eMain.ondblclick = function (e) {
		var e = e || window.event,
			elm = e.target || e.srcElement;

		if (elm.tagName == 'INS')
			elm = elm.parentNode;

		if (elm.tagName == 'DIV' && !elm.id)
			elm = elm.parentNode;

		if (elm.tagName == 'DIV' && elm.id) {
			var id = elm.id.substr(me._pathName.length + 1).split('/'),
				arg = me._useItem(id[1]);

			if (arg != null && !arg.disabled) {
				arg._event = 'event';
				if (me._ondblclick)
					me._ondblclick(e, elm, arg);
				me.__exeEvent('ondblclick', e, {"elm": elm, "owner": me, "arg": arg});
				return;
			}
		}

		//Open new event
		if (elm.tagName == 'TD' || (elm = Is.Child(elm, 'TD'))){

			var id = elm.id.substr(me._pathName.length + 1);

			// ZJISTIT CAS
			var mainpos = getSize(this);
			var iStart = e.clientY - mainpos.y;
				iStart = ((iStart - iStart % me.__rowheight) / me.__rowheight) * 1800,
				arg = {"_event": 'blank', "startdate": id, "starttime": iStart};

			if (me._ondblclick)
				me._ondblclick(e, elm, arg);
			me.__exeEvent('ondblclick', e, {"elm": elm, "owner": me, "arg": arg});
		}
	};

	/* MOUSE CLICK HANDLING */
	this.__eMain.onmousedown = function (e) {
		var e = e || window.event,
			elm = e.target || e.srcElement;

		//to avoid execution before contextmenu
		if (elm.tagName == 'TEXTAREA' || e.button > 1)
			return;

		var mainpos = getSize(me.__eMain);
			mainpos.h = 48 * me.__rowheight;  // natahuje se to v MSIE jak se to plni DIVama

		//columns position
		var cols = [];
		for (var cln = 0; cln < me.__eMain.childNodes.length; cln++)
			cols.push(getSize(me.__eMain.childNodes[cln]));
/*
		// DblClick on blank spase emulation (part 2)
		if (me.__dblclick && me.__dblclick[0] > (+new IcewarpDate()) - 400 && Math.abs(me.__dblclick[1] - e.clientX) < 10 && Math.abs(me.__dblclick[2] - e.clientY) < 10) {
			me.__dblclick = '';

			if (elm.tagName != 'TD')
				elm = Is.Child(elm, 'TD');

			var id = elm.id.substr(me._pathName.length + 1);

			// ZJISTIT CAS
			var iStart = e.clientY - mainpos.y;
				iStart = ((iStart - iStart % me.__rowheight) / me.__rowheight) * 1800,
				arg = {"_event": 'blank', "startdate": id, "starttime": iStart};

			//Cancel bubble...
			e.preventDefault &&	e.preventDefault();
			e.stopPropagation && e.preventDefault();
			e.cancelBubble = true;

			if (me._ondblclick)
				me._ondblclick(e, elm, arg);
			me.__exeEvent('ondblclick', e, {"elm": elm, "owner": me, "arg": arg});
			return false;
		}

*/

		//DESTROY CONTEXTMENU
		e.__source = {obj: me, type: me._type, path: me._pathName};
		gui.__exeEvent('click', e);

		if (elm.tagName == 'DIV' && hascss(elm, 'obj_evnviewblock'))
			elm = elm.parentNode;

		/*** CLICK TO BLANK SPACE ***/
		if (elm.tagName == 'DIV' && !elm.id && (hascss(elm, 'space_box') || hascss(elm, 'today_box')))
			elm = elm.parentNode;

		if (elm.tagName == 'TD') {

			var x = e.clientX - mainpos.x,
				y = e.clientY - mainpos.y,
				ediv;

			if (me.__edivs[0] && me.__edivs[0].parentNode === elm && me.__edivs[0].parentNode){
				ediv = me.__edivs[0];
				ediv.style.top = '';
				ediv.style.height = '';

				//Remove All Selections except ediv
				me.__selection2(undefined, undefined, ediv);
			}
			else{
				ediv = mkElement('div', {className: 'obj_evnviewblock'});
				//Remove All Selections
				me.__selection2();
				me.__edivs.push(ediv);
				elm.appendChild(ediv);
			}

			ediv.style.height = me.__rowheight + 'px';

			var parentpos = getSize(elm),
				startpos = getSize(ediv),
				ey = mainpos.y - startpos.y + (y - y % me.__rowheight);

			ediv.style.top = ey + 'px';

			if (me.__rights['write'])
				ediv.innerHTML = getLang('CALENDAR::TYPETOADD');

			var iScroll = me.__eContainer2.scrollTop;

			var pos = getSize(ediv),
				difY = e.clientY;

				function mousemove(e) {
					var e = e || window.event;

					// check columns
					var mycol = -1, orgcol = -1;
					if (gui._rtl) {
						for (var i = cols.length - 1; i > -1; i--) {
							if (orgcol < 0 && cols[i].x == parentpos.x)
								orgcol = i;
							if (mycol < 0 && e.clientX < (cols[i].x + cols[i].w))
								mycol = i;
							if (orgcol > -1 && mycol > -1)
								break;
						}
					} else {
						for (var i = cols.length - 1; i > -1; i--) {
							if (orgcol < 0 && cols[i].x == parentpos.x)
								orgcol = i;
							if (mycol < 0 && e.clientX > cols[i].x)
								mycol = i;
							if (orgcol > -1 && mycol > -1)
								break;
						}
					}
					if (mycol < 0)
						return;

					// remove all divs
					me.__edivs = me.__edivs.filter(function(div){
						if (div !== me.__edivs[0]){
							div.parentNode.removeChild(div);
							return false;
						}

						return true;
					});

					//ORIGINATOR -> RIGHT
					if (orgcol < mycol) {

						//originator div
						me.__edivs[0].style.top = ey + 'px';
						me.__edivs[0].style.height = (mainpos.h + mainpos.y - pos.y) + 'px';
						if (me.__rights['write'])
							me.__edivs[0].innerHTML = getLang('CALENDAR::TYPETOADD');

						//temporary divs
						var tmpdiv, tmptd, tmppos, tmpheight;
						for (var i = orgcol + 1; i <= mycol; i++) {

							tmptd = me.__eMain.childNodes[i];
							tmpdiv = mkElement('div', {className: 'obj_evnviewblock'});

							me.__edivs.push(tmpdiv);

							tmptd.appendChild(tmpdiv);
							tmppos = getSize(tmpdiv);

							//top
							tmpdiv.style.top = (mainpos.y - tmppos.y - me.__eContainer2.scrollTop + iScroll) + 'px';

							//height
							if (i < mycol)
								tmpheight = mainpos.h;
							else
								tmpheight = e.clientY - mainpos.y + (me.__eContainer2.scrollTop - iScroll);

							tmpheight -= tmpheight % me.__rowheight;

							tmpdiv.style.height = (tmpheight > 0 ? tmpheight : 0) + 'px';

							//clear memory
							tmpdiv = null;
							tmptd = null;
						}

						return;
					}
					else
					//ORIGINATOR -> LEFT
					if (orgcol > mycol) {

						//originator div
						var ePosY = mainpos.y - pos.y;
						me.__edivs[0].style.top = (ey + ePosY) + 'px';
						me.__edivs[0].style.height = (me.__rowheight - ePosY) + 'px';
						me.__edivs[0].innerHTML = '';

						//temporary divs
						var tmpdiv, tmptd, tmppos, tmpheight;
						for (var i = orgcol - 1; i >= mycol; i--) {

							tmptd = me.__eMain.childNodes[i];

							tmpdiv = mkElement('div', {className: 'obj_evnviewblock'});
							me.__edivs.push(tmpdiv);

							tmptd.appendChild(tmpdiv);
							tmppos = getSize(tmpdiv);

							if (i > mycol) {
								tmpdiv.style.top = (mainpos.y - tmppos.y) + 'px';
								tmpdiv.style.height = mainpos.h + 'px';
							} else {
								var tmptop = e.clientY - tmppos.y;
								tmptop -= tmptop % me.__rowheight;

								tmpdiv.style.top = tmptop + 'px';

								tmpheight = mainpos.h - tmptop;
								tmpdiv.style.height = (tmpheight > 0 ? tmpheight : 0) + 'px';

								if (me.__rights['write'])
									tmpdiv.innerHTML = getLang('CALENDAR::TYPETOADD');
							}

							//clear memory
							tmpdiv = null;
							tmptd = null;
						}

						return;
					}
					else
					if (me.__rights['write'])
						me.__edivs[0].innerHTML = getLang('CALENDAR::TYPETOADD');


					var ePosY = e.clientY - difY + (me.__eContainer2.scrollTop - iScroll);
						ePosY = ePosY - ePosY % me.__rowheight;

					//move Up
					if (ePosY <= 0) {
						me.__edivs[0].style.top = (ey + ePosY) + 'px';
						ePosY *= -1;
					}
					else
						me.__edivs[0].style.top = ey + 'px';

					// move Down                               iScroll (me.__eContainer2.scrollTop)
					me.__edivs[0].style.height = (ePosY + me.__rowheight) + 'px';
				};

				function mouseup() {

					gui._disobeyEvent('mouseup', [mouseup]);
					gui._disobeyEvent('mousemove', [mousemove]);

					// retrieve selection area from divs position
					me._selection = {};
					var iDay, iTime1, iTime2, tmppos;
					for (var i in me.__edivs) {

						// TIME
						tmppos = getSize(me.__edivs[i]);

						iTime1 = tmppos.y - getSize(me.__eMain).y + me.__rowheight/4; // "me.__rowheight/4" web-kit zoom fix
						iTime1 -= iTime1 % me.__rowheight;

						iTime2 = me.__edivs[i].offsetHeight + iTime1;
						iTime2 -= iTime2 % me.__rowheight;

						// DATE
						if (!me.__edivs[i] || !me.__edivs[i].parentNode || !me.__edivs[i].parentNode.id) {
							gui._disobeyEvent('mouseup', [mouseup]);
							gui._disobeyEvent('mousemove', [mousemove]);
							return;
						}

						iDay = me.__edivs[i].parentNode.id.substr(me._pathName.length + 1);

						if (typeof me._selection.startdate == 'undefined' || me._selection.startdate > iDay) {
							me._selection.startdate = iDay;
							me._selection.starttime = (iTime1 / me.__rowheight) * 1800;
						}

						if (typeof me._selection.enddate == 'undefined' || me._selection.enddate < iDay) {
							me._selection.enddate = iDay;
							me._selection.endtime = (iTime2 / me.__rowheight) * 1800;
						}
					}
					tmppos = null;

					if (me._selection.starttime >= 86400) {
						me._selection.starttime = 0;
						me._selection.startdate++;
					}
					if (me._selection.endtime <= 0) {
						me._selection.endtime = 86400;
						me._selection.enddate--;
					}

					if (me._onselect)
						me._onselect();
					me.__exeEvent('onselect', null, {"owner": me, "selection": me._selection});

					return true;
				};


			gui._obeyEvent('mouseup', [mouseup]);
			gui._obeyEvent('mousemove', [mousemove]);

			// DblClick on blank spase emuilation (part 1)
			//me.__dblclick = [(+new IcewarpDate()), e.clientX, e.clientY];

			return true;
		}
		/*** CLICK ON EVENT BORDER ***/
		else {
			//Remove All Selections
			me.__selection2();


			if (elm.tagName == 'INS')
				elm = elm.parentNode;

			//Click on Event
			if (elm.tagName == 'DIV' && (elm.id || (elm.parentNode && elm.parentNode.id && (elm = elm.parentNode)))) {

				var parentpos = getSize(elm),
					x = e.clientX - parentpos.x,
					y = e.clientY - parentpos.y;

				if (typeof x == 'undefined' || typeof y == 'undefoned')
					return;

				var id = elm.id.substr(me._pathName.length + 1).split('/'),
					mycol = id[0],
					value = me._useItem(id[1]);

				if (value.disabled || (!me.__rights.modify && value.owner != sPrimaryAccountGWID))
					return;

				if (y < 4 || parentpos.h - y < 4) {
					me._activate(id[1]);
					me.__edit(id, y < 4 ? 'top' : 'bottom', e, cols, mycol);
				} else {

					me._activate(id[1], true);

					var evn = {clientY: e.clientY, clientX: e.clientX};

					me.__movetimer = window.setTimeout(function () {
						me.__edit(id, 'move', evn, cols, mycol);
					}, 200);

					gui._obeyEvent('mouseup', [function () {
							if (Is.Defined(me.__movetimer)) {
								window.clearTimeout(me.__movetimer);
								delete me.__movetimer;
							}
							gui._disobeyEvent('mouseup', [this]);
						}]);
				}
			}
			// DblClick on blank space emuilation (part 1)
			// else
			// if (elm.tagName == 'DIV' && elm.className == 'obj_evnviewblock')
			// 	me.__dblclick = [(+new IcewarpDate()), e.clientX, e.clientY];
		}

		return false;
	};


	// CONTEXT MENU PART
	this.__eMain.oncontextmenu = function (e) {
		var e = e || window.event,
			elm = e.target || e.srcElement,
			arg;

		// blank space
		if (elm.tagName == 'DIV' && !elm.id && (hascss(elm, 'space_box') || hascss(elm, 'today_box')))
			elm = elm.parentNode;

		if (elm.tagName == 'TD') {

			var mainpos = getSize(me.__eMain);
			mainpos.h = 48 * me.__rowheight;  // natahuje se to v MSIE jak se to plni DIVama

			var id = elm.id.substr(me._pathName.length + 1);

			// ZJISTIT CAS
			var iStart = e.clientY - mainpos.y;
			iStart = ((iStart - iStart % me.__rowheight) / me.__rowheight) * 1800;

			arg = {"_event": 'blank', "startdate": id, "starttime": iStart};
		} else {
			if (elm.tagName == 'INS')
				elm = elm.parentNode;

			if (elm.tagName == 'DIV') {

				// click on selection block
				if (elm.className == 'obj_evnviewblock') {
					var selection = me._selection;

					arg = selection;
					arg._event = 'selection';
					arg.contains = [];

					var event;
					for (var i in me.__idTable) {
						for (var j in me.__idTable[i]) {
							event = me.__idTable[i][j];
							if (event.startdate >= selection.startdate && event.enddate <= selection.enddate) {
								if ((event.startdate == selection.startdate && event.starttime < selection.starttime) || (event.enddate == selection.enddate && event.endtime > selection.endtime))
									continue;

								arg.contains.push(event['id']);
							}
						}
					}
				}
				// click on event block
				else {
					// in case of clicking into div inside event block
					if (!elm.id)
						elm = elm.parentNode;

					if (elm.id) {
						var id = elm.id.substr(me._pathName.length + 1).split('/');

						me._activate(id[1]);

						arg = me._useItem(id[1]);
						arg._event = 'event';
					}
				}
			}
		}

		if (arg) {
			if (me._oncontext)
				me._oncontext(e, elm, arg);
			me.__exeEvent('oncontext', e, {"elm": elm, "owner": me, "arg": arg});
		}

		return false;
	};
};






/*
 id		event ID
 sType	type of edit (move, top, bottom)
 x, y	mouse
 */
_me.__edit = function (id, sType, e, cols, mycol) {

	var me = this,
			mycol = id[0],
			value = this._useItem(id[1]);

	var mainpos = getSize(me.__eMain);
	mainpos.h = 48 * me.__rowheight;  // natahuje se to v MSIE jak se to plni DIVama

	//zneviditelni stavajici bloky Eventu
	var tmpStart = value['startdate'] < this.__start ? this.__start : value['startdate'],
			tmpEnd = value['enddate'] > this.__end ? this.__end : value['enddate'],
			eElm;

	for (var i = tmpStart; i <= tmpEnd; i++)
		if ((eElm = this.__getElm(id[1], i)))
			eElm.style.visibility = 'hidden';

	var height, top;

	var events = {};
	function __block() {
		var eTd, eElm;

		//remove old blogs
		for (var i in events) {
			if (i < value.startdate || i > value.enddate) {
				if (events[i].div)
					events[i].div.parentNode.removeChild(events[i].div);

				events[i].div = null;
				delete events[i];
			}
		}

		//create bloks
		for (var i = value.startdate; i <= value.enddate; i++) {
			eElm = '', eDif = 0, height = 0, top = 0;

			if ((eTd = document.getElementById(me._pathName + '/' + i))) {

				if (value.startdate == value.enddate) {
					top = Math.floor(value.starttime / 1800) * me.__rowheight;
					height = (Math.ceil(value.endtime / 1800) - Math.floor(value.starttime / 1800)) * me.__rowheight;
				} else
				if (i > value.startdate && i < value.enddate) {
					top = 0;
					height = mainpos.h;
				} else
				if (i == value.startdate) {
					top = Math.floor(value.starttime / 1800) * me.__rowheight;
					height = mainpos.h - top;
				} else {
					top = 0;
					height = Math.ceil(value.endtime / 1800) * me.__rowheight;
				}

				if (!events[i] || !events[i].div) {
					eElm = mkElement('div');
					eElm.className = 'obj_evnviewevn obj_evnviewopacity' + (value.fcolor ? ' ' + value.fcolor : '');
					eTd.appendChild(eElm);

					eDif = getSize(eElm).y - mainpos.y;
				} else {
					eElm = events[i].div;
					eDif = events[i].dif;
				}

				eElm.style.top = (top - eDif) + 'px';
				eElm.style.height = height + 'px';
				eElm.innerHTML = '<div><b>' + parseJulianTime(value.starttime) + '-' + parseJulianTime(value.endtime) + '</b>&nbsp;' + (value.title ? value.title.escapeHTML() : getLang("EVENT_VIEW::NO_TITLE")) + '</div>';
			}

			events[i] = {"div": eElm, "dif": eDif};
		}
	}
	;

	__block();

	var difY = e.clientY,
			evn_tstart = value.starttime,
			evn_tend = value.endtime,
			evn_dstart = value.startdate,
			evn_dend = value.enddate;

	function mousemove2(e) {
		var cur = e.clientY - difY;
		cur = cur - cur % me.__rowheight;

		var increment = ((cur / me.__rowheight) * 1800);

		for (var i = 0; i < cols.length; i++)
			if (e.clientX >= cols[i].x && e.clientX <= cols[i].x + cols[i].w || e.clientX < cols[0].x || (cols.length - 1 == i && e.clientX > cols[i].x)) {
				//check for diferent column
				if (me.__start + i != mycol)
					increment += (me.__start + i - mycol) * 86400;
				break;
			}

		var tmp;
		// MOVE WITH EVENT BY CLICKIN ON LEFT PART
		if (sType == 'move') {

			// START TIME & START DATE
			tmp = evn_tstart + increment;
			if (tmp < 0) {

				var posun = Math.ceil(tmp / -86400);

				value.startdate = evn_dstart - posun;
				tmp += posun * 86400;

			} else
			if (tmp >= 86400) {

				var posun = Math.floor(tmp / 86400);
				posun = posun ? posun : 1;

				value.startdate = evn_dstart + posun;
				tmp -= posun * 86400;

			} else
				value.startdate = evn_dstart;

			value.starttime = tmp;


			// END TIME & END DATE
			tmp = evn_tend + increment;

			if (tmp <= 0) {

				var posun = Math.ceil(tmp / -86400);
				posun = posun ? posun : 1;

				tmp += posun * 86400;

				if (!tmp) {
					posun++;
					tmp = 86400;
				}

				value.enddate = evn_dend - posun;
			} else
			if (tmp > 86400) {

				var posun = Math.floor(tmp / 86400);
				posun = posun ? posun : 1;

				tmp -= posun * 86400;

				if (tmp == 0) {
					posun--;
					tmp = 86400;
				}

				value.enddate = evn_dend + posun;
			} else
				value.enddate = evn_dend;

			value.endtime = tmp;
		} else
		//RESIZE BY CLICKING ON UPPER PART
		if (sType == 'top') {
			tmp = evn_tstart + increment;

			if (tmp < 0) {

				var posun = Math.ceil(tmp / -86400);
				posun = posun ? posun : 1;

				value.startdate = evn_dstart - posun;
				tmp += posun * 86400;

			} else
			if (tmp >= 86400) {

				var posun = Math.floor(tmp / 86400);
				posun = posun ? posun : 1;

				value.startdate = evn_dstart + posun;
				tmp -= posun * 86400;

			} else
				value.startdate = evn_dstart;

			//min size
			if (value.startdate > value.enddate || (value.startdate == value.enddate && tmp >= value.endtime)) {
				value.startdate = value.enddate;
				tmp = value.endtime - 1800;
			}

			value.starttime = tmp;
		} else
		//RESIZE BY CLICKING ON BOTTOM PART
		if (sType == 'bottom') {

			tmp = evn_tend + increment;

			if (tmp < me.__rowheight) {

				var posun = Math.ceil(tmp / -86400);
				posun = posun ? posun : 1;

				tmp += posun * 86400;

				if (!tmp) {
					posun++;
					tmp = 86400;
				}

				value.enddate = evn_dend - posun;
			} else
			if (tmp > 86400) {

				var posun = Math.floor(tmp / 86400);
				posun = posun ? posun : 1;

				tmp -= posun * 86400;

				if (!tmp) {
					posun--;
					tmp = 86400;
				}

				value.enddate = evn_dend + posun;
			} else
				value.enddate = evn_dend;

			//min size
			if (value.startdate > value.enddate || (value.startdate == value.enddate && value.starttime >= tmp)) {
				value.enddate = value.startdate;
				tmp = value.starttime + 1800;
			}

			value.endtime = tmp;
		}
		__block();

	};

	gui._obeyEvent('mousemove', [mousemove2]);

	function mouseup2() {
		gui._disobeyEvent('mousemove', [mousemove2]);
		gui._disobeyEvent('mouseup', [mouseup2]);

		//remove events from memory
		for (var i in events)
			if (events[i].div && events[i].div != null)
				events[i].div = null;

		if (compareObj(me._useItem(id[1]), value, true)) {
			me._fill();
			return true;
		} else {

			if (value.evnclass == 'E' && value.evnrcr_id)
				value.disabled = true;

			me._useItem(id[1], value);
		}

		me._fill();

		//CleanUp & Send to server...
		var out = {
			starttime: value.starttime,
			endtime: value.endtime,
			startdate: value.startdate,
			enddate: value.enddate,
			evnclass: value.evnclass,
			evntype: value.evntype,
			evntimeformat: value.evntimeformat,
			id: value.id
		};

		if (me._onchange)
			me._onchange(out);
		me.__exeEvent('onchange', null, {"owner": me, "event": out});
	};

	gui._obeyEvent('mouseup', [mouseup2]);
};


_me.__mouseup = function (e, elm, itm) {

	removecss(this.__eAllDay, 'dragged');

	gui._disobeyEvent('mouseup', [this, '__mouseup']);
	this.__eHTable.onmousemove = null;

	// save changes
	if (itm)
		for (var i = 0; i < this.__aAllDay.length; i++)
			if (this.__aAllDay[i].id == itm.id) {

				// -- disable refresh

				if (this.__aAllDay[i].startdate != itm.startdate || this.__aAllDay[i].enddate != itm.enddate) {

					if (this.__aAllDay[i].evnclass == 'E' && this.__aAllDay[i].evnrcr_id)
						this.__aAllDay[i].disabled = true;

					this._useItem(this.__aAllDay[i].id, this.__aAllDay[i]);

					if (this._onchange)
						this._onchange(this.__aAllDay[i]);
					this.__exeEvent('onchange', null, {"owner": this, "event": this.__aAllDay[i]});

					//redraw for 24h+ changed to <24h
					if (this.__aAllDay[i].starttime > -1)
						this._fill();
				}

				break;
			}

	// -- enable refresh
};

/**
 * AllDay Event Selection Block
 * 1.6.2011 14:52:38
 **/
_me.__selection2 = function (iStart, iEnd, eSkip) {

	if (!this.__eTopAnchor) {
		this.__allDaySelection = {};
		return;
	}

	// de-activate Event
	this._activate('');

	// remove SELECTION and all it's DIVs from normal event part
	this._selection = {};

	this.__edivs = this.__edivs.filter(function(div){
		if (eSkip === div)
			return true;

		div && div.parentNode && div.parentNode.removeChild(div);
		return false;
	});

	// while (this.__edivs[0]) {
	// 	try {
	// 		this.__edivs && this.__edivs[0] && this.__edivs[0].parentNode && this.__edivs[0].parentNode.removeChild(this.__edivs[0]);
	// 	} catch (e) {
	// 		gui._REQUEST_VARS.debug && console.log(this._name || false, e);
	// 	}
	// 	this.__edivs[0] = null;
	// 	this.__edivs.splice(0, 1);
	// }

	// remove SELECTION and all it's DIVs from all-day event part
	var elm = document.getElementById(this._pathName + '/allday');
	if (!Is.Defined(iStart) || iEnd < this.__start || iStart > this.__end) {

		if (!Is.Defined(iStart))
			this.__allDaySelection = {};

		if (elm)
			elm.parentNode.removeChild(elm);
		return;
	}

	iEnd = iEnd || iStart;
	if (iEnd < iStart) {
		var tmp = iStart;
		iStart = iEnd;
		iEnd = tmp;
	}

	this.__allDaySelection = {startdate: iStart, enddate: iEnd};

	iStart = iStart > this.__start ? iStart - this.__start : 0;
	iEnd = (iEnd < this.__end ? iEnd : this.__end) - this.__start - iStart;

	if (!elm) {
		elm = mkElement('div', {className: 'obj_evnviewblock', id: this._pathName + '/allday'});
		elm.onmousedown = function (e) {
			return false;
		};

		this.__eTopAnchor.appendChild(elm);
	}

	if(gui._rtl) {
		elm.style.right = (iStart * 100) + '%';
	} else {
		elm.style.left = (iStart * 100) + '%';
	}
	elm.style.width = ((iEnd + 1) * 100) + '%';
};

/**
 * Set rights for object
 **/
_me._rights = function (v) {
	if (!v)
		return this.__rights;
	this.__rights = v;
};

/**
 * @brief : view range setter
 * @status: COMPLETE
 * @date  : 8.9.2006 13:17:44
 **/
_me._range = function (iStart, iEnd, iTimeStart, iTimeEnd) {
	if (iStart && iEnd) {
		if (+GWOthers.getItem('CALENDAR_SETTINGS', 'alternative_calendar') >= 0) {
			var start = IcewarpDate.julian(iStart).clone({calendar: +GWOthers.getItem('CALENDAR_SETTINGS', 'alternative_calendar')});
			var end = IcewarpDate.julian(iEnd).clone({calendar: +GWOthers.getItem('CALENDAR_SETTINGS', 'alternative_calendar')});
			gui.frm_main.main._main.querySelector('.alternative_calendar').textContent = start.format('LL') + (end.isSame(start, 'day') ? '' : (' - ' + end.format('LL')));
		}
		if (this.__start != parseInt(iStart) || this.__end != parseInt(iEnd)) {

			this.__start = parseInt(iStart);
			this.__end = parseInt(iEnd);

			this.__startTime = parseInt(iTimeStart) || 0;
			this.__endTime = parseInt(iTimeEnd) || 0;

			if (this.__value && !Is.Empty(this.__value))
				this._fill();
		}
	} else
		return {"start": this.__start, "end": this.__end};
};

/**
 * @brief : set or returns events in object
 * @status: COMPLETE
 * @date  : 18.9.2006 15:48:48
 **/
_me._value = function (v) {
	if (!this.__noRefresh && Is.Object(v))
		this._fill(v);
	else
		return this.__value;
};




/**
 * @brief : update datasets
 * @status: COMPLETE
 * @date  : 18.9.2006 15:48:48
 **/
_me.__update = function (sDataSet) {

	if (!sDataSet || this.__noRefresh)
		return;

	/* update events */
	if (this._listener_data == sDataSet)
		this._value(dataSet.get(this._listener_data, this._listenerPath_data));

	/* update range */
	if (this._listener == sDataSet) {
		var tmp = dataSet.get(this._listener, this._listenerPath);
		this._range(tmp['start'], tmp['end']);
	}
};
_me._listen_data = function (sDataSet, aDataPath) {
	this._listener_data = sDataSet;
	if (typeof aDataPath == 'object')
		this._listenerPath_data = aDataPath;
	dataSet.obey(this, '_listener_data', sDataSet);
};

/**
 * @brief : fill method, draw events and calendar grid
 * @status: COMPLETE
 * @date  : 11.9.2006 16:36:36
 **/
_me._fillAllDay = function () {

	if (!this.__eTopAnchor)
		return;

	var sHTML = '', ymax = 0, infos = [];

	//Add AllDay Events
	if (this.__aAllDay.length) {

		//Sort them...
		this.__aAllDay.sort(this.__sortAllDay);

		var css, sNoTitle = getLang("EVENT_VIEW::NO_TITLE"), sPrivateTitle = getLang('EVENT_VIEW::PRIVATE');
		for (var ad in this.__aAllDay) {
			//Zasupovani...
			var info = {starttime: '', endtime: ''};
			this.__aAllDay[ad].y = 0;
			skip = {};

			info.title = this.__aAllDay[ad].title ? this.__aAllDay[ad].title.entityify() : (this.__aAllDay[ad].evnsharetype === 'U' ? sNoTitle : sPrivateTitle);

			for (var j in this.__aAllDay) {
				if (j == ad)
					break;
				if (this.__aAllDay[j]['start'] <= this.__aAllDay[ad]['start'] && this.__aAllDay[j]['end'] >= this.__aAllDay[ad]['start']) {

					//24h+
					if (this.__aAllDay[j]['end'] == this.__aAllDay[ad]['start'] && this.__aAllDay[j].starttime > -1 && this.__aAllDay[ad].starttime > -1 && this.__aAllDay[j].endtime <= this.__aAllDay[ad].starttime)
						continue;

					if (this.__aAllDay[ad].y < this.__aAllDay[j].y)
						skip[this.__aAllDay[j].y] = true;
					else
					if (this.__aAllDay[ad].y == this.__aAllDay[j].y)
						while (true)
							if (!skip[++this.__aAllDay[ad].y])
								break;
				}
			}

			ymax = ymax <= this.__aAllDay[ad].y ? this.__aAllDay[ad].y + 1 : ymax;

			//CSS
			css = [];
			if (this.__aAllDay[ad]['start'] != this.__aAllDay[ad]['startdate'])
				css.push('openStart');
			if (this.__aAllDay[ad]['end'] != this.__aAllDay[ad]['enddate'])
				css.push('openEnd');

			if (this.__aAllDay[ad].fcolor)
				css.push(this.__aAllDay[ad].fcolor);

			if (!this.__rights.modify && this.__aAllDay[ad].owner != sPrimaryAccountGWID)
				css.push('disabled');
			else
			if (this.__activeEvent == this.__aAllDay[ad].id)
				css.push('active');

			if (this.__aAllDay[ad].evnflags & 32)
				css.push('unresponded');

			if (this.__aAllDay[ad].evnflags & 4)
				css.push('F');
			if (this.__aAllDay[ad].evnflags & 8)
				css.push('T');
			if (this.__aAllDay[ad].evnflags & 16)
				css.push('O');

			info.start = IcewarpDate.julian(this.__aAllDay[ad]['osd'] || this.__aAllDay[ad]['startdate']);
			(this.__aAllDay[ad]['starttime'] !== -1) && info.start.setTime(this.__aAllDay[ad]['starttime']);
			info.end = IcewarpDate.julian(this.__aAllDay[ad]['oed'] || this.__aAllDay[ad]['enddate']);
			(this.__aAllDay[ad]['endtime'] !== -1) && info.end.setTime(this.__aAllDay[ad]['endtime']);

			var left, width;
			if (this.__start < this.__end && this.__aAllDay[ad]['starttime'] != -1) {
				info.starttime = info.start.format('LT');
				info.endtime = info.end.format('LT');

				var begin = this.__aAllDay[ad]['startdate'] < this.__aAllDay[ad]['start'] ? 0 : this.__aAllDay[ad]['starttime'] / 864,
						end = this.__aAllDay[ad]['enddate'] > this.__aAllDay[ad]['end'] ? 100 : this.__aAllDay[ad]['endtime'] / 864;

				// Event width
				width = (this.__aAllDay[ad]['end'] - this.__aAllDay[ad]['start']) * 100 - begin + end;

				// Start left offset
				left = (this.__aAllDay[ad]['start'] - this.__start) * 100 + begin;
			} else {
				left = (this.__aAllDay[ad]['start'] - this.__start) * 100;
				width = (this.__aAllDay[ad]['end'] - this.__aAllDay[ad]['start'] + 1) * 100;
			}

			info.start = info.start.format("L");
			info.duration = this.__aAllDay[ad]['enddate'] - this.__aAllDay[ad]['startdate'];
			if (this.__aAllDay[ad]['endtime'] === -1) {
				info.end.date(info.end.date() - 1);
			}
			info.end = info.duration ? info.end.format('L') : '';

			sHTML += '<p id="' + this._pathName + '/' + this.__aAllDay[ad].id + '" style="' +
					'width:' + width + '%;' + (gui._rtl ? 'right' : 'left') + ':' + left + '%;' +
					'top:' + (10 + this.__aAllDay[ad].y * this.__topheight) + 'px;' +
					'" ' + (css.length ? 'class="' + css.join(' ') + '"' : '') + '>';

			info.recurrent = !!this.__aAllDay[ad].evnrcr_id;
			info.reminder = !!this.__aAllDay[ad].rmnevn_id;
			info.location = this.__aAllDay[ad].location || '';
			info.tags = this.__aAllDay[ad].taglist || false;

			if (this.__aAllDay[ad].edit && this.__activeEvent == this.__aAllDay[ad].id)
				sHTML += '<span><span></span></span>';
			else										//<b> for OPERA
				sHTML += '<span><span>' +
						(info.end && this.__aAllDay[ad]['end'] == this.__aAllDay[ad]['enddate'] ? '<i unselectable="on">' + info.endtime + '</i>' : '') +
						(this.__aAllDay[ad].conferenceid ? '<ins class="conference"></ins>' : '') +
						(info.reminder ? '<ins class="rmn"></ins>' : '') +
						this.__aAllDay[ad].color +
						'<b>' + (info.start && this.__aAllDay[ad]['start'] == this.__aAllDay[ad]['startdate'] ? '<i unselectable="on">' + info.starttime + '</i>' : '') + info.title + '</b></span></span>';

			sHTML += '</p>';
			info.duration = new IcewarpNumber(info.duration + 1).localize() + ' ' + getLang(info.duration + 1 ? 'TIME::MOREDAYS' : 'TIME::ONEDAY');

			// for tooltip
			if (this.__aAllDay[ad].evnowneremail != sPrimaryAccount)
				info.owner = this.__aAllDay[ad].evnowneremail;

			infos.push(info);
		}
	}

	this.__eTopAnchor.innerHTML = sHTML;
	var height = (ymax + 1) * this.__topheight;
	this.__eTopAnchor.style.height = height + 'px';

	var header = this._getAnchor('header');
	if(height > 150) {
		header.classList.add('collapsable');
		if(Cookie.get(['collapse_allday'])) {
			header.classList.add('collapsed');
		}
	} else {
		header.classList.remove('collapsed');
		header.classList.remove('collapsable');
	}

	//Set size
	this.__eContainer.style.paddingTop = parseInt(header.offsetHeight) + 'px';

	// Add mouseover detailed info
	var ps = this.__eTopAnchor.getElementsByTagName('P');

	for (var i = 0; i < ps.length; i++)
		AttachEvent(ps[i], 'onmouseover', this._showTooltip({template: 'obj_event_tooltip', values: infos[i]}, {flip: false}));
};
_me.__sortAllDay = function (a, b) {
	var tmp = (a['startdate'] + a['starttime'] / 100000) - (b['startdate'] + b['starttime'] / 100000) || (b['enddate'] + b['endtime'] / 100000) - (a['enddate'] + a['endtime'] / 100000);
	if (tmp == 0) {
		if (a.title < b.title)
			return -1;
		else
		if (a.title > b.title)
			return 1;
	}

	return tmp;
};


_me._fill = function (aDataIn) {
	this.__idTable = {};

	// prepare data
	var tmp = typeof aDataIn == 'object' ? clone(aDataIn, 1) : this.__value,
		aTmpData,
		aHollidays = {};

	var aTags = dataSet.get('tags') || {};

	this.__aAllDay = [];

	for (var i in tmp) {

		if (tmp[i]['id'] == '/' || tmp[i]['id'] == '#' || tmp[i]['$'] || tmp[i]['@'] || tmp[i].enddate < this.__start || tmp[i].startdate > this.__end)
			continue;

		tmp[i].startdate = parseInt(tmp[i].startdate);
		tmp[i].starttime = parseInt(tmp[i].starttime);
		tmp[i].endtime = parseInt(tmp[i].endtime);
		tmp[i].enddate = parseInt(tmp[i].enddate);

		if (tmp[i]['startdate'] < tmp[i]['enddate'] && tmp[i].endtime == 0) {
			tmp[i]['enddate']--;
			tmp[i]['endtime'] = 86400;
		}

		//performance fix
		if (tmp[i]['enddate'] > this.__end + 10)
			tmp[i]['enddate'] = this.__end + 10;

		// Tag color
		tmp[i].color = '';
		tmp[i].taglist = '';

		if (tmp[i]['evnclass'] != 'H' && tmp[i].evntype) {
			var arr = tmp[i].evntype.split(','),
					at = {}, sColor;

			for (var t in arr)
				if ((arr[t] = arr[t].trim()).length) {
					sColor = aTags[arr[t]] && aTags[arr[t]].TAGCOLOR ? aTags[arr[t]].TAGCOLOR : '#FFFFFF';

					if (!at[sColor])
						at[sColor] = [];

					at[sColor].push(arr[t]);
				}

			for (var t in at) {
				tmp[i].color += '<ins title="' + at[t].join(', ').escapeHTML().replace(/"/g, '&quot;') + '" style="background-color:' + t + '"></ins>';
				tmp[i].taglist += '<li><ins style="background-color:' + t + '"></ins>' + at[t].join(', ').escapeHTML() + '</li>';
			}
		}

		/* Separating full day, 24h+, holiday, weather and time events */
		if (tmp[i]['evnclass'] != 'H' && (tmp[i]['starttime'] < 0 || (this.__start != tmp[i].enddate && this.__end != tmp[i].startdate && (tmp[i]['enddate'] - tmp[i]['startdate'] > 1 || (tmp[i]['enddate'] - tmp[i]['startdate'] == 1 && tmp[i]['endtime'] > tmp[i]['starttime']))))) {	// Cutoff AllDay Events
			aTmpData = clone(tmp[i]);
			aTmpData['start'] = aTmpData.startdate < this.__start ? this.__start : aTmpData.startdate;
			aTmpData['end'] = aTmpData.enddate > this.__end ? this.__end : aTmpData.enddate;

			this.__aAllDay.push(aTmpData);
		} else {
			for (var j = Math.max(tmp[i]['startdate'], this.__start), k = Math.min(tmp[i]['enddate'], this.__end); j <= k; j++) {
				//Cut off holidays & weather
				if (tmp[i]['evnclass'] == 'H') {
					if (typeof aHollidays[j] == 'undefined')
						aHollidays[j] = [];

					aHollidays[j].push(tmp[i]);
				} else {	// General events during day with time
					aTmpData = clone(tmp[i]);
					aTmpData['tmpid'] = i;

					if (aTmpData['starttime'] > -1) {
						if (aTmpData['enddate'] > j)
							aTmpData['endtime'] = 86400;
						if (aTmpData['startdate'] < j)
							aTmpData['starttime'] = 0;
					}

					if (typeof this.__idTable[j] == 'undefined')
						this.__idTable[j] = [];

					this.__idTable[j].push(aTmpData);
				}
			}
		}
	}

	//Do Not refresh if same data
	if (typeof aDataIn == 'object' && compareObj(this.__value, tmp)) {
		this.__value = tmp;
		if (!Is.Empty(tmp))
			return;
	} else
		this.__value = tmp;

	var aData = clone(this.__idTable, true);

	//clear HTML Title
	var child;
	while(child = this.__eTitle.lastChild)
		this.__eTitle.removeChild(child);

	//clear HTML AllDay
	while(child = this.__eAllDay.lastChild)
		this.__eAllDay.removeChild(child);

	// remove SELECTION and all it's DIVs
	for (var i in this.__edivs) {
		this.__edivs[i].parentNode.removeChild(this.__edivs[i]);
		this.__edivs[i] = null;
	}
	this.__edivs = [];
	this._selection = {};

	// In Chrome the following will throw an error since the array contains two pointers to the same child element node (?), possibly the node is appended twice (but in this case it should remove the first)
	try {

		while(child = this.__eMain.lastChild)
			this.__eMain.removeChild(child);

		// clear HTML Main
		// while (this.__eMain.childNodes.length)
		// 	this.__eMain.removeChild(this.__eMain.childNodes[0]);

	} catch (e) {
		// for Chrome 27
		this.__eMain.innerHTML = '';
	}

	// Label as day or week for css
	removecss(this._main, 'day', 'week');
	addcss(this._main, this.__start == this.__end ? 'day' : 'week');

	//Draw Columns in TITLE and MAIN
	var etd, ettd, ediv, ediv2, initPos,
		colsize = 100 / (1 + this.__end - this.__start),
		adcount = 0,
		oJSDate = new IcewarpDate(),
		iToday = oJSDate.format(IcewarpDate.JULIAN),
		sNoTitle = getLang("EVENT_VIEW::NO_TITLE"),
		sPrivateTitle = getLang("EVENT_VIEW::PRIVATE"),
		date_format = getLang('LANGUAGE::WEEK_DATE', false, 2) || 'ddd D MMMM';

	for (var i = this.__start; i <= this.__end; i++) {
		oJSDate = new IcewarpDate(i, {format: IcewarpDate.JULIAN});

		//*** Holiday & Weather TD
		ettd = mkElement('td', {id: this._pathName + '#title/' + i, style: {width: (this.__end == i ? 'auto' : colsize + '%')}});
		if (i == iToday)
			ettd.className = 'today';

		var alternative= '';
		if (+GWOthers.getItem('CALENDAR_SETTINGS', 'alternative_calendar') >= 0)
			alternative = ' / '+oJSDate.clone({calendar: +GWOthers.getItem('CALENDAR_SETTINGS', 'alternative_calendar')}).date();

		ettd.innerHTML = '<div class="obj_evnviewday" unselectable="on">' + oJSDate.format(date_format) + alternative + '</div>';

		if (aHollidays[i]) {
			var adcount2 = aHollidays[i].length, adtmp, sTEXT, aLoc,
					bCelsius = GWOthers.getItem('CALENDAR_SETTINGS', 'temperature') == 'C';

			//Update max title height
			if (adcount2 > adcount)
				adcount = adcount2;

			aHollidays[i].sort(this.__sortHolidays);
			for (var ad in aHollidays[i]) {

				//Holidays
				adtmp = mkElement('div');

				//Weather
				if (aHollidays[i][ad]['location'] && aHollidays[i][ad]['location'].indexOf('type=weather') == 0) {
					if (GWOthers.getItem('RESTRICTIONS', 'DISABLE_WEATHER_SETTING') == 0) {
						aLoc = parseURL(aHollidays[i][ad]['location']);
						adtmp.className = 'obj_evnviewweather ico_' + aLoc.icon;
						aLoc.city = aLoc.loc.split(',')[0];
						aLoc.low = bCelsius ? aLoc.c_lo + '°C' : aLoc.f_lo + '°F';
						aLoc.high = bCelsius ? aLoc.c_hi + '°C' : aLoc.f_hi + '°F';
						sTEXT = aLoc.high + ' ' + aLoc.city; // + ' - ' + aLoc.cond;
						AttachEvent(adtmp, 'onmouseover', this._showTooltip({template: 'obj_event_weather', values: aLoc}));
					}else{
						sTEXT = '';
					}
				} else {
					adtmp.title = sTEXT = aHollidays[i][ad].title || '';
					//Public Holiday
					if (aHollidays[i][ad]['location'] && aHollidays[i][ad]['location'].indexOf('type=public') == 0)
						adtmp.className = 'obj_evnviewholiday_p';
					//Holiday
					else
						adtmp.className = 'obj_evnviewholiday';
				}

				if (aHollidays[i][ad]['color'])
					adtmp.innerHTML = '<span style="border-color: ' + aHollidays[i][ad]['color'] + '">' + sTEXT.escapeHTML() + '</span>';
				else
					adtmp.innerHTML = sTEXT.escapeHTML();

				ettd.appendChild(adtmp);
				adtmp = null;
			}
		}

		this.__eTitle.appendChild(ettd);

		//*** AllDay TD
		ettd = mkElement('td', {id: this._pathName + '/allday/' + i});
		if (i == iToday)
			ettd.className = 'today';
		if (i == this.__start)
			ettd.appendChild((this.__eTopAnchor = mkElement('div', {className: 'topAnchor'})));

		this.__eAllDay.appendChild(ettd);
		ettd = null;


		//*** Main TD
		etd = mkElement('td', {id: this._pathName + '/' + i, style: {width: (this.__end == i ? 'auto' : colsize + '%')}});
		//setSelectNone(etd);
		if (i == iToday) {
			etd.className = 'today';
			etd.appendChild(mkElement('div', {'className': 'today_box'}));
		}

		//continue, if day is blank
		if (!aData[i] || !aData[i].length) {
			this.__eMain.appendChild(etd);
			etd = null;
			continue;
		}

		// create START & END
		for (var j = aData[i].length - 1; j > -1; j--) {

			//add Start & End
			aData[i][j]['start'] = Math.floor(aData[i][j]['starttime'] / 1800);
			aData[i][j]['end'] = Math.ceil(aData[i][j]['endtime'] / 1800);

			if (aData[i][j]['start'] >= aData[i][j]['end'])
				aData[i][j]['end'] = aData[i][j]['start'] + 1;

			aData[i][j]['position'] = 0;
			aData[i][j]['delimiter'] = 1;
			aData[i][j]['width'] = 1;
		}

		var etd2 = mkElement('div', {'className': 'space_box'});

		// sort array
		aData[i].sort(this.__sortEvn);

		// move block into holes :)
		var j = 0,
				old_j,
				block,
				iend = 0,
				relPosition = 0;

		while (aData[i][j]) {
			old_j = j;
			block = aData[i][j];
			iend = iend ? iend : block['end'];
			relPosition = 0;       // relativni pozice vuci hlavnimu bloku

			//najit celou posloupnost bloku az do urovne 0
			for (var k = j + 1, kk = aData[i].length; k < kk; k++) {

				//nejaky to omezeni... kdyby to blblo je to tim :)
				if (aData[i][k]['start'] >= iend) {
					j++;
					break;
				}

				if (iend < aData[i][k]['end'])
					iend = aData[i][k]['end'];

				//blok lze zasunout
				if (block['end'] <= aData[i][k]['start']) {

					aData[i][k]['position'] = block['position'];

					aData[i].splice(j + 1, 0, aData[i][k]);
					aData[i].splice(k + 1, 1);
					j++;

					break;
				} else {
					if (aData[i][k - 1]['end'] && aData[i][k]['start'] < aData[i][k - 1]['end'])
						relPosition++;

					aData[i][k]['position'] = aData[i][j]['position'] + relPosition;
				}
			}

			if (!aData[i][j]['position'] && aData[i][j]['start'] >= iend)
				iend = 0;

			if (old_j == j)
				j++;
		}


		// delimiter
		var pos, del;
		for (var j = 0, DataLng = aData[i].length; j < DataLng; j++) {

			if (aData[i][j]['position'] == 0) {

				//zjistit jestli ho neco prekrejva, pokud ne tak continue
				var prekrejva = -1;
				for (var k = j; k < DataLng; k++) {

					if (aData[i][k]['position'] > aData[i][j]['position']) {
						if (aData[i][k]['start'] < aData[i][j]['end'])
							prekrejva = k;

						break;
					}
				}
				if (prekrejva < 0)
					continue;

				// zjistit pocet columns z potomku
				del = 1;
				pos = 0;
				for (var k = prekrejva; k < DataLng; k++) {
					if (aData[i][k]['position'] < pos)
						break;
					if (aData[i][k]['position'] == pos)
						continue;

					pos = aData[i][k]['position'];
					del = pos + 1;
				}

				/*
				 @Note:
				 j...(k-1) - klice celeho seskupeni bloku
				 del       - delimiter
				 */

				//priradit delimiter celemu bloku

				/*
				 @Note:
				 naschval pouzivam opet "j" aby dalsi iterace nadrazene smycky
				 zacala az za seskupenim
				 */
				for (; j < k; j++) {                  // pozor jestli je J dostatecne velke!
					aData[i][j]['delimiter'] = del;

					var dif = 0;

					for (var l = j + 1; l < k; l++) {
						if (aData[i][j]['position'] < aData[i][l]['position'] && aData[i][j]['start'] < aData[i][l]['end'] && aData[i][j]['end'] > aData[i][l]['start']) {
							dif = aData[i][l]['position'] - aData[i][j]['position'];
							break;
						}
					}
					if (dif > 1)
						aData[i][j]['width'] = dif;
					else
					if (dif == 0 && aData[i][j]['position'] + 1 < aData[i][j]['delimiter'])
						aData[i][j]['width'] = aData[i][j]['delimiter'] - aData[i][j]['position'];
				}
				j--;

			}
		}

		var value, css;
		initPos = 0;

		for (var j = 0, jj = aData[i].length; j < jj; j++) {

			//CSS
			css = ['obj_evnviewevn'];

			if (!this.__rights.modify && aData[i][j].owner != sPrimaryAccountGWID)
				css.push('disabled');

			if (aData[i][j].id == this.__activeEvent)
				css.push('active');

			if (aData[i][j].fcolor)
				css.push(aData[i][j].fcolor);

			if (aData[i][j].evnflags & 32)
				css.push('unresponded');

			if (aData[i][j].evnflags & 4)
				css.push('F');
			if (aData[i][j].evnflags & 8)
				css.push('T');
			if (aData[i][j].evnflags & 16)
				css.push('O');

			// start position
			aData[i][j]['init'] = initPos;
			initPos += aData[i][j]['end'] - aData[i][j]['start'];

			// event div
			var ediv = mkElement('div');

			//setSelectNone(ediv); // no select (inheritance doesnt work in  MSIE)
			ediv.id = this._pathName + '/' + i + '/' + aData[i][j].id;
			ediv.className = css.join(' ');
			//ediv.className = 'obj_evnviewevn' + (this.__rights.modify || aData[i][j].owner == sPrimaryAccountGWID?'':' disabled') + (aData[i][j].id == this.__activeEvent?' active':'') + (aData[i][j].fcolor?' '+aData[i][j].fcolor:'') + (aData[i][j].evnflags & 32?' unresponded':'');
			ediv.style.top = (this.__rowheight * (aData[i][j]['start'] - aData[i][j]['init'])) + 'px';
			ediv.style.height = (this.__rowheight * (aData[i][j]['end'] - aData[i][j]['start'])) + 'px';

			if (this.__rights.modify || aData[i][j].owner == sPrimaryAccountGWID)
				ediv.onmousemove = this.__swapCursor;

			ediv.style.width = ((100 / aData[i][j]['delimiter']) * aData[i][j]['width']) + '%';
			if(gui._rtl) {
				ediv.style.right = ((100 / aData[i][j]['delimiter']) * aData[i][j]['position']) + '%';
			} else {
				ediv.style.left = ((100 / aData[i][j]['delimiter']) * aData[i][j]['position']) + '%';
			}

			//text
			ediv2 = mkElement('div');
			//setSelectNone(ediv2); // no select (inheritance doesnt work in  MSIE)

			value = this.__value[aData[i][j].tmpid];

			//if (value.color)
			// 	ediv2.className = 'color';

			ediv2.innerHTML = (aData[i][j].conferenceid ? '<ins class="conference"></ins>' : '')
					+ (aData[i][j].rmnevn_id ? '<ins class="rmn"></ins>' : '')
					+ value.color
					+ (value.title ? value.title.escapeHTML() : (value.evnsharetype === 'U' ? sNoTitle : sPrivateTitle)) + (value['location'] ? ' (' + value['location'].escapeHTML() + ')' : '');

			ediv.appendChild(ediv2);
			etd2.appendChild(ediv);

			// Add tooltip info
			var info = {
				title: value.title || sNoTitle,
				location: value.location,
				reminder: !!aData[i][j].rmnevn_id,
				recurrent: !!aData[i][j].evnrcr_id,
				tags: value.taglist || false
			};

			if (aData[i][j]['startdate'] == aData[i][j]['enddate']) {
			/*	info.start = IcewarpDate.julian(value.startdate,value.starttime);
				info.end = IcewarpDate.julian(value.enddate,value.endtime);
				info.duration = IcewarpDate.duration(info.end.diff(info.start)).humanize();
				info.start = info.start.format('LT');
				info.end = info.end.format('LT');
			*/	info.start = parseJulianTime(value.starttime);
				info.end = parseJulianTime(value.endtime);
				info.duration = parseInt((value.endtime - value.starttime) / 60);
				info.duration = info.duration < 120 ? new IcewarpNumber(info.duration).localize() + ' ' + getLang('TIME::MINUTES') : new IcewarpNumber(Math.round(info.duration / 60)).localize() + ' ' + getLang('TIME::HOURS');
			} else {
				info.start = IcewarpDate.julian(value.startdate, value.starttime / 60);
				info.end = IcewarpDate.julian(value.enddate, value.endtime / 60);
				info.starttime = info.start.format('LT');
				info.endtime = info.end.format('LT');
				info.start = info.start.format(IcewarpDate.SHORT_L);
				info.end = info.end.format(IcewarpDate.SHORT_L);
				info.duration = Math.round((86400 - value.starttime + value.endtime) / 3600 + (value.enddate - value.startdate - 1) * 24);
				info.duration = info.duration < 24 ? info.duration + ' ' + getLang('TIME::HOURS') : (value.enddate - value.startdate + 1) + ' ' + getLang('TIME::DAYS');
			}

			if (value.title) {

				// for tooltip
				if (value.evnowneremail != sPrimaryAccount)
					info.owner = value.evnowneremail;

				AttachEvent(ediv, 'onmouseover', this._showTooltip({template: 'obj_event_tooltip', values: info}));
			}

			ediv = null;
		}

		etd.appendChild(etd2);
		this.__eMain.appendChild(etd);
		etd = null;
		etd2 = null;
	}



	this._fillAllDay();

	//set range
	if (this.__startTime) {
		this.__eContainer2.scrollTop = this.__rowheight * this.__startTime * 2;

		var tmpt1 = this._getAnchor('time1');
		tmpt1.style.height = (this.__rowheight * this.__startTime * 2) + 'px';

		this.__startTime = null;
	}
	if (this.__endTime) {
		var tmpt2 = this._getAnchor('time2');
		tmpt2.style.top = (this.__rowheight * this.__endTime * 2) + 'px';
		tmpt2.style.height = (this.__rowheight * (24 - this.__endTime) * 2) + 'px';

		this.__endTime = null;
	}

	if (this.__editMode)
		this.__createEdit();
};


_me.__createEdit = function () {

	if (this.__editMode && this.__editEvent) {
		var me = this, inp,
				itm = this._useItem(this.__editEvent);

		if (!itm) {
			this.__noRefresh = false;
			return;
		}

		this.__noRefresh = true;

		var elm = document.getElementById(this._pathName + '/' + this.__editEvent) || document.getElementById(this._pathName + '/' + itm.startdate + '/' + this.__editEvent);
		var duration = (itm.enddate - itm.startdate) * 86400 - itm.starttime + itm.endtime;
		// Editing within main calendar (timed events during day)
		if (elm && itm.starttime > -1 && duration < 86400) {
			inp = mkElement('textarea');
			elm.replaceChild(inp, elm.getElementsByTagName('div')[0]);
		}
		// Editing in weekview (events at least 24h long)
		else if (elm) {
			elm.innerHTML = '<span><input type="text" /></span>';
			inp = elm.getElementsByTagName('INPUT')[0];
		} else {
			this.__noRefresh = false;
			return;
		}

		if (inp) {

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
				var e = e || window.event;

				//execute only once!
				this.onblur = null;

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
						if (me.__value[i].id == 'edit') {
							me.__value.splice(i, 1)[0];
							break;
						}

				me.__editEvent = '';

				if (me.__activeEvent == 'edit')
					me.__activeEvent = '';

				me.__noRefresh = false;

				me._fill();

				//Return focus back
				me._focus();
			};

			inp.focus();
			inp.value = this.__eIN.value || '';
		}
	}
};

_me.__sortEvn = function (a, b) {
	// Primary sorting on start time
	var x = a['start'] - b['start'];
	// Sort according to folder colour
	if (x == 0 && a.fcolor != b.fcolor)
		x = a.fcolor >= b.fcolor ? 1 : -1;
	// If still not sorted, sort by end time
	if (x == 0)
		x = (b['end'] - a['end']);

	return x;
};

_me.__sortHolidays = function (a, b) {
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

/*
 //private cursor function
 _me.__swapCursor = function (e){
 var e = e || window.event,
 elm = e.target || e.srcElement,
 x = e.x || e.layerX,
 y = e.y || e.layerY;

 if (elm.tagName == 'DIV'){
 if (typeof x == 'undefined' || typeof y == 'undefoned'){
 elm.style.cursor = 'default';
 return;
 }

 if (x <= 6){
 if (elm.style.cursor != 'move')
 elm.style.cursor = 'move';
 }
 else
 if (x && elm.style.cursor != 'n-resize')
 elm.style.cursor = 'n-resize';
 }
 };
 */
//private cursor function
_me.__swapCursor = function (e) {
	var e = e || window.event,
			elm = e.target || e.srcElement,
			x = e.x || e.layerX,
			y = e.y || e.layerY;

	if (elm.tagName == 'DIV' && Is.Defined(x)) {
		if (x < 8 && elm == this) {
			if (this.style.cursor != 'move')
				this.style.cursor = 'move';
		} else
		if (y < 3 || elm.offsetHeight - y < 3) {
			if (this.style.cursor != 'n-resize')
				this.style.cursor = 'n-resize';
		} else
		if (this.style.cursor != 'pointer')
			this.style.cursor = 'pointer';
	} else
	if (this.style.cursor != 'default')
		this.style.cursor = 'default';
};

/**
 * id - event ID
 * bClick - event was caused by left click (edit)
 **/
_me._activate = function (id, bClick) {

	if (Is.Defined(id)) {

		var elm, itm, aActive = [];

		//deactivate old one
		if (Is.Defined(this.__activeEvent)) {
			if (this.__activeEvent == id)
				return;

			if ((itm = this._useItem(this.__activeEvent)) && itm.id == this.__activeEvent) {
				elm = this.__getItemElm(itm);
				for (var i in elm)
					removecss(elm[i], 'active');
			}
		}

		//activate new one
		if (id && (itm = this._useItem(id)) && (this.__rights.modify || itm.owner == sPrimaryAccountGWID)) {

			this.__activeEvent = id;

			elm = this.__getItemElm(itm);
			for (var i in elm)
				addcss(elm[i], 'active');

			// Update top menu bar to enable context editing
			gui.__exeEvent('itemSelected', [this._parent.__aid, this._parent.__fid, [id]]);
			// gui.frm_main.hmenu3._contextRefill([id]);
			aActive = [id];

		} else {
			this.__activeEvent = '';

			// Update top menu bar
			gui.__exeEvent('folderSelected', [this._parent.__aid, this._parent.__fid]);
			// gui.frm_main.hmenu3._contextRefill([]);
		}

		if (this._onactivate)
			this._onactivate(aActive);
		this.__exeEvent('onactivate',null,{"value":aActive,"owner":this});

	} else
		return this.__activeEvent;
};

/**
 * Returns ITEM value
 * @params:
 *		id
 *      aValue (optional)
 * 2.6.2011 17:25:04
 **/
_me._useItem = function (id, aValue) {
	for (var i = this.__value.length - 1; i > - 1; i--)
		if (this.__value[i].id == id)
			if (aValue) {
				this.__value[i] = aValue;
				break;
			} else
				return clone(this.__value[i]);
};

_me.__getElm = function (id, col) {
	return document.getElementById(this._pathName + (col ? '/' + col : '') + '/' + id);
};

_me.__getItemElm = function (itm) {
	var elm;

	//AllDay
	if (itm.starttime < 0 || (this.__start != itm.enddate && this.__end != itm.startdate && (itm['enddate'] - itm['startdate'] > 1 || (itm['enddate'] - itm['startdate'] == 1 && itm['endtime'] > itm['starttime'])))) {
		if ((elm = this.__getElm(this.__activeEvent)))
			return [elm];
	} else {
		var out = [],
				iStart = itm['startdate'] < this.__start ? this.__start : itm['startdate'],
				iEnd = itm['enddate'] > this.__end ? this.__end : itm['enddate'];

		for (var d = iStart; d <= iEnd; d++)
			if ((elm = this.__getElm(this.__activeEvent, d)))
				out.push(elm);

		return out;
	}
};

_me._focus = function (s) {
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
	} else {
		if (this.__allDaySelection.startdate) {
			if (this.__allDaySelection.startdate >= this.__start && this.__allDaySelection.enddate <= this.__end)
				for (var i in this.__aAllDay)
					if (this.__aAllDay[i].startdate >= this.__allDaySelection.startdate && this.__aAllDay[i].enddate <= this.__allDaySelection.enddate)
						ids.push(this.__aAllDay[i].id);
		} else
		if (this._selection.startdate && this._selection.startdate >= this.__start && this._selection.enddate <= this.__end) {
			var tmp;
			for (var i in this.__idTable)
				for (var j in this.__idTable[i]) {
					tmp = this.__idTable[i][j];
					if (tmp.startdate >= this._selection.startdate && tmp.enddate <= this._selection.enddate) {
						if ((tmp.startdate == this._selection.startdate && tmp.starttime < this._selection.starttime) || (tmp.enddate == this._selection.enddate && tmp.endtime > this._selection.endtime))
							continue;

						ids.push(tmp['id']);
					}
				}
		}
	}

	return ids;
};
