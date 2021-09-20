_me = obj_list_conference.prototype;
function obj_list_conference(){};

/**
 */
_me.__constructor = function() {
	this.__options.search = '';
	this.__options.sort = ['EVNSTARTDATE', 'EVNSTARTTIME'];
	this.__options.order = 'asc';
	this.__options.notify = ['E', 'O', 'J'];
};

	_me._placeholder = function(v){
		var elm = this._getAnchor('placeholder');
		if (v && elm) elm.innerHTML = (Array.isArray(v) ? v : [v]).join('<br />');
	};

	_me.__notify = function(aData){
		if (this._destructed)
			return false;

		if (aData.owner && aData.owner == this._pathName)
			return;

		if (this.__aRequestData.folder){

			aData['ITEM-TYPE'] = aData['ITEM-TYPE'] || '-';

			if ((aData.FOLDER == Mapping.getDefaultFolderForGWType('E') || aData.FOLDER == Mapping.getDefaultFolderForGWType('J') || aData.FOLDER == this.__aRequestData.folder.fid) && ~inArray(this.__options.notify, aData['ITEM-TYPE'])){

				if (this._onnotify)
					this._onnotify(aData);

				this.__exeEvent('onnotify', null, {"data":aData, "owner":this});
			}
		}
	};

	_me._onnotify = function(aData){

		var iid = WMItems.__clientID(aData.ITEM);

		switch(aData.ACTION){
			case 'add':
				if (!this.__aData[iid])
					this.__check_count();
				break;

			case 'delete':
				if (this.__aData[iid]){
					this._remove(this.__aData[iid].obj);
				}
				else
				if (Object.keys(this.__aData).some(function(id){ return id.indexOf(iid+'|') === 0 })){
					this.__check_count();
				}

				break;

			case 'update':
			case 'edit':
				var found;
				for(var i in this.__aData) {
					if (i.indexOf(iid) === 0) {
						found = true;
						var obj = ((this.__aData[i] || {}).obj || {});
						(obj.__update || function() {}).call(obj, true);
					}
				}
				if (!found) {
					this.__check_count(-1);
				}
		}
	};


_me._request = function(bUpdate){
	if (this.__aRequestData.folder){

		this.__loading = 1;

		var aFilter = {
			sort: this.__options.sort.map(function(sort) {
				return sort + ' ' + this.__options.order;
			}, this).join(', '),
			limit:this.__options.preload,
			search:this.__options.search,
			meeting: 1
		};

		if (this.__aRequestData.offset)
			aFilter.offset = this.__aRequestData.offset;
		else
			this.__sep = null;

		if (this.__aRequestData.filter && this.__aRequestData.filter.search)
			aFilter.search += ' and (' + this.__aRequestData.filter.search + ')';

		var aItemsInfo = {
			aid: this.__aRequestData.folder.aid,
			fid: this.__aRequestData.folder.fid,
			values: [
				'EVN_ID', 'EVNTITLE', 'EVNSTARTDATE', 'EVNSTARTTIME', 'EVNENDDATE', 'EVNENDTIME', 'OSD', 'EVNCLASS', 'EVNMEETINGID', 'EVNORGANIZER', 'EVNRCR_ID'
				//'EVNOWNERNAME', 'EVNOWNEREMAIL' // cause blank response
			],
			filter: aFilter
		};

		//Blank request to check count
		if (bUpdate){
			if (!this._refresh()){
				var me = this;
				WMItems.list(aItemsInfo,'','','',[function(aData){
					var aData = aData[me.__aRequestData.folder.aid];

					if ((aData = aData[me.__aRequestData.folder.fid])){
						me.__check_count(parseInt(aData['/']), true);
					}

				}]);
			}
		}
		//Request
		else
			WMItems.list(aItemsInfo,'','','',[this, '_response']);
	}
};

_me._response = function(aData, bUpdate, bSkipTime){
	if (this.__bSearch) {
		this.__bSearch = false;
	}

	if ((aData = aData[this.__aRequestData.folder.aid]) && (aData = aData[this.__aRequestData.folder.fid])){
		if (!parseInt(aData['/'])) {
			this._placeholder(this.__options.order === 'asc' ?
				[ '<b> ' + getLang('CONFERENCE::UPCOMING_NO_ITEMS') + '</b>', getLang('CONFERENCE::UPCOMING_NO_ITEMS_HELPER') ] :
				[ '<b> ' + getLang('CONFERENCE::HISTORY_NO_ITEMS') + '</b>' ]);
		}

		if (!this.__check_count(parseInt(aData['/']))) {
			return;
		}

		this.__aRequestData.count = aData['/'];

		delete aData['/'];	//count
		delete aData['#'];
		delete aData['$'];
		delete aData['@'];

		var c = 0, row,
			now = new IcewarpDate();
			now = {
				date: now.format(IcewarpDate.JULIAN),
				time: now.format(IcewarpDate.JULIAN_TIME)
			};

		for (var iid in aData){
			c++;

			if (this.__aData[iid]) continue;

			row = false;
			switch(aData[iid].EVNCLASS){
				case 'J':
				case 'O':
				case 'E':

					//cut of incoming
					if (this.__options.order == 'asc' && aData[iid].EVNENDDATE == now.date && aData[iid].EVNENDTIME<now.time)
						continue;

					//Separator
					if (this.__sep != aData[iid].EVNSTARTDATE){
						this.__sep = aData[iid].EVNSTARTDATE;
						this._separator('<span>'+ this.__separatorValue(this.__sep) +'</span>');
					}

					//Row
					row = this._row('', '', iid);
					aData[iid].iid = iid;
					this.__aData[iid] = {data:aData[iid]};
					this.__aData[iid].anchor = row.anchor;
					this.__aData[iid].obj = this._create('item', 'obj_list_conference_item', row.anchor,'', aData[iid]);
					break;
			}

		}

		if (Is.Empty(this.__aData))
			addcss(this._main,'noitems');

		if (!bSkipTime){
			if (c == this.__options.preload)
				this.__loading = 0;
			else
				this.__loading = 2;

			this.__aRequestData.offset += c;
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

_me.__separatorValue = function(iJul){
	return CalendarFormatting.normalWithWeekDay(IcewarpDate.julian(iJul));
};

_me._remove = function(obj, iTime){
	if (this.__aData[obj.__aData.iid]){

		setTimeout(function(){
			//this.__aRequestData.count--;
			this.__aRequestData.count = -1;
			this._serverSort();
		}.bind(this), iTime || 0);
	}
};
