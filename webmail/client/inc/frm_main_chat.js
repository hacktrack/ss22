_me = frm_main_chat.prototype;
function frm_main_chat(){};

_me.__constructor = function(sDataset){

	//Reset Title
	gui.frm_main._title();

	var me = this;
	this.__sDataset = sDataset;
	this.__updateTab = {};
	this._draw('frm_main_chat', 'main', {guest_user:sPrimaryAccountGUEST});
	this._add_destructor('__pushOfflineStatus');


	//Height fix
	msiebox(this._getAnchor('msiebox'));

	//upload
	this._create('upload','obj_upload');
	//this._create('progress', 'obj_progress','','noborder max transparent simple mono');

	this.upload._onuploadstart = function(){

		//SHOW
		me.text._create('info', 'obj_upload_info', 'block');
		addcss(me.text._main, 'block');

		me.__upload_buffer = [];
		me.upload.__aid = me.__aid;
		me.upload.__fid = me.__fid;
	};
	this.upload._onuploadend = function(){

		//HIDE
		removecss(me.text._main, 'block');
		me.text.info && me.text.info._destruct();

		if (me.__upload_buffer.length){
			if (me.__upload_buffer.length == 1){
				gui._create('chat_upload','frm_chat_upload','','', me.__upload_buffer[0].description, '', {aid:me.upload.__aid || me.__aid, fid:me.upload.__fid || me.__fid}, [function(sName, sDesc, aArg){
					me.__upload_buffer[0].description = sName;
					me.__uploadhandler(me.__upload_buffer, sName, sDesc, aArg);
				}.bind(me)]);
			}
			else
				me.__uploadhandler(me.__upload_buffer,'','','');
		}
	};
	this.upload._onuploadsuccess = function(file){

		me.text.info && me.text.info._handler(null);

		me.__upload_buffer.push({
			'class':'file',
			'description':file.name,
			'size':file.size,
			'fullpath':file.folder+'/'+file.id
		});
	};

	this.upload._onuploadprogress = function(file, a, b, xhr){
		me.text.info && me.text.info._value(file.name, a, b, [function(){xhr.abort()}]);
	};

	this.upload._dropzone(this._main, function(){
		return template.tmp('dropzone',{title:getLang('CHAT::DROP_TITLE',[dataSet.get('folders', [me.__aid, me.__fid]).NAME || dataSet.get('folders', [me.__aid, me.__fid]).RELATIVE_PATH]), body:getLang('CHAT::DROP_BODY')});
	}, 'item');

	this.upload._ondropzone = function(){
		return !me.comment;
	};

	this.__input_menu_handlers = {
		word:[this,'_word'],
		excel:[this,'_excel'],
		ppoint:[this,'_ppoint'],
		code:[this,'_code'],
		attach:[this,'_attachFile'],
		event:[this,'_addEvent'],
		conference:(sPrimaryAccountGUEST  || (TeamChatAPI && TeamChatAPI.teamChatOnly())) ? void 0 : [this,'_addConference'],
		invite:[this,'_addMember'],
		email:(sPrimaryAccountGUEST  || (TeamChatAPI && TeamChatAPI.teamChatOnly())) ? void 0 : [this,'_addEmail']
	};

	// Chat input
	this._create("text","obj_chat_input","text","",{
		guest:!sPrimaryAccountGUEST,
		parseurl:true,
		block:true,
		smiles_enabled: GWOthers.getItem('CHAT','smiles') == '1',
		handlers:this.__input_menu_handlers,
		memory:{
			set:[function(val){
				dataSet.add('teamchat', [me.__fid, 'input'], val, true);
			}],
			get:[function(){
				return dataSet.get('teamchat', [me.__fid, 'input']) || '';
			}]
		}
	});

	this.text.input._placeholder(getLang('IM::MESSAGE_PH'));

	this.text._onsubmit = function (v, arg) {
		if (v.length || (arg && arg.url)) {
			if(!!~v.toLowerCase().indexOf('/giphy ')){
				storage.library('giphy');
				return Giphy.translateFromInput(v);
			}
			me._message(v, arg, this.__private);
		} else {
			return false;
		}
	};

	this.text._onpasteimage = function (aFiles) {
		me.upload.file.__ondropfile(aFiles);
	};

	this.text._focus();
	this._keyupListener();

	//Tabs
	this._init_tabs();

	// Background Status
	if (gui.socket){
		gui._obeyEvent('blur', [this, '__pushBackgroundStatus']);
	}
};

_me.__pushBackgroundStatus = function(){
	gui.socket && WMFolders.getType([this.__aid, this.__fid]) === 'I' && gui.socket.api._pushGroupChatStatus(obj_groupchat._BACKGROUND);
};
_me.__pushOfflineStatus = function(){
	gui.socket && WMFolders.getType([this.__aid, this.__fid]) === 'I' && gui.socket.api._pushGroupChatStatus(obj_groupchat._OFFLINE);
	gui._disobeyEvent('blur', [this, '__pushBackgroundStatus']);
};

_me._keyupListener = function(){
	this.text.input._obeyEvent('onkeyup', [this, '__keyupHandler']);
};

_me.__keyupHandler = function(){
	if(this.timer){
		clearTimeout(this.timer);
	}else{
		gui.socket.api._pushGroupChatStatus(obj_groupchat._TYPING);
	}
	this.timer = setTimeout(function(){
		gui.socket.api._pushGroupChatStatus(obj_groupchat._ONLINE);
		this.timer = false;
	}.bind(this), 1000);
};


/*
	aBuffer		file buffer
	sName		[optional] file name
	sDesc		[optional] file description
*/
_me.__uploadhandler = function(aBuffer, sName, sDesc, aArg, comevnid){

	if (aBuffer && aBuffer.length){

		var d = new IcewarpDate(),
			aItemInfo = {values:{},ATTACHMENTS:[]};

		aItemInfo.values.EVNSHARETYPE = 'U';
		aItemInfo.values.EVNCLASS = 'F';
		aItemInfo.values.EVNSTARTDATE = d.format(IcewarpDate.JULIAN);
		aItemInfo.values.EVNSTARTTIME = d.hour()*60 + d.minute();

		if (comevnid)
			aItemInfo.values.EVNCOMEVNID = comevnid;

		if (aBuffer.length == 1){

			aItemInfo['values']['EVNRID'] = aItemInfo['values']['EVNLOCATION'] = aItemInfo['values']['EVNTITLE'] = sName || aBuffer[0].name;
			aItemInfo['values']['EVNCOMPLETE'] = aBuffer[0].size;

			if (Is.String(sDesc) && sDesc.length){
				aItemInfo['values']['EVNNOTE'] = sDesc;
				aItemInfo['values']['EVNDESCFORMAT'] = 'text/plain';
			}
		}

		for(var i=0, j = aBuffer.length;i<j;i++)
			aItemInfo['ATTACHMENTS'].push({values:aBuffer[i]});

		//Sent to server
		WMItems.add([this.upload.__aid || this.__aid, this.upload.__fid || this.__fid], aItemInfo,'','','', [function(bOK, aData){
			if (bOK){
				(Array.isArray(aData) ? aData : [aData]).forEach(function(aData) {
					this.tabs.room.list._fire(aData.id, 'add', {'ITEM-TYPE':'R'});
				}, this);

				//Fire add_mention event
				if (aArg)
					for(var m in aArg.mentions)
						if (m == sPrimaryAccount && this.tabs.room.list){
							data.forEach(function(aData) {
								this.tabs.room.list._fire(aData.id, 'add_mention', {'ITEM-TYPE':'I'}, true);
							}, this);
							break;
						}
			}

		}.bind(this)]);
	}
};

_me._init_tabs = function(){
	var me = this;

	//Search
	this.tabs._onchange = function(sTab){

		//Set actual value
		if (sTab){
			if (this[sTab].list && this[sTab].list && this[sTab].list._search && GWOthers.getItem('LAYOUT_SETTINGS','keep_search') == '1') {
				gui.frm_main.search._value(gui.frm_main.search._value(), true);
			} else
				gui.frm_main.search._deactivate();
		}

		var op = [], hints = [];
		switch(sTab){
		case 'files':
			hints = ['title:','before:','after:','smaller:','greater:'];
			op = [
				['title:', getLang('SEARCH_HINTS::TITLE')],
				['after:', getLang('SEARCH_HINTS::AFTER_F')],
				['before:', getLang('SEARCH_HINTS::BEFORE_F')],
				['smaller:', getLang('SEARCH_HINTS::SMALLER')],
				['greater:', getLang('SEARCH_HINTS::GREATER')]
			];
			break;

		case 'events':
			hints = ['title:'];
			op = [
				['title:', getLang('SEARCH_HINTS::TITLE')],
				['description:', getLang('SEARCH_HINTS::DESCRIPTION')],
				['after:', getLang('SEARCH_HINTS::AFTER_E')],
				['before:', getLang('SEARCH_HINTS::BEFORE_E')],
				['location:', getLang('SEARCH_HINTS::LOCATION')],
				['is:free', getLang('SEARCH_HINTS::ISFREE')],
				['is:busy', getLang('SEARCH_HINTS::ISBUSY')]
			];
			break;

		case 'members':
			hints = ['name:'];
			op = [
				['name:', getLang('SEARCH_HINTS::NAME')],
				['email:', getLang('SEARCH_HINTS::EMAIL')]
			];
			break;

		default:
			gui.frm_main.search._setFolder({aid:me.__aid, fid:me.__fid});
			return;
		}

		gui.frm_main.search.search.__operators = op;
		gui.frm_main.search.search.__hints = hints;
	};

	this.tabs.room._onclick = function(e, elm){
		if (this.tabs && this._parent._parent._main.offsetWidth<1100 && !this.tabs._main.contains(elm)){ //!hascss(this._main, 'fixed')
			var t = this.tabs._value();
			if (t){
				this.tabs[t] && this.tabs[t].__deactive(true);
				this.tabs._value('');
			}
		}
	};

	this.__global_context_menu = function(e) {
		this.cmenu && this.cmenu._destruct();
		if(e.target !== this._getAnchor('main')) {
			return false;
		}
		e.cancelBubble = true;
		e.preventDefault();
		if (e.stopPropagation)
			e.stopPropagation();

		var aMenu = [];

		if (me.__input_menu_handlers['word'] || me.__input_menu_handlers['excel'] || me.__input_menu_handlers['ppoint'] || me.__input_menu_handlers['note']) {
			aMenu.push({'title': 'CHAT::CREATE_NEW_DOCUMENT', css: 'ico2 file', nodes: [
					me.__input_menu_handlers['word'] ? {'title': 'main_menu::new_word', 'arg': {'method': 'word'}, css: 'ico2 word'} : false,
					me.__input_menu_handlers['excel'] ? {'title': 'main_menu::new_excel', 'arg': {'method': 'excel'}, css: 'ico2 excel'} : false,
					me.__input_menu_handlers['ppoint'] ? {'title': 'main_menu::new_ppoint', 'arg': {'method': 'ppoint'}, css: 'ico2 ppoint'} : false,
					me.__input_menu_handlers['note'] ? {'title': 'main_menu::new_note', 'arg': {'method': 'note'}, css: 'ico2 note'} : false
			].filter(Boolean)});
		}

		if (me.__input_menu_handlers['attach']) {
			aMenu.push({'title': 'CHAT::SHARE_FILE_OR_DOCUMENT', 'arg': {'method': 'attach'}, css: 'ico2 attach'});
		}

		if (me.__input_menu_handlers['code']) {
			aMenu.push({'title': 'INSERT_CODE::TITLE', 'arg': {'method': 'code'}, css: 'ico2 code'});
		}

		if (me.__input_menu_handlers['conference']) {
			aMenu.push({'title': 'CHAT::NEW_CONFERENCE', 'arg': {'method': 'conference'}, css: 'ico2 conference', disabled: !sPrimaryAccountCONFERENCE});
		}

		if (me.__input_menu_handlers['event'])
			aMenu.push({'title': 'IM::NEW_EVENT', 'arg': {'method': 'event'}, css: 'ico2 event'});

		if (me.__input_menu_handlers['email'])
			aMenu.push({'title': 'CHAT::NEW_EMAIL', 'arg': {'method': 'email'}, css: 'ico2 email'});

		if (me.__input_menu_handlers['geo'])
			aMenu.push({'title': 'IM::GEO', 'arg': {'method': 'geo'}, css: 'ico2 geo', disabled: !("geolocation" in navigator) || !GWOthers.getItem('EXTERNAL_SETTINGS', 'google_maps_api_key')});

		addcss(this._main, 'color1');

		this.cmenu = gui._create("cmenu", "obj_context", '', 'obj_chat_input_add', this);
		this.cmenu._fill(aMenu);
		this.cmenu._place(e.clientX, e.clientY, null, 2);

		var btn = this;
		this.cmenu._obeyEvent('destructed', [function () {
				removecss(btn._main, 'color1');
			}]);

		//var me = this;
		this.cmenu._onclick = function (e, elm, id, arg) {
			if (arg.method && me.__input_menu_handlers && me.__input_menu_handlers[arg.method])
				executeCallbackFunction(me.__input_menu_handlers[arg.method]);
			else
				executeCallbackFunction(arg);
		};
	}

	//// TOOLBAR ////
	this._create('toolbar', 'obj_chat_toolbar');

	//// CHAT ////
	this.tabs.room.list._onclick = function(e, elm){
		var id;

		//Send mail
		if (hascss(elm, 'mailto')){
			var email = elm.getAttribute('rel');
			if (email)
				Item.sendEmailTo(email);
		}
		else
		if (elm.tagName == 'SPAN'){

			if (hascss(elm, 'mention') && (id = elm.getAttribute('rel'))){
				var addr = MailAddress.splitEmailsAndNames(id);
				if ((addr = addr[0]) && addr.email){
					me.text.input._addMention(addr);
					//me.text._private(addr.name, addr.email);
				}
			}
			else{
				//var sec, aData;
				if (hascss(elm, 'private_msg')){

					var sMail = elm.getAttribute('rel');
					if (sMail){
						var addr = MailAddress.splitEmailsAndNames(sMail.urlDecode());
						if (addr && addr[0]){

							this.__options.autoscroll = false;

							var pos = getSize(elm),
							cmenu = gui._create('cmenu', 'obj_context_link','','',addr[0].name, addr[0].email);
							cmenu._place(pos.x+pos.w,pos.y+(pos.h/2));
							cmenu._onclose = function(){
								this.__options.autoscroll = true;
								return true;
							}.bind(this);

							e.cancelBubble = true;
							if (e.stopPropagation) e.stopPropagation();
						}
					}

					/*
					else
					if ((sec = Is.Child(elm,'SECTION', this._main)) && (id = sec.getAttribute('rel')) && this.__aData[id] && (aData = this.__aData[id].data)){

						//from private
						var linkextras;
						if (aData.EVNLINKEXTRAS && (linkextras = parseURL(aData.EVNLINKEXTRAS))){

							sMail = elm.getAttribute('rel');
							if (sMail && linkextras.AccountEmail && linkextras.AccountEmail == sMail){
								if (linkextras.AccountEmail != sPrimaryAccount)
									me.text._private(linkextras.AccountName, linkextras.AccountEmail);
								return;
							}
							else
							if (aData.EVNCLASS == 'S' && linkextras.organizer){
								if (linkextras.organizer != sPrimaryAccount)
									me.text._private(linkextras.organizer_name || linkextras.organizer, linkextras.organizer);
								return;
							}
							// else
							// if (linkextras.AccountEmail && aData.EVNMODIFIEDOWNEREMAIL != sPrimaryAccount){ // && sPrimaryAccountGUEST!=1
							// 	me.text._private(aData.EVNMODIFIEDOWNERNAME, aData.EVNMODIFIEDOWNEREMAIL);
							// 	return;
							// }
						}

						//from normal
						if (aData.EVNMODIFIEDOWNEREMAIL != sPrimaryAccount)
							me.text._private(aData.EVNMODIFIEDOWNERNAME, aData.EVNMODIFIEDOWNEREMAIL);
					}
					*/
				}
				else
				if (hascss(elm, 'show_gpins')){
					me.panel._value('pins');
					me.panel.pins.btn_switch._value(1);

					e.cancelBubble = true;
					if (e.stopPropagation) e.stopPropagation();
				}
			}
		}
		else
		if (elm.tagName == 'A' && elm.protocol === 'mailto:'){
			e.preventDefault();
			NewMessage.compose({to:elm.pathname});
			return false;
		}
	};

	//Add DOT to PINS
	this.tabs.room.list._onresponse = function(aPath, aAttr){
		if (!this._destructed && this.__aid == aPath.aid && this.__fid == aPath.fid){

			if (aAttr && Is.Defined(aAttr.LAST_PINNED_ITEM)){

				this.__lastPin = {aid: this.__aid, fid:this.__fid, time:parseInt(aAttr.LAST_PINNED_ITEM || 0)};

				if (parseInt(Cookie.get(['folders', this.__aid, this.__fid, 'gpin']) || 0) < parseInt(aAttr.LAST_PINNED_ITEM || 0)){
					if (this.panel && this.panel._value() == 'pins' && this.panel.pins.btn_switch._value() == '1')
						Cookie.set(['folders', this.__aid, this.__aid, 'gpin'], aAttr.LAST_PINNED_ITEM);
					else
						addcss(this._main, 'gpin');

					return;
				}
			}

			removecss(this._main, 'gpin');
		}

	}.bind(this);

	this.tabs.room.list._oncontext = function(e, eTarget){
		var id, aData, elm;

		if ((elm = Is.Child(eTarget,'SECTION', this._main)) && (id = elm.getAttribute('rel')) && this.__aData[id] && this.__aData[id].obj){

			if (eTarget.tagName == 'A' && eTarget.protocol === 'mailto:'){
				e.preventDefault();
				e.stopPropagation();

				var pos = getSize(eTarget),
					cmenu = gui._create('cmenu', 'obj_context_link','','','', eTarget.pathname);
					cmenu._place(pos.x+pos.w,pos.y+(pos.h/2));

				return false;
			}

			//Use system contextmenu on selections
			if (window.getSelection) {
				var sel = window.getSelection();
				if (!sel.isCollapsed && sel.rangeCount)
					for(var range, i = 0; i<sel.rangeCount; i++){
						range = sel.getRangeAt(i);
						if (!range.isCollapsed && Is.Child(range.commonAncestorContainer || range.startContainer, this._main))
							return true;
					}
			}

 			aData = this.__aData[id].obj.__aData;

 			//Traverse data for comment-source
 			if (aData.EVNCOMEVNID && this.__aData[id].obj.item){
				if (Is.Child(eTarget,this.__aData[id].obj.item._main.parentElement, this._main)){
					elm = this.__aData[id].obj.item._main.parentElement;
					aData = this.__aData[id].obj.item.__aData;
				}
 			}

			addcss(elm,'active2');

			var arr = [];
			var linkextras = aData.EVNLINKEXTRAS ? parseURL(aData.EVNLINKEXTRAS) : {};
			if (Item.officeSupport(linkextras.EvnTitle)) {
				var iid = (aData.EVNLINKID.indexOf('*') === 0 ? '' : '*') + aData.EVNLINKID;

				var aArgAuto = [Item.officeOpen, [{aid: aData.aid, fid: aData.fid, iid: iid}, [Item.downloadFile, [aData.aid, aData.fid, iid]], Path.extension(linkextras.EvnTitle)]];
				var aArgWeb = [Item.officeOpen, [{aid: aData.aid, fid: aData.fid, iid: iid}, [Item.downloadFile, [aData.aid, aData.fid, iid]], Path.extension(linkextras.EvnTitle)]];
				var aArgWebView = [Item.officeOpen, [{aid: aData.aid, fid: aData.fid, iid: iid}, [Item.downloadFile, [aData.aid, aData.fid, iid]], Path.extension(linkextras.EvnTitle), 'view']];
				var aArgExt = [Item.officeOpen, [{aid: aData.aid, fid: aData.fid, iid: iid}, [Item.downloadFile, [aData.aid, aData.fid, iid]], Path.extension(linkextras.EvnTitle), 'external']];
				var bIWD =  dataSet.get('accounts', [sPrimaryAccount, 'OFFICE_SUPPORT']) == 'true';

				arr.push({
					title: 'POPUP_ITEMS::OPEN',
					arg: aArgAuto,
					'nodes': [
						{"title": 'DOCUMENT::OPENDOCUMENT', 'arg': aArgWeb, disabled: !bIWD},
						{"title": 'DOCUMENT::OPENDOCUMENTVIEW', 'arg': aArgWebView, disabled: !bIWD},
						{"title": 'OFFICELAUNCHER::OFFICESUITE', 'arg': aArgExt}
					]
				});

			}

			if(aData.EVNCLASS === 'R') {
				linkextras.EvnTicket && arr.push({
					title: 'POPUP_ITEMS::DOWNLOAD_FILE',
					arg: [function () {
						downloadItem(linkextras.EvnTicket, true);
					}]
				}, {
					title: 'MAIN_MENU::SHARE',
					arg: [function () {
						this.__aData[id].obj._share(aData);
					}.bind(this)]
				});
			} else if (aData.EVNURL) {
				arr.push({
					title: 'POPUP_ITEMS::OPEN',
					arg: [function () {
						window.open(aData.EVNURL);
					}]
				});
			}

			if (arr.length)
				arr.push({title: '-'});

			arr.push({
				title: 'IM::QUOTE',
				arg: [function () {
					me.text.input._value('"' + aData.EVNNOTE + '" ');
					me.text.input._focus();
				}],
				disabled: !aData.EVNNOTE || !WMFolders.getAccess({aid: me.__aid, fid: me.__fid}, 'write')
			});

			if (aData.EVNCLASS != 'Q' && aData.iid &&  aData.EVNLINKTYPE!='10' && (aData.EVNCLASS != 'W' || aData.EVNLINKTYPE == '5')){
				arr.push({title:'FORM_BUTTONS::EDIT', arg:[function(){
					gui.frm_main.main.tabs.room.list._edit(aData.iid);
				}], disabled:!(aData.EVNOWNEREMAIL == sPrimaryAccount || WMFolders.getAccess({aid:me.__aid, fid:me.__fid},'modify'))});
			}

			arr.push(
				{title:'-'},
				{title:'FORM_BUTTONS::REMOVE', css:'color2', arg:[function(){ me._remove(aData, elm) }], disabled: !(aData.EVNOWNEREMAIL == sPrimaryAccount || WMFolders.getAccess({aid:me.__aid, fid:me.__fid},'remove'))}
			);

			var cmenu = gui._create("cmenu","obj_context",'','');
			cmenu._fill(arr);
			cmenu._place(e.clientX, e.clientY);

			cmenu._onclose = function(){
				removecss(elm,'active2');
			};

			return false;
		} else {
			me.__global_context_menu.call(this, e);
		}
	};

	// MENTIONS
	this.panel.mentions._onactive = function(bFirst){
		removecss(me._main, 'mention');
		if (bFirst){

			this._draw('frm_main_chat_room_mentions','main');
			this._getAnchor('close').onclick = function(){
				this.__deactive();
			}.bind(this);

			this.list.__options.type = 'mentions';
			this.list._placeholder('CHAT::NOMENTIONS');
			this.list._serverSort({aid:me.__aid, fid:me.__fid}, true);

			this.list._onclick = function(e, elm){
				var sec = Is.Child(elm ,'SECTION', this._main);
				if (sec){
					var aData, id = sec.getAttribute('rel');
					if (this.__aData[id] && (aData = this.__aData[id].data)){
						me.tabs._value('room');
						me.tabs.room.list._serverSort({aid:aData.aid, fid:aData.fid}, false, {until:aData.iid, highlight:true});
					}
				}
			};
		}

	};

	this.tabs.room.list._obeyEvent('onnotify', [function(e, arg){
		if (!arg.data) {
			return;
		}
		switch (arg.data.ACTION) {
		case 'add_pin':
		case 'add_global_pin':
			if (arg.data.SERVICE == "GW" && arg.data.ACTION == "add_global_pin") {
				if (this.panel && (this.panel._value() != 'pins' || this.panel.pins.btn_switch._value() != '1'))
					addcss(this._main, 'gpin');
				else
					Cookie.set(['folders', this.__aid, this.__fid, 'gpin'], arg.data.BODY);
			}

			removecss(this._main, 'newpin');
			setTimeout(function (fid) {
				if (this._main && fid == this.__fid) {
					addcss(this._main, 'newpin');
					setTimeout(function (fid) {
						if (this._main && fid == this.__fid)
							removecss(this._main, 'newpin');
					}.bind(this, this.__fid), 1000);
				}
			}.bind(this, this.__fid), 100);
			break;
		case 'add':
			if (arg.data.MENTIONS) {
				var mentions = parseParamLine(arg.data.MENTIONS);
				if(mentions[0].values.EMAIL === sPrimaryAccount) {
					if (this.panel && this.panel._value() != 'mentions')
						addcss(this._main, 'mention');
					removecss(this._main, 'newmention');
					setTimeout(function (fid) {
						if (this._main && fid == this.__fid) {
							addcss(this._main, 'newmention');
							setTimeout(function (fid) {
								if (this._main && fid == this.__fid)
									removecss(this._main, 'newmention');
							}.bind(this, this.__fid), 1000);
						}
					}.bind(this, this.__fid), 100);
				}
			}

			//Update files tab on local upload
			if (!arg.data.SERVICE){
				if (arg.data['ITEM-TYPE'] == 'R')
					this._serverSort('files');

				if (arg.data['ITEM-TYPE'] == 'Q')
					this._serverSort('events');
			}

			break;
		case 'mention':
			if(arg.data.BODY === sPrimaryAccount) {
				if (this.panel && this.panel._value() != 'mentions')
					addcss(this._main, 'mention');
				removecss(this._main, 'newmention');
				setTimeout(function (fid) {
					if (this._main && fid == this.__fid) {
						addcss(this._main, 'newmention');
						setTimeout(function (fid) {
							if (this._main && fid == this.__fid)
								removecss(this._main, 'newmention');
						}.bind(this, this.__fid), 1000);
					}
				}.bind(this, this.__fid), 100);
			}
			break;
		}
	}.bind(this)]);

	this.panel.pins._onactive = function(bFirst){
		if (bFirst){

			this._draw('frm_main_chat_room_pins','main');

			this._getAnchor('close').onclick = function(){
				this.__deactive();
			}.bind(this);

			this.list._placeholder('CHAT::NOPINS');

			this.btn_switch._fill(['SHARING::PUBLIC','SHARING::PRIVATE']);
			this.btn_switch._onchange = function(){
				this.list.__options.type = this.btn_switch._value() == '1'?'global_pins':'my_pins';

				this.list._serverSort({aid:me.__aid, fid:me.__fid}, true, {search:gui.frm_main.search._value()});

				//Update PIN state
				if (this.btn_switch._value() == '1'){

					if (me.__lastPin && me.__lastPin.aid == me.__aid && me.__lastPin.fid == me.__fid && parseInt(Cookie.get(['folders', me.__aid, me.__fid, 'gpin']) || 0) < parseInt(me.__lastPin.time || 0))
						Cookie.set(['folders', me.__aid, me.__fid, 'gpin'], me.__lastPin.time || '');

					removecss(me._main, 'gpin');
				}

				Cookie.set(['folders', me.__aid, me.__fid, 'tab'], this.btn_switch._value() == '1'?'pins':'local');

			}.bind(this);

			this.btn_switch._value(Cookie.get(['folders', me.__aid, me.__fid, 'tab']) == 'local'?'2':'1');

			this.list._onclick = function(e, elm){
				var sec = Is.Child(elm ,'SECTION', this._main);
				if (sec){
					var aData, id = sec.getAttribute('rel');
					if (this.__aData[id] && (aData = this.__aData[id].data)){
						me.tabs._value('room');
						me.tabs.room.list._serverSort({aid:aData.aid, fid:aData.fid}, false, {until:aData.iid, highlight:true, search:me.tabs.room.list.__aRequestData.filter?me.tabs.room.list.__aRequestData.filter.search:''});
					}
				}
			};
		}
		else
		if (gui.frm_main.search._value() != this.list._search())
			this.list._search(gui.frm_main.search._value());

		//Update PIN state
		if (this.btn_switch._value() == '1'){

			if (me.__lastPin && me.__lastPin.aid == me.__aid && me.__lastPin.fid == me.__fid && parseInt(Cookie.get(['folders', me.__aid, me.__fid, 'gpin']) || 0) < parseInt(me.__lastPin.time || 0))
				Cookie.set(['folders', me.__aid, me.__fid, 'gpin'], me.__lastPin.time || '');

			removecss(me._main, 'gpin');
		}
	};

	this.panel._onchange = function(sTab){
		if (sTab){
			addcss(this._parent._main, 'show');

			if (sTab == 'pins' && this.pins.btn_switch._value() == '2')
				sTab = 'local';

			Cookie.set(['folders', me.__aid, me.__fid, 'tab'], sTab);
		}
		else{

			if (!this._value())
				removecss(this._parent._main, 'show');

			Cookie.set(['folders', me.__aid, me.__fid, 'tab']);
		}
	};

	//// FILES ////
	this.tabs.files._onactive = function (bFirstTime) {
		if (bFirstTime){

			//SORT
			this.sort._fillMe = function(){

				var sType = Cookie.get(['folders', me.__aid, me.__fid, 'files', 'sort']) || 'EVN_MODIFIED',
					sSort = Cookie.get(['folders', me.__aid, me.__fid, 'files', 'sortdir']) || 'desc';

				var a = [{
						html: getLang('SORT::SORT_BY') + ':',
						css: 'label'
					},
					{
						title: '',
						css: 'obj_context',
						nodetype: 'click',
						nodes: [{
								title: 'CHAT::SORT_NAME',
								arg: ['EVNTITLE']
							},
							{
								title: 'CHAT::SORT_DATE',
								arg: ['EVN_MODIFIED']
							},
							{
								title: 'CHAT::SORT_SIZE',
								arg: ['EVNCOMPLETE']
							},
							{
								title: '-'
							},
							{
								title: ({
									EVNTITLE: 'SORT::EVNTITLE_ASC',
									EVN_MODIFIED: 'SORT::DATE_ASC',
									EVNCOMPLETE: 'SORT::SIZE_ASC'
								})[sType],
								arg: ['', 'asc']
							},
							{
								title: ({
									EVNTITLE: 'SORT::EVNTITLE_DESC',
									EVN_MODIFIED: 'SORT::DATE_DESC',
									EVNCOMPLETE: 'SORT::SIZE_DESC'
								})[sType],
								arg: ['', 'desc']
							}
						]
					}
				];

				a[1].nodes.map(function(v){
					if (v.arg){
						v.css = "ico2";

						if (v.arg[0]){
							if (v.arg[0] == sType){
								v.css += " check";
								a[1].title = v.title;
							}

							v.arg[1] = sSort;
						}
						else{
							if (v.arg[1] == sSort){
								v.css += " check";
							}

							v.arg[0] = sType;
						}
					}
				});

				this._fill(a, 'static');
			};

			this.sort._onclick = function(e, elm, id, arg){
				Cookie.set(['folders', me.__aid, me.__fid, 'files', 'sort'], arg[0]);
				Cookie.set(['folders', me.__aid, me.__fid, 'files', 'sortdir'], arg[1]);
				this.list._serverSort({aid: me.__aid, fid: me.__fid}, me.__updateTab[this._name], true);
				this.sort._fillMe();
			}.bind(this);

			this.sort._fillMe();
		}

		this.list._serverSort({aid:me.__aid, fid:me.__fid}, me.__updateTab[this._name], {
			search: GWOthers.getItem('LAYOUT_SETTINGS','keep_search') == '1' ? gui.frm_main.search._value() : ''
		});

		var old_oncontext = this.list._oncontext;
		this.list._oncontext = function(e, elm) {
			e.preventDefault();
			if (me.__global_context_menu.call(this.list, e, elm) === false && old_oncontext) {
				old_oncontext.call(this.list, e, elm);
			};
		}.bind(this);
	};

	//// EVENTS ////
	this.tabs.events._onactive = function (bFirstTime) {
		this.list._serverSort({aid:me.__aid, fid:me.__fid}, me.__updateTab[this._name], {
			search: GWOthers.getItem('LAYOUT_SETTINGS','keep_search') == '1' ? gui.frm_main.search._value() : ''
		});
		var old_oncontext = this.list._oncontext;
		this.list._oncontext = function(e, elm) {
			e.preventDefault();
			if (me.__global_context_menu.call(this.list, e, elm) === false && old_oncontext) {
				old_oncontext.call(this.list, e, elm);
			};
		}.bind(this);
	};

	//MEMBERS
	this.tabs.members._onactive = function (bFirstTime) {
		if (bFirstTime){
			this.list._onclick = function(e, elm){
				var sec = Is.Child(elm ,'SECTION', this._main);
				if (sec){

					var aData, id = sec.getAttribute('rel');

					if (this.__aData[id] && (aData = this.__aData[id].data))
						if (hascss(elm, 'mailto'))
							Item.sendEmailTo(aData.FRTEMAIL);
						else
						if (hascss(elm, 'im')){
							if (sPrimaryAccountIM && aData.FRTEMAIL && gui.frm_main.im && gui.frm_main.im._status != 'offline')
								gui.frm_main.im._chat(aData.FRTEMAIL);
						}
						else
						if (hascss(elm, 'remove')){
							gui._create('gchat_remove','frm_confirm','','',[function(){
								me._removeMember(aData, sec);
							}], 'IM::REMOVE', 'CHAT::REMOVE_ACCOUNT', [aData.FRTNAME || aData.FRTEMAIL]);

						}
						else
							me.text.input._addMention({name:aData.FRTNAME, email:aData.FRTEMAIL});

				}

			};

		}

		this.list._serverSort({aid:me.__aid, fid:me.__fid}, me.__updateTab[this._name], {
			search: GWOthers.getItem('LAYOUT_SETTINGS','keep_search') == '1' ? gui.frm_main.search._value() : ''
		});
		var old_oncontext = this.list._oncontext;
		this.list._oncontext = function(e, elm) {
			e.preventDefault();
			if (me.__global_context_menu.call(this.list, e, elm) === false && old_oncontext) {
				old_oncontext.call(this.list, e, elm);
			};
		}.bind(this);
	};

	//ROOM
	this.tabs.room._onactive = function (bFirstTime){
		this.list._serverSort({aid:me.__aid, fid:me.__fid}, false, {
			search: GWOthers.getItem('LAYOUT_SETTINGS','keep_search') == '1' ? gui.frm_main.search._value() : ''
		});
		me.text._focus();
	};

	//RESPONSIVE LAYOUT
	gui._obeyEvent('resize',[this, '__resizeHandler']);
	this.__resizeHandler();
};

_me._message = function(sBody, aArgs, aPrivate){
	if (this.__aid && this.__fid){

		//Update Recent Position
		var active_folder = dataSet.get('active_folder'),
			recent = Cookie.get(['recent']) || [],
			index = recent.indexOf(active_folder);

		!!~index && recent.splice(index, 1);
		recent.unshift(active_folder);
		Cookie.set(['recent'], recent);

		//Message
		var aItemInfo = {
			values:{
				EVNNOTE: sBody,
				EVNSHARETYPE: 'U'
			}
		};

		//Private mode
		if (aPrivate){
			aItemInfo.values.EVNSHARETYPE = 'C';
			aItemInfo.values.EVNLINKID  = aPrivate.email;
		}

		//Extesions
		if (aArgs){
			//Add link
			if (aArgs.url)
				aItemInfo.values.EVNURL = aArgs.url;

			//Message with link
			if (aArgs.title)
				aItemInfo.values.EVNTITLE = aArgs.title;
			if (aArgs.desc)
				aItemInfo.values.EVNLOCATION = aArgs.desc;
			if (aArgs.thumbnailimageid)
				aItemInfo.values.THUMBNAILIMAGEID = aArgs.thumbnailimageid;

			var info = {};
			if (aArgs.type)	info.type = aArgs.type;
			if (aArgs.videourl) info.videourl = aArgs.videourl;
			if (aArgs.videotype) info.videotype = aArgs.videotype;
			if (!Is.Empty(info))
				aItemInfo.values.LINKINFO = buildURL(info);

			//Comment message
			if (aArgs.comevnid)
				aItemInfo.values.EVNCOMEVNID = aArgs.comevnid;
		}

		aArgs = aArgs || {};
		aArgs.aid = this.__aid;
		aArgs.fid = this.__fid;

		//Sent to server
		WMItems.add([this.__aid,this.__fid], aItemInfo,'','','', [this,'_response',[sBody, aArgs, aPrivate]]);
	}

};

_me._remove = function(aData, elm){
	var me = this;
	WMItems.remove({aid:aData.aid, fid:aData.fid, iid:[aData.iid]},'','','',[function(bOK){
		if (bOK && me.__aid == aData.aid && me.__fid == aData.fid){
			if (elm && elm.id){
				var id = elm.id.substr(elm.id.lastIndexOf('#')+1);
				me.tabs.room.list._remove(id, aData.iid);
			}
		}
	}]);
};

_me._removeMember = function(aData, elm){
	var me = this,
		aItemInfo = {
			aid:aData.aid,
			fid:aData.fid.replace(/^__@@GROUP@@__\//gi,''),
			xmlarray:{ACCOUNT:[{VALUE:WMItems.__serverID(aData.iid)}]}
		};

	WMFolders.action(aItemInfo,'','','remove_member','',[function(bOK){
		if (bOK && me.__aid == aData.aid && '__@@GROUP@@__/'+me.__fid == aData.fid){
			if (elm && elm.id){
				var id = elm.id.substr(elm.id.lastIndexOf('#')+1);

				if (me.tabs.members)
					me.tabs.members.list._remove(id, aData.iid);

				//Notification
			}
		}
		else{
			// Error
		}
	}]);

};

/**
 * @Note: funkce ktera zobrazuje a skryva quicksearch toolbar
 * @Date: 28.5.2007 11:39:16
 **/
_me._showsearch = function(aFolder,bFocus,sFilter){
	if (aFolder){

		if (this.__aid && this.__fid && (this.__aid!=aFolder.aid || this.__fid != aFolder.fid)){

		 	if (this.tabs && this.tabs.room && this.tabs.room._wasActivated){

		 		//close comment window
		 		if (this.comment && !this.comment._destructed)
		 			this.comment._destruct();

			 	if (this.tabs._value()!='room'){
					var t = ['room','files','events','members'];
					for(var i = t.length-1;i>=0;i--)
						if (this.tabs && this.tabs[t[i]] && this.tabs[t[i]]._wasActivated && this.tabs[t[i]].list)
							this.tabs[t[i]].list._clear();
				}
			}
		}

		this.__aid = aFolder.aid;
		this.__fid = aFolder.fid;

		//Remember last chat folder
		Cookie.set(['last','I'], this.__aid+'/'+this.__fid);

		//// TOOLBAR ////
		//this._create('toolbar', 'obj_chat_toolbar', '', '', aFolder);

		this.toolbar._setFolder(aFolder);

		//Handle search
		gui.frm_main.search._setFolder(aFolder);
		// gui.frm_main.search._deactivate();

		//set proper search hints
		// if (this.tabs._value() !== 'room' && this.tabs._onchange)
		// 	this.tabs._onchange(this.tabs._value());

		var me = this;
		gui.frm_main.search._onsearch = function(v){
			if (me.tabs){
				var tab = me.tabs[me.tabs._value()];

				//Search in main list
				if (tab.list && tab.list._search)
					tab.list._search(v);

				//Search in Pins / Mentions
				if (me.panel._value() && (tab = me.panel[me.panel._value()]))
					tab.list._search(v);
			}
		};

		this.text._disabled(!WMFolders.getRights(aFolder,'write'));

		if (this.panel){
			//Clean tabs
			var	obj = this.panel._getChildObjects('','obj_tab_core');
			for (var tab in obj){
				if ((tab = obj[tab]._name) && this.panel[tab] && this.panel[tab].list){
					if (this.panel[tab] && this.panel[tab]._wasActivated){
						this.panel[tab]._clean();
						this.panel[tab]._wasActivated = false;
					}
				}
			}
			//Open default tab
			switch(Cookie.get(['folders', this.__aid, this.__fid, 'tab'])){
				case 'pins':
				case 'local':
					this.panel._value('pins');
					break;
				case 'mentions':
					this.panel._value('mentions');
					break;
				default:
					var t = this.panel._value();
					this.panel[t] && this.panel[t].__deactive(true);
					this.panel._value('');
			}
		}

		if (this.tabs._value()!='room')
			this.tabs._value('room');

		gui.frm_main.search._focus(bFocus);
	}

	//clear text input
	this.text._folder(aFolder);
	this.text.input._value(dataSet.get('teamchat', [aFolder.fid, 'input']) || '');
	this.text._focus();
	removecss(this._main, 'mention');
	removecss(this._main, 'gpin');

	//open comment
	if (dataSet.get('teamchat', [aFolder.fid, 'comment'])){

		var iid = dataSet.get('teamchat', [aFolder.fid, 'comment']),
		aItemsInfo = {aid:aFolder.aid, fid:aFolder.fid, iid:iid};

		WMItems.list(aItemsInfo,'','','',[function(aData){
			if (aData && (aData = aData[aFolder.aid]) && (aData = aData[aFolder.fid]) && (aData = aData[iid])){
				aData.iid = iid;
				gui.frm_main.main._create('comment', 'frm_comment','','', aData);
			}
			else
				dataSet.remove('teamchat', [aFolder.fid]);
		}]);
	}

};

_me._response = function(bOK, arg, sBody, aArgs, aPrivate){

	if (bOK && !this._destructed && aArgs && aArgs.aid === this.__aid && aArgs.fid === this.__fid){

		//Add temporary mssg
		var x;
		if (arg.id && arg.xml && (x = arg.xml.IQ) && (x = x[0].RESULT) && (x = x[0])){

			var aData = {
				id:WMItems.__clientID(arg.id),
				body:sBody,
				timestamp: x.EVN_CREATED?x.EVN_CREATED[0].VALUE:0
			};

			objConcat(aData,aArgs);

			if (aArgs.mentions){
				//Fire add_mention event
				for(var m in aData.mentions)
					if (m == sPrimaryAccount && this.tabs.room.list){
						this.tabs.room.list._fire(arg.id, 'add_mention', {'ITEM-TYPE':'I'}, true);
						break;
					}
			}

			if (aPrivate){
				aData.share = 'C';
				aData.contact_name = aPrivate.name || aPrivate.email;
				aData.contact_email = aPrivate.email;
			}

			//Focus to room tab
			if (this.tabs._value() != 'room')
				this.tabs._value('room');
			else{
				this.tabs.room.list._add_message(aData);
				this._serverSort('room');
			}
		}
	}
};



_me._serverSort = function(sType){

	if (!sType || this.tabs._value() == 'room' || this.tabs._value() == sType){

		if (this.__getFolder()){

			var tab = this.tabs[this.tabs._value()];

			if (this.tabs._value() == 'room'){
				var lastID = dataSet.get('teamchat', ['forced_last_read_id']) || Folder.lastId({aid:this.__aid, fid:this.__fid}) || '0';
				if (tab.list.__aRequestData.counter) {
					dataSet.remove('teamchat', ['forced_last_read_id']);
				}

				if (!tab.list.__aRequestData.folder || tab.list.__aRequestData.folder.aid!=this.__aid || tab.list.__aRequestData.folder.fid!=this.__fid)
					tab.list._serverSort({aid:this.__aid, fid:this.__fid}, this.tabs._value() == sType, {
						until:WMItems.__clientID(lastID),
						search: GWOthers.getItem('LAYOUT_SETTINGS','keep_search') == '1' ? gui.frm_main.search._value() : ''
					});
				else
					tab.list._serverSort({aid:this.__aid, fid:this.__fid}, this.tabs._value() == sType, {
						search: GWOthers.getItem('LAYOUT_SETTINGS','keep_search') == '1' ? gui.frm_main.search._value() : ''
					});
			}
			else
			if (tab._onactive){
				this.__updateTab[tab._name] = true;
				tab._onactive();
			}
			this._main.style.display = '';
		} else {
			this._main.style.display = 'none';
		}
	}

	//Auto-Check Notify
	if (this.tabs && this.tabs.room) {
		if (this.tabs.notify) {
			var value = +dataSet.get('folders', [this.__aid, this.__fid, 'NOTIFY']) > 0;
			this.tabs.notify._value(value, true);
		}
	}

	if (sType && this.tabs._value() != sType)
		this.__updateTab[sType] = true;

};

_me.__getFolder = function(){
	//Check folder type
	return this.__aid == sPrimaryAccount && this.__fid && WMFolders.getType([this.__aid, this.__fid]) == 'I';
};

// Global Actions

_me._addEvent = function(comevnid){
	if (this.__aid && this.__fid){
		var aOut = getActualEventTime();

		if (comevnid)
			aOut.EVNCOMEVNID = comevnid;

		Item.openwindow([this.__aid, this.__fid], aOut, null, 'E', [function(bOK, aData){
			if (bOK && !this._destructed && this.tabs && this.tabs.room && this.tabs.room.list){
				this.tabs.room.list._fire(aData.id, 'add', {'ITEM-TYPE':'Q'});
				this.tabs.room.list._fire(aData.id, 'add', {'ITEM-TYPE':'E'});
			}
		}.bind(this)]);
	}
};

_me._addEmail = function(){
	var name = dataSet.get('folders', [this.__aid, this.__fid, 'NAME']) || dataSet.get('folders', [this.__aid, this.__fid, 'RELATIVE_PATH']);
	NewMessage.compose({teamchat:this.__fid + '::' + this.__fid.split('/')[0] + '/' + name});
};

_me._manageMember = function(){
	if (this.__aid && this.__fid)
		gui._create('frm_sharing', 'frm_sharing', '', ~['I', 'Y'].indexOf(WMFolders.getType({aid: this.__aid, fid: this.__fid})) ? 'teamchat_folder' : '', [function(bOK){
			if (bOK)
				me._serverSort('members');
		}], {aid:this.__aid,fid:this.__fid});
};

_me._addMember = function(){
	if (this.__aid && this.__fid){
		gui._create('invite','frm_groupchat_invite','','',{aid:this.__aid, fid:this.__fid},[function(){
			gui.notifier._value({type: 'success', args: {text: 'CHAT::INVITATION_SENT'}});
			this._serverSort('members');
		}.bind(this)]);
	}
};

_me._sendEmail = function(){
	if (this.__aid || this.__fid){
		var name = dataSet.get('folders', [this.__aid, this.__fid, 'NAME']) || dataSet.get('folders', [this.__aid, this.__fid, 'RELATIVE_PATH']),
			newMessage = new NewMessage();
			newMessage.addSignature();
			newMessage.sTo = '[' + this.__fid + '::' + name + ']';
			newMessage.sSubject = '';

		gui._create('frm_compose', 'frm_compose', '', '', newMessage);
	}
};

_me._word = function(){
	this.__createNewGW('F', '.docx');
};
_me._excel = function(){
	this.__createNewGW('F', '.xlsx');
};
_me._ppoint = function(){
	this.__createNewGW('F', '.pptx');
};
_me._note = function(){
	this.__createNewGW('N');
};

_me._code = function () {
	gui._create('insert_code', 'frm_insert_code', '', '', [function (sBody) {
		this._message(sBody);
	}.bind(this)]);
};

_me.__createNewGW = function (sType, sDoc) {
	var aActive = gui.frm_main.bar.tree.folders._getActive(),
		sFolder, sAccount, bActual = false;

	// Pokud je aktualni folder stejneho typu, jako vytvarena polozka, bude vytvorena
	// v danem folderu, jinak se vezme defaultni folder pro dany typ polozky
	if (aActive[0] != '' || aActive[1] != '') {
		var sFolType = WMFolders.getType(aActive);
		if (sType == sFolType || (sType == 'L' && sFolType == 'C') || ((sType == 'F' || sType == 'N') && (sFolType == 'I' || sFolType == 'Y')))
			bActual = true;
	}

	if (bActual) {
		sAccount = aActive[0];
		sFolder = aActive[1];
	} else {
		sAccount = sPrimaryAccount;
		sFolder = Mapping.getDefaultFolderForGWType(sType);
	}

	if (sType == 'E')
		Item.openwindow([sAccount, sFolder], getActualEventTime(), null, 'E');
	else {
		var aValues;
		if (sDoc)
			aValues = {'ATTACHMENTS': [{'values': {'ATTTYPE': 'document', 'ATTDESC': sDoc}}]};

		Item.openwindow([sAccount, sFolder], aValues, null, sType, (sType === 'F' || sType === 'N') ? [function (bOK, aData) {
			var me = gui.frm_main.main;
			if (bOK && me.tabs && me.tabs.room) {
				me.tabs.room.list._fire(aData.id, 'add', {'ITEM-TYPE': 'R'}) || me._serverSort('');
			}
		}] : false, null, sType === 'F');
	}
};

_me._attachFile = function(){
	// In case "Attach from webclient" is disabled, just show browser upload dialog
	if ('1' === GWOthers.getItem('RESTRICTIONS', 'disable_attach_item')) {
		this.upload._click();
		return;
	}

	if (this.__aid && this.__fid){
		gui._create('insert_item', 'frm_insert_item', '', 'frm_insert_item_nobottomdiv', [this, '__addItems'], this.__aid, this.__fid, '', 'r', false, ['M', 'F', 'I', 'X']);
	}
};

_me.__addItems = function(files) {
	var me = this;

	me.__upload_buffer = [];

	files.forEach(function (file) {
		me.__upload_buffer.push({
			'class': 'item',
			'description': file.title,
			'size': file.size,
			'fullpath': file.fullpath
		});
	});

	if (me.__upload_buffer.length == 1) {
		gui._create('chat_upload', 'frm_chat_upload', '', '', me.__upload_buffer[0].description, '', {aid:me.__aid, fid:me.__fid}, [function (sName, sDesc, aArg) {
			me.__uploadhandler(me.__upload_buffer, sName, sDesc, aArg);
		}]);
	} else
		me.__uploadhandler(me.__upload_buffer);
};

_me._addConference = function(){
	if (this.__aid && this.__fid){
		var frm = Item.openwindow([
			sPrimaryAccount, this.__fid
		], {
			EVNCLASS: 'E',
			conference:true,
			EVNSHARETYPE: 'U',
			EVNTIMEFORMAT: 'Z',
			EVNFLAGS: 1,
			MEETING_ACTION: 1
		}, null, 'E', [
			function(bOK) {
				if (bOK && this.tabs && this.tabs.room) {
					this._serverSort('room');
				}
			}.bind(this)
		]);

		frm._modal(true);

		frm.MEETING_ACTION._disabled(true);
	}
};

_me.__resizeHandler = function(){
	//auto-disobey
	if (!this || this._destructed)
		return false;
	else{
		var w = this._main.offsetWidth;
		if (w>1100)
			addcss(this._main, 'wide');
		else
			removecss(this._main, 'wide');

		if (w>1100 && w<1800)
			addcss(this._main, 'fixed');
		else
			removecss(this._main, 'fixed');

		if (this.panel && !this.panel._destructed && w>1100){

			var offset = 0;
			if (hascss(gui.frm_main._main, 'rdock') && !hascss(gui.frm_main._main, 'rd_small')){
				offset = gui.frm_main._getAnchor('im').offsetWidth;
			}

			this.panel._main.style[gui._rtl?'left':'right'] = offset + 'px';
		}
		else
			this.panel._main.removeAttribute('style');
	}
};
