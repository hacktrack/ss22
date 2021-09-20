_me = obj_domainsettings.prototype;
function obj_domainsettings(){};

/**
 * @brief:
 * @date : 01.12.2014
 **/
_me.__constructor = function(s){
	var me = this;
	var parent=this._parent;

	me._domainTypes={
		'*0':getLang('domainlist::standard'),
		'*2':getLang('domainlist::domain_alias'),
		'*3':getLang('domainlist::backup_domain'),
		'*4':getLang('domainlist::distributed_domain'),
		'*1':getLang('domainlist::etrn_atrn_queue')
	}

	me._unknownAccountActions={
		"*0":getLang('domaindetail::reject'),
		"*1":getLang('domaindetail::forward_to_address'),
		"*2":getLang('domaindetail::delete')
	}

	me._verification={
		"*0":getLang('domainlist::verification_default'),
		"*1":getLang('domainlist::verification_use_minger_with_password'),
		"*2":getLang('domainlist::verification_usevrfy_command'),
		"*3":getLang('domainlist::verification_use_rcpt_to_command')
	}

	gui.frm_main.main._setHeadingButton('generic::save',function(){me._save();},'button text success');
	gui.frm_main.main._setHeading(punycode.ToUnicode(location.parsed_query.domain));

};

_me._load = function(e,aData)
{
	try
	{

		var me=this;
		var parent=this._parent;

		log.log('Domain settings should be loaded');

		var view = this._view = new DomainSettingsView(this);

		me._draw('obj_domainsettings', '', {}/*{items:items,info:info}*/);

		/** fill dropdowns and other fixed values */
		this.dropdown_verification._fill(this._verification);
		this.dropdown_domain_type._fill(me._domainTypes);
		this.dropdown_unknown_accounts._fill(me._unknownAccountActions);
		this.input_domain_name._value(punycode.ToUnicode(location.parsed_query.domain));
		this.input_domain_name._readonly(true);
		com.general.install_url(function(url){
			me._getAnchor('button_domain_icewarp_outlook_sync_download').target="_blank";
			me._getAnchor('button_domain_icewarp_outlook_sync_download').href=url+'download/outlook-sync.exe';

			me._getAnchor('button_domain_icewarp_desktop_download').target="_blank";
			me._getAnchor('button_domain_icewarp_desktop_download').href=url+'download/desktop-setup.msi';
		});

		me.input_target_email._disabled(true);
		if(gui._globalInfo.admintype!=USER_ADMIN && !global._accounts_global_domains_usediskquota && !global._accounts_global_domains_usediskquota){
			me._getAnchor('fi_account_quota_storage').setAttribute('is-hidden',1);
			me.button_change_quotas._disabled(true);
		}
		if(gui._globalInfo.admintype!=USER_ADMIN){
			me._getAnchor('fi_features').setAttribute('is-hidden',1);
			me.button_domain_name._hide(true);
		}
		if(gui._globalInfo.licence.licensetype=="saas" || gui._globalInfo.licence.licensetype=="cloud") {
			this._getAnchor('fi_max_allowed_plan').removeAttribute("is-hidden");
			var plan = gui._globalInfo.licence.plans;
			var options = {'0': getLang("SUBSCRIPTION_PLANS::ANY_PLAN")};
			for(var i=0,l=plan.length;i<l;i++) {
				var label = getLang("SUBSCRIPTION_PLANS::"+plan[i].planlabel);
				options[plan[i].planid] = label.indexOf("::")==-1 ? label : plan[i].planlabel;
			}
			this.dropdown_max_allowed_plan._fill(options);
		}
		
		/** ON methods */
		me.button_domain_name._onclick=function(){
			me._rename();
		};
		gui._changeObserver.assignTrigger(me.button_domain_name);

		me.button_dns_validation._onclick=function(){
			me._parent.domaindetail._DNSValidation();
		}

		me.button_dkim._onclick=function(){
			me._parent.domaindetail._DKIM();
		}

		me.dropdown_unknown_accounts._onchange=function(){
			if(this._value()==1){
				me.input_target_email._disabled(false);
			}else{
				me.input_target_email._disabled(true);
			}
		}

		me.dropdown_domain_type._onchange=function(){
			switch(this._value()){
				case '0':
					me.input_value._disabled(true);
					me.button_value._disabled(true);
					me.dropdown_verification._disabled(true);
					me.input_password._disabled(true);
				break;
				case '2':
					me.input_value._disabled(false);
					me.button_value._disabled(false);
					me.dropdown_verification._disabled(true);
					me.input_password._disabled(true);
				break;
				case '3':
				case '4':
					me.input_value._disabled(false);
					me.button_value._disabled(true);
					me.dropdown_verification._disabled(false);
					me.input_password._disabled(false);
				break;
				case '1':
					me.input_value._disabled(false);
					me.button_value._disabled(true);
					me.dropdown_verification._disabled(true);
					me.input_password._disabled(true);
				break;
			}
		}
		me.button_value._onclick=function(){
			gui.accountpicker(function(data){
					me.input_value._value(data[0].id);
				},{
					domainpicker:true,
					singledomain:true
				});
		}

		me.button_add_alias._onclick=function(e){
			me._addAlias();

			e.stopPropagation();
			e.cancelBubble=true;
			return false;
		}
		me.button_change_quotas._onclick=function(e){
			me._parent.left_menu._go('limits');
			e.stopPropagation();
			e.cancelBubble=true;
			return false;
		}
		me.button_domain_features._onclick=function(e){
			me._features();
		}
		me.button_domain_mobile_devices_manage._onclick=function(e){
			me._parent.left_menu._go('mobile_devices');
		}
		me.button_domain_icewarp_outlook_sync_manage._onclick=function(){
			me._outlookSyncManage();
		}

		var domain = new Domain(location.parsed_query.domain);
		domain.getProperties([
			'd_domainvalue',
			'd_verifytype',
			'd_mingerpassword',
			'd_im_roster_populated',
			'd_2f_enabled',
			'd_saas_plan',
			'd_unknownforwardto',
			'd_unknownuserstype',
			'd_diskquota',
			'd_storageuse',
			'd_numberlimit',
			'd_messagessenttoday',
			'd_aliaslist',
			'd_adminemail',
			'd_description',
			'd_type'
		],function(p){
			this._data = p;

			// General Domain info
			this.input_domain_description._setValue(p.d_description);
			this.dropdown_domain_type._setValue(p.d_type);
			this.input_value._setValue(p.d_domainvalue);
			this.dropdown_verification._setValue(p.d_verifytype);
			this.input_password._setValue(p.d_mingerpassword);
			this.input_administrator_email._setValue(p.d_adminemail);
			this.multiple_add_alias._setValue(p.d_aliaslist);
			if(p.d_aliaslist.propertyRights!=2) {
				this.button_add_alias._main.setAttribute('is-hidden','1');
			}

			// Quotas
			var limit = +p.d_numberlimit || 0;
			var sent = +p.d_messagessenttoday || 0;
			var percent = 0;
			if(limit>0){
				percent=Math.round((sent/limit)*10000)/100;
				if(percent>100){percent=100;}
				this.quota_emails._label(sent+" "+getLang("accountdetail::of")+" "+limit);
				this.quota_emails._value(percent);
			}else{
				this.quota_emails._label(sent.toString());
				this.quota_emails._value(0);
			}

			var limit = +p.d_diskquota || 0;
			var used = +p.d_storageuse || 0;
			this.quota_storage._label(helper.bytes2hr(used)+(limit>0?" "+getLang("accountdetail::of")+" "+helper.bytes2hr(limit*1024):''));
			if(limit>0){
				this.quota_storage._value(Math.round((used/limit)*10000)/100);
			}

			// User Permissions
			this.dropdown_max_allowed_plan._setValue(p.d_saas_plan);
			this.dropdown_max_allowed_plan._disabled(!~[USER_ADMIN, USER_WEB].indexOf(+gui._globalInfo.admintype));
			this.dropdown_unknown_accounts._setValue(p.d_unknownuserstype);
			this.input_target_email._setValue(p.d_unknownforwardto);
			this.toggle_2_factor_authentication._setValue(p.d_2f_enabled);
			this.toggle_instant_messaging_shared_roster._setValue(p.d_im_roster_populated);

		}.bind(this));

	}
	catch(e){
		log.error(e);
	}
}

_me._addAlias=function(value,right){
	var v = this._data.d_aliaslist.addItem("item","");
	this.multiple_add_alias._add(v);
}

_me._features=function(){
	var popup=gui._create('popup','obj_popup');
	popup._init({
		name:'features',
		heading:{
			value:getLang('accountdetail::features')
		},
		fixed:false,
		iwattr:{
			height:'full',
			width:'large'
		},
		footer:'obj_accountinfo_features_footer',
		content:"obj_accountinfo_features"
	});

	popup.content._load(location.parsed_query.domain,true);
}

_me._outlookSyncManage=function(){
	var popup=gui._create('popup','obj_popup');
	popup._init({
		name:'accountinfo_os_manage',
		heading:{
			value:getLang('client_applications::icewarp_outlook_sync')
		},
		fixed:false,
		iwattr:{
			height:'full',
			width:'large'
		},
		footer:'obj_accountinfo_os_manage_footer',
		content:'obj_accountinfo_os_manage'
	});

	popup.content._load(location.parsed_query.domain,true);
}

_me._issaved = function(target) {
	return !this._data.hasChanged();
}

_me._save = function(callback){
	var view = this._view;

	if(this._data.hasChanged()) {

		// Remove empty elements in the alias list
	/*	var l = this._data.d_aliaslist.length;
		while(l--) {
			if(this._data.d_aliaslist[l].value=="") {
				this._data.d_aliaslist.splice(l,1);
			}
		}
		*/
		this._data.saveChanges(function(r){
			view.saveNotification(r==1);
			if(callback) {
				callback(r==1);
			}
		});
	}
}

_me._reset = function() {
	this._data.revertChanges();
}

_me._rename=function(){
	var me=this;
	var popup=gui._create('popup','obj_popup');
	popup._init({
		name:'rename',
		heading:{
			value:getLang('domaindetail::change_domain_name')
		},
		template:'obj_domainsettings_rename',
		fixed:false,
		iwattr:{
			height:'auto',
			width:'medium'
		},
		footer:'default',
		type:'default'
	});

	popup.main.input_name._value(location.parsed_query.domain);

	popup.main.btn_save._onclick=function() {
		if(popup.main.input_name._value() === location.parsed_query.domain) {
			return popup._close();
		}
		if(gui._globalInfo.domain === location.parsed_query.domain) {
			gui.message.warning(getLang("domaindetail::same_domain_helper"), false, [
				{
					value: getLang("generic::cancel"),
					type: 'text borderless',
					method: 'close'
				}, {
					value: getLang("domaindetail::rename_and_logout"),
					type: 'success text',
					onclick: function() {
						me.__renameCallback(popup, true);
					}
				}
			]);
		} else {
			popup.main.btn_save._disabled(true);
			me.__renameCallback(popup);
		}
	}
}

_me.__renameCallback = function(popup, logoutOnSuccess) {
	var name = popup.main.input_name._value();
	var domain = location.parsed_query.domain;
	com.domain.rename(domain, name, function(success,error) {
		log.log(['domainsettings-rename-save', success, error]);
		popup.main.btn_save._disabled(true);
		if(success) {
			if(logoutOnSuccess) {
				logout(false, function(url) {
					gui.hashhandler._changed = function() {}; // stop listening to hash change
					location = url ? url : (location.origin + location.pathname + '#sign-in&username=' + gui._globalInfo.email.replace('@' + domain, '@' + name));
				});
			} else {
				gui.message.toast(getLang('message::domain_renamed'));
				location.hash = location.hash.replace('domain=' + encodeURIComponent(domain), 'domain=' + encodeURIComponent(name));
				popup._close();
			}
		} else {
			log.error(['e:save-failed',error]);
		}
	});
}


var DomainSettingsView = function(controller) {
	this._control = controller;

}
DomainSettingsView.prototype = Object.create(CoreView.prototype);
