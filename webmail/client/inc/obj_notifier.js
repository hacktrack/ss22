_me = obj_notifier.prototype;

function obj_notifier() {};

_me.__constructor = function (list) {
	if (!list) {
		return;
	}

	var notification_icon = gui.frm_main.notifications._main.querySelector('li.notifier a');

	var count = notification_icon.querySelector('div.count');
	if (count){
		addcss(count,'hidden');
		count.textContent = 0;
	}

	this._create('scrollbar', 'obj_scrollbar')._scrollbar(this._main);

	gui.notifier.__saved = gui.notifier.__saved.map(function (saved) {
		saved.time = this.__getTime(saved.id);
		saved.viewed = true;
		return saved;
	}, this);
	this._draw('obj_notifier', 'main', {
		notifications: gui.notifier.__saved
	});

	[].forEach.call(this._main.querySelectorAll('li'), function (li) {
		li.addEventListener('click', function (event) {
			var id = li.getAttribute('data-id');
			var onclick = (gui.notifier.__saved.filter(function (saved) {
				return saved.id === +id;
			})[0] || {}).onclick;
			onclick && onclick();
		});
	});
};

_me.__getTime = function (time) {
	var date = new Date(time);
	var diff = Math.floor((new Date() - date) / 1000);
	if (diff < 10) {
		return getLang('NOTIFICATION::NOW');
	} else if (diff < 60) {
		return getLang(diff === 1 ? 'NOTIFICATION::SECOND_AGO' : 'NOTIFICATION::SECONDS_AGO', [diff]);
	} else if (diff < 60 * 60) {
		var minutes = Math.floor(diff / 60);
		return getLang(minutes === 1 ? 'NOTIFICATION::MINUTE_AGO' : 'NOTIFICATION::MINUTES_AGO', [minutes]);
	} else if (diff < 60 * 60 * 12) {
		var hours = Math.floor(diff / 60 / 60);
		return getLang(hours === 1 ? 'NOTIFICATION::HOUR_AGO' : 'NOTIFICATION::HOURS_AGO', [hours]);
	} else if (diff < 60 * 60 * 24) {
		return getLang('NOTIFICATION::TODAY_AT', [(new IcewarpDate(date)).format('HH:mm')]);
	} else if (diff < 60 * 60 * 24 * 2) {
		return getLang('NOTIFICATION::YESTERDAY_AT', [(new IcewarpDate(date)).format('HH:mm')]);
	} else {
		return (new IcewarpDate(date)).format('YYYY-MM-DD HH:mm:ss');
	}
};

_me._clear_notifications = function () {
	this.__saved = [];
};

_me.closeNotification = function (notification) {
	clearTimeout(notification.timeout);
	clearInterval(notification.interval);
	var event = browserEvent('transitionend');
	if (event) {
		var transition_callback = function () {
			if (!notification.element || !notification.element.parentNode) {
				return;
			}
			notification.element.removeEventListener(event, transition_callback);
			notification.element.parentNode.removeChild(notification.element);
		};
		notification.element.addEventListener(event, transition_callback);
		notification.element.classList.add('closing');
		setTimeout(function () {
			notification.element.parentNode && notification.element.parentNode.removeChild(notification.element);
		}, 400);
	} else {
		notification.element.parentNode.removeChild(notification.element);
	}
	this.notifications = this.notifications.filter(function (notif) {
		return notif !== notification;
	});
};

/*
	Notification object
	@RFC: http://www.w3.org/TR/notifications/

	Attributes:
		iconUrl - src string (PNG)
		body	- string
		tag		- string (notification are collapsed by this string)

	Methods:
		onclick
		onerror
		onshow
		onclose
*/

_me._value2 = function (v, aArg) {
	this.notifications = this.notifications || [];

	var notification = {
		element: mkElement('div', {
			className: 'container'
		}, false, [
			mkElement('div', {
				className: 'notification ' + (v.type || ''),
				onclick: function () {
					if (v.onclick) {
						v.onclick();
						this.closeNotification(notification);
					}
				}.bind(this),
				onmouseenter: function () {
					if (!v.args.interval) {
						clearTimeout(notification.timeout);
					}
				}.bind(this),
				onmouseleave: function () {
					if (!~this.__sticky.indexOf(v.type)) {
						notification.timeout = setTimeout(function () {
							this.closeNotification(notification);
						}.bind(this), 2000);
					}
				}.bind(this)
			}, false, [
				mkElement('div', {
					className: 'icon' + (v.avatar ? ' avatar' : '')
				}, false, v.avatar ? [
					mkElement('img', {
						src: v.avatar,
						className: 'avatar'
					})
				] : false),
				mkElement('div', {
					className: 'content'
				}, false, [
					v.header && mkElement('div', {
						className: 'header',
						title: v.header,
						text: v.header
					}),
					v.text && mkElement('div', {
						className: 'text',
						innerHTML: v.html
					}),
					v.subtext && mkElement('div', {
						className: 'subtext',
						text: v.subtext
					})
				].filter(Boolean)),
				v.buttons ? mkElement('div', {
					className: 'right'
				}, false, [
					mkElement('div', {
						className: 'buttons'
					}, false, v.buttons.map(function (button) {
						return mkElement('div', {
							className: 'button' + (button.className ? ' ' + button.className : '')
						}, false, mkElement('div', {
							className: 'button_label',
							text: button.text,
							onclick: function () {
								this.closeNotification(notification);
								button.onclick();
							}.bind(this)
						}));
					}, this))
				]) : mkElement('div', {
					className: 'close',
					onclick: function () {
						this.closeNotification(notification);
					}.bind(this)
				})
			].filter(Boolean))
		])
	};
	this._main.insertBefore(notification.element, this._main.firstChild);

	if (this.__sticky.indexOf(v.type) === -1) {
		notification.timeout = setTimeout(function () {
			this.closeNotification(notification);
		}.bind(this), 5000);
	}

	if (v.args && v.args.interval) {
		var timeleft = v.args.interval;
		notification.interval = setInterval(function () {
			switch (v.type) {
				case 'send_message':
					notification.element.querySelector('.text').innerHTML = this.__getNotificationText(v.type, {
						interval: --timeleft
					}, true);
			}
			if (timeleft <= 0) {
				v.args.callback.success.call(v.args.callback.context);
				this.closeNotification(notification);
			}
		}.bind(this), 1000);
	}

	this.notifications.push(notification);
};

_me.__sticky = ['conference_invite', 'send_message'];
_me.__saved = [];

_me.__getNotificationHeader = function (type, args) {
	switch (type) {
		case 'im':
			return dataSet.get('xmpp', ['roster', args.jid, 'name']) || args.jid;
		case 'teamchat':
			return args.data['ORIGINATOR-NAME'] || args.data.NAME || args.data['ORIGINATOR-EMAIL'] || args.data.EMAIL;
		case 'sip':
			return getLang((args || {}).header ? args.header : 'SIP::SIP');
		case 'document_added':
		case 'document_edited':
			return args['ORIGINATOR-NAME'] || args['ORIGINATOR-EMAIL'];
		case 'alert':
			return getLang((args || {}).header ? args.header : 'ALERTS::ALERT');
		case 'success':
		default:
			return (args || {}).header ? getLang(args.header) : '';
	}
};

_me.__getNotificationButtons = function (type, args) {
	switch (type) {
		case 'conference_invite':
			return [{
					className: 'accept',
					text: getLang('EVENT::JOINCONFERENCE'),
					onclick: function () {
						storage.library('wm_conference');
						wm_conference.get(args[0]).join();
					}
				},
				{
					className: 'decline',
					text: getLang('FORM_BUTTONS::DECLINE'),
					onclick: function () {

					}
				}
			];
		case 'send_message':
			return [{
				className: 'clear',
				text: getLang('FORM_BUTTONS::UNDO'),
				onclick: function () {
					args.callback.cancel.call(args.callback.context);
				}
			}];
		case 'message_sent':
		case 'send_message_deferred':
			return (sPrimaryAccountDELIVERY && args[0]) ? [{
				className: 'clear',
				text: getLang('ITEMVIEW::DETAILS'),
				onclick: function () {
					gui._create('frm_delivery', 'frm_delivery', '', '', '', args[0]);
				}
			}] : false;
	}
};

_me.__getNotificationText = function (type, args, bHTML) {

	var langBold = false,
		langKey = 'NOTIFICATION::' + type,
		langArr = args,
		sOut = '';

	switch (type) {
		case 'conference':
			sOut = args.text || '';
			langKey = args[0];
			break;

		case 'item_saved':
			var folder = dataSet.get('folders', [args[0] || args.aid, args[1] || args.fid]);

			if (folder && folder.TYPE && !folder.VIRTUAL) {
				switch (folder.TYPE) {
					case 'F':
					case 'C':
					case 'E':
						langKey = 'NOTIFICATION::ITEM_SAVED_' + folder.TYPE;
						break;

					default:
						langKey = 'NOTIFICATION::ITEM_SAVED_TO';
						break;
				}

				langArr = [folder.NAME || folder.RELATIVE_PATH];
				langBold = true;
			}
			break;

		case 'new_email':
		case 'invitation_sent':
			langBold = true;
			break;

		case 'reminder':
			var formattedStartDate = CalendarFormatting.formatStartDate(args[0]);
			formattedStartDate = (formattedStartDate === '') ? '' : ' (' + formattedStartDate + ')';

			langArr = [args[0].title, formattedStartDate];
			break;

		case 'send_message_deferred':
			langArr = ["\r\n" + args[1].format('L'), args[1].format('LT')];
			langBold = true;
			break;

		case 'send_message':
			langArr = [args.interval];
			langBold = true;
			break;

		case 'document_added':
			sOut = getLang('NOTIFICATION::DOCUMENT_ADDED', [args.data.EVNTITLE]);
			break;
		case 'document_edited':
			sOut = getLang('NOTIFICATION::DOCUMENT_EDITED', [args.data.EVNTITLE]);
			break;

		case 'teamchat':
		case 'im':
		case 'sip':
		case 'alert':
		default:
			if (args.text_plain) {
				sOut = this.__substituteMentions(args.text_plain, (args.data || {}).MENTIONS);
			} else if (args.text) {
				langKey = args.text;
				langArr = args.args;
			}
			break;
	}

	//Convert to HTML for internal Notifier
	if (bHTML) {
		if (sOut.length)
			return sOut.toString().escapeHTML().wrap();
		else
		if (Is.Array(langArr)) {
			//Escape all langArr
			langArr = langArr.map(function (v) {
				v = v.toString();
				if (v.length) {
					v = v.escapeHTML().wrap();
					if (langBold)
						v = '<b>' + v + '</b>';
				}
				return v;
			});
		}
	} else
		//Plain text for system Notifier
		if (sOut.length)
			return sOut;

	return getLang(langKey.toUpperCase(), langArr, 2);
};

_me.__getNotificationSubtext = function (type, args) {
	switch (type) {
		case 'im':
			return getLang('NOTIFICATION::IM_HELPER');
		case 'teamchat':
			return getLang('NOTIFICATION::TEAMCHAT_HELPER', [this.__getRoomName(args.data.FOLDER)]);
		case 'document_added':
		case 'document_edited':
			return this.__getRoomName(args.FOLDER);
	}
};

_me.__getRoomName = function (folder) {
	var room_name = '';
	if(folder) {
		var folders = dataSet.get('folders', [sPrimaryAccount]);
		for (var i in folders) {
			if (Path.slash(folders[i].RELATIVE_PATH) === Path.slash(folder)) {
				room_name = Path.slash(folders[i].NAME || folders[i].RELATIVE_PATH).split('/').pop();
				break;
			}
		}
	}
	return room_name;
};

_me.__getNotificationAvatar = function (type, args) {
	switch (type) {
		case 'im':
			return getAvatarURL(args.jid);
		case 'teamchat':
		case 'sip_canceled':
			return getAvatarURL(args.data['ORIGINATOR-EMAIL'] || args.data.EMAIL);
		case 'document_added':
		case 'document_edited':
			return getAvatarURL(args['ORIGINATOR-EMAIL']);
	}
};

_me.__getNotificationAction = function (type, args) {
	switch (type) {
		case 'im':
			return function () {
				gui.frm_main.im._activate(args.jid);
				gui.frm_main.im._chat(args.jid);
			};
		case 'teamchat':
			return function () {
				var folder = Path.slash(args.data.FOLDER),
					aFolders = dataSet.get('folders', [sPrimaryAccount]);

				if (folder && args && args.data && args.data.EMAIL)
					for (var fid in aFolders)
						if (aFolders[fid].OWNER === args.data.EMAIL && aFolders[fid].RELATIVE_PATH === folder) {
							gui.frm_main.bar.tree.folders._setActive(sPrimaryAccount + '/' + fid);
							gui.frm_main._selectView({
								aid: sPrimaryAccount,
								fid: fid
							});
							gui.frm_main.filter.__filter('I');
							break;
						}
			};
		case 'document_added':
		case 'document_edited':
			return function() {
				var sFolder, folders = dataSet.get('folders', [sPrimaryAccount]);
				for (var sFolder in folders) {
					if (((args.EMAIL === sPrimaryAccount && !folders[sFolder].OWNER) || (folders[sFolder].OWNER === args.EMAIL)) && folders[sFolder].RELATIVE_PATH === Path.slash(args.FOLDER)) {
						break;
					}
				}
				gui.frm_main.bar.tree.folders._setActive(sPrimaryAccount + '/' + sFolder);
				gui.frm_main._selectView({
					aid: sPrimaryAccount,
					fid: sFolder
				});
				gui.frm_main.filter.__filter(folders[sFolder].TYPE);
			};
	}
};

_me.__getNotificationType = function (type, args) {
	switch (type) {
		case 'item_saved':
			var folder = dataSet.get('folders', [args[0], args[1]]);
			if (folder && folder.TYPE) {
				switch (folder.TYPE) {
					case 'F':
						return 'folder_subscribed';
					case 'C':
						return 'invitation_sent';
				}
			}
			break;
		case 'document_added':
		case 'document_edited':
			var sExtension = (args.data.EVNTITLE.split('.').pop() || '').toLowerCase();
			switch(sExtension) {
				case 'doc': case 'dot': case 'docx':
				case 'docm': case 'dotx': case 'dotm':
				case 'docb': case 'odt': case 'rtf':
					type = 'document';
				break;

				case 'xls': case 'csv': case 'xlsx':
				case 'xla': case 'xlam': case 'xlsb':
				case 'ods': case 'xlsb': case 'xlsm':
				case 'xlt': case 'xltm': case 'xltx':
					type = 'spreadsheet';
				break;

				case 'ppt': case 'pptx': case 'odp':
				case 'pps': case 'ppsm': case 'ppsx':
				case 'pptm': case 'ppa': case 'ppam':
					type = 'presentation';
				break;

				case 'pdf':
					type = 'pdf';
				default:
					type = 'file';
				break;
			}
			return type;

	}
	return type;
};

_me.__getNotificationData = function (type, args) {
	args = args || [];
	return {
		type: this.__getNotificationType(type, args),
		onclick: this.__getNotificationAction(type, args),
		avatar: this.__getNotificationAvatar(type, args),
		header: this.__getNotificationHeader(type, args),
		text: this.__getNotificationText(type, args),
		html: this.__getNotificationText(type, args, true),
		buttons: this.__getNotificationButtons(type, args),
		subtext: this.__getNotificationSubtext(type, args),
		args: args
	};
};

_me.__getFirstLine = function (aOptions) {
	switch (aOptions.type) {
		case 'teamchat':
			return '<b>' + (aOptions.args.data['ORIGINATOR-NAME'] || aOptions.args.data.NAME || aOptions.args.data['ORIGINATOR-EMAIL'] || aOptions.args.data.EMAIL).escapeHTML() + '</b>';
		case 'sip_canceled':
			return '<b>' + (aOptions.args.data.NAME || aOptions.args.data.EMAIL).escapeHTML() + '</b> <i>' + getLang('NOTIFICATION::MISSED_CALL') + '</i>';
		case 'document_added':
			return getLang('NOTIFICATION::ADDED_DOCUMENT', [
				'<b>' + (aOptions.args['ORIGINATOR-NAME'] || aOptions.args['ORIGINATOR-EMAIL']).escapeHTML() + '</b>',
				'<i>' + aOptions.args.data.EVNTITLE.escapeHTML() + '</i>'
			]);
		case 'document_edited':
			return getLang('NOTIFICATION::EDITED_DOCUMENT', [
				'<b>' + (aOptions.args['ORIGINATOR-NAME'] || aOptions.args['ORIGINATOR-EMAIL']).escapeHTML() + '</b>',
				'<i>' + aOptions.args.data.EVNTITLE.escapeHTML() + '</i>'
			]);
	}
	return '';
};

_me.__getSecondLine = function (aOptions) {
	switch (aOptions.type) {
		case 'teamchat':
			return this.__substituteMentions(aOptions.args.text_plain, aOptions.args.data.MENTIONS).escapeHTML();
	}
	return '';
};

_me.__substituteMentions = function (text, mentions) {
	text = text || '';
	if(!mentions) {
		return text;
	}

	var aMentions = parseParamLine(mentions),
		aMen = {};
	for (var id in aMentions) {
		aMen[aMentions[id].values.EMAIL] = {name:aMentions[id].values.NAME, email:aMentions[id].values.EMAIL};
	}
	return text.replace(/(@\[([^\]]{1,128})\])/g, function() {
		var name = arguments[2],
			email = name.indexOf('@') > -1 ? name : name + '@' + dataSet.get('main', ['domain']);

		if (aMen[email]){
			name = aMen[email].name || aMen[email].email;
		}

		return '@' + name;
	});
};

_me.__getIcon = function (aOptions) {
	switch(aOptions.type) {
		case 'document_added':
		case 'document_edited':
			return aOptions.data.type;
	}
	return aOptions.type;
};

_me._value = function (aOptions) {
	var should_update_count = true;
	if (!aOptions || !aOptions.type) {
		return;
	}
	var iSetting = parseInt(GWOthers.getItem('LAYOUT_SETTINGS', 'notifications') || 0, 10);

	aOptions.type = aOptions.type.toLowerCase();
	aOptions.timeout = (parseInt(aOptions.timeout || 3, 10) || 3) * 1000;
	aOptions.data = this.__getNotificationData(aOptions.type, aOptions.args);
	aOptions.data.group = aOptions.group;

	if (aOptions.save) {
		if (aOptions.group) {
			this.__saved = this.__saved.filter(function (notification) {
				if (notification.group === aOptions.group) {
					if (!notification.viewed) {
						should_update_count = false;
					}
					return false;
				}
				return true;
			});
		}
		aOptions.data.id = +new Date();
		aOptions.data.room = this.__getRoomName(aOptions.args.FOLDER || aOptions.args.data.FOLDER);
		aOptions.data.icon = this.__getIcon(aOptions);
		aOptions.data.first_line = this.__getFirstLine(aOptions);
		aOptions.data.second_line = this.__getSecondLine(aOptions);
		this.__saved.unshift(aOptions.data);
		var notification_icon = gui.frm_main.notifications._main.querySelector('li.notifier a');
		var count = notification_icon.querySelector('div.count');
		var amount = 0;
		if (count) {
			amount = count.textContent;
		}
		else{
			count = mkElement('div',{className:'count'});
			notification_icon.appendChild(count);
		}

		if (should_update_count) {
			amount = amount === '99+' ? 100 : ++amount;
		}

		count.textContent = amount > 99 ? '99+' : amount;
		window[amount>0?'removecss':'addcss'](count,'hidden');
	}

	if (window.Notification && (iSetting == 1 || (iSetting == 0 && !gui.__focus)))
		if (this._value3(aOptions.data.header || aOptions.data.subtext || ' ', aOptions.data.text, aOptions.aHandler, aOptions.timeout, aOptions.group) !== false && this.__sticky.indexOf(aOptions.type) === -1)
			return;

	//internal bubble
	this._value2(aOptions.data, aOptions.aHandler, aOptions.timeout);
};

//http://www.w3.org/TR/notifications/
_me._value3 = function (sTitle, sBody, aHandler, iTime, sGroup) {

	//Webkit 09/11/13 doesnt support Notification.permission
	if (window.Notification) {

		if (!window.Notification.permission && window.webkitNotifications && window.webkitNotifications.checkPermission)
			window.Notification.permission = (['granted', 'default', 'denied'])[window.webkitNotifications.checkPermission()];

		if (window.Notification.permission == 'granted') {

			if (sTitle && !sBody && GWOthers.getItem('LAYOUT_SETTINGS', 'title')) {
				sBody = sTitle;
				sTitle = GWOthers.getItem('LAYOUT_SETTINGS', 'title');
			}

			var arg = {
				body: sBody || '',
				dir: "auto",
				//lang: "",
				tag: sGroup,
				icon: './client/skins/default/images/logo.png'
			};

			var n = new Notification(sTitle || getLang('PRELOADER::LOADING'), arg);
			n.onclick = function () {
				//for Chrome
				window.focus();

				if (aHandler)
					try {
						executeCallbackFunction(aHandler);
					}
				catch (r) {
					gui._REQUEST_VARS.debug && console.log(this._name || false, r)
				}

				window.focus();

				//Safari likes this
				this.close();
			};
			n.onshow = function () {
				this._date = new IcewarpDate();

				if (iTime)
					setTimeout(function () {
						n.close();
					}, iTime);
			};

			//n.onerror;
			//n.onclose;
			return n;
		} else
			//Inform User ?
			if (window.Notification.permission == 'denied')
				return false;
			else
				//Ask for Permisson
				if (!this.__permission) {
					this.__permission = true;

					var me = this;
					this._setPermissions([function (perm) {
						if (perm == 'granted')
							me._value3(sTitle, sBody, aHandler, iTime, sGroup);
						// else
						// 	me._value2(sTitle, aHandler, iTime);
					}]);

					return true;
				}
	} else
		return false;
};

_me._getPermissions = function () {

	if (window.Notification) {
		if (!window.Notification.permission && window.webkitNotifications && window.webkitNotifications.checkPermission)
			window.Notification.permission = (['granted', 'default', 'denied'])[window.webkitNotifications.checkPermission()];

		return window.Notification.permission;
	} else
		return 'unsupported';
};

_me._setPermissions = function (aHandler) {
	if (this._getPermissions() == 'denied') {
		gui._create('ask_notify', 'frm_alert', '', '', [
			function () {
				if (aHandler)
					executeCallbackFunction(aHandler, 'denied');
			}
		], 'NOTIFIER::NOTIFIER', 'NOTIFIER::DENIED');
	} else
	if (this._getPermissions() != 'granted') {
		gui._create('ask_notify', 'frm_confirm_select', '', '', [
			function (v) {

				GWOthers.setItem('LAYOUT_SETTINGS', 'notifications', v, true);
				GWOthers.save();

				if (v != 2)
					window.Notification.requestPermission(function (perm) {
						window.Notification.permission = perm;

						if (aHandler)
							executeCallbackFunction(aHandler, perm);
					});
			}
		], 'NOTIFIER::NOTIFIER', 'NOTIFIER::PERMISSIONS', '', [getLang('SETTINGS::NOFOCUS'), getLang('SETTINGS::ALWAYS'), getLang('SETTINGS::NEVER')], GWOthers.getItem('LAYOUT_SETTINGS', 'notifications') || '0');

	}
};
