/**
 * Focus management object
 **/
_me = obj_focus.prototype;
function obj_focus(){};

obj_focus.buffer = [];

_me.__constructor = function() {

	var me = this;
	this.__handler = function(e){
		var e = e || window.event,
			elm = e.target || e.srcElement;

		switch(elm.tagName){
			case 'BUTTON':
			case 'INPUT':
			case 'TEXTAREA':
			case 'SELECT':
				me.__add(elm);
		}
	};

	if (document.addEventListener)
		document.addEventListener('focus', this.__handler, true);
	//MSIE8
	else
		document.onfocusout = this.__handler;

	this._add_destructor('__destructor');
};

//PUBLIC
_me._getFocus = function(){

	for (var i = obj_focus.buffer.length-1; i>=0; i--){
		//remove
		if (!obj_focus.buffer[i] || !document.body.contains(obj_focus.buffer[i]))
			obj_focus.buffer.splice(i,1);
		//skip
		else
		if (obj_focus.buffer[i].disabled)
			continue;
		else{
			var elm = obj_focus.buffer[i];

			// Set focus 
			if (document.activeElement !== elm)
				elm.focus();

			// obj_focus.buffer[i] is removed in this point
			if (document.activeElement === elm)
				return elm; 
		}
	}
};

//PRIVATE
_me.__add = function(obj){
	if (obj && ('focus' in obj) && obj_focus.buffer[obj_focus.buffer.length-1] !== obj){
		this.__remove(obj);
		obj_focus.buffer.push(obj);
	}
};

//PRIVATE
_me.__remove = function(obj){
	//cleaning whole buffer for sure
	for (var i = obj_focus.buffer.length-1; i>=0; i--)
		if (!obj_focus.buffer[i] || !document.body.contains(obj_focus.buffer[i]))
			obj_focus.buffer.splice(i,1);
		else
		if (obj && obj === obj_focus.buffer[i]){
			obj_focus.buffer.splice(i,1);
			return;
		}
};

_me.__destructor = function(){
	if (document.removeEventListener)
		document.removeEventListener('focus', this.__handler, true);
	//MSIE8
	else
		document.onfocusout = null;
};