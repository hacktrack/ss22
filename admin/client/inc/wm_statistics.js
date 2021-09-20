/*
 *	Retrieving server statistic properities
 *
 *	Martin Ekblom 2017
 */

if(!window.com) window.com={};

com.statistics = (function() {
	// Constructor
	function Statistics() {
		this.xmlns = 'rpc';
	}
	// Inherit data manipulation tools
	Statistics.prototype = Object.create(IWServerInteraction.prototype);

	// Getting statistics properties
	Statistics.prototype.get = function(propnames,callback) {
		var names = [];
		// Allow to get a single property with string value
		if(typeof propnames == "string") {
			propnames = [propnames];
		}
		// Compile all properties into command list
		for(var i=0; i<propnames.length; i++) {
			names.push({propname: propnames[i]});
		}

	//	names = com.properties.makeList(propnames);

		var command = this.createCommand('GetStatisticsProperties',{
			statisticspropertylist: names
		});

		this.getResult(
			command,
			function(properties) {
				var simple = {};
				var length = properties.length;
				for(var i=0; i<length; i++) {

					var label = properties[i].apiproperty.propname.value;

					switch(properties[i].propertyval.classname.value) {
						case 'TPropertyNoValue':
							prop = null;
							break;
						case 'TPropertyString':
							prop = properties[i].propertyval.val.value;
							break;
						default:
							console.warn("Property "+label+" of unexpected type");
							prop = properties[i].propertyval;
					}

					if(label.indexOf('Statistics_')===0) {
						label = label.replace('Statistics_','');
					}
					simple[label] = prop;
				}
				if(length==1) {
					simple = simple[label];
				}

				callback(simple);
			}
		);
	}

	// Access to server properties
	return new Statistics();
})();
