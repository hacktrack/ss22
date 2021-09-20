_me = obj_im.prototype;
function obj_im(){};

// Note: also file skins/default/inc/obj_im.js is used

_me.__constructor = function() {
	var me = this;

	this._telemetry = 'id'; //telemetry log

	this.__activeUser = {};
	this.__chat = null;

	// hide_offline_contacts property (domain admins and full admins only) can override the show_all_contacts property
	this.__showOnlineContactsOnly = GWOthers.getItem('IM', 'hide_offline_contacts') === '1' && GWOthers.getItemAccess('IM', 'hide_offline_contacts') === false;
	if (this.__showOnlineContactsOnly) {
		this.__showAllContacts = false;
	}
	// show_all_contacts is not set by default - so only online contacts are visible
	else{
		this.__showAllContacts = Cookie.get(['im', 'show_all_contacts']) ? true : false;
	}

	this.__activeBuffer = {};

	this.__noRefresh = false;
	this.__doRefresh = false;

	// render only visible properties (configuration); see example at shared/_project/tests/functional/renderOnlyVisibleInHugeList/
	this.__totalHeight = 0;
	this.__renderedHeight = 0;
	this.__lastScrollTop = 0;
	this.__renderedScrollTop = 0;
	this.__extraRendering = 1000;
	this.__scrollTimeoutId;
	this.__avatarCache = {}; // simple image cache is used due to ineffective browser caching when re-rendering the html content


	if (GWOthers.getItem('RESTRICTIONS','DISABLE_IM_CONTACT_MANAGEMENT')==1)
		this.btn_add._disabled(true);
	else
		this.btn_add._onclick = function(){
			if (me._is_active())
				me._add_item();
		};

	if (this.__showOnlineContactsOnly) {
		this.btn_show._disabled(true);
	}
	else {
		if (!me.__showAllContacts) {
			addcss(this.btn_show._main, 'active');
		}
		this.btn_show._title(this.__showAllContacts ? 'IM::HIDE' : 'IM::SHOW');

		this.btn_show._onclick = function() {
			me.__showAllContacts = !me.__showAllContacts;
			Cookie.set(['im', 'show_all_contacts'], me.__showAllContacts ? 1 : '', true);
			this._title(me.__showAllContacts ? 'IM::HIDE' : 'IM::SHOW');
			togglecss(this._main, 'active');

			me._fill();
		};
	}

	//search
	this.inp_search._onkeyup = function(e) {

		// Esc
		if (e.keyCode === 27) {
			this._value('');
			me.__hide2();

			if (this.__lastValue === '')
				me._focus();
			else
				me._fill();

			this.__lastValue = '';
		}
		else {
			var value = this._value();
			if (this.__lastValue !== value) {
				if (this.__lastValue === undefined || (this.__lastValue && this.__lastValue.length < value.length)) {
					// scroll to top to see all searched items (due to partial rendering)
					me.__body.parentNode.scrollTop = 0;
					me.__lastScrollTop = 0;
				}
				this.__lastValue = value;
				me.__show2();
				me._fill();
			}
		}
	};

	this.inp_search._onblur = function(){
		if (!this._value()) me.__hide2();
	};


	//IM focus
	var hasFocus = false;
	this._main.setAttribute('tabindex', -1);
	//IE trick
	if (~currentBrowser().indexOf('MSIE')){
		AttachEvent(this._main, 'onclick', function () {
			hasFocus = true;
		});
	}
	else{
		AttachEvent(this._main, 'onfocus', function () {
			hasFocus = true;
		});
	}
	AttachEvent(this._main, 'onblur', function () {
		hasFocus = false;
	});
	AttachEvent(this._main, 'onkeydown', function (e) {
		if (hasFocus && !e.isComposing && e.keyCode !== 229 && (e.key || '').length === 1){
			me.inp_search._focus();
		}
	});

	this.__xmpp = gui.socket.xmpp;

	this.__active = this._getAnchor('active');
	this.__recent = this._getAnchor('recent');
	this.__body = this._getAnchor('body');

	this._create('scroll_body', 'obj_scrollbar');
	this.scroll_body._scrollbar(this.__body.parentNode,this.__body.parentNode.parentNode);

	// on scroll handler - start re-render (calling _fill) of content when it is necessary
	this.__body.parentNode.onscroll = function(e) {

		// current scrollTop (with osx touch fix)
		var scrollTop = Math.max(Math.min(this.scrollHeight - this.offsetHeight, this.scrollTop), 0);

		if (Math.abs(me.__renderedScrollTop - scrollTop) > me.__extraRendering) {
			if (me.__scrollTimeoutId) {
				clearTimeout(me.__scrollTimeoutId);
			}
			// do not scroll immediately - scroll when there is no new scroll action
			me.__scrollTimeoutId = setTimeout(function() {
				me.__lastScrollTop = scrollTop;
				me._fill();
			}, 50);
		}
	};

	this.__body.onmousedown = function (e){
		var e = e || window.event,
			elm = e.target || e.srcElement;

		if (me.__dndtimer){
			window.clearTimeout(me.__dndtimer);
			delete me.__dndtimer;
		}

		if (elm != this){
			switch (elm.tagName){
			case 'H3':
			case 'H4':
			case 'SPAN':
			case 'IMG':
				elm = Is.Child(elm,'LI');

			case 'LI':
				if (elm.tagName == 'LI' && elm.id){
					var id = Path.basename(decodeURIComponent(elm.id));

						//Allow Contextmenu over multiple selection
					if (e.button>0 && me.__activeUser[id]) return;

						//Drag and Drop
					if (e.button == 0){
						var x = e.clientX, y = e.clientY;

						gui._obeyEvent('mouseup',[me,'__dndDispatch']);

						me.__dndtimer = setTimeout(function(){
							if (!me.__activeUser[id])
								me._activate(id,e.ctrlKey);

							me.__initdrag(id,'jabber',x,y);
						},500);
					}
				}
			}
		}
	};

	this.__body.onclick = function(e){
		var e = e || window.event,
			elm = e.target || e.srcElement;

		if (elm != this){
			switch (elm.tagName){
			case 'DIV':
				if (e.button == 0) {
					// stop other actions (e.g. clear search input in IM)
					e.cancelBubble = true;
					if (e.preventDefault) {
						e.preventDefault();
					}
					if (e.stopPropagation) {
						e.stopPropagation();
					}
					me._open(decodeURIComponent(elm.id.substr(me._pathName.length+1)));
				}
				break;

			case 'EM':

				var aPos = getSize(elm);
				this.oncontextmenu({target:Is.Child(elm,'LI'),clientX:aPos.x,clientY:aPos.y+(aPos.h/2)});

				e.cancelBubble = true;
				if (e.preventDefault) e.preventDefault();
				if (e.stopPropagation) e.stopPropagation();
				return false;

			case 'H3':
			case 'H4':
			case 'SPAN':
			case 'IMG':
				elm = Is.Child(elm,'LI');

			case 'LI':
				if (elm.id){
					var id = Path.basename(decodeURIComponent(elm.id));

					//Allow Contextmenu over multiple selection
					if (e.button>0 && me.__activeUser[id]) return;

					me._activate(id,e.ctrlKey);
				}
			}
		}
	};

	this.__body.ondblclick = function (e){
		var e = e || window.event,
			elm = e.target || e.srcElement;

		if (elm != this){
			switch (elm.tagName){
			case 'H3':
			case 'H4':
			case 'SPAN':
			case 'IMG':
				elm = Is.Child(elm,'LI');

			case 'LI':
				if (elm.id){

					var id = Path.basename(decodeURIComponent(elm.id));
					me._activate(id,e.ctrlKey);
					me._chat(id);
				}
			}
		}
	};

	this.__body.onmouseover = function(e){
		var e = e || window.event,
			elm = e.target || e.srcElement;

		switch (elm.tagName){
		case 'H3':
		case 'H4':
		case 'SPAN':
		case 'IMG':
			elm = Is.Child(elm,'LI');
		}

		if (elm.id){
			var sFrom = Path.basename(decodeURIComponent(elm.id)),
				iTime = dataSet.get('xmpp', ['roster', sFrom, 'status_time']);

			if (iTime){
				var d = new IcewarpDate(),
					t = d.unix() - iTime,
					s = dataSet.get('xmpp', ['roster', sFrom, 'show']) || 'offline';
				s = getLang('STATUS::'+s.toUpperCase(),'',2);

				if (s){
					if (t<60)
						elm.title = getLang('IM::STATUS_SEC', [s]);
					else
					if (t<3600)
						elm.title = getLang('IM::STATUS_MIN', [s, Math.ceil(t/60)]);
					else
						elm.title = getLang('IM::STATUS_HOUR', [s, Math.ceil(t/3600)]);
				}
			}
			else
				elm.title = '';
		}
	};

	//CONTEXT MENU
	this.__body.oncontextmenu = function(e){
		var e = e || window.event,
		elm = e.target || e.srcElement;

		switch (elm.tagName){
		case 'H3':
		case 'H4':
		case 'SPAN':
		case 'IMG':
			elm = Is.Child(elm,'LI');
		}

		if (elm.id){
			var aMenu,
				bLogin = !me._is_active(),
				id = Path.basename(decodeURIComponent(elm.id)),
				bManagement = GWOthers.getItem('RESTRICTIONS','DISABLE_IM_CONTACT_MANAGEMENT')==1;

			//user's JID
			if (elm.tagName == 'LI'){

				//contextmenu on multiple
				if (me.__activeUser[id] && count(me.__activeUser)>1)
            	    id = '';
            	else
            		me._activate(id);

				var	aTmp = me._getGroups(),
					aGrp = [{'title':'IM::OTHER','arg':{method:'grp_set',grp:'',id:id}},{'title':'-'}];

				for (var i in aTmp)
					if (i != '*')
						aGrp.push({'text':i,'arg':{method:'grp_set',grp:i,id:id}});

				if (aGrp.length>2)
					aGrp.push({'title':'-'});

				aGrp.push({'title':'IM::NEW_GROUP','arg':{method:'grp_new',id:id}});

				//contextmenu on multiple
				if (id === ''){
					aMenu = [
						{'title':'IM::GROUPMSG','arg':{'method':'chat'},disabled:bLogin},
						{'title':'IM::SEND_MAIL','arg':{'method':'send'}},
						{'title':'-'},
						{'title':'IM::GROUP',nodes:aGrp,disabled:bLogin},
						{'title':'-'},
						{'title':'MAIN_MENU::FILTER','arg':{'method':'search'}},
						{'title':'-'},
						{'title':'MAIN_MENU::DELETE','arg':{'method':'user_remove'},disabled:bLogin || bManagement}
					];
				}
				else{
					aMenu = [{'title':'IM::CHAT','arg':{'method':'chat',id:id},disabled:bLogin}];

					if (window.sPrimaryAccountSIP && (GWOthers.getItem('RESTRICTIONS', 'disable_sip') || 0)<1) {
						aMenu.push({'title':'IM::AUDIO_CALL','arg':{'method':'call',id:id},disabled:bLogin || id.indexOf('@')<0});
						aMenu.push({'title':'IM::VIDEO_CALL','arg':{'method':'call_video',id:id},disabled:bLogin || id.indexOf('@')<0 || IceSIP && !IceSIP.supported()});
					}

					if (window.sPrimaryAccountCONFERENCE)
						aMenu.push({'title': (dataSet.get('conference',['live'])?'IM::INVITE':'IM::CONFERENCE'),'arg':{'method':'conference',id:id},disabled:bLogin || id.indexOf('@')<0});

					aMenu.push(
						{'title':'IM::SEND_MAIL','arg':{'method':'send',id:id},disabled:id.indexOf('@')<0},
						//{'title':'IM::SEND_FILE','arg':{'method':'file',id:id},disabled:bLogin},
						{'title':'-'},
						{'title':'IM::VCARD','arg':{'method':'vcard',id:id},disabled:bLogin || id.indexOf('@')<0},
						{'title':'-'},
						{'title':'IM::RENAME','arg':{'method':'user_rename',id:id},disabled:bLogin},
						{'title':'IM::GROUP',nodes:aGrp,disabled:bLogin},
						{'title':'IM::SUBSCRIPTION',nodes:[
							{'title':'IM::SEND','arg':{method:'sub_add',id:id}},
							{'title':'IM::REQUEST','arg':{method:'sub_get',id:id}},
							{'title':'IM::REMOVE','arg':{method:'sub_remove',id:id}}
						],disabled:bLogin},
						{'title':'-'},
						//	{'title':'MAIN_MENU::FILTER','arg':{'method':'search'}},
						//	{'title':'-'},
						{'title':'MAIN_MENU::DELETE','arg':{'method':'user_remove',id:id},'css':'color2','disabled':bLogin || bManagement}
					);
				}
			}
			else
			//group
			if (elm.tagName == 'DIV')
				if (elm == me.__body)
					aMenu = [
						{'title':'IM::ADD','arg':{'method':'user_add'},disabled:bLogin || bManagement},
						{'title':'IM::ADD_SERVICE','arg':{'method':'user_gate'},disabled:bLogin},
						{'title':'-'},
						{'title':'MAIN_MENU::FILTER','arg':{'method':'search'}},
                    	{'title':'COMMON::APPEARANCE',
							nodes:[
								{'title':'COMMON::EXPAND','arg':{method:'im_mode',v:2}, css:'ico2' + (Cookie.get(['hide_im']) == 2?' check':'')},
								{'title':'COMMON::COLLAPSED','arg':{method:'im_mode',v:1}, css:'ico2' + (Cookie.get(['hide_im']) == 1?' check':'')},
								{'title':'COMMON::AUTOCOLLAPSED','arg':{method:'im_mode'}, css:'ico2' + (Cookie.get(['hide_im'])?'':' check')}
							]
						}];
				else
				if (elm.id)
					aMenu = [
						{'title':'IM::GROUPMSG','arg':{'method':'chat',id:'~'+id},disabled:bLogin},
						{'title':'IM::ADD','arg':{'method':'user_add',id:id},disabled:bLogin || bManagement},
						{'title':'IM::ADD_GATEWAY','arg':{'method':'user_gate',id:id},disabled:bLogin},
						{'title':'-'},
						{'title':'IM::RENAME','arg':{'method':'grp_rename',id:id}, 'disabled':id == '*' || id == '~' || bLogin},
						{'title':'-'},
						{'title':'MAIN_MENU::FILTER','arg':{'method':'search'}},
						{'title':'COMMON::APPEARANCE',
							nodes:[
								{'title':'COMMON::EXPAND','arg':{method:'im_mode',v:2}, css:'ico2' + (Cookie.get(['hide_im']) == 2?' check':'')},
								{'title':'COMMON::COLLAPSED','arg':{method:'im_mode',v:1}, css:'ico2' + (Cookie.get(['hide_im']) == 1?' check':'')},
								{'title':'COMMON::AUTOCOLLAPSED','arg':{method:'im_mode'}, css:'ico2' + (Cookie.get(['hide_im'])?'':' check')}
							]
						},
						{'title':'-'},
						{'title':'IM::REM_GRP','arg':{'method':'grp_remove',id:id}, 'disabled':id == '*' || id == '~' || bLogin},
						{'title':'IM::REM_GRPC','arg':{'method':'grp_removec',id:id}, 'disabled':bManagement || id == '*' || id == '~' || bLogin}
					];

			var cmenu = gui._create("cmenu","obj_context",'','',me);
			cmenu._fill(aMenu);
			cmenu._place(e.clientX,e.clientY);
			cmenu._onclick = function(e,elm,id,arg){
				me._oncontext(e,elm,id,arg);
			};
		}

		return false;
	};

	this.__active.onmouseover = this.__body.onmouseover;
	this.__active.ondblclick = this.__body.ondblclick;

	this.__active.onclick = function(e){
		var e = e || window.event,
			elm = e.target || e.srcElement;

		if (elm != this){
			switch (elm.tagName){
			case 'DIV':
				for(var uid in me.__activeBuffer){
					me._activate(uid);
					me._chat(uid);
					break;
				}
				break;
			case 'B':
				gui.frm_main._pin_im();
				break;

			case 'EM':
				me.__body.onclick(e);
				break;

			case 'H3':
			case 'H4':
			case 'SPAN':
			case 'IMG':
				elm = Is.Child(elm,'LI');

			case 'LI':
				if (elm.id){
					var id = Path.basename(decodeURIComponent(elm.id));

					//Allow Contextmenu over multiple selection
					if (e.button>0 && me.__activeUser[id]) return;

					me._activate(id,e.ctrlKey);
				}
			}
		}
	};

	this.__recent.onclick = function(e){
		var e = e || window.event,
			elm = e.target || e.srcElement;

		if (elm != this)
			switch (elm.tagName){
				//Pin
			case 'B':
				gui.frm_main._pin_im();
				break;

				//Reopen recent chats
				//Open 1st, others will open automaticaly
			case 'DIV':
				if (me.__chat && !me.__chat._destructed){
					me.__chat._focus();
				}
				else{
					var r = Cookie.get(['im_recent']) || [];
					me._chat(r.shift(), '', '', '', '', true);
				}
			}
	};

	this.__recent.oncontextmenu = this.__active.oncontextmenu = function(e){
		var e = e || window.event;

		//Emulate click on body
		var a = {
			target:me.__body,
			clientX:e.clientX,
			clientY:e.clientY
		};
		return me.__body.oncontextmenu(a);
	};

	//roster
	this._listen('xmpp',['roster']);

	this.__xmpp._obeyEvent('response', [this, '_response']);
	this.__xmpp._obeyEvent('status', [this, '_status_response']);

	this._add_destructor('__onDestruct');

	//Autologin (always ON)
	var sStatus = Cookie.get(['im', 'status']) || 'offline';
	if (sStatus == 'offline' && GWOthers.getItem('IM', 'auto_status') > '0') {
		sStatus = 'online';
	}
	if (sStatus != 'offline')
		this.__xmpp._presence(sStatus);

	//Activate Recent
	var r = Cookie.get(['im_recent']);
	if (Is.Array(r) && r.length)
		removecss(this.__recent,'empty');

	//Registr Drop
	if (gui.frm_main && gui.frm_main.dnd)
		gui.frm_main.dnd.registr_drop(this,['jabber']);

	//Deactivate search on click outside of IM
	gui._obeyEvent('click', [function(e){

		//auto disobey
		if (this._destructed)
			return false;

		if (this.inp_search && this.inp_search._value().length){
			var elm = e.target || e.srcElement;

			if (elm && !Is.Child(elm, this._main)){
			 	this.inp_search._value('');
				this.__hide2();
				this._fill();
			}
		}

	}.bind(this)]);

	gui._obeyEvent('resize',[function(){
		//auto disobey
		if (me._destructed)
			return false;

		me.__height();
	}]);
};

_me.__dndDispatch = function(){
	if (this.__dndtimer){
		window.clearTimeout(this.__dndtimer);
		delete this.__dndtimer;
	}
	return false; // for _disobeyEvent
};

_me._dock = function (bRefresh){
	if (!this._docked || bRefresh){
		if (this._getStatus() == 'offline')
			gui.frm_main._rightDock();
		else
			gui.frm_main._rightDock(false);

		this._docked = true;
	}

	return true;
};

_me._undock = function (bRefresh){
	if (this._docked || bRefresh){

		gui.frm_main._rightDock(Cookie.get(['hide_im']) == 2);
		this._docked = false;

		//		gui._dock._remove(this);

		return true;
	}
};

/**
 * returns view port height (visible area) and current scrolled position in pixels
 *
 * @return {object} scrollTop: number, viewPortHeight: number
 */
_me.__getVisibleRange = function() {
	var scrollTop, viewPortHeight, documentHeight;
	scrollTop = this.__body.parentNode.scrollTop || 0;
	documentHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
	viewPortHeight = this.__body.parentNode.clientHeight === 0 ? documentHeight : Math.min(this.__body.parentNode.offsetHeight, documentHeight);
	viewPortHeight = Math.max(viewPortHeight, 100); // minimal height
	return {scrollTop: scrollTop, viewPortHeight: viewPortHeight};
};

_me._activate = function (id,bCtrl){

	var elm,
		aData = dataSet.get('xmpp', ['roster']);

	for(var i in this.__activeUser)
		if ((!bCtrl && i!=id) || (bCtrl && i==id)){
			if (aData[i] && (elm = document.getElementById(this._pathName+'/'+encodeURIComponent(aData[i].group || '*')+'/'+encodeURIComponent(i)))){
            	removecss(elm,'active');
			}
			delete this.__activeUser[i];

			if (bCtrl){
				this._activate_active();
				return false;
			}
		}

	if (id && !this.__activeUser[id]){
		if (aData[id] && (elm = document.getElementById(this._pathName+'/'+encodeURIComponent(aData[id].group || '*')+'/'+encodeURIComponent(id))))
			addcss(elm,'active');

		this.__activeUser[id] = true;
		this._activate_active();
		return true;
	}

	this._activate_active();

	return false;
};

_me._openQueue = function (){
	if (this._is_active()){
		var queue = Cookie.get(['im','queue']) || [];
		if (count(queue)){
			for(var i in queue)
				if (queue[i])
					this._chat(i, '', '', '', '', true);
			return true;
		}
	}

	return false;
};

_me.__show2 = function (){
	addcss(this._main, 'search');
};
_me.__hide2 = function (){
	removecss(this._main, 'search');
};


_me._is_active = function(){
	return this.__xmpp && this.__xmpp._state()>=5;
};

_me._add_item = function(sGroup, sJID, sName,sTab){
	gui._create('frm_im_add','frm_im_add','','',this.__xmpp, sGroup, sJID, sName,sTab);
};

/**
 * open/close action of the group (click on group name)
 *
 * @param {string} id
 */
_me._open = function(id) {
	Cookie.set(['im','roster', id], Cookie.get(['im','roster', id]) ? undefined : 1);
	this._fill();
};

_me.__onDestruct = function(aHandler){
	this.__xmpp._presence('offline', '',
		[function () {
			if (aHandler)
				executeCallbackFunction(aHandler);

			dataSet.remove(this._listener, this._listenerPath, true);
			this.__xmpp._disobeyEvent('response', [this, '_response']);
			this.__xmpp._disobeyEvent('status', [this, '_status_response']);
		}.bind(this)]);
};

_me._oncontext = function (e,elm,id,arg){

	if (!arg) return;

	switch(arg.method){
	case 'send':
		if (arg.id)
		 	arg.id = MailAddress.createEmail(dataSet.get('xmpp', ['roster',arg.id,'name']),arg.id);
		else{
			arg.id = '';
		    for (var i in this.__activeUser)
		        if (i.indexOf('@')>-1)
		    		arg.id += (arg.id?', ':'') + MailAddress.createEmail(dataSet.get('xmpp', ['roster',i,'name']),i);
		}

		if (arg.id)
			NewMessage.compose({to:arg.id});

		break;
	case 'file':
		gui._create('insert_item', 'frm_insert_item', '', 'frm_insert_item_nobottomdiv', [this.__chat._getChat(arg.id) ,'__addItems'], sPrimaryAccount, '', '', 'r', false, ['F', 'X']);
		break;
	case 'chat':
		if (!arg.id){
			arg.id = '';
			for (var i in this.__activeUser)
				arg.id += (arg.id?'; ':'')+i;

			if (arg.id)
				arg.id = '~' + arg.id;
		}

		if (arg.id) {
			this._activate(arg.id);
			this._chat(arg.id);
		}
		break;
	case 'conference':
		storage.library('wm_conference');
		var running = dataSet.get('main', ['conference']);
		if (running) {
			wm_conference.get(running).invite([arg.id]);
		} else {
			wm_conference.create(function(conference) {
				conference.join();
				conference.invite([arg.id]);
			});
		}
		break;
	case 'vcard':
		gui._create('frm_im_vcard', 'frm_im_vcard', '', '', arg.id, this.__xmpp);
		break;
	case 'sub_add':
		this.__xmpp._user_subscribed(arg.id);
		break;
	case 'search':
		this.__show2();
		this._focus();
		break;
	case 'sub_get':
		this.__xmpp._user_subscribe(arg.id);
		break;

	case 'sub_remove':
		this.__xmpp._user_unsubscribed(arg.id);
		break;

	case 'user_remove':
		gui._create('frm_confirm', 'frm_confirm', '', '', [this,'_removeUsr',[[arg.id]]], 'IM::REMOVE',arg.id?'IM::REMOVE_ACCOUNT':'IM::REMOVE_ACCOUNTS',[arg.id]);
		break;

	case 'user_gate':
	case 'user_add':
		this._add_item(arg.id=='*' || arg.id=='~'?'':arg.id,'','',arg.method=='user_gate'?'gateway':'');
		break;

	case 'call':
		gui.frm_main._call(arg.id);
		break;

	case 'call_video':
		gui.frm_main._call(arg.id, true);
		break;

	case 'grp_set':
		this._addGroup(arg.grp,arg.id);
		break;

	case 'grp_new':
		gui._create('frm_input','frm_input','','',[this,'_addGroup',[arg.id]],'IM::NEW_GROUP');
		break;

	case 'user_rename':
		var aTmp = dataSet.get('xmpp', ['roster', arg.id]);
		this.__renameInput(document.getElementById(this._pathName+'/'+encodeURIComponent(aTmp.group)+'/'+encodeURIComponent(arg.id)),aTmp.name || arg.id,[this,'_renameUsr',[arg.id]]);
		break;

	case 'grp_rename':
		this.__renameInput(document.getElementById(this._pathName+'/'+ encodeURIComponent(arg.id)),arg.id,[this,'_oncontext',['','',{method:'grp_rename_response',id:arg.id}]]);
		break;

	case 'grp_rename_response':
		//in this case var e contains new GroupName
	case 'grp_remove':
		this.__xmpp._group_rename(arg.id, e);
		break;

	case 'im_mode':
		Cookie.set(['hide_im'], arg.v || '');
		gui.frm_main._rightDock(arg.v == 2);
		break;

	case 'grp_removec':
		var aID = [],
			aDS = dataSet.get('xmpp',['roster']);

		for (var i in aDS)
			if (aDS[i].group == arg.id)
				aID.push(i);

		if (aID.length)
			this._removeUsr(aID);
	}
};

_me._removeUsr = function(aID){

	//remove multiple selected
	if (!aID[0]){
		aID = [];
		for(var i in this.__activeUser)
        	aID.push(i);
	}

	if (aID.length){
		this.__xmpp._user_remove(aID, [function(){
			for (var i in aID)
				Cookie.set(['im','queue',aID[i]]);
		}]);
	}

};

_me._renameUsr = function(sName, sJID){
	if (sJID){
		var aTmp = dataSet.get('xmpp', ['roster', sJID]);
		if (aTmp && aTmp.name != sName)
			this.__xmpp._user_rename(sJID, sName == sJID?'':sName, aTmp.group);
	}
};

_me._addGroup = function(sGrp, sJID){
	if (Is.Array(sJID)){
		for(var i in sJID)
			if (sJID[i])
				this._addGroup(sGrp,sJID[i]);
	}
	else
	if (!sJID){
		for(var i in this.__activeUser)
			if (i)
				this._addGroup(sGrp,i);
	}
	else{
		var aTmp = dataSet.get('xmpp', ['roster', sJID]);
		if (aTmp && aTmp.group != sGrp)
			this.__xmpp._user_rename(sJID,aTmp.name,(sGrp == '*' || sGrp == '~'?'':sGrp));
	}
};

_me._focus = function(){
	this._main.focus();
};


// Create input for rename inside given html element
_me.__renameInput = function(hAnchor, sText, oResponse){
	var me = this;

	this.__noRefresh = true;
	removecss(hAnchor,'active');

	addcss(hAnchor,'edit');
	hAnchor.innerHTML = '';

	var inp = mkElement('input', {type:'text',className:'rename_input'});
	inp.value = sText;

	// cancel "onclick" propagation to obj_im
	inp.onmousedown = function(e){
		var e = e || window.event;
		e.cancelBubble = true;
		if (e.stopPropagation) e.stopPropagation();
	};

	inp.onclick = function(e){
		var e = e || window.event;
		e.cancelBubble = true;
		if (e.preventDefault) e.preventDefault();
		if (e.stopPropagation) e.stopPropagation();
		return false;
	};

	inp.onblur = function (e){
		me._doRefresh(true);
	};

	inp.onkeydown = function(e){
		var e = e || window.event;

		switch (e.keyCode) {
			// Enter
		case 13:
			this.onblur = null;

			if (oResponse)
				executeCallbackFunction(oResponse, this.value);

			me._doRefresh(true);
			break;
			// Esc
		case 27:
			this.blur();
			break;
		}
	};
	inp.onsubmit = function(){
		return false;
	};

	hAnchor.appendChild(inp);

	try{
		// MSIE
		if (document.selection){
			var r = inp.createTextRange();
			r.collapse(true);
			r.moveStart("character", 0);
			r.moveEnd("character", sText.length);
			r.select();
		}
		// OTHERS
		else
			inp.setSelectionRange(0, sText.length);
	}
	catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r)}
	inp.focus();
};

_me._inRoster = function(sUID){
	return dataSet.get('xmpp', ['roster',sUID.toLowerCase(),'show']) || false;
};

_me._translateUID = function (sUID){
	return sUID.split('/').shift().toLowerCase();
};
_me._translateName = function (sUID){
	if (sUID){
		sUID = this._translateUID(sUID);
		return dataSet.get('xmpp', ['roster', sUID, 'name']) || sUID;
	}
};


_me._chat = function(sFrom, sTo, sBody, iDate, conference_id, bNoFocus){

	if (!this._is_active()) return;

	var add_focus = bNoFocus?false:true;

	if (Is.String(sFrom) && sFrom.length)
		sFrom = sFrom?this._translateUID(sFrom):'';
	else{
		if (this.__chat && !this.__chat._destructed){
			this.__chat._focus();
			this.__chat.tabs.inp_add._focus();
			return;
		}
		else
			sFrom = '';

		add_focus = true;
	}

 	/* Handle incoming chat messages */
	if (sBody && !sTo){

		// Autostart conference if incoming message contains conference id and is not already running
		if (conference_id && conference_id!=dataSet.get('conference',['id']) && sPrimaryAccountCONFERENCE) {
			if(dataSet.get('conference',['live'])) {
				// Ongoing conference already, show alert
				if(!gui.conferencealert)
					gui.notifier._value({type: 'alert', args: {header: 'MAIN_MENU::CONFERENCE', text: 'CONFERENCE::CHATALREADYCONFERENCE'}});
			} else
			if(!gui.confirmconference) {
				// Join conference if confirmed
				/*gui._create('confirmconference','frm_confirm','','', [this,function() {
						storage.library('wm_conference');
						wm_conference.get(conference_id).join();
					}], 'MAIN_MENU::CONFERENCE','',sFrom + ' ' + getLang('CONFERENCE::CONFIRMINVITE'));*/
				// Notify user of invitation
				if(gui.notifier)
					gui.notifier._value({type: 'conference_invite', args: [conference_id]});
			}
		}

		//Sound
		if (gui.frm_main && gui.frm_main.sound && GWOthers.getItem('IM','sound_notify')>0)
			gui.frm_main.sound._play('im');

		//Notification
		if ((!gui.frm_chat || !gui.frm_chat._getChat(sFrom) || !gui.frm_chat._getChat(sFrom)._isActive) && GWOthers.getItem('LAYOUT_SETTINGS','notifications') != '2' && gui.notifier && gui.notifier._getPermissions() != 'denied' && gui.notifier._getPermissions() != 'unsupported'){

			//parse Body
			var sNotify = '';
			if (Is.String(sBody))
				sNotify = sBody;
			else
				switch(sBody.type){
				case "geoloc":
					sNotify = getLang('IM::REC_GEO');
					break;
				case "file":
					sNotify = getLang('IM::REC_FILE', [sBody.desc]);
					break;
				}

			var oNot = gui.notifier._value({
				type:'im',
				args: { jid:sFrom, text_plain: sNotify },
				aHandler: [this,'_chat',[sFrom]],
				//group: 'chat'
			});
			if (oNot){
				dataSet.add('xmpp', ['roster', sFrom, 'notification'], oNot, true);

				var oHandler = [function(e){
					try{
						if (oNot)
							oNot.close();

						if (sFrom)
							dataSet.remove('xmpp', ['roster', sFrom, 'notification'], true);
					}
					catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r)}

					gui._disobeyEvent('focus', oHandler);
				}];
				gui._obeyEvent('focus', oHandler);
			}
		}

		//Title
		if (gui.frm_main && gui.frm_main.title)
			gui.frm_main.title._add(getLang('TITLE::NEW_IM',[this._translateName(sFrom)]),5);

		//Not Listed user
		if (!this._inRoster(sFrom))
			dataSet.add('xmpp', ['roster', sFrom], {show:'from', group:'~', user:sFrom});
	}

	// When there is no chat window open it or put message to queue
	var bNew = false;
	if (!this.__chat || this.__chat._destructed == true)
		// Create chat window if not busy or it's a conference message
		if (!sBody || (GWOthers.getItem('IM','auto_chat')>0 && this._getStatus() != 'dnd' && !conference_id)){
			this.__chat = gui._create('frm_chat','frm_chat');
			this.__chat.__im = this;

			bNew = true;
		}
		else
			delete this.__chat;

	//open sFrom chat
	if (this.__chat){

		if (bNew){
			//open history chats except sFrom
			var r = Cookie.get(['im_recent']);
			if (Is.Array(r)){
				for (var i = 0; i<r.length; i++)
					if (r[i] !== sFrom){
						if (!sFrom)
							sFrom = r[i];

						this.__chat._createChat(r[i]);
					}
			}
		}

		if (sFrom){

			var oChat = this.__chat._createChat(sFrom, !sBody || bNew, true);

			// Manage docking
			if (this.__chat._docked){
				if (!sBody || (this._getStatus() != 'dnd' && GWOthers.getItem('IM', 'auto_chat') > 0))
					this.__chat._undock();
				else
				if (sBody && !conference_id){
					var dock = this.__chat._mydock || gui._dock;
					if (dock && oChat) {
						dataSet.add('xmpp', ['roster', sFrom, 'action'], 'msg', true);
						dock._add(this.__chat,this.__chat._ondock().title,'event');
					}
				}
			}

			if (oChat && sBody && !conference_id)
				if (!oChat._isActive || !oChat.text._hasFocus())
					this._add(sFrom);
		}
	}

	// Otherwise just add the message to the queue and return
	if (!this.__chat || (sFrom && this.__chat && this.__chat._getChat(sFrom) && this.__chat._getChat(sFrom)._wasActivated == false)){

		if (!sPrimaryAccountIMHISTORY || sFrom.indexOf('~')==0 || Is.Defined(dataSet.get('xmpp',['roster',sFrom,'history']))){
			// Add message to the queue for this contact
			var oMessage = {'from':sFrom, 'to':sTo, 'body':sBody, 'date': iDate || (new IcewarpDate()).unix()};
			if (conference_id)
				oMessage.conference = conference_id;

			var q = dataSet.get('xmpp',['roster',sFrom,'history']) || [];
			q.push(oMessage);

			dataSet.add('xmpp',['roster',sFrom,'history'], q, true);
		}

		// Notify user with flashing label (but not for conference invitations)
		if (sBody && !conference_id){

			dataSet.add('xmpp', ['roster', sFrom, 'action'], 'msg', true);
			this._add(sFrom);

			dataSet.update('xmpp', ['roster', sFrom, 'action']);

			// Remember that there are new messages in the queue for next login
			Cookie.set(['im','queue',sFrom], 1);

			if (this.__chat)
				this.__chat._getChat(sFrom)._animate();
		}

		dataSet.update('main', ['im']);
		return;
	}

	if (sBody && !conference_id)
		this.__chat._getChat(sFrom)._animate();

	// Add chat message
	this.__chat._chat(sFrom, sTo, sBody, iDate, false, false);

	dataSet.update('main', ['im']);

	//show roster
	this._undock();

	if (add_focus && this.__chat){
		this.__chat._focus();
		if (sFrom === '')
			this.__chat.tabs.inp_add._focus();
	}

};

_me._send = function(sTo, sBody, bConference){
	if (this._is_active()){

		var aTo = this._getGroupUsers(sTo);

		if (this.__chat && this.__chat.tabs) {
			if (aTo){
				if (this.__chat.__tabIndex[sTo] && this.__chat.tabs[this.__chat.__tabIndex[sTo]])
					this.__chat.tabs[this.__chat.__tabIndex[sTo]]._close();
			}
			else
				this.__chat._chat(sTo, sPrimaryAccount, sBody, false, false, true);
		}

		if (bConference) {
			// Show notification of sent invitation
			if (gui.notifier)
				gui.notifier._value({type: 'invitation_sent', args: [sTo]});

			// Send invitation to conference conference
			this.__xmpp._invitation(aTo || sTo, sBody);
		}
		else{
			this.__xmpp._message(aTo || sTo, sBody);

			//send fake carbons
			if (aTo){
				aTo.forEach(function(sTo){
					if (sTo !== sPrimaryAccount){
						var aData = {
							MESSAGE: [{
								ATTRIBUTES: {
									FROM: sPrimaryAccount,
									TO: sTo
								},
								BODY: [{
									VALUE: sBody
								}]
							}]
						};

						this._response('sent', aData);
					}
				}.bind(this));
			}
		}

		return true;
	}
	return false;
};
_me._geo = function(sTo, aArg){
	if (this._is_active()){

		var aTo = this._getGroupUsers(sTo) || [sTo];

		this.__xmpp._geo(aTo, aArg, [function(aArg){

			if (this.__chat && this.__chat.tabs){
				var geo = {
					ATTRIBUTES:{XMLNS:"http://jabber.org/protocol/geoloc", 'XML\:LANG':"en"},
					LAT:[{VALUE:aArg.lat}],
					LON:[{VALUE:aArg.lon}]
				};

				//GROUP mode
				if (sTo.charAt(0) === '~'){

					//close tab
					if (this.__chat && this.__chat.__tabIndex[sTo] && this.__chat.tabs[this.__chat.__tabIndex[sTo]])
						this.__chat.tabs[this.__chat.__tabIndex[sTo]]._close();

					//send fake carbons
					aTo.forEach(function(sTo){
						if (sTo !== sPrimaryAccount){
							var aData = {
								MESSAGE: [{
									ATTRIBUTES: {
										FROM: sPrimaryAccount,
										TO: sTo
									},
									EVENT: [{
										ITEMS: [{ITEM:[{GEOLOC:[geo]}]}]
									}]
								}]
							};

							this._response('sent', aData);
						}
					}.bind(this));

				}
				else
					this.__chat._chat(sTo, sPrimaryAccount, {geoloc: geo, type: "geoloc"}, false, false, true);
			}

		}.bind(this, aArg)]);

		return true;
	}
	return false;

};


/*
<message from="x@icewarp.com" type="chat" id="A80E8C0C-A362-40FD-AEEF-4F768B54B451" to="lukas@icewarp.com">
	<displayed xmlns="urn:xmpp:chat-markers:0" id="A80E8C0C-A362-40FD-AEEF-4F768B54B451"/>
	<x xmlns="jabber:x:oob">
		<url>https://server.icewarp.com/teamchatapi/files.download?ticket=eJxNizkOgDAMwF5DNiBNUpoOWfkH6iVgQfB,iU4IyZvtZqwkXjk4jALVJGpamD3VLJBshecrMkaG20ZyEsRjUIFisP.WUudBsDMdV4OzG8a0Jar8AhgmGZM_t</url>
		<desc>image</desc>
	</x>
</message>
*/

_me._link = function(sTo, aArg){
	var aTo = this._getGroupUsers(sTo);
	this.__xmpp._file_upload(aTo || sTo, aArg, [function(aArg){

		if (this.__chat && this.__chat.tabs){

			if (sTo.charAt(0) === '~'){

				//close tab
				if (this.__chat && this.__chat.__tabIndex[sTo] && this.__chat.tabs[this.__chat.__tabIndex[sTo]])
					this.__chat.tabs[this.__chat.__tabIndex[sTo]]._close();

				//send fake carbons
				if (aTo){
					aTo.forEach(function(sTo){
						if (sTo !== sPrimaryAccount){
							var aData = {
								MESSAGE: [{
									ATTRIBUTES: {
										FROM: sPrimaryAccount,
										TO: sTo
									},
									X: [{
										URL:[{VALUE:aArg.link}],
										DESC:[{VALUE:aArg.desc}],
										SIZE:[{VALUE:aArg.size}],
										ATTRIBUTES:{XMLNS:'jabber:x:oob'}
									}]
								}]
							};

							this._response('sent', aData);
						}
					}.bind(this));
				}
			}
			else
				this.__chat._chat(sTo, sPrimaryAccount, {url: aArg.link, desc: aArg.desc, size:aArg.size, type: "file"}, false, false, true);
		}

	}.bind(this, aArg)]);
};

_me._status_response = function(){
	Cookie.set(['im','status'], this._getStatus());
};

_me._response = function(sType,aData){
	switch (sType){
	case 'notice':

		if (aData && this.__chat){
			var aFrom = this._translateUID(aData.FROM);
			sFrom = aFrom.shift();

			if (!dataSet.get('xmpp', ['roster', sFrom]))
				if (dataSet.get('xmpp', ['roster', aData.FROM]))
				    sFrom = aData.FROM;
				else
				    break;

			this.__chat._notice(sFrom, aData.TEXT);
		}

		break;
	//ERROR
	case 'error':

		if (aData.IQ){
			try{
				//Server Offline
				if (aData.IQ[0].ERROR && aData.IQ[0].ERROR[0] && aData.IQ[0].ERROR[0].ATTRIBUTES && aData.IQ[0].ERROR[0].ATTRIBUTES.STATUS != 408)
					gui.notifier._value({type: 'alert', args: {header: 'IM::ERROR_IM', text_plain: aData.IQ[0].ERROR[0].VALUE + ' (' + aData.IQ[0].ERROR[0].ATTRIBUTES.STATUS+')'}});
			}
			catch(e){gui._REQUEST_VARS.debug && console.log(this._name||false,e)}
		}
		break;

	//MESSAGE
	case 'event':
		if (aData.EVENT && aData.EVENT[0].ITEMS && aData.EVENT[0].ITEMS[0].ITEM && aData.EVENT[0].ITEMS[0].ITEM[0].GEOLOC) {
			aData.BODY = [{VALUE: {geoloc: aData.EVENT[0].ITEMS[0].ITEM[0].GEOLOC[0], type: "geoloc"}}];
			return this._response('message', aData);
		}
		break;

	case 'x':
		if (aData.X && aData.X[0].URL){
			var aVal = {url: aData.X[0].URL[0].VALUE, type: "file"};

			if (aData.X[0].DESC)
				aVal.desc = aData.X[0].DESC[0].VALUE;

			if (aData.X[0].SIZE)
				aVal.size = aData.X[0].SIZE[0].VALUE;

			aData.BODY = [{VALUE: aVal}];
			return this._response('message', aData);
		}

	case 'message':
		if (aData.BODY && aData.BODY[0] && aData.BODY[0].VALUE){

			var iDate = '', stamp;
			if (aData.X && aData.X[0] && aData.X[0].ATTRIBUTES && (stamp = aData.X[0].ATTRIBUTES.STAMP)){
				iDate = (new IcewarpDate(stamp,{format:'YYYYMMDDThh:mm:ss'})); //CCYYDDMMThh:mm:ss
				iDate = iDate.add(iDate.utcOffset(),'m').unix();
			}

			// Conference conference message
			var conference_id;
			if (aData.X && aData.X[0] && aData.X[0].ATTRIBUTES && aData.X[0].ATTRIBUTES.XMLNS == 'jabber:x:icewarpconference')
				conference_id = aData.X[0].ID[0].VALUE;

			this._chat(aData.ATTRIBUTES.FROM, '', aData.BODY[0].VALUE, iDate, conference_id, true);
		}
		break;

	//CARBONS xep-0280
	case 'sent':
	case 'received':

		//Parse From
		var sFrom = this._translateUID(aData.MESSAGE[0].ATTRIBUTES.FROM),
			sTo = this._translateUID(aData.MESSAGE[0].ATTRIBUTES.TO),
			sUser = sType === 'sent'?sTo:sFrom;

		//No group support
		if (sFrom.indexOf('~') === 0)
			break;

		//omit if user hes no history yet
		if (sPrimaryAccountIMHISTORY && !Is.Defined(dataSet.get('xmpp',['roster',sUser,'history'])))
		 	break;

		//Parse Date
		var iDate = '', stamp;
		if (aData.DELAY && aData.DELAY[0] && aData.DELAY[0].ATTRIBUTES && (stamp = aData.DELAY[0].ATTRIBUTES.STAMP)){
			iDate = (new IcewarpDate(stamp,{format:'YYYYMMDDThh:mm:ss'}));
			iDate = iDate.add(iDate.utcOffset(),'m').unix();
		}
		else
			iDate = (new IcewarpDate()).unix();

		var sBody = '',
			conference_id;

		//GEO
		if (aData.MESSAGE[0].EVENT && aData.MESSAGE[0].EVENT[0].ITEMS && aData.MESSAGE[0].EVENT[0].ITEMS[0].ITEM && aData.MESSAGE[0].EVENT[0].ITEMS[0].ITEM[0].GEOLOC) {
			sBody = {geoloc: aData.MESSAGE[0].EVENT[0].ITEMS[0].ITEM[0].GEOLOC[0], type: "geoloc"};
		}
		//Parse Body
		else{
			sBody = (aData.MESSAGE[0].BODY && aData.MESSAGE[0].BODY[0].VALUE) || '';

			if (aData.MESSAGE[0].X && aData.MESSAGE[0].X[0] && aData.MESSAGE[0].X[0].ATTRIBUTES){
				switch(aData.MESSAGE[0].X[0].ATTRIBUTES.XMLNS){
					// Conference conference message
					case 'jabber:x:icewarpconference':
						conference_id = aData.MESSAGE[0].X[0].ID[0].VALUE;
					break;

					//Image
					case 'jabber:x:oob':
						if (aData.MESSAGE[0].X[0].URL){
							sBody = {url: aData.MESSAGE[0].X[0].URL[0].VALUE, type: "file"};

							if (aData.MESSAGE[0].X[0].DESC)
								sBody.desc = aData.MESSAGE[0].X[0].DESC[0].VALUE;
							if (aData.MESSAGE[0].X[0].SIZE)
								sBody.size = aData.MESSAGE[0].X[0].SIZE[0].VALUE;
						}
					break;
				}
			}
		}

		//User has active chat
		if (dataSet.get('xmpp',['roster',sUser,'active']) === true && this.__chat){

			//ADD MESSAGE WO NOTIFICATION
			this.__chat._chat(sUser, sType === 'sent'?sFrom:'', sBody, iDate);
		}
		else
		// Add message to the queue for this contact
		{
			var oMessage = {'from':sFrom, reply:sType === 'sent', 'body':sBody, 'date': iDate};
			if (conference_id)
				oMessage.conference = conference_id;

			var q = dataSet.get('xmpp',['roster',sUser,'history']) || [];
				q.push(oMessage);

			dataSet.add('xmpp',['roster',sUser,'history'], q, true);
		}

		break;

	case 'gone':
		if (aData && this.__chat)
			this.__chat._gone(aData);
		break;

	case 'paused':
		if (aData){
			if (gui.frm_main && gui.frm_main.title)
				gui.frm_main.title._refresh();

			if (this.__chat)
				this.__chat._wait(aData);
		}
		break;
	case 'composing':
		if (aData){
			if (gui.frm_main && gui.frm_main.title)
				gui.frm_main.title._add(getLang('IM::COMPOSING',[this._translateName(aData)]),5);

			if (this.__chat)
				this.__chat._compose(aData);
		}
		break;

	//RESPONSE
	case 'subscribe':
		if (aData.ATTRIBUTES.FROM){
			if (GWOthers.getItem('IM','auto_subscribe')>0)
				this.__subscribed(true,aData.ATTRIBUTES.FROM);
			else{
				var frm = gui._create('subscribe','frm_confirm_threestates','','',[this,'__subscribed',[aData.ATTRIBUTES.FROM]],'IM::SUBSCRIPTION','IM::SUB_ASK',[aData.ATTRIBUTES.FROM],'FORM_BUTTONS::ACCEPT','FORM_BUTTONS::DECLINE'),
					me = this;

				//Service
				if (aData.ATTRIBUTES.FROM.indexOf('@')==-1){
					frm.x_btn_cancel2._disabled(true);
					frm.x_btn_cancel._onclick = function(){
						me.__xmpp._user_remove([aData.ATTRIBUTES.FROM]);
						frm._destruct();
					};
				}
			}
		}
		break;

	case 'subscribed':
		break;

	case 'unavailable':
		if (aData.ATTRIBUTES && aData.ATTRIBUTES.FROM){
			var sFrom = this._translateUID(aData.ATTRIBUTES.FROM);
			if (dataSet.get('xmpp', ['roster', sFrom])){
				dataSet.remove('xmpp', ['roster', sFrom, 'status'],true);
				dataSet.remove('xmpp', ['roster', sFrom, 'sip'],true);
				dataSet.remove('xmpp', ['roster', sFrom, 'show'],true);
				dataSet.update('xmpp', ['roster', sFrom]);
			}
		}

		break;

	case 'unsubscribed':

		if (aData.ATTRIBUTES && aData.ATTRIBUTES.FROM){
			var sFrom = this._translateUID(aData.ATTRIBUTES.FROM);

			if (dataSet.get('xmpp', ['roster', sFrom])){
				dataSet.remove('xmpp', ['roster', sFrom, 'status'],true);
				dataSet.add('xmpp', ['roster', sFrom, 'status'],'from');

				//Remove from Queue
				Cookie.set(['im','queue',sFrom]);

				gui.notifier._value({type: 'alert', args: {header: 'IM::SUBSCRIPTION', text: 'IM::UNSUBSCRIBED', args: [sFrom]}});
			}
		}

		break;

	case 'state_change':

		if (aData.ATTRIBUTES && aData.ATTRIBUTES.FROM){

			var aFrom = aData.ATTRIBUTES.FROM.split('/'),
				sFrom = aFrom.shift();

			if (!dataSet.get('xmpp', ['roster', sFrom]))
				if (dataSet.get('xmpp', ['roster', aData.ATTRIBUTES.FROM]))
				    sFrom = aData.ATTRIBUTES.FROM;
				else
				    break;

			var ds = dataSet.get('xmpp', ['roster', sFrom]),
				bUpdate = false;

			//set status text
			var sStat = '';
			if (aData.STATUS && aData.STATUS[0] && aData.STATUS[0].VALUE)
				sStat = aData.STATUS[0].VALUE;

			if (ds.status != sStat){
				bUpdate = true;
				dataSet.add('xmpp', ['roster', sFrom, 'status'], sStat, true);
			}

			//set resource
			if (aFrom[0])
				dataSet.add('xmpp', ['roster', sFrom, 'resource'], aFrom[0], true);

			//set VoIP & Avatar update
			var bSIP = false;
			if (aData.X)
			    for(var i in aData.X){
					switch(aData.X[i].ATTRIBUTES.XMLNS){
						case 'sip-presence:x:update':
							bSIP = true;
							break;

						//update avatar
						case 'vcard-temp:x:update':
							if (aData.X[i].PHOTO){
								var new_hash = aData.X[i].PHOTO[0].VALUE;
								if (ds.photo && new_hash !== ds.photo)
									bUpdate = true;

								dataSet.add('xmpp', ['roster', sFrom, 'photo'], new_hash, true);
							}
					}
				}

			dataSet.add('xmpp', ['roster', sFrom, 'sip'], bSIP, true);

			//set status time
			dataSet.add('xmpp', ['roster', sFrom, 'status_time'], (new IcewarpDate()).unix(), true);

			//set status icon
			var new_show = 'offline';
			if (aData.SHOW && aData.SHOW[0] && aData.SHOW[0].VALUE)
				new_show = aData.SHOW[0].VALUE.toLowerCase();
			else
			if (aData.ATTRIBUTES.TYPE != "unavailable")
				new_show = ds.show == 'from'?'from':'online';

			if (ds.show !== new_show){
				dataSet.add('xmpp', ['roster', sFrom, 'show'], new_show, true);
				bUpdate = true;
			}

			bUpdate && dataSet.update('xmpp', ['roster', sFrom]);
		}

		break;

	case 'download':

		if (aData){

			var sDesc = (aData.FILE[0].DESC && aData.FILE[0].DESC[0] && aData.FILE[0].DESC[0].VALUE?aData.FILE[0].DESC[0].VALUE:''),
				sFrom = this._translateName(aData.FROM[0].VALUE);

			//Bytestream transfer
			if (aData && aData.FILE && aData.FEATURE){

				//Feature check
				if (aData.FEATURE[0].X && aData.FEATURE[0].X[0].ATTRIBUTES && aData.FEATURE[0].X[0].ATTRIBUTES.XMLNS == 'jabber:x:data'	&&
		            aData.FEATURE[0].X[0].FIELD && aData.FEATURE[0].X[0].FIELD[0].ATTRIBUTES && aData.FEATURE[0].X[0].FIELD[0].ATTRIBUTES.TYPE == 'list-single' &&
		            aData.FEATURE[0].X[0].FIELD[0].OPTION && aData.FEATURE[0].X[0].FIELD[0].OPTION[0].VALUE && aData.FEATURE[0].X[0].FIELD[0].OPTION[0].VALUE[0].VALUE == 'http://jabber.org/protocol/bytestreams'){

					//Auto-Accept files below 5MB
					if (!aData.FILE[0].ATTRIBUTES || aData.FILE[0].ATTRIBUTES.SIZE>5242880){
						var me = this,
							sHtml = getLang('IM::RECEIVE_NOTE',[sFrom.escapeHTML(), aData.FILE[0].ATTRIBUTES.NAME.escapeHTML()]) + (sDesc?'<hr size="1">' + sDesc.escapeHTML():''),
							frm = gui._create('download','frm_confirm','','',[this,'_response',['stream_start',aData]],'IM::RECEIVE_FILE','', sHtml);
						frm.x_btn_cancel._onclick = function(){
			                    me.__xmpp._stream_cancel(aData.ID[0].VALUE,aData.FROM[0].VALUE);
							this._parent._destruct();
						};
					}
					else
						this.__xmpp._stream_accept(aData, aData.ID[0].VALUE, aData.FROM[0].VALUE);
				}
				else
					this.__xmpp._stream_cancel(aData.ID[0].VALUE, aData.FROM[0].VALUE);

			}
			else
			//OOB transfer
			if (aData && aData.URL && aData.URL[0] && aData.URL[0].VALUE){
				var me = this,
					sHtml = getLang('IM::RECEIVE_NOTE',[sFrom.escapeHTML(), Path.basename(aData.URL[0].VALUE).escapeHTML()]) + (sDesc?'<hr size="1">' + sDesc.escapeHTML():''),
					frm = gui._create('download','frm_confirm','','',[this,'_response',['download_start',aData.URL[0].VALUE]], 'IM::RECEIVE_FILE','', sHtml);

				frm.x_btn_cancel._onclick = function(){
					me._response('download_stop',aData);
					this._parent._destruct();
				};
			}

		}
		break;

	case 'stream_start':
		this.__xmpp._stream_accept(aData, aData.ID[0].VALUE,aData.FROM[0].VALUE);
		break;

	case 'streamhost':

		if (aData && aData.size>0 && aData.socket){
			var aUrl = {
				'sid': dataSet.get('main', ['sid']),
				'class': 'socks',
				'fullpath': aData.name+'/'+aData.size+'/'+aData.socket
			};

			downloadItem(buildURL(aUrl));
		}
		else
			gui.notifier._value({type: 'alert', args: {header: '', text: 'IM::ERROR_SOCKET'}});

		break;

	case 'download_start':
		window.open(aData, "file", "directories=no,toolbar=no,status=no,menubar=yes,width=200,height=200");
		break;

	case 'download_stop':
		var sID = '',sTo = '';
		if (aData.ID){
			var sID = aData.ID[0].VALUE;
			delete aData.ID;
		}
		if (aData.FROM){
			var sTo = aData.FROM[0].VALUE;
			delete aData.FROM;
		}
		this.__xmpp._oob_cancel(aData, sID, sTo);
		break;

	case 'roster':

		//update roster
		if (aData.ITEM){
			var oldShow, sJID, sSub, sName, bRefresh = false, tmp;
			for(var i in aData.ITEM){
				sSub = aData.ITEM[i].ATTRIBUTES.SUBSCRIPTION;
				sJID = aData.ITEM[i].ATTRIBUTES.JID;
				sName= aData.ITEM[i].ATTRIBUTES.NAME;

				if (sSub == 'remove')
					dataSet.remove('xmpp', ['roster', sJID], true);
				else{
					//do not overwrite show icon with subscription ("both")
					oldShow = dataSet.get('xmpp', ['roster', sJID,'show']);
					if (!oldShow || sSub != 'both' || (sSub == 'both' && (oldShow == 'from' || oldShow == 'to')))
						dataSet.add('xmpp', ['roster', sJID,'show'], sSub, true);

					dataSet.add('xmpp', ['roster', sJID,'name'], sName, true);
					dataSet.add('xmpp', ['roster', sJID,'user'], sJID, true);
					dataSet.add('xmpp', ['roster', sJID,'group'],aData.ITEM[i].GROUP?aData.ITEM[i].GROUP[0].VALUE:'*', true);
				}
				bRefresh = true;
			}

			//prefill roster with COOKIE
			if (sPrimaryAccountIMHISTORY){
				var mem = Cookie.get(['im','queue']);
				if (mem)
					for(var sFrom in mem)
						if (dataSet.get('xmpp', ['roster', sFrom])){
							dataSet.add('xmpp', ['roster', sFrom, 'action'], 'msg', true);
							this._add(sFrom);
							bRefresh = true;
						}
						else
							Cookie.set(['im','queue',sFrom]);
			}

			if (bRefresh)
				dataSet.update('xmpp', ['roster']);
		}

		break;
	}
};

_me.__subscribed = function(bOK,sJID){
	this.__xmpp[bOK?'_user_subscribed':'_user_unsubscribed'](sJID);
};

_me.__update = function(sDataSet, aDName){
	if (aDName && aDName[0] == 'roster'){

		//Update Active
		if (!Is.Empty(this.__activeBuffer)){
			var aData = dataSet.get('xmpp', ['roster']);

			for (var sUID in this.__activeBuffer)
				if (!aData[sUID] || aData[sUID].action != 'msg')
					this._remove(sUID);
		}

		//Update roster
		this._fill();
	}
};


_me._getGroups = function (){
	var aData = dataSet.get('xmpp', ['roster']), out = {};
	for (var i in aData)
		out[aData[i].group] = true;

	return out;
};

_me._getGroupUsers = function(sGroup){
	var aTo;
	if (sGroup.indexOf('~')===0){
		var g = sGroup.replace(/^\~/g,''),
			aTo = [];

		if (g.indexOf(';')>-1)
			aTo = g.split('; ');
		else{
			var aTmp = dataSet.get('xmpp', ['roster']);
			for(var i in aTmp)
				if (aTmp[i].group == g)
					aTo.push(i);
		}
	}

	return aTo;
};

_me._doRefresh = function(b){
	this.__noRefresh = false;
	if (b || this.__doRefresh){
		this.__doRefresh = false;
		this._fill();
	}
};

/**
 * own sorting function - for sorting of users inside the group
 *
 * @param {object} a
 * @param {object} b
 * @return {number}
 */
_me.__sortUsr = function (a, b) {
	var n1 = (a.name || a.user),
		n2 = (b.name || b.user);

	if (n1 < n2) {
		return -1;
	}
	else if (n1 > n2) {
		return 1;
	}
	else {
		return 0;
	}
};

/**
 * own sorting function - for sorting of groups
 *
 * @param {string} n1
 * @param {string} n2
 * @return {number}
 */
_me.__sortGrp = function(n1, n2) {
	if (n2 === '*') {
		return -1;
	}
	if (n1 === '*') {
		return 1;
	}

	var tmp1 = n1.toLowerCase(),
		tmp2 = n2.toLowerCase();

	if (tmp1 !== tmp2) {
		n1 = tmp1;
		n2 = tmp2;
	}

	if (n1 < n2) {
		return -1;
	}
	else if (n1 > n2) {
		return 1;
	}
	else {
		return 0;
	}
};

/**
 * get sorted data for roster (sorted groups, sorted items in each group)
 *
 * @param {array} aCookie
 * @return {array}
 */
_me.__prepareData = function(aCookie) {
	var
		aData = {},
		aData2 = {},
		aGet = dataSet.get('xmpp', ['roster']),
		aGrpSort = [],
		aTmp, i;

	if (typeof aGet == 'object') {
		for (i in aGet) {
			//Strip all group cache items
			if (i.toString().charAt(0) !== '~'){
				if (!aData2[aGet[i].group]) {
					aData2[aGet[i].group] = [];
				}
				aTmp = aGet[i];
				aTmp.user = i;
				aData2[aGet[i].group].push(aTmp);
			}
		}
	}

	for (i in aData2) {
		aGrpSort.push(i);
		aData2[i].sort(this.__sortUsr);
	}
	aGrpSort.sort(this.__sortGrp);

	// MOVE ACTIV CONTACTS TO THE TOP
	/*
	var aTop = [];

	// Opened Chat
	if (this.__chat && !this.__chat._destructed)
		for (var n in this.__chat.__tabIndex)
			aTop.push(n);

	// Active users
	for (var n in aGet)
		if (aGet[n].action == 'msg' && (!this.__chat || !this.__chat.__tabIndex[n]))
			aTop.push(n);

	if (aTop.length){
		aGrpSort.unshift('-');
		aData2['-'] = [];

		for(var i = aTop.length-1; i>=0; i--)
			if (aGet[aTop[i]])
				aData2['-'].push(aGet[aTop[i]]);
	}
	*/

	for (i in aGrpSort) {
		aData[aGrpSort[i]] = aData2[aGrpSort[i]];
	}

	//clear cookie
	if (aCookie) {
		for (i in aCookie) {
			if (!aData2[i]) {
				Cookie.set(['im', 'roster', i]);
			}
		}
	}

	return aData;
};

/**
 * prepare html and css for rendering
 *
 * @param {string} id
 * @param {object} data
 * @return {object} {html: string, css: string}
 */
_me.__getHtmlUserRowParts = function(id, data) {
	var css, html;
	css = 'user_' + encodeURIComponent(data.show || 'offline');
	if (data.action) {
		css += ' action_' + encodeURIComponent(data.action);
	}
	html = '<h3>' + ((data.name ? data.name.trim() : '') || data.user || '').escapeHTML() + '</h3>';
	if (data.status) {
		css += ' status';
		html += '<h4>' + data.status.escapeHTML() + '</h4>';
	}
	if (this.__activeUser[data.user]) {
		css += ' active';
	}
	if (data.type) {
		css += ' ' + encodeURIComponent('set_' + data.type);
	}
	if (sPrimaryAccountGW && data.type !== 'service' && data.type !== 'email') {
		css += ' avatar';
		html += '<span class="bg">' + (data.name || data.user || '').substr(0, 1).escapeHTML() +'</span>';
		html += '<span></span>';
	}

	return {html: html, css: css, image: getAvatarURL(data.user, data.photo)};
};

/**
 * returns html of the user row
 *
 * @param {string} id
 * @param {object} data
 * @param {object} userRowParts
 * @return {string}
 */
_me.__getHtmlUserRow = function(id, data, userRowParts) {
	return '<li id="' + id + '" class="' + userRowParts.css + '" unselectable="on">' + userRowParts.html + '<em></em></li>';
};

/**
 * get localized group name
 *
 * @param {string} name
 * @return {string}
 */
_me.__getLocalizedName = function(name) {
	if ('*' === name) {
		return getLang('IM::OTHER');
	}
	else if ('~' === name) {
		return getLang('IM::NOT_LISTED');
	}
	else if ('-' === name) {
		return getLang('IM::INCOMMING');
	}
	else {
		return name;
	}
};

/**
 * returns html of the whole group
 *
 * @param {string} i
 * @param {boolean} isGroupClosed
 * @param {array} itemsInGroup
 * @param {boolean} renderGroup
 * @return {string}
 */
_me.__getHtmlGroupRow = function(i, isGroupClosed, itemsInGroup, renderGroup) {
	var groupName = this.__getLocalizedName(i);
	return '<li' + (isGroupClosed ? ' class="close"' : '') + '>' + '<div id="' + this._pathName + '/' + encodeURIComponent(i) + '"' +
		(renderGroup ? '' : ' class="notRendered"') + '>' + groupName.escapeHTML() +
		(renderGroup ? '<span>' + groupName.substr(0, 2).escapeHTML() + '</span>' : '') +
		'</div><ul>' + itemsInGroup.join('') + '</ul></li>';
};

/**
 * add a new image to this.__avatarCache
 *
 * @param {string} key
 * @param {string} imageUrl
 */
_me.__addToAvatarCache = function(key, imageUrl) {

	if (!this.__avatarCache[key]){
		this.__avatarCache[key] = new Image();

		var	me = this;
		this.__avatarCache[key].onload = function() {
			me.__setFromAvatarCache(key, this);
		};

		this.__avatarCache[key].onerror = function() {
			delete me.__avatarCache[key];
		};
	}

	if (this.__avatarCache[key].src != imageUrl)
		this.__avatarCache[key].src = imageUrl;
};

/**
 * set background image to corresponding element in roster (taken from this.__avatarCache)
 *
 * @param {string} key
 * @param {Image object} cachedImage
 */
_me.__setFromAvatarCache = function(key, cachedImage) {
	var	elm, span;
	if (cachedImage && cachedImage.naturalWidth && (elm = document.getElementById(key)) && (span = elm.getElementsByTagName('span')) && span[1] && !span[1].style.backgroundImage) {
		span[1].style.backgroundImage = 'url(' + cachedImage.src + ')';
		gui.tooltip._add(span[1], '<img class="avatar_preview" style="background-image: url(' + cachedImage.src + ')">', {x: '-75', y: '-155', html: true, css: 'borderless'});
	}
};

/**
 * attempt to set all cached images to elements in roster
 */
_me.__setAllAvatarCache = function() {
	for (var key in this.__avatarCache) {
		if (this.__avatarCache[key]) {
			this.__setFromAvatarCache(key, this.__avatarCache[key]);
		}
	}
};

/**
 * main render function of the roster with these parts:
 * - get all available data
 * - if some data should not be visible (e.g. are in the closed group) - remove them from rendering
 * - prepare html for partial rendering (render only what is visible + __extraRendering)
 * - render prepared html in DOM
 **/
_me._fill = function() {
	if (this.__showAllContacts)
		if (this.__noRefresh) {
			this.__doRefresh = true;
			return;
		}

	var groups = {},
		groupsForRender = [],
		aCookie = Cookie.get(['im', 'roster']),
		aData, i, j, itemsInGroup, totalItemsInGroup, sSearch, data, isGroupClosed, range, newTopPosition, renderRow, renderGroup, userRowParts, id, currentHeight;

	aData = this.__prepareData(aCookie);

	this.__totalHeight = 0;
	this.__renderedHeight = 0;

	// first round
	// - check if group should be visible or not (according to this.__showAllContacts property and its content)
	// - do not include some type of users (searching = filtering, offline users according to this.__showAllContacts property, active users)
	sSearch = this.inp_search._value().toLowerCase();
	for (i in aData) {
		isGroupClosed = false;
		itemsInGroup = {};
		totalItemsInGroup = 0;
		if (aData[i]) {
			isGroupClosed = aCookie && aCookie[i] ? true : false;
			for (j in aData[i]) {
				data = aData[i][j];
				if (sSearch && data.action !== 'msg' && (data.name || data.user).toLowerCase().indexOf(sSearch) === -1) {
					continue;
				}
				else
				if (!this.__showAllContacts && !sSearch && data.action !== 'msg' && ~['offline', 'both', 'from', 'none', 'to', ''].indexOf(data.show || '')) {
					continue;
				}
				else
				if (this.__activeBuffer[data.user]) {
					continue;
				}
				itemsInGroup[j] = data;
				totalItemsInGroup++;
			}
		}
		if (totalItemsInGroup > 0) {
			groups[i] = itemsInGroup;

			//Expected Height
			this.__totalHeight += this.__rowGroupHeight;
			if (!isGroupClosed)
				this.__totalHeight += totalItemsInGroup * this.__rowHeight;
		}
	}

	// second round - render only visible - see example at shared/_project/tests/functional/renderOnlyVisibleInHugeList/
	range = this.__getVisibleRange();

	// figure out real scrollTop after rendering
	if (range.scrollTop + range.viewPortHeight>this.__totalHeight)
		range.scrollTop = Math.max(0, this.__totalHeight - range.viewPortHeight);

	currentHeight = 0;
	for (i in groups) {
		isGroupClosed = false;
		itemsInGroup = [];
		if (groups[i]) {
			isGroupClosed = aCookie && aCookie[i] ? true : false;

			renderGroup = (currentHeight >= range.scrollTop - this.__extraRendering && currentHeight <= range.scrollTop + range.viewPortHeight + this.__extraRendering);

			if (renderGroup) {
				if (undefined === newTopPosition) {
					newTopPosition = currentHeight; // this will be the new top position
				}
				this.__renderedHeight += this.__rowGroupHeight;
			}
			currentHeight += this.__rowGroupHeight;
			totalItemsInGroup = 0;

			if (isGroupClosed === false) {
				for (j in groups[i]) {
					data = groups[i][j];

					renderRow = (currentHeight >= range.scrollTop - this.__extraRendering && currentHeight <= range.scrollTop + range.viewPortHeight + this.__extraRendering);

					if (renderRow) {
						id = this._pathName + '/' + encodeURIComponent(i) + '/' + encodeURIComponent(data.user);
						userRowParts = this.__getHtmlUserRowParts(id, data);

						this.__addToAvatarCache(id, userRowParts.image);

						if (undefined === newTopPosition) {
							newTopPosition = currentHeight; // this will be the new top position
						}
						itemsInGroup.push(this.__getHtmlUserRow(id, data, userRowParts));
						this.__renderedHeight += this.__rowHeight;
					}
					currentHeight += this.__rowHeight;
					totalItemsInGroup++;
				}
			}
		}

		groupsForRender.push(this.__getHtmlGroupRow(i, isGroupClosed, itemsInGroup, renderGroup));
	}

	// render prepared html in DOM
	var eChild = this.__body.firstChild;
	if (!eChild || eChild.tagName !== 'UL') {
		eChild = mkElement('UL', {className:"huge_content"});
		this.__body.innerHTML = '';
		this.__body.appendChild(eChild);
	}

	this.__body.style.height = this.__totalHeight + 'px';
	this.__body.firstChild.style.top = newTopPosition + 'px';

	eChild.innerHTML = groupsForRender.join('');

	if (this.__totalHeight < this.__lastScrollTop) {
		// correct scrolling if there is not enought content to display
		this.__lastScrollTop = Math.max(0, this.__totalHeight - range.viewPortHeight);
		this.__body.parentNode.scrollTop = this.__lastScrollTop;
	}
	this.__renderedScrollTop = this.__lastScrollTop;

	this.__setAllAvatarCache();
};


/**
 * Drag & Drop
 **/
_me.__initdrag = function(id, sType, x, y) {
	var sBody, i, value;
	if (this._is_active()) {
		if (!this.__activeUser[id]) {
			this._activate(id);
		}
		if ((id = arrayKeys(this.__activeUser))) {
			//prepare data
			sBody = '';
			for (i in id) {
				value = dataSet.get('xmpp', ['roster', id[i], 'name']);
				if (!value || (value && '' === value.trim())) {
					value = id[i];
				}
				sBody += '<div class="drag_folder drag_' + sType + '">' + value.escapeHTML() + '</div>';
			}
			//create Drag box
			gui.frm_main.dnd.create_drag(sBody, {type:sType, value:id}, x, y);
		}
	}
};

_me._active_dropzone = function(v){

	this.__aDragGroups = [];
	var elms = this.__body.getElementsByTagName('DIV'), tmp;
	for(var i = 0; i<elms.length; i++){
		tmp = getSize(elms[i]);
		tmp.id = elms[i].id;
		tmp.h = elms[i].parentNode.clientHeight;

		this.__aDragGroups.push(tmp);
	}

	this.__objPos = getSize(this.__body.parentNode);

	return true;
};

_me._ondragover = function(v){

	//obey scroll
	if (!this.__dragON){
		this.__dragON = true;
		gui._obeyEvent('mousewheel',[this,'__mousewheel']);
	}

	//scroll on move
	if (this.__objPos){
		var delta;
		if (((delta = gui.__Y - this.__objPos.y)<51 && (delta -= 50)) || ((delta = gui.__Y - this.__objPos.y - this.__objPos.h)>-51 && (delta += 50)))
			this.__body.parentNode.scrollTop += Math.floor(delta/10);
	}

	var tmp = this.__body.getElementsByTagName('UL');
	if (tmp && (tmp = tmp[0])){
		tmp = getSize(tmp);

		if (v.y > tmp.y && v.y < tmp.y + tmp.h)
		    return true;
	}

	return false;
};

_me._ondragout = function(v){
	//disobey scroll
	gui._disobeyEvent('mousewheel',[this,'__mousewheel']);
	this.__dragON = false;
};

_me._ondrop = function(v){
	//disobey scroll
	gui._disobeyEvent('mousewheel',[this,'__mousewheel']);
	this.__dragON = false;

	if (v.value){
		var elms = this.__body.getElementsByTagName('DIV'), tmp;
		for(var i = 0; i<elms.length; i++){
			tmp = getSize(elms[i]);
			tmp.h = elms[i].parentNode.clientHeight;

			if (v.x > tmp.x && v.x < tmp.x+tmp.w && v.y > tmp.y && v.y < tmp.y + tmp.h)
				this._addGroup(decodeURIComponent(elms[i].id.split('/').pop()),v.value);
		}
	}
};

_me.__mousewheel = function(e){
	this.__body.scrollTop += e.delta*20;
};



_me._add = function(sUID, bNew){

	var bCSSAnim = false,
		bCSSMove = false,
		aUser = dataSet.get('xmpp', ['roster', sUID], true);

	if (!aUser)	return;

	if (this.__activeBuffer[sUID]){

		if (bNew) return;

		if (!this.__activeBuffer[sUID].anim){

			// if MSG move UP
			//if (aUser.action == 'msg')
			if (this.__activeBuffer[sUID].elm.parentNode.firstChild !== this.__activeBuffer[sUID].elm){
				if ('transition' in document.body.style)
					bCSSMove = true;
				//IE9 Fallback
				else
					this.__activeBuffer[sUID].elm.parentNode.insertBefore(this.__activeBuffer[sUID].elm, this.__activeBuffer[sUID].elm.parentNode.firstChild);
			}
			else
			if (this.__activeBuffer[sUID].action != aUser.action){
				bCSSAnim = true;
			}
		}
	}
	else{

		this.__activeBuffer[sUID] = {elm:mkElement('li',{id:this._pathName +'/'+ sUID})};

 		if (/*aUser.action == 'msg' && */this._getAnchor('chats').firstChild){
			if ('transition' in document.body.style){
				this._getAnchor('chats').appendChild(this.__activeBuffer[sUID].elm);
				bCSSMove = true;
			}
			//IE9 fallback
			else
				this._getAnchor('chats').insertBefore(this.__activeBuffer[sUID].elm, this._getAnchor('chats').firstChild);
		}
		else{
			this._getAnchor('chats').appendChild(this.__activeBuffer[sUID].elm);
			bCSSAnim = true;
		}
	}


	this.__activeBuffer[sUID].action = aUser.action || 'msg';

	// content
	var css = 'user_' + encodeURIComponent(aUser.show || 'offline') + ' action_' + encodeURIComponent(this.__activeBuffer[sUID].action),
		txt = '<h3>'+ (aUser.name || aUser.user || sUID).escapeHTML()+'</h3>';

	if (aUser.status){
		css += ' status';
		txt += '<h4>'+ aUser.status.escapeHTML() +'</h4>';
	}

	if (aUser.type)
		css += ' '+encodeURIComponent('set_'+aUser.type);

	if (sPrimaryAccountGW && aUser.type != 'service' && aUser.type != 'email'){
		css += ' avatar';

		txt += '<span class="bg">'+ (aUser.name || aUser.user || sUID).substr(0,1).escapeHTML() +'</span>';
		txt += '<span style="background-image: url(\''+getAvatarURL(sUID) +'\')"></span>';
	}

	this.__activeBuffer[sUID].elm.innerHTML = txt + '<em></em>';
	gui.tooltip._add(this.__activeBuffer[sUID].elm.querySelectorAll('span')[1], '<img class="avatar_preview" style="background-image: url(' + getAvatarURL(sUID) + ')">', {x: '-75', y: '+36', html: true, css: 'borderless'});

	//set css
	this.__activeBuffer[sUID].elm.className = css;

	//set active
	this._activate_active();

	//Update layout
	this.__height();

	//start animations
	if (bCSSMove)
		this.__animate(sUID);
	else
	if (bCSSAnim)
		addcss(this.__activeBuffer[sUID].elm,'anim');

	//Remove user from roster
	var elm = document.getElementById(this._getID(sUID));
	if (elm)
		this._fill();
};

_me._activate_active = function(){
	for(var id in this.__activeBuffer)
		if (this.__activeUser[id])
			addcss(this.__activeBuffer[id].elm, 'active');
		else
			removecss(this.__activeBuffer[id].elm, 'active');
};

_me._remove = function(sUID){

	//DO NOT REMOVE user with msg
	if (this.__activeBuffer[sUID]/* && this.__activeBuffer[sUID].action != 'msg'*/){

		if (this.__activeBuffer[sUID].elm && this.__activeBuffer[sUID].elm.parentNode)
			this.__activeBuffer[sUID].elm.parentNode.removeChild(this.__activeBuffer[sUID].elm);

		if (this.__activeBuffer[sUID].anim){

			if (this.__activeBuffer[sUID].anim.interval)
				clearInterval(this.__activeBuffer[sUID].anim.interval);

			if (this.__activeBuffer[sUID].anim.etop && this.__activeBuffer[sUID].anim.etop.parentNode)
				this.__activeBuffer[sUID].anim.etop.parentNode.removeChild(this.__activeBuffer[sUID].anim.etop);

			if (this.__activeBuffer[sUID].anim.ebottom && this.__activeBuffer[sUID].anim.ebottom.parentNode)
				this.__activeBuffer[sUID].anim.ebottom.parentNode.removeChild(this.__activeBuffer[sUID].anim.ebottom);
		}

		delete this.__activeBuffer[sUID];

		this.__height();

		//Add user back to roster
		if (dataSet.get('xmpp', ['roster',sUID]))
			this._fill();
	}
};

_me.__animate = function(sUID){
	var elm;

	if (this.__activeBuffer[sUID] && !this.__activeBuffer[sUID].anim && (elm = this.__activeBuffer[sUID].elm)){

		this.__activeBuffer[sUID].anim = {
			etop:mkElement('li', {className:'helper top'}),
			ebottom:mkElement('li', {className:'helper bottom'})
		};

		var offset = elm.offsetTop,
			height = elm.offsetHeight,
			me = this;

		elm.parentNode.insertBefore(this.__activeBuffer[sUID].anim.etop, elm.parentNode.firstChild);
		if (elm.nextSibling)
			elm.parentNode.insertBefore(this.__activeBuffer[sUID].anim.ebottom, elm.nextSibling);
		else
			elm.parentNode.appendChild(this.__activeBuffer[sUID].anim.ebottom);

		//Animate
		elm.style.position = 'absolute';
		elm.style.zIndex = 100;
		elm.style.top = offset + 'px';
		elm.style.transitionDuration = (offset/200) + 's';

		this.__activeBuffer[sUID].anim.interval = setTimeout(function(){

			if (elm)
				elm.style.top = '0';

			if (me.__activeBuffer[sUID] && me.__activeBuffer[sUID].anim){

				me.__activeBuffer[sUID].anim.etop.style.height = height + 'px';
				me.__activeBuffer[sUID].anim.ebottom.style.height = '0';

				me.__activeBuffer[sUID].anim.interval = setTimeout(function(){

					if (elm && elm.parentNode){

						if (me.__activeBuffer[sUID] && me.__activeBuffer[sUID].anim && me.__activeBuffer[sUID].anim.etop)
							elm.parentNode.replaceChild(elm, me.__activeBuffer[sUID].anim.etop);

						elm.style.position = '';
						elm.style.zIndex = '';
						elm.style.transitionDuration = '';
					}

					if (me.__activeBuffer[sUID] && me.__activeBuffer[sUID].anim){
						if (me.__activeBuffer[sUID].anim.ebottom)
							me.__activeBuffer[sUID].anim.ebottom.parentNode.removeChild(me.__activeBuffer[sUID].anim.ebottom);

						delete me.__activeBuffer[sUID].anim;
					}

				}, (offset/0.2) + 30);
			}

		},100);

	}
};

_me.__height = function(){
	var m = 0,
		active = this.__active.parentNode,
		recent = this.__recent.parentNode;

	if (Is.Empty(this.__activeBuffer)){
		active.style.display = '';
		recent.style.display = '';

		var r = Cookie.get(['im_recent']);
		if (Is.Array(r) && r.length)
			removecss(this.__recent,'empty');
	}
	else{
		recent.style.display = '';

		if (recent.style.display != 'none')
			recent.style.display = 'none';

		if (active.style.display != 'block')
			active.style.display = 'block';

		m = active.offsetHeight;
	}

	this.__body.parentNode.parentNode.style.top = m?m + 'px':'';
};

_me._getID = function(sUID){
	var aUser = dataSet.get('xmpp', ['roster', sUID]);
	return this._pathName +'/'+ encodeURIComponent(aUser.group) +'/'+ encodeURIComponent(aUser.user);
};

_me._getStatus = function(sJID){
	return this.__xmpp._user_status(sJID);
};

_me._status = function(sStatus, sStatusText){
	if (sStatus)
		this.__xmpp._presence(sStatus, sStatusText);
	else
		return this._getStatus();
};
_me._getStatusText = function(){
	return this._getStatus() === 'offline'?'':dataSet.get('xmpp', ['statusText']) || '';
};
