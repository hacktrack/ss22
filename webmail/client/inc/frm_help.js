_me = frm_help.prototype;
function frm_help(){};

_me.__constructor = function(sActiveTab) {
	this._title('HELP::HELP');
	this._size(800,600,true);
	this._addListeners();

	var guest = sPrimaryAccountGUEST || (TeamChatAPI && TeamChatAPI.teamChatOnly());
	this._draw('frm_help','main', {chat:sPrimaryAccountCHAT, guest: guest});

	storage.library('gw_others');

	function nightMode(frame) {
		if (GWOthers.getItem('LAYOUT_SETTINGS', 'night_mode') == 1) {
			var onload = frame.__eFrame.onload;
			frame.__eFrame.onload = function() {
				onload && onload.call(this);
				storage.library('night_mode');
				NightMode(frame.__eFrame.contentWindow).activate();
			};
		}
		return frame;
	}

	if (this.maintab.help) {
		nightMode(this.maintab.help._create("frame", "obj_frame", "main", "border"))._src('client/help.html?lang='+ GWOthers.getItem('LAYOUT_SETTINGS','language'));
	}

	if (this.maintab.chat) {
		this.maintab.chat._onactive = function (bFirstTime) {
			bFirstTime && nightMode(this._create("frame", "obj_frame", "main", "border"))._src('client/chat.html?lang=' + GWOthers.getItem('LAYOUT_SETTINGS','language') + (guest ? '&guest=1' : ''));
		};
	};

	if (this.maintab.license) {
		this.maintab.license._onactive = function (bFirstTime) {
			bFirstTime && nightMode(this._create("frame", "obj_frame", "main", "border"))._src(GWOthers.getItem('PATHS','install')+'?sid='+dataSet.get('main',['sid']));
		};
	}

	if (this.maintab.apps){
		this.maintab.apps._onactive = function (bFirstTime) {
			if (bFirstTime){
				var frame = nightMode(this._create("frame", "obj_frame", "main", "border"));
				if (!guest) {
					var onload = frame.__eFrame.onload;
					frame.__eFrame.onload = function() {
						[].forEach.call(this.contentDocument.querySelectorAll('.circle, .i.note'), function(item) {
							item.classList.contains('item-5') || item.parentNode.removeChild(item);
						});
						onload && onload.call(this);
					};
				}
				frame._src('client/apps.html?lang='+ GWOthers.getItem('LAYOUT_SETTINGS','language'));
			}
		};
	}

	this.maintab.about._onactive = function (bFirstTime) {
		bFirstTime && nightMode(this._create("frame", "obj_frame", "main", "border"))._src('client/about.html?lang='+ GWOthers.getItem('LAYOUT_SETTINGS','language'));
	};

	this.maintab[sActiveTab] && this.maintab[sActiveTab]._active();
};

_me._messageHandler = function (e) {
	switch(e.data){
		case 'open_apps':
			gui.help.maintab.apps._active(null, true);
			break;
		case 'download_apps':
			window.open('https://www.icewarp.com/downloads/', 'icewarp_download');
			break;
		case 'whatsnew':
			gui._create('whatsnew', 'frm_whatsnew');
			break;
	}
};

_me._addListeners = function () {
	window.addEventListener('message', this._messageHandler);
	this._add_destructor('__removeListener');
};
_me.__removeListener = function () {
	window.removeEventListener('message', this._messageHandler);
};
