_me = frm_settings.prototype;
function frm_settings(){};

_me.__constructor = function(sTab1,sTab2)
{
	var me = this;

	sTab1 = sTab1 || 'general_settings';

	if (sPrimaryAccountGUEST)
		this._defaultSize(-1,-1,400,430);
	else
		this._defaultSize(-1,-1,780,620);

	this._title('MAIN_MENU::OPTIONS');

	storage.library('night_mode');
	storage.library('wm_storage');
	storage.library('gw_others');
	storage.library('wm_import');
	storage.library('frm_settings_helper');

	this._others = new gw_others;

	//Načteni potřebných resource
	this.resources = [
		'skins',
		'global_settings',
		'autoresponder',
		'forwarder',
		'certificate',
		'antispam',
		'languages',
		'spellchecker_languages',
		'restrictions',
		'signature',
		'aliases',
		'read_confirmation',
		'documents',
		'gw_mygroup',
		'sip',
		'call_forwarding',
		'default_folders',
		'weather',
		'licenses',
		'teamchat_notify',
		'layout_settings'
	];

	if (sPrimaryAccountGW>0)
		this.resources.push('holidays');

	if (sPrimaryAccountIM>0)
		this.resources.push('im');

	WMStorage.get({'resources': this.resources},'storage','',[this,'__loadItems',[sTab1,sTab2]],true);

	this._curLanguage = GWOthers.getItem('LAYOUT_SETTINGS', 'language');

	//storeDataFromFormular
	this.x_btn_ok._onclick = function(){

		if (GWOthers.getItem('LAYOUT_SETTINGS', 'language') != me._curLanguage)
			gui.notifier._value({type: 'alert', args: {header: '', text: 'LANGUAGES::ONCHANGE_INFO'}});

		// Save items will be called if accounts could be saved sucessfully
		if (me.maintab && me.maintab.account_settings){
			var oAccountTab = me.maintab.account_settings;
			if (oAccountTab && oAccountTab._wasActivated && oAccountTab.maintab){
				me.__saveAccounts();
				return;
			}
		}

		if(me.__value) {
			return gui._create('confirm', 'frm_confirm', '', '', [function() {
				me.__saveItems();
			}], 'BACKUP::IMPORT_IN_PROGRESS', 'BACKUP::IMPORT_IN_PROGRESS_HELPER');
		}

		// Not changes to accounts, just save other settings
		me.__saveItems();
	};

	this.__helper = new FrmSettingsHelper(false, false);
};

_me.__loadItems = function(aData, sTab1, sTab2)
{
	var me = this;

	//Save original data
	this.__oldData =  dataSet.get('storage','',true);

	// Get account information for account settings
	this.__state = {};
	this.__otherAccounts = {};
	var aAccounts = dataSet.get('accounts');
	for (var i in aAccounts){
		var acc = clone(aAccounts[i]);
		this.__state[i] = 'old';
		if (acc['PRIMARY'])
			this.__primaryAccount = acc;
		else
		if (acc.TYPE != 'rss')
			this.__otherAccounts[i] = acc;
	}

	// Get values for template

	var drw_arr = {
		'settings': true,
		'chat_access': sPrimaryAccountCHAT > 0,
		'im_access': sPrimaryAccountIM > 0 && (GWOthers.getItem('RESTRICTIONS', 'disable_im') || 0) < 1,
		'sip_access': sPrimaryAccountSIP > 0 && (GWOthers.getItem('RESTRICTIONS', 'disable_sip') || 0) < 1,
		'allow_call_forwarding': sPrimaryAccountSIP > 0 && (GWOthers.getItem('RESTRICTIONS', 'disable_call_forwarding') || 0) < 1,
		'esip_access': sPrimaryAccountSIP > 0 && (GWOthers.getItem('RESTRICTIONS', 'disable_esip') || 0) < 1,
		'gw_access': sPrimaryAccountGW > 0,
		'rules': sPrimaryAccountRULES > 0 && (GWOthers.getItem('RESTRICTIONS', 'disable_rules') || 0) < 1,
		'disable_personalities': GWOthers.getItem('RESTRICTIONS', 'disable_personalities') > 0,
		'disable_forwarder': GWOthers.getItem('RESTRICTIONS', 'disable_forwarder') > 0,
		'disable_new_aliases': (GWOthers.getItem('RESTRICTIONS', 'disable_new_aliases') || 0) < 1,
		'disable_keep_emails': GWOthers.getItem('RESTRICTIONS', 'disable_keep_emails') > 0,
		'disable_autoresponder': GWOthers.getItem('RESTRICTIONS', 'disable_autoresponder') > 0,
		'disable_antispam': GWOthers.getItem('RESTRICTIONS', 'disable_antispam') > 0,
		'allow_delay_send': sPrimaryAccountSMTP == 1,
		'disable_licenses': GWOthers.getItem('RESTRICTIONS', 'disable_licenses') > 0,
		'disable_doc_editing': GWOthers.getItem('RESTRICTIONS', 'disable_doc_editing') > 0,
		'disable_smart': GWOthers.getItem('RESTRICTIONS', 'disable_smart') > 0,
		'disable_autorevision': GWOthers.getItem('RESTRICTIONS', 'disable_autorevision') > 0,
		'disable_languages': (GWOthers.getItem('RESTRICTIONS', 'disable_languages') || 0) < 1,
		'disable_export': GWOthers.getItem('RESTRICTIONS', 'disable_export') > 0,
		'disable_accountedit': GWOthers.getItem('RESTRICTIONS', 'disable_accountedit') > 0,
		'account': sPrimaryAccount,
		'enable_quota': this.__primaryAccount.MBOX_QUOTA > 0,
		'enable_smsquota': this.__primaryAccount.SMS_LIMIT > 0,
		'disable_troubleshooting': dataSet.get('main', ['sid']).indexOf('wmtr') === 0,
		'disable_otheraccounts': GWOthers.getItem('RESTRICTIONS', 'disable_otheraccounts') == 1,
		'disable_private_certs': GWOthers.getItem('RESTRICTIONS', 'DISABLE_PRIVATE_CERTIFICATES') == 1,
		'disable_weather': GWOthers.getItem('RESTRICTIONS', 'DISABLE_WEATHER_SETTING') == 1,
		'disable_changepass': GWOthers.getItem('RESTRICTIONS', 'disable_changepass') == 1,
		'enable_2f': sPrimaryAccount2F,
		'replyto': GWOthers.getItemAccess('MAIL_SETTINGS_DEFAULT', 'reply_to_address'),
		'altmail': (GWOthers.getItem('RESTRICTIONS', 'hide_altmail') || 0) < 1
	};

	var gw_types = GWOthers.getItem('RESTRICTIONS', 'disable_gw_types') || '',
		regex = /[cejntf]{6}/g;

	if (sPrimaryAccountGW>0 && gw_types && regex.test(gw_types))
    	drw_arr.gw_access = false;
	drw_arr.digest_allowed = (GWOthers.getItem('GLOBAL_SETTINGS', 'teamchat_notify') || 0) > 0;

	if (drw_arr.gw_access){
		drw_arr.gw_c = (gw_types.indexOf('c')<0);
		drw_arr.gw_e = (gw_types.indexOf('e')<0);
		drw_arr.gw_j = (gw_types.indexOf('j')<0);
		drw_arr.gw_n = (gw_types.indexOf('n')<0);
		drw_arr.gw_t = (gw_types.indexOf('t')<0);
		drw_arr.gw_f = (gw_types.indexOf('f')<0);
	}


	if (sPrimaryAccountGUEST){
		drw_arr.guest = true;
		this._draw('frm_settings_guest','main',drw_arr);

		var aData = me._others.get('CHAT','storage');
		if (typeof aData == 'object')
			loadDataIntoFormOnAccess(this, aData);

		var aData = me._others.get('TEAMCHAT_NOTIFY','storage');
		if (typeof aData === 'object')
			loadDataIntoFormOnAccess(this,aData);

		if (this.x_password)
			this.x_password._onclick = function(){
				gui._create('changepass','frm_changepass');
			};

		return;
	}

	this._draw('frm_settings','main',drw_arr);

	if(!this.maintab) {
		return;
	}

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
				var aData = me._others.get('MAIL_SETTINGS_GENERAL','storage');

				this.show_inline_images._onchange = function(){
					if (aData && aData.ACCESS.show_images != 'view')
						oTab.general.show_images._disabled(!this._checked());
				};

				//flag colors
				this.default_flag._fillLang({
					'1':["COLOR_LABELS::RED_FLAG",'','ico bg_red'],
					'2':["COLOR_LABELS::BLUE_FLAG",'','ico bg_blue'],
					'3':["COLOR_LABELS::GREEN_FLAG",'','ico bg_green'],
					'5':["COLOR_LABELS::ORANGE_FLAG",'','ico bg_orange'],
					'8':["COLOR_LABELS::PURPLE_FLAG",'','ico bg_purple'],
					'A':["COLOR_LABELS::YELLOW_FLAG",'','ico bg_yellow']
				});

				if (typeof aData == 'object')
					loadDataIntoFormOnAccess(this,aData);
				this.autoclear_trash_days._range(0, 255);
				this.autoclear_spam_days._range(0, 255);
			}
		};

		// TAB2 - DEFAULT
		oTab.mail_default._onactive = function (bFirstTime) {

			//Alias
			if (this.from){
				var aData = {},
					aAlias = dataSet.get('storage',['ALIASES','ITEMS']);

				aData[''] = getPrimaryAccountFromAddress(true);

				for(var i in aAlias)
			        if (aAlias[i].VALUES.EMAIL && aAlias[i].VALUES.EMAIL.VALUE && aAlias[i].VALUES.EMAIL.VALUE.toLowerCase() != sPrimaryAccount && aAlias[i].VALUES.ENABLED && aAlias[i].VALUES.ENABLED.VALUE == '1'){
						aData[MailAddress.createEmail(aAlias[i].VALUES.NAME?aAlias[i].VALUES.NAME.VALUE:'', aAlias[i].VALUES.EMAIL.VALUE)] = MailAddress.createEmail(aAlias[i].VALUES.NAME?aAlias[i].VALUES.NAME.VALUE:'', aAlias[i].VALUES.EMAIL.VALUE, true);
					}

	            this.from._fill(aData);
			}


			if (Cookie.get(['suggest_address']))
			 	this.x_btn_rcptcache._disabled(false);

			if (bFirstTime) {
				// Disable/enable options related to html email
				this.html_message._onchange = function() {
					me.__helper.htmlMessageFormatChange(
						this._parent,
						'0' === this._value()
					);
				};

				this.x_btn_rcptcache._onclick = function(){
					var me = this;
					gui._create('cache','frm_confirm','','frm_alert',[function(){
						Cookie.set(['suggest_address']);
						me._disabled(true);
					}],
					'SETTINGS::RCPT_CACHE',
					'CONFIRMATION::CLEAR_AUTOSUGGEST');
				};


				//spellchecker default lang
				var aLang = dataSet.get('storage',['SPELLCHECKER_LANGUAGES','ITEMS']),
					aTmp = [],
					aData = {};

				for (var i in aLang)
					if (aLang[i].VALUES && aLang[i].VALUES.PATH && aLang[i].VALUES.NAME)
						aTmp.push([aLang[i].VALUES.PATH.VALUE, aLang[i].VALUES.NAME.VALUE]);

				//Sort
				if (aTmp.length){
					var aTmp = aTmp.sort(function(a,b){
						if (a[1]<b[1])
							return 1;
						else
						if (a[1]>b[1])
							return -1;
						else
							return 0;
					});

					for (var i = aTmp.length-1;i>=0;i--)
						aData[aTmp[i][0]] = aTmp[i][1];

					aTmp = null;
				}

				this.spellchecker._fill(aData);

				//Font-family
				aLang = dataSet.get('storage',['FONTS','ITEMS']);
				aData = {'0':getLang('SETTINGS::DEFAULT')};
			    for(var i in aLang)
					if (aLang[i].VALUES.FAMILY.VALUE)
						aData[aLang[i].VALUES.FAMILY.VALUE] = aLang[i].VALUES.NAME.VALUE;
				this.font_family._fill(aData);

				var aData = me._others.get('MAIL_SETTINGS_DEFAULT','storage');
				if (typeof aData == 'object')
					loadDataIntoFormOnAccess(this,aData);

				if (!this.font_family._value())
                	this.font_family._value('0');

				//default value for FROM
				if (this.from && !this.from._value())
					this.from._value('');
			}
		};

		// TAB4 - AUTORESPONDER
		if (oTab.autoresponder)
			oTab.autoresponder._onactive = function (bFirstTime) {
				if (bFirstTime) {
					var aResponder = me._others.get('AUTORESPONDER','storage');
					var from = aResponder['VALUES']['u_respondbetweenfrom'].split('/');
					aResponder['VALUES']['u_respondbetweenfrom'] = new IcewarpDate([from[0],from[1]-1, from[2]]).format(IcewarpDate.JULIAN);
					var to = aResponder['VALUES']['u_respondbetweento'].split('/');
					aResponder['VALUES']['u_respondbetweento'] = new IcewarpDate([to[0],to[1]-1, to[2]]).format(IcewarpDate.JULIAN);
					this.autoresponder._value(aResponder);
				}
			};

		// TAB5 - FORWARDER
		if (oTab.forwarder)
			oTab.forwarder._onactive = function (bFirstTime) {
				if (bFirstTime) {
				// init
					var oForwarder = this;

					this.u_forwardolder._onchange = function() {
						oForwarder.u_forwardolderdays._disabled(!this._value());
						oForwarder.u_forwardolderto._disabled(!this._value());
					};

					if (oForwarder.u_null)
						this.u_forwardto._onkeyup = function(){
							if (this._value()==''){
								oForwarder.u_null._disabled(1);
								oForwarder.u_null._value(0);
							}
							else
								oForwarder.u_null._disabled(0);
						};

					// load values
					var aForwarder = me._others.get('FORWARDER','storage');
					if (typeof aForwarder == 'object')
						loadDataIntoFormOnAccess(this,aForwarder);

					//test null checkbox
					if (oForwarder.u_null)
						this.u_forwardto._onkeyup();

					this.u_forwardolder._onchange();
				}
			};

		// TAB6 - message rules management
		if (oTab.rules)
			oTab.rules._onactive = function (bFirstTime) {
				if (bFirstTime) {
					var rules = this;
					storage.library('obj_filter_line');
					this.__aFilterLine = new obj_filter_line;

					msiebox(this._getAnchor('msiebox'));

					this.__valuesOfLines = [];
					this.__labelsOfLines = [];

					this.__getLabel = function(aValues) {
						if (Is.Defined(aValues['TITLE']) && aValues['TITLE'][0]['VALUE'])
							return aValues['TITLE'][0]['VALUE'];
						else
							return this.__aFilterLine._getText(aValues);
					};

					this.__addLine = function(aValues) {

						var sLabel = this.__getLabel(aValues);

						if (sLabel) {
							var a = {title:sLabel};
							a.checked = (aValues.ACTIVE && aValues.ACTIVE[0].VALUE>0);

							if (aValues.ACCEPT && aValues.ACCEPT[0].VALUE>0)
								a.css = 'accept';
							else
							if (aValues.DELETE && aValues.DELETE[0].VALUE>0)
								a.css = 'delete';
							else
							if (aValues.MARKSPAM && aValues.MARKSPAM[0].VALUE>0)
								a.css = 'spam';
							else
							if (aValues.REJECT && aValues.REJECT[0].VALUE>0)
								a.css = 'reject';

							this.__labelsOfLines.push(a);
							this.__valuesOfLines.push(aValues);
						}
					};

					this.__refreshLines = function(){
						this.rules._fill(this.__labelsOfLines);
					};

					this.__unselectLine = function() {
						this.rules._value([]);

						this.x_delete._disabled(true);
						this.x_edit._disabled(true);
						this.x_up._disabled(true);
						this.x_down._disabled(true);
					};

					this.__selectLine = function() {
						if (this.rules._value().length){
							this.x_delete._disabled(false);
							this.x_edit._disabled(false);
							this.x_up._disabled(false);
							this.x_down._disabled(false);
						}
					};

					this.__addLineWithFill = function(aValues) {
						this.__addLine(aValues);
						this.__refreshLines();
						this.rules._value(this.__valuesOfLines.length-1);
					};

					this.__editLine = function(index) {
						gui._create('edit_rule', 'frm_rule', '','', this.__valuesOfLines[index], [this, '__editLineCallback']);
					};

					this.__editLineCallback = function(aValues) {

						var index;
						if ((index = this.__findLine(aValues)) < 0) return;

						var sLabel = this.__getLabel(aValues);

						if (sLabel) {

							var a = {title:sLabel};
							a.checked = (aValues.ACTIVE && aValues.ACTIVE[0].VALUE>0);

							if (aValues.ACCEPT && aValues.ACCEPT[0].VALUE>0)
								a.css = 'accept';
							else
							if (aValues.DELETE && aValues.DELETE[0].VALUE>0)
								a.css = 'delete';
							else
							if (aValues.MARKSPAM && aValues.MARKSPAM[0].VALUE>0)
								a.css = 'spam';
							else
							if (aValues.REJECT && aValues.REJECT[0].VALUE>0)
								a.css = 'reject';

							this.__labelsOfLines[index] = a;
							this.__refreshLines();
						}
						else
							this.__deleteLine(index);
					};

					this.__deleteLine = function(index) {
						for (var i = index; i < this.__valuesOfLines.length-1; i++) {
							this.__labelsOfLines[i] = this.__labelsOfLines[i+1];
							this.__valuesOfLines[i] = this.__valuesOfLines[i+1];
						}
						this.__labelsOfLines.pop();
						this.__valuesOfLines.pop();

						this.__refreshLines();
						this.__unselectLine();
					};



					this.__moveUpLine = function(index) {
						if (index <= 0) return;
						this.__swapLines(index,index-1);
						this.rules._value([index-1]);
					};

					this.__moveDownLine = function(index) {
						if (index < this.__valuesOfLines.length-1){
							this.__swapLines(index, index+1);
							this.rules._value([index+1]);
						}
					};

					this.__swapLines = function(i1, i2) {
						var tmpValue = this.__valuesOfLines[i1];
						this.__valuesOfLines[i1] = this.__valuesOfLines[i2];
						this.__valuesOfLines[i2] = tmpValue;

						var tmpLabel = this.__labelsOfLines[i1];
						this.__labelsOfLines[i1] = this.__labelsOfLines[i2];
						this.__labelsOfLines[i2] = tmpLabel;

						this.__refreshLines();
					};

					this.__findLine = function(aValues) {
						for (var i in this.__valuesOfLines) {
							if (this.__valuesOfLines[i] == aValues)
								return parseInt(i);
						}
						return -1;
					};

					this.__unselectLine();

					var rules = this;

					this.rules._onclick = function() {
						if (count(this._value()) == 1)
							rules.__selectLine();
						else
							rules.__unselectLine();
					};

					this.rules._ondblclick = function() {
						var index = parseInt((this._value()[0]));
						if (index != NaN) rules.__editLine(index);
					};

					this.rules._oncheck = function(id,data){
					 rules.__valuesOfLines[id].ACTIVE = [{VALUE:data.checked?'1':'0'}];
					};

					this.x_add._onclick = function() {
						gui._create('edit_rule', 'frm_rule', '', '',{}, [rules, '__addLineWithFill']);
					};
					this.x_edit._onclick = function() {
						var index = parseInt((rules.rules._value()[0]));
						if (index != NaN) rules.__editLine(index);
					};
					this.x_delete._onclick = function() {
						var index = parseInt((rules.rules._value()[0]));
						if (index != NaN) rules.__deleteLine(index);
					};

					this.x_up._onclick = function() {
						var index = parseInt((rules.rules._value()[0]));
						if (index != NaN) rules.__moveUpLine(index);
					};
					this.x_down._onclick = function() {
						var index = parseInt((rules.rules._value()[0]));
						if (index != NaN) rules.__moveDownLine(index);
					};

					storage.library('wm_storage');
					storage.library('gw_others');

					this._aStorageFilters = GWOthers.get('FILTER_RULES', 'storage','',true);
					if (this._aStorageFilters){
						this._aXmlFilter = XMLTools.Str2Arr(this._aStorageFilters['VALUES']['u_rulescontentxml']);
						if (this._aXmlFilter['CONTENTFILTER'] && this._aXmlFilter['CONTENTFILTER'][0] && this._aXmlFilter['CONTENTFILTER'][0]['FILTER']){
							for (var i in this._aXmlFilter['CONTENTFILTER'][0]['FILTER']){
								var aFilter = this._aXmlFilter['CONTENTFILTER'][0]['FILTER'][i];
								this.__addLine(aFilter);
							}

							this.__refreshLines();
						}
					}
				}
			};

		// TAB7 - READ CONFIRMATION
		oTab.readconfirmation._onactive = function (bFirstTime) {
			if (bFirstTime) {

				msiebox(this._getAnchor('msiebox'));

				var aData = me._others.get('READ_CONFIRMATION','storage');
				if (typeof aData == 'object')
					loadDataIntoFormOnAccess(this,aData);
			}
		};

		//load main data
		var aAlias = dataSet.get('storage',['ALIASES','ITEMS']),
			aData  = dataSet.get('storage',['SIGNATURE','ITEMS']);

		//load & prepare groups
		var	aTmpGroups = dataSet.get('storage',['GROUPS','ITEMS']),
			aGroups = {};

		for(var i in aTmpGroups)
			if (aTmpGroups[i].VALUES.SENTFOLDER && aTmpGroups[i].VALUES.SENTFOLDER.VALUE)
				aGroups[aTmpGroups[i].VALUES.GROUP.VALUE] = sPrimaryAccount + '/' + aTmpGroups[i].VALUES.SENTFOLDER.VALUE;

		// TAB8 - SIGNATURE
		oTab.signature._onactive = function (bFirstTime) {
			if (bFirstTime) {
				msiebox(this._getAnchor('msiebox'));

				if (this.x_ali_add)
					this.x_ali_add._onclick = function(){
						var frm = gui._create('personality','frm_ok_cancel');
						frm._size(350,300,true);
						frm._modal(true);
						frm._title('FORM_BUTTONS::ADD');
						frm._draw('frm_personality', 'main');

						frm.x_btn_ok._disabled(true);
						frm.x_btn_ok._onclick = function(){
							storage.library('wm_tools');
							var tools = new wm_tools();
							tools.personality({'name':frm.name._value(),'email':frm.email._value()},[{},function(){
								if (gui.notifier)
									gui.notifier._value(getLang('SIGNATURE::NOTIFY'));
							}]);

							frm._destruct();
						};
						frm.email._onerror = function(b){
							frm.x_btn_ok._disabled(b);
						};
					};

				// Signature Part
				if (Is.Array(aData) && aData.length){
					this.__signatures = {};
					for (var i = 0; aData.length>i;i++){
						this.__signatures[aData[i].VALUES.ID?aData[i].VALUES.ID.VALUE:0] = {
							'name':aData[i].VALUES.NAME?aData[i].VALUES.NAME.VALUE:getLang('SETTINGS::DEFAULT'),
							'text':aData[i].VALUES.TEXT?aData[i].VALUES.TEXT.VALUE:'',
							'access':aData[i].VALUES.TEXT?aData[i].VALUES.TEXT.ATTRIBUTES.ACCESS:'full'
						};
					}
				}
				else
					this.__signatures = {'0':{name:getLang('SETTINGS::DEFAULT'),text:''}};


				this.list.__multi = false;
				this.list._generate = function(){
					var aEditableList = {},
						aCompleteList = {};

					for (var i in this._parent.__signatures) {
						aCompleteList[i] = this._parent.__signatures[i].name;
						if (this._parent.__signatures[i].access=='full')
							aEditableList[i] = this._parent.__signatures[i].name;
					}

					this._fill(aCompleteList);

					// Return first editable signature
					for(var i in aEditableList)
						return i;

					return false;
				};

				this.list._onclick = function(){
					var v = this._value(), aSign, p = this._parent;

					//Store last active signature
					this.__save_text.call(p);

					if (v && (v = v[0]) && (aSign = p.__signatures[v])){

						this.__lastID = v;

						for(var i in aSign)
							if (p[i])
								p[i]._value(aSign[i]);

						p.text._readonly(aSign.access == 'view');
						p.x_rename._disabled(v=='0' || aSign.access == 'view');
						p.x_remove._disabled(v=='0' || aSign.access == 'view');
					}
					else{
						p.text._value('');
						p.text._readonly(true);

						p.x_rename._disabled(true);
						p.x_remove._disabled(true);
					}
				};

				//Store last active signature
				this.list.__save_text = function (){
					var id = this.list.__lastID;
					if (Is.Defined(id) && this.__signatures[id] && this.__signatures[id].access != 'view'){
						var s = this.text._value();
						this.__signatures[id].text = s.toLowerCase().indexOf('<img ')>-1 || s.removeTags().trim()?s:'';
					}
				};

				// Generate and print available signatures
				var firstLegalValue = this.list._generate();
				if(firstLegalValue) {
					this.list._value(firstLegalValue);
					this.list._onclick();
				}

				this.x_remove._onclick = function(){
					var v = this._parent.list._value();
					if (v && (v = v[0]) && this._parent.__signatures[v]){
						delete this._parent.__signatures[v];
						this._parent.list._generate();
						this._parent.list._value(0);
						this._parent.list._onclick();
					}
				};

				this.x_add._onclick = function(){
					var frm = gui._create('add','frm_ok_cancel');
					frm._modal(true);
					frm._resizable(false);
					frm._dockable(false);
					frm._size(350,153,true);
					frm._title('FORM_BUTTONS::ADD');
					frm._draw('frm_label_input','main',{LABEL:getLang('ATTENDEES::NAME')});

					frm.x_btn_ok._value('FORM_BUTTONS::ADD');
					frm.x_btn_ok._onclick = function(){
						var v = frm.input._value();
						if (v){
							for (var i in oTab.signature.__signatures)
								if (oTab.signature.__signatures[i].name == v){
									//Already Exists
									frm.input._setRange(0,v.length);
									return;
								}

							var id = getFreeKey(oTab.signature.__signatures);
							oTab.signature.__signatures[id] = {name:v,text:'',access:'full'};

							oTab.signature.list._generate();
							oTab.signature.list._value(id);
							oTab.signature.list._onclick();

							frm._destruct();
						}
						else
							frm.input._focus();
					};
					frm.input._onsubmit = function(){frm.x_btn_ok._onclick()};
					frm.input._focus();
				};

				this.x_rename._onclick = function(){
					var v = this._parent.list._value();
					if (v && (v = v[0]) && oTab.signature.__signatures[v]){

						var	frm = gui._create('add','frm_ok_cancel');
						frm._modal(true);
						frm._resizable(false);
						frm._dockable(false);
						frm._size(350,152,true);
						frm._title('FORM_BUTTONS::RENAME');
						frm._draw('frm_label_input','main',{LABEL:getLang('ATTENDEES::NAME')});

						frm.x_btn_ok._value('FORM_BUTTONS::RENAME');
						frm.x_btn_ok._onclick = function(){
							var s = frm.input._value();
							if (s){
								for (var i in oTab.signature.__signatures)
									if (oTab.signature.__signatures[i].name == s){
										//Already Exists
										frm.input._setRange(0,s.length);
										return;
									}

								oTab.signature.__signatures[v].name = s;
								oTab.signature.list._generate();

								frm._destruct();
							}
							else
								frm.input._focus();
						};

						frm.input._value(oTab.signature.__signatures[v].name);
						frm.input._onsubmit = function(){frm.x_btn_ok._onclick()};
						frm.input._focus();
					}
				};

			}
		};

		oTab.alias._onactive = function (bFirstTime) {

			// Prepare signatures
			if (oTab.signature.__signatures)
				this.__signatures = oTab.signature.__signatures;
			else
			if (Is.Array(aData) && aData.length){
				this.__signatures = {};
				for (var i = 0; aData.length>i;i++){
					this.__signatures[aData[i].VALUES.ID?aData[i].VALUES.ID.VALUE:0] = {
						'name':aData[i].VALUES.NAME?aData[i].VALUES.NAME.VALUE:getLang('SETTINGS::DEFAULT'),
						'text':aData[i].VALUES.TEXT?aData[i].VALUES.TEXT.VALUE:'',
						'access':aData[i].VALUES.TEXT?aData[i].VALUES.TEXT.ATTRIBUTES.ACCESS:'full'
					};
				}
			}
			else
				this.__signatures = {'0':{name:getLang('SETTINGS::DEFAULT'),text:''}};

			//Fill signatures
			var aCompleteList = {'*':getLang('SIGNATURE::NONE')};
			for (var i in this.__signatures)
				aCompleteList[i] = this.__signatures[i].name;

			this.sign1._fill(aCompleteList);
			this.sign2._fill(aCompleteList);

			//Controls
			if (bFirstTime) {

				msiebox(this._getAnchor('msiebox'));

				//SENT FOLDER
				this.sent._redraw = function(sFolder) {
					var sentData = {
						'*':getLang('COMMON::NO'),
						'#':getLang('SETTINGS::DEFAULT'),
						'+':getLang('SELECT_FOLDER::SELECT_FOLDER')
					};

					if (Is.String(sFolder) && !sentData[sFolder])
						sentData[sFolder] = Path.basename(sFolder);

					this._fill(sentData);
					this._value(Is.String(sFolder)?sFolder:'#');
				};

				this.sent._redraw();
				this.sent._onbeforechange = function(sOld, sNew){
					if (sNew === '+'){
						if (this.frm_select_folder && !this.frm_select_folder._destructed)
							this.frm_select_folder._focus();
						else{
							var aPath = Path.split(GWOthers.getItem('DEFAULT_FOLDERS','sent'));

							this.frm_select_folder = gui._create('frm_select_folder','frm_select_folder','','','POPUP_FOLDERS::SELECT_FOLDER',aPath[0], aPath[1],[function(aid, fid){ fid && this._redraw(aid+'/'+fid) }.bind(this)],false,true,'M','i',false);
							this.frm_select_folder._onclose = function(b){
								b && this._value(sOld !== '+'?sOld:'#');
								return true;
							}.bind(this);
						}
					}
				};

				//ADD
				if(GWOthers.getItem('RESTRICTIONS', 'disable_new_aliases')<1) {
					this.x_ali_add._disabled(GWOthers.getItem('RESTRICTIONS', 'disable_personalities')>0);
					this.x_ali_add._onclick = function(){
						var frm = gui._create('personality','frm_ok_cancel');
						frm._size(350,300,true);
						frm._modal(true);
						frm._title('ALIAS::ADD');
						frm._draw('frm_personality', 'main');

						frm.x_btn_ok._value('COMPOSE::SEND');
						frm.x_btn_ok._disabled(true);
						frm.x_btn_ok._onclick = function(){
							storage.library('wm_tools');
							var tools = new wm_tools();
							tools.personality({'name':frm.name._value(),'email':frm.email._value()},[function(){
								if (gui.notifier)
									gui.notifier._value({type: 'confirmation_sent'});
							}]);

							frm._destruct();
						};
						frm.email._onerror = function(b){
							frm.x_btn_ok._disabled(b);
						};
					};

					this.x_ali_delegated._disabled(GWOthers.getItem('RESTRICTIONS', 'disable_personalities')>0);
					this.x_ali_delegated._onclick = function(){
						gui._create('deligated', 'frm_select_account','main','',[
							function(sEmail){
								storage.library('wm_tools');
								var tools = new wm_tools();
								tools.personality({'isdelegate':1,'email':sEmail},[function(aData){

									if (!this || this._destructed || aData === false){
										//Error
										if (aData === false && gui.notifier)
											gui.notifier._value({type: 'alert', args: {header: '', text: 'ALIAS::DELEGATED_ERROR'}});

										return;
									}

									//console.warn('personality', arguments);

									//Remove old Alias
									for(var a, i = aAlias.length;i--;){
										a = aAlias[i];
										if (a.VALUES && a.VALUES.EMAIL.VALUE === sEmail){
											if (a.ATTRIBUTES.ACCESS){
												a.ATTRIBUTES.DONT_SEND = false;
												a.VALUE = '';
												delete a.VALUES;
											}
											else
												aAlias.splice(i,1);
										}
									}

									//Add new Delegate
									aAlias.push({
										ATTRIBUTES:{},
										VALUES:{
											EMAIL:{ATTRIBUTES:{}, VALUE:aData.EMAIL},
											NAME:{ATTRIBUTES:{}, VALUE:aData.NAME || ''},
											ENABLED:{ATTRIBUTES:{}, VALUE:'1'},
											ISDELEGATE:{ATTRIBUTES:{}, VALUE:'1'},
											DELETEABLE:{ATTRIBUTES:{}, VALUE:'1'}
										}
									});

									var cnt = this.list._fillAlias();
									this.list._value(cnt-1);

								}.bind(this)]);
							}.bind(this)
						]);
					}.bind(this);
				}

				//LIST
				this.list.__multi = false;
				(this.list._fillAlias = function(){
					var aList = [];
					for (var i in aAlias)
						if (aAlias[i].VALUES && aAlias[i].VALUES.EMAIL){
							if (aAlias[i].VALUES.EMAIL.VALUE.toLowerCase() == sPrimaryAccount)
								aList.unshift({title:aAlias[i].VALUES.EMAIL.VALUE, checked: true, disabled: true, arg:i});
							else
								aList.push({title:aAlias[i].VALUES.EMAIL.VALUE, checked:aAlias[i].VALUES.ENABLED.VALUE == '1', arg:i});
						}

					this._fill(aList);
					return aList.length;
				}.bind(this.list))();

				this.list._oncheck = function(id, data){
					if (data && !data.disabled){

						//AutoSave 1
						var a = aAlias[data.arg];
						if (a){
							a.ATTRIBUTES.DONT_SEND = false;
							a.VALUES.ENABLED = {VALUE:this._checked(id)?1:0,ATTRIBUTES:{ACCESS:'full'}};
						}

						this._parent.x_enable._disabled(data.checked);
						this._parent.x_disable._disabled(!data.checked);
					}
				};

				this.list._onchange = function(){
					var v = this._value();
					if (v.length){
						var data = this.__idTable[v[0]];

						this._parent.x_enable._disabled(data.checked);
						this._parent.x_disable._disabled(!data.checked);

						//fill form
						if (this.__lastID != data.arg && aAlias[data.arg]){

							var a = aAlias[data.arg].VALUES,
								p = this._parent, tmp,
								sEmail = a.EMAIL.VALUE.toLowerCase();

							p.fullname._disabled(sEmail == sPrimaryAccount || a.ISDELEGATE);
							p.fullname._value(a.NAME?a.NAME.VALUE:'', true);

							p.remove._disabled(sEmail == sPrimaryAccount || (!a.DELETEABLE || a.DELETEABLE.VALUE != '1'));

							tmp = a.SIGN1?a.SIGN1.VALUE:'0';
							p.sign1._value(p.sign1.__idTable[tmp]?tmp:'*',true);

							tmp = a.SIGN2?a.SIGN2.VALUE:'0';
							p.sign2._value(p.sign2.__idTable[tmp]?tmp:'*',true);

							if (sEmail == sPrimaryAccount || aGroups[sEmail]){
								p.sent._disabled(true);
								p.sent._redraw();
							}
							else{
								p.sent._disabled(false);
								p.sent._redraw(a.SENTFOLDER && a.SENTFOLDER.VALUE);
							}

							this.__lastID = data.arg;
						}
					}
				};

				this.remove._onclick = function(){
					var v = this._parent.list._value();
					if (v.length){

						var a, idt = this._parent.list.__idTable;

						if (idt[v[0]] && idt[v[0]].arg && (a = aAlias[idt[v[0]].arg])){

							//Remove from resource
							if (a.ATTRIBUTES.ACCESS){
								a.ATTRIBUTES.DONT_SEND = false;
								a.VALUE = '';
								delete a.VALUES;
							}
							else
								aAlias.splice(idt[v[0]].arg, 1);

							// //Remove from list
							// var pos = 0, b = false;
							// for (var id in idt){
							// 	if (b){
							// 		pos = id;
							// 		break;
							// 	}
							// 	else
							// 	if (id == v[0]){
							// 		delete idt[v[0]];
							// 		b = true;
							// 	}
							// 	else
							// 		pos = id;
							// }

							// this._parent.list._value(pos);
							// this._parent.list._fill(this._parent.list.__idTable);

							var cnt = this._parent.list._fillAlias();
							if (Is.Empty(this._parent.list._value()))
								this._parent.list._value(cnt-1);
						}
					}
				};

				this.fullname._onblur = this.sign1._onchange = this.sign2._onchange = function(){
					var v = this._parent.list._value();
					if (v.length){

						var a, data = this._parent.list.__idTable[v[0]];

						//AutoSave 2
						if (data && data.arg && (a = aAlias[data.arg])){
							a.ATTRIBUTES.DONT_SEND = false;
							a.VALUES.NAME = {VALUE:oTab.alias.fullname._value(),ATTRIBUTES:{ACCESS:'full'}};

							if (oTab.alias.sign1._value() == '0')
							    delete a.VALUES.SIGN1;
							else
								a.VALUES.SIGN1 = {VALUE:oTab.alias.sign1._value(),ATTRIBUTES:{ACCESS:'full'}};

							if (oTab.alias.sign2._value() == '0')
							    delete a.VALUES.SIGN2;
							else
								a.VALUES.SIGN2 = {VALUE:oTab.alias.sign2._value(),ATTRIBUTES:{ACCESS:'full'}};

							if (~['+', '#'].indexOf(oTab.alias.sent._value()))
							    delete a.VALUES.SENTFOLDER;
							else
								a.VALUES.SENTFOLDER = {VALUE:oTab.alias.sent._value(),ATTRIBUTES:{ACCESS:'full'}};
						}
					}
				};

				this.sent._onchange = function(){
					if (this._value() !== '#')
						this._parent.sign1._onchange();
				};

				//Control buttons
				this.x_disable._onclick = this.x_enable._onclick = function(){
					var v = this._parent.list._value();
					if (v && Is.Defined(v = v[0]))
						this._parent.list._checked(v, this._name == 'x_enable');
				};

				this.list._value(0);
			}
		};

		// force drawing first tab
		oTab.general._active(true);
	};

	// ********************************************
	// IM SETTINGS
	if (this.maintab.im_settings)
		this.maintab.im_settings._onactive = function (bFirstTime) {
			var oTab = this.maintab;
			if (bFirstTime){

				if (oTab.general)
					oTab.general._onactive = function (bFirstTime) {
		                if (bFirstTime){
							var aData = me._others.get('IM','storage');
							if (typeof aData == 'object')
								loadDataIntoFormOnAccess(this,aData);
						}
					};

				if (oTab.chat)
					oTab.chat._onactive = function (bFirstTime) {
		                if (bFirstTime){
							var aData = me._others.get('IM','storage');
							if (typeof aData == 'object')
								loadDataIntoFormOnAccess(this,aData);
						}
					};

				// force drawing first tab
				oTab.general._active(true);
			}
		};

	// ********************************************
	// TEAMCHAT SETTINGS
	if (this.maintab.teamchat_settings)
		this.maintab.teamchat_settings._onactive = function (bFirstTime) {
			var oTab = this.maintab;
			if (bFirstTime){

				oTab.general._onactive = function (bFirstTime) {
					if (bFirstTime){
						var aData = me._others.get('CHAT','storage');
						if (typeof aData === 'object')
							loadDataIntoFormOnAccess(this,aData);
					}
				};

				oTab.digest && (oTab.digest._onactive = function (bFirstTime) {
					if (bFirstTime){
						var aData = me._others.get('TEAMCHAT_NOTIFY','storage');
						if (typeof aData === 'object')
							loadDataIntoFormOnAccess(this,aData);
					}
				});

				// force drawing first tab
				oTab.general._active(true);
			}
		};

	// ********************************************
	// SIP SETTINGS
	if (this.maintab.sip_settings)
		this.maintab.sip_settings._onactive = function (bFirstTime) {
			var oTab = this.maintab;
			if (!bFirstTime){
				oTab.general._active(false);
				return;
			}

			oTab.general._onactive = function(bFirstTime) {
				if (bFirstTime){
					this.user._restrict([Is.Email]);

					this.x_java._fill({x:'SETTINGS::SIP_INTERNAL'});
					this.x_java._onchange = function (e){
						var elm = e.target || e.srcElement;
						if (elm.checked){
							var a = ['x_java','x_dial','x_dial_ext'];
							for(var i in a)
								if (a[i]!=this._name && this._parent[a[i]])
									this._parent[a[i]]._main.elements[0].checked = false;

							this._parent.dial._disabled(this._name != 'x_dial_ext');
							this._parent.external._disabled(this._name != 'x_java');
							this._parent['start']._disabled(this._name != 'x_java');

							if (this._name == 'x_java')
								this._parent.external._onchange();
							else{
								this._parent.user._disabled(true);
								this._parent.pass._disabled(true);
								this._parent.ext._disabled(true);
								this._parent.server._disabled(true);
							}
						}
					};

					this.x_dial._fill({x:'SETTINGS::SIP_DIAL_INTERNAL'});
					this.x_dial._onchange = this.x_java._onchange;

					if (this.external){
						this.x_dial_ext._fill({x:'SETTINGS::SIP_DIAL'});
						this.x_dial_ext._onchange = this.x_java._onchange;

						this.external._onchange = function(){
							var b = !this._value();
							this._parent.user._disabled(b);
							this._parent.pass._disabled(b);
							this._parent.ext._disabled(b);
							this._parent.server._disabled(b);
						};
					}

					var aData = me._others.get('SIP','storage');
					if (typeof aData == 'object')
						loadDataIntoFormOnAccess(this,aData);

					switch(aData.VALUES.mode){
					case 'integrate':
						this.x_java._value('x');
						break;
					case 'external':
						if (this.x_dial_ext){
							this.x_dial_ext._value('x');
							break;
						}
					default:
						this.x_dial._value('x');
					}

				}
			};

			if(oTab.forward)
				oTab.forward._onactive = function(bFirstTime) {
					if (bFirstTime){
						var aData = me._others.get('CALL_FORWARDING','storage');
						if (typeof aData == 'object')
							loadDataIntoFormOnAccess(this,aData);

						var fdelay = this.u_sip_calltransfertime,
							ftarget = this.u_sip_calltransfertarget,
							factive = this.u_sip_calltransferactive;

						// Disable form fields if forwarding is switched off
						factive._onchange = function() {
							var b = !this._value();
							ftarget._disabled(b);
							fdelay._disabled(b);
						};

						// Restrict input for time to seconds
						fdelay._restrict([this,function(){
							var v = parseInt(fdelay._value().trim());
							return fdelay._disabled() || !isNaN(v);
						}]);
						fdelay._onblur = function() {
							var v = this._value();
							if(v!="")
								this._value(parseInt(v.trim()) || 0);
						};

						// If call forwarding is on, enable fields
						if(factive._value()==1) {
							ftarget._disabled(false);
							fdelay._disabled(false);
						}
					}
				};

			// force drawing first tab
			oTab.general._active(true);

		};

	// ********************************************
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

				//Notifications
				this.notifications._disabled(!gui.notifier || gui.notifier._getPermissions() == 'unsupported' || gui.notifier._getPermissions() == 'denied');

				//LANGs
				if (this.language){
					var aLang = me._others.get('LANGUAGES','storage');
					var aData = {};
					for (var i in aLang['VALUES'])
						aData[i] = aLang['VALUES'][i];

					this.language._fill(aData);

					if (!aData[me._others.getItem('LAYOUT_SETTINGS','language')])
						 me._others.setItem('LAYOUT_SETTINGS','language',me._others.getDefaultValues('LAYOUT_SETTINGS').LANGUAGE);
				}

				//SKINs
				var aSkin = me._others.get('SKINS','storage'),
					aData = {};
				for (var i in aSkin['VALUES'])
					if (i != 'value')
						aData[i] = aSkin['VALUES'][i];

				this.skin._fill(aData);
				this.date_format._fill(CalendarFormatting.getFormats());

				if (!aData[me._others.getItem('LAYOUT_SETTINGS','skin')])
					me._others.setItem('LAYOUT_SETTINGS','skin',me._others.getDefaultValues('LAYOUT_SETTINGS').SKIN);

				//LOAD DATA
				aData = me._others.get('LAYOUT_SETTINGS','storage');

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
					loadDataIntoFormOnAccess(this,aData);

				oTab.layout.preview_delay._range(50, 1500);
			}
		};

		// TAB2 - FOLDER MAPPING
		oTab.folders._onactive = function (bFirstTime) {
			if (bFirstTime) {
				var aData = me._others.get('DEFAULT_FOLDERS','storage');
				if(!dataSet.get('storage', ['DEFAULT_FOLDERS', 'ITEMS', '0', 'VALUES', 'SMART']) || dataSet.get('storage', ['DEFAULT_FOLDERS', 'ITEMS', '0', 'VALUES', 'SMART', 'ATTRIBUTES', 'DEFAULT'])) {
					aData.VALUES.smart = aData.VALUES.files;
					aData.ACCESS.smart = aData.ACCESS.files;
				}

				// Address Book Select
				var	afill = {'__@@ADDRESSBOOK@@__':getLang('SETTINGS::DEFAULT')}; //ADDRESS_BOOK::ADDRESS_BOOK
				if (aData.VALUES.ab != '__@@ADDRESSBOOK@@__')
					afill[aData.VALUES.ab] = Path.split(aData.VALUES.ab)[1];
				afill['*'] = getLang('ATTENDEES::FOLDER');

				this.ab._fill(afill);
				this.ab._value(aData.VALUES.ab);

				this.ab._onchange = function(){
					if (this._value() == '*'){
						//back to default fallback
						this._value('__@@ADDRESSBOOK@@__');

						var aPath = Path.split(oTab.folders.contacts._value()),
							me = this;

						gui._create('frm_select_folder','frm_select_folder','','','POPUP_FOLDERS::SELECT_FOLDER',aPath[0], aPath[1],[function(sAccount, sFolder){

							var v, afill = {'__@@ADDRESSBOOK@@__':getLang('SETTINGS::DEFAULT')};

							if (sAccount +'/'+ sFolder == oTab.folders.contacts._value())
								v = '__@@ADDRESSBOOK@@__';
							else{
								afill[sAccount +'/'+ sFolder] = sFolder;
								v = sAccount +'/'+ sFolder;
							}

							afill['*'] = getLang('ATTENDEES::FOLDER');
							me._fill(afill);

							me._value(v);

						}],true,true,'C','',true);
					}
				};

				//Load form data
				if (typeof aData == 'object')
					loadDataIntoFormOnAccess(this,aData);

				this.trash._onchange = function(){

					var tmp = dataSet.get('folders',Path.split(this._value()));

					if (tmp.SPAM || tmp.PUBLIC || this._value()==sPrimaryAccount+'/INBOX' || this._value().indexOf(sPrimaryAccount+'/'+sPrimaryAccountSPREFIX)===0 || this._parent.sent._value() == this._value() || this._parent.drafts._value() == this._value()){
						gui._create('alert','frm_alert','','',[this.path._onclick],'','ALERTS::RESERVED_FOLDER',[Path.basename(this._value())]);
						this._value(aData.VALUES.trash);
					}
				};
				this.sent._onchange = function(){
					var tmp = dataSet.get('folders',Path.split(this._value()));

					if (tmp.SPAM || tmp.PUBLIC || this._value()==sPrimaryAccount+'/INBOX' || this._value().indexOf(sPrimaryAccount+'/'+sPrimaryAccountSPREFIX)===0 || this._parent.trash._value() == this._value() || this._parent.drafts._value() == this._value()){
						gui._create('alert','frm_alert','','',[this.path._onclick],'','ALERTS::RESERVED_FOLDER',[Path.basename(this._value())]);
						this._value(aData.VALUES.sent);
					}
				};
				this.drafts._onchange = function(){
					var tmp = dataSet.get('folders',Path.split(this._value()));

					if (tmp.SPAM || tmp.PUBLIC || this._value()==sPrimaryAccount+'/INBOX' || this._value().indexOf(sPrimaryAccount+'/'+sPrimaryAccountSPREFIX)===0 || this._parent.sent._value() == this._value() || this._parent.trash._value() == this._value()){
						gui._create('alert','frm_alert','','',[this.path._onclick],'','ALERTS::RESERVED_FOLDER',[Path.basename(this._value())]);
						this._value(aData.VALUES.drafts);
					}
				};
				this.files._onbeforechange = function(sOld,sNew){
					if (this._parent.smart)
						if (this._parent.smart._value() == sOld)
							this._parent.smart._value(sNew);
				};
				this.contacts._onbeforechange = function(sOld,sNew){
					if (this._parent.ab)
						if (this._parent.ab._value() == sNew)
							this._parent.ab._value('__@@ADDRESSBOOK@@__');
				};
			}
		};


		oTab.documents._onactive = function (bFirstTime) {
			if (bFirstTime) {

				// Revisions
				var aData = me._others.get('GW_MYGROUP','storage');
				if (this.x_ownautorevisionmode) {
					this.x_ownautorevisionmode._value(aData.VALUES.ownautorevisionmode<1?0:1);
					this.x_ownautorevisionmode._disabled(aData.ACCESS.ownautorevisionmode == 'full'?0:1);
				}

				// Preferred Document application
				var aData = me._others.get('DOCUMENTS','storage');

				//Autosave
				this.autosave._onclick = function() {
					this._parent.autosave_minutes._disabled(this._checked());
				};

				// Disable document editing
				this.disable_office._onclick = function() {
					this._parent.office_app._disabled(this._checked());
				};
				this.office_app._fill({
					webdoc: getLang('OFFICELAUNCHER::WEBDOC'),
					webdoc_read: getLang('OFFICELAUNCHER::WEBDOC_READ'),
					suite: getLang('OFFICELAUNCHER::SUITE')
				});

				// Load values
				if (typeof aData == 'object')
					loadDataIntoFormOnAccess(this,aData);

				this.autosave_minutes._disabled(!this.autosave._checked() || this.autosave_minutes._disabled());
				this.office_app._disabled(!this.disable_office._checked() || this.disable_office._disabled());
			}
		};

		// TAB4 - ANTISPAM
		if (oTab.antispam)
			oTab.antispam._onactive = function (bFirstTime) {
				if (bFirstTime) {
					var aData = me._others.get('ANTISPAM','storage');
					if (typeof aData == 'object')
						loadDataIntoFormOnAccess(this,aData);
				}
			};

		// force drawing first tab
		oTab.layout._active(true);
	};


	// ********************************************
	// CALENDARSETTINGS

	if (this.maintab.calendar_settings)
		this.maintab.calendar_settings._onactive = function (bFirstTime) {
			var oTab = this.maintab,
				forcedWeekBeginsOn = false;
			if (!bFirstTime){
				oTab.main._active(false);
				return;
			}
			oTab.main.week_begins._disabled(oTab.main.begin_on_today._value());
			oTab.main.begin_on_today._onchange = function () {
				oTab.main.week_begins._disabled(forcedWeekBeginsOn || oTab.main.begin_on_today._value());
			};

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
						if (parseInt(this._value()) > parseInt(oTab.main.day_ends._value()))
							oTab.main.day_ends._value(this._value());
					};

					this.day_ends._onchange = function (){
						if (parseInt(oTab.main.day_begins._value()) > parseInt(this._value()))
							oTab.main.day_begins._value(this._value());
					};

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
						if(end._value() == undefined)
							end._value(begin < 0 ? -1 : ((begin += 4) > 7 ? begin - 7 : begin));
						// Work week can't start and end on same day
						else if(begin==end._value())
							end._value(begin==7?1:begin+1);
					};
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
					};

					// load CALENDAR_SETTINGS
					var aData = me._others.get('CALENDAR_SETTINGS','storage');
					if (typeof aData == 'object') {
						loadDataIntoFormOnAccess(this,aData);
						if(!this.begin_on_today._disabled() && this.week_begins._disabled()) {
							forcedWeekBeginsOn = true;
						}
					}
				}
			};

			// TAB2 - DEFAULT SETTINGS
			if (oTab.default_settings)
				oTab.default_settings._onactive = function (bFirstTime) {
					if (bFirstTime) {
						var aData = me._others.get('DEFAULT_CALENDAR_SETTINGS','storage');
						if (typeof aData == 'object')
							loadDataIntoFormOnAccess(this,aData);
					}
				};

			// TAB3 - DEFAULT REMINDER
			if (oTab.reminder)
				oTab.reminder._onactive = function (bFirstTime) {
					if (bFirstTime) {

						this.event && (this.event._wasActivated = true);
						var aData = me._others.get('EVENT_SETTINGS','storage');
						if (typeof aData == 'object')
							loadDataIntoFormOnAccess(this.event,aData);

						this.gw && (this.gw._wasActivated = true);
						var aData = me._others.get('GW_MYGROUP','storage');
						if (typeof aData == 'object')
							loadDataIntoFormOnAccess(this.gw,aData);
					}
				};

			// TAB5 - PUBLIC FOLDERS
			if (oTab.hollidays)
				oTab.hollidays._onactive = function (bFirstTime) {
					if (bFirstTime) {

						if (currentBrowser() == 'MSIE9')
							this._getAnchor('msiebox').onresize = function(e){
								if (this.offsetHeight != this.firstChild.offsetHeight)
									this.firstChild.style.height = this.offsetHeight + 'px';
							};

						storage.library('gw_holidays');
						if (!me._holidays){
							me._holidays = new gw_holidays;
							me._holidaysUId = [];
						}

						var aHolidays = me._holidays.get('storage');

						if (typeof aHolidays == 'object')
						{
							me._holidaysUId = [];
							var aHolidayTitles = [];
							var aHolidayValues = [];

							for(var n in aHolidays)
							{
								me._holidaysUId.push(aHolidays[n]['UID']);
								aHolidayTitles.push(aHolidays[n]['NAME']);

								if (aHolidays[n]['SUBSCRIBED'] == 'true')
									aHolidayValues.push(n);
							}
							this.holidays_list._fill(aHolidayTitles);
							this.holidays_list._value(aHolidayValues);
						}
					}
				};

			if (oTab.weather)
				oTab.weather._onactive = function (bFirstTime) {
					if (bFirstTime) {

						if (currentBrowser() == 'MSIE9')
							this._getAnchor('msiebox').onresize = function(e){
								if (this.offsetHeight != this.firstChild.offsetHeight)
									this.firstChild.style.height = this.offsetHeight + 'px';
							};

						// load data (temperature)
						var aData = me._others.get('CALENDAR_SETTINGS','storage');
						if (typeof aData == 'object')
							loadDataIntoFormOnAccess(this,aData);
						oTab.main && (oTab.main._wasActivated = true);

						if (!me._holidays){
							storage.library('gw_holidays');
							me._holidays = new gw_holidays;
						}

						var aCities = me._holidays.get('storage','WEATHER'),
							aTmp = {},
							found = {};

						for(var i in aCities)
							if (aCities[i].SUBSCRIBED == 'true')
								aTmp[aCities[i].UID] = aCities[i].NAME || aCities[i].UID;

						this.x_cities._fill(aTmp);

						this.__showCities = function (aData){
							var city = oTab.weather.x_city, n=0;

							found = {};
							if (aData)
								for(var i in aData) {
									found[i] = aData[i].city;
									n++;
								}

							city._disabled(false);
							city._fill(found);
							if(n) {
								city._value('');
								city._show();
							}

							oTab.weather.x_find._disabled(false);
						};

						this.x_city._onclick = function() {
							if(this._value())
								this._select();
						};

						this.x_city._onchange = function(e) {
							var v = this._value();
							if(v) {
								for(var i in found)
									if(v == found[i]) {
										aTmp[i] = found[i];
										break;
									}
								this._parent.x_cities._fill(aTmp);
							}

						};

						this.x_find._onclick = function(e) {
							this._disabled(true);
							this._parent.x_city._disabled(true);
							if (!me._tools){
								storage.library('wm_tools');
								me._tools = new wm_tools;
							}
							this._parent.x_city._clean();
							me._tools.weather([this._parent.x_city._value()],[this._parent,'__showCities']);

						};
						this.x_city._onsubmit = function(){
							this._parent.x_find._onclick();
						};

						this.x_remove._onclick = function(){
							delete aTmp[this._parent.x_cities._value()];
							this._parent.x_cities._fill(aTmp);
						};
					}
				};

			// force drawing first tab
			oTab.main._active(true);
		};

	// ********************************************
	// ACCOUNTSETTINGS

	this.maintab.account_settings._onactive = function (bFirstTime) {
		var oTab = this.maintab;

		if (bFirstTime){

			var quotaupdate = function(aData){
				if (aData && aData[sPrimaryAccount])
					me.__primaryAccount = aData[sPrimaryAccount];

				if (me.__primaryAccount.MBOX_QUOTA>0 && me.__primaryAccount.MBOX_USAGE){
					oTab.primary.progress._range(me.__primaryAccount.MBOX_QUOTA);
					oTab.primary.progress._value(me.__primaryAccount.MBOX_USAGE);

					var v = 0;
					if (me.__primaryAccount.MBOX_QUOTA>0)
						v = roundTo(me.__primaryAccount.MBOX_USAGE / me.__primaryAccount.MBOX_QUOTA * 100, 1);

					oTab.primary.progress._title(v + '% (' + roundTo(me.__primaryAccount.MBOX_USAGE / 1024, 1) + ' ' + getLang('UNITS::MB') + ' / ' + roundTo(me.__primaryAccount.MBOX_QUOTA / 1024, 1) + ' ' + getLang('UNITS::MB') + ')');
				}

				if (me.__primaryAccount.SMS_LIMIT>0 && me.__primaryAccount.SMS_SENT){
					oTab.primary.progress2._range(me.__primaryAccount.SMS_LIMIT);
					oTab.primary.progress2._value(me.__primaryAccount.SMS_SENT);

					var v = 0;
					if (me.__primaryAccount.SMS_LIMIT>0)
						v = Math.ceil(me.__primaryAccount.SMS_SENT/(me.__primaryAccount.SMS_LIMIT/100));

					oTab.primary.progress2._title(v +'% ('+ me.__primaryAccount.SMS_SENT +' / '+ me.__primaryAccount.SMS_LIMIT + ')');
				}
			};

			// TAB1 - Primary account settings
			oTab.primary._onactive = function (bFirstTime) {

				if (bFirstTime) {
					// Add primary account data to form
					// this.description._value(me.__primaryAccount['DESCRIPTION']);
					this.fullname._value(me.__primaryAccount['FULLNAME']);

					if (this.alternative)
						this.alternative._value(me.__primaryAccount['ALTERNATIVE']);

					if (me.__primaryAccount['LAST_TIME'])
						this.x_last_time._value(IcewarpDate.unix(me.__primaryAccount['LAST_TIME']).format('L LT'));
					this.x_last_ip._value(me.__primaryAccount['LAST_IP']);

					if (this.progress || this.progress2)
						WMAccounts.list({aid:sPrimaryAccount},'','','',[quotaupdate]);

					this.x_password && (this.x_password._onclick = function(){
						gui._create('changepass','frm_changepass');
					});

					if (sPrimaryAccount2F>0){
						this.x_2f._onclick = function(){
							gui._create('verify','frm_verify');
						};

						if (sPrimaryAccount2FE){
							this.x_2fl._value(getLang('COMMON::ACTIVATED'));
							addcss(this.x_2fl._main, 'active');
						}
						else
							this.x_2fl._value(getLang('COMMON::DEACTIVATED'));
					}
				}
			};

			// TAB2 - Other accounts
			if (oTab.other)
				oTab.other._onactive = function (bFirstTime) {
					if (bFirstTime) {
						msiebox(this._getAnchor('msiebox'));

						var out = {},
							dg = this.groups;

						//DataGrid
						dg.__sortColumn = 'GROUP';
						dg.__sortType = 0;
						dg._addColumns({
							'ACCOUNT':{title:'SETTINGS::ACCOUNT','width':100,mode:'%','arg':{'sort':'asc'},encode:true},
							'PROTOCOL':{title:'FORM_ACCOUNTS::PROTOCOL','width':80},
							'FOLDER':{title:'SETTINGS::SENT_FOLDER','width':110,'arg':{'sort':'asc'},encode:true},
							'TRASH':{title:'SETTINGS::TRASH_FOLDER','width':110,'arg':{'sort':'asc'},encode:true}
						});

						dg.__data_handler = function(){
							for (var i in me.__otherAccounts)
								out[i] = {
									data:{
										ACCOUNT:i,
										PROTOCOL:me.__otherAccounts[i].PROTOCOL,
										FOLDER:me.__otherAccounts[i].SENTFOLDER?Path.split(me.__otherAccounts[i].SENTFOLDER)[1] : getLang('SETTINGS::DEFAULT'),
										TRASH:me.__otherAccounts[i].TRASHFOLDER?Path.split(me.__otherAccounts[i].TRASHFOLDER)[1] : getLang('SETTINGS::DEFAULT')
									},
									arg:{
										account:i,
										folder:me.__otherAccounts[i].SENTFOLDER || '',
										trash:me.__otherAccounts[i].TRASHFOLDER || ''
									}
								};

							dg._fill(out);
						};
						dg.__data_handler();

						dg._ondblclick = function(e,elm,arg,id,col,aClickType){
							if (arg)
								oTab.other.x_edit._onclick();
						};


						//Buttons
						this.x_add._onclick = function(e){

							gui._create('edit_dialog', 'frm_account', '','', [me, function(aValues){
								var sAccountID = aValues['EMAIL'];
								if (!sAccountID)
									return;

								//remove sent folder when the same with default one
								if (aValues.SENTFOLDER == GWOthers.getItem('DEFAULT_FOLDERS','sent'))
									delete aValues.SENTFOLDER;
								//remove trash folder when the same with default one
								if (aValues.TRASHFOLDER == GWOthers.getItem('DEFAULT_FOLDERS','trash'))
									delete aValues.TRASHFOLDER;

								me.__otherAccounts[sAccountID] = aValues;

								if (me.__state[sAccountID] && me.__state[sAccountID] != 'new')
									me.__state[sAccountID] = 'edited';
								else
									me.__state[sAccountID] = 'new';

								dg.__data_handler();
							}]);

						};

						this.x_edit._onclick = function(){
							var v = dg._value();
							for (var i in v)
								if (dg._aData[v[i]]){

									gui._create('edit_dialog', 'frm_account', '','', [me, function(aValues, sAccountID){
										if (sAccountID) {
											for (var i in aValues){
												if (i == 'PASSWORD' && aValues[i] == '')
													continue;

												//remove sent folder when the same with default one
												if (aValues[i].SENTFOLDER == GWOthers.getItem('DEFAULT_FOLDERS','sent'))
													delete aValues[i].SENTFOLDER;
												//remove trash folder when the same with default one
												if (aValues[i].TRASHFOLDER == GWOthers.getItem('DEFAULT_FOLDERS','trash'))
													delete aValues[i].TRASHFOLDER;

												me.__otherAccounts[sAccountID][i] = aValues[i];
											}

											if (me.__state[sAccountID] != 'new')
												me.__state[sAccountID] = 'edited';

											dg.__data_handler();
										}
									}], v[i], me.__otherAccounts[v[i]]);

									break;
								}
						};

						this.x_remove._onclick = function(){
							var v = dg._value();

							for (var i = v.length-1; i>=0; i--){
								me.__state[v[i]] = 'deleted';
								delete dg._aData[v[i]];
							}

							dg._fill();
						};

					}

				};

			// TAB3 - CERTIFICATE
			oTab.certificate && (oTab.certificate._onactive = function (bFirstTime) {
				if (bFirstTime) {
					var aData = dataSet.get('storage',['CERTIFICATE','ITEMS']),
						tmp,aCerts = [];

					for(var i in aData)
						if (aData[i].VALUES && aData[i].VALUES.INFO && aData[i].VALUES.INFO.VALUE){
							tmp = XMLTools.Str2Arr(aData[i].VALUES.INFO.VALUE).INFO[0];

							aCerts.push({
								'id':aData[i].ATTRIBUTES.UID,
								'name':tmp.SUBJECT[0].CN?tmp.SUBJECT[0].CN[0].VALUE:'',
								'class':'attachment',
								'email':tmp.SUBJECT[0].EMAILADDRESS?tmp.SUBJECT[0].EMAILADDRESS[0].VALUE:'',
								'expires':tmp.VALIDTO[0].VALUE,
								'data':tmp
							});
						}

					this.X_CERT._value({'values':aCerts});

					// Add DropZone
					this.X_CERT.file._dropzone(this._main);
				}
			});

			// force drawing first tab
			oTab.primary._active(true);
		}
	};


	// ********************************************
	// LICENCYSETTINGS

	if (this.maintab.licenses)
		this.maintab.licenses._onactive = function (bFirstTime) {
			if (bFirstTime){
				var stmp = GWOthers.getItem('LICENSES','desktop');
				this.maintab.desktop.X_KEY._value(stmp || getLang('LICENSE::NOKEY'));
				if (stmp)
					this.maintab.desktop.X_KEY._onclick = function(){
						this._setRange(0,this._value().length);
					};
				else
					this.maintab.desktop.X_KEY._disabled(true);

				stmp = GWOthers.getItem('LICENSES','outlook');
				this.maintab.outlook.X_KEY._value(stmp || getLang('LICENSE::NOKEY'));
				if (stmp)
					this.maintab.outlook.X_KEY._onclick = function(){
						this._setRange(0,this._value().length);
					};
				else
					this.maintab.outlook.X_KEY._disabled(true);
			}
		};

	// ********************************************
	// BACKUPSETTINGS

	this.maintab.backup._onactive = function (bFirstTime) {
		var oTab = this.maintab;
		if (!bFirstTime){
			oTab.contact._active(false);
			return;
		}

		var oImport = new wm_import();
		var progressCount = 0;
		function monitorProgress() {
			oImport.import_progress([me,function(result){
				// Clear interval if complete
				if(result.complete) {
					if (oTab.contact.progress2 && !oTab.contact.progress2._destructed)
						oTab.contact.progress2._destruct();
					return;
				}
				// Show progress in loader title
				if(oTab.contact.progress2 && result.progress && result.total) {
					var percent = parseInt(100*result.progress/result.total);
					oTab.contact.progress2._value(getLang('BACKUP::PROCESSING')+' - '+percent+' %');
					oTab.contact.progress2.bar._value(percent);
				}
				// Create new timeout to show progress again (every second first 10 sec, every 2nd sec until half minute, every 5 sec rest of minute, etc)
				me.__import_progress_timeout = setTimeout(monitorProgress, progressCount++>10?(progressCount>20?(progressCount>38?(progressCount>50?30000:15000):5000):2000):1000);
			}]);
		}

		//Import Contacts
		oTab.contact.folders._value(sPrimaryAccount+'/'+Mapping.getDefaultFolderForGWType('C'));

		// Check if there is ongoing import - started before options window was opened
		oImport.import_progress([me,function(result){
			// If import is ongoing, display progress until done
			if(!result.complete) {
				// Create progress
				oTab.contact._create('progress2','obj_loader','main');
				oTab.contact.progress2._value(getLang('BACKUP::PROCESSING'));
				oTab.contact.progress2._create('bar','obj_progress','main','neutral center');

				// Start interval for checking progress
				me.__import_progress_timeout = setTimeout(monitorProgress,1000);
			}
		}]);
		me._add_destructor('__import_destruct');

		// When primary upload starts show progress bar (user clicked Upload)
		oTab.contact.step3._onuploadstart = function() {
			me._create('progress','obj_loader','main');
			me.progress._value(getLang('BACKUP::PROCESSING'));
		};
		// Primary upload finished, let user decide folder and prepare for import
		oTab.contact.step3._onuploadend = function(arg){
			me.progress._destruct();

			if ((arg = arg[arg.length-1]) && arg.folder && arg.id){
				me.__value = arg;

				switch(arg.name.substr(arg.name.lastIndexOf('.')+1).toLowerCase()){
				case 'txt':
				case 'csv':
					me.__value.action = 'csv';
					break;
				case 'ldif':
					me.__value.action = 'ldif';
					break;
				case 'vcf':
					me.__value.action = 'vcard';
					break;
				case 'vcs':
				case 'ics':
					me.__value.action = 'vcalendar';
					break;

				default:
					gui.notifier._value({type: 'alert', args: {header: '', text: 'BACKUP::UNKNOWN_EXT'}});
					return;
				}

				if (me.__value.action == 'vcalendar'){
					oTab.contact.folders._setType(['E','T','N','J']);
					oTab.contact.folders._value(sPrimaryAccount+'/'+Mapping.getDefaultFolderForGWType('E'));
				}
				else{
					oTab.contact.folders._setType('C');
					oTab.contact.folders._value(sPrimaryAccount+'/'+Mapping.getDefaultFolderForGWType('C'));
				}

				// After click on Load button, get preliminary data for preview and show options
				oTab.contact['import']._onclick = function (){
					this._disabled(true);

					// Prepare request
					var aFolder = Path.split(oTab.contact.folders._value()),
						elm = document.getElementById(this._parent._pathName+'#csv');

					// Send synconously (only small preview)
					var result = oImport.import_data({'action':me.__value.action,'account':sPrimaryAccount,'folder':aFolder[1],'lines':(me.__value.action=='csv'?5:0),'path':(me.__value.folder +'/'+ me.__value.id)});

					// If datatype is csv, display import options (charset, labels)
					if (me.__value.action == 'csv' && Is.Array(result)){
						removecss(elm,'hidden');
						this._parent.step4._fill(result);
						this._parent.step5._disabled(false);

						var parent = this._parent;
						oTab.contact.step4z._onchange = function() { // Change of Charset, reload synchronously (5 line preview with new charset)
							result = oImport.import_data({'action':me.__value.action,'account':sPrimaryAccount,'folder':aFolder[1],'lines':(me.__value.action=='csv'?5:0),'charset':oTab.contact.step4z._value()=='*'?'':oTab.contact.step4z._value(),'path':(me.__value.folder +'/'+ me.__value.id)}),
							parent.step4._refill(result);
						};

					} else {
						// For other datatypes, display success or failure
						if(result) {
							gui.notifier._value({type: 'success', args: {header: 'BACKUP::IMPORT_SUCCESSFUL'}});
						} else {
							gui.notifier._value({type: 'alert', args: {header: '', text: 'BACKUP::IMPORT_UNSUCCESSFUL'}});
						}

						addcss(elm,'hidden');
						oTab.contact.folders._disabled(true);
						me.__value = null;
					}


				};
				// Re-enable Load button and Folder choise
				oTab.contact.folders._disabled(false);
				oTab.contact['import']._disabled(false);
			}
			return true;
		};
		// Final import of already uploaded file (after user clicked Import)
		oTab.contact.step5._onclick = function(){

			if (me.__value.folder && me.__value.id){

				var aFolder = Path.split(oTab.contact.folders._value()),
					aData = this._parent.step4._value();

				if (!count(aData)){
					gui.notifier._value({type: 'alert', args: {header: '', text: 'BACKUP::SELECT_COL'}});
					return;
				}
				else
				if (!aData.LOCATIONS){
					gui.notifier._value({type: 'alert', args: {header: '', text: 'BACKUP::SELECT_EMAIL'}});
					return;
				}

				// No errors, create progress indicator
				oTab.contact._create('progress2','obj_loader','main');
				oTab.contact.progress2._value(getLang('BACKUP::PROCESSING'));
				oTab.contact.progress2._create('bar','obj_progress','main','neutral center');

				// Import csv data asynchronously
				var oImport = new wm_import();
				var that = this;
				oImport.import_data(
					{
						'action': 'csv',
						'values': aData,
						'folder': aFolder[1],
						'account': sPrimaryAccount,
						'skipfirst': !!that._parent.step4x._value(),
						'share': that._parent.step4y._value() == '*' ? '' : that._parent.step4y._value(),
						'format': that._parent.step4format._value() == '*' ? '' : that._parent.step4format._value(),
						'charset': that._parent.step4z._value() == '*' ? '' : that._parent.step4z._value(),
						'path': me.__value.folder + '/' + me.__value.id
					},
					[me,function(result){
						oTab.contact.progress2._destruct();

						if (me.__import_progress_timeout)
							clearTimeout(me.__import_progress_timeout);

						if (result){
							that._parent.step4._fill();
							me.__value = null;

							var elm = document.getElementById(that._parent._pathName+'#csv');
							addcss(elm,'hidden');

							if (result===true)
								gui.notifier._value({type: 'success', args: {header: '', text: 'BACKUP::IMPORT_SUCCESSFUL'}});
							else // A number of errors occured
								gui.notifier._value({type: 'alert', args: {header: '', text: 'BACKUP::IMPORT_FINISHED', args: [result]}});

							//AutoUpdate
							if (dataSet.get('active_folder') == sPrimaryAccount +'/'+ aFolder[1] && gui.frm_main)
								gui.frm_main._refreshItems(sPrimaryAccount);
						}
						else
							gui.notifier._value({type: 'alert', args: {header: '', text: 'BACKUP::IMPORT_UNSUCCESSFUL'}});
					}]);

				// Check progress on server every second
				me.__import_progress_timeout = setTimeout(monitorProgress,1000);
			}
		};

		//Export Contacts
		if (oTab.csv){
			oTab.csv.folders._value(sPrimaryAccount+'/'+Mapping.getDefaultFolderForGWType('C'));

			oTab.csv.separator._onchange = function(){
				oTab.csv.date_format._disabled(this._value() == 'vcard');
			};

			oTab.csv['export']._onclick = function(){
				if (this._parent.separator._value() == 'vcard')
					downloadItem(buildURL({
						'sid':dataSet.get('main',['sid']),
						'class':'exportvcard',
						'fullpath':oTab.csv.folders._value()
					}));
				else{
					var tmp = {
						'sid':dataSet.get('main',['sid']),
						'class':'exportcsv',
						'fullpath':oTab.csv.folders._value() +'/'+ this._parent.separator._value()
					};

					if (oTab.csv.date_format._value() != '*')
						tmp.format = oTab.csv.date_format._value();

					downloadItem(buildURL(tmp));
				}
			};
		}

		//Groupware
		if (oTab.gw.export_gw)
			oTab.gw.export_gw._onclick = function(){
				downloadItem('sid='+dataSet.get('main',['sid'])+'&class=groupware&fullpath='+ sPrimaryAccount);
			};

		oTab.gw.import_gw._onuploadend = function(arg){
			arg = arg[arg.length-1];
			if (arg.folder && arg.id){
				var oImport = new wm_import(), str = '';
				if (oImport.import_data({'action':'groupware','account':sPrimaryAccount,'path':(arg.folder +'/'+ arg.id)}))
					str = 'BACKUP::IMPORT_SUCCESSFUL';
				else
					str = 'BACKUP::IMPORT_UNSUCCESSFUL';

				gui.notifier._value({type: 'alert', args: {header: '', text: str}});
			}
		};


		// force drawing first tab
		oTab.contact._active(true);
	};

	// ********************************************
	// FINALIZATION
	// force drawing first tab
	if (sTab1){
		this.maintab._getChildObjects('', 'obj_tab').forEach(function(tab) {
			tab._wasActivated = false;
		});
		this.maintab[sTab1]._active(true);
		if (sTab2) {
			this.maintab[sTab1]._getChildObjects('', 'obj_tab').forEach(function(tab) {
				tab._wasActivated = false;
			});
			this.maintab[sTab1].maintab[sTab2]._active(true);
		}
	}
};

_me.__import_destruct = function() {
	// Clear interval in case window is closed during import
	if (this.__import_progress_timeout)
		clearTimeout(this.__import_progress_timeout);
};

/*
 *	Saving mechanism below
 *
 *	Saving in to steps, first save account changes, secondly save other settings
 */

_me.__saveAccounts = function() {
	var update = false,
		accounts = new wm_accounts,
		primary = {},
		oAccountTab = this.maintab.account_settings.maintab;

	if (oAccountTab.other && (GWOthers.getItem('RESTRICTIONS','disable_otheraccounts') || 0)<1)
		for (var sEmail in this.__state) {
			var aValues = this.__otherAccounts[sEmail];
			switch (this.__state[sEmail]) {
			case 'edited':
				aValues['aid'] = sEmail;
			case 'new':
				update = true;

				accounts.add(aValues, 'folders','',[gui.frm_main,'_refreshItems',[sEmail]]);
				dataSet.add('accounts', [sEmail], aValues);

				var value = gui.frm_main.bar.tree.folders._value();
				value.push(sEmail);
				gui.frm_main.bar.tree.folders._value(value);

				break;

			case 'deleted':
				accounts.remove({'aid':sEmail},'accounts','','folders');
				dataSet.remove('accounts',[sEmail]);
				update = true;
				break;

			default:
				continue;
			}
		}

	if (oAccountTab.primary) {
		// var desc = oAccountTab.primary.description._value();
		// if (desc != (this.__primaryAccount['DESCRIPTION'] || ''))
		// 	primary['DESCRIPTION'] = desc;

		var fname = oAccountTab.primary.fullname._value();
		if (fname != (this.__primaryAccount['FULLNAME'] || ''))
			primary['FULLNAME'] = fname;

		if (oAccountTab.primary.alternative){
			var alternative = oAccountTab.primary.alternative._value();
			if (alternative != (this.__primaryAccount['ALTERNATIVE'] || ''))
				primary['ALTERNATIVE'] = alternative;
		}
	}
	/*
	if (oAccountTab.primary && (GWOthers.getItem('RESTRICTIONS','disable_changepass') || 0)<1) {
		var pwd = oAccountTab.primary.x_old_password._value();
		var newpwd = oAccountTab.primary.x_new_password._value();
		var newpwdc = oAccountTab.primary.x_new_password_conf._value();

		if (pwd || newpwd || newpwdc){
			if (!pwd || newpwd != newpwdc){
				var me = this;
				gui._create('alert','frm_alert','','',[function(){
					try{
						me.maintab.account_settings._active(true);
						if (!pwd)
							oAccountTab.primary.x_old_password._focus();
						else
						if (!newpwd)
							oAccountTab.primary.x_new_password._focus();
						else
							oAccountTab.primary.x_new_password_conf._focus();
					}
					catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r);}
				}],'','ALERTS::'+(pwd?'INVALID_CPASSWORD':'INVALID_PASSWORD'));

				return false;
			}

			// encrypt password
			var tmp = auth.hashid({"username":this.__primaryAccount['USERNAME']}),
				rsa = new RSAKey();
				rsa.setPublic(tmp.hash, '10001');

			primary['OLDPASSWORD'] = rsa.encrypt(buildURL({p:pwd,t:tmp.time}));
			primary['PASSWORD'] = rsa.encrypt(buildURL({p:newpwd,t:tmp.time}));
		}
	}
*/

	if (count(primary) > 0){
		for (var i in primary)
			dataSet.add('accounts', [sPrimaryAccount,i], primary[i]);

		update = true;
		primary['aid'] = sPrimaryAccount;
		accounts.add(primary, 'folders','',[this,'__saveAccountsHandler']);
		this.x_btn_ok._disabled(true);
		return false;
	} else
		this.__saveItems();

	if (update)
		gui.frm_main.bar.tree.folders._fill();

	return true;
};

_me.__saveAccountsHandler = function(aData,sErrorValue) {
	//Error
	if (typeof aData == 'string'){
		var me = this;

		switch (aData){
		case 'account_password_policy':

			var s,str = '<ul>',
				aResource = dataSet.get('storage',['PASSWORD_POLICY','ITEMS',0,'VALUES']);

			for(var i in aResource){
				if(aResource[i].VALUE>0 && (s = getLang('POLICY::'+i,[aResource[i].VALUE],2)))
					str += '<li>'+ s +'</li>';
			}
			str += '<li>'+getLang('POLICY::LATIN')+'</li>';
			str += '<li>'+getLang('POLICY::DIACRITICS')+'</li>';
			str += '</ul>';

			gui._create('alert','frm_alert','','',[function(){
				try{
					me.maintab.account_settings._active(true);
					me.maintab.account_settings.maintab.primary.x_new_password._focus();
				}
				catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r)}
			}],'ALERTS::PASSWORD_POLICY','',getLang('ALERTS::PASSWORD_REQUIREMENTS')+str);

			break;
		default:
			gui._create('alert','frm_alert','','',[function(){
				try{
					me.maintab.account_settings._active(true);
					me.maintab.account_settings.maintab.primary.x_old_password._focus();
				}
				catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r)}
			}],'','ALERTS::INVALID_PASSWORD');
		}

		this.x_btn_ok._disabled(false);
	}
	else{
		gui.frm_main.bar.tree.folders._fill();
		this.__saveItems();
	}
};

_me.__saveItems = function()
{
	if(!this.maintab) {
		return;
	}

	var me = this,
		aValues = {};

	//Záloha stávajícího storage
	dataSet.add('tmp_storage','',dataSet.get('storage','',true));

	function storeNonWellKnown(oForm, sResource) {
		var aValues = {};
		if (oForm && oForm._wasActivated) {
			storeDataFromForm(oForm,aValues);
			me._others.set(sResource,aValues,'storage');
		}
	}

	if (sPrimaryAccountGUEST){
		var aValues = {};
		var teamchatValues = {};

		storeDataFromForm(this, aValues);

		for(var i in aValues) {
			if(~i.indexOf('u_gw_teamchat')) {
				teamchatValues[i] = aValues[i];
				delete aValues[i];
			}
		}

		me._others.set('CHAT', aValues,'storage');
		me._others.set('TEAMCHAT_NOTIFY', teamchatValues, 'storage');
	}
	else{
		// ********************************************
		// MAILSETTINGS
		if (this.maintab.mail_settings && this.maintab.mail_settings._wasActivated) {

			var oTab = this.maintab.mail_settings.maintab;
			storeNonWellKnown(oTab.general, 'MAIL_SETTINGS_GENERAL');
			storeNonWellKnown(oTab.mail_default, 'MAIL_SETTINGS_DEFAULT');
			storeNonWellKnown(oTab.readconfirmation, 'READ_CONFIRMATION');

			//Signature
			if (oTab.signature && oTab.signature._wasActivated) {

				//Store last active signature
				oTab.signature.list.__save_text.call(oTab.signature);

				var out = [],tmp,
					aSigns = oTab.signature.__signatures;

				for (var i in aSigns){
					tmp = {
						ATTRIBUTES:{ACCESS:'full',DONT_SEND:false},
						VALUES:{
							TEXT:{ATTRIBUTES:{ACCESS:'full'},VALUE:aSigns[i].text}
						}
					};

					if (i>0){
					    tmp.VALUES.ID = {ATTRIBUTES:{ACCESS:'full'},VALUE:i};
					    tmp.VALUES.NAME = {ATTRIBUTES:{ACCESS:'full'},VALUE:aSigns[i].name};
					}

					out.push(tmp);
				}

				dataSet.add('storage',['SIGNATURE','ITEMS'],out,1);
				dataSet.add('storage',['SIGNATURE','ATTRIBUTES','DONT_SEND'],false,1);

			}

			//Aliases
			if (oTab.alias && oTab.alias._wasActivated) {
				dataSet.add('storage',['ALIASES','ATTRIBUTES','DONT_SEND'],false,1);
			}

			// Autoresponder
			if (oTab.autoresponder && oTab.autoresponder._wasActivated) {
				aValues = oTab.autoresponder.autoresponder._value();

				if (aValues['u_respondbetweenfrom']){
					var from = IcewarpDate.julian(aValues['u_respondbetweenfrom']).getMoment().toObject();
					from['months'] = from['months']+1;
					aValues['u_respondbetweenfrom'] = from['years']+'/'+(from['months']<10?'0'+from['months']:from['months'])+'/'+(from['date']<10?'0'+from['date']:from['date']);
				}

				if (aValues['u_respondbetweento']){
					var to = IcewarpDate.julian(aValues['u_respondbetweento']).getMoment().toObject();
					to['months'] = to['months']+1;
					aValues['u_respondbetweento'] = to['years']+'/'+(to['months']<10?'0'+to['months']:to['months'])+'/'+(to['date']<10?'0'+to['date']:to['date']);
				}

				this._others.set('AUTORESPONDER', aValues, 'storage');
			}

			// Forwarder
			if (oTab.forwarder && oTab.forwarder._wasActivated) {
				aValues = {};
				storeDataFromForm(oTab.forwarder, aValues);
				if (!oTab.forwarder.u_forwardolder._value()) {
					delete aValues['u_forwardolderdays'];
					delete aValues['u_forwardolderto'];
				}
				this._others.set('FORWARDER', aValues, 'storage');
			}

			// Message rules
			if (oTab.rules && oTab.rules._wasActivated) {

				var aValues,
					aFilters = [];

				for (var i in oTab.rules.__valuesOfLines) {
					aValues = oTab.rules.__valuesOfLines[i];
					if (!Is.Empty(aValues['CONDITION'])) {
						aFilters.push(aValues);
					}
				}

				if (Is.Empty(aFilters))
					delete oTab.rules._aXmlFilter['CONTENTFILTER'][0]['FILTER'];
				else
					oTab.rules._aXmlFilter['CONTENTFILTER'][0]['FILTER'] = aFilters;

				oTab.rules._aStorageFilters['VALUES']['u_rulescontentxml'] = (XMLTools.Arr2Str(oTab.rules._aXmlFilter,true)).replace(/></g, '>\n<');

				GWOthers.set('FILTER_RULES', oTab.rules._aStorageFilters['VALUES'], 'storage');
				WMStorage.set({'resources':dataSet.get('storage')},'storage');
			}
		}

		// ********************************************
		// IM SETTINGS
		if (this.maintab.im_settings && this.maintab.im_settings._wasActivated) {
			var oTab = this.maintab.im_settings.maintab;
			oTab.general && storeNonWellKnown(oTab.general, 'IM');
			oTab.chat && storeNonWellKnown(oTab.chat, 'IM');
		}

		// ********************************************
		// TEAMCHAT SETTINGS
		if (this.maintab.teamchat_settings && this.maintab.teamchat_settings._wasActivated) {
			var oTab = this.maintab.teamchat_settings.maintab;
			oTab.general && storeNonWellKnown(oTab.general, 'CHAT');

			if(oTab.digest && oTab.digest._wasActivated) {
				var aValues = {};
				var bValues = {};
				storeDataFromForm(oTab.digest, aValues);
				for(var i in aValues) {
					if(i === 'teamchat_notify') {
						bValues[i] = aValues[i];
						delete(aValues[i]);
					}
				}
				me._others.set('TEAMCHAT_NOTIFY', aValues, 'storage');
				me._others.set('GLOBAL_SETTINGS', bValues, 'storage');
			}
		}

		// ********************************************
		// SIP SETTINGS
		if (this.maintab.sip_settings && this.maintab.sip_settings._wasActivated){
			var oTab = this.maintab.sip_settings.maintab;

			if (oTab.general && oTab.general._wasActivated){

				storeNonWellKnown(oTab.general, 'SIP');

				if (oTab.general.x_java._value() == 'x'){
					me._others.setItem('SIP','mode','integrate');

					//Login SIP if disabled
					if (gui.dial){
						gui.frm_main.sip && gui.frm_main.sip._destruct();
						gui._create('dial','frm_dial');
					}
					else
					if (GWOthers.getItem('SIP','start')>0){
						try{
							gui.frm_main._create('sip','obj_sip');
						}
						catch(err){

							gui._create('alert','frm_alert','','',null,'SIP::ERROR',null, err.message || getLang('SIP::ONLINE_FAILED'));

							this.maintab.sip_settings._active(true);
							oTab.general._active(true);

							return false;
						}
					}
				}
				else{
					if (oTab.general.x_dial_ext && oTab.general.x_dial_ext._value() == 'x')
						me._others.setItem('SIP','mode','external');
					else
						me._others.setItem('SIP','mode','phone');

					//Logout SIP if active
					gui.frm_main.sip && gui.frm_main.sip._logout();
				}
			}

			if (oTab.forward && oTab.forward._wasActivated)
				storeNonWellKnown(oTab.forward, 'CALL_FORWARDING');

		}

		// ********************************************
		// GENERALSETTINGS
		if (this.maintab.general_settings && this.maintab.general_settings._wasActivated) {
			var oTab = this.maintab.general_settings.maintab;
			storeNonWellKnown(oTab.layout, 'LAYOUT_SETTINGS');
			storeNonWellKnown(oTab.folders, 'DEFAULT_FOLDERS');

			//Check Notification Permission
			if (oTab.layout && oTab.layout._wasActivated && oTab.layout.notifications._value() != 2 && gui.notifier && gui.notifier._getPermissions() != 'unsupported' && gui.notifier._getPermissions() != 'granted'){
				if (gui.notifier._getPermissions() == 'denied')
					gui.notifier._setPermissions();
				else
					window.Notification.requestPermission(function(perm){
						window.Notification.permission = perm;
					});
			}

			//TAB 4 - antispam
			if (oTab.antispam && oTab.antispam._wasActivated)
				storeNonWellKnown(oTab.antispam, 'ANTISPAM');

			//TAB 3 - Documents
			if (oTab.documents)
				storeNonWellKnown(oTab.documents, 'DOCUMENTS');
			if (oTab.documents.x_ownautorevisionmode)
				me._others.setItem('GW_MYGROUP','ownautorevisionmode',oTab.documents.x_ownautorevisionmode._value());

			/*// Apply compact view if changed
			if(oTab.layout.compact_view && oTab.layout.compact_view._value()==1)
				addcss(document.getElementsByTagName('body')[0],'compact');
			else
				removecss(document.getElementsByTagName('body')[0],'compact');*/

			IcewarpDate.setCalendar(+GWOthers.getItem('LAYOUT_SETTINGS', 'alternative_calendar'), true);

			//Refresh folders because of new Default folders
			dataSet.update('folders');
		}

		// ********************************************
		// CALENDARSETTINGS
		if (this.maintab.calendar_settings && this.maintab.calendar_settings._wasActivated) {
			var oTab = this.maintab.calendar_settings.maintab;

			storeNonWellKnown(oTab.main, 'CALENDAR_SETTINGS');
			storeNonWellKnown(oTab.default_settings, 'DEFAULT_CALENDAR_SETTINGS');

			if (oTab.reminder && oTab.reminder._wasActivated){
				storeNonWellKnown(oTab.reminder.event, 'EVENT_SETTINGS');

				storeNonWellKnown(oTab.reminder.gw, 'GW_MYGROUP');
				dataSet.add('storage', ['GW_MYGROUP','ITEMS',0,'VALUES','GRPDAILYEVENTSEMAIL'], {'VALUE':dataSet.get('storage',['GW_MYGROUP','ITEMS',0,'VALUES','GRPREMINDEREMAIL','VALUE']),'ATTRIBUTES':[]}, 1);
			}

			// gw_holidays
			if (oTab.hollidays && oTab.hollidays._wasActivated) {
				aValues = {};
				storeDataFromForm(oTab.hollidays,aValues);
				aValues = aValues['holidays_list'];

				var aHolidays = {};

				//Procházíme všechny groups a nastavíme jejich subscribed parametr na false
				for(var n in this._holidaysUId)
					aHolidays[this._holidaysUId[n]] = 'false';

				//Nastavíme subscribed parametr na true pouze u zvolených group
				for(var n in aValues)
					aHolidays[this._holidaysUId[aValues[n]]] = 'true';

				this._holidays.set(aHolidays,'storage');
			}

			if (oTab.weather && oTab.weather._wasActivated) {
				var aCities = me._holidays.get('storage','WEATHER'),
		            aValues = oTab.weather.x_cities.__idTable,
					aWeather = {};

				//removed
				for (var i in aCities)
					if (!aValues[aCities[i].UID] && aCities[i].SUBSCRIBED == 'true')
						aWeather[aCities[i].UID] = 'false';

				//added
				for (var i in aValues)
					if (!aWeather[i])
						aWeather[i] = 'true';

				if (count(aWeather)>0)
					this._holidays.set(aWeather,'storage','WEATHER');

				//Save TEMPERATURE
				storeNonWellKnown(oTab.weather, 'CALENDAR_SETTINGS');
			}
			IcewarpDate.Locale.changeLocalizedFormat('L', CalendarFormatting.getFormat(+GWOthers.getItem('LAYOUT_SETTINGS', 'date_format')));
			IcewarpDate.Locale.changeLocalizedFormat('LT', +GWOthers.getItem('LAYOUT_SETTINGS', 'time_format') ? 'hh:mm a' : 'HH:mm');
			if(GWOthers.getItem('CALENDAR_SETTINGS', 'begin_on_today') != '0'){
				IcewarpDate.Locale.setCustomWeekStart((new IcewarpDate()).day());
			}else{
				IcewarpDate.Locale.setCustomWeekStart({monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6, sunday: 0}[GWOthers.getItem('CALENDAR_SETTINGS', 'week_begins')]);
			}

			IcewarpDate.Locale.chooseLocale(GWOthers.getItem('LAYOUT_SETTINGS', 'language'));
		}

		// ********************************************
		// ACCOUNTSETTINGS
		if (this.maintab.account_settings && this.maintab.account_settings._wasActivated) {
			var oTab = this.maintab.account_settings.maintab;

			//TAB 3 - certificate
			if (oTab.certificate && oTab.certificate._wasActivated) {

				var v = oTab.certificate.X_CERT._value();

				if (count(v)>0){
				    var out = [], tmp;
					for(var i in v)
						if (v[i].uid)
							out.push({ATTRIBUTES:{ACCESS:'full',DONT_SEND:false,UID:v[i].uid}});
						else
						if (v[i].fullpath){
	                        tmp = {ATTRIBUTES:{ACCESS:'full',DONT_SEND:false},VALUES:{FILE:{ATTRIBUTES:{ACCESS:'full'},VALUE:v[i].fullpath}}};
							if (v[i].passphrase)
								tmp.VALUES.PASSPHRASE = {ATTRIBUTES:{ACCESS:'full'},VALUE:v[i].passphrase};

							out.push(tmp);
						}

					dataSet.add('storage',['CERTIFICATE','ITEMS'],out,1);
					dataSet.add('storage',['CERTIFICATE','ATTRIBUTES','DONT_SEND'],false,1);
				}
			}
		}
	}

	//Hromadné posílání povolených změn na server
	var nOK = WMStorage.set({'resources':dataSet.get('storage')},'storage','',[this,'__saveItemsHandler']);

	//Na server se nic neposílá?
	if (nOK == 2)
	{
		dataSet.remove('tmp_storage');
		GWOthers.load(this.resources, false, false, true);
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
		GWOthers.load(this.resources, false, false, true);

		//refresh certificates & signature
		var aRes = [];
		if (this.maintab && this.maintab.account_settings && this.maintab.account_settings._wasActivated && this.maintab.account_settings.maintab.certificate && this.maintab.account_settings.maintab.certificate._wasActivated)
			aRes.push('certificate');
		if (this.maintab && this.maintab.mail_settings && this.maintab.mail_settings._wasActivated && this.maintab.mail_settings.maintab.signature && this.maintab.mail_settings.maintab.signature._wasActivated)
			aRes.push('signature');
		if (aRes.length)
			WMStorage.get({'resources': aRes},'storage','','',true);

		if (GWOthers.getItem('LAYOUT_SETTINGS','favorites')>0){
			if (!gui.frm_main.bar.fav && WMFolders.getType(Path.split(dataSet.get('active_folder') || '')) != 'I')
				gui.frm_main.bar._create('fav','obj_barmenu_favorites',{target:'top', first:true},'',0,'FAVORITES::FAVORITES');
		}
		else
		if (gui.frm_main.bar.fav)
			gui.frm_main.bar.fav._destruct();

		// Switch skin style
		try{

			//set font variant
			var font = GWOthers.getItem('LAYOUT_SETTINGS', 'font_weight');
			if (font == 'auto')
				font = gui.__BROWSER.retina?'light':'normal';

			if (font == 'light')
				addcss(document.body,'light');
			else
				removecss(document.body,'light');

			var night_mode_enabled = this.maintab.general_settings.maintab.layout.night_mode._value() == 1;

			//set skin
			if ((this.__oldData.LAYOUT_SETTINGS.ITEMS[0].VALUES.SKIN || {}).VALUE != GWOthers.getItem('LAYOUT_SETTINGS','skin') || (this.__oldData.LAYOUT_SETTINGS.ITEMS[0].VALUES.SKIN_STYLE || {}).VALUE != GWOthers.getItem('LAYOUT_SETTINGS','skin_style')){
				NightMode().reset();
				storage.css('style',true,function() {
					if (night_mode_enabled) {
						NightMode().activate();
					}
				}.bind(this));
			} else if (night_mode_enabled) {
				NightMode().activate();
			} else {
				NightMode().reset();
			}
		}
		catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r)}

		this._destruct();
		gui.frm_main._getNew();
	}
	else{
		dataSet.add('storage','',dataSet.get('tmp_storage'));
		dataSet.remove('tmp_storage');
		this._main.style.display = "block";
	}
};
