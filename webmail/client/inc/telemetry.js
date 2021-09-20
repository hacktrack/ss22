function telemetry(){}

telemetry.prototype.__constructor = function(){

	var me = this;

	this.__storage = {};
	this.__pending = false;

	AttachEvent(document.body, 'onmouseup', function(e){
		var e = e || window.event,
			elm = e.target || e.srcElement;

		if (elm){

			while(!elm.id)
				if (!(elm = elm.parentNode))
					return;

			if (elm.id){
				
				var oid = elm.id.split('#')[0].split('/')[0],
					obj = arrayPath(window, oid.split('.'));

				if (obj && obj._type && obj._telemetry!='off'){

					var out = {
						id: obj._telemetry=='full' ? elm.id : oid,
						type: obj._type
					};

					if (e.button)
						out.button = e.button;

					if (e.shiftKey)
						out.shift = true;

					if (e.ctrlKey || e.metaKey)
						out.ctrl = true;

					me._add(out);
				}
			}
		}
	});

	
	// store() loop executing
	storage.library('wm_tools');
	this.tools = new wm_tools();
	setInterval(function(){
		me.__store();
	}, 30000);
};

telemetry.prototype._add = function(aIn){
	var id = buildURL(aIn);
	try{
		this.__storage[id] = this.__storage[id]?this.__storage[id]+1:1;
	}
	catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r);}
};

	telemetry.prototype.__response = function(){
		this.__pending = false;
	};

	telemetry.prototype.__store = function(){
		if (!Is.Empty(this.__storage) && !this.__pending){
			this.__pending = true;
			this.tools.telemetry(this.__storage,[this,'__response']);
			this.__storage = {};
		}
	};