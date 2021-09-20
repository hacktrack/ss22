/*
 *	Manipulating user/domain/server properities
 *
 *	Martin Ekblom 2017
 */

if(!window.com) window.com={};

com.properties = (function() {
	// Constructor
	function PropertyManager() {
		this.xmlns = 'rpc';
	}
	// Inherit data manipulation tools
	PropertyManager.prototype = Object.create(IWServerInteraction.prototype);

	// Parse function for server response
	var parse = function(result,type,id) {
		if(result.length) {
			var properties;

			switch(type) {
				case 'Account':
					properties = new AccountProperties(id);
					break;
				case 'Domain':
					properties = new DomainProperties(id);
					break;
				default:
					properties = new ServerProperties();
			} 

			// Parse property data from server and add to collection
			return parseAll(result,properties);
		} else {
			// error
		}

	}

	// Add properties from server to collection
	var parseAll = function(result,collection) {
		for(var i=0,l=result.length; i<l; i++) {
			var item = parseOne(result[i]);

			Object.defineProperty(item,"propertyCollection",{
				enumerable: false,
				writable: false,
				configurable: false,
				value: collection
			});

			collection.addItem(item);
		}
		// Single values or collections are returned directly
		if(result.length==1) {
			collection = item;
		}

		return collection;
	}

	// General parsing of property structure from server
	var parseOne = function(data) {
		var classname = data.propertyval.classname.value;
		switch(classname) {
			case 'TPropertyNoValue':
				var item = new PropertyValue(null,data.apiproperty.propname.value);
				break;
			case 'TPropertyString':
				var item = new PropertyValue(data.propertyval.val.value,data.apiproperty.propname.value);
				break;
			case 'TPropertyStringList':
				var item = new PropertyList(data.apiproperty.propname.value);
				for(var i=0,l=data.propertyval.val.length; i<l; i++) {
					item.addItem(new PropertyMember(data.propertyval.val[i].value,'item'));
				}
				break;
			default:
				var item = new PropertyCollection(data.apiproperty.propname.value);
				for(var name in data.propertyval) {
					if(name!='classname') {
						item.addItem(new PropertyMember(data.propertyval[name].value,name));
					}
				}
		}

		if(data.propertyright==1) {
			item.readOnly(true);
		}

		if(data.propertyright==0) {
			item.noAccess(true);
		}

		Object.defineProperty(item,"propertyClass",{
			enumerable: false,
			writable: true,
			configurable: classname=="TPropertyNoValue",
			value: classname
		});

		Object.defineProperty(item,"propertyName",{
			enumerable: false,
			writable: false,
			configurable: false,
			value: data.apiproperty.propname.value
		});

		Object.defineProperty(item,"propertyRights",{
			enumerable: false,
			writable: false,
			configurable: false,
			value: data.propertyright.value
		});

		return item;
	}

	// A particular value in a property list or collection
	function PropertyMember(value,label) {
		IWAPI.Value.call(this,value,label);

		var denied = false;

		// Handle denied access
		Object.defineProperty(this,"denied",{
			get: function() {
				return denied;
			},
			set: function(v) {
				denied = v;
			},
			enumerable: false,
			configurable: false
		});
		// To be consistent with lists and collection, denied can be read or changed also with function
		Object.defineProperty(this,'noAccess',{
			enumerable: false,
			writable: false,
			value: function(inaccessible) {
				if(typeof inaccessible == 'boolean') {
					denied = inaccessible;
				} else {
					return denied;
				}
			}
		});

	}
	PropertyMember.prototype = Object.create(IWAPI.Value.prototype);

	// Property with a single value
	function PropertyValue(value,label) {
		PropertyMember.call(this,value,label);
	}
	PropertyValue.prototype = Object.create(PropertyMember.prototype);
	PropertyValue.prototype.toXMLString = function() {
		var i = new IWAPI.Collection('item');
		var c = new IWAPI.Collection('apiproperty');
		c.addItem('propname',this.propertyName);
		i.addItem(c);
		var c = new IWAPI.Collection('propertyval');
		c.addItem('classname',this.propertyClass);
		switch(this.propertyClass) {
			case 'TPropertyNoValue':
				break;
			case 'TPropertyString':
				c.addItem('val',this.value);
				break;
			default:
				c.addItem(this.label,this.value);
		}
		i.addItem(c);
		return i.toXMLString.apply(i,arguments);
	}
	PropertyValue.prototype.changeType = function(type) {
		if(this.propertyCollection instanceof AccountProperties) {
			var level = 'TAccount';
		}
		var item = parseOne(createPropertyTemplate(this.propertyName,level+type));
		var collection = this.propertyCollection;
		Object.defineProperty(item,"propertyCollection",{
			enumerable: false,
			writable: false,
			configurable: false,
			value: collection
		});
		collection.removeItem(this.propertyName);
		collection.addItem(item);
		return item;
	}
	PropertyValue.prototype.saveChanges = function(callback) {
		this.propertyCollection.saveChanges(callback,this.propertyName);
	}

	// Property with multiple values
	function PropertyCollection(label) {
		IWAPI.Collection.call(this,label);

	}
	PropertyCollection.prototype = Object.create(IWAPI.Collection.prototype);
	Object.defineProperty(PropertyCollection.prototype,'toXMLString',{
		enumerable: false,
		writable: false,
		value: function() {
			var i = new IWAPI.Collection('item');
			var c = new IWAPI.Collection('apiproperty');
			c.addItem('propname',this.propertyName);
			i.addItem(c);
			var c = new IWAPI.Collection('propertyval');
			c.addItem('classname',this.propertyClass);
			for(var l in this) {
				c.addItem(this[l]);
			}
			i.addItem(c);
			return i.toXMLString.apply(i,arguments);
		}
	});
	Object.defineProperty(PropertyCollection.prototype,"noAccess",{
		enumerable: false,
		writable: false,
		value: function(inaccessible) {
			if(typeof inaccessible == 'boolean') {
				for(var i in this) {
					this[i].noAccess(inaccessible);
				}
			} else {
				for(var i in this) {
					if(this[i].noAccess()) {
						return true;
					}
				}
				return false;
			}
		}
	});
	Object.defineProperty(PropertyCollection.prototype,'saveChanges',{
		enumerable: false,
		writable: false,
		value: function(callback) {
			this.propertyCollection.saveChanges(callback,this.propertyName);
		}
	});

	// Property with a multiple values
	function PropertyList(label) {
		IWAPI.List.call(this,label);

	}
	PropertyList.prototype = Object.create(IWAPI.List.prototype);
	Object.defineProperty(PropertyList.prototype,'toXMLString',{
		enumerable: false,
		writable: false,
		value: function() {
			var i = new IWAPI.Collection('item');
			var c = new IWAPI.Collection('apiproperty');
			c.addItem('propname',this.propertyName);
			i.addItem(c);
			var c = new IWAPI.Collection('propertyval');
			c.addItem('classname',this.propertyClass);
			var l = new IWAPI.List('val');
			for(var n=0; n<this.length; n++) {
				l.addItem(this[n]);
			}
			c.addItem(l);
			i.addItem(c);
			return i.toXMLString.apply(i,arguments);
		}
	});
	IWAPI.List.prototype.noAccess = function(inaccessible){
		var i = this.length;
		if(typeof inaccessible == 'boolean') {
			while(i--) {
				this[i].noAccess(inaccessible);
			}
			return false;
		} else {
			while(i--) {
				if(this[i].noAccess()) {
					return true;
				}
			}
			return false;
		}
	}
	Object.defineProperty(PropertyList.prototype,'saveChanges',{
		enumerable: false,
		writable: false,
		value: function(callback) {
			this.propertyCollection.saveChanges(callback,this.propertyName);
		}
	});

	// Create new properties on client side
	var createPropertyTemplate = function(label,type,content) {
		content = content || {};

		var i = new IWAPI.Collection('item');
		var c = new IWAPI.Collection('apiproperty');
		c.addItem('propname',label);
		i.addItem(c);
		var c = new IWAPI.Collection('propertyval');
		c.addItem('classname',type);
		// Common property types
		switch(type) {
			case 'TPropertyString':
				c.addItem('val',typeof content=='string' ? content : '');
				break;
			case 'TPropertyStringList':
				var list = new IWAPI.List('val');
				if(content instanceof Array) {
					for(var n=0, l=content.length; n<l; n++) {
						list.addItem('item',content[n]);
					}
				}
				c.addItem(list);
				break;
			case 'TAccountName':
				c.addItem('name', content.name || '');
				c.addItem('surname', content.surname || '');
				break;
			case 'TAccountImage':
				c.addItem('contenttype', content.contenttype || '');
				c.addItem('base64data', content.base64data || '');
				break;
			default:
				// Custom property type
				if(typeof content == 'object') {
					for(var pn in content) {
						c.addItem(pn,content[pn]);
					}
					if(pn==undefined) {
						c.classname.value = 'TPropertyNoValue';
					}
				}			
		}
		i.addItem(c);
		i.addItem('propertyright','2');
		return i;
	}

	PropertyManager.prototype.createProperty = function(label,type,content) {
		var p = createPropertyTemplate.apply(this,arguments);
		return parseOne(p);
	}

	PropertyManager.prototype.createAccountProperties = function(id,props) {
		props = props || [];

		var proplist = new AccountProperties(id);
		for(var i=0, l=props.length; i<l; i++) {
			props[i] = createPropertyTemplate.apply(this,props[i]);
		}
		return parseAll(props,proplist);
	}

	PropertyManager.prototype.createDomainProperties = function(props) {
		props = props || [];

		var proplist = new DomainProperties();
		for(var i=0, l=props.length; i<l; i++) {
			props[i] = createPropertyTemplate.apply(this,props[i]);
		}
		return parseAll(props,proplist);
	}

	PropertyManager.prototype.getWebmailResources = function(resources, callback) {
		var parameters = {
			resources: (Array.isArray(resources) ? resources : [resources]).map(function (prop) {
				return {name: prop};
			}),
			selector: gui._globalInfo.domain,
			level: 1
		};

		var request = this.createCommand('GetWebmailResources', parameters);
		this.getResult(request,callback);

	}

	// Server interaction
	PropertyManager.prototype.get = function(property,callback,opts) {
		var command;
		var opts = opts || {};
		var parameters = {};

		var properties = this.makeList(property);

		// Complete request detains depending on level
		switch(opts.type) {
			case 'Account':
				command = 'GetAccountProperties';
				parameters.accountemail = opts.id;
				if(opts.set) {
					parameters.accountpropertyset = opts.set;
				}
				parameters.accountpropertylist = properties;
				break;
			case 'Domain':
				command = 'GetDomainProperties';
				parameters.domainstr = opts.id;
				parameters.domainpropertylist = properties;
				break;
			default:
				command = 'GetServerProperties';
				parameters.serverpropertylist = properties;
		}

		var request = this.createCommand(command,parameters);

		var call = function(result) {
			callback(parse(result,opts.type,opts.id));
		};

		this.getResult(request,call);

	}

	// Prepare property names for request, publicly accessible
	PropertyManager.prototype.makeList = function(propertyname) {
		var properties = [];
		// Add properties to request
		if(propertyname instanceof Array) {
			for(var i=0,l=propertyname.length; i<l; i++) {
				properties.push({propname: propertyname[i]});
			}
		} else {
			properties.push({propname: propertyname});
		}
		return properties;
	}

	// Private helper function for saving properties
	function saver(request,callback,property,all) {
		if(all || this.hasChanged()) {
			// Determining item list name
			var listname = 'propertyvaluelist';
			switch(request.commandname.value) {
				case 'CreateAccount':
					listname = 'accountproperties';
					break;
			}
			request.commandparams.addItem(new IWAPI.List(listname));
			if(property) {
				// Save only a specific property
				if(this[property].hasChanged()) {
					request.commandparams[listname].addItem(this[property]);
				}
			} else {
				// Save all changed propeties (or all properties if specified)
				for(var i in this) {
					if(all || this[i].hasChanged()) {
						request.commandparams[listname].addItem(this[i]);
					}
				}
			}
			com.properties.executeCommand(request,function(result){
				if(result==1) {
					if(property) {
						this[property].commitChanges();
					} else {
						this.commitChanges();
					}
				}
				callback(result);
			}.bind(this));
			return true;
		} else {
			return false;
		}
	}

	function ServerProperties(label) {
		// Call super
		IWAPI.Collection.call(this,'server');
	}
	ServerProperties.prototype = Object.create(IWAPI.Collection.prototype);
	Object.defineProperty(ServerProperties.prototype,"saveChanges",{
			enumerable: false,
			writable: false,
			configurable: false,
			value: function(callback,property) {
				var request = com.properties.createCommand(
					'SetServerProperties',{}
				);
				var save = saver.bind(this);
				save(request,callback,property);
			}
		}
	);

	function DomainProperties(label) {
		// Call super
		IWAPI.Collection.call(this,'domain');
		// Remember domain name
		Object.defineProperty(this,"domainName",{
			enumerable: false,
			writable: false,
			configurable: false,
			value: label
		});
		// Add domainname if serialized to xml
		this.setAttribute('name',label);
	}
	DomainProperties.prototype = Object.create(IWAPI.Collection.prototype);
	Object.defineProperty(DomainProperties.prototype,"saveChanges",{
			enumerable: false,
			writable: false,
			configurable: false,
			value: function(callback,property) {
				var request = com.properties.createCommand(
					'SetDomainProperties',
					{domainstr: this.domainName}
				);
				var save = saver.bind(this);
				save(request,callback,property);
			}
		}
	);

	function AccountProperties(label) {
		// Call super
		IWAPI.Collection.call(this,'account');
		var part = label.split("@");
		// Remember domain name
		Object.defineProperty(this,"domainName",{
			enumerable: false,
			writable: true,
			configurable: false,
			value: part.length == 1 ? part[0] : part[1]
		});
		// Remember user name
		Object.defineProperty(this,"accountName",{
			enumerable: false,
			writable: true,
			configurable: false,
			value: part.length==2 ? label : ''
		});
		// Add username if serialized to xml
		this.setAttribute('user',label);
	}
	AccountProperties.prototype = Object.create(IWAPI.Collection.prototype);
	// @todo: implement saveChanges / saveAll properly (automatically commitChanges)
	Object.defineProperty(AccountProperties.prototype,"saveChanges",{
			enumerable: false,
			writable: false,
			configurable: false,
			value: function(callback,property) {
				var request = com.properties.createCommand(
					'SetAccountProperties',
					{accountemail: this.accountName}
				);
				var save = saver.bind(this);
				save(request,callback,property);
			}
		}
	);
	Object.defineProperty(AccountProperties.prototype,"saveNew",{
		enumerable: false,
		writable: false,
		configurable: false,
		value: function(callback,property) {
			var request = com.properties.createCommand(
				'CreateAccount',
				{domainstr: this.domainName}
			);
			var save = saver.bind(this);
			save(request,callback,property,true);
		}
	}
);

	// Access to account properties
	PropertyManager.prototype.user = function(user) {
		return com.account(user);
	}

	// Access to domain properties
	PropertyManager.prototype.domain = function(domain) {
		return new Domain(domain);
	}

	// Access to server properties
	return new PropertyManager();
})();
