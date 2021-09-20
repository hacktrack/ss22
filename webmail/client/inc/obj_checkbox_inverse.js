/*****************************************************
 * Extension script: CheckBox form object with inverted value!
 *
 *****************************************************/
 
_me = obj_checkbox_inverse.prototype;
function obj_checkbox_inverse(){};

	_me.__constructor = function(){
		this.__eIN.checked = true;
	};	
	/**
	 * @brief : control element's "checked" html method
	 * @param : b - boolean value
	 * @return: bool;
	 * @date  : 20.4.2006 17:42:24
	 **/
	_me._value = function(b){
		if (Is.Defined(b)){ 
			if (Is.String(b)) b = parseInt(b,10);
			this._checked(b?false:true);
		}	
		else 
			return this._checked()?0:1;
	};