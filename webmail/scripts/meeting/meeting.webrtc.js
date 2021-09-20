var meeting={};

/** SETTINGS */
meeting.settings={};
meeting.settings.timeout=30000; //timeout of wait command in miliseconds
meeting.settings.debug=1; //debug mode [0,1,2] // 0 - no debug, 1 - firebug only, 2 - inner console and firebug, 3 - outer console only, 4 - All
meeting.settings.hashParams={};
meeting.settings.conferenceType=0; // [-,1,0,1,2] // -1 - do nothing , 0 - SIP only, 1 - Mikogo only, 2 - Mikogo and SIP
meeting.settings.goPressed=false;
meeting.settings.isMikogoRunning=false;
meeting.settings.infoLoopTimeout=3000;
meeting.settings.timeCounter=-3600;
meeting.settings.anonymousUserPrefix='Anonymous';

/********************************************/
/******************** RUN *******************/
/********************************************/

$(document).ready(function(){
	/** ******** */
	/** ACTIVATE */
	/** ******** */

	if(document.location.protocol=='http:') {
		// If connection is not secure, redirect to secure domain
		document.location.href = document.location.href.replace('http:','https:');
		return false;
	} else if(!IceSIP || !IceSIP.supported()) {
		// If there is no WebRTC support, redirect to help page
		meeting.core.error("meeting_no_webrtc_support");
		meeting.status.text('lang-login_screen-meeting_redirecting_to_help_page');
		setTimeout(function(){
			document.location.href = 'https://www.icewarp.com/support/troubleshoot_webrtc/?ishttps='+(location.protocol.indexOf("https")===0?'1':'0')+'&lang='+document.documentElement.lang
		},5000);
		return false;
	}

	// Raise warning on before unload
	$(window).bind('beforeunload', function(e) {
		return $('#lang-login_screen-meeting_hang_up_confirmation').val();
	});
	
	// Set anonymous nick and email
	var tmp_name=meeting.settings.anonymousUserPrefix+'_'+Math.round(Math.random()*10000);
	var tmp_email=tmp_name+'@anonymous.com';
	$('#inputUsername').attr('anonymous',tmp_name);
	$('#inputEmail').val(tmp_email);
	
	// activate info button
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
	
	// Language choise
	var elm = document.getElementsByName('languageOptions')[0];
	var lang = document.documentElement.lang || 'en';
	lang = ({sv:'se',dn:'dk',ko:'kr',ja:'jp'})[lang] || lang;	// Convert ISO codes to IW codes
	for(var i=0; i<elm.options.length; i++)
		if(elm.options[i].value==lang) {
			elm.selectedIndex = i;
			break;
		}
	elm.onchange = function(e) {
		var url = document.location.href;
		var lang = this.options[this.selectedIndex].value;
		if(url.indexOf('language')!=-1)
			url = url.replace(/language=[a-z]{2}/,'language='+lang);
		else
			url += '&language='+lang;
		$(window).unbind('beforeunload');
		document.location.href = url;
	}

	// activate participants box
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
	
	// activate hangup button
	$('#hangupButton').click(function(){
		if(confirm($('#lang-login_screen-meeting_hang_up_confirmation').val()))
		{
			meeting.status.button(false);
			meeting.end();								// end meeting on button click if it's not disabled
		}
	});
	
	// activate login button
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
	
	// activate chat send button
	$('#chat_send').click(function(){
		if(meeting.core.trim($('#chat_text').val())!='')
		{
			meeting.chat.sendMessage(meeting.settings.nick,$('#chat_text').val(),false,2);
		}
		$('#chat_text').val('').focus();
	});
	
	// activate keydown listener on chat input field
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
	
	// activate mute button
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
	
	/** ***************** */
	/** ***************** */
	/** ***************** */
	
	$('#inputUsername').focus();							// focus username field
	meeting.settings.hashParams=meeting.core.hashHandler();	// parse hash parameter into variables
	meeting.core.constructor($('body').attr('meetingID'));	// run meeting constructor
	meeting.prepare();										// prepare meeting, check if it's running
});