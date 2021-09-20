$(document).ready(function(){

	$('#ctz').val((new Date().getTimezoneOffset())*(-1));

	$('#username').focus();

	function untab()
	{
		document.getElementById('logintab').className='l-tab-center';
		document.getElementById('login-left').className='l-tab-left';
		document.getElementById('login-right').className='l-tab-right';
		document.getElementById('l-tabs-center-box').className='l-tabs-center-box';

		if (document.getElementById('forgot-left'))
		{
		document.getElementById('forgottab').className='l-tab-center';
		document.getElementById('forgot-left').className='l-tab-left';
		document.getElementById('forgot-right').className='l-tab-right';
		document.getElementById('tab-forgot').className='hidden';
		}

		if (document.getElementById('sign-left'))
		{
		document.getElementById('signtab').className='l-tab-center';
		document.getElementById('sign-left').className='l-tab-left';
		document.getElementById('sign-right').className='l-tab-right';
		document.getElementById('tab-sign').className='hidden';
		}

		document.getElementById('tab-login').className='hidden';
	}

	$('#logintab').click(function(){
		untab();

		this.className='l-tab-center l-active';
		document.getElementById('login-left').className='l-tab-left l-active-tl-e';
		document.getElementById('login-right').className='l-tab-right l-active-tr';
		document.getElementById('l-tabs-center-box').className='l-tabs-center-box-active';
		document.getElementById('tab-login').className='show';

		if (document.getElementById('forgot-left'))
		{
			document.getElementById('forgot-left').className='l-tab-left l-tab-left-no';
		}
		else
		{
			if (document.getElementById('sign-left'))
			{
				document.getElementById('sign-left').className='l-tab-left l-tab-left-no';
			}
		}

		return false;
	});

	$('#forgottab').click(function(){
		untab();

		this.className='l-tab-center l-active';

		document.getElementById('forgot-left').className='l-tab-left l-active-tl';
		document.getElementById('login-right').className='l-tab-right l-tab-right-no';
		document.getElementById('tab-forgot').className='show';

		if (document.getElementById('sign-left'))
		{
			document.getElementById('sign-left').className='l-tab-left l-tab-left-no';
			document.getElementById('forgot-right').className='l-tab-right l-active-tr';
		}
		else
		{
			if (document.getElementById('login-right'))
			{
				document.getElementById('forgot-right').className='l-tab-right l-active-tr-e';
				document.getElementById('login-right').className='l-tab-right l-tab-right-no';
			}
		}

		return false;
	});

	$('#signtab').click(function(){
		untab();

		this.className='l-tab-center l-active';
		document.getElementById('sign-left').className='l-tab-left l-active-tl';
		document.getElementById('sign-right').className='l-tab-right l-active-tr-e';
		document.getElementById('tab-sign').className='show';

		if (document.getElementById('forgot-right'))
		{
			document.getElementById('forgot-right').className='l-tab-right l-tab-right-no';
		}
		else
		{
			if (document.getElementById('login-right'))
			{
				document.getElementById('login-right').className='l-tab-right l-tab-right-no';
			}
		}

		return false;
	});

	if (document.getElementById('remember_type'))
	{
		if (document.getElementById('remember_type').value==3 && document.getElementById('autoLogin').value=='')
		{
			if (document.getElementById('login').name=='login_form')
			{
				if (document.forms)
				{
					document.getElementById('jscontrol').value='1';
					document.forms.login_form.submit();
				}
				else
				{
					document.getElementById('jscontrol').value='1';
					document.login_form.submit();
				}
			}
		}
	}
});