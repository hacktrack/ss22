function obj_accountinfo_changepwd(){};
var _me = obj_accountinfo_changepwd.prototype;
/**
 * @brief:
 * @date : 01.12.2014
 **/
_me.__constructor = function(s){
	var me = this;
	storage.library('wm_user');
};

_me._load = function(account)
{
	var that=this;
	var me=this;

	this.__account = account || location.parsed_query.account;

	that._draw('obj_accountinfo_changepwd', '', {items:{}});

	// generate password
	this.button_generate_password._onclick=function(e){
		com.general.generate_password(function(pwd){
			me.input_change_password._value(pwd);
		});
	};

	// load pwd policy
	com.user.password_policy(function(aResult){
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
					case 'c_accounts_policies_pass_expiration':
						if(propval.VAL[0].VALUE=='1'){
							me._getAnchor('pwd_expire').removeAttribute('is-hidden');
						}
					break;
				}
			}
			catch(e)
			{
				log.error(e);
			}
		}
	});

	that._main.onclick=function(e){

	};

	that.timeout=setInterval(function(){
		if(storage.css_status('obj_accountinfo_changepwd')) {
			clearInterval(that.timeout);
		}
	},100);
}

_me._save=function(ignorePasswordPolicy,successCallback){
	var me=this;
	user = this.__account;
	com.user.change_password(user,me.input_change_password._value(),ignorePasswordPolicy,function(result){
		if(result)
		{
			if(result.Array.IQ[0].QUERY[0].ERROR){
				var message=result.Array.IQ[0].QUERY[0].ERROR[0].ATTRIBUTES.UID;
				if(message=='account_password_policy' && (gui._globalInfo.admintype==USER_ADMIN || gui._globalInfo.admintype==USER_WEB)){
					// Allow full Admin users to override password policy
					gui.message.error(getLang("error::"+message),false,[
						{
							value:getLang("generic::cancel"),
							method:'close',
							type:'borderless text'
						},
						{
							value:getLang("accountinfo::ignore_password_policy"),
							onclick:function(closeCallback){
								me._save(true,function(){closeCallback();});
							}
						}
					]);
				}else{
					// Other errors and policy error for domain admins
					gui.message.error(getLang("error::"+message),false);
				}

				return false;
			} else {
				gui._globalInfo.passwordexpired = false;
			}

			if(me.toggle_must_change_password._checked())
			{
				com.user.expire_password(user,function(result){
					if(!result){
						gui.message.error(getLang("error::save_unsuccessful"));
					}else{
						gui.message.toast(getLang("message::save_successfull"));
						if(successCallback){
							successCallback();
						}
					}
					me._parent._parent._close();
				});
			}
			else
			{
				if(result.Array.IQ[0].QUERY[0].RESULT[0].VALUE==0){
					gui.message.error(getLang("error::save_unsuccessful"));
				}else{
					gui.message.toast(getLang("message::save_successfull"));
					if(successCallback){
						successCallback();
					}
				}
				me._parent._parent._close();
			}
		}
		else
		{
			me._getAnchor('error').removeAttribute('is-hidden');
		}
	});
}
