_me = obj_text_mentions.prototype;
function obj_text_mentions(){};

_me.__constructor = function(){
	this._limit = 10;
	this._min = 1;
	this.__direction = 'up';

	this.__folder = {};
	this.__mentions = {};
};

// parse suggest caption
_me.__caption = function() {
	return getLang('CHAT::MENTIONS_SUGGEST', [mkElement('b', {text:'"'+ (this.__last_qdata.length>1?this.__last_qdata.substr(1):getLang('COMMON::ALL')) +'"'}).outerHTML]);
};

// get string for suggestion
_me._qdata = function(v){

	var iStart = 0, iEnd = 0, s,
		cart = this._getCartPos();

	//start (search for @ only 16 chars before)
	for(var i = cart; i>=0 && cart-i<16; i--){

		s = v.charAt(i);

		if (s == ']')
			return;
		else
		if (s == '@'){

			//skip already suggested @[...
			if ((s = v.charAt(i+1)) && s == "[")
				return;

			//mandatory blank space
			if (i>0 && (s = v.charAt(i-1)) && /\s/g.test(s) === false)
				return;

			iStart = i;
			iEnd = cart;
			break;
		}
	}

	this.__last_pos = [iStart, iEnd, v.substring(iStart, iEnd), v];
	return this.__last_pos[2];
};

_me._query = function(v){

	if (this.__folder && this.__folder.aid && this.__folder.fid && this._getFocusElement().value === this.__last_pos[3]){
		this.__last_qdata = v;

		var aFilter = {
				search: v.substr(1),
				sort: 'FRTISGUEST DESC, FRTNAME, FRTEMAIL',
				limit: this._limit
			};

		if (v.length>1)
			aFilter.startswith = 1;

		WMItems.list({'aid':this.__folder.aid,'fid':'__@@GROUP@@__/' + this.__folder.fid,'values':[],'filter':aFilter},'','','',[this,'_parse', [v]]);
	}

};

_me._parse = function(sWord, aData){

	if (this.__last_qdata === sWord && this._getFocusElement().value === this.__last_pos[3]){

		if (aData && (aData = aData[this.__folder.aid]) && (aData = aData['__@@GROUP@@__/' + this.__folder.fid])){
			var out = [];
			if(~getLang('CHAT::ALL_MEMBERS').toLowerCase().indexOf(sWord.replace(/^@/, '').toLowerCase())) {
				out.push({value: getLang('CHAT::ALL_MEMBERS'), email: '@all@', css: 'avatar'});
			}
			for(var iid in aData)
				if (aData[iid].FRTEMAIL)
					out.push({value:MailAddress.createEmail(aData[iid].FRTNAME, aData[iid].FRTEMAIL), name:aData[iid].FRTNAME, email:aData[iid].FRTEMAIL, css:'avatar', prefix:'<span class="avatar" style="background-image:url(\''+getAvatarURL(aData[iid].FRTEMAIL)+'\')"></span>'});

			if (out.length)
				this.__show(out);
			else
				this.__hide();

			this.__sLastRequestString = sWord;
			this.__sLastSuggest = sWord;
		}
		else
			this.__hide();
	}

};

_me._qvalue = function(v){
	var old = this._getFocusElement().value;

	if (Is.Object(v) && v.email && old === this.__last_pos[3]){

		var s = v.email,
			a = s.toLowerCase().split('@'),
			appendix = old.substr(this.__last_pos[1]);

		if (a[1] && a[1] == dataSet.get('main',['domain']))
			s = a[0];

		//Add Mention
		this._mention(v);

		this._qdata(old);
		this._value(old.substr(0,this.__last_pos[0]) + '@['+s+']' + (appendix?appendix:' '));
		this._setRange(this.__last_pos[0] + ('@['+s+']').length + (appendix?0:1));
	}
};

_me._mention = function(v){
	if (Is.Defined(v)){
		if (Is.Object(v))
			this.__mentions[v.email] = v.name || v.email;
		else
			this.__mentions = {};
	}
	else
		return this.__mentions;
};

//	@param: v, object, {name:'admin', email:'admin@demo.com'}
_me._addMention = function(v){
	var email = v.email,
		a = email.toLowerCase().split('@');

	if (a[1] && a[1] === dataSet.get('main',['domain']))
		email = a[0];

	this._mention(v);

	var old = (this._getFocusElement().value || '').trim();
	this._value((old?old + ' ':'') + '@['+email+'] ');
	this._setRange(this._getFocusElement().value.length);
};
