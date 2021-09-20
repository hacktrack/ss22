_me = obj_tab_close.prototype;
function obj_tab_close(){};

_me.__constructor = function(){

	var me = this;

    addcss(this.__eLi,'obj_tab_close_link');

	this.__eLi.onmousedown = function(e){
    	var e = e || window.event;
			e.cancelBubble = true;
		if (e.preventDefault) e.preventDefault();
		if (e.stopPropagation) e.stopPropagation();

		var elm = e.target || e.srcElement;
		if (elm.parentElement.tagName == 'B' && !e.button){
			me._close();
		}
		else
			me._active(null, true);

		return false;
	};
};

_me._value = function(v,bNoLang){
	if (v){
		this.__tabTitle = v;
		this.__eLi.innerHTML = '<span>'+(bNoLang?v:getLang(v))+'</span><b><span></span></b>';
	}
	else
	    return this.__tabTitle || '';
};
