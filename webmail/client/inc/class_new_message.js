/*
	Public:
		- sFrom
		- sTo
		- sCc
		- sBcc
		- sSubject
		- aAttachments
		- sBody

		- isHtml()
		- setHtml()

		- onSentCallback  - array
		- onDisposeCallback - array
	Private:
		- __id
*/
function NewMessage(id) {
	if (id)
		this.__id = id;

	this.onSentCallback = [];
	this.onDisposeCallback  = [];
	this.oHeaders = {};

	this.signatureID = 0;
};

NewMessage.crlf = '<div><br></div>';
/**
 * Generates proper signature according to given alias or list of aliases
 * @params:	sRcp - comma separated list of recipient emails
 **/
NewMessage.signature = function(sRcp){

	var iAliasID = null,
		aTmp = dataSet.get('storage',['ALIASES','ITEMS']);

    if (GWOthers.getItem('RESTRICTIONS', 'disable_personalities')>0){
		for(var i in aTmp)
			if (aTmp[i].VALUES.EMAIL.VALUE.toLowerCase() == sPrimaryAccount){
				iAliasID = i;
				break;
			}
	}
	else{
		var aRcp = {};
		if (sRcp){
			var tmp = MailAddress.splitEmailsAndNames(sRcp);
			for (var i in tmp)
				aRcp[tmp[i].email.toLowerCase()] = true;
		}
		else{
			var tmp = GWOthers.getItem('MAIL_SETTINGS_DEFAULT', 'from');
			if (tmp && (tmp = MailAddress.splitEmailsAndNames(tmp))){
			    if (tmp[0] && tmp[0].email.toLowerCase() != sPrimaryAccount.toLowerCase())
			    	aRcp[tmp[0].email.toLowerCase()] = true;
			    else
			    	aRcp[sPrimaryAccount.toLowerCase()] = true;
			}
			else
				aRcp[sPrimaryAccount.toLowerCase()] = true;
		}

		for(var i in aTmp)
			if (aTmp[i].VALUES && ((iAliasID == null && aTmp[i].VALUES.EMAIL.VALUE.toLowerCase() == sPrimaryAccount) || (aTmp[i].VALUES.ENABLED && aTmp[i].VALUES.ENABLED.VALUE == '1' && aRcp[aTmp[i].VALUES.EMAIL.VALUE.toLowerCase()])))
				iAliasID = i;
	}

	if (iAliasID != null){
		var bDelegate = aTmp[iAliasID].VALUES.ISDELEGATE && aTmp[iAliasID].VALUES.ISDELEGATE.VALUE == '1';
		aTmp = aTmp[iAliasID].VALUES[Is.Defined(sRcp)?'SIGN2':'SIGN1'] || {VALUE:'0'};
		var aSign = dataSet.get('storage',['SIGNATURE','ITEMS']);
		for (var i in aSign)
	    	if (aSign[i].VALUES.ID && aSign[i].VALUES.ID.VALUE == aTmp.VALUE || (aTmp.VALUE == '0' && !aSign[i].VALUES.ID))
                if (aSign[i].VALUES.TEXT){
                	var signature = aSign[i].VALUES.TEXT.VALUE;

					//convert old signature
					if (signature.indexOf('<')<0)
						signature = signature.replace(/(\r\n)|(\n)/gm,'<br>');

                    return {
						//text:NewMessage.linkFix((GWOthers.getItem('MAIL_SETTINGS_DEFAULT', 'sign_separator')>0?'<div class="separator">-- </div>':'') + signature),
						text:(GWOthers.getItem('MAIL_SETTINGS_DEFAULT', 'sign_separator')>0?'<div class="separator">-- </div>':'') + signature,
						id:(aSign[i].VALUES.ID?aSign[i].VALUES.ID.VALUE:0),
						delegate:bDelegate
                    };
                }

	}

	return {text:'', id:0, delegate: false};
};

NewMessage.linkFix = function(v){
	var tmp = document.implementation.createHTMLDocument("link").body;
		tmp.innerHTML = v;

	[].forEach.call(tmp.querySelectorAll('a[href]'), function(elm){
		try{
			elm.href = (elm.protocol?elm.protocol + (elm.protocol == 'mailto:'?'':'//'):'') + elm.host + elm.pathname + elm.search + elm.hash;
		}
		catch(r){
			elm.removeAttribute('href');
		}
	});

	return tmp.innerHTML;
};


NewMessage.compose_sms = function(aResponse) {
	if (aResponse){
		for (var i in aResponse)
		    for (var j in aResponse[i]){
				delete aResponse[i][j]['/'];
				delete aResponse[i][j]['#'];
				delete aResponse[i][j]['$'];
				delete aResponse[i][j]['@'];
				var tmp = '';
				for (var k in aResponse[i][j])
				    tmp += (tmp?';':'')+ MailAddress.createEmail(aResponse[i][j][k].ITMCLASSIFYAS,aResponse[i][j][k].LCTPHNMOBILE);

				if (tmp)
                    NewMessage.compose({sms:tmp});
				else
					gui.notifier._value({type: 'alert', args: {header: 'MAIN_MENU::SMS', text: 'CONFIRMATION::NO_MOBILE'}});
			}
	}
	else
		NewMessage.compose({sms:true});
};

NewMessage.compose = function(aRecipients, bIsHTML) {

	var newMessage = new NewMessage();

	if (aRecipients instanceof OldMessage){
		newMessage.sTo = aRecipients.getTo();
		newMessage.sRcp = newMessage.sFrom = aRecipients.getFrom();
		newMessage.sCc = aRecipients.getCc();
		newMessage.sBcc = aRecipients.getBcc();
		newMessage.sTeamchat = aRecipients.getTeamchat();
		newMessage.sComment = aRecipients.getComment();
		newMessage.sSMS = aRecipients.getSms();
		newMessage.sSubject = aRecipients.getSubject();
		newMessage.setHtml(aRecipients.isHtml(true));
		newMessage.sBody = aRecipients.getBody();
		newMessage.aAttachments = aRecipients.copyAttachments(aRecipients.__id);
	}
	else
	if (typeof aRecipients == 'object'){
	    if (aRecipients.to)
	    	newMessage.sTo = aRecipients.to;
	    if (aRecipients.cc)
	    	newMessage.sCc = aRecipients.cc;
	    if (aRecipients.bcc)
	    	newMessage.sBcc = aRecipients.bcc;

		if (aRecipients.sms)
	    	newMessage.sSMS = aRecipients.sms;
		else
		if (aRecipients.template)
			newMessage.template = aRecipients.template;
		else
		if(aRecipients.mailBody) {
			//newMessage.setHtml(false);
			newMessage.sBody = aRecipients.mailBody;
			newMessage.addSignature(true);
		}
		else{
			if (aRecipients.alias)
				newMessage.sRcp = MailAddress.createEmail('', aRecipients.alias);
			if (aRecipients.htmlBody) {
				newMessage.sBody = aRecipients.htmlBody;
			}

			newMessage.addSignature();
		}

		if (aRecipients.teamchat){
			newMessage.sTeamchat = aRecipients.teamchat;
			if (aRecipients.teamchat_comment)
				newMessage.sComment = aRecipients.teamchat_comment;
		}

		if (aRecipients.subject)
	    	newMessage.sSubject = aRecipients.subject;

		if (aRecipients.headers)
			newMessage.oHeaders = aRecipients.headers;

		if (aRecipients.body){
	    	newMessage.sBody = aRecipients.body;
			newMessage.setHtml(false);
		}
	}
	else
		newMessage.addSignature();

	if (!aRecipients || (!aRecipients.sms && !aRecipients.template))
		newMessage.addvCard();

	if(bIsHTML !== void 0) {
		newMessage.setHtml(bIsHTML);
	}
	return gui._create('frm_compose', 'frm_compose', '', '', newMessage);
};

NewMessage.composeTemplate = function(){
	var f = Path.split(GWOthers.getItem('DEFAULT_FOLDERS','templates')),
		frm = gui._create('template','frm_insert_item','','',[
		function(aPath){
			if (aPath = aPath[0]){
				var oldTemplate = new OldMessage([aPath.aid, aPath.fid, aPath.id]);
				NewMessage.compose(oldTemplate);
			}
		}],
		f[0],f[1],'M','',true);
		frm._title('COMPOSE::TEMPLATE');
};

NewMessage.prototype.isHtml = function() {
	if (!Is.Defined(this.__bHtml))
		this.__bHtml = (GWOthers.getItem('MAIL_SETTINGS_DEFAULT', 'html_message') || 0)>0 ? true : false;

	return this.__bHtml;
};

NewMessage.prototype.setHtml = function(bHtml) {
	// set HTML composing if bHtml is true, otherwise ignore the bHtml and signify
	// isHtml according to MAIL_SETTINGS_DEFAULT
	this.__bHtml = bHtml?true:false;
};

NewMessage.prototype.save = function(bKeepAttachments, aNotify, aSettingsDefault, bTeamChat) {

	var aMessageIQ = this.__loadCommonMessageIQ(bKeepAttachments, aSettingsDefault);
	aMessageIQ.to = this.sTo;
	aMessageIQ.cc = this.sCc;
	aMessageIQ.bcc = this.sBcc;
	aMessageIQ.action.email = 'false';

	if (this.sTeamchat){
		aMessageIQ.teamchat = this.sTeamchat;
		aMessageIQ.teamchat_comment = this.sComment || '';

		if (!this.__id_chat || this.__id_chat[1] != this.sTeamchat.replace(/(::.+)$/g,''))
			this.__id_chat = {0:sPrimaryAccount, 1:this.sTeamchat.replace(/(::.+)$/g,'')};

		aMessageIQ['action']['save_chat'] = {aid: this.__id_chat[0], fid: this.__id_chat[1]};
		if (this.__id_chat[2]) aMessageIQ['action']['save_chat']['iid'] = WMItems.__serverID(Array.isArray(this.__id_chat[2]) ? this.__id_chat[2][0] : this.__id_chat[2]);
	}
	else
	if (bTeamChat)
		return false;

	if (!bTeamChat){

		if (aSettingsDefault.sms>0 && this.sSMS)
			aMessageIQ.sms = this.sSMS;

		if (!this.__id) {
			this.__id = [];

			var sTarget = Path.split(GWOthers.getItem('DEFAULT_FOLDERS', (this.template?'templates':'drafts')));

			this.__id[0] = sTarget[0];
			this.__id[1] = sTarget[1];
		}

		aMessageIQ['action']['save'] = {"aid": this.__id[0], "fid": this.__id[1]};
		if (this.__id[2]) aMessageIQ['action']['save']['iid'] = Array.isArray(this.__id[2]) ? this.__id[2][0] : this.__id[2];
	}

	storage.library('wm_messages');
	return message.add(aMessageIQ, 'dummy', '', [this, '__messageSaved', [aNotify, bTeamChat]], aNotify);
};

NewMessage.prototype.send = function(bKeepAttachments, aNotify, aSettingsDefault) {
	var aSettingsDefault = aSettingsDefault || {};
	var aMessageIQ = this.__loadCommonMessageIQ(bKeepAttachments, aSettingsDefault);

	if (this.sTo == '' && this.sCc == '' && this.sBcc == '' && this.sSMS == '')
		return false;

	aMessageIQ['action']['email'] = 'true';

	//Save to Sent
	if ((typeof aSettingsDefault == 'object' && parseInt(aSettingsDefault['save_sent_message'])>0) || (typeof aSettingsDefault != 'object' && parseInt(GWOthers.getItem('MAIL_SETTINGS_DEFAULT', 'save_sent_message'))>0)) {
		var sSentFolder = Path.split(aSettingsDefault['sent'] || GWOthers.getItem('DEFAULT_FOLDERS', 'sent'));
		aMessageIQ['action']['save'] = {"aid": sSentFolder[0], "fid": sSentFolder[1]};
	}

	//Save to Teamchat
	if (this.sTeamchat){
		aMessageIQ.teamchat = this.sTeamchat;
		aMessageIQ.teamchat_comment = this.sComment || '';

		if (!this.__id_chat || this.__id_chat[1] != this.sTeamchat.replace(/(::.+)$/g,''))
			this.__id_chat = {0:sPrimaryAccount, 1:this.sTeamchat.replace(/(::.+)$/g,'')};

		aMessageIQ['action']['save_chat'] = {aid: this.__id_chat[0], fid: this.__id_chat[1]};
		if (this.__id_chat[2]) aMessageIQ['action']['save_chat']['iid'] = WMItems.__serverID(Array.isArray(this.__id_chat[2]) ? this.__id_chat[2][0] : this.__id_chat[2]);
	}

    if (GWOthers.getItem('MAIL_SETTINGS_GENERAL', 'smtp_relay')>0)
    	aMessageIQ['action']['smtp_relay'] = 'true';

	var aDistribList = MailAddress.findDistribList({'to': this.sTo, 'cc': this.sCc, 'bcc': this.sBcc});

	for (var sTag in aDistribList)
		aMessageIQ[sTag] = aDistribList[sTag];

    if (aSettingsDefault.sms>0 && this.sSMS)
		aMessageIQ.sms = this.sSMS;

	var rst = GWOthers.getItem('RESTRICTIONS', 'disable_gw_types') || '';
	if (rst.indexOf('c')<0 && window.sPrimaryAccountGW && parseInt(GWOthers.getItem('MAIL_SETTINGS_GENERAL', 'auto_recipient_to_addressbook')))
		aMessageIQ['action']['auto_addressbook'] = 'true';

	//REMOVE iw-remove marked tags
	if (aMessageIQ.body){
		storage.library('purify.wrapper', 'purify');

		var safeHtml = mkElement('div', {innerHTML: DOMPurify.sanitize(aMessageIQ.body)});

		[].forEach.call(safeHtml.querySelectorAll('[iw-remove='+ (aMessageIQ.action.html_body === "true"?'html':'text') +']'), function(elm){
			elm.parentNode.removeChild(elm);
		});
		aMessageIQ.body = safeHtml.innerHTML;
	}

	storage.library('wm_messages');
	return message.add(aMessageIQ, 'dummy', '' , [this, '__messageSent', [aNotify]], aNotify);
};

NewMessage.prototype.dispose = function() {
	if (typeof this.onDisposeCallback == 'object' && this.onDisposeCallback.length>0)
		for(var i in this.onDisposeCallback)
			executeCallbackFunction(this.onDisposeCallback[i]);
};

NewMessage.prototype.addvCard = function() {
	if (GWOthers.getItem('MAIL_SETTINGS_DEFAULT', 'append_vcard')>0){
		if (!this.aAttachments || !this.aAttachments.attachments)
			this.aAttachments = {'attachments':[]};

		this.aAttachments.attachments.push({'values': {'class': 'item', 'fullpath': sPrimaryAccount+'/@@mycard@@/@@mycard@@', 'name': (dataSet.get('main',['fullname']) || 'vCard')+'.vcf'}});
	}
};

NewMessage.prototype.addSignature = function(bBottom) {

	if (!Is.Defined(this.sBody))
		this.sBody = '';
	else
		this.sBody = this.sBody.replace('<div class="iw-signature">','<div>');

	var aSign = NewMessage.signature(this.sRcp),
		sSign = aSign.text ? NewMessage.crlf + '<div class="iw-signature">' + aSign.text + '</div>' : '';

	//Add default signature ID
	this.signatureID = aSign.id;
	this.bDelegate = aSign.delegate;

	if (!bBottom && GWOthers.getItem('MAIL_SETTINGS_DEFAULT', 'sign_top')>0)
		this.sBody = sSign + this.sBody;
	else
		this.sBody = this.sBody + sSign;
};

NewMessage.prototype.__loadCommonMessageIQ = function(bKeepAttachments, aSettings) {
	var aMessageIQ = {};

	if (typeof aSettings != 'object')
		aSettings = GWOthers.get('MAIL_SETTINGS_DEFAULT', 'storage')['VALUES'];

	aMessageIQ['action'] = {
		"im": 'false',
		"keep": (bKeepAttachments) ? 'true' : 'false',
		"html_body": (this.isHtml()) ? 'true' : 'false'
	};

	if (aSettings.smart_attach>0){

		aMessageIQ['action'].smart_attach = 'true';

		if (aSettings.smart_path){
			var asap = Path.split(aSettings.smart_path);
			if (asap && asap[1])
				aMessageIQ['action'].smart_attach_folder = asap[1];
 		}
	}

	aMessageIQ['from'] = aSettings['from'] || getPrimaryAccountFromAddress();
	aMessageIQ['subject'] = this.sSubject;

	if (aSettings.sms>0){
		aMessageIQ['action'].sms = 'true';
		aMessageIQ['text'] = this.sBody;
	}
	else
		aMessageIQ['body'] = this.sBody;

	if (this.sDeferred)
		aMessageIQ['deferred_date'] = this.sDeferred;

	var aHeaders = [];
	if (parseInt(aSettings['read_confirmation'])) {
		aHeaders.push('X-Confirm-Reading-To: ' + aMessageIQ['from']);
		aHeaders.push('Disposition-Notification-To: ' + aMessageIQ['from']);
	}

	// Add any custom headers for this message
	for(var i in this.oHeaders)
		aHeaders.push(i+': '+this.oHeaders[i]);

	//RFC 2822 Reply conversations
	if (this.sIn_Reply_To)
		aHeaders.push('In-Reply-To: ' + this.sIn_Reply_To);
	if (this.sReferences)
		aHeaders.push('References: ' + this.sReferences);

	if (parseInt(aSettings['priority']))
		aHeaders.push('X-Priority: ' + aSettings['priority']);

	if (aSettings['reply_to_address']){
        var aTmp = MailAddress.splitEmailsAndNames(aSettings['reply_to_address']);
        if (aTmp && aTmp[0])
            aHeaders.push('Reply-To: ' + MailAddress.createEmail(aTmp[0].name,aTmp[0].email));
	}

	if (this.bDelegate)
		aHeaders.push('Sender: ' + getPrimaryAccountFromAddress());

	if (!Is.Empty(aHeaders))
		aMessageIQ['headers'] = aHeaders;

	//if (aSettings['charset']) aMessageIQ['charset'] = aSettings['charset'];

	if (parseInt(aSettings['encrypt']))
		aMessageIQ['action']['encrypt'] = 'true';
	if (parseInt(aSettings['sign']))
		aMessageIQ['action']['sign'] = 'true';

	if (this.aAttachments) {
		var aAttachments = this.aAttachments['attachments'];
		var sUploadFolId = this.aAttachments['folder'];

		var aAttachResult = [];

		for (var n in aAttachments){
			aAttachResult[n] = {
				"class":(aAttachments[n]['class'] ? aAttachments[n]['class'] : 'file'),"type":'normal',
				"fullpath":(aAttachments[n]['class'] ? aAttachments[n]['fullpath'] : sUploadFolId + '/' + aAttachments[n]['id'])
			};
			if (aAttachments[n]['description'])
				aAttachResult[n]['description'] = aAttachments[n]['description'];
		}

		if (!Is.Empty(aAttachResult))
			aMessageIQ['attachments'] = aAttachResult;
	}

	return aMessageIQ;
};

NewMessage.prototype.__messageSaved = function(bOK, sUId, sError, aNotify, bChat) {

	if (bOK && (sUId.length || (bChat && bOK.TEAMCHAT_ID))) {
		var bFirstTime = false;

		//Notify TeamChat
		if (bChat){

			bOK.TEAMCHAT_ID = WMItems.__clientID(bOK.TEAMCHAT_ID);

			var sAction = this.__id_chat[2] != bOK.TEAMCHAT_ID?'add':'update';

			this.__id_chat[1] = Path.slash(bOK.TEAMCHAT);
			this.__id_chat[2] = bOK.TEAMCHAT_ID;

			Item.notify(this.__id_chat, sAction, 'M');

			//Always ADD for Y
			if (bOK.TEAMCHAT_LINK_ID)
				Item.notify([this.__id_chat[0], this.__id_chat[1], WMItems.__clientID(bOK.TEAMCHAT_LINK_ID)], 'add', 'Y');
				//NewMessage.notify('add', [this.__id_chat[0],this.__id_chat[1],WMItems.__clientID(bOK.TEAMCHAT_LINK_ID)],'Y');
		}
		else{

			if (this.__id[2] != sUId){
				bFirstTime = true;
				this.__id[2] = sUId;

				//Remove saved email from Drafts folder after Sent
				this.onSentCallback.push([function(id){
					Item.remove(makeIDSFromID(id), true);
					//WMItems.remove({'aid':id[0],'fid':id[1],'iid':[id[2]]},'','','',[function(bOK){ if (bOK) Item.__refreshView(id,true); }]);
				},[this.__id]]);
			}

			//Refresh Draft folder if active
			Item.__refreshView(this.__id, true);
		}

  		if (aNotify)
			executeCallbackFunction(aNotify, true, bFirstTime, this, sError);
	}
	else
	if (aNotify)
		executeCallbackFunction(aNotify, false, false, sUId, sError);
};

NewMessage.prototype.__messageSent = function(aOut, sUId, sError, aNotify) {
	if (aOut && !sError && typeof this.onSentCallback == 'object' && this.onSentCallback.length)
		for(var i in this.onSentCallback){
            pushParameterToCallback(this.onSentCallback[i],aOut);
			executeCallbackFunction(this.onSentCallback[i]);
		}

	if (aNotify)
		executeCallbackFunction(aNotify, aOut, sUId, sError);

	if (aOut && !sError) {

		//Notify TeamChat
		if (aOut.TEAMCHAT && aOut.TEAMCHAT_ID){
			aOut.TEAMCHAT_ID = WMItems.__clientID(aOut.TEAMCHAT_ID);

			var sAction = this.__id_chat[2] != aOut.TEAMCHAT_ID?'add':'update';

			this.__id_chat[1] = Path.slash(aOut.TEAMCHAT);
			this.__id_chat[2] = aOut.TEAMCHAT_ID;

			Item.notify(this.__id_chat, sAction, 'M');

			//Always ADD for Y
			if (aOut.TEAMCHAT_LINK_ID)
				Item.notify(this.__id_chat, 'add', 'Y');
		}

		//Notify User
		if (gui.notifier){
			if(this.sDeferred) {
				var d = new IcewarpDate(this.sDeferred);
				gui.notifier._value({type: 'send_message_deferred', args: [aOut, d]});
			} else {
				gui.notifier._value({type: 'message_sent', args: [aOut]});
			}
		}
	}

};
/*
NewMessage.notify = function(sAction, id, sType){
	if (gui.socket){
		var f = dataSet.get('folders',[id[0],id[1]]);
		if (f){
			var aOut = {
				'ACTION':sAction,
				'TYPE':'item',
				'ITEM':WMItems.__serverID(id[2]),
				'FOLDER':f.RELATIVE_PATH,
				'FOLDER-TYPE':f.TYPE,
				'EMAIL':f.OWNER,
				'ITEM-TYPE':sType || 'M'
			};

			console.log('NewMessage.notify', aOut);

			gui.socket.api._notify(aOut);
		}
	}
};
*/
