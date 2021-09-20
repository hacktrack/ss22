function wm_accounts(){
	this.xmlns='accounts';
};

wm_accounts.inherit(wm_generic);
var _me = wm_accounts.prototype;

//********************************************************************************
//Základní SET funkce pro pro přidávání a update accountu
//********************************************************************************
//Vstup: aAccountInfo ... asociativní pole klíčů:
//  povinné:
//  nepovinné:
//********************************************************************************
_me.add = function(aAccountInfo,sDataSet,aDataPath,aHandler){
	var aRequest,uid;

	//EDIT
	if (aAccountInfo['aid']){
		aRequest = {"ACCOUNT":[{"ATTRIBUTES":{"ACTION":"edit","UID":aAccountInfo['aid']}}]};
		var aFrame = aRequest["ACCOUNT"][0];

		for(var sTag in aAccountInfo)
			if (sTag == 'acl'){

				//<right email="{group_email}">{rights}</right>

				var aGrp = [];
				for (var i in aAccountInfo['acl'])
					aGrp.push({VALUE:aAccountInfo['acl'][i].join(''),ATTRIBUTES:{EMAIL:i}});

				if (aGrp.length)
					aFrame.ACL = [{RIGHT:aGrp}];
				else
				    aFrame.ACL = [{VALUE:''}];
			}
			else
			if (sTag != 'aid')
				aFrame[sTag]=[{"VALUE":aAccountInfo[sTag]}];

		uid = aAccountInfo['aid'];
	}
	else
	//ADD
	if (aAccountInfo['SERVER'] && aAccountInfo['USERNAME'] && aAccountInfo['PASSWORD'] && aAccountInfo['EMAIL']){
		switch(aAccountInfo['PROTOCOL']){
			case 'imap':
			case 'pop3':
			case 'local': break;
			default: aAccountInfo['PROTOCOL'] = 'pop3';
		}

		if (!aAccountInfo['PORT'])
			if (aAccountInfo['PROTOCOL']=='imap')
				aAccountInfo['PORT'] = 143;
			else
				aAccountInfo['PORT'] = 110;

		uid = aAccountInfo['EMAIL'];

		aRequest = {"ACCOUNT":[{"ATTRIBUTES":{"ACTION":"add"},
					"PROTOCOL":[{"VALUE":aAccountInfo['PROTOCOL']}],
					"SERVER":[{"VALUE":aAccountInfo['SERVER']}],
					"USERNAME":[{"VALUE":aAccountInfo['USERNAME']}],
					"PASSWORD":[{"VALUE":aAccountInfo['PASSWORD']}],
					"PORT":[{"VALUE":aAccountInfo['PORT']}],
					"EMAIL":[{"VALUE":aAccountInfo['EMAIL']}],
					"DESCRIPTION":[{"VALUE":aAccountInfo['DESCRIPTION']}]}]};
	}
	else
		return false;

	//Pracujeme synchronně či asynchronně?
	if (sDataSet || aHandler){
		//AJAX...
		this.create_iq(aRequest,[this,'response',['add',sDataSet,aDataPath,aHandler]],'','set', uid);
		return true;
	}
	else{
		var aResponse = this.create_iq(aRequest,'','','set');
		try{
			if (aResponse['IQ'][0]['ATTRIBUTES']['TYPE']=='result')
				return true;
		}
		catch(e){gui._REQUEST_VARS.debug && console.log(this._name||false,e);}
		return false;
	}
};

/*
<iq sid="{sid}" type="set">
<query xmlns="webmail:iq:accounts">
<account uid="{owner_account}" action="subscribe|unsubscribe">
<subscribtion>{subscribtion_account}</subscription>
<subscribtion>{subscribtion_account2}</subscription>
</account>
</query>
</iq>
*/
_me.subscribe = function(aAccountInfo,aHandler){
	if (!aAccountInfo || !aAccountInfo.subscription || !aAccountInfo.subscription.length)
		return;

	var aSub = [];
	for (var i in aAccountInfo.subscription)
		aSub.push({VALUE:aAccountInfo.subscription[i]});

	if (aSub.length){
		var aRequest = {"ACCOUNT":[{"SUBSCRIPTION":aSub,"ATTRIBUTES":{"ACTION":'subscribe',"UID":sPrimaryAccount}}]};

		//AJAX...
		this.create_iq(aRequest,[this,'response',['subscribe','','',aHandler]],'','set');
		return true;
	}
};

_me.unsubscribe = function(aAccountInfo,aHandler){
	if (!aAccountInfo || !aAccountInfo.subscription || !aAccountInfo.subscription.length)
		return;

	var aSub = [];
	for (var i in aAccountInfo.subscription)
		aSub.push({VALUE:aAccountInfo.subscription[i]});

	if (aSub.length){
		var aRequest = {"ACCOUNT":[{"SUBSCRIPTION":aSub,"ATTRIBUTES":{"ACTION":'unsubscribe_folder',"UID":sPrimaryAccount}}]};

		//AJAX...
		this.create_iq(aRequest,[this,'response',['subscribe','','',aHandler]],'','set');
		return true;
	}
};

/*

<--
<iq sid="b48b0e0736f0b1104b91708c69c61157" type="set">
<query xmlns="webmail:iq:accounts">
<account action="test">
<email>{email}</email>
<username>{username}</username>
<password>{password}</password>
<server>{server}</server>
<port>{port}</port>
<protocol>{protocol}</protocol>
</account>
</query>
</iq>

->
<?xml version="1.0" encoding="utf-8" ?>
<iq sid="b48b0e0736f0b1104b91708c69c61157" type="result">
<result>true|false</result>
</iq>

*/
_me.test = function(aAccountInfo,aHandler){

	var aRequest = {"ACCOUNT":[{"ATTRIBUTES":{"ACTION":"test"}}]};
	var aAccount = aRequest.ACCOUNT[0];
		aAccount.EMAIL = [{VALUE:aAccountInfo.EMAIL}];
		aAccount.USERNAME = [{VALUE:aAccountInfo.USERNAME}];

		if (aAccountInfo.PASSWORD)
			aAccount.PASSWORD = [{VALUE:aAccountInfo.PASSWORD}];

		aAccount.SERVER = [{VALUE:aAccountInfo.SERVER}];
		aAccount.PORT = [{VALUE:aAccountInfo.PORT}];
		aAccount.PROTOCOL = [{VALUE:aAccountInfo.PROTOCOL}];

		aAccount.SENTFOLDER = [{VALUE:aAccountInfo.SENTFOLDER}];
		aAccount.TRASHFOLDER = [{VALUE:aAccountInfo.TRASHFOLDER}];

		aAccount.DESCRIPTION = [{VALUE:aAccountInfo.DESCRIPTION}];

	if (!aHandler){
		var aResponse = this.create_iq(aRequest,'','','set');
		try{
			if (aResponse['IQ'][0]['ATTRIBUTES']['TYPE']=='result')
				return true;
		}
		catch(e){gui._REQUEST_VARS.debug && console.log(this._name||false,e);}
		return false;
	}
	else{
		//AJAX...
		this.create_iq(aRequest,[this,'response',['test','','',aHandler]],'','set');
		return true;
	}
};

/*
Self sign up

<iq type="set">
<query xmlns="webmail:iq:accounts">
<account action="signup">
<username>testik</username>
<password>testik</password>
[<fullname>]
[<alternative>]
<email>testik@icewarpdemo.com</email>
<captcha uid="{captchaUID}">TRLH BH78</captcha>
</account>
</query>
</iq>
*/
_me._signup = function(sUser,sPass,sFull,sDomain,sAlt,csid,captcha){

	aRequest = {"ACCOUNT":[{
	ATTRIBUTES:{ACTION:'signup'},
	USERNAME:[{VALUE:sUser}],
	PASSWORD:[{VALUE:sPass}],
	FULLNAME:[{VALUE:sFull}],
	ALTERNATIVE:[{VALUE:sAlt}],
	EMAIL:[{VALUE:sUser+'@'+sDomain}],
	CAPTCHA:[{ATTRIBUTES:{UID:csid},VALUE:captcha}]
	}]};

	var aResponse = (this.create_iq(aRequest,'','','set')).IQ[0];

	if (aResponse.ATTRIBUTES.TYPE == 'result')
		return {'uid':true};
	else
	if (aResponse.ATTRIBUTES.TYPE == 'error')
		return {'uid':aResponse.ERROR[0].ATTRIBUTES.UID,'value':aResponse.ERROR[0].VALUE};
	else
		return false;
};

//********************************************************************************
//Základní GET funkce pro listování accountů
//********************************************************************************

_me.license = function(aHandler){
    var aRequest = {"ACCOUNT":[{"ATTRIBUTES":{"ACTION":'license',"UID":sPrimaryAccount}}]};
	this.create_iq(aRequest,[this,'response',['license',null,null,aHandler]],'','get');
	return true;
};

_me.list = function(aAccountInfo,sDataSet,aDataPath,sParam,aHandler){
	var aRequest = {};

	if (aAccountInfo && aAccountInfo.aid)
		aRequest.ACCOUNT = [{"ATTRIBUTES":{"UID":aAccountInfo['aid']}}];

	aRequest.CTZ = [{'VALUE': new IcewarpDate().utcOffset()}];

	//Pracujeme synchronně či asynchronně?
	if (sDataSet || aHandler){
		//AJAX...
		this.create_iq(aRequest,[this,'response',['list',sDataSet,aDataPath,aHandler]],'','get',sParam);
		return true;
	}
	else
		return this.account_sort(this.parse(this.create_iq(aRequest)));
};
	// sort accounts (main on top and rss on bottom)
	_me.account_sort = function(arr){
		var main={},rss={};
		for(var i in arr){
			if (arr[i].PRIMARY){
				main[i] = arr[i];
				delete arr[i];
			}
			else
			if (arr[i].TYPE == 'rss'){
				rss[i] = arr[i];
				delete arr[i];
			}
		}
		for (i in arr)
			main[i] = arr[i];
		for (i in rss)
			main[i] = rss[i];

		return main;
	};

_me.refresh = function(aAccountInfo,sDataSet,aDataPath,aHandler){
	//Máme definované account_id?
	if (!aAccountInfo['aid']) return false;

	//Vytvoříme XML dotaz pro refresh accountů
	// <ACCOUNT UID='aid' ACTION='refresh'/>
	var sType = 'refresh',
		aRequest = {"ACCOUNT":[{"ATTRIBUTES":{"ACTION":"refresh","UID":aAccountInfo['aid']}}]};

	if (aHandler || sDataSet){
		this.create_iq(aRequest,[this,'response',[sType,sDataSet,aDataPath,aHandler]],'','set',aAccountInfo['aid'],'',true);
		return true;
	}
	//Pracujeme synchronně či asynchronně?
	else{
		var result = WMFolders.parse(this.create_iq(aRequest,'','','set'));

		//map folders
		if (result[sPrimaryAccount])
			this.__mapFolders(result[sPrimaryAccount]);

		return result;
	}
};

//********************************************************************************
//Základní SET funkce pro pro mazání accountu
//********************************************************************************
//Vstup: aAccountInfo ... asociativní pole klíčů:
//  povinné:   'aid':account_id
//********************************************************************************

_me.remove = function(aAccountInfo,sDataSet,aDataPath,sParam){
	//Máme definované account_id?
	if (!aAccountInfo['aid'])
		return false;

	//Vytvoříme XML dotaz pro synchronizaci accountů
	// <ACCOUNT UID='aid' ACTION='delete'/>
	var aRequest = {"ACCOUNT":[{"ATTRIBUTES":{"ACTION":"delete","UID":aAccountInfo['aid']}}]};

	//Pracujeme synchronně či asynchronně?
	if (!sDataSet){
		var aResponse = this.create_iq(aRequest,'','','set');
		try{
			if (aResponse['IQ'][0]['ATTRIBUTES']['TYPE']=='result')
			return true;
		}
		catch(e){gui._REQUEST_VARS.debug && console.log(this._name||false,e);}
		return false;
	}
	else{
		//AJAX...
		this.create_iq(aRequest,[this,'response',['remove',sDataSet,aDataPath]],'','set',sParam);
		return true;
	}
};

//********************************************************************************
//Základní SET funkce pro vyvolání synchronizace accountů na serveru
//********************************************************************************

_me.synchronize = function(aFoldersInfo,sDataSet,aDataPath){
	//Máme definované account_id?
	if (!aFoldersInfo['aid'])
		return false;

	//Vytvoříme strukturu XML dotazu pro synchronizaci folderu v accountu
	// <ACCOUNT UID='aid'><FOLDER ACTION="sync"/></ACCOUNT>
	var aRequest = {"ACCOUNT":[{"ATTRIBUTES":{"UID":aFoldersInfo['aid']},"FOLDER":[{"ATTRIBUTES":{"ACTION":"sync"}}]}]};

	//Pracujeme synchronně či asynchronně?
	if (!sDataSet){
		var aResponse = this.create_iq(aRequest,'','','set');
		try{
			if (aResponse['Array']['IQ'][0]['ATTRIBUTES']['TYPE'] == 'result')
			return true;
		}
		catch(e) {}

		return false;
	}
	else{
		//AJAX...
		this.create_iq(aRequest,[this,'response',['synchronize',sDataSet,aDataPath]],'','set');
		return true;
	}
};

//********************************************************************************
//Základní SET funkce pro vyvolání synchronizace accountů na serveru
// následovaná GET funkcí listující accounty
//********************************************************************************

_me.synclist = function(aFoldersInfo,sDataSet,aDataPath){
	//Máme definované account_id?
	if (!aFoldersInfo['aid']) return false;

	//Vytvoříme strukturu XML dotazu pro synchronizaci folderu v accountu
	// <ACCOUNT UID='aid'><FOLDER ACTION="sync"/></ACCOUNT>
	var aRequest = {"ACCOUNT":[{"ATTRIBUTES":{"UID":aFoldersInfo['aid'],"ACTION":"sync"}}]};

	//Pracujeme synchronně či asynchronně?
	if (!sDataSet){
		var aResponse = this.create_iq(aRequest,'','','set');
		try{
			//Proběhla-li synchronizace úspěšně, budeme foldery v accountu listovat
			if (aResponse['IQ'][0]['ATTRIBUTES']['TYPE'] == 'result')
				(new wm_folders).list({'aid':aFoldersInfo['aid']});
		}
		catch(e) {}

		return false;
	}
	else{
		//AJAX...
		this.create_iq(aRequest,[this,'response',['synclist',sDataSet,aDataPath]],'','set',aFoldersInfo['aid']);
		return true;
	}
};

_me.action = function(aInfo, sType, aHandler){
	if (aHandler && sType){
		var aRequest = {"ACCOUNT":[{"ATTRIBUTES":{"UID":sPrimaryAccount,"ACTION":sType}}]};

		if (aInfo){
			for(var i in aInfo){
				aRequest.ACCOUNT[0][i] = [{VALUE:aInfo[i]}];
			}
		}

		this.create_iq(aRequest,[this,'response',['action',null,null,aHandler]],'','set',sPrimaryAccount);
	}
};

//********************************************************************************
//Pomocná funkce realizující asynchronní obsluhu odpovědi
//********************************************************************************

_me.response = function(aResponse,sMethodName,sDataSet,aDataPath,aHandler){
	var aXMLResponse = aResponse['Array'],
		aIQAttribute = aXMLResponse['IQ'][0]['ATTRIBUTES'];

	switch(sMethodName){
	case 'license':
		if (aHandler)
			executeCallbackFunction(aHandler,aXMLResponse);

		break;

	case 'subscribe':
		if (aIQAttribute['TYPE'] == 'result')
			this.refresh({'aid':sPrimaryAccount},'folders');

		if (aHandler)
			executeCallbackFunction(aHandler,aXMLResponse);

		break;

	case 'test':

		var out = false;
		try{
			if (aXMLResponse['IQ'][0]['ATTRIBUTES']['TYPE']=='result')
				out = true;
		}
		catch(e){gui._REQUEST_VARS.debug && console.log(this._name||false,e);}

		executeCallbackFunction(aHandler,out);
		return;

	case 'list':
		if (aIQAttribute['TYPE'] == 'result'){

			if (sDataSet || aHandler){
				var acc = this.account_sort(this.parse(aXMLResponse));
				if (sDataSet)
					dataSet.add(sDataSet,aDataPath, acc);

				if (aHandler)
					executeCallbackFunction(aHandler, acc);
			}

			if (aIQAttribute['UID']){
				var aAccounts = dataSet.get(sDataSet,aDataPath);
				dataSet.remove(aIQAttribute['UID'],'',true);
				for(sAccId in aAccounts)
					WMFolders.list({'aid':sAccId},aIQAttribute['UID']);
			}
		}
		return true;

	case 'refresh':

		if (aIQAttribute['TYPE'] == 'error') {
			var str, att;
			try{
				att = aXMLResponse.IQ[0].ERROR[0].ATTRIBUTES.UID;
				str = aXMLResponse.IQ[0].ERROR[0].VALUE;
			}
			catch(e){
				str = att = '';
			}

			if (att.toLowerCase() == 'imap_internal'){
				if (typeof aHandler == 'object')
					executeCallbackFunction(aHandler,(aIQAttribute['UID']?aIQAttribute['UID'] + "\n":'')+str.unescapeHTML());
				else
					alert((aIQAttribute['UID']?aIQAttribute['UID'] + "\n":'')+str.unescapeHTML());
			}
		}

	case 'synchronize':
		if (aIQAttribute['TYPE'] == 'result' && aIQAttribute['UID']){

			var aParsedData = WMFolders.parse(aXMLResponse),
				aAccountAttribute = aXMLResponse['IQ'][0]['QUERY'][0]['ACCOUNT'][0].ATTRIBUTES;

			//map folders
			if (sPrimaryAccount == aIQAttribute['UID']){
				//Update MailBox Quota
				if (aAccountAttribute.MBOX_QUOTA){
					dataSet.add('main',['MBOX_QUOTA'],aAccountAttribute.MBOX_QUOTA,true);
					dataSet.add('main',['MBOX_USAGE'],aAccountAttribute.MBOX_USAGE);
				}
				//Update SMS Quota
				if (aAccountAttribute.SMS_LIMIT){
					dataSet.add('main',['SMS_LIMIT'],aAccountAttribute.SMS_LIMIT,true);
					dataSet.add('main',['SMS_SENT'],aAccountAttribute.SMS_SENT);
				}

				//Inbox Recent
				var	iRecent_old = +(dataSet.get(sDataSet,[aIQAttribute['UID'],'INBOX','RECENT']) || 0);

				if (aIQAttribute['UID'] == sPrimaryAccount)
					this.__mapFolders(aParsedData[aIQAttribute['UID']]);

				this.__mergeRecent(aIQAttribute['UID'], aParsedData[aIQAttribute['UID']]);

				// single folder refresh (full update)
				if (sMethodName === 'synchronize') { // && Object.keys(aParsedData[aIQAttribute['UID']]).length === 1
					for(var i in aParsedData[aIQAttribute['UID']]) {
						if (aParsedData[aIQAttribute['UID']].hasOwnProperty(i)){
							dataSet.add(sDataSet, [aIQAttribute['UID'], i], aParsedData[aIQAttribute['UID']][i]);
						}
					}
				}
				// Recent only (update once)
				else{
					dataSet.add(sDataSet, [aIQAttribute['UID']], aParsedData[aIQAttribute['UID']]);
				}

				if (iRecent_old < dataSet.get(sDataSet,[aIQAttribute['UID'],'INBOX','RECENT'])){

					//change title
					if (gui.frm_main && gui.frm_main.title)
						gui.frm_main.title._add(getLang('TITLE::NEW_EMAIL'),10);

					//show notifier
					if (gui.notifier)
						gui.notifier._value({type: 'new_email', args: [sPrimaryAccount]});

					//new email sound
					storage.library('gw_others');
					if (gui.frm_main && gui.frm_main.sound && parseInt(GWOthers.getItem('MAIL_SETTINGS_GENERAL','sound_notify'))>0)
						gui.frm_main.sound._play('mail');
				}
				else
				if (iRecent_old > 0 && (dataSet.get(sDataSet,[aIQAttribute['UID'],'INBOX','RECENT']) || 0) == 0) {
					//reset title
					if (gui.frm_main && gui.frm_main.title)
						gui.frm_main.title._reset();
				}
			}
			else
				dataSet.add(sDataSet, [aIQAttribute['UID']], aParsedData[aIQAttribute['UID']]);

			if (typeof aHandler == 'object')
				executeCallbackFunction(aHandler);
		}
		break;

	case 'remove':
		try{
			if (aIQAttribute['TYPE']!='result' && aIQAttribute['UID'])
				this.list(sDataSet,aDataPath,aIQAttribute['UID']);
			return true;
		}
		catch(e){gui._REQUEST_VARS.debug && console.log(this._name||false,e);}

		return false;

	case 'add':
	case 'synclist':
		try{
			if (aIQAttribute['TYPE'] == 'result' && sDataSet && aIQAttribute['UID']){
				//Proběhla-li synchronizace úspěšně, budeme foldery v accountu listovat
				WMFolders.list({'aid':aIQAttribute['UID']},sDataSet,aDataPath,aHandler);
				return true;
			}
			else
			if(aIQAttribute['TYPE'] == 'result' && typeof aHandler == 'object'){
				executeCallbackFunction(aHandler);
				return true;
			}
			else
			if (aIQAttribute['TYPE'] == 'error' && typeof aHandler == 'object')
				executeCallbackFunction(aHandler,aXMLResponse['IQ'][0]['ERROR'][0]['ATTRIBUTES']['UID'],aXMLResponse['IQ'][0]['ERROR'][0]['VALUE']);
		}
		catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r);}
		return false;

	case 'action':
		executeCallbackFunction(aHandler, aIQAttribute['TYPE'] == 'result', aXMLResponse['IQ'][0]);
	}
};

_me.__mapFolders = function(aFolders){

	if (this.__mapped == sPrimaryAccount) return;

	var test = {},out = {};
	storage.library('gw_others');

	var sTrashFolder = Path.split(GWOthers.getItem('DEFAULT_FOLDERS', 'trash'))[1];
	if (!aFolders[sTrashFolder])
		//test['trash'] = new RegExp('^'+sTrashFolder+'$', "i");
		test['trash'] = sTrashFolder.toLowerCase();

	var sDraftFolder = Path.split(GWOthers.getItem('DEFAULT_FOLDERS', 'drafts'))[1];
	if (!aFolders[sDraftFolder])
		//test['drafts'] = new RegExp('^'+sDraftFolder+'$', "i");
		test['drafts'] = sDraftFolder.toLowerCase();

	var sSentFolder = Path.split(GWOthers.getItem('DEFAULT_FOLDERS', 'sent'))[1];
	if (!aFolders[sSentFolder])
		//test['sent'] = new RegExp('^'+sSentFolder+'$', "i");
		test['sent'] = sSentFolder.toLowerCase();


	for (var itm in aFolders){
		if (aFolders[itm].ARCHIVE)
			dataSet.add('main',['archive_path'],sPrimaryAccount+'/'+itm,true);
		else
		if (aFolders[itm].SPAM)
			dataSet.add('main',['spam_path'],sPrimaryAccount+'/'+itm,true);
		else
		if (aFolders[itm].RESOURCE)
			dataSet.add('main',['resources_path'],itm,true);
		else
		for(var itm2 in test)
			if (itm.toLowerCase() === test[itm2]){
				out[itm2] = sPrimaryAccount+'/'+itm;
				delete test[itm2];
			}


	}

	if (!Is.Empty(out))
		GWOthers.set('DEFAULT_FOLDERS',out,'storage');

	this.__mapped = sPrimaryAccount;
};

_me.__mergeRecent = function(sAccount, aFolders){
	var ds = dataSet.get('folders',[sAccount]);
	if (ds)
		for(var fid in aFolders)
			if (ds[fid] && !Is.Defined(aFolders[fid].RECENT) && ds[fid].RECENT)
				aFolders[fid].RECENT = ds[fid].RECENT;

	return aFolders;
};

//********************************************************************************
//Pomocná funkce realizující převod z "XML" pole do Dataset struktur
//********************************************************************************

_me.parse = function(aData){
	try{
		var aFrame = aData['IQ'][0]['QUERY'][0]['ACCOUNT'],
			aResult= {}, aResultFrame;

		for(var nAccNum in aFrame){
			aResultFrame = {TYPE:'user'};

			for(var sTag in aFrame[nAccNum])
				if (sTag == 'ATTRIBUTES'){
					for(var sAtt in aFrame[nAccNum].ATTRIBUTES){
						if (aFrame[nAccNum].ATTRIBUTES[sAtt] == 'true')
							aResultFrame[sAtt] = 1;
						else
						if (aFrame[nAccNum].ATTRIBUTES[sAtt] == 'false')
							aResultFrame[sAtt] = 0;
						else
							aResultFrame[sAtt] = aFrame[nAccNum].ATTRIBUTES[sAtt];
					}
				}
				else
				if (sTag == 'ACL'){
					    var aRights;
						if (aFrame[nAccNum][sTag][0] && (aRights = aFrame[nAccNum][sTag][0].RIGHT)){
							aResultFrame.ACL = {};
							for(var i in aRights)
								aResultFrame.ACL[aRights[i].ATTRIBUTES.EMAIL] = aRights[i].VALUE?aRights[i].VALUE.split(''):[];
						}
						aRights = null;
				}
				else
					aResultFrame[sTag] = aFrame[nAccNum][sTag][0]['VALUE'];

			//SET GLOBAL ACCOUNT VARIABLES!!
			if (aResultFrame['PRIMARY']){

				aResultFrame.SHARED_PREFIX = (aResultFrame.SHARED_PREFIX || '~').replace(/\\/g,'/');

				dataSet.add('main',['fullname'],aResultFrame['FULLNAME'],true);
				dataSet.add('main',['user'],aResultFrame['USERNAME'],true);
				dataSet.add('main',['account'],aResultFrame['UID'],true);
				dataSet.add('main',['domain'],aResultFrame['UID'].substr(aResultFrame['UID'].indexOf('@')+1),true);
				dataSet.add('main',['message_size'],aResultFrame['MESSAGE_SIZE'],true);
				dataSet.add('main',['keep_deleted_items_force_expiration'],aResultFrame['KEEPDELETEDITEMSFORCEEXPIRATION'],true);
				dataSet.add('main',['device_id'],aResultFrame['DEVICE_ID'],true);
				dataSet.add('main',['server_id'],aResultFrame['ICEWARP_SERVER_ID'],true);

				window.sPrimaryAccount = aFrame[nAccNum]['ATTRIBUTES']['UID'];
				window.sPrimaryAccountTeamchatToken = window.sPrimaryAccountTeamchatToken || false;
				window.sPrimaryAccountType = aResultFrame['TYPE'];
                window.sPrimaryAccountProtocol = aResultFrame['PROTOCOL'];
				window.sPrimaryAccountWebDAV = aFrame[nAccNum]['ATTRIBUTES']['WEBDAV_URL'];
				window.sTeamchatApiUrl = aFrame[nAccNum]['ATTRIBUTES']['TEAMCHATAPI_URL'];
				window.sPrimaryAccountWebAdmin = aFrame[nAccNum]['ATTRIBUTES']['WEBADMIN_URL'];
				window.sPrimaryAccountClient = aFrame[nAccNum]['ATTRIBUTES']['CLIENT_URL'];
				window.sPrimaryAccountGW = aResultFrame['GW'];
				window.sPrimaryAccountGWID = aFrame[nAccNum]['ATTRIBUTES']['GW_OWNERID'];
				window.sPrimaryAccountGWTRASH = aFrame[nAccNum]['ATTRIBUTES']['GWTRASH_SUPPORT'];
				window.sPrimaryAccountIM = aResultFrame['IM_SUPPORT'];
				window.sPrimaryAccountIMHISTORY = aResultFrame['IM_HISTORY_SUPPORT'];
				window.sPrimaryAccountSIP = aResultFrame['SIP_SUPPORT'];
				window.sPrimaryAccount2F = aResultFrame['TWO_FACTOR_SUPPORT'];
				window.sPrimaryAccount2FE = aResultFrame['TWO_FACTOR_ENABLED'];
				window.sPrimaryAccountCHAT = aResultFrame['GROUPCHAT_SUPPORT'];
				window.sPrimaryAccountGUEST = aResultFrame['GUEST_ACCOUNT'];
				window.sPrimaryAccountACTIVESYNC = aResultFrame['ACTIVESYNC_SUPPORT'];
				window.sPrimaryAccountSMS = aResultFrame['SMS_SUPPORT'];
				window.sPrimaryAccountSPREFIX = aResultFrame['SHARED_PREFIX'];
				window.sPrimaryAccountAPREFIX = aResultFrame['ARCHIVE_PERFIX'];
				window.sPrimaryAccountSHARING = aResultFrame['SHARING_SUPPORT'];
				window.sPrimaryAccountDELIVERY = aResultFrame['DELIVERY_SUPPORT'];
				window.sPrimaryAccountRULES = aResultFrame['RULES_SUPPORT'];
				window.sPrimaryAccountCONFERENCE = aResultFrame['MEETING_SUPPORT'];

				window.sPrimaryAccountFULLTEXT = aResultFrame['FULLTEXT_SUPPORT'];

				window.sPrimaryAccountSOCKS = aResultFrame['SOCKS_SUPPORT'];

				window.sPrimaryAccountHTTP = aResultFrame['HTTP_PORT'];
				window.sPrimaryAccountHTTPS = aResultFrame['HTTPS_PORT'];
				window.sPrimaryAccountULIMIT = aResultFrame['UPLOAD_LIMIT']; //in MB
				window.sPrimaryAccountSMTP = aResultFrame['SMTP_HEADER_FUNCTION'];

				window.sPrimaryAccountOLDWC = aResultFrame['OLD_SUPPORT'];

				window.sPrimaryTelemetry = aResultFrame['TELEMETRY_SUPPORT'];
			}

			aResult[aResultFrame['UID']] = aResultFrame;
		}

		return aResult;
	}
	catch(e){
		return false;
	}
};

/////////////////////////////////
var accounts = new wm_accounts();
var WMAccounts = accounts;
