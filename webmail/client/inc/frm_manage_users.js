_me = frm_manage_users.prototype;

function frm_manage_users() {};

_me.__constructor = function (aHandler, aEmails) {
	this.__aHandler = aHandler;

	var me = this;
	this.__aData = {};
	Array.isArray(aEmails) && aEmails.forEach(function(sEmail) {
		this.__aData[sEmail] = true;
	}, this);

	this._size(700, 450, true);

	this.__bFormEnabled = true;

	this._draw('frm_manage_users', 'main');

	// Create 'OK' button
	this._create('x_btn_ok', 'obj_button', 'footer', 'noborder color1 ok');
	this.x_btn_ok._value('FORM_BUTTONS::OK');
	this.x_btn_ok._onclick = function () {
		me.__save();
	};

	// Create 'CANCEL' button
	this._create('x_btn_cancel', 'obj_button', 'footer', 'noborder cancel simple');
	this.x_btn_cancel._value('FORM_BUTTONS::CANCEL');
	this.x_btn_cancel._onclick = function () {
		me._destruct();
	};

	this.users._row_height = 40;

	this.users._addColumns({
		user: {
			title: "SHARING::PEOPLE_YOU_INVITED",
			width: 100,
			mode: '%',
			type: 'static'
		},
		x: {
			css: 'remove',
			width: 30,
			mode: 'px',
			type: 'static'
		}
	});

	this.users._obeyEvent('onclick', [function (e, args) {
		if (me.__bFormEnabled && args.cell === 'x') {
			me._remove();
			return;
		}
	}]);

	this.inp_add.__setMask({
		address_book: ['',getLang('ADDRESS_BOOK::ADDRESS_BOOK')]
	}, [function () {
		me.__bFormEnabled && gui._create('address_book', 'frm_addaddress', '', '', [me, '__onAddNewFromAddressbook'], ['ADDRESS_BOOK::SELECTED_ADDRESSES'], [''], '', false);
	}]);

	//Quick Add Input
	this.inp_add._disobeyEvent('change', [this.inp_add, '_checksize']);
	this.inp_add._checksize = function () {};
	this.inp_add._placeholder(getLang('SHARING::ENTER_ADDRESS'));
	this.inp_add._qvalue = function (v) {
		if (Is.Object(v)) {
			v = v.value;
		}
		this._value(v);
		this._setRange(v.length);
	};
	this.inp_add._onsubmit = function () {
		var tmp = MailAddress.splitEmailsAndNames(this._value());
		this._value('');
		if (tmp && tmp[0] && tmp[0].email)
			me.__onAddNewFromAddressbook(true, [
				[MailAddress.createEmail(tmp[0].name, tmp[0].email)]
			]);
	};
	this.inp_add._onmouseselect = this.inp_add._onsubmit;
	this.inp_add._disabled(!this.__bFormEnabled);

	this.inp_add._focus();

	this.__aData2 = clone(this.__aData, true);
	this._fill();
};

_me._remove = function () {
	var v = this.users._value();

	if (Is.Empty(v)) return;

	try {
		this.__aData[this.users._aData[v[0]].arg.user] = ['~'];
		this._fill();
	} catch (e) {
		gui._REQUEST_VARS.debug && console.log(this._name || false, e);
	}

	if (!this.users._aData[v[0]] && this.users._aData.length > 0) {
		v = [this.users._aData.length - 1];
		this.users._value(v);
	}
};

_me._fill = function () {
	var aData = [];

	for (var i in this.__aData)
		if (this.__aData[i][0] != '~') {

			aData.push({
				data: {
					user: '<img class="avatar" src="' + getAvatarURL(i) + '"> ' + (i == 'anyone' ? getLang('SHARING::ANONYMOUS') : i.escapeHTML()),
					x: ''
				},
				arg: {
					user: i
				},
				css: Is.Array(this.__aData[i]) ? this.__aData[i].join(' ') : ''
			});
		}

	this.users._fill(aData);
};


_me.__onAddNewFromAddressbook = function (bOK, aAddresses) {
	if (bOK && aAddresses && aAddresses[0]) {
		var tmp;
		for (var i in aAddresses[0]) {
			tmp = MailAddress.splitEmailsAndNames(aAddresses[0][i]);
			if (tmp && (tmp = tmp[0]) && tmp.email && (!this.__aData[tmp.email] || this.__aData[tmp.email][0] === '~'))
				this.__aData[tmp.email] = ['r', 'l'];
		}

		this._fill();
	}
};


_me.__save = function () {
	this.x_btn_ok._disabled(true);

	var d1 = clone(this.__aData,true),
		d2 = clone(this.__aData2,true);

	if (!Is.Empty(this.__aData)) {
		for (var i in d2)
			if (d1[i] && arrayCompare(d2[i], d1[i]))
				delete d1[i];

		//No change, do not save
		if (Is.Empty(d1)) {
			this.__success_handler([]);
			return;
		}
	}
	this.__success_handler(Object.keys(d1));
};

_me.__success_handler = function (aData) {
	this._destruct();

	if (this.__aHandler)
		executeCallbackFunction(this.__aHandler, aData);
};

_me.__error_handler = function (arr, id, str) {
	if (id && str) {
		switch(id) {
			case 'groupware_setacl':
				var id = str.match(/id:(.*?)\s/) || [];
				var error = 'GROUPWARE_SETACL';
				var source = this.__aFolderInfo.aid;
				if(this.__aFolderInfo.fid) {
					error = 'GROUPWARE_SETACL_FOLDER';
					source = dataSet.get('folders', [this.__aFolderInfo.aid, this.__aFolderInfo.fid, 'NAME']) || this.__aFolderInfo.fid;
				}
				gui.notifier._value({
					type: 'alert',
					args: {
						header: 'POPUP_FOLDERS::SHARING',
						text_plain: getLang('ERROR::' + error, [source, id[1]])
					}
				});
			break;
			default:
				gui.notifier._value({
					type: 'alert',
					args: {
						header: 'POPUP_FOLDERS::SHARING',
						text_plain: str
					}
				});
		}
		this.x_btn_ok._disabled(false);
	} else
		this.__success_handler([]);
};
