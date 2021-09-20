_me = obj_vtabs.prototype;
function obj_vtabs(){};

_me.__constructor = function(){
	this._scrollbar(this._getAnchor('header2'));
};

_me._scrollHeader = function(eLi){
	var eHead = this._getAnchor('header2'),
		p1 = getSize(eHead),
		p2 = getSize(eLi);

	if (p1.y>p2.y)
		eHead.scrollTop += (p2.y - p1.y);
	else
	if (p1.y+p1.h<p2.y+p2.h)
		eHead.scrollTop += ((p2.y+p2.h) - (p1.y+p1.h));
};