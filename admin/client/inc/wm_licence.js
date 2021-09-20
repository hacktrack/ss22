/*
 *	Get and manage licence information
 *
 *	Martin Ekblom 2017
 */

if (!window.com) window.com = {};

com.licence = (function () {
	// Constructor
	function Licence() {
		this.xmlns = 'rpc';
	}
	// Inherit from Generic
	Licence.prototype = Object.create(IWServerInteraction.prototype);

	// Get general licence info
	Licence.prototype.get = function (callback) {
		this.getResult(
			this.createCommand('getlicenseinfo', {}),
			callback
		);
	}

	// Manage licence request
	Licence.prototype.manage = function (type, callback) {
		var types = {
			License: 0,
			Manage: 1,
			Trial: 2,
			Client: 3,
			Client_Seats: 4,
			LicenseGeneral: 5,
			Seats: 6,
			Uninstall: 7,
			CloudPlanChange: 8,
			CloudBillingChange: 9,
			CloudInvoices: 10,
			SupportPortal: 11,
			CloudCancelPlan: 12,
			CloudPortal: 13
		};
		// Create and send managecloudlicense
		this.getResult(
			this.createCommand('managecloudlicense', {
				licenserequest: types[type]
			}),
			callback
		);
	}

	Licence.prototype.getLicenseManagementSecret = function (callback) {
		this.getResult(
			this.createCommand('getlicensemanagementsecret', {}),
			callback
		);
	}

	Licence.prototype.getLicenseManagementCallbackURL = function (callback) {
		this.getResult(
			this.createCommand('getlicensemanagementcallbackurl', {}),
			callback
		);
	}

	Licence.prototype.getTotalSaasUsage = function (callback) {
		this.getResult(
			this.createCommand('gettotalsaasusage', {}),
			callback
		);
	}

	// Assign to com
	return new Licence();
})();
