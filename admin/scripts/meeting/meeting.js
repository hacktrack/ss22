var meeting={};

/** SETTINGS */
meeting.settings={};
meeting.settings.timeout=30000; //timeout of wait command in miliseconds
meeting.settings.debug=0 //debug mode [0,1,2] // 0 - no debug, 1 - firebug only, 2 - inner console and firebug, 3 - outer console only, 4 - All
meeting.settings.hashParams={};
meeting.settings.conferenceType=0; // [-,1,0,1,2] // -1 - do nothing , 0 - SIP only, 1 - Mikogo only, 2 - Mikogo and SIP
meeting.settings.goPressed=false;
meeting.settings.isMikogoRunning=false;
meeting.settings.infoLoopTimeout=3000;
meeting.settings.timeCounter=-3600;
meeting.settings.anonymousUserPrefix='Anonymous';

/*************************/
/**********DEVEL*********/
/*************************/
meeting.devel={};
meeting.devel.cycles=0;

meeting.devel.vs_show=function(hide)
{
	if(meeting.devel.vs_visible || hide)
	{
		meeting.devel.vs_visible=false;
		$('#videostop').fadeOut();
		if(meeting.devel.cycles>0)
		{
			clearInterval(meeting.devel.vs_interval);
		}
	}
	else
	{
		meeting.devel.vs_visible=true;
		$('#videostop').fadeIn();
		if(meeting.devel.cycles>0)
		{
			meeting.devel.vs_go();
		}
	}
}

meeting.devel.vs_go=function()
{
	var time=600;
	var score=0;
	$('#videostop .kostka').removeClass('good');
	$('#videostop .kostka').removeClass('bad');
	if($('#videostop_score').data('score')){score=$('#videostop_score').data('score');}
	meeting.devel.cycles++;
	time=time-(score*20);
	if(time<300){time=200;}
	meeting.devel.vs_interval=setInterval(function(){
		$('#videostop_stop').removeAttr('disabled');
		var num=Math.floor(Math.random()*6)+1;
		var num2=Math.floor(Math.random()*6)+1;
		$('#videostop_stop').data('one',num);
		$('#videostop_stop').data('two',num2);
		
		$('#videostop_one').text(num);
		$('#videostop_two').text(num2);
	},time);
}

meeting.devel.vs_stop=function()
{
	$('#videostop_stop').attr('disabled','disabled');
	clearInterval(meeting.devel.vs_interval);
	var score=0;
	if($('#videostop_score').data('score'))
	{
		var score=$('#videostop_score').data('score');
	}
	
	if($('#videostop_stop').data('one') && $('#videostop_stop').data('two'))
	{
		if($('#videostop_stop').data('one')==$('#videostop_stop').data('two'))
		{
			$('#videostop .kostka').addClass('good');
			score++;
		}
		else
		{
			$('#videostop .kostka').addClass('bad');
			score--;
		}
		$('#videostop_score').data('score',score);
		$('#videostop_score').text(score);
	}
	
	setTimeout(function(){
		meeting.devel.vs_go();
	},1000);
}

meeting.devel.vs=function()
{
	$('#videostop_stop').removeAttr('disabled');
	$('#videostop_stop').mousedown(function(){
		if($('#videostop_stop').attr('disabled')!='disabled')
		{
			if($(this).data('running'))
			{
				meeting.devel.vs_stop();
			}
			else
			{
				meeting.devel.vs_go();
				$(this).data('running',true);
				$(this).val($(this).attr('alt'));
			}
		}
	});
	$('#meetingStatusText').click(function(){
		if($(this).hasClass('bigger'))
		{
			meeting.status.blink(false);
			meeting.devel.vs_show();
		}
	});
}

meeting.devel.login=function(email,password,callback)
{
	$.post('/wcs/','<body xmlns="http://icewarp.com/groupware-api" rid="1234" ><iq type="request"><command>loginuser</command><params><param>'+email+'</param><param>'+password+'</param></params></iq></body>',function(data){
		data=str2xml2arr(data);
		var sid=data['BODY'][0]['IQ'][0]['VALUE'][0]['VALUE'];
		callback(sid);
	})
}
meeting.devel.start=function(){
	meeting.devel.login('admin@demo.com','admin+',function(sid){
		meeting.console.write('SID retrieved ['+sid+']',1);
		meeting.settings.sid=sid;
	});
}
/*************************/
/*************************/


/*************************/
/**********MAIN*********/
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
	var time='00:00:00';
	time=meeting.core.date("H:i:s",meeting.settings.timeCounter);
	meeting.settings.timeCounter++;
	$('#meetingCounter').text(time);
}

meeting.info=function(callback,waitCallback,dataReturnedCallback,doNotChangeStatus)
{
	theCallId='';
	
	try
	{
		if(meeting.sip.applet && meeting.sip.applet){theCallId=meeting.sip.applet.getCallId();}
	}
	catch(e)
	{
		//meeting.console.write('UNEXPECTED JAVA ERROR in get meeting info');
		//meeting.core.error('meeting_get_meeting_info_error','',e);
	}
	
	var meetingInfoQuery='<body xmlns="http://icewarp.com/groupware-api" ><iq type="request"><command>getmeetinginfo</command><params><param>'+meeting.settings.nick+'</param><param>'+meeting.settings.id+'@'+location.host+'</param><param>1</param><param>'+theCallId+'</param></params></iq></body>';
	
	//meeting.console.write(meetingInfoQuery);
	
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
				//meeting.console.write(data['BODY'][0]['IQ'][0]['VALUE'][0]['VALUE']);
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
		
			if(meeting.settings.conferenceType==0)
			{
				meeting.sip.go(meeting.settings.params.information_sip);
			}
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
					//[urldecode(meeting.settings.params.appletparams.download_url), urldecode(meeting.settings.params.appletparams.download_dir), urldecode(meeting.settings.params.appletparams.file_name), meeting.settings.params.appletparams.sessionKey, meeting.settings.nick, "\"\"", "\"\""/*, "Join", "1.0d"*/]
				);
			}
			
			
			meeting.infoInterval=setInterval(function(){
				if(!meeting.infoTriggered)
				{
					meeting.infoTriggered=true;
					meeting.info(false,false,function(params){
						if(params.desktop && params.desktop==1 && meeting.sip.sipLoaded)
						{
							if(!meeting.isMikogoRunning)
							{
								//meeting.sip.go(false,[urldecode(meeting.settings.params.appletparams.download_url), urldecode(meeting.settings.params.appletparams.download_dir), urldecode(meeting.settings.params.appletparams.file_name), meeting.settings.params.appletparams.sessionKey, meeting.settings.nick, "\"\"", "\"\""/*, "Join", "1.0d"*/],true);
								
								meeting.mikogo.go(
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
										[meeting.settings.params.appletparams.sessionKey, meeting.settings.nick, "\"\"", "\"\"","Join"]
									]
									//[urldecode(meeting.settings.params.appletparams.download_url), urldecode(meeting.settings.params.appletparams.download_dir), urldecode(meeting.settings.params.appletparams.file_name), meeting.settings.params.appletparams.sessionKey, meeting.settings.nick, "\"\"", "\"\""/*, "Join", "1.0d"*/]
								);
								
								meeting.isMikogoRunning=true;
							}
						}
						else
						{
							if(meeting.isMikogoRunning)
							{
								meeting.mikogo.end();
								meeting.isMikogoRunning=false;
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
		meeting.mikogo.end();
	}
	else if(meeting.settings.conferenceType==2)
	{
		meeting.mikogo.end();
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
						if(meeting.settings.params['started']==0 && !meeting.settings.ended)
						{
							meeting.settings.ended=true;
							//setTimeout(function(){meeting.end();},4000);
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
										
										meeting.console.dump(tmp);
										//parts.push(pp[i].split('='));
									}
									parts.push(tmp);
								}
							}
						}
						
						data.participants=parts;
						
						//meeting.console.write('PARTICIPANTS PART');
						//meeting.console.dump(data.participants);
						
						meeting.console.write('Number of participants: '+data.participants.length);
						
						var ret='';
						if(data.participants.length>0)
						{
							var users=[];
							for(var i=0; i<data.participants.length; i++)
							{
								if(!data.participants[i].name || data.participants[i].name==''){data.participants[i].name=data.participants[i].email;}
								if(data.participants[i].email.split('@')[0]=='undefined'){data.participants[i].email='undefined';}
								var userid=data.participants[i].participantid;
								if(!meeting.chat.isInChat(userid,data/*.participants[i].name*/))
								{
									meeting.console.write('PARTICIPANT ID [not in chat]: '+userid,1);
									meeting.console.write('Participant detail: '+print_r(data.participants[i],true));
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
									meeting.console.write('Already in chat: '+userid);
								}
								users.push(userid);
								
								adminControls="<strong></strong>";
								additionalClasses=" admin";
								
								if(
									!data.participants[i].iscaller ||
									typeof data.participants[i].iscaller == "undefined" ||
											(
												data.participants[i].iscaller!='1' &&
												data.participants[i].iscaller!=1
											))
								{
									//if(meeting.settings.notChatFirstRun){alert(print_r(data.participants[i],true));}
									ret=ret+'<div class="participant'+additionalClasses+'" user_name="'+data.participants[i].name+'" user_id="'+userid+'" user_email="'+htmlspecialchars(data.participants[i].email)+'" title="'+htmlspecialchars(data.participants[i].email)+'">'+adminControls+'<span style="background-color:'+meeting.chat.getColor(data.participants[i].name,userid)+'"></span><b>'+data.participants[i].name+'</b></div>';
								}
								else
								{
									meeting.settings.caller=data.participants[i];
									/*
									ret=ret+'<div class="participant'+additionalClasses+'" title="'+htmlspecialchars(data.participants[i].email)+'">'+adminControls+'<span style="background-color:'+meeting.chat.getColor(data.participants[i].name,userid)+'"></span>[ME] <small>'+data.participants[i].name+'</small></div>';
									*/
								}
							}
							meeting.chat.getGone(users,function(user){
								meeting.console.write('GONE: '+user.id,1);
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
								meeting.console.write('GONE: '+user.id,1);
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

meeting.prepare=function(callback)
{
	meeting.console.write("Nick name processed #2",1);
	var nick=meeting.getNick(); // get user's nick, but not necessary yet
	var email=$('#inputEmail').val();							// get user's email
	meeting.settings.nick=nick; 		// set user's nick to settings
	if(trim(email)==''){email='noreply@_none_.com';}
	meeting.settings.email=email;								// set user's email to settings
	meeting.core.ok();					// clear error and message line
	
	meeting.status.loading();			// show loading status
	
	meeting.info(function(){ // meeting started callback
	
		meeting.status.info('info');
	
		if(meeting.settings.params.desktop && meeting.settings.params.desktop=='1')
		{
			meeting.settings.conferenceType=2;
		}
		
		$('#meetingNumber,.meetingNumber').html(meeting.settings.params.information_sip);
		if(document.getElementById('mikogoID')) // if mikogoID id is detected, unsupported device present. Do not run applets
		{
			meeting.settings.conferenceType=-1;
		}
		
		if(meeting.settings.params.appletparams.sessionKey)
		{
			$('#mikogoID,.mikogoID').text(meeting.settings.params.appletparams.sessionKey.substr(0,3)+'-'+meeting.settings.params.appletparams.sessionKey.substr(3,3)+'-'+meeting.settings.params.appletparams.sessionKey.substr(6,3));
		}
		
		if(document.getElementById('os') && document.getElementById('os').value=='mac'){meeting.settings.conferenceType=0;} // if macOS, do not run mikogo
		
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
	/** ******************************************/
		if(document.getElementById('os') && document.getElementById('os').value=='mac' && meeting.settings.params.desktop=='1' && !meeting.mikogoWarning)
		{
			meeting.showMikogoWarning();
			$('#continue').click(function(){fn();});
		}
		else
		{
			fn();
		}
		
	},function(){ // wait callback
		meeting.console.write('WAIT CALLBACK #1');
		meeting.onMeetingStart();
	});
}


/*************************/
/*************************/


/********************************************/
/******************** RUN *******************/
/********************************************/

$(document).ready(function(){
	
	$(window).bind('beforeunload', function(e) {
		return $('#lang-login_screen-meeting_hang_up_confirmation').val();
	});
	
	var tmp_name=meeting.settings.anonymousUserPrefix+'_'+Math.round(Math.random()*10000);
	var tmp_email=tmp_name+'@anonymous.com';
	$('#inputUsername').attr('anonymous',tmp_name);
	$('#inputEmail').val(tmp_email);
	
	//if(document.getElementById('mikogoID')){meeting.settings.conferenceType=-1;} // if mikogoID id is detected, unsupported device present. Do not run applets
	//if(document.getElementById('os') && document.getElementById('os').value=='mac'){meeting.settings.conferenceType=0;} // if macOS, do not run mikogo
	$('#infoButton').click(function(){
		if($(this).data('used'))
		{
			meeting.status.infoBox();
			$(this).data('used',false);
		}
		else
		{
			meeting.status.infoBox(true);
			$(this).data('used',true);
		}
		return false;
	});
	$('#participantsIconBox').click(function(){
		if(!$(this).data('used'))
		{
			meeting.status.participantsBox();
			$(this).data('used',true);
		}
		else
		{
			meeting.status.participantsBox(true);
			$(this).data('used',false);
		}
	});
	meeting.core.constructor($('body').attr('meetingID'));	// run meeting constructor
	meeting.prepare();										// prepare meeting, check if it's running
	$('#inputUsername').focus();							// focus username field
	$('#hangupButton').click(function(){
		if(confirm($('#lang-login_screen-meeting_hang_up_confirmation').val()))
		{
			meeting.status.button(false);
			meeting.end();								// end meeting on button click if it's not disabled
		}
	});
	$('#submitLogin').click(function(){
		if(!$(this).is('disabled') && $(this).attr('ready'))
		{
			if(!$(this).hasClass('running'))
			{
				meeting.console.write("Nick name processed #4",1);
				var nick=meeting.getNick();
				var email=$('#inputEmail').val();
				meeting.settings.nick=nick; 
				if(trim(email)==''){email='noreply@_none_.com';}
				meeting.settings.email=email;								// set user's email to settings
				
				$('#meetingTitle').text(meeting.settings.nick);
				
				meeting.sip.onload(true);
				meeting.status.button(false);
				meeting.run();								// start meeting on button click if it's not disabled
			}
			else
			{
				meeting.status.button(false);
				meeting.end();								// end meeting on button click if it's not disabled
			}
		}
		else if(!$(this).attr('ready'))
		{
			var nick=meeting.getNick();							// get user's nick
			var email=$('#inputEmail').val();							// get user's email
			meeting.settings.nick=nick;									// set user's nick to settings
			if(trim(email)==''){email='@_none_.com';}
			meeting.settings.email=email;								// set user's email to settings
			if(trim(nick)!='')											// check if user's nick is not empty
			{
				meeting.settings.goPressed=true;
				meeting.status.button(0);
			}
			else
			{
				meeting.console.write("Name is empty",2);
				meeting.core.error("meeting_no_name");
			}
		}
		return false;
	});
	
	$('#chat_send').click(function(){
		if(meeting.core.trim($('#chat_text').val())!='')
		{
			meeting.chat.sendMessage(meeting.settings.nick,$('#chat_text').val(),false,2);
		}
		$('#chat_text').val('').focus();
	});
	$('#chat_text').keydown(function(e){
		//alert(print_r(e,true));
		//alert(e.keyCode);
		if(e.keyCode == 13)
		{
			$('#chat_send').click();
			return false;
		}
		else if(e.keyCode == 27)
		{
			$('#chat_text').val('');
			return false;
		}
	});
	$('#muteButton').click(function(){
		if($(this).data('muted'))
		{
			$(this).removeClass('buttonRed');
			$(this).addClass('buttonLight');
			meeting.sip.mute(false);
			$(this).data('muted',false);
		}
		else
		{
			$(this).addClass('buttonRed');
			$(this).removeClass('buttonLight');
			meeting.sip.mute(true);
			$(this).data('muted',true);
		}
	});
	
	
	/** Handle whisper close button */
	$('#whisperBox .close').click(function(){
		
		//$('#meetingParticipantsContent .participant[user_id="'+$('#whisperBox').data('user_id')+'"]').click();
		meeting.console.write("Turn off whispering to \""+$('#whisperBox').data('user_email')+"\" ["+$('#whisperBox').data('user_id')+"]");
		
		meeting.chat.deactivateReplyIcons();
		
		$("#meetingParticipantsContent .participant").removeClass('active');
		$('#whisperBox').data('visible',false);
		$('#whisperBox').addClass('inactive');
		$('#chat_text').focus();
		$('#whisperBox').data('user_id','');
		$('#whisperBox').data('user_email','');
		$('#whisperBox').data('user_name','');
		
		meeting.chat.enableInput();
	});
	/***/
	
	if(meeting.devel.vs){meeting.devel.vs();}
});