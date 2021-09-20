_me = obj_barmenu_block.prototype;
function obj_barmenu_block() {}
_me.__constructor = function (iSize) {
	this.__size = 0;
	this._collapsed = true;

	//default in CSS is display: none;
	this._parent._getAnchor(this._anchor).style.display = 'block';

	if (this._anchor != 'middle') {
		if (iSize)
			this._size(iSize);
		else
			this._parent._checkSize();
	}
};

_me._size = function (iSize) {
	if (this._anchor != 'middle') {
		this.__size = parseInt(iSize);
		if (this.__size == '0'){
			this._main.style.display = 'none';
		}
		else{
			this._main.style.display = 'block';
			this._getAnchor('main').style.height = this.__size + 'px';
		}

		this._parent._checkSize();
	}
};

