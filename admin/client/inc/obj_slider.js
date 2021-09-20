/// <reference path="include/frw_obj.d.ts"/>
var obj_slider = (function (_super) {
    __extends(obj_slider, _super);
    function obj_slider() {
        _super.call(this);
        this._settings = {};
        var me = this;
        addcss(me._main, 'slider');
        me._settings = {
            track: me._getAnchor('track'),
            scrollbox: document.getElementById('gui.frm_main.main#main_content'),
            contentbox: me._getAnchor('content'),
            correction: 21
        };
        me.__status = false;
        me._updateMeasurements();
        me._assignObserver();
    }
    /**
     * Get child's distance from the top of the parent
     * @param parent
     * @param child
     */
    obj_slider.prototype._getTopDistance = function (parent, child) {
        try {
            var childOffset = child.getBoundingClientRect();
            var parentOffset = parent.getBoundingClientRect();
            var distance = childOffset.top - parentOffset.top + parent.scrollTop;
            return distance;
        }
        catch (e) {
            log.error(['slider-_getTopDistance', e]);
        }
    };
    /**
     * Get child's distance from the bottom of the parent
     * @param parent
     * @param child
     */
    obj_slider.prototype._getBottomDistance = function (parent, child) {
        try {
            var top = this._getTopDistance(parent, child);
            var childOffset = child.getBoundingClientRect();
            var distance = top + childOffset.height;
            return distance;
        }
        catch (e) {
            log.error(['slider-_getBottomDistance', e]);
        }
    };
    /**
     * Get child's distance from top of document
     * @param parent
     * @param child
     */
    obj_slider.prototype._getTopFull = function (parent, child) {
        try {
            var parentOffset = parent.getBoundingClientRect();
            var distance = parentOffset.top + this._settings.correction;
            return distance;
        }
        catch (e) {
            log.error(['slider-_getTopFull', e]);
        }
    };
    /**
     * Update measurements
     */
    obj_slider.prototype._updateMeasurements = function () {
        try {
            if (!this.__status || this.__status == 'top' || this.__status == 'fixed') {
                this.__topDistance = this._getTopDistance(this._settings.scrollbox, this._settings.track);
                this.__bottomDistance = this._getBottomDistance(this._settings.scrollbox, this._settings.track);
                this.__topFull = this._getTopFull(this._settings.scrollbox, this._settings.contentbox);
            }
            this.__scrollerHeight = this._settings.scrollbox.offsetHeight;
            this.__contentHeight = this._settings.contentbox.offsetHeight;
        }
        catch (e) {
            log.error(['slider-_updateMeasurements', e]);
        }
    };
    /**
     * Get top distance
     */
    obj_slider.prototype._getFromTop = function () {
        try {
            return this.__topDistance - this._settings.scrollbox.scrollTop - this._settings.correction;
        }
        catch (e) {
            log.error(['slider-_getFromTop', e]);
        }
    };
    /**
     * Get bottom distance
     */
    obj_slider.prototype._getFromBottom = function () {
        try {
            return this.__bottomDistance - this._settings.scrollbox.scrollTop - this._settings.correction - this._settings.contentbox.offsetHeight;
        }
        catch (e) {
            log.error(['slider-_getFromBottom', e]);
        }
    };
    /**
     * Assign view change observer
     */
    obj_slider.prototype._assignObserver = function () {
        try {
            var me = this;
            if (!me._settings.scrollbox) {
                log.error(['slider-assignobserver', 'scrollbox element not found']);
                return false;
            }
            AttachEvent(me._settings.scrollbox, 'onscroll', function () { me._refresh(); });
            AttachEvent(window, 'onresize', function () { me._refresh(); });
            me._refresh();
        }
        catch (e) {
            log.error(['slider-_assignObserver', e]);
        }
    };
    /**
     * Draw slider content template
     * @param template
     */
    obj_slider.prototype._value = function (template) {
        this._draw(template, 'content');
        this._refresh();
    };
    /**
     * Refresh slider view
     */
    obj_slider.prototype._refresh = function () {
        try {
            var me = this;
            if (!me) {
                return;
            }
            me._updateMeasurements();
            var top = me._getFromTop();
            var bottom = me._getFromBottom();
            var tooSmallView = false;
            if (me.__scrollerHeight < me.__contentHeight + me._settings.correction) {
                tooSmallView = true;
            }
            if (top < 0 && bottom > 0 && me.__status != 'fixed' && !tooSmallView) {
                me._settings.contentbox.style.top = me.__topFull + 'px';
                me.__status = 'fixed';
                addcss(me._main, 'is-fixed');
                removecss(me._main, 'is-pinned');
            }
            else if ((top >= 0 && me.__status != 'top') || tooSmallView) {
                me._settings.contentbox.style.top = "auto";
                me.__status = 'top';
                removecss(me._main, 'is-fixed');
                removecss(me._main, 'is-pinned');
            }
            else if (bottom < 0 && me.__status != 'bottom' && !tooSmallView) {
                me._settings.contentbox.style.top = "auto";
                me.__status = 'bottom';
                removecss(me._main, 'is-fixed');
                addcss(me._main, 'is-pinned');
            }
            // resize contentbox according to track width
            me._settings.contentbox.style.width = me._settings.track.offsetWidth + "px";
        }
        catch (e) {
            log.error(['slider-refresh', e]);
        }
    };
    return obj_slider;
}(obj_generic));
