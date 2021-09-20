_me = frm_event2.prototype;

function frm_event2() {};

_me.__constructor = function () {

	storage.library('purify.wrapper', 'purify');

	this.__attendee = !!(this._aValues.EVNFLAGS & 2);

	if(!Object.keys(this._aValues).length) {
		return this._destruct();
	}

	if (this._repeating) {
		this.__hide && this.__hide();
		gui._create('frm_confirm_repeating', 'frm_confirm_repeating', '', '', [this, '__editRepeating'], 'REPEATING_CONFIRM::TITLE_EDIT', 'REPEATING_CONFIRM::TEXT_EDIT', '', this.__attendee)._onclose = function () {
			this._destruct();
			return true;
		}.bind(this);
	} else {
		this.__constructor2();
	}
};

_me._onclose = function (b) {
	if (b){
		if (this._userEdited()) {

			// For cloned event there is special callback which deletes the cloned event
			var callback = this._bClone ? '__confirmedClone' : '__confirmed';

			gui._create('frm_confirm', 'frm_confirm', '', '', [this, callback], 'CONFIRMATION::ARE_YOU_SURE', 'CONFIRMATION::ALL_CHANGES_WILL_BE_LOST');
			return false;
		}
		else
		if (this._bClone){
			this.__confirmedClone(true);
		}
	}

	return true;
};

/**
 * Called when event edit dialog is being closed unsaved after user confirms confirm dialog
 *
 * @returns {undefined}
 */
_me.__confirmedClone = function (bForce) {
	var refreshParameters = [
		this._sAccountID,
		this._sFolderID, [this._sItemID]
	];
	var removeParameters = {
		'aid': refreshParameters[0],
		'fid': refreshParameters[1],
		'iid': refreshParameters[2]
	};

	!bForce && this.__hide();

	WMItems.remove(removeParameters, 'items', '', 'folders', [function (bOK) {
		if (bOK) {
			!bForce && this._close(false);
			Item.__refreshView(refreshParameters);
		} else {
			!bForce && this.__show();
		}
	}.bind(this)]);
};

_me.__editRepeating = function (nType) {

	switch (parseInt(nType)) {
		case 2: // all from now
			this._aValues['EXPFOLLOWING'] = 'true';

		case 0: // only this
			this._aValues['EXPDATE'] = this._aReccurenceValues['EVNSTARTDATE'];

			if (this._aValues['EVNSTARTTIME'] < 0) {
				this._aValues['EVNSTARTDATE'] = this._aValues._TZEXPEVNSTARTDATE;
				this._aValues['EVNENDDATE'] = this._aValues._TZEXPEVNENDDATE;
			} else {
				this._aValues['_TZEVNSTARTDATE'] = this._aValues._TZEXPEVNSTARTDATE;
				this._aValues['_TZEVNSTARTTIME'] = this._aValues._TZEXPEVNSTARTTIME;
				this._aValues['_TZEVNENDDATE'] = this._aValues._TZEXPEVNENDDATE;
				this._aValues['_TZEVNENDTIME'] = this._aValues._TZEXPEVNENDTIME;
			}
	}

	this.__constructor2();
};

_me.__constructor2 = function () {
	this._defaultSize(-1, -1, 800, 550);

	this._aValues = this._aValues || {};
	this._aValues.EVNCLASS = this._aValues.EVNCLASS || 'E';

	var me = this,
		gchat = WMFolders.getType([this._sAccountID, this._sFolderID]) == 'I';

	this.__real_email = sPrimaryAccount;
	if(~this.__real_email.indexOf('@##')) {
		this.__real_email = this.__real_email.split('@##')[0].replace('_', '@');
	}

	this.__oresponse = this.__oresponse || {};
	if (this.__oresponse.propose) {
		this.__readonly = true;
	}

	this.__show();

	var aData = {};
	if (this._aValues.EVNCLASS === 'O' || this._aValues.EXPDATE)
		aData.noRepeat = true;

	if (this._aValues.EXPDATE)
		aData.occurrence = true;

	if (!Is.Defined(this._id[2])) {
		var sFolder = '';
		if (WMFolders.getAccess({
				aid: this._id[0],
				fid: this._id[1]
			}, 'write')) {
			if (!this._sFolderID.indexOf('__@@VIRTUAL@@__/')) {
				var aFolders = dataSet.get('folders', [this._id[0], this._id[1], 'VIRTUAL', 'FOLDERS']);
				for (var i in aFolders || {}) {
					if (aFolders[i]) {
						sFolder = i;
						break;
					}
				}
			} else {
				sFolder = this._id[1];
			}
		}

		this._id[1] = sFolder || Mapping.getDefaultFolderForGWType('E');
		this.x_btn_ok._value('FORM_BUTTONS::CREATE');
	}

	var sOwner = me._aValues.EVNORGANIZER?MailAddress.splitEmailsAndNames(me._aValues.EVNORGANIZER)[0].email:'';
	if (!sOwner) {
		var meta = '';
		//get owner from EVN_METADATA
		if (this._aValues['EVN_METADATA'] && (meta = parseURL(this._aValues['EVN_METADATA'])) && meta.core_own_email){
			sOwner = meta.core_own_email;
		}
		//fallback
		else{
			var tmpf = Path.split(this._id[1])[0];
			if (~(dataSet.get('folders', [this._id[0], tmpf, 'TYPE']) || '').indexOf('A'))
				sOwner = tmpf.replace(/~/g, '');
			else {
				sOwner = me._sAccountID;
			}
		}
	}

	this.__evnid = {
		aid: me._id[0],
		fid: me._id[1],
		iid: me._id[2],
		owner_id: sOwner
	};

	if (Is.Defined(this._aValues._TZID)) {
		this._aValues['EVNSTARTDATE'] = this._aValues._TZEVNSTARTDATE;
		this._aValues['EVNENDDATE'] = this._aValues._TZEVNENDDATE;
		this._aValues['EVNSTARTTIME'] = this._aValues._TZEVNSTARTTIME;
		this._aValues['EVNENDTIME'] = this._aValues._TZEVNENDTIME;
		this._aValues['TZID'] = this._aValues._TZID;
	}

	if (!Is.Defined(this._id[2])) {
		aData.path = true;
	}

	aData.guest = !!sPrimaryAccountGUEST;
	aData.conference = sPrimaryAccountCONFERENCE && dataSet.get('accounts',[sPrimaryAccount, 'MEETING_PROVIDER']) == 'jitsi';

	//aData.disable_html = !GWOthers.getItemAccess('MAIL_SETTINGS_DEFAULT','html_message') && '0' === GWOthers.getItem('MAIL_SETTINGS_DEFAULT','html_message');
	this._draw('frm_event2', 'main', aData);

	if (!Is.Defined(this._id[2]) || this.__oresponse.propose) {
		addcss(this._getAnchor('block_time'), 'active');
	}

	// Refresh list and preview in case tags were changed
	this.EVNTYPE.input._onChange = function(){
		this.__refreshView = true;
	}.bind(this);

	if (gchat){
		if (!Is.Defined(this._id[2])) {
			//GroupChat 1
			this._aValues['CONTACTS'] = this._aValues['CONTACTS'] || {};
			this._aValues['CONTACTS'][getFreeKey(this._aValues['CONTACTS'])] = {
				values: {
					CNTEMAIL: '__@@groupchat@@__',
					CNTCONTACTNAME: getLang('ATTENDEES::ALL_ATTENDEES'),
					CNTROLE:'Q',
					CNTSTATUS:'B',
					NEW:true
				}
			};
		}
		else
		//Translate team chat "All Attendees"
		if (this._aValues['CONTACTS']){
			for(var i in this._aValues['CONTACTS']){
				if (this._aValues['CONTACTS'].hasOwnProperty(i) && this._aValues['CONTACTS'][i].values && this._aValues['CONTACTS'][i].values.CNTEMAIL === '__@@groupchat@@__' && !this._aValues['CONTACTS'][i].values.CNTCONTACTNAME){
					this._aValues['CONTACTS'][i].values.CNTCONTACTNAME = getLang('ATTENDEES::ALL_ATTENDEES');
					break;
				}
			}
		}
	}

	this._getAnchor('collapse_time').addEventListener('click', function(e) {
		e.stopPropagation();
		me._closeBlocks();
		me._getAnchor('block_time').classList.remove('active');
	});

	this._create('_scrollbar', 'obj_scrollbar');
	this._scrollbar._scrollbar(this._getAnchor('left_content'), this._getAnchor('left_column'));
	this._create('_scrollbar2', 'obj_scrollbar');
	this._scrollbar2._scrollbar(this._getAnchor('user_list'), this._getAnchor('user_list_container'));

	if(this.x_include_in_my_cal) {
		this.X_PATH._onchange = function(value) {
			var folder = value.split('/');
			var account = folder.shift();
			var paths = folder.slice();
			folder = folder.join('/');

			var is_public = false;
			while(!is_public && paths.length) {
				is_public = dataSet.get('folders', [account, paths.join('/'), 'PUBLIC']);
				paths.pop();
			}

			var folder_data = dataSet.get('folders', [account, folder]);
			if ((folder_data && (!folder_data.OWNER || (folder_data.OWNER === me.__real_email))) || is_public) {
				me.x_include_in_my_cal._main.setAttribute('hidden', '');
				me.x_include_in_my_cal._checked(false);
			} else {
				me.x_include_in_my_cal._main.removeAttribute('hidden');
			}

			if(me.x_list) {
				if(WMFolders.getType([account, folder]) === 'E') {
					// calendar
					me.x_list.__users.some(function(user) {
						if(user.email === '__@@groupchat@@__') {
							user.active = true;
							return true;
						}
					});
					me.x_list._removeUser();
				} else {
					// teamchat
					me.x_list._addUser({
						email: '__@@groupchat@@__',
						name: getLang('ATTENDEES::ALL_ATTENDEES'),
						role: 'Q',
						status: 'B',
						action: 'new'
					});
				}
			}
		};
	}

	if (!Is.Defined(this._id[2])) {
		if (gchat) {
			this.X_PATH._disabled(true);
		}
	} else {
		this.X_PATH._main.parentNode.parentNode.setAttribute('hidden', '');
	}

	this.X_PATH._value(this._id[0] + '/' + this._id[1]);

	if (this.MEETING_ACTION) {
		var mp = this._getAnchor('meeting_password');
		this.MEETING_ACTION._onchange = function(event, checked) {
			if(checked) {
				removecss(mp, 'hidden');
			} else {
				addcss(mp, 'hidden');
			}
		};
		this.MEETING_ACTION._value(this._aValues.conference);

		if (this._aValues.EVNMEETINGID) {
			if(this.MEETING_PASSWORD) {
				this.MEETING_PASSWORD._value(this._aValues.EVNMEETINGPASSWORD);
				this.MEETING_PASSWORD._readonly(this._aValues.EXPFOLLOWING || this._aValues.EXPDATE || this.__readonly || this.__attendee);
			}
			this._aValues.MEETING_ACTION = this.MEETING_ACTION._checked(true);
			removecss(mp, 'hidden');

			addcss(this._main, 'join_conference');

			this._start_conference._onclick = function() {
				storage.library('wm_conference');
				wm_conference.get(this._aValues.EVNMEETINGID).join();
			}.bind(this);
		} else {
			this.MEETING_ACTION._disabled(!!this.__oresponse.propose || this.__attendee);
			if (sPrimaryAccountGUEST || (TeamChatAPI && TeamChatAPI.teamChatOnly())) {
				this.MEETING_ACTION._main.parentNode.parentNode.setAttribute('hidden', '');
			}
		}
	}

	this.MEETING_PASSWORD && this.MEETING_PASSWORD.__setMask({
			'toggle': ['', getLang('COMMON::SHOW'), 2]
		},
		[function () {
			if (me.MEETING_PASSWORD.__eIN.getAttribute('type') === 'text') {
				me.MEETING_PASSWORD.__eIN.setAttribute('type', 'password');
			} else {
				me.MEETING_PASSWORD.__eIN.setAttribute('type', 'text');
			}
		}]
	);

	this._create('X_TIMEINTERVAL', 'obj_timeinterval2', '', '', true, true, {
		startDate: this.startDate,
		startTime: this.startTime,
		endDate: this.endDate,
		endTime: this.endTime,
		durationDays: this.durationDays,
		durationTime: this.durationTime,
		timezone: this.timezone,
		tzlink: this.tzlink,
		allDay: this.allDay
	});

	// X_REMINDERS
	this.X_REMINDERS._fillLang({
		'0': 'REMINDER::NONE',
		'0M': ['REMINDER::MINUTESBEFORE', ['0']],
		'10M': ['REMINDER::MINUTESBEFORE', ['10']],
		'30M': ['REMINDER::MINUTESBEFORE', ['30']],
		'1H': ['REMINDER::HOURSBEFORE', ['1']],
		'2H': ['REMINDER::HOURSBEFORE', ['2']],
		'1D': ['REMINDER::DAYSBEFORE', ['1']],
		'2D': ['REMINDER::DAYSBEFORE', ['2']],
		'7D': 'REMINDER::WEEKBEFORE',
		'*': 'SETTINGS::CUSTOM'
	});

	var last_remind_value;
	this.X_REMINDERS._onbeforechange = function () {
		last_remind_value = this.__value;
	};

	this.X_REMINDERS._onchange = function () {
		if (this.__value === '*') {
			if (this.popup && !this.popup._destructed){
				this.popup._focus();
			}
			else{
				this.popup = gui._create('frm_reminders', 'obj_popup', '', 'frm_reminders');
				this.popup._size(420, 145, true);
				this.popup._modal(true);
				this.popup._resizable(false);
				this.popup._dockable(false);

				this.popup._create('btn_ok', 'obj_button', 'footer', 'ok noborder color1')._value('FORM_BUTTONS::OK');
				this.popup._create('btn_cancel', 'obj_button', 'footer', 'cancel noborder')._value('FORM_BUTTONS::CANCEL');

				this.popup._onclose = function(b){
					if (b){
						me.X_REMINDERS._value(last_remind_value);
						me.X_REMINDERS._focus();
					}

					return true;
				};

				this.popup.btn_cancel._onclick = function () {
					me.X_REMINDERS._value(last_remind_value);
					this._parent._destruct();
					me.X_REMINDERS._focus();
				};

				this.popup._title('REMINDER::REMINDER');
				this.popup._create('X_REMINDERS', 'obj_reminder', 'main', '', 'EVENT_SETTINGS');
				this.popup.X_REMINDERS._value([me._reminderKeyToObject(last_remind_value)]);
				this.popup.btn_ok._onclick = function () {
					me._setReminderSelect(this.X_REMINDERS._value());
					this._destruct();
				}.bind(this.popup);

				this.popup.X_REMINDERS.reminder_1.time.x_text._onerror = function(error) {
					this.btn_ok._disabled(error);
				}.bind(this.popup);
			}
		}
		else
		if (this.popup && !this.popup._destructed)
			this.popup._destruct();
	};

	this.X_REMINDERS._onkeydown = function(e){
		if (this.popup && !this.popup._destructed){
			if (e.keyCode == 27 || e.keyCode == 9)
				this.popup._close(true);

			if (e.keyCode == 27){
				if (e.stopPropagation) e.stopPropagation();
				e.cancelBubble = true;
				return false;
			}
		}
	};


	// X_REPEATING
	if (me.__oresponse.propose && !this._aValues.RECURRENCES){
		this.X_REPEATING._disabled(true);
	}
	else{

		var last_repeating_value;
		this.X_REPEATING._onbeforechange = function () {
			last_repeating_value = this.__value;
		};

		this.X_REPEATING._onselect = function () {
			if (this.__value === '*') {
				if (this.popup && !this.popup._destructed){
					this.popup._focus();
				}
				else{
					this.popup = gui._create('frm_repeatings', 'obj_popup', '', 'frm_repeatings');
					this.popup._size(650, 370, true);
					this.popup._modal(true);
					this.popup._resizable(false);
					this.popup._dockable(false);

					this.popup._create('btn_ok', 'obj_button', 'footer', 'ok noborder color1')._value('FORM_BUTTONS::OK');
					this.popup._create('btn_cancel', 'obj_button', 'footer', 'cancel noborder')._value('FORM_BUTTONS::CANCEL');

					this.popup._onclose = function(b){
						if (b){
							me.X_REPEATING._value(last_repeating_value);
							me.X_REPEATING._focus();
						}

						return true;
					};

					this.popup.btn_cancel._onclick = function () {
						me.X_REPEATING._value(last_repeating_value);
						this._parent._destruct();
						me.X_REPEATING._focus();
					};

					this.popup._title('EVENT::REPEAT');
					this.popup._create('X_REPEATING', 'obj_repeating', 'main', '');
					this.popup.X_REPEATING._onerror = function(has_error){
						this._parent.btn_ok._disabled(has_error);
					};

					this.popup.X_REPEATING._value(me.X_REPEATING.__rcrvalue || me._repeatingKeyToObject(last_repeating_value));
					this.popup.X_REPEATING._setDate(IcewarpDate.julian(me.X_TIMEINTERVAL._value().EVNSTARTDATE));

					if (me.__oresponse.propose){
						this.popup.btn_ok._disabled(true);
					}
					else{
						this.popup.btn_ok._onclick = function () {
							var restricted = this.X_REPEATING.container._getChildObjects().some(function(child) {
								return child.__check && !child.__check();
							});
							if(restricted) {
								return;
							}
							var rec = (this.X_REPEATING._value() || {}).values || {};
							if (rec && +rec.RCRMONTHREPETITION) {
								var d = IcewarpDate.julian(me.X_TIMEINTERVAL.startDate._value());
								d.date(rec.RCRDAYREPETITION);
								var now = new IcewarpDate();
								if(now.format('julian') > d.format('julian')) {
									d.month(d.month() + 1);
								}
								me.X_TIMEINTERVAL.startDate._value(d.format('julian'));
								me.X_TIMEINTERVAL.__setFrom();
							}

							me._setRecurrenceSelect([this.X_REPEATING._value()]);

							this._destruct();

						}.bind(this.popup);
					}
				}

			} else {
				if (this.popup && !this.popup._destructed)
					this.popup._destruct();

				//Do not save on propose mode
				if (!me.__oresponse.propose && this.__value !== last_repeating_value){
					last_repeating_value = this.__value;
					me._setRecurrenceSelect([me._repeatingKeyToObject(this._value())]);
				}
			}

			//always set back old value on propose mode
			if (me.__oresponse.propose){
				me._setRecurrenceSelect([me.X_REPEATING.__rcrvalue], true);
			}
		};

		this.X_REPEATING._onkeydown = this.X_REMINDERS._onkeydown;
	}


	this.EVNLOCATION._oncreateOptionList = function (bSkipUpdate) {
		if (this.___init)
			return;

		this.___init = true;

		var resources_path = dataSet.get('main', ['resources_path']);
		if (resources_path) {
			var aItemsInfo = {
				aid: sPrimaryAccount,
				fid: resources_path,
				filter: {
					sort: 'ITMCLASSIFYAS',
					search: 'category:Room'
				},
				values: [
					'ITMCLASSIFYAS',
					'LCTEMAIL1'
				]
			};

			WMItems.list(aItemsInfo, '', '', '', [function (tmp) {
				if (tmp) {

					var out = {},
						sEmail;

					for (var i in tmp)
						for (var j in tmp[i]) {
							delete tmp[i][j]['/'];
							delete tmp[i][j]['#'];
							delete tmp[i][j]['$'];
							delete tmp[i][j]['@'];

							for (var k in tmp[i][j]) {
								sEmail = MailAddress.createEmail(tmp[i][j][k].ITMCLASSIFYAS, tmp[i][j][k].LCTEMAIL1);
								out[sEmail] = sEmail;
							}
						}

					me.EVNLOCATION.__out = out;
					if(!bSkipUpdate) {
						me.EVNLOCATION._fill(out);
						me.EVNLOCATION._show();
					}
				}
			}]);
		}
	};

	var autoadded_resource;
	this.EVNLOCATION.__eIN.addEventListener('blur', function() {
		if (autoadded_resource) {
			me.x_list.__users.forEach(function(user) {
				user.active = user.name === autoadded_resource.name && user.email === autoadded_resource.email;
			});
			me.x_list._removeUser();
		}
		if (~this.value.indexOf('@')) {
			autoadded_resource = MailAddress.splitEmailsAndNames(this.value)[0];
			autoadded_resource.role = 'S';
			me.x_list._addUser(autoadded_resource);
		}
	});

	this.X_LOCMAP._value([this.EVNLOCATION, '_value']);
	this.X_LOCMAP._callback_function = function(input) {
		me.EVNLOCATION._value(input);
	};
	this.EVNLOCATION._disabled(this.__attendee || this.__readonly);
	this._initGooglePlacesAutocomplete(GWOthers.getItem('EXTERNAL_SETTINGS', 'google_maps_api_key'));

	[].forEach.call(this._main.querySelectorAll('.block'), function (block) {
		block.addEventListener('click', function (e) {
			me._closeBlocks();
			if(this.classList.contains('attendees') && !this.classList.contains('active')) {
				me.x_suggest._focus();
			}
			if(this.classList.contains('time') && me.__readonly && !me.__oresponse.propose) {
				return;
			}
			this.classList.add('active');
		});
	});

	this.EVNTITLE._onfocus = function () {
		me._closeBlocks();
		me._closeNote();
	};

	this.EVNTITLE._disabled(this.__readonly);

	//Copy contact name into window title
	this.EVNTITLE._onkeyup = (function () {

		var sAppendix = '';

		if (me._aValues.EVNFOLDER && me._aValues.EVNFOLDER != '@@trash@@'){

			var sFolder = Path.slash(me._aValues.EVNFOLDER),
				ds = dataSet.get('folders',[sPrimaryAccount, sFolder]);

			if (ds && ds.NAME){
				var aPath = sFolder.split('/');
				aPath.pop();
				aPath.push(ds.NAME);
				sAppendix = ' - ' + aPath.join('/');
			}
			else{
				sAppendix = ' - ' + sFolder;
			}
		}

		return function(){
			me._title((this._value() || getLang('EVENT::EVENT')) + sAppendix, true);
			me.x_freebusy._title(this._value() || getLang('EVENT::EVENT'));
		};
	})();

	function openNote(e) {
		var note = me.x_note.__originalValue.EVNNOTE || '';
		if (me.x__note) {
			return;
		}
		if(me.x_note.__originalValue.EVNDESCFORMAT !== 'text/html') {
			note = note.escapeHTML();
		}
		e && e.stopPropagation();

		me.x_freebusy._main.style.zIndex = -1;
		me.x_freebusy._main.style.opacity = 0;
		me._create('x__note', 'obj_wysiwyg', 'right_content', '', {readonly:me.__readonly});
		me.x__note.select._fillLang({
			'enabled': "COMPOSE::HTML",
			'disabled': "COMPOSE::TEXT",
			'code': 'RICH::CODE'
		});

		if (gui._rtl || !me.x_note.__originalValue.EVNDESCFORMAT || me.x_note.__originalValue.EVNDESCFORMAT.toLowerCase() !== 'text/plain') {
			me.x__note.select._value('enabled');
		} else {
			me.x__note.select._value('disabled');
		}

		if(!me.__readonly) {
			me.x__note._focus();
		}

		me.x__note._value(note);
		me.x__note._main.parentNode.appendChild(mkElement('div', {
			innerText: getLang(me.__readonly?'FORM_BUTTONS::CLOSE':'COMMON::DONE'),
			className: 'close done_editing',
			onclick: function() {
				me.__forced_note = false;
				me._closeNote();
			}
		}), me.x__note._main);
	}

	this.x_note.__originalValue = this.x_note.__originalValue || {};
	this.x_note.__originalValue.EVNDESCFORMAT = this._aValues.EVNDESCFORMAT; // || 'text/plain' // default mode
	this.x_note.__originalValue.EVNNOTE = this._aValues.EVNNOTE || '';

	this.x_note._obeyEvent('onclick', [openNote]);

	if (me.__readonly && !this.x_note.__originalValue.EVNNOTE.length)
		this.x_note._disabled(true);

	this._getAnchor('left_column').addEventListener('click', function() {
		me._closeNote();
	});

	this.X_ATTACHMENTS.attachments._addColumns({
		ico: {
			css: 'file_type',
			type: 'static',
			width: 20
		},
		name: {
			title: "DATAGRID_ITEMS_VIEW::EVNFILENAME",
			encode: true,
			arg: {
				sort: 'asc'
			}
		},
		size:{
			title: "DATAGRID_ITEMS_VIEW::EVNFILESIZE",
			width: 60,
			css: 'size',
			arg: {
				sort: 'asc'
			}
		},
		remove: {
			css: 'remove',
			type: 'static',
			width: 20
		}
	});

	this.X_ATTACHMENTS.attachments._getAnchor('container2').addEventListener('click', function(e) {
		var match = e.target.id.match(/(\d)\/remove$/);
		if(match) {
			me.X_ATTACHMENTS._remove(me.X_ATTACHMENTS.attachments._aData[match[1]].id);
		}
	});

	if (this.__readonly) {
		this.X_ATTACHMENTS._disabled(true);
	} else {
		this.X_ATTACHMENTS.file._dropzone(this._getAnchor('container'), function(){
			return template.tmp('dropzone',{title:getLang('COMPOSE::DROP_TITLE'), body:getLang('COMPOSE::DROP_BODY')});
		}, 'item small');
		this.X_ATTACHMENTS._onuploadstart = function () {
			me.x_btn_ok._disabled(true);
		};
		this.X_ATTACHMENTS._onuploadend = function () {
			me.x_btn_ok._disabled(false);
		};
		this._getAnchor('attach_preview').addEventListener('click', function () {
			if (!me.X_ATTACHMENTS.__idtable.filter(function(attachement) {
				return !attachement.removed;
			}).length) {
				me.X_ATTACHMENTS.add_item._onclick();
			}
		});
	}
	this.EVNTYPE.input.plus.__eIN.setAttribute('placeholder', getLang('TAGS::ADD_TAGS'));
	//this.EVNTYPE.input._main = this.EVNTYPE.input.plus._main;
	this.EVNTYPE.input._disabled(this.__readonly);
	this.EVNTYPE.input._onchange = function() {
		var elm = me.EVNTYPE.input._getAnchor('tag');
		elm && elm.lastElementChild && elm.lastElementChild.scrollIntoView();
	};

	if (!me.__readonly){
		addcss(this._getAnchor('add_tags'), 'click');
		this._getAnchor('add_tags').addEventListener('click', function (e) {
			me.EVNTYPE.button._onclick();
		});

		this._getAnchor('tags_preview').addEventListener('click', function (e) {
			setTimeout(function () {
				if (!me.EVNTYPE._value()) {
					me.EVNTYPE.input.plus._focus();
				}
			}, 0);
		});
	}

	var loc = me._aValues.EVNLOCATION;
	if (loc && loc.indexOf('@')<0)
		loc = '';

	if (loc && (loc = MailAddress.splitEmailsAndNames(loc)[0]) && Is.Email(loc.email)){
		me._aValues['CONTACTS'] = me._aValues['CONTACTS'] || {};

		var bFound = false;
		for(var i in me._aValues['CONTACTS']) {
			if (me._aValues['CONTACTS'][i].values.CNTEMAIL == loc.email){
				bFound = true;
				break;
			}
		}

		if (!bFound) {
			me._aValues['CONTACTS'][getFreeKey(me._aValues['CONTACTS'])] = {
				values: {
					CNTEMAIL: loc.email,
					CNTCONTACTNAME: loc.name,
					CNTROLE: 'S',
					CNTSTATUS:'B',
					NEW: true
				}
			};
		}
	}

	//CNTCONTACTNAME: '__@@groupchat@@__' === loc.email?getLang('ATTENDEES::ALL_ATTENDEES'):loc.name,

	// Remove old location resource if a new location has been entered
	if(me.__originalLocation && me.__originalLocation != this.EVNLOCATION._value()) {
		for(var i in me._aValues['CONTACTS']) {
			if (me._aValues['CONTACTS'][i].values && me._aValues['CONTACTS'][i].values.CNTEMAIL === me.__originalLocation){
				delete me._aValues['CONTACTS'][i];
				break;
			}
		}
	}

	var users = [];
	var users2 = [];
	for(var i in me._aValues.CONTACTS) {
		var value = me._aValues.CONTACTS[i].values;
		users.push(value.CNTEMAIL);
		users2.push({
			email: value.CNTEMAIL,
			name: value.CNTCONTACTNAME,
			role: value.CNTROLE,
			status: value.CNTSTATUS,
			id: value.CNT_ID
		});
	};


	this.x_freebusy._init({
		evnid: me._aValues.EVN_ID,
		users: users
	});

	this.x_freebusy._onchange = function(d) {
		me.X_TIMEINTERVAL._value({
			EVNSTARTDATE: d.startdate,
			EVNSTARTTIME: d.starttime,
			EVNENDDATE: d.enddate,
			EVNENDTIME: d.endtime,
		}, true);
		me._previewTimeBlock();
	};

	var guest = sPrimaryAccountGUEST  || (TeamChatAPI && TeamChatAPI.teamChatOnly());
	if (guest || this.__attendee) {
		this.x_address_book_icon._main.classList.remove('noborder');
		this.x_address_book_icon._disabled(true);
	}
	else{
		this.x_address_book_icon._onclick = function() {
			gui._create('address_book', 'frm_addaddress', '', '', [me, '__onAddNewFromAddressbook'], ['ADDRESS_BOOK::SELECTED_ADDRESSES'], void 0, void 0, void 0, void 0,true);
			gui.address_book._modal(true);
		};
	}

	this.x_suggest._single = true;
	this.x_suggest._itemClass = ['C'];

	this.x_suggest._disobeyEvent('change',[this.x_suggest, '_checksize']);
	this.x_suggest._checksize = function() {};
	this.x_suggest._placeholder(getLang('ATTENDEES::QUICK_ADD'));
	this.x_suggest._onsubmit = function(){
		if (!this._checkError.length) {
			var tmp = MailAddress.splitEmailsAndNames(this._value());
			this._value('');
			if (tmp && tmp[0] && tmp[0].email) {
				me.__onAddNewFromAddressbook(true, [[MailAddress.createEmail(tmp[0].name, tmp[0].email)]]);
			}
		}
	};
	this.x_suggest.__minWidth = 400;
	this.x_suggest._onmouseselect = this.x_suggest._onsubmit;
	this.x_suggest._restrict([function(v) {
		if (v === '') return true;
		var tmp = MailAddress.splitEmailsAndNames(v);
		if (tmp && tmp[0] && tmp[0].email) {
			return Is.Email(tmp[0].email);
		}
		return false;
	}]);
	this.x_suggest._disabled(this.__readonly || this.__attendee);
	if(!this.__readonly && !guest && !this.__attendee) {
		this.x_suggest._main.appendChild(mkElement('div', {
			className: 'add',
			onclick: function() {
				gui._create('address_book', 'frm_addaddress', '', '', [me, '__onAddNewFromAddressbook'], ['ADDRESS_BOOK::SELECTED_ADDRESSES'], void 0, void 0, void 0, void 0,true);
				gui.address_book._modal(true);
			}
		}));
	}

	this.x_list = this._getAnchor('user_list');
	this.x_list.__users = [];

	// User roles:
	//   Required='Q', Resource='S', Optional='T', Organizer='G';

	// User status:
	//   Accepted = 'A'; Declined = 'D'; Delegated = 'E'; None = 'N';
	//   Completed = 'M'; NeedsAction = 'B'; Tentative = 'T'; Confirmed = 'C';
	//   Cancelled = 'Q'; InProcess = 'I'; Draft = 'F'; Final = 'L';

	this.x_list.onclick = function(e){
		var e = e || window.event,
			elm = e.target || e.srcElement,
			bRemove = false;

		if (elm.tagName == 'SPAN') {
			bRemove = true;
			elm = elm.parentNode;
		};

		if(!elm.id) {
			elm = elm.parentNode;
		}

		var id = elm.id.substr((me._pathName+'.list/').length);

		if (this.__users[id] && id>0){

			if (this.__users[id].active && (e.ctrlKey  || e.metaKey)){
				removecss(elm,'active');
				this.__users[id].active = false;
			}
			else{
				if (!e.ctrlKey && !e.metaKey){
					var active = this._getActive();
					var tmp;
					for (var i in active){
						try{
							tmp = document.getElementById(me._pathName+'.list/'+active[i]);
							removecss(tmp,'active');
							this.__users[active[i]].active = false;
						}
						catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r);}
					}
				}

				addcss(elm,'active');
				this.__users[id].active = true;
			}

			if (bRemove)
				me.x_list._removeUser();
			else{
				var pos = e.clientX-getSize(elm).x;
				if (pos<40 && !gui._rtl || gui._rtl && pos>205){

					this.oncontextmenu && this.oncontextmenu(e);

					e.cancelBubble=true;
					if (e.preventDefault)
						e.preventDefault();
					if (e.stopPropagation)
						e.stopPropagation();

					return false;
				}
			}
		}
	};

	if (!this.__attendee){
		this.x_list.oncontextmenu = function(e){
			var e = e || window.event,
				elm = e.target || e.srcElement;

			if(!elm.id) {
				elm = elm.parentNode;
			}

			if (elm.tagName == 'SPAN')
				elm = elm.parentNode;

			var id = elm.id.substr((me._pathName+'.list/').length);

			if (this.__users[id] && id>0){
				var aMenu,pos = getSize(elm);

				//Attendee is not able to change STATUS
				if (e.clientX-pos.x<20 && me.__attendee)
					return;

				var cmenu = gui._create('cmenu','obj_context','','obj_timetable_context');

				cmenu._onclick = function(e,elm,id,arg){
					var usr;
					if ((usr = me.x_list.__users[arg.id])){
						usr[arg.key] = arg.value;
						me.x_list._editUser(usr, arg.id);
					}
				};

				//Status
				if (e.clientX-pos.x<20 && !gui._rtl || gui._rtl && e.clientX-pos.x<228){

					aMenu = [{'title':'ATTENDEES::STATUS_P',css:'bg_status_P','arg':{'id':id,'key':'status',value:''}},
							{'title':'ATTENDEES::STATUS_A',css:'bg_status_A','arg':{'id':id,'key':'status',value:'A'}},
							{'title':'ATTENDEES::STATUS_D',css:'bg_status_D','arg':{'id':id,'key':'status',value:'D'}}];

					cmenu._fill(aMenu);
					cmenu._place(gui._rtl?pos.x+218:pos.x+10,pos.y+pos.h,150,2);
				}
				//Role
				else{
					aMenu = [{'title':'ATTENDEES::ROLE_Q',css:'bg_role_Q','arg':{'id':id,'key':'role',value:'Q'}},
							{'title':'ATTENDEES::ROLE_S',css:'bg_role_S','arg':{'id':id,'key':'role',value:'S'}},
							{'title':'ATTENDEES::ROLE_T',css:'bg_role_T','arg':{'id':id,'key':'role',value:'T'}}];

					cmenu._fill(aMenu);
					cmenu._place(gui._rtl?pos.x+236:pos.x+30,pos.y+pos.h,150,2);
				}
			}

			return false;
		};
	}

	this.x_list.ondblclick = function(e){
		var e = e || window.event,
			elm = e.target || e.srcElement;

		if(!elm.id) {
			elm = elm.parentNode;
		}

		if (elm.id && elm.id.indexOf((me._pathName+'.list/'))==0){
			var active = this._getActive();
			if (active.length){
				var user = this.__users[active[0]];
				gui._create('edit_dialog', 'frm_edit_attendee', '', '', 'frm_edit_attendee', 'ATTENDEES::EDIT_TITLE', [me, '__onEdit'], {CNT_ID:user.id,CNTEMAIL:user.email,CNTCONTACTNAME:user.name,CNTROLE:user.role,CNTSTATUS:user.status}, active, me.__attendee);
			}
		}
		else
		if (elm.tagName != 'SPAN' && !me.__attendee)
			gui._create('edit_dialog', 'frm_edit_attendee', '', '', 'frm_edit_attendee', 'ATTENDEES::ADD_TITLE', [me, '__onAddNew'],'','',me.__owner != me.__real_email);
	};

	//get all active rows
    this.x_list._getActive = function(){
		var active = [];
		for(var i in this.__users)
			if (this.__users[i] && this.__users[i].active && this.__users[i].action != 'remove')
                active.push(i);

		return active;
	};

	//fill list
    var ulp = this._getAnchor('user_list_preview');
	this.x_list._fill = function(scroll_to_last){
		var c = 0, css, out = mkElement('div');
		var folder = me.__evnid.fid ? dataSet.get('folders', [me.__evnid.aid, Path.slash(me.__evnid.fid)]) || {} : {};

		var bIsOrganizer = !me.__evnid.iid || this.__users.some(function (user) {
			return user.email === me.__real_email && user.role === 'G';
		}) || ~(folder.RIGHTS || '').indexOf('w') || (me.__evnid.owner_id === sPrimaryAccount);
		/*for(var i in dataSet.get('items', [sPrimaryAccount])) {
			var item = dataSet.get('items', [sPrimaryAccount, i, WMItems.__clientID(me.__evnid)]);
			if(item && item.EVNFLAGS & 2) {
				bIsOrganizer = true;
			}
		}*/
		var myself = false;
		this.__users = this.__users.sort(function(a, b) {
			return (a.role === 'G') ? -1 : (b.role === 'G');
		});

		for(var i = 0; i < this.__users.length; i++){
			if (this.__users[i].action == 'remove')
				continue;

			css = '';
			if (this.__users[i].status)
				css = 'status_' + this.__users[i].status;

			if (this.__users[i].role)
				css += (css ? ' ' : '') + 'role_' + this.__users[i].role;

			out.appendChild(mkElement('div',{
				id: me._pathName + '.list/' + i,
				className: (this.__users[i].active ? 'active' : '') + (this.__users[i].css ? ' ' + this.__users[i].css : '') + ' ' + css,
				unselectable: 'on',
				title: this.__users[i].email,
				innerHTML: '<div class="img" style="background-image: url(\'' + getAvatarURL(this.__users[i].email) + '\')"></div>' + (this.__users[i].email === me.__real_email ? getLang('COMMON::YOU') : (this.__users[i].name || this.__users[i].email).escapeHTML()) + ((!i && WMFolders.getType(me._id) == 'I' && this.__users[i].role == 'Q') || !(this.__users[i].role!='G' && bIsOrganizer) ? '':(me.__attendee?'':'<span></span>'))
			}));
			if(this.__users[i].email === me.__real_email) {
				myself = true;
			}

			c++;
		}

		this.innerHTML = out.innerHTML;
		out = null;
		if (scroll_to_last) {
			this.lastElementChild.scrollIntoView();
		}

		//set height because of scrollbar
		if (me._container)
			me._container.style.height = (c>8?(c*25)+'px':'100%');

		if(this.__users.length === 1) {
			myself = false;
		}
		ulp.textContent = getLang('ATTENDEES::ATTENDEES' + (myself ? '_MYSELF' : ''), [this.__users.length - (myself ? 1 : 0)]);
	};

	//add user
	this.x_list._addUser = function(aInfo, bNoUpdate, bSkipNew, bNoScroll){
		me.__forced_note = false;
		me._closeNote();
		if (aInfo.email && aInfo.email.indexOf('[') === 0){
			(new wm_tools()).distrib({
				name: aInfo.email
			}, [this, '_addGroup', [aInfo.role,bNoUpdate,bSkipNew,bNoScroll]]);
			return false;
		} else {
			aInfo.email = aInfo.email.toLowerCase();
			for(var i = this.__users.length - 1; i > -1; i--)
				if (this.__users[i].email == aInfo.email && this.__users[i].action != 'remove') //ignore
					return false;

			if(!bSkipNew) {
				aInfo.action = 'new';
				ulb.classList.add('expanded');
			}
			this.__users.push(aInfo);
			this._fill(!bNoScroll);

			if (!bNoUpdate)
				me.x_freebusy._users(this.__users.map(function(user) {
					return user.email;
				}));

			return true;
		}
	};

	//add group of users
	this.x_list._addGroup = function(aData,sRole,bNoUpdate,bSkipNew,bNoScroll){

		for(var i in aData){
		    aData[i].role = sRole;
			this._addUser(aData[i],true,bSkipNew,bNoScroll);
		}

		if (!bNoUpdate)
			me.x_freebusy._users(this.__users.map(function(user) {
				return user.email;
			}));
	};

	//edit user
	this.x_list._editUser = function(aValues, iid){
		if (Is.Defined(iid) && this.__users[iid]){

			//check email
			for(var i = this.__users.length-1;i>-1;i--)
				if (i!=iid && this.__users[i].email == aValues.email){
					aValues.email = this.__users[iid].email;
					break;
				}

			//check update
			var doUpd = false;
			if (this.__users[iid].email != aValues.email)
                doUpd = true;

			//merge values
			for (var i in aValues)
				this.__users[iid][i] = aValues[i];

			if(this.__users[iid].action !== 'new') {
				this.__users[iid].action = 'edit';
			}

			this._fill();

			if (doUpd)
				me.x_freebusy._users(this.__users.map(function(user) {
					return user.email;
				}));
		}
		else{
            aValues.checked = true;
			this._addUser(aValues);
		}
	};
	//remove user
	this.x_list._removeUser = function(){
		var rem = false;
		for(var i in this.__users)
			if (this.__users[i] && this.__users[i].active){
				if (this.__users[i].action == 'new')
				    this.__users.splice(i,1);
				else
					this.__users[i].action = 'remove';

				rem = true;
			}

		if (rem){
			this._fill();
            me.x_freebusy._users(this.__users.map(function(user) {
				return user.email;
			}));
		}
	};

	this.x_list._getAttendees = function() {
		var aResult = [];
		for (var i in this.__users) {
			switch (this.__users[i]['action']) {
				case 'remove':
					aResult.push({'uid': this.__users[i]['id']});
					break;
				case 'edit':
					aResult.push({'uid': this.__users[i].id, 'values': {
						CNTCONTACTNAME: this.__users[i].name,
						CNTEMAIL: this.__users[i].email,
						CNTROLE: this.__users[i].role,
						CNTSTATUS: this.__users[i].status,
						CNT_ID: this.__users[i].id
					}});
					break;
				case 'new':
					aResult.push({'values': {
						CNTCONTACTNAME: this.__users[i].name,
						CNTEMAIL: this.__users[i].email,
						CNTROLE: this.__users[i].role,
						CNTSTATUS: this.__users[i].status,
						CNT_ID: this.__users[i].id
					}});
				default:
					break;
			}
		}
		return aResult;
	};

	var ulp = this._getAnchor('user_list_preview');
	var ulc = this._getAnchor('user_list_collapse');
	var ulb = this._getAnchor('user_list_block');
	ulp.addEventListener('click', function() {
		ulb.classList.add('expanded');
	});
	ulc.addEventListener('click', function() {
		ulb.classList.remove('expanded');
	});

	//INSERT DEFAULT ACCOUNT
    var acc = MailAddress.splitEmailsAndNames(sOwner || me.__real_email)[0];
    	acc.css = 'main_account';
		acc.role = 'G';
		acc.status = 'A';

	var aAccInfo = dataSet.get('accounts', [sOwner || me.__real_email]);
	if (aAccInfo && aAccInfo['FULLNAME'])
		acc.name = aAccInfo['FULLNAME'];

	users2.forEach(function(user) {
		this.x_list._addUser(user, false, !!me._id[2], true);
	}, this);

	if (WMFolders.getType([this._sAccountID, this._sFolderID]) !== 'I')
		this.x_list._addUser(acc, false, true, true);

	this.__initForm('EVENT::EVENT');

	var datetime = this.X_TIMEINTERVAL._value();
	this.x_freebusy._value({
		startdate: datetime.EVNSTARTDATE,
		starttime: datetime.EVNSTARTTIME,
		enddate: datetime.EVNENDDATE,
		endtime: datetime.EVNENDTIME,
		tzid: datetime.TZID,
		title: this.EVNTITLE._value() || getLang('EVENT::EVENT')
	});

	if (this._aValues.EVNNOTE) {
		this._showNote(this._aValues.EVNNOTE, this._aValues.EVNDESCFORMAT === 'text/plain');
		openNote();
		// this.__forced_note = true;
	}

	this._closeBlocks();
	if(!me._id[2] || this.x_list.__users.length < 10) {
		ulb.classList.add('expanded');
	}
};

_me._closeNote = function() {
	if (!this.x__note || this.__forced_note) {
		return;
	}

	var
		isPlainText = this.x__note.select._value() === 'disabled',
		value = this.x__note._value(),
		close;

	this.x_note.__originalValue.EVNDESCFORMAT = isPlainText ? 'text/plain' : 'text/html';

	if(isPlainText) {
		value = value.unescapeHTML();
	}

	this.x_note.__originalValue.EVNNOTE = value; // save text of the note - next code is about displaing it

	this._showNote(value, isPlainText);

	this.x_freebusy._main.style.zIndex = 0;
	this.x_freebusy._main.style.opacity = 1;
	this.x__note._destruct();

	close = this._main.querySelector('.done_editing');
	close && close.parentNode.removeChild(close);
};

_me._showNote = function(value, isPlainText) {
	if(!isPlainText) {
		var tmp = document.implementation.createHTMLDocument('').body;
		tmp.innerHTML = DOMPurify.sanitize(value);
		value = tmp.textContent || tmp.innerText || '';
	}

	if (value.trim()) {
		// use correct encoding
		this.x_note._value(value.escapeHTML());
		this.x_note._main.classList.add('filled');
	}
	else {
		this.x_note._value(getLang('EVENT::ADD_NOTE'));
		this.x_note._main.classList.remove('filled');
	}
};

_me.__onEdit = function(aValues, iid){
	this.x_list._editUser({
		name: aValues.CNTCONTACTNAME,
		email: aValues.CNTEMAIL,
		role: aValues.CNTROLE,
		status: aValues.CNTSTATUS,
		id: aValues.CNT_ID
	}, iid);
};

_me.__onAddNew = function(aValues){
	var out = {
		name: aValues.CNTCONTACTNAME,
		email: aValues.CNTEMAIL,
		role: ~this.EVNLOCATION.__out.indexOf(aValues.CNTEMAIL) ? 'S' : aValues.CNTROLE
	};
	if (aValues.CNTSTATUS !== 'P')
		out.status = aValues.CNTSTATUS;
	this.x_list._addUser(out);
};

_me.__onAddNewFromAddressbook = function(bOK, aAddresses,sRole){
    if (bOK && aAddresses[0]) {
		var tmp, bUpdate = false;

		for (var i in aAddresses[0]){
			tmp = MailAddress.splitEmailsAndNames(aAddresses[0][i]);

			if (typeof tmp[0] === 'object'){
				var resource = false;
				for(var i in this.EVNLOCATION.__out || {}) {
					resource = MailAddress.splitEmailsAndNames(this.EVNLOCATION.__out[i])[0].email === tmp[0].email;
					if(resource) {
						break;
					}
				}
				tmp[0].role = resource ? 'S' : (Is.String(sRole) ? sRole : 'Q');
				bUpdate = this.x_list._addUser(tmp[0], true);
			}
		}

		if (bUpdate) {
			this.x_freebusy._users(this.x_list.__users.map(function(user) {
				return user.email;
			}));
		}
	}
};

_me._initGooglePlacesAutocomplete = function (API_KEY) {
	if (!API_KEY) {
		return;
	}

	if (!document.getElementById('googleapis')) {
		document.head.appendChild(mkElement('script', {
			id: 'googleapis',
			src: 'https://maps.googleapis.com/maps/api/js?key=' + API_KEY + '&libraries=places&callback=' + this._pathName + '.__googlePlacesAutocompleteCallback',
		}));
	} else {
		this.__googlePlacesAutocompleteCallback();
	}
};

_me.__googlePlacesAutocompleteCallback = function () {
	var me = this;

	var service = new google.maps.places.AutocompleteService();
	var last_value = '';
	this.EVNLOCATION.__eIN.addEventListener('keyup', function (e) {
		if (e.target.value) {
			me.EVNLOCATION._custom_list_className = 'powered_by_google';
			if (last_value !== e.target.value) {
				last_value = e.target.value;
				service.getQueryPredictions({
					input: e.target.value
				}, function (results) {
					var out = {};
					for (var i in me.EVNLOCATION.__out) {
						if (~me.EVNLOCATION.__out[i].toLowerCase().indexOf(e.target.value)) {
							out[i] = me.EVNLOCATION.__out[i];
						}
					}
					(results || []).forEach(function (result) {
						out[result.description] = result.description;
					});
					me.EVNLOCATION._fill(out);
					me.EVNLOCATION._show();
				});
			} else {
				me.EVNLOCATION._show();
			}
		} else {
			me.EVNLOCATION._custom_list_className = '';
			me.EVNLOCATION.block && !me.EVNLOCATION.block._destructed && me.EVNLOCATION.block._destruct();
			me.EVNLOCATION._fill(me.EVNLOCATION.__out);
		}
	});
};

_me._closeBlocks = function () {
	this._previewTimeBlock();
	this._previewMemoBlock();
	// [].forEach.call(this._main.querySelectorAll('.block'), function (block) {
	// 	block.classList.remove('active');
	// });
};

_me._previewTimeBlock = function () {
	var v = this.X_TIMEINTERVAL._value();

	this._getAnchor('time_preview').innerHTML = [
		new iMipRecurrence(this._repeatToImip(this.X_REPEATING.__rcrvalue), IcewarpDate.julian(v.EVNSTARTDATE, v.EVNSTARTTIME), v.EVNTIMEFORMAT !== 'F', IcewarpDate.julian(v.EVNENDDATE, v.EVNENDTIME)).toString('dddd D, MMM').replace(),
		(this.X_REMINDERS._value() && this.X_REMINDERS._value() !== '0') ? getLang('REMINDER::REMINDER') + ' ' + this._reminderObjectToText(this._reminderKeyToObject(this.X_REMINDERS._value())) : false
	].filter(Boolean).join('<br>');

};

_me._previewMemoBlock = function () {
	var attachments = this.X_ATTACHMENTS.__idtable.filter(function(attachement) {
		return !attachement.removed;
	});
	this._getAnchor('attach_preview').innerHTML = attachments.length ? getLang('ATTACHMENT::N_ATTACHMENTS', [attachments.length.toString()]) : getLang('ATTACHMENT::ADD_ATTACHMENT');

	var tags = [].map.call(this.EVNTYPE.input.__etag.querySelectorAll('span'), function(tag) {
		return '<span style="' + tag.getAttribute('style') + '">' + tag.textContent.entityify() + '</span>';
	});

	this._getAnchor('tags_preview').innerHTML = tags.length ? tags.join('') : getLang('TAGS::ADD_TAGS');
};

_me._setReminderSelect = function (REMINDERS) {
	var rem;

	for(var i in REMINDERS) {
		if (REMINDERS[i].values && (!REMINDERS[i].values.RMNTIME || (+REMINDERS[i].values.RMNDAYSBEFORE || +REMINDERS[i].values.RMNHOURSBEFORE || +REMINDERS[i].values.RMNMINUTESBEFORE))){
			rem = REMINDERS[i];
			break;
		}
	}

	if (!rem) {
		this.X_REMINDERS._value('0');
	} else {
		if (~[1, 2, 7].indexOf(+rem.values.RMNDAYSBEFORE)) {
			this.X_REMINDERS._value(rem.values.RMNDAYSBEFORE + 'D');
		} else if (~[1440, 2880, 10080].indexOf(+rem.values.RMNMINUTESBEFORE)) {
			this.X_REMINDERS._value(rem.values.RMNMINUTESBEFORE / 1440 + 'D');
		} else if (~[1, 2].indexOf(+rem.values.RMNHOURSBEFORE)) {
			this.X_REMINDERS._value(rem.values.RMNHOURSBEFORE + 'H');
		} else if (~[60, 120].indexOf(+rem.values.RMNMINUTESBEFORE)) {
			this.X_REMINDERS._value(rem.values.RMNMINUTESBEFORE / 60 + 'H');
		} else if (~[0, 10, 30].indexOf(+rem.values.RMNMINUTESBEFORE)) {
			this.X_REMINDERS._value(rem.values.RMNMINUTESBEFORE + 'M');
		} else {
			this.X_REMINDERS._value('*', true);
		}
		this.X_REMINDERS.__eLBL.innerHTML = this._reminderObjectToText(rem.values);
	}
	this.X_REMINDERS.__value = rem;
};

_me._reminderKeyToObject = function (key) {
	switch (key) {
		case '0':
			return '';
		case '0M':
			return {
				values: {
					RMNDAYSBEFORE: 0,
					RMNHOURSBEFORE: 0,
					RMNMINUTESBEFORE: 0
				}
			};
		case '10M':
			return {
				values: {
					RMNDAYSBEFORE: 0,
					RMNHOURSBEFORE: 0,
					RMNMINUTESBEFORE: 10
				}
			};
		case '30M':
			return {
				values: {
					RMNDAYSBEFORE: 0,
					RMNHOURSBEFORE: 0,
					RMNMINUTESBEFORE: 30
				}
			};
		case '1H':
			return {
				values: {
					RMNDAYSBEFORE: 0,
					RMNHOURSBEFORE: 1,
					RMNMINUTESBEFORE: 00
				}
			};
		case '2H':
			return {
				values: {
					RMNDAYSBEFORE: 0,
					RMNHOURSBEFORE: 2,
					RMNMINUTESBEFORE: 0
				}
			};
		case '1D':
			return {
				values: {
					RMNDAYSBEFORE: 1,
					RMNHOURSBEFORE: 0,
					RMNMINUTESBEFORE: 0
				}
			};
		case '2D':
			return {
				values: {
					RMNDAYSBEFORE: 2,
					RMNHOURSBEFORE: 0,
					RMNMINUTESBEFORE: 0
				}
			};
		case '7D':
			return {
				values: {
					RMNDAYSBEFORE: 7,
					RMNHOURSBEFORE: 0,
					RMNMINUTESBEFORE: 0
				}
			};
	}
	if(key && key.values) {
		key.values.RMNDAYSBEFORE = key.values.RMNDAYSBEFORE || 0;
		key.values.RMNHOURSBEFORE = key.values.RMNHOURSBEFORE || 0;
		key.values.RMNMINUTESBEFORE = key.values.RMNMINUTESBEFORE || 0;
	}
	return key;
};

_me._reminderObjectToText = function (value) {
	var v = (value || {}).values || value;
	if (!v) {
		return 'REMINDER::NONE';
	}
	if (+v.RMNDAYSBEFORE === 7 || +v.RMNMINUTESBEFORE === 10080) {
		return getLang('REMINDER::WEEKBEFORE');
	} else if (+v.RMNDAYSBEFORE) {
		return getLang('REMINDER::DAYSBEFORE', [+v.RMNDAYSBEFORE]);
	} else if (+v.RMNHOURSBEFORE) {
		return getLang('REMINDER::HOURSBEFORE', [+v.RMNHOURSBEFORE]);
	} else if (+v.RMNMINUTESBEFORE) {
		if (+v.RMNMINUTESBEFORE % 1440 === 0) {
			return getLang('REMINDER::DAYSBEFORE', [+v.RMNMINUTESBEFORE / 1440]);
		} else if (+v.RMNMINUTESBEFORE % 60 === 0) {
			return getLang('REMINDER::HOURSBEFORE', [+v.RMNMINUTESBEFORE / 60]);
		}
	}

	return getLang('REMINDER::MINUTESBEFORE', [+v.RMNMINUTESBEFORE]);
};

_me._setRecurrenceSelect = function (RECURRENCES, bNoUpdate) {

	var rec;
	for(var i in RECURRENCES) {
		rec = RECURRENCES[i];
	}

	if (!rec || !rec.values) {
		this.X_REPEATING._value('0');
	} else {
		if (!+rec.values.RCRCOUNT) {
			if (+rec.values.RCRDAYREPETITION === 1 && +rec.values.RCRMONTHREPETITION === 0) {
				this.X_REPEATING._value('D', bNoUpdate);
			} else if (+rec.values.RCRWEEKREPETITION === 1 && (rec.values.RCRDAYOFWEEKNUMBER == 0 || +rec.values.RCRDAYOFWEEKNUMBER === [1,2,4,8,16,32,64][IcewarpDate.julian(this.X_TIMEINTERVAL._value().EVNSTARTDATE).day()])) {
				this.X_REPEATING._value('W', bNoUpdate);
			} else if (+rec.values.RCRWEEKREPETITION === 2 && (rec.values.RCRDAYOFWEEKNUMBER == 0 || +rec.values.RCRDAYOFWEEKNUMBER === [1,2,4,8,16,32,64][IcewarpDate.julian(this.X_TIMEINTERVAL._value().EVNSTARTDATE).day()])) {
				this.X_REPEATING._value('F', bNoUpdate);
			} else if (+rec.values.RCRMONTHREPETITION === 1 && +rec.values.RCRDAYREPETITION === IcewarpDate.julian(this.X_TIMEINTERVAL._value().EVNSTARTDATE).date()) {
				this.X_REPEATING._value('M', bNoUpdate);
			} else if (+rec.values.RCRYEARREPETITION === 1) {
				this.X_REPEATING._value('Y', bNoUpdate);
			} else {
				this.X_REPEATING._value('*', true);
				this.X_REPEATING.__eLBL.innerHTML = new iMipRecurrence(this._repeatToImip(rec)).toString();
			}
		} else {
			this.X_REPEATING._value('*', true);
			this.X_REPEATING.__eLBL.innerHTML = new iMipRecurrence(this._repeatToImip(rec)).toString();
		}
	}

	this.X_REPEATING.__rcrvalue = rec;
};

_me._repeatingKeyToObject = function (key) {
	switch (key) {
		case '0':
			return void 0;
		case 'D':
			return {
				values: {
					RCRDAYREPETITION: 1,
					RCRDAYOFWEEKNUMBER: 0,
					RCRWEEKREPETITION: 0,
					RCRWEEKOFMONTHNUMBER: 0,
					RCRMONTHREPETITION: 0,
					RCRMONTHOFYEARNUMBER: 0,
					RCRYEARREPETITION: 0,
					RCRENDDATE: "",
					RCRCOUNT: ""
				}
			};
		case 'W':
			return {
				values: {
					RCRDAYREPETITION: 0,
					RCRDAYOFWEEKNUMBER: 0, //[1,2,4,8,16,32,64][IcewarpDate.julian(this.X_TIMEINTERVAL._value().EVNSTARTDATE).day()],
					RCRWEEKREPETITION: 1,
					RCRWEEKOFMONTHNUMBER: 0,
					RCRMONTHREPETITION: 0,
					RCRMONTHOFYEARNUMBER: 0,
					RCRYEARREPETITION: 0,
					RCRENDDATE: "",
					RCRCOUNT: ""
				}
			};
		case 'F':
			return {
				values: {
					RCRDAYREPETITION: 0,
					RCRDAYOFWEEKNUMBER: 0, //[1,2,4,8,16,32,64][IcewarpDate.julian(this.X_TIMEINTERVAL._value().EVNSTARTDATE).day()],
					RCRWEEKREPETITION: 2,
					RCRWEEKOFMONTHNUMBER: 0,
					RCRMONTHREPETITION: 0,
					RCRMONTHOFYEARNUMBER: 0,
					RCRYEARREPETITION: 0,
					RCRENDDATE: "",
					RCRCOUNT: ""
				}
			};
		case 'M':
			return {
				values: {
					RCRDAYREPETITION: IcewarpDate.julian(this.X_TIMEINTERVAL._value().EVNSTARTDATE).date(),
					RCRDAYOFWEEKNUMBER: 0,
					RCRWEEKREPETITION: 0,
					RCRWEEKOFMONTHNUMBER: 0,
					RCRMONTHREPETITION: 1,
					RCRMONTHOFYEARNUMBER: 0,
					RCRYEARREPETITION: 0,
					RCRENDDATE: "",
					RCRCOUNT: ""
				}
			};
		case 'Y':
			return {
				values: {
					RCRDAYREPETITION: 0,
					RCRDAYOFWEEKNUMBER: 0,
					RCRWEEKREPETITION: 0,
					RCRWEEKOFMONTHNUMBER: 0,
					RCRMONTHREPETITION: 0,
					RCRMONTHOFYEARNUMBER: 0,
					RCRYEARREPETITION: 1,
					RCRENDDATE: "",
					RCRCOUNT: ""
				}
			};
	}
	return key;
};

_me._repeatToImipWeekDay = function (v) {
	if (+v.RCRDAYOFWEEKNUMBER) {
		var days = [];
		['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].forEach(function (h, k) {
			if (+v.RCRDAYOFWEEKNUMBER & Math.pow(2, k)) {
				days.push((+v.RCRWEEKOFMONTHNUMBER || '') + h);
			}
		});
		if (days.length) {
			return 'BYDAY=' + days.join(',');
		}
	}
};

_me._repeatToImip = function (repeat) {
	var v = (repeat || {}).values || repeat;
	if (!v) {
		return '';
	}
	var freq;
	var interval;
	var specific = [];
	var limit;
	if (+v.RCRYEARREPETITION) {
		freq = 'YEARLY';
		interval = v.RCRYEARREPETITION;
		if (+v.RCRMONTHOFYEARNUMBER) {
			specific.push('BYMONTH=' + v.RCRMONTHOFYEARNUMBER);
		}
		specific.push(this._repeatToImipWeekDay(v));
	} else if (+v.RCRMONTHREPETITION) {
		freq = 'MONTHLY';
		interval = v.RCRMONTHREPETITION;
		specific.push(this._repeatToImipWeekDay(v));
		if (+v.RCRDAYREPETITION) {
			specific.push('BYMONTHDAY=' + v.RCRDAYREPETITION);
		}
	} else if (+v.RCRWEEKREPETITION) {
		freq = 'WEEKLY';
		interval = v.RCRWEEKREPETITION;
		specific.push(this._repeatToImipWeekDay(v));
	} else if (+v.RCRDAYREPETITION) {
		freq = 'DAILY';
		interval = v.RCRDAYREPETITION;
	}
	if (+v.RCRCOUNT) {
		limit = 'COUNT=' + v.RCRCOUNT;
	} else if (+v.RCRENDDATE) {
		limit = 'UNTIL=' + IcewarpDate.julian(+v.RCRENDDATE).format('YYYYMMDD[T]HHmmss[Z]');
	}

	return [
		'FREQ=' + freq,
		'INTERVAL=' + interval,
		specific.filter(Boolean).join(';'),
		limit
	].filter(Boolean).join(';');
};

_me.__print = function (aValues) {
	this.__forced_note = false;
	this._closeNote();

	aValues = aValues.values;
	if ('text/html' === aValues.EVNDESCFORMAT) {
		aValues.EVNNOTE = DOMPurify.sanitize(aValues.EVNNOTE);
	}

	if ((aValues._TZEVNSTARTDATE || aValues.EVNSTARTDATE) > 0) {
		if ((aValues._TZEVNSTARTTIME || aValues.EVNSTARTTIME) > 0) {
			aValues.COUNT_DATE = IcewarpDate.julian(aValues._TZEVNSTARTDATE || aValues.EVNSTARTDATE).setTime(aValues._TZEVNSTARTTIME || aValues.EVNSTARTTIME, true).format('L LT');
		} else {
			aValues.COUNT_DATE = IcewarpDate.julian(aValues._TZEVNSTARTDATE || aValues.EVNSTARTDATE).setTime(0).format('L');
		}

		if ((aValues._TZEVNENDTIME || aValues.EVNENDTIME) > 0) {
			aValues.COUNT_DATE += ' - ' + IcewarpDate.julian(aValues._TZEVNENDDATE || aValues.EVNENDDATE).setTime(aValues._TZEVNENDTIME || aValues.EVNENDTIME, true).format('L LT');
		} else {
			aValues.COUNT_DATE += ' - ' + IcewarpDate.julian(aValues._TZEVNENDDATE || aValues.EVNENDDATE).setTime(0).format('L');
		}
	} else
		aValues.COUNT_DATE = '';

	if (!gui.print)
		gui._create('print', 'frm_print');

	gui.print._add('E', aValues);
};

_me.__loadItems = function () {
	var me = this;

	this._setRecurrenceSelect(this._aValues.RECURRENCES, true);

	for(var i in this._aValues.REMINDERS) {
		this.__reminderID = i;
		break;
	}

	if (!this._aValues.TZID) {
		this._aValues.TZID = GWOthers.getItem('CALENDAR_SETTINGS', 'timezone');
		this._aValues.EVNTIMEFORMAT = 'Z';
	}

	if (this._aValues.EVNSTARTDATE === void 0) { //set default time
		this._aValues = arrConcat(this._aValues, getActualEventTime());
	}

	var me = this;
	this.X_TIMEINTERVAL._value(this._aValues);

	this.X_TIMEINTERVAL._onchange = function () {
		me.__forced_note = false;
		me._closeNote();
		me._aValues['EVNSTARTDATE'] = this._value().EVNSTARTDATE;
		var datetime = me.X_TIMEINTERVAL._value();
		me.x_freebusy._value({
			startdate: datetime.EVNSTARTDATE,
			starttime: Math.max(datetime.EVNSTARTTIME, 0),
			enddate: datetime.EVNENDDATE,
			endtime: Math.max(datetime.EVNENDTIME, 0),
			tzid: datetime.TZID,
			title: me.EVNTITLE._value() || getLang('EVENT::EVENT')
		}, true);
	};

	if (me._aValues['ATTACHMENTS']) {
		var out = [];
		for (var i in me._aValues['ATTACHMENTS'])
			out.push({
				'name': me._aValues['ATTACHMENTS'][i]['values']['ATTDESC'],
				'class': me._aValues['ATTACHMENTS'][i]['values']['ATTTYPE'],
				'id': i,
				'ticket': me._aValues['ATTACHMENTS'][i]['values']['TICKET'],
				'fullpath': me._aValues['ATTACHMENTS'][i]['values']['FULLPATH'] || me._aValues.fullpath,
				'size': me._aValues['ATTACHMENTS'][i]['values']['ATTSIZE']
			});

		this.X_ATTACHMENTS._value({
			path: !me._aValues.fullpath && me._sItemID? me._sAccountID + '/' + me._sFolderID + '/' + WMItems.__serverID(me._sItemID) : void 0,
			values: out
		});
	} else if (me._aValues['PUSH_ATTACHMENTS']) {
		var out = [];
		for (var i in me._aValues['PUSH_ATTACHMENTS'])
			out.push({
				'name': me._aValues['PUSH_ATTACHMENTS'][i]['title'],
				'id': me._aValues['PUSH_ATTACHMENTS'][i]['id'],
				'size': me._aValues['PUSH_ATTACHMENTS'][i]['size'],
				'class': me._aValues['PUSH_ATTACHMENTS'][i]['embedded'] ? 'item' : 'itemlink',
				'fullpath': me._aValues['PUSH_ATTACHMENTS'][i]['fullpath']
			});

		this.X_ATTACHMENTS._value({
			path: me._aValues['PUSH_ATTACHMENTS'][0]['fullpath'].substr(0, me._aValues['PUSH_ATTACHMENTS'][0]['fullpath'].lastIndexOf('/')),
			values: out
		});
	}

	loadDataIntoForm(this, this._aValues);

	if (!this._aValues['EVN_ID']) {
		this.X_EVNFLAGS._value(GWOthers.getItem('DEFAULT_CALENDAR_SETTINGS', 'event_show_as'));
		if(+GWOthers.getItem('EVENT_SETTINGS', 'DEFAULT_REMINDER')) {
			this._setReminderSelect([{values:{RMNMINUTESBEFORE: GWOthers.getItem('EVENT_SETTINGS', 'TIME') / 60000}}]);
		} else {
			this.X_REMINDERS._value('0');
		}
	} else {
		this._setReminderSelect(this._aValues.REMINDERS);

		var tmp = 'S',
			flg = this._aValues.EVNFLAGS ? this._aValues.EVNFLAGS * 1 : 0;

		if ((flg & 16) === 16) {
			tmp = 'O';
		} else if ((flg & 4) === 4) {
			tmp = 'F';
		} else if ((flg & 8) === 8) {
			tmp = 'T';
		}

		this.X_EVNFLAGS._value(tmp);
	}
	if ((this._aValues.EVNFLAGS & 64) || (~['I', 'Y'].indexOf((dataSet.get('folders', [this._id[0], this._id[1]]) || {}).TYPE))) {
		this.X_REMINDERS._value('');
		this.X_REMINDERS._disabled(true);
		this.X_REMINDERS._main.parentNode.parentNode.setAttribute('hidden', '');
	}

	this.EVNTITLE._onkeyup();
	this._closeBlocks();
};

_me.__onBeforeSave = function () {
	!this.EVNTITLE._value() && this.EVNTITLE._value(getLang('EVENT_VIEW::NEWAPPOINTMENT'));
	this.__forced_note = false;
	this._closeNote();
	this._sItemID = this._sItemID || '';
};

_me.__saveItems = function (aValues) {
	var addon;

	if (this.x_note.__originalValue) {
		aValues.values.EVNDESCFORMAT = this.x_note.__originalValue.EVNDESCFORMAT;
		aValues.values.EVNNOTE = this.x_note.__originalValue.EVNNOTE.replace(/<br>/g, '<br />');
	}
	if(aValues.values.EVNNOTE) {
		aValues.values.EVNNOTE = aValues.values.EVNNOTE.replace(/>\n</g, '><');
	}

	//Save As
	if (!Is.Defined(this._id[2]))
		this._id = Path.split(this.X_PATH._value());

	// Show As
	if (this._aValues.EVNFLAGS)
		aValues.values.EVNFLAGS = this._aValues.EVNFLAGS & ~(4 | 8 | 16);
	else
		aValues.values.EVNFLAGS = 0;

	var tmp = {
		F: 4,
		T: 8,
		O: 16,
		S: 0
	};
	aValues.values.EVNFLAGS |= (aValues.values.EVNFLAGS || 0) | tmp[this.X_EVNFLAGS._value()];

	aValues.values = arrConcat(aValues.values, this.X_TIMEINTERVAL._value());

	if (!Is.Empty(addon = this._reminderKeyToObject(this.X_REMINDERS._value()))) {
		if(this.__reminderID) {
			addon.uid = this.__reminderID;
		}
		aValues['REMINDERS'] = [addon];
	} else if(this.__reminderID) {
		aValues['REMINDERS'] = [{uid: this.__reminderID}];
	}

	if (aValues.values['MEETING_ACTION'] == 1) {
		if (this._aValues.EVNMEETINGID && (this._aValues.EVNMEETINGID !== true)) {
			aValues.values['MEETING_ACTION'] = 'edit';
		} else {
			aValues.values['MEETING_ACTION'] = 'create';
		}
	}

	delete aValues.values['btn_meet']; // There is no need to send this to server

	if (this.X_REPEATING && !Is.Empty(addon = this._repeatingKeyToObject(this.X_REPEATING.__rcrvalue))) {
		if (addon.values && addon.values.RCRENDDATE && addon.values.RCRENDDATE < aValues.values.EVNSTARTDATE)
			addon.values.RCRENDDATE = aValues.values.EVNSTARTDATE;

		aValues['RECURRENCES'] = [addon];

		if (this._aValues.RECURRENCES && Is.Object(this._aValues.RECURRENCES[this._aValues.EVNRCR_ID]) && compareObj(this._aValues.RECURRENCES[this._aValues.EVNRCR_ID], addon, true)){
		 	delete aValues.RECURRENCES;
		}
	}
	else
		delete aValues.RECURRENCES;

	if(this.x_include_in_my_cal && this.x_include_in_my_cal._checked()) {
		this.x_list._addUser({
			email: this.__real_email,
			name: '',
			role: 'Q'
		});
	}

	if (!Is.Empty(addon = this.x_list._getAttendees())) {
		aValues['CONTACTS'] = addon;
		if (!(aValues.values.EVNFLAGS & 2))
			aValues.values.EVNFLAGS = aValues.values.EVNFLAGS | 1;
		else
			aValues.values.EVNFLAGS = aValues.values.EVNFLAGS & ~1;
	}

	//Resources Folder
	if (!this._sItemID && this._sAccountID === this.__real_email) {
		var sFolderID = this._sFolderID;
		if (sFolderID === '__@@VIRTUAL@@__/__@@EVENTS@@__') {
			var aCalendars = dataSet.get('folders', [this.__real_email, '__@@VIRTUAL@@__/__@@EVENTS@@__', 'VIRTUAL', 'FOLDERS']);
			for (var i in aCalendars)
				if (aCalendars[i]) {
					sFolderID = i;
					break;
				}
		}

		if (sFolderID.indexOf(dataSet.get('main', ['resources_path']) + '/') == 0) {
			var bFound = false;

			if (aValues['CONTACTS']) {
				for (var i in aValues['CONTACTS'])
					if (aValues['CONTACTS'][i].values.CNTEMAIL == this.__real_email) {
						bFound = true;
						break;
					}
			} else
				aValues['CONTACTS'] = [];

			if (!bFound) {
				aValues['CONTACTS'].push({
					values: {
						CNTEMAIL: this.__real_email,
						CNTROLE: 'Q'
					}
				});

				aValues.values.EVNFLAGS |= 1;
			}
		}

	}

	// Automatically Add Location into Schedule
	if (aValues.values.EVNLOCATION && aValues.values.EVNLOCATION.indexOf('@') > -1) {

		var aMail = MailAddress.splitEmailsAndNames(aValues.values.EVNLOCATION);
		if (aMail && aMail[0] && aMail[0].email) {

			var aOld = {},
				found = false;
			if (this._aValues && this._aValues.CONTACTS)
				aOld = this._aValues.CONTACTS;

			if (aValues && aValues.CONTACTS)
				for (var i in aValues.CONTACTS)
					if (aValues.CONTACTS[i].values && aValues.CONTACTS[i].values.CNTEMAIL == aMail[0].email) {
						found = true;
						break;
					}
			else
			if (aValues.CONTACTS[i].uid)
				delete aOld[aValues.CONTACTS[i].uid];

			if (!found && !Is.Empty(aOld))
				for (var i in aOld)
					if (aOld[i].values && aOld[i].values.CNTEMAIL == aMail[0].email) {
						found = true;
						break;
					}

			//Add location into schedule
			if (!found) {
				if (!aValues.CONTACTS) aValues.CONTACTS = [];
				aValues.CONTACTS.push({
					values: {
						CNTEMAIL: aMail[0].email,
						CNTCONTACTNAME: aMail[0].name,
						CNTROLE: 'S'
					}
				});
				//Send invitation to all attendees
				aValues.values.EVNFLAGS |= 1;
			}
		}
	}

	// If location resource has changed, remove original location resource
	if (this._aValues.CONTACTS && this.__originalLocation && aValues.values.EVNLOCATION != this.__originalLocation) {
		var email = MailAddress.splitEmailsAndNames(this.__originalLocation)[0].email;
		if (!aValues.CONTACTS) aValues.CONTACTS = [];
		for (var i in this._aValues.CONTACTS) {
			if (this._aValues.CONTACTS[i].values && this._aValues.CONTACTS[i].values.CNTEMAIL == email) {
				aValues.CONTACTS.push({
					uid: i
				});
				break;
			}
		}
	}

	// Force notify users if any participant removed
	if (!Is.Empty(addon = this.x_list._getAttendees())) {
		for (var i in addon)
			if (addon[i].action == 'remove') {
				this._notify_attendees = true;
				break;
			}
	}

	if (this.X_ATTACHMENTS && !Is.Empty(addon = this.X_ATTACHMENTS._value()))
		aValues['ATTACHMENTS'] = addon;

	if (aValues.values['TZID'] == 'F') {
		aValues.values['EVNTIMEFORMAT'] = 'F';
		delete aValues.values['TZID'];
	} else
	if (aValues.values['EVNTIMEFORMAT'] == 'Z') {
		aValues.values['_TZEVNSTARTDATE'] = aValues.values['EVNSTARTDATE'];
		aValues.values['_TZEVNENDDATE'] = aValues.values['EVNENDDATE'];
		aValues.values['_TZEVNSTARTTIME'] = aValues.values['EVNSTARTTIME'];
		aValues.values['_TZEVNENDTIME'] = aValues.values['EVNENDTIME'];
		aValues.values['_TZID'] = aValues.values['TZID'];

		delete aValues.values['EVNSTARTDATE'];
		delete aValues.values['EVNENDDATE'];
		delete aValues.values['EVNSTARTTIME'];
		delete aValues.values['EVNENDTIME'];
		delete aValues.values['TZID'];
	}

	//Event RCR
	if (this._aValues['EXPDATE'])
		aValues.values['EXPDATE'] = this._aValues['EXPDATE'];

	if (this._aValues['EXPFOLLOWING'])
		aValues.values['EXPFOLLOWING'] = this._aValues['EXPFOLLOWING'];

};
