var LOGGER_NONE=0;
var LOGGER_ERROR=1;
var LOGGER_WARNING=2;
var LOGGER_NOTICE=3;
var LOGGER_LOG=4;
var LOGGER_ALL=5;
var LOGGER_CONSOLE=0;
var LOGGER_ALERT=1;

function logger(s){
	var me = this;
	if(!s){
		s={};
	}
	
	me.settings={
		verbosity:LOGGER_ALL,
		type:LOGGER_CONSOLE
	};
	
	for(var key in s){
		me.settings[key]=s[key];
	}
	
	/** */
	
	me._doit = function(data,type){
		if(!type || type==0){type=4;}
		
		if(console){
			
			if(type<3)
			{
				if(me.settings.type==LOGGER_ALERT){
					alert(JSON.stringify(data));
				}
			}
			
			if(type<3 && console.error){
				console.error(' ',data);
			}else if(type<4 && console.info){
				console.info(data);
			}else{
				console.log(data);
			}
		}
	}
	
	me.log = function(data){
		if(me.settings.verbosity>=LOGGER_LOG){
			me._doit(data,LOGGER_LOG);
		}
	}
	
	me.warning = function(data){
		if(me.settings.verbosity>=LOGGER_WARNING){
			me._doit(data,LOGGER_ERROR);
		}
	}
	
	me.error = function(data){
		try
		{
			me._doit(data,LOGGER_ERROR);
			
			var str='';
			if(typeof data == 'string'){
				str=data;
			}
			else if(data[0] && typeof data[0] == 'string'){
				str=data[0];
			}
			
			var estr="";
			var eh=false;
			if(data[1]&&data[1].message){
				estr=data[1].message;
				eh=getLang("error::"+str.replace('e:','').replace(/-/gi,'_'));
			}else{
				estr=getLang("error::"+str.replace('e:','').replace(/-/gi,'_'))
			}
			
			if(str && str.length>1 && str.substr && str.substr(0,2)=='e:'){
				gui.message.error(estr,eh);
			}
		}
		catch(e)
		{
			gui.message.error(getLang("error::unknown_error"),e.message,false,true);
		}
	}
	
	me.info = function(data){
		if(me.settings.verbosity>=LOGGER_NOTICE){
			me._doit(data,LOGGER_NOTICE);
		}
	}
};