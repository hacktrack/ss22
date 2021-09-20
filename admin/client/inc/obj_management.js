/// <reference path="include/frw_obj.d.ts"/>
var obj_management = (function (_super) {
    __extends(obj_management, _super);
    function obj_management() {
        _super.call(this);
        this._settings = {};
        var me = this;
        this._settings.menuHashTemplate = '#menu=/MENU/';
        this._settings.menu = [{
                isdefault: true,
                icon: false,
                name: 'domainlist',
                value: 'management::domainlist',
                callback: function (name) {
                    me._tabmenuCallback(name);
                }
            }];
        if (gui._globalInfo.admintype == USER_ADMIN) {
            this._settings.menu.push({
                icon: false,
                name: 'guestaccounts',
                value: 'management::guest_accounts',
                callback: function (name) {
                    me._tabmenuCallback(name);
                }
            });
        }
    }
    obj_management.prototype._hash_handler = function (e, aData) {
        var me = this;
        log.log('Management should be loaded');
        try {
            gui.frm_main.main._init({
                name: 'management',
                heading: {
                    value: getLang("main::management")
                },
                menu: {
                    hashTemplate: this._settings.menuHashTemplate,
                    items: this._settings.menu
                }
            }, function (oBox, oMenu) {
            });
        }
        catch (e) {
            log.error(["management-hashhandler", e, me]);
        }
    };
    obj_management.prototype._getDefaultTab = function () {
        for (var _i = 0, _a = this._settings.menu; _i < _a.length; _i++) {
            var item = _a[_i];
            if (item.isdefault) {
                return item.name;
            }
        }
        return (this._settings.menu[0] ? this._settings.menu[0].name : "");
    };
    obj_management.prototype._loadContent = function (name, obj, anchor, settings) {
        var parent = this._parent;
        if (!parent[name]) {
            parent._clean(anchor);
            parent._create(name, obj, anchor);
        }
        parent[name]._load(settings);
    };
    obj_management.prototype._tabmenuCallback = function (name) {
        if (name === void 0) { name = this._getDefaultTab(); }
        var me = this;
        switch (name) {
            case "domainlist":
                this._loadContent('domainlist', 'obj_domainlist', 'main_content');
                break;
            case "guestaccounts":
                this._loadContent('accountlist', 'obj_userlist', 'main_content', { domain: "##internalservicedomain.icewarp.com##", subTemplate: 'guest' });
                break;
        }
    };
    return obj_management;
}(obj_generic));
