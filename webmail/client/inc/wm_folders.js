function wm_folders(){
	this.xmlns = 'folders';
};

wm_folders.inherit(wm_generic);
var _me = wm_folders.prototype;


wm_folders.aux = {
	sort:function sort(a,b){
		var sA, sB;

		if (Is.String(a['TITLE']))
			sA = a['TITLE'].toLowerCase();
		else
			sA = a['TITLE'];

		if (Is.String(b['TITLE']))
			sB = b['TITLE'].toLowerCase();
		else
			sB = b['TITLE'];

		if (sA>sB) return 1;
		if (sA<sB) return -1;
		return 0;
	}
};

	Object.defineProperty(wm_folders.aux , 'private_owner',{
		get: function(){
			return this.value || (this.value = 'private_' + dataSet.get('main',['domain']) + '@##internalservicedomain.icewarp.com##');
		}
	});

//********************************************************************************
//Základní SET funkce pro pro přidávání a update folderu                    * OK *
//********************************************************************************
//Vstup: aFolderInfo ... asociativní pole klíčů:
//  povinné:   'aid':account_id, 'name':jméno folderu
//  nepovinné: 'fid':folder_id, 'type':typ folderu
//********************************************************************************

_me.add = function(aFolderInfo,sDataSet,aDataPath,aHandler,aErrorHandler)
{

	//Máme definované account_id a jméno folderu?
	if (!aFolderInfo['aid'])
		return false;

	var aRequest;

	//Budeme složku editovat či přidávat?
	if (aFolderInfo['fid']){
		if (!aFolderInfo['default'] && !aFolderInfo['name'] && typeof aFolderInfo['channel'] == 'undefined' && !aFolderInfo['acl'])
	        return false;

		//Vytvoříme XML dotaz pro editaci folderu
		// <ACCOUNT UID='aid'><FOLDER UID='fid' ACTION='edit'><NAME>nové jméno folderu</NAME></FOLDER></ACCOUNT>
		aRequest = {"ACCOUNT":[{"ATTRIBUTES":{"UID":aFolderInfo['aid']},"FOLDER":[{"ATTRIBUTES":{"UID":aFolderInfo['fid'],"ACTION":"edit"}}]}]};
	}
	else{
	    if (!aFolderInfo['name'])
	        return false;

		//V případě zadaného typu folderu ověříme, zdali je podporovaný, jinak ho nastavíme na 'mail'
		if (aFolderInfo['type'] && inArray(['mail','contact','event','journal','note','task','file','m','r','c','e','j','n','t','f','i'],aFolderInfo['type'].toLowerCase()) < 0)
			return false;
		else
		if (!aFolderInfo['type'])
			aFolderInfo['type'] = 'M';

		//Vytvoříme XML dotaz pro přidání folderu
		// <ACCOUNT UID='aid'><FOLDER ACTION='add'><NAME>jméno folderu</NAME><TYPE>typ folderu</TYPE></FOLDER></ACCOUNT>
		aRequest = {"ACCOUNT":[{"ATTRIBUTES":{"UID":aFolderInfo['aid']},"FOLDER":[{"ATTRIBUTES":{"ACTION":"add"},"TYPE":[{"VALUE":aFolderInfo['type']}]}]}]};
	}

	if (aFolderInfo['name'] && aFolderInfo['fid']!=aFolderInfo['name'])
		aRequest.ACCOUNT[0].FOLDER[0].NAME = [{'VALUE':aFolderInfo['name']}];

	if (aFolderInfo['default'])
		aRequest.ACCOUNT[0].FOLDER[0].DEFAULT = [{'VALUE':aFolderInfo['default']}];

	if (aFolderInfo['private'])
		aRequest.ACCOUNT[0].FOLDER[0].PRIVATE = [{'VALUE':aFolderInfo['private']}];

	if (aFolderInfo['clone'])
		aRequest.ACCOUNT[0].FOLDER[0].CLONE = [{'VALUE':aFolderInfo['clone']}];

	//Virtual Folders
	if (aFolderInfo.virtual){

		aRequest.ACCOUNT[0].FOLDER[0].VIRTUAL = [];

		if (aFolderInfo.virtual.sharetype)
			aRequest.ACCOUNT[0].FOLDER[0].VIRTUAL = [{SHARETYPE:[{'VALUE':aFolderInfo.virtual.sharetype}]}];
		else
		if (aFolderInfo.virtual.folders){
			aRequest.ACCOUNT[0].FOLDER[0].VIRTUAL = [{FOLDERS:[{'FOLDER':[]}]}];

			var tmp;
			for(var i in aFolderInfo.virtual.folders){
				tmp = {'VALUE':i};
				if (aFolderInfo.virtual.folders[i])
					tmp.ATTRIBUTES = {'PRIMARY':"true"};

				aRequest.ACCOUNT[0].FOLDER[0].VIRTUAL[0].FOLDERS[0].FOLDER.push(tmp);
			}
		}

		if (typeof aFolderInfo['search'] != 'undefined')
			aRequest.ACCOUNT[0].FOLDER[0].VIRTUAL[0].SEARCH = [{'VALUE':aFolderInfo['search']}];
	}

	if (aFolderInfo['acl']){
		//<right email="{group_email}">{rights}</right>

		var aGrp = [];
		for (var i in aFolderInfo['acl'])
			aGrp.push({VALUE:aFolderInfo['acl'][i].join(''),ATTRIBUTES:{EMAIL:i}});

		if (aGrp.length)
			aRequest.ACCOUNT[0].FOLDER[0].ACL = [{RIGHT:aGrp}];
		else
		    aRequest.ACCOUNT[0].FOLDER[0].ACL = [{VALUE:''}];
	}

	if (Is.Array(aFolderInfo['channel'])){
		aRequest.ACCOUNT[0].FOLDER[0].CHANNELS = [{CHANNEL:[]}];
		for(var i in aFolderInfo['channel'])
			if (aFolderInfo['channel'][i])
				aRequest.ACCOUNT[0].FOLDER[0].CHANNELS[0].CHANNEL.push({"VALUE":aFolderInfo['channel'][i]});
	}

	//Pracujeme synchronně či asynchronně?
	if (sDataSet || aHandler){
		//AJAX...
		this.create_iq(aRequest,[this,'response',['add',sDataSet,aDataPath,aFolderInfo,aHandler,aErrorHandler]],'','set',aFolderInfo['aid']);
		return true;
	}
	else{
		var aResponse = this.create_iq(aRequest,'','','set');

		try{
			if (aResponse['IQ'][0]['ATTRIBUTES']['TYPE'] == 'result')
				return true;
		}
		catch(e){gui._REQUEST_VARS.debug && console.log(this._name||false,e);}

		return false;
	}
};

//********************************************************************************
//Základní GET funkce pro listování folderů                                 * OK *
//********************************************************************************
//Vstup: aFoldersInfo ... asociativní pole klíčů:
//  povinné:   'aid':account_id
//********************************************************************************

_me.list = function(aFoldersInfo,sDataSet,aDataPath,aHandler,aErrorHandler)
{
	//Máme definované account_id?
	if (!aFoldersInfo['aid'])
		return false;

	//Vytvoříme XML dotaz pro listování folderu v accountu
	// <ACCOUNT UID='aid'/>
	var aRequest={"ACCOUNT":[{"ATTRIBUTES":{"UID":aFoldersInfo['aid']}}]};

    if (aFoldersInfo['fid'])
        aRequest.ACCOUNT[0].FOLDER = [{"ATTRIBUTES":{"UID":aFoldersInfo['fid']}}];

	//Pracujeme synchronně či asynchronně?
	if (!sDataSet && !aHandler)
		return this.parse(this.create_iq(aRequest));
	else{
		//AJAX...
		this.create_iq(aRequest,[this,'response',['list',sDataSet,aDataPath,'',aHandler, aErrorHandler]],'','get',aFoldersInfo['aid']);
		return true;
	}
};


/**
 * funkce vraci Typ folderu
 * (nebo False)
 **/
_me.getType = function (aFolderInfo){
    var aid = aFolderInfo.aid || aFolderInfo[0],
    	fid = aFolderInfo.fid || aFolderInfo[1];

	if (aid === sPrimaryAccount && fid === '__@@VIRTUAL@@__/__@@MEETINGS@@__')
		return 'W';
	else
	if (aid === '@@alfresco@@')
		return 'K';

	return dataSet.get('folders',[aid,fid,'TYPE']) || 'X';
};

/**
 * funkce vraci Rights pro folder
 * (Prava na folder samotny)
 *
 		l(folder read)
		k(folder write)
		[m(folder modify)]
		x(folder delete)
		a(admin/owner)

		// Full rights letter list from server

		a: RIGHT_ADMIN

		r: RIGHT_READ
		i: RIGHT_WRITE
		w: RIGHT_MODIFY
		t: RIGHT_DELETE

		l: RIGHT_FOLDER_READ
		k: RIGHT_FOLDER_WRITE
		x: RIGHT_FOLDER_MODIFY & RIGHT_FOLDER_DELETE
 **/
_me.getRights = function (aFolderInfo,isRight){

	var aRights = {},
		aid = aFolderInfo.aid || aFolderInfo[0],
		fid = aFolderInfo.fid || aFolderInfo[1],
		tmp = null;

	if (this.getType(aFolderInfo) == 'Y')
		tmp = dataSet.get('folders',[aid,fid].concat('RIGHTS'));
	else
	if (Cookie)
		tmp = Cookie.get(['rights',aid,fid]);

	if (tmp){
		for (var i in tmp){
			switch(tmp[i]){
				case 'l':
					aRights.read = true;
					break;
				case 'k':
					aRights.write = true;
					break;
				case 'x':
					aRights.modify = true;
					aRights.remove = true;
					break;
				case 'a':
					aRights.owner = true;
					break;
				case 'b':
					aRights.invite = true;
					break;
				case 'c':
					aRights.kick = true;
					break;
				case 'd':
					aRights.edit_folder = true;
					break;
				case 'e':
					aRights.edit_document = true;
					break;
			}
		}
	}
	else
		aRights = {
			owner: true,
			read: true,
			write: true,
			modify: true,
			remove: true
		};

	if (isRight)
		return !!aRights[isRight];

	return aRights;
};
/**
 * funkce vraci Access pro Items ve folderu
        r(items read)
		i(items write)
		w(items modify)
		t(items remove)
 **/
_me.getAccess = function (aFolderInfo,isRight){

	var aRights = {},
		aid = aFolderInfo.aid || aFolderInfo[0],
		fid = aFolderInfo.fid || aFolderInfo[1],
		tmp = null;

	if (this.getType(aFolderInfo) == 'Y')
		tmp = dataSet.get('folders',[aid,fid].concat('RIGHTS'));
	else
	if (Cookie)
		tmp = Cookie.get(['rights',aid,fid]);

	if (tmp){
		for (var i in tmp){
			switch(tmp[i]){
				case 'r':
					aRights.read = true;
					break;
				case 'i':
					aRights.write = true;
					break;
				case 'w':
					aRights.modify = true;
					break;
				case 't':
					aRights.remove = true;
					break;
				case 'e':
					aRights.edit_document = true;
					break;
			}
		}
	}
	else
		aRights = {
			owner: true,
			read: true,
			write: true,
			modify: true,
			remove: true
		};

	if (isRight)
		return !!aRights[isRight];

	return aRights;
};

//********************************************************************************
//Základní SET funkce pro pro mazání folderu                                * OK *
//********************************************************************************
//Vstup: aFolderInfo ... asociativní pole klíčů:
//  povinné:   'aid':account_id, 'fid':folder_id
//********************************************************************************
_me.remove = function(aFolderInfo,sDataSet,aDataPath)
{
	return this.action(aFolderInfo,sDataSet,aDataPath,'delete');
};

//********************************************************************************
//Základní SET funkce pro pro vyprázdnění folderu                           * OK *
//********************************************************************************
//Vstup: aFolderInfo ... asociativní pole klíčů:
//  povinné:   'aid':account_id, 'fid':folder_id
//********************************************************************************

_me.empty = function(aFolderInfo,sDataSet,aDataPath,aDestination,aHandler)
{
	if (!sDataSet){
		if (this.action(aFolderInfo,sDataSet,aDataPath,'empty',aDestination,aHandler)){
			dataSet.add('items',[aFolderInfo['aid'],aFolderInfo['fid']],{});
			return true;
		}
		else
			return false;
	}
	else{
		return this.action(aFolderInfo,sDataSet,aDataPath,'empty',aDestination,aHandler);
	}
};

_me.action = function(aItemInfo,sDataSet,aDataPath,sAction,aDestination,aHandler)
{
	//Máme definovaná account_id a folder_id?
	if (!sAction || !aItemInfo['aid'] || !aItemInfo['fid'])
		return false;

	//Vytvoříme XML dotaz pro vyprázdnění folderu
	// <ACCOUNT UID='aid'><FOLDER UID='fid' ACTION='<sAction>'/></ACCOUNT>
	var aRequest = {"ACCOUNT":[{"ATTRIBUTES":{"UID":aItemInfo['aid']},"FOLDER":[{"ATTRIBUTES":{"UID":aItemInfo['fid'],"ACTION":sAction}}]}]};

	// you can put any simplexml here
	if (aItemInfo.xmlarray)
		for(var i in aItemInfo.xmlarray)
			aRequest.ACCOUNT[0].FOLDER[0][i] = aItemInfo.xmlarray[i];

	// for Empty() (should be changed to xmlarray)
	if (Is.Object(aDestination)){
		aRequest.ACCOUNT[0].FOLDER[0].ACCOUNT = [{"VALUE":aDestination['aid']}];
		aRequest.ACCOUNT[0].FOLDER[0].FOLDER = [{"VALUE":aDestination['fid']}];
	}

	//Pracujeme synchronně či asynchronně?
	if (!sDataSet && !aHandler){
		var aResponse = this.create_iq(aRequest,'','','set');
		if (aResponse['IQ'][0]['ATTRIBUTES']['TYPE'] == 'result')
			return true;

		return false;
	}
	else{
		//AJAX...
		this.create_iq(aRequest,[this,'response',[sAction,sDataSet,aDataPath,{aid:aItemInfo.aid, fid:aItemInfo.fid},aHandler]],'','set',aItemInfo['aid']+'/'+aItemInfo['fid']);
		return true;
	}
};


_me.save_folder = function(aItemsInfo,aHandler)
{
	//Máme definovaná account_id a folder_id?
	if (!aItemsInfo['aid'] || !aItemsInfo['fid'])
		return false;

	var aRequest = {"ACCOUNT":[{"ATTRIBUTES":{"UID":aItemsInfo['aid']},"FOLDER":[{"ATTRIBUTES":{"UID":aItemsInfo['fid'],"ACTION":'save_items'}}]}]};

	this.create_iq(aRequest,[this,'response',['save_folder','','','','',aHandler]],'','set');
	return true;
};

/**
 *
 * @IQ Example: <folder uid="{uid}" action="edit"><subscribed>{0|1}</subscribed></folder>
 **/
_me.subscribe = function(aFolderInfo,sDataSet,aDataPath,bSync, aHandler){
	var sDataSet = sDataSet || 'folders';
	var aRequest = {"ACCOUNT":[{"ATTRIBUTES":{"UID":aFolderInfo['aid']},"FOLDER":[{"ATTRIBUTES":{"UID":aFolderInfo['fid'],"ACTION":"edit"},"SUBSCRIBED":[{"VALUE":bSync?1:0}]}]}]};

	//AJAX...
	var aHandlerOut;
	if (bSync){
		aHandlerOut = [function(bOk, aFolderInfo){
			bOk && this.sync(aFolderInfo, sDataSet, aDataPath, aHandler);
		}.bind(this)];
	}
	else
		aHandlerOut = aHandler;

	this.create_iq(aRequest, [this, 'response', [bSync ? 'sync' : 'unsync', sDataSet, aDataPath, aFolderInfo, aHandlerOut]], '', 'set', aFolderInfo['aid'] + '/' + aFolderInfo['fid']);
	return true;
};

_me.sync = function(aFoldersInfo, sDataSet, aDataPath, aHandler){
	if (!aFoldersInfo.aid)
		return false;

	var aRequest = {
		ACCOUNT: [{
			ATTRIBUTES: {
				UID: aFoldersInfo.aid
			},
			FOLDER: [{
				ATTRIBUTES: {
					ACTION: "sync",
					UID: aFoldersInfo.fid
				}
			}]
		}]
	};
	this.create_iq(aRequest, [WMAccounts, 'response', ['synchronize', sDataSet, aDataPath, aHandler]], '', 'set',aFoldersInfo.aid);
};

_me.markItemsRead = function(aFolderInfo,sDataSet,aDataPath,bRead)
{
	//Máme definovaná account_id a folder_id?
	if (!aFolderInfo['aid'] || !aFolderInfo['fid'])
		return false;

	//Vytvoříme XML dotaz pro výmaz folderu
	// <ACCOUNT UID='aid'><FOLDER UID='fid' ACTION='delete'/></ACCOUNT>
	var sType = bRead ? 'markasread' : 'markasunread';
	var aRequest = {"ACCOUNT":[{"ATTRIBUTES":{"UID":aFolderInfo['aid']},"FOLDER":[{"ATTRIBUTES":{"UID":aFolderInfo['fid'],"ACTION":sType}}]}]};
	aFolderInfo['bRead'] = bRead;

	//Pracujeme synchronně či asynchronně?
	if (!sDataSet){
		var aResponse = this.create_iq(aRequest,'','','set');

		try{
			if (aResponse['IQ'][0]['ATTRIBUTES']['TYPE'] == 'result')
			return true;
		}
		catch(e){gui._REQUEST_VARS.debug && console.log(this._name||false,e);}

		return false;
	}
	else{
		//AJAX...
		this.create_iq(aRequest,[this,'response',['markread',sDataSet,aDataPath,aFolderInfo]],'','set',aFolderInfo['aid']);
		return true;
	}
};

//********************************************************************************
//Pomocná funkce realizující asynchronní obsluhu odpovědi
//********************************************************************************

_me.response = function(aResponse,sMethodName,sDataSet,aDataPath,aFolderInfo,aHandler,aErrorHandler)
{
	var aXMLResponse = aResponse['Array'];
	var aIQAttribute = aXMLResponse['IQ'][0]['ATTRIBUTES'];

	//pri IMAP erroru
	try{
		if (aIQAttribute['TYPE'] == 'error'){

			var str, att;
			try{
				att = aXMLResponse.IQ[0].ERROR[0].ATTRIBUTES.UID;
				str = aXMLResponse.IQ[0].ERROR[0].VALUE;
			}
			catch(e){
				str = att = '';
			}

			if (aErrorHandler){
				executeCallbackFunction(aErrorHandler,aFolderInfo,att,str);
				return;
			}

			switch(att.toLowerCase()){
				case 'teamchat_kick_member':
					gui.notifier._value({type: 'alert', args: {header: 'ALERTS::ALERT', text: 'ALERTS::ALERT', args: [aFolderInfo.name.escapeHTML()]}});
					break;
			case 'imap_internal':
				gui.notifier._value({type: 'alert', args: {header: 'ALERTS::UNDEFINED', text_plain: (aIQAttribute['UID']?aIQAttribute['UID']+"\n":'')+str.unescapeHTML()}});
				break;
			case 'folder_create':
				gui.notifier._value({type: 'alert', args: {header: 'POPUP_FOLDERS::ADD_FOLDER', text: 'ALERTS::CREATE_FOLDER', args: [aFolderInfo.name.escapeHTML()]}});
				break;
			case 'folder_already_exists':
				gui.notifier._value({type: 'alert', args: {header: 'POPUP_FOLDERS::ADD_FOLDER', text: 'ALERTS::FOLDER_EXIST', args: [aFolderInfo.name.escapeHTML()]}});
				break;
			case 'folder_name_bad_char':
			case 'folder_rename':
				gui.notifier._value({type: 'alert', args: {header: 'POPUP_FOLDERS::RENAME_FOLDER', text: 'ALERTS::RENAME_FOLDER', args: [aFolderInfo.fid.escapeHTML(),aFolderInfo.name.escapeHTML()]}});
				break;

			case 'autocreate_folder_name_reserved_word':
				gui.notifier._value({type: 'alert', args: {header: 'POPUP_FOLDERS::ADD_FOLDER', text: 'ALERTS::RESERVED_FOLDER', args: [aFolderInfo.name.escapeHTML()]}});
			}
		}
	}
	catch(e){gui._REQUEST_VARS.debug && console.log(this._name||false,e);}

	switch(sMethodName){
    case 'save_folder':
		if (aIQAttribute['TYPE'] == 'result'){
			var aOut;
			try{
				aOut = {
					'class':aXMLResponse.IQ[0].RESULT[0].ACCOUNT[0].FOLDER[0].ITEM[0].VALUES[0].CLASS[0].VALUE,
					'fullpath':aXMLResponse.IQ[0].RESULT[0].ACCOUNT[0].FOLDER[0].ITEM[0].VALUES[0].FULLPATH[0].VALUE
				};
			}
			catch(e){
				break;
			}

			if (Is.Object(aHandler))
			    executeCallbackFunction(aHandler,aOut);
			else{
				aOut['sid'] = dataSet.get('main', ['sid']);
				downloadItem(buildURL(aOut));
			}
		}

    	break;

    case 'unsync':
	case 'sync':
		if (aIQAttribute['TYPE'] == 'result'){
			dataSet.add('folders', [aFolderInfo['aid'],aFolderInfo['fid'],'SYNC'], sMethodName == 'sync'?1:0);
		}

		if (aHandler)
			executeCallbackFunction(aHandler, aIQAttribute['TYPE'] == 'result', aFolderInfo);

		break;

	case 'add':
		//pri erroru stahnout znova strom
		if (aIQAttribute['TYPE'] == 'error'){
       		try{
				if (aIQAttribute['UID'])
					this.list({'aid':aIQAttribute['UID']},sDataSet,aDataPath);
			}
			catch(e){gui._REQUEST_VARS.debug && console.log(this._name||false,e);}
			return true;
		}
        //acl cookie update
		else{

			//TeamChat folder has different "fid" to name, must be mapped
			if (aFolderInfo.type == 'I' && Is.String(aFolderInfo.name)){
				var tmp = aXMLResponse.IQ[0].QUERY[0].ACCOUNT[0];
				if (Path.basename(aFolderInfo.name) == tmp.FOLDER[0].NAME[0].VALUE)
					aFolderInfo.name = tmp.FOLDER[0].ATTRIBUTES.UID;
			}

			if (Cookie && typeof aFolderInfo.name != 'undefined' && typeof aFolderInfo.aid != 'undefined'){

				/*
				<iq sid="77b529e0d5686f31e84adc6b4d571a2a" uid="admin@merakdemo .com" type="result">
					<query xmlns="webmail:iq:folders">
						<account uid="admin@merakdemo.com">
							<folder uid ="Events" rights="riwtlkxa"/>
						</account>
					</query>
				</iq>
				*/

				try{
	                var tmp = aXMLResponse.IQ[0].QUERY[0].ACCOUNT[0];
	                if (tmp.ATTRIBUTES.UID == aFolderInfo.aid && tmp.FOLDER[0].ATTRIBUTES.UID == aFolderInfo.name)
						Cookie.set(['rights',aFolderInfo.aid,aFolderInfo.name], tmp.FOLDER[0].ATTRIBUTES.RIGHTS?tmp.FOLDER[0].ATTRIBUTES.RIGHTS.split(''):'');
				}
				catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r);}
			}
		}

		//edit
		if	(aFolderInfo['fid'] && ((aFolderInfo['name'] && aFolderInfo['fid'] != aFolderInfo['name']) || typeof aFolderInfo['channel'] != 'undefined') || aFolderInfo['default'])
		{
			var aFolder = aXMLResponse.IQ[0].QUERY[0].ACCOUNT[0].FOLDER[0],
				sName = aFolderInfo['name'] || aFolderInfo['fid'],
				aDataSet = dataSet.get(sDataSet,[aFolderInfo['aid']],true) || {};

			for(var i in aDataSet){
				//folder
				if (i == aFolderInfo['fid']){

					if (aFolder.RELATIVE_PATH)
						aDataSet[i].RELATIVE_PATH = aFolder.RELATIVE_PATH[0].VALUE;

					if (aFolder.OWNER)
						aDataSet[i].OWNER = aFolder.OWNER[0].VALUE;

					if (aFolder.NAME)
						aDataSet[i].NAME = aFolder.NAME[0].VALUE;
					else
						aDataSet[i].NAME = sName.split('/').pop();

					//Teamchat has no subfolders
					if (aDataSet[i].TYPE != 'I'){

						var ds = aDataSet[i];
						delete aDataSet[i];

						//RSS
						if (typeof aFolderInfo['channel']!='undefined')
							ds.CHANNEL = aFolderInfo['channel'];

						var id = aFolder.ATTRIBUTES.UID || sName;
						aDataSet[id] = ds;
					}
				}
				else
				//subfolder
				if (i.indexOf(aFolderInfo['fid']+'/') === 0){
					var ds = aDataSet[i];

					delete aDataSet[i];
					aDataSet[sName + i.substr(aFolderInfo['fid'].length)] = ds;
				}
			}

			if (aFolderInfo['aid'] == sPrimaryAccount && aXMLResponse.IQ[0].QUERY[0].ACCOUNT[0].FOLDER[0].DEFAULT){
				var tmp_type = {C:'CONTACTS',E:'EVENTS',T:'TASKS',N:'NOTES',J:'JOURNAL',F:'FILES',D:'DRAFTS',H:'TRASH',S:'SENT',P:'TEMPLATES'}[aXMLResponse.IQ[0].QUERY[0].ACCOUNT[0].FOLDER[0].DEFAULT[0].VALUE];

				//remove old default
				var def = GWOthers.getItem('DEFAULT_FOLDERS',tmp_type);
				if (def && (def = Path.split(def)) && aDataSet[def[1]])
					delete aDataSet[def[1]].DEFAULT;

				//set new default
				aDataSet[sName].DEFAULT = aXMLResponse.IQ[0].QUERY[0].ACCOUNT[0].FOLDER[0].DEFAULT[0].VALUE;
				GWOthers.setItem('DEFAULT_FOLDERS',tmp_type,aFolderInfo['aid']+'/'+sName);
			}

			var srt = {};
				srt[aFolderInfo['aid']] = aDataSet;

			dataSet.add(sDataSet,[aFolderInfo['aid']], this.sort(srt)[aFolderInfo['aid']], true);
			dataSet.update(sDataSet,[aFolderInfo['aid']]);
		}
		//add
		else
		if (!aFolderInfo['fid'] && aFolderInfo['name']){
			var out = this.parse(aXMLResponse)[aFolderInfo['aid']][aFolderInfo['name']];

			//Remove after fix WC-288
			//out.TYPE = aFolderInfo['type'];

			if (typeof aFolderInfo['channel'] != 'undefined')
	            out.RSS = 'true';

			var srt = {},
				tmp = dataSet.get(sDataSet,[aFolderInfo['aid']],true) || {};
			    tmp[aFolderInfo['name']] = out;
				srt[aFolderInfo['aid']] = tmp;

			//Check for Root of Private I folder
			if (aFolderInfo.type == 'I' && aFolderInfo.private){
				if (!srt[aFolderInfo['aid']][Path.split(aFolderInfo['name']).shift()]){
					srt[aFolderInfo['aid']][Path.split(aFolderInfo['name']).shift()] = {
						SHARED: "true",
						OWNER: wm_folders.aux.private_owner,
						PRIVATE_ROOT: "true",
						SUBSCRIPTION_TYPE: "account",
						TYPE: 'X'
					};
				}

				if (!srt[aFolderInfo['aid']][Path.basedir(aFolderInfo['name'])]){
					srt[aFolderInfo['aid']][Path.basedir(aFolderInfo['name'])] = {
						NAME: getLang('COMMON_FOLDERS::PRIVATE_ROOT'),
						TYPE: 'Y'
					};
				}
			}

			dataSet.add(sDataSet,[aFolderInfo['aid']],this.sort(srt)[aFolderInfo['aid']]);
		}

		if (typeof aHandler == 'object')
			executeCallbackFunction(aHandler,aFolderInfo);

		return false;

	case 'list':

		try{
			if (aIQAttribute['UID']){
				var aData = this.parse(aXMLResponse,true);

				if (aData[sPrimaryAccount])
					WMAccounts.__mapFolders(aData[sPrimaryAccount]);

				if (sDataSet)
					dataSet.add(sDataSet, [aIQAttribute['UID']], WMAccounts.__mergeRecent(aIQAttribute['UID'], aData[aIQAttribute['UID']]));

				if (typeof aHandler == 'object')
					executeCallbackFunction(aHandler, aData);

				return true;
			}
		}
		catch(e){gui._REQUEST_VARS.debug && console.log(this._name||false,e);}

		return false;

	case 'delete':
		try{
			if (aIQAttribute['TYPE'] != 'result' && aIQAttribute['UID']){
				this.list({'aid':aIQAttribute['UID']},sDataSet,aDataPath);
				return true;
			}
		}
		catch(e){gui._REQUEST_VARS.debug && console.log(this._name||false,e);}

		//ASYNC DataSet change
		var blank = true;
		var bPerfm = false;
		var aDataSet = dataSet.get(sDataSet,[aFolderInfo['aid']]);

		for(var i in aDataSet){
			if (i == aFolderInfo['fid'] || i.indexOf(aFolderInfo['fid']+'/') === 0){
				bPerfm = true;
				delete aDataSet[i];
			}
			else
				blank = false;
		}

		//	bNoRefresh = true protoze pracujeme primo s datasetem, proto po add neni zmena dat (add je jen pro sychr)
		//	Nutne vyvolat refresh manualne
		if (blank && aFolderInfo['aid'] == sPrimaryAccount+'_rss'){
			dataSet.remove('accounts',[aFolderInfo['aid']],true);
			dataSet.remove(sDataSet,[aFolderInfo['aid']]);
		}
		else
		if(bPerfm){
			dataSet.add(sDataSet,[aFolderInfo['aid']],aDataSet,true);
			dataSet.update(sDataSet,[aFolderInfo['aid']]);
		}

		return false;

	case 'empty':
		try{
			if (aIQAttribute['TYPE'] != 'result' && aIQAttribute['UID']) {
				var aFolder = Path.split(aIQAttribute['UID']);
				this.list({'aid':aFolder[0]},sDataSet,aDataPath);

				// je potreba znovu vylistovat otevreny folder?
				var aItems = dataSet.get('items');
				for(var sAccId in aItems)
					for(var sFolId in aItems[sAccId]);
						if (sAccId == aFolder[0] && sFolId == aFolder[1])
							WMItems.list({'aid':sAccId,'fid':sFolId,'values':items.default_values('M')},'items');

				return true;
			}
			else
			if (aIQAttribute['UID']){
				var aFolder = Path.split(aIQAttribute['UID']);

				// je potreba promazat Items?
				var aItems = dataSet.get('items');
				for(var sAccId in aItems)
					for(var sFolId in aItems[sAccId]);
						if (sAccId == aFolder[0] && sFolId == aFolder[1])
							dataSet.add('items',[aFolder[0],aFolder[1]],{});
			}
		}
		catch(e){gui._REQUEST_VARS.debug && console.log(this._name||false,e);}

		//ASYNC DataSet change
		if (dataSet.get(sDataSet,[aFolderInfo['aid'],aFolderInfo['fid'],'RECENT'])>0)
			dataSet.add(sDataSet,[aFolderInfo['aid'],aFolderInfo['fid'],'RECENT'],'0');

		if (typeof aHandler == 'object')
			executeCallbackFunction(aHandler, aIQAttribute['TYPE'] == 'result', aFolderInfo);

		return false;

	case 'copyall':
	case 'moveall':
		if (aFolderInfo['aid']){
			// aktualizuj Folders
			this.list({'aid':aFolderInfo['aid']},sDataSet,aDataPath);

			// aktualizuj Items
			if (gui.frm_main.main && gui.frm_main.main.list)
				gui.frm_main.main.list._serverSort();
		}
		break;

	case 'markread':
		if (aIQAttribute['TYPE'] == 'error')
			return true;

		// refresh folder list
		if (aFolderInfo.bRead){
			if (dataSet.get(sDataSet,[aFolderInfo['aid'],aFolderInfo['fid'],'RECENT'])>0)
				dataSet.add(sDataSet,[aFolderInfo['aid'],aFolderInfo['fid'],'RECENT'],'0');
		}
		else {
			var nCount = 0;
			if (Is.Defined(aXMLResponse['IQ'][0]['QUERY'][0]['RECENT'])) {
				nCount = parseInt(aXMLResponse['IQ'][0]['QUERY'][0]['RECENT']);
				if (!Is.Number(nCount))
					nCount = 0;
			}

			var i = dataSet.get(sDataSet,[aFolderInfo['aid'],aFolderInfo['fid'],'RECENT']);
				i = i>0?i:0;

			if (i != nCount)
				dataSet.add(sDataSet,[aFolderInfo['aid'],aFolderInfo['fid'],'RECENT'],nCount.toString());
		}

		// je potreba aktualizovat Items?
		var aItems = dataSet.get('items');
		for(var sAccId in aItems)
			for(var sFolId in aItems[sAccId]);
				if (sAccId == aFolderInfo['aid'] && sFolId == aFolderInfo['fid'])
					gui.frm_main.main.list._serverSort();

		return true;

	default:
		if (typeof aHandler == 'object')
			executeCallbackFunction(aHandler, aIQAttribute['TYPE'] == 'result', aFolderInfo);
	}
};

/**
 * Pomocná funkce realizující abecední seřazení folderů
 *
 * @param:  aFolders - array of folders
 *          bRights  - apply rights (TRUE only if aFolders are fresh data from server!!)
 **/
_me.sort = function(aFolders)
{
	//Rozdělíme foldery mezi Inbox, IMAP a GW
	var aResult = {},
		aResultFolFrame,aFolder,aFolderSplit,
		aSortInbox, aSortDefault, aSortGWDefault, aSortOthers, aSortShared,
		aCommon = getLang('COMMON_FOLDERS'); // //get common folders from langs

	var fld;

	for(var sAccId in aFolders){
		//Seřazovací pole nulujeme
		aSortInbox = [];
		aSortDefault = [];
		aSortGWDefault = [];
		aSortOthers = [];
		aSortShared = [];

		//Roztřídění folderů podle typu
		for(var sFolId in aFolders[sAccId]){

			//GW TRASH
			if (sFolId == '__@@GWTRASH@@__'){
				aFolders[sAccId][sFolId]['NAME'] = aCommon['GW-TRASH'];
				aSortOthers.push({'FOLDER':sFolId,'TITLE':aCommon['GW-TRASH']});
				continue;
			}

			aFolderSplit = sFolId.split('/');

			//INBOX
			if (aFolderSplit[0] == 'INBOX'){
				if (aFolderSplit[0] == sFolId)
					aFolders[sAccId][sFolId]['NAME'] = aCommon['INBOX'];

				aFolderSplit[0] = aCommon['INBOX'];
				aSortInbox.push({'FOLDER':sFolId,'TITLE':aFolderSplit.join('/')});
			}
			else
			//VIRTUAL FOLDERS
			if (aFolderSplit[0] == '__@@VIRTUAL@@__'){
				if (aFolderSplit[0] == sFolId)
					aFolders[sAccId][sFolId]['NAME'] = aCommon['VIRTUAL-FOLDERS'];
				else
				if (aFolderSplit[1] == '__@@EVENTS@@__')
					aFolders[sAccId][sFolId]['NAME'] = aCommon['CALENDARS'];

				aFolderSplit[0] = aCommon['VIRTUAL-FOLDERS'];
				aSortOthers.push({'FOLDER':sFolId,'TITLE':aFolderSplit.join('/')});
			}
			else
			if (aFolderSplit[0] == 'SPAM_QUEUE'){
				if (aFolderSplit[1])
					aFolders[sAccId][sFolId]['NAME'] = aCommon['SPAM_QUEUE-'+ aFolderSplit[1].toUpperCase()];

				aSortOthers.push({'FOLDER':sFolId,'TITLE':sFolId});
			}
			else
			if (aFolderSplit[0] == 'Quarantine' && aFolders[sAccId][sFolId].TYPE == 'Q'){
				aFolders[sAccId][sFolId]['NAME'] = aCommon['QUARANTINE'];
				aSortOthers.push({'FOLDER':sFolId,'TITLE':sFolId});
			}
			//SHARED & PUBLIC & OTHER FOLDERS
			else{

				if (aFolders[sAccId][sFolId].PRIVATE_ROOT) {
					aFolders[sAccId][sFolId].TYPE = 'Y';
				}
				
				var sort = '';
				if (aFolders[sAccId][sFolId].TYPE == 'I'){

					//Add missing Y folder
					if ((fld = Path.basedir(sFolId)) && !aFolders[sAccId][fld]){

						var val = {
							TYPE:'Y'
						};

						if (aFolders[sAccId][sFolId].OWNER == wm_folders.aux.private_owner){
							val.NAME = aCommon['PRIVATE_ROOT'];
							sort = '*'; //Private room is always on top
						}
						else
						if (aFolders[sAccId][sFolId].OWNER && ~aFolders[sAccId][sFolId].OWNER.indexOf('@##internalservicedomain.icewarp.com##')){
							val.NAME = getLang('COMMON_FOLDERS::PRIVATE_ROOT_EXT',[sFolId.split('/')[0]]);
							sort = '*'+fld;
						}

						aFolders[sAccId][fld] = val;
						aSortOthers.push({'FOLDER':fld,'TITLE':sort || fld});
						sort = '';
					}

					//Sort string for TCH folders
					if (aFolders[sAccId][sFolId].NAME)
						sort = sFolId.substr(0, sFolId.lastIndexOf('/')+1) + aFolders[sAccId][sFolId].NAME;

					if (aFolders[sAccId][sFolId].OWNER && ~aFolders[sAccId][sFolId].OWNER.indexOf('@##internalservicedomain.icewarp.com##'))
					 	sort = '*'+ (sort || sFolId);
				}

				if (sFolId.indexOf(sPrimaryAccountSPREFIX)==0 && sFolId.indexOf('@')>0){
					aSortShared.push({'FOLDER':sFolId,'TITLE':aFolders[sAccId][sFolId].SORT || sFolId});

					//Tranclate shared Inbox
					if (aFolders[sAccId][sFolId].TYPE=='M' && aFolderSplit[aFolderSplit.length-1] == 'INBOX' && (aFolderSplit[aFolderSplit.length-2] || '').indexOf('@')>-1)
						aFolders[sAccId][sFolId].NAME = aCommon['INBOX'];
					else
					if (!aFolderSplit[1])
						aFolders[sAccId][sFolId].NAME = sFolId.substr(sPrimaryAccountSPREFIX.length);
				}
				else
				if (aFolders[sAccId][sFolId].TYPE == 'M' && (aFolders[sAccId][sFolId].DEFAULT || aFolders[sAccId][sFolId].SPAM)){
					aSortDefault.push({'FOLDER':sFolId,'TITLE':sFolId});
				}
				else
				if (aFolders[sAccId][sFolId].DEFAULT){
					aSortGWDefault.push({'FOLDER':sFolId,'TITLE':sFolId});
				}
				else{
					aSortOthers.push({'FOLDER':sFolId,'TITLE':sort || sFolId});

					// Translate public Inbox
					if (aFolders[sAccId][aFolderSplit[0]] && aFolders[sAccId][aFolderSplit[0]].PUBLIC && aFolderSplit[1] == 'INBOX' && aFolders[sAccId][sFolId].TYPE=='M' && !aFolderSplit[2])
						aFolders[sAccId][sFolId].NAME = aCommon['INBOX'];
				}
			}
		}

		//Rozdělené foldery setřídíme
		aSortInbox.sort(wm_folders.aux.sort);
		aSortDefault.sort(wm_folders.aux.sort);
		aSortGWDefault.sort(wm_folders.aux.sort);
		aSortOthers.sort(wm_folders.aux.sort);
		aSortShared.sort(wm_folders.aux.sort);

		//Add missing folders (in case of shared subfolders)
		var fld,tmp;
		for (var i = 0; i<aSortShared.length; i++){
			if (aSortShared[i].FOLDER.indexOf('/')>-1){
				fld = aSortShared[i].FOLDER.split('/'),
				tmp = '', k = 0;

				for(var j=0;j<=fld.length;j++){
					fld.pop();
					tmp = fld.join('/');

					if (tmp == '' || (aSortShared[i-1] && aSortShared[i-1].FOLDER == tmp))
						break;

					aSortShared.splice(i,0,{FOLDER:tmp});

					k++;
				}

				i+=k;
			}
		}


		//Vytvoření seřazených folderů v rámci accountu
		aResultFolFrame = {};

		// INBOX
		for(var n in aSortInbox){
			aFolder = aFolders[sAccId][aSortInbox[n]['FOLDER']];
			aResultFolFrame[aSortInbox[n]['FOLDER']] = {};
			for(var sItem in aFolder)
				aResultFolFrame[aSortInbox[n]['FOLDER']][sItem] = aFolder[sItem];
		}
		// Default Mail
		for(var n in aSortDefault){
			aFolder = aFolders[sAccId][aSortDefault[n]['FOLDER']];
			aResultFolFrame[aSortDefault[n]['FOLDER']] = {};
			for(var sItem in aFolder)
				aResultFolFrame[aSortDefault[n]['FOLDER']][sItem] = aFolder[sItem];
		}
		// Default GW
		for(var n in aSortGWDefault){
			aFolder = aFolders[sAccId][aSortGWDefault[n]['FOLDER']];
			aResultFolFrame[aSortGWDefault[n]['FOLDER']] = {};
			for(var sItem in aFolder)
				aResultFolFrame[aSortGWDefault[n]['FOLDER']][sItem] = aFolder[sItem];
		}

		// Rest...
		for(var n in aSortOthers){
			aFolder = aFolders[sAccId][aSortOthers[n]['FOLDER']];

			if (!aFolder && aSortOthers[n]['VALUES'])
				aResultFolFrame[aSortOthers[n]['FOLDER']] = aSortOthers[n]['VALUES'];
			else{
				aResultFolFrame[aSortOthers[n]['FOLDER']] = {};
				for(var sItem in aFolder)
					aResultFolFrame[aSortOthers[n]['FOLDER']][sItem] = aFolder[sItem];
			}
		}

		for(var n in aSortShared){

			aFolder = aFolders[sAccId][aSortShared[n]['FOLDER']];

			if (!aFolder && aSortShared[n].FOLDER.indexOf(sPrimaryAccountSPREFIX)==0 && aSortShared[n].FOLDER.indexOf('@')>0){
				if (aSortShared[n].FOLDER.substr(sPrimaryAccountSPREFIX.length).indexOf('/')<1)
					aResultFolFrame[aSortShared[n]['FOLDER']] = {TYPE:'VA',NAME:aSortShared[n]['FOLDER'].substr(sPrimaryAccountSPREFIX.length)};
				else
					aResultFolFrame[aSortShared[n]['FOLDER']] = {};
			}
			else
			if (aFolder && aFolder.SHARED)
				aResultFolFrame[aSortShared[n]['FOLDER']] = {TYPE:'VA'};
			else
				aResultFolFrame[aSortShared[n]['FOLDER']] = {};

			for(var sItem in aFolder)
				if (!aResultFolFrame[aSortShared[n]['FOLDER']][sItem])
					aResultFolFrame[aSortShared[n]['FOLDER']][sItem] = aFolder[sItem];
		}

		aResult[sAccId] = aResultFolFrame;
	}

	return aResult;
};

//********************************************************************************
//Pomocná funkce realizující převod z "XML" pole do Dataset struktur        * OK *
//********************************************************************************

_me.parse = function(aData, bNoChatSync)
{
	try
	{
		var aAccFrame = aData['IQ'][0]['QUERY'][0]['ACCOUNT'][0],
			sAccId = aAccFrame['ATTRIBUTES']['UID'],
			aFolFrame = aAccFrame['FOLDER'],
			sFolId,
			aResult = {},
			aResultAccFrame = {},
			aResultFolFrame,
			aRights;

		//Map GW folders
		var aTmp = {C:'CONTACTS',E:'EVENTS',T:'TASKS',N:'NOTES',J:'JOURNAL',F:'FILES',
					D:'DRAFTS',H:'TRASH',S:'SENT'},
			sFolderType = '';

		/*
		//Add hidden __@EVENTS@__ folder for merged calendars
		if (sPrimaryAccountGW)
			aFolFrame.push({TYPE:[{VALUE:'E'}],RIGHTS:[{VALUE:'riwtlkxa'}],ATTRIBUTES:{UID:'__@EVENTS@__'}});
		*/
		for(var nFolNum in aFolFrame){
			aResultFolFrame = {};
            sFolId = aFolFrame[nFolNum]['ATTRIBUTES']['UID'];

			for(var sItem in aFolFrame[nFolNum])
                if (sItem == 'CHANNELS'){
					if (aFolFrame[nFolNum][sItem][0] && aFolFrame[nFolNum][sItem][0].CHANNEL){
						aResultFolFrame[sItem] = [];
                        aRights = aFolFrame[nFolNum][sItem][0].CHANNEL;
						for(var i in aRights)
							if (aRights[i].VALUE)
								aResultFolFrame[sItem].push(aRights[i].VALUE);
					}
				}
				else
				if (sItem == 'ACL'){
					if (aFolFrame[nFolNum][sItem][0] && aFolFrame[nFolNum][sItem][0].RIGHT){
						aResultFolFrame[sItem] = {};
                        aRights = aFolFrame[nFolNum][sItem][0].RIGHT;
						for(var i in aRights)
							aResultFolFrame[sItem][aRights[i].ATTRIBUTES.EMAIL] = aRights[i].VALUE?aRights[i].VALUE.split(''):[];
					}

					acl = true;
                }
				else
				/*
				//uz je prepsano do attributu
				if (sItem == 'RIGHTS'){
					//Update RIGHTS in cookie     - is updated in Items and ACL response only!
					if (typeof Cookie == 'object'){
					    var sRights = aFolFrame[nFolNum][sItem][0]['VALUE'];
						Cookie.set(['rights',sAccId,sFolId], sRights?sRights.split(''):'');
					}
				}
				else
				*/
				//&& !aFld[aFolFrame[nFolNum].TYPE[0].VALUE] && aFolFrame[nFolNum].ATTRIBUTES.UID.indexOf('/')<0 &&
				if (sItem == 'DEFAULT' && sAccId == sPrimaryAccount && aFolFrame[nFolNum].ATTRIBUTES.UID.indexOf(sPrimaryAccountSPREFIX)!==0){
					sFolderType = aFolFrame[nFolNum].TYPE[0].VALUE;
					if (sFolderType == 'M')
                        sFolderType = aFolFrame[nFolNum][sItem][0].VALUE;

					GWOthers.setItem('DEFAULT_FOLDERS',aTmp[sFolderType],sPrimaryAccount+'/'+aFolFrame[nFolNum].ATTRIBUTES.UID);

					aResultFolFrame[sItem] = aFolFrame[nFolNum][sItem][0]['VALUE'];
				}
                else
                if ((sItem == 'VIRTUAL' && sAccId == sPrimaryAccount) || sItem == 'SUBFOLDERS'){
                    aResultFolFrame[sItem] = {};

					if (aFolFrame[nFolNum][sItem][0].FOLDERS && aFolFrame[nFolNum][sItem][0].FOLDERS[0].FOLDER){
	                    aResultFolFrame[sItem].FOLDERS = {};
						var aFolers = aFolFrame[nFolNum][sItem][0].FOLDERS[0].FOLDER;
						for(var i in aFolers)
							if (!aFolers[i].ATTRIBUTES || !aFolers[i].ATTRIBUTES.NOEXIST)
								aResultFolFrame[sItem].FOLDERS[aFolers[i].VALUE] = aFolers[i].ATTRIBUTES && aFolers[i].ATTRIBUTES.PRIMARY?true:false;
					}
					else
					if (aFolFrame[nFolNum][sItem][0].SHARETYPE)
						aResultFolFrame[sItem].SHARETYPE = aFolFrame[nFolNum][sItem][0].SHARETYPE[0].VALUE;

					if (aFolFrame[nFolNum][sItem][0].SEARCH)
                    	aResultFolFrame[sItem].SEARCH = aFolFrame[nFolNum][sItem][0].SEARCH[0].VALUE;
				}
				else
				if (sItem != 'ATTRIBUTES')
					aResultFolFrame[sItem] = aFolFrame[nFolNum][sItem][0]['VALUE'];

			aResultAccFrame[sFolId] = aResultFolFrame;
		}
		aResult[sAccId] = aResultAccFrame;

		return aFolFrame ? this.sort(aResult) : {};
	}
	catch(e){
		return false;
	}
};

// TODO move this function somewhere else
_me.__emptyFolder = function(sAccId, sFolId, bMoveToTrash, sSQLsearch)
{
	var aTrashFolder, aHandler;

	if (this.getType([sAccId,sFolId]) === 'M'){

		storage.library('gw_others');

		var aFolData = clone(dataSet.get('folders', [sAccId,sFolId]), true),
			aTrash = Path.split(GWOthers.getItem('DEFAULT_FOLDERS', 'trash'));
			aTrash = {'aid':aTrash[0],'fid':aTrash[1]};

		//Move to trash & update RECENT
		if (bMoveToTrash) {

			var aDestData = dataSet.get('folders', [aTrash.aid,aTrash.fid], true);

			if (Is.Defined(aDestData) && Is.Defined(aFolData)) {
				var iRec = parseInt(aFolData['RECENT'] || 0) + parseInt(aDestData['RECENT'] || 0),
					iOld = parseInt(dataSet.get('folders', [aTrash.aid,aTrash.fid,'RECENT']) || 0);

				if (iRec != iOld)
					dataSet.add('folders', [aTrash.aid,aTrash.fid,'RECENT'], iRec.toString());
			}

			aTrashFolder = aTrash;
		}
		else
		// refreh folders on empty Trash
		if (aTrash.aid === sAccId && aTrash.fid === sFolId)
			aHandler = [function(bOK){
				if (bOK)
					WMAccounts.refresh({aid:aTrash.aid}, 'folders');
			}];

		// clear recent
		if (dataSet.get('folders',[sAccId,sFolId,'RECENT'])>0)
			dataSet.add('folders',[sAccId,sFolId,'RECENT'],'0');

		// remove mailview if in the same folder
		var aMView = dataSet.get('preview');
		if (typeof aMView == 'object'){
			for(var mwa in aMView)
				for(var mwf in aMView[mwa]);

			if (mwa == sAccId && mwf == sFolId)
				dataSet.remove('preview');
		}
	}

	this.empty({
		aid: sAccId,
		fid: sFolId,
		xmlarray: sSQLsearch && { SEARCH: [{ VALUE: sSQLsearch }] }
	},'folders','',aTrashFolder, aHandler);
};

_me.toTree = function(flat_list){
	var folders = {};
	flat_list.forEach(function (folder) {
		folder.split('/').reduce(function (previous, current) {
			var name = previous + (previous ? '/' : '') + current;
			if (!folders[name]) {
				var folder_data = dataSet.get('folders', [sPrimaryAccount, name]);
				if (folder_data)
					folders[name] = {
						full_path: name,
						name: current,
						children: [],
						type: folder_data.TYPE,
						owner: folder_data.OWNER,
						public: folder_data.PUBLIC,
						recent: folder_data.RECENT || 0,
						rights: folder_data.RIGHTS
					};
			}
			if (previous && !~folders[previous].children.indexOf(folders[name])) {
				folders[previous].children.push(folders[name]);
			}
			return name;
		}, '');
	});
	return folders;
};

_me.getUnsubscribedChatFolders = function () {
	var folders, unsubscribed;
	unsubscribed =  (Object.keys(folders = dataSet.get('folders', [sPrimaryAccount]))).filter(function (name) {
		return folders[name].TYPE === 'I' && (!folders[name].SYNC || folders[name].SYNC === '0');
	});
	dataSet.add('unsubscribed_rooms_count', false, unsubscribed.length);
	return unsubscribed;
};

///////////////////////////////
WMFolders = new wm_folders();
