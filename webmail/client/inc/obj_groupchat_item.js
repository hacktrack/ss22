_me = obj_groupchat_item.prototype;
function obj_groupchat_item(){};

obj_groupchat_item.__comTypes = {I:'obj_groupchat_message', R:'obj_groupchat_file', Q:'obj_groupchat_event', S:'obj_groupchat_conference', W:'obj_groupchat_invite', F:'obj_groupchat_file', Z:'obj_groupchat_file', E:'obj_groupchat_event', Y:'obj_groupchat_mail'};
/*

<evnmentions_info>
	<mention>
		<id>4916541c933f</id>
		<email>a1@merakdemo.com</email>
		<name>A1</name>
	</mention>
	<mention>
		<id>4916541c9340</id>
		<email>user@merakdemo.com</email>
		<name>User</name>
	</mention>
</evnmentions_info>

*/

_me.__constructor = function(aData, oList, aOpt) {
	storage.library('obj_highlight');

	var me = this;
	this.__options = aOpt || {};
	this.__aData = clone(aData, true);
	this.__pendingReaction = null;

	//Search for parent List object (for nasted items)
	if (oList)
		this.__list	 = oList;
	else{
		this.__list = this._parent;
		while(!this.__list._serverSort)
			if (!(this.__list = this.__list._parent))
				return;
	}

	var d = (new IcewarpDate(aData.EVN_CREATED*1000)),
	d2 = aData.EVN_MODIFIED ? (IcewarpDate.unix(aData.EVN_MODIFIED)) : false,
	metadata = parseURL(aData.EVN_METADATA),
	owner = (aData.EVNOWNERNAME && aData.EVNOWNERNAME != '0'?aData.EVNOWNERNAME:(aData.EVNMODIFIEDOWNERNAME && aData.EVNMODIFIEDOWNERNAME != '0'?aData.EVNMODIFIEDOWNERNAME:aData.EVNOWNEREMAIL)) || metadata.core_own_name || '',
	name = (aData.EVNMODIFIEDOWNERNAME && aData.EVNMODIFIEDOWNERNAME != '0'?aData.EVNMODIFIEDOWNERNAME:aData.EVNMODIFIEDOWNEREMAIL) || metadata.modified_own_name || metadata.core_modifiedown_name || '',
	aTmp = {
		id: aData.EVN_ID,
		owner: owner,
		name: name,
		time: this.__options.fulldate ? d.format('L LT') : d.format('LT'),
		fulltime: d.format('L LT'),
		body: '',
		comment: !!aData.EVNCOMEVNID && this.__list.__options.comments,
		avatar: owner && {img:getAvatarURL(metadata.core_own_email || aData.EVNOWNEREMAIL), link:MailAddress.createEmail(name, metadata.core_own_email || aData.EVNOWNEREMAIL).urlEncode()},
		edited_text: d2 ? getLang('CHAT::EDITED_BY', ['<strong>' + name.escapeHTML() + '</strong>', d2.format('LT')]) : false
	};
	if (aData.EVNNOTE && aData.EVNCLASS !== 'Q'){
		if (!aData.MENTIONS && aData.EVNMENTIONS_INFO)
			aData.MENTIONS = parseParamLine(aData.EVNMENTIONS_INFO);

		aTmp.body = this.__encode_body(aData.EVNNOTE, aData.MENTIONS);
	}

	if (aData.EVNMODIFIEDOWNEREMAIL == sPrimaryAccount || aData.EVNMODIFIEDOWNEREMAIL == dataSet.get('main', ['user'])){
		aTmp.me = true;
		addcss(this._main,'me');
	}

	//Comment
	if (aData.EVNCOMEVNID){
		addcss(this._main,'com');
		if (this.__list.__options.comments)
			addcss(this._main,'pad');
	}

	//Group support?
	if (!(this._cangroup = (!aData.EVN_MODIFIED || aData.EVN_CREATED == aData.EVN_MODIFIED)))
		addcss(this._main,'edited');

	var linkextras;
	if (aData.EVNLINKEXTRAS){
		linkextras = parseURL(aData.EVNLINKEXTRAS);

		if (linkextras.Evn_MetaData && !aData.EVN_METADATA)
		 	aData.EVN_METADATA = linkextras.Evn_MetaData;

		if (this.__aData.EVNLINKTYPE == '10' && Is.Defined(linkextras.ReaValue))
			aData.REAVALUE = linkextras.ReaValue;

		//Conference
		if (aData.EVNCLASS == 'S' && linkextras.organizer){
			aTmp.me = linkextras.organizer == sPrimaryAccount || linkextras.organizer == dataSet.get('main', ['user']);
			aTmp.avatar = {img:getAvatarURL(linkextras.organizer), link:MailAddress.createEmail(linkextras.organizer_name, linkextras.organizer).urlEncode()};
			aTmp.name = linkextras.organizer_name || linkextras.organizer;

			aTmp.private_name = aData.AccountName = linkextras.organizer_name || linkextras.organizer;
			aTmp.private_email = aData.AccountEmail = linkextras.organizer;
		}
		else
		if (linkextras.AccountEmail){
			aTmp.private_name = aData.AccountName = linkextras.AccountName || linkextras.AccountEmail;
			aTmp.private_email = aData.AccountEmail = linkextras.AccountEmail;
		}
	}

	//Invite and SYSTEM
	if (aData.EVNCLASS == 'W'){

		delete aTmp.private_email;

		if (aData.EVNLINKTYPE == '7' || aData.EVNLINKTYPE == '8'){
			if ((aTmp.me =  aData.AccountEmail == sPrimaryAccount || aData.AccountEmail == dataSet.get('main', ['user'])))
				addcss(this._main,'me');

			addcss(this._main, 'system');

			aTmp.avatar = {img:getAvatarURL(aData.AccountEmail), link:MailAddress.createEmail(aData.AccountName, aData.AccountEmail).urlEncode()};

			if (aData.EVNLINKTYPE == '7')
				aTmp.body = getLang('CHAT::ROOM_CREATED',[aData.AccountName.escapeHTML()]);
			else
				aTmp.body = getLang('CHAT::ROOM_PRIVATE_CREATED',[aData.AccountName.escapeHTML()]);
		}
	}
	else
	if (aData.EVNCLASS == 'S'){

		//put proper me, avatar here from "organizator_name" when ready on server

	}
	else
	//Other types
	if (aData.AccountEmail)
		addcss(this._main, 'private');

	//User edited document from Admin
	if (aData.EVNCLASS == 'R' && aData.EVNLINKTYPE == '1')
		aTmp.modify_text = getLang('CHAT::MODIFIED_BY',['<strong>'+ (linkextras.EvnOwnerName || linkextras.EvnOwnerEmail || '').escapeHTML() +'</strong>']);

	if (!aTmp.body)
		addcss(this._main, 'nobody');

	if (this._type == 'obj_groupchat_pin'){
		aTmp.time = getLang('CHAT::PIN_CAPTION', [aTmp.time]);
		this._draw('obj_groupchat_pin', 'main', aTmp);
	}
	else{
		aTmp.body = obj_highlight._highlight(aTmp.body);
		if(aData.EVNCLASS === 'I') {
			aTmp.body = aTmp.body || ' ';
		}
		this._draw('obj_groupchat_item', 'main', aTmp);

		if (this.__list.__options.comments && aData.EVNCOMEVNID && aData.EVNCOMLINKEXTRAS){

			var com = {aid:aData.aid, fid:aData.fid, iid:WMItems.__clientID(aData.EVNCOMEVNID)},
				tmp = parseURL(aData.EVNCOMLINKEXTRAS);

			for (var i in tmp)
				com[i.toUpperCase()] = tmp[i];

			if (obj_groupchat_item.__comTypes[com.EVNCLASS])
				this._create('item',obj_groupchat_item.__comTypes[com.EVNCLASS],'comment','', com);
			else
				console.warn('Unauthorized EVNCLASS', com);

			//Reply button
			addcss(this._main.parentElement, 'com');
			this._getAnchor('reply').onclick = function(){
				this._comment();
			}.bind(this);
		}
	}

	//Reactions
	if (aData.EVN_METADATA){
		var meta = parseURL(aData.EVN_METADATA);

		if (meta.core_reactions_data)
			aData.META_REACTIONS = parseURL(meta.core_reactions_data);

		if (!aData.META_COMMENTS && meta.core_commentsinfo)
			aData.META_COMMENTS = parseURL(meta.core_commentsinfo);
	}

	this._init_reactions(aData, true);

	//Control bar
	var eBorder = this._getAnchor('border'),
		aAccess = WMFolders.getAccess([aData.aid, aData.fid]);

	if (this._parent._type == 'obj_groupchat_pin'){
		eBorder.onclick = function(e){
			var e = e || window.event;
			e.cancelBubble = true;
			e.stopPropagation && e.stopPropagation();
			this.__list._serverSort({aid:this.__aData.aid, fid:this.__aData.fid}, false, {until:this.__aData.iid, highlight:true});
			return false;
		}.bind(this);
	}
	else{
		eBorder.onclick = function(e){
			var e = e || window.event,
				elm = e.target || e.srcElement;

			if (hascss(me._main, 'edit') || elm.tagName == 'FORM' || Is.Child(elm,'FORM', this) || (elm.tagName == 'SPAN' && (hascss(elm,'mention') || hascss(elm,'private_msg'))))
				return;

			if (this.__timein){
				clearTimeout(this.__timein);
				delete this.__timein;
			}

			if (this.__timeout){
				clearTimeout(this.__timeout);
				delete this.__timeout;
			}

			if (aAccess.write && me._init_controls(true))
				addcss(me._main.parentElement, 'active');
		};
	}

	eBorder.onmouseover = function(e){

		if (this.__timeout){
			clearTimeout(this.__timeout);
			delete this.__timeout;
		}

		if (hascss(me._main, 'edit'))
			return;

		if (!this.__timein)
			this.__timein = setTimeout(function(){

				if (me && !me._destructed){
					if (aAccess.write && me._init_controls(true))
						addcss(me._main.parentElement, 'active');
				}

			}, 50);

	};

	eBorder.onmouseout = function(e){

		if (!Is.Child(e.relatedTarget, this)){

			if (this.__timein){
				clearTimeout(this.__timein);
				delete this.__timein;
			}

			if (hascss(me._main, 'edit'))
				return;

			if (!this.__timeout)
				this.__timeout = setTimeout(function(){
					if (me && !me._destructed){
						if (me._init_controls(false))
							removecss(me._main.parentElement, 'active');
					}
				}.bind(this), 25);
		}
	};


/*
		this._main.onmouseover = function(e){
			if (eBorder.__timeout){
				clearTimeout(eBorder.__timeout);
				delete this.__timeout;
			}
		};

		this._main.onmouseout = function(e){
			if (!Is.Child(e.relatedTarget,this)){
				if (me.__controls){

					if (eBorder.__timein){
						clearTimeout(eBorder.__timein);
						delete eBorder.__timein;
					}

					if (eBorder.__timeout){
						clearTimeout(eBorder.__timeout);
						delete eBorder.__timeout;
					}

					eBorder.__timeout = setTimeout(function(){
						removecss(me._main, 'controls');

						if (me.smiles)
							me.smiles._destruct();
					}, 1000);
				}
			}
		};
*/

	//Item base code is fully done (apply animations since now)
	this.__initialised = true;
};

_me._ungroup = function(bForce){

	if (this._cangroup){
		this._cangroup = false;

		var eSec = Is.Child(this._main, 'SECTION', this.__list._main);
		if (eSec)
			if (!bForce && this.__aData.EVNCOMEVNID){
				if (hascss(eSec, 'group'))
					addcss(eSec, 'nogroup');
			}
			else{
				if (this.__aData.EVNCOMEVNID && this.item && this.item.__updateMe){
					this.item.__update();
					//async __update handler for ungroup would be nice here...
				}
				removecss(eSec, 'group');
			}
	}
};

_me._edit = function(b){

	//make <section> active
	var sel = Is.Child(this._main, 'SECTION', this.__list._main);

	if (!b && this.text){
		this.text._destruct();

		if (this.preview)
			this.preview._destruct();

		removecss(this._main, 'edit');
		removecss(sel, 'edit');

		this.__list._mask(false);
		this.__list.__options.autoscroll = true;
	}
	else
	if (b && !this.text){

		this.__list._mask(true);

		//jump fix 1
		if (this.__aData.EVNCLASS == 'I')
			this._getAnchor('addon').style.height = this._getAnchor('addon').offsetHeight + 'px';


		//Scroll fix part 1
		var eBody = this._getAnchor('body'),
			initHeight = Math.min(eBody.offsetHeight, 450);

		eBody.style.height = initHeight + 'px';

		addcss(this._main, 'edit');
		addcss(sel, 'edit');
		this._init_controls(false);

		this._create('text', 'obj_chat_input','body','small',{parseurl:this.__aData.EVNCLASS == 'I'});
		this.text.input.__maxHeight = 450;
		this.text.__lastURL = this.__aData.EVNURL;
		this.text._folder({aid:this.__aData.aid,fid:this.__aData.fid});

		/* Preview part */
		if (this.__aData.EVNCLASS == 'I'){

			if (this.__aData.EVNURL){

				var bVid = this.__aData.CORE_LINKINFO && this.__aData.CORE_LINKINFO['type'] == 2 && this.__aData.CORE_LINKINFO.videourl,
					w = bVid?500:300,
					h = bVid?281:600;

				var aOut = {
					DESC:[{VALUE:this.__aData.EVNLOCATION}],
					TITLE:[{VALUE:this.__aData.EVNTITLE}],
					URL:[{VALUE:this.__aData.EVNURL}],
					IMAGES:[{IMAGE:[{
						URL:[{VALUE:'server/download.php?' + buildURL({'sid':dataSet.get('main',['sid']), 'class':'attachment', 'fullpath': [this.__aData.aid, this.__aData.fid, WMItems.__serverID(this.__aData.iid), this.__aData.EVNTHUMBNAILID].join('/'),'resize':1, 'width':w, 'height':h, 't':this.__aData.EVNTHUMBNAILTIME || 0})}]
					}]}]
				};

				this.text.preview = this._create('preview', 'obj_urlpreview','addon','', aOut);
				this.text.preview._onclose = function(){
					this.text._focus();
				}.bind(this);

				//jump fix 2
				this._getAnchor('addon').style.height = '';
			}

			this.text.__urlloading = function(b){
				//b?addcss(this._main, 'loading'):removecss(this._main, 'loading');
			}.bind(this);

			this.text.__urlpreview = function(aData){
				this.preview = this._parent._create('preview', 'obj_urlpreview','addon','', aData);
			};
		}

		//Submit
		this.text._onsubmit = function(v, aArgs, aPrivate){
			this.text.input._disabled(true);

			if (this.__save(v, aArgs, aPrivate) === false)
				this.text.input._disabled(false);

			return false;
		}.bind(this);

		//Cancel
		this.text.input._onclose = function(){
			if (!this.text.input.suggest)
				this._edit(false);
		}.bind(this);

		//Private (I)
		if (this.__aData.EVNLINKEXTRAS && this.__aData.EVNCLASS == 'I'){
			var ext = parseURL(this.__aData.EVNLINKEXTRAS);
			if (ext.AccountEmail)
				this.text._private(ext.AccountName, ext.AccountEmail);
		}

		if (Is.String(this.__aData.EVNNOTE)){
			this.text._value(this.__aData.EVNNOTE);
			this.text.input._setRange(this.__aData.EVNNOTE.length);
		}
		else
			this.text._focus();

		//Scroll fix part 2
		// if ('scrollIntoViewIfNeeded' in document.body)
		// 	this._main.scrollIntoViewIfNeeded(true);
		// else
			this._main.scrollIntoView({behavior: "smooth", block: "center"});

		eBody.style.height = '';
		eBody = null;

		this._getAnchor('esc_msg').onclick = function(e){
			var e = e || window.event;
				e.cancelBubble = true;
				e.stopPropagation && e.stopPropagation();

			this._edit(false);

		}.bind(this);

		this.__list.__options.autoscroll = false;
	}

};

_me.__save = function(v, aArgs, aPrivate){

	var aPrivate = aPrivate || {};

	var url1 = this.__aData.EVNURL || '',
		url2 = aArgs && aArgs.url?aArgs.url:'';

	if (this.__aData.AccountEmail == aPrivate.email && this.__aData.EVNNOTE == v && url1 == url2)
		this._edit(false);
	else{

		var v = v,
			aItemInfo = {
				values:{
					EVNNOTE:v
				}
			};

		switch (this.__aData.EVNCLASS){
			case 'I':
				aItemInfo.values.EVNLINKID = aPrivate.email?aPrivate.email:'';

				if (this.__aData.EVNURL)
					this.__aData.EVNURL = aItemInfo.values.EVNURL = '';

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
				}

				break;
		}

		WMItems.add([this.__aData.aid, this.__aData.fid, this.__aData.iid], aItemInfo,'','','', [function(bOK){

			if (bOK === true){

				//Edit css
				v?removecss(this._main, 'nobody'):addcss(this._main, 'nobody');
				addcss(this._main, 'edited');

				//finish editing
				this._edit(false);

				this._ungroup();

				//Fire Update event
				this.__list._fire(this.__aData.iid, 'update');

			}
			else
				this._edit(false);

		}.bind(this)]);
	}
};

_me._pin = function(sVal){

	var sAction = sVal == 'public'?'add_global_pin':'add_pin';

	if (this.__aData.GPINWHEN && sVal == 'public')
		sAction = 'delete_global_pin';
	else
	if (this.__aData.LPINWHEN && sVal == 'private')
		sAction = 'delete_pin';

	WMItems.action({aid:this.__aData.aid, fid:this.__aData.fid, iid:this.__aData.iid}, sAction, [function(bOK, aData){

		if (bOK && this.__list){
			var arg = {};

			if (sAction == 'add_global_pin' && aData.IQ && aData.IQ[0].RESULT && aData.IQ[0].RESULT[0].LAST_PINNED_ITEM)
				arg.LAST_PINNED_ITEM = aData.IQ[0].RESULT[0].LAST_PINNED_ITEM[0].VALUE;

			//call pin event
			if (!this.__list._fire(this.__aData.iid, sAction, arg) && this.__update)
				this.__update(true);
		}

	}.bind(this)]);
};

_me._reaction = function(sVal){

	if (this.__aData.REAVALUE != sVal && this.__pendingReaction !== sVal){

		this.__pendingReaction = sVal; //Safari async issue

		var aItemInfo = {
				reactions:{REACTION:{values:{REACTION:sVal || ''}}}
			};

		WMItems.add([this.__aData.aid, this.__aData.fid, this.__aData.iid], aItemInfo,'','','', [function(sVal, sRea, bOK, aData){

			if (this.react){
				this.react._destruct();
				delete this.react;
			}

			if (bOK){

				var sType = 'reaction',
					sBody = sVal;

				if (!sVal){
					sType = 'reaction-deleted';
					sBody = sRea;
				}

				if (this.__list && !this.__list._fire(this.__aData.iid, sType, {BODY:sBody, REAVALUE:sVal}) && this._init_reactions){

					var meta_reactions = '';
					if (aData.xml && (aData = aData.xml.IQ) && (aData = aData[0].RESULT) && aData[0].META_REACTIONS)
						meta_reactions = aData[0].META_REACTIONS[0].VALUE;

					this._init_reactions({META_REACTIONS:meta_reactions?parseURL(meta_reactions):'', REAVALUE:sVal});
				}

				this.__pendingReaction = null;
			}
			else
			if (this.__list && !this.__list._fire(this.__aData.iid, 'update') && this.__update){
				this.__pendingReaction = null;
				this.__update(true);
			}

		}.bind(this, sVal, this.__aData.REAVALUE)]);
	}
};

_me._data = function(id, aData, sCall, aArgs){
	var obj = this;

	if (Is.Defined(id) && this.__aData.iid != id){
		if (this.item && !this.item._destructed && this.item.__aData && this.item.__aData.iid == id){
			obj = this.item;

			if (hascss(this._main.parentElement, 'group')){
				obj.__updateMe = true;
				return;
			}

		}
		else
		if (parseInt(this.__aData.EVNLINKTYPE, 10) !== 10 && WMItems.__clientID(this.__aData.EVNLINKID) != id){
			if (parseInt(this.__aData.EVNLINKTYPE, 10) == 10 && this.item && !this.item._destructed && this.item.__aData && this.item.__aData.EVNLINKID == id)
				obj = this.item;
			else
				return;
		}
	}

	if (Is.Object(aData))
		for(var k in aData)
			obj.__aData[k] = aData[k];

	if (sCall && Is.Function(obj[sCall]))
		obj[sCall].apply(obj, aArgs || []);
};

_me._init_reactions = function(aData, bNoScroll){
	var show = false,
		aData = aData || this.__aData,
		div = mkElement('div'),
		r = {};

	//From detail
	if (aData.REACTIONS){

		this.__aData.REACTIONS = aData.REACTIONS;
		var sRea = '';
		for (var id in aData.REACTIONS)
			if (aData.REACTIONS[id].values && aData.REACTIONS[id].values.REAVALUE){
				r[aData.REACTIONS[id].values.REAVALUE] = (r[aData.REACTIONS[id].values.REAVALUE] || 0) + 1;

				if (aData.REACTIONS[id].values.REAOWNEMAIL == sPrimaryAccount || aData.REACTIONS[id].values.REAOWNEMAIL == dataSet.get('main', ['user']))
					sRea = aData.REACTIONS[id].values.REAVALUE;
			}

		this.__aData.REAVALUE = sRea;
	}
	else
	//From list
	if (aData.META_REACTIONS){

		r = this.__aData.META_REACTIONS = aData.META_REACTIONS;
		delete this.__aData.REACTIONS;

		if (Is.Defined(aData.REAVALUE))
			this.__aData.REAVALUE = aData.REAVALUE;
	}
	else
	//From notification
	if (aData.NOTIFY_REACTIONS){

		if (this.__aData.REACTIONS){
			for (var id in this.__aData.REACTIONS)
				if (this.__aData.REACTIONS[id].values && this.__aData.REACTIONS[id].values.REAVALUE){
					r[this.__aData.REACTIONS[id].values.REAVALUE] = (r[this.__aData.REACTIONS[id].values.REAVALUE] || 0) + 1;
				}

			delete this.__aData.REACTIONS;
		}
		else
		if (this.__aData.META_REACTIONS){
			r = this.__aData.META_REACTIONS;
		}

		if (aData.ACTION == 'reaction'){
			r[aData.NOTIFY_REACTIONS] = parseInt(r[aData.NOTIFY_REACTIONS] || 0) + 1;

			if (Is.Defined(aData.REAVALUE) && this.__aData.REAVALUE != aData.REAVALUE){

				if (this.__aData.REAVALUE){
					if (r[this.__aData.REAVALUE]>'1')
						r[this.__aData.REAVALUE] = parseInt(r[this.__aData.REAVALUE]) - 1;
					else
						delete r[this.__aData.REAVALUE];
				}

				this.__aData.REAVALUE = aData.REAVALUE;
			}
		}
		else{
			if (r[aData.NOTIFY_REACTIONS]>'1')
				r[aData.NOTIFY_REACTIONS] = parseInt(r[aData.NOTIFY_REACTIONS]) - 1;
			else{
				delete r[aData.NOTIFY_REACTIONS];
			}

			if (Is.Defined(aData.REAVALUE))
				this.__aData.REAVALUE = aData.REAVALUE;
		}

		this.__aData.META_REACTIONS = r;
	}
	else{
		delete this.__aData.REACTIONS;
		this.__aData.REAVALUE = '';
	}

	//close reaction bubble
	if (this.react){
		this.react._destruct();
		delete this.react;
	}

	var cnt = 0;
	if (!Is.Empty(r)){
		show = true;

		for (var i in r)
			if (i){
				div.appendChild(mkElement('span',{className:'react r_' + i + (this.__aData.REAVALUE === i?' mine':''), rel:i, innerHTML:r[i] || 1}));
				cnt += parseInt(r[i]);
			}
	}

	//Pins
	if (Is.Defined(aData.GPINWHEN))
		this.__aData.GPINWHEN = aData.GPINWHEN;

	if (this.__aData.GPINWHEN){
		div.appendChild(mkElement('span',{className:'pin public' + (aData.PINOWNEMAIL && (aData.PINOWNEMAIL == sPrimaryAccount || aData.PINOWNEMAIL == dataSet.get('main', ['user']))?' delete':'') , innerHTML:getLang('SHARING::PUBLIC')}));
		show = true;
	}

	if (Is.Defined(aData.LPINWHEN))
		this.__aData.LPINWHEN = aData.LPINWHEN;

	if (this.__aData.LPINWHEN){
		div.appendChild(mkElement('span',{className:'pin private delete', innerHTML:getLang('SHARING::PRIVATE')}));
		show = true;
	}

	//Comments
	if (!this.__aData.EVNCOMEVNID){
		var etmp, cnt = 0;

		if (Is.Defined(aData.META_COMMENTS))
			this.__aData.META_COMMENTS = aData.META_COMMENTS;
		else
		if (Is.Defined(aData.EVN_METADATA)){
			var meta = parseURL(aData.EVN_METADATA);

			if (meta.core_reactions_data)
				this.__aData.META_REACTIONS = parseURL(meta.core_reactions_data);

			if (meta.core_commentsinfo)
				this.__aData.META_COMMENTS = parseURL(meta.core_commentsinfo);
		}

		if (this.__aData.META_COMMENTS && this.__aData.META_COMMENTS.count)
			cnt = parseInt(this.__aData.META_COMMENTS.count) || 0;

		if (cnt>0){

			etmp = mkElement('span',{className:'comments', innerHTML:getLang('CHAT::COMMENTS',['<b>' + cnt + '</b>'])});

			//update title
			if (this._parent !== this.__list && this._parent.__aData && this._parent.__aData.EVNCOMEVNID){

				var pd = this._parent.__aData,
					metadata = parseURL(pd.EVN_METADATA),
					s = (pd.EVNMODIFIEDOWNEREMAIL == sPrimaryAccount || pd.EVNMODIFIEDOWNEREMAIL == dataSet.get('main', ['user']))?getLang('COMMON::YOU'):(pd.EVNMODIFIEDOWNERNAME || pd.EVNMODIFIEDOWNEREMAIL || metadata.core_own_name || ''),
					d = IcewarpDate.unix(aData.EVN_CREATED || this.__aData.EVN_CREATED || 0),
					n2 = mkElement('strong',{text:this.__aData.EVNMODIFIEDOWNERNAME || this.__aData.EVNMODIFIEDOWNEREMAIL}).outerHTML;

				var	eUsr = mkElement('strong',{text:s});
					eUsr.insertBefore(mkElement('div',{style: {'background-image': 'url("'+getAvatarURL(pd.EVNMODIFIEDOWNEREMAIL)+'")'}}), eUsr.childNodes[0]);

				var str = '<span class="unselectable">'+ getLang('CHAT::COMMENTED' + ((pd.EVNMODIFIEDOWNEREMAIL == sPrimaryAccount || pd.EVNMODIFIEDOWNEREMAIL == dataSet.get('main', ['user'])) ? '_YOU' : ''),[eUsr.outerHTML, n2, getLang('CHAT::TYPE_' + pd.EVNCLASS)]) +'</span>';
					str += '<span class="time unselectable" title="'+ d.format('L LT') +'">'+ d.format(d.isSame(IcewarpDate.unix(pd.EVN_CREATED), 'day') ? 'LT' : 'L LT') +'</span>';

				this._main.querySelector('h3.name').innerHTML = str;
			}

			div.appendChild(etmp);
			etmp = null;
			show = true;
		}

	}

	if (bNoScroll)
		removecss(this._main, 'anim');
	else
		addcss(this._main, 'anim');

	if (!show){
		removecss(this._main, 'reactions');
	}
	else{
		var elm = this._getAnchor('reactions');
			elm.innerHTML = div.innerHTML;

		if (!this.__reactions){
			this.__reactions = true;

			//click on reaction
			if(WMFolders.getAccess({aid:this.__aData.aid, fid:this.__aData.fid},'write'))
				elm.onclick = function(e){
					var eT = e.target || e.srcElement;
					if (eT.tagName == 'SPAN'){
						var skip = false;

						if (hascss(eT,'react')){


							if (this.__reactTimeOut){
								window.clearTimeout(this.__reactTimeOut);
								delete this.__reactTimeOut;
							}

							if (this.__reactTimeIn){
								window.clearTimeout(this.__reactTimeIn);
								delete this.__reactTimeIn;
							}

							if (this.react){
								this.react._destruct();
								delete this.react;
							}

							var sVal = eT.getAttribute('rel');
							this._reaction(this.__aData.REAVALUE == sVal?'':sVal);

							skip = true;
						}
						else
						if (hascss(eT,'comments') && this.__list.__options.comments){
							this._comment();
							skip = true;
						}
						else
						if (hascss(eT,'pin') && hascss(eT,'delete')){
							this._pin(hascss(eT,'private')?'private':'public');
							skip = true;
						}

						if (skip){
							e.cancelBubble = true;
							e.stopPropagation && e.stopPropagation();
							return false;
						}
					}
				}.bind(this);

			elm.onmouseover = function(e){
				var eT = e.target || e.srcElement;
				if (eT.tagName == 'SPAN' && hascss(eT,'react')){

					if (this.__reactTimeOut){
						window.clearTimeout(this.__reactTimeOut);
						delete this.__reactTimeOut;
					}

					if (this.__reactTimeIn){
						window.clearTimeout(this.__reactTimeIn);
						delete this.__reactTimeIn;
					}

					this.__reactTimeIn = setTimeout(
						function(){
							this._show_react(eT);
						}.bind(this), 500);
				}
			}.bind(this);

			elm.onmouseout = function(e){

				if (this.__reactTimeOut){
					window.clearTimeout(this.__reactTimeOut);
					delete this.__reactTimeOut;
				}

				if (this.__reactTimeIn){
					window.clearTimeout(this.__reactTimeIn);
					delete this.__reactTimeIn;
				}

				if (this.react)
					this.__reactTimeOut = setTimeout(
						function(){
							if (this.react){
								this.react._destruct();
								delete this.react;
							}
						}.bind(this), 300);

			}.bind(this);

		}

		//Animatin vs Scroll handling
		if (this.__initialised && !hascss(this._main, 'reactions')){

			// shift last item up to see reactions
			if (!bNoScroll && !this._main.parentNode.nextSibling) {
				if (browserEvent('transitionend')) {
					var interval = setInterval(function() {
						if (this.__list && !this.__list._destructed)
							this.__list._scrollBy(this._main.offsetHeight);
						else
							clearInterval(interval);
					}.bind(this), 5);

					var reactions = this._main.querySelectorAll('.reactions');
					var elm = reactions[reactions.length - 1];
					var transition_callback = function() {
						clearInterval(interval);
						elm.removeEventListener(browserEvent('transitionend'), transition_callback);
					};
					elm.addEventListener(browserEvent('transitionend'), transition_callback);
				} else {
					setTimeout(function() {
						if (this.__list && !this.__list._destructed)
							this.__list._scrollBy(this._main.offsetHeight);
					}.bind(this), 300); // 300ms animation
				}
			}
		}

		addcss(this._main, 'reactions');
	}
};

_me._init_controls = function(bShow){
	if (this._parent._type == 'obj_groupchat_pin')
		return true;

	if (bShow){

		if (!this.controls){

			var aOpt = {
				draft: (sPrimaryAccountGUEST  || (TeamChatAPI && TeamChatAPI.teamChatOnly())) ? false : (this.__aData.EVNCLASS == 'Y' && this.__aData.EVNLINKEXTRAS && parseURL(this.__aData.EVNLINKEXTRAS).EvnFlags & 128),
				mail: (sPrimaryAccountGUEST  || (TeamChatAPI && TeamChatAPI.teamChatOnly())) ? false : (this.__aData.EVNCLASS == 'Y'),
				nopin: this.__aData.EVNCLASS == 'W' || this.__aData.EVNLINKTYPE == '10',
				noedit: (!this.__list.__options.comments && !this.__aData.EVNCOMEVNID) || this.__aData.EVNCLASS == 'Q' || this.__aData.EVNLINKTYPE == '10' || (this.__aData.EVNCLASS == 'W' && (this.__aData.EVNLINKTYPE == '7' || this.__aData.EVNLINKTYPE == '8')) || !((this.__aData.EVNOWNEREMAIL == sPrimaryAccount || this.__aData.EVNOWNEREMAIL == dataSet.get('main', ['user'])) || WMFolders.getAccess({aid:this.__aData.aid, fid:this.__aData.fid},'modify')),
				notrash: (!this.__list.__options.comments && !this.__aData.EVNCOMEVNID) || !(this.__aData.EVNOWNEREMAIL == sPrimaryAccount || this.__aData.EVNOWNEREMAIL == dataSet.get('main', ['user']) || WMFolders.getAccess({aid:this.__aData.aid, fid:this.__aData.fid},'remove')),
				nocomment:!this.__list.__options.comments || /*this.__aData.EVNCLASS == 'B' ||*/ this.__aData.EVNLINKTYPE == '10'
			};

			this._create('controls','obj_tch_control','border','',aOpt, this.__aData, [function(sAction, sData){

				switch(sAction){

					//REACTION
					case 'reaction':

						if (this.__aData.EVNLINKTYPE == '10'){
							if (this.item){
								if (this.item.__aData.REAVALUE == sData)
									this.item._reaction('');
								else
									this.item._reaction(sData);
							}
						}
						else
						if (this.__aData.REAVALUE == sData)
							this._reaction('');
						else
							this._reaction(sData);

						break;

					//COMMENT
					case 'comment':
						this._comment();
						break;

					//PIN
					case 'pin':
						this._pin(sData);
						break;

					//MORE
					case 'edit':
						if (this._edit)
							this._edit(true);
						break;

					case 'remove':
						//Removing locked item
						if (this.__aData.EVNLINKEXTRAS){
							var linkextras = parseURL(this.__aData.EVNLINKEXTRAS) || {};
							if (linkextras.evnlockown_id && linkextras.evnlockown_id !== sPrimaryAccountGWID){

								var frm = gui._create('remove', 'frm_confirm_threestates', '', 'noblur', [
									function () {
										TeamChatAPI.requestUnlock(this.__aData.fid, this.__aData.EVNTITLE, linkextras.evnlockown_email, 'remove');
									}.bind(this)
								], 'CONFIRMATION::DELETE_ITEM_CONFIRMATION', 'CONFIRMATION::DELETE_LOCKED_ITEM', [linkextras.evnlockown_email]);

								frm.x_btn_ok._value('DOCUMENT::REQUEST_UNLOCK');

								frm.x_btn_cancel._value('FORM_BUTTONS::REMOVE');
								frm.x_btn_cancel._onclick = function(){
									frm._destruct();
									this.__remove();
								}.bind(this);
								addcss(frm.x_btn_cancel._main, 'color2');

								return;
							}
						}

						this.__remove();
						break;

					//EMAIL
					case 'reply':
					case 'reply_all':
						var bIsHTML;
						if (this.__aData.EVNLINKEXTRAS){
							var linkextras = parseURL(this.__aData.EVNLINKEXTRAS) || {};
							if(linkextras.EvnFlags) {
								bIsHTML = !!(linkextras.EvnFlags & 256);
							}
						}
						OldMessage.reply([this.__aData.aid, this.__aData.fid, WMItems.__clientID(this.__aData.EVNLINKID + '|@@MAIN@@')], sAction == 'reply_all', void 0, void 0, bIsHTML);
						break;

					case 'forward':
						var bIsHTML;
						if (this.__aData.EVNLINKEXTRAS){
							var linkextras = parseURL(this.__aData.EVNLINKEXTRAS) || {};
							if(linkextras.EvnFlags) {
								bIsHTML = !!(linkextras.EvnFlags & 256);
							}
						}
						OldMessage.forward([this.__aData.aid, this.__aData.fid, WMItems.__clientID(this.__aData.EVNLINKID + '|@@MAIN@@')], void 0, void 0, bIsHTML);
						break;

					case 'edit_mail':

						//CHECK LOCKID!!!
						//sPrimaryAccountGWID

						//Unlock TeamChat Item
						if (true){
							var id = [this.__aData.aid, this.__aData.fid, WMItems.__clientID(this.__aData.EVNLINKID)];

							Item.set_lock(id, true, false, [function(bOK){

								var bIsHTML;
								if (this.__aData.EVNLINKEXTRAS){
									var linkextras = parseURL(this.__aData.EVNLINKEXTRAS) || {};
									if(linkextras.EvnFlags) {
										bIsHTML = !!(linkextras.EvnFlags & 256);
									}
								}
								if (bOK){

									var sName = dataSet.get('folders', [this.__aData.aid, this.__aData.fid,'NAME']) || dataSet.get('folders', [this.__aData.aid, this.__aData.fid,'RELATIVE_PATH']) || '';
									var aOpt = {
										sTeamchat: this.__aData.fid + (sName?'::'+sName:''),
										sComment: this.__aData.EVNNOTE,
										__id_chat: id,
										__id:null
									};

									OldMessage.edit([this.__aData.aid, this.__aData.fid, WMItems.__clientID(this.__aData.EVNLINKID + '|@@MAIN@@')], aOpt, bIsHTML);
								}
								else{
									var aLockInfo = {id:WMItems.__clientID(this.__aData.EVNLINKID)};

									if (this.__aData.EVNLINKEXTRAS){
										var linkextras = parseURL(this.__aData.EVNLINKEXTRAS) || {};
										aLockInfo.EVNLOCKOWN_EMAIL = linkextras.evnlockown_email;
										aLockInfo.EVNLOCKOWN_ID = linkextras.evnlockown_id;
										aLockInfo.EVNTITLE = linkextras.EvnTitle;
										aLockInfo.draft = linkextras.EvnFlags & 128;
									}

									//LOCK ERROR
									OldMessage.openwindow([this.__aData.aid, this.__aData.fid, WMItems.__clientID(this.__aData.EVNLINKID+'|@@MAIN@@')], null, aLockInfo, bIsHTML);
								}

							}.bind(this)]);
						}

						break;
				}

			}.bind(this)]);
		}

		this.controls._onhide = function(){
			removecss(this._main.parentElement, 'active');
		}.bind(this);

		this.controls._show();

	}
	else
	if (this.controls)
		return this.controls._hide();

	return true;
};

_me.__remove = function(){
	WMItems.remove({aid:this.__aData.aid, fid:this.__aData.fid, iid:[this.__aData.iid]},'','','',[function(bOK){
		bOK && this.__list._fire(this.__aData.iid, 'delete');
	}.bind(this)]);
};

_me._init_body = function(aData){
	if (aData.EVNNOTE){
		if (aData.EVNLINKEXTRAS){
			var linkextras = parseURL(aData.EVNLINKEXTRAS);
			if (linkextras.AccountEmail){
				aData.AccountName = linkextras.AccountName || linkextras.AccountEmail;
				aData.AccountEmail = linkextras.AccountEmail;
			}
		}

		//update scroll!
		this._draw('obj_groupchat_message', 'body',
			{
				body: obj_highlight._highlight(this.__encode_body(aData.EVNNOTE, aData.MENTIONS)),
				private_name: aData.AccountName,
				private_email: aData.AccountEmail
			}
		);

		removecss(this._main, 'nobody');
		addcss(this._main, 'edited');

		var edit = this._main.getElementsByClassName('edit'),
		name = aData.EVNMODIFIEDOWNERNAME && aData.EVNMODIFIEDOWNERNAME != '0'?aData.EVNMODIFIEDOWNERNAME:aData.EVNMODIFIEDOWNEREMAIL;
		edit && edit[0] && (edit[0].innerHTML = getLang('CHAT::EDITED_BY', ['<strong>' + name.escapeHTML() + '</strong>', IcewarpDate.unix(aData.EVN_MODIFIED).format('LT')]));
	}
	else{
		addcss(this._main, 'nobody', 'edited');
		this._getAnchor('body').innerHTML = '';
	}

	//Update Data
	this.__aData.EVNNOTE = aData.EVNNOTE;
	this.__aData.MENTIONS = aData.MENTIONS;
	this.__aData.AccountName = aData.AccountName;
	this.__aData.AccountEmail = aData.AccountEmail;
};

_me._show_react = function(elm){
	if (elm){

		if (this.__reactTimeIn){
			window.clearTimeout(this.__reactTimeIn);
			delete this.__reactTimeIn;
		}

		if (this.__aData.REACTIONS)
			this._fill_react(elm);
		else{
			var iid = this.__aData.iid;

			if (this.__aData.EVNLINKTYPE == '10')
				iid = this.__aData.EVNLINKID?WMItems.__clientID(this.__aData.EVNLINKID):this.__aData.iid;

			var aItemsInfo = {aid:this.__aData.aid, fid:this.__aData.fid, iid:iid, values:[]};
			WMItems.list(aItemsInfo,'','','',[function(aData){

				if (aData && (aData = aData[this.__aData.aid]) && (aData = aData[this.__aData.fid]) && (aData = aData[iid])){
					//Reactions
					this.__aData.REACTIONS = aData.REACTIONS;
					this._fill_react(elm);
				}

			}.bind(this)]);
		}
	}
};

_me._fill_react = function(elm){

	if (this.__aData.REACTIONS){

		if (!this.react || this.react._destructed){
			this.react = gui._create('react','obj_block','','react','absolute');

			this.react._main.onmouseover = function(e){
				if (this.__reactTimeOut){
					window.clearTimeout(this.__reactTimeOut);
					delete this.__reactTimeOut;
				}

				if (this.__reactTimeIn){
					window.clearTimeout(this.__reactTimeIn);
					delete this.__reactTimeIn;
				}

			}.bind(this);

			this.react._main.onmouseout = function(e){

				this.react._main.onmouseover(e);

				this.__reactTimeOut = setTimeout(
					function(){
						if (this.react){
							this.react._destruct();
							delete this.react;
						}
					}.bind(this), 300);

			}.bind(this);

		}

		var i = 0,
			sType = elm.getAttribute('rel');

		//Title
		this.react._main.innerHTML = '';
		this.react._main.appendChild(mkElement('h4',{text:getLang('SMILES_NAME::'+sType)}));

		//Values
		for(var id in this.__aData.REACTIONS){
			if (this.__aData.REACTIONS[id].values && sType == this.__aData.REACTIONS[id].values.REAVALUE){
				this.react._main.appendChild(mkElement('div',{text:this.__aData.REACTIONS[id].values.REAOWNNAME || this.__aData.REACTIONS[id].values.REAOWNEMAIL}));

				if (++i>10){
					this.react._main.appendChild(mkElement('div',{text:getLang('CHAT::REACTIONS_BUBBLE',[count(this.__aData.REACTIONS)-10])}));
					break;
				}
			}
		}

		var eAll = mkElement('div',{text:getLang('CHAT::ALL_REACTIONS'), className:'all'});
			eAll.onclick = function(){
				gui._create('reactions', 'frm_reactions','','', this.__aData, sType);
			}.bind(this);
		this.react._main.appendChild(eAll);


		//position
		var pos = getSize(elm),
			iTop = pos.y - (this.react._main.offsetHeight) - 15;

		if (iTop<10){
			addcss(this.react._main,'bottom');
			this.react._place(pos.x, pos.y + pos.h + 15);
		}
		else{
			removecss(this.react._main,'bottom');
			this.react._place(pos.x, iTop);
		}

	}
};

_me.__encode_body = function(sBody, aMentions, bShortUrl){
	//parse mentions from server
	var aMen = {};
	if (aMentions)
		for (var id in aMentions)
			aMen[aMentions[id].values.EMAIL] = {name:aMentions[id].values.NAME, email:aMentions[id].values.EMAIL};

	//block hljs & mentions
	var aOut = [],
		aBody = sBody.split('```');
	if (aBody.length<3)
		aBody = [sBody];

	//search for inline hljs outside hl-blocks
	aBody.forEach(function(s, i){
		if (i%2 == 0){
			var a = s.split('`');
			if (a.length>2){
				a.forEach(function(v,j,a){
        			var l = aOut.length;
					if (j && l%2 && (a[j]=='' || (j-1 && a[j-1]=='') || typeof a[j+1] == 'undefined')) //(a[j+1]=='' && a.length>j+2) ||
						aOut[l-1].value += '`'+v;
					else
						aOut.push({
							value: v,
							wrapper: j%2 && '`'
						});
				});
				return;
			}
		}

		aOut.push({
			value: s,
			wrapper: i%2 && '```'
		});
	});

	return aOut.map(function(v, i){
		//Decorate only odd entries
		if (i%2 == 0){
			//Smiles
			var hla = v.value.highlight_links_array(bShortUrl),
				str =  GWOthers.getItem('CHAT','smiles') == '1' ? Smiles.replaceSmiles(hla.string.escapeHTML()) : hla.string.escapeHTML();

			var sOut = str.replace(new RegExp(hla.replace, 'g'), function(s, id){
				return hla.array[id];
			});

			// Mentions
			if (sOut.indexOf('@[')>-1){
				sOut = sOut.replace(/(@\[([^\]]{1,128})\])/g, function(){
					var str = arguments[2],
						name = str,
						email = str.indexOf('@')>-1?str:str + '@' + dataSet.get('main',['domain']),
						full = email;
						title = email;

					if (name === '@all@') {
						name = getLang('CHAT::ALL_MEMBERS');
					} else if (aMen[email]){
						name = aMen[email].name || aMen[email].email;
						full = MailAddress.createEmail(aMen[email].name, aMen[email].email);
						title = MailAddress.createEmail(aMen[email].name, aMen[email].email, true);
					}

					return mkElement('span', {className:'mention ' + ((email == sPrimaryAccount || email == dataSet.get('main', ['user']))?' me':''), title:title, rel:full, text: (gui._rtl?'':'@')+name}).outerHTML;
				});
			}

			//links, icons, mentions
			return sOut;
		}

		//untouched, hljs output
		if(v.wrapper) {
			v.value = v.wrapper + v.value + v.wrapper;
		}
		return v.value;

	}).join('');
};

_me._finished = function(){
	if (this.__aData.EVNCLASS != 'I')
		[].forEach.call(this._main.querySelectorAll('.noclick'), function(elm){
			elm.onclick = function(e){
				var e = e || window.event;
				e.cancelBubble = true;
				e.stopPropagation && e.stopPropagation();
				return false;
			};
		});
};

_me._comment = function(){

	// if (this.__aData.EVNCLASS == 'B'){
	// 	var aData = clone(this.item.__aData, true);
	// }
	// else
	if (!!this.__aData.EVNCOMEVNID){

		if (this.__list.__options.comments && this.item){

			//Update when old values
			var aData = clone(this.item.__aData, true);
				aData.updateMe = this.item.__updateMe;

			gui.frm_main.main._create('comment', 'frm_comment','','', aData);
		}
	}
	else
	if (this.__aData.EVNLINKTYPE == '10'){
		if (this.item){
			var aData = clone(this.item.__aData, true);
			gui.frm_main.main._create('comment', 'frm_comment','','', aData);
		}
	}
	else
		gui.frm_main.main._create('comment', 'frm_comment','','', this.__aData);

};
