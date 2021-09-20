_me = obj_loader.prototype;
function obj_loader(){};

/**
 * @brief:
 * @date : 4.1.2007 12:21:09
 **/
_me._value = function(s){
	this._getAnchor('content').innerHTML = s;
};