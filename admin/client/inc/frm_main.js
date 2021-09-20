_me = frm_main.prototype;
function frm_main(){};

/**
 * @brief:
 * @date : 01.12.2014
 **/
_me.__constructor = function(s){
	var me = this;

	/* Create all necessary objects */
	gui._create('hashhandler','obj_hashhandler');
	/* */

	storage.library('wm_console');

	this._lastMenu='';

	this._asideMenu=[
		{
			ignore:!gui._globalInfo.getDomainRights('v_createuser'),
			name:'new_user',
			icon:'user',
			value:'generic::new_user',
			onclick:function(name){
				me._newAccount(0);
				return false;
			}
		},
		{
			ignore:!gui._globalInfo.getDomainRights('V_CreateGroup'),
			name:'new_group',
			icon:'collaboration',
			value:'generic::new_group',
			onclick:function(name){
				me._newAccount(7);
				return false;
			}
		},
		{
			ignore:!gui._globalInfo.getDomainRights('V_CreateMailingList'),
			name:'new_mailing_list',
			icon:'mailing-list',
			value:'generic::new_mailing_list',
			onclick:function(name){
				me._newAccount(1);
				return false;
			}
		},
		{
			ignore:!gui._globalInfo.getDomainRights('V_CreateResource'),
			name:'new_resource',
			icon:'resources',
			value:'generic::new_resource',
			onclick:function(name){
				me._newAccount(8);
				return false;
			}
		},
		{
			ignore:!gui._globalInfo.getDomainRights('V_CreateDomain'),
			name:'new_domain',
			icon:'server',
			value:'generic::new_domain',
			onclick:function(name){
				me._newAccount('d');
				return false;
			}
		}
	];

	this._asideMainMenu=[];
	if(gui._globalInfo.admintype==USER_ADMIN || gui._globalInfo.admintype==USER_WEB){
		this._asideMainMenu.push({
			name:'dashboard',
			icon:'dashboard',
			value:'main::dashboard',
			onclick:function(name){
				me._onouterclick();
				location.hash='menu=dashboard';
				return false;
			}
		});
	}

	if(gui._globalInfo.admintype!=USER_USER){
		this._asideMainMenu.push(
			{
				name:'home',
				icon:'server',
				value:'main::management',
				onclick:function(name){
					gui._globalInfo.ignoreSingleDomain=true;	// do not redirect even if single domain
					me._onouterclick();
					location.hash='menu=management';
					return false;
				}
			}
		);
	}

	if(gui._globalInfo.getServerRights('V_SpamQueues')){
		this._asideMainMenu.push(
			{
				name:'spam_queues',
				icon:'spam',
				value:'main::spam_queues',
				onclick:function(name){
					me._onouterclick();
					location.hash='menu=spamqueues';
					return false;
				}
			}
		);
	}

	if(gui._globalInfo.admintype==USER_ADMIN || gui._globalInfo.admintype==USER_WEB){
		this._asideMainMenu.push({
			name:'whitelabeling',
			icon:'documents',
			value:'main::white_labeling',
			onclick:function(name){
				me._onouterclick();
				location.hash='menu=whitelabeling';
				return false;
			}
		});
	}

/*	if(gui._globalInfo.admintype==USER_ADMIN){
		this._asideMainMenu.push({
			name:'content_rules',
			icon:'rules',
			value:'main::content_rules',
			onclick:function(name){
				me._onouterclick();
				location.hash='menu=content_rules';
				return false;
			}
		});
	}
*/
	if(gui._globalInfo.admintype==USER_ADMIN || gui._globalInfo.admintype==USER_WEB){
		this._asideMainMenu.push({
			name:'server_settings',
			icon:'settings',
			value:'main::server_settings',
			onclick:function(name){
				me._onouterclick();
				location.hash='menu=server_settings';
				return false;
			}
		});
	}

	if(gui._globalInfo.admintype!=USER_USER){
		this._asideMainMenu.push({
			name:'api_console',
			icon:'terminal',
			value:'main::console',
			onclick:function(name){

				// ee -for fun
				if(gui.__sound_on){
					gui.frm_main.scrape._play(1000);
				}
				//

				var who=false;
				if(location.parsed_query.account){
					who=location.parsed_query.account
				}else if(location.parsed_query.domain){
					who=location.parsed_query.domain;
				}
				me._openConsoleDialog(who);

				me._onouterclick();
				return false;
			}
		});
	}


	// Empty usermenu (account main options)
	this._userMenu=[];

	// Add logout option to usermenu
	this._userMenu.push({
			name:'logout',
			value:'main::logout',
			onclick:function(name){
				me._onouterclick();
				me.__logout();
				return false;
			}
		}
	);

	gui.hashhandler._obeyEvent('onchange', [this,'__hash_handler']);

	storage.library('obj_message');
	storage.library('wm_console');
	storage.library('obj_accountpicker');

	// apply skin settings
	me._applySkin();

	this._draw('frm_main', 'main',{cloudserver: gui._globalInfo.licence.iscloud==1 && gui._globalInfo.licence.cloudinfo && gui._globalInfo.licence.cloudinfo.cloudhostname});

	// fill usermenu info
	me._fillUsermenu();

	// Get WebMail url from server and set that url + SID to webmail-switch button
	com.console.item(function(data){
		data=data.Array.IQ[0];
		if(data.ATTRIBUTES.TYPE=='result'){
			try
			{
				gui._globalInfo.webmail_url=data.QUERY[0].RESULT[0].ITEM[0].PROPERTYVAL[0].VAL[0].VALUE;

				// Always add switch to WebClient for usermenu
				me._userMenu.unshift({
					name:'webclient',
					value:'main::webclient',
					href:helper.trim(gui._globalInfo.webmail_url,'/')+'/?sid='+dataSet.get('main',['sid'])+'&from=WebAdmin&language=' + (storage.aStorage.language._ACTIVE_LANG || 'en'),
					onclick:function(name){
						me._onouterclick();
						return false;
					}
				});

				// Add subscription
				if((gui._globalInfo.admintype==USER_ADMIN || gui._globalInfo.admintype==USER_WEB) && (gui._globalInfo.licence.iscloud==1 || (gui._globalInfo.licence.licensetype=="saas" && gui._globalInfo.licence.cloudinfo && +gui._globalInfo.licence.cloudinfo.cloudshowprice))) {
					me._userMenu.unshift({
						name:'subscription',
						icon:"subscription",
						value:'main::subscription',
						onclick: function() {
							location.hash = "menu=subscription";
							me._onouterclick();
							return false;
						}
					});
				}

				// Add support for admins
				if (gui._globalInfo.admintype==USER_ADMIN || gui._globalInfo.admintype==USER_WEB) {
					me._userMenu.unshift({
						name:'support',
						value:'main::support',
						onclick:function(name){
							me._onouterclick();
							com.licence.manage('SupportPortal',function(link){
								var win = window.open(link, '_blank');
								if(!win) {
									location.href = link;
								}
							});
							return false;
						}
					});
				}

				// Add account settings for non-users
				if(gui._globalInfo.admintype!=USER_USER) {
					me._userMenu.unshift({
						name:'account_settings',
						icon:"user",
						value:'main::account_settings',
						onclick:function(name){
							location.hash="menu=accountdetail&account="+encodeURIComponent(gui._globalInfo.email)+"&type=0";
							me._onouterclick();
							return false;
						}
					});
				}
				if(gui._globalInfo.admintype == USER_USER) {
					me._userMenu.unshift({
						name: 'change_password',
						icon: 'user',
						value: 'accountdetail::change_password',
						onclick: function(){
							var popup = gui._create('popup','obj_popup');
							popup._init({
								name: 'changepassword',
								heading: {
									value: getLang('accountdetail::change_password')
								},
								fixed: false,
								footer: 'obj_accountinfo_changepwd_footer',
								content: 'obj_changepwd'
							});
							popup.content._load();

							me._onouterclick();
							return false;
						}
					});
				}

				me._userMenu.push({
					name: 'night_mode',
					value: 'main::night_mode',
					icon: 'star',
					onclick: function() {
						if(NightMode().init) {
							NightMode().reset();
							Cookies.set('night_mode', 0);
						} else {
							NightMode().activate();
							Cookies.set('night_mode', 1);
						}
						return false;
					}
				});

				// create user menu
				if(!me.user_menu){
					me._clean('user_menu');
					log.info(me._create('user_menu','obj_tabmenu','user_menu'));
					me.user_menu._iwAttr('type','tab');
					me.user_menu._iwAttr('location','main');
				}
				me.user_menu._fill(me._userMenu);

				// Check for unsaved changes before leaving
				me.user_menu._main.addEventListener('click',preventLeavingWithoutSaving,true);

			}
			catch(e)
			{
				log.error(['cannot-get-data-from-server',e]);
			}
		}else{
			log.error(['e:cannot-get-data-from-server','c_webmail_url']);
		}
	}).server('c_webmail_url');
	//

	if(!this.aside_menu){
		this._clean('aside_menu');
		this._create('aside_menu','obj_tabmenu','aside_menu');
		this.aside_menu._addcss('dark');
		this.aside_menu._iwAttr('type','tab');
		this.aside_menu._iwAttr('location','main');
	}
	this.aside_menu._fill(this._asideMenu);
	// if there are no items in menu (no rights), disable menu
	if(
		!gui._globalInfo.getDomainRights('v_createuser') &&
		!gui._globalInfo.getDomainRights('V_CreateGroup') &&
		!gui._globalInfo.getDomainRights('V_CreateMailingList')
	){
		this.btn_menu_add._disabled(true);
	}

	if(!this.aside_main_menu){
		this._clean('aside_main_menu');
		this._create('aside_main_menu','obj_tabmenu','aside_main_menu');
		this.aside_main_menu._addcss('dark');
		this.aside_main_menu._iwAttr('type','tab');
		this.aside_main_menu._iwAttr('location','main');
	}
	this.aside_main_menu._fill(this._asideMainMenu);

	//this.input_search._required(true);
	this.btn_search_icon._onclick=function(){
		me._searchHideResultCount();
		addcss(me._getAnchor('topbar'),'active');
		me.input_search._focus();
	};

	this._getAnchor('aside_menu').onmouseup=function(e){
		e.preventDefault();
		e.cancelBubble=true;
		return false;
	};

	this._getAnchor('aside_main_menu').onmouseup=function(e){
		e.preventDefault();
		e.cancelBubble=true;
		return false;
	};

	this.btn_menu_add._main.onmouseup=function(e){
		e.preventDefault();
		e.cancelBubble=true;
		return false;
	}

	this._getAnchor('usermenu').onmouseup=function(e){
		e.preventDefault();
		e.cancelBubble=true;
		return false;
	}

	this.btn_menu_main._main.onmouseup=function(e){
		e.preventDefault();
		e.cancelBubble=true;
		return false;
	}

	this.btn_menu_home._onclick=function(){
		me._onouterclick();
		if(!location.parsed_query.menu){
			location.reload()
		}else{
			location.hash='';
		}
	}

	this.btn_menu_main._onclick=function(){
		if(!this._opened)
		{
			me._onouterclick();
			this._opened=true;
			addcss(me._getAnchor('aside_main_menu'),'menu-is-open');
			addcss(me.btn_menu_main._main,'menu-is-open');
			// ee -for fun
			if(gui.__sound_on){
				gui.frm_main.impact._play(false,150);
			}
			//
		}
		else
		{
			me._onouterclick();
		}
	}

	this.btn_menu_add._onclick=function(){
		if(!this._opened)
		{
			me._onouterclick();
			this._opened=true;
			addcss(me._getAnchor('aside_menu'),'menu-is-open');
			addcss(me.btn_menu_add._main,'menu-is-open');
			// ee -for fun
			if(gui.__sound_on){
				gui.frm_main.impact._play(false,150);
			}
			//
		}
		else
		{
			me._onouterclick();
		}
	}

	this._getAnchor('usermenu').onclick=function(){
		if(!this._opened)
		{
			me._onouterclick();
			this._opened=true;
			addcss(me._getAnchor('user_menu'),'menu-is-open');
			addcss(me._getAnchor('usermenu'),'menu-is-open');
			// ee -for fun
			if(gui.__sound_on){
				gui.frm_main.impact._play(false,150);
			}
			//
		}
		else
		{
			me._onouterclick();
		}
	}

	// Prevent navigation if denied by main content (values not saved)
	var preventLeavingWithoutSaving = function(e){
		// Retrieving the main content (not directly accessible)
		var content = me.main._getAnchor('main_content').firstElementChild.id.split('.');
		content = content[content.length-1];
		log.info('Leaving',content);
		content = me.main[content];
		// Check if object content is saved and prevent navigation
		if(content && content._issaved && !content._issaved()) {
			e.stopPropagation();
			content._view.askForSaving(function(){
				e.target.click();
			});
		}
	}
	this.main.btn_back._main.addEventListener('click',preventLeavingWithoutSaving,true);
	this.main.left_menu._main.addEventListener('click',preventLeavingWithoutSaving,true);
	this.aside_main_menu._main.addEventListener('click',preventLeavingWithoutSaving,true);

	// check location hash for parameters
	if(!gui.hashhandler._force_changed()){
		this.__load_default_view({},{});
	} else {
		log.info('Object should be loaded according to hash');
	}

	gui._obeyEvent('mouseup', [this,'_onouterclick']);
	gui._obeyEvent('blur', [this,'_onouterclick']);

	this._add_destructor('__onbeforedestruct');

	/** */
	gui._changeObserver.assignTrigger(me.btn_menu_home);
	/** */

	if(Cookies.get('night_mode') == 1) {
		NightMode().activate();
	}
};

_me._fillUsermenu=function(){
	var me=this;
	try
	{
		me._getAnchor("usermenu_name").innerHTML=helper.htmlspecialchars(gui._globalInfo.fullname);
		me._getAnchor("usermenu_email").innerHTML=helper.htmlspecialchars(gui._globalInfo.email);
		if(gui._globalInfo.userimage){
			me._getAnchor("usermenu_image").style.backgroundImage="url("+helper.htmlspecialchars(gui._globalInfo.userimage)+")";
		}
		var rank = me._getAnchor("usermenu_rank");
		removecss(rank,"subtype_0");
		removecss(rank,"subtype_1");
		removecss(rank,"subtype_2");
		removecss(rank,"subtype_3");
		addcss(rank,"subtype_"+gui._globalInfo.admintype);
	}
	catch(e)
	{
		log.error(['frmmain-fillusermenu',e]);
	}
}

_me.__logout = function()
{
	logout();
}

_me._getSearch=function(){
	var str=helper.trim(this.input_search._value());
	return ((str!=''&&str!='**')?str:false);
}

_me._setSearchString=function(str,keepopen){
	log.log(['frm_main-setsearchstring',str]);
	this.input_search._value(helper.trim(str));
	if(helper.trim(str)!='' || keepopen){
		addcss(this._getAnchor('topbar'),'active');
	}else{
		removecss(this._getAnchor('topbar'),'active');
	}
}

_me._setSearchResults=function(number){
	this._getAnchor('search_results').innerHTML=number;
	this._searchShowResultCount();
}

_me._searchShowResultCount=function(){
	var me=this;
	if(me.input_search._value()!=''){
		addcss(me.input_search.__eIN,'has-info');
		me.input_search.__hasinfo=true;
		me._getAnchor('search_query').innerHTML=helper.htmlspecialchars(me.input_search._value());
	}
}

_me._searchHideResultCount=function(){
	var me=this;
	me.input_search.__hasinfo=false;
	removecss(me.input_search.__eIN,'has-info');
}

_me._search=function(string)
{
	if(string){
		this._setSearchString(string);
	}
	this.btn_close_search._onclick();
}

_me._initSearch=function(callback,showResults){
	var me=this;

	this.input_search._value('');
	removecss(this._getAnchor('topbar'),'active');
	this.btn_close_search._onclick=function(){};
	this.btn_search._onclick=function(){};

	this.input_search._onkeypress=function(e){
		if(me.input_search.__hasinfo && e.keyCode!=13){
			me._searchHideResultCount();
		}
	}

	if(callback){
		this.btn_close_search._onclick=function(){
			me._searchHideResultCount();
			me.input_search._value('');
			try
			{
				callback('');
			}
			catch(e)
			{
				this._onclick=function(){};
			}
			removecss(me._getAnchor('topbar'),'active');
			return false;
		};
		this.btn_search._onclick=this.input_search._main.parentNode.onsubmit=function(){
			try
			{
				callback(me.input_search._value());
			}
			catch(e)
			{
				log.error(['frmmain-search-onclick',e])
				this._onclick=function(){};
			}
			return false;
		};
		this.btn_search_icon._disabled(false);
	}else{
		this.btn_search_icon._disabled(true);
	}
}

_me.__hash_handler = function(e,aData)
{
	var me=this;

	//ee - for fun
	gui.__sound_on=!!+Cookies.get('waso');

	if(location.parsed_query.sound){
		gui.__sound_on=!!+location.parsed_query.sound;
		Cookies.set('waso', +gui.__sound_on);
	}

	if(location.parsed_query.bubbles && location.parsed_query.bubbles==1 && !me.bubbles){
		me._create('bubbles','fun_bubbles');
		me.bubbles._play();
	}

	if(gui.__sound_on && !me.__sound_active){
		me.__sound_active=true;
		me._create('scrape','obj_audio');
		gui.frm_main.scrape._addSource('client/skins/default/sound/scrape.mp3');
		gui.frm_main.scrape._addSource('client/skins/default/sound/scrape.ogg');
		me._create('impact','obj_audio');
		gui.frm_main.impact._addSource('client/skins/default/sound/impact1.mp3');
		gui.frm_main.impact._addSource('client/skins/default/sound/impact1.ogg');
		me._create('impact3','obj_audio');
		gui.frm_main.impact3._addSource('client/skins/default/sound/impact3.mp3');
		gui.frm_main.impact3._addSource('client/skins/default/sound/impact3.ogg');
		me._create('kaboom','obj_audio');
		gui.frm_main.kaboom._addSource('client/skins/default/sound/kaboom6.mp3');
		gui.frm_main.kaboom._addSource('client/skins/default/sound/kaboom6.ogg');
		me._create('win','obj_audio');
		gui.frm_main.win._addSource('client/skins/default/sound/win.mp3');
		gui.frm_main.win._addSource('client/skins/default/sound/win.ogg');
		me._create('bubble','obj_audio');
		gui.frm_main.bubble._addSource('client/skins/default/sound/bubble.mp3');
		gui.frm_main.bubble._addSource('client/skins/default/sound/bubble.ogg');
	}
	//

	// restrict access to global console for domain admin
	if (gui._globalInfo.admintype!=USER_ADMIN && gui._globalInfo.admintype!=USER_WEB && !location.parsed_query.domain && !location.parsed_query.account){
		me.aside_main_menu._disableTab('api_console');
	}else{
		me.aside_main_menu._enableTab('api_console');
	}
	//

	this._initTrialTopbar();
	this._initTopbar();

	try
	{
		if(aData.parsed_query.menu)
		{
			log.info('before init search and clean box-frm_main');
			gui.frm_main._initSearch();

			if(!this._lastMenu!=aData.parsed_query.menu){
				this._lastMenu=aData.parsed_query.menu;
				this.main._clean('box');
				this.main._setHeadingButton();
				log.info(['box cleaned-frm_main',aData.parsed_query.menu]);
			}
			log.info('after clean box-frm_main');

			this._getAnchor('main_box').removeAttribute('iw-type');
			this.main._isFixed(true);
			removecss(this.main._getAnchor('main_content'),'no-padding');

			switch(aData.parsed_query.menu)
			{
				case "demo":
					if(!this.main.demo){
						this.main._clean('main_content');
						this.main._create('demo','obj_demo','main_content');
					}
					this.main.demo._hash_handler(e,aData);
				break;
				case "management":
					this.main._clean('main_content');
					this.main._create('management','obj_management','main_content');
					this.main.management._hash_handler(e,aData);
				break;
				case "dashboard":
					this._getAnchor('main_box').setAttribute('iw-type','multi');
					this.main._isFixed(false);
					addcss(this.main._getAnchor('main_content'),'no-padding');

					this.main._clean('main_content');
					this.main._create('dashboard','obj_dashboard','main_content');
					this.main.dashboard._hash_handler(e,aData);
				break;
				case "domaindetail":
					com.console.item(function(result){
						global._accounts_global_domains_usediskquota=false;
						global._accounts_global_domains_usedomainlimits=false;

						var d=result.Array.IQ[0].QUERY[0].RESULT[0].ITEM;
						for(var i=0; i<d.length; i++){
							var v=result.Array.IQ[0].QUERY[0].RESULT[0].ITEM[i].PROPERTYVAL[0];
							var n=result.Array.IQ[0].QUERY[0].RESULT[0].ITEM[i].APIPROPERTY[0];

							if(v.VAL && v.VAL[0] && v.VAL[0].VALUE){
								global[n.PROPNAME[0].VALUE.substr(1,n.PROPNAME[0].VALUE.length-1)]=(v.VAL[0].VALUE=='1'?true:false);
							}
						}

						if(!me.main.domaindetail){
							me.main._clean('box');
							me.main._create('domaindetail','obj_domaindetail','box');
						}
						me.main.domaindetail._hash_handler(e,aData);
					}).server(['c_accounts_global_domains_usediskquota','c_accounts_global_domains_usedomainlimits','c_accounts_global_domains_useexpiration']);
				break;
				case "accountdetail":
					if(!this.main.accountdetail){
						this.main._clean('box');
						this.main._create('accountdetail','obj_accountdetail','box');
					}
					this.main.accountdetail._hash_handler(e,aData);
				break;
				case "devicedetail":
					if(!this.main.devicedetail){
						this.main._clean('box');
						this.main._create('devicedetail','obj_devicedetail','box');
					}
					this.main.devicedetail._hash_handler(e,aData);
				break;
				case "spamqueues":
					this.main._clean('main_content');
					this.main._create('spamqueues','obj_spamqueues','main_content');
					this.main.spamqueues._hash_handler(e,aData);
				break;
				case "whitelabeling":
					this.main._clean('main_content');
					this.main._create('whitelabeling','obj_whitelabeling','main_content');
					this.main.whitelabeling._hash_handler(e,aData);
				break;
				case "content_rules":
					this.main._clean('main_content');
					this.main._create('content_rules','obj_content_rules','main_content');
					this.main.content_rules._hash_handler(e,aData);
				break;
				case "server_settings":
					this.main._clean('main_content');
					this.main._create('server_settings','obj_server_settings','main_content');
					this.main.server_settings._hash_handler(e,aData);
				break;
				case "certificates":
					this.main._clean('main_content');
					this.main._create('certificates','obj_certificates','main_content');
					this.main.certificates._hash_handler(e,aData);
				break;
				case "subscription":
					this.main._clean('main_content');
					this.main._create('subscription','obj_subscription','main_content');
					this.main.subscription._hash_handler(e,aData);
				break;
				default:
					this.__load_default_view(e,aData);
				break;
			}

			if(gui._globalInfo.passwordexpired==1) {
				gui.message.error(getLang('error::password_expired'),false,[{
					value:getLang("generic::reset"),
					onclick: function(closeCallback) {
						closeCallback();
						var popup=gui._create('popup','obj_popup');
						popup._init({
							name:'changepassword',
							heading:{
								value:getLang('accountdetail::change_password')
							},
							fixed:false,
							footer:'obj_accountinfo_changepwd_footer',
							content:"obj_accountinfo_changepwd"
						});
						popup.content._load(gui._globalInfo.email);
					}
				},{
					value:getLang("main::logout"),
					onclick: function(closeCallback) {
						me.__logout();
					},
					type:'text error'
				}]);
			}

		}
		else
		{
			this.__load_default_view(e,aData);
		}
	}
	catch(e)
	{
		log.error(e);
	}
}

_me.__onbeforedestruct=function(){
	gui._disobeyEvent('mouseup', [this,'_onouterclick']);
	gui._disobeyEvent('blur', [this,'_onouterclick']);
};

_me._onouterclick=function(){
	var me=this;

	if(this.btn_menu_add._opened)
	{
		this.btn_menu_add._opened=false;
		removecss(me._getAnchor('aside_menu'),'menu-is-open');
		removecss(me.btn_menu_add._main,'menu-is-open');
		me.aside_menu._inactivate();
		// ee -for fun
		if(gui.__sound_on){
			gui.frm_main.scrape._play(400,false,Math.random()*3300);
		}
		//
	}
	if(this.btn_menu_main._opened)
	{
		this.btn_menu_main._opened=false;
		removecss(me._getAnchor('aside_main_menu'),'menu-is-open');
		removecss(me.btn_menu_main._main,'menu-is-open');
		me.aside_main_menu._inactivate();
		// ee -for fun
		if(gui.__sound_on){
			gui.frm_main.scrape._play(400,false,Math.random()*3300);
		}
		//
	}
	if(this._getAnchor('usermenu')._opened)
	{
		this.btn_menu_main._opened=false;
		removecss(me._getAnchor('user_menu'),'menu-is-open');
		removecss(me._getAnchor('usermenu'),'menu-is-open');
		//me._getAnchor('usermenu')._inactivate();
		this._getAnchor('usermenu')._opened=false;
		// ee -for fun
		if(gui.__sound_on){
			gui.frm_main.scrape._play(400,false,Math.random()*3300);
		}
		//
	}
}

_me._newAccount=function(type,callback)
{
	var popup=gui._create('popup','obj_popup');
	popup._init({
		fixed:false,
		name:'newaccount',
		heading:{
			value:getLang('generic::create_new_account_'+type)
		},
		footer:'obj_newaccount_footer',
		content:'obj_newaccount'
	});

	popup.content._load(type,callback);
}

_me.__load_default_view = function(e,aData)
{
	aData.parsed_query = {forcedload:true};

	switch (+gui._globalInfo.admintype){
		case USER_WEB:
		case USER_ADMIN:
			aData.parsed_query.menu = 'dashboard';
			break;
		case USER_DOMAIN:
			aData.parsed_query.menu = 'management';
			break;
		default:
			aData.parsed_query.menu = 'spamqueues';
			break;
	}

	log.info('Ready to load default view (domainlist)');
	this.__hash_handler(e,aData);
}

_me._openConsoleDialog=function(who){
	var popup=gui._create('popup','obj_popup');
	popup._init({
		fixed:false,
		name:'consoledialog',
		iwattr:{
			height:'full',
			subtype:'fullscreen'
		},
		heading:{
			value:getLang('main::console')
		},
		footer:false,
		content:'obj_consoledialog'
	});

	popup.content._load(who);
}

_me._initTrialTopbar = function () {
	if (!this.topbar_trial && gui._globalInfo.licence.cloudinfo && !+gui._globalInfo.licence.cloudinfo.cloudplanislive) {
		this._create('topbar_trial', 'obj_topbar_trial', 'topbars', 'topbar');
	}
};

_me._initTopbar = function (tpl) {
	if (this.topbar) {
		this.topbar._destruct();
	}

	this._create('topbar', 'obj_topbar', 'topbars', 'topbar', tpl);
}

_me._applySkin=function(){
	try
	{
		var resources = gui._globalInfo.resources;
		if (resources.layout_settings_admin){
			var body = document.getElementsByTagName('body')[0];
			var title = document.getElementsByTagName('title')[0];

			// skin style
			if (resources.layout_settings_admin.skin_style){
				var ss;
				if ((ss = body.getAttribute('_skin_style')))
					removecss(body,'skin-'+ss);

				ss = resources.layout_settings_admin.skin_style.value || '';
				body.setAttribute('_skin_style', ss);
				addcss(body,'skin-'+ss);
			}

			// title
			if (resources.layout_settings_admin.title){
				log.log(['frmmain-applyskin-title',resources.layout_settings_admin.title.value]);
				if (!helper.trim(resources.layout_settings_admin.title.value || '').length){
					log.log(['frmmain-applyskin-default']);
					title.innerHTML=getLang('loginpage::title_admin');
				}else{
					log.log(['frmmain-applyskin-set']);
					title.innerHTML=helper.htmlspecialchars(resources.layout_settings_admin.title.value);
				}
			}
		}
	}
	catch(e)
	{
		log.error(['frm_main-applyskin',e]);
	}
}

var CoreView = function(controller) {
	this._control = controller;
}
CoreView.prototype.addSaveButton = function() {
	var controller = this._control;
	gui.frm_main.main._setHeadingButton('generic::save',function(){
		controller._save();
	},'button text success');
}
CoreView.prototype.askForSaving = function(continueCallback) {
	var controller = this._control;
	var warning = gui.message.warning(getLang("warning::changes_found"),false,[
		{
			value: getLang("generic::cancel"),
			type: 'text borderless',
			method: 'close'
		},{
			value: getLang("generic::do_not_save"),
			type: 'text error',
			onclick: function(){
				controller._reset();
				warning._close();
				continueCallback();
			}
		},{
			value: getLang("generic::save"),
			type: 'success text',
			onclick: function(){
				controller._save(function(ok){
					if(ok) {
						continueCallback();
					}
				});
				warning._close();
			}
		}
	]);
}
CoreView.prototype.saveNotification = function(successful) {
	if(successful) {
		gui.message.toast(getLang("message::save_successfull"));
	} else {
		gui.message.error(getLang("error::save_unsuccessful"));
	}
}
