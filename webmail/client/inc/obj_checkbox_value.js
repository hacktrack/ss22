/*****************************************************
 * Extension script: CheckBox form object containing 
 * value to server
 *****************************************************/
 
_me = obj_checkbox_value.prototype;
function obj_checkbox_value(){};

	/**
	 * @brief : control element's "checked" html method
	 * @param : sValue - string value
	 * @return: bool;
	 * @date  : 19.9.2012
	 **/
	_me._value = function(b){
		if(Is.Defined(b)) 
			this.__eIN.value = b;
		else
			return this.__eIN.value;
	};

	_me._checked = function(b){
		if(Is.Defined(b)) {
			if(this.__eIN.checked!=b) {
				if(this._onchange) this._onchange();
				this.__exeEvent('onchange',null,{"owner":this});
			}
			this.__eIN.checked = b?1:0;
		}

		return this.__eIN.checked?true:false;
	};
