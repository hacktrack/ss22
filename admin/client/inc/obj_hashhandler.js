location.parsed_query={};
_me = obj_hashhandler.prototype;
function obj_hashhandler(){};

/**
 * @brief:
 * @date : 01.12.2014
 **/
_me.__constructor = function(s){
	var me = this;
	this.oldURL='';
	AttachEvent(window, 'onhashchange',function(){me._changed();});
};

_me._changed=function(e){
	var old_hash=helper.trim(this.oldURL,"#");
	var new_hash=helper.trim(location.hash,'#');
	var argsParsed=helper.parse_query(new_hash);
	
	location.parsed_query=argsParsed;
	
	// active domain
	gui._activeDomain=false;
	if(location.parsed_query.domain){
		gui._activeDomain=location.parsed_query.domain;
	}
	else if(location.parsed_query.account){
		var domain=location.parsed_query.account.split('@');
		gui._activeDomain=domain[domain.length-1];
	}
	else if(gui._globalInfo.domain){
		gui._activeDomain=gui._globalInfo.domain;
	}
	//
	
	this.__exeEvent('onchange',e,{
		'old_hash'		: decodeURI(old_hash),
		'new_hash'		: decodeURI(new_hash),
		'parsed_query'	: argsParsed
	});
	
	this.oldURL=new_hash;
}

_me._force_changed = function()
{
	if(location.hash!='' && location.hash!='#'){
		this._changed();
		return true;
	} else {
		return false;
	}
}
