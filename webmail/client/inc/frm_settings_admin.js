_me = frm_settings_admin.prototype;
function frm_settings_admin(){};

_me.__constructor = function(bDomainadmin,sDomainName)
{
	var me = this;
	this._defaultSize(-1,-1,850,620);

	if ((this._bDomainadmin = bDomainadmin?true:false))
		this._title(getLang('MAIN_MENU::DOMAIN_OPTIONS')+(sDomainName?' ('+ sDomainName +')':''),true);
	else
		this._title('MAIN_MENU::ADMIN_OPTIONS');

	this._xmlns = 'public';

	if (this._bDomainadmin) {
		this._draw('frm_settings_domainadmin','main',{domain_settings:true,'gw_access':sPrimaryAccountGW>0,'im_access':sPrimaryAccountIM>0,'chat_access':sPrimaryAccountCHAT>0});
		this._storage = 'domainadmin_storage';
		if (sDomainName){
			this._domain = sDomainName.trim();
			this._storage += '_' + this._domain;
		}
		else
			this._domain = dataSet.get('main',['domain']);
	}
	else {
		//include domains
		storage.library('wm_domains');
		this._domains = new wm_domains;

		this._draw('frm_settings_admin','main',{admin_settings:true,'gw_access':sPrimaryAccountGW>0,'im_access':sPrimaryAccountIM>0,'chat_access':sPrimaryAccountCHAT>0});
		this._storage = 'admin_storage';
	}

	var aRsc = ['skins',
				'mail_settings_general',
				'mail_settings_default',
				'layout_settings',
				'languages',
				'reset_settings',
				'calendar_settings',
				'default_calendar_settings',
				'event_settings',
				'global_settings',
				'spellchecker_languages',
				'restrictions',
				'homepage_settings',
				'external_settings',
				'groups',
				'signature',
				'teamchat_notify',
				'documents'
				];

	if (sPrimaryAccountIM>0) {
		aRsc.push('im');
		aRsc.push('chat');
	}

	if (!this._bDomainadmin)
		aRsc.push('domains_settings');

	storage.library('wm_storage');
	storage.library('frm_settings_helper');

    if (this._bDomainadmin && this._domain)
		dataSet.add(this._storage, '', WMStorage.get({'xmlns': this._xmlns,'domain':this._domain,'resources':aRsc}));
	else
		dataSet.add(this._storage, '', WMStorage.get({'xmlns': this._xmlns,'resources':aRsc}));

	this.__loadItems();

	this.x_btn_ok._onclick = function(){
		me.__saveItems();
		//if (GWOthers.getItem('LAYOUT_SETTINGS', 'language') != me._curLanguage)
		//	alert(getLang('LANGUAGES::ONCHANGE_INFO'));
	};

	this.__helper = new FrmSettingsHelper(this._bDomainadmin, true);
};

_me.__loadItems = function()
{
	if(!this.maintab) {
		return;
	}
	var me = this;

	// ********************************************
	// MAILSETTINGS
	this.maintab.mail_settings._onactive = function (bFirstTime) {
		var oTab = this.maintab;
		if (!bFirstTime){
            oTab.general._active(false);
			return;
		}

		// TAB1 - GENERAL
		oTab.general._onactive = function (bFirstTime) {
			if (bFirstTime) {

				this.show_inline_images._onchange = function(){
					oTab.general.show_images._disabled(!this._checked());
				};

				this.default_flag._fillLang({
					'1':["COLOR_LABELS::RED_FLAG",'bg_red'],
					'2':["COLOR_LABELS::BLUE_FLAG",'bg_blue'],
					'3':["COLOR_LABELS::GREEN_FLAG",'bg_green'],
					'5':["COLOR_LABELS::ORANGE_FLAG",'bg_orange'],
					'8':["COLOR_LABELS::PURPLE_FLAG",'bg_purple'],
					'a':["COLOR_LABELS::YELLOW_FLAG",'bg_yellow']
				});

				var aData = GWOthers.get('MAIL_SETTINGS_GENERAL', me._storage, true);
				if (aData)
					loadDataIntoFormOnAccess(this, aData, me._bDomainadmin);
			}
		}

		// TAB2 - DEFAULT
		oTab.mail_default._onactive = function (bFirstTime) {
			if (bFirstTime) {
				// Disable/enable options related to html email
				this.html_message._onchange = function() {
					me.__helper.htmlMessageFormatChange(
						this._parent,
						'0' === this._value()
					);
				};

				//spellchecker default lang
				var aLang = dataSet.get(me._storage,['SPELLCHECKER_LANGUAGES','ITEMS']);
				var aData = {};
				for (var i in aLang)
					if (aLang[i].VALUES && aLang[i].VALUES.PATH && aLang[i].VALUES.NAME)
						aData[aLang[i].VALUES.PATH.VALUE] = aLang[i].VALUES.NAME.VALUE;

				this.spellchecker._fill(aData);

				//Font-family
                aLang = dataSet.get('storage',['FONTS','ITEMS']);
				aData = {'0':getLang('SETTINGS::DEFAULT')};
			    for(var i in aLang)
					if (aLang[i].VALUES.FAMILY.VALUE)
						aData[aLang[i].VALUES.FAMILY.VALUE] = aLang[i].VALUES.NAME.VALUE;
				this.font_family._fill(aData);

				var aData = GWOthers.get('MAIL_SETTINGS_DEFAULT', me._storage, true);
				if (aData)
					loadDataIntoFormOnAccess(this, aData, me._bDomainadmin);

                if (!this.font_family._value())
                	this.font_family._value('0');
			}
		};

		// TAB8 - GROUPS
		oTab.groups._onactive = function (bFirstTime) {
			if (bFirstTime) {

				msiebox(this._getAnchor('msiebox'));

				var ds = dataSet.get(me._storage,['GROUPS','ITEMS']),
					dg = this.groups;

				//DataGrid
				dg.__sortColumn = 'GROUP';
				dg.__sortType = 0;
				dg._addColumns({
					'GROUP':{title:'SETTINGS::GROUP','width':50,mode:'%','arg':{'sort':'asc'},encode:true},
					'FOLDER':{title:'SETTINGS::SENT_FOLDER','width':50,mode:'%','arg':{'sort':'asc'},encode:true}
				});

				if (Is.Array(ds))
					for (var out = {}, i = 0; i<ds.length; i++)
						if (ds[i].VALUES && ds[i].VALUES.GROUP)
							out[ds[i].VALUES.GROUP.VALUE] = {
								data:{
									GROUP:ds[i].VALUES.GROUP.VALUE,
									FOLDER:ds[i].VALUES.SENTFOLDER && ds[i].VALUES.SENTFOLDER.VALUE?ds[i].VALUES.SENTFOLDER.VALUE:getLang('SETTINGS::DEFAULT')
								},
								arg:{
									group:ds[i].VALUES.GROUP.VALUE,
									folder:ds[i].VALUES.SENTFOLDER && ds[i].VALUES.SENTFOLDER.VALUE ? sPrimaryAccount + '/' + ds[i].VALUES.SENTFOLDER.VALUE:'' // /~
								}
							};

				dg._fill(out);

				dg.__grouphandler = function(a,b){
					if (a && dg._aData[a.group])
						delete dg._aData[a.group];

					dg._aData[b.group] = {
						data:{
							GROUP:b.group,
							FOLDER:b.folder?Path.split(b.folder)[1]:getLang('SETTINGS::DEFAULT')
						},
						arg:b
					};
					dg._fill();
				};

				// open item
				dg._ondblclick = function(e,elm,arg,id,col,aClickType){
					if (arg)
						oTab.groups.x_edit._onclick();
				};

				//Dialog
				function dialog(arg,aHandler){

					var frm = gui._create('add_group','frm_ok_cancel','','frm_group');
						frm._modal(true);
						frm._resizable(false);

						frm._title('SETTINGS::GROUP');
						frm._size(380,183,true);
						frm._draw('frm_group','main');

						//folder input
						frm.folder._value(arg && arg.folder?arg.folder:GWOthers.getItem('DEFAULT_FOLDERS','sent'));

						//group input
						if (arg && arg.group)
							frm.group._value(arg.group);

						frm.group._onerror = function(b){
							frm.x_btn_ok._disabled(b);
						};

						frm.group._restrict([function(v){
							if (v){
								var tmp = MailAddress.splitEmailsAndNames(v);
								if (tmp[0] && tmp[0].email && Is.Email(tmp[0].email))
									return true;
							}
							return false;
						}]);

						frm.group._onsubmit = function(){
							frm.x_btn_ok._onclick();
						};

						//OK
						frm.x_btn_ok._onclick = function(){
							if (aHandler){
								var tmp = MailAddress.splitEmailsAndNames(frm.group._value());
								if (tmp[0] && tmp[0].email && Is.Email(tmp[0].email))
									executeCallbackFunction(aHandler,arg,{group:tmp[0].email,folder:frm.folder._value() == GWOthers.getItem('DEFAULT_FOLDERS','sent')?'':frm.folder._value()})
							}

							this._parent._destruct();
						};

				};

				//Buttons
				this.x_add._onclick = function(e){
					dialog('',[dg, '__grouphandler']);
				};

				this.x_edit._onclick = function(){
					var v = dg._value();
					for (var i in v)
						if (dg._aData[v[i]]){
							dialog(dg._aData[v[i]].arg,[dg, '__grouphandler']);
							break;
						}
				};

				this.x_remove._onclick = function(){
					var v = dg._value();
					for (var i = v.length-1; i>=0; i--)
						delete dg._aData[v[i]];

					dg._fill();
				};

			}
		};

		oTab.signature._onactive = function (bFirstTime) {
			if (bFirstTime){
				msiebox(this._getAnchor('msiebox'));
				/*
				if (currentBrowser() == 'MSIE9')
					this._getAnchor('msiebox').onresize = function(e){
						if (this.offsetHeight != this.firstChild.offsetHeight)
							this.firstChild.style.height = this.offsetHeight + 'px';
					};
				*/

				//extend obj_rich
				this.text._create('vars','obj_select','additional');
				this.text.vars._fill({
					'*':getLang('SIGNATURE::VARIABLE'),
					'%displayname%':getLang('CONTACT::DISPLAYNAME'),
					'%firstname%':getLang('CONTACT::FIRST_NAME'),
					'%middlename%':getLang('CONTACT::MIDDLE_NAME'),
					'%surname%':getLang('CONTACT::LAST_NAME'),
					'%fullname%':getLang('CONTACT::FULL_NAME'),
					'%nickname%':getLang('CONTACT::NICK_NAME'),
					'%title%':getLang('CONTACT::TITLE'),
					'%suffix%':getLang('CONTACT::SUFFIX'),
					'%email1%':getLang('CONTACT::EMAIL1'),
					'%email2%':getLang('CONTACT::EMAIL2'),
					'%email3%':getLang('CONTACT::EMAIL3'),
					'%im%':getLang('CONTACT::IM'),
					'%freebusy%':getLang('CONTACT::CALENDAR_URL'),
					'%company%':getLang('CONTACT::COMPANY'),
					'%job%':getLang('CONTACT::JOB'),
					'%profession%':getLang('CONTACT::PROFESSION'),
					'%department%':getLang('CONTACT::DEPARTMENT'),
					'%assistant%':getLang('CONTACT::ASSISTANT'),
					'%manager%':getLang('CONTACT::MANAGER'),
					'%homepage%':getLang('CONTACT::HOMEPAGE'),
					'%street%':getLang('CONTACT::STREET'),
					'%city%':getLang('CONTACT::CITY'),
					'%state%':getLang('CONTACT::STATE'),
					'%zip%':getLang('CONTACT::ZIP'),
					'%country%':getLang('CONTACT::COUNTRY'),
					'%phonehome%':getLang('CONTACT::PHONE')+' '+getLang('PHONE::LCTPHNHOME1'),
					'%phonehome2%':getLang('CONTACT::PHONE')+' '+getLang('PHONE::LCTPHNHOME2'),
					'%phonemobile%':getLang('PHONE::LCTPHNMOBILE'),
					'%phoneassistant%':getLang('CONTACT::PHONE')+' '+getLang('PHONE::LCTPHNASSISTANT'),
					'%phonework%':getLang('CONTACT::PHONE')+' '+getLang('PHONE::LCTPHNWORK1'),
					'%phonework2%':getLang('CONTACT::PHONE')+' '+getLang('PHONE::LCTPHNWORK2'),
					'%faxhome%':getLang('PHONE::LCTPHNFAXHOME'),
					'%faxwork%':getLang('PHONE::LCTPHNFAXWORK'),
					'%faxother%':getLang('PHONE::LCTPHNOTHERFAX'),
					'%phonecallback%':getLang('PHONE::LCTPHNCALLBACK'),
					'%phonecompany%':getLang('PHONE::LCTPHNCOMPANY'),
					'%phonecar%':getLang('PHONE::LCTPHNCAR'),
					'%phoneisdn%':getLang('PHONE::LCTPHNISDN'),
					'%phoneother%':getLang('PHONE::LCTPHNOTHER'),
					'%phonepager%':getLang('PHONE::LCTPHNPAGER'),
					'%phoneprimary%':getLang('PHONE::LCTPHNPRIMARY'),
					'%phoneradio%':getLang('PHONE::LCTPHNRADIO'),
					'%phonetelex%':getLang('PHONE::LCTPHNTELEX'),
					'%phonehearing%':getLang('PHONE::LCTPHNHEARING'),
					'%phonesip%':getLang('PHONE::SIP'),
					'%businesshomepage%':getLang('CONTACT::HOMEPAGE') + ' ('+getLang('CONTACT::BUSINESS') +')',
					'%businessstreet%':getLang('CONTACT::STREET') + ' ('+getLang('CONTACT::BUSINESS') +')',
					'%businesscity%':getLang('CONTACT::CITY') + ' ('+getLang('CONTACT::BUSINESS') +')',
					'%businessstate%':getLang('CONTACT::STATE') + ' ('+getLang('CONTACT::BUSINESS') +')',
					'%businesszip%':getLang('CONTACT::ZIP') + ' ('+getLang('CONTACT::BUSINESS') +')',
					'%businesscountry%':getLang('CONTACT::COUNTRY') + ' ('+getLang('CONTACT::BUSINESS') +')'
				});

				this.x_preview._onclick = function(e){
					storage.library('wm_tools');

					var aValues = {};
					storeDataFromFormWithAccess(me.maintab.mail_settings.maintab.signature, aValues, {});

					if (!aValues.text.length)
						gui._create('signature_preview','frm_signature_preview','','signature_preview', '');
					else{
						var tools = new wm_tools();
						tools.signature_preview(aValues.text, [function(sData) {
							if (Is.String(sData))
								gui._create('signature_preview','frm_signature_preview','','signature_preview', sData);
						}]);
					}
				};

				this.text.vars._value('*');
				this.text.vars._onchange = function(){
					if (this._value() != '*')
						this._parent.__exec('html.insert', [this._value(), true]);
				};

				var aSign = dataSet.get(me._storage,['SIGNATURE','ITEMS','0','VALUES','TEXT']);
				if (aSign){
					var aData = {};
					if (aSign.ATTRIBUTES){
						aData.USERACCESS = {'text':aSign.ATTRIBUTES.USERACCESS};
						aData.ACCESS = {'text':aSign.ATTRIBUTES.ACCESS};
						aData.DOMAINADMINACCESS = {'text':aSign.ATTRIBUTES.DOMAINADMINACCESS};
					}
					aData.VALUES = {'text':aSign.VALUE};
					loadDataIntoFormOnAccess(this, aData, me._bDomainadmin);
				}
			}
		};

		// force drawing first tab
		oTab.general._active(true);
	}
	// ********************************************

	// IM SETTINGS
	if (this.maintab.im_settings)
		this.maintab.im_settings._onactive = function (bFirstTime) {
			var oTab = this.maintab;
			if (bFirstTime){

				if (oTab.general)
					oTab.general._onactive = function (bFirstTime) {
		                if (bFirstTime){
							var aData = GWOthers.get('IM', me._storage, true);
							if (typeof aData == 'object')
								loadDataIntoFormOnAccess(this, aData, me._bDomainadmin);
						}
					};

				if (oTab.chat)
					oTab.chat._onactive = function (bFirstTime) {
		                if (bFirstTime){
							var aData = GWOthers.get('IM', me._storage, true);
							if (typeof aData == 'object')
								loadDataIntoFormOnAccess(this, aData, me._bDomainadmin);
						}
					};

				// force drawing first tab
				oTab.general._active(true);
			}
		};

	// TEAMCHAT SETTINGS
	if (this.maintab.teamchat_settings)
		this.maintab.teamchat_settings._onactive = function (bFirstTime) {
			var oTab = this.maintab;
			if (bFirstTime){

				oTab.general._onactive = function (bFirstTime) {
					if (bFirstTime){
						var aData = GWOthers.get('CHAT', me._storage, true);
						if (typeof aData === 'object')
							loadDataIntoFormOnAccess(this, aData, me._bDomainadmin);
					}
				};

				oTab.digest._onactive = function (bFirstTime) {
					if (bFirstTime){
						this.teamchat_notify._onchange = function(){
							var b = !this._value();
							this._parent.u_gw_teamchat_dailynotify && this._parent.u_gw_teamchat_dailynotify._disabled(b);
							this._parent.u_gw_teamchat_pinnotify && this._parent.u_gw_teamchat_pinnotify._disabled(b);
							this._parent.u_gw_teamchat_uploadnotify && this._parent.u_gw_teamchat_uploadnotify._disabled(b);
							this._parent.u_gw_teamchat_mentionnotify && this._parent.u_gw_teamchat_mentionnotify._disabled(b);
						};

						var aData = GWOthers.get('CHAT', me._storage, true) || {};
						var bData = GWOthers.get('GLOBAL_SETTINGS', me._storage, true) || {VALUES: {}, ACCESS: {}, USERACCESS: {}, DOMAINADMINACCESS: {}};
						for(var i in bData.VALUES) {
							aData.VALUES[i] = bData.VALUES[i];
						}
						for(var i in bData.ACCESS) {
							aData.ACCESS[i] = bData.ACCESS[i];
						}
						for(var i in bData.USERACCESS) {
							aData.USERACCESS[i] = bData.USERACCESS[i];
						}
						for(var i in bData.DOMAINADMINACCESS) {
							aData.DOMAINADMINACCESS[i] = bData.DOMAINADMINACCESS[i];
						}
						if (typeof aData === 'object')
							loadDataIntoFormOnAccess(this, aData, me._bDomainadmin);

						this.teamchat_notify._onchange();
					}
				};

				// force drawing first tab
				oTab.general._active(true);
			}
		};

	// GENERALSETTINGS
	this.maintab.general_settings._onactive = function (bFirstTime) {
		var oTab = this.maintab;
		if (!bFirstTime){
			oTab.layout._active(false);
			return;
		}

		// TAB1 - LAYOUT
		oTab.layout._onactive = function (bFirstTime) {
			if (bFirstTime) {
				this.date_format._fill(CalendarFormatting.getFormats());
				//LANGs
				var aLang = GWOthers.get('LANGUAGES', me._storage, true),
					aData = {};
				for (var lang in aLang['VALUES'])
					aData[lang] = aLang['VALUES'][lang];
				this.language._fill(aData);

				if (!aData[GWOthers.getItem('LAYOUT_SETTINGS','language')])
					GWOthers.setItem('LAYOUT_SETTINGS','language',GWOthers.getDefaultValues('LAYOUT_SETTINGS').LANGUAGE);

				//SKINs
				var aSkin = GWOthers.get('SKINS', me._storage, true);
				var aData = {};
				for (var i in aSkin['VALUES'])
					if (i != 'value')
						aData[i] = aSkin['VALUES'][i];
				this.skin._fill(aData);

				if (!aData[GWOthers.getItem('LAYOUT_SETTINGS','skin')])
					GWOthers.setItem('LAYOUT_SETTINGS','skin',GWOthers.getDefaultValues('LAYOUT_SETTINGS').SKIN);

				//LOAD DATA
				var aData = GWOthers.get('LAYOUT_SETTINGS', me._storage, true);

				//Skin style
				if (this.skin_style && storage.aStorage.language.SKIN_STYLE){
					var tmp={}, ls = storage.aStorage.language.SKIN_STYLE;
					for(var i in ls)
						tmp[i.toLowerCase()] = [ls[i],i.toLowerCase()];

					this.skin_style._fill(tmp);

					if (aData && aData.VALUES && !tmp[aData.VALUES.skin_style]){
						aData.VALUES.skin_style = 'default';
					}
				}

				if (typeof aData == 'object')
					loadDataIntoFormOnAccess(this, aData, me._bDomainadmin);
			}
		};
		oTab.documents._onactive = function (bFirstTime) {
			if (bFirstTime) {
				var aData = GWOthers.get('DOCUMENTS', me._storage, true);

				//Autosave
				this.autosave._onclick = function() {
					this._parent.autosave_minutes._disabled(this._checked());
				};

				// Disable document editing
				this.disable_office._value(0);
				this.disable_office._onclick = function() {
					this._parent.office_app._disabled(!this._value());
				};
				this.office_app._fill({
					webdoc: getLang('OFFICELAUNCHER::WEBDOC'),
					webdoc_read: getLang('OFFICELAUNCHER::WEBDOC_READ'),
					suite: getLang('OFFICELAUNCHER::SUITE')
				});

				if (typeof aData == 'object')
					loadDataIntoFormOnAccess(this, aData, me._bDomainadmin);

				this.autosave_minutes._disabled(!this.autosave._checked());
				this.office_app._disabled(this.disable_office._value());
			}
		};
		oTab.login._onactive = function (bFirstTime) {
			if (bFirstTime) {
				var aData = GWOthers.get('LAYOUT_SETTINGS', me._storage, true);

				//LOGO
				this.x_login_logo._setFolder('logo'+ (me._domain?'/'+me._domain:''));
				// this.x_login_logo._onuploadend = function(aData){
					// if (aData && (aData = aData[aData.length-1])) {
					//	this._parent.x_login_logo._value('login_logo.'+Path.extension(aData.id));
				// 	}
				// };
				if (oTab.login.x_login_logo_set.domadmin)
					oTab.login.x_login_logo_set.domadmin._value(aData.DOMAINADMINACCESS.login_logo == 'view');

				// Background selector
				var file = GWOthers.getItem('LAYOUT_SETTINGS','login_background_name',me._storage);

				var tmp = {
					'0': getLang('SETTINGS::USE_UPLOADED'),
					'background--adrspach1.jpg': 'Adrspach 1',
					'background--adrspach2.jpg': 'Adrspach 2',
					'background--czech.jpg': 'Czech',
					'background--czech1.jpg': 'Czech 1',
					'background--czechcity.jpg': 'Czech City',
					'background--default.jpg': 'Default',
					'background--krivan.jpg': 'Krivan',
					'background--pleso.jpg': 'Pleso',
					'background--prague1.jpg': 'Prague 1',
					'background--prague2.jpg': 'Prague 2',
					'background--pragueboats.jpg': 'Pragueboats',
					'background--slovakia.jpg': 'Slovakia',
					'background--tatras.jpg': 'Tatras',
					'background--vine.jpg': 'Vine'
				};
				this.x_login_background_name._fill(tmp);
				if(file && !tmp[file])
					file = '0';
				this.x_login_background_name._value(file || 'background--default.jpg');
				if (oTab.login.x_login_background_name_set.domadmin)
					oTab.login.x_login_background_name_set.domadmin._value(aData.DOMAINADMINACCESS.login_background_name == 'view');

				// Background upload
				this.x_login_background._setFolder('background'+ (me._domain?'/'+me._domain:''));
				this.x_login_background._onuploadend = function(aData){
					if (aData && (aData = aData[aData.length-1])) {
					//	this._parent.x_login_background._value('login_logo.'+Path.extension(aData.id));
						this._parent.x_login_background_name._value('0');
					}
				};
				if (oTab.login.x_login_background_set.domadmin)
					oTab.login.x_login_background_set.domadmin._value(aData.DOMAINADMINACCESS.login_background == 'view');

				//Login colour
				if (this.x_login_color){
					var tmp = {
						'default':getLang('colors::blue'),
						'green-day':getLang('colors::green'),
						'code-orange':getLang('colors::orange'),
						'peaches':getLang('colors::peach'),
						'yellow-submarine':getLang('colors::yellow'),
						'deep-purple':getLang('colors::purple')
					};
					this.x_login_color._fill(tmp);
				}
				this.x_login_color._value(aData.VALUES.login_color);
				if (oTab.login.x_login_color_set.domadmin)
					oTab.login.x_login_color_set.domadmin._value(aData.DOMAINADMINACCESS.login_color == 'view');

				//Twitter and Facebook integration
				this.x_facebook_link._value(aData.VALUES.facebook_link);
				if (oTab.login.x_facebook_link_set.domadmin)
					oTab.login.x_facebook_link_set.domadmin._value(aData.DOMAINADMINACCESS.facebook_link == 'view');
				this.x_twitter_link._value(aData.VALUES.twitter_link);
				if (oTab.login.x_twitter_link_set.domadmin)
					oTab.login.x_twitter_link_set.domadmin._value(aData.DOMAINADMINACCESS.twitter_link == 'view');
				this.x_linkedin_link._value(aData.VALUES.linkedin_link);
				if (oTab.login.x_linkedin_link_set.domadmin)
					oTab.login.x_linkedin_link_set.domadmin._value(aData.DOMAINADMINACCESS.linkedin_link == 'view');

				// Disable fields with no right
				if(me._bDomainadmin) {
					this.x_login_logo._disabled(aData.ACCESS.login_logo=='view');
					this.x_login_background._disabled(aData.ACCESS.login_background=='view');
					this.x_login_background_name._disabled(aData.ACCESS.login_background_name=='view');
					this.x_login_color._disabled(aData.ACCESS.login_color=='view');
					this.x_facebook_link._disabled(aData.ACCESS.facebook_link=='view');
					this.x_twitter_link._disabled(aData.ACCESS.twitter_link=='view');
					this.x_linkedin_link._disabled(aData.ACCESS.linkedin_link=='view');
				}

				//Restriction part
				var aData = GWOthers.get('RESTRICTIONS', me._storage, true);
				if (typeof aData == 'object')
					loadDataIntoFormOnAccess(this, aData, me._bDomainadmin);
			}
		};

		// TAB2 - HOMEPAGE
		if (oTab.homepage)
			oTab.homepage._onactive = function (bFirstTime) {
				if (bFirstTime) {
					var aData = GWOthers.get('HOMEPAGE_SETTINGS', me._storage, true);
					if (typeof aData == 'object')
						loadDataIntoFormOnAccess(this, aData, me._bDomainadmin);
				}
			};

		// TAB3 - RESET
		if (oTab.reset)
			oTab.reset._onactive = function (bFirstTime) {
				if (bFirstTime) {
					var aData = GWOthers.get('RESET_SETTINGS', me._storage, true);
					if (typeof aData == 'object')
						loadDataIntoFormOnAccess(this, aData, me._bDomainadmin);
				}
			};

		// TAB4 - SERVER
		if (oTab.server)
			oTab.server._onactive = function (bFirstTime) {
				if (bFirstTime) {
					var aData = GWOthers.get('GLOBAL_SETTINGS', me._storage, true);
					if (typeof aData == 'object')
						loadDataIntoFormOnAccess(this, aData, me._bDomainadmin);
				}
			};

		// TAB5 - RESTRICTIONS
		if (oTab.restrictions)
			oTab.restrictions._onactive = function (bFirstTime) {
				if (bFirstTime) {
					var aData = GWOthers.get('RESTRICTIONS', me._storage, true);
					if (typeof aData == 'object')
						loadDataIntoFormOnAccess(this, aData, me._bDomainadmin);

					if (aData.VALUES.disable_gw_types){
						if (aData.VALUES.disable_gw_types.indexOf('c')>-1)
							oTab.restrictions.x_c._value(1);
						if (aData.VALUES.disable_gw_types.indexOf('e')>-1)
							oTab.restrictions.x_e._value(1);
						if (aData.VALUES.disable_gw_types.indexOf('j')>-1)
							oTab.restrictions.x_j._value(1);
						if (aData.VALUES.disable_gw_types.indexOf('n')>-1)
							oTab.restrictions.x_n._value(1);
						if (aData.VALUES.disable_gw_types.indexOf('t')>-1)
							oTab.restrictions.x_t._value(1);
						if (aData.VALUES.disable_gw_types.indexOf('f')>-1)
							oTab.restrictions.x_f._value(1);
						if (aData.VALUES.disable_gw_types.indexOf('r')>-1)
							oTab.restrictions.x_r._value(1);


						/*
						//Not used
						if (aData.VALUES.disable_gw_types.indexOf('w')>-1)
							oTab.restrictions.x_w._value(1);
						if (aData.VALUES.disable_gw_types.indexOf('b')>-1)
							oTab.restrictions.x_b._value(1);
						*/

						if (aData.VALUES.disable_gw_types.indexOf('q')>-1)
							oTab.restrictions.x_q._value(1);
					}

					if (oTab.restrictions.x_disable_gw_types_set.domadmin)
						oTab.restrictions.x_disable_gw_types_set.domadmin._value(aData.DOMAINADMINACCESS.disable_gw_types == 'view');

					if(oTab.restrictions.disable_login_help)
						oTab.restrictions.disable_login_help._onchange = function(e) {
							if(this._checked())
								oTab.restrictions.disable_login_banners._checked(true);
						}

				}
			};

		if (oTab.dropbox)
			oTab.dropbox._onactive = function (bFirstTime) {
				if (bFirstTime) {
					var aData = GWOthers.get('EXTERNAL_SETTINGS', me._storage, true);
					if (typeof aData == 'object')
						loadDataIntoFormOnAccess(this, aData, me._bDomainadmin);
				}
			}

		// force drawing first tab
		oTab.layout._active(true);
	};

	// ********************************************
	// CALENDARSETTINGS

	this.maintab.calendar_settings._onactive = function (bFirstTime) {
		var oTab = this.maintab;
		if (!bFirstTime){
            oTab.main._active(false);
			return;
		}

		// TAB1 - MAIN
		oTab.main._onactive = function (bFirstTime) {
			if (bFirstTime) {

				// init
				this.week_begins._fillLang({
					'sunday': "DAYS::SUNDAY",
					'monday': "DAYS::MONDAY",
					'tuesday': "DAYS::TUESDAY",
					'wednesday': "DAYS::WEDNESDAY",
					'thursday': "DAYS::THURSDAY",
					'friday': "DAYS::FRIDAY",
					'saturday': "DAYS::SATURDAY"
				});

				this.week_begins._value('sunday');

				if (this.day_begins && this.day_ends){
					var aHours = {};
					for (var i=0; i<24; i++) {
						aHours[i] = i.toString() + ':00';
						aHours[i + .5] = i.toString() + ':30';
					}

					this.day_begins._fill(aHours);
					this.day_begins._setNatSort(true);
					this.day_ends._fill(aHours);
					this.day_ends._setNatSort(true);

					this.day_begins._onchange = function (){
						if (parseInt(this._value()) > parseInt(this._parent.day_ends._value()))
							this._parent.day_ends._value(this._value());
					}
					this.day_ends._onchange = function (){
						if (parseInt(this._parent.day_begins._value()) > parseInt(this._value()))
							this._parent.day_begins._value(this._value());
					}
				}

				// Handle work week logic
				this.workweek_begins._fillLang({
					'1': "DAYS::MONDAY",
					'2': "DAYS::TUESDAY",
					'3': "DAYS::WEDNESDAY",
					'4': "DAYS::THURSDAY",
					'5': "DAYS::FRIDAY",
					'6': "DAYS::SATURDAY",
					'7': "DAYS::SUNDAY"
				});
				this.workweek_begins._onchange = function (){
					var begin = parseInt(this._value());
					var end = oTab.main.workweek_ends;
					// Set week end to 5 days ahead by default
					if(end._value()==undefined)
						end._value((begin+=4) > 7 ? begin-7 : begin);
					// Work week can't start and end on same day
					else if(begin==end._value())
						end._value(begin==7?1:begin+1);
				}
				this.workweek_ends._fillLang({
					'1': "DAYS::MONDAY",
					'2': "DAYS::TUESDAY",
					'3': "DAYS::WEDNESDAY",
					'4': "DAYS::THURSDAY",
					'5': "DAYS::FRIDAY",
					'6': "DAYS::SATURDAY",
					'7': "DAYS::SUNDAY"
				});
				this.workweek_ends._onchange = function (){
					var begin = oTab.main.workweek_begins;
					var end = this._value();
					// Set week start to Monday by default
					if(begin._value()==undefined)
						begin._value('1');
					// Do not allow work week to be on same day
					if(begin._value()==end)
						begin._value(end==1?7:end-1);
				}

				// load data
				var aData = GWOthers.get('CALENDAR_SETTINGS', me._storage, true);
				if (aData)
					loadDataIntoFormOnAccess(this, aData, me._bDomainadmin);
			}
		}

		// TAB2 - DEFAULT SETTINGS
		oTab.default_settings._onactive = function (bFirstTime) {
			if (bFirstTime) {
				var aData = GWOthers.get('DEFAULT_CALENDAR_SETTINGS', me._storage, true);
				if (aData)
					loadDataIntoFormOnAccess(this, aData, me._bDomainadmin);
			}
		}

		// TAB3 - DEFAULT EVENT
		if (oTab.reminder)
			oTab.reminder._onactive = function (bFirstTime) {
				if (bFirstTime) {
                    this.event && (this.event._wasActivated = true);
					var aData = GWOthers.get('EVENT_SETTINGS',me._storage, true);
					if (typeof aData == 'object')
						loadDataIntoFormOnAccess(this.event, aData, me._bDomainadmin);
				}
			}

		// force drawing first tab
		oTab.main._active(true);
	};

	// ********************************************
	// DOMAINS
	if (this.maintab.domains_settings)
	this.maintab.domains_settings._onactive = function (bFirstTime) {
		if (!bFirstTime)
			return;

		// init
		this.x_adddomain._onclick = function(){
			var sDomain = (this._parent.x_domain._value() || '').trim();
			if (sDomain != ''){

				//domains are unigue
				var old = this._parent.domains._value();
				for(var i in old)
					if(old[i].domain == sDomain) return;

				this._parent.domains._add([{'domain':sDomain}]);
			}
		};

		this.x_remove._onclick = function(){
			this._parent.domains._removeSelected();
		};

		this.domains._ondblclick = function(){
			var aDomain = this._getSelectedValue();
			if (aDomain && aDomain.domain)
				gui._create('settings','frm_settings_admin','','',true,aDomain.domain);
		};

		this.x_editdomain._onclick = function(){
			var aDomain = this._parent.domains._getSelectedValue();
			if (aDomain && aDomain.domain)
				gui._create('settings','frm_settings_admin','','',true,aDomain.domain);
		};

		// load values into lister
		var aDomains = me._domains.get(me._storage,true);
		if (aDomains)
			this.domains._add(aDomains);

		// load values into select
		var aDomains = me._domains.get(me._storage);
		if (aDomains){
			var arr = [],arr2 = {};
			for(var i in aDomains)
				if (aDomains[i].domain)
					arr.push(aDomains[i].domain.toString().trim());

			arr.sort();
			for(var i in arr)
				arr2[arr[i]] = arr[i];

			this.x_domain._fill(arr2);
		}
	};

	// ********************************************
	// FINALIZATION

	// force drawing first tab
	this.maintab.mail_settings._active(true);
};

_me.__saveItems = function()
{
	if(!this.maintab) {
		return;
	}

	var me = this;
	var aValues = {};

	function storeNonWellKnown(oForm, sResource) {
		var aValues = {},
			aAccess = {};
		if (oForm && oForm._wasActivated) {
			storeDataFromFormWithAccess(oForm, aValues, aAccess);
			GWOthers.set(sResource, aValues, me._storage, aAccess);
		}
	};

	// ********************************************
	// MAILSETTINGS
	if (this.maintab.mail_settings && this.maintab.mail_settings._wasActivated) {
		var oTab = this.maintab.mail_settings.maintab;

		storeNonWellKnown(oTab.mail_default, 'MAIL_SETTINGS_DEFAULT');

		// General
		if (oTab.general && oTab.general._wasActivated){
			var aValues = {},aAccess = {};
			storeDataFromFormWithAccess(oTab.general, aValues, aAccess);

			if (aAccess.DOMAINADMINACCESS){
				aAccess.DOMAINADMINACCESS.autoupdate_minutes = aAccess.DOMAINADMINACCESS.autoupdate;
				aAccess.DOMAINADMINACCESS.autosave_minutes = aAccess.DOMAINADMINACCESS.autosave;
				aAccess.DOMAINADMINACCESS.autoclear_trash_days = aAccess.DOMAINADMINACCESS.autoclear_trash;
			}
			if (aAccess.USERACCESS){
				aAccess.USERACCESS.autoupdate_minutes = aAccess.USERACCESS.autoupdate;
				aAccess.USERACCESS.autosave_minutes = aAccess.USERACCESS.autosave;
				aAccess.USERACCESS.autoclear_trash_days = aAccess.USERACCESS.autoclear_trash;
			}

			GWOthers.set('MAIL_SETTINGS_GENERAL', aValues, this._storage, aAccess);
		}

		// Groups
		if (oTab.groups && oTab.groups._wasActivated) {

			var out = [], v = oTab.groups.groups._aData;
			if (count(v)>0)
				for(var i in v)
					if (v[i].arg)
						out.push({
							ATTRIBUTES:{ACCESS:'full',DONT_SEND:false},
							VALUES:{
								GROUP:{ATTRIBUTES:{USERACCESS:'view'},VALUE:v[i].arg.group},
								SENTFOLDER:{ATTRIBUTES:{USERACCESS:'view'}, VALUE: Path.split(v[i].arg.folder)[1]/*.split('~')[1]*/ || ''}
							}
						});

			dataSet.add(me._storage,['GROUPS','ITEMS'],out,1);
			dataSet.add(me._storage,['GROUPS','ATTRIBUTES','DONT_SEND'],false,1);

		}

		// Signature
		if (oTab.signature && oTab.signature._wasActivated) {
			var aValues = {},aAccess = {};
			storeDataFromFormWithAccess(oTab.signature, aValues, aAccess);

			var out = [{
				ATTRIBUTES:{
					DONT_SEND:false
				},
				VALUES:{
					TEXT:{ATTRIBUTES:{USERACCESS:aAccess.USERACCESS.text},VALUE:aValues.text}
				}
			}];

			if (aAccess.DOMAINADMINACCESS)
				out[0].VALUES.TEXT.ATTRIBUTES.DOMAINADMINACCESS = aAccess.DOMAINADMINACCESS.text;

			dataSet.add(me._storage,['SIGNATURE','ITEMS'],out,1);
			dataSet.add(me._storage,['SIGNATURE','ATTRIBUTES','DONT_SEND'],false,1);
		}
	}
	// ********************************************

	// IM SETTINGS
	if (this.maintab.im_settings && this.maintab.im_settings._wasActivated) {
		//storeNonWellKnown(this.maintab.im_settings, 'IM');
		var oTab = this.maintab.im_settings.maintab;
		storeNonWellKnown(oTab.general, 'IM');
		storeNonWellKnown(oTab.chat, 'IM');
	}

	// TEAMCHAT SETTINGS
	if (this.maintab.teamchat_settings && this.maintab.teamchat_settings._wasActivated) {
		var oTab = this.maintab.teamchat_settings.maintab;
		storeNonWellKnown(oTab.general, 'CHAT');

		if(oTab.digest && oTab.digest._wasActivated) {
			var aValues = {};
			var bValues = {};
			var aAccess = {};
			var bAccess = {};
			storeDataFromFormWithAccess(oTab.digest, aValues, aAccess);
			for(var i in aValues) {
				if(i === 'teamchat_notify') {
					bValues[i] = aValues[i];
					delete(aValues[i]);
				}
			}
			for(var i in aAccess.DOMAINADMINACCESS || {}) {
				if(i === 'teamchat_notify') {
					bAccess.DOMAINADMINACCESS = bAccess.DOMAINADMINACCESS || {};
					bAccess.DOMAINADMINACCESS[i] = aAccess.DOMAINADMINACCESS[i];
					delete(aAccess[i]);
				}
			}
			for(var i in aAccess.USERACCESS || {}) {
				if(i === 'teamchat_notify') {
					bAccess.USERACCESS = bAccess.USERACCESS || {};
					bAccess.USERACCESS[i] = aAccess.USERACCESS[i];
					delete(aAccess[i]);
				}
			}
			GWOthers.set('CHAT', aValues, me._storage, aAccess);
			GWOthers.set('GLOBAL_SETTINGS', bValues, me._storage, bAccess);
		}
	}

	// GENERALSETTINGS
	if (this.maintab.general_settings && this.maintab.general_settings._wasActivated) {
		var oTab = this.maintab.general_settings.maintab;

		//Layout settings
		if (oTab.layout && oTab.layout._wasActivated) {
/*
			var aValues = {},aAccess = {};
			storeDataFromFormWithAccess(oTab.layout, aValues, aAccess);

			aAccess.USERACCESS.interfaces = oTab.layout.x_interfaces_set.user._value()?'view':'full';
			if (aAccess.DOMAINADMINACCESS)
				aAccess.DOMAINADMINACCESS.interfaces = oTab.layout.x_interfaces_set.domadmin._value()?'view':'full';

			aValues.interfaces = (oTab.layout.x_pro._value()?'a':'') + (oTab.layout.x_basic._value()?'b':'') + (oTab.layout.x_pda._value()?'p':'');

			GWOthers.set('LAYOUT_SETTINGS', aValues, this._storage, aAccess);
*/
			storeNonWellKnown(oTab.layout, 'LAYOUT_SETTINGS');
		}


		if (oTab.documents && oTab.documents._wasActivated) {
			storeNonWellKnown(oTab.documents, 'DOCUMENTS');
		}

		if (oTab.login && oTab.login._wasActivated) {

			var aValues = {},aAccess = {USERACCESS:{}};

			if (!this._bDomainadmin)
				aAccess.DOMAINADMINACCESS = {}

			//login logo
			var file = oTab.login.x_login_logo._value();
			if(file.values && file.values[0] && file.values[0].name) {
				aValues.login_logo = 'login_logo.' + Path.extension(file.values[0].name);
				aValues.logo_uploaded = Date.now();
			}

			aAccess.USERACCESS.login_logo = oTab.login.x_login_logo_set.user._value()?'view':'full';
			if (!this._bDomainadmin) aAccess.DOMAINADMINACCESS.login_logo = oTab.login.x_login_logo_set.domadmin._value()?'view':'full';

			//login backgrounds
			var upl = oTab.login.x_login_background._value();
			if(upl.values && upl.values[0] && upl.values[0].name) {
				aValues.login_background = 'login_background.' + Path.extension(upl.values[0].name);
				aValues.background_uploaded = Date.now();
			}
			aAccess.USERACCESS.login_background = oTab.login.x_login_background_set.user._value()?'view':'full';
			if (!this._bDomainadmin) aAccess.DOMAINADMINACCESS.login_background = oTab.login.x_login_background_set.domadmin._value()?'view':'full';

			var std = oTab.login.x_login_background_name._value();
			aValues.login_background_name = std=='0' ? aValues.login_background : std;
			aAccess.USERACCESS.login_background_name = oTab.login.x_login_background_name_set.user._value()?'view':'full';
			if (!this._bDomainadmin) aAccess.DOMAINADMINACCESS.login_background_name = oTab.login.x_login_background_name_set.domadmin._value()?'view':'full';


			//login style
			aValues.login_color = oTab.login.x_login_color._value();
			aAccess.USERACCESS.login_color = oTab.login.x_login_color_set.user._value()?'view':'full';
			if (!this._bDomainadmin) aAccess.DOMAINADMINACCESS.login_color = oTab.login.x_login_color_set.domadmin._value()?'view':'full';

			//facebook
			aValues.facebook_link = oTab.login.x_facebook_link._value();
			aAccess.USERACCESS.facebook_link = oTab.login.x_facebook_link_set.user._value()?'view':'full';
			if (!this._bDomainadmin) aAccess.DOMAINADMINACCESS.facebook_link = oTab.login.x_facebook_link_set.domadmin._value()?'view':'full';

			//twitter
			aValues.twitter_link = oTab.login.x_twitter_link._value();
			aAccess.USERACCESS.twitter_link = oTab.login.x_twitter_link_set.user._value()?'view':'full';
			if (!this._bDomainadmin) aAccess.DOMAINADMINACCESS.twitter_link = oTab.login.x_twitter_link_set.domadmin._value()?'view':'full';

			//linkedin
			aValues.linkedin_link = oTab.login.x_linkedin_link._value();
			aAccess.USERACCESS.linkedin_link = oTab.login.x_linkedin_link_set.user._value()?'view':'full';
			if (!this._bDomainadmin) aAccess.DOMAINADMINACCESS.linkedin_link = oTab.login.x_linkedin_link_set.domadmin._value()?'view':'full';

			//Store Layout part
			GWOthers.set('LAYOUT_SETTINGS', aValues, this._storage, aAccess);

			//Store restriction part
			storeNonWellKnown(oTab.login, 'RESTRICTIONS');
		}

		if (oTab.reset && oTab.reset._wasActivated)
			storeNonWellKnown(oTab.reset, 'RESET_SETTINGS');

		if (oTab.homepage && oTab.homepage._wasActivated)
			storeNonWellKnown(oTab.homepage, 'HOMEPAGE_SETTINGS');

		if (oTab.server && oTab.server._wasActivated)
			storeNonWellKnown(oTab.server, 'GLOBAL_SETTINGS');

		if (oTab.restrictions && oTab.restrictions._wasActivated){
			var aValues = {},aAccess = {};

			storeDataFromFormWithAccess(oTab.restrictions, aValues, aAccess);

			//DISABLE_GW_TYPES
			if (aAccess.DOMAINADMINACCESS)
				aAccess.DOMAINADMINACCESS.disable_gw_types = oTab.restrictions.x_disable_gw_types_set.domadmin._value()?'view':'full';

			aAccess.USERACCESS.disable_gw_types = oTab.restrictions.x_disable_gw_types_set.user._value()?'view':'full';
			aValues.disable_gw_types =	(oTab.restrictions.x_c._value()?'c':'')+
										(oTab.restrictions.x_e._value()?'e':'')+
										(oTab.restrictions.x_j._value()?'j':'')+
										(oTab.restrictions.x_n._value()?'n':'')+
										(oTab.restrictions.x_t._value()?'t':'')+
										(oTab.restrictions.x_r._value()?'r':'')+
										(oTab.restrictions.x_f._value()?'f':'')+
										(oTab.restrictions.x_q._value()?'q':'');
										/* Not used
										(oTab.restrictions.x_w._value()?'w':'')+
										(oTab.restrictions.x_b._value()?'b':'');
										*/


			GWOthers.set('RESTRICTIONS', aValues, this._storage, aAccess);
		}

		if (oTab.dropbox && oTab.dropbox._wasActivated)
			storeNonWellKnown(oTab.dropbox, 'EXTERNAL_SETTINGS');

	}
	// ********************************************

	// CALENDARSETTINGS
	if (this.maintab.calendar_settings && this.maintab.calendar_settings._wasActivated) {
		var oTab = this.maintab.calendar_settings.maintab;

		// Store general calendar settnigs
		var aValues = {},aAccess = {};
		storeDataFromFormWithAccess(oTab.main, aValues, aAccess);
		if (aAccess.DOMAINADMINACCESS){
			aAccess.DOMAINADMINACCESS.autoclear_trash_days = aAccess.DOMAINADMINACCESS.autoclear_trash;
		}
		if (aAccess.USERACCESS){
			aAccess.USERACCESS.autoclear_trash_days = aAccess.USERACCESS.autoclear_trash;
		}
		GWOthers.set('CALENDAR_SETTINGS', aValues, this._storage, aAccess);

		// Store default calendar settings
		storeNonWellKnown(oTab.default_settings, 'DEFAULT_CALENDAR_SETTINGS');

		// Store reminder settings
		if (oTab.reminder && oTab.reminder._wasActivated)
			storeNonWellKnown(oTab.reminder.event, 'EVENT_SETTINGS');

	}
	// ********************************************

	// DOMAINSSETTINGS
	if (this.maintab.domains_settings && this.maintab.domains_settings._wasActivated) {
		var oTab = this.maintab.domains_settings;
		var aValues = {};

		storeDataFromForm(oTab,aValues);
		me._domains.set(aValues.domains,this._storage);
	}

	//Záloha stávajícího storage
	dataSet.add('tmp_storage','',dataSet.get(this._storage));

	//Hromadné posílání povolených změn na server
	if (this._bDomainadmin && this._domain)
		var nOK = WMStorage.set({'xmlns':this._xmlns,'domain':this._domain,'resources':dataSet.get(this._storage)},this._storage,'',[this,'__saveItemsHandler']);
	else
		var nOK = WMStorage.set({'xmlns':this._xmlns,'resources':dataSet.get(this._storage)},this._storage,'',[this,'__saveItemsHandler']);

	//Na server se nic neposílá?
	if (nOK == 2) {
		dataSet.remove('tmp_storage');
		this._destruct();
	}
	else
		this._main.style.display = "none";
};

_me.__saveItemsHandler = function(bOK)
{
	//Přijal server náš dotaz?
	if (bOK){
		dataSet.remove('tmp_storage');
		this._destruct();
	}
	else{
		dataSet.add(this._storage,'',dataSet.get('tmp_storage'));
		dataSet.remove('tmp_storage');
		this._main.style.display = "block";
	}
};
