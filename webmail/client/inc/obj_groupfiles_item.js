_me = obj_groupfiles_item.prototype;
function obj_groupfiles_item(){};

_me.__constructor = function(aData) {
	var me = this;

	this.__aData = aData;

	var d = (new IcewarpDate(aData.EVN_MODIFIED*1000)),
		out = clone(aData, true);

	//ouput
	out.size = parseFileSize(out.EVNCOMPLETE);
	out.fulltime =  d.format('L LT');
	out.date =  getLang('CHAT::FILE_MODIFY', [CalendarFormatting.normalWithTime(d), '']);

	out.avatar = '<span style="background-image: url(\''+getAvatarURL(aData.EVNMODIFIEDOWNEREMAIL) +'\')"></span>';
	out.modified_name = out.EVNMODIFIEDOWNERNAME || out.EVNMODIFIEDOWNEREMAIL;
	out.draft = this.__aData.EVNFLAGS & 128;

	if (out.EVNCLASS == 'M'){
		out.ext = 'eml';
		//out.EVNTITLE += '.eml';
	}
	else
		out.ext = Path.extension(aData.EVNTITLE);

	if (out.ext)
		out.ext = 'ico_' + out.ext;

	out.EVNTITLE = 	out.EVNTITLE || getLang('EVENT_VIEW::NOTITLE');

	this._draw('obj_groupfiles_item', 'main', {item:out});

	//// LOCK ////
	var eLock = this._getAnchor('lock');
	if (!eLock)
		return;

	if (this.__aData.EVNLOCKOWN_ID){
		switch (this.__aData.EVNLOCKOWN_ID){
			case sPrimaryAccountGWID:
				addcss(eLock,'locked');
				eLock.title = getLang('FILE::LOCKED_BY_ME');
				eLock.onclick = function(){
					Item.set_lock([aData.aid,aData.fid,aData.iid], false, false, null, 'I');
				};
				break;

			default:
				addcss(eLock,'locked','red');
				if (this.__aData.EVNLOCKOWN_EMAIL){
					eLock.title = getLang('FILE::LOCKED_BY',[this.__aData.EVNLOCKOWN_EMAIL.escapeHTML()]);
					eLock.onclick = function(){
						NewMessage.compose({to:aData.EVNLOCKOWN_EMAIL, subject:aData.EVNTITLE});
					};
				}
				else{
					eLock.title = getLang('FILE::LOCKED');
				}
		}
	}
	else{
		eLock.onclick = function(){
			Item.set_lock([aData.aid,aData.fid,aData.iid], true, false, null, 'I');
		};
	}


	//// DOWNLOAD ////
	this._getAnchor('icon').onclick = this._getAnchor('name').onclick = function(){

		if (hascss(me._main, 'edit')) return;

		if (out.EVNCLASS == 'M'){
			var aLockInfo = {
				EVNLOCKOWN_EMAIL:me.__aData.EVNLOCKOWN_EMAIL,
				EVNLOCKOWN_ID:me.__aData.EVNLOCKOWN_ID,
				EVNTITLE:out.EVNTITLE,
				draft:me.__aData.EVNFLAGS & 128,
				id:me.__aData.iid
			};

			OldMessage.openwindow([aData.aid, aData.fid, aData.iid+'|@@MAIN@@'], null, aLockInfo);
		}
		else
		if (out.EVNTICKET && Path.extension(aData.EVNTITLE) == 'pdf' && GWOthers.getItem('LAYOUT_SETTINGS','disable_pdf') != 1 && !currentBrowser().match(/^MSIE([6-9]|10)$/))
			gui._create('pdf', 'frm_pdf')._load(out.EVNTICKET, aData.EVNTITLE);
		else
		if (out.EVNTICKET && Item.imageSupport(aData.EVNTITLE)){
			var img = gui._create('imgview','frm_imgview');
				img._fill([{url:out.EVNTICKET,title:aData.EVNTITLE}]);
				img._value(0);
		}
		else
		if (Item.editSupport(aData.EVNTITLE)){
			Item.editFile([aData.aid, aData.fid, aData.iid]);
		}
		else
		if (Item.officeSupport(aData.EVNTITLE))
			Item.officeOpen(aData,[me,'_download'], Path.extension(aData.EVNTITLE));
		else
			me._download();
	};


	this._main.querySelector('.control>.share').onclick = function(){
		Item.collaborate([aData.aid,aData.fid,[aData.iid]]);
	};

	this._main.querySelector('.control>.download').onclick = function(){
		this._download();
	}.bind(this);

	// this.download._onclick = function(){
	// 	me._download();
	// };

	//// SHARE ////
	// this.share._onclick = function(){
	// 	gui._create('frm_public_url', 'frm_public_url','','',[aData.aid,aData.fid,[aData.iid]], out.EVNTICKET);
	// 	//this._parent._share(!hascss(this._parent._main,'share'));
	// };

	/*
	this.url._readonly(true);
	this.url._value(out.EVNTICKET);
	this.url._onclick = this.url._onfocus = function(){
		this._select();
	};


	this.email._single = true;
	this.email._onchange = function(){
		this._parent.send._disabled(!this._value().trim().length);
	};
	this.email._onclose = function(){
		if (this._value().length == 0)
			this._parent._share(false);
	};
	this.email._onsubmit = function(){
		this._parent.send._onclick();
	};

	this.send._onclick = function(){
		this._parent._send();
	};
	*/
};

_me._download = function(){
	if (this.__aData.EVNTICKET)
		downloadItem(this.__aData.EVNTICKET,true);
	else
		Item.downloadFile([this.__aData.aid, this.__aData.fid, this.__aData.iid]);
};

_me._share = function(b){
	if (b){
		addcss(this._main,'share');
		this.email._focus();
	}
	else{
		removecss(this._main,'share');
		this.share._focus();
	}
};

_me._send = function(){

	var me = this,
		email = MailAddress.splitEmailsAndNames(this.email._value());

	if (!this.send._disabled() && email && (email = email[0]) && (email = email.email)){

		this.email._disabled(true);
		this.send._disabled(true);

		WMItems.action({aid:this.__aData.aid, fid:this.__aData.fid, iid:this.__aData.iid, values:{EMAIL:email}},'notify_groupchat',[
			function(bOK){

				if (bOK){
					me._share(false);
					me.email._value('');

					//notify OK
					gui.notifier._value({type: 'message_sent'});
				}

				me.email._disabled(false);
				me.send._disabled(false);

				if (!bOK){
					me.email._select();

					//notify Error

				}
			}
		]);
	}
};

_me._edit = function(b){

	if (b){
		if (!this.inp_edit){
			addcss(this._main, 'edit');
			var inp = this._create('inp_edit','obj_input','name', 'obj_input_100 noborder');
				inp._value(this.__aData.EVNTITLE);
				inp._setRange(0, Math.ceil(this.__aData.EVNTITLE.lastIndexOf('.')) || this.__aData.EVNTITLE.length);

			inp._onblur	= function(){
				this._onsubmit();
			};

			inp._onsubmit = function(){
				var v = this.inp_edit._value();
				if (v && Is.Filename(v) && this.__aData.EVNTITLE !== v){

					this.__aData.EVNTITLE = v;
					this._getAnchor('name').querySelector('.filename').innerHTML = v.escapeHTML();
					this._edit(false);

					var aItemInfo = {values:{EVNTITLE:v}};

					WMItems.add([this.__aData.aid, this.__aData.fid, this.__aData.iid], aItemInfo,'','','', [function(bOK){

						if (bOK === true){
							this._parent._fire(this.__aData.iid, 'update');
						}
						else
							this._getAnchor('name').querySelector('.filename').innerHTML = this.__aData.EVNTITLE.escapeHTML();

					}.bind(this)]);

				}
				else
					this._edit(false);

			}.bind(this);

			inp._onclose = function(){
				this._parent._edit();
			};
		}
	}
	else{
		if (this.inp_edit){
			this.inp_edit._destruct();
		}

		removecss(this._main, 'edit');
	}

};

_me.__update = function(){

	var aItemsInfo = {aid:this.__aData.aid, fid:this.__aData.fid, iid:this.__aData.iid, values:['EVN_ID','EVNTITLE', 'EVNCLASS', 'EVNTICKET', 'EVN_MODIFIED','EVNTHUMBNAILID','EVNTHUMBNAILTIME','EVNPROCESSINGQUEUED','EVNCOMPLETE','EVNLOCKOWN_EMAIL','EVNLOCKOWN_ID','EVNFLAGS']};

	WMItems.list(aItemsInfo,'','','',[function(aData){
		this._edit(false);

		if (aData && (aData = aData[this.__aData.aid]) && (aData = aData[this.__aData.fid]) && (aData = aData[this.__aData.iid])){
			for (var k in aData)
				this.__aData[k] = aData[k];

			this.__constructor(this.__aData);
		}

	}.bind(this)]);

};
