/*
 *	Dynamically loading lists
 *
 *	Martin Ekblom 2018
 */

com.list = (function() {
	// Constructor
	function Lister() {}

	// Factory for InfoLists
	Lister.prototype.fetch = function(listtype,options,amount,filter,parser) {
		var list = new InfoList(listtype,options,amount,filter,parser);
		return list;
	}

	var ListItems = function(label) {
		IWAPI.List.call(label);

		this.search = '';
	}
	ListItems.prototype = Object.create(IWAPI.List.prototype);

	var InfoList = function(listtype,parameters,amount,filter,parser) {
		this.xmlns = 'rpc';
		this.meta = {
			start: 0,
			end: 0,
			chunk: amount || 30,
			total: null
		}
		this.search = filter || '';
		this.content = new ListItems(listtype);
		this.parameters = parameters || {};
		this.label = listtype;
		this.parser = parser;
	};
	InfoList.prototype = Object.create(IWServerInteraction.prototype);
	InfoList.prototype.filter = function(filter) {
		if(this.search!=filter) {
			this.meta.start = this.meta.end = 0;
			this.content = new ListItems(this.content.label);
			this.content.search = filter;
		}
		this.search = filter;
	}
	InfoList.prototype.type = function(type) {
		if(this.subtype!=type) {
			this.meta.start = this.meta.end = 0;
			this.content = new ListItems(this.content.label);
			this.content.search = this.search;
		}
		this.subtype = type;
	}
	InfoList.prototype.load = function(callback,meta) {
		meta = meta || {};
		var options = {};
		for(var o in this.parameters) {
			options[o] = this.parameters[o];
		}
		options.offset = this.meta.end;
		options.count = meta.chunk || this.meta.chunk;

		options.filter = {namemask: this.search || '*'};
		if(this.subtype!=undefined) {
			options.filter.typemask = this.subtype;
		}

		var query = this.createCommand('Get'+this.label+'InfoList', options);

		this.getResult(query,function(result){
			if(result.error) {
				callback(result);
			} else {

				if(result.overallcount) {
					// Empty list or we reached the end of the list (no more items)
					var page = [];
					var total = this.meta.total = +result.overallcount;
					page.total = total;

					callback(page);
				} else {
					var page = new ListItems(this.content.label);
					var total = this.meta.total = +result.getItem('overallcount');
					this.meta.end += options.count;
					page.total = this.content.total = total;
					page.search = this.content.search;

					result.removeItem('overallcount');
					result.removeItem('offset');

					for(var i=0,l=result.length;i<l;i++) {
						this.parser && this.parser(result[i]);
						this.content.addItem(result[i]);
						page.addItem(result[i]);
					}

					callback(page);
				}
			}
		}.bind(this));
	}
	InfoList.prototype.reset = function() {
		var amount = this.meta.chunk;
		this.content = new ListItems(this.label);
		this.meta = {
			start: 0,
			end: 0,
			chunk: amount,
			total: null
		}
		delete this.search;
	}

	// Assign to com
	return new Lister();
})();
