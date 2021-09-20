_me = obj_select_import.prototype;
function obj_select_import(){};

_me.__constructor = function(){
	this.__selectdata = {
		NONE:'----',
		ITMCOMPANY:getLang('CONTACT::COMPANY'),

		ITMCLASSIFYAS:getLang('CONTACT::CONTACT_NAME'),
		ITMFIRSTNAME:getLang('CONTACT::FIRST_NAME'),
		ITMMIDDLENAME:getLang('CONTACT::MIDDLE_NAME'),
		ITMSURNAME:getLang('CONTACT::LAST_NAME'),
		ITMNICKNAME:getLang('CONTACT::NICK_NAME'),
		ITMTITLE:getLang('CONTACT::TITLE'),
		ITMSUFFIX:getLang('CONTACT::SUFFIX'),

		LCTEMAIL1:getLang('BACKUP::EMAIL1'),
		LCTEMAIL2:getLang('BACKUP::EMAIL2'),
		LCTEMAIL3:getLang('BACKUP::EMAIL3'),

		LCTPHNWORK1:getLang('BACKUP::PHONE1'),
		LCTPHNHOME1:getLang('BACKUP::PHONE2'),
		LCTPHNHOME2:getLang('BACKUP::PHONE5'),
		LCTPHNFAXWORK:getLang('BACKUP::PHONE3'),
		LCTPHNMOBILE:getLang('BACKUP::PHONE4'),

		//Business
		LCTSTREETB:getLang('CONTACT::STREET')+" ("+getLang('CONTACT::BUSINESS')+")",
		LCTCITYB:getLang('CONTACT::CITY')+" ("+getLang('CONTACT::BUSINESS')+")",
		LCTSTATEB:getLang('CONTACT::STATE')+" ("+getLang('CONTACT::BUSINESS')+")",
		LCTZIPB:getLang('CONTACT::ZIP')+" ("+getLang('CONTACT::BUSINESS')+")",
		LCTCOUNTRYB:getLang('CONTACT::COUNTRY')+" ("+getLang('CONTACT::BUSINESS')+")",
		LCTWEBPAGEB:getLang('CONTACT::WEB')+" ("+getLang('CONTACT::BUSINESS')+")",

		//Personal
		LCTSTREET:getLang('CONTACT::STREET')+" ("+getLang('CONTACT::PERSONAL')+")",
		LCTCITY:getLang('CONTACT::CITY')+" ("+getLang('CONTACT::PERSONAL')+")",
		LCTSTATE:getLang('CONTACT::STATE')+" ("+getLang('CONTACT::PERSONAL')+")",
		LCTZIP:getLang('CONTACT::ZIP')+" ("+getLang('CONTACT::PERSONAL')+")",
		LCTCOUNTRY:getLang('CONTACT::COUNTRY')+" ("+getLang('CONTACT::PERSONAL')+")",
		LCTWEBPAGE:getLang('CONTACT::WEB')+" ("+getLang('CONTACT::PERSONAL')+")",

		//Other
		LCTSTREETO:getLang('CONTACT::STREET')+" ("+getLang('CONTACT::OTHER_L')+")",
		LCTCITYO:getLang('CONTACT::CITY')+" ("+getLang('CONTACT::OTHER_L')+")",
		LCTSTATEO:getLang('CONTACT::STATE')+" ("+getLang('CONTACT::OTHER_L')+")",
		LCTZIPO:getLang('CONTACT::ZIP')+" ("+getLang('CONTACT::OTHER_L')+")",
		LCTCOUNTRYO:getLang('CONTACT::COUNTRY')+" ("+getLang('CONTACT::OTHER_L')+")",
		LCTWEBPAGEO:getLang('CONTACT::WEB')+" ("+getLang('CONTACT::OTHER_L')+")",

		ITMINTERNETFREEBUSY:getLang('CONTACT::CALENDAR_URL'),
		LCTIM:getLang('CONTACT::IM'),

		ITMBDATE:getLang('CONTACT::BIRTHDATE'),
		ITMGENDER:getLang('CONTACT::GENDER'),
		ITMANNIVERSARY:getLang('CONTACT::ANNIVERSARY'),
		ITMSPOUSE:getLang('CONTACT::SPOUSE'),
		ITMCATEGORY:getLang('CONTACT::CATEGORY'),

		ITMJOBTITLE:getLang('CONTACT::JOB'),
		ITMPROFESSION:getLang('CONTACT::PROFESSION'),
		ITMDEPARTMENT:getLang('CONTACT::DEPARTMENT'),
		ITMASSISTANTNAME:getLang('CONTACT::ASSISTANT'),
		ITMMANAGERNAME:getLang('CONTACT::MANAGER'),
		ITMOFFICELOCATION:getLang('CONTACT::OFFICE_LOCATION'),

		ITMDESCRIPTION:getLang('CONTACT::NOTES'),
		ITMSHARETYPE:getLang('CONTACT::SHARE_TYPE')
	};

	this.__eBody = mkElement('div');
	this._main.appendChild(this.__eBody);
};

_me.__exportdata = {
	COMPANY:"ITMCOMPANY",

	CONTACTNAME:"ITMCLASSIFYAS",
	FIRSTNAME:"ITMFIRSTNAME",
	MIDDLENAME:"ITMMIDDLENAME",
	LASTNAME:"ITMSURNAME",
	NICKNAME:"ITMNICKNAME",
	TITLE:"ITMTITLE",
	SUFFIX:"ITMSUFFIX",

	EMAIL:"LCTEMAIL1",
	EMAIL2:"LCTEMAIL2",
	EMAIL3:"LCTEMAIL3",

	PHONE_WORK:"LCTPHNWORK1",
	PHONE_HOME:"LCTPHNHOME1",
	PHONE_HOME2:"LCTPHNHOME2",
	PHONE_FAX:"LCTPHNFAXWORK",
	PHONE_MOBILE:"LCTPHNMOBILE",

	STREETB:"LCTSTREETB",
	CITYB:"LCTCITYB",
	STATEB:"LCTSTATEB",
	ZIPB:"LCTZIPB",
	COUNTRYB:"LCTCOUNTRYB",
	WEB:"LCTWEBPAGEB",

	STREET:"LCTSTREET",
	CITY:"LCTCITY",
	STATE:"LCTSTATE",
	ZIP:"LCTZIP",
	COUNTRY:"LCTCOUNTRY",
	HOMEPAGE:"LCTWEBPAGE",

	STREETO:"LCTSTREETO",
	CITYO:"LCTCITYO",
	STATEO:"LCTSTATEO",
	ZIPO:"LCTZIPO",
	COUNTRYO:"LCTCOUNTRYO",
	HOMEPAGEO:"LCTWEBPAGEO",

	BIRTHDAY:"ITMBDATE",
	GENDER:"ITMGENDER",
	ANNIVERSARY:"ITMANNIVERSARY",
	SPOUSE:"ITMSPOUSE",
	CATEGORY:"ITMCATEGORY",

	FREEBUSYURL:"ITMINTERNETFREEBUSY",
	IM:"LCTIM",

	JOB:"ITMJOBTITLE",
	PROFESSION:"ITMPROFESSION",
	DEPARTMENT:"ITMDEPARTMENT",
	ASSISTANT:"ITMASSISTANTNAME",
	MANAGER:"ITMMANAGERNAME",
	OFFICELOCATION:"ITMOFFICELOCATION",

	NOTES:"ITMDESCRIPTION",
	SHARETYPE:"ITMSHARETYPE"
};

// Fill with new data and create labels
_me._fill = function(aData){

	//clean old selects
	this._clean();

	//clean Anchors
	for(var i in this._anchors)
		if (i.indexOf('select_')==0)
			delete this._anchors[i];

	//clean html
	this.__eBody.innerHTML = '';

	this._create('scrollbar', 'obj_scrollbar','main','',false,true)._scrollbar(this.__eBody, this._main);

	if (typeof aData != 'object' || Is.Empty(aData)) return false;

	var len = aData[0].length, out = '<table>';

	//Col group
	for(var i=0; i<len; i++)
		out += '<col>';

	//select header
	out += '<thead><tr>';
	for(var i=0; i<len; i++){
		out += '<th id="'+ this._pathName +'#select_'+i+'"></th>';
		this._anchors['select_'+i] = this._pathName +'#select_'+i;
	}
	out += '</tr></thead>';

	//table body
	out += '<tbody>';
	for(var i=0; i<aData.length; i++){
		out += '<tr>';
		for(var j=0; j<len; j++){
            out += '<td>'+ (aData[i][j]?aData[i][j].escapeHTML():'') +'</td>';
		}
		out += '</tr>';
	}
	out += '</tbody>';

    out += '</table>';

	//PRINT
	this.__eBody.innerHTML = out;

	//Append selects into <TH>
	var me = this,
		cols = this.__eBody.getElementsByTagName('col');

	for(var i=0; i<len; i++){
		var obj = this._create('select_'+i,'obj_select','select_'+i);
		    obj._fill(this.__selectdata);

			if (this.__exportdata[aData[0][i]]){
            	obj._value(this.__exportdata[aData[0][i]]);
				addcss(cols[i],'active');
            }
			else
				obj._value('NONE');

		    obj._onchange = function(){
				var col = me.__eBody.getElementsByTagName('col')[this._name.substr(7)];

				if (this._value()=='NONE')
                	removecss(col,'active');
				else
					addcss(col,'active');

			};
	}
};

// Fill with new data but keep labels as preset or chosen (_fill must have been called before)
_me._refill = function(aData) {
	if (typeof aData != 'object' || Is.Empty(aData)) return false;

	var len = aData[0].length, out = '';

	//table body
	for(var i=0; i<aData.length; i++){
		out += '<tr>';
		for(var j=0; j<len; j++){
            out += '<td>'+ (aData[i][j]?aData[i][j].escapeHTML():'') +'</td>';
		}
		out += '</tr>';
	}

	var tbody = this.__eBody.getElementsByTagName('tbody')[0];
	tbody.innerHTML = out;
}


_me._value = function(){

	var out = {},v,ch = this._getChildObjects(void 0, 'obj_select'),
		loc1 = null,
		loc2 = null,
		loc3 = null;

	for(var i in ch){
		v = ch[i]._value();
		if (v=='NONE') continue;

		if (v.indexOf('LCT')==0){
			if (v.lastIndexOf('B')==v.length-1){
				if (!loc2) loc2 = {VALUES:[{LCTTYPE:[{VALUE:'B'}]}]};
				loc2.VALUES[0][v.substr(0,v.length-1)] = [{VALUE:i}];
			}
			else
			if (v.lastIndexOf('O')==v.length-1){
				if (!loc3) loc3 = {VALUES:[{LCTTYPE:[{VALUE:'O'}]}]};
				loc3.VALUES[0][v.substr(0,v.length-1)] = [{VALUE:i}];
			}
			else{
				if (!loc1) loc1 = {VALUES:[{LCTTYPE:[{VALUE:'H'}]}]};
				loc1.VALUES[0][v] = [{VALUE:i}];
			}
		}
		else
		if (v.indexOf('PHONE_TYPE')==0){
		    //blank
		}
		else
		if (v.indexOf('PHONE')==0){
			if (!loc1) loc1 = {VALUES:[{LCTTYPE:[{VALUE:'H'}]}]};
            if (!loc1.PHONES)
            	loc1.PHONES = [{PHONE:[]}];

			//prepare data
			var atmp = {PHNNUMBER:[{VALUE:i}]};

			//search for Type
			var stmp = v.replace('PHONE','PHONE_TYPE');
			for(var j in ch)
				if (ch[j]._value() == stmp)
                    atmp.PHNTYPE = [{VALUE:j}];

            loc1.PHONES[0].PHONE.push({VALUES:[atmp]});
		}
		else{
		    if (!out.VALUES) out.VALUES = [{}];
			out.VALUES[0][v]=[{VALUE:i}];
		}
	}

	if (loc1 || loc2 || loc3){
		out.LOCATIONS = [{LOCATION:[]}];
		if (loc1)
			out.LOCATIONS[0].LOCATION.push(loc1);
		if (loc2)
			out.LOCATIONS[0].LOCATION.push(loc2);
		if (loc3)
			out.LOCATIONS[0].LOCATION.push(loc3);
	}

	return out;
};
