# IcewarpAPI

## Usage

### Initialization of API
Connection is authenticated using passed session_id

```javascript
var host = '//' + location.host + '/icewarpapi/';
var session_id = dataSet.get('main', ['sid']);
var callback {
	success: function() {},
	error: function() {},
	context: this
};

var icewarpapi = IceWarpAPI({
	session_id: session_id,
	host: host,
	callback: callback
});
```

### Calling API

```javascript
var data = {
	commandname: 'command',
	commandparams: {
		key: value
	}
};

icewarpapi.send(data, {
	success: function (response) {
	},
	error: function (error) {
	},
	context: this
});
```

## Used Modules

* Callback: [@icewarp/callback@2.0.2](http://dkframework.doc/#callback/2.0.2)  
* IQProtocol: [@icewarp/iq-protocol@1.0.12](http://dkframework.doc/#iq-protocol/1.0.12)  
* JsonXML: [@icewarp/json@1.0.12](http://dkframework.doc/#json-xml/1.0.12)  
* Request: [@icewarp/request@1.0.15](http://dkframework.doc/#request/1.0.15)  
* XHRConnection: [@icewarp/xhr-connection@1.0.12](http://dkframework.doc/#xhr-connection/1.0.12)  
* OldCommunication: [@icewarp/old-communication@1.0.22](http://dkframework.doc/#old-communication/1.0.22)  
