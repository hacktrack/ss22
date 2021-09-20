/**
 * Class for querying and manipulating with emails already stored in mail folders.
 *
 * WARNING! Because of the instance is listening on dataset when you finish work and the instance
 * is no more needet you have to call this.dispose() function in order not to leak.
 *
 * @param	id			[aid, fid, iid]
 * @param	mailInfo	Optional. If you specify extended attributes no server query is proceeded.
 *
 * @see	OldMessage.send()
 * @see	OldMessage.forward()
 * @see OldMessage.reply()
 *
 * @see	OldMessage.getColor()
 * @see OldMessage.setColor()
 *
 * @see	this.dispose()
 */
function OldMessage(id, mailInfo) {
	this.__id = id;
	this.__datasetItems = {};

	// Listen on the dataset.
	// When the dataset is changed, function this.__update() is called.
	// Function this.__update() assures that OldMessage is always synchronized with dataset 'items'.
	// If in the dataset there is a message with 'id', private field this.__datasetItems is set pointing
	// to that. Otherwise the this.__datasetItems is left undefined.
	// @see	this.__update()
	dataSet.obey(this, null, 'items');

	// mailInfo is optional parameter. User can specify extended attributes of the message
	// when creating instance of class OldMessage which saves query to the server.
	// TODO	Consider asynchronous communication

	if (mailInfo){
		this.__mailInfo = mailInfo;
	}
	else {
		this.__mailInfo = WMItems.list(
			{"aid": this.__id[0], "fid": this.__id[1], "iid": this.__id[2], "values": OldMessage.__FULLMAIL_VALUES_DANGER}
		)[this.__id[0]][this.__id[1]][this.__id[2]];
		delete this.__mailInfo['/'];
	}

	for (var k in this.__mailInfo)
		this.__datasetItems[k] = this.__mailInfo[k];
};

OldMessage.__FULLMAIL_VALUES = [
	'TO', 'FROM', 'SENDER', 'CLEAN_HTML', 'CC', 'BCC', 'SMS', 'REPLY_TO', 'ATTACHMENTS', 'FLAGS', 'HAS_ATTACHMENT', 'HAS_EMBEDDED_ATTACHMENT', 'PRIORITY', 'TAGS',
	'STATIC_FLAGS', 'SUBJECT', 'SMIME_STATUS', 'CONFIRM_ADDR', 'DATE', 'SIZE','CERTIFICATE','MESSAGE_ID','REFERENCES','IN_REPLY_TO','COLOR',
	'DEFERRED_DELIVERY'
];
OldMessage.__FULLMAIL_VALUES_DANGER = [
	'TO', 'FROM', 'SENDER', 'HTML', 'CC', 'BCC', 'SMS', 'REPLY_TO', 'ATTACHMENTS', 'FLAGS', 'HAS_ATTACHMENT', 'HAS_EMBEDDED_ATTACHMENT', 'PRIORITY', 'TAGS',
	'STATIC_FLAGS', 'SUBJECT', 'SMIME_STATUS', 'CONFIRM_ADDR', 'DATE', 'SIZE','CERTIFICATE','MESSAGE_ID','REFERENCES','IN_REPLY_TO',
	'REPLY_FULLPATH','FORWARD_FULLPATH','COLOR', 'KEEP_SEEN', 'DEFERRED_DELIVERY'
];
OldMessage.__TEXTMAIL_VALUES = [
	'TO', 'FROM', 'SENDER', 'TEXT', 'CC', 'BCC', 'SMS', 'REPLY_TO', 'ATTACHMENTS', 'FLAGS', 'HAS_ATTACHMENT', 'HAS_EMBEDDED_ATTACHMENT', 'PRIORITY', 'TAGS',
	'STATIC_FLAGS', 'SUBJECT', 'SMIME_STATUS', 'CONFIRM_ADDR', 'DATE', 'SIZE','CERTIFICATE','MESSAGE_ID','REFERENCES','IN_REPLY_TO','COLOR',
	'DEFERRED_DELIVERY'
];

OldMessage.source = function (id){
	WMItems.list({"aid": id[0], "fid": id[1], "iid": id[2], "values": ['SUBJECT','SOURCE']},'', '', '',[function(aData){
		if (aData && (aData = aData[id[0]]) && (aData = aData[id[1]]) && (aData = aData[id[2]])){
			var frm = gui._create('source','obj_popup','','frm_source');
				frm._title(aData.SUBJECT || getLang('POPUP_ITEMS::SOURCE'), true);
				frm._defaultSize(-1,-1,900,620);
				frm._ondock = function(){return {title: this._title(), css:'ico_frm_source'}};

				frm._create('text','obj_text','main','obj_text100 noborder');
				frm.text._value(aData.SOURCE || '');
		}
	}]);
};

/**
 * aValues	- additional values, will be merged to newMessage
 *
 **/
OldMessage.edit = function(id, aValues, bIsHTML) {

	var cid,arr = gui._getChildObjects('main','frm_compose');
	for(var i in arr){
		if (arr[i].__message && (cid = arr[i].__message.__id || arr[i].__message.__id_chat) && cid[0]==id[0] && cid[1]==id[1] && cid[2]==(id[2].replace('|@@MAIN@@',''))){
			arr[i]._focus();
			return;
		}
	}

	try{
		var oldMessage = new OldMessage(id);
		var newMessage = new NewMessage(id);
	}
	catch(er){
		return;
	}

	newMessage.sTo = oldMessage.getTo();
    newMessage.sRcp = newMessage.sFrom = oldMessage.getFrom();
	newMessage.sCc = oldMessage.getCc();
	newMessage.sBcc = oldMessage.getBcc();
	newMessage.sTeamchat = oldMessage.getTeamchat();
	newMessage.sComment = oldMessage.getComment();
	newMessage.sSMS = oldMessage.getSms();
	newMessage.sSubject = oldMessage.getSubject();
	newMessage.setHtml(oldMessage.isHtml(true));
	if(bIsHTML !== void 0) {
		newMessage.setHtml(bIsHTML);
	}
	newMessage.sBody = oldMessage.getBody();
	newMessage.aAttachments = oldMessage.copyAttachments(id);

	newMessage.iPriority = oldMessage.getPriority();
	newMessage.sDeferred = oldMessage.getDelay();

	//inject aValues
	if (Is.Object(aValues))
		for(var k in aValues)
			newMessage[k] = aValues[k];

	oldMessage.dispose();

	if (WMFolders.getType([id[0],id[1]]) == 'M' && id[0]+'/'+id[1] != GWOthers.getItem('DEFAULT_FOLDERS', 'templates')){
		newMessage.onSentCallback.push([Item.remove, [makeIDSFromID(id), true, '', '', '']]);

		//Mark Answered/Forwarded FLAG to original message
		if (oldMessage.__mailInfo.REPLY_FULLPATH){
			var tmp_id = oldMessage.__mailInfo.REPLY_FULLPATH.split('/');
				tmp_id[2] = [tmp_id[2]];

			newMessage.onSentCallback.push([OldMessage.markAsAnswered, [tmp_id]]);
		}

		if (oldMessage.__mailInfo.FORWARD_FULLPATH){
			var tmp_id = oldMessage.__mailInfo.FORWARD_FULLPATH.split('/');
				tmp_id[2] = [tmp_id[2]];

			newMessage.onSentCallback.push([OldMessage.markAsForwarded, [oldMessage.__mailInfo.FORWARD_FULLPATH.split('/')]]);
		}
	}

	gui._create('frm_compose', 'frm_compose', '', '', newMessage);

	return newMessage;
};

OldMessage.forward = function(id, bForwardAsMessage, bForwardResend, bIsHTML) {
	try{
		var newMessage = new NewMessage(),
			oldMessage = [];

		if (Is.Array(id[2])){
			for(var i in id[2])
				oldMessage.push(new OldMessage([id[0],id[1],id[2][i]]));
		}
		else{
			oldMessage.push(new OldMessage(id));

			//FORWARD X-HEADER
			if (WMFolders.getType(id[0],id[1]) =='M')
				newMessage.oHeaders['X-Forward-Fullpath'] = id[0] +'/'+ id[1] +'/'+ WMItems.__serverID(id[2]);
		}
	}
	catch(er){
		return;
	}

	if (!Is.Defined(bForwardAsMessage)) {

		storage.library('gw_others');
		bForwardAsMessage = (GWOthers.getItem('MAIL_SETTINGS_GENERAL', 'forward_messages') != 'inline');

		//RFC 2822
		if (oldMessage[0].__mailInfo.REFERENCES)
			newMessage.sReferences = oldMessage[0].__mailInfo.REFERENCES.trim();
		else
		if (oldMessage[0].__mailInfo.IN_REPLY_TO)
			newMessage.sReferences = oldMessage[0].__mailInfo.IN_REPLY_TO.split("\n").shift().trim() || '';

		if (oldMessage[0].__mailInfo.MESSAGE_ID){
			newMessage.sIn_Reply_To = oldMessage[0].__mailInfo.MESSAGE_ID.trim();
			newMessage.sReferences = (newMessage.sReferences?newMessage.sReferences+"\r\n\t":'') + newMessage.sIn_Reply_To;
		}
	}

	if (bForwardResend) {
		newMessage.sSubject = oldMessage[0].getSubject();
		newMessage.sTo = oldMessage[0].getTo();
	} else {
		newMessage.sSubject = OldMessage.__prefixParser(oldMessage[0].getSubject(), 'Fw');
	}

	if (bForwardAsMessage) {
		newMessage.aAttachments = {'attachments': []};
		for(var i in oldMessage)
			newMessage.aAttachments.attachments.push({'values': {'class': 'message', 'fullpath': id[0]+'/'+id[1]+'/'+WMItems.__serverID(oldMessage[i].__id[2]), 'name':'message_'+i+'.eml', 'size': oldMessage[i].getSize()}});
	}
	else {
		if (bForwardResend)
			newMessage.sBody = oldMessage[0].getBody();
		else
			newMessage.sBody = oldMessage[0].quoteMessage(getLang('EMAIL::FORWARD_MESSAGE_HTML'));
		newMessage.aAttachments = oldMessage[0].copyAttachments(id);
		newMessage.setHtml(oldMessage[0].isHtml(true));
	}

	if(bIsHTML !== void 0) {
		newMessage.setHtml(bIsHTML);
	}

	if (!bForwardResend)
		newMessage.addSignature();

	//if not embanded email
	var tmp_id = [oldMessage[0].__id[0],oldMessage[0].__id[1],[]];
	for (var i in oldMessage){
		if (oldMessage[i].__id[2].indexOf('|')<0)
			tmp_id[2].push(oldMessage[i].__id[2]);

		newMessage.onDisposeCallback.push([oldMessage[i], oldMessage[i].dispose]);
	}

	if (tmp_id[2].length)
		newMessage.onSentCallback.push([OldMessage.markAsForwarded, [tmp_id]]);

	gui._create('frm_compose', 'frm_compose', '', '', newMessage, oldMessage[0]);
};

OldMessage.prototype.quoteMessage = function(sLabel, bReply) {

	var sBody = '';
	if (this.isHtml()){

		//Base tag (it should be moved into .getBase())
		var sBase = this.getBase();
		if (sBase){
		    var sBase2 = document.location.protocol +'//'+ document.location.hostname+'/',
				div = mkElement('div');
		        div.innerHTML = this.getBody();

			//links
			var elms = div.getElementsByTagName('a');
		    for(var i = elms.length-1; i>=0; i--)
				if (elms[i].href && elms[i].href.toLowerCase().indexOf(sBase2) === 0)
					elms[i].href = sBase + elms[i].href.substr(sBase2.length);

			//images
			var elms = div.getElementsByTagName('img');
		    for(var i = elms.length-1; i>=0; i--)
				if (elms[i].src && elms[i].src.toLowerCase().indexOf(sBase2) === 0)
					elms[i].src = sBase + elms[i].src.substr(sBase2.length);

			sBody = div.innerHTML;
			div = null;
		}
		else
			sBody = this.getBody();
	}
	else
		sBody = this.getBody();

	var aTo = MailAddress.splitEmailsAndNames(this.getTo());

	return NewMessage.crlf + template.tmp('obj_mailview_quote',{
		html: this.isHtml(),
		label: sLabel || getLang('EMAIL::REPLY_MESSAGE_HTML'),
		from: OldMessage._parseRcp(this.getFrom()),
		to: OldMessage._parseRcp(this.getTo()),
		cc: OldMessage._parseRcp(this.getCc()),
		date: (new IcewarpDate(parseInt(this.getDate())*1000)).format('L LT'),
		subject: this.getSubject(),
		short: bReply && aTo.length === 1 && aTo[0].email === sPrimaryAccount?sPrimaryAccount:'',
		body: sBody
	});

};


OldMessage.replyTemplate = function(id, bReplyToAll){
	var f = Path.split(GWOthers.getItem('DEFAULT_FOLDERS','templates')),
		frm = gui._create('template','frm_insert_item','','',[
		function(aPath){
			if (aPath = aPath[0])
				OldMessage.reply(id, bReplyToAll, [aPath.aid,aPath.fid,aPath.id]);
		}],
		f[0],f[1],'M','',true);

		frm._title('COMPOSE::TEMPLATE');
};

OldMessage.reply = function(id, bReplyToAll, aTemplate, bSkipCreateComposeWindow, bIsHTML, bCopyAttachments) {

	var extractMail = function (sMails, sExtract, aExtract) {
		if (!sMails || !sExtract) return sMails;
		sExtract = sExtract.toLowerCase();

		var	addr = MailAddress.splitEmailsAndNames(sMails),
			out = [], bSkip = false;

		for (var i = 0, j = addr.length;i<j;i++)
		    if (sExtract == addr[i].email.toLowerCase())
		        bSkip = true;
			else
				out.push(MailAddress.createEmail(addr[i].name,addr[i].email));

		if (!bSkip && aExtract && aExtract.length>0){
            out  = [];
			for (var i = 0, j = addr.length;i<j;i++)
			    if (inArray(aExtract,addr[i].email.toLowerCase())<0)
					out.push(MailAddress.createEmail(addr[i].name,addr[i].email));
		}

		return out.join(', ');
	};

	try{
		var oldMessage = new OldMessage(id);
		var newMessage = new NewMessage();
		if (aTemplate)
			var oldTemplate = new OldMessage(aTemplate);
	}
	catch(er){
		return;
	}

	newMessage.sRcp = extractMail(oldMessage.getTo(), sPrimaryAccount);

	if (bReplyToAll) {
		var sTo = oldMessage.getReply(),
            sMy = MailAddress.splitEmailsAndNames(id[0])[0].email.toLowerCase(),
            aAlias = dataSet.get('storage',['ALIASES','ITEMS']),
			aEx = [];

		for(var i in aAlias)
			if (aAlias[i].VALUES.EMAIL.VALUE.toLowerCase() != sMy)
            	aEx.push(aAlias[i].VALUES.EMAIL.VALUE.toLowerCase());

		newMessage.sTo = extractMail((sTo?sTo+', ':'') + oldMessage.getTo(), sMy, aEx) || sTo;
		newMessage.sCc = extractMail(oldMessage.getCc(), sMy);
		newMessage.sBcc = extractMail(oldMessage.getBcc());
	}
	else{

		newMessage.sTo = oldMessage.getReply();

		if (sPrimaryAccountSMS){
	        var aMails = MailAddress.splitEmailsAndNames(newMessage.sTo);
			if (aMails && aMails[0] && aMails[0].email && (aMails[0].email = aMails[0].email.replace(/\"/g,'')) && aMails[0].email.indexOf('sms:')===0){

				var num = /sms\:([\+0-9]+)\@/g.exec(aMails[0].email);
				if (num && (num = num[1]) && num!=aMails[0].name)
					newMessage.sSMS = MailAddress.createEmail(aMails[0].name,num);
				else
					newMessage.sSMS = MailAddress.createEmail('',aMails[0].name);

				newMessage.sTo = '';
			}
		}
	}

	if (!newMessage.sSMS){

		newMessage.sSubject = OldMessage.__prefixParser(oldMessage.getSubject(), 'Re');
		newMessage.sBody = oldMessage.quoteMessage(getLang('EMAIL::REPLY_MESSAGE_HTML'), true);

		if (oldTemplate){
			//Body
			newMessage.setHtml(oldMessage.isHtml(true) || oldTemplate.isHtml(true));

			var b = mkElement('div');
				b.innerHTML = oldTemplate.getBody();

			if (document.getElementsByClassName){
				//Remove first signature
				var elm = b.getElementsByClassName('iw-signature');
				if (elm && (elm = elm[0]))
					elm.parentNode.removeChild(elm);

				newMessage.addSignature();
			}
			else
			// MSIE8 Append Signature only when no signature present
			if (oldTemplate.getBody().indexOf('<div class="iw-signature">')<0)
				newMessage.addSignature();

			newMessage.sBody = b.innerHTML + newMessage.sBody;

			//Attachments
			newMessage.aAttachments = oldTemplate.copyAttachments(aTemplate);
		}
		else{
			newMessage.setHtml(oldMessage.isHtml(true));
			newMessage.addSignature();
		}

		//Forward with attachments
		if (bCopyAttachments)
			newMessage.aAttachments = oldMessage.copyAttachments(id);

		newMessage.addvCard();
	}

	if(bIsHTML !== void 0) {
		newMessage.setHtml(bIsHTML);
	}

	//RFC 2822
	if (oldMessage.__mailInfo.REFERENCES)
		newMessage.sReferences = oldMessage.__mailInfo.REFERENCES.trim();
	else
	if (oldMessage.__mailInfo.IN_REPLY_TO)
		newMessage.sReferences = oldMessage.__mailInfo.IN_REPLY_TO.split("\n").shift().trim() || '';

	if (oldMessage.__mailInfo.MESSAGE_ID){
		newMessage.sIn_Reply_To = oldMessage.__mailInfo.MESSAGE_ID.trim();
		newMessage.sReferences = (newMessage.sReferences?newMessage.sReferences+"\r\n\t":'') + newMessage.sIn_Reply_To;
	}

	//if not embanded email
	if (id[2].indexOf('|')<0)
		newMessage.onSentCallback.push([oldMessage, oldMessage.setAnswered]);

	newMessage.onDisposeCallback.push([oldMessage, oldMessage.dispose]);

	//REPLY X-HEADER
	newMessage.oHeaders['X-Reply-Fullpath'] = id[0] +'/'+ id[1] +'/'+ WMItems.__serverID(id[2]);

	!bSkipCreateComposeWindow && gui._create('frm_compose', 'frm_compose', '', '', newMessage, oldMessage);

	return [newMessage, oldMessage];
};

OldMessage.redirect = function(id) {
	var frm = gui._create('frm_addaddress', 'frm_addaddress', '', '', [OldMessage.__redirect, [id]],
		{'to': "DATAGRID_ITEMS_VIEW::TO"}, {}, 'to', true
	);

	frm.x_btn_ok._onclick = function(){
		this._parent.__hide();
		this._parent.__ok = true;
		this._parent._onclose();
	};
};

OldMessage.whitelistSender = function(ids) {
	gui._create('frm_confirm', 'frm_confirm', '', '', [OldMessage.__blackOrWhiteList, [ids, true]],
		'CONFIRMATION::WHITELIST_SENDER_CONFIRMATION', 'CONFIRMATION::WHITELIST_SENDER'
	);
};

OldMessage.blacklistSender = function(ids) {
	gui._create('frm_confirm', 'frm_confirm', '', '', [OldMessage.__blackOrWhiteList, [ids, false]],
		'CONFIRMATION::BLACKLIST_SENDER_CONFIRMATION', 'CONFIRMATION::BLACKLIST_SENDER'
	);
};

OldMessage.whitelistDomain = function(ids) {
	gui._create('frm_confirm', 'frm_confirm', '', '', [OldMessage.__blackOrWhiteList, [ids, true, true]],
		'CONFIRMATION::WHITELIST_SENDER_CONFIRMATION', 'CONFIRMATION::WHITELIST_DOMAIN'
	);
};

OldMessage.blacklistDomain = function(ids) {
	gui._create('frm_confirm', 'frm_confirm', '', '', [OldMessage.__blackOrWhiteList, [ids, false, true]],
		'CONFIRMATION::BLACKLIST_SENDER_CONFIRMATION', 'CONFIRMATION::BLACKLIST_DOMAIN'
	);
};

OldMessage.deliver = function(ids) { OldMessage.__quarantineAction(ids, 'deliver') };
OldMessage.whitelist = function(ids) {
	OldMessage.__quarantineAction(ids, 'whitelist');
	if (gui.notifier)
		gui.notifier._value({type: 'sender_whitelisted'});
};
OldMessage.blacklist = function(ids) {
	OldMessage.__quarantineAction(ids, 'blacklist');
	if (gui.notifier)
		gui.notifier._value({type: 'sender_blacklisted'});
};
OldMessage.__quarantineAction = function(ids, sAction){
	WMItems.quarantine({'aid': ids[0], 'fid': ids[1], 'iid': ids[2], 'action': sAction}, 'items', '', 'folders');
	Item.__removeFromDataset(ids);
};

/**
 * @param	id			[aid, fid, iid]
 * @param	sColor		OldMessage.RED .. OldMessage.CLEAR
 */
OldMessage.setColor = function(ids, sColor) {

	//Multiple
	if (!Is.Array(ids[2]))
		ids[2] = [ids[2]];

	for(var id, sOldColor, i = 0; i<ids[2].length; i++){

		id = [ids[0],ids[1],ids[2][i]];
		sOldColor = OldMessage.getColor(id);

		if (!sOldColor || sOldColor != sColor) {

			dataSet.add('items', id.concat(['COLOR']), sColor);

			// Perform and refresh mailview
			WMItems.add(id, {'values': {'COLOR': sColor}}, 'items','','',[function(bOK){
				if (bOK) {
					if(dataSet.get('preview', id)) {
						dataSet.add('preview', id.concat(['COLOR']), sColor);
					}
				} else {
					dataSet.add('items', id.concat(['COLOR']), sOldColor);
				}
			}]);
		}
	}

};

OldMessage.getColor = function(id) { return dataSet.get('items', id.concat(['COLOR'])) };

OldMessage.open = function(id,bKeepSeen, bForceOpen) {
	if (dataSet.get('preview', id) && !bForceOpen) return;

	dataSet.add('active_items', [id[0],id[1]], id[2]);

	if ((GWOthers.getItem('MAIL_SETTINGS_GENERAL','show_inline_images') || 0)<1 || (dataSet.get('main',['spam_path']) == id[0]+'/'+id[1] && (GWOthers.getItem('MAIL_SETTINGS_GENERAL','show_images') || 0)<1))
		var def_val = OldMessage.__FULLMAIL_VALUES;
	else
		var def_val = OldMessage.__FULLMAIL_VALUES_DANGER;

	if (dataSet.get('folders',[id[0],id[1],'TYPE']) == 'M'){
		//if you try to open email which is unavailable already
		try{
			var message = new OldMessage(id, {});

			// Async list item (refresh mailview) and refresh folders (folder tree)
			WMItems.list({"aid": id[0], "fid": id[1], "iid": id[2], "values": def_val, "custom_values": {KEEP_SEEN: bKeepSeen}},'preview', '', 'folders', [OldMessage.__mailviewCallback, [message, message.hasFlag('SEEN')]]);
		}
		catch(er){gui._REQUEST_VARS.debug && console.log(this._name||false,er)}
	}
	else
		WMItems.list({"aid": id[0], "fid": id[1], "iid": id[2], "values": def_val},'preview', '', 'folders');
};

OldMessage.delivery_report = function(id) {
	gui._create('frm_delivery', 'frm_delivery', '','', id);
};

OldMessage.openwindow = function(id, aSortInfo, aLockInfo, bIsHTML) {

	//Focus already opened email
	var frms = gui._getChildObjects('main','frm_mail');
	if (frms.length)
		for (var i = frms.length-1; i>=0; i--)
			if (Is.Array(frms[i].__id) && arrayCompare(frms[i].__id, id)){
				frms[i]._focus();
				return;
			}

/*
	var sDataSet = 'mailview_window';
    for(var no = 0;;no++)
		if (!dataSet.get(sDataSet+'/'+no)){
            sDataSet += '/'+no;
			break;
		}

	if ((GWOthers.getItem('MAIL_SETTINGS_GENERAL','show_inline_images') || 0)<1 || (dataSet.get('main',['spam_path']) == id[0]+'/'+id[1] && (GWOthers.getItem('MAIL_SETTINGS_GENERAL','show_images') || 0)<1))
		var def_val = OldMessage.__FULLMAIL_VALUES;
	else
		var def_val = OldMessage.__FULLMAIL_VALUES_DANGER;

	if (id[2].indexOf('|')>-1)
		WMItems.list(
			{"aid": id[0], "fid": id[1], "iid": id[2], "values": def_val},
			sDataSet);
	else{
        var message = new OldMessage(id,[]);
		WMItems.list(
			{"aid": id[0], "fid": id[1], "iid": id[2], "values": def_val},
			sDataSet,'','folders',[OldMessage.__mailviewCallback,[message, message.hasFlag('SEEN')]]);
	}
*/

	gui._create('frm_mail', 'frm_mail', '','', id, aSortInfo, aLockInfo, bIsHTML);
};

OldMessage.markWithFlag = function(ids,aFlags,bUpdFolders) {
	WMItems.setFlag({"aid": ids[0], "fid": ids[1], "iid": ids[2]}, aFlags, 'items', bUpdFolders?'folders':'');
};

OldMessage.markAsRead = function(ids) {
	OldMessage.markWithFlag(ids,{'SEEN': true},true);
};

OldMessage.markAsUnread = function(ids) {
	OldMessage.markWithFlag(ids,{'SEEN': false},true);
};
OldMessage.markAsForwarded = function(ids) {
	OldMessage.markWithFlag(ids,{'FORWARDED':true},false);
};
OldMessage.markAsAnswered = function(ids) {
	OldMessage.markWithFlag(ids,{'ANSWERED':true},false);
};


OldMessage.__blackOrWhiteList = function(ids, bWhitelist, bDomain) {
	var sFolder = bWhitelist?'SPAM_QUEUE/Whitelist':'SPAM_QUEUE/Blacklist';

	for (var i in ids[2]) {
		// Get sender email of item
		var sender = dataSet.get('items', [ids[0], ids[1], ids[2][i], 'FROM']);
		if (!sender || !(sender = MailAddress.splitEmailsAndNames(sender))) continue;
		sender = sender[0]['email'];
		// Black/Whitelist whole domain
		if(bDomain)
			sender = sender.split("@")[1];
		// Send request
		WMItems.add([sPrimaryAccount, sFolder], {'values': {'EMAIL': sender}}, 'items');
	}

	// Get SPAMbox
	var sSpam = Path.split(dataSet.get('main',['spam_path'])).pop();
	if (sSpam){
		// Move to Inbox
		if (bWhitelist && ids[1] == sSpam)
			Item.__copyOrMoveItems (sPrimaryAccount, 'INBOX', 'move', ids);
		else
		// Move to Spam
		if (!bWhitelist && ids[1] != sSpam){
			if (!dataSet.get('folders',[sSpam]))
				dataSet.add('folders',[sSpam],{'TYPE':'M','RIGHTS':'rw','NAME':getLang('COMMON_FOLDERS::SPAM'),'ACCESS':'rwmd'});

			Item.__copyOrMoveItems (sPrimaryAccount, sSpam, 'move', ids);
		}
	}

	// Confirm black/whitelisting
	if (gui.notifier) {
		if(bWhitelist) {
			gui.notifier._value({type: 'sender_whitelisted'});
		} else {
			gui.notifier._value({type: 'sender_blacklisted'});
		}
	}
};

OldMessage.__mailviewCallback = function(message, bPrevSeen, mailInfo) {

	if (message && mailInfo){
		message.__synchronizeFlags(mailInfo[message.__id[0]][message.__id[1]][message.__id[2]]);
		if (!bPrevSeen && message.hasFlag('SEEN') && (!message.__id || GWOthers.getItem('DEFAULT_FOLDERS', 'drafts') != [message.__id[0],message.__id[1]].join('/')) && message.getConfirmAddress()){

			if (gui.msg_read_confirm)
				gui.msg_read_confirm._destruct();

			switch(GWOthers.getItem('READ_CONFIRMATION','send_confirmation') || '0') {
				case '0': // Ask
					var tmp = gui._create('msg_read_confirm', 'frm_confirm', '', '',
						[OldMessage.__createReadingConfirmation, [message]],
						'CONFIRMATION::CREATE_READING_CONFIRMATION_TITLE',
						'CONFIRMATION::CREATE_READING_CONFIRMATION'
					);
					tmp._modal(false);
					tmp.x_btn_ok._value('COMMON::YES');
					tmp.x_btn_cancel._value('COMMON::NO');
					break;
				case '1': // Send without asking
					OldMessage.__createReadingConfirmation(message);
			}
			// Otherwise '2' - do not send confirmation
		}
		else
			message.dispose();
	}
	return;
};

OldMessage.prototype.__synchronizeFlags = function(mailInfo) {

	this.__mailInfo = mailInfo;
	var datasetItems = this.__datasetItems;

	function testAndSet(sItemName) {
		if (datasetItems[sItemName] != mailInfo[sItemName]) {
			datasetItems[sItemName] = mailInfo[sItemName];
			return true;
		}
		return false;
	}

	var bChanged = false;
	bChanged |= testAndSet('FLAGS');
	bChanged |= testAndSet('HAS_ATTACHMENT');
	bChanged |= testAndSet('SMIME_STATUS');
	bChanged |= testAndSet('PRIORITY');

	if (bChanged && dataSet.get('items', this.__id))
		dataSet.update('items', this.__id);
};


OldMessage.__redirect = function(bOK, aAddresses, id, eForm) {
	if (bOK && eForm && aAddresses && aAddresses['to'].length) {
		var aMessageInfo = {"aid": id[0], "fid": id[1], "iid": id[2]};
		var aResult = MailAddress.findDistribList({'to': aAddresses['to'].join(', ')});
		for (var sTag in aResult)
			aMessageInfo[sTag] = aResult[sTag];

		WMItems.redirect(aMessageInfo, 'dummy','',[OldMessage.__redirect_result,[eForm]]);
	}
};

OldMessage.__redirect_result = function(eForm,aError){

	eForm.__ok = false;

	if (aError){
		eForm.__show();
		if (aError[0])
			gui.notifier._value({type: 'alert', args: {header: 'ALERTS::'+aError[0].toUpperCase(), text_plain: aError[1]}});
		else
			gui.notifier._value({type: 'alert', args: {header: '', text_plain: aError[1]}});
	}
	else{
		eForm._destruct();

		if (gui.notifier)
			gui.notifier._value({type: 'message_redirected'});
	}
};

/**
 * read confirmation
 **/
OldMessage.__createReadingConfirmation = function(oldMessage) {

	function setMessageVariables(sText, oldMessage) {

		var date = new IcewarpDate(oldMessage.getDate() * 1000, {locale: 'en'}),
			//sdate = date.toGMTString().escapeHTML(),
			sdate = date.format('rfc2822'),
			from = oldMessage.getFrom() ? oldMessage.getFrom().escapeHTML() : '',
			to = oldMessage.getTo() ? oldMessage.getTo().escapeHTML() : '',
			subject = oldMessage.getSubject() || '';

		sText = sText.replace(/\n/g,"<br />").replace(/%FROM%/g, from).replace(/%TO%/g, to).replace(/%DATE%/g, sdate).replace(/%SUBJECT%/g, subject);

		//FormatDateTime parsing
		sText = sText.replace(/%FormatDateTime ([^%]+)[^%]*%/gm, function($0,$1){ return date.format($1) });

		return sText;
	}

	var newMessage = new NewMessage();

//	newMessage.sFrom = getPrimaryAccountFromAddress();//oldMessage.getTo();
	newMessage.sTo = oldMessage.getConfirmAddress() || oldMessage.getFrom();
	newMessage.sSubject = setMessageVariables(GWOthers.getItem('READ_CONFIRMATION', 'subject'), oldMessage);
	newMessage.sBody = setMessageVariables(GWOthers.getItem('READ_CONFIRMATION', 'text'), oldMessage);

	oldMessage.dispose();

	newMessage.send(false,'',{'read_confirmation':false,'priority':4});
};

OldMessage.prototype.getFrom = function() {
	return toString(this.__datasetItems.FROM).trim();
};
OldMessage.prototype.getCc = function() {
	return toString(this.__datasetItems.CC).trim();
};
OldMessage.prototype.getBcc = function() {
	return toString(this.__datasetItems.BCC).trim();
};
OldMessage.prototype.getTeamchat = function() {
	return toString(this.__mailInfo.TEAMCHAT).trim();
};
OldMessage.prototype.getComment = function() {
	return toString(this.__mailInfo.TEAMCHAT_COMMENT).trim();
};
OldMessage.prototype.getTo = function() {
	return toString(this.__datasetItems.TO).trim();
};

OldMessage.prototype.getReply = function() {
	if (this.__mailInfo.REPLY_TO)
		return toString(this.__mailInfo.REPLY_TO).trim();
	else
		return this.getFrom();
};
OldMessage.prototype.getSubject = function() { return toString(this.__datasetItems.SUBJECT) };
OldMessage.prototype.getFlags = function() { return this.__datasetItems.FLAGS };
OldMessage.prototype.getDate = function() { return this.__datasetItems.DATE };
OldMessage.prototype.getSize = function() { return this.__datasetItems.SIZE };

OldMessage.prototype.hasAttachments = function() { return (this.__mailInfo.HAS_ATTACHMENT == 'true') };
OldMessage.prototype.hasEmbeddedAttachments = function() { return !!this.__mailInfo.HAS_EMBEDDED_ATTACHMENT };

OldMessage.prototype.getSms = function() { return toString(this.__mailInfo.SMS) };
OldMessage.prototype.getBody = function() { return toString(this.__mailInfo.HTML) };
OldMessage.prototype.getPriority = function() { return toString(this.__mailInfo.PRIORITY) };
OldMessage.prototype.getDelay = function() { return toString(this.__mailInfo.DEFERRED_DELIVERY) };

OldMessage.prototype.getBase = function() {

	var sBase = this.__mailInfo.BASE_URL || '';
	if (sBase){
		if (sBase.indexOf('file://')===0)
			sBase = '';
		else{
			if (!(/\/$/gi.test(sBase)))
				sBase += '/';

			if (!(/^((http)|(https))\:/gi.test(sBase)))
				sBase = 'http://' + sBase;
		}
	}

	return toString(sBase);
};

OldMessage.prototype.isHtml = function(bReply) {
	if (bReply)
		switch(GWOthers.getItem('MAIL_SETTINGS_DEFAULT', 'reply_message').toString()){
			case '1':
				return false;
			case '2':
				return true;
		}

	return (this.getStaticFlags() & 1) ? true : false;
};
OldMessage.prototype.getAttachments = function() { return this.__mailInfo.ATTACHMENTS };
OldMessage.prototype.getStaticFlags = function() { return this.__mailInfo.STATIC_FLAGS };
OldMessage.prototype.getConfirmAddress = function() { return toString(this.__mailInfo.CONFIRM_ADDR) };

OldMessage.prototype.copyAttachments = function(id) {
	var result = {'attachments': []},
		id = id || this.__id;

	if (this.hasAttachments()) {
		var aOldAttachments = this.getAttachments(),
			aAttachFrame, aAttachResult;

		for(var sAttId in aOldAttachments) {
			aAttachFrame = aOldAttachments[sAttId]['values'];

			if (aAttachFrame.SMART)
				continue;

			aAttachResult = {};
			aAttachResult['class'] = 'attachment';
			aAttachResult['fullpath'] = id[0] + '/' + id[1] + '/' + WMItems.__serverID(id[2]) +'/' + sAttId;

			for(var sTag in aAttachFrame)
				aAttachResult[sTag.toLowerCase()] = aAttachFrame[sTag];

			result['attachments'].push({'values': aAttachResult});
		}
	}

	return result;
};

OldMessage.prototype.hasFlag = function(sFlagName) {
	var nFlag;
	if ((nFlag = this.getFlags()) === undefined) return false;

	return WMItems.hasFlag(nFlag, sFlagName);
};

OldMessage.prototype.setFlags = function(aFlagNames) {
	var bUpdateFolders = false;
	var aFlagPairs = {};

	for (var i in aFlagNames) {
		if (aFlagNames[i] == 'SEEN')
			bUpdateFolders = true;

		aFlagPairs[aFlagNames[i]] = true;
	}

	if (bUpdateFolders)
		WMItems.setFlag({"aid": this.__id[0], "fid": this.__id[1], "iid": [this.__id[2]]}, aFlagPairs, 'items', 'folders');
	else
		WMItems.setFlag({"aid": this.__id[0], "fid": this.__id[1], "iid": [this.__id[2]]}, aFlagPairs, 'items');
};

OldMessage.prototype.setAnswered = function() {
	if (!this.hasFlag('SEEN'))
		this.setFlags(['ANSWERED', 'SEEN']);
	else
		this.setFlags(['ANSWERED']);
};

OldMessage.prototype.setForwarded = function() {
	if (!this.hasFlag('SEEN'))
		this.setFlags(['FORWARDED', 'SEEN']);
	else
		this.setFlags(['FORWARDED']);
};

OldMessage.prototype.dispose = function() {
	dataSet.disobey(this);
};

OldMessage.__prefixParser = function(sSubject, sType) {
	if (typeof sSubject == 'undefined')
		return '';

    if (GWOthers.getItem('MAIL_SETTINGS_GENERAL', 'classic_prefix')>0)
        return sType+': '+sSubject;

	var aSubjectSplit = sSubject.split(':');
	var sLast = sType;
	var sLastLow = (sLast ? sLast.toLowerCase() : '');
	var nCounter = 1;
	var aResult = [];
	var nInArray = count(aSubjectSplit);
	var nItem = 0;

	var aParcSplit,sShort,sShortLow,nNumber,bEnd;

	for(var n in aSubjectSplit) {
		if (bEnd)
			aResult.push(aSubjectSplit[n].trim());
		else {
			aParcSplit = aSubjectSplit[n].split('[');
			sShort = aParcSplit[0].trim();
			sShortLow = (sShort ? sShort.toLowerCase() : '');
			nItem++;

			if (aParcSplit[1])
				nNumber = aParcSplit[1].substr(0,aParcSplit[1].indexOf(']')).trim()*1;
			else
				nNumber = 1;

			if (sShort.length < 2 || sShort.length > 3 || isNaN(nNumber) || nNumber <= 0 || nItem == nInArray) {

				if (sLast) {
					if (nCounter>1)
						aResult.push(sLast+'['+nCounter+']');
					else
						aResult.push(sLast);
				}

				aResult.push(aSubjectSplit[n].trim());
				bEnd = true;
			}
			else
			if (sLastLow == sShortLow)
				nCounter += nNumber;
			else {
				if (sLast) {
					if (nCounter>1)
						aResult.push(sLast+'['+nCounter+']');
					else
						aResult.push(sLast);
				}

				sLast = sShort;
				sLastLow = sShortLow;
				nCounter = nNumber;
			}
		}
	}

	return aResult.join(': ');
};

OldMessage.prototype.__update = function() {
	var datasetItems = dataSet.get('items', this.__id);
	if (datasetItems)
		this.__datasetItems = datasetItems;
};

//Auxiliary
OldMessage._parseRcp = function(sRcp){
	return MailAddress.splitEmailsAndNames(sRcp).map(function(mail){
		var	a = mkElement('a', {style:"font-family:Helvetica, sans-serif;font-size:12px;font-weight:300;line-height:150%;color:#0088CC;text-decoration:none;", href:'mailto:' + mail.email, text: mail.email}).outerHTML;
		if (mail.name)
			mail.name = mail.name.replace(/([\"\\])/g,'\\$1').trim();

		return mail.name?mail.name + ' (' + a + ')':a;

	}).join(', ');
};
