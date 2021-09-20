_me = obj_hmenu_basic.prototype;
function obj_hmenu_basic() {}

_me.__constructor = function () {
	storage.library('gw_others');

	this.__aMenu = [];
	var me = this;
	if (!sPrimaryAccountGUEST) {
		this.__aMenu.push(
			{"title": 'MAIN_MENU::COMPOSE', "css": 'ico2 compose', handler:[function(){
				me.__createNew();
			}]},
			{"title": 'MAIN_MENU::NEW', "css": 'ico2 new', nodetype: 'click', callback: [this, '__menu']}
		);

		gui._obeyEvent('folderSelected', [this, '__select_handler']);
		gui._obeyEvent('itemSelected', [this, '__select_handler']);
	}

	this.__ignoreMouseOut = true;
	this._fill(this.__aMenu, 'static');

	if(!gui.frm_main.upload) {
		gui.frm_main._create('upload','obj_upload_edit', void 0, 'hidden_upload');

		gui.frm_main.upload._click = function() {
			this.file._click();
		};

		gui.frm_main.upload._onuploadstart = function() {
			me._uploading = true;
			this.file.__exeEvent('onuploadstart');
		};

		gui.frm_main.upload._onuploadend = function (arg) {
			var active_folder = this.__active_folder || Path.split(dataSet.get('active_folder'));
			var aFolder = {
				aid: active_folder[0],
				fid: active_folder[1]
			};
			var aRights = WMFolders.getRights({ aid: active_folder[0], fid: active_folder[1] }),
				aAccess = WMFolders.getAccess({ aid: active_folder[0], fid: active_folder[1] });

			if(WMFolders.getType(aFolder) !== 'F' || !(aRights.owner || aAccess.write)) {
				aFolder = {
					aid: sPrimaryAccount,
					fid: Mapping.getDefaultFolderForGWType('F')
				};
			}

			me._uploading = false;

			if (this._destructed)
				return;

			var v = this._value();
			if (v && aFolder) {
				var now = new IcewarpDate();
				var aValues = {
					values: {
						EVNSHARETYPE: GWOthers.getItem('DEFAULT_CALENDAR_SETTINGS', 'file_sharing'),
						EVNSTARTDATE: now.format(IcewarpDate.JULIAN),
						EVNSTARTTIME: now.hour() * 60 + now.minute()
					},
					ATTACHMENTS: v
				};

				WMItems.add([aFolder.aid, aFolder.fid], aValues, '', '', '', [
					function (aResponse) {
						var active_folder = Path.split(dataSet.get('active_folder'));
						if(active_folder[0] === aFolder.aid && active_folder[1] === aFolder.fid) {
							gui.frm_main && gui.frm_main.main && gui.frm_main.main.__update && gui.frm_main.main.__update(aFolder);
						}
						aResponse && gui.notifier && gui.notifier._value({type: 'item_saved', args: [aFolder.aid, aFolder.fid]});
					}
				]);
				this._remove();
			}
		};
	}
};

_me.__select_handler = function (aData) {

	clearTimeout(this.__select_handler_timeout);

	this.__select_handler_timeout = setTimeout(function() {
		var account = aData.aid || aData[0];
		var folder = aData.fid || aData[1];

		if ((account + '/' + folder).indexOf(GWOthers.getItem('DEFAULT_FOLDERS','TRASH')) === 0) {
			folder = GWOthers.getItem('DEFAULT_FOLDERS','TRASH').split('/')[1];
		}
		var ds = (account && folder) ? dataSet.get('folders', [account, folder]) || {} : (aData || {}),
			data = {
				'I': ['MAIN_MENU::NEW_UPLOAD', 'upload'],
				'F': ['MAIN_MENU::NEW_UPLOAD', 'upload'],
				'E': ['MAIN_MENU::CREATE_APPOINTMENT', 'event'],
				'C': ['MAIN_MENU::CREATE_CONTACT', 'contact'],
				'T': ['MAIN_MENU::CREATE_TASK', 'task'],
				'N': ['MAIN_MENU::CREATE_NOTE', 'note'],
				'G': dataSet.get('main',['keep_deleted_items_force_expiration']) ? ['MAIN_MENU::COMPOSE', 'compose'] : ['MAIN_MENU::EMPTY_FOLDER', 'empty'],
				'R': ['MAIN_MENU::EMPTY_FOLDER', 'empty'],
				'H': ['MAIN_MENU::EMPTY_FOLDER', 'empty'],
				'W': [],
				'QL': ~(ds.NAME || '').indexOf('Blacklist') ? ['BLACKWHITE::BLACK', 'black'] : ['BLACKWHITE::WHITE', 'white']
			}[ds.DEFAULT || WMFolders.getType(aData)] || ['MAIN_MENU::COMPOSE', 'compose'];

		if(ds.SPAM === "true") {
			data = ['MAIN_MENU::EMPTY_FOLDER', 'empty'];
		}

		this.__aMenu[0] = data[0] && {title: data[0], css: 'ico2 ' + data[1], handler: [function(){
			this.__createNew();
		}.bind(this)]};

		this._fill(this.__aMenu, 'static');
	}.bind(this), 5);
};

_me.__menu = function () {
	var me = this;
	var dgw = GWOthers.getItem('RESTRICTIONS', 'disable_gw_types');

	var middle_column_items = [
		mkElement('div', {
			className: 'label',
			text: getLang('MAIN_MENU::DOCUMENTS')
		}),
		(!dgw || dgw.indexOf('f') < 0) && mkElement('div', {
			className: 'item word',
			text: getLang('MAIN_MENU::NEW_WORD'),
			onclick: function () {
				me.__createNewGW('F', '.docx');
				me.__close();
			}
		}),
		(!dgw || dgw.indexOf('f') < 0) && mkElement('div', {
			className: 'item excel',
			text: getLang('MAIN_MENU::NEW_EXCEL'),
			onclick: function () {
				me.__createNewGW('F', '.xlsx');
				me.__close();
			}
		}),
		(!dgw || dgw.indexOf('f') < 0) && mkElement('div', {
			className: 'item powerpoint',
			text: getLang('MAIN_MENU::NEW_PPOINT'),
			onclick: function () {
				me.__createNewGW('F', '.pptx');
				me.__close();
			}
		}),
		(!dgw || dgw.indexOf('n') < 0) && mkElement('div', {
			className: 'item note',
			text: getLang('MAIN_MENU::NEW_NOTE'),
			onclick: function () {
				me.__createNewGW('N');
				me.__close();
			}
		})/*,
		(!dgw || dgw.indexOf('f') < 0) && mkElement('div', {
			className: 'item txt',
			text: getLang('MAIN_MENU::NEW_TEXT'),
			onclick: function () {
				me.__createNewGW('F', '.txt');
				me.__close();
			}
		}),
		(!dgw || dgw.indexOf('f') < 0) && mkElement('div', {
			className: 'item html',
			text: getLang('MAIN_MENU::NEW_HTML'),
			onclick: function () {
				me.__createNewGW('F', '.html');
				me.__close();
			}
		})*/
	].filter(Boolean);

	var right_column_items = [
		mkElement('div', {
			className: 'label',
			text: getLang('MAIN_MENU::CHAT_VOICE_AND_VIDEO')
		}),
		gui.frm_main.im && gui.frm_main.im._is_active() && mkElement('div', {
			className: 'item chat',
			text: getLang('CONTACT::CHAT'),
			onclick: function () {
				me.__openChat();
				me.__close();
			}
		}),
		(sPrimaryAccountSIP && (GWOthers.getItem('RESTRICTIONS', 'disable_sip') || 0) < 1) && mkElement('div', {
			className: 'item call',
			text: getLang('MAIN_MENU::NEW_CALL'),
			onclick: function () {
				gui._create('dial', 'frm_dial', '', '');
				me.__close();
			}
		}),
		sPrimaryAccountCONFERENCE && mkElement('div', {
			className: 'item conference',
			text: getLang('MAIN_MENU::CONFERENCE'),
			onclick: function () {
				me.__startConference();
				me.__close();
			}
		}),
		(sPrimaryAccountSMS && (GWOthers.getItem('RESTRICTIONS', 'disable_sms') || 0) < 1) && mkElement('div', {
			className: 'item sms',
			text: getLang('MAIN_MENU::SMS'),
			onclick: function () {
				NewMessage.compose_sms();
				me.__close();
			}
		})
	].filter(Boolean);

	var columns = 1;
	if(middle_column_items.length > 1) {
		columns++;
	}
	if(right_column_items.length > 1) {
		columns++;
	}

	return mkElement('div', {
		className: 'table'
	}, false, [
		mkElement('div', {
			className: 'column first columns_' + columns
		}, false, [
			mkElement('div', {
				className: 'label',
				text: getLang('MAIN_MENU::EMAIL_AND_PLANNING')
			}),
			mkElement('div', {
				className: 'item mail',
				text: getLang('MAIN_MENU::COMPOSE'),
				onclick: function () {
					NewMessage.compose({alias:Item.getAliasFromPath(dataSet.get('active_folder'))});
					me.__close();
				}
			}),
			mkElement('div', {
				className: 'item template',
				text: getLang('MAIN_MENU::NEW_MESSAGE'),
				onclick: function () {
					NewMessage.compose({template:true});
					me.__close();
				}
			}),
			sPrimaryAccountGW && (!dgw || dgw.indexOf('e') < 0) && mkElement('div', {
				className: 'item appointment',
				text: getLang('MAIN_MENU::NEW_EVENT'),
				onclick: function () {
					if (gui.frm_main.main && (gui.frm_main.main._type === 'frm_main_calendar_dayweek' || gui.frm_main.main._type === 'frm_main_calendar_month')) {
						gui.frm_main.main._createEvent();
					} else {
						me.__createNewGW('E');
					}
					me.__close();
				}
			}),
			sPrimaryAccountGW && (!dgw || dgw.indexOf('c') < 0) && mkElement('div', {
				className: 'item contact',
				text: getLang('MAIN_MENU::NEW_CONTACT'),
				onclick: function () {
					me.__createNewGW('C');
					me.__close();
				}
			}),
			sPrimaryAccountGW && (!dgw || dgw.indexOf('c') < 0) && mkElement('div', {
				className: 'item distribution_list',
				text: getLang('MAIN_MENU::NEW_DISTRIB_LIST'),
				onclick: function () {
					me.__createNewGW('L');
					me.__close();
				}
			}),
			sPrimaryAccountGW && (!dgw || dgw.indexOf('t') < 0) && mkElement('div', {
				className: 'item task',
				text: getLang('MAIN_MENU::NEW_TASK'),
				onclick: function () {
					me.__createNewGW('T');
					me.__close();
				}
			})/*,
			sPrimaryAccountGW && (!dgw || dgw.indexOf('j') < 0) && mkElement('div', {
				className: 'item journal',
				text: getLang('MAIN_MENU::NEW_JOURNAL'),
				onclick: function () {
					me.__createNewGW('J');
					me.__close();
				}
			})*/
		]),
		sPrimaryAccountGW && middle_column_items.length > 1 && mkElement('div', {
			className: 'column columns_' + columns
		}, false, middle_column_items),
		right_column_items.length > 1 && mkElement('div', {
			className: 'column columns_' + columns
		}, false, right_column_items)
	]);
};

_me.__startConference = function () {
	gui.frm_main._selectView({aid: sPrimaryAccount, fid: '__@@VIRTUAL@@__/__@@MEETINGS@@__'});
	gui.frm_main.main._view('home');
};

_me.__openChat = function (e, elm, id, arg) {
	gui.frm_main.im._chat();
};

_me.__createNew = function () {
	var aActive = gui.frm_main.bar.tree.folders._getActive();
	if (aActive[0] == '' || aActive[1] == '') {
		return NewMessage.compose();
	}

	if ((aActive[0] + '/' + aActive[1]).indexOf(GWOthers.getItem('DEFAULT_FOLDERS','TRASH')) === 0) {
		aActive[1] = GWOthers.getItem('DEFAULT_FOLDERS','TRASH').split('/')[1];
	}

	var aFolder = dataSet.get('folders', [aActive[0], aActive[1]]) || {};

	switch (aFolder.DEFAULT || aFolder.TYPE) {
		case 'E':
			if (gui.frm_main.main._type == 'frm_main_calendar_dayweek' || gui.frm_main.main._type == 'frm_main_calendar_month') {
				gui.frm_main.main._createEvent();
			} else {
				Item.openwindow([aActive[0], aActive[1]], getActualEventTime());
			}
			break;

		case 'QL':
			gui._create(frm_blackwhite, 'frm_blackwhite', '', '', aActive[0], aActive[1]);
			break;

		case 'C':
		case 'N':
		case 'T':
		case 'J':
			Item.openwindow([aActive[0], aActive[1]]);
			break;
		case 'I':
			gui._create('insert_item', 'frm_insert_item', '', 'frm_insert_item_nobottomdiv', [gui.frm_main.main, '__addItems'], aActive[0], aActive[1], '', 'r', false, ['M', 'F', 'I', 'X'], 'X');
			break;
		case 'F':
			gui._create('insert_item', 'frm_insert_item', '', 'frm_insert_item_nobottomdiv', [gui.frm_main, '__copyItem', [aActive]], aActive[0], aActive[1], '', 'r', false, ['F', 'I', 'X'], 'X');
			break;

		case 'H':
		case 'R':
			Folder.empty({aid: aActive[0], fid: aActive[1]});
			break;

		case 'G':
			if (dataSet.get('main',['keep_deleted_items_force_expiration'])) {
				NewMessage.compose({alias:Item.getAliasFromPath(aActive[0] + '/' + aActive[1])});
			} else {
				Folder.empty({aid: aActive[0], fid: aActive[1]});
			}
			break;

		case 'M':
			if(aFolder.SPAM === 'true') {
				Folder.empty({aid: aActive[0], fid: aActive[1]});
				break;
			}
			//templates
			if (aActive[0] + '/' + aActive[1] == GWOthers.getItem('DEFAULT_FOLDERS', 'templates')) {
				NewMessage.compose({template: true});
				break;
			}
		default:
			NewMessage.compose({alias:Item.getAliasFromPath(aActive[0] + '/' + aActive[1])});
	}
};

_me.__createNewGW = function (sType, sDoc) {
	var aActive = gui.frm_main.bar.tree.folders._getActive(),
		sFolder, sAccount, bActual = false;

	// Pokud je aktualni folder stejneho typu, jako vytvarena polozka, bude vytvorena
	// v danem folderu, jinak se vezme defaultni folder pro dany typ polozky
	if (aActive[0] != '' || aActive[1] != '') {
		var sFolType = WMFolders.getType(aActive);
		if (sType == sFolType || (sType == 'L' && sFolType == 'C') || (sType == 'F' && (sFolType == 'I' || sFolType == 'Y')))
			bActual = true;
	}

	if (bActual) {
		sAccount = aActive[0];
		sFolder = aActive[1];
	} else {
		sAccount = sPrimaryAccount;
		sFolder = Mapping.getDefaultFolderForGWType(sType);
	}

	if (sType == 'E')
		Item.openwindow([sAccount, sFolder], getActualEventTime(), null, sType);
	else {
		var aValues;
		if (sDoc)
			aValues = {'ATTACHMENTS': [{'values': {'ATTTYPE': 'document', 'ATTDESC': sDoc}}]};

		Item.openwindow([sAccount, sFolder], aValues, null, sType);
	}
};
