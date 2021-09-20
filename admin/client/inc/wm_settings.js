/*
 *	Manipulating user/domain/server settings
 *
 *	Martin Ekblom 2018
 */

com.settings = (function() {
	// Constructor
	function SettingsManager() {
		this.xmlns = 'rpc';
	}
	// Inherit data manipulation tools
	SettingsManager.prototype = Object.create(IWServerInteraction.prototype);

	// Parse function for server response
	var parse = function(result,type,id,resource) {
		if(result.list) {
			var properties;

			switch(type) {
				case 'Account':
					properties = new UserSettings(id);
					break;
				case 'Domain':
					properties = new DomainSettings(id);
					break;
				default:
					properties = new ServerSettings();
			}

			// Make sure resource is in correct format
			var obj = {};
			if(resource instanceof Array) {
				var rs;
				while(rs = resource.shift()) {
					obj[rs] = true;
				}
				resource = obj;
			} else if(typeof resource=="string") {
				obj[resource] = true;
				resource = obj;
			}

			// Parse property data from server and add to collection
			return parseAll(result.list,properties,resource || {});
		} else {
			console.error("Server returned an error: ",result.error);
			return result;
		}

	}

	// Add settings from server to collection
	var parseAll = function(result,collection,resource) {

		// Handle no stored settings
		if(!(result instanceof IWAPI.List)) {
			result = new IWAPI.List("list");
		}

		// Find setting groupes stored on server
		var stored = {};
		for(var i=0,l=result.length; i<l; i++) {
			stored[result[i].name.value] = true;
		}

		// Add missing settins groups to set
		for(var name in resource) {
			if(!stored[name]) {
				addEmptySettingsCollection(result,name);
			}
		}

		// Parse settings from server and add missing settings as empty values
		for(var i=0,l=result.length; i<l; i++) {
			var name = result[i].name.value;

			// Language list special case setting
			if(name=='languages') {
				return parseLanguages(result[i]);
			}

			// Layouts special case setting
			if(name=='skins') {
				return parseLayouts(result[i]);
			}

			var item = parseOne(result[i],resource[name]);

			Object.defineProperty(item,"settingsCollection",{
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

	var parseLanguages = function(data) {
		var resourcename = data.name.value;

		// Languages is special case, list of available languages
		if(resourcename=="languages") {
			var languages = new LanguageMap(resourcename);
			for(var i=0, l=data.list.length; i<l; i++) {
				var lang = data.list[i].list;
				lang = new SettingsValue(
					lang[1].value.value,
					lang[0].value.value,
					{
						server: lang[0].accesslevel.value,
						domain: lang[0].domainadminaccesslevel.value,
						user: lang[0].useraccesslevel.value
					}
				);
				languages.addItem(lang);
			}
			return languages;
		}
	}

	var parseLayouts = function(data) {
		var resourcename = data.name.value;

		// Skins is special case, list of available layouts
		if(resourcename=="skins") {
			var layouts = new LayoutCollection(resourcename);
			for(var i=0, l=data.list.length; i<l; i++) {
				var lang = data.list[i].list;
				lang = new SettingsValue(
					lang[1].value.value,
					lang[0].value.value,
					{
						server: lang[0].accesslevel.value,
						domain: lang[0].domainadminaccesslevel.value,
						user: lang[0].useraccesslevel.value
					}
				);
				layouts.addItem(lang);
			}
			return layouts;
		}
	}

	// General parsing of settings structure from server
	var parseOne = function(data,resource) {
		var resourcename = data.name.value;
		var settings = data.list[0].list;
		var collection = new SettingsCollection(resourcename);
		for(var i=0, l=settings.length; i<l; i++) {
			var setting = new SettingsValue(
				settings[i].value.value,
				settings[i].name.value,
				{
					server: settings[i].accesslevel.value,
					domain: settings[i].domainadminaccesslevel.value,
					user: settings[i].useraccesslevel.value
				}
			);
			collection.addItem(setting);
		}

		// Add any missing settings as empty values
		if(resource instanceof Array) {
			for(var i=0, l=resource.length; i<l; i++) {
				if(!collection[resource[i]]) {
					var value = GWOthers.getItem(resourcename.toUpperCase(), resource[i].toUpperCase());
					collection.addItem(new SettingsValue(value === void 0 ? null : value,resource[i],{}));
				}
			}
		}

		return collection;
	}

	var addEmptySettingsCollection = function(container,name) {
		var coll = new IWAPI.Collection('item');
		coll.addItem('name',name);
		var list = new IWAPI.List('list');
		var item = new IWAPI.Collection(item);
		item.addItem(new IWAPI.List('list'));
		list.addItem(item);
		coll.addItem(list);
		container.addItem(coll);
	}

	// Setting with a single value
	function SettingsValue(value,label, rights) {
		IWAPI.Value.call(this,value,label);

		Object.defineProperty(this,"userAccess",{
			enumerable: false,
			writable: false,
			configurable: false,
			value: rights.user || ''
		});

		Object.defineProperty(this,"domainAccess",{
			enumerable: false,
			writable: false,
			configurable: false,
			value: rights.domain || ''
		});

		Object.defineProperty(this,"serverAccess",{
			enumerable: false,
			writable: false,
			configurable: false,
			value: rights.server || ''
		});

		// Allow some values to be inversed (UI elements will look on when off and opposite)
		var inversed = false;
		Object.defineProperty(this,"inversed",{
			get: function() {
				return inversed;
			},
			set: function(v) {
				inversed = v;
			},
			enumerable: false,
			configurable: false
		});
	}
	SettingsValue.prototype = Object.create(IWAPI.Value.prototype);
	SettingsValue.prototype.toXMLString = function() {
		if(this.hasChanged()) {
			var item = new IWAPI.Collection('item');
			item.addItem(new IWAPI.PersistentValue(this.label,'name'));
			item.addItem(new IWAPI.PersistentValue(this.value,'value'));
			return item.toXMLString.apply(item,arguments);
		} else return '';
	}
/*	SettingsValue.prototype.saveChanges = function(callback) {
		this.settingsCollection.saveChanges(callback,{this.this.label});
	}
	SettingsValue.prototype.resetAll = function(callback) {
		this.settingsCollection.resetAll(callback,this.label);
	}
*/
	// Property with multiple values
	function SettingsCollection(label) {
		IWAPI.Collection.call(this,label);

	}
	SettingsCollection.prototype = Object.create(IWAPI.Collection.prototype);
	Object.defineProperty(SettingsCollection.prototype,'toXMLString',{
		enumerable: false,
		writable: false,
		value: function(options) {
			options = options || {};
			if(options.reset || this.hasChanged()) {
				var list = new IWAPI.List('list');
				var item = new IWAPI.Collection('item');
				list.addItem(item);
				item.addItem(new IWAPI.PersistentValue(this.collectionLabel,'name'));
				item.addItem(new IWAPI.PersistentValue('0','resourcetype'));
				var containerlist = new IWAPI.List('list');
				var containeritem = new IWAPI.Collection('item');
				containerlist.addItem(containeritem);
				item.addItem(containerlist);
				var settings = new IWAPI.List('list');
				containeritem.addItem(settings);
				if(options.reset) {
					for(var setting in this) {
						var item = new IWAPI.Collection('item');
						item.addItem(new IWAPI.PersistentValue(this[setting].label,'name'));
						item.addItem(new IWAPI.PersistentValue('1','setdefault'));
						settings.addItem(item);
					}
				} else {
					for(var setting in this) {
						settings.addItem(this[setting]);
					}
				}
				return list.toXMLString.apply(list,arguments);
			} else return '';
		}
	});
	Object.defineProperty(SettingsCollection.prototype,"noAccess",{
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
	Object.defineProperty(SettingsCollection.prototype,'saveChanges',{
		enumerable: false,
		writable: false,
		value: function(callback) {
			this.settingsCollection.saveChanges(callback,this.collectionLabel);
		}
	});
	Object.defineProperty(SettingsCollection.prototype,'resetAll',{
		enumerable: false,
		writable: false,
		value: function(callback) {
			this.settingsCollection.resetAll(callback,this.collectionLabel);
		}
	});

	// Property with a multiple values
	function SettingsList(label) {
		IWAPI.List.call(this,label);

	}
	SettingsList.prototype = Object.create(IWAPI.List.prototype);
	Object.defineProperty(SettingsList.prototype,'toXMLString',{
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
	Object.defineProperty(SettingsList.prototype,'saveChanges',{
		enumerable: false,
		writable: false,
		value: function(callback) {
			this.settingsCollection.saveChanges(callback,this.propertyName);
		}
	});

	// Holding a list of available languages
	function LanguageMap(label) {
		IWAPI.Collection.call(this,label);	
	}
	LanguageMap.prototype = Object.create(IWAPI.Collection.prototype);

	// Holding a list of available layouts
	function LayoutCollection(label) {
		IWAPI.Collection.call(this,label);	
	}
	LayoutCollection.prototype = Object.create(IWAPI.Collection.prototype);
	
	// Server interaction
	SettingsManager.prototype.get = function(resource,callback,opts) {
		var command;
		var opts = opts || {};

		var parameters = {
			resources: makeList(resource)
		};

		// Complete request detains depending on level
		command = 'GetWebmailResources';
		switch(opts.type) {
			case 'Account':
				parameters.selector = opts.id;
				parameters.level = 2;
				break;
			case 'Domain':
				parameters.selector = opts.id;
				parameters.level = 1;
				break;
			default:
				parameters.level = 0;
		}

		var request = this.createCommand(command,parameters);
		var call = function(result) {
			callback(parse(result,opts.type,opts.id,resource));
		};

		this.getResult(request,call);

	}

	// Prepare property names for request, publicly accessible
	var makeList = function(resourcename) {
		var list = [];
		// Add properties to request
		if(resourcename instanceof Array) {
			for(var i=0,l=resourcename.length; i<l; i++) {
				list.push({name: resourcename[i]});
			}
		} else if(typeof resourcename=="object") {
			for(var i in resourcename) {
				var resource = {name: i};
				var items = resourcename[i];
				if(items instanceof Array) {
					resource.items = {
						classname: 'TPropertyStringList',
						val: items
					}
				}
				list.push(resource);
			}
		} else {
			list.push({name: resourcename});
		}
		return list;
	}

	// Private helper function for saving properties
	function saver(request,callback,resource) {
		if(this.hasChanged()) {
			// Determining item list name
			var listname = 'resources';
			request.commandparams.addItem(new IWAPI.List(listname));
			if(resource) {
				if(this[resource].hasChanged()) {
					request.commandparams[listname].addItem(this[resource]);
				}
			} else {
				// Save all changed propeties (or all properties if specified)
				for(var i in this) {
					request.commandparams[listname].addItem(this[i]);
				}
			}
			com.properties.setValues(request,function(result){
				if(result==1) {
					if(resource) {
						this[resource].commitChanges();
					} else  {
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

	function resetter(request,callback,resource) {
		// Determining item list name
		var listname = 'resources';
		request.commandparams.addItem(new IWAPI.List(listname));
		if(resource) {
			request.commandparams[listname].addItem(this[resource]);
		} else {
			// Save all changed propeties (or all properties if specified)
			for(var i in this) {
				request.commandparams[listname].addItem(this[i]);
			}
		}
		com.properties.resetValues(request,function(result){
			if(result==1) {

			}
			callback(result);
		}.bind(this));
	}

	function ServerSettings(label) {
		// Call super
		IWAPI.Collection.call(this,'server');
	}
	ServerSettings.prototype = Object.create(IWAPI.Collection.prototype);
	Object.defineProperty(ServerSettings.prototype,"saveChanges",{
		enumerable: false,
		writable: false,
		configurable: false,
		value: function(callback,resource) {
			var request = com.properties.createCommand(
				'SetWebmailResources',
				{
					level: 0
				}
			);
			var save = saver.bind(this);
			save(request,callback,resource);
		}
	});
	Object.defineProperty(ServerSettings.prototype,"resetAll",{
		enumerable: false,
		writable: false,
		configurable: false,
		value: function(callback,resource) {
			var request = com.properties.createCommand(
				'SetWebmailResources',
				{
					level: 0
				}
			);
			var save = resetter.bind(this);
			save(request,callback,resource);
		}
	});

	function DomainSettings(label) {
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
	DomainSettings.prototype = Object.create(IWAPI.Collection.prototype);
	Object.defineProperty(DomainSettings.prototype,"saveChanges",{
			enumerable: false,
			writable: false,
			configurable: false,
			value: function(callback,resource) {
				var request = com.properties.createCommand(
					'SetWebmailResources',
					{
						selector: this.domainName,
						level: 1
					}
				);
				var save = saver.bind(this);
				save(request,callback,resource);
			}
		}
	);
	Object.defineProperty(DomainSettings.prototype,"resetAll",{
		enumerable: false,
		writable: false,
		configurable: false,
		value: function(callback,resource) {
			var request = com.properties.createCommand(
				'SetWebmailResources',
				{
					selector: this.domainName,
					level: 1
				}
			);
			var save = resetter.bind(this);
			save(request,callback,resource);
		}
	}
);

	function UserSettings(label) {
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
	UserSettings.prototype = Object.create(IWAPI.Collection.prototype);
	// @todo: Saving settings on user level not fully implemented
	Object.defineProperty(UserSettings.prototype,"saveChanges",{
			enumerable: false,
			writable: false,
			configurable: false,
			value: function(callback,property) {
				var request = com.properties.createCommand(
					'SetUserSettings',
					{accountemail: this.accountName}
				);
				var save = saver.bind(this);
				save(request,callback,property);
			}
		}
	);

	// Access to server properties
	return new SettingsManager();
})();
