_me = obj_suggest_mail.prototype;
function obj_suggest_mail(){};

_me.__constructor = function(){
	this.__activeFirst = true;

	this._min = 2;
	this._limit = 15;
	this._single = false;
	this._itemClass = ['C','L'];

	this._obeyEvent('change',[this,'_checksize']);
};

_me._qvalue = function(v){
	if (Is.Object(v))
		v = v.value;

	if (this._single){
		this._value(v);
		this._setRange(v.length);
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

_me.__getTextWidth = function(){
	//Size DIV, helps to detgermine real input text lenght
	if (!this.__sizediv){
		this.__sizediv = mkElement('div',{className:'size'});
		this._main.appendChild(this.__sizediv);
	}
	else
		this.__sizediv.innerHTML = '';

	this.__sizediv.appendChild(document.createTextNode(this._value()/*.str_replace(' ','&nbsp;')*/));

	var iSize = this.__sizediv.offsetWidth;
	this.__sizediv.innerHTML = '';

	return iSize;
};

//swap between input/textarea
_me._checksize = function(){
	if (this.__eIN.offsetWidth>0){
		var elm = null,
			siz = this.__getTextWidth() - this.__eIN.offsetWidth;

		if (siz>-6 && this.__eIN.type == 'text')
			elm = mkElement('textarea',{id : this._pathName+'#main',name : this._pathName+'#main'});
		else
		if (siz<-5 && this.__eIN.type != 'text')
			elm = mkElement('input',{"type":'text',id : this._pathName+'#main',name : this._pathName+'#main',className:'obj_input'});

		if (elm != null){
			var p = this._getCartPos();
			elm.value = this._value();

			//copy properties (must be this way for chrome)
			var aMethods = [
				'onclick','onmousedown','onmouseup','onmousemove','onmouseover',
				'onfocus','onblur','onsubmit',
				'onkeydown','onkeyup','onchange'
			];
			for(var i in aMethods)
				    if (this.__eIN[aMethods[i]])
					elm[aMethods[i]] = this.__eIN[aMethods[i]];

	            this._main.replaceChild(elm,this.__eIN);
	            this.__eIN = elm;
			this._setRange(p);
		}
	}
};

_me._qdata = function(v){

	this._checksize();

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

	if (v.indexOf('[')==0){
		if (this._itemClass.indexOf('L')>=0){
			var tmp = v;
			if (!(v = v.replace(/[\[\]]+/g,'')))
				return;

			this.__last_qdata = {email:tmp};

			v = v.quoteSQL();
			var aFilter = {
				search: 'class:L AND classify:"'+v.replace(/"/g,'\\"')+'"',
				sort:'ITMCLASSIFYAS',
				limit: this._limit
			};
		}
		else
		 	return;
	}
	else{
		//4. naparsovat adresu
		var aParsed = MailAddress.splitEmailsAndNames(v)[0];
		if (!aParsed.name)
			aParsed.name = aParsed.email;

		this.__last_qdata = aParsed;

		var sClass='',
			name = aParsed.name.replace(/"/g,'\\"');

		if (Is.Array(this._itemClass))
			sClass = ' AND (' + this._itemClass.map(function(v){return 'class:"'+ v +'"'}).join(' OR ') + ')';

		var aFilter = {
			search:	'has:email AND ('+ (GWOthers.getItem('MAIL_SETTINGS_GENERAL','search_primary') == 1?'email1':'email') +':"'+aParsed.email.replace(/"/g,'\\"') +
						'" OR classify:"'+ name +
						'" OR title:"'+ name +
						'" OR name:"'+ name + '")' + sClass,
			sort: 'ITMCLASSIFYAS,ITMFIRSTNAME,ITMSURNAME,LCTEMAIL1,LCTEMAIL2,LCTEMAIL3',
			limit: this._limit
		};
	}

	if (!sPrimaryAccountGW || (GWOthers.getItem('RESTRICTIONS', 'disable_gw_types') || '').indexOf('c')>-1)
		this._parse(v,[]);
	else{

		if (+GWOthers.getItem('RESTRICTIONS', 'disable_group_sharing'))
			aFilter.search += ' AND flags:0';

		WMItems.list({'aid':sPrimaryAccount,'fid':(GWOthers.getItem('RESTRICTIONS','gal_suggest') == 1?"__@@ADDRESSBOOK@@__":Mapping.getDefaultFolderForGWType('C')),'values':['ITMTITLE','ITMCLASS','ITMCLASSIFYAS','ITMFIRSTNAME','ITMMIDDLENAME','ITMSURNAME','ITMSUFFIX','LCTEMAIL1','LCTEMAIL2','LCTEMAIL3','LCTTYPE'],'filter':aFilter},'','','',[this,'_parse', [v]]);
	}
};

_me._parse = function(sWord,aValues){

	if (!aValues || this._input_value() != sWord){
		this.__show();
		this.__sLastRequestString = '';
		return;
	}

	//Get last used emails from Cookie
	var rcp, emails = [], name, email;
	if ((rcp = Cookie.get(['suggest_address']))){
		emails = MailAddress.splitEmailsAndNames(rcp);

		name = this.__last_qdata && this.__last_qdata.name?this.__last_qdata.name.toLowerCase():'';
		email = this.__last_qdata && this.__last_qdata.email?this.__last_qdata.email.toLowerCase():'';

		for (var i = emails.length-1;i>=0;i--)
			if (!((email && emails[i].email.toLowerCase().indexOf(email)>-1) || (name && emails[i].name.toLowerCase().indexOf(name)>-1)))
				emails.splice(i,1);
	}

	//Prepare Query data
	if (!Is.Empty(aValues)){

		for(var aid in aValues)
			for (var fid in aValues[aid]);

		if (aid && fid && (aValues = aValues[aid][fid])){

			delete aValues['/'];
			delete aValues['#'];
			delete aValues['$'];
			delete aValues['@'];

			var found;
			for(var i in aValues){

				if (aValues[i].ITMCLASS == 'L'){
					email = ['['+aValues[i].ITMCLASSIFYAS+']'];
					name  = '';
				}
				else
				if (!aValues[i].LCTEMAIL1 && !aValues[i].LCTEMAIL2 && !aValues[i].LCTEMAIL3)
					    continue;
				else{
					name  = aValues[i].ITMCLASSIFYAS || ((aValues[i].ITMFIRSTNAME || '') + (aValues[i].ITMSURNAME?' '+aValues[i].ITMSURNAME:''));
					email = [];
					if (aValues[i].LCTEMAIL1)
						    email.push(aValues[i].LCTEMAIL1);

					if (aValues[i].LCTEMAIL2)
						    email.push(aValues[i].LCTEMAIL2);

					if (aValues[i].LCTEMAIL3)
						    email.push(aValues[i].LCTEMAIL3);
				}

				for(var j in email){
					found = false;

					for (var k in emails)
						if (emails[k].email.toLowerCase() == email[j].toLowerCase() || (aValues[i].ITMCLASS=='L' && ('['+emails[k].email.toLowerCase()+']') == email[j].toLowerCase())){
							if (name && !emails[k].name)
								emails[k].name = name;

							found = true;
						}

					if (!found)
						emails.push({name:name,email:email[j]});
				}
			}
		}
	}

	//Concat Query and Cookie Data
	var sc = function (a,b){
		var x = (a.name || '')+a.email.replace(/[\[\]]/g,'');
		var y = (b.name || '')+b.email.replace(/[\[\]]/g,'');
		if (x>y)
			return 1;
		else
		if (x<y)
			return -1;
		else
			return 0;
	};

	emails = emails.sort(sc);

	//Create output string
	var out = [];
	for(var i in emails){
		name  = emails[i].name;
		email = emails[i].email;

		if ((name && this.__last_qdata.name != name) || (email && this.__last_qdata.email != email)){
			if (email.indexOf('[')===0)
				out.push({value:email, css:'avatar'});
			else
				out.push({value:MailAddress.createEmail(name,email), css:'avatar', prefix:'<span class="avatar" style="background-image:url(\''+getAvatarURL(email)+'\')"></span>'});
		}
	}

	if (out.length)
		this.__show(out);
	else
		this.__hide();

	this.__sLastRequestString = sWord;
	this.__sLastSuggest = sWord;
};