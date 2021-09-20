/// <reference path="include/frw_obj.d.ts"/>
var obj_certificates = (function (_super) {
    __extends(obj_certificates, _super);
    function obj_certificates() {
        _super.call(this);
        var me = this;
        var parent = this._parent;
        me._defaultTab = 'server';
        /* set onbefore destruct listener */
        this._add_destructor('__onbeforedestruct');
    }
    /**
     * Onbefore destruct listener
     */
    obj_certificates.prototype.__onbeforedestruct = function () {
    };
    /**
     *
     * @param settings
     * @param callback
     */
    obj_certificates.prototype._getMenuDefinition = function (callback) {
        var me = this;
        var menu = [];
        var defaultTab = '';
        defaultTab = 'server';
        menu = [
            {
                isdefault: true,
                name: 'server',
                icon: 'none',
                value: 'certificates::server_certificates',
                callback: function (name) {
                    me._tabmenuCallback(name);
                }
            },
            {
                name: 'ca',
                icon: 'none',
                value: 'certificates::ca_certificates',
                callback: function (name) {
                    me._tabmenuCallback(name);
                }
            },
            {
                name: 'secure_destinations',
                icon: 'none',
                value: 'certificates::secure_destinations',
                callback: function (name) {
                    me._tabmenuCallback(name);
                }
            }
        ];
        callback(menu, defaultTab);
    };
    /**
     * Tabmenu select handler
     * @param name
     */
    obj_certificates.prototype._tabmenuCallback = function (name) {
        var me = this;
        var parent = this._parent;
        if (!name) {
            name = '';
        }
        log.info(['certificates-tabmenucallback-name', name]);
        // remove heading button
        gui.frm_main.main._setHeadingButton();
        // defaults
        if (name == '') {
            name = me._defaultTab;
        }
        //
        // clean content to be able to show the same tab for different account
        parent._clean('main_content');
        log.info('Menu with ID "' + name + '" selected');
        switch (name) {
            case '':
            case "server":
                if (!parent.certificates_server) {
                    parent._create('certificates_server', 'obj_certificates_server', 'main_content');
                }
                parent.certificates_server._load();
                break;
            case "ca":
                if (!parent.certificates_ca) {
                    parent._create('certificates_ca', 'obj_certificates_ca', 'main_content');
                }
                parent.certificates_ca._load();
                break;
            case "secure_destinations":
                if (!parent.certificates_secure_destinations) {
                    parent._create('certificates_secure_destinations', 'obj_certificates_secure_destinations', 'main_content');
                }
                parent.certificates_secure_destinations._load();
                break;
        }
    };
    /**
     * Hash change handler called by parent
     */
    obj_certificates.prototype._hash_handler = function () {
        var me = this;
        try {
            me._getMenuDefinition(function (menuDefinition, defaultTab) {
                me._defaultTab = defaultTab;
                gui.frm_main.main._init({
                    name: 'certificates',
                    heading: {
                        value: getLang('main::certificates')
                    },
                    menu: {
                        hashTemplate: "menu=/MENU/",
                        items: menuDefinition
                    }
                });
            });
        }
        catch (e) {
            log.error([e, me]);
        }
    };
    return obj_certificates;
}(obj_generic));
