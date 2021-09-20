_me = obj_phone_suggest.prototype;
function obj_phone_suggest(){};

_me.__constructor = function(){
	this.__activeFirst = true;

	this._limit = 15;
	this._useCookie = false;
	this.plus && this.plus.__eIN && this.plus.__eIN.setAttribute('placeholder', getLang('POPUP_ITEMS::ENTER_PHONE_NUMBER'));
};
	_me._query = function(v){
		this.__last_qdata = v;

		var aFilter = {
			search: 'has:mobile AND (classify:"'+v.replace(/"/g,'\\"')+'" OR title:"'+v.replace(/"/g,'\\"')+'" OR name:"'+v.replace(/"/g,'\\"')+'" OR phone:"'+v.replace(/"/g,'\\"')+'")',
			sort: 'ITMCLASSIFYAS,ITMFIRSTNAME,ITMSURNAME',
			limit: this._limit
		};

		WMItems.list({'aid':sPrimaryAccount,'fid':"__@@ADDRESSBOOK@@__",'values':['ITMTITLE','ITMCLASS','ITMCLASSIFYAS','ITMFIRSTNAME','ITMMIDDLENAME','ITMSURNAME','ITMSUFFIX','LCTPHNMOBILE'],'filter':aFilter},'','','',[this,'_parse']);
	};

	_me._parse = function(aValues){

		if (!aValues){
			this.__show();
			return;
		}

		//Prepare Query data
		this.__eActive = null;
		this.__sQuery_data = '';

		if (Is.Empty(aValues)) return;

		for(var aid in aValues)
			for (var fid in aValues[aid]);

		if (aid && fid)
			aValues = aValues[aid][fid];
		else
			return;

		delete aValues['/'];
		delete aValues['#'];
		delete aValues['$'];
		delete aValues['@'];

		var emails = [], found, name;

		for(var i in aValues){

			name  = aValues[i].ITMCLASSIFYAS || ((aValues[i].ITMFIRSTNAME || '') + (aValues[i].ITMSURNAME?' '+aValues[i].ITMSURNAME:''));

			for (var j in aValues[i])
				if ((j.indexOf('LCTPHN') === 0/* || j.indexOf('LCTEMAIL') === 0*/) && aValues[i][j]){

					found = false;
					for (var k in emails)
						if (emails[k].email.toLowerCase() == aValues[i][j].toLowerCase()){
							found = true;
							break;
						}

					if (!found)
						emails.push({name:name, email:aValues[i][j]});
				}
		}

		//Concat Query and Cookie Data
		function sc(a,b){
			var x = (a.name || '')+a.email;
			var y = (b.name || '')+b.email;
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
		var out = [],
			MSIE = currentBrowser() == 'MSIE7';

		for(var i in emails){
			name  = emails[i].name;
			email = emails[i].email;

			if ((!name || emails[i].dlist || this.__last_qdata.name == name) && (!email || this.__last_qdata.email == email))
				continue;

			if (email.indexOf('[')===0)
				out.push(MSIE?email:{value:email, css:'avatar'});
			else
				out.push(MSIE?MailAddress.createEmail(name,email):{value:MailAddress.createEmail(name,email), css:'avatar', prefix:'<span class="avatar" style="background-image:url(\''+getAvatarURL(email)+'\')"></span>'});
		}

		if (out.length)
			this.__show(out);
		else
			this.__hide();
	};

///////////////////////////////////////////
// decode input
// @Output format: {tag:<tag>[css:<className>,bgcolor:<#FFFFFF>,color:<#FFFFFF>]}
_me._decode = function(v){
	var aOut = [],
		tmp = MailAddress.splitEmails(v);

	for(var i = 0;i<tmp.length;i++)
		aOut.push({tag:tmp[i]});

	return aOut;
};

//encode output
_me._encode = function(a){
	var aOut = [],
		aUnq = {};

	//Tags are Unique
	for (var i in a)
		if ((a[i] = a[i].trim()) && !aUnq[a[i]]){
			aOut.push(a[i]);
			aUnq[a[i]] = true;
		}

	return aOut.join(',');
};