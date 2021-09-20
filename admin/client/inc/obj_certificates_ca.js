_me = obj_certificates_ca.prototype;
function obj_certificates_ca(){};

/**
 * @brief:
 * @date : 26.10.2014
 **/
_me.__constructor = function(s){
	var me = this;
	var parent=this._parent;
	storage.library('wm_certificates');
	
	//
	this._add_destructor('__onbeforedestruct');
	/* set onbefore destruct listener */
};

/** obbefore destruct listener */
_me.__onbeforedestruct=function(){

}
/** */

_me._load=function(){
	var me=this;
	
	me._draw('obj_certificates_ca');
}