function wm_upload(){
	this.xmlns = 'upload';
};

wm_upload.inherit(wm_generic);
var _me = wm_upload.prototype;


/*
<upload action="certificate">
<folder>2009-03-03-49ad2d36z8d16</folder>
<file>49ad2d36z8d33</file>
<passphrase>599033</passphrase>
</upload>
*/
_me.certificate = function(sFolder,sFile,sPass,aHandler){
	var request = {UPLOAD:[{ATTRIBUTES:{TYPE:'certificate'},FOLDER:[{VALUE:sFolder}],FILE:[{VALUE:sFile}]}]};

	if (sPass)
	    request.UPLOAD[0].PASSPHRASE = [{VALUE:sPass}];
	    
	this.create_iq(request,[this,'response',['certificate',aHandler]]);
};

/*
<upload action="extract">
	<folder>Events</folder>
	<file>3c337a61d03f</file>
	<class>item</class>
</upload>
*/
_me.extract = function (sFolder,sFile,sClass,aHandler){
	var request = {UPLOAD:[{
			ATTRIBUTES:{ACTION:'extract'},
			FOLDER:[{VALUE:sFolder}],
			FILE:[{VALUE:sFile}],
			CLASS:[{VALUE:sClass}]
		}]};
		
	this.create_iq(request,[this,'response',['extract',aHandler]],'','set');
};

//IM OOB
_me.ticket = function(sFolder,sFile,sClass,aHandler){
	var request = {UPLOAD:[{FOLDER:[{VALUE:sFolder}],FILE:[{VALUE:sFile}],CLASS:[{VALUE:sClass}]}]};
	this.create_iq(request,[this,'response',['ticket',aHandler]]);
};


//IM BITESTREAM (download)
_me.socks_connect = function (aData,aHandler){
	var request = {UPLOAD:[{ATTRIBUTES:{ACTION:'socks_connect'},STREAMHOST:[]}]};

	for(var i in aData)
		request.UPLOAD[0].STREAMHOST.push({
			ATTRIBUTES:{JID:aData[i].jid},
			HASH:[{VALUE:aData[i].hash}],
			HOST:[{VALUE:aData[i].host}]
		});
	
	this.create_iq(request,[this,'response',['socks_connect',aHandler]],'','set');
};

//IM BITESTREAM (upload)
/*
<iq sid="86158a0dfaef1e0945463c0ff757d18c" type="set">
<query xmlns="webmail:iq:upload">
<upload action="socks">
<folder>2009-12-17-4b2a09205f02f</folder>
<file>4b2a09205f048</file>
<hash>hash123</hash>
</upload>
</query>
</iq>
*/
_me.socket = function(sFolder,sFile,sClass,sHash, aHandler){
	var request = {UPLOAD:[{ATTRIBUTES:{'ACTION':'socks'},FOLDER:[{VALUE:sFolder}],FILE:[{VALUE:sFile}],CLASS:[{VALUE:sClass}],HASH:[{VALUE:sHash}]}]};
	this.create_iq(request,[this,'response',['socket',aHandler]],'','set');
};

//IM AVATAR
_me.file2xml = function(sFolder,sFile,sJid,aHandler){
	var request = {UPLOAD:[{FOLDER:[{VALUE:sFolder}],FILE:[{VALUE:sFile}],JID:[{VALUE:sJid}],ATTRIBUTES:{ACTION:'file2xml'}}]};
	this.create_iq(request,[this,'response',['file2xml',aHandler]],'','set','','',true);
};

_me.data2xml = function(sType,sData,sJid,aHandler){
	var request = {UPLOAD:[{TYPE:[{VALUE:sType}],DATA:[{VALUE:sData}],NAME:[{VALUE:sJid}],JID:[{VALUE:sJid}],ATTRIBUTES:{ACTION:'data2xml'}}]};
	this.create_iq(request,[this,'response',['data2xml',aHandler]],'','set');
};

_me.response = function(aData,sMethodName,aHandler){

	var aXMLResponse = aData['Array'];
	var aIQAttribute = aXMLResponse['IQ'][0]['ATTRIBUTES'];

	switch (sMethodName){
	case 'certificate':
        if (aHandler){
			if (aIQAttribute['TYPE'] == 'result')
				executeCallbackFunction(aHandler,aXMLResponse.IQ[0].QUERY[0].DATA[0]);
			else
				executeCallbackFunction(aHandler,null);
		}

	    break;
	
	case 'ticket':
        if (aHandler){
			if (aIQAttribute['TYPE'] == 'result'){
                var aUpload = aXMLResponse.IQ[0].QUERY[0].UPLOAD[0];
	            executeCallbackFunction(aHandler,{name:aUpload.NAME[0].VALUE,type:aUpload.TYPE[0].VALUE,ticket:aUpload.TICKET[0].VALUE});
			}
			else
				executeCallbackFunction(aHandler);
		}
		break;

	case 'socket':
        if (aHandler){
			if (aIQAttribute['TYPE'] == 'result'){
				var aUpload = aXMLResponse.IQ[0].QUERY[0].UPLOAD[0];
	            executeCallbackFunction(aHandler,{name:aUpload.NAME[0].VALUE,size:aUpload.SIZE[0].VALUE});
			}
			else
				executeCallbackFunction(aHandler);
		}
		break;

	case 'extract':
		if (aIQAttribute['TYPE'] == 'result'){
			var sFolder = aXMLResponse.IQ[0].QUERY[0].FOLDER[0].VALUE,
				sFile = aXMLResponse.IQ[0].QUERY[0].FILE[0].VALUE,
				iSize = aXMLResponse.IQ[0].QUERY[0].SIZE[0].VALUE,
				iName = aXMLResponse.IQ[0].QUERY[0].NAME[0].VALUE;

			executeCallbackFunction(aHandler,sFolder,sFile,'file',iSize,iName);
		}

		break;
		
	case 'socks_connect':
		var out = false;
		if (aIQAttribute['TYPE'] == 'result')
            out = {
				jid:aXMLResponse.IQ[0].QUERY[0].UPLOAD[0].STREAMHOST[0].ATTRIBUTES.JID,
				socket:aXMLResponse.IQ[0].QUERY[0].UPLOAD[0].STREAMHOST[0].SOCKET[0].VALUE
			};

		executeCallbackFunction(aHandler, out);
		break;

	case 'file2xml':
	    if (aIQAttribute['TYPE'] == 'result'){
			var out,h;
			if (aXMLResponse.IQ[0].QUERY[0].DATA && aXMLResponse.IQ[0].QUERY[0].DATA[0].VALUE)
				out = aXMLResponse.IQ[0].QUERY[0].DATA[0].VALUE;
			if (aXMLResponse.IQ[0].QUERY[0].HASH && aXMLResponse.IQ[0].QUERY[0].HASH[0].VALUE)
				h = aXMLResponse.IQ[0].QUERY[0].HASH[0].VALUE;

			executeCallbackFunction(aHandler,out,h);
		}
		break;

    case 'data2xml':
        if (aHandler){
			var h;
			if (aXMLResponse.IQ[0].QUERY[0].HASH && aXMLResponse.IQ[0].QUERY[0].HASH[0].VALUE)
				h = aXMLResponse.IQ[0].QUERY[0].HASH[0].VALUE;

			executeCallbackFunction(aHandler,h);
		}
	}
};