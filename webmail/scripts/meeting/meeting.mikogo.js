/*************************/
/**********MIKOGO*********/
/*************************/
meeting.mikogo={};
meeting.mikogo.onEndCallback=function(){};

meeting.mikogo.getReady=function(callback)
{
	meeting.core.query('<body xmlns="http://icewarp.com/groupware-api" ><iq type="request"><command>getmeetinginfo</command><params><param>'+meeting.settings.nick+'</param><param>'+meeting.settings.id+'</param></params></iq></body>',function(data)
	{
		meeting.status.steady();
		meeting.console.dump(data);
		
		if(data['BODY'][0]['IQ'][0]['ERROR'])
		{
			meeting.core.error('meeting_api_error_'+data['BODY'][0]['IQ'][0]['ERROR_CODE'][0]['VALUE']);
			return false;
		}
		else
		{
			meeting.console.write('Return OK');
			if(data['BODY'][0]['IQ'][0]['VALUE'][0]['VALUE'])
			{
				meeting.console.write(urldecode(data['BODY'][0]['IQ'][0]['VALUE'][0]['VALUE']));
				meeting.settings.params=meeting.core.parseParams(urldecode(data['BODY'][0]['IQ'][0]['VALUE'][0]['VALUE']));
				meeting.console.dump(meeting.settings.params);
			}
			else
			{
				meeting.core.error('meeting_api_unexpected_response');
			}
			
			if(!meeting.settings.params['started'] || meeting.settings.params['started']==0)
			{
				meeting.mikogo.wait();
			}
			else
			{
				if(meeting.settings.params['appletcode'])
				{
					var applet=trim(base64_decode(meeting.settings.params['appletcode']));
					//applet=applet.replace('https://sandbox-go.mikogo4.com/download/MikogoApplet.jar','http://hawwwran.com/IW/MikogoAppletDownload.jar');// temporary path fix
					applet=applet.replace('MikogoAppletDownload.class','com.icewarp.meeting.MikogoAppletDownload.class');// temporary path fix
					applet=applet.replace('<applet','<applet id="mikogoApplet"');// temporary path fix
					meeting.settings.applet=applet;
					
					meeting.console.write('Meeting ready');
					meeting.console.write('----------------------------------');
					meeting.console.write(applet);
					meeting.console.write('----------------------------------');
					
					meeting.status.readyMikogo();
					if(callback){callback();}
				}
				else
				{
					meeting.core.error('lang-login_screen-meeting_no_applet_code');
				}
			}
		}
	});
}

meeting.mikogo.wait=function()
{
	meeting.console.write('Waiting for meeting to start');
	meeting.status.waiting();
	meeting.core.query('<body xmlns="http://icewarp.com/groupware-api" ><iq type="request"><command>waitmeeting</command><params><param>'+meeting.settings.nick+'</param><param>'+meeting.settings.id+'</param><param>'+meeting.settings.timeout+'</param></params></iq></body>',function(data)
	{
		meeting.console.dump(data);
		if(data['BODY'][0]['IQ'][0]['ERROR'])
		{
			meeting.console.write(data['BODY'][0]['IQ'][0]['ERROR'][0]['VALUE']+' ['+data['BODY'][0]['IQ'][0]['ERROR_CODE'][0]['VALUE']+']');
		}
		else
		{
			if(data['BODY'][0]['IQ'][0]['VALUE'][0]['VALUE'])
			{
				meeting.settings.params=meeting.core.parseParams(urldecode(data['BODY'][0]['IQ'][0]['VALUE'][0]['VALUE']));
				meeting.console.dump(meeting.settings.params);
				meeting.console.write(print_r(meeting.settings.params,true));
			}
		}
		
		if(!meeting.settings.params['started'] || meeting.settings.params['started']==0)
		{
			meeting.core.message('lang-login_screen-meeting_meeting_wasnt_started');
			setTimeout(function(){meeting.core.ok(true);},2000);
			meeting.mikogo.wait();
		}
		else
		{
			meeting.status.ready();
		}
	});
}

meeting.mikogo.go=function(mikogo)
{
	if(!meeting.mikogo.running)
	{
		var open_in_browser=false;
		meeting.mikogo.running=true;
		
		if(
			(meeting.settings.hashParams['mikogo'] && meeting.settings.hashParams['mikogo']=='browser') ||
			(navigator.appVersion.indexOf("Win")==-1)
		)
		{
			// if forced to show in browser or not Windows
			open_in_browser=true;
		}
		
		if(open_in_browser)
		{
			var mikogo_browser_mode_url="https://go.icewarp.net/?cm=2&sid="+mikogo[3]+
										"&sn="+urlencode(mikogo[4]);
			meeting.mikogo.activeWindow=window.open(mikogo_browser_mode_url,'','width=600 height=600');
		}
		else
		{
			meeting.console.write('MIKOGO PARAMS DUMP #2:');
			meeting.console.write(print_r(mikogo,true));
			meeting.sip.applet.mikogoStart(mikogo[0],mikogo[1],mikogo[2]);
			//meeting.sip.applet.mikogoStart(mikogo);
		}
	}
}

meeting.mikogo.end=function()
{
	meeting.mikogo.running=false;
	
	if(meeting.mikogo.activeWindow)
	{
		// close window with mikogo if it was launched in browser
		meeting.mikogo.activeWindow.close();
	}
	
	clearTimeout(meeting.mikogo.interval);
	$('#mikogo').html('');
	meeting.mikogo.onEndCallback();
	if(meeting.sip && meeting.sip.applet && meeting.sip.applet.mikogoStop)
	{
		meeting.sip.applet.mikogoStop();
	}
}
/*************************/
/*************************/