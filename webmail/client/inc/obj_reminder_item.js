_me = obj_reminder_item.prototype;
function obj_reminder_item() {};

_me._value = function(aValues) {
	
	if (this._parent._type != 'obj_reminder')
		this._getAnchor('label').innerHTML = getLang('REMINDER::REMIND1');	

	if (Is.Defined(aValues)) {
		if (Is.Defined(aValues['values'])) {
			var aSubValues = aValues['values'];

			this.time._value(((parseInt(aSubValues['RMNDAYSBEFORE'])*24+parseInt(aSubValues['RMNHOURSBEFORE']))*60+parseInt(aSubValues['RMNMINUTESBEFORE']))*60000);

			this._id = aSubValues['RMN_ID'];
		}
	} else {
		var aResult = {'values': {}};
		var aSubValues = aResult['values'];
		
		aSubValues['RMNDAYSBEFORE'] = 0;
		aSubValues['RMNHOURSBEFORE'] = 0;
		aSubValues['RMNMINUTESBEFORE'] = this.time._getMinutes();

		if (Is.Defined(this._id)) aResult['uid'] = this._id;
		
		return aResult;
	}
};

_me._disabled = function(b) {
	var aObjects = getSubobjects(this, aObjects);
	for (var i in aObjects)
		aObjects[i]._disabled(b);
};