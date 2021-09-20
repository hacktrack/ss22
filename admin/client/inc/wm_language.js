/*
 *	Manipulating user/domain/server settings
 *
 *	Martin Ekblom 2018
 */

com.language = (function() {
	// Constructor
	function LanguageManager() {
		this.xmlns = 'rpc';
	}
	// Inherit data manipulation tools
	LanguageManager.prototype = Object.create(IWServerInteraction.prototype);

	var parseLanguages = function(data) {
		if(data.list) {
			var resourcename = data.list[0].name.value;
			if(resourcename=="languages") {
				var languages = new LanguageCollection(resourcename);
				data = data.list[0];
				for(var i=0, l=data.list.length; i<l; i++) {
					var lang = data.list[i].list;
					var o = {};
					var all = lang.length;
					while(all--) {
						o[lang[all].name.value] = lang[all].value;
					}
					var language = new Language(o.code.value);
					language.addItem('code',o.code.value);
					language.addItem('label',o.name.value);
					language.addItem('rtl',o.rtl.value=='true');
					languages.addItem(language,o.code.value);
				}
				return languages;
			} else {
				// Error
			}
		} else {
			// Error
		}
	}

	// Holding a list of available languages
	function LanguageCollection(label) {
		IWAPI.Collection.call(this,label);	
	}
	LanguageCollection.prototype = Object.create(IWAPI.Collection.prototype);

	// Individual languages
	function Language(label) {
		IWAPI.Collection.call(this,label);	
	}
	Language.prototype = Object.create(IWAPI.Collection.prototype);

	// Server interaction
	LanguageManager.prototype.getSupported = function(callback) {
		var command;
		var opts = opts || {};

		var parameters = {
			resources: makeList('languages'),
			level: 0
		};

		var request = this.createCommand('GetWebmailResources',parameters);
		var call = function(result) {
			callback(parseLanguages(result));
		};

		this.getResult(request,call);

	}

	LanguageManager.prototype.getDefault = function() {
		return 'en';
	}

	LanguageManager.prototype.getCurrent = function(cb) {
		com.getProperty('c_system_server_language',function(lang){
			this.__current = lang;
			cb(lang);
		}.bind(this));
	}

	LanguageManager.prototype.setCurrent = function(lang) {
		lang = lang.toLowerCase();
		if(lang.match(/^[a-z]{2}$/) && this.__current) {
			this.__current.value = lang;
			this.__current.saveChanges(function(r){

			});
			return true;
		} else {
			return false;
		}
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

	// Access to server properties
	return new LanguageManager();
})();
