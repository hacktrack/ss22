_me = frm_contact.prototype;
function frm_contact(){};

_me.__constructor = function() {
	this._defaultSize(-1,-1,650,620);
	this._draw(
		'frm_contact',
		'main',
		{
			sort_as : GWOthers.getItem('RESTRICTIONS','sortstring') == '1',
			disable_html : !GWOthers.getItemAccess('MAIL_SETTINGS_DEFAULT','html_message') && '0' === GWOthers.getItem('MAIL_SETTINGS_DEFAULT','html_message')
		}
	);

	if (this._sFolderID == '@@mycard@@'){
		this.__initForm('MAIN_MENU::VCARD');
		//addcss(this._main,'vcard');
		if (this.x_btn_delete)
			this.x_btn_delete._destruct();
	}
	else
		this.__initForm('CONTACT::CONTACT');

	// Refresh list and preview in case tags were changed
	this.maintab.tab1.ITMCATEGORY.input._onChange = function(){
		this.__refreshView = true;
	}.bind(this);
};

_me.__print = function(aValues){

	var atmp,
		ainf = ['LCTSTREET','LCTCITY','LCTSTATE','LCTCOUNTRY','LCTZIP','LCTWEBPAGE'];
	if (aValues.LOCATIONS)
		for (var i in aValues.LOCATIONS){
			if (aValues.LOCATIONS[i].values.LCTTYPE == 'H'){
				aValues.values = objConcat (aValues.values,aValues.LOCATIONS[i].values);

				aValues.values.PHONES = [];
				for (var j in aValues.LOCATIONS[i].values)
				    if (j.indexOf('LCTPHN') == 0 && aValues.LOCATIONS[i].values[j])
						aValues.values.PHONES.push({PHNTYPE:getLang('PHONE::'+j),PHNNUMBER: aValues.LOCATIONS[i].values[j]});
			}

			atmp = {};
			for (var j in ainf)
				if (aValues.LOCATIONS[i].values[ainf[j]])
					atmp[ainf[j]] = aValues.LOCATIONS[i].values[ainf[j]];

			if (!Is.Empty(atmp))
				aValues.values[aValues.LOCATIONS[i].values.LCTTYPE] = atmp;
		}

	aValues = aValues.values;

	if (!gui.print)
		gui._create('print','frm_print');
	gui.print._add('C', aValues);
};

_me.__showAvatar = function(sType,sPath) {
	var me = this,
		sURL = './server/download.php?' + buildURL({'sid':dataSet.get('main',['sid']),'class':sType,'fullpath':sPath,'no':unique_id()}),
		img = new Image();

	img.onload = function(){
		var elm = document.getElementById(me.maintab.tab1._pathName+'#avatar_image');
		if (elm){

			if (currentBrowser() == 'MSIE7'){
				addcss(elm,'msie');

				//Remove old
				var span = elm.getElementsByTagName('SPAN');
				if (span && span[0])
					span[0].parentNode.removeChild(span[0]);
			}

			if (this.height>10 && this.width>10){
				if (currentBrowser() == 'MSIE7'){

					//Create New One
					var img = mkElement('img'),
						span = mkElement('span');
						span.style.width = elm.clientWidth + 'px';
						span.style.height = elm.clientHeight + 'px';
						span.appendChild(img);

					if (this.width>this.height){
						var r = this.height/elm.clientHeight;
						img.style.height = elm.clientHeight + 'px';

						if ((this.width/r)>elm.clientWidth)
							img.style.right = (((this.width/r)-elm.clientWidth)/2) + 'px';
					}
					else{
						var r = this.width/elm.clientWidth;
						img.style.width = elm.clientWidth + 'px';

						if ((this.height/r)>elm.clientHeight)
							this.style.bottom = (((this.height/r)-elm.clientHeight)/2) + 'px';
					}

					img.src = sURL;

					elm.style.backgroundImage = 'none';
					elm.insertBefore(span,elm.firstChild);
				}
				else
					elm.style.backgroundImage = 'url("'+ sURL +'")';

				elm.style.backgroundColor = '#FFFFFF';

				// When avatar is displayed allow remove
				addcss(elm,'removable');
				me.maintab.tab1.X_AVATAR._main.style.display = 'none';
				elm.title = getLang('POPUP_ITEMS::DELETE');

			}
			//Placeholder
			else{
				elm.style.backgroundImage = '';
				elm.style.backgroundColor = '';

				// No avatar, do not show remove
				removecss(elm,'removable');
				me.maintab.tab1.X_AVATAR._main.style.display = 'block';
				elm.title = "";
			}
		}
	};

	img.src = sURL;
};

_me.__loadItems = function() {
	if (!this.maintab) return;
	var me = this;
	//var bDisabledHtml = !GWOthers.getItemAccess('MAIL_SETTINGS_DEFAULT','html_message') && '0' === GWOthers.getItem('MAIL_SETTINGS_DEFAULT','html_message');

	var oTabs = this.maintab;

	// parsing Locations
	if (Is.Defined(this._aValues['LOCATIONS'])) {
		var aLocation;
		var aLocations = this._aValues['LOCATIONS'];

		for (var i in aLocations) {
			aLocation = aLocations[i];

			switch (aLocation['values']['LCTTYPE']) {
				case 'H': this._sHomeLocation = aLocation; break;
				case 'O': this._sOtherLocation = aLocation; break;
				case 'B': this._sBusinessLocation = aLocation; break;
			}
			if (aLocation['values']['LCT_ID'])
				aLocation['uid'] = i;
		}
	}

	// TAB1
	loadDataIntoForm(oTabs.tab1,this._aValues);

	//FullName
	oTabs.tab1.X_NAME._value(createNameFromLocation(this._aValues));
	oTabs.tab1.X_NAME._onblur = function(){
		me.__genClassifyAs();
	};
	oTabs.tab1.ITMCOMPANY._onkeyup = function(e){
		if ((e.which || e.keyCode) != 9)
			me.__genClassifyAs();
	};
	oTabs.tab1.X_BTN_NAME._onclick = function(){
		gui._create('frm_name','frm_name','','',oTabs.tab1.X_NAME,me._aValues);
	};

	//Copy contact name into window title
	oTabs.tab1.ITMCLASSIFYAS._onblur = function(){
		var sTitle = this._value();
		if (sTitle){
			if (sTitle.length>32)
			    sTitle = sTitle.substr(0,32)+'...';

            if (me._sFolderID != '@@mycard@@')
				me._title(sTitle + (me._aValues.ITMFOLDER?' - '+me._aValues.ITMFOLDER:''),true);
		}
		else
		if (me._sFolderID != '@@mycard@@')
			me._title(getLang('CONTACT::CONTACT') + (me._aValues.ITMFOLDER?' - '+me._aValues.ITMFOLDER:''),true);
	};
	this.__genClassifyAs(oTabs.tab1.ITMCLASSIFYAS._value()?true:false);
	oTabs.tab1.ITMCLASSIFYAS._onblur();

	//Avatar
	var av = document.getElementById(this.maintab.tab1._pathName+'#avatar_image');
	if (currentBrowser() == 'MSIE7')
		addcss(av,'msie');

	if (!this.__readonly){

		addcss(av,'enabled');

		//Avatar Button
		oTabs.tab1.X_AVATAR._setFileTypes('image/*','');

		oTabs.tab1.X_AVATAR._setPostParam('resize',1);
		oTabs.tab1.X_AVATAR._setPostParam('width',800);
		oTabs.tab1.X_AVATAR._setPostParam('height',800);

		oTabs.tab1.X_AVATAR._onuploadstart = function(){
			me.x_btn_ok._disabled(true);
			me._create('image_processing', 'obj_loader');
			me.image_processing._value(getLang('COMMON::PROCESSING'));
		};
		oTabs.tab1.X_AVATAR._onuploadend = function(arg){
			me.x_btn_ok._disabled(false);
			if(me.image_processing) {
				me.image_processing._destruct();
			}
			if (arg && (arg = arg[arg.length-1]) && arg.folder && arg.id) {
				me.__showAvatar('file', arg.folder+'/'+arg.id);
				me.__avatarChanged = true;
			}
		};

		av.onmousemove = function(e){
			var e = e || window.event,
				elm = me.maintab.tab1.X_AVATAR._main,
				pos = getSize(this);
				x = e.clientX - pos.x - 7,
				y = e.clientY - pos.y - 7;

			if (x<0)
				x = 0;
			else
			if (x>pos.w)
				x = pos.w;

			if (y<0)
				y = 0;
			else
			if (y>pos.h)
				y = pos.h;



			elm.style.left = x + 'px';
			elm.style.top = y + 'px';
		};

		// Clicking on image to remove if uploaded
		av.onclick = function(e) {
			var elm = document.getElementById(me.maintab.tab1._pathName+'#avatar_image');
			if (hascss(elm,'removable')){
				var conf = gui._create('delete_avatar_confirm','frm_confirm','','', [me,function() {
					//Remove IE8 Avatars
					var img = elm.getElementsByTagName('IMG');
					for (var i = img.length-1;i>=0;i--)
						img[i].parentNode.removeChild(img[i]);

					elm.style.backgroundImage = '';
					elm.style.backgroundColor = '';

					this.maintab.tab1.X_AVATAR._main.style.display = 'block';
					removecss(elm,'removable');
					elm.title = "";

					me.__avatarDeleted = true;
					me.__avatarChanged = false;

					oTabs.tab1.X_AVATAR._reset(true);

				}],'POPUP_ITEMS::CONTACTS','CONFIRMATION::DELETE_AVATAR');
				addcss(conf.x_btn_ok._main, 'color2');
			}
		};

		oTabs.tab1.X_AVATAR._dropzone(oTabs.tab1._main);
	}

    //Avatar Image
	if (Is.Defined(me._aValues['ATTACHMENTS']))
		for(var i in me._aValues['ATTACHMENTS'])
			if (me._aValues['ATTACHMENTS'][i].values.ATTTYPE == 'P'){
                this.__showAvatar('attachment', me._sAccountID+'/'+me._sFolderID+'/'+WMItems.__serverID(me._sItemID)+'/'+i);
                break;
			}

	//Default Phone type values
	var loc = {'LCTPHNWORK1':'X_PHONE1', 'LCTPHNHOME1':'X_PHONE2', 'LCTPHNFAXWORK':'X_PHONE3', 'LCTPHNMOBILE':'X_PHONE4'};
		loc_used = [];

	for(var name in loc){
		oTabs.tab1[loc[name]]._value(name);
		oTabs.tab1[loc[name]]._listen(this._pathName,['phones']);
	}

	if (Is.Defined(this._sHomeLocation)) {

		//Email
		if (Is.Defined(this._sHomeLocation['values']['LCTEMAIL1']))
			oTabs.tab1.X_EMAIL1._value(this._sHomeLocation['values']['LCTEMAIL1']);
		if (Is.Defined(this._sHomeLocation['values']['LCTEMAIL2']))
			oTabs.tab1.X_EMAIL2._value(this._sHomeLocation['values']['LCTEMAIL2']);
		if (Is.Defined(this._sHomeLocation['values']['LCTEMAIL3']))
			oTabs.tab1.X_EMAIL3._value(this._sHomeLocation['values']['LCTEMAIL3']);

		//Phone
		for(var name in loc){
			if (Is.Defined(this._sHomeLocation['values'][name])){
				delete loc[name];
				loc_used.push(name);
			}
		}

		var k = Object.keys(loc);

		for(var sPhnName in this._sHomeLocation.values)
			if (sPhnName.indexOf('LCTPHN')===0 && this._sHomeLocation.values[sPhnName]){

				dataSet.add(this._pathName,['phones', sPhnName], this._sHomeLocation.values[sPhnName]);

				if (k.length && loc_used.indexOf(sPhnName) == -1){
					oTabs.tab1[loc[k.shift()]]._value(sPhnName);
				}
			}
	}

	//remove phones dataset
	this._obeyEvent('destructed',[function(){
		dataSet.remove(me._pathName, null, true);
	}]);

	if (this.__readonly)
		oTabs.tab1._readonly();
	else{
		oTabs.tab1._onactive = function(){
			this.X_NAME._focus();
		};
		oTabs.tab1.X_NAME._focus();
	}

	// TAB2
	oTabs.tab2._onactive = function (bFirstTime) {
		if (bFirstTime) {
			loadDataIntoForm(this,me._aValues);
			if (Is.Defined(me._sHomeLocation)) {
				this.X_HOME_ADDRESS._value(me._sHomeLocation);
				if (Is.Defined(me._sHomeLocation['values']['LCTWEBPAGE']))
					this.X_HOMEPAGE._value(me._sHomeLocation['values']['LCTWEBPAGE']);
			}
			if (Is.Defined(me._sOtherLocation)){
				this.X_OTHER_ADDRESS._value(me._sOtherLocation);
				if (Is.Defined(me._sOtherLocation['values']['LCTWEBPAGE']))
					this.X_HOMEPAGE2._value(me._sOtherLocation['values']['LCTWEBPAGE']);
			}
		}

		if (me.__readonly) {
			this._readonly();
			this.ITMGENDER._disabled(true);
		}
		else
			this.X_HOME_ADDRESS._focus();
	};

	// TAB3
	oTabs.tab3._onactive = function (bFirstTime) {
		if (bFirstTime) {
			loadDataIntoForm(this,me._aValues);
			if (Is.Defined(me._sBusinessLocation)) {
				this.X_OFFICE_ADDRESS._value(me._sBusinessLocation);
				if (Is.Defined(me._sBusinessLocation['values']['LCTWEBPAGE']))
					this.X_WEB._value(me._sBusinessLocation['values']['LCTWEBPAGE']);
			}
		}

		if (me.__readonly)
			this._readonly();
		else
			this.ITMPROFESSION._focus();
	};

	// TAB4
	oTabs.tab4._onactive = function (bFirstTime) {
		if (bFirstTime){

			//HTML Mode switcher - for rtl always rich unless specified as plain
			this.ITMDESCRIPTION.select._fillLang({'enabled': "COMPOSE::HTML", 'disabled': "COMPOSE::TEXT", 'code':'RICH::CODE'});

			if (gui._rtl || !me._aValues || !me._aValues.ITMDESCFORMAT || me._aValues.ITMDESCFORMAT.toLowerCase() != 'text/plain')
				this.ITMDESCRIPTION.select._value('enabled');
			else
				this.ITMDESCRIPTION.select._value('disabled');

			// Keyboard esc will close window
			this.ITMDESCRIPTION._onesc = function() {
				me._close(true);
			};

			loadDataIntoForm(this,me._aValues);
		}

		if (me.__readonly)
			this._readonly();
		else
			this.ITMDESCRIPTION._focus();
	};

	// TAB5
    if (oTabs.tab5)
	oTabs.tab5._onactive = function (bFirstTime) {
		if (bFirstTime){

			if (me._aValues['ATTACHMENTS']){
				var out = [];
				for (var i in me._aValues['ATTACHMENTS'])
					out.push({
						'name': me._aValues['ATTACHMENTS'][i]['values']['ATTDESC'],
						'class': me._aValues['ATTACHMENTS'][i]['values']['ATTTYPE'],
						'id': i,
						'ticket': me._aValues['ATTACHMENTS'][i]['values']['TICKET'],
						'fullpath': me._aValues.fullpath,
						'size': me._aValues['ATTACHMENTS'][i]['values']['ATTSIZE']}
						);

				if (me._aValues.fullpath)
					this.X_ATTACHMENTS._value({'values': out});
				else
					this.X_ATTACHMENTS._value({'path': me._sAccountID+'/'+me._sFolderID+'/'+WMItems.__serverID(me._sItemID), 'values': out});
			}
			else
			if (me._aValues['PUSH_ATTACHMENTS']){
				var out = [];
				for (var i in me._aValues['PUSH_ATTACHMENTS'])
					out.push({
						'name': me._aValues['PUSH_ATTACHMENTS'][i]['title'],
						'id': me._aValues['PUSH_ATTACHMENTS'][i]['id'],
						'size': me._aValues['PUSH_ATTACHMENTS'][i]['size'],
						'class': me._aValues['PUSH_ATTACHMENTS'][i]['embedded'] ? 'item' : 'itemlink',
						'fullpath': me._aValues['PUSH_ATTACHMENTS'][i]['fullpath']
					});

				this.X_ATTACHMENTS._value({
					path:me._aValues['PUSH_ATTACHMENTS'][0]['fullpath'].substr(0,me._aValues['PUSH_ATTACHMENTS'][0]['fullpath'].lastIndexOf('/')),
					values:out
				});
			}

			//Control OK button
			this.X_ATTACHMENTS._onuploadstart = function(){
				me.x_btn_ok._disabled(true);
			};
			this.X_ATTACHMENTS._onuploadend = function(){
				me.x_btn_ok._disabled(false);
			};

			if (me.__readonly)
				this._readonly();
			else
				this.X_ATTACHMENTS.file._dropzone(this._main);	// Add DropZone
		}
	};

	// TAB6
	if (oTabs.tab6)
	oTabs.tab6._onactive = function (bFirstTime) {
        if (bFirstTime){
			if (Is.Defined(me._aValues['CERTIFICATES'])){
				var	tmp,aCerts = [];
				for(var i in me._aValues['CERTIFICATES']){
					if (me._aValues['CERTIFICATES'][i].values.INFO){
						tmp = XMLTools.Str2Arr(me._aValues['CERTIFICATES'][i].values.INFO).INFO[0];
						aCerts.push({'id':i,
									'name':(tmp.SUBJECT[0].CN?tmp.SUBJECT[0].CN[0].VALUE:(tmp.SUBJECT[0].EMAILADDRESS?tmp.SUBJECT[0].EMAILADDRESS[0].VALUE:'')),
									'class':'attachment',
									'expires':tmp.VALIDTO[0].VALUE,
									'serial':tmp.SERIALNUMBER?tmp.SERIALNUMBER[0].VALUE:'',
									'data':tmp});
					}
					else
					if (me._aValues['CERTIFICATES'][i].values['class'] == 'item'){
	                    aCerts.push({'id':i,
	                                'name':getLang('MAIL_VIEW::CERTIFICATE'),
									'class':'item',
									'fullpath':me._aValues['CERTIFICATES'][i].values.fullpath});
					}
				}

				this.X_CERT._value({'path':me._sAccountID+'/'+me._sFolderID+'/'+me._sItemID, 'values':aCerts});
			}

			if (me.__readonly)
				this._readonly();
			else
				this.X_CERT.file._dropzone(this._main); // Add DropZone
		}
	};

	// Force user to fill in required fields in vCard
	var mandatory = GWOthers.getItem('GLOBAL_SETTINGS', 'mandatory_contact_fields');
	if (this._sFolderID == '@@mycard@@' && mandatory && GWOthers.getItem('RESTRICTIONS','mandatory_user_info') == '1' && Cookie.get(['suppressmandatory'])!=1) {
		this.__mandatoryfields = [];

		var checkall = function(error) {
			// Disable saving until all fields are correct
			me.x_btn_ok._disabled(true);

			var tabs = {};
			for(var i=me.__mandatoryfields.length; i; i--) {
				// Check all fields and tabs for errors
				var tab = me.__mandatoryfields[i-1]._parent._type=='obj_tab' ? me.__mandatoryfields[i-1]._parent : me.__mandatoryfields[i-1]._parent._parent;
				if(hascss(me.__mandatoryfields[i-1]._main,"error")) {
					tabs[tab._name] = tab._main;
					error = true;
				}
				// Mark tabs as incorrect if necessary
				for(var t in mandatory)
					oTabs[t]._incorrect(false);
				for(var t in tabs)
					oTabs[t]._incorrect(true);
				// If there are no errors, allow saving
				if(!error)
					me.x_btn_ok._disabled(false);
			}
			return error;
		};

		// Parse requested fields from server settings
		if(mandatory.indexOf('(')!=-1) {
			var tmp = mandatory.split(';');
			mandatory = {};
			for(var i=tmp.length; i; i--) {
				var m = tmp[i-1].match(/^(tab[0-9]+)\((.+)\)$/i);
				mandatory[m[1]] = m[2].toUpperCase().split(',');
			}
		} else
			mandatory = {tab1: mandatory.toUpperCase().split(',')};

		// Check and mark all required fields
		for(var tab in mandatory) {
			this.maintab[tab]._active();
			for(var i=mandatory[tab].length; i; i--) {
				// Finding field objects from labels
				var field = mandatory[tab][i-1];
				if(field.indexOf('_')!=-1) {
					field = field.split('_');
					field = oTabs[tab]['X_'+field[0]+'_ADDRESS']['LCT'+field[1]];
				} else
					field = oTabs[tab][field] || oTabs[tab]["X_"+field] || oTabs[tab]["ITM"+field];
				// Add restrict, check and callback
				if(field) {
					this.__mandatoryfields.unshift(field);
					field._onerror = checkall;
					if(field._restrict)
						field._restrict(".+");
					else console.warn("No restrict!",tab,field);
				}
			}
		}
	}


	if (me._aValues['PUSH_ATTACHMENTS'] && this.maintab.tab5)
		this.maintab.tab5._active();
};

_me.__genClassifyAs = function(bNoValue){
    var tab1 = this.maintab.tab1,
		aValues = {},
		aFill = {};

	if (createNameFromLocation(this._aValues) == tab1.X_NAME._value()){
		aValues.ITMFIRSTNAME = this._aValues.ITMFIRSTNAME;
        aValues.ITMMIDDLENAME = this._aValues.ITMMIDDLENAME;
        aValues.ITMSURNAME = this._aValues.ITMSURNAME;
	}
	else
		parseNameToLocation(tab1.X_NAME._value(),aValues);

    aValues.ITMCLASSIFYAS = createNameFromLocation({
		ITMFIRSTNAME:aValues.ITMFIRSTNAME,
		ITMMIDDLENAME:aValues.ITMMIDDLENAME,
		ITMSURNAME:aValues.ITMSURNAME
	});

	var tmp = (aValues.ITMSURNAME || '');
	if (aValues.ITMFIRSTNAME || aValues.ITMMIDDLENAME){
        tmp += (tmp?', ':'') + (aValues.ITMFIRSTNAME || '');
		if (aValues.ITMMIDDLENAME)
			tmp += (aValues.ITMFIRSTNAME?' ':'') + aValues.ITMMIDDLENAME;
	}

	if (tmp)
		aFill[tmp] = tmp;
	else
	    tmp = '';

	if (aValues.ITMCLASSIFYAS)
		aFill[aValues.ITMCLASSIFYAS] = aValues.ITMCLASSIFYAS;

	if (tab1.ITMCOMPANY._value()){
		aFill[tmp+' ('+ tab1.ITMCOMPANY._value() +')'] = tmp + ' ('+ tab1.ITMCOMPANY._value() +')';
		aFill[tab1.ITMCOMPANY._value() + (tmp?' ('+tmp+')':'')] = tab1.ITMCOMPANY._value() + (tmp?' ('+tmp+')':'');
	}

	if (bNoValue){
		tab1.ITMCLASSIFYAS._fill(aFill);
	}
	else{
		//get current value position
		var f = Object.keys(tab1.ITMCLASSIFYAS.__idTable).indexOf(tab1.ITMCLASSIFYAS._value());

		tab1.ITMCLASSIFYAS._fill(aFill);

		//get new value based on previous one
		var k = Object.keys(tab1.ITMCLASSIFYAS.__idTable),
			v = k[0];

		if (~f && Is.Defined(k[f]))
			v = k[f];

		tab1.ITMCLASSIFYAS._value(v);
		tab1.ITMCLASSIFYAS._onblur();
	}
};

_me.__saveItems = function(aValues) {

	var tab1 = this.maintab.tab1,
		tab2 = this.maintab.tab2,
		tab3 = this.maintab.tab3,
		tab4 = this.maintab.tab4,
		tab5 = this.maintab.tab5,
		tab6 = this.maintab.tab6,
		aHome, aOther, aBusiness,
		tmpClassifyAs = aValues.values.ITMCLASSIFYAS;

	if (tab4 && tab4._wasActivated) {
		aValues.values.ITMDESCFORMAT = tab4.ITMDESCRIPTION.select._value() === 'disabled'?'text/plain':'text/html';
		tab4.ITMDESCRIPTION.__output_format = aValues.values.ITMDESCFORMAT !== 'text/plain';
		aValues.values.ITMDESCRIPTION = tab4.ITMDESCRIPTION._value();
	}

	//autofill fullname
	if (createNameFromLocation(this._aValues) == tab1.X_NAME._value()){
        aValues.values.ITMTITLE = this._aValues.ITMTITLE;
        aValues.values.ITMFIRSTNAME = this._aValues.ITMFIRSTNAME;
        aValues.values.ITMMIDDLENAME = this._aValues.ITMMIDDLENAME;
        aValues.values.ITMSURNAME = this._aValues.ITMSURNAME;
        aValues.values.ITMSUFFIX = this._aValues.ITMSUFFIX;
	}
	else
		parseNameToLocation(tab1.X_NAME._value(),aValues.values);

	aValues.values.ITMCLASSIFYAS = tmpClassifyAs || createNameFromLocation(aValues.values);

	if (Is.Defined(tab2.X_HOME_ADDRESS)) {
		aHome = tab2.X_HOME_ADDRESS._value();
		aHome['values']['LCTWEBPAGE'] = tab2.X_HOMEPAGE._value();

		aOther = tab2.X_OTHER_ADDRESS._value();
		aOther['values']['LCTWEBPAGE'] = tab2.X_HOMEPAGE2._value();
	}
	else {
		if (Is.Defined(this._sHomeLocation))
			aHome = this._sHomeLocation;
		else
			aHome = {'values':{}};

		if (Is.Defined(this._sOtherLocation))
			aOther = this._sOtherLocation;
		else
			aOther = {'values':{}};
	}

	if (Is.Defined(tab3.X_OFFICE_ADDRESS)) {
		aBusiness = tab3.X_OFFICE_ADDRESS._value();
		aBusiness['values']['LCTWEBPAGE'] = tab3.X_WEB._value();
	}
	else{
		if (Is.Defined(this._sBusinessLocation))
			aBusiness = this._sBusinessLocation;
		else
			aBusiness = {'values':{}};
	}

	aHome['values']['LCTEMAIL1'] = tab1.X_EMAIL1._value();
	aHome['values']['LCTEMAIL2'] = tab1.X_EMAIL2._value();
	aHome['values']['LCTEMAIL3'] = tab1.X_EMAIL3._value();
	aHome['values']['LCTIM'] = tab1.X_IM1._value();

	var aPhones = dataSet.get(this._pathName, ['phones']);
	for (var s in aPhones)
		aHome['values'][s] = aPhones[s];

	var aLocations = [], bIsHome = false;
	if (!isFormEmpty(aHome)) {
		aHome['values']['LCTTYPE'] = 'H';
		aLocations.push(aHome);
		bIsHome = true;
	}

	if (!isFormEmpty(aBusiness)) {
		if (!Is.Empty(aPhones))
			for (var s in aPhones)
				aBusiness['values'][s] = '';//aPhones[s];

		// add location
		aBusiness['values']['LCTTYPE'] = 'B';
		aLocations.push(aBusiness);
	}

	if (!isFormEmpty(aOther)) {
		if (!Is.Empty(aPhones))
			for (var s in aPhones)
				aOther['values'][s] = '';//aPhones[s];

		// add location
		aOther['values']['LCTTYPE'] = 'O';
		aLocations.push(aOther);
	}

	if (aLocations.length){

		// add HOME location if doesnt exist
		if (!bIsHome)
			aLocations.push({values:{LCTTYPE:'H'}});

		aValues['LOCATIONS'] = aLocations;
	}

	//Attachments
	var aAttachments;
	if (tab5 && tab5.X_ATTACHMENTS && !Is.Empty(aAttachments = tab5.X_ATTACHMENTS._value()))
		aValues['ATTACHMENTS'] = aAttachments;

	//Avatar - add or remove if changed
	if (tab1.X_AVATAR && (this.__avatarChanged || this.__avatarDeleted)) {


		//remove existing avatar
		for (var i in this._aValues['ATTACHMENTS'])
			if (this._aValues['ATTACHMENTS'][i].values.ATTTYPE == 'P'){

				if (!aValues['ATTACHMENTS'])
					aValues['ATTACHMENTS'] = [];

				aValues['ATTACHMENTS'].push({uid:i});
				break;
			}

		//append avatar
		aAttachments = tab1.X_AVATAR._value();
		if(!Is.Empty(aAttachments) && aAttachments.values.length) {

			if (!aValues['ATTACHMENTS'])
				aValues['ATTACHMENTS'] = [];

			aAttachments = aAttachments.values[aAttachments.values.length-1];
			aValues['ATTACHMENTS'].push({values:{"class":'image',description:aAttachments.name,fullpath:aAttachments.folder +'/'+ aAttachments.id}});
		}
	}

	//Certificates
	if (tab6){
		if (tab6.X_CERT){
			var v;
			if (!Is.Empty(v = tab6.X_CERT._value()) && count(v)>0){
				aValues['CERTIFICATES'] = [];
				var tmp;

				for(var i in v)
		            if (v[i].uid)
		               aValues['CERTIFICATES'].push(v[i]);
		            else
					if (v[i].fullpath){
						tmp = {'values':{'class':v[i]['class'] || 'file','fullpath':v[i].fullpath}};

						if (v[i].passphrase)
							tmp.values.PASSPHRASE = v[i].passphrase;

						aValues['CERTIFICATES'].push(tmp);
					}
			}
		}
		else
		if (this._aValues['CERTIFICATES'])
			for (var i in this._aValues['CERTIFICATES'])
				if (this._aValues['CERTIFICATES'][i].values['class'] == 'item'){
					if (!aValues['CERTIFICATES'])
						aValues['CERTIFICATES'] = [];

					aValues['CERTIFICATES'].push(this._aValues['CERTIFICATES'][i]);
				}
	}

	// If required fields, note when saved
	if(GWOthers.getItem('RESTRICTIONS','mandatory_user_info') == '1' && this._sFolderID == '@@mycard@@')
		Cookie.set(['suppressmandatory'],1);
};
