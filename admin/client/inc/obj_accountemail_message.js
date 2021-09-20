function obj_accountemail_message(){};
var _me = obj_accountemail_message.prototype;
/**
 * @brief:
 * @date : 01.12.2014
 **/
_me.__constructor = function(s){
	var me = this;
	storage.library('wm_user');
	storage.library('obj_accountpicker');
};

_me._load = function(domain,that)
{
	var me=this;
	
	me._draw('obj_accountemail_message', '', {items:{}});
	
	//log.log(['responder message',that._responder_message]);
	
	this.button_from._onclick=function(){
		me._addFrom();
	}
	
	com.user.getResponderMessage(location.parsed_query.account,function(result){
		try
		{
			var data=result.Array.IQ[0].QUERY[0].RESULT[0].ITEM[0].PROPERTYVAL[0];
			// fill form
			if(data.FROM[0] && data.FROM[0].VALUE){
				me.input_from._value(data.FROM[0].VALUE);
			}
			if(data.SUBJECT[0] && data.SUBJECT[0].VALUE){
				me.input_subject._value(data.SUBJECT[0].VALUE);
			}
			if(data.TEXT[0] && data.TEXT[0].VALUE){
				me.textarea_mesage_setup_text._value(data.TEXT[0].VALUE);
			}
			//
		}catch(e){
			
		}
	});
}

_me._addFrom=function(){
	var me=this;
	gui.accountpicker(function(items){
		var email = items[0] && items[0].id;
		if(email) {
			me.input_from._value(helper.trim(email));
		}
	},{
		disable_add_domain:true
	});
}

_me._save=function(){
	var me=this;
	try
	{
		var account='';
		if(location.parsed_query.account){
			account=location.parsed_query.account;
		}
		
		com.user.setResponderMessage(account,me.input_from._value(),me.input_subject._value(),me.textarea_mesage_setup_text._value(),[function(result){
			try
			{
				if(result.Array.IQ[0].QUERY[0].RESULT[0].VALUE==0){
					gui.message.error(getLang("error::save_unsuccessful"));
				}else{
					gui.message.toast(getLang("message::save_successfull"));
					me._close();
				}
			}
			catch(e)
			{
				log.error(e);
			}
		}]);
		
	}
	catch(e)
	{
		log.error(e);
	}
}