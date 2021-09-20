/// <reference path="include/frw_obj.d.ts"/>
var obj_preview = (function (_super) {
    __extends(obj_preview, _super);
    function obj_preview() {
        _super.call(this);
        var me = this;
        me._main.setAttribute('iw-enabled', "");
    }
    /**
     * Draw template in the preview
     * @param template
     */
    obj_preview.prototype._value = function (template) {
        this._draw(template);
    };
    /**
     * Disable preview
     * @param attribute
     */
    obj_preview.prototype._disable = function (attribute) {
        this._enable(attribute, false);
    };
    /**
     * Enable or disable preview
     * @param attribute
     * @param enabled
     */
    obj_preview.prototype._enable = function (attribute, enabled) {
        if (enabled === void 0) { enabled = true; }
        var val = this._main.getAttribute('iw-enabled') || "";
        val = val.replace(" " + attribute, '').replace(attribute + " ", '').replace(attribute, '');
        if (enabled) {
            val = helper.trim(val + " " + attribute);
        }
        this._main.setAttribute('iw-enabled', val);
    };
    /**
     * Set IW attribute to main element
     * @param attribute
     * @param val
     */
    obj_preview.prototype._setAttribute = function (attribute, val) {
        this._main.setAttribute('iw-' + attribute, val);
    };
    /**
     * Remove IW attribute from main element
     * @param attribute
     */
    obj_preview.prototype._removeAttribute = function (attribute) {
        this._main.setAttribute('iw-' + attribute);
    };
    return obj_preview;
}(obj_generic));
