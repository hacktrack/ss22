/**
 *  GENERIC class for all wm_<name> classes
 **/
function wm_generic(){
	this.xmlns; // All descendants needs this property set or set it as create_iq arg
	this.error; // error object
}
var _me = wm_generic.prototype;
	/**
	* @brief : IQ request builder function
	* @param :	aData		- xml content between <query> tags as an Array
	*			oResponse	- response object [object,method,[optional params,...]]
	*			sType		- Optional, GET or SET "type" attribute of <IQ> tag
	*			sId			- Optional, ID attribute of <IQ> tag
	*			sNs			- Optional (this.xmlns is defined in all descendants), xmlns attr. of <query> tag
	*
	* @return: Whole XML response in Array
	* @date  : 26.5.2006 16:36:53
	**/
_me.create_iq = function (aData,oResponse,oResponse2,sType,sId,sNs,bJSON,bNoSession){

	delete this.error;

	/* supported xmlns */
	var xmlns = {
		"auth":1,
		"tools":1,
		"accounts":1,
		"folders":1,
		"items":1,
		"freebusy":1,
		"spellchecker":1,
		"public":1,
		"private":1,
		"domain":1,
		"message":1,
		"import":1,
		"export":1,
		"upload":1
	};

	/* set xmlns from property */
	sNs = sNs || this.xmlns;
	if (!xmlns[sNs]){
		throw new Error('create_iq: unsupported xmlns "'+sNs+'"');
		//return (oReponse?false:{});
	}
	sNs = 'webmail:iq:'+sNs;

	/* prepare IQ object structure */
	var iq = {"IQ":[{"ATTRIBUTES":{},"QUERY":[{"ATTRIBUTES":{}}]}]};

	/* append values into IQ */
	var sSID = bNoSession ? '' : dataSet.get('main',['sid']);
	if (sSID)
		iq['IQ'][0]['ATTRIBUTES']['SID'] = sSID;

	if (sId)
		iq['IQ'][0]['ATTRIBUTES']['UID'] = sId;

	iq['IQ'][0]['ATTRIBUTES']['TYPE'] = sType || 'get';
	iq['IQ'][0]['QUERY'][0]['ATTRIBUTES']['XMLNS'] = sNs;

	//Do not ask for JSON in case of ?xml=true
	if (!gui._REQUEST_VARS.xml && (sType != 'set' || bJSON))
		iq['IQ'][0]['ATTRIBUTES']['FORMAT'] = 'json';

	/* append data into query */
	if (aData && typeof aData == 'object')
		iq['IQ'][0]['QUERY'][0] = arrConcat(iq['IQ'][0]['QUERY'][0],aData);

	if (oResponse){
		//http.sendArray(iq,[this,'response_check',[oResponse]],oResponse2);
		request.sendArray(iq,[this,'response_check',[oResponse]],oResponse2);
		return true;
	}
	else{
		var q = request.sendArray(iq);
		if (q){
			var aOut = q.getArray();

			// Error handler
			if (aOut['IQ'][0]['ATTRIBUTES']['TYPE']=="error"){
				var aErr = aOut['IQ'][0]['ERROR'][0];
				this.error = {};
				this.error["text"] = aErr['VALUE'];
				if (aErr['ATTRIBUTES'] && aErr['ATTRIBUTES']['UID']){
					this.error["id"]   = aErr['ATTRIBUTES']['UID'];
					this.error["lang"] = getLang("ERR_" + aErr['ATTRIBUTES']['ID']);
				}
			}

			return aOut;
		}
	}
};

/**
 * Check for Server side low level errors
 * @Date: 2.11.2007 14:21:33
 **/
_me.response_check = function(aData,oResponse){
	try{
		var aXMLResponse = aData['Array'];
		var aIQAttribute = aXMLResponse['IQ'][0]['ATTRIBUTES'];
	}
	catch(r){
		return false;
	}

	if (aIQAttribute['TYPE'] == 'error'){
		try{
			var error = aXMLResponse.IQ[0].ERROR[0].ATTRIBUTES.UID || '';
			switch(error){
			case 'folder_does_not_exist':
				if(aXMLResponse.IQ[0].ERROR[0].VALUE === '__@@ADDRESSBOOK@@__' && dataSet.get('accounts',[sPrimaryAccount,'GUEST_ACCOUNT'])){
					return;
				}
				break;

			case 'account_does_not_exist':
				var email = aXMLResponse.IQ[0].ERROR[0].VALUE; // || aIQAttribute.UID
				if (email && email !== sPrimaryAccount) {
					gui._create('settings', 'frm_settings','','','account_settings', 'other');
					gui.notifier._value({type: 'alert', args: {header: 'ALERTS::' + error, text: 'ALERTS::UPDATE_LOGIN_INFORMATION', args: [email]}});
					return false;
				}

			case 'session_expired':
			case 'session_no_user':

				dataSet.add('main',['sid'],'');
				if (gui && gui.frm_main && gui.frm_main.__logout)
					gui.frm_main.__logout();

				return false;

			case 'imap_authenticate':
			case 'smtp_authenticate':
			case 'groupware_authenticate':
				var email = aXMLResponse.IQ[0].ERROR[0].VALUE || aIQAttribute.UID;
				if (email && email !== sPrimaryAccount){
					gui.notifier._value({type: 'alert', args: {header: 'ALERTS::' + error, text: 'ALERTS::UPDATE_LOGIN_INFORMATION', args: [email]}});
					if (!gui.settings || !gui.settings._isModal()){
						gui._create('settings', 'frm_settings','','','account_settings', 'other');
					}
					gui.settings._modal(true);
				} else {
					gui && gui.frm_main && gui.frm_main._acceptChangedIP && gui.frm_main._acceptChangedIP();
				}
				return false;

			case 'xmlrequest_invalid_sid':
			case 'session_ip_mismatch':
				if(!gui.reauth)
					gui._create('reauth','frm_reauth');

				return false;
			default:
				if (error.indexOf('E_') === 0 && getLang('ERROR::' + error, false, 2)) {
					gui.notifier._value({type: 'alert', args: {header: 'ERROR::' + error}});
				}
			}
		}
		catch(er){gui._REQUEST_VARS.debug && console.log(this._name||false,er);}
	}
	else {
		if (aXMLResponse.IQ[0].ATTRIBUTES && aXMLResponse.IQ[0].ATTRIBUTES.TEAMCHAT_TOKEN)
			sPrimaryAccountTeamchatToken = aXMLResponse.IQ[0].ATTRIBUTES.TEAMCHAT_TOKEN;
	}

	try{
		executeCallbackFunction(oResponse, aData);
	}
	catch(e){
 		if ((gui._REQUEST_VARS['debug'] || gui._REQUEST_VARS['frm']) && dataSet.get('main',['sid']))
			console.warn({InputData:aXMLResponse || 'no data',Error:e});
	}
};

/**
 * @brief: HTTPrequest response handler
 * @note : this function has to be defined in all objects
 **/
_me.response = function(){};
