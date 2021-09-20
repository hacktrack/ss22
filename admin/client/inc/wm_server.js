function wm_server()
{
	this.xmlns='rpc';
}

wm_server.inherit(wm_generic);
var _me = wm_server.prototype;

_me.__servicesList=['smtp','pop3','control','im','calendar','dummy','socks','ldap','imap','antivirus','ftp','antispam','sip','syncml','webclient','caldav','sms','syncpush','commtouch','tunnels','sipcall','activesync','antispamreports','purple','minger','all','none','snmp','proxy','voicemail','icewarpd','meeting','kasperskyupdater','teamchat'];

_me.__response = function(aData,aHandler){
	var out = aData;

	executeCallbackFunction(aHandler,out);
};

_me.__name2ID=function(name){
	if(typeof name == 'string'){
		for(var i=0; i<this.__servicesList.length; i++){
			if(this.__servicesList[i]==name){
				return i;
			}
		}
	}
	return name;
}
/*
<iq sid="sidval">
<query xmlns="admin:iq:rpc">
  <commandname>gettrafficcharts</commandname>
  <commandparams>
    <stype>enumval</stype>
    <charttype>enumval</charttype>
    <ffrom>stringval</ffrom>
    <fto>stringval</fto>
  </commandparams>
</query>
</iq>
*/
_me.trafficCharts=function(sType,charttype,period,aHandler){
	var service=this.__name2ID(sType);
	
	var from=false;
	var to=false;
	if(typeof period == 'object'){
		from=period.from;
		to=period.to;
	}
	else if(typeof period == 'string'){
		period={realtime:0,hour:1,day:2,month:4}[period];
	}else if(typeof period == 'number'){
		period=period;
	}
	
	var aRequest = {
		commandname:[{VALUE:'gettrafficcharts'}],
		commandparams:[{
			stype:[{VALUE:service}],
			charttype:[{VALUE:charttype}],
			period:[{VALUE:period}]
		}]
	};
	
	if(!aHandler[0]){aHandler=[aHandler];}
	
	var h=[function(data){
		var processed=[];
		try
		{
			var items=data.Array.IQ[0].QUERY[0].RESULT[0].LIST[0].ITEM;
			if(items){
				for(var i=0; i<items.length; i++){
					processed.push({value:parseFloat(items[i].V[0].VALUE),time:parseInt(items[i].D[0].VALUE)});
				}
			}
		}
		catch(e)
		{
			log.error([e,data]);
		}
		aHandler[0](processed);
	}];
	
	this.create_iq(aRequest,[this,'__response',[h]]);
	
	return true;
}

_me.serviceStatistics=function(sType,aHandler){
	var service=this.__name2ID(sType);
	
	var aRequest = {
		commandname:[{VALUE:'getservicestatistics'}],
		commandparams:[{
			stype:[{VALUE:service}]
		}]
	};
	
	if(!aHandler[0]){aHandler=[aHandler];}
	
	var h=[function(data){
		var processed={};
		try
		{
			var items=data.Array.IQ[0].QUERY[0].RESULT[0];
			for(var key in items){
				if(key.toLowerCase()!='classname' && items[key][0].VALUE){
					processed[key.toLowerCase()]=items[key][0].VALUE;
				}
			}
		}
		catch(e)
		{
			log.error([e,data]);
		}
		aHandler[0](processed);
	}];
	
	this.create_iq(aRequest,[this,'__response',[h]]);
	return true;
}

_me.startService=function(name,aHandler){
	var service=this.__name2ID(name);
	
	var aRequest = {
		commandname:[{VALUE:'startservice'}],
		commandparams:[{
			service:[{VALUE:service}]
		}]
	};
	
	if(!aHandler[0]){aHandler=[aHandler];}
	
	this.create_iq(aRequest,[this,'__response',[aHandler]]);
	return true;
}

_me.stopService=function(name,aHandler){
	var service=this.__name2ID(name);
	
	var aRequest = {
		commandname:[{VALUE:'stopservice'}],
		commandparams:[{
			service:[{VALUE:service}]
		}]
	};
	
	if(!aHandler[0]){aHandler=[aHandler];}
	
	this.create_iq(aRequest,[this,'__response',[aHandler]]);
	return true;
}

_me.restartService=function(name,aHandler){
	var service=this.__name2ID(name);
	
	var aRequest = {
		commandname:[{VALUE:'restartservice'}],
		commandparams:[{
			service:[{VALUE:service}]
		}]
	};
	
	if(!aHandler[0]){aHandler=[aHandler];}
	
	this.create_iq(aRequest,[this,'__response',[aHandler]]);
	return true;
}

_me.services=function(aHandler){
	// 0=stSMTP , 1=stPOP3 , 2=stControl , 3=stIM , 4=stCalendar , 5=stDummy , 6=stSocks , 7=stLDAP , 8=stIMAP , 9=stAntivirus , 10=stFTP , 11=stAntiSpam , 12=stSIP , 13=stSyncML , 14=stWebClient , 15=stCalDAV , 16=stSMS , 17=stSyncPush , 18=stCommtouch , 19=stTunnels , 20=stSIPCall , 21=stActiveSync , 22=stAntiSpamReports , 23=stPurple , 24=stMinger , 25=stAll , 26=stNone , 27=stSNMP , 28=stProxy , 29=stVoicemail , 30=stIceWarpD , 31=stMeeting , 32=stKasperskyUpdater
	var me=this;
	var services=me.__servicesList;
	
	var aRequest = {
		commandname:[{VALUE:'getservicesinfolist'}],
		commandparams:[{
			filter:[{VALUE:'*'}],
			offset:[{VALUE:0}],
			count:[{VALUE:100}]
		}]
	};
	
	if(!aHandler[0]){aHandler=[aHandler];}
	
	var h=[function(data){
		var items={};
		
		if(data.Array.IQ[0].QUERY[0].RESULT[0].ITEM){
			var aI=data.Array.IQ[0].QUERY[0].RESULT[0].ITEM;
			for(var key in aI){
				var info={};
					info.type=aI[key].SERVICETYPE[0].VALUE;
				
				if(aI[key].CONNECTIONS && aI[key].CONNECTIONS[0] && aI[key].CONNECTIONS[0].VALUE){
					info.connections=parseInt(aI[key].CONNECTIONS[0].VALUE);
				}else{
					info.connections=0;
				}
				if(aI[key].MAXCONNECTIONS && aI[key].MAXCONNECTIONS[0] && aI[key].MAXCONNECTIONS[0].VALUE){
					info.maxconnections=parseInt(aI[key].MAXCONNECTIONS[0].VALUE);
				}else{
					info.maxconnections=0;
				}
				if(aI[key].DATA && aI[key].DATA[0] && aI[key].DATA[0].VALUE){
					info.data=parseInt(aI[key].DATA[0].VALUE);
				}else{
					info.data=0;
				}
				if(aI[key].ISRUNNING && aI[key].ISRUNNING[0] && aI[key].ISRUNNING[0].VALUE){
					info.status=(aI[key].ISRUNNING[0].VALUE=='1'?true:false);
				}else{
					info.status=false;
				}
				if(aI[key].UPTIME && aI[key].UPTIME[0] && aI[key].UPTIME[0].VALUE){
					info.uptime=parseInt(aI[key].UPTIME[0].VALUE);
				}else{
					info.status=false;
				}
				items[services[info.type]]=info;
			}
		}
		
		log.log(['wmserver-services',items]);
		
		aHandler[0](items);
	}];
	
	this.create_iq(aRequest,[this,'__response',[h]]);
	return true;
}

_me.trafficInfo=function(cb){
	com.console.item(function(ret){
		var data={};
		try
		{
			var items=ret.Array.IQ[0].QUERY[0].RESULT[0].ITEM;
			for(var i=0; i<items.length; i++){
				var key=false;
				var value=false;
				
				key=items[i].APIPROPERTY[0].PROPNAME[0].VALUE.toLowerCase();
				try{
					value=parseInt(items[i].PROPERTYVAL[0].VAL[0].VALUE);
				}
				catch(e){}
				data[key]=value;
			}
		}
		catch(e){}
		if(cb){cb(data);}
	}).statistics(['Statistics_ActiveUsers','Statistics_UsedSpace','Statistics_MailSent','Statistics_MailReceived']);
}

_me.setData = function(empty,items,aHandler)
{
	var aRequest = {
		commandname:[{VALUE:'setserverproperties'}],
		commandparams:[{
			propertyvaluelist:[{
				item:items
			}],
		}]
	};

	log.log(items);

	if(!aHandler[0]){aHandler=[aHandler];}
	
	this.create_iq(aRequest,[this,'__response',[aHandler]]);
	return true;
}

_me.rights=function(list,aHandler){
	
	var items=[];
	
	try
	{
		for(var i=0; i<list.length; i++){
			items.push({propname:[{VALUE:list[i]}]});
		}
		
		var aRequest = {
			commandname:[{VALUE:'getmyserverrights'}],
			commandparams:[{
				serverpropertylist:[{
					item:items
				}]
			}]
		};
	
		if(!aHandler[0]){aHandler=[aHandler];}
		this.create_iq(aRequest,[this,'__response',[aHandler]]);
	}
	catch(e)
	{
		log.error(['server-rights',e]);
	}
	
	return true;
}

/*
<iq sid="sidval">
<query xmlns="admin:iq:rpc">
  <commandname>getlicenseinfo</commandname>
  <commandparams/>
</query>
</iq>
*/
_me.getLicenseInfo=function(aHandler,eHandler){
	try
	{
		var aRequest = {
			commandname:[{VALUE:'getlicenseinfo'}],
			commandparams:[]
		};
	
		if(!aHandler){aHandler=function(){}}
		if(!eHandler){eHandler=function(){}}
		aHandler=this._preprocessResponse(function(data){
			try
			{
				var items={};
				data=data.Array.IQ[0].QUERY[0].RESULT[0];
				for(var key in data){
					items[key.toLowerCase()]=data[key][0].VALUE;
				}
				return items;
			}
			catch(e)
			{
				log.error('server-getlicenseinfo',e);
				return {};
			}
		},aHandler)
		
		aHandler=[this.__attachErrorHandler(aHandler[0],eHandler)];
		
		this.create_iq(aRequest,[this,'__response',[aHandler]]);
	}
	catch(e)
	{
		log.error(["wmserver-getlicenseinfo",e]);
	}
}

if(!com){var com={};}
com.server = new wm_server();
