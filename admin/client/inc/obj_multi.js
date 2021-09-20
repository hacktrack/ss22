/// <reference path="include/frw_obj.d.ts"/>
var obj_multi = (function (_super) {
    __extends(obj_multi, _super);
    function obj_multi() {
        _super.call(this);

        this._counter = 0;
        this._lines = [];
        this.__disabled = false;

        var me = this;
        me._itemType = me.__attributes.itemtype || "obj_multi_input";
        me.button_add._onclick = function () {
            me._add();
        };
        this.addFirst();
    }
    obj_multi.prototype._getObjects = function (line) {
        var me = this;
        var children = [];
        var objects = line.getElementsByTagName("form");
        for (var i = 0; i < objects.length; i++) {
            if (objects[i].id && objects[i].id.indexOf('gui.') == 0) {
                children.push(me[objects[i].id.split('.').pop()]);
            }
        }
        return children;
    };
    obj_multi.prototype._add = function (value) {
        if (value === void 0) { value = ""; }
        var me = this;
        var line = this._draw(me._itemType, "items", { number: me._counter++ }, true);
        var objects = me._getObjects(line);
        if (objects[0] && objects[0]._value) {
            objects[0]._value(value);
        }
        me._lines.push({
            line: line,
            objects: objects
        });
    };
    obj_multi.prototype._removeItem = function (index, forgetFirst) {
        if (forgetFirst === void 0) { forgetFirst = false; }
        var me = this;
        if (me._lines[index]) {
            for (var _i = 0, _a = me._lines[index].objects; _i < _a.length; _i++) {
                var object = _a[_i];
                if (object._destruct) {
                    object._destruct();
                }
            }
            me._lines[index].line.parentNode.removeChild(me._lines[index].line);
            me._lines.splice(index, 1);
        }
        if (!forgetFirst) {
            me.addFirst();
        }
        return !!me._lines[index];
    };
    obj_multi.prototype.addFirst = function () {
        if (this._lines.length == 0) {
            this._add();
        }
    };
    obj_multi.prototype._removeAll = function (forgetFirst) {
        if (forgetFirst === void 0) { forgetFirst = false; }
        var me = this;
        for (var i = me._lines.length - 1; i >= 0; i--) {
            me._removeItem(i, forgetFirst);
        }
    };
    obj_multi.prototype._isEmpty = function (objectList) {
        if (objectList[0] && objectList[0]._value().trim() == "") {
            return true;
        }
        return false;
    };
    obj_multi.prototype._removeEmpty = function (userCallableIsEmptyFunction) {
        if (userCallableIsEmptyFunction === void 0) { userCallableIsEmptyFunction = this._isEmpty; }
        var me = this;
        for (var i = me._lines.length - 1; i >= 0; i--) {
            if (userCallableIsEmptyFunction(me._lines[i].objects)) {
                me._removeItem(i);
            }
        }
    };
    obj_multi.prototype.getLines = function () {
        return this._lines;
    };
    /**
     * Get / Set value
     * @param template
     */
    obj_multi.prototype._value = function (data) {
        var me = this;
        if (data instanceof Array) {
            me._removeAll(true);
            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                var value = data_1[_i];
                me._add(value);
            }
        }
        var values = [];
        for (var _a = 0, _b = me._lines; _a < _b.length; _a++) {
            var line = _b[_a];
            values.push(line.objects[0]._value());
        }
        return values;
    };
    /**
     * Disable all inputs
     * @param attribute
     */
    obj_multi.prototype._disabled = function (attribute) {
        if(attribute==undefined) {
            return this.__disabled;
        } else {
            for(var i=this._lines.length;i--;) {
                var obj = this._lines[i].objects;
                for(var j=obj.length;j--;){
                    obj[j]._disabled(attribute);
                }
            }
            this.button_add._disabled(attribute);
            this.__disabled = attribute;
       }
    };
    /**
     * Check for changes in any objects
     */
    obj_multi.prototype._changed = function () {
        var changed = false;
        for(var i=this._lines.length;i--;) {
            var obj = this._lines[i].objects;
            for(var j=obj.length;j--;){
                if(obj[j]._changed()==true) {
                    changed = true;
                }
            }
        }
        return changed;
    };
    return obj_multi;
}(obj_generic));
