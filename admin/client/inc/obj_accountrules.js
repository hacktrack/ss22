function obj_accountrules(){};
var _me = obj_accountrules.prototype;
/**
 * @brief:
 * @date : 01.12.2014
 **/
_me.__constructor = function(s){
	var me = this;
	storage.library('wm_user');
};

_me._load = function(domain)
{
	log.log('Load list of users for domain '+domain);
	
	var that=this;
	
	that._draw('obj_accountrules', '', {items:{}});
	
	var doit=function(callback){
		var account='';
		if(location.parsed_query.account){
			account=location.parsed_query.account;
		}
		com.user.rules(account,[function(aResponse){
			var items=[];
			if(callback){callback();}
		}]);
	}
	
	that._main.onclick=function(e){
		
	};
	
	that.timeout=setInterval(function(){
		if(storage.css_status('obj_accountrules'))
		{
			clearInterval(that.timeout);
			doit();
		}
	},100);
}