_me = frm_storage.prototype;
function frm_storage() {}

_me.__constructor = function (id, quota, usage) {
	var me = this;
	this._dataSet = 'tmp_' + this._name;

	this._size(600, 400, true);
	this._resizable(false);
	this._title(id.fid + (usage ? ' - ' + (quota ? getLang('USAGE::LABEL', [this._format(usage), this._format(quota)]) : getLang('USAGE::LABEL2', [this._format(usage)])) : ''), true);

	this._draw('frm_storage', 'main', null, true);

	this.x_btn_ok._value('FORM_BUTTONS::CLOSE');
	this.x_btn_ok._main.classList.remove('ico');

	this.x_btn_cancel._destruct();

	this.datagrid._row_height = 40;
	this.datagrid._default_columns = function (sFolType) {
		return {
			DISPLAY: {title: 'FORM_FOLDERS::NAME', width: 450, type: 'static', encode: true},
			SIZE: {title: 'DATAGRID_ITEMS_VIEW::SIZE', width: 60, type: 'static', encode: true},
			OPTIONS: {title: 'COMPOSE::OPTIONS', width: 80, type: 'static'}
		};
	};

	this.datagrid._prepareBody = function (aItems) {
		var aResult = {};
		for (var sItId in aItems) {
			var aRow = {};
			var data = aItems[sItId];

			for (var sTitle in this._aCols) {
				switch (sTitle) {
					case 'DISPLAY':
						aRow[sTitle] = data.DISPLAY || data.FOLDER.split('\\').pop();
						break;
					case 'SIZE':
						aRow[sTitle] = parseFileSize(data.SIZE * 1024);
						break;
					case 'OPTIONS':
						aRow[sTitle] = '<span class="menu" data-id="' + sItId + '"></span>';
						break;
				}
			}
			aResult[sItId] = {id: sItId, css: '', data: aRow, arg: {aid: id.aid, fid: id.fid, iid: sItId}};
		}
		return aResult;
	};

	this.datagrid._default_values = function () {
		return [];
	};
	this.datagrid._select_single = true;
	this.datagrid._listen_data(this._dataSet, '', true);

	this.datagrid._serverSort({aid: id.aid, fid: '__@@SIZE@@__/' + id.owner_id}, '', '', [function () {
		[].forEach.call(me.datagrid._main.querySelectorAll('.menu'), function (menu) {
			menu.addEventListener('click', function (e) {
				e.preventDefault();
				e.stopPropagation();
				e.stopImmediatePropagation();
				me.cmenu = gui._create("cmenu", "obj_context", '', 'storageMenu', me);

				gui.cmenu._fill([
					{title: 'POPUP_ITEMS::CONTACT_ADMIN', arg: {method: 'contact'}, css: 'ico icocontact'},
					{title: '-'},
					{html: getLang('USAGE::CONTACT_ADMIN_HELPER'), css: 'helper'}
				]);
				gui.cmenu._place(e.clientX, e.clientY);
				gui.cmenu._onclick = function (ev, elm, id, arg) {
					switch (arg.method) {
						case 'contact':
							var popup = gui._create('contact_admin_quota', 'obj_popup');
							popup._title('POPUP_ITEMS::CONTACT_ADMIN');
							popup._modal(true);
							popup._size(350, 200, true);
							var text = popup._create('text', 'obj_text', '', 'obj_text100 noborder');
							text._placeholder(getLang('USAGE::CONTACT_ADMIN_PLACEHOLDER'));
							var ok = popup._create('x_btn_ok', 'obj_button', 'footer', 'color1');
							ok._value('COMPOSE::SEND');
							ok._onclick = function() {
								WMFolders.action({
									aid: sPrimaryAccount,
									fid: e.target.getAttribute('data-id').replace('*', '').replace(/\\/g, '/'),
									xmlarray: {
										comment: [
											{
												VALUE: text._value()
											}
										]
									}
								}, '', '', 'notify_limit', '', [
									function(){
										if(popup && !popup.__destructed) {
											popup._destruct();
										}
									}
								]);
							};
							var cancel = popup._create('x_btn_cancel', 'obj_button', 'footer');
							cancel._value('FORM_BUTTONS::CLOSE');
							cancel._onclick = function() {
								if(popup && !popup.__destructed) {
									popup._destruct();
								}
							};
							break;
					}
				};
			});
		});
	}]);

	this._onclose = function () {
		dataSet.remove(me._dataSet);
		return true;
	};
};

_me._onmove = function() {
	if(this.cmenu && !this.cmenu._destructed) {
		this.cmenu._destruct();
	}
};

_me._format = function (bytes, decimals) {
	if (!bytes) {
		return '0 B';
	}
	var i = Math.floor(Math.log(bytes) / Math.log(1024));
	return parseFloat((bytes / Math.pow(1024, i)).toFixed(decimals || 1)) + ' ' + ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'][i];
};
