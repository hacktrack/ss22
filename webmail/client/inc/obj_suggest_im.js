_me = obj_suggest_im.prototype;
function obj_suggest_im(){};

_me.__constructor = function(){
	this.__activeFirst = true;

	this._min = 1;
	this._limit = 15;
	this._single = true;
};

	_me._qvalue = function(v){
		if (Is.Object(v))
			v = v.value;

		if (this._single){
			this._value(v);
			this._setRange(v.length);

			if (this._onsubmit)
				this._onsubmit();
		}
		else{

			//revert input to value before suggest execution
			this._value(this.__input_value);

			var s = this._value(),
				end = s.slice(this.__last_pos[1]).trim(),
				txt = s.slice(0, this.__last_pos[0]>0?this.__last_pos[0]+1:0).trim();

				if (txt.lastIndexOf(';') != txt.length-1  && txt.lastIndexOf(',') != txt.length-1)
				    txt += ',';

				txt += (txt?' ':'')+ v +(end.indexOf(';') === 0  || end.indexOf(',') === 0?' ':', ');

			this._value(txt + end);
			this._setRange(txt.length);
		}
	};

	_me._qdata = function(v){

		//1. naparsovat separaory do pole
		var col = false, sep = [];
		for (var i=0, l=v.length; i<l; i++){
			switch(v.charAt(i)){
			case ',':
			case ';':
				if (!col)
					sep.push(i);
				break;
			case '"':
				if (!i || (i && v.charAt(i-1) != '\\'))
					col = !col;
			}
		}

		//2. zjistit pozici kurzoru
		var cart = this._getCartPos();
		var pos1 = 0, pos2 = l;
		for (var i = 0; i<sep.length; i++){
			if (sep[i]<cart)
				pos1 = sep[i];
			else
			if (sep[i]>=cart){
				pos2 = sep[i];
				break;
			}
		}

		//3. ziskat adresu pod kurzorem
		var adr = v.substring(pos1>0?pos1+1:0,pos2);
			adr = adr.trim();

		this.__last_pos = [pos1,pos2,adr];

		return adr;
	};


	_me._query = function(v){
		var aParsed = MailAddress.splitEmailsAndNames(v.toLowerCase())[0],
			aIn = dataSet.get('xmpp',['roster']),
			aOut = [];

		aParsed.name = aParsed.name || aParsed.email;

		this.__last_qdata = aParsed;

		for(var id in aIn)
			if ((aIn[id].name && aIn[id].name.toLowerCase().indexOf(aParsed.name)>-1) || aIn[id].user.toLowerCase().indexOf(aParsed.email)>-1)
				aOut.push({name:aIn[id].name || '', user:aIn[id].user});

		this._parse(v, aOut);
	};

	_me._parse = function(sWord,aValues){

		if (!aValues || this._input_value() != sWord){
			this.__show();
			this.__sLastRequestString = '';
			removecss(this._main,'error');
			return;
		}

		//Concat Query and Cookie Data
		var sc = function (a,b){
			var x = (a.name || '') + a.user.replace(/[\[\]]/g,'');
			var y = (b.name || '') + b.user.replace(/[\[\]]/g,'');
			if (x>y)
				return 1;
			else
			if (x<y)
				return -1;
			else
				return 0;
		};

		aValues = aValues.sort(sc);

		//Create output string
		var out = [];
		for(var i in aValues){
			name  = aValues[i].name;
			email = aValues[i].user;

			//if ((name && this.__last_qdata.name != name) || (email && this.__last_qdata.email != email))
				out.push({value:MailAddress.createEmail(name,email), css:'avatar', prefix:'<span class="avatar" style="background-image:url(\''+getAvatarURL(email)+'\')"></span>'});
		}

		if (out.length){
			removecss(this._main,'error');
			this.__show(out);
		}
		else{
			addcss(this._main,'error');
			this.__hide();
		}

		this.__sLastRequestString = sWord;
		this.__sLastSuggest = sWord;
	};