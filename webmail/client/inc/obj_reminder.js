_me = obj_reminder.prototype;
function obj_reminder() {};

_me.__constructor = function(sType) {
	var me = this;

	// Default values
	this.reminder_1._disabled(true);

	this.checkbox_1._title('REMINDER::REMIND1');
	this.checkbox_1._onchange = function() { 
		me.reminder_1._disabled(!this._value());
		 
		// when enabling the first reminder for the first time, load default values
		if (!me.__prdka && isFormEmpty(me._value())) {
			storage.library('gw_others');

			var aReminderDefault = null;
			if (sType && (aReminderDefault = GWOthers.get(sType,'storage')['VALUES']))
				loadDataIntoForm(me.reminder_1,aReminderDefault);
		}
		me.__prdka = true;
	}
	
    var tmp = GWOthers.get(sType,'storage').VALUES;
    if (tmp.default_reminder>0)
        this.checkbox_1._value(1);
};

_me._value = function(aValues) {
	if (Is.Defined(aValues)) {
		if (aValues){
			var aReminder;
			if ((aReminder = shiftObject(aValues)) != null) {

				//somehow fixing strange behaviour
				if (typeof aReminder.RMNDAYSBEFORE == 'undefined')
					aReminder.RMNDAYSBEFORE = aReminder.RMNHOURSBEFORE = aReminder.RMNMINUTESBEFORE = 0;

				this.reminder_1._value(aReminder);
				this.checkbox_1._value(true);
				this.reminder_1._disabled(false);
			}
		}
		else{
			this.checkbox_1._value(false);
			this.reminder_1._disabled(true);
		}

	} else {
		var aResult = [];
		var aReminder1 = this.reminder_1._value();

		if (this.checkbox_1._value()) {
			aResult.push(aReminder1);
		} else {
			if (Is.Defined(aReminder1['uid'])) {
				delete aReminder1['values'];
				aResult.push(aReminder1);
			}
		}

		return aResult;//(!isFormEmpty(aResult)) ? aResult : [];
	}
}

//Pass tabindexes to nasted objects
_me._tabIndex = function(sContainer,i,oDock){
	this.checkbox_1._tabIndex(sContainer,i,oDock);
	this.reminder_1.time._tabIndex(sContainer,i?++i:i,oDock);
};
_me._focus = function (b){
	return this.checkbox_1._focus(b);
};