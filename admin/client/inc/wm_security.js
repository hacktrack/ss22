

/*
 *	Managing Security freatures for users and domains
 *
 *	Martin Ekblom 2018
 */

com.security = (function() {
	// Constructor
	function SecurityManager() {
		this.xmlns = 'rpc';		
	}
	SecurityManager.prototype = Object.create(IWServerInteraction.prototype);

	// Reset DKIM settings for a domain
	SecurityManager.prototype.resetDKIM = function(domain,callback) {
		this.getResult(
			this.createCommand('ResetDKIM',{
				domain: domain
			}),
			callback
		);
	}

	// Reset 2 factor authetication for a user
	SecurityManager.prototype.reset2Factor = function(email,callback) {
		this.getResult(
			this.createCommand('Reset2Factor',{
				email: email
			}),
			callback
		);
	}
	
	// Assign to com
	return new SecurityManager();
})();