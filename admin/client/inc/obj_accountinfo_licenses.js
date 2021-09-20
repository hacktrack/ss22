function obj_accountinfo_licenses(){};
var _me = obj_accountinfo_licenses.prototype;
/**
 * @brief:
 * @date : 01.12.2014
 **/
_me.__constructor = function(s){
	this._keytype=0;
	storage.library('wm_user');
};

_me._load = function(domain,type)
{
	var me=this;
	
	this._draw('obj_accountinfo_licenses', '', {items:{}});
	
	// generate
	this.button_licence_generate_key._onclick=function(){
		com.user.generate_license(
			location.parsed_query.account,
			me.__keyProperty,
			function(key){
				if(key){
					me.license._value(key);
				}
			}
		);
	}

	// send
	this.button_licence_send_key._onclick=function(){
		me.button_licence_send_key._disabled(true);
		com.user.send_license(
			location.parsed_query.account,
			me.__keyProperty,
			function(result){
				me.button_licence_send_key._disabled(false);
				if(result==1) {
					gui.message.toast(getLang('message::license_key_sent_successfuly'));
					me._close();
				} else {
					gui.message.error(getLang('error::license_key_send_failed'));
				}
			}
		);
	}

	// All fields initally disabled until key is available
	me.input_licence_description._disabled(true);
	me.input_licence_allowed_activation_count._disabled(true);
	me.button_licence_generate_key._disabled(true);
	me.button_licence_send_key._disabled(true);

	var user = new Account(location.parsed_query.account);

	var propnames = type==0 ?
		['A_ActivationKeyOutlook','u_client_connector'] : 
		['A_ActivationKeyDesktop','u_client_desktop'];

	var getActivationKey = function() {
		user.getProperty(propnames[0],function(p){
			if(p.value) {
				me.__keyProperty = p.propertyCollection;
				// Count and Description text fields
				me.input_licence_description._setValue(p.description);
				me.input_licence_allowed_activation_count._setValue(p.count);
				// Licence key
				me.license._setValue(p.value);

				// Enable all fields
				me.input_licence_description._disabled(false);
				p.description.readOnly(false);
				me.input_licence_description._readonly(false);
				me.input_licence_allowed_activation_count._disabled(false);
				p.count.readOnly(false);
				me.input_licence_allowed_activation_count._readonly(false);
				me.button_licence_generate_key._disabled(false);
				me.button_licence_send_key._disabled(false);

				// Remember key type
				me._keytype = +p.keytype.value;
			} else {
				me._keytype = type;
				// Temporary fix, it takes some time for server
				// to create the key, wait random time
				setTimeout(function() {
					getActivationKey();
				}, 500);
			}
		});		
	}

	user.getProperty(propnames[1],function(p){
		me.__enableProperty = p.propertyCollection;

		// Only get Activation Key and Information if enabled
		if(p==1) {
			getActivationKey();
		}

		// Enable toggle
		me.toggle_enable_client_licence._setValue(p);
	});

	this.toggle_enable_client_licence._onchange = function(state) {
		var v = this._getValue();
		if(v.hasChanged()) {
			this._disabled(true);
			var p = me.__enableProperty;
			var that = this;
			// Directly save state
			p.saveChanges(function(r){
				if(!r.error && r==1) {
					p.commitChanges();
					that._disabled(false);
				}
			}); 

			if(state && !me.__keyProperty) {
				// Checkbox is checked but we need to fetch the key
				getActivationKey();
			} else {
				me.input_licence_description._disabled(!state);
				me.input_licence_allowed_activation_count._disabled(!state);
				me.button_licence_generate_key._disabled(!state);
				me.button_licence_send_key._disabled(!state);
			}
		}
	}

	var doit=function(callback){
		
	}
	
	this._main.onclick=function(e){
		
	};
	
	this.timeout=setInterval(function(){
		if(storage.css_status('obj_accountinfo_licenses'))
		{
			clearInterval(me.timeout);
			doit();
		}
	},100);
}
