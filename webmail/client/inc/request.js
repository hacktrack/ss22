/*
 *	XMLHttpRequest extension
 */

XMLHttpRequest.prototype.getString = function(){
	return (this.status && this.status==200)?this.responseText:'';
};

XMLHttpRequest.prototype.getXML = function(){
	try{
		// Strip white space from response when browser isn't IE
		return XMLTools.stripWhiteSpace(this.responseXML);
	}
	catch(r){
		throw "XMLHttpRequest.getXML \n" + this.getString();
	}
};

XMLHttpRequest.prototype.getArray = function(){

	try{
		var sType = this.getResponseHeader("Content-Type").split(';')[0];

		switch(sType){
		case 'text/json':
			return JSON.parse(this.getString());

		case 'text/xml':
		case 'application/xml':
			return XMLTools.XML2Arr(this.getXML());

		case null:
		case 'null':
			return {};

		default:
			throw 'unsupported content-type "' + sType +'"';
		}
	}
	catch(e){
		throw "XMLHttpRequest.getArray \n" + (typeof e == 'string'? e + "\n":'') + this.getString();
	}
};


/*
 * Request Object
 * @date: 9.12.2014
 */

function cRequest(sURL){
	//Default URL
	this.sURL = sURL;	// Default request URL
	this.iRetry = 15;	// Retry interval
};

// _send should not be called directly
cRequest.prototype._send = function(xData, sType, oResponse, oErrorResponse, sURL) {
	var sURL = sURL || this.sURL,
		bASync = oResponse?true:false,
		me = this;

	if (!sURL)
		throw "cRequest No Target URL";

	if (gui && !gui.__online){
		if (bASync && gui.connection)
			gui.connection._queue(0, this.iRetry, [this,'_send',[xData, sType, oResponse, oErrorResponse, sURL]], oErrorResponse);
		else
			this.error({type:'response', text:'Offline', status:0, url:sURL});

		return false;
	}

	try{
		var oXMLHttp = new XMLHttpRequest();

	}
	catch(r){
		throw "cRequest Your browser does not support XMLHttpRequest object";
	}

	//Open connection
	oXMLHttp.open(xData?'POST':'GET', sURL, bASync);

	//Set request header
	if (xData)
		oXMLHttp.setRequestHeader('Content-Type', sType || 'text/xml');

	//async mode
	if (bASync){

		//Aborted addEventListener
		oXMLHttp.onabort = function(e){

			//LOADER -
			if (me.onfinish)
				me.onfinish(this);

			try{
				//Auto Reconnect
				if (e.target.status === 0 && (!me.onreconnect || me.onreconnect(e)))
					me._send(xData, sType, oResponse, oErrorResponse, sURL);
			}
			catch(r){
				me.error({
					type:'system',
					text:'abort, unable to send'
				});
			}

		};

		//Error
		oXMLHttp.onerror = function(e){

			//LOADER -
			if (me.onfinish)
				me.onfinish(this);

			try{

				//Offline
				if (e.target.status == 0){

					//Try to catch error by handler
					if ((oErrorResponse && executeCallbackFunction(oErrorResponse, this, [xData, sType, oResponse, oErrorResponse, sURL])) || (me.onerror && me.onerror(this, [xData, sType, oResponse, oErrorResponse, sURL])))
						return;

					//Try to catch error by handler
					if (gui && gui.connection)
						gui.connection._queue(0, me.iRetry, [me,'_send',[xData, sType, oResponse, oErrorResponse, sURL]], oErrorResponse);
					else
						me.error({stype:'response', text:'Offline', status:0, url:sURL});
				}
			}
			catch(r){
				me.error({
					type:'system',
					status:e.target.status,
					text:'error, can not add to the buffer'
				});
			}
		};

		oXMLHttp.onreadystatechange = function () {

			if (this.readyState == 4){

				//LOADER - (handled by onabort in case of 0)
				if (this.status != 0 && me.onfinish)
					me.onfinish(this);

				//Success
				if ((this.status==200 || this.status==304) && this.getResponseHeader("Content-Type") != null){

					//Response
					try{
						var oRData = {};
						switch(oResponse[3]){
						case 'XML':
							oRData = {"XML":this.getXML()};
							break;
						case 'Text':
							oRData = {"Text":this.getString()};
							break;
						default:
							oRData = {"Array":this.getArray()};
						}
					}
					catch(r){
						throw "Response parse error: \n" + this.getString();
					}

					executeCallbackFunction(oResponse, oRData);

					if (me.onsuccess)
						me.onsuccess(oRData);

				}
				//Server Error
				else{

					switch(this.status){

						//Abort, ignored and handled by onabort
					case 0:	break;

					case 409:
					case 410:

						if (!oErrorResponse || !executeCallbackFunction(oErrorResponse, this, [xData, sType, oResponse, oErrorResponse, sURL]))
							if (me.onerror)
							 	me.onerror(this, [xData, sType, oResponse, oErrorResponse, sURL]);

						break;

						//TERMINATE
					case 404:
					case 500:

						if (gui.connection)
							gui.connection._queue(this.status, 0, null, oErrorResponse);
						else
							me.error({stype:'response', text: 'Server Error', status:this.status, url:sURL});

						return;

						//Fuuuuuuuu!!!
					default:
						var retry = me.iRetry;

						//Try to catch error by handler
						if ((oErrorResponse && executeCallbackFunction(oErrorResponse, this, [xData, sType, oResponse, oErrorResponse, sURL])) || (me.onerror && me.onerror(this, [xData, sType, oResponse, oErrorResponse, sURL])))
							break;

						//Server Busy
					case 503:
						retry = parseInt(this.getResponseHeader('Retry-After'),10) || retry;

						if (gui.connection)
							gui.connection._queue(this.status, retry, [me,'_send',[xData, sType, oResponse, oErrorResponse, sURL]], oErrorResponse);
						else
							me.error({stype:'response', text: 'Server Error', status:this.status, url:sURL});
					}
				}
			}
		};

		//LOADER +
		if (me.onstart)
			me.onstart(oXMLHttp);
	}

	//Send data
	oXMLHttp.send(xData || null);

	//sync mode
	if (!bASync) {
		// Report error for synchronous requests
		if (oXMLHttp.status!=200 && oXMLHttp.status!=304){
			me.error({type:'response', status:oXMLHttp.status});
			return false;
		}
	}

	//FOR DEBUG
	return oXMLHttp;
};

//Simple internal Error handler
cRequest.prototype.error = function(arg){
	if (console && console.dir)
		console.dir(arg);
};


// PUBLIC
cRequest.prototype.sendArray = function(aData, oResponse, oErrorResponse, sURL, bPreserveCase){
	return this._send(XMLTools.Arr2XML(aData,'',bPreserveCase), 'text/xml', oResponse, oErrorResponse, sURL);
};
cRequest.prototype.sendJSON = function(aData, oResponse, oErrorResponse, sURL){
	return this._send(JSON.stringify(aData), 'application/json', oResponse, oErrorResponse, sURL);
};
cRequest.prototype.sendString = function(sData, oResponse, oErrorResponse, sURL){
	return this._send(sData, 'text/plain', oResponse, oErrorResponse, sURL);
};
cRequest.prototype.get = function(sURL, oResponse, oErrorResponse){
	return this._send(null, '', oResponse, oErrorResponse, sURL);
};


// Timer to detect time lapse
cRequest.timer = new Date();
cRequest.lapse = 0;
cRequest.interval = setInterval(function() {
	cRequest.lapse = (new Date()-cRequest.timer)/1000;
	cRequest.timer = new Date();
}, 15000);
