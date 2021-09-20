/*****************************************************
 * Extension script: TextArea form object
 *
 * INHERITS FROM obj_form_generic, obj_text
 * @Date: 16.4.2006 16:33:51
 *****************************************************/

_me = obj_text_dynamic.prototype;
function obj_text_dynamic(){};

_me.__constructor = function(bWrap){
	var me = this;

	this.__maxHeight = 94;

	AttachEvent(this.__eIN, 'onkeyup', function(e){me.__resize()});
	AttachEvent(this.__eIN, 'onpaste', function(e){setTimeout(function(){me && !me._destructed && me.__resize()},100)});
};

_me.__resize = function(){

	var height = this._main.style.height,
		bRedraw = false,
		w = this.__eIN.offsetWidth;

	//last CRLF is not rendered
	var str = this.__eIN.value.replace(/\n$/,"\n.");

	//Size DIV, helps to detgermine real input text lenght
	if (!this.__sizediv){
		this.__sizediv = mkElement('div',{className:'size'},'',[document.createTextNode(str)]);
		this._main.appendChild(this.__sizediv);
	}
	else
		this.__sizediv.firstChild.nodeValue = str;

	if (parseInt(this.__sizediv.style.width, 10) !== w)
		this.__sizediv.style.width = w + 'px';

	var h = (this.__sizediv.offsetHeight<this.__maxHeight?this.__sizediv.offsetHeight:this.__maxHeight);

	if (h<10){
		this._main.style.height = '';

		if (this._onresize)
			this._onresize({height: this._main.offsetHeight});

		bRedraw = true;
	}
	else
	if (parseInt(this._main.style.height, 10) !== h){
		this._main.style.height = h + 'px';

		// Call onresize if defined so adjacent elements can adapt
		if (height != this._main.style.height){
			if (this._onresize)
				this._onresize({height: parseInt(this._main.style.height)});

			bRedraw = true;
		}
	}

	//Chrome redraw fix
	if (bRedraw && currentBrowser() == 'Chrome'){
		this._parent._main.style.borderRight = '1px solid transparent';
		setTimeout(function () {
			if (this._parent && !this._parent._destructed)
				this._parent._main.style.borderRight = '';
		}.bind(this), 20);
	}
};