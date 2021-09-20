/*
	(function(){

		var frm = gui._create('frm','obj_popup');
		frm._size(400,800,true);
		frm._create('fb','obj_freebusy');

		frm.fb._init({
			users: [
				'admin@merakdemo.com',
				'user@merakdemo.com',
				'domain@merakdemo.com'
			]
		});

		var iwt = new IcewarpDate();
		frm.fb._value({
			startdate: iwt.format('julian'),
			starttime: 480, // 8AM
			enddate: iwt.format('julian'),
			endtime: 570,
			title: 'Tralala'
		});
	})();

*/
function obj_freebusy() {}
obj_freebusy.__SLOTHEIGHT = 17;		// 30min in px
obj_freebusy.__DAYHEIGHT = 816;		// day in px
obj_freebusy.__PREFETCH = 3;		// number of days
obj_freebusy.__EVNTYPE = {UNKNOWN:'unknown', BUSY:'busy'}; //Allowed event types

_me = obj_freebusy.prototype;
_me.__constructor = function () {
	this.__eBody = this._getAnchor('body');
	this.__scrollTop = 0;

	this.__opt = {};

	this.__lastRange = [0,0];
	this.__range = [0,0];
	this.__aData = {};

	this.__inCollision = false;
	this.__readonly = false;

	this.__now_int = null;
	this.__now_div = null;

	this.__title = '';
	this.__value = {};

	this._freeBusy = new wm_freebusy();

	//fill hours into timeline
	this.__timeline = {time:[]};
	var iwd = new IcewarpDate();
	for (var i = 60; i<1440; i+=60){
		this.__timeline.time.push(iwd.setTime(i, true).format('LT'));
	}

	this._create('scrollbar', 'obj_scrollbar')._scrollbar(this.__eBody, this._getAnchor('container'));

	this.__eBody.onscroll = function (e) {
		if (this.__scrollTop != this.__eBody.scrollTop) {
			this.__scrollTop = this.__eBody.scrollTop;

			if (this._onscroll)
				this._onscroll(this.__scrollTop);

			this.__exeEvent('onscroll',e,{"arg":this.__scrollTop,"owner":this});
		}
	}.bind(this);

	this.__eBody.ondblclick = function(elm, e){

		var e = e || window.event;
		if (this.__plan_div && this.__plan_div.contains(e.target || e.srcElement))
			return;

		var y = gui.__Y - getSize(elm).y + elm.scrollTop,
			d = this.__range[0] + Math.floor(y/obj_freebusy.__DAYHEIGHT),
			t = Math.floor(y%obj_freebusy.__DAYHEIGHT/obj_freebusy.__SLOTHEIGHT)*30,
			v = this._value();

		this._value(obj_freebusy.__timeShift(v, d - v.startdate, t - v.starttime), false, true);

	}.bind(this, this.__eBody);

	var me = this;
	this.__eBody.onmousedown = function(e) {
		var e = e || window.event,
			elm = e.target || e.srcElement;

		if (this.__readonly || elm.parentNode.classList.contains('plan')) {
			return;
		}

		var x = Math.floor((gui.__Y + me.__eBody.scrollTop - getSize(me.__eBody).y) / obj_freebusy.__SLOTHEIGHT) * obj_freebusy.__SLOTHEIGHT,
			start, end,
			old = me.__value,
			diff,
			duration = mkElement('span'),
			new_event = mkElement('div', {
				className: 'plan new_event'
			}, false, [
				mkElement('div', {}, false, [ duration ])
			]);

		function move () {
			var top, diff_time, start_date, start_time, end_date, end_time;

			if(!new_event.parentNode) {
				me.__eBody.appendChild(new_event);
			}

			diff = Math.floor((gui.__Y + me.__eBody.scrollTop - getSize(me.__eBody).y - x) / obj_freebusy.__SLOTHEIGHT) * obj_freebusy.__SLOTHEIGHT;

			if(diff > 0) {
				top = x;
				diff_time = x + diff;
				new_event.classList.remove('top');
				new_event.classList.add('bottom');
			} else {
				top = x + diff;
				diff_time = x;
				new_event.classList.add('top');
				new_event.classList.remove('bottom');
			}

			start_date = me.__range[0] + Math.floor(top / obj_freebusy.__DAYHEIGHT);
			start_time = (top - (start_date - me.__range[0]) * obj_freebusy.__DAYHEIGHT) / obj_freebusy.__SLOTHEIGHT * 30;
			start = IcewarpDate.julian(start_date, start_time);
			end_date = me.__range[0] + Math.floor(diff_time / obj_freebusy.__DAYHEIGHT);
			end_time = (diff_time - (end_date - me.__range[0]) * obj_freebusy.__DAYHEIGHT) / obj_freebusy.__SLOTHEIGHT * 30;
			end = IcewarpDate.julian(end_date, end_time);

			new_event.style.top = top + 'px';
			new_event.style.height = Math.abs(diff) + 'px';
			difference = Math.round((end - start) / 360000) / 10;
			duration.textContent = getLang('TIME_INTERVAL::DURATION') + ': ' + Math.floor(difference) + ':' + ('0' + (difference % 1 * 60)).slice(-2) + 'h';
		};

		gui._obeyEvent('mousemove', [move]);
		me._obeyEvent('onscroll', [move]);

		gui._obeyEvent('mouseup', [function(){
			gui._disobeyEvent('mousemove', [move]);
			me._disobeyEvent('onscroll', [move]);

			new_event.parentNode && new_event.parentNode.removeChild(new_event);

			diff && me._value({
				startdate: start.format('julian'),
				starttime: start.format('julian_time'),
				enddate: end.format('julian'),
				endtime: end.format('julian_time')
			}, true, true, { noCollision: true });

			var v = me.__value;
			if (!compareObj(old, v)){

				me._collision();

				var val = me._value();
				if (me._onchange)
					me._onchange(val);
				me.__exeEvent('onchange',null,{"arg":val,"owner":me});
			}

			return false;
		}]);
	};

	//Resize
	var eFrame = mkElement('iframe', {
		frameborder: 0,
		marginheight: 0,
		marginwidth: 0,
		src: "",
		seamless: "seamless"
	});
	this._main.appendChild(eFrame);

	var height = eFrame.offsetHeight;
	eFrame.contentWindow.onresize = function (e) {
		if (height != eFrame.offsetHeight) {
			height = eFrame.offsetHeight;

			if (this._onsize)
				this._onsize(height);
		}
	}.bind(this);

	//Add PLAN plug-in object
	this._create('plan', 'obj_freebusy_plan', 'block', '', this);

	this._add_destructor('__destructor');
};

/**
 * PRIVATE
 *
 * @param {int} pos scrollTop
 * @param {bool} bNoEvn do not request
 */
_me.__scroll = function (pos, bNoEvn) {
	if (Is.Defined(pos)){
		pos = Math.max(0, pos);
		pos = Math.min(this.__eBody.scrollHeight - this.__eBody.clientHeight, pos);

		if (bNoEvn)
			this.__scrollTop = pos;

		this.__eBody.scrollTop = pos;

		return pos;
	}

	return this.__scrollTop;
};

/**
 * PRIVATE Converts minutes into Pixel Height or Position
 *
 * @param {int} iTime (minutes)
 * @returns
 */
_me.__position = function (iTime, bFine, bCeil) {
	var fx = bCeil?Math.ceil:Math.floor;

	if (bFine)
		return fx(iTime / 30 * obj_freebusy.__SLOTHEIGHT);
	else
		return fx(iTime / 30) * obj_freebusy.__SLOTHEIGHT;
};

_me._onscroll = function(v){

	if (v < 100){
		this.__request([this.__range[0] - 1 - obj_freebusy.__PREFETCH, this.__range[0] - 1]);
	}
	else
	if (v > this.__eBody.scrollHeight - this.__eBody.clientHeight - 100){
		this.__request([this.__range[1] + 1, this.__range[1] + 1 + obj_freebusy.__PREFETCH]);
	}

	//set date
	this._dateLabel();
};

_me._dateLabel = function(){
	var iwd = IcewarpDate.julian(this.__range[0] + Math.floor((this.__eBody.scrollTop + obj_freebusy.__SLOTHEIGHT)/obj_freebusy.__DAYHEIGHT)),
		elm = this._getAnchor('date');

	elm.innerHTML = iwd.format('MMM D');

	if (this.__eBody.scrollTop%obj_freebusy.__DAYHEIGHT>obj_freebusy.__DAYHEIGHT - obj_freebusy.__SLOTHEIGHT*3 && this.__eBody.scrollTop%obj_freebusy.__DAYHEIGHT<obj_freebusy.__DAYHEIGHT - obj_freebusy.__SLOTHEIGHT){
		elm.style.top = (obj_freebusy.__DAYHEIGHT - obj_freebusy.__SLOTHEIGHT*3 - (this.__eBody.scrollTop%obj_freebusy.__DAYHEIGHT)) + 'px';
	}
	else{
		elm.style.top = 0;
	}
};

/**
 * PUBLIC Set planned event
 *
 * @param {array} aValue 	{startdate: int, starttime: int, enddate: int, endtime: int}
 * @param {bool} bNoScroll
 * @returns
 */
_me._value = function(aValue, bNoUpdate, bNoScroll, aOpt){

	aOpt = aOpt || {};

	if (Is.Defined(aValue)){
		aValue.start_d = aValue.startdate;
		if (aValue.starttime < 0){
			aValue.start_t = 0;
			aValue.end_t = 1440;
			aValue.end_d = aValue.enddate - 1;
		}
		else{
			aValue.start_t = aValue.starttime;
			aValue.start_t2 = Math.floor(aValue.starttime/30)*30;
			aValue.end_t = aValue.endtime;
			aValue.end_t2 = Math.ceil(aValue.endtime/30)*30;
			aValue.end_d = aValue.enddate;
		}

		//check difference
		var tzid = this._value().tzid;
		if (aValue.tzid && tzid != aValue.tzid){
			aOpt.force = true;
		}
		else
		if (this.__value.startdate == aValue.startdate && this.__value.enddate == aValue.enddate && this.__value.starttime == aValue.starttime && this.__value.endtime == aValue.endtime){
			if (!aValue.title || aValue.title == this.__title)
				return;
		}

		if (aValue.title){
			this.__title = aValue.title;
			delete aValue.title;
		}

		if (aOpt.force)
			this.__range = [0,0];

		this.__value = aValue;

		//Inside current range
		if (this.__range[0]<aValue.startdate && this.__range[1]>aValue.enddate){
			this.__replan(!aOpt.noCollision);

			if (!bNoScroll){
				this.__scroll(this.__position((aValue.startdate - this.__range[0])*1440 + aValue.start_t) - Math.ceil(this.__eBody.offsetHeight/8), true);
			}
		}
		//outside
		else{
			var r1 = aValue.startdate - obj_freebusy.__PREFETCH,
				r2 = aValue.startdate + Math.ceil(Math.min(this.__eBody.offsetHeight, document.body.clientHeight)/obj_freebusy.__DAYHEIGHT) - 1 + obj_freebusy.__PREFETCH;

			aOpt.scroll = !bNoScroll;

			this.__request([r1,r2], null, aOpt);
		}

		if (!bNoUpdate){
			var val = this._value();
			if (this._onchange)
				this._onchange(val);
			this.__exeEvent('onchange',null,{"arg":val,"owner":this});
		}
	}
	else{
		var out = {
			startdate: this.__value.startdate,
			starttime: this.__value.starttime,
			enddate: this.__value.enddate,
			endtime: this.__value.endtime,
			tzid: this.__value.tzid || this.__opt.tzid,
			title: this.__title
		};

		//convert Event to All Day
		if (out.starttime == 0 && out.endtime == 1440){
			out.starttime = -1;
			out.endtime = -1;
			out.enddate++;
		}

		return out;
	}
};

/**
 * Planed event title
 *
 * @param {string} sTitle
 * @returns sTitle
 */
_me._title = function(sTitle){
	if (Is.String(sTitle)){
		this.__title = sTitle;
		this.__replan();
	}
	else
		return this.__title;
};

/**
 * @param {boolean} bReadonly
 * @returns bReadonly
 */
_me._readonly = function(bReadonly){
	if (Is.Defined(bReadonly)) {
		this.__readonly = !!bReadonly;
		this._main.classList.toggle('readonly', bReadonly);
	}
	else
		return this.__readonly;
};

/**
 * PUBLIC Initialize default request values
 *
 * @param {object} aOpt {tzid:"Europe/Amsterdam", evnid:"*4c3f531bae86", owner:"admin@merakdemo.com"}
 */
_me._init = function(aOpt){
	var old = clone(this.__opt, true);

	this.__opt = aOpt;
	this.__opt.owner = this.__opt.owner || sPrimaryAccount;
	this.__opt.users = this.__opt.users || [];

	//Reset Schedule
	if (!compareObj(old, this.__opt)){
		this._value(this.__value, true, null, {force:true});
	}
};

/**
 * PUBLIC Menage users
 *
 * @param {array} aUsers
 */
_me._users = function(aUsers){
	if (!compareObj(this.__opt.users, aUsers, true)){

		if (!aUsers || Is.Empty(aUsers)){
			this.__opt.users = [];
			this.__aData = {};
			this.__lastRq = null;
			this.__clean();
			this._collision();
		}
		else{
			//Remove removed users from aData
			this.__opt.users.filter(function(v){
				if (aUsers.indexOf(v)<0){
					this.__removeUser(v);
					return false;
				}
				return true;
			}, this);

			//prepare list of new users
			var aReq = aUsers.filter(function(v){
				return this.__opt.users.indexOf(v)<0;
			}, this);

			this.__opt.users = aUsers;
			this.__request(this.__range, aReq, {force:true});
		}

	}
	else
		this.__opt.users = aUsers;
};
	_me.__removeUser = function(sUser){
		var sUser = sUser.toLowerCase();
		for (var id in this.__aData){
			if (this.__aData[id].ACCOUNT.toLowerCase() == sUser)
				delete this.__aData[id];
		}
	};

/**
 * PRIVATE
 *
 * @param {array} aRange
 * @param {array} aUsers
 * @param {object} aOpt
 * @returns
 */
_me.__request = function(aRange, aUsers, aOpt){

	aOpt = aOpt || {};
	var tzid = this._value().tzid;

	if (Is.Array(aRange)){
		if (!aOpt.force && this.__lastRange[0] == aRange[0] && this.__lastRange[1] == aRange[1] && this.__lastTzid == tzid)
			return;

		if (aRange[0] == 0)	return;

		this.__lastRange = aRange;
		this.__lastRq = unique_id();

		var aU = aUsers || this.__opt.users || [];

		if (aU.length){
			var aData = Object.assign({},this.__opt,{
				from: aRange[0],
				to: aRange[1],
				users: aU
			});

			this.__lastTzid = tzid;
			if (this.__lastTzid)
				aData.tzid = this.__lastTzid;

			this._freeBusy.get(aData,'null','', [this,'__response',[aRange, aUsers, this.__lastRq, aOpt]]);
		}
		//clean events
		else{
			this.__lastRq = unique_id();
			this.__response(true, {}, aRange, [], this.__lastRq, aOpt);
		}
	}
};

_me.__clean = function(){
	var tmp = this.__eBody.querySelectorAll('div.event');
	for(i = tmp.length; i--;){
		tmp[i].parentNode && tmp[i].parentNode.removeChild(tmp[i]);
	}
};

/**
 * PRIVATE freebusy response parser
 *
 * @param {bool} bOK
 * @param {object} aData
 * @param {array} aRange
 */
_me.__response = function(bOK, aData, aRange, aUsers, rqid, aOpt){
	if (!bOK || this._destructed || this.__lastRq != rqid){
		return;
	}

	var scrollTop = null,
		days = {};

	//skip invalid range
	if (aRange[0] < 1){
		return;
	}
	else
	//skip inner range
	if (this.__range[0]<=aRange[0] && this.__range[1]>=aRange[1]){
		if (Is.Array(aUsers)){
			Object.assign(this.__aData, aData);
		}
		else{

			if (aOpt.force)
				this.__replan();

			return;
		}
	}
	else
	//outside range
	if (this.__range[0]>aRange[1]+1 || this.__range[1]<aRange[0]-1){
		this.__aData = aData;
		this.__range = aRange;

		//Scroll to value
		if (!aOpt.scroll)
			scrollTop = this.__position((this.__value.start_d - this.__range[0])*1440 + this.__value.start_t) - Math.ceil(this.__eBody.offsetHeight/8);

		days = {
			clean: true,
			append: this.__range
		};
	}
	//extend range
	else{

		//before
		if (aRange[0] < this.__range[0]){

			if (!aOpt.scroll)
				scrollTop = this.__position((this.__range[0] - aRange[0])*1440) + this.__scroll();

			days.prepend = [aRange[0], this.__range[0]-1];
			this.__range[0] = aRange[0];
		}

		//after
		if (aRange[1] > this.__range[1]){
			days.append = [this.__range[1]+1, aRange[1]];
			this.__range[1] = aRange[1];
		}

		//merge aData && __aData
		Object.assign(this.__aData, aData);
	}

	//prepare data for render
	var aEvents = this.__prepare(this.__aData);

	//print days
	this.__days(days);

	//set scroll
	if (aOpt.scroll){
		this.__scroll(this.__position((this.__value.startdate - this.__range[0])*1440 + this.__value.start_t) - Math.ceil(this.__eBody.offsetHeight/8), true);
		this.__replan(true);
		this._dateLabel();
	}
	else
	if (scrollTop !== null){
		this.__scroll(scrollTop, true);
		this.__replan();
		this._dateLabel();
	}
	else
	if (aOpt.force)
		this._collision();

	//print events
	this.__events(aEvents);

	if (aOpt.handler)
		executeCallbackFunction(aOpt.handler);
};

/**
 * PRIVATE Renders Day blocks
 *
 * @param {array} days range
 */
_me.__days = function(days){

	var iwd, tplData = this.__timeline;

	if (days.prepend){
		tplData.day = [];
		for(var jul = days.prepend[0]; jul <= days.prepend[1]; jul++){
			iwd = IcewarpDate.julian(jul);
			tplData.day.push({
				date: iwd.format('MMM D'),
				fulldate: iwd.format('L'),
				id:jul
			});
		}

		this._draw('obj_freebusy_day', 'body', tplData, 2);
	}

	if (days.append){
		tplData.day = [];
		for(var jul = days.append[0]; jul <= days.append[1]; jul++){
			iwd = IcewarpDate.julian(jul);
			tplData.day.push({
				date: iwd.format('MMM D'),
				fulldate: iwd.format('L'),
				id:jul
			});
		}

		this._draw('obj_freebusy_day', 'body', tplData, !days.clean);
	}
};

/**
 * Render planed event
 *
 */
_me.__replan = function(bCollision){

	if (!this.__plan_div || !this.__plan_div.parentNode){

		var eControls = [mkElement('div'), mkElement('span',{className: 'move', draggable: false}), mkElement('span',{className: 'resize-top', draggable: false}), mkElement('span',{className: 'resize-bottom', draggable: false})];
		this.__plan_div = mkElement('div',{className: 'plan unselectable', draggable: false}, null, eControls);

		var me = this;

		this.__plan_div.onmousedown = function(e){

			var e = e || window.event,
				elm = e.target || e.srcElement;

			if (elm === this || me.__readonly) {
				return;
			} else if (elm === eControls[2] || elm === eControls[3]) {
				me.__plan_div.classList.add('resizing');
			}

			var x = gui.__Y + me.__eBody.scrollTop,
				r = me.__range[0],
				old = clone(me.__value);

			function move (e){

				var dif = gui.__Y - x + me.__eBody.scrollTop - (r-me.__range[0])*obj_freebusy.__DAYHEIGHT,
					dif_time = Math.round(dif/obj_freebusy.__SLOTHEIGHT)*30,
					v;

				if (dif<=0 && !dif_time){
					v = old;
				}
				else
				if (Math.abs(dif_time)>0){

					//Convert allday to event
					if (old.starttime == -1){
						old.starttime = 0;
						old.endtime = 1440;
						old.enddate = Math.max(old.startdate, old.enddate-1);
					}

					//MOVE
					if (elm === eControls[1]){
						v = obj_freebusy.__timeShift(old, 0, dif_time);
					}
					else
					//RESIZE Start
					if (elm === eControls[2]){
						var iwtS = IcewarpDate.julian(old.startdate,old.starttime),
							iwtE = IcewarpDate.julian(old.enddate,old.endtime);

						iwtS.add(dif_time,'m');

						//.isBefore/.isAfter somehow doesn't work reliable here
						if (iwtS.format('julian') >= iwtE.format('julian') && iwtS.format('julian_time') >= iwtE.format('julian_time'))
							iwtS = iwtE.subtract(30, 'm');

						v = Object.assign({}, old, {startdate:iwtS.format('julian'), starttime:iwtS.format('julian_time')});
					}
					else
					//RESIZE End
					if (elm === eControls[3]){
						var iwtS = IcewarpDate.julian(old.startdate,old.starttime),
							iwtE = IcewarpDate.julian(old.enddate,old.endtime);

						iwtE.add(dif_time,'m');

						if (iwtS.format('julian') >= iwtE.format('julian') && iwtS.format('julian_time') >= iwtE.format('julian_time'))
							iwtE = iwtS.add(30, 'm');

						v = Object.assign({}, old, {enddate:iwtE.format('julian'), endtime:iwtE.format('julian_time')});
					}
				}

				if (v)
					me._value(v, true, true, {noCollision:true});
			};

			gui._obeyEvent('mousemove', [move]);
			me._obeyEvent('onscroll', [move]);

			gui._obeyEvent('mouseup', [function(){
				gui._disobeyEvent('mousemove', [move]);
				me._disobeyEvent('onscroll', [move]);

				me.__plan_div.classList.remove('resizing');

				var v = me.__value;
				if (!compareObj(old,v)){

					me._collision();

					var val = me._value();
					if (me._onchange)
						me._onchange(val);
					me.__exeEvent('onchange',null,{"arg":val,"owner":me});
				}

				return false;
			}]);
		};

		this.__eBody.appendChild(this.__plan_div);
	}

	this.__plan_div.firstChild.innerHTML = (Is.String(this._title())?'<span>'+ this._title().escapeHTML() +'</span>':'') + (this.__value.starttime>-1?IcewarpDate.julian(this.__value.startdate, this.__value.starttime).format('LT') +' - '+ IcewarpDate.julian(this.__value.enddate, this.__value.endtime).format('LT'):'');

	this.__plan_div.style.top = this.__position((this.__value.start_d - this.__range[0])*1440 + this.__value.start_t2) + 'px';
	var h = this.__position((this.__value.end_d - this.__value.start_d)*1440 + this.__value.end_t2 - this.__value.start_t2, false, true);

	this.__plan_div.style.height = h + 'px';
	if (h == obj_freebusy.__SLOTHEIGHT)
		addcss(this.__plan_div, 'small');
	else
		removecss(this.__plan_div, 'small');

	if (bCollision)
		this._collision();
};

/**
 * PRIVATE converts server data
 * @param {object} aData
 * @param {array} aRange optional
 *
 * @returns {object}
 */
_me.__prepare = function(aData, aRange){
	var aOut = [], evn,
		aRange = aRange || this.__range;

	for(var id in aData){
		evn = aData[id];

		evn.id = id;
		evn.startdate = Math.max(aRange[0], evn.STARTDATE);
		evn.starttime = evn.startdate != evn.STARTDATE?0:Math.max(evn.STARTTIME, 0);

		var end = evn.ENDDATE;
		if (evn.ENDTIME == 0 && evn.STARTDATE<evn.ENDDATE)
			end--;

		evn.enddate = Math.min(aRange[1], end);
		evn.endtime = evn.enddate != end?1440:Math.max(evn.ENDTIME, 0);

		//add Start & End
		evn.start2 = Math.floor(evn.starttime / 30) * 30;
		evn.end2 = Math.ceil(evn.endtime / 30) * 30;
		if (evn.start2 >= evn.end2)
			evn.end2 = evn.start2 + 30;

		evn.start	= evn.startdate*1440 + evn.start2;
		evn.end	= evn.enddate*1440 + evn.end2;

		evn.position = 0;
		evn.width = 1;

		aOut.push(evn);
	}

	aOut.sort(function (a, b) {
		// Primary sorting on start time
		var x = a.STARTDATE - b.STARTDATE;
		if (x == 0){
			x = a.STARTTIME - b.STARTTIME;
			// If still not sorted, sort by end time
			if (x == 0)
			 	x = b.end - a.end;
		}
		return x;
	});

	// move block into holes :)
	var old_j,
		j = 0,
		block,
		iend = 0,
		relPosition = 0;

	while (aOut[j]) {
		old_j = j;

		block = aOut[j];
		iend = iend ? iend : block.end;
		relPosition = 0;

		//najit celou posloupnost bloku az do urovne 0
		for (var k = j + 1, l = aOut.length; k < l; k++) {
			if (iend < block.end)
				iend = block.end;

			//blok lze zasunout
			if (block.end <= aOut[k].start) {

				aOut[k].position = block.position;

				aOut.splice(j + 1, 0, aOut[k]);
				aOut.splice(k + 1, 1);
				j++;

				break;
			} else {
				if (aOut[k - 1].end && aOut[k].start < aOut[k - 1].end)
					relPosition++;

				aOut[k].position = block.position + relPosition;
			}
		}

		if (!block.position && block.start >= iend)
			iend = 0;

		if (old_j == j)
			j++;
	}

	// delimiter
	var pos, del;
	for (var j = 0, l = aOut.length; j < l; j++) {

		if (aOut[j]['position'] == 0) {

			//zjistit jestli ho neco prekrejva, pokud ne tak continue
			var prekrejva = -1;
			for (var k = j; k < l; k++) {

				if (aOut[k]['position'] > aOut[j]['position']) {
					if (aOut[k]['start'] < aOut[j]['end'])
						prekrejva = k;

					break;
				}
			}
			if (prekrejva < 0)
				continue;

			// zjistit pocet columns z potomku
			del = 1;
			pos = 0;
			for (var k = prekrejva; k < l; k++) {
				if (aOut[k]['position'] < pos)
					break;
				if (aOut[k]['position'] == pos)
					continue;

				pos = aOut[k]['position'];
				del = pos + 1;
			}

			for (; j < k; j++) {
				aOut[j]['delimiter'] = del;

				var dif = 0;

				for (var l = j + 1; l < k; l++) {
					if (aOut[j]['position'] < aOut[l]['position'] && aOut[j]['start'] < aOut[l]['end'] && aOut[j]['end'] > aOut[l]['start']) {
						dif = aOut[l]['position'] - aOut[j]['position'];
						break;
					}
				}
				if (dif > 1)
					aOut[j]['width'] = dif;
				else
				if (dif == 0 && aOut[j]['position'] + 1 < aOut[j]['delimiter'])
					aOut[j]['width'] = aOut[j]['delimiter'] - aOut[j]['position'];
			}

			j--;
		}
	}

	return aOut;
};

_me.__events = function(aData){

	//Clean events
	this.__clean();

	//Use
	var elm = this.__eBody.querySelector('div.block'),
		div, h;

	if (elm){
		var str, css, type;
		for(var i in aData){
			str = aData[i].ACCOUNT + (aData[i].SUMMARY?' - ' +aData[i].SUMMARY:'');
			type = (aData[i].TYPE || '').toUpperCase();
			css = obj_freebusy.__EVNTYPE[type] || '';

			// if (type == 'UNKNOWN')
			// 	str += ' - ' + getLang('EVENT::UNKNOWN');

			div = mkElement('div', {className:'event ' + css});
			div.appendChild(mkElement('div', {text:str, title:str}));

			div.style.top = ((aData[i].startdate - this.__range[0]) * obj_freebusy.__DAYHEIGHT + this.__position(aData[i].start2)) + 'px';
			h = (aData[i].enddate - aData[i].startdate) * obj_freebusy.__DAYHEIGHT + this.__position(aData[i].end2 - aData[i].start2, false, true);

			div.style.height = h + 'px';

			if (h == obj_freebusy.__SLOTHEIGHT)
				addcss(div, 'small');

			div.style.left = (aData[i].position / aData[i].delimiter * 100) + '%';
			div.style.width = (aData[i].width / aData[i].delimiter * 100) + '%';

			elm.appendChild(div);
		}
	}

	//Set Today & init time marker
	var today = (new IcewarpDate()).format('julian');

	if (this.__range[0]<=today && this.__range[1]>=today){

		if (!this.__now_div){
			this.__now_div = mkElement('div',{className: 'today unselectable'});
			this.__eBody.appendChild(this.__now_div);
		}
		this.__showToday();

		if (!this.__now_int){
		 	this.__now_int = setInterval(function(){
		 		this.__showToday();
		 	}.bind(this), 12000);
		}
	}
	else{
		if (this.__now_int){
			clearInterval(this.__now_int);
			this.__now_int = null;
		}

		if (this.__now_div){
			if (this.__now_div.parentNode){
				this.__now_div.parentNode.removeChild(this.__now_div);
			}

			this.__now_div = null;
		}
	}
};

_me.__showToday = function(){
	if (this.__now_div && this.__now_div.parentNode){
		var iwt = new IcewarpDate(),
			jul = iwt.format('julian'),
			tim = iwt.format('julian_time');

		this.__now_div.style.top = this.__position((jul - this.__range[0])*1440 + tim, true) + 'px';
	}
};

/**
 * Collision state of planed event
 *
 * @returns bool
 */
_me._collision = function(){
	var v = this.__value, evn, bOut = false;

	for (var id in this.__aData){
		evn = this.__aData[id];

		if (evn.TYPE == "UNKNOWN" || (this.__opt.evnid && evn.EVNUID == this.__opt.evnid) || evn.enddate<v.start_d || (evn.enddate == v.start_d && evn.endtime<=v.start_t) || evn.startdate>v.end_d || (evn.startdate == v.end_d && evn.starttime>=v.end_t)){
			continue;
		}

		bOut = true;
		break;
	}

	if (this.__plan_div){
		if (bOut)
			addcss(this.__plan_div,'collision');
		else
			removecss(this.__plan_div,'collision');
	}

	this.__inCollision = bOut;

	//Events
	if (this._oncollision)
		this._oncollision(bOut);
	this.__exeEvent('oncollision', null, {arg:bOut, owner:this});

	return bOut;
};

/**
 *	Shift event
 *
 * @param {object} tmp event
 * @param {int} dOff days
 * @param {int} tOff minutes
 * @returns {object} event
 */
obj_freebusy.__timeShift = function(tmp,dOff,tOff){
	var out = {};
	var iwt = IcewarpDate.julian(tmp.enddate, tmp.endtime);
	iwt.add(dOff,'d');
	iwt.add(tOff,'m');

	out.enddate = iwt.format('julian');
	out.endtime = iwt.format('julian_time');

	iwt = IcewarpDate.julian(tmp.startdate,tmp.starttime);
	iwt.add(dOff,'d');
	iwt.add(tOff,'m');

	out.startdate = iwt.format('julian');
	out.starttime = iwt.format('julian_time');
	return out;
};

/**
 * Find free slot inside of working-hours
 *
 * @param {handler} aHandler
 */
_me._find = function(aHandler){

	var iwt = new IcewarpDate(),
		jul = iwt.format('julian'),
		v = this.__value,
		out = [];

	//Move planed event to NOW
	var tmp = {startdate: v.start_d, starttime: v.start_t, enddate: v.end_d, endtime: v.end_t};
	if (tmp.startdate<jul)
		tmp = obj_freebusy.__timeShift(tmp, jul - tmp.startdate);

	//set query range
	var range = clone(this.__range),
		start = Math.max(tmp.startdate-2, jul);

	if (range[0]<=start && range[1]>start){
		//move range to start
		range = [start, range[1]];

		out = this.__finder(this.__aData, tmp, range);

		//shift range by week
		range = [range[1]+1, range[1]+5];
	}
	else{
		range = [start, start + obj_freebusy.__PREFETCH];
	}

	if (out.length<100 && range[1]<Math.max(v.start_d, jul)+15){
		this.__find_request(out, tmp, range, aHandler);
	}
	else{
		executeCallbackFunction(aHandler, out);
	}
};

	_me.__find_request = function(out, tmp, range, aHandler){

		var aReq = Object.assign({},this.__opt,{
			from: range[0],
			to: range[1],
			users: this.__opt.users
		});

		this._freeBusy.get(aReq,'null','',[function(bOK, aData){
			if (bOK){
				this.__prepare(aData, range);

				out = out.concat(this.__finder(aData, tmp, range, out.length));

				if (out.length<100 && range[1]<Math.max(this.__value.start_d, (new IcewarpDate()).format('julian'))+15){
					range = [range[1]+1, range[1]+5];
					this.__find_request(out, tmp, range, aHandler);
					return;
				}

			}
			else{
				//error
				console.warn('freebusy', 'get data error');
				out = [];
			}

			// No free time available
			if (out.length === 0){
				addcss(this.plan._main, 'notfound');
				setTimeout(function(){
					try{
						removecss(this.plan._main, 'notfound');
					}
					catch(r){}
				}.bind(this), 3600);
			}

			executeCallbackFunction(aHandler, out);

		}.bind(this)]);
	};


	_me.__finder = function(aData, tmp, range, index){

		index = index || 0;
		var workstart = GWOthers.getItem('CALENDAR_SETTINGS','day_begins')*60,
			workend = GWOthers.getItem('CALENDAR_SETTINGS','day_ends')*60,
			bgn = GWOthers.getItem('CALENDAR_SETTINGS','workweek_begins')*1,
			end = GWOthers.getItem('CALENDAR_SETTINGS','workweek_ends')*1;

		if (bgn<1 || bgn>7) bgn = 1;
		if (end<1 || end>7) bgn = 5;

		//Mask now
		var iwt = (new IcewarpDate()),
			jul = iwt.format('julian');

		//shift tmp into current time
		if (range[0] == jul){
			var t = iwt.format('julian_time');
			tmp = obj_freebusy.__timeShift(tmp, range[0] - tmp.startdate, (Math.ceil(t/15)*15)-tmp.starttime);
		}
		//shift tmp into beginning of the range, starttime 0
		else{
			tmp = obj_freebusy.__timeShift(tmp, range[0] - tmp.startdate, -tmp.starttime);
		}

		//Get event list
		var events = [];
		for (var id in aData){
			if (aData[id].TYPE != "UNKNOWN" && aData[id].enddate>=range[0]){ // && (aData[id].enddate>tmp.startdate || (aData[id].enddate==tmp.startdate && aData[id].endtime>=tmp.starttime))
				events.push({startdate:aData[id].startdate, enddate:aData[id].enddate, starttime:aData[id].starttime, endtime:aData[id].endtime, type:'EVENTS'});
			}
		}

		//mask work-hours, work-days and weekends
		for(var i = range[0]-1;i<=range[1]; i++){

			if (i == jul){
				var tim = iwt.format('julian_time');
				if (tim>0)
				events.push({startdate:jul, enddate:jul, starttime:0, endtime:tim, type:'now'}); //, type:'now', ts: IcewarpDate.julian(i).format()
			}

			var d = IcewarpDate.julian(i).day();
			if (d>=bgn && d<=end)
			events.push({startdate:i, enddate:i+1, starttime:workend, endtime:workstart, type:'workmask'}); //, type:'workmask', ts: IcewarpDate.julian(i).format()
			else{
				var inc = d<bgn?(bgn - d):(d - 5 + bgn);
				events.push({startdate:i-1, enddate:i+inc, starttime:workend, endtime:workstart, type:'weekmask'}); //, type:'weekmask', ts: IcewarpDate.julian(i-1).format()
				i += inc-1;
			}
		}

		//Add false event to the range-end, it will result in all free slots to the end of range
		events.push({startdate:range[1], starttime:1440, final: true});

		events.sort(function (a, b) {
			// Primary sorting on start time
			var x = a.startdate - b.startdate;
			if (x == 0){
				x = a.starttime - b.starttime;
				// If still not sorted, sort by end time
				if (x == 0){
					x = b.enddate - a.enddate;
					if (x == 0){
						x = b.endtime - a.endtime;
					}
				}
			}
			return x;
		});

		//Find free slots between events
		for (var slot, slots = [], evn, i = 0; (evn = events[i]);){

			//free slot
			while(true){
				if (evn.startdate>tmp.enddate || (evn.startdate==tmp.enddate && evn.starttime>=tmp.endtime)){

					//save slot
					slot = Object.assign({}, tmp);

					//convert event->allday
					if (slot.starttime == 0 && slot.endtime == 1440){
						slot.starttime = -1;
						slot.endtime = -1;
						slot.enddate++;
					}

					slots.push(slot);

					if (slots.length + index>99)
						return slots;

					//shift +60min
					tmp = obj_freebusy.__timeShift(tmp, 0, 60);
				}
				else
					break;
			}

			if (slots.length + index>99 || evn.final)
				break;

			//shift tmp after evn
			if (evn.enddate>tmp.startdate || (evn.enddate == tmp.startdate && evn.endtime>tmp.starttime))
				tmp = obj_freebusy.__timeShift(tmp, evn.enddate - tmp.startdate, evn.endtime - tmp.starttime);

			if (tmp.startdate>range[1])
				break;

			i++;
		}

		//DEBUG
		if (gui._REQUEST_VARS.xml == '1'){
			console.warn('range', range);
			console.warn('events', events);
			console.warn('slots', slots);
		}

		return slots;
	};

_me.__destructor = function(){
	if (this.__now_int){
		clearInterval(this.__now_int);
		this.__now_int = null;
	}
};
