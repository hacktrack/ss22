_me = obj_lister.prototype;
function obj_lister(){};

_me.__constructor = function(){
	this.__range = 0;
	this.__value = 0;
	this.__list  = 100;
	this.__server = false;
	this.__selected = 0;
	
	this.__bind;

	var me = this;
	var list = this._main.getElementsByTagName('a');
	    list[0].onclick = function(e){
			me._value(0);
		};
	    list[1].onclick = function(e){
			me._value(me.__value - me.__list);
		};
	    list[2].onclick = function(e){
			me._value(me.__value + me.__list);
		};
	    list[3].onclick = function(e){
			me._value(me.__range);
		};

	this.input._onsubmit = function(e){
		var v = parseInt(this._value()) - 1;
		    v = v<0?0:v;

		me._value(v*me.__list);
	};
	this.input._onblur = this.input._onsubmit;
	this.input._onclose = function(e){
		this._value((me._value()/me.__list) + 1);
	};
};

/**
 * @param:  oObj  - datgrid object
 *          bServer - type of binding (true - server sort)
 **/
_me._bind = function(oObj){

	//bind lister to DG object
	if (oObj.lister && oObj.lister._pathName != this._pathName)
		oObj.lister._destruct();
	oObj.lister = this;

	//bind DG object to lister
	this.__bind = oObj;
};

// set or get items prer list number
_me._list = function(v,bNoChange){

	if (typeof v == 'undefined') return this.__list;
	
	this.__list = parseInt(v);
	this.__list = this.__list<1?1:this.__list;

    //event handler
	if (!bNoChange && this._onchange){
		this._onchange(this.__value);
		this.__exeEvent('onkeyup',null,{"value":this.__value,"owner":this});
	}
};

// set or get items count
_me._range = function(r){

	if (typeof r == 'undefined') return this.__range;
	
	this.__range = parseInt(r);

    if (this.__value>this.__range-1)
        this._value(this.__range);

    this._selected();
};

_me._selected = function(i){
	if(typeof i != 'undefined') this.__selected = i;
	this.label._value((Math.ceil(this.__range/this.__list) || 1)+'&nbsp;&nbsp;('+(this.__selected>0?this.__selected+' / ':'')+this.__range+')');
};

// set or get actual list
_me._value = function(v,bNoChange){

	if (typeof v == 'undefined') return this.__value;
	    
	var old = this.__value;
	this.__value = parseInt(v);

	if (isNaN(this.__value)) this.__value = 0;

	if (this.__value>this.__range-1){
        this.__value = Math.floor(this.__range/this.__list)*this.__list;

		if (this.__range && this.__value == this.__range)
            this.__value -= this.__list;
    }
    else
        this.__value = Math.floor(this.__value/this.__list)*this.__list;

    this.__value = this.__value<0?0:this.__value;

	this.input._value((this.__value/this.__list)+1);
	
	//event handler
	if (!bNoChange && old !== this.__value){
		if (this._onchange) this._onchange(this.__value);
		this.__exeEvent('onkeyup',null,{"value":this.__value,"owner":this});
	}
};

_me._listen_data = function(sDataSet,aDataPath){
	this._listener_data = sDataSet;
	if (typeof aDataPath == 'object') this._listenerPath_data = aDataPath;

    if (sDataSet)
		dataSet.obey(this,'_listener_data',sDataSet);
	else
		dataSet.disobey(this,'_listener_data');
};

_me.__update = function(sName){
	if (!sName) return;

	// update range
	if (this._listener_data == sName)
		this._range(dataSet.get(this._listener_data,this._listenerPath_data));

	// update value
	if (this._listener == sName)
		this._value(dataSet.get(this._listener,this._listenerPath));
};