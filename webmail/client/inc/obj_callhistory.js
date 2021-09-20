_me = obj_callhistory.prototype;
function obj_callhistory(){};

/**
 * @brief:
 * @date : 4.1.2007 12:21:09
 **/

_me.__constructor = function(){

	setSelectNone(this._main);

    this.__value = -1;
    this.__idTable = {};

	var me = this;
	this._main.onclick = function(e){
		var e = e || window.event;
		var elm = e.target || e.srcElement;

		if (elm !== this){

            if (elm.tagName!='A')
				elm = Is.Child(elm,'A');

			var id = elm.id.substr(me._pathName.length+1);

            //deactivate old row
			if (me.__value>-1){
				var telm = document.getElementById(me._pathName+'/'+me.__value);
				if (telm){
                    if (me.__idTable[me.__value][1] == 'FAILED')
						removecss(telm,'active_f');
					else
						removecss(telm,'active_a');
				}
			}

			me.__value = id;

			//activate new row
			if (me.__idTable[me.__value][1] == 'FAILED')
				addcss(elm,'active_f');
			else
				addcss(elm,'active_a');

			if (me._onclick)
				me._onclick(me.__idTable[me.__value][0]);
		}
	};


	this._main.ondblclick = function(e){
		var e = e || window.event;
		var elm = e.target || e.srcElement;

		if (elm !== this && me.__value){
			if (me._ondblclick)
				me._ondblclick(me.__idTable[me.__value][0]);
		}
	};

	this._scrollbar(this._getAnchor('body'),this._main);
};

_me._value = function(){
	if (this.__value>-1)
	    return this.__idTable[this.__value][0];
};

_me._searchin = function(s){
	for(var i in this.__idTable){
	    if (this.__idTable[i][0] == s)
	        return i;
	}
	return -1;
};

/*
aData = [{	from:'address',
			to:'address',
			stamp:stamp,
			duration:stamp,
			inout:'IN|OUT'
			status:'FAILED|ANSWERED'
		}]
*/
_me._fill = function(aData){

	var out = '';

    this.__idTable = {};

	if (aData){

		var sLang = getLang('DIAL::DURATION');

		for(var i in aData){

		    this.__idTable[i] = [aData[i].INOUT=='IN'?aData[i].FROM:aData[i].TO,aData[i].STATUS];

			if  (this.__aFilter &&
				((this.__aFilter.IN && aData[i].INOUT != 'IN') ||
				(this.__aFilter.OUT && aData[i].INOUT != 'OUT') ||
				(this.__aFilter.FAILED && !(aData[i].STATUS =='FAILED' || aData[i].STATUS =='CANCELLED'))))
			    continue;


			out += '<a id="'+this._pathName+'/'+i+'" class="'+(aData[i].STATUS || '')+
				'"><div class="'+(aData[i].INOUT || '')+'"><h3>'+ (this.__idTable[i][0].toString().escapeHTML()) +
				"</h3><p>"+	IcewarpDate.unix(aData[i].UNIXSTAMP).format('L LT') + (aData[i].DURATION?" "+ sLang +" "+ parseJulianTime(aData[i].DURATION):'') +"</p></div></a>\n";
		}
	}

	this._getAnchor('body').innerHTML = out;
};

_me._filter = function(aFilter){
	this.__aFilter = {};
	for(var i in aFilter)
		this.__aFilter[aFilter[i]] = true;

	this.__update(this.__lastDS,this.__lastDP);
};

_me.__update = function(sDataSet,sDataPath){

	if (!sDataSet) return;

	this.__lastDS = sDataSet;
	this.__lastDP = sDataPath;

	var aData = dataSet.get(sDataSet,['SIP_CALLS','ITEMS']);

	var out = [],tmp;
	for(var i in aData){
        tmp = {};
		for(var j in aData[i].VALUES)
			if (aData[i].VALUES[j].VALUE)
				tmp[j] = aData[i].VALUES[j].VALUE;

		out.push(tmp);
	}

	this._fill(out);
};