function wm_domains(){};

var _me = wm_domains.prototype;

_me.get = function(sDataSet,bSet){
	if (!sDataSet) return;
	
	var aDomains = dataSet.get(sDataSet,['DOMAINS_SETTINGS','ITEMS']);

	if (typeof aDomains == 'object'){

			var aDomainValues = [];

			for(var n in aDomains){
				if (aDomains[n]['VALUES'] && aDomains[n]['VALUES']['DOMAIN'] && (!bSet || (bSet && aDomains[n].VALUES.DOMAIN.ATTRIBUTES.SET)))
					aDomainValues.push({'domain':aDomains[n]['VALUES']['DOMAIN']['VALUE']});
			}
	}

	return aDomainValues;
};

_me.set = function(aDomainsInfo,sDataSet){

	//Zadali jsme oba parametry?
	if (!sDataSet)
		return false;

	if (typeof aDomainsInfo == 'object'){

		//jsou-li stejne neukladat
		if (compareObj(this.get(sDataSet,true),aDomainsInfo)) return;

		var	aDomains = {"ITEMS":[],"ATTRIBUTES":{"DONT_SEND":false}};
		var aDomainInfo,aItem,aValues;

		for(var n in aDomainsInfo){
			aDomainInfo = aDomainsInfo[n];

			//Přidáváme nového friend
			aItem = {"ATTRIBUTES":{"DONT_SEND":false},"VALUES":{}};
			aValues = aItem['VALUES'];

			//Procházíme jednotlivé hodnoty friend
			for(var sValue in aDomainInfo)
				aValues[sValue.toUpperCase()] = {"VALUE":aDomainInfo[sValue],"ATTRIBUTES":{}};

			aDomains['ITEMS'].push(aItem);
		}
	}

	//Save
	dataSet.add(sDataSet,['DOMAINS_SETTINGS'],aDomains);

	return true;
};