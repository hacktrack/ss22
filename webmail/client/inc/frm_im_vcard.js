_me = frm_im_vcard.prototype;
function frm_im_vcard(){};
/**
 *  aResponse1 - get response
 *	aResponse2 - set
 **/
_me.__constructor = function(sTo, xmpp) {
	this._size(450,315,true);
	this._resizable(false);
	this.__base64 = [];

	if (sTo){
		this.__to = sTo || '';
		this._title(MailAddress.createEmail(dataSet.get('xmpp',['roster',sTo,'name']),this.__to.replace(/^\~/g,'')),true);
	}
	else
		this._title('IM::VCARD');

	this._draw('frm_im_vcard','main',{edit:this.__to?0:1});

	this.maintab.general.NUMBER.__email = sTo || sPrimaryAccount;

	/*
		Create 'OK' button for Edit,
		not supported anymore

	if (xmpp){
		this._create('btn_ok', 'obj_button', 'footer');
		this.btn_ok._value('FORM_BUTTONS::OK');
		this.btn_ok._onclick = function() {

			var aHandler = null;
			if (me.__base64.length){
				xmpp.__imageHash = me.__base64[2];
				aHandler = [xmpp,'set_status'];
			}

			executeCallbackFunction([xmpp,'vcard'],'',me.__value(),aHandler);

			me._destruct();
		};

		//Avatar Button
		if (this.maintab.general.X_AVATAR){
	        this.maintab.general.X_AVATAR._setFileTypes('image/*','');
			this.maintab.general.X_AVATAR._onuploadend = function(arg){
				arg = arg[arg.length-1];

				//omezit na .jpg, .jpeg, .gif, .png
				if (arg.name && arg.name.search(/\.(jpg|jpeg|gif|png)$/gi)>-1){
					storage.library('wm_upload');

	                var sType = arg.name.substr(arg.name.lastIndexOf('.')+1).toLowerCase();
	                    sType = sType == 'jpg'?'jpeg':sType;

					var up = new wm_upload();
					    up.file2xml(arg.folder,arg.id,sPrimaryAccount,[me,'_refresh',[sType]]);
				}
				else
				    gui._create('vcard_error','frm_alert','','','','IM::VCARD','IM::UNSUPPORTED_IMG');
			};
		}
	}


	// Create 'CANCEL' button
	this._create('btn_cancel', 'obj_button', 'footer');
	this.btn_cancel._value('FORM_BUTTONS::CANCEL');
	this.btn_cancel._onclick = function(){
		me._destruct();
	};
	*/
	this._create('loader','obj_loader');
	xmpp._vcard(this.__to, '', [this, '__value'],[
		function(){
			this._destruct();
		}.bind(this)
	]);
};

_me._refresh = function(sB64, sHash, sType){

	//set photo
	if (sType && sB64)
		this.__base64 = [sType,sB64,sHash];

	var av = document.getElementById(this.maintab.general._pathName+'#avatar');
	if (av){
		av.src = getAvatarURL(this.__to || sPrimaryAccount);
		av = null;
	}
};

_me.__value = function(aData){

	if (this._destructed) return;

	var oTab;
	if (aData && aData.IQ && (aData = aData.IQ[0]) && aData.VCARD && (aData = aData.VCARD[0])){

		this.loader && this.loader._destruct();

		//GENERAL
		oTab = this.maintab.general;

		//Avatar Photo
		/*
		if (aData.PHOTO && aData.PHOTO[0] && aData.PHOTO[0].TYPE && aData.PHOTO[0].BINVAL){
			storage.library('wm_upload');

		    this.__base64 = [aData.PHOTO[0].TYPE[0].VALUE,aData.PHOTO[0].BINVAL[0].VALUE];

			var up = new wm_upload();
			    up.data2xml(aData.PHOTO[0].TYPE[0].VALUE,aData.PHOTO[0].BINVAL[0].VALUE,this.__to || sPrimaryAccount,[this,'_refresh']);
		}
		//Blank avatar
		else
		*/
			this._refresh();

		if (aData.FN)
			oTab.FN._value(aData.FN[0].VALUE);

		if (aData.NICKNAME)
			oTab.NICKNAME._value(aData.NICKNAME[0].VALUE);

		if (aData.BDAY)
			oTab.BDAY._value(aData.BDAY[0].VALUE);

		if (aData.TEL && aData.TEL[0].NUMBER)
			oTab.NUMBER._value(aData.TEL[0].NUMBER[0].VALUE);

		if (aData.URL)
			oTab.URL._value(aData.URL[0].VALUE);

		if (aData.EMAIL && aData.EMAIL[0].USERID)
			oTab.USERID._value(aData.EMAIL[0].USERID[0].VALUE);

		//WORK
		oTab = this.maintab.work;

		if (aData.ORG && aData.ORG[0].ORGNAME)
			oTab.ORGNAME._value(aData.ORG[0].ORGNAME[0].VALUE);

		if (aData.ORG && aData.ORG[0].ORGUNIT)
			oTab.ORGUNIT._value(aData.ORG[0].ORGUNIT[0].VALUE);

		if (aData.TITLE)
			oTab.TITLE._value(aData.TITLE[0].VALUE);

		if (aData.ROLE)
			oTab.ROLE._value(aData.ROLE[0].VALUE);

		//LOCATION
		if (aData.ADR){
            var aValues = {values:{}};
			if (aData.ADR[0].STREET)
				aValues.values.LCTSTREET = aData.ADR[0].STREET[0].VALUE;
			if (aData.ADR[0].LOCALITY)
				aValues.values.LCTCITY = aData.ADR[0].LOCALITY[0].VALUE;
			if (aData.ADR[0].REGION)
				aValues.values.LCTSTATE = aData.ADR[0].REGION[0].VALUE;
			if (aData.ADR[0].PCODE)
				aValues.values.LCTZIP = aData.ADR[0].PCODE[0].VALUE;
			if (aData.ADR[0].CTRY)
				aValues.values.LCTCOUNTRY = aData.ADR[0].CTRY[0].VALUE;

			this.maintab.location.location._value(aValues);
		}

		//ABOUT
		if (aData.DESC)
			this.maintab.about.DESC._value(aData.DESC[0].VALUE);
	}
	else{

		var aData = {};

		//GENERAL
		oTab = this.maintab.general;

		aData.FN = [{VALUE:oTab.FN._value()}];
		aData.NICKNAME = [{VALUE:oTab.NICKNAME._value()}];
		aData.BDAY = [{VALUE:oTab.BDAY._value()}];
		aData.TEL = [{NUMBER:[{VALUE:oTab.NUMBER._value()}]}];
		aData.URL = [{VALUE:oTab.URL._value()}];
		aData.EMAIL = [{USERID:[{VALUE:oTab.USERID._value()}]}];

		//WORK
		oTab = this.maintab.work;

		aData.TITLE = [{VALUE:oTab.TITLE._value()}];
		aData.ROLE = [{VALUE:oTab.ROLE._value()}];
		aData.ORG = [{
					ORGNAME:[{VALUE:oTab.ORGNAME._value()}],
					ORGUNIT:[{VALUE:oTab.ORGUNIT._value()}]
					}];

		//LOCATION
		var aValues = this.maintab.location.location._value();
		aData.ADR = [{
					STREET:[{VALUE:aValues.values.LCTSTREET}],
					LOCALITY:[{VALUE:aValues.values.LCTCITY}],
					REGION:[{VALUE:aValues.values.LCTSTATE}],
					PCODE:[{VALUE:aValues.values.LCTZIP}],
					CTRY:[{VALUE:aValues.values.LCTCOUNTRY}]
					}];

		//ABOUT
        aData.DESC = [{VALUE:this.maintab.about.DESC._value()}];

		//PHOTO
		if (this.__base64.length)
			aData.PHOTO = [{TYPE:[{VALUE:'image/'+(this.__base64[0] || '').substr(this.__base64[0].lastIndexOf('/')+1)}],BINVAL:[{VALUE:this.__base64[1]}]}];

        return aData;
	}
};