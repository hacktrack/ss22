_me = frm_insert_code.prototype;

function frm_insert_code() {};

_me.__constructor = function (aHandler) {
	var me = this;

	storage.library('obj_highlight');

	this._modal(true);

	this._draw('frm_insert_code', 'main');
	this._size(800, 500, true);
	this._title('INSERT_CODE::TITLE');

	if (!window.hljs) {
		storage.library('highlight.pack', 'highlight');
	}

	var languages = {
		'auto': getLang('INSERT_CODE::AUTODETECT')
	};
	hljs.listLanguages().sort(function (a, b) {
		return (obj_highlight.__casing[a] || a).localeCompare(obj_highlight.__casing[b] || b);
	}).forEach(function (language) {
		languages[language] = obj_highlight.__casing[language] || language;
	});
	this.language._fill(languages);


	this._getAnchor('code').addEventListener('paste', function (e) {
		setTimeout(me.autodetectLanguage.bind(me), 0);
	});

	this._getAnchor('code').addEventListener('keyup', function (e) {
		me.x_btn_ok._disabled(!e.target.value.trim());
	});

	this._getAnchor('code').addEventListener('keydown', function (e) {
		if (!e.shiftKey && (e.keyCode || e.which) === 9) {
			e.preventDefault();
			var s = this.selectionStart;
			this.value = this.value.substring(0, this.selectionStart) + "\t" + this.value.substring(this.selectionEnd);
			this.selectionEnd = s + 1;
		}
	});


	this.x_btn_ok._disabled(true);
	this.x_btn_ok._value('INSERT_CODE::INSERT');
	this.x_btn_ok._onclick = function () {
		me.autodetectLanguage();
		var language = me.language._value();
		language = language === 'auto' ? '' : (' ' + language);
		executeCallbackFunction(aHandler, '```' + language + '\n' + me._getAnchor('code').value + '\n```');

		me._destruct();
	};
};

_me.autodetectLanguage = function () {
	if (this.language._value() === 'auto') {
		var highlight = hljs.highlightAuto(this._getAnchor('code').value);
		this.language._value(highlight.language);
	}
};
