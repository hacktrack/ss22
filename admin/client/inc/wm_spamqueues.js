function wm_spamqueues()
{
	this.xmlns='rpc';
}

wm_spamqueues.inherit(wm_generic);
var _me = wm_spamqueues.prototype;

_me.__response = function(aData,aHandler){
	var out = aData;

	executeCallbackFunction(aHandler,out);
};


/**
<iq sid="sidval">
<query xmlns="admin:iq:rpc">
  <commandname>getspamqueueinfolist</commandname>
  <commandparams>
    <queuetype>enumval</queuetype>
    <filter>
      <mask>stringval</mask>
      <sender>stringval</sender>
      <owner>stringval</owner>
      <domain>stringval</domain>
    </filter>
    <offset>intval</offset>
    <count>intval</count>
  </commandparams>
</query>
</iq>

*/
_me._getList=function(type,mask,sender,owner,domain,itemsPerPage,page,aHandler){
	var items=[];
	
	try
	{
		var aRequest = {
			commandname:[{VALUE:'getspamqueueinfolist'}],
			commandparams:[{
				queuetype:[{VALUE:{'whitelist':0,'blacklist':1,'quarantine':2,'0':0,'1':1,'2':2}[type.toString().toLowerCase()]}],
				filter:[{
					mask:[{VALUE:(mask?mask:'')}],
					sender:[{VALUE:(sender?sender:'')}],
					owner:[{VALUE:(owner?owner:'')}],
					domain:[{VALUE:(domain?domain:'')}]
				}],
				offset:[{VALUE:(itemsPerPage*page)}],
				count:[{VALUE:(itemsPerPage)}]
			}]
		};
	
		if(!aHandler[0]){aHandler=[aHandler];}
		
		var fc=[function(data){
			var prepared={count:0,items:[]};
			
			try
			{
				if(data.Array.IQ[0].QUERY[0].RESULT[0].OVERALLCOUNT[0].VALUE)
				{
					prepared.count=parseInt(data.Array.IQ[0].QUERY[0].RESULT[0].OVERALLCOUNT[0].VALUE);
				}
				
				if(data.Array.IQ[0].QUERY[0].RESULT[0].ITEM)
				{
					for(var i=0; i<data.Array.IQ[0].QUERY[0].RESULT[0].ITEM.length; i++){
						var inner={};
						for(var inr in data.Array.IQ[0].QUERY[0].RESULT[0].ITEM[i]){
							inner[inr.toLowerCase()]=(data.Array.IQ[0].QUERY[0].RESULT[0].ITEM[i][inr][0]&&data.Array.IQ[0].QUERY[0].RESULT[0].ITEM[i][inr][0].VALUE?data.Array.IQ[0].QUERY[0].RESULT[0].ITEM[i][inr][0].VALUE:false);
						}
						prepared.items.push(inner);
					}
				}
			}
			catch(e){
				log.error(['spamqueues-getlist','Invalid response',data]);
			}
				
			aHandler[0](prepared);
		}];
		
		this.create_iq(aRequest,[this,'__response',[fc]]);
	}
	catch(e)
	{
		log.error(['spamqueues-getlist',e]);
	}
	
	return true;
}

/*
<iq sid="sidval">
<query xmlns="admin:iq:rpc">
  <commandname>getspamqueueitembody</commandname>
  <commandparams>
    <itemid>stringval</itemid>
  </commandparams>
</query>
</iq>
*/
_me.getDetail=function(id,aHandler){
	var items=[];
	var me=this;
	
	try
	{
		var aRequest = {
			commandname:[{VALUE:'getspamqueueitembody'}],
			commandparams:[{
				itemid:[{VALUE:id}]
			}]
		};
		
		var fc=me._preprocessResponse(function(response){
			try
			{
				if(response.Array.IQ[0].QUERY[0].RESULT[0].VALUE){
					return response.Array.IQ[0].QUERY[0].RESULT[0].VALUE;
				}
			}
			catch(e)
			{
				log.error(['spamqueues-getdetail',e]);
			}
			return false;
		},aHandler);
		
		this.create_iq(aRequest,[this,'__response',[fc]]);
	}
	catch(e)
	{
		log.error(['spamqueues-blacklist',e]);
	}
	
	return true;
}

/*
<iq sid="sidval">
<query xmlns="admin:iq:rpc">
  <commandname>blacklistspamqueueitem</commandname>
  <commandparams>
    <itemid>stringval</itemid>
  </commandparams>
</query>
</iq>
*/
_me.blacklistItem=function(id,aHandler){
	var items=[];
	var me=this;
	
	try
	{
		var aRequest = {
			commandname:[{VALUE:'blacklistspamqueueitem'}],
			commandparams:[{
				itemid:[{VALUE:id}],
			}]
		};
		
		this.create_iq(aRequest,[this,'__response',[me._autoBooleanHandler(aHandler)]]);
	}
	catch(e)
	{
		log.error(['spamqueues-blacklist',e]);
	}
	
	return true;
}

/*
<iq sid="sidval">
<query xmlns="admin:iq:rpc">
  <commandname>whitelistspamqueueitem</commandname>
  <commandparams>
    <itemid>stringval</itemid>
  </commandparams>
</query>
</iq>
*/
_me.whitelistItem=function(id,aHandler){
	var items=[];
	var me=this;
	
	try
	{
		var aRequest = {
			commandname:[{VALUE:'whitelistspamqueueitem'}],
			commandparams:[{
				itemid:[{VALUE:id}],
			}]
		};
		
		this.create_iq(aRequest,[this,'__response',[me._autoBooleanHandler(aHandler)]]);
	}
	catch(e)
	{
		log.error(['spamqueues-blacklist',e]);
	}
	
	return true;
}

/*
<iq sid="sidval">
<query xmlns="admin:iq:rpc">
  <commandname>deliverspamqueueitem</commandname>
  <commandparams>
    <itemid>stringval</itemid>
  </commandparams>
</query>
</iq>

*/
_me.deliverItem=function(id,aHandler){
	var items=[];
	var me=this;
	
	try
	{
		var aRequest = {
			commandname:[{VALUE:'deliverspamqueueitem'}],
			commandparams:[{
				itemid:[{VALUE:id}],
			}]
		};
		
		this.create_iq(aRequest,[this,'__response',[me._autoBooleanHandler(aHandler)]]);
	}
	catch(e)
	{
		log.error(['spamqueues-deliveritem',e]);
	}
	
	return true;
}

/*
<iq sid="sidval">
<query xmlns="admin:iq:rpc">
  <commandname>deletespamqueueitem</commandname>
  <commandparams>
    <itemid>stringval</itemid>
  </commandparams>
</query>
</iq>
*/
_me.deleteItem=function(id,aHandler){
	var items=[];
	var me=this;
	
	try
	{
		var aRequest = {
			commandname:[{VALUE:'deletespamqueueitem'}],
			commandparams:[{
				itemid:[{VALUE:id}],
			}]
		};
		
		this.create_iq(aRequest,[this,'__response',[me._autoBooleanHandler(aHandler)]]);
	}
	catch(e)
	{
		log.error(['spamqueues-deleteitem',e]);
	}
	
	return true;
}

/*<iq sid="sidval">
<query xmlns="admin:iq:rpc">
  <commandname>addspamqueueitem</commandname>
  <commandparams>
    <info>
      <itemid>stringval</itemid>
      <sender>stringval</sender>
      <date>stringval</date>
      <owner>stringval</owner>
      <domain>stringval</domain>
      <subject>stringval</subject>
      <queuetype>enumval</queuetype>
      <folder>stringval</folder>
    </info>
  </commandparams>
</query>
</iq>*/
_me._addItem=function(type,sender,owner,aHandler){
	var items=[];
	
	try
	{
		var aRequest = {
			commandname:[{VALUE:'addspamqueueitem'}],
			commandparams:[{
				info:[{
					sender:[{VALUE:(sender?sender:'')}],
					owner:[{VALUE:(owner?owner:'')}],
					queuetype:[{VALUE:{'whitelist':0,'blacklist':1,'quarantine':2,'0':0,'1':1,'2':2}[type.toString().toLowerCase()]}],
				}]
			}]
		};
	
		if(!aHandler[0]){aHandler=[aHandler];}
		
		var fc=[function(data){
			try
			{
				if(data.Array.IQ[0].QUERY[0].ERROR && data.Array.IQ[0].QUERY[0].ERROR[0])
				{
					log.error(['spamqueues-additem',data.Array.IQ[0].QUERY[0].ERROR[0].ATTRIBUTES.UID]);
					aHandler[0](false);
					return false;
				}
				
				if(data.Array.IQ[0].QUERY[0].RESULT[0] && data.Array.IQ[0].QUERY[0].RESULT[0].VALUE=='1')
				{
					aHandler[0](true);
					return true;
				}
				
				aHandler[0](false);
				return false;
			}
			catch(e){
				log.error(['spamqueues-addItem','Invalid response',data,e]);
				aHandler[0](false);
				return false;
			}
		}];
		
		this.create_iq(aRequest,[this,'__response',[fc]]);
	}
	catch(e)
	{
		log.error(['spamqueues-additem',e]);
	}
	
	return true;
}

_me.getQuarantine=function(mask,sender,owner,domain,itemsPerPage,page,aHandler){
	this._getList('quarantine',mask,sender,owner,domain,itemsPerPage,page,aHandler);
}

_me.getBlacklist=function(mask,sender,owner,domain,itemsPerPage,page,aHandler){
	this._getList('blacklist',mask,sender,owner,domain,itemsPerPage,page,aHandler);
}

_me.getWhitelist=function(mask,sender,owner,domain,itemsPerPage,page,aHandler){
	this._getList('whitelist',mask,sender,owner,domain,itemsPerPage,page,aHandler);
}

_me.addWhitelist=function(sender,owner,aHandler){
	this._addItem('whitelist',sender,owner,aHandler);
}

_me.addBlacklist=function(sender,owner,aHandler){
	this._addItem('blacklist',sender,owner,aHandler);
}

if(!com){var com={};}
com.spamqueues = new wm_spamqueues();
