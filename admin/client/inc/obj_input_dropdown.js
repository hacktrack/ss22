/*****************************************************
 * Extension script: TextArea form object
 *
 * INHERITS FROM obj_form_generic
 *    _me._value
 *    _me._disabled
 *    _me.__update
 *
 *****************************************************/

_me = obj_input_dropdown.prototype;
function obj_input_dropdown(){};

/**
* @brief: CONSTRUCTOR, create input HTML element to __eIN variable
* @date : 20.4.2006 17:24:21
**/
_me.__constructor = function(){
	this.__addDropdown();
};

_me.__addDropdown = function() {
	// Create dropdown object
	this.__ddname = this._name.replace('input_','dropdown_');
	this._create(this.__ddname,'obj_dropdown_single');
	this._dropdown = this[this.__ddname];

	// Remove form 
	var form = this._main.getElementsByTagName('form')[0];
	form.classList.remove('input');
	var select = form.getElementsByTagName('select')[0];
	this.__eSE = select;
	this._main.replaceChild(select,form);

	// Place in divs
	var input = this._main.getElementsByTagName('input')[0];
	var div = document.createElement('div');
	div.className = "dropdown obj_dropdown_single form__element form__group-right";
	this._main.appendChild(div);
	div.appendChild(select);
	var div = document.createElement('div');
	div.className = "input obj_input_text obj_input_number form__element form__group-left";
	this._main.appendChild(div);
	div.appendChild(input);
	div.appendChild(this._main.firstChild);

	this._main.classList.remove('input');
	
}

_me._setValue = function(sValue){

};

_me._getValue = function(sValue){

};

_me._disabled = function(bDisable) {
	if(bDisable==undefined) {
		return this._dropdown._disabled();
	} else {
		this._dropdown._disabled(bDisable);
		obj_input_text.prototype._disabled.call(this,bDisable);
	}
}