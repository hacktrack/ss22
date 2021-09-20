_me = obj_itemview.prototype;
function obj_itemview() {};

_me.__constructor = function(sDataSet,sDataPath) {
	var me = this;

	this._scrollbar(this._getAnchor('scroll'), this._main);

	this._aValues = {};
	this._aRefresh = null;
	this.__refresh = true;

	this.__last_tab = {};

	this._getAnchor('body').onclick = function(e){
		var e = e || window.event,
			elm = e.target || e.srcElement;

		if (!elm.parentNode) return;

		//Click on TAG
		if (elm.parentNode.className == 'tags' && gui.frm_main.search && gui.frm_main.search.search){
			gui.frm_main.search.search._value('tag:"' + elm.innerHTML + '"');
			if (gui.frm_main.search.search._onsubmit)
				gui.frm_main.search.search._onsubmit();

			return false;
		}
		else{
			if (elm.tagName != 'A')
				elm = elm.parentNode;

			if (elm.tagName == 'A'){
				if (hascss(elm,'lock')){

					var aRights = WMFolders.getRights({aid:me.__activeItemID[0],fid:me.__activeItemID[1]}),
						aAccess = WMFolders.getAccess({aid:me.__activeItemID[0],fid:me.__activeItemID[1]});

					if (aAccess.modify && !me.__activeItem.EVNLOCKOWN_ID){
						me.__activeItem.EVNLOCKOWN_ID = sPrimaryAccountGWID;
						elm.className = 'lock locked';
						elm.innerHTML = getLang('FILE::LOCKED_BY_ME');

						Item.set_lock(me.__activeItemID,true);
					}
					else
					if (aAccess.modify && (aRights.owner || me.__activeItem.EVNLOCKOWN_ID == sPrimaryAccountGWID)){
						me.__activeItem.EVNLOCKOWN_ID = '';
						elm.className = 'lock';
						elm.innerHTML = getLang('FILE::UNLOCKED');

						Item.set_lock(me.__activeItemID,false);
					}
					//compose
					else
					if (me.__activeItem.EVNLOCKOWN_EMAIL)
						Item.sendEmailTo(me.__activeItem.EVNLOCKOWN_EMAIL,{sSubject:me.__activeItem.EVNTITLE});

					return false;
				}
				else
				if (hascss(elm,'revisions')){
					if (Is.Array(me.__activeItemID)){
						Item.openwindow(me.__activeItemID,'','',me.__activeType, null, [
							function(frm){
								if (frm.maintab['revisions'])
									frm.maintab['revisions']._active();
							}
						]);
					}
					return false;
				}
				else
				if (hascss(elm,'itmnote')){
					if (Is.Array(me.__activeItemID)){
						Item.openwindow(me.__activeItemID,'','',me.__activeType, null, [
							function(frm){
								if (frm.maintab['tab1']) {
									frm.maintab.tab1.EVNNOTE._focus();
									frm.maintab.tab1.x_folders && frm.maintab.tab1.x_folders._main.parentNode.removeChild(frm.maintab.tab1.x_folders._main);
									frm.maintab.tab1._getAnchor('name').setAttribute('readonly', true);
									frm.maintab.tab1._getAnchor('tags_row').parentNode.removeChild(frm.maintab.tab1._getAnchor('tags_row'));
								}
							}
						]);
					}
					return false;
				}
				else
				if (hascss(elm,'itmtags')){
					if (Is.Array(me.__activeItemID))
						Item.edit_tags([me.__activeItemID[0],me.__activeItemID[1],[me.__activeItemID[2]]]);
					return false;
				}
				else
				if (sPrimaryAccountWebDAV && hascss(elm,'att') && elm.rel && me.__activeItemID && elm.title && Item.officeSupport(elm.title)){
					Item.officeOpen({aid:me.__activeItemID[0],fid:me.__activeItemID[1],iid:me.__activeItemID[2],attid:elm.rel},[downloadItem,[elm.href,true]], Path.extension(elm.title));
					return false;
				}
			}
		}
	};

	if (sDataSet)
		this._listen(sDataSet,sDataPath);

	this._add_destructor('__destructor');
};

_me._onnotify = function(aData) {
	if (aData.ACTION === 'add'){
		if (aData.TYPE === 'gw-queue'){
			this.__reload_image(true);
		}
		else
		if (aData.TIME>0 && this.__activeItem.EVN_MODIFIED<aData.TIME){
			this.__refresh = true;
			dataSet.add(this._listener, (this._listenerPath || []).concat(this.__activeItemID,'EVN_MODIFIED'), aData.TIME);
		}
	}
};

_me.__destructor = function(){
	if (this.__reload_timer)
		clearTimeout(this.__reload_timer);
};

_me.__btnmenu = function(){
	var aMenu = [];

	switch(this.__activeType){
		case 'E':
		case 'J':
		case 'C':
		case 'T':
		case 'N':
			aMenu.push({title:'POPUP_ITEMS::OPEN', arg:[this,'__btnaction',['edit']]});
			break;
	}

	aMenu.push(
		{title:'-'},
		{title:'POPUP_ITEMS::ATTACH_TO_EMAIL', arg:[this,'__btnaction',['email']]},
		{title:'ITEM::PUBLIC', arg:[this,'__btnaction',['public']]},
		{title:'-'},
		{title:'MAIN_MENU::DELETE', arg:[this,'__btnaction',['delete']], css:'color2', disabled: !WMFolders.getAccess(this.__activeItemID,'remove')});

	return aMenu;
};


_me.__btnaction = function(type, arg){
	switch(type){
		case 'edit':
			Item.openwindow(this.__activeItemID,'','',this.__activeType);
			break;

		case 'delete':
			Item.remove([this.__activeItemID[0],this.__activeItemID[1],[this.__activeItemID[2]]]);
			break;

		case 'email':
			Item.sendAsEmail([this.__activeItemID[0], this.__activeItemID[1], [this.__activeItemID[2]]]);
			break;

		case 'public':
			if (this._aValues.TICKET)
				Item.collaborate([this.__activeItemID[0], this.__activeItemID[1], [this.__activeItemID[2]]]);

			break;
	}
};

_me._refreshing = function(b){
	if (Is.Defined(b)){
		if (b){

			if (this._aRefresh != null)
				this._fill(this._aRefresh, this.__activeType);
			else
				this.__refresh = true;
		}
		else
			this.__refresh = false;
	}
	else
		return this.__refresh;
};

// Lock/UnLock call blank update so __refresh == false doesnt work
_me.__update = function(){
	var aData = dataSet.get(this._listener,this._listenerPath);

	for (var aid in aData)
		for (var fid in aData[aid]){
			var lastId = dataSet.get('active_items',[aid,fid]);
			if (lastId && aData[aid][fid][lastId]){
		        var aItem = aData[aid][fid][lastId],
		        	sFolderType = WMFolders.getType([aid,fid]);
		        if (aItem && sFolderType){

					if (this.__refresh || !this.__activeItemID || this.__activeItemID[0] != aItem.aid || this.__activeItemID[1] != aItem.fid || this.__activeItemID[2] != WMItems.__clientID(aItem.ITM_ID || aItem.EVN_ID)){
						this._fill(sFolderType,aItem);
					}
					else{
						this._aRefresh = aItem;
					}

		        	return;
		        }
			}
		}

	this._fill();
};

_me._fill = function(sFolderType,aItem){
	var me = this;

	if (this.__reload_timer)
		clearTimeout(this.__reload_timer);

	this._clean();
	this._getAnchor('body').innerHTML = '';

	this._aValues = aItem;

	//clean
	this.__reloadme = false;
	this.__refresh = true;
	this._aRefresh = null;

	if (!Is.Defined(sFolderType)){
        this.__activeItemID = null;
        this.__activeItem = null;

		if (this.X_btn)
			this.X_btn._disabled(true);

		this._getAnchor('body').innerHTML = '<h5>'+getLang('ITEMVIEW::NOITEM')+'</h5>';

		return;
	}

	if (sFolderType == 'G' || sFolderType == 'C')
		sFolderType = aItem.ITMCLASS || aItem.EVNCLASS;

	this.__activeItem = aItem;
	this.__activeItemID = [aItem.aid,aItem.fid,WMItems.__clientID(aItem.ITM_ID || aItem.EVN_ID)];
	this.__activeType = sFolderType;

	var aOut = {};

	//Action Button
	if (sFolderType != 'F'){
		this._create('X_btn','obj_button','scroll','simple color1 select btn_open');
		this.X_btn._disabled(true);
		this.X_btn._value('POPUP_ITEMS::OPEN_ITEM');
		this.X_btn._onclick = function(e){
			if (!this.__cmenu || this.__cmenu._destructed){

				if (Is.Array(me.__activeItemID)){

					var pos = getSize(this.__eIN),
						aMenu = me.__btnmenu();

					this.__cmenu = gui._create('cmenu','obj_context');
					this.__cmenu._fill(aMenu);
					this.__cmenu._place(pos.x+pos.w/2,pos.y+pos.h,'',1);

					if (e.stopPropagation) e.stopPropagation();
					e.cancelBubble = true;
					return false;
				}
			}
		};
	}

	switch(sFolderType){
	case 'N':
		var d = IcewarpDate.unix(aItem.EVN_CREATED);

		aOut = {title:aItem.EVNTITLE || getLang("EVENT_VIEW::NOTITLE"), date:d.format('L LT')};

		try{
				aOut.note = aItem.NOTES[0] ? aItem.NOTES[0].values.NOTE_TEXT : '';
				if(aItem.EVNDESCFORMAT === 'text/html') {
					aOut.note = DOMPurify.sanitize(aOut.note);
				} else {
					aOut.note = (aOut.note || '').escapeHTML();
				}
		}
		catch(r){
			aOut.note = '';
		}

		break;

	case 'L':
	case 'C':

		/* Collect data for display in itemview_c */

		// General information
		aOut.fullname = (aItem.ITMCLASSIFYAS || '').escapeHTML();
		aOut.birthday = parseInt(aItem.ITMBDATE,10) ? IcewarpDate.julian(aItem.ITMBDATE).format('L') : '';
		if(aItem.ITMDESCFORMAT === 'text/html') {
			aOut.note = DOMPurify.sanitize(aItem.ITMDESCRIPTION);
		} else {
			aOut.note = aItem.ITMDESCRIPTION;
		}

		// Company information
		aOut.company = (aItem.ITMCOMPANY || '').escapeHTML();
		aOut.department = (aItem.ITMDEPARTMENT || '').escapeHTML();
		aOut.jobtitle = (aItem.ITMJOBTITLE || '').escapeHTML();
		aOut.profession = (aItem.ITMPROFESSION || '').escapeHTML();
		aOut.location = (aItem.ITMOFFICELOCATION || '').escapeHTML();
		aOut.assistant = (aItem.ITMASSISTANTNAME || '').escapeHTML();
		aOut.manager = (aItem.ITMMANAGERNAME || '').escapeHTML();

		// Phone, address and email
		var mapping = {H: 'home_', B: 'business_', O: 'other_'};

		aOut.phones = [];
		aOut.emails = [];
		aOut.im = [];

		if (aItem.LOCATIONS){
			var loc, aMap;
			for (var l in aItem.LOCATIONS){
				loc = aItem.LOCATIONS[l].values;

				// Compile addresses
				aOut[mapping[loc.LCTTYPE]+'street'] = (loc.LCTSTREET || '').escapeHTML();
				aOut[mapping[loc.LCTTYPE]+'city'] = (loc.LCTCITY || '').escapeHTML();
				aOut[mapping[loc.LCTTYPE]+'zip'] = (loc.LCTZIP || '').escapeHTML();
				aOut[mapping[loc.LCTTYPE]+'state'] = (loc.LCTSTATE || '').escapeHTML();
				aOut[mapping[loc.LCTTYPE]+'country'] = (loc.LCTCOUNTRY || '').escapeHTML();

				if (loc.LCTSTREET){
					aMap = [loc.LCTSTREET];

					if (loc.LCTZIP || loc.LCTCITY)
						aMap.push((loc.LCTZIP || '') +' '+ (loc.LCTCITY || '').trim());
					if (loc.LCTSTATE)
						aMap.push(loc.LCTSTATE);
					if (loc.LCTCOUNTRY)
						aMap.push(loc.LCTCOUNTRY);

					aOut[mapping[loc.LCTTYPE]+'map'] = aMap.join(', ').escapeHTML();
				}

				// Compile phone and emails
				if (aItem.ITMCLASS == 'L'){
					if (loc.LCTEMAIL1)
						aOut.emails.push((loc.LCTEMAIL1 || '').escapeHTML());
				}
				else
				if (loc.LCTTYPE == 'H'){
					if (loc.LCTEMAIL1) aOut.emails.push((loc.LCTEMAIL1 || '').escapeHTML());
					if (loc.LCTEMAIL2) aOut.emails.push((loc.LCTEMAIL2 || '').escapeHTML());
					if (loc.LCTEMAIL3) aOut.emails.push((loc.LCTEMAIL3 || '').escapeHTML());

					if (loc.LCTIM) aOut.im.push((loc.LCTIM || '').escapeHTML());
					if (loc.LCTIM2) aOut.im.push((loc.LCTIM2 || '').escapeHTML());
					if (loc.LCTIM3) aOut.im.push((loc.LCTIM3 || '').escapeHTML());

					for(var i in loc)
						if (i.indexOf('LCTPHN') === 0 && loc[i])
							aOut.phones.push({title:getLang('PHONE::'+i),number:(loc[i] || '').escapeHTML(),type:i});
				}
			}
		}

		if(sFolderType === 'C') {
			aOut.contactid = aItem.ITM_ID;
		}
		if (!aOut.emails.length) {
			delete aOut.emails;
			aOut.avatar = aOut.avatar || aOut.fullname;
		} else if(sFolderType === 'L') {
			aOut.avatar = '[' + aItem.fid + '::' + (aItem.ITMCLASSIFYAS || aItem.ITMTITLE) + ']';
		} else {
			aOut.avatar = MailAddress.createEmail((aOut.fullname || '').escapeHTML(),aOut.emails[0]);
		}

		if (!aOut.phones.length)
			delete aOut.phones;

		if (aItem.ATTACHMENTS)
			for(var i in aItem.ATTACHMENTS)
				if (aItem.ATTACHMENTS[i].values && aItem.ATTACHMENTS[i].values.ATTTYPE == 'P' && aItem.ATTACHMENTS[i].values.TICKET){
					aOut.img = aItem.ATTACHMENTS[i].values.TICKET;
					break;
				}

		sFolderType = 'C';

		break;

	case 'J':
		if (aItem.EVNLOCATION){
			// Split out company name and journal type
			var tmp = aItem.EVNLOCATION.split('|');
			aOut.type = tmp[0];
			aOut.company = tmp[1];
			// Translate journal type
			var tmp = {
				'Conversation': "JOURNAL::CONVERSATION",
				'Document': "JOURNAL::DOCUMENT",
				'E-mail Message': "JOURNAL::E-MAIL_MESSAGE",
				'Fax': "JOURNAL::FAX",
				'Letter': "JOURNAL::LETTER",
				'Conference': "JOURNAL::CONFERENCE",
				'Conference Cancellation': "JOURNAL::CONFERENCE_CANCELLATION",
				'Conference Request': "JOURNAL::CONFERENCE_REQUEST",
				'Conference Response': "JOURNAL::CONFERENCE_RESPONSE",
				'Microsoft Office Access': "JOURNAL::MICROSOFT_OFFICE_ACCESS",
				'Microsoft Office Excel': "JOURNAL::MICROSOFT_OFFICE_EXCEL",
				'Microsoft PowerPoint': "JOURNAL::MICROSOFT_POWERPOINT",
				'Microsoft Visio': "JOURNAL::MICROSOFT_VISIO",
				'Microsoft Word': "JOURNAL::MICROSOFT_WORD",
				'Note': "JOURNAL::NOTE",
				'Phone Call': "JOURNAL::PHONE_CALL",
				'Remote Session': "JOURNAL::REMOTE_SESSION",
				'Task': "JOURNAL::TASK",
				'Task Request': "JOURNAL::TASK_REQUEST",
				'Task Response': "JOURNAL::TASK_RESPONSE"
			}[aOut.type];
			if(tmp)
				aOut.type = getLang(tmp);
		}
	case 'E':
		aOut.title = aItem.EVNTITLE || getLang('EVENT_VIEW::NOTITLE');
		aOut.location = aItem.EVNLOCATION;
		if(aItem.EVNDESCFORMAT === 'text/html') {
			aOut.note = DOMPurify.sanitize(aItem.EVNNOTE);
		} else {
			aOut.note = (aItem.EVNNOTE || '').escapeHTML();
		}

		aOut.rcr = aItem.EVNRCR_ID?true:false;

		if (aItem.REMINDERS && count(aItem.REMINDERS))
			aOut.rmn = true;

			if (aItem.EVNSTARTTIME < 0) {
				aOut.t1 = IcewarpDate.julian(aItem.EVNSTARTDATE).format("L");
				aOut.t2 = IcewarpDate.julian(aItem.EVNENDDATE - 1).format("L");
			} else {
				aOut.t1 = IcewarpDate.julian(aItem.EVNSTARTDATE, aItem.EVNSTARTTIME).format('L LT');
				aOut.t2 = IcewarpDate.julian(aItem.EVNENDDATE, aItem.EVNENDTIME).format((aItem.EVNSTARTDATE == aItem.EVNENDDATE ? 'L' : "") + ' LT');
			}
		if (aOut.t1 == aOut.t2)
			delete aOut.t2;

		break;

	case 'T':
        aOut.title = aItem.EVNTITLE || getLang('EVENT_VIEW::NOTITLE');
		if(aItem.EVNDESCFORMAT === 'text/html') {
			aOut.note = DOMPurify.sanitize(aItem.EVNNOTE);
		} else {
			aOut.note = (aItem.EVNNOTE || '').escapeHTML();
		}

        aOut.rcr = aItem.EVNRCR_ID?true:false;

        if (aItem.REMINDERS && count(aItem.REMINDERS))
        	aOut.rmn = true;

		if (aItem.EVNENDDATE>0) aOut.t1 = IcewarpDate.julian(aItem.EVNENDDATE,0).format("L");
		if (aItem.EVNSTARTDATE>0) aOut.t2 = IcewarpDate.julian(aItem.EVNSTARTDATE,0).format("L");

		if (aItem.EVNSTATUS){
			aOut.status = getLang('TASK::' + {
				B:'NOT_STARTED',
				I:'IN_PROGRESS',
				M:'COMPLETED',
				Q:'DEFERRED',
				N:'WAITING'
				}[aItem.EVNSTATUS]);

			if (aItem.EVNSTATUS!='B' && aItem.EVNSTATUS!='M' && Is.Number(parseInt(aItem.EVNCOMPLETE)))
				aOut.complete = aItem.EVNCOMPLETE + '%';
		}

	    break;

	case 'F':

		aOut.title = aItem.EVNTITLE || getLang('EVENT_VIEW::NOTITLE');
	    aOut.size = parseFileSize(aItem.EVNCOMPLETE || 0);
		if(aItem.EVNDESCFORMAT === 'text/html') {
			aOut.note = DOMPurify.sanitize(aItem.EVNNOTE);
		} else {
			aOut.note = (aItem.EVNNOTE || '').escapeHTML();
		}

		aOut.date = IcewarpDate.unix(aItem.EVN_MODIFIED).format(IcewarpDate.SHORT_L);
		aOut.full_date = IcewarpDate.unix(aItem.EVN_MODIFIED).format('L LT');
		aOut.security = getLang(aItem.EVNSHARETYPE == 'P'?'SHARING::PRIVATE':'SHARING::PUBLIC');
		aOut.extension = Path.extension(aItem.EVNTITLE);

		if(aItem.EVN_METADATA) {
			var metadata = parseURL(aItem.EVN_METADATA);
			if(metadata) {
				aOut.created_by = metadata.core_own_name;
				aOut.modified_by = metadata.core_modifiedown_name;
			}
		}

		var aRights = WMFolders.getRights({aid:this.__activeItemID[0],fid:this.__activeItemID[1]}),
			aAccess = WMFolders.getAccess({aid:this.__activeItemID[0],fid:this.__activeItemID[1]});

		if (aItem.EVNLOCKOWN_ID){
			if (aItem.EVNLOCKOWN_ID == sPrimaryAccountGWID){
				aOut.lock_info = getLang('FILE::LOCKED_BY_ME');
				aOut.lock_type = aAccess.modify?' locked':' locked2';
			}
			else{
				aOut.lock_info = aItem.EVNLOCKOWN_EMAIL?getLang('FILE::LOCKED_BY',[aItem.EVNLOCKOWN_EMAIL]):getLang('FILE::LOCKED');
				aOut.lock_type = aRights.owner && aAccess.modify?' locked':' locked2';
			}

			this.__reloadme	= true;
		}
		else
			aOut.lock_info = getLang('FILE::UNLOCKED');

		if (aItem.EVNLOCKAPPMASK & 0x10)
			aOut.conversion = true;

		if (aItem.REVISIONS)
			aOut.revisions = true;

		aOut.sharing = aItem.EVNOWN_ID === sPrimaryAccountGWID || aAccess.modify;
		aOut.shared = aItem.EVNDOCINVITE == 1;
		aOut.editing = !!aItem.EVNDOCEDITABLE;
		aOut.password_protected = !!aItem.EVNDOCPASS;
		aOut.has_rights = aRights.owner || aAccess.modify;

		break;

	default:
		return;
	}

	if (aItem.ATTACHMENTS){
		aOut.att = [];
		atmp = {};

		for(var i in aItem.ATTACHMENTS)
			if (aItem.ATTACHMENTS[i].values.TICKET){

				atmp = {
					id: aItem.ATTACHMENTS[i].values.ATTNAME || aItem.ATTACHMENTS[i].values.ATTDESC,
					link: aItem.ATTACHMENTS[i].values.TICKET,
					type: aItem.ATTACHMENTS[i].values.ATTTYPE,
					time: aItem.ATTACHMENTS[i].values.ATTTIME,
					mime: aItem.ATTACHMENTS[i].values.ATTPARAMS,
					queued: aItem.ATTACHMENTS[i].values.ATTQUEUED,
					size: parseFileSize(aItem.ATTACHMENTS[i].values.ATTSIZE),
					ico: (aItem.ATTACHMENTS[i].values.ATTDESC && aItem.ATTACHMENTS[i].values.ATTDESC.indexOf('.')>-1?Path.extension(aItem.ATTACHMENTS[i].values.ATTDESC):'') + (Item.officeSupport(aItem.ATTACHMENTS[i].values.ATTDESC) ? ' office_support' : (Path.extension(aItem.ATTACHMENTS[i].values.ATTDESC) == 'pdf' ? ' pdf_support' : '')),
					title: (aItem.ATTACHMENTS[i].values.ATTDESC || getLang('EVENT_VIEW::NOTITLE'))
				};

				if (atmp.type == 'thumbnail'){
					// continue;
					aOut.thumbnail = atmp;
				}
				else
				if (atmp.type == 'pdf')
					aOut.pdf = atmp;
				else{

					if (atmp.ico == 'mp3')
						atmp.play = 'server/download.php?' + buildURL({'sid':dataSet.get('main',['sid']), 'class':'attachment', 'fullpath': [aItem.aid,aItem.fid,(aItem.ITM_ID || aItem.EVN_ID),atmp.id].join('/')});

	            	aOut.att.push(atmp);
            	}
            }

		if (!aOut.att.length)
			delete aOut.att;
	}

	if (sFolderType == 'F'){

		if (aOut.att){

			var ratio = window.retina || window.devicePixelRatio || 1;

			//thumbnail
			if (aOut.thumbnail){

				aOut.preview_img = {
					title: aOut.thumbnail.title,
					small: 'server/download.php?' + buildURL({'sid':dataSet.get('main',['sid']), 'class':'attachment', 'fullpath': [aItem.aid,aItem.fid,(aItem.ITM_ID || aItem.EVN_ID),aOut.thumbnail.id].join('/'),'resize':1, 'width':1024, 'height':1024, 'crop':'50%', 'editcounter':aItem.EVN_EDITCOUNTER, 't':aOut.thumbnail.time}),
					url: 'server/download.php?' + buildURL({'sid':dataSet.get('main',['sid']), 'class':'attachment', 'fullpath': [aItem.aid,aItem.fid,(aItem.ITM_ID || aItem.EVN_ID),aOut.thumbnail.id].join('/'),'resize':1, 'width':screen.availWidth * ratio, 'height':screen.availHeight * ratio, 'editcounter':aItem.EVN_EDITCOUNTER})
				};

				if (aOut.pdf){
					aOut.preview_img.title = aOut.pdf.title;
					aOut.preview_img.pdf = 'server/download.php?' + buildURL({'sid':dataSet.get('main',['sid']), 'class':'attachment', 'fullpath': [aItem.aid,aItem.fid,(aItem.ITM_ID || aItem.EVN_ID), aOut.pdf.id].join('/')});
				}
			}

			//attachments
			for (var i = aOut.att.length-1;i>=0;i--){
				// By default use file extension for file type
				aOut.mime =  aOut.att[i].ico.toUpperCase();
				if (aOut.att[i].mime){
					// For common file types use mime type to determine
					var mime = aOut.att[i].mime.toLowerCase();
					// Note, ordering is important when determining!
					if (mime.indexOf('image')>-1)
						aOut.mime = getLang('ITEMVIEW::MIME_IMG');
					else
					if (mime.indexOf('audio')>-1)
						aOut.mime = getLang('ITEMVIEW::MIME_SOUND');
					else
					if (mime.indexOf('video')>-1)
						aOut.mime = getLang('ITEMVIEW::MIME_VIDEO');
					else
					if (mime.indexOf('template')>-1)
						aOut.mime = getLang('ITEMVIEW::MIME_TPL');
					else
					if (mime.indexOf('spreadsheet')>-1 || mime.indexOf('ms-excel')>-1)
						aOut.mime = getLang('ITEMVIEW::MIME_SS');
					else
					if (mime.indexOf('document')>-1 || mime.indexOf('msword')>-1)
						aOut.mime = getLang('ITEMVIEW::MIME_DOC');
					else
					if (mime.indexOf('compressed')>-1)
						aOut.mime = getLang('ITEMVIEW::MIME_ARCHIVE');
				}
				switch(aOut.mime) {
					case 'PDF': aOut.mime = getLang('ITEMVIEW::MIME_PDF'); break;
					case 'TXT': aOut.mime = getLang('ITEMVIEW::MIME_TXT'); break;
				}

				if (parseInt(aOut.att[i].queued)>0)
					aOut.conversion = true;

				switch(aOut.att[i].ico.split(' ')[0]){
					case 'jpg':
					case 'jpeg':
					case 'png':
					case 'gif':
						aOut.preview_img = {
							title: aOut.att[i].title,
							small: 'server/download.php?' + buildURL({'sid':dataSet.get('main',['sid']), 'class':'attachment', 'fullpath': [aItem.aid,aItem.fid,(aItem.ITM_ID || aItem.EVN_ID), aOut.att[i].id].join('/'),'resize':1, 'width':1024, 'height':1024, 'crop':'50%', 'editcounter':aItem.EVN_EDITCOUNTER}),
							url: 'server/download.php?' + buildURL({'sid':dataSet.get('main',['sid']), 'class':'attachment', 'fullpath': [aItem.aid,aItem.fid,(aItem.ITM_ID || aItem.EVN_ID), aOut.att[i].id].join('/'),'resize':1, 'width':screen.availWidth * ratio, 'height':screen.availHeight * ratio, 'editcounter':aItem.EVN_EDITCOUNTER})
						};
						aOut.itmview = true;
						break;

					case 'mp3':
						aOut.play = aOut.att[i].play;
						break;

					case 'pdf':
						if (aOut.preview_img && !aOut.preview_img.pdf){
							aOut.preview_img.title = aOut.att[i].title;
							aOut.preview_img.pdf = 'server/download.php?' + buildURL({'sid':dataSet.get('main',['sid']), 'class':'attachment', 'fullpath': [aItem.aid,aItem.fid,(aItem.ITM_ID || aItem.EVN_ID),aOut.att[i].id/*.toString().urlEncode()*/].join('/')});
							aOut.itmview = true;
							break;
						}

					default:
						if ((Item.officeSupport(aItem.EVNTITLE) && dataSet.get('accounts',[sPrimaryAccount,'OFFICE_SUPPORT'])=='true') || Item.editSupport(aItem.EVNTITLE)) {
							if (GWOthers.getItem('DOCUMENTS', 'office_app') == 'webdoc_read')
								aOut.itmview = true;
							else
								aOut.itmedit = true;
						}
				}
			}
		}



		if (aOut.revisions){
			aOut.rev_data = [];
			var i = 1;
			for (var id in aItem['REVISIONS'])
				aOut.rev_data.push({
					id:id,
					date: CalendarFormatting.normalWithTime(IcewarpDate.unix(aItem['REVISIONS'][id].values.REVTIMESTAMP)),
					name:aItem['REVISIONS'][id].values.REVEMAIL || (getLang('ITEMVIEW::VERSION') + ' ' + i++),
					title:aItem['REVISIONS'][id].values.REVCOMMENT,
					avatar: getAvatarURL(aItem['REVISIONS'][id].values.REVEMAIL)
				});
		}

	}


	if (aItem.EVNTYPE || aItem.ITMCATEGORY){
		aOut.tags = [];
		var arr = (aItem.EVNTYPE || aItem.ITMCATEGORY).split(','),
			aTags = dataSet.get('tags');

		for (var i in arr)
			if ((arr[i] = arr[i].trim()))
				aOut.tags.push({tagcolor:aTags[arr[i]]?aTags[arr[i]].TAGCOLOR:'',textcolor:aTags[arr[i]]?aTags[arr[i]].TEXTCOLOR:'#000000',tagname:arr[i]});
	}


	//Prepare Note
	if (aOut.note)
		aOut.note = mkElement('div',{innerHTML:aOut.note}).innerHTML;


	this._draw('obj_itemview_'+sFolderType.toLowerCase(), 'body', aOut);

	this.avatar && sFolderType === 'C' && this.avatar.__specifyIds([aItem.aid, aItem.fid]);

	[].forEach.call(this._getAnchor('body').querySelectorAll('.office_support, .pdf_support'), function(file) {
		if (file.href)
			file.addEventListener('click', function(e) {
				me.__cmenu = gui._create('cmenu','obj_context');
				me.__cmenu._fill([
					{config:{css:'small'}},
					{title:'POPUP_ITEMS::OPEN', css:'ico', arg:[function() {
						if (hascss(file, 'pdf_support')) {
							if(GWOthers.getItem('LAYOUT_SETTINGS','disable_pdf') == 1 || currentBrowser().match(/^MSIE([6-9]|10)$/)) {
								downloadItem(file.href);
							} else {
								gui._create('pdf','frm_pdf')._load(file.href, file.rel);
							}
						} else
							Item.officeOpen({url: e.target.href}, [downloadItem, [e.target.href]], file.textContent.split('.').pop(), 'view');
					}]},
					{title:'ATTACHMENT::DOWNLOAD', css:'ico', arg:[function() {
						downloadItem(e.target.href, true);
					}]}
				]);
				me.__cmenu._place(e.clientX, e.clientY);
				e.preventDefault && e.preventDefault();
				e.stopPropagation && e.stopPropagation();
				e.stopImmediatePropagation && e.stopImmediatePropagation();
				return false;
			});
	});


	this._aOut = aOut;

	if (sFolderType == 'F'){

		if(this.share) {
			this.share._onclick = function() {
				Item.collaborate(me.__activeItemID, [function(new_id) {
					me.__activeItemID[2] = new_id ? WMItems.__clientID(new_id) : me.__activeItemID[2];
					WMItems.list({aid:me.__activeItemID[0], fid:me.__activeItemID[1], iid:me.__activeItemID[2]}, '', '', '', [function(result) {
						dataSet.add('items', me.__activeItemID, result[me.__activeItemID[0]][me.__activeItemID[1]][me.__activeItemID[2]]);
						dataSet.add('active_items', [me.__activeItemID[0], me.__activeItemID[1]], me.__activeItemID[2]);
						me._fill('F', dataSet.get('items', me.__activeItemID));
					}]);
				}]);
			};
			[].forEach.call(this._main.querySelectorAll('.sharing'), function(elm) {
				elm.addEventListener('click', me.share._onclick);
			});
		}

		if (this.__last_tab['F']){
			this.menu._value(this.__last_tab['F']);
		}

		//preview image
		if (aOut.preview_img && aOut.preview_img.small){
			this._getAnchor('previewimg').appendChild(mkElement('img',{
				src:aOut.preview_img.small,
				onload:function(){me.__imagew && me.__imagew(this, true)},
				onerror:function(){me.__imagew && me.__imagew(this, false)}
			}));
		}

		//reisize
		if (this._getAnchor('frame')){
			this._getAnchor('frame').contentWindow.onresize = function(){
				var ec = me._getAnchor('container');

				if (me._getAnchor('body').offsetWidth < 555){
					if (!hascss(ec,'small'))
						addcss(ec,'small');
				}
				else
					removecss(ec,'small');
			};

			this._getAnchor('frame').contentWindow.onresize();
			addcss (this._getAnchor('container'),'visible');
		}

		//Details
		this.menu.detail._onactive = function(){
			me.__last_tab['F'] = this._name;
		};

		//Revisions
		this.menu.revision._onactive = function(){
			me.__last_tab['F'] = this._name;
		};

		var aRights = WMFolders.getRights({aid:this.__activeItemID[0],fid:this.__activeItemID[1]}),
			aAccess = WMFolders.getAccess({aid:this.__activeItemID[0],fid:this.__activeItemID[1]});

		if(!aAccess.modify) {
			this.menu.revision._getAnchor('revlist').querySelector('.new').classList.add('hidden');
			var revisions = this.menu.revision._getAnchor('main').querySelector('a.revisions');
			revisions && revisions.classList.add('hidden');
		}
		this.menu.revision._getAnchor('revlist').onclick = function(e){
			var e = e || window.event,
				elm = e.target || e.srcElement;

			if (elm.tagName == 'A' || (elm = Is.Child(elm, 'A', this))){

				for (var attid in aItem['ATTACHMENTS'])
					break;

				var id = elm.getAttribute('rel');
				if (attid){
					if (id)
						downloadItem(buildURL({'sid': dataSet.get('main', ['sid']), 'class': 'revision', 'fullpath': me.__activeItemID[0]+'/'+me.__activeItemID[1]+'/'+WMItems.__serverID(me.__activeItemID[2])+'|'+id+'/'+attid}));
					else if(aAccess.modify)
						gui._create('revision', 'frm_revision','','',{aid:me.__activeItemID[0], fid:me.__activeItemID[1], iid:me.__activeItemID[2]});
				}
			}
		};

		this._getAnchor('previewimg').onclick = function(e){
			// Open as Document
			if (Item.editSupport(me.__activeItem.EVNTITLE)){
				Item.editFile(me.__activeItemID);
			}
			else
			if (Item.officeSupport(me.__activeItem.EVNTITLE) && (aOut.itmedit || aOut.itmview)){
				Item.officeOpen({aid: me.__activeItemID[0], fid: me.__activeItemID[1], iid: me.__activeItemID[2]},[Item.downloadFile, [me.__activeItemID]],Path.extension(me.__activeItem.EVNTITLE));
			}
			else
			if (aOut.preview_img){
				//Open as PDF
				if (aOut.preview_img.pdf){
					if (GWOthers.getItem('LAYOUT_SETTINGS','disable_pdf') == 1 || currentBrowser().match(/^MSIE([6-9]|10)$/)){
						Item.downloadFile(me.__activeItemID);
					}
					else{
						Item.openPDF(me.__activeItemID);
					}
				}
				else
				//Open as IMG
				if (aOut.preview_img.url){
					var img = gui._create('imgview','frm_imgview');
						img._fill([me._aOut.preview_img]);
						img._value(0);
				}
			}
			// does not goes together with mp3
			else{
				var e = e || window.event,
					elm = e.target || e.srcElement,
					info = me._getAnchor('info');

				if (elm == info || Is.Child(elm, info)){
				 	if (!aOut.play)
				 		Item.downloadFile(me.__activeItemID);
				}
			}
		};
	}

	//Parse Note Links
	if (aOut.note){
		var elm = this._getAnchor('note');
		if (elm){
			for (var a = elm.getElementsByTagName('a'), i = a.length-1;i>=0;i--)
				if ((href = a[i].getAttribute('href')) && href.indexOf('#')!=0)
					if (href.toLowerCase().indexOf('mailto:')==0){
						a[i].onclick = function(){
							var out = {to:this.href.substr(7)};
							if (out.to && out.to.indexOf('?')>-1){
								out.subject = parseURL(out.to).subject;
								out.to = out.to.substring(0,out.to.indexOf('?'));
							}
							NewMessage.compose(out);
							return false;
						};
					}
					else
						a[i].setAttribute('target','_blank');
		}
	}


	//activate SMS in obj_label_phone
	if (aOut.phones)
		for (var i = aOut.phones.length-1;i>=0;i--)
			if (aOut.phones[i].type == 'LCTPHNMOBILE')
				this[i>0?'X_p_'+(i-1):'X_p']._sms(true);

	if (aOut.complete){
		this.X_PROGRESS._range(100);
		this.X_PROGRESS._value(aItem.EVNCOMPLETE);
	}

	if (this.X_btn)
		this.X_btn._disabled(false);
};

_me.__imagew = function(img, bOK){
	if (bOK){
		if (img.naturalHeight){
			img.parentNode.style.maxWidth = img.naturalWidth + 'px';
			img.parentNode.style.maxHeight = img.naturalHeight + 'px';
		}

		img.style.visibility = 'visible';
	}
	else
		addcss(this._getAnchor('imgpreview'), 'max');
};

_me.__reload_image = function(bForce){

	var aItem = {aid:this.__activeItemID[0],fid:this.__activeItemID[1],iid:WMItems.__serverID(this.__activeItemID[2]), values:['EVN_ID','EVN_EDITCOUNTER','ATTACHMENTS']};

	WMItems.list(aItem, '', '', '', [function(aResult){

		if (!this._destructed && Is.Object(aResult) && (aResult = aResult[this.__activeItemID[0]]) && (aResult = aResult[this.__activeItemID[1]]) && (aResult = aResult[this.__activeItemID[2]])){

			var val, stype;

			switch(Path.extension(this._aOut.title)){
				case 'jpg':
				case 'jpeg':
				case 'png':
				case 'gif':
					stype = 'attachment';
					break;
				default:
					stype = 'thumbnail';
			}

			var ratio = window.retina || window.devicePixelRatio || 1;

			for (var aid in aResult['ATTACHMENTS']){

				//Activate Print as PDF
				if ((val = aResult['ATTACHMENTS'][aid].values) && val.ATTTYPE == 'pdf'){
					if (!this._aOut.preview_img)
						this._aOut.preview_img = {};

					this._aOut.preview_img.pdf = 'server/download.php?' + buildURL({'sid':dataSet.get('main',['sid']), 'class':'attachment', 'fullpath': [aItem.aid,aItem.fid,aResult.EVN_ID, encodeURIComponent(aid)].join('/')});
					this.menu && this.menu.action && this.menu.action.print && this.menu.action.print._disabled(false);
				}
				else
				//Refresh preview
				if ((this._aOut.conversion || bForce) && (val = aResult['ATTACHMENTS'][aid].values) && val.ATTTYPE == stype){

					if (!val.ATTQUEUED || val.ATTQUEUED == 0){

						if (!this._aOut.preview_img)
							this._aOut.preview_img = {};

						if (!this._aOut.preview_img.title)
							this._aOut.preview_img.title = val.ATTNAME || val.ATTDESC;

						this._aOut.preview_img.small = 'server/download.php?' + buildURL({'sid':dataSet.get('main',['sid']), 'class':'attachment', 'fullpath': [aItem.aid,aItem.fid,aResult.EVN_ID, encodeURIComponent(aid)].join('/'),'resize':1, 'width':1024, 'height':1024, 'crop':'50%', 'editcounter':aResult.EVN_EDITCOUNTER, 't':val.ATTTIME});
						this._aOut.preview_img.url = 'server/download.php?' + buildURL({'sid':dataSet.get('main',['sid']), 'class':'attachment', 'fullpath': [aItem.aid,aItem.fid,aResult.EVN_ID, encodeURIComponent(aid)].join('/'),'resize':1, 'width':screen.width * ratio, 'height':screen.height * ratio, 'editcounter':aResult.EVN_EDITCOUNTER});
						this._aOut.conversion = false;

						//nastavit src
						try{
							var eImg = this._getAnchor('previewimg').querySelector('img');
							if (eImg){
								eImg.src = this._aOut.preview_img.small;
							}
							else{
								var me = this;
								this._getAnchor('previewimg').appendChild(mkElement('img',{
									src: this._aOut.preview_img.small,
									onload: function(){me.__imagew && me.__imagew(this, true)},
									onerror: function(){me.__imagew && me.__imagew(this, false)}
								}));
							}
							removecss(this._getAnchor('imgpreview'),'max');
							this._getAnchor('convert').style.display = 'none';
						}
						catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r);}
					}
				}
			}
		}

		//timer
		if (this._aOut.conversion){
			if (this.__reload_timer)
				clearTimeout(this.__reload_timer);

			this.__reload_timer = setTimeout(function(){
				if (!this._destructed)
					this.__reload_image();
			}.bind(this), 5000);
		}

	}.bind(this)]);

};
