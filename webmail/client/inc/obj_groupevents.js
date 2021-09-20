_me = obj_groupevents.prototype;
function obj_groupevents(){};

/**
 */

_me.__constructor = function() {
	this.__options.notify = ['E','Q'];
	this.__weekOffset = ({monday:6, tuesday:5, wednesday:4,thursday:3,friday:2, saturday:1, sunday:0})[GWOthers.getItem('CALENDAR_SETTINGS','week_begins')];

	this._placeholder('CHAT::NOEVENTS');
};

_me._request = function(bUpdate){
	if (this.__aRequestData.folder){

		this.__loading = 1;

		var d = new IcewarpDate().subtract(1, 'day');

		var aFilter = {sort:'EVNSTARTDATE asc, EVNSTARTTIME asc, EVNTITLE asc', limit:this.__options.preload, search:'gchat:events and after:' + d.format('YYYY/MM/DD')};

		if (this.__aRequestData.offset)
			aFilter.offset = this.__aRequestData.offset;

		if (this.__aRequestData.filter && this.__aRequestData.filter.search)
			aFilter.search += ' and (' + this.__aRequestData.filter.search + ')';

		var aItemsInfo = {aid:this.__aRequestData.folder.aid, fid:this.__aRequestData.folder.fid, values:['EVN_ID','EVNRCR_ID','EVNTITLE','EVN_MODIFIED','EVNCLASS','EVNSTARTDATE','EVNSTARTTIME','EVNENDDATE','EVNENDTIME','OSD','EVNLOCATION'], filter:aFilter};

		//Blank request to check count
		if (bUpdate){
			if (!this._refresh()){
				var me = this;
				WMItems.list(aItemsInfo,'','','',[function(aData){
					var aData = aData[me.__aRequestData.folder.aid];

					if ((aData = aData[me.__aRequestData.folder.fid])){
						if (me.__loading == 1)
							me.__loading = 0;

						me.__check_count(parseInt(aData['/']));
					}

				}]);
			}
			else
			if (this.__loading == 1)
				this.__loading = 0;
		}
		//Request
		else
			WMItems.list(aItemsInfo,'','','',[this, '_response']);
	}
};

_me._response = function(aData, bUpdate, bSkipTime){

	if ((aData = aData[this.__aRequestData.folder.aid]) && (aData = aData[this.__aRequestData.folder.fid])){

		if (!this.__check_count(parseInt(aData['/'])))
			return;

		this.__aRequestData.offset = !+aData['/']?0:aData['$'];

		delete aData['/'];	//count
		delete aData['#'];
		delete aData['$'];	//offset
		delete aData['@'];	//attributes

		var c = 0, row, d;

		for (var iid in aData){
			c++;

			if (this.__aData[iid]) continue;

			aData[iid].EVNSTARTDATE = parseInt(aData[iid].EVNSTARTDATE);
			aData[iid].iid = iid;

			this.__aData[iid] = {data:aData[iid]};

			//separator
			d = IcewarpDate.julian(aData[iid].EVNSTARTDATE);

			var sep = '',
				bToday = d.isToday();

			if (d.isTomorrow()) sep = getLang('CALENDAR::TOMORROW');
			else
			if (d.isToday()) sep = getLang('CALENDAR::TODAY');
			else
			if (d.isYesterday()) sep = getLang('CALENDAR::YESTERDAY');
			else
			if (d.isThisWeek(this.__weekOffset)) sep = getLang('CALENDAR::THIS_WEEK');
			else
			if (d.isNextWeek(this.__weekOffset)) sep = getLang('CALENDAR::NEXT_WEEK');
			else
			if (d.isThisMonth()) sep = getLang('CALENDAR::THIS_MONTH');
			else
				sep = d.format('MMMM YYYY');

			if (this.__sep1.sep != sep){
				if (!bToday)
					this._separator('<span>'+ sep +'</span>');

				this.__sep1 = {sep:sep, today:bToday};
			}

			row = false;
			switch(aData[iid].EVNCLASS){
				case 'E':
					row = this._row('', '', iid);
					this.__aData[iid].anchor = row.anchor;
					this.__aData[iid].obj = this._create('item', 'obj_groupevents_item', row.anchor,'', this.__aData[iid].data);
					break;
			}
		}

		if (!bSkipTime){
			if (c == this.__options.preload)
				this.__loading = 0;
			else
				this.__loading = 2;
		}
	}
	//clear on error
	else
	if (!aData){
		this._clear(true);
		return;
	}

	if (!bUpdate || this.__aRequestData.fetchnew)
		this._fetch();
};

	_me._onnotify = function(aData){

		var iid;

		if (aData['ITEM-TYPE'] == "Q"){
			if (aData.ACTION == 'delete' && aData.LINKID)
				iid = WMItems.__clientID(aData.LINKID);
			else
				return;
		}
		else
			iid = WMItems.__clientID(aData.ITEM);

		switch(aData.ACTION){
			case 'add':
				if (!this.__aData[iid])
					this.__check_count();

				break;

			case 'update':
				if (this.__aData[iid] && this.__aData[iid].obj && this.__aData[iid].obj.__update)
					this.__aData[iid].obj.__update(true);

				break;

			case 'delete':
				if (this.__aData[iid])
					this._remove(this.__aData[iid].anchor, iid);
		}
	};


	_me._oncontext = function(e, elm){
		var id, aData;
		if ((elm = Is.Child(elm,'SECTION', this._main)) && (id = elm.getAttribute('rel')) && this.__aData[id] && (aData = this.__aData[id].data)){

			var me = this;

			addcss(elm,'active');

			this.cmenu = gui._create("cmenu","obj_context",'','');
			this.cmenu._fill([
				{title:'FORM_BUTTONS::REMOVE', css:'color2', arg:[function(){
					me._removeItem(aData, elm);
				}], disabled: !(aData.EVNOWNEREMAIL == sPrimaryAccount || WMFolders.getAccess({aid:me.__aRequestData.folder.aid, fid:me.__aRequestData.folder.fid},'remove'))}
			]);

			this.cmenu._place(e.clientX,e.clientY);
			this.cmenu._onclose = function(){
				removecss(elm,'active');
			};

			return false;
		}

	};
