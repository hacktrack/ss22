_me = obj_policies.prototype;
function obj_policies(){};

/**
 * @brief:
 * @date : 26.10.2014
 **/
_me.__constructor = function(s){
	var me = this;
	var parent=this._parent;
	
	storage.library('wm_policies');
	
	gui.frm_main.main._setHeadingButton('generic::save',function(){me._save();},'button text success');
	
	//
	this._add_destructor('__onbeforedestruct');
	/* set onbefore destruct listener */
	
	me._settings={};
	
	/* PREPARE BINDS */
	me._settings.binds={
	// login policy
		'c_accounts_policies_login_attempts':'input_block_user_login_accounts',
		'c_accounts_policies_login_enable':'toggle_block_user_login_accounts',
		'c_accounts_policies_login_blockperiod':'input_block_user_login_time',
		'c_accounts_policies_login_block':"dropdown_login_policy_mode",
		'c_gui_requireauth':'toggle_require_administrator',
		'c_accounts_policies_login_loginsettings':{
			// this method is called after data from api variable are parsed and are in parameter ITEM
			load:function(item){
				me.radio_usernames._checked(!item._bval);
				me.radio_usernames.__source=item._source;
				
				me.radio_email_addresses._checked(item._bval);
				me.radio_email_addresses.__source=item._source;
			},
			// this method is called before save, when data from objects are collected. Return value to be saved under api variable
			save:function(){
				return (me.radio_email_addresses._checked()?'1':'0');
			},
			// this method is called when data about object's change are collected. Return if object was changed. Parameter CLEAR says if status about change should be cleared.
			change:function(clear){
				return me.radio_usernames._changed(clear) || me.radio_email_addresses._changed(clear);
			},
			// this method is called when rights are about to set on objects. Parameter RIGHT contains right [RIGHTS_HIDE, RIGHTS_READONLY, RIGHTS_FULL]
			rights:function(right){
				if(right==RIGHTS_HIDE){
					me._getAnchor('fi_users_login').setAttribute('is-hidden',1);
				}
				if(right==RIGHTS_HIDE || right==RIGHTS_READONLY){
					me.radio_usernames.readonly(true);
					me.radio_email_addresses.readonly(true);
				}
			},
			// this method is called when data are about to save. Readonly object does not save. Return TRUE if readonly
			readonly:function(){
				return me.radio_usernames._readonly() || me.radio_email_addresses._readonly();
			}
		},
		'c_accounts_policies_login_convertchars':'toggle_convert_usernames',
		'c_accounts_policies_login_iprestriction':'toggle_account_ip_restriction',
	// password policy
		'c_accounts_policies_pass_enable':'toggle_general_active',
		'c_accounts_policies_pass_useralias':'toggle_password_cannot_contain',
		'c_accounts_policies_pass_encrypt':'toggle_enable_password',
		'c_accounts_policies_pass_minlength':'input_minimal_password_length',
		'c_accounts_policies_pass_digits':'input_numeric',
		'c_accounts_policies_pass_nonalphanum':'input_non_alpha_numeric',
		'c_accounts_policies_pass_alpha':'input_alpha',
		'c_accounts_policies_pass_upperalpha':'input_uppercase_alpha',
		'c_accounts_policies_pass_expiration':'toggle_password_expiration_active',
		'c_accounts_policies_pass_expireafter':'input_password_expires_after',
		'c_accounts_policies_pass_notification':'toggle_notify_before_expiration',
		'c_accounts_policies_pass_notifybefore':'input_notify_before_expiration',
		'c_accounts_policies_pass_allowadminpass':['toggle_admin_passwords_read_exported',{reversed:true}]
	};
	/* */
	me._settings.login_policy_modes={
		'*0':getLang('policies::do_not_block_but_delay'),
		'*1':getLang('policies::block_account')
	}
};

/** obbefore destruct listener */
_me.__onbeforedestruct=function(){

}
/** */

_me._load=function(){
	var me=this;
	
	try
	{
		me._draw('obj_policies');
		
		/* prepare objects */
		me.button_outlook_sync._onclick=function(){
			me._outlookSyncManage();
		}
		me.dropdown_login_policy_mode._fill(me._settings.login_policy_modes);
		me.toggle_general_active._onchange=function(checked){
			me.toggle_password_cannot_contain._disabled(!checked);
			
			me.input_minimal_password_length._disabled(!checked);
			me.input_numeric._disabled(!checked);
			me.input_non_alpha_numeric._disabled(!checked);
			me.input_alpha._disabled(!checked);
			me.input_uppercase_alpha._disabled(!checked);
		}
		/**/
		
		/* bind elements with data.
		 * That causes request to server asking for values of variables
		 * set in binds settings and set these values to corresponding objects
		 */
		com.policies.bind(me,me._settings.binds,COM_TYPE_SERVER);
	}
	catch(e)
	{
		log.error([e,me]);
	}
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

	popup.content._load(false,OS_TYPE_SERVER);
}

_me._save=function(){
	com.policies.save(this,this._settings.binds,COM_TYPE_SERVER);
}
