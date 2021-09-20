/*************************/
/**********CHAT*********/
/*************************/

meeting.chat={};

meeting.chat.init=function(){
	meeting.oConference.onsent(function(e){
		if(e.failed){
			// send message failed
			meeting.console.write("Message failed",2);
		}
		else
		{
			meeting.console.write("Message sent",1);
		}
	});
	meeting.oSIP.onmessage = function(e) {
		var usr=meeting.chat.getUser(e.from_id);
		if(usr.name){name=usr.name;}else{name=e.from_id;}
		
		if(e.group) // public message (to the whole group)
		{
			//console.log(from_id,e.content);
			//meeting.console.error("RECEIVE MESSAGE NOT IMPLEMENTED");
			meeting.chat.sendMessage(name,e.content,e.from_id,false,true);
		}
		else
		{// private message, only for me!
			meeting.chat.sendMessage(name,e.content,e.from_id,3,true);
			//meeting.console.error("RECEIVE WHISPER NOT IMPLEMENTED");
		}
	};
}

meeting.chat.colors=['#0088CC','#C35555','#8cc732','#966be2','#dcab4a','#aa6854','#bfc570','#998b7d','#b1579a','#56af77'];

meeting.chat.last_color=-1;
meeting.chat.users={};
meeting.chat.users_last={};
meeting.chat.lastMessageHash='';
meeting.chat.lastMessageTime=0;

meeting.chat.on=function()
{
	$('#loginWindow').hide();	// hide login
	$('#contentSpace').addClass('chat');
	$('#chatWindow').fadeIn();		// show chat window
	$('#chat_text,#chat_send').removeAttr('disabled','disabled').removeClass('disabled'); // clear the chat
	$('.statusTextBox').fadeOut('fast',function(){$('#chatTextBox').fadeIn();});
	
	$('#meetingBox,.meetingBottom').removeClass('inactive');
	
	$('#topBar').addClass('hidden');
}
meeting.chat.isInChat=function(userid)
{
	if(meeting.chat.users[meeting.core.md5(userid)])
	{
		return true;
	}
	//meeting.console.write("GET COLOR: User unknown ["+userid+"]");
	return false;
}

meeting.chat.getUser=function(userid)
{
	if(meeting.chat.users[meeting.core.md5(userid)])
	{
		return meeting.chat.users[meeting.core.md5(userid)];
	}
	return {};
}

meeting.chat.getColor=function(name,userid)
{
	if(meeting.chat.users[meeting.core.md5(userid)])
	{
		/* This is important to allow changing name of user*/
		meeting.chat.users[meeting.core.md5(userid)].name=name;
		/**/
		//meeting.console.write("GET COLOR: User known already ["+meeting.chat.users[meeting.core.md5(userid)].id+"]["+meeting.chat.users[meeting.core.md5(userid)].color+"]");
		return meeting.chat.users[meeting.core.md5(userid)].color;
	}
	else
	{
		color=meeting.chat.last_color+1;
		if(color>(meeting.chat.colors.length-1)){color=0;}
		meeting.chat.last_color=color;
		meeting.chat.users[meeting.core.md5(userid)]={color:meeting.chat.colors[color],id:userid,name:name};
		
		//meeting.console.write("GET COLOR: User unknown ["+meeting.chat.users[meeting.core.md5(userid)].id+"]["+meeting.chat.users[meeting.core.md5(userid)].color+"]");
		
		return meeting.chat.colors[color];
	}
}

meeting.chat.getTime=function(){
	return Math.floor(new Date().getTime() / 1000);
}

meeting.chat.isTimeInRange=function()
{
	return !((meeting.chat.getTime()-(5*60))>meeting.chat.lastMessageTime);
}

meeting.chat.getHash=function(id,whisper,type)
{
	return id+'|'+whisper+'|'+type;
}

meeting.chat.sendMessage=function(user,message,userid,type,do_not_send,system_note)
{
	if(!meeting.chat.users_last[userid]){meeting.chat.users_last[userid]=user;}
	if(meeting.chat.users_last[userid]!=user)
	{
		$('#chatWindow .'+userid).text(user);
	}
	
	var safe_message=meeting.core.nl2br(meeting.core.htmlspecialchars(message));
	var whisper_data={};
	var whisper=false;
	if($('#whisperBox').data('user_id') && $('#whisperBox').data('user_id')!='')
	{
		whisper_data={
			name:$('#whisperBox').data('user_name'),
			id:$('#whisperBox').data('user_id'),
			email:$('#whisperBox').data('user_email')
		};
		whisper=true;
	}
	
	meeting.console.write('CHAT: send message ['+safe_message+']');
	
	if(!type){type=0;}
	
	if(type==1)
	{
		if(system_note)
		{
			// System messages for debug purposes
			template='<div><span class="notification hidden">[#TIME#] #MESSAGE#</span></div>';
		}
		else
		{
			// System status messages (user left/joined meeting)
			//template='<div class="notification"><span>[#TIME#] #MESSAGE#</span></div>';
			template='<div class="meeting_chatMessageBox system"><div class="meeting_chatMessageTop"><span title="#TIME_EXACT#">#TIME# </span>#MESSAGE#</div></div>';
		}
	}
	else if(type==2)
	{
		// Sent message
		template='<div class="meeting_chatMessageBox me"><div class="meeting_chatMessageTop"><span title="#TIME_EXACT#">#TIME# </span><span class="me unprocessed username_highlight" color="#666">#ME#</span>#TO#</div><div class="meeting_chatMessageText">#MESSAGE#</div></div>';
	}
	else if(type==3)
	{
		// Received whispered message
		//template='<div><span style="color:#COLOR#">[#TIME#] <span class="meeting_whispered"></span> &lt;<span class="#ID#">#USER#</span>&gt;</span> #MESSAGE#</div>';
		template='<div class="meeting_chatMessageBox"><div class="meeting_chatMessageTop"><span title="#TIME_EXACT#">#TIME# </span><strong class="#ID# username_highlight unprocessed" color="#COLOR#" style="color:#COLOR#;" user_id="#ID#">#USER#</strong> &rArr; <strong class="me unprocessed username_highlight" color="#666">#ME#</strong></div><div class="meeting_chatMessageText">#MESSAGE#</div></div>';
	}
	else
	{
		// Received message
		template='<div class="meeting_chatMessageBox"><div class="meeting_chatMessageTop"><span title="#TIME_EXACT#">#TIME# </span><strong class="#ID# username_highlight unprocessed" color="#COLOR#" style="color:#COLOR#;" user_id="#ID#">#USER#</strong></div><div class="meeting_chatMessageText">#MESSAGE#</div></div>';
		//template='<div><span style="color:#COLOR#">[#TIME#] &lt;<span class="#ID#">#USER#</span>&gt;</span> #MESSAGE#</div>';
	}
	
	/** enhance */
	template=template
				.replace('#TIME#',meeting.core.date('H:i'))
				.replace('#TIME_EXACT#',meeting.core.date('d.m.Y H:i:s'));
	
	if(userid)
	{
		template=template.replace(/#COLOR#/gi,meeting.chat.getColor(user,userid));
	}
	if(whisper)
	{
		template=template.replace('#TO#'," &rArr; <strong class=\""+whisper_data.id+" username_highlight unprocessed\" color=\""+meeting.chat.getColor(whisper_data.name,whisper_data.id)+"\" style=\"color: "+meeting.chat.getColor(whisper_data.name,whisper_data.id)+"\" user_id=\""+whisper_data.id+"\">"+whisper_data.name+"</strong>");
	}
	else
	{
		template=template.replace('#TO#','');
	}
	
	template=template
					.replace(/#ME#/gi,$('#lang-login_screen-meeting_me').val())
					.replace(/#USER#/gi,htmlspecialchars(user))
					.replace(/#ID#/gi,htmlspecialchars(userid))
					.replace(/#MESSAGE#/gi,(type==1?message:safe_message));
	/** */
	
	if(!do_not_send)
	{
		if(whisper)
		{
			meeting.console.write("Whisper to \""+whisper_data.email+"\" ["+whisper_data.id+"]",1);
			/*meeting.sip.applet.sendMessageToParticipant(message,whisper_data.id);*/
			//meeting.console.error("WHISPER SEND FUNCTION NOT IMPLEMENTED YET");
			meeting.oConference.send('',message,whisper_data.id);
		}
		else
		{
			/*meeting.sip.applet.sendMessageToConference(message);*/
			meeting.oConference.send('',message);
			//meeting.console.error("SEND FUNCTION NOT IMPLEMENTED YET");
		}
	}
	
	var join=false;
	if(!system_note)
	{
		if(meeting.chat.lastMessageHash==meeting.chat.getHash(userid,(whisper_data.id?whisper_data.id:''),type) && meeting.chat.isTimeInRange())
		{
			join=true;
		}
		meeting.chat.lastMessageHash=meeting.chat.getHash(userid,(whisper_data.id?whisper_data.id:''),type);
		meeting.chat.lastMessageTime=meeting.chat.getTime();
	}
	
	if(!join)
	{
		$('#chatWindow').append(template);
	}
	else
	{
		$('#chatWindow .meeting_chatMessageBox:last .meeting_chatMessageText').append('<br />'+safe_message);
	}
	$('#chatWindow').scrollTop($('#chatWindow').prop('scrollHeight'));
	
	meeting.chat.activateMessagesForReply();
;
}

meeting.chat.activateMessagesForReply=function()
{
	$('.meeting_chatMessageTop .me').click(function(){
		$('#whisperBox .close').click();
	});
	
	$('.meeting_chatMessageReplyInner.unprocessed').click(function(){
		$('#meetingParticipantsContent .participant[user_id="'+$(this).attr('user_id')+'"]').click();
		//$(this).removeClass('unprocessed');
	});
	$('.meeting_chatMessageTop .unprocessed').mouseover(function(){
		$(this).css('background-color',$(this).attr('color'));
		$(this).css('color',"#fff");
	});
	$('.meeting_chatMessageTop .unprocessed').mouseout(function(){
		$(this).css('color',$(this).attr('color'));
		$(this).css('background-color','transparent');
	});
	$('.meeting_chatMessageTop .unprocessed').click(function(){
		if(meeting.chat.whisperingTo()!=$(this).attr('user_id')){
			$('#meetingParticipantsContent .participant[user_id="'+$(this).attr('user_id')+'"]').click();
		}
		$(this).removeClass('unprocessed');
	});
	meeting.chat.activateReplyIcons($('#whisperBox').data('user_id'));
}

meeting.chat.activateReplyIcons=function(userid)
{
	$('#contentSpace .meeting_chatMessageReplyInner[user_id="'+userid+'"]').addClass('active');
}

meeting.chat.deactivateReplyIcons=function()
{
	$('#contentSpace .meeting_chatMessageReplyInner.active').removeClass('active');
}

meeting.chat.getGone=function(users,callback)
{
	//meeting.console.write('JOIN: ['+users.join(' / ')+']',1);
	for(var key in meeting.chat.users)
	{
		if(meeting.settings.caller)
		{
			//alert(meeting.settings.caller.participantid);
			if(meeting.chat.users[key].id!=meeting.settings.caller.participantid && meeting.chat.users[key].id!="system")
			{
				//meeting.console.write('TEST: ['+meeting.chat.users[key].id+']',1);
				if(!meeting.core.in_array(meeting.chat.users[key].id,users))
				{
					if(!meeting.chat.users[key].gone)
					{
						//meeting.console.write('GONE: ['+meeting.chat.users[key].id+']',1);
						meeting.chat.users[key].gone=true;
						callback(meeting.chat.users[key]); // ODKOMENTOVAT PRO INFORMOVANI O OPUSTENI MEETINGU, JE POTREBA ZNAT VLASTNI ID PRO ODSTRANENI CHYBY KDY U SENDMESSAGE POSILAM USERNAME A NE ID
					}
				}
			}
		}
	}
}

meeting.chat.whisperingTo=function()
{
	if($('#whisperBox').data('user_id') && $('#whisperBox').data('user_id')!='')
	{
		return $('#whisperBox').data('user_id');
	}
	else
	{
		return false;
	}
}

meeting.chat.removeReplyIcons=function(user_id)
{
	$($("#chatWindow .meeting_chatMessageReplyInner[user_id='"+user_id+"']").parent()).hide();
}

meeting.chat.disableInput=function(whisperWarning)
{
	$('#chat_text,#chat_send').attr('disabled','disabled').addClass('disabled');
	$('#chatTextBox').addClass('disabled');
	if(whisperWarning)
	{
		$('#chatTextBox').addClass('whisperingDisabled');
		$('#whisperBox>div>div').removeAttr('style');
	}
}

meeting.chat.enableInput=function()
{
	$('#chat_text,#chat_send').removeAttr('disabled','disabled').removeClass('disabled');
	$('#chatTextBox').removeClass('disabled');
	$('#chatTextBox').removeClass('whisperingDisabled');
	$('#chat_text').focus();
}