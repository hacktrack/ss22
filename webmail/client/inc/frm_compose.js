_me = frm_compose.prototype;
function frm_compose(){};

_me.__constructor = function(oMessage, oOldMessage) {

	//default size - this line has to be presented after all elements of a window are created
	if (!gui._REQUEST_VARS['mailto'])
		this._defaultSize(-1,-1,900,620);

	var me = this;

	this.__bDisableSave = false;
	this.__bContactsOpened = false;  //addContacts are opened
	this.__logoutOnDestruct = false; //try to logout on compose destruct
	//this.__bDelivery = false; //Show Delivery report

	this.__message = oMessage;
	this.__message_old = oOldMessage;

	//email je otevren z drafts
	if (!this.__message.__id)
		this.__removeOnDestruct = true;

	// Load mail settings
	storage.library('gw_others');

	this.__settings = new cDataSet();
	this.__settings.add('VALUES', '', GWOthers.get('MAIL_SETTINGS_DEFAULT','storage').VALUES);

	this.__options = {};

	if (this.__message) {
		//priority
		this._settings('priority', this.__message.iPriority);
	}

	// Delayed sending in minutes
	this.__delay = parseInt(this._settings('send_delay') || 0);
	this.__fixed_delay = false;

	/*** SMS ***/
	if (sPrimaryAccountSMS && this.__message.sSMS && (GWOthers.getItem('RESTRICTIONS', 'disable_sms') || 0)<1){
		this._title('COMPOSE::SMS');
		this._settings('sms', '1');

		addcss(this._main,'sms');
	}
	else
	if (oMessage.template){
		this._title('COMPOSE::TEMPLATE');
		addcss(this._main, 'template');
		this._settings('template', '1');
		this.__removeOnDestruct = false;
	}
	else
		this._title('COMPOSE::NEWMAIL');

	/* Dropbox support allowed */
	this._settings('dropbox', (GWOthers.getItem('RESTRICTIONS', 'disable_dropbox') || 0)<1 && typeof Dropbox != 'undefined');

	/*** Smart Attach Support ***/
	var dgw = GWOthers.getItem('RESTRICTIONS', 'disable_gw_types');
	this.__sa_support = sPrimaryAccountWebDAV && sPrimaryAccountGW>0 && (!dgw || dgw.indexOf('f')<0) && (GWOthers.getItem('RESTRICTIONS', 'disable_smart') || 0)<1;

	if (this.__sa_support) {
		if(!dataSet.get('storage', ['DEFAULT_FOLDERS', 'ITEMS', '0', 'VALUES', 'SMART']) || dataSet.get('storage', ['DEFAULT_FOLDERS', 'ITEMS', '0', 'VALUES', 'SMART', 'ATTRIBUTES', 'DEFAULT']))
			this._settings('smart_path', GWOthers.getItem('DEFAULT_FOLDERS','files'));
		else
			this._settings('smart_path', GWOthers.getItem('DEFAULT_FOLDERS','smart'));
	} else
		this._settings('smart_attach', 0);

	/*** Check for valid Certificate ***/
	this.__cert_support = false;

	var tmp,
		aCert = dataSet.get('storage',['CERTIFICATE','ITEMS']);

	if (Is.Object(aCert))
		for(var i in aCert)
			if (aCert[i].VALUES && aCert[i].VALUES.INFO && aCert[i].VALUES.INFO.VALUE){
				tmp = XMLTools.Str2Arr(aCert[i].VALUES.INFO.VALUE).INFO[0];
				if (tmp.VALIDTO[0].VALUE && IcewarpDate.utct(tmp.VALIDTO[0].VALUE)>new IcewarpDate()){
					this.__cert_support = true;
					break;
				}
  			}

	if (!this.__cert_support){
		this._settings('encrypt', '0');
		this._settings('sign', '0');
	}

	if (!this._settings('sms')){

		//Parse Rcp
		var aRcp = {};
		if (oOldMessage && (oOldMessage.getTo() || oOldMessage.getCc())){
			if (oOldMessage.getTo()){
				var tmp = MailAddress.splitEmailsAndNames(oOldMessage.getTo());
				for (var i in tmp)
					aRcp[tmp[i].email.toLowerCase()] = true;
			}
			if (oOldMessage.getCc()){
				var tmp = MailAddress.splitEmailsAndNames(oOldMessage.getCc());
				for (var i in tmp)
					aRcp[tmp[i].email.toLowerCase()] = true;
			}
		}
		else
		if (oMessage && oMessage.sRcp){
			var tmp = MailAddress.splitEmailsAndNames(oMessage.sRcp);
			for (var i in tmp)
				aRcp[tmp[i].email.toLowerCase()] = true;
		}
		else
		if (this._settings('from')){
			var tmp = MailAddress.splitEmailsAndNames(this._settings('from'));
			if (tmp[0].email.toLowerCase()!=sPrimaryAccount.toLowerCase())
				aRcp[tmp[0].email.toLowerCase()] = true;
			else
				aRcp[sPrimaryAccount.toLowerCase()] = true;
		}
		else
			aRcp[sPrimaryAccount.toLowerCase()] = true;

		//Get list of Aliases
		var bDisabled = GWOthers.getItem('RESTRICTIONS', 'disable_personalities')>0,
			aAlias = {};

		if (!bDisabled){
			var iAliasID = null, tmp = dataSet.get('storage',['ALIASES','ITEMS']), sAlias = '', sMail, iPrimaryID = '', bFound = false;

			//Other Account
			if (oOldMessage && oOldMessage.__id[0] != sPrimaryAccount)
				sAlias = oOldMessage.__id[0].toLowerCase();
			else
			//Shared Account
			if (oOldMessage && oOldMessage.__id[0] == sPrimaryAccount && oOldMessage.__id[1].indexOf(sPrimaryAccountSPREFIX) == 0 && WMFolders.getAccess({aid:oOldMessage.__id[0],fid:oOldMessage.__id[1]},'modify'))
				sAlias = oOldMessage.__id[1].substr(sPrimaryAccountSPREFIX.length).split('/').shift().toLowerCase();

			var sParimaryAlias = sPrimaryAccount.toLowerCase(),
				default_alias = GWOthers.getItem('MAIL_SETTINGS_DEFAULT', 'from');

			if (default_alias && (default_alias = MailAddress.splitEmailsAndNames(default_alias)) && (default_alias = default_alias[0]) && (default_alias = default_alias.email))
				sParimaryAlias = default_alias.toLowerCase();

			for(var i in tmp)
				if (tmp[i] && tmp[i].VALUES && tmp[i].VALUES.EMAIL && (sMail = tmp[i].VALUES.EMAIL.VALUE.toLowerCase())){

					if (sAlias && sAlias == sMail){
						aAlias[i] = [MailAddress.createEmail(tmp[i].VALUES.NAME?tmp[i].VALUES.NAME.VALUE:'', sMail, true), MailAddress.createEmail(tmp[i].VALUES.NAME?tmp[i].VALUES.NAME.VALUE:'', sMail)];

						iAliasID = i;
						bFound = true;
					}
					else
					if (sParimaryAlias == sMail){

						if (sParimaryAlias == sPrimaryAccount.toLowerCase())
							aAlias[i] = [getPrimaryAccountFromAddress(true), getPrimaryAccountFromAddress()];
						else
							aAlias[i] = [MailAddress.createEmail(tmp[i].VALUES.NAME?tmp[i].VALUES.NAME.VALUE:'', sMail, true), MailAddress.createEmail(tmp[i].VALUES.NAME?tmp[i].VALUES.NAME.VALUE:'', sMail)];

						if (aRcp[sMail] && !bFound)
							iAliasID = i;

						iPrimaryID = i;
					}
					else
					if (sMail && tmp[i].VALUES.ENABLED && tmp[i].VALUES.ENABLED.VALUE == '1'){
						aAlias[i] = [MailAddress.createEmail(tmp[i].VALUES.NAME?tmp[i].VALUES.NAME.VALUE:'', sMail, true), MailAddress.createEmail(tmp[i].VALUES.NAME?tmp[i].VALUES.NAME.VALUE:'', sMail)];

						if (aRcp[sMail] && iAliasID == null)
							iAliasID = i;
					}
				}

			// Reply to shared mail folder with WRITE right
			if (sAlias && !bFound){
				aAlias['*'] = [MailAddress.createEmail('',sAlias, true), MailAddress.createEmail('',sAlias)];
				iAliasID = '*';
			}
			else
			if (iAliasID == null)
				iAliasID = iPrimaryID;
		}

		//Automatically Reply to Myself
		var rm = GWOthers.getItem('MAIL_SETTINGS_DEFAULT', 'reply_myself');
		switch(rm){
		case 'cc':
		case 'bcc':

			var sReAlias = '';
			if (!bDisabled && iAliasID != null && aAlias[iAliasID])
				sReAlias = aAlias[iAliasID][1];
			else
				sReAlias = getPrimaryAccountFromAddress();

			this.__message[rm == 'cc'?'sCc':'sBcc'] = MailAddress.appendEmail(this.__message[rm == 'cc'?'sCc':'sBcc'],sReAlias);
		}
	}

	// Draw extended options in main area
	var disabled = {
		disable_pe: count(aAlias)<2,
		disable_ab:sPrimaryAccountGW<1 || (GWOthers.getItem('RESTRICTIONS', 'disable_gw_types') || '').indexOf('c')>-1,
		disable_chat: !sPrimaryAccountCHAT,
		hide_pe:GWOthers.getItem('MAIL_SETTINGS_DEFAULT','show_from')!=1 && iAliasID == iPrimaryID && sParimaryAlias == sPrimaryAccount.toLowerCase(),
		hide_cc:!this.__message.sCc && (GWOthers.getItem('MAIL_SETTINGS_DEFAULT','show_cc')!=1 || this._settings('sms')),
		hide_bcc:!this.__message.sBcc && (GWOthers.getItem('MAIL_SETTINGS_DEFAULT','show_bcc')!=1 || this._settings('sms')),
		ext_ab:GWOthers.getItem('GLOBAL_SETTINGS','external_contacts')?true:false,
		maxsize:dataSet.get('main',['message_size'])?true:false,
		sms:this._settings('sms'),

		disable_smart_attach:!this.__sa_support,

		disable_signing: !this.__cert_support || !GWOthers.getItemAccess('MAIL_SETTINGS_DEFAULT','sign'),
		disable_encryption_rule: GWOthers.getItem('MAIL_SETTINGS_DEFAULT','encrypt') !== '1' && !GWOthers.getItemAccess('MAIL_SETTINGS_DEFAULT','encrypt'),
		disable_signing_rule: GWOthers.getItem('MAIL_SETTINGS_DEFAULT','sign') !== '1' && !GWOthers.getItemAccess('MAIL_SETTINGS_DEFAULT','sign'),
		disable_encryption: !this.__cert_support || !GWOthers.getItemAccess('MAIL_SETTINGS_DEFAULT','encrypt'),
		disable_confirmation: !GWOthers.getItemAccess('MAIL_SETTINGS_DEFAULT','read_confirmation'),
		disable_delivery_report: sPrimaryAccountDELIVERY==1?false:true,
		allow_delaying: sPrimaryAccountSMTP==1,
		replyto:GWOthers.getItemAccess('MAIL_SETTINGS_DEFAULT','reply_to_address'),
		template:this._settings('template'),
		disable_html:!GWOthers.getItemAccess('MAIL_SETTINGS_DEFAULT','html_message') && '0' === GWOthers.getItem('MAIL_SETTINGS_DEFAULT','html_message'),
		att_menu:me._settings('dropbox') || GWOthers.getItem('RESTRICTIONS', 'disable_attach_item')!=='1'
	};

	this.__options.cc = !disabled.hide_cc;
	this.__options.bcc = !disabled.hide_bcc;

	// Draw main area
	this._draw('frm_compose','main', disabled);

	this._draw('frm_compose_options', 'options', disabled);

	this._draw('frm_compose_bottom','footer', disabled);

	//this.priority._disabled(!GWOthers.getItemAccess('MAIL_SETTINGS_DEFAULT','priority'));

	this.mode_select._disabled(!GWOthers.getItemAccess('MAIL_SETTINGS_DEFAULT','html_message'));

	this._getAnchor('mask').onclick = function(e){
		if (hascss(this._main, 'mask_option')){
			this._options_toggle();
			removecss(this._main, 'mask_option');
		}
		else
		if (hascss(this._main, 'mask_delay')){
			this._delay_toggle();
			removecss(this._main, 'mask_delay');
		}
	}.bind(this);

	//fill spellchecker lang in extended options
	var aLang = dataSet.get('storage',['SPELLCHECKER_LANGUAGES','ITEMS']),
		aTmp = [],
		aData = {};

	for (var i in aLang)
		if (aLang[i].VALUES && aLang[i].VALUES.PATH && aLang[i].VALUES.NAME)
			aTmp.push([aLang[i].VALUES.PATH.VALUE, aLang[i].VALUES.NAME.VALUE]);

	//Sort
	if (aTmp.length){
		var aTmp = aTmp.sort(function(a,b){
			if (a[1]<b[1])
				return 1;
			else
			if (a[1]>b[1])
				return -1;
			else
				return 0;
		});

		for (var i = aTmp.length-1;i>=0;i--)
			aData[aTmp[i][0]] = aTmp[i][1];

		aTmp = null;
	}

	this.spellchecker._fill(aData);

	if (disabled.allow_delaying){
		this._draw('frm_compose_delay','delay', disabled);

		// Delayed sending from settings
		if (this.__delay){
			//What to do?
		}
		else
		if (this.__message.sDeferred){
			this.__fixed_delay = true;

			var d = new IcewarpDate(this.__message.sDeferred);
			this.delay_time._value((d.hour()*60+d.minute())*60000,true);
			this.delay_date._value(d.format(IcewarpDate.JULIAN));
		}

		// Freeze date if changed by user
		this.delay_date._ondateselect = function() {
			me.__fixed_delay = true;

			var now = (new IcewarpDate()).format('julian');
			if (this._value()<now)
				this._value(now, true);
		};
		this.delay_time._onchange = function() {
			me.__fixed_delay = true;
		};
	}

	//Fill Select Sent folder
	this.sent.__fillme = function(sFolder){
		var aPath,
			aData = {'*':getLang('COMMON::NO')};

		if (me._settings('sent')){
			aPath = Path.split(me._settings('sent'));
			aData[aPath[0]+'/'+aPath[1]] = dataSet.get('folders', [aPath[0], aPath[1], 'NAME']) || aPath[1];
		}

		aPath = Path.split(GWOthers.getItem('DEFAULT_FOLDERS','sent'));
		aData[aPath[0]+'/'+aPath[1]] = dataSet.get('folders', [aPath[0], aPath[1], 'NAME']) || aPath[1];
		aData['+'] = getLang('SELECT_FOLDER::SELECT_FOLDER');
		this._fill(aData);
	};
	this.sent.__fillme();

	this.sent._onchange = function(e) {
		switch(this._value()){
		case '*':
			me._settings('save_sent_message', 0);
			break;

		case '+':
			var aPath = Path.split(GWOthers.getItem('DEFAULT_FOLDERS','sent'));

			gui._create('select_folder', 'frm_select_folder', '', '', 'SELECT_FOLDER::SELECT_FOLDER', aPath[0], aPath[1], [function(sAccount, sFolder){
				if (sAccount && sFolder){
					me._settings('sent', sAccount+'/'+sFolder);
					me.sent.__fillme();
					me.sent._value(sAccount+'/'+sFolder);
				}
			}], true, true, 'M', 'i', true);

			me.sent._value(me._settings('save_sent_message')?me._settings('sent'):'*');
			break;

		default:
			me._settings('save_sent_message', 1);
			me._settings('sent', me.sent._value());
		}
	};

	this.spellchecker._onchange = function(e) {
		me._settings('spellchecker', this._value());
	};

	// this.priority._onchange = function(e) {
	// 	me._setPriority(me.priority._value());
	// };

	if (this.reply_to_address)
		this.reply_to_address._onblur = function(e) {
			me._settings('reply_to_address', me.reply_to_address._value());
		};

	//Height fix
	msiebox(this._getAnchor('msiebox'));

	if (this.from){

		this.from._fill(aAlias);

		if (iAliasID != null)
			this.from._value(iAliasID);

		var oGroup = {},
			snd = MailAddress.splitEmailsAndNames(this.from._getDataValue())[0].email,
			grp = dataSet.get('storage',['GROUPS','ITEMS']) || {},
			acc = dataSet.get('accounts'),
			ali = dataSet.get('storage',['ALIASES','ITEMS']);

		for(var i in grp)
			if (grp[i].VALUES.SENTFOLDER && grp[i].VALUES.SENTFOLDER.VALUE)
				oGroup[grp[i].VALUES.GROUP.VALUE] = sPrimaryAccount + '/' + grp[i].VALUES.SENTFOLDER.VALUE;

		for (var i in acc)
			if (!acc[i].PRIMARY && acc[i].SENTFOLDER)
				oGroup[i] = acc[i].SENTFOLDER;

		for (var i in ali)
			if (ali[i].VALUES && !oGroup[ali[i].VALUES.EMAIL.VALUE] && ali[i].VALUES.ENABLED.VALUE == '1' && ali[i].VALUES.SENTFOLDER && ali[i].VALUES.SENTFOLDER.VALUE)
				oGroup[ali[i].VALUES.EMAIL.VALUE] = ali[i].VALUES.SENTFOLDER.VALUE;

		if (snd in oGroup){
			if (oGroup[snd] == '*'){
				me._settings('save_sent_message', 0);
				me._settings('sent', '');
			}
			else
				me._settings('sent', oGroup[snd]);

			// refresh Save to Sent Folder select in options
			if (this.sent){
				this.sent.__fillme();
				me.sent._value(me._settings('save_sent_message')?me._settings('sent'):'*');
			}
		}

		this.from._onchange = function(){
			var signID, v = this._value();

			// Forcing sent folder for sending group if applicable
			var snd = MailAddress.splitEmailsAndNames(this._getDataValue())[0].email;

			me._settings('save_sent_message', 1);
			if (snd in oGroup){
				if (oGroup[snd] == '*'){
					me._settings('save_sent_message', 0);
					me._settings('sent', '');
				}
				else
					me._settings('sent', oGroup[snd]);
			}
			else
				me._settings('sent', GWOthers.getItem('DEFAULT_FOLDERS', 'sent'));

			// refresh Save to Sent Folder select in options
			if (me.sent){
				me.sent.__fillme();
				me.sent._value(me._settings('save_sent_message')?me._settings('sent'):'*');
			}

			// Set signature according to sender address
			var aAlias = (dataSet.get('storage',['ALIASES','ITEMS',v]) || {}).VALUES;

			if (aAlias){
				if (Is.Defined(me.__message.sRcp))
					signID = aAlias.SIGN2?aAlias.SIGN2.VALUE:'';
				else
					signID = aAlias.SIGN1?aAlias.SIGN1.VALUE:'';

				me.__message.bDelegate = aAlias.ISDELEGATE && aAlias.ISDELEGATE.VALUE == '1';
			}

			me._addSignature(signID);
		};
	}

	//Extend button
	this._getAnchor('switch').onclick = function(){
		if (!me.__options.max){
			me._layout_maximize(true);
		}
		else{
			me._layout_minimize();
		}
	};

	if (!this._settings('sms')){

		//Attach File
		this.x_btn_att._onclick = function(){
			me.attach_control.file._click();
		};

		if (this.x_btn_att._type == 'obj_button_menu'){
			this.x_btn_att._menu(function(){

				var arr = [
					{
						title: 'ATTACHMENT::FROM_COMPUTER',
						css:'ico2 att',
						arg: [
							function(){
								me.attach_control.file._click();
							}
						]
					}
				];

				if (me._settings('dropbox')) {
					arr.push(
						{
							title: 'ATTACHMENT::FROM_DROPBOX',
							css:'ico2 dropbox',
							arg: [function() {
								me.body.__dropboxHandler();
							}]
						}
					);
				}

				if (GWOthers.getItem('RESTRICTIONS', 'disable_attach_item')!=='1') {
					arr.push(
						{
							title: 'ATTACHMENT::FROM_DOCUMENTS',
							css:'ico2 doc',
							arg: [function() {me.attach_control.item._onclick();}]
						}
					);
				}

				if (Alfresco.enabled()) {
					arr.push({
						title: 'ATTACHMENT::FROM_ALFRESCO',
						css: 'ico2 alfresco',
						arg: [function() {me.attach_control.item._onclick('K');}]
					});
				}

				return arr;
			}, 'compose_att_menu');
		}


/*
		//Upload
		tmp = mkElement('A',{className:'ico always icoatt',title:getLang('COMPOSE::UPLOAD_FILE')});
		tmp.onclick = function(e){
			me.attach_control.file._click();
		};
		this.body._getAnchor('additional').appendChild(tmp);

		//Attach File
		if (GWOthers.getItem('RESTRICTIONS', 'disable_attach_item')!=='1'){
			tmp = mkElement('A',{className:'ico always icogw',title:getLang('COMPOSE::UPLOAD_ITEM')});
			tmp.onclick = function(e){
				me.attach_control.item._onclick();
			};
		}

		this.body._getAnchor('additional').appendChild(tmp);
*/

		//Emoji
		this.body._emoji();

		//Signature
		var tmp = mkElement('A',{className:'ico icosign',title:getLang('SIGNATURE::SIGNATURE')});
		tmp.onclick = function(e){

			if (!me.body.__coded && (!this.__cmenu || this.__cmenu._destructed)){
				var e = e || window.event,
					elm = this;

					//Contextmenu
				var aFill = me.__genSignature();
				if (aFill){

					e.cancelBubble = true;
					if (e.stopPropagation)
						e.stopPropagation();

					addcss(this,'active');

					this.__cmenu = gui._create('cmenu','obj_context',void 0, 'height_200');
					this.__cmenu._onclose = function(){
						removecss(elm,'active');
					};

					this.__cmenu._fill(aFill);

					var pos = getSize(this);
					this.__cmenu._place(pos.x+pos.w/2,pos.y+pos.h,'',2);

					return false;
				}
				//Toggle
				else{
					if (me.__message.signatureID == '*' && me._getSignature() == false)
						gui._create('settings','frm_settings','','','mail_settings','signature');
					else
						me._addSignature(me.__message.signatureID == '*'?0:'*');
				}
			}
		};
		this.body._getAnchor('additional').appendChild(tmp);

		this.x_btn_priority = this.body._create('x_btn_priority','obj_button_menu','additional_right','noborder transparent simple ico img priority');

		//Use font, size and direction container
		this.body.__output_format = true;
	}

	//Load headers
	function sendme(e){
		if (e.ctrlKey && !me.__hidden && !(me.x_btn_save || me.x_btn_send)._disabled()){
			if (me._settings('template')){
				me.__save();
			}
			else{
				switch(GWOthers.getItem('MAIL_SETTINGS_DEFAULT','ctrl_enter').toString()){
					//Now
					case '1':
						//disable deferred delay
						if (me._settings('deferred'))
							me._delay_toggle();

						me.__send(false, false, void 0, void 0, true);
						break;

					//Delay
					case '2':
						if (disabled.allow_delaying && !me._settings('deferred'))
							me._delay_toggle();
					//Send
					default:
						me.__send(false, false);
				}
			}
		}

		return false;
	};

	if (this.to){
		this.to._collapsedValue(this.__message.sTo);
		this.to._onsubmit = sendme;
	}

	if (this.teamchat){
		this.teamchat._onsubmit = sendme;
		this.teamchat._onchange = function(){
			var a = MailAddress.splitEmails(this._value()),
				l = a.length,
				sFolder = (a[l-1] || '').replace(/[\[\]]/g, '');

			if (l>1){

				this._value(a.pop());
			}

			var elm = me._main.querySelector('[data-toggle=chat_message]');
			if (elm)
				window[l>0?'addcss':'removecss'](elm, 'show');

			if (me.teamchat_message.__folder != sFolder){
				me.teamchat_message._value('');
				me.teamchat_message.__folder = sFolder;
			}

			me.teamchat_message._disabled(!l);

			//Auto-focus to comment
			var elm = me._main.querySelector('div.chat_message');
			if (l){
				removecss(me._main.querySelector('div.ico_teamchat'), 'extended');

				//box lpad rpad chat_message extended
				if (elm) removecss(elm, 'extended');
				me.teamchat_message._focus();
			}
			else
			if (elm){
				addcss(elm, 'extended');
			}
		};

		if (this.__message.sTeamchat){
			this.teamchat._value('['+ this.__message.sTeamchat +']');

			// var arr = this.__message.sTeamchat.split('/'),
			// 	name = dataSet.get('folders', [sPrimaryAccount, this.__message.sTeamchat, 'NAME']);
			// this.teamchat._value('['+ arr.join('/') +']');
		}

		this.teamchat_message._onchange = function(){
			var elm = me._main.querySelector('[data-toggle=chat_message]');
			if (elm){
				window[this._value().length>0?'addcss':'removecss'](elm, 'dot');
			}
		};
		this.teamchat_message._onblur = function(){
			this._onchange();
		};
		if (this.__message.sComment)
			this.teamchat_message._value(this.__message.sComment);


		this.lbl_chat._onclick = function(e, aHandler){
			var	sFolder,
				f = Cookie.get(['last']);

			if (f && (f = f['I']) && (f = Path.split(f)) && WMFolders.getType(f) == 'I'){
				sFolder = f[1];
			}
			else{
				var f = dataSet.get('folders', [sPrimaryAccount]);
				for(var id in f){
					if (f[id].TYPE == 'I'){
						sFolder = id;
						break;
					}
				}
			}

			if (sFolder)
				gui._create('frm_select_folder', 'frm_select_folder', '', '', 'CHAT::SELECT', sPrimaryAccount, sFolder,
					[function(aid, fid){
						var sName = dataSet.get('folders', [aid, fid,'NAME']) || dataSet.get('folders', [aid, fid,'RELATIVE_PATH']) || '';
						if (sName.length){
							fid += '::'+ sName;
							me.teamchat._value('['+fid+']');

							if (aHandler)
								executeCallbackFunction(aHandler);
						}
					}], true, true, ['Y','I'], '', true
				);
		};
	}

	this.cc._collapsedValue(this.__message.sCc);
	this.cc._onsubmit = sendme;
	this.bcc._collapsedValue(this.__message.sBcc);
	this.bcc._onsubmit = sendme;
	this.subject._value(this.__message.sSubject);
	this.subject._onsubmit = sendme;

	// SAVE (Ctrl+S) shortcut handler
	this.body.onkeydown = function(e){
		var e = e || window.event;
		if (e.ctrlKey && !e.altKey && (e.keyCode == 83 || e.keyCode == 13)){
			if (e.preventDefault)
				e.preventDefault();
			else
			if (e.cancelBubble)
				e.cancelBubble = true;

			if (me._settings('template'))
				me.__save(e.keyCode == 83);
			else
			if (e.keyCode == 83)
				me.__save();
			else
				sendme(e);

			return false;
		}
	};

	this.body._onesc = function() {
		me._close(true);
	};

	//Smart Attach
	if (this.__sa_support && this.attach){

		this._create('btn_smart','obj_checkbox','smart','ico smart');
		this.btn_smart._title('COMPOSE::SMARTATTACH');

		 this.btn_smart._onchange = function (){
			me._settings('smart_attach', me._settings('smart_attach') == '1'?0:'1');
		 };

		//New smart select
		this.smart.__fillme = function(sFolder){
			var aData = {'*':getLang('COMMON::NO')};

			if (me._settings('smart_path')){
				var aPath = Path.split(me._settings('smart_path'));
				aData[aPath[0]+'/'+aPath[1]] = dataSet.get('folders', [aPath[0], aPath[1], 'NAME']) || aPath[1];
			}

			aData['+'] = getLang('SELECT_FOLDER::SELECT_FOLDER');
			this._fill(aData);
		};
		this.smart.__fillme();

		if (me._settings('smart_attach') == '1'){
			this.smart._value(me._settings('smart_path'));
		}
		else
			this.smart._value('*');

		this.smart._onchange = function(e) {
			switch(this._value()){
			case '*':
				me._settings('smart_attach', 0);
				break;

			case '+':
				var aPath = Path.split(me._settings('smart_path'));

				gui._create('select_folder', 'frm_select_folder', '', '', 'SELECT_FOLDER::SELECT_FOLDER', aPath[0], aPath[1], [function(sAccount, sFolder){
					if (sAccount && sFolder){
						me._settings('smart_path', sAccount+'/'+sFolder);
						me._settings('smart_attach', '1');

						if (me.body.select._value() == 'disabled' && me.attach._value()['attachments'].length>0 && me.body.select.__idTable['enabled'])
							me.body.select._value('enabled');

						me.smart.__fillme();
						me.smart._value(sAccount+'/'+sFolder);
					}
				}], true, true, 'F', 'i', true);

				this._value(me._settings('smart_attach')?me._settings('smart_path'):'*');
				break;

			default:
				me._settings('smart_attach', '1');

				if (me.body.select._value() == 'disabled' && me.attach._value()['attachments'].length>0 && me.body.select.__idTable['enabled'])
					me.body.select._value('enabled');
			}
		};

		this.__settings.on('VALUES', ['smart_attach'], function(v){
			this.smart._value(this._settings('smart_attach') == '1'?this._settings('smart_path'):'*', true);
			this.btn_smart._value(this._settings('smart_attach') == '1', true);
		}, this, true);

	}

	this.body._onkeydown = function(e){
		switch(e.keyCode){
		case 13:
			if (e.ctrlKey && !e.altKey){
				me.__send(false, false);
				return false;
			}
			break;
		case 83:
			if (e.ctrlKey && !e.altKey){
				me.__save();
				return false;
			}
			break;
		case 27:
			if (me._onclose && me._onclose()){
				me._destruct();
				return false;
			}
		}
	};
	if (!this._settings('sms')){
		this.body.__getSpellLang = function(){
			return me._settings('spellchecker') || GWOthers.getItem('MAIL_SETTINGS_DEFAULT','spellchecker');
		};
		//iframe focus
		this.body.__doc.onmousedown = function(){
			me._focus();
		};
	}

	// Load mail settings
	this._aMailSettingsGeneral = GWOthers.get('MAIL_SETTINGS_GENERAL','storage');

	/******************/

	if (sPrimaryAccountGW>0){
		var btn = function() {

			if (me.__bContactsOpened)
				return;

			if (this._name == 'btn_sms' || this._name == 'lbl_sms'){
				var aTabsNames = {'sms': "DATAGRID_ITEMS_VIEW::PHONE"},
					aTabsValues = {'sms': me.sms._value()};

				gui._create('add_address', 'frm_addaddress', '', '', [me, '_onPopupClose'], aTabsNames, aTabsValues, 'sms', false, ['L'], true);
			}
			else{
				if (me._settings('sms') == 1){
					var aTabsNames = {'cc': "DATAGRID_ITEMS_VIEW::CC", 'bcc': "DATAGRID_ITEMS_VIEW::BCC"},
						aTabsValues = {'cc': me.cc._value(), 'bcc': me.bcc._value()};
				}
				else{
					var aTabsNames = {'to': "DATAGRID_ITEMS_VIEW::TO", 'cc': "DATAGRID_ITEMS_VIEW::CC", 'bcc': "DATAGRID_ITEMS_VIEW::BCC"},
						aTabsValues = {'to': me.to._value(), 'cc': me.cc._value(), 'bcc': me.bcc._value()};
				}

				switch(this._name) {
				case 'btn_to':
				case 'lbl_to':
					gui._create('add_address', 'frm_addaddress', '', '', [me, '_onPopupClose'], aTabsNames, aTabsValues, 'to', true, false, true); me.__bContactsOpened = true;
					break;
				case 'btn_cc':
				case 'lbl_cc':
					gui._create('add_address', 'frm_addaddress', '', '', [me, '_onPopupClose'], aTabsNames, aTabsValues, 'cc', true, false, true); me.__bContactsOpened = true;
					break;
				case 'btn_bcc':
				case 'lbl_bcc':
					gui._create('add_address', 'frm_addaddress', '', '', [me, '_onPopupClose'], aTabsNames, aTabsValues, 'bcc', true, false, true); me.__bContactsOpened = true;
					break;
				}
			}
		};

		this.btn_sms && (this.btn_sms._onclick = btn);
		this.lbl_sms && (this.lbl_sms._onclick = btn);

		this.lbl_to && (this.lbl_to._onclick = btn);
		this.btn_to && (this.btn_to._onclick = btn);

		this.lbl_cc && (this.lbl_cc._onclick = btn);
		this.btn_cc && (this.btn_cc._onclick = btn);

		this.lbl_bcc && (this.lbl_bcc._onclick = btn);
		this.btn_bcc && (this.btn_bcc._onclick = btn);
	}

	// Custom Devel, External AB
	if (GWOthers.getItem('GLOBAL_SETTINGS','external_contacts')){
		var btn_ext = function (){

			try{
				if (me.__ext_ab && me.__ext_ab.closed === false)
					me.__ext_ab.close();
			}
			catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r);}

			if (!(me.__ext_ab = window.open(template.exe(GWOthers.getItem('GLOBAL_SETTINGS','external_contacts'),{"sid":dataSet.get('main',['sid']), "email":sPrimaryAccount}) + '&' + buildURL({o:me._pathName, btn:({btn_to_ext:'to',btn_cc_ext:'cc',btn_bcc_ext:'bcc',btn_sms_ext:'sms'})[this._name]}), 'external_contects','menubar=no,resizable=yes,status=no,location=no,width=300,height=300')))
				gui.notifier._value({type: 'alert', args: {header: '', text: 'ALERTS::POPUP_BLOCKER'}});
		};

		if (this.btn_to_ext)
			this.btn_to_ext._onclick = btn_ext;
		if (this.btn_cc_ext)
			this.btn_cc_ext._onclick = btn_ext;
		if (this.btn_bcc_ext)
			this.btn_bcc_ext._onclick = btn_ext;
	}

	////// SMS //////
	if (me._settings('sms')){

		this.sms._onsubmit = sendme;
       	this.smsinfo._value(getLang('COMPOSE::SMS_INFO',[0,0]));

		this.body._onkeyup = function(){

			var tmp = this._value(),
				c, bSmall = false;

			if (tmp)
				me._title(tmp.length>48?tmp.substr(0,48)+'...':tmp,true);
			else
				me._title('COMPOSE::SMS');

			for (var i = tmp.length-1;i>-1;i--){
				c = tmp.charCodeAt(i);
				if (c != 0xA4 && inArray(GSM0338_To_Unicode_Charset,c)<0){
					bSmall = true;
					break;
				}
			}

			var n = bSmall?70:160;
			if (tmp.length/n>1)
				n = bSmall?67:153;

			c = Math.ceil(tmp.length/n);
			me.smsinfo._value((c>5?'<b>':'') + getLang('COMPOSE::SMS_INFO',[tmp.length,c])+ (c>5?'</b>':''));
		};

		if (this.__message.sSMS!==true)
			this.sms._value(this.__message.sSMS);

		this._fullbody(this.__message.sBody);

		// update SMS characters counter
		this.body._onkeyup();
	}
	//HTML Mode switcher
	else{
		//call value before text-mode, to avoid nl2br conversion
		this._fullbody(this.__message.sBody, function() {

			if(~['Mozilla', 'Safari'].indexOf(currentBrowser())) {
				var doc = this.body._editor.el.ownerDocument;
				doc.getSelection().collapse(doc.body.firstChild);
			}

			if (oMessage) {
				if (oMessage.sTo && !oMessage.sSubject) {
					this.subject._focus();
				} else if (oMessage.sTo || (oMessage.sSMS && oMessage.sSMS!==true)) {
					this.body._focus(true, true);
				} else if (this.to) {
					this.to._focus();
				} else {
					this.sms._focus();
				}
			} else if (this.to) {
				this.to._focus();
			} else {
				this.sms._focus();
			}
		}.bind(this));

		if (GWOthers.getItem('RESTRICTIONS', 'disable_mailformat') == 1){
			if (this.__message.isHtml())
				this.body.select._fillLang({'enabled': "COMPOSE::HTML", 'code':'RICH::CODE'});
			else
				this.body.select._fillLang({'disabled': "COMPOSE::TEXT", 'code':'RICH::CODE'});
		}
		else
			this.body.select._fillLang({'enabled': "COMPOSE::HTML", 'disabled': "COMPOSE::TEXT", 'code':'RICH::CODE'});

		this.body.select._value(this.__message.isHtml() ? 'enabled' : 'disabled');

		//Copy subject into window title
		this.subject._onkeyup = function(){
			var sTitle = this._value();
			if (sTitle){
				if (sTitle.length>48)
					sTitle = sTitle.substr(0,48)+'...';
				if (me._settings('template'))
					sTitle += ' - ' + getLang('COMPOSE::TEMPLATE');

				me._title(sTitle,true);
			}
			else
			if (me._settings('template'))
				me._title('COMPOSE::TEMPLATE');
			else
				me._title('COMPOSE::NEWMAIL');
		};

		this.subject._onkeyup();
	}


	//Load Attachments
	if (this.attach && this.attach_control){

		//Show/Hide att list
		this.attach._onchange = function(){
			var att = this._value().attachments;

			if (att.length){
				addcss(me._main,'att_list');

				//Message size
				if (me.maxsize){
					var isize = 0;

					for(var i in att)
						if (att[i].size)
							isize += parseInt(att[i].size,10);

					var q = dataSet.get('main',['message_size']),
						u = ((isize + me.body._value().length)/1024) * 1.333;

					me.maxsize._range(q);
					me.maxsize._value(u);
					me.maxsize._title(Math.ceil((u/q)*100) + '%');
				}
			}
			else
				removecss(me._main,'att_list');
		};

		if (this.__message.aAttachments && this.__message.aAttachments.attachments.length){

			this.attach._value(this.__message.aAttachments);

			if (this._settings('smart_attach') && this.body.select.__idTable['enabled'] && this.body.select._value()!='enabled')
				this.body.select._value('enabled');
		}

		this.body.__oUpload = this.attach_control;

		this.attach_control._onuploadstart = function(){
			if (me.x_btn_send) me.x_btn_send._disabled(true);
			if (me.x_btn_save) me.x_btn_save._disabled(true);
			if (me.x_btn_att) me.x_btn_att._disabled(true);

			me._create('progress', 'obj_upload_info', 'progress', 'bottom');
		};

		this.attach_control._onuploadprogress = function(file, a, b, xhr){
			me.progress._value(file.name, a, b, [function(){xhr.abort()}]);
		};
		this.attach_control._onuploadsuccess = function(){
			me.progress && me.progress._handler(null);
		};

		this.attach_control._onuploadend = function(){

			if (me.__sa_support){

				if (Is.String(me._settings('smart_attach')) && me._settings('smart_attach').indexOf('#')==0){
					var att = me.attach._value().attachments,
						isize = 0;

					for(var i in att)
						if (att[i].size)
							isize += parseInt(att[i].size,10);

					if (isize>(me._settings('smart_attach').substr(1)*1024)){
						me._settings('smart_attach', '1');
						//addcss(me._main,'smart_attach');
					}
				}

				//Switch to HTML when SmartAttach
				if (me._settings('smart_attach') == '1' && me.body.select.__idTable['enabled'] && me.body.select._value() == 'disabled' && me.attach._value()['attachments'].length>0)
					me.body.select._value('enabled');
			}

			if (me.x_btn_send) me.x_btn_send._disabled(false);
			if (me.x_btn_save) me.x_btn_save._disabled(false);
			if (me.x_btn_att) me.x_btn_att._disabled(false);

			me.progress && me.progress._destruct();
		};

		this.attach_control._onremove = function(){
			if (me.x_btn_send) me.x_btn_send._disabled(false);
			if (me.x_btn_save) me.x_btn_save._disabled(false);
			if (me.x_btn_att) me.x_btn_att._disabled(false);
		};

		//Registr DropZone
		this.attach_control._dropzone(this.__eContainer, function(){
			return template.tmp('dropzone',{title:getLang('COMPOSE::DROP_TITLE'), body:getLang('COMPOSE::DROP_BODY')});
		}, 'item small', function(elm) {
			elm.querySelector('.info').style.marginTop = (this._getAnchor('main').querySelector('tr').clientHeight + this.body._main.querySelector('tr').clientHeight - elm.querySelector('.info').clientHeight) / 2 + 'px';
		}.bind(this));

		//progress bar
		// this.attach_control.file._info_progress = function(file,i){
		// 	console.warn(arguments);
		// 	//me._getAnchor('progress').style.width = i + '%';
		// };
		// this.attach_control.file._info_show = function(){
		// 	me._create('progress', 'obj_upload_info', 'progress', 'bottom');
		// 	//addcss(elm, 'show');
		// };
		// this.attach_control.file._info_hide = function(){
		// 	me.progress && me.progress._destruct();
		// 	//removecss(me._getAnchor('progress'), 'show');
		// };
	}

	this._onclose = function() {

		//onclose is called multiple times...
		if (me._destructed) return false;

		if (!me.__bDisableSave && (me.__changed() || (me.__removeOnDestruct && me.__message.__id))) {

			//to avoid propagation of ESC to the frm_confirm
			setTimeout(function(){
				//bring frm to front
				me._focus();

				//call save confirmation
				if (!dataSet.get('main',['sid'])){
					try{
						gui._create('frm_confirm','frm_confirm', '','', [me, '__confirmed'], 'CONFIRMATION::EXPIRED','CONFIRMATION::EXPIRED_MSG');
					}
					catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r);}
				}
				else
				if (!me.cdialog || me.cdialog._destructed){
					me.cdialog = gui._create('frm_confirm','frm_confirm_threestates', '','', [me, '__confirmed'], 'CONFIRMATION::SAVE_TITLE','CONFIRMATION::SAVE_CONFIRMATION', '','CONFIRMATION::SAVE','FORM_BUTTONS::CANCEL','CONFIRMATION::DISCARD');
					me.cdialog._size(450,200,true);

					addcss(me.cdialog.x_btn_ok._main,'color1');

					me.cdialog.x_btn_cancel._onclick = function() {
						this._parent._destruct();
					};

					addcss(me.cdialog.x_btn_cancel2._main,'trash color2 x_btn_right');
					me.cdialog.x_btn_cancel2._onclick = function() {
						executeCallbackFunction([me, '__confirmed'], false);
						me._destruct();
					};
				}
				else
					me.cdialog._focus();

			},0);

			return false;
		}
		else
			return true;
	};

	this._bAutoSave = parseInt(this._aMailSettingsGeneral['VALUES']['autosave']);
	this._nAutoSaveInterval = parseInt(this._aMailSettingsGeneral['VALUES']['autosave_minutes'])*60000;

	if (this._bAutoSave && this._nAutoSaveInterval)
		this.__saveTimer = setTimeout(function(){
			try{
				this.__autoSave();
			}
			catch(e){gui._REQUEST_VARS.debug && console.log(this._name||false,e);}
		}.bind(this), this._nAutoSaveInterval);

	this._add_destructor('__onDestruct');

	if (oMessage){
		if (oMessage.sTo && !oMessage.sSubject)
			this.subject._focus();
		else
		if (oMessage.sTo || (oMessage.sSMS && oMessage.sSMS!==true))
			this.body._focus(true, true);
		else
		if (this.to)
			this.to._focus();
		else
			this.sms._focus();
	}
	else
	if (this.to)
		this.to._focus();
	else
		this.sms._focus();

	//Drop Image to richtext
	if (window.FormData && !this._settings('sms')){
		this.body.__doc.addEventListener("paste", function(e){
			if (!me.attach_control.file.__ondropfile){
				return;
			}
			var items = (e.clipboardData || (e.originalEvent || {}).clipboardData || {}).items || (window.clipboardData || {}).files || [];
			if([].some.call(items, function(item) {
				return item.type === 'text/html';
			})) {
				return true;
			}
			for (var i = 0; i < items.length; i++) {
				if (items[i].getAsFile && items[i].type.indexOf('image') === 0) {
					var file = items[i].getAsFile();
					try {
						file = new File([file], 'clipboard-' + new IcewarpDate() + '.png', {
							type: items[i].type
						});
					} catch(e) {}
					me.attach_control.file.__ondropfile([file],[me,'__richImage',[[e.rangeParent,e.rangeOffset]]]);
				}
			}
		}, false);

		this.body.__doc.addEventListener("drop", function(e){

			e.stopPropagation();
			e.cancelBubble=true;

			if (e.dataTransfer.files.length>0){
				e.preventDefault();
				if (me.attach_control.file.__ondropfile){

					//check for already uploaded images
					for (var b,files = [],i = 0;i<e.dataTransfer.files.length;i++){
						b = false;

						if (e.dataTransfer.files[i].type.toLowerCase().indexOf('image/') === 0){
							for (var j in me.attach.__idtable){
								if (e.dataTransfer.files[i].name == me.attach.__idtable[j].name && e.dataTransfer.files[i].size == me.attach.__idtable[j].size){
									b = true;
									me.__richImage(me.attach.__idtable[j],e.dataTransfer.files[i].type,{},[e.rangeParent,e.rangeOffset]);
									break;
								}
							}
						}

						if (!b)
							files.push(e.dataTransfer.files[i]);
					}

					if (files.length)
						me.attach_control.file.__ondropfile(files,[me,'__richImage',[[e.rangeParent,e.rangeOffset]]]);
				}

				return false;
			}
		}, false);
	}


	// Footer
	if (me.x_btn_send){

		this.x_btn_send._onclick = function(){
			me.__send(false, false, false, false, GWOthers.getItem('MAIL_SETTINGS_DEFAULT','send_undo') != '1');
		};

		this.x_btn_send._menu(function(){

			var arr = [];

			arr.push(
				{
					title: 'COMPOSE::SEND_NOW',
					arg: [
						function(){
							//disable deferred delay
							if (me._settings('deferred'))
								me._delay_toggle();

							me.__send(false, false, void 0, void 0, true);
						}
					]
				}
			);

			if (disabled.allow_delaying) {
				arr.push(
					{
						title: 'COMPOSE::SEND_WITH_DELAY',
						arg: [function() {me._delay_toggle()}]
					}
				);
			}

			arr.push(
				{
					title: 'COMPOSE::SAVEINFO',
					arg: [function() { me.__save() }]
				}
			);

			if (sPrimaryAccountCHAT && me.teamchat){
				arr.push({title:'COMPOSE::SENDTCHAT', arg:[function(){ //disabled:!me.teamchat._value()
					if (me.teamchat._value()){
						if (!me.__bDisableSave)
							me.__send(2, true);
					}
					//pop folder select
					else{
						me.lbl_chat._onclick(null, [function(){
							if (!me.__bDisableSave && me.teamchat._value())
								me.__send(2, true);
						}]);
					}
				}]});
			}

			return arr;
		}, 'compose_send_menu');
	}

	if (this.x_btn_save)
		this.x_btn_save._onclick = function(){
			me.__save();
		};

	if (this.x_btn_confirm){
		this.x_btn_confirm._onclick = function(){
			me._options_toggle('read_confirmation');
			//me._settings('read_confirmation', me._settings('read_confirmation') == '1'?'0':'1');
		};

		this.__settings.on('VALUES', ['read_confirmation'], function(v){
			window[v == '1'?'addcss':'removecss'](this._main, 'show');
		}, this.x_btn_confirm, true);
	}

	if (this.x_btn_delivery){
		this.x_btn_delivery._onclick = function(){
			me._options_toggle('delivery');
			//me._settings('delivery', me._settings('delivery') == '1'?'0':'1');
		};

		this.__settings.on('VALUES', ['delivery'], function(v){
			window[v == '1'?'addcss':'removecss'](this._main, 'show');
		}, this.x_btn_delivery, true);
	}

	if (this.x_btn_encrypt){
		this.x_btn_encrypt._onclick = function(){
			me._options_toggle('encrypt');
			//me._settings('encrypt', me._settings('encrypt') == '1'?'0':'1');
		};

		this.__settings.on('VALUES', ['encrypt'], function(v){
			window[v == '1'?'addcss':'removecss'](this._main, 'show');
		}, this.x_btn_encrypt, true);
	}

	if (this.x_btn_sign){
		this.x_btn_sign._onclick = function(){
			me._options_toggle('sign');
			//me._settings('sign', me._settings('sign') == '1'?'0':'1');
		};

		this.__settings.on('VALUES', ['sign'], function(v){
			window[v == '1'?'addcss':'removecss'](this._main, 'show');
		}, this.x_btn_sign, true);
	}

	if (this.x_btn_smart){
		this.x_btn_smart._onclick = function(){
			me._options_toggle('smart');
		};

		this.__settings.on('VALUES', ['smart_attach'], function(v){
			window[v == '1'?'addcss':'removecss'](this._main, 'show');
		}, this.x_btn_smart, true);
	}

	if (this.x_btn_priority){
		this.x_btn_priority._onclick = function(e){
			if (!this.cmenu || this.cmenu._destructed){
				e.stopPropagation && e.stopPropagation();
				this.__eArrow.onclick({});
			}
		};
		this.x_btn_priority._main.onmousedown = function(e){
		 	if (this.cmenu && !this.cmenu._destructed){
				var e = e || window.event;
		 		if (e.stopPropagation) e.stopPropagation();
		 	}
		}.bind(this.x_btn_priority);

		this.x_btn_priority._menu(function(){
			var arr = [
				{
					title: 'EMAIL_PRIORITY::HIGH',
					css:'ico2 high',
					arg: [me, '_setPriority', [2]]
				},
				{
					title: 'EMAIL_PRIORITY::NORMAL',
					css:'ico2 normal',
					arg: [me, '_setPriority', [3]]
				},
				{
					title: 'EMAIL_PRIORITY::LOW',
					css:'ico2 low',
					arg: [me, '_setPriority', [4]]
				}
			];

			return arr;
		}, 'compose_priority_menu');

		this.__settings.on('VALUES', ['priority'], function(v){
			this._main.setAttribute('iw-priority', ({1:'high', 2:'high', 3:'', 4:'low', 5:'low'})[v]);
			this._title(getLang('SETTINGS::PRIORITY') + ' - ' + getLang(({1:'EMAIL_PRIORITY::HIGH', 2:'EMAIL_PRIORITY::HIGH', 3:'EMAIL_PRIORITY::NORMAL', 4:'EMAIL_PRIORITY::LOW', 5:'EMAIL_PRIORITY::LOW'})[v]), true);
		}, this.x_btn_priority, true);
	}


	//Options
	if (this.x_btn_options) {
		this.x_btn_options._onclick = function(){
			me._options_toggle();
		};

		if (this.read_confirmation){
			this.read_confirmation._onchange = function(){
				this._settings('read_confirmation', this.read_confirmation._value()?'1':'0');
			}.bind(this);

			this.__settings.on('VALUES','read_confirmation',function(v){
				this._value(v);
			}, this.read_confirmation);
		}

		if (this.sign){
			this.sign._onchange = function(){
				this._settings('sign', this.sign._value().toString());
			}.bind(this);

			this.__settings.on('VALUES','sign',function(v){
				this._value(v);
			}, this.sign);
		}

		if (this.encrypt){
			this.encrypt._onchange = function(){
				this._settings('encrypt', this.encrypt._value().toString());
			}.bind(this);

			this.__settings.on('VALUES','encrypt',function(v){
				this._value(v);
			}, this.encrypt);
		}
	}

	setTimeout(function() {
		if (!this.__message || !this.__message.ask_on_close)
			this.__rememberState();
	}.bind(this), 200);

	[].forEach.call(this._main.querySelectorAll('.toggle'), function(el) {
		el.addEventListener('click', function(e) {
			//me._layout_maximize();
			var toggle = e.target.getAttribute('data-toggle'),
				elm = me._main.querySelector('div.' + toggle);

			if (elm.classList.contains('extended')) {
				elm.classList.remove('extended');

				if (toggle == 'chat_message')
					addcss(me._main.querySelector('div.toggle.teamchat'),'nodot');

			} else {
				elm.classList.add('extended');

				if (toggle == 'chat_message')
					removecss(me._main.querySelector('div.toggle.teamchat'),'nodot');
			}

			if (toggle == 'chat_message' && me.teamchat_message._disabled() == false)
				me.teamchat_message._focus();
		});
	});

	//Maximize on Headers
	[(this.to || this.sms), this.cc, this.bcc, this.teamchat].forEach(function(obj){
		if (obj){
			obj._main.addEventListener('click', function(e) {
				me._layout_maximize();
			});
			obj._main.addEventListener('keyup', function(e) {
				me._layout_maximize();
			});
		}
	});

	//Minimize on Body
	var eBodyElm = this._settings('sms')?gui.frm_compose.body._getFocusElement():this.body.__doc;
	eBodyElm.addEventListener('keyup', function(e) {
		me._layout_minimize();
	});
	eBodyElm.addEventListener('click', function(e) {
		me._layout_minimize();
	});
};

_me._options_toggle = function(){

	// Hide extended options
	if (hascss(this.x_btn_options._main,'active')) {
		removecss(this._getAnchor('options'),'show');
		removecss(this.x_btn_options._main,'active');
		removecss(this._main, 'mask_option');
	}
	//fill with current values
	else {

		addcss(this._main, 'mask_option');

		var aInitValues = this._settings();

		if (this.read_confirmation){
			this.read_confirmation._value(aInitValues['read_confirmation']);
		}
		if (this.encrypt) {
			this.encrypt._value(aInitValues['encrypt']);
		}
		if (this.sign) {
			this.sign._value(aInitValues['sign']);
		}

		if (this.reply_to_address){
			this.reply_to_address._value(aInitValues['reply_to_address']);
			this.reply_to_address._placeholder(sPrimaryAccount);
		}

		//connect mode select from richedit
		this.mode_select._fill(this.body.select.__idTable);

		if (!GWOthers.getItemAccess('MAIL_SETTINGS_DEFAULT','html_message') && '0' === GWOthers.getItem('MAIL_SETTINGS_DEFAULT','html_message')) {
			this.mode_select._value('disabled');
		}

		this.mode_select._onchange = function(){
			this.body.select._value(this.mode_select._value());
		}.bind(this);
		this.body.select._onchange = function(){
			this.mode_select._value(this.body.select._value(), true);
		}.bind(this);
		this.body.select._onchange();

		//POZOR
		if (aInitValues['save_sent_message'] == 1)
			this.sent._value(aInitValues['sent'] || GWOthers.getItem('DEFAULT_FOLDERS','sent'));
		else
			this.sent._value('*');

		//this.priority._value(aInitValues['priority']);
		this.spellchecker._value(aInitValues['spellchecker'] || GWOthers.getItem('MAIL_SETTINGS_DEFAULT','spellchecker'));

		//Close X
		this._getAnchor('close_options').onclick = function(){
			this._options_toggle();
		}.bind(this);

		// Display extended options
		addcss(this._getAnchor('options'),'show');
		addcss(this.x_btn_options._main,'active');
	}

};

_me._delay_toggle = function(){
	if (hascss(this._getAnchor('delay'),'show')){
		removecss(this._getAnchor('delay'),'show');
		removecss(this._main, 'mask_delay');
		this.x_btn_send._value('COMPOSE::SEND');
		delete(this.__message.sDeferred);
		this._settings('deferred', 0);
	}
	else{
		// Hide Options
		if (hascss(this.x_btn_options._main,'active'))
			this._options_toggle();

		addcss(this._main, 'mask_delay');

		// Set send time with delay from settings if not already changed
		if (!this.__fixed_delay) {

			var d = new IcewarpDate();

			if (this.__delay){
				d.add(this.__delay, 'minutes');
			}
			else{
				if (d.minute()<30){
					d.minute(30);
				}
				else{
					d.minute(0);
					d.add(1, 'hours');
				}
			}

			this.delay_time._value((d.hour()*60+d.minute())*60000,true);
			this.delay_date._value(d.format(IcewarpDate.JULIAN));
		}

		//Close X
		this._getAnchor('close_delay').onclick = function(){
			this._delay_toggle();
		}.bind(this);

		// Display delay details
		addcss(this._getAnchor('delay'),'show');
		this.x_btn_send._value('COMPOSE::SEND_WITH_DELAY');
		this._settings('deferred', 1);
	}
};

_me._settings = function(key, val){

	if (Is.String(key))
		key = [key];

	if (Is.Defined(val)){
		this.__settings.add('VALUES', key, val);
		return val;
	}
	else
		return this.__settings.get('VALUES', key);
};

_me._layout_minimize = function(e) {
	addcss(this._main, 'minimize');

	this.__options.max = false;

	var a = [];

	if (GWOthers.getItem('MAIL_SETTINGS_DEFAULT','show_from')!=1)
		a.push(this._main.querySelector('div.box.from'));

	// //show To + Filled
	// if (Cookie.get(['compose_small']) === '1'){

	// 	//change To.placeholder

	// 	a.push(this._main.querySelector('div.box.cc'));
	// 	a.push(this._main.querySelector('div.box.bcc'));
	// 	a.push(this._main.querySelector('div.box.chat'));
	// 	a.push(this._main.querySelector('div.box.chat_message'));
	// 	a.push(this._main.querySelector('div.box.subject'));

	// }
	// else{

		if (!this.cc._value())
			a.push(this._main.querySelector('div.box.cc'));
		if (!this.bcc._value())
			a.push(this._main.querySelector('div.box.bcc'));

		if (this.teamchat && !this.teamchat._value())
			a.push(this._main.querySelector('div.box.chat'));

		if (this.teamchat_message/* && !this.teamchat_message._value()*/){
			a.push(this._main.querySelector('div.box.chat_message'));
			removecss(this._main.querySelector('div.toggle.teamchat'),'nodot');
		}

		//a.push(this._main.querySelector('div.box.subject'));


	//execute
	a.forEach(function(elm){ addcss(elm, 'extended') });
};

_me._layout_maximize = function(bFull) {
	removecss(this._main, 'minimize');

	var a = [];
	//var bSmall = Cookie.get(['compose_small']) === '1';

	if (bFull){
		this.__options.max = true;
		a.push(this._main.querySelector('div.box.from'));
	}

	if (bFull /*|| this.__options.cc*/ || this.cc._value())
		a.push(this._main.querySelector('div.box.cc'));
	if (bFull /*|| this.__options.bcc*/ || this.bcc._value())
		a.push(this._main.querySelector('div.box.bcc'));

	if (this.teamchat && (bFull || this.teamchat._value())){
		a.push(this._main.querySelector('div.box.chat'));

		if (this.teamchat_message._value() && (bFull/* || this.__options.chat_message*/)){
			a.push(this._main.querySelector('div.box.chat_message'));
			addcss(this._main.querySelector('div.toggle.teamchat'),'nodot');
		}
	}

	//a.push(this._main.querySelector('div.box.subject'));

	//execute
	a.forEach(function(elm){ removecss(elm, 'extended') });
};

_me._setPriority = function (no){
	this._settings('priority', no);
	// if (this.priority){
	// 	this.priority._value(no,true);
//		this.body._getAnchor('priority').className = 'ico icopriority ' + {1:'high',2:'high',3:'normal',4:'low',5:'low'}[no];
//		this.priority._value(no);
	// }
};

_me._getSignature = function(id){
	var id = id || '0',
		aSign = dataSet.get('storage',['SIGNATURE','ITEMS']),
		signature = '';

	if (id != '*')
		for (var i in aSign)
			if ((aSign[i].VALUES.ID && aSign[i].VALUES.ID.VALUE == id) || (id == '0' && !aSign[i].VALUES.ID)){
				if (aSign[i].VALUES.TEXT){
					signature = aSign[i].VALUES.TEXT.VALUE;

					//convert old signature
					if (signature.indexOf('<')<0)
						signature = signature.replace(/(\r\n)|(\n)/gm,'<br>');

					//signature = NewMessage.linkFix((GWOthers.getItem('MAIL_SETTINGS_DEFAULT', 'sign_separator')>0?'<div class="separator">-- </div>':'') + signature);
					signature = (GWOthers.getItem('MAIL_SETTINGS_DEFAULT', 'sign_separator')>0?'<div class="separator">-- </div>':'') + signature;
				}
				break;
			}

	return 	signature;
};

// translate HTML via Froala engine (some cleanup is performed there)
_me.__translateHTML = function (sHTML){
	return mkElement('div',{innerHTML:this.body.__exec('clean.html', [sHTML, true], true)}, this.body.__doc).innerHTML.trim();
};

_me._addSignature = function (id){

	var signature = this._getSignature(id),
		elm = this.body.__doc.querySelector('div.iw-signature'),
		bFound = false;

	if (elm){
		if (Is.Defined(this.__message.signatureID)){

			var rx = /[\r\n]+|(<br>|&nbsp;)+$/g,
				old = this.__translateHTML(this._getSignature(this.__message.signatureID)).replace(rx, ''),
				act = this.__translateHTML(elm.innerHTML).replace(rx, ''),
				p;

			//textContent metch because of Froala's code processing (can be switched back to act == old after 2.8.7)
			if (mkElement('div', {innerHTML:act}).textContent.replace(/\s+/g,'') == mkElement('div', {innerHTML:old}).textContent.replace(/\s+/g,'')){
				bFound = true;
				elm.innerHTML = this.__translateHTML(signature);
			}
			else
			if ((p = act.lastIndexOf(old))>-1){

				removecss(elm, 'iw-signature');

				if (signature.length){
					bFound = true;
					elm.innerHTML = this.__translateHTML(act.substr(0,p) + '<div class="iw-signature">' + signature + '</div>' + act.substr(p+old.length));
				}
			}
			//Remove all class="signature"
			else{
				elm = null;
			}
		}
		else{
			bFound = true;
			elm.innerHTML = this.__translateHTML(signature); // + '&nbsp;'
		}
	}

	//signature cleanup
	[].forEach.call(this.body.__doc.querySelectorAll('div.iw-signature'), function(div){
		if (div !== elm)
			removecss(div, 'iw-signature');
	});

	//detect <block style=""><br></block>
	function isCRLF (node){
		return node.childNodes.length === 1 && node.childNodes[0].tagName == 'BR';
	};

	//Blank signature, remove <div class="iw-signature">
	if (signature.length == 0){
		if (bFound && elm && elm.parentNode){

			//Remove surrounding newlines
			var tmp;
			if ((tmp = elm.previousElementSibling) && isCRLF(tmp))
				tmp.parentNode.removeChild(tmp);

			if ((tmp = elm.previousElementSibling) && isCRLF(tmp))
				tmp.parentNode.removeChild(tmp);

			if ((tmp = elm.nextElementSibling) && isCRLF(tmp) && (!tmp.nextElementSibling || !hascss(tmp.nextElementSibling, 'iw-reply-block')))
				tmp.parentNode.removeChild(tmp);

			//remove signature
			elm.parentNode.removeChild(elm);
		}
	}
	else
	if (!bFound){

		var quote = this.body.__doc.body.querySelector('div.iw-reply-block');

		//Insert Signature before Quoted message
		if (quote){
			var tmp;
			if ((tmp = quote.previousElementSibling) && isCRLF(tmp))
				tmp.insertAdjacentHTML('beforebegin', NewMessage.crlf + NewMessage.crlf + '<div class="iw-signature">'+ signature +'</div>'); //'&nbsp;</div>'
			else
				quote.insertAdjacentHTML('beforebegin', NewMessage.crlf + NewMessage.crlf + '<div class="iw-signature">'+ signature +'</div>' + NewMessage.crlf);
		}
		//Insert Signature at the bottom
		else
			this.body.__doc.body.insertAdjacentHTML('beforeend', NewMessage.crlf + NewMessage.crlf + '<div class="iw-signature">'+ signature +'</div>');
	}

	this.__message.signatureID = id;

	this.body._editor.size.syncIframe();
	this.body._focus();
};

/**
 * add uploaded image into richaread in HTML mode
 **/
_me.__richImage = function(aResponse,aFile,idtable,pos){
	if (aFile && aFile.type && aFile.type.toLowerCase().indexOf('image/') === 0 && aResponse.folder && aResponse.id){

		// Add "removed" flag to attach.__idtable to make it invisible on attachment list
		idtable.removed = true;

		//	- set cursor position is not possible for Chrome 12
		try{
			this.body._focus(true);
			if (pos[0]){
				var r = this.body.__eFrame.contentWindow.getSelection().getRangeAt(0);
		 			r.setStart(pos[0],pos[1]);
		 			r.setEnd(pos[0],pos[1]); //+1
	 		}
		}catch(err){gui._REQUEST_VARS.debug && console.log(this._name||false,err)}

		var src = 'server/download.php?'+ buildURL({'sid': dataSet.get('main', ['sid']), 'class': 'file', 'fullpath': aResponse.folder+'/'+aResponse.id});
		var id = +new Date();
		var sHTML = '<img id="' + id + '" src="' + src + '" border="0">';
		this.body.__exec('html.insert', [sHTML, true]);

		if (this.body.select.__idTable['enabled'])
			this.body.select._value('enabled');

		var image = this.body.__doc.getElementById(id);
		image && image.addEventListener('load', function(e) {
			this.body.__img_removeEdit();
		}.bind(this));
	}
};

_me.__genSignature = function() {
	//Signature select
	var out = [],
		aTmp = dataSet.get('storage',['SIGNATURE','ITEMS']);

	for (var i in aTmp)
		if (aTmp[i].VALUES.ID && aTmp[i].VALUES.NAME)
			out.push({text:aTmp[i].VALUES.NAME.VALUE, handler:[this,'_addSignature','',aTmp[i].VALUES.ID.VALUE], css:'ico2'+ (this.__message.signatureID == aTmp[i].VALUES.ID.VALUE?' check':'')});

	if (out.length){
		out.push(
			{title:'-'},
			{title:'SETTINGS::DEFAULT', handler:[this,'_addSignature','','0'], css:'ico2'+(!this.__message.signatureID || this.__message.signatureID == '0'?' check':'')},
			{title:'SIGNATURE::NONE', handler:[this,'_addSignature','','*'], css:'ico2'+(this.__message.signatureID == '*'?' check':'')}
		);
		return out;
	}
	else
		return false;
};

_me.__onDestruct = function() {

	this.__saveTimer && clearTimeout(this.__saveTimer);

	if (this.__removeOnDestruct && this.__message.__id && this.__message.__id[2])
		Item.remove(makeIDSFromID(this.__message.__id), true);

	//Unlock TeamChat Item
	if (this.__message.__id_chat && this.__message.__id_chat[2])
		Item.set_lock(this.__message.__id_chat, false, false,'','M');

	this.__message.dispose();

	//Custom devel, external AB
	try{
		if (this.__ext_ab && this.__ext_ab.closed === false)
			this.__ext_ab.close();
	}
	catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r);}
};

_me.__autoSave = function() {
	if (this._destructed)
		return;

	if (!this.__bDisableSave && this.__changed())
		this.__save(true);

	this.__saveTimer && clearTimeout(this.__saveTimer);
	this.__saveTimer = setTimeout(function(){
		this.__autoSave && this.__autoSave();
	}.bind(this), this._nAutoSaveInterval);
};

_me.__rememberState = function() {

	if (this.to)
		this.__sSavedTo = this.to._value();
	else
		this.__sSavedSMS = this.sms._value();

	this.__sSavedCc = this.cc._value();
	this.__sSavedBcc = this.bcc._value();
	this.__sSavedSubject = this.subject._value();

	this.__sSavedAtt = [];
	if (this.__message.aAttachments){
		var tmp = this.__message.aAttachments.attachments;
		for (var i in tmp)
			this.__sSavedAtt.push(tmp[i].values || tmp[i]);
	}

	if (this.teamchat){
		this.__sSavedChat = this.teamchat._value();
		this.__sSavedComment = this.teamchat_message._value();
	}

	this.__sSavedBody = this.body._value();
};

_me.__changed = function() {
	try{
		if (this.attach){
			var att = this.attach._value();
			if (att && (att = att.attachments) && !arrayCompare(att,this.__sSavedAtt))
				return true;
		}

		if (this._settings('sms')){
			if (this.__sSavedSMS != this.sms._value())
			 	return true;
		}
		else
		if (this.__sSavedTo != this.to._value())
			return true;

		if (this.teamchat){
			if (this.__sSavedChat != this.teamchat._value() || this.__sSavedComment != this.teamchat_message._value())
				return true;
		}

		return this.__sSavedCc != this.cc._value() || this.__sSavedBcc != this.bcc._value() || this.__sSavedSubject != this.subject._value() || this.__sSavedBody != this.body._value();
	}
	catch(e){
		console && console.log('compose.__changed', e);
		return !this._destructed;
	}
};

_me.__confirmed = function(bSave) {
	if (bSave)
		this.__save();

	this.__bDisableSave = true;
	this._destruct();

	//we need to call confirms in all opened compose windows before logout
	if (this.__logoutOnDestruct && gui.frm_main)
		gui.frm_main.__logout();
};

_me.__send = function(bSave, bKeepAttachments, bAutoSave, bSubject, bSendNow, aResponse) {
	if (this.__bDisableSand) return;

	var aSettings = this.__settings.get('VALUES','',true),
		sRCP = '';

	if (aSettings.sms)
		sRCP = this.__message.sSMS = this.sms._value();
	else{

		//Check for blank Subject
		if (!bSave && !bSubject && !this.subject._value() && aSettings.check_subject>0){
			var me = this,
				frm = gui._create('subject','frm_confirm','','','','COMPOSE::NEWMAIL','COMPOSE::SUBJECT_EMPTY');
			frm.x_btn_ok._onclick = function (){
				me.__send(false, bKeepAttachments, bAutoSave, true, bSendNow);
				this._parent._destruct();
			};
			frm.x_btn_cancel._onclick = function(){
				me.subject._focus();
				this._parent._destruct();
			};

			return;
		}

		//Personality Alias
		var sAlias = getPrimaryAccountFromAddress();
		if (GWOthers.getItem('RESTRICTIONS', 'disable_personalities')!=1 && this.from)
			if (this.from.__idTable[this.from._value()])
				sAlias = this.from.__idTable[this.from._value()][1];
			else
				sAlias = getPrimaryAccountFromAddress();

		//Check for Certificate (sign)
		if (aSettings.sign == '1'){

			var tmp, bValid = false, aEA = [], sEA = '',
				sAliasMail = MailAddress.splitEmailsAndNames(sAlias)[0].email.toLowerCase(),
				aCert = dataSet.get('storage',['CERTIFICATE','ITEMS']);

			if (Is.Object(aCert))
				for(var i in aCert)
					if (aCert[i].VALUES && aCert[i].VALUES.INFO && aCert[i].VALUES.INFO.VALUE){
						tmp = XMLTools.Str2Arr(aCert[i].VALUES.INFO.VALUE).INFO[0];

						//Extension
						if (tmp.SUBJECTALTNAME && tmp.SUBJECTALTNAME[0].VALUE)
							aEA = MailAddress.splitEmailsAndNames(tmp.SUBJECTALTNAME[0].VALUE);
						else
						//SUBJECT (backup)
						if (tmp.SUBJECT && tmp.SUBJECT[0].EMAILADDRESS && tmp.SUBJECT[0].EMAILADDRESS[0].VALUE)
							aEA = MailAddress.splitEmailsAndNames(tmp.SUBJECT[0].EMAILADDRESS[0].VALUE);
						else
							continue;

						//Check
						for (var j in aEA)
							if (aEA[j].email){
								sEA = aEA[j].email.toLowerCase();

								//Check for validity
								if (sEA == sAliasMail){
									if (tmp.VALIDTO && tmp.VALIDTO[0].VALUE && IcewarpDate.utct(tmp.VALIDTO[0].VALUE)<(new IcewarpDate()))
										continue;

									bValid = true;
									break;
								}
							}
		  			}


		  	if (!bValid){

				if (bSave)
					aSettings.sign = 0;
				else{
					var me = this,
						frm = gui._create('cert','frm_confirm','','','','COMPOSE::SIGN','COMPOSE::NOSIGN');
					addcss(frm.x_btn_ok._main,'send');
					frm.x_btn_ok._value('COMPOSE::SEND');
					frm.x_btn_ok._onclick = function (){
						me._settings('sign', 0);
						me.__send(bSave, bKeepAttachments, bAutoSave, bSubject, bSendNow);
						this._parent._destruct();
					};
					frm.x_btn_cancel._onclick = function(){
						me.subject._focus();
						this._parent._destruct();
					};

					return;
				}
		  	}
		}

		aSettings.from = sAlias;
		var value = this.body.select._value();
		this.__message.setHtml((value === 'enabled' || value === 'code') ? true : false);
	}

	if (this.to)
		sRCP += this.__message.sTo = this.to._value();

	sRCP += this.__message.sCc = this.cc._value();
	sRCP += this.__message.sBcc = this.bcc._value();

	if (!bSave && !sRCP.trim().length){
		var me = this,
			frm = gui._create('recipient','frm_confirm','','','','COMPOSE::NEWMAIL','COMPOSE::RCP_EMPTY');
		frm.x_btn_ok._onclick = function (){
			if (me._settings('sms'))
				me.sms._focus();
			else
				me.to._focus();
			this._parent._destruct();
		};
		addcss(frm.x_btn_ok._main,'color2');
		return;
	}

	if (this.teamchat){
		this.__message.sTeamchat = this.teamchat._value().replace(/^\[(.+)\]$/g,'$1');
		this.__message.sComment = this.teamchat_message._value();
	}

	// If delayed sending
	if (this._settings('deferred') === 1) {
		bSendNow = true;

		if (this.__delay && !this.__fixed_delay) {
			var d = new IcewarpDate(new Date, {locale: 'en'});
			d.add(this.__delay, 'minutes');
		}
		else{
			var now = new IcewarpDate(new Date(), {locale: 'en'});
			var d = IcewarpDate.julian(this.delay_date._value(), this.delay_time._value()/60000, {locale: 'en'});

			if (d.isBefore(now))
				d = now;
		}

		this.__message.sDeferred = d.format('rfc2822');
	} else {
		delete this.__message.sDeferred;
	}

	this.__bDisableSave = true;
	this.__bDisableSand = true;

	this.__message.sSubject = this.subject._value();

	this.__message.sBody = this._fullbody();

	if (this.attach)
		this.__message.aAttachments = this.attach._value();



	// Check for Certificate
	/*
	var tmp,
		aCert = dataSet.get('storage',['CERTIFICATE','ITEMS']);

	if (Is.Object(aCert))
		for(var i in aCert)
			if (aCert[i].VALUES && aCert[i].VALUES.INFO && aCert[i].VALUES.INFO.VALUE){
				tmp = XMLTools.Str2Arr(aCert[i].VALUES.INFO.VALUE).INFO[0];
				if (tmp.VALIDTO[0].VALUE && IcewarpDate.utct(tmp.VALIDTO[0].VALUE)>new IcewarpDate()){
					this.__cert_support = true;
					break;
				}
  			}
	*/

	if (bSave) {

		//this.__message.sBody = this.body._value();

		if ((bSave == 2 && !this.__message.sTeamchat) || !this.__message.save(bKeepAttachments, [this, '__messageSaved',[bAutoSave, aResponse, bSave == 2]], aSettings, bSave == 2)){
			this.__errorAlert('ALERTS::MESSAGE_NOT_SAVED');
			this.__bDisableSave = false;
			this.__bDisableSand = false;
			return;
		}
		else
		if (!bAutoSave && (this._settings('template') || bSave == 2))
			this.__hide();

	}
	else{
		if (aSettings.read_confirmation == 2){ // Note: this option is not currently used

			this.__bDisableSand = false;

			var me = this,
				frm = gui._create('read_confirm','frm_confirm','','',null,'CONFIRMATION::CREATE_READING_CONFIRMATION_TITLE','CONFIRMATION::SEND_READING_CONFIRMATION');

			frm.x_btn_ok._value('COMMON::YES');
			frm.x_btn_ok._onclick = function(){
				this._disabled(true);
				this._parent._destruct();

				executeCallbackFunction([me,'__rconfirm',[true]]);
			};
			frm.x_btn_cancel._value('COMMON::NO');
			frm.x_btn_cancel._onclick = function(){
				this._disabled(true);
				this._parent._destruct();

				executeCallbackFunction([me,'__rconfirm',[false]]);
			};

			return;
		}

		if (this.body._nightMode && this.body._nightMode.active) {
			this.body._nightMode.reset();
		}

		//this.__message.sBody = this._fullbody();

		if (bSendNow) {
			if (this.__message.send(bKeepAttachments, [this, '__messageSent'], aSettings)) {
				this.__hide();
				return true;
			}
		} else {
			this.__bDisableSand = false;

			this.__hide();

			//Do not Save for fw. msg from Drafts
			// if (this.__message_old && this.__message_old.__id && GWOthers.getItem('DEFAULT_FOLDERS', 'drafts') == [this.__message_old[0],this.__message_old[1]].join('/')){
			// 	this.__sendNotify(aSettings);
			// }
			// else

			//Save to Drafts before Send
			this.__send(true, true, true, false, false, [function(bOK){

				if (bOK){

					//Load Attachments from Draft for fw. message
					if (this.__message.aAttachments && this.__message_old && this.__message_old.__id && (this.__message_old.hasAttachments() || this.__message_old.hasEmbeddedAttachments())){

						//Load Draft
						WMItems.list({aid:this.__message.__id[0], fid:this.__message.__id[1], iid:this.__message.__id[2], values:['HAS_ATTACHMENT','HAS_EMBEDDED_ATTACHMENT','ATTACHMENTS','HTML']},'','','',[
							function(aData){

								//Copy Attachments
								if (aData && (aData = aData[this.__message.__id[0]]) && (aData = aData[this.__message.__id[1]]) && (aData = aData[this.__message.__id[2]])){

									var draft = new OldMessage(this.__message.__id, aData);

									//Copy Body for embanded att
									if (draft.hasEmbeddedAttachments())
										this.__message.sBody = draft.getBody();

									//There is conversion!
									if (draft.hasAttachments())
										this.__message.aAttachments.attachments = draft.copyAttachments(this.__message.__id).attachments.map(function(v){
											return v.values;
										});

									this.__sendNotify(aSettings);
								}
								else{
									//Unable to load Draft file
									this.__show();
								}

							}.bind(this)
						]);
					}
					else
						this.__sendNotify(aSettings);
				}
				else{
					this.body.__nightMode();
					this.__show();
				}

			}.bind(this)]);

			return true;
		}
	}
};

_me.__sendNotify = function(aSettings){
	if (gui.notifier){
		gui.notifier._value({
			type: 'send_message',
			args: {
				interval: 5,
				callback: {
					success: function() {
						this.__message.send(true, [this, '__messageSent'], aSettings);
					},
					cancel: function() {
						this.__bDisableSand = false;
						this.__show();
						this._focus();
					},
					context: this
				}
			}
		});
	}
	else{
		this.__message.send(true, [this, '__messageSent'], aSettings);
	}
};

_me.__rconfirm = function(b){
	this._settings('read_confirmation', b?1:0);
	this.__send();
};

_me.__save_recipients = function(){

	var rcp = (this.__message.sTo || '') +';'+ (this.__message.sCc || '') +';'+ (this.__message.sBcc || '');

	if (!rcp) return;

	//clean duplicity
	function clean(emails){
		for(var i = emails.length-1;i>=0;i--){
			if (emails[i].email){
				for(j = i-1;j>=0;j--){
					if (emails[j].email && emails[i].email.toLowerCase() == emails[j].email.toLowerCase()){
						emails.splice(i,1);
						break;
					}
				}
			}
			else
				emails.splice(i,1);
		}

		return emails;
	};

	var emails = clean(MailAddress.splitEmailsAndNames(rcp).reverse());

	if ((rcp = Cookie.get(['suggest_address']))){
		emails = emails.concat(MailAddress.splitEmailsAndNames(rcp));
		emails = clean(emails);
	}

	emails = emails.slice(0,10);

	var out = '';
	for(var i=0;i<emails.length;i++)
		out += (out.length>0?';':'')+(emails[i].email.indexOf('[')==0?emails[i].email:MailAddress.createEmail(emails[i].name,emails[i].email));

	Cookie.set(['suggest_address'],out);
};

_me.__messageSaved = function(bOK, bFirstTime, message, sError, bAutoSave, aResponse, bTeamChat) {
	var sSavedFolder;

	if (this._destructed)
		return;

	if (bOK){
		if(bFirstTime && dataSet.get('folders', [message.__id[0], message.__id[1],'DEFAULT']) === 'D') {
			var count = dataSet.get('folders', [message.__id[0], message.__id[1], 'COUNT']) || 0;
			dataSet.add('folders', [message.__id[0], message.__id[1],'COUNT'], ++count);
		}
		if (!bAutoSave){
			if (gui.notifier) {
				sSavedFolder = (message.hasOwnProperty('template') && true === message.template) ? 'templates' : 'drafts';
				gui.notifier._value({type: bTeamChat ? 'message_sent_tch' : 'message_saved', args: [GWOthers.getItem('DEFAULT_FOLDERS',sSavedFolder).replace(sPrimaryAccount + '/', '')]});
			}

			//Save template
			if (this._settings('template') || bTeamChat){
				this._destruct();
				return true;
			}
		}

		this.__rememberState();

		//Lock TeamChat Item
		if (!this.__locked && message.__id_chat && message.__id_chat[2]){
			Item.set_lock(this.__message.__id_chat, true, false, [function(bOK){
				this.__locked = 1;
			}.bind(this)], 'M');
		}

		if (aResponse)
			executeCallbackFunction(aResponse, true);
	}
	else{
		this.__errorAlert('ALERTS::MESSAGE_NOT_SAVED', message, sError);

		if (aResponse)
			executeCallbackFunction(aResponse, false, sError);
	}

	if (!bAutoSave && (this._settings('template') || bTeamChat))
		this.__show();

	this.__bDisableSave = false;
	this.__bDisableSand = false;
};

_me.__messageSent = function(aOut, sUID, sError)
{
	if (this._destructed)
		return;

	if (sUID == 'imap_internal' || sUID == 'save_certificate_missing'){
		if (sUID == 'save_certificate_missing')
			sError = getLang('ALERTS::SAVE_CERTIFICATE_MISSING');

		gui.notifier._value({type: 'alert', args: {header: 'ALERTS::MESSAGE_NOT_SAVED', text_plain: sError}});

		aOut = true;
	}

	if (aOut){
		this.__save_recipients();

		this.__removeOnDestruct = false; //Message is removed by NewMessage.onSentCallback

		this._destruct();

		if (Is.Object(aOut)){
			if (sPrimaryAccountDELIVERY && this._settings('delivery') == 1)
				gui._create('frm_delivery', 'frm_delivery', '','','',aOut);
			/*
			else
			//Increment SMS count
			if (aOut.SMS_SEND)
				dataSet.add('main',['SMS_SENT'],aOut.SMS_SEND);
			*/
		}

		this.__exeEvent('onsend',true,{"owner":this});
	}
	else {
		this.__bDisableSave = false;
		this.__bDisableSand = false;

		this.__show();

		this.__errorAlert('',sUID,sError);
	}

	return false;
};

_me._onPopupClose = function(bOK, aAddresses){
	if (bOK){

		if (aAddresses['sms'])
			this.sms._value(aAddresses['sms'].join(', '));
		else{
			if (this.to)
				this.to._value(aAddresses['to'].join(', '));

			if(aAddresses['cc'].length || aAddresses['bcc'].length) {

				var elm;

				// Add copy recipients
				this.cc._value(aAddresses['cc'].join(', '));
				if (aAddresses['cc'].length && (elm = this._main.querySelector('.box.extended.cc')))
					removecss(elm,'extended');

				this.bcc._value(aAddresses['bcc'].join(', '));
				if (aAddresses['bcc'].length && (elm = this._main.querySelector('.box.extended.bcc')))
					removecss(elm,'extended');

				this.cc._tabIndex('',1);
				this.bcc._tabIndex('',2);

				if ((elm = this._main.querySelector('.box.extended.subject')))
					removecss(elm,'extended');
				this.subject._focus(true);
			}
		}
	}

	this.__bContactsOpened = false;
};

//For Custom devel
_me.__contacts = function(aData){
	if (Is.Object(aData)){
		if (this.sms)
			this.sms._value(aData.sms);
		if (this.to)
			this.to._value(aData.to);
		if (this.cc)
			this.cc._value(aData.cc);
		if (this.bcc)
			this.bcc._value(aData.bcc);
	}
	else{
		var out = {};
		if (this.sms)
			out.sms = this.sms._value();
		if (this.to)
			out.to = this.to._value();
		if (this.cc)
			out.cc = this.cc._value();
		if (this.bcc)
			out.bcc = this.bcc._value();

		return out;
	}
};

_me.__errorAlert = function (sTitle,sUID,sError){

	var sErrOut;
	if (sUID){
    	sUID = sUID.toUpperCase();

		switch (sUID) {
		case 'FOLDER_INSUFFICIEND_RIGHTS':
		case 'DEFAULT_FOLDER_MISSING':
		case 'DISTRIBUTION_LIST_INVALID_ID':
		case 'SMTP_FROM_FAILED':
		case 'SMTP_RECIPIENTS_FAILED':
		case 'SMTP_DATA_NOT_ACCEPTED':
		case 'PERSONAL_CERTIFICATE':
		case 'NO_RECIPIENT_CERTIFICATE':
		case 'RECIPIENT_CERTIFICATE_EXPIRED':
			sErrOut = getLang('ALERTS::'+sUID);
			break;
		}
	}

	if (sError)
		sErrOut = (sErrOut?sErrOut + "\n":'') + sError.unescapeHTML();

	if (!sErrOut)
		sErrOut = getLang('ALERTS::MAILINGFAILED')+(sUID?' ('+sUID+')':'');

	if (gui[this._name+'_error'])
		gui[this._name+'_error']._destruct();

	gui.notifier._value({type: 'alert', args: {header: sTitle || 'ALERTS::MESSAGE_NOT_SENT', text_plain: sErrOut}});
};

_me.__save = function(bAutoSave) {
	if (!this._destructed){
		if (!bAutoSave)
			this.__removeOnDestruct = false;

		if (!this.__bDisableSave && this.__changed())
			this.__send(true, true, bAutoSave);

		return true;
	}
};

_me._ondock = function() {
	return {css: this._settings('sms')?'sms':''};
};

_me._fullbody = function(v, callback){
	var isSms = this._settings('sms');
	//Prefix all <style> elements
	if (Is.Defined(v)) {
		if (isSms) {
			this.body._value(v.removeTags());
			return;
		}
		this.body._value(v.replace(/<p[^>]*?>(&nbsp;)?<\/p>/g, ''), false, false, function() {
			//hide reply headers
			[].forEach.call(this.body.__doc.querySelectorAll('span[iw-to="'+sPrimaryAccount+'"]'), function(elm){
				elm.style.display = 'none';
			});

			//prefix styles
			csstool.prefix('.iw-reply-block', this.body.__doc, {tagOnly:true, removeIW:true});
			callback && callback();
		}.bind(this));
	}
	else if (isSms) {
		return this.body._value();
	}
	//copy link styles into content style
	else {
		var	html = this.body._value(null, false, true);

		// if (this.body.select._value() == 'disabled')
		// 	html = html.replace(/\n/g, '<br>');

		if (this.__message.isHtml())
			html = DOMPurify.sanitize(html);

		//prefix CSS
		var	div = mkElement('div', {innerHTML: html}),
			newStyle = mkElement('style', {type:"text/css"});

		csstool.copy(this.body.__doc, newStyle, {useIW:true, skipIW:true});
		div.insertBefore(newStyle, div.firstChild || null);

		return div.innerHTML;
	}
};
