_me = obj_groupchat_mail.prototype;
function obj_groupchat_mail(){};

_me.__constructor = function() {
	this.__fill(this.__aData);

	// this._getAnchor('fname').onclick = function(e){
	// 	var e = e || window.event;

	// 	downloadItem(aTmp.url,true);

	// 	e.cancelBubble = true;
	// 	if (e.stopPropagation) e.stopPropagation();
	// 	return false;
	// };

};

_me.__update = function(){
	var aItemsInfo = {aid:this.__aData.aid, fid:this.__aData.fid, iid:this.__aData.iid, values:['EVNNOTE','EVN_CREATED', 'EVN_MODIFIED', 'EVNSHARETYPE','EVNLINKEXTRAS','EVNURL', 'EVN_ID', 'EVNSIZEINFO', 'EVNMEETINGID','EVNLINKID']}; //['EVNNOTE','EVN_CREATED','EVN_MODIFIED','EVNLINKEXTRAS']

	WMItems.list(aItemsInfo,'','','',[function(aData){

		if (aData && (aData = aData[this.__aData.aid]) && (aData = aData[this.__aData.fid]) && (aData = aData[this.__aData.iid]) && aData.EVNLINKEXTRAS){

			if (this.controls)
				this.controls._destruct();

			//Body
			if (this.__aData.EVNNOTE != aData.EVNNOTE)
				this._init_body(aData);

			//Reactions
			this._init_reactions(aData);

			//Merge Data
			for (var k in aData)
				this.__aData[k] = aData[k];

			this.__fill(this.__aData);
		}

	}.bind(this)]);
};

_me.__fill = function(aData){
	this.from && this.from._destruct();
	this.rcp && this.rcp._destruct();
	this.full_switch && this.full_switch._destruct();
	this.attach && this.attach._destruct();
	this.__eFrame = null;

	var aTmp = {},
		linkextras = parseURL(aData.EVNLINKEXTRAS);

	if (linkextras.EvnTicket){
		aTmp.size = parseFileSize(linkextras.EvnComplete);
		aTmp.url = linkextras.EvnTicket;
		aTmp.subject = linkextras.EvnTitle;
		aTmp.draft = linkextras.EvnFlags & 128;

		// aTmp.size = linkextras.EvnSequence;
		aTmp.from = linkextras.EvnOrganizer;
		aTmp.frame_src = 'server/download.php?' + buildURL({'sid':dataSet.get('main',['sid']),'class':'attachment','fullpath':aData.aid+'/'+aData.fid+'/'+aData.EVNLINKID+'/MAIL_PREVIEW.html',tmod:linkextras.Evn_Modified});

		var oDate = new IcewarpDate(linkextras.EvnStartDate, {format: IcewarpDate.JULIAN});
			oDate.setTime(linkextras.EvnStartTime, true);

		aTmp.date = CalendarFormatting.normalWithTime(oDate);

		if (linkextras.Evn_MetaData){
			var metadata = parseURL(linkextras.Evn_MetaData);
			if (metadata.attachments){
				try{
					var att = JSON.parse(metadata.attachments);
					if (Is.Array(att)){
						aTmp.attach = att.map(function(v){
							v.id = v.part_id;
							return v;
						});
					}
				}
				catch(r){
					console.log('attachments json', r);
				}
			}
		}
	}

	if (linkextras.EvnMeetingID){
		aTmp.rcp = true;
		aTmp.rcp_more = linkextras.EvnSequence - MailAddress.splitEmailsAndNames(linkextras.EvnMeetingID).length;
	}

	this._draw('obj_groupchat_mail', 'addon', aTmp);

	this._create('from', 'obj_link', 'from', '', aTmp.from);

	if (linkextras.EvnMeetingID){
		var rcp = this._create('rcp', 'obj_link', 'rcp', '', linkextras.EvnMeetingID);

		if (aTmp.rcp_more){
			var elm = mkElement('span', {text:aTmp.rcp_more === 1?getLang('CHAT::OTHER_RCP'):getLang('CHAT::OTHERS_RCP',[aTmp.rcp_more])});
				elm.onclick = function(e){
					this.full_switch._onclick(e);
				}.bind(this);
			rcp._main.appendChild((mkElement('div',{class: 'more', text: getLang('CHAT::AND') + ' '},'',elm)));
		}
	}

	this.__avatar(aTmp.from?MailAddress.splitEmailsAndNames(aTmp.from)[0].email:'');

	this._getAnchor('avatar').onclick = function(e){
		var e = e || window.event,
			elm = e.target || e.srcElement;

		if (elm.tagName == 'B' || elm.tagName == 'IMG'){

			var aMail = MailAddress.splitEmailsAndNames(aTmp.from);
			if (aMail && aMail[0]){

				var pos = getSize(elm),
					cmenu = gui._create('cmenu','obj_context_link','','',aMail[0].name,aMail[0].email);
				cmenu._place(pos.x+(pos.w/2),pos.y+pos.h,'',2);

				e.cancelBubble = true;
				if (e.stopPropagation) e.stopPropagation();
				if (e.preventDefault) e.preventDefault();

				return false;
			}
		}
	};

	this._getAnchor('toggle').onclick = function(e){
		if (hascss(this._main,'full'))
			removecss(this._main,'full');
		else{
			if (!this.__eFrame)
				this.__initFrame(aTmp.frame_src);
			if (aTmp.attach && !this.attach)
				this.__initAttach(aTmp.attach);

			addcss(this._main,'full');
		}

		e.cancelBubble = true;
		if (e.stopPropagation) e.stopPropagation();
		if (e.preventDefault) e.preventDefault();
	}.bind(this);

	this.full_switch._onclick = function(){
		var aLockInfo;
		var bIsHTML;

		if (linkextras){
			aLockInfo = {
				EVNLOCKOWN_EMAIL:linkextras.evnlockown_email,
				EVNLOCKOWN_ID:linkextras.evnlockown_id,
				EVNTITLE: linkextras.EvnTitle + '.eml',
				draft:linkextras.EvnFlags & 128,
				id:WMItems.__clientID(aData.EVNLINKID),
				guest: sPrimaryAccountGUEST || (TeamChatAPI && TeamChatAPI.teamChatOnly())
			};
			bIsHTML = !!(linkextras.EvnFlags & 256);
		}

		OldMessage.openwindow([aData.aid, aData.fid, WMItems.__clientID(aData.EVNLINKID+'|@@MAIN@@')], null, aLockInfo, bIsHTML);
	};

	//lazy init for comments
	if (this._parent._type == 'obj_groupchat' || hascss(this._main, 'full')){
		this.__initFrame(aTmp.frame_src);

		if (aTmp.attach)
			this.__initAttach(aTmp.attach);
	}

};

_me.__initFrame = function(src){

	if (!this.__eFrame){
		this.__eFrame = mkElement('iframe',{frameborder:"0",marginwidth:"0",marginheight:"0", scrolling:"no", seamless:"seamless"});
		this.__eFrame.onload = function(){
			var base = document.getElementsByTagName('base')[0].getAttribute('href'),
				doc = this.contentWindow.document;

			doc.getElementsByTagName('head')[0].appendChild(mkElement('base', {href:base}, doc));
			doc.getElementsByTagName('head')[0].appendChild(mkElement('link', {type:"text/css", rel:"stylesheet", href:'client/skins/'+ GWOthers.getItem('LAYOUT_SETTINGS', 'skin') +'/css/css.php?'+ buildURL({skin:GWOthers.getItem('LAYOUT_SETTINGS', 'skin'), palette:GWOthers.getItem('LAYOUT_SETTINGS', 'skin_style'), file:'font.css'}), iwstyle:'iwstyle'}, doc));
			doc.getElementsByTagName('head')[0].appendChild(mkElement('link', {type:"text/css", rel:"stylesheet", href:'client/skins/'+ GWOthers.getItem('LAYOUT_SETTINGS', 'skin') +'/css/css.php?'+ buildURL({skin:GWOthers.getItem('LAYOUT_SETTINGS', 'skin'), palette:GWOthers.getItem('LAYOUT_SETTINGS', 'skin_style'), file:'obj_mailview_body.css'}), iwstyle:'iwstyle'}, doc));

			if (doc.body){
				doc.body.style.padding = '0';

				//translate Image SRC
				var sid = dataSet.get('main',['sid']);
				[].forEach.call(doc.querySelectorAll('img[icewarp-src]'), function(elm){
					elm.src = './server/download.php' + (elm.getAttribute('icewarp-src') || '').replace('@@SESSION_ID@@', sid);
				});
				if (GWOthers.getItem('LAYOUT_SETTINGS', 'night_mode') == 1) {
					setTimeout(function() {
						storage.library('night_mode');
						NightMode(doc.defaultView).activate();
					}.bind(this), 5);
				}
			}
		};

		this._getAnchor('frame').appendChild(this.__eFrame);
	}

	this.__eFrame.src = src;
};

_me.__initAttach = function(att){
	if (att){
		if (!this.attach){
			this._create('attach','obj_attach_mailview','attach','noico');
			this.attach._aid = this.__aData.aid;
			this.attach._fid = this.__aData.fid;
			this.attach._iid = WMItems.__clientID(this.__aData.EVNLINKID + '|@@MAIN@@');
		}

		this.attach._value({'attachments':att});
	}
};

_me.__avatar = function(sEmail){

	if (sEmail && sPrimaryAccountGW){

		var me = this,
			sURL = getAvatarURL(sEmail),
			img = new Image();

		img.onload = function(){
			if(!me._getAnchor('avatar')) {
				return;
			}
			var elm = mkElement('b');
			me._getAnchor('avatar').innerHTML = '';
			me._getAnchor('avatar').appendChild(elm);

			if (elm){
				if (this.height>10 && this.width>10){

					if (currentBrowser() == 'MSIE7'){

						var img = mkElement('img',{src:sURL});
						if (this.width>this.height){
							var r = this.height/elm.clientHeight;
							img.style.height = '100%';

							if ((this.width/r)>elm.clientWidth)
								img.style.right = (((this.width/r)-elm.clientWidth)/2) + 'px';
						}
						else{
							var r = this.width/elm.clientWidth;
							img.style.width = '100%';

							if ((this.height/r)>elm.clientHeight)
								this.style.bottom = (((this.height/r)-elm.clientHeight)/2) + 'px';
						}

						elm.appendChild(img);
						elm.style.backgroundImage = 'none';
					}
					else
						elm.style.backgroundImage = 'url("'+ sURL +'")';

					elm.style.backgroundColor = '#FFFFFF';
				}
				else{
					elm.style.backgroundImage = '';
					elm.style.backgroundColor = '';
				}
			}
		};

		img.src = sURL;
	}
	else
		this._getAnchor('avatar').innerHTML = '<b></b>';
};
