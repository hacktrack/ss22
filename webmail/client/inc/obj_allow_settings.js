_me = obj_allow_settings.prototype;
function obj_allow_settings(){};

_me.__constructor = function(bUser) {
	var me = this;
	
	if (this.domadmin)
		this.domadmin._onchange = function () {
			if (this._checked())
				me.user._value(1);
		};

	if(!bUser){
		this.user._onchange = function () {
			if (me.domadmin) {
				if (!this._checked() && me.domadmin._checked())
					this._value(1);
			}
		};
	}
	else{
		this.user._value(1, true);
		this.user._disabled(true);
		this.user._onchange = function () {
			this._value(1, true);
		};
	}
};