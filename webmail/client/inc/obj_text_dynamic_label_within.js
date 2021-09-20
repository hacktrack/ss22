/*****************************************************
 * Extension script: TextArea form object with label inside
 *
 * INHERITS FROM obj_form_generic, obj_text, obj_text_dynamic
 * @Date: 16.7.2013
 *****************************************************/

_me = obj_text_dynamic_label_within.prototype;
function obj_text_dynamic_label_within(){};

_me.__constructor = function(){
	this.__eLabel = document.createElement('label');
	this._main.insertBefore(this.__eLabel,this._main.firstChild);
};

_me._label = function(s, bClose) {
	if (Is.Defined(s)){
		this.__eLabel.title = s;
		this.__eLabel.innerHTML = (s.length>23?s.substr(0,20)+'...':s) + (bClose?'<em></em>':'');
	}
	else
		return this.__eLabel.innerHTML;

	var i = parseInt(this.__eLabel.offsetWidth);
	this._main.style.paddingLeft = (i?i + 6:0) + 'px';
};