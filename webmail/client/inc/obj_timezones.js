_me = obj_timezones.prototype;
function obj_timezones() {};

_me.__constructor = function(sDefault) {

	var aTZ = dataSet.get('storage',['TIMEZONES','ITEMS']);
	for(var i in aTZ)
		this.__idTable[aTZ[i].VALUES.TZID.VALUE] = [aTZ[i].VALUES.NAME.VALUE,'',aTZ[i].VALUES.NAME.VALUE];

	//move floating time to the end
	if (this.__idTable['F']){
		delete this.__idTable['F'];
		this.__idTable['F'] = getLang('SETTINGS::FTIME');
	}

	//Set Default value
	if (sDefault){
		if (this.__idTable[sDefault])
			this._value(sDefault);
		else
			this.__inputValue(sDefault);
	}
	else
		this._value('F');
};