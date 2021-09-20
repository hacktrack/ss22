function wm_storage(){};
wm_storage.inherit(wm_generic);
var _me = wm_storage.prototype;

//********************************************************************************
//Základní SET funkce pro nastavení storage                                 * OK *
//********************************************************************************
//Vstup: aStorageInfo ... asociativní pole klíčů:
//  povinné:   'resources':storage dataset
//  nepovinné: 'xmlns':public(jinak se nastaví private)
//********************************************************************************

_me.set = function(aStorageInfo,sDataSet,aDataPath,aHandler)
{
	function parse_attr(aAttrFrame)
	{
		var aAttributes = {};

		//Procházíme jednotlivé atributy
		for(var sAttr in aAttrFrame)
			if (sAttr != 'DEFAULT' && sAttr != 'DONT_SEND' && sAttr != 'ACCESS')
				aAttributes[sAttr] = aAttrFrame[sAttr];

		return aAttributes;
	}

	//Máme definovaný storage?
	if (typeof aStorageInfo['resources'] != 'object')
		return false;

	//Určíme jmenný prostor
	var xmlns = 'private';
	if (aStorageInfo['xmlns'] == 'public')
		xmlns = 'public';
	else if (aStorageInfo['xmlns'] == 'domain')
		xmlns = 'domain';

	//Vytvoříme XML dotaz pro nastavení storage
	// <RESOURCE>...</RESOURCE>
	var aRequest = {"RESOURCES":[]};

	//SYSTEM ADMIN is saveing DOMAIN SETTINGS
	if (typeof aStorageInfo['domain'] == 'string')
		aRequest.DOMAIN = [{"VALUE":aStorageInfo['domain']}];

	var aResourcesFrame = aStorageInfo['resources'];
	var aAttrFrame,aItemsFrame,aValuesFrame;
	var aResourcesRequest = aRequest['RESOURCES'][0] = {};
	var aResourceRequest,aItemsRequest,aItemRequest;
	var m,aAttributes,aValueRequest;
	var bResource = false;
	var bItem = false;
	var bValue = false;

	//Procházíme jednotlivé resource
	for(var sResource in aResourcesFrame)
	{
		aAttrFrame = aResourcesFrame[sResource]['ATTRIBUTES'];

		//Změnili jsme resource a máme oprávnění k jeho změně?
		if (!aAttrFrame['DONT_SEND'] && (!aAttrFrame['ACCESS'] || aAttrFrame['ACCESS'] == 'full'))
		{
			//Reset atributu dont_send
			aAttrFrame['DONT_SEND'] = true;

			aItemsFrame = aResourcesFrame[sResource]['ITEMS'];
			aResourceRequest = aResourcesRequest[sResource] = [];
			aResourceRequest = aResourceRequest[0] = {};
			aItemsRequest = aResourceRequest['ITEM'] = [];

			//Zpracujeme atributy resource
			aAttributes = parse_attr(aAttrFrame);
			if (!Is.Empty(aAttributes))
				aResourceRequest['ATTRIBUTES'] = aAttributes;

			m = 0;

			//Uloz prazdny <resource/>
			if (!aItemsFrame.length)
				bResource = true;
			else
			//Procházíme jednotlivé položky resource
				for(var n in aItemsFrame)
				{
					aAttrFrame = aItemsFrame[n]['ATTRIBUTES'];

					//Změnili jsme položku a máme oprávnění k její změně?
					if (!aAttrFrame['DONT_SEND'] && (!aAttrFrame['ACCESS'] || aAttrFrame['ACCESS'] == 'full'))
					{
					//Reset atributu dont_send
						aAttrFrame['DONT_SEND'] = true;

						aValuesFrame = aItemsFrame[n]['VALUES'];
						aItemRequest = aItemsRequest[m] = {};

						//Zpracujeme atributy položky
						aAttributes = parse_attr(aAttrFrame);
						if (!Is.Empty(aAttributes))
							aItemRequest['ATTRIBUTES'] = aAttributes;

						//Procházíme jednotlivé hodnoty položky
						for(var sValue in aValuesFrame)
						{
							aAttrFrame = aValuesFrame[sValue]['ATTRIBUTES'];

							//Máme oprávnění ke změně hodnoty?
							if (!aAttrFrame['DEFAULT'] && (!aAttrFrame['ACCESS'] || aAttrFrame['ACCESS'] == 'full'))
							{
								aValueRequest = aItemRequest[sValue] = [];
								aValueRequest = aValueRequest[0] = {};

								//Zpracujeme atributy hodnoty
								aAttributes = parse_attr(aAttrFrame);
								if (!Is.Empty(aAttributes))
									aValueRequest['ATTRIBUTES'] = aAttributes;

								aValueRequest['VALUE'] = aValuesFrame[sValue]['VALUE'];

								bValue = true;
							}
						}
						//Posíláme atributy položky nebo alespoň jednu hodnotu?
						if (aItemRequest['ATTRIBUTES'] || bValue)
						{
							m++;
							bValue = false;
							bItem = true;
						}

					}
				}

			//Posíláme atributy resource nebo alespoň jednu položku?
			if (aResourceRequest['ATTRIBUTES'] || bItem)
			{
				bItem = false;
				bResource = true;
			}
		}
	}
	//Vše je OK, ale není potřeba na server cokoliv odesílat
	if (!bResource)
		return 2;

	//Pracujeme synchronně či asynchronně?
	if (!sDataSet){
		var aResponse = this.create_iq(aRequest,'','','set','',xmlns);
		try {
			if (aResponse['IQ'][0]['ATTRIBUTES']['TYPE'] == 'result')
				return true;
		}
		catch(e){gui._REQUEST_VARS.debug && console.log(this._name||false,e);}
		return false;
	}
	else{
		//AJAX...
		this.create_iq(aRequest,[this,'response',['set',sDataSet,aDataPath,aHandler]],'','set','',xmlns);
		return true;
	}
};

//********************************************************************************
//Základní GET funkce pro získání dat ze storage                            * OK *
//********************************************************************************
//Vstup: aStorageInfo ... asociativní pole klíčů:
//  povinné:   'recources':pole resource jmen
//  nepovinné: 'xmlns':public(jinak se nastaví private)
//********************************************************************************

_me.get = function(aStorageInfo,sDataSet,aDataPath,aHandler,bForce){
	//Máme definovaná jména resource?
	if (typeof aStorageInfo['resources'] != 'object')
		return false;

	//Určíme jmenný prostor
	var xmlns = 'private';
	if (aStorageInfo['xmlns'] == 'public')
		xmlns = 'public';
	else
	if (aStorageInfo['xmlns'] == 'domain')
		xmlns = 'domain';

	var aResources = aStorageInfo['resources'];
	var bAnything = false;

	//Vytvoříme XML dotaz pro získání dat ze storage
	// <RESOURCES>...</RESOURCES>
	var aRequest = {"RESOURCES":[{}]};

	//SYSTEM ADMIN is saveing DOMAIN SETTINGS
	if (typeof aStorageInfo['domain'] == 'string')
		aRequest.DOMAIN = [{"VALUE":aStorageInfo['domain']}];

	var aFrame = aRequest['RESOURCES'][0];

	//Vytvoříme XML podstrukturu
	//<jméno_resource1/><jméno_resource2/>...
	for(var n in aResources)
		//Pracujeme synchronně nebo jsme ještě tento resource neinicializovali?
		if (!sDataSet || !(xmlns == 'private' && !bForce && dataSet.get(sDataSet,[aResources[n].toUpperCase()]))){
			aFrame[aStorageInfo['resources'][n]] = [{}];
			bAnything = true;
		}

	//Posíláme vůbec něco?
	if (!bAnything){
		if (typeof aHandler == 'object')
			executeCallbackFunction(aHandler);
	}
	else
	//Pracujeme synchronně či asynchronně?
	if (!sDataSet && !aHandler)
		return this.parse(this.create_iq(aRequest,'','','','',xmlns));
	//AJAX...
	else{
		this.create_iq(aRequest,[this,'response',['get',sDataSet,aDataPath,aHandler]],'','','',xmlns);
	}
};

//********************************************************************************
//Pomocná funkce realizující asynchronní obsluhu odpovědi
//********************************************************************************

_me.response = function(aResponse,sMethodName,sDataSet,aDataPath,aHandler)
{
	var aXMLResponse = aResponse['Array'];
	var aIQAttribute = aXMLResponse['IQ'][0]['ATTRIBUTES'];

	switch(sMethodName)
	{
	case 'set':
		try{
			var bOK = aIQAttribute['TYPE'] == 'result';

			if (typeof aHandler == 'object')
				executeCallbackFunction(aHandler,[bOK]);

			if (bOK)
				return true;
		}
		catch(e){gui._REQUEST_VARS.debug && console.log(this._name||false,e);}
		return false;

	case 'get':
		try{
			if (aIQAttribute['TYPE'] == 'result'){
				var aResult = this.parse(aXMLResponse);

				for(var sResource in aResult)
					dataSet.add(sDataSet,[sResource],aResult[sResource]);

				if (typeof aHandler == 'object')
					executeCallbackFunction(aHandler,aResult);

				return true;
			}
		}
		catch(e){gui._REQUEST_VARS.debug && console.log(this._name||false,e);}
		return false;
	}
};

//********************************************************************************
//Pomocná funkce realizující převod z "XML" pole do Dataset struktur        * OK *
//********************************************************************************

_me.parse = function(aData)
{
	try
	{
		function parse_attr(aAttrFrame,bDontSend)
		{
			var aAttributes = {};

			//Procházíme jednotlivé atributy
			for(var sAttr in aAttrFrame)
				aAttributes[sAttr] = aAttrFrame[sAttr];

			//Neposlal-li nám server access, nastavíme jej na full
			if (!aAttributes['ACCESS'])
				aAttributes['ACCESS'] = 'full';

			//Ukládáme atribut DONT_SEND?
			if (bDontSend)
				aAttributes['DONT_SEND'] = true;

			return aAttributes;
		};

		var aResourcesFrame = aData['IQ'][0]['QUERY'][0]['RESOURCES'][0];
		var aResourceFrame,aItemFrame,aValueFrame;
		var aResult = {};
		var aResourceResult,aItemsResult,aItemResult,aValuesResult,aValueResult;

		//Procházime jednotlivé resource
		for(var sResource in aResourcesFrame)
		{
			aResourceFrame = aResourcesFrame[sResource][0];
			aResourceResult = aResult[sResource] = {};

			//Načteme globální atributy
			aResourceResult['ATTRIBUTES'] = parse_attr(aResourceFrame['ATTRIBUTES'],true);

			aItemsResult = aResourceResult['ITEMS'] = [];

			//Procházíme jednotlivé položky resource
			for(var n in aResourceFrame['ITEM'])
			{
				aItemFrame = aResourceFrame['ITEM'][n];
				aItemResult = {};

				//Načteme lokální atributy
				aItemResult['ATTRIBUTES'] = parse_attr(aItemFrame['ATTRIBUTES'],true);

				aValuesResult = aItemResult['VALUES'] = {};

				//Procházíme jednotlivé hodnoty položky
				for(var sTag in aItemFrame)
					//Lokální atributy již máme načtené
					if (sTag != 'ATTRIBUTES')
					{
						aValueFrame = aItemFrame[sTag][0];
						aValueResult = aValuesResult[sTag] = {};

						//Načteme atributy konkrétní hodnoty
						aValueResult['ATTRIBUTES'] = parse_attr(aValueFrame['ATTRIBUTES'],false);

						//a konkrétní hodnotu
						if (typeof aValueFrame['VALUE'] == 'undefined')
							aValueResult['VALUE'] = '';
						else
							aValueResult['VALUE'] = aValueFrame['VALUE'];
					}

				aItemsResult.push(aItemResult);
			}
		}
		return aResult;
	}
	catch(e){
		return false;
	}
};

WMStorage = new wm_storage();