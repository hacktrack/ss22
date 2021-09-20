_me = obj_certificates_server_add.prototype;
function obj_certificates_server_add(){};

/**
 * @brief:
 * @date : 26.10.2014
 **/
_me.__constructor = function(s){

};

_me._load=function(item){
	var me=this;
	var popup = this._parent._parent;
	
	var id = this.__id = item ? item.id : false;
	var allowed = item && item.iscsr ? ['crt'] : ['pem'];
	
	me._draw('obj_certificates_server_add');
	
	this.input_certificate._readonly(true);
	popup.main.btn_save._disabled(true);

	this.upload_certificate._extensions(allowed);
	this.upload_certificate._onfile = function(file) {
		me.input_certificate._value(file.name);
		me.__certificate = file.content;
		popup.main.btn_save._disabled(false);
	}
	this.upload_certificate._onextensionerror = function(type) {
		gui.message.error(getLang("error::incorrect_filetype"));
	}
}

_me._save=function(){
	var me=this;
	var parent = me._parent;
	
	if(me.__id){
		com.certificates.edit(me.__id,me.__certificate,function(success,error){
			if(success){
				gui.message.toast(getLang("message::certificate_saved"));
				me._certificatesList._load();
				parent._parent._close();
			}else{
				log.error(['certificates-server-add-save',error]);
				gui.message.error(getLang("error::certificate_not_saved"));
			}
		});
	}else{
		com.certificates.add(me.__certificate,function(success,error){
			if(success){
				gui.message.toast(getLang("message::certificate_saved"));
				me._certificatesList._load();
				while(gui._popupList.length) {
					gui._popupList[0]._close();
				}
			}else{
				log.error(['certificates-server-add-save',error]);
				gui.message.error(getLang("error::certificate_not_saved"));
			}
		});
	}
}
