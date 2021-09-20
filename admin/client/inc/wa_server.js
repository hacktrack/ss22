/*
 *	Core Data Model - Server level interaction
 *
 *	Martin Ekblom 2017
 */

com = (function() {
	// Constructor
	function Server() {

	}

	// Easy access to users
	Server.prototype.account = function(id) {
		return new Account(id);
	}

	// Easy access to users
//	Server.prototype.domain = function(id) {
//		return new Domain(id);
//	}

	// Get Server properties - convenience access
	Server.prototype.getProperty = function(prop,callback) {
		this.getProperties([prop],callback);
	}
	Server.prototype.getProperties = function(props,callback) {
		com.properties.get(props,callback);
	}

	// Get account settings on server level
	Server.prototype.getSettings = function(resource,cb) {
		com.settings.get(resource,cb);
	}
	
	// Assign to com
	return new Server();
})();
