function obj_topbar() {};

obj_topbar.prototype.__constructor = function (type) {
	if (this['_setup_' + type]) {
		this['_setup_' + type].call(this, function (groups) {
			this._draw('obj_topbar', '', {
				groups: groups
			});
			groups.forEach(function(group) {
				group.stats.forEach(function(stat) {
					if(stat.button) {
						this[stat.button.name]._onclick = stat.button.onclick;
					}
				}, this);
			}, this);
			this._main.setAttribute('iw-type', 'stats');
		}.bind(this))
	} else {
		this._destruct();
	}
};

obj_topbar.prototype._setup_subscription = function (callback) {
	this._getTrafficInfo(function (trafficInfo) {
		var cloudinfo = gui._globalInfo.licence.cloudinfo || {};
		callback([
			{
				stats: [
					+cloudinfo.cloudplanislive && +cloudinfo.cloudshowprice && {
						icon: 'resources',
						name: getLang('DASHBOARD::NEXT_BILLING'),
						class: 'u-normal-line-height',
						value: cloudinfo.creditcardchargedate
					},
					{
						icon: 'collaboration',
						name: getLang('DASHBOARD::ACTIVE_USERS'),
						value: trafficInfo.statistics_activeusers
					},
					+cloudinfo.cloudshowprice && {
						icon: 'price-2',
						name: getLang('DASHBOARD::PRICE_USER_MONTH'),
						class: 'u-normal-line-height',
						value: +cloudinfo.cloudplanislive ? (+cloudinfo.nextinvoice.price).toCurrency(cloudinfo.nextinvoice.currency.toString()) : getLang('SUBSCRIPTION::FREE')
					},
					gui._globalInfo.licence.licensetype == 'cloud' && {
						icon: 'storage',
						name: getLang('DASHBOARD::STORAGE'),
						value: (+trafficInfo.statistics_usedspace).toComputerByteUnits(1)
					}
				].filter(Boolean)
			}
		]);
	});
};

obj_topbar.prototype._setup_dashboard = function (callback) {
	this._getTrafficInfo(function (trafficInfo, saasusage) {
		var groups;
		if (+gui._globalInfo.licence.iscloud) {
			return callback(this._setup_dashboard_cloud(trafficInfo, saasusage));
		} else if (gui._globalInfo.licence.plans.length) {
			groups = this._setup_dashboard_cloud(trafficInfo, saasusage);
			groups[1].stats[0].span = 4;
			groups[1].stats.splice(1, 1);
			return callback(groups);
		}
		return callback(this._setup_dashboard_standard(trafficInfo));
	}.bind(this));
};

obj_topbar.prototype._setup_dashboard_cloud = function (trafficInfo, saasusage) {
	var groups = [
		{
			stats: []
		},
		{
			modifier: 'faded',
			stats: []
		}
	];
	var active_users_span = 8 - (gui._globalInfo.licence.plans.length || 0);
	if (active_users_span > 4) {
		active_users_span = 4;
	}
	if (active_users_span < 2) {
		active_users_span = 2;
	}

	groups[0].stats.push({
		icon: 'collaboration',
		name: getLang('DASHBOARD::ACTIVE_USERS'),
		value: trafficInfo.statistics_activeusers,
		span: active_users_span,
		button: {
			label: 'subscription::manage_subscription',
			name: 'manage_subscription',
			onclick: function () {
				location.hash = "menu=subscription";
			}.bind(this)
		}
	});

	gui._globalInfo.licence.plans.forEach && gui._globalInfo.licence.plans.forEach(function (plan, i) {
		if (i > 5) {
			return; // show max 6 plans
		}
		var label = getLang("SUBSCRIPTION_PLANS::" + plan.planlabel);
		groups[0].stats.push({
			icon: 'plan',
			name: getLang('SUBSCRIPTION::NUMBER_OF_USERS'),
			value: ~label.indexOf("::") ? plan.planlabel : label,
			count: +(saasusage.filter(function(plan2) {
				return +plan.planid === +plan2.planid;
			})[0] || {}).plancount || '0',
			class: 'column reverse highlighted',
			span: 1,
			modifier: 'plan'
		})
	});

	groups[1].stats = [{
		icon: 'storage',
		name: getLang('DASHBOARD::STORAGE'),
		value: (+trafficInfo.statistics_usedspace).toComputerByteUnits(1),
		span: 2
	}, {
		icon: 'cluster-ico',
		name: getLang('DASHBOARD::CLUSTER_ID'),
		value: gui._globalInfo.licence.cloudinfo && gui._globalInfo.licence.cloudinfo.clusterid,
		class: 'column highlighted',
		span: 2
	}, {
		icon: 'sent',
		name: getLang('DASHBOARD::MAIL_SENT'),
		value: trafficInfo.statistics_mailsent,
		suffix: 'mail_sent_period',
		span: 2
	}, {
		icon: 'email',
		name: getLang('DASHBOARD::MAIL_RECEIVED'),
		value: trafficInfo.statistics_mailreceived,
		suffix: 'mail_received_period',
		span: 2
	}];

	return groups;
};

obj_topbar.prototype._setup_dashboard_standard = function (trafficInfo) {
	return [{
		stats: [{
				icon: 'collaboration',
				name: getLang('DASHBOARD::ACTIVE_USERS'),
				value: trafficInfo.statistics_activeusers,
				span: 2
			},
			{
				icon: 'storage',
				name: getLang('DASHBOARD::STORAGE'),
				value: (+trafficInfo.statistics_usedspace).toComputerByteUnits(1),
				span: 2
			}, {
				icon: 'sent',
				name: getLang('DASHBOARD::MAIL_SENT'),
				value: trafficInfo.statistics_mailsent,
				suffix: 'mail_sent_period',
				span: 2
			}, {
				icon: 'email',
				name: getLang('DASHBOARD::MAIL_RECEIVED'),
				value: trafficInfo.statistics_mailreceived,
				suffix: 'mail_received_period',
				span: 2
			}
		]
	}];
};

obj_topbar.prototype._getTrafficInfo = function (callback) {
	com.server.trafficInfo(function (trafficInfo) {
		com.licence.getTotalSaasUsage(function(saasUsage) {
			var cloudInfo = gui._globalInfo.licence.cloudinfo;
			if (cloudInfo && gui._globalInfo.licence.iscloud == 1) {
				var cost = cloudInfo.cloudplanprice * trafficInfo.statistics_activeusers;
				var mincost = +(cloudInfo.cloudplanminprice || 0);
				if (cost < mincost) {
					cost = mincost;
				}
				trafficInfo.price = cost.toCurrency(cloudInfo.cloudplancurrency.toString() || 'CZK');
			}
			callback(trafficInfo, saasUsage.planusagelist)
		});
	});
};
