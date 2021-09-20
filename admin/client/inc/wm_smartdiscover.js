/// <reference path="include/frw_wm.d.ts"/>
var wm_smartdiscover = (function (_super) {
    __extends(wm_smartdiscover, _super);
    function wm_smartdiscover() {
        _super.call(this);
        this.xmlns = 'rpc';
        this.__publish('smartdiscover');
    }
    return wm_smartdiscover;
}(wm_generic));
new wm_smartdiscover();
