_me = obj_groupmentions.prototype;
function obj_groupmentions(){};

_me.__constructor = function() {
	this.__options.notify = ['Q','R','Y','I','F','E','Z','-'];
	this.__options.preload = 15;

	this.__aDataLink = {};
};

_me._request = function(bUpdate){

	if (this.__aRequestData.folder){

		if(!this.loader) {
			this._main.insertBefore(this._create('loader', 'obj_loader', '')._main, this._main.firstChild);
			this._main.querySelector('.placeholder').style.setProperty('display', 'none');
		}

		this.__loading = 1;


		var aFilter = {limit:this.__options.preload};

		if (this.__options.type == 'mentions'){
			aFilter.sort = 'EVN_ID desc';
			aFilter.search = 'gchat:mentions';
		}
		else{
			aFilter.sort = 'PIN_ID desc';
			aFilter.search = 'gchat:' + this.__options.type;
		}

		if (this.__aRequestData.offset)
			aFilter.offset = this.__aRequestData.offset;

		if (this.__aRequestData.filter){
			if (this.__aRequestData.filter.sys_search)
				aFilter.search += ' and (' + this.__aRequestData.filter.sys_search + ')';

			if (this.__aRequestData.filter.search)
				aFilter.search += ' and (' + this.__aRequestData.filter.search + ')';
		}

		var aItemsInfo = {aid:this.__aRequestData.folder.aid, fid:this.__aRequestData.folder.fid, values:['EVN_ID','EVN_CREATED','EVN_MODIFIED','EVNSHARETYPE','EVNLINKEXTRAS','EVNURL','EVNTHUMBNAILID','EVNTHUMBNAILTIME','EVNPROCESSINGQUEUED'], filter:aFilter}; //,'EVNSTARTDATE','EVNSTARTTIME','EVNENDDATE','EVNENDTIME' 'EVNMODIFIEDOWNERNAME','EVNMODIFIEDOWNEREMAIL', 'EVN_ID','EVNTITLE','EVN_MODIFIED','EVNCLASS','EVNSTARTDATE','EVNSTARTTIME','EVNENDDATE','EVNENDTIME','EVNLOCATION'

		//Blank request to check count
		if (bUpdate){
			if (!this._refresh()){
				WMItems.list(aItemsInfo,'','','',[function(aData){
					var aData = aData[this.__aRequestData.folder.aid];
					if ((aData = aData[this.__aRequestData.folder.fid]))
						this.__check_count(parseInt(aData['/']));

				}.bind(this)]);
			}
		}
		//Request
		else
			WMItems.list(aItemsInfo,'','','',[this, '_response']);
	}
};

_me._response = function(aData, bUpdate, bSkipTime){

	if (this._destructed) return;

	if ((aData = aData[this.__aRequestData.folder.aid]) && (aData = aData[this.__aRequestData.folder.fid])){

		if (this.loader) {
			this.loader._main && this.loader._main.style.setProperty('display', 'none');
			this._main.querySelector('.placeholder').style.setProperty('display', '');
		}

		if (!this.__check_count(parseInt(aData['/'])))
			return;

		this.__aRequestData.offset = aData['/']=='0'?'':parseInt(aData['$']);

		delete aData['/'];	//count
		delete aData['#'];
		delete aData['$'];	//offset
		delete aData['@'];	//attributes

		var c = 0, row, d = new IcewarpDate();

		for (var iid in aData){
			c++;

			if (this.__aData[iid]) continue;

			aData[iid].EVN_CREATED = parseInt(aData[iid].EVN_CREATED);
			aData[iid].iid = iid;

			this.__aData[iid] = {data:aData[iid]};

			//separator
			d = IcewarpDate.unix(aData[iid].EVN_CREATED);
			var sep = CalendarFormatting.normal(d),
				bToday = d.isToday();

			if (this.__sep1.sep != sep){
				if (!bToday)
					this._separator('<span>'+ sep +'</span>', bToday?'today':'');

				this.__sep1 = {sep:sep, today:bToday};
			}

			row = false;
			switch(aData[iid].EVNCLASS){
			case 'I':
			case 'Q':
			case 'R':
			case 'Y':
			case 'Z':
				row = this._row('', '', iid);
				this.__aData[iid].anchor = row.anchor;
				this.__aData[iid].obj = this._create('item', 'obj_groupmentions_item', row.anchor,'', this.__aData[iid].data);
				break;
			}

			//Link Item
			if (aData[iid].EVNLINKID){
			 	var cid = WMItems.__clientID(aData[iid].EVNLINKID);
			 	if (cid!= iid)
				 	if (this.__aDataLink[cid]){
				 		if (inArray(this.__aDataLink[cid], iid)<0)
					 		this.__aDataLink[cid].push(iid);
				 	}
				 	else
				 	 	this.__aDataLink[cid] = [iid];
			}
		}

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

_me._onnotify = function(aData){

	var cid = WMItems.__clientID(aData.ITEM),
		arr = [cid];

		//traverse linked item
	if (Is.Array(this.__aDataLink[cid]))
		arr = arr.concat(this.__aDataLink[cid]);

	for (var iid, i = 0; i<arr.length; i++){
		iid = arr[i];

		if (aData['ITEM-TYPE'] == '-') {
			if (aData.TYPE === 'gw-queue' || aData.TYPE === 'gw-queue-failure') {
				if (aData.ACTION === 'add')
					aData.ACTION = 'update';
			}
			else
				return;
		}

		switch(aData.ACTION){
			//Mention mode
		case 'add':
			if (this.__options.type == 'mentions' && aData.MENTIONS && !this.__aData[iid])
				this.__check_count();
			break;

		case 'add_mention':
			 	if (this.__options.type == 'mentions'){
				 	if (this.__aData[iid] && this.__aData[iid].obj && this.__aData[iid].obj.__update)
				 		this.__aData[iid].obj.__update(true);
				 	else
					this.__check_count();
			}
			break;

			//All modes
		case 'delete':
			if (this.__aData[iid])
				this._remove(this.__aData[iid].anchor, iid);
			break;

		case 'update':
			 	if (this.__aData[iid] && this.__aData[iid].obj && this.__aData[iid].obj.__update)
			 		this.__aData[iid].obj.__update(true);

			//Pin mode
		case "add_pin":
			if (!this.__aData[iid]) //this.__options.type == 'my_pins' &&
				this.__check_count();
			break;

		case "add_global_pin":
			if (this.__options.type == 'global_pins' && !this.__aData[iid])
				this.__check_count();
			break;

		case "delete_pin":
			if (this.__options.type == 'my_pins' && this.__aData[iid])
				this._remove(this.__aData[iid].anchor, iid);
			break;

		case "delete_global_pin":
			if (this.__options.type == 'global_pins' && this.__aData[iid])
				this._remove(this.__aData[iid].anchor, iid);
			break;
		}
	}
};


_me._oncontext = function(e, elm){
	var id;
	if ((elm = Is.Child(elm,'SECTION', this._main)) && (id = elm.getAttribute('rel')) && this.__aData[id] && (aData = this.__aData[id].data)){

		// var me = this;

		// addcss(elm,'active');

		// this.cmenu = gui._create("cmenu","obj_context",'','');
		// this.cmenu._fill([
		// 	{title:'FORM_BUTTONS::REMOVE', css:'color2', arg:[function(){
		// 		me._removeItem(aData, elm);
		// 	}], disabled: !(aData.EVNOWNEREMAIL == sPrimaryAccount || WMFolders.getAccess({aid:me.__aRequestData.folder.aid, fid:me.__aRequestData.folder.fid},'remove'))}
		// ]);

		// this.cmenu._place(e.clientX,e.clientY);
		// this.cmenu._onclose = function(){
		// 	removecss(elm,'active');
		// };

		return false;
	}
};

_me._onremove = function(iAnchor, sData_id, bFire){
	//remove from aDataLink
	if (this.__aDataLink && this.__aDataLink[sData_id])
		delete this.__aDataLink[sData_id];

	//remove from aData
	if (this.__aData && this.__aData[sData_id])
		delete this.__aData[sData_id];
};