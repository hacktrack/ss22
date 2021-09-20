_me = obj_color.prototype;
function obj_color(){};

_me.__constructor = function(sColor){
	var me = this;

	this.__value = '';
	
	var colors = [
		['FFEEEE', 'FFCCCC', 'FFAAAA', 'FF8888', 'FF6666', 'FF4444', 'FF2222', 'FF0000','EE0000', 'CC0000', 'AA0000', '880000', '770000', '660000', '550000', '440000', '330000'],
		['FFEEFF', 'FFCCFF', 'FFAAFF', 'FF88FF', 'FF66FF', 'FF44FF', 'FF22FF', 'FF00FF','EE00EE', 'CC00CC', 'AA00AA', '880088', '770077', '660066', '550055', '440044', '330033'],
		['EEEEFF', 'CCCCFF', 'AAAAFF', '8888FF', '6666FF', '4444FF', '2222FF', '0000FF','0000EE', '0000CC', '0000AA', '000088', '000077', '000066', '000055', '000044', '000033'],
		['EEFFFF', 'CCFFFF', 'AAFFFF', '88FFFF', '66FFFF', '44FFFF', '22FFFF', '00FFFF','00EEEE', '00CCCC', '00AAAA', '008888', '007777', '006666', '005555', '004444', '003333'],
		['EEFFEE', 'CCFFCC', 'AAFFAA', '88FF88', '66FF66', '44FF44', '22FF22', '00FF00','00EE00', '00CC00', '00AA00', '008800', '007700', '006600', '005500', '004400', '003300'],
		['FFFFEE', 'FFFFCC', 'FFFFAA', 'FFFF88', 'FFFF66', 'FFFF44', 'FFFF22', 'FFFF00','EEEE00', 'CCCC00', 'AAAA00', '888800', '777700', '666600', '555500', '444400', '333300'],
		['FFF0D0', 'FFEECC', 'FFEEBB', 'FFDDAA', 'FFCC99', 'FFC090', 'EEBB88', 'DDAA77','CC9966', 'BB8855', 'AA7744', '886633', '775522', '664411', '553300', '442200', '331100'],
		['FFFFFF', 'EEEEEE', 'DDDDDD', 'CCCCCC', 'BBBBBB', 'AAAAAA', 'A0A0A0', '999999','888888', '777777', '666666', '555555', '444444', '333333', '222222', '111111', '000000']
	];

	var str = '<table class="obj_colortable1">';
	for(var i in colors){
        str += '<tr>';
        for(var j in colors[i])
			str += '<td bgcolor="#'+colors[i][j]+'" id="'+this._pathName +'#' + colors[i][j] +'"></td>';
        str += '</tr>';
	}
	str += '</table>';

	var tbl = this._getAnchor('main');
		tbl.innerHTML = str;
		tbl.onclick = function(e){
			var e = e || window.event,
				elm = e.target || e.srcElement;

			if (elm.tagName == 'TD' && elm.id)
				me._value(elm.id.substring(elm.id.lastIndexOf('#')));
		};
};

_me._value = function(v, bNoChange){
	if (v){
		v = v.replace('#','');

		if (this.__value == v || !v.match(/^[0-9a-f]{6}$/gi)) return false;

		var elm;
		if (this.__value && (elm = document.getElementById(this._pathName+'#'+this.__value.toUpperCase())))
			removecss(elm,'active');
		if ((elm = document.getElementById(this._pathName+'#'+v.toUpperCase())))
			addcss(elm,'active');

		this.__value = v;
		
		if (!bNoChange && this._onchange)
			this._onchange(v);
	}
	else
	    return this.__value;
};