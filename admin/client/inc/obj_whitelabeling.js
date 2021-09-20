_me = obj_whitelabeling.prototype;
function obj_whitelabeling(){};

obj_whitelabeling.LOGIN_SETTINGS = {
	layout_settings: [
		'login_logo_name','logo_file',
		'login_color',
		'login_background','login_background_name','login_background_file',
		'search_phrase',
		'facebook_link','twitter_link','linkedin_link'
	],
	custom_login_fields: [
		'login_verification_enabled','login_verification_type',
		'nickname_enabled','nickname_required',
		'company_enabled','company_required',
		'job_enabled','job_required',
		'profession_enabled','profession_required',
		'mobile_phone_enabled','mobile_phone_required',
		'work_phone_enabled','work_phone_required',
		'home_phone_enabled','home_phone_required',
		'im_enabled','im_required',
		'gender_enabled','gender_required',
		'birthday_enabled','birthday_required',
		'homepage_enabled','homepage_required'
	],
	restrictions: [
		'disable_languages','disable_remember','disable_autofill','disable_signup',
		'contact_support','support_require_number','show_search',
		'facebook_disabled','twitter_disabled','linkedin_disabled'
	]
};
obj_whitelabeling.WEBMAIL_SETTINGS = {
	layout_settings: [
		'title',
		'skin',
		'skin_style'
	]
};
obj_whitelabeling.WEBADMIN_SETTINGS = {
	layout_settings_admin: [
		'title',
		'skin_style'
	]
};
obj_whitelabeling.ICECHAT_SETTINGS = {
	icechat_settings: [
		'login_color',
		'login_background_name',
		'login_background_file'
	]
};
obj_whitelabeling.COMBINED_SETTINGS = {
	layout_settings: obj_whitelabeling.WEBMAIL_SETTINGS.layout_settings,
	layout_settings_admin: obj_whitelabeling.WEBADMIN_SETTINGS.layout_settings_admin,
	icechat_settings: obj_whitelabeling.ICECHAT_SETTINGS.icechat_settings
}
obj_whitelabeling.BANNER_SETTINGS = {
	banner_options: [
		'customer_id',
		'desktop_type','desktop_url','desktop_code',
		'mobile_type','mobile_url','mobile_code',
		'top_type','top_url','top_code',
		'below_type','below_url','below_code'
	],
	restrictions: ['enable_adsense']
};
obj_whitelabeling.CONFERENCING = {
	conferencing_options: [
		'jitsi_logo_file', 'jitsi_logo_name'
	]
};

/**
 * @brief:
 * @date : 26.10.2014
 **/
_me.__constructor = function(s){
	var me = this;

	var view = this._view = new WhiteLabelingView(this);

	view.addSaveButton();

	this.__globalResources=helper.clone(gui._globalInfo.resources);
	this.__is_default_enabled=false;
	this.__resource_level=RESOURCE_LEVEL_SERVER;
	this.__who=false;
	if(location.parsed_query.domain){
		this.__resource_level=RESOURCE_LEVEL_DOMAIN;
		this.__who=location.parsed_query.domain;
	}
	if(location.parsed_query.account){
		this.__resource_level=RESOURCE_LEVEL_ACCOUNT;
		this.__who=location.parsed_query.account;
	}

	me.__domaindetail=false;
	if(location.parsed_query.domain){
		me.__domaindetail=location.parsed_query.domain;
	}

	if(!me.__domaindetail){
		gui.frm_main.main._init({
			name:'whitelabeling',
			heading:{
				value:getLang('main::white_labeling')
			}
		});
	}

	// Deciding on which level to apply the settings (server or domain)
	this._level = com;
	if(this.__domaindetail) {
		this._level = new Domain(this.__domaindetail);
	}
	// Create a container for all settings
	this._data = new IWAPI.Collection('Settings');

	/** settings */
	this.__settings={};

	this.__settings.skin={};
	this.__settings.skin_style={
		'default':getLang('whitelabeling::blue'),
		'black':getLang('whitelabeling::black'),
		'brown':getLang('whitelabeling::brown'),
		'graphite':getLang('whitelabeling::graphite'),
		'green':getLang('whitelabeling::green'),
		'orange':getLang('whitelabeling::orange'),
		'pink':getLang('whitelabeling::pink'),
		'purple':getLang('whitelabeling::purple'),
		'red':getLang('whitelabeling::red'),
		'yellow':getLang('whitelabeling::yellow')
	}
	this.__settings.background_urls = {
		default_0: "background--default.jpg",
		default_1: "background--krivan.jpg",
		default_2: "background--prague2.jpg",
		default_3: "background--adrspach1.jpg",
		default_4: "background--czechcity.jpg",
		default_5: "background--prague1.jpg",
		default_6: "background--slovakia.jpg",
		default_7: "background--adrspach2.jpg",
		default_8: "background--czech.jpg",
		default_9: "background--czech1.jpg",
		default_10: "background--pleso.jpg",
		default_11: "background--tatras.jpg",
		default_12: "background--vine.jpg",
		default_13: "background--pragueboats.jpg",
		default_14: ''
	};
	this.__settings._getFileLabel = function(file) {
		var files = this.background_urls;
		for(var lbl in files) {
			if(files[lbl]==file) {
				return lbl;
			}
		}
	}

};

/** activate colorpickers to switch background images and activate imagepicker */
_me._bindColorPickerWithImagepicker = function(preview,object,imageTemplate){
	var me=this;

	// Make sure that background in preview changes
	var defaultImage = me[imageTemplate.replace("#COLOR#","default")+"0"];
	defaultImage.__moreGroupOnchange = defaultImage.__moreGroupOnchange || [];
	defaultImage.__moreGroupOnchange.push(function(that){
		preview._setAttribute("background",that._groupValue());
		// Set background image for preview
		var img = me.radio_login_background_image_default_0._groupValue();
		if(img) {
			var url = "./client/skins/default/login/images/";
			url += me.__settings.background_urls[img];
			preview._main.style.backgroundImage = "url("+url+")";
		}
		// Clear out any previously uploaded image name
		me.input_login_background_image_input._value("");
//		me._getAnchor('fb_login_background_image')._value("");
	});

}

_me._hash_handler=function(){
	var me=this;

	this._draw('obj_whitelabeling');

	// hide language settings for webadmin if not under global settings
	if(me.__domaindetail){
		me._getAnchor('fb_language').setAttribute('is-hidden',1);
		me.dropdown_language._disabled(true);
	}

	me._getAnchor('fi_wc_default').removeAttribute('is-hidden');
	me._getAnchor('fi_login_default').removeAttribute('is-hidden');
	me._getAnchor('fi_wa_default').removeAttribute('is-hidden');
	me.__is_default_enabled=true;

	// activate imagepickers
	me._bindColorPickerWithImagepicker(
		me.slider_login.preview_login,
		me.radio_login_colorpicker_default,
		"radio_login_background_image_#COLOR#_"
	);

	// Set background used in login preview
	var url = "url(./server/download.php?class=background";
	url += "&fullpath="+encodeURIComponent(me.__domaindetail || '__@@GLOBAL@@__');
	url += "&uid="+Date.now();
	url += "&resize=1&width=572)";
	this.slider_login.preview_login._main.style.backgroundImage = url;

	// Set logo used in preview
	var logo_custom = this.slider_login.preview_login._getAnchor('login_logo_custom');
	var logo_default = this.slider_login.preview_login._getAnchor('login_logo_default');
	var url = "./server/download.php?class=logo";
	url += "&fullpath="+encodeURIComponent(me.__domaindetail || '__@@GLOBAL@@__');
	url += "&uid="+Date.now();
	logo_custom.addEventListener('load', function() {
		logo_custom.removeAttribute('is-hidden');
		logo_default.setAttribute('is-hidden', '');
	});
	logo_custom.src = url;

	// Set background used in chat preview
	var url = "url(./server/download.php?class=icechat_background";
	url += "&fullpath="+encodeURIComponent(me.__domaindetail || '__@@GLOBAL@@__');
	url += "&uid="+Date.now();
	url += "&resize=1&width=464)";
	this.slider_icechat_skin.preview_icechat_skin._main.style.backgroundImage = url;

	/* Form user interaction functionality */

	// Search url input
	me.toggle_search._onchange = function(checked) {
		me.input_search._readonly(!checked);
		this._main.parentNode.classList[checked?'remove':'add']('disabled');
	}

	// Social integration
	me.toggle_facebook._onchange=function(checked){
		me.input_facebook._readonly(checked);
	};
	me.toggle_twitter._onchange=function(checked){
		me.input_twitter._readonly(checked);
	};
	me.toggle_linkedin._onchange=function(checked){
		me.input_linkedin._readonly(checked);
	};

	// Banners
	me.toggle_adsense._onchange=function(checked){
		me.input_adsense._readonly(!checked);
		me.radio_banner_desktop_code._disabled(!checked);
		me.radio_banner_mobile_code._disabled(!checked);
		me.radio_banner_top_code._disabled(!checked);
		me.radio_banner_bottom_code._disabled(!checked);
	};
	me.radio_banner_desktop._onchange=
	me.radio_banner_desktop_url._onchange=
	me.radio_banner_desktop_code._onchange=function(checked){
		me.input_banner_desktop_url._main.parentNode.setAttribute('is-hidden','1');
		me.input_banner_desktop_code._main.parentNode.setAttribute('is-hidden','1');
		switch(me.radio_banner_desktop._groupValue()) {
			case 'url':
				me.input_banner_desktop_url._main.parentNode.removeAttribute('is-hidden');
				break;
			case 'code':
				me.input_banner_desktop_code._main.parentNode.removeAttribute('is-hidden');
				break;
		}
	};
	me.radio_banner_mobile._onchange=
	me.radio_banner_mobile_url._onchange=
	me.radio_banner_mobile_code._onchange=function(checked){
		me.input_banner_mobile_url._main.parentNode.setAttribute('is-hidden','1');
		me.input_banner_mobile_code._main.parentNode.setAttribute('is-hidden','1');
		switch(me.radio_banner_mobile._groupValue()) {
			case 'url':
				me.input_banner_mobile_url._main.parentNode.removeAttribute('is-hidden');
				break;
			case 'code':
				me.input_banner_mobile_code._main.parentNode.removeAttribute('is-hidden');
				break;
		}
	};
	me.radio_banner_top._onchange=
	me.radio_banner_top_url._onchange=
	me.radio_banner_top_code._onchange=function(checked){
		me.input_banner_top_url._main.parentNode.setAttribute('is-hidden','1');
		me.input_banner_top_code._main.parentNode.setAttribute('is-hidden','1');
		switch(me.radio_banner_top._groupValue()) {
			case 'url':
				me.input_banner_top_url._main.parentNode.removeAttribute('is-hidden');
				break;
			case 'code':
				me.input_banner_top_code._main.parentNode.removeAttribute('is-hidden');
				break;
		}
	};
	me.radio_banner_bottom._onchange=
	me.radio_banner_bottom_url._onchange=
	me.radio_banner_bottom_code._onchange=function(checked){
		me.input_banner_bottom_url._main.parentNode.setAttribute('is-hidden','1');
		me.input_banner_bottom_code._main.parentNode.setAttribute('is-hidden','1');
		switch(me.radio_banner_bottom._groupValue()) {
			case 'url':
				me.input_banner_bottom_url._main.parentNode.removeAttribute('is-hidden');
				break;
			case 'code':
				me.input_banner_bottom_code._main.parentNode.removeAttribute('is-hidden');
				break;
		}
	};

	// Make backgrounds images visible and initialise
	for(var i in this.__settings.background_urls) {
		var bg = this['radio_login_background_image_'+i];
		if(bg) {
			bg._addcss("is-visible");
			bg._value(this.__settings.background_urls[i]);
		}
		var bg = this['radio_ic_background_image_'+i];
		if(bg) {
			bg._addcss("is-visible");
			bg._value(this.__settings.background_urls[i]);
		}
	}

	// activate use default buttons
	me.button_login_default._onclick=function(){
		gui.message.warning(getLang("warning::set_to_default"),false,[
			{
				value:getLang("generic::cancel"),
				type:'text borderless',
				method:'close'
			},
			{
				value:getLang("generic::set_to_default"),
				type:'success text',
				onclick:function(closeCallback){
					me._data.login.resetAll(function(r){
						if(r==1) {
							me._level.getSettings(obj_whitelabeling.LOGIN_SETTINGS,function(li){
								// Keep and fill in new data
								me._data.removeItem('login');
								me._data.addItem(li,'login');
								me._loadLogin(li);
								gui.message.toast(getLang("message::reset_to_default"));
							});
						} else {
							gui.message.error(getLang("error::default_reset_failed"));
						}
					});
					closeCallback();
					// Showing original IceWarp logo
					var img = me.slider_login.preview_login._main.getElementsByTagName('img')[0];
					var url = "./server/download.php?class=logo";
					url += "&fullpath="+encodeURIComponent(me.__domaindetail || '__@@GLOBAL@@__');
					url += "&uid="+Date.now();
					img.src = url;
				}
			}
		]);
	}
	me.button_wa_default._onclick=function(){
		gui.message.warning(getLang("warning::set_to_default"),false,[
			{
				value:getLang("generic::cancel"),
				type:'text borderless',
				method:'close'
			},
			{
				value:getLang("generic::set_to_default"),
				type:'success text',
				onclick:function(closeCallback){
					me._data.webadmin.resetAll(function(r){
						if(r==1) {
							me._level.getSettings(obj_whitelabeling.WEBADMIN_SETTINGS,function(wa){
								me._data.removeItem('webadmin');
								me._data.addItem(wa,'webadmin');
								me._loadWebAdmin(wa);
								gui.message.toast(getLang("message::reset_to_default"));
							});
						} else {
							gui.message.error(getLang("error::default_reset_failed"));
						}
					});
					closeCallback();
				}
			}
		]);
	}
	me.button_wc_default._onclick=function(){
		gui.message.warning(getLang("warning::set_to_default"),false,[
			{
				value:getLang("generic::cancel"),
				type:'text borderless',
				method:'close'
			},
			{
				value:getLang("generic::set_to_default"),
				type:'success text',
				onclick:function(closeCallback){
					me._data.webmail.resetAll(function(r){
						if(r==1) {
							me._level.getSettings(obj_whitelabeling.WEBMAIL_SETTINGS,function(wm){
								me._data.removeItem('webmail');
								me._data.addItem(wm,'webmail');
								me._loadWebMail(wm);
								gui.message.toast(getLang("message::reset_to_default"));
							});
						} else {
							gui.message.error(getLang("error::default_reset_failed"));
						}
					});
					closeCallback();
				}
			}
		]);
	}
	me.button_ic_default._onclick=function(){
		gui.message.warning(getLang("warning::set_to_default"),false,[
			{
				value:getLang("generic::cancel"),
				type:'text borderless',
				method:'close'
			},
			{
				value:getLang("generic::set_to_default"),
				type:'success text',
				onclick:function(closeCallback){
					me._data.icechat.resetAll(function(r){
						if(r==1) {
							me._level.getSettings(obj_whitelabeling.ICECHAT_SETTINGS,function(ic){
								me._data.removeItem('icechat');
								me._data.addItem(ic,'icechat');
								me._loadIceChat(ic);
							});
						} else {
							// Fail!
						}
					});
					closeCallback();

					// Server does not return default values so set manually
			/*		me.radio_ic_colorpicker_default._checked(true);
					me.radio_ic_background_image_default_0._checked(true);
					me.input_ic_background_image_input._value("");
					var url = "url(./server/download.php?class=icechat_background";
					url += "&fullpath="+encodeURIComponent(me.__domaindetail || '__@@GLOBAL@@__');
					url += "&uid="+Date.now();
					url += "&resize=1&width=464)";
					me.slider_icechat_skin.preview_icechat_skin._main.style.backgroundImage = url;
			*/	}
			}
		]);
	}

	// Load using unified settings
	this._load();

}

// Load all values from server
_me._load = function() {

	// Languages
	com.getSettings('languages',function(langs){
		// Fill dropdown will all available languages
		this.__settings.languages = langs;
		this.dropdown_language._fill(langs);
		// Get the currently selected language
		com.getProperty('c_system_server_language',function(lang){
			this._language = lang;
			if(!lang.value) {
				lang.value = 'en';
			}
			this.dropdown_language._setValue(lang);
		}.bind(this));
	}.bind(this));

	// Login Settings
	this._level.getSettings(obj_whitelabeling.LOGIN_SETTINGS,function(s){
		if(s.error) {
			gui.message.error(getLang("error::server_failure")+s.error);
			return;
		}

		this._data.addItem(s,'login');

		this._loadLogin(s);
		this._activateLogin();
	}.bind(this));

	// WebMail, WebAdmin and IceChat Settings
	this._level.getSettings(obj_whitelabeling.COMBINED_SETTINGS,function(s){
		if(s.error) {
			gui.message.error(getLang("error::server_failure")+s.error);
			return;
		}

		this._data.addItem(s.layout_settings,'webmail');
		this._data.addItem(s.layout_settings_admin,'webadmin');
		this._data.addItem(s.icechat_settings,'icechat');

		// For WebMail, get available design layouts
		com.settings.get('skins', function(layouts) {
			for(var id in layouts) {
				this.__settings.skin[id] = layouts[id];
			}
			this.dropdown_wc_skin._fill(this.__settings.skin);

			// Fill in WebMail section and activate preview
			this._loadWebMail(s.layout_settings);
			this._activateWebMail();
		}.bind(this));

		// Fill in WebAdmin section and activate preview
		this._loadWebAdmin(s.layout_settings_admin);
		this._activateWebAdmin();

		// Fill in IceChat section and activate preview
		this._loadIceChat(s.icechat_settings);
		this._activateIceChat();

	}.bind(this));

	// Banner options
	this._level.getSettings(obj_whitelabeling.BANNER_SETTINGS,function(banners){
		if(banners.error) {
			gui.message.error(getLang("error::server_failure")+banners.error);
			return;
		}

		this._data.addItem(banners,'banners');

		this._loadBanners(banners);
	}.bind(this));

	this._level.getSettings(obj_whitelabeling.CONFERENCING,function(conferencing){
		if(conferencing.error) {
			return gui.message.error(getLang("error::server_failure") + conferencing.error);
		}

		this._data.addItem(conferencing, 'conferencing');
		this._loadConferencing(conferencing);
	}.bind(this));

}

// Fill in values into Login section
_me._loadLogin = function(l) {
	var r = l.restrictions;
	var f = l.custom_login_fields;
	var g = l.layout_settings;

	// Default values when not defined on server
	g.login_color.default = 'default';
	g.login_background_name.default = this.__settings.background_urls['default_0'];

	// Some restriction have values that appear opposite to UI elements
	r.disable_languages.inversed = true;
	r.disable_remember.inversed = true;
	r.disable_autofill.inversed = true;
	r.disable_signup.inversed = true;
	r.facebook_disabled.inversed = true;
	r.twitter_disabled.inversed = true;
	r.linkedin_disabled.inversed = true;

	// Logo, colour and background for Login
	var preview = this.slider_login.preview_login;
	this.upload_logo_file._onfile = function(file) {
		if(!~['jpg', 'png', 'gif', 'svg'].indexOf((file.extension || '').toLowerCase())) {
			return gui.message.toast(getLang("error::unsupported_image_format"));
		}
		// Set uploaded logo as preview logo and show it
		var img = preview._main.getElementsByTagName('img')[0];
		var svg = img.parentNode.firstElementChild;
	//	if(file.type=="image/svg+xml")
		img.src = file.content;
		img.removeAttribute('is-hidden');
		svg.setAttribute('is-hidden',1);
		// Save upload filename
		g.logo_file.value = file.content;
		g.login_logo_name.value = 'login_logo.'+file.extension;
	}.bind(this);
	this.upload_background_file._onfile = function(file) {
		if(!~['jpg', 'png', 'gif'].indexOf((file.extension || '').toLowerCase())) {
			return gui.message.toast(getLang("error::unsupported_image_format"));
		}
		var filename = 'login_background.' + file.extension;
		g.login_background_name.initialValue = '';
		g.login_background_name.value = filename;
		g.login_background_file.value = file.content;
		// Uncheck any previously selected background after upload
		var checked = this.radio_login_background_image_default_0._groupValue();
		if(checked) {
			checked = this.__settings._getFileLabel(checked);
			this['radio_login_background_image_'+checked]._checked(false);
		}
		// Set uploaded image in preview
		preview._main.style.backgroundImage = 'url('+file.content+')';

	}.bind(this);
	this.radio_login_colorpicker_default._setValue(g.login_color);
	this.radio_login_background_image_default_0._setValue(g.login_background_name);

	// Set restriction values
	this.toggle_disable_language._setValue(r.disable_languages);
	this.toggle_disable_remember_me._setValue(r.disable_remember);
	this.toggle_disable_autofill._setValue(r.disable_autofill);
	this.toggle_disable_sign_up._setValue(r.disable_signup);
	// Restrictions for Support
	var disable_support = this.toggle_disable_support_link;
	var require_phone = this.checkbox_phone_required;
	disable_support._setValue(r.contact_support);
	require_phone._setValue(r.support_require_number);
	if(!disable_support._checked()) {
		require_phone._hide();
	}
	disable_support._onchange = function(checked) {
		require_phone[checked?'_show':'_hide']();
	}
	// Restrictions for Search
	this.toggle_search._setValue(r.show_search);
	this.input_search._setValue(g.search_phrase);

	// Sign Up fields to show
	var signups = ['mobile_phone','birthday','company','gender','home_phone','homepage','im','job','nickname','profession','work_phone'];
	var field = '';
	while(field=signups.pop()) {
		this['toggle_'+field]._setValue(f[field+'_enabled']);
		this['checkbox_'+field+'_required']._setValue(f[field+'_required']);
		this['toggle_'+field]._onchange = (function(field) {
			return function(checked) {
				if(checked) {
					field._main.removeAttribute('is-hidden');
				} else {
					field._main.setAttribute('is-hidden',1);
				}
			}
		})(this['checkbox_'+field+'_required']);
		if(!this['toggle_'+field]._checked()) {
			this['checkbox_'+field+'_required']._main.setAttribute('is-hidden',1);
		}
	}

	// Sign up verification
	var toggle = this.toggle_two_step_verification;
	var dropdown = this.dropdown_two_step_verification;
	dropdown._fill({
		none: '',
		email: getLang('WHITELABELING::EMAIL'),
		sms: getLang('WHITELABELING::SMS')
	});
	toggle._setValue(f.login_verification_enabled);
	dropdown._setValue(f.login_verification_type);
	dropdown._disabled(!toggle._checked());
	toggle._onchange = function(checked) {
		dropdown._disabled(!checked);
	}
	dropdown._onchange = function(e) {
		if(this._value()=='none') {
			toggle._checked(false);
		}
	}

	// Social integration
	this.toggle_facebook._setValue(r.facebook_disabled);
	this.input_facebook._setValue(g.facebook_link);
	this.toggle_twitter._setValue(r.twitter_disabled);
	this.input_twitter._setValue(g.twitter_link);
	this.toggle_linkedin._setValue(r.linkedin_disabled);
	this.input_linkedin._setValue(g.linkedin_link);

	// Set preview according to values
	var preview = this.slider_login.preview_login;

	preview._main.style.backgroundImage = "url(./server/download.php?class=background&fullpath=" + encodeURIComponent(this.__domaindetail || '__@@GLOBAL@@__') + "&uid=" + Date.now() + "&resize=1&width=572)";
	preview._main.className = preview._main.className.replace(/skin-[-a-z]+/,'');
	preview._main.classList.add('skin-'+(g.login_color.value || g.login_color.default));

	preview._enable('language',r.disable_languages!=1);
	preview._enable('remember',r.disable_remember!=1);
	preview._enable('autofill',r.disable_autofill!=1);
	preview._enable('sign_up',r.disable_signup);
	preview._enable('support',r.contact_support==1);
	preview._enable('search',r.show_search==1);

	preview._enable('facebook',r.facebook_disabled!=1);
	preview._enable('twitter',r.twitter_disabled!=1);
	preview._enable('linkedin',r.linkedin_disabled!=1);

}
// Activate preview logic for Login
_me._activateLogin = function() {
	var preview = this.slider_login.preview_login;
	var main = preview._main;
	var file = this._data.login.layout_settings.login_background_file;
	var name = this._data.login.layout_settings.login_background_name;

	this.radio_login_colorpicker_default._groupOnchange = function(v) {
		main.className = main.className.replace(/skin-[-a-z]+/,'');
		main.classList.add('skin-'+v._value());
	}

	this.radio_login_background_image_default_0._groupOnchange = function(v) {
		main.style.backgroundImage = 'url(./client/skins/default/login/images/'+v._value()+')';
		// Reset file data in case image was just uploaded
		file.value = null;
	}

	this.toggle_disable_language._onchange = function(check) {
		preview._enable('language',check);
	}
	this.toggle_disable_remember_me._onchange = function(check) {
		preview._enable('remember',check);
	}
	this.toggle_disable_autofill._onchange = function(check) {
		preview._enable('autofill',check);
	}
	this.toggle_disable_sign_up._onchange = function(check) {
		preview._enable('sign_up',check);
	}
	this.toggle_disable_support_link._onchange = function(check) {
		preview._enable('support',check);
	}
	this.toggle_search._onchange = function(check) {
		preview._enable('search',check);
	}

	this.toggle_facebook._onchange =
	this.toggle_twitter._onchange =
	this.toggle_linkedin._onchange =
	function(check) {
		preview._enable(this._name.substr(7),check);
	}

}

// Fill in values into WebClient section
_me._loadWebMail = function(wm) {
	wm.skin.default = 'default';
	wm.skin_style.default = 'default';

	this.input_wc_page_title._setValue(wm.title);
	this.dropdown_wc_skin._setValue(wm.skin);
	this.radio_wc_colorpicker_default._setValue(wm.skin_style);

	// Set preview according to values
	var preview = this.slider_webmail_skin.preview_webclient_skin;
	preview._setAttribute('skin',wm.skin.value || wm.skin.default);
	preview._setAttribute('style',wm.skin_style.value || wm.skin_style.default);
}
// Activate preview logic for WebMail
_me._activateWebMail = function() {
	var preview = this.slider_webmail_skin.preview_webclient_skin;

	this.dropdown_wc_skin._onchange = function(e) {
		if(e && e.target) {
			preview._setAttribute('skin',e.target.value);
		}
	}
	this.radio_wc_colorpicker_default._groupOnchange = function(v) {
		preview._setAttribute('style',v._value());
	}
}

// Fill in values into WebAdmin section
_me._loadWebAdmin = function(wa) {
	wa.skin_style.default = 'default';

	this.input_wa_page_title._setValue(wa.title);
	this.radio_wa_colorpicker_default._setValue(wa.skin_style);

	// Set preview according to values
	document.body.className = document.body.className.replace(/skin-[-a-z]+/,'');
	document.body.classList.add('skin-'+(wa.skin_style.value || wa.skin_style.default));
}
// Activate preview logic for WebAdmin
_me._activateWebAdmin = function() {
	this.radio_wa_colorpicker_default._groupOnchange = function(v) {
		document.body.className = document.body.className.replace(/skin-[-a-z]+/,'');
		document.body.classList.add('skin-'+v._value());
	}
}

// Fill in values into IceChat section
_me._loadIceChat = function(ic) {
	ic.login_color.default = 'default';
	ic.login_background_name.default = this.__settings.background_urls['default_0'];

	this.radio_ic_colorpicker_default._setValue(ic.login_color);
	this.radio_ic_background_image_default_0._setValue(ic.login_background_name);

	var preview = this.slider_icechat_skin.preview_icechat_skin;
	this.upload_ic_upload_image._onfile = function(file) {
		if(!~['jpg', 'png', 'gif'].indexOf((file.extension || '').toLowerCase())) {
			return gui.message.toast(getLang("error::unsupported_image_format"));
		}
		// Custom filename
		var filename = 'login_background.' + file.extension;
		ic.login_background_name.value = filename;
		ic.login_background_file.value = file.content;
		// Uncheck any previously selected background after upload
		var checked = this.radio_ic_background_image_default_0._groupValue();
		if(checked) {
			checked = this.__settings._getFileLabel(checked);
			this['radio_ic_background_image_'+checked]._checked(false);
		}
		// Set uploaded image in preview
		preview._main.style.backgroundImage = 'url('+file.content+')';
	}.bind(this);

	// Set preview according to values
	var preview = this.slider_icechat_skin.preview_icechat_skin;

}
// Activate preview logic for IceChat
_me._activateIceChat = function() {
	var preview = this.slider_icechat_skin.preview_icechat_skin;
	var main = preview._main;
	var file = this._data.icechat.login_background_file;

	this.radio_ic_colorpicker_default._groupOnchange = function(v) {
		main.className = main.className.replace(/skin-[a-z]+/,'');
		main.classList.add('skin-'+v._value());
	}

	this.radio_ic_background_image_default_0._groupOnchange = function(v) {
		main.style.backgroundImage = 'url(./client/skins/default/login/images/icechat/'+v._value()+')';
		// Reset file data in case image was just uploaded
		file.value = null;
	}
}

// Fill in values into Banners section
_me._loadBanners = function(s) {
	this.toggle_adsense._setValue(s.restrictions.enable_adsense);

	var b = s.banner_options;
	this.input_adsense._setValue(b.customer_id);

	// Set default values
	b.desktop_type.default = 'none';
	b.mobile_type.default = 'none';
	b.top_type.default = 'none';
	b.below_type.default = 'none';

	this.radio_banner_desktop._setValue(b.desktop_type);
	this.input_banner_desktop_url._setValue(b.desktop_url);
	this.input_banner_desktop_code._setValue(b.desktop_code);

	this.radio_banner_mobile._setValue(b.mobile_type);
	this.input_banner_mobile_url._setValue(b.mobile_url);
	this.input_banner_mobile_code._setValue(b.mobile_code);

	this.radio_banner_top._setValue(b.top_type);
	this.input_banner_top_url._setValue(b.top_url);
	this.input_banner_top_code._setValue(b.top_code);

	this.radio_banner_bottom._setValue(b.below_type);
	this.input_banner_bottom_url._setValue(b.below_url);
	this.input_banner_bottom_code._setValue(b.below_code);
}

// Fill in values into Banners section
_me._loadConferencing = function(c) {
	this.upload_jitsi_logo_file._onfile = function(file) {
		c.jitsi_logo_file.value = file.content;
		c.jitsi_logo_name.value = 'jitsi_logo.'+file.extension;
	}.bind(this);
}

_me._issaved = function() {
	return !this._data.hasChanged();
}

_me._save = function(callback){
	var webadmin = this._data.webadmin;

	var changed = [];
	for(var i in this._data) {
		if(this._data[i].hasChanged()) {
			changed.push(this._data[i]);
		}
	}
	if(this._language.hasChanged()) {
		changed.push(this._language);
	}
	var failed = false;
	var saver = function(set) {
		set.saveChanges(function(r){
			if(r!=1) {
				failed = true;
			}
			if(set = changed.pop()) {
				saver(set);
			} else if(failed) {
				gui.message.error(getLang("error::save_unsuccessful"));
			} else {
				gui.message.toast(getLang("message::save_successfull"));
				// Note restriction changes are not updated, not used within WA
				gui._globalInfo.resources.removeItem('layout_settings_admin');
				gui._globalInfo.resources.addItem(webadmin);
				gui.frm_main._applySkin();
				if(callback) {
					callback(!failed);
				}
			}
		});
	};
	// If anything changed, save
	if(changed.length) {
		saver(changed.pop());
	}
}

_me._reset = function() {
	this._data.revertChanges();
}

/* View */

var WhiteLabelingView = function(controller) {
	this._control = controller;

}
WhiteLabelingView.prototype = Object.create(CoreView.prototype);
