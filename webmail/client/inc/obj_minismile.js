_me = obj_minismile.prototype;
function obj_minismile(){};

_me.__constructor = function(aHandler){
	this._main.onclick = function(e){
		if (aHandler){
			var elm = e.target || e.srcElement;
			if (elm.tagName == 'SPAN' && !hascss(elm,'disabled')){
				executeCallbackFunction(aHandler, elm.getAttribute('rel'));

				if (this._onclose)
					this._onclose();
			}
		}

		this._hide(true);

	}.bind(this);
};