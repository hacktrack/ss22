/*
 *	Get and manage account members
 *
 *	Martin Ekblom 2018
 */

com.members = (function() {
	// Constructor
	function AccountMembers() {
		this.xmlns = 'rpc';		
	}
	// Inherit from Generic
	AccountMembers.prototype = Object.create(IWServerInteraction.prototype);

	AccountMembers.rightlabels = {
		default: getLang('mailinglist::default'),
		recieve: getLang('mailinglist::receive'),	// Receive misspelled on server
		post: getLang('mailinglist::post'),
		digest: getLang('mailinglist::digest')
	};

	// Get the member list for this account (for group, mailinglist and resourse accounts)
	AccountMembers.prototype.getList = function(account) {
		return com.list.fetch('AccountMember',{who: account},null,null,function(item){
			var rights = [];
			for(var right in AccountMembers.rightlabels) {
				if(+item[right]) {
					rights.push(AccountMembers.rightlabels[right]);
				}
			}
			rights = rights.join(', ');
			item.addItem('email',item.val.toString());
			item.addItem('rights',rights);
		});
	}

	// Helper to prepare member lists for add, edit and delete requests
	var prepareMembersList = function(members,rights) {
		members = members || [];
		rights = rights || {};
		
		var items=[];
		var n = members.length;
		while(n--) {
			// Add basic member properties
			var item = {
				classname: 'tpropertymember',
				val: members[n].toString()
			};
			// If any rights should be applied add them
			for(var r in rights) {
				item[r] = rights[r];
			}
		
			items.unshift(item);
		}
	
		return items;
	}

	// Add new members to an account
	AccountMembers.prototype.add = function(account,list,aHandler){
		var rights = {default: 1};
	
		var query = this.createCommand('addaccountmembers',{
			accountemail: account,
			members: {
				classname: 'tpropertymembers',
				val: prepareMembersList(list,rights)
			}
		});
	
		this.executeCommand(query,aHandler);
	}
	
	// Change the rights of selected account members
	AccountMembers.prototype.edit = function(account,list,rights,aHandler){
		// Receive rights misspelled on server, change to wrong spelling
		if(rights.receive) {
			rights.recieve = rights.receive;
			delete rights.receive;
		}
	
		var query = this.createCommand('editaccountmembers',{
			accountemail: account,
			members: {
				classname: 'tpropertymembers',
				val: prepareMembersList(list,rights)
			}
		});
	
		this.executeCommand(query,aHandler);
	}
	
	// Change the rights of all members of the account
	AccountMembers.prototype.editAll = function(account,rights,aHandler){
		// Receive rights misspelt on server, change to wrong spelling
		if(rights.receive) {
			rights.recieve = rights.receive;
			delete rights.receive;
		}
	
		var query = this.createCommand('EditAllAccountMembersRights',{
			accountemail: account,
			rights: rights
		});
	
		this.executeCommand(query,aHandler);
	}
	
	// Delete selected members from account
	AccountMembers.prototype.remove = function(account,list,aHandler){
	
		var query = this.createCommand('deleteaccountmembers',{
			accountemail: account,
			members: {
				classname: 'tpropertymembers',
				val: prepareMembersList(list)
			}
		});
	
		this.executeCommand(query,aHandler);
	}
	
	// Delete all members of an account
	AccountMembers.prototype.removeAll = function(account,aHandler){
		this.executeCommand(
			this.createCommand('deleteAllAccountMembers',{
				accountemail: account
			}),aHandler
		);
	}

	// Assign to com
	return new AccountMembers();
})();
