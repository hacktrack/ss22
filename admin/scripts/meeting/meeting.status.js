/*************************/
/**********STATUS*********/
/*************************/
meeting.status={};
meeting.status.blink_interval1=false;
meeting.status.blink_interval2=false;

meeting.status.mikogoEnded=function()
{
	meeting.core.message('lang-login_screen-meeting_mikogo_ended');
}

meeting.status.ended=function()
{
	meeting.status.text();
	$('#meetingStatus').attr('class','');
	meeting.status.button(0);
	meeting.core.message('lang-login_screen-meeting_ended');
	$('#meetingStatusControll').fadeOut();
}
meeting.status.running=function()
{
	meeting.status.text('lang-login_screen-meeting_in_progress');
	$('#meetingStatus').attr('class','running');
	$('#errors .info').show();
	meeting.status.button(2);
	$('#meetingStatusControll').fadeIn();
	//meeting.core.message('lang-login_screen-meeting_connected');
	meeting.core.info(true);
	meeting.chat.on();
}
meeting.status.readyMikogo=function()
{
	meeting.status.text('lang-login_screen-meeting_mikogo_ready');
	$('#meetingStatus').attr('class','');
}
meeting.status.steady=function()
{
	meeting.status.text();
	$('#meetingStatus').attr('class','');
}
meeting.status.loading=function()
{
	$('#meetingStatus').attr('class','');
	$('#meetingStatus').addClass('loading');
	meeting.status.text('lang-login_screen-meeting_loading_meeting_info');
	meeting.core.message('lang-login_screen-meeting_connecting');
}

meeting.status.blink=function(status)
{
	if(status)
	{
		if(!meeting.status.blink_interval1)
		{
			meeting.status.blink_interval1=setInterval(function(){
				$('#meetingStatusText').fadeOut(1000,function(){
					$('#meetingStatusText').fadeIn(1000);
				});
			},3000);
		}
	}
	else
	{
		if(meeting.status.blink_interval1){clearInterval(meeting.status.blink_interval1);}
	}
}

meeting.status.ok=function()
{
	
}
meeting.status.waiting=function()
{
	//$('#meetingStatus').addClass('loading');
	$('#meetingStatus').attr('class','');
	meeting.status.text('lang-login_screen-meeting_waiting',meeting.settings.params['createdby'],false,true,true);
}

meeting.status.loadingSIP=function()
{
	$('#meetingStatus').attr('class','');
	$('#meetingStatus').addClass('loading');
	meeting.status.text('lang-login_screen-meeting_loading_meeting_info');
}

meeting.status.readySIP=function()
{
	//meeting.status.button(true);
	$('#meetingStatus').attr('class','');
	meeting.status.text();
	//meeting.core.message('lang-login_screen-meeting_you_can_join',meeting.settings.params['createdby']);
	//meeting.status.text('lang-login_screen-meeting_created_by_ready',meeting.settings.params['createdby']);
	meeting.status.text('lang-login_screen-meeting_sip_ready');
}

meeting.status.loadingSIP=function()
{
	$('#meetingStatus').attr('class','');
	$('#meetingStatus').addClass('loading');
	meeting.status.text('lang-login_screen-meeting_loading_meeting_info');
}

meeting.status.waitingSIP=function()
{
	$('#meetingStatus').attr('class','');
	$('#meetingStatus').addClass('loading');
	meeting.status.text('lang-login_screen-meeting_waiting_for_reply');
}

meeting.status.startingSIP=function()
{
	$('#meetingStatus').attr('class','');
	$('#meetingStatus').addClass('loading');
	meeting.status.text('lang-login_screen-meeting_starting_sip');
}
meeting.status.preparingSIP=function()
{
	$('#meetingStatus').attr('class','');
	$('#meetingStatus').addClass('loading');
	meeting.status.text('lang-login_screen-meeting_preparing_sip');
}
meeting.status.ITTryingAgainSIP=function(timeout)
{
	$('#meetingStatus').attr('class','');
	$('#meetingStatus').addClass('loading');
	meeting.status.text('lang-login_screen-meeting_timeout_trying_again_in',timeout);
}

meeting.status.tryingAgain=function(timeout)
{
	$('#meetingStatus').attr('class','');
	$('#meetingStatus').addClass('loading');
	meeting.status.text('lang-login_screen-meeting_trying_again_in',timeout,true);
}

meeting.status.meetingReady=function()
{
	$('#meetingStatus').attr('class','');
	meeting.status.text();
	meeting.core.message('lang-login_screen-meeting_you_can_join',meeting.settings.params['createdby']);
	meeting.status.text('lang-login_screen-meeting_created_by_ready',meeting.settings.params['createdby']);
	meeting.status.infoBox();
}

meeting.status.getString=function(code)
{
	if(!code){code='';}
	var text=code;
	if(code!='' && document.getElementById(code))
	{
		text=document.getElementById(code).value;
	}
	return text;
}

meeting.status.text=function(code,additional,donotdebug,bigger,blink)
{
	var text=meeting.status.getString(code);
	
	if(additional){text=text.replace(/%s/g,additional);}
	
	if(!donotdebug)
	{
		meeting.console.write('[STATUS]: '+text+" ["+code+"]");
	}
	
	if(bigger)
	{
		$('#meetingStatusText').addClass('bigger');
	}
	else
	{
		$('#meetingStatusText').removeClass('bigger');
	}
	
	$('#meetingStatusText').text(text);
	
	if(!blink)
	{
		if(meeting.devel && meeting.devel.vs_show){meeting.devel.vs_show(true);}
		meeting.status.blink(false);
	}
	else
	{
		meeting.status.blink(true);
	}
}
meeting.status.button=function(status)
{
	if(!status)
	{
		$('#submitLogin').attr('class','disabled');
		$('#submitLogin').attr('disabled','disabled');
		$('#submitLogin').val(meeting.status.getString('lang-login_screen-join_meeting'));
	}
	else if(status==1 || status==true)
	{
		$('#submitLogin').attr('class','');
		$('#submitLogin').removeAttr('disabled');
		$('#submitLogin').val(meeting.status.getString('lang-login_screen-join_meeting'));
	}
	else if(status==2)
	{
		$('#submitLogin').attr('class','running');
		$('#submitLogin').removeAttr('disabled');
		$('#submitLogin').val(meeting.status.getString('lang-login_screen-meeting_hang_up'));
	}
}

meeting.status.info=function(type,show,error)
{
	if(error){
		$('#meetingErrorInfo').addClass('error');
	}
	else
	{
		$('#meetingErrorInfo').removeClass('error');
	}
	$('.meeting_info').hide();
	if(type)
	{
		meeting.status.infoIcon(true);
		$('.meetingInfo_'+type).show();
	}
	else
	{
		meeting.status.infoIcon(false);
	}
	if(show){meeting.status.infoBox(true);}
	else
	{
		if(!$('#iconBox').data('used'))
		{
			meeting.status.infoBox(false);
		}
	}
}

meeting.status.infoBox=function(show)
{
	if(show)
	{
		$('#meetingErrorInfo').show();
	}
	else
	{
		$('#meetingErrorInfo').hide();
		$('#infoButton').data('used',false);
	}
}

meeting.status.participantsBox=function(show)
{
	if(show)
	{
		$('#meetingParticipantsInnerBox').show();
	}
	else
	{
		$('#meetingParticipantsInnerBox').hide();
	}
}

meeting.status.participantsIcon=function(status)
{
	if(status)
	{
		$('#participantsIconBox').fadeIn();
		meeting.status.participantsBox(true);
	}
	else
	{
		$('#participantsIconBox').fadeOut();
		meeting.status.participantsBox();
	}
}

meeting.status.infoIcon=function(status)
{
	if(status)
	{
		$('#meetingErrorInfoBox,#infoButton').fadeIn();
	}
	else
	{
		$('#meetingErrorInfoBox,#infoButton').fadeOut();
	}
}


/*************************/
/*************************/