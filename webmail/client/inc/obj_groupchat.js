_me = obj_groupchat.prototype;
function obj_groupchat(){};

obj_groupchat._OFFLINE = 0;
obj_groupchat._ONLINE = 3;
obj_groupchat._TYPING = 1;
obj_groupchat._COMMENTING = 2;
obj_groupchat._BACKGROUND = 4;

/**
 * ext obj_list_load_reverse
 * bottom preloading list
 */
_me.__constructor = function(){

	this.__options = {
		preload: 30,
		autoscroll:true,
		comments:true,
		notify: [
			'I','W','R','S','Q','Z',
			'Y','M',
			'E','B','D','-']
	};

	this.__aRequestArray = ['EVNNOTE','EVN_CREATED', 'EVN_MODIFIED', 'EVNSHARETYPE','EVNLINKEXTRAS','EVNURL','EVNTHUMBNAILID','EVNTHUMBNAILTIME','EVNPROCESSINGQUEUED', 'EVN_ID', 'EVNTHUMBNAILTICKET', 'EVNSIZEINFO', 'EVNMEETINGID']; //

	this.__aDataLink = {};

	this._getAnchor('loading').innerHTML = getLang('CHAT::LOADING');
	this._getAnchor('refresh').onclick = function(){
		if (this.__aRequestData.oldest || (this.__aRequestData.filter && this.__aRequestData.filter.until)){
			var aFilter = this.__aRequestData.filter?clone(this.__aRequestData.filter, true):{};
			delete aFilter.until;
			delete this.__aRequestData.filter;

			this._serverSort(this.__aRequestData.folder, true, aFilter);
		}
		else
			this._scroll(0);

	}.bind(this);
};

_me._search = function(s){
	if (Is.Defined(s)){
		var aFilter = this.__aRequestData.filter?clone(this.__aRequestData.filter, true):{};
		aFilter.search = s;

		this._serverSort(this.__aRequestData.folder, true, aFilter);
	}
	else
	if (this.__aRequestData.filter)
		return this.__aRequestData.filter.search;
	else
		return '';
};


/*
	bUpdate		- not used
*/
_me._serverSort = function(aFolder, bUpdate, aFilter){

	//Manual Get New
	if (((!aFolder && this.__aRequestData.folder) || compareObj(this.__aRequestData.folder, aFolder, true)) && (!Is.Object(aFilter) || (Is.Object(this.__aRequestData.filter) && !this.__aRequestData.filter.until && compareObj(this.__aRequestData.filter, aFilter, true)))) {
		if (this.__aRequestData.fetchnew)
			return;

		this.__aRequestData.fetchnew = true;
	}
	else{

		//Do not cls when pinned item (comments)
		if (!this.__pinned)
			this._clear();

		if (currentBrowser().indexOf('MSIE') == 0 || (aFilter && aFilter.until))
			this.__body.style.visibility = 'hidden';
		else
			this.__body.style.visibility = 'visible';

		this.__aRequestData.folder = aFolder;
		this.__aRequestData.filter = aFilter;

		this.__options.autoscroll = true;
		this.__loading = 0;
	}

	this._fetch(this.__aRequestData.uniq*1);
};

//load history (top)
_me._request = function(uid){

	if (this.__aRequestData.folder){

		this.__loading = 1;
		addcss(this._main, 'loading');

		var aFilter = {
				sort: 'EVN_ID desc',
				limit: this.__options.preload,
				search: 'gchat:main',
				reset_unread: 1
			},
			bScroll = false;

		if (this.__aRequestData.oldest)
			aFilter.search += ' and beforeid:'+ this.__aRequestData.oldest;
		else
		if (this.__aRequestData.filter && this.__aRequestData.filter.until){
			aFilter.search += ' and untilid:'+ WMItems.__serverID(this.__aRequestData.filter.until) + ' and next:' + this.__options.preload;

			//first request
			if (!this.__aRequestData.fetchnew)
				this.__aRequestData.fetchnew = true;
		}

		if (this.__aRequestData.filter && this.__aRequestData.filter.sys_search)
			aFilter.search += ' and (' + this.__aRequestData.filter.sys_search + ')';

		if (this.__aRequestData.filter && this.__aRequestData.filter.search)
			aFilter.search += ' and (' + this.__aRequestData.filter.search + ')';

		//scroll firts request
		if (!this.__aRequestData.oldest)
			bScroll = true;

		var aItemsInfo = {aid:this.__aRequestData.folder.aid, fid:this.__aRequestData.folder.fid, values: this.__aRequestArray, filter:aFilter};
		WMItems.list(aItemsInfo,'','','',[function(aData){ this._response(aData, false, bScroll, false, false, uid) }.bind(this)]);
	}
};

//load recent (bottom)
_me._request2 = function(uid){
	if (this.__aRequestData.folder){

		this.__loading = this.__loading || 1;

		var aFilter = {
				sort:'EVN_ID asc',
				limit:this.__options.preload,
				search:'gchat:main',
				reset_unread: 1
			};

		if (this.__aRequestData.youngest)
			aFilter.search += ' and afterid:'+ this.__aRequestData.youngest;

		if (this.__aRequestData.filter && this.__aRequestData.filter.sys_search)
			aFilter.search += ' and (' + this.__aRequestData.filter.sys_search + ')';

		if (this.__aRequestData.filter && this.__aRequestData.filter.search)
			aFilter.search += ' and (' + this.__aRequestData.filter.search + ')';

		var bScroll = true;
		if (this.__aRequestData.filter && this.__aRequestData.filter.until){
			bScroll = false;
		}

		var aItemsInfo = {aid:this.__aRequestData.folder.aid, fid:this.__aRequestData.folder.fid, values: this.__aRequestArray, filter:aFilter};
		this.__aRequestData.fetchnew = false;

		WMItems.list(aItemsInfo,'','','',[function(aData){ this._response(aData, true, bScroll, false, false, uid) }.bind(this)]);
	}
};

// bPinned [bool] pin item to the top, for comments purpoase
_me._response = function(aData, bUpdate, bScroll, bSkipTime, bPinned, uid){

	if (this._destructed || (uid && uid != this.__aRequestData.uniq))
		return;

	if (this._main)
		removecss(this._main, 'loading');

	//error
	if (aData === false){
		if (this._onerror)
			this._onerror();
		return;
	}

	if ((aData = aData[this.__aRequestData.folder.aid]) && (aData = aData[this.__aRequestData.folder.fid])){

		var bScrollDown = false,
			scroll = false,
			rowUpdate = bUpdate?obj_list_load.prototype._row.bind(this):false;

		//Scroll to bottom?
		if (bScroll){
			var elm, n = this.__body.childNodes;
			if (n.length && (elm = n[n.length-1])){
				if (elm.offsetTop<this.__body.scrollTop + this.__body.clientHeight)
					bScrollDown = true;
				else
				if (this.__body.scrollTop+this.__body.scrollHeight == this.__body.clientHeight)
					bScrollDown = true;
			}
			else
				bScrollDown = true;
		}
		else
		if (!bUpdate)
			scroll = [this.__body.scrollTop, this.__body.scrollHeight];

		// _onresponse event
		if (this._onresponse)
			this._onresponse(this.__aRequestData.folder, aData['@']);

		delete aData['/'];	//count
		delete aData['#'];
		delete aData['$'];
		delete aData['@'];

		var c = 0, last, d, linkextras;


		var last_read_id = parseInt(Folder.lastId(this.__aRequestData.folder), 16),
			last_message_id = 0;

		// set until to highest ID
		if (this.__aRequestData.filter && this.__aRequestData.filter.until === '*0'){
			this.__aRequestData.filter.until = Object.keys(aData).sort().shift();
		}
		// set next ID into filter.until (unread messages)
		else{

			var	bNext = this.__aRequestData.filter && this.__aRequestData.filter.until && !this.__aRequestData.filter.highlight && parseInt(WMItems.__serverID(this.__aRequestData.filter.until), 16) === last_read_id,
				tmp_id, evnid;

			for (var iid in aData){
				evnid = parseInt(aData[iid].EVN_ID, 16);
				last_message_id = Math.max(last_message_id, evnid);

				//Select next message (unread messages)
				if (bNext){
					if (evnid<=last_read_id){
						if(tmp_id) this.__aRequestData.filter.until = WMItems.__clientID(tmp_id || aData[iid].EVN_ID); //(evnid+1).toString(16)
						bNext = false;
					}
					tmp_id = aData[iid].EVN_ID;
				}
			}

		}

		//Update LASTREADID
		if (last_message_id>last_read_id){
			Folder.lastId(this.__aRequestData.folder, last_message_id.toString(16));
		}

		for (var iid in aData){
			c++;

			if (this.__aData[iid]) {

				//update link preview
				if (this.__aData[iid].obj && this.__aData[iid].obj._type == "obj_groupchat_message" && !this.__aData[iid].obj.__src){
					if (aData[iid].EVNTHUMBNAILTICKET)
						this.__aData[iid].obj._preview_image(aData[iid].EVNTHUMBNAILTICKET, aData[iid].EVNSIZEINFO);
					else
					if (aData[iid].EVNTHUMBNAILID){
						var src = 'server/download.php?' + buildURL({'sid':dataSet.get('main',['sid']), 'class':'attachment', 'fullpath': [aData[iid].aid, aData[iid].fid, WMItems.__serverID(aData[iid].EVN_ID), aData[iid].EVNTHUMBNAILID].join('/'), 't':aData[iid].EVNTHUMBNAILTIME || 0});
						this.__aData[iid].obj._preview_image(src, aData[iid].EVNSIZEINFO);
					}
				}

				continue;
			}

			aData[iid].EVN_CREATED = parseInt(aData[iid].EVN_CREATED);

			//set iid if not exists (pinned item in comment)
			if (!aData[iid].iid) aData[iid].iid = iid;

			this.__aData[iid] = {data:aData[iid]};

			//Parse link extras of Private messages
			linkextras = aData[iid].EVNLINKEXTRAS?parseURL(aData[iid].EVNLINKEXTRAS):{};

			if (linkextras.EvnLinkInvalid != '1'){

				//separator
				d = IcewarpDate.unix(aData[iid].EVN_CREATED);
				var sep = CalendarFormatting.normal(d),
					bToday = d.isToday();

				//New Messages
				if (!bUpdate && last_read_id>0 && last_message_id>last_read_id && last_read_id >= parseInt(aData[iid].EVN_ID, 16)){
					this._separator('<span>'+ getLang('CHAT::NEW_SEPARATOR') +'</span>', 'today unread' + (bPinned?' pinned':''));
					last_read_id = 0;
				}

				if (bUpdate){
					if (this.__sep2.sep != sep){
						this.__sep2 = {sep:sep, today:bToday};

						obj_list_load.prototype._separator.call(this, '<span>'+ this.__sep2.sep +'</span>', (this.__sep2.today?'today':'') + (bPinned?' pinned':''));
					}
				}
				else
				if (this.__sep1.sep != sep){
					if (this.__sep1.sep)
						this._separator('<span>'+ this.__sep1.sep +'</span>', (this.__sep1.today?'today':'') + (bPinned?' pinned':''));

					this.__sep1 = {sep:sep, today:bToday};

					if (!this.__sep2.sep)
						this.__sep2 = {sep:sep, today:bToday};
				}


				var row = false,
					bGroup = false;


				if (!bUpdate){
					if (this.__sep1.row)
						if (aData[iid].EVNCOMEVNID){
							if (aData[iid].EVNCOMEVNID == this.__sep1.row.com){
								addcss(this.__sep1.row.elm, 'group');

								if (!(this.__sep1.row.group && this.__sep1.row.email == aData[iid].EVNMODIFIEDOWNEREMAIL && this.__sep1.row.email2 == linkextras.AccountEmail && this.__sep1.row.time<aData[iid].EVN_CREATED+300))
									addcss(this.__sep1.row.elm, 'nogroup');
							}
						}
						else
						if (this.__sep1.row.com){
							if (this.__sep1.row.com == aData[iid].EVN_ID)
								addcss(this.__sep1.row.elm, 'group','nogroup');
						}
						else
						//Grouping History
						if (this.__sep1.row.group && this.__sep1.row.email == aData[iid].EVNMODIFIEDOWNEREMAIL && this.__sep1.row.email2 == linkextras.AccountEmail && this.__sep1.row.time<aData[iid].EVN_CREATED+300)
							addcss(this.__sep1.row.elm, 'group');
				}

				switch(aData[iid].EVNCLASS){
				case 'I':

					// WC-5516 TeamChat plugins slash command
					if (aData[iid].EVNNOTE && aData[iid].EVNNOTE.indexOf('/') === 0)
						continue;

					if (bUpdate){

						if (rowUpdate)
							row = rowUpdate('', bToday?'today':'', iid);

						if (this.__sep2.row)
							if (aData[iid].EVNCOMEVNID){
								if (this.__sep2.row.com == aData[iid].EVNCOMEVNID){
									addcss(row.elm, 'group');

									if (!(this.__sep2.row.group && this.__sep2.row.email == aData[iid].EVNMODIFIEDOWNEREMAIL && this.__sep2.row.email2 == linkextras.AccountEmail && this.__sep2.row.time<aData[iid].EVN_CREATED+300))
										addcss(row.elm, 'nogroup');
								}
								else
								if (this.__sep2.row.id == aData[iid].EVNCOMEVNID)
									addcss(row.elm, 'group','nogroup');
							}
							else
							//Grouping Update
							if (!this.__sep2.row.com && this.__sep2.row.group  && this.__sep2.row.email == aData[iid].EVNMODIFIEDOWNEREMAIL && this.__sep2.row.email2 == linkextras.AccountEmail && this.__sep2.row.time>aData[iid].EVN_CREATED-300)
								addcss(row.elm, 'group');

					}
					else
						row = this._row('', bToday?'today':'', iid);

					// else{
					// 	row = this._row('', bToday?'today':'', iid);

					// 	if (this.__sep1.row)
					// 		if (aData[iid].EVNCOMEVNID){
					// 			if (aData[iid].EVNCOMEVNID == this.__sep1.row.com){
					// 				addcss(this.__sep1.row.elm, 'group');

					// 				if (!(this.__sep1.row.group && this.__sep1.row.email == aData[iid].EVNMODIFIEDOWNEREMAIL && this.__sep1.row.email2 == linkextras.AccountEmail && this.__sep1.row.time<aData[iid].EVN_CREATED+300))
					// 					addcss(this.__sep1.row.elm, 'nogroup');
					// 			}
					// 		}
					// 		else
					// 		if (this.__sep1.row.com){
					// 			if (this.__sep1.row.com == aData[iid].EVN_ID)
					// 				addcss(this.__sep1.row.elm, 'group','nogroup');
					// 		}
					// 		else
					// 		//Grouping History
					// 		if (this.__sep1.row.group && this.__sep1.row.email == aData[iid].EVNMODIFIEDOWNEREMAIL && this.__sep1.row.email2 == linkextras.AccountEmail && this.__sep1.row.time<aData[iid].EVN_CREATED+300)
					// 			addcss(this.__sep1.row.elm, 'group');
					// }


					try{
						this.__aData[iid].obj = this._create('mssg', 'obj_groupchat_message', row.anchor,'', aData[iid]);
					}
					catch(r){
						if (this.__aData[iid] && (!this.__aData[iid].obj || !this.__aData[iid].obj._destructed))
							throw r;
						return;
					}
					//Do not group edited messages
					bGroup = this.__aData[iid].obj._cangroup;

					break;

				case 'R':
				case 'Z':
				case 'B':
				case 'Q':
				case 'S':
				case 'W':
				case 'D':
				case 'Y':

					try{
						if (bUpdate){
							if (rowUpdate)
								row = rowUpdate('', bToday?'today':'', iid);
						}
						else
							row = this._row('', bToday?'today':'', iid);

						//Public PIN
						if (aData[iid].EVNLINKTYPE == 10){
							this.__aData[iid].obj = this._create('pin', 'obj_groupchat_pin', row.anchor,'', aData[iid]);

							if (aData[iid].EVNLINKEXTRAS){

								//var linkextras = parseURL(aData[iid].EVNLINKEXTRAS);
								if (linkextras && linkextras.evnlinkid){
								 	var cid = WMItems.__clientID(linkextras.evnlinkid);
								 	if (cid!= iid)
									 	if (this.__aDataLink[cid]){
									 		if (inArray(this.__aDataLink[cid], iid)<0)
										 		this.__aDataLink[cid].push(iid);
									 	}
									 	else
									 	 	this.__aDataLink[cid] = [iid];
								}
							}

						}
						else
							switch(aData[iid].EVNCLASS){
							case 'R':
							case 'Z':
								this.__aData[iid].obj = this._create('file', 'obj_groupchat_file', row.anchor,'', aData[iid]);
								break;

							case 'Q':
								this.__aData[iid].obj = this._create('event', 'obj_groupchat_event', row.anchor,'', aData[iid]);
								break;

							case 'S':
								this.__aData[iid].obj = this._create('conference', 'obj_groupchat_conference', row.anchor,'', aData[iid]);
								break;

							case 'W':
								this.__aData[iid].obj = this._create('invite', 'obj_groupchat_invite', row.anchor,'', aData[iid]);
								break;

							case 'Y':
								this.__aData[iid].obj = this._create('message', 'obj_groupchat_mail', row.anchor,'', aData[iid]);
								break;
							}
					}
					catch(r){
						if (this.__aData[iid] && (!this.__aData[iid].obj || !this.__aData[iid].obj._destructed))
							throw r;
						return;
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

				if (row){

					if (bPinned){
						this.__pinned = row.elm;
						addcss(this.__pinned, 'pinned');
					}

					//Comment Item
					if (this.__options.comments && aData[iid].EVNCOMEVNID){

					 	var cid = WMItems.__clientID(aData[iid].EVNCOMEVNID);

					 	if (this.__aDataLink[cid]){
					 		if (inArray(this.__aDataLink[cid], iid)<0)
						 		this.__aDataLink[cid].push(iid);
					 	}
					 	else
					 	 	this.__aDataLink[cid] = [iid];
					}


					this.__aData[iid].anchor = row.anchor;

					//Yellow bg for selected message
					if (this.__aRequestData.filter && this.__aRequestData.filter.until == iid && this.__aData[iid].obj)

						if (this.__aRequestData.filter.highlight){
							var box = this._getAnchor(row.anchor),
								func = function(e){
									e.target && removecss(e.target, 'selected');
								};

							box.addEventListener('animationend',func);
							box.addEventListener('webkitAnimationEnd',func);

							addcss(box, 'selected');
						}

					if (bUpdate)
						this.__sep2.row = {elm: row.elm, email: aData[iid].EVNMODIFIEDOWNEREMAIL, email2:linkextras.AccountEmail, time: aData[iid].EVN_CREATED, group: bGroup, com: aData[iid].EVNCOMEVNID, id:aData[iid].EVN_ID};
					else{
						this.__sep1.row = {elm: row.elm, email: aData[iid].EVNMODIFIEDOWNEREMAIL, email2:linkextras.AccountEmail, time: aData[iid].EVN_CREATED, group: bGroup, com: aData[iid].EVNCOMEVNID, id:aData[iid].EVN_ID};

						if (!this.__sep2.row)
							this.__sep2.row = clone(this.__sep1.row);
					}

					last = row;
				}
				/*
				//New Messages
				if (bUpdate && last_read_id>0 && last_read_id !== last_message_id && last_read_id >= parseInt(aData[iid].EVN_ID, 16)){
					//this._separator('<span>'+ getLang('CHAT::NEW_SEPARATOR') +'</span>', 'today unread' + (bPinned?' pinned':''));
					obj_list_load.prototype._separator.call(this,'<span>'+ getLang('CHAT::NEW_SEPARATOR') +'</span>', 'today unread' + (bPinned?' pinned':''));
					Folder.lastId(this.__aRequestData.folder, last_message_id.toString(16));
					last_read_id = 0;
				}
*/
				if (this.__options.autoscroll){
					if (bScrollDown)
						this._scroll(0);
					else
					if (scroll)
						this.__body.scrollTop = scroll[0] + this.__body.scrollHeight - scroll[1];
				}
			}

			if (!bSkipTime){
				var real_id = WMItems.__serverID(iid);
				if (!this.__aRequestData.oldest || this.__aRequestData.oldest>real_id)
					this.__aRequestData.oldest = real_id;

				if (!this.__aRequestData.youngest || this.__aRequestData.youngest<real_id){
					if (this.__options.comments == false || (gui.frm_main.main.tabs.room && gui.frm_main.main.tabs.room._isActive)){
						this.__aRequestData.youngest = real_id;
					}
				}
			}

		}

		if (!bSkipTime)
			this.__loading = (bUpdate || c >= this.__options.preload)?0:2;

		if (!bUpdate){

			if (this.__anim_last && this.__anim_last.parentNode)
				this.__anim_last.parentNode.removeChild(this.__anim_last);

			if (this.__sep1.sep){
				this.__anim_last = this._separator('<span>'+ this.__sep1.sep +'</span>', (this.__sep1.today?'today':'') + (bPinned?' pinned':''), true).elm;
				addcss(this.__anim_last,'last');

				if (this.__anim)
					this.__anim_last.style.top = this.__anim.style.top;

				this._main.appendChild(this.__anim_last);
			}
		}

		if (this.__sep1.sep && !this.__anim && last && this.__sep1.elm !== last.elm){
			this.__anim = this._separator('<span>'+ this.__sep1.sep +'</span>', (this.__sep1.today?'today':'') + (bPinned?' pinned':''), true).elm;
			this._main.appendChild(this.__anim);
		}

	}
	//clear on error
	else
	if (!aData){
		this._clear(true);
		return;
	}

	if (currentBrowser().indexOf('MSIE') == 0 && this.__body.style.visibility == 'hidden' && (!this.__aRequestData.filter || !this.__aRequestData.filter.until))
		this.__body.style.visibility = 'visible';

	// Fetch new reponse with search and possibility of recent items
	if (bUpdate) {
		if (c >= this.__options.preload)
			this.__aRequestData.fetchnew = true;

		if (!bScroll && !bPinned){
			// switch back to normal behavior
			if (this.__aRequestData.filter && this.__aRequestData.filter.until){

				//scroll to until ID
				var tmp = this.__aData[this.__aRequestData.filter.until];
				if (tmp && tmp.anchor && (tmp = this._getAnchor(tmp.anchor))){
					if (tmp.offsetHeight>this.__body.clientHeight)
						this.__body.scrollTop = tmp.offsetTop + 30;
					else
						this.__body.scrollTop = tmp.offsetTop - this.__body.clientHeight/2 + tmp.offsetHeight/2;
				}

				addcss(this._main,'scrollbtn');

				delete this.__aRequestData.filter.until;
				delete this.__aRequestData.filter.highlight;

				if (this.__body.style.visibility == 'hidden')
					this.__body.style.visibility = 'visible';
			}
		}
	}

	var bRemoveNew = bUpdate;
	if (!bPinned && (!bUpdate || this.__aRequestData.fetchnew))
		bRemoveNew = !this._fetch(uid);

	if (bRemoveNew && this._scroll() < 10){
		removecss(this._main, 'newitem', 'scrollbtn');
		this._getAnchor('refresh').innerHTML = getLang('COMMON::SCROLL_DN');
		this.__newitems = 0;
	}

};

_me._add_message = function(arg, bForce){
	if (arg.id){

		//Do Not use fast message in search mode
		if (!bForce && this.__aRequestData.filter){
			this._serverSort();
			return;
		}

		var aData = mkArrayPath([this.__aRequestData.folder.aid, this.__aRequestData.folder.fid, arg.id]),
			tmp = aData[this.__aRequestData.folder.aid][this.__aRequestData.folder.fid][arg.id];

		tmp.aid = this.__aRequestData.folder.aid;
		tmp.fid = this.__aRequestData.folder.fid;

		tmp.EVNCLASS = 'I';
		tmp.EVN_ID = WMItems.__serverID(arg.id);
		tmp.EVN_CREATED = arg.timestamp || (new IcewarpDate()).unix();
		tmp.EVNOWNEREMAIL = sPrimaryAccount;
		tmp.EVNMODIFIEDOWNEREMAIL = sPrimaryAccount;
		tmp.EVNMODIFIEDOWNERNAME = dataSet.get('main',['fullname']);
		tmp.EVNNOTE = arg.body;

		//Privat message
		if (arg.contact_email){
			tmp.EVNSHARETYPE = arg.share;
			tmp.EVNLINKEXTRAS = buildURL({AccountEmail:arg.contact_email, AccountName:arg.contact_name});
		}

		if (arg.url)
			tmp.EVNURL = arg.url;
		if (arg.desc)
			tmp.EVNLOCATION = arg.desc;
		if (arg.title)
			tmp.EVNTITLE = arg.title;

		if (arg.type == 2)
			tmp.CORE_LINKINFO = arg;

		if (arg.comevnid)
			tmp.EVNCOMEVNID = arg.comevnid;

		//Include mentions
		if (arg.mentions){
			if (!tmp.MENTIONS)
				tmp.MENTIONS = {};

			for (var email in arg.mentions)
				tmp.MENTIONS[unique_id()] = {values:{EMAIL:email, NAME:arg.mentions[email]}};
		}

		this._response(aData, true, true, true);

		//Always scroll bottom
		if (this.__options.autoscroll)
			this.__body.scrollTop = this.__body.scrollHeight;
	}
};
/////////////////////

_me._onnotify = function(aData){

console.log(this._pathName + '._onnotify', aData);

	var cid = WMItems.__clientID(aData.ITEM),
		arr = [cid];

		//traverse linked item
	if (Is.Array(this.__aDataLink[cid]))
		arr = arr.concat(this.__aDataLink[cid]);

	if (aData['ITEM-TYPE'] == '-') {
		if (aData.TYPE == 'gw-queue') {
			if (aData.ACTION == 'add')
				aData.ACTION = 'update_preview';
		}
		else
		if (aData.ACTION === 'add' && aData.TYPE === 'gw-queue-failure') {
			//moved
		}
		else
		switch(aData.ACTION){
			case 'lock':
			case 'unlock':
			case 'comment':
				break;

			default:
				return;
		}
	}

	for (var iid, i = 0; i<arr.length; i++){
		iid = arr[i];

		switch(aData.ACTION){
			//Conference
		case 'stop':
			 	if (this.__aData[iid] && this.__aData[iid].obj)
			 		this.__aData[iid].obj._data(cid, '', '__stop');

			 	break;

			//Reactions (do update when no BODY)
		case 'reaction':
		case 'reaction-deleted':

			if (this.__aData[iid] && this.__aData[iid].obj){
				if (Is.Defined(aData.BODY)){

					if (aData.ACTION == 'reaction-deleted' && aData.BODY == '')
						return;

					//var aOut = {META_REACTIONS:parseURL(aData.BODY)}; //&hankey=1&thumbsup=1
					var aOut;

					//thumbsup
					aOut = {NOTIFY_REACTIONS:aData.BODY, ACTION:aData.ACTION};

					//Update item if notification come from the same account, but different client (To update REAVALUE)
					if (!(aData.SERVICE && (aData['ORIGINATOR-EMAIL'] == sPrimaryAccount || aData['ORIGINATOR-EMAIL'] == dataSet.get('main', ['user'])))){

						if (Is.Defined(aData.REAVALUE))
							aOut.REAVALUE = aData.REAVALUE;

						this.__aData[iid].obj._data(cid, '', '_init_reactions',[aOut]);
						break;
					}

				}
			}
			else
				break;

			//Item
		case 'update_preview':
			if (this.__aData[iid] && this.__aData[iid].obj && this.__aData[iid].obj.__update){
				this.__aData[iid].obj._data(cid, '', '__update_preview', [true]);
			}
			break;

		case 'lock':
		case 'unlock':
		case 'update':
			if (this.__aData[iid] && this.__aData[iid].obj && this.__aData[iid].obj.__update){
				this.__aData[iid].obj._data(cid, '', '__update', [true]);
			}

			break;

		case 'add':

			if (!this.__aData[iid] && inArray(['E','M'], aData['ITEM-TYPE'])<0){

				var bActive = this._parent._isActive !== false;

				if ((aData.SERVICE && this._scroll()>0) || !bActive){
					this.__newitems++;
					this._getAnchor('refresh').innerHTML = getLang(this.__newitems>1?'CHAT::NEW_MSGS':'CHAT::NEW_MSG',[this.__newitems]);
					addcss(this._main, 'newitem');
				}

				if (bActive)
					this._serverSort();
			}

			break;

		case 'delete':

			if (this.__aData[iid])
				this._remove(this.__aData[iid].anchor, iid);
			break;

			//Pinning
		case "add_pin":
			if (this.__aData[iid] && this.__aData[iid].obj)
				this.__aData[iid].obj._data(cid, {LPINWHEN:true}, '_init_reactions');
			break;

		case "add_global_pin":

			//Update cookie
			if (!aData.SERVICE && aData.LAST_PINNED_ITEM && parseInt(Cookie.get(['folders', this.__aRequestData.folder.aid, this.__aRequestData.folder.fid, 'gpin']) || 0) < parseInt(aData.LAST_PINNED_ITEM || 0)){

				//check if GPIN Tab is open or not

				Cookie.set(['folders', this.__aRequestData.folder.aid, this.__aRequestData.folder.fid, 'gpin'], aData.LAST_PINNED_ITEM);
			}

			if (this.__aData[iid] && this.__aData[iid].obj){
				var aOut = {GPINWHEN:true};

				if (!aData.SERVICE)
					aOut.PINOWNEMAIL = sPrimaryAccount;

				this.__aData[iid].obj._data(cid, aOut, '_init_reactions');
			}

			//Update for local event
			if (!aData.SERVICE)
				this._serverSort();

			break;

		case "delete_pin":
			if (this.__aData[iid] && this.__aData[iid].obj){
				this.__aData[iid].obj._data(cid, {LPINWHEN:false}, '_init_reactions');
			}
			break;

		case "delete_global_pin":
			if (this.__aData[iid] && this.__aData[iid].obj){
				this.__aData[iid].obj._data(cid, {GPINWHEN:false, PINOWNEMAIL:''}, '_init_reactions');
			}
			break;

			//Update comments
		case "comment":
			if (this.__aData[iid] && this.__aData[iid].obj){
				if (Is.Defined(aData.BODY))
					this.__aData[iid].obj._data(cid, {META_COMMENTS:{count:aData.BODY}}, '_init_reactions');
			}
			break;
		}
	}
};


_me._onremove = function(iAnchor, sData_id, bFire){

	//Fire Remove Event
	if (bFire)
		this._fire(sData_id, 'delete');
	//this._fire(sData_id, 'delete', '', true);

	//remove from aDataLink
	if (this.__aDataLink && this.__aDataLink[sData_id])
		delete this.__aDataLink[sData_id];

	//remove from aData
	if (this.__aData && this.__aData[sData_id])
		delete this.__aData[sData_id];
};

_me._edit = function(id){
	if (this.__aData[id] && this.__aData[id].obj && !this.__aData[id].obj._destructed && this.__aData[id].obj._edit){
		return this.__aData[id].obj._edit(true);
	}

	return false;
};

_me._ungroupNode = function(prev, elm){
	var id;
	if ((id = elm.getAttribute('rel')) && this.__aData[id] && this.__aData[id].obj && this.__aData[id].obj._ungroup){

		//force remove "group" for 1st comment
		var bForce = !prev || (!hascss(prev, 'group') && this.__aData[id].obj.__aData.EVNCOMEVNID);

		this.__aData[id].obj._ungroup(bForce);
	}
	else
		removecss(elm,'group');
};
