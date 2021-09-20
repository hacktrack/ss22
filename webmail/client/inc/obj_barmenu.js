_me = obj_barmenu.prototype;
function obj_barmenu() {}
;
/*
 _me.__constructor = function(){
 //2Do: nacitat skin/inc jen v pripade MSIE
 };

 - udelat update metodu k DS barmenu, pozor na add (mozna je standardni soucasti podedenou z gui!)
 - listen to DS barmenu (zadat ve frm_main)


 - middle by mohlo mit optional title, neni li definovano vubec bycho ho nekreslil!

 _me.__constructor = function(){
 };
 */
_me.__constructor = function () {
	var me = this;

	this._main.onclick = this._main.oncontextmenu = function (e) {
		var e = e || window.event,
			elm = e.target || e.srcElement;

		// Temporary solution to ask user if upload should be cancelled
		// @todo: implement datagrid upload that does not fail when list view is changed (if list is destructed, upload should be saved correctly anyway)
		var args = arguments;
		if (gui.frm_main.main && gui.frm_main.main._uploading) {
			gui._create('stop_upload', 'frm_confirm', '', '', [function () {
				gui.frm_main.main._uploading = false;
				me._main.onclick.apply(me, args);
			}], 'ALERTS::ALERT', 'CONFIRMATION::STOPUPLOAD');
			return false;
		}

		// Fire click event
		if (me._onclick)
			me._onclick(e, elm);
		me.__exeEvent('click', e, {"elm": elm, owner: me});
	};
};

_me.__onDestroyChild = function () {
	this._checkSize();
};
_me._checkSize = function () {
	this._main.style.paddingTop = this._getAnchor('top').offsetHeight + 'px';
	this._main.style.paddingBottom = this._getAnchor('bottom').offsetHeight + 'px';
};

_me._value = function (v) {
	if (v) {
		for (var i in v) {
			if (this[i] && this[i]._open)
				this[i]._open();
		}
	} else {
		var v = {},
			aCH = this._getChildObjects();

		for (var i in aCH) {
			if (aCH[i]._anchor == 'middle')
				continue;

			if (!aCH[i]._collapsed)
				v[aCH[i]._name] = [1]; // prepared for size as 2nd parametr
		}
		return v;
	}
};

_me.__update = function (sName, aDPath) {
	if (sName == this._listener && aDPath == this._listenerPath)
		this._value(dataSet.get(this._listener, this._listenerPath));
};