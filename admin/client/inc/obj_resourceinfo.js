function obj_resourceinfo(){};
var _me = obj_resourceinfo.prototype;
/**
 * @brief:
 * @date : 01.12.2014
 **/
_me.__constructor = function(s){
	var me = this;
	this._accountDomain=location.parsed_query.account.split('@');
	this._accountDomain=this._accountDomain[this._accountDomain.length-1];

	storage.library('wm_user');

	var view = this._view = new ResourceInfoView(this);

	gui.frm_main.main._setHeadingButton('generic::save',function(){me._save();},'button text success');

	this._selfHash="#menu=accountdetail&account=/ACCOUNT/&type=/TYPE/";

};

_me._load = function(domain)
{
	try
	{
		var me=this;

		gui.frm_main.main._setHeading(punycode.ToUnicode(location.parsed_query.account));

		this._draw('obj_resourceinfo', '', {items:{}});
		
		gui.frm_main.main._getAnchor('main_content').scrollTop=0;

		this.dropdown_type._fill({
			'0':getLang('userlist::room'),
			'1':getLang('userlist::equipment'),
			'2':getLang('userlist::car')
		});

		this.button_permissions._onclick=function(){
			me._openPermissions();
		}
		
		me.input_send_notification._disabled(true);
		me.button_send_notification._disabled(true);
		me.toggle_send_notification._onchange=function(checked){
			if(checked){
				me.input_send_notification._disabled(false);
				me.button_send_notification._disabled(false);
			}else{
				me.input_send_notification._disabled(true);
				me.button_send_notification._disabled(true);
			}
		}
		
		me.button_send_notification._onclick=function(){
			gui.accountpicker(function(data){
				log.log(['spamqueues-quarantine-load-accountpicker',data]);
				if(data[0]){
					me.input_send_notification._value(data[0].email, true);

					callEvent(me.input_send_notification.__eIN, 'change');
				}
			},{
				// some cool settings defining the accountPicker's behavior
				disable_add_domain:true
			});
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

		// Load data
		var resource = new Account(location.parsed_query.account);
		resource.getProperties([
			'u_name',
			'u_alias',
			's_type',
			's_unavailable',
			's_allowconflicts',
			's_notificationtomanager',
			's_manager',
			'A_Image'
		],function(p){
			this._data = p;

			// General
			this.input_name._setValue(p.u_name);
			this.input_alias._setValue(p.u_alias);
			this.dropdown_type._setValue(p.s_type);

			// Avatar image
			if(p.A_Image) {
				var elm = this._getAnchor("userimage");
				this.button_upload_photo._displayElement(elm);
				this.button_upload_photo._setValue(p.A_Image);
			}

			// Customize
			this.toggle_temporarily_unavailable._setValue(p.s_unavailable);
			this.toggle_allow_conflicts._setValue(p.s_allowconflicts);
			this.toggle_send_notification._setValue(p.s_notificationtomanager, false);
			this.input_send_notification._setValue(p.s_manager);

		}.bind(this));

	}
	catch(e)
	{
		log.error(['resourceinfo-load',e]);
	}
}

_me._issaved = function(target) {
	return !this._data.hasChanged();
}

_me._save = function(callback){
	var view = this._view;
	var domain = this._accountDomain;
	var reload = this._data.u_alias.hasChanged();

	if(this._data.hasChanged()) {
		this._data.saveChanges(function(r){
			view.saveNotification(r==1);
			// If the alias has changed, show the new url
			if(reload){
				location.hash = helper.translateHash(this._selfHash.replace('/ACCOUNT/',encodeURIComponent(this._data.u_alias+'@'+domain)),location.parsed_query);
			}
			if(callback) {
				callback(r==1);
			}
		}.bind(this));
	}
}

_me._reset = function() {
	this._data.revertChanges();
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

var ResourceInfoView = function(controller) {
	this._control = controller;

}
ResourceInfoView.prototype = Object.create(CoreView.prototype);
