_me = frm_collaboration.prototype;

function frm_collaboration() {};

_me.__constructor = function (aValues, callback) {
	var me = this;

	this.__callback = callback;
	this._add_destructor('__onClose');

	this._resizable(false);
	this._modal(true);

	this._draw('frm_collaboration', 'main');

	this._size(700, window.innerHeight < 800 ? window.innerHeight : 'auto', true);

	this._create('obj_scrollbar', 'obj_scrollbar')._scrollbar(this._getAnchor('main'));

	this._title('COMMON::SHARE');

	function processing(disable) {
		me.enabled._disabled(disable);
		me.allowed_editing._disabled(disable);
		me.password_protected._disabled(disable);
		me.password._disabled(disable);
		me.save_password._disabled(disable);
	}

	this.enabled._onclick = function () {
		var enabled = me.enabled._checked();
		var editable = me.allowed_editing._value();
		var protected = me.password_protected._checked();
		var password = me.password._value();
		processing(true);
		TeamChatAPI[enabled ? 'filesUninvite' : 'filesInvite'].call(TeamChatAPI, {
			id: aValues.EVN_ID,
			editable: editable,
			password: protected ? password : ''
		}, {
			success: function (response) {
				processing(false);
				me.enabled._value(!!response.inviteticket);
				aValues.INVITETICKET = response.inviteticket;
				me.__addCloseButton();
			},
			error: function () {
				gui.notifier._value({
					type: 'alert',
					args: {
						header: '',
						text: 'ALERTS::FILE_LOCKED_EDIT'
					}
				});
				processing(false);
			}
		});
		return false;
	};

	this.enabled._onchange = function (event, enabled) {
		me._getAnchor('editing').classList[enabled ? 'remove' : 'add']('disabled');
		me._getAnchor('password').classList[enabled ? 'remove' : 'add']('disabled');
		me._getAnchor('share').classList[enabled ? 'remove' : 'add']('disabled');
	};

	this.allowed_editing._onclick = function () {
		var editable = me.allowed_editing._value();
		var protected = me.password_protected._checked();
		var password = me.password._value();
		processing(true);
		TeamChatAPI.filesInvite({
			id: aValues.EVN_ID,
			editable: !editable,
			password: protected ? password : ''
		}, {
			success: function () {
				processing(false);
				me.allowed_editing._value(!editable);
				me.__addCloseButton();
			},
			error: function () {
				processing(false);
			}
		});
		return false;
	};

	this.password_protected._onclick = function () {
		var editable = me.allowed_editing._value();
		var protected = me.password_protected._checked();
		var password = me.password._value();
		if (protected || password) {
			processing(true);
			TeamChatAPI.filesInvite({
				id: aValues.EVN_ID,
				editable: editable,
				password: protected ? '' : password
			}, {
				success: function () {
					processing(false);
					me.password_protected._value(!protected);
					me._getAnchor('password_protected').classList[!protected && password ? 'remove' : 'add']('hidden');
					me.__addCloseButton();
				},
				error: function () {
					processing(false);
				}
			});
			return false;
		}
	};

	this.password_protected._onchange = function (event, enabled) {
		var sharing_enabled = me.enabled._checked();
		me._getAnchor('password_container').classList[!enabled || !sharing_enabled ? 'add' : 'remove']('hidden');
		me._getAnchor('password_protected').classList[(enabled && me.password._value()) ? 'remove' : 'add']('hidden');
	};

	this.password._onkeydown = function (e) {
		if (e.keyCode === 13) {
			me.save_password._onclick();
			me.password._focus();
		}
	};

	this.password.__setMask({
			'toggle': ['', getLang('COMMON::SHOW')]
		},
		[function () {
			if (me.password.__eIN.getAttribute('type') === 'text') {
				me.password.__eIN.setAttribute('type', 'password');
			} else {
				me.password.__eIN.setAttribute('type', 'text');
			}
		}]);

	this.password._onchange = function () {
		if (me.__resetSavePasswordTimeout) {
			clearTimeout(me.__resetSavePasswordTimeout);
			me.__resetSavePassword();
		}

		me.save_password._main.classList[(me.password._value() === (aValues.EVNDOCPASS || '')) ? 'add' : 'remove']('hidden');
	};

	this.__resetSavePassword = function () {
		if (me.save_password) {
			me.save_password._disabled(false);
			me.save_password._value('FORM_BUTTONS::SAVE');
			me.save_password._main.classList.add('hidden');
		}
	};

	this.save_password._onclick = function () {
		var editable = me.allowed_editing._value();
		var password = me.password._value();
		processing(true);
		TeamChatAPI.filesInvite({
			id: aValues.EVN_ID,
			editable: editable,
			password: password
		}, {
			success: function () {
				processing(false);
				me.save_password._disabled(true);
				me.save_password._value('FORM_BUTTONS::SAVED');
				me.__resetSavePasswordTimeout = setTimeout(me.__resetSavePassword.bind(me), 2000);
				me._getAnchor('password_protected').classList[password ? 'remove' : 'add']('hidden');
				aValues.EVNDOCPASS = password;
				me.__addCloseButton();
			},
			error: function () {
				processing(false);
			}
		});
	};

	if (Item.officeSupport(aValues.EVNTITLE)) {
		this._getAnchor('editing').classList.remove('hidden');
	}

	this.enabled._value(!!aValues.INVITETICKET);
	this.enabled._onchange(void 0, !!aValues.INVITETICKET);
	this.allowed_editing._value(aValues.EVNDOCEDITABLE === '1');
	if (aValues.EVNDOCPASS) {
		this.password._value(aValues.EVNDOCPASS.unentityify());
		this._getAnchor('password_container').classList.remove('hidden');
	}
	this.password_protected._value(!!aValues.EVNDOCPASS);
	this._getAnchor('password_protected').classList[aValues.EVNDOCPASS ? 'remove' : 'add']('hidden');

	this._getAnchor('copy_to_clipboard').addEventListener('click', function () {
		var input = document.createElement('input');
		input.style.opacity = 0;
		input.value = aValues.INVITETICKET;
		document.body.appendChild(input);
		input.select();
		document.execCommand('copy');
		input.parentElement.removeChild(input);
		me.__addCloseButton();
		me._getAnchor('link_copied').classList.remove('hidden');
	});

	this._getAnchor('email_toggle').addEventListener('click', function () {
		me._getAnchor('email_container').classList.remove('hidden');
	});

	this.address_book._onclick = function () {
		gui._create('address_book', 'frm_addaddress', '', '', [me, '__onAddNewFromAddressbook'], ['ADDRESS_BOOK::SELECTED_ADDRESSES'], void 0, void 0, void 0, void 0, true, me._isModal());
	};

	this.send_email._onclick = function () {
		var emails = (me.email._value() || '').split(',');
		var length = emails.length;
		if (length) {
			me.send_email._disabled(true);
		}
		emails.forEach(function (sEmail) {
			var email = MailAddress.splitEmailsAndNames(sEmail);
			if (email && (email = email[0]) && (email = email.email)) {

				WMItems.action({
					aid: aValues.aid,
					fid: aValues.fid,
					iid: aValues.EVN_ID,
					values: {
						EMAIL: email
					}
				}, 'notify_item', [function () {
					if (!--length) {
						me.email._value('');
						me.send_email._disabled(false);
						me.__openSuccessPage(emails.map(function(sEmail) {
							return MailAddress.splitEmailsAndNames(sEmail)[0].email;
						}));
					}
				}]);
			}
		});
	};

	if (aValues.EVNLOCKOWN_ID && aValues.EVNLOCKOWN_ID !== sPrimaryAccountGWID) {
		processing(true);
	}

	var f = dataSet.get('folders', [sPrimaryAccount]);
	var has_teamchat = sPrimaryAccountTeamchatToken && Object.keys(f).some(function (k) {
		return f[k].TYPE === 'I';
	});
	if (has_teamchat) {
		this._getAnchor('teamchat').classList.remove('hidden');

		this._getAnchor('teamchat_toggle').addEventListener('click', function () {
			me._getAnchor('teamchat_container').classList.remove('hidden');
		});

		this.teamchat._onchange = function () {
			var a = MailAddress.splitEmails(this._value()),
				l = a.length;

			if (l > 1) {
				this._value(a.pop());
			}
		};

		this.lbl_chat._onclick = function (e) {
			var sFolder,
				f = Cookie.get(['last']);

			if (f && (f = f['I']) && (f = Path.split(f)) && WMFolders.getType(f) == 'I') {
				sFolder = f[1];
			} else {
				var f = dataSet.get('folders', [sPrimaryAccount]);
				for (var id in f) {
					if (f[id].TYPE == 'I') {
						sFolder = id;
						break;
					}
				}
			}

			sFolder && gui._create('frm_select_folder', 'frm_select_folder', '', '', 'CHAT::SELECT', sPrimaryAccount, sFolder,
				[function (aid, fid) {
					var sName = dataSet.get('folders', [aid, fid, 'NAME']) || dataSet.get('folders', [aid, fid, 'RELATIVE_PATH']) || '';
					if (sName.length) {
						fid += '::' + sName;
						me.teamchat._value('[' + fid + ']');
					}
				}], true, true, ['Y', 'I'], '', true
			);
		};

		this.send_teamchat._onclick = function () {
			var tc = me.teamchat._value(),
				folder;
			if (!tc) {
				return;
			}
			me.send_teamchat._disabled(true);
			folder = tc.split('[')[1].split('::')[0];
			WMItems.action({
				"aid": aValues.aid,
				"fid": aValues.fid,
				"iid": aValues.EVN_ID,
				nodes: {
					note: '',
					folder: folder
				}
			}, 'document_link', [function () {
				me.teamchat._value('');
				me.send_teamchat._disabled(false);
				me.__openSuccessPage([tc.split('::')[1].replace(/\]$/, '')]);
			}]);
		};
	}

	this.reset_link._onclick = function() {
		gui._create('confirm', 'frm_confirm', '', '', [function() {
			WMItems.action({
				aid: aValues.aid,
				fid: aValues.fid,
				iid: aValues.EVN_ID
			}, 'collaboration_reset', [function (_, response) {
				if(me.__callback && me.__callback[0]) {
					me.__callback[0] = me.__callback[0].bind(null, response.IQ[0].RESULT[0].ID[0].VALUE);
				}
				me._destruct();
			}]);
		}], 'COLLABORATION::RESET_LINK', 'COLLABORATION::RESET_LINK_HELPER');
	};

	this.back._onclick = function() {
		me.__closeSuccessPage();
	};
	this.__closeSuccessPage();
};

_me.__openSuccessPage = function (recipients) {
	this.__addCloseButton();
	this._getAnchor('content').classList.add('hidden');
	this._getAnchor('success').classList.remove('hidden');
	if(recipients.length > 1) {
		this._getAnchor('text').innerHTML = getLang('COLLABORATION::SUCCESS_MESSAGE_MULTIPLE', [
			mkElement('span', {
				className: 'name',
				textContent: recipients[0]
			}).outerHTML,
			mkElement('span', {
				className: 'others',
				textContent: getLang('COLLABORATION::SUCCESS_MESSAGE_OTHER' + (recipients.length > 2 ? 'S' : ''), [recipients.length - 1])
			}).outerHTML
		]);
		gui.tooltip._add(this._getAnchor('success').querySelector('.others'), recipients.slice(1).map(function(recipient) {
			return recipient.entityify();
		}).join('<br>'), { hide:false, css:'dark pad', html: true });
	} else {
		this._getAnchor('text').innerHTML = getLang('COLLABORATION::SUCCESS_MESSAGE', [
			mkElement('span', {
				className: 'name',
				textContent: recipients[0]
			}).outerHTML
		]);
	}
};

_me.__closeSuccessPage = function () {
	this._getAnchor('success').classList.add('hidden');
	this._getAnchor('content').classList.remove('hidden');
};

_me.__addCloseButton = function () {
	var me = this;
	if (!this.x_btn_ok) {
		// Create 'OK' button
		this._create('x_btn_ok', 'obj_button', 'footer', '');
		this.x_btn_ok._tabIndex();
		this.x_btn_ok._value('FORM_BUTTONS::CLOSE');
		this.x_btn_ok._onclick = function() {
			this._disabled(true);
			me._destruct();
		};
	}
};

_me.__onAddNewFromAddressbook = function (bOK, aAddresses) {
	if (bOK && aAddresses && aAddresses[0]) {
		var emails = this.email._value().split(',');
		for (var i in aAddresses[0]) {
			emails.push(aAddresses[0][i]);
		}
		this.email._value(emails.filter(function(v, i, s) {
			return s.indexOf(v) === i;
		}).join(','));
	}
};

_me.__onClose = function () {
	executeCallbackFunction(this.__callback);
};
