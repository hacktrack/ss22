_me = frm_account_oauth_settings.prototype;

function frm_account_oauth_settings() {};

_me.__constructor = function () {
	var me = this;

	this.oauth.__sortColumn = 'expires';
	this.oauth._addColumns({
		clientname: {
			title: "OAUTH::CLIENT_NAME",
			width: 100
		},
		clientdescription: {
			title: "OAUTH::CLIENT_DESCRIPTION",
			width: 50,
			mode: '%'
		},
		scopes: {
			title: "OAUTH::SCOPES",
			width: 100
		},
		description: {
			title: "OAUTH::DESCRIPTION",
			width: 50,
			mode: '%'
		},
		created: {
			title: "OAUTH::CREATED",
			width: 150
		}
	});

	this.oauth._oncontext = function (e, elm, arg, sLineId) {
		if (typeof sLineId === 'undefined') {
			return;
		}

		gui._create("cmenu", "obj_context", '', '', me);
		var aMenu = [{
			title: 'ATTACHMENT::REMOVE',
			arg: [me, '__deleteItems', [
				[sLineId]
			]]
		}];

		gui.cmenu._fill(aMenu);
		gui.cmenu._place(e.clientX, e.clientY);
	};

	this.remove._onclick = function () {
		me.__deleteItems(me.oauth._value());
	};

	this.__fillDataGrid();
};

_me.__deleteItems = function (aIDs) {
	var length = aIDs.length;
	if (length) {
		this.remove._disabled(true);
	}
	for (var i in aIDs) {
		icewarpapi.send({
			commandname: 'removeoauthauthorization',
			commandparams: {
				authorizationid: aIDs[i]
			}
		}, {
			success: function () {
				if (!--length) {
					this.remove._disabled(false);
					this.__fillDataGrid();
				}
			},
			error: function (error) {
				gui.notifier._value({
					type: 'alert',
					args: {
						header: '',
						text: 'ERROR::' + error
					}
				});
				if (!--length) {
					this.remove._disabled(false);
					this.__fillDataGrid();
				}
			},
			context: this
		});
	}
};

_me.__fillDataGrid = function () {
	icewarpapi.send({
		commandname: 'getoauthauthorizations'
	}, {
		success: function (response) {
			if (response){
				var aData = {},
					items = Is.Array(response.item)?response.item:[response.item];

				for (var i in items) {
					if (items.hasOwnProperty(i)){
						items[i].scopes = Is.Array(items[i].scopes.item)?items[i].scopes.item.join(', '):items[i].scopes.item;
						items[i].description = items[i].description || '';
						items[i].created = new IcewarpDate(items[i].created * 1000).format('L LT');

						aData[items[i].id] = {
							id: items[i].id,
							data: items[i]
						};
					}
				}

				this.oauth._serverSort(aData);
			}
		},
		error: function (error) {
			gui.notifier._value({
				type: 'alert',
				args: {
					header: '',
					text: 'ERROR::' + error
				}
			});
		},
		context: this
	});
};
