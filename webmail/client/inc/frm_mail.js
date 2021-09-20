_me = frm_mail.prototype;
function frm_mail(){};

_me.__constructor = function(id, aSortInfo, aLockInfo, bIsHTML) {
	this.__bIsHTML = bIsHTML;
	this._filter = aSortInfo;
	this._defaultSize(-1,-1,900,630);

	this._create('menu','obj_hmenu','header','obj_pupup_menu');

	//Open from TeamChat
	if (id && aLockInfo && WMFolders.getType(id) == 'I'){

		this._create('lock', 'obj_label','main', 'lock ico');
		this.__lock(aLockInfo);

		this.lock._onclick = function(){
			//Unlock
			if (this._lockInfo.EVNLOCKOWN_ID === sPrimaryAccountGWID){
				Item.set_lock([id[0],id[1],this._lockInfo.id], false, false); //, null, 'I'
			}
			else
			if (this._lockInfo.EVNLOCKOWN_EMAIL){
				var room = dataSet.get('folders', [id[0], id[1]]);
				var group = '';

				if (room.TYPE == 'I' && room.NAME){
					group = id[1].split('/');
					group.splice(-1, 1, room.NAME);
					group = group.join('/');
				}

				var sign_top = GWOthers.getItem('MAIL_SETTINGS_DEFAULT', 'sign_top');
				GWOthers.setItem('MAIL_SETTINGS_DEFAULT', 'sign_top', 0);

				var body = getLang('DOCUMENT::REQUEST_UNLOCK_TEXT', [this._lockInfo.EVNTITLE, (group || room.NAME || room.RELATIVE_PATH)], bIsHTML);
				var body_header = getLang('DOCUMENT::REQUEST_UNLOCK_TEXT_GREETINGS', [dataSet.get('xmpp', ['roster', this._lockInfo.EVNLOCKOWN_EMAIL, 'name']) || this._lockInfo.EVNLOCKOWN_EMAIL]);

				NewMessage.compose({
					to: this._lockInfo.EVNLOCKOWN_EMAIL,
					subject: getLang('DOCUMENT::REQUEST_UNLOCK_TEXT_SUBJECT', [(room.NAME || room.RELATIVE_PATH) + '/' + this._lockInfo.EVNTITLE]),
					mailBody: '<div>' + body_header + '</div><div><br></div><div>' + body + '</div>'
				});

				GWOthers.setItem('MAIL_SETTINGS_DEFAULT', 'sign_top', sign_top);
			}

		}.bind(this);

		//listen to locks
		gui.socket && gui.socket.api._obeyEvent('onnotify', [this, '__notify']);
	}

	this._create('view','obj_mailview','main');
	this.view._onkeypress = function(e){
		if (e.keyCode == 27)
			me._destruct();
	};

	//Request data
	this._add_destructor('__destruct');
	this.__request(id);
};

_me.__notify = function(aData){
	var id;
	if (aData.TYPE == "item" && aData.ITEM && (id = WMItems.__clientID(aData.ITEM)) && id == this._lockInfo.id){
		switch(aData.ACTION){
			case 'unlock':
				this.__lock();
				break;

			case 'lock':
				var aLockInfo = {
					id:id,
					EVNLOCKOWN_ID:aData['ORIGINATOR-ID'],
					EVNLOCKOWN_NAME:aData['ORIGINATOR-NAME'],
					EVNLOCKOWN_EMAIL:aData['ORIGINATOR-EMAIL']
				};

				this.__lock(aLockInfo);
				break;
		}
	}
};

_me.__lock = function(aLockInfo){
	if (aLockInfo)
		this._lockInfo = aLockInfo;

	if (aLockInfo && aLockInfo.EVNLOCKOWN_ID){
		if (aLockInfo.EVNLOCKOWN_ID === sPrimaryAccountGWID){
			this.lock._value(getLang('FILE::LOCKED_BY_ME'));
			removecss(this.lock._main, 'color2');
		}
		else{
			this.lock._value(aLockInfo.EVNLOCKOWN_EMAIL?getLang('FILE::LOCKED_BY',[aLockInfo.EVNLOCKOWN_EMAIL]):getLang('FILE::LOCKED'));
			addcss(this.lock._main, 'color2');
		}

		//var aAccess = WMFolders.getAccess(aLockInfo.id);
		//addcss(this.lock._main, 'locked', aAccess.modify?'':'color2');

		addcss(this._main, 'locked');
	}
	else
		removecss(this._main, 'locked');
};

_me.__request = function(id){
	if (Is.Object(id)){

		this._title('COMMON::LOADING');
		this._create('loader', 'obj_loader', 'box');

		this.__id = id;

		this.__folder_type = WMFolders.getType(this.__id);

		if ((GWOthers.getItem('MAIL_SETTINGS_GENERAL','show_inline_images') || 0)<1 || (dataSet.get('main',['spam_path']) == this.__id[0]+'/'+this.__id[1] && (GWOthers.getItem('MAIL_SETTINGS_GENERAL','show_images') || 0)<1))
			var def_val = OldMessage.__FULLMAIL_VALUES;
		else
			var def_val = OldMessage.__FULLMAIL_VALUES_DANGER;

		WMItems.list({"aid": this.__id[0], "fid": this.__id[1], "iid": this.__id[2], "values": def_val}, '','','',[this, '__response']);
	}
};

_me.__response = function(aData){

	if (this._destructed)
		return;

	//Close when message doesn't exist
	if (!aData){
		this._destruct();
		return;
	}

	var me = this;

	//Get free DS name
	if (!this._listener){
		this._listener  = 'mailview_window';
		for(var no = 0;;no++)
			if (dataSet.get(this._listener))
				this._listener = 'mailview_window_' + no;
			else
				break;
		//Reserve DS name
		dataSet.add(this._listener, '', true, true);
	}

	switch (this.__folder_type){

		case 'I':

			// gui.socket.api._obeyEvent('onnotify', [function(aData){
			// }]);

			//break;

		default:

			//Set SEEN flag
			if (this.__id[2].indexOf('|')<0){
				var message = new OldMessage(this.__id,[]);
				OldMessage.__mailviewCallback(message, message.hasFlag('SEEN'),aData);
			}

			//Menu
			this.menu._onclick = function(e, elm, id, sAction){
				if (typeof sAction == 'object')
					executeCallbackFunction(sAction);
				else
				switch(sAction){
				case 'print':
					me.view._print();
					break;
				case 'delete':
					Item.remove([me.__id[0],me.__id[1],[me.__id[2]]]);
					me._destruct();
					break;
				case 'reply_to_sender':
					OldMessage.reply(me.__id, false, void 0, void 0, me.__bIsHTML);
					break;
				case 'reply_to_all':
					OldMessage.reply(me.__id, true, void 0, void 0, me.__bIsHTML);
					break;
				case 'forward':
					OldMessage.forward(me.__id, void 0, void 0, me.__bIsHTML);
					break;

				case 'forward_att':
					OldMessage.forward(me.__id, true, false, me.__bIsHTML);
					break;

				case 'redirect':
					OldMessage.redirect(me.__id);
					break;

				case 'prev':
				case 'next':
					me._prevNext(sAction == 'prev');
				}
			};

			dataSet.add(this._listener, '', aData);
			this.__update(aData);
		}

	this.loader && this.loader._destruct();
};


// @note: M only
_me._prevNext = function(bPrev){
	//Disable buttons
	this._fillmenu();

	var me = this, iRow = 0;

	this._filter.row = parseInt(this._filter.row, 10) || 0;
	this._filter.offset = parseInt(this._filter.offset, 10) || 0;

	//Existuje idTable (2. pouziti Next/Prev)
	if (this.__idTable){
		var bFound = false;
		for(var i in this.__idTable){
            if (this.__idTable[i] == this.__id[2]){
            	this._filter.row = iRow;
                bFound = true;
				break;
            }
            iRow++;
		}

		var id;
		if (bFound && ((bPrev && this._filter.row>0 && (id = this.__idTable[this._filter.row - 1])) || (!bPrev && this._filter.row<19 && (id = this.__idTable[this._filter.row + 1])))){
			this.__request([this.__id[0], this.__id[1], id]);
			return;
		}
	}

	var aFilter = {
		sort: this._filter.sort,
		search: this._filter.search,
		limit: 20,
		offset: this._filter.offset + this._filter.row - 10>0?this._filter.offset + this._filter.row - 10:0
	};

	WMItems.list(
		{"aid": this.__id[0], "fid": this.__id[1],"filter":aFilter},
		'','','',[
			function(aData){

				if (aData && aData[me.__id[0]] && aData[me.__id[0]][me.__id[1]]){
                    aData = aData[me.__id[0]][me.__id[1]];
                    delete aData['/'];
                    delete aData['#'];
                    delete aData['$'];
                    delete aData['@'];

					var bFound = false, iRow = 0, ids = [];
					for(var i in aData){

						ids.push(i);

						if (i == me.__id[2]){
							me._filter = aFilter;
							me._filter.row = iRow;
							bFound = true;
						}

						iRow++;
					}

					if (bFound){

						me.__idTable = ids;

						if (bPrev && me._filter.row>0)
							me.__request([me.__id[0], me.__id[1], me.__idTable[me._filter.row-1]]);
						else
						if (!bPrev && me._filter.row<19 && me.__idTable[me._filter.row+1])
							me.__request([me.__id[0], me.__id[1], me.__idTable[me._filter.row+1]]);
						else
							me._fillmenu(true);
					}
                    //Do some crazy non-deterministic magic ;)
					else
					if (ids.length){

						var id = '';
						//try to find something...
						if (Is.Array(me.__idTable) && me.__idTable.length)
							if (bPrev && me._filter.row>0){
								for (var i = me._filter.row-1;i>=0;i--){
									if (inArray(ids,me.__idTable[i])>-1){
										id = me.__idTable[i];
										break;
									}
								}
							}
							else
							if (!bPrev){
								for (var i = me._filter.row;i<me.__idTable.length;i++){
									if (inArray(ids,me.__idTable[i])>-1){
										id = me.__idTable[i];
										break;
									}
								}
							}

						if (!id)
						    id = ids[me._filter.row] || ids[ids.length-1];

						me.__request([me.__id[0], me.__id[1], id]);
					}
				}
			}]);
};

_me.__update = function(aData){

	if (aData){
		for(var aid in aData)
			for(var fid in aData[aid]){
				delete aData[aid][fid]['#'];
				delete aData[aid][fid]['/'];
				delete aData[aid][fid]['$'];
				delete aData[aid][fid]['@'];

				for(var iid in aData[aid][fid]);
			}

		if (!(aData = aData[aid][fid][iid]) || !aData.aid) return;

		/*** Fill Title ***/
		if (aData.SUBJECT){
			this._title(aData.SUBJECT,true);
		}
		else
			this._title('MAIL_VIEW::NOSUBJECT');

		this._fillmenu(true);

		/*** Fill Body ***/
		if (!this.view._listener){
			this.view._listen(this._listener, this._listenerPath);
		}
	}
};

_me.__destruct = function(){
	if (this._listener)
		dataSet.remove(this._listener,'',true);

	if (this.__folder_type == 'I')
		gui.socket && gui.socket.api._disobeyEvent('onnotify', [this, '__notify']);

	return true;
};

_me._fillmenu = function(bPrevNext){
	var me = this,
		folders = GWOthers.get('DEFAULT_FOLDERS','storage')['VALUES'],
		aMenu = [],
		draft = this._lockInfo && this._lockInfo.draft,
		bUser = !sPrimaryAccountGUEST && !(TeamChatAPI && TeamChatAPI.teamChatOnly());

	if (bUser) {
		if (draft){
			aMenu.push(
				{"title": 'POPUP_ITEMS::FORWARD_AS_MESSAGE', 'arg': 'forward_att', css: 'ico2 forward'},
				{"title":'-'}
			);
		}
		else{
			if (this.__sFolderID != folders['drafts'] && this.__sFolderID != folders['sent'])
				aMenu.push({"title": 'MAIN_MENU::REPLY_TO_SENDER', 'arg': 'reply_to_sender', css: 'ico2 reply'});

			aMenu.push(
				{"title": 'MAIN_MENU::REPLY_TO_ALL', 'arg': 'reply_to_all', css: 'ico2 reply_all'},
				{"title": 'MAIN_MENU::FORWARD', 'arg': 'forward', css: 'ico2 forward'}
			);
		}

		// if ((GWOthers.getItem('RESTRICTIONS', 'disable_redirect') || 0)<1)
		// 	aMenu.push({"title": 'POPUP_ITEMS::REDIRECT', 'arg': 'redirect', css: 'ico redirect'});

		if (this._filter)
			aMenu.push(	{"text":'', tooltip:'COMMON::PREVIOUS', 'arg':'prev', 'disabled':!bPrevNext, 'css':'ico2 img prev'},
						{"text":'', tooltip:'COMMON::NEXT', 'arg':'next', 'disabled':!bPrevNext, 'css':'ico2 img next'});
	}

	aMenu.push(
	// {
	// 	title: 'ATTACHMENT::DOWNLOAD',
	// 	css: 'ico2 save noarrow',
	// 	keep: true,
	// 	nodetype: 'click',
	// 	"nodes": [{
	// 			"title": 'POPUP_ITEMS::TEXT',
	// 			'arg': [Item.downloadSource, [this.__id, 'text']]
	// 		},
	// 		{
	// 			"title": 'POPUP_ITEMS::HTML',
	// 			'arg': [Item.downloadSource, [this.__id, 'html']]
	// 		},
	// 		{
	// 			"title": 'POPUP_ITEMS::EML',
	// 			'arg': [Item.downloadSource, [this.__id]]
	// 		}
	// 	]
	// },
	{
		title: 'MAIN_MENU::PRINT',
		'arg': 'print',
		css: 'ico2 print'
	});


	if (bUser){

		aMenu.push(
			{title: 'COMMON::MORE', 'arg': 'options', 'css': 'ico2 more noarrow', keep:true, nodetype: 'click', callback: [
				function(){
					var aData = arrayPath(dataSet.get(me._listener,me._listenerPath),me.__id) || {};

					try{
						var aMenu = obj_context_item.prototype.__createMailMenu.call(null,
							me.__id,
							[me.__id[0],me.__id[1],[me.__id[2]]],
							false,
							aData.FROM,
							WMFolders.getAccess(me.__id),
							true,
							{noactions:true}
						);
					}
					catch(r){
						aMenu = [];
					}

					return aMenu;
				}
			]});

		if (WMFolders.getType(this.__id) !== 'I')
			aMenu.push(	{title: 'MAIN_MENU::DELETE', 'arg': 'delete', disabled:(this.__id[2].indexOf('|')>-1 || !WMFolders.getAccess(this.__id, 'remove')), css:'color2 ico2 delete'});

	}

    this.menu._fill(aMenu);
};
