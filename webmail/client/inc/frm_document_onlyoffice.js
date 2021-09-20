function frm_document_onlyoffice() {}

frm_document_onlyoffice.types = {
	text: ['doc', 'docx', 'dot', 'docm', 'dotx', 'dotm', 'docb', 'odt', 'rtf'],
	spreadsheet: ['xls', 'csv', 'xlsx', 'xla', 'xlam', 'xlsb', 'ods', 'xlsb', 'xlsm', 'xlt', 'xltm', 'xltx'],
	presentation: ['ppt', 'pptx', 'odp', 'pps', 'ppsm', 'ppsx', 'pptm', 'ppa', 'ppam']
};

frm_document_onlyoffice.prototype.__constructor = function () {
	this._defaultSize(-1, -1, 1200, 800, true);
	this._title('DOCUMENT::TITLE');

	this._create('loader', 'obj_loader');

	this._draw('frm_document_onlyoffice', 'main');

	this.__id = 'onlyoffice_placeholder' + unique_id();
	this._getAnchor('editor').appendChild(mkElement('div', {id: this.__id}));

	if (typeof DocsAPI === typeof void 0) {
		document.head.appendChild(mkElement('script', {src: '/webdocuments/web-apps/apps/api/documents/api.js'}));
	}

	this.__document_changed = false;
	this.__document_saved = true;
};

frm_document_onlyoffice.prototype._ondock = function(){
	return this.__document_type?{css: 'ico_' + this.__document_type}:{};
};

frm_document_onlyoffice.prototype._getType = function (url) {
	var a = document.createElement('a');
	a.href = url;
	a = a.pathname.split('/').pop().split('.').pop().toLowerCase();
	var type;
	for(var i in frm_document_onlyoffice.types) {
		if(~frm_document_onlyoffice.types[i].indexOf(a)) {
			type = i;
		}
	}
	return type;
};

frm_document_onlyoffice.prototype._open = function (aItemInfo, mode, reopen_arguments, response, callback) {
	if (!Is.Object(aItemInfo)) {
		return;
	}
	if ((aItemInfo.EVN_ID && aItemInfo.EVNTITLE) || !(aItemInfo.aid && aItemInfo.fid)){
		this._open_success(aItemInfo, mode, reopen_arguments, response, callback);
	}
	else{
		WMItems.list(aItemInfo, '','','',[function(aData){
			aData = aData[aItemInfo.aid][aItemInfo.fid][WMItems.__clientID(aItemInfo.iid)];
			aItemInfo.EVNTITLE = aItemInfo.attid || aData.EVNTITLE;
			//Object.assign(aItemInfo, aData);
			this._open_success(aItemInfo, mode, reopen_arguments, response, callback);
		}.bind(this)]);
	}
};

frm_document_onlyoffice.prototype._open_success = function (aItemInfo, mode, reopen_arguments, response, callback) {

	//File is not found
	if (Is.Object(response) && response.data && (!response.data.document || !response.data.document.fileType)) {
		gui.notifier._value({type: 'alert', args: {text: 'ALERTS::FILE_NOT_FOUND'}});
		this._destruct();
		return;
	}

	if (callback) {
		this.callback = callback;
	}

	var wmpath = document.location.origin + document.location.pathname;

	if (typeof DocsAPI === typeof void 0) {
		return setTimeout(function () {
			this._open(aItemInfo, mode, reopen_arguments, response);
		}.bind(this), 50);
	}

	if(+DocsAPI.DocEditor.version().split('.')[0] > 4) {
		this._main.className += ' ribbon';
	}
	if(+DocsAPI.DocEditor.version().split('.')[0] > 5) {
		this._main.classList.add('hide-topbar');
	}

	var data = aItemInfo;
	if(!aItemInfo.url) {
		var d = dataSet.get('items', [aItemInfo.aid, aItemInfo.fid, aItemInfo.iid]);
		if (d) {
			for(var i in d) {
				data[i] = d[i];
			}
		}
	}

	data.EVNTITLE && this._title(data.EVNTITLE, true);

	//this.loader && this.loader._main && this.loader._main.parentNode.removeChild(this.loader._main);
	gui.socket && gui.socket.api._obeyEvent('onnotify', [this, '__notify']);

	this.aItemInfo = {
		aid: aItemInfo.aid,
		fid: aItemInfo.fid,
		iid: aItemInfo.iid,
		url: aItemInfo.url,
		ticket: aItemInfo.ticket,
		attid: aItemInfo.attid
	};
	this.reopen_arguments = reopen_arguments;
	this.mode = response.mode;
	response.data.documentType = response.data.documentType || this._getType(aItemInfo.url) || 'text';
	response.data.editorConfig = response.data.editorConfig || {};

	response.data.document.fileType = (response.data.document.fileType || response.data.document.filetype).toLowerCase();

	response.data.editorConfig.customization = response.data.editorConfig.customization || {};
	//response.data.editorConfig.customization.loaderLogo = location.origin + '/' + ;
	response.data.editorConfig.customization.about = false;
	response.data.editorConfig.customization.chat = false;
	response.data.editorConfig.customization.feedback = false;
	response.data.editorConfig.customization.logo = {
		image: wmpath + 'client/skins/default/images/transparent.gif',
		url: 'javascript: return false;'
	};
	//response.data.editorConfig.customization.loaderLogo = './client/skins/'+ GWOthers.getItem('LAYOUT_SETTINGS', 'skin') + '/images/flow_loader.gif';
	response.data.editorConfig.lang = GWOthers.getItem('LAYOUT_SETTINGS', 'language') || 'en';
	response.data.events = {
		onDocumentStateChange: function(event) {
			this.__document_changed = this.__document_changed || event.data;
			this.__document_saved = !event.data;
		}.bind(this),
		onAppReady: function() {
			var doc = this.__eMain.querySelector('iframe').contentWindow.document;

			doc.head.appendChild(mkElement('link', {
				rel: 'stylesheet',
				type: 'text/css',
				href: wmpath + 'client/skins/default/css/onlyoffice.css'
			}));
			doc.head.appendChild(mkElement('link', {
				rel: 'stylesheet',
				type: 'text/css',
				href: wmpath + 'client/skins/default/css/onlyoffice_' + response.data.documentType + '.css'
			}));

			doc.body.addEventListener('click', function(e){
				this._focus();
			}.bind(this), true);

			this.loader && this.loader._destruct();

		}.bind(this),

		onWarning: function (event) {
			console.warn("ONLYOFFICE Document Editor reports an warning: code " + event.data.warningCode + ", description " + event.data.warningDescription);
		},
		onError: function (event) {
			console.warn("ONLYOFFICE Document Editor reports an error: code " + event.data.errorCode + ", description " + event.data.errorDescription);
		}
	};
	this._editor = new DocsAPI.DocEditor(this.__id, response.data);

	if (WMFolders.getType(aItemInfo) == 'I' && mode != response.mode && response.mode == 1){
		this.__readonly();
		gui.notifier._value({type: 'alert', args: {text: 'ALERTS::COULD_NOT_EDIT'}});
	}
	else
	if(response.data.editorConfig.mode === 'view') {
		this.__readonly(false, reopen_arguments.has_access);
	}

	if (data) {
		if (data.EVNLINKEXTRAS) {
			var extras = parseURL(data.EVNLINKEXTRAS);
			for (var i in extras) {
				data[i.toUpperCase()] = data[i.toUpperCase()] || extras[i];
			}
		}
		if (data.EVN_DOCUMENTEDITINGINFO) {
			var document_editing_info;
			try {
				document_editing_info = JSON.parse(data.EVN_DOCUMENTEDITINGINFO);
				data.EVNLOCKOWN_EMAIL = data.EVNLOCKOWN_EMAIL || document_editing_info.editor_email;
			} catch (e) {

			}
		}
		if (data.EVNLOCKOWN_EMAIL && data.EVNLOCKOWN_EMAIL !== sPrimaryAccount) {
			this.__readonly(data);
		}
	}

	//Set document type for Icon
	addcss(this._main, 'ico_' + response.data.documentType);
	this.__document_type = response.data.documentType;

	//CHAT & COMMENTS
	if (data.EVNCLASS === 'R' || data.EVNCLASS === 'Z'){
		addcss(this._main, 'chat');

		this.btn_bubble._onclick = function(){
			Cookie.set(['aux', 'comments_info'], 1);

			removecss(this._main, 'splash', 'chat-new');
			addcss(this._main, 'chat-open');
		}.bind(this);

		this._getAnchor('chat_room').textContent = dataSet.get('folders',[data.aid, data.fid, 'NAME']);

		this._getAnchor('chat_icon').onclick = function(e){
			this.btn_bubble._onclick();
		}.bind(this);

		this._getAnchor('chat_close').onclick = function(e){
			removecss(this._main, 'chat-open');
		}.bind(this);

		this._create('comment','obj_comment','comment', '', data);

		//splash screen
		if (!Cookie.get(['aux', 'comments_info']))
			setTimeout(function(){
				if (this && !this._destructed && !Cookie.get(['aux', 'comments_info']))
					addcss(this._main, 'splash');
			}.bind(this),500);
	}
};

frm_document_onlyoffice.prototype.__notify = function (aData) {

	if (this._destructed)
		return;

	switch(aData.ACTION){
		case 'unlock':
			var aFolder = dataSet.get('folders',[this.aItemInfo.aid, this.aItemInfo.fid]),
				rp = Path.slash(aData.FOLDER);

			if ((aFolder.RELATIVE_PATH === rp || this.aItemInfo.fid === rp) && aData.ITEM === WMItems.__serverID(this.aItemInfo.iid)){
				dataSet.add('items', [this.aItemInfo.aid, this.aItemInfo.fid, this.aItemInfo.iid, 'EVNLOCKOWN_EMAIL'], sPrimaryAccount);
				dataSet.add('items', [this.aItemInfo.aid, this.aItemInfo.fid, this.aItemInfo.iid, 'EVN_DOCUMENTEDITINGINFO'], '');
				this.__reload();
			}
			break;

		case 'comment':
			if (!hascss(this._main, 'chat-open')){
				addcss(this._main, 'chat-new');
			}
	}

};

frm_document_onlyoffice.prototype.__reload = function () {
	var panel = this.__eContainer.querySelector('.panel');
	panel && panel.parentNode.removeChild(panel);
	this.__eContainer.querySelector('.container2').classList.add('has-panel');

	this.__eContainer.appendChild(mkElement('div', {
		className: 'table panel'
	}, false, [
		mkElement('div', {
			className: 'cell'
		}, false, [
			mkElement('div', {
				className: 'label',
				textContent: getLang('DOCUMENT::READ_ONLY_MODE')
			})
		]),
		mkElement('div', {
			className: 'cell middle'
		}, false, [
			mkElement('div', {
				className: 'name',
				textContent: getLang('DOCUMENT::DOCUMENT_UNLOCKED')
			}),
			mkElement('div', {
				className: 'button',
				textContent: getLang('DOCUMENT::RELOAD'),
				onclick: function() {
					this._remove_destructor('_onclose');
					this._destruct();
					Item.officeOpen.apply(Item, this.reopen_arguments);
				}.bind(this)
			})
		]),
		mkElement('div', {
			className: 'cell last'
		}, false/*, [
			mkElement('div', {
				className: 'close',
				textContent: getLang('FORM_BUTTONS::CLOSE'),
				onclick: function() {
					var panel = this.__eContainer.querySelector('.panel');
					if(!panel) {
						return;
					}
					panel.parentNode.removeChild(panel);
					this.__eContainer.querySelector('.container2').classList.remove('has-panel');
				}.bind(this)
			})
		]*/)
	]));
};

frm_document_onlyoffice.prototype.__request = function (data) {
	var room = dataSet.get('folders', [sPrimaryAccount, this.aItemInfo.fid]);
	var group = '';

	if (room.TYPE == 'I' && room.NAME){
		group = this.aItemInfo.fid.split('/');
		group.splice(-1, 1, room.NAME);
		group = group.join('/');
	}

	var body = getLang('DOCUMENT::REQUEST_UNLOCK_TEXT', [data.EVNTITLE, (group || room.NAME || room.RELATIVE_PATH)]);
	var body_header = getLang('DOCUMENT::REQUEST_UNLOCK_TEXT_GREETINGS', [dataSet.get('xmpp', ['roster', data.EVNLOCKOWN_EMAIL, 'name']) || data.EVNLOCKOWN_EMAIL]);

	if(!dataSet.get('xmpp', ['roster', data.EVNLOCKOWN_EMAIL]) || ~['both', 'none', 'offline', '', void 0].indexOf(dataSet.get('xmpp', ['roster', data.EVNLOCKOWN_EMAIL, 'show']))) {
		if ((TeamChatAPI && TeamChatAPI.teamChatOnly()) || sPrimaryAccountGUEST) {
			Item.sendEmailTo(data.EVNLOCKOWN_EMAIL, {sBody: '<div>' + body_header + '</div><div><br></div><div>' + body + '</div>', sSubject: getLang('DOCUMENT::REQUEST_UNLOCK_TEXT_SUBJECT', [(group || room.NAME || room.RELATIVE_PATH) + '/' + data.EVNTITLE]), addSignature: false});
		} else {
			NewMessage.compose({
				to: data.EVNLOCKOWN_EMAIL,
				subject: getLang('DOCUMENT::REQUEST_UNLOCK_TEXT_SUBJECT', [(room.NAME || room.RELATIVE_PATH) + '/' + data.EVNTITLE]),
				mailBody: '<div>' + body_header + '</div><div><br></div><div>' + body + '</div>'
			});
		}
	} else {
		gui.frm_main.im._activate(data.EVNLOCKOWN_EMAIL);
		gui.frm_main.im._chat(data.EVNLOCKOWN_EMAIL);
		gui.frm_chat.tabs[gui.frm_chat.tabs._value()].text._value(body);
		gui.frm_chat._focus();
	}
};

frm_document_onlyoffice.prototype.__readonly = function (data, has_access) {
	this.__eContainer.querySelector('.container2').classList.add('has-panel');
	var panel = this.__eContainer.querySelector('.table.panel');
	panel && panel.parentNode.removeChild(panel);
	this.__eContainer.appendChild(mkElement('div', {
		className: 'table panel'
	}, false, [
		mkElement('div', {
			className: 'cell'
		}, false, [
			mkElement('div', {
				className: 'label',
				textContent: getLang('DOCUMENT::READ_ONLY_MODE')
			})
		]),
		data ? mkElement('div', {
			className: 'cell middle'
		}, false, [
			mkElement('div', {
				className: 'avatar'
			}, false, [
				mkElement('img', {
					src: getAvatarURL(data.EVNLOCKOWN_EMAIL)
				})
			]),
			mkElement('div', {
				className: 'name',
				textContent: getLang('DOCUMENT::NAME_IS_EDITING_THIS_DOCUMENT', [dataSet.get('xmpp', ['roster', data.EVNLOCKOWN_EMAIL, 'name']) || data.EVNLOCKOWN_EMAIL])
			}),
			mkElement('div', {
				className: 'button',
				textContent: getLang('DOCUMENT::REQUEST_UNLOCK'),
				onclick: function() {
					this.__request(data);
				}.bind(this)
			})
		]) : false,
		has_access ? mkElement('div', {
			className: 'cell middle'
		}, false, [
			mkElement('div', {
				className: 'button',
				textContent: getLang('DOCUMENT::SWITCH_TO_EDIT_MODE'),
				onclick: function() {
					this._remove_destructor('_onclose');
					this._destruct();
					this.reopen_arguments[3] = 'force_edit';
					Item.officeOpen.apply(Item, this.reopen_arguments);
				}.bind(this)
			})
		]) : false,
		mkElement('div', {
			className: 'cell last'
		})
	].filter(Boolean)));
};

frm_document_onlyoffice.prototype._onclose = function () {
	if (this.__closing)
		return;

	this.__closing = true;
	this._remove_destructor('_onclose');

	gui.socket && gui.socket.api._disobeyEvent('onnotify', [this, '__notify']);

	var timeout = setInterval(function() {
		if(this.__document_saved) {
			clearInterval(timeout);
			if (this.aItemInfo && (this.mode !== void 0) && this.mode !== 2) {

				var final_cb = {};

				TeamChatAPI.filesStopEdit(this.aItemInfo, {
					success: function () {
						if (this.__document_changed && this.callback && this.callback.success){
							this.callback.success.call(this.callback.context || null, final_cb);

							if (this.aItemInfo.url)
								final_cb.success && final_cb.success.call(final_cb.context || null);
						}

						(this._editor || {}).destroyEditor && this._editor.destroyEditor();
						this._destruct();
					},
					error: function () {
						console.error(arguments);
						this.__document_changed && this.callback && this.callback.error && this.callback.error.call(this.callback.context || null);
						(this._editor || {}).destroyEditor && this._editor.destroyEditor();
						this._destruct();
					},
					context: this
				},
				{
					success: function () {
						!this.aItemInfo.url && final_cb.success && final_cb.success.call(final_cb.context || null);
					},
					context: this
				});
			} else {
				this._destruct();
			}
		}
	}.bind(this), 50);
};
