_me = frm_chat.prototype;
function frm_chat(){};

_me.__constructor = function() {
	var me = this;

	this._title('IM::IM');

	//this._autofocusfields(false);

	this.__options = {
		history: 20
	};

	//Dock to the Status Bar
	// if (gui.frm_main.dock && gui.frm_main.dock.status)
	// 	this._mydock = gui.frm_main.dock.status;

	this._defaultSize(-1,-1,800,500);

	this.__tabIndex = {};

	//Tab part
	this._create('tabs','obj_vtabs');

	this.tabs._draw('frm_chat_search','main',null,true);

	this.tabs._create('inp_add','obj_suggest_im','header','inp_add obj_input_100');
	this.tabs.inp_add._getFocusElement().setAttribute('iw-focus', 'false');
	this.tabs.inp_add.__minWidth = 400;
	this.tabs.inp_add._placeholder(getLang('IM::ADD_PH'));
	this.tabs.inp_add._onsubmit = function(){
		if (this._value().length){
			var aParsed = MailAddress.splitEmailsAndNames(this._value())[0];
			if (aParsed && aParsed.email && dataSet.get('xmpp',['roster', aParsed.email])){
				me.__im._chat(aParsed.email);
				this._value('');
			}
			else{
				addcss(this._main,'error');
				return;
			}
		}
		removecss(this._main,'error');
	};
	this.tabs.inp_add._onchange = function(){
		if (!this._value().length)
			removecss(this._main,'error');
	};

	this.tabs.inp_add._onclose = function(e){
		if (this._value().length){
			this._value('');

			if (e.preventDefault) e.preventDefault();
			if (e.stopPropagation) e.stopPropagation();
			e.cancelBubble = true;
			return false;
		}
	};

	this.tabs._getAnchor('search_close').onclick = function(){
		//focus input
		this._onresize_end();

		removecss(this._main, 'search');

		//clear search
		this.tabs.search._value('');
		this.tabs.search._onsubmit();

	}.bind(this);

	this.tabs.search._placeholder(getLang('IM::SEARCH_PH'));

	this.tabs.search._onclose = function(e){

		e.cancelBubble = true;
		if (e.stopPropagation)
			e.stopPropagation();
		if (e.preventDefault)
			e.preventDefault();

		this.tabs._getAnchor('search_close').onclick();

	}.bind(this);

	this.tabs.search._onsubmit = function(){

		if (!(this.__im && this.__im._is_active()))
			return;

		var tab = this._getTab(),
			sFrom = this._getName(tab._name),
			s = this.tabs.search._value();

		if (tab && tab.__search != s){
			tab.__search = s;

			dataSet.remove('xmpp',['roster',sFrom,'last_history'], true);
			dataSet.remove('xmpp',['roster',sFrom,'history'], true);

			if (tab.chat){
				tab.chat._clear();
				if (tab.chat._request)
					tab.chat._request(true);
			}
		}
	}.bind(this);


	this.tabs._create('menu','obj_hmenu','main','border');
	this.tabs.menu.__redraw = function(sJID){
		var a = [], b = sJID.indexOf('~')===0,
			sName = me._getUserName(sJID);

		a.push(
			{"text":'', tooltip:'FORM_BUTTONS::SEARCH', "arg":'search', "css":'ico img ico_search', disabled:b || !sPrimaryAccountIMHISTORY}
			//{"text":'', tooltip:'IM::VCARD', "arg":'vcard', "css":'ico img ico_vcard', disabled:b},
			//{"text":'', tooltip:'IM::HISTORY', "arg":'history', "css":'ico img ico_history', disabled:b}
			//{"text": '',tooltip:'IM::SEND_FILE', "arg": 'file',"css": 'ico img ico_file'},
			//{"text": '',tooltip: dataSet.get('conference',['live']) ? 'IM::INVITE' : 'IM::CONFERENCE',"arg": 'share',"css": 'ico img ico_conference',disabled:!sPrimaryAccountCONFERENCE}
			//{"text": '',"title2":'IM::CLOSETAB',"arg": 'close',"css": 'ico img ico_close'}
			//{"text": '',"title2":'COMMON::CLEAR',"arg": 'clear',"css": 'ico img ico_clear',disabled:b}
		);

		if (currentBrowser() !== 'MSIE9' && window.sPrimaryAccountSIP && location.protocol == 'https:' && (GWOthers.getItem('RESTRICTIONS', 'disable_sip') || 0)<1){
			a.push(
				{"text": '', tooltip:'DIAL::VIDEO', "arg":'video', "css":'ico img ico_video'},
				{"text": '', tooltip:'DIAL::CALL', "arg":'call', "css":'ico img ico_call'}
			);
		}

		a.push({"anchor": 'name', css: 'name'});

		me.tabs.menu._fill(a);

		//Single User
		//if (sPrimaryAccountGW && sJID && !b && dataSet.get('xmpp',['roster',sJID,'type'])!='service'){
			//	me.tabs.menu._getAnchor('avatar').style.backgroundImage = 'url(\'+getAvatarURL(sJID) +'\')';
		//}

		var eName = me.tabs.menu._getAnchor('name');

		if (b)
			addcss(eName,'group');
		else
			removecss(eName,'group');

		eName.innerHTML = sName.escapeHTML();
		eName.onclick = function(e){
			this._onclick(e,'','','vcard');
		}.bind(this);
	};

	this.tabs.menu._onclick = function(e,elm,id,arg){
		var sJID = this._getName(this.tabs._value());

		switch(arg){
			case 'call':
				gui.frm_main._call(sJID);
				break;

			case 'video':
				gui.frm_main._call(sJID, true);
				break;

			case 'search':
				addcss(this._main, 'search');
				this.tabs.search._focus();
				break;
			case 'vcard':
				if (sJID.indexOf('~') !== 0)
					gui._create('frm_im_vcard', 'frm_im_vcard', '', '', sJID, me.__im.__xmpp);
				break;
		}
	}.bind(this);

	this.__title = function (v){
		var v = v;
		if (v.indexOf('~')===0){
			var aTmp = dataSet.get('xmpp', ['roster']),
				g = v.replace(/^\~/g,'');

			v = '';
			for(var i in aTmp)
				if (aTmp[i].group == g)
					v += v?'; '+i:i;

			v = v || g;
		}
		else{
			var aData = dataSet.get('xmpp',['roster',v]);
			if (aData.name)
				v = getLang('STATUS::CHAT_WITH', [MailAddress.createEmail(aData.name,v, true)]);

			this._getAnchor('ico').className = 'obj_popupico '+ (aData.type?encodeURIComponent('set_'+aData.type)+' ':''); // + (aData.show?encodeURIComponent(aData.show):'offline');

			if (this.__lastStatus)
				removecss(this._main, this.__lastStatus);

			this.__lastStatus = (aData.show?encodeURIComponent(aData.show):'offline');
			addcss(this._main, this.__lastStatus);
		}

		this._title(v,true);
	};


	if ((GWOthers.getItem('IM','enter_send') || 0)<1){
		this._create('btn_send', 'obj_button', 'footer', 'ok noborder color1 x_btn_right simple');
		this.btn_send._value('COMPOSE::SEND');
		this.btn_send._onclick = function(){
			me._send();
		};
	}

	//sip integration
	if (window.sPrimaryAccountSIP && (GWOthers.getItem('RESTRICTIONS', 'disable_sip') || 0)<1)
		this._listen('sip');
};

_me.__update = function(sDName,aDPath){
	if (gui.frm_main.sip){
		var ds = dataSet.get('sip');
		if (ds && ds.state == 'online')
			switch (ds.activity){
				case 'Phoning':
				case 'Ringing':
				case 'Calling':
					if (ds.p1 && this.__tabIndex[ds.p1])
						this._sip_init(ds.p1);
					return;
			}
	}

	// Update chat menu to reflect current SIP status
	var sJID = this.tabs && this.tabs.menu && this._getName(this.tabs._value());
	if (sJID)
		this.tabs.menu.__redraw(sJID);
};


_me._sip_init = function(sName){
	var tab;
	if (sName && (tab = this.__tabIndex[sName]) && (tab = this.tabs[tab])){

		if (!tab.sip || tab.sip._destructed){
			if (this.sip)
				this.sip._destruct();

			this.sip = tab._create('sip','obj_chat_voip','chat');
		}
	}
};

_me._getRecipients = function() {
	var aTo = [],
		v = this.tabs._value();

	if (v && (tab = this.tabs[v])){
		var sTo = tab.__sJID;

		if (sTo.indexOf('~')===0)
			aTo = this.__im._getGroupUsers(sTo);

		aTo = (aTo && aTo.length) ? aTo : [sTo];
	}

	return aTo;
};

_me._send = function(sMessage,bConference){

	var tab, sTo, v = this.tabs._value(),
		b = sMessage || this.tabs[v].text._value();

	if (b.length){

		if (v && this.tabs[v])
			sTo = this.tabs[v].__sJID;

		if (gui.frm_main && gui.frm_main.sound && GWOthers.getItem('IM','sound_notify')>0)
			gui.frm_main.sound._play('im_out');

		if (bConference)
			this.__im._send(sTo, b+' '+dataSet.get('conference',['information','url']), true);
		else
		if (this.__im._send(sTo, b)){
			if (this.tabs && (tab = this.tabs[v])) {
				tab.text._value('');
				if (tab.text.__options && tab.text.__options.memory && tab.text.__options.memory.set){
					executeCallbackFunction(tab.text.__options.memory.set, '');
				}
			}
			//Group Tab is already closed, clear its input memory manually
			else{
				dataSet.remove('xmpp',['roster', sTo, 'input'], true);
			}
		}

		if (this.tabs && this.tabs[v])
			this.tabs[v]._animate();
	}

	if (this.tabs && this.tabs[v])
		this.tabs[v].text._focus(true);
};

// user is composing...
_me._compose = function(sJID){
	var tab,
		me = this,
		tmp = this.__tabIndex[sJID.split('/').shift()];

	if (sJID && tmp && (tab = this.tabs[tmp])){
		addcss(tab.__eLi, 'im_compose',true);

		try{
			if (tab._isActive)
				addcss(this.tabs.menu._getAnchor('avatar').parentNode,'im_compose');
		}
		catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r)}

		//Auto wait 10s
		setTimeout(function(){
			try{ me._wait(sJID) }catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r)}
		},10000);
	}
};
_me._wait = function (sJID){
	var tab,
		tmp = this.__tabIndex[sJID.split('/').shift()];

	if (sJID && tmp && (tab = this.tabs[tmp])){
		removecss(tab.__eLi, 'im_compose',true);
		try{
			if (tab._isActive)
				removecss(this.tabs.menu._getAnchor('avatar').parentNode,'im_compose');
		}
		catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r)}
	}
};
_me._gone = function (sJID){
	if (sJID){
		var jid = sJID.split('/').shift(),
			tab = this._getChat(jid);

		if (tab && tab.chat)
			tab.chat._notice(jid, getLang('STATUS::GONE'));
	}
};






_me._getTab = function(tab){
	var tab = tab || this.tabs._value();
	if (tab && (tab = this.tabs[tab]))
		return tab;
};
_me._getName = function(sTab){
	for (var i in this.__tabIndex)
		if (this.__tabIndex[i] == sTab)
			return i;

	return false;
};

// return focus back after move/undock
_me._onresize_end = function (){
	var tab = this.tabs._value();
	if (tab && (tab = this.tabs[tab]) && tab._wasActivated)
		tab.text._focus(true);

	return true;
};
_me._ondock = function (){

	var css = '';
	var unread = 0;
	var title = '';
	for(var sFrom in this.__tabIndex) {
		if (dataSet.get('xmpp', ['roster', sFrom, 'action'])){
			css = 'event';
			unread++;
		}
	}

	if (unread === 1)
		title = getLang('IM::NEW_CHAT');
	else
	if (unread > 1)
		title = getLang('IM::NEW_CHATS', [unread]);
	else
		title = getLang('IM::CHAT_TITLE');

	return {title:title, css:css};
};
_me._onundock = function (){
	var tab = this.tabs._value();
	if (tab && (tab = this.tabs[tab]) && tab._wasActivated){
		//set focus
		tab.text._focus(true);

		//scroll chat
		tab.chat._scroll();
	}

	return true;
};

_me._onfocus = function(bSkipFocus){

	var tab = this.tabs._value();
	if (tab && (tab = this.tabs[tab]) && tab._isActive){

		var sFrom = tab.__sJID;

		//COOKIE - odebrat
		if (Cookie.get(['im','queue',sFrom]) == 1){
			Cookie.set(['im','queue',sFrom]);

			var oNot = dataSet.get('xmpp', ['roster', sFrom, 'notification']);
			if (oNot){
				try{
					oNot.close();
				}
				catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r)}

				dataSet.remove('xmpp', ['roster', sFrom, 'notification'], true);
			}

			dataSet.remove('xmpp', ['roster', sFrom, 'action']);
			dataSet.update('main', ['im']);
			removecss(tab.__eLi, 'im_event');

			// if (!bSkipFocus)
			// 	setTimeout(function(){if (tab && tab.text) tab.text._focus();},0);
		}
		else
			dataSet.remove('xmpp', ['roster', sFrom, 'action']);
	}
};


_me._getChat = function(sFrom){
	if (this.__tabIndex[sFrom] && this.tabs[this.__tabIndex[sFrom]])
		return this.tabs[this.__tabIndex[sFrom]];
};

_me._getUserName = function(sFrom){
	var sName;
	if (sFrom.indexOf('~')===0){

		sName = sFrom.replace(/^\~/g,'');

		if (sName == '*')
			sName = getLang('IM::OTHER');
		else
		if (sName == '~')
			sName = getLang('IM::NOT_LISTED');
		else
		if (sFrom.indexOf(';')>-1)
			sName = getLang('IM::SELECTED');
	}
	else
	if (!(sName = dataSet.get('xmpp', ['roster', sFrom, 'name']))){
		sName = sFrom;
		if (sName.indexOf('@')>0)
			sName = sName.split('@').shift();
	}

	return sName;
};

_me._createChat = function(sFrom, bActive, bTop){

	var tab = this._getChat(sFrom);

	if (!tab){
		var me = this;

		//Get User name
		var sName = this._getUserName(sFrom),
			isGroup = sFrom.indexOf('~') === 0;

		//Create TAB
		tab = this.tabs._create('tab','obj_tab_close','main',isGroup?'group':'', bTop);
		tab._wasActivated = false;
		tab.__sName = sName;
		tab.__sJID = sFrom;
		tab.__search = '';

		if (!isGroup)
			dataSet.add('xmpp',['roster',sFrom,'active'], false, true);

		if (sPrimaryAccountGW && !isGroup)
			tab._value(sName.escapeHTML() + '<i style="background-image: url(\''+ getAvatarURL(sFrom) +'\')"></i><u><span></span><span></span><span></span></u>',true);
		else
			tab._value(sName.escapeHTML() + '<u><span></span><span></span><span></span></u>',true);

		//Add TAB Methods
		tab._animate = function(){

			removecss(this.__eLi, 'im_compose');

			if (me._docked || !this._isActive || (this._isActive && !this.text._hasFocus())) {

				addcss(this.__eLi, 'im_event');

				//COOKIE - zapsat
				if (Cookie.get(['im','queue',this.__sJID]) != 1){
					dataSet.add('xmpp', ['roster', this.__sJID, 'action'], 'msg');
					Cookie.set(['im','queue',this.__sJID], 1);
					dataSet.update('main', ['im']);
				}
			}
			else
				dataSet.remove('xmpp', ['roster', this.__sJID, 'action']);

			//Animate
			if (this.__eLi.parentNode.firstChild !== this.__eLi && !this.__animation) {

				//Modern Browsers
				if ('transition' in document.body.style){

					var offset = getSize(this.__eLi).y - getSize(this.__eLi.parentElement).y + this.__eLi.parentElement.scrollTop,
						height = this.__eLi.offsetHeight;

					//create helpers
					this.__animation = {
						etop:mkElement('li', {className:'anim top'})
					};

					this.__eLi.parentElement.insertBefore(this.__animation.etop, this.__eLi.parentNode.firstChild);
					if (this.__eLi.nextSibling){
						this.__animation.ebottom = mkElement('li',{className:'anim bottom'});
						this.__eLi.parentNode.insertBefore(this.__animation.ebottom, this.__eLi.nextSibling);
					}

					//Animate
					var iDuration = Math.ceil(Math.min(500, offset*1.5));

					this.__eLi.style.transitionDuration = '0ms';
					this.__eLi.style.top = offset + 'px';

					addcss(this.__eLi, 'animate');

					//Start Animation
					this.__animation.interval = setTimeout(function(){

						if (!this.__eLi) return;

						this.__eLi.style.transitionDuration = iDuration + 'ms';
						this.__animation.etop.style.transitionDuration = iDuration + 'ms';
						if (this.__animation.ebottom) this.__animation.ebottom.style.transitionDuration = iDuration + 'ms';

						this.__eLi.style.top = this.__animation.etop.offsetTop + 'px';

						this.__animation.etop.style.height = height + 'px';
						if (this.__animation.ebottom)
							this.__animation.ebottom.style.height = '0';

						this.__animation.interval = setTimeout(function(){

							if (this.__eLi && this.__eLi.parentNode){
								this.__eLi.parentNode.replaceChild(this.__eLi, this.__animation.etop);

								removecss(this.__eLi, 'animate');
								this.__eLi.style.top = '0';
								this.__eLi.style.transitionDuration = '0ms';
							}

							if (this.__animation.ebottom)
								this.__animation.ebottom.parentNode.removeChild(this.__animation.ebottom);

							delete this.__animation;

							//scroll top
							if (this._isActive)
								tab._parent._getAnchor('header2').scrollTop = 0;

						}.bind(this), iDuration + 30);

					}.bind(this), 100);

				}
				//Old IE9
				else{
					this.__eLi.parentNode.insertBefore(this.__eLi, this.__eLi.parentNode.firstChild);

					//scroll top
					if (this._isActive)
						tab._parent._getAnchor('header2').scrollTop = 0;
				}
			}

		};


		tab._onclose = function(){

			//kill animation
			if (this.__animation){
				if (this.__animation.interval)
					clearTimeout(this.__animation.interval);

				if (this.__animation.etop)
					this.__animation.etop.parentNode.removeChild(this.__animation.etop);

				if (this.__animation.ebottom)
					this.__animation.ebottom.parentNode.removeChild(this.__animation.ebottom);
			}

			//clear search history
			if (this.__search){
				dataSet.remove('xmpp',['roster',this.__sJID,'last_history'], true);
				dataSet.remove('xmpp',['roster',this.__sJID,'history'], true);
			}
			else
			//crop history to 50
			if (sPrimaryAccountIMHISTORY){
				var ds = dataSet.get('xmpp',['roster',this.__sJID]);

				if (ds.invalid_history){
					delete ds.invalid_history;
					delete ds.last_history;
					delete ds.history;
				}
				else
				if (ds.history && ds.history.length>40){
					delete ds.last_history;
					ds.history = ds.history.slice(-40);
				}
			}

			if (count(me.__tabIndex) == 1 && !me._destructed) {
				Cookie.set(['im_recent'], []);
				me._destruct();
			}
		};

		tab._oncontext = function(e){

			if (!me.__im) return;

			var id = this.__sJID,
				bLogin = !me.__im._is_active();

			if (!id || id.indexOf('~')==0) return;

			var aMenu = [
				{'title':'IM::VCARD','arg':{'method':'vcard',id:id},disabled:bLogin},
				{'title':'IM::SEND_MAIL','arg':{'method':'send',id:id}},
				{'title':'IM::SEND_FILE','arg':{'method':'file',id:id},disabled:bLogin},
				{'title':'-'},
				{'title':'IM::SUBSCRIPTION',nodes:[
					{'title':'IM::SEND','arg':{method:'sub_add',id:id}},
					{'title':'IM::REQUEST','arg':{method:'sub_get',id:id}},
					{'title':'IM::REMOVE','arg':{method:'sub_remove',id:id}}
				],disabled:bLogin}
				];

			var cmenu = gui._create("cmenu","obj_context",'','',this);
				cmenu._fill(aMenu);
				cmenu._place(e.clientX,e.clientY);
				cmenu._onclick = function(e,elm,id,arg){
					me.__im._oncontext(e,elm,id,arg);
				};
		};

		tab.__update = function(sDName,sDPath){

			if (sDName && sDPath && sDPath[0] == 'roster' && sDPath[1] == this.__sJID){

				var ds = dataSet.get(sDName, ['roster',this.__sJID]);
				if (ds){
					//STATUS
					var sStatus = me.__im._getStatus(this.__sJID);

					if (this.__eLi.__laststate != sStatus){

						if (this.__eLi.__laststate)
							removecss(this.__eLi, this.__eLi.__laststate);

						this.__eLi.__laststate = sStatus;
						addcss(this.__eLi, sStatus);

						if (this._isActive){
							me.__title(sDPath[1]);

							if (this.chat)
								this.chat._notice(sDPath[1], getLang('STATUS::' + sStatus.toUpperCase()));
						}
					}

					//MESSAGE
					if (ds.action == 'msg')
						addcss(this.__eLi, 'im_event');
					else
						removecss(this.__eLi, 'im_event');
				}
			}
		};

		//remove tab from tabindex
		tab.__onDestruct = function (){

			var uid = this.__sJID,
				nxt, bFound = false;

			//Find next tab
			for(var i in me.__tabIndex){
				if (i === this.__sJID){
					bFound = true;
					continue;
				}

				var nxt = me.__tabIndex[i];
				if (bFound)
					break;
			}

			// If user exist, remove from list
			if (this._wasActivated){
				var usr = dataSet.get('xmpp',['roster', uid]);
				if (usr && usr.show && usr.show!='offline' && '1' !== GWOthers.getItem('IM','disable_gone_message'))
					me.__im.__xmpp._msg_status(uid+(usr.resource?'/'+usr.resource:''),'gone');
			}

			// users chat is closed
			if (!isGroup)
				dataSet.remove('xmpp',['roster',sFrom,'active'], true);

			delete me.__tabIndex[uid];

			// Activate current or closest tab to update view
			if(!me._destructed && me.tabs[nxt])
				me.tabs[nxt]._active();
		};

		tab.__addItems = function(files) {
			this.__upload_buffer = files.map(function (file) {
				return {
					'class': 'item',
					'description': file.title,
					'size': file.size,
					'fullpath': file.fullpath
				};
			});

			return this.upload._onuploadend();
		};

		tab._onactive = function(bFirstTime, bClick){

			if (this._destructed)
				return;

			if (bFirstTime){

				//Template
				this._draw('frm_chat_form','main');

				//Height fix
				msiebox(this._getAnchor('msiebox'));

				//Upload
				//this._create('progress', 'obj_progress','main','noborder max transparent simple mono');
				this._create('upload','obj_upload');

				this.upload._onuploadstart = function(){
					//this.progress._value(0);

					//SHOW
					this.text._create('info', 'obj_upload_info', 'block');
					addcss(this.text._main, 'block');

					this.__upload_buffer = [];
				}.bind(this);

				this.upload._onuploadend = function(){
					//this.progress._value(0);

					//HIDE
					removecss(this.text._main, 'block');
					this.text.info && this.text.info._destruct();

					if (this.__upload_buffer.length){

						if (sPrimaryAccountWebDAV){

							var d = new IcewarpDate(),
								aItemInfo = {values:{},ATTACHMENTS:[]};
								aItemInfo.values.EVNSHARETYPE = 'U';
								aItemInfo.values.EVNSTARTDATE = d.format(IcewarpDate.JULIAN);
								aItemInfo.values.EVNSTARTTIME = d.hour()*60 + d.minute();

							for(var i=0, j = this.__upload_buffer.length;i<j;i++)
								aItemInfo['ATTACHMENTS'].push({values:this.__upload_buffer[i]});

							//@@UPLOAD@@
							WMItems.add([sPrimaryAccount, '__@@UPLOAD@@__'], aItemInfo, '', '','',[function(bOK, aData){
								if (bOK){
									if (aData && this.__sJID){
										if(Array.isArray(aData)){
												aData.forEach(function (aData) {
													me.__im._link(this.__sJID, {link: aData.att_link + '&id=' + aData.id, desc: aData.name, size: aData.att_size});
												}, this);
										}else{
											me.__im._link(this.__sJID, {link:aData.att_link + '&id=' + aData.id, desc:aData.name, size:aData.att_size});
										}
									}
								}
								//GW upload error
								else{

								}

							}.bind(this)]);

						}
						else
						this.__upload_buffer.forEach(function(v){
							if (v.size>0 && v.fullpath){
								var sFolder = Path.basedir(v.fullpath),
									sFile = Path.basename(v.fullpath);

				                //item compatibility (not used)
				                if (v['class'] == 'item')
									sFolder = sFolder.substring(sFolder.indexOf('/')+1);

								if (window.sPrimaryAccountSOCKS)
				     				me.__im.__xmpp._stream_send(sFolder,sFile, v['class'],v.size, v.description, sFrom, '');
								else
									me.__im.__xmpp._oob_send(sFolder,sFile, v['class'], sFrom, '');

								this.chat._system(getLang('IM::UPLOADED', [v.description.escapeHTML()]));
							}
						}.bind(this));

					}
				}.bind(this);

				this.upload._onuploadsuccess = function(file){
					//this.progress._value(0);
					this.text.info && this.text.info._handler(null);

					this.__upload_buffer.push({
						'class':'file',
						'description':file.name,
						'size':file.size,
						'fullpath':file.folder+'/'+file.id
					});
				}.bind(this);

				this.upload._onuploadprogress = function(file, a, b, xhr){
					//this.progress._value(a/(b/100));
					this.text.info && this.text.info._value(file.name, a, b, [function(){xhr.abort()}]);
				}.bind(this);

				this.upload._dropzone(this._main, function(){
					return template.tmp('dropzone',{title:getLang('CHAT::DROP_TITLE', [tab.__sName.escapeHTML()])});
				},'item');

				var handlers = {
					attach:[function() {
						gui._create('insert_item', 'frm_insert_item', '', 'frm_insert_item_nobottomdiv', [this ,'__addItems'], sPrimaryAccount, '', '', 'r', false, ['F', 'X']);
					}.bind(this)],

					'conference':[function(){
						storage.library('wm_conference');
						wm_conference.create(function(conference) {
							conference.join();
							conference.invite(me._getRecipients());
						});
					}],

					'geo':[function(){
						var sJID = this.__sJID;
						if (sJID && "geolocation" in navigator)
							navigator.geolocation.getCurrentPosition(function(pos) {
								var aArg = {lat:pos.coords.latitude, lon:pos.coords.longitude};
									me.__im._geo(sJID, aArg);
							});

					}.bind(this)],

					code: [me, '_code']

				};

				var old_oncontext = this.chat._oncontext;
				this.chat._oncontext = function (e) {
					if (window.getSelection) {
						var sel = window.getSelection();
						if (!sel.isCollapsed && sel.rangeCount)
							for(var range, i = 0; i<sel.rangeCount; i++){
								range = sel.getRangeAt(i);
								if (!range.isCollapsed && Is.Child(range.commonAncestorContainer || range.startContainer, this._main))
									return true;
							}
					}

					if(old_oncontext) {
						if(old_oncontext(e) === false) {
							return;
						}
					}

					this.cmenu && this.cmenu._destruct();
					e.cancelBubble = true;
					e.preventDefault();
					if (e.stopPropagation)
						e.stopPropagation();

					//Do not show menu when offline
					if (!(me.__im && me.__im._is_active())) return;

					var aMenu = [
						{'title': 'CHAT::SHARE_FILE_OR_DOCUMENT', 'arg': {'method': 'attach'}, css: 'ico2 attach'},
						{'title': 'INSERT_CODE::TITLE', 'arg': {'method': 'code'}, css: 'ico2 code'},
						{'title': 'CHAT::NEW_CONFERENCE', 'arg': {'method': 'conference'}, css: 'ico2 conference', disabled: !sPrimaryAccountCONFERENCE},
						{'title': 'IM::GEO', 'arg': {'method': 'geo'}, css: 'ico2 geo', disabled: !("geolocation" in navigator) || !GWOthers.getItem('EXTERNAL_SETTINGS', 'google_maps_api_key')}
					];

					addcss(this._main, 'color1');

					this.cmenu = gui._create("cmenu", "obj_context", '', 'obj_chat_input_add', this);
					this.cmenu._fill(aMenu);
					this.cmenu._place(e.clientX, e.clientY, null, 2);

					var btn = this;
					this.cmenu._obeyEvent('destructed', [function () {
						removecss(btn._main, 'color1');
					}]);

					this.cmenu._onclick = function (e, elm, id, arg) {
						if (arg.method && handlers && handlers[arg.method])
							executeCallbackFunction(handlers[arg.method]);
						else
							executeCallbackFunction(arg);
					};
				};

				//Text Input
				this._create('text', 'obj_chat_input', 'text', '', {
					block:true,
					smiles_enabled:true,
					handlers: handlers,
					memory:{
						set:[function(val){
							dataSet.add('xmpp', ['roster', this.__sJID, 'input'], val, true);
						}.bind(this)]
					}
				});


				this.text._value(dataSet.get('xmpp', ['roster', this.__sJID, 'input']) || '');
				this.text.input._placeholder(getLang('IM::MESSAGE_PH'));

				this.text.add._disabled(!(me.__im && me.__im._is_active()));
				me.__im.__xmpp._obeyEvent('status', [function(){
					if (!this || this._destructed)
						return false;

					this.text.add._disabled(!(me.__im && me.__im._is_active()));

				}.bind(this)]);

				//Send (Ctrl + Enter)
				this.text._onsubmit = function(){

					if (me.__im && me.__im._is_active()){

						var uid = this.__sJID,
							usr = dataSet.get('xmpp', ['roster', uid]);

						if (usr){

							if (!isGroup){
								if (Is.Defined(this.__composing_timeout))
									clearTimeout(this.__composing_timeout);

								this.__is_composing = false;
								me.__im.__xmpp._msg_status(uid+(usr.resource?'/'+usr.resource:''),'paused');
							}

							me._send();
						}
					}
					else
						return false;

				}.bind(this);

				this.text._onpasteimage = function (aFiles) {
					this.upload.file.__ondropfile(aFiles);
				}.bind(this);

				this.text._onkeydown = function(e){
					if (!isGroup && me.__im && me.__im._is_active()){

						var uid = this.__sJID,
							usr = dataSet.get('xmpp', ['roster', uid]);

						if (usr){

							if(!this.__is_composing) {
								this.__is_composing = true;
								me.__im.__xmpp._msg_status(uid+(usr.resource?'/'+usr.resource:''),'composing');
							}

							if (Is.Defined(this.__composing_timeout))
								clearTimeout(this.__composing_timeout);

							this.__composing_timeout = setTimeout(function() {
								this.__is_composing = false;
								me.__im.__xmpp._msg_status(uid+(usr.resource?'/'+usr.resource:''),'paused');
							}.bind(this), 3000);
						}
					}

				}.bind(this);

				this.text._onclose = function(e){
					var out = false;
					switch(parseInt(GWOthers.getItem('IM','esc'))){
						case 1:
							this._dock();
							break;
						// Close currently open tab
						case 2:
							if (count(this.__tabIndex)>0)
								this.tabs[this.tabs._value()]._close();
							else
								out = true;
					}

					// Prevent propagation to popup handler
					if (!out){
						e.cancelBubble = true;
						if (e.stopPropagation)
							e.stopPropagation();
						if (e.preventDefault)
							e.preventDefault();
					}
					return out;

				}.bind(me);

				this.text.input._onfocus = function(e){
					this._onfocus();
				}.bind(me);

				//chat
				if (sPrimaryAccountIMHISTORY && !isGroup) //sFrom.indexOf('~')!==0
					this.chat._request = function(bForce){

						if (dataSet.get('xmpp',['roster',sFrom,'last_history']) == 'full')
							return;

						//serialize
						var rqid = unique_id();
						this.__request_id = rqid;

						var items = 20, aGet,
							h = dataSet.get('xmpp',['roster',sFrom,'history']) || [],
							iStart = '', iOffset = '';

						for(var i in h){
							if (h[i] && Is.Defined(h[i].start)){
								iStart = h[i].start;
								iOffset = h[i].offset;
							}
							break;
						}

						this.__loading = 1;

						aGet = {
							'from':sFrom,
							'max':20,
							'start':iStart,
							'before':iOffset
						};

						if (this._parent.__search)
							aGet.search = this._parent.__search;

						addcss(this._main, 'loading');

						me.__im.__xmpp._history_get(aGet, [function(aData, rqid, sFrom){
							if (this && !this._destructed && this.__request_id == rqid){

								var arr = me.__history_parser(aData),
									h = dataSet.get('xmpp',['roster',sFrom,'history']) || [];

								if (items>arr.length)
									dataSet.add('xmpp',['roster', sFrom, 'last_history'], 'full', true);

								//Alter history
								dataSet.add('xmpp',['roster', sFrom,'history'], [].concat(arr, h), true);

								//Fill to top
								if (arr.length)
									this._response(arr.reverse());
							}

							removecss(this._main, 'loading');

						}.bind(this),[rqid, sFrom]]);

					};

				//tab is active
				if (!isGroup)
					dataSet.add('xmpp',['roster',sFrom,'active'], true, true);

				//load already preloaded history
				var arr = dataSet.get('xmpp',['roster',sFrom,'history'], true);
				if (Is.Array(arr)){
					this.chat.__loading = 1;
					this.chat._response(arr.reverse());
				}
				else
				//if (bClick && this.chat._request)
				if (this.chat._request)
					this.chat._request();
			};

			me.__title(sFrom);

			me.tabs.menu.__redraw(sFrom);

			//Search
			if (this.__search){
				this._parent.search._value(this.__search);
				addcss(me._main, 'search');
			}
			else
				removecss(me._main, 'search');

			removecss(this.__eLi, 'im_event',true);

			if (me.__tabIndex[this.__sJID]){

				//COOKIE - odebrat
				if (Cookie.get(['im','queue',this.__sJID]) == 1)
					Cookie.set(['im','queue',this.__sJID]);

				if (dataSet.get('xmpp', ['roster', this.__sJID, 'action']) == 'msg'){
					dataSet.remove('xmpp', ['roster', this.__sJID, 'action']);
					dataSet.update('main', ['im']);
				}
			}

			//scroll chat if exists
			if (this.chat){
				this.text._focus();
				this.chat._scroll(0);
			}
		};

		//Add to tabIndex
		this.__tabIndex[sFrom] = tab._name;

		//Listen to roster
		tab._listen('xmpp',['roster', sFrom], true);
		tab.__update('xmpp',['roster', sFrom]);

		tab._add_destructor('__onDestruct');
	}

	if (bActive)
		this.tabs._value(tab._name);

	//check SIP
	this.__update();

	return tab;
};

_me._code = function () {
	gui._create('insert_code', 'frm_insert_code', '', '', [function (sBody) {
		this._send(sBody);
	}.bind(this)]);
};

_me.__transformImageMessages = function (msg) {

	if (msg.EVENT && msg.EVENT[0].ITEMS && msg.EVENT[0].ITEMS[0].ITEM && msg.EVENT[0].ITEMS[0].ITEM[0].GEOLOC)
		msg.BODY = [{VALUE: {geoloc: msg.EVENT[0].ITEMS[0].ITEM[0].GEOLOC[0], type: "geoloc"}}];
	else
	if (msg.X && msg.X[0].URL)
		msg.BODY = [{VALUE: {url: msg.X[0].URL[0].VALUE, desc: msg.X[0].DESC?msg.X[0].DESC[0].VALUE:'', size: msg.X[0].SIZE?msg.X[0].SIZE[0].VALUE:'', type: "file"}}];

	return msg;
};



_me._notice = function(sFrom, sBody){
	if (sBody){
		var sFrom = sFrom.split('/').shift(),
			tab = this.tabs[this.__tabIndex[sFrom]];

		if (tab)
			tab.chat._notice(sFrom, sBody);
	}
};


// @Note: bHistory is obsolate
_me._chat = function(sFrom, sTo, sBody, iDate, bHistory, bSkipQueue){

	var sFrom = sFrom.split('/').shift(),
		tab = this._getChat(sFrom);

	if (tab && tab.chat)
		if (sBody){

			//Openned for first time, drop the message & use history
			if (tab.chat._request && !Is.Defined(dataSet.get('xmpp',['roster',sFrom,'history']))){
				tab.chat._request();
				return;
			}

			//Save history
			var iDate = iDate || (new IcewarpDate()).unix(),
				h = dataSet.get('xmpp',['roster',sFrom,'history']) || [];
				h.push({
					from: sTo || sFrom,
					body: sBody,
					reply: sTo?true:false,
					date: iDate
				});

			dataSet.add('xmpp',['roster',sFrom,'history'],h,true);

			//Add message
			if (sTo)
				tab.chat._add (sTo, '', sBody, true, iDate);
			else
				tab.chat._add (sFrom, '', sBody, false, iDate);
		}
};


_me.__history_parser = function(aData){

	var arr = [];

	// its error response when undefined
	try{
		if (aData && aData.IQ && (aData = aData.IQ[0]) && aData.CHAT) {
			if (aData.CHAT[0].TO) {
				//var sName = dataSet.get('main', ['fullname']) || dataSet.get('main', ['user']);
				aData.CHAT[0].TO = aData.CHAT[0].TO.map(this.__transformImageMessages);
				for (var i in aData.CHAT[0].TO)
					if (aData.CHAT[0].TO[i].BODY && aData.CHAT[0].TO[i].BODY[0] && aData.CHAT[0].TO[i].BODY[0].VALUE) {
						//	@todo: add conference: _id_ if present
						arr.push({from: sPrimaryAccount, body: aData.CHAT[0].TO[i].BODY[0].VALUE, reply: true, date: (new IcewarpDate(aData.CHAT[0].ATTRIBUTES.START).utcOffset(new IcewarpDate().utcOffset()).add(aData.CHAT[0].TO[i].ATTRIBUTES.SECS, 'seconds')).unix(), start: aData.CHAT[0].ATTRIBUTES.START, offset: aData.CHAT[0].TO[i].ATTRIBUTES.SECS});
					}
			}

			if (aData.CHAT[0].FROM) {
				aData.CHAT[0].FROM = aData.CHAT[0].FROM.map(this.__transformImageMessages);

				for (var i in aData.CHAT[0].FROM)
					if (aData.CHAT[0].FROM[i].BODY && aData.CHAT[0].FROM[i].BODY[0] && aData.CHAT[0].FROM[i].BODY[0].VALUE) {
						//	@todo: add conference: _id_ if present
						arr.push({from: aData.CHAT[0].FROM[i].ATTRIBUTES.JID, body: aData.CHAT[0].FROM[i].BODY[0].VALUE, reply: false, date: (new IcewarpDate(aData.CHAT[0].ATTRIBUTES.START).utcOffset(new IcewarpDate().utcOffset()).add(aData.CHAT[0].FROM[i].ATTRIBUTES.SECS, 'seconds')).unix(), start: aData.CHAT[0].ATTRIBUTES.START, offset: aData.CHAT[0].FROM[i].ATTRIBUTES.SECS});
					}
			}

			if (arr.length>0)
				arr.sort(function arrsrt (a,b){
					return a.date - b.date;
				});
		}
	}
	catch(e){
		console.log('frm_chat.__history_parser', e);
	}

	return arr;
};

_me._onclose = function(b, e){

	if (b){

		if (e && e.keyCode==27)
			switch(parseInt(GWOthers.getItem('IM','esc'))){
				case 1:
					this._dock();
				case 0:
					return false;
			}

		//Store tabs
		var r = [];
		[].forEach.call(this.tabs._getAnchor('links').querySelectorAll('li'), function(li){
			var t = this.tabs[li.id.split('/')[1]];
			if (t && t.__sJID)
				r.push(t.__sJID);
		}.bind(this));


		Cookie.set(['im_recent'], r);
	}
	return true;
};
