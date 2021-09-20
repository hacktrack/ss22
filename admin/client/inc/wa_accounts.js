/*
 *	Core Data Model - Account level interaction
 *
 *	Martin Ekblom 2017
 */

var Account = function(id) {
	this.type = 'Account';
	this.id = id;
}

// Account type constants
Account.USER = '0';
Account.GROUP = '7';
Account.RESOURCE = '8';
Account.MAILINGLIST = '1';

// Convenience access to properties for accounts
Account.prototype.getProperty = function(props,cb,opts) {
	this.getProperties([props],cb,opts);
}
Account.prototype.getProperties = function(props,cb,opts) {
	opts = opts || {}
	opts.type = this.type;
	opts.id = this.id;
	com.properties.get(props,cb,opts);
}
Account.prototype.getPropertySet = function(props,cb,opts) {
	opts = opts || {}
	opts.type = this.type;
	opts.id = this.id;
	opts.set = 1;
	com.properties.get(props,cb,opts);
}

// Get the member list for this account (for group, mailinglist and resourse accounts)
Account.prototype.getMemberList = function() {
	return com.members.getList(this.id);
}