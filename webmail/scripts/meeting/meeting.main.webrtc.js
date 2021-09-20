/*************************/
/********** MAIN *********/
/*************************/

meeting.prepare=function(callback)
{
	var nick=meeting.getNick();			// get user's nick, but not necessary yet
	var email=$('#inputEmail').val();	// get user's email
	meeting.settings.nick=nick;			// set user's nick to settings
	if(trim(email)==''){email='noreply@_none_.com';}
	meeting.settings.email=email;		// set user's email to settings
	meeting.core.ok();					// clear error and message line
	
	meeting.status.loading();			// show loading status
	
	meeting.info(function(){			// meeting started callback
		meeting.status.info('info');
	
		if(meeting.settings.params.desktop && meeting.settings.params.desktop=='1'){
			meeting.settings.conferenceType=2;
		}
		
		$('#meetingNumber,.meetingNumber').html(meeting.settings.params.information_sip);
		/*
		if(document.getElementById('mikogoID')){ // if mikogoID id is detected, unsupported device present. Do not run applets
			meeting.settings.conferenceType=-1;
		}
		*/
		/*
		if(meeting.settings.params && meeting.settings.params.appletparams && meeting.settings.params.appletparams.sessionKey)
		{
			$('#mikogoID,.mikogoID').text(meeting.settings.params.appletparams.sessionKey.substr(0,3)+'-'+meeting.settings.params.appletparams.sessionKey.substr(3,3)+'-'+meeting.settings.params.appletparams.sessionKey.substr(6,3));
		}
		*/
		//if(document.getElementById('os') && document.getElementById('os').value=='mac'){meeting.settings.conferenceType=0;} // if macOS, do not run mikogo
		
	/** ******************************************/
		var fn=function()
		{
			if(!callback)
			{
				meeting.console.write('meeting.prepare - STARTED CALLBACK #1');
				meeting.onMeetingStart();
			}
			else
			{
				meeting.console.write('meeting.prepare - CUSTOM CALLBACK #1');
				callback();
			}
		}
		fn();
	/** ******************************************/
	/*
		if(document.getElementById('os') && document.getElementById('os').value=='mac' && meeting.settings.params.desktop=='1' && !meeting.mikogoWarning)
		{
			meeting.showMikogoWarning();
			$('#continue').click(function(){fn();});
		}
		else
		{
			fn();
		}
	*/	
	},function(){ // wait callback
		meeting.console.write('WAIT CALLBACK #1');
		meeting.onMeetingStart();
	});
}

meeting.info=function(callback,waitCallback,dataReturnedCallback,doNotChangeStatus)
{
	var meetingInfoQuery='<body xmlns="http://icewarp.com/groupware-api" ><iq type="request"><command>getmeetinginfo</command><params><param>'+meeting.settings.nick+'</param><param>'+meeting.settings.id+'@'+location.host+'</param><param>1</param></params></iq></body>';
	
	meeting.core.query(meetingInfoQuery,function(data)
	{
		if(!doNotChangeStatus){meeting.status.steady();}
		if(!doNotChangeStatus){meeting.console.dump(data);}
		
		if(data['BODY'] && data['BODY'][0]['IQ'] && data['BODY'][0]['IQ'][0]['ERROR'])
		{
			meeting.console.write('Meeting Info ERROR');
			if(doNotChangeStatus)
			{
				meeting.end();
			}
			else
			{
				meeting.core.error('meeting_api_error_'+data['BODY'][0]['IQ'][0]['ERROR_CODE'][0]['VALUE']);
				if(meeting.core.isLang('meeting_api_error_description_'+data['BODY'][0]['IQ'][0]['ERROR_CODE'][0]['VALUE']))
				{
					meeting.status.text('lang-login_screen-meeting_api_error_description_'+data['BODY'][0]['IQ'][0]['ERROR_CODE'][0]['VALUE']);
				}
			}
			return false;
		}
		else
		{
			if(data['BODY'] && data['BODY'][0]['IQ'] && data['BODY'][0]['IQ'][0]['VALUE'] && data['BODY'][0]['IQ'][0]['VALUE'][0]['VALUE'])
			{
				meeting.settings.params=meeting.core.parseParams(data['BODY'][0]['IQ'][0]['VALUE'][0]['VALUE']);
				if(meeting.settings.params.appletparams)
				{
					meeting.settings.params.appletparams=meeting.core.parseParams(meeting.settings.params.appletparams);
				}
				meeting.console.dump(meeting.settings.params);
				if(dataReturnedCallback){dataReturnedCallback(meeting.settings.params);}
			}
			else
			{
				meeting.core.error('meeting_api_unexpected_response');
			}
			
			if(!meeting.settings.params['started'] || meeting.settings.params['started']==0)
			{
				if(waitCallback)
				{
					meeting.wait(waitCallback);
				}
			}
			else
			{
				if(callback){callback();}
			}
		}
	});
}

/*************************/
/*************************/
/*************************/

meeting.getNick=function()
{
	var nick=$('#inputUsername').attr('anonymous');
	var inp=$('#inputUsername').val();
	if(inp && inp!='')
	{
		return inp;
	}
	return nick;
}

meeting.counter=function()
{
	meeting.settings.timeCounter++;

	var h = Math.floor(meeting.settings.timeCounter/3600),
		m = Math.floor((meeting.settings.timeCounter%3600)/60),
		s = ((meeting.settings.timeCounter%3600)%60);

	$('#meetingCounter').text((h?h+':':'')+(m<10?'0'+m:m)+':'+(s<10?'0'+s:s));
}

meeting.wait=function(callback)
{
	meeting.core.message('lang-login_screen-meeting_meeting_connected_successfully');
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
			meeting.wait(callback);
		}
		else
		{
			callback();
		}
	});
}

meeting.run=function()
{
	meeting.console.write("Nick name processed #1",1);
	
	var nick=meeting.getNick();							// get user's nick
	var email=$('#inputEmail').val();							// get user's email
	meeting.settings.nick=nick;									// set user's nick to settings
	if(trim(email)==''){email='noreply@_none_.com';}
	meeting.settings.email=email;								// set user's email to settings
	if(trim(nick)!='')											// check if user's nick is not empty
	{
		meeting.prepare(function(){								// check the meeting info again to be sure
		
			//if(meeting.settings.conferenceType==0)
			//{
				meeting.sip.go(meeting.settings.params.information_sip);
			//}
/*
			else if(meeting.settings.conferenceType==1)
			{
				meeting.mikogo.go();
			}
			else if(meeting.settings.conferenceType==2)
			{
				meeting.settings.isMikogoRunning=true;
				meeting.sip.go(meeting.settings.params.information_sip,
					[
						[
							urldecode(meeting.settings.params.appletparams.download_url),
							urldecode(meeting.settings.params.appletparams.download_dir),
							urldecode(meeting.settings.params.appletparams.file_name),
							urldecode(meeting.settings.params.appletparams.download_size)
						],
						[
							urldecode(meeting.settings.params.appletparams.stopper_download_url),
							urldecode(meeting.settings.params.appletparams.stopper_size)
						],
						[meeting.settings.params.appletparams.sessionKey, meeting.settings.nick, "\"\"", "\"\""]
					]
				);
			}
			*/
			
			
			meeting.infoInterval=setInterval(function(){
				if(!meeting.infoTriggered)
				{
					meeting.infoTriggered=true;
					meeting.info(false,false,function(params){
						if(meeting.settings.isRunning)
						{
							if(params.desktop && params.desktop==1)
							{
								// screen sharing
								setTimeout(function(){
									if(!meeting.screenSharing.lock && !meeting.getIsDesktopSharingRunning())
									{
										meeting.screenSharing.ended=false;
										meeting.screenSharing.run();
									}
								},500);
							}
							else
							{
								if(meeting.getIsDesktopSharingRunning())
								{
									meeting.screenSharing.end();
								}
							}
						}
						//meeting.console.write('Info returned ['+params.desktop+']');
						meeting.infoTriggered=false;
					},true);
				}
			},5000);
		});
	}
	else
	{
		meeting.status.button(1);
		//meeting.console.write("Name is empty",2);
		meeting.core.error("meeting_no_name");
	}
}

meeting.end=function()
{
	meeting.status.participantsIcon();
	
	if(meeting.settings.conferenceType==0)
	{
		meeting.sip.end();
	}
	else if(meeting.settings.conferenceType==1)
	{
		meeting.screenSharing.end();
	}
	else if(meeting.settings.conferenceType==2)
	{
		meeting.screenSharing.end();
		meeting.sip.end();
	}
	if(meeting.infoInterval)
	{
		clearInterval(meeting.infoInterval);
	}
	meeting.status.ended();
	if(meeting.devel && meeting.devel.cycles && meeting.devel.cycles>0)
	{
		meeting.devel.vs_show();
	}
	
	if(meeting.settings.timeCounterInterval){clearInterval(meeting.settings.timeCounterInterval);}
	if(meeting.settings.inInfoLoop){clearInterval(meeting.settings.inInfoLoop);}meeting.settings.inInfoLoop=true;
	//$('#chat_text,#chat_send').attr('disabled','disabled').addClass('disabled');
	meeting.chat.disableInput();
	
	$('#loginBox').attr('class','prepared'); // change view of the window
	$('#meetingParticipantsContent').html('');
	$('#nameTR,#durationTR,#topMeetingControls').hide();
	$('#meetingBox,.meetingBottom').addClass('inactive end');
	if(meeting.settings.meetingStartedSuccessfully){$('#meetingBox').addClass('showChatArea');}
}
/*
meeting.showMikogoWarning=function()
{
	$('#logo,#meetingInputs').hide();
	$('#meetingWarning,#moreInfo').show();
	$('#continue').click(function(){
		if(!meeting.mikogoWarning)
		{
			meeting.mikogoWarning=true;
			$('#meetingWarning,#moreInfo').hide();
			$('#logo,#meetingInputs').show();
		}
	});
}
*/
meeting.onMeetingStart=function()
{
	$('#loginBox').attr('class','prepared'); // change view of the window
	
	meeting.infoLoop(true);
	
	if(meeting.settings.conferenceType==0)
	{
		meeting.sip.getReady(function(){	// try to start SIP applet
			meeting.console.write('SIP IS READY #1');
			meeting.status.meetingReady();
			$('#submitLogin').attr('ready',true);
		});
	}
	else if(meeting.settings.conferenceType==1)
	{
		meeting.mikogo.getReady(function(){	// try to start MIKOGO applet
			meeting.console.write('MIKOGO IS READY #1');
			meeting.status.meetingReady();
			$('#submitLogin').attr('ready',true);
		});
	}
	else if(meeting.settings.conferenceType==2)
	{
		meeting.sip.getReady(function(){	// try to start SIP applet
			meeting.console.write('SIP IS READY #2');
			meeting.status.meetingReady();
			$('#submitLogin').attr('ready',true);
		});
	}
}

meeting.infoLoop=function(status,callback)
{
	var callback=callback;
	if(!meeting.settings.inInfoLoop && status)
	{
		meeting.status.participantsIcon(true);
		meeting.settings.inInfoLoop=setInterval(function(){
			if(!meeting.settings.inInfoLoopStarted)
			{
				meeting.settings.inInfoLoopStarted=true;
				meeting.info(false,false,function(data){
					meeting.settings.inInfoLoopStarted=false;
					/**/
						
						/** hang up after 4s if meeting was ended */
						if(meeting.settings.params['desktop']==1 && (!meeting.settings.lastDesktopStatus || meeting.settings.lastDesktopStatus==0))
						{
							//console.error('ABC');
						}
						if(meeting.settings.params['desktop'])
						{
							meeting.settings.lastDesktopStatus=meeting.settings.params['desktop'];
						}
						
						/** hang up after 4s if meeting was ended */
						if(meeting.settings.params['started']==0 && !meeting.settings.ended)
						{
							meeting.settings.ended=true;
						}
						
						var parts=[];
						if(data.participants && trim(data.participants)!='')
						{
							data.participants=data.participants.split("\r\n");
							for(var ii=0; ii<data.participants.length; ii++)
							{
								if(data.participants[ii].replace(/&/,'').length<data.participants[ii].length)
								{
									var pp=data.participants[ii].split('&');
									var tmp = {};
									for(var i=0; i<pp.length; i++)
									{
										var s=pp[i].split('=');
										tmp[s[0]] = urldecode(s[1]);
										
										//meeting.console.dump(tmp);
									}
									parts.push(tmp);
								}
							}
						}
						
						data.participants=parts;
						
						//meeting.console.write('Number of participants: '+data.participants.length);
						
						var ret='';
						if(data.participants.length>0)
						{
							var users=[];
							for(var i=0; i<data.participants.length; i++)
							{
								if(!data.participants[i].name || data.participants[i].name==''){data.participants[i].name=data.participants[i].email;}
								if(data.participants[i].email.split('@')[0]=='undefined'){data.participants[i].email='undefined';}
								var userid=data.participants[i].participantid;
								if(!meeting.chat.isInChat(userid,data))
								{
									//meeting.console.write('PARTICIPANT ID [not in chat]: '+userid,1);
									//meeting.console.write('Participant detail: '+print_r(data.participants[i],true));
									meeting.chat.getColor(data.participants[i].name,userid); // register user in chat
									if(
										meeting.settings.notChatFirstRun &&
										(
											!data.participants[i].iscaller ||
											(
												data.participants[i].iscaller!='1' &&
												data.participants[i].iscaller!=1
											)
										)
									)
									{
										meeting.chat.sendMessage(data.participants[i].name,meeting.core.lang('meeting_user_joined_meeting',data.participants[i].name),userid,1,true);
									}
								}
								else
								{
									//meeting.console.write('Already in chat: '+userid);
								}
								users.push(userid);
								
								adminControls="<strong></strong>";
								additionalClasses=" admin";
								// Compiling participants list and finding yourself by using unique email identifier
								if(data.participants[i].email!=meeting.settings.email)
								{
									ret=ret+'<div class="participant'+additionalClasses+'" user_name="'+data.participants[i].name+'" user_id="'+userid+'" user_email="'+htmlspecialchars(data.participants[i].email)+'" title="'+htmlspecialchars(data.participants[i].email)+'">'+adminControls+'<span style="background-color:'+meeting.chat.getColor(data.participants[i].name,userid)+'"></span><b>'+data.participants[i].name+'</b></div>';
								}
								else
								{
									meeting.settings.caller=data.participants[i];
									meeting.status.serverMute(data.participants[i].ismuted==1)
								}
							}
							meeting.chat.getGone(users,function(user){
								//meeting.console.write('GONE: '+user.id,1);
								meeting.chat.sendMessage(user.name,meeting.core.lang('meeting_user_left_meeting',user.name+'<span class="notification hidden">/'+user.id+'</span>'),user.id,1,true);
								if(user.id==meeting.chat.whisperingTo())
								{
									meeting.chat.disableInput(true);
									meeting.chat.removeReplyIcons(user.id);
								}
							});
						}
						else
						{
							meeting.chat.getGone([],function(user){
								//meeting.console.write('GONE: '+user.id,1);
								meeting.chat.sendMessage(user.name,meeting.core.lang('meeting_user_left_meeting',user.name),user.id,1,true);
							});
						}
						
						$('#meetingParticipantsContent').html(ret);
						if(ret=='')
						{
							$('#meetingParticipantsHolder').show();
							$('#meetingParticipantsContent').hide();
						}
						else
						{
							$('#meetingParticipantsHolder').hide();
							$('#meetingParticipantsContent').show();
						}
						/** Handle click on meeting participant */
						if($('#whisperBox').data('user_id'))
						{
							$("#meetingParticipantsContent [user_id='"+$('#whisperBox').data('user_id')+"']").addClass('active');
						}
						
						
						$('#meetingParticipantsContent .participant').click(function(){
							var that=this;
							
							// deactive reply icons
							if(meeting.chat && meeting.chat.deactivateReplyIcons){meeting.chat.deactivateReplyIcons();}
							// enable input field
							meeting.chat.enableInput();
							
							if(!$("#whisperBox").data('visible') || $($("#whisperBox").data('visible')).attr('user_id')!=$(that).attr('user_id'))
							{
								$("#meetingParticipantsContent .participant").removeClass('active');
								
								$('#whisperBox .name').text($('b',that).text());
								$('#whisperBox').data('visible',that);
								$(that).addClass('active');
								$('#whisperBox').data('user_id',$(that).attr('user_id'));
								$('#whisperBox').data('user_email',$(that).attr('user_email'));
								$('#whisperBox').data('user_name',$(that).attr('user_name'));
								$('#whisperBox').attr('title',$(that).attr('user_name'));
								
								$('#whisperBox>div>div').attr('style','background-color:'+meeting.chat.getColor($(that).attr('user_name'),$(that).attr('user_id')));
								//$('#whisperBox>div>div .name,#whisperBox>div>div .close').attr('style','#fff');
								
								$('#whisperBox').removeClass('inactive');
								
								// active reply icons
								if(meeting.chat && meeting.chat.activateReplyIcons){meeting.chat.activateReplyIcons($(that).attr('user_id'))};
								//
								//$('#chat_text').animate({paddingTop:'13px',backgroundColor:"#FFFEEB"},500);
							}
							else
							{
								$('#whisperBox .close').click();
							}
							$('#chat_text').focus();
						});
						/** The mute button */
						$('#meetingParticipantsContent .participant strong').click(function(){
							meeting.sip.muteUser($(this).parent().attr('user_id'));
							return false;
						});
						/***/
					
					meeting.settings.notChatFirstRun=true;
					/**/
				},true);
			}
		},meeting.settings.infoLoopTimeout);
		
	}
	else if(meeting.settings.inInfoLoop && !status)
	{
		clearInterval(meeting.settings.inInfoLoop);
		meeting.status.participantsIcon(false);
	}
}

/*************************/
/*************************/