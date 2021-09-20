function obj_subscription() {};

obj_subscription.prototype.__constructor = function (s) {
	gui.frm_main.main._setHeadingButton('generic::save', function () {
		this._save();
	}.bind(this), 'button text success');

};

// Hash handler to handle initialization of the page
obj_subscription.prototype._hash_handler = function () {
	var me = this;

	var cloudinfo = gui._globalInfo.licence.cloudinfo || {
		cloudplancurrency: ''
	};

	this.__currency = cloudinfo.cloudplancurrency.toString() || 'CZK';

	// Show monthly price in local currency or zero for trial
	var cost = +cloudinfo.cloudplanprice;

	this._draw('obj_subscription', '', {
		orderid: gui._globalInfo.licence.orderid,
		organization: gui._globalInfo.licence.organization,
		street: gui._globalInfo.licence.address1,
		region: gui._globalInfo.licence.locality,
		areacode: gui._globalInfo.licence.zip,
		country: gui._globalInfo.licence.countryname,
		package: cloudinfo.cloudplanname,
		storage: (+cloudinfo.cloudplanstorage).toComputerByteUnits(0, 'MB'),
		cluster: cloudinfo.clusterid,
		hypervisor: cloudinfo.cloudhypervisor,
		unitprice: cost.toCurrency(this.__currency),
		trial: cloudinfo.cloudplanislive != 1,
		nextbilling: cloudinfo.creditcardchargedate,
		carddigits: cloudinfo.creditcarddigits,
		cardexpiration: cloudinfo.creditcardexpiration,
		salescontact: (gui._globalInfo.licence.salescontact || '').toString(),
		technicalcontact: (gui._globalInfo.licence.technicalcontact || '').toString(),
		salescontact_url: !~(gui._globalInfo.licence.salescontact || '').toString().indexOf('@'),
		technicalcontact_url: !~(gui._globalInfo.licence.technicalcontact || '').toString().indexOf('@'),
		salesphone: cloudinfo.salesphone,
		cloudshowprice: +cloudinfo.cloudshowprice
	});

	if (gui._globalInfo.licence.plans.length) {
		com.licence.getTotalSaasUsage(function(result) {
			var plans = gui._globalInfo.licence.plans.map(function(plan) {
				var label = getLang("SUBSCRIPTION_PLANS::" + plan.planlabel);
				return {
					id: +plan.planid,
					icon: true,
					label: ~label.indexOf("::") ? plan.planlabel : label,
					users: +(result.planusagelist.filter(function(plan2) {
						return +plan.planid === +plan2.planid;
					})[0] || {}).plancount || '0'
				};
			});
			plans.push({
				users: plans.reduce(function(p, c) {
					return p + (+c.users);
				}, 0),
				modifier: 'total'
			});
			this._create('plans', 'obj_plans', 'fb_plan_details', '', {
				plans: plans
			});
		}.bind(this));
	} else {
		this._getAnchor('active_users').setAttribute('is-hidden', '');
		this._getAnchor('fb_plan_details').setAttribute('is-hidden', '');
	}

	if(+cloudinfo.cloudshowprice && +cloudinfo.cloudplanislive && cloudinfo.nextinvoice.plans.map) {
		var total = 0;
		var currency;
		var plans = cloudinfo.nextinvoice.plans.map(function(plan) {
			var label = getLang("SUBSCRIPTION_PLANS::" + plan.planlabel);
			total += +plan.subtotal;
			currency = plan.currency;
			return {
				id: plan.planid,
				label: ~label.indexOf("::") ? plan.planlabel : label,
				users: plan.count,
				price: (+plan.subtotal).toCurrency(plan.currency),
				price_per_user: (+plan.price).toCurrency(plan.currency)
			};
		});
		if(cloudinfo.nextinvoice && +cloudinfo.nextinvoice.price && total < +cloudinfo.nextinvoice.price) {
			total = +cloudinfo.nextinvoice.price;
		}
		this._create('plans', 'obj_plans', 'fb_next_billing', 'plans--billing', {
			show_prices: +cloudinfo.cloudshowprice,
			yearly: cloudinfo.cloudplanbillingperiod.toString() !== 'MONTH',
			plans: plans.concat({
				label: getLang('SUBSCRIPTION::TOTAL_PRICE') + ':',
				price: total.toCurrency(currency),
				modifier: 'total'
			})
		});
		var billing_period;
		var billing_period_from = new Date(cloudinfo.nextinvoice.billingfrom.toString());
		var billing_period_to = new Date(cloudinfo.nextinvoice.billingto.toString());
		if(billing_period_from.getFullYear() === billing_period_to.getFullYear() && billing_period_from.getMonth() === billing_period_to.getMonth()) {
			billing_period = billing_period_from.getDate() + '. - ' + billing_period_to.format('d. MMMM yyyy');
		} else {
			billing_period = billing_period_from.format('d. MMMM yyyy') + ' - ' + billing_period_to.format('d. MMMM yyyy');
		}

		this._getAnchor('billing_period').textContent = billing_period;
	} else {
		this._getAnchor('fb_last_invoices').setAttribute('is-hidden', '');
		this._getAnchor('fb_last_invoices_title').setAttribute('is-hidden', '');
		this._getAnchor('fb_next_billing').setAttribute('is-hidden', '');
		this._getAnchor('fb_next_billing_title').setAttribute('is-hidden', '');
	}

	if(gui._globalInfo.licence.licensetype.toString() === 'cloud') {
		this._getAnchor('support_title').setAttribute('is-hidden', '');
		this._getAnchor('datacenter_storage_support_title').removeAttribute('is-hidden');
		this._getAnchor('support_topbar').removeAttribute('is-hidden');
		this._draw('obj_topbar', 'support_topbar', {
			groups: [
				{
					stats: [
						{
							icon: 'cluster-ico',
							name: getLang('DASHBOARD::CLUSTER_ID'),
							value: cloudinfo.clusterid,
							span: 4
						},
						{
							icon: 'hypervisor',
							name: getLang('DASHBOARD::HYPERVISOR'),
							value: cloudinfo.cloudhypervisor,
							span: 4
						}
					]
				}
			]
		});
	}

	if(!gui._globalInfo.licence.technicalcontact.toString() && !gui._globalInfo.licence.salescontact.toString()) {
		this._getAnchor('support_title').setAttribute('is-hidden', '');
		this._getAnchor('support_panel').setAttribute('is-hidden', '');
		
	}

	// Add page heading
	gui.frm_main.main._init({
		name: 'subscription',
		heading: {
			value: getLang('main::subscription')
		}
	});

	gui.frm_main._initTopbar('subscription');

	// Hide saving button since it is not needed
	gui.frm_main.main.btn_heading._hide();

	this.plan_details._onclick = function () {
		me.plan_details._disabled(true);
		me._openLicensePopup('plan-details', function() {
			me.plan_details._disabled(false);
		}, {
			heading: getLang('SUBSCRIPTION::PLAN_DETAILS')
		});
	};

	// Activate button for getting link for plan change and open page
	this.subscription_settings._onclick = function (e) {
		me.subscription_settings._disabled(true);
		com.licence.getLicenseManagementCallbackURL(function (callback) {
			me._openLicensePopup('change-subscription', function() {
				me.subscription_settings._disabled(false);
			}, {
				heading: getLang('SUBSCRIPTION::SUBSCRIPTION_SETTINGS'),
				callback: callback.url.toString()
			});
		});
	}

	// Activate button for getting link for billing change and open page
	if (this.change_details) {
		this.change_details._onclick = function (e) {
			me.change_details._disabled(true);
			com.licence.getLicenseManagementCallbackURL(function (callback) {
				me._openLicensePopup('change-subscription', function() {
					me.change_details._disabled(false);
				}, {
					heading: getLang('SUBSCRIPTION::SUBSCRIPTION_SETTINGS'),
					callback: callback.url.toString()
				});
			});
		}
	}

	// Activate button for getting link for invoices list
	if (this.show_invoice_list) {
		this.show_invoice_list._onclick = function () {
			me.show_invoice_list._disabled(true);
			me._openLicensePopup('invoices', function() {
				me.show_invoice_list._disabled(false);
			}, {
				heading: getLang('SUBSCRIPTION::INVOICES')
			});
		}
	}

	// Fill in remaining fields with values
	this._load();
}

obj_subscription.prototype._openLicensePopup = function(type, callback, options) {
	com.licence.getLicenseManagementSecret(function (secret) {
		options = options || {};
		var params = {
			secret: secret.secret,
			timestamp: secret.timestamp,
			orderid: gui._globalInfo.licence.orderid,
			lang: storage.aStorage.language._ACTIVE_LANG || 'en',
			callback: encodeURIComponent(options.callback || '')
		};
		var query = Object.keys(params).map(function(key) {
			var value = params[key];
			return value ? key + '=' + value : false;
		}).filter(Boolean).join('&');
		var link = 'https://www.icewarp.com/cloud-admin/' + type + '?' + query;

		var popup = gui._create('popup', 'obj_popup');
		var popup_options = {
			fixed: false,
			name: 'iframe',
			heading: {
				value: options.heading || getLang('CHANGE_PLAN::TITLE')
			},
			iwattr: {
				height: options.height || 'full',
				width: options.width || 'large'
			},
			content: 'obj_iframe'
		};
		popup._init(popup_options);
		popup.content._load(link);

		callback();
	});
}

// Load content
obj_subscription.prototype._load = function () {
	if (this.list) {
		var cloudinfo = gui._globalInfo.licence.cloudinfo || {};
		this.list._empty();

		// Show the most recent invoice
		if (cloudinfo.lastinvoice) {
			var item = this.list._drawItem({
				id: cloudinfo.lastinvoice.id,
				date: cloudinfo.lastinvoice.date,
				price: parseInt(cloudinfo.lastinvoice.price).toCurrency(cloudinfo.lastinvoice.currency),
				link: cloudinfo.lastinvoice.link
			});
			item.getElementsByTagName('FORM')[0].addEventListener('click', function (e) {
				window.open(cloudinfo.lastinvoice.link, '_blank');
			}, true);
			this.show_invoice_list._main.removeAttribute('is-hidden')
		} else {
			this.show_invoice_list._main.setAttribute('is-hidden', '')
		}

		// Show previous invoice
		if (cloudinfo.secondlastinvoice) {
			var item = this.list._drawItem({
				id: cloudinfo.secondlastinvoice.id,
				date: cloudinfo.secondlastinvoice.date,
				price: parseInt(cloudinfo.secondlastinvoice.price).toCurrency(cloudinfo.lastinvoice.currency),
				link: cloudinfo.secondlastinvoice.link
			});
			item.getElementsByTagName('FORM')[0].addEventListener('click', function (e) {
				window.open(cloudinfo.secondlastinvoice.link, '_blank');
			}, true);
		}

		if (!cloudinfo.lastinvoice && !cloudinfo.secondlastinvoice) {
			var item = this.list._drawItem({});
			var li = item.getElementsByTagName('LI');
			li[0].removeAttribute('is-hidden');
			var l = li.length;
			while (--l) {
				li[l].parentNode.removeChild(li[l]);
			}
		}
	}

	// Get number of users and calculate total cost
	// com.statistics.get('Statistics_ActiveUsers', function (active_users) {
	// 	me._getAnchor('active_users').innerHTML = active_users;
	// 	var totalcost = gui._globalInfo.licence.cloudinfo.cloudplanprice * active_users;
	// 	var mincost = +(gui._globalInfo.licence.cloudinfo.cloudplanminprice || 0).toString();
	// 	if (totalcost < mincost) {
	// 		totalcost = mincost;
	// 	}
	// 	me._getAnchor('price_all_users_month').innerHTML = totalcost.toCurrency(me.__currency)
	// });
}
