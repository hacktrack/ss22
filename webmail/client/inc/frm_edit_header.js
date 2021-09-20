_me = frm_edit_header.prototype;
function frm_edit_header(){};

_me.__constructor = function(oOpener) {
	var me = this;

	this._title('FILTERS::EDIT_HEADER');
    this._size(500,336,true);
	this._resizable(false);
	this._modal(true);

	this._draw('frm_edit_header', 'main');
	this.__opener = oOpener;
	this.__value = [];
	var aTypes = [getLang('FILTERS::ADDEDIT'),getLang('FILTERS::DELETE')];

	this.grid._addColumns([
		{title: "FILTERS::ACTION", width: 100},
		{title: "FILTERS::HEADER", width: 100, mode: '%', encode: true}
	]);

	function fillGrid(){
	    var tmp = [];
		for(var i in me.__value)
		    if (me.__value[i])
				tmp.push({data:[(aTypes[me.__value[i].substr(0,1)]),me.__value[i].substr(1)]});

		me.grid._fill(tmp);
	};

	if (typeof this.__opener.__aValues == 'string'){
		var val = this.__opener.__aValues.split("\n");
		for(var i in val)
		    if (val[i])
		    	this.__value.push(val[i]);

		fillGrid();
	}

	this.edit._onclick = this.add._onclick = function(){

		if (this._name == 'edit'){
			var id = me.grid._value(), v;
			if (Is.Empty(id) || !Is.Defined(v = me.__value[id[0]]))
				return;
		}

		me.popup = gui._create('add','frm_ok_cancel');
		me.popup._modal(true);
		me.popup.__resizable = false;
		me.popup._size(300,180,true);

		me.popup._draw('frm_edit_header_edit','main');

		if (this._name == 'add'){
			me.popup._title('FILTERS::EDIT');
			me.popup.x_btn_ok._onclick = function(){
				me.__value.push(this._parent['action']._value() + this._parent['header']._value());
				fillGrid();
				me.grid._value([me.__value.length-1]);
				me.popup._destruct();
				me._focus();
			};
		}
		else{
			me.popup._title('FILTERS::EDIT');

			me.popup['action']._value(v.charAt(0));
			me.popup['header']._value(v.substr(1));

			me.popup.x_btn_ok._onclick = function(){
				me.__value[id[0]] = this._parent['action']._value() + this._parent['header']._value();
				fillGrid();
				me.popup._destruct();
				me._focus();
			};
		}
	};

	this.grid._ondblclick = function(){
		me.edit._onclick();
	};

	this.remove._onclick = function(){
		var a = me.grid._value();

		if (!Is.Empty(a)){
			for(var i in a)
				me.__value.splice(a[i], 1);

			fillGrid();
		}
	};

	this.x_btn_ok._onclick = function() {
		me.__opener.__aValues = me.__value.length?me.__value.join("\n"):'';
		me._destruct();
	};
};