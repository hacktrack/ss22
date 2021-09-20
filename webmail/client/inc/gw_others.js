function gw_others(){};

var _me = gw_others.prototype;

//********************************************************************************
//Základní GET funkce pro práci s gw_others
//********************************************************************************
//Vstup:  sResourceName ... jméno non-well-known resource
//        sDataSet      ... globální pole, kde jsou uloženy všechny resource
//Výstup: asociativní pole asociativních polí hodnot a přístupů
//********************************************************************************
_me.load = function(aResources,sDataSet,sDataPath,bAppend){
	storage.library('wm_storage');
	sDataSet = sDataSet || 'storage';

	var resources = WMStorage.get({'resources':aResources});
	if(bAppend) {
		for(var i in resources) {
			dataSet.add(sDataSet,[i],resources[i],true);
		}
	} else {
		dataSet.add(sDataSet,sDataPath,resources,true);
	}

	this.checkLayoutSettings(sDataSet,sDataPath);
};

_me.get = function(sResourceName,sDataSet,bAdmin,bTryGet)
{
	//Zadali jsem oba parametry?
	if (!sResourceName || !sDataSet)
		return false;

	var aResource = dataSet.get(sDataSet,[sResourceName]);
	var bEmpty = false;

	//Stahnout storage ze serveru je-li prazdny
	if (bTryGet && typeof aResource != 'object'){
		storage.library('wm_storage');
		var aRsc = WMStorage.get({'resources':[sResourceName]});
		if (aRsc[sResourceName] && typeof aRsc[sResourceName] == 'object' && !Is.Empty(aRsc[sResourceName]['ITEMS'])){
			aResource = aRsc[sResourceName];
			dataSet.add(sDataSet, [sResourceName], aResource, true);
		}
		aRsc = null;
	}

	//Není tento resource inicializovaný?
	if (typeof aResource != 'object' || Is.Empty(aResource['ITEMS'])){
		var aResource = {'ITEMS':[{'VALUES':{},'ATTRIBUTES':{'DONT_SEND':true}}],'ATTRIBUTES':{'DONT_SEND':true}};
		bEmpty = true;
	}

	//Pokusíme se jej inicializovat default hodnotami
	if (!(aResource = this.setDefault(sResourceName,aResource,sDataSet,bEmpty)))
		return false;

	var aAccess2Num = {'full':0,'view':1,'none':2};

	//Přístup na úrovni resource
	var sAccess = (aResource['ATTRIBUTES']['ACCESS'] ? aResource['ATTRIBUTES']['ACCESS'] : 'full');

	if (bAdmin) {
		var sUserAccess = (aResource['ATTRIBUTES']['USERACCESS'] ? aResource['ATTRIBUTES']['USERACCESS'] : 'full');
		var sDomainAdminAccess = (aResource['ATTRIBUTES']['DOMAINADMINACCESS'] ? aResource['ATTRIBUTES']['DOMAINADMINACCESS'] : 'full');
	}

	var aResourceFrame = aResource['ITEMS'][0];

	//Přístup na úrovni položky
	var sSubAccess = (aResourceFrame['ATTRIBUTES']['ACCESS'] ? aResourceFrame['ATTRIBUTES']['ACCESS'] : 'full');
	sAccess = (aAccess2Num[sAccess] >= aAccess2Num[sSubAccess] ? sAccess : sSubAccess);

	if (bAdmin) {
		var sUserSubAccess = (aResourceFrame['ATTRIBUTES']['USERACCESS'] ? aResourceFrame['ATTRIBUTES']['USERACCESS'] : 'full');
		var sDomainAdminSubAccess = (aResourceFrame['ATTRIBUTES']['DOMAINADMINACCESS'] ? aResourceFrame['ATTRIBUTES']['DOMAINADMINACCESS'] : 'full');
		sUserAccess = (aAccess2Num[sUserAccess] >= aAccess2Num[sUserSubAccess] ? sUserAccess : sUserSubAccess);
		sDomainAdminAccess = (aAccess2Num[sDomainAdminAccess] >= aAccess2Num[sDomainAdminSubAccess] ? sDomainAdminAccess : sDomainAdminSubAccess);
	}

	var aValues = aResourceFrame['VALUES'];
	var aResult = {'VALUES':{},'ACCESS':{}};
	var aValuesResult = aResult['VALUES'];
	var aAccessResult = aResult['ACCESS'];

	if (bAdmin) {
		var aUserAccessResult = aResult['USERACCESS'] = [];
		var aDomainAdminAccessResult = aResult['DOMAINADMINACCESS'] = [];
	}
	var sLCValue;

	//Procházíme jednotlivé hodnoty resource
	for(var sValue in aValues)
	{
		sLCValue = sValue.toLowerCase();
		aValuesResult[sLCValue] = aValues[sValue]['VALUE'];

		//Přístup na úrovni hodnoty
		sSubAccess = (aValues[sValue]['ATTRIBUTES']['ACCESS'] ? aValues[sValue]['ATTRIBUTES']['ACCESS'] : 'full');
		aAccessResult[sLCValue] = (aAccess2Num[sAccess] >= aAccess2Num[sSubAccess] ? sAccess : sSubAccess);

		if (bAdmin) {
			sUserSubAccess = (aValues[sValue]['ATTRIBUTES']['USERACCESS'] ? aValues[sValue]['ATTRIBUTES']['USERACCESS'] : 'full');
			aUserAccessResult[sLCValue] = (aAccess2Num[sUserAccess] >= aAccess2Num[sUserSubAccess] ? sUserAccess : sUserSubAccess);
			sDomainAdminSubAccess = (aValues[sValue]['ATTRIBUTES']['DOMAINADMINACCESS'] ? aValues[sValue]['ATTRIBUTES']['DOMAINADMINACCESS'] : 'full');
			aDomainAdminAccessResult[sLCValue] = (aAccess2Num[sDomainAdminAccess] >= aAccess2Num[sDomainAdminSubAccess] ? sDomainAdminAccess : sDomainAdminSubAccess);
		}
	}
	return aResult;
};

//********************************************************************************
//Základní SET funkce pro práci s gw_others
//********************************************************************************
//Vstup: sResourceName ... jméno non-well-known resource
//       aResourceInfo ... asociativních polí klíč -> hodnota
//       sDataSet      ... globální pole, kam se ukládají všechny resource
//********************************************************************************

_me.set = function(sResourceName,aResourceInfo,sDataSet,aAccess)
{
	//Zadali jsme všechny parametry?
	if (!sResourceName || typeof aResourceInfo != 'object' || !sDataSet)
		return false;

	var aResource = dataSet.get(sDataSet,[sResourceName]);

	//Je resource inicializovaný?
	if (typeof aResource == 'object' && !Is.Empty(aResource['ITEMS']))
	{
		var aResourceFrame = aResource['ITEMS'][0];
		var aValues = aResourceFrame['VALUES'];
		var bChange = false;
		var bLocalChange = false;
		var sUCValue;

		//Procházíme poslané hodnoty resource
		for(var sValue in aResourceInfo)
		{
			bLocalChange = false;
			sUCValue = sValue.toUpperCase();

			//Není hodnota inicializovaná?
			if (typeof aValues[sUCValue] != 'object')
				aValues[sUCValue] = {'ATTRIBUTES':{}};

			//Změnili jsme hodnotu?
			if (aValues[sUCValue]['VALUE'] != aResourceInfo[sValue]){
				aValues[sUCValue]['VALUE'] = aResourceInfo[sValue];
				bLocalChange = true;
			}

			if (aAccess){

				if (aAccess['USERACCESS']) {
					var sUserAccess = (aValues[sUCValue]['ATTRIBUTES']['USERACCESS']) ? aValues[sUCValue]['ATTRIBUTES']['USERACCESS'] : 'full';
					var sNewUserAccess = (aAccess['USERACCESS'][sValue]) ? aAccess['USERACCESS'][sValue] : 'full';
					//Zmenili jsme opravneni?
					if (sUserAccess != sNewUserAccess) {
						aValues[sUCValue]['ATTRIBUTES']['USERACCESS'] = sNewUserAccess;
						bLocalChange = true;
					}
				}
				if (aAccess['DOMAINADMINACCESS']) {
					var sDomainAdminAccess = (aValues[sUCValue]['ATTRIBUTES']['DOMAINADMINACCESS']) ? aValues[sUCValue]['ATTRIBUTES']['DOMAINADMINACCESS'] : 'full';
					var sNewDomainAdminAccess = (aAccess['DOMAINADMINACCESS'][sValue]) ? aAccess['DOMAINADMINACCESS'][sValue] : 'full';

					//Zmenili jsme opravneni?
					if (sDomainAdminAccess != sNewDomainAdminAccess) {
						aValues[sUCValue]['ATTRIBUTES']['DOMAINADMINACCESS'] = sNewDomainAdminAccess;
						bLocalChange = true;
					}
				}
			}

			if (bLocalChange) {
				bChange = true;
				aValues[sUCValue]['ATTRIBUTES']['DEFAULT'] = false;
			}
		}

		//Máme nějaké změny?
		if (bChange){
			aResource['ATTRIBUTES']['DONT_SEND'] = false;
			aResourceFrame['ATTRIBUTES']['DONT_SEND'] = false;
			dataSet.add(sDataSet,[sResourceName],aResource,true);
		}
	}
	else
	{
		aResource = {'ITEMS':[{'VALUES':{},'ATTRIBUTES':{'DONT_SEND':false}}],'ATTRIBUTES':{'DONT_SEND':false}};
		var aValues = aResource['ITEMS'][0]['VALUES'];

		//Procházíme poslané hodnoty resource
		for(var sValue in aResourceInfo)
			aValues[sValue.toUpperCase()] = {'VALUE':aResourceInfo[sValue],'ATTRIBUTES':{}};

		dataSet.add(sDataSet,[sResourceName],aResource,true);
	}
	return true;
};

// Zjednodusena verze funkce others.get.
// Implicitne pouziva dataset 'storage'
_me.getItem = function(sResourceName, sItemName, sStorage, bAdmin){
	sItemName = sItemName.toUpperCase();
	var aResource = dataSet.get(sStorage || 'storage',[sResourceName,'ITEMS',0,'VALUES',sItemName]);

	if (bAdmin){
		var aResult = GWOthers.get(sResourceName,sStorage || 'storage', true);
		sItemName = sItemName.toLowerCase();
		return {VALUE:aResult.VALUES[sItemName] || this.getItem(sResourceName, sItemName, sStorage), ACCESS:aResult.ACCESS[sItemName] || 'full'};
	}
	else
	if (!aResource){
		GWOthers.get(sResourceName,sStorage || 'storage');
		aResource = dataSet.get(sStorage || 'storage',[sResourceName,'ITEMS',0,'VALUES',sItemName]);
	}

	if (aResource)
		return aResource['VALUE'];
};

/**
 * Vrati User Access
 *		true = edit
 *		false = view only|undefined
 **/
_me.getItemAccess = function(sResourceName, sItemName){
	sItemName = sItemName.toUpperCase();
	var aResource = dataSet.get('storage',[sResourceName,'ITEMS',0,'VALUES',sItemName]);
	if (!aResource){
		GWOthers.get(sResourceName,'storage');
		aResource = dataSet.get('storage',[sResourceName,'ITEMS',0,'VALUES',sItemName]);
	}

	if (aResource)
    	return !aResource.ATTRIBUTES || aResource.ATTRIBUTES.ACCESS != 'view';

	return false;
};



_me.setItem = function(sResourceName, sItemName, v){
	var tmp = {};
	tmp[sItemName] = v;
	GWOthers.set(sResourceName, tmp, 'storage');
};

_me.save = function(aHandler){
	WMStorage.set({'resources':dataSet.get('storage')}, 'storage', '', aHandler);
};

_me.setDefault = function(sResourceName,aResource,sDataSet,bEmpty){
	var aValues = this.getDefaultValues(sResourceName);

	if (typeof aValues == 'object')
	{
		var aResourceValues = aResource['ITEMS'][0]['VALUES'],
			bChange = false;

		for(var sValue in aValues)
			if (typeof aResourceValues[sValue] == 'undefined'){
				aResourceValues[sValue] = {'VALUE':aValues[sValue],'ATTRIBUTES':{'DEFAULT':true}};
				bChange = true;
			}

		//DS refresh is not deeded
		if (bChange)
			dataSet.add(sDataSet,[sResourceName],aResource,true);

		return aResource;
	}
	else
		if (bEmpty)
			return false;
		else
			return aResource;
};

_me.getDefaultValues = function(sResourceName)
{
	var aValues;

	switch(sResourceName){
        case 'GLOBAL_SETTINGS':
			aValues = {'UPLOAD_LIMIT':0, 'HTTP_PORT':sPrimaryAccountHTTP};
			break;

		case 'SKINS':
			aValues = {'DEFAULT':'Default'};
			break;

		case 'IM':
			aValues = {'ENTER_SEND':1,'AUTO_CHAT':0,'AUTO_STATUS':1,'SMILES':1,'STATUS_DND':1,'STATUS_OFFLINE':1,'SOUND_NOTIFY':1,'ESC':2,'DISABLE_GONE_MESSAGE':0};
			break;

		case 'CHAT':
			aValues = {'SMILES':1,'SOUND_NOTIFY':1,'VISUAL_NOTIFY':1};
			break;
		case 'DOCUMENTS':
			aValues = {'OFFICE_APP': 'webdoc', 'DISABLE_OFFICE':0};
			break;

		case 'MAIL_SETTINGS_DEFAULT':
			aValues = {'SEND_UNDO':1,'CTRL_ENTER':'0','SEND_DELAY':0,'REPLY_MYSELF':0,'CHECK_SUBJECT':1,'SIGN_TOP':1,'FONT_FAMILY':0,'FONT_SIZE':13,'TEXT_DIRECTION':'LTR','SPELLCHECKER':'en','HTML_MESSAGE':1,'REPLY_MESSAGE':0,'READ_CONFIRMATION':0,'SAVE_SENT_MESSAGE':1,'ENCRYPT':0,'SIGN':0,'REPLY_TO_ADDRESS':'','PRIORITY':3,'CHARSET':'UTF-8'};
			break;

		case 'MAIL_SETTINGS_GENERAL':
			aValues = {'SOUND_NOTIFY':0,'AUTOUPDATE':1,'AUTOUPDATE_MINUTES':10,'MOVE_TO_TRASH':1,'FORWARD_MESSAGES':'inline','AUTOSAVE':1,'AUTOSAVE_MINUTES':5,'DEFAULT_FLAG':'1','AUTO_RECIPIENT_TO_ADDRESSBOOK':'0','SHOW_INLINE_IMAGES':'1', 'AUTO_SHOW_IMAGES':'0','AUTOCLEAR_TRASH_DAYS':'30',GROUP_CONTACTS_BY_EMAIL:0};
			break;

		case 'LAYOUT_SETTINGS':
			aValues = {'DISABLE_PDF':0,'INTERFACES':'abp','ACTIVITY':0,'LOGIN_STYLE':'blue','LOGIN_CLIENT':'advanced','SKIN':'default','SKIN_STYLE':'default','LANGUAGE':'en','DISABLE_OFFICE':0,'LOGIN_LOGO':'login_logo.png','DATE_FORMAT':0,'TIME_FORMAT':0,ALTERNATIVE_CALENDAR:1,'INIT_PAGE':'i','CONFIRM_EXIT':1,'NOTIFICATIONS':0,'BANNER_ENABLED':1, 'FONT_WEIGHT':'auto', COMPACT_VIEW: '2', KEEP_SEARCH: 1,PREVIEW_DELAY:1500};
			break;

		case 'HOMEPAGE_SETTINGS':
			aValues = {'BANNER_HEIGHT':60,'APPLICATION':1};
			break;

		case 'CALENDAR_SETTINGS':
			aValues = {'WEEK_BEGINS':'sunday','BEGIN_ON_TODAY':0,'DAY_BEGINS':8,'DAY_ENDS':16, 'WORKWEEK_BEGINS':1, 'WORKWEEK_ENDS':5, 'TEMPERATURE':'C','AUTOCLEAR_TRASH_DAYS':'30', ALTERNATIVE_CALENDAR:-1};
			break;

		case 'DEFAULT_CALENDAR_SETTINGS':
			aValues = {'EVENT_VIEW': 'week_view', 'EVENT_SHOW_AS': 'S', 'EVENT_SHARING': 'U', 'CONTACT_SHARING': 'U', 'JOURNAL_SHARING': 'U', 'NOTE_SHARING': 'U', 'FILE_SHARING': 'U', 'TASK_SHARING': 'U'};
			break;

		case 'EVENT_SETTINGS':
			aValues = {'TIME':0,'RM_TYPE':'E','EMAIL':''};
			break;

		case 'DEFAULT_FOLDERS':
			aValues = {
				'AB': '__@@ADDRESSBOOK@@__',
				'SENT': sPrimaryAccount + '/' + getLang('COMMON_FOLDERS::SENT'),
				'TRASH': sPrimaryAccount + '/' + getLang('COMMON_FOLDERS::TRASH'),
				'DRAFTS': sPrimaryAccount + '/' + getLang('COMMON_FOLDERS::DRAFTS'),
				'CONTACTS': sPrimaryAccount + '/' + getLang('FOLDERS::CONTACTS'),
				'EVENTS': sPrimaryAccount + '/' + getLang('FOLDERS::EVENTS'),
				'TASKS': sPrimaryAccount + '/' + getLang('FOLDERS::TASKS'),
				'NOTES': sPrimaryAccount + '/' + getLang('FOLDERS::NOTES'),
				'JOURNAL': sPrimaryAccount + '/' + getLang('FOLDERS::JOURNAL'),
				'FILES': sPrimaryAccount + '/' + getLang('FOLDERS::FILES'),
				'SMART': sPrimaryAccount + '/' + getLang('FOLDERS::FILES'),
				'TEMPLATES': sPrimaryAccount + '/' + getLang('COMMON_FOLDERS::TEMPLATES')
			};
			break;

		case 'READ_CONFIRMATION':
			aValues = {'TEXT':getLang('EMAIL::READING_CONFIRMATION'),'SUBJECT':getLang('EMAIL::READING_CONFIRMATION_SUBJECT'),'SEND_CONFIRMATION':0};
			break;

		case 'SIGNATURE':
			aValues = {'TEXT':'','ENABLE':1};
			break;

		case 'LOGIN_DATA':
			aValues = {'IE_6_WARNING_SHOW_ON':0};
			break;

		case 'RESET_SETTINGS':
			aValues = {'ENABLED':0,'MAIL':getLang('RESET_PASS::EMAIL'),'SUBJECT':getLang('RESET_PASS::SUBJECT')};
			break;

		case 'RESTRICTIONS':
			aValues = {'SORTSTRING':0,'DISABLE_OTHERACCOUNTS':0,'DISABLE_WEATHER_SETTING':0,'DISABLE_CHANGEPASS':0,'DISABLE_SIGNUP':1,'DISABLE_DROPBOX':0,'GAL_SUGGEST':1, DISABLE_NEW_ALIASES: 0, DISABLE_PERSONALITIES: 0};
			break;

		case 'SIP':
			aValues = {'MODE':'integrate', START: 1};
	}

	return aValues;
};

/**
 * this method hlelps to avoid loading of incorrect skins ale languages
 * it should be executed after each load of LAYOUT_SETTINGS
 **/
_me.checkLayoutSettings = function(sDataSet,sDataPath){

	//SKINs
	var aSkin = this.get('SKINS',sDataSet,sDataPath);
	if (aSkin){
		var aData = {};
		for (var i in aSkin['VALUES'])
			if (i != 'value')
				aData[i] = aSkin['VALUES'][i];

		if (!aData[this.getItem('LAYOUT_SETTINGS','skin')])
			this.setItem('LAYOUT_SETTINGS','skin',this.getDefaultValues('LAYOUT_SETTINGS').SKIN);
	}

	//LANGs
	var aLang = this.get('LANGUAGES',sDataSet,sDataPath);
	if (aLang){
		var aData = {};
		for (var i in aLang['VALUES'])
			aData[i] = aLang['VALUES'][i];

		if (!aData[this.getItem('LAYOUT_SETTINGS','language')])
			 this.setItem('LAYOUT_SETTINGS','language',this.getDefaultValues('LAYOUT_SETTINGS').LANGUAGE);
	}
};

var GWOthers = new gw_others();
