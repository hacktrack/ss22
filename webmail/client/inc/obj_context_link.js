_me = obj_context_link.prototype;
function obj_context_link(){};

_me.__constructor = function(sName,sMail,aCert,aConfig,aRecipients,ids){
	ids = ids || [];
	var me = this,
		aConfig = aConfig || {};

	if (!sMail && !aConfig.distibutionList) return;

	aConfig.guest = sPrimaryAccountGUEST || (TeamChatAPI && TeamChatAPI.teamChatOnly());

	//EMAIL
	var aLCTval = {LOCATIONS:[{'values': {'LCTEMAIL1':sMail,'LCTTYPE': 'H'}}]};
	if (aCert)
		aLCTval.CERTIFICATES = aCert;

	if (sName && sName !== sMail) {
		sName = sName.unescapeHTML();

		if (sName.indexOf('<') > -1) {
			var aFrom = MailAddress.splitEmailsAndNames(sName)[0];
			aName = aFrom.name;
		}

		aLCTval = parseNameToLocation(sName, aLCTval);
	} else {
		sName = '';
	}

	var aMenu = [
		{anchor: 'address'},
		{title: '-'},
		{
			"title": 'POPUP_ITEMS::COPY_EMAIL',
			keep: true,
			'arg': [this, '__copyEmailToClipboard', [sMail]],
			css: 'ico ico2 copy_email'
		}
	];

	if (!aConfig.guest){

		if (sPrimaryAccountGW > 0 && !aConfig.nomail && !aConfig.noadd) {
			if (!~(GWOthers.getItem('RESTRICTIONS', 'disable_gw_types') || '').indexOf('c')) {
				aMenu.push({
					"title": 'POPUP_ITEMS::LOOKUP_CONTACTS',
					css: 'ico ico2 lookup_contacts',
					'arg': [this, '__lookup', [sMail, aLCTval]]
				}, {
					"title": 'POPUP_ITEMS::ADD_TO_CONTACTS',
					css: 'ico ico2 add_to_contacts',
					'arg': [gui, '_create', ['frm_contact', 'frm_contact', '', '', sPrimaryAccount, Mapping.getDefaultFolderForGWType('C'), '', aLCTval]]
				}, {
					"title": 'POPUP_ITEMS::ADD_TO_EXIST_CONTACTS',
					css: 'ico ico2 add_to_existing_contact',
					'arg': [gui, '_create', ['insert_item', 'frm_insert_item', '', 'frm_insert_item_nobottomdiv', [me, '__addEmail', [sMail]], sPrimaryAccount, Mapping.getDefaultFolderForGWType('C'), 'C', '', false, ['C'], 'C']]
				}, {
					"title": '-'
				});
			}
		}

		//Invite to Appointment
		if (!aConfig.nomail && sPrimaryAccountGW > 0) {
			aMenu.push({
				title: 'POPUP_ITEMS::INVITE_APPOINTMENT',
				css: 'ico ico2 invite_to_appointment',
				arg: [Item.createInFolder,
					[
						sPrimaryAccount, "__@@VIRTUAL@@__/__@@EVENTS@@__", {
							CONTACTS: [{values: {CNTEMAIL: sMail, CNTCONTACTNAME: sName, CNTROLE: 'Q', NEW: true}}]
						}, 'E'
					]
				],
				disabled: false
			});

			if (aRecipients) {
				var contacts = [];
				for (var i = 0; i < aRecipients.length; i++) {
					if (aRecipients[i].email && aRecipients[i].email !== sPrimaryAccount) {
						contacts.push({values: {CNTEMAIL: aRecipients[i].email, CNTCONTACTNAME: aRecipients[i].name, CNTROLE: 'Q', NEW: true}});
					}
				}

				contacts.length > 1 && aMenu.push({
					title: 'POPUP_ITEMS::INVITE_ALL_APPOINTMENT',
					css: 'ico ico2 invite_all_to_appointment',
					arg: [Item.createInFolder, [sPrimaryAccount, "__@@VIRTUAL@@__/__@@EVENTS@@__", {CONTACTS: contacts}, 'E']],
					disabled: false
				});
			}
		}

		//Add to IM Roster
		/*if (window.sPrimaryAccountIM && (GWOthers.getItem('RESTRICTIONS', 'disable_im') || 0) < 1 && gui.frm_main && gui.frm_main.im) {
			aMenu.push({
				"title": 'POPUP_ITEMS::ADD_TO_IM',
				css: 'ico ico2 add_to_im',
				disabled: !gui.frm_main.im._is_active() || gui.frm_main.im._inRoster(sMail) || (sMail === sPrimaryAccount),
				'arg': [gui.frm_main.im, '_add_item', ['', sMail, sName]]
			});
		}*/

		var b = false;
		if (sPrimaryAccountCHAT) {
			var f = dataSet.get('folders', [sPrimaryAccount]), r = 0, b = false;
			for (var n in f) {
				if (b && r > 0) {
					break;
				}
				if (f[n].TYPE === 'I' && f[n].RECENT > 0) {
					r += parseInt(f[n].RECENT);
					b = true;
				} else if (f[n].TYPE === 'Y' && WMFolders.getAccess({
					aid: sPrimaryAccount,
					fid: n
				}, 'write')) {
					b = true;
				}
			}
		}
		b && aMenu.push({
			"title": '-'
		}, {
			"title": 'POPUP_ITEMS::TEAMCHAT_INVITE',
			css: 'ico ico2 teamchat_invite',
			'arg': [this, '__teamchat_invite', [sMail]]
		});
	}

	this._fill(aMenu);

	// hack to not close the menu after copying email
	var li = document.querySelector('.copy_email');
	var div = document.createElement('div');
	div.id = li.firstChild.id;
	li.insertBefore(div, li.firstChild);

	var anchor = document.getElementById(this._anchors.address);
	var wrapper = document.createElement('div');
	wrapper.classList.add('wrapper');

	var img = document.createElement('div');
	img.classList.add('avatar');
	wrapper.appendChild(img);

	var name = document.createElement('div');
	name.classList.add('name');
	name.textContent = sName || sMail;
	wrapper.appendChild(name);

	if (sName) {
		var email = document.createElement('div');
		email.classList.add('email');
		email.textContent = sMail;
		email.onclick = function () {
			Item.sendEmailTo(MailAddress.createEmail(sName, sMail));
		};
		wrapper.appendChild(email);
	}

	var buttons = document.createElement('div');
	buttons.classList.add('buttons');
	wrapper.appendChild(buttons);

	var button_call = document.createElement('div');
	button_call.classList.add('call');
	var icon_call = document.createElement('div');
	icon_call.classList.add('icon');
	button_call.appendChild(icon_call);
	var label_call = document.createElement('div');
	label_call.classList.add('label');
	label_call.textContent = getLang('CONTACT::CALL');
	button_call.appendChild(label_call);

	var button_mail = document.createElement('div');
	button_mail.classList.add('mail');
	var icon_mail = document.createElement('div');
	icon_mail.classList.add('icon');
	button_mail.appendChild(icon_mail);
	var label_mail = document.createElement('div');
	label_mail.classList.add('label');
	label_mail.textContent = getLang('CONTACT::MAIL');
	button_mail.appendChild(label_mail);
	button_mail.onclick = function () {
		Item.sendEmailTo(sName ? MailAddress.createEmail(sName, sMail) : sMail);
	};
	buttons.appendChild(button_mail);

	var button_chat = document.createElement('div');
	button_chat.classList.add('chat');
	var icon_chat = document.createElement('div');
	icon_chat.classList.add('icon');
	button_chat.appendChild(icon_chat);
	var label_chat = document.createElement('div');
	label_chat.classList.add('label');
	label_chat.textContent = getLang('CONTACT::CHAT');
	button_chat.appendChild(label_chat);
	button_chat.onclick = function () {
		gui.frm_main.im._chat(sMail);
	};

	anchor.appendChild(wrapper);

	anchor.parentNode.replaceChild(wrapper, anchor);
	if (sMail && Is.Email(sMail)) {
		WMItems.list({"aid": ids[0] || sPrimaryAccount, "fid": ids[1] || '__@@ADDRESSBOOK@@__', filter: {search: 'email:"' + sMail.replace(/"/g, '\\"') + '"'}, values:['LCTEMAIL1', 'LCTEMAIL2', 'LCTEMAIL3', 'LCTPHNWORK1','LCTPHNFAXWORK','LCTPHNHOME1','LCTPHNMOBILE']}, '', '', '', [
			function (aData) {
				if (aData && (aData = (aData[sPrimaryAccount] || aData[ids[0]])) && (aData = (aData['__@@ADDRESSBOOK@@__'] || aData[ids[1]]))) {
					var aPath, bPhone = false;
					for (var id in aData) {
						if (id.charAt(0) === '*') {
							var aPath = [sPrimaryAccount, aData[id].ITMFOLDER ? aData[id].ITMFOLDER.replace(/\\/g, '/') : '__@@ADDRESSBOOK@@__', id];
							if(aData[id] && (aData[id].LCTPHNFAXWORK || aData[id].LCTPHNHOME1 || aData[id].LCTPHNMOBILE || aData[id].LCTPHNWORK1)) {
								bPhone = aPath;
							}
							if (dataSet.get('folders', [aPath[0], aPath[1], 'DEFAULT']))
								break;
						}
					}

					if (aPath) {
						img.style.backgroundImage = "url(" + getAvatarURL(sMail) + ")";
						gui.tooltip._add(img, '<img class="avatar_preview" style="background-image: url(' + getAvatarURL(sMail) + ')">', {x: '-60', y: '+36', html: true, css: 'borderless'});

						if (sPrimaryAccount !== sMail) {
							if (bPhone) {
								button_call.onclick = function () {
									gui.frm_main.__showDialDialog(bPhone[0], bPhone[1], bPhone[2]);
								};
								buttons.insertBefore(button_call, button_mail);
							}
							if (gui.frm_main.im && gui.frm_main.im._is_active()) {
								buttons.appendChild(button_chat);
							}
						}
					}
				} else if(gui.frm_main.im && gui.frm_main.im._is_active() && gui.frm_main.im._inRoster(sMail)) {
					buttons.appendChild(button_chat);
				}
			}.bind(this)
		]);
	}
};

_me.__teamchat_invite = function (sMail) {
	gui._create('frm_select_folder', 'frm_select_folder', '', '', 'POPUP_ITEMS::TEAMCHAT_INVITE', false, false, [
		function (aid, fid) {
			gui._create('invite', 'frm_groupchat_invite', '', '', {aid:aid, fid:fid}, [function() {
				gui.notifier && gui.notifier._value({type: 'invitation_sent', args: [sMail]});
			}], sMail);
		}
	], true, false, ['Y', 'I'], false, true, 'ab');
};

_me.__copyEmailToClipboard = function(sMail){
	var textArea = document.createElement("textarea");
	textArea.innerHTML = sMail;
	textArea.style.position = 'absolute';
	textArea.style.zIndex = '-10000';
	textArea.style.top = '0';
	textArea.style.left = '0';
	document.body.appendChild(textArea);
	textArea.select();

	var holder = document.querySelector('.copy_email');
	try {
		if(!document.queryCommandSupported('copy')) {
			throw new Error('Unsupported command "copy"');
		}
		if(!document.queryCommandEnabled('copy')) {
			throw new Error('Command "copy" disabled');
		}
		if(document.execCommand('copy')) {
			gui.notifier && gui.notifier._value({type: 'clipboard_email'});
			holder.classList.add('copied');
			holder.querySelector('span').textContent = getLang('POPUP_ITEMS::EMAIL_COPIED');
			var self = this;
			setTimeout(function() {
				holder && self._destruct();
			}, 220);
		} else {
			throw new Error('Unable to copy mail to clipboard. Press CTRL + C to copy');
		}
	} catch (err) {
		console.log(err);
		holder.classList.add('copy_error');
		var span = holder.querySelector('span');
		span.textContent = sMail;
		if (document.selection) {
			var div = document.body.createTextRange();
			div.moveToElementText(span);
			div.select();
		} else if (window.getSelection) {
			var div = document.createRange();
			div.selectNodeContents(span);
			window.getSelection().removeAllRanges();
			window.getSelection().addRange(div);
		}
	}
	textArea.parentNode.removeChild(textArea);
};

_me.__lookup = function(sMail, aLCTval){
	if (sMail && Is.Email(sMail))
		WMItems.list({"aid": sPrimaryAccount, "fid": '__@@ADDRESSBOOK@@__', filter:{search:'isemail:"'+ sMail.replace(/"/g,'\\"') +'"'}}, '', '', '', [function(aData){

			if (aData && (aData = aData[sPrimaryAccount]) && (aData = aData['__@@ADDRESSBOOK@@__'])){
				var aPath;
				for(var id in aData){
					if (id.charAt(0) == '*'){
						var aPath = [sPrimaryAccount, aData[id].ITMFOLDER?aData[id].ITMFOLDER.replace(/\\/g,'/'):'__@@ADDRESSBOOK@@__', id];
						if (dataSet.get('folders',[aPath[1],'DEFAULT']))
							break;
					}
				}

				if (aPath){
					Item.openwindow(aPath, '', '', 'C');
					return;
				}
			}

			//Not found
			var frm = gui._create('not_found', 'frm_confirm','','frm_alert', [gui, '_create', ['frm_contact', 'frm_contact', '', '', sPrimaryAccount, Mapping.getDefaultFolderForGWType('C'), '', aLCTval]],
					'ALERTS::NOT_FOUND',
					'CONFIRMATION::CONTACT_NOT_FOUND'
				);

				addcss(frm.x_btn_ok._main,'add');
				frm.x_btn_ok._value('POPUP_ITEMS::ADD_TO_CONTACTS');

		}]);
};

_me.__addEmail = function(aData, sMail){
	WMItems.list({"aid": aData[0].aid, "fid": aData[0].fid, "iid": aData[0].id}, '', '', '', [this, '__saveEmail', aData, sMail]);
};

_me.__saveEmail = function(sMail, aData, aResponse){

	var aValues;
	if (!Is.String(sMail) || !Is.Object(aData) || !aResponse || !(aValues = aResponse[aData.aid][aData.fid][aData.id])){
		gui.notifier._value({type: 'alert', args: {header: '', text: 'ERROR::NO_DATA'}});
		return;
	}

	sMail = sMail.toLowerCase();

	var aLocations = aValues['LOCATIONS'],
		aLocData = {};

	//Try to edit H Location
	if (Is.Defined(aLocations)){

		for(var i in aLocations)
			if (aLocations[i]['values'].LCTTYPE == 'H'){
				aLocData = aLocations[i]['values'];
				break;
			}

		if (!Is.Empty(aLocData)){
			var checkEmailBox = ['LCTEMAIL1', 'LCTEMAIL2', 'LCTEMAIL3'],
				bFull = true;

			for(var i in checkEmailBox)
				if (!aLocData[checkEmailBox[i]]){
					aLocData[checkEmailBox[i]] = sMail;
					bFull = false;
					break;
				}
				else
				if (aLocData[checkEmailBox[i]].toLowerCase() == sMail){
					if (gui.notifier)
						gui.notifier._value({type: 'email_exists'});
					return true;
				}

			if (bFull){
				gui.notifier._value({type: 'alert', args: {header: '', text: 'NOTIFIER::CONTACT_EMAIL_LIST_FULL'}});
				return false;
			}
		}
	}

	//Add New Location
	if (Is.Empty(aLocData))
		aLocData = {
			LCTEMAIL1: sMail,
			LCTEMAIL2: "",
			LCTEMAIL3: "",
			LCTTYPE: "H"
		};

	//Output string with uid=LCT_ID
	var aOut = {values: aLocData};
	if (aLocData.LCT_ID)
		aOut.uid = aLocData.LCT_ID;

	WMItems.add([sPrimaryAccount, aData.fid, aData.id], {LOCATIONS: [aOut]}, '','','',[function(bOK){
		if (bOK === true && gui.notifier)
			gui.notifier._value({type: 'email_added'});
	}]);
};
