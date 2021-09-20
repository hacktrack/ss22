_me = obj_barmenu_recent.prototype;
function obj_barmenu_recent() {};

_me.__constructor = function () {
	this.__maxcount = 10; //max number of items

	this.__aData = [];
	this.__body = this._getAnchor('main');

	//Add destructor
	this._add_destructor('__disobey_ds');

	//Obey DataSets
	dataSet.obey(this, '_listener', 'teamchat');
	dataSet.obey(this, '_listener2', 'active_folder');

	this.__body.onclick = this.__onClickHandler.bind(this);
};

_me.__onClickHandler = function (e) {
	var e = e || window.event,
		elm = e.target || e.srcElement;

	if (elm.tagName === 'SPAN')
		elm = elm.parentNode;

	if (elm.tagName === 'DIV' && elm.id) {

		if (hascss(elm, 'active')) {
			var pos = getSize(elm);

			if (pos.x + pos.w - e.clientX < 30) {
				this.oncontextmenu({target: elm, clientX: pos.x + pos.w, clientY: pos.y + (pos.h / 2)});

				e.cancelBubble = true;
				if (e.stopPropagation)
					e.stopPropagation();
				return false;
			}
		}
		var id = elm.id.substr(this._pathName.length + 1);

		if (!this.__aData[id]) {
			return;
		}
		var arg = {aid: sPrimaryAccount, fid: id};
		var aFolder = dataSet.get('active_folder');

		if (aFolder !== sPrimaryAccount + '/' + id && dataSet.get('folders', [sPrimaryAccount, id])) {
			//activate tree node
			//this._parent.tree.folders._setActive(sPrimaryAccount + '/' + id, true);
			//change view
			gui.frm_main._selectView(arg);
		}
	}
};

_me.__disobey_ds = function () {
	dataSet.disobey(this, '_listener', 'teamchat');
};

_me._fill = function (aData) {
	if (aData) {
		this.__aData = aData;
	}
	if (!Is.Object(this.__aData)) {
		return;
	}

	// get datasets
	var items = [];

	for (var key in aData) {
		if (!aData[key]) {
			continue;
		}
		items.push('<div id="' + this._pathName + '/' + key + '" title="' + (sPrimaryAccount + '/' + key).escapeHTML().replace(/"/g, '&quot;') + '" class="folder_' + 'I' + (dataSet.get('active_folder') === sPrimaryAccount + '/' + key ? ' active' : '') + (aData[key] > 0 ? ' recent' : '') + '">' + key.split('/').pop() + ' ' + (aData[key] > 0 ? '<span>' + aData[key] + '</span>' : '') + '</div>');
	}

	this.__body.innerHTML = items.join('\r\n');

	if (items.length) {
		this._size((items.length * this._item_height) + 15);
	} else {
		this._size(0);
	}

};

_me.__toggleHide = function () {
	if (WMFolders.getType(Path.split(dataSet.get('active_folder'))) === 'I') {
		this._main.style.display = 'block';
	} else {
		this._main.style.display = 'none';
	}
};

_me.__update = function (name, path) {
	if (name === this._listener2) {
		this.__toggleHide();
		return;
	}
	if (this._listener === name) {
		this._fill(dataSet.get(this._listener, this._listenerPath));
	} else {
		this._fill();
	}
};
