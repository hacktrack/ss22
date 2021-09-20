/// <reference path="include/frw_obj.d.ts"/>
var obj_rules = (function (_super) {
    __extends(obj_rules, _super);
    function obj_rules() {
        _super.call(this);
        var me = this;
        this.__who = (location.parsed_query.account ? location.parsed_query.account : location.parsed_query.domain);
        storage.library('wm_rules');
        storage.library('wm_domain');
        storage.library('wm_user');
        gui.frm_main.main._setHeadingButton('rules::new_rule', function () { me._new(); }, 'button text primary');
        if (!gui.frm_main.main.actions) {
            gui.frm_main.main._cleanHeadingButtonsAnchor();
            gui.frm_main.main._setAlternativeButtons(function (box, target_anchor) {
                if (!box._alternativeButtons) {
                    box._alternativeButtons = [];
                }
                var actionobject = box._create('actions', 'obj_actionselect', target_anchor);
                actionobject._value('generic::select_action');
                if (target_anchor == 'heading_buttons_mobile') {
                    actionobject._addcss('full', true);
                }
                actionobject._fill([
                    {
                        name: 'delete',
                        icon: false,
                        onclick: function () {
                            me._deleteSelectedRules();
                            return false;
                        },
                        value: 'rules::delete'
					},
					{
                        name: 'activate',
                        icon: false,
                        onclick: function () {
                            me._activateSelectedRules(true);
                            return false;
                        },
                        value: 'rules::activate'
					},
					{
                        name: 'deactivate',
                        icon: false,
                        onclick: function () {
                            me._activateSelectedRules(false);
                            return false;
                        },
                        value: 'rules::deactivate'
					}
                ]);
                actionobject._disabled(true);
                box._alternativeButtons.push(actionobject);
            });
        }
    }
    /**
     * Onclick handler
     * @param e
     */
    obj_rules.prototype.__onclick = function (e) {
        log.log(['clicked', e]);
    };
    /**
     * Load rules object and activate it
     * @param e
     * @param aData
     */
    obj_rules.prototype._load = function (e, aData) {
        try {
            var me = this;
            var where = (location.parsed_query.account ? 'user' : 'domain');
            log.log('Rules should be loaded');
            me._draw('obj_rules', '', {});
            me.list._init('obj_rules', false, function (linesPerPage, page) {
                com[where].rulesInfoList(me.__who, linesPerPage, page, function (result) {
                    log.log(['result', result]);
                    var items = result.items;
                    me.list._setMax(result.overallcount);
                    try {
                        for (var i = 0; i < items.length; i++) {
							// Parse and draw line
							items[i]['action_type'] = ['accept', 'delete', 'reject', 'spam', 'quarantine'][items[i].action];
                            if (!items[i].title || helper.trim(items[i].title) == '') {
                                items[i].title = getLang('rules::rule_number') + " " + items[i].id;
                            }
							var line = me.list._drawItem(items[i]);
							if(!items[i].active) {
								line.classList.add('inactive');
							}
                            log.log(['rules-load', line._objects]);
                            // functionality
                            var up = line._objects[1];
                            up._item = line._item;
                            var down = line._objects[2];
                            down._item = line._item;
                            var title = me.list._getAnchor('rule_' + line._item.id);
                            title._item = line._item;
                            // Click for open
                            title.onclick = function () {
                                me._openRulesDialog(this._item.id);
                                return false;
                            };
                            // move UP
                            up._onclick = function (line) {
                                return function () {
                                    var l = me.list._getItems();
                                    var ll = helper.associativeArrayLength(l);
                                    var i = 0;
                                    for (var key in l) {
                                        i++;
                                        if (l[key]._item == line._item && i == 1) {
                                            return false;
                                        }
                                    }
                                    com.rules.moveRule(me.__who, this._item.id, 'up', function (response) {
                                        me.list._load();
                                    });
                                };
                            }(line);
                            // move DOWN
                            down._onclick = function (line) {
                                return function () {
                                    var l = me.list._getItems();
                                    var ll = helper.associativeArrayLength(l);
                                    var i = 0;
                                    for (var key in l) {
                                        i++;
                                        if (l[key]._item == line._item && i == ll) {
                                            return false;
                                        }
                                    }
                                    com.rules.moveRule(me.__who, this._item.id, 'down', function (response) {
                                        me.list._load();
                                    });
                                };
                            }(line);
                        }
                    }
                    catch (e) {
                        log.error(['rules-load-list-init', e]);
                    }
                });
            });
            me.list._onchange = function (e) {
                if (me.list._getSelectedCount() == 0) {
                    for (var i = 0; i < gui.frm_main.main._alternativeButtons.length; i++) {
                        gui.frm_main.main._alternativeButtons[i]._text(getLang("generic::select_action"));
                        gui.frm_main.main._alternativeButtons[i]._disabled(true);
                    }
                }
                else {
                    for (var i = 0; i < gui.frm_main.main._alternativeButtons.length; i++) {
                        gui.frm_main.main._alternativeButtons[i]._text(getLang("generic::select_action") + " (" + me.list._getSelectedCount() + ")");
                        gui.frm_main.main._alternativeButtons[i]._disabled(false);
                    }
                }
                if (e && e.text == 'select-all') {
                    return false;
                }
            };
        }
        catch (e) {
            log.error(e);
        }
    };
    /**
     * New rule - Opens new rule dialog = empty edit rule dialog
     */
    obj_rules.prototype._new = function () {
        this._openRulesDialog();
    };
    /**
     * Opens edit/new rule dialog
     * @param rule
     */
    obj_rules.prototype._openRulesDialog = function (rule) {
        var me = this;
        var popup = gui._create('popup', 'obj_popup');
        popup._init({
            fixed: false,
            name: 'rulesdialog',
            iwattr: {
                height: 'auto',
                width: 'large'
            },
            heading: {
                value: getLang('rules::rules')
            },
            footer: 'default',
            content: 'obj_rulesdialog'
        });
        popup.content._load(me.__who, rule);
        popup.content._setCallback(function () {
            me.list._load();
            popup._close();
        });
    };
    /**
     * Delete selected ruled action
     */
    obj_rules.prototype._deleteSelectedRules = function () {
        var me = this;
        var list = this.list._selectedList;
        log.log(['rules-deleteselectedrules', list]);
        var f = function (id) {
            com.rules.deleteRule(id, me.__who, function (data) {
                try {
                    if (data.Array.IQ[0].QUERY[0].RESULT[0].VALUE == 0) {
                        gui.message.error(getLang("error::rule_delete_unsuccessful"));
                        me.list._load();
                    }
                    else {
                        list.pop();
                        if (list.length > 0) {
                            f(list[list.length - 1].id);
                        }
                        else {
                            gui.message.toast(getLang("message::rule_delete_successfull"));
                            me.list._load();
                        }
                    }
                }
                catch (e) {
                    log.error(e);
                }
            });
        };
        if (list.length > 0) {
            f(list[list.length - 1].id);
        }
    };
    /**
     * (De)activate selected rules
     */
    obj_rules.prototype._activateSelectedRules = function (activate) {
        var me = this;
        var list = this.list._selectedList;
        log.log(['rules-' + (activate ? '' : 'de') + 'activateselectedrules', list]);
        var f = function (id) {
            com.rules.activateRule(id, activate, me.__who, function (data) {
                try {
                    if(data.Array.IQ[0].QUERY[0].ERROR) {
						gui.message.error(getLang("error::" + data.Array.IQ[0].QUERY[0].ERROR[0].ATTRIBUTES.UID));
					}
                    if (data.Array.IQ[0].QUERY[0].RESULT[0].VALUE == 0) {
                        gui.message.error(getLang("error::rule_" + (activate ? '' : 'de') + "activate_unsuccessful"));
                        me.list._load();
                    }
                    else {
                        list.pop();
                        if (list.length > 0) {
                            f(list[list.length - 1].id);
                        }
                        else {
                            gui.message.toast(getLang("message::rule_" + (activate ? '' : 'de') + "activate_successful"));
                            me.list._load();
                        }
                    }
                }
                catch (e) {
                    log.error(e);
                }
            });
        };
        if (list.length > 0) {
            f(list[list.length - 1].id);
        }
    };
    return obj_rules;
}(obj_generic));
