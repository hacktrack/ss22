_me = obj_certificates_server_wizard.prototype;
function obj_certificates_server_wizard(){};

/**
 * @brief:
 * @date : 26.10.2014
 **/
_me.__constructor = function(s){
	var me = this;
	var parent=this._parent;
	me.__id=false;
	
	this._add_destructor('__onbeforedestruct');
	/* set onbefore destruct listener */
};

/** obbefore destruct listener */
_me.__onbeforedestruct=function(){

}
/** */

_me._load=function(item){
	var me=this;
	var parent=me._parent;

	this.__id = item ? item._id : false;

	if(item) {
		this.__item = item;
	}

	me._draw('obj_certificates_server_wizard',undefined,{reissue_cert: !!item});

	if(this.button_add_existing) {
		this.button_add_existing._onclick = function (e) {
			this._popup = gui._create('popup','obj_popup');
			this._popup._init({
				name:'add_certificate',
				heading:{
					value:getLang('generic::add')
				},
				fixed:false,
				footer:'default',
				content:"obj_certificates_server_add"
			});
			this._popup.content._certificatesList=me._certificatesList;
			this._popup.content._load();
		}
	}

	this.button_new_icewarp_cert._onclick = function (e) {
		me._show('icewarp');
	}

	this.button_new_ca_cert._onclick = function (e) {
		me._show('authority');
	}

	this.button_new_lets_encrypt_cert._onclick = function (e) {
		me._show('letsencrypt');
	}

	this.button_new_self_signed_cert._onclick = function (e) {
		me._show('selfsigned');
	}

	// Change Add label for hostnames
	this.multi_hostnames.button_add._value('certificates::add_hostname');

	// Dropdown with year duration
	this.dropdown_validity._fill({
		'*1':'1 '+getLang("datetime::year"),
		'*2':'2 '+getLang("datetime::years"),
		'*3':'3 '+getLang("datetime::years")
	});

	// Default certificate bits
	this.input_bits._value(3072);

	// For reissue selfsigned reuse option with default generate
	this.radio_reuse._value('reuse');
	this.radio_generate._value('generate');
	this.radio_reuse._groupValue('generate');

	if(item) {
		// Add hostnames
		if(item.hostname.length)
			this.multi_hostnames._value(item.hostname);

		// Fill in issuer information
		if(item.issuerinfo) {
			this.input_email._value(item.issuerinfo.email);
			this.input_organization._value(item.issuerinfo.o);
			this.input_unit._value(item.issuerinfo.ou);
			this.input_city._value(item.issuerinfo.locality);
			this.input_state._value(item.issuerinfo.state);
			this.input_country._value(item.issuerinfo.c);
		}

		// Certificate settings
		this.dropdown_validity._value('1');
		this.input_bits._value(item.bits);
	} else {
		com.server.getLicenseInfo(function(data){
			me.multi_hostnames._value([data.cn]);

			me.input_email._value(data.email);
			me.input_organization._value(data.organization);
			me.input_city._value(data.locality);
			me.input_state._value(data.state);
			me.input_country._value(data.country);
		});
	}

	this._parent.btn_save._disabled(true);
}

_me._show = function(sDetail) {
	var me = this;
	this._showing = sDetail;
	if(sDetail) {
		this._getAnchor('wizard').setAttribute('is-hidden',1);
		this._getAnchor('details').removeAttribute('is-hidden');
		if(this.__item && !this.__item.iscsr) {
			this._getAnchor('reuse').removeAttribute('is-hidden');
		} else {
			this._getAnchor('reuse').setAttribute('is-hidden',1);
		}
		this._parent._setHeading(getLang('certificates::'+sDetail+'_details'));
		switch(sDetail) {
			case 'selfsigned':
			case 'icewarp':
			case 'authority':
				this._getAnchor('fb_hostname').removeAttribute('is-hidden');
				this._getAnchor('fb_company').removeAttribute('is-hidden');
				this._getAnchor('fb_certificate').removeAttribute('is-hidden');
				break;
			case 'letsencrypt':
				this._getAnchor('fb_hostname').removeAttribute('is-hidden');
				this._getAnchor('fb_company').setAttribute('is-hidden',1);
				this._getAnchor('fb_certificate').setAttribute('is-hidden',1);
				break;
		}
		this._parent._setBackButton(function(){
			me._show();
		});
		this._parent.btn_save._disabled(false);
	} else {
		this._parent.btn_save._disabled(true);
		this._parent._setHeading(getLang('certificates::wizard'));
		this._getAnchor('wizard').removeAttribute('is-hidden');		
		this._getAnchor('details').setAttribute('is-hidden',1);
		this._parent._setBackButton();
	}

}

_me._save=function(){
	var me=this;
	var parent = me._parent;

	var domains = this.multi_hostnames._value();
	var issuer = {};
	var options = {};

	switch(this._showing) {
		case 'icewarp':
		case 'authority': 
			options.createcsr = 1; 
		case 'selfsigned':
			// Issuer
			issuer.organization = this.input_organization._value();
			issuer.organizationunit = this.input_unit._value();
			issuer.email = this.input_email._value();
			issuer.city = this.input_city._value();
			issuer.state = this.input_state._value();
			issuer.country = this.input_country._value();
			// Settings
			options.validfordays = this.dropdown_validity._value()*365;
			options.bits = this.input_bits._value();
			break;
		case 'letsencrypt':
			options.doletsencrypt = 1;
			break;
	}

	// For reissue, add id 
	if(this.__id) {
		options.reissue = this.__id;
		if(this._showing=='selfsigned' && this.radio_reuse._groupValue()=='reuse') {
			options.reuse = true;
		}
	}

	com.certificates.create(issuer,domains,options,function(id){
		if(id) {
			gui.message.toast(getLang("message::save_successfull"));
			me._certificatesList._load(function(items){
				// Open new certificate after reloading the list
				if(options.createcsr) {
					for(var i=items.length;i--;) {
						if(items[i].id==id) {
							this._editCertificate(items[i]);
							break;
						}
					}
				}
			});
			me._close();
		} else {
			gui.message.error(getLang("error::action_failed"),getLang("error::failed"));
		}
	});
}
