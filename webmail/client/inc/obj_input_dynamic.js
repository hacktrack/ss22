/*****************************************************
 * Extension script: obj_input
 *****************************************************/

_me = obj_input_dynamic.prototype;
function obj_input_dynamic(){};

_me.__constructor = function(){
	var me = this;

	this.__maxWidth = 300;
	this.__minWidth = 45;

	AttachEvent(this.__eIN, 'onkeydown', function(e){me.__resize();});
	AttachEvent(this.__eIN, 'onkeyup', function(e){me.__resize();});
	AttachEvent(this.__eIN, 'onchange', function(e){me.__resize();});

	AttachEvent(this.__eIN, 'onpaste', function(e){setTimeout(function(){me.__resize();},100);});
	this._obeyEvent('change',[this,'__resize']);
};

_me.__resize = function(){

	//Size DIV, helps to detgermine real input text lenght
	if (!this.__sizediv){
		this.__sizediv = mkElement('div',{className:'size'});
		this._main.appendChild(this.__sizediv);
	}
	else
		this.__sizediv.innerHTML = '';

	if (this.__mask_size)
		this.__sizediv.style.paddingRight = (Math.max(this.__mask_size[0] || 0,this.__mask_size[1] || 0) + 15) + 'px';

	this.__sizediv.appendChild(document.createTextNode(this.__eIN.value));

	this.__eIN.style.width = (this.__sizediv.offsetWidth<this.__maxWidth?(this.__minWidth>this.__sizediv.offsetWidth?this.__minWidth:this.__sizediv.offsetWidth):this.__maxWidth) + 'px';
};