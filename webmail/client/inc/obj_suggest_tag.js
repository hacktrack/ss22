_me = obj_suggest_tag.prototype;
function obj_suggest_tag(){};

_me.__constructor = function(aFolder){
	this.__activeFirst = true;

	this._min = 1;
	this._limit = 15;
	this._folder;

	this.__hints = [];
};

_me._value = function (v, bSkipCheck) {
	var aOut = {}, sTag, aTmp = [];
    if (Is.Defined(v)) {

    	if (bSkipCheck)
			this.__eIN.value = v;
    	else{
			aTmp = v.split(',');
	  		for (var i = 0;i<aTmp.length;i++)
				if (aTmp[i] && (sTag = aTmp[i].trim()))
					aOut[sTag] = true;

			sTag = '';
			for (var i in aOut)
				sTag += (sTag?', ':'') + i;

			this.__eIN.value = sTag;
		}

        if (this.__restrictions && this.__restrictions.length)
            this.__check();
    }
	else{
		aTmp = this.__eIN.value.replace(/\r\n/g, "\n").split(',');
		for (var i = 0;i<aTmp.length;i++)
			if (aTmp[i] && (sTag = aTmp[i].trim()))
				aOut[sTag] = true;

		sTag = '';
		for (var i in aOut)
			sTag += (sTag?',':'') + i;

		return sTag;
	}
};

	//DONE
	_me._qdata = function(v){

		var cart = this._getCartPos(),
			end = false, word = [0,0];

		for (var i=0, l=v.length; i<l; i++){
			switch(v.charAt(i)){
			case ',':
				if (cart<=i)
					end = true;
				else
					word = [i+1,i+1];

				break;

			default:
            	word[1] = i+1;
			}

			if (end) break;
		}

		v = v.substring(word[0],word[1]);
		this.__last_pos = [word[0],word[1],v];
		return v;
	};


	_me._qvalue = function(v){
        if (Is.Object(v))
			v = v.value;

		if (typeof v != 'undefined'){

			var str1 = this.__input_value.slice(0,this.__last_pos[0]),
				str2 = this.__input_value.substring(this.__last_pos[1]);

			if (str1)
				v = ' '+v;
			if (!str2)
				v += ', ';

			this._value(str1 + v + str2,true);
			this._setRange(this.__last_pos[0] + v.length);
		}
	};

	_me._query = function(v){
		//SQL query
		var aFilter = {
			search: 'tag:'+v.trim(),
			sort: 'TAGNAME',
			limit: this._limit
		};

		if (Is.Object(this._folder))
			aFilter.folder = this._folder.fid;

		WMItems.list({'aid':sPrimaryAccount,'fid':"__@@TAGS@@__",'values':['TAGNAME','TAGCOUNT'],'filter':aFilter},'','','',[this,'__appendTAG',[v]]);
	};

	_me.__appendTAG = function(sWord,aData){
		if (this.__last_pos[2] == sWord){
			var aData = aData[sPrimaryAccount]['__@@TAGS@@__'];
			if (aData && parseInt(aData['#'],10)>0){
				delete aData['/'];
	            delete aData['#'];
	            delete aData['$'];
	            delete aData['@'];

				aOut = [];
				for(var id in aData)
					if (aData[id].TAGNAME)
						aOut.push({value:aData[id].TAGNAME, hint:getLang('TAGS::HINT',[aData[id].TAGCOUNT || 0])});

	            this._parse(aOut);
			}
		}
	};

	_me._parse = function(aValues){
		if (!Is.Array(aValues) || !aValues.length)
			this.__hide();
		else
			this.__show(aValues);
	};
