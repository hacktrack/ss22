/// <reference path="include/frw_wm.d.ts"/>
var wm_policies = (function (_super) {
    __extends(wm_policies, _super);
    function wm_policies() {
        _super.call(this);
        this.xmlns = 'rpc';
        this.__publish('policies');
    }
    return wm_policies;
}(wm_generic));
new wm_policies();
