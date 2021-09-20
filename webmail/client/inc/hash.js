function hash(){}

hash.prototype = {
	__constructor: function(){		
		var me = this;

		window.addEventListener("hashchange", function(e){

			if (me.__timer)
				window.clearTimeout(me.__timer);

			me.__timer = setTimeout(function(){
				if (me.__url != e.newURL){
					me.__url = e.newURL;
					me.__exeEvent('hashchange',{url:e.newURL, hash:me._getHash(e.newURL)});
				}
			}, 100);

		}, false);

	},

	__url:window.location.href.toString(),

	_setHash: function(v, bNoUpdate){

		if (this.__timer){
			window.clearTimeout(this.__timer);
			delete this.__timer;
		}

		var url = window.location.href.replace( /#.*/, '') + '#' + v;
		
		if (bNoUpdate)
			this.__url = url;

		window.location.href = url;
	},

	_getHash: function(url){
		return (url || window.location.href).replace( /^[^#]*#?(.*)$/, '$1' );
	}
};
