function wm_oauth() {
	this.xmlns = 'rpc';
}
wm_oauth.inherit(wm_generic);

wm_oauth._AUTH_TYPES = {
	'0': getLang("oauth::auth_type_standard"),
	'1': getLang("oauth::auth_type_mobile"),
	'2': getLang("oauth::auth_type_single_page")
};

/*
<iq sid="sidval">
<query xmlns="admin:iq:rpc">
  <commandname>getoauthclients</commandname>
  <commandparams/>
</query>
</iq>

*/
wm_oauth.prototype.server = function (aHandler) {
	try {
		var aRequest = {
			commandname: [{
				VALUE: 'getoauthclients'
			}]
		};

		aHandler = Array.isArray(aHandler) ? aHandler : [aHandler];

		var fc = [function (data) {
			var items = [];

			try {
				if (data.Array.IQ[0].QUERY[0].RESULT[0].ITEM) {
					for (var i = 0; i < data.Array.IQ[0].QUERY[0].RESULT[0].ITEM.length; i++) {
						var inner = {};
						var tmp;
						// Retrieve values and put into object
						for (var inr in data.Array.IQ[0].QUERY[0].RESULT[0].ITEM[i]) {
							if (tmp = data.Array.IQ[0].QUERY[0].RESULT[0].ITEM[i][inr][0]) {
								inr = inr.toLowerCase();
								inner[inr] = tmp.VALUE;
							}
						}
						items.push(inner);
					}
				}
			} catch (e) {
				log.error(['oauth-getlist', 'Invalid response', data]);
			}

			aHandler[0](items);
		}];

		this.create_iq(aRequest, [this, '__response', [fc]]);
	} catch (e) {
		log.error(['oauth-getlist', e]);
	}

	return true;
}

/*
<iq sid="sidval">
<query xmlns="admin:iq:rpc">
  <commandname>addoauthclient</commandname>
  <commandparams>
	<client>
		<name>stringval</name>
		<description>stringval</description>
		<redirecturi>stringval</redirecturi>
		<authtype>intval</authtype>
	</client>
  </commandparams>
</query>
</iq>
*/
wm_oauth.prototype.add = function (oauth, aHandler) {
	var client = [{}];

	for (var i in oauth) {
		client[0][i] = [{
			VALUE: oauth[i]
		}];
	}
	try {
		var aRequest = {
			commandname: [{
				VALUE: 'addoauthclient'
			}],
			commandparams: [{
				client: client
			}]
		};

		aHandler = Array.isArray(aHandler) ? aHandler : [aHandler];

		this.create_iq(aRequest, [this, '__response', [this._autoBooleanHandler(aHandler)]]);
	} catch (e) {
		log.error(['oauth-add', e]);
	}

	return true;
}
/*
<iq sid="sidval">
<query xmlns="admin:iq:rpc">
  <commandname>editoauthclient</commandname>
  <commandparams>
	<client>
		<name>stringval</name>
		<description>stringval</description>
		<redirecturi>stringval</redirecturi>
		<authtype>intval</authtype>
	</client>
  </commandparams>
</query>
</iq>
*/
wm_oauth.prototype.edit = function (oauth, aHandler) {
	var client = [{}];

	for (var i in oauth) {
		client[0][i] = [{
			VALUE: oauth[i]
		}];
	}
	try {
		var aRequest = {
			commandname: [{
				VALUE: 'editoauthclient'
			}],
			commandparams: [{
				client: client
			}]
		};

		aHandler = Array.isArray(aHandler) ? aHandler : [aHandler];

		this.create_iq(aRequest, [this, '__response', [this._autoBooleanHandler(aHandler)]]);
	} catch (e) {
		log.error(['oauth-edit', e]);
	}

	return true;
}

/*
<iq sid="sidval">
<query xmlns="admin:iq:rpc">
  <commandname>removeoauthclient</commandname>
  <commandparams>
	<clientid>intval</clientid>
  </commandparams>
</query>
</iq>
*/
wm_oauth.prototype.delete = function (id, aHandler) {
	try {
		var aRequest = {
			commandname: [{
				VALUE: 'removeoauthclient'
			}],
			commandparams: [{
				clientid: [{
					VALUE: id
				}]
			}]
		};

		aHandler = Array.isArray(aHandler) ? aHandler : [aHandler];

		this.create_iq(aRequest, [this, '__response', [this._autoBooleanHandler(aHandler)]]);
	} catch (e) {
		log.error(['oauth-delete', e]);
	}

	return true;
}

wm_oauth.prototype.__response = function (aData, aHandler) {
	executeCallbackFunction(aHandler, aData);
};

/////////////////////////////////
var com = com || {};
com.oauth = new wm_oauth();
