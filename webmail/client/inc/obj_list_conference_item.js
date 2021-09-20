_me = obj_list_conference_item.prototype;
function obj_list_conference_item(){};

_me.__constructor = function(aData) {

	this.__aData = aData;
	this.__aData.start = IcewarpDate.julian(aData.EVNSTARTDATE, Math.max(aData.EVNSTARTTIME, 0));
	this.__aData.end = IcewarpDate.julian(aData.EVNENDDATE, Math.max(aData.EVNENDTIME, 0));

	var out = clone(aData, true),
		org = (out.EVNORGANIZER?MailAddress.splitEmailsAndNames(out.EVNORGANIZER):[{name:out.EVNOWNERNAME, email:out.EVNOWNEREMAIL}])[0];

	//ouput
	out.date = this.__info();
	out.avatar = '<span style="background-image: url(\''+getAvatarURL(org.email || 'blank') +'\')"></span>';
	out.modified_name = org.name || org.email;
	out.EVNTITLE = 	out.EVNTITLE || getLang('EVENT_VIEW::NOTITLE');

	this._draw('obj_list_conference_item', 'main', {item:out});

	this._add_destructor('__destructTimers');

	//// CLICKs ////
	this._main.ondblclick = function(){
		if(this.__aData.EVNCLASS === 'J') {
			this._getAnchor('btn_copy').onclick();
		} else {
			Item.openwindow([sPrimaryAccount, this.__aData.EVNFOLDER, WMItems.__clientID(this.__aData.EVN_ID)], null, this.__aData, void 0, [function(bOk, aData) {
				if (bOk && gui.socket){
					var f = dataSet.get('folders', [sPrimaryAccount, Mapping.getDefaultFolderForGWType('E')]);
					f && gui.socket.api._notify({
						ACTION: 'edit',
						TYPE: 'item',
						ITEM: aData.id,
						FOLDER: f.RELATIVE_PATH,
						'FOLDER-TYPE': f.TYPE,
						EMAIL: sPrimaryAccount,
						'ITEM-TYPE': 'E'
					});
				}
			}]);
		}
	}.bind(this);

	if(this.__aData.EVNCLASS !== 'J') {
		this._main.oncontextmenu = function(e) {
			gui._create("cmenu", "obj_context", '', '', this);
			var aMenu = [
				{
					title: 'POPUP_ITEMS::EDIT',
					arg: [function() {
						this._main.ondblclick();
					}.bind(this)]
				},
				{
					title: 'POPUP_ITEMS::DELETE',
					arg: [Item.remove, [[sPrimaryAccount, this.__aData.EVNFOLDER, [WMItems.__clientID(this.__aData.EVN_ID)]], false, null, '', '',
						[function(bOK){
							if (bOK)
								this._parent._fire(WMItems.__clientID(this.__aData.EVN_ID), 'delete');
						}.bind(this)]
					]]
				},
			];

			gui.cmenu._fill(aMenu);
			gui.cmenu._place(e.clientX, e.clientY);
			e.preventDefault();
			e.stopPropagation();
			e.stopImmediatePropagation();
		}.bind(this);

		// Badge
		this.__badge();
	}

	this._getAnchor('btn_copy').onclick = function(){
		var id = aData.iid;
		var date;
		if (Is.Defined(aData.EVNRCR_ID) && Is.Defined(aData.EVNSTARTDATE)) {
			date = aData.EVNSTARTDATE;
			id = id.split('|')[0];
		}
		WMItems.list({
			aid: aData.aid,
			fid: aData.fid,
			iid: id,
			date: date
		},null,null,null,[function(aResponse) {
			storage.library('wm_conference');
			wm_conference.get(aData.EVNMEETINGID, aResponse[aData.aid][aData.fid][WMItems.__clientID(aData.EVN_ID)]).join();
		}]);
	}.bind(this);
};

_me.__badge = function(){

	var t = new IcewarpDate();

	//starts in...
	if ((this.__aData.start.isToday() && this.__aData.start.isAfter(t)) || this.__aData.start.isTomorrow()){
		//in 60min
		if (t.unix()+3600 >= this.__aData.start.unix()){

			var elm = this._getAnchor('badge');

			var fce = function(){
				var t = new IcewarpDate();

				var sec = Math.max(this.__aData.start.unix() - t.unix(), 0);
				if (sec){
					elm.textContent = getLang('CONFERENCE::MIN_TO_GO',[Math.ceil(sec/60)]);
					addcss(elm, 'show');
				}
				else{
					clearInterval(this.__badgeInterval);
					removecss(elm, 'show');

					//to in progress state
					this.__badge();
				}

			}.bind(this);

			//set interval
			this.__badgeInterval && clearInterval(this.__badgeInterval);
			this.__badgeInterval = setInterval(fce,	10000);
			fce();
		}
		//more then 60min
		else{
			//set timer to start count
			this.__badgeTimer && clearTimeout(this.__badgeTimer);
			this.__badgeTimer = setTimeout(function(){
				this.__badge();
			}.bind(this),
			(this.__aData.start.unix() - t.unix() + 5) * 1000);
		}
	}
	else
	//running
	if (this.__aData.end.isSameOrAfter(t) && this.__aData.start.isSameOrBefore(t)){
		var t = new IcewarpDate(),
			elm = this._getAnchor('badge');
			elm.textContent = getLang('TASK::IN_PROGRESS');
			addcss(elm, 'show');
			addcss(elm, 'in_progress');

		this.__badgeTimer && clearTimeout(this.__badgeTimer);
		this.__badgeTimer = setTimeout(function(){
			this.__badge();
		}.bind(this), (this.__aData.end.unix() - t.unix() + 5) * 1000);
	}
	else{
		removecss(this._getAnchor('badge'), 'show');

		//For Upcoming only
		if (this._parent.__options.order == 'asc' && this.__aData.end.isBefore(t)){
			this._parent._remove(this, 2000);
		}
	}
};

_me.__info = function(){

	var aOrg = MailAddress.splitEmailsAndNames(this.__aData.EVNORGANIZER || ''),
		sName = (aOrg[0]?(aOrg[0].name || aOrg[0].email):'') || dataSet.get('main',['fullname']) || sPrimaryAccount,
		sDate = '';

	if (this.__aData.EVNSTARTTIME<0){
		if (this.__aData.EVNSTARTDATE<this.__aData.EVNENDDATE-1){
			sDate = this.__aData.start.format('L') + ' - ' + this.__aData.end.format('L');
		}
		else{
			sDate = CalendarFormatting.normalWithWeekDay(this.__aData.start);
		}
	}
	else{
		sDate = CalendarFormatting.normalWithWeekDayAndTime(this.__aData.start);
		if (this.__aData.EVNSTARTDATE<this.__aData.EVNENDDATE){
			sDate += ' - ' + CalendarFormatting.normalWithWeekDayAndTime(this.__aData.end);
		}
		else{
			sDate += ' - ' + this.__aData.end.format('LT');
		}
	}

	return getLang('CONFERENCE::CONFERENCE_INFO',[sDate, sName]);
};

_me.__destructTimers = function(){
	this.__badgeInterval && clearInterval(this.__badgeInterval);
	this.__badgeTimer && clearTimeout(this.__badgeTimer);
};

_me.__update = function(){
	var date, id = this.__aData.iid;
	if (~id.indexOf('|')) {
		id = this.__aData.iid.split('|');
		date = id[1];
		id = id[0];
	}
	var aItemsInfo = {aid:this.__aData.aid, fid:this.__aData.fid, iid:id, date: date, values:['EVN_ID','EVNTITLE', 'EVNCLASS', 'EVNTICKET', 'EVN_MODIFIED','EVNTHUMBNAILID','EVNTHUMBNAILTIME','EVNPROCESSINGQUEUED','EVNCOMPLETE','EVNLOCKOWN_EMAIL','EVNLOCKOWN_ID','EVNFLAGS','EVNSTARTDATE', 'EVNSTARTTIME', 'EVNENDDATE', 'EVNENDTIME', 'OSD']};

	WMItems.list(aItemsInfo,'','','',[function(aData){
		if (aData && (aData = aData[this.__aData.aid]) && (aData = aData[this.__aData.fid]) && (aData = aData[id])){
			for (var k in aData)
				this.__aData[k] = aData[k];

			this.__constructor(this.__aData);
		}

	}.bind(this)]);

};
