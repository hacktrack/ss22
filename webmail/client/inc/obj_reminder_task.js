_me = obj_reminder_task.prototype;
function obj_reminder_task() {};

_me.__constructor = function() {
	var me = this;

	this.__value = {};

	// Default values
	this.time._disabled(true);
	this.calendar._disabled(true);

	this.checkbox_1._onchange = function() {
		var v = this._value();

		me.time._disabled(!v);
		me.calendar._disabled(!v);

		if (!me.__prdka){
			me.__prdka = true;
			var tmp = new IcewarpDate();
			me.time._value(tmp.hour()*3600000 + tmp.minute()*60000 + tmp.second()*1000 + tmp.millisecond());
		}
	};
};

_me._value = function(aValues) {

	if (Is.Defined(aValues)) {

		if ((this.__value = shiftObject(aValues)) != null) {
			this.__value = this.__value.values;

			this.__prdka = true;
			this.checkbox_1._value(1);
			this.time._disabled(false);
			this.calendar._disabled(false);

			if (this.__value.RMNTIME){
				var tmp = IcewarpDate.unix(this.__value.RMNTIME);

				this.calendar._value(tmp);
				this.time._value(tmp.hour()*3600000 + tmp.minute()*60000 + tmp.second()*1000 + tmp.millisecond());
			}
		}
	}
	else {
		var aResult = [];

		if (this.checkbox_1._value()){

			var out = {};
	 		if (this.__value.RMN_ID)
			    out.uid = this.__value.RMN_ID;

			var tmp = this.calendar._getObjectDate(),
				tim = this.time._value();

			tmp.hour(Math.floor(tim/3600000));
			tmp.minute(Math.floor((tim%3600000)/60000));

			out.values = {'RMNTIME':tmp.unix()};

			aResult.push(out);
		}
		else
		if (this.__value.RMN_ID)
			aResult = [{uid:this.__value.RMN_ID}];

		return aResult;
	}
};

//Pass tabindexes to nasted objects
_me._tabIndex = function(sContainer,i,oDock){
	this.checkbox_1._tabIndex(sContainer,i,oDock);
	//this.calendar._tabIndex(sContainer,i,oDock);
	this.time._tabIndex(sContainer,i,oDock);
};
_me._focus = function (b){
	return this.checkbox_1._focus(b);
};