function wm_spellchecker(){
	this.xmlns = 'spellchecker';
};

wm_spellchecker.inherit(wm_generic);
var _me = wm_spellchecker.prototype;

//********************************************************************************
//Z�kladn� GET funkce pro z�sk�n� dat ze spellchecker
//********************************************************************************
//Vstup: aSpellcheckerInfo ... asociativn� pole kl���:
//  povinn�: 'type' :typ p��kazu get (check,suggest,dictionary)
//					 'lang' :k�d jazyka
//           'input':text (check,suggest) nebo pole jednotliv�ch slov (dictionary)
//********************************************************************************
_me.get = function(aSpellcheckerInfo,aHandler)
{
	if (!aSpellcheckerInfo['type'] || !aSpellcheckerInfo['lang'] || !aSpellcheckerInfo['input'])
		return false;

	var aRequest;

	switch(aSpellcheckerInfo['type'])
	{
		case 'check':
			if (typeof aSpellcheckerInfo['input'] != 'string')
				return false;

			aRequest = {'CHECK':[{'ATTRIBUTES':{'UID':aSpellcheckerInfo['lang']},'TEXT':[{'VALUE':aSpellcheckerInfo['input']}]}]};
			break;

		case 'suggest':
			if (typeof aSpellcheckerInfo['input'] != 'string')
				return false;

			aRequest = {'CHECK':[{'ATTRIBUTES':{'UID':aSpellcheckerInfo['lang']},'TEXT':[{'VALUE':aSpellcheckerInfo['input']}],'SUGGEST':[{}]}]};
			break;

		case 'dictionary':
			if (typeof aSpellcheckerInfo['input'] != 'object')
				return false;

			aRequest = {'DICTIONARY':[{'ATTRIBUTES':{'UID':aSpellcheckerInfo['lang']},'SUGGEST':[{}]}]};
			var aSuggestFrame = aRequest['DICTIONARY'][0]['SUGGEST'];

			for(var n in aSpellcheckerInfo['input'])
				aSuggestFrame.push({'ATTRIBUTES':{'WORD':aSpellcheckerInfo['input'][n]}});
	}

	//Pracujeme synchronn� �i asynchronn�?
	if (!aHandler)
		return this.parse(this.create_iq(aRequest));
	else
	{
		//AJAX...
		this.create_iq(aRequest,[this,'response',['get',aHandler]]);
		return true;
	}
};

//********************************************************************************
//Z�kladn� SET funkce pro p�id�van� slov do spellchecker
//********************************************************************************
//Vstup: aSpellcheckerInfo ... asociativn� pole kl���:
//	povinn�:   'lang' :k�d jazyka
//						 'input':pole jednotlivych slov
//********************************************************************************

_me.set = function(aSpellcheckerInfo, aHandler)
{
	if (!aSpellcheckerInfo['lang'] || !aSpellcheckerInfo['input'] || typeof aSpellcheckerWords != 'object')
		return false;

	var aRequest = {'DICTIONARY':[{'ATTRIBUTES':{'UID':aSpellcheckerInfo['lang']},'ADD':[]}]};
	var aAddFrame = aRequest['DICTIONARY'][0]['ADD'];

	for(var n in aSpellcheckerInfo['input'])
		aAddFrame.push({'VALUE':aSpellcheckerInfo['input'][n]});

	//Pracujeme synchronn� �i asynchronn�?
	if (!aHandler)
	{
		var aResponse = this.create_iq(aRequest,'','','set');

		try
		{
			if (aResponse['IQ'][0]['ATTRIBUTES']['TYPE'] == 'result')
				return true;
		}
		catch(e){}

		return false;
	}
	else
	{
		//AJAX...
		this.create_iq(aRequest,[this,'response',['set', aHandler]],'','set');
		return true;
	}
};

//********************************************************************************
//Pomocn� funkce realizuj�c� asynchronn� obsluhu odpov�di
//********************************************************************************

_me.response = function(aResponse,sMethodName,aHandler){
	if (Is.Object(aHandler)){
		try{
			var aXMLResponse = aResponse['Array'];
			var aIQAttribute = aXMLResponse['IQ'][0]['ATTRIBUTES'];
			var bOK = aIQAttribute['TYPE'] == 'result';

			switch(sMethodName){
				case 'set':
					executeCallbackFunction(aHandler, bOK);
					break;

				case 'get':
					executeCallbackFunction(aHandler, bOK, this.parse(aXMLResponse));
			}
		}
		catch(e){
			console.warn('spellchecker error', e);
		}
	}
};

//********************************************************************************
//Pomocn� funkce realizuj�c� p�evod z "XML" pole do Dataset struktur
//********************************************************************************

_me.parse = function(aData){

	try{
		var aQuery = aData['IQ'][0]['QUERY'][0];
		var sType;

		if (aQuery['CHECK'])
			sType = 'CHECK';
		else
			sType = 'DICTIONARY';

		var aQueryType = aQuery[sType][0];
		var aResult = [];

		for(var sTag in aQueryType)
			switch(sTag){
				case 'WORD':
					for(var n in aQueryType['WORD'])
						aResult.push(aQueryType['WORD'][n]['VALUE']);

					break;

				case 'SUGGEST':
					var aSuggest = aQueryType['SUGGEST'];
					var sOrigWord,aOrigWordFrame;

					for(var n in aSuggest){
						sOrigWord = aSuggest[n]['ATTRIBUTES']['WORD'];
						aOrigWordFrame = aSuggest[n]['WORD'];

						aResult[sOrigWord] = [];

						for(var m in aOrigWordFrame)
							aResult[sOrigWord].push(aOrigWordFrame[m]['VALUE']);
					}
			}
		return aResult;
	}
	catch(e){
		return false;
	}
};