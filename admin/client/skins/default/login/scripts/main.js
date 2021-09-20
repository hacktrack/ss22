function urlencode (str) {
	str = (str+'').toString()
	return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
}

function encodePwd(sKey,form,from,to)
{
	var to_set=true;
	if(!from){var from='login_pass';}
	if(!to){var to='password_rsa'; to_set=false;}
	
	if(document.getElementById(from))
	{
		var dPwd = document.getElementById(from);
		var sPwd = dPwd.value;
		
		var time=Math.floor(new Date().getTime()/1000);
		
		if (document.getElementById(form).getAttribute('timestamp'))
		{
			time=document.getElementById(form).getAttribute('timestamp');
			/*
			var newTime=getData('server/login/shortcuts.php?t&'+time);
			if(newTime){time=newTime;}
			else{time=document.getElementById('time').value;}
			*/
		}
		var rPwd=document.getElementById(from).value='p='+urlencode(document.getElementById(from).value)+'&t='+time;
		
		//Prepare RSA library
		var rsa = new RSAKey();
		rsa.setPublic(sKey, '10001');
		if(!document.getElementById(to))
		{
			var password_rsa = document.createElement('input');
			password_rsa.type = 'hidden';
			password_rsa.name = to;
			password_rsa.value = rsa.encrypt(rPwd);
			document.getElementById(form).appendChild(password_rsa);
			dPwd.value = '';
		}
		else
		{
			document.getElementById(from).value = '';
			document.getElementById(to).value = rsa.encrypt(rPwd);
		}
	}
	return true;
}

function initLogin()
{
	// activate elements
	
	// handle form submit
	document.getElementById('login').onsubmit=function(){
		encodePwd(this.getAttribute('name'),'login');
	}
	//
	
	// handle outerclick
	document.getElementsByTagName('body')[0].ontouchend=document.getElementsByTagName('body')[0].onmouseup=function(e){
		onouterclick();
	}
	document.getElementsByTagName('body')[0].onblur=function(e){
		onouterclick();
	}
	//
	
	// language
	document.getElementById('language_button').onmouseup=function(e){
		e.cancelBubble=true;
		e.preventDefault();
		return false;
	}
	//
	
	// permanent login
	if(document.getElementById('rememberMe')){
		document.getElementById('rememberMe').onclick=function(){
			if(this.checked){
				var num=Math.round(Math.random()*100);
				var checker=helper.setCookie('wach',num);
				if(num.toString()!=checker.toString()){
					alert(document.getElementById('lang-no-cookie').value);
					this.checked=false;
				}
			}
		}
	}
	//
	
	document.getElementById('language_button').onclick=function(){
		
		// hide interface bubble
		if(!document.getElementById('interface_bubble').hasAttribute('is-hidden')){
			document.getElementById('interface_bubble').setAttribute('is-hidden',1);
		}
		
		if(document.getElementById('language_bubble').hasAttribute('is-hidden')){
			document.getElementById('language_bubble').removeAttribute('is-hidden');
		}else{
			document.getElementById('language_bubble').setAttribute('is-hidden',1);
		}
	}
	
	document.getElementById('login_username').onkeydown=function(){
		document.getElementById('login_username').parentElement.className=document.getElementById('login_username').parentElement.className.replace('has-error','');
		document.getElementById('login_pass').parentElement.className=document.getElementById('login_pass').parentElement.className.replace('has-error','');
	};
	if(document.getElementById('login_pass')){
		document.getElementById('login_pass').onkeydown=function(){
			document.getElementById('login_pass').parentElement.className=document.getElementById('login_pass').parentElement.className.replace('has-error','');
			document.getElementById('login_username').parentElement.className=document.getElementById('login_username').parentElement.className.replace('has-error','');
		};
	}
	if(document.getElementById('login_divtcha')){
		document.getElementById('login_divtcha').onkeydown=function(){
			document.getElementById('login_divtcha').parentElement.className=document.getElementById('login_divtcha').parentElement.className.replace('has-error','');
		}
	}
	
	try
	{
		var menuitems=helper.getElementsByClassName(document.getElementById('language_bubble'),'_menu-dyk');
	}
	catch(e)
	{
		console.error(e);
	}
	
	for(var i=0; i<menuitems.length; i++)
	{
		menuitems[i].onclick=menuitems[i].ontouchend=function(){
			try
			{
				var checker=helper.setCookie('wall',this.getAttribute('code'),365);
				if(this.getAttribute('code')!=checker){
					location.href='?language='+this.getAttribute('code');
				}else{
					location.reload();
				}
			}
			catch(e)
			{
				console.error(e);
			}
			return false;
		}
	}
	//
	
	// interface
	document.getElementById('interface_button').onmouseup=function(e){
		e.cancelBubble=true;
		e.preventDefault();
		return false;
	}
	
	document.getElementById('interface_button').onclick=function(){
		// hide language bubble
		if(!document.getElementById('language_bubble').hasAttribute('is-hidden')){
			document.getElementById('language_bubble').setAttribute('is-hidden',1);
		}
		
		if(document.getElementById('interface_bubble').hasAttribute('is-hidden')){
			document.getElementById('interface_bubble').removeAttribute('is-hidden');
		}else{
			document.getElementById('interface_bubble').setAttribute('is-hidden',1);
		}
	}
	//
}

function onouterclick()
{
	// hide language bubble
	if(!document.getElementById('language_bubble').hasAttribute('is-hidden')){
		document.getElementById('language_bubble').setAttribute('is-hidden',1);
	}
	
	// hide interface bubble
	if(!document.getElementById('interface_bubble').hasAttribute('is-hidden')){
		document.getElementById('interface_bubble').setAttribute('is-hidden',1);
	}
}