function obj_fulltext_search_wizard() {};
obj_fulltext_search_wizard.prototype.__constructor = function () {
	this._draw('obj_fulltext_search_wizard', '');
};

obj_fulltext_search_wizard.prototype._load = function (callback) {
	this.steps = [].slice.call(this._getAnchor('steps').getElementsByTagName('li'));
	this._callback = callback;

	com.getProperties([
		'c_system_services_fulltext_enabled',
		'c_system_services_fulltext_database_url',
		'c_system_services_fulltext_docconv_url',
		'c_system_services_fulltext_scanner_url',
		'c_system_services_fulltext_database_path',
		'c_system_storage_dir_mailpath'
	], function (data) {
		this._data = data;
		this.steps.forEach(function (step, index) {
			this['_step' + index] && this['_step' + index](true);
		}, this);

		this._step(0);
	}.bind(this));
}

obj_fulltext_search_wizard.prototype._step = function (index) {
	this.steps.forEach(function (step, index) {
		step.classList.remove('is-active');
		this._getAnchor('step' + index).setAttribute('is-hidden', '');
	}, this);
	this.steps[index].classList.add('is-active');
	this._getAnchor('step' + index).removeAttribute('is-hidden');

	this._parent.btn_continue._value(index === this.steps.length - 1 ? 'generic::save' : 'generic::continue');
	this._parent.btn_continue._onclick = function () {
		if (index === this.steps.length - 1) {
			this._save();
		} else {
			this._step(index + 1);
		}
	}.bind(this);
	this._parent.btn_cancel._value(index === 0 ? 'generic::cancel' : 'generic::back');
	this._parent.btn_cancel._onclick = function () {
		if (index) {
			this._step(index - 1);
		} else {
			this._close();
		}
	}.bind(this);

	this['_step' + index] && this['_step' + index]();
};

obj_fulltext_search_wizard.prototype._step0 = function (init) {
	this.toggle_c_system_services_fulltext_enabled._onchange = function (checked) {
		this._parent.btn_continue._value(checked ? 'generic::continue' : 'generic::save');
		this.steps.forEach(function (step) {
			step.classList[checked ? 'remove' : 'add']('is-disabled');
		}, this);
	}.bind(this)
	this._parent.btn_continue._onclick = function () {
		if (this.toggle_c_system_services_fulltext_enabled._checked()) {
			this._step(1);
		} else {
			this._save();
		}
	}.bind(this);

	this.toggle_c_system_services_fulltext_enabled._setValue(this._data.c_system_services_fulltext_enabled, false);
};

obj_fulltext_search_wizard.prototype._step1 = function (init) {
	this.scanner_local._groupOnchange = function (radio) {
		var local = this._getAnchor('fi_c_system_services_fulltext_scanner_url_local');
		var remote = this._getAnchor('fi_c_system_services_fulltext_scanner_url_remote');

		if (+radio._groupValue()) {
			local.setAttribute('is-hidden', '');
			remote.removeAttribute('is-hidden');
		} else {
			local.removeAttribute('is-hidden');
			remote.setAttribute('is-hidden', '');
		}
	}.bind(this);

	if (init) {
		var indexer = this._data.c_system_services_fulltext_scanner_url.value || '';
		if (~indexer.indexOf('127.0.0.1')) {
			this.scanner_local._groupValue(0);
			this.input_c_system_services_fulltext_scanner_url_local._value(indexer.split(':').pop());
		} else {
			this.scanner_local._groupValue(1);
			this.input_c_system_services_fulltext_scanner_url_remote._value(indexer);
		}

		this._getAnchor('step1').querySelector('.form__block-desc').textContent = this._getAnchor('step1').querySelector('.form__block-desc').textContent.replace('%s', this._data.c_system_storage_dir_mailpath.value);
	}
};

obj_fulltext_search_wizard.prototype._step2 = function (init) {
	this.database_local._groupOnchange = function (radio) {
		var indexPath = this._getAnchor('fi_c_system_services_fulltext_database_path');
		var local = this._getAnchor('fi_c_system_services_fulltext_database_url_local');
		var remote = this._getAnchor('fi_c_system_services_fulltext_database_url_remote');

		if (+radio._groupValue()) {
			indexPath.setAttribute('is-hidden', '');
			local.setAttribute('is-hidden', '');
			remote.removeAttribute('is-hidden');
		} else {
			indexPath.removeAttribute('is-hidden');
			local.removeAttribute('is-hidden');
			remote.setAttribute('is-hidden', '');
		}
	}.bind(this);

	if (init) {
		this.input_c_system_services_fulltext_database_path._setValue(this._data.c_system_services_fulltext_database_path, false);
		var server = this._data.c_system_services_fulltext_database_url.value || '';
		if (~server.indexOf('127.0.0.1')) {
			this.database_local._groupValue(0);
			this.input_c_system_services_fulltext_database_url_local._value(server.split(':').pop());
		} else {
			this.database_local._groupValue(1);
			this.input_c_system_services_fulltext_database_url_remote._value(server);
		}
	}
};

obj_fulltext_search_wizard.prototype._step3 = function (init) {
	this.docconv_local._groupOnchange = function (radio) {
		var local = this._getAnchor('fi_c_system_services_fulltext_docconv_url_local');
		var remote = this._getAnchor('fi_c_system_services_fulltext_docconv_url_remote');
		if (+radio._groupValue() === 0) {
			local.removeAttribute('is-hidden');
			remote.setAttribute('is-hidden', '');
		} else if (+radio._groupValue() === 1) {
			local.setAttribute('is-hidden', '');
			remote.removeAttribute('is-hidden');
		} else {
			local.setAttribute('is-hidden', '');
			remote.setAttribute('is-hidden', '');
		}
	}.bind(this);

	if (init) {
		var docconv = this._data.c_system_services_fulltext_docconv_url.value || '';
		if (!docconv) {
			this.docconv_local._groupValue(2);
		} else if (~docconv.indexOf('127.0.0.1')) {
			this.docconv_local._groupValue(0);
			this.input_c_system_services_fulltext_docconv_url_local._value(docconv.split(':').pop());
		} else {
			this.docconv_local._groupValue(1);
			this.input_c_system_services_fulltext_docconv_url_remote._value(docconv);
		}
	}
};

obj_fulltext_search_wizard.prototype._step4 = function () {
	this._parent.btn_cancel._onclick = function () {
		if (this.toggle_c_system_services_fulltext_enabled._checked()) {
			this._step(3);
		} else {
			this._step(0);
		}
	}.bind(this);

	var title = this._getAnchor('fi_indexer').querySelector('span');
	switch (+this.scanner_local._groupValue()) {
		case 0:
			this._data.c_system_services_fulltext_scanner_url.value = 'http://127.0.0.1:' + (this.input_c_system_services_fulltext_scanner_url_local._value() || 25795);
			title.textContent = getLang('FULLTEXT_SEARCH_WIZARD::RUNS_LOCALLY', [getLang('FULLTEXT_SEARCH::INDEXER')]);
			break;
		case 1:
			this._data.c_system_services_fulltext_scanner_url.value = this.input_c_system_services_fulltext_scanner_url_remote._value() || '127.0.0.1:25795';
			title.textContent = getLang('FULLTEXT_SEARCH_WIZARD::RUNS_REMOTELY', [getLang('FULLTEXT_SEARCH::INDEXER')]);
	}
	this.input_indexer._setValue(this._data.c_system_services_fulltext_scanner_url, false);

	title = this._getAnchor('fi_server').querySelector('span');
	switch (+this.database_local._groupValue()) {
		case 0:
			this._data.c_system_services_fulltext_database_url.value = 'http://127.0.0.1:' + (this.input_c_system_services_fulltext_database_url_local._value() || 25793);
			title.textContent = getLang('FULLTEXT_SEARCH_WIZARD::RUNS_LOCALLY', [getLang('FULLTEXT_SEARCH::SERVER')]);
			break;
		case 1:
			this._data.c_system_services_fulltext_database_url.value = this.input_c_system_services_fulltext_database_url_remote._value() || '127.0.0.1:25793';
			title.textContent = getLang('FULLTEXT_SEARCH_WIZARD::RUNS_REMOTELY', [getLang('FULLTEXT_SEARCH::SERVER')]);
			this._getAnchor('fi_indexpath').classList.add('hidden');
	}
	this.input_server._setValue(this._data.c_system_services_fulltext_database_url, false);

	title = this._getAnchor('fi_docconv').querySelector('span');
	switch (+this.docconv_local._groupValue()) {
		case 0:
			this._data.c_system_services_fulltext_docconv_url.value = 'http://127.0.0.1:' + (this.input_c_system_services_fulltext_docconv_url_local._value() || 25797);
			title.textContent = getLang('FULLTEXT_SEARCH_WIZARD::RUNS_LOCALLY', [getLang('FULLTEXT_SEARCH::DOCCONV')]);
			this.input_docconv._main.removeAttribute('is-hidden');
			break;
		case 1:
			this._data.c_system_services_fulltext_docconv_url.value = this.input_c_system_services_fulltext_docconv_url_remote._value() || '127.0.0.1:25797';
			title.textContent = getLang('FULLTEXT_SEARCH_WIZARD::RUNS_REMOTELY', [getLang('FULLTEXT_SEARCH::DOCCONV')]);
			this.input_docconv._main.removeAttribute('is-hidden');
			break;
		case 2:
			this._data.c_system_services_fulltext_docconv_url.value = '';
			title.textContent = getLang('FULLTEXT_SEARCH_WIZARD::IS_DISABLED', [getLang('FULLTEXT_SEARCH::DOCCONV')]);
			this.input_docconv._main.setAttribute('is-hidden', '');
	}
	this.input_docconv._setValue(this._data.c_system_services_fulltext_docconv_url, false);

	this.input_indexpath._setValue(this._data.c_system_services_fulltext_database_path, false);
};

obj_fulltext_search_wizard.prototype._save = function () {
	if (this._data.hasChanged()) {
		this._data.saveChanges(function (r) {
			this._callback && this._callback(r == 1);
			this._close();
		}.bind(this));
	} else {
		this._close();
	}
}
