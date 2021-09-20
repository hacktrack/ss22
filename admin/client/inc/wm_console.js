function wm_console()
{
	this.xmlns='rpc';
}

wm_console.inherit(wm_generic);
var _me = wm_console.prototype;

_me._get=function(commandname,data,cb,who){
	ecb=cb[1];
	cb=cb[0];
	cb=this.__attachErrorHandler(cb,ecb);
	
	var setdata=false;
	if(data[0]!==false){
		setdata=[{VALUE:data[0]}];
	}
	var propertydata=false;
	if(data[1]!==false){
		
		if(typeof data[1]!='object'){
			data[1]=[data[1]];
		}
		
		var items=[];
		for(var i=0; i<data[1].length; i++){
			items.push({propname:[{VALUE:data[1][i]}]});
		}
		
		propertydata=[{
				item:items
			}];
	}
	
	var aRequest = {
		commandname:[{VALUE:commandname}],
		commandparams:[{}]
	};
	if(data[2] && data[2].account){
		aRequest.commandparams[0].accountemail=[{VALUE:data[2].account}];
	}
	if(data[2] && data[2].domain){
		aRequest.commandparams[0].domainstr=[{VALUE:data[2].domain}];
	}
	aRequest.commandparams[0][data[3]]=setdata;		// get property set "User info"
	aRequest.commandparams[0][data[4]]=propertydata;

	// Add limit if specified for pagination
	if(data[5]) {
		aRequest.commandparams[0]['offset']=[{VALUE:data[5].page*data[5].limit}];
		aRequest.commandparams[0]['count']=[{VALUE:data[5].limit}];
	}

	log.log(['console-get',who]);
	if(who && who.search('@')>=0){
		aRequest.commandparams[0].accountemail=[{VALUE:who}];
	}else if(who){
		aRequest.commandparams[0].domainstr=[{VALUE:who}];
	}

	this.create_iq(aRequest,[this,'_response',[cb]]);
	return true;
}

/*
<iq sid="sidval">
<query xmlns="admin:iq:rpc">
  <commandname>setserverproperties</commandname>
  <commandparams>
    <serverproperties>
      <item>
        <apiproperty>
          <propname>stringval</propname>
        </apiproperty>
        <propertyval>
          <classname>tpropertymembers</classname>
          <val>
            <item>
              <classname>tpropertymember</classname>
              <val>stringval</val>
              <default>enumval</default>
              <recieve>enumval</recieve>
              <post>enumval</post>
              <digest>enumval</digest>
            </item>
            <item>
              <classname>tpropertymember</classname>
              <val>stringval</val>
              <default>enumval</default>
              <recieve>enumval</recieve>
              <post>enumval</post>
              <digest>enumval</digest>
            </item>
          </val>
        </propertyval>
        <propertyright>enumval</propertyright>
      </item>
      <item>
        <apiproperty>
          <propname>stringval</propname>
        </apiproperty>
        <propertyval>
          <classname>taccountname</classname>
          <name>stringval</name>
          <surname>stringval</surname>
        </propertyval>
        <propertyright>enumval</propertyright>
      </item>
    </serverproperties>
  </commandparams>
</query>
</iq>
*/
_me._set=function(commandname,property,value,cb,who){
	
	ecb=cb[1];
	cb=cb[0];
	cb=this.__attachErrorHandler(cb,ecb);
	
	var propertydata=false;
	if(property){
		
		if(typeof property!='object'){
			var prop={};
				prop[property]=value;
			property=prop;
		}
		
		var items=[];
		for(var key in property){
			items.push({
				apiproperty:[{
					propname:[{VALUE:key}]
				}],
				propertyval:[{
					classname:[{VALUE:'tpropertystring'}],
					val:[{VALUE:property[key]}]
				}]
			});
		}
		
		propertydata=[{
				item:items
			}];
	}
	
	var aRequest = {
		commandname:[{VALUE:commandname}],
		commandparams:[{
			propertyvaluelist:propertydata
		}]
	};
	
	log.log(['console-set',who]);
	if(who && who.search('@')>=0){
		aRequest.commandparams[0].accountemail=[{VALUE:who}];
	}else if(who){
		aRequest.commandparams[0].domainstr=[{VALUE:who}];
	}

	this.create_iq(aRequest,[this,'_response',[cb]]);
	return true;
}

// tohle bude SET metoda, ale zatim je GET, aby tu neco bylo
_me.set = function(cb,ecb)
{
	cb=[cb,ecb];
	var cb=cb;
	
	var me=this;
	return {
		server:function(property,value){me._set('SetServerProperties',property,value,cb);},
		domain:function(property,value,who){me._set('SetDomainProperties',property,value,cb,who);},
		account:function(property,value,who){me._set('SetAccountProperties',property,value,cb,who);}
	}
}

_me.standardized = function(cb,ecb){
	var fc=function(data){
		data=com.console.standardize(data);
		if(cb){cb(data);}
	}
	
	return this.item(fc,ecb);
}

_me.item = function(cb,ecb)
{
	cb=[cb,ecb];
	var cb=cb;
	
	var me=this;
	return {
		account:function(property,account,limit){me._get('getaccountproperties',[false,property,{account:account},'accountpropertyset','accountpropertylist',limit],cb,account)},
		domain:function(property,domain){me._get('getdomainproperties',[false,property,{domain:domain},'domainpropertyset','domainpropertylist'],cb,domain)},
		server:function(property){me._get('GetServerProperties',[false,property,false,'serverpropertyset','serverpropertylist'],cb)},
		statistics:function(property){me._get('GetStatisticsProperties',[false,property,false,'statisticspropertylist','statisticspropertylist'],cb)}
	}
}

_me.itemset = function(cb,ecb)
{
	cb=[cb,ecb];
	var cb=cb;
	
	var me=this;
	return {
		account:function(set,account){me._get('getaccountproperties',[set,false,{account:account},'accountpropertyset','accountpropertylist'],cb)},
		server:function(set){me._get('GetServerProperties',[set,false,'serverpropertyset','serverpropertylist'],cb)}
	}
}

_me.combi = function(cb,ecb)
{
	cb=[cb,ecb];
	var cb=cb;
	
	var me=this;
	return {
		account:function(set,property,account){me._get('getaccountproperties',[set,property,{account:account},'accountpropertyset','accountpropertylist'],cb);},
		server:function(set,property){me._get('GetServerProperties',[set,property,'serverpropertyset','serverpropertylist'],cb);}
	}
}

_me.global=function(variable,type,callback){
	var me=this;
	var globalname=variable.substr(1,variable.length-1);
	
	var f = function(value,callback){
		var b = (value=="1"||value==1||value==true?true:false);
		var i = parseInt(value);
		var s = ""+value;
		var ret;
		
		switch(type){
			case V_TYPE_BOOLEAN:
				ret = b;
			break;
			case V_TYPE_INTEGER:
				ret = i;
			break;
			case V_TYPE_STRING:
				ret = s;
			break;
		}
		
		callback(ret,b,i,s);
	}
	
	if(global[globalname]){
		f(global[globalname],function(v,b,i,s){callback(v,b,i,s);});
	}else{
		me.item(function(result){
			try
			{
				var v=result.Array.IQ[0].QUERY[0].RESULT[0].ITEM[0].PROPERTYVAL[0];
				
				global[globalname]=false;
				if(v.VAL && v.VAL[0] && v.VAL[0].VALUE){
					f(v.VAL[0].VALUE,function(v,b,i,s){
						global[globalname]=v;
						callback(v,b,i,s);
					});
				}else{
					log.error(['console-global-val',"v.VAL[0].VALUE not found"]);
				}
			}
			catch(e)
			{
				log.error(['console-global',e]);
			}
		}).server(variable);
	}
}

_me.getAPI=function(perPage,page,mask,cb,clear,type,who){
	
	if(typeof clear=='undefined'){
		clear=true;
	}
	if(!type){type="server";}
	
	var types=[
		'integer',
		'string',
		'enum',
		'boolean',
		'longstring'
	];
	
	var prefixes={
		accounts:['c_accounts_global_'],
		accounts_policies:['c_accounts_policies_'],
		domains:['c_accounts_global_'],
		mail:['c_mail_'],
		smtp_pop3_imap:['c_system_services_'],
		groupware:['c_system_services_','c_gw','c_'],
		mobile_sync:['c_'],
		sms:['c_sms_'],
		instant_messaging:['c_im_','c_system_services_'],
		voip:['c_system_services_'],
		conferencing:['c_meeting_'],
		antispam:['c_as_','c_'],
		antivirus:['c_av_'],
		webserver:['c_system_services_'],
		ftp:['c_ftp_','c_system_services_'],
		webdav:['c_webdav_'],
		smart_discover:['c_system_autodiscover_','c_'],
		logging:['c_system_log_'],
		storage:['c_system_storage_'],
		connection:['c_system_conn_'],
		protocols:['c_system_adv_'],
		ldap:['c_accounts_global_ldap_','c_system_services_'],
		proxy:['c_proxy','c_system_services_'],
		gui:['c_accounts_global_','c_system_console','c_'],
		system_tools:['c_system_tools_'],
		general:['c_'],
		advanced:['c_']
	}
	
	var offset=perPage*page;
		if(offset<0){offset=0;}
	var count=perPage;
	
	var aRequest = {
		commandname:[{VALUE:'get'+type+'apiconsole'}],
		commandparams:[{}]
	};
	
	aRequest.commandparams[0]={
		filter:[{
			mask:[{VALUE:(mask?mask:'*')}],
			clear:[{VALUE:(clear?1:0)}]
		}],
		offset:[{VALUE:offset}],
		count:[{VALUE:count}],
		comments:[{VALUE:1}]
	};

	if(who){
		if(type=='domain'){
			aRequest.commandparams[0].domainstr=[{VALUE:who}];
		}
		if(type=='account'){
			aRequest.commandparams[0].accountemail=[{VALUE:who}];
		}
	}
	
	var call=function(data){
		try
		{
			/* translate XML to clean Array */
			var clean={
				count:0,
				items:[]
			};
			if(data.Array.IQ[0].QUERY[0].RESULT[0]){
				var root=data.Array.IQ[0].QUERY[0].RESULT[0];
				
				log.log(root);
				
				clean.count=root.OVERALLCOUNT[0].VALUE;
				if(root.ITEM&&root.ITEM[0]){
					for(var i=0; i<root.ITEM.length; i++){
						var classname=(root.ITEM[i].PROPERTYVAL[0].CLASSNAME[0].VALUE?root.ITEM[i].PROPERTYVAL[0].CLASSNAME[0].VALUE:'');
						var valuetype=(root.ITEM[i].PROPERTYVALUETYPE[0].VALUE?root.ITEM[i].PROPERTYVALUETYPE[0].VALUE:'');
						var type=(typeof types[valuetype]=='undefined'?valuetype:types[valuetype]);
						var group=root.ITEM[i].PROPERTYGROUP[0].VALUE.toLowerCase().replace(/ /g,'_').replace(/\//g,'_');
						var name=root.ITEM[i].APIPROPERTY[0].PROPNAME[0].VALUE;
						var showname=name;
						var value, label;
						
						var enumvalues=[];
						var enumvalues_fill={};
						if(root.ITEM[i].PROPERTYENUMVALUES && root.ITEM[i].PROPERTYENUMVALUES[0] && root.ITEM[i].PROPERTYENUMVALUES[0].ITEM && root.ITEM[i].PROPERTYENUMVALUES[0].ITEM[0]){
							for(var ii=0; ii<root.ITEM[i].PROPERTYENUMVALUES[0].ITEM.length; ii++){
								try
								{
									value = root.ITEM[i].PROPERTYENUMVALUES[0].ITEM[ii].VALUE[0].VALUE;
									label = root.ITEM[i].PROPERTYENUMVALUES[0].ITEM[ii].NAME[0].VALUE;
									// there should be some translation method for the value
									enumvalues.push({
										name:label,
										value:value
									});
									enumvalues_fill['*'+value]=value + ' - ' + label;
								}
								catch(e)
								{
									log.error(e);
								}
							}
						}
						
						if(prefixes[group]){
							for(var p=0; p<prefixes[group].length; p++){
								if(showname.substr(0,prefixes[group][p].length)==prefixes[group][p]){
									showname=showname.substr(prefixes[group][p].length,showname.length-prefixes[group][p].length);
								}
							}
						}

						clean.items.push({
							name:name,
							showname:showname,
							description:(root.ITEM[i].PROPERTYCOMMENT[0].VALUE?root.ITEM[i].PROPERTYCOMMENT[0].VALUE:''),
							group:group,
							right:root.ITEM[i].PROPERTYRIGHT[0].VALUE,
							value:(root.ITEM[i].PROPERTYVAL[0].VAL&&root.ITEM[i].PROPERTYVAL[0].VAL[0].VALUE?root.ITEM[i].PROPERTYVAL[0].VAL[0].VALUE:''),
							classname:classname,
							type:type,
							enumvalues:enumvalues,
							enumvalues_fill:enumvalues_fill
						});
					}
				}
			}
			data=clean;
			/***/
			
			if(cb){cb(data);}
		}
		catch(e){
			log.error(e);
		}
	}

	this.create_iq(aRequest,[this,'_response',[call]]);
	return true;
}

_me.standardize=function(data){
	var me=this;
	var items=[];
	if(!data.Array.IQ[0].QUERY[0].RESULT[0].ITEM){
		log.info(['wmconsole-standardize','no-items']);
	}else{
		for(var i=0; i<data.Array.IQ[0].QUERY[0].RESULT[0].ITEM.length; i++){
			var item = data.Array.IQ[0].QUERY[0].RESULT[0].ITEM[i],
				val = ((item.PROPERTYVAL[0].VAL || [])[0] || {}).VALUE;
			items.push({
				apiproperty: item.APIPROPERTY[0].PROPNAME[0].VALUE,
				propertyval: val,
				propertyright: parseInt(item.PROPERTYRIGHT[0].VALUE),
				_source: item,
				_sval: val,
				_ival: parseInt(val),
				_bval: val == '1'
			});
		}
	}
	return items;
}

_me._response=function(result,cb)
{
	if(cb){
		cb(result);
	}else{
		log.info(result.Array.IQ[0].QUERY[0].RESULT[0]);
	}
}

if(!com){var com={};}
com.console = new wm_console();
