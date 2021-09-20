function wm_import(){
	this.xmlns = 'import';
};

wm_import.inherit(wm_generic);
var _me = wm_import.prototype;

//********************************************************************************
//********************************************************************************

// Send request to import uploaded data
_me.import_data = function(aData,callback)
{
	var aRequest = {'IMPORT':[{'ATTRIBUTES':{'ACTION':aData.action},'ACCOUNT':[{'ATTRIBUTES':{'UID':aData.account}}],'FULLPATH':[{'VALUE':aData.path}]}]};

    if (aData.action != 'groupware'){
		//Lines in case of CSV
		if (aData.action == 'csv'){
			if (aData.lines)
				aRequest.IMPORT[0].LINES = [{VALUE:aData.lines}];

			if (aData.skipfirst)
				aRequest.IMPORT[0].SKIPFIRST = [{VALUE:'true'}];

			if (aData.charset)
				aRequest.IMPORT[0].CHARSET = [{VALUE:aData.charset}];

			if (aData.format)
				aRequest.IMPORT[0].FORMAT = [{VALUE:aData.format}];

			if (aData.values){
				aRequest.ACCOUNT = [{ATTRIBUTES:{UID:aData.account},FOLDER:[{ATTRIBUTES:{UID:aData.folder},ITEM:[aData.values]}]}];
                aRequest.ACCOUNT[0].FOLDER[0].ITEM[0].ATTRIBUTES = {action:'add'};

				if (aData['share'])
                    aRequest.ACCOUNT[0].FOLDER[0].ITEM[0].VALUES[0].ITMSHARETYPE = [{VALUE:aData['share']}];

				delete aRequest.IMPORT[0].ACCOUNT;
			}
		}
		else
		if (aData.folder)
			aRequest.IMPORT[0].ACCOUNT[0].FOLDER = [{ATTRIBUTES:{UID:aData.folder}}];
	}

	if(callback) {
		// Asynchronous with callback
		this.create_iq(aRequest,[this,function(aResponse) {
			if(aResponse && aResponse['Array'] && aResponse['Array']['IQ'] && aResponse['Array']['IQ'][0]) {
				var aIQ = aResponse['Array']['IQ'][0];
				if (aIQ['ATTRIBUTES']['TYPE'] == 'result')
					var result = aData.lines ? this.parse(aResponse) : true;
				else if(aIQ['ATTRIBUTES']['TYPE'] == 'error')
					var result = aIQ['ERROR'][0]['VALUE'];
				executeCallbackFunction(callback, result);
			}
		}],'',aData.lines?'get':'set');
	} else {
		// Synchronous
		var aResponse = this.create_iq(aRequest,'','',aData.lines?'get':'set');

		if(aResponse && aResponse['IQ'] && aResponse['IQ'][0]) {
			var aIQ = aResponse['IQ'][0];
			if (aIQ['ATTRIBUTES']['TYPE'] == 'result') {
				if (aData.lines)
					return this.parse(aResponse);
				return true;
			}
			else
				return false;
		} else
			return false;
	}
};

// Check import progress for big imports (how much of import is already done)
_me.import_progress = function(callback) {

	var aRequest = {'IMPORT':[{'ATTRIBUTES':{'ACTION': 'status'}}]};

	// Only asynchronous request
	this.create_iq(aRequest,[this,function(aResponse) {
		// Default is completed (so new import can be started, if previous failed or this is first)
		var result = {};
		if(aResponse && aResponse['Array'] && aResponse['Array']['IQ'] && aResponse['Array']['IQ'][0]) {
			var aIQ = aResponse['Array']['IQ'][0];
			if (aIQ['ATTRIBUTES']['TYPE'] == 'result') try {
				result.complete = aIQ['QUERY'][0]['IMPORT'][0]['STATUS'][0]['COMPLETED'][0]['VALUE'] == '1' ? true : false;
				if(!result.complete) {
					result.progress = aIQ['QUERY'][0]['IMPORT'][0]['STATUS'][0]['PROCESSED'][0]['VALUE'];
					result.total = aIQ['QUERY'][0]['IMPORT'][0]['STATUS'][0]['TOTAL'][0]['VALUE'];
				}
			} catch(e) {
				result = {complete:true};
			}
			executeCallbackFunction(callback, result);
		}
	}]);
}

// Parse server reply
_me.parse = function(aData)
{
	try
	{
		var aFrame = aData['IQ'][0]['QUERY'][0]['IMPORT'][0]['ROW'];
		var aResult = [],tmp;

		for(var i in aFrame){
			tmp = [];
			for(var j in aFrame[i].COL)
				tmp.push(aFrame[i].COL[j].VALUE)

			aResult.push(tmp);
		}
		return aResult;

 	}
	catch(e){
		return false;
	}
};