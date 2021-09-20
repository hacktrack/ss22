_me = frm_virtual.prototype;

function frm_virtual() {};

// var aFolder = Path.split(dataSet.get('active_folder'));
// aFolder.push('NAME');
// var sFolder = dataSet.get('folders',aFolder) || aFolder[1];

_me.__constructor = function (sFolderID, sSearch, aHandler) {
	this._title('VIRTUAL::VIRTUAL');
	this._size(700, 450, true);

	this.__aHandler = aHandler;
	this.__fid = sFolderID;

	this.__aData = {};

	this.x_btn_ok._disabled(true);

	//Switch to Edit Mode
	if (sFolderID && sFolderID.indexOf('__@@VIRTUAL@@__/') == 0) {
		this.__edit = true;
		WMFolders.list({
			aid: sPrimaryAccount,
			fid: sFolderID
		}, '', '', [this, '__prepareData']);
	} else {
		var out = {};
		out.TYPE = this.__fid ? WMFolders.getType({
			aid: sPrimaryAccount,
			fid: this.__fid
		}) : 'M';
		if (this.__fid) {
			out.VIRTUAL = {
				FOLDERS: {}
			};
			out.VIRTUAL.FOLDERS[this.__fid] = true;
			out.VIRTUAL.SEARCH = sSearch;
		}

		this.__loadItems(out);
	}
};

_me.__prepareData = function (aData) {
	this.__loadItems(aData[sPrimaryAccount][this.__fid]);
};

_me.__loadItems = function (aData) {

	var me = this;

	if (this.__fid && aData.VIRTUAL && aData.VIRTUAL.FOLDERS)
		this.__aData = aData.VIRTUAL.FOLDERS;

	//Fill TYPE option
	var aFill = {
		M: getLang('FOLDER_TYPES::MAIL')
	};
	if (sPrimaryAccountGW > 0) {
		var dgw = GWOthers.getItem('RESTRICTIONS', 'disable_gw_types');
		if (!dgw || dgw.indexOf('c') < 0)
			aFill.C = getLang('FOLDER_TYPES::CONTACT');
		if (!dgw || dgw.indexOf('e') < 0)
			aFill.E = getLang('FOLDER_TYPES::EVENT');
		if (!dgw || dgw.indexOf('j') < 0)
			aFill.J = getLang('FOLDER_TYPES::JOURNAL');
		if (!dgw || dgw.indexOf('n') < 0)
			aFill.N = getLang('FOLDER_TYPES::NOTE');
		if (!dgw || dgw.indexOf('t') < 0)
			aFill.T = getLang('FOLDER_TYPES::TASK');
		if (!dgw || dgw.indexOf('f') < 0)
			aFill.F = getLang('FOLDER_TYPES::FILE');
	}

	//Main
	this._draw('frm_virtual', 'main', {
		aid: sPrimaryAccount,
		type: aData.TYPE
	});

	// Preselect folder
	var sFullFolderPath = sPrimaryAccount;
	if (this.__edit) {
		for (var i in this.__aData) {
			sFullFolderPath = sPrimaryAccount + '/' + i;
			break;
		}
	} else
	if (this.__fid) {
		sFullFolderPath = sPrimaryAccount + '/' + this.__fid;
	}


	this.tree._setActive(sFullFolderPath);
	this.tree._ondblclick = function (e, elm, id, idt) {
		if (idt.aid && idt.fid && idt.ftype) {

			if (!me.__aData[idt.fid])
				me.__aData[idt.fid] = count(me.__aData) ? false : true;

			me._fill();
			return true;
		}
	};

	this.add._onclick = function () {
		var tmp = this._parent.tree._getActive();

		if (tmp && tmp[1] && !me.__aData[tmp[1]]) {
			me.__aData[tmp[1]] = count(me.__aData) ? false : true;
			me._fill();
		}
	};

	this.share._setType = function (sType) {

		if (sType == 'M') {
			if (me.share._value() == 'private')
				me.share._value('selected');

			me.share._fill({
				"all": getLang('FORM_FOLDERS::ALL'),
				"selected": getLang('FORM_FOLDERS::SELECTED')
			});
		} else
			me.share._fill({
				"all": getLang('FORM_FOLDERS::ALL'),
				"selected": getLang('FORM_FOLDERS::SELECTED'),
				"private": getLang('FORM_FOLDERS::PRIVATE')
			});
	};
	this.share._setType(aData.TYPE);
	this.share._onchange = function () {
		var b = this._value() != 'selected';

		me.tree._disabled(b);
		me.list._disabled(b);
		me.add._disabled(b);
		me.btn_remove._disabled(b);
	};

	this.share._value(aData.VIRTUAL && aData.VIRTUAL.SHARETYPE ? aData.VIRTUAL.SHARETYPE.toLowerCase() : 'selected');

	if (this.__edit) this.select_type._disabled(true);
	this.select_type._fill(aFill);
	this.select_type._value(aData.TYPE);
	this.select_type._onchange = function () {
		var sType = this._value();
		me.tree._filter_folder(sType);
		me.tree._fill();
		me.search._setType(sType);

		me.share._setType(sType);

		me.__aData = {};
		me._fill();
	};


	this.search._disabled(false);
	this.search._setType(aData.TYPE);

	if (aData.VIRTUAL && aData.VIRTUAL.SEARCH)
		this.search._value(aData.VIRTUAL.SEARCH);

	this.btn_remove._onclick = function () {
		var id = this._parent.list._value(),
			bMain = false,
			folder;

		for (var i in id)
			if (this._parent.list._aData[id[i]] && this._parent.list._aData[id[i]].arg.folder) {
				folder = this._parent.list._aData[id[i]].arg.folder;
				if (me.__aData[folder])
					bMain = true;

				delete me.__aData[folder];
			}

		//set first as primary
		if (bMain)
			for (var i in me.__aData) {
				me.__aData[i] = true;
				break;
			}

		me._fill();
	};

	this.list._addColumns({
		main: {
			width: 20,
			css: 'ico main',
			type: 'static'
		},
		folder: {
			title: "COMMON::FOLDER",
			width: 100,
			mode: '%',
			type: 'static'
		}
	});

	this.list._ondblclick = function (e, elm, arg, id0, id1) {
		if (id0 && id1) {
			var id = this._value();
			id = id[0];

			if (id && this._aData[id] && this._aData[id].arg.folder)
				var folder = this._aData[id].arg.folder;
			else
				return;

			for (var i in me.__aData)
				me.__aData[i] = false;

			me.__aData[folder] = true;

			me._fill();
		}
	};

	if (this.__fid){
		var sFolder = dataSet.get('folders', [sPrimaryAccount, this.__fid, 'NAME']) || Path.basename(this.__fid);
		this.name._value(sFolder);
	}

	this._fill();

	//Footer
	this.x_btn_ok._onclick = function () {
		me.__save();
		me._destruct();
	};

	this.name._onerror = function () {
		me._checkOk();
	};
};


_me._fill = function () {

	var aData = [],
		sw;
	for (var i in this.__aData)
		if (this.__aData[i])
			aData.push({
				data: {
					main: ['', '', getLang('VIRTUAL::PRIMARY')],
					folder: [Path.basename(i), i, i]
				},
				arg: {
					folder: i
				},
				css: 'main'
			});
		else
			aData.push({
				data: {
					folder: [Path.basename(i), i, i]
				},
				arg: {
					folder: i
				}
			});

	if ((sw = aData.length ? false : true))
		aData.push({
			data: {
				folder: getLang('VIRTUAL::ALL')
			}
		});

	this.btn_remove._disabled(sw);
	this.list._fill(aData);

	this._checkOk();
};

_me._checkOk = function () {
	this.x_btn_ok._disabled(this.name.__check() ? false : true);
};

_me.__save = function () {

	var sFolderName = '__@@VIRTUAL@@__/' + this.name._value();

	var out = {
		'aid': sPrimaryAccount,
		'name': sFolderName,
		'type': this.select_type._value(),
		'search': this.search._value(),
		'virtual': {}
	};

	if (this.share._value() == 'selected')
		out.virtual.folders = this.__aData;
	else
		out.virtual.sharetype = this.share._value();

	if (this.__edit)
		out.fid = this.__fid;
	else
	if (dataSet.get('folders', [sPrimaryAccount, sFolderName])) {
		alert(getLang('FORM_FOLDERS::CREATE_ERROR'));
		return;
	}

	WMFolders.add(out, 'folders', '', this.__aHandler);
};