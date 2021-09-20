function wm_messages()
{
  this.xmlns = 'message';
};

wm_messages.inherit(wm_generic);
var _me = wm_messages.prototype;

//********************************************************************************
//Základní SET funkce pro pro přidávání a editaci mailů
//********************************************************************************
//Vstup: aMessageInfo ... asociativní pole klíčů:
//  povinné:   'action':asociativní pole klíčů, ze kterých jsou povinné klíče:
//               'email', 'im', 'keep'
//********************************************************************************

_me.dial = function(sPhoneNumber,aHandler){
	//AJAX...
	this.create_iq({"DIAL": [{"PHONE": [{"VALUE": sPhoneNumber}]}]},[this,'response',['dial','','',aHandler]],'','set');
}

_me.add = function(aMessageInfo,sDataSet,aDataPath,aHandler,aHandler2)
{
	if (typeof aMessageInfo['action'] != 'object')
		return false;

	var aRequest = {"MESSAGE":[]};
	var aFrame = aRequest['MESSAGE'][0] = {};

	//date tag for server purpose
	aFrame.RFC_DATE = [{'VALUE':(new IcewarpDate(new Date, {locale: 'en'})).format('rfc2822')}];

	var sAccId;
	var sFolId;
	var sItmId;
	var bSave;
	var bSaved;

	for(var sTag in aMessageInfo)
		switch(sTag)
		{
			case 'action':
				aFrame['ACTION'] = [{}];
				var aActFrame = aFrame['ACTION'][0],
					aAction = aMessageInfo['action'];

				if (aAction['email'] && aAction['im'] && aAction['keep'] && aAction['html_body'])
				{
					if (aAction['email'])
						aActFrame['SEND_AS_EMAIL'] = [{'VALUE':aAction['email']}];
					if (aAction['im'])
						aActFrame['SEND_AS_IM'] = [{'VALUE':aAction['im']}];

					if (aAction['smart_attach']){
						aActFrame['SMART_ATTACH'] = [{'VALUE':aAction['smart_attach']}];

						if (aAction['smart_attach_folder'])
							aActFrame['SMART_ATTACH_FOLDER'] = [{'VALUE':aAction['smart_attach_folder']}];
					}

					if (aAction['sms'])
						aActFrame['SEND_AS_SMS'] = [{'VALUE':aAction['sms']}];

					aActFrame['KEEP_ATTACHMENTS'] = [{'VALUE':aAction['keep']}];
					aActFrame['HTML_BODY'] = [{'VALUE':aAction['html_body']}];
				}
				else
					return false;

				if (aAction['smtp_relay'])
					aActFrame['SMTP_RELAY'] = [{'VALUE':aAction['smtp_relay']}];
				if (aAction['encrypt'])
					aActFrame['ENCRYPT'] = [{'VALUE':aAction['encrypt']}];
				if (aAction['sign'])
					aActFrame['SIGN'] = [{'VALUE':aAction['sign']}];
				if (aAction['auto_addressbook'])
					aActFrame['AUTO_ADDRESSBOOK'] = [{'VALUE':aAction['auto_addressbook']}];

				if (typeof aAction['save'] == 'object')
				{
					var aSave = aAction['save'];

					if (aSave['aid'] && aSave['fid'])
					{
						sAccId = aSave['aid'];
						sFolId = aSave['fid'];
						bSave = true;

						if (aSave['iid'])
						{
							sItmId = aSave['iid'];
							bSaved = true;

							aActFrame['SAVE_TO_FOLDER'] = [{'ACCOUNT':[{'VALUE':sAccId}],'FOLDER':[{'VALUE':sFolId}],'ITEM':[{'VALUE':WMItems.__serverID(sItmId)}]}];
						}
						else
							aActFrame['SAVE_TO_FOLDER'] = [{'ACCOUNT':[{'VALUE':sAccId}],'FOLDER':[{'VALUE':sFolId}]}];
					}
					else
						return false;
				}

				if (typeof aAction['save_chat'] == 'object')
				{
					var aSave = aAction['save_chat'];

					if (aSave['aid'] && aSave['fid'])
					{
						sAccId = aSave['aid'];
						sFolId = aSave['fid'];

						if (aSave['iid'])
						{
							sItmId = aSave['iid'];
							aActFrame['SAVE_TO_TEAMCHAT'] = [{'ACCOUNT':[{'VALUE':sAccId}],'FOLDER':[{'VALUE':sFolId}],'ITEM':[{'VALUE':WMItems.__serverID(sItmId)}]}];
						}
						else
							aActFrame['SAVE_TO_TEAMCHAT'] = [{'ACCOUNT':[{'VALUE':sAccId}],'FOLDER':[{'VALUE':sFolId}]}];
					}
					else
						return false;
				}

				break;

			case 'attachments':
				if (typeof aMessageInfo['attachments'] == 'object')
				{
					aFrame['ATTACHMENTS'] = [];
					var aAttachFrame = aFrame['ATTACHMENTS'][0] = {'ATTACHMENT':[]};
					var aAttachments = aMessageInfo['attachments'];

					for(var n in aAttachments)
						if (typeof aAttachments[n] == 'object')
						{
							var aValFrame = aAttachFrame['ATTACHMENT'][n] = {'VALUES':[]};
								aValFrame = aValFrame['VALUES'][0] = {};
							var aAttachment = aAttachments[n];

							//client side is using | separator but server not REMOVED 3.2.2015
							/*
							if (aAttachment.fullpath && aAttachment.fullpath.indexOf('|')>-1)
							    aAttachment.fullpath = aAttachment.fullpath.replace(/\|[0-9\.]+/g,'');
							*/

							for(var sValue in aAttachment)
								aValFrame[sValue] = [{'VALUE':aAttachment[sValue]}];
						}
						else
							return false;
				}
				else
					return false;

				break;

			case 'distrib':
				if (typeof aMessageInfo['distrib'] == 'object')
					aFrame['DISTRIB'] = wm_messages.parse_distrib(aMessageInfo['distrib']);
				else
					return false;

				break;

			case 'headers':
				if (typeof aMessageInfo['headers'] == 'object')
				{
					aFrame['CUSTOM_HEADERS'] = [];
					var aHeadFrame = aFrame['CUSTOM_HEADERS'][0] = {'HEADER': []};
					var aHeaders = aMessageInfo['headers'];

					for(var n in aHeaders)
						aHeadFrame['HEADER'][n] = {'VALUE':aHeaders[n]};
				}
				else
					return false;

				break;

			default:
				aFrame[sTag] = [{'VALUE':aMessageInfo[sTag]}];
		}

	//Pracujeme synchronně či asynchronně?
	if (sDataSet || aHandler)
	{
		//AJAX...
		this.create_iq(aRequest,[this,'response',['add',sDataSet,aDataPath,aHandler]],aHandler2,'set');

		if (bSave && sDataSet)
		{
			if (typeof aDataPath == 'object')
			{
			 	aDataPath.push(sAccId);
			 	aDataPath.push(sFolId);
			 	aDataPath.push(sItmId);
			}
			else
				aDataPath = [sAccId,sFolId,sItmId];

			delete aMessageInfo['action'];
			dataSet.add(sDataSet,aDataPath,aMessageInfo);
		}
		return true;
	}
	else
	{
		var aResponse = this.create_iq(aRequest,'','','set');

		try
		{
			var aIQ = aResponse['IQ'][0];

			if (aIQ['ATTRIBUTES']['TYPE'] == 'result')
				if (bSave && !bSaved)
					return aIQ['MESSAGE'][0]['ATTRIBUTES']['UID'];
				else
					return true;
		}
		catch(e){gui._REQUEST_VARS.debug && console.log(this._name||false,e);}
	}

	return false;
};

//********************************************************************************
//Základní GET funkce pro získání mailu
//********************************************************************************
//Vstup: aMessageInfo ... asociativní pole klíčů:
//	povinné:	 'aid':account_id, 'fid':folder_id, 'iid':item id
//********************************************************************************
/*
_me.list = function(aMessageInfo,sDataSet,aDataPath,aHandler)
{
	//Máme definovaná account_id, folder_id a item_id?
	if (!aMessageInfo['aid'] || !aMessageInfo['fid'] || !aMessageInfo['iid'])
		return false;

	//Vytvoříme základní strukturu XML dotazu
	// <MESSAGE UID='iid' FOLDER='fid' ACCOUNT='aid'>...</MESSAGE>
	 var aRequest = {'MESSAGE':[{'ATTRIBUTES':{'UID':aMessageInfo['iid'],'FOLDER':aMessageInfo['fid'],'ACCOUNT':aMessageInfo['aid']}}]};

	//Pracujeme synchronně či asynchronně?
	if (!sDataSet)
		return this.parse(this.create_iq(aRequest));
	else
	{
		//AJAX...
		this.create_iq(aRequest,[this,'response',['list',sDataSet,aDataPath]]);
		return true;
	}
};
*/

//********************************************************************************
//Pomocná funkce realizující asynchronní obsluhu odpovědi
//********************************************************************************

_me.response = function(aData,sMethodName,sDataSet,aDataPath,aHandler)
{
	try
	{
		var aXMLResponse = aData['Array'];
		var aIQAttribute = aXMLResponse['IQ'][0]['ATTRIBUTES'];

		switch(sMethodName)
		{
			case 'add':

				if (typeof aHandler == 'object') {
					var aResult;
					var sUId;

					if (aIQAttribute['TYPE'] == 'result')
					{
						aResult = aXMLResponse['IQ'][0]['QUERY'][0];
						if (aResult['MESSAGE'] && aResult['MESSAGE'][0]['ATTRIBUTES'])
							sUId = WMItems.__clientID(aResult['MESSAGE'][0]['ATTRIBUTES']['UID']);
						else
							sUId = -1;

						var aOut = {};
						for (var i in aResult['MESSAGE'][0])
							if (aResult['MESSAGE'][0][i][0] && aResult['MESSAGE'][0][i][0].VALUE)
								aOut[i] = aResult['MESSAGE'][0][i][0].VALUE;

						executeCallbackFunction(aHandler,aOut,sUId,'');
					}
					else
					{
						aResult = aXMLResponse['IQ'][0]['ERROR'][0];
						sUId = aResult['ATTRIBUTES']['UID'];
						executeCallbackFunction(aHandler,false,sUId,aResult['VALUE']);
					}
				}
			break;

		case 'dial':
			if (typeof aHandler == 'object')
				executeCallbackFunction(aHandler, aIQAttribute['TYPE'] == 'result');
			break;

		/*
		case 'list':
			var sUId = aIQAttribute['UID'];
			var aUIdSplit = sUId.split('/');
			var sAccId = aUIdSplit.shift();
			var sItmId = WMItems.__clientID(aUIdSplit.pop());
			var sFolId = aUIdSplit.join('/');

			if (typeof aDataPath == 'object')
			{
				aDataPath.push(sAccId);
				aDataPath.push(sFolId);
				aDataPath.push(sItmId);
			}
			else
				aDataPath = [sAccId,sFolId,sItmId];

			dataSet.add(sDataSet,aDataPath,this.parse(aXMLResponse));


				*/
		}
		return true;
	}
	catch(e)
	{
		return false;
	}
};
/*
_me.parse = function(aData)
{
	try
	{
		var aFrame = aData['IQ'][0]['QUERY'][0]['MESSAGE'][0];
		var aResult = {};

		for(var sTag in aFrame)
			switch(sTag){
			case 'CUSTOM_HEADERS':
				var aHeadFrame = aFrame['CUSTOM_HEADERS'][0]['HEADER'];
				var aHeaders = aResult['headers'] = [];

				for(var n in aHeadFrame)
					aHeaders.push(aHeadFrame[n]['VALUE']);

				break;

			case 'ATTACHMENTS':
				var aAttachFrame = aFrame['ATTACHMENTS'][0]['ATTACHMENT'];
				var aValFrame;
				var aAttachments = aResult['attachments'] = [];
				var aValues;

				for(var n in aAttachFrame)
				{
					aValFrame = aAttachFrame[n]['VALUES'][0];
					aValues = [];

					for(sVal in aValFrame)
						aValues[sVal] = aValFrame[sVal][0]['VALUE'];

					aAtachments.push(aValues);
				}

				break;

			default:
				aResult[sTag] = aFrame[sTag][0]['VALUE'];
			}

		return aResult;
	}
	catch(e)
	{
		return false;
	}
};
*/
wm_messages.parse_distrib = function(aDistrib) {

	var aDistribAccFrame = [];
	var aDistribFolFrame,aDistribTypeFrame,aDistribNameFrame;
	var aDistribAccount,aDistribFolder,aDistribType;

	//Procházíme jednotlivé accounts
	for(var sAccId in aDistrib)
	{
		aDistribFolFrame = [];
		aDistribAccount = aDistrib[sAccId];

		//Procházíme jednotlivé folders
		for(var sFolId in aDistribAccount)
		{
			aDistribTypeFrame = {};
			aDistribFolder = aDistribAccount[sFolId];

			//Procházíme jednotlivé typy
			for(var sType in aDistribFolder)
			{
				aDistribNameFrame = [];
				aDistribType = aDistribFolder[sType];

				//Procházíme jednotlivá jména
				for(var n in aDistribType)
					aDistribNameFrame.push({'VALUE':aDistribType[n]});

				aDistribTypeFrame[sType] = aDistribNameFrame;
			}
			aDistribFolFrame.push({'TO':aDistribTypeFrame['to'],'CC':aDistribTypeFrame['cc'],'BCC':aDistribTypeFrame['bcc'],'ATTRIBUTES':{'uid':sFolId}});
		}
		aDistribAccFrame.push({'FOLDER':aDistribFolFrame,'ATTRIBUTES':{'uid':sAccId}});
	}

	return [{'ACCOUNT':aDistribAccFrame}];
};

message = new wm_messages;