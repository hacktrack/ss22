/*************************/
/**********CONSOLE*********/
/*************************/
meeting.console={};

//if(debug){debug.focus=false;}

meeting.console.dump=function(variable)
{
	//if(debug){debug.focus=false;}
	
	if(meeting.settings.debug>2)
	{
		if(debug){debug.dump(variable);}
	}
}
meeting.console.write=function(text,type)
{
	//if(debug){debug.focus=false;}
	
	var currentTime = new Date()
	var hour = currentTime.getHours();
	var minute = currentTime.getMinutes();
	var second = currentTime.getSeconds();
	
	text='['+hour+':'+minute+':'+second+'] '+text;
	
	var c='';
	var dtext=text;
	if(type==1)
	{
		c='message';
		if(meeting.settings.debug==1 || meeting.settings.debug==2 || meeting.settings.debug==4)
		{
			if(typeof console!='undefined' && console.info){console.info(dtext);}
		}
		if(meeting.settings.debug>2)
		{
			if(debug){debug.note(dtext);}
		}
	}
	else if(type==2)
	{
		if(meeting.settings.debug==1 || meeting.settings.debug==2 || meeting.settings.debug==4)
		{
			if(typeof console!='undefined' && console.error){console.error(dtext);}
		}
		if(meeting.settings.debug>2)
		{
			if(debug){debug.note(dtext);}
		}
		c='error';
	}
	else
	{
		if(meeting.settings.debug==1 || meeting.settings.debug==2 || meeting.settings.debug==4)
		{
			if(typeof console!='undefined' && console.log){console.log(dtext);}
		}
		if(meeting.settings.debug>2)
		{
			if(debug){debug.note(dtext);}
		}
	}
	text='<div class="'+c+'">'+htmlspecialchars(text)+'</div>';
	if(meeting.settings.debug==2 || meeting.settings.debug==4)
	{
		$('#debugConsole').append(text);
	}
}
/*************************/
/*************************/