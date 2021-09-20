/*
	@EVNCLASS types:
		''    None
		'I'   Simple text   ( eventclassgroupchat )
		'E'   Event
		'F'   File
		'M'   Mail

		***  Links ***
		'B'   Simple text link
		'Q'   Event link
		'R'   File link
		'Y'   Mail link
		'Z'   Document link
		'S'   Webmeeting link
		'W'   Account link
		'D'   Link to link
*/

(function () {
	function folderChangeHandler() {
		this.rooms = 0;
		this.chats = 0;
	}
	folderChangeHandler.prototype.__update = function (set, path) {
		if (set !== 'folders') {
			return;
		}
		var folders_raw = dataSet.get('folders', [sPrimaryAccount]);
		var rooms = 0, chats = 0;
		Object.keys(folders_raw).filter(function (folder_name) {
			return folders_raw[folder_name].TYPE === 'I';
		}).forEach(function (folder_name) {
			if (folders_raw[folder_name].RECENT && folders_raw[folder_name].RECENT !== 0) {
				rooms++;
				chats += +folders_raw[folder_name].RECENT;
			}
		});
		if (rooms !== this.rooms || chats !== this.chats) {
			this.rooms = rooms;
			this.chats = chats;
			TeamChatAPI.Notifier.action('recentchats', {rooms: rooms, chats: chats});
		}
	};


	/**
	 * Get data from url params
	 * @returns {unresolved}
	 */
	function getURLParams() {
		var data = {};
		if (!location.search) {
			return data;
		}
		var regex = /\??([^&]+?)(?:=([^&]+?))?(?=(?:&|#|$))/g;
		var result;
		while ((result = regex.exec(location.search)) !== null) {
			data[result[1]] = result[2] || '';
		}
		return data;
	}

	/**
	 * Send XHR
	 * @param {string} url
	 * @param {object} data
	 * @param {object} callback
	 * @param {boolean} [usePost]
	 * @returns {undefined}
	 */
	function xhr(url, data, callback, usePost) {

		for (var i in data) {
			data[i] = (typeof data[i] === 'Boolean') ? +data[i] : data[i];
		}

		var request = new XMLHttpRequest();
		if(usePost) {
			request.open('POST', url);
		} else {
			request.open("GET", url + '?' + buildURL(data));
		}
		if (callback) {
			request.onload = function () {
				var response = JSON.parse(this.response);
				if (response.ok) {
					callback.success && callback.success.call(callback.context, response);
				} else {
					callback.error && callback.error.call(callback.context, response);
				}
			};
			callback.abort && (request.onabort = callback.abort.bind(callback.context));
			callback.error && (request.onerror = callback.error.bind(callback.context));
			callback.progress && (request.onprogress = callback.progress.bind(callback.context));
		}
		request.send(usePost ? buildURL(data) : data);
	}

	/**
	 * Notify local server
	 * @param {string} action
	 * @param {object} data
	 * @returns {undefined}
	 */
	function notify(action, data) {
		data.action = action;
		data.token = TeamChatAPI.getToken();
		xhr(TeamChatAPI.getNotifyURI(), data);
	}

	/**
	 * Listener on status change notification
	 * @param {array} users
	 * @returns {undefined}
	 */
	function onStatusChange(users) {
		TeamChatAPI.Notifier.notify({type: 'status_change', email: users[0].ATTRIBUTES.STATUSEMAIL, status: +users[0].ATTRIBUTES.STATUSID});
	}
	/**
	 * Saved rooms objects
	 * @type object
	 */
	var rooms = {};
	/**
	 * Get folder object by owner and relative path
	 * @param {string} owner
	 * @param {string} relative_path
	 * @returns {object}
	 */
	function getFolderByRelativePath(owner, relative_path) {
		var folders = dataSet.get('folders', [sPrimaryAccount]);
		if (!rooms[owner]) {
			rooms[owner] = {};
		}
		if (rooms[owner][relative_path]) {
			return rooms[owner][relative_path];
		}
		for (var id in folders) {
			if (folders[id].OWNER === owner && folders[id].RELATIVE_PATH === relative_path) {
				return rooms[owner][relative_path] = {id: id, folder: folders[id]};
			}
		}
	}
	/**
	 * Listener on notification
	 * @param {object} attr
	 * @returns {undefined}
	 */
	function onNotify(attr) {

		if (attr['FOLDER-TYPE'] == 'I'){

			var room = getFolderByRelativePath(attr.EMAIL, attr.FOLDER.replace(/\\/g, '/'));
			if (Is.Defined(room)){
				if(~['comment'].indexOf(attr.ACTION)){
					return;
				}

				TeamChatAPI.Notifier.notify({
					type: 'notification',
					notification_action: attr.ACTION,
					body: attr.TITLE || attr.BODY,
					from: attr['ORIGINATOR-NAME'],
					deviceid: attr['ORIGINATOR-DEVICEID'],
					'item-type': attr['ITEM-TYPE'],
					room_id: room.id,
					room_name: room.folder.NAME
				});

			}
		}
		else{
			var callback;
			if (attr.ACTION == 'edit_session_finished' && attr['ITEM'] && (callback = edit_buffer[attr['ITEM']])){
				callback && callback.success && callback.success.call(callback.context || this);
				delete edit_buffer[attr['ITEM']];
			}
		}
	}

	/**
	 * Edited documents buffer for 'edit_session_finished' call
	 */
	var edit_buffer = {};

	/**
	 * network status
	 * @type Boolean
	 */
	var network_status = true;
	/**
	 * Timer
	 * @type Boolean
	 */
	var network_timer = false;
	/**
	 * Listener on connection queue
	 * @returns {undefined}
	 */
	function onConnectionQueue() {
		if (!network_status) {
			return;
		}
		network_status = false;
		TeamChatAPI.Notifier.network(network_status);
	}
	/**
	 * Listener on connection flush
	 * @returns {undefined}
	 */
	function onConnectionFlush() {
		if (network_timer) {
			clearTimeout(network_timer);
		}
		network_status = true;
		network_timer = setTimeout(function () {
			network_status && TeamChatAPI.Notifier.network(network_status);
		}, 500);
	}
	/**
	 * Listener on GUI fully louded
	 * @returns {undefined}
	 */
	function onGUIDone() {
		TeamChatAPI.Notifier.loaded();
	}

	var TeamChatAPI = {};
	TeamChatAPI.url_params = false;

	/**
	 * Initialize teamchat API
	 * @returns {TeamChatAPI}
	 */
	TeamChatAPI.init = function () {

		if (!this.url_params) {
			this.url_params = getURLParams();
		}
		if (!this.listening) {
			this.listening = true;
			gui.socket && gui.socket.api._obeyEvent('onStatusChange', [onStatusChange]);
			gui.socket && gui.socket.api._obeyEvent('onnotify', [onNotify]);
			gui.connection._obeyEvent('_queue', [onConnectionQueue]);
			gui.connection._obeyEvent('_flush', [onConnectionFlush]);
			gui._obeyEvent('GUIDone', [onGUIDone]);
			dataSet.obey(new folderChangeHandler(), '_listener', 'folders');
			if (this.url_params.tconly) {
				window.onbeforeunload = null;
				this.hideAllButTeamChat();
			}
		}
		return this;
	};

	TeamChatAPI.hideAllButTeamChat = function () {
		storage.css('frm_main_desktop');
		document.body.setAttribute('tconly', true);
	};

	/**
	 * check webmail flag teramchat_only
	 * @returns {boolean}
	 */
	TeamChatAPI.teamChatOnly = function () {
		return !!this.init().url_params.tconly;
	};
	/**
	 * get Token
	 * @returns {string}
	 */
	TeamChatAPI.getToken = function () {
		return this.init().url_params.token;
	};
	/**
	 * get notify url
	 * @returns {string}
	 */
	TeamChatAPI.getNotifyURI = function () {
		return this.init().url_params.notifyuri;
	};

	TeamChatAPI.Notifier = {};

	/**
	 * Ping local server
	 * @returns {undefined}
	 */
	TeamChatAPI.Notifier.ping = function () {
		TeamChatAPI.teamChatOnly() && notify('ping', {});
	};
	/**
	 * Notify local server with custom action
	 * @param {string} action action you want to call
	 * @param {type} [data] to send
	 * @returns {undefined}
	 */
	TeamChatAPI.Notifier.action = function (action, data) {
		TeamChatAPI.teamChatOnly() && notify(action, data || {});
	};
	/**
	 * Notify local server
	 * @param {object} data
	 * @returns {undefined}
	 */
	TeamChatAPI.Notifier.notify = function (data) {
		TeamChatAPI.teamChatOnly() && notify('notify', data || {});
	};
	/**
	 * GUI is fully loaded
	 * @param {object} data
	 * @returns {undefined}
	 */
	TeamChatAPI.Notifier.loaded = function (data) {
		TeamChatAPI.teamChatOnly() && notify('loaded', data || {});
	};
	/**
	 * Network notifier
	 * @param {boolean} status
	 * @returns {undefined}
	 */
	TeamChatAPI.Notifier.network = function (status) {
		TeamChatAPI.teamChatOnly() && notify('loaded', {status: status ? 'online' : 'offline'});
	};

	/**
	 * Change teamchat view
	 * @example TeamChatAPI.changeView('Public Folders/TeamChat/test');
	 * @param {string} folder_id id of folder ()
	 * @param {string} [account] account, optional, if not present primary account is used
	 * @returns {undefined}
	 */
	TeamChatAPI.changeView = function (folder_id, account) {

		account = account || sPrimaryAccount;
		if (!folder_id) {
			console.error("Missing folder ID");
			return this;
		}
		gui.frm_main._selectView({aid: account, fid: folder_id});
		dataSet.add('active_folder', false, account + '/' + folder_id);
		//gui.frm_main.bar.tree.folders._setActive(account + '/' + folder_id);
		return this;
	};
	/**
	 * @example TeamChatAPI.changeViewByRelative('public-folders@yourdomain.com', 'TeamChat/test');
	 * Change view by relative path and owner
	 * @param {string} owner
	 * @param {string} relative_path
	 * @param {string} [account]
	 * @returns {TeamChatAPI}
	 */
	TeamChatAPI.changeViewByRelativePath = function (owner, relative_path, account) {
		if (!owner) {
			console.error("Missing owner");
			return this;
		}
		if (!relative_path) {
			console.error("Missing relative path");
			return this;
		}
		var folders = dataSet.get('folders', [account || sPrimaryAccount]);
		for (var id in folders) {
			if (folders[id].OWNER === owner && folders[id].RELATIVE_PATH === relative_path) {
				return this.changeView(id, account);
			}
		}
		console.error("No match for given input");
		return this;
	};
	/**
	 * @example TeamChatAPI.search('searched text');
	 * @param {string} query query to search
	 * @returns {TeamChatAPI}
	 */
	TeamChatAPI.search = function (query) {
		var chat_object = gui.frm_main.main.tabs.room.list;
		chat_object._serverSort(chat_object.__aRequestData.folder, true, {search: query});
		return this;
	};
	/**
	 * Reset search, equivalent of TeamChatAPI.search with empty string
	 * @returns {TeamChatAPI}
	 */
	TeamChatAPI.searchReset = function () {
		this.search('');
		return this;
	};
	/**
	 * Request data for document editing
	 * @param {object} aData
	 * @param {number} mode
	 * @param {function} callback
	 * @returns {TeamChatAPI}
	 */
	TeamChatAPI.filesEdit = function (aData, mode, callback) {
		var data = {
			token: sPrimaryAccountTeamchatToken,
			deviceid: dataSet.get('main', ['device_id']),
			mode: mode,
			fallback: 0
		};

		if(aData.password) {
			data.password = aData.password;
		}

		if (aData.ticket){
			data.ticket = aData.ticket;
		}
		else
		if (aData.url) {
			data.url = aData.url;
		} else {
			data.id = aData.iid.replace('*', '');
			aData.attid && (data.attid = aData.attid);
		}

		data._ = +new Date();

		xhr(sTeamchatApiUrl + 'files.edit', data, callback, true);
		return this;
	};
	/**
	 * Call to release the document
	 * @param {object} aData
	 * @param {function} callback
	 * @returns {TeamChatAPI}
	 */
	TeamChatAPI.filesStopEdit = function (aData, callback, finish_cb) {
		var data = {
			token: sPrimaryAccountTeamchatToken,
			deviceid: dataSet.get('main', ['device_id'])
		};

		if (aData.ticket){
			data.ticket = aData.ticket;
		}
		else
		if (aData.url) {
			data.url = aData.url;
		}
		else {
			data.id = aData.iid.replace('*', '');
			aData.attid && (data.attid = aData.attid);

			//edit_session_finished
			edit_buffer[data.id] = finish_cb;
		}
		data._ = +new Date();

		xhr(sTeamchatApiUrl + 'files.stopedit', data, callback);
		return this;
	};
	/**
	 * Call to create share link
	 * @param {object} aData
	 * @param {function} callback
	 * @returns {TeamChatAPI}
	 */
	TeamChatAPI.filesInvite = function (aData, callback) {
		var data = {
			token: sPrimaryAccountTeamchatToken,
			id: aData.id,
			editable: +aData.editable,
			deviceid: dataSet.get('main', ['device_id'])
		};
		if(aData.password) {
			data.password = aData.password;
		}

		xhr(sTeamchatApiUrl + 'files.invite', data, callback, true);
		return this;
	};

	TeamChatAPI.filesUninvite = function (aData, callback) {
		var data = {
			token: sPrimaryAccountTeamchatToken,
			id: aData.id,
			deviceid: dataSet.get('main', ['device_id'])
		};

		xhr(sTeamchatApiUrl + 'files.uninvite', data, callback);
		return this;
	};

	/**
	 * Get Teamchat Notification Settings
	 * @param {function} callback
	 */
	TeamChatAPI.getTeamchatNotificationSettings = function(callback) {
		WMStorage.get({
			'resources': [
				'teamchat_notify'
			]
		}, 'storage', '', callback && [function() {
			callback(GWOthers.get('TEAMCHAT_NOTIFY','storage').VALUES);
		}], true);
	};

	/**
	 * Set Teamchat Notification Settings
	 * @param {object} settings
	 * @param {function} callback
	 */
	TeamChatAPI.setTeamchatNotificationSettings = function(settings, callback) {
		var values = {};
		for(var i in settings) {
			values[i] = {
				ATTRIBUTES: {},
				VALUE: settings[i]
			};
		}
		var resources = {
			TEAMCHAT_NOTIFY: {
				ATTRIBUTES: {},
				ITEMS: [{
					ATTRIBUTES: {},
					VALUES: values
				}]
			}
		};
		WMStorage.set({resources: resources}, 'storage', '', callback && [callback]);
	};

	/**
	 * Request UnLock
	 * @param {array} id
	 * @param {string} sTitle
	 * @param {string} sEmail
	 * @param {string} sType
	 */
	TeamChatAPI.requestUnlock = function (sFolder, sTitle, sEmail, sType) {
		var room = dataSet.get('folders', [sPrimaryAccount, sFolder]);
		var group = '';

		if (room.TYPE == 'I' && room.NAME){
			group = sFolder.split('/');
			group.splice(-1, 1, room.NAME);
			group = group.join('/');
		}

		var body_header = getLang('DOCUMENT::REQUEST_UNLOCK_TEXT_GREETINGS', [dataSet.get('xmpp', ['roster', sEmail, 'name']) || sEmail]),
			body = getLang(sType == 'remove'?'DOCUMENT::REQUEST_UNLOCK_REMOVE':'DOCUMENT::REQUEST_UNLOCK_TEXT', [sTitle, (group || room.NAME || room.RELATIVE_PATH)]);

		if(!dataSet.get('xmpp', ['roster', sEmail]) || ~['both', 'none', 'offline', '', void 0].indexOf(dataSet.get('xmpp', ['roster', sEmail, 'show']))) {
			if ((TeamChatAPI && TeamChatAPI.teamChatOnly()) || sPrimaryAccountGUEST) {
				Item.sendEmailTo(sEmail, {sBody: '<div>' + body_header + '</div><div><br></div><div>' + body + '</div>', sSubject: getLang('DOCUMENT::REQUEST_UNLOCK_TEXT_SUBJECT', [(group || room.NAME || room.RELATIVE_PATH) + '/' + sTitle]), addSignature: false});
			} else {
				NewMessage.compose({
					to: sEmail,
					subject: getLang('DOCUMENT::REQUEST_UNLOCK_TEXT_SUBJECT', [(room.NAME || room.RELATIVE_PATH) + '/' + sTitle]),
					mailBody: '<div>' + body_header + '</div><div><br></div><div>' + body + '</div>'
				});
			}
		} else {
			gui.frm_main.im._activate(sEmail);
			gui.frm_main.im._chat(sEmail);
			gui.frm_chat.tabs[gui.frm_chat.tabs._value()].text._value(body);
			gui.frm_chat._focus();
		}
	};

	window.TeamChatAPI = TeamChatAPI;
}());
