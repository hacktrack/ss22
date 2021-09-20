_me = obj_groupmembers.prototype;
function obj_groupmembers(){};

/**
 */
_me.__constructor = function(){
	this.__options.notify = ['-']; //notifications wo item-type
	this.__skin = GWOthers.getItem('LAYOUT_SETTINGS', 'skin') || 'default';
};

_me._request = function(bUpdate){
	if (this.__aRequestData.folder){

		this.__loading = 1;


		var aFilter = {sort:'FRTISGUEST desc, FRTNAME asc, FRTEMAIL asc', limit:this.__options.preload};

		if (this.__aRequestData.offset)
			aFilter.offset = this.__aRequestData.offset;

		if (this.__aRequestData.filter && this.__aRequestData.filter.search)
			aFilter.search = this.__aRequestData.filter.search;

		var aItemsInfo = {aid:this.__aRequestData.folder.aid, fid: '__@@GROUP@@__/' + this.__aRequestData.folder.fid, values:[], filter:aFilter};

		//Blank request to check count
		if (bUpdate){
			if (!this._refresh()){
				var me = this;
				WMItems.list(aItemsInfo,'','','',[function(aData){
					var aData = aData[me.__aRequestData.folder.aid];

					if ((aData = aData['__@@GROUP@@__/' + me.__aRequestData.folder.fid])){
						if (me.__loading == 1)
							me.__loading = 0;

						me.__check_count(parseInt(aData['/']));
					}

				}]);
			}
			else
			if (me.__loading == 1)
				me.__loading = 0;
		}
		//Request
		else
			WMItems.list(aItemsInfo,'','','',[this, '_response']);
	}
};

_me._response = function(aData, bUpdate){

	if ((aData = aData[this.__aRequestData.folder.aid]) && (aData = aData['__@@GROUP@@__/' + this.__aRequestData.folder.fid])){

		if (!this.__check_count(parseInt(aData['/'])))
			return;

		delete aData['/'];	//count
		delete aData['#'];
		delete aData['$'];
		delete aData['@'];

		var c = 0, row;

		for (var iid in aData){
			c++;

			if (this.__aData[iid]) continue;

			aData[iid].iid = iid;
			this.__aData[iid] = {data:aData[iid]};

			//separator
			var sep = '';
			if (aData[iid].FRTISGUEST>'0')
				sep = getLang('CHAT::GUESTS');
			else
			if (aData[iid].FRTISADMIN>'0')
				sep = getLang('CHAT::ADMINS');
			else
				sep = getLang('CHAT::MEMBERS');
			if (this.__sep1.sep != sep){
				this._separator('<span>'+ sep +'</span>');
				this.__sep1 = {sep: sep};
			}

			row = this._row(this.__item(this.__aData[iid].data), '', iid);
			this.__aData[iid].anchor = row.anchor;
		}

		if (c == this.__options.preload)
			this.__loading = 0;
		else
			this.__loading = 2;

		this.__aRequestData.offset += c;
	}
	//clear on error
	else
	if (!aData){
		this._clear(true);
		return;
	}

	if (!bUpdate || this.__aRequestData.fetchnew)
		this._fetch();

	//Listen to IM roster
	if (sPrimaryAccountIM){
		addcss(this._main, 'im');

		if (gui.socket.xmpp._user_status() != 'offline')
			addcss(this._main, 'im_active');

		this._listen('xmpp', true);
	}
};

/*
<FRTEMAIL>ADMIN@MERAKDEMO.COM</FRTEMAIL>
<FRTNAME>ADMIN</FRTNAME>
<FRTRIGHT>RIWTLKXA</FRTRIGHT>
<FRTISGUEST>0</FRTISGUEST>
<FRTOWNERID>438C53A8DE0D</FRTOWNERID>
*/

_me.__item = function(aData){
	var out = clone(aData, true);
		out.avatar = getAvatarURL(aData.FRTEMAIL);
		out.name = out.FRTNAME || out.FRTEMAIL;
		out.fullname = MailAddress.createEmail(out.FRTNAME, out.FRTEMAIL, true).entityify();
		out.guest = out.FRTISGUEST > '0';
		out.admin = out.FRTISADMIN > '0';
		out.hasim = out.FRTEMAIL != sPrimaryAccount && dataSet.get('xmpp', ['roster', out.FRTEMAIL]);
		out.confirmed = out.FRTISGUEST!='2';
		out.guest_user = sPrimaryAccountGUEST;

	if (!out.guest && sPrimaryAccountIM && gui.socket && gui.socket.xmpp && gui.socket.xmpp._user_status() != 'offline')
		out.im = gui.socket.xmpp._user_status(out.FRTEMAIL);

	return template.tmp('obj_groupmembers_item', {item:out, has_kick_right: WMFolders.getRights(this.__aRequestData.folder).kick && (aData.FRTEMAIL !== sPrimaryAccount)});
};

_me.__item_status = function(id){
	if (this.__aData[id] && Is.Defined(this.__aData[id].anchor)){
		var elm = this._getAnchor(this.__aData[id].anchor);
		if (elm && (elm = elm.getElementsByTagName('DIV')[1]))
			elm.className = 'avatar unselectable ' + gui.socket.xmpp._user_status(WMItems.__serverID(id));
	}
};

// Update IM status
_me.__update = function(sDName, aDPath){
	if (sDName != 'xmpp' || !aDPath)
		return;

	switch(aDPath[0]){
		case 'roster':
			//direct user
			if (aDPath[1]){
				if ((!aDPath[2] || aDPath[2] == 'show')){
					this.__item_status(WMItems.__clientID(aDPath[1]));
				}
			}
			//whole roster
			else{
				for (var id in this.__aData){
					this.__item_status(id);
				}
			}

			break;

		//you
		case 'status':
			if (gui.socket.xmpp._user_status() == 'offline')
				removecss(this._main, 'im_active');
			else
				addcss(this._main, 'im_active');

			this.__item_status(WMItems.__clientID(sPrimaryAccount));
	}
};

	_me._onnotify = function(aData){

		var iid = WMItems.__clientID(aData.ITEM);

		if (aData.TYPE == 'acl')
			switch(aData.ACTION){
			case 'update':
				if (this.__aData[iid])
					this.__check_count();
					//this._request(true);
				break;

			case 'add':
			 	if (!this.__aData[iid])
			 		this.__check_count();
			 		//this._request(true);
				break;

			// case 'delete':
			// 	if (this.__aData[iid])
			// 		this._remove(this.__aData[iid].anchor, iid);
			// 	break;
			}
	};
