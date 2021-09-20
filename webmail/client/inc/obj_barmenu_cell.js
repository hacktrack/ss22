_me = obj_barmenu_cell.prototype;
function obj_barmenu_cell (){}
_me.__constructor = function (iSize,sTitle,sText){
	var me = this;

	if (sTitle)
		this._title(sTitle);
	else
		this._text(sText);

	this._getAnchor('title').onclick = function(e){
		me._open(me._collapsed);
	};

	if (this._anchor != 'middle'){
		//parent is connected to cookies
		if (this._parent._listener){
			var tmp = dataSet.get(this._parent._listener,this._parent._listenerPath);
			if (tmp && tmp[this._name])
				this._open(true);
		}
	}
};

_me._open = function(b){
	if (this._anchor == 'middle')
		return;

	this._collapsed = b?false:true;

	if (this._collapsed){
		removecss(this._main, 'obj_barmenu_cell_open');

		if (this._parent._listener)
			dataSet.remove(this._parent._listener,this._parent._listenerPath?[].concat(this._parent._listenerPath,[this._name]):[this._name],false,this._parent._pathName);
	}
	else{
		addcss(this._main, 'obj_barmenu_cell_open');

		if (this._parent._listener)
			dataSet.add(this._parent._listener,this._parent._listenerPath?[].concat(this._parent._listenerPath,[this._name]):[this._name],[1],false,this._parent._pathName);
	}

	this._parent._checkSize();
};

_me._title = function (sTitle){
	this._text(getLang(sTitle));
};

_me._text = function (sTitle){
    if (sTitle){
		this._getAnchor('title').innerHTML = sTitle;
		addcss(this._main,'obj_barmenu_cell_title');
	}
	else
		removecss(this._main,'obj_barmenu_cell_title');
};