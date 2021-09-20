function obj_plans() {};

obj_plans.prototype.__constructor = function (aData) {
	var me = this;
	aData.prefix = this.__prefix = this._pathName + '.radio';
	this.__selectable = !!aData.selectable;

	this._draw('obj_plans', '', aData);

	this.__radios = Object.keys(this).map(function (key) {
		if (!key.indexOf('radio')) {
			return this[key];
		}
	}, this).filter(Boolean);

	this.__radios.forEach(function (radio, i) {
		radio._value(aData.plans[i].id);
		radio._disabled(aData.plans[i].disabled);

		radio._onchange = function () {
			me._onchange && me._onchange(this._value());
		};
	}, this);
};

obj_plans.prototype._value = function (value) {
	if (!this.__selectable) {
		return;
	}

	if (value === void 0) {
		return this.__value;
	}

	this.__radios.some(function (radio) {
		if (radio._value() == value) {
			this.__value.value = radio._value();
			return radio._checked(true);
		}
	}, this);
};

obj_plans.prototype._setValue = function (value) {
	this.__value = value;
	this._value(value);
};
