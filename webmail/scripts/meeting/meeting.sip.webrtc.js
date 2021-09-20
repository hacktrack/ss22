/*************************/
/**********SIP*********/
/*************************/

meeting.sip={};
meeting.sip.tries=1;
meeting.sip.callTries=0;
meeting.sip.loadTries=0;
meeting.sip.version='v2';
meeting.sip.errorRaiseTimeout=30000 // in miliseconds

meeting.sip.sipLoaded=false;

meeting.sip.onjavaload = function(e) {
	
	meeting.console.write("ONJAVALOAD CALLBACK CALLED (initcode)");
	/*meeting.sip.applet=document.getElementById('sipApplet');*/
	meeting.sip.applet=false;

	if(meeting.sip.getReadyTimeout)
	{
		clearTimeout(meeting.sip.getReadyTimeout);
	}
	meeting.sip.sipLoaded=true;
	
	meeting.status.readySIP();
	meeting.sip.cb();
	
	if(meeting.settings.goPressed)
	{
		setTimeout(function(){
			meeting.status.button(1);
			$('#submitLogin').click()
		},100);
	}
}

meeting.sip.translateErrorMessage=function(message)
{
	message=(message+'').toLowerCase().replace(/ /g,'_').replace(/\./g,'');
	return message;
}

meeting.sip.appletCallback=function(type,param1,param2)
{
	//console.log("CALLBACK:"+type+'/'param1);
	
	meeting.console.write("SIP CALLBACK");
	meeting.console.dump(type);
	meeting.console.dump(param1);
	meeting.console.dump(param2);
	
	// DEVEL... just sending info about callback type to chat area
	meeting.chat.sendMessage("system","Callback type: \""+meeting.sip.translateErrorMessage(type)+"\""+", Version: \""+meeting.sip.applet.getVersion()+"\"",'system',1,true,true);
	
	if(meeting.sip.translateErrorMessage(type)=='info')
	{
		switch(meeting.sip.translateErrorMessage(param1))
		{
			case 'waiting_for_reply':
				meeting.status.waitingSIP();
			break;
			case 'sip_services_successfully_started':
				meeting.console.write('SIP STARTED SUCCESSFULLY');
			break;
		}
	}
	else if(meeting.sip.translateErrorMessage(type)=='callfinished')
	{
		switch(meeting.sip.translateErrorMessage(param1))
		{
			case 'invite_timeout':
				meeting.console.write("Applet callback - invite timeout",2);
				if(meeting.sip.callTries<3)
				{
					meeting.sip.callTries++;
					setTimeout(function(){meeting.status.ITTryingAgainSIP(5);},1000);
					setTimeout(function(){meeting.status.ITTryingAgainSIP(4);},2000);
					setTimeout(function(){meeting.status.ITTryingAgainSIP(3);},3000);
					setTimeout(function(){meeting.status.ITTryingAgainSIP(2);},4000);
					setTimeout(function(){meeting.status.ITTryingAgainSIP(1);},5000);
					setTimeout(function(){
						meeting.sip.call();
					},6000);
				}
				else
				{
					meeting.console.write("Applet callback - too many invite timeouts, giving it up.",2);
					meeting.status.steady();
					meeting.core.error('meeting_call_failed')
				}
			break;
			default:
				meeting.end();
			break;
		}
	}
	else if(meeting.sip.translateErrorMessage(type)=='callestablished')
	{
		meeting.settings.meetingStartedSuccessfully=true;
		meeting.console.write('SIP CALL ESTABLISHED');
		meeting.status.running();
		meeting.chat.sendMessage("system","Call ID: "+meeting.sip.applet.getCallId(),'system',1,true,true);
	}
	else if(meeting.sip.translateErrorMessage(type)=='error')
	{
		switch(meeting.sip.translateErrorMessage(param1))
		{
			case 'server':
				meeting.status.steady();
				meeting.core.error('meeting_server_not_responding');
				meeting.console.write('UNEXPECTED PARAM:'+param2);
			break;
			case 'general':
				meeting.status.steady();
				meeting.core.error('UNEXPECTED GENERAL ERROR: '+param2);
				meeting.console.write('UNEXPECTED GENERAL ERROR:'+param2);
			break;
			default:
				meeting.core.error('UNEXPECTED ERROR: '+param1+'/'+param2);
				meeting.console.write('UNEXPECTED ERROR: '+param1+'/'+param2);
			break;
		}
	}
	else if(meeting.sip.translateErrorMessage(type)=='incomingconferencemessage' || meeting.sip.translateErrorMessage(type)=='incomingparticipantmessage')
	{
		var name='';
		var usr=meeting.chat.getUser(param1);
		if(usr.name){name=usr.name;}else{name=param1;}
		var param2=param2;
		var param1=param1;
		if(meeting.sip.translateErrorMessage(type)=='incomingparticipantmessage')
		{
			meeting.chat.sendMessage(name,param2,param1,3,true);
		}
		else
		{
			meeting.chat.sendMessage(name,param2,param1,false,true);
		}
	}
	else
	{
		meeting.console.write('UNEXPECTED TYPE:'+meeting.sip.translateErrorMessage(type));
		meeting.console.write('UNEXPECTED PARAM:'+param1);
	}
}

meeting.sip.getReady = function(callback){
	
	meeting.status.preparingSIP();
	
	meeting.sip.cb=callback;
	
	if(!meeting.sip.sipLoaded)
	{
		if(IceSIP.supported())
		{
			//meeting.console.error("WEBRTC SHOULD BE PREPARED HERE (CALL CALLBACK)");
			meeting.sip.onjavaload();
		}
		else
		{
			meeting.console.error("WEBRTC NOT SUPPORTED");
		}
	}
}

meeting.sip.onload=function(show)
{
	var id=meeting.settings.params.id.split('@')[1];
	var port=5060;
	if($('#sip_port') && $('#sip_port').val()!=''){port=$('#sip_port').val();}
	
	meeting.console.write('SIP onload');
	
	meeting.status.startingSIP();

	if(meeting.sip.isActive(function(){}))
	{
		meeting.status.info('info');
		meeting.console.write('SIP - setting '+id+' as SIP server',1);
		meeting.console.write('FAKE EMAIL: '+'"'+meeting.settings.nick+'" <'+meeting.settings.email+'>',1);
		
		var readParamsResult=false;
		
		var sip = new IceSIP({
			display_name: meeting.settings.nick,
			uri: 'sip:'+meeting.settings.email+':'+port,
			//trace_sip:true
		});
		meeting.oSIP=sip;
		
		//var readParamsResult = meeting.sip.applet.readParamsForSingleCall(id,port,'"'+meeting.settings.nick+'" <'+meeting.settings.email+'>',true,'meeting.sip','appletCallback',meeting.core.urlencode("client=anonymous"));
		sip.start();
	}
	else
	{
		meeting.console.write("APPLET SEEMS NOT ACTIVE (meeting.status.isActive) returns false",2);
		if(show)
		{
			meeting.console.write('SIP load failed');
			meeting.core.error('sip_applet_load_failed');
			meeting.status.info('java',false,true);
		}
	}
}

meeting.sip.call=function(num,mikogo,doNotRunSIP)
{
	var runmikogo=true;
	if(!mikogo){runmikogo=false;mikogo=[];}
	if(!num)
	{
		num=meeting.sip.lastNumber;
	}
	
	/*
	meeting.console.dump('MIKOGO PARAMS DUMP #1:');
	meeting.console.dump(mikogo);
	*/
	meeting.sip.lastNumber=num;
	try
	{
		if(!doNotRunSIP)
		{
			var id=meeting.settings.params.id.split('@')[1];
			meeting.console.write("CALLING: "+num,1);
			
			var ret=false;
			//meeting.console.error("MAKE CALL SHOULD BE HERE");
			
			var oConference = new IceSIP.Conference(meeting.oSIP);
			
			
			
			meeting.oConference=oConference;
			meeting.chat.init();	//init chat methods
			
			oConference.onjoined=function(e){
				meeting.console.write("WEBRTC Joined - start",1);
				meeting.settings.meetingStartedSuccessfully=true;
				meeting.console.write('SIP CALL ESTABLISHED',1);
				meeting.status.running();
				meeting.settings.timeCounter = 0;
				meeting.settings.timeCounterInterval=setInterval(function(){meeting.counter();},1000);
				$('#nameTR,#durationTR,#topMeetingControls').show();
				$('#langTR').hide();
			};
			
			oConference.onfailed=function(e){
				meeting.status.steady();
				meeting.core.error('meeting_webrtc_not_allowed');
				
				if(confirm(meeting.core.lang('meeting__no_microphone_continue'))){
					oConference.microphone=false;
					oConference.join(num);
				}
			};
			
			oConference.onended=function(e){
				clearInterval(meeting.settings.timeCounterInterval);
				meeting.end();
			};
			
			oConference.join(num);
		}
		else
		{
			//meeting.mikogo.go(mikogo);
			meeting.console.error("SCREEN SHARING SHOULD BE HERE");
		}
		meeting.console.dump(ret);
	}
	catch(e)
	{
		meeting.console.write('UNEXPECTED ERROR');
		meeting.core.error('meeting_webrtc_is_not_ready','',e);
	}
}

meeting.sip.muteUser=function(id)
{
	var theCallId='';
	try
	{
		//if(meeting.sip.applet && meeting.sip.applet){			theCallId=meeting.sip.applet.getCallId();}
		meeting.console.error("GET THE CALL ID SHOULD BE HERE");
	}
	catch(e)
	{
		meeting.console.write('UNEXPECTED JAVA ERROR in muteUser');
	}
	
	var query='<body xmlns="http://icewarp.com/groupware-api"><iq type="request"><command>managemeetingparticipant</command><params><param>'+theCallId+'</param><param>'+meeting.settings.id+'</param><param>'+id+'</param><param>property=0&amp;value=1</param></params></iq></body>';
	
	meeting.core.query(query,function(data){
		//alert(data);
	});
}

meeting.sip.go=function(num,mikogo,doNotRunSIP)
{
	meeting.sip.call(num,false,doNotRunSIP);
}

meeting.sip.isActive=function(callback)
{
	var status=true;
	
	//meeting.console.error("CHECK IF WEBRTC IS ACTIVE HERE");
	
	return status;
	/*
	meeting.console.write("INSIDE isActive #2",1);
	try{
		meeting.console.write("INSIDE problematic TRY #1",1);
		if (!meeting.sip.applet || typeof meeting.sip.applet.isActive == 'undefined')
		{
			meeting.console.write("INSIDE problematic IF",1);
			if(!meeting.sip.applet)
			{
				meeting.console.write('SIP Legendary fail',2);
			}
			if(!meeting.sip.applet.isActive || typeof meeting.sip.applet.isActive == 'undefined')
			{
				try
				{
					meeting.console.write("INSIDE problematic TRY #2",1);
					if(meeting.sip.applet.isActive()) // this is real thing... it's because of IE which always says the function does not exist, but it can exist
					{
						meeting.console.write('SIP isActive does not exist, but is OK');
						return true;
					}
					else
					{
						meeting.console.write('SIP isActive fail',2);
					}
				}
				catch(e)
				{
					meeting.console.write('SIP isActive does not exist for real');
				}
			}
			meeting.console.write('SIP critical fail',2);
			callback();
			return false;
		}
		else
		{
			meeting.console.write('isActive found',1);
			var ret=meeting.sip.applet.isActive();
			return ret;
		}
	}
	catch(r){
		//alert(print_r(r,true));
		meeting.console.write('SIP catched ('+r+')',2);
		callback();
		if (document.all && document.querySelector && !document.addEventListener)
		{
			meeting.console.write('IE8 Detected, continuing, but result can be unexpected.',2);
			return true;
		}
		return false;
	}
	meeting.console.write("END OF isActive",1);
	*/
}

meeting.sip.mute=function(status)
{
	if(status)
	{
		meeting.oConference.mute(status);
		//meeting.sip.mute(false);
		//meeting.sip.applet.setVolume(0);
		//meeting.sip.audio.muted=true
		//meeting.console.error("MUTE SHOULD BE HERE");
		meeting.console.write("Muted",1);
	}
	else
	{
		meeting.oConference.mute(status);
		//meeting.sip.audio.muted=false
		//meeting.console.error("UNMUTE SHOULD BE HERE");
		//meeting.sip.applet.setVolume(100);
		meeting.console.write("Unmuted",1);
	}
}

meeting.sip.end=function()
{
	try
	{
		meeting.oConference.leave();
	}
	catch(e)
	{
		//console.error(e.message);
	}
}