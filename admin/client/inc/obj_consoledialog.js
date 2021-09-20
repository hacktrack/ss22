_me = obj_consoledialog.prototype;

function obj_consoledialog() {};

/**
 * @brief:
 * @date : 01.12.2014
 **/
_me.__constructor = function (s) {
	var me = this;

	me._parent._initSearch(function () {
		me.list._load();
	}, true, function () {
		if (me._parent._getSearch()) {
			me._parent._setSearchString('', true);
			me.list._load();
		} else {
			gui.hashhandler._changed(false);
			me._parent._parent._close();
		}
	});
};

_me.__onclick = function (e) {
	log.log('clicked', e);
};

_me._activateVariableSelect = function (id, data, line) {
	var me = this;
	var variable = me.list._getAnchor('variable_' + id);
	var container = me.list._getAnchor('variable_container_' + id);
	var input_container = me.list._getAnchor('variable_input_container_' + id);
	me._container = container;

	if (!me['hidden_selection']) {
		var inp = me._create('hidden_selection', 'obj_input_text');
		me.list._addObject(line, inp);
		inp._addcss('visually-hidden');
		inp._onblur = function () {
			log.log(["consoledialog-activatevariableselect", me._selected]);
			removecss(me._selected, 'is-selected');
		}
	}

	variable.onclick = function () {
		if (me._toucher) {
			me._toucher = false;
			return false;
		}
		me.hidden_selection._value(id);
		me.hidden_selection._focus();
		setTimeout(function () {
			me.hidden_selection._selectValue();
		}, 50);
		me._selected = container;
		addcss(container, 'is-selected');
	}

	variable.ontouchstart = function () {
		me._toucher = true;
	}
	variable.onmspointerdown = function (e) {
		if (e.pointerType && (e.pointerType == 'touch' || e.pointerType == 'pen' || e.pointerType == e.MSPOINTER_TYPE_TOUCH || e.pointerType == e.MSPOINTER_TYPE_PEN)) {
			me._toucher = true;
		}
	}
	variable.onmspointerup = function (e) {
		if (e.pointerType && (e.pointerType == 'touch' || e.pointerType == 'pen' || e.pointerType == e.MSPOINTER_TYPE_TOUCH || e.pointerType == e.MSPOINTER_TYPE_PEN)) {
			variable.ontouchend();
		}
	}
	variable.ontouchend = function () {
		container.setAttribute('is-hidden', 1);
		input_container.removeAttribute('is-hidden', 1);
		if (!me.list['input_' + id]) {
			var inp = me.list._create('input_' + id, 'obj_input_text', 'variable_input_container_' + id);
			me.list._addObject(line, inp);
			inp._value(id);
			inp._onblur = function () {
				input_container.setAttribute('is-hidden', 1);
				container.removeAttribute('is-hidden', 1);
			}
		} else {
			var inp = me.list['input_' + id];
		}
		inp._focus();
	}
}

_me._edit = function (id, data, refresh, line) {
	var me = this;
	var obj = 'obj_' + id;

	if (line._editActivated) {
		return false;
	}
	line._editActivated = true;

	var value = me.list._getAnchor('value_' + id);
	var save = me.list._getAnchor('save_' + id);

	if (!this.list[obj]) {
		createsavebutton = true;
		showsavebutton = false;
		savebuttonlabel = false;
		enablesavebutton = false;

		switch (data.type_code) {
			case "string":
				var inp = this.list._create(obj, 'obj_input_text', 'edit_' + id);
				inp._placeholder('generic::enter_value');
				inp._addcss('is-editable');
				inp._onblur = function () {
					if (!inp._changed()) {
						removecss(save, 'is-visible');
					}
				};
				inp._onfocus = function () {
					if (!save._readonly) {
						addcss(save, 'is-visible');
					}
					me.list[obj + '_save']._disabled(false);
				};
				break;
			case "longstring":
				if (!save._readonly) {
					addcss(save, 'is-visible');
				}
				showsavebutton = true;
				savebuttonlabel = +data.right === 1 ? 'api_console::view' : 'api_console::edit';
				enablesavebutton = true;
				break;
			case "integer":
				var inp = this.list._create(obj, 'obj_input_number', 'edit_' + id);
				inp._placeholder('generic::enter_value');
				inp._addcss('is-editable');
				inp._onblur = function () {
					if (!inp._changed()) {
						removecss(save, 'is-visible');
					}
				};
				inp._onfocus = function () {
					if (!save._readonly) {
						addcss(save, 'is-visible');
					}
					me.list[obj + '_save']._disabled(false);
				};
				break;
			case "boolean":
				log.log(['consoledialog-boolean', 0]);
				var inp = this.list._create(obj, 'obj_toggle', 'edit_' + id);
				inp._placeholder('generic::enter_value');
				log.log(['consoledialog-boolean', 1]);
				inp._label(getLang('api_console::false'), getLang('api_console::true'));
				log.log(['consoledialog-boolean', 2]);
				inp._onchange = function () {
					if (!save._readonly) {
						addcss(save, 'is-visible');
					}
					me.list[obj + '_save']._disabled(false);
				};
				inp._onblur = function () {
					log.log(['consoledialog-boolean', 'blurred']);
					if (!inp._changed()) {
						removecss(save, 'is-visible');
					}
				};
				log.log(['consoledialog-boolean', 3]);
				break;
			case "enum":
				log.log(['consoledialog-enum', data]);
				var inp = this.list._create(obj, 'obj_dropdown_single', 'edit_' + id);
				inp._addcss('is-editable');
				inp._onchange = function () {
					if (!save._readonly) {
						addcss(save, 'is-visible');
					}
					me.list[obj + '_save']._disabled(false);
				};
				inp._onblur = function () {
					log.log(['consoledialog-boolean', 'blurred']);
					if (!inp._changed()) {
						removecss(save, 'is-visible');
					}
				};
				inp._disabled(false);
				break;
			default:
				createsavebutton = false;
		}
		if (createsavebutton) {
			if (me.list[obj]) {
				me.list[obj]._disabled(true);
			}
			if (!me[obj + "_save"]) {
				var but = this.list._create(obj + "_save", 'obj_button', 'save_' + id)
				but._value((savebuttonlabel ? savebuttonlabel : 'api_console::save'));
				but._addcss('text primary');
				but._disabled(!enablesavebutton);

			} else {
				var but = me[obj + "_save"];
			}
		}

		if (this.list[obj]) {
			this.list._addObject(line, this.list[obj]);
		}
		if (this.list[obj + '_save']) {
			this.list._addObject(line, this.list[obj + '_save']);
		}
	}

	if (this.list[obj]) {
		var cb = function (info, right) {

			var value = ''
			try {
				if (typeof info == 'object' && info.Array.IQ[0].QUERY[0].RESULT[0].ITEM[0].PROPERTYVAL[0].VAL) {
					value = info.Array.IQ[0].QUERY[0].RESULT[0].ITEM[0].PROPERTYVAL[0].VAL[0].VALUE;
				} else {
					value = info;
				}

				// right
				if (typeof info == 'object' && info.Array.IQ[0].QUERY[0].RESULT[0].ITEM[0].PROPERTYRIGHT[0]) {
					right = parseInt(info.Array.IQ[0].QUERY[0].RESULT[0].ITEM[0].PROPERTYRIGHT[0].VALUE);
				} else if (right) {
					right = parseInt(right);
				} else {
					right = RIGHTS_READONLY;
				}
			} catch (e) {
				log.error(['e:unexpected_response', e]);
			}

			log.log(['consoledialog-type', me.list[obj]._type]);

			switch (me.list[obj]._type) {
				case 'obj_input_number':
				case 'obj_input_text':
					me.list[obj + '_save']._onclick = function () {
						this._disabled(true);
						var that = this;
						me._setItem(data.name, me.list[obj]._value(), function (value) {
							me.list[obj]._changed(true);
							removecss(save, 'is-visible');
							me.list[obj]._value(value);
							var line = me.list._getAnchor('id_' + id);
							line._editActivated = false;
						});
					}

					me.list[obj]._disabled(false);
					//me.list[obj+'_save']._disabled(false);
					me.list[obj]._value(value);
					break;
				case 'obj_toggle':
				case 'obj_input_checkbox':
					me.list[obj]._checked((data.value == '1' || data.value == 'true' || data.value == 1), true);
					me.list[obj]._onclick = function () {
						var that = this;
						if (!save._readonly) {
							addcss(save, 'is-visible');
						}
						var line = me.list._getAnchor('id_' + id);
						line._editActivated = false;
					}

					me.list[obj + '_save']._onclick = function () {
						this._disabled(true);
						var that = this;
						me._setItem(data.name, me.list[obj]._value(), function (value) {
							me.list[obj]._changed(true);
							removecss(save, 'is-visible');
							me.list[obj]._checked((value == '1' || value == 'true' || value == 1), true);
							var line = me.list._getAnchor('id_' + id);
							line._editActivated = false;
						});
					}

					me.list[obj + '_save']._disabled(false);
					me.list[obj]._disabled(false);
					break;
				case 'obj_dropdown_single':
					me.list[obj]._fill(data.enumvalues_fill);
					me.list[obj]._value(value, true);
					me.list[obj + '_save']._onclick = function () {
						this._disabled(true);
						var that = this;
						me._setItem(data.name, me.list[obj]._value(), function (value) {
							me.list[obj]._changed(true);
							removecss(save, 'is-visible');
							me.list[obj]._value(value, true);
							var line = me.list._getAnchor('id_' + id);
							line._editActivated = false;
						});
					}

					me.list[obj]._disabled(false);
					break;
			}

			// use right
			if (right == RIGHTS_READONLY || right == RIGHTS_HIDE) {
				save._readonly = true;
				me.list[obj]._readonly(true);
			}
			//

		};
	} else {
		var cb = function (info) {
			value = '';
			try {
				if (typeof info == 'object' && info.Array.IQ[0].QUERY[0].RESULT[0].ITEM[0].PROPERTYVAL[0].VAL) {
					value = info.Array.IQ[0].QUERY[0].RESULT[0].ITEM[0].PROPERTYVAL[0].VAL[0].VALUE;
				} else {
					value = info;
				}
				me.list[obj + '_save']._onclick = function () {
					var popup = gui._create('popup', 'obj_popup');
					popup._init({
						fixed: false,
						iwattr: {
							height: 'auto',
							width: 'medium'
						},
						name: 'header',
						heading: {
							value: id
						},
						footer: 'default'
					});

					var optional = {
						name: me.__name
					}
					optional[me.__name] = true;
					popup.main._draw('obj_consoledialog_longstring', 'main_content', optional);

					popup.main.textarea._value(value);
					me._getItem(data.name, function (result) {
						var val = result.Array.IQ[0].QUERY[0].RESULT[0].ITEM[0].PROPERTYVAL[0].VAL || [{
							VALUE: ''
						}];
						popup.main.textarea._value(val[0].VALUE);
					});

					if (+data.right === 1) {
						popup.main.btn_save._destruct();
					} else {
						popup.main.btn_save._onclick = function () {
							me._setItem(data.name, popup.main.textarea._value(), function (value) {
								me.list._getAnchor('edit_' + id).innerHTML = helper.htmlspecialchars(value);
								var line = me.list._getAnchor('id_' + id);
								line._editActivated = false;
								popup._close();
							});
						}
					}
				};
			} catch (e) {
				log.error(['e:unexpected_response', e]);
			}

			me.list._getAnchor('edit_' + id).innerHTML = helper.htmlspecialchars(value);
		}
	}

	if (refresh) {
		me._getItem(data.name, cb);
	} else {
		cb(data.value, data.right);
	}
}

_me._getItem = function (id, cb) {
	log.log([id]);

	var type = 'server';
	var who = false;
	if (location.parsed_query.domain) {
		type = 'domain';
		who = location.parsed_query.domain;
	}
	if (location.parsed_query.account) {
		type = 'account';
		who = location.parsed_query.account;
	}

	log.log(['consoledialog-getitem', type, com.console.item(cb)]);
	com.console.item(cb)[type](id, who);
}

_me._setItem = function (id, value, cb) {
	var me = this;

	var type = 'server';
	var who = false;
	if (location.parsed_query.domain) {
		type = 'domain';
		who = location.parsed_query.domain;
	}
	if (location.parsed_query.account) {
		type = 'account';
		who = location.parsed_query.account;
	}
	log.log(['consoledialog-setitem', type, com.console.item(cb)]);

	com.console.set(function (ret) {
		me._getItem(id, function (info) {
			log.log(info);

			var value = ''
			try {
				if (info.Array.IQ[0].QUERY[0].RESULT[0].ITEM[0].PROPERTYVAL[0].VAL) {
					value = info.Array.IQ[0].QUERY[0].RESULT[0].ITEM[0].PROPERTYVAL[0].VAL[0].VALUE;
				}
			} catch (e) {
				log.error(['e:unexpected_response', e]);
			}

			if (cb) {
				cb(value);
			}
		});
	})[type](id, value, who);
}

_me._load = function (who) {
	try {
		var me = this;

		log.log('Console dialog should be loaded');

		me._draw('obj_consoledialog', '', {});

		me._firstLoad = true;
		me.list._init('obj_consoledialog', false, function (linesPerPage, page, callback) {
			var mask = false;
			if (me._parent._getSearch() != '') {
				mask = me._parent._getSearch();
			};

			var type = 'console';
			if (who) {
				if (who.search('@') > 0) {
					type = "user";
				} else if (who) {
					type = 'domain';
				}
			}

			com[type].getAPI(linesPerPage, page, mask, function (result) {
				me._firstLoad = false;
				log.log(['consoledialog-result', result]);
				try {
					me.list._setMax(result.count);
					for (var i = 0; i < result.items.length; i++) {
						if (!me._lastGroup) {
							me._lastGroup = '';
						}
						if (me._lastGroup != result.items[i].group) {
							result.items[i]['grouplabel'] = getLang('api_console::' + result.items[i].group);
						}
						result.items[i]['type_code'] = result.items[i].type;
						result.items[i]['type'] = getLang('api_console::type_' + result.items[i].type);
						me._lastGroup = result.items[i].group;

						var line = me.list._drawItem(result.items[i]);
						/* create inputs */
						me._activateVariableSelect(result.items[i]['name'], result.items[i], line);
						me._edit(result.items[i]['name'], result.items[i], false, line);
					}
				} catch (e) {
					log.error(['consoledialog-load', e]);
				}
			}, true, who);
			if (callback) {
				callback();
			}
		});

	} catch (e) {
		log.error(e);
	}
}
