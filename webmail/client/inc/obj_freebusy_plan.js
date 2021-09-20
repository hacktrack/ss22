function obj_freebusy_plan() {}
_me = obj_freebusy_plan.prototype;
_me.__constructor = function (oFreeBusy) {
	this.__freebusy = oFreeBusy;
	this.__found = [];
	this.__idTable = {};
	this.__qstate = '';

	this._main.querySelector('.label>span').onclick = function(){
		if (this.__found.length)
			addcss(this.__freebusy._main, 'big');
		else
		if (!hascss(this._main, 'notfound') && this.__qstate!='loading'){
			this.__qstate = 'loading';
			addcss(this._main.querySelector('.label'), 'loading');

			this.__freebusy._find([this, '__response']);
		}
	}.bind(this);

	this._main.querySelector('.done>span').onclick = function(){
		if (this.__freebusy.__inCollision)
			removecss(this.__freebusy._main, 'big');
		else
			removecss(this.__freebusy._main, 'footer', 'big');
	}.bind(this);

	this.__freebusy._obeyEvent('oncollision',[this, '__collision']);

	this.__eList = this._getAnchor('list');
	this.__eList.onclick = function(e){
		var e = e || window.event,
			elm = e.target || e.srcElement;

		this._value(elm.getAttribute('iw-data'));
	}.bind(this);

	this._create('scrollbar', 'obj_scrollbar')._scrollbar(this.__eList);

	this.filter._onchange = function(){
		this.__eList.innerHTML = '';

		var list = this.__idTable[this.filter._getDataValue()] || [];
		for (var i = 0, j = list.length; i<j; i++){
			this.__eList.appendChild(mkElement('div',{text:IcewarpDate.julian(list[i].startdate, list[i].starttime).format('LT') + ' - ' + IcewarpDate.julian(list[i].enddate, list[i].endtime).format('LT'), 'iw-data':list[i].id, className: list[i].id == this.__value?'active':''}));
		}

	}.bind(this);
};

_me.__collision = function(e, arg){

	if (arg.arg){
		removecss(this.__freebusy._main, 'big');
		addcss(this.__freebusy._main, 'footer');
	}
	else{
		if (this.__found.length){
			var v = this.__freebusy._value();
			for (var i = 0, j = this.__found.length; i<j; i++){
				if (this.__found[i].startdate == v.startdate && this.__found[i].enddate == v.enddate && this.__found[i].starttime == v.starttime && this.__found[i].endtime == v.endtime){
					this._value(i, true);
					return;
				}
			}
		}
		removecss(this.__freebusy._main, 'footer', 'big');
	}
	this.__found = [];
};

_me.__response = function(aData){
	if (this._destructed)
		return;

	removecss(this._main.querySelector('.label'), 'loading');
	this.__qstate = '';

	this.__found = aData;
	this.__idTable = {};

	if (Is.Empty(aData)){
		//No sockets found
		return;
	}

	//Fill date select
	for (var i = 0, j = aData.length; i<j; i++){
		if (!this.__idTable[aData[i].startdate])
			this.__idTable[aData[i].startdate] = [];

		this.__idTable[aData[i].startdate].push(Object.assign({},aData[i], {id:i}));
	}

	var today = (new IcewarpDate()).format('julian');
	var sdate = this.__freebusy._value().startdate;

	var aSel = Object.keys(this.__idTable).map(function(v){
		var out;
		if (today == v)
			out = {text:getLang('CALENDAR::TODAY')};
		else{
			var n = v - sdate;

			if (Math.abs(v) == 1)
				out = {text:getLang('FREEBUSY::DAY', [n>0?'+ '+n:n])};
			else
				out = {text:getLang('FREEBUSY::DAYS', [n>0?'+ '+n:n])};
		}

		out.html = '<span>('+ IcewarpDate.julian(v).format('L') +')</span>';

		return [out,v];
	});

	this.filter._value(-1, true);	//to force onchnage event
	this.filter._fill(aSel);
	this.filter._value(0);

	addcss(this.__freebusy._main, 'big');
};

_me._value = function(v, bNoUpdate){
	if (Is.Defined(v)){
		if (this.__found[v]){
			this.__value = v;

			removecss(this.__eList.querySelector('div[iw-data].active'), 'active');
			addcss(this.__eList.querySelector('div[iw-data="'+ v +'"]'), 'active');

			if (!bNoUpdate)
				this.__freebusy._value(this.__found[v]);
		}
	}
	else
		this.__value || null;
};