/** cookie handler */
window.get=[];

function gup(name)
{
	name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
	var regexS = "[\\?&]"+name+"=([^&#]*)";
	var regex = new RegExp( regexS );
	var results = regex.exec( window.location.href );
	if( results == null )
		return "";
	else
		return results[1];
}

function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name,"",-1);
}
/***/
function initOnLoad(run)
{
	// set SID from cookie and delete it
	if(readCookie('login_sid'))
	{
		window.get.sid=readCookie('login_sid');
		eraseCookie('login_sid');
	}
	else
	{
		eraseCookie('login_sid');
	}
	// set SID from # and delete it
	var hash=location.hash.replace('#','').split('&');
	if(hash!='')
	{
		for(var i=0; i<hash.length; i++)
		{
			whole=hash[i];
			hash[i]=hash[i].split('=');
			if(hash[i][0]=='sid')
			{
				window.get.sid=hash[i][1];
				location.hash=location.hash.replace('&'+whole,'').replace(whole+'&','').replace(whole,'');
			}
		}
	}
	//
	window.get.lang=gup('lang');
	window.get.language=gup('lang');
	
	clientdir='client';
	var play=readCookie('play');
	if(play){clientdir='play';}
	//alert(clientdir);
	initPRO({lang:gup('lang'),language:gup('lang'),get:window.get,clientdir:clientdir});
}
/****/