_me = obj_certificates_server_edit.prototype;
function obj_certificates_server_edit(){};

/**
 * @brief:
 * @date : 17.03.2016
 **/
_me.__constructor = function(s){
	var me = this;
	var parent=this._parent;
	me.__id=false;

	/* set onbefore destruct listener */
	this._add_destructor('__onbeforedestruct');

};

/** obbefore destruct listener */
_me.__onbeforedestruct=function(){

}
/** */

_me._load=function(item){
	var me=this;

	this.__id = item.id;

	this._draw('obj_certificates_server_edit',undefined,item);

	this._tabAnchors = {
		'details': this._getAnchor('details'),
		'domains': this._getAnchor('domains')
	};

	// Save button disabled except for ip bindings
	this._parent.btn_save._disabled(true);

	// Fill menu
	var initial = 'details';
	this._menu = [];

	// CSR certificates or IP bindings tab
	if(item.iscsr && item.automaticengine==0) {
		// Add CSR tab
		this._menu.push({
			name:'csr',
			icon:'',
			value:'certificates::csr',
			onclick:function(e,name){
				me._tabClickHandler(name);
				return false;
			}
		});
		// Tab navigation
		this._parent._setHeading(getLang('certificates::finalize'));
		initial = 'csr';
		this._tabAnchors.csr = this._getAnchor('csr');
		// Export signing request
		this.button_export_csr._onclick = function() {
			me.button_export_csr._disabled(true);
			com.certificates.export(me.__id,function(bOk){
				me.button_export_csr._disabled(false);
				if(!bOk) {
					gui.message.error(getLang("error::action_failed"),getLang("error::failed"));
				}
			});
		}
		// Upload certificate
		this.upload_bind_certificate._extensions(['crt']);
		this.upload_bind_certificate._onfile = function(file) {
			me.input_bind_certificate._value(file.name);
			me.__certificate = file.content;
			me._parent.btn_save._disabled(false);
		}
		this.upload_bind_certificate._onextensionerror = function(type) {
			gui.message.error(getLang("error::incorrect_filetype"));
		}
	
	} else if(item.isdefault!=1) {
		// Add IP tab
		this._menu.push({
			name:'ip_binding',
			icon:'',
			value:'certificates::ip_binding',
			onclick:function(e,name){
				me._tabClickHandler(name);
				me._parent.btn_save._disabled(false);
				return false;
			}
		});
		// Add IP logic
		this.radio_all_ips._value('ipall');
		this.radio_selected_ips._value('ipsel');
		this.radio_all_ips._groupOnchange = function() {
			if(this._groupValue()=='ipall'){
				me.multi_ips._disabled(true);
			} else {
				me.multi_ips._disabled(false);
			}
		}
		if(item.ipaddress.length) {
			this.radio_all_ips._groupValue('ipsel');
			this.multi_ips._value(item.ipaddress);
		} else {
			this.radio_all_ips._groupValue('ipall');
			this.multi_ips._disabled(true);
		}
		// Tab navigation
		this._parent._setHeading(getLang('certificates::properties'));
		initial = 'ip_binding';
		this._tabAnchors['ip_binding'] = this._getAnchor('ip_binding');
		// Enable save
		me._parent.btn_save._disabled(false);
	}

	// Details and domains tabs, always
	this._menu.push({
			isdefault:true,
			name:'details',
			icon:'',
			value:'certificates::details',
			onclick:function(e,name){
				me._tabClickHandler(name);
				return false;
			}
		},{
			name:'domains',
			icon:'',
			value:'certificates::domains',
			onclick:function(e,name){
				me._tabClickHandler(name);
				return false;
		}
	});
	// Add Error tab for Letsencrypt cerficates if there is an error
	if(item.status=='error' && item.iscsr) {
		this._menu.push({
			name:'errors',
			icon:'',
			value:'certificates::errors',
			onclick:function(e,name){
				me._tabClickHandler(name);
				return false;
			}
		});
		this._tabAnchors.errors = this._getAnchor('errors');
	}

	// Choose and open first tab
	if(this._tabAnchors.errors) {
		initial = 'errors';
	}
	this._parent.left_menu._fill(this._menu);
	this._parent.left_menu._setActive(initial);
	this._parent.left_menu._show();
	this._tabClickHandler(initial);
}

_me._tabClickHandler = function(tab) {
	for(var t in this._tabAnchors) {
		if(t==tab) {
			this._tabAnchors[t].removeAttribute('is-hidden');
		} else {
			this._tabAnchors[t].setAttribute('is-hidden',1);
		}
	}
}

_me._save=function(){
	var me=this;
	var parent = me._parent;
	
	if(this._tabAnchors['ip_binding']) {
		var ips = this.radio_all_ips._groupValue()=='ipall' ? [] : this.multi_ips._value();
		com.certificates.editips(this.__id,ips,function(bOk){
			if(bOk) {
				gui.message.toast(getLang("message::save_successfull"));
				me._certificatesList._load();
				me._close();
			} else {
				gui.message.error(getLang("error::action_failed"),getLang("error::failed"));
			}
		});
	} else if(this._tabAnchors.csr) {
		com.certificates.edit(me.__id,me.__certificate,function(success,error){
			if(success){
				gui.message.toast(getLang("message::certificate_saved"));
				me._certificatesList._load();
				me._close();
			}else{
				log.error(['certificates-server-edit-save',error]);
				gui.message.error(getLang("error::certificate_not_saved"));
			}
		});
	}
}
