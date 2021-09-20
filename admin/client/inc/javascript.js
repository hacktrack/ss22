
/* client/inc/class_errorhandler.js */
var LOGGER_NONE=0;var LOGGER_ERROR=1;var LOGGER_WARNING=2;var LOGGER_NOTICE=3;var LOGGER_LOG=4;var LOGGER_ALL=5;var LOGGER_CONSOLE=0;var LOGGER_ALERT=1;function logger(s){var me=this;if(!s){s={};}
me.settings={verbosity:LOGGER_ALL,type:LOGGER_CONSOLE};for(var key in s){me.settings[key]=s[key];}
me._doit=function(data,type){if(!type||type==0){type=4;}
if(console){if(type<3)
{if(me.settings.type==LOGGER_ALERT){alert(JSON.stringify(data));}}
if(type<3&&console.error){console.error(' ',data);}else if(type<4&&console.info){console.info(data);}else{console.log(data);}}}
me.log=function(data){if(me.settings.verbosity>=LOGGER_LOG){me._doit(data,LOGGER_LOG);}}
me.warning=function(data){if(me.settings.verbosity>=LOGGER_WARNING){me._doit(data,LOGGER_ERROR);}}
me.error=function(data){try
{me._doit(data,LOGGER_ERROR);var str='';if(typeof data=='string'){str=data;}
else if(data[0]&&typeof data[0]=='string'){str=data[0];}
var estr="";var eh=false;if(data[1]&&data[1].message){estr=data[1].message;eh=getLang("error::"+str.replace('e:','').replace(/-/gi,'_'));}else{estr=getLang("error::"+str.replace('e:','').replace(/-/gi,'_'))}
if(str&&str.length>1&&str.substr&&str.substr(0,2)=='e:'){gui.message.error(estr,eh);}}
catch(e)
{gui.message.error(getLang("error::unknown_error"),e.message,false,true);}}
me.info=function(data){if(me.settings.verbosity>=LOGGER_NOTICE){me._doit(data,LOGGER_NOTICE);}}};

/* client/inc/constants_ext.js */
var RIGHTS_HIDE=0;var RIGHTS_READONLY=1;var RIGHTS_FULL=2;var USER_USER=0;var USER_ADMIN=1;var USER_DOMAIN=2;var USER_WEB=3;var RESOURCE_LEVEL_SERVER=0;var RESOURCE_LEVEL_DOMAIN=1;var RESOURCE_LEVEL_ACCOUNT=2;var FORCE_DEFAULT=0;var FORCE_CHECKED=2;var FORCE_UNCHECKED=3;var FORCE_HIDDEN=10;var FORCE_CHECKED_HIDDEN=FORCE_HIDDEN+FORCE_CHECKED;var FORCE_UNCHECKED_HIDDEN=FORCE_HIDDEN+FORCE_UNCHECKED;var READONLY_NONE=0;var READONLY_DOMAIN=1;var READONLY_USER=2;var READONLY_BOTH=3;var CHECKED_NONE=0;var CHECKED_DOMAIN=1;var CHECKED_USER=2;var CHECKED_BOTH=3;var COM_TYPE_SERVER='server';var COM_TYPE_DOMAIN='domain';var COM_TYPE_ACCOUNT='account';var COM_TYPE_STATISTICS='statistics';var OS_TYPE_ACCOUNT=0;var OS_TYPE_DOMAIN=1;var OS_TYPE_SERVER=3;var V_TYPE_BOOLEAN=0;var V_TYPE_INTEGER=1;var V_TYPE_NUMBER=1;var V_TYPE_STRING=2;

/* client/inc/frm_box.js */
_me=frm_box.prototype;function frm_box(){};_me.__constructor=function(s){var me=this;this.left_menu._clean();this.left_menu._hide();this.btn_search_icon._hide();this.btn_search_icon._onclick=function(){addcss(me._getAnchor('topbar'),'active');me.input_search._focus();}
addcss(this._main,'box');this.btn_heading._hide();this.btn_save_2._hide();this._getAnchor('heading_button_mobile').setAttribute('is-hidden',1);this._getAnchor('main_content').setAttribute('scrolltop','onobjectappend');this._iwAttr('type','main');this._add_destructor('__onbeforedestruct');};_me.__onbeforedestruct=function(){}
_me._addClass=function(classname){addcss(this._main,classname);}
_me._removeClass=function(classname){removecss(this._main,classname);}
_me._isFixed=function(bool){if(bool){this._iwAttr('height','full');this._iwAttr('width','large');}else{this._iwAttr('height','');this._iwAttr('width','');}};_me._size=function(size){addcss(this._main,size);if(this._lastSize){removecss(this._main,this._lastSize);}
this._lastSize=size;};_me._getSearch=function(){var str=helper.trim((this.input_search._searchString?this.input_search._searchString:''));return((str!=''&&str!='**')?str:false);}
_me._setSearchString=function(str,keepopen){log.log(['frm_box-setsearchstring',str]);this.input_search._value(helper.trim(str));this.input_search._searchString=helper.trim(str);if(helper.trim(str)!=''||keepopen){addcss(this._getAnchor('topbar'),'active');}else{removecss(this._getAnchor('topbar'),'active');}}
_me._search=function(string)
{if(string){this._setSearchString(string);}
this.btn_close_search._onclick();}
_me._initSearch=function(callback,always_on_top,close_search_callback){var me=this;log.log(['frm_box-initsearch','is callback?',callback]);this.input_search._value('');this.input_search._searchString='';removecss(this._getAnchor('topbar'),'active');this.btn_close_search._onclick=function(){};this.btn_search._onclick=function(){};if(callback){if((!always_on_top&&!close_search_callback)||(always_on_top&&close_search_callback===true))
{this.btn_close_search._onclick=function(){me.input_search._value('');try
{callback('');}
catch(e)
{this._onclick=function(){};}
removecss(me._getAnchor('topbar'),'active');return false;};}
else if(always_on_top&&!close_search_callback)
{this.btn_close_search._hide();}
else if(typeof close_search_callback=='function')
{this.btn_close_search._onclick=close_search_callback;}
else
{log.error(['frmbox-initsearch-typeof',typeof close_search_callback]);}
this.btn_search._onclick=this.input_search._main.parentNode.onsubmit=function(){try
{me.input_search._searchString=me.input_search._value();callback(me.input_search._value());}
catch(e)
{this._onclick=function(){};}
return false;};this.btn_search_icon._show();}else{this.btn_search_icon._hide();}
if(always_on_top){this.btn_search_icon._onclick();}}
_me._setHeadingButton=function(value,callback,classes){if(!value&&!callback&&!classes)
{this.btn_heading._hide();this.btn_save_2._hide();this._getAnchor('heading_button_mobile').setAttribute('is-hidden',1);}
else
{if(!callback){callback=function(){};}
this.btn_heading._value(value);this.btn_heading._onclick=callback;this.btn_heading._show();if(classes){this.btn_heading._main.className=classes+" button box-main-action";}
this._getAnchor('heading_button_mobile').removeAttribute('is-hidden');this.btn_save_2._value(value);this.btn_save_2._onclick=callback;this.btn_save_2._show();if(classes){this.btn_save_2._main.className=classes+" button full";if(classes.search('_noduplicate')>=0){this._getAnchor('heading_button_mobile').setAttribute('is-hidden',1);}else{this._getAnchor('heading_button_mobile').removeAttribute('is-hidden');}}}
return this.btn_heading;}
_me._setBackButton=function(callback,classes){if(!callback)
{this._getAnchor('box_head_back').setAttribute('is-hidden',1);}
else
{this.btn_back._onclick=callback;gui._changeObserver.assignTrigger(this.btn_back);this._getAnchor('box_head_back').removeAttribute('is-hidden');}}
_me._setAlternativeButtons=function(callback){this._alternativeButtons=[];this._getAnchor("heading_buttons_mobile").removeAttribute('is-hidden');callback(this,'heading_buttons');callback(this,'heading_buttons_mobile');}
_me._cleanHeadingButtonsAnchor=function(){this._clean('heading_buttons');this._getAnchor("heading_buttons").innerHTML='';this._clean('heading_buttons_mobile');this._getAnchor("heading_buttons_mobile").innerHTML='';this._getAnchor("heading_buttons_mobile").setAttribute('is-hidden',1);}
_me._init=function(settings,cb){try
{var defaultSettings={name:'default',menu:{hashTemplate:'#menu=/MENU/&account=/ACCOUNT/',items:false},heading:{value:'',button:{value:false,onclick:function(){},class:''},back:{onclick:false,class:''}},footer:false}
settings=helper.mergeDeepArray(defaultSettings,settings);this._cleanHeadingButtonsAnchor();if(!this._leftMenuGenerated||this._leftMenuGenerated!=settings.name||settings.forceload){this._leftMenuGenerated=settings.name;this.left_menu._setName(settings.name);if(settings.menu.hashTemplate){this.left_menu._setHashTemplate(settings.menu.hashTemplate);}
if(settings.menu.items){this.left_menu._fill(settings.menu.items);this.left_menu._show();}else{this.left_menu._clean();this.left_menu._hide();}
this._setHeading((settings.heading.value?settings.heading.value:''));if(settings.heading.button.value&&settings.heading.button.onclick){this._setHeadingButton(settings.heading.button.value,settings.heading.button.onclick,settings.heading.button.class);}
else{}
if(settings.heading.back.onclick){this._setBackButton(settings.heading.back.onclick,settings.heading.back.class);}
else{this._setBackButton();}
if(settings.footer){if(settings.footer=='default'){settings.footer='obj_popup_footer';}
this._draw(settings.footer,'foot',{items:{}});removecss(this._getAnchor('foot'),'hide');}else{addcss(this._getAnchor('foot'),'hide');}}}
catch(e)
{log.error(e);}
this.left_menu.__hash_handler();if(cb){cb(this,this.left_menu);}}
_me._setHeading=function(text){this._getAnchor('heading').innerHTML=helper.htmlspecialchars(text);}
_me.hideContent=function(){this._getAnchor('main_content').style.display='none';}
_me.showContent=function(){this._getAnchor('main_content').style.display='';}
_me._iwAttr=function(arr,val){if(typeof arr!='object'){n={};n[arr]=val;arr=n;}
for(var key in arr){this._main.setAttribute('iw-'+key,arr[key]);}}

/* client/inc/frm_main.js */
_me=frm_main.prototype;function frm_main(){};_me.__constructor=function(s){var me=this;gui._create('hashhandler','obj_hashhandler');storage.library('wm_console');this._lastMenu='';this._asideMenu=[{ignore:!gui._globalInfo.getDomainRights('v_createuser'),name:'new_user',icon:'user',value:'generic::new_user',onclick:function(name){me._newAccount(0);return false;}},{ignore:!gui._globalInfo.getDomainRights('V_CreateGroup'),name:'new_group',icon:'collaboration',value:'generic::new_group',onclick:function(name){me._newAccount(7);return false;}},{ignore:!gui._globalInfo.getDomainRights('V_CreateMailingList'),name:'new_mailing_list',icon:'mailing-list',value:'generic::new_mailing_list',onclick:function(name){me._newAccount(1);return false;}},{ignore:!gui._globalInfo.getDomainRights('V_CreateResource'),name:'new_resource',icon:'resources',value:'generic::new_resource',onclick:function(name){me._newAccount(8);return false;}},{ignore:!gui._globalInfo.getDomainRights('V_CreateDomain'),name:'new_domain',icon:'server',value:'generic::new_domain',onclick:function(name){me._newAccount('d');return false;}}];this._asideMainMenu=[];if(gui._globalInfo.admintype==USER_ADMIN||gui._globalInfo.admintype==USER_WEB){this._asideMainMenu.push({name:'dashboard',icon:'dashboard',value:'main::dashboard',onclick:function(name){me._onouterclick();location.hash='menu=dashboard';return false;}});}
if(gui._globalInfo.admintype!=USER_USER){this._asideMainMenu.push({name:'home',icon:'server',value:'main::management',onclick:function(name){gui._globalInfo.ignoreSingleDomain=true;me._onouterclick();location.hash='menu=management';return false;}});}
if(gui._globalInfo.getServerRights('V_SpamQueues')){this._asideMainMenu.push({name:'spam_queues',icon:'spam',value:'main::spam_queues',onclick:function(name){me._onouterclick();location.hash='menu=spamqueues';return false;}});}
if(gui._globalInfo.admintype==USER_ADMIN||gui._globalInfo.admintype==USER_WEB){this._asideMainMenu.push({name:'whitelabeling',icon:'documents',value:'main::white_labeling',onclick:function(name){me._onouterclick();location.hash='menu=whitelabeling';return false;}});}
if(gui._globalInfo.admintype==USER_ADMIN||gui._globalInfo.admintype==USER_WEB){this._asideMainMenu.push({name:'server_settings',icon:'settings',value:'main::server_settings',onclick:function(name){me._onouterclick();location.hash='menu=server_settings';return false;}});}
if(gui._globalInfo.admintype!=USER_USER){this._asideMainMenu.push({name:'api_console',icon:'terminal',value:'main::console',onclick:function(name){if(gui.__sound_on){gui.frm_main.scrape._play(1000);}
var who=false;if(location.parsed_query.account){who=location.parsed_query.account}else if(location.parsed_query.domain){who=location.parsed_query.domain;}
me._openConsoleDialog(who);me._onouterclick();return false;}});}
this._userMenu=[];this._userMenu.push({name:'logout',value:'main::logout',onclick:function(name){me._onouterclick();me.__logout();return false;}});gui.hashhandler._obeyEvent('onchange',[this,'__hash_handler']);storage.library('obj_message');storage.library('wm_console');storage.library('obj_accountpicker');me._applySkin();this._draw('frm_main','main',{cloudserver:gui._globalInfo.licence.iscloud==1&&gui._globalInfo.licence.cloudinfo&&gui._globalInfo.licence.cloudinfo.cloudhostname});me._fillUsermenu();com.console.item(function(data){data=data.Array.IQ[0];if(data.ATTRIBUTES.TYPE=='result'){try
{gui._globalInfo.webmail_url=data.QUERY[0].RESULT[0].ITEM[0].PROPERTYVAL[0].VAL[0].VALUE;me._userMenu.unshift({name:'webclient',value:'main::webclient',href:helper.trim(gui._globalInfo.webmail_url,'/')+'/?sid='+dataSet.get('main',['sid'])+'&from=WebAdmin&language='+(storage.aStorage.language._ACTIVE_LANG||'en'),onclick:function(name){me._onouterclick();return false;}});if((gui._globalInfo.admintype==USER_ADMIN||gui._globalInfo.admintype==USER_WEB)&&(gui._globalInfo.licence.iscloud==1||(gui._globalInfo.licence.licensetype=="saas"&&gui._globalInfo.licence.cloudinfo&&+gui._globalInfo.licence.cloudinfo.cloudshowprice))){me._userMenu.unshift({name:'subscription',icon:"subscription",value:'main::subscription',onclick:function(){location.hash="menu=subscription";me._onouterclick();return false;}});}
if(gui._globalInfo.admintype==USER_ADMIN||gui._globalInfo.admintype==USER_WEB){me._userMenu.unshift({name:'support',value:'main::support',onclick:function(name){me._onouterclick();com.licence.manage('SupportPortal',function(link){var win=window.open(link,'_blank');if(!win){location.href=link;}});return false;}});}
if(gui._globalInfo.admintype!=USER_USER){me._userMenu.unshift({name:'account_settings',icon:"user",value:'main::account_settings',onclick:function(name){location.hash="menu=accountdetail&account="+encodeURIComponent(gui._globalInfo.email)+"&type=0";me._onouterclick();return false;}});}
if(gui._globalInfo.admintype==USER_USER){me._userMenu.unshift({name:'change_password',icon:'user',value:'accountdetail::change_password',onclick:function(){var popup=gui._create('popup','obj_popup');popup._init({name:'changepassword',heading:{value:getLang('accountdetail::change_password')},fixed:false,footer:'obj_accountinfo_changepwd_footer',content:'obj_changepwd'});popup.content._load();me._onouterclick();return false;}});}
me._userMenu.push({name:'night_mode',value:'main::night_mode',icon:'star',onclick:function(){if(NightMode().init){NightMode().reset();Cookies.set('night_mode',0);}else{NightMode().activate();Cookies.set('night_mode',1);}
return false;}});if(!me.user_menu){me._clean('user_menu');log.info(me._create('user_menu','obj_tabmenu','user_menu'));me.user_menu._iwAttr('type','tab');me.user_menu._iwAttr('location','main');}
me.user_menu._fill(me._userMenu);me.user_menu._main.addEventListener('click',preventLeavingWithoutSaving,true);}
catch(e)
{log.error(['cannot-get-data-from-server',e]);}}else{log.error(['e:cannot-get-data-from-server','c_webmail_url']);}}).server('c_webmail_url');if(!this.aside_menu){this._clean('aside_menu');this._create('aside_menu','obj_tabmenu','aside_menu');this.aside_menu._addcss('dark');this.aside_menu._iwAttr('type','tab');this.aside_menu._iwAttr('location','main');}
this.aside_menu._fill(this._asideMenu);if(!gui._globalInfo.getDomainRights('v_createuser')&&!gui._globalInfo.getDomainRights('V_CreateGroup')&&!gui._globalInfo.getDomainRights('V_CreateMailingList')){this.btn_menu_add._disabled(true);}
if(!this.aside_main_menu){this._clean('aside_main_menu');this._create('aside_main_menu','obj_tabmenu','aside_main_menu');this.aside_main_menu._addcss('dark');this.aside_main_menu._iwAttr('type','tab');this.aside_main_menu._iwAttr('location','main');}
this.aside_main_menu._fill(this._asideMainMenu);this.btn_search_icon._onclick=function(){me._searchHideResultCount();addcss(me._getAnchor('topbar'),'active');me.input_search._focus();};this._getAnchor('aside_menu').onmouseup=function(e){e.preventDefault();e.cancelBubble=true;return false;};this._getAnchor('aside_main_menu').onmouseup=function(e){e.preventDefault();e.cancelBubble=true;return false;};this.btn_menu_add._main.onmouseup=function(e){e.preventDefault();e.cancelBubble=true;return false;}
this._getAnchor('usermenu').onmouseup=function(e){e.preventDefault();e.cancelBubble=true;return false;}
this.btn_menu_main._main.onmouseup=function(e){e.preventDefault();e.cancelBubble=true;return false;}
this.btn_menu_home._onclick=function(){me._onouterclick();if(!location.parsed_query.menu){location.reload()}else{location.hash='';}}
this.btn_menu_main._onclick=function(){if(!this._opened)
{me._onouterclick();this._opened=true;addcss(me._getAnchor('aside_main_menu'),'menu-is-open');addcss(me.btn_menu_main._main,'menu-is-open');if(gui.__sound_on){gui.frm_main.impact._play(false,150);}}
else
{me._onouterclick();}}
this.btn_menu_add._onclick=function(){if(!this._opened)
{me._onouterclick();this._opened=true;addcss(me._getAnchor('aside_menu'),'menu-is-open');addcss(me.btn_menu_add._main,'menu-is-open');if(gui.__sound_on){gui.frm_main.impact._play(false,150);}}
else
{me._onouterclick();}}
this._getAnchor('usermenu').onclick=function(){if(!this._opened)
{me._onouterclick();this._opened=true;addcss(me._getAnchor('user_menu'),'menu-is-open');addcss(me._getAnchor('usermenu'),'menu-is-open');if(gui.__sound_on){gui.frm_main.impact._play(false,150);}}
else
{me._onouterclick();}}
var preventLeavingWithoutSaving=function(e){var content=me.main._getAnchor('main_content').firstElementChild.id.split('.');content=content[content.length-1];log.info('Leaving',content);content=me.main[content];if(content&&content._issaved&&!content._issaved()){e.stopPropagation();content._view.askForSaving(function(){e.target.click();});}}
this.main.btn_back._main.addEventListener('click',preventLeavingWithoutSaving,true);this.main.left_menu._main.addEventListener('click',preventLeavingWithoutSaving,true);this.aside_main_menu._main.addEventListener('click',preventLeavingWithoutSaving,true);if(!gui.hashhandler._force_changed()){this.__load_default_view({},{});}else{log.info('Object should be loaded according to hash');}
gui._obeyEvent('mouseup',[this,'_onouterclick']);gui._obeyEvent('blur',[this,'_onouterclick']);this._add_destructor('__onbeforedestruct');gui._changeObserver.assignTrigger(me.btn_menu_home);if(Cookies.get('night_mode')==1){NightMode().activate();}};_me._fillUsermenu=function(){var me=this;try
{me._getAnchor("usermenu_name").innerHTML=helper.htmlspecialchars(gui._globalInfo.fullname);me._getAnchor("usermenu_email").innerHTML=helper.htmlspecialchars(gui._globalInfo.email);if(gui._globalInfo.userimage){me._getAnchor("usermenu_image").style.backgroundImage="url("+helper.htmlspecialchars(gui._globalInfo.userimage)+")";}
var rank=me._getAnchor("usermenu_rank");removecss(rank,"subtype_0");removecss(rank,"subtype_1");removecss(rank,"subtype_2");removecss(rank,"subtype_3");addcss(rank,"subtype_"+gui._globalInfo.admintype);}
catch(e)
{log.error(['frmmain-fillusermenu',e]);}}
_me.__logout=function()
{logout();}
_me._getSearch=function(){var str=helper.trim(this.input_search._value());return((str!=''&&str!='**')?str:false);}
_me._setSearchString=function(str,keepopen){log.log(['frm_main-setsearchstring',str]);this.input_search._value(helper.trim(str));if(helper.trim(str)!=''||keepopen){addcss(this._getAnchor('topbar'),'active');}else{removecss(this._getAnchor('topbar'),'active');}}
_me._setSearchResults=function(number){this._getAnchor('search_results').innerHTML=number;this._searchShowResultCount();}
_me._searchShowResultCount=function(){var me=this;if(me.input_search._value()!=''){addcss(me.input_search.__eIN,'has-info');me.input_search.__hasinfo=true;me._getAnchor('search_query').innerHTML=helper.htmlspecialchars(me.input_search._value());}}
_me._searchHideResultCount=function(){var me=this;me.input_search.__hasinfo=false;removecss(me.input_search.__eIN,'has-info');}
_me._search=function(string)
{if(string){this._setSearchString(string);}
this.btn_close_search._onclick();}
_me._initSearch=function(callback,showResults){var me=this;this.input_search._value('');removecss(this._getAnchor('topbar'),'active');this.btn_close_search._onclick=function(){};this.btn_search._onclick=function(){};this.input_search._onkeypress=function(e){if(me.input_search.__hasinfo&&e.keyCode!=13){me._searchHideResultCount();}}
if(callback){this.btn_close_search._onclick=function(){me._searchHideResultCount();me.input_search._value('');try
{callback('');}
catch(e)
{this._onclick=function(){};}
removecss(me._getAnchor('topbar'),'active');return false;};this.btn_search._onclick=this.input_search._main.parentNode.onsubmit=function(){try
{callback(me.input_search._value());}
catch(e)
{log.error(['frmmain-search-onclick',e])
this._onclick=function(){};}
return false;};this.btn_search_icon._disabled(false);}else{this.btn_search_icon._disabled(true);}}
_me.__hash_handler=function(e,aData)
{var me=this;gui.__sound_on=!!+Cookies.get('waso');if(location.parsed_query.sound){gui.__sound_on=!!+location.parsed_query.sound;Cookies.set('waso',+gui.__sound_on);}
if(location.parsed_query.bubbles&&location.parsed_query.bubbles==1&&!me.bubbles){me._create('bubbles','fun_bubbles');me.bubbles._play();}
if(gui.__sound_on&&!me.__sound_active){me.__sound_active=true;me._create('scrape','obj_audio');gui.frm_main.scrape._addSource('client/skins/default/sound/scrape.mp3');gui.frm_main.scrape._addSource('client/skins/default/sound/scrape.ogg');me._create('impact','obj_audio');gui.frm_main.impact._addSource('client/skins/default/sound/impact1.mp3');gui.frm_main.impact._addSource('client/skins/default/sound/impact1.ogg');me._create('impact3','obj_audio');gui.frm_main.impact3._addSource('client/skins/default/sound/impact3.mp3');gui.frm_main.impact3._addSource('client/skins/default/sound/impact3.ogg');me._create('kaboom','obj_audio');gui.frm_main.kaboom._addSource('client/skins/default/sound/kaboom6.mp3');gui.frm_main.kaboom._addSource('client/skins/default/sound/kaboom6.ogg');me._create('win','obj_audio');gui.frm_main.win._addSource('client/skins/default/sound/win.mp3');gui.frm_main.win._addSource('client/skins/default/sound/win.ogg');me._create('bubble','obj_audio');gui.frm_main.bubble._addSource('client/skins/default/sound/bubble.mp3');gui.frm_main.bubble._addSource('client/skins/default/sound/bubble.ogg');}
if(gui._globalInfo.admintype!=USER_ADMIN&&gui._globalInfo.admintype!=USER_WEB&&!location.parsed_query.domain&&!location.parsed_query.account){me.aside_main_menu._disableTab('api_console');}else{me.aside_main_menu._enableTab('api_console');}
this._initTrialTopbar();this._initTopbar();try
{if(aData.parsed_query.menu)
{log.info('before init search and clean box-frm_main');gui.frm_main._initSearch();if(!this._lastMenu!=aData.parsed_query.menu){this._lastMenu=aData.parsed_query.menu;this.main._clean('box');this.main._setHeadingButton();log.info(['box cleaned-frm_main',aData.parsed_query.menu]);}
log.info('after clean box-frm_main');this._getAnchor('main_box').removeAttribute('iw-type');this.main._isFixed(true);removecss(this.main._getAnchor('main_content'),'no-padding');switch(aData.parsed_query.menu)
{case"demo":if(!this.main.demo){this.main._clean('main_content');this.main._create('demo','obj_demo','main_content');}
this.main.demo._hash_handler(e,aData);break;case"management":this.main._clean('main_content');this.main._create('management','obj_management','main_content');this.main.management._hash_handler(e,aData);break;case"dashboard":this._getAnchor('main_box').setAttribute('iw-type','multi');this.main._isFixed(false);addcss(this.main._getAnchor('main_content'),'no-padding');this.main._clean('main_content');this.main._create('dashboard','obj_dashboard','main_content');this.main.dashboard._hash_handler(e,aData);break;case"domaindetail":com.console.item(function(result){global._accounts_global_domains_usediskquota=false;global._accounts_global_domains_usedomainlimits=false;var d=result.Array.IQ[0].QUERY[0].RESULT[0].ITEM;for(var i=0;i<d.length;i++){var v=result.Array.IQ[0].QUERY[0].RESULT[0].ITEM[i].PROPERTYVAL[0];var n=result.Array.IQ[0].QUERY[0].RESULT[0].ITEM[i].APIPROPERTY[0];if(v.VAL&&v.VAL[0]&&v.VAL[0].VALUE){global[n.PROPNAME[0].VALUE.substr(1,n.PROPNAME[0].VALUE.length-1)]=(v.VAL[0].VALUE=='1'?true:false);}}
if(!me.main.domaindetail){me.main._clean('box');me.main._create('domaindetail','obj_domaindetail','box');}
me.main.domaindetail._hash_handler(e,aData);}).server(['c_accounts_global_domains_usediskquota','c_accounts_global_domains_usedomainlimits','c_accounts_global_domains_useexpiration']);break;case"accountdetail":if(!this.main.accountdetail){this.main._clean('box');this.main._create('accountdetail','obj_accountdetail','box');}
this.main.accountdetail._hash_handler(e,aData);break;case"devicedetail":if(!this.main.devicedetail){this.main._clean('box');this.main._create('devicedetail','obj_devicedetail','box');}
this.main.devicedetail._hash_handler(e,aData);break;case"spamqueues":this.main._clean('main_content');this.main._create('spamqueues','obj_spamqueues','main_content');this.main.spamqueues._hash_handler(e,aData);break;case"whitelabeling":this.main._clean('main_content');this.main._create('whitelabeling','obj_whitelabeling','main_content');this.main.whitelabeling._hash_handler(e,aData);break;case"content_rules":this.main._clean('main_content');this.main._create('content_rules','obj_content_rules','main_content');this.main.content_rules._hash_handler(e,aData);break;case"server_settings":this.main._clean('main_content');this.main._create('server_settings','obj_server_settings','main_content');this.main.server_settings._hash_handler(e,aData);break;case"certificates":this.main._clean('main_content');this.main._create('certificates','obj_certificates','main_content');this.main.certificates._hash_handler(e,aData);break;case"subscription":this.main._clean('main_content');this.main._create('subscription','obj_subscription','main_content');this.main.subscription._hash_handler(e,aData);break;default:this.__load_default_view(e,aData);break;}
if(gui._globalInfo.passwordexpired==1){gui.message.error(getLang('error::password_expired'),false,[{value:getLang("generic::reset"),onclick:function(closeCallback){closeCallback();var popup=gui._create('popup','obj_popup');popup._init({name:'changepassword',heading:{value:getLang('accountdetail::change_password')},fixed:false,footer:'obj_accountinfo_changepwd_footer',content:"obj_accountinfo_changepwd"});popup.content._load(gui._globalInfo.email);}},{value:getLang("main::logout"),onclick:function(closeCallback){me.__logout();},type:'text error'}]);}}
else
{this.__load_default_view(e,aData);}}
catch(e)
{log.error(e);}}
_me.__onbeforedestruct=function(){gui._disobeyEvent('mouseup',[this,'_onouterclick']);gui._disobeyEvent('blur',[this,'_onouterclick']);};_me._onouterclick=function(){var me=this;if(this.btn_menu_add._opened)
{this.btn_menu_add._opened=false;removecss(me._getAnchor('aside_menu'),'menu-is-open');removecss(me.btn_menu_add._main,'menu-is-open');me.aside_menu._inactivate();if(gui.__sound_on){gui.frm_main.scrape._play(400,false,Math.random()*3300);}}
if(this.btn_menu_main._opened)
{this.btn_menu_main._opened=false;removecss(me._getAnchor('aside_main_menu'),'menu-is-open');removecss(me.btn_menu_main._main,'menu-is-open');me.aside_main_menu._inactivate();if(gui.__sound_on){gui.frm_main.scrape._play(400,false,Math.random()*3300);}}
if(this._getAnchor('usermenu')._opened)
{this.btn_menu_main._opened=false;removecss(me._getAnchor('user_menu'),'menu-is-open');removecss(me._getAnchor('usermenu'),'menu-is-open');this._getAnchor('usermenu')._opened=false;if(gui.__sound_on){gui.frm_main.scrape._play(400,false,Math.random()*3300);}}}
_me._newAccount=function(type,callback)
{var popup=gui._create('popup','obj_popup');popup._init({fixed:false,name:'newaccount',heading:{value:getLang('generic::create_new_account_'+type)},footer:'obj_newaccount_footer',content:'obj_newaccount'});popup.content._load(type,callback);}
_me.__load_default_view=function(e,aData)
{aData.parsed_query={forcedload:true};switch(+gui._globalInfo.admintype){case USER_WEB:case USER_ADMIN:aData.parsed_query.menu='dashboard';break;case USER_DOMAIN:aData.parsed_query.menu='management';break;default:aData.parsed_query.menu='spamqueues';break;}
log.info('Ready to load default view (domainlist)');this.__hash_handler(e,aData);}
_me._openConsoleDialog=function(who){var popup=gui._create('popup','obj_popup');popup._init({fixed:false,name:'consoledialog',iwattr:{height:'full',subtype:'fullscreen'},heading:{value:getLang('main::console')},footer:false,content:'obj_consoledialog'});popup.content._load(who);}
_me._initTrialTopbar=function(){if(!this.topbar_trial&&gui._globalInfo.licence.cloudinfo&&!+gui._globalInfo.licence.cloudinfo.cloudplanislive){this._create('topbar_trial','obj_topbar_trial','topbars','topbar');}};_me._initTopbar=function(tpl){if(this.topbar){this.topbar._destruct();}
this._create('topbar','obj_topbar','topbars','topbar',tpl);}
_me._applySkin=function(){try
{var resources=gui._globalInfo.resources;if(resources.layout_settings_admin){var body=document.getElementsByTagName('body')[0];var title=document.getElementsByTagName('title')[0];if(resources.layout_settings_admin.skin_style){var ss;if((ss=body.getAttribute('_skin_style')))
removecss(body,'skin-'+ss);ss=resources.layout_settings_admin.skin_style.value||'';body.setAttribute('_skin_style',ss);addcss(body,'skin-'+ss);}
if(resources.layout_settings_admin.title){log.log(['frmmain-applyskin-title',resources.layout_settings_admin.title.value]);if(!helper.trim(resources.layout_settings_admin.title.value||'').length){log.log(['frmmain-applyskin-default']);title.innerHTML=getLang('loginpage::title_admin');}else{log.log(['frmmain-applyskin-set']);title.innerHTML=helper.htmlspecialchars(resources.layout_settings_admin.title.value);}}}}
catch(e)
{log.error(['frm_main-applyskin',e]);}}
var CoreView=function(controller){this._control=controller;}
CoreView.prototype.addSaveButton=function(){var controller=this._control;gui.frm_main.main._setHeadingButton('generic::save',function(){controller._save();},'button text success');}
CoreView.prototype.askForSaving=function(continueCallback){var controller=this._control;var warning=gui.message.warning(getLang("warning::changes_found"),false,[{value:getLang("generic::cancel"),type:'text borderless',method:'close'},{value:getLang("generic::do_not_save"),type:'text error',onclick:function(){controller._reset();warning._close();continueCallback();}},{value:getLang("generic::save"),type:'success text',onclick:function(){controller._save(function(ok){if(ok){continueCallback();}});warning._close();}}]);}
CoreView.prototype.saveNotification=function(successful){if(successful){gui.message.toast(getLang("message::save_successfull"));}else{gui.message.error(getLang("error::save_unsuccessful"));}}

/* client/inc/fun_bubbles.js */
function fun_bubbles(){};_me=fun_bubbles.prototype;_me.__constructor=function(){};_me._init=function(){var bubblesScore=document.createElement('div');bubblesScore.setAttribute('id','bubblesScore');bubblesScore.classList.add('bubbles_element');document.body.appendChild(bubblesScore);this._bubblesScore=bubblesScore;this._score=0;this._maxScore=0;this._create('kaboom','obj_audio');this.kaboom._addSource('client/skins/default/sound/kaboom6.mp3');this.kaboom._addSource('client/skins/default/sound/kaboom6.ogg');}
_me._setScore=function(score,plus){if(plus){score+=this._score;}
if(score>this._maxScore){this._maxScore=score;}else if(this._maxScore-score>this._maxScore*0.08){this._end();}
this._bubblesScore.textContent=this._score=score;}
_me._end=function(){var bubblesResult=document.createElement('div');bubblesResult.setAttribute('id','bubbles_result');bubblesResult.classList.add('bubbles_element');bubblesResult.textContent=this._maxScore;document.body.appendChild(bubblesResult);this._drawTimeout&&clearTimeout(this._drawTimeout);this._sparkInterval&&clearInterval(this._sparkInterval);this._bubblesScore.parentNode.removeChild(this._bubblesScore);[].forEach.call(document.querySelectorAll('.spark'),function(spark){spark.classList.add('end');});setTimeout(function(){[].forEach.call(document.querySelectorAll('.spark'),function(spark){spark.classList.add('end');});},100);setTimeout(function(){bubblesResult.style.opacity=0.5;bubblesResult.style.cursor='pointer';bubblesResult.addEventListener('click',function(event){event.preventDefault();[].forEach.call(document.querySelectorAll('.bubbles_element'),function(element){element.parentNode.removeChild(element);});});},2000);}
_me._play=function(){if(this._sparkInterval){return;}
if(this._score===void 0){this._init();}
this._sparkInterval=setInterval(function(){var ra=Math.floor(Math.random()*3000-(this._score*10)+5000);if(ra<3000){ra=3000;}
var size=Math.floor(Math.random()*5+1);var opacity=Math.max(.15,Math.random()-.4);var points=Math.round((((8000-ra)*(7-size))*(2-opacity))/1000)+1;var spark=document.createElement('div');spark.classList.add('spark');spark.classList.add('bubbles_element');spark.textContent=points;spark.style.opacity=opacity;spark.style.lineHeight='50px';spark.style.transform='scale('+size+')';spark.style.transition='opacity '+(ra/1000)+'s linear, transform '+(ra/1000)+'s linear';spark.addEventListener('mousedown',this._pop.bind(this));spark.addEventListener('touchstart',this._pop.bind(this));document.body.appendChild(spark);this._setScore(Math.round(-this._score/50),true);this._drawTimeout=setTimeout(function(){spark.style.bottom='-100px';spark.style.left=(Math.random()*100)+'%';spark.style.transform='translateY(-2000px)';},200);setTimeout(function(){spark.remove()},ra);}.bind(this),800);}
_me._pop=function(event){var target=event.target;var points=+target.textContent;event.preventDefault;this._setScore(points,true);this.kaboom._play();target.style.backgroundColor='red';target.style.transform='scale(4)';target.style.opacity=0;target.style.transitionDuration='0.5s';target.style.pointerEvents='none';console.log(points,this._score);};

/* client/inc/global_ext.js */
var global={};global.responseErrorHandler=function(error){if(error=='account_invalid'||error=='domain_invalid'){location.hash='#';}else{log.error('e:'+error);}}
global.setRight=function(me,right,elements,wrapper_type,override){if(typeof override=='number'){if(right>override){right=override;}}
if(!wrapper_type){wrapper_type='fi';}else{wrapper_type='fb';}
if(typeof elements!='object'||typeof elements[0]=='undefined'){elements=[elements];}
log.log(['global-setright',elements.length,elements]);for(var i=0;i<elements.length;i++)
{var o=elements[i];log.log(['global-setright-2',o]);if(typeof o=='object'){if(o.element)
{o=o.element;wrapper=o.wrapper;}
else
{o=o._name;var wrapper=elements[i]._name.split('_');wrapper[0]=wrapper_type;wrapper=wrapper.join('_');}}else{var wrapper=elements[i].split('_');wrapper[0]=wrapper_type;wrapper=wrapper.join('_');}
var a=me._getAnchor(wrapper);var e=me[o];if(!e){log.error('Element "'+o+'" does not exist');return false;}
if(a){if(right==RIGHTS_HIDE){a.setAttribute('is-hidden',1);}}
else{log.error('Rights box for element "'+o+'" not found');}
if(right==RIGHTS_HIDE||right==RIGHTS_READONLY){if(e._readonly){e._readonly(true);log.log('Element "'+o+'" set to readonly');}else{log.error('Element "'+o+'" cannot be set to readonly');}}}}

/* client/inc/helpers_ext.js */
Number.prototype.toTime=function(daySuffix,daysOnly,settings){return this.toString().toTime(daySuffix,daysOnly,settings);}
String.prototype.toTime=function(daySuffix,daysOnly,settings){var sec_num=parseInt(this,10);var days=Math.floor(sec_num/(3600*24));var days_only=Math.round(sec_num/86400,1);var hours=Math.floor((sec_num-(days*3600*24))/3600);var minutes=Math.floor((sec_num-(days*3600*24)-(hours*3600))/60);var seconds=sec_num-(days*3600*24)-(hours*3600)-(minutes*60);if(daysOnly){if(daySuffix)
{if(typeof daySuffix!='object'){daySuffix_use=[daySuffix];}
if(daySuffix[days-1]){daySuffix_use=' '+daySuffix[days-1];}else{daySuffix_use=' '+daySuffix[daySuffix.length-1];}}
if(settings&&settings.lessthanday){if(days_only==0){if(daySuffix)
{if(daySuffix[0]){daySuffix_use=' '+daySuffix[0];}else{daySuffix_use=' '+daySuffix[daySuffix.length-1];}}
return days_only='<1'+(daySuffix_use?daySuffix_use:'d');}}
return days_only+(daySuffix_use?daySuffix_use:'d');}
if(hours<10){hours="0"+hours;}
if(minutes<10){minutes="0"+minutes;}
if(seconds<10){seconds="0"+seconds;}
if(days>0){if(typeof daySuffix=='object'){if(daySuffix[days-1]){daySuffix_use=' '+daySuffix[days-1];}else{daySuffix_use=' '+daySuffix[daySuffix.length-1];}}
var time=days+(daySuffix_use?daySuffix_use:'d')+" "+hours+':'+minutes+':'+seconds;}else{var time=hours+':'+minutes+':'+seconds;}
return time;}
var helper={};helper.loadCSSManagedSettings=function(element,property){if(property===void 0){property="font-family";}
if(typeof element=="string"){element=document.getElementById(element);}
if(!element||!getComputedStyle(element).getPropertyValue(property)){return{};}
var sSettings=helper.trim(getComputedStyle(element).getPropertyValue(property),'"\'');log.log(["helpersext-loadCSSManagedSettings",sSettings]);var settings=helper.parse_query(sSettings);log.log(["helpersext-loadCSSManagedSettings",settings]);return settings;}
helper.base64_decode=function(data){var b64='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';var o1,o2,o3,h1,h2,h3,h4,bits,i=0,ac=0,dec='',tmp_arr=[];if(!data){return data;}
data+='';do{h1=b64.indexOf(data.charAt(i++));h2=b64.indexOf(data.charAt(i++));h3=b64.indexOf(data.charAt(i++));h4=b64.indexOf(data.charAt(i++));bits=h1<<18|h2<<12|h3<<6|h4;o1=bits>>16&0xff;o2=bits>>8&0xff;o3=bits&0xff;if(h3==64){tmp_arr[ac++]=String.fromCharCode(o1);}else if(h4==64){tmp_arr[ac++]=String.fromCharCode(o1,o2);}else{tmp_arr[ac++]=String.fromCharCode(o1,o2,o3);}}while(i<data.length);dec=tmp_arr.join('');return dec.replace(/\0+$/,'');}
helper.array_diff=function(arr1){var retArr={},argl=arguments.length,k1='',i=1,k='',arr={};arr1keys:for(k1 in arr1){for(i=1;i<argl;i++){arr=arguments[i];for(k in arr){if(arr[k]===arr1[k1]){continue arr1keys;}}
retArr[k1]=arr1[k1];}}
var a=[];for(var k in retArr){a.push(retArr[k]);}
return a;}
helper.uniqid=function(prefix,more_entropy){if(typeof prefix==='undefined'){prefix='';}
var retId;var formatSeed=function(seed,reqWidth){seed=parseInt(seed,10).toString(16);if(reqWidth<seed.length){return seed.slice(seed.length-reqWidth);}
if(reqWidth>seed.length){return Array(1+(reqWidth-seed.length)).join('0')+seed;}
return seed;};if(!this.php_js){this.php_js={};}
if(!this.php_js.uniqidSeed){this.php_js.uniqidSeed=Math.floor(Math.random()*0x75bcd15);}
this.php_js.uniqidSeed++;retId=prefix;retId+=formatSeed(parseInt(new Date().getTime()/1000,10),8);retId+=formatSeed(this.php_js.uniqidSeed,5);if(more_entropy){retId+=(Math.random()*10).toFixed(8).toString();}
return retId;}
helper.associativeArrayLength=function(arr){var i=0;for(var key in arr){i++;}
return i;}
helper.clone=function(obj){return JSON.parse(JSON.stringify(obj));}
helper.translateHash=function(hash,parameters){if(!parameters&&location.parsed_query){parameters=location.parsed_query;}
var str=hash;for(var key in parameters){str=encodeURIComponent(str.replace('/'+key.toUpperCase()+'/',parameters[key]));}
return str;}
helper.date=function(format,timestamp){var that=this;var jsdate,f;var txt_words=['Sun','Mon','Tues','Wednes','Thurs','Fri','Satur','January','February','March','April','May','June','July','August','September','October','November','December'];var formatChr=/\\?(.?)/gi;var formatChrCb=function(t,s){return f[t]?f[t]():s;};var _pad=function(n,c){n=String(n);while(n.length<c){n='0'+n;}
return n;};f={d:function(){return _pad(f.j(),2);},D:function(){return f.l().slice(0,3);},j:function(){return jsdate.getDate();},l:function(){return txt_words[f.w()]+'day';},N:function(){return f.w()||7;},S:function(){var j=f.j();var i=j%10;if(i<=3&&parseInt((j%100)/10,10)==1){i=0;}
return['st','nd','rd'][i-1]||'th';},w:function(){return jsdate.getDay();},z:function(){var a=new Date(f.Y(),f.n()-1,f.j());var b=new Date(f.Y(),0,1);return Math.round((a-b)/864e5);},W:function(){var a=new Date(f.Y(),f.n()-1,f.j()-f.N()+3);var b=new Date(a.getFullYear(),0,4);return _pad(1+Math.round((a-b)/864e5/7),2);},F:function(){return txt_words[6+f.n()];},m:function(){return _pad(f.n(),2);},M:function(){return f.F().slice(0,3);},n:function(){return jsdate.getMonth()+1;},t:function(){return(new Date(f.Y(),f.n(),0)).getDate();},L:function(){var j=f.Y();return j%4===0&j%100!==0|j%400===0;},o:function(){var n=f.n();var W=f.W();var Y=f.Y();return Y+(n===12&&W<9?1:n===1&&W>9?-1:0);},Y:function(){return jsdate.getFullYear();},y:function(){return f.Y().toString().slice(-2);},a:function(){return jsdate.getHours()>11?'pm':'am';},A:function(){return f.a().toUpperCase();},B:function(){var H=jsdate.getUTCHours()*36e2;var i=jsdate.getUTCMinutes()*60;var s=jsdate.getUTCSeconds();return _pad(Math.floor((H+i+s+36e2)/86.4)%1e3,3);},g:function(){return f.G()%12||12;},G:function(){return jsdate.getHours();},h:function(){return _pad(f.g(),2);},H:function(){return _pad(f.G(),2);},i:function(){return _pad(jsdate.getMinutes(),2);},s:function(){return _pad(jsdate.getSeconds(),2);},u:function(){return _pad(jsdate.getMilliseconds()*1000,6);},e:function(){throw'Not supported (see source code of date() for timezone on how to add support)';},I:function(){var a=new Date(f.Y(),0);var c=Date.UTC(f.Y(),0);var b=new Date(f.Y(),6);var d=Date.UTC(f.Y(),6);return((a-c)!==(b-d))?1:0;},O:function(){var tzo=jsdate.getTimezoneOffset();var a=Math.abs(tzo);return(tzo>0?'-':'+')+_pad(Math.floor(a/60)*100+a%60,4);},P:function(){var O=f.O();return(O.substr(0,3)+':'+O.substr(3,2));},T:function(){return'UTC';},Z:function(){return-jsdate.getTimezoneOffset()*60;},c:function(){return'Y-m-d\\TH:i:sP'.replace(formatChr,formatChrCb);},r:function(){return'D, d M Y H:i:s O'.replace(formatChr,formatChrCb);},U:function(){return jsdate/1000|0;}};this.date=function(format,timestamp){that=this;jsdate=(timestamp===undefined?new Date():(timestamp instanceof Date)?new Date(timestamp):new Date(timestamp*1000));return format.replace(formatChr,formatChrCb);};return this.date(format,timestamp);}
helper.mergeDeepArray=function(destination,source){try
{if(!destination){destination={};}
for(var property in source){if(typeof source[property]!='object'||Array.isArray(source[property]))
{destination[property]=source[property];}
else
{if(!destination[property]){destination[property]={};}
destination[property]=helper.mergeDeepArray(destination[property],source[property]);}}
return destination;}
catch(e){log.error(e);return{};}};helper.htmlspecialchars=function(text){var map={'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'};return text.replace(/[&<>"']/g,function(m){return map[m];});}
helper.getParentByClassName=function(elm,classname)
{if(!elm.parentNode){return false}
var regex=new RegExp("(^|\\s)"+classname+"(\\s|$)");if(regex.test(elm.parentNode.className)){return elm.parentNode;}
return helper.getParentByClassName(elm.parentNode,classname);}
helper.getElementsByClassName=function(elm,classname)
{var elArray=[];var tmp=elm.getElementsByTagName("*");var regex=new RegExp("(^|\\s)"+classname+"(\\s|$)");for(var i=0;i<tmp.length;i++){if(regex.test(tmp[i].className)){elArray.push(tmp[i]);}}
return elArray;};helper.bytes2hr=function(fileSizeInBytes,returnasarray,byteUnits){var i=0;if(!byteUnits){byteUnits=[' B',' kB',' MB',' GB',' TB','PB','EB','ZB','YB'];}
while(fileSizeInBytes>=1024&&byteUnits[i+1])
{fileSizeInBytes=fileSizeInBytes/1024;i++;}
if(returnasarray){return{'unit':i,'size':Math.max(fileSizeInBytes,0).toFixed(2)};}
return Math.max(fileSizeInBytes,0).toFixed(2)+" "+byteUnits[i];}
helper.trim=function(str,charlist){var whitespace,l=0,i=0;str+='';if(!charlist){whitespace=' \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000';}else{charlist+='';whitespace=charlist.replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g,'$1');}
l=str.length;for(i=0;i<l;i++){if(whitespace.indexOf(str.charAt(i))===-1){str=str.substring(i);break;}}
l=str.length;for(i=l-1;i>=0;i--){if(whitespace.indexOf(str.charAt(i))===-1){str=str.substring(0,i+1);break;}}
return whitespace.indexOf(str.charAt(0))===-1?str:'';}
helper.parse_query=function(query_string)
{var argsParsed={};var args=query_string.split('&');argsParsed={};for(i=0;i<args.length;i++)
{arg=decodeURI(args[i]);if(arg.trim()!=''){if(arg.indexOf('=')==-1){argsParsed[arg.trim()]=true;}
else{kvp=arg.split('=');argsParsed[kvp[0].trim()]=decodeURIComponent(kvp[1].trim());}}}
return argsParsed;}
helper.print_r=function(array,return_val){var output='',pad_char=' ',pad_val=4,d=this.window.document,getFuncName=function(fn){var name=(/\W*function\s+([\w\$]+)\s*\(/).exec(fn);if(!name){return'(Anonymous)';}
return name[1];};repeat_char=function(len,pad_char){var str='';for(var i=0;i<len;i++){str+=pad_char;}
return str;};formatArray=function(obj,cur_depth,pad_val,pad_char){if(cur_depth>0){cur_depth++;}
var base_pad=repeat_char(pad_val*cur_depth,pad_char);var thick_pad=repeat_char(pad_val*(cur_depth+1),pad_char);var str='';if(typeof obj==='object'&&obj!==null&&obj.constructor&&getFuncName(obj.constructor)!=='PHPJS_Resource'){str+='Array\n'+base_pad+'(\n';for(var key in obj){if(Object.prototype.toString.call(obj[key])==='[object Array]'){str+=thick_pad+'['+key+'] => '+formatArray(obj[key],cur_depth+1,pad_val,pad_char);}else{str+=thick_pad+'['+key+'] => '+obj[key]+'\n';}}
str+=base_pad+')\n';}else if(obj===null||obj===undefined){str='';}else{str=obj.toString();}
return str;};output=formatArray(array,0,pad_val,pad_char);if(return_val!==true){if(d.body){this.echo(output);}else{try{d=XULDocument;this.echo('<pre xmlns="http://www.w3.org/1999/xhtml" style="white-space:pre;">'+output+'</pre>');}catch(e){this.echo(output);}}
return true;}
return output;}
function md5cycle(x,k){var a=x[0],b=x[1],c=x[2],d=x[3];a=ff(a,b,c,d,k[0],7,-680876936);d=ff(d,a,b,c,k[1],12,-389564586);c=ff(c,d,a,b,k[2],17,606105819);b=ff(b,c,d,a,k[3],22,-1044525330);a=ff(a,b,c,d,k[4],7,-176418897);d=ff(d,a,b,c,k[5],12,1200080426);c=ff(c,d,a,b,k[6],17,-1473231341);b=ff(b,c,d,a,k[7],22,-45705983);a=ff(a,b,c,d,k[8],7,1770035416);d=ff(d,a,b,c,k[9],12,-1958414417);c=ff(c,d,a,b,k[10],17,-42063);b=ff(b,c,d,a,k[11],22,-1990404162);a=ff(a,b,c,d,k[12],7,1804603682);d=ff(d,a,b,c,k[13],12,-40341101);c=ff(c,d,a,b,k[14],17,-1502002290);b=ff(b,c,d,a,k[15],22,1236535329);a=gg(a,b,c,d,k[1],5,-165796510);d=gg(d,a,b,c,k[6],9,-1069501632);c=gg(c,d,a,b,k[11],14,643717713);b=gg(b,c,d,a,k[0],20,-373897302);a=gg(a,b,c,d,k[5],5,-701558691);d=gg(d,a,b,c,k[10],9,38016083);c=gg(c,d,a,b,k[15],14,-660478335);b=gg(b,c,d,a,k[4],20,-405537848);a=gg(a,b,c,d,k[9],5,568446438);d=gg(d,a,b,c,k[14],9,-1019803690);c=gg(c,d,a,b,k[3],14,-187363961);b=gg(b,c,d,a,k[8],20,1163531501);a=gg(a,b,c,d,k[13],5,-1444681467);d=gg(d,a,b,c,k[2],9,-51403784);c=gg(c,d,a,b,k[7],14,1735328473);b=gg(b,c,d,a,k[12],20,-1926607734);a=hh(a,b,c,d,k[5],4,-378558);d=hh(d,a,b,c,k[8],11,-2022574463);c=hh(c,d,a,b,k[11],16,1839030562);b=hh(b,c,d,a,k[14],23,-35309556);a=hh(a,b,c,d,k[1],4,-1530992060);d=hh(d,a,b,c,k[4],11,1272893353);c=hh(c,d,a,b,k[7],16,-155497632);b=hh(b,c,d,a,k[10],23,-1094730640);a=hh(a,b,c,d,k[13],4,681279174);d=hh(d,a,b,c,k[0],11,-358537222);c=hh(c,d,a,b,k[3],16,-722521979);b=hh(b,c,d,a,k[6],23,76029189);a=hh(a,b,c,d,k[9],4,-640364487);d=hh(d,a,b,c,k[12],11,-421815835);c=hh(c,d,a,b,k[15],16,530742520);b=hh(b,c,d,a,k[2],23,-995338651);a=ii(a,b,c,d,k[0],6,-198630844);d=ii(d,a,b,c,k[7],10,1126891415);c=ii(c,d,a,b,k[14],15,-1416354905);b=ii(b,c,d,a,k[5],21,-57434055);a=ii(a,b,c,d,k[12],6,1700485571);d=ii(d,a,b,c,k[3],10,-1894986606);c=ii(c,d,a,b,k[10],15,-1051523);b=ii(b,c,d,a,k[1],21,-2054922799);a=ii(a,b,c,d,k[8],6,1873313359);d=ii(d,a,b,c,k[15],10,-30611744);c=ii(c,d,a,b,k[6],15,-1560198380);b=ii(b,c,d,a,k[13],21,1309151649);a=ii(a,b,c,d,k[4],6,-145523070);d=ii(d,a,b,c,k[11],10,-1120210379);c=ii(c,d,a,b,k[2],15,718787259);b=ii(b,c,d,a,k[9],21,-343485551);x[0]=add32(a,x[0]);x[1]=add32(b,x[1]);x[2]=add32(c,x[2]);x[3]=add32(d,x[3]);}
function cmn(q,a,b,x,s,t){a=add32(add32(a,q),add32(x,t));return add32((a<<s)|(a>>>(32-s)),b);}
function ff(a,b,c,d,x,s,t){return cmn((b&c)|((~b)&d),a,b,x,s,t);}
function gg(a,b,c,d,x,s,t){return cmn((b&d)|(c&(~d)),a,b,x,s,t);}
function hh(a,b,c,d,x,s,t){return cmn(b^c^d,a,b,x,s,t);}
function ii(a,b,c,d,x,s,t){return cmn(c^(b|(~d)),a,b,x,s,t);}
function md51(s){txt='';var n=s.length,state=[1732584193,-271733879,-1732584194,271733878],i;for(i=64;i<=s.length;i+=64){md5cycle(state,md5blk(s.substring(i-64,i)));}
s=s.substring(i-64);var tail=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];for(i=0;i<s.length;i++)
tail[i>>2]|=s.charCodeAt(i)<<((i%4)<<3);tail[i>>2]|=0x80<<((i%4)<<3);if(i>55){md5cycle(state,tail);for(i=0;i<16;i++)tail[i]=0;}
tail[14]=n*8;md5cycle(state,tail);return state;}
function md5blk(s){var md5blks=[],i;for(i=0;i<64;i+=4){md5blks[i>>2]=s.charCodeAt(i)
+(s.charCodeAt(i+1)<<8)
+(s.charCodeAt(i+2)<<16)
+(s.charCodeAt(i+3)<<24);}
return md5blks;}
var hex_chr='0123456789abcdef'.split('');function rhex(n)
{var s='',j=0;for(;j<4;j++)
s+=hex_chr[(n>>(j*8+4))&0x0F]
+hex_chr[(n>>(j*8))&0x0F];return s;}
function hex(x){for(var i=0;i<x.length;i++)
x[i]=rhex(x[i]);return x.join('');}
function md5(s){return hex(md51(s));}
function add32(a,b){return(a+b)&0xFFFFFFFF;}
if(md5('hello')!='5d41402abc4b2a76b9719d911017c592'){function add32(x,y){var lsw=(x&0xFFFF)+(y&0xFFFF),msw=(x>>16)+(y>>16)+(lsw>>16);return(msw<<16)|(lsw&0xFFFF);}}

/* client/inc/markdown.js */
var micromarkdown={useajax:false,regexobject:{headline:/^(\#{1,6})([^\#\n]+)$/m,code:/\s\`\`\`\n?([^`]+)\`\`\`/g,hr:/^(?:([\*\-_] ?)+)\1\1$/gm,lists:/^((\s*((\*|\-)|\d(\.|\))) [^\n]+)\n)+/gm,bolditalic:/(?:([\*_~]{1,3}))([^\*_~\n]+[^\*_~\s])\1/g,links:/!?\[([^\]<>]+)\]\(([^ \)<>]+)( "[^\(\)\"]+")?\)/g,reflinks:/\[([^\]]+)\]\[([^\]]+)\]/g,smlinks:/\@([a-z0-9]{3,})\@(t|gh|fb|gp|adn)/gi,mail:/<(([a-z0-9_\-\.])+\@([a-z0-9_\-\.])+\.([a-z]{2,7}))>/gmi,tables:/\n(([^|\n]+ *\| *)+([^|\n]+\n))((:?\-+:?\|)+(:?\-+:?)*\n)((([^|\n]+ *\| *)+([^|\n]+)\n)+)/g,include:/[\[<]include (\S+) from (https?:\/\/[a-z0-9\.\-]+\.[a-z]{2,9}[a-z0-9\.\-\?\&\/]+)[\]>]/gi,url:/<([a-zA-Z0-9@:%_\+.~#?&\/=]{2,256}\.[a-z]{2,4}\b(\/[\-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)?)>/g,url2:/[ \t\n]([a-zA-Z]{2,16}:\/\/[a-zA-Z0-9@:%_\+.~#?&=]{2,256}.[a-z]{2,4}\b(\/[\-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)?)[ \t\n]/g},codeblocks:{},parse:function(str,strict){'use strict';var line,nstatus=0,status,cel,calign,indent,helper,helper1,helper2,count,repstr,stra,trashgc=[],casca=0,i=0,j=0,crc32str='';str='\n'+str+'\n';if(strict!==true){micromarkdown.regexobject.lists=/^((\s*(\*|\d\.) [^\n]+)\n)+/gm;}
str=str.replace('$&','&#x0024&amp;');str=micromarkdown.trim(str);while((stra=micromarkdown.regexobject.code.exec(str))!==null){crc32str=micromarkdown.crc32(stra[0]);micromarkdown.codeblocks[crc32str]='<code>\n'+micromarkdown.htmlEncode(stra[1]).replace(/\n/gm,'<br/>').replace(/\ /gm,'&nbsp;')+'</code>\n';str=str.replace(stra[0],' §§§'+crc32str+'§§§ ');}
str="\n"+str+"\n";while((stra=micromarkdown.regexobject.headline.exec(str))!==null){count=stra[1].length;str=str.replace(stra[0],'<h'+count+'>'+stra[2]+'</h'+count+'>'+'\n');}
while((stra=micromarkdown.regexobject.lists.exec(str))!==null){casca=0;if((stra[0].trim().substr(0,1)==='*')||(stra[0].trim().substr(0,1)==='-')){repstr='<ul>';}else{repstr='<ol>';}
helper=stra[0].split('\n');helper1=[];status=0;indent=false;for(i=0;i<helper.length;i++){if((line=/^((\s*)((\*|\-)|\d(\.|\))) ([^\n]+))/.exec(helper[i]))!==null){if((line[2]===undefined)||(line[2].length===0)){nstatus=0;}else{if(indent===false){indent=line[2].replace(/\t/,'    ').length;}
nstatus=Math.round(line[2].replace(/\t/,'    ').length/indent);}
while(status>nstatus){repstr+=helper1.pop();status--;casca--;}
while(status<nstatus){if((line[0].trim().substr(0,1)==='*')||(line[0].trim().substr(0,1)==='-')){repstr+='<ul>';helper1.push('</ul>');}else{repstr+='<ol>';helper1.push('</ol>');}
status++;casca++;}
repstr+='<li>'+line[6]+'</li>'+'\n';}}
while(casca>0){repstr+='</ul>';casca--;}
if((stra[0].trim().substr(0,1)==='*')||(stra[0].trim().substr(0,1)==='-')){repstr+='</ul>';}else{repstr+='</ol>';}
str=str.replace(stra[0],repstr+'\n');}
while((stra=micromarkdown.regexobject.tables.exec(str))!==null){repstr='<table><tr>';helper=stra[1].split('|');calign=stra[4].split('|');for(i=0;i<helper.length;i++){if(calign.length<=i){calign.push(0);}else if((calign[i].trimRight().slice(-1)===':')&&(strict!==true)){if(calign[i][0]===':'){calign[i]=3;}else{calign[i]=2;}}else if(strict!==true){if(calign[i][0]===':'){calign[i]=1;}else{calign[i]=0;}}else{calign[i]=0;}}
cel=['<th>','<th align="left">','<th align="right">','<th align="center">'];for(i=0;i<helper.length;i++){repstr+=cel[calign[i]]+helper[i].trim()+'</th>';}
repstr+='</tr>';cel=['<td>','<td align="left">','<td align="right">','<td align="center">'];helper1=stra[7].split('\n');for(i=0;i<helper1.length;i++){helper2=helper1[i].split('|');if(helper2[0].length!==0){while(calign.length<helper2.length){calign.push(0);}
repstr+='<tr>';for(j=0;j<helper2.length;j++){repstr+=cel[calign[j]]+helper2[j].trim()+'</td>';}
repstr+='</tr>'+'\n';}}
repstr+='</table>';str=str.replace(stra[0],repstr);}
for(i=0;i<3;i++){while((stra=micromarkdown.regexobject.bolditalic.exec(str))!==null){repstr=[];if(stra[1]==='~~'){str=str.replace(stra[0],'<del>'+stra[2]+'</del>');}else{switch(stra[1].length){case 1:repstr=['<i>','</i>'];break;case 2:repstr=['<b>','</b>'];break;case 3:repstr=['<i><b>','</b></i>'];break;}
str=str.replace(stra[0],repstr[0]+stra[2]+repstr[1]);}}}
while((stra=micromarkdown.regexobject.links.exec(str))!==null){if(stra[0].substr(0,1)==='!'){str=str.replace(stra[0],'<img src="'+stra[2]+'" alt="'+stra[1]+'" title="'+stra[1]+'" />\n');}else{str=str.replace(stra[0],'<a '+micromarkdown.mmdCSSclass(stra[2],strict)+'href="'+stra[2]+'">'+stra[1]+'</a>\n');}}
while((stra=micromarkdown.regexobject.mail.exec(str))!==null){str=str.replace(stra[0],'<a href="mailto:'+stra[1]+'">'+stra[1]+'</a>');}
while((stra=micromarkdown.regexobject.url.exec(str))!==null){repstr=stra[1];if(repstr.indexOf('://')===-1){repstr='http://'+repstr;}
str=str.replace(stra[0],'<a '+micromarkdown.mmdCSSclass(repstr,strict)+'href="'+repstr+'">'+repstr.replace(/(https:\/\/|http:\/\/|mailto:|ftp:\/\/)/gmi,'')+'</a>');}
while((stra=micromarkdown.regexobject.reflinks.exec(str))!==null){helper1=new RegExp('\\['+stra[2]+'\\]: ?([^ \n]+)',"gi");if((helper=helper1.exec(str))!==null){str=str.replace(stra[0],'<a '+micromarkdown.mmdCSSclass(helper[1],strict)+'href="'+helper[1]+'">'+stra[1]+'</a>');trashgc.push(helper[0]);}}
for(i=0;i<trashgc.length;i++){str=str.replace(trashgc[i],'');}
while((stra=micromarkdown.regexobject.smlinks.exec(str))!==null){switch(stra[2]){case't':repstr='https://twitter.com/'+stra[1];break;case'gh':repstr='https://github.com/'+stra[1];break;case'fb':repstr='https://www.facebook.com/'+stra[1];break;case'gp':repstr='https://plus.google.com/+'+stra[1];break;case'adn':repstr='https://alpha.app.net/'+stra[1];break;}
str=str.replace(stra[0],'<a '+micromarkdown.mmdCSSclass(repstr,strict)+'href="'+repstr+'">'+stra[1]+'</a>');}
while((stra=micromarkdown.regexobject.url2.exec(str))!==null){repstr=stra[1];str=str.replace(stra[0],'<a '+micromarkdown.mmdCSSclass(repstr,strict)+'href="'+repstr+'">'+repstr+'</a>');}
while((stra=micromarkdown.regexobject.hr.exec(str))!==null){str=str.replace(stra[0],'\n<hr/>\n');}
if((micromarkdown.useajax!==false)&&(strict!==true)){while((stra=micromarkdown.regexobject.include.exec(str))!==null){helper=stra[2].replace(/[\.\:\/]+/gm,'');helper1='';if(document.getElementById(helper)){helper1=document.getElementById(helper).innerHTML.trim();}else{micromarkdown.ajax(stra[2]);}
if((stra[1]==='csv')&&(helper1!=='')){helper2={';':[],'\t':[],',':[],'|':[]};helper2[0]=[';','\t',',','|'];helper1=helper1.split('\n');for(j=0;j<helper2[0].length;j++){for(i=0;i<helper1.length;i++){if(i>0){if(helper2[helper2[0][j]]!==false){if((helper2[helper2[0][j]][i]!==helper2[helper2[0][j]][i-1])||(helper2[helper2[0][j]][i]===1)){helper2[helper2[0][j]]=false;}}}}}
if((helper2[';']!==false)||(helper2['\t']!==false)||(helper2[',']!==false)||(helper2['|']!==false)){if(helper2[';']!==false){helper2=';';}else if(helper2['\t']){helper2='\t';}else if(helper2[',']){helper2=',';}else if(helper2['|']){helper2='|';}
repstr='<table>';for(i=0;i<helper1.length;i++){helper=helper1[i].split(helper2);repstr+='<tr>';for(j=0;j<helper.length;j++){repstr+='<td>'+micromarkdown.htmlEncode(helper[j])+'</td>';}
repstr+='</tr>';}
repstr+='</table>';str=str.replace(stra[0],repstr);}else{str=str.replace(stra[0],'<code>'+helper1.join('\n')+'</code>');}}else{str=str.replace(stra[0],'');}}}
str=micromarkdown.trim(str);str=str.replace(/ {2,}[\n]+/gmi,'<br/>');str=str.replace(/[\n]{2,}/gmi,'<br/><br/>');str="\n"+str+"\n";for(var index in micromarkdown.codeblocks){if(micromarkdown.codeblocks.hasOwnProperty(index)){str=str.replace('§§§'+index+'§§§',micromarkdown.codeblocks[index]);}}
str=str.replace('&#x0024&amp;','$&');return micromarkdown.trim(str);},ajax:function(str){'use strict';var xhr;if(document.getElementById(str.replace(/[\.\:\/]+/gm,''))){return false;}
if(window.ActiveXObject){try{xhr=new ActiveXObject("Microsoft.XMLHTTP");}catch(e){xhr=null;return e;}}else{xhr=new XMLHttpRequest();}
xhr.onreadystatechange=function(){if(xhr.readyState===4){var ele=document.createElement('code');ele.innerHTML=xhr.responseText;ele.id=str.replace(/[\.\:\/]+/gm,'');ele.style.display='none';document.getElementsByTagName('body')[0].appendChild(ele);micromarkdown.useajax();}};xhr.open('GET',str,true);xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');xhr.send();},crc32:function(string){"use strict";var crc=0,n,x,i,len,table=["00000000","77073096","EE0E612C","990951BA","076DC419","706AF48F","E963A535","9E6495A3","0EDB8832","79DCB8A4","E0D5E91E","97D2D988","09B64C2B","7EB17CBD","E7B82D07","90BF1D91","1DB71064","6AB020F2","F3B97148","84BE41DE","1ADAD47D","6DDDE4EB","F4D4B551","83D385C7","136C9856","646BA8C0","FD62F97A","8A65C9EC","14015C4F","63066CD9","FA0F3D63","8D080DF5","3B6E20C8","4C69105E","D56041E4","A2677172","3C03E4D1","4B04D447","D20D85FD","A50AB56B","35B5A8FA","42B2986C","DBBBC9D6","ACBCF940","32D86CE3","45DF5C75","DCD60DCF","ABD13D59","26D930AC","51DE003A","C8D75180","BFD06116","21B4F4B5","56B3C423","CFBA9599","B8BDA50F","2802B89E","5F058808","C60CD9B2","B10BE924","2F6F7C87","58684C11","C1611DAB","B6662D3D","76DC4190","01DB7106","98D220BC","EFD5102A","71B18589","06B6B51F","9FBFE4A5","E8B8D433","7807C9A2","0F00F934","9609A88E","E10E9818","7F6A0DBB","086D3D2D","91646C97","E6635C01","6B6B51F4","1C6C6162","856530D8","F262004E","6C0695ED","1B01A57B","8208F4C1","F50FC457","65B0D9C6","12B7E950","8BBEB8EA","FCB9887C","62DD1DDF","15DA2D49","8CD37CF3","FBD44C65","4DB26158","3AB551CE","A3BC0074","D4BB30E2","4ADFA541","3DD895D7","A4D1C46D","D3D6F4FB","4369E96A","346ED9FC","AD678846","DA60B8D0","44042D73","33031DE5","AA0A4C5F","DD0D7CC9","5005713C","270241AA","BE0B1010","C90C2086","5768B525","206F85B3","B966D409","CE61E49F","5EDEF90E","29D9C998","B0D09822","C7D7A8B4","59B33D17","2EB40D81","B7BD5C3B","C0BA6CAD","EDB88320","9ABFB3B6","03B6E20C","74B1D29A","EAD54739","9DD277AF","04DB2615","73DC1683","E3630B12","94643B84","0D6D6A3E","7A6A5AA8","E40ECF0B","9309FF9D","0A00AE27","7D079EB1","F00F9344","8708A3D2","1E01F268","6906C2FE","F762575D","806567CB","196C3671","6E6B06E7","FED41B76","89D32BE0","10DA7A5A","67DD4ACC","F9B9DF6F","8EBEEFF9","17B7BE43","60B08ED5","D6D6A3E8","A1D1937E","38D8C2C4","4FDFF252","D1BB67F1","A6BC5767","3FB506DD","48B2364B","D80D2BDA","AF0A1B4C","36034AF6","41047A60","DF60EFC3","A867DF55","316E8EEF","4669BE79","CB61B38C","BC66831A","256FD2A0","5268E236","CC0C7795","BB0B4703","220216B9","5505262F","C5BA3BBE","B2BD0B28","2BB45A92","5CB36A04","C2D7FFA7","B5D0CF31","2CD99E8B","5BDEAE1D","9B64C2B0","EC63F226","756AA39C","026D930A","9C0906A9","EB0E363F","72076785","05005713","95BF4A82","E2B87A14","7BB12BAE","0CB61B38","92D28E9B","E5D5BE0D","7CDCEFB7","0BDBDF21","86D3D2D4","F1D4E242","68DDB3F8","1FDA836E","81BE16CD","F6B9265B","6FB077E1","18B74777","88085AE6","FF0F6A70","66063BCA","11010B5C","8F659EFF","F862AE69","616BFFD3","166CCF45","A00AE278","D70DD2EE","4E048354","3903B3C2","A7672661","D06016F7","4969474D","3E6E77DB","AED16A4A","D9D65ADC","40DF0B66","37D83BF0","A9BCAE53","DEBB9EC5","47B2CF7F","30B5FFE9","BDBDF21C","CABAC28A","53B39330","24B4A3A6","BAD03605","CDD70693","54DE5729","23D967BF","B3667A2E","C4614AB8","5D681B02","2A6F2B94","B40BBE37","C30C8EA1","5A05DF1B","2D02EF8D"];n=0;x=0;len=string.length;crc=crc^(-1);for(i=0;i<len;i++){n=(crc^string.charCodeAt(i))&0xFF;x="0x"+table[n];crc=(crc>>>8)^x;}
return crc^(-1);},countingChars:function(str,split){'use strict';str=str.split(split);if(typeof str==='object'){return str.length-1;}
return 0;},htmlEncode:function(str){'use strict';var div=document.createElement('div');div.appendChild(document.createTextNode(str));str=div.innerHTML;div=undefined;return str;},htmlDecode:function(text){return text.replace(/&amp;/gi,'&').replace(/&lt;/gi,'<').replace(/&gt;/gi,'>').replace(/&quot;/gi,'"').replace(/&#039;/gi,"'");},trim:function(str,charlist){var whitespace,l=0,i=0;str+='';if(!charlist){whitespace=' \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000';}else{charlist+='';whitespace=charlist.replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g,'$1');}
l=str.length;for(i=0;i<l;i++){if(whitespace.indexOf(str.charAt(i))===-1){str=str.substring(i);break;}}
l=str.length;for(i=l-1;i>=0;i--){if(whitespace.indexOf(str.charAt(i))===-1){str=str.substring(0,i+1);break;}}
return whitespace.indexOf(str.charAt(0))===-1?str:'';},mmdCSSclass:function(str,strict){'use strict';var urlTemp;if((str.indexOf('/')!==-1)&&(strict!==true)){urlTemp=str.split('/');if(urlTemp[1].length===0){urlTemp=urlTemp[2].split('.');}else{urlTemp=urlTemp[0].split('.');}
return'class="mmd_'+urlTemp[urlTemp.length-2].replace(/[^\w\d]/g,'')+urlTemp[urlTemp.length-1]+'" ';}
return'';}};(function(root,factory){"use strict";if(typeof define==='function'&&define.amd){define([],factory);}else if(typeof exports==='object'){module.exports=factory();}else{root.returnExports=factory();}}(this,function(){'use strict';return micromarkdown;}));(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.toMarkdown=f()}})(function(){var define,module,exports;return(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){var toMarkdown;var converters;var mdConverters=require('./lib/md-converters');var gfmConverters=require('./lib/gfm-converters');var collapse=require('collapse-whitespace');var _window=(typeof window!=='undefined'?window:this),_document;if(typeof document==='undefined'){_document=require('jsdom').jsdom();}
else{_document=document;}
function trim(string){return string.replace(/^[ \r\n\t]+|[ \r\n\t]+$/g,'');}
var blocks=['address','article','aside','audio','blockquote','body','canvas','center','dd','dir','div','dl','dt','fieldset','figcaption','figure','footer','form','frameset','h1','h2','h3','h4','h5','h6','header','hgroup','hr','html','isindex','li','main','menu','nav','noframes','noscript','ol','output','p','pre','section','table','tbody','td','tfoot','th','thead','tr','ul'];function isBlock(node){return blocks.indexOf(node.nodeName.toLowerCase())!==-1;}
var voids=['area','base','br','col','command','embed','hr','img','input','keygen','link','meta','param','source','track','wbr'];function isVoid(node){return voids.indexOf(node.nodeName.toLowerCase())!==-1;}
function canParseHtml(){var Parser=_window.DOMParser,canParse=false;try{if(new Parser().parseFromString('','text/html')){canParse=true;}}catch(e){}
return canParse;}
function createHtmlParser(){var Parser=function(){};Parser.prototype.parseFromString=function(string){var newDoc=_document.implementation.createHTMLDocument('');if(string.toLowerCase().indexOf('<!doctype')>-1){newDoc.documentElement.innerHTML=string;}
else{newDoc.body.innerHTML=string;}
return newDoc;};return Parser;}
var HtmlParser=canParseHtml()?_window.DOMParser:createHtmlParser();function htmlToDom(string){var tree=new HtmlParser().parseFromString(string,'text/html');collapse(tree,isBlock);return tree;}
function bfsOrder(node){var inqueue=[node],outqueue=[],elem,children,i;while(inqueue.length>0){elem=inqueue.shift();outqueue.push(elem);children=elem.childNodes;for(i=0;i<children.length;i++){if(children[i].nodeType===1){inqueue.push(children[i]);}}}
outqueue.shift();return outqueue;}
function getContent(node){var text='';for(var i=0;i<node.childNodes.length;i++){if(node.childNodes[i].nodeType===1){text+=node.childNodes[i]._replacement;}
else if(node.childNodes[i].nodeType===3){text+=node.childNodes[i].data;}
else{continue;}}
return text;}
function outer(node,content){return node.cloneNode(false).outerHTML.replace('><','>'+content+'<');}
function canConvert(node,filter){if(typeof filter==='string'){return filter===node.nodeName.toLowerCase();}
if(Array.isArray(filter)){return filter.indexOf(node.nodeName.toLowerCase())!==-1;}
else if(typeof filter==='function'){return filter.call(toMarkdown,node);}
else{throw new TypeError('`filter` needs to be a string, array, or function');}}
function isFlankedByWhitespace(side,node){var sibling,regExp,isFlanked;if(side==='left'){sibling=node.previousSibling;regExp=/ $/;}
else{sibling=node.nextSibling;regExp=/^ /;}
if(sibling){if(sibling.nodeType===3){isFlanked=regExp.test(sibling.nodeValue);}
else if(sibling.nodeType===1&&!isBlock(sibling)){isFlanked=regExp.test(sibling.textContent);}}
return isFlanked;}
function flankingWhitespace(node){var leading='',trailing='';if(!isBlock(node)){var hasLeading=/^[ \r\n\t]/.test(node.innerHTML),hasTrailing=/[ \r\n\t]$/.test(node.innerHTML);if(hasLeading&&!isFlankedByWhitespace('left',node)){leading=' ';}
if(hasTrailing&&!isFlankedByWhitespace('right',node)){trailing=' ';}}
return{leading:leading,trailing:trailing};}
function process(node){var replacement,content=getContent(node);if(!isVoid(node)&&!/A/.test(node.nodeName)&&/^\s*$/i.test(content)){node._replacement='';return;}
for(var i=0;i<converters.length;i++){var converter=converters[i];if(canConvert(node,converter.filter)){if(typeof converter.replacement!=='function'){throw new TypeError('`replacement` needs to be a function that returns a string');}
var whitespace=flankingWhitespace(node);if(whitespace.leading||whitespace.trailing){content=trim(content);}
replacement=whitespace.leading+
converter.replacement.call(toMarkdown,content,node)+
whitespace.trailing;break;}}
node._replacement=replacement;}
toMarkdown=function(input,options){options=options||{};if(typeof input!=='string'){throw new TypeError(input+' is not a string');}
input=input.replace(/(\d+)\. /g,'$1\\. ');var clone=htmlToDom(input).body,nodes=bfsOrder(clone),output;converters=mdConverters.slice(0);if(options.gfm){converters=gfmConverters.concat(converters);}
if(options.converters){converters=options.converters.concat(converters);}
for(var i=nodes.length-1;i>=0;i--){process(nodes[i]);}
output=getContent(clone);return output.replace(/^[\t\r\n]+|[\t\r\n\s]+$/g,'').replace(/\n\s+\n/g,'\n\n').replace(/\n{3,}/g,'\n\n');};toMarkdown.isBlock=isBlock;toMarkdown.isVoid=isVoid;toMarkdown.trim=trim;toMarkdown.outer=outer;module.exports=toMarkdown;},{"./lib/gfm-converters":2,"./lib/md-converters":3,"collapse-whitespace":4,"jsdom":7}],2:[function(require,module,exports){'use strict';function cell(content,node){var index=Array.prototype.indexOf.call(node.parentNode.childNodes,node);var prefix=' ';if(index===0){prefix='| ';}
return prefix+content+' |';}
var highlightRegEx=/highlight highlight-(\S+)/;module.exports=[{filter:'br',replacement:function(){return'\n';}},{filter:['del','s','strike'],replacement:function(content){return'~~'+content+'~~';}},{filter:function(node){return node.type==='checkbox'&&node.parentNode.nodeName==='LI';},replacement:function(content,node){return(node.checked?'[x]':'[ ]')+' ';}},{filter:['th','td'],replacement:function(content,node){return cell(content,node);}},{filter:'tr',replacement:function(content,node){var borderCells='';var alignMap={left:':--',right:'--:',center:':-:'};if(node.parentNode.nodeName==='THEAD'){for(var i=0;i<node.childNodes.length;i++){var align=node.childNodes[i].attributes.align;var border='---';if(align){border=alignMap[align.value]||border;}
borderCells+=cell(border,node.childNodes[i]);}}
return'\n'+content+(borderCells?'\n'+borderCells:'');}},{filter:'table',replacement:function(content){return'\n\n'+content+'\n\n';}},{filter:['thead','tbody','tfoot'],replacement:function(content){return content;}},{filter:function(node){return node.nodeName==='PRE'&&node.firstChild&&node.firstChild.nodeName==='CODE';},replacement:function(content,node){return'\n\n```\n'+node.firstChild.textContent+'\n```\n\n';}},{filter:function(node){return node.nodeName==='PRE'&&node.parentNode.nodeName==='DIV'&&highlightRegEx.test(node.parentNode.className);},replacement:function(content,node){var language=node.parentNode.className.match(highlightRegEx)[1];return'\n\n```'+language+'\n'+node.textContent+'\n```\n\n';}},{filter:function(node){return node.nodeName==='DIV'&&highlightRegEx.test(node.className);},replacement:function(content){return'\n\n'+content+'\n\n';}}];},{}],3:[function(require,module,exports){'use strict';module.exports=[{filter:'p',replacement:function(content){return'\n\n'+content+'\n\n';}},{filter:'br',replacement:function(){return'  \n';}},{filter:['h1','h2','h3','h4','h5','h6'],replacement:function(content,node){var hLevel=node.nodeName.charAt(1);var hPrefix='';for(var i=0;i<hLevel;i++){hPrefix+='#';}
return'\n\n'+hPrefix+' '+content+'\n\n';}},{filter:'hr',replacement:function(){return'\n\n* * *\n\n';}},{filter:['em','i'],replacement:function(content){return'_'+content+'_';}},{filter:['strong','b'],replacement:function(content){return'**'+content+'**';}},{filter:function(node){var hasSiblings=node.previousSibling||node.nextSibling;var isCodeBlock=node.parentNode.nodeName==='PRE'&&!hasSiblings;return node.nodeName==='CODE'&&!isCodeBlock;},replacement:function(content){return'`'+content+'`';}},{filter:function(node){return node.nodeName==='A'&&node.getAttribute('href');},replacement:function(content,node){var titlePart=node.title?' "'+node.title+'"':'';return'['+content+']('+node.getAttribute('href')+titlePart+')';}},{filter:'img',replacement:function(content,node){var alt=node.alt||'';var src=node.getAttribute('src')||'';var title=node.title||'';var titlePart=title?' "'+title+'"':'';return src?'!['+alt+']'+'('+src+titlePart+')':'';}},{filter:function(node){return node.nodeName==='PRE'&&node.firstChild.nodeName==='CODE';},replacement:function(content,node){return'\n\n    '+node.firstChild.textContent.replace(/\n/g,'\n    ')+'\n\n';}},{filter:'blockquote',replacement:function(content){content=this.trim(content);content=content.replace(/\n{3,}/g,'\n\n');content=content.replace(/^/gm,'> ');return'\n\n'+content+'\n\n';}},{filter:'li',replacement:function(content,node){content=content.replace(/^\s+/,'').replace(/\n/gm,'\n    ');var prefix='*   ';var parent=node.parentNode;var index=Array.prototype.indexOf.call(parent.children,node)+1;prefix=/ol/i.test(parent.nodeName)?index+'.  ':'*   ';return prefix+content;}},{filter:['ul','ol'],replacement:function(content,node){var strings=[];for(var i=0;i<node.childNodes.length;i++){strings.push(node.childNodes[i]._replacement);}
if(/li/i.test(node.parentNode.nodeName)){return'\n'+strings.join('\n');}
return'\n\n'+strings.join('\n')+'\n\n';}},{filter:function(node){return this.isBlock(node);},replacement:function(content,node){return'\n\n'+this.outer(node,content)+'\n\n';}},{filter:function(){return true;},replacement:function(content,node){return this.outer(node,content);}}];},{}],4:[function(require,module,exports){'use strict';var voidElements=require('void-elements');Object.keys(voidElements).forEach(function(name){voidElements[name.toUpperCase()]=1;});var blockElements={};require('block-elements').forEach(function(name){blockElements[name.toUpperCase()]=1;});function isBlockElem(node){return!!(node&&blockElements[node.nodeName]);}
function isVoid(node){return!!(node&&voidElements[node.nodeName]);}
function collapseWhitespace(elem,isBlock){if(!elem.firstChild||elem.nodeName==='PRE')return;if(typeof isBlock!=='function'){isBlock=isBlockElem;}
var prevText=null;var prevVoid=false;var prev=null;var node=next(prev,elem);while(node!==elem){if(node.nodeType===3){var text=node.data.replace(/[ \r\n\t]+/g,' ');if((!prevText||/ $/.test(prevText.data))&&!prevVoid&&text[0]===' '){text=text.substr(1);}
if(!text){node=remove(node);continue;}
node.data=text;prevText=node;}else if(node.nodeType===1){if(isBlock(node)||node.nodeName==='BR'){if(prevText){prevText.data=prevText.data.replace(/ $/,'');}
prevText=null;prevVoid=false;}else if(isVoid(node)){prevText=null;prevVoid=true;}}else{node=remove(node);continue;}
var nextNode=next(prev,node);prev=node;node=nextNode;}
if(prevText){prevText.data=prevText.data.replace(/ $/,'');if(!prevText.data){remove(prevText);}}}
function remove(node){var next=node.nextSibling||node.parentNode;node.parentNode.removeChild(node);return next;}
function next(prev,current){if(prev&&prev.parentNode===current||current.nodeName==='PRE'){return current.nextSibling||current.parentNode;}
return current.firstChild||current.nextSibling||current.parentNode;}
module.exports=collapseWhitespace;},{"block-elements":5,"void-elements":6}],5:[function(require,module,exports){module.exports=["address","article","aside","audio","blockquote","canvas","dd","div","dl","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","header","hgroup","hr","main","nav","noscript","ol","output","p","pre","section","table","tfoot","ul","video"];},{}],6:[function(require,module,exports){module.exports={"area":true,"base":true,"br":true,"col":true,"embed":true,"hr":true,"img":true,"input":true,"keygen":true,"link":true,"menuitem":true,"meta":true,"param":true,"source":true,"track":true,"wbr":true};},{}],7:[function(require,module,exports){},{}]},{},[1])(1)});markdown={};markdown.encode=function(text){return micromarkdown.parse(micromarkdown.htmlEncode(text));}
markdown.decode=function(html){return micromarkdown.htmlDecode(toMarkdown(html));}

/* client/inc/natsort.js */
function isWhitespaceChar(a)
{var charCode=a.charCodeAt(0);return charCode<=32?true:false;}
function isDigitChar(a)
{var charCode=a.charCodeAt(0);return(charCode>=48&&charCode<=57)?true:false;}
function compareRight(a,b)
{var ca,cb,bias=0,ia=0,ib=0;for(;;ia++,ib++){ca=a.charAt(ia);cb=b.charAt(ib);if(!isDigitChar(ca)&&!isDigitChar(cb)){return bias;}else if(!isDigitChar(ca)){return-1;}else if(!isDigitChar(cb)){return+1;}else if(ca<cb){if(bias==0){bias=-1;}}else if(ca>cb){if(bias==0)
bias=+1;}else if(ca==0&&cb==0){return bias;}}}
function natcompare(a,b){var ia=0,ib=0;var nza=0,nzb=0;var ca,cb;var result;while(true)
{nza=nzb=0;ca=a.charAt(ia);cb=b.charAt(ib);while(isWhitespaceChar(ca)||ca=='0'){if(ca=='0'){nza++;}else{nza=0;}
ca=a.charAt(++ia);}
while(isWhitespaceChar(cb)||cb=='0'){if(cb=='0'){nzb++;}else{nzb=0;}
cb=b.charAt(++ib);}
if(isDigitChar(ca)&&isDigitChar(cb)){if((result=compareRight(a.substring(ia),b.substring(ib)))!=0){return result;}}
if(ca==0&&cb==0){return nza-nzb;}
if(ca<cb)
return-1;else
if(ca>cb)
return+1;++ia;++ib;}}

/* client/inc/night_mode.js */
function NightMode(target_window){function hexToRgbA(hex){var c;if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){c=hex.substring(1).split('');if(c.length===3){c=[c[0],c[0],c[1],c[1],c[2],c[2]];}
c='0x'+c.join('');return'rgba('+[(c>>16)&255,(c>>8)&255,c&255].join(', ')+', 1)';}
throw new Error('Bad Hex');};function rgbToHsl(input){var r=input[0];var g=input[1];var b=input[2];var a=input[3];r/=255,g/=255,b/=255;var max=Math.max(r,g,b);var min=Math.min(r,g,b);var h,s,l=(max+min)/2;if(max===min){h=s=0;}else{var d=max-min;s=l>0.5?d/(2-max-min):d/(max+min);switch(max){case r:h=(g-b)/d+(g<b?6:0);break;case g:h=(b-r)/d+2;break;case b:h=(r-g)/d+4;break;}
h/=6;}
return a?[h,s,l,a]:[h,s,l];};function hue2rgb(p,q,t){if(t<0)t+=1;if(t>1)t-=1;if(t<1/6)return p+(q-p)*6*t;if(t<1/2)return q;if(t<2/3)return p+(q-p)*(2/3-t)*6;return p;};function hslToRgb(h,s,l){var r,g,b;if(s==0){r=g=b=l;}else{var q=l<0.5?l*(1+s):l+s-l*s;var p=2*l-q;r=hue2rgb(p,q,h+1/3);g=hue2rgb(p,q,h);b=hue2rgb(p,q,h-1/3);}
return[Math.round(r*255),Math.round(g*255),Math.round(b*255)];};function _NightMode(target_document){this.colors={aliceblue:"#f0f8ff",antiquewhite:"#faebd7",aqua:"#00ffff",aquamarine:"#7fffd4",azure:"#f0ffff",beige:"#f5f5dc",bisque:"#ffe4c4",black:"#000000",blanchedalmond:"#ffebcd",blue:"#0000ff",blueviolet:"#8a2be2",brown:"#a52a2a",burlywood:"#deb887",cadetblue:"#5f9ea0",chartreuse:"#7fff00",chocolate:"#d2691e",coral:"#ff7f50",cornflowerblue:"#6495ed",cornsilk:"#fff8dc",crimson:"#dc143c",cyan:"#00ffff",darkblue:"#00008b",darkcyan:"#008b8b",darkgoldenrod:"#b8860b",darkgray:"#a9a9a9",darkgreen:"#006400",darkgrey:"#a9a9a9",darkkhaki:"#bdb76b",darkmagenta:"#8b008b",darkolivegreen:"#556b2f",darkorange:"#ff8c00",darkorchid:"#9932cc",darkred:"#8b0000",darksalmon:"#e9967a",darkseagreen:"#8fbc8f",darkslateblue:"#483d8b",darkslategray:"#2f4f4f",darkslategrey:"#2f4f4f",darkturquoise:"#00ced1",darkviolet:"#9400d3",deeppink:"#ff1493",deepskyblue:"#00bfff",dimgray:"#696969",dimgrey:"#696969",dodgerblue:"#1e90ff",firebrick:"#b22222",floralwhite:"#fffaf0",forestgreen:"#228b22",fuchsia:"#ff00ff",gainsboro:"#dcdcdc",ghostwhite:"#f8f8ff",gold:"#ffd700",goldenrod:"#daa520",gray:"#808080",green:"#008000",greenyellow:"#adff2f",grey:"#808080",honeydew:"#f0fff0",hotpink:"#ff69b4",indianred:"#cd5c5c",indigo:"#4b0082",ivory:"#fffff0",khaki:"#f0e68c",lavender:"#e6e6fa",lavenderblush:"#fff0f5",lawngreen:"#7cfc00",lemonchiffon:"#fffacd",lightblue:"#add8e6",lightcoral:"#f08080",lightcyan:"#e0ffff",lightgoldenrodyellow:"#fafad2",lightgray:"#d3d3d3",lightgreen:"#90ee90",lightgrey:"#d3d3d3",lightpink:"#ffb6c1",lightsalmon:"#ffa07a",lightseagreen:"#20b2aa",lightskyblue:"#87cefa",lightslategray:"#778899",lightslategrey:"#778899",lightsteelblue:"#b0c4de",lightyellow:"#ffffe0",lime:"#00ff00",limegreen:"#32cd32",linen:"#faf0e6",magenta:"#ff00ff",maroon:"#800000",mediumaquamarine:"#66cdaa",mediumblue:"#0000cd",mediumorchid:"#ba55d3",mediumpurple:"#9370db",mediumseagreen:"#3cb371",mediumslateblue:"#7b68ee",mediumspringgreen:"#00fa9a",mediumturquoise:"#48d1cc",mediumvioletred:"#c71585",midnightblue:"#191970",mintcream:"#f5fffa",mistyrose:"#ffe4e1",moccasin:"#ffe4b5",navajowhite:"#ffdead",navy:"#000080",oldlace:"#fdf5e6",olive:"#808000",olivedrab:"#6b8e23",orange:"#ffa500",orangered:"#ff4500",orchid:"#da70d6",palegoldenrod:"#eee8aa",palegreen:"#98fb98",paleturquoise:"#afeeee",palevioletred:"#db7093",papayawhip:"#ffefd5",peachpuff:"#ffdab9",peru:"#cd853f",pink:"#ffc0cb",plum:"#dda0dd",powderblue:"#b0e0e6",purple:"#800080",rebeccapurple:"#663399",red:"#ff0000",rosybrown:"#bc8f8f",royalblue:"#4169e1",saddlebrown:"#8b4513",salmon:"#fa8072",sandybrown:"#f4a460",seagreen:"#2e8b57",seashell:"#fff5ee",sienna:"#a0522d",silver:"#c0c0c0",skyblue:"#87ceeb",slateblue:"#6a5acd",slategray:"#708090",slategrey:"#708090",snow:"#fffafa",springgreen:"#00ff7f",steelblue:"#4682b4",tan:"#d2b48c",teal:"#008080",thistle:"#d8bfd8",tomato:"#ff6347",turquoise:"#40e0d0",violet:"#ee82ee",wheat:"#f5deb3",white:"#ffffff",whitesmoke:"#f5f5f5",yellow:"#ffff00",yellowgreen:"#9acd32"};this.lightness=0.12;this.target_document=target_document||document;this.selector_whitelist=['.preview__card','.preview__input','.preview__input span','.preview__input strong','.preview__text p','.preview__button span','.preview__checkbox','.preview__footer','.preview__footer span','.preview-icechat','.preview-icechat p','.preview-icechat__button','.preview-icechat__button span','.preview-icechat hr','.modal'];this.rgba_regexp=/(rgba?)\((.*?)\)/g;this.rgba_match_regexp=/\d+\.?\d*/g;this.colors_regexp=new RegExp('\\b'+Object.keys(this.colors).join('\\b|\\b')+'\\b','gi');this.original_rules={};this.original_dom_rules={};this.original_dom_rules_counter=0;function walkThruRules(stylesheets,callback,revert){[].forEach.call(stylesheets,function(style){if(revert){style.ownerNode.classList.remove('parsed');}
if(style.ownerNode.classList.contains('parsed')){return;}
try{[].forEach.call(style.cssRules||[],function(rule){try{[].forEach.call(rule.style||[],function(prop){callback(rule,prop);});}catch(e){}});}catch(e){}
if(!revert){style.ownerNode.classList.add('parsed');}});};function inverseDOMStyleProperties(revert){var currentNode;var ni=this.target_document.createNodeIterator(this.target_document.documentElement,NodeFilter.SHOW_ELEMENT,function(){return NodeFilter.FILTER_ACCEPT;},false);var rgba_match_regexp=this.rgba_match_regexp;while(currentNode=ni.nextNode()){[].forEach.call(currentNode.style,function(prop){if(revert){if(this.original_dom_rules[currentNode.id]&&this.original_dom_rules[currentNode.id][prop]){currentNode.style[prop]=this.original_dom_rules[currentNode.id][prop];}}else{var prop_value=currentNode.style.getPropertyValue(prop);prop_value=prop_value.replace(/#[A-Fa-f0-9]{3,6}/,function(hex){return hexToRgbA(hex);}.bind(this));prop_value=prop_value.replace(this.colors_regexp,function(color){return hexToRgbA(this.colors[color]);}.bind(this));if(~prop_value.indexOf('rgb')){if(!currentNode.id){currentNode.id='night_mode_'+this.original_dom_rules_counter++;}
this.original_dom_rules[currentNode.id]=this.original_dom_rules[currentNode.id]||{};this.original_dom_rules[currentNode.id][prop]=prop_value;var value=prop_value.replace(this.rgba_regexp,function(match,g1,g2){var hsl=rgbToHsl(g2.match(rgba_match_regexp));hsl[2]=(1-hsl[2])-(1-2*hsl[2])*this.lightness;rgb=hslToRgb(hsl[0],hsl[1],hsl[2]);return g1+'('+rgb[0]+', '+rgb[1]+', '+rgb[2]+(hsl[3]?', '+hsl[3]:'')+')';}.bind(this));currentNode.style[prop]=value;}}}.bind(this));}};function inverseProperty(rule,prop){var prop_value=rule.style.getPropertyValue(prop);var rgba_match_regexp=this.rgba_match_regexp;prop_value=prop_value.replace(/#[A-Fa-f0-9]{3,6}/,function(hex){return hexToRgbA(hex);}.bind(this));prop_value=prop_value.replace(this.colors_regexp,function(color){return hexToRgbA(this.colors[color]);}.bind(this));if(~prop_value.indexOf('rgb')){if(~this.selector_whitelist.indexOf(rule.selectorText)){return;}
this.original_rules[rule.selectorText]=this.original_rules[rule.selectorText]||{};this.original_rules[rule.selectorText][prop]=prop_value;var value=prop_value.replace(this.rgba_regexp,function(match,g1,g2){var rgb=g2.match(rgba_match_regexp);var hsl=rgbToHsl(rgb);hsl[2]=(1-hsl[2])-(1-2*hsl[2])*this.lightness;rgb=hslToRgb(hsl[0],hsl[1],hsl[2]);return g1+'('+rgb[0]+', '+rgb[1]+', '+rgb[2]+(hsl[3]?', '+hsl[3]:'')+')';}.bind(this));rule.style.setProperty(prop,value,rule.style.getPropertyPriority(prop));}};this.activate=function(lightness,callback){if(this.init&&this.target_document.head.contains(this.init)){callback&&callback();return this;}
this.lightness=lightness||this.lightness;var retries=200;this.retry_interval=setInterval(function(){walkThruRules(this.target_document.styleSheets,function(rule,prop){inverseProperty.call(this,rule,prop);}.bind(this));if(!retries--){clearInterval(this.retry_interval);}}.bind(this),5);this.target_document.body.classList.add('night_mode');inverseDOMStyleProperties.call(this);[].forEach.call(this.target_document.querySelectorAll('iframe'),function(iframe){try{NightMode(iframe.contentWindow).activate();}catch(e){}});this.init=this.target_document.createElement('style');this.init.classList.add('parsed');this.target_document.head.appendChild(this.init);callback&&callback();return this;};this.reset=function(callback){if(!this.init){callback&&callback();return this;}
clearInterval(this.retry_interval);walkThruRules(this.target_document.styleSheets,function(rule,prop){if(~rule.style.getPropertyValue(prop).indexOf('rgb')){this.original_rules[rule.selectorText]&&rule.style.setProperty(prop,this.original_rules[rule.selectorText][prop],rule.style.getPropertyPriority(prop));}}.bind(this),true);inverseDOMStyleProperties.call(this,true);this.init.parentNode.removeChild(this.init);this.original_rules={};this.original_dom_rules={};this.target_document.body.classList.remove('night_mode');[].forEach.call(this.target_document.querySelectorAll('iframe'),function(iframe){try{NightMode(iframe.contentWindow).reset();}catch(e){}});callback&&callback();this.init=null;return this;};return this;};target_window=target_window||window;target_window.NM=target_window.NM||new _NightMode(target_window.document);return target_window.NM;};

/* client/inc/obj_accountcard.js */
function obj_accountcard(){};var _me=obj_accountcard.prototype;_me.__constructor=function(s){var me=this;storage.library('wm_user');this._phoneList=[];this._emailList=[];this._phoneTypes={'hometelephonenumber':getLang("vcard::home1"),'home2telephonenumber':getLang("vcard::home2"),'assistnametelephonenumber':getLang("vcard::assistant"),'businesstelephonenumber':getLang("vcard::work1"),'business2telephonenumber':getLang("vcard::work2"),'homefaxnumber':getLang("vcard::fax_home"),'businessfaxnumber':getLang("vcard::fax_work"),'callbacktelephonenumber':getLang("vcard::callback"),'companymaintelephonenumber':getLang("vcard::company"),'cartelephonenumber':getLang("vcard::car"),'isdnnumber':getLang("vcard::isdn"),'mobiletelephonenumber':getLang("vcard::mobile"),'otherfaxnumber':getLang("vcard::other_fax"),'pagernumber':getLang("vcard::pager"),'primarytelephonenumber':getLang("vcard::primary"),'radiotelephonenumber':getLang("vcard::radio"),'telexnumber':getLang("vcard::telex"),'hearingnumber':getLang("vcard::hearing"),'othernumber':getLang("vcard::sip")};this._emailTypes={'email1address':getLang('vcard::email1'),'email2address':getLang('vcard::email2'),'email3address':getLang('vcard::email3'),'imaddress':getLang('vcard::imaddress')};gui.frm_main.main._setHeadingButton('generic::save',function(){me._save();},'button text success');this._changeObserverID='accountcard';gui._changeObserver.assignListener(this._changeObserverID,function(callback,close){if(callback){close();return me._save(false,callback);}else{return me._save('changed');}});this._add_destructor('__onbeforedestruct');};_me.__onbeforedestruct=function(){gui._changeObserver.clearListener(this._changeObserverID);}
_me._setRight=function(right,element){global.setRight(this,right,element);}
_me._load=function(domain)
{log.log('Load list of users for domain '+domain);var me=this;me._draw('obj_accountcard','',{items:{}});this.button_add_phone._onclick=function(){var type=me.dropdown_phone_type._value();me._addPhone(me.input_card_phone._value(),type,function(elm){var sutype=type.toUpperCase();if(me._card_source.PROPERTYVAL[0][sutype]){elm.__key=sutype;elm.__source=me._card_source.PROPERTYVAL[0][sutype];}else{log.error('type "'+type+'" not supported');}},true);me.input_card_phone._value('');}
this.button_add_email._onclick=function(){me._addEmail(me.input_card_email._value(),me.dropdown_email_type._value(),function(elm){var type=me.dropdown_email_type._value();var sutype=type.toUpperCase();if(type!='')
{if(me._card_source.PROPERTYVAL[0][sutype]){log.log(['sutype exists',sutype]);elm.__key=sutype;elm.__source=me._card_source.PROPERTYVAL[0][sutype];}else{log.error('type "'+type+'" not supported');}}
me.input_card_email._value('');},true);}
this.dropdown_card_gender._fill({'*0':getLang('vcard::unknown'),'*2':getLang('vcard::male'),'*1':getLang('vcard::female')});this.dropdown_phone_type._fill(this._phoneTypes);this.dropdown_email_type._fill(this._emailTypes);var account='';if(location.parsed_query.account){account=location.parsed_query.account;}
com.user.card(account,function(result){var items=[];try
{var items=result.Array.IQ[0].QUERY[0].RESULT[0].ITEM[0].PROPERTYVAL[0];me._card_source=result.Array.IQ[0].QUERY[0].RESULT[0].ITEM[0];if(result.Array.IQ[0].QUERY[0].RESULT[0].ITEM[0].PROPERTYRIGHT[0]){propright=result.Array.IQ[0].QUERY[0].RESULT[0].ITEM[0].PROPERTYRIGHT[0].VALUE;}else{propright=2;}
me._setRight(propright,['input_card_name','input_card_surname','input_card_birthday','dropdown_card_gender','input_card_anniversary','input_card_company','input_card_department','input_card_job','input_card_manager','input_card_assistant',{element:'input_card_website1',wrapper:'fi_card_website'},{element:'input_card_website2',wrapper:'fi_card_website'},'textarea_card_note','input_card_work_street','input_card_work_city','input_card_work_zip','input_card_work_state_county','input_card_work_country','input_card_home_street','input_card_home_city','input_card_home_zip','input_card_home_state_county','input_card_home_country',]);}
catch(e)
{log.error(['e:invalid-data',e]);return false;}
try
{for(var key in items){log.log([key,items[key]]);var bval=false;var sval='';var ival=0;if(items[key][0]&&items[key][0].VALUE){bval=(items[key][0].VALUE?true:false);sval=items[key][0].VALUE;ival=parseInt(items[key][0].VALUE);}
var lkey=key.toLowerCase();switch(lkey){case'firstname':n='input_card_name';me[n].__key=key;me[n].__source=items[key];me[n]._value(sval);break;case'lastname':n='input_card_surname';me[n].__key=key;me[n].__source=items[key];me[n]._value(sval);break;case'companyname':n='input_card_company';me[n].__key=key;me[n].__source=items[key];me[n]._value(sval);break;case'department':n='input_card_department';me[n].__key=key;me[n].__source=items[key];me[n]._value(sval);break;case'jobtitle':n='input_card_job';me[n].__key=key;me[n].__source=items[key];me[n]._value(sval);break;case'managername':n='input_card_manager';me[n].__key=key;me[n].__source=items[key];me[n]._value(sval);break;case'assistantname':n='input_card_assistant';me[n].__key=key;me[n].__source=items[key];me[n]._value(sval);break;case'gender':n='dropdown_card_gender';me[n].__key=key;me[n].__source=items[key];me[n]._value(sval);break;case'webpage':n='input_card_website1';me[n].__key=key;me[n].__source=items[key];me[n]._value(sval);break;case'homepage':n='input_card_website2';me[n].__key=key;me[n].__source=items[key];me[n]._value(sval);break;case'body':n='textarea_card_note';me[n].__key=key;me[n].__source=items[key];me[n]._value(sval);break;case'businessaddressstreet':n='input_card_work_street';me[n].__key=key;me[n].__source=items[key];me[n]._value(sval);break;case'businessaddresscity':n='input_card_work_city';me[n].__key=key;me[n].__source=items[key];me[n]._value(sval);break;case'businessaddresspostalcode':n='input_card_work_zip';me[n].__key=key;me[n].__source=items[key];me[n]._value(sval);break;case'businessaddressstate':n='input_card_work_state_county';me[n].__key=key;me[n].__source=items[key];me[n]._value(sval);break;case'businessaddresscountry':n='input_card_work_country';me[n].__key=key;me[n].__source=items[key];me[n]._value(sval);break;case'homeaddressstreet':n='input_card_home_street';me[n].__key=key;me[n].__source=items[key];me[n]._value(sval);break;case'homeaddresscity':n='input_card_home_city';me[n].__key=key;me[n].__source=items[key];me[n]._value(sval);break;case'homeaddresspostalcode':n='input_card_home_zip';me[n].__key=key;me[n].__source=items[key];me[n]._value(sval);break;case'birthday':n='input_card_birthday';me[n].__key=key;me[n].__source=items[key];if(sval)
me[n]._setUTC(sval);break;case'anniversary':n='input_card_anniversary';me[n].__key=key;me[n].__source=items[key];if(sval)
me[n]._setUTC(sval);break;case'homeaddressstate':n='input_card_home_state_county';me[n].__key=key;me[n].__source=items[key];me[n]._value(sval);break;case'homeaddresscountry':n='input_card_home_country';me[n].__key=key;me[n].__source=items[key];me[n]._value(sval);break;default:if(helper.trim(sval)!=''&&me._phoneTypes[lkey]){me._addPhone(sval,lkey,function(elm){elm.__key=key;elm.__source=items[key];});}else if(helper.trim(sval)!=''&&me._emailTypes[lkey]){me._addEmail(sval,lkey,function(elm){elm.__key=key;elm.__source=items[key];});}
break;}}}
catch(e)
{log.error(['e:invalid-data',e]);}});me._main.onclick=function(e){};}
_me._refreshPhonesDropdown=function(donotempty){var me=this;if(!this.dropdown_phone_type._used){this.dropdown_phone_type._used=[];}
var allowed={};var used=this.dropdown_phone_type._used;var i=0;for(var key in this._phoneTypes){if(used.indexOf(key)<0){i++;allowed[key]=this._phoneTypes[key];}}
if(i==0){this._getAnchor('phones_select').setAttribute('is-hidden',1);this.button_add_phone._hide();}else{this._getAnchor('phones_select').removeAttribute('is-hidden');this.button_add_phone._show();}
this.dropdown_phone_type._fill(allowed);if(i==1&&!donotempty){var type=me.dropdown_phone_type._value();this._addPhone('',this.dropdown_phone_type._value(),function(elm){var sutype=type.toUpperCase();if(me._card_source.PROPERTYVAL[0][sutype]){elm.__key=sutype;elm.__source=me._card_source.PROPERTYVAL[0][sutype];}else{log.error('type "'+type+'" not supported');}});}}
_me._removeEmptyPhones=function(){if(!this._phoneList){this._phoneList=[];}
try
{var l=this._phoneList.length;for(var i=l-1;i>=0;i--){if(helper.trim(this._phoneList[i].object._value())==''){this._removePhone(this._phoneList[i]);}}
this._refreshPhonesDropdown();}
catch(e)
{log.error(e);}}
_me._removePhone=function(phone){if(!this._phoneList){this._phoneList=[];}
for(var i=0;i<this._phoneList.length;i++){if(this._phoneList[i]==phone){this._phoneList.splice(i,1);}}
for(var i=0;i<this.dropdown_phone_type._used.length;i++){if(this.dropdown_phone_type._used[i]==phone.type){this.dropdown_phone_type._used.splice(i,1);}}
phone.object._destruct();phone.box.parentElement.removeChild(phone.box);this._refreshPhonesDropdown(true);}
_me._addPhone=function(value,type,callback,donotclear){if(!this._phonesNum){this._phonesNum=0;}
if(!this._phoneList){this._phoneList=[];}
if(!this.dropdown_phone_type._used){this.dropdown_phone_type._used=[];}
var phoneName='phone_'+type;var phone=this._pathName+'#'+phoneName;if(!this[phoneName])
{log.log(['accountcard-phonename',phoneName]);var elm=mkElement('div',{id:phone});addcss(elm,'form-row');this._getAnchor('phones_values').appendChild(elm);this._create(phoneName,'obj_input_text',phoneName);this.dropdown_phone_type._used.push(type);this[phoneName]._label(this._phoneTypes[type],true);this[phoneName]._placeholder(this.input_card_phone._placeholder(),true);this._phoneList.push({name:phoneName,object:this[phoneName],box:elm,type:type});this._phonesNum++;if(callback){callback(this[phoneName]);}
this._refreshPhonesDropdown();}
if(value){this[phoneName]._value(value,donotclear);}}
_me._refreshEmailsDropdown=function(donotempty){var me=this;if(!this.dropdown_email_type._used){this.dropdown_email_type._used=[];}
var allowed={};var used=this.dropdown_email_type._used;var i=0;for(var key in this._emailTypes){if(used.indexOf(key)<0){i++;allowed[key]=this._emailTypes[key];}}
if(i==0){this._getAnchor('emails_select').setAttribute('is-hidden',1);this.button_add_email._hide();}else{this._getAnchor('emails_select').removeAttribute('is-hidden');this.button_add_email._show();}
this.dropdown_email_type._fill(allowed);if(i==1&&!donotempty){var type=me.dropdown_email_type._value();this._addEmail('',this.dropdown_email_type._value(),function(elm){var sutype=type.toUpperCase();if(me._card_source.PROPERTYVAL[0][sutype]){log.log(['sutype exists',sutype]);elm.__key=sutype;elm.__source=me._card_source.PROPERTYVAL[0][sutype];}else{log.error('type "'+type+'" not supported');}});}}
_me._removeEmptyEmails=function(){if(!this._emailList){this._emailList=[];}
try
{var l=this._emailList.length;for(var i=l-1;i>=0;i--){log.log(i);if(helper.trim(this._emailList[i].object._value())==''){this._removeEmail(this._emailList[i]);}}
this._refreshEmailsDropdown();}
catch(e)
{log.error(e);}}
_me._removeEmail=function(email){if(!this._emailList){this._emailList=[];}
for(var i=0;i<this._emailList.length;i++){if(this._emailList[i]==email){this._emailList.splice(i,1);}}
for(var i=0;i<this.dropdown_email_type._used.length;i++){if(this.dropdown_email_type._used[i]==email.type){this.dropdown_email_type._used.splice(i,1);}}
email.object._destruct();email.box.parentElement.removeChild(email.box);this._refreshEmailsDropdown(true);}
_me._addEmail=function(value,type,callback,donotclear){try
{if(!this._emailsNum){this._emailsNum=0;}
if(!this._emailList){this._emailList=[];}
if(!this.dropdown_email_type._used){this.dropdown_email_type._used=[];}
var emailName='email_'+type;var email=this._pathName+'#'+emailName;if(!this[emailName])
{var elm=mkElement('div',{id:email});addcss(elm,'form-row');this._getAnchor('emails_values').appendChild(elm);this._create(emailName,'obj_input_text',emailName);this.dropdown_email_type._used.push(type);this[emailName]._placeholder(this.input_card_email._placeholder(),true);this[emailName]._label(this._emailTypes[type],true);this._emailList.push({name:emailName,object:this[emailName],box:elm,type:type});this._emailsNum++;if(callback){callback(this[emailName]);}
this._refreshEmailsDropdown();}
if(value){this[emailName]._value(value,donotclear);}}
catch(e)
{log.error(e);}}
_me._save=function(method,callback){var me=this;if(helper.trim(this.input_card_phone._value())!=''){this.button_add_phone._onclick();}
if(helper.trim(this.input_card_email._value())!=''){this.button_add_email._onclick();}
try
{var list=[me.input_card_name,me.input_card_surname,me.input_card_company,me.input_card_department,me.input_card_job,me.dropdown_card_gender,me.input_card_manager,me.input_card_assistant,me.input_card_website1,me.input_card_website2,me.textarea_card_note,{__key:me.input_card_birthday.__key,__source:me.input_card_birthday.__source,_value:function(){return me.input_card_birthday._getUTC();},_changed:function(x){return me.input_card_birthday._changed(x);}},{__key:me.input_card_anniversary.__key,__source:me.input_card_anniversary.__source,_value:function(){return me.input_card_anniversary._getUTC();},_changed:function(x){return me.input_card_anniversary._changed(x);}},me.input_card_work_street,me.input_card_work_state_county,me.input_card_work_country,me.input_card_work_city,me.input_card_work_zip,me.input_card_home_street,me.input_card_home_state_county,me.input_card_home_country,me.input_card_home_city,me.input_card_home_zip];for(var key in me._phoneList){list.push(me._phoneList[key].object);}
for(var key in me._emailList){list.push(me._emailList[key].object);}
var toSave=[{__source:me._card_source,_value:function(){var ret={};for(var i=0;i<list.length;i++){if(list[i]){if(list[i].__key){ret[list[i].__key]=[{'VALUE':list[i]._value()}];}else{log.error(['e:no-key-defined',list[i]]);}}
else{log.error(['e:item-not-found',{message:'m:item-number: '+i}]);}}
return ret;}}];if(method&&method=='changed'){var changed=com.user._prepareChanged(list);log.log(['accountcard-save-changed',changed]);return changed;}
var items=com.user._prepareSet(toSave);log.log(['SAVE',items]);var account='';if(location.parsed_query.account){account=location.parsed_query.account;}
com.user.setData(account,items,[function(aResponse){try
{if(aResponse.Array.IQ[0].QUERY[0].RESULT[0].VALUE==0){gui.message.error(getLang("error::save_unsuccessful"));}else{me._removeEmptyPhones();me._removeEmptyEmails();gui.message.toast(getLang("message::save_successfull"));com.user._prepareChanged(list,true);if(callback){callback();}}}
catch(e)
{log.error(e);}}]);}
catch(e)
{log.error(e);}}

/* client/inc/obj_accountdetail.js */
_me=obj_accountdetail.prototype;function obj_accountdetail(){};_me.__constructor=function(s){var me=this;var parent=this._parent;this._boxInitialized=false;this._lastType=0;this._menuHashTemplate='#menu=/MENU/&account=/ACCOUNT/&type=/TYPE/';};_me.__onclick=function(e){};_me._getMenuDefinition=function(settings,callback){var me=this;var menu=[];var defaultTab='';var type=settings.type;if(this._isguestaccount){type="0g";}
switch(type)
{case"7":var defaultTab='groupinfo';var menu=[{isdefault:true,icon:false,name:'groupinfo',value:'accountdetail::info',callback:function(name){me._tabmenuCallback(name);}},{name:'grouplimits',icon:false,value:'accountdetail::limits',callback:function(name){me._tabmenuCallback(name);}},{icon:false,name:'groupmembers',value:'accountdetail::members',callback:function(name){me._tabmenuCallback(name);}}];break;case"1":com.console.item(function(result){var defaultTab='mailinglistinfo';var menu=[{isdefault:true,icon:false,name:'mailinglistinfo',value:'accountdetail::info',callback:function(name){me._tabmenuCallback(name);}}];try
{if(result.Array.IQ[0].QUERY[0].RESULT[0].ITEM[0].PROPERTYVAL[0].VAL[0].VALUE=='0'){menu.push({icon:false,name:'mailinglistmembers',value:'accountdetail::members',callback:function(name){me._tabmenuCallback(name);}});}}
catch(e)
{}
callback(menu,defaultTab);}).account('m_sendalllists',location.parsed_query.account);return false;break;case"8":var defaultTab='resourceinfo';var menu=[{isdefault:true,icon:'user',name:'resourceinfo',value:'accountdetail::info',callback:function(name){me._tabmenuCallback(name);}},{icon:'collaboration',name:'resourcemembers',value:'accountdetail::members',callback:function(name){me._tabmenuCallback(name);}},{name:'card',value:'accountdetail::card',callback:function(name){me._tabmenuCallback(name);}},{name:'rules',value:'accountdetail::rules',callback:function(name){me._tabmenuCallback(name);}}];break;case'0g':defaultTab='info';menu=[{isdefault:true,name:'info',icon:'user',value:'accountdetail::info',callback:function(name){me._tabmenuCallback(name);}},{name:'card',value:'accountdetail::card',callback:function(name){me._tabmenuCallback(name);}}];break;default:defaultTab='info';menu=[{isdefault:true,name:'info',icon:'user',value:'accountdetail::info',callback:function(name){me._tabmenuCallback(name);}},{name:'card',value:'accountdetail::card',callback:function(name){me._tabmenuCallback(name);}},{name:'email',value:'accountdetail::email',callback:function(name){me._tabmenuCallback(name);}},{name:'limits',value:'accountdetail::limits',callback:function(name){me._tabmenuCallback(name);}},{name:'rules',value:'accountdetail::rules',callback:function(name){me._tabmenuCallback(name);}},{name:'mobile_devices',icon:'mobile',value:'accountdetail::mobile_devices',callback:function(name){me._tabmenuCallback(name);}}];break;}
callback(menu,defaultTab);}
_me._hash_handler=function(e,aData)
{var me=this;var parent=this._parent;log.log('Account detail should be loaded');try
{if(!location.parsed_query.type){location.parsed_query.type=0;}
if(this._isguestaccount===void 0){com.console.item(function(result){try
{var items=result.Array.IQ[0].QUERY[0].RESULT[0].ITEM;var parsed={};for(var i=0;i<items.length;i++){var key=items[i].APIPROPERTY[0].PROPNAME[0].VALUE.toLowerCase();var val=(items[i].PROPERTYVAL[0].VAL[0]&&items[i].PROPERTYVAL[0].VAL[0].VALUE?items[i].PROPERTYVAL[0].VAL[0].VALUE:void 0);parsed[key]=val;}
if(parseInt(parsed['u_isguestaccount'])){me._isguestaccount=true;}else{me._isguestaccount=false;}
if(parsed['u_mailbox']){me._heading=punycode.ToUnicode(parsed['u_mailbox']);}
me._getMenuDefinition({type:location.parsed_query.type},function(menuDefinition,defaultTab,callback){me._defaultTab=defaultTab;var accountdomain=location.parsed_query.account.split('@');accountdomain=accountdomain[accountdomain.length-1];gui.frm_main.main._init({name:'accountdetail_'+location.parsed_query.type,heading:{value:(me._heading?me._heading:punycode.ToUnicode(location.parsed_query.account)),back:{onclick:function(){if(me._isguestaccount){location.hash="menu=management&tab_management=guestaccounts";}else{location.hash="menu=domaindetail&domain="+encodeURIComponent(accountdomain);}
return false;}}},menu:{hashTemplate:me._menuHashTemplate,items:menuDefinition}},function(oBox,oMenu){if(callback){callback(oBox,oMenu);}});});}
catch(e)
{log.error(["accountdetail-hashhandler",e]);}}).account(["u_isguestaccount","u_mailbox"],location.parsed_query.account);}}
catch(e)
{log.error([e,me]);}}
_me._tabmenuCallback=function(name)
{var me=this;if(!name){name='';}
log.info('tabmenucallback-accountdetail');log.info(['name',name]);var parent=this._parent;gui.frm_main.main._setHeadingButton();if(name==''){name=me._defaultTab;}
parent._clean('main_content');switch(name)
{case'':case"info":if(!parent.accountinfo){parent._clean('main_content');parent._create('accountinfo','obj_accountinfo','main_content');}
parent.accountinfo._load(location.parsed_query.account);break;case'card':if(!parent.accountcard){parent._clean('main_content');parent._create('accountcard','obj_accountcard','main_content');}
parent.accountcard._load(location.parsed_query.account);break;case'limits':if(!parent.accountlimits){parent._clean('main_content');parent._create('accountlimits','obj_accountlimits','main_content');}
com.console.global('c_accounts_global_domains_useuserlimits',V_TYPE_BOOLEAN,function(value,b,i,s){parent.accountlimits._load(location.parsed_query.account);});break;case'grouplimits':if(!parent.grouplimits){parent._clean('main_content');parent._create('grouplimits','obj_grouplimits','main_content');}
parent.grouplimits._load(location.parsed_query.account);break;case'email':if(!parent.accountemail){parent._clean('main_content');parent._create('accountemail','obj_accountemail','main_content');}
parent.accountemail._load(location.parsed_query.account);break;case'rules':if(!parent.accountrules){parent._clean('main_content');parent._create('accountrules','obj_rules','main_content');}
parent.accountrules._load(location.parsed_query.account);break;case'mobile_devices':gui.frm_main._initSearch(function(string){parent.accountmobiledevices._onSearch(string);});if(!parent.accountmobiledevices){parent._clean('main_content');parent._create('accountmobiledevices','obj_accountmobiledevices','main_content');}
parent.accountmobiledevices._load(location.parsed_query.account);break;case'mailinglistinfo':if(!parent.mailinglistinfo){parent._clean('main_content');parent._create('mailinglistinfo','obj_mailinglistinfo','main_content');}
parent.mailinglistinfo._load();break;case'groupinfo':if(!parent.groupinfo){parent._clean('main_content');parent._create('groupinfo','obj_groupinfo','main_content');}
parent.groupinfo._load();break;case'resourceinfo':if(!parent.resourceinfo){parent._clean('main_content');parent._create('resourceinfo','obj_resourceinfo','main_content');}
parent.resourceinfo._load();break;case'groupmembers':if(!parent.groupmembers){parent._clean('main_content');parent._create('groupmembers','obj_groupmembers','main_content');}
parent.groupmembers._load();break;case'mailinglistmembers':if(!parent.mailinglistmembers){parent._clean('main_content');parent._create('mailinglistmembers','obj_mailinglistmembers','main_content');}
parent.mailinglistmembers._load();break;case'resourcemembers':if(!parent.resourcemembers){parent._clean('main_content');parent._create('resourcemembers','obj_resourcemembers','main_content');}
parent.resourcemembers._load();break;default:me.__load_default_view(false,name);break;}}
_me.__load_default_view=function(e,name)
{this._tabmenuCallback('');}

/* client/inc/obj_accountemail.js */
function obj_accountemail(){};var _me=obj_accountemail.prototype;_me.__constructor=function(s){var me=this;storage.library('wm_user');gui.frm_main.main._setHeadingButton('generic::save',function(){me._save();},'button text success');this._changeObserverID='accountemail';gui._changeObserver.assignListener(this._changeObserverID,function(callback){if(callback){close();return me._save(false,callback);}else{return me._save('changed');}});this._add_destructor('__onbeforedestruct');};_me.__onbeforedestruct=function(){gui._changeObserver.clearListener(this._changeObserverID);}
_me._setRight=function(right,element){global.setRight(this,right,element);}
_me._load=function(domain)
{log.log('Load list of users for domain '+domain);var me=this;me._draw('obj_accountemail','',{items:{}});this.btn_responder_message._disabled(true);this.dropdown_email_mode._fill({'0':getLang('accountdetail::disabled'),'1':getLang('accountdetail::respond_always'),'2':getLang('accountdetail::respond_once'),'3':getLang('accountdetail::respond_again_after_period')});this.dropdown_email_reports._fill({'0':getLang('accountdetail::disabled'),'1':getLang('accountdetail::default'),'2':getLang('accountdetail::new_items'),'3':getLang('accountdetail::all_items')});this.dropdown_email_folder._fill({'0':getLang('accountdetail::default'),'1':getLang('accountdetail::do_not_use_spam'),'2':getLang('accountdetail::use_spam')});this.btn_responder_message._onclick=function(){me._message();}
this.dropdown_email_mode._onchange=function(){if(this._value()=='0'){me._disable_responder();me.btn_responder_message._disabled(true);}else if(this._value()=='1'||this._value()=='2'||this._value()=='3'){me._enable_responder();me.btn_responder_message._disabled(false);if(this._value()=='3'){me.input_email_again._disabled(false);}else{me.input_email_again._disabled(true);}}else{me._enable_responder();}}
this.input_email_forward._onkeyup=function(){if(helper.trim(this._value())!='')
{me.toggle_email_do_not_forward._disabled(false);}
else
{me.toggle_email_do_not_forward._disabled(true);}}
this.input_email_forward._onchange=this.input_email_forward._onkeyup;this.toggle_email_do_not_forward._disabled(true);this._disable_responder();var doit=function(){var account='';if(location.parsed_query.account){account=location.parsed_query.account;}
com.user.forwarder(account,function(aResults){try
{var items=aResults.Array.IQ[0].QUERY[0].RESULT[0].ITEM;}
catch(e)
{log.error(['e:invalid-data',e]);}
try
{for(var i=0;i<items.length;i++)
{var propname=items[i].APIPROPERTY[0].PROPNAME[0].VALUE;var propval={};if(items[i].PROPERTYVAL&&items[i].PROPERTYVAL[0]){propval=items[i].PROPERTYVAL[0];}
if(items[i].PROPERTYRIGHT&&items[i].PROPERTYRIGHT[0]){propright=items[i].PROPERTYRIGHT[0].VALUE;}else{propright=2;}
try
{log.log([propname.toLowerCase(),(propval.VAL&&propval.VAL[0]&&propval.VAL[0].VALUE?propval.VAL[0].VALUE:false)]);switch(propname.toLowerCase())
{case'u_donotforwardspam':me.toggle_email_do_not_forward.__source=items[i];me.toggle_email_do_not_forward._checked((propval.VAL&&propval.VAL[0].VALUE=='0'?false:true));me._setRight(propright,'toggle_email_do_not_forward');break;case'u_forwardto':me.input_email_forward.__source=items[i];me.input_email_forward._value(propval.VAL&&propval.VAL[0].VALUE);me._setRight(propright,'input_email_forward');break;case'u_alternateemail':me.input_email_alternate.__source=items[i];me.input_email_alternate._value(propval.VAL&&propval.VAL[0].VALUE);me._setRight(propright,'input_email_alternate');break;case'u_mailin':me.input_email_incoming.__source=items[i];me.input_email_incoming._value(propval.VAL&&propval.VAL[0].VALUE);me._setRight(propright,'input_email_incoming');break;case'u_mailout':me.input_email_outgoing.__source=items[i];me.input_email_outgoing._value(propval.VAL&&propval.VAL[0].VALUE);me._setRight(propright,'input_email_outgoing');break;case'u_quarantinereports':me.dropdown_email_reports.__source=items[i];me.dropdown_email_reports._value(propval.VAL&&propval.VAL[0].VALUE);me._setRight(propright,'dropdown_email_reports');break;case'u_spamfolder':me.dropdown_email_folder.__source=items[i];me.dropdown_email_folder._value(propval.VAL&&propval.VAL[0].VALUE);me._setRight(propright,'dropdown_email_folder');break;}}
catch(e)
{log.error(e);}}}
catch(e)
{log.error(e);}});com.user.responder(account,function(aResponse){var items=aResponse.Array.IQ[0];log.log(items);if(items.QUERY[0].RESULT[0].ITEM[0])
{try
{var propval=items.QUERY[0].RESULT[0].ITEM[0].PROPERTYVAL[0];var propitem=items.QUERY[0].RESULT[0].ITEM[0];propitem.PROPERTYVAL[0]={};me._responder_source=propitem;if(items.QUERY[0].RESULT[0].ITEM[0].PROPERTYRIGHT[0]){propright=items.QUERY[0].RESULT[0].ITEM[0].PROPERTYRIGHT[0].VALUE;}else{propright=2;}
me._setRight(propright,['dropdown_email_mode','input_email_again','input_email_from','input_email_to','toggle_email_respond_to_messages','btn_responder_message']);for(var key in propval)
{var val='';if(propval[key][0]&&propval[key][0].VALUE){val=propval[key][0].VALUE;}
switch(key.toLowerCase())
{case'respondertype':me.dropdown_email_mode.__key=key;me.dropdown_email_mode.__source=propval[key];me.dropdown_email_mode._value(val);break;case'respondperiod':me.input_email_again.__key=key;me.input_email_again.__source=propval[key];me.input_email_again._value(val);break;case'respondbetweenfrom':me.input_email_from.__key=key;me.input_email_from.__source=propval[key];me.input_email_from._value(val.replace(/\//g,'-'));if(parseInt(val)>0){me.__respondfrom_set=true;}
break;case'respondbetweento':me.input_email_to.__key=key;me.input_email_to.__source=propval[key];me.input_email_to._value(val.replace(/\//g,'-'));if(parseInt(val)>0){me.__respondto_set=true;}
break;case'respondonlyiftome':me.toggle_email_respond_to_messages.__key=key;me.toggle_email_respond_to_messages.__source=propval[key];me.toggle_email_respond_to_messages._checked((val==1||val=='1'?true:false));break;case'respondermessage':log.log(['saved responder message']);me._responder_message={};me._responder_message.__key=key;me._responder_message.__source=propval[key];break;}}}
catch(e){log.error(e);}}});}
me._main.onclick=function(e){};me.timeout=setInterval(function(){if(storage.css_status('obj_accountemail'))
{clearInterval(me.timeout);doit();}},100);}
_me._disable_responder=function(){this.input_email_again._disabled(true);this.input_email_from._disabled(true);this.input_email_to._disabled(true);this.toggle_email_respond_to_messages._disabled(true);}
_me._enable_responder=function(){this.input_email_again._disabled(false);this.input_email_from._disabled(false);this.input_email_to._disabled(false);this.toggle_email_respond_to_messages._disabled(false);}
_me._message=function(){var popup=gui._create('popup','obj_popup');popup._init({name:'message',heading:{value:getLang('accountdetail::message')},fixed:false,footer:'default',content:"obj_accountemail_message"});popup.content._load(location.parsed_query.account,this);}
_me._save=function(method,callback){var me=this;try
{var list=[me.dropdown_email_mode,me.input_email_again,{__key:me.input_email_from.__key,_value:function(){var ux=me.input_email_from._getDate();if(!ux){return'';}
return ux.year+'/'+ux.month+'/'+ux.day;}},{__key:me.input_email_to.__key,_value:function(){var ux=me.input_email_to._getDate();if(!ux){return'';}
return ux.year+'/'+ux.month+'/'+ux.day;}},me.toggle_email_respond_to_messages];var toSave=[me.input_email_forward,me.input_email_alternate,me.toggle_email_do_not_forward,me.input_email_incoming,me.input_email_outgoing,me.dropdown_email_reports,me.dropdown_email_folder,{__source:me._responder_source,_value:function(){var ret={};ret['CLASSNAME']=[{VALUE:'taccountresponder'}];for(var i=0;i<list.length;i++){if(list[i].__key){ret[list[i].__key]=[{'VALUE':list[i]._value()}];}else{log.error('e:no-key-defined');}}
return ret;}}];if(method&&method=='changed'){var changed=com.user._prepareChanged(toSave);var changed2=com.user._prepareChanged(list);log.log(['accountemail-save-changed',changed]);if(!changed&&!changed2){return false;}
if(!changed){changed=[];}
if(!changed2){changed2=[];}
return changed.concat(changed2);}
var items=com.user._prepareSet(toSave);var account='';if(location.parsed_query.account){account=location.parsed_query.account;}
com.user.setData(account,items,[function(result){if(result.Array.IQ[0].QUERY[0].RESULT[0].VALUE==0){gui.message.error(getLang("error::save_unsuccessful"));}else{gui.message.toast(getLang("message::save_successfull"));com.user._prepareChanged(toSave,true);com.user._prepareChanged(list,true);if(callback){callback();}}}]);}
catch(e)
{log.error(e);}}

/* client/inc/obj_accountemail_message.js */
function obj_accountemail_message(){};var _me=obj_accountemail_message.prototype;_me.__constructor=function(s){var me=this;storage.library('wm_user');storage.library('obj_accountpicker');};_me._load=function(domain,that)
{var me=this;me._draw('obj_accountemail_message','',{items:{}});this.button_from._onclick=function(){me._addFrom();}
com.user.getResponderMessage(location.parsed_query.account,function(result){try
{var data=result.Array.IQ[0].QUERY[0].RESULT[0].ITEM[0].PROPERTYVAL[0];if(data.FROM[0]&&data.FROM[0].VALUE){me.input_from._value(data.FROM[0].VALUE);}
if(data.SUBJECT[0]&&data.SUBJECT[0].VALUE){me.input_subject._value(data.SUBJECT[0].VALUE);}
if(data.TEXT[0]&&data.TEXT[0].VALUE){me.textarea_mesage_setup_text._value(data.TEXT[0].VALUE);}}catch(e){}});}
_me._addFrom=function(){var me=this;gui.accountpicker(function(items){var email=items[0]&&items[0].id;if(email){me.input_from._value(helper.trim(email));}},{disable_add_domain:true});}
_me._save=function(){var me=this;try
{var account='';if(location.parsed_query.account){account=location.parsed_query.account;}
com.user.setResponderMessage(account,me.input_from._value(),me.input_subject._value(),me.textarea_mesage_setup_text._value(),[function(result){try
{if(result.Array.IQ[0].QUERY[0].RESULT[0].VALUE==0){gui.message.error(getLang("error::save_unsuccessful"));}else{gui.message.toast(getLang("message::save_successfull"));me._close();}}
catch(e)
{log.error(e);}}]);}
catch(e)
{log.error(e);}}

/* client/inc/obj_accountinfo.js */
function obj_accountinfo(){};var _me=obj_accountinfo.prototype;_me.__constructor=function(s){var me=this;this._accountDomain=location.parsed_query.account.split('@');this._accountDomain=this._accountDomain[this._accountDomain.length-1];storage.library('wm_user');var view=this._view=new AccountInfoView(this);gui.frm_main.main._setHeadingButton('generic::save',function(){me._save();},'button text success');this._selfHash="#menu=accountdetail&account=/ACCOUNT/&type=/TYPE/";};_me._load=function(domain)
{try
{var me=this;if(this._isguestaccount===void 0){com.console.item(function(result){try
{if(parseInt(result.Array.IQ[0].QUERY[0].RESULT[0].ITEM[0].PROPERTYVAL[0].VAL[0].VALUE)){me._isguestaccount=true;}else{me._isguestaccount=false;}}
catch(e)
{log.error(["accountinfo-load-callback",e]);me._isguestaccount=false;}
log.log(["accountinfo-load-callback","call load, guest account status is prepared",me._isguestaccount]);me._load(domain);}).account("u_isguestaccount",location.parsed_query.account);return;}
me._draw('obj_accountinfo','',{guest:me._isguestaccount});gui.frm_main.main._getAnchor('main_content').scrollTop=0;var domain=new Domain(location.parsed_query.account.split("@")[1]).getProperties(['D_ConnectorSupport','D_DesktopSupport','D_Saas_Plan'],function(props){if(props.D_ConnectorSupport==1){me.button_account_icewarp_outlook_sync_licenses._show();}
if(props.D_DesktopSupport==1){me.button_account_icewarp_desktop_licenses._show();}
me._props=props;me._initPlans();});var user=new Account(location.parsed_query.account);user.getPropertySet(['u_name','u_comment','u_description','u_spamadmin','u_2f_enabled','u_saas_plan'],function(p){this._data=p;this.__initial_username=p.U_Mailbox.value;this.input_account_firstname._setValue(p.A_Name.name);this.input_account_lastname._setValue(p.A_Name.surname);this.input_account_username._setValue(p.U_Mailbox);this.input_account_description._setValue(p.u_comment);this.multiple_add_alias._label("@"+this._accountDomain);this.multiple_add_alias._setValue(p.A_AliasList);if(p.A_AliasList.propertyRights!=2){this.button_add_alias._disabled(true);}
var loginip=p.A_LastLoginIP.value;var logintime=+p.A_LastLoginTime;if(loginip){this._getAnchor('last_login_ip').textContent=loginip;}
if(logintime&&!isNaN(logintime)){this._getAnchor('last_login_date').innerHTML=helper.date(getLang('datetime::php_date'),logintime);this._getAnchor('last_login_time').innerHTML=helper.date(getLang('datetime::php_time'),logintime);}else{this._getAnchor('last_login_date').parentNode.innerHTML=getLang('accountdetail::not_yet');this._getAnchor('last_login_ip').parentNode.innerHTML='';}
if(p.A_Image){var elm=this._getAnchor("userimage");this.button_upload_photo._displayElement(elm);this.button_upload_photo._setValue(p.A_Image);}
var sent=+p.A_MessagesSentToday||0;var percent=0;var limit=+p.u_numbersendlimit||0;if(limit>0){percent=Math.round((sent/limit)*10000)/100;if(percent>100){percent=100;}
this.quota_emails._label(sent+" "+getLang("accountdetail::of")+" "+limit);this.quota_emails._value(percent);}else{this.quota_emails._label(sent.toString());this.quota_emails._value(0);}
var isQuota=false;var quota_size='0 B';var quota=0;var size='0 B';if(p.A_Quota.mailboxquota)
{var mailboxsize=p.A_Quota.mailboxsize*1024;var mailboxquota=p.A_Quota.mailboxquota*1024;size=helper.bytes2hr(mailboxsize);if(mailboxquota>0)
{quota_size=helper.bytes2hr(mailboxquota);isQuota=true;quota=Math.round((mailboxsize/mailboxquota)*10000)/100;}}
if(isQuota){this.quota_storage._label(size+" "+getLang("accountdetail::of")+" "+quota_size);this.quota_storage._value(quota);}else{this.quota_storage._label(size);}
this._initPlans();var aFill;if(gui._globalInfo.admintype==USER_ADMIN||p.A_AdminType=='1'){aFill={'0':getLang('userlist::user'),'1':getLang('userlist::admin'),'2':getLang('userlist::domain_admin'),'3':getLang('userlist::webadmin')};if(gui._globalInfo.admintype!=USER_ADMIN)
this.dropdown_account_type._disabled(true);}
else{aFill={'0':getLang('userlist::user'),'2':getLang('userlist::domain_admin'),'3':getLang('userlist::webadmin')};}
this.dropdown_account_type._fill(aFill);this.dropdown_account_type._setValue(p.A_AdminType);this._getAnchor('user_type_icon')._admintype='subtype_'+p.A_AdminType;addcss(this._getAnchor('user_type_icon'),this._getAnchor('user_type_icon')._admintype);var state=p.A_State.state;this.dropdown_account_active._setValue(state);if(state==1||state==2){this._getAnchor('fi_account_is_disabled').removeAttribute('is-hidden');}
addcss(this._getAnchor('user_state_icon'),'state_'+state);if(p.u_2f_enabled==1){var elm=me._getAnchor('text_2_factor_authentication');elm.textContent=getLang('ACCOUNTDETAIL::ENABLED');me.button_2_factor_authentication._disabled(false);}}.bind(this));this.button_2_factor_authentication._onclick=function(){gui.message.warning(getLang("accountdetail::reset_authentication"),false,[{value:getLang("generic::cancel"),type:'text borderless',method:'close'},{value:getLang("generic::reset"),type:'success text',onclick:function(){gui.popup._close();com.security.reset2Factor(user.id,function(r){if(r==1){gui.message.toast(getLang('accountdetail::authentication_reset_succeeded'));}else{gui.message.error(getLang('error::reset_failed'));}});}}]);}
if(me._isguestaccount){}else{gui.frm_main.main._setHeading(punycode.ToUnicode(location.parsed_query.account));}
this.dropdown_account_type._onchange=function(e){var val=me.dropdown_account_type._value();removecss(me._getAnchor('user_type_icon'),me._getAnchor('user_type_icon')._admintype);me._getAnchor('user_type_icon')._admintype="subtype_"+val;addcss(me._getAnchor('user_type_icon'),me._getAnchor('user_type_icon')._admintype);}
this.dropdown_account_active._fill({'0':getLang('accountdetail::enabled'),'1':getLang('accountdetail::disabled_login'),'2':getLang('accountdetail::disabled_login_receive'),'3':getLang('accountdetail::spam_trap'),});this.dropdown_account_active._onchange=function(e){var val=me.dropdown_account_active._value();removecss(me._getAnchor('user_state_icon'),me._getAnchor('user_state_icon')._adminstate);me._getAnchor('user_state_icon')._adminstate="state_"+val;addcss(me._getAnchor('user_state_icon'),me._getAnchor('user_state_icon')._adminstate);}
this.button_account_mobile_devices_manage._onclick=function(e){me._parent.left_menu._go('mobile_devices');}
this.button_account_icewarp_outlook_sync_manage._onclick=function(e){me._outlookSyncManage();}
this.button_account_permissions._onclick=function(){me._openPermissions();}
var avatar=this._getAnchor("userimage");this.button_upload_photo._imagesOnly();this.button_upload_photo._droparea(avatar);this.button_upload_photo._onfile=function(img){}
this.button_upload_photo._onmimetypeerror=function(mime){gui.message.error(getLang('error::uploader_file_type_not_allowed'));}
me.button_account_icewarp_outlook_sync_licenses._onclick=function(e){me._licenses(0);}
me.button_account_icewarp_desktop_licenses._onclick=function(e){me._licenses(1);}
me.button_change_password._onclick=function(e){me._changePassword();}
me.button_account_features._onclick=function(e){me._features();}
com.general.install_url(function(url){me._getAnchor('button_account_icewarp_outlook_sync_download').target="_blank";me._getAnchor('button_account_icewarp_outlook_sync_download').href=url+'download/outlook-sync.exe';me._getAnchor('button_account_icewarp_desktop_download').target="_blank";me._getAnchor('button_account_icewarp_desktop_download').href=url+'download/desktop-setup.msi';});this.button_add_alias._onclick=function(e){var v=me._data.A_AliasList.addItem("item","");me.multiple_add_alias._add(v);e.stopPropagation();e.cancelBubble=true;return false;}
this.button_change_quotas._onclick=function(e){me._parent.left_menu._go('limits');e.stopPropagation();e.cancelBubble=true;return false;}
this.input_account_username._onchange=function(){if(this._value()==gui._globalInfo.accountProperties.u_mailbox&&me._accountDomain==gui._globalInfo.domain&&me.__initial_username!=gui._globalInfo.accountProperties.u_mailbox){this._value(me.__initial_username);}}}
catch(e)
{log.error(e);}}
_me._initPlans=function(){var me=this;if(!~['saas','cloud'].indexOf(gui._globalInfo.licence.licensetype.toString())||!me._data||!me._props){return;}
var cloudinfo=gui._globalInfo.licence.cloudinfo||{};var maxPlan=Math.max(+me._props.D_Saas_Plan,+me._data.u_saas_plan);me._getAnchor('fb_change_user_plan').removeAttribute("is-hidden");me._getAnchor('fb_change_user_plan_title').removeAttribute("is-hidden");me._create('plans','obj_plans','fb_change_user_plan','',{selectable:true,show_prices:+cloudinfo.cloudshowprice,yearly:(cloudinfo.cloudplanbillingperiod||'').toString()!=='MONTH',plans:gui._globalInfo.licence.plans.map(function(plan){if(!+me._props.D_Saas_Plan||+plan.planid<=maxPlan){var label=getLang("SUBSCRIPTION_PLANS::"+plan.planlabel);return options={id:plan.planid,disabled:+me._props.D_Saas_Plan&&+plan.planid>+me._props.D_Saas_Plan,icon:true,label:~label.indexOf("::")?plan.planlabel:label,price:(+plan.price).toCurrency(plan.currency.toString()),price_per_user:'&#8203;'};}}).filter(Boolean)});me.plan_details._onclick=function(){me.plan_details._disabled(true);obj_subscription.prototype._openLicensePopup.call(this,'plan-details',function(){me.plan_details._disabled(false);},{heading:getLang('SUBSCRIPTION::PLAN_DETAILS')});};me.plans._setValue(me._data.u_saas_plan);me.plans._onchange=function(value){me._data.u_saas_plan.value=value;}}
_me._issaved=function(target){return!this._data.hasChanged();}
_me._save=function(callback,allowSameUsername){var view=this._view;var me=this;var user=this.input_account_username;if(!allowSameUsername&&user._value()==gui._globalInfo.accountProperties.u_mailbox&&me.__initial_username!=gui._globalInfo.accountProperties.u_mailbox){if(this._accountDomain==gui._globalInfo.domain){gui.message.error(getLang("error::identical_email"));return false;}else{var warning=gui.message.warning(getLang("warning::identical_username"),false,[{value:getLang("generic::cancel"),type:'text borderless',method:'close'},{value:getLang("generic::do_not_save"),type:'text error',method:'close'},{value:getLang("generic::save"),type:'success text',onclick:function(){gui.popup._close();me._save(callback,true);}}]);return false;}}
if(this._data.hasChanged()){var newusername=this._data.A_AliasList.hasChanged()?this._data.A_AliasList[0]+'@'+this._accountDomain:false;var hash=this._selfHash;this._data.saveChanges(function(r){view.saveNotification(r==1);if(callback){callback(r==1);}
if(newusername&&r==1){gui._globalInfo._update(function(){gui.frm_main._fillUsermenu();});location.hash=helper.translateHash(hash.replace('/ACCOUNT/',encodeURIComponent(newusername)),location.parsed_query);}});}}
_me._reset=function(){this._data.revertChanges();}
_me._licenses=function(type){var popup=gui._create('popup','obj_popup');popup._init({name:'outlooksynclicenses',heading:{value:(type==0?getLang('client_applications::icewarp_outlook_sync'):getLang('client_applications::icewarp_desktop'))},content:'obj_accountinfo_licenses'});popup.content._load(location.parsed_query.account,type);}
_me._changePassword=function(){var popup=gui._create('popup','obj_popup');popup._init({name:'changepassword',heading:{value:getLang('accountdetail::change_password')},fixed:false,footer:'obj_accountinfo_changepwd_footer',content:"obj_accountinfo_changepwd"});popup.content._load(location.parsed_query.account);}
_me._features=function(){var popup=gui._create('popup','obj_popup');popup._init({name:'features',heading:{value:getLang('accountdetail::features')},fixed:false,iwattr:{height:'full',width:'large'},footer:'obj_accountinfo_features_footer',content:"obj_accountinfo_features"});popup.content._load(location.parsed_query.account);}
_me._outlookSyncManage=function(){var popup=gui._create('popup','obj_popup');popup._init({name:'accountinfo_os_manage',heading:{value:getLang('client_applications::icewarp_outlook_sync')},fixed:false,iwattr:{height:'full',width:'large'},footer:'obj_accountinfo_os_manage_footer',content:'obj_accountinfo_os_manage'});popup.content._load(location.parsed_query.account);}
_me._openPermissions=function(){var popup=gui._create('popup','obj_popup');popup._init({fixed:false,iwattr:{height:'full',width:'medium'},name:'permissions',heading:{value:getLang('accountdetail::permissions')},footer:'obj_permissions_footer',content:'obj_permissions'});popup.content._load(location.parsed_query.account);}
var AccountInfoView=function(controller){this._control=controller;}
AccountInfoView.prototype=Object.create(CoreView.prototype);

/* client/inc/obj_accountinfo_changepwd.js */
function obj_accountinfo_changepwd(){};var _me=obj_accountinfo_changepwd.prototype;_me.__constructor=function(s){var me=this;storage.library('wm_user');};_me._load=function(account)
{var that=this;var me=this;this.__account=account||location.parsed_query.account;that._draw('obj_accountinfo_changepwd','',{items:{}});this.button_generate_password._onclick=function(e){com.general.generate_password(function(pwd){me.input_change_password._value(pwd);});};com.user.password_policy(function(aResult){log.info(aResult);var items=aResult.Array.IQ[0].QUERY[0].RESULT[0].ITEM;for(var i=0;i<items.length;i++)
{var propname=items[i].APIPROPERTY[0].PROPNAME[0].VALUE;var propval={};if(items[i].PROPERTYVAL&&items[i].PROPERTYVAL[0]){propval=items[i].PROPERTYVAL[0];}
try
{log.log(propname.toLowerCase());switch(propname.toLowerCase())
{case'c_accounts_policies_pass_enable':if(propval.VAL[0].VALUE=='1'){me._getAnchor('pwdp').removeAttribute('is-hidden');}else{me._getAnchor('pwdp').setAttribute('is-hidden',1);}
break;case'c_accounts_policies_pass_minlength':if(propval.VAL[0].VALUE=='0'){me._getAnchor('pwdp_minlength').setAttribute('is-hidden',1);}
me._getAnchor('pwdp_minlength').getElementsByTagName('span')[0].innerHTML=helper.htmlspecialchars(propval.VAL[0].VALUE);break;case'c_accounts_policies_pass_digits':if(propval.VAL[0].VALUE=='0'){me._getAnchor('pwdp_digits').setAttribute('is-hidden',1);}
me._getAnchor('pwdp_digits').getElementsByTagName('span')[0].innerHTML=helper.htmlspecialchars(propval.VAL[0].VALUE);break;case'c_accounts_policies_pass_nonalphanum':if(propval.VAL[0].VALUE=='0'){me._getAnchor('pwdp_nonalphanum').setAttribute('is-hidden',1);}
me._getAnchor('pwdp_nonalphanum').getElementsByTagName('span')[0].innerHTML=helper.htmlspecialchars(propval.VAL[0].VALUE);break;case'c_accounts_policies_pass_useralias':if(propval.VAL[0].VALUE=='0'){me._getAnchor('pwdp_useralias').setAttribute('is-hidden',1);}
break;case'c_accounts_policies_pass_alpha':if(propval.VAL[0].VALUE=='0'){me._getAnchor('pwdp_alpha').setAttribute('is-hidden',1);}
me._getAnchor('pwdp_alpha').getElementsByTagName('span')[0].innerHTML=helper.htmlspecialchars(propval.VAL[0].VALUE);break;case'c_accounts_policies_pass_upperalpha':if(propval.VAL[0].VALUE=='0'){me._getAnchor('pwdp_upperalpha').setAttribute('is-hidden',1);}
me._getAnchor('pwdp_upperalpha').getElementsByTagName('span')[0].innerHTML=helper.htmlspecialchars(propval.VAL[0].VALUE);break;case'c_accounts_policies_pass_expiration':if(propval.VAL[0].VALUE=='1'){me._getAnchor('pwd_expire').removeAttribute('is-hidden');}
break;}}
catch(e)
{log.error(e);}}});that._main.onclick=function(e){};that.timeout=setInterval(function(){if(storage.css_status('obj_accountinfo_changepwd')){clearInterval(that.timeout);}},100);}
_me._save=function(ignorePasswordPolicy,successCallback){var me=this;user=this.__account;com.user.change_password(user,me.input_change_password._value(),ignorePasswordPolicy,function(result){if(result)
{if(result.Array.IQ[0].QUERY[0].ERROR){var message=result.Array.IQ[0].QUERY[0].ERROR[0].ATTRIBUTES.UID;if(message=='account_password_policy'&&(gui._globalInfo.admintype==USER_ADMIN||gui._globalInfo.admintype==USER_WEB)){gui.message.error(getLang("error::"+message),false,[{value:getLang("generic::cancel"),method:'close',type:'borderless text'},{value:getLang("accountinfo::ignore_password_policy"),onclick:function(closeCallback){me._save(true,function(){closeCallback();});}}]);}else{gui.message.error(getLang("error::"+message),false);}
return false;}else{gui._globalInfo.passwordexpired=false;}
if(me.toggle_must_change_password._checked())
{com.user.expire_password(user,function(result){if(!result){gui.message.error(getLang("error::save_unsuccessful"));}else{gui.message.toast(getLang("message::save_successfull"));if(successCallback){successCallback();}}
me._parent._parent._close();});}
else
{if(result.Array.IQ[0].QUERY[0].RESULT[0].VALUE==0){gui.message.error(getLang("error::save_unsuccessful"));}else{gui.message.toast(getLang("message::save_successfull"));if(successCallback){successCallback();}}
me._parent._parent._close();}}
else
{me._getAnchor('error').removeAttribute('is-hidden');}});}

/* client/inc/obj_accountinfo_features.js */
function obj_accountinfo_features(){};var _me=obj_accountinfo_features.prototype;_me.__constructor=function(s){var me=this;storage.library('wm_user');this._leftMenu=[{isdefault:true,name:'email',icon:'',value:'accountdetail::email',onclick:function(e,name){me._tabClickHandler(name);return false;}},{name:'security',icon:'',value:'accountdetail::security',onclick:function(e,name){me._tabClickHandler(name);return false;}},{name:'messaging',icon:'',value:'accountdetail::messaging',onclick:function(e,name){me._tabClickHandler(name);return false;}},{name:'teamchat',icon:'',value:'accountdetail::teamchat',onclick:function(e,name){me._tabClickHandler(name);return false;}},{name:'webclient',icon:'',value:'accountdetail::webclient',onclick:function(e,name){me._tabClickHandler(name);return false;}},{name:'mobile_devices',icon:'',value:'accountdetail::mobile_devices',onclick:function(e,name){me._tabClickHandler(name);return false;}},{name:'file_storage',icon:'',value:'accountdetail::file_storage',onclick:function(e,name){me._tabClickHandler(name);return false;}},{name:'web_documents',icon:'',value:'accountdetail::web_documents',onclick:function(e,name){me._tabClickHandler(name);return false;}}];this._parent.left_menu._fill(this._leftMenu);this._parent.left_menu._show();this._parent.left_menu.__hash_handler();};_me._load=function(domainAccount,isDomain)
{var me=this;me._domainAccount=domainAccount;me._isDomain=isDomain;me._draw('obj_accountinfo_features','',{items:{}});this._parent.btn_cancel._onclick=function(e){this._parent._parent._close();};this._parent.btn_save._onclick=function(e){me._parent.btn_save._disabled(true);me._save();};var connection_list=["toggle_smtp",'toggle_pop_imap','toggle_archive','toggle_antispam','toggle_antivirus','toggle_quarantine',"toggle_instant_messaging",'toggle_teamchat','toggle_voip','toggle_online_conferencing','toggle_sms','toggle_groupware','toggle_webclient','toggle_exchange_activesync','toggle_web_folders','toggle_file_transfer','toggle_web_documents'];for(var i=0;i<connection_list.length;i++){this[connection_list[i]]._related_image=connection_list[i]+"_image";this[connection_list[i]]._onchange=function(){document.getElementById(this._related_image).src=(this._checked()?document.getElementById(this._related_image).getAttribute('image-on'):document.getElementById(this._related_image).getAttribute('image-off'));};}
var doit=function(callback){com[(me._isDomain?'domain':'user')].features(me._domainAccount,function(data){log.info(['accountinfofeatures-load-doit',data]);if(data.smtp){me.toggle_smtp.__source=data.smtp.source;me.toggle_smtp._checked(data.smtp.value);me.toggle_smtp._disabled(!data.smtp.editable);}else{global.setRight(me,0,'toggle_smtp',true);}
if(me.pop3imap){me.toggle_pop_imap.__source=data.pop3imap.source;me.toggle_pop_imap._checked(data.pop3imap.value);me.toggle_pop_imap._disabled(!data.pop3imap.editable);}else{global.setRight(me,0,'toggle_pop_imap',true);}
if(data.archive){me.toggle_archive.__source=data.archive.source;me.toggle_archive._checked(data.archive.value);me.toggle_archive._disabled(!data.archive.editable);}else{global.setRight(me,0,'toggle_archive',true);}
if(data.as){me.toggle_antispam.__source=data.as.source;me.toggle_antispam._checked(data.as.value);me.toggle_antispam._disabled(!data.as.editable);}else{global.setRight(me,0,'toggle_antispam',true);}
if(data.avscan){me.toggle_antivirus.__source=data.avscan.source;me.toggle_antivirus._checked(data.avscan.value);me.toggle_antivirus._disabled(!data.avscan.editable);}else{global.setRight(me,0,'toggle_antivirus',true);}
if(data.quarantine){me.toggle_quarantine.__source=data.quarantine.source;me.toggle_quarantine._checked(data.quarantine.value);me.toggle_quarantine._disabled(!data.quarantine.editable);}else{global.setRight(me,0,'toggle_quarantine',true);}
if(data.im){me.toggle_instant_messaging.__source=data.im.source;me.toggle_instant_messaging._checked(data.im.value);me.toggle_instant_messaging._disabled(!data.im.editable);}else{global.setRight(me,0,'toggle_instant_messaging',true);}
if(data.sip){me.toggle_voip.__source=data.sip.source;me.toggle_voip._checked(data.sip.value);me.toggle_voip._disabled(!data.sip.editable);}else{global.setRight(me,0,'toggle_voip',true);}
if(data.meeting){me.toggle_online_conferencing.__source=data.meeting.source;me.toggle_online_conferencing._checked(data.meeting.value);me.toggle_online_conferencing._disabled(!data.meeting.editable);}else{global.setRight(me,0,'toggle_online_conferencing',true);}
if(data.sms){me.toggle_sms.__source=data.sms.source;me.toggle_sms._checked(data.sms.value);me.toggle_sms._disabled(!data.sms.editable);}else{global.setRight(me,0,'toggle_sms',true);}
if(data.teamchat){me.toggle_teamchat.__source=data.teamchat.source;me.toggle_teamchat._checked(data.teamchat.value);me.toggle_teamchat._disabled(!data.teamchat.editable);}else{global.setRight(me,0,'toggle_teamchat',true);me._parent.left_menu._removeTab('teamchat');}
var watcher=false;if(data.gw){me.toggle_groupware.__source=data.gw.source;me.toggle_groupware._checked(data.gw.value);me.toggle_groupware._disabled(!data.gw.editable);watcher=true;}else{global.setRight(me,0,'toggle_groupware',true);}
if(data.webmail){me.toggle_webclient.__source=data.webmail.source;me.toggle_webclient._checked(data.webmail.value);me.toggle_webclient._disabled(!data.webmail.editable);watcher=true;}else{global.setRight(me,0,'toggle_webclient',true);}
if(!watcher){me._parent.left_menu._removeTab('webclient');}
if(data.activesync){me.toggle_exchange_activesync.__source=data.activesync.source;me.toggle_exchange_activesync._checked(data.activesync.value);me.toggle_exchange_activesync._disabled(!data.activesync.editable);}else{global.setRight(me,0,'toggle_exchange_activesync',true);}
if(data.webdav){me.toggle_web_folders.__source=data.webdav.source;me.toggle_web_folders._checked(data.webdav.value);me.toggle_web_folders._disabled(!data.webdav.editable);}else{global.setRight(me,0,'toggle_web_folders',true);}
if(data.ftp){me.toggle_file_transfer.__source=data.ftp.source;me.toggle_file_transfer._checked(data.ftp.value);me.toggle_file_transfer._disabled(!data.ftp.editable);}else{global.setRight(me,0,'toggle_ftp',true);}
if(data.webdocuments){me.toggle_web_documents.__source=data.webdocuments.source;me.toggle_web_documents._checked(data.webdocuments.value);me.toggle_web_documents._disabled(!data.webdocuments.editable);}else{global.setRight(me,0,'toggle_web_documents',true);}});}
me._main.onclick=function(e){};me.timeout=setInterval(function(){if(storage.css_status('obj_accountinfo_features'))
{clearInterval(me.timeout);doit();}},100);}
_me._tabClickHandler=function(name){if(!this._activeFieldset){this._activeFieldset='email';}
addcss(this._getAnchor(this._activeFieldset),'hide');removecss(this._getAnchor(name),'hide');this._parent._getAnchor('main_content').scrollTop=0;this._activeFieldset=name;}
_me._save=function(){var me=this;try
{var toSavePack=[me.toggle_smtp,me.toggle_pop_imap,me.toggle_archive,me.toggle_antispam,me.toggle_antivirus,me.toggle_quarantine,me.toggle_instant_messaging,me.toggle_teamchat,me.toggle_voip,me.toggle_online_conferencing,me.toggle_sms,me.toggle_groupware,me.toggle_webclient,me.toggle_exchange_activesync,me.toggle_web_folders,me.toggle_file_transfer,me.toggle_web_documents];var toSave=[];for(var key in toSavePack){if(toSavePack[key]&&(typeof toSavePack[key].__source!='undefined')){toSave.push(toSavePack[key]);}}
var items=com[(me._isDomain?'domain':'user')]._prepareSet(toSave);var account='';if(me._domainAccount){account=me._domainAccount;}
com[(me._isDomain?'domain':'user')].setData(account,items,[function(result){me._parent.btn_save._disabled(false);try
{if(result.Array.IQ[0].QUERY[0].RESULT[0].VALUE==0){gui.message.error(getLang("error::save_unsuccessful"));}else{gui.message.toast(getLang("message::save_successfull"));me._close();}}
catch(e)
{log.error(e);}}]);}
catch(e)
{log.error(e);}}

/* client/inc/obj_accountinfo_licenses.js */
function obj_accountinfo_licenses(){};var _me=obj_accountinfo_licenses.prototype;_me.__constructor=function(s){this._keytype=0;storage.library('wm_user');};_me._load=function(domain,type)
{var me=this;this._draw('obj_accountinfo_licenses','',{items:{}});this.button_licence_generate_key._onclick=function(){com.user.generate_license(location.parsed_query.account,me.__keyProperty,function(key){if(key){me.license._value(key);}});}
this.button_licence_send_key._onclick=function(){me.button_licence_send_key._disabled(true);com.user.send_license(location.parsed_query.account,me.__keyProperty,function(result){me.button_licence_send_key._disabled(false);if(result==1){gui.message.toast(getLang('message::license_key_sent_successfuly'));me._close();}else{gui.message.error(getLang('error::license_key_send_failed'));}});}
me.input_licence_description._disabled(true);me.input_licence_allowed_activation_count._disabled(true);me.button_licence_generate_key._disabled(true);me.button_licence_send_key._disabled(true);var user=new Account(location.parsed_query.account);var propnames=type==0?['A_ActivationKeyOutlook','u_client_connector']:['A_ActivationKeyDesktop','u_client_desktop'];var getActivationKey=function(){user.getProperty(propnames[0],function(p){if(p.value){me.__keyProperty=p.propertyCollection;me.input_licence_description._setValue(p.description);me.input_licence_allowed_activation_count._setValue(p.count);me.license._setValue(p.value);me.input_licence_description._disabled(false);p.description.readOnly(false);me.input_licence_description._readonly(false);me.input_licence_allowed_activation_count._disabled(false);p.count.readOnly(false);me.input_licence_allowed_activation_count._readonly(false);me.button_licence_generate_key._disabled(false);me.button_licence_send_key._disabled(false);me._keytype=+p.keytype.value;}else{me._keytype=type;setTimeout(function(){getActivationKey();},500);}});}
user.getProperty(propnames[1],function(p){me.__enableProperty=p.propertyCollection;if(p==1){getActivationKey();}
me.toggle_enable_client_licence._setValue(p);});this.toggle_enable_client_licence._onchange=function(state){var v=this._getValue();if(v.hasChanged()){this._disabled(true);var p=me.__enableProperty;var that=this;p.saveChanges(function(r){if(!r.error&&r==1){p.commitChanges();that._disabled(false);}});if(state&&!me.__keyProperty){getActivationKey();}else{me.input_licence_description._disabled(!state);me.input_licence_allowed_activation_count._disabled(!state);me.button_licence_generate_key._disabled(!state);me.button_licence_send_key._disabled(!state);}}}
var doit=function(callback){}
this._main.onclick=function(e){};this.timeout=setInterval(function(){if(storage.css_status('obj_accountinfo_licenses'))
{clearInterval(me.timeout);doit();}},100);}

/* client/inc/obj_accountinfo_os_manage.js */
function obj_accountinfo_os_manage(){};var _me=obj_accountinfo_os_manage.prototype;obj_accountinfo_os_manage._mapping={dropdown_save_as:'saveastype',toggle_line_security:'linesecurity',dropdown_line_security:'linesecurityvalue',toggle_authentication_method:'authenticationmethod',dropdown_authentication_method:'authenticationmethodvalue',toggle_login_port:'loginport',input_login_port:'loginportvalue',toggle_do_not_show_login_errors:'donotshowloginerrors',dropdown_do_not_show_login_errors:'donotshowloginerrorsvalue',toggle_do_not_show_connection_errors:'donotshowconnectionerrors',dropdown_do_not_show_connection_errors:'donotshowconnectionerrorsvalue',toggle_folder_synchronization_threshold:'foldersyncthreshold',input_folder_synchronization_threshold:'foldersyncthresholdmessages',toggle_threshold_for_full_download:'downloadthreshold',dropdown_threshold_for_full_download:'downloadfilestype',input_threshold_for_full_download:'downloadthresholdmb',toggle_download_files:'downloadfilesfully',toggle_skip_trash_folder:'skiptrashfolderstartupcheck',dropdown_skip_trash_folder:'skiptrashfolderstartupcheckvalue',toggle_disable_tnef:'disabletnef',dropdown_disable_tnef:'disabletnefvalue',toggle_folder_structure_after:'syncfolderstructure',input_folder_structure_after:'syncfolderstructureafter',toggle_selected_priority_folders:'syncpriorityfolders',input_selected_priority_folders:'syncpriorityfoldersafter',toggle_selected_standard_folders:'syncstandardfolders',input_selected_standard_folders:'syncstandardfoldersafter',toggle_content_of_folders:'syncfoldersimmediately',dropdown_content_of_folders:'syncfoldersimmediatelyvalue',toggle_gal_automatically:'syncgal',dropdown_gal_automatically:'syncgalvalue',toggle_do_not_show_progress:'donotshowprogress',dropdown_do_not_show_progress:'donotshowprogressvalue',toggle_automatically_revert_changes:'autorevertchangesinreadonly',dropdown_automatically_revert_changes:'autorevertchangesinreadonlyvalue',toggle_display_address_book_names:'displayabnames',dropdown_display_address_book_names:'displayabnamesas',toggle_show_desktop_notification:'showdesktopnotification',dropdown_show_desktop_notification:'showdesktopnotificationvalue',input_hide_notification_after:'hidenotificationaftervalue',toggle_play_default_sound:'playdefaultnotificationsound',dropdown_play_default_sound:'playdefaultnotificationsoundvalue',toggle_check_for_updates:'checkforupdates',dropdown_check_for_updates:'checkforupdatesvalue',toggle_logging_level:'loglevel',dropdown_logging_level:'loglevelvalue',toggle_delete_logs:'deletelogs',dropdown_delete_logs:'deletelogsvalue',input_delete_after_specified_days:'deletelogsaftervalue'};_me.__constructor=function(s){};_me._load=function(accountOrDomain,isDomain){var me=this;if(!accountOrDomain){this._store=com;this._property='global_outlookpolicies';}else if(accountOrDomain&&isDomain){this._store=new Domain(accountOrDomain);this._property='d_outlookpolicies';}else{this._store=new Account(accountOrDomain);this._property='a_outlookpolicies';}
this._draw('obj_accountinfo_os_manage','',{items:{}});this._leftMenu=[{isdefault:true,name:'login_credentials',icon:'',value:'synchronization::login_credentials',show:this._getAnchor('login_credentials')},{name:'advanced',icon:'',value:'synchronization::advanced',show:this._getAnchor('advanced')},{name:'synchronization',icon:'',value:'accountdetail::synchronization',show:this._getAnchor('synchronization')},{name:'appearance',icon:'',value:'synchronization::appearance',show:this._getAnchor('appearance')},{name:'licence_and_updates',icon:'',value:'synchronization::licence_and_updates',show:this._getAnchor('licence_and_updates')},{name:'logs',icon:'',value:'synchronization::logs',show:this._getAnchor('logs')}];this._parent.left_menu._fill(this._leftMenu);this._parent.left_menu._show();this._parent.left_menu.__hash_handler();this._parent.dropdown_save_as._fillLang(['accountdetail::force_settings','accountdetail::set_as_default']);this.dropdown_line_security._fillLang(['synchronization::plain','synchronization::starttsl','synchronization::ssl']);this.dropdown_authentication_method._fillLang(['synchronization::cram_md5','synchronization::plain']);this.dropdown_threshold_for_full_download._fillLang(['accountdetail::custom','accountdetail::headers','accountdetail::full']);this.dropdown_display_address_book_names._fillLang(['accountdetail::numbered_structure','accountdetail::folder_name_only','accountdetail::full_folder_path','accountdetail::outlook_native']);this.dropdown_logging_level._fillLang(['synchronization::log_debug','synchronization::log_errors']);this._store.getProperty(this._property,function(r){if(r.error){gui.message.error(getLang("error::fetch_failed"));me._close();return false;}
me._data=r;me._fillFieldsWithData();me.toggle_download_files._disabled(!me.toggle_threshold_for_full_download._checked());});}
_me._save=function(){if(this._data.hasChanged()){this._data.saveChanges(this._saveFeedbackAndClose);}else{this._close();}}

/* client/inc/obj_accountlimits.js */
function obj_accountlimits(){};var _me=obj_accountlimits.prototype;_me.__constructor=function(s){var me=this;storage.library('wm_user');};_me._load=function(domain){var me=this;log.log('Load list of users for domain '+domain);var view=this._view=new AccountLimitsView(this);view.addSaveButton();view.draw();this.toggle_expires_on._onchange=function(checked){me.input_expires_on._disabled(!checked);}
this.dropdown_expiration_status._fill({'0':getLang("accountdetail::enabled"),'1':getLang("accountdetail::disabled_login"),'2':getLang("accountdetail::disabled_login_receive"),'3':getLang("accountdetail::spam_trap")});var user=new Account(location.parsed_query.account);user.getProperties(['u_maxbox','u_maxboxsize','u_numbersendlimit','u_megabytesendlimit','u_maxmessagesize','u_deleteolder','u_deleteolderdays','u_spamdeleteolder','u_localdomain','u_accounttype','a_state','u_inactivefor','u_accountvalid','u_accountvalidtill_date','u_validityreport','u_validityreportdays','u_deleteexpire'],function(p){this._data=p;this.toggle_account_quote_enabled._setValue(p.u_maxbox);this.input_account_quote_enabled._setValue(p.u_maxboxsize);if(p.u_megabytesendlimit.denied&&p.u_numbersendlimit.denied){this.toggle_send_out_limit._hide(true);}else{this.toggle_send_out_limit._checked(p.u_megabytesendlimit>0||p.u_numbersendlimit>0);this.input_send_out_data_limit._setValue(p.u_megabytesendlimit);this.input_send_out_message_limit._setValue(p.u_numbersendlimit);}
this.input_max_message_size._setValue(p.u_maxmessagesize);this.toggle_delete_mail_older_than._setValue(p.u_deleteolder);this.input_delete_mail_older_than._setValue(p.u_deleteolderdays);this.toggle_delete_spam_older_than._checked(p.u_spamdeleteolder>0);this.input_delete_spam_older_than._setValue(p.u_spamdeleteolder);this.toggle_user_can_send_to_local_domains_only._setValue(p.u_localdomain);var v=p.u_accounttype.value;this.toggle_disable_access_to_pop3._setValue(p.u_accounttype.value);if(v==0){this.toggle_disable_access_to_pop3._disabled(true);}else{this.toggle_disable_access_to_pop3._checked(v==2);}
this.dropdown_expiration_status._setValue(p.a_state.state);this.input_expires_if_inactive_for._setValue(p.u_inactivefor);this.toggle_expires_on._setValue(p.u_accountvalid);this.input_expires_on._setValue(p.u_accountvalidtill_date);this.toggle_notify_before_expiration._setValue(p.u_validityreport);this.input_notify_before_expiration._setValue(p.u_validityreportdays);this.toggle_delete_account_when_expired._setValue(p.u_deleteexpire);this.input_expires_on._disabled(!this.toggle_expires_on._checked());}.bind(this));}
_me._issaved=function(target){return!this._data.hasChanged();}
_me._save=function(callback){var view=this._view;if(this._data.hasChanged()){this._data.saveChanges(function(r){view.saveNotification(r==1);if(callback){callback(r==1);}});}}
_me._reset=function(){this._data.revertChanges();}
var AccountLimitsView=function(controller){this._control=controller;}
AccountLimitsView.prototype=Object.create(CoreView.prototype);AccountLimitsView.prototype.draw=function(){var ctrl=this._control;ctrl._draw('obj_accountlimits','',{});ctrl.input_account_quote_enabled._maxunit('GB');ctrl.toggle_delete_spam_older_than._onchange=function(state){if(!state){ctrl._data.u_spamdeleteolder.value=0;ctrl.input_delete_spam_older_than._value('');}}
ctrl.toggle_send_out_limit._onchange=function(state){if(!state){ctrl._data.u_megabytesendlimit.value=0;ctrl.input_send_out_data_limit._value('');ctrl._data.u_numbersendlimit.value=0;ctrl.input_send_out_message_limit._value('');}}
ctrl.toggle_disable_access_to_pop3._onchange=function(state){ctrl._data.u_accounttype.value=state+1;}}

/* client/inc/obj_accountmobiledevices.js */
function obj_accountmobiledevices(){};var _me=obj_accountmobiledevices.prototype;_me.__constructor=function(s){var me=this;storage.library('wm_user');storage.library('wm_device');me._lastCount=0;me._allCount=0;me._lastAccount=false;gui.frm_main.main._setHeadingButton();this._statusStrings={'-':getLang('mobile_devices::all_status'),'*1':getLang('mobile_devices::allowed'),'*2':getLang('mobile_devices::blocked'),'*3':getLang('mobile_devices::quarantine')};this._syncPeriods={'*0':getLang('mobile_devices::all_sync'),'*24':getLang('mobile_devices::last_24_hours'),'*168':getLang('mobile_devices::last_7_days'),'*672':getLang('mobile_devices::last_4_weeks')};if(!gui.frm_main.main.actions){gui.frm_main.main._cleanHeadingButtonsAnchor();gui.frm_main.main._setAlternativeButtons(function(box,target_anchor){if(!box._alternativeButtons){box._alternativeButtons=[];}
var actionobject=box._create('actions','obj_actionselect',target_anchor);actionobject._value('generic::select_action');if(target_anchor=='heading_buttons_mobile'){actionobject._addcss('full',true);}
actionobject._fill([{name:'allow',icon:false,onclick:function(){me._allowSelectedDevices();return false;},value:'mobile_devices::allow'},{name:'block',icon:false,onclick:function(){me._blockSelectedDevices();return false;},value:'mobile_devices::block'},{name:'delete',icon:false,onclick:function(){me._deleteSelectedDevices();return false;},value:'mobile_devices::delete'}]);actionobject._disabled(true);box._alternativeButtons.push(actionobject);});}
var filter_search=dataSet.get('devicelist-filter',['search-'+(location.parsed_query.account?location.parsed_query.account:location.parsed_query.domain)]);if(filter_search){gui.frm_main._setSearchString(filter_search);}};_me._onSearch=function(string){try
{dataSet.add('devicelist-filter',['search-'+(location.parsed_query.account?location.parsed_query.account:location.parsed_query.domain)],string);this.resetListVariables();gui.frm_main._setSearchResults(0);this.list._load();}
catch(e)
{log.error(['accountmobiledevices-onsearch',e]);}}
_me.resetListVariables=function(){this._lastCount=0;this._allCount=0;this._lastAccount=false;}
_me._load=function(domain)
{var me=this;me._draw('obj_accountmobiledevices','',{items:{}});this.list.dropdown_last_sync_filter._onchange=function(){dataSet.add('devicelist-filter',['sync-'+(location.parsed_query.account?location.parsed_query.account:location.parsed_query.domain)],this._value());me.resetListVariables();me.list._load();};this.list.dropdown_active_filter._onchange=function(){dataSet.add('devicelist-filter',['status-'+(location.parsed_query.account?location.parsed_query.account:location.parsed_query.domain)],this._value());me.resetListVariables();me.list._load();};this.list._onchange=function(e){if(e&&e.text=='select-all'){this._selectAll(e.type,true,true);}
if(me.list._getSelectedCount()==0){for(var i=0;i<gui.frm_main.main._alternativeButtons.length;i++)
{gui.frm_main.main._alternativeButtons[i]._text(getLang("generic::select_action"));gui.frm_main.main._alternativeButtons[i]._disabled(true);}}else{for(var i=0;i<gui.frm_main.main._alternativeButtons.length;i++)
{gui.frm_main.main._alternativeButtons[i]._text(getLang("generic::select_action")+" ("+me.list._getSelectedCount()+")");gui.frm_main.main._alternativeButtons[i]._disabled(false);}}
if(e&&e.text=='select-all'){return false;}}
this.list.dropdown_active_filter._fill(this._statusStrings);this.list.dropdown_last_sync_filter._fill(this._syncPeriods);this._main.onclick=function(e){var e=e||window.event,elm=e.target||e.srcElement;if(elm){var ul=Is.Child(elm,'UL',this);if(ul&&ul.getAttribute('hash')){location.hash=helper.translateHash(ul.getAttribute('hash'),location.parsed_query);}}};var doit=function(callback){var account='';if(location.parsed_query.account){account=location.parsed_query.account;}else if(location.parsed_query.domain){account=location.parsed_query.domain;}
var filter_status=dataSet.get('devicelist-filter',['status-'+(location.parsed_query.account?location.parsed_query.account:location.parsed_query.domain)]);if(typeof filter_status!='undefined'){me.list.dropdown_active_filter._value(filter_status,true);}
var filter_sync=dataSet.get('devicelist-filter',['sync-'+(location.parsed_query.account?location.parsed_query.account:location.parsed_query.domain)]);if(typeof filter_sync!='undefined'){me.list.dropdown_last_sync_filter._value(filter_sync,true);}
me.list._init('obj_accountmobiledevices',false,function(linesPerPage,page,callback){var item={};var lastsyncmask=me.list.dropdown_last_sync_filter._value();var statusmask=me.list.dropdown_active_filter._value();var namemask=gui.frm_main._getSearch();if(statusmask=='-'){statusmask=false;}
com.device.deviceList(account,linesPerPage,page,namemask,lastsyncmask,statusmask,function(result){log.log(['result',result]);var items=[];try
{if(result.Array.IQ[0].QUERY[0].RESULT[0].ITEM){var max=parseInt(result.Array.IQ[0].QUERY[0].RESULT[0].OVERALLCOUNT[0].VALUE);me.list._setMax(max);items=result.Array.IQ[0].QUERY[0].RESULT[0].ITEM;for(var i=0;i<items.length;i++){var os='default';if(items[i].DEVICETYPE[0]){var str=items[i].DEVICETYPE[0].VALUE.toLowerCase();if(str.search(/(windows)|(wp)|(outlook)/)>=0){os="windows";}
if(str.search(/android/)>=0){os="android";}
if(str.search(/blackberry/)>=0){os="blackberry";}
if(str.search(/(apple)|(ios)|(ipad)|(iphone)|(ipod)|(watch)/)>=0){os="ios";}}
var item={parsed_query:location.parsed_query,deviceid:(items[i].DEVICEID[0]?items[i].DEVICEID[0].VALUE:false),account:(items[i].ACCOUNT[0]?items[i].ACCOUNT[0].VALUE:false),name:(items[i].NAME[0]?items[i].NAME[0].VALUE:'-'),type:(items[i].DEVICETYPE[0]?items[i].DEVICETYPE[0].VALUE:false),class:os,model:(items[i].MODEL[0]?items[i].MODEL[0].VALUE:false),lastsync:(items[i].LASTSYNC[0]?helper.date(getLang("datetime::php_date")+" "+getLang("datetime::php_time_minutes"),items[i].LASTSYNC[0].VALUE):false),status:(items[i].STATUS[0]?me._statusStrings['*'+parseInt(items[i].STATUS[0].VALUE)]:false),hash:md5((items[i].ACCOUNT[0]?items[i].ACCOUNT[0].VALUE:'')),isdevice:true}
if(!me._lastAccount||me._lastAccount!=item.account){me.list._drawItem({isdevice:false,selectable:false,name:item.account,hash:md5(item.account)},function(elm,checked){var hash=elm._main.parentElement.getAttribute('group');[].slice.apply(me.list._getAnchor('body').getElementsByClassName(hash)).forEach(function(elm){var obj=eval(elm.querySelector('form.obj_checkbox').id);obj&&!obj._destructed&&obj._checked(checked);});});if(me._lastAccount){me.list._getAnchor('item_'+md5(me._lastAccount)+"_count").innerHTML="("+me._lastCount+")";}
me._lastAccount=item.account;me._lastCount=0;}
me._lastCount++;me._allCount++;me.list._drawItem(item);gui.frm_main._setSearchResults(max);if(max<=me._allCount){log.log(['last',max,linesPerPage,page,me._lastCount]);if(me._lastAccount){me.list._getAnchor('item_'+md5(me._lastAccount)+"_count").innerHTML="("+me._lastCount+")";}}}}}
catch(e)
{log.error(e);}});if(callback){callback();}});}
me.timeout=setInterval(function(){if(storage.css_status('obj_accountmobiledevices'))
{clearInterval(me.timeout);doit();}},100);}
_me._allowSelectedDevices=function(){var me=this;var list=me.list._getSelectedList();var devices=[];var statuses=[];var selected=me.list._getSelectedList();if(typeof selected=='string'&&selected=='all')
{log.info('All is selected');var lastsyncmask=me.list.dropdown_last_sync_filter._value();var statusmask=me.list.dropdown_active_filter._value();var namemask=gui.frm_main._getSearch();if(statusmask=='-'){statusmask=false;}
var who='';if(location.parsed_query.account){who=location.parsed_query.account;}else if(location.parsed_query.domain){who=location.parsed_query.domain;}
com.device.setAllStatus(who,{lastsyncmask:lastsyncmask,statusmask:statusmask,namemask:namemask},0,function(result){if(result.Array.IQ[0].QUERY[0].RESULT[0].VALUE==0){gui.message.error(getLang("error::save_unsuccessful"));}else{gui.message.toast(getLang("message::save_successfull"));me.list._emptySelectedList();me.resetListVariables();me.list._load();}});}
else
{for(var i=0;i<list.length;i++){devices.push(list[i].deviceid);statuses.push(0);}
var statuscheck=0;var succeeded=true;com.device.setStatus(devices,statuses,function(result){if(statuscheck<devices.length)
{statuscheck++;if(result.Array.IQ[0].QUERY[0].RESULT[0].VALUE==0){succeeded=false;}}
if(statuscheck>=devices.length)
{if(!succeeded){gui.message.error(getLang("error::save_unsuccessful"));me.list._emptySelectedList();me.resetListVariables();me.list._load();}else{gui.message.toast(getLang("message::save_successfull"));me.list._emptySelectedList();me.resetListVariables();me.list._load();}}});}}
_me._blockSelectedDevices=function(){var me=this;var list=me.list._getSelectedList();var devices=[];var statuses=[];var selected=me.list._getSelectedList();if(typeof selected=='string'&&selected=='all')
{log.info('All is selected');var lastsyncmask=me.list.dropdown_last_sync_filter._value();var statusmask=me.list.dropdown_active_filter._value();var namemask=gui.frm_main._getSearch();if(statusmask=='-'){statusmask=false;}
var who='';if(location.parsed_query.account){who=location.parsed_query.account;}else if(location.parsed_query.domain){who=location.parsed_query.domain;}
com.device.setAllStatus(who,{lastsyncmask:lastsyncmask,statusmask:statusmask,namemask:namemask},1,function(result){if(result.Array.IQ[0].QUERY[0].RESULT[0].VALUE==0){gui.message.error(getLang("error::save_unsuccessful"));}else{gui.message.toast(getLang("message::save_successfull"));me.list._emptySelectedList();me.resetListVariables();me.list._load();}});}
else
{for(var i=0;i<list.length;i++){devices.push(list[i].deviceid);statuses.push(1);}
var statuscheck=0;var succeeded=true;com.device.setStatus(devices,statuses,function(result){if(statuscheck<devices.length)
{statuscheck++;if(result.Array.IQ[0].QUERY[0].RESULT[0].VALUE==0){succeeded=false;}}
if(statuscheck>=devices.length)
{if(!succeeded){gui.message.error(getLang("error::save_unsuccessful"));me.list._emptySelectedList();me.resetListVariables();me.list._load();}else{gui.message.toast(getLang("message::save_successfull"));me.list._emptySelectedList();me.resetListVariables();me.list._load();}}});}}
_me._deleteSelectedDevices=function(){var me=this;var num=0;num=this.list._getSelectedCount();gui.message.warning(getLang("warning::delete_selected_devices",[num]),false,[{value:getLang("generic::cancel"),method:'close'},{value:getLang("generic::delete"),onclick:function(closeCallback){var selected=me.list._getSelectedList();if(typeof selected=='string'&&selected=='all')
{log.info('All is selected');var lastsyncmask=me.list.dropdown_last_sync_filter._value();var statusmask=me.list.dropdown_active_filter._value();var namemask=gui.frm_main._getSearch();if(statusmask=='-'){statusmask=false;}
var who='';if(location.parsed_query.account){who=location.parsed_query.account;}else if(location.parsed_query.domain){who=location.parsed_query.domain;}
com.device.deleteAllDevices(who,{lastsyncmask:lastsyncmask,statusmask:statusmask,namemask:namemask},function(result){closeCallback();me.list._emptySelectedList();me.resetListVariables();me.list._load();});}
else
{com.device.deleteDevices(selected,function(result){closeCallback();me.list._emptySelectedList();me.resetListVariables();me.list._load();});}},type:'text error'},]);}

/* client/inc/obj_accountpicker.js */
function obj_accountpicker(){};var _me=obj_accountpicker.prototype;_me.__constructor=function(s){var me=this;storage.library('wm_user');storage.library('wm_domain');this._initialized=false;this._domainsLoaded=false;this._working=false;this._selectedList=[];this._settings={};me.admintypes={'0':getLang('userlist::user'),'1':getLang('userlist::admin'),'2':getLang('userlist::domain_admin'),'3':getLang('userlist::webadmin')}
me.accounttypes={'-':getLang('accountdetail::all_types'),'*0':getLang('userlist::user'),'*1':getLang('userlist::mailing_list'),'*2':getLang('userlist::executable'),'*3':getLang('userlist::notification'),'*4':getLang('userlist::static_route'),'*5':getLang('userlist::catalog'),'*6':getLang('userlist::list_server'),'*7':getLang('userlist::group'),'*8':getLang('userlist::resource')};me._domainTypes={'-':getLang('domainlist::all_types'),'*0':getLang('domainlist::standard'),'*2':getLang('domainlist::domain_alias'),'*3':getLang('domainlist::backup_domain'),'*4':getLang('domainlist::distributed_domain'),'*1':getLang('domainlist::etrn_atrn_queue')}};_me._openDomainlist=function(){var me=this;this._parent._setBackButton();this._parent._setHeading(getLang('accountpicker::domains'));try
{this._parent._initSearch(function(string){try
{dataSet.add('accountpicker-filter',['search'],string);}
catch(e)
{log.error(['accountpicker-opendomainlist',e]);}
me.domainlist._load();});if(dataSet.get('accountpicker-filter',['search'])){log.log(['accountpicker-opendomainlist',dataSet.get('accountpicker-filter',['search'])]);this._parent._setSearchString(dataSet.get('accountpicker-filter',['search']));}}
catch(e)
{log.error(['accountpicker-opendomainlist',e]);}
if(!me._settings||!me._settings.disable_add_domain){this._parent.btn_add_domain._show();}
this._parent.btn_add_account._hide();this._getAnchor('userlist').setAttribute('is-hidden',1);this._getAnchor('domainlist').removeAttribute('is-hidden');if(!this.domainlist)
{var domainlist=this._create('domainlist','obj_loadable','domainlist');if(me._settings.singledomain){domainlist._selectionCounter(false);}
else{domainlist._selectionCounter(true);}
domainlist._label('obj_accountpicker_domainlist_header');domainlist._value('obj_accountpicker_domainlist_item');if(me._settings.singledomain){addcss(domainlist._main,'singledomain');}
me._main.onclick=function(e){var e=e||window.event,elm=e.target||e.srcElement;if(elm){var li=Is.Child(elm,'LI',this);var domain=false;if(li&&li.getAttribute('domain-id')){domain=li.getAttribute('domain-id');if(me._settings.domainpicker){li.parentElement._objects[0]._checked(true);log.log(['accountpicker-click',me.domainlist._getSelectedList()]);if(me._callback){me._callback(me.domainlist._getSelectedList(),0);}
me._parent._parent._close();}else{me._openUserlist(domain);}}}};this.domainlist._onchange=function(){if(this._getSelectedCount()>0){me._parent.btn_add_domain._disabled(false);}else{me._parent.btn_add_domain._disabled(true);}}
this.domainlist._init('obj_accountpicker',false,function(linesPerPage,page,callback){try
{var namemask=me._parent._getSearch();var typemask=false;com.domain.list(linesPerPage,page,namemask,typemask,[function(aResponse){try
{var info={count:(aResponse.Array.IQ[0].QUERY[0].RESULT[0].OVERALLCOUNT&&aResponse.Array.IQ[0].QUERY[0].RESULT[0].OVERALLCOUNT[0]&&aResponse.Array.IQ[0].QUERY[0].RESULT[0].OVERALLCOUNT[0].VALUE?aResponse.Array.IQ[0].QUERY[0].RESULT[0].OVERALLCOUNT[0].VALUE:'-')};if(info.count==0){return false;}
if(aResponse.Array.IQ[0].QUERY[0].RESULT[0].ITEM)
{for(var i=0;i<aResponse.Array.IQ[0].QUERY[0].RESULT[0].ITEM.length;i++){var itm=aResponse.Array.IQ[0].QUERY[0].RESULT[0].ITEM[i];var item={id:itm.NAME[0].VALUE,unpunied:punycode.ToUnicode(itm.NAME[0].VALUE),name:itm.NAME[0].VALUE,users:itm.ACCOUNTCOUNT[0].VALUE,description:(itm.DESC&&itm.DESC[0]&&itm.DESC[0].VALUE?itm.DESC[0].VALUE:''),type:(me._domainTypes['*'+itm.DOMAINTYPE[0].VALUE]?me._domainTypes['*'+itm.DOMAINTYPE[0].VALUE]:0)};log.log(['accountpicker-exclude.',me._settings]);if(me._settings.exclude&&me._settings.exclude.domains){var exclude=false;for(var ex=0;ex<me._settings.exclude.domains.length;ex++){if(me._settings.exclude.domains[ex]==item.id){exclude=true;}
log.log(['accountpicker-exclude',item.id,exclude]);}
if(!exclude){var line=me.domainlist._drawItem(item);}}
else{var line=me.domainlist._drawItem(item);}}}
me.domainlist._setMax(info.count);if(callback){callback();}}
catch(e)
{log.error(e);}}]);}
catch(e)
{log.error(e);}});}
if(this.domainlist._getSelectedCount()>0){me._parent.btn_add_domain._disabled(false);}else{me._parent.btn_add_domain._disabled(true);}}
_me._openUserlist=function(domain){var me=this;this._initialized=true;this._selectedDomain=domain;this._parent._setHeading(punycode.ToUnicode(domain));this._parent._setBackButton(function(){me._openDomainlist();});this._parent._initSearch(function(string){me.userlist._load();});this._parent.btn_add_domain._hide();this._parent.btn_add_account._show();this._getAnchor('domainlist').setAttribute('is-hidden',1);this._getAnchor('userlist').removeAttribute('is-hidden');log.log(["accountpicker-openuserlist",domain]);if(!this.userlist)
{var userlist=this._create('userlist','obj_loadable','userlist');userlist._selectionCounter(true);userlist._label('obj_accountpicker_userlist_header');userlist._value('obj_accountpicker_userlist_item');this.userlist.dropdown_userlist_filter._fill(this.accounttypes);this.userlist.dropdown_userlist_filter._onchange=function(){me.userlist._load();}
this.userlist._onchange=function(){if(this._getSelectedCount()>0){me._parent.btn_add_account._disabled(false);}else{me._parent.btn_add_account._disabled(true);}}
this.userlist._init('obj_accountpicker',false,function(linesPerPage,page,callback){if(me._selectionShown){return false;}
var namemask=me._parent._getSearch();var typemask=false;if(me.userlist.dropdown_userlist_filter._value()!='-'){typemask=me.userlist.dropdown_userlist_filter._value();}
if(!me._working){me._working=true;com.user.list(me._selectedDomain,linesPerPage,page,namemask,typemask,[function(aResponse){try
{var items=[];me._working=false;if(aResponse.Array.IQ[0].QUERY[0].RESULT[0].OVERALLCOUNT[0].VALUE)
{max=parseInt(aResponse.Array.IQ[0].QUERY[0].RESULT[0].OVERALLCOUNT[0].VALUE);me.userlist._setMax(max);}
if(aResponse.Array.IQ[0].QUERY[0].RESULT[0].ITEM)
{for(var i=0;i<aResponse.Array.IQ[0].QUERY[0].RESULT[0].ITEM.length;i++){var itm=aResponse.Array.IQ[0].QUERY[0].RESULT[0].ITEM[i];var isQuota=false;var quota_size='0 B';var quota=0;var size='0 B';if(itm.QUOTA[0].MAILBOXSIZE[0].VALUE&&itm.QUOTA[0].MAILBOXQUOTA[0].VALUE)
{var mailboxsize=parseInt(itm.QUOTA[0].MAILBOXSIZE[0].VALUE)*1024;var mailboxquota=parseInt(itm.QUOTA[0].MAILBOXQUOTA[0].VALUE)*1024;size=helper.bytes2hr(mailboxsize);if(mailboxquota>0)
{quota_size=helper.bytes2hr(mailboxquota);isQuota=true;quota=Math.round((mailboxsize/mailboxquota)*10000)/100;log.log(itm,quota);}}
var accounttype_str='';var accounttype=0;var admintype=0;var admintype_str='';if(itm.ACCOUNTTYPE[0].VALUE){accounttype_str=me.accounttypes['*'+itm.ACCOUNTTYPE[0].VALUE];accounttype=itm.ACCOUNTTYPE[0].VALUE;if(accounttype=='0'){admintype_str=me.admintypes[itm.ADMINTYPE[0].VALUE];admintype=itm.ADMINTYPE[0].VALUE;}}
var item={id:itm.EMAIL[0].VALUE,unpunied:punycode.ToUnicode(itm.EMAIL[0].VALUE),num:i,type:accounttype,type_str:accounttype_str,hasSubtype:(accounttype=='0'),subtype:admintype,subtype_str:admintype_str,isQuota:isQuota,quota:quota,quotaSize:quota_size,size:size,name:itm.NAME[0].VALUE,email:itm.EMAIL[0].VALUE,image:(itm.IMAGE&&itm.IMAGE[0]?'data:'+itm.IMAGE[0].CONTENTTYPE[0].VALUE+';base64,'+itm.IMAGE[0].BASE64DATA[0].VALUE:'')};log.log(['accountpicker-exclude.',me._settings]);if(me._settings.exclude&&me._settings.exclude.accounts){var exclude=false;for(var ex=0;ex<me._settings.exclude.accounts.length;ex++){if(me._settings.exclude.accounts[ex]==item.id){exclude=true;}
log.log(['accountpicker-exclude',item.id,exclude]);}
if(!exclude){var line=me.userlist._drawItem(item);}}else{var line=me.userlist._drawItem(item);}
if(line){line.onclick=function(line){return function(){line._objects[0]._checked(!line._objects[0]._checked());return false;}}(line);}}}
if(callback){callback();}}
catch(e)
{me._working=false;log.error(e);}}]);}});}
else
{this.userlist._load();}
if(this.userlist._getSelectedCount()>0){me._parent.btn_add_account._disabled(false);}else{me._parent.btn_add_account._disabled(true);}}
_me._init=function(callback,settings)
{var that=this;var me=this;me._callback=callback;if(settings){this._settings=settings;}
that._draw('obj_accountpicker','',{items:{}});dataSet.add('accountpicker-filter',['search'],'');this._parent.btn_add_external._hide();this._parent.btn_add_external._onclick=function(){var popup=gui._create('popup','obj_popup');popup._init({fixed:false,iwattr:{height:'auto',width:'medium'},name:'header',heading:{value:getLang("accountpicker::add_external_members")},footer:'default'});var optional={name:me.__name}
optional[me.__name]=true;popup.main._draw('obj_consoledialog_longstring','main_content',optional);popup.main.btn_save._value("generic::add");popup.main.btn_save._onclick=function(){var content=popup.main.textarea._value().replace(/;/g,"\n").replace(/\r\n/g,"\n").replace(/\r/g,"\n").split("\n");for(var i=0;i<content.length;i++){if(helper.trim(content[i])!='')
{me.userlist._selectedList.push({id:helper.trim(content[i]),email:helper.trim(content[i]),name:'',type:'external',type_str:getLang('userlist::external'),unpunied:punycode.ToUnicode(helper.trim(content[i]))});}}
me.userlist._selectionInfoRefresh();me.userlist._onchange();popup._close();}}
this._parent.btn_add_account._onclick=function(){if(callback){callback(me.userlist._getSelectedList(),1);}
me._parent._parent._close();}
this._parent.btn_add_domain._onclick=function(){if(callback){callback(me.domainlist._getSelectedList(),0);}
me._parent._parent._close();}
if(me._settings.domainpicker){this._openDomainlist();if(me._settings.singledomain){me._parent.btn_add_domain._hide();}
this._initComponents();}else{var user=new Account(location.parsed_query.account);user.getPropertySet(['U_MasterDomain'],function(result){me._openUserlist((result.U_MasterDomain&&result.U_MasterDomain.toString())||gui._activeDomain);me._initComponents();});}}
_me._initComponents=function(){if(this._settings&&this._settings.allow_external_accounts){this._parent.btn_add_external._show();}
if(this._settings&&this._settings.disable_add_domain){this._parent.btn_add_domain._hide();}
if(this._settings.type&&this._settings.type.value){this.userlist.dropdown_userlist_filter._value(this._settings.type.value);}
if(this._settings.type&&this._settings.type.force){this.userlist.dropdown_userlist_filter._disabled(true);}
if(this._settings.type&&this._settings.type.allowed){if(typeof this._settings.type.allowed!='object'){this._settings.type.allowed=[this._settings.type.allowed];}
var allowed={};for(var key in this.accounttypes){for(var i=0;i<this._settings.type.allowed.length;i++){if(key.replace('*','')==this._settings.type.allowed[i].toString()){allowed[key]=this.accounttypes[key];}}}
this.userlist.dropdown_userlist_filter._fill(allowed);}
if(this._settings.type&&this._settings.type.value){this.userlist.dropdown_userlist_filter._value(this._settings.type.value);}
if(this._settings.type&&typeof this._settings.type.force!='undefined'){this.userlist.dropdown_userlist_filter._disabled(this._settings.type.force);}}
gui.accountpicker=function(callback,settings){var popup=gui._create('popup','obj_popup');popup._init({name:'accountpicker',fixed:false,iwattr:{height:'full',width:'medium'},heading:{value:getLang('accountdetail::accountpicker')},footer:'obj_accountpicker_footer',content:'obj_accountpicker'});popup.content._init(callback,settings);}

/* client/inc/obj_accountrules.js */
function obj_accountrules(){};var _me=obj_accountrules.prototype;_me.__constructor=function(s){var me=this;storage.library('wm_user');};_me._load=function(domain)
{log.log('Load list of users for domain '+domain);var that=this;that._draw('obj_accountrules','',{items:{}});var doit=function(callback){var account='';if(location.parsed_query.account){account=location.parsed_query.account;}
com.user.rules(account,[function(aResponse){var items=[];if(callback){callback();}}]);}
that._main.onclick=function(e){};that.timeout=setInterval(function(){if(storage.css_status('obj_accountrules'))
{clearInterval(that.timeout);doit();}},100);}

/* client/inc/obj_actionselect.js */
_me=obj_actionselect.prototype;function obj_actionselect(){};_me.__constructor=function(){var me=this;this._shown=false;this.__filleddata=[];this._create('button','obj_button');if(this.__attributes['button_css']){this.button._addcss(this.__attributes['button_css']);}else{this.button._addcss('text secondary');this.button._iwAttr('type','select');}
this._displayselect=false;if(this.__attributes.display&&this.__attributes.display.toLocaleLowerCase()=='select'){this._displayselect=true;}
this._create('actions','obj_tabmenu');addcss(this.actions._main,'menu obj_tabmenu');this.actions._iwAttr('type','selector');this._hideBubble();this.button._onclick=function(e){if(me._onclick()!==false){if(me._shown)
{me._hideBubble();}
else
{me._showBubble();}}};this.button._main.onmouseup=function(e){e.stopPropagation();e.cancelBubble=true;}
gui._obeyEvent('mouseup',[this,'_onouterclick']);gui._obeyEvent('blur',[this,'_onouterclick']);this._add_destructor('__onbeforedestruct');};_me._fill=function(data){var me=this;this.__filleddata=data;if(this._displayselect){for(var i=0;i<data.length;i++){var oc=(data[i].onclick?data[i].onclick:function(){});data[i].onclick=function(x,value){me._value(value);oc(x,value);return false;}}}
this.actions._fill(data);if(this._displayselect){if(data[0]){this._value(data[0].name);}}}
_me.__onbeforedestruct=function(){gui._disobeyEvent('mouseup',[this,'_onouterclick']);gui._disobeyEvent('blur',[this,'_onouterclick']);};_me._showBubble=function(){if(document.createEvent){var evt=document.createEvent("HTMLEvents");evt.initEvent("blur",false,true);window.dispatchEvent(evt);}else{window.fireEvent("onblur");}
this._shown=true;this.actions._main.removeAttribute('is-hidden');}
_me._hideBubble=function(){this._shown=false;this.actions._main.setAttribute('is-hidden',1);}
_me._onclick=function(){}
_me._disabled=function(sDisabled){this.button._disabled(sDisabled);};_me._addcss=function(css,onbox){if(onbox){addcss(this._main,css);}else{this.button._addcss(css);}}
_me._removecss=function(css,onbox){if(onbox){removecss(this._main,css);}else{this.button._removecss(css);}}
_me._value=function(sValue,ignoreonchange){if(this._displayselect){if(this.__filleddata[0]){if(typeof sValue!='undefined')
{for(var i=0;i<this.__filleddata.length;i++){if(this.__filleddata[i].name==sValue){this.button._value(this.__filleddata[i].value);this._selectvalue=sValue;if(this._onchange&&!ignoreonchange){this._onchange(sValue);}
return sValue;}}}
else
{return this._selectvalue;}}}
return this.button._value(sValue);};_me._text=function(sValue){return this.button._text(sValue);};_me._title=function(sValue){return this.button._title(sValue);};_me._hide=function(){addcss(this._main,'hide');}
_me._show=function(){removecss(this._main,'hide');}
_me._onouterclick=function(){var me=this;if(me._shown)
{me._hideBubble();}}

/* client/inc/obj_audio.js */
_me=obj_audio.prototype;function obj_audio(){};_me.__constructor=function(){var me=this;var elm=mkElement('audio',{"name":this._pathName+'#main',"id":this._pathName+'#main'});this._main.appendChild(elm);this._main.setAttribute('style','display:none');this._playing=false;this._waiting=false;me.__volume=1;elm.className=this._type=='obj_audio'?'obj_audio':'obj_audio '+this._type;this._elm=elm;if(this.__attributes.title){}
this._elm.onended=function(){if(me._onended){me._onended();}}
this._types={'mp3':'audio/mpeg','ogg':'audio/ogg','wav':'audio/wav','aac':'audio/aac','m4a':'audio/x-m4a'}};_me._addcss=function(css){addcss(this._main,css);}
_me._removecss=function(css){removecss(this._main,css);}
_me._iwAttr=function(arr,val){if(typeof arr!='object'){n={};n[arr]=val;arr=n;}
for(var key in arr){this._main.setAttribute('iw-'+key,arr[key]);}}
_me._addSource=function(file){var me=this;var type=file.split('.');type=type[type.length-1].toLowerCase();if(me._types[type]){var source=mkElement('source',{"src":file,"type":me._types[type]});me._elm.appendChild(source);}else{log.error(['audio-addsource','unsupported file type "'+type+'"']);}}
_me._stop=function(){if(this._waiting){clearTimeout(this._waiting);this._waiting=false;}
if(this._playing){clearTimeout(this._playing);this._playing=false;}
this._elm.pause();this._elm.currentTime=0;}
_me._fadeOut=function(time,pause){if(!time){time=1000;}
var me=this;me.__fadeout=setInterval(function(){me.__volume=me.__volume-25/time;if(me.__volume<0){me.__volume=0;clearInterval(me.__fadeout);if(pause){me._pause();}else{me._stop();}
me._elm.volume=1;me.__volume=1;}else{log.log(['volume',me.__volume]);me._elm.volume=me.__volume;}},Math.round((1000/time)/(25/time)));}
_me._pause=function(){if(this._waiting){clearTimeout(this._waiting);this._waiting=false;}
if(this._playing){clearTimeout(this._playing);this._playing=false;}
this._elm.pause();}
_me._play=function(duration,delay,start){var me=this;me.__volume=1;me._elm.volume=1;me.__start=start;me.__duration=duration;if(this._waiting){clearTimeout(this._waiting);}
if(delay){me._waiting=setTimeout(function(){me._elm.pause();if(!me.__continuous&&!this.__continuous){me._elm.currentTime=0;}
if(start){this._elm.currentTime=start/1000;}
me._play(duration);},delay);return;}
if(this._playing&&!this.__continuous){clearTimeout(this._playing);}
this._elm.pause();if(!me.__continuous){this._elm.currentTime=0;}
if(start&&!me.__continuous){this._elm.currentTime=start/1000;}
me._elm.play();if(duration){me._playing=setTimeout(function(){if(me.__continuous){me._pause();}else{me._stop();}},duration);}}
_me._playContinuous=function(duration,delay,start){var me=this;me.__continuous=true;me._play(duration,delay,start);}
_me._onended=function(){var me=this;if(me.__continuous){me._playContinuous(me.__duration,false,me.__start);}}
_me._isPlaying=function(){return(this._playing?true:false);}

/* client/inc/obj_bar.js */
_me=obj_bar.prototype;function obj_bar(){};_me.__constructor=function(){var me=this;try
{var elmlabel=mkElement('span',{});addcss(elmlabel,'bar-text');var elmfill=mkElement('div',{});addcss(elmfill,'bar-fill');this._main.appendChild(elmlabel);this._main.appendChild(elmfill);this._elmfill=elmfill;this._elmlabel=elmlabel;this._elm=this._main;addcss(this._elm,'bar');}
catch(e)
{log.error(e);}
this._elm.onclick=this._main.onclick=function(e){var e=e||window.event,elm=e.target||e.srcElement;if(this==elm){if(!me._disabled()){if(me._onclick)
me._onclick(e);}}
return true;};this._elm.onfocus=function(e){var e=e||window.event;me.__hasFocus=true;if(me._onfocus)me._onfocus(e);me.__exeEvent('onfocus',e,{"owner":me});log.log('Element "'+this.id+'" focused');addcss(me._main,'focus');return true;};this._elm.onblur=function(e){var e=e||window.event;me.__hasFocus=false;if(me._onblur&&me._onblur(e)===false)return false;me.__exeEvent('onblur',e,{"owner":me});log.log('Element "'+this.id+'" blured');removecss(me._main,'focus');return true;};this._main.oncontextmenu=function(e){var e=e||window.event,elm=e.target||e.srcElement;if(me._oncontext&&me._oncontext(e)!==false)
me.__exeEvent('oncontext',e,{"owner":me});};};_me._label=function(sValue){return this._elmlabel.innerHTML=helper.htmlspecialchars(sValue);};_me._value=function(percent){this._elmfill.style.width=percent+"%";}
_me._disabled=function(){}

/* client/inc/obj_block_tab.js */
_me=obj_block_tab.prototype;function obj_block_tab(){};_me.__constructor=function(){this.__tabIndexes={};this.__lastFocus='';};_me.__addTabIndex=function(obj,sContainer,i){sContainer=sContainer||'main';if(!this.__tabIndexes[sContainer])
this.__tabIndexes[sContainer]=[];if(typeof i!='undefined'&&this.__tabIndexes[sContainer].length)
this.__tabIndexes[sContainer].splice(i,0,obj._pathName);else
this.__tabIndexes[sContainer].push(obj._pathName);return true;};_me.__removeTabIndex=function(obj){var i,j;for(i in this.__tabIndexes)
if((j=inArray(this.__tabIndexes[i],obj._pathName))>-1)
this.__tabIndexes[i].splice(j,1);};_me._tabIndexPrev=function(obj,bReturn){var i,j=-1;for(i in this.__tabIndexes)
if((j=inArray(this.__tabIndexes[i],obj._pathName))>-1)
break;if(j>-1){j--;if(j<0)
j=this.__tabIndexes[i].length-1;if(j>-1)
try{var tmp=(eval(this.__tabIndexes[i][j]));if(tmp._focus)
if(tmp._disabled&&tmp._disabled())
this._tabIndexPrev(tmp,bReturn);else
if(bReturn)
return tmp;else{if(tmp._focus(true)===false)
return this._tabIndexPrev(tmp,bReturn);else
if(tmp._setRange&&tmp._value)
tmp._setRange(0,tmp._value().length);}
return true;}
catch(e){this.__tabIndexes[i].splice(j,1);if(this.__tabIndexes[i].length)
return this._tabIndexPrev(obj,bReturn);}}};_me._tabIndexNext=function(obj,bReturn){var i,j=-1;for(i in this.__tabIndexes)
if((j=inArray(this.__tabIndexes[i],obj._pathName))>-1)
break;if(j>-1){j++;if(j>this.__tabIndexes[i].length-1)
j=0;try{var tmp=(eval(this.__tabIndexes[i][j]));if(tmp._focus)
if(tmp._disabled&&tmp._disabled())
this._tabIndexNext(tmp,bReturn);else
if(bReturn)
return tmp;else{if(tmp._focus(true)===false)
return this._tabIndexNext(tmp,bReturn);else
if(tmp._setRange&&tmp._value)
tmp._setRange(0,tmp._value().length);}
return true;}
catch(r){this.__tabIndexes[i].splice(j,1);if(this.__tabIndexes[i].length)
return this._tabIndexNext(obj,bReturn);}}};

/* client/inc/obj_certificates.js */
var obj_certificates=(function(_super){__extends(obj_certificates,_super);function obj_certificates(){_super.call(this);var me=this;var parent=this._parent;me._defaultTab='server';this._add_destructor('__onbeforedestruct');}
obj_certificates.prototype.__onbeforedestruct=function(){};obj_certificates.prototype._getMenuDefinition=function(callback){var me=this;var menu=[];var defaultTab='';defaultTab='server';menu=[{isdefault:true,name:'server',icon:'none',value:'certificates::server_certificates',callback:function(name){me._tabmenuCallback(name);}},{name:'ca',icon:'none',value:'certificates::ca_certificates',callback:function(name){me._tabmenuCallback(name);}},{name:'secure_destinations',icon:'none',value:'certificates::secure_destinations',callback:function(name){me._tabmenuCallback(name);}}];callback(menu,defaultTab);};obj_certificates.prototype._tabmenuCallback=function(name){var me=this;var parent=this._parent;if(!name){name='';}
log.info(['certificates-tabmenucallback-name',name]);gui.frm_main.main._setHeadingButton();if(name==''){name=me._defaultTab;}
parent._clean('main_content');log.info('Menu with ID "'+name+'" selected');switch(name){case'':case"server":if(!parent.certificates_server){parent._create('certificates_server','obj_certificates_server','main_content');}
parent.certificates_server._load();break;case"ca":if(!parent.certificates_ca){parent._create('certificates_ca','obj_certificates_ca','main_content');}
parent.certificates_ca._load();break;case"secure_destinations":if(!parent.certificates_secure_destinations){parent._create('certificates_secure_destinations','obj_certificates_secure_destinations','main_content');}
parent.certificates_secure_destinations._load();break;}};obj_certificates.prototype._hash_handler=function(){var me=this;try{me._getMenuDefinition(function(menuDefinition,defaultTab){me._defaultTab=defaultTab;gui.frm_main.main._init({name:'certificates',heading:{value:getLang('main::certificates')},menu:{hashTemplate:"menu=/MENU/",items:menuDefinition}});});}
catch(e){log.error([e,me]);}};return obj_certificates;}(obj_generic));

/* client/inc/obj_certificates_ca.js */
_me=obj_certificates_ca.prototype;function obj_certificates_ca(){};_me.__constructor=function(s){var me=this;var parent=this._parent;storage.library('wm_certificates');this._add_destructor('__onbeforedestruct');};_me.__onbeforedestruct=function(){}
_me._load=function(){var me=this;me._draw('obj_certificates_ca');}

/* client/inc/obj_certificates_secure_destinations.js */
_me=obj_certificates_secure_destinations.prototype;function obj_certificates_secure_destinations(){};_me.__constructor=function(s){var me=this;var parent=this._parent;storage.library('wm_certificates');this._add_destructor('__onbeforedestruct');};_me.__onbeforedestruct=function(){}
_me._load=function(){var me=this;me._draw('obj_certificates_secure_destinations');}

/* client/inc/obj_certificates_server.js */
_me=obj_certificates_server.prototype;function obj_certificates_server(){};obj_certificates_server.statustype=['neutral','ok','warning','error'];obj_certificates_server.certificateerrors=['',getLang('error::cert_some_domains_were_not_verified'),getLang('error::cert_requesting_challenges_for_domain_verification'),getLang('error::cert_parsing_challenges_for_domain_verification'),getLang('error::cert_triggering_challenges_challenges_for_domain_verification'),getLang('error::cert_registering_acme_account'),getLang('error::cert_invalid_csr_detected'),getLang('error::cert_signing_certificate'),getLang('error::cert_letsEncrypt_rate_limits_applied')];obj_certificates_server.domainerrors=[getLang('certificates::domain_unknown'),getLang('certificates::domain_error'),getLang('certificates::domain_valid'),getLang('certificates::domain_invalid'),getLang('certificates::domain_timeout')];_me.__constructor=function(s){var me=this;var parent=this._parent;storage.library('wm_certificates');gui.frm_main.main._setAlternativeButtons(function(box,target_anchor){if(!box._alternativeButtons){box._alternativeButtons=[];}
var add=box._create('button_add','obj_button',target_anchor);add._addcss('text primary');add._value('generic::add');box._alternativeButtons.push(add);var reissue=box._create('button_reissue','obj_button',target_anchor);reissue._disabled(true);reissue._addcss('text primary');reissue._value('certificates::reissue');box._alternativeButtons.push(reissue);var dflt=box._create('button_set_default','obj_button',target_anchor);dflt._disabled(true);dflt._addcss('text primary');dflt._value('certificates::set_as_default');box._alternativeButtons.push(dflt);var del=box._create('button_delete','obj_button',target_anchor);del._disabled(true);del._addcss('text error');del._value('generic::delete');box._alternativeButtons.push(del);});this._add_destructor('__onbeforedestruct');};_me.__onbeforedestruct=function(){}
_me._load=function(){var me=this;var parent=me._parent;me._draw('obj_certificates_server');parent.button_add._onclick=function(){me._showCertificateWizard();}
parent.button_reissue._onclick=function(){me._showCertificateWizard(true);}
parent.button_set_default._onclick=function(){me._setSelectedCertificateAsDefault();}
parent.button_delete._onclick=function(){me._deleteSelectedCertificates();}
this.list._init('obj_certificates_server',false,function(linesPerPage,page,callback){me.list._setMax(false);com.certificates.server([function(aData){log.log(['certificates-load',aData]);if(aData[0]){for(var i=0;i<aData.length;i++){log.log(['certificates-load-item',aData[i]]);if(!aData[i].ipaddress.length){aData[i].ipaddresses=getLang('certificates::no_ip_limit');}else{aData[i].ipaddresses=aData[i].ipaddress.join(', ');}
aData[i].hostnames=aData[i].hostname.join(', ');aData[i].typename=getLang('certificates::type_normal');if(aData[i].certtype==2){aData[i].typename=getLang('certificates::type_csr');}
if(aData[i].automaticengine==1){aData[i].typename=getLang('certificates::type_letsencrypt');}
if(aData[i].expiration){var expired=aData[i].expiration.split('/');expired=new Date(expired[0],expired[1]-1,expired[2]);aData[i].expired=(expired.getTime()-new Date().getTime())<0;}else{aData[i].expired=true;aData[i].expiration='';}
aData[i].verified=!parseInt(aData[i].verify);aData[i].issuer=false;for(var n in aData[i].issuerinfo){if(aData[i].issuerinfo[n]){aData[i].issuer=true;break;}}
aData[i].subject=false;for(var n in aData[i].subjectinfo){if(aData[i].subjectinfo[n]){aData[i].subject=true;break;}}
if(aData[i].error){aData[i].error.message=obj_certificates_server.certificateerrors[aData[i].error.lasterror];aData[i].error.when=new Date().setUNIX(aData[i].error.lastattempt).toWMString(false,false,false,true);if(aData[i].error.faileddomains.length){for(var j=aData[i].error.faileddomains.length;j--;){aData[i].error.faileddomains[j]=aData[i].error.faileddomains[j].domainname+' : '+obj_certificates_server.domainerrors[aData[i].error.faileddomains[j].resultcode];}}else{aData[i].error.faileddomains=false;}}
aData[i].status=obj_certificates_server.statustype[aData[i].status];var line=me.list._drawItem(aData[i]);line.onclick=function(){var item=this._item;me._editCertificate(item);};}}
if(callback){callback.call(me,aData);}}]);});this.list._onchange=function(){var list=me.list._getSelectedList();var hasdefault=list.some(function(item){return item.isdefault;});switch(me.list._getSelectedCount()){case 0:parent.button_delete._disabled(true);parent.button_reissue._disabled(true);parent.button_set_default._disabled(true);break;case 1:parent.button_reissue._disabled(false);if(list[0].isdefault){parent.button_delete._disabled(true);}else{parent.button_delete._disabled(false);parent.button_set_default._disabled(false);}
break;default:parent.button_delete._disabled(hasdefault);parent.button_reissue._disabled(true);parent.button_set_default._disabled(true);}}}
_me._showCertificateWizard=function(edit){var me=this;if(edit)
edit=me.list._getSelectedList()[0];var popup=gui._create('popup','obj_popup');popup._init({name:'certificate_wizard',heading:{value:getLang('certificates::wizard')},iwattr:{height:'full',width:'medium'},fixed:false,footer:'default',content:"obj_certificates_server_wizard"});popup.content._certificatesList=me.list;popup.content._load(edit);}
_me._editCertificate=function(data){var me=this;var popup=gui._create('popup','obj_popup');log.log(['certificates-server-editcertificates',data]);popup._init({name:'edit_certificate',heading:{value:getLang('certificates::edit')},iwattr:{height:'full',width:'medium'},fixed:false,footer:'default',content:"obj_certificates_server_edit"});popup.content._certificatesList=me.list;popup.content._load(data);}
_me._doTheDelete=function(closeCallback){var me=this;if(me._deleteItemsList&&me._deleteItemsList[0]){var deleteItem=me._deleteItemsList[me._deleteItemsList.length-1];log.log(['certificates-server-deleteselectedcertificates-click',deleteItem]);com.certificates.delete(deleteItem.id,function(success,error){try
{if(success){me._deleteItemsList.splice(me._deleteItemsList.length-1,1);me._doTheDelete(closeCallback);}else{me._deleteItemsList=[];me.list._emptySelectedList();me.list._load();closeCallback();gui.message.error(getLang("error::delete_unsuccessful"));}}
catch(e)
{log.error(['certificates-server-dothedelete',e]);}});}else{me._deleteItemsList=[];me.list._emptySelectedList();me.list._load();closeCallback();gui.message.toast(getLang("message::delete_successfull"));}}
_me._setSelectedCertificateAsDefault=function(){var me=this;var defid=this.list._getSelectedList();if(defid&&defid[0]){me._parent.button_set_default._disabled(true);com.certificates.setasdefault(defid[0].id,function(success,error){me._parent.button_set_default._disabled(false);me.list._emptySelectedList();me.list._load();});}}
_me._deleteSelectedCertificates=function(){var me=this;gui.message.warning(getLang('warning::delete_selected_certificates')+" ("+me.list._getSelectedCount()+")",false,[{value:getLang("generic::cancel"),type:'text borderless',method:'close'},{value:getLang("generic::delete"),type:'error text',onclick:function(closeCallback){me._deleteItemsList=me.list._getSelectedList();me._doTheDelete(closeCallback);}}]);}

/* client/inc/obj_certificates_server_add.js */
_me=obj_certificates_server_add.prototype;function obj_certificates_server_add(){};_me.__constructor=function(s){};_me._load=function(item){var me=this;var popup=this._parent._parent;var id=this.__id=item?item.id:false;var allowed=item&&item.iscsr?['crt']:['pem'];me._draw('obj_certificates_server_add');this.input_certificate._readonly(true);popup.main.btn_save._disabled(true);this.upload_certificate._extensions(allowed);this.upload_certificate._onfile=function(file){me.input_certificate._value(file.name);me.__certificate=file.content;popup.main.btn_save._disabled(false);}
this.upload_certificate._onextensionerror=function(type){gui.message.error(getLang("error::incorrect_filetype"));}}
_me._save=function(){var me=this;var parent=me._parent;if(me.__id){com.certificates.edit(me.__id,me.__certificate,function(success,error){if(success){gui.message.toast(getLang("message::certificate_saved"));me._certificatesList._load();parent._parent._close();}else{log.error(['certificates-server-add-save',error]);gui.message.error(getLang("error::certificate_not_saved"));}});}else{com.certificates.add(me.__certificate,function(success,error){if(success){gui.message.toast(getLang("message::certificate_saved"));me._certificatesList._load();while(gui._popupList.length){gui._popupList[0]._close();}}else{log.error(['certificates-server-add-save',error]);gui.message.error(getLang("error::certificate_not_saved"));}});}}

/* client/inc/obj_certificates_server_edit.js */
_me=obj_certificates_server_edit.prototype;function obj_certificates_server_edit(){};_me.__constructor=function(s){var me=this;var parent=this._parent;me.__id=false;this._add_destructor('__onbeforedestruct');};_me.__onbeforedestruct=function(){}
_me._load=function(item){var me=this;this.__id=item.id;this._draw('obj_certificates_server_edit',undefined,item);this._tabAnchors={'details':this._getAnchor('details'),'domains':this._getAnchor('domains')};this._parent.btn_save._disabled(true);var initial='details';this._menu=[];if(item.iscsr&&item.automaticengine==0){this._menu.push({name:'csr',icon:'',value:'certificates::csr',onclick:function(e,name){me._tabClickHandler(name);return false;}});this._parent._setHeading(getLang('certificates::finalize'));initial='csr';this._tabAnchors.csr=this._getAnchor('csr');this.button_export_csr._onclick=function(){me.button_export_csr._disabled(true);com.certificates.export(me.__id,function(bOk){me.button_export_csr._disabled(false);if(!bOk){gui.message.error(getLang("error::action_failed"),getLang("error::failed"));}});}
this.upload_bind_certificate._extensions(['crt']);this.upload_bind_certificate._onfile=function(file){me.input_bind_certificate._value(file.name);me.__certificate=file.content;me._parent.btn_save._disabled(false);}
this.upload_bind_certificate._onextensionerror=function(type){gui.message.error(getLang("error::incorrect_filetype"));}}else if(item.isdefault!=1){this._menu.push({name:'ip_binding',icon:'',value:'certificates::ip_binding',onclick:function(e,name){me._tabClickHandler(name);me._parent.btn_save._disabled(false);return false;}});this.radio_all_ips._value('ipall');this.radio_selected_ips._value('ipsel');this.radio_all_ips._groupOnchange=function(){if(this._groupValue()=='ipall'){me.multi_ips._disabled(true);}else{me.multi_ips._disabled(false);}}
if(item.ipaddress.length){this.radio_all_ips._groupValue('ipsel');this.multi_ips._value(item.ipaddress);}else{this.radio_all_ips._groupValue('ipall');this.multi_ips._disabled(true);}
this._parent._setHeading(getLang('certificates::properties'));initial='ip_binding';this._tabAnchors['ip_binding']=this._getAnchor('ip_binding');me._parent.btn_save._disabled(false);}
this._menu.push({isdefault:true,name:'details',icon:'',value:'certificates::details',onclick:function(e,name){me._tabClickHandler(name);return false;}},{name:'domains',icon:'',value:'certificates::domains',onclick:function(e,name){me._tabClickHandler(name);return false;}});if(item.status=='error'&&item.iscsr){this._menu.push({name:'errors',icon:'',value:'certificates::errors',onclick:function(e,name){me._tabClickHandler(name);return false;}});this._tabAnchors.errors=this._getAnchor('errors');}
if(this._tabAnchors.errors){initial='errors';}
this._parent.left_menu._fill(this._menu);this._parent.left_menu._setActive(initial);this._parent.left_menu._show();this._tabClickHandler(initial);}
_me._tabClickHandler=function(tab){for(var t in this._tabAnchors){if(t==tab){this._tabAnchors[t].removeAttribute('is-hidden');}else{this._tabAnchors[t].setAttribute('is-hidden',1);}}}
_me._save=function(){var me=this;var parent=me._parent;if(this._tabAnchors['ip_binding']){var ips=this.radio_all_ips._groupValue()=='ipall'?[]:this.multi_ips._value();com.certificates.editips(this.__id,ips,function(bOk){if(bOk){gui.message.toast(getLang("message::save_successfull"));me._certificatesList._load();me._close();}else{gui.message.error(getLang("error::action_failed"),getLang("error::failed"));}});}else if(this._tabAnchors.csr){com.certificates.edit(me.__id,me.__certificate,function(success,error){if(success){gui.message.toast(getLang("message::certificate_saved"));me._certificatesList._load();me._close();}else{log.error(['certificates-server-edit-save',error]);gui.message.error(getLang("error::certificate_not_saved"));}});}}

/* client/inc/obj_certificates_server_wizard.js */
_me=obj_certificates_server_wizard.prototype;function obj_certificates_server_wizard(){};_me.__constructor=function(s){var me=this;var parent=this._parent;me.__id=false;this._add_destructor('__onbeforedestruct');};_me.__onbeforedestruct=function(){}
_me._load=function(item){var me=this;var parent=me._parent;this.__id=item?item._id:false;if(item){this.__item=item;}
me._draw('obj_certificates_server_wizard',undefined,{reissue_cert:!!item});if(this.button_add_existing){this.button_add_existing._onclick=function(e){this._popup=gui._create('popup','obj_popup');this._popup._init({name:'add_certificate',heading:{value:getLang('generic::add')},fixed:false,footer:'default',content:"obj_certificates_server_add"});this._popup.content._certificatesList=me._certificatesList;this._popup.content._load();}}
this.button_new_icewarp_cert._onclick=function(e){me._show('icewarp');}
this.button_new_ca_cert._onclick=function(e){me._show('authority');}
this.button_new_lets_encrypt_cert._onclick=function(e){me._show('letsencrypt');}
this.button_new_self_signed_cert._onclick=function(e){me._show('selfsigned');}
this.multi_hostnames.button_add._value('certificates::add_hostname');this.dropdown_validity._fill({'*1':'1 '+getLang("datetime::year"),'*2':'2 '+getLang("datetime::years"),'*3':'3 '+getLang("datetime::years")});this.input_bits._value(3072);this.radio_reuse._value('reuse');this.radio_generate._value('generate');this.radio_reuse._groupValue('generate');if(item){if(item.hostname.length)
this.multi_hostnames._value(item.hostname);if(item.issuerinfo){this.input_email._value(item.issuerinfo.email);this.input_organization._value(item.issuerinfo.o);this.input_unit._value(item.issuerinfo.ou);this.input_city._value(item.issuerinfo.locality);this.input_state._value(item.issuerinfo.state);this.input_country._value(item.issuerinfo.c);}
this.dropdown_validity._value('1');this.input_bits._value(item.bits);}else{com.server.getLicenseInfo(function(data){me.multi_hostnames._value([data.cn]);me.input_email._value(data.email);me.input_organization._value(data.organization);me.input_city._value(data.locality);me.input_state._value(data.state);me.input_country._value(data.country);});}
this._parent.btn_save._disabled(true);}
_me._show=function(sDetail){var me=this;this._showing=sDetail;if(sDetail){this._getAnchor('wizard').setAttribute('is-hidden',1);this._getAnchor('details').removeAttribute('is-hidden');if(this.__item&&!this.__item.iscsr){this._getAnchor('reuse').removeAttribute('is-hidden');}else{this._getAnchor('reuse').setAttribute('is-hidden',1);}
this._parent._setHeading(getLang('certificates::'+sDetail+'_details'));switch(sDetail){case'selfsigned':case'icewarp':case'authority':this._getAnchor('fb_hostname').removeAttribute('is-hidden');this._getAnchor('fb_company').removeAttribute('is-hidden');this._getAnchor('fb_certificate').removeAttribute('is-hidden');break;case'letsencrypt':this._getAnchor('fb_hostname').removeAttribute('is-hidden');this._getAnchor('fb_company').setAttribute('is-hidden',1);this._getAnchor('fb_certificate').setAttribute('is-hidden',1);break;}
this._parent._setBackButton(function(){me._show();});this._parent.btn_save._disabled(false);}else{this._parent.btn_save._disabled(true);this._parent._setHeading(getLang('certificates::wizard'));this._getAnchor('wizard').removeAttribute('is-hidden');this._getAnchor('details').setAttribute('is-hidden',1);this._parent._setBackButton();}}
_me._save=function(){var me=this;var parent=me._parent;var domains=this.multi_hostnames._value();var issuer={};var options={};switch(this._showing){case'icewarp':case'authority':options.createcsr=1;case'selfsigned':issuer.organization=this.input_organization._value();issuer.organizationunit=this.input_unit._value();issuer.email=this.input_email._value();issuer.city=this.input_city._value();issuer.state=this.input_state._value();issuer.country=this.input_country._value();options.validfordays=this.dropdown_validity._value()*365;options.bits=this.input_bits._value();break;case'letsencrypt':options.doletsencrypt=1;break;}
if(this.__id){options.reissue=this.__id;if(this._showing=='selfsigned'&&this.radio_reuse._groupValue()=='reuse'){options.reuse=true;}}
com.certificates.create(issuer,domains,options,function(id){if(id){gui.message.toast(getLang("message::save_successfull"));me._certificatesList._load(function(items){if(options.createcsr){for(var i=items.length;i--;){if(items[i].id==id){this._editCertificate(items[i]);break;}}}});me._close();}else{gui.message.error(getLang("error::action_failed"),getLang("error::failed"));}});}

/* client/inc/obj_changepwd.js */
function obj_changepwd(){};obj_changepwd.prototype.__constructor=function(){storage.library('wm_user');this.__policies=[];};obj_changepwd.prototype._load=function(){this._draw('obj_changepwd','',{items:{}});com.properties.getWebmailResources('password_policy',function(aResult){var items=[];log.info(aResult);try{items=aResult.list[0].list[0].list;this._getAnchor('pwdp').removeAttribute('is-hidden');}catch(e){this._getAnchor('pwdp').setAttribute('is-hidden','');}
items.forEach(function(item){var name=item.name.toString();var value=+item.value;var anchor=this._getAnchor('pwdp_'+name);this.__policies[name]=value;switch(name){case'user_alias':if(item.value){anchor.removeAttribute('is-hidden');}
break;case'min_length':case'numeric_chars':case'non_alpha_num_chars':case'alpha_chars':case'upper_alpha_chars':if(value){anchor.removeAttribute('is-hidden');anchor.querySelector('span').textContent=value;}}},this);}.bind(this));this.timeout=setInterval(function(){if(storage.css_status('obj_changepwd')){clearInterval(this.timeout);}}.bind(this),100);};obj_changepwd.prototype._verify_password=function(new_pass,new_pass2){if(new_pass.length<(this.__policies.min_length||1)){gui.message.error(getLang("error::password_too_short"),false);return false;}
if(new_pass!==new_pass2){gui.message.error(getLang("error::password_does_not_match"),false);return false;}
if(this.__policies.user_alias&&~new_pass.indexOf(gui._globalInfo.email.split('@')[0])){gui.message.error(getLang("error::password_contains_alias"),false);return false;}
if(this.__policies.numeric_chars&&(new_pass.match(/\d/g)||[]).length<this.__policies.numeric_chars){gui.message.error(getLang("error::password_numeric_chars"),false);return false;}
if(this.__policies.non_alpha_num_chars&&(new_pass.match(/[^A-Za-z0-9]/g)||[]).length<this.__policies.non_alpha_num_chars){gui.message.error(getLang("error::password_non_alpha_num_chars"),false);return false;}
if(this.__policies.alpha_chars&&(new_pass.match(/\w/g)||[]).length<this.__policies.alpha_chars){gui.message.error(getLang("error::password_alpha_chars"),false);return false;}
if(this.__policies.upper_alpha_chars&&(new_pass.match(/[A-Z]/g)||[]).length<this.__policies.upper_alpha_chars){gui.message.error(getLang("error::password_upper_alpha_chars"),false);return false;}
return true;};obj_changepwd.prototype._save=function(){var old_pass=this.input_old_password._value();var new_pass=this.input_change_password._value();var new_pass2=this.input_change_password_again._value();this._verify_password(new_pass,new_pass2)&&com.user.change_user_password(gui._globalInfo.email,new_pass,old_pass,function(result){if(result){if(result.Array.IQ[0].QUERY[0].ERROR){var message=result.Array.IQ[0].QUERY[0].ERROR[0].ATTRIBUTES.UID;if(message==='auth_login_invalid'){message='wrong_password';}
gui.message.error(getLang("error::"+message),false);return false;}else{gui._globalInfo.passwordexpired=false;}
if(result.Array.IQ[0].QUERY[0].RESULT[0].VALUE==0){gui.message.error(getLang("error::save_unsuccessful"));}else{gui.message.toast(getLang("message::save_successfull"));}
this._parent._parent._close();}else{this._getAnchor('error').removeAttribute('is-hidden');}}.bind(this));};

/* client/inc/obj_checkbox.js */
_me=obj_checkbox.prototype;function obj_checkbox(){};_me.__constructor=function(){var me=this;try
{var elm=mkElement('input',{"type":"checkbox","name":this._pathName+'#main',"id":this._pathName+'#main'});var elmlabel=mkElement('i',{});var elmlabel_content=mkElement('label',{});addcss(elmlabel_content,'label');this._main.appendChild(elm);this._main.appendChild(elmlabel);this._main.appendChild(elmlabel_content);this.__eIN=elm.form[elm.name];elm._label=elmlabel_content;this._elm=elm;}
catch(e)
{log.error(e);}
this._elm.onchange=function(e){me._onchange(e);}
this._elm.onclick=this._main.onclick=function(e){if(gui.__sound_on){gui.frm_main.impact3._play();}
var e=e||window.event,elm=e.target||e.srcElement;if(this==elm){if(!me._disabled()){if(me._onclick)
me._onclick(e);}}
return true;};this._elm.onfocus=function(e){var e=e||window.event;me.__hasFocus=true;if(me._onfocus)me._onfocus(e);me.__exeEvent('onfocus',e,{"owner":me});log.log('Element "'+this.id+'" focused');addcss(me._main,'focus');return true;};this._elm.onblur=function(e){var e=e||window.event;me.__hasFocus=false;if(me._onblur&&me._onblur(e)===false)return false;me.__exeEvent('onblur',e,{"owner":me});log.log('Element "'+this.id+'" blured');removecss(me._main,'focus');return true;};this._main.oncontextmenu=function(e){var e=e||window.event,elm=e.target||e.srcElement;if(me._oncontext&&me._oncontext(e)!==false)
me.__exeEvent('oncontext',e,{"owner":me});};this._main.onkeydown=function(e){var e=e||window.event;if(!me._disabled()&&me._onkeypress)
me._onkeypress(e);return true;};};_me._toggle=function(sToggle){this._toggleTarget=sToggle;}
_me._readonly=function(bReadonly){if(typeof bReadonly!='undefined')
{if(bReadonly){this._disabled(true);addcss(this._main,'is-readonly');this._elm.setAttribute('readonly','readonly');}else{removecss(this._main,'is-readonly');this._elm.removeAttribute('readonly');this._disabled(false);}}
return this._elm.hasAttribute('readonly');};_me._disabled=function(sDisabled){if(sDisabled&&typeof sDisabled=='object'){this._disablealso_ids=sDisabled;}
if(this._disablealso_ids)
{var ids=this._disablealso_ids;for(var i=0;i<ids.length;i++){if(this._parent[ids[i]]){if(this._parent[ids[i]]._disabled){this._parent[ids[i]]._disabled(true);}}else if(this._parent._getAnchor(ids[i])){if(sDisabled){addcss(this._parent._getAnchor(ids[i]),'is-disabled');}else{removecss(this._parent._getAnchor(ids[i]),'is-disabled');}}}}
if(sDisabled){addcss(this._main,'is-disabled');}else{removecss(this._main,'is-disabled');}
return this._elm.disabled=sDisabled;};_me._setValue=function(apiprop){var me=this;this._checked(apiprop==1);if(apiprop.readonly){this._readonly(true);}
if(apiprop.denied){this._main.setAttribute('is-hidden','1');}
if(this.__apivalue==undefined){this.__eIN.addEventListener('change',function(){me.__apivalue.value=this.checked?1:0;},false);}
this.__apivalue=apiprop;}
_me._value=function(sValue){if(typeof sValue!='undefined')
{this.__eIN.value=sValue;if(this._onchange){this._onchange();}}
return this.__eIN.value;};_me._placeholder=function(sPlaceholder){return this._elm.placeholder=sPlaceholder?getLang(sPlaceholder):this._elm.placeholder;};_me._title=function(sValue){if(Is.String(sValue))
this._elm.title=(sValue.indexOf('::')!=-1?getLang(sValue):sValue);else
return this._elm.title||'';};_me._doTheToggle=function(){if(this._toggleTarget&&this._parent[this._toggleTarget]){this._parent[this._toggleTarget]._toggle(this);}else if(this._toggleTarget){var elm=false;if(this._parent._getAnchor(this._toggleTarget)){var elm=this._parent._getAnchor(this._toggleTarget);}else if(document.getElementById(this._toggleTarget)){var elm=document.getElementById(this._toggleTarget);}
if(elm){if(elm.getAttribute('is-hidden')){elm.removeAttribute('is-hidden');}else{elm.setAttribute('is-hidden',1);}}}}
_me._onclick=function(e){this._doTheToggle();}
_me._checked=function(checked,ignoreChange){if(typeof checked!='undefined'){if(this._onchange&&checked!=this._elm.checked){this._elm.checked=checked;if(!ignoreChange){this._onchange();}}
this._elm.checked=checked;}
return this._elm.checked;};_me._onchange=function(){}
_me._show=function(agent){this._main.style.display='';this._ishidden=false;};_me._hide=function(agent){this._main.style.display='none';this._ishidden=true;};_me._label=function(langstr){this._elm.setAttribute('title',getLang(langstr));this._elm._label.innerHTML=(langstr?helper.htmlspecialchars(getLang(langstr)):'');}

/* client/inc/obj_consoledialog.js */
_me=obj_consoledialog.prototype;function obj_consoledialog(){};_me.__constructor=function(s){var me=this;me._parent._initSearch(function(){me.list._load();},true,function(){if(me._parent._getSearch()){me._parent._setSearchString('',true);me.list._load();}else{gui.hashhandler._changed(false);me._parent._parent._close();}});};_me.__onclick=function(e){log.log('clicked',e);};_me._activateVariableSelect=function(id,data,line){var me=this;var variable=me.list._getAnchor('variable_'+id);var container=me.list._getAnchor('variable_container_'+id);var input_container=me.list._getAnchor('variable_input_container_'+id);me._container=container;if(!me['hidden_selection']){var inp=me._create('hidden_selection','obj_input_text');me.list._addObject(line,inp);inp._addcss('visually-hidden');inp._onblur=function(){log.log(["consoledialog-activatevariableselect",me._selected]);removecss(me._selected,'is-selected');}}
variable.onclick=function(){if(me._toucher){me._toucher=false;return false;}
me.hidden_selection._value(id);me.hidden_selection._focus();setTimeout(function(){me.hidden_selection._selectValue();},50);me._selected=container;addcss(container,'is-selected');}
variable.ontouchstart=function(){me._toucher=true;}
variable.onmspointerdown=function(e){if(e.pointerType&&(e.pointerType=='touch'||e.pointerType=='pen'||e.pointerType==e.MSPOINTER_TYPE_TOUCH||e.pointerType==e.MSPOINTER_TYPE_PEN)){me._toucher=true;}}
variable.onmspointerup=function(e){if(e.pointerType&&(e.pointerType=='touch'||e.pointerType=='pen'||e.pointerType==e.MSPOINTER_TYPE_TOUCH||e.pointerType==e.MSPOINTER_TYPE_PEN)){variable.ontouchend();}}
variable.ontouchend=function(){container.setAttribute('is-hidden',1);input_container.removeAttribute('is-hidden',1);if(!me.list['input_'+id]){var inp=me.list._create('input_'+id,'obj_input_text','variable_input_container_'+id);me.list._addObject(line,inp);inp._value(id);inp._onblur=function(){input_container.setAttribute('is-hidden',1);container.removeAttribute('is-hidden',1);}}else{var inp=me.list['input_'+id];}
inp._focus();}}
_me._edit=function(id,data,refresh,line){var me=this;var obj='obj_'+id;if(line._editActivated){return false;}
line._editActivated=true;var value=me.list._getAnchor('value_'+id);var save=me.list._getAnchor('save_'+id);if(!this.list[obj]){createsavebutton=true;showsavebutton=false;savebuttonlabel=false;enablesavebutton=false;switch(data.type_code){case"string":var inp=this.list._create(obj,'obj_input_text','edit_'+id);inp._placeholder('generic::enter_value');inp._addcss('is-editable');inp._onblur=function(){if(!inp._changed()){removecss(save,'is-visible');}};inp._onfocus=function(){if(!save._readonly){addcss(save,'is-visible');}
me.list[obj+'_save']._disabled(false);};break;case"longstring":if(!save._readonly){addcss(save,'is-visible');}
showsavebutton=true;savebuttonlabel=+data.right===1?'api_console::view':'api_console::edit';enablesavebutton=true;break;case"integer":var inp=this.list._create(obj,'obj_input_number','edit_'+id);inp._placeholder('generic::enter_value');inp._addcss('is-editable');inp._onblur=function(){if(!inp._changed()){removecss(save,'is-visible');}};inp._onfocus=function(){if(!save._readonly){addcss(save,'is-visible');}
me.list[obj+'_save']._disabled(false);};break;case"boolean":log.log(['consoledialog-boolean',0]);var inp=this.list._create(obj,'obj_toggle','edit_'+id);inp._placeholder('generic::enter_value');log.log(['consoledialog-boolean',1]);inp._label(getLang('api_console::false'),getLang('api_console::true'));log.log(['consoledialog-boolean',2]);inp._onchange=function(){if(!save._readonly){addcss(save,'is-visible');}
me.list[obj+'_save']._disabled(false);};inp._onblur=function(){log.log(['consoledialog-boolean','blurred']);if(!inp._changed()){removecss(save,'is-visible');}};log.log(['consoledialog-boolean',3]);break;case"enum":log.log(['consoledialog-enum',data]);var inp=this.list._create(obj,'obj_dropdown_single','edit_'+id);inp._addcss('is-editable');inp._onchange=function(){if(!save._readonly){addcss(save,'is-visible');}
me.list[obj+'_save']._disabled(false);};inp._onblur=function(){log.log(['consoledialog-boolean','blurred']);if(!inp._changed()){removecss(save,'is-visible');}};inp._disabled(false);break;default:createsavebutton=false;}
if(createsavebutton){if(me.list[obj]){me.list[obj]._disabled(true);}
if(!me[obj+"_save"]){var but=this.list._create(obj+"_save",'obj_button','save_'+id)
but._value((savebuttonlabel?savebuttonlabel:'api_console::save'));but._addcss('text primary');but._disabled(!enablesavebutton);}else{var but=me[obj+"_save"];}}
if(this.list[obj]){this.list._addObject(line,this.list[obj]);}
if(this.list[obj+'_save']){this.list._addObject(line,this.list[obj+'_save']);}}
if(this.list[obj]){var cb=function(info,right){var value=''
try{if(typeof info=='object'&&info.Array.IQ[0].QUERY[0].RESULT[0].ITEM[0].PROPERTYVAL[0].VAL){value=info.Array.IQ[0].QUERY[0].RESULT[0].ITEM[0].PROPERTYVAL[0].VAL[0].VALUE;}else{value=info;}
if(typeof info=='object'&&info.Array.IQ[0].QUERY[0].RESULT[0].ITEM[0].PROPERTYRIGHT[0]){right=parseInt(info.Array.IQ[0].QUERY[0].RESULT[0].ITEM[0].PROPERTYRIGHT[0].VALUE);}else if(right){right=parseInt(right);}else{right=RIGHTS_READONLY;}}catch(e){log.error(['e:unexpected_response',e]);}
log.log(['consoledialog-type',me.list[obj]._type]);switch(me.list[obj]._type){case'obj_input_number':case'obj_input_text':me.list[obj+'_save']._onclick=function(){this._disabled(true);var that=this;me._setItem(data.name,me.list[obj]._value(),function(value){me.list[obj]._changed(true);removecss(save,'is-visible');me.list[obj]._value(value);var line=me.list._getAnchor('id_'+id);line._editActivated=false;});}
me.list[obj]._disabled(false);me.list[obj]._value(value);break;case'obj_toggle':case'obj_input_checkbox':me.list[obj]._checked((data.value=='1'||data.value=='true'||data.value==1),true);me.list[obj]._onclick=function(){var that=this;if(!save._readonly){addcss(save,'is-visible');}
var line=me.list._getAnchor('id_'+id);line._editActivated=false;}
me.list[obj+'_save']._onclick=function(){this._disabled(true);var that=this;me._setItem(data.name,me.list[obj]._value(),function(value){me.list[obj]._changed(true);removecss(save,'is-visible');me.list[obj]._checked((value=='1'||value=='true'||value==1),true);var line=me.list._getAnchor('id_'+id);line._editActivated=false;});}
me.list[obj+'_save']._disabled(false);me.list[obj]._disabled(false);break;case'obj_dropdown_single':me.list[obj]._fill(data.enumvalues_fill);me.list[obj]._value(value,true);me.list[obj+'_save']._onclick=function(){this._disabled(true);var that=this;me._setItem(data.name,me.list[obj]._value(),function(value){me.list[obj]._changed(true);removecss(save,'is-visible');me.list[obj]._value(value,true);var line=me.list._getAnchor('id_'+id);line._editActivated=false;});}
me.list[obj]._disabled(false);break;}
if(right==RIGHTS_READONLY||right==RIGHTS_HIDE){save._readonly=true;me.list[obj]._readonly(true);}};}else{var cb=function(info){value='';try{if(typeof info=='object'&&info.Array.IQ[0].QUERY[0].RESULT[0].ITEM[0].PROPERTYVAL[0].VAL){value=info.Array.IQ[0].QUERY[0].RESULT[0].ITEM[0].PROPERTYVAL[0].VAL[0].VALUE;}else{value=info;}
me.list[obj+'_save']._onclick=function(){var popup=gui._create('popup','obj_popup');popup._init({fixed:false,iwattr:{height:'auto',width:'medium'},name:'header',heading:{value:id},footer:'default'});var optional={name:me.__name}
optional[me.__name]=true;popup.main._draw('obj_consoledialog_longstring','main_content',optional);popup.main.textarea._value(value);me._getItem(data.name,function(result){var val=result.Array.IQ[0].QUERY[0].RESULT[0].ITEM[0].PROPERTYVAL[0].VAL||[{VALUE:''}];popup.main.textarea._value(val[0].VALUE);});if(+data.right===1){popup.main.btn_save._destruct();}else{popup.main.btn_save._onclick=function(){me._setItem(data.name,popup.main.textarea._value(),function(value){me.list._getAnchor('edit_'+id).innerHTML=helper.htmlspecialchars(value);var line=me.list._getAnchor('id_'+id);line._editActivated=false;popup._close();});}}};}catch(e){log.error(['e:unexpected_response',e]);}
me.list._getAnchor('edit_'+id).innerHTML=helper.htmlspecialchars(value);}}
if(refresh){me._getItem(data.name,cb);}else{cb(data.value,data.right);}}
_me._getItem=function(id,cb){log.log([id]);var type='server';var who=false;if(location.parsed_query.domain){type='domain';who=location.parsed_query.domain;}
if(location.parsed_query.account){type='account';who=location.parsed_query.account;}
log.log(['consoledialog-getitem',type,com.console.item(cb)]);com.console.item(cb)[type](id,who);}
_me._setItem=function(id,value,cb){var me=this;var type='server';var who=false;if(location.parsed_query.domain){type='domain';who=location.parsed_query.domain;}
if(location.parsed_query.account){type='account';who=location.parsed_query.account;}
log.log(['consoledialog-setitem',type,com.console.item(cb)]);com.console.set(function(ret){me._getItem(id,function(info){log.log(info);var value=''
try{if(info.Array.IQ[0].QUERY[0].RESULT[0].ITEM[0].PROPERTYVAL[0].VAL){value=info.Array.IQ[0].QUERY[0].RESULT[0].ITEM[0].PROPERTYVAL[0].VAL[0].VALUE;}}catch(e){log.error(['e:unexpected_response',e]);}
if(cb){cb(value);}});})[type](id,value,who);}
_me._load=function(who){try{var me=this;log.log('Console dialog should be loaded');me._draw('obj_consoledialog','',{});me._firstLoad=true;me.list._init('obj_consoledialog',false,function(linesPerPage,page,callback){var mask=false;if(me._parent._getSearch()!=''){mask=me._parent._getSearch();};var type='console';if(who){if(who.search('@')>0){type="user";}else if(who){type='domain';}}
com[type].getAPI(linesPerPage,page,mask,function(result){me._firstLoad=false;log.log(['consoledialog-result',result]);try{me.list._setMax(result.count);for(var i=0;i<result.items.length;i++){if(!me._lastGroup){me._lastGroup='';}
if(me._lastGroup!=result.items[i].group){result.items[i]['grouplabel']=getLang('api_console::'+result.items[i].group);}
result.items[i]['type_code']=result.items[i].type;result.items[i]['type']=getLang('api_console::type_'+result.items[i].type);me._lastGroup=result.items[i].group;var line=me.list._drawItem(result.items[i]);me._activateVariableSelect(result.items[i]['name'],result.items[i],line);me._edit(result.items[i]['name'],result.items[i],false,line);}}catch(e){log.error(['consoledialog-load',e]);}},true,who);if(callback){callback();}});}catch(e){log.error(e);}}

/* client/inc/obj_content_rules.js */
_me=obj_content_rules.prototype;function obj_content_rules(){};_me.__constructor=function(s){var me=this;var parent=this._parent;gui.frm_main.main._setHeadingButton('generic::save',function(){me._save();},'button text success');this._add_destructor('__onbeforedestruct');};_me.__onbeforedestruct=function(){}
_me._hash_handler=function(){var me=this;this._draw('obj_content_rules');gui.frm_main.main._init({name:'content_rules',heading:{value:getLang('main::content_rules')}});}

/* client/inc/obj_dashboard.js */
_me=obj_dashboard.prototype;function obj_dashboard(){};_me.__constructor=function(s){var me=this;me.__otherBoxes=[];me.__number_of_labels=0;me.__refreshServicesTimeout_seconds=5;storage.library('wm_server');me.__groups={};me.__groups.mail_services={status:false,label:"dashboard::mail_services",items:{smtp:{label:"dashboard::smtp"},imap:{label:"dashboard::imap"},pop3:{label:"dashboard::pop3"}}};me.__groups.web_services={status:false,label:"dashboard::web_services",items:{control:{label:"dashboard::control",hide:{restart:true}},ftp:{label:"dashboard::ftp",hide:{restart:true}},socks:{label:"dashboard::socks",hide:{connections:true,data:true,restart:true,statistics:true},}}};me.__groups.supportive_services={status:false,label:"dashboard::supportive_services",items:{minger:{label:"dashboard::minger",hide:{connections:true,data:true,restart:true,statistics:true},},ldap:{label:"dashboard::ldap",hide:{connections:true,data:true,restart:true,statistics:true},},snmp:{label:"dashboard::snmp",hide:{connections:true,data:true,restart:true,statistics:true},}}};me.__groups.communication={status:false,label:"dashboard::communication",items:{im:{label:"dashboard::im"},sip:{label:"dashboard::voip",},sms:{label:"dashboard::sms",hide:{connections:true,data:true,restart:true,statistics:true},},meeting:{label:"dashboard::meeting",hide:{connections:true,data:true,statistics:true},}}};me.__groups.collaboration={status:false,label:"dashboard::collaboration",items:{calendar:{label:"dashboard::calendar"},syncpush:{label:"dashboard::groupware_notification",hide:{connections:true,data:true,restart:true,statistics:true},},webclient:{label:"dashboard::webclient",hide:{connections:true,data:true,restart:true,statistics:true},},caldav:{label:"dashboard::webdav",hide:{connections:true,data:true,restart:true,statistics:true},},teamchat:{label:"dashboard::teamchat",hide:{connections:true,statistics:true},}}};me.__groups.security={status:false,label:"dashboard::security",items:{antivirus:{label:"dashboard::antivirus",hide:{connections:true,data:true,statistics:true},},antispam:{label:"dashboard::antispam",hide:{connections:true,data:true,statistics:true},}}};me.__groups.mobility={status:false,label:"dashboard::mobility",items:{activesync:{label:"dashboard::activesync",hide:{connections:true,data:true,restart:true,statistics:true},}}};this._add_destructor('__onbeforedestruct');};_me.__onbeforedestruct=function(){if(this._realtime){clearTimeout(this._realtime);}
if(this.__refreshServicesInterval){clearTimeout(this.__refreshServicesInterval);}
for(var i=0;i<this.__otherBoxes.length;i++){this.__otherBoxes[i]._destruct();}}
_me.__onclick=function(e){log.log('clicked',e);};_me._onSearch=function(string){dataSet.add('dashboard-filter',['search'],string);}
_me._updateGroupsData=function(items){try
{for(var gkey in this.__groups){for(var ikey in this.__groups[gkey].items){if(!this.__groups[gkey].items[ikey].data){this.__groups[gkey].items[ikey].data={connections:0,data:0,status:false,type:0,uptime:0};}
if(items[ikey]){this.__groups[gkey].items[ikey].data=items[ikey];if(this.__groups[gkey].items[ikey].hide)
{if(this.__groups[gkey].items[ikey].hide.connections){delete this.__groups[gkey].items[ikey].data.connections;}
if(this.__groups[gkey].items[ikey].hide.data){delete this.__groups[gkey].items[ikey].data.data;}}}else{log.error("Item ["+ikey+"] is not defined");}}}}
catch(e)
{log.error(e);}}
_me._updateGroups=function(){var me=this;for(var key in me.__groups){if(!me._box_services[key]){me.__groups[key].object=me._box_services._create(key,'obj_dashboard_servicesgroup','groups');}
me.__groups[key].object._label(me.__groups[key].label);for(var key2 in me.__groups[key].items){me.__groups[key].object._addItem(key2,me.__groups[key].items[key2]);}}}
_me._updateTrafficData=function(items){var data=items;log.log(['dashboard-updatetrafficdata',data]);var web=0;log.log(['dashboard-_updateTrafficData',items]);if(data.control&&data.control.connections){web=data.control.connections;web_max=data.control.maxconnections;}
var smtp_restart=0;if(data.smtp&&data.smtp.uptime){smtp_restart=data.smtp.uptime;}
var period_value=' / '+smtp_restart.toTime(getLang('datetime::days').split(';'),true,{lessthanday:true});var smtp=0;if(data.smtp&&data.smtp.connections){smtp=data.smtp.connections;}
var smtp_max=0;if(data.smtp&&data.smtp.maxconnections){smtp_max=data.smtp.maxconnections;}
var mail=0;if(data.pop3&&data.pop3.connections){mail+=data.pop3.connections;}
if(data.imap&&data.imap.connections){mail+=data.imap.connections;}
var mail_max=0;if(data.pop3&&data.pop3.maxconnections){mail_max+=data.pop3.maxconnections;}
if(data.imap&&data.imap.maxconnections){mail_max+=data.imap.maxconnections;}
log.log(['dashboard-updatetrafficdata',web,mail,smtp]);this._getAnchor('traffic_web').innerHTML=web+'/'+web_max;this._getAnchor('traffic_mail').innerHTML=mail+'/'+mail_max;this._getAnchor('traffic_smtp').innerHTML=smtp+'/'+smtp_max;if(gui.frm_main.topbar){var send_period=gui.frm_main.topbar._getAnchor('mail_sent_period');send_period&&(send_period.textContent=period_value);var received_period=gui.frm_main.topbar._getAnchor('mail_received_period');received_period&&(received_period.textContent=period_value);}}
_me._refreshServices=function(){var me=this;com.server.services(function(items){try
{me._updateGroupsData(items);me._updateTrafficData(items);me._updateGroups();}
catch(e)
{log.error(e);}});}
_me._hash_handler=function(e,aData)
{var me=this;log.log('Dashboard should be loaded');if(gui._globalInfo.admintype!=USER_ADMIN&&gui._globalInfo.admintype!=USER_WEB){location.hash="";return true;}
var box_chart=me._parent;box_chart._init({name:'dashboard',heading:{value:getLang('dashboard::current_traffic')}});var box_services=gui.frm_main._create('thebox','frm_box','main_box');me._box_services=box_services;me.__otherBoxes.push(box_services);box_services._init({name:'dashboard_services',heading:{value:getLang('dashboard::services_statuses')}});addcss(box_services._getAnchor('main_content'),'no-padding');me._draw('obj_dashboard','',{});box_services._draw('obj_dashboard_services','main_content',{});gui.frm_main._initTopbar('dashboard');var servicesAllowed={smtp:true,pop3:true,control:true,im:true,calendar:true,imap:true,ftp:true};var servicesList=com.server.__servicesList;var servicesListDropdown={};for(var i=0;i<servicesList.length;i++){if(servicesAllowed[servicesList[i]]){servicesListDropdown['*'+i]=getLang('dashboard::'+servicesList[i]);}}
me.dropdown_action._fill(servicesListDropdown);me.dropdown_time_period._fill({realtime:getLang("dashboard::realtime"),hour:getLang('dashboard::hour'),day:getLang('dashboard::day'),month:getLang('dashboard::month')});me.dropdown_category._fill({'*0':getLang('dashboard::server_data'),'*1':getLang('dashboard::client_data'),'*2':getLang('dashboard::connections'),'*3':getLang('dashboard::received'),'*4':getLang('dashboard::sent')});me.button_cancel._onclick=function(){me.dropdown_action._value(2,true);me.dropdown_time_period._value('realtime',true);me.dropdown_category._value(0,true);me._stopRealtime();me._updateChart();}
me.dropdown_category._onchange=me.dropdown_time_period._onchange=me.dropdown_action._onchange=function(){log.log('dashboard-chartparameters-changed');if(me._realtime_action){delete me._realtime_action;}
me._stopRealtime();me._updateChart();}
me.button_cancel._onclick();me._refreshServices();me.__refreshServicesInterval=setInterval(function(){if(me){me._refreshServices();}},me.__refreshServicesTimeout_seconds*1000);com.properties.get('c_gw_connectionstring',function(p){var v=p.value.split(';');if(v[5]==3){me.__groups.collaboration.items.teamchat.deny={start:getLang("DASHBOARD::SQLITE")};}});}
_me._limiter=function(type,length,every,callback){var me=this;log.log(['dashboard-limiter',me._main.offsetWidth,type,length,every]);if(!me['__'+type+'_labelcounter']){me['__'+type+'_labelcounter']=0;}
if(!me['__'+type+'_iterationcounter']){me['__'+type+'_iterationcounter']=0;}
if(Math.abs((me['__'+type+'_iterationcounter']/(length-1))-
((me['__'+type+'_labelcounter']/(every-1))))<=0.5/(length-1)){me['__'+type+'_labelcounter']++;}else{if(callback){callback();}}
me.distancecounter++;me['__'+type+'_iterationcounter']++;if(me['__'+type+'_iterationcounter']==length){me['__'+type+'_iterationcounter']=0;me['__'+type+'_labelcounter']=0;}}
_me._updateChart=function(noanimation){try
{var me=this;me._noanimation=noanimation;var service=(this._realtime_action?this._realtime_action:me.dropdown_action._value());var period=(this._realtime?'realtime':me.dropdown_time_period._value());var type=me.dropdown_category._value();this._realtime_action=service;if(period=='realtime'){if(type!='2'){me.dropdown_category._value(2);return false;}
me._startRealtime();}
com.server.trafficCharts(service,type,period,function(res){try
{var onlyInteger=false;var labels=[];var data=[];for(var i=0;i<res.length;i++){labels.push(helper.date('d.m.Y H:i:s',res[i].time));data.push(res[i].value);if(!onlyInteger&&Math.floor(res[i].value)>=1){onlyInteger=true;}}
if(!me._chart)
{var responsiveOptions=[];me.__labels=labels;me._chart=new Chartist.Line('.js-dashboard-current_traffic-graph',{labels:labels,series:[{name:'data',data:data}]},{series:{data:{lineSmooth:Chartist.Interpolation.none(),showArea:true}},height:300,fullWidth:true,chartPadding:{right:40},axisX:{showGrid:false,labelInterpolationFnc:function(value,index){if(index==0){return null;}
var margin=10;var max_width=me._main.offsetWidth;var label_width=100;var labels_count=me.__labels.length;var every=Math.ceil(labels_count/(max_width/(label_width+2*margin)));if(every<=0){return value;}
return index%every===0?value:null;}},axisY:{scaleMinSpace:30,onlyInteger:onlyInteger}},responsiveOptions);var last=[];if(me._last){last=me._last};me._last=last;var delay=2000;me._chart.on('draw',function(data){var from=false;var from_x=false;var from_y=false;var opacity_from=0;if(data.type==='point'){data.element.animate({opacity:{begin:0,dur:delay,from:0,to:0}});return false;}
if(data.type==='label'&&data.axis.units.pos==='x'){data.element.attr({x:data.x-data.width/2-50});if(me.__number_of_labels==0){var span=data.element._node[(data.element._node.childNodes?'childNodes':'children')][0];log.info(['X-dashboard',span]);if(span.style){span._width=span.offsetWidth;span.style.width='auto';span.style.position='absolute';}
log.info(['dashboard-updatechart-data',data,me.__number_of_labels,data.element._node,span.offsetWidth]);me.__number_of_labels=Math.floor(me._main.offsetWidth/span.offsetWidth*0.5);if(span.style){span.style.position='';span.style.width=span._width+'px';}}}else if(data.type==='label'&&data.axis.units.pos==='y'){if(!(data.element._node[(data.element._node.childNodes?'childNodes':'children')][0].style)){}else{data.element.attr({y:data.y+data.height/2});}}
if(data.type==='point'&&me._noanimation){}
if(me._noanimation){return false;}
if(data.type==='line'||data.type==='area'){if(last[data.type+'_'+data.seriesIndex]){from=last[data.type+'_'+data.seriesIndex];}
else{from=data.path.clone().scale(1,0).translate(0,data.chartRect.height()).stringify();}
last[data.type+'_'+data.seriesIndex]=data.path.clone().stringify();}else if(data.type==='point'){if(last[data.type+'_'+data.seriesIndex+'_'+data.index]){from_y=last[data.type+'_'+data.seriesIndex+'_'+data.index].y;opacity_from=1;}
else{from_y=data.y;from_x=data.x;}
last[data.type+'_'+data.seriesIndex+'_'+data.index]={x:data.x,y:data.y};}
if(data.type==='line'||data.type==='area'){data.element.animate({d:{begin:0,dur:delay,from:from,to:data.path.clone().stringify(),easing:Chartist.Svg.Easing.easeOutQuint}});}else if(data.type==='point'){var limiter=true;me._limiter(data.type,labels.length,me.__number_of_labels,function(){limiter=false;});data.element.animate({y1:{begin:0,dur:delay,from:from_y,to:data.y,easing:Chartist.Svg.Easing.easeOutQuint},y2:{begin:0,dur:delay,from:from_y,to:data.y,easing:Chartist.Svg.Easing.easeOutQuint},opacity:{begin:Math.floor(delay/2),dur:delay,from:opacity_from,to:(limiter?1:0)}});}});}
else
{try
{me.__labels=labels;var data={labels:labels,series:[{name:'data',data:data}]};log.log(data);me._chart.update(data,{axisY:{onlyInteger:onlyInteger}},true);}
catch(e){}}}
catch(e)
{log.log(['dashboard-catch2',e]);}});}
catch(e)
{log.log(['dashboard-catch',e]);}}
_me._startRealtime=function(){var me=this;if(!this._realtime)
{this.dropdown_category._readonly(true);this._realtime=setInterval(function(){me._updateChart(true);},5000);}}
_me._stopRealtime=function(){this.dropdown_category._readonly(false);if(this._realtime){clearInterval(this._realtime);if(this._realtime){delete this._realtime;}}}

/* client/inc/obj_dashboard_cloudstats.js */
_me=obj_dashboard_cloudstats.prototype;function obj_dashboard_cloudstats(){};_me.__constructor=function(tpldata){this._draw('obj_dashboard_cloudstats','main',tpldata);var link="menu=subscription";if(gui._globalInfo.licence.cloudinfo.cloudplanislive!=1){this.topstats_plan_box._onclick=function(e){location.hash=link;}
this.topstats_plan_box._main.classList.add('is-trial');}
var elm=this._getAnchor('topstats_manageplan');elm.addEventListener('click',function(e){location.hash=link;e.preventDefault();},true);var elm=this._getAnchor('topstats_plan');elm.addEventListener('click',function(e){location.hash=link;e.preventDefault();},true);}

/* client/inc/obj_dashboard_servicesgroup.js */
_me=obj_dashboard_servicesgroup.prototype;function obj_dashboard_servicesgroup(){};_me.__constructor=function(){var me=this;me.__status=-1;me.__itemsOn={};me.__itemsOff={};me.__items={};me._load();};_me._load=function()
{var that=this;var me=this;var parent=this._parent;me._draw('obj_dashboard_servicesgroup','',{});addcss(me._main,'service-group');log.log(['servicesgroup-load',me.expand]);me.expand._onclick=function(){if(!me.__expanded){addcss(me._main,'is-active');me.__expanded=true;}else{removecss(me._main,'is-active');me.__expanded=false;}}
me._getAnchor('header').onclick=function(){me.expand._onclick();};}
_me._updateStatus=function(){var sf=false;var st=true;for(var key in this.__items){if(typeof this.__items[key].__status!=='undefined'){if(this.__items[key].__status){sf=true;}else{st=false;}}}
if(sf&&st){this._setStatus(1);}else if(!sf&&!st){this._setStatus(-1);}else{this._setStatus(0);}}
_me._setStatus=function(status){var sStatus='both';if(status<0){sStatus='off';}
if(status>0){sStatus='on';}
removecss(this._main,'status-on');removecss(this._main,'status-off');removecss(this._main,'status-both');addcss(this._main,'status-'+sStatus);}
_me._addItem=function(id,data){try
{var me=this;var status=0;if(data.data.status!='undefined'){if(me.__itemsOn[id]){delete me.__itemsOn[id];}
if(me.__itemsOff[id]){delete me.__itemsOff[id];}
if(data.data.status){me.__itemsOn[id]=true;}else{me.__itemsOff[id]=true;}}
if(helper.associativeArrayLength(me.__itemsOn)>0){status++;}
if(helper.associativeArrayLength(me.__itemsOff)>0){status--;}
me._setStatus(status);if(!me.__items[id]){me.__items[id]=this._create(id,'obj_dashboard_servicesitem','items');}
me.__items[id]._label(data.label);me.__items[id]._hide(data.hide);me.__items[id]._deny(data.deny);me.__items[id]._refresh(data.data);}
catch(e)
{log.error(e);}}
_me._label=function(string){this._getAnchor('label').innerHTML=helper.htmlspecialchars(getLang(string));}

/* client/inc/obj_dashboard_servicesitem.js */
_me=obj_dashboard_servicesitem.prototype;function obj_dashboard_servicesitem(){};_me.__constructor=function(s){var me=this;me.__hide={};this.__deny={};me._load();me.__status=false;this._add_destructor('__onbeforedestruct');};_me.__onbeforedestruct=function(){if(this.__interval){clearInterval(this.__interval);}}
_me._load=function()
{var that=this;var me=this;var parent=this._parent;me._draw('obj_dashboard_servicesitem','',{});me._main.setAttribute('iw-flex-cell','');me._setActions(false);}
_me._setActions=function(status){try
{var me=this;var actions=[];this.__status=status;if(status&&!me.__hide.statistics){actions.push({name:'statistics',icon:false,onclick:function(b,id){me._handleAction(id);return false;},value:"dashboard::statistics"});}
if(status&&!me.__hide.restart){actions.push({name:'restart',icon:false,onclick:function(b,id){me._handleAction(id);return false;},value:"dashboard::restart"});}
if(status&&!me.__hide.stop){actions.push({name:'stop',icon:false,onclick:function(b,id){me._handleAction(id);return false;},value:"dashboard::stop",type:"color-error"});}
if(!status&&!me.__hide.start){actions.push({name:'start',icon:false,onclick:function(b,id){me._handleAction(id);return false;},value:"dashboard::start",type:"color-success"});}
if(me.actions){me.actions._fill(actions);}}
catch(e)
{log.error(e);}}
_me._hide=function(aHide){if(aHide){this.__hide=aHide};return this.__hide;}
_me._deny=function(aDeny){if(aDeny){this.__deny=aDeny};return this.__deny;}
_me._label=function(string){this._getAnchor('label').innerHTML=helper.htmlspecialchars(getLang(string));}
_me._updateStatus=function(status){this._refresh({status:status,uptime:0});this._parent._updateStatus();}
_me._setUptime=function(time){if(this.__doNotRefreshUptime){return false;}
this.__intervalUptime=time;}
_me._refresh=function(data){var me=this;if(typeof data.connections!='undefined'){var sConnections=data.connections.toString();me._getAnchor('connections').innerHTML=helper.htmlspecialchars(sConnections);}
if(typeof data.data!='undefined'){var sData=helper.bytes2hr(data.data.toString(),false,[getLang('generic::size_b'),getLang('generic::size_kb'),getLang('generic::size_mb'),getLang('generic::size_gb'),getLang('generic::size_tb'),getLang('generic::size_pb')]);me._getAnchor('data').innerHTML=helper.htmlspecialchars(sData);}
if(typeof data.uptime!='undefined'){if(me.__doNotRefreshUptime){return false;}
var sUptime=data.uptime.toTime(getLang('datetime::days').split(';'));me._getAnchor('uptime').innerHTML=sUptime;if(me.__interval){clearInterval(me.__interval);}
if(data.uptime!=0){me.__intervalUptime=data.uptime;me.__interval=setInterval(function(){me.__intervalUptime++;var sUptime=me.__intervalUptime.toTime(getLang('datetime::days').split(';'));me._getAnchor('uptime').innerHTML=sUptime;},1000);}else{me._getAnchor('uptime').innerHTML="00:00:00";me.__intervalUptime=0;}}
if(typeof data.status!='undefined'){me._setActions(data.status);if(data.status){addcss(me._getAnchor('status'),'status-on');removecss(me._getAnchor('status'),'status-off');}else{addcss(me._getAnchor('status'),'status-off');removecss(me._getAnchor('status'),'status-on');}}}
_me._translateValue=function(name,value){try
{var types={data:{memorypeak:1,memorysize:1,serverdatatotal:2,serverdatain:2,serverdataout:2,clientdatatotal:2,clientdatain:2,clientdataout:2},time:{uptime:true}};var type=false;for(var key in types){if(types[key][name]){type=key;break;}}
if(type){switch(type){case'data':var labels=[];if(types[type][name]<=1){labels.push(getLang('generic::size_b'));}
if(types[type][name]<=2){labels.push(getLang('generic::size_kb'));}
if(types[type][name]<=3){labels.push(getLang('generic::size_mb'));}
labels.push(getLang('generic::size_gb'));labels.push(getLang('generic::size_tb'));labels.push(getLang('generic::size_pb'));return helper.bytes2hr(value,false,labels);break;case'time':return value.toTime(getLang('datetime::days').split(';'));break;}}}
catch(e)
{log.error(e);}
return value;}
_me._showStatistics=function(stats){try
{var prepared=[];for(var key in stats){prepared.push({name:getLang('service_statistics::'+key),value:this._translateValue(key,stats[key])});}
log.log(['servicesitem-showstatistics',prepared]);var popup=gui._create('popup','obj_popup');popup._init({fixed:false,iwattr:{height:'full',width:'medium'},name:'statistics',heading:{value:getLang('dashboard::statistics')+' - '+getLang('dashboard::'+this._name)}});popup.main._draw('obj_dashboard_servicestats','main_content',{items:prepared});}
catch(e)
{log.error(e);}}
_me._handleAction=function(id){var me=this;if(this.__deny[id]){gui.message.error(this.__deny[id]);return false;}
switch(id){case'statistics':try
{log.log(['servicesitem-handleaction','statistics']);com.server.serviceStatistics(me._name,function(stats){log.log(['servicesitem-action-statistics',stats]);me._showStatistics(stats);});}
catch(e)
{log.error(e);}
break;case'settings':log.log(['servicesitem-handleaction','settings']);break;case'restart':log.log(['servicesitem-handleaction','restart']);me._updateStatus(false);me.__doNotRefreshUptime=true;com.server.restartService(this._name,function(response){me.__doNotRefreshUptime=false;log.log(['servicesitem-handleaction-callback',response]);try
{if(response.Array.IQ[0].QUERY[0].RESULT[0].VALUE=='1'){me._updateStatus(true);}else{gui.message.error(getLang("error::service_restart_unsuccessful"));}}
catch(e)
{gui.message.error(getLang("error::service_restart_unsuccessful"));}});break;case'stop':log.log(['servicesitem-handleaction','stop']);com.server.stopService(this._name,function(response){log.log(['servicesitem-handleaction-callback',response]);try
{if(response.Array.IQ[0].QUERY[0].RESULT[0].VALUE=='1'){me._updateStatus(false);}else{gui.message.error(getLang("error::service_stop_unsuccessful"));}}
catch(e)
{gui.message.error(getLang("error::service_stop_unsuccessful"));}});break;case'start':log.log(['servicesitem-handleaction','start']);com.server.startService(this._name,function(response){log.log(['servicesitem-handleaction-callback',response]);try
{if(response.Array.IQ[0].QUERY[0].RESULT[0].VALUE=='1'){me._updateStatus(true);}else{gui.message.error(getLang("error::service_start_unsuccessful"));}}
catch(e)
{log.error(['dashboard_servicesitem-service_start_unsuccessful',e]);gui.message.error(getLang("error::service_start_unsuccessful"));}});break;}}

/* client/inc/obj_demo.js */
_me=obj_demo.prototype;function obj_demo(){};_me.__constructor=function(s){var me=this;storage.library('obj_accountpicker');this._leftMenu=[{isdefault:true,name:'demo',icon:'user',value:'other::demo'}];this._menuHashTemplate='#menu=/MENU/';this._leftMenu_other=[{isdefault:true,name:'other',icon:'user',value:'other::other'}];this._actionselect1_menu=[{name:'demo0',icon:false,onclick:function(){return false;},value:'Add to group'},{name:'demo1',icon:false,onclick:function(){return false;},value:'Delete'},{name:'demo2',icon:false,onclick:function(){return false;},value:'Something something something looong'}];this._menuHashTemplate_other='#menu=/MENU/';};_me.__onclick=function(e){};_me._hash_handler=function(e,aData)
{var that=this;var me=this;log.log('Demo should be loaded');try
{gui.frm_main.main._init({name:'demo',menu:{hashTemplate:this._menuHashTemplate,items:this._leftMenu},heading:{value:getLang('other::demo'),button:{value:"Open modal",onclick:function(){me._openPopup();},class:'text success'}}});that._draw('obj_demo','',{items:{}});this.button_show_error._onclick=function(){gui.message.error('This error is not unique. More of them can exist. That means, that other error popups will open in another popup. The same is for other message types per type. This is default behavior.','Not unique error popup',[{value:getLang("generic::cancel"),method:'close'},{value:getLang("Open other error popup"),onclick:function(closeCallback){gui.message.error('This is standalone error popup not rewriting previous error. (it\'s defined in the previous error popup)','Some error');}}],true);}
this.button_show_error_unique._onclick=function(){gui.message.error('This error is unique. Only one can exist. That means, that any other error popup will overwrite it. The same is for other message types per type.','Unique error popup',[{value:getLang("generic::cancel"),method:'close'},{value:getLang("Open other error popup"),onclick:function(closeCallback){gui.message.error('This error popup rewrited previous error popup. Previous popup does not exist anymore. (it\'s defined in the previous error popup)','Some error');}}]);}
this.button_show_warning._onclick=function(){gui.message.warning('Warning test Morbi justo enim, rutrum scelerisque consectetur quis, rhoncus vel leo. Etiam vehicula, tellus non aliquam luctus, justo risus faucibus arcu, sed ullamcorper libero metus nec tortor. In hac habitasse platea ');}
this.button_show_success._onclick=function(){gui.message.success('Success test Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque luctus ac elit suscipit mollis. Maecenas varius nibh non posuere feugiat. Mauris quis orci non nisi dapibus');}
this.button_show_toast._onclick=function(){gui.message.toast('Success test Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque luctus ac elit suscipit mollis. Maecenas varius nibh non posuere feugiat. Mauris quis orci non nisi dapibus');}
this.actionselect_1._fill(this._actionselect1_menu);this.button__9._onclick=function(){gui.accountpicker(function(items,type){log.info(['RESULT OF ACCOUNT PICKER',items,type]);});}
this.button_create_new_account._onclick=function(){me._newAccount();}
that.dropdown_demo_normal._fill({'key1':'val1','key2':'val2'});that.dropdown_demo_editable._fill([500,1000,5931]);setInterval(function(){if(location.parsed_query&&location.parsed_query.menu&&location.parsed_query.menu=='demo'&&me.bar_demo1)
{if(!this.inc){this.inc=0;}
me.bar_demo1._value(this.inc);me.bar_demo1._label(this.inc+" of 100");this.inc+=10;if(this.inc>100){this.inc=0;}}
else
{clearInterval(this);}},500);}
catch(e){log.error(e);}}
_me._openPopup=function(){var popup=gui._create('popup','obj_popup');popup.main._init({name:'demo',menu:{hashTemplate:this._menuHashTemplate,items:this._leftMenu},heading:{value:getLang('other::demo')}});}
_me._newAccount=function()
{var popup=gui._create('popup','obj_popup');popup._init({fixed:false,name:'newaccount',heading:{value:getLang('generic::create_new_account')},footer:'default',content:'obj_newaccount'});popup.content._load(location.parsed_query.domain);}

/* client/inc/obj_devicedetail.js */
_me=obj_devicedetail.prototype;function obj_devicedetail(){};_me.__constructor=function(s){var me=this;var parent=this._parent;this._leftMenu=[{isdefault:true,name:'deviceinfo',icon:false,value:'devicedetail::info',callback:function(name){me._tabmenuCallback(name);}},{name:'devicesync',icon:false,value:'devicedetail::synchronization',callback:function(name){me._tabmenuCallback(name);}}];if(location.parsed_query.account){this._menuHashTemplate='#menu=/MENU/&account=/ACCOUNT/&device=/DEVICE/';}else{this._menuHashTemplate='#menu=/MENU/&domain=/DOMAIN/&device=/DEVICE/';}};_me.__onclick=function(e){log.log('clicked',e);};_me._hash_handler=function(e,aData)
{try
{var me=this;var parent=this._parent;log.log('Device detail should be loaded');try
{gui.frm_main.main._init({name:'devicedetail',heading:{value:'',back:{onclick:function(){if(location.parsed_query.account){location.hash=helper.translateHash('menu=accountdetail&account=/ACCOUNT/&tab_accountdetail=mobile_devices');}else{location.hash=helper.translateHash('menu=domaindetail&domain=/DOMAIN/&tab_domaindetail=mobile_devices');}
return false;}}},menu:{hashTemplate:this._menuHashTemplate,items:this._leftMenu}});}
catch(e)
{log.error(e,me);}}
catch(e){log.error(e);}}
_me._tabmenuCallback=function(name)
{try
{this._parent._clean('main_content');if(!name){name='';}
switch(name)
{case'':case"deviceinfo":if(!gui.frm_main.main.deviceinfo){log.log('Device info should be loaded');gui.frm_main.main._clean('main_content');gui.frm_main.main._create('deviceinfo','obj_deviceinfo','main_content');}
gui.frm_main.main.deviceinfo._load(location.parsed_query.device);break;case'devicesync':if(!gui.frm_main.main.devicesync){log.log('Device info should be loaded');gui.frm_main.main._clean('main_content');gui.frm_main.main._create('devicesync','obj_devicesync','main_content');}
gui.frm_main.main.devicesync._load(location.parsed_query.device);break;default:this.__load_default_view(false,location);break;}}
catch(e)
{log.error(e);}}
_me.__load_default_view=function(e,aData)
{}

/* client/inc/obj_deviceinfo.js */
function obj_deviceinfo(){};var _me=obj_deviceinfo.prototype;_me.__constructor=function(s){var me=this;storage.library('wm_user');storage.library('wm_device');gui.frm_main.main._setHeadingButton('generic::save',function(){me._save();},'button text success');this._changeObserverID='deviceinfo';gui._changeObserver.assignListener(this._changeObserverID,function(callback){if(callback){close();return me._save(false,callback);}else{return me._save('changed');}});this._add_destructor('__onbeforedestruct');};_me.__onbeforedestruct=function(){gui._changeObserver.clearListener(this._changeObserverID);}
_me._load=function(device)
{var me=this;try
{me._draw('obj_deviceinfo','',{items:{}});this.button_activate_device._onclick=function(){me.toggle_status._disabled(false);me.toggle_status._checked(true);me._getAnchor('fi_activate_block').setAttribute('is-hidden',1);}
this.button_block_device._onclick=function(){me.toggle_status._disabled(false);me.toggle_status._checked(false);me.toggle_status._onchange(false);me._getAnchor('fi_activate_block').setAttribute('is-hidden',1);}
this.button_soft_wipe._onclick=function(){gui.message.warning(getLang('description::device_soft_wipe'),false,[{value:getLang("generic::cancel"),method:'close'},{value:getLang("mobile_devices::wipe"),onclick:function(closeCallback){com.device.setSoftWipe(location.parsed_query.device,function(result){try
{if(result.Array.IQ[0].QUERY[0].RESULT[0].VALUE==1){gui.message.toast(getLang("message::device_soft_wipe_set"));}else{gui.message.toast(getLang("error::device_set_wipe_failed"));}}
catch(e)
{log.error(e);}
closeCallback();});},type:'text error'},]);};this.button_hard_wipe._onclick=function(){gui.message.warning(getLang('description::device_hard_wipe'),false,[{value:getLang("generic::cancel"),method:'close'},{value:getLang("mobile_devices::wipe"),onclick:function(closeCallback){com.device.setHardWipe(location.parsed_query.device,function(result){try
{if(result.Array.IQ[0].QUERY[0].RESULT[0].VALUE==1){gui.message.toast(getLang("message::device_hard_wipe_set"));}else{gui.message.toast(getLang("error::device_set_wipe_failed"));}}
catch(e)
{log.error(e);}
closeCallback();});},type:'text error'},]);};this.toggle_status._onchange=function(){com.device.setStatus(location.parsed_query.device,!this._checked(),function(result){try
{if(result.Array.IQ[0].QUERY[0].RESULT[0].VALUE==1){if(me.toggle_status._checked())
{gui.message.toast(getLang("message::device_allowed"));}
else
{gui.message.toast(getLang("message::device_blocked"));}}else{gui.message.toast(getLang("error::save_unsuccessful"));}}
catch(e)
{log.error(e);}});};com.device.deviceInfo(location.parsed_query.device,function(aResults){try
{var items=aResults.Array.IQ[0].QUERY[0].RESULT[0].ITEM;}
catch(e)
{log.error(['e:invalid-data',e]);}
try
{for(var i=0;i<items.length;i++)
{var propname=items[i].APIPROPERTY[0].PROPNAME[0].VALUE;var propval={};if(items[i].PROPERTYVAL&&items[i].PROPERTYVAL[0]){propval=items[i].PROPERTYVAL[0];}
var bval=false;var sval="";var ival=0;if(propval.VAL&&propval.VAL[0]&&propval.VAL[0].VALUE){sval=propval.VAL[0].VALUE;bval=(propval.VAL[0].VALUE=='0'||propval.VAL[0].VALUE==''?false:true);ival=parseInt(propval.VAL[0].VALUE);}
try
{log.log([propname.toLowerCase(),propval.VAL]);switch(propname.toLowerCase())
{case'device_account':me._getAnchor('account').innerHTML=helper.htmlspecialchars(sval);break;case'device_os':me._getAnchor('os').innerHTML=helper.htmlspecialchars(sval);break;case'device_type':me._getAnchor('type').innerHTML=helper.htmlspecialchars(sval);break;case'device_model':me._getAnchor('model').innerHTML=helper.htmlspecialchars(sval);break;case'device_registered':if(bval){me._getAnchor('registered').innerHTML=helper.date(getLang("datetime::php_date")+" "+getLang("datetime::php_time_minutes"),parseInt(helper.htmlspecialchars(sval)));}
break;case'device_lastsync':if(bval){me._getAnchor('last_sync').innerHTML=helper.date(getLang("datetime::php_date")+" "+getLang("datetime::php_time_minutes"),parseInt(helper.htmlspecialchars(sval)));}
break;case'device_name':gui.frm_main.main._setHeading(sval);n='input_device_name';me[n].__source=items[i];me[n]._value(sval);break;case'device_status':n='toggle_status';me[n].__source=items[i];me[n]._checked((ival==1?true:false),true);me[n]._disabled((ival==3?true:false));if(ival==3){me._getAnchor('fi_activate_block').removeAttribute('is-hidden');}else{me._getAnchor('fi_activate_block').setAttribute('is-hidden',1);}
break;case'device_remotewipe':switch(ival)
{case 0:me.button_soft_wipe._disabled(true);me.button_hard_wipe._disabled(true);break;case 1:me.button_soft_wipe._disabled(false);me.button_hard_wipe._disabled(false);break;case 2:me.button_soft_wipe._disabled(false);me.button_hard_wipe._disabled(true);break;case 3:me.button_soft_wipe._disabled(true);me.button_hard_wipe._disabled(false);break;}
break;}}
catch(e)
{log.error(e);}}}
catch(e)
{log.error(e);}});}
catch(e)
{log.error(e);}}
_me._save=function(method,callback){var me=this;if(method&&method=='changed'){var changed=com.user._prepareChanged([this.input_device_name]);log.log(['deviceinfo-save-changed',changed]);return changed;}
com.device.setProperty(location.parsed_query.device,'device_name',this.input_device_name._value(),function(result){try
{if(result.Array.IQ[0].QUERY[0].RESULT[0].VALUE==0){gui.message.error(getLang("error::save_unsuccessful"));}else{gui.message.toast(getLang("message::save_successfull"));com.user._prepareChanged([me.input_device_name],true);if(callback){callback();}}}
catch(e)
{log.error(e);}});}

/* client/inc/obj_devicesync.js */
function obj_devicesync(){};var _me=obj_devicesync.prototype;_me.__constructor=function(s){var me=this;storage.library('wm_user');storage.library('wm_device');gui.frm_main.main._setHeadingButton('generic::save',function(){me._save();},'button text success');me.__dropdown_past_mail_items={'*0':getLang('mobile_devices::all_mail_items'),'*1':getLang('mobile_devices::one_day'),'*2':getLang('mobile_devices::three_days'),'*3':getLang('mobile_devices::one_week'),'*4':getLang('mobile_devices::two_weeks'),'*5':getLang('mobile_devices::one_month')};me.__dropdown_past_calendar_items={'*0':getLang('mobile_devices::all_calendar_events'),'*1':getLang('mobile_devices::two_weeks'),'*2':getLang('mobile_devices::one_month'),'*3':getLang('mobile_devices::three_months'),'*4':getLang('mobile_devices::six_months')};this._changeObserverID='devicesync';gui._changeObserver.assignListener(this._changeObserverID,function(callback){if(callback){close();return me._save(false,callback);}else{return me._save('changed');}});this._add_destructor('__onbeforedestruct');};_me.__onbeforedestruct=function(){gui._changeObserver.clearListener(this._changeObserverID);}
_me._soulbound=function(toggle,object){var me=this;if(!me[toggle]._aSoulbound){me[toggle]._aSoulbound=[];}
me[toggle]._aSoulbound.push(me[object]);me[toggle]._onchange=function(){for(var i=0;i<this._aSoulbound.length;i++)
this._aSoulbound[i]._disabled(!this._checked());};}
_me._load=function(device)
{var me=this;try
{var me=this;me._draw('obj_devicesync','',{items:{}});this._soulbound('toggle_past_mail_items','dropdown_past_mail_items');this._soulbound('toggle_past_calendar_events','dropdown_past_calendar_events');this.dropdown_notes_synchronization_type._fill({'*0':getLang('mobile_devices::new_folders'),'*1':getLang('mobile_devices::merge_to_default_folder')});this.dropdown_sync_notes_as._fill({'*1':getLang('mobile_devices::events'),'*2':getLang('mobile_devices::tasks'),'*3':getLang('mobile_devices::tasks_and_notes')});this.dropdown_groupware_folders._fill({'*0':getLang('devicedetail::default_folders_only'),'*1':getLang('devicedetail::all_folders'),'*2':getLang('devicedetail::all_with_groupware_as_email')});this.dropdown_mail_folders._fill({'*0':getLang('devicedetail::default_folders_only'),'*1':getLang('devicedetail::all_folders')});this.dropdown_past_mail_items._fill(me.__dropdown_past_mail_items);this.dropdown_past_calendar_events._fill(me.__dropdown_past_calendar_items);this.dropdown_sync_tasks_as_calendar_events._fill({'*0':getLang('mobile_devices::all_calendar_events'),'*1':getLang('mobile_devices::incomplete_tasks_only')});this.dropdown_tasks_synchronization_type._fill({'*0':getLang('mobile_devices::new_calendar_folders'),'*1':getLang('mobile_devices::merge_to_default_calendar_folder')});this.dropdown_tasks_synchronization_type._fill({'*0':getLang('mobile_devices::new_calendar_folders'),'*1':getLang('mobile_devices::merge_to_default_calendar_folder')});com.device.deviceSynchronization(location.parsed_query.device,function(aResults){try
{var items=aResults.Array.IQ[0].QUERY[0].RESULT[0].ITEM;}
catch(e)
{log.error(['e:invalid-data',e]);}
try
{for(var i=0;i<items.length;i++)
{var propname=items[i].APIPROPERTY[0].PROPNAME[0].VALUE;var propval={};if(items[i].PROPERTYVAL&&items[i].PROPERTYVAL[0]){propval=items[i].PROPERTYVAL[0];}
var bval=false;var sval="";var ival=0;if(propval.VAL&&propval.VAL[0]&&propval.VAL[0].VALUE){sval=propval.VAL[0].VALUE;bval=(propval.VAL[0].VALUE=='0'?false:true);ival=parseInt(propval.VAL[0].VALUE);}
try
{log.log(propname.toLowerCase());log.log([propname.toLowerCase(),propval.VAL]);switch(propname.toLowerCase())
{case'device_syncmail':n='toggle_past_mail_items';me[n].__source=items[i];me[n]._checked(bval);break;case'device_syncmailpast':n='dropdown_past_mail_items';me[n].__source=items[i];me[n]._value(sval);break;case'device_syncmailpastmax':n='dropdown_past_mail_items';var f={};for(var key in me.__dropdown_past_mail_items){if((parseInt(key.replace('*',''))<=ival&&parseInt(key.replace('*',''))>0)||(ival==0)){f[key]=me.__dropdown_past_mail_items[key];}}
var v=me[n]._value();me[n]._fill(f);me[n]._value(v);break;case'device_synccal':n='toggle_past_calendar_events';me[n].__source=items[i];me[n]._checked(bval);break;case'device_synccalpast':n='dropdown_past_calendar_events';me[n].__source=items[i];me[n]._value(sval);break;case'device_synccalpastmax':n='dropdown_past_calendar_events';var f={};for(var key in me.__dropdown_past_calendar_items){if((parseInt(key.replace('*',''))<=ival&&parseInt(key.replace('*',''))>0)||(ival==0)){f[key]=me.__dropdown_past_calendar_items[key];}}
var v=me[n]._value();me[n]._fill(f);me[n]._value(v);break;case'device_synctaskas':n='toggle_sync_tasks_as_calendar_events';me[n].__source=items[i];me[n]._checked(bval);me[n]._onchange=function(){me._check()};break;case'device_synctaskasvalue':n='dropdown_sync_tasks_as_calendar_events';me[n].__source=items[i];me[n]._value(sval);break;case'device_synctaskastype':n='dropdown_tasks_synchronization_type';me[n].__source=items[i];me[n]._value(sval);break;case'device_syncnotesas':n='toggle_sync_notes_as';me[n].__source=items[i];me[n]._checked(bval);me[n]._onchange=function(){me._check()};break;case'device_syncnotesasvalue':n='dropdown_sync_notes_as';me[n].__source=items[i];me[n]._value(sval);break;case'device_syncnotesastype':n='dropdown_notes_synchronization_type';me[n].__source=items[i];me[n]._value(sval);break;case'device_syncgroupwarefolders':n='dropdown_groupware_folders';me[n].__source=items[i];me[n]._value(sval);me[n]._onchange=function(){me._check()};break;case'device_syncmailfolders':n='dropdown_mail_folders';me[n].__source=items[i];me[n]._value(sval);me[n]._onchange=function(){me._check()};break;case'device_syncsharedfolders':n='toggle_shared_folders';me[n].__source=items[i];me[n]._checked(bval);break;case'device_syncarchivefolders':n='toggle_archive';me[n].__source=items[i];me[n]._checked(bval);break;case'device_syncpublicfolders':n='toggle_public_folders';me[n].__source=items[i];me[n]._checked(bval);break;}}
catch(e)
{log.error(e);}}
me._check();}
catch(e)
{log.error(e);}});}
catch(e)
{log.error(e);}}
_me._check=function(){var tab0=this;var tab1=this;tab0['dropdown_mail_folders']._disabled(tab0['dropdown_groupware_folders']._value()==2);tab0['toggle_archive']._disabled(tab0['dropdown_groupware_folders']._value()!=2&&tab0['dropdown_mail_folders']._value()!=1);tab0['toggle_public_folders']._disabled(tab0['dropdown_groupware_folders']._value()==0&&tab0['dropdown_mail_folders']._value()!=1);tab0['toggle_shared_folders']._disabled(tab0['toggle_public_folders']._disabled());tab1['dropdown_sync_tasks_as_calendar_events']._disabled(!tab1['toggle_sync_tasks_as_calendar_events']._checked());tab1['dropdown_tasks_synchronization_type']._disabled(!tab1['toggle_sync_tasks_as_calendar_events']._checked()||tab0['dropdown_groupware_folders']._value()==0);tab1['dropdown_sync_notes_as']._disabled(!tab1['toggle_sync_notes_as']._checked()||tab1['toggle_sync_tasks_as_calendar_events']._checked());tab1['dropdown_notes_synchronization_type']._disabled(!tab1['toggle_sync_notes_as']._checked()||tab0['dropdown_groupware_folders']._value()==0);if(tab0['dropdown_groupware_folders']._value()==0){if(tab1['toggle_sync_tasks_as_calendar_events']._checked())
tab1['dropdown_tasks_synchronization_type']._value(1,true);if(tab1['toggle_sync_notes_as']._checked())
tab1['dropdown_notes_synchronization_type']._value(1,true);}
if(tab1['toggle_sync_tasks_as_calendar_events']._checked()&&tab1['toggle_sync_notes_as']._checked()&&tab1['dropdown_sync_notes_as']._value()==2)
tab1['dropdown_sync_notes_as']._value(1);}
_me._save=function(method,callback){var me=this;try
{var toSave=[me.toggle_past_mail_items,me.dropdown_past_mail_items,me.toggle_past_calendar_events,me.dropdown_past_calendar_events,me.toggle_sync_tasks_as_calendar_events,me.dropdown_sync_tasks_as_calendar_events,me.dropdown_tasks_synchronization_type,me.toggle_sync_notes_as,me.dropdown_sync_notes_as,me.dropdown_notes_synchronization_type,me.dropdown_groupware_folders,me.dropdown_mail_folders,me.toggle_shared_folders,me.toggle_archive,me.toggle_public_folders];if(method&&method=='changed'){var changed=com.user._prepareChanged(toSave);log.log(['devicesync-save-changed',changed]);return changed;}
var items=com.device._prepareSet(toSave);var account='';if(location.parsed_query.device){account=location.parsed_query.device;}
com.device.setData(account,items,[function(result){if(result.Array.IQ[0].QUERY[0].RESULT[0].VALUE==0){gui.message.error(getLang("error::save_unsuccessful"));}else{gui.message.toast(getLang("message::save_successfull"));com.user._prepareChanged(toSave,true);if(callback){callback();}}}]);}
catch(e)
{log.error(e);}}

/* client/inc/obj_domaindetail.js */
_me=obj_domaindetail.prototype;function obj_domaindetail(){};_me.__constructor=function(s){var me=this;var parent=this._parent;this._leftMenu=[{isdefault:true,name:'userlist',icon:'user',value:'domaindetail::users',callback:function(name){me._tabmenuCallback(name);}},{name:'settings',value:'domaindetail::settings',callback:function(name){me._tabmenuCallback(name);}}];this._leftMenu.push({name:'limits',value:'domaindetail::limits',callback:function(name){me._tabmenuCallback(name);}});this._leftMenu.push({name:'rules',value:'domaindetail::rules',callback:function(name){me._tabmenuCallback(name);}});this._leftMenu.push({name:'mobile_devices',icon:'mobile',value:'domaindetail::mobile_devices',callback:function(name){me._tabmenuCallback(name);}});this._leftMenu.push({name:'whitelabeling',icon:'documents',value:'main::white_labeling',callback:function(name){me._tabmenuCallback(name);}});this._menuHashTemplate='#menu=/MENU/&domain=/DOMAIN/';};_me.__onclick=function(e){log.log('clicked',e);};_me._hash_handler=function(e,aData)
{try
{var me=this;var parent=this._parent;gui.frm_main.main._setHeading(punycode.ToUnicode(decodeURIComponent(location.parsed_query.domain)));log.log('Domain detail should be loaded');log.log(e,aData);try
{gui.frm_main.main._init({name:'domaindetail',heading:{value:punycode.ToUnicode(decodeURIComponent(location.parsed_query.domain)),back:{onclick:function(){gui._globalInfo.ignoreSingleDomain=true;location.hash='menu=management';return false;}}},menu:{hashTemplate:this._menuHashTemplate,items:this._leftMenu}});}
catch(e)
{log.error(e,me);}}
catch(e){log.error(e);}}
_me._tabmenuCallback=function(name)
{try
{this._parent._clean('main_content');switch(name)
{case'':case"userlist":if(!gui.frm_main.main.userlist){log.log('Account list should be loaded');gui.frm_main.main._clean('main_content');gui.frm_main.main._create('userlist','obj_userlist','main_content');}
gui.frm_main.main.userlist._load(decodeURIComponent(location.parsed_query.domain));break;case'mobile_devices':gui.frm_main._initSearch(function(string){gui.frm_main.main.mobile_devices._onSearch(string);});if(!gui.frm_main.main.mobile_devices){log.log('mobile_devices should be loaded');gui.frm_main.main._clean('main_content');gui.frm_main.main._create('mobile_devices','obj_accountmobiledevices','main_content');}
gui.frm_main.main.mobile_devices._load(decodeURIComponent(location.parsed_query.domain));break;case'settings':if(!gui.frm_main.main.settings){log.log('settings should be loaded');gui.frm_main.main._clean('main_content');gui.frm_main.main._create('domainsettings','obj_domainsettings','main_content');}
gui.frm_main.main.domainsettings._load(decodeURIComponent(location.parsed_query.domain));break;case'limits':com.console.item(function(result){global._accounts_global_domains_usediskquota=false;global._accounts_global_domains_usedomainlimits=false;var d=result.Array.IQ[0].QUERY[0].RESULT[0].ITEM;for(var i=0;i<d.length;i++){var v=result.Array.IQ[0].QUERY[0].RESULT[0].ITEM[i].PROPERTYVAL[0];var n=result.Array.IQ[0].QUERY[0].RESULT[0].ITEM[i].APIPROPERTY[0];if(v.VAL&&v.VAL[0]&&v.VAL[0].VALUE){global[n.PROPNAME[0].VALUE.substr(1,n.PROPNAME[0].VALUE.length-1)]=(v.VAL[0].VALUE=='1'?true:false);}}
if(!gui.frm_main.main.limits){log.log('limits should be loaded');gui.frm_main.main._clean('main_content');gui.frm_main.main._create('domainlimits','obj_domainlimits','main_content');}
com.console.global('c_accounts_global_domains_useuserlimits',V_TYPE_BOOLEAN,function(value,b,i,s){gui.frm_main.main.domainlimits._load(decodeURIComponent(location.parsed_query.domain));});}).server(['c_accounts_global_domains_usediskquota','c_accounts_global_domains_usedomainlimits','c_accounts_global_domains_useexpiration']);break;case'rules':if(!gui.frm_main.main.rules){log.log('rules should be loaded');gui.frm_main.main._clean('main_content');gui.frm_main.main._create('rules','obj_rules','main_content');}
gui.frm_main.main.rules._load(decodeURIComponent(location.parsed_query.domain));break;case"whitelabeling":if(!gui.frm_main.whitelabeling){gui.frm_main.main._clean('main_content');gui.frm_main.main._create('whitelabeling','obj_whitelabeling','main_content');}
gui.frm_main.main.whitelabeling._hash_handler();break;case'activedirectory':break;default:this.__load_default_view(false,location);break;}}
catch(e)
{log.error(e);}}
_me._DNSValidation=function(){var popup=gui._create('popup','obj_popup');popup._init({name:'dns_validation',heading:{value:getLang('domaindetail::dns_validation')},fixed:false,iwattr:{height:'full',width:'medium'},footer:'obj_domainsettings_dnsvalidation_footer',content:'obj_domainsettings_dnsvalidation'});popup.content._load(decodeURIComponent(location.parsed_query.domain),true);}
_me._DKIM=function(){var popup=gui._create('popup','obj_popup');popup._init({name:'dkim',heading:{value:getLang('domaindetail::dkim')},fixed:false,iwattr:{height:'full',width:'medium'},footer:'obj_domainsettings_dkim_footer',content:'obj_domainsettings_dkim'});popup.content._load(decodeURIComponent(location.parsed_query.domain),true);}
_me.__load_default_view=function(e,aData)
{log.info('Ready to load default view (userlist)');this._hash_handler('');}

/* client/inc/obj_domainlimits.js */
function obj_domainlimits(){};var _me=obj_domainlimits.prototype;_me.__constructor=function(){};_me._load=function(e,aData){var me=this;var view=this._view=new DomainLimitsView(this);view.addSaveButton();view.draw();try
{var parent=this._parent;log.log('Domain limits should be loaded');if(!global._accounts_global_domains_useuserlimits){this._getAnchor('fs_user_limits').setAttribute('is-hidden','1');}
if(!global._accounts_global_domains_useexpiration){this._getAnchor('fs_domain_expiration').setAttribute('is-hidden','1');}
if(!global._accounts_global_domains_usediskquota){this._getAnchor('fi_domain_disk_quota').setAttribute('is-hidden','1');}
if(!global._accounts_global_domains_usedomainlimits){this._getAnchor('fi_domain_daily_send_out_limit').setAttribute('is-hidden','1');addcss(this._getAnchor('domain_daily_send_out_limit'),'hide');}
this.toggle_domain_notify_before_expiration._disabled(true);this.toggle_domain_delete_domain_when_expired._disabled(true);this.toggle_domain_expires_on._onchange=function(status){me.toggle_domain_notify_before_expiration._disabled(!status);me.toggle_domain_delete_domain_when_expired._disabled(!status);}}
catch(e){log.error(e);}
var domain=new Domain(location.parsed_query.domain);domain.getProperties(['d_volumelimit','d_accountnumber','d_diskquota','d_disablelogin','d_usermb','d_expires','d_expireson_date','d_notifyexpire','d_notifybeforeexpires','d_deleteexpired','d_usermailbox','d_usermsg','d_numberlimit','d_usernumber','d_spamdeleteolder'],function(limit){this._data=limit;this.input_domain_maximum_number_of_accounts._setValue(limit.d_accountnumber);this.toggle_domain_disk_quota._checked(limit.d_diskquota>0);this.input_domain_disk_quota._setValue(limit.d_diskquota);this.toggle_domain_daily_send_out_limit._checked(limit.d_volumelimit>0||limit.d_numberlimit>0);this.input_domain_daily_data_limit._setValue(limit.d_volumelimit);this.input_domain_daily_message_count_limit._setValue(limit.d_numberlimit);this.toggle_domain_disable_login._setValue(limit.d_disablelogin);this.toggle_domain_expires_on._setValue(limit.d_expires,false);this.input_domain_expires_on._setValue(limit.d_expireson_date);this.toggle_domain_notify_before_expiration._setValue(limit.d_notifyexpire);this.input_domain_notify_before_expiration._setValue(limit.d_notifybeforeexpires);this.toggle_domain_delete_domain_when_expired._setValue(limit.d_deleteexpired);this.input_domain_account_size._setValue(limit.d_usermailbox);this.input_domain_default_max_message_size._setValue(limit.d_usermsg);this.toggle_domain_default_daily_send_out_limit._checked(limit.d_usermb>0||limit.d_usernumber>0);this.input_domain_user_daily_data_limit._setValue(limit.d_usermb);this.input_domain_user_daily_message_count_limit._setValue(limit.d_usernumber);this.input_delete_spam_older_than._setValue(limit.d_spamdeleteolder);this.toggle_delete_spam_older_than._checked(limit.d_spamdeleteolder>0);}.bind(this));}
_me._issaved=function(target){return!this._data.hasChanged();}
_me._save=function(callback){var view=this._view;if(this._data.hasChanged()){this._data.saveChanges(function(r){view.saveNotification(r==1);if(callback){callback(r==1);}});}}
_me._reset=function(){this._data.revertChanges();}
var DomainLimitsView=function(controller){this._control=controller;}
DomainLimitsView.prototype=Object.create(CoreView.prototype);DomainLimitsView.prototype.draw=function(){var ctrl=this._control;ctrl._draw('obj_domainlimits','',{});ctrl.toggle_delete_spam_older_than._onchange=function(state){if(!state){ctrl._data.d_spamdeleteolder.value=0;ctrl.input_delete_spam_older_than._value('');}}
ctrl.toggle_domain_disk_quota._onchange=function(state){if(!state){ctrl._data.d_diskquota.value=0;ctrl.input_domain_disk_quota._value('');}}
ctrl.toggle_domain_daily_send_out_limit._onchange=function(state){if(!state){ctrl._data.d_volumelimit.value=0;ctrl.input_domain_daily_data_limit._value('');ctrl._data.d_numberlimit.value=0;ctrl.input_domain_daily_message_count_limit._value('');}}
ctrl.toggle_domain_default_daily_send_out_limit._onchange=function(state){if(!state){ctrl._data.d_usermb.value=0;ctrl.input_domain_user_daily_data_limit._value('');ctrl._data.d_usernumber.value=0;ctrl.input_domain_user_daily_message_count_limit._value('');}}}

/* client/inc/obj_domainlist.js */
_me=obj_domainlist.prototype;function obj_domainlist(){};_me.__constructor=function(s){var me=this;me.page=0;me.max_count=0;me.loading=false;storage.library('wm_domain');me._domainTypes={'-':getLang('domainlist::all_types'),'*0':getLang('domainlist::standard'),'*2':getLang('domainlist::domain_alias'),'*3':getLang('domainlist::backup_domain'),'*4':getLang('domainlist::distributed_domain'),'*1':getLang('domainlist::etrn_atrn_queue')}};_me.__onclick=function(e){log.log('clicked',e);};_me._onSearch=function(string){dataSet.add('domainlist-filter',['search'],string);this.list._empty();gui.frm_main._setSearchResults(0);this.list._load();}
_me._load=function(e,aData){this._hash_handler(e,aData);}
_me._hash_handler=function(e,aData)
{var that=this;var me=this;var parent=this._parent;log.log('Domain list should be loaded');log.log(e,aData);gui.frm_main._initSearch(function(string){me._onSearch(string);});me._draw('obj_domainlist','',{});me.list.dropdown_type_filter._onchange=function(){dataSet.add('domainlist-filter',['type'],this._value());me.list._empty();me.list._load();}
me.list.dropdown_type_filter._fill(me._domainTypes);me._main.onclick=function(e){var e=e||window.event,elm=e.target||e.srcElement;if(elm){var ul=Is.Child(elm,'UL',this);if(ul&&ul.getAttribute('hash')){location.hash=ul.getAttribute('hash');}}};var filter_type=dataSet.get('domainlist-filter',['type']);if(typeof filter_type!='undefined'){me.list.dropdown_type_filter._value(filter_type,true);}
if(dataSet.get('domainlist-filter',['search'])){log.log(['domainlist-constructor',dataSet.get('domainlist-filter',['search'])]);gui.frm_main._setSearchString(dataSet.get('domainlist-filter',['search']));}
this.list._init('obj_domainlist',false,function(linesPerPage,page,callback){try
{var namemask=gui.frm_main._getSearch();var typemask=false;var type=me.list.dropdown_type_filter._value();if(type!='-'){typemask=type;}
com.domain.list(linesPerPage,page,namemask,typemask,[function(aResponse){try
{var info={count:(aResponse.Array.IQ[0].QUERY[0].RESULT[0].OVERALLCOUNT&&aResponse.Array.IQ[0].QUERY[0].RESULT[0].OVERALLCOUNT[0]&&aResponse.Array.IQ[0].QUERY[0].RESULT[0].OVERALLCOUNT[0].VALUE?aResponse.Array.IQ[0].QUERY[0].RESULT[0].OVERALLCOUNT[0].VALUE:'-')};if(info.count==0){return false;}
if(aResponse.Array.IQ[0].QUERY[0].RESULT[0].ITEM)
{for(var i=0;i<aResponse.Array.IQ[0].QUERY[0].RESULT[0].ITEM.length;i++){var itm=aResponse.Array.IQ[0].QUERY[0].RESULT[0].ITEM[i];var item={unpunied:punycode.ToUnicode(itm.NAME[0].VALUE),name:itm.NAME[0].VALUE,urlencoded:encodeURIComponent(itm.NAME[0].VALUE),users:itm.ACCOUNTCOUNT[0].VALUE,description:(itm.DESC&&itm.DESC[0]&&itm.DESC[0].VALUE?itm.DESC[0].VALUE:''),type:(me._domainTypes['*'+itm.DOMAINTYPE[0].VALUE]?me._domainTypes['*'+itm.DOMAINTYPE[0].VALUE]:0),deletable:itm.ACCOUNTCOUNT[0].VALUE==0};var del=me.list._drawItem(item);if(del=del.getElementsByClassName('icon-delete-circle')[0]){del.firstChild.onclick=(function(domain){return function(e){gui.message.warning(getLang("warning::delete_domain",[domain]),false,[{value:getLang("generic::cancel"),method:'close'},{value:getLang("generic::delete"),onclick:function(closeCallback){com.domain.deleteDomain(domain,function(result){closeCallback();if(result){me.list._load();}else{gui.message.error(getLang('error::domain_delete_failed'));}});},type:'text error'},]);}}(item.name));}
if(info.count==1&&gui._globalInfo.admintype==USER_DOMAIN&&!gui._globalInfo.ignoreSingleDomain){location.hash='#menu=domaindetail&domain='+encodeURIComponent(item.name);}}}
gui.frm_main._setSearchResults(info.count);me.list._setMax(info.count);gui.frm_main.main.left_menu._setItemValue('domainlist',getLang('management::domainlist')+' ('+info.count+')');if(callback){callback();}}
catch(e)
{log.error(e);}}]);}
catch(e)
{log.error(e);}});}

/* client/inc/obj_domainsettings.js */
_me=obj_domainsettings.prototype;function obj_domainsettings(){};_me.__constructor=function(s){var me=this;var parent=this._parent;me._domainTypes={'*0':getLang('domainlist::standard'),'*2':getLang('domainlist::domain_alias'),'*3':getLang('domainlist::backup_domain'),'*4':getLang('domainlist::distributed_domain'),'*1':getLang('domainlist::etrn_atrn_queue')}
me._unknownAccountActions={"*0":getLang('domaindetail::reject'),"*1":getLang('domaindetail::forward_to_address'),"*2":getLang('domaindetail::delete')}
me._verification={"*0":getLang('domainlist::verification_default'),"*1":getLang('domainlist::verification_use_minger_with_password'),"*2":getLang('domainlist::verification_usevrfy_command'),"*3":getLang('domainlist::verification_use_rcpt_to_command')}
gui.frm_main.main._setHeadingButton('generic::save',function(){me._save();},'button text success');gui.frm_main.main._setHeading(punycode.ToUnicode(location.parsed_query.domain));};_me._load=function(e,aData)
{try
{var me=this;var parent=this._parent;log.log('Domain settings should be loaded');var view=this._view=new DomainSettingsView(this);me._draw('obj_domainsettings','',{});this.dropdown_verification._fill(this._verification);this.dropdown_domain_type._fill(me._domainTypes);this.dropdown_unknown_accounts._fill(me._unknownAccountActions);this.input_domain_name._value(punycode.ToUnicode(location.parsed_query.domain));this.input_domain_name._readonly(true);com.general.install_url(function(url){me._getAnchor('button_domain_icewarp_outlook_sync_download').target="_blank";me._getAnchor('button_domain_icewarp_outlook_sync_download').href=url+'download/outlook-sync.exe';me._getAnchor('button_domain_icewarp_desktop_download').target="_blank";me._getAnchor('button_domain_icewarp_desktop_download').href=url+'download/desktop-setup.msi';});me.input_target_email._disabled(true);if(gui._globalInfo.admintype!=USER_ADMIN&&!global._accounts_global_domains_usediskquota&&!global._accounts_global_domains_usediskquota){me._getAnchor('fi_account_quota_storage').setAttribute('is-hidden',1);me.button_change_quotas._disabled(true);}
if(gui._globalInfo.admintype!=USER_ADMIN){me._getAnchor('fi_features').setAttribute('is-hidden',1);me.button_domain_name._hide(true);}
if(gui._globalInfo.licence.licensetype=="saas"||gui._globalInfo.licence.licensetype=="cloud"){this._getAnchor('fi_max_allowed_plan').removeAttribute("is-hidden");var plan=gui._globalInfo.licence.plans;var options={'0':getLang("SUBSCRIPTION_PLANS::ANY_PLAN")};for(var i=0,l=plan.length;i<l;i++){var label=getLang("SUBSCRIPTION_PLANS::"+plan[i].planlabel);options[plan[i].planid]=label.indexOf("::")==-1?label:plan[i].planlabel;}
this.dropdown_max_allowed_plan._fill(options);}
me.button_domain_name._onclick=function(){me._rename();};gui._changeObserver.assignTrigger(me.button_domain_name);me.button_dns_validation._onclick=function(){me._parent.domaindetail._DNSValidation();}
me.button_dkim._onclick=function(){me._parent.domaindetail._DKIM();}
me.dropdown_unknown_accounts._onchange=function(){if(this._value()==1){me.input_target_email._disabled(false);}else{me.input_target_email._disabled(true);}}
me.dropdown_domain_type._onchange=function(){switch(this._value()){case'0':me.input_value._disabled(true);me.button_value._disabled(true);me.dropdown_verification._disabled(true);me.input_password._disabled(true);break;case'2':me.input_value._disabled(false);me.button_value._disabled(false);me.dropdown_verification._disabled(true);me.input_password._disabled(true);break;case'3':case'4':me.input_value._disabled(false);me.button_value._disabled(true);me.dropdown_verification._disabled(false);me.input_password._disabled(false);break;case'1':me.input_value._disabled(false);me.button_value._disabled(true);me.dropdown_verification._disabled(true);me.input_password._disabled(true);break;}}
me.button_value._onclick=function(){gui.accountpicker(function(data){me.input_value._value(data[0].id);},{domainpicker:true,singledomain:true});}
me.button_add_alias._onclick=function(e){me._addAlias();e.stopPropagation();e.cancelBubble=true;return false;}
me.button_change_quotas._onclick=function(e){me._parent.left_menu._go('limits');e.stopPropagation();e.cancelBubble=true;return false;}
me.button_domain_features._onclick=function(e){me._features();}
me.button_domain_mobile_devices_manage._onclick=function(e){me._parent.left_menu._go('mobile_devices');}
me.button_domain_icewarp_outlook_sync_manage._onclick=function(){me._outlookSyncManage();}
var domain=new Domain(location.parsed_query.domain);domain.getProperties(['d_domainvalue','d_verifytype','d_mingerpassword','d_im_roster_populated','d_2f_enabled','d_saas_plan','d_unknownforwardto','d_unknownuserstype','d_diskquota','d_storageuse','d_numberlimit','d_messagessenttoday','d_aliaslist','d_adminemail','d_description','d_type'],function(p){this._data=p;this.input_domain_description._setValue(p.d_description);this.dropdown_domain_type._setValue(p.d_type);this.input_value._setValue(p.d_domainvalue);this.dropdown_verification._setValue(p.d_verifytype);this.input_password._setValue(p.d_mingerpassword);this.input_administrator_email._setValue(p.d_adminemail);this.multiple_add_alias._setValue(p.d_aliaslist);if(p.d_aliaslist.propertyRights!=2){this.button_add_alias._main.setAttribute('is-hidden','1');}
var limit=+p.d_numberlimit||0;var sent=+p.d_messagessenttoday||0;var percent=0;if(limit>0){percent=Math.round((sent/limit)*10000)/100;if(percent>100){percent=100;}
this.quota_emails._label(sent+" "+getLang("accountdetail::of")+" "+limit);this.quota_emails._value(percent);}else{this.quota_emails._label(sent.toString());this.quota_emails._value(0);}
var limit=+p.d_diskquota||0;var used=+p.d_storageuse||0;this.quota_storage._label(helper.bytes2hr(used)+(limit>0?" "+getLang("accountdetail::of")+" "+helper.bytes2hr(limit*1024):''));if(limit>0){this.quota_storage._value(Math.round((used/limit)*10000)/100);}
this.dropdown_max_allowed_plan._setValue(p.d_saas_plan);this.dropdown_max_allowed_plan._disabled(!~[USER_ADMIN,USER_WEB].indexOf(+gui._globalInfo.admintype));this.dropdown_unknown_accounts._setValue(p.d_unknownuserstype);this.input_target_email._setValue(p.d_unknownforwardto);this.toggle_2_factor_authentication._setValue(p.d_2f_enabled);this.toggle_instant_messaging_shared_roster._setValue(p.d_im_roster_populated);}.bind(this));}
catch(e){log.error(e);}}
_me._addAlias=function(value,right){var v=this._data.d_aliaslist.addItem("item","");this.multiple_add_alias._add(v);}
_me._features=function(){var popup=gui._create('popup','obj_popup');popup._init({name:'features',heading:{value:getLang('accountdetail::features')},fixed:false,iwattr:{height:'full',width:'large'},footer:'obj_accountinfo_features_footer',content:"obj_accountinfo_features"});popup.content._load(location.parsed_query.domain,true);}
_me._outlookSyncManage=function(){var popup=gui._create('popup','obj_popup');popup._init({name:'accountinfo_os_manage',heading:{value:getLang('client_applications::icewarp_outlook_sync')},fixed:false,iwattr:{height:'full',width:'large'},footer:'obj_accountinfo_os_manage_footer',content:'obj_accountinfo_os_manage'});popup.content._load(location.parsed_query.domain,true);}
_me._issaved=function(target){return!this._data.hasChanged();}
_me._save=function(callback){var view=this._view;if(this._data.hasChanged()){this._data.saveChanges(function(r){view.saveNotification(r==1);if(callback){callback(r==1);}});}}
_me._reset=function(){this._data.revertChanges();}
_me._rename=function(){var me=this;var popup=gui._create('popup','obj_popup');popup._init({name:'rename',heading:{value:getLang('domaindetail::change_domain_name')},template:'obj_domainsettings_rename',fixed:false,iwattr:{height:'auto',width:'medium'},footer:'default',type:'default'});popup.main.input_name._value(location.parsed_query.domain);popup.main.btn_save._onclick=function(){if(popup.main.input_name._value()===location.parsed_query.domain){return popup._close();}
if(gui._globalInfo.domain===location.parsed_query.domain){gui.message.warning(getLang("domaindetail::same_domain_helper"),false,[{value:getLang("generic::cancel"),type:'text borderless',method:'close'},{value:getLang("domaindetail::rename_and_logout"),type:'success text',onclick:function(){me.__renameCallback(popup,true);}}]);}else{popup.main.btn_save._disabled(true);me.__renameCallback(popup);}}}
_me.__renameCallback=function(popup,logoutOnSuccess){var name=popup.main.input_name._value();var domain=location.parsed_query.domain;com.domain.rename(domain,name,function(success,error){log.log(['domainsettings-rename-save',success,error]);popup.main.btn_save._disabled(true);if(success){if(logoutOnSuccess){logout(false,function(url){gui.hashhandler._changed=function(){};location=url?url:(location.origin+location.pathname+'#sign-in&username='+gui._globalInfo.email.replace('@'+domain,'@'+name));});}else{gui.message.toast(getLang('message::domain_renamed'));location.hash=location.hash.replace('domain='+encodeURIComponent(domain),'domain='+encodeURIComponent(name));popup._close();}}else{log.error(['e:save-failed',error]);}});}
var DomainSettingsView=function(controller){this._control=controller;}
DomainSettingsView.prototype=Object.create(CoreView.prototype);

/* client/inc/obj_domainsettings_dkim.js */
function obj_domainsettings_dkim(){};var _me=obj_domainsettings_dkim.prototype;_me.__constructor=function(){var view=this._view=new DomainSettingsDKIMView(this);};_me._load=function(){var me=this;var view=this._view;var domain=new Domain(location.parsed_query.domain);domain.getProperties(['D_DKIM_Active','D_DKIM_Selector','D_DKIM_PrivateKey'],function(p){me._data=p;if(p.D_DKIM_Selector.value&&p.D_DKIM_PrivateKey.value){domain.getProperty('D_DKIM_RetrieveSelectorData',function(selector_data){view.showKey({generated:false,selector:p.D_DKIM_Selector+'._domainkey.'+domain.id,key:selector_data,active:p.D_DKIM_Active});});}else{view.showInstructions(function(){view.showGenerate(function(selector){me._data.D_DKIM_Selector.value=selector;domain.getProperty('D_DKIM_GeneratePrivateKey',function(private_key){p.D_DKIM_PrivateKey.value=private_key;p.saveChanges(function(r){if(r==1){domain.getProperty('D_DKIM_RetrieveSelectorData',function(selector_data){selector+='._domainkey.'+domain.id;p.D_DKIM_Active.value=1;view.showKey({generated:true,selector:selector,key:selector_data,active:p.D_DKIM_Active});});}else{gui.message.error(getLang('DKIM::SETUP_FAILED'));me._close();}});});});});}});}
_me._save=function(data){var view=this._view;if(this._data.hasChanged()){this._data.saveChanges(function(r){view.saveNotification(r==1);});}else{this._close();}}
_me._reset=function(){var view=this._view;com.security.resetDKIM(location.parsed_query.domain,function(r){view.notifyResetResult(r==1);});}
var DomainSettingsDKIMView=function(controller){this._control=controller;this._control._draw('obj_domainsettings_dkim','');this.fields={selector:controller.input_selector,record:controller.input_record,key:controller.textarea_key,sign:controller.toggle_sign_outgoing_mails};this.__steps=this._control._getAnchor('fb_dkim_steps').getElementsByTagName('li');this.__backs=[];this.elements={academy:controller._getAnchor('fb_dkim_academy'),generate:controller._getAnchor('fb_dkim_selector'),show:controller._getAnchor('fb_dkim_selector_record'),wait:controller._getAnchor('fb_dkim_loader')};this._actionbutton=this._control._parent.btn_continue;this._regretbutton=this._control._parent.btn_cancel;var view=this;controller.label_button_record._onclick=function(){view.fields.record._copyToClipboard();}
controller.label_button_key._onclick=function(){view.fields.key._copyToClipboard();}}
DomainSettingsDKIMView.prototype=Object.create(PopupWindowView.prototype);DomainSettingsDKIMView.prototype.showKey=function(data){var controller=this._control;var view=this;this.hideAll();this.elements.show.removeAttribute('is-hidden');if(data.generated){this.__steps[2].classList.add('is-active');}
this._actionbutton._value('generic::save');this._actionbutton._disabled(false);if(data.selector){this.fields.record._value(data.selector);this.fields.key._setValue(data.key);}
this.fields.sign._setValue(data.active);this._actionbutton._onclick=function(){var sign=controller.toggle_sign_outgoing_mails._checked();controller._save.call(controller,{generated:data.generated,sign:sign});}
if(data.generated){this._regretbutton._onclick=function(){view.showGenerate(view.__secondHandler);}}else{this._regretbutton._value('dkim::reset');this._regretbutton._main.classList.add('borderless');this._regretbutton._onclick=function(){controller._reset();}}}
DomainSettingsDKIMView.prototype.showInstructions=function(actionHandler){var controller=this._control;this.__firstHandler=actionHandler;this.hideAll();this.elements.academy.removeAttribute('is-hidden');this._actionbutton._value('dkim::setup');this.__steps[0].classList.add('is-active');this._actionbutton._onclick=function(){actionHandler.call(controller);}
this._regretbutton._value('generic::cancel');this._regretbutton._onclick=function(){controller._close();}}
DomainSettingsDKIMView.prototype.showGenerate=function(actionHandler){var controller=this._control;var view=this;this.hideAll();this.elements.generate.removeAttribute('is-hidden');this.__steps[1].classList.add('is-active');this._actionbutton._value('dkim::generate_key');this.__secondHandler=actionHandler;this._actionbutton._onclick=function(){var v=view.fields.selector._value();if(v){this._disabled(true);view.elements.generate.setAttribute('is-hidden',1);view.showPatience();actionHandler.call(controller,v);}else{gui.message.error(getLang('dkim::no_selector'));}}
var view=this;this._regretbutton._value('generic::back');this._regretbutton._onclick=function(){view.showInstructions(view.__firstHandler);}}
DomainSettingsDKIMView.prototype.showPatience=function(){this.elements.wait.removeAttribute('is-hidden');}
DomainSettingsDKIMView.prototype.hideAll=function(){this.__steps[0].classList.remove('is-active');this.__steps[1].classList.remove('is-active');this.__steps[2].classList.remove('is-active');this.elements.wait.setAttribute('is-hidden',1);this.elements.academy.setAttribute('is-hidden',1);this.elements.generate.setAttribute('is-hidden',1);this.elements.show.setAttribute('is-hidden',1);}
DomainSettingsDKIMView.prototype.notifyResetResult=function(ok){if(ok){gui.message.toast(getLang('dkim::reset_succeeded'));this._control._load();}else{gui.message.error(getLang('error::reset_failed'));}}

/* client/inc/obj_domainsettings_dnsvalidation.js */
function obj_domainsettings_dnsvalidation(){};var _me=obj_domainsettings_dnsvalidation.prototype;_me.__constructor=function(s){var me=this;storage.library('wm_user');};_me._load=function(accountDomain,isDomain)
{var that=this;var me=this;me._accountDomain=accountDomain;me._isDomain=isDomain;that._draw('obj_domainsettings_dnsvalidation','');com.domain.dns(location.parsed_query.domain,function(result){var items=[];for(var i=0;i<result.records.length;i++){items.push({type:result.records[i].type,service:getLang('dns::service_'+result.records[i].service),variable:result.records[i].host,value:result.records[i].rows,status:result.records[i].value?"success":"error"});}
result.general.domaintype=[getLang('domainlist::standard'),getLang('domainlist::domain_alias'),getLang('domainlist::backup_domain'),getLang('domainlist::distributed_domain'),getLang('domainlist::etrn_atrn_queue')][parseInt(result.general.domaintype)];log.log(['dnsvalidation-load',result,items]);that._draw('obj_domainsettings_dnsvalidation','',{items:items,general:result.general});com.properties.get('c_teamchat_api_url',function(url){url+='DNSZoneFile.txt?override_method=files.download&dnszonefile=1&dnsdomain='+location.parsed_query.domain;var a=me._getAnchor('button_download_dnszonefile');a.href=url;a.target='_blank';a.download='DNSZoneFile.txt';a.parentNode.classList.remove('disabled');});});}

/* client/inc/obj_dropdown_single.js */
_me=obj_dropdown_single.prototype;function obj_dropdown_single(){};_me.__constructor=function(){var me=this;var elm=mkElement('select',{"size":"1","name":this._pathName+'#main',"id":this._pathName+'#main'});this._main.appendChild(elm);elm.className=this._type=='obj_dropdown_single'?'obj_dropdown_single':'obj_dropdown_single '+this._type;this._initialValue='';this._elm=elm;this.__eIN=elm.form[elm.name];this._options=[];this.__eIN.onfocus=function(e){var e=e||window.event;me.__hasFocus=true;if(me._onfocus)me._onfocus(e);me.__exeEvent('onfocus',e,{"owner":me});log.log('Element "'+this.id+'" focused');addcss(me._main,'focus');return true;};this.__eIN.onblur=function(e){var e=e||window.event;me.__hasFocus=false;if(me._onblur&&me._onblur(e)===false)return false;me.__exeEvent('onblur',e,{"owner":me});log.log('Element "'+this.id+'" blured');removecss(me._main,'focus');return true;};this.__eIN.onchange=function(e){var e=e||window.event;if(me._onchange&&me._onchange(e,this)===false){return false;}
me.__exeEvent('onchange',e,{"owner":me});};this._main.oncontextmenu=function(e){var e=e||window.event,elm=e.target||e.srcElement;if(me._oncontext&&me._oncontext(e)!==false)
me.__exeEvent('oncontext',e,{"owner":me});};this._main.onkeydown=function(e){var e=e||window.event;if(!me._disabled()&&me._onkeypress)
me._onkeypress(e);return true;};};_me._disabled=function(sDisabled,from_readonly){var me=this;if(sDisabled&&typeof sDisabled=='object'){this._disablealso_ids=sDisabled;}
if(this._disablealso_ids)
{var ids=this._disablealso_ids;for(var i=0;i<ids.length;i++){if(this._parent[ids[i]]){if(this._parent[ids[i]]._disabled){this._parent[ids[i]]._disabled(true);}}else if(this._parent._getAnchor(ids[i])){if(sDisabled){addcss(this._parent._getAnchor(ids[i]),'is-disabled');}else{removecss(this._parent._getAnchor(ids[i]),'is-disabled');}}}}
if(typeof sDisabled!='undefined'){if(sDisabled){addcss(this._main,'is-disabled');me._disable_readonly=(from_readonly);this._elm.disabled=sDisabled;}else{if(this.__apivalue&&this.__apivalue.readonly){}else
if((me._disable_readonly&&from_readonly)||(!from_readonly&&!me._disable_readonly)){removecss(this._main,'is-disabled');this._elm.disabled=sDisabled;}}}
return this._elm.disabled;};_me._value=function(sValue,ignoreonchange,skip_default){if(typeof sValue!='undefined')
{this.__eIN.value=sValue;if(this.__eIN.value!=sValue||(this.__eIN.value==''&&!skip_default)){var done=false;for(var key in this._options){if(!done){this.__eIN.value=key;}
done=true;}}
this._changed(true);if(!ignoreonchange&&this._onchange){this._onchange();}}
if(this.__eIN.selectedIndex==-1){return null;}else{return this.__eIN.value;}};_me._placeholder=function(sPlaceholder){return this.__eIN.placeholder=sPlaceholder?getLang(sPlaceholder):this.__eIN.placeholder;};_me._title=function(sValue){if(Is.String(sValue))
this.__eIN.title=(sValue.indexOf('::')!=-1?getLang(sValue):sValue);else
return this.__eIN.title||'';};_me._readonly=function(bReadonly){log.log(['dropdown-readonly',bReadonly]);if(typeof bReadonly!='undefined')
{if(bReadonly){this._disabled(true,true);addcss(this._main,'is-readonly');this.__eIN.setAttribute('readonly','readonly');}else{this._disabled(false,true);removecss(this._main,'is-readonly');this.__eIN.removeAttribute('readonly');}}
return this.__eIN.hasAttribute('readonly');};_me._fill=function(options,keepContent){if(!keepContent){this._elm.innerHTML='';}
var isarray=false;if(Is.Array(options)){isarray=true;}else if(!Is.Object(options)){return false;}
this._options=options;for(var key in options){var ckey=key;if(key.substr(0,1)=='*'){ckey=key.substr(1,key.length-1);}
var elm=mkElement('option',{"value":(isarray?options[key]:ckey)});elm.innerHTML=options[key];this._elm.appendChild(elm);}
this._changed(true);return this._elm;}
_me._fillLang=function(options,keepContent){if(!keepContent){this._elm.innerHTML='';}
if(typeof options=='string'){options=options.replace(/ /g,'').split(',');}
this._options=options;if(options instanceof Array){for(var n=0,l=options.length;n<l;n++){this._elm.add(new Option(getLang(options[n]),n));}}else{for(var key in options){this._elm.add(new Option(getLang(options[key]),key));}}
this._changed(true);return this._elm;}
_me._addcss=function(css){addcss(this._main,css);}
_me._removecss=function(css){removecss(this._main,css);}
_me._changed=function(clear){if(clear){this._initialValue=this._value();}
return this._initialValue!=this._value();}

/* client/inc/obj_folderpicker.js */
function obj_folderpicker(){};var _me=obj_folderpicker.prototype;_me.__constructor=function(s){storage.library('wm_user');}
_me._init=function(callback,settings){var me=this;me.__callback=callback;me._draw('obj_folderpicker');com.user.folderList(location.parsed_query.account,false,function(result){var root=result.Array.IQ[0].QUERY[0].RESULT[0];try
{var rootElm=me._drawFolder(root);if(rootElm)
{me._getAnchor('root').appendChild(rootElm);}}
catch(e)
{log.error(e);}});}
_me._drawFolder=function(folder,depth){var me=this;var liElm=false;if(!depth){depth=0;}
liElm=mkElement('li',{});addcss(liElm,'folders-child type_'+folder.FOLDERTYPE[0].VALUE.toLowerCase());if(depth==0){addcss(liElm,'folders-root');}
if(depth==1){addcss(liElm,'folders-top');}
liElm._id=folder.ID[0].VALUE;liElm._name=folder.NAME[0].VALUE;liElm.onclick=function(e){if(me.__callback){me.__callback({id:liElm._id,name:liElm._name});me._parent._parent._close();}
e.stopPropagation();e.cancelBubble=true;return false;};var spanElm=mkElement('span',{});addcss(spanElm,'folders-name');spanElm.innerHTML=(folder.NAME[0]&&folder.NAME[0].VALUE?folder.NAME[0].VALUE:'');liElm.appendChild(spanElm);if(folder.SUBFOLDERS&&folder.SUBFOLDERS[0]&&folder.SUBFOLDERS[0].ITEM&&folder.SUBFOLDERS[0].ITEM[0]){addcss(liElm,'open');var ulElm=mkElement('ul',{});addcss(ulElm,'folders-parent');for(var i=0;i<folder.SUBFOLDERS[0].ITEM.length;i++){var sub=this._drawFolder(folder.SUBFOLDERS[0].ITEM[i],depth+1);ulElm.appendChild(sub);}
liElm.appendChild(ulElm);}
return liElm;}
gui.folderpicker=function(callback,settings){var popup=gui._create('popup','obj_popup');popup._init({name:'folderpicker',fixed:false,iwattr:{height:'full',width:'medium'},heading:{value:getLang('accountdetail::folderpicker')},footer:'obj_folderpicker_footer',content:'obj_folderpicker'});popup.content._init(callback,settings);}

/* client/inc/obj_force_options.js */
_me=obj_force_options.prototype;function obj_force_options(){};_me.__constructor=function(){var me=this;me.__oDomain=this._create('force_domain','obj_toggle');addcss(me.__oDomain._main,'domain');me.__oUser=this._create('force_user','obj_toggle');addcss(me.__oUser._main,'user');me.__oDomain._onchange=function(checked){me.__onchange(checked);};me.__oUser._onchange=function(checked){me.__onchange(checked);};};_me.__onchange=function(checked){var me=this;if(me.__oDomain._checked()){me.__oUser._checked(true,true);}
if(this._onchange){this._onchange(this._value());}}
_me._onchange=function(){}
_me._changed=function(clear){}
_me._value=function(data,readonly){try
{if(typeof data!='undefined')
{if(gui._globalInfo.admintype==USER_DOMAIN){readonly=READONLY_BOTH;}
if(typeof readonly=='undefined'&&typeof data.readonly!='undefined'){readonly=data.readonly;}
if(readonly&&readonly==READONLY_DOMAIN||readonly==READONLY_BOTH){this.force_domain._readonly(true);}else{this.force_domain._readonly(false);}
if(readonly&&readonly==READONLY_USER||readonly==READONLY_BOTH){this.force_user._readonly(true);}else{this.force_user._readonly(false);}
if(data&&typeof data.domainadminaccesslevel!='undefined'&&typeof data.useraccesslevel!='undefined'){if(data.domainadminaccesslevel>=FORCE_HIDDEN){data.domainadminaccesslevel=data.domainadminaccesslevel-FORCE_HIDDEN;data.domainadminaccesslevel_hidden=true;this.force_domain._hide(true);}
if(data.useraccesslevel>=FORCE_HIDDEN){data.useraccesslevel=data.useraccesslevel-FORCE_HIDDEN;data.useraccesslevel=true;this.force_user._hide(true);}
if(data.domainadminaccesslevel==FORCE_UNCHECKED||data.domainadminaccesslevel==FORCE_DEFAULT){this.force_domain._checked(false);}else if(data.domainadminaccesslevel==FORCE_CHECKED){this.force_domain._checked(true);}
if(data.useraccesslevel==FORCE_UNCHECKED||data.useraccesslevel==FORCE_DEFAULT){this.force_user._checked(false);}else if(data.useraccesslevel==FORCE_CHECKED){this.force_user._checked(true);}}else{log.error(['forceoptions-value','invalid data',data]);}}
return{domainadminaccesslevel:(this.force_domain._checked()?FORCE_CHECKED:FORCE_UNCHECKED),useraccesslevel:(this.force_user._checked()?FORCE_CHECKED:FORCE_UNCHECKED),}}
catch(e)
{log.error(['forceoptions-value',e]);}}

/* client/inc/obj_fulltext_search.js */
_me=obj_fulltext_search.prototype;function obj_fulltext_search(){};_me.__constructor=function(){};_me._load=function(){com.getProperties(['c_system_services_fulltext_enabled','c_system_services_fulltext_database_url','c_system_services_fulltext_docconv_url','c_system_services_fulltext_scanner_url','c_system_services_fulltext_database_path'],function(result){this._result=result;result.enabled=+result.c_system_services_fulltext_enabled;this._clean();this._draw('obj_fulltext_search','',result);this.configure._onclick=this._configure.bind(this,this._load.bind(this));if(result.enabled){var title=this._getAnchor('fi_indexer').querySelector('span');if(~result.c_system_services_fulltext_scanner_url.value.indexOf('127.0.0.1')){title.textContent=getLang('FULLTEXT_SEARCH_WIZARD::RUNS_LOCALLY',[getLang('FULLTEXT_SEARCH::INDEXER')]);}else{title.textContent=getLang('FULLTEXT_SEARCH_WIZARD::RUNS_REMOTELY',[getLang('FULLTEXT_SEARCH::INDEXER')]);}
this.input_indexer._setValue(result.c_system_services_fulltext_scanner_url);title=this._getAnchor('fi_server').querySelector('span');if(~result.c_system_services_fulltext_database_url.value.indexOf('127.0.0.1')){title.textContent=getLang('FULLTEXT_SEARCH_WIZARD::RUNS_LOCALLY',[getLang('FULLTEXT_SEARCH::SERVER')]);}else{title.textContent=getLang('FULLTEXT_SEARCH_WIZARD::RUNS_REMOTELY',[getLang('FULLTEXT_SEARCH::SERVER')]);this._getAnchor('fi_indexpath').classList.add('hidden');}
this.input_server._setValue(result.c_system_services_fulltext_database_url);title=this._getAnchor('fi_docconv').querySelector('span');if(!result.c_system_services_fulltext_docconv_url.value){title.textContent=getLang('FULLTEXT_SEARCH_WIZARD::IS_DISABLED',[getLang('FULLTEXT_SEARCH::DOCCONV')]);this.input_docconv._main.setAttribute('is-hidden','');}else if(~(result.c_system_services_fulltext_docconv_url.value||'').indexOf('127.0.0.1')){title.textContent=getLang('FULLTEXT_SEARCH_WIZARD::RUNS_LOCALLY',[getLang('FULLTEXT_SEARCH::DOCCONV')]);}else{title.textContent=getLang('FULLTEXT_SEARCH_WIZARD::RUNS_REMOTELY',[getLang('FULLTEXT_SEARCH::DOCCONV')]);}
this.input_docconv._setValue(result.c_system_services_fulltext_docconv_url);this.input_indexpath._setValue(result.c_system_services_fulltext_database_path);}}.bind(this));}
_me._configure=function(callback){var popup=gui._create('popup','obj_popup');popup._init({name:'fulltext_search_wizard',heading:{value:getLang('fulltext_search_wizard::heading')},fixed:false,iwattr:{height:'full',width:'medium'},footer:'obj_fulltext_search_wizard_footer',content:'obj_fulltext_search_wizard'});popup.content._load(callback);}

/* client/inc/obj_fulltext_search_wizard.js */
function obj_fulltext_search_wizard(){};obj_fulltext_search_wizard.prototype.__constructor=function(){this._draw('obj_fulltext_search_wizard','');};obj_fulltext_search_wizard.prototype._load=function(callback){this.steps=[].slice.call(this._getAnchor('steps').getElementsByTagName('li'));this._callback=callback;com.getProperties(['c_system_services_fulltext_enabled','c_system_services_fulltext_database_url','c_system_services_fulltext_docconv_url','c_system_services_fulltext_scanner_url','c_system_services_fulltext_database_path','c_system_storage_dir_mailpath'],function(data){this._data=data;this.steps.forEach(function(step,index){this['_step'+index]&&this['_step'+index](true);},this);this._step(0);}.bind(this));}
obj_fulltext_search_wizard.prototype._step=function(index){this.steps.forEach(function(step,index){step.classList.remove('is-active');this._getAnchor('step'+index).setAttribute('is-hidden','');},this);this.steps[index].classList.add('is-active');this._getAnchor('step'+index).removeAttribute('is-hidden');this._parent.btn_continue._value(index===this.steps.length-1?'generic::save':'generic::continue');this._parent.btn_continue._onclick=function(){if(index===this.steps.length-1){this._save();}else{this._step(index+1);}}.bind(this);this._parent.btn_cancel._value(index===0?'generic::cancel':'generic::back');this._parent.btn_cancel._onclick=function(){if(index){this._step(index-1);}else{this._close();}}.bind(this);this['_step'+index]&&this['_step'+index]();};obj_fulltext_search_wizard.prototype._step0=function(init){this.toggle_c_system_services_fulltext_enabled._onchange=function(checked){this._parent.btn_continue._value(checked?'generic::continue':'generic::save');this.steps.forEach(function(step){step.classList[checked?'remove':'add']('is-disabled');},this);}.bind(this)
this._parent.btn_continue._onclick=function(){if(this.toggle_c_system_services_fulltext_enabled._checked()){this._step(1);}else{this._save();}}.bind(this);this.toggle_c_system_services_fulltext_enabled._setValue(this._data.c_system_services_fulltext_enabled,false);};obj_fulltext_search_wizard.prototype._step1=function(init){this.scanner_local._groupOnchange=function(radio){var local=this._getAnchor('fi_c_system_services_fulltext_scanner_url_local');var remote=this._getAnchor('fi_c_system_services_fulltext_scanner_url_remote');if(+radio._groupValue()){local.setAttribute('is-hidden','');remote.removeAttribute('is-hidden');}else{local.removeAttribute('is-hidden');remote.setAttribute('is-hidden','');}}.bind(this);if(init){var indexer=this._data.c_system_services_fulltext_scanner_url.value||'';if(~indexer.indexOf('127.0.0.1')){this.scanner_local._groupValue(0);this.input_c_system_services_fulltext_scanner_url_local._value(indexer.split(':').pop());}else{this.scanner_local._groupValue(1);this.input_c_system_services_fulltext_scanner_url_remote._value(indexer);}
this._getAnchor('step1').querySelector('.form__block-desc').textContent=this._getAnchor('step1').querySelector('.form__block-desc').textContent.replace('%s',this._data.c_system_storage_dir_mailpath.value);}};obj_fulltext_search_wizard.prototype._step2=function(init){this.database_local._groupOnchange=function(radio){var indexPath=this._getAnchor('fi_c_system_services_fulltext_database_path');var local=this._getAnchor('fi_c_system_services_fulltext_database_url_local');var remote=this._getAnchor('fi_c_system_services_fulltext_database_url_remote');if(+radio._groupValue()){indexPath.setAttribute('is-hidden','');local.setAttribute('is-hidden','');remote.removeAttribute('is-hidden');}else{indexPath.removeAttribute('is-hidden');local.removeAttribute('is-hidden');remote.setAttribute('is-hidden','');}}.bind(this);if(init){this.input_c_system_services_fulltext_database_path._setValue(this._data.c_system_services_fulltext_database_path,false);var server=this._data.c_system_services_fulltext_database_url.value||'';if(~server.indexOf('127.0.0.1')){this.database_local._groupValue(0);this.input_c_system_services_fulltext_database_url_local._value(server.split(':').pop());}else{this.database_local._groupValue(1);this.input_c_system_services_fulltext_database_url_remote._value(server);}}};obj_fulltext_search_wizard.prototype._step3=function(init){this.docconv_local._groupOnchange=function(radio){var local=this._getAnchor('fi_c_system_services_fulltext_docconv_url_local');var remote=this._getAnchor('fi_c_system_services_fulltext_docconv_url_remote');if(+radio._groupValue()===0){local.removeAttribute('is-hidden');remote.setAttribute('is-hidden','');}else if(+radio._groupValue()===1){local.setAttribute('is-hidden','');remote.removeAttribute('is-hidden');}else{local.setAttribute('is-hidden','');remote.setAttribute('is-hidden','');}}.bind(this);if(init){var docconv=this._data.c_system_services_fulltext_docconv_url.value||'';if(!docconv){this.docconv_local._groupValue(2);}else if(~docconv.indexOf('127.0.0.1')){this.docconv_local._groupValue(0);this.input_c_system_services_fulltext_docconv_url_local._value(docconv.split(':').pop());}else{this.docconv_local._groupValue(1);this.input_c_system_services_fulltext_docconv_url_remote._value(docconv);}}};obj_fulltext_search_wizard.prototype._step4=function(){this._parent.btn_cancel._onclick=function(){if(this.toggle_c_system_services_fulltext_enabled._checked()){this._step(3);}else{this._step(0);}}.bind(this);var title=this._getAnchor('fi_indexer').querySelector('span');switch(+this.scanner_local._groupValue()){case 0:this._data.c_system_services_fulltext_scanner_url.value='http://127.0.0.1:'+(this.input_c_system_services_fulltext_scanner_url_local._value()||25795);title.textContent=getLang('FULLTEXT_SEARCH_WIZARD::RUNS_LOCALLY',[getLang('FULLTEXT_SEARCH::INDEXER')]);break;case 1:this._data.c_system_services_fulltext_scanner_url.value=this.input_c_system_services_fulltext_scanner_url_remote._value()||'127.0.0.1:25795';title.textContent=getLang('FULLTEXT_SEARCH_WIZARD::RUNS_REMOTELY',[getLang('FULLTEXT_SEARCH::INDEXER')]);}
this.input_indexer._setValue(this._data.c_system_services_fulltext_scanner_url,false);title=this._getAnchor('fi_server').querySelector('span');switch(+this.database_local._groupValue()){case 0:this._data.c_system_services_fulltext_database_url.value='http://127.0.0.1:'+(this.input_c_system_services_fulltext_database_url_local._value()||25793);title.textContent=getLang('FULLTEXT_SEARCH_WIZARD::RUNS_LOCALLY',[getLang('FULLTEXT_SEARCH::SERVER')]);break;case 1:this._data.c_system_services_fulltext_database_url.value=this.input_c_system_services_fulltext_database_url_remote._value()||'127.0.0.1:25793';title.textContent=getLang('FULLTEXT_SEARCH_WIZARD::RUNS_REMOTELY',[getLang('FULLTEXT_SEARCH::SERVER')]);this._getAnchor('fi_indexpath').classList.add('hidden');}
this.input_server._setValue(this._data.c_system_services_fulltext_database_url,false);title=this._getAnchor('fi_docconv').querySelector('span');switch(+this.docconv_local._groupValue()){case 0:this._data.c_system_services_fulltext_docconv_url.value='http://127.0.0.1:'+(this.input_c_system_services_fulltext_docconv_url_local._value()||25797);title.textContent=getLang('FULLTEXT_SEARCH_WIZARD::RUNS_LOCALLY',[getLang('FULLTEXT_SEARCH::DOCCONV')]);this.input_docconv._main.removeAttribute('is-hidden');break;case 1:this._data.c_system_services_fulltext_docconv_url.value=this.input_c_system_services_fulltext_docconv_url_remote._value()||'127.0.0.1:25797';title.textContent=getLang('FULLTEXT_SEARCH_WIZARD::RUNS_REMOTELY',[getLang('FULLTEXT_SEARCH::DOCCONV')]);this.input_docconv._main.removeAttribute('is-hidden');break;case 2:this._data.c_system_services_fulltext_docconv_url.value='';title.textContent=getLang('FULLTEXT_SEARCH_WIZARD::IS_DISABLED',[getLang('FULLTEXT_SEARCH::DOCCONV')]);this.input_docconv._main.setAttribute('is-hidden','');}
this.input_docconv._setValue(this._data.c_system_services_fulltext_docconv_url,false);this.input_indexpath._setValue(this._data.c_system_services_fulltext_database_path,false);};obj_fulltext_search_wizard.prototype._save=function(){if(this._data.hasChanged()){this._data.saveChanges(function(r){this._callback&&this._callback(r==1);this._close();}.bind(this));}else{this._close();}}

/* client/inc/obj_generic.js */
var obj_generic=(function(){function obj_generic(){}
obj_generic.prototype.__constructor=function(){this.constructor.call(this);};;return obj_generic;}());

/* client/inc/obj_groupinfo.js */
function obj_groupinfo(){};var _me=obj_groupinfo.prototype;_me.__constructor=function(s){var me=this;storage.library('wm_user');var view=this._view=new GroupInfoView(this);this._headingButton=gui.frm_main.main._setHeadingButton('generic::save',function(){me._save();},'button text success');this._headingButton._disabled(true);this._accountDomain=location.parsed_query.account.split('@');this._accountDomain=this._accountDomain[this._accountDomain.length-1];this._selfHash="#menu=accountdetail&account=/ACCOUNT/&type=/TYPE/";};_me._load=function(domain){var me=this;gui.frm_main.main._setHeading(punycode.ToUnicode(location.parsed_query.account));me._draw('obj_groupinfo','',{items:{}});var domain=new Domain(location.parsed_query.account.split('@')[1]);domain.getProperty('d_type',function(domaintype){if(domaintype!=4){me.toggle_allow_gal_export._disabled(true);}});this._getAnchor('fi_setup_permissions').setAttribute('is-hidden',1);this.dropdown_deliver_mail._onchange=function(){me._getAnchor('deliver_mail_icon').setAttribute('status',this._value());}
this.toggle_create_public_folder._onchange=function(checked){if(checked)
{me._getAnchor('group_email_delivery').removeAttribute('is-hidden');me._getAnchor('advanced_settings').removeAttribute('is-hidden');me._getAnchor('fi_setup_permissions').removeAttribute('is-hidden');me._getAnchor('fs_teamchat').removeAttribute('is-hidden');}
else
{me._getAnchor('group_email_delivery').setAttribute('is-hidden',1);me._getAnchor('advanced_settings').setAttribute('is-hidden',1);me._getAnchor('fi_setup_permissions').setAttribute('is-hidden',1);me._getAnchor('fs_teamchat').setAttribute('is-hidden',1);}}
this.input_password_protection._onfocus=function(){this._setType('text');this._selectValue();};this.input_password_protection._onblur=function(){this._setType('password');};this.dropdown_deliver_mail._fill({'*1':getLang('group::deliver_mail_to_shared_folder'),'*0':getLang('group::deliver_to_all_members_individually')});this.btn_permissions._onclick=function(){me._openPermissions();}
this.button_add_alias._onclick=function(e){var v=me._data.A_AliasList.addItem("item","");me.multiple_add_alias._add(v);e.stopPropagation();e.cancelBubble=true;return false;}
var group=new Account(location.parsed_query.account);group.getProperties(['g_groupwarehabfolder','g_name','g_description','u_alias','A_AliasList','g_groupwaremaildelivery','g_listbatch','g_checkmailbox','g_groupwareallowgalexport','g_groupwarecreateteamchat','g_groupwarehab','g_groupwaremembers','a_passwordprotection','m_membersonly','g_groupwareshared','m_moderatedpassword'],function(p){this._data=p;this.input_owner._setValue(p.g_groupwarehabfolder);this.input_description._setValue(p.g_description);this.multiple_add_alias._label("@"+this._accountDomain);this.multiple_add_alias._setValue(p.A_AliasList);if(p.A_AliasList.propertyRights!=2){this.button_add_alias._disabled(true);}
this.toggle_create_public_folder._setValue(p.g_groupwareshared);this.toggle_create_public_folder._onchange(p.g_groupwareshared==1);this.input_create_public_folder._setValue(p.g_name);this.dropdown_deliver_mail._setValue(p.g_groupwaremaildelivery);this.toggle_do_not_deliver._setValue(p.g_checkmailbox);this.toggle_only_members_can_post._setValue(p.m_membersonly);this.toggle_password_protection._setValue(p.a_passwordprotection);this.input_max_number_of_messages._setValue(p.g_listbatch);this.toggle_enable_teamchat._setValue(p.g_groupwarecreateteamchat);this.input_password_protection._setValue(p.m_moderatedpassword);this.toggle_populate_gal._setValue(p.g_groupwaremembers);this.toggle_allow_gal_export._setValue(p.g_groupwareallowgalexport);this.toggle_organize_gal._setValue(p.g_groupwarehab);this._headingButton._disabled(false);}.bind(this),{set:1});}
_me._openPermissions=function(){var popup=gui._create('popup','obj_popup');popup._init({fixed:false,iwattr:{height:'full',width:'medium'},name:'permissions',heading:{value:getLang('accountdetail::permissions')},footer:'obj_permissions_footer',content:'obj_permissions'});popup.content._load(location.parsed_query.account);}
_me._issaved=function(target){return!this._data.hasChanged();}
_me._save=function(callback){var aliases=this.multiple_add_alias;var hash=this._selfHash;var view=this._view;if(this._data.hasChanged()){var newusername=this._data.A_AliasList.hasChanged()?this._data.A_AliasList[0]+'@'+this._accountDomain:false;this._data.saveChanges(function(r){view.saveNotification(r==1);if(callback){callback(r==1);}
if(newusername&&r==1){location.hash=helper.translateHash(hash.replace('/ACCOUNT/',encodeURIComponent(newusername)),location.parsed_query);}});}}
_me._reset=function(){this._data.revertChanges();}
var GroupInfoView=function(controller){this._control=controller;}
GroupInfoView.prototype=Object.create(CoreView.prototype);

/* client/inc/obj_grouplimits.js */
function obj_grouplimits(){};var _me=obj_grouplimits.prototype;_me.__constructor=function(s){storage.library('wm_user');};_me._load=function(group){log.log('Group limits for group '+group);var view=this._view=new GroupLimitsView(this);view.addSaveButton();var group=new Account(group||location.parsed_query.account);group.getProperties(['g_maxbox','g_maxboxsize','g_maxmessagesize'],function(p){this._data=p;view.draw();view.fill(p);}.bind(this));}
_me._issaved=function(target){return!this._data.hasChanged();}
_me._save=function(callback){var view=this._view;if(this._data.hasChanged()){this._data.saveChanges(function(r){view.saveNotification(r==1);if(callback){callback(r==1);}});}}
_me._reset=function(){this._data.revertChanges();this._view.fill(this._data);}
var GroupLimitsView=function(controller){this._control=controller;}
GroupLimitsView.prototype=Object.create(CoreView.prototype);GroupLimitsView.prototype.draw=function(data){var ctrl=this._control;data=data||{};this._control._draw('obj_grouplimits','',{items:data});}
GroupLimitsView.prototype.fill=function(data){var ctrl=this._control;ctrl.toggle_account_quote_enabled._setValue(data.g_maxbox);ctrl.input_account_quote_enabled._setValue(data.g_maxboxsize);ctrl.input_max_file_size._setValue(data.g_maxmessagesize);}

/* client/inc/obj_groupmembers.js */
function obj_groupmembers(){};var _me=obj_groupmembers.prototype;_me.__constructor=function(s){var me=this;storage.library('wa_accountmembers');storage.library('obj_accountpicker');gui.frm_main.main._setHeadingButton('accountdetail::add_members',function(){me._addMembers();},'button text primary');if(!gui.frm_main.main.actions){gui.frm_main.main._cleanHeadingButtonsAnchor();gui.frm_main.main._setAlternativeButtons(function(box,target_anchor){if(!box._alternativeButtons){box._alternativeButtons=[];}
var actionobject=box._create('actions','obj_actionselect',target_anchor);actionobject._value('generic::select_action');if(target_anchor=='heading_buttons_mobile'){actionobject._addcss('full',true);}
actionobject.actions._fill([{name:'delete',icon:false,onclick:function(){me._deleteSelectedMembers();return false;},value:'accountdetail::remove'}]);actionobject._disabled(true);box._alternativeButtons.push(actionobject);});}};_me._load=function(domain)
{var me=this;me._draw('obj_groupmembers','',{items:{}});try
{this.list._onchange=function(e){if(me.list._getSelectedCount()==0){for(var i=0;i<gui.frm_main.main._alternativeButtons.length;i++)
{gui.frm_main.main._alternativeButtons[i]._text(getLang("generic::select_action"));gui.frm_main.main._alternativeButtons[i]._disabled(true);}}else{for(var i=0;i<gui.frm_main.main._alternativeButtons.length;i++)
{gui.frm_main.main._alternativeButtons[i]._text(getLang("generic::select_action")+" ("+me.list._getSelectedCount()+")");gui.frm_main.main._alternativeButtons[i]._disabled(false);}}}
var group=new Account(location.parsed_query.account);var members=this.__members=group.getMemberList();this.list._init('obj_groupmembers',false,function(linesPerPage,page,callback){members.load(function(result){if(result.length){for(var i=0;i<result.length;i++){me.list._drawItem(result[i]);}
me.list._refreshed();}else if(result.error){gui.message.error(result.error);}});},true);}catch(e){log.error(e);}}
_me._deleteSelectedMembers=function(){var me=this;var items=this.list._getSelectedList();var list=[];for(var i=0;i<items.length;i++)
{list.push(items[i].email.toString());}
log.info(['groupmembers-delete',list]);var finish=function(result){if(result.error||result==0){gui.message.error(getLang("error::save_unsuccessful"));}else{gui.message.toast(getLang("message::save_successfull"));me.list._emptySelectedList();me.__members.reset();me.list._load();}}
if(list.length||this.list._selectAllActivated){gui.message.warning(getLang("warning::delete_selected_members",[this.list._selectAllActivated?this.list._totalcount:this.list._getSelectedCount()]),false,[{value:getLang("generic::cancel"),method:'close'},{value:getLang("generic::delete"),type:'text error',onclick:function(closeCallback){if(me.list._selectAllActivated){com.members.removeAll(location.parsed_query.account,finish);}else{com.members.remove(location.parsed_query.account,list,finish);}
closeCallback();}}]);}}
_me._addMembers=function(){var me=this;gui.accountpicker(function(items,type){log.log(['groupmembers-addmembers',items,type]);var list=[];for(var i=0;i<items.length;i++)
{if(type==0){list.push("["+items[i].id+']');}else{list.push(items[i].id);}}
var items_in_grid=me.list._getItems();var old=[];for(var key in items_in_grid){old.push(items_in_grid[key]._item.email);}
var new_items=helper.array_diff(list,old);log.log(['groupmembers-addmembers',old,list,new_items]);com.members.add(location.parsed_query.account,new_items,function(result){if(result.error||result==0){gui.message.error(getLang("error::save_unsuccessful"));}else{gui.message.toast(getLang("message::save_successfull"));me.list._emptySelectedList();me.__members.reset();me.list._load();}});},{exclude:{accounts:[location.parsed_query.account]}});}

/* client/inc/obj_hashhandler.js */
location.parsed_query={};_me=obj_hashhandler.prototype;function obj_hashhandler(){};_me.__constructor=function(s){var me=this;this.oldURL='';AttachEvent(window,'onhashchange',function(){me._changed();});};_me._changed=function(e){var old_hash=helper.trim(this.oldURL,"#");var new_hash=helper.trim(location.hash,'#');var argsParsed=helper.parse_query(new_hash);location.parsed_query=argsParsed;gui._activeDomain=false;if(location.parsed_query.domain){gui._activeDomain=location.parsed_query.domain;}
else if(location.parsed_query.account){var domain=location.parsed_query.account.split('@');gui._activeDomain=domain[domain.length-1];}
else if(gui._globalInfo.domain){gui._activeDomain=gui._globalInfo.domain;}
this.__exeEvent('onchange',e,{'old_hash':decodeURI(old_hash),'new_hash':decodeURI(new_hash),'parsed_query':argsParsed});this.oldURL=new_hash;}
_me._force_changed=function()
{if(location.hash!=''&&location.hash!='#'){this._changed();return true;}else{return false;}}

/* client/inc/obj_iframe.js */
function obj_iframe(){};obj_iframe.prototype.__constructor=function(){this.error=this._getAnchor('error');this.iframe=this._getAnchor('iframe');this.loading=this._getAnchor('loading');this.iframe.addEventListener('load',this._onloadHandler.bind(this));this.iframe.addEventListener('error',this._onerrorHandler.bind(this));this.__messageHandler=this._onmessageHandler.bind(this);window.addEventListener('message',this.__messageHandler);this.reload._onclick=this._reload.bind(this);this._add_destructor('__onbeforedestruct');};obj_iframe.prototype.__onbeforedestruct=function(){window.removeEventListener('message',this.__messageHandler);if(this.__reload&&confirm(getLang('subscription::page_reload'))){location.reload();}}
obj_iframe.prototype._load=function(link){this.__link=link;this.iframe.src=link;}
obj_iframe.prototype._onloadHandler=function(){this.loading.setAttribute('is-hidden','');this.iframe.removeAttribute('is-hidden');}
obj_iframe.prototype._onerrorHandler=function(){this.loading.setAttribute('is-hidden','');this.error.removeAttribute('is-hidden');}
obj_iframe.prototype._onmessageHandler=function(event){var data={};try{data=JSON.parse(event.data);}catch(e){data.action=event.data;}
switch(data.action){case'save':this._parent._parent._close();break;case'refresh':this.__reload=true;}}
obj_iframe.prototype._reload=function(){this.error.setAttribute('is-hidden','');this.loading.removeAttribute('is-hidden');this.iframe.src='';this.iframe.src=this.__link;}

/* client/inc/obj_input_bytes.js */
_me=obj_input_bytes.prototype;function obj_input_bytes(){};obj_input_bytes._units=['b','kb','mb','gb','tb','pb'];obj_input_bytes._unitlabels={b:getLang('generic::size_b'),kb:getLang('generic::size_kb'),mb:getLang('generic::size_mb'),gb:getLang('generic::size_gb'),tb:getLang('generic::size_tb'),pb:getLang('generic::size_pb')};obj_input_bytes._unitmap={b:0,kb:1,mb:2,gb:3,tb:4,pb:5};_me.__constructor=function(){this.__eIN.setAttribute('type','number');this.__baseunit=1;this.__maxunit=4;var change=function(e){var v=parseFloat(this.__eIN.value);var u=obj_input_bytes._unitmap[this._dropdown._value()]-this.__baseunit;var v=v*Math.pow(1024,u);if(isNaN(v)){v='';}
this.__apivalue.value=v;}.bind(this);this.__eIN.addEventListener('input',change,true);this.__eSE.addEventListener('change',change,true);this._refill();};_me._setValue=function(data){var me=this;this.__apivalue=data;function split(v,u){var pow=1024;var max=me.__maxunit-me.__baseunit;u=u||0;if(v>=pow&&max>u){if(u===0){v=Math.round(v);}
return split(v/1024,++u);}else{return{value:v,unit:u};}}
if(data.readonly){this._readonly(true);}
if(data.denied){this._main.setAttribute('is-hidden','1');}
if(data.value==0){this.__eIN.value='';}else{var bytes=parseInt(data.value);if(!isNaN(bytes)){bytes=split(bytes);this.__eIN.value=bytes.value;this._dropdown._value(obj_input_bytes._units[bytes.unit+this.__baseunit]);}}};_me._getValue=function(){return this.__apivalue;};_me._refill=function(){var units={};for(var i=this.__baseunit,j=this.__maxunit;i<=j;i++){units[obj_input_bytes._units[i]]=obj_input_bytes._unitlabels[obj_input_bytes._units[i]];}
this._dropdown._fill(units);}
_me._baseunit=function(unit){unit=unit.toLowerCase();this.__baseunit=obj_input_bytes._unitmap[unit];this._refill();}
_me._maxunit=function(unit){unit=unit.toLowerCase();this.__maxunit=obj_input_bytes._unitmap[unit];this._refill();}

/* client/inc/obj_input_date.js */
_me=obj_input_date.prototype;function obj_input_date(){};obj_input_date.__weekStartsOnMonday=[1,2,3,4,5,6,7];obj_input_date.__weekStartsOnSunday=[7,1,2,3,4,5,6];_me.__constructor=function(){var me=this;this._initialValue='';var lang=navigator.language&&navigator.language.split('-');switch(lang[1]){case'US':this.__week=obj_input_date.__weekStartsOnSunday;break;default:this.__week=obj_input_date.__weekStartsOnMonday;}
this.__days=['mon','tue','wed','thu','fri','sat','sun'];this.__format=getLang('DATETIME::PHP_DATE');var m=this.__format.match(/^([jnmdY])([^a-zA-Z]+)([jnmdY])([^a-zA-Z]+)([jnmdY])$/);if(m){this.__primarySeparator=m[4];this.__secondarySeparator=m[2];var idx={Y:'__yearIndex',m:'__monthIndex',d:'__dayIndex',n:'__monthIndex',j:'__dayIndex'}
this[idx[m[1]]]=0;this[idx[m[3]]]=1;this[idx[m[5]]]=2;this.__paddedDay=m[1]=='d'||m[3]=='d'||m[5]=='d';this.__paddedMonth=m[1]=='m'||m[3]=='m'||m[5]=='m';}else
log.error("Cannot localise date",this.__format);this.__eIN.setAttribute('type','date');this.__native=this.__eIN.type=='date';this.__utctime='00:00:00.000Z';this.__date=null;if(this.__eIN.value)
this._value(this.__eIN.value);this.__eIN.addEventListener('change',function(e){var v=this.value;if(v){if(!me.__native)
me._fill();else
me.__stringToDate(v);}else
me.__date=null;},false);if(!this.__native){this._draw('obj_input_date','main',false,true);var days=this._getAnchor("weekdays");for(var weekday=0;weekday<7;weekday++){var td=document.createElement(this.__week[weekday]==6||this.__week[weekday]==7?'th':'td');td.appendChild(document.createTextNode(getLang('DATETIME::'+this.__days[this.__week[weekday]-1].toUpperCase())));days.appendChild(td);}
this.__eIN.addEventListener('keyup',function(e){if(e.keyCode==13){me.__hide();me.__eIN.blur();return true;}
var v=this.value.split(/[-.\s\/]+/);if(!me.__date)
me.__date=new Date();var y=me.__date.getFullYear();var m=me.__date.getMonth()+1;var isYear=function(y){return y.length==4&&y>1899&&y<2100;}
var isMonth=function(m){return m.length&&m.length<3&&m<13&&m>0;}
var isDate=function(m){return m.length&&m.length<3&&m<32&&m>0;}
var refresh=true;switch(v.length){case 1:if(isYear(v[0]))
me.__date=new Date(v[0]);else if(isMonth(v[0]))
me.__date=new Date(y,v[0]-1);else if(isDate(v[0]))
me.__date=new Date(y,m-1,v[0]);else
refresh=false;break;case 2:if(isYear(v[1])&&isMonth(v[0])){me.__date=new Date(v[1],v[0]-1);}else if(isYear(v[0])&&isMonth(v[1])){me.__date=new Date(v[0],v[1]-1);}else if(me.__monthIndex==0&&isMonth(v[0])&&isDate(v[1])){me.__date=new Date(y,v[0]-1,v[1]);}else if(isDate(v[0])&&isMonth(v[1])){me.__date=new Date(y,v[1]-1,v[0]);}else
refresh=false;break;case 3:if(isYear(v[me.__yearIndex])&&isMonth(v[me.__monthIndex])&&isDate(v[me.__dayIndex]))
me.__date=new Date(v[me.__yearIndex],v[me.__monthIndex]-1,v[me.__dayIndex]);else
refresh=false;break;default:refresh=false;}
if(refresh)
me._onfocus();},false);var setMonthAndRefresh=function(m){var dt=me.__date||new Date();me._setDate(dt.getFullYear(),m+1,dt.getDate());me._onfocus();}
this._getAnchor("month").addEventListener('change',function(){setMonthAndRefresh(this.selectedIndex);},false);this._getAnchor("monthplus").addEventListener('click',function(){var dt=me.__date||new Date();setMonthAndRefresh(dt.getMonth()+1);},false);this._getAnchor("monthminus").addEventListener('click',function(){var dt=me.__date||new Date();setMonthAndRefresh(dt.getMonth()-1);},false);var setYearAndRefresh=function(y){var dt=me.__date||new Date();me._setDate(y,dt.getMonth()+1,dt.getDate());me._onfocus();}
this._getAnchor("yearplus").addEventListener('click',function(){var dt=me.__date||new Date();setYearAndRefresh(dt.getFullYear()+1);},false);this._getAnchor("yearminus").addEventListener('click',function(){var dt=me.__date||new Date();setYearAndRefresh(dt.getFullYear()-1);},false);this._getAnchor("calendar").addEventListener('click',function(e){if(e.target.nodeName=='TH'&&e.target.firstChild&&e.target.firstChild.nodeType==3){var date=parseInt(e.target.firstChild.nodeValue);if(!isNaN(date)){var dt=me.__date||new Date();var year=dt.getFullYear();var month=dt.getMonth()+1;me._setDate(year,month,date);me._onfocus();me.__hide();}}},false);}
this._onfocus=function(){if(!me.__native){var elm=me._getAnchor('dropdown');elm.classList.add("show");var pos=elm.getBoundingClientRect();if(elm.clientWidth>=me._main.clientWidth){elm.classList.add("narrow");if(pos.right>=document.body.clientWidth)
elm.classList.add("right");}
var dt=me.__date||new Date();var year=me._getAnchor("year");year.innerHTML=dt.getFullYear();var months=me._getAnchor("month");months.selectedIndex=dt.getMonth();var dates=me._getAnchor("calendar");dates.innerHTML='';var date=1;var bgn=new Date(dt.getFullYear(),dt.getMonth(),1).getDay()||7;var end=new Date(dt.getTime());end.setMonth(dt.getMonth()+1,0);end=end.getDate();do{var tr=document.createElement('tr');for(var weekday=1;weekday<8;weekday++){if(date==1&&bgn!=me.__week[weekday-1]||date>end){var td=document.createElement('td');tr.appendChild(td);}else{var th=document.createElement('th');if(date==dt.getDate())
th.className="selected";th.appendChild(document.createTextNode(date++));tr.appendChild(th);}}
dates.appendChild(tr);}while(date<end);}}
this._main.addEventListener('click',function(e){e.stopPropagation();},false);gui._obeyEvent('click',[this,'__hide']);gui._obeyEvent('blur',[this,'__hide']);this._add_destructor('__destruct');};_me.__destruct=function(){gui._disobeyEvent('click',[this,'__hide']);gui._disobeyEvent('blur',[this,'__hide']);}
_me.__hide=function(){this._getAnchor('dropdown').classList.remove("show");}
_me._setValue=function(p){var me=this;var v=p.value;if(v=="1899/12/30"){p.value=null;p.commitChanges();}else{v=v.split('/').join('-');this._value(v);}
if(p.readonly){this._readonly(true);}
if(this.__apivalue==undefined){this.__eIN.addEventListener('input',function(e){me.__apivalue.value=this.value.split('-').join('/');},true);}
this.__apivalue=p;}
_me._setDate=function(y,m,d){this._changed(true);if(arguments.length==1&&y.year&&y.month&&y.day){d=y.day;m=y.month;y=y.year;}
this.__date=new Date(y,m-1,d);if(this.__apivalue){this.__apivalue.value=y+'-'+(m<10?'0':'')+m+'-'+(d<10?'0':'')+d;}
this._fill();}
_me._getDate=function(){return this.__date instanceof Date?{year:this.__date.getFullYear(),month:this.__date.getMonth()+1,day:this.__date.getDate()}:null;}
_me._setJulian=function(julian){this._changed(true);this.__date.setGWTime(julian);this._fill();}
_me._getJulian=function(){return this.__date instanceof Date?this.__date.getJulianDate():'';}
_me._setUnix=function(timestamp){this._changed(true);this.__date=new Date(timestamp*1000);this._fill();}
_me._getUnix=function(){return this.__date instanceof Date?parseInt(this.__date.getTime()/1000):'';}
_me._setUTC=function(utc){this._changed(true);utc=utc.split('T');if(utc.length==2){this.__utctime=utc[1];this._value(utc[0]);}}
_me._getUTC=function(utc){return this.__date instanceof Date?this.toString()+'T'+this.__utctime:'';}
_me._value=function(date){if(date==undefined)
return this.__date||'';else if(date instanceof Date){this.__date=date;}else if(typeof date=="string"){this.__stringToDate(date);}
this._fill();this._changed(true);}
_me.__stringToDate=function(date){if(typeof date=="string"&&(date=date.match(/^([0-9]{4})-([01]?[0-9])-([0-3]?[0-9])$/)))
this.__date=new Date(date[1],date[2]-1,date[3]);}
_me._fill=function(){var date=this._getDate();if(date){if(this.__native)
this.__eIN.value=date.year+'-'+(date.month<10?'0'+date.month:date.month)+'-'+(date.day<10?'0'+date.day:date.day);else{var f=this.__format.replace('Y',date.year);f=f.replace('n',date.month).replace('m',date.month<10?'0'+date.month:date.month);f=f.replace('j',date.day).replace('d',date.day<10?'0'+date.day:date.day);this.__eIN.value=f;}}else
this._clear();}
_me._clear=function(){this.__date=null;this.__eIN.value='';this._changed(true);}
_me.toString=function(){var date=this._getDate();return date?date.year+'-'+(date.month<10?'0'+date.month:date.month)+'-'+(date.day<10?'0'+date.day:date.day):'0000-00-00';}
_me._changed=function(clear){log.log([this._initialValue,this.__eIN.value]);if(clear){this._initialValue=this.__eIN.value;}
return this._initialValue!=this.__eIN.value;}

/* client/inc/obj_input_dropdown.js */
_me=obj_input_dropdown.prototype;function obj_input_dropdown(){};_me.__constructor=function(){this.__addDropdown();};_me.__addDropdown=function(){this.__ddname=this._name.replace('input_','dropdown_');this._create(this.__ddname,'obj_dropdown_single');this._dropdown=this[this.__ddname];var form=this._main.getElementsByTagName('form')[0];form.classList.remove('input');var select=form.getElementsByTagName('select')[0];this.__eSE=select;this._main.replaceChild(select,form);var input=this._main.getElementsByTagName('input')[0];var div=document.createElement('div');div.className="dropdown obj_dropdown_single form__element form__group-right";this._main.appendChild(div);div.appendChild(select);var div=document.createElement('div');div.className="input obj_input_text obj_input_number form__element form__group-left";this._main.appendChild(div);div.appendChild(input);div.appendChild(this._main.firstChild);this._main.classList.remove('input');}
_me._setValue=function(sValue){};_me._getValue=function(sValue){};_me._disabled=function(bDisable){if(bDisable==undefined){return this._dropdown._disabled();}else{this._dropdown._disabled(bDisable);obj_input_text.prototype._disabled.call(this,bDisable);}}

/* client/inc/obj_input_email.js */
_me=obj_input_email.prototype;function obj_input_email(){};_me.__constructor=function(){this.__eIN.setAttribute('type','email');};

/* client/inc/obj_input_hidden.js */
_me=obj_input_hidden.prototype;function obj_input_hidden(){};_me.__constructor=function(){this.__eIN.setAttribute('type','hidden');};

/* client/inc/obj_input_multiple.js */
_me=obj_input_multiple.prototype;function obj_input_multiple(){};_me.__constructor=function(){this.__value=undefined;this.__num=0;this.__type='text';var parent=this._main.parentNode;parent.removeChild(this._main);this._main=parent;};_me._add=function(v){var me=this;var num=this.__num++;var aliasName=this._name+'_'+num;var alias=this._pathName+'#'+aliasName;var elm=mkElement('div',{id:alias});addcss(elm,'form-row');this._main.appendChild(elm);this._create(aliasName,'obj_input_'+this.__type,aliasName);var input=this[aliasName];if(this.__placeholder){input._placeholder(this.__placeholder);}
if(this.__label){input._label(this.__label,true);}
if(v instanceof IWAPI.Value){input._setValue(v);}else if(v){input._value(v);}
var valuelist=this.__value;input.__eIN.addEventListener('blur',function(e){if(input.__eIN.value==""){valuelist.splice(num,1);input._destruct();elm.parentNode.removeChild(elm);}},true);input.__eIN.addEventListener('input',function(e){valuelist[num]=this.value;me._onchange&&me._onchange(valuelist);},true);}
_me._value=function(v){if(v===null){this.__value=null;}else
if(v instanceof Array){this.__value=v;for(var i=0,l=v.length;i<l;i++){this._add(v[i]);}}else
if(typeof v=='string'){this.__value=[v];this._add([v]);}
return this.__value;};_me._setValue=function(apiprop){this.__value=[];this.__apivalue=apiprop;for(var i=0,l=apiprop.length;i<l;i++){this._add(apiprop[i]);this.__value.push(apiprop[i].value);}}
_me._type=function(sType){this.__type=sType;}
_me._label=function(sLabel){this.__label=sLabel;return this.__label;}
_me._placeholder=function(sText){this.__placeholder=sText;return this.__placeholder;}

/* client/inc/obj_input_number.js */
_me=obj_input_number.prototype;function obj_input_number(){};_me.__constructor=function(){this.__eIN.setAttribute('type','number');this.__eIN.addEventListener('keydown',function(e){switch(e.key){case'-':if(!this.__allow_negative){e.preventDefault();}
break;case'.':if(!this.__allow_decimal){e.preventDefault();}
break;case'e':e.preventDefault();break;}},true);this.__eIN.addEventListener('input',function(e){this.value=this.value.replace(/[^0-9]/g,'');},true);};_me._allowNegative=function(bAllow){this.__allow_decimal=bAllow;}
_me._allowDecimal=function(bAllow){this.__allow_decimal=bAllow;}
_me._value=function(sValue,donotclear){if(sValue===null){this.__value=null;this.__eIN.value="";}else
if(typeof sValue!='undefined'){sValue=sValue.toString().replace(/ /g,'');this.__value=sValue;this.__eIN.value=sValue==0?'':sValue;this._changed(donotclear?false:true);if(this._onchange){this._onchange();}}
var v=this.__eIN.value;if(v==""||isNaN(parseFloat(v))){return null;}else{return v;}};

/* client/inc/obj_input_password.js */
_me=obj_input_password.prototype;function obj_input_password(){};_me.__constructor=function(){this.__eIN.setAttribute('type','password');this.__eIN.setAttribute('autocomplete','off');};

/* client/inc/obj_input_search.js */
_me=obj_input_search.prototype;function obj_input_search(){};_me.__constructor=function(){this.__eIN.setAttribute('type','search');};

/* client/inc/obj_input_tel.js */
_me=obj_input_tel.prototype;function obj_input_tel(){};_me.__constructor=function(){this.__eIN.setAttribute('type','tel');};

/* client/inc/obj_input_text.js */
_me=obj_input_text.prototype;function obj_input_text(){};_me.__constructor=function(){var me=this;storage.library("markdown");var elm=mkElement('input',{"type":"text","name":this._pathName+'#main',"id":this._pathName+'#main'});var bubble=mkElement('div',{"name":this._pathName+'#bubble',"id":this._pathName+'#bubble'});addcss(bubble,'bubble');this._main.appendChild(elm);this._main.appendChild(bubble);this._initialValue='';this.__eIN=elm.form[elm.name];this.__value=null;this._bubble=bubble;this._elm=elm;this._main.onsubmit=function(){if(me._onsubmit){me._onsubmit();return false;}}
if(this.__attributes.markdown&&(this.__attributes.markdown=="true"||this.__attributes.markdown=="1")){this._markdown(true);}
var me=this;this.__eIN.onchange=function(e){me._message();}
this.__eIN.onfocus=function(e){var e=e||window.event;me.__hasFocus=true;if(me._onfocus)me._onfocus(e);me.__exeEvent('onfocus',e,{"owner":me});log.log('Element "'+this.id+'" focused');addcss(me._main,'focus');return true;};this.__eIN.onblur=function(e){var e=e||window.event;me.__hasFocus=false;log.log(me._onblur);if(me._onblur&&me._onblur(e)===false)return false;me.__exeEvent('onblur',e,{"owner":me});log.log('Element "'+this.id+'" blured');removecss(me._main,'focus');return true;};this.__eIN.oninput=function(e){me.__value=this.value;}
this._main.oncontextmenu=function(e){var e=e||window.event,elm=e.target||e.srcElement;if(me._oncontext&&me._oncontext(e)!==false)
me.__exeEvent('oncontext',e,{"owner":me});};this._main.onkeydown=function(e){var e=e||window.event;if(!me._disabled()&&me._onkeypress)
me._onkeypress(e);return true;};this._main.onkeyup=function(e){var e=e||window.event;if(!me._disabled()&&me._onkeyup)
{me._hideError();me._onkeyup(e);}
return true;};};_me._hideError=function(){this._message();}
_me._selectValue=function(){this._elm.setSelectionRange(0,this._elm.value.length);}
_me._copyToClipboard=function(){this.__eIN.select();document.execCommand('Copy');}
_me._setType=function(type){this._elm.type=type;}
_me._message=function(text,type,position){if(!position){position='';}
if(text)
{removecss(this._bubble,'error');removecss(this._bubble,'warning');removecss(this._bubble,'success');removecss(this._bubble,'top');removecss(this._bubble,'bottom');removecss(this._bubble,'left');removecss(this._bubble,'right');removecss(this._main,'has-error');this._bubble.innerHTML=helper.htmlspecialchars(text);addcss(this._bubble,'is-visible '+type+' '+position);if(type=='error'){addcss(this._main,'has-error');}}
else
{this._bubble.innerHTML='';removecss(this._bubble,'is-visible');removecss(this._main,'has-error');}}
_me._error=function(text,position){this._message(text,'error',position);}
_me._warning=function(text,position){this._message(text,'warning',position);}
_me._success=function(text,position){this._message(text,'success',position);}
_me._disabled=function(sDisabled){if(sDisabled&&typeof sDisabled=='object'){this._disablealso_ids=sDisabled;}
if(this._disablealso_ids)
{var ids=this._disablealso_ids;for(var i=0;i<ids.length;i++){if(this._parent[ids[i]]){if(this._parent[ids[i]]._disabled){this._parent[ids[i]]._disabled(true);}}else if(this._parent._getAnchor(ids[i])){if(sDisabled){addcss(this._parent._getAnchor(ids[i]),'is-disabled');}else{removecss(this._parent._getAnchor(ids[i]),'is-disabled');}}}}
if(sDisabled){addcss(this._main,'is-disabled');}else{removecss(this._main,'is-disabled');}
return this._elm.disabled=sDisabled;};_me._placeholder=function(sPlaceholder,text){if(text){return this.__eIN.placeholder=sPlaceholder?sPlaceholder:this.__eIN.placeholder;}
return this.__eIN.placeholder=sPlaceholder?getLang(sPlaceholder):this.__eIN.placeholder;};_me._required=function(sRequired){return this.__eIN.required=sRequired?true:false;};_me._readonly=function(bReadonly){if(typeof bReadonly!='undefined')
{if(bReadonly){addcss(this._main,'is-readonly');this.__eIN.setAttribute('readonly','readonly');}else{removecss(this._main,'is-readonly');this.__eIN.removeAttribute('readonly');}}
return this.__eIN.hasAttribute('readonly');};_me._label=function(sLabel,translated){if(sLabel==''){sLabel=false;}
if(typeof sLabel!='undefined')
{if(sLabel)
{if(!translated){sLabel=getLang(sLabel);}
if(!this._labelSet)
{addcss(this._main,'inner-label');var ch=mkElement('label',{});ch.innerHTML=helper.htmlspecialchars(sLabel);addcss(ch,'label');this._labelSet=ch;return this._main.appendChild(ch);}
else
{this._labelSet.innerHTML=helper.htmlspecialchars(sLabel);}}
else
{if(this._labelSet)
{this._main.removeChild(this._labelSet);this._labelSet=false;}}}
else
{return this._labelSet.innerHTML;}
return true;};_me._onchange=function(){}
_me._onsubmit=function(){}
_me._title=function(sValue){if(Is.String(sValue))
this.__eIN.title=(sValue.indexOf('::')!=-1?getLang(sValue):sValue);else
return this.__eIN.title||'';};_me._onkeyup=function(){if(this._onchange){this._onchange();}};_me._value=function(sValue,donotclear){if(sValue===null){this.__value=null;this.__eIN.value="";}else
if(typeof sValue!='undefined'){sValue=sValue.toString();this.__value=sValue;if(this._markdownEnabled){sValue=markdown.decode(sValue);}
this.__eIN.value=sValue;this._changed(donotclear?false:true);if(this._onchange){this._onchange();}}
if(this._markdownEnabled){return markdown.encode(this.__eIN.value);}
if(this.__eIN.value==""&&this.__value===null){return null;}else{return this.__eIN.value;}};_me._toggle=function(agent){if(this._ishidden){this._show(agent);}else{this._hide(agent);}}
_me._addcss=function(css){addcss(this._main,css);}
_me._removecss=function(css){removecss(this._main,css);}
_me._show=function(agent){this._main.style.display='';this._ishidden=false;};_me._hide=function(hide){if(hide){this._main.setAttribute('is-hidden',1);}else{this._main.removeAttribute('is-hidden');}
this._ishidden=hide;};_me._changed=function(clear){if(clear){this._initialValue=this._value();}
return this._value()!==null&&this._initialValue!=this._value();}
_me._markdown=function(enable){var me=this;if(enable!==void 0){me._markdownEnabled=enable;}
return(me._markdownEnabled?true:false)}

/* client/inc/obj_input_url.js */
_me=obj_input_url.prototype;function obj_input_url(){};_me.__constructor=function(){this.__eIN.setAttribute('type','url');};

/* client/inc/obj_loadable.js */
_me=obj_loadable.prototype;function obj_loadable(){};_me.__constructor=function(s){var me=this;me._rowHeight=0;me._linesPerPageMin=20;me.page=0;me._max_count=0;me._loading=false;me._count=1;me._exist=true;this._selectedList=[];this.__list={};me.__scrollableObject=false;this._getAnchor('selection_info_toggle').onclick=function(){if(!me._selectionShown){me._showSelectedList();}else{me._load();}}};_me._table=function(){var me=this;return{_addcss:function(classes){addcss(me._main,classes);},_removecss:function(classes){removecss(me._main,classes);}};};_me._showSelectedList=function(){var me=this;try
{if(!this._selectionShown){var toggle=this._getAnchor('selection_info_toggle');toggle.innerHTML=toggle.getAttribute('selection-shown');this._selectionShown=true;this._empty();this._setMax(-1);var list=this._getSelectedList();for(var i=0;i<list.length;i++){me._drawItem(list[i],function(checkbox){log.log(['loadable-showselectedlist-checkbox',checkbox]);me._itemSelected(checkbox);},true,false);}}}
catch(e)
{log.error(e);}}
_me._selectionInfoRefresh=function(){var count=this._getSelectedCount();this._getAnchor('selection_info_count').innerHTML=count;}
_me._selectionCounter=function(enabled){if(enabled){this._getAnchor('selection_info').removeAttribute('is-hidden');}else{this._getAnchor('selection_info').setAttribute('is-hidden',1);}}
_me._emptySelectedList=function(silent,simple){this._selectedList=[];if(!simple){this._selectAll(false,(silent?false:true));}
this.checkbox_0._checked(false,true);this._onchange({type:2,text:'selected-list-emptied'});}
_me._inList=function(item){for(var i=0;i<this._selectedList.length;i++){if(item._id==this._selectedList[i]._id){return true;}}
return false;}
_me._getSelectedList=function(){if(this._selectAllActivated&&this._max_count>=0){return'all';}
return this._selectedList;}
_me._getSelectedCount=function(){if(this._selectAllActivated&&this._max_count>=0){return this._max_count;}
return this._selectedList.length;}
_me._itemSelected=function(checkbox){var data=checkbox.__source;var checked=checkbox._checked();var me=this;log.log(['loadable-itemselected']);if(checked){var row=helper.getParentByClassName(checkbox._main,'_item-row');if(row){addcss(row,'is-selected');}
if(!this._inList(data)){this._selectedList.push(data);me._selectionInfoRefresh();me._onchange({type:0,text:'item-added-to-list'});}}else{var row=helper.getParentByClassName(checkbox._main,'_item-row');if(row){removecss(row,'is-selected');}
for(var i=0;i<this._selectedList.length;i++){if(data._id==this._selectedList[i]._id){this._selectedList.splice(i,1);me._selectionInfoRefresh();me._onchange({type:1,text:'item-removed-from-list'});}}}}
_me._redrawItem=function(target,item,callback,checked,disabled){if(target._parent.__list[target._uid]){delete target._parent.__list[target._uid];}
var line=this._drawItem(item,callback,checked,disabled);target.parentNode.replaceChild(line,target);return line;}
_me._drawItem=function(item,callback,checked,disabled){if(!item){item={};}
var me=this;var line=this._draw(this._itemTemplate,'body',{item:item},true);line._item=item;if(this._selectAllActivated&&this._max_count>=0){checked=true;disabled=true;}
var elm=this['checkbox_'+this._count];if(!checked){checked=false;}
if(!disabled){disabled=false;}
if(elm){if(!item.id){item._id=JSON.stringify(item);}else{item._id=item.id;}
elm.__source=item;elm._onclick=function(e){log.log(['loadable-drawitem-onclick'])
if(elm._onchange){elm._onchange(e);}
e.stopPropagation();e.cancelBubble=true;return false;}
elm._onchange=function(e){if(this.__source.selectable||typeof this.__source.selectable=='undefined')
{me._itemSelected(elm);}
if(callback){callback(elm,elm._checked());}}
log.log(['loadable-drawitem-inlist',me._inList(item)]);elm._checked(checked?true:me._inList(item));elm._disabled(disabled);}
this._loading=false;this._count++;if(line&&line.getElementsByTagName){line._objects=[];var tags=line.getElementsByTagName('*');for(var i=0;i<tags.length;i++){if(tags[i].id&&tags[i].id.search('gui.')==0&&tags[i].id.search('#')<0){eval("var obj="+tags[i].id);line._objects.push(obj);}}
var uid=helper.uniqid('loadable_item_',true);line._parent=me;line._uid=uid;line._addObject=function(line){return function(obj){me._addObject(line,obj);}}(line);line._destruct=function(line){return function(){line.parentNode.removeChild(line);if(line._parent.__list[line._uid]){delete line._parent.__list[line._uid];}}}(line);me.__list[uid]=line;if(!line){log.error(['loadable-drawItem','line does not exist but should',line]);}
return line;}
else
{log.error(['loadable-drawItem','line does not exist',line]);return false;}}
_me._getItems=function(){return this.__list;}
_me._destruct=function(){this._exist=false;}
_me._setMax=function(max){if(max===false){max=-1;}
this._max_count=max;}
_me._setMin=function(min){if(min===false){min=-1;}
this._linesPerPageMin=min;}
_me._loadItems=function(callback){if(!this._loading)
{this._loading=true;var row_height=this.rowHeight;var domainDetail_height=this.__scrollableObject.offsetHeight;var linesPerPage=Math.ceil(domainDetail_height/row_height);if(linesPerPage<this._linesPerPageMin){linesPerPage=this._linesPerPageMin;}
if(this.page*linesPerPage<=this._max_count||this._max_count==0)
{if(this.__showprogress){addcss(this._getAnchor('loader'),'is-visible');}
this._loadFunction(linesPerPage,this.page,callback);this.page++;}}}
_me._refreshed=function(){removecss(this._getAnchor('loader'),'is-visible');}
_me._content=function(items){if(items!=undefined){removecss(this._getAnchor('loader'),'is-visible');items.removeItem('offset');this._totalcount=+items.getItem('overallcount');items.removeItem('overallcount');if(!this.__content){this.__content=new IWAPI.List('items');}
for(var i=0,l=items.length;i<l;i++){this.__content.addItem(items[i]);}
this._currentcount=this.__content.length;}else{return this.__content;}}
_me._init=function(cssFileDependency,scrollableObject,func,progress){var me=this;if(!scrollableObject){scrollableObject=this._getAnchor('body_wrapper');}
me.__scrollableObject=scrollableObject;me.__showprogress=progress;me._loadFunction=func;me.timeout=setInterval(function(){if(storage.css_status(cssFileDependency))
{clearInterval(me.timeout);try
{me._loadItems(function(){me._loadItems();});}
catch(e)
{log.error(e);}}},100);scrollableObject.onscroll=function(e){if(me._exist)
{if(gui.__sound_on){if(!gui.frm_main.scrape.__playingContinuousLoadable){gui.frm_main.scrape._playContinuous();log.log('scrape play');gui.frm_main.scrape.__playingContinuousLoadable=setTimeout(function(){gui.frm_main.scrape._fadeOut(50,true);log.log('scrape pause');gui.frm_main.scrape.__playingContinuousLoadable=false;},200);}else{log.log('scrape clear');clearTimeout(gui.frm_main.scrape.__playingContinuousLoadable);gui.frm_main.scrape.__playingContinuousLoadable=setTimeout(function(){gui.frm_main.scrape._fadeOut(50,true);log.log('scrape pause');gui.frm_main.scrape.__playingContinuousLoadable=false;},200);}}
var bottom=this.scrollHeight-(this.scrollTop+this.offsetHeight)-this.offsetHeight;if(!me._loading&&bottom<0){me._loadItems();}}}
scrollableObject.ontouchmove=scrollableObject.onscroll;window.onresize=scrollableObject.onscroll;window.addEventListener('resize',function(){if(me){scrollableObject.onscroll();}},true);}
_me._addObject=function(line,obj){line._objects.push(obj);log.log(['loadable-addobject',line,line._objects,obj]);}
_me._empty=function(){try
{this.page=0;this._loading=false;for(var i=1;i<this._count;i++){if(this['checkbox_'+i]){this['checkbox_'+i]._destruct();}}
for(var key in this.__list)
{if(this.__list[key]._objects)
{for(var ii=0;ii<this.__list[key]._objects.length;ii++){if(this.__list[key]._objects[ii]._destruct){this.__list[key]._objects[ii]._destruct();}}}}
this.__list={};this._getAnchor('body').innerHTML='';this._count=1;this._onempty&&this._onempty();}
catch(e)
{log.error(['loadable-empty',e]);}}
_me._load=function(callback){try
{var toggle=this._getAnchor('selection_info_toggle');toggle.innerHTML=toggle.getAttribute('selection-hidden');this._selectionShown=false;this._max_count=0;this._empty();this._loadItems(callback);this._onchange();}
catch(e)
{log.error(['loadable-load',e]);}}
_me._selectAll=function(activated,activateCallback,disableSelected){var me=this;me._selectAllActivated=activated;for(var i=1;i<me._count;i++){me['checkbox_'+i]._checked(activated,!activateCallback);if(disableSelected){me['checkbox_'+i]._disabled(activated);}}
this.checkbox._checked(activated,true);if(!activated){me._emptySelectedList(false,true)};}
_me._label=function(label){var me=this;if(label){this._draw(label,'head',{});if(this.checkbox_0){this.checkbox_0._onchange=function(){log.info(['loadable-label','changed']);var ischecked=me.checkbox_0._checked();var ret=me._onchange({type:ischecked,text:'select-all'});if(ret===false){return false;}
me._selectAll(ischecked,true);return false;}}}}
_me._value=function(value){this._itemTemplate=value;this._draw(value,'dummy',{});this._getAnchor('dummy').removeAttribute('is-hidden');this.rowHeight=this._getAnchor('dummy').offsetHeight;this._getAnchor('dummy').setAttribute('is-hidden',1);}
_me._iwAttr=function(arr,val){if(typeof arr!='object'){n={};n[arr]=val;arr=n;}
for(var key in arr){this._main.setAttribute('iw-'+key,arr[key]);}}
_me._onchange=function(){}

/* client/inc/obj_mailinglistinfo.js */
function obj_mailinglistinfo(){};var _me=obj_mailinglistinfo.prototype;_me.__constructor=function(s){var me=this;storage.library('wm_user');storage.library('obj_accountpicker');this._headingButton=gui.frm_main.main._setHeadingButton('generic::save',function(){me._save();},'button text success');this._headingButton._disabled(true);this._accountDomain=location.parsed_query.account.split('@');this._accountDomain=this._accountDomain[this._accountDomain.length-1];this._selfHash="#menu=accountdetail&account=/ACCOUNT/&type=/TYPE/";this._changeObserverID='mailinglistinfo';gui._changeObserver.assignListener(this._changeObserverID,function(callback){if(callback){close();return me._save(false,callback);}else{return me._save('changed');}});this._add_destructor('__onbeforedestruct');};_me.__onbeforedestruct=function(){gui._changeObserver.clearListener(this._changeObserverID);}
_me._load=function(domain)
{var me=this;gui.frm_main.main._setHeading(punycode.ToUnicode(location.parsed_query.account));me._draw('obj_mailinglistinfo','',{items:{}});this.dropdown_source._readonly(true);this.input_password._disabled(true);this.dropdown_password_protection._onchange=function(){if(this._value()==0){me.toggle_forward_copy_to_owner._disabled(false);me.input_password._disabled(true);}else{me.toggle_forward_copy_to_owner._disabled(true);me.input_password._disabled(false);}}
this.input_password._onfocus=function(){this._setType('text');this._selectValue();};this.input_password._onblur=function(){this._setType('password');};this.dropdown_password_protection._fill({'*0':getLang('mailinglist::not_password_protected'),'*2':getLang('mailinglist::server_moderated'),'*1':getLang('mailinglist::client_moderated')});this.dropdown_default_rights._fill({'*0':getLang('mailinglist::recieve_and_post'),'*7':getLang('mailinglist::digest_recieve_and_post'),'*1':getLang('mailinglist::recieve_only'),'*5':getLang('mailinglist::digest_recieve_only'),'*2':getLang('mailinglist::post_only')});this.dropdown_source._fill({'*0':getLang('mailinglist::members_defined_manually'),'*5':getLang('mailinglist::members_from_database'),'*1':getLang('mailinglist::all_current_domain_users'),'*2':getLang('mailinglist::all_system_users'),'*3':getLang('mailinglist::all_system_domain_administrators'),'*4':getLang('mailinglist::all_system_administrators')});this.btn_owner._onclick=function(){gui.accountpicker(function(items,type){var val=helper.trim(me.input_owner._value(),';');for(var i=0;i<items.length;i++){if(type==0){val+=';['+items[i].id+']';}else{val+=';'+items[i].id;}}
me.input_owner._value(helper.trim(val,';'));},{disable_add_domain:true});}
me.button_add_alias._onclick=function(e){me._addAlias();e.stopPropagation();e.cancelBubble=true;return false;}
this._getAnchor('aliases')._changed=function(clear){if(me._aliasList){var ret=false;for(var i=0;i<me._aliasList.length;i++){if(me._aliasList[i].object._changed(clear)){ret=true;}}}
return ret;}
this._getAnchor('aliases')._getMainAlias=function(asemail){var alias=me.alias_0._value();if(asemail){return alias+"@"+me._accountDomain;}
return alias;}
this._getAnchor('aliases')._value=function(itemlist){if(itemlist)
{for(var i=0;i<itemlist.length;i++){log.log(itemlist[i]);me._addAlias(itemlist[i]);}}
else
{try
{if(me._aliasList){for(var i=me._aliasList.length-1;i>0;i--){if(helper.trim(me._aliasList[i].object._value())==''){me.removeAlias(me._aliasList[i]);}}}
var ret=[];if(me._aliasList){for(var i=0;i<me._aliasList.length;i++){ret.push({VALUE:me._aliasList[i].object._value()});}}
return{VAL:[{ITEM:ret}]};}
catch(e)
{log.error(e);}}};com.user.mailingListInfo(location.parsed_query.account,function(aResults){try
{var items=aResults.Array.IQ[0].QUERY[0].RESULT[0].ITEM;}
catch(e)
{log.error(['e:invalid-data',e]);}
try
{for(var i=0;i<items.length;i++)
{var propname=items[i].APIPROPERTY[0].PROPNAME[0].VALUE;var propval={};if(items[i].PROPERTYVAL&&items[i].PROPERTYVAL[0]){propval=items[i].PROPERTYVAL[0];}
var bval=false;var sval="";var ival=0;if(propval.VAL&&propval.VAL[0]&&propval.VAL[0].VALUE){sval=propval.VAL[0].VALUE;bval=(propval.VAL[0].VALUE=='0'?false:true);ival=parseInt(propval.VAL[0].VALUE);}
try
{log.log([propname.toLowerCase(),propval.VAL]);switch(propname.toLowerCase())
{case'u_name':n='input_description';me[n].__source=items[i];me[n]._value(sval);break;case'm_owneraddress':n='input_owner';me[n].__source=items[i];me[n]._value(sval);break;case'a_aliaslist':var list=[];if(propval.VAL&&propval.VAL[0]&&propval.VAL[0].ITEM&&propval.VAL[0].ITEM[0]){var aliases=propval.VAL[0].ITEM;var list=[];for(var ii=0;ii<aliases.length;ii++){list.push(aliases[ii].VALUE);}
propval.VAL[0].ITEM=[];}
log.log(propval.VAL[0].ITEM[0]);me._getAnchor('aliases').__source=items[i];me._getAnchor('aliases')._value(list);break;case'm_listbatch':n='input_max_number_of_messages';me[n].__source=items[i];me[n]._value(sval);break;case'm_sendalllists':n='dropdown_source';me[n].__source=items[i];me[n]._value(sval);break;case'm_defaultrights':n='dropdown_default_rights';me[n].__source=items[i];me[n]._value(sval);break;case'm_moderated':n='dropdown_password_protection';me[n].__source=items[i];me[n]._value(sval);break;case'm_sendtosender':n='toggle_send_to_sender';me[n].__source=items[i];me[n]._checked(bval);break;case'm_copytoowner':n='toggle_forward_copy_to_owner';me[n].__source=items[i];me[n]._checked(bval);break;case'm_membersonly':n='toggle_only_members_can_post';me[n].__source=items[i];me[n]._checked(bval);break;case'm_checkmailbox':n='toggle_do_not_deliver';me[n].__source=items[i];me[n]._checked(bval);break;case'm_removedead':n='toggle_remove_failed_email_addresses';me[n].__source=items[i];me[n]._checked(bval);break;case'm_moderatedpassword':n='input_password';me[n].__source=items[i];me[n]._value(sval);break;}}
catch(e)
{log.error(e);}}}
catch(e)
{log.error(e);}
me._headingButton._disabled(false);});}
_me.removeAlias=function(alias){if(this._aliasList){if(this._aliasList.length>1){log.log("remove");alias.object._destruct();alias.box.parentElement.removeChild(alias.box);for(var i=0;i<this._aliasList.length;i++){if(this._aliasList[i]==alias){this._aliasList.splice(i,1);}}}else{alias.object._value('');}}}
_me._addAlias=function(value){if(!this._aliasNum){this._aliasNum=0;}
if(!this._aliasList){this._aliasList=[];}
var aliasName='alias_'+this._aliasNum;var alias=this._pathName+'#'+aliasName;var elm=mkElement('div',{id:alias});addcss(elm,'form-row');this._getAnchor('aliases').appendChild(elm);this._create(aliasName,'obj_input_text',aliasName);this[aliasName]._placeholder('accountdetail::add_alias');this[aliasName]._label("@"+punycode.ToUnicode(this._accountDomain),true);if(value){this[aliasName]._value(value);}
this._aliasList.push({name:aliasName,object:this[aliasName],box:elm});this._aliasNum++;}
_me._save=function(method,callback){var me=this;try
{var toSave=[me.input_owner,me.input_description,me._getAnchor('aliases'),me.toggle_only_members_can_post,me.dropdown_password_protection,me.dropdown_default_rights,me.input_max_number_of_messages,me.toggle_send_to_sender,me.toggle_forward_copy_to_owner,me.toggle_remove_failed_email_addresses,me.toggle_do_not_deliver,me.input_password];if(method&&method=='changed'){var changed=com.user._prepareChanged(toSave);log.log(['mailinglistinfo-save-changed',changed]);return changed;}
var items=com.user._prepareSet(toSave);var account='';if(location.parsed_query.account){account=location.parsed_query.account;}
com.user.setData(account,items,[function(result){if(result.Array.IQ[0].QUERY[0].RESULT[0].VALUE==0){gui.message.error(getLang("error::save_unsuccessful"));}else{gui.message.toast(getLang("message::save_successfull"));var account=me._getAnchor('aliases')._getMainAlias(true);location.hash=helper.translateHash(me._selfHash.replace('/ACCOUNT/',encodeURIComponent(account)),location.parsed_query);com.user._prepareChanged(toSave,true);if(callback){setTimeout(function(){callback();},500);}}}]);}
catch(e)
{log.error(e);}}

/* client/inc/obj_mailinglistmembers.js */
function obj_mailinglistmembers(){};var _me=obj_mailinglistmembers.prototype;_me.__constructor=function(s){var me=this;storage.library('wa_accountmembers');storage.library('obj_accountpicker');gui.frm_main.main._setHeadingButton('accountdetail::add_members',function(){me._addMembers();},'button text primary');if(!gui.frm_main.main.actions){gui.frm_main.main._cleanHeadingButtonsAnchor();gui.frm_main.main._setAlternativeButtons(function(box,target_anchor){if(!box._alternativeButtons){box._alternativeButtons=[];}
var actionobject=box._create('actions','obj_actionselect',target_anchor);actionobject._value('generic::select_action');if(target_anchor=='heading_buttons_mobile'){actionobject._addcss('full',true);}
actionobject.actions._fill([{name:'rights',icon:false,onclick:function(){me._changeRightsSelectedMembers();return false;},value:'accountdetail::change_rights'},{name:'delete',icon:false,onclick:function(){me._deleteSelectedMembers();return false;},value:'accountdetail::remove'}]);actionobject._disabled(true);box._alternativeButtons.push(actionobject);});}};_me._load=function(domain)
{var me=this;me._draw('obj_mailinglistmembers','',{items:{}});try
{this.list._onchange=function(e){if(e&&e.text=='select-all'){this._selectAll(e.type,true,true);}
if(e&&e.text=='select-all'&&e.type){for(var i=0;i<gui.frm_main.main._alternativeButtons.length;i++)
{gui.frm_main.main._alternativeButtons[i]._text(getLang("generic::select_action")+" ("+me.list._totalcount+")");gui.frm_main.main._alternativeButtons[i]._disabled(false);}}else
if(this._getSelectedCount()!=0){for(var i=0;i<gui.frm_main.main._alternativeButtons.length;i++)
{gui.frm_main.main._alternativeButtons[i]._text(getLang("generic::select_action")+" ("+me.list._getSelectedCount()+")");gui.frm_main.main._alternativeButtons[i]._disabled(false);}}else{for(var i=0;i<gui.frm_main.main._alternativeButtons.length;i++)
{gui.frm_main.main._alternativeButtons[i]._text(getLang("generic::select_action"));gui.frm_main.main._alternativeButtons[i]._disabled(true);}}
if(e&&e.text=='select-all'){return false;}}
var group=new Account(location.parsed_query.account);var members=this.__members=group.getMemberList();this.list._init('obj_groupmembers',false,function(linesPerPage,page,callback){members.load(function(result){me.list._totalcount=result.total;if(result.length){for(var i=0;i<result.length;i++){me.list._drawItem(result[i]);}
me.list._refreshed();}else if(result.error){gui.message.error(result.error);}});},true);}
catch(e)
{log.error(['e1',e]);}}
_me._changeRightsSelectedMembers=function(){var me=this;var items=this.list._getSelectedList();if(items=="all"){var list='all';}else{var list=[];for(var i=0;i<items.length;i++)
{list.push(items[i]);}}
var popup=gui._create('popup','obj_popup');popup._init({name:'changerights',heading:{value:getLang('accountdetail::change_rights')},fixed:false,content:"obj_mailinglistmembers_rights",footer:'default',refresh:function(){me.list._emptySelectedList();me.__members.reset();me.list._load();}});popup.content._load(location.parsed_query.account,list);}
_me._deleteSelectedMembers=function(){var me=this;var items=this.list._getSelectedList();if(items=="all"){var list='all';}else{var list=[];for(var i=0;i<items.length;i++)
{list.push(items[i].email.toString());}}
log.info(['mailinglistmembers-delete',list]);var finish=function(result){if(result.error||result==0){gui.message.error(getLang("error::save_unsuccessful"));}else{gui.message.toast(getLang("message::save_successfull"));me.list._emptySelectedList();me.__members.reset();me.list._load();}}
if(list.length||this.list._selectAllActivated){gui.message.warning(getLang("warning::delete_selected_members",[this.list._selectAllActivated?this.list._totalcount:this.list._getSelectedCount()]),false,[{value:getLang("generic::cancel"),method:'close'},{value:getLang("generic::delete"),type:'text error',onclick:function(closeCallback){if(me.list._selectAllActivated){com.members.removeAll(location.parsed_query.account,finish);}else{com.members.remove(location.parsed_query.account,list,finish);}
closeCallback();}}]);}}
_me._addMembers=function(){var me=this;gui.accountpicker(function(items,type){var list=[];for(var i=0;i<items.length;i++)
{if(items[i].type==1){list.push("["+items[i].id+']');}else{list.push(items[i].id);}}
var items_in_grid=me.list._getItems();var old=[];for(var key in items_in_grid){old.push(items_in_grid[key]._item.email);}
var new_items=helper.array_diff(list,old);log.log(['groupmembers-addmembers',old,list,new_items]);com.members.add(location.parsed_query.account,new_items,function(result){if(result.error||result==0){gui.message.error(getLang("error::save_unsuccessful"));}else{gui.message.toast(getLang("message::save_successfull"));var popup=gui._create('popup','obj_popup');popup._init({name:'changerights',heading:{value:getLang('accountdetail::change_rights')},fixed:false,content:"obj_mailinglistmembers_rights",footer:'default',refresh:function(){me.list._emptySelectedList();me.__members.reset();me.list._load();}});popup.content._load(location.parsed_query.account,new_items.map(function(item){return{email:item,default:1};}));}});},{allow_external_accounts:true,exclude:{accounts:[location.parsed_query.account]}});}

/* client/inc/obj_mailinglistmembers_rights.js */
function obj_mailinglistmembers_rights(){};var _me=obj_mailinglistmembers_rights.prototype;_me.__constructor=function(s){var me=this;storage.library('wm_user');};_me._load=function(account,list){var me=this;this.__list=list;this.__account=account||location.parsed_query.account;this._draw('obj_mailinglistmembers_rights','',{items:{}});if(list!='all'){this.checkbox_right_default._checked(!list.some(function(user){return!+user.default;}));this.checkbox_right_post._checked(!list.some(function(user){return!+user.post;}));this.checkbox_right_receive._checked(!list.some(function(user){return!+user.recieve;}));this.checkbox_right_digest._checked(!list.some(function(user){return!+user.digest;}));this.checkbox_right_post._onclick=this.checkbox_right_receive._onclick=this.checkbox_right_digest._onclick=function(){me.checkbox_right_default._checked(!me.checkbox_right_post._checked()&&!me.checkbox_right_receive._checked()&&!me.checkbox_right_digest._checked());}}}
_me._save=function(){var me=this;var rights={default:+this.checkbox_right_default._checked(),post:+this.checkbox_right_post._checked(),receive:+this.checkbox_right_receive._checked(),digest:+this.checkbox_right_digest._checked()};var finish=function(result){if(result.error){gui.message.error(getLang("error::save_unsuccessful"));}else{gui.message.toast(getLang("message::save_successfull"));me._close();}}
if(this.__list=="all"){com.members.editAll(this.__account,rights,finish);}else{com.members.edit(this.__account,this.__list.map(function(user){return user.email.toString();}),rights,finish);}}

/* client/inc/obj_management.js */
var obj_management=(function(_super){__extends(obj_management,_super);function obj_management(){_super.call(this);this._settings={};var me=this;this._settings.menuHashTemplate='#menu=/MENU/';this._settings.menu=[{isdefault:true,icon:false,name:'domainlist',value:'management::domainlist',callback:function(name){me._tabmenuCallback(name);}}];if(gui._globalInfo.admintype==USER_ADMIN){this._settings.menu.push({icon:false,name:'guestaccounts',value:'management::guest_accounts',callback:function(name){me._tabmenuCallback(name);}});}}
obj_management.prototype._hash_handler=function(e,aData){var me=this;log.log('Management should be loaded');try{gui.frm_main.main._init({name:'management',heading:{value:getLang("main::management")},menu:{hashTemplate:this._settings.menuHashTemplate,items:this._settings.menu}},function(oBox,oMenu){});}
catch(e){log.error(["management-hashhandler",e,me]);}};obj_management.prototype._getDefaultTab=function(){for(var _i=0,_a=this._settings.menu;_i<_a.length;_i++){var item=_a[_i];if(item.isdefault){return item.name;}}
return(this._settings.menu[0]?this._settings.menu[0].name:"");};obj_management.prototype._loadContent=function(name,obj,anchor,settings){var parent=this._parent;if(!parent[name]){parent._clean(anchor);parent._create(name,obj,anchor);}
parent[name]._load(settings);};obj_management.prototype._tabmenuCallback=function(name){if(name===void 0){name=this._getDefaultTab();}
var me=this;switch(name){case"domainlist":this._loadContent('domainlist','obj_domainlist','main_content');break;case"guestaccounts":this._loadContent('accountlist','obj_userlist','main_content',{domain:"##internalservicedomain.icewarp.com##",subTemplate:'guest'});break;}};return obj_management;}(obj_generic));

/* client/inc/obj_message.js */
function obj_message(){};var _me=obj_message.prototype;_me.__constructor=function(s){var me=this;this._draw('obj_message','',{items:{}});};_me._init=function(popup,box,main,type,message,buttons){message=(Array.isArray(message)?message:[message]).map(function(message){return helper.htmlspecialchars(message);}).join('<br>');this._getAnchor('message').innerHTML=message;addcss(popup.main._main,'type_'+type);if(!buttons){main._create('btn_cancel','obj_button','buttons');main.btn_cancel._value("generic::continue");main.btn_cancel._addcss('text primary');main.btn_cancel._onclick=function(){popup._close();}}else{for(var i=0;i<buttons.length;i++){var btnname='btn_custom_'+i;main._create(btnname,'obj_button','buttons');var obtn=main[btnname];var button=buttons[i];obtn._text((button.value?button.value:''));obtn._addcss((button.type?button.type:'text primary'));if(button.onclick){obtn._onclick=function(){this.onclick(function(){popup._close();})}.bind(button);}else{if(button.method){switch(button.method){case'close':obtn._onclick=function(){popup._close();};break;}}}}}
switch(type){case'error':break;case'warning':break;case'success':break;}};gui.message={};gui.message._init=function(settings){try
{if(!settings.unique){settings.unique=false;}
if(!settings.type){settings.type="success";}
if(!settings.message){settings.message="";}
switch(settings.type){case'0':settings.type="success";break;case'1':settings.type="warning";break;case'2':settings.type="error";break;}
if(settings.type=='error'&&navigator&&navigator.vibrate){navigator.vibrate(200);}
if(gui._popupList)
{for(var i=0;i<gui._popupList.length;i++){if(gui._popupList[i]._message&&gui._popupList[i]._message.type==settings.type&&gui._popupList[i]._message.unique){gui._popupList[i]._destruct();}}}
var popup=gui._create('popup','obj_popup');popup._message=settings;popup._init({fixed:false,iwattr:{subtype:'message',width:'small'},name:'message',heading:{value:(settings.heading?settings.heading:'')},footer:'obj_message_footer',content:'obj_message'});popup.content._init(popup,popup.main._getAnchor('box'),popup.main,settings.type,settings.message,(settings.buttons?settings.buttons:false));return popup;}
catch(e)
{log.error(e);}}
gui.message.error=function(text,heading,buttons,notunique){var popup=gui.message._init({type:'error',heading:(heading?heading:getLang('generic::message_error_heading')),message:text,buttons:buttons,unique:(notunique?false:true)});if(gui.__sound_on){gui.frm_main.kaboom._play();}
return popup;}
gui.message.warning=function(text,heading,buttons,notunique){var popup=gui.message._init({type:'warning',heading:(heading?heading:getLang('generic::message_warning_heading')),message:text,buttons:buttons,unique:(notunique?false:true)});if(gui.__sound_on){gui.frm_main.win._play();}
return popup;}
gui.message.success=function(text,heading,buttons,notunique){gui.message._init({type:'success',heading:(heading?heading:getLang('generic::message_success_heading')),message:text,buttons:buttons,unique:(notunique?false:true)});}
gui.message.toast=function(text){var toast=gui.frm_main._getAnchor('toast');var toast_text=gui.frm_main._getAnchor('toast_text');var toast_close=gui.frm_main._getAnchor('toast_close');if(gui.__sound_on){gui.frm_main.scrape._play(400,false,Math.random()*3300);}
toast.onclick=function(){removecss(toast,'active');return false;};toast_text.innerHTML=helper.htmlspecialchars(text);addcss(toast,'active');toast._timeout=setTimeout(function(){removecss(toast,'active');if(gui.__sound_on){gui.frm_main.scrape._play(400,false,Math.random()*3300);}},3000);}

/* client/inc/obj_multi.js */
var obj_multi=(function(_super){__extends(obj_multi,_super);function obj_multi(){_super.call(this);this._counter=0;this._lines=[];this.__disabled=false;var me=this;me._itemType=me.__attributes.itemtype||"obj_multi_input";me.button_add._onclick=function(){me._add();};this.addFirst();}
obj_multi.prototype._getObjects=function(line){var me=this;var children=[];var objects=line.getElementsByTagName("form");for(var i=0;i<objects.length;i++){if(objects[i].id&&objects[i].id.indexOf('gui.')==0){children.push(me[objects[i].id.split('.').pop()]);}}
return children;};obj_multi.prototype._add=function(value){if(value===void 0){value="";}
var me=this;var line=this._draw(me._itemType,"items",{number:me._counter++},true);var objects=me._getObjects(line);if(objects[0]&&objects[0]._value){objects[0]._value(value);}
me._lines.push({line:line,objects:objects});};obj_multi.prototype._removeItem=function(index,forgetFirst){if(forgetFirst===void 0){forgetFirst=false;}
var me=this;if(me._lines[index]){for(var _i=0,_a=me._lines[index].objects;_i<_a.length;_i++){var object=_a[_i];if(object._destruct){object._destruct();}}
me._lines[index].line.parentNode.removeChild(me._lines[index].line);me._lines.splice(index,1);}
if(!forgetFirst){me.addFirst();}
return!!me._lines[index];};obj_multi.prototype.addFirst=function(){if(this._lines.length==0){this._add();}};obj_multi.prototype._removeAll=function(forgetFirst){if(forgetFirst===void 0){forgetFirst=false;}
var me=this;for(var i=me._lines.length-1;i>=0;i--){me._removeItem(i,forgetFirst);}};obj_multi.prototype._isEmpty=function(objectList){if(objectList[0]&&objectList[0]._value().trim()==""){return true;}
return false;};obj_multi.prototype._removeEmpty=function(userCallableIsEmptyFunction){if(userCallableIsEmptyFunction===void 0){userCallableIsEmptyFunction=this._isEmpty;}
var me=this;for(var i=me._lines.length-1;i>=0;i--){if(userCallableIsEmptyFunction(me._lines[i].objects)){me._removeItem(i);}}};obj_multi.prototype.getLines=function(){return this._lines;};obj_multi.prototype._value=function(data){var me=this;if(data instanceof Array){me._removeAll(true);for(var _i=0,data_1=data;_i<data_1.length;_i++){var value=data_1[_i];me._add(value);}}
var values=[];for(var _a=0,_b=me._lines;_a<_b.length;_a++){var line=_b[_a];values.push(line.objects[0]._value());}
return values;};obj_multi.prototype._disabled=function(attribute){if(attribute==undefined){return this.__disabled;}else{for(var i=this._lines.length;i--;){var obj=this._lines[i].objects;for(var j=obj.length;j--;){obj[j]._disabled(attribute);}}
this.button_add._disabled(attribute);this.__disabled=attribute;}};obj_multi.prototype._changed=function(){var changed=false;for(var i=this._lines.length;i--;){var obj=this._lines[i].objects;for(var j=obj.length;j--;){if(obj[j]._changed()==true){changed=true;}}}
return changed;};return obj_multi;}(obj_generic));

/* client/inc/obj_multi_input.js */
var obj_multi_input=(function(_super){__extends(obj_multi_input,_super);function obj_multi_input(){_super.call(this);}
obj_multi_input.prototype._value=function(template){};obj_multi_input.prototype._disabled=function(attribute){};return obj_multi_input;}(obj_generic));

/* client/inc/obj_newaccount.js */
function obj_newaccount(){};var _me=obj_newaccount.prototype;_me.__constructor=function(s){var me=this;storage.library('wm_user');storage.library('wm_domain');};_me._load=function(type,callback){type=type+'';this._strtype=type;var that=this;var me=this;this._type={};switch(type){case'0':this._type.user=true;break;case'7':this._type.group=true;break;case'1':this._type.mailinglist=true;break;case'8':this._type.resource=true;break;case'd':this._type.domain=true;break;}
that._draw('obj_newaccount','',{type:this._type});this._parent.btn_save._onclick=function(){me._parent.btn_save._disabled(true);me._save();};this._parent.btn_save_another._onclick=function(){me._parent.btn_save_another._disabled(true);me._save(true);}
if(!this._type.domain){var domain=new Domain(gui._activeDomain);var account=domain.createAccount(type);this._data=account;}else{this._data=new IWAPI.Value('');this.input_domain._setValue(this._data);}
if(this._type.mailinglist){if(gui._globalInfo.admintype==USER_ADMIN){this.dropdown_source._fill({'*0':getLang('mailinglist::members_defined_manually'),'*1':getLang('mailinglist::all_current_domain_users'),'*2':getLang('mailinglist::all_system_users'),'*3':getLang('mailinglist::all_system_domain_administrators'),'*4':getLang('mailinglist::all_system_administrators')});}else{this.dropdown_source._fill({'*0':getLang('mailinglist::members_defined_manually'),'*1':getLang('mailinglist::all_current_domain_users'),});}
this.dropdown_source._setValue(account.m_sendalllists);}
if(this._type.user)
{this.button_generate_password._onclick=function(){com.general.generate_password(function(pwd){me._data.u_password.value=pwd;me.input_password._value(pwd);});}
this.button_generate_password._onclick();this.input_name._setValue(account.a_name.name);this.input_surname._setValue(account.a_name.surname);this.input_password._setValue(account.u_password);}
if(this._type.group){this.input_name._setValue(account.g_groupwarehabfolder);}
if(this._type.resource)
{this.dropdown_type._fill({'0':getLang('userlist::room'),'1':getLang('userlist::equipment'),'2':getLang('userlist::car')});this.input_name._setValue(account.u_name);this.dropdown_type._setValue(account.s_type);}
if(!this._type.domain)
{this.input_alias._domain=false;this.input_alias._domain=gui._activeDomain;this.input_alias._label('@'+punycode.ToUnicode(this.input_alias._domain),true);this.input_alias._setValue(account.u_mailbox);if(this.input_alias._main.getElementsByTagName('label')[0]){this.input_alias._main.getElementsByTagName('label')[0].onclick=function(){gui.accountpicker(function(data){log.log(['newaccount-picked',data]);me.input_alias._domain=data[0].id;me.input_alias._label('@'+punycode.ToUnicode(data[0].name),true);me._initPlans();},{domainpicker:true,singledomain:true});};}
me._getAnchor('add_new_domain').setAttribute('is-hidden',1);me._getAnchor('add_new_account').removeAttribute('is-hidden');}
else
{me._getAnchor('add_new_account').setAttribute('is-hidden',1);me._getAnchor('add_new_domain').removeAttribute('is-hidden');}
if(this._type.user){this._initPlans();}
if(callback){callback(this);}}
_me._initPlans=function(){new Domain(this.input_alias._domain).getProperties(['D_Saas_Plan'],function(D_Saas_Plan){if(gui._globalInfo.licence.plans.forEach){var plans=gui._globalInfo.licence.plans.map(function(plan){var label=getLang("SUBSCRIPTION_PLANS::"+plan.planlabel);if(!+D_Saas_Plan||+plan.planid<=+D_Saas_Plan){return{id:plan.planid,icon:true,label:~label.indexOf("::")?plan.planlabel:label,price:(+plan.price).toCurrency(plan.currency.toString()),price_per_user:'&#8203;'};}}).filter(Boolean);this.plans&&this.plans._destruct();this._create('plans','obj_plans','fi_plan','',{selectable:true,show_prices:+(gui._globalInfo.licence.cloudinfo||{}).cloudshowprice,yearly:((gui._globalInfo.licence.cloudinfo||{}).cloudplanbillingperiod||'').toString()!=='MONTH',plans:plans});this.plans._setValue(this._data.u_saas_plan);var max_avail_value=Math.min(gui._globalInfo.licence.defaultplan.value||gui._globalInfo.licence.plans[0].planid,plans.pop().id);this.plans._value(max_avail_value);this.plans._onchange=function(value){this._data.u_saas_plan.value=value;}.bind(this);this.plan_details._onclick=function(){this.plan_details._disabled(true);obj_subscription.prototype._openLicensePopup.call(this,'plan-details',function(){this.plan_details._disabled(false);}.bind(this),{heading:getLang('SUBSCRIPTION::PLAN_DETAILS')});}.bind(this);}else{this._getAnchor('fi_plan').setAttribute('is-hidden','');this._getAnchor('fi_plan_separator').setAttribute('is-hidden','');}}.bind(this));};_me._showPasswordPolicy=function(){var me=this;com.user.password_policy(function(aResult){me._getAnchor('pwdp').removeAttribute('is-hidden');log.info(aResult);var items=aResult.Array.IQ[0].QUERY[0].RESULT[0].ITEM;for(var i=0;i<items.length;i++)
{var propname=items[i].APIPROPERTY[0].PROPNAME[0].VALUE;var propval={};if(items[i].PROPERTYVAL&&items[i].PROPERTYVAL[0]){propval=items[i].PROPERTYVAL[0];}
try
{log.log(propname.toLowerCase());switch(propname.toLowerCase())
{case'c_accounts_policies_pass_enable':if(propval.VAL[0].VALUE=='1'){me._getAnchor('pwdp').removeAttribute('is-hidden');}else{me._getAnchor('pwdp').setAttribute('is-hidden',1);}
break;case'c_accounts_policies_pass_minlength':if(propval.VAL[0].VALUE=='0'){me._getAnchor('pwdp_minlength').setAttribute('is-hidden',1);}
me._getAnchor('pwdp_minlength').getElementsByTagName('span')[0].innerHTML=helper.htmlspecialchars(propval.VAL[0].VALUE);break;case'c_accounts_policies_pass_digits':if(propval.VAL[0].VALUE=='0'){me._getAnchor('pwdp_digits').setAttribute('is-hidden',1);}
me._getAnchor('pwdp_digits').getElementsByTagName('span')[0].innerHTML=helper.htmlspecialchars(propval.VAL[0].VALUE);break;case'c_accounts_policies_pass_nonalphanum':if(propval.VAL[0].VALUE=='0'){me._getAnchor('pwdp_nonalphanum').setAttribute('is-hidden',1);}
me._getAnchor('pwdp_nonalphanum').getElementsByTagName('span')[0].innerHTML=helper.htmlspecialchars(propval.VAL[0].VALUE);break;case'c_accounts_policies_pass_useralias':if(propval.VAL[0].VALUE=='0'){me._getAnchor('pwdp_useralias').setAttribute('is-hidden',1);}
break;case'c_accounts_policies_pass_alpha':if(propval.VAL[0].VALUE=='0'){me._getAnchor('pwdp_alpha').setAttribute('is-hidden',1);}
me._getAnchor('pwdp_alpha').getElementsByTagName('span')[0].innerHTML=helper.htmlspecialchars(propval.VAL[0].VALUE);break;case'c_accounts_policies_pass_upperalpha':if(propval.VAL[0].VALUE=='0'){me._getAnchor('pwdp_upperalpha').setAttribute('is-hidden',1);}
me._getAnchor('pwdp_upperalpha').getElementsByTagName('span')[0].innerHTML=helper.htmlspecialchars(propval.VAL[0].VALUE);break;}}
catch(e)
{log.error(e);}}});}
_me._save=function(addanother){var me=this;if(!this._type.domain)
{var alias=this.input_alias._value().trim();var domain=this.input_alias._domain;if(!alias){me._parent.btn_save._disabled(false);me._parent.btn_save_another._disabled(false);return this.input_alias._error(getLang('error::specify_account_name_with_domain_name'));}
if(alias.search('@')>=0){domain=alias.split('@');alias=domain[0];domain=domain[1];this.input_alias._domain=domain;}
log.log(this.input_alias._domain);if(this.input_alias._domain){this._data.u_mailbox.value=this._data.u_mailbox.value.trim();if(this._data.a_name){this._data.a_name.name.value=this._data.a_name.name.value.trim();this._data.a_name.surname.value=this._data.a_name.surname.value.trim();}
var account=this._data;account.domainName=this.input_alias._domain;var type=this._type;account.saveNew(function(result){me._parent.btn_save._disabled(false);me._parent.btn_save_another._disabled(false);if(type.user&&result.error=="account_password_policy"){me._showPasswordPolicy();gui.message.error(getLang("error::account_password_policy"));return false;}
if(type.user&&result.error=="account_domain_limit_exceeded"){gui.message.error(getLang("error::account_domain_limit_exceeded"));return false;}
if(result==1){gui.message.toast(getLang("message::save_successfull"));if(addanother){me._close();setTimeout(function(){gui.frm_main._newAccount(me._strtype);},0);}
else{var alias_checked=alias;if(alias_checked.search(';')>=0){alias_checked=alias.split(';')[0];}
location.hash='menu=accountdetail&account='+encodeURIComponent(alias_checked+"@"+domain)+"&type="+me._strtype;me._close();}}else{gui.message.error(getLang("error::account_not_created"),false,[{value:getLang("generic::cancel"),onclick:function(closeCallback){me._close();closeCallback();},type:'text error'},{value:getLang("generic::try_again"),method:'close'}]);}});}
else
{me.input_alias._error(getLang('error::specify_account_name_with_domain_name'));}}
if(this._type.domain)
{var domain=this.input_domain._value().trim();if(!domain){return this.input_domain._error(getLang('error::specify_domain_name'));}
domain=punycode.ToASCII(domain);com.domain.createDomain(domain,function(result){me._parent.btn_save._disabled(false);me._parent.btn_save_another._disabled(false);if(result==1){gui.message.toast(getLang("message::save_successfull"));if(addanother){me._close();setTimeout(function(){gui.frm_main._newAccount(me._strtype);},0);}
else{location.hash='menu=domaindetail&domain='+encodeURIComponent(domain)+'&showdomaininfo=true';me._close();}}else{gui.message.error(getLang("error::save_unsuccessful"),false,[{value:getLang("generic::cancel"),onclick:function(closeCallback){me._close();closeCallback();},type:'text error'},{value:getLang("generic::try_again"),method:'close'}]);}});}}

/* client/inc/obj_oauth.js */
function obj_oauth(){};obj_oauth.prototype.__constructor=function(){storage.library('wm_oauth');gui.frm_main.main._setAlternativeButtons(function(box,target_anchor){if(!box._alternativeButtons){box._alternativeButtons=[];}
var add=box._create('button_add','obj_button',target_anchor);add._addcss('text primary');add._value('generic::add');box._alternativeButtons.push(add);var edit=box._create('button_edit','obj_button',target_anchor);edit._disabled(true);edit._addcss('text primary');edit._value('certificates::edit');box._alternativeButtons.push(edit);var del=box._create('button_delete','obj_button',target_anchor);del._disabled(true);del._addcss('text error');del._value('generic::delete');box._alternativeButtons.push(del);});};obj_oauth.prototype._load=function(){var me=this;var parent=me._parent;me._draw('obj_oauth');parent.button_add._onclick=function(){me._showOauthWizard();}
parent.button_edit._onclick=function(){me._showOauthWizard(me.list._getSelectedList()[0]);}
parent.button_delete._onclick=function(){me._deleteSelectedOauths();}
this.list._init('obj_oauth',false,function(linesPerPage,page,callback){me.list._setMax(false);com.oauth.server([function(aData){log.log(['oauth-load',aData]);if(aData[0]){for(var i=0;i<aData.length;i++){log.log(['oauth-load-item',aData[i]]);aData[i].auth_type=wm_oauth._AUTH_TYPES[aData[i].authtype];var line=me.list._drawItem(aData[i]);line.onclick=function(){me._showOauthWizard(this._item);};}}
if(callback){callback.call(me,aData);}}]);});this.list._onchange=function(){parent.button_delete._disabled(me.list._getSelectedCount()===0);parent.button_edit._disabled(me.list._getSelectedCount()!==1);};};obj_oauth.prototype._showOauthWizard=function(oauth){var popup=gui._create('popup','obj_popup');popup._init({name:'oauth_wizard',heading:{value:getLang('oauth::wizard'+(oauth?'_edit':''))},iwattr:{width:'medium'},fixed:false,footer:'default',content:"obj_oauth_wizard"});popup.content._oauthList=this.list;popup.content._load(oauth);};obj_oauth.prototype._doTheDelete=function(closeCallback){var me=this;if(me._deleteItemsList&&me._deleteItemsList[0]){var deleteItem=me._deleteItemsList[me._deleteItemsList.length-1];log.log(['oauth-dothedelete-click',deleteItem]);com.oauth.delete(deleteItem.clientid,function(success){try{if(success){me._deleteItemsList.splice(me._deleteItemsList.length-1,1);me._doTheDelete(closeCallback);}else{me._deleteItemsList=[];me.list._emptySelectedList();me.list._load();closeCallback();gui.message.error(getLang("error::delete_unsuccessful"));}}catch(e){log.error(['oauth-dothedelete',e]);}});}else{me._deleteItemsList=[];me.list._emptySelectedList();me.list._load();closeCallback();gui.message.toast(getLang("message::delete_successfull"));}};obj_oauth.prototype._deleteSelectedOauths=function(){var me=this;gui.message.warning(getLang('warning::delete_selected_oauths')+" ("+me.list._getSelectedCount()+")",false,[{value:getLang("generic::cancel"),type:'text borderless',method:'close'},{value:getLang("generic::delete"),type:'error text',onclick:function(closeCallback){me._deleteItemsList=me.list._getSelectedList();me._doTheDelete(closeCallback);}}]);};

/* client/inc/obj_oauth_wizard.js */
function obj_oauth_wizard(){};obj_oauth_wizard.prototype.__validate=function(){this._parent.btn_save._disabled(!this.input_name._value()||!this.input_description._value()||!this.input_redirect_uri._value());};obj_oauth_wizard.prototype._load=function(oauth){this.__edit=oauth;this._draw('obj_oauth_wizard',false,{new:!oauth});this.dropdown_auth_type._fill(wm_oauth._AUTH_TYPES);this.input_name._onchange=this.__validate.bind(this);this.input_description._onchange=this.__validate.bind(this);this.input_redirect_uri._onchange=this.__validate.bind(this);if(oauth){this.input_id._value(oauth.clientid);this.input_name._value(oauth.name);this.input_description._value(oauth.description);this.input_redirect_uri._value(oauth.redirecturi);this.dropdown_auth_type._value(oauth.authtype);}
this.__validate();};obj_oauth_wizard.prototype._save=function(){var me=this;var data={name:this.input_name._value(),description:this.input_description._value(),redirecturi:this.input_redirect_uri._value(),authtype:this.dropdown_auth_type._value()};if(this.__edit){data.clientid=this.__edit.clientid;}
com.oauth[this.__edit?'edit':'add'](data,function(success,response){if(success){gui.message.toast(getLang("message::save_successfull"));me._oauthList._load();me._close();var secret=((response.SECRET||[])[0]||{}).VALUE;secret&&gui.message.success(secret,getLang('OAUTH::SECRET'));}else{gui.message.error(getLang("error::action_failed"),getLang("error::failed"));}});};

/* client/inc/obj_permissions.js */
function obj_permissions(){};var _me=obj_permissions.prototype;_me.__constructor=function(s){var me=this;storage.library('wm_user');storage.library('obj_accountpicker');this._permissionsDropdownContent={general:{'lr':getLang('permissions::read'),'lrswipk':getLang('permissions::write'),'lrswipktexdc':getLang('permissions::all'),'lrswipktexadc':getLang('permissions::full'),'*':getLang('permissions::none')},owner:{'lr':getLang('permissions::read'),'lripkzu':getLang('permissions::write'),'lripkxzyvuc':getLang('permissions::owner'),'lrswipktexzyvudc':getLang('permissions::all'),'lrswipktexazyvudc':getLang('permissions::full'),'*':getLang('permissions::none')}}
this._itemsList=[];this._lastFolder=false;};_me._showMore=function(){var me=this;this._parent.btn_inherit._hide(true);this._parent.btn_save._hide(true);this._parent.btn_cancel._hide(true);this._parent.btn_done._hide(false);if(!this._treeLoaded){this._treeLoaded=true;com.user.folderList(location.parsed_query.account,false,function(result){var root=result.Array.IQ[0].QUERY[0].RESULT[0];try
{var rootElm=me._drawFolder(root);if(rootElm)
{me._getAnchor('folders').appendChild(rootElm);}}
catch(e)
{log.error(e);}});}}
_me._findDefaultFolder=function(data,type,subtype){try
{if(data.SUBFOLDERS[0]){for(var i=0;i<data.SUBFOLDERS[0].ITEM.length;i++){if(data.SUBFOLDERS[0].ITEM[i].FOLDERTYPE[0].VALUE==type){if(subtype&&data.SUBFOLDERS[0].ITEM[i].DEFAULTTYPE&&data.SUBFOLDERS[0].ITEM[i].DEFAULTTYPE[0]&&data.SUBFOLDERS[0].ITEM[i].DEFAULTTYPE[0].VALUE&&data.SUBFOLDERS[0].ITEM[i].DEFAULTTYPE[0].VALUE==subtype){return data.SUBFOLDERS[0].ITEM[i];}
if(!subtype){return data.SUBFOLDERS[0].ITEM[i];}}
if(data.SUBFOLDERS[0].ITEM[i].SUBFOLDERS[0]&&data.SUBFOLDERS[0].ITEM[i].SUBFOLDERS[0].ITEM){var ret=this._findDefaultFolder(data.SUBFOLDERS[0].ITEM[i],type,subtype);if(ret){return ret;}}}}}
catch(e)
{log.error(e);}
return false;}
_me._showLess=function(){var me=this;this._parent.btn_inherit._hide(true);this._parent.btn_cancel._hide(true);this._parent.btn_save._hide(true);this._parent.btn_done._hide(false);this._parent._setBackButton();this._getAnchor('showless').removeAttribute('is-hidden');this._getAnchor('tree').setAttribute('is-hidden','1');this._getAnchor('detail').setAttribute('is-hidden','1');com.user.folderList(location.parsed_query.account,true,function(result){try
{var root=result.Array.IQ[0].QUERY[0].RESULT[0];var inbox=me._findDefaultFolder(root,'M','I');var calendar=me._findDefaultFolder(root,'E');var tasks=me._findDefaultFolder(root,'T');var journal=me._findDefaultFolder(root,'J');var note=me._findDefaultFolder(root,'N');var contacts=me._findDefaultFolder(root,'C');var files=me._findDefaultFolder(root,'F');log.log(['permissions-showless-inbox',inbox]);log.log(['permissions-showless-calendar',calendar]);log.log(['permissions-showless-contacts',contacts]);log.log(['permissions-showless-tasks',tasks]);log.log(['permissions-showless-journal',journal]);log.log(['permissions-showless-note',note]);log.log(['permissions-showless-files',files]);if(inbox){me.button_folder_inbox._data={_id:inbox.ID[0].VALUE,_name:inbox.NAME[0].VALUE};me.button_folder_inbox._onclick=function(){me._parent._setBackButton(function(){me._showLess();});me._openFolderDetail({id:this._data._id,name:this._data._name,ftype:'M'});}}else if(me._getAnchor('folder_inbox')){me._getAnchor('folder_inbox').setAttribute('is-hidden',1);}
if(calendar){me.button_folder_calendar._data={_id:calendar.ID[0].VALUE,_name:calendar.NAME[0].VALUE};me.button_folder_calendar._onclick=function(){me._parent._setBackButton(function(){me._showLess();});me._openFolderDetail({id:this._data._id,name:this._data._name,ftype:'E'});}}else if(me._getAnchor('folder_calendar')){me._getAnchor('folder_calendar').setAttribute('is-hidden',1);}
if(contacts){me.button_folder_contacts._data={_id:contacts.ID[0].VALUE,_name:contacts.NAME[0].VALUE};me.button_folder_contacts._onclick=function(){me._parent._setBackButton(function(){me._showLess();});me._openFolderDetail({id:this._data._id,name:this._data._name,ftype:'C'});}}else if(me._getAnchor('folder_contacts')){me._getAnchor('folder_contacts').setAttribute('is-hidden',1);}
if(files){me.button_folder_files._data={_id:files.ID[0].VALUE,_name:files.NAME[0].VALUE};me.button_folder_files._onclick=function(){me._parent._setBackButton(function(){me._showLess();});me._openFolderDetail({id:this._data._id,name:this._data._name,ftype:'F'});}}else if(me._getAnchor('folder_files')){me._getAnchor('folder_files').setAttribute('is-hidden',1);}}
catch(e)
{log.error(["permissions-showless",e]);}});}
_me._load=function(domain)
{var that=this;var me=this;that._draw('obj_permissions','',{items:{}});this._parent.btn_inherit._hide(true);this._parent.btn_cancel._hide(true);this._parent.btn_save._hide(true);this._parent.btn_cancel._onclick=function(e){me._parent.btn_back._onclick();};this._parent.btn_done._onclick=function(e){me._close();};this._parent.btn_inherit._onclick=function(e){me._inherit();};this.btn_add._onclick=function(){me._addUser();}
this.btn_show_all_folders._onclick=function(){me._showTree();}
this.btn_show_less._onclick=function(){me._showLess();}
this._showLess();log.log(["permissions-load-done"]);}
_me._drawFolder=function(folder,depth){var me=this;var liElm=false;if(!depth){depth=0;}
liElm=mkElement('li',{});addcss(liElm,'folders-child type_'+folder.FOLDERTYPE[0].VALUE.toLowerCase());if(depth==0){addcss(liElm,'folders-root');}
if(depth==1){addcss(liElm,'folders-top');}
liElm._id=folder.ID[0].VALUE;liElm._name=folder.NAME[0].VALUE;liElm.onclick=(function(data){return function(e){me._parent._setBackButton(function(){me._showTree();});me._openFolderDetail(data);e.stopPropagation();}})({id:folder.ID[0].VALUE,name:folder.NAME[0].VALUE,ftype:folder.FOLDERTYPE[0].VALUE});var spanElm=mkElement('span',{});addcss(spanElm,'folders-name');spanElm.innerHTML=(folder.NAME[0]&&folder.NAME[0].VALUE?folder.NAME[0].VALUE:'');liElm.appendChild(spanElm);if(folder.SUBFOLDERS&&folder.SUBFOLDERS[0]&&folder.SUBFOLDERS[0].ITEM&&folder.SUBFOLDERS[0].ITEM[0]){addcss(liElm,'open');var ulElm=mkElement('ul',{});addcss(ulElm,'folders-parent');for(var i=0;i<folder.SUBFOLDERS[0].ITEM.length;i++){var sub=this._drawFolder(folder.SUBFOLDERS[0].ITEM[i],depth+1);ulElm.appendChild(sub);}
liElm.appendChild(ulElm);}
return liElm;}
_me._showTree=function(){this._parent.btn_inherit._hide();var me=this;this._showMore();this._parent._setBackButton();this._getAnchor('showless').setAttribute('is-hidden','1');this._getAnchor('detail').setAttribute('is-hidden','1');this._getAnchor('tree').removeAttribute('is-hidden');}
_me._showDetail=function(){this._getAnchor('showless').setAttribute('is-hidden','1');this._getAnchor('tree').setAttribute('is-hidden','1');this._getAnchor('detail').removeAttribute('is-hidden');this._parent.btn_save._hide(false);this._parent.btn_done._hide(true);this._parent.btn_cancel._hide(false);this._parent.btn_inherit._hide(false);}
_me._activateLine=function(line,value,ftype){var me=this;ftype={Y:'owner',I:'owner'}[ftype]||'general';if(!value){value='';}
if(line&&line._objects)
{for(var ii=0;ii<line._objects.length;ii++){if(line._objects[ii]._name.search('dropdown_permissions')==0){line._permissions=line._objects[ii];var contains=false;var custom={};for(var key in me._permissionsDropdownContent[ftype]){custom[key]=me._permissionsDropdownContent[ftype][key];if(key.replace('*','')==value){contains=true;}}
if(!contains){custom[value]=getLang('permissions::custom')+' ('+helper.htmlspecialchars(value)+')';}
line._objects[ii]._fill(custom);line._objects[ii]._value(value,false,true);}
if(line._objects[ii]._name.search('btn_erase')==0){line._objects[ii]._onclick=function(){me._deleteItem(line);};}}}}
_me._cleanList=function(){var me=this;var l=me._itemsList.length;for(var i=0;i<l;i++){this._deleteItem(me._itemsList[l-i-1]);}}
_me._deleteItem=function(line){var me=this;for(var i=0;i<me._itemsList.length;i++){if(me._itemsList[i]==line){me._itemsList.splice(i,1);var lol=line._objects.length;for(var ii=0;ii<lol;ii++){line._objects[ii]._destruct();}
line.parentElement.removeChild(line);}}}
_me._openFolderDetail=function(folder){var me=this;me._lastFolder=folder.id;me._cleanList();me._parent.btn_inherit._show();me.list.__foldertype=folder.ftype;com.user.getFolderPermissions(location.parsed_query.account,folder.id,function(result){try
{me._parent.btn_inherit._main.removeAttribute('is-hidden');var items=[];if(result.Array.IQ[0].QUERY[0].RESULT[0].ITEM&&result.Array.IQ[0].QUERY[0].RESULT[0].ITEM[0]){items=result.Array.IQ[0].QUERY[0].RESULT[0].ITEM;}
var anyone='';for(var i=0;i<items.length;i++){var name=(items[i].ACCOUNT[0]?items[i].ACCOUNT[0].VALUE:'');var permissions=(items[i].PERMISSIONS[0]?items[i].PERMISSIONS[0].VALUE:'');if(name!='anyone')
me._drawItem(name,permissions,folder.ftype);else
anyone=permissions;}
var line=me.list._drawItem({name:getLang('permissions::anyone'),permissions:anyone})
me._activateLine(line,anyone);me._itemsList.push(line);me._parent._setHeading(folder.name);me._showDetail();}
catch(e)
{log.error(e);}});}
_me._drawItem=function(name,permissions,ftype){var line=this.list._drawItem({name:name,permissions:permissions});this._activateLine(line,permissions,ftype);line._name=name;this._itemsList.push(line);}
_me._addUser=function(){var me=this;gui.accountpicker(function(items,type){if(type==0){for(var i=0;i<items.length;i++){me._drawItem("["+items[i].id+']','',me.list.__foldertype);}}else{for(var i=0;i<items.length;i++){me._drawItem(items[i].id,'',me.list.__foldertype);}}},{type:{allowed:[0,7]},});}
_me._inherit=function(){var me=this;if(me._lastFolder)
{com.user.inheritFolderPermissions(location.parsed_query.account,me._lastFolder,function(result){try
{if(result.Array.IQ[0].QUERY[0].RESULT[0].VALUE==0){gui.message.error(getLang("error::save_unsuccessful"));}else{gui.message.toast(getLang("message::save_successfull"));me._parent.btn_back._onclick();}}
catch(e)
{log.error(e);}});}}
_me._save=function(){var me=this;var items=[];for(var i=0;i<me._itemsList.length;i++){var obj=me._itemsList[i];items.push({account:[{VALUE:obj._name}],permissions:[{VALUE:obj._permissions._value()}]});}
if(me._lastFolder)
{com.user.setFolderPermissions(location.parsed_query.account,me._lastFolder,items,function(result){try
{if(result.Array.IQ[0].QUERY[0].RESULT[0].VALUE==0){gui.message.error(getLang("error::save_unsuccessful"));}else{gui.message.toast(getLang("message::save_successfull"));me._parent.btn_back._onclick();}}
catch(e)
{log.error(['permissions-save',e]);}});}}

/* client/inc/obj_plans.js */
function obj_plans(){};obj_plans.prototype.__constructor=function(aData){var me=this;aData.prefix=this.__prefix=this._pathName+'.radio';this.__selectable=!!aData.selectable;this._draw('obj_plans','',aData);this.__radios=Object.keys(this).map(function(key){if(!key.indexOf('radio')){return this[key];}},this).filter(Boolean);this.__radios.forEach(function(radio,i){radio._value(aData.plans[i].id);radio._disabled(aData.plans[i].disabled);radio._onchange=function(){me._onchange&&me._onchange(this._value());};},this);};obj_plans.prototype._value=function(value){if(!this.__selectable){return;}
if(value===void 0){return this.__value;}
this.__radios.some(function(radio){if(radio._value()==value){this.__value.value=radio._value();return radio._checked(true);}},this);};obj_plans.prototype._setValue=function(value){this.__value=value;this._value(value);};

/* client/inc/obj_policies.js */
_me=obj_policies.prototype;function obj_policies(){};_me.__constructor=function(s){var me=this;var parent=this._parent;storage.library('wm_policies');gui.frm_main.main._setHeadingButton('generic::save',function(){me._save();},'button text success');this._add_destructor('__onbeforedestruct');me._settings={};me._settings.binds={'c_accounts_policies_login_attempts':'input_block_user_login_accounts','c_accounts_policies_login_enable':'toggle_block_user_login_accounts','c_accounts_policies_login_blockperiod':'input_block_user_login_time','c_accounts_policies_login_block':"dropdown_login_policy_mode",'c_gui_requireauth':'toggle_require_administrator','c_accounts_policies_login_loginsettings':{load:function(item){me.radio_usernames._checked(!item._bval);me.radio_usernames.__source=item._source;me.radio_email_addresses._checked(item._bval);me.radio_email_addresses.__source=item._source;},save:function(){return(me.radio_email_addresses._checked()?'1':'0');},change:function(clear){return me.radio_usernames._changed(clear)||me.radio_email_addresses._changed(clear);},rights:function(right){if(right==RIGHTS_HIDE){me._getAnchor('fi_users_login').setAttribute('is-hidden',1);}
if(right==RIGHTS_HIDE||right==RIGHTS_READONLY){me.radio_usernames.readonly(true);me.radio_email_addresses.readonly(true);}},readonly:function(){return me.radio_usernames._readonly()||me.radio_email_addresses._readonly();}},'c_accounts_policies_login_convertchars':'toggle_convert_usernames','c_accounts_policies_login_iprestriction':'toggle_account_ip_restriction','c_accounts_policies_pass_enable':'toggle_general_active','c_accounts_policies_pass_useralias':'toggle_password_cannot_contain','c_accounts_policies_pass_encrypt':'toggle_enable_password','c_accounts_policies_pass_minlength':'input_minimal_password_length','c_accounts_policies_pass_digits':'input_numeric','c_accounts_policies_pass_nonalphanum':'input_non_alpha_numeric','c_accounts_policies_pass_alpha':'input_alpha','c_accounts_policies_pass_upperalpha':'input_uppercase_alpha','c_accounts_policies_pass_expiration':'toggle_password_expiration_active','c_accounts_policies_pass_expireafter':'input_password_expires_after','c_accounts_policies_pass_notification':'toggle_notify_before_expiration','c_accounts_policies_pass_notifybefore':'input_notify_before_expiration','c_accounts_policies_pass_allowadminpass':['toggle_admin_passwords_read_exported',{reversed:true}]};me._settings.login_policy_modes={'*0':getLang('policies::do_not_block_but_delay'),'*1':getLang('policies::block_account')}};_me.__onbeforedestruct=function(){}
_me._load=function(){var me=this;try
{me._draw('obj_policies');me.button_outlook_sync._onclick=function(){me._outlookSyncManage();}
me.dropdown_login_policy_mode._fill(me._settings.login_policy_modes);me.toggle_general_active._onchange=function(checked){me.toggle_password_cannot_contain._disabled(!checked);me.input_minimal_password_length._disabled(!checked);me.input_numeric._disabled(!checked);me.input_non_alpha_numeric._disabled(!checked);me.input_alpha._disabled(!checked);me.input_uppercase_alpha._disabled(!checked);}
com.policies.bind(me,me._settings.binds,COM_TYPE_SERVER);}
catch(e)
{log.error([e,me]);}}
_me._outlookSyncManage=function(){var popup=gui._create('popup','obj_popup');popup._init({name:'accountinfo_os_manage',heading:{value:getLang('client_applications::icewarp_outlook_sync')},fixed:false,iwattr:{height:'full',width:'large'},footer:'obj_accountinfo_os_manage_footer',content:'obj_accountinfo_os_manage'});popup.content._load(false,OS_TYPE_SERVER);}
_me._save=function(){com.policies.save(this,this._settings.binds,COM_TYPE_SERVER);}

/* client/inc/obj_preview.js */
var obj_preview=(function(_super){__extends(obj_preview,_super);function obj_preview(){_super.call(this);var me=this;me._main.setAttribute('iw-enabled',"");}
obj_preview.prototype._value=function(template){this._draw(template);};obj_preview.prototype._disable=function(attribute){this._enable(attribute,false);};obj_preview.prototype._enable=function(attribute,enabled){if(enabled===void 0){enabled=true;}
var val=this._main.getAttribute('iw-enabled')||"";val=val.replace(" "+attribute,'').replace(attribute+" ",'').replace(attribute,'');if(enabled){val=helper.trim(val+" "+attribute);}
this._main.setAttribute('iw-enabled',val);};obj_preview.prototype._setAttribute=function(attribute,val){this._main.setAttribute('iw-'+attribute,val);};obj_preview.prototype._removeAttribute=function(attribute){this._main.setAttribute('iw-'+attribute);};return obj_preview;}(obj_generic));

/* client/inc/obj_radio.js */
_me=obj_radio.prototype;function obj_radio(){};_me.__constructor=function(){var me=this;try
{var group=(this._anchor?this._anchor:'default');log.log(['radio-constructor',this.__attributes]);if(this.__attributes.group){this._group=this.__attributes.group;}else{this._group='_default_';}
gui._obj_radio_list=gui._obj_radio_list||{};if(!gui._obj_radio_list[this._group]){gui._obj_radio_list[this._group]={list:{},onchange:function(that){var list=gui._obj_radio_list[me._group].list;for(var key in list){list[key]._groupOnchange(that);}}};}
gui._obj_radio_list[this._group].list[this._name]=this;var elm=mkElement('input',{"type":"radio","name":this._group,"id":this._pathName+'#main'});var elmlabel=mkElement('i',{});var elmlabel_content=mkElement('label',{});addcss(elmlabel_content,'label');this._main.appendChild(elm);this._main.appendChild(elmlabel);this._main.appendChild(elmlabel_content);this._initialValue=false;this.__eIN=elm;elm._label=elmlabel_content;this._elm=elm;}
catch(e)
{log.error(e);}
this._elm.onchange=function(e){if(me._checked()){gui._obj_radio_list[me._group].onchange(me);for(var i in gui._obj_radio_list[me._group].list){if(gui._obj_radio_list[me._group].list[i].__apivalue){gui._obj_radio_list[me._group].list[i].__apivalue.value=this.value;}}}
me._onchange(e);}
this._elm.onclick=this._main.onclick=function(e){var e=e||window.event,elm=e.target||e.srcElement;if(this==elm){if(!me._disabled()){if(me._onclick)
me._onclick(e);}}
return true;};this._elm.onfocus=function(e){var e=e||window.event;me.__hasFocus=true;if(me._onfocus)me._onfocus(e);me.__exeEvent('onfocus',e,{"owner":me});log.log('Element "'+this.id+'" focused');addcss(me._main,'focus');return true;};this._elm.onblur=function(e){var e=e||window.event;me.__hasFocus=false;if(me._onblur&&me._onblur(e)===false)return false;me.__exeEvent('onblur',e,{"owner":me});log.log('Element "'+this.id+'" blured');removecss(me._main,'focus');return true;};this._main.oncontextmenu=function(e){var e=e||window.event,elm=e.target||e.srcElement;if(me._oncontext&&me._oncontext(e)!==false)
me.__exeEvent('oncontext',e,{"owner":me});};this._main.onkeydown=function(e){var e=e||window.event;if(!me._disabled()&&me._onkeypress)
me._onkeypress(e);return true;};this._add_destructor('__onbeforedestruct');};_me.__onbeforedestruct=function(){delete gui._obj_radio_list[this._group].list[this._name];}
_me._toggle=function(sToggle){this._toggleTarget=sToggle;}
_me._readonly=function(bReadonly,single){if(!single&&typeof bReadonly!='undefined'){var list=gui._obj_radio_list[this._group].list;for(var key in list){list[key]._readonly(bReadonly,true);}
return bReadonly;}else{if(typeof bReadonly!='undefined')
{if(bReadonly){this._disabled(true);addcss(this._main,'is-readonly');this._elm.setAttribute('readonly','readonly');}else{this._disabled(false);removecss(this._main,'is-readonly');this._elm.removeAttribute('readonly');}}
return this._elm.hasAttribute('readonly');}};_me._disabled=function(sDisabled){if(sDisabled&&typeof sDisabled=='object'){this._disablealso_ids=sDisabled;}
if(this._disablealso_ids)
{var ids=this._disablealso_ids;for(var i=0;i<ids.length;i++){if(this._parent[ids[i]]){if(this._parent[ids[i]]._disabled){this._parent[ids[i]]._disabled(true);}}else if(this._parent._getAnchor(ids[i])){if(sDisabled){addcss(this._parent._getAnchor(ids[i]),'is-disabled');}else{removecss(this._parent._getAnchor(ids[i]),'is-disabled');}}}}
if(sDisabled){addcss(this._main,'is-disabled');}else{removecss(this._main,'is-disabled');}
return this._elm.disabled=sDisabled;};_me._setValue=function(apiprop){if(apiprop.value==undefined&&apiprop.default){this._groupValue(apiprop.default);}else{this._groupValue(apiprop.value);}
if(apiprop.readonly){this._readonly(true);}
if(apiprop.denied){this._main.setAttribute('is-hidden','1');}
this.__apivalue=apiprop;}
_me._value=function(sValue){if(typeof sValue!='undefined')
{this.__eIN.value=sValue;if(this._onchange){this._onchange();}}
return this.__eIN.value;};_me._groupValue=function(value){var list=gui._obj_radio_list[this._group].list;for(var key in list){if(typeof value!='undefined'){if(list[key]._value()==value){list[key]._checked(true);this._groupOnchange(list[key]);return list[key]._value();}}else{if(list[key]._checked()){return list[key]._value();}}}
if(typeof value!='undefined'){this._groupOnchange(this);return this._groupValue();}else{return false;}}
_me._groupOnchange=function(e){}
_me._placeholder=function(sPlaceholder){return this._elm.placeholder=sPlaceholder?getLang(sPlaceholder):this._elm.placeholder;};_me._title=function(sValue){if(Is.String(sValue))
this._elm.title=(sValue.indexOf('::')!=-1?getLang(sValue):sValue);else
return this._elm.title||'';};_me._doTheToggle=function(){if(this._toggleTarget&&this._parent[this._toggleTarget]){this._parent[this._toggleTarget]._toggle(this);}else if(this._toggleTarget){var elm=false;if(this._parent._getAnchor(this._toggleTarget)){var elm=this._parent._getAnchor(this._toggleTarget);}else if(document.getElementById(this._toggleTarget)){var elm=document.getElementById(this._toggleTarget);}
if(elm){if(elm.getAttribute('is-hidden')){elm.removeAttribute('is-hidden');}else{elm.setAttribute('is-hidden',1);}}}}
_me._onclick=function(e){this._doTheToggle();}
_me._checked=function(checked,ignoreChange){if(typeof checked!='undefined'){if(this._onchange&&checked!=this._elm.checked){this._elm.checked=checked;if(!ignoreChange){this._onchange();}}
this._elm.checked=checked;this._changed(true);this._groupChanged(true);}
return this._elm.checked;};_me._onchange=function(){}
_me._show=function(agent){this._main.style.display='';this._ishidden=false;};_me._hide=function(agent){this._main.style.display='none';this._ishidden=true;};_me._label=function(langstr){this._elm.setAttribute('title',getLang(langstr));this._elm._label.innerHTML=(langstr?helper.htmlspecialchars(getLang(langstr)):'');}
_me._changed=function(clear){if(clear){this._initialValue=this._checked();}
return this._initialValue!=this._checked();}
_me._groupChanged=function(clear){var ret=false;var list=gui._obj_radio_list[this._group].list;for(var key in list){if(list[key]._changed(clear)){if(!ret){ret=true;}}}
return ret;}
_me._addcss=function(css){addcss(this._main,css);}
_me._removecss=function(css){removecss(this._main,css);}

/* client/inc/obj_resourceinfo.js */
function obj_resourceinfo(){};var _me=obj_resourceinfo.prototype;_me.__constructor=function(s){var me=this;this._accountDomain=location.parsed_query.account.split('@');this._accountDomain=this._accountDomain[this._accountDomain.length-1];storage.library('wm_user');var view=this._view=new ResourceInfoView(this);gui.frm_main.main._setHeadingButton('generic::save',function(){me._save();},'button text success');this._selfHash="#menu=accountdetail&account=/ACCOUNT/&type=/TYPE/";};_me._load=function(domain)
{try
{var me=this;gui.frm_main.main._setHeading(punycode.ToUnicode(location.parsed_query.account));this._draw('obj_resourceinfo','',{items:{}});gui.frm_main.main._getAnchor('main_content').scrollTop=0;this.dropdown_type._fill({'0':getLang('userlist::room'),'1':getLang('userlist::equipment'),'2':getLang('userlist::car')});this.button_permissions._onclick=function(){me._openPermissions();}
me.input_send_notification._disabled(true);me.button_send_notification._disabled(true);me.toggle_send_notification._onchange=function(checked){if(checked){me.input_send_notification._disabled(false);me.button_send_notification._disabled(false);}else{me.input_send_notification._disabled(true);me.button_send_notification._disabled(true);}}
me.button_send_notification._onclick=function(){gui.accountpicker(function(data){log.log(['spamqueues-quarantine-load-accountpicker',data]);if(data[0]){me.input_send_notification._value(data[0].email,true);callEvent(me.input_send_notification.__eIN,'change');}},{disable_add_domain:true});}
var avatar=this._getAnchor("userimage");this.button_upload_photo._imagesOnly();this.button_upload_photo._droparea(avatar);this.button_upload_photo._onfile=function(img){}
this.button_upload_photo._onmimetypeerror=function(mime){gui.message.error(getLang('error::uploader_file_type_not_allowed'));}
var resource=new Account(location.parsed_query.account);resource.getProperties(['u_name','u_alias','s_type','s_unavailable','s_allowconflicts','s_notificationtomanager','s_manager','A_Image'],function(p){this._data=p;this.input_name._setValue(p.u_name);this.input_alias._setValue(p.u_alias);this.dropdown_type._setValue(p.s_type);if(p.A_Image){var elm=this._getAnchor("userimage");this.button_upload_photo._displayElement(elm);this.button_upload_photo._setValue(p.A_Image);}
this.toggle_temporarily_unavailable._setValue(p.s_unavailable);this.toggle_allow_conflicts._setValue(p.s_allowconflicts);this.toggle_send_notification._setValue(p.s_notificationtomanager,false);this.input_send_notification._setValue(p.s_manager);}.bind(this));}
catch(e)
{log.error(['resourceinfo-load',e]);}}
_me._issaved=function(target){return!this._data.hasChanged();}
_me._save=function(callback){var view=this._view;var domain=this._accountDomain;var reload=this._data.u_alias.hasChanged();if(this._data.hasChanged()){this._data.saveChanges(function(r){view.saveNotification(r==1);if(reload){location.hash=helper.translateHash(this._selfHash.replace('/ACCOUNT/',encodeURIComponent(this._data.u_alias+'@'+domain)),location.parsed_query);}
if(callback){callback(r==1);}}.bind(this));}}
_me._reset=function(){this._data.revertChanges();}
_me._openPermissions=function(){var popup=gui._create('popup','obj_popup');popup._init({fixed:false,iwattr:{height:'full',width:'medium'},name:'permissions',heading:{value:getLang('accountdetail::permissions')},footer:'obj_permissions_footer',content:'obj_permissions'});popup.content._load(location.parsed_query.account);}
var ResourceInfoView=function(controller){this._control=controller;}
ResourceInfoView.prototype=Object.create(CoreView.prototype);

/* client/inc/obj_resourcemembers.js */
function obj_resourcemembers(){};var _me=obj_resourcemembers.prototype;_me.__constructor=function(s){var me=this;storage.library('wa_accountmembers');storage.library('obj_accountpicker');gui.frm_main.main._setHeadingButton('accountdetail::add_members',function(){me._addMembers();},'button text primary');if(!gui.frm_main.main.actions){gui.frm_main.main._cleanHeadingButtonsAnchor();gui.frm_main.main._setAlternativeButtons(function(box,target_anchor){if(!box._alternativeButtons){box._alternativeButtons=[];}
var actionobject=box._create('actions','obj_actionselect',target_anchor);actionobject._value('generic::select_action');if(target_anchor=='heading_buttons_mobile'){actionobject._addcss('full',true);}
actionobject.actions._fill([{name:'delete',icon:false,onclick:function(){me._deleteSelectedMembers();return false;},value:'accountdetail::remove'}]);actionobject._disabled(true);box._alternativeButtons.push(actionobject);});}};_me._load=function(domain)
{var me=this;me._draw('obj_resourcemembers','',{items:{}});try
{this.list._onchange=function(e){if(me.list._getSelectedCount()==0){for(var i=0;i<gui.frm_main.main._alternativeButtons.length;i++)
{gui.frm_main.main._alternativeButtons[i]._text(getLang("generic::select_action"));gui.frm_main.main._alternativeButtons[i]._disabled(true);}}else{for(var i=0;i<gui.frm_main.main._alternativeButtons.length;i++)
{gui.frm_main.main._alternativeButtons[i]._text(getLang("generic::select_action")+" ("+me.list._getSelectedCount()+")");gui.frm_main.main._alternativeButtons[i]._disabled(false);}}}
var resources=new Account(location.parsed_query.account);var members=this.__members=resources.getMemberList();this.list._init('obj_groupmembers',false,function(linesPerPage,page,callback){members.load(function(result){if(result.length){for(var i=0;i<result.length;i++){me.list._drawItem(result[i]);}
me.list._refreshed();}else if(result.error){gui.message.error(result.error);}});},true);}
catch(e)
{log.error(['e1',e]);}}
_me._deleteSelectedMembers=function(){var me=this;var items=this.list._getSelectedList();var list=[];for(var i=0;i<items.length;i++)
{list.push(items[i].email.toString());}
log.info(['resourcemembers-delete',list]);var finish=function(result){if(result.error||result==0){gui.message.error(getLang("error::save_unsuccessful"));}else{gui.message.toast(getLang("message::save_successfull"));me.list._emptySelectedList();me.__members.reset();me.list._load();}}
if(list.length||this.list._selectAllActivated){gui.message.warning(getLang("warning::delete_selected_members",[this.list._selectAllActivated?this.list._totalcount:this.list._getSelectedCount()]),false,[{value:getLang("generic::cancel"),method:'close'},{value:getLang("generic::delete"),type:'text error',onclick:function(closeCallback){if(me.list._selectAllActivated){com.members.removeAll(location.parsed_query.account,finish);}else{com.members.remove(location.parsed_query.account,list,finish);}
closeCallback();}}]);}}
_me._addMembers=function(){var me=this;gui.accountpicker(function(items,type){var list=[];for(var i=0;i<items.length;i++)
{if(type==0){list.push("["+items[i].id+']');}else{list.push(items[i].id);}}
var items_in_grid=me.list._getItems();var old=[];for(var key in items_in_grid){old.push(items_in_grid[key]._item.email);}
var new_items=helper.array_diff(list,old);log.log(['resourcemembers-addmembers',old,list,new_items]);com.members.add(location.parsed_query.account,new_items,function(result){if(result.error||result==0){gui.message.error(getLang("error::save_unsuccessful"));}else{gui.message.toast(getLang("message::save_successfull"));me.list._emptySelectedList();me.__members.reset();me.list._load();}});},{allow_external_accounts:true,exclude:{accounts:[location.parsed_query.account]}});}

/* client/inc/obj_rulecard.js */
_me=obj_rulecard.prototype;function obj_rulecard(){};_me.__constructor=function(s){var me=this;me.__title='';me.__expanded=true;addcss(this._main,'rulecard is-active');me.__name='undefined';me.__type='undefined';me.__source={};me.__storage={};this._add_destructor('__onbeforedestruct');};_me.__onbeforedestruct=function(){if(this._onbeforedestruct){this._onbeforedestruct(this);}}
_me._expand=function(expand){if(expand){this.__expanded=true;addcss(this._main,'is-active');}else{this.__expanded=false;removecss(this._main,'is-active');}}
_me._load=function(name,type,emptycontent,expand)
{var me=this;if(typeof expand=='undefined'){expand=true;}
me.__name=name;me.__type=type;if(me.__type=='condition'){me.__source={bracketsleft:false,bracketsright:false,conditiontype:com.rules.translateCondition(name),logicalnot:false,operatorand:true,type:name};}else{me.__source={actiontype:com.rules.translateAction(name),type:name};}
this.__storage=helper.clone(me.__source);try
{var card_name={};if(name){card_name[type+'_'+name]=true;}
me._draw('obj_rulecard','',card_name);me.button_delete._onclick=function(){me._destruct();}
me.expand._onclick=function(){me._expand(!me.__expanded);}
me._expand(expand);me.button_not._checked=function(status){if(typeof status!='undefined')
{if(status){this._removecss('grey');this._addcss('primary');}else{this._addcss('grey');this._removecss('primary');}
this.__checked=status;}
if(!status&&me.actionselect_logic_gate._value().search('not')>=0){me.actionselect_logic_gate._value(me.actionselect_logic_gate._value().replace('not',''),true);}else if(status&&me.actionselect_logic_gate._value().search('not')<0){me.actionselect_logic_gate._value(me.actionselect_logic_gate._value()+'not',true);}
return(this.__checked?true:false);}
me.button_not._onclick=function(){if(this._checked()){this._checked(false);}else{this._checked(true);}}
me.actionselect_logic_gate._fill([{name:'and',icon:false,onclick:function(){return false;},value:'rules::and'},{name:'or',icon:false,onclick:function(){return false;},value:'rules::or'},{name:'andnot',icon:false,onclick:function(){return false;},value:'rules::and_not'},{name:'ornot',icon:false,onclick:function(){return false;},value:'rules::or_not'}]);me.actionselect_logic_gate._onchange=function(){if(this._value().search('not')>=0){me.button_not._checked(true);}else{me.button_not._checked(false);}}
if(type){me._iwAttr('type',type);}
if(emptycontent){removecss(me._main,'is-active');me.expand._disabled(true);}}
catch(e)
{log.error(['rulecard-load',e]);}
if(type=='condition'){me.__activateConditionCard();}else{me.__activateActionCard();}}
_me._getLogic=function(){if(this.actionselect_logic_gate){var val=this.actionselect_logic_gate._value();return{not:(val.search('not')>=0),and:(val.search('and')>=0),or:(val.search('or')>=0)};}
return false;}
_me.__logicGate=function(and,not){try
{this.actionselect_logic_gate._value((and?'and':'or')+(not?'not':''));this.button_not._checked(not);}
catch(e)
{log.error(['rulecard-logicgate',e]);}}
_me._iwAttr=function(arr,val){if(typeof arr!='object'){n={};n[arr]=val;arr=n;}
for(var key in arr){this._main.setAttribute('iw-'+key,arr[key]);}}
_me._title=function(title,returnasstring){var me=this;me.__title=title;log.log(['rulecard-title',title]);if(typeof title=='object'){if(title[1]){if(returnasstring){return title[1]+': '+title[0];}
me._getAnchor('title_regular').innerHTML=helper.htmlspecialchars(title[0]);me._getAnchor('title_bold').innerHTML=helper.htmlspecialchars(title[1])+': ';}}else{if(returnasstring){return title;}
me._getAnchor('title_regular').innerHTML=helper.htmlspecialchars(title);}}
_me._set=function(data){this.__source=data;this.__storage=helper.clone(data);this.__logicGate((data.operatorand?true:false),(data.logicalnot?true:false));if(this.__type=='condition'){this.__setCondition(data);}else{this.__setAction(data);}}
_me._get=function(){this._updateStorage();return this.__storage;}
_me.__activateConditionCard=function(){try
{var me=this;var name=me.__name;log.log(['rulecard-activateconditioncard',name]);switch(name){case'dummy':break;case'cc':case'replyto':case'from':case'to':case'subject':case'date':case'body':case'customheader':case'attachname':case'anyheader':case'sender':case'recipient':case'remoteip':case'rdns':me.dropdown_string_condition_function._fill({'*2':getLang("rules::function_contains_value_from_list"),'*3':getLang("rules::function_matches_regex"),'*4':getLang("rules::function_starts_with"),'*5':getLang("rules::function_ends_with"),'*6':getLang("rules::function_equals"),'*7':getLang("rules::function_contains_value_from_file")});me.button_string_condition_string._onclick=function(){log.log(['rulecard-activateconditioncard-replyto','clicked']);gui.accountpicker(function(picked){log.log(['rulecard-activateconditioncard-replyto',picked]);var ids=[];for(var i=0;i<picked.length;i++){ids.push(picked[i]._id);}
me.input_string_condition_string._value(ids.join(';'));});}
break;case'senderrecipient':me.button_member_of._onclick=function(){log.log(['rulecard-activateconditioncard-replyto','clicked']);gui.accountpicker(function(picked){log.log(['rulecard-activateconditioncard-replyto',picked]);var ids=[];for(var i=0;i<picked.length;i++){ids.push(picked[i]._id);}
me.input_member_of._value(ids.join(';'));});}
break;case'priority':me.dropdown_message_priority._fill({'*1':getLang("rules::priority_highest"),'*2':getLang("rules::priority_high"),'*3':getLang("rules::priority_normal"),'*4':getLang("rules::priority_low"),'*5':getLang("rules::priority_lowest"),});break;case'dnsbl':break;case'spamscore':this.dropdown_spam_score._fill({'*0':getLang('rules::lower'),'*1':getLang('rules::greater')});break;case'size':this.dropdown_message_size._fill({'*0':getLang('rules::lower'),'*1':getLang('rules::greater')});this.dropdown_message_size_than._fill({'*0':getLang('generic::size_kb'),'*1':getLang('generic::size_mb'),'*2':getLang('generic::size_gb')});break;case'directmessage':this.checkbox_checkuserinto._checked(true);this.checkbox_checkuserincc._checked(true);this.checkbox_userisonlyrecipient._onchange=function(e){if(!e||!e.target.checked){return;}
me.checkbox_checkuserinto._checked(false);me.checkbox_checkuserincc._checked(false);me.checkbox_checkuserinbcc._checked(false);}
this.checkbox_checkuserinto._onchange=this.checkbox_checkuserincc._onchange=this.checkbox_checkuserinbcc._onchange=function(e){if(e&&e.target.checked){me.checkbox_userisonlyrecipient._checked(false);}}
break;}}
catch(e)
{log.error(['rulecard-activateconditioncard',e]);}}
_me.__activateActionCard=function(){try
{var me=this;var name=me.__name;log.info(['rulecard-activateactioncard',name]);switch(name){case'dummy':break;case'priority':me.dropdown_message_priority._fill({'*1':getLang("rules::priority_highest"),'*2':getLang("rules::priority_high"),'*3':getLang("rules::priority_normal"),'*4':getLang("rules::priority_low"),'*5':getLang("rules::priority_lowest"),});break;case'forward':me.button_email_address._onclick=function(){gui.accountpicker(function(picked){log.log(['rulecard-activateconditioncard-replyto',picked]);var ids=[];for(var i=0;i<picked.length;i++){ids.push(picked[i]._id);}
me.input_email_address._value(ids.join(';'));});}
break;case'header':case'sendmessage':this.button_settings._onclick=function(){me._updateStorage=function(){};var popup=gui._create('popup','obj_popup');popup._init({fixed:false,iwattr:{height:'full',width:'medium'},name:'header',heading:{value:me._title(me.__title,true)},footer:'default'});var optional={name:me.__name}
optional[me.__name]=true;popup.main._draw('obj_rulepopup','main_content',optional);if(name=='sendmessage')
{popup.main.button_from._onclick=function(){gui.accountpicker(function(picked){var ids=[];for(var i=0;i<picked.length;i++){ids.push(picked[i]._id);}
popup.main.input_from._value(ids.join(';'));});}
popup.main.button_to._onclick=function(){gui.accountpicker(function(picked){var ids=[];for(var i=0;i<picked.length;i++){ids.push(picked[i]._id);}
popup.main.input_to._value(ids.join(';'));});}
popup.main.input_from._value(me.__storage.messagefrom);popup.main.input_to._value(me.__storage.messageto);popup.main.input_subject._value(me.__storage.messagesubject);popup.main.textarea_text._value(me.__storage.messagetext);popup.main.btn_save._onclick=function(){me.__storage.messagefrom=popup.main.input_from._value();me.__storage.messageto=popup.main.input_to._value();me.__storage.messagesubject=popup.main.input_subject._value();me.__storage.messagetext=popup.main.textarea_text._value();popup._close();}}
else
{if(!me.__storage.headers){me.__storage.headers=[];}
popup.main.btn_save._onclick=function(){var items=popup.main.list._getItems();log.log(['rulecard-activateactioncard-save',items]);for(var key in items){me.__storage.headers.push(items[key]._item);}
popup._close();}
popup.main.btn_add._onclick=function(edit){var popup2=gui._create('popup','obj_popup');popup2._init({fixed:false,iwattr:{height:'full',width:'medium'},name:'header_add',heading:{value:me._title(getLang('rulecard::add'),true)},footer:'default'});popup2.main._draw('obj_rulepopup','main_content',{header_add:true});popup2.main.btn_save._onclick=function(){log.log('rulecard-activateactioncard-add-save');var line=popup.main.list._drawItem({editheadertype:(popup2.main.dropdown_action._value()=='delete'?true:false),header:popup2.main.input_header._value(),value:popup2.main.input_value._value(),hasregex:popup2.main.toggle_regex._checked(),regex:popup2.main.input_regex._value()});me._activateItem(popup,line);popup2._close();}
popup2.main.dropdown_action._fill({'add':getLang('rulepopup::add_edit'),'delete':getLang('rulepopup::delete')});return popup2;}
for(var i=0;i<me.__storage.headers.length;i++){var line=popup.main.list._drawItem(me.__storage.headers[i]);me._activateItem(popup,line);}}}
break;case'copyfolder':case'movefolder':if(!location.parsed_query.account){this.button_folderpicker._disabled(true);me[(name=='copyfolder'?'input_copy_to_folder':'input_move_to_folder')]._value('INBOX');}
this.button_folderpicker._onclick=function(){gui.folderpicker(function(data){try
{var id=data.id;id=id.substr(1,id.length-1);id=helper.base64_decode(id);me[(name=='copyfolder'?'input_copy_to_folder':'input_move_to_folder')]._value(id);}
catch(e)
{log.error(['rulecard-activateactioncard-movefolder',name,data,e])}});}
break;}}
catch(e)
{log.error(['rulecard-activateconditioncard',e]);}}
_me._activateItem=function(popup,line){var me=this;line._objects[0]._onclick=function(line){return function(){var popup2=popup.main.btn_add._onclick(true);popup2.main.dropdown_action._value((line._item.editheadertype=='1'?'delete':'add'));popup2.main.input_header._value(line._item.header);popup2.main.input_value._value(line._item.value);popup2.main.input_regex._value(line._item.regex);popup2.main.toggle_regex._checked(line._item.hasregex);log.log(['rulecard-activateitem-edit',line]);popup2.main.btn_save._onclick=function(line){return function(){log.log(['rulecard-activateitem-edit-save',line]);var nline=popup.main.list._redrawItem(line,{editheadertype:(popup2.main.dropdown_action._value()=='delete'?true:false),header:popup2.main.input_header._value(),value:popup2.main.input_value._value(),hasregex:popup2.main.toggle_regex._checked(),regex:popup2.main.input_regex._value()});me._activateItem(popup,nline);popup2._close();}}(line);}}(line);line._objects[1]._onclick=function(line){return function(){line._destruct();}}(line);}
_me.__setCondition=function(data){var me=this;log.log(['rulecard-setcondition-name',this.__name]);switch(this.__name){case'from':case'subject':case'body':case'cc':case'name':case'replyto':case'to':case'date':case'customheader':case'attachname':case'anyheader':case'sender':case'recipient':case'remoteip':case'rdns':case'dnsbl':if(this.checkbox_match_case){this.checkbox_match_case._checked((data.matchcase?true:false));}
if(this.checkbox_whole_word){this.checkbox_whole_word._checked((data.matchwholewordsonly?true:false));}
if(this.dropdown_string_condition_function){this.dropdown_string_condition_function._value(data.matchfunction);}
if(this.input_string_condition_string){this.input_string_condition_string._value(data.matchvalue);}
break;case'senderrecipient':if(data.recipientsender==0){this.radio_sender._checked(true);}else{this.radio_recipient._checked(true);}
if(data.remotelocal==0){this.radio_remote._checked(true);}else{this.radio_local._checked(true);}
if(data.recipientcondition==0){this.radio_ignore._checked(true);}else if(data.recipientcondition==1){this.radio_user_exists._checked(true);}else{this.radio_user_doesnt_exists._checked(true);}
if(data.account){this.input_member_of._value(data.account);}
break;case'size':this.dropdown_message_size._value(data.comparetype);var size=helper.bytes2hr(data.size/1024,true,[getLang('generic::size_kb'),getLang('generic::size_mb'),getLang('generic::size_gb')]);this.input_message_size_than._value(size.size);this.dropdown_message_size_than._value(size.unit);break;case'priority':this.dropdown_message_priority._value(data.priority);break;case'spamscore':this.dropdown_spam_score._value(data.comparetype);this.input_spam_score_than._value(data.spamscore);break;case'time':if(data.weekdays){this.toggle_weekdays._checked(true);var day='monday';this['checkbox_'+day]._checked(data[day]);var day='tuesday';this['checkbox_'+day]._checked(data[day]);var day='wednesday';this['checkbox_'+day]._checked(data[day]);var day='thursday';this['checkbox_'+day]._checked(data[day]);var day='friday';this['checkbox_'+day]._checked(data[day]);var day='saturday';this['checkbox_'+day]._checked(data[day]);var day='sunday';this['checkbox_'+day]._checked(data[day]);}
if(data.fromtime!=''){this.toggle_between_times._checked(true);var time=data.fromtime.split(':');time=(parseInt(time[0])<10?'0'+parseInt(time[0]):parseInt(time[0]))+':'+(parseInt(time[1])<10?'0'+parseInt(time[1]):parseInt(time[1]))
this.input_time_from._value(time);}
if(data.fromdate!=''){this.toggle_between_dates._checked(true);var date=data.fromdate.split('/');this.input_date_from._setDate(date[0],date[1],date[2]);}
if(data.totime!=''){this.toggle_between_times._checked(true);var time=data.totime.split(':');time=(parseInt(time[0])<10?'0'+parseInt(time[0]):parseInt(time[0]))+':'+(parseInt(time[1])<10?'0'+parseInt(time[1]):parseInt(time[1]))
this.input_time_to._value(time);}
if(data.todate!=''){this.toggle_between_dates._checked(true);var date=data.todate.split('/');this.input_date_to._setDate(date[0],date[1],date[2]);}
break;case'directmessage':this.checkbox_checkuserinto._checked(!!+data.checkuserinto);this.checkbox_checkuserincc._checked(!!+data.checkuserincc);this.checkbox_checkuserinbcc._checked(!!+data.checkuserinbcc);this.checkbox_userisonlyrecipient._checked(!!+data.userisonlyrecipient)
break;}}
_me.__setAction=function(data){var me=this;log.info(['rulecard-setaction',this.__name,data]);switch(this.__name){case'messageaction':this['radio_'+['accept','delete','reject','spam','quarantine'][data.messageactiontype]]._checked(true);break;case'forward':this.input_email_address._value(data.email);this.forward_as_attachment._checked(data.forwardasattachment==1);break;case'priority':this.dropdown_message_priority._value(data.priority);break;case'movefolder':this.input_move_to_folder._value(data.folder);break;case'copyfolder':this.input_copy_to_folder._value(data.folder);break;case'header':case'sendmessage':break;case'flags':this.checkbox_flagged._checked(data.flagged);this.checkbox_seen._checked(data.seen);this.checkbox_junk._checked(data.junk);this.checkbox_non_junk._checked(data.notjunk);this.checkbox_label_1._checked(data.label1);this.checkbox_label_2._checked(data.label2);this.checkbox_label_3._checked(data.label3);this.checkbox_label_4._checked(data.label4);this.checkbox_label_5._checked(data.label5);this.checkbox_label_6._checked(data.label6);this.input_custom_flags._value(data.customflags);break;}}
_me._setValue=function(key,val){this.__storage[key]=val;}
_me._updateStorage=function(){try
{if(typeof this.__storage.logicalnot!='undefined'&&this._getLogic()){this.__storage.logicalnot=this._getLogic().not;}
if(typeof this.__storage.operatorand!='undefined'&&this._getLogic()){this.__storage.operatorand=(this._getLogic().and?true:false);}
if(this.__type=='condition'){switch(this.__name){case'priority':this.__storage.priority=this.dropdown_message_priority._value();break;case'from':case'to':case'subject':case'cc':case'replyto':case'date':case'body':case'customheader':case'anyheader':case'attachname':case'sender':case'recipient':case'remoteip':case'rdns':case'dnsbl':case'name':if(this.checkbox_match_case){this._setValue('matchcase',this.checkbox_match_case._checked());}
if(this.dropdown_string_condition_function){this._setValue('matchfunction',this.dropdown_string_condition_function._value());}
if(this.input_string_condition_string){this._setValue('matchvalue',this.input_string_condition_string._value());}
if(this.checkbox_whole_word){this._setValue('matchwholewordsonly',this.checkbox_whole_word._checked());}
if(this.checkbox_parse_xml){this._setValue('parsexml',this.checkbox_parse_xml._value());}
break;case'size':if(this.input_message_size_than._value()==''){this.input_message_size_than._value(0);}
var size=Math.round(parseFloat(this.input_message_size_than._value().replace(',','.'))*Math.pow(1024,parseInt(this.dropdown_message_size_than._value())+1));this._setValue('size',size);this._setValue('comparetype',parseInt(this.dropdown_message_size._value()));break;case'senderrecipient':this._setValue('recipientsender',(this.radio_sender._checked()?0:1));this._setValue('remotelocal',(this.radio_local._checked()?1:0));this._setValue('recipientcondition',(this.radio_ignore._checked()?0:(this.radio_user_exists._checked()?1:2)));this._setValue('account',this.input_member_of._value());break;case'spamscore':if(this.input_spam_score_than._value()==''){this.input_spam_score_than._value(0);}
this._setValue('spamscore',this.input_spam_score_than._value().replace(',','.'));this._setValue('comparetype',parseInt(this.dropdown_spam_score._value()));break;case'time':this._setValue('betweendates',this.toggle_between_dates._checked());this._setValue('betweentimes',this.toggle_between_times._checked());this._setValue('friday',this.checkbox_friday._checked());this._setValue('fromdate',(this.input_date_from._getDate()?this.input_date_from._getDate().day+'/'+this.input_date_from._getDate().month+'/'+this.input_date_from._getDate().year:0));this._setValue('fromtime',this.input_time_from._value());this._setValue('monday',this.checkbox_monday._checked());this._setValue('saturday',this.checkbox_saturday._checked());this._setValue('sunday',this.checkbox_sunday._checked());this._setValue('thursday',this.checkbox_thursday._checked());this._setValue('todate',(this.input_date_to._getDate()?this.input_date_to._getDate().day+'/'+this.input_date_to._getDate().month+'/'+this.input_date_to._getDate().year:0));this._setValue('totime',this.input_time_to._value());this._setValue('tuesday',this.checkbox_tuesday._checked());this._setValue('wednesday',this.checkbox_wednesday._checked());this._setValue('weekdays',this.toggle_weekdays._checked());break;case'directmessage':this._setValue('userisonlyrecipient',this.checkbox_userisonlyrecipient._checked());this._setValue('checkuserinto',this.checkbox_checkuserinto._checked());this._setValue('checkuserincc',this.checkbox_checkuserincc._checked());this._setValue('checkuserinbcc',this.checkbox_checkuserinbcc._checked());break;}}else{switch(this.__name){case'messageaction':var radio=['accept','delete','reject','spam','quarantine'];for(var i=0;i<radio.length;i++){if(this['radio_'+radio[i]]._checked()){this._setValue('messageactiontype',i);}}
break;case'priority':this._setValue('priority',this.dropdown_message_priority._value());break;case'forward':this._setValue('email',this.input_email_address._value())
this._setValue('forwardasattachment',this.forward_as_attachment._checked())
break;case'movefolder':this._setValue('folder',this.input_move_to_folder._value());break;case'copyfolder':this._setValue('folder',this.input_copy_to_folder._value());break;case'flags':this._setValue('flagged',this.checkbox_flagged._checked());this._setValue('junk',this.checkbox_junk._checked());this._setValue('notjunk',this.checkbox_non_junk._checked());this._setValue('seen',this.checkbox_seen._checked());this._setValue('label1',this.checkbox_label_1._checked());this._setValue('label2',this.checkbox_label_2._checked());this._setValue('label3',this.checkbox_label_3._checked());this._setValue('label4',this.checkbox_label_4._checked());this._setValue('label5',this.checkbox_label_5._checked());this._setValue('label6',this.checkbox_label_6._checked());this._setValue('customflags',this.input_custom_flags._value());break;}}}
catch(e)
{log.error(['rulecard-updatestorage',e]);}
return this.__storage;}

/* client/inc/obj_rules.js */
var obj_rules=(function(_super){__extends(obj_rules,_super);function obj_rules(){_super.call(this);var me=this;this.__who=(location.parsed_query.account?location.parsed_query.account:location.parsed_query.domain);storage.library('wm_rules');storage.library('wm_domain');storage.library('wm_user');gui.frm_main.main._setHeadingButton('rules::new_rule',function(){me._new();},'button text primary');if(!gui.frm_main.main.actions){gui.frm_main.main._cleanHeadingButtonsAnchor();gui.frm_main.main._setAlternativeButtons(function(box,target_anchor){if(!box._alternativeButtons){box._alternativeButtons=[];}
var actionobject=box._create('actions','obj_actionselect',target_anchor);actionobject._value('generic::select_action');if(target_anchor=='heading_buttons_mobile'){actionobject._addcss('full',true);}
actionobject._fill([{name:'delete',icon:false,onclick:function(){me._deleteSelectedRules();return false;},value:'rules::delete'},{name:'activate',icon:false,onclick:function(){me._activateSelectedRules(true);return false;},value:'rules::activate'},{name:'deactivate',icon:false,onclick:function(){me._activateSelectedRules(false);return false;},value:'rules::deactivate'}]);actionobject._disabled(true);box._alternativeButtons.push(actionobject);});}}
obj_rules.prototype.__onclick=function(e){log.log(['clicked',e]);};obj_rules.prototype._load=function(e,aData){try{var me=this;var where=(location.parsed_query.account?'user':'domain');log.log('Rules should be loaded');me._draw('obj_rules','',{});me.list._init('obj_rules',false,function(linesPerPage,page){com[where].rulesInfoList(me.__who,linesPerPage,page,function(result){log.log(['result',result]);var items=result.items;me.list._setMax(result.overallcount);try{for(var i=0;i<items.length;i++){items[i]['action_type']=['accept','delete','reject','spam','quarantine'][items[i].action];if(!items[i].title||helper.trim(items[i].title)==''){items[i].title=getLang('rules::rule_number')+" "+items[i].id;}
var line=me.list._drawItem(items[i]);if(!items[i].active){line.classList.add('inactive');}
log.log(['rules-load',line._objects]);var up=line._objects[1];up._item=line._item;var down=line._objects[2];down._item=line._item;var title=me.list._getAnchor('rule_'+line._item.id);title._item=line._item;title.onclick=function(){me._openRulesDialog(this._item.id);return false;};up._onclick=function(line){return function(){var l=me.list._getItems();var ll=helper.associativeArrayLength(l);var i=0;for(var key in l){i++;if(l[key]._item==line._item&&i==1){return false;}}
com.rules.moveRule(me.__who,this._item.id,'up',function(response){me.list._load();});};}(line);down._onclick=function(line){return function(){var l=me.list._getItems();var ll=helper.associativeArrayLength(l);var i=0;for(var key in l){i++;if(l[key]._item==line._item&&i==ll){return false;}}
com.rules.moveRule(me.__who,this._item.id,'down',function(response){me.list._load();});};}(line);}}
catch(e){log.error(['rules-load-list-init',e]);}});});me.list._onchange=function(e){if(me.list._getSelectedCount()==0){for(var i=0;i<gui.frm_main.main._alternativeButtons.length;i++){gui.frm_main.main._alternativeButtons[i]._text(getLang("generic::select_action"));gui.frm_main.main._alternativeButtons[i]._disabled(true);}}
else{for(var i=0;i<gui.frm_main.main._alternativeButtons.length;i++){gui.frm_main.main._alternativeButtons[i]._text(getLang("generic::select_action")+" ("+me.list._getSelectedCount()+")");gui.frm_main.main._alternativeButtons[i]._disabled(false);}}
if(e&&e.text=='select-all'){return false;}};}
catch(e){log.error(e);}};obj_rules.prototype._new=function(){this._openRulesDialog();};obj_rules.prototype._openRulesDialog=function(rule){var me=this;var popup=gui._create('popup','obj_popup');popup._init({fixed:false,name:'rulesdialog',iwattr:{height:'auto',width:'large'},heading:{value:getLang('rules::rules')},footer:'default',content:'obj_rulesdialog'});popup.content._load(me.__who,rule);popup.content._setCallback(function(){me.list._load();popup._close();});};obj_rules.prototype._deleteSelectedRules=function(){var me=this;var list=this.list._selectedList;log.log(['rules-deleteselectedrules',list]);var f=function(id){com.rules.deleteRule(id,me.__who,function(data){try{if(data.Array.IQ[0].QUERY[0].RESULT[0].VALUE==0){gui.message.error(getLang("error::rule_delete_unsuccessful"));me.list._load();}
else{list.pop();if(list.length>0){f(list[list.length-1].id);}
else{gui.message.toast(getLang("message::rule_delete_successfull"));me.list._load();}}}
catch(e){log.error(e);}});};if(list.length>0){f(list[list.length-1].id);}};obj_rules.prototype._activateSelectedRules=function(activate){var me=this;var list=this.list._selectedList;log.log(['rules-'+(activate?'':'de')+'activateselectedrules',list]);var f=function(id){com.rules.activateRule(id,activate,me.__who,function(data){try{if(data.Array.IQ[0].QUERY[0].ERROR){gui.message.error(getLang("error::"+data.Array.IQ[0].QUERY[0].ERROR[0].ATTRIBUTES.UID));}
if(data.Array.IQ[0].QUERY[0].RESULT[0].VALUE==0){gui.message.error(getLang("error::rule_"+(activate?'':'de')+"activate_unsuccessful"));me.list._load();}
else{list.pop();if(list.length>0){f(list[list.length-1].id);}
else{gui.message.toast(getLang("message::rule_"+(activate?'':'de')+"activate_successful"));me.list._load();}}}
catch(e){log.error(e);}});};if(list.length>0){f(list[list.length-1].id);}};return obj_rules;}(obj_generic));

/* client/inc/obj_rulesdialog.js */
_me=obj_rulesdialog.prototype;function obj_rulesdialog(){};_me.__constructor=function(s){var me=this;var parent=this._parent;this.__id=false;this.__who='';storage.library('wm_rules');storage.library('obj_accountpicker');me.__emptyactions={sendmessage:true,header:true,encrypt:true};me.__emptyconditions={all:true,hasattach:true,spam:true,trustedsession:true,smtpauth:true,stop:true};me.__actions={standard:{messageaction:getLang('rules::action_accept_reject_delete_spam_quarantine'),forward:getLang('rules::action_forward_to_email'),copyfolder:getLang('rules::action_copy_to_folder'),movefolder:getLang('rules::action_move_to_folder'),encrypt:getLang('rules::action_encrypt_message')},extra:{sendmessage:getLang('rules::action_send_new_message'),header:getLang('rules::action_edit_message_header'),priority:getLang('rules::action_set_message_priority_to'),flags:getLang('rules::action_set_message_flags_to'),stop:getLang('rules::action_stop_processing_more_rules'),}}
me.__conditions={basic:{all:getLang('rules::condition_all_messages'),from:[getLang('rules::condition_where_from'),getLang('rules::condition_message_header_matches')],subject:[getLang('rules::condition_where_subject'),getLang('rules::condition_message_header_matches')],body:getLang('rules::condition_where_message_body_matches'),hasattach:getLang('rules::condition_where_message_contains_attachment'),attachname:getLang('rules::condition_where_attachment_name_matches'),priority:getLang('rules::condition_where_message_priority_is'),size:getLang('rules::condition_where_message_size_is'),spam:getLang('rules::condition_where_message_is_spam')},headers:{to:[getLang('rules::condition_where_to'),getLang('rules::condition_message_header_matches')],cc:[getLang('rules::condition_where_cc'),getLang('rules::condition_message_header_matches')],replyto:[getLang('rules::condition_where_replyto'),getLang('rules::condition_message_header_matches')],date:[getLang('rules::condition_where_date'),getLang('rules::condition_message_header_matches')],customheader:getLang('rules::condition_where_custom_message_header_matches'),anyheader:getLang('rules::condition_where_any_message_header_matches'),directmessage:getLang('rules::condition_where_message_direct_to_user')},advanced:{sender:getLang('rules::condition_where_sender_matches'),recipient:getLang('rules::condition_where_recipient_matches'),senderrecipient:getLang('rules::condition_where_sender_recipient_is_local_remote'),spamscore:getLang('rules::condition_where_spam_score_is'),time:getLang('rules::condition_where_local_time_meets'),rdns:getLang('rules::condition_where_rdns_matches'),remoteip:getLang('rules::condition_where_senders_ip_address_matches'),dnsbl:getLang('rules::condition_where_senders_ip_address_is_listed_on_dnsbl'),trustedsession:getLang('rules::condition_where_session_is_trusted'),smtpauth:getLang('rules::condition_where_smtp_auth'),}};this._parent.btn_save._onclick=function(){me._parent.btn_save._disabled(true);me._save();}};_me._setCallback=function(callback){this.__callback=callback;}
_me.__onclick=function(e){log.log('clicked',e);};_me.__listOf=function(type,returnlist){try
{type=type.replace('s','');var me=this;if(typeof me['__listof'+type+'s']=='undefined'){me['__listof'+type+'s']={};}
var list=[];for(var key in me['__listof'+type+'s']){list.push(me['__listof'+type+'s'][key]);}
if(returnlist){return list;}else{return{add:function(card){var id=card._name.match(/\d+$/);card._onbeforedestruct=me.__listOf(type).remove;me['__listof'+type+'s'][card.__name+id]=card;},remove:function(card){var id=card._name.match(/\d+$/);if(card._addButton){card._addButton._disabled(false);}
delete me['__listof'+type+'s'][card.__name+id];},list:list}}}
catch(e)
{log.error(['rulesdialog-listof',type,returnlist]);}}
_me._listOfConditions=function(returnlist){return this.__listOf('condition',returnlist);}
_me._listOfActions=function(returnlist){return this.__listOf('action',returnlist);}
_me._fillConditionsTab=function(id,addCallback){var me=this;var list=me.tabs_conditions._create(id+'_list','obj_loadable',me.tabs_conditions._getTab(id).contentAnchor);list._value('obj_rulesdialog_conditions_item');list._iwAttr('type','compact');addcss(list._main,'noanchor');for(var key in me.__conditions[id])
{var item={key:key};item.title=me.__conditions[id][key];if(typeof me.__conditions[id][key]=='object'){item.val=me.__conditions[id][key][0];item.val2=me.__conditions[id][key][1];}else{item.val=me.__conditions[id][key];}
var line=list._drawItem(item);var add=line._objects[0];add._item=line._item;add._onclick=function(){if(addCallback){addCallback(this._item);}}}
return list;}
_me._fillActionsTab=function(id,addCallback){var me=this;var list=me.tabs_actions._create(id+'_list','obj_loadable',me.tabs_actions._getTab(id).contentAnchor);list._value('obj_rulesdialog_conditions_item');list._iwAttr('type','compact');addcss(list._main,'noanchor');for(var key in me.__actions[id])
{var item={key:key};item.title=me.__actions[id][key];if(typeof me.__actions[id][key]=='object'){item.val=me.__actions[id][key][0];item.val2=me.__actions[id][key][1];}else{item.val=me.__actions[id][key];}
var line=list._drawItem(item);var add=line._objects[0];add._item=line._item;add._onclick=function(){if(addCallback){var card=addCallback(this._item);this._disabled(true);card._addButton=this;}}}
return list;}
_me._getConditionTitle=function(type){var me=this;for(var key in me.__conditions){if(me.__conditions[key][type]){return me.__conditions[key][type];}}
log.error(['rulesdialog-getconditiontitle','type "'+type+'" undefined']);return'';}
_me._getActionTitle=function(type){var me=this;for(var key in me.__actions){if(me.__actions[key][type]){return me.__actions[key][type];}}
log.error(['rulesdialog-getactiontitle','type "'+type+'" undefined']);return'';}
_me._load=function(who,rule)
{this.__id=rule;this.__who=who;var domain=false;var account=false;if(who.search('@')<0){domain=who;}else{account=who;}
log.log(['rulesdialog-load',account,domain,rule]);try
{var me=this;var parent=this._parent;log.log('Rules dialog should be loaded');me._draw('obj_rulesdialog','',{});if(rule){com.rules.rule(who,rule,function(data){me.input_title._value(data.title);for(var i=0;i<data.conditions.length;i++){data.conditions[i].type=com.rules.translateCondition(parseInt(data.conditions[i].conditiontype));log.log(['rulesdialog-conditionsloop',data.conditions[i]]);var card=me._addConditionCard(data.conditions[i].type,me._getConditionTitle(data.conditions[i].type));card._set(data.conditions[i]);}
for(var i=0;i<data.actions.length;i++){try
{data.actions[i].type=com.rules.translateAction(parseInt(data.actions[i].actiontype));log.log(['rulesdialog-actionsloop',data.actions[i]]);var card=me._addActionCard(data.actions[i].type,me._getActionTitle(data.actions[i].type));card._set(data.actions[i]);}
catch(e)
{log.error(['rulesdialog-load-actionsloop',e]);}}
me._collapseAllConditionCards();me._collapseAllActionCards();});}
me.tabs_conditions._fill([{id:'basic',label:getLang('rules::basic')},{id:'headers',label:getLang('rules::headers'),},{id:'advanced',label:getLang('rules::advanced')}]);me.tabs_actions._fill([{id:'standard',label:getLang('rules::standard')},{id:'extra',label:getLang('rules::extra')}]);var list=me._fillConditionsTab('basic',function(data){me._addConditionCard(data.key,data.title);});var list=me._fillConditionsTab('headers',function(data){me._addConditionCard(data.key,data.title);});var list=me._fillConditionsTab('advanced',function(data){me._addConditionCard(data.key,data.title);});var list=me._fillActionsTab('standard',function(data){return me._addActionCard(data.key,data.title);});var list=me._fillActionsTab('extra',function(data){return me._addActionCard(data.key,data.title);});}
catch(e){log.error(e);}}
_me._collapseAllConditionCards=function(){var list=this._listOfConditions().list;for(var i=0;i<list.length;i++){list[i]._expand(false);}}
_me._addConditionCard=function(key,title){var me=this;var i=0;var objid='card_condition_'+key;while(me[objid]){i++;objid='card_condition_'+key+i;}
log.log(['rulesdialog-addconditioncard','add card with optional "'+key+'"',title]);var card=me._create(objid,'obj_rulecard','rules_result_conditions');me._collapseAllConditionCards();card._load(key,'condition',(me.__emptyconditions[key]));card._title(title);me._listOfConditions().add(card);return card;}
_me._collapseAllActionCards=function(){var list=this._listOfActions().list;for(var i=0;i<list.length;i++){list[i]._expand(false);}}
_me._addActionCard=function(key,title){var me=this;var i=0;var objid='card_action_'+key;while(me[objid]){i++;objid='card_action_'+key+i;}
log.log(['rulesdialog-addactioncard','add card with optional "'+key+'"',title]);var card=me._create(objid,'obj_rulecard','rules_result_actions');me._collapseAllActionCards();card._load(key,'action',(me.__emptyactions[key]));card._title(title);me._listOfActions().add(card);return card;}
_me._save=function(){var me=this;var conditions=this.__listOf('condition').list;var actions=this.__listOf('action').list;var data_conditions=[];for(var i=0;i<conditions.length;i++){conditions[i]._updateStorage();data_conditions.push(conditions[i].__storage);}
var data_actions=[];for(var i=0;i<actions.length;i++){actions[i]._updateStorage();data_actions.push(actions[i].__storage);}
var callback=function(data){me._parent.btn_save._disabled(false);try
{if(data.Array.IQ[0].QUERY[0].ERROR){log.error('e:'+data.Array.IQ[0].QUERY[0].ERROR[0].ATTRIBUTES.UID);}
else
{if(data.Array.IQ[0].QUERY[0].RESULT[0].VALUE==0){gui.message.error(getLang("error::rule_save_unsuccessful"));}else{gui.message.toast(getLang("message::rule_save_successfull"));if(me.__callback){me.__callback();}}}}
catch(e)
{log.error(e);}}
if(this.__id){com.rules.edit(this.__id,this.__who,this.input_title._value(),data_conditions,data_actions,callback);}else{com.rules.add(this.__who,this.input_title._value(),data_conditions,data_actions,callback);}}

/* client/inc/obj_server_settings.js */
_me=obj_server_settings.prototype;function obj_server_settings(){};_me.__constructor=function(s){var me=this;me._defaultTab='certificates';this._add_destructor('__onbeforedestruct');};_me.__onbeforedestruct=function(){}
_me._getMenuDefinition=function(settings,callback){callback([{isdefault:true,name:'policies',icon:'none',value:'main::policies',callback:this._tabmenuCallback.bind(this)},{name:'fulltext_search',icon:'none',value:'fulltext_search::title',callback:this._tabmenuCallback.bind(this)},{name:'smartdiscover',icon:'none',value:'main::smartdiscover',callback:this._tabmenuCallback.bind(this)},{name:'certificates',icon:'none',value:'main::certificates',callback:this._tabmenuCallback.bind(this)},{name:'oauth',icon:'none',value:'main::oauth',callback:this._tabmenuCallback.bind(this)}]);}
_me._tabmenuCallback=function(name){var me=this;var parent=this._parent;if(!name){name='';}
log.info(['serversettings-tabmenucallback-name',name]);gui.frm_main.main._setHeadingButton();if(name==''){name=me._defaultTab;}
parent._clean('main_content');log.info('Menu with ID "'+name+'" selected');switch(name){case'':case"certificates":if(!parent.certificates_server){parent._create('certificates_server','obj_certificates_server','main_content');}
parent.certificates_server._load();break;case"policies":if(!parent.policies){parent._create('policies','obj_policies','main_content');}
parent.policies._load();break;case"smartdiscover":if(!parent.smartdiscover){parent._create('smartdiscover','obj_smartdiscover','main_content');}
parent.smartdiscover._load();break;case"oauth":if(!parent.oauth){parent._create('oauth','obj_oauth','main_content');}
parent.oauth._load();break;case"fulltext_search":if(!parent.oauth){parent._create('fulltext_search','obj_fulltext_search','main_content');}
parent.fulltext_search._load();break;}}
_me._hash_handler=function(){var me=this;try{me._getMenuDefinition({},function(menuDefinition){gui.frm_main.main._init({name:'server_settings',heading:{value:getLang('main::server_settings')},menu:{hashTemplate:"menu=/MENU/",items:menuDefinition}});});}catch(e){log.error([e,me]);}}

/* client/inc/obj_slider.js */
var obj_slider=(function(_super){__extends(obj_slider,_super);function obj_slider(){_super.call(this);this._settings={};var me=this;addcss(me._main,'slider');me._settings={track:me._getAnchor('track'),scrollbox:document.getElementById('gui.frm_main.main#main_content'),contentbox:me._getAnchor('content'),correction:21};me.__status=false;me._updateMeasurements();me._assignObserver();}
obj_slider.prototype._getTopDistance=function(parent,child){try{var childOffset=child.getBoundingClientRect();var parentOffset=parent.getBoundingClientRect();var distance=childOffset.top-parentOffset.top+parent.scrollTop;return distance;}
catch(e){log.error(['slider-_getTopDistance',e]);}};obj_slider.prototype._getBottomDistance=function(parent,child){try{var top=this._getTopDistance(parent,child);var childOffset=child.getBoundingClientRect();var distance=top+childOffset.height;return distance;}
catch(e){log.error(['slider-_getBottomDistance',e]);}};obj_slider.prototype._getTopFull=function(parent,child){try{var parentOffset=parent.getBoundingClientRect();var distance=parentOffset.top+this._settings.correction;return distance;}
catch(e){log.error(['slider-_getTopFull',e]);}};obj_slider.prototype._updateMeasurements=function(){try{if(!this.__status||this.__status=='top'||this.__status=='fixed'){this.__topDistance=this._getTopDistance(this._settings.scrollbox,this._settings.track);this.__bottomDistance=this._getBottomDistance(this._settings.scrollbox,this._settings.track);this.__topFull=this._getTopFull(this._settings.scrollbox,this._settings.contentbox);}
this.__scrollerHeight=this._settings.scrollbox.offsetHeight;this.__contentHeight=this._settings.contentbox.offsetHeight;}
catch(e){log.error(['slider-_updateMeasurements',e]);}};obj_slider.prototype._getFromTop=function(){try{return this.__topDistance-this._settings.scrollbox.scrollTop-this._settings.correction;}
catch(e){log.error(['slider-_getFromTop',e]);}};obj_slider.prototype._getFromBottom=function(){try{return this.__bottomDistance-this._settings.scrollbox.scrollTop-this._settings.correction-this._settings.contentbox.offsetHeight;}
catch(e){log.error(['slider-_getFromBottom',e]);}};obj_slider.prototype._assignObserver=function(){try{var me=this;if(!me._settings.scrollbox){log.error(['slider-assignobserver','scrollbox element not found']);return false;}
AttachEvent(me._settings.scrollbox,'onscroll',function(){me._refresh();});AttachEvent(window,'onresize',function(){me._refresh();});me._refresh();}
catch(e){log.error(['slider-_assignObserver',e]);}};obj_slider.prototype._value=function(template){this._draw(template,'content');this._refresh();};obj_slider.prototype._refresh=function(){try{var me=this;if(!me){return;}
me._updateMeasurements();var top=me._getFromTop();var bottom=me._getFromBottom();var tooSmallView=false;if(me.__scrollerHeight<me.__contentHeight+me._settings.correction){tooSmallView=true;}
if(top<0&&bottom>0&&me.__status!='fixed'&&!tooSmallView){me._settings.contentbox.style.top=me.__topFull+'px';me.__status='fixed';addcss(me._main,'is-fixed');removecss(me._main,'is-pinned');}
else if((top>=0&&me.__status!='top')||tooSmallView){me._settings.contentbox.style.top="auto";me.__status='top';removecss(me._main,'is-fixed');removecss(me._main,'is-pinned');}
else if(bottom<0&&me.__status!='bottom'&&!tooSmallView){me._settings.contentbox.style.top="auto";me.__status='bottom';removecss(me._main,'is-fixed');addcss(me._main,'is-pinned');}
me._settings.contentbox.style.width=me._settings.track.offsetWidth+"px";}
catch(e){log.error(['slider-refresh',e]);}};return obj_slider;}(obj_generic));

/* client/inc/obj_smartdiscover.js */
_me=obj_smartdiscover.prototype;function obj_smartdiscover(){};_me.__constructor=function(s){var me=this;storage.library('wm_smartdiscover');gui.frm_main.main._setHeadingButton('generic::save',function(){me._save();},'button text success');gui.frm_main.main._cleanHeadingButtonsAnchor();gui.frm_main.main._setAlternativeButtons(function(box,target_anchor){if(!box._alternativeButtons){box._alternativeButtons=[];}
var btn=box._create('actions','obj_button',target_anchor);btn._value('smartdiscover::set_all_to_new_domain_name');btn._addcss('text primary');if(target_anchor=='heading_buttons_mobile'){btn._addcss('full',true);}
btn._onclick=function(){me._changeAll();};box._alternativeButtons.push(btn);});this._add_destructor('__onbeforedestruct');me._settings={};me._settings.types={'*0':getLang("smartdiscover::standard"),'*1':getLang("smartdiscover::tls_ssl"),'*2':getLang("smartdiscover::no_ssl")}
me._settings.binds={'c_mail_smtp_general_hostname':'input_public_hostname','c_system_autodiscover_smtp':'input_smtp','c_system_autodiscover_pop3':'input_pop3','c_system_autodiscover_imap':'input_imap','c_system_autodiscover_xmpp':'input_xmpp','c_system_autodiscover_sip':'input_sip','c_system_autodiscover_smtptype':'dropdown_smtp','c_system_autodiscover_pop3type':'dropdown_pop3','c_system_autodiscover_imaptype':'dropdown_imap','c_system_autodiscover_xmpptype':'dropdown_xmpp','c_system_autodiscover_siptype':'dropdown_sip','c_activesync_url':'input_mobilesync','c_gw_webdavurl':'input_webdav_smartattach','c_webmail_url':'input_webclient','c_webadmin_url':'input_webadmin','c_gw_freebusyurl':'input_free_busy','c_internetcalendar_url':'input_internet_calendar','c_smsservice_url':'input_sms','c_as_spamchallengeurl':'input_anti_spam_reports','c_install_url':'input_install','c_teamchat_api_url':'input_teamchat','c_collaboration_api_url':'input_collaboration','c_conference_api_url ':'input_conference'};};_me.__onbeforedestruct=function(){}
_me._load=function(){var me=this;try
{me._draw('obj_smartdiscover');me.dropdown_smtp._fill(me._settings.types);me.dropdown_pop3._fill(me._settings.types);me.dropdown_imap._fill(me._settings.types);me.dropdown_xmpp._fill(me._settings.types);me.dropdown_sip._fill(me._settings.types);com.smartdiscover.bind(me,me._settings.binds,COM_TYPE_SERVER);}
catch(e)
{log.error([e,me]);}}
_me._save=function(){com.policies.save(this,this._settings.binds,COM_TYPE_SERVER);}
_me._changeAll=function(){var me=this;var popup=gui._create('popup','obj_popup');popup._init({name:'changeall',heading:{value:getLang('smartdiscover::set_all_to_new_domain_name')},template:'obj_smartdiscover_change_all',fixed:false,footer:'default',type:'default'});log.log(['smartdiscover-changeall',me.input_mobilesync._value()]);popup.main.input_url._value(me.input_public_hostname._value());popup.main.btn_save._onclick=function(){var url=popup.main.input_url._value();for(var key in me._settings.binds){if(me[me._settings.binds[key]]&&me[me._settings.binds[key]]._type&&me[me._settings.binds[key]]._type.substr(0,9)=='obj_input'){var old_value=me[me._settings.binds[key]]._value();var new_value=old_value.replace(/\:\/\/.*?(\/|$)/,"://"+url+'$1');if(old_value.search('://')==-1){new_value=url;}
me[me._settings.binds[key]]._value(new_value);}}
me._save();popup._close();}}

/* client/inc/obj_spamqueues.js */
_me=obj_spamqueues.prototype;function obj_spamqueues(){};_me.__constructor=function(s){var me=this;var parent=this._parent;this._menuHashTemplate='#menu=/MENU/';storage.library('wm_server');};_me._getMenuDefinition=function(settings,callback){var me=this;var menu=[];var defaultTab='';defaultTab='quarantine';menu=[{isdefault:true,name:'quarantine',icon:'none',value:'spam_queues::quarantine',callback:function(name){me._tabmenuCallback(name);}},{name:'whitelist',icon:'none',value:'spam_queues::whitelist',callback:function(name){me._tabmenuCallback(name);}},{name:'blacklist',icon:'none',value:'spam_queues::blacklist',callback:function(name){me._tabmenuCallback(name);}}];callback(menu,defaultTab);}
_me._hash_handler=function(e,aData)
{var me=this;var parent=this._parent;try
{me._getMenuDefinition({},function(menuDefinition,defaultTab){me._defaultTab=defaultTab;gui.frm_main.main._init({name:'spamqueues',heading:{value:getLang('main::spam_queues')},menu:{hashTemplate:me._menuHashTemplate,items:menuDefinition}});});}
catch(e)
{log.error([e,me]);}}
_me._tabmenuCallback=function(name)
{var me=this;var parent=this._parent;if(!name){name='';}
log.info('tabmenucallback-accountdetail');log.info(['name',name]);var parent=this._parent;gui.frm_main.main._setHeadingButton();if(name==''){name=me._defaultTab;}
parent._clean('main_content');log.info('Menu with ID "'+name+'" selected');switch(name)
{case'':case"quarantine":if(!parent.quarantine){parent._create('quarantine','obj_spamqueues_quarantine','main_content');}
parent.quarantine._load();break;case'whitelist':if(!parent.whitelist){parent._create('whitelist','obj_spamqueues_whitelist','main_content');}
parent.whitelist._load();break;case'blacklist':if(!parent.blacklist){parent._create('blacklist','obj_spamqueues_blacklist','main_content');}
parent.blacklist._load();break;}}
_me.__load_default_view=function(e,name)
{this._tabmenuCallback('');}

/* client/inc/obj_spamqueues_blacklist.js */
_me=obj_spamqueues_blacklist.prototype;function obj_spamqueues_blacklist(){};_me.__constructor=function(s){var me=this;var parent=this._parent;storage.library('wm_spamqueues');this.__actions=[{name:'delete',icon:false,onclick:function(){me._deleteSelectedItems();return false;},value:'spam_queues::action_delete'},{name:'whitelist',icon:false,onclick:function(){me._whitelistSelectedItems();return false;},value:'spam_queues::action_whitelist'}];};_me._load=function()
{var me=this;me._draw('obj_spamqueues_blackwhitelist','',{});gui.frm_main.main._setHeadingButton('generic::add',function(){me._addItem();},'button text success');me._initFilter();me._initActions();this.list._init('obj_spamqueues_blackwhitelist',false,function(linesPerPage,page,callback){var mask=gui.frm_main._getSearch(true);var sender=me.input_filter_sender._value();var owner=me.input_filter_owner._value();var domain=me.input_filter_domain._value();com.spamqueues.getBlacklist(mask,sender,owner,domain,linesPerPage,page,[function(aData){log.log(['spamques_whitelist-load',aData]);me.list._setMax(aData.count);if(aData.items[0]){for(var i=0;i<aData.items.length;i++){log.log(['spamques_whitelist-load-item',aData.items[i]]);me.list._drawItem(aData.items[i]);}}}]);});this.list._onchange=function(e){if(me.list._getSelectedCount()==0){for(var i=0;i<gui.frm_main.main._alternativeButtons.length;i++)
{gui.frm_main.main._alternativeButtons[i]._text(getLang("generic::select_action"));gui.frm_main.main._alternativeButtons[i]._disabled(true);}}else{for(var i=0;i<gui.frm_main.main._alternativeButtons.length;i++)
{gui.frm_main.main._alternativeButtons[i]._text(getLang("generic::select_action")+" ("+me.list._getSelectedCount()+")");gui.frm_main.main._alternativeButtons[i]._disabled(false);}}}}
_me._addItem=function(){var me=this;var popup=gui._create('popup','obj_popup');popup._init({name:'add',heading:{value:getLang('spam_queues::add_item')},template:'obj_spamqueues_add',fixed:false,footer:'default',type:'default'});popup.main.input_owner._value(gui._globalInfo.email);if(gui._globalInfo.admintype==USER_USER){popup.main.button_filter_domain._hide(true);popup.main.input_owner._readonly(true);}
popup.main.button_filter_domain._onclick=function(){gui.accountpicker(function(data){if(data[0]){popup.main.input_owner._value(data[0].email);}},{disable_add_domain:true});}
popup.main.btn_save._onclick=function(){if(popup.main.input_sender._value()==''){popup.main.input_sender._error(getLang("error::sender_must_be_filled"));return false;}
popup.main.btn_save._disabled(true);com.spamqueues.addBlacklist(popup.main.input_sender._value(),popup.main.input_owner._value(),function(success){popup.main.btn_save._disabled(false);if(success){gui.message.toast(getLang("message::item_saved_successfully"));popup._close();me.list._load();}else{popup.main.input_owner._error(getLang("error::save_failed"),'top');}});}}

/* client/inc/obj_spamqueues_global.js */
_me=obj_spamqueues_global.prototype;function obj_spamqueues_global(){};_me.__constructor=function(s){var me=this;var parent=this._parent;storage.library('wm_spamqueues');this.__actions=[];};_me._filter=function(){this.list._load();}
_me._initActions=function(){var me=this;if(!gui.frm_main.main.actions){gui.frm_main.main._cleanHeadingButtonsAnchor();gui.frm_main.main._setAlternativeButtons(function(box,target_anchor){if(!box._alternativeButtons){box._alternativeButtons=[];}
var actionobject=box._create('actions','obj_actionselect',target_anchor);actionobject._value('generic::select_action');if(target_anchor=='heading_buttons_mobile'){actionobject._addcss('full',true);}
actionobject._fill(me.__actions);actionobject._disabled(true);box._alternativeButtons.push(actionobject);});}}
_me._initFilter=function(){var me=this;me.button_filter_owner._onclick=function(){gui.accountpicker(function(data){log.log(['spamqueues-quarantine-load-accountpicker',data]);if(data[0]){me.input_filter_owner._value(data[0].email);me._filter();}},{disable_add_domain:true,singledomain:true});}
me.button_filter_domain._onclick=function(){gui.accountpicker(function(data){log.log(['spamqueues-quarantine-load-accountpicker',data]);if(data[0]){me.input_filter_domain._value(data[0].unpunied);me._filter();}},{domainpicker:true,singledomain:true});}
me.input_filter_sender._onsubmit=function(){me._filter();}
me.input_filter_owner._onsubmit=function(){me._filter();}
me.input_filter_domain._onsubmit=function(){me._filter();}
me.button_filter._onclick=function(){me._filter()};}
_me._deliverSelectedItems=function(){var me=this;me.__itemsToAction=me.list._getSelectedList();var go=function(){var item=me.__itemsToAction.pop();if(item){com.spamqueues.deliverItem(item.itemid,function(success,error){me._handleBooleanResponse(go,success,error,getLang("message::items_delivered_successfully"),getLang("error::items_deliver_failed"));});}}
if(me.__itemsToAction[0]){go();}}
_me._deleteSelectedItems=function(){var me=this;me.__itemsToAction=me.list._getSelectedList();var go=function(){var item=me.__itemsToAction.pop();if(item){com.spamqueues.deleteItem(item.itemid,function(success,error){me._handleBooleanResponse(go,success,error,getLang("message::items_deleted_successfully"),getLang("error::items_delete_failed"));});}}
if(me.__itemsToAction[0]){go();}}
_me._blacklistSelectedItems=function(){var me=this;me.__itemsToAction=me.list._getSelectedList();var go=function(){var item=me.__itemsToAction.pop();if(item){com.spamqueues.blacklistItem(item.itemid,function(success,error){me._handleBooleanResponse(go,success,error,getLang("message::items_blacklisted_successfully"),getLang("error::items_blacklist_failed"));});}}
if(me.__itemsToAction[0]){go();}}
_me._whitelistSelectedItems=function(){var me=this;me.__itemsToAction=me.list._getSelectedList();var go=function(){var item=me.__itemsToAction.pop();if(item){com.spamqueues.whitelistItem(item.itemid,function(success,error){me._handleBooleanResponse(go,success,error,getLang("message::items_whitelisted_successfully"),getLang("error::items_whitelist_failed"));});}}
if(me.__itemsToAction[0]){go();}}
_me._handleBooleanResponse=function(go,success,error,sSuccess,sError){var me=this;try
{if(me.__itemsToAction[0]&&success){go();}else if(!me.__itemsToAction[0]&&success){gui.message.toast(sSuccess);me.list._load();}else{if(error){gui.message.error(getLang("error::"+error));}else{gui.message.error(sError);}
me.list._load();}}
catch(e)
{log.error(['spamqueues-global-handleBooleanResponse',e]);}}

/* client/inc/obj_spamqueues_quarantine.js */
_me=obj_spamqueues_quarantine.prototype;function obj_spamqueues_quarantine(){};_me.__constructor=function(s){var me=this;var parent=this._parent;storage.library('wm_spamqueues');this.__actions=[{name:'deliver',icon:false,onclick:function(){me._deliverSelectedItems();return false;},value:'spam_queues::action_deliver'},{name:'delete',icon:false,onclick:function(){me._deleteSelectedItems();return false;},value:'spam_queues::action_delete'},{name:'blacklist',icon:false,onclick:function(){me._blacklistSelectedItems();return false;},value:'spam_queues::action_blacklist'},{name:'whitelist',icon:false,onclick:function(){me._whitelistSelectedItems();return false;},value:'spam_queues::action_whitelist'}];};_me._load=function()
{var me=this;me._draw('obj_spamqueues_quarantine','',{});me._initFilter();me._initActions();this.list._init('obj_spamqueues_quarantine',false,function(linesPerPage,page,callback){var mask=gui.frm_main._getSearch(true);var sender=me.input_filter_sender._value();var owner=me.input_filter_owner._value();var domain=me.input_filter_domain._value();com.spamqueues.getQuarantine(mask,sender,owner,domain,linesPerPage,page,[function(aData){log.log(['spamques_quarantine-load',aData]);me.list._setMax(aData.count);if(aData.items[0]){for(var i=0;i<aData.items.length;i++){log.log(['spamques_quarantine-load-item',aData.items[i]]);var line=me.list._drawItem(aData.items[i]);line.onclick=function(){var id=this._item.itemid;me._openDetail(id);}}}}]);});this.list._onchange=function(e){if(me.list._getSelectedCount()==0){for(var i=0;i<gui.frm_main.main._alternativeButtons.length;i++)
{gui.frm_main.main._alternativeButtons[i]._text(getLang("generic::select_action"));gui.frm_main.main._alternativeButtons[i]._disabled(true);}}else{for(var i=0;i<gui.frm_main.main._alternativeButtons.length;i++)
{gui.frm_main.main._alternativeButtons[i]._text(getLang("generic::select_action")+" ("+me.list._getSelectedCount()+")");gui.frm_main.main._alternativeButtons[i]._disabled(false);}}}}
_me._openDetail=function(id){var me=this;var popup=gui._create('popup','obj_popup');popup._init({name:'detail',heading:{value:getLang('spam_queues::detail')},template:'obj_spamqueues_detail',fixed:true,footer:'default',type:'default'});popup.main.btn_save._hide();popup.main.btn_cancel._value('form_buttons::close');com.spamqueues.getDetail(id,function(response){popup.main.content._value(response);})}

/* client/inc/obj_spamqueues_whitelist.js */
_me=obj_spamqueues_whitelist.prototype;function obj_spamqueues_whitelist(){};_me.__constructor=function(s){var me=this;var parent=this._parent;storage.library('wm_spamqueues');this.__actions=[{name:'delete',icon:false,onclick:function(){me._deleteSelectedItems();return false;},value:'spam_queues::action_delete'},{name:'blacklist',icon:false,onclick:function(){me._blacklistSelectedItems();return false;},value:'spam_queues::action_blacklist'}];};_me._load=function()
{var me=this;me._draw('obj_spamqueues_blackwhitelist','',{});gui.frm_main.main._setHeadingButton('generic::add',function(){me._addItem();},'button text success');me._initFilter();me._initActions();this.list._init('obj_spamqueues_blackwhitelist',false,function(linesPerPage,page,callback){var mask=gui.frm_main._getSearch(true);var sender=me.input_filter_sender._value();var owner=me.input_filter_owner._value();var domain=me.input_filter_domain._value();com.spamqueues.getWhitelist(mask,sender,owner,domain,linesPerPage,page,[function(aData){log.log(['spamques_whitelist-load',aData]);me.list._setMax(aData.count);if(aData.items[0]){for(var i=0;i<aData.items.length;i++){log.log(['spamques_whitelist-load-item',aData.items[i]]);me.list._drawItem(aData.items[i]);}}}]);});this.list._onchange=function(e){if(me.list._getSelectedCount()==0){for(var i=0;i<gui.frm_main.main._alternativeButtons.length;i++)
{gui.frm_main.main._alternativeButtons[i]._text(getLang("generic::select_action"));gui.frm_main.main._alternativeButtons[i]._disabled(true);}}else{for(var i=0;i<gui.frm_main.main._alternativeButtons.length;i++)
{gui.frm_main.main._alternativeButtons[i]._text(getLang("generic::select_action")+" ("+me.list._getSelectedCount()+")");gui.frm_main.main._alternativeButtons[i]._disabled(false);}}}}
_me._addItem=function(){var me=this;var popup=gui._create('popup','obj_popup');popup._init({name:'add',heading:{value:getLang('spam_queues::add_item')},template:'obj_spamqueues_add',fixed:false,footer:'default',type:'default'});popup.main.input_owner._value(gui._globalInfo.email);if(gui._globalInfo.admintype==USER_USER){popup.main.button_filter_domain._hide(true);popup.main.input_owner._readonly(true);}
popup.main.button_filter_domain._onclick=function(){gui.accountpicker(function(data){if(data[0]){popup.main.input_owner._value(data[0].email);}},{disable_add_domain:true});}
popup.main.btn_save._onclick=function(){if(popup.main.input_sender._value()==''){popup.main.input_sender._error(getLang("error::sender_must_be_filled"));return false;}
popup.main.btn_save._disabled(true);com.spamqueues.addWhitelist(popup.main.input_sender._value(),popup.main.input_owner._value(),function(success){popup.main.btn_save._disabled(false);if(success){gui.message.toast(getLang("message::item_saved_successfully"));popup._close();me.list._load();}else{popup.main.input_owner._error(getLang("error::save_failed"),'top');}});}}

/* client/inc/obj_subscription.js */
function obj_subscription(){};obj_subscription.prototype.__constructor=function(s){gui.frm_main.main._setHeadingButton('generic::save',function(){this._save();}.bind(this),'button text success');};obj_subscription.prototype._hash_handler=function(){var me=this;var cloudinfo=gui._globalInfo.licence.cloudinfo||{cloudplancurrency:''};this.__currency=cloudinfo.cloudplancurrency.toString()||'CZK';var cost=+cloudinfo.cloudplanprice;this._draw('obj_subscription','',{orderid:gui._globalInfo.licence.orderid,organization:gui._globalInfo.licence.organization,street:gui._globalInfo.licence.address1,region:gui._globalInfo.licence.locality,areacode:gui._globalInfo.licence.zip,country:gui._globalInfo.licence.countryname,package:cloudinfo.cloudplanname,storage:(+cloudinfo.cloudplanstorage).toComputerByteUnits(0,'MB'),cluster:cloudinfo.clusterid,hypervisor:cloudinfo.cloudhypervisor,unitprice:cost.toCurrency(this.__currency),trial:cloudinfo.cloudplanislive!=1,nextbilling:cloudinfo.creditcardchargedate,carddigits:cloudinfo.creditcarddigits,cardexpiration:cloudinfo.creditcardexpiration,salescontact:(gui._globalInfo.licence.salescontact||'').toString(),technicalcontact:(gui._globalInfo.licence.technicalcontact||'').toString(),salescontact_url:!~(gui._globalInfo.licence.salescontact||'').toString().indexOf('@'),technicalcontact_url:!~(gui._globalInfo.licence.technicalcontact||'').toString().indexOf('@'),salesphone:cloudinfo.salesphone,cloudshowprice:+cloudinfo.cloudshowprice});if(gui._globalInfo.licence.plans.length){com.licence.getTotalSaasUsage(function(result){var plans=gui._globalInfo.licence.plans.map(function(plan){var label=getLang("SUBSCRIPTION_PLANS::"+plan.planlabel);return{id:+plan.planid,icon:true,label:~label.indexOf("::")?plan.planlabel:label,users:+(result.planusagelist.filter(function(plan2){return+plan.planid===+plan2.planid;})[0]||{}).plancount||'0'};});plans.push({users:plans.reduce(function(p,c){return p+(+c.users);},0),modifier:'total'});this._create('plans','obj_plans','fb_plan_details','',{plans:plans});}.bind(this));}else{this._getAnchor('active_users').setAttribute('is-hidden','');this._getAnchor('fb_plan_details').setAttribute('is-hidden','');}
if(+cloudinfo.cloudshowprice&&+cloudinfo.cloudplanislive&&cloudinfo.nextinvoice.plans.map){var total=0;var currency;var plans=cloudinfo.nextinvoice.plans.map(function(plan){var label=getLang("SUBSCRIPTION_PLANS::"+plan.planlabel);total+=+plan.subtotal;currency=plan.currency;return{id:plan.planid,label:~label.indexOf("::")?plan.planlabel:label,users:plan.count,price:(+plan.subtotal).toCurrency(plan.currency),price_per_user:(+plan.price).toCurrency(plan.currency)};});if(cloudinfo.nextinvoice&&+cloudinfo.nextinvoice.price&&total<+cloudinfo.nextinvoice.price){total=+cloudinfo.nextinvoice.price;}
this._create('plans','obj_plans','fb_next_billing','plans--billing',{show_prices:+cloudinfo.cloudshowprice,yearly:cloudinfo.cloudplanbillingperiod.toString()!=='MONTH',plans:plans.concat({label:getLang('SUBSCRIPTION::TOTAL_PRICE')+':',price:total.toCurrency(currency),modifier:'total'})});var billing_period;var billing_period_from=new Date(cloudinfo.nextinvoice.billingfrom.toString());var billing_period_to=new Date(cloudinfo.nextinvoice.billingto.toString());if(billing_period_from.getFullYear()===billing_period_to.getFullYear()&&billing_period_from.getMonth()===billing_period_to.getMonth()){billing_period=billing_period_from.getDate()+'. - '+billing_period_to.format('d. MMMM yyyy');}else{billing_period=billing_period_from.format('d. MMMM yyyy')+' - '+billing_period_to.format('d. MMMM yyyy');}
this._getAnchor('billing_period').textContent=billing_period;}else{this._getAnchor('fb_last_invoices').setAttribute('is-hidden','');this._getAnchor('fb_last_invoices_title').setAttribute('is-hidden','');this._getAnchor('fb_next_billing').setAttribute('is-hidden','');this._getAnchor('fb_next_billing_title').setAttribute('is-hidden','');}
if(gui._globalInfo.licence.licensetype.toString()==='cloud'){this._getAnchor('support_title').setAttribute('is-hidden','');this._getAnchor('datacenter_storage_support_title').removeAttribute('is-hidden');this._getAnchor('support_topbar').removeAttribute('is-hidden');this._draw('obj_topbar','support_topbar',{groups:[{stats:[{icon:'cluster-ico',name:getLang('DASHBOARD::CLUSTER_ID'),value:cloudinfo.clusterid,span:4},{icon:'hypervisor',name:getLang('DASHBOARD::HYPERVISOR'),value:cloudinfo.cloudhypervisor,span:4}]}]});}
if(!gui._globalInfo.licence.technicalcontact.toString()&&!gui._globalInfo.licence.salescontact.toString()){this._getAnchor('support_title').setAttribute('is-hidden','');this._getAnchor('support_panel').setAttribute('is-hidden','');}
gui.frm_main.main._init({name:'subscription',heading:{value:getLang('main::subscription')}});gui.frm_main._initTopbar('subscription');gui.frm_main.main.btn_heading._hide();this.plan_details._onclick=function(){me.plan_details._disabled(true);me._openLicensePopup('plan-details',function(){me.plan_details._disabled(false);},{heading:getLang('SUBSCRIPTION::PLAN_DETAILS')});};this.subscription_settings._onclick=function(e){me.subscription_settings._disabled(true);com.licence.getLicenseManagementCallbackURL(function(callback){me._openLicensePopup('change-subscription',function(){me.subscription_settings._disabled(false);},{heading:getLang('SUBSCRIPTION::SUBSCRIPTION_SETTINGS'),callback:callback.url.toString()});});}
if(this.change_details){this.change_details._onclick=function(e){me.change_details._disabled(true);com.licence.getLicenseManagementCallbackURL(function(callback){me._openLicensePopup('change-subscription',function(){me.change_details._disabled(false);},{heading:getLang('SUBSCRIPTION::SUBSCRIPTION_SETTINGS'),callback:callback.url.toString()});});}}
if(this.show_invoice_list){this.show_invoice_list._onclick=function(){me.show_invoice_list._disabled(true);me._openLicensePopup('invoices',function(){me.show_invoice_list._disabled(false);},{heading:getLang('SUBSCRIPTION::INVOICES')});}}
this._load();}
obj_subscription.prototype._openLicensePopup=function(type,callback,options){com.licence.getLicenseManagementSecret(function(secret){options=options||{};var params={secret:secret.secret,timestamp:secret.timestamp,orderid:gui._globalInfo.licence.orderid,lang:storage.aStorage.language._ACTIVE_LANG||'en',callback:encodeURIComponent(options.callback||'')};var query=Object.keys(params).map(function(key){var value=params[key];return value?key+'='+value:false;}).filter(Boolean).join('&');var link='https://www.icewarp.com/cloud-admin/'+type+'?'+query;var popup=gui._create('popup','obj_popup');var popup_options={fixed:false,name:'iframe',heading:{value:options.heading||getLang('CHANGE_PLAN::TITLE')},iwattr:{height:options.height||'full',width:options.width||'large'},content:'obj_iframe'};popup._init(popup_options);popup.content._load(link);callback();});}
obj_subscription.prototype._load=function(){if(this.list){var cloudinfo=gui._globalInfo.licence.cloudinfo||{};this.list._empty();if(cloudinfo.lastinvoice){var item=this.list._drawItem({id:cloudinfo.lastinvoice.id,date:cloudinfo.lastinvoice.date,price:parseInt(cloudinfo.lastinvoice.price).toCurrency(cloudinfo.lastinvoice.currency),link:cloudinfo.lastinvoice.link});item.getElementsByTagName('FORM')[0].addEventListener('click',function(e){window.open(cloudinfo.lastinvoice.link,'_blank');},true);this.show_invoice_list._main.removeAttribute('is-hidden')}else{this.show_invoice_list._main.setAttribute('is-hidden','')}
if(cloudinfo.secondlastinvoice){var item=this.list._drawItem({id:cloudinfo.secondlastinvoice.id,date:cloudinfo.secondlastinvoice.date,price:parseInt(cloudinfo.secondlastinvoice.price).toCurrency(cloudinfo.lastinvoice.currency),link:cloudinfo.secondlastinvoice.link});item.getElementsByTagName('FORM')[0].addEventListener('click',function(e){window.open(cloudinfo.secondlastinvoice.link,'_blank');},true);}
if(!cloudinfo.lastinvoice&&!cloudinfo.secondlastinvoice){var item=this.list._drawItem({});var li=item.getElementsByTagName('LI');li[0].removeAttribute('is-hidden');var l=li.length;while(--l){li[l].parentNode.removeChild(li[l]);}}}}

/* client/inc/obj_tabmenu.js */
_me=obj_tabmenu.prototype;function obj_tabmenu(){};_me.__constructor=function(s){var me=this;this.__itemsSource=[];this._hashTemplate='#menu=/MENU/&account=/ACCOUNT/';var elm=mkElement('div',{"id":this._pathName+'#main'});addcss(elm,'menu-wrap');this._main.appendChild(elm);this._elm=elm;this._default=false;this._active=false;this._main.onclick=function(e){return me.__onclick(e);}
gui._changeObserver.assignTrigger(this._main);};_me._addcss=function(css){addcss(this._main,css);}
_me._removecss=function(css){removecss(this._main,css);}
_me._iwAttr=function(arr,val){if(typeof arr!='object'){n={};n[arr]=val;arr=n;}
for(var key in arr){this._main.setAttribute('iw-'+key,arr[key]);}}
_me.__hash_handler=function(e,aData){log.log(['tabmenu-hash handler',e,this]);this._active=false;this._setActive();}
_me._setHashTemplate=function(template){this._hashTemplate=template;}
_me._inactivate=function(){removecss(helper.getElementsByClassName(this._main,'active')[0],'active');this._active=false;}
_me._setActive=function(name,silent){try
{if(!name){if(location.parsed_query['tab_'+this._name]){name=location.parsed_query['tab_'+this._name];}else{name=this._default;}}
log.info(['tabmenu-setactive',this._active,name]);if(this._active!=name&&name!=''&&name!=false)
{this._active=name;var elm=helper.getElementsByClassName(this._main,'_'+name)[0];if(!elm){name=this._default;elm=helper.getElementsByClassName(this._main,'_'+name)[0];}
if(elm)
{removecss(helper.getElementsByClassName(this._main,'active')[0],'active');addcss(elm,'active');if(!silent){elm._callback(name);}}
removecss(this._main,'is-open');this._isopen=false;}}
catch(e){log.error(e);}}
_me._clean=function(){this._elm.innerHTML='';}
_me._setName=function(name){this._name=name;}
_me._removeTab=function(name){var tabs=[];var active=this._active;for(var i=0;i<this.__itemsSource.length;i++){if(name!=this.__itemsSource[i].name){tabs.push(this.__itemsSource[i]);}}
this._fill(tabs);this._setActive(active,true);}
_me._disableTab=function(name){if(this._getAnchor("tabmenu-"+name)){addcss(this._getAnchor("tabmenu-"+name),'is-disabled');this._getAnchor("tabmenu-"+name)._disabled=true;}else{log.log(["tabmenu-disabletab","name \""+name+"\" not found"]);}}
_me._enableTab=function(name){if(this._getAnchor("tabmenu-"+name)){removecss(this._getAnchor("tabmenu-"+name),'is-disabled');this._getAnchor("tabmenu-"+name)._disabled=false;}else{log.error(["tabmenu-disabletab","name \""+name+"\" not found"]);}}
_me._fill=function(items){try
{this._active=false;this._elm.innerHTML='';this.__itemsSource=items;for(var i=0;i<items.length;i++){if(!items[i].ignore)
{if(!items[i].icon&&items[i].icon!=''){items[i].icon=items[i].name;}
if(items[i].isdefault){this._default=items[i].name;if(items[i].show){gui._changeObserver.clearTrigger(this._main);this._currentlyVisible=items[i].show;}}
var box_span_icon=mkElement('span',{'className':'icon-'+(items[i].icon?items[i].icon:'none')});var box_span_value=mkElement('span',{});var box_a=mkElement('a',{'className':'menu-item _'+items[i].name+" "+(items[i].type?items[i].type:''),"id":this._pathName+'#tabmenu-'+items[i].name,"name":items[i].name});box_a.appendChild(box_span_icon);box_a.appendChild(box_span_value);box_a._valueSpan=box_span_value;box_a._value=function(value){this._valueSpan.innerHTML=value;}
if(items[i].href){box_a.href=items[i].href;box_a.target="_blank";}
if(items[i].onclick){box_a._onclick=items[i].onclick}else{box_a._onclick=function(){};};if(items[i].callback){box_a._callback=items[i].callback}else{box_a._callback=function(){};};if(items[i].isdefault){box_a._hash=this._hashTemplate;items[i]._hash=box_a._hash;}else{box_a._hash=this._hashTemplate+'&tab_'+this._name+'=/TAB/';items[i]._hash=box_a._hash;}
box_span_value.innerHTML=helper.htmlspecialchars(getLang(items[i].value));this._elm.appendChild(box_a);}}
this._tabs=items;}
catch(e)
{log.error(e);}}
_me._setItemValue=function(name,value){try
{var elm=helper.getElementsByClassName(this._main,'_'+name);if(elm&&elm[0]){elm=elm[0];elm._value(helper.htmlspecialchars(value));}}
catch(e)
{log.error(e);}}
_me.__onclick=function(e){var e=e||window.event,elm=e.target||e.srcElement;if(elm._hash||elm.parentElement._hash){if(!elm.name){elm=elm.parentElement;}
name=elm.name;if(gui.__sound_on){gui.frm_main.bubble._play(400,false,1600);}
this._go(name);}
return false;};_me._go=function(tabname){var tab=false;for(var i=0;i<this._tabs.length;i++){if(this._tabs[i].name==tabname){tab=this._tabs[i];}}
if(tab&&this._getAnchor("tabmenu-"+tabname)&&!this._getAnchor("tabmenu-"+tabname)._disabled){if(this._isopen){this._isopen=false;removecss(this._main,'is-open');}else{this._isopen=true;addcss(this._main,'is-open');}
href=tab._hash;if(tab.onclick){var ret=tab.onclick(false,tabname);this._setActive(tabname);if(ret===false){return false;}}
if(this._currentlyVisible){addcss(this._currentlyVisible,'hide');removecss(tab.show,'hide');this._parent._getAnchor('main_content').scrollTop=0;this._currentlyVisible=tab.show;this._setActive(tabname);}
else{href=href.replace(/\/tab\//gi,tabname);try
{for(var key in location.parsed_query){href=href.replace('/'+key+'/',encodeURIComponent(location.parsed_query[key])).replace('/'+key.toUpperCase()+'/',encodeURIComponent(location.parsed_query[key]));}}
catch(e){log.error(e);}
location.hash=href;}}}
_me._hide=function(){addcss(this._parent._getAnchor('tab_menu'),'hide');}
_me._show=function(){removecss(this._parent._getAnchor('tab_menu'),'hide');}

/* client/inc/obj_tabs.js */
_me=obj_tabs.prototype;function obj_tabs(){};_me.__constructor=function(){addcss(this._main,'tabs');this.__items={};for(var key in this.__attributes){if(key.substr(0,3)=='iw-'){this._main.setAttribute(key,this.__attributes[key]);}}};_me.__createItem=function(id,label,content,templateData){try
{if(!templateData){templateData={};}
var template=false;if(content&&content.substr(content.length-4,4)=='.tpl'){template=content;}
var oInput=mkElement('input',{id:this._pathName+'#_'+id,className:"tabs-radio",type:"radio",name:'group_'+this._name});var oLabel=mkElement('label',{className:'tabs-label','for':this._pathName+'#_'+id});oLabel.innerHTML=helper.htmlspecialchars(label);var oDiv=mkElement('div',{id:this._pathName+'#content_'+id,className:'tabs-content'});this._main.appendChild(oInput);this._main.appendChild(oLabel);this._main.appendChild(oDiv);if(template){this._draw(template.substr(0,template.length-4),'content_'+id,templateData);}else if(content){oDiv.innerHTML=helper.htmlspecialchars(content);}
this.__items[id]={id:id,label:label,content:content,template:template,templateData:templateData,oContent:oDiv,oLabel:oLabel,oRadio:oInput,contentAnchor:'content_'+id};if(helper.associativeArrayLength(this.__items)==1){oInput.checked=true;}
log.log(['tabs-createitem',this.__items[id]]);return this.__items[id];}
catch(e)
{log.error(e);}}
_me._template=function(id,template){this._draw(template,this._getTab(id).contentAnchor);}
_me._content=function(id,content){this.__items[id].oContent.innerHTML=helper.htmlspecialchars(content);}
_me._label=function(id,label){this.__items[id].oLabel.innerHTML=helper.htmlspecialchars(label);}
_me._getTab=function(id){return this.__items[id];}
_me._fill=function(aData){for(var i=0;i<aData.length;i++){this.__createItem(aData[i].id,aData[i].label,(aData[i].template?aData[i].template:aData[i].content));}}
_me._show=function(agent){this._main.style.display='';this._ishidden=false;};_me._hide=function(agent){this._main.style.display='none';this._ishidden=true;};

/* client/inc/obj_textarea.js */
_me=obj_textarea.prototype;function obj_textarea(){};_me.__constructor=function(){storage.library("markdown");var elm=mkElement('textarea',{"name":this._pathName+'#main',"id":this._pathName+'#main'});this._main.appendChild(elm);this._initialValue='';this.__eIN=elm.form[elm.name];this._elm=elm;var me=this;if(this.__attributes.markdown&&(this.__attributes.markdown=="true"||this.__attributes.markdown=="1")){this._markdown(true);}
this.__eIN.onfocus=function(e){var e=e||window.event;me.__hasFocus=true;if(me._onfocus)me._onfocus(e);me.__exeEvent('onfocus',e,{"owner":me});log.log('Element "'+this.id+'" focused');addcss(me._main,'focus');return true;};this.__eIN.onblur=function(e){var e=e||window.event;me.__hasFocus=false;if(me._onblur&&me._onblur(e)===false)return false;me.__exeEvent('onblur',e,{"owner":me});log.log('Element "'+this.id+'" blured');removecss(me._main,'focus');return true;};this._main.oncontextmenu=function(e){var e=e||window.event,elm=e.target||e.srcElement;if(me._oncontext&&me._oncontext(e)!==false)
me.__exeEvent('oncontext',e,{"owner":me});};this._main.onkeydown=function(e){var e=e||window.event;if(!me._disabled()&&me._onkeypress)
me._onkeypress(e);return true;};this._main.onkeyup=function(e){var e=e||window.event;if(!me._disabled()&&me._onkeyup)
me._onkeyup(e);return true;};};_me._disabled=function(sDisabled){if(sDisabled&&typeof sDisabled=='object'){this._disablealso_ids=sDisabled;}
if(this._disablealso_ids)
{var ids=this._disablealso_ids;for(var i=0;i<ids.length;i++){if(this._parent[ids[i]]){if(this._parent[ids[i]]._disabled){this._parent[ids[i]]._disabled(true);}}else if(this._parent._getAnchor(ids[i])){if(sDisabled){addcss(this._parent._getAnchor(ids[i]),'is-disabled');}else{removecss(this._parent._getAnchor(ids[i]),'is-disabled');}}}}
if(sDisabled){addcss(this._main,'is-disabled');}else{removecss(this._main,'is-disabled');}
return this._elm.disabled=sDisabled;};_me._readonly=function(sDisabled){if(typeof sDisabled!='undefined'){if(sDisabled)
{addcss(this._main,'is-readonly');this._elm.setAttribute('readonly',1)}
else
{this._elm.removeAttribute('readonly')
removecss(this._main,'is-readonly');}}
return this._main.hasAttribute('readonly');};_me._copyToClipboard=function(){this.__eIN.select();document.execCommand('Copy');}
_me._placeholder=function(sPlaceholder){return this.__eIN.placeholder=sPlaceholder?getLang(sPlaceholder):this.__eIN.placeholder;};_me._label=function(sLabel,translated){if(sLabel)
{if(!translated){sLabel=getLang(sLabel);}
if(!this._labelSet)
{addcss(this._main,'inner-label');var ch=mkElement('label',{});ch.innerHTML=helper.htmlspecialchars(sLabel);addcss(ch,'label');this._labelSet=ch;return this._main.appendChild(ch);}
else
{this._labelSet.innerHTML=helper.htmlspecialchars(sLabel);}}
else
{if(this._labelSet)
{this._main.removeChild(this._labelSet);this._labelSet=false;}}
return true;};_me._title=function(sValue){if(Is.String(sValue))
this.__eIN.title=(sValue.indexOf('::')!=-1?getLang(sValue):sValue);else
return this.__eIN.title||'';};_me._value=function(sValue,donotclear){if(typeof sValue!='undefined')
{if(this._markdownEnabled){sValue=markdown.decode(sValue);}
this.__eIN.value=sValue;this._changed((donotclear?false:true));if(this._onchange){this._onchange();}}
if(this._markdownEnabled){return markdown.encode(this.__eIN.value);}
return this.__eIN.value;};_me._toggle=function(agent){if(this._ishidden){this._show(agent);}else{this._hide(agent);}}
_me._show=function(agent){this._main.style.display='';this._ishidden=false;};_me._hide=function(agent){this._main.style.display='none';this._ishidden=true;};_me._changed=function(clear){if(clear){this._initialValue=this._value();}
return this._initialValue!=this._value();}
_me._markdown=function(enable){var me=this;if(enable!==void 0){me._markdownEnabled=enable;}
return(me._markdownEnabled?true:false)}

/* client/inc/obj_title.js */
_me=obj_title.prototype;function obj_title(){};_me.__constructor=function(){this.__buffer=[[document.title]];this._add_destructor('__destructor');gui._obeyEvent('blur',[this,'_reset']);};_me._add=function(sTitle,iTime,bForce){if(iTime){var id=unique_id();document.title=sTitle;this.__buffer.push([sTitle,id,iTime,setTimeout('try{'+this._pathName+'._remove('+id+','+(bForce?'true':'false')+');}catch(r){}',iTime*1000)]);return id;}
else{this.__buffer[0]=[sTitle];if(this.__buffer.length==1)
document.title=sTitle;return 0;}};_me._reset=function(){if(this.__buffer[0]){this.__buffer=this.__buffer.splice(0,1);this._refresh();}};_me._remove=function(id,bForce){if(typeof id!='undefined')
for(var i=1;i<this.__buffer.length;i++)
if(this.__buffer[i][1]==id){clearTimeout(this.__buffer[i][3]);if(bForce||gui.__focus)
this.__buffer.splice(i,1);else
this.__buffer[i][3]=setTimeout('try{'+this._pathName+'._remove('+id+');}catch(r){}',(this.__buffer[i][2])*1000);break;}
this._refresh();};_me._refresh=function(){document.title=this.__buffer[this.__buffer.length-1][0];};_me.__destructor=function(){gui._disobeyEvent('blur',[this,'_reset']);document.title=this.__buffer[0][0];};

/* client/inc/obj_toggle.js */
_me=obj_toggle.prototype;function obj_toggle(){};_me.__constructor=function(){var me=this;me.__negated=false;this._draw('obj_toggle','',{name:this._pathName+'#main'});for(var key in this.__attributes){if(key.substr(0,3)=='iw-'){this._main.setAttribute(key,this.__attributes[key]);}}
this._toggleTarget=false;this._initialValue=false;this._elm=this._getAnchor('input');this._visual=this._getAnchor('visual');this._dependentFields=[];me._elm.onblur=function(){me._blurTimeout=setTimeout(function(){log.log(['toggle-construct','blurred',me._onblur]);if(me._onblur){me._onblur();}},100);};me._elm.onfocus=function(){if(me._onfocus){me._onfocus();}};this._visual.onmousedown=this._elm.onmousedown=function(){if(me._elm.focus){if(me._blurTimeout){clearTimeout(me._blurTimeout);}
return false;}}
this._visual.onclick=function(e){if(gui.__sound_on){gui.frm_main.impact3._play(false,150);}
var e=e||window.event,elm=e.target||e.srcElement;if(!me._disabled()){me._elm.checked=!me._elm.checked;log.log(['toggle-onclick','2']);var checked=me._checked();if(me.__changed){me.__changed(checked);}
me._doTheToggle();me._dependentFieldsAccess(checked);log.log(['toggle-onclick','onchange']);if(me._onchangeLocal){me._onchangeLocal(checked);}
if(me._onclick){me._onclick(e);}
me._elm.focus();}
return false;};this._elm.onchange=function(){log.log(['toggle-onclick','onchange']);var checked=me._checked();if(me.__changed){me.__changed(checked);}
me._doTheToggle();me._dependentFieldsAccess(checked);if(me._onchangeLocal){me._onchangeLocal(checked);}}
this._elm.onfocus=function(e){var e=e||window.event;me.__hasFocus=true;if(me._onfocus)me._onfocus(e);me.__exeEvent('onfocus',e,{"owner":me});log.log('Element "'+this.id+'" focused');addcss(me._main,'focus');return true;};this._elm.onblur=function(e){var e=e||window.event;me.__hasFocus=false;if(me._onblur&&me._onblur(e)===false)return false;me.__exeEvent('onblur',e,{"owner":me});log.log('Element "'+this.id+'" blured');removecss(me._main,'focus');return true;};this._main.oncontextmenu=function(e){var e=e||window.event,elm=e.target||e.srcElement;if(me._oncontext&&me._oncontext(e)!==false)
me.__exeEvent('oncontext',e,{"owner":me});};this._main.onkeydown=function(e){var e=e||window.event;if(!me._disabled()&&me._onkeypress)
me._onkeypress(e);return true;};};_me._enables=function(sAnchors){this._dependentFields=sAnchors.replace(/ /g,'').split(',');this._dependentFieldsAccess(this._checked());}
_me._toggle=function(sToggle){this._toggleTarget=sToggle;}
_me._disabled=function(sDisabled){if(sDisabled&&typeof sDisabled=='object'){this._disablealso_ids=sDisabled;}
if(this._disablealso_ids)
{var ids=this._disablealso_ids;for(var i=0;i<ids.length;i++){if(this._parent[ids[i]]){if(this._parent[ids[i]]._disabled){this._parent[ids[i]]._disabled(true);}}else if(this._parent._getAnchor(ids[i])){if(sDisabled){addcss(this._parent._getAnchor(ids[i]),'is-disabled');}else{removecss(this._parent._getAnchor(ids[i]),'is-disabled');}}}}
if(typeof sDisabled!='undefined'&&!this._readonly())
{if(sDisabled){addcss(this._main,'is-disabled');}else{removecss(this._main,'is-disabled');}
this._elm.disabled=sDisabled;}
return this._elm.disabled;};_me._negated=function(negated){if(typeof negated!='undefined'){var checked=this._checked();this.__negated=negated;if(negated!=checked){this._checked(checked);}}
return this.__negated}
_me._value=function(sValue){if(typeof sValue!='undefined'){this._changed(true);return this._elm.__value=sValue;}else{if(this._elm.__value){return this._elm.__value;}else{return(this._checked()?1:0);}}};_me._setValue=function(apiprop,ignore_onchange){var me=this;this.__apivalue=apiprop;this._checked(apiprop.inversed?apiprop.value!=1:apiprop.value==1,ignore_onchange===void 0?true:ignore_onchange);if(apiprop.readonly){this._readonly(true);}
if(apiprop.denied){this._main.setAttribute('is-hidden','1');}}
_me._label=function(text,toToggleWith_checked){var me=this;if(toToggleWith_checked){log.log(['toggle-label-defined']);this.__changed=function(state){log.log(['toggle-label',state]);me._label((state?toToggleWith_checked:text));}
this.__changed(this._checked());}else{if(text.search('::')>0){text=getLang(text);}
me._getAnchor('label').setAttribute('title',text);me._getAnchor('label').innerHTML=helper.htmlspecialchars(text);me._getAnchor('label').removeAttribute('is-hidden');}};_me._placeholder=function(sPlaceholder){return this._elm.placeholder=sPlaceholder?getLang(sPlaceholder):this._elm.placeholder;};_me._title=function(sValue){if(Is.String(sValue))
this._elm.title=(sValue.indexOf('::')!=-1?getLang(sValue):sValue);else
return this._elm.title||'';};_me._dependentFieldsAccess=function(checked){var i=this._dependentFields.length;while(i--){var obj=this._parent[this._dependentFields[i]];obj&&obj._disabled&&obj._disabled(!checked);}}
_me._doTheToggle=function(){if(this._toggleTarget){if(this._parent[this._toggleTarget]&&this._parent[this._toggleTarget]._toggle){this._parent[this._toggleTarget]._toggle(this);}else{var elm=false;if(this._parent[this._toggleTarget]){elm=this._parent[this._toggleTarget]._main;}else if(this._parent._getAnchor(this._toggleTarget)){elm=this._parent._getAnchor(this._toggleTarget);}else if(document.getElementById(this._toggleTarget)){elm=document.getElementById(this._toggleTarget);}
if(elm){if(elm.getAttribute('is-hidden')){elm.removeAttribute('is-hidden');}else{elm.setAttribute('is-hidden',1);}}}}}
_me._onclick=function(e){}
_me._readonly=function(bReadonly){if(typeof bReadonly!='undefined')
{if(bReadonly){this._disabled(true);addcss(this._main,'is-readonly');this._elm.setAttribute('readonly','readonly');}else{removecss(this._main,'is-readonly');this._elm.removeAttribute('readonly');this._disabled(false);}}
return this._elm.hasAttribute('readonly');};_me._checked=function(checked,ignore_onchange){if(typeof checked!='undefined'&&this.__negated){checked=!checked;}
if(typeof checked!='undefined'){if(this.__changed){this.__changed(checked);}
if((checked&&!this._elm.checked)||(!checked&&this._elm.checked)){this._doTheToggle();this._dependentFieldsAccess(checked);}
this._elm.checked=checked;this._changed(true);if(!ignore_onchange&&this._onchangeLocal){this._onchangeLocal(this._checked());}}else{if(this.__negated){return!this._elm.checked;}else{return this._elm.checked;}}};_me._onchangeLocal=function(v){if(this.__apivalue&&!this.__apivalue.readonly){var checked=this._checked();if(this.__apivalue.inversed){checked=!checked;}
this.__apivalue.value=checked?1:0;}
this._onchange(v);this._triggerLocalObey('_onchange',[v]);}
_me._onchange=function(){}
_me._hide=function(status){if(status){addcss(this._main,'hide');}else{removecss(this._main,'hide');}}
_me._changed=function(clear){if(clear){this._initialValue=this._checked();}
return this._initialValue!=this._checked();}

/* client/inc/obj_topbar.js */
function obj_topbar(){};obj_topbar.prototype.__constructor=function(type){if(this['_setup_'+type]){this['_setup_'+type].call(this,function(groups){this._draw('obj_topbar','',{groups:groups});groups.forEach(function(group){group.stats.forEach(function(stat){if(stat.button){this[stat.button.name]._onclick=stat.button.onclick;}},this);},this);this._main.setAttribute('iw-type','stats');}.bind(this))}else{this._destruct();}};obj_topbar.prototype._setup_subscription=function(callback){this._getTrafficInfo(function(trafficInfo){var cloudinfo=gui._globalInfo.licence.cloudinfo||{};callback([{stats:[+cloudinfo.cloudplanislive&&+cloudinfo.cloudshowprice&&{icon:'resources',name:getLang('DASHBOARD::NEXT_BILLING'),class:'u-normal-line-height',value:cloudinfo.creditcardchargedate},{icon:'collaboration',name:getLang('DASHBOARD::ACTIVE_USERS'),value:trafficInfo.statistics_activeusers},+cloudinfo.cloudshowprice&&{icon:'price-2',name:getLang('DASHBOARD::PRICE_USER_MONTH'),class:'u-normal-line-height',value:+cloudinfo.cloudplanislive?(+cloudinfo.nextinvoice.price).toCurrency(cloudinfo.nextinvoice.currency.toString()):getLang('SUBSCRIPTION::FREE')},gui._globalInfo.licence.licensetype=='cloud'&&{icon:'storage',name:getLang('DASHBOARD::STORAGE'),value:(+trafficInfo.statistics_usedspace).toComputerByteUnits(1)}].filter(Boolean)}]);});};obj_topbar.prototype._setup_dashboard=function(callback){this._getTrafficInfo(function(trafficInfo,saasusage){var groups;if(+gui._globalInfo.licence.iscloud){return callback(this._setup_dashboard_cloud(trafficInfo,saasusage));}else if(gui._globalInfo.licence.plans.length){groups=this._setup_dashboard_cloud(trafficInfo,saasusage);groups[1].stats[0].span=4;groups[1].stats.splice(1,1);return callback(groups);}
return callback(this._setup_dashboard_standard(trafficInfo));}.bind(this));};obj_topbar.prototype._setup_dashboard_cloud=function(trafficInfo,saasusage){var groups=[{stats:[]},{modifier:'faded',stats:[]}];var active_users_span=8-(gui._globalInfo.licence.plans.length||0);if(active_users_span>4){active_users_span=4;}
if(active_users_span<2){active_users_span=2;}
groups[0].stats.push({icon:'collaboration',name:getLang('DASHBOARD::ACTIVE_USERS'),value:trafficInfo.statistics_activeusers,span:active_users_span,button:{label:'subscription::manage_subscription',name:'manage_subscription',onclick:function(){location.hash="menu=subscription";}.bind(this)}});gui._globalInfo.licence.plans.forEach&&gui._globalInfo.licence.plans.forEach(function(plan,i){if(i>5){return;}
var label=getLang("SUBSCRIPTION_PLANS::"+plan.planlabel);groups[0].stats.push({icon:'plan',name:getLang('SUBSCRIPTION::NUMBER_OF_USERS'),value:~label.indexOf("::")?plan.planlabel:label,count:+(saasusage.filter(function(plan2){return+plan.planid===+plan2.planid;})[0]||{}).plancount||'0',class:'column reverse highlighted',span:1,modifier:'plan'})});groups[1].stats=[{icon:'storage',name:getLang('DASHBOARD::STORAGE'),value:(+trafficInfo.statistics_usedspace).toComputerByteUnits(1),span:2},{icon:'cluster-ico',name:getLang('DASHBOARD::CLUSTER_ID'),value:gui._globalInfo.licence.cloudinfo&&gui._globalInfo.licence.cloudinfo.clusterid,class:'column highlighted',span:2},{icon:'sent',name:getLang('DASHBOARD::MAIL_SENT'),value:trafficInfo.statistics_mailsent,suffix:'mail_sent_period',span:2},{icon:'email',name:getLang('DASHBOARD::MAIL_RECEIVED'),value:trafficInfo.statistics_mailreceived,suffix:'mail_received_period',span:2}];return groups;};obj_topbar.prototype._setup_dashboard_standard=function(trafficInfo){return[{stats:[{icon:'collaboration',name:getLang('DASHBOARD::ACTIVE_USERS'),value:trafficInfo.statistics_activeusers,span:2},{icon:'storage',name:getLang('DASHBOARD::STORAGE'),value:(+trafficInfo.statistics_usedspace).toComputerByteUnits(1),span:2},{icon:'sent',name:getLang('DASHBOARD::MAIL_SENT'),value:trafficInfo.statistics_mailsent,suffix:'mail_sent_period',span:2},{icon:'email',name:getLang('DASHBOARD::MAIL_RECEIVED'),value:trafficInfo.statistics_mailreceived,suffix:'mail_received_period',span:2}]}];};obj_topbar.prototype._getTrafficInfo=function(callback){com.server.trafficInfo(function(trafficInfo){com.licence.getTotalSaasUsage(function(saasUsage){var cloudInfo=gui._globalInfo.licence.cloudinfo;if(cloudInfo&&gui._globalInfo.licence.iscloud==1){var cost=cloudInfo.cloudplanprice*trafficInfo.statistics_activeusers;var mincost=+(cloudInfo.cloudplanminprice||0);if(cost<mincost){cost=mincost;}
trafficInfo.price=cost.toCurrency(cloudInfo.cloudplancurrency.toString()||'CZK');}
callback(trafficInfo,saasUsage.planusagelist)});});};

/* client/inc/obj_topbar_trial.js */
function obj_topbar_trial(){};obj_topbar_trial.prototype.__constructor=function(){this._draw('obj_topbar_trial','',{end:(gui._globalInfo.licence.cloudinfo&&gui._globalInfo.licence.cloudinfo.creditcardchargedate)||''});this._main.setAttribute('iw-type','trial');this.upgrade_from_trial._onclick=function(){com.licence.getLicenseManagementCallbackURL(function(callback){obj_subscription.prototype._openLicensePopup('change-subscription',function(){location.hash="menu=subscription";},{heading:getLang('SUBSCRIPTION::SUBSCRIPTION_SETTINGS'),callback:callback.url.toString()});});}.bind(this);};

/* client/inc/obj_upload.js */
_me=obj_upload.prototype;function obj_upload(){};_me.__constructor=function(){var elm=this._main;this.__eIN=elm.getElementsByTagName('input')[0];this._elm=elm;elm.enctype="multipart/form-data";elm.method="post";this.__eUpl=this._main.appendChild(mkElement('input',{type:'file',name:this._name,multiple:'multiple',style:'display:none'}));var me=this;this.__eIN.onclick=this._main.onclick=function(e){var elm=e.target;if(!me._disabled()){if(elm==me._main)
me._focus();if(me._onclick)
me._onclick(e);}
me.__eUpl.click();e.stopPropagation();};this.__eIN.onfocus=function(e){me.__hasFocus=true;if(me._onfocus)me._onfocus(e);me.__exeEvent('onfocus',e,{"owner":me});addcss(me._main,'focus');return true;};this.__eIN.onblur=function(e){me.__hasFocus=false;if(me._onblur&&me._onblur(e)===false)return false;me.__exeEvent('onblur',e,{"owner":me});removecss(me._main,'focus');return true;};this._main.oncontextmenu=function(e){var elm=e.target;if(me._oncontext&&me._oncontext(e)!==false)
me.__exeEvent('oncontext',e,{"owner":me});};this._main.onkeydown=function(e){if(!me._disabled()&&me._onkeypress)
me._onkeypress(e);return true;};this.__allow=false;this.__file={content:''}
this._title("GENERIC::UPLOAD");this.__eUpl.addEventListener('change',function(e){if(this.files[0]){me.__parseFiles(this.files);}});};_me._imagesOnly=function(){this.__mimesTypesAllowed={'image/gif':true,'image/jpeg':true,'image/png':true};}
_me._mimetypes=function(types){if(!this.__mimesTypesAllowed){this.__mimesTypesAllowed={};}
if(types instanceof Array){var i=types.length;while(i--){this.__mimesTypesAllowed[types[i]]=true;}}
return this.__mimesTypesAllowed;}
_me._extensions=function(extensions){if(!this.__extensionsAllowed){this.__extensionsAllowed={};}
if(extensions instanceof Array){var i=extensions.length;while(i--){this.__extensionsAllowed[extensions[i]]=true;}}
this.__eUpl.setAttribute('accept',extensions.map(function(extension){return'.'+extension;}).join(','));return this.__extensionsAllowed;}
_me._displayElement=function(elm){if(elm==undefined){return this.__displayElement;}else{this.__displayElement=elm;}}
_me._droparea=function(elm){var me=this;function preventDefault(e){e.preventDefault();}
elm.addEventListener('dragover',preventDefault,false);elm.addEventListener('dragenter',preventDefault,false);elm.addEventListener('drop',function(e){var files=e.dataTransfer.files;me.__parseFiles(files);e.preventDefault();},false);}
_me.__parseFiles=function(files){var me=this;var file=files[0];var reader=new FileReader();var upload={name:file.name,type:file.type,size:file.size}
if(file.name.indexOf('.')!=-1){upload.extension=file.name.substr(file.name.lastIndexOf('.')+1);}
reader.addEventListener("load",function(){upload.content=reader.result;me.__file=upload;if(me.__mimesTypesAllowed){if(!(upload.type in me.__mimesTypesAllowed)&&!me.__mimesTypesAllowed[upload.type]){me._onmimetypeerror&&me._onmimetypeerror(upload.type);return false;}}
if(me.__extensionsAllowed){if(!(upload.extension in me.__extensionsAllowed)&&!me.__extensionsAllowed[upload.extension]){me._onextensionerror&&me._onextensionerror(upload.extension);return false;}}
if(me.__apivalue){if(me.__apivalue.value===null){me.__apivalue=me.__apivalue.changeType('Image');}
me.__apivalue.contenttype.value=upload.type;me.__apivalue.base64data.value=upload.content.split("base64,")[1];if(me.__displayElement){me.__displayElement.style.backgroundImage='url('+upload.content+')';}}
me._onfile&&me._onfile(upload);},false);reader.readAsDataURL(file);}
_me._title=function(sValue){if(sValue==undefined){return this.__eIN.value;}else{this.__eIN.value=sValue.indexOf('::')!=-1?getLang(sValue):sValue;}};_me._value=function(base64image,imagetype){if(base64image&&imagetype){this.__file.content="data:"+imagetype+';base64,'+base64image;}else{return this.__file.content;}};_me._setValue=function(imgprop){this.__apivalue=imgprop;if(this.__displayElement&&!imgprop.denied&&imgprop.contenttype&&imgprop.base64data){this.__displayElement.style.backgroundImage="url(data:"+imgprop.contenttype+';base64,'+imgprop.base64data+")";}
if(imgprop.readonly){this._readonly(true);}
if(imgprop.denied){this._main.setAttribute('is-hidden','1');}}
_me._reset=function(){this.__file={content:''}}
_me._info=function(){}
_me._file=function(){}
_me._files=function(){}

/* client/inc/obj_userlist.js */
function obj_userlist(){};var _me=obj_userlist.prototype;_me.__constructor=function(s){var me=this;storage.library('wm_domain');storage.library('wm_user');storage.library('obj_accountpicker');me.page=0;me.max_count=0;me.loading=false;me.accounttypes={'-':getLang('accountdetail::all_types'),'*0':getLang('userlist::user'),'*1':getLang('userlist::mailing_list'),'*7':getLang('userlist::group'),'*8':getLang('userlist::resource')};me.admintypes={'0':getLang('userlist::user'),'1':getLang('userlist::admin'),'2':getLang('userlist::domain_admin'),'3':getLang('userlist::webadmin')}
if(!gui.frm_main.main.actions){gui.frm_main.main._cleanHeadingButtonsAnchor();gui.frm_main.main._setAlternativeButtons(function(box,target_anchor){if(!box._alternativeButtons){box._alternativeButtons=[];}
var actionobject=box._create('actions','obj_actionselect',target_anchor);actionobject._value('generic::select_action');if(target_anchor=='heading_buttons_mobile'){actionobject._addcss('full',true);}
var options=[];if(location.parsed_query.tab_management!="guestaccounts"){options.push({name:'group',icon:false,onclick:function(){me._groupSelectedAccounts();return false;},value:'accountdetail::add_to_group'},{name:'move',icon:false,onclick:function(){me._showMoveDialog();return false;},value:'accountdetail::move'});}
options.push({name:'delete',icon:false,onclick:function(){me._deleteSelectedAccounts();return false;},value:'accountdetail::delete'});actionobject._fill(options);actionobject._disabled(true);box._alternativeButtons.push(actionobject);});}};_me._onSearch=function(string){dataSet.add('accountlist-filter',['search-'+location.parsed_query.domain],string);this.list._empty();this.list._load();}
_me._load=function(settings)
{var me=this;gui.frm_main._initSearch(function(string){me._onSearch(string);});this._draw('obj_userlist'+(settings&&settings.subTemplate?"_"+settings.subTemplate:""),'',{items:{}});if(settings){if(settings.domain){location.parsed_query.domain=settings.domain;}}
if(location.parsed_query.showdomaininfo){me._parent.domaindetail._DNSValidation();}
if(this.list.dropdown_userlist_filter){this.list.dropdown_userlist_filter._fill(me.accounttypes);this.list.dropdown_userlist_filter._value('0');this.list.dropdown_userlist_filter._onchange=function(e){var val=this._value();dataSet.add('accountlist-filter',['type-'+location.parsed_query.domain],val);me.list._emptySelectedList();me.list._empty();me.list._load();};}
this.list._onchange=function(e){try
{if(e&&e.text=='select-all'){this._selectAll(e.type,true,true);}
if(me.list._getSelectedCount()==0){for(var i=0;i<gui.frm_main.main._alternativeButtons.length;i++)
{gui.frm_main.main._alternativeButtons[i]._text(getLang("generic::select_action"));gui.frm_main.main._alternativeButtons[i]._disabled(true);}}else{for(var i=0;i<gui.frm_main.main._alternativeButtons.length;i++)
{gui.frm_main.main._alternativeButtons[i]._text(getLang("generic::select_action")+" ("+me.list._getSelectedCount()+")");gui.frm_main.main._alternativeButtons[i]._disabled(false);}}
if(e&&e.text=='select-all'){return false;}}
catch(err){log.error(['userlist-onchange',e,err]);}}
var filter_type=dataSet.get('accountlist-filter',['type-'+location.parsed_query.domain]);if(typeof filter_type!='undefined'){if(me.list.dropdown_userlist_filter){me.list.dropdown_userlist_filter._value(filter_type,true);}}
var filter_search=dataSet.get('accountlist-filter',['search-'+location.parsed_query.domain]);if(filter_search){log.log(['accountlist-constructor',filter_search]);gui.frm_main._setSearchString(filter_search);}
var domain=new Domain(location.parsed_query.domain);var list=domain.getAccountList({type:Account.USER});this.list._init('obj_userlist',false,function(linesPerPage,page,callback){var search=gui.frm_main._getSearch(true);list.filter(search);var type=me.list.dropdown_userlist_filter;if(!type){type=0;}else if(type._value()!='-'){type=type._value();}else{type=undefined;}
list.type(type);list.load(function(items){gui.frm_main._setSearchResults(items.total);me.list._setMax(items.total);gui.frm_main.main.left_menu._setItemValue('userlist',getLang('domaindetail::users')+' ('+items.total+')');for(var i=0,l=items.length;i<l;i++){var size=+items[i].quota.mailboxsize.value;var max=+items[i].quota.mailboxquota.value;var item={id:items[i].email.value,name:items[i].name.value,unpunied:punycode.ToUnicode(items[i].email.value),image:items[i].image?'data:'+items[i].image.contenttype.value+';base64,'+items[i].image.base64data.value:'',type:items[i].accounttype.value,type_str:me.accounttypes['*'+items[i].accounttype.value],hasSubtype:items[i].accounttype.value==0,subtype:items[i].admintype.value||0,subtype_str:me.admintypes[items[i].admintype.value||0],size:relativeByteSize(size,2,1),disabled:+((items[i].accountstate||{}).state||{}).value};if(max){item.isQuota=true;item.quota=(size/max*100).toFixed(2);item.quotaSize=relativeByteSize(max,2,1);}
me.list._drawItem(item);}
callback&&callback();},{chunk:linesPerPage});});this.list._onempty=function(){list.reset();};this._main.onclick=function(e){var e=e||window.event,elm=e.target||e.srcElement;if(elm)
{var ul=Is.Child(elm,'UL',this);if(ul&&ul.getAttribute('hash')){location.hash=ul.getAttribute('hash');}}};}
_me._groupSelectedAccounts=function(){var me=this;gui.accountpicker(function(items,type){var groups=[];for(var i=0;i<items.length;i++){groups.push(items[i].id);}
var accounts=[];var selected=me.list._getSelectedList();if(typeof selected=='string'&&selected=='all')
{log.info('All is selected');var namemask=gui.frm_main._getSearch(true);var typemask=false;var type=0;if(me.list.dropdown_userlist_filter){type=me.list.dropdown_userlist_filter._value();}
if(type!='-'){typemask=type;}
com.user.addAllToGroup(groups,location.parsed_query.domain,{namemask:namemask,typemask:typemask},function(result){if(!result.Array.IQ[0].QUERY[0].RESULT||result.Array.IQ[0].QUERY[0].RESULT[0].VALUE==0){gui.message.error(getLang("error::save_unsuccessful"));if(result.Array.IQ[0].QUERY[0].ERROR){log.error('e:cannot_add_member_to_itself',result.Array.IQ[0].QUERY[0].ERROR);}}else{gui.message.toast(getLang("message::save_successfull"));me.list._emptySelectedList();}});}
else
{for(var i=0;i<selected.length;i++){accounts.push(selected[i].id);}
com.user.addToGroup(groups,accounts,function(result){if(!result.Array.IQ[0].QUERY[0].RESULT||result.Array.IQ[0].QUERY[0].RESULT[0].VALUE==0){gui.message.error(getLang("error::save_unsuccessful"));if(result.Array.IQ[0].QUERY[0].ERROR){log.error('e:cannot_add_member_to_itself',result.Array.IQ[0].QUERY[0].ERROR);}}else{gui.message.toast(getLang("message::save_successfull"));me.list._emptySelectedList();}});}},{type:{force:true,value:7},disable_add_domain:true});}
_me._showMoveDialog=function(){var me=this;gui.accountpicker(function(items,type){var domain=items[0].id;var selected=me.list._getSelectedList();var accounts=[];for(var i=0;i<selected.length;i++){accounts.push(selected[i].email||selected[i].id);}
gui.message.warning(getLang("warning::move_selected_accounts",[selected.length,domain]),false,[{value:getLang("accountdetail::move"),onclick:function(closeCallback){closeCallback();me._moveUser(domain,accounts);}},{value:getLang("generic::cancel"),type:'text borderless',onclick:function(closeCallback){closeCallback();me._showMoveDialog();}}]);},{domainpicker:true,singledomain:true,disable_add_domain:true,exclude:{domains:[location.parsed_query.domain]}});};_me._moveUser=function(domain,accounts){var me=this;com.domain.moveAccounts(domain,accounts,function(result){if(result.error){gui.message.error(getLang("error::save_unsuccessful"));}else{gui.message.toast(getLang("message::save_successfull"));me.list._emptySelectedList();me.list._load();}});};_me._deleteSelectedAccounts=function(){var me=this;var num=this.list._getSelectedCount();var selected=me.list._getSelectedList();var superior=false;var mytype=gui._globalInfo.admintype;for(var i in selected)
if(mytype==USER_DOMAIN&&selected[i].subtype==USER_ADMIN){superior=true;break;}
if(superior||mytype==USER_USER){gui.message.error(getLang('error::insufficient_rights'));return;}
var prompt=gui.message.warning([getLang("warning::delete_selected_items",[num]),getLang('warning::operation_may_take_long_time')],false,[{value:getLang("generic::cancel"),method:'close'},{value:getLang("generic::delete"),onclick:function(closeCallback){prompt.main.btn_custom_0._disabled(true);prompt.main.btn_custom_1._disabled(true);if(typeof selected=='string'&&selected=='all')
{log.info('All is selected');filter={};var namemask=gui.frm_main._getSearch(true);var typemask=false;var type=0;if(me.list.dropdown_userlist_filter){type=me.list.dropdown_userlist_filter._value();}
if(type!='-'){typemask=type;}
filter.namemask=namemask;filter.typemask=typemask;com.domain.deleteAllAccounts(location.parsed_query.domain,filter,function(result){closeCallback();me.list._emptySelectedList();me.list._load();});}
else
{com.domain.deleteAccounts(location.parsed_query.domain,selected,function(result){closeCallback();me.list._emptySelectedList();me.list._load();},function(error){if(error=='account_permission'){error='insufficient_rights';}
closeCallback();me.list._emptySelectedList();gui.message.error(getLang('error::'+error));});}},type:'text error'},]);}

/* client/inc/obj_whitelabeling.js */
_me=obj_whitelabeling.prototype;function obj_whitelabeling(){};obj_whitelabeling.LOGIN_SETTINGS={layout_settings:['login_logo_name','logo_file','login_color','login_background','login_background_name','login_background_file','search_phrase','facebook_link','twitter_link','linkedin_link'],custom_login_fields:['login_verification_enabled','login_verification_type','nickname_enabled','nickname_required','company_enabled','company_required','job_enabled','job_required','profession_enabled','profession_required','mobile_phone_enabled','mobile_phone_required','work_phone_enabled','work_phone_required','home_phone_enabled','home_phone_required','im_enabled','im_required','gender_enabled','gender_required','birthday_enabled','birthday_required','homepage_enabled','homepage_required'],restrictions:['disable_languages','disable_remember','disable_autofill','disable_signup','contact_support','support_require_number','show_search','facebook_disabled','twitter_disabled','linkedin_disabled']};obj_whitelabeling.WEBMAIL_SETTINGS={layout_settings:['title','skin','skin_style']};obj_whitelabeling.WEBADMIN_SETTINGS={layout_settings_admin:['title','skin_style']};obj_whitelabeling.ICECHAT_SETTINGS={icechat_settings:['login_color','login_background_name','login_background_file']};obj_whitelabeling.COMBINED_SETTINGS={layout_settings:obj_whitelabeling.WEBMAIL_SETTINGS.layout_settings,layout_settings_admin:obj_whitelabeling.WEBADMIN_SETTINGS.layout_settings_admin,icechat_settings:obj_whitelabeling.ICECHAT_SETTINGS.icechat_settings}
obj_whitelabeling.BANNER_SETTINGS={banner_options:['customer_id','desktop_type','desktop_url','desktop_code','mobile_type','mobile_url','mobile_code','top_type','top_url','top_code','below_type','below_url','below_code'],restrictions:['enable_adsense']};obj_whitelabeling.CONFERENCING={conferencing_options:['jitsi_logo_file','jitsi_logo_name']};_me.__constructor=function(s){var me=this;var view=this._view=new WhiteLabelingView(this);view.addSaveButton();this.__globalResources=helper.clone(gui._globalInfo.resources);this.__is_default_enabled=false;this.__resource_level=RESOURCE_LEVEL_SERVER;this.__who=false;if(location.parsed_query.domain){this.__resource_level=RESOURCE_LEVEL_DOMAIN;this.__who=location.parsed_query.domain;}
if(location.parsed_query.account){this.__resource_level=RESOURCE_LEVEL_ACCOUNT;this.__who=location.parsed_query.account;}
me.__domaindetail=false;if(location.parsed_query.domain){me.__domaindetail=location.parsed_query.domain;}
if(!me.__domaindetail){gui.frm_main.main._init({name:'whitelabeling',heading:{value:getLang('main::white_labeling')}});}
this._level=com;if(this.__domaindetail){this._level=new Domain(this.__domaindetail);}
this._data=new IWAPI.Collection('Settings');this.__settings={};this.__settings.skin={};this.__settings.skin_style={'default':getLang('whitelabeling::blue'),'black':getLang('whitelabeling::black'),'brown':getLang('whitelabeling::brown'),'graphite':getLang('whitelabeling::graphite'),'green':getLang('whitelabeling::green'),'orange':getLang('whitelabeling::orange'),'pink':getLang('whitelabeling::pink'),'purple':getLang('whitelabeling::purple'),'red':getLang('whitelabeling::red'),'yellow':getLang('whitelabeling::yellow')}
this.__settings.background_urls={default_0:"background--default.jpg",default_1:"background--krivan.jpg",default_2:"background--prague2.jpg",default_3:"background--adrspach1.jpg",default_4:"background--czechcity.jpg",default_5:"background--prague1.jpg",default_6:"background--slovakia.jpg",default_7:"background--adrspach2.jpg",default_8:"background--czech.jpg",default_9:"background--czech1.jpg",default_10:"background--pleso.jpg",default_11:"background--tatras.jpg",default_12:"background--vine.jpg",default_13:"background--pragueboats.jpg",default_14:''};this.__settings._getFileLabel=function(file){var files=this.background_urls;for(var lbl in files){if(files[lbl]==file){return lbl;}}}};_me._bindColorPickerWithImagepicker=function(preview,object,imageTemplate){var me=this;var defaultImage=me[imageTemplate.replace("#COLOR#","default")+"0"];defaultImage.__moreGroupOnchange=defaultImage.__moreGroupOnchange||[];defaultImage.__moreGroupOnchange.push(function(that){preview._setAttribute("background",that._groupValue());var img=me.radio_login_background_image_default_0._groupValue();if(img){var url="./client/skins/default/login/images/";url+=me.__settings.background_urls[img];preview._main.style.backgroundImage="url("+url+")";}
me.input_login_background_image_input._value("");});}
_me._hash_handler=function(){var me=this;this._draw('obj_whitelabeling');if(me.__domaindetail){me._getAnchor('fb_language').setAttribute('is-hidden',1);me.dropdown_language._disabled(true);}
me._getAnchor('fi_wc_default').removeAttribute('is-hidden');me._getAnchor('fi_login_default').removeAttribute('is-hidden');me._getAnchor('fi_wa_default').removeAttribute('is-hidden');me.__is_default_enabled=true;me._bindColorPickerWithImagepicker(me.slider_login.preview_login,me.radio_login_colorpicker_default,"radio_login_background_image_#COLOR#_");var url="url(./server/download.php?class=background";url+="&fullpath="+encodeURIComponent(me.__domaindetail||'__@@GLOBAL@@__');url+="&uid="+Date.now();url+="&resize=1&width=572)";this.slider_login.preview_login._main.style.backgroundImage=url;var logo_custom=this.slider_login.preview_login._getAnchor('login_logo_custom');var logo_default=this.slider_login.preview_login._getAnchor('login_logo_default');var url="./server/download.php?class=logo";url+="&fullpath="+encodeURIComponent(me.__domaindetail||'__@@GLOBAL@@__');url+="&uid="+Date.now();logo_custom.addEventListener('load',function(){logo_custom.removeAttribute('is-hidden');logo_default.setAttribute('is-hidden','');});logo_custom.src=url;var url="url(./server/download.php?class=icechat_background";url+="&fullpath="+encodeURIComponent(me.__domaindetail||'__@@GLOBAL@@__');url+="&uid="+Date.now();url+="&resize=1&width=464)";this.slider_icechat_skin.preview_icechat_skin._main.style.backgroundImage=url;me.toggle_search._onchange=function(checked){me.input_search._readonly(!checked);this._main.parentNode.classList[checked?'remove':'add']('disabled');}
me.toggle_facebook._onchange=function(checked){me.input_facebook._readonly(checked);};me.toggle_twitter._onchange=function(checked){me.input_twitter._readonly(checked);};me.toggle_linkedin._onchange=function(checked){me.input_linkedin._readonly(checked);};me.toggle_adsense._onchange=function(checked){me.input_adsense._readonly(!checked);me.radio_banner_desktop_code._disabled(!checked);me.radio_banner_mobile_code._disabled(!checked);me.radio_banner_top_code._disabled(!checked);me.radio_banner_bottom_code._disabled(!checked);};me.radio_banner_desktop._onchange=me.radio_banner_desktop_url._onchange=me.radio_banner_desktop_code._onchange=function(checked){me.input_banner_desktop_url._main.parentNode.setAttribute('is-hidden','1');me.input_banner_desktop_code._main.parentNode.setAttribute('is-hidden','1');switch(me.radio_banner_desktop._groupValue()){case'url':me.input_banner_desktop_url._main.parentNode.removeAttribute('is-hidden');break;case'code':me.input_banner_desktop_code._main.parentNode.removeAttribute('is-hidden');break;}};me.radio_banner_mobile._onchange=me.radio_banner_mobile_url._onchange=me.radio_banner_mobile_code._onchange=function(checked){me.input_banner_mobile_url._main.parentNode.setAttribute('is-hidden','1');me.input_banner_mobile_code._main.parentNode.setAttribute('is-hidden','1');switch(me.radio_banner_mobile._groupValue()){case'url':me.input_banner_mobile_url._main.parentNode.removeAttribute('is-hidden');break;case'code':me.input_banner_mobile_code._main.parentNode.removeAttribute('is-hidden');break;}};me.radio_banner_top._onchange=me.radio_banner_top_url._onchange=me.radio_banner_top_code._onchange=function(checked){me.input_banner_top_url._main.parentNode.setAttribute('is-hidden','1');me.input_banner_top_code._main.parentNode.setAttribute('is-hidden','1');switch(me.radio_banner_top._groupValue()){case'url':me.input_banner_top_url._main.parentNode.removeAttribute('is-hidden');break;case'code':me.input_banner_top_code._main.parentNode.removeAttribute('is-hidden');break;}};me.radio_banner_bottom._onchange=me.radio_banner_bottom_url._onchange=me.radio_banner_bottom_code._onchange=function(checked){me.input_banner_bottom_url._main.parentNode.setAttribute('is-hidden','1');me.input_banner_bottom_code._main.parentNode.setAttribute('is-hidden','1');switch(me.radio_banner_bottom._groupValue()){case'url':me.input_banner_bottom_url._main.parentNode.removeAttribute('is-hidden');break;case'code':me.input_banner_bottom_code._main.parentNode.removeAttribute('is-hidden');break;}};for(var i in this.__settings.background_urls){var bg=this['radio_login_background_image_'+i];if(bg){bg._addcss("is-visible");bg._value(this.__settings.background_urls[i]);}
var bg=this['radio_ic_background_image_'+i];if(bg){bg._addcss("is-visible");bg._value(this.__settings.background_urls[i]);}}
me.button_login_default._onclick=function(){gui.message.warning(getLang("warning::set_to_default"),false,[{value:getLang("generic::cancel"),type:'text borderless',method:'close'},{value:getLang("generic::set_to_default"),type:'success text',onclick:function(closeCallback){me._data.login.resetAll(function(r){if(r==1){me._level.getSettings(obj_whitelabeling.LOGIN_SETTINGS,function(li){me._data.removeItem('login');me._data.addItem(li,'login');me._loadLogin(li);gui.message.toast(getLang("message::reset_to_default"));});}else{gui.message.error(getLang("error::default_reset_failed"));}});closeCallback();var img=me.slider_login.preview_login._main.getElementsByTagName('img')[0];var url="./server/download.php?class=logo";url+="&fullpath="+encodeURIComponent(me.__domaindetail||'__@@GLOBAL@@__');url+="&uid="+Date.now();img.src=url;}}]);}
me.button_wa_default._onclick=function(){gui.message.warning(getLang("warning::set_to_default"),false,[{value:getLang("generic::cancel"),type:'text borderless',method:'close'},{value:getLang("generic::set_to_default"),type:'success text',onclick:function(closeCallback){me._data.webadmin.resetAll(function(r){if(r==1){me._level.getSettings(obj_whitelabeling.WEBADMIN_SETTINGS,function(wa){me._data.removeItem('webadmin');me._data.addItem(wa,'webadmin');me._loadWebAdmin(wa);gui.message.toast(getLang("message::reset_to_default"));});}else{gui.message.error(getLang("error::default_reset_failed"));}});closeCallback();}}]);}
me.button_wc_default._onclick=function(){gui.message.warning(getLang("warning::set_to_default"),false,[{value:getLang("generic::cancel"),type:'text borderless',method:'close'},{value:getLang("generic::set_to_default"),type:'success text',onclick:function(closeCallback){me._data.webmail.resetAll(function(r){if(r==1){me._level.getSettings(obj_whitelabeling.WEBMAIL_SETTINGS,function(wm){me._data.removeItem('webmail');me._data.addItem(wm,'webmail');me._loadWebMail(wm);gui.message.toast(getLang("message::reset_to_default"));});}else{gui.message.error(getLang("error::default_reset_failed"));}});closeCallback();}}]);}
me.button_ic_default._onclick=function(){gui.message.warning(getLang("warning::set_to_default"),false,[{value:getLang("generic::cancel"),type:'text borderless',method:'close'},{value:getLang("generic::set_to_default"),type:'success text',onclick:function(closeCallback){me._data.icechat.resetAll(function(r){if(r==1){me._level.getSettings(obj_whitelabeling.ICECHAT_SETTINGS,function(ic){me._data.removeItem('icechat');me._data.addItem(ic,'icechat');me._loadIceChat(ic);});}else{}});closeCallback();}}]);}
this._load();}
_me._load=function(){com.getSettings('languages',function(langs){this.__settings.languages=langs;this.dropdown_language._fill(langs);com.getProperty('c_system_server_language',function(lang){this._language=lang;if(!lang.value){lang.value='en';}
this.dropdown_language._setValue(lang);}.bind(this));}.bind(this));this._level.getSettings(obj_whitelabeling.LOGIN_SETTINGS,function(s){if(s.error){gui.message.error(getLang("error::server_failure")+s.error);return;}
this._data.addItem(s,'login');this._loadLogin(s);this._activateLogin();}.bind(this));this._level.getSettings(obj_whitelabeling.COMBINED_SETTINGS,function(s){if(s.error){gui.message.error(getLang("error::server_failure")+s.error);return;}
this._data.addItem(s.layout_settings,'webmail');this._data.addItem(s.layout_settings_admin,'webadmin');this._data.addItem(s.icechat_settings,'icechat');com.settings.get('skins',function(layouts){for(var id in layouts){this.__settings.skin[id]=layouts[id];}
this.dropdown_wc_skin._fill(this.__settings.skin);this._loadWebMail(s.layout_settings);this._activateWebMail();}.bind(this));this._loadWebAdmin(s.layout_settings_admin);this._activateWebAdmin();this._loadIceChat(s.icechat_settings);this._activateIceChat();}.bind(this));this._level.getSettings(obj_whitelabeling.BANNER_SETTINGS,function(banners){if(banners.error){gui.message.error(getLang("error::server_failure")+banners.error);return;}
this._data.addItem(banners,'banners');this._loadBanners(banners);}.bind(this));this._level.getSettings(obj_whitelabeling.CONFERENCING,function(conferencing){if(conferencing.error){return gui.message.error(getLang("error::server_failure")+conferencing.error);}
this._data.addItem(conferencing,'conferencing');this._loadConferencing(conferencing);}.bind(this));}
_me._loadLogin=function(l){var r=l.restrictions;var f=l.custom_login_fields;var g=l.layout_settings;g.login_color.default='default';g.login_background_name.default=this.__settings.background_urls['default_0'];r.disable_languages.inversed=true;r.disable_remember.inversed=true;r.disable_autofill.inversed=true;r.disable_signup.inversed=true;r.facebook_disabled.inversed=true;r.twitter_disabled.inversed=true;r.linkedin_disabled.inversed=true;var preview=this.slider_login.preview_login;this.upload_logo_file._onfile=function(file){if(!~['jpg','png','gif','svg'].indexOf((file.extension||'').toLowerCase())){return gui.message.toast(getLang("error::unsupported_image_format"));}
var img=preview._main.getElementsByTagName('img')[0];var svg=img.parentNode.firstElementChild;img.src=file.content;img.removeAttribute('is-hidden');svg.setAttribute('is-hidden',1);g.logo_file.value=file.content;g.login_logo_name.value='login_logo.'+file.extension;}.bind(this);this.upload_background_file._onfile=function(file){if(!~['jpg','png','gif'].indexOf((file.extension||'').toLowerCase())){return gui.message.toast(getLang("error::unsupported_image_format"));}
var filename='login_background.'+file.extension;g.login_background_name.initialValue='';g.login_background_name.value=filename;g.login_background_file.value=file.content;var checked=this.radio_login_background_image_default_0._groupValue();if(checked){checked=this.__settings._getFileLabel(checked);this['radio_login_background_image_'+checked]._checked(false);}
preview._main.style.backgroundImage='url('+file.content+')';}.bind(this);this.radio_login_colorpicker_default._setValue(g.login_color);this.radio_login_background_image_default_0._setValue(g.login_background_name);this.toggle_disable_language._setValue(r.disable_languages);this.toggle_disable_remember_me._setValue(r.disable_remember);this.toggle_disable_autofill._setValue(r.disable_autofill);this.toggle_disable_sign_up._setValue(r.disable_signup);var disable_support=this.toggle_disable_support_link;var require_phone=this.checkbox_phone_required;disable_support._setValue(r.contact_support);require_phone._setValue(r.support_require_number);if(!disable_support._checked()){require_phone._hide();}
disable_support._onchange=function(checked){require_phone[checked?'_show':'_hide']();}
this.toggle_search._setValue(r.show_search);this.input_search._setValue(g.search_phrase);var signups=['mobile_phone','birthday','company','gender','home_phone','homepage','im','job','nickname','profession','work_phone'];var field='';while(field=signups.pop()){this['toggle_'+field]._setValue(f[field+'_enabled']);this['checkbox_'+field+'_required']._setValue(f[field+'_required']);this['toggle_'+field]._onchange=(function(field){return function(checked){if(checked){field._main.removeAttribute('is-hidden');}else{field._main.setAttribute('is-hidden',1);}}})(this['checkbox_'+field+'_required']);if(!this['toggle_'+field]._checked()){this['checkbox_'+field+'_required']._main.setAttribute('is-hidden',1);}}
var toggle=this.toggle_two_step_verification;var dropdown=this.dropdown_two_step_verification;dropdown._fill({none:'',email:getLang('WHITELABELING::EMAIL'),sms:getLang('WHITELABELING::SMS')});toggle._setValue(f.login_verification_enabled);dropdown._setValue(f.login_verification_type);dropdown._disabled(!toggle._checked());toggle._onchange=function(checked){dropdown._disabled(!checked);}
dropdown._onchange=function(e){if(this._value()=='none'){toggle._checked(false);}}
this.toggle_facebook._setValue(r.facebook_disabled);this.input_facebook._setValue(g.facebook_link);this.toggle_twitter._setValue(r.twitter_disabled);this.input_twitter._setValue(g.twitter_link);this.toggle_linkedin._setValue(r.linkedin_disabled);this.input_linkedin._setValue(g.linkedin_link);var preview=this.slider_login.preview_login;preview._main.style.backgroundImage="url(./server/download.php?class=background&fullpath="+encodeURIComponent(this.__domaindetail||'__@@GLOBAL@@__')+"&uid="+Date.now()+"&resize=1&width=572)";preview._main.className=preview._main.className.replace(/skin-[-a-z]+/,'');preview._main.classList.add('skin-'+(g.login_color.value||g.login_color.default));preview._enable('language',r.disable_languages!=1);preview._enable('remember',r.disable_remember!=1);preview._enable('autofill',r.disable_autofill!=1);preview._enable('sign_up',r.disable_signup);preview._enable('support',r.contact_support==1);preview._enable('search',r.show_search==1);preview._enable('facebook',r.facebook_disabled!=1);preview._enable('twitter',r.twitter_disabled!=1);preview._enable('linkedin',r.linkedin_disabled!=1);}
_me._activateLogin=function(){var preview=this.slider_login.preview_login;var main=preview._main;var file=this._data.login.layout_settings.login_background_file;var name=this._data.login.layout_settings.login_background_name;this.radio_login_colorpicker_default._groupOnchange=function(v){main.className=main.className.replace(/skin-[-a-z]+/,'');main.classList.add('skin-'+v._value());}
this.radio_login_background_image_default_0._groupOnchange=function(v){main.style.backgroundImage='url(./client/skins/default/login/images/'+v._value()+')';file.value=null;}
this.toggle_disable_language._onchange=function(check){preview._enable('language',check);}
this.toggle_disable_remember_me._onchange=function(check){preview._enable('remember',check);}
this.toggle_disable_autofill._onchange=function(check){preview._enable('autofill',check);}
this.toggle_disable_sign_up._onchange=function(check){preview._enable('sign_up',check);}
this.toggle_disable_support_link._onchange=function(check){preview._enable('support',check);}
this.toggle_search._onchange=function(check){preview._enable('search',check);}
this.toggle_facebook._onchange=this.toggle_twitter._onchange=this.toggle_linkedin._onchange=function(check){preview._enable(this._name.substr(7),check);}}
_me._loadWebMail=function(wm){wm.skin.default='default';wm.skin_style.default='default';this.input_wc_page_title._setValue(wm.title);this.dropdown_wc_skin._setValue(wm.skin);this.radio_wc_colorpicker_default._setValue(wm.skin_style);var preview=this.slider_webmail_skin.preview_webclient_skin;preview._setAttribute('skin',wm.skin.value||wm.skin.default);preview._setAttribute('style',wm.skin_style.value||wm.skin_style.default);}
_me._activateWebMail=function(){var preview=this.slider_webmail_skin.preview_webclient_skin;this.dropdown_wc_skin._onchange=function(e){if(e&&e.target){preview._setAttribute('skin',e.target.value);}}
this.radio_wc_colorpicker_default._groupOnchange=function(v){preview._setAttribute('style',v._value());}}
_me._loadWebAdmin=function(wa){wa.skin_style.default='default';this.input_wa_page_title._setValue(wa.title);this.radio_wa_colorpicker_default._setValue(wa.skin_style);document.body.className=document.body.className.replace(/skin-[-a-z]+/,'');document.body.classList.add('skin-'+(wa.skin_style.value||wa.skin_style.default));}
_me._activateWebAdmin=function(){this.radio_wa_colorpicker_default._groupOnchange=function(v){document.body.className=document.body.className.replace(/skin-[-a-z]+/,'');document.body.classList.add('skin-'+v._value());}}
_me._loadIceChat=function(ic){ic.login_color.default='default';ic.login_background_name.default=this.__settings.background_urls['default_0'];this.radio_ic_colorpicker_default._setValue(ic.login_color);this.radio_ic_background_image_default_0._setValue(ic.login_background_name);var preview=this.slider_icechat_skin.preview_icechat_skin;this.upload_ic_upload_image._onfile=function(file){if(!~['jpg','png','gif'].indexOf((file.extension||'').toLowerCase())){return gui.message.toast(getLang("error::unsupported_image_format"));}
var filename='login_background.'+file.extension;ic.login_background_name.value=filename;ic.login_background_file.value=file.content;var checked=this.radio_ic_background_image_default_0._groupValue();if(checked){checked=this.__settings._getFileLabel(checked);this['radio_ic_background_image_'+checked]._checked(false);}
preview._main.style.backgroundImage='url('+file.content+')';}.bind(this);var preview=this.slider_icechat_skin.preview_icechat_skin;}
_me._activateIceChat=function(){var preview=this.slider_icechat_skin.preview_icechat_skin;var main=preview._main;var file=this._data.icechat.login_background_file;this.radio_ic_colorpicker_default._groupOnchange=function(v){main.className=main.className.replace(/skin-[a-z]+/,'');main.classList.add('skin-'+v._value());}
this.radio_ic_background_image_default_0._groupOnchange=function(v){main.style.backgroundImage='url(./client/skins/default/login/images/icechat/'+v._value()+')';file.value=null;}}
_me._loadBanners=function(s){this.toggle_adsense._setValue(s.restrictions.enable_adsense);var b=s.banner_options;this.input_adsense._setValue(b.customer_id);b.desktop_type.default='none';b.mobile_type.default='none';b.top_type.default='none';b.below_type.default='none';this.radio_banner_desktop._setValue(b.desktop_type);this.input_banner_desktop_url._setValue(b.desktop_url);this.input_banner_desktop_code._setValue(b.desktop_code);this.radio_banner_mobile._setValue(b.mobile_type);this.input_banner_mobile_url._setValue(b.mobile_url);this.input_banner_mobile_code._setValue(b.mobile_code);this.radio_banner_top._setValue(b.top_type);this.input_banner_top_url._setValue(b.top_url);this.input_banner_top_code._setValue(b.top_code);this.radio_banner_bottom._setValue(b.below_type);this.input_banner_bottom_url._setValue(b.below_url);this.input_banner_bottom_code._setValue(b.below_code);}
_me._loadConferencing=function(c){this.upload_jitsi_logo_file._onfile=function(file){c.jitsi_logo_file.value=file.content;c.jitsi_logo_name.value='jitsi_logo.'+file.extension;}.bind(this);}
_me._issaved=function(){return!this._data.hasChanged();}
_me._save=function(callback){var webadmin=this._data.webadmin;var changed=[];for(var i in this._data){if(this._data[i].hasChanged()){changed.push(this._data[i]);}}
if(this._language.hasChanged()){changed.push(this._language);}
var failed=false;var saver=function(set){set.saveChanges(function(r){if(r!=1){failed=true;}
if(set=changed.pop()){saver(set);}else if(failed){gui.message.error(getLang("error::save_unsuccessful"));}else{gui.message.toast(getLang("message::save_successfull"));gui._globalInfo.resources.removeItem('layout_settings_admin');gui._globalInfo.resources.addItem(webadmin);gui.frm_main._applySkin();if(callback){callback(!failed);}}});};if(changed.length){saver(changed.pop());}}
_me._reset=function(){this._data.revertChanges();}
var WhiteLabelingView=function(controller){this._control=controller;}
WhiteLabelingView.prototype=Object.create(CoreView.prototype);

/* client/inc/punycode_ext.js */
var punycode=new function Punycode(){this.utf16={decode:function(input){var output=[],i=0,len=input.length,value,extra;while(i<len){value=input.charCodeAt(i++);if((value&0xF800)===0xD800){extra=input.charCodeAt(i++);if(((value&0xFC00)!==0xD800)||((extra&0xFC00)!==0xDC00)){throw new RangeError("UTF-16(decode): Illegal UTF-16 sequence");}
value=((value&0x3FF)<<10)+(extra&0x3FF)+0x10000;}
output.push(value);}
return output;},encode:function(input){var output=[],i=0,len=input.length,value;while(i<len){value=input[i++];if((value&0xF800)===0xD800){throw new RangeError("UTF-16(encode): Illegal UTF-16 value");}
if(value>0xFFFF){value-=0x10000;output.push(String.fromCharCode(((value>>>10)&0x3FF)|0xD800));value=0xDC00|(value&0x3FF);}
output.push(String.fromCharCode(value));}
return output.join("");}}
var initial_n=0x80;var initial_bias=72;var delimiter="\x2D";var base=36;var damp=700;var tmin=1;var tmax=26;var skew=38;var maxint=0x7FFFFFFF;function decode_digit(cp){return cp-48<10?cp-22:cp-65<26?cp-65:cp-97<26?cp-97:base;}
function encode_digit(d,flag){return d+22+75*(d<26)-((flag!=0)<<5);}
function adapt(delta,numpoints,firsttime){var k;delta=firsttime?Math.floor(delta/damp):(delta>>1);delta+=Math.floor(delta/numpoints);for(k=0;delta>(((base-tmin)*tmax)>>1);k+=base){delta=Math.floor(delta/(base-tmin));}
return Math.floor(k+(base-tmin+1)*delta/(delta+skew));}
function encode_basic(bcp,flag){bcp-=(bcp-97<26)<<5;return bcp+((!flag&&(bcp-65<26))<<5);}
this.decode=function(input,preserveCase){var output=[];var case_flags=[];var input_length=input.length;var n,out,i,bias,basic,j,ic,oldi,w,k,digit,t,len;n=initial_n;i=0;bias=initial_bias;basic=input.lastIndexOf(delimiter);if(basic<0)basic=0;for(j=0;j<basic;++j){if(preserveCase)case_flags[output.length]=(input.charCodeAt(j)-65<26);if(input.charCodeAt(j)>=0x80){throw new RangeError("Illegal input >= 0x80");}
output.push(input.charCodeAt(j));}
for(ic=basic>0?basic+1:0;ic<input_length;){for(oldi=i,w=1,k=base;;k+=base){if(ic>=input_length){throw RangeError("punycode_bad_input(1)");}
digit=decode_digit(input.charCodeAt(ic++));if(digit>=base){throw RangeError("punycode_bad_input(2)");}
if(digit>Math.floor((maxint-i)/w)){throw RangeError("punycode_overflow(1)");}
i+=digit*w;t=k<=bias?tmin:k>=bias+tmax?tmax:k-bias;if(digit<t){break;}
if(w>Math.floor(maxint/(base-t))){throw RangeError("punycode_overflow(2)");}
w*=(base-t);}
out=output.length+1;bias=adapt(i-oldi,out,oldi===0);if(Math.floor(i/out)>maxint-n){throw RangeError("punycode_overflow(3)");}
n+=Math.floor(i/out);i%=out;if(preserveCase){case_flags.splice(i,0,input.charCodeAt(ic-1)-65<26);}
output.splice(i,0,n);i++;}
if(preserveCase){for(i=0,len=output.length;i<len;i++){if(case_flags[i]){output[i]=(String.fromCharCode(output[i]).toUpperCase()).charCodeAt(0);}}}
return this.utf16.encode(output);};this.encode=function(input,preserveCase){var n,delta,h,b,bias,j,m,q,k,t,ijv,case_flags;if(preserveCase){case_flags=this.utf16.decode(input);}
input=this.utf16.decode(input.toLowerCase());var input_length=input.length;if(preserveCase){for(j=0;j<input_length;j++){case_flags[j]=input[j]!=case_flags[j];}}
var output=[];n=initial_n;delta=0;bias=initial_bias;for(j=0;j<input_length;++j){if(input[j]<0x80){output.push(String.fromCharCode(case_flags?encode_basic(input[j],case_flags[j]):input[j]));}}
h=b=output.length;if(b>0)output.push(delimiter);while(h<input_length){for(m=maxint,j=0;j<input_length;++j){ijv=input[j];if(ijv>=n&&ijv<m)m=ijv;}
if(m-n>Math.floor((maxint-delta)/(h+1))){throw RangeError("punycode_overflow (1)");}
delta+=(m-n)*(h+1);n=m;for(j=0;j<input_length;++j){ijv=input[j];if(ijv<n){if(++delta>maxint)return Error("punycode_overflow(2)");}
if(ijv==n){for(q=delta,k=base;;k+=base){t=k<=bias?tmin:k>=bias+tmax?tmax:k-bias;if(q<t)break;output.push(String.fromCharCode(encode_digit(t+(q-t)%(base-t),0)));q=Math.floor((q-t)/(base-t));}
output.push(String.fromCharCode(encode_digit(q,preserveCase&&case_flags[j]?1:0)));bias=adapt(delta,h+1,h==b);delta=0;++h;}}
++delta,++n;}
return output.join("");}
this.ToASCII=function(domain){var domain_array=domain.split(".");var out=[];for(var i=0;i<domain_array.length;++i){var s=domain_array[i];out.push(s.match(/[^A-Za-z0-9-]/)?"xn--"+punycode.encode(s):s);}
return out.join(".");}
this.ToUnicode=function(domain){var account=false;if(domain.search('@')>=0){parsed=domain.split('@');account=parsed[0];domain=parsed[1];}
var domain_array=domain.split(".");var out=[];for(var i=0;i<domain_array.length;++i){var s=domain_array[i];out.push(s.match(/^xn--/)?punycode.decode(s.slice(4)):s);}
return(account?account+'@':'')+out.join(".");}}();

/* client/inc/sha1.js */
function SHA1(msg){function rotate_left(n,s){var t4=(n<<s)|(n>>>(32-s));return t4;};function lsb_hex(val){var str="";var i;var vh;var vl;for(i=0;i<=6;i+=2){vh=(val>>>(i*4+4))&0x0f;vl=(val>>>(i*4))&0x0f;str+=vh.toString(16)+vl.toString(16);}
return str;};function cvt_hex(val){var str="";var i;var v;for(i=7;i>=0;i--){v=(val>>>(i*4))&0x0f;str+=v.toString(16);}
return str;};function Utf8Encode(string){string=string.replace(/\r\n/g,"\n");var utftext="";for(var n=0;n<string.length;n++){var c=string.charCodeAt(n);if(c<128){utftext+=String.fromCharCode(c);}
else if((c>127)&&(c<2048)){utftext+=String.fromCharCode((c>>6)|192);utftext+=String.fromCharCode((c&63)|128);}
else{utftext+=String.fromCharCode((c>>12)|224);utftext+=String.fromCharCode(((c>>6)&63)|128);utftext+=String.fromCharCode((c&63)|128);}}
return utftext;};var blockstart;var i,j;var W=new Array(80);var H0=0x67452301;var H1=0xEFCDAB89;var H2=0x98BADCFE;var H3=0x10325476;var H4=0xC3D2E1F0;var A,B,C,D,E;var temp;msg=Utf8Encode(msg);var msg_len=msg.length;var word_array=new Array();for(i=0;i<msg_len-3;i+=4){j=msg.charCodeAt(i)<<24|msg.charCodeAt(i+1)<<16|msg.charCodeAt(i+2)<<8|msg.charCodeAt(i+3);word_array.push(j);}
switch(msg_len%4){case 0:i=0x080000000;break;case 1:i=msg.charCodeAt(msg_len-1)<<24|0x0800000;break;case 2:i=msg.charCodeAt(msg_len-2)<<24|msg.charCodeAt(msg_len-1)<<16|0x08000;break;case 3:i=msg.charCodeAt(msg_len-3)<<24|msg.charCodeAt(msg_len-2)<<16|msg.charCodeAt(msg_len-1)<<8|0x80;break;}
word_array.push(i);while((word_array.length%16)!=14)word_array.push(0);word_array.push(msg_len>>>29);word_array.push((msg_len<<3)&0x0ffffffff);for(blockstart=0;blockstart<word_array.length;blockstart+=16){for(i=0;i<16;i++)W[i]=word_array[blockstart+i];for(i=16;i<=79;i++)W[i]=rotate_left(W[i-3]^W[i-8]^W[i-14]^W[i-16],1);A=H0;B=H1;C=H2;D=H3;E=H4;for(i=0;i<=19;i++){temp=(rotate_left(A,5)+((B&C)|(~B&D))+E+W[i]+0x5A827999)&0x0ffffffff;E=D;D=C;C=rotate_left(B,30);B=A;A=temp;}
for(i=20;i<=39;i++){temp=(rotate_left(A,5)+(B^C^D)+E+W[i]+0x6ED9EBA1)&0x0ffffffff;E=D;D=C;C=rotate_left(B,30);B=A;A=temp;}
for(i=40;i<=59;i++){temp=(rotate_left(A,5)+((B&C)|(B&D)|(C&D))+E+W[i]+0x8F1BBCDC)&0x0ffffffff;E=D;D=C;C=rotate_left(B,30);B=A;A=temp;}
for(i=60;i<=79;i++){temp=(rotate_left(A,5)+(B^C^D)+E+W[i]+0xCA62C1D6)&0x0ffffffff;E=D;D=C;C=rotate_left(B,30);B=A;A=temp;}
H0=(H0+A)&0x0ffffffff;H1=(H1+B)&0x0ffffffff;H2=(H2+C)&0x0ffffffff;H3=(H3+D)&0x0ffffffff;H4=(H4+E)&0x0ffffffff;}
var temp=cvt_hex(H0)+cvt_hex(H1)+cvt_hex(H2)+cvt_hex(H3)+cvt_hex(H4);return temp.toLowerCase();}

/* client/inc/ts_helpers.js */
var __extends=(this&&this.__extends)||function(d,b){for(var p in b)
if(b.hasOwnProperty(p))
d[p]=b[p];function __(){this.constructor=d;}
d.prototype=b===null?Object.create(b):(__.prototype=b.prototype,new __());};

/* client/inc/wa_accountmembers.js */
com.members=(function(){function AccountMembers(){this.xmlns='rpc';}
AccountMembers.prototype=Object.create(IWServerInteraction.prototype);AccountMembers.rightlabels={default:getLang('mailinglist::default'),recieve:getLang('mailinglist::receive'),post:getLang('mailinglist::post'),digest:getLang('mailinglist::digest')};AccountMembers.prototype.getList=function(account){return com.list.fetch('AccountMember',{who:account},null,null,function(item){var rights=[];for(var right in AccountMembers.rightlabels){if(+item[right]){rights.push(AccountMembers.rightlabels[right]);}}
rights=rights.join(', ');item.addItem('email',item.val.toString());item.addItem('rights',rights);});}
var prepareMembersList=function(members,rights){members=members||[];rights=rights||{};var items=[];var n=members.length;while(n--){var item={classname:'tpropertymember',val:members[n].toString()};for(var r in rights){item[r]=rights[r];}
items.unshift(item);}
return items;}
AccountMembers.prototype.add=function(account,list,aHandler){var rights={default:1};var query=this.createCommand('addaccountmembers',{accountemail:account,members:{classname:'tpropertymembers',val:prepareMembersList(list,rights)}});this.executeCommand(query,aHandler);}
AccountMembers.prototype.edit=function(account,list,rights,aHandler){if(rights.receive){rights.recieve=rights.receive;delete rights.receive;}
var query=this.createCommand('editaccountmembers',{accountemail:account,members:{classname:'tpropertymembers',val:prepareMembersList(list,rights)}});this.executeCommand(query,aHandler);}
AccountMembers.prototype.editAll=function(account,rights,aHandler){if(rights.receive){rights.recieve=rights.receive;delete rights.receive;}
var query=this.createCommand('EditAllAccountMembersRights',{accountemail:account,rights:rights});this.executeCommand(query,aHandler);}
AccountMembers.prototype.remove=function(account,list,aHandler){var query=this.createCommand('deleteaccountmembers',{accountemail:account,members:{classname:'tpropertymembers',val:prepareMembersList(list)}});this.executeCommand(query,aHandler);}
AccountMembers.prototype.removeAll=function(account,aHandler){this.executeCommand(this.createCommand('deleteAllAccountMembers',{accountemail:account}),aHandler);}
return new AccountMembers();})();

/* client/inc/wa_list.js */
com.list=(function(){function Lister(){}
Lister.prototype.fetch=function(listtype,options,amount,filter,parser){var list=new InfoList(listtype,options,amount,filter,parser);return list;}
var ListItems=function(label){IWAPI.List.call(label);this.search='';}
ListItems.prototype=Object.create(IWAPI.List.prototype);var InfoList=function(listtype,parameters,amount,filter,parser){this.xmlns='rpc';this.meta={start:0,end:0,chunk:amount||30,total:null}
this.search=filter||'';this.content=new ListItems(listtype);this.parameters=parameters||{};this.label=listtype;this.parser=parser;};InfoList.prototype=Object.create(IWServerInteraction.prototype);InfoList.prototype.filter=function(filter){if(this.search!=filter){this.meta.start=this.meta.end=0;this.content=new ListItems(this.content.label);this.content.search=filter;}
this.search=filter;}
InfoList.prototype.type=function(type){if(this.subtype!=type){this.meta.start=this.meta.end=0;this.content=new ListItems(this.content.label);this.content.search=this.search;}
this.subtype=type;}
InfoList.prototype.load=function(callback,meta){meta=meta||{};var options={};for(var o in this.parameters){options[o]=this.parameters[o];}
options.offset=this.meta.end;options.count=meta.chunk||this.meta.chunk;options.filter={namemask:this.search||'*'};if(this.subtype!=undefined){options.filter.typemask=this.subtype;}
var query=this.createCommand('Get'+this.label+'InfoList',options);this.getResult(query,function(result){if(result.error){callback(result);}else{if(result.overallcount){var page=[];var total=this.meta.total=+result.overallcount;page.total=total;callback(page);}else{var page=new ListItems(this.content.label);var total=this.meta.total=+result.getItem('overallcount');this.meta.end+=options.count;page.total=this.content.total=total;page.search=this.content.search;result.removeItem('overallcount');result.removeItem('offset');for(var i=0,l=result.length;i<l;i++){this.parser&&this.parser(result[i]);this.content.addItem(result[i]);page.addItem(result[i]);}
callback(page);}}}.bind(this));}
InfoList.prototype.reset=function(){var amount=this.meta.chunk;this.content=new ListItems(this.label);this.meta={start:0,end:0,chunk:amount,total:null}
delete this.search;}
return new Lister();})();

/* client/inc/wm_certificates.js */
function wm_certificates()
{this.xmlns='rpc';}
wm_certificates.inherit(wm_generic);var _me=wm_certificates.prototype;_me.server=function(aHandler){try
{var aRequest={commandname:[{VALUE:'getservercertificatelist'}]};if(!aHandler[0]){aHandler=[aHandler];}
var fc=[function(data){var prepared={items:[]};try
{if(data.Array.IQ[0].QUERY[0].RESULT[0].ITEM)
{for(var i=0;i<data.Array.IQ[0].QUERY[0].RESULT[0].ITEM.length;i++){var inner={};var tmp;for(var inr in data.Array.IQ[0].QUERY[0].RESULT[0].ITEM[i]){if(tmp=data.Array.IQ[0].QUERY[0].RESULT[0].ITEM[i][inr][0]){inr=inr.toLowerCase();if(tmp.VALUE){inner[inr]=tmp.VALUE;}else{if(inr=='ipaddress'||inr=='hostname'){inner[inr]=[];if(tmp.ITEM){for(var j=tmp.ITEM.length;j--;){inner[inr].unshift(tmp.ITEM[j].VALUE);}}}else if(inr=='error'){inner.error={lasterror:parseInt(tmp.LASTERROR[0].VALUE)||0,lastattempt:tmp.LASTATTEMPT[0].VALUE,faileddomains:[]};if(tmp.FAILEDDOMAINS&&tmp.FAILEDDOMAINS[0].ITEM){for(var j=tmp.FAILEDDOMAINS[0].ITEM.length;j--;){inner.error.faileddomains.unshift({domainname:tmp.FAILEDDOMAINS[0].ITEM[j].DOMAINNAME[0].VALUE,resultcode:tmp.FAILEDDOMAINS[0].ITEM[j].RESULTCODE[0].VALUE});}}}else{inner[inr]={};var j='';for(j in tmp){inner[inr][j.toLowerCase()]=tmp[j][0].VALUE||'';}
if(!j){inner[inr]='';}}}}}
if(inner.isdefault){inner.isdefault=inner.isdefault=='1';}
if(inner.iscsr){inner.iscsr=inner.iscsr=='1';}
if(inner.status){inner.status=parseInt(inner.status);}
prepared.items.push(inner);}}}
catch(e){log.error(['certificates-getlist','Invalid response',data]);}
aHandler[0](prepared.items);}];this.create_iq(aRequest,[this,'__response',[fc]]);}
catch(e)
{log.error(['certificates-getlist',e]);}
return true;}
_me.add=function(certificate,aHandler){var me=this;try
{var aRequest={commandname:[{VALUE:'addservercertificate'}],commandparams:[{certificate:[{VALUE:certificate}]}]};if(!aHandler[0]){aHandler=[aHandler];}
this.create_iq(aRequest,[this,'__response',[me._autoBooleanHandler(aHandler)]]);}
catch(e)
{log.error(['certificates-add',e]);}
return true;}
_me.edit=function(id,certificate,aHandler){var me=this;try
{var aRequest={commandname:[{VALUE:'editservercertificate'}],commandparams:[{id:[{VALUE:id}],certificate:[{VALUE:certificate}]}]};if(!aHandler[0]){aHandler=[aHandler];}
this.create_iq(aRequest,[this,'__response',[me._autoIdHandler(aHandler)]],false,'set');}
catch(e)
{log.error(['certificates-edit',e]);}
return true;}
_me.setasdefault=function(id,aHandler){var me=this;try
{var aRequest={commandname:[{VALUE:'setdefaultservercertificate'}],commandparams:[{id:[{VALUE:id}]}]};if(!aHandler[0]){aHandler=[aHandler];}
this.create_iq(aRequest,[this,'__response',[me._autoBooleanHandler(aHandler)]],false,'set');}
catch(e)
{log.error(['certificates-setdefault',e]);}
return true;}
_me.create=function(issuer,domains,options,aHandler){var me=this;try
{var aRequest={commandname:[{VALUE:options.reissue?'reissueservercertificate':'createservercertificate'}],commandparams:[{certificate:[{fcommonnames:[{item:[]}]}]}]};for(var i in issuer){aRequest.commandparams[0].certificate[0][i]=[{VALUE:issuer[i]}];}
if(options.reissue){aRequest.commandparams[0].id=[{VALUE:options.reissue}]
delete options.reissue;}
if(options.reuse){aRequest.commandparams[0].reuse=[{VALUE:1}]
delete options.reuse;}
for(var i in options){aRequest.commandparams[0].certificate[0][i]=[{VALUE:options[i]}];}
if(domains.length){for(var i=domains.length;i--;){aRequest.commandparams[0].certificate[0].fcommonnames[0].item.unshift({VALUE:domains[i]});}}else{aRequest.commandparams[0].certificate[0].fcommonnames[0]={};}
if(!aHandler[0]){aHandler=[aHandler];}
this.create_iq(aRequest,[this,'__response',[me._autoIdHandler(aHandler)]],false,'set');}
catch(e)
{log.error(['certificates-create',e]);}
return true;}
_me.editips=function(id,ips,aHandler){var me=this;try
{var aRequest={commandname:[{VALUE:'editservercertificate'}],commandparams:[{id:[{VALUE:id}],ipaddress:[{item:[]}]}]};if(ips.length){for(var i=ips.length;i--;){aRequest.commandparams[0].ipaddress[0].item.unshift({VALUE:ips[i]});}}else{aRequest.commandparams[0].ipaddress[0]={};}
if(!aHandler[0]){aHandler=[aHandler];}
this.create_iq(aRequest,[this,'__response',[me._autoBooleanHandler(aHandler)]],false,'set');}
catch(e)
{log.error(['certificates-editips',e]);}
return true;}
_me.export=function(id,aHandler){var me=this;try
{var aRequest={commandname:[{VALUE:'exportservercertificate'}],commandparams:[{id:[{VALUE:id}]}]};if(!aHandler[0]){aHandler=[aHandler];}
var fc=[function(data){try
{var file=data.Array.IQ[0].QUERY[0].RESULT[0].VALUE
if(file)
{file=me._unpackxmlfile(file);me._downloadfile(file.content,'signreq.csr','application/pkcs10');}}
catch(e){log.error(['certificates-export','Invalid response',data]);}
aHandler[0](true);}];this.create_iq(aRequest,[this,'__response',[fc]]);}
catch(e)
{log.error(['certificates-export',e]);}
return true;}
_me.delete=function(id,aHandler){var me=this;try
{var aRequest={commandname:[{VALUE:'deleteservercertificate'}],commandparams:[{id:[{VALUE:id}]}]};if(!aHandler[0]){aHandler=[aHandler];}
this.create_iq(aRequest,[this,'__response',[me._autoBooleanHandler(aHandler)]],false,'set');}
catch(e)
{log.error(['certificates-delete',e]);}
return true;}
_me.__response=function(aData,aHandler){executeCallbackFunction(aHandler,aData);};if(!com){var com={};}
com.certificates=new wm_certificates();

/* client/inc/wm_console.js */
function wm_console()
{this.xmlns='rpc';}
wm_console.inherit(wm_generic);var _me=wm_console.prototype;_me._get=function(commandname,data,cb,who){ecb=cb[1];cb=cb[0];cb=this.__attachErrorHandler(cb,ecb);var setdata=false;if(data[0]!==false){setdata=[{VALUE:data[0]}];}
var propertydata=false;if(data[1]!==false){if(typeof data[1]!='object'){data[1]=[data[1]];}
var items=[];for(var i=0;i<data[1].length;i++){items.push({propname:[{VALUE:data[1][i]}]});}
propertydata=[{item:items}];}
var aRequest={commandname:[{VALUE:commandname}],commandparams:[{}]};if(data[2]&&data[2].account){aRequest.commandparams[0].accountemail=[{VALUE:data[2].account}];}
if(data[2]&&data[2].domain){aRequest.commandparams[0].domainstr=[{VALUE:data[2].domain}];}
aRequest.commandparams[0][data[3]]=setdata;aRequest.commandparams[0][data[4]]=propertydata;if(data[5]){aRequest.commandparams[0]['offset']=[{VALUE:data[5].page*data[5].limit}];aRequest.commandparams[0]['count']=[{VALUE:data[5].limit}];}
log.log(['console-get',who]);if(who&&who.search('@')>=0){aRequest.commandparams[0].accountemail=[{VALUE:who}];}else if(who){aRequest.commandparams[0].domainstr=[{VALUE:who}];}
this.create_iq(aRequest,[this,'_response',[cb]]);return true;}
_me._set=function(commandname,property,value,cb,who){ecb=cb[1];cb=cb[0];cb=this.__attachErrorHandler(cb,ecb);var propertydata=false;if(property){if(typeof property!='object'){var prop={};prop[property]=value;property=prop;}
var items=[];for(var key in property){items.push({apiproperty:[{propname:[{VALUE:key}]}],propertyval:[{classname:[{VALUE:'tpropertystring'}],val:[{VALUE:property[key]}]}]});}
propertydata=[{item:items}];}
var aRequest={commandname:[{VALUE:commandname}],commandparams:[{propertyvaluelist:propertydata}]};log.log(['console-set',who]);if(who&&who.search('@')>=0){aRequest.commandparams[0].accountemail=[{VALUE:who}];}else if(who){aRequest.commandparams[0].domainstr=[{VALUE:who}];}
this.create_iq(aRequest,[this,'_response',[cb]]);return true;}
_me.set=function(cb,ecb)
{cb=[cb,ecb];var cb=cb;var me=this;return{server:function(property,value){me._set('SetServerProperties',property,value,cb);},domain:function(property,value,who){me._set('SetDomainProperties',property,value,cb,who);},account:function(property,value,who){me._set('SetAccountProperties',property,value,cb,who);}}}
_me.standardized=function(cb,ecb){var fc=function(data){data=com.console.standardize(data);if(cb){cb(data);}}
return this.item(fc,ecb);}
_me.item=function(cb,ecb)
{cb=[cb,ecb];var cb=cb;var me=this;return{account:function(property,account,limit){me._get('getaccountproperties',[false,property,{account:account},'accountpropertyset','accountpropertylist',limit],cb,account)},domain:function(property,domain){me._get('getdomainproperties',[false,property,{domain:domain},'domainpropertyset','domainpropertylist'],cb,domain)},server:function(property){me._get('GetServerProperties',[false,property,false,'serverpropertyset','serverpropertylist'],cb)},statistics:function(property){me._get('GetStatisticsProperties',[false,property,false,'statisticspropertylist','statisticspropertylist'],cb)}}}
_me.itemset=function(cb,ecb)
{cb=[cb,ecb];var cb=cb;var me=this;return{account:function(set,account){me._get('getaccountproperties',[set,false,{account:account},'accountpropertyset','accountpropertylist'],cb)},server:function(set){me._get('GetServerProperties',[set,false,'serverpropertyset','serverpropertylist'],cb)}}}
_me.combi=function(cb,ecb)
{cb=[cb,ecb];var cb=cb;var me=this;return{account:function(set,property,account){me._get('getaccountproperties',[set,property,{account:account},'accountpropertyset','accountpropertylist'],cb);},server:function(set,property){me._get('GetServerProperties',[set,property,'serverpropertyset','serverpropertylist'],cb);}}}
_me.global=function(variable,type,callback){var me=this;var globalname=variable.substr(1,variable.length-1);var f=function(value,callback){var b=(value=="1"||value==1||value==true?true:false);var i=parseInt(value);var s=""+value;var ret;switch(type){case V_TYPE_BOOLEAN:ret=b;break;case V_TYPE_INTEGER:ret=i;break;case V_TYPE_STRING:ret=s;break;}
callback(ret,b,i,s);}
if(global[globalname]){f(global[globalname],function(v,b,i,s){callback(v,b,i,s);});}else{me.item(function(result){try
{var v=result.Array.IQ[0].QUERY[0].RESULT[0].ITEM[0].PROPERTYVAL[0];global[globalname]=false;if(v.VAL&&v.VAL[0]&&v.VAL[0].VALUE){f(v.VAL[0].VALUE,function(v,b,i,s){global[globalname]=v;callback(v,b,i,s);});}else{log.error(['console-global-val',"v.VAL[0].VALUE not found"]);}}
catch(e)
{log.error(['console-global',e]);}}).server(variable);}}
_me.getAPI=function(perPage,page,mask,cb,clear,type,who){if(typeof clear=='undefined'){clear=true;}
if(!type){type="server";}
var types=['integer','string','enum','boolean','longstring'];var prefixes={accounts:['c_accounts_global_'],accounts_policies:['c_accounts_policies_'],domains:['c_accounts_global_'],mail:['c_mail_'],smtp_pop3_imap:['c_system_services_'],groupware:['c_system_services_','c_gw','c_'],mobile_sync:['c_'],sms:['c_sms_'],instant_messaging:['c_im_','c_system_services_'],voip:['c_system_services_'],conferencing:['c_meeting_'],antispam:['c_as_','c_'],antivirus:['c_av_'],webserver:['c_system_services_'],ftp:['c_ftp_','c_system_services_'],webdav:['c_webdav_'],smart_discover:['c_system_autodiscover_','c_'],logging:['c_system_log_'],storage:['c_system_storage_'],connection:['c_system_conn_'],protocols:['c_system_adv_'],ldap:['c_accounts_global_ldap_','c_system_services_'],proxy:['c_proxy','c_system_services_'],gui:['c_accounts_global_','c_system_console','c_'],system_tools:['c_system_tools_'],general:['c_'],advanced:['c_']}
var offset=perPage*page;if(offset<0){offset=0;}
var count=perPage;var aRequest={commandname:[{VALUE:'get'+type+'apiconsole'}],commandparams:[{}]};aRequest.commandparams[0]={filter:[{mask:[{VALUE:(mask?mask:'*')}],clear:[{VALUE:(clear?1:0)}]}],offset:[{VALUE:offset}],count:[{VALUE:count}],comments:[{VALUE:1}]};if(who){if(type=='domain'){aRequest.commandparams[0].domainstr=[{VALUE:who}];}
if(type=='account'){aRequest.commandparams[0].accountemail=[{VALUE:who}];}}
var call=function(data){try
{var clean={count:0,items:[]};if(data.Array.IQ[0].QUERY[0].RESULT[0]){var root=data.Array.IQ[0].QUERY[0].RESULT[0];log.log(root);clean.count=root.OVERALLCOUNT[0].VALUE;if(root.ITEM&&root.ITEM[0]){for(var i=0;i<root.ITEM.length;i++){var classname=(root.ITEM[i].PROPERTYVAL[0].CLASSNAME[0].VALUE?root.ITEM[i].PROPERTYVAL[0].CLASSNAME[0].VALUE:'');var valuetype=(root.ITEM[i].PROPERTYVALUETYPE[0].VALUE?root.ITEM[i].PROPERTYVALUETYPE[0].VALUE:'');var type=(typeof types[valuetype]=='undefined'?valuetype:types[valuetype]);var group=root.ITEM[i].PROPERTYGROUP[0].VALUE.toLowerCase().replace(/ /g,'_').replace(/\//g,'_');var name=root.ITEM[i].APIPROPERTY[0].PROPNAME[0].VALUE;var showname=name;var value,label;var enumvalues=[];var enumvalues_fill={};if(root.ITEM[i].PROPERTYENUMVALUES&&root.ITEM[i].PROPERTYENUMVALUES[0]&&root.ITEM[i].PROPERTYENUMVALUES[0].ITEM&&root.ITEM[i].PROPERTYENUMVALUES[0].ITEM[0]){for(var ii=0;ii<root.ITEM[i].PROPERTYENUMVALUES[0].ITEM.length;ii++){try
{value=root.ITEM[i].PROPERTYENUMVALUES[0].ITEM[ii].VALUE[0].VALUE;label=root.ITEM[i].PROPERTYENUMVALUES[0].ITEM[ii].NAME[0].VALUE;enumvalues.push({name:label,value:value});enumvalues_fill['*'+value]=value+' - '+label;}
catch(e)
{log.error(e);}}}
if(prefixes[group]){for(var p=0;p<prefixes[group].length;p++){if(showname.substr(0,prefixes[group][p].length)==prefixes[group][p]){showname=showname.substr(prefixes[group][p].length,showname.length-prefixes[group][p].length);}}}
clean.items.push({name:name,showname:showname,description:(root.ITEM[i].PROPERTYCOMMENT[0].VALUE?root.ITEM[i].PROPERTYCOMMENT[0].VALUE:''),group:group,right:root.ITEM[i].PROPERTYRIGHT[0].VALUE,value:(root.ITEM[i].PROPERTYVAL[0].VAL&&root.ITEM[i].PROPERTYVAL[0].VAL[0].VALUE?root.ITEM[i].PROPERTYVAL[0].VAL[0].VALUE:''),classname:classname,type:type,enumvalues:enumvalues,enumvalues_fill:enumvalues_fill});}}}
data=clean;if(cb){cb(data);}}
catch(e){log.error(e);}}
this.create_iq(aRequest,[this,'_response',[call]]);return true;}
_me.standardize=function(data){var me=this;var items=[];if(!data.Array.IQ[0].QUERY[0].RESULT[0].ITEM){log.info(['wmconsole-standardize','no-items']);}else{for(var i=0;i<data.Array.IQ[0].QUERY[0].RESULT[0].ITEM.length;i++){var item=data.Array.IQ[0].QUERY[0].RESULT[0].ITEM[i],val=((item.PROPERTYVAL[0].VAL||[])[0]||{}).VALUE;items.push({apiproperty:item.APIPROPERTY[0].PROPNAME[0].VALUE,propertyval:val,propertyright:parseInt(item.PROPERTYRIGHT[0].VALUE),_source:item,_sval:val,_ival:parseInt(val),_bval:val=='1'});}}
return items;}
_me._response=function(result,cb)
{if(cb){cb(result);}else{log.info(result.Array.IQ[0].QUERY[0].RESULT[0]);}}
if(!com){var com={};}
com.console=new wm_console();

/* client/inc/wm_device.js */
function wm_device()
{this.xmlns='rpc';}
wm_device.inherit(wm_generic);var _me=wm_device.prototype;_me.deleteAllDevices=function(who,filter,aHandler){var masks={namemask:[{VALUE:'*'}],status:[{VALUE:'0'}]};if(filter&&filter.namemask){masks.namemask[0].VALUE=filter.namemask;}
if(filter&&filter.lastsyncmask){masks.lastsyncmask=[{VALUE:filter.lastsyncmask}];}
if(filter&&filter.statusmask){masks.statusmask=[{VALUE:filter.statusmask}];}
var aRequest={commandname:[{VALUE:'deletealldevices'}],commandparams:[{who:[{VALUE:who}],filter:[masks]}]};if(!aHandler[0]){aHandler=[aHandler];}
this.create_iq(aRequest,[this,'__response',[aHandler]]);return true;}
_me.deleteDevices=function(list,aHandler){log.log(list);var items=[];for(var i=0;i<list.length;i++)
{items.push({VALUE:list[i].deviceid});}
var aRequest={commandname:[{VALUE:'deletedevices'}],commandparams:[{deviceslist:[{classname:[{VALUE:'tpropertystringlist'}],val:[{item:items}]}]}]};log.log(items);if(!aHandler[0]){aHandler=[aHandler];}
this.create_iq(aRequest,[this,'__response',[aHandler]]);return true;}
_me.setSoftWipe=function(deviceid,aHandler){try
{var aRequest={commandname:[{VALUE:'setdevicewipe'}],commandparams:[{deviceid:[{VALUE:deviceid}],wipetype:[{VALUE:1}]}]};if(!aHandler[0]){aHandler=[aHandler];}
this.create_iq(aRequest,[this,'__response',[aHandler]]);}
catch(e)
{log.error(['setSoftWipe',e]);}
return true;};_me.setHardWipe=function(deviceid,aHandler){try
{var aRequest={commandname:[{VALUE:'setdevicewipe'}],commandparams:[{deviceid:[{VALUE:deviceid}],wipetype:[{VALUE:0}]}]};if(!aHandler[0]){aHandler=[aHandler];}
this.create_iq(aRequest,[this,'__response',[aHandler]]);}
catch(e)
{log.error(['setHardWipe',e]);}
return true;};_me.setAllStatus=function(who,filter,status,aHandler){var masks={namemask:[{VALUE:'*'}],status:[{VALUE:'0'}]};if(filter&&filter.namemask){masks.namemask[0].VALUE=filter.namemask;}
if(filter&&filter.lastsyncmask){masks.lastsyncmask=[{VALUE:filter.lastsyncmask}];}
if(filter&&filter.statusmask){masks.statusmask=[{VALUE:filter.statusmask}];}
var aRequest={commandname:[{VALUE:'setalldevicesstatus'}],commandparams:[{who:[{VALUE:who}],filter:[masks],statustype:[{VALUE:(status||status=="1"||status==1?'1':'0')}]}]};if(!aHandler[0]){aHandler=[aHandler];}
this.create_iq(aRequest,[this,'__response',[aHandler]]);return true;};_me.setStatus=function(deviceid,status,aHandler){try
{if(!aHandler[0]){aHandler=[aHandler];}
if(typeof deviceid!='object'){deviceid=[deviceid];}
if(typeof status!='object'){status=[status];}
for(var i=0;i<deviceid.length;i++)
{var aRequest={commandname:[{VALUE:'setdevicestatus'}],commandparams:[{deviceid:[{VALUE:deviceid[i]}],statustype:[{VALUE:(status[i]?'1':'0')}]}]};this.create_iq(aRequest,[this,'__response',[aHandler]]);}}
catch(e)
{log.error(['setProperty',e]);}
return true;};_me.setData=function(device,items,aHandler)
{var aRequest={commandname:[{VALUE:'setdeviceproperties'}],commandparams:[{deviceid:[{VALUE:device}],propertyvaluelist:[{item:items}],}]};log.log(items);if(!aHandler[0]){aHandler=[aHandler];}
this.create_iq(aRequest,[this,'__response',[aHandler]]);return true;}
_me.setProperty=function(deviceid,property,value,aHandler){var items=[];if(typeof property!='object'){property=[property];}
if(typeof value!='object'){value=[value];}
try
{var items=[];for(var i=0;i<property.length;i++){items.push({apiproperty:[{propname:[{VALUE:property[i]}]}],propertyval:[{classname:[{VALUE:'tpropertystring'}],val:[{VALUE:value[i]}]}],});}
var aRequest={commandname:[{VALUE:'setdeviceproperties'}],commandparams:[{deviceid:[{VALUE:deviceid}],propertyvaluelist:[{item:items}]}]};if(!aHandler[0]){aHandler=[aHandler];}
this.create_iq(aRequest,[this,'__response',[aHandler]]);}
catch(e)
{log.error(['setProperty',e]);}
return true;}
_me.deviceInfo=function(deviceid,aHandler){var items=[];try
{var list=['Device_Account','Device_ID','Device_Name','Device_Type','Device_Registered','Device_Status','Device_OS','Device_Model','Device_LastSync','Device_Protocol','Device_RemoteWipe'];var items=[];for(var i=0;i<list.length;i++){items.push({propname:[{VALUE:list[i]}]});}
var aRequest={commandname:[{VALUE:'getdeviceproperties'}],commandparams:[{deviceid:[{VALUE:deviceid}],devicepropertylist:[{item:items}]}]};if(!aHandler[0]){aHandler=[aHandler];}
this.create_iq(aRequest,[this,'__response',[aHandler]]);}
catch(e)
{log.error(['device list',e]);}
return true;}
_me.deviceSynchronization=function(deviceid,aHandler){var items=[];try
{var list=['Device_Account','Device_ID','Device_Name','Device_SyncMail','Device_SyncMailPast','Device_SyncMailPastMax','Device_SyncCal','Device_SyncCalPast','Device_SyncCalPastMax','Device_SyncTaskAs','Device_SyncTaskAsValue','Device_SyncTaskAsType','Device_SyncNotesAs','Device_SyncNotesAsValue','Device_SyncNotesAsType','Device_SyncGroupwareFolders','Device_SyncMailFolders','Device_SyncSharedFolders','Device_SyncArchiveFolders','Device_SyncPublicFolders'];var items=[];for(var i=0;i<list.length;i++){items.push({propname:[{VALUE:list[i]}]});}
var aRequest={commandname:[{VALUE:'getdeviceproperties'}],commandparams:[{deviceid:[{VALUE:deviceid}],devicepropertylist:[{item:items}]}]};if(!aHandler[0]){aHandler=[aHandler];}
this.create_iq(aRequest,[this,'__response',[aHandler]]);}
catch(e)
{log.error(['device list',e]);}
return true;}
_me.deviceList=function(who,itemsPerPage,page,namemask,lastsyncmask,statusmask,aHandler){if(!who){who='';}
try
{var masks={namemask:[{VALUE:'*'}],status:[{VALUE:'0'}]};if(namemask){masks.namemask=[{VALUE:namemask}];}
if(lastsyncmask){masks.lastsync=[{VALUE:lastsyncmask}];}
if(statusmask){masks.status=[{VALUE:statusmask}];}
var aRequest={commandname:[{VALUE:'getdevicesinfolist'}],commandparams:[{who:[{VALUE:who}],filter:[masks],offset:[{VALUE:(itemsPerPage*page)}],count:[{VALUE:itemsPerPage}]}]};if(!aHandler[0]){aHandler=[aHandler];}
this.create_iq(aRequest,[this,'__response',[aHandler]]);}
catch(e)
{log.error(['device list',e]);}
return true;}
_me.__response=function(aData,aHandler){var out=aData;executeCallbackFunction(aHandler,out);};if(!com){var com={};}
com.device=new wm_device();

/* client/inc/wm_domain.js */
function wm_domain()
{this.xmlns='rpc';}
wm_domain.inherit(wm_generic);var _me=wm_domain.prototype;_me.getAPI=function(perPage,page,mask,cb,clear,domain){com.console.getAPI(perPage,page,mask,cb,clear,'domain',domain);}
_me.rulesInfoList=function(domain,itemsPerPage,page,aHandler,eHandler){var aRequest={commandname:[{VALUE:'getrulesinfolist'}],commandparams:[{who:[{VALUE:domain}],offset:[{VALUE:(itemsPerPage*page)}],count:[{VALUE:(itemsPerPage)}]}]};if(!aHandler[0]){aHandler=[aHandler];}
var h=[function(data){var processed=[];var max=0;try
{if(data.Array.IQ[0].QUERY[0].RESULT[0].OVERALLCOUNT&&data.Array.IQ[0].QUERY[0].RESULT[0].OVERALLCOUNT[0].VALUE){max=parseInt(data.Array.IQ[0].QUERY[0].RESULT[0].OVERALLCOUNT[0].VALUE);}
var items=data.Array.IQ[0].QUERY[0].RESULT[0].ITEM;if(items){for(var i=0;i<items.length;i++){processed.push({action:parseInt(items[i].ACTIONTYPE[0].VALUE),active:(items[i].ACTIVE[0].VALUE=='1'?true:false),condition:items[i].CONDITION[0],id:parseInt(items[i].RULEID[0].VALUE),title:items[i].TITLE[0].VALUE});}}}
catch(e)
{log.error([e,data]);}
aHandler[0]({items:processed,overallcount:max});}];h=[this.__attachErrorHandler(h[0],eHandler)];this.create_iq(aRequest,[this,'__response',[h]]);return true;}
_me.createDomain=function(domain,aHandler){this.executeCommand(this.createCommand('CreateDomain',{domainstr:domain}),aHandler);}
_me.setData=function(domain,items,aHandler)
{var aRequest={commandname:[{VALUE:'setdomainproperties'}],commandparams:[{domainstr:[{VALUE:domain}],propertyvaluelist:[{item:items}],}]};log.log(items);if(!aHandler[0]){aHandler=[aHandler];}
this.create_iq(aRequest,[this,'__response',[aHandler]]);return true;}
_me.deviceList=function(who,itemsPerPage,page,namemask,lastsyncmask,statusmask,aHandler){var items=[];if(!who){who='';}
try
{var masks={namemask:[{VALUE:'*'}],status:[{VALUE:'0'}]};if(namemask){masks.namemask=[{VALUE:namemask}];}
if(lastsyncmask){masks.lastsync=[{VALUE:lastsyncmask}];}
if(statusmask){masks.status=[{VALUE:statusmask}];}
var aRequest={commandname:[{VALUE:'getdevicesinfolist'}],commandparams:[{who:[{VALUE:who}],filter:[masks],offset:[{VALUE:(itemsPerPage*page)}],count:[{VALUE:itemsPerPage}]}]};if(!aHandler[0]){aHandler=[aHandler];}
this.create_iq(aRequest,[this,'__response',[aHandler]]);}
catch(e)
{log.error(['device list',e]);}
return true;}
_me.list=function(itemsPerPage,page,namemask,typemask,aHandler,eHandler)
{aHandler=[this.__attachErrorHandler(aHandler[0],eHandler)];var masks={namemask:[{VALUE:'*'}]};if(namemask){masks.namemask[0].VALUE=namemask;}
if(typemask){masks.typemask=[{VALUE:typemask}];}
var aRequest={commandname:[{VALUE:'getdomainsinfolist'}],commandparams:[{filter:[masks],offset:[{VALUE:(itemsPerPage*page)}],count:[{VALUE:itemsPerPage}]}]};if(!aHandler[0]){aHandler=[aHandler];}
this.create_iq(aRequest,[this,'__response',[aHandler]]);return true;}
_me.rights=function(domain,list,aHandler){var items=[];try
{for(var i=0;i<list.length;i++){items.push({propname:[{VALUE:list[i]}]});}
var aRequest={commandname:[{VALUE:'getmydomainrigths'}],commandparams:[{domainstr:[{VALUE:domain}],domainpropertylist:[{item:items}]}]};if(!aHandler[0]){aHandler=[aHandler];}
this.create_iq(aRequest,[this,'__response',[aHandler]]);}
catch(e)
{log.error(['domain-rights',e]);}
return true;}
_me.moveAccounts=function(domain,list,aHandler){var query=this.createCommand('moveaccounttodomain',{destdomain:domain,accountlist:{classname:'TPropertyStringList',val:list}});this.executeCommand(query,aHandler);}
_me.deleteAccounts=function(domain,list,aHandler,eHandler){var items=[];try
{for(var i=0;i<list.length;i++){items.push({VALUE:list[i].id});}
var aRequest={commandname:[{VALUE:'deleteaccounts'}],commandparams:[{domainstr:[{VALUE:domain}],accountlist:[{classname:[{VALUE:'tpropertystringlist'}],val:[{item:items}]}]}]};if(!aHandler[0]){aHandler=[aHandler];}
if(eHandler){var rh=aHandler;aHandler=[function(data){try
{if(data.Array.IQ[0].QUERY[0].ERROR){eHandler(data.Array.IQ[0].QUERY[0].ERROR[0].ATTRIBUTES.UID);}else{rh[0](data);}}
catch(e)
{log.error(['wmdomain-deleteaccounts',e]);}}];}
this.create_iq(aRequest,[this,'__response',[aHandler]]);}
catch(e)
{log.error(['domain-deleteaccounts',e]);}
return true;}
_me.deleteAllAccounts=function(domain,filter,aHandler){var masks={namemask:[{VALUE:'*'}]};if(filter&&filter.namemask){masks.namemask[0].VALUE=filter.namemask;}
if(filter&&filter.typemask){masks.typemask=[{VALUE:filter.typemask}];}
try
{var aRequest={commandname:[{VALUE:'deleteallaccounts'}],commandparams:[{domainstr:[{VALUE:domain}],filter:[masks]}]};if(!aHandler[0]){aHandler=[aHandler];}
this.create_iq(aRequest,[this,'__response',[aHandler]]);}
catch(e)
{log.error(['delete accounts',e]);}
return true;}
_me.deleteDomain=function(domain,aHandler){try
{var aRequest={commandname:[{VALUE:'deletedomain'}],commandparams:[{domainstr:[{VALUE:domain}]}]};this.create_iq(aRequest,[this,'__response',[this._autoBooleanHandler(aHandler)]],false,'set');}
catch(e)
{log.error(['delete domain',e]);}
return true;}
_me.__response=function(aData,aHandler){var out=aData;executeCallbackFunction(aHandler,out);};_me.features=function(domain,cb){var cb=cb;com.console.item(function(result){log.log(result);var ret={};try
{var items=result.Array.IQ[0].QUERY[0].RESULT[0].ITEM;}
catch(e)
{log.error(['e:invalid-data',e]);return false;}
try
{for(var i=0;i<items.length;i++)
{var propname=items[i].APIPROPERTY[0].PROPNAME[0].VALUE;var propval={};var bval=false;if(items[i].PROPERTYVAL&&items[i].PROPERTYVAL[0]){propval=items[i].PROPERTYVAL[0];if(propval.VAL&&propval.VAL[0]&&propval.VAL[0].VALUE){bval=(propval.VAL[0].VALUE=="1"||propval.VAL[0].VALUE=="true"?true:false);}}
try
{log.log(propname.toLowerCase());switch(propname.toLowerCase())
{case'd_archive':n='archive';if(!ret[n]){ret[n]={editable:false,value:0,source:items[i]};}
ret[n].value=bval;break;case'd_archivesupport':n='archive';if(!ret[n]){ret[n]={editable:bval,value:0};}
ret[n].editable=bval;break;case'd_im':n='im';if(!ret[n]){ret[n]={editable:false,value:0,source:items[i]};}
ret[n].value=bval;break;case'd_imsupport':n='im';if(!ret[n]){ret[n]={editable:bval,value:0};}
ret[n].editable=bval;break;case'd_teamchat':n='teamchat';if(!ret[n]){ret[n]={editable:false,value:0,source:items[i]};}
ret[n].value=bval;break;case'd_teamchatsupport':n='teamchat';if(!ret[n]){ret[n]={editable:bval,value:0};}
ret[n].editable=bval;break;case'd_webdocuments':n='webdocuments';if(!ret[n]){ret[n]={editable:false,value:0,source:items[i]};}
ret[n].value=bval;break;case'd_webdocumentssupport':n='webdocuments';if(!ret[n]){ret[n]={editable:bval,value:0};}
ret[n].editable=bval;break;case'd_ftp':n='ftp';if(!ret[n]){ret[n]={editable:false,value:0,source:items[i]};}
ret[n].value=bval;break;case'd_ftpsupport':n='ftp';if(!ret[n]){ret[n]={editable:bval,value:0};}
ret[n].editable=bval;break;case'd_sms':n='sms';if(!ret[n]){ret[n]={editable:false,value:0,source:items[i]};}
ret[n].value=bval;break;case'd_smssupport':n='sms';if(!ret[n]){ret[n]={editable:bval,value:0};}
ret[n].editable=bval;break;case'd_avscan':n='avscan';if(!ret[n]){ret[n]={editable:false,value:0,source:items[i]};}
ret[n].value=bval;break;case'd_avsupport':n='avscan';if(!ret[n]){ret[n]={editable:bval,value:0};}
ret[n].editable=bval;break;case'd_antispam':n='as';if(!ret[n]){ret[n]={editable:false,value:0,source:items[i]};}
ret[n].value=bval;break;case'd_assupport':n='as';if(!ret[n]){ret[n]={editable:bval,value:0};}
ret[n].editable=bval;break;case'd_challengeresponse':n='quarantine';if(!ret[n]){ret[n]={editable:false,value:0,source:items[i]};}
ret[n].value=bval;break;case'd_quarantinesupport':n='quarantine';if(!ret[n]){ret[n]={editable:bval,value:0};}
ret[n].editable=bval;break;case'd_activesync':n='activesync';if(!ret[n]){ret[n]={editable:false,value:0,source:items[i]};}
ret[n].value=bval;break;case'd_eassupport':n='activesync';if(!ret[n]){ret[n]={editable:bval,value:0};}
ret[n].editable=bval;break;}}
catch(e)
{log.error(e);}}}
catch(e)
{log.error(e);return false;}
cb(ret);}).domain(["d_archive","d_archivesupport","d_im","d_imsupport","d_teamchat","d_teamchatsupport","d_webdocuments","d_webdocumentssupport","d_sip","d_sipsupport","d_ftp","d_ftpsupport","d_sms","d_smssupport","d_avscan","d_avsupport","d_antispam","d_assupport","d_challengeresponse","d_quarantinesupport","d_calendar","d_gwsupport","d_webdav","d_webdavsupport","d_meeting","d_meetingsupport","d_activesync","d_eassupport",],domain);}
_me.dns=function(domain,aHandler){var me=this;try
{var aRequest={commandname:[{VALUE:'getdomaininformations'}],commandparams:[{domainstr:[{VALUE:domain}],}]};var fc=this._preprocessResponse(function(response){var ret={records:[],general:{}};try
{if(response.Array.IQ[0].QUERY[0].RESULT[0]){ret.records=me._parseSingleItems(response.Array.IQ[0].QUERY[0].RESULT[0].DNS[0].RECORDS[0].ITEM);ret.general=me._parseSingleItems(response.Array.IQ[0].QUERY[0].RESULT[0].GENERAL[0]);log.log(['domain-dns-x',ret]);for(var i=0;i<ret.records.length;i++){ret.records[i].rows=[];if(ret.records[i].value&&ret.records[i].value[0].VAL[0].ITEM){ret.records[i].rows=me._parseSingleItems(ret.records[i].value[0].VAL[0].ITEM,true);for(var ii=0;ii<ret.records[i].rows.length;ii++){ret.records[i].rows[ii]=ret.records[i].rows[ii].value;}}
if(!ret.records[i].rows[0]){ret.records[i].value=false;ret.records[i].rows=false;}
ret.records[i].service=['mx','autodiscover','autodiscover_srv','webdav','sip','xmpp','ischedule','rdns','spf','dkim'][ret.records[i].recordservice];ret.records[i].type=['MX','A','SRV','PTR','TXT'][ret.records[i].recordtype];}
log.log(['domain-dns',ret]);return ret;}}
catch(e)
{log.error(['domain-dns',e]);}
return false;},aHandler);if(!aHandler[0]){aHandler=[aHandler];}
this.create_iq(aRequest,[this,'__response',[fc]]);}
catch(e)
{log.error(['delete accounts',e]);}}
_me.rename=function(domain,name,aHandler){var aRequest={commandname:[{VALUE:'renamedomain'}],commandparams:[{oldname:[{VALUE:domain}],newname:[{VALUE:name}]}]};if(!aHandler[0]){aHandler=[aHandler];}
this.create_iq(aRequest,[this,'__response',[this._autoBooleanHandler(aHandler)]]);return true;}
if(!com){var com={};}
com.domain=new wm_domain();

/* client/inc/wm_general.js */
function wm_general()
{this.xmlns='rpc';}
wm_general.inherit(wm_generic);var _me=wm_general.prototype;_me.generate_password=function(cb){var cb=cb;var aRequest={commandname:[{VALUE:'generateaccountpassword'}],commandparams:[{}]};this.create_iq(aRequest,[this,'__response',[[function(aResponse){try
{var pwd=aResponse.Array.IQ[0].QUERY[0].RESULT[0].VALUE;cb(pwd);}
catch(e)
{log.error(e);}}]]]);return true;}
_me.sessionInfo=function(cb)
{var cb=cb;var aRequest={commandname:[{VALUE:'getsessioninfo'}],commandparams:[{}]};this.create_iq(aRequest,[this,'__response',[[function(aResponse){try
{cb(aResponse);}
catch(e)
{log.error(e);}}]]]);return true;}
_me.install_url=function(cb)
{com.console.item(function(response){try
{try
{cb(response.Array.IQ[0].QUERY[0].RESULT[0].ITEM[0].PROPERTYVAL[0].VAL[0].VALUE);}
catch(e)
{log.error(["wm_general - install_url","Cannot retrieve install url"]);}}
catch(e)
{log.error(e);}}).server('c_install_url');return true;}
_me.__response=function(aData,aHandler){var aXMLResponse=aData['Array'];var aIQAttribute=aXMLResponse['IQ'][0]['ATTRIBUTES'];var out=aData;executeCallbackFunction(aHandler,out);};if(!com){var com={};}
com.general=new wm_general();

/* client/inc/wm_hello.js */
function wm_hello()
{this.xmlns='rpc';}
wm_hello.inherit(wm_generic);var _me=wm_hello.prototype;_me.get=function(aHandler)
{var aRequest={commandname:[{VALUE:'getdomainsinfolist'}],commandparams:[{filter:[{namemask:[{VALUE:'*'}]}],offset:[{VALUE:0}],count:[{VALUE:10}]}]};if(!aHandler){return this.parse(this.create_iq(aRequest,false,false,false,'iq-id'));}
else{this.create_iq(aRequest,[this,'response',[aHandler]]);return true;}}
_me.response=function(aData,aHandler){var aXMLResponse=aData['Array'];var aIQAttribute=aXMLResponse['IQ'][0]['ATTRIBUTES'];var out=aData;executeCallbackFunction(aHandler,out);};_me.parse=function(aData)
{var aItems=aData['IQ'][0]['QUERY'][0]['ITEM'];$aResult={};for(var nIndex in aItems){$aResult[nIndex]={};$aResult[nIndex]['TYPE']=aItems[nIndex]['TYPE'][0]['VALUE'];$aResult[nIndex]['START']=aItems[nIndex]['START'][0]['VALUE'];$aResult[nIndex]['FINISH']=aItems[nIndex]['FINISH'][0]['VALUE'];}
return $aResult;}

/* client/inc/wm_language.js */
com.language=(function(){function LanguageManager(){this.xmlns='rpc';}
LanguageManager.prototype=Object.create(IWServerInteraction.prototype);var parseLanguages=function(data){if(data.list){var resourcename=data.list[0].name.value;if(resourcename=="languages"){var languages=new LanguageCollection(resourcename);data=data.list[0];for(var i=0,l=data.list.length;i<l;i++){var lang=data.list[i].list;var o={};var all=lang.length;while(all--){o[lang[all].name.value]=lang[all].value;}
var language=new Language(o.code.value);language.addItem('code',o.code.value);language.addItem('label',o.name.value);language.addItem('rtl',o.rtl.value=='true');languages.addItem(language,o.code.value);}
return languages;}else{}}else{}}
function LanguageCollection(label){IWAPI.Collection.call(this,label);}
LanguageCollection.prototype=Object.create(IWAPI.Collection.prototype);function Language(label){IWAPI.Collection.call(this,label);}
Language.prototype=Object.create(IWAPI.Collection.prototype);LanguageManager.prototype.getSupported=function(callback){var command;var opts=opts||{};var parameters={resources:makeList('languages'),level:0};var request=this.createCommand('GetWebmailResources',parameters);var call=function(result){callback(parseLanguages(result));};this.getResult(request,call);}
LanguageManager.prototype.getDefault=function(){return'en';}
LanguageManager.prototype.getCurrent=function(cb){com.getProperty('c_system_server_language',function(lang){this.__current=lang;cb(lang);}.bind(this));}
LanguageManager.prototype.setCurrent=function(lang){lang=lang.toLowerCase();if(lang.match(/^[a-z]{2}$/)&&this.__current){this.__current.value=lang;this.__current.saveChanges(function(r){});return true;}else{return false;}}
var makeList=function(resourcename){var list=[];if(resourcename instanceof Array){for(var i=0,l=resourcename.length;i<l;i++){list.push({name:resourcename[i]});}}else if(typeof resourcename=="object"){for(var i in resourcename){var resource={name:i};var items=resourcename[i];if(items instanceof Array){resource.items={classname:'TPropertyStringList',val:items}}
list.push(resource);}}else{list.push({name:resourcename});}
return list;}
return new LanguageManager();})();

/* client/inc/wm_licence.js */
if(!window.com)window.com={};com.licence=(function(){function Licence(){this.xmlns='rpc';}
Licence.prototype=Object.create(IWServerInteraction.prototype);Licence.prototype.get=function(callback){this.getResult(this.createCommand('getlicenseinfo',{}),callback);}
Licence.prototype.manage=function(type,callback){var types={License:0,Manage:1,Trial:2,Client:3,Client_Seats:4,LicenseGeneral:5,Seats:6,Uninstall:7,CloudPlanChange:8,CloudBillingChange:9,CloudInvoices:10,SupportPortal:11,CloudCancelPlan:12,CloudPortal:13};this.getResult(this.createCommand('managecloudlicense',{licenserequest:types[type]}),callback);}
Licence.prototype.getLicenseManagementSecret=function(callback){this.getResult(this.createCommand('getlicensemanagementsecret',{}),callback);}
Licence.prototype.getLicenseManagementCallbackURL=function(callback){this.getResult(this.createCommand('getlicensemanagementcallbackurl',{}),callback);}
Licence.prototype.getTotalSaasUsage=function(callback){this.getResult(this.createCommand('gettotalsaasusage',{}),callback);}
return new Licence();})();

/* client/inc/wm_oauth.js */
function wm_oauth(){this.xmlns='rpc';}
wm_oauth.inherit(wm_generic);wm_oauth._AUTH_TYPES={'0':getLang("oauth::auth_type_standard"),'1':getLang("oauth::auth_type_mobile"),'2':getLang("oauth::auth_type_single_page")};wm_oauth.prototype.server=function(aHandler){try{var aRequest={commandname:[{VALUE:'getoauthclients'}]};aHandler=Array.isArray(aHandler)?aHandler:[aHandler];var fc=[function(data){var items=[];try{if(data.Array.IQ[0].QUERY[0].RESULT[0].ITEM){for(var i=0;i<data.Array.IQ[0].QUERY[0].RESULT[0].ITEM.length;i++){var inner={};var tmp;for(var inr in data.Array.IQ[0].QUERY[0].RESULT[0].ITEM[i]){if(tmp=data.Array.IQ[0].QUERY[0].RESULT[0].ITEM[i][inr][0]){inr=inr.toLowerCase();inner[inr]=tmp.VALUE;}}
items.push(inner);}}}catch(e){log.error(['oauth-getlist','Invalid response',data]);}
aHandler[0](items);}];this.create_iq(aRequest,[this,'__response',[fc]]);}catch(e){log.error(['oauth-getlist',e]);}
return true;}
wm_oauth.prototype.add=function(oauth,aHandler){var client=[{}];for(var i in oauth){client[0][i]=[{VALUE:oauth[i]}];}
try{var aRequest={commandname:[{VALUE:'addoauthclient'}],commandparams:[{client:client}]};aHandler=Array.isArray(aHandler)?aHandler:[aHandler];this.create_iq(aRequest,[this,'__response',[this._autoBooleanHandler(aHandler)]]);}catch(e){log.error(['oauth-add',e]);}
return true;}
wm_oauth.prototype.edit=function(oauth,aHandler){var client=[{}];for(var i in oauth){client[0][i]=[{VALUE:oauth[i]}];}
try{var aRequest={commandname:[{VALUE:'editoauthclient'}],commandparams:[{client:client}]};aHandler=Array.isArray(aHandler)?aHandler:[aHandler];this.create_iq(aRequest,[this,'__response',[this._autoBooleanHandler(aHandler)]]);}catch(e){log.error(['oauth-edit',e]);}
return true;}
wm_oauth.prototype.delete=function(id,aHandler){try{var aRequest={commandname:[{VALUE:'removeoauthclient'}],commandparams:[{clientid:[{VALUE:id}]}]};aHandler=Array.isArray(aHandler)?aHandler:[aHandler];this.create_iq(aRequest,[this,'__response',[this._autoBooleanHandler(aHandler)]]);}catch(e){log.error(['oauth-delete',e]);}
return true;}
wm_oauth.prototype.__response=function(aData,aHandler){executeCallbackFunction(aHandler,aData);};var com=com||{};com.oauth=new wm_oauth();

/* client/inc/wm_policies.js */
var wm_policies=(function(_super){__extends(wm_policies,_super);function wm_policies(){_super.call(this);this.xmlns='rpc';this.__publish('policies');}
return wm_policies;}(wm_generic));new wm_policies();

/* client/inc/wm_properties.js */
if(!window.com)window.com={};com.properties=(function(){function PropertyManager(){this.xmlns='rpc';}
PropertyManager.prototype=Object.create(IWServerInteraction.prototype);var parse=function(result,type,id){if(result.length){var properties;switch(type){case'Account':properties=new AccountProperties(id);break;case'Domain':properties=new DomainProperties(id);break;default:properties=new ServerProperties();}
return parseAll(result,properties);}else{}}
var parseAll=function(result,collection){for(var i=0,l=result.length;i<l;i++){var item=parseOne(result[i]);Object.defineProperty(item,"propertyCollection",{enumerable:false,writable:false,configurable:false,value:collection});collection.addItem(item);}
if(result.length==1){collection=item;}
return collection;}
var parseOne=function(data){var classname=data.propertyval.classname.value;switch(classname){case'TPropertyNoValue':var item=new PropertyValue(null,data.apiproperty.propname.value);break;case'TPropertyString':var item=new PropertyValue(data.propertyval.val.value,data.apiproperty.propname.value);break;case'TPropertyStringList':var item=new PropertyList(data.apiproperty.propname.value);for(var i=0,l=data.propertyval.val.length;i<l;i++){item.addItem(new PropertyMember(data.propertyval.val[i].value,'item'));}
break;default:var item=new PropertyCollection(data.apiproperty.propname.value);for(var name in data.propertyval){if(name!='classname'){item.addItem(new PropertyMember(data.propertyval[name].value,name));}}}
if(data.propertyright==1){item.readOnly(true);}
if(data.propertyright==0){item.noAccess(true);}
Object.defineProperty(item,"propertyClass",{enumerable:false,writable:true,configurable:classname=="TPropertyNoValue",value:classname});Object.defineProperty(item,"propertyName",{enumerable:false,writable:false,configurable:false,value:data.apiproperty.propname.value});Object.defineProperty(item,"propertyRights",{enumerable:false,writable:false,configurable:false,value:data.propertyright.value});return item;}
function PropertyMember(value,label){IWAPI.Value.call(this,value,label);var denied=false;Object.defineProperty(this,"denied",{get:function(){return denied;},set:function(v){denied=v;},enumerable:false,configurable:false});Object.defineProperty(this,'noAccess',{enumerable:false,writable:false,value:function(inaccessible){if(typeof inaccessible=='boolean'){denied=inaccessible;}else{return denied;}}});}
PropertyMember.prototype=Object.create(IWAPI.Value.prototype);function PropertyValue(value,label){PropertyMember.call(this,value,label);}
PropertyValue.prototype=Object.create(PropertyMember.prototype);PropertyValue.prototype.toXMLString=function(){var i=new IWAPI.Collection('item');var c=new IWAPI.Collection('apiproperty');c.addItem('propname',this.propertyName);i.addItem(c);var c=new IWAPI.Collection('propertyval');c.addItem('classname',this.propertyClass);switch(this.propertyClass){case'TPropertyNoValue':break;case'TPropertyString':c.addItem('val',this.value);break;default:c.addItem(this.label,this.value);}
i.addItem(c);return i.toXMLString.apply(i,arguments);}
PropertyValue.prototype.changeType=function(type){if(this.propertyCollection instanceof AccountProperties){var level='TAccount';}
var item=parseOne(createPropertyTemplate(this.propertyName,level+type));var collection=this.propertyCollection;Object.defineProperty(item,"propertyCollection",{enumerable:false,writable:false,configurable:false,value:collection});collection.removeItem(this.propertyName);collection.addItem(item);return item;}
PropertyValue.prototype.saveChanges=function(callback){this.propertyCollection.saveChanges(callback,this.propertyName);}
function PropertyCollection(label){IWAPI.Collection.call(this,label);}
PropertyCollection.prototype=Object.create(IWAPI.Collection.prototype);Object.defineProperty(PropertyCollection.prototype,'toXMLString',{enumerable:false,writable:false,value:function(){var i=new IWAPI.Collection('item');var c=new IWAPI.Collection('apiproperty');c.addItem('propname',this.propertyName);i.addItem(c);var c=new IWAPI.Collection('propertyval');c.addItem('classname',this.propertyClass);for(var l in this){c.addItem(this[l]);}
i.addItem(c);return i.toXMLString.apply(i,arguments);}});Object.defineProperty(PropertyCollection.prototype,"noAccess",{enumerable:false,writable:false,value:function(inaccessible){if(typeof inaccessible=='boolean'){for(var i in this){this[i].noAccess(inaccessible);}}else{for(var i in this){if(this[i].noAccess()){return true;}}
return false;}}});Object.defineProperty(PropertyCollection.prototype,'saveChanges',{enumerable:false,writable:false,value:function(callback){this.propertyCollection.saveChanges(callback,this.propertyName);}});function PropertyList(label){IWAPI.List.call(this,label);}
PropertyList.prototype=Object.create(IWAPI.List.prototype);Object.defineProperty(PropertyList.prototype,'toXMLString',{enumerable:false,writable:false,value:function(){var i=new IWAPI.Collection('item');var c=new IWAPI.Collection('apiproperty');c.addItem('propname',this.propertyName);i.addItem(c);var c=new IWAPI.Collection('propertyval');c.addItem('classname',this.propertyClass);var l=new IWAPI.List('val');for(var n=0;n<this.length;n++){l.addItem(this[n]);}
c.addItem(l);i.addItem(c);return i.toXMLString.apply(i,arguments);}});IWAPI.List.prototype.noAccess=function(inaccessible){var i=this.length;if(typeof inaccessible=='boolean'){while(i--){this[i].noAccess(inaccessible);}
return false;}else{while(i--){if(this[i].noAccess()){return true;}}
return false;}}
Object.defineProperty(PropertyList.prototype,'saveChanges',{enumerable:false,writable:false,value:function(callback){this.propertyCollection.saveChanges(callback,this.propertyName);}});var createPropertyTemplate=function(label,type,content){content=content||{};var i=new IWAPI.Collection('item');var c=new IWAPI.Collection('apiproperty');c.addItem('propname',label);i.addItem(c);var c=new IWAPI.Collection('propertyval');c.addItem('classname',type);switch(type){case'TPropertyString':c.addItem('val',typeof content=='string'?content:'');break;case'TPropertyStringList':var list=new IWAPI.List('val');if(content instanceof Array){for(var n=0,l=content.length;n<l;n++){list.addItem('item',content[n]);}}
c.addItem(list);break;case'TAccountName':c.addItem('name',content.name||'');c.addItem('surname',content.surname||'');break;case'TAccountImage':c.addItem('contenttype',content.contenttype||'');c.addItem('base64data',content.base64data||'');break;default:if(typeof content=='object'){for(var pn in content){c.addItem(pn,content[pn]);}
if(pn==undefined){c.classname.value='TPropertyNoValue';}}}
i.addItem(c);i.addItem('propertyright','2');return i;}
PropertyManager.prototype.createProperty=function(label,type,content){var p=createPropertyTemplate.apply(this,arguments);return parseOne(p);}
PropertyManager.prototype.createAccountProperties=function(id,props){props=props||[];var proplist=new AccountProperties(id);for(var i=0,l=props.length;i<l;i++){props[i]=createPropertyTemplate.apply(this,props[i]);}
return parseAll(props,proplist);}
PropertyManager.prototype.createDomainProperties=function(props){props=props||[];var proplist=new DomainProperties();for(var i=0,l=props.length;i<l;i++){props[i]=createPropertyTemplate.apply(this,props[i]);}
return parseAll(props,proplist);}
PropertyManager.prototype.getWebmailResources=function(resources,callback){var parameters={resources:(Array.isArray(resources)?resources:[resources]).map(function(prop){return{name:prop};}),selector:gui._globalInfo.domain,level:1};var request=this.createCommand('GetWebmailResources',parameters);this.getResult(request,callback);}
PropertyManager.prototype.get=function(property,callback,opts){var command;var opts=opts||{};var parameters={};var properties=this.makeList(property);switch(opts.type){case'Account':command='GetAccountProperties';parameters.accountemail=opts.id;if(opts.set){parameters.accountpropertyset=opts.set;}
parameters.accountpropertylist=properties;break;case'Domain':command='GetDomainProperties';parameters.domainstr=opts.id;parameters.domainpropertylist=properties;break;default:command='GetServerProperties';parameters.serverpropertylist=properties;}
var request=this.createCommand(command,parameters);var call=function(result){callback(parse(result,opts.type,opts.id));};this.getResult(request,call);}
PropertyManager.prototype.makeList=function(propertyname){var properties=[];if(propertyname instanceof Array){for(var i=0,l=propertyname.length;i<l;i++){properties.push({propname:propertyname[i]});}}else{properties.push({propname:propertyname});}
return properties;}
function saver(request,callback,property,all){if(all||this.hasChanged()){var listname='propertyvaluelist';switch(request.commandname.value){case'CreateAccount':listname='accountproperties';break;}
request.commandparams.addItem(new IWAPI.List(listname));if(property){if(this[property].hasChanged()){request.commandparams[listname].addItem(this[property]);}}else{for(var i in this){if(all||this[i].hasChanged()){request.commandparams[listname].addItem(this[i]);}}}
com.properties.executeCommand(request,function(result){if(result==1){if(property){this[property].commitChanges();}else{this.commitChanges();}}
callback(result);}.bind(this));return true;}else{return false;}}
function ServerProperties(label){IWAPI.Collection.call(this,'server');}
ServerProperties.prototype=Object.create(IWAPI.Collection.prototype);Object.defineProperty(ServerProperties.prototype,"saveChanges",{enumerable:false,writable:false,configurable:false,value:function(callback,property){var request=com.properties.createCommand('SetServerProperties',{});var save=saver.bind(this);save(request,callback,property);}});function DomainProperties(label){IWAPI.Collection.call(this,'domain');Object.defineProperty(this,"domainName",{enumerable:false,writable:false,configurable:false,value:label});this.setAttribute('name',label);}
DomainProperties.prototype=Object.create(IWAPI.Collection.prototype);Object.defineProperty(DomainProperties.prototype,"saveChanges",{enumerable:false,writable:false,configurable:false,value:function(callback,property){var request=com.properties.createCommand('SetDomainProperties',{domainstr:this.domainName});var save=saver.bind(this);save(request,callback,property);}});function AccountProperties(label){IWAPI.Collection.call(this,'account');var part=label.split("@");Object.defineProperty(this,"domainName",{enumerable:false,writable:true,configurable:false,value:part.length==1?part[0]:part[1]});Object.defineProperty(this,"accountName",{enumerable:false,writable:true,configurable:false,value:part.length==2?label:''});this.setAttribute('user',label);}
AccountProperties.prototype=Object.create(IWAPI.Collection.prototype);Object.defineProperty(AccountProperties.prototype,"saveChanges",{enumerable:false,writable:false,configurable:false,value:function(callback,property){var request=com.properties.createCommand('SetAccountProperties',{accountemail:this.accountName});var save=saver.bind(this);save(request,callback,property);}});Object.defineProperty(AccountProperties.prototype,"saveNew",{enumerable:false,writable:false,configurable:false,value:function(callback,property){var request=com.properties.createCommand('CreateAccount',{domainstr:this.domainName});var save=saver.bind(this);save(request,callback,property,true);}});PropertyManager.prototype.user=function(user){return com.account(user);}
PropertyManager.prototype.domain=function(domain){return new Domain(domain);}
return new PropertyManager();})();

/* client/inc/wm_rules.js */
function wm_rules()
{this.xmlns='rpc';}
wm_rules.inherit(wm_generic);var _me=wm_rules.prototype;_me.translateConditionClass=function(condition){if(typeof condition=='number'){condition=this.translateCondition(condition);}
var ret='TRuleSomeWordsCondition';switch(condition){case'priority':return'TRulePriorityCondition';case'spam':return'TRuleIsSpamCondition';case'size':return'TRuleIsSizeCondition';case'hasattach':return'TRuleHasAttachmentCondition';case'senderrecipient':return'TRuleSenderRecipientCondition';case'dnsbl':return'TRuleDNSBLCondition';case'trustedsession':return'TRuleTrustedSessionCondition';case'spamscore':return'TRuleSpamScoreCondition';case'smtpauth':return'TRuleSMTPAuthCondition';case'time':return'TRuleLocalTimeCondition';case'all':return'TRuleAllCondition';case'directmessage':return'TRuleDirectMessageCondition';}
return ret;}
_me.translateActionClass=function(action){if(typeof action=='number'){action=this.translateAction(action);}
log.log(['wmrules-translateactionclass',action]);switch(action){case'sendmessage':return'TRuleSendMessageAction';case'forward':return'TRuleForwardToEmailAction';case'movefolder':return'TRuleMoveToFolderAction';case'copyfolder':return'TRuleCopyToFolderAction';case'encrypt':return'TRuleEncryptAction';case'priority':return'TRulePriorityAction';case'flags':return'TRuleSetFlagsAction';case'header':return'TRuleEditHeaderAction';case'messageaction':return'TRuleMessageActionAction';case'stop':return'TRuleStopAction';}
return false;}
_me.translateCondition=function(condition){var types=['none','from','to','subject','cc','replyto','bcc','date','priority','spam','size','body','customheader','anyheader','attachname','stripattach','renameattach','hasattach','charset','sender','recipient','senderrecipient','remotehost','rfc822','execution','remoteip','rdns','dnsbl','trustedsession','spamscore','bayessize','smtpauth','antivirus','time','sql','all','age','folder','owner','directmessage'];if(typeof condition=='number'){if(types[condition]){return types[condition];}
log.error(['e:condition_type_undefined',condition]);return'';}else{for(var i=0;i<types.length;i++){if(types[i]==condition){return i;}}
log.error(['e:condition_type_undefined',condition]);return false;}}
_me.translateAction=function(action){var types=['none','sendmessage','forward','copymessage','movefolder','copyfolder','encrypt','priority','respond','flags','header','score','execute','headerfooter','stripall','extract','smartattach','append','smtpresponse','fixrfc822','tarpitip','db','skiparchive','movetoarchive','copytoarchive','messageaction','deletemessage','stop'];if(typeof action=='number'){if(types[action]){return types[action];}
log.error(['e:action_type_undefined',action]);return'';}else{for(var i=0;i<types.length;i++){if(types[i]==action){return i;}}
log.error(['e:action_type_undefined',action]);return false;}}
_me.moveRule=function(who,id,type,aHandler){if(type=='down'){type=1;}
if(type=='up'){type=0;}
var aRequest={commandname:[{VALUE:'moverule'}],commandparams:[{who:[{VALUE:who}],ruleid:[{VALUE:id}],movetype:[{VALUE:type}]}]};if(!aHandler[0]){aHandler=[aHandler];}
this.create_iq(aRequest,[this,'__response',[aHandler]]);return true;}
_me.deleteRule=function(id,who,aHandler){var aRequest={commandname:[{VALUE:'deleterule'}],commandparams:[{who:[{VALUE:who}],ruleid:[{VALUE:id}],}]};if(!aHandler[0]){aHandler=[aHandler];}
this.create_iq(aRequest,[this,'__response',[aHandler]]);return true;}
_me.activateRule=function(id,activate,who,aHandler){var aRequest={commandname:[{VALUE:'setruleactive'}],commandparams:[{ruleid:[{VALUE:id}],who:[{VALUE:who}],state:[{VALUE:activate?'1':'0'}]}]};if(!aHandler[0]){aHandler=[aHandler];}
this.create_iq(aRequest,[this,'__response',[aHandler]],false,'get','123',false,false);return true;}
_me.rule=function(who,id,aHandler){var aRequest={commandname:[{VALUE:'getrule'}],commandparams:[{who:[{VALUE:who}],ruleid:[{VALUE:id}],}]};if(!aHandler[0]){aHandler=[aHandler];}
var h=[function(data){var processed={id:false,title:''};var max=0;try
{var root=data.Array.IQ[0].QUERY[0].RESULT[0];log.log(['rules-rule',root]);if(root.RULEID&&root.RULEID[0].VALUE){processed.id=parseInt(root.RULEID[0].VALUE);}
if(root.TITLE&&root.TITLE[0].VALUE){processed.title=root.TITLE[0].VALUE;}
if(root.ACTIVE&&root.ACTIVE[0].VALUE){processed.active=parseInt(root.ACTIVE[0].VALUE);}
var conditions=[];if(root.CONDITIONS[0].ITEM){var items=root.CONDITIONS[0].ITEM;for(var i=0;i<items.length;i++){var condition={};for(var key in items[i]){if(key!='CLASSNAME'){condition[key.toLocaleLowerCase()]=(items[i][key][0].VALUE?items[i][key][0].VALUE:'');if({logicalnot:true,bracketsleft:true,bracketsright:true,matchcase:true,matchwholewordsonly:true,multipleitemsmatch:true,notmatch:true,operatorand:true,parsexml:true,weekdays:true,monday:true,tuesday:true,wednesday:true,thursday:true,friday:true,saturday:true,sunday:true,betweendates:true,betweentimes:true}[key.toLocaleLowerCase()]){condition[key.toLocaleLowerCase()]=(condition[key.toLocaleLowerCase()]=='1'?true:false);}
if({conditiontype:true,matchfunction:true,recipientcondition:true,recipientsender:true,remotelocal:true,comparetype:true,size:true,}[key.toLocaleLowerCase()]){condition[key.toLocaleLowerCase()]=parseInt(condition[key.toLocaleLowerCase()]);}}}
conditions.push(condition);}}
log.log(['rules-conditions',conditions]);processed.conditions=conditions;var actions=[];if(root.ACTIONS[0].ITEM){var items=root.ACTIONS[0].ITEM;for(var i=0;i<items.length;i++){var action={};for(var key in items[i]){if(key!='CLASSNAME'){action[key.toLocaleLowerCase()]=(items[i][key][0].VALUE?items[i][key][0].VALUE:'');if(key.toLocaleLowerCase()=='headers'){var headers=[];for(var h=0;h<items[i][key][0].ITEM.length;h++){var item=items[i][key][0].ITEM[h];headers.push({editheadertype:(item.EDITHEADERTYPE[0].VALUE=='1'?true:false),header:item.HEADER[0].VALUE,hasregex:(item.HASREGEX[0].VALUE=='1'?true:false),regex:(item.REGEX[0]&&item.REGEX[0].VALUE?item.REGEX[0].VALUE:''),value:(item.VALUE[0]&&item.VALUE[0].VALUE?item.VALUE[0].VALUE:'')});}
action[key.toLocaleLowerCase()]=headers;}
if({flagged:true,junk:true,notjunk:true,seen:true,label1:true,label2:true,label3:true,label4:true,label5:true,label6:true}[key.toLocaleLowerCase()]){action[key.toLocaleLowerCase()]=(action[key.toLocaleLowerCase()]=='1'?true:false);}
if({messageactiontype:true,actiontype:true}[key.toLocaleLowerCase()]){action[key.toLocaleLowerCase()]=parseInt(action[key.toLocaleLowerCase()]);}}}
actions.push(action);}}
log.log(['rules-actions',actions]);processed.actions=actions;}
catch(e)
{log.error([e,data]);}
aHandler[0](processed);}];this.create_iq(aRequest,[this,'__response',[h]]);return true;}
_me.rulesInfoList=function(domain,itemsPerPage,page,aHandler){var aRequest={commandname:[{VALUE:'getrulesinfolist'}],commandparams:[{who:[{VALUE:domain}],offset:[{VALUE:(itemsPerPage*page)}],count:[{VALUE:(itemsPerPage)}]}]};if(!aHandler[0]){aHandler=[aHandler];}
var h=[function(data){var processed=[];var max=0;try
{if(data.Array.IQ[0].QUERY[0].RESULT[0].OVERALLCOUNT&&data.Array.IQ[0].QUERY[0].RESULT[0].OVERALLCOUNT[0].VALUE){max=parseInt(data.Array.IQ[0].QUERY[0].RESULT[0].OVERALLCOUNT[0].VALUE);}
var items=data.Array.IQ[0].QUERY[0].RESULT[0].ITEM;if(items){for(var i=0;i<items.length;i++){processed.push({action:parseInt(items[i].ACTIONTYPE[0].VALUE),active:(items[i].ACTIVE[0].VALUE=='1'?true:false),condition:items[i].CONDITION[0],id:parseInt(items[i].RULEID[0].VALUE),title:items[i].TITLE[0].VALUE});}}}
catch(e)
{log.error([e,data]);}
aHandler[0]({items:processed,overallcount:max});}];this.create_iq(aRequest,[this,'__response',[h]]);return true;}
_me.__response=function(aData,aHandler){var out=aData;executeCallbackFunction(aHandler,out);};_me.add=function(who,title,conditions,actions,aHandler){this.edit(false,who,title,conditions,actions,aHandler);}
_me.edit=function(id,who,title,conditions,actions,aHandler){log.info(['wmrules-save',id,who,title,conditions,actions]);try
{var items_conditions=[];for(var i=0;i<conditions.length;i++){var item={};conditions[i].classname=this.translateConditionClass(conditions[i].conditiontype);for(var key in conditions[i]){if(!{type:true}[key]){item[key]=[{VALUE:(typeof conditions[i][key]=='boolean'?(conditions[i][key]?'1':'0'):conditions[i][key])}];}}
items_conditions.push(item);}
var items_actions=[];for(var i=0;i<actions.length;i++){var item={};actions[i].classname=this.translateActionClass(actions[i].actiontype);for(var key in actions[i]){if(!{type:true,headers:true}[key]){item[key]=[{VALUE:(typeof actions[i][key]=='boolean'?(actions[i][key]?'1':'0'):actions[i][key])}];}
if(key=='headers'){item[key]=[];var headers=[];for(var i2=0;i2<actions[i][key].length;i2++){var item2={};for(var key2 in actions[i][key][i2]){item2[key2]=[{VALUE:(typeof actions[i][key][i2][key2]=='boolean'?(actions[i][key][i2][key2]?'1':'0'):actions[i][key][i2][key2])}];}
item[key].push({CLASSNAME:[{VALUE:'TRuleEditHeaderList'}],ITEM:[item2]});}}}
items_actions.push(item);}
log.info(['wmrules-save2',id,who,title,items_conditions,items_actions]);var data_conditions=[{classname:[{VALUE:'truleconditions'}],item:items_conditions}];var data_actions=[{classname:[{VALUE:'truleactions'}],item:items_actions}];var aRequest={commandname:[{VALUE:(id?'editrule':'addrule')}],commandparams:[{who:[{VALUE:who}],rulesettings:[{active:[{VALUE:'1'}],title:[{VALUE:title}],conditions:data_conditions,actions:data_actions}]}]};if(id){aRequest.commandparams[0].ruleid=[{VALUE:id}];aRequest.commandparams[0].rulesettings[0].ruleid=[{VALUE:id}];}
if(!aHandler[0]){aHandler=[aHandler];}
this.create_iq(aRequest,[this,'__response',[aHandler]]);return true;}
catch(e)
{log.error(['wmrules-edit',e]);}}
if(!com){var com={};}
com.rules=new wm_rules();

/* client/inc/wm_security.js */
com.security=(function(){function SecurityManager(){this.xmlns='rpc';}
SecurityManager.prototype=Object.create(IWServerInteraction.prototype);SecurityManager.prototype.resetDKIM=function(domain,callback){this.getResult(this.createCommand('ResetDKIM',{domain:domain}),callback);}
SecurityManager.prototype.reset2Factor=function(email,callback){this.getResult(this.createCommand('Reset2Factor',{email:email}),callback);}
return new SecurityManager();})();

/* client/inc/wm_server.js */
function wm_server()
{this.xmlns='rpc';}
wm_server.inherit(wm_generic);var _me=wm_server.prototype;_me.__servicesList=['smtp','pop3','control','im','calendar','dummy','socks','ldap','imap','antivirus','ftp','antispam','sip','syncml','webclient','caldav','sms','syncpush','commtouch','tunnels','sipcall','activesync','antispamreports','purple','minger','all','none','snmp','proxy','voicemail','icewarpd','meeting','kasperskyupdater','teamchat'];_me.__response=function(aData,aHandler){var out=aData;executeCallbackFunction(aHandler,out);};_me.__name2ID=function(name){if(typeof name=='string'){for(var i=0;i<this.__servicesList.length;i++){if(this.__servicesList[i]==name){return i;}}}
return name;}
_me.trafficCharts=function(sType,charttype,period,aHandler){var service=this.__name2ID(sType);var from=false;var to=false;if(typeof period=='object'){from=period.from;to=period.to;}
else if(typeof period=='string'){period={realtime:0,hour:1,day:2,month:4}[period];}else if(typeof period=='number'){period=period;}
var aRequest={commandname:[{VALUE:'gettrafficcharts'}],commandparams:[{stype:[{VALUE:service}],charttype:[{VALUE:charttype}],period:[{VALUE:period}]}]};if(!aHandler[0]){aHandler=[aHandler];}
var h=[function(data){var processed=[];try
{var items=data.Array.IQ[0].QUERY[0].RESULT[0].LIST[0].ITEM;if(items){for(var i=0;i<items.length;i++){processed.push({value:parseFloat(items[i].V[0].VALUE),time:parseInt(items[i].D[0].VALUE)});}}}
catch(e)
{log.error([e,data]);}
aHandler[0](processed);}];this.create_iq(aRequest,[this,'__response',[h]]);return true;}
_me.serviceStatistics=function(sType,aHandler){var service=this.__name2ID(sType);var aRequest={commandname:[{VALUE:'getservicestatistics'}],commandparams:[{stype:[{VALUE:service}]}]};if(!aHandler[0]){aHandler=[aHandler];}
var h=[function(data){var processed={};try
{var items=data.Array.IQ[0].QUERY[0].RESULT[0];for(var key in items){if(key.toLowerCase()!='classname'&&items[key][0].VALUE){processed[key.toLowerCase()]=items[key][0].VALUE;}}}
catch(e)
{log.error([e,data]);}
aHandler[0](processed);}];this.create_iq(aRequest,[this,'__response',[h]]);return true;}
_me.startService=function(name,aHandler){var service=this.__name2ID(name);var aRequest={commandname:[{VALUE:'startservice'}],commandparams:[{service:[{VALUE:service}]}]};if(!aHandler[0]){aHandler=[aHandler];}
this.create_iq(aRequest,[this,'__response',[aHandler]]);return true;}
_me.stopService=function(name,aHandler){var service=this.__name2ID(name);var aRequest={commandname:[{VALUE:'stopservice'}],commandparams:[{service:[{VALUE:service}]}]};if(!aHandler[0]){aHandler=[aHandler];}
this.create_iq(aRequest,[this,'__response',[aHandler]]);return true;}
_me.restartService=function(name,aHandler){var service=this.__name2ID(name);var aRequest={commandname:[{VALUE:'restartservice'}],commandparams:[{service:[{VALUE:service}]}]};if(!aHandler[0]){aHandler=[aHandler];}
this.create_iq(aRequest,[this,'__response',[aHandler]]);return true;}
_me.services=function(aHandler){var me=this;var services=me.__servicesList;var aRequest={commandname:[{VALUE:'getservicesinfolist'}],commandparams:[{filter:[{VALUE:'*'}],offset:[{VALUE:0}],count:[{VALUE:100}]}]};if(!aHandler[0]){aHandler=[aHandler];}
var h=[function(data){var items={};if(data.Array.IQ[0].QUERY[0].RESULT[0].ITEM){var aI=data.Array.IQ[0].QUERY[0].RESULT[0].ITEM;for(var key in aI){var info={};info.type=aI[key].SERVICETYPE[0].VALUE;if(aI[key].CONNECTIONS&&aI[key].CONNECTIONS[0]&&aI[key].CONNECTIONS[0].VALUE){info.connections=parseInt(aI[key].CONNECTIONS[0].VALUE);}else{info.connections=0;}
if(aI[key].MAXCONNECTIONS&&aI[key].MAXCONNECTIONS[0]&&aI[key].MAXCONNECTIONS[0].VALUE){info.maxconnections=parseInt(aI[key].MAXCONNECTIONS[0].VALUE);}else{info.maxconnections=0;}
if(aI[key].DATA&&aI[key].DATA[0]&&aI[key].DATA[0].VALUE){info.data=parseInt(aI[key].DATA[0].VALUE);}else{info.data=0;}
if(aI[key].ISRUNNING&&aI[key].ISRUNNING[0]&&aI[key].ISRUNNING[0].VALUE){info.status=(aI[key].ISRUNNING[0].VALUE=='1'?true:false);}else{info.status=false;}
if(aI[key].UPTIME&&aI[key].UPTIME[0]&&aI[key].UPTIME[0].VALUE){info.uptime=parseInt(aI[key].UPTIME[0].VALUE);}else{info.status=false;}
items[services[info.type]]=info;}}
log.log(['wmserver-services',items]);aHandler[0](items);}];this.create_iq(aRequest,[this,'__response',[h]]);return true;}
_me.trafficInfo=function(cb){com.console.item(function(ret){var data={};try
{var items=ret.Array.IQ[0].QUERY[0].RESULT[0].ITEM;for(var i=0;i<items.length;i++){var key=false;var value=false;key=items[i].APIPROPERTY[0].PROPNAME[0].VALUE.toLowerCase();try{value=parseInt(items[i].PROPERTYVAL[0].VAL[0].VALUE);}
catch(e){}
data[key]=value;}}
catch(e){}
if(cb){cb(data);}}).statistics(['Statistics_ActiveUsers','Statistics_UsedSpace','Statistics_MailSent','Statistics_MailReceived']);}
_me.setData=function(empty,items,aHandler)
{var aRequest={commandname:[{VALUE:'setserverproperties'}],commandparams:[{propertyvaluelist:[{item:items}],}]};log.log(items);if(!aHandler[0]){aHandler=[aHandler];}
this.create_iq(aRequest,[this,'__response',[aHandler]]);return true;}
_me.rights=function(list,aHandler){var items=[];try
{for(var i=0;i<list.length;i++){items.push({propname:[{VALUE:list[i]}]});}
var aRequest={commandname:[{VALUE:'getmyserverrights'}],commandparams:[{serverpropertylist:[{item:items}]}]};if(!aHandler[0]){aHandler=[aHandler];}
this.create_iq(aRequest,[this,'__response',[aHandler]]);}
catch(e)
{log.error(['server-rights',e]);}
return true;}
_me.getLicenseInfo=function(aHandler,eHandler){try
{var aRequest={commandname:[{VALUE:'getlicenseinfo'}],commandparams:[]};if(!aHandler){aHandler=function(){}}
if(!eHandler){eHandler=function(){}}
aHandler=this._preprocessResponse(function(data){try
{var items={};data=data.Array.IQ[0].QUERY[0].RESULT[0];for(var key in data){items[key.toLowerCase()]=data[key][0].VALUE;}
return items;}
catch(e)
{log.error('server-getlicenseinfo',e);return{};}},aHandler)
aHandler=[this.__attachErrorHandler(aHandler[0],eHandler)];this.create_iq(aRequest,[this,'__response',[aHandler]]);}
catch(e)
{log.error(["wmserver-getlicenseinfo",e]);}}
if(!com){var com={};}
com.server=new wm_server();

/* client/inc/wm_settings.js */
com.settings=(function(){function SettingsManager(){this.xmlns='rpc';}
SettingsManager.prototype=Object.create(IWServerInteraction.prototype);var parse=function(result,type,id,resource){if(result.list){var properties;switch(type){case'Account':properties=new UserSettings(id);break;case'Domain':properties=new DomainSettings(id);break;default:properties=new ServerSettings();}
var obj={};if(resource instanceof Array){var rs;while(rs=resource.shift()){obj[rs]=true;}
resource=obj;}else if(typeof resource=="string"){obj[resource]=true;resource=obj;}
return parseAll(result.list,properties,resource||{});}else{console.error("Server returned an error: ",result.error);return result;}}
var parseAll=function(result,collection,resource){if(!(result instanceof IWAPI.List)){result=new IWAPI.List("list");}
var stored={};for(var i=0,l=result.length;i<l;i++){stored[result[i].name.value]=true;}
for(var name in resource){if(!stored[name]){addEmptySettingsCollection(result,name);}}
for(var i=0,l=result.length;i<l;i++){var name=result[i].name.value;if(name=='languages'){return parseLanguages(result[i]);}
if(name=='skins'){return parseLayouts(result[i]);}
var item=parseOne(result[i],resource[name]);Object.defineProperty(item,"settingsCollection",{enumerable:false,writable:false,configurable:false,value:collection});collection.addItem(item);}
if(result.length==1){collection=item;}
return collection;}
var parseLanguages=function(data){var resourcename=data.name.value;if(resourcename=="languages"){var languages=new LanguageMap(resourcename);for(var i=0,l=data.list.length;i<l;i++){var lang=data.list[i].list;lang=new SettingsValue(lang[1].value.value,lang[0].value.value,{server:lang[0].accesslevel.value,domain:lang[0].domainadminaccesslevel.value,user:lang[0].useraccesslevel.value});languages.addItem(lang);}
return languages;}}
var parseLayouts=function(data){var resourcename=data.name.value;if(resourcename=="skins"){var layouts=new LayoutCollection(resourcename);for(var i=0,l=data.list.length;i<l;i++){var lang=data.list[i].list;lang=new SettingsValue(lang[1].value.value,lang[0].value.value,{server:lang[0].accesslevel.value,domain:lang[0].domainadminaccesslevel.value,user:lang[0].useraccesslevel.value});layouts.addItem(lang);}
return layouts;}}
var parseOne=function(data,resource){var resourcename=data.name.value;var settings=data.list[0].list;var collection=new SettingsCollection(resourcename);for(var i=0,l=settings.length;i<l;i++){var setting=new SettingsValue(settings[i].value.value,settings[i].name.value,{server:settings[i].accesslevel.value,domain:settings[i].domainadminaccesslevel.value,user:settings[i].useraccesslevel.value});collection.addItem(setting);}
if(resource instanceof Array){for(var i=0,l=resource.length;i<l;i++){if(!collection[resource[i]]){var value=GWOthers.getItem(resourcename.toUpperCase(),resource[i].toUpperCase());collection.addItem(new SettingsValue(value===void 0?null:value,resource[i],{}));}}}
return collection;}
var addEmptySettingsCollection=function(container,name){var coll=new IWAPI.Collection('item');coll.addItem('name',name);var list=new IWAPI.List('list');var item=new IWAPI.Collection(item);item.addItem(new IWAPI.List('list'));list.addItem(item);coll.addItem(list);container.addItem(coll);}
function SettingsValue(value,label,rights){IWAPI.Value.call(this,value,label);Object.defineProperty(this,"userAccess",{enumerable:false,writable:false,configurable:false,value:rights.user||''});Object.defineProperty(this,"domainAccess",{enumerable:false,writable:false,configurable:false,value:rights.domain||''});Object.defineProperty(this,"serverAccess",{enumerable:false,writable:false,configurable:false,value:rights.server||''});var inversed=false;Object.defineProperty(this,"inversed",{get:function(){return inversed;},set:function(v){inversed=v;},enumerable:false,configurable:false});}
SettingsValue.prototype=Object.create(IWAPI.Value.prototype);SettingsValue.prototype.toXMLString=function(){if(this.hasChanged()){var item=new IWAPI.Collection('item');item.addItem(new IWAPI.PersistentValue(this.label,'name'));item.addItem(new IWAPI.PersistentValue(this.value,'value'));return item.toXMLString.apply(item,arguments);}else return'';}
function SettingsCollection(label){IWAPI.Collection.call(this,label);}
SettingsCollection.prototype=Object.create(IWAPI.Collection.prototype);Object.defineProperty(SettingsCollection.prototype,'toXMLString',{enumerable:false,writable:false,value:function(options){options=options||{};if(options.reset||this.hasChanged()){var list=new IWAPI.List('list');var item=new IWAPI.Collection('item');list.addItem(item);item.addItem(new IWAPI.PersistentValue(this.collectionLabel,'name'));item.addItem(new IWAPI.PersistentValue('0','resourcetype'));var containerlist=new IWAPI.List('list');var containeritem=new IWAPI.Collection('item');containerlist.addItem(containeritem);item.addItem(containerlist);var settings=new IWAPI.List('list');containeritem.addItem(settings);if(options.reset){for(var setting in this){var item=new IWAPI.Collection('item');item.addItem(new IWAPI.PersistentValue(this[setting].label,'name'));item.addItem(new IWAPI.PersistentValue('1','setdefault'));settings.addItem(item);}}else{for(var setting in this){settings.addItem(this[setting]);}}
return list.toXMLString.apply(list,arguments);}else return'';}});Object.defineProperty(SettingsCollection.prototype,"noAccess",{enumerable:false,writable:false,value:function(inaccessible){if(typeof inaccessible=='boolean'){for(var i in this){this[i].noAccess(inaccessible);}}else{for(var i in this){if(this[i].noAccess()){return true;}}
return false;}}});Object.defineProperty(SettingsCollection.prototype,'saveChanges',{enumerable:false,writable:false,value:function(callback){this.settingsCollection.saveChanges(callback,this.collectionLabel);}});Object.defineProperty(SettingsCollection.prototype,'resetAll',{enumerable:false,writable:false,value:function(callback){this.settingsCollection.resetAll(callback,this.collectionLabel);}});function SettingsList(label){IWAPI.List.call(this,label);}
SettingsList.prototype=Object.create(IWAPI.List.prototype);Object.defineProperty(SettingsList.prototype,'toXMLString',{enumerable:false,writable:false,value:function(){var i=new IWAPI.Collection('item');var c=new IWAPI.Collection('apiproperty');c.addItem('propname',this.propertyName);i.addItem(c);var c=new IWAPI.Collection('propertyval');c.addItem('classname',this.propertyClass);var l=new IWAPI.List('val');for(var n=0;n<this.length;n++){l.addItem(this[n]);}
c.addItem(l);i.addItem(c);return i.toXMLString.apply(i,arguments);}});IWAPI.List.prototype.noAccess=function(inaccessible){var i=this.length;if(typeof inaccessible=='boolean'){while(i--){this[i].noAccess(inaccessible);}
return false;}else{while(i--){if(this[i].noAccess()){return true;}}
return false;}}
Object.defineProperty(SettingsList.prototype,'saveChanges',{enumerable:false,writable:false,value:function(callback){this.settingsCollection.saveChanges(callback,this.propertyName);}});function LanguageMap(label){IWAPI.Collection.call(this,label);}
LanguageMap.prototype=Object.create(IWAPI.Collection.prototype);function LayoutCollection(label){IWAPI.Collection.call(this,label);}
LayoutCollection.prototype=Object.create(IWAPI.Collection.prototype);SettingsManager.prototype.get=function(resource,callback,opts){var command;var opts=opts||{};var parameters={resources:makeList(resource)};command='GetWebmailResources';switch(opts.type){case'Account':parameters.selector=opts.id;parameters.level=2;break;case'Domain':parameters.selector=opts.id;parameters.level=1;break;default:parameters.level=0;}
var request=this.createCommand(command,parameters);var call=function(result){callback(parse(result,opts.type,opts.id,resource));};this.getResult(request,call);}
var makeList=function(resourcename){var list=[];if(resourcename instanceof Array){for(var i=0,l=resourcename.length;i<l;i++){list.push({name:resourcename[i]});}}else if(typeof resourcename=="object"){for(var i in resourcename){var resource={name:i};var items=resourcename[i];if(items instanceof Array){resource.items={classname:'TPropertyStringList',val:items}}
list.push(resource);}}else{list.push({name:resourcename});}
return list;}
function saver(request,callback,resource){if(this.hasChanged()){var listname='resources';request.commandparams.addItem(new IWAPI.List(listname));if(resource){if(this[resource].hasChanged()){request.commandparams[listname].addItem(this[resource]);}}else{for(var i in this){request.commandparams[listname].addItem(this[i]);}}
com.properties.setValues(request,function(result){if(result==1){if(resource){this[resource].commitChanges();}else{this.commitChanges();}}
callback(result);}.bind(this));return true;}else{return false;}}
function resetter(request,callback,resource){var listname='resources';request.commandparams.addItem(new IWAPI.List(listname));if(resource){request.commandparams[listname].addItem(this[resource]);}else{for(var i in this){request.commandparams[listname].addItem(this[i]);}}
com.properties.resetValues(request,function(result){if(result==1){}
callback(result);}.bind(this));}
function ServerSettings(label){IWAPI.Collection.call(this,'server');}
ServerSettings.prototype=Object.create(IWAPI.Collection.prototype);Object.defineProperty(ServerSettings.prototype,"saveChanges",{enumerable:false,writable:false,configurable:false,value:function(callback,resource){var request=com.properties.createCommand('SetWebmailResources',{level:0});var save=saver.bind(this);save(request,callback,resource);}});Object.defineProperty(ServerSettings.prototype,"resetAll",{enumerable:false,writable:false,configurable:false,value:function(callback,resource){var request=com.properties.createCommand('SetWebmailResources',{level:0});var save=resetter.bind(this);save(request,callback,resource);}});function DomainSettings(label){IWAPI.Collection.call(this,'domain');Object.defineProperty(this,"domainName",{enumerable:false,writable:false,configurable:false,value:label});this.setAttribute('name',label);}
DomainSettings.prototype=Object.create(IWAPI.Collection.prototype);Object.defineProperty(DomainSettings.prototype,"saveChanges",{enumerable:false,writable:false,configurable:false,value:function(callback,resource){var request=com.properties.createCommand('SetWebmailResources',{selector:this.domainName,level:1});var save=saver.bind(this);save(request,callback,resource);}});Object.defineProperty(DomainSettings.prototype,"resetAll",{enumerable:false,writable:false,configurable:false,value:function(callback,resource){var request=com.properties.createCommand('SetWebmailResources',{selector:this.domainName,level:1});var save=resetter.bind(this);save(request,callback,resource);}});function UserSettings(label){IWAPI.Collection.call(this,'account');var part=label.split("@");Object.defineProperty(this,"domainName",{enumerable:false,writable:true,configurable:false,value:part.length==1?part[0]:part[1]});Object.defineProperty(this,"accountName",{enumerable:false,writable:true,configurable:false,value:part.length==2?label:''});this.setAttribute('user',label);}
UserSettings.prototype=Object.create(IWAPI.Collection.prototype);Object.defineProperty(UserSettings.prototype,"saveChanges",{enumerable:false,writable:false,configurable:false,value:function(callback,property){var request=com.properties.createCommand('SetUserSettings',{accountemail:this.accountName});var save=saver.bind(this);save(request,callback,property);}});return new SettingsManager();})();

/* client/inc/wm_smartdiscover.js */
var wm_smartdiscover=(function(_super){__extends(wm_smartdiscover,_super);function wm_smartdiscover(){_super.call(this);this.xmlns='rpc';this.__publish('smartdiscover');}
return wm_smartdiscover;}(wm_generic));new wm_smartdiscover();

/* client/inc/wm_spamqueues.js */
function wm_spamqueues()
{this.xmlns='rpc';}
wm_spamqueues.inherit(wm_generic);var _me=wm_spamqueues.prototype;_me.__response=function(aData,aHandler){var out=aData;executeCallbackFunction(aHandler,out);};_me._getList=function(type,mask,sender,owner,domain,itemsPerPage,page,aHandler){var items=[];try
{var aRequest={commandname:[{VALUE:'getspamqueueinfolist'}],commandparams:[{queuetype:[{VALUE:{'whitelist':0,'blacklist':1,'quarantine':2,'0':0,'1':1,'2':2}[type.toString().toLowerCase()]}],filter:[{mask:[{VALUE:(mask?mask:'')}],sender:[{VALUE:(sender?sender:'')}],owner:[{VALUE:(owner?owner:'')}],domain:[{VALUE:(domain?domain:'')}]}],offset:[{VALUE:(itemsPerPage*page)}],count:[{VALUE:(itemsPerPage)}]}]};if(!aHandler[0]){aHandler=[aHandler];}
var fc=[function(data){var prepared={count:0,items:[]};try
{if(data.Array.IQ[0].QUERY[0].RESULT[0].OVERALLCOUNT[0].VALUE)
{prepared.count=parseInt(data.Array.IQ[0].QUERY[0].RESULT[0].OVERALLCOUNT[0].VALUE);}
if(data.Array.IQ[0].QUERY[0].RESULT[0].ITEM)
{for(var i=0;i<data.Array.IQ[0].QUERY[0].RESULT[0].ITEM.length;i++){var inner={};for(var inr in data.Array.IQ[0].QUERY[0].RESULT[0].ITEM[i]){inner[inr.toLowerCase()]=(data.Array.IQ[0].QUERY[0].RESULT[0].ITEM[i][inr][0]&&data.Array.IQ[0].QUERY[0].RESULT[0].ITEM[i][inr][0].VALUE?data.Array.IQ[0].QUERY[0].RESULT[0].ITEM[i][inr][0].VALUE:false);}
prepared.items.push(inner);}}}
catch(e){log.error(['spamqueues-getlist','Invalid response',data]);}
aHandler[0](prepared);}];this.create_iq(aRequest,[this,'__response',[fc]]);}
catch(e)
{log.error(['spamqueues-getlist',e]);}
return true;}
_me.getDetail=function(id,aHandler){var items=[];var me=this;try
{var aRequest={commandname:[{VALUE:'getspamqueueitembody'}],commandparams:[{itemid:[{VALUE:id}]}]};var fc=me._preprocessResponse(function(response){try
{if(response.Array.IQ[0].QUERY[0].RESULT[0].VALUE){return response.Array.IQ[0].QUERY[0].RESULT[0].VALUE;}}
catch(e)
{log.error(['spamqueues-getdetail',e]);}
return false;},aHandler);this.create_iq(aRequest,[this,'__response',[fc]]);}
catch(e)
{log.error(['spamqueues-blacklist',e]);}
return true;}
_me.blacklistItem=function(id,aHandler){var items=[];var me=this;try
{var aRequest={commandname:[{VALUE:'blacklistspamqueueitem'}],commandparams:[{itemid:[{VALUE:id}],}]};this.create_iq(aRequest,[this,'__response',[me._autoBooleanHandler(aHandler)]]);}
catch(e)
{log.error(['spamqueues-blacklist',e]);}
return true;}
_me.whitelistItem=function(id,aHandler){var items=[];var me=this;try
{var aRequest={commandname:[{VALUE:'whitelistspamqueueitem'}],commandparams:[{itemid:[{VALUE:id}],}]};this.create_iq(aRequest,[this,'__response',[me._autoBooleanHandler(aHandler)]]);}
catch(e)
{log.error(['spamqueues-blacklist',e]);}
return true;}
_me.deliverItem=function(id,aHandler){var items=[];var me=this;try
{var aRequest={commandname:[{VALUE:'deliverspamqueueitem'}],commandparams:[{itemid:[{VALUE:id}],}]};this.create_iq(aRequest,[this,'__response',[me._autoBooleanHandler(aHandler)]]);}
catch(e)
{log.error(['spamqueues-deliveritem',e]);}
return true;}
_me.deleteItem=function(id,aHandler){var items=[];var me=this;try
{var aRequest={commandname:[{VALUE:'deletespamqueueitem'}],commandparams:[{itemid:[{VALUE:id}],}]};this.create_iq(aRequest,[this,'__response',[me._autoBooleanHandler(aHandler)]]);}
catch(e)
{log.error(['spamqueues-deleteitem',e]);}
return true;}
_me._addItem=function(type,sender,owner,aHandler){var items=[];try
{var aRequest={commandname:[{VALUE:'addspamqueueitem'}],commandparams:[{info:[{sender:[{VALUE:(sender?sender:'')}],owner:[{VALUE:(owner?owner:'')}],queuetype:[{VALUE:{'whitelist':0,'blacklist':1,'quarantine':2,'0':0,'1':1,'2':2}[type.toString().toLowerCase()]}],}]}]};if(!aHandler[0]){aHandler=[aHandler];}
var fc=[function(data){try
{if(data.Array.IQ[0].QUERY[0].ERROR&&data.Array.IQ[0].QUERY[0].ERROR[0])
{log.error(['spamqueues-additem',data.Array.IQ[0].QUERY[0].ERROR[0].ATTRIBUTES.UID]);aHandler[0](false);return false;}
if(data.Array.IQ[0].QUERY[0].RESULT[0]&&data.Array.IQ[0].QUERY[0].RESULT[0].VALUE=='1')
{aHandler[0](true);return true;}
aHandler[0](false);return false;}
catch(e){log.error(['spamqueues-addItem','Invalid response',data,e]);aHandler[0](false);return false;}}];this.create_iq(aRequest,[this,'__response',[fc]]);}
catch(e)
{log.error(['spamqueues-additem',e]);}
return true;}
_me.getQuarantine=function(mask,sender,owner,domain,itemsPerPage,page,aHandler){this._getList('quarantine',mask,sender,owner,domain,itemsPerPage,page,aHandler);}
_me.getBlacklist=function(mask,sender,owner,domain,itemsPerPage,page,aHandler){this._getList('blacklist',mask,sender,owner,domain,itemsPerPage,page,aHandler);}
_me.getWhitelist=function(mask,sender,owner,domain,itemsPerPage,page,aHandler){this._getList('whitelist',mask,sender,owner,domain,itemsPerPage,page,aHandler);}
_me.addWhitelist=function(sender,owner,aHandler){this._addItem('whitelist',sender,owner,aHandler);}
_me.addBlacklist=function(sender,owner,aHandler){this._addItem('blacklist',sender,owner,aHandler);}
if(!com){var com={};}
com.spamqueues=new wm_spamqueues();

/* client/inc/wm_statistics.js */
if(!window.com)window.com={};com.statistics=(function(){function Statistics(){this.xmlns='rpc';}
Statistics.prototype=Object.create(IWServerInteraction.prototype);Statistics.prototype.get=function(propnames,callback){var names=[];if(typeof propnames=="string"){propnames=[propnames];}
for(var i=0;i<propnames.length;i++){names.push({propname:propnames[i]});}
var command=this.createCommand('GetStatisticsProperties',{statisticspropertylist:names});this.getResult(command,function(properties){var simple={};var length=properties.length;for(var i=0;i<length;i++){var label=properties[i].apiproperty.propname.value;switch(properties[i].propertyval.classname.value){case'TPropertyNoValue':prop=null;break;case'TPropertyString':prop=properties[i].propertyval.val.value;break;default:console.warn("Property "+label+" of unexpected type");prop=properties[i].propertyval;}
if(label.indexOf('Statistics_')===0){label=label.replace('Statistics_','');}
simple[label]=prop;}
if(length==1){simple=simple[label];}
callback(simple);});}
return new Statistics();})();

/* client/inc/wm_user.js */
function wm_user()
{this.xmlns='rpc';}
wm_user.inherit(wm_generic);var _me=wm_user.prototype;_me.getAPI=function(perPage,page,mask,cb,clear,account){com.console.getAPI(perPage,page,mask,cb,clear,'account',account);}
_me.rulesInfoList=function(domain,itemsPerPage,page,aHandler,eHandler){var aRequest={commandname:[{VALUE:'getrulesinfolist'}],commandparams:[{who:[{VALUE:domain}],offset:[{VALUE:(itemsPerPage*page)}],count:[{VALUE:(itemsPerPage)}]}]};if(!aHandler[0]){aHandler=[aHandler];}
var h=[function(data){var processed=[];var max=0;try
{if(data.Array.IQ[0].QUERY[0].RESULT[0].OVERALLCOUNT&&data.Array.IQ[0].QUERY[0].RESULT[0].OVERALLCOUNT[0].VALUE){max=parseInt(data.Array.IQ[0].QUERY[0].RESULT[0].OVERALLCOUNT[0].VALUE);}
var items=data.Array.IQ[0].QUERY[0].RESULT[0].ITEM;if(items){for(var i=0;i<items.length;i++){processed.push({action:parseInt(items[i].ACTIONTYPE[0].VALUE),active:(items[i].ACTIVE[0].VALUE=='1'?true:false),condition:items[i].CONDITION[0],id:parseInt(items[i].RULEID[0].VALUE),title:items[i].TITLE[0].VALUE});}}}
catch(e)
{log.error([e,data]);}
aHandler[0]({items:processed,overallcount:max});}];h=[this.__attachErrorHandler(h[0],eHandler)];this.create_iq(aRequest,[this,'__response',[h]]);return true;}
_me.list=function(domain,itemsPerPage,page,namemask,typemask,aHandler,eHandler)
{aHandler=[this.__attachErrorHandler(aHandler[0],eHandler)];log.log(['wmuser-list','#1']);var masks={namemask:[{VALUE:'*'}]};log.log(['wmuser-list','#2']);if(namemask){masks.namemask[0].VALUE=namemask;}
log.log(['wmuser-list','#3']);if(typemask){masks.typemask=[{VALUE:typemask}];}
log.log(['wmuser-list','#4']);var aRequest={commandname:[{VALUE:'getaccountsinfolist'}],commandparams:[{domainstr:[{VALUE:domain}],filter:[masks],offset:[{VALUE:(itemsPerPage*page)}],count:[{VALUE:(itemsPerPage)}]}]};log.log(['wmuser-list','#5']);this.create_iq(aRequest,[this,'__response',[aHandler]]);log.log(['wmuser-list','#6']);return true;}
_me.setData=function(account,items,aHandler)
{var aRequest={commandname:[{VALUE:'setaccountproperties'}],commandparams:[{accountemail:[{VALUE:account}],propertyvaluelist:[{item:items}],}]};log.log(items);if(!aHandler[0]){aHandler=[aHandler];}
this.create_iq(aRequest,[this,'__response',[aHandler]]);return true;}
_me.folderList=function(account,onlydefault,aHandler){var params={accountemail:[{VALUE:account}],onlydefault:[{VALUE:0}]};if(onlydefault){params.onlydefault=[{VALUE:1}];}
var aRequest={commandname:[{VALUE:'getaccountfolderlist'}],commandparams:[params]};if(!aHandler[0]){aHandler=[aHandler];}
this.create_iq(aRequest,[this,'__response',[aHandler]]);return true;}
_me.setResponderMessage=function(account,from,subject,text,aHandler){var aRequest={commandname:[{VALUE:'setaccountproperties'}],commandparams:[{accountemail:[{VALUE:account}],propertyvaluelist:[{item:[{apiproperty:[{propname:[{VALUE:'a_respondermessage'}]}],propertyval:[{classname:[{VALUE:'taccountrespondermessage'}],from:[{VALUE:from}],subject:[{VALUE:subject}],text:[{VALUE:text}]}]}]}]}]};if(!aHandler[0]){aHandler=[aHandler];}
this.create_iq(aRequest,[this,'__response',[aHandler]]);return true;}
_me.getResponderMessage=function(account,aHandler){com.console.item(aHandler).account('a_respondermessage',account);}
_me.getFolderPermissions=function(account,folder,aHandler){var aRequest={commandname:[{VALUE:'getaccountfolderpermissions'}],commandparams:[{accountemail:[{VALUE:account}],folderid:[{VALUE:folder}]}]};if(!aHandler[0]){aHandler=[aHandler];}
this.create_iq(aRequest,[this,'__response',[aHandler]]);return true;}
_me.setFolderPermissions=function(account,folder,items,aHandler){var aRequest={commandname:[{VALUE:'setaccountfolderpermissions'}],commandparams:[{accountemail:[{VALUE:account}],folderid:[{VALUE:folder}],permissions:[{item:items}]}]};if(!aHandler[0]){aHandler=[aHandler];}
this.create_iq(aRequest,[this,'__response',[aHandler]]);return true;}
_me.inheritFolderPermissions=function(account,folder,aHandler){var aRequest={commandname:[{VALUE:'inheritaccountfolderpermissions'}],commandparams:[{accountemail:[{VALUE:account}],folderid:[{VALUE:folder}]}]};if(!aHandler[0]){aHandler=[aHandler];}
this.create_iq(aRequest,[this,'__response',[aHandler]]);return true;}
_me.mailingListInfo=function(account,aHandler)
{com.console.combi(aHandler).account('1',['u_name','u_alias','A_AliasList','m_owneraddress','m_sendalllists','m_defaultrights','m_listbatch','m_sendtosender','m_copytoowner','m_listsubject','m_personalized','m_removedead','m_moderated','m_checkmailbox','m_membersonly','m_moderatedpassword'],account);return true;}
_me.groupInfo=function(account,aHandler)
{com.console.combi(aHandler).account('1',['g_groupwarehabfolder','g_name','g_description','u_alias','A_AliasList','g_groupwaremaildelivery','g_listbatch','g_checkmailbox','g_groupwareallowgalexport','g_groupwarecreateteamchat','g_groupwarehab','g_groupwaremembers','a_passwordprotection','m_membersonly','g_groupwareshared','m_moderatedpassword'],account);return true;}
_me.info=function(account,aHandler,eHandler)
{com.console.combi(aHandler,eHandler).account('1',['u_name','u_comment','u_description','u_spamadmin'],account);return true;}
_me.resource=function(account,aHandler,eHandler)
{com.console.combi(aHandler,eHandler).account('1',['u_name','s_unavailable','s_allowconflicts','s_notificationtomanager','s_manager','u_alias','s_type'],account);return true;}
_me.responder=function(account,aHandler,eHandler)
{com.console.item(aHandler,eHandler).account('a_responder',account);return true;}
_me.forwarder=function(account,aHandler,eHandler)
{com.console.combi(aHandler,eHandler).account(3,['u_donotforwardspam'],account);return true;}
_me.rules=function(account,aHandler,eHandler)
{aHandler=this.__attachErrorHandler(aHandler,eHandler);var aRequest={commandname:[{VALUE:'getaccountrules'}],commandparams:[{accountemail:[{VALUE:account}],accountpropertylist:[{item:[{propname:[{VALUE:'u_name'}]}]}],}]};this.create_iq(aRequest,[this,'__response',[aHandler]]);return true;}
_me.licenses=function(account,aHandler)
{var aRequest={commandname:[{VALUE:'getaccountlicenses'}],commandparams:[{accountemail:[{VALUE:account}],accountpropertylist:[{item:[{propname:[{VALUE:'u_name'}]}]}],}]};this.create_iq(aRequest,[this,'__response',[aHandler]]);return true;}
_me.mobile_devices=function(account,aHandler)
{var aRequest={commandname:[{VALUE:'getaccountmobiledevices'}],commandparams:[{accountemail:[{VALUE:account}],accountpropertylist:[{item:[{propname:[{VALUE:'u_name'}]}]}],}]};this.create_iq(aRequest,[this,'__response',[aHandler]]);return true;}
_me.password_policy=function(aHandler)
{com.console.item(aHandler).server(['C_Accounts_Policies_Pass_Enable','C_Accounts_Policies_Pass_MinLength','C_Accounts_Policies_Pass_Digits','C_Accounts_Policies_Pass_NonAlphaNum','C_Accounts_Policies_Pass_UserAlias','C_Accounts_Policies_Pass_Alpha','C_Accounts_Policies_Pass_UpperAlpha','C_Accounts_Policies_Pass_Expiration']);return true;}
_me.change_password=function(account,pwd,ignorePasswordPolicy,cb){var cb=cb;var aRequest={commandname:[{VALUE:'setaccountpassword'}],commandparams:[{accountemail:[{VALUE:account}],ignorepolicy:[{VALUE:(ignorePasswordPolicy?'1':'0')}],password:[{VALUE:pwd}]}]};this.create_iq(aRequest,[this,'__response',[[function(aResponse){try
{cb(aResponse);}
catch(e)
{log.error(e);}}]]]);return true;}
_me.change_user_password=function(account,pwd,old_pwd,cb){var aRequest={commandname:[{VALUE:'changepassword'}],commandparams:[{email:[{VALUE:account}],oldpassword:[{VALUE:old_pwd}],newpassword:[{VALUE:pwd}]}]};this.create_iq(aRequest,[this,'__response',[[function(aResponse){try{cb(aResponse);}catch(e){log.error(e);}}]]]);return true;}
_me.expire_password=function(account,cb){var cb=cb;var aRequest={commandname:[{VALUE:'expireaccountpassword'}],commandparams:[{accountemail:[{VALUE:account}],}]};this.create_iq(aRequest,[this,'__response',[[function(aResponse){try
{var res=aResponse.Array.IQ[0].QUERY[0].RESULT[0].VALUE;cb(parseInt(res));}
catch(e)
{log.error(e);}}]]]);return true;}
_me.generate_license=function(account,data,aHandler){this.manage_license(account,'GenerateAccountActivationKey',data,aHandler);}
_me.send_license=function(account,data,aHandler){this.manage_license(account,'SendAccountActivationKey',data,aHandler);}
_me.manage_license=function(account,type,data,aHandler){var details=data['A_ActivationKeyOutlook']||data['A_ActivationKeyDesktop'];var request=this.createCommand(type,{accountemail:account,keytype:details.keytype.value,description:details.description.value,count:details.count.value});this.setValues(request,aHandler);}
_me.features=function(account,cb){var cb=cb;com.console.item(function(result){log.log(result);var ret={};try
{var items=result.Array.IQ[0].QUERY[0].RESULT[0].ITEM;}
catch(e)
{log.error(['e:invalid-data',e]);return false;}
try
{for(var i=0;i<items.length;i++)
{var propname=items[i].APIPROPERTY[0].PROPNAME[0].VALUE;var propval={};if(items[i].PROPERTYVAL&&items[i].PROPERTYVAL[0]){propval=items[i].PROPERTYVAL[0];}
try
{log.log(propname.toLowerCase());switch(propname.toLowerCase())
{case'u_smtp':n='smtp';if(!ret[n]){ret[n]={editable:true,value:0,source:items[i]};}
ret[n].value=parseInt(propval.VAL[0].VALUE);break;case'u_pop3imap':n='pop3imap';if(!ret[n]){ret[n]={editable:true,value:0,source:items[i]};}
ret[n].value=parseInt(propval.VAL[0].VALUE);break;case'u_webmail':n='webmail';if(!ret[n]){ret[n]={editable:true,value:0,source:items[i]};}
ret[n].value=parseInt(propval.VAL[0].VALUE);break;case'u_avscan':n='avscan';if(!ret[n]){ret[n]={editable:true,value:0,source:items[i]};}
ret[n].value=parseInt(propval.VAL[0].VALUE);break;case'u_aveditable':n='avscan';if(!ret[n]){ret[n]={editable:true,value:0,source:items[i]};}
ret[n].editable=(parseInt(propval.VAL[0].VALUE)==0?false:true);break;case'u_as':n='as';if(!ret[n]){ret[n]={editable:true,value:0,source:items[i]};}
ret[n].value=parseInt(propval.VAL[0].VALUE);break;case'u_aseditable':n='as';if(!ret[n]){ret[n]={editable:true,value:0,source:items[i]};}
ret[n].editable=(parseInt(propval.VAL[0].VALUE)==0?false:true);break;case'u_quarantine':n='quarantine';if(!ret[n]){ret[n]={editable:true,value:0,source:items[i]};}
ret[n].value=parseInt(propval.VAL[0].VALUE);break;case'u_quarantineeditable':n='quarantine';if(!ret[n]){ret[n]={editable:true,value:0,source:items[i]};}
ret[n].editable=(parseInt(propval.VAL[0].VALUE)==0?false:true);break;case'u_im':n='im';if(!ret[n]){ret[n]={editable:true,value:0,source:items[i]};}
ret[n].value=parseInt(propval.VAL[0].VALUE);break;case'u_imeditable':n='im';if(!ret[n]){ret[n]={editable:true,value:0,source:items[i]};}
ret[n].editable=(parseInt(propval.VAL[0].VALUE)==0?false:true);break;case'u_teamchat':n='teamchat';if(!ret[n]){ret[n]={editable:true,value:0,source:items[i]};}
ret[n].value=parseInt(propval.VAL[0].VALUE);break;case'u_teamchateditable':n='teamchat';if(!ret[n]){ret[n]={editable:true,value:0,source:items[i]};}
ret[n].editable=(parseInt(propval.VAL[0].VALUE)==0?false:true);break;case'u_teamchatsupport':n='teamchat';if(!ret[n]){ret[n]={editable:true,value:0,source:items[i]};}
ret[n].support=(parseInt(propval.VAL[0].VALUE)==0?false:true);break;case'u_webdocuments':n='webdocuments';if(!ret[n]){ret[n]={editable:true,value:0,source:items[i]};}
ret[n].value=parseInt(propval.VAL[0].VALUE);break;case'u_webdocumentseditable':n='webdocuments';if(!ret[n]){ret[n]={editable:true,value:0,source:items[i]};}
ret[n].editable=(parseInt(propval.VAL[0].VALUE)==0?false:true);break;case'u_webdocumentssupport':n='webdocuments';if(!ret[n]){ret[n]={editable:true,value:0,source:items[i]};}
ret[n].support=(parseInt(propval.VAL[0].VALUE)==0?false:true);break;case'u_gw':n='gw';if(!ret[n]){ret[n]={editable:true,value:0,source:items[i]};}
ret[n].value=parseInt(propval.VAL[0].VALUE);break;case'u_gweditable':n='gw';if(!ret[n]){ret[n]={editable:true,value:0,source:items[i]};}
ret[n].editable=(parseInt(propval.VAL[0].VALUE)==0?false:true);break;case'u_sip':n='sip';if(!ret[n]){ret[n]={editable:true,value:0,source:items[i]};}
ret[n].value=parseInt(propval.VAL[0].VALUE);break;case'u_sipeditable':n='sip';if(!ret[n]){ret[n]={editable:true,value:0,source:items[i]};}
ret[n].editable=(parseInt(propval.VAL[0].VALUE)==0?false:true);break;case'u_ftp':n='ftp';if(!ret[n]){ret[n]={editable:true,value:0,source:items[i]};}
ret[n].value=parseInt(propval.VAL[0].VALUE);break;case'u_ftpeditable':n='ftp';if(!ret[n]){ret[n]={editable:true,value:0,source:items[i]};}
ret[n].editable=(parseInt(propval.VAL[0].VALUE)==0?false:true);break;case'u_sms':n='sms';if(!ret[n]){ret[n]={editable:true,value:0,source:items[i]};}
ret[n].value=parseInt(propval.VAL[0].VALUE);break;case'u_smseditable':n='sms';if(!ret[n]){ret[n]={editable:true,value:0,source:items[i]};}
ret[n].editable=(parseInt(propval.VAL[0].VALUE)==0?false:true);break;case'u_activesync':n='activesync';if(!ret[n]){ret[n]={editable:true,value:0,source:items[i]};}
ret[n].value=parseInt(propval.VAL[0].VALUE);break;case'u_activesynceditable':n='activesync';if(!ret[n]){ret[n]={editable:true,value:0,source:items[i]};}
ret[n].editable=(parseInt(propval.VAL[0].VALUE)==0?false:true);break;case'u_webdav':n='webdav';if(!ret[n]){ret[n]={editable:true,value:0,source:items[i]};}
ret[n].value=parseInt(propval.VAL[0].VALUE);break;case'u_webdaveditable':n='webdav';if(!ret[n]){ret[n]={editable:true,value:0,source:items[i]};}
ret[n].editable=(parseInt(propval.VAL[0].VALUE)==0?false:true);break;case'u_archive':n='archive';if(!ret[n]){ret[n]={editable:true,value:0,source:items[i]};}
ret[n].value=parseInt(propval.VAL[0].VALUE);break;case'u_archiveeditable':n='archive';if(!ret[n]){ret[n]={editable:true,value:0,source:items[i]};}
ret[n].editable=(parseInt(propval.VAL[0].VALUE)==0?false:true);break;case'u_meeting':n='meeting';if(!ret[n]){ret[n]={editable:true,value:0,source:items[i]};}
ret[n].value=parseInt(propval.VAL[0].VALUE);break;case'u_meetingeditable':n='meeting';if(!ret[n]){ret[n]={editable:true,value:0,source:items[i]};}
ret[n].editable=(parseInt(propval.VAL[0].VALUE)==0?false:true);break;}}
catch(e)
{log.error(e);}}}
catch(e)
{log.error(e);return false;}
cb(ret);}).account(["u_smtp","u_pop3imap","u_webmail","u_avscan","u_aveditable","u_as","u_aseditable","u_quarantine","u_quarantineeditable","u_im","u_imeditable","u_teamchat","u_teamchatsupport","u_teamchateditable","u_webdocuments","u_webdocumentssupport","u_webdocumentseditable","u_gw","u_gweditable","u_sip","u_sipeditable","u_ftp","u_ftpeditable","u_sms","u_smseditable","u_activesync","u_activesynceditable","u_webdav","u_webdaveditable","u_archive","u_archiveeditable","u_meeting","u_meetingeditable"],account);}
_me.card=function(account,cb){com.console.item(cb).account('a_vcard',account);}
_me.addToGroup=function(groups,accounts,aHandler){if(typeof accounts!='object'){accounts=[accounts];}
if(typeof groups!='object'){groups=[groups];}
var group='';for(var g=0;g<groups.length;g++)
{var items=[];for(var i=0;i<accounts.length;i++)
{items.push({classname:[{VALUE:'tpropertymember'}],val:[{VALUE:accounts[i]}]});}
var aRequest={commandname:[{VALUE:'addaccountmembers'}],commandparams:[{accountemail:[{VALUE:groups[g]}],members:[{classname:[{VALUE:'tpropertymembers'}],val:[{item:items}]}]}]};this.create_iq(aRequest,[this,'__response',[[aHandler]]]);}
return true;}
_me.addAllToGroup=function(groups,domain,filter,aHandler){var masks={namemask:[{VALUE:'*'}]};if(filter.namemask){masks.namemask[0].VALUE=filter.namemask;}
if(filter.typemask){masks.typemask=[{VALUE:filter.typemask}];}
if(typeof groups!='object'){groups=[groups];}
var group='';for(var g=0;g<groups.length;g++)
{var aRequest={commandname:[{VALUE:'addallaccountmembers'}],commandparams:[{accountemail:[{VALUE:groups[g]}],domainstr:[{VALUE:domain}],filter:[masks]}]};this.create_iq(aRequest,[this,'__response',[[aHandler]]]);}
return true;}
_me.__response=function(aData,aHandler){try
{executeCallbackFunction(aHandler,aData);}
catch(e){log.error(['wmuser-response',e]);}};if(!com){var com={};}
com.user=new wm_user();