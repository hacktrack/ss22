function wm_freebusy()
{
  this.xmlns='freebusy';
}

wm_freebusy.inherit(wm_generic);
var _me = wm_freebusy.prototype;

/**
 * @brief   Gets informations from calendar (which times an user is FREE/BUSY).
 * @param[in]  aFreebusyInfo
 *    - email  Email of the user.
 * @param[in]  sDataSet    Dataset name.
 * @param[in]  aDataPath   Array containing path ['folder','subfolder',...] dataset.folder.subfodler.
 * @return  Array containing these items:
 *    - TYPE      BUSY | TENTATIVE | FREE
 *    - START     Starting time in unix format.
 *    - FINISH    Final time in unix format.
 */
_me.get = function(aFreebusyInfo,sDataSet,aDataPath,aHandler)
{
	if (aHandler){

		var aRequest = {ACCOUNT:[{VALUE:sPrimaryAccount}]};
		if (aFreebusyInfo.from)
			aRequest.FROM = [{VALUE:aFreebusyInfo.from}];
		if (aFreebusyInfo.to)
			aRequest.TO = [{VALUE:aFreebusyInfo.to}];
		if (aFreebusyInfo.evnid)
			aRequest.EVN_ID = [{VALUE:aFreebusyInfo.evnid}];

		if (aFreebusyInfo.tzid)
			aRequest.TZID = [{VALUE:aFreebusyInfo.tzid}];
		else
			//ClientTimeZone
			aRequest.CTZ = [{VALUE:new IcewarpDate().utcOffset()}];

		aRequest.USERS = [{USER:[]}];
		var tmp;
		for(var i in aFreebusyInfo.users){
			tmp = {VALUE:aFreebusyInfo.users[i]};

			if (aFreebusyInfo.evnid && aFreebusyInfo.owner == aFreebusyInfo.users[i])
				tmp.ATTRIBUTES = {OWNER:'true'};

			aRequest.USERS[0].USER.push(tmp);
		}

		// asynchronous
		this.create_iq(aRequest,[this,'response',[aHandler,aFreebusyInfo.from,aFreebusyInfo.to]]);
		return true;
	}
};

/**
 * Callback function (from asynchronous call).
 *
 * @param {obejct} aData
 * @param {ResponseHandler} aHandler
 * @param {Julian int} iFrom
 * @param {Julian int} iTo
 */
_me.response = function(aData,aHandler,iFrom,iTo){

	var aXMLResponse = aData['Array'],
		aIQAttribute = aXMLResponse['IQ'][0]['ATTRIBUTES'];

	var out = {},
		bOK = false;

	if (aIQAttribute['TYPE'] == 'result'){
		bOK = true;

		var itm, uid, tmp, user = aXMLResponse.IQ[0].QUERY[0].USER;

		for(var i = 0;i<user.length;i++){

			if (!user[i].ITEM) continue;

			for(var j = 0, k = user[i].ITEM.length; j<k; j++){

				itm = user[i].ITEM[j];
				uid = itm.ATTRIBUTES.UID;
				tmp = {ACCOUNT:user[i].ATTRIBUTES.EMAIL};
				if (itm.ATTRIBUTES && itm.ATTRIBUTES.EVNUID)
					tmp.EVNUID = itm.ATTRIBUTES.EVNUID;

				for (var l in itm){
					if (itm[l][0] && Is.Defined(itm[l][0].VALUE))
				 		tmp[l] = itm[l][0].VALUE;
				}

				out[uid] = tmp;
			}
		}
	}

	executeCallbackFunction(aHandler, bOK, out);
};