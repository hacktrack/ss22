function wm_general()
{
	this.xmlns='rpc';
}

wm_general.inherit(wm_generic);
var _me = wm_general.prototype;

_me.generate_password=function(cb){
	var cb=cb;
	var aRequest = {
		commandname:[{VALUE:'generateaccountpassword'}],
		commandparams:[{}]
	};
	
	this.create_iq(aRequest,[this,'__response',[[function(aResponse){
		try
		{
			var pwd=aResponse.Array.IQ[0].QUERY[0].RESULT[0].VALUE;
			cb(pwd);
		}
		catch(e)
		{
			log.error(e);
		}
	}]]]);
	return true;
}

_me.sessionInfo = function(cb)
{
	var cb=cb;
	var aRequest = {
		commandname:[{VALUE:'getsessioninfo'}],
		commandparams:[{}]
	};
	
	this.create_iq(aRequest,[this,'__response',[[function(aResponse){
		try
		{
			cb(aResponse);
		}
		catch(e)
		{
			log.error(e);
		}
	}]]]);
	return true;
}

_me.install_url = function(cb)
{
	com.console.item(function(response){
		try
		{
			try
			{
				cb(response.Array.IQ[0].QUERY[0].RESULT[0].ITEM[0].PROPERTYVAL[0].VAL[0].VALUE);
			}
			catch(e)
			{
				log.error(["wm_general - install_url","Cannot retrieve install url"]);
			}
		}
		catch(e)
		{
			log.error(e);
		}
	}).server('c_install_url');
	return true;
}

_me.__response = function(aData,aHandler){

	var aXMLResponse = aData['Array'];
	var aIQAttribute = aXMLResponse['IQ'][0]['ATTRIBUTES'];

	var out = aData;

	executeCallbackFunction(aHandler,out);
};

if(!com){var com={};}
com.general = new wm_general();
