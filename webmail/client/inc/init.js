// INIT script

/**
 * @brief : Initial class for IceWarp WebMail
 * @date  : 6.3.2006 19:01:49
 * @status: draft
 * @require: storage
 *

 ? check opener (for valid webmail window)
 - parse input vars to GLOBAL cookie_vars and url_vars
 - choose page ($page <- "login" <- cookie_vars <- url_vars)
 - check ID (!isset than page = login)
 - load settings (if doesnt exist in [opener.]dataset)
 - get Lang (depeds on settings)
 */

function cInit(aLogin) {

	//remove HTML
	document.getElementsByTagName('body')[0].innerHTML = '';

	//remove CSS
	/*
	 var elinks = document.getElementsByTagName('link');
	 for(var i=elinks.length-1;i>=0;i--){
	 elinks[i].disabled = true;
	 elinks[i].parentNode.removeChild(elinks[i]);
	 }
	 */

	//append index.css
	document.getElementsByTagName('head')[0].appendChild(mkElement('link', {"rel": 'stylesheet', "type": 'text/css', "href": 'client/skins/index.css'}));

	//Unique Session ID Number (to avoid avatar img cache)
	window.sSessionUID = unique_id();

	//Create httprequet
	window.request = new cRequest('server/webmail.php');

	//create gui
	window.gui = new Gui('gui');

	//bind loader to request
	window.request.onstart = function (xhr) {
		gui._loading(xhr, true);
	};
	window.request.onfinish = function (xhr) {
		gui._loading(xhr);
	};


	//registr function to global variable, must be here because it will be used
	window.oWM_INIT = this;

	//allowed content
	var allowed_get = {
		"page": 'index',
		"debug": null,
		"frm": null,
		"sid": null,
		"ref": null,
		"xml": null,
		"username": null,
		"password": null,
		"mailto": null,
		"subject": null,
		"body": null,
		"video": null,
		"conference": null,
		"cc": null,
		"bcc": null,
		'open': null,
		'telemetry': null,
		'from': null,
		'tconly': null,
		"RoomID": null,
		"PostID": null
	};

	//parse cookies and get vars
	gui._REQUEST_VARS = arrConcat(arrKeySlice(aLogin.get, allowed_get), arrKeySlice(parseURL(), allowed_get));

	if (aLogin.language)
		storage.language(aLogin.language);
	else {
		storage.library('gw_others');
		GWOthers.load(['layout_settings']);
		GWOthers.getItem('LAYOUT_SETTINGS', 'language');
		storage.language(GWOthers.getItem('LAYOUT_SETTINGS', 'language'));
	}

	//create connection manager
	gui._create('connection', 'obj_connection');
	gui._create('preloader', 'obj_loader');
	gui.preloader._value('');

	var erString = '';

	if (gui && !gui._REQUEST_VARS['frm'] && gui._REQUEST_VARS['sid']) {

		var sid = auth.login({"session": gui._REQUEST_VARS['sid'], "keep": gui._REQUEST_VARS['open'] ? true : false, "from": gui._REQUEST_VARS['from']});

		//Save referrer, WM will be redirected back to this adress after logout
		if (gui._REQUEST_VARS['ref'])
			dataSet.add('main', ['referrer_url'], gui._REQUEST_VARS['ref']);
		//hwn
		else
		if (location.hash.replace('#ref=', '').length < location.hash.length)
			dataSet.add('main', ['referrer_url'], location.hash.replace('#ref=', ''));
		else
		if (document.referrer && document.referrer != document.location.href) {

			var sRef = document.referrer, p;
			if ((p = sRef.indexOf('?')) > -1) {
				var aRef = parseURL(sRef.substr(p + 1));
				delete aRef.mid;
				delete aRef.msg;
				delete aRef.eid;
				delete aRef['_s[action]'];

				sRef = sRef.substr(0, p) + '?' + buildURL(aRef);
			}

			dataSet.add('main', ['referrer_url'], sRef);
		}

		//Add SID into dataset
		if (sid) {
			dataSet.add('main', ['sid'], sid);

			//start login sequence
			//this._checkBrowserVersion();
			this._continueLogin();
			return;
		} else {
			if (Is.Object(auth.error)) {
				switch (auth.error.id) {
					case 'login_account_valid':
						erString = 'ACCOUNT_DISABLED';
						break;
					case 'login_invalid':
					case 'session_no_user':
						erString = 'INVALID_LOGIN';
						break;
					case 'session_expired':
						erString = 'EXPIRED';
						break;
					case 'session_ip_mismatch':
						erString = 'IP_MISMATCH';
						break;
					default:
						console.error(auth.error);
				}
			} else
				erString = 'INVALID_LOGIN';
		}
	} else {
		//login
		try {
			var hash = location.hash.replace('#', '');
			if (hash.replace(':', '').length < hash.length) {
				var credentials = hash.split(':');
				gui._REQUEST_VARS['username'] = credentials[0];
				gui._REQUEST_VARS['password'] = credentials[1];
				location.hash = '#';
			} // allow to login using #
			var sid = auth.login({username: gui._REQUEST_VARS['username'], password: gui._REQUEST_VARS['password']});
		} catch (r) {
			erString = 'CONNECTION';
			sid = '';
		}

		if (sid && !auth.error) {
			//this._checkBrowserVersion();
			this._continueLogin();
			return;
		} else
		if (Is.Object(auth.error)) {
			switch (auth.error.id) {
				case 'db_auto_create':
					erString = 'NO_DB';
					break;
				case 'login_account_valid':
					erString = 'ACCOUNT_DISABLED';
					break;
				case 'login_invalid':
					erString = 'INVALID_LOGIN';
					break;
				case 'wm_disabled':
					erString = 'WC_DISABLED';
					break;
				case 'settings_user_set':
					erString = 'ACCESS_ERROR';
					break;
				case 'RSA':
					erString = 'INVALID_RSA';
			}
		}
	}

	//refresh
	this._goBack(arrConcat(aLogin.back || {}, {reason: erString}));

};

cInit.prototype._goBack = function (aParam) {
	storage.library('gw_others');

	var sURL = GWOthers.getItem('LAYOUT_SETTINGS', 'logout_url') || dataSet.get('main', ['referrer_url']) || (document.location.protocol + '//' + document.location.hostname + (document.location.port ? ':' + document.location.port : '') + document.location.pathname);
	if (sURL && !sURL.match(/^https?:\/\//)) {
		sURL = document.location.protocol + '//' + sURL;
	}
	if (aParam) {
		var eForm = mkElement('form', {method: 'POST', action: sURL, target: '_self', style: 'position: absolute;top:0;left:0;'});
		for (var i in aParam)
			eForm.appendChild(mkElement('input', {type: 'hidden', name: i, value: aParam[i]}));

		gui._main.appendChild(eForm);

		eForm.submit();
		return;
	}
};

/**
 * Login sequence
 * @note: moved from frm_login (4.7.2007 10:58:11)
 **/
cInit.prototype._continueLogin = function (b) {
	//re-create preloader in case of MSIE6
	if (!gui.preloader)
		gui._create('preloader', 'obj_loader');

	// [Sync] load of BIG JavaSript
	if (!gui._REQUEST_VARS['frm']) {

		if (gui.preloader)
			gui.preloader._value(getLang('PRELOADER::FRAMEWORK'));

		storage.library('javascript');

		if (gui.preloader)
			gui.preloader._value(getLang('PRELOADER::DOCEDIT'));
	}

	var old_skin = GWOthers.getItem('LAYOUT_SETTINGS', 'skin');

	// [Sync] load resources
	if (gui.preloader)
		gui.preloader._value(getLang('PRELOADER::SETTINGS'));

	GWOthers.load(['skins',
		'banner_options',
		'im',
		'sip',
		'chat',
		'mail_settings_default',
		'mail_settings_general',
		'login_settings',
		'layout_settings',
		'homepage_settings',
		'calendar_settings',
		'default_calendar_settings',
		'cookie_settings',
		'default_reminder_settings',
		'event_settings',
		'spellchecker_languages',
		'signature',
		'groups',
		'restrictions',
		'aliases',
		'read_confirmation',
		'global_settings',
		'paths',
		'streamhost',
		'password_policy',
		'fonts',
		'certificate',
		'timezones',
		'external_settings',
		'gw_mygroup',
		'default_folders',
		'documents']);

	//load font
	storage.css('font');

	//set font variant
	switch(GWOthers.getItem('LAYOUT_SETTINGS', 'font_weight')){
		case 'auto':
			if (!gui.__BROWSER.retina)
				break;
		case 'light':
			addcss(document.body,'light');
	}

	storage.language();

	var custom_codes = {
		cn: 'zh',
		dk: 'da',
		jp: 'ja',
		kr: 'ko',
		se: 'sv'
	};

	function translateCustomCode(code) {
		return custom_codes[code] || code;
	}

	storage.library('icewarpdate.min', 'calendar');
	IcewarpDate.Locale.setLocaleURL('client/inc/calendar/locale/');
	IcewarpDate.setCalendar(+GWOthers.getItem('LAYOUT_SETTINGS', 'alternative_calendar'), true);
	IcewarpDate.Locale.changeLocalizedFormat('L', CalendarFormatting.getFormat(+GWOthers.getItem('LAYOUT_SETTINGS', 'date_format')));
	IcewarpDate.Locale.changeLocalizedFormat('LT', +GWOthers.getItem('LAYOUT_SETTINGS', 'time_format') ? 'hh:mm a' : 'HH:mm');
	if (GWOthers.getItem('CALENDAR_SETTINGS', 'begin_on_today') != '0') {
		IcewarpDate.Locale.setCustomWeekStart((new IcewarpDate()).day());
		IcewarpDate.Locale.chooseLocale(translateCustomCode(GWOthers.getItem('LAYOUT_SETTINGS', 'language')));
	} else {
		IcewarpDate.Locale.setCustomWeekStart({monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6, sunday: 0}[GWOthers.getItem('CALENDAR_SETTINGS', 'week_begins')]);
	}

	IcewarpDate.Locale.chooseLocale(translateCustomCode(GWOthers.getItem('LAYOUT_SETTINGS', 'language')));
	// Clear already downloaded templates
	if (old_skin != GWOthers.getItem('LAYOUT_SETTINGS', 'skin'))
		storage.aStorage.template = {};

	// [Sync] load language
	if (gui.preloader)
		gui.preloader._value(getLang('PRELOADER::LANGUAGE'));
	storage.language(GWOthers.getItem('LAYOUT_SETTINGS', 'language'));

	//Browser Check
	switch (currentBrowser()) {
		case 'MSIE7':
			if (currentBrowser(true) <= 7)
				return;

		case 'Mozilla':
		case 'Opera':
		case 'Safari':
		case 'Chrome':
		case 'MSIE9':
		case 'MSIE11':
			break;

		default:
			if (!window.confirm(getLang('CONFIRMATION::BROWSER_WARNING_TEXT_UNSUPPORTED'))) {
				document.location.href = './basic/?sid=' + dataSet.get('main', ['sid']);
				return;
			}
	}

	//preload teamchat api (frm=main)
	storage.library('team_chat_api');

	// get accounts
	var aAccounts = WMAccounts.list();
	dataSet.add('accounts', '', aAccounts);
	
	if(!sPrimaryAccountGUEST) {
		//preload icewarp xml api
		storage.library('icewarpapi', 'icewarpapi');
		window.icewarpapi = IceWarpAPI();
	}

	// refresh main account & continue preloading...
	this.__refreshed = false;
	WMFolders.list({'aid': sPrimaryAccount}, 'folders', [sPrimaryAccount], [this, '_updatePreloader']);

	// Convert language codes to iso 639-1 and set as language localisation attribute
	var iso = {cn: 'zh', dk: 'da', jp: 'ja', kr: 'ko', se: 'sv'},
	lang = GWOthers.getItem('LAYOUT_SETTINGS', 'language');
	lang = document.documentElement.lang = iso[lang] || lang || 'en';
	// Detect text direction
	gui._rtl = !!~['ar', 'fa', 'he'].indexOf(lang);
	if(gui._rtl) {
		document.body.className += ' rtl';
	}

	/*// Compact interface
	if (GWOthers.getItem('LAYOUT_SETTINGS', 'compact_view') == 1)
		addcss(document.getElementsByTagName('body')[0], 'compact');*/

	// Add dropbox functionality if allowed
	var dbappkey = GWOthers.getItem('EXTERNAL_SETTINGS', 'dropbox_app_key') || '';
	if (GWOthers.getItem('RESTRICTIONS', 'disable_dropbox') != '1' && dbappkey.length) {
		var dropbox = document.createElement('script');
		dropbox.type = "text/javascript";
		dropbox.src = "https://www.dropbox.com/static/api/1/dropbox.js";
		dropbox.id = "dropboxjs";
		dropbox.setAttribute('data-app-key', dbappkey);
		document.getElementsByTagName('head')[0].appendChild(dropbox);
	}

	// Load JsSIP module for SIP calls with WebRTC
	if (sPrimaryAccountSIP) {
		storage.library('sip_bridge');
		if (typeof IceSIP != "undefined" && IceSIP.supported()) {
			dataSet.add('sip', ['state'], 'offline');
			dataSet.add('sip', ['activity'], '');
			if(currentBrowser() === 'Safari')
				storage.library('AdapterJS', 'sip');
			storage.library('sharing', 'sip');
			storage.library('JsSIP', 'sip');
		} else
			window.JsSIP = null;
	} else
		window.JsSIP = null;

};

cInit.prototype._updatePreloader = function () {
	var folders = dataSet.get('folders', [sPrimaryAccount]);
	if (!folders) {
		this.__refreshed = true;
		if (gui.preloader)
			gui.preloader._value(getLang('PRELOADER::INDEXING'));
		WMAccounts.refresh({'aid': sPrimaryAccount}, 'folders', [sPrimaryAccount], [this, '_updatePreloader']);
		return;
	}

	//Create Cookie
	storage.library('class_cookie');
	window.Cookie = new class_cookie();

	// [Async] Load style.css (marged css files)
	if (!gui._REQUEST_VARS['frm']) {
		if (gui.preloader)
			gui.preloader._value(getLang('PRELOADER::STARTUP'));

		storage.css('style');
		storage.template('templates');
		storage.preloadObj();
	} else
		storage.library('smiles');

	if (gui.preloader)
		gui.preloader._destruct();

	if(sPrimaryAccountGUEST && !Object.keys(folders).some(function(folder) {
		return folders[folder].TYPE === 'I';
	})) {
		return gui._create("confirm", "frm_alert", "", "", [function() {
			frm_main.prototype.__logout();
		}], 'MAIN_MENU::LOGOUT', 'ERROR::MISSING_TEAMCHAT');
	}

	var last_tz = Cookie.get(['tzoffset']),
		new_tz = new IcewarpDate().utcOffset();

	if(last_tz === void 0) {
		Cookie.set(['tzoffset'],(new IcewarpDate()).utcOffset() - (60 * new IcewarpDate().getMoment().isDST()));
		gui._create("frm_main", "frm_main", "", "", true);
	} else if (sPrimaryAccountGW > 0 && last_tz != new_tz - (60 * new IcewarpDate().getMoment().isDST())) {
		gui._create('timezone', 'frm_timezone', 'main', '', [function () {
				gui._create("frm_main", "frm_main", "", "", true);
			}]);
	} else
		gui._create("frm_main", "frm_main", "", "", true);

	TeamChatAPI.init();

	gui.__exeEvent('GUIDone', false, {"owner":this});
	if (GWOthers.getItem('LAYOUT_SETTINGS', 'night_mode') == 1) {
		setTimeout(function () {
			storage.library('night_mode');
			NightMode().activate();
		}, 1000);
	}
};

///////////////////////////
function initPRO(aData) {
	new cInit(aData);
	dataSet.on('folders', [sPrimaryAccount], function(folders){
		for(var key in folders){
			if(folders[key].TYPE === "I" && (!folders[key].SYNC || folders[key].SYNC==='0')){
				folders[key].RECENT = 0;
			}
		}
	});

	if (sPrimaryAccountCHAT == '1'){
		function teamchat_listener (set, path){
			if (set === 'folders') {
				if (path && path.length === 1) {
					return;
				}

				var recent = Cookie.get(['recent']) || [],
					room_name, index;

				if (path && path[path.length - 1] === 'RECENT' && dataSet.get('folders', path.slice(0,2)).TYPE === "I" && dataSet.get('folders', path.slice(0,2)).RECENT !== "0") {
					room_name = path.slice(0, 2).join('/');
					index = recent.indexOf(room_name);
					!!~index && recent.splice(index, 1);
					recent.unshift(room_name);
				}
				Cookie.set(['recent'], recent);
				dataSet.update('cookies', ['recent']);
				return;
			}

			var folder_parts = dataSet.get('active_folder').split('/');
			var folder = dataSet.get('folders', [folder_parts.shift(), folder_parts.join('/')]);
			if (gui.socket && folder && folder.TYPE === 'I') {
				gui.socket.api._pushGroupChatStatus(obj_groupchat._ONLINE);
			}
		};
		dataSet.on('active_folder', [], teamchat_listener);
		dataSet.on('folders', [], teamchat_listener);
	}
};
