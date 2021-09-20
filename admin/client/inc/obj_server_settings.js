_me = obj_server_settings.prototype;

function obj_server_settings() {};

/**
 * @brief:
 * @date : 26.10.2014
 **/
_me.__constructor = function (s) {
	var me = this;

	me._defaultTab = 'certificates';

	this._add_destructor('__onbeforedestruct');
	/* set onbefore destruct listener */
};

/** onbefore destruct listener */
_me.__onbeforedestruct = function () {

}
/** */

_me._getMenuDefinition = function (settings, callback) {
	callback([{
			isdefault: true,
			name: 'policies',
			icon: 'none', //'policies',
			value: 'main::policies',
			callback: this._tabmenuCallback.bind(this)
		},
		{
			name: 'fulltext_search',
			icon: 'none', //'fulltext_search',
			value: 'fulltext_search::title',
			callback: this._tabmenuCallback.bind(this)
		},
		{
			name: 'smartdiscover',
			icon: 'none', //'smartdiscover',
			value: 'main::smartdiscover',
			callback: this._tabmenuCallback.bind(this)
		},
		{
			name: 'certificates',
			icon: 'none', //'licenses',
			value: 'main::certificates',
			callback: this._tabmenuCallback.bind(this)
		},
		{
			name: 'oauth',
			icon: 'none', //'oauth',
			value: 'main::oauth',
			callback: this._tabmenuCallback.bind(this)
		}
	]);
}

_me._tabmenuCallback = function (name) {
	var me = this;
	var parent = this._parent;

	if (!name) {
		name = '';
	}
	log.info(['serversettings-tabmenucallback-name', name]);

	// remove heading button
	gui.frm_main.main._setHeadingButton();

	// defaults
	if (name == '') {
		name = me._defaultTab;
	}

	// clean content to be able to show the same tab for different account
	parent._clean('main_content');

	log.info('Menu with ID "' + name + '" selected');

	switch (name) {
		case '':
		case "certificates":
			if (!parent.certificates_server) {
				parent._create('certificates_server', 'obj_certificates_server', 'main_content');
			}
			parent.certificates_server._load();
			break;
		case "policies":
			if (!parent.policies) {
				parent._create('policies', 'obj_policies', 'main_content');
			}
			parent.policies._load();
			break;
		case "smartdiscover":
			if (!parent.smartdiscover) {
				parent._create('smartdiscover', 'obj_smartdiscover', 'main_content');
			}
			parent.smartdiscover._load();
			break;
		case "oauth":
			if (!parent.oauth) {
				parent._create('oauth', 'obj_oauth', 'main_content');
			}
			parent.oauth._load();
			break;
		case "fulltext_search":
			if (!parent.oauth) {
				parent._create('fulltext_search', 'obj_fulltext_search', 'main_content');
			}
			parent.fulltext_search._load();
			break;
	}
}

_me._hash_handler = function () {
	var me = this;

	try {
		me._getMenuDefinition({}, function (menuDefinition) {
			gui.frm_main.main._init({
				name: 'server_settings',
				heading: {
					value: getLang('main::server_settings')
				},
				menu: {
					hashTemplate: "menu=/MENU/",
					items: menuDefinition
				}
			});
		});
	} catch (e) {
		log.error([e, me]);
	}


}
