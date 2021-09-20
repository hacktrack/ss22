_me = obj_fulltext_search.prototype;

function obj_fulltext_search() {};

_me.__constructor = function () {};

_me._load = function () {
	com.getProperties([
		'c_system_services_fulltext_enabled',
		'c_system_services_fulltext_database_url',
		'c_system_services_fulltext_docconv_url',
		'c_system_services_fulltext_scanner_url',
		'c_system_services_fulltext_database_path'
	], function (result) {
		this._result = result;
		result.enabled = +result.c_system_services_fulltext_enabled;
		this._clean();
		this._draw('obj_fulltext_search', '', result);
		this.configure._onclick = this._configure.bind(this, this._load.bind(this));

		if (result.enabled) {
			var title = this._getAnchor('fi_indexer').querySelector('span');
			if (~result.c_system_services_fulltext_scanner_url.value.indexOf('127.0.0.1')) {
				title.textContent = getLang('FULLTEXT_SEARCH_WIZARD::RUNS_LOCALLY', [getLang('FULLTEXT_SEARCH::INDEXER')]);
			} else {
				title.textContent = getLang('FULLTEXT_SEARCH_WIZARD::RUNS_REMOTELY', [getLang('FULLTEXT_SEARCH::INDEXER')]);
			}
			this.input_indexer._setValue(result.c_system_services_fulltext_scanner_url);

			title = this._getAnchor('fi_server').querySelector('span');
			if (~result.c_system_services_fulltext_database_url.value.indexOf('127.0.0.1')) {
				title.textContent = getLang('FULLTEXT_SEARCH_WIZARD::RUNS_LOCALLY', [getLang('FULLTEXT_SEARCH::SERVER')]);
			} else {
				title.textContent = getLang('FULLTEXT_SEARCH_WIZARD::RUNS_REMOTELY', [getLang('FULLTEXT_SEARCH::SERVER')]);
				this._getAnchor('fi_indexpath').classList.add('hidden');
			}
			this.input_server._setValue(result.c_system_services_fulltext_database_url);

			title = this._getAnchor('fi_docconv').querySelector('span');
			if (!result.c_system_services_fulltext_docconv_url.value) {
				title.textContent = getLang('FULLTEXT_SEARCH_WIZARD::IS_DISABLED', [getLang('FULLTEXT_SEARCH::DOCCONV')]);
				this.input_docconv._main.setAttribute('is-hidden', '');
			} else if (~(result.c_system_services_fulltext_docconv_url.value || '').indexOf('127.0.0.1')) {
				title.textContent = getLang('FULLTEXT_SEARCH_WIZARD::RUNS_LOCALLY', [getLang('FULLTEXT_SEARCH::DOCCONV')]);
			} else {
				title.textContent = getLang('FULLTEXT_SEARCH_WIZARD::RUNS_REMOTELY', [getLang('FULLTEXT_SEARCH::DOCCONV')]);
			}
			this.input_docconv._setValue(result.c_system_services_fulltext_docconv_url);

			this.input_indexpath._setValue(result.c_system_services_fulltext_database_path);
		}
	}.bind(this));
}

_me._configure = function (callback) {
	var popup = gui._create('popup', 'obj_popup');
	popup._init({
		name: 'fulltext_search_wizard',
		heading: {
			value: getLang('fulltext_search_wizard::heading')
		},
		fixed: false,
		iwattr: {
			height: 'full',
			width: 'medium'
		},
		footer: 'obj_fulltext_search_wizard_footer',
		content: 'obj_fulltext_search_wizard'
	});

	popup.content._load(callback);
}
