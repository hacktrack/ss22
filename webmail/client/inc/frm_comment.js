_me = frm_comment.prototype;
function frm_comment(){};


_me.__constructor = function(aData){
	this._getAnchor('close').onclick = function(){
		this._close();
	}.bind(this);

	this.__aData = clone(aData, true);

	dataSet.add('teamchat', [this.__aData.fid, 'comment'], this.__aData.iid);

	//Item Types
	var aTypes = {
			R:'obj_groupchat_file',
			Z:'obj_groupchat_file',
			Q:'obj_groupchat_event',
			S:'obj_groupchat_conference',
			W:'obj_groupchat_invite',
			I:'obj_groupchat_message',
			Y:'obj_groupchat_mail'
		};

	//Height fix
	msiebox(this._getAnchor('msiebox'));

	this._create('list', 'obj_groupchat', 'chat', 'private');
	this.list.__options.comments = false;
	this.list._serverSort({aid:this.__aData.aid, fid:this.__aData.fid}, true, {sys_search:'comments:' + (WMItems.__serverID(this.__aData.iid))});

	if (aTypes[aData.EVNCLASS]){
		this._create('item', aTypes[this.__aData.EVNCLASS], 'item','', this.__aData, this.list, {novideo: true, fulldate: true});

		this._getAnchor('item').onclick = function(e){
			var e = e || window.event,
				elm = e.target || e.srcElement;

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
						this.text.input._addMention(addr);
					}
				}
				else
				if (hascss(elm, 'private_msg')){

					var sMail = elm.getAttribute('rel');
					if (sMail){
						var addr = MailAddress.splitEmailsAndNames(sMail.urlDecode());
						if (addr && addr[0]){

							var pos = getSize(elm),
								cmenu = gui._create('cmenu', 'obj_context_link','','',addr[0].name, addr[0].email);
								cmenu._place(pos.x+pos.w,pos.y+(pos.h/2));

							e.cancelBubble = true;
							if (e.stopPropagation) e.stopPropagation();
							return false;
						}
					}
				}
			}
			else
			if (elm.tagName == 'A' && elm.protocol === 'mailto:'){
				e.preventDefault();
				NewMessage.compose({to:elm.pathname});
				return false;
			}

		}.bind(this);

		this._getAnchor('item').oncontextmenu = function(e){
			var e = e || window.event,
				elm = e.target || e.srcElement;

			if (elm.tagName == 'A' && elm.protocol === 'mailto:'){
				e.preventDefault();
				e.stopPropagation();

				var pos = getSize(elm),
					cmenu = gui._create('cmenu', 'obj_context_link','','','', elm.pathname);
					cmenu._place(pos.x+pos.w,pos.y+(pos.h/2));

				return false;
			}
		};


		//auto update in case of old values
		if (this.__aData.updateMe && this.item.__update)
			this.item.__update();

		this._scrollbar(this._getAnchor('item'), this._getAnchor('item').parentNode);

		//view mode switch
		this._getAnchor('toggle').onclick = function(){
			if (hascss(this._main, 'full'))
				removecss(this._main, 'full');
			else
				addcss(this._main, 'full');
		}.bind(this);
	}


	this.list._onclick = function(e, elm){
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
					//this._parent.text._private(addr.name, addr.email);
					this._parent.text.input._addMention(addr);
				}
			}
			else
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
			}

			// else{
			// 	var sec;
			// 	if (hascss(elm, 'private_msg') && (sec = Is.Child(elm,'SECTION', this._main)) && (id = sec.getAttribute('rel')) && this.__aData[id] && (aData = this.__aData[id].data)){
			// 		var linkextras;
			// 		//from private
			// 		if (aData.EVNLINKEXTRAS && (linkextras = parseURL(aData.EVNLINKEXTRAS))){

			// 			var sMail = elm.getAttribute('rel');
			// 			if (sMail && linkextras.AccountEmail && linkextras.AccountEmail == sMail){
			// 				this._parent.text._private(linkextras.AccountName, linkextras.AccountEmail);
			// 				return;
			// 			}
			// 			else
			// 			if (aData.EVNCLASS == 'S' && linkextras.organizer){
			// 				this._parent.text._private(linkextras.organizer_name || linkextras.organizer, linkextras.organizer);
			// 				return;
			// 			}
			// 			else
			// 			if (linkextras.AccountEmail && linkextras.AccountEmail != sPrimaryAccount && sPrimaryAccountGUEST!=1){
			// 				this._parent.text._private(aData.EVNMODIFIEDOWNERNAME, aData.EVNMODIFIEDOWNEREMAIL);
			// 				return;
			// 			}
			// 		}

			// 		//from normal
			// 		this._parent.text._private(aData.EVNMODIFIEDOWNERNAME, aData.EVNMODIFIEDOWNEREMAIL);
			// 	}
			// }

		}
		else
		if (elm.tagName == 'A' && elm.protocol === 'mailto:'){
			e.preventDefault();
			NewMessage.compose({to:elm.pathname});
			return false;
		}
	};

	this.list._oncontext = function(e, elm){
		if (elm.tagName == 'A' && elm.protocol === 'mailto:'){
			e.preventDefault();
			e.stopPropagation();

			var pos = getSize(elm),
				cmenu = gui._create('cmenu', 'obj_context_link','','','', elm.pathname);
				cmenu._place(pos.x+pos.w,pos.y+(pos.h/2));

			return false;
		}
	};

	//Update comments count

	this.list._oncount = function(i){

		if (this.item && this.item.__aData.META_COMMENTS && this.item.__aData.META_COMMENTS.count == i)
			return;

		this.list._fire(WMItems.__serverID(this.__aData.iid), 'comment', {'ITEM-TYPE':'-','BODY':i});

	}.bind(this);


	// PUSH Notifications
	if (aTypes[aData.EVNCLASS])
		this.list.__aData[aData.iid] = {obj:this.item};

	if (WMFolders.getRights({aid: this.__aData.aid, fid: this.__aData.fid}).write) {

		//Upload
		this._create('upload','obj_upload');

		this.upload._onuploadstart = function(){

			//SHOW
			this.text._create('info', 'obj_upload_info', 'block');
			addcss(this.text._main, 'block');

			this.__upload_buffer = [];
		}.bind(this);

		this.upload._onuploadend = function(){

			//HIDE
			removecss(this.text._main, 'block');
			this.text.info && this.text.info._destruct();

			if (this._parent && !this._parent._destructed && this.__upload_buffer.length){

				if (this.__upload_buffer.length == 1){
					gui._create('chat_upload','frm_chat_upload','','', this.__upload_buffer[0].description, '', {aid:this.__aData.aid, fid:this.__aData.fid}, [function(sName, sDesc, aArgs){
						if (this._parent && !this._parent._destructed)
							this._parent.__uploadhandler(this.__upload_buffer, sName, sDesc, aArgs, WMItems.__serverID(this.__aData.iid));
					}.bind(this)]);
				}
				else
					this._parent.__uploadhandler(this.__upload_buffer,'','','',WMItems.__serverID(this.__aData.iid));

			}
		}.bind(this);

		this.upload._onuploadsuccess = function(file){

			this.text.info && this.text.info._handler(null);

			this.__upload_buffer.push({
				'class':'file',
				'description':file.name,
				'size':file.size,
				'fullpath':file.folder+'/'+file.id
			});
		}.bind(this);

		this.upload._onuploadprogress = function(file, a, b, xhr){
			this.text.info && this.text.info._value(file.name, a, b, [function(){xhr.abort()}]);
		}.bind(this);

		this.upload._dropzone(this._main, function(){
			return template.tmp('dropzone',{title:getLang('CHAT::DROP_TITLE',[Path.basename(this.__aData.fid)]), body:getLang('CHAT::DROP_BODY')});
		}.bind(this), 'item');


		// Chat input
		this._create("text", "obj_chat_input", "text", "", {
			parseurl: true,
			block:true,
			remember: true,
			remember_path:[this.__aData.fid, this.__aData.iid],
			smiles_enabled: GWOthers.getItem('CHAT', 'smiles') == '1',
			handlers: {
				file: [this.upload, '_click'],
				attach:[this,'_attachFile'],
				event: [this._parent, '_addEvent', [WMItems.__serverID(this.__aData.iid)]],
				code: [this, '_code']
			},
			memory:{
				set:[function(val){
					dataSet.add('teamchat', [this.__aData.fid, this.__aData.iid, 'input'], val, true);
				}.bind(this)],
				get:[function(){
					return dataSet.get('teamchat', [this.__aData.fid, this.__aData.iid, 'input']) || '';
				}.bind(this)]
			}
		});

		this.text._folder({aid: this.__aData.aid, fid: this.__aData.fid});
		this.text.input._placeholder(getLang('IM::COMMENT_PH'));

		this.text._onpasteimage = function (aFiles) {
			this.upload.file.__ondropfile(aFiles);
		}.bind(this);

		this.text._onsubmit = function (v, arg) {
			if (v.length || (arg && arg.url)) {
				arg = arg || {};
				arg.comevnid = WMItems.__serverID(this.__aData.iid);
				this._message(v, arg, this.text.__private);
			} else
				return false;
		}.bind(this);

		this.text._onclose = function () {
			this._close();
		}.bind(this);

		this.text._focus();
	}

	//blur (this should be moved to frm_main_chat)
	// this._add_destructor('__deblur');
	// if (gui.frm_main.main)
	// 	addcss(gui.frm_main.main._main, 'blur');

	//AUTO-MINIMIZE
	this.item.__height = this.item._main.offsetHeight;

	var bResize = true,
		sEvent,
		article = this.item._main.querySelector('article');

	if (article) {
		if ((sEvent = browserEvent('transitionstart')))
			article.addEventListener(sEvent, function() {
				bResize = false;
			});

		if ((sEvent = browserEvent('transitionend')))
			article.addEventListener(sEvent, function() {
				bResize = true;
				this.list._onresize();
			}.bind(this));
	}

	this.list._onresize = function(){
		if (bResize){
			var h = this.item._main.offsetHeight,
				eb = this._getAnchor('body').offsetHeight,
				ioh = this.item._getAnchor('body').offsetHeight,
				bMin = hascss(this._main, 'min'),
				bScroll = this.list.__body.scrollHeight>this.list.__body.clientHeight;

			//Update item height if possible
			if (!bMin)
				this.item.__height = h;

			//Show full view when item & comments fit wo scrollbars (with 30px space)
			if (!bScroll && eb - this.item.__height > 300){
				if (bMin){
					var eCh = this.list.__body.lastChild;
					if (this.list.__body.scrollHeight - ((eCh?eCh.offsetTop + eCh.offsetHeight:30) - this.list.__body.offsetTop) - 30 > this.item.__height - h){
						removecss(this._main, 'min');
						return;
					}
				}
				else
					return;
			}

			//Min comment height is 300px
			if (eb - this.item.__height <= 300){
				addcss(this._main, 'min');
			}
			else
			if (bScroll){
				if (bMin){
					if (this.list.__body.scrollTop == 0)
						removecss(this._main, 'min');
				}
				else
				if (this.list.__body.scrollTop > 0 && ioh > 64){
					addcss(this._main, 'min');
				}
			}
		}
	}.bind(this);
	this.list._onresize();

	this.list._onscroll = function(){
		this.list._onresize();
	}.bind(this);

	// Handle ESC
	this.__closable = true;
	obj_popup.activeStack.add(this);
	this._add_destructor('__destructor');
};

_me._isModal = function() {
	return false;
};

_me.__destructor = function() {
	obj_popup.activeStack.remove(this);
};

_me._code = function () {
	gui._create('insert_code', 'frm_insert_code', '', '', [function (sBody) {
		this._message(sBody, {
			comevnid: WMItems.__serverID(this.__aData.iid)
		});
	}.bind(this)]);
};

_me._attachFile = function(){
	if (this.__aData.aid && this.__aData.fid){
		var sFolder = Mapping.getDefaultFolderForGWType('F');
		if (!dataSet.get('folders', [this.__aData.aid, sFolder]))
			sFolder = '';

		gui._create('insert_item', 'frm_insert_item', '', 'frm_insert_item_nobottomdiv', [this, '__addItems'], this.__aData.aid, sFolder, '', 'r', false, ['F', 'X']);
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
		gui._create('chat_upload', 'frm_chat_upload', '', '', me.__upload_buffer[0].description, '', {aid:me.__aData.aid, fid:me.__aData.fid}, [function (sName, sDesc, aArgs) {
			me._parent.__uploadhandler(me.__upload_buffer, sName, sDesc, aArgs, WMItems.__serverID(me.__aData.iid));
		}]);
	} else
		me._parent.__uploadhandler(me.__upload_buffer);
};

// _me.__deblur = function(){
// 	if (gui.frm_main.main)
// 		removecss(gui.frm_main.main._main, 'blur');
// };

_me._message = function(sBody, aArgs, aPrivate){
	if (this.__aData.aid && this.__aData.fid){

		var folder = this.__aData.aid + '/' + this.__aData.fid,
			recent = Cookie.get(['recent']) || [],
			index = recent.indexOf(folder);

		!!~index && recent.splice(index, 1);
		recent.unshift(folder);
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
		else
			aArgs = {};

		//show chat
		if (hascss(this._main,'full'))
			removecss(this._main,'full');

		//Sent to server
		WMItems.add([this.__aData.aid,this.__aData.fid], aItemInfo,'','','', [this,'_response',[sBody, aArgs, aPrivate]]);
	}

};

_me._response = function(bOK, arg, sBody, aArgs, aPrivate){

	if (bOK){

		//Add temporary mssg
		var x;
		if (arg.id && arg.xml && (x = arg.xml.IQ) && (x = x[0].RESULT) && (x = x[0])){

			var aData = {
				id:WMItems.__clientID(arg.id),
				aid:this.__aData.aid,
				fid:this.__aData.fid,
				body:sBody,
				timestamp: x.EVN_CREATED?x.EVN_CREATED[0].VALUE:0,
				comevnid:aArgs.comevnid
			};

			if (aArgs){
				if (aArgs.url)
					aData.url = aArgs.url;
				if (aArgs.desc)
					aData.desc = aArgs.desc;
				if (aArgs.title)
				 	aData.title = aArgs.title;

				if (aArgs.type)
					aData.type = aArgs.type;
				if (aArgs.videotype)
					aData.videotype = aArgs.videotype;
				if (aArgs.videourl)
					aData.videourl = aArgs.videourl;

				if (aArgs.mentions){
					aData.mentions = aArgs.mentions;

					//Fire add_mention event
					for(var m in aData.mentions){
						if (m == sPrimaryAccount){
							this.list._fire(arg.id, 'add_mention', {'ITEM-TYPE':'I'}, true);
							break;
						}
					}
				}
			}

			if (aPrivate){
				aData.share = 'C';
				aData.contact_name = aPrivate.name || aPrivate.email;
				aData.contact_email = aPrivate.email;
			}

			this.list._add_message(aData, true);
			this.list._fire(arg.id, 'add', {'ITEM-TYPE':'I'}, true);
		}
	}
};

_me._close = function(){
	dataSet.remove('teamchat', [this.__aData.fid, 'comment']);
	this._destruct();
};
