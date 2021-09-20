_me = obj_tag_suggest.prototype;
function obj_tag_suggest(){};

/**
 * @brief: CONSTRUCTOR
 * @date : 29.1.2013
 **/
_me.__constructor = function(){
	this.__activeFirst = true;

	this._min = 1;
	this._limit = 15;
	this._folder;

	this.__hints = [];
};

///////////////////////////////////////////

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
			var inp = this._getFocusedInput();
			if (inp){

				var old = inp._value();
				this._qdata(old);
				inp._value(old.substr(0,this.__last_pos[0]) + v + old.substr(this.__last_pos[1]));

				this.__inpBlur('',{owner:inp});
			}
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

		WMItems.list({'aid':sPrimaryAccount,'fid':"__@@TAGS@@__",'values':['TAGNAME','TAGCOUNT'],'filter':aFilter},'','','',[this,'_parse',[v]]);
	};

	_me._parse = function(sWord,aData){
		if (this._input_value() == sWord){
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

				if (!Is.Array(aOut) || !aOut.length)
					this.__hide();
				else
					this.__show(aOut);
			}

			this.__sLastRequestString = sWord;
			this.__sLastSuggest = sWord;
		}
		else{
			this.__show();
			this.__sLastRequestString = '';
		}
	};