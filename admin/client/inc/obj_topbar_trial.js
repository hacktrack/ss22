function obj_topbar_trial() {};

obj_topbar_trial.prototype.__constructor = function () {
	this._draw('obj_topbar_trial', '', {
		end: (gui._globalInfo.licence.cloudinfo && gui._globalInfo.licence.cloudinfo.creditcardchargedate) || ''
	});
	this._main.setAttribute('iw-type', 'trial');

	this.upgrade_from_trial._onclick = function () {
		com.licence.getLicenseManagementCallbackURL(function (callback) {
			obj_subscription.prototype._openLicensePopup('change-subscription', function() {
				location.hash = "menu=subscription";
			}, {
				heading: getLang('SUBSCRIPTION::SUBSCRIPTION_SETTINGS'),
				callback: callback.url.toString()
			});
		});
	}.bind(this);
};
