
/*
 *	Core Data Model - Domain level interaction
 *
 *	Martin Ekblom 2017
 */

var Domain = function(id) {
	this.type = 'Domain';
	this.id = id;
}

// Convenience access to properties for domains
Domain.prototype.getProperty = function(props,cb,opts) {
	this.getProperties([props],cb,opts);
}
Domain.prototype.getProperties = function(props,cb,opts) {
	opts = opts || {}
	opts.type = this.type;
	opts.id = this.id;
	com.properties.get(props,cb,opts);
}

// Get account settings on domain level
Domain.prototype.getSettings = function(resource,cb) {
	com.settings.get(resource,cb,{type: 'Domain', id: this.id});
}

// Create new accounts on this domain
Domain.prototype.createAccount = function(type) {
	switch(type) {
		case Account.GROUP:
			return this.createGroup();
		case Account.RESOURCE:
			return this.createResource();
		case Account.MAILINGLIST:
			return this.createMailingList();
		default:
			return this.createUser();
	}
}
Domain.prototype.createUser = function() {
	return com.properties.createAccountProperties(this.id,[
		['u_type','TPropertyString',Account.USER],
		['u_mailbox','TPropertyString'],
		['a_name','TAccountName'],
		['u_password','TPropertyString'],
		~['saas', 'cloud'].indexOf(gui._globalInfo.licence.licensetype.toString()) && ['u_saas_plan','TPropertyString']
	].filter(Boolean));
}
Domain.prototype.createGroup = function() {
	return com.properties.createAccountProperties(this.id,[
		['u_type','TPropertyString',Account.GROUP],
		['u_mailbox','TPropertyString'],
		['g_groupwarehabfolder','TPropertyString']
	]);
}
Domain.prototype.createResource = function() {
	return com.properties.createAccountProperties(this.id,[
		['u_type','TPropertyString',Account.RESOURCE],
		['u_mailbox','TPropertyString'],
		['u_name','TPropertyString'],
		['s_type','TPropertyString']
	]);
}
Domain.prototype.createMailingList = function() {
	return com.properties.createAccountProperties(this.id,[
		['u_type','TPropertyString',Account.MAILINGLIST],
		['u_mailbox','TPropertyString'],
		['m_sendalllists','TPropertyString','0']
	]);
}

// Get different kind of account lists
Domain.prototype.getAccountList = function(options) {
	var list = com.list.fetch('Accounts',{domainstr: this.id});
	if(options.type) {
		list.type(options.type);
	}
	return list;
}
Domain.prototype.getUserList = function() {
	return this.getAccountList({type: Account.USER});
}
Domain.prototype.getGroupList = function() {
	return this.getAccountList({type: Account.GROUP});
}
Domain.prototype.getMailingList = function() {
	return this.getAccountList({type: Account.MAILINGLIST});
}
Domain.prototype.getResourceList = function() {
	return this.getAccountList({type: Account.RESOURCE});
}
