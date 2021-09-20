function gw_holidays(){};

var _me = gw_holidays.prototype;

//********************************************************************************
//Základní GET funkce pro práci s gw_holidays
//********************************************************************************
//Vstup:  sDataSet ... globální pole, kde jsou uloženy všechny resource
//Výstup: pole asociativních polí
//********************************************************************************

_me.get = function(sDataSet,sType)
{
	//Zadali jsem parametr?
	if (!sDataSet) return false;
	var aHolidays = dataSet.get(sDataSet,[sType || 'HOLIDAYS']);

	//Je tento resource inicializovaný?
	if (typeof aHolidays != 'object') return false;

	var aHolidayFrame;
	var aResult = [];
	var aHolidayResult;

	//Procházíme jednotlivé group
	for(var n in aHolidays['ITEMS']){
		aHolidayFrame = aHolidays['ITEMS'][n];
		aHolidayResult = {};
		aHolidayResult['UID'] = aHolidayFrame['ATTRIBUTES']['UID'];

		//Procházíme jednotlivé hodnoty group
		for(var sValue in aHolidayFrame['VALUES'])
			aHolidayResult[sValue] = aHolidayFrame['VALUES'][sValue]['VALUE'];

		aResult.push(aHolidayResult);
	}

	function sortit(a,b){
		if (a['NAME']>b['NAME'])
			return 1;
		else
		if (a['NAME']<b['NAME'])
			return -1;
		else
			return 0;
	};

	return aResult.sort(sortit);
};

//********************************************************************************
//Základní SET funkce pro práci s gw_holidays
//********************************************************************************
//Vstup: aSubscribe ... asociativní pole GroupId -> textová booleovská hodnota
//********************************************************************************

_me.set = function(aSubscribe,sDataSet,sType)
{
	var aHolidays = dataSet.get(sDataSet,[sType || 'HOLIDAYS','ITEMS']);

	//Je tento resource inicializovaný?
	if (typeof aHolidays != 'object') return false;

	var sub,bChange,bFound;

	//Procházíme jednotlivé poslané groups
	for(var sHolId in aSubscribe){
        bFound = false;

		//Procházíme stávající groups
		for(var n in aHolidays)
			//Nalezli jsme odpovídající group
			if (sHolId == aHolidays[n]['ATTRIBUTES']['UID']) {
				bFound = true;

				sub = aHolidays[n]['VALUES']['SUBSCRIBED'] && aHolidays[n]['VALUES']['SUBSCRIBED']['VALUE']?aHolidays[n]['VALUES']['SUBSCRIBED']['VALUE']:'false';
				//Změnili jsme hodnotu?
				if (aSubscribe[sHolId] != sub){
                    aHolidays[n]['VALUES']['SUBSCRIBED'] = {ATTRIBUTES:{ACCESS:'full'}};
					aHolidays[n]['VALUES']['SUBSCRIBED']['VALUE'] = aSubscribe[sHolId];
					aHolidays[n]['ATTRIBUTES']['DONT_SEND'] = false;
					bChange = true;
				}
				break;
			}

		//For Weather
		if (!bFound && aSubscribe[sHolId] == 'true'){
			aHolidays.push({
				'ATTRIBUTES':{'UID':sHolId,'ACCESS':'full','DONT_SEND':false},
				'VALUES':{'NAME':{'ATTRIBUTES':{'ACCESS':'full'},'VALUE':sHolId},'SUBSCRIBED':{'ATTRIBUTES':{'ACCESS':'full'},'VALUE':'true'}}
				});
				
            bChange = true;
		}
	}

	//Máme nějaké změny?
	if (bChange){
		dataSet.add(sDataSet,[sType || 'HOLIDAYS','ITEMS'],aHolidays);
		dataSet.add(sDataSet,[sType || 'HOLIDAYS','ATTRIBUTES','DONT_SEND'],false);
	}
	return true;
};