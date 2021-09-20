_me = obj_smilebox.prototype;
function obj_smilebox() {}

_me.__constructor = function(aResponse) {
	this._create('tabs', 'obj_tabs', '', 'ico small nobuttons transparent');

	this.tabs._getAnchor('main').onclick = function (e) {
		var e = e || window.event;
		var	elm = e.target || e.srcElement;

		if (elm.tagName === 'B' && aResponse) {
			executeCallbackFunction(aResponse, {
				name: elm.getAttribute('data-name'),
				smiley: elm.getAttribute('data-smiley'),
				sprite: elm.getAttribute('data-sprite')
			});
		}
	};

	Smiles.getSmiles(function (smiles_list) {
		this._init(smiles_list);
	}, this);
};

_me._init = function (smiles) {
	var me = this;
	Object.keys(smiles).map(function (type) {
		var tab = me.tabs._create(type, 'obj_tab', '', 'ico_' + type);
		tab._onactive = function (bFirstTime) {
			if (bFirstTime) {
				var em = this._getAnchor('main');
				em.appendChild(mkElement('H2', {text: getLang('smiles::' + type)}));
				em.appendChild(mkElement('DIV', {}, false, me._createList(smiles[type], type)));
			}
		};

	});

	this.tabs[this.tabs._value()]._onactive(true);
};

_me._createList = function (list, type) {
	return Object.keys(list).map(function (smile) {
		return mkElement('span', {}, false, [
			mkElement('b', {
				title: list[smile].join(' '),
				'data-name': list[smile][0],
				'data-smiley': smile,
				'data-sprite': type,
				className: 'smiley smiley-' + smile + ' sprite-' + type
			})
		]);
	});
};