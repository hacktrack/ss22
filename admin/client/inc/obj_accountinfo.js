function obj_accountinfo(){};
var _me = obj_accountinfo.prototype;
/**
 * @brief:
 * @date : 01.12.2014
 **/
_me.__constructor = function(s){
	var me = this;
	this._accountDomain=location.parsed_query.account.split('@');
	this._accountDomain=this._accountDomain[this._accountDomain.length-1];

	storage.library('wm_user');

	var view = this._view = new AccountInfoView(this);

	gui.frm_main.main._setHeadingButton('generic::save',function(){me._save();},'button text success');

	this._selfHash="#menu=accountdetail&account=/ACCOUNT/&type=/TYPE/";

};

_me._load = function(domain)
{
	try
	{
		var me=this;

		// set guestaccountstatus
		if(this._isguestaccount === void 0){
			com.console.item(function(result){
				try
				{
					if(parseInt(result.Array.IQ[0].QUERY[0].RESULT[0].ITEM[0].PROPERTYVAL[0].VAL[0].VALUE)){
						me._isguestaccount = true;
					}else{
						me._isguestaccount = false;
					}
				}
				catch(e)
				{
					log.error(["accountinfo-load-callback",e]);
					me._isguestaccount = false;
				}

				// call load, guest account status is prepared
				log.log(["accountinfo-load-callback","call load, guest account status is prepared",me._isguestaccount]);
				me._load(domain);

			}).account("u_isguestaccount",location.parsed_query.account);

			return;
		}

		me._draw('obj_accountinfo', '', {guest:me._isguestaccount});
		gui.frm_main.main._getAnchor('main_content').scrollTop=0;

		// Check if outlook and desktop licences are allowed on domain level
		var domain = new Domain(
			location.parsed_query.account.split("@")[1]
		).getProperties([
			'D_ConnectorSupport',
			'D_DesktopSupport',
			'D_Saas_Plan'
		],function(props){
			// Show licence button for outlook sync if supported
			if(props.D_ConnectorSupport==1) {
				me.button_account_icewarp_outlook_sync_licenses._show();
			}
			// Show licence button for Desktop client if supported
			if(props.D_DesktopSupport==1) {
				me.button_account_icewarp_desktop_licenses._show();
			}
			me._props = props;
			me._initPlans();
		});

		var user = new Account(location.parsed_query.account);
		user.getPropertySet([
			'u_name',
			'u_comment',
			'u_description',
			'u_spamadmin',
			'u_2f_enabled',
			'u_saas_plan'
		],function(p){
			this._data = p;

			this.__initial_username = p.U_Mailbox.value;

			// General
			this.input_account_firstname._setValue(p.A_Name.name);
			this.input_account_lastname._setValue(p.A_Name.surname);
			this.input_account_username._setValue(p.U_Mailbox);
			this.input_account_description._setValue(p.u_comment);

			// Aliases
			this.multiple_add_alias._label("@"+this._accountDomain);
			this.multiple_add_alias._setValue(p.A_AliasList);
			if(p.A_AliasList.propertyRights!=2){
				this.button_add_alias._disabled(true);
			}

			// Show last login info
			var loginip = p.A_LastLoginIP.value;
			var logintime = +p.A_LastLoginTime;
			if(loginip) {
				this._getAnchor('last_login_ip').textContent = loginip;
			}
			if(logintime && !isNaN(logintime)) {
				this._getAnchor('last_login_date').innerHTML=helper.date(getLang('datetime::php_date'),logintime);
				this._getAnchor('last_login_time').innerHTML=helper.date(getLang('datetime::php_time'),logintime);
			} else {
				this._getAnchor('last_login_date').parentNode.innerHTML = getLang('accountdetail::not_yet');
				this._getAnchor('last_login_ip').parentNode.innerHTML = '';
			}

			// Avatar image
			if(p.A_Image) {
				var elm = this._getAnchor("userimage");
				this.button_upload_photo._displayElement(elm);
				this.button_upload_photo._setValue(p.A_Image);
			}

			// Calculate Emails sent
			var sent = +p.A_MessagesSentToday || 0;
			var percent = 0;
			var limit = +p.u_numbersendlimit || 0;
			if(limit>0){
				percent=Math.round((sent/limit)*10000)/100;
				if(percent>100){percent=100;}

				this.quota_emails._label(sent+" "+getLang("accountdetail::of")+" "+limit);
				this.quota_emails._value(percent);
			}else{
				this.quota_emails._label(sent.toString());
				this.quota_emails._value(0);
			}

			// Calculate Storage Usage
			var isQuota=false;
			var quota_size='0 B';
			var quota=0;
			var size='0 B';
			if(p.A_Quota.mailboxquota)
			{
				var mailboxsize = p.A_Quota.mailboxsize*1024;
				var mailboxquota = p.A_Quota.mailboxquota*1024;

				size=helper.bytes2hr(mailboxsize);

				if(mailboxquota>0)
				{
					quota_size=helper.bytes2hr(mailboxquota);
					isQuota=true;
					quota=Math.round((mailboxsize/mailboxquota)*10000)/100;
				}
			}
			if(isQuota){
				this.quota_storage._label(size+" "+getLang("accountdetail::of")+" "+quota_size);
				this.quota_storage._value(quota);
			}else{
				this.quota_storage._label(size);
			}

			this._initPlans();

			// Account type
			var aFill;
			if (gui._globalInfo.admintype == USER_ADMIN || p.A_AdminType == '1'){
				aFill = {
					'0':getLang('userlist::user'),
					'1':getLang('userlist::admin'),
					'2':getLang('userlist::domain_admin'),
					'3':getLang('userlist::webadmin')
				};

				if (gui._globalInfo.admintype != USER_ADMIN)
					this.dropdown_account_type._disabled(true);
			}
			else{
				aFill = {
					'0':getLang('userlist::user'),
					'2':getLang('userlist::domain_admin'),
					'3':getLang('userlist::webadmin')
				};
			}

			this.dropdown_account_type._fill(aFill);
			this.dropdown_account_type._setValue(p.A_AdminType);

			this._getAnchor('user_type_icon')._admintype='subtype_'+p.A_AdminType;
			addcss(this._getAnchor('user_type_icon'),this._getAnchor('user_type_icon')._admintype);

			// Account state
			var state = p.A_State.state;
			this.dropdown_account_active._setValue(state);
			if(state==1 || state==2) {
				this._getAnchor('fi_account_is_disabled').removeAttribute('is-hidden');
			}
			addcss(this._getAnchor('user_state_icon'),'state_'+state);

			// Enable Reset of 2 factor authentication if enabled
			if(p.u_2f_enabled==1) {
				var elm = me._getAnchor('text_2_factor_authentication');
				elm.textContent = getLang('ACCOUNTDETAIL::ENABLED');
				me.button_2_factor_authentication._disabled(false);
			}

		}.bind(this));

		this.button_2_factor_authentication._onclick = function() {
			gui.message.warning(
				getLang("accountdetail::reset_authentication"),
				false,
				[{
					value:getLang("generic::cancel"),
					type:'text borderless',
					method:'close'
				},{
					value:getLang("generic::reset"),
					type:'success text',
					onclick:function(){
						gui.popup._close();
						com.security.reset2Factor(user.id,function(r){
							if(r==1) {
								gui.message.toast(getLang('accountdetail::authentication_reset_succeeded'));
							} else {
								gui.message.error(getLang('error::reset_failed'));
							}
						});
					}
				}]
			);
		}

		if(me._isguestaccount){

		}else{
			gui.frm_main.main._setHeading(punycode.ToUnicode(location.parsed_query.account));
		}

		// var aFill;
		// if (gui._globalInfo.admintype == USER_ADMIN){
		// 	aFill = {
		// 		'0':getLang('userlist::user'),
		// 		'1':getLang('userlist::admin'),
		// 		'2':getLang('userlist::domain_admin'),
		// 		'3':getLang('userlist::webadmin')
		// 	};
		// }
		// else{
		// 	aFill = {
		// 		'0':getLang('userlist::user'),
		// 		'2':getLang('userlist::domain_admin'),
		// 		'3':getLang('userlist::webadmin')
		// 	};
		// }

		// this.dropdown_account_type._fill(aFill);

		this.dropdown_account_type._onchange=function(e){
			var val=me.dropdown_account_type._value();
			removecss(me._getAnchor('user_type_icon'),me._getAnchor('user_type_icon')._admintype);
			me._getAnchor('user_type_icon')._admintype="subtype_"+val;
			addcss(me._getAnchor('user_type_icon'),me._getAnchor('user_type_icon')._admintype);

		}

		this.dropdown_account_active._fill({
			'0':getLang('accountdetail::enabled'),
			'1':getLang('accountdetail::disabled_login'),
			'2':getLang('accountdetail::disabled_login_receive'),
			'3':getLang('accountdetail::spam_trap'),
		});

		this.dropdown_account_active._onchange=function(e){
			var val=me.dropdown_account_active._value();
			removecss(me._getAnchor('user_state_icon'),me._getAnchor('user_state_icon')._adminstate);
			me._getAnchor('user_state_icon')._adminstate="state_"+val;
			addcss(me._getAnchor('user_state_icon'),me._getAnchor('user_state_icon')._adminstate);

		}

		this.button_account_mobile_devices_manage._onclick=function(e){
			me._parent.left_menu._go('mobile_devices');
			//location.hash="#menu="+location.parsed_query.menu+"&account="+location.parsed_query.account+"&tab=mobile_devices";
		}

		this.button_account_icewarp_outlook_sync_manage._onclick=function(e){
			me._outlookSyncManage();
		}

		this.button_account_permissions._onclick=function(){
			me._openPermissions();
		}

		// Upload button / drop logic
		var avatar = this._getAnchor("userimage");
		this.button_upload_photo._imagesOnly();
		this.button_upload_photo._droparea(avatar);
		this.button_upload_photo._onfile = function(img) {
			// Avatar added to display element by upload object
		}
		this.button_upload_photo._onmimetypeerror = function(mime) {
			gui.message.error(getLang('error::uploader_file_type_not_allowed'));
		}

		me.button_account_icewarp_outlook_sync_licenses._onclick=function(e){
			me._licenses(0);
		}

		me.button_account_icewarp_desktop_licenses._onclick=function(e){
			me._licenses(1);
		}

		me.button_change_password._onclick=function(e){
			me._changePassword();
		}

		me.button_account_features._onclick=function(e){
			me._features();
		}

		com.general.install_url(function(url){
			me._getAnchor('button_account_icewarp_outlook_sync_download').target="_blank";
			me._getAnchor('button_account_icewarp_outlook_sync_download').href=url+'download/outlook-sync.exe';

			me._getAnchor('button_account_icewarp_desktop_download').target="_blank";
			me._getAnchor('button_account_icewarp_desktop_download').href=url+'download/desktop-setup.msi';
		});

		this.button_add_alias._onclick=function(e){
			var v = me._data.A_AliasList.addItem("item","");
			me.multiple_add_alias._add(v);

			e.stopPropagation();
			e.cancelBubble=true;
			return false;
		}

		this.button_change_quotas._onclick=function(e){
			me._parent.left_menu._go('limits');
			e.stopPropagation();
			e.cancelBubble=true;
			return false;
		}

		this.input_account_username._onchange = function() {
			// Preventing autofill (Safari) to fill in your username as username for this user
			if(this._value()==gui._globalInfo.accountProperties.u_mailbox && me._accountDomain==gui._globalInfo.domain && me.__initial_username!=gui._globalInfo.accountProperties.u_mailbox) {
				this._value(me.__initial_username);
			}
		}

	}
	catch(e)
	{
		log.error(e);
	}
}

_me._initPlans = function() {
	var me = this;
	if(!~['saas', 'cloud'].indexOf(gui._globalInfo.licence.licensetype.toString()) || !me._data || !me._props) {
		return;
	}
	var cloudinfo = gui._globalInfo.licence.cloudinfo || {};
	var maxPlan = Math.max(+me._props.D_Saas_Plan, +me._data.u_saas_plan);
	me._getAnchor('fb_change_user_plan').removeAttribute("is-hidden");
	me._getAnchor('fb_change_user_plan_title').removeAttribute("is-hidden");
	me._create('plans', 'obj_plans', 'fb_change_user_plan', '', {
		selectable: true,
		show_prices: +cloudinfo.cloudshowprice,
		yearly: (cloudinfo.cloudplanbillingperiod || '').toString() !== 'MONTH',
		plans: gui._globalInfo.licence.plans.map(function(plan) {
			if(!+me._props.D_Saas_Plan || +plan.planid <= maxPlan) {
				var label = getLang("SUBSCRIPTION_PLANS::" + plan.planlabel);
				return options = {
					id: plan.planid,
					disabled: +me._props.D_Saas_Plan && +plan.planid > +me._props.D_Saas_Plan,
					icon: true,
					label: ~label.indexOf("::") ? plan.planlabel : label,
					price: (+plan.price).toCurrency(plan.currency.toString()),
					price_per_user: '&#8203;' //zero-width space
				};
			}
		}).filter(Boolean)
	});
	me.plan_details._onclick = function () {
		me.plan_details._disabled(true);
		obj_subscription.prototype._openLicensePopup.call(this, 'plan-details', function() {
			me.plan_details._disabled(false);
		}, {
			heading: getLang('SUBSCRIPTION::PLAN_DETAILS')
		});
	};
	me.plans._setValue(me._data.u_saas_plan);
	me.plans._onchange = function(value) {
		me._data.u_saas_plan.value = value;
	}
}

_me._issaved = function(target) {
	return !this._data.hasChanged();
}

_me._save = function(callback,allowSameUsername){
	var view = this._view;
	var me = this;

	var user = this.input_account_username;
	if(!allowSameUsername && user._value()==gui._globalInfo.accountProperties.u_mailbox && me.__initial_username!=gui._globalInfo.accountProperties.u_mailbox) {
		// Do not allow to set user name to the same as the currently logged in user
		if(this._accountDomain==gui._globalInfo.domain) {
			// This is you own email, can't be used
			gui.message.error(getLang("error::identical_email"));
			return false;
		} else {
			// The username is same but domain is different
			var warning = gui.message.warning(getLang("warning::identical_username"),false,[
				{
					value:getLang("generic::cancel"),
					type:'text borderless',
					method:'close'
				},{
					value:getLang("generic::do_not_save"),
					type:'text error',
					method:'close'
				},{
					value:getLang("generic::save"),
					type:'success text',
					onclick:function(){
						gui.popup._close();
						me._save(callback,true);
					}
				}
			]);
			return false;
		}
	}

	if(this._data.hasChanged()) {
		var newusername = this._data.A_AliasList.hasChanged() ? this._data.A_AliasList[0]+'@'+this._accountDomain : false;
		var hash = this._selfHash;

		this._data.saveChanges(function(r){
			view.saveNotification(r==1);
			if(callback) {
				callback(r==1);
			}

			// If main alias changed, change hash
			if(newusername && r==1) {
				gui._globalInfo._update(function(){
					gui.frm_main._fillUsermenu();
				});
				location.hash = helper.translateHash(hash.replace('/ACCOUNT/',encodeURIComponent(newusername)),location.parsed_query);
			}
		});
	}

}

_me._reset = function() {
	this._data.revertChanges();
}

_me._licenses=function(type){
	var popup=gui._create('popup','obj_popup');
	popup._init({
		name:'outlooksynclicenses',
		heading:{
			value:(type==0?getLang('client_applications::icewarp_outlook_sync'):getLang('client_applications::icewarp_desktop'))
		},
		content:'obj_accountinfo_licenses'
	});

	popup.content._load(location.parsed_query.account,type);
}

_me._changePassword=function(){
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

	popup.content._load(location.parsed_query.account);
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

	popup.content._load(location.parsed_query.account);
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

	popup.content._load(location.parsed_query.account);
}

_me._openPermissions=function(){
	var popup=gui._create('popup','obj_popup');
	popup._init({
		fixed:false,
		iwattr:{
			height:'full',
			width:'medium'
		},
		name:'permissions',
		heading:{
			value:getLang('accountdetail::permissions')
		},
		footer:'obj_permissions_footer',
		content:'obj_permissions'
	});

	popup.content._load(location.parsed_query.account);
}

/* View */

var AccountInfoView = function(controller) {
	this._control = controller;

}
AccountInfoView.prototype = Object.create(CoreView.prototype);

