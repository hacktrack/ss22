function obj_groupinfo(){};
var _me = obj_groupinfo.prototype;
/**
 * @brief:
 * @date : 01.12.2014
 **/
_me.__constructor = function(s){
	var me = this;
	storage.library('wm_user');

	var view = this._view = new GroupInfoView(this);

	this._headingButton=gui.frm_main.main._setHeadingButton('generic::save',function(){me._save();},'button text success');
	this._headingButton._disabled(true);

	this._accountDomain=location.parsed_query.account.split('@');
	this._accountDomain=this._accountDomain[this._accountDomain.length-1];

	this._selfHash="#menu=accountdetail&account=/ACCOUNT/&type=/TYPE/";
};

_me._load = function(domain) {
	var me=this;

	gui.frm_main.main._setHeading(punycode.ToUnicode(location.parsed_query.account));
	
	me._draw('obj_groupinfo', '', {items:{}});

	// get domain info
	var domain = new Domain(location.parsed_query.account.split('@')[1]);
	domain.getProperty('d_type',function(domaintype){
		if(domaintype!=4) {
			me.toggle_allow_gal_export._disabled(true);
		}
	});

	this._getAnchor('fi_setup_permissions').setAttribute('is-hidden',1);

	this.dropdown_deliver_mail._onchange=function(){
		me._getAnchor('deliver_mail_icon').setAttribute('status',this._value());
	}

	this.toggle_create_public_folder._onchange=function(checked){
		if(checked)
		{
			me._getAnchor('group_email_delivery').removeAttribute('is-hidden');
			me._getAnchor('advanced_settings').removeAttribute('is-hidden');
			me._getAnchor('fi_setup_permissions').removeAttribute('is-hidden');
			me._getAnchor('fs_teamchat').removeAttribute('is-hidden');
		}
		else
		{
			me._getAnchor('group_email_delivery').setAttribute('is-hidden',1);
			me._getAnchor('advanced_settings').setAttribute('is-hidden',1);
			me._getAnchor('fi_setup_permissions').setAttribute('is-hidden',1);
			me._getAnchor('fs_teamchat').setAttribute('is-hidden',1);
		}
	}

	this.input_password_protection._onfocus=function(){
		this._setType('text');
		this._selectValue();
	};
	this.input_password_protection._onblur=function(){
		this._setType('password');
	};

	/** fill dropdowns */
	this.dropdown_deliver_mail._fill({
		'*1':getLang('group::deliver_mail_to_shared_folder'),
		'*0':getLang('group::deliver_to_all_members_individually')

	});

	this.btn_permissions._onclick=function(){
		me._openPermissions();
	}

	this.button_add_alias._onclick=function(e){
		var v = me._data.A_AliasList.addItem("item","");
		me.multiple_add_alias._add(v);

		e.stopPropagation();
		e.cancelBubble=true;
		return false;
	}

	var group = new Account(location.parsed_query.account);
	group.getProperties([
		'g_groupwarehabfolder',
		'g_name',
		'g_description',
		'u_alias',
		'A_AliasList',
		'g_groupwaremaildelivery',
		'g_listbatch',
		'g_checkmailbox',
		'g_groupwareallowgalexport',
		'g_groupwarecreateteamchat',
		'g_groupwarehab',
		'g_groupwaremembers',
		'a_passwordprotection',
		'm_membersonly',
		'g_groupwareshared',
		'm_moderatedpassword'
	],function(p){
		this._data = p;

		// General
		this.input_owner._setValue(p.g_groupwarehabfolder);
		this.input_description._setValue(p.g_description);

		// Aliases
		this.multiple_add_alias._label("@"+this._accountDomain);
		this.multiple_add_alias._setValue(p.A_AliasList);
		if(p.A_AliasList.propertyRights!=2){
			this.button_add_alias._disabled(true);
		}

		// Sharing
		this.toggle_create_public_folder._setValue(p.g_groupwareshared);
		this.toggle_create_public_folder._onchange(p.g_groupwareshared==1);
		this.input_create_public_folder._setValue(p.g_name);
		// Delivery
		this.dropdown_deliver_mail._setValue(p.g_groupwaremaildelivery);
		this.toggle_do_not_deliver._setValue(p.g_checkmailbox);
		// Security
		this.toggle_only_members_can_post._setValue(p.m_membersonly);
		this.toggle_password_protection._setValue(p.a_passwordprotection);
		this.input_max_number_of_messages._setValue(p.g_listbatch);
		// TeamChat
		this.toggle_enable_teamchat._setValue(p.g_groupwarecreateteamchat);
		this.input_password_protection._setValue(p.m_moderatedpassword);
		// Advanced
		this.toggle_populate_gal._setValue(p.g_groupwaremembers);
		this.toggle_allow_gal_export._setValue(p.g_groupwareallowgalexport);
		this.toggle_organize_gal._setValue(p.g_groupwarehab);

		this._headingButton._disabled(false);
	}.bind(this),{set: 1});

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

_me._issaved = function(target) {
	return !this._data.hasChanged();
}

_me._save = function(callback) {
	var aliases = this.multiple_add_alias;
	var hash = this._selfHash;
	var view = this._view;

	if(this._data.hasChanged()) {
		var newusername = this._data.A_AliasList.hasChanged() ? this._data.A_AliasList[0]+'@'+this._accountDomain : false;
		this._data.saveChanges(function(r){
			view.saveNotification(r==1);
			if(callback) {
				callback(r==1);
			}
			// If main alias changed, change hash
			if(newusername && r==1) {
				location.hash = helper.translateHash(hash.replace('/ACCOUNT/',encodeURIComponent(newusername)),location.parsed_query);
			}
		});
	}

}

_me._reset = function() {
	this._data.revertChanges();
}

/* View */

var GroupInfoView = function(controller) {
	this._control = controller;

}
GroupInfoView.prototype = Object.create(CoreView.prototype);

