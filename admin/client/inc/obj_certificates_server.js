_me = obj_certificates_server.prototype;
function obj_certificates_server(){};

obj_certificates_server.statustype = ['neutral', 'ok', 'warning', 'error'];
obj_certificates_server.certificateerrors = ['',
	getLang('error::cert_some_domains_were_not_verified'),
	getLang('error::cert_requesting_challenges_for_domain_verification'),
	getLang('error::cert_parsing_challenges_for_domain_verification'),
	getLang('error::cert_triggering_challenges_challenges_for_domain_verification'),
	getLang('error::cert_registering_acme_account'),
	getLang('error::cert_invalid_csr_detected'),
	getLang('error::cert_signing_certificate'),
	getLang('error::cert_letsEncrypt_rate_limits_applied')
];
obj_certificates_server.domainerrors = [
	getLang('certificates::domain_unknown'),
	getLang('certificates::domain_error'),
	getLang('certificates::domain_valid'),
	getLang('certificates::domain_invalid'),
	getLang('certificates::domain_timeout')
];

/**
 * @brief:
 * @date : 26.10.2014
 **/
_me.__constructor = function(s){
	var me = this;
	var parent=this._parent;

	storage.library('wm_certificates');

	gui.frm_main.main._setAlternativeButtons(function(box,target_anchor){
		if(!box._alternativeButtons){
			box._alternativeButtons=[];
		}

		// add certificate button
		var add = box._create('button_add','obj_button',target_anchor);
		add._addcss('text primary');
		add._value('generic::add');
		//if(target_anchor=='heading_buttons_mobile'){create._addcss('full',true);}
		box._alternativeButtons.push(add);
		//

		// reissue certificate button
		var reissue = box._create('button_reissue','obj_button',target_anchor);
		reissue._disabled(true);
		reissue._addcss('text primary');
		reissue._value('certificates::reissue');
		box._alternativeButtons.push(reissue);
		//

		// create certificate button
		var dflt = box._create('button_set_default','obj_button',target_anchor);
		dflt._disabled(true);
		dflt._addcss('text primary');
		dflt._value('certificates::set_as_default');
		box._alternativeButtons.push(dflt);
		//

		// delete selected certificates button
		var del = box._create('button_delete','obj_button',target_anchor);
		del._disabled(true);
		del._addcss('text error');
		del._value('generic::delete');
		//if(target_anchor=='heading_buttons_mobile'){create._addcss('full',true);}
		box._alternativeButtons.push(del);
		//
	});

	//
	this._add_destructor('__onbeforedestruct');
	/* set onbefore destruct listener */
};

/** obbefore destruct listener */
_me.__onbeforedestruct=function(){

}
/** */

_me._load=function(){
	var me=this;
	var parent=me._parent;

	me._draw('obj_certificates_server');

	// set on methods
	parent.button_add._onclick=function(){
		me._showCertificateWizard();
	}
	parent.button_reissue._onclick=function(){
		me._showCertificateWizard(true);
	}
	parent.button_set_default._onclick=function(){
		me._setSelectedCertificateAsDefault();
	}
	parent.button_delete._onclick=function(){
		me._deleteSelectedCertificates();
	}
	//

	/* Init loadable grid */
	this.list._init('obj_certificates_server',false,function(linesPerPage,page,callback){
		// no listing available
		me.list._setMax(false);

		com.certificates.server([function(aData){
			log.log(['certificates-load',aData]);
			// Add items to list
			if(aData[0]){
				for(var i=0; i<aData.length; i++){
					log.log(['certificates-load-item',aData[i]]);
					/* Parsing item data */
					// Host and ip
					if(!aData[i].ipaddress.length) {
						aData[i].ipaddresses = getLang('certificates::no_ip_limit');
					} else {
						aData[i].ipaddresses = aData[i].ipaddress.join(', ');
					}
					aData[i].hostnames = aData[i].hostname.join(', ');
					// Certificate types
					aData[i].typename = getLang('certificates::type_normal');
					if(aData[i].certtype==2) {
						aData[i].typename = getLang('certificates::type_csr');
					}
					if(aData[i].automaticengine==1) {
						aData[i].typename = getLang('certificates::type_letsencrypt');
					}
					// Expiration
					if(aData[i].expiration) {
						var expired = aData[i].expiration.split('/');
						expired = new Date(expired[0],expired[1]-1,expired[2]);
						aData[i].expired = (expired.getTime() - new Date().getTime()) < 0;
					} else {
						aData[i].expired = true;
						aData[i].expiration = '';
					}
					aData[i].verified = !parseInt(aData[i].verify);
					// Check and mark issuer and subject if empty
					aData[i].issuer = false;
					for(var n in aData[i].issuerinfo) {
						if(aData[i].issuerinfo[n]) {
							aData[i].issuer = true;
							break;
						}
					}
					aData[i].subject = false;
					for(var n in aData[i].subjectinfo) {
						if(aData[i].subjectinfo[n]) {
							aData[i].subject = true;
							break;
						}
					}
					// Error parsing if applicable
					if(aData[i].error) {
						aData[i].error.message = obj_certificates_server.certificateerrors[aData[i].error.lasterror];
						aData[i].error.when = new Date().setUNIX(aData[i].error.lastattempt).toWMString(false,false,false,true);
						if(aData[i].error.faileddomains.length) {
							for(var j=aData[i].error.faileddomains.length; j--;) {
								aData[i].error.faileddomains[j] = aData[i].error.faileddomains[j].domainname + ' : ' + obj_certificates_server.domainerrors[aData[i].error.faileddomains[j].resultcode];
							}
						} else {
							aData[i].error.faileddomains = false;
						}
					}
					// Status label
					aData[i].status = obj_certificates_server.statustype[aData[i].status];
					// Draw item in list
					var line=me.list._drawItem(aData[i]);
				//	line._objects[0]._disabled(aData[i].isdefault);
					line.onclick=function(){
						var item=this._item;
						me._editCertificate(item);
					};
				}
			}
			// Call callback with data if any supplied
			if(callback) {
				callback.call(me,aData);
			}
		}]);
	});

	this.list._onchange=function(){
		var list = me.list._getSelectedList();
		var hasdefault = list.some(function(item){
			return item.isdefault;
		});
		switch(me.list._getSelectedCount()) {
			case 0:
				// No item selected, disable actions
				parent.button_delete._disabled(true);
				parent.button_reissue._disabled(true);
				parent.button_set_default._disabled(true);
				break;
			case 1:
				// Allow reissue if only one item selected
				parent.button_reissue._disabled(false);
				// Disable delete for default cert
				if(list[0].isdefault) {
					parent.button_delete._disabled(true);
				} else {
					parent.button_delete._disabled(false);
					// Allow set as default if is not already
					parent.button_set_default._disabled(false);
				}
				break;
			default:
				// Disable delete if default is in list
				parent.button_delete._disabled(hasdefault);
				// Disable other options for more than one item
				parent.button_reissue._disabled(true);
				parent.button_set_default._disabled(true);
		}
	}
}


_me._showCertificateWizard=function(edit){
	var me=this;
	if(edit)
		edit = me.list._getSelectedList()[0];

	var popup=gui._create('popup','obj_popup');
	popup._init({
		name:'certificate_wizard',
		heading:{
			value:getLang('certificates::wizard')
		},
		iwattr:{
			height:'full',
			width:'medium'
		},
		fixed:false,
		footer:'default',
		content:"obj_certificates_server_wizard"
	});
	popup.content._certificatesList=me.list;
	popup.content._load(edit);
}

_me._editCertificate=function(data){
	var me=this;
	var popup=gui._create('popup','obj_popup');

	log.log(['certificates-server-editcertificates',data]);

	popup._init({
		name:'edit_certificate',
		heading:{
			value:getLang('certificates::edit')
		},
		iwattr:{
			height:'full',
			width:'medium'
		},
		fixed:false,
		footer:'default',
		content:"obj_certificates_server_edit"
	});

	popup.content._certificatesList=me.list;
	popup.content._load(data);
}

_me._doTheDelete=function(closeCallback){
	var me=this;
	if(me._deleteItemsList && me._deleteItemsList[0]){
		var deleteItem=me._deleteItemsList[me._deleteItemsList.length-1];
		log.log(['certificates-server-deleteselectedcertificates-click',deleteItem]);
		com.certificates.delete(deleteItem.id,function(success,error){
			try
			{
				if(success){
					me._deleteItemsList.splice(me._deleteItemsList.length-1,1);
					me._doTheDelete(closeCallback);
				}else{
					me._deleteItemsList=[];
					me.list._emptySelectedList();
					me.list._load();
					closeCallback();
					gui.message.error(getLang("error::delete_unsuccessful"));
				}
			}
			catch(e)
			{
				log.error(['certificates-server-dothedelete',e]);
			}
		});
	}else{
		me._deleteItemsList=[];
		me.list._emptySelectedList();
		me.list._load();
		closeCallback();
		gui.message.toast(getLang("message::delete_successfull"));
	}
}

_me._setSelectedCertificateAsDefault=function(){
	var me = this;
	var defid = this.list._getSelectedList();
	if(defid && defid[0]) {
		me._parent.button_set_default._disabled(true);
		com.certificates.setasdefault(defid[0].id,function(success,error){
			me._parent.button_set_default._disabled(false);
			me.list._emptySelectedList();
			me.list._load();
		});
	}
}

_me._deleteSelectedCertificates=function(){
	var me=this;
	gui.message.warning(getLang('warning::delete_selected_certificates')+" ("+me.list._getSelectedCount()+")",false,[
		{
			value:getLang("generic::cancel"),
			type:'text borderless',
			method:'close'
		},
		{
			value:getLang("generic::delete"),
			type:'error text',
			onclick:function(closeCallback){
				// Do the delete. Now it's confirmed by user
				me._deleteItemsList=me.list._getSelectedList();
				me._doTheDelete(closeCallback);
				//
			}
		}
	]);
}
