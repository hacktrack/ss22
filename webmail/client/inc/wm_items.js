function wm_items(){
	this.xmlns = 'items';

	this.__clientID = function(id){
		return '*'+id.replace(/^\*/, '');
	};

	this.__serverID = function(id){
		return id.indexOf('*')>-1?id.replace('*',''):id;
	};

	this.__defaultValues = {
		'C':['ITMCLASSIFYAS','ITMTITLE','ITMFIRSTNAME','ITMMIDDLENAME','ITMSURNAME','ITMCLASS','ITMSUFFIX','ITMCOMPANY','ITMDEPARTMENT','LCTEMAIL1','LCTEMAIL2','LCTEMAIL3','LCTIM','ITMCATEGORY','LCTPHNWORK1','LCTPHNFAXWORK','LCTPHNHOME1','LCTPHNMOBILE'],
		'E':['EVNTITLE','EVNLOCATION','EVNSTARTDATE','EVNSTARTTIME','EVNENDDATE','EVNENDTIME','OSD','EVNOWN_ID','EVNRCR_ID','EVNGRP_ID','RMNEVN_ID','EVNTYPE','EVNCLASS','EVNFOLDER','EVNFLAGS','EVNMEETINGID','EVNSHARETYPE'],
		'EI':['EVNTITLE','EVNLOCATION','EVNSTARTDATE','EVNSTARTTIME','EVNENDDATE','EVNENDTIME','OSD','OED','EVNOWN_ID','EVNRCR_ID','EVNGRP_ID','RMNEVN_ID','EVNTIMEFORMAT','EVNTYPE','EVNCLASS','EVNFOLDER','EVNMEETINGID','EVNFLAGS','EVNSHARETYPE'],
		'J':['EVNTITLE','EVNLOCATION','EVNSTARTDATE','EVNSTARTTIME','EVNENDDATE','EVNENDTIME','EVNCONTACT','EVNTYPE'],
		'F':['EVNTITLE','EVNDESCFORMAT','EVNNOTE','EVNLOCATION','EVN_MODIFIED','EVNTYPE','EVNCOMPLETE','EVNLOCKOWN_ID'],
		'R':['SUBJECT','TO','FROM','DATE','SIZE','FLAGS','HAS_ATTACHMENT','COLOR','PRIORITY','SMIME_STATUS'],
		'M':['SUBJECT','TO','SMS','FROM','DATE','SIZE','FLAGS','HAS_ATTACHMENT','COLOR','PRIORITY','SMIME_STATUS','ITEM_MOVED', 'TAGS'],
		'T':['EVNTITLE','EVNSTATUS','EVNSTARTDATE','EVNENDDATE','EVNRCR_ID','RMNEVN_ID','EVNTYPE','EVNPRIORITY','EVNCOMPLETE'],
		'N':['EVNTITLE','EVNTYPE','EVN_MODIFIED'],
		'Q':['SNDEMAIL','SNDSUBJECT','QDATE','SNDOWNER','SNDDOMAIN'],
		'QL':['SNDEMAIL','SNDOWNER','SNDDOMAIN','QDATE'],
		'G':['ITM_ID','ITMTITLE','ITMDESCRIPTION','ITMCLASS','ITM_DELETED','ITMORIGINALFOLDER'],
		'I':['EVNTITLE','EVNDESCRIPTION']
	};
};

wm_items.inherit(wm_generic);
var _me = wm_items.prototype;

_me.__lastListId = {};

/**
 * Basic Action method
 * Used for: subscribe, setwipe, resetwipe
 **/
_me.action = function(aItemInfo,sAction,aHandler){

	var aIn,aValues,aRequest = {"ACCOUNT":[{"ATTRIBUTES":{"UID":aItemInfo['aid']},"FOLDER":[{"ATTRIBUTES":{"UID":aItemInfo['fid']},"ITEM":[]}]}]};

	//Prepare Item/values
	if (aItemInfo.values){
		aValues = {};
		for(var i in aItemInfo.values){
			if (!Is.Array(aValues[i]))
				aValues[i] = [{VALUE:aItemInfo.values[i]}];
		}
	}

	//Prepare Item
	if (!Is.Array(aItemInfo['iid']))
		aItemInfo['iid'] = [aItemInfo['iid']];

	for(var i in aItemInfo['iid']){
		aIn = {"ATTRIBUTES":{"UID":this.__serverID(aItemInfo['iid'][i]),"ACTION":sAction}};

		if (aValues)
			aIn.VALUES = [aValues];

		if (aItemInfo.attrs){
			attrs = {};
			for(var i in aItemInfo.attrs){
				aIn[i] = [{VALUE:aItemInfo.attrs[i]}];
			}
		}

		//insert Item nodes
		if (aItemInfo.nodes){
			for(n in aItemInfo.nodes){
				if (aItemInfo.nodes.hasOwnProperty(n))
					aIn[n.toUpperCase()] = [{VALUE:aItemInfo.nodes[n]}];
			}
		}

		aRequest.ACCOUNT[0].FOLDER[0].ITEM.push(aIn);
	}


	//Pracujeme synchronně či asynchronně?
	if (!aHandler){
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
		this.create_iq(aRequest,[this,'response',['action','','','','',aHandler]],'','set');
		return true;
	}
};

//********************************************************************************
//Základní SET funkce pro pro přidávání a update položek
//********************************************************************************
// Vstup:
// id	[aid, fid(, iid)]
//		povinné:   aid: account_id, fid: folder_id
//		nepovinné: iid: item_id (není-li zadané, položka se přidá, jinak se edituje)
//********************************************************************************
_me.add = function(id,aItemInfo,sDataSet,aDataPath,sFolderDataSet,aHandler,bAuto)
{

	//Pomocná rekurzivní funkce
	function parse_addons(sAddOns,aFrom,aTo){
		if (typeof aFrom == 'object'){
			var aFrame = aTo[sAddOns] = [{}];
			var sAddOn = sAddOns.substr(0,sAddOns.length-1);
			aFrame = aFrame[0][sAddOn] = [{}];
			var aValues,n;
		}
		n = 0;
		for(var sId in aFrom){
			aFrame[n] = {};

			for(var sValues in aFrom[sId]){
				aValues = aFrom[sId][sValues];

				if (sValues == 'uid')
					aFrame[n]['ATTRIBUTES'] = {'UID':aValues};
				else
				if (sValues == 'values'){
					aValuesFrame = aFrame[n]['VALUES'] = [{}];
					parse_values(aValues,aValuesFrame[0]);
				}
				else
					parse_addons(sValues,aValues,aFrame[n]);
			}
			n++;
		}
	};

	function parse_values(aFrom,aTo){
		for(var sValue in aFrom)
			if (Is.Array(aFrom[sValue]))
				aTo[sValue] = [{'VALUE':aFrom[sValue].pop()}];
			else
				aTo[sValue] = [{'VALUE':aFrom[sValue]}];
	};

	//Máme definovaná account_id a folder_id?
	if (!id[0] || !id[1])
		return false;

	//Chceme aktualizovat datasety při změně flags?
	if (id[2] && aItemInfo['values'] && (typeof aItemInfo['values']['flags'] != 'undefined') && sDataSet){
		var nFlag = aItemInfo['values']['flags'];
		dataSet.add(sDataSet,id.concat(['FLAGS']),nFlag);

		if (sFolderDataSet){
			var nRecent = dataSet.get(sFolderDataSet,[id[0],id[1],'RECENT']);
			if (typeof nRecent == 'undefined')
				nRecent = 0;

			if (this.hasFlag(nFlag,'SEEN')){
				if (nRecent)
					nRecent--;
			}
			else
				nRecent++;

			if (parseInt(dataSet.get(sFolderDataSet,[id[0],id[1],'RECENT']) || 0) != nRecent)
				dataSet.add(sFolderDataSet,[id[0],id[1],'RECENT'],nRecent.toString());
		}
	}

	//Vytvoříme základní strukturu XML dotazu
	var aRequest = {"ACCOUNT":[{"ATTRIBUTES":{"UID":id[0]},"FOLDER":[{"ATTRIBUTES":{"UID":id[1]},"ITEM":[]}]}]},
		ids,aFrame;

	if (!id[2])
		ids = [''];
	else
	if (Is.Array(id[2]))
    	ids = id[2];
	else
		ids = [id[2]];

	for(var i = 0; i<ids.length; i++){
		if (ids[i])
			aFrame = {ATTRIBUTES:{ACTION:'edit',UID:this.__serverID(ids[i])},VALUES:[{}]};
		else
			aFrame = {ATTRIBUTES:{ACTION:'add'},VALUES:[{}]};

		for(var sValues in aItemInfo)
			if (sValues != 'aid' && sValues != 'fid' && sValues != 'iid')
				switch(sValues){
					case 'values':
						parse_values(aItemInfo['values'],aFrame['VALUES'][0]);
						break;

					//Duplicity handling
					case 'replace':
						aFrame.ATTRIBUTES.DUPLICITY = 'replace';
						break;
					case 'duplicity':
						aFrame.ATTRIBUTES.DUPLICITY = aItemInfo[sValues];
						break;

					default:
						parse_addons(sValues,aItemInfo[sValues],aFrame);
				}

		// Mark autosave requests to avoid triggers on server
		if(bAuto && aFrame['VALUES'])
			aFrame['VALUES'][0]['AUTO_SAVE'] = [{VALUE:1}];

		//ClientTimeZone
		if (aFrame['VALUES']) {
			aFrame['VALUES'][0]['CTZ'] = [{VALUE: new IcewarpDate().utcOffset()}];
		}

		aRequest["ACCOUNT"][0]["FOLDER"][0]["ITEM"].push(aFrame);
	}

	//Pracujeme synchronně či asynchronně?
	if (!sDataSet && !aHandler)
		return this.parse(this.create_iq(aRequest,'','','set'));
	else{
		//AJAX...
		this.create_iq(aRequest,[this,'response',['add',sDataSet,aDataPath,sFolderDataSet,{'aid':id[0]},aHandler,{type:'add',args: arguments}]],'','set');
		return true;
	}
};

_me.copy = function(aItemsInfo, sDataSet, aDataPath, sFolderDataSet, aHandler)
{
	//Máme definovaná account_id, folder_id a jméno folderu, kam položky kopírujeme?
	if (!aItemsInfo['aid'] || !aItemsInfo['fid'] || !aItemsInfo['folder'])
		return false;

	//Vytvoříme základní strukturu XML dotazu
	// <ACCOUNT UID='aid'><FOLDER UID='fid'><ITEM...></FOLDER></ACCOUNT>
	var aRequest = {"ACCOUNT":[{"ATTRIBUTES":{"UID":aItemsInfo['aid']},"FOLDER":[{"ATTRIBUTES":{"UID":aItemsInfo['fid']},"ITEM":[]}]}]},
		aFrame = aRequest["ACCOUNT"][0]["FOLDER"][0]["ITEM"],
		bItems;

	//Vytvoření atributů tagu(ů) <ITEM>
	// <ITEM UID='iid' ACTION='copy'><ACCOUNT>account</ACCOUNT><FOLDER>folder</FOLDER></ITEM>
	for(var n in aItemsInfo['iid']){
		if (aItemsInfo['account'])
			aFrame[n] = {"ATTRIBUTES":{"UID":this.__serverID(aItemsInfo['iid'][n]),"ACTION":"copy"},"ACCOUNT":[{"VALUE":aItemsInfo['account']}],"FOLDER":[{"VALUE":aItemsInfo['folder']}]};
		else
			aFrame[n] = {"ATTRIBUTES":{"UID":this.__serverID(aItemsInfo['iid'][n]),"ACTION":"copy"},"FOLDER":[{"VALUE":aItemsInfo['folder']}]};

		//Duplicity handling
		if (aItemsInfo.duplicity)
			aFrame[n].ATTRIBUTES.DUPLICITY = aItemsInfo.duplicity;
		if (aItemsInfo.rename)
			aFrame[n].ATTRIBUTES.RENAME = aItemsInfo.rename;

		bItems = 1;
	}

	//Nebylo subpole 'iid' prázdné?
	if (!bItems) return false;

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
		this.create_iq(aRequest,[this,'response',['copy',sDataSet,aDataPath,sFolderDataSet,{'aid':aItemsInfo['aid'],'fid':aItemsInfo['fid'],'account':aItemsInfo['account']},aHandler,{type:'copy',args: arguments}]],'','set');
		return true;
	}
};


_me.move = function(aItemsInfo,sDataSet,aDataPath,sFolderDataSet,aHandler)
{
	//Máme definovaná account_id, folder_id a jméno folderu, kam položky přesouváme?
	if (!aItemsInfo['aid'] || !aItemsInfo['fid'] || !aItemsInfo['folder'])
		return false;

	//Vytvoříme základní strukturu XML dotazu
	// <ACCOUNT UID='aid'><FOLDER UID='fid'><ITEM...></FOLDER></ACCOUNT>
	var aRequest = {"ACCOUNT":[{"ATTRIBUTES":{"UID":aItemsInfo['aid']},"FOLDER":[{"ATTRIBUTES":{"UID":aItemsInfo['fid']},"ITEM":[]}]}]},
		aFrame = aRequest["ACCOUNT"][0]["FOLDER"][0]["ITEM"],
		bItems;

	//Vytvoření atributů tagu(ů) <ITEM>
	// <ITEM UID='iid' ACTION='move'><ACCOUNT>account</ACCOUNT><FOLDER>folder</FOLDER></ITEM>
	for(var n in aItemsInfo['iid']){
		if (aItemsInfo['account'])
			aFrame[n] = {"ATTRIBUTES":{"UID":this.__serverID(aItemsInfo['iid'][n]),"ACTION":"move"},"ACCOUNT":[{"VALUE":aItemsInfo['account']}],"FOLDER":[{"VALUE":aItemsInfo['folder']}]};
		else
			aFrame[n] = {"ATTRIBUTES":{"UID":this.__serverID(aItemsInfo['iid'][n]),"ACTION":"move"},"FOLDER":[{"VALUE":aItemsInfo['folder']}]};

		//Duplicity handling
		if (aItemsInfo.duplicity)
			aFrame[n].ATTRIBUTES.DUPLICITY = aItemsInfo.duplicity;
		if (aItemsInfo.rename)
			aFrame[n].ATTRIBUTES.RENAME = aItemsInfo.rename;

		bItems = 1;
	}

	//Nebylo subpole 'iid' prázdné?
	if (!bItems) return false;

	//Natvrdo synchronne
	var aResponse = this.create_iq(aRequest,'','','set');

	try{
		if (sDataSet)
			this.response({"Array":aResponse},'move',sDataSet,aDataPath,sFolderDataSet,{'aid':aItemsInfo['aid'],'fid':aItemsInfo['fid'],'account':aItemsInfo['account']},aHandler,{type:'move',args: arguments});
		else
		if (aResponse['IQ'][0]['ATTRIBUTES']['TYPE'] == 'result') return true;
	}
	catch(e){gui._REQUEST_VARS.debug && console.log(this._name||false,e);}
	return false;
};



_me.getFlag = function(id, sFlagName, sDataSet){
	var nFlag = this._getFlagValue(id, sDataSet, 'FLAGS');
	if (!Is.Defined(nFlag)) return false;
	return this.hasFlag(nFlag, sFlagName);
};

/**
 * Check whether some bit in number representing flags is set or not.
 * @param	nFlag		E.g. number 65 represents 'ANSWERED' + 'FORWARDED'  (1 + 64)
 * @param	sFlagName	'ANSWERED'|'DELETED'|'DRAFT'|'FLAGGED'|'RECENT'|'SEEN'|'FORWARDED'
 * @return	0 if the specified flag is not set, nonzero value otherwise
 */
_me.hasFlag = function(nFlag, sFlagName)
{
	switch(sFlagName) {
	case 'ANSWERED' : nFlag &= 1; break;
	case 'DELETED'  : nFlag &= 2; break;
	case 'DRAFT'    : nFlag &= 4; break;
	case 'FLAGGED'  : nFlag &= 8; break;
	case 'RECENT'   : nFlag &= 16; break;
	case 'SEEN'     : nFlag &= 32; break;
	case 'FORWARDED': nFlag &= 64; break;
	case 'COMPLETED': nFlag &= 128; break;
	default         : return false;
	}
	return (nFlag) ? true : false;
};

_me.setFlag = function(aItemsInfo,aFlagsSet,sDataSet,sFolderDataSet)
{

	function _setFlag(nFlag,sFlagName,bValue){
		switch(sFlagName){
		case 'ANSWERED'	: return (bValue ? nFlag | 33 : nFlag & ~1); // ANSWERED + SEEN
		case 'DELETED'	: return (bValue ? nFlag | 2 : nFlag & ~2);
		case 'DRAFT'	: return (bValue ? nFlag | 4 : nFlag & ~4);
		case 'FLAGGED'	: return (bValue ? nFlag | 8 : nFlag & ~8);
		case 'RECENT'	: return (bValue ? nFlag | 16 : nFlag & ~16);
		case 'SEEN'		: return (bValue ? nFlag | 32 : nFlag & ~32);
		case 'FORWARDED': return (bValue ? nFlag | 96 : nFlag & ~64); // FORWARDED + SEEN
		case 'COMPLETED': return (bValue ? nFlag | 128 : nFlag & ~128);
		}
		return nFlag;
	}

	var sFlagType = 'FLAGS',sFlagValue = '';
	if (count(aFlagsSet)==1)
	    for (var i in aFlagsSet){
			if (aFlagsSet[i])
				sFlagType = 'SET_FLAG';
			else
				sFlagType = 'CLEAR_FLAG';

			sFlagValue = _setFlag(0,i,true);
		}

	//Máme definovaná account_id, folder_id a alspoň jedno item_id?
	if (!aItemsInfo['aid'] || !aItemsInfo['fid'] || !aItemsInfo['iid'] || typeof aItemsInfo['iid'] != 'object' || Is.Empty(aItemsInfo['iid']))
		return false;

	//Vytvoříme základní strukturu XML dotazu
	var aRequest = {"ACCOUNT":[{"ATTRIBUTES":{"UID":aItemsInfo['aid']},"FOLDER":[{"ATTRIBUTES":{"UID":aItemsInfo['fid']},"ITEM":[]}]}]};

	var aItemFrame = aRequest["ACCOUNT"][0]["FOLDER"][0]["ITEM"],
		nFlag,nNewFlag,nCounter = 0,bUpdate = false, tmp;

	for(var n in aItemsInfo['iid'])
	{
		nFlag = this._getFlagValue([aItemsInfo['aid'], aItemsInfo['fid'], aItemsInfo['iid'][n]], sDataSet, 'FLAGS');
		if (typeof nFlag == 'undefined')
			nFlag = 0;

		nNewFlag = nFlag;

		for(var sFlagName in aFlagsSet)
			nNewFlag = _setFlag(nNewFlag,sFlagName,aFlagsSet[sFlagName]);

		if (nNewFlag != nFlag)
		{
			dataSet.add(sDataSet,[aItemsInfo['aid'],aItemsInfo['fid'],aItemsInfo['iid'][n],'FLAGS'],nNewFlag,true);

			tmp = {"ATTRIBUTES":{"UID":this.__serverID(aItemsInfo['iid'][n]),"ACTION":"edit"},"VALUES":[{}]};
			tmp.VALUES[0][sFlagType] = [{"VALUE":sFlagValue || nNewFlag}];
			aItemFrame.push(tmp);

			nCounter++;
			bUpdate = true;
		}
	}
	if (bUpdate) {
		if (aItemsInfo['iid'].length == 1)
			dataSet.update(sDataSet, [aItemsInfo['aid'], aItemsInfo['fid'], aItemsInfo['iid'][0], 'FLAGS']);
		else
			dataSet.update(sDataSet);
	}

	//Chceme aktualizovat datasety při změně flags?
	if (sFolderDataSet && nCounter>0)
	{
		var nRecent = parseInt(dataSet.get(sFolderDataSet,[aItemsInfo['aid'],aItemsInfo['fid'],'RECENT']) || 0);

		if (this.hasFlag(nNewFlag,'SEEN'))
			dataSet.add(sFolderDataSet,[aItemsInfo['aid'],aItemsInfo['fid'],'RECENT'],(nRecent - nCounter > 0?nRecent - nCounter:0).toString());
		else
			dataSet.add(sFolderDataSet,[aItemsInfo['aid'],aItemsInfo['fid'],'RECENT'],(nRecent + nCounter).toString());
	}

	if (!nCounter)
		return false;

	//Pracujeme synchronně či asynchronně?
	if (!sDataSet)
		return this.parse(this.create_iq(aRequest,'','','set'));
	else
	{
		//AJAX...
		this.create_iq(aRequest,[this,'response',['edit',sDataSet,'',sFolderDataSet,{'aid':aItemsInfo['aid']}]],'','set');
		return true;
	}
};

_me.getStaticFlag = function(id, sFlagName, sDataSet)
{
	var nFlag = this._getFlagValue(id, sDataSet, 'STATIC_FLAGS');
	if (typeof nFlag != 'undefined')
		return false;

	switch(sFlagName)
	{
	case 'HTMLBODY'   : return nFlag & 1;
	case 'CACHED'     : return nFlag & 2;
	}
	return false;
};

_me._getFlagValue = function(id, sDataSet, sFlagType)
{
	if (!sDataSet || !sFlagType)
		return false;

	return dataSet.get(sDataSet, id.concat([sFlagType]));
};

_me.quarantine = function(aItemsInfo,sDataSet,aDataPath,sFolderDataSet)
{
	//Máme definovaná account_id, folder_id a akci, kterou máme vyvolat?
	if (!aItemsInfo['aid'] || !aItemsInfo['fid'] || !aItemsInfo['action'])
		return false;

	//Vytvoříme základní strukturu XML dotazu
	// <ACCOUNT UID='aid'><FOLDER UID='fid'><ITEM...></FOLDER></ACCOUNT>
	var aRequest = {"ACCOUNT":[{"ATTRIBUTES":{"UID":aItemsInfo['aid']},"FOLDER":[{"ATTRIBUTES":{"UID":aItemsInfo['fid']},"ITEM":[]}]}]};

	var aFrame = aRequest["ACCOUNT"][0]["FOLDER"][0]["ITEM"];
	var bItems;

	//Vytvoření atributů tagu(ů) <ITEM>
	// <ITEM UID='iid' ACTION='action'/>
	for(var n in aItemsInfo['iid']){
		aFrame[n] = {"ATTRIBUTES":{"UID":this.__serverID(aItemsInfo['iid'][n]),"ACTION":aItemsInfo['action']}};
		bItems = 1;
	}
	//Nebylo subpole 'iid' prázdné?
	if (!bItems)
		return false;

	var aResponse = this.create_iq(aRequest,'','','set');
	try{
		if (sDataSet)
			this.response({"Array":aResponse},'quarantine',sDataSet,aDataPath,sFolderDataSet,{'aid':aItemsInfo['aid'],'fid':aItemsInfo['fid']});
		else
		if (aResponse['IQ'][0]['ATTRIBUTES']['TYPE'] == 'result') return true;
	}
	catch(e){gui._REQUEST_VARS.debug && console.log(this._name||false,e);}
	return false;

};

_me.recover = function(aItemsInfo,sDataSet,aDataPath,sFolderDataSet,aFoldersMapping)
{
	var sSourceFolder,
		aFrame,
		aResponse,
		aRequest,
		bItems,
		n,
		i;

	aFoldersMapping = aFoldersMapping || [];

	//Máme definovaná account_id, folder_id a akci, kterou máme vyvolat?
	if (!aItemsInfo['aid'] || !aItemsInfo['fid'] || !aItemsInfo['action'])
		return false;

	//Vytvoříme základní strukturu XML dotazu
	// <ACCOUNT UID='aid'><FOLDER UID='fid'><ITEM...></FOLDER></ACCOUNT>
	aRequest = {"ACCOUNT":[{"ATTRIBUTES":{"UID":aItemsInfo['aid']},"FOLDER":[{"ATTRIBUTES":{"UID":aItemsInfo['fid']},"ITEM":[]}]}]};

	aFrame = aRequest["ACCOUNT"][0]["FOLDER"][0]["ITEM"];

	//Vytvoření atributů tagu(ů) <ITEM>
	// <ITEM UID='iid' ACTION='action'/>
	for(n in aItemsInfo['iid']){
		aFrame[n] = {"ATTRIBUTES":{"UID":this.__serverID(aItemsInfo['iid'][n]),"ACTION":aItemsInfo['action']}};
		bItems = 1;
	}

	if (aFoldersMapping.length > 0) {
		aFrame = aRequest["ACCOUNT"][0]["FOLDER"][0]["FOLDERMAPPING"] = [];
	}

	for (i = 0; i < aFoldersMapping.length; i++) {
		aFrame.push({
			'ATTRIBUTES': {
				'SOURCE': aFoldersMapping[i].source,
				'DESTINATION': aFoldersMapping[i].destination
			}
		});
	}

	//Nebylo subpole 'iid' prázdné?
	if (!bItems)
		return false;

	aResponse = this.create_iq(aRequest,'','','set');
	try{
		if (sDataSet)
			this.response({"Array":aResponse},'recover',sDataSet,aDataPath,sFolderDataSet,{'aid':aItemsInfo['aid'],'fid':aItemsInfo['fid']});
		else
		if (aResponse['IQ'][0]['ATTRIBUTES']['TYPE'] == 'result') return true;
	}
	catch(e){gui._REQUEST_VARS.debug && console.log(this._name||false,e);}
	return false;
};

/*
<iq sid="8028cf831e365b49a98abdfdaded298e" type="set">
<query xmlns="webmail:iq:items">
<account uid="domain@icewarpdemo.com">
<folder uid="INBOX">
<item uid="72" action="accept">
<folder>Events</folder><partid>1</partid>
</item></folder></account></query>
</iq>
*/
_me.imip = function(aItemInfo,sAction,aHandler)
{
	//Máme definovaná account_id a folder_id?
	if (!aItemInfo['aid'] || !aItemInfo['fid'] || !aItemInfo['iid'])
		return false;

	//Vytvoříme základní strukturu XML dotazu
	// <ACCOUNT UID='aid'><FOLDER UID='fid'><ITEM UID='iid'>...</ITEM></FOLDER></ACCOUNT>
	var aRequest = {"ACCOUNT":[{"ATTRIBUTES":{"UID":aItemInfo['aid']},"FOLDER":[{"ATTRIBUTES":{"UID":aItemInfo['fid']},"ITEM":[{"ATTRIBUTES":{"UID":this.__serverID(aItemInfo['iid']),"ACTION":sAction}}]}]}]};

	var aItemRequest = aRequest["ACCOUNT"][0]["FOLDER"][0]["ITEM"][0];

	if (!aItemInfo['destination'])
		switch(aItemInfo['imip_type']){
		case 'VEVENT':
			aItemInfo['destination'] = Mapping.getDefaultFolderForGWType('E');
			break;
		case 'VTODO':
			aItemInfo['destination'] = Mapping.getDefaultFolderForGWType('T');
			break;
		case 'VJOURNAL':
			aItemInfo['destination'] = Mapping.getDefaultFolderForGWType('J');
			break;
		}

	aItemRequest["FOLDER"] = [{"VALUE":aItemInfo['destination']}];

	if (aItemInfo['partid'])
		aItemRequest["PARTID"] = [{"VALUE":aItemInfo['partid']}];

	if (aItemInfo['reason']) {
		aItemRequest["VALUES"] = aItemRequest["VALUES"] || [{}];
		aItemRequest["VALUES"][0].REASON = [{"VALUE": aItemInfo['reason']}];
	}

	if (aItemInfo['EXPDATE']) {
		aItemRequest["VALUES"] = aItemRequest["VALUES"] || [{}];
		aItemRequest["VALUES"][0].EXPDATE = [{"VALUE": aItemInfo['EXPDATE']}];
	}

	if (aItemInfo['EXPFOLLOWING']) {
		aItemRequest["VALUES"] = aItemRequest["VALUES"] || [{}];
		aItemRequest["VALUES"][0].EXPFOLLOWING = [{"VALUE": aItemInfo['EXPFOLLOWING']}];
	}

	if (aItemInfo['gwparams']){
		aItemRequest["GWPARAMS"] = [{}];
		for (var param in aItemInfo['gwparams'])
			aItemRequest["GWPARAMS"][0][param] = [{"VALUE":aItemInfo['gwparams'][param]}];
	}

	//Pracujeme synchronně či asynchronně?
	if (!aHandler){
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
		this.create_iq(aRequest,[this,'response',[sAction,'','','',{'aid':aItemInfo['aid'],'fid':aItemInfo['fid']}, aHandler]],'','set');
		return true;
	}
};



/*
{iq}
<account uid={aid}>
	<folder uid={fid}>
		<item uid="{iid}" action="certificate">
			<contact>
				<account>{targetAccount}</account>
				<folder>{targetFolder}</folder>
				<item>{targetItem}</item>
			</contact>
		</item>
	</folder>
</account>
{/iq}
*/
_me.certificate = function(aItemInfo,aHandler)
{
	//Máme definovaná account_id a folder_id?
	if (!aItemInfo['aid'] || !aItemInfo['fid'] || !aItemInfo['iid'])
		return false;

	//Vytvoříme základní strukturu XML dotazu
	// <ACCOUNT UID='aid'><FOLDER UID='fid'><ITEM UID='iid'>...</ITEM></FOLDER></ACCOUNT>
	var aRequest = {
		ACCOUNT:[{"ATTRIBUTES":{"UID":aItemInfo['account']},"FOLDER":[{"ATTRIBUTES":{"UID":aItemInfo['folder']},"ITEM":[{"ATTRIBUTES":{"UID":this.__serverID(aItemInfo['item']),"ACTION":'certificate'},
			CONTACT:[{
				ACCOUNT:[{VALUE:aItemInfo['aid']}],
				FOLDER:[{VALUE:aItemInfo['fid']}],
				ITEM:[{VALUE:this.__serverID(aItemInfo['iid'])}]
			}]
		}]}]}]};

	//AJAX...
	this.create_iq(aRequest,[this,'response',['certificate','','','',aItemInfo,aHandler]],'','set');
	return true;
};
/*
_me.appendCertificate = function (aItemInfo,aTargetInfo,aHandler) {
	//Máme definovaná account_id, folder_id a akci, kterou máme vyvolat?
	if (!aItemInfo['aid'] || !aItemInfo['fid'] || !aItemInfo['iid'])
		return false;

	//Vytvoříme základní strukturu XML dotazu
	// <ACCOUNT UID='aid'><FOLDER UID='fid'><ITEM...></FOLDER></ACCOUNT>
	var aRequest = {"ACCOUNT":[{"ATTRIBUTES":{"UID":aItemInfo['aid']},"FOLDER":[{"ATTRIBUTES":{"UID":aItemInfo['fid']},"ITEM":[{"ATTRIBUTES":{'UID':aItemInfo['iid'],'ACTION':'certificate'},CONTACT:[
	{ACCOUNT:[{VALUE:aTargetInfo.aid}],FOLDER:[{VALUE:aTargetInfo.fid}],ITEM:[{VALUE:aTargetInfo.iid}]}
	]}]}]}]};

	//AJAX...
	this.create_iq(aRequest,[this,'response',['appendcert','','','',aTargetInfo,aHandler]],'','set');
};
*/

_me.reminders = function(aItemsInfo,aHandler)
{
	//Máme definovaná account_id a folder_id?
	if (!aItemsInfo['rid'].length)
		return false;

	//Vytvoříme základní strukturu XML dotazu
	var aRequest = {"ACCOUNT":[{
		"ATTRIBUTES":{"UID":sPrimaryAccount},
		"FOLDER":[{
			"ATTRIBUTES":{"UID":'__@@REMINDERS@@__'},
			"ITEM":[]
		}]
	}]};

	var ctz = new IcewarpDate().utcOffset();
	for(var i in aItemsInfo['rid']){
		aRequest.ACCOUNT[0].FOLDER[0].ITEM.push({
			ATTRIBUTES:{UID:this.__serverID(aItemsInfo['rid'][i]), ACTION:typeof aItemsInfo['snooze'] != 'undefined'?'snooze':'dismiss'},
			VALUES:[{
				CTZ:[{VALUE:ctz}],
				TIMESTAMP:[{VALUE:(new IcewarpDate()).unix()}]
			}]
		});

		if (typeof aItemsInfo['snooze'] != 'undefined')
			aRequest.ACCOUNT[0].FOLDER[0].ITEM[aRequest.ACCOUNT[0].FOLDER[0].ITEM.length-1].VALUES[0].MINUTES = [{VALUE:aItemsInfo['snooze']}];
	}

	//AJAX...
	this.create_iq(aRequest,[this,'response',['reminders','','','',aItemsInfo,aHandler]],'','set');
	return true;
};

//********************************************************************************
//Základní SET funkce pro pro přesměrování mailové položky
//********************************************************************************
//Vstup: aItemInfo ... asociativní pole klíčů:
//  povinné: 'aid':account_id, 'fid':folder_id, 'iid':item_id,
//					 'to': seznam příjemců, 'distrib': asociativní pole polí
//            	account_id -> folder_id -> pole aliasů
//********************************************************************************

_me.redirect = function(aItemInfo,sDataSet,aDataPath,aHandler)
{
	//Máme definovaná account_id a folder_id?
	if (!aItemInfo['aid'] || !aItemInfo['fid'] || !aItemInfo['iid'] || (!aItemInfo['to'] && !aItemInfo['distrib']))
		return false;

	//Vytvoříme základní strukturu XML dotazu
	// <ACCOUNT UID='aid'><FOLDER UID='fid'><ITEM UID='iid'>...</ITEM></FOLDER></ACCOUNT>
	var aRequest = {"ACCOUNT":[{"ATTRIBUTES":{"UID":aItemInfo['aid']},"FOLDER":[{"ATTRIBUTES":{"UID":aItemInfo['fid']},"ITEM":[{"ATTRIBUTES":{"UID":this.__serverID(aItemInfo['iid']),"ACTION":"redirect"}}]}]}]};

	var aItemRequest = aRequest["ACCOUNT"][0]["FOLDER"][0]["ITEM"][0];

	if (aItemInfo['to'])
		aItemRequest["TO"] = [{"VALUE":aItemInfo['to']}];

	if (aItemInfo['distrib'])
	{
		aItemRequest["ACCOUNT"] = [];
		var aAccRequest = aItemRequest["ACCOUNT"];
		var aFolRequest,aToRequest;

		var aDistribFrame = aItemInfo['distrib'];
		var aAccFrame;

		for(var sAccId in aDistribFrame)
		{
			aAccFrame = aDistribFrame[sAccId];
			aFolRequest = [];

			for(var sFolId in aAccFrame){
				aFolFrame = aAccFrame[sFolId];
				aToRequest = [];

				for(var n in aFolFrame)
					aToRequest.push({"VALUE":aFolFrame[n]});

				aFolRequest.push({"ATTRIBUTES":{"UID":sFolId},"TO":aToRequest});
			}
			aAccRequest.push({"ATTRIBUTES":{"UID":sAccId},"FOLDER":aFolRequest});
		}
	}

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
		this.create_iq(aRequest,[this,'response',['redirect',sDataSet,aDataPath,'',{'aid':aItemInfo['aid'],'fid':aItemInfo['fid']},aHandler]],'','set');
		return true;
	}
};

//********************************************************************************
//Základní SET funkce pro pro mazání položek
//********************************************************************************
//Vstup: aItemsInfo ... asociativní pole klíčů:
//  povinné:   'aid':account_id, 'fid':folder_id, 'iid':pole hodnot item_id
//********************************************************************************

_me.remove = function(aItemsInfo,sDataSet,aDataPath,sFolderDataSet,aHandler){

	function parse_values(aFrom,aTo){
		for(var sValue in aFrom)
			if(typeof aFrom[sValue] == 'object')
				aTo[sValue] = [{'VALUE':aFrom[sValue].pop()}];
			else
				aTo[sValue] = [{'VALUE':aFrom[sValue]}];
	};

	//Máme definovaná account_id a folder_id?
	if (!aItemsInfo['aid'] || !aItemsInfo['fid']) return false;

	//Vytvoříme základní strukturu XML dotazu
	// <ACCOUNT UID='aid'><FOLDER UID='fid'><ITEM.../></FOLDER></ACCOUNT>
	var aRequest = {"ACCOUNT":[{"ATTRIBUTES":{"UID":aItemsInfo['aid']},"FOLDER":[{"ATTRIBUTES":{"UID":aItemsInfo['fid']},"ITEM":[]}]}]};

	var aFrame = aRequest["ACCOUNT"][0]["FOLDER"][0]["ITEM"];
	var bItems = 0;
	var bValue = Is.Object(aItemsInfo['values']);

	//Vytvoření atributů tagu(ů) <ITEM>
	// <ITEM UID='iid' ACTION='delete'/>
	for(var n in aItemsInfo['iid']){
		aFrame[n] = {"ATTRIBUTES":{"UID":this.__serverID(aItemsInfo['iid'][n]),"ACTION":"delete"}};
		bItems++;

		// byly pro polozku nastaveny nepovinne parametry 'VALUES'?
		if (bValue && Is.Object(aItemsInfo['values'][n])){
			aFrame[n]['VALUES'] = [{}];
			parse_values(aItemsInfo['values'][n],aFrame[n]['VALUES'][0]);
		}
	}

	//Nebylo subpole 'iid' prázdné?
	if (!bItems)
		return false;

	if (aHandler)
		this.create_iq(aRequest,[this,'response',['remove',sDataSet,aDataPath,sFolderDataSet,{'aid':aItemsInfo['aid'],'fid':aItemsInfo['fid']},aHandler,aRequest]],'','set');
	else{
		//Natvrdo synchronne
	    var aResponse = this.create_iq(aRequest,'','','set');

	    try{
	        if (sDataSet)
				this.response({'Array':aResponse},'remove',sDataSet,aDataPath,sFolderDataSet,{'aid':aItemsInfo['aid'],'fid':aItemsInfo['fid']});
			else
			if (aResponse['IQ'][0]['ATTRIBUTES']['TYPE'] == 'result')
				return true;
	    }
	    catch(e){gui._REQUEST_VARS.debug && console.log(this._name||false,e);}
		return false;
	}
};

/*
<account uid="{aid}">
	<folder uid="{fid}">
		<item uid="{iid}" action="save_items"/>
		<item uid="{iid}" action="save_items"/>
		<item uid="{iid}" action="save_items"/>
	</folder>
</account>
*/
_me.save_items = function(aItemsInfo,aHandler)
{
	//Máme definovaná account_id a folder_id?
	if (!aItemsInfo['aid'] || !aItemsInfo['fid'])
		return false;
	var aRequest = {"ACCOUNT":[{"ATTRIBUTES":{"UID":aItemsInfo['aid']},"FOLDER":[{"ATTRIBUTES":{"UID":aItemsInfo['fid']},"ITEM":[]}]}]};

	for (var i in aItemsInfo['iid'])
		aRequest.ACCOUNT[0].FOLDER[0].ITEM.push({"ATTRIBUTES":{"UID":this.__serverID(aItemsInfo['iid'][i]),"ACTION":'save_items'}});

	if (aHandler)
		this.create_iq(aRequest,[this,'response',['save_items','','','','',aHandler]],'','set');
	else{
		var aXMLResponse = this.create_iq(aRequest,'','','set');
		try{
	        var aOut = {
				'sid':dataSet.get('main', ['sid']),
				'class':aXMLResponse.IQ[0].RESULT[0].ACCOUNT[0].FOLDER[0].ITEM[0].VALUES[0].CLASS[0].VALUE,
				'fullpath':aXMLResponse.IQ[0].RESULT[0].ACCOUNT[0].FOLDER[0].ITEM[0].VALUES[0].FULLPATH[0].VALUE
			};
			downloadItem(buildURL(aOut));
		}
		catch(e){gui._REQUEST_VARS.debug && console.log(this._name||false,e);}
	}


	return true;
};


//********************************************************************************
//Základní GET funkce pro získání položek
//********************************************************************************
//Vstup: aItemsInfo ... asociativní pole klíčů:
//  povinné:   'aid':account_id, 'fid':folder_id
//  nepovinné: 'iid':item_id, 'values':pole hodnot kontextových subtagů,
//             'filter':asociativní pole nepovinných klíčů:
//                'eventinterval':unixfrom-unixto,
//                'sql':(evntitle like '%webmail%') and/or (evn...)
//********************************************************************************

_me.list = function(aItemsInfo,sDataSet,aDataPath,sFolderDataSet,aHandler, aErrorHandler)
{
	//Máme definovaná account_id a folder_id?
	if (!aItemsInfo['aid'] || !aItemsInfo['fid'])
		return false;

	var aRequest;
	//Vytvoříme základní strukturu XML dotazu
	// <ACCOUNT UID='aid'><FOLDER UID='fid'><ITEM UID='iid'>...</ITEM></FOLDER></ACCOUNT> pro definované 'iid' nebo
	// <ACCOUNT UID='aid'><FOLDER UID='fid'>...</FOLDER></ACCOUNT> pro nedefinované
	if (aItemsInfo['iid']){
		if (aItemsInfo['atid'])
			aRequest = {"ACCOUNT":[{"ATTRIBUTES":{"UID":aItemsInfo['aid']},"FOLDER":[{"ATTRIBUTES":{"UID":aItemsInfo['fid']},"ITEM":[{"ATTRIBUTES":{"UID":this.__serverID(aItemsInfo['iid']),"ATID":aItemsInfo['atid']}}]}]}]};
		else
			aRequest = {"ACCOUNT":[{"ATTRIBUTES":{"UID":aItemsInfo['aid']},"FOLDER":[{"ATTRIBUTES":{"UID":aItemsInfo['fid']},"ITEM":[{"ATTRIBUTES":{"UID":this.__serverID(aItemsInfo['iid'])}}]}]}]};

		if (aItemsInfo['date'])
			aRequest.ACCOUNT[0].FOLDER[0].ITEM[0].ATTRIBUTES.DATE = aItemsInfo['date'];
	}
	else
	if (aItemsInfo['rid']){
		aRequest = {"ACCOUNT":[{"ATTRIBUTES":{"UID":aItemsInfo['aid']},"FOLDER":[{"ATTRIBUTES":{"UID":aItemsInfo['fid']},"ITEM":[{"ATTRIBUTES":{"RID":this.__serverID(aItemsInfo['rid'])}}]}]}]};
	}
	else{
		aRequest = {"ACCOUNT":[{"ATTRIBUTES":{"UID":aItemsInfo['aid']},"FOLDER":[{"ATTRIBUTES":{"UID":aItemsInfo['fid']}}]}]};

		//Trash auto-cleanup
		if (!window.gui.frm_main.__trash_cleaned){
			var aTrashFolder = Path.split(GWOthers.getItem('DEFAULT_FOLDERS', 'trash'));
			if (typeof aTrashFolder == 'object' && aItemsInfo['aid'] == aTrashFolder[0] && aItemsInfo['fid'] == aTrashFolder[1]){
				var iDay = 0;
				if (GWOthers.getItem('MAIL_SETTINGS_GENERAL','autoclear_trash')>0 && (iDay = parseInt(GWOthers.getItem('MAIL_SETTINGS_GENERAL','autoclear_trash_days') || 0))>0){
					aRequest.ACCOUNT[0].FOLDER[0].CLEANUP = [{VALUE:parseInt(iDay)}];

					//trash is cleaned once per login
					window.gui.frm_main.__trash_cleaned = true;
				}
			}
		}

		//Trash auto-cleanup
		if (!window.gui.frm_main.__gwtrash_cleaned){
			if (aItemsInfo['aid'] == sPrimaryAccount && aItemsInfo['fid'] == '__@@GWTRASH@@__'){
				var iDay = 0;
				if (GWOthers.getItem('CALENDAR_SETTINGS','autoclear_trash')>0 && (iDay = parseInt(GWOthers.getItem('CALENDAR_SETTINGS','autoclear_trash_days') || 0))>0){
					aRequest.ACCOUNT[0].FOLDER[0].CLEANUP = [{VALUE:parseInt(iDay)}];

					//trash is cleaned once per login
					window.gui.frm_main.__gwtrash_cleaned = true;
				}
			}
		}
	}

	var aFrame;
	var bBody;

	//Máme definované subpole "values"?
	var aValFrame = {};
	if (aItemsInfo['values'])
	{
		//Vytvoříme podstrukturu tagu <VALUES>
		// <TAG1/><TAG2/>...
		for(var nIndex in aItemsInfo['values']){
			aValFrame[aItemsInfo['values'][nIndex]] = [aItemsInfo['custom_values'] && aItemsInfo['custom_values'][aItemsInfo['values'][nIndex]] ? {"VALUE": aItemsInfo['custom_values'][aItemsInfo['values'][nIndex]]} : {}];

			//Chceme explicitně tělo mailu?
			if (aItemsInfo['values'][nIndex] == 'HTML' || aItemsInfo['values'][nIndex] == 'TEXT')
				bBody = true;
		}

		//Chceme aktualizovat datasety při změně flags?
		if (bBody && aItemsInfo['iid'] && sDataSet && aItemsInfo['iid'].indexOf('|')<0){
			if (this.getFlag([aItemsInfo['aid'], aItemsInfo['fid'], aItemsInfo['iid']], 'SEEN', 'items') == false)
			{
				var nFlags = dataSet.get('items',[aItemsInfo['aid'],aItemsInfo['fid'],aItemsInfo['iid'],'FLAGS']);

				if (typeof nFlags != 'undefined')
				{
					dataSet.add(sDataSet,[aItemsInfo['aid'],aItemsInfo['fid'],aItemsInfo['iid'],'FLAGS'],nFlags | 32);

					if (sFolderDataSet){
						var nRecent = parseInt(dataSet.get(sFolderDataSet,[aItemsInfo['aid'],aItemsInfo['fid'],'RECENT']) || 0);
						if (nRecent > 0)
							dataSet.add(sFolderDataSet,[aItemsInfo['aid'],aItemsInfo['fid'],'RECENT'],(--nRecent).toString());
					}
				}
			}
		}
	}

	//Pokud nebylo zadáno item_id, přidáme tag <ITEM> pod tag <FOLDER>
	if (!aItemsInfo['iid'] && !aItemsInfo['rid'])
		aRequest["ACCOUNT"][0]["FOLDER"][0]["ITEM"]=[{}];

	//Přidáme celou strukturu tagu <VALUES> pod tag <ITEM>
	aFrame = aRequest["ACCOUNT"][0]["FOLDER"][0]["ITEM"][0];

	//ClientTimeZone
	aValFrame['CTZ'] = [{VALUE: new IcewarpDate().utcOffset()}];
	aFrame["VALUES"] = [aValFrame];

	if (aItemsInfo['locations'])
		aFrame["LOCATIONS"] = [{VALUE:''}];

	var bFilter = 0;
	//Máme definované subpole "filter" a nedefinované item_id?
	if (aItemsInfo['filter'] && (!aItemsInfo['iid'] && !aItemsInfo['rid'])){
		var aFilFrame = {};

		//Vytvoříme podstrukturu tagu <FILTER>
		for(var sFilter in aItemsInfo['filter']){
			switch(sFilter) {
			case 'sort':
				aFilFrame[sFilter] = [{}];
				var f = aItemsInfo['filter'][sFilter];
				if (Is.String(f)){
					f = f.split(',');
					for(var i in f){
						f[i] = f[i].trim().split(/\s+/);
						if (f[i][0])
							aFilFrame[sFilter][0][f[i][0]] = [{"VALUE":f[i][1] || 'asc'}];
					}
				}
				break;

			default:
				aFilFrame[sFilter] = [{"VALUE":aItemsInfo['filter'][sFilter]}];
				break;
			}
			bFilter = 1;
		}

		//Přidáme celou strukturu tagu <FILTER> pod tag <ITEM>
		if (bFilter)
			aFrame["FILTER"] = [aFilFrame];
	}

	//Pracujeme synchronně či asynchronně?
	if (!sDataSet && !aHandler){
		return this.parse(this.create_iq(aRequest),(typeof aItemsInfo.iid == 'undefined'?true:false));
	}
	//AJAX...
	else{
		//synchronize requests HotFIX part 1/2
		if (sDataSet)
			this.__lastListId[sDataSet] = unique_id();

		this.create_iq(aRequest,[this,'response',['list',sDataSet,aDataPath,sFolderDataSet,{'aid':aItemsInfo['aid'],'fid':aItemsInfo['fid'],'iid':aItemsInfo['iid'],'filter':bFilter},aHandler]],aErrorHandler,'get',sDataSet?this.__lastListId[sDataSet]:'');

		return true;
	}
};

//********************************************************************************
//Pomocná funkce realizující asynchronní obsluhu odpovědi
//********************************************************************************

_me.response = function(aData,sMethodName,sDataSet,aDataPath,sFolderDataSet,aArgs,aHandler,aOrgRequest)
{
	var aXMLResponse = aData['Array'],
		aIQAttribute = aXMLResponse['IQ'][0]['ATTRIBUTES'];

	switch(sMethodName){
		//save items
	case 'save_items':
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

		//reminders
	case 'reminders':
		if (aHandler){
			if (aIQAttribute['TYPE'] == 'result')
				pushParameterToCallback(aHandler, true);
			else
				pushParameterToCallback(aHandler, false);

			executeCallbackFunction(aHandler);
		}
		break;

		//certificate
	case 'certificate':
		if (aHandler){
			if (aIQAttribute['TYPE'] == 'result')
				pushParameterToCallback(aHandler, {data:aArgs});
			else
				pushParameterToCallback(aHandler, {error:aXMLResponse.IQ[0].ERROR[0].ATTRIBUTES.UID});

			executeCallbackFunction(aHandler);
		}
		break;

		// IMIP
	case 'accept_counter':
	case 'decline_counter':
	case 'accept':
	case 'tentative':
	case 'decline':
	case 'propose':

		if (aIQAttribute['TYPE'] == 'result')
			executeCallbackFunction(aHandler, true, false);
		else{
			var str, att;
			try{
				att = aXMLResponse.IQ[0].ERROR[0].ATTRIBUTES.UID;
				str = aXMLResponse.IQ[0].ERROR[0].VALUE;
			}
			catch(e){
				str = att = '';
			}

			switch(att.toLowerCase()){
			// Event has already been decided and changed
			case 'imip_obsolete':
				gui.notifier._value({type: 'alert', args: {header: '', text: 'IMIP::OBSOLETE'}});
				executeCallbackFunction(aHandler, false, true);
				break;
			// Event data could not be parsed
			case 'imip_no_access_permissions':
				gui.notifier._value({type: 'alert', args: {header: '', text: 'IMIP::IMIP_NO_ACCESS_PERMISSIONS'}});
				executeCallbackFunction(aHandler, false, false);
				break;
			case 'imip_unknown_attendee':
				if (sMethodName != 'decline')
					gui.notifier._value({type: 'alert', args: {header: '', text: 'IMIP::UNKNOWN_ATTENDEE'}});

				executeCallbackFunction(aHandler, false, true);
				break;
			case 'imip_versit_empty':
				gui.notifier._value({type: 'alert', args: {header: '', text: 'IMIP::MALFORMED'}});
				break;
			case 'folder_insufficient_rights':
				gui.notifier._value({type: 'alert', args: {header: '', text_plain: str.unescapeHTML()}});
				break;
			case 'folder_does_not_exist':
				gui.notifier._value({type: 'alert', args: {header: '', text: 'IMIP::FOLDER_NOT_EXIST', args: [str.unescapeHTML()]}});
				break;
			}
		}

		break;

	case 'edit':
		if (aIQAttribute['TYPE'] != 'result'){
			return;
		}
	case 'add':
	case 'list':

		if (aIQAttribute['TYPE'] != 'result'){

			var bOk = false,
				str, att;
			try{
				att = aXMLResponse.IQ[0].ERROR[0].ATTRIBUTES.UID;
				str = aXMLResponse.IQ[0].ERROR[0].VALUE;
			}
			catch(e){
				str = att = '';
			}

			switch(att.toLowerCase()){
			case 'folder_does_not_exist':
				gui.notifier._value({type: 'alert', args: {header: '', text: 'IMIP::FOLDER_NOT_EXIST', args: [str?str.unescapeHTML():'']}});
				break;

			case 'item_invalid_id':
				// Skip informing user for some errors (avoids default error)
				break;

			case 'attendee_email_invalid':
				gui.notifier._value({type: 'alert', args: {header: '', text: 'ALERTS::ATTENDEE_INVALID', args: str?[str.unescapeHTML()]:null}});
				break;

			case 'attachment_blocked_by_filters':
				gui.notifier._value({type: 'alert', args: {header: 'ALERTS::ATTACHMENT_FILTER', text_plain: str?"\n"+str.unescapeHTML():''}});
			break;

			case 'attachment_virus':
				gui.notifier._value({type: 'alert', args: {header: 'ALERTS::ATTACHMENT_VIRUS', text_plain: str?"\n"+str.unescapeHTML():''}});
				break;

			case 'attachment_groupware_general':
			case 'attachment_webdav_disabled':
			case 'attachment_file_not_found':
				gui.notifier._value({type: 'alert', args: {header: '', text: 'ALERTS::ATTACHMENT_MISSING'}});
				break;

			case 'attachment_quota_exceeded':
				gui.notifier._value({type: 'alert', args: {header: '', text: 'ALERTS::ATTACHMENT_QUOTA'}});
				break;

			case 'attachment_size':
				gui.notifier._value({type: 'alert', args: {header: 'ALERTS::ATTACHMENT_SIZE', text_plain: str?"\n"+str.unescapeHTML():''}});
				break;

			case 'mailbox_quota_limit':
				gui.notifier._value({type: 'alert', args: {header: 'ALERTS::MAILBOX_QUOTA_LIMIT', text_plain: str?"\n"+str.unescapeHTML():''}});
				break;

			case 'smtp_recipients_failed':
				gui.notifier._value({type: 'alert', args: {header: 'ALERTS::SMTP_RECIPIENTS_FAILED', text_plain: str?"\n"+str.unescapeHTML():''}});
				bOk = true;
				break;

			case 'item_edit':
				gui.notifier._value({type: 'alert', args: {header: '', text: 'ALERTS::COULD_NOT_EDIT'}});
				break;

			case 'item_create':
//				gui.notifier._value({type: 'alert', args: {header: '', text: 'ALERTS::COULD_NOT_CREATE'}});
				break;
			case 'item_edit_groupchat_attendee':
				gui.notifier._value({type: 'alert', args: {header: '', text: 'ALERTS::ITEM_EDIT_GROUPCHAT_ATTENDEE'}});
				break;
			case 'imap_fileid_sync_failed':
				gui.notifier._value({type: 'alert', args: {header: '', text: 'ALERTS::IMAP_FILEID_SYNC_FAILED'}});
				break;

			case 'default_folder_missing':
				gui.notifier._value({type: 'alert', args: {header: '', text: 'ALERTS::DEFAULT_FOLDER_MISSING', args: [str?Mapping.getDefaultFolderForGWType(str):'']}});
				break;

			case 'items_duplicity':
				if (aOrgRequest && aXMLResponse.IQ[0].ERROR[0].DUPLICATE){
					gui._create('duplicity', 'frm_duplicity', '', '',{duplicate:aXMLResponse.IQ[0].ERROR[0].DUPLICATE[0], request:aOrgRequest});
					bOk = 2;
					break;
				}

			case 'imip_no_gw_service':
				gui.notifier._value({type: 'alert', args: {header: '', text: 'IMIP::IMIP_NO_GW_SERVICE'}});
				break;

			case 'imip_no_access_permissions':
				gui.notifier._value({type: 'alert', args: {header: '', text: 'IMIP::IMIP_NO_ACCESS_PERMISSIONS'}});
				//NEVER DO THIS!!!
				// if(aHandler instanceof Array && aHandler[2] && aHandler[2] instanceof Array){
				// 	aHandler[2][3] = true;
				// }
				//executeCallbackFunction(aHandler);
				break;

			default:
				if (sFolderDataSet){
					WMFolders.list({'aid':aArgs['aid']},sFolderDataSet);
				}
				else
				if (sDataSet)
					dataSet.remove(sDataSet,aDataPath);

				switch(att.toLowerCase()){
				case 'folder_insufficient_rights':
				case 'imap_internal':
					gui.notifier._value({type: 'alert', args: {header: '', text_plain: str?str.unescapeHTML():''}});
					break;

						// If no error warning displayed yet, show general error
				default:
					var err = str?att+': '+str:att;
					if(err.indexOf('E_') !== 0) {
						if (getLang('ALERTS::' + err, false, 2) !== "") {
							gui.notifier._value({type: 'alert', args: {header: '', text: 'ALERTS::' + err}});
						} else if (getLang('ERROR::' + err, false, 2) !== "") {
							gui.notifier._value({type: 'alert', args: {header: '', text: 'ERROR::' + err}});
						} else {
							gui.notifier._value({type: 'alert', args: {header: '', text: 'ALERTS::GENERAL_ERROR', args: [err]}});
						}
					}
				}

			}
		}
		else
		{
			bOk = true;

			// Handle list response when result is ok
			if (sMethodName == 'list'){

				//synchronize requests HotFIX part 2/2
				if (sDataSet && aIQAttribute['UID'] && aIQAttribute['UID']!=this.__lastListId[sDataSet]) return;

				var parsedXMLResponse = this.parse(aXMLResponse,(typeof aArgs['iid'] == 'undefined'?true:false));

				//Update RIGHTS in cookie
				if (Cookie)
					try{
						var sRight = aXMLResponse.IQ[0].QUERY[0].ACCOUNT[0].FOLDER[0].ATTRIBUTES.RIGHTS,
						sAccId = aXMLResponse.IQ[0].QUERY[0].ACCOUNT[0].ATTRIBUTES.UID,
						sFolId = aXMLResponse.IQ[0].QUERY[0].ACCOUNT[0].FOLDER[0].ATTRIBUTES.UID,
						sPrima = aXMLResponse.IQ[0].QUERY[0].ACCOUNT[0].FOLDER[0].ATTRIBUTES.PRIMARY;

						sRight = sRight?sRight.split(''):'';

						//Merged calendar - Update rights of physical folder
						if (sPrima)
							Cookie.set(['rights',sAccId,sPrima], sRight);

						Cookie.set(['rights',sAccId,sFolId], sRight);
					}
					catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r);}

				if (sDataSet){
					dataSet.add(sDataSet,aDataPath,parsedXMLResponse,true);
					dataSet.update(sDataSet);
				}

				if (typeof aHandler == 'object'){
					pushParameterToCallback(aHandler, parsedXMLResponse);
					executeCallbackFunction(aHandler);
				}
				return;
			}
		}

		var aOut = [];
		if (typeof aHandler == 'object' && aXMLResponse.IQ && aXMLResponse.IQ[0].RESULT){

			// support for multiple results
			// For autosaved items keep id (list and add requests)

			for (var n in aXMLResponse.IQ[0].RESULT){

				var out = {xml:aXMLResponse};

				if (aXMLResponse.IQ[0].RESULT[n].ID)
					out.id = aXMLResponse.IQ[0].RESULT[n].ID[0].VALUE;

				if (aXMLResponse.IQ[0].RESULT[n].NAME)
					out.name = aXMLResponse.IQ[0].RESULT[n].NAME[0].VALUE;

				if (aXMLResponse.IQ[0].RESULT[n].ATT_SIZE)
					out.att_size = aXMLResponse.IQ[0].RESULT[n].ATT_SIZE[0].VALUE;

				if (aXMLResponse.IQ[0].RESULT[n].TEAMCHAT_LINK_ID)
					out.teamchat_link = aXMLResponse.IQ[0].RESULT[n].TEAMCHAT_LINK_ID[0].VALUE;

				if (aXMLResponse.IQ[0].RESULT[n].ATT_WEBDAV_LINK)
					out.att_link = aXMLResponse.IQ[0].RESULT[n].ATT_WEBDAV_LINK[0].VALUE;

				aOut.push(out);
			}

			if (aOut.length == 1)
				aOut = aOut[0];
		}

		executeCallbackFunction(aHandler, bOk, bOk ? aOut : att);

		return true;

	case 'copy':
	case 'move':
	case 'remove':
		try{
			var bOK = true;
			if (aIQAttribute['TYPE'] != 'result'){
				bOK = false;

				if (sFolderDataSet){

					if (sMethodName != 'copy'){
						var aItems = dataSet.get(sDataSet);

						for(var sAccId in aItems)
							for(var sFolId in aItems[sAccId])
								break;

							//Nekliknul uživatel na jiný folder?
						if (sAccId == aArgs['aid'] && sFolId == aArgs['fid']){
							var aValues = this.default_values(dataSet.get(sFolderDataSet,[sAccId,sFolId,'TYPE']));
							if (aValues)
								this.list({'aid':sAccId,'fid':sFolId,'values':aValues},sDataSet,aDataPath);
						}
					}

					//Probíhaly metody copy, move do jiného account?
					if (aArgs['account'] && aArgs['account'] != aArgs['aid'])
						WMFolders.list({'aid':aArgs['account']},sFolderDataSet);

					WMFolders.list({'aid':aArgs['aid']},sFolderDataSet);
				}

				var error = aXMLResponse.IQ[0].ERROR[0];
				var errorUID = error.ATTRIBUTES.UID;
				switch(errorUID) {
					case 'items_duplicity':
						if (aOrgRequest && error.DUPLICATE) {
							gui._create('duplicity', 'frm_duplicity', '', '', {request:aOrgRequest, duplicate:error.DUPLICATE[0]});
							bOk = true;
						}
						break;
					case 'imap_internal':
						gui.notifier._value({type: 'alert', args: {header: '', text_plain: (error.VALUE || '').unescapeHTML()}});
						break;

					case 'item_delete':
						gui.notifier._value({type: 'alert', args: {header: '', text: 'ALERTS::ITEM_COULD_NOT_DELETE'}});
						break;

					case 'item_edit':
						gui.notifier._value({type: 'alert', args: {header: '', text: 'ALERTS::ITEM_COULD_NOT_EDIT'}});
						break;

					case 'alfresco_error':
						gui.notifier._value({type: 'alert', args: {header: '', text: 'ALERTS::' + error.VALUE}});
						break;

						case 'item_decline_reason':
						if (error.FAILED_ID) {
							// Collect initial values (for repeated events)
							var values = aOrgRequest.ACCOUNT[0].FOLDER[0].ITEM[0].VALUES || [{}];
							for(var i in values[0])
								values[0][i] = values[0][i][0].VALUE;
							// Check which items were not deleted
							var failids = [];
							for(var i in error.FAILED_ID[0].UID) {
								failids.push(this.__clientID(error.FAILED_ID[0].UID[i].VALUE));
							}

							// Ask user for a reason and resend request
							gui._create('decline','frm_text','','frm_ok_cancel', [function(sReason){
								values[0].REASON = sReason;
								values = {aid: aArgs.aid, fid: aArgs.fid, iid: failids, values: values};
								WMItems.remove(values,sDataSet,aDataPath,sFolderDataSet,aHandler);
							}],'EVENT::SPECIFY_REASON');

							bOk = true;
						}
						break;
					default:
						(errorUID || error.VALUE) && gui.notifier._value({type: 'alert', args: {header: errorUID || '', text_plain: error.VALUE || ''}});
				}

			}

			if (typeof aHandler == 'object')
				executeCallbackFunction(aHandler, bOK, aData);

			return true;
		}
		catch(e)
		{
			return false;
		}
	case 'delete':
		if (typeof aHandler == 'object')
			executeCallbackFunction(aHandler);
		return true;
	case 'recover':
	case 'quarantine':
		try{
			if (aIQAttribute['TYPE'] == 'result'){
				//Chceme synchronizovat folder tree?
				if (sFolderDataSet){
					WMFolders.list({'aid':aArgs['aid']},sFolderDataSet);
				}
				return true;
			}
		}
		catch(e){gui._REQUEST_VARS.debug && console.log(this._name||false,e);}

		return false;

	case 'redirect':
		if (typeof aHandler == 'object'){
			if (aIQAttribute['TYPE'] != 'result'){
				var str,att;
				try{
					str = aXMLResponse.IQ[0].ERROR[0].VALUE;
					att = aXMLResponse.IQ[0].ERROR[0].ATTRIBUTES.UID;
				}
				catch(e){
					att = '';
					str = 'unknown error';
				}

				pushParameterToCallback(aHandler,[att,str.unescapeHTML()]);
			}
			executeCallbackFunction(aHandler);
		}
		break;

	case 'action':
		executeCallbackFunction(aHandler,aIQAttribute['TYPE'] == 'result',aXMLResponse);
		break;
	}
};

_me.default_values = function(sFolType){
	return this.__defaultValues[sFolType];
};

/**
 * bCount - bool - set TOTAL = count for proper folder
 **/
_me.parse = function(aData,bCount)
{
	try{
		function parse_addons(sAddOns,aAddOns)
		{
			var sAddOnId,aAddOnFrame,aValuesFrame;
			var aResult = {};
			var aResultValueFrame;

			var sAddOn = sAddOns.substr(0,sAddOns.length-1);

			for(var n in aAddOns[sAddOn])
			{
				aAddOnFrame = aAddOns[sAddOn][n];

				if (aAddOnFrame['ATTRIBUTES'] && aAddOnFrame['ATTRIBUTES']['UID'])
				{
					sAddOnId = aAddOnFrame['ATTRIBUTES']['UID'];
					aResult[sAddOnId] = {};
				}
				else{
					sAddOnId = '';
					aResult[n] = {};
				}

				for(var sValues in aAddOnFrame)
					if (sValues =='VALUES'){
						aValuesFrame = aAddOnFrame['VALUES'][0];

						if (sAddOnId)
							aResultValueFrame = aResult[sAddOnId]['values'] = {};
						else
							aResultValueFrame = aResult[n]['values'] = {};

						for (var sValue in aValuesFrame)
							if (aValuesFrame[sValue][0]['VALUE'])
								aResultValueFrame[sValue] = aValuesFrame[sValue][0]['VALUE'];
							else
							if (!Is.Empty(aValuesFrame[sValue][0]))
								aResultValueFrame[sValue] = aValuesFrame[sValue][0];

					}
					else
					if (sValues != 'ATTRIBUTES')
						if (sAddOnId)
							aResult[sAddOnId][sValues] = parse_addons(sValues,aAddOnFrame[sValues][0]);
						else
							aResult[n][sValues] = parse_addons(sValues,aAddOnFrame[sValues][0]);
			}
			return aResult;
		};

		var aAccFrame = aData['IQ'][0]['QUERY'][0]['ACCOUNT'][0];
		var sAccId = aAccFrame['ATTRIBUTES']['UID'];
		var aFolFrame = aAccFrame['FOLDER'][0];
		var sFolId = aFolFrame['ATTRIBUTES']['UID'];

		if (Is.Defined(aFolFrame['ATTRIBUTES']['RECENT']) && parseInt(dataSet.get("folders",[sAccId,sFolId,'RECENT']) || 0) != parseInt(aFolFrame['ATTRIBUTES']['RECENT'] || 0)){

			//Sync Team Chat RECENT - No update becouse its the same as folders anyway
			if (sPrimaryAccountCHAT && dataSet.get("teamchat",[sFolId, 'recent']))
				dataSet.add("teamchat",[sFolId,'recent'], parseInt(aFolFrame['ATTRIBUTES']['RECENT']), true);
			dataSet.update("teamchat");

			dataSet.add("folders",[sAccId,sFolId,'RECENT'],(aFolFrame['ATTRIBUTES']['RECENT']).toString());
		}

		//save folder COUNT to dataset TOTAL
		/*
if (bCount && typeof aFolFrame['ATTRIBUTES']['COUNT'] != 'undefined')
	dataSet.add("folders",[sAccId,sFolId,'TOTAL'],aFolFrame['ATTRIBUTES']['COUNT'],true);
*/
		var aItmFrame,sItemId,aValFrame;

		var aResult = {};
		var aResultFrame = aResult[sAccId] = {};
		aResultFrame = aResultFrame[sFolId] = {};

		aResultFrame['@'] = aFolFrame['ATTRIBUTES'];

		if (bCount && typeof aFolFrame['ATTRIBUTES']['COUNT'] != 'undefined' && aFolFrame['ATTRIBUTES']['COUNT']){
			aResultFrame['/'] = aFolFrame['ATTRIBUTES']['COUNT'];
			aResultFrame['#'] = aFolFrame.ITEM?aFolFrame.ITEM.length:0;
		}

		if (typeof aFolFrame['ATTRIBUTES']['OFFSET'] != 'undefined' && aFolFrame['ATTRIBUTES']['OFFSET'])
			aResultFrame['$'] = aFolFrame['ATTRIBUTES']['OFFSET'];

		var aItemIds = {};

		for(var n in aFolFrame['ITEM'])
		{
			aItmFrame = aFolFrame['ITEM'][n];

			var aFrame = {'aid':sAccId,'fid':sFolId};

			for (var sAddOns in aItmFrame){
				if (sAddOns == 'VALUES'){
					aValFrame = aItmFrame['VALUES'][0];
					for(var sValue in aValFrame)
						aFrame[sValue] = aValFrame[sValue][0]['VALUE'];
				}
				else
				if (sAddOns == 'X_ICEWARP_SERVER_TEAMCHAT_NOTIFICATIONS')
					aFrame[sAddOns] = aItmFrame[sAddOns][0];
				else
				if (sAddOns == 'X_ICEWARP_SERVER_REQUEST' || sAddOns == 'X_ICEWARP_SERVER_INVITE_REQUEST')
					aFrame['X_ICEWARP_SERVER_REQUEST'] = aItmFrame[sAddOns][0];
				else
				if (sAddOns == 'NOTE')
					aFrame[sAddOns] = aItmFrame[sAddOns][0]['VALUE'];
				else
				if (sAddOns != 'ATTRIBUTES')
					aFrame[sAddOns] = parse_addons(sAddOns,aItmFrame[sAddOns][0],aFrame[sAddOns]);
			}

			//Generate ID
			sItemId = this.__clientID(aItmFrame['ATTRIBUTES']['UID']);

			//RCR ID for Events
			if (aFrame.EVNRCR_ID && aFrame.EVNSTARTDATE && aFrame.OSD){
				if (aFrame.EVNSTARTDATE != aFrame.OSD)
					sItemId += '|' + aFrame.EVNSTARTDATE;
			}
			else{
				if (typeof aItemIds[sItemId] == 'undefined')
					aItemIds[sItemId] = 0;
				else
					sItemId += '|' + (++aItemIds[sItemId]);
			}

			aResultFrame[sItemId] = aFrame;
		}
		return aResult;
	}
	catch(e){
		return false;
	}
};

var WMItems = new wm_items;			// TODO: create real static functions in wm_items instead of simulating it.
