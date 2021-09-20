function obj_newaccount(){};
var _me = obj_newaccount.prototype;
/**
 * @brief:
 * @date : 01.12.2014
 **/
_me.__constructor = function(s){
	var me = this;
	storage.library('wm_user');
	storage.library('wm_domain');
};

_me._load = function(type, callback) {
	type=type+'';
	this._strtype=type;

	var that=this;
	var me=this;
	this._type = {};

	switch(type){
		case '0' :
			this._type.user=true;
		break;
		case '7' :
			this._type.group=true;
		break;
		case '1' :
			this._type.mailinglist=true;
		break;
		case '8' :
			this._type.resource=true;
		break;
		case 'd' :
			this._type.domain=true;
		break;
	}

	that._draw('obj_newaccount', '', {type:this._type});
	
	this._parent.btn_save._onclick=function(){
		me._parent.btn_save._disabled(true);
		me._save();
	};

	this._parent.btn_save_another._onclick=function(){
		me._parent.btn_save_another._disabled(true);
		me._save(true);
	}

	if(!this._type.domain) {
		var domain = new Domain(gui._activeDomain);
		var account = domain.createAccount(type);
		this._data = account;
	} else {
		this._data = new IWAPI.Value('');
		this.input_domain._setValue(this._data);
	}

	if(this._type.mailinglist){
		if(gui._globalInfo.admintype==USER_ADMIN){
			this.dropdown_source._fill({
				'*0':getLang('mailinglist::members_defined_manually'),
				'*1':getLang('mailinglist::all_current_domain_users'),
				'*2':getLang('mailinglist::all_system_users'),
				'*3':getLang('mailinglist::all_system_domain_administrators'),
				'*4':getLang('mailinglist::all_system_administrators')
			});
		}else{
			this.dropdown_source._fill({
				'*0':getLang('mailinglist::members_defined_manually'),
				'*1':getLang('mailinglist::all_current_domain_users'),
			});
		}

		this.dropdown_source._setValue(account.m_sendalllists);
	}

	if(this._type.user)
	{
		this.button_generate_password._onclick=function(){
			com.general.generate_password(function(pwd){
				me._data.u_password.value = pwd;
				me.input_password._value(pwd);
			});
		}
		this.button_generate_password._onclick();

		// Bind values to fields
		this.input_name._setValue(account.a_name.name);
		this.input_surname._setValue(account.a_name.surname);
		this.input_password._setValue(account.u_password);
	}

	if(this._type.group) {
		this.input_name._setValue(account.g_groupwarehabfolder);
	}


	if(this._type.resource)
	{
		this.dropdown_type._fill({
			'0':getLang('userlist::room'),
			'1':getLang('userlist::equipment'),
			'2':getLang('userlist::car')
		});

		this.input_name._setValue(account.u_name);
		this.dropdown_type._setValue(account.s_type);
	}

	if(!this._type.domain)
	{
		this.input_alias._domain=false;

		this.input_alias._domain=gui._activeDomain;
		this.input_alias._label('@'+punycode.ToUnicode(this.input_alias._domain),true);
		this.input_alias._setValue(account.u_mailbox);

		if(this.input_alias._main.getElementsByTagName('label')[0]){
			this.input_alias._main.getElementsByTagName('label')[0].onclick=function(){
				gui.accountpicker(function(data){
					log.log(['newaccount-picked',data]);
					me.input_alias._domain=data[0].id;
					me.input_alias._label('@'+punycode.ToUnicode(data[0].name),true);
					me._initPlans();
				},{
					domainpicker:true,
					singledomain:true
				});
			};
		}

		me._getAnchor('add_new_domain').setAttribute('is-hidden',1);
		me._getAnchor('add_new_account').removeAttribute('is-hidden');
	}
	else
	{
		me._getAnchor('add_new_account').setAttribute('is-hidden',1);
		me._getAnchor('add_new_domain').removeAttribute('is-hidden');
	}

	if(this._type.user) {
		this._initPlans();
	}

	if(callback){callback(this);}
}

_me._initPlans = function() {
	new Domain(this.input_alias._domain).getProperties(['D_Saas_Plan'], function(D_Saas_Plan) {
		if(gui._globalInfo.licence.plans.forEach) {
			var plans = gui._globalInfo.licence.plans.map(function(plan) {
				var label = getLang("SUBSCRIPTION_PLANS::" + plan.planlabel);
				if(!+D_Saas_Plan || +plan.planid <= +D_Saas_Plan) {
					return {
						id: plan.planid,
						icon: true,
						label: ~label.indexOf("::") ? plan.planlabel : label,
						price: (+plan.price).toCurrency(plan.currency.toString()),
						price_per_user: '&#8203;' //zero-width space
					};
				}
			}).filter(Boolean);
			this.plans && this.plans._destruct();
			this._create('plans', 'obj_plans', 'fi_plan', '', {
				selectable: true,
				show_prices: +(gui._globalInfo.licence.cloudinfo || {}).cloudshowprice,
				yearly: ((gui._globalInfo.licence.cloudinfo || {}).cloudplanbillingperiod || '').toString() !== 'MONTH',
				plans: plans
			});
			this.plans._setValue(this._data.u_saas_plan);
			var max_avail_value = Math.min(gui._globalInfo.licence.defaultplan.value || gui._globalInfo.licence.plans[0].planid, plans.pop().id);
			this.plans._value(max_avail_value);
			this.plans._onchange = function(value) {
				this._data.u_saas_plan.value = value;
			}.bind(this);

			this.plan_details._onclick = function () {
				this.plan_details._disabled(true);
				obj_subscription.prototype._openLicensePopup.call(this, 'plan-details', function() {
					this.plan_details._disabled(false);
				}.bind(this), {
					heading: getLang('SUBSCRIPTION::PLAN_DETAILS')
				});
			}.bind(this);
		} else {
			this._getAnchor('fi_plan').setAttribute('is-hidden', '');
			this._getAnchor('fi_plan_separator').setAttribute('is-hidden', '');
		}
	}.bind(this));
};

_me._showPasswordPolicy=function(){
	//this._getAnchor('error').removeAttribute('is-hidden');
	var me=this;

	// load pwd policy
	com.user.password_policy(function(aResult){

		me._getAnchor('pwdp').removeAttribute('is-hidden');

		log.info(aResult);
		var items=aResult.Array.IQ[0].QUERY[0].RESULT[0].ITEM;

		for(var i=0; i<items.length; i++)
		{
			var propname=items[i].APIPROPERTY[0].PROPNAME[0].VALUE;
			var propval={};
			if(items[i].PROPERTYVAL && items[i].PROPERTYVAL[0]){
				propval=items[i].PROPERTYVAL[0];
			}

			try
			{
				log.log(propname.toLowerCase());

				switch(propname.toLowerCase())
				{
					case 'c_accounts_policies_pass_enable':
						if(propval.VAL[0].VALUE=='1'){
							me._getAnchor('pwdp').removeAttribute('is-hidden');
						}else{
							me._getAnchor('pwdp').setAttribute('is-hidden',1);
						}
					break;
					case 'c_accounts_policies_pass_minlength':
						if(propval.VAL[0].VALUE=='0'){
							me._getAnchor('pwdp_minlength').setAttribute('is-hidden',1);
						}
						me._getAnchor('pwdp_minlength').getElementsByTagName('span')[0].innerHTML=helper.htmlspecialchars(propval.VAL[0].VALUE);
					break;
					case 'c_accounts_policies_pass_digits':
						if(propval.VAL[0].VALUE=='0'){
							me._getAnchor('pwdp_digits').setAttribute('is-hidden',1);
						}
						me._getAnchor('pwdp_digits').getElementsByTagName('span')[0].innerHTML=helper.htmlspecialchars(propval.VAL[0].VALUE);
					break;
					case 'c_accounts_policies_pass_nonalphanum':
						if(propval.VAL[0].VALUE=='0'){
							me._getAnchor('pwdp_nonalphanum').setAttribute('is-hidden',1);
						}
						me._getAnchor('pwdp_nonalphanum').getElementsByTagName('span')[0].innerHTML=helper.htmlspecialchars(propval.VAL[0].VALUE);
					break;
					case 'c_accounts_policies_pass_useralias':
						if(propval.VAL[0].VALUE=='0'){
							me._getAnchor('pwdp_useralias').setAttribute('is-hidden',1);
						}
					break;
					case 'c_accounts_policies_pass_alpha':
						if(propval.VAL[0].VALUE=='0'){
							me._getAnchor('pwdp_alpha').setAttribute('is-hidden',1);
						}
						me._getAnchor('pwdp_alpha').getElementsByTagName('span')[0].innerHTML=helper.htmlspecialchars(propval.VAL[0].VALUE);
					break;
					case 'c_accounts_policies_pass_upperalpha':
						if(propval.VAL[0].VALUE=='0'){
							me._getAnchor('pwdp_upperalpha').setAttribute('is-hidden',1);
						}
						me._getAnchor('pwdp_upperalpha').getElementsByTagName('span')[0].innerHTML=helper.htmlspecialchars(propval.VAL[0].VALUE);
					break;
				}
			}
			catch(e)
			{
				log.error(e);
			}
		}
	});
	//
}

_me._save=function(addanother){

	var me=this;

	// save account
	if(!this._type.domain)
	{
		var alias=this.input_alias._value().trim();
		var domain=this.input_alias._domain;

		if (!alias) {
			me._parent.btn_save._disabled(false);
			me._parent.btn_save_another._disabled(false);
			return this.input_alias._error(getLang('error::specify_account_name_with_domain_name'));
		}
		
		if(alias.search('@')>=0){
			domain=alias.split('@');
			alias=domain[0];
			domain=domain[1];
			this.input_alias._domain=domain;
		}

		log.log(this.input_alias._domain);

		if(this.input_alias._domain){

			this._data.u_mailbox.value = this._data.u_mailbox.value.trim();
			if(this._data.a_name) {
				this._data.a_name.name.value = this._data.a_name.name.value.trim();
				this._data.a_name.surname.value = this._data.a_name.surname.value.trim();
			}

			var account = this._data;
			account.domainName = this.input_alias._domain;
			var type = this._type;
			account.saveNew(function(result){
				me._parent.btn_save._disabled(false);
				me._parent.btn_save_another._disabled(false);
				// Did not respect password rules
				if(type.user && result.error=="account_password_policy") {
					me._showPasswordPolicy();
					gui.message.error(getLang("error::account_password_policy"));
					return false;
				}
				// Domain admin is creating more accounts than allowed
				if(type.user && result.error=="account_domain_limit_exceeded") {
					gui.message.error(getLang("error::account_domain_limit_exceeded"));
					return false;
				}
				// Created or error
				if(result==1) {
					gui.message.toast(getLang("message::save_successfull"));
					if(addanother){
						me._close();
						setTimeout(function(){
							gui.frm_main._newAccount(me._strtype);
						},0);
					}
					else{
						var alias_checked=alias;
						if(alias_checked.search(';')>=0){
							alias_checked=alias.split(';')[0];
						}
						location.hash='menu=accountdetail&account='+encodeURIComponent(alias_checked+"@"+domain)+"&type="+me._strtype;
						me._close();
					}
				} else {
					gui.message.error(getLang("error::account_not_created"),false,[
						{
							value:getLang("generic::cancel"),
							onclick:function(closeCallback){
								me._close();
								closeCallback();
							},
							type:'text error'
						},
						{
							value:getLang("generic::try_again"),
							method:'close'
						}
					]);
				}
			});

		}
		else
		{
			// no domain was specified
			me.input_alias._error(getLang('error::specify_account_name_with_domain_name'));
		}
	}

	// save domain
	if(this._type.domain)
	{
		var domain = this.input_domain._value().trim();
		if (!domain) {
			return this.input_domain._error(getLang('error::specify_domain_name'));
		}
		domain=punycode.ToASCII(domain);
		com.domain.createDomain(domain,function(result){
			me._parent.btn_save._disabled(false);
			me._parent.btn_save_another._disabled(false);
			if(result==1) {
				gui.message.toast(getLang("message::save_successfull"));
				if(addanother){
					me._close();
					setTimeout(function(){
						gui.frm_main._newAccount(me._strtype);
					},0);
				}
				else{
					location.hash='menu=domaindetail&domain='+encodeURIComponent(domain)+'&showdomaininfo=true';
					me._close();
				}
			} else {
				gui.message.error(getLang("error::save_unsuccessful"),false,[
					{
						value:getLang("generic::cancel"),
						onclick:function(closeCallback){
							me._close();
							closeCallback();
						},
						type:'text error'
					},
					{
						value:getLang("generic::try_again"),
						method:'close'
					}
				]);
			}
		});
	}
}
