_me = obj_block.prototype;
function obj_block(){};

_me._position = function(s){
	this._main.style.position = s;
};

_me._place = function(x,y,w,h){
	var css = this._main.style;
	if (x){
		css.left = 'auto';
		css.right = 'auto';
		x = x < 0 ? 10:x;
		if (x.toString().indexOf('%') > -1)
			css.left = x;
		else if (x < 0)
			css.right = (x*-1)+'px';
		else
			css.left = (x<0?10:x)+'px';
	}
	setTimeout(function () {
		var max_x = (window.innerWidth - 10 - this._main.clientWidth);
		css.left = (x > max_x ? max_x : x)+'px';;
	}.bind(this), 5);
	if (y)
	    css.top = (y.toString().indexOf('%')>-1?y:y+'px');
	if (w)
	    css.width = (w.toString().indexOf('%')>-1?w:w+'px');
	if (h)
	    css.height = (h.toString().indexOf('%')>-1?h:h+'px');
};

_me._zIndex = function(i){

	this._add_destructor('__destructor');

	if (typeof i == 'undefined')
		i = maxZIndex.get();

	this._main.style.zIndex = i;
	this.__zindex = i;
};

_me._focus = function (){
	if (typeof this.__zindex != 'undefined')
		maxZIndex.remove(this.__zindex);

	this._zIndex();
};

_me.__destructor = function(){
    if (typeof this.__zindex != 'undefined'){
		maxZIndex.remove(this.__zindex);
		this.__zindex = undefined;
	}
};