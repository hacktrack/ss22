/*************************/
/**********screenSharing*********/
/*************************/
meeting.screenSharing={};
meeting.screenSharing.onEndCallback=function(){};

meeting.screenSharing.getReady=function(callback)
{

}

meeting.screenSharing.wait=function()
{

}

meeting.screenSharing.show=function(fast)
{
	
	if(fast)
	{
		$('#videoBox').stop(true,true)
		$('#videoBox').show();
		$('#chatWindow').addClass('smaller');
	}
	else
	{
		if(meeting.screenSharing.hideVideoAnimation){
			$(meeting.screenSharing.hideVideoAnimation).abort();
		}
		$('#videoBox').slideDown(500,function(){
			$('#chatWindow').addClass('smaller');
		});
	}
}

meeting.screenSharing.hide=function(fast,cb)
{
	$('#chatWindow').removeClass('smaller');
	if(fast){
		$('#videoBox').stop(true,true);
		$('#videoBox').hide();
		$('#videoBox video').remove();
		if(cb){cb();}
	}else{
		$('#videoBox').slideUp(500,function(){
			$('#videoBox video').remove();
			if(cb){cb();}
		});
	}
}
/*
meeting.screenSharing.hide=function(fast)
{
	if(fast)
	{
		$('#videoBox').hide();
		$('#chatWindow').removeClass('smaller');
	}
	else
	{
		$('#chatWindow').removeClass('smaller');
		$('#videoBox').slideUp(500);
	}
}
*/
meeting.getIsDesktopSharingRunning=function(){
	if($('#videoBox').data('w'))
	{
		meeting.isDesktopSharingRunning=!($('#videoBox').data('w').closed);
		if(!meeting.isDesktopSharingRunning){
			$('#videoBox').data('w',false)
		}
		return meeting.isDesktopSharingRunning;
	}
	else
	{
		return meeting.isDesktopSharingRunning;
	}
}

meeting.screenSharing.videoBoxOnClose=function()
{
	meeting.screenSharing.lock=true;
	setTimeout(function(){
		if(!meeting.screenSharing.ended && !meeting.getIsDesktopSharingRunning())
		{
			meeting.oScreenSharing.onstarted(meeting.screenSharing.media);
		}
		meeting.screenSharing.lock=false;
	},500)
}

meeting.screenSharing.videoBoxCallback=function(doc,win)
{
	$(win).bind('beforeunload', function(){
		meeting.screenSharing.videoBoxOnClose();
	});
	$('#videoBox').data('w',$('#videoBox').data('wl'));
	console.info("CALLBACK CALLED");
	$('body',doc).append($(meeting.screenSharing.media.video).clone());
	meeting.screenSharing.hide();
}

meeting.screenSharing.run=function()
{
	var oScreenSharing = new IceSIP.Sharing(meeting.oConference);
	
	meeting.oScreenSharing=oScreenSharing;
	
	oScreenSharing.onstarted=function(e){
		meeting.console.write("WEBRTC SCREEN Joined - start",1);
		
		meeting.screenSharing.media=e;
		
		console.log(meeting.screenSharing.media);
		try
		{
			$('#topBar').addClass('hidden');
			if(!$('#videoBox video')[0]){
				document.getElementById('videoBox').appendChild(meeting.screenSharing.media.video);
			}
			meeting.screenSharing.show();
			meeting.isDesktopSharingRunning=true;
			$('#videoBox').each(function(){
				if(!$('video',this).data('activated'))
				{
					$('video',this).data('activated',true);
				}
				if(!$(this).data('activated'))
				{
					$(this).click(function(){
						var vb = document.getElementById('videoBox');
						if(vb.lastElementChild.nodeName=='OBJECT') {
							// Maximized plugin open in same window
							if(vb.parentNode==document.body)
							{
								var el = document.getElementById('chatWindow');
								el.parentNode.insertBefore(vb,el);
							}
							else
								document.body.appendChild(vb);
						} else {
							// Open in separate window
							if($(this).data('wl') && !$(this).data('wl').closed){
								var w=$(this).data('wl');
								w.focus();
							}
							else
							{
								var w=window.open('?videoBox',Math.random(),"menubar=0, status=0, toolbar=0, width=500, height=400");
								$(this).data('wl',w);
								if(w.addEventListener)
									w.addEventListener('load',function() {
										meeting.screenSharing.videoBoxCallback(w.document,w);
									},true);
								else if(w.attachEvent) {
									// Still in IE11 addEventListener is not available here
									w.attachEvent('onload',function() {
									//	meeting.screenSharing.videoBoxCallback(w.document,w);
									});
								}
							}
						}
					});
					$(this).data('activated',true);
				}
			});
		}
		catch(e)
		{
			console.log(e);
			meeting.core.error("meeting_no_video");
		}
		if(meeting.screenSharing.media.video.play){meeting.screenSharing.media.video.play();}else{console.error('NOT');}
		meeting.console.write("WEBRTC SCREEN Joined Screen Sharing",1);
	};
	
	oScreenSharing.onfailed=function(e){
		meeting.status.steady();
		meeting.core.error('meeting_webrtc_not_allowed');
	};
	
	oScreenSharing.onended=function(e){
		//meeting.status.steady();
		//meeting.core.error('meeting_webrtc_screensharing_ended');
	};
	
	oScreenSharing.join(meeting.sip.lastNumber);
}

meeting.screenSharing.end=function()
{
	meeting.isDesktopSharingRunning=false;
	$('#chatWindow').removeClass('smaller');
	meeting.screenSharing.hide(false,function(){
		if($('#videoBox').data('w') && !$('#videoBox').data('w').closed){
			meeting.screenSharing.ended=true;
			$('#videoBox').data('w').close();
			$('#videoBox').data('w',false);
		}
		meeting.oScreenSharing.stop();
	});
}
/*************************/
/*************************/