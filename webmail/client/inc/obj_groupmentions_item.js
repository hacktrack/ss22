_me = obj_groupmentions_item.prototype;
function obj_groupmentions_item(){};

_me.__constructor = function(aData, sType) {
	this.__fill(aData);
};

_me.__fill = function(aData){
	this._clean();

	var me = this;

	this.__aData = aData;
	this.__aData.iid = WMItems.__clientID(aData.EVN_ID);

	var d = IcewarpDate.unix(aData.EVN_CREATED),
		out = clone(aData, true),
		parsed = parseURL(aData.EVN_METADATA);

	out.org_name = (aData.EVNMODIFIEDOWNERNAME && aData.EVNMODIFIEDOWNERNAME != '0'?aData.EVNMODIFIEDOWNERNAME:aData.EVNMODIFIEDOWNEREMAIL) || parsed.core_own_name;
	out.action = getLang(this._parent.__options.type == 'mentions'?'CHAT::MENTIONED':'CHAT::PINNED') + ' <b>'+ getLang({I:'CHAT::PIN_POST', Q:'CHAT::PIN_EVENT', R:'CHAT::PIN_FILE', Y:'CHAT::PIN_MAIL'}[aData.EVNCLASS] || 'CHAT::PIN_POST') + '</b>:';

	out.org_time = d.format('LT');
	out.org_fulltime = d.format('L LT');

	if (this._parent.__options.type == 'mentions'){
		d = IcewarpDate.unix(aData.EVN_MODIFIED || aData.EVN_CREATED);
		out.time = d.format('LT');
		out.fulltime = d.format('L LT');
		out.name = aData.MENWHOOWNNAME || aData.MENWHOOWNEMAIL;
	}
	else{
		out.menu = true;

		if (this._parent.__options.type == 'my_pins'){
			d = IcewarpDate.unix(aData.PINWHEN || aData.LPINWHEN);
			out.name = aData.PINOWNNAME || aData.PINOWNEMAIL || dataSet.get('main', ['fullname']) || sPrimaryAccount;
		}
		else{
			d = IcewarpDate.unix(aData.PINWHEN || aData.GPINWHEN);
			out.name = aData.PINOWNNAME || aData.PINOWNEMAIL || aData.GPINOWNNAME || aData.GPINOWNEMAIL;
		}

		out.time = d.format('LT');
		out.fulltime = d.format('L LT');
	}


	switch(aData.EVNCLASS){
	//Event
	case 'Q':
		if (aData.EVNLINKEXTRAS){
			out.addon = {event:{}};

			linkextras = parseURL(aData.EVNLINKEXTRAS);
			if (linkextras){

				if (linkextras.EvnLinkInvalid == '1'){
					this._parent._remove(this._anchor, this.__aData.iid);
					return;
				}

				out.addon.event.title = linkextras.EvnTitle || '';

				var a = IcewarpDate.julian(linkextras.EvnStartDate).setTime(linkextras.EvnStartTime);

				out.addon.event.date = a.format('LLLL');
			}
		}

		if (!aData.EVNTHUMBNAILID)
			out.preview = 'ico';

		break;

	//Mail
	case 'Y':
		var linkextras = {};
		if (aData.EVNLINKEXTRAS){
			linkextras = parseURL(aData.EVNLINKEXTRAS) || {};
			if (linkextras.EvnTicket){

				aData.EVNTITLE = linkextras.EvnTitle;


				var aFrom = MailAddress.splitEmailsAndNames(linkextras.EvnOrganizer);

				out.addon = {mail:{
					subject:linkextras.EvnTitle,
					from:aFrom?aFrom[0].name || aFrom[0].email:''
				}};

				out.preview = linkextras.EvnThumbnailId?'':'ico ico_none ico_eml';
			}

			if (linkextras.EvnThumbnailId){
				aData.EVNTHUMBNAILID = linkextras.EvnThumbnailId;
				aData.EVNTHUMBNAILTIME = linkextras.EvnThumbnailTime;
			}
			else
			if (linkextras.EvnProcessingQueued == '0' && linkextras.EvnTicket && Item.imageSupport(linkextras.EvnTitle))
				aData.EVNTICKET = linkextras.EvnTicket;
		}

		break;
	//File
	case 'R':
	case 'Z':
		var linkextras = {};
		if (aData.EVNLINKEXTRAS){
			linkextras = parseURL(aData.EVNLINKEXTRAS) || {};
			if (linkextras.EvnTicket){

				aData.EVNTITLE = linkextras.EvnTitle;

				if (aData.EVNCLASS == 'Z'){
					var ticketUrl = parseURL(linkextras.EvnTicket.split('#').pop());
					aData.EVNURL = document.location.origin + '/teamchatapi/files.download?' + buildURL({ticket:ticketUrl.ticket});
				}
				else
					aData.EVNURL = linkextras.EvnTicket;

				out.addon = {file:{
					size:parseFileSize(linkextras.EvnComplete),
					filename:linkextras.EvnTitle,
					url:aData.EVNURL
				}};


				switch(Path.extension(linkextras.EvnTitle)) {
				case 'mp3':
					out.addon.play = true;
					break;
				case 'wav':
							// do not try to playback wav in Internet Explorer & Safari
					out.addon.play = !(window.ActiveXObject || "ActiveXObject" in window) && !/^((?!chrome|android).)*safari/i.test(navigator.userAgent);
				}

				out.preview = linkextras.EvnThumbnailId?'':'ico ico_none ico_'+Path.extension(linkextras.EvnTitle);
			}

			if (linkextras.EvnThumbnailId){
				aData.EVNTHUMBNAILID = linkextras.EvnThumbnailId;
				aData.EVNTHUMBNAILTIME = linkextras.EvnThumbnailTime;
			}
			else
			if (linkextras.EvnProcessingQueued == '0' && linkextras.EvnTicket && Item.imageSupport(linkextras.EvnTitle))
				aData.EVNTICKET = linkextras.EvnTicket;

			//this.__dimensions(linkextras);
		}

		break;

		//link
	case 'I':
		if (aData.EVNURL){
			out.subclass = 'link';
			var a = mkElement('A',{href:aData.EVNURL});
			out.addon = {link:{url:a.hostname}};
		}
		break;

	}

	if (aData.EVNNOTE && aData.EVNNOTE != aData.EVNURL){
		storage.library('obj_groupchat_item');
		storage.library('obj_highlight');
		out.body = obj_highlight._highlight(obj_groupchat_item.prototype.__encode_body.call(this, aData.EVNNOTE, aData.MENTIONS, true));

		//URL shortener
		// var tmp = mkElement('div',{innerHTML:'asdfasdf <a href="http://kunda.xom/bobo/?q=bobo">http://kunda.xom/bobo/?q=bobo</a>'});
		// [].forEach.call(tmp.querySelectorAll('A'), function(elm) {
		//   console.log(elm)
		// });

	}


	this._draw('obj_groupmentions_item', 'main', {item:out});


	//Disable click
	[].forEach.call(this._main.querySelectorAll('.noclick'), function(elm){
		elm.onclick = function(e){
			var e = e || window.event;
			e.cancelBubble = true;
			e.stopPropagation && e.stopPropagation();
			return false;
		};
	});

	//Menu
	var m = this._getAnchor('menu');
	if (m){
		var aRights = WMFolders.getAccess([aData.aid, aData.fid]);
		m.onclick = function(e){
			var e = e || window.event;

			e.cancelBubble = true;
			if (e.stopPropagation)
				e.stopPropagation();

			if (!this.cmenu || this.cmenu._destructed){
				var pos = getSize(m),
					arr = [];

				switch (this._parent.__options.type){
				case 'global_pins':
					arr.push(
						{title:'CHAT::PIN_COPYTOMY', arg:[this,'_action',['add_pin']], disabled:!aRights.write},
						{title:'CHAT::PIN_REMOVE', css:'color2', arg:[this,'_action',['delete_global_pin']], disabled:!(aRights.modify || ((aData.PINOWNEMAIL === sPrimaryAccount) && aRights.write))}
					);
					break;

				case 'my_pins':
					arr.push(
						{title:'CHAT::PIN_COPYTOGLOBAL', arg:[this,'_action',['add_global_pin']], disabled:!aRights.write},
						{title:'CHAT::PIN_REMOVE', css:'color2', arg:[this,'_action',['delete_pin']], disabled:!aRights.write}
					);
				}

				this.cmenu = gui._create('cmenu','obj_context');
				this.cmenu._fill(arr);
				this.cmenu._place(pos.x + pos.w/2, pos.y+pos.h,'',2);
				this.cmenu._onclose = function(){
					removecss(this._main,'active');
				}.bind(this);

				addcss(this._main,'active');
			}
			else
				this.cmenu._destruct();

			return false;
		}.bind(this);
	}


	//Buttons
	if (this.btn_open)
		this.btn_open._onclick = function(){
			aData.EVNURL && window.open(aData.EVNURL);
		};

	if (this.btn_download)
		this.btn_download._onclick = function(){
			aData.EVNURL && downloadItem(aData.EVNURL,true);
		};

	if (this.btn_share)
		this.btn_share._onclick = function(){
			Item.collaborate([aData.aid,aData.fid,[aData.EVNLINKID || aData.iid]]);
		};


	if (this.btn_info)
		this.btn_info._onclick = function(){
			Item.openwindow([this.__aData.aid, this.__aData.fid, WMItems.__clientID(this.__aData.EVNLINKID)], '', '', 'E', [this, '__update']);
		}.bind(this);

	if (this.btn_accept){
		if (linkextras.EvnMyStatus == 'A'){
			this.btn_accept._value('ATTENDEES::STATUS_A');
			removecss(this.btn_accept._main, 'select');
		}
		else
		if (linkextras.EvnMyStatus == 'D'){
			this.btn_accept._value('ATTENDEES::STATUS_D');
			removecss(this.btn_accept._main, 'select');
		}
		else{

			this.btn_accept._disabled(false);
			this.btn_accept._onclick = function(e){
				if (!this.cmenu || this.cmenu._destructed){
					e.cancelBubble=true;
					if (e.stopPropagation)
						e.stopPropagation();
					if (e.preventDefault)
						e.preventDefault();

					var pos = getSize(this._main);

					this.cmenu = gui._create('cmenu','obj_context');
					this.cmenu._fill([
						{title:'FORM_BUTTONS::ACCEPT', arg:[me,'_action',['accept']]},
						{title:'FORM_BUTTONS::DECLINE', arg:[me,'_action',['decline']]}
					]);

					this.cmenu._place(pos.x+pos.w/2, pos.y+pos.h, '', 2);
					return false;
				}
			};
		}
	}


	//Preview Image
	if (aData.EVNTHUMBNAILID)
	 	this._preview_image(aData.EVNTHUMBNAILID, aData.EVNTHUMBNAILTIME);
	else
	if (aData.EVNTICKET)
		this._preview_image('', '', aData.EVNTICKET);
	else
	if (!gui.socket && (!Is.Defined(aData.EVNPROCESSINGQUEUED) || aData.EVNPROCESSINGQUEUED == '1')){

		this.__timeout = setTimeout(function(){
			this.__update();
		}.bind(this), 5000);

		this._add_destructor('__destructor');
	}

};

_me._action = function(name){

	var aItem = {aid:this.__aData.aid, fid:this.__aData.fid, iid:WMItems.__clientID(this.__aData.EVNLINKID)};

	switch(name){
		//iMIP
	case 'decline':
		this.btn_accept._disabled(true);

		var frm = gui._create('decline','frm_text','','frm_ok_cancel', [
			function(s){
				aItem.reason = s;
				WMItems.imip(aItem, name, [function(){
					if (!this._destructed)
						this.__update(true);
				}.bind(this)]);
			}.bind(this)],
		'EVENT::REASON');

		frm._onclose = function(){
			if (this.btn_accept)
				this.btn_accept._disabled(false);
		}.bind(this);

		frm.x_btn_ok._value('FORM_BUTTONS::DECLINE');
		break;

	case 'accept':
		this.btn_accept._disabled(true);

		WMItems.imip(aItem, name, [function(){
			if (!this._destructed)
				this.__update(true);
		}.bind(this)]);
		break;

		//Pins
	case "add_pin":
	case "add_global_pin":
	case "delete_pin":
	case "delete_global_pin":
		var aItem = {aid:this.__aData.aid, fid:this.__aData.fid, iid:this.__aData.iid};
		WMItems.action(aItem,name,[
			function(bOK, aData){
				if (bOK){
					if (name === "add_global_pin" || name === "add_pin") {
						this._animate(getLang('CHAT::'+name.toUpperCase()));
					}

					var arg = {};
					if (name === "add_global_pin" && aData.IQ && aData.IQ[0].RESULT && aData.IQ[0].RESULT[0].LAST_PINNED_ITEM){
						arg.LAST_PINNED_ITEM = aData.IQ[0].RESULT[0].LAST_PINNED_ITEM[0].VALUE;
					}

					if (this._parent._fire(this.__aData.iid, name, arg)){
							//gui.notifier._value(getLang('NOTIFIER::SEND'));
						return;
					}
				} else if (aData.IQ && aData.IQ[0] && aData.IQ[0].ERROR && aData.IQ[0].ERROR[0] && aData.IQ[0].ERROR[0].ATTRIBUTES && aData.IQ[0].ERROR[0].ATTRIBUTES.UID) {
					switch(aData.IQ[0].ERROR[0].ATTRIBUTES.UID) {
					case 'add_pin_already_exists':
						if (name === "add_global_pin" || name === "add_pin") {
							return gui.notifier._value({type: 'pin_already_exists'});
						}
						break;
					}
				}

				this.__update(true);

			}.bind(this)
		]);

	}
};

_me.__update = function(bOK){

	if (bOK == true){
		WMItems.list({aid:this.__aData.aid, fid:this.__aData.fid, iid:this.__aData.iid},'','','',[function(aData){
			if (aData && (aData = aData[this.__aData.aid]) && (aData = aData[this.__aData.fid]) && (aData = aData[this.__aData.iid])){

				if (aData.EVNSTARTDATE != this.__aData.EVNSTARTDATE || aData.EVNSTARTTIME != this.__aData.EVNSTARTTIME){
					this._parent._serverSort(this._parent.__aRequestData.folder, true);
					return;
				}

				//Copy MENWHO
				this.__aData.MENWHOOWNNAME && (aData.MENWHOOWNNAME = this.__aData.MENWHOOWNNAME);
				this.__aData.MENWHOOWNEMAIL && (aData.MENWHOOWNEMAIL = this.__aData.MENWHOOWNEMAIL);

				//Delete if not in mentions
				if (this._parent.__options.type == 'mentions'){

					var bRemove = true;
					if (aData.MENTIONS)
						for(var id in aData.MENTIONS)
							if (aData.MENTIONS[id].values.EMAIL == sPrimaryAccount){
								bRemove = false;
								break;
							}

					if (bRemove){
						this._parent._remove(this._anchor, this.__aData.iid);
						return;
					}
				}

				this.__fill(aData);
			}
			// delete
			else
				this._parent._remove(this._anchor, this.__aData.iid);
		}.bind(this)]);

		if (this._parent && !this._parent._destructed)
			this._parent._serverSort();
	}

};


_me._preview_image = function(attid, tstamp, sSRC){

	if ((attid || sSRC) && this._getAnchor('preview')){

		var bVid = this.__aData.CORE_LINKINFO && this.__aData.CORE_LINKINFO['type'] == 2 && this.__aData.CORE_LINKINFO.videourl,
			w = bVid?500:300,
			h = bVid?281:600;

		this._getAnchor('preview').onclick = function(e){

			var e = e || window.event,
				iid = WMItems.__clientID(this.__aData.EVNLINKID);

			if (this.__aData.EVNCLASS == 'Y'){
				OldMessage.openwindow([this.__aData.aid, this.__aData.fid, iid+'|@@MAIN@@']);
			}
			else{

				if (Path.extension(this.__aData.EVNTITLE) == 'pdf'){
					if (GWOthers.getItem('LAYOUT_SETTINGS','disable_pdf') == 1 || currentBrowser().match(/^MSIE([6-9]|10)$/))
						return downloadItem(this.__aData.EVNURL, true);

					gui._create('pdf', 'frm_pdf')._load(this.__aData.EVNURL, this.__aData.EVNTITLE);
				}
				else
				if (Item.imageSupport(this.__aData.EVNTITLE)){
					var img = gui._create('imgview','frm_imgview');
					img._fill([{url:this.__aData.EVNURL, title:this.__aData.EVNTITLE}]);
					img._value(0);
				}
				else
				if (Item.editSupport(this.__aData.EVNTITLE))
					Item.editFile([this.__aData.aid, this.__aData.fid, iid]);
				else
				if (Item.officeSupport(this.__aData.EVNTITLE))
					Item.officeOpen({aid: this.__aData.aid, fid: this.__aData.fid, iid: iid},[Item.downloadFile, [this.__aData.aid, this.__aData.fid, iid]], Path.extension(this.__aData.EVNTITLE));
				else
					return;
			}

			e.cancelBubble = true;
			e.stopPropagation && e.stopPropagation();
			return false;

		}.bind(this);


		var img = new Image();
		img.onload = function(){
			try{
				if (!this._destructed){

					//get scroll
					//var isrl = this._parent._scroll();
					var	ePrev = this._getAnchor('preview'),
						eImg = ePrev.querySelector('img');

					if (eImg)
						eImg.src = img.src;
					else
						ePrev.appendChild(mkElement('img',{src:img.src}));

					removecss(ePrev, 'convert', 'ico', 'ico');

					//set
					//this._parent._scroll(isrl);

				}
			}
			catch(r){
				gui._REQUEST_VARS.debug && console.log(this._name||false,r);
			}
		}.bind(this);

		if (sSRC)
			img.src = sSRC;
		else
			img.src = 'server/download.php?' + buildURL({'sid':dataSet.get('main',['sid']), 'class':'attachment', 'fullpath': [this.__aData.aid, this.__aData.fid, WMItems.__serverID(this.__aData.EVNLINKID || this.__aData.iid), attid].join('/'),'resize':1, 'width':w, 'height':h, 't':tstamp || 0});
	}

};

_me._share = function(b){
	if (b){
		if (!this.inp_url){
			this._draw('obj_groupmentions_item_share','share');

			this._getAnchor('share').onclick = function(e){
				var e = e || window.event;
				e.cancelBubble = true;
				if (e.stopPropagation)
					e.stopPropagation();
				return false;
			};

			this._getAnchor('close').onclick = function(){
				this._share(false);
			}.bind(this);

			var linkextras = {};
			if (this.__aData.EVNLINKEXTRAS)
				linkextras = parseURL(this.__aData.EVNLINKEXTRAS) || {};

			this.inp_url._readonly(true);
			this.inp_url._value(linkextras.EvnTicket);
			this.inp_url._onclick = this.inp_url._onfocus = function(){
				this._select();
			};

			this.inp_email._single = true;
			this.inp_email._onchange = function(){
				this.btn_send._disabled(!this.inp_email._value().trim().length);
			}.bind(this);
			this.inp_email._onclose = function(){
				if (this.inp_email._value().length == 0)
					this._share(false);
			}.bind(this);
			this.inp_email._onsubmit = function(){
				this.btn_send._onclick();
			}.bind(this);

			this.btn_send._onclick = function(){

				var email = MailAddress.splitEmailsAndNames(this.inp_email._value());
				if (!this.btn_send._disabled() && email && (email = email[0]) && (email = email.email)){

					this.inp_email._disabled(true);
					this.btn_send._disabled(true);

					WMItems.action({aid:this.__aData.aid, fid:this.__aData.fid, iid:this.__aData.EVNLINKID, values:{EMAIL:email}},'notify_groupchat',[
						function(bOK){

							if (bOK){
								this._share(false);
								this.inp_email._value('');

								//notify OK
								gui.notifier._value({type: 'message_sent'});
							}

							this.inp_email._disabled(false);
							this.btn_send._disabled(false);

							if (!bOK)
								this.inp_email._select();

						}.bind(this)
					]);

				}

			}.bind(this);
		}

		addcss(this._main, 'share');
		this.inp_email._focus();
	}
	else
		removecss(this._main, 'share');
};

_me.__destructor = function(){
	if (this.__timeout){
		window.clearTimeout(this.__timeout);
		delete this.__timeout;
	}
};

_me._animate = function(sTitle){
	if (this.__eAnim && this.__eAnim.parentNode)
		this.__eAnim.parentNode.removeChild(this.__eAnim);

	if (sTitle){
		this.__eAnim = mkElement('div',{className:'animate'});
		this.__eAnim.appendChild(mkElement('div',{text:sTitle}));

		this._main.querySelector('div.item').appendChild(this.__eAnim);

		setTimeout(function(){
			if (this._animate) this._animate();
		}.bind(this),2000);
	}
};
