/* RSA login */
function urlencode (str) {
	str = (str+'').toString()
	return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
}
function getData(url) {
	if (window.XMLHttpRequest) {AJAX=new XMLHttpRequest();}
	else {AJAX=new ActiveXObject("Microsoft.XMLHTTP");}
	if (AJAX) {
		AJAX.open("GET", url, false);
		AJAX.send(null);
		return AJAX.responseText;
	} else {return false;}
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
		if (document.getElementById('time'))
		{
			var newTime=getData('shortcuts.php?t&'+time);
			if(newTime){time=newTime;}
			else{time=document.getElementById('time').value;}
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
			form.appendChild(password_rsa);
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

$(document).ready(function() {
	
	/** ************************/
	$("#main_help").hide();
		
	$("#login_help").click(function(){{
		$("body").css("background-color","#FFFFFF");
		$("html, body").scrollTop(0);
		$("#main_login").hide();
		$("#main_help").show();
		
	}});
	$("#login_back").click(function(){{
		$("body").css("background-color","#ECE9E8");
		$("html, body").scrollTop(0);
		$("#main_help").hide();
		$("#main_login").show();
		
	}});
	
	// responsive height
	var diff=0, diff_mm=0, h_max=970, h_min=830, h_now=0;
	
	function height_resp(){{
		return false;
		
		h_now=$(window).height();
		
		diff_mm=h_max-h_min;
		diff=h_max-h_now;
		
		
		if(diff>diff_mm){{diff=diff_mm;}}
		if(h_now>h_max){{diff=0;}}
		
		$("h1").css( "margin-top",(100-(diff*0.5))+"px");
		$("h1").css( "margin-bottom",(75-(diff*0.45))+"px");
		$("#main_login_back").css("height", (625-(diff*1.2))+"px");
		$("#login_help").css("margin-top", (47-(diff*0.3))+"px");
		
	}}
	
	height_resp();

	$(window).resize(function() {{
		height_resp();
	}});
	/** ************************/
	
	/* HWN CTZ */
	if(document.getElementById('ctz')){document.getElementById('ctz').value=(new Date().getTimezoneOffset())*(-1);}
	/**/
	/* HWN - placeholder for older browser */
	if(!Modernizr.input.placeholder)
	{
		$(":input[placeholder]").placeholder();
		$(":input[placeholder]").each(function(){
			$(this).attr('title',$(this).attr('placeholder'));
		});
	}
	/* */
	// msg
	$("#msg_ok").click(function(){
		$("#msg_ok").fadeOut();
	});
	$("#msg_x").click(function(){
		$("#msg_x").fadeOut();
	});
	

	/** HWN */
	
	$('#login_form').submit(function(){
		encodePwd($(this).attr('name'),this);
	});

	/* let user delete it's username from cookies */
	if(document.getElementById('usernameDelete'))
	{
		document.getElementById('usernameDelete').onclick=function()
		{
			document.getElementById('saveFrame').src="shortcuts.php?d&"+Math.floor(new Date().getTime()/1000);
			document.getElementById('login_login').value="";
			this.style.display="none";
			$("#login_pass").val("");
			document.getElementById('login_login').focus();
			return false;
		}
	}
	/**/
	
	/** */
	
	$('#js_check').val('1');
	$('#login_pass').focus(function(){
		$('#usernameDelete').data('goto','login_login');
	});
	$('#login_login').focus(function(){
		$('#usernameDelete').data('goto','login_pass');
	});
	
	$('#usernameDelete').focus(function(){
		var go='login_pass';
		if($('#usernameDelete').data('goto')){go=$('#usernameDelete').data('goto');}
		$('#'+go).focus();
	});
	if($('#login_login').val()!='')
	{
		$('#login_pass').focus();
	}
	else
	{
		$('#login_login').focus();
	}
	/** */
	
	/** */
});