<!DOCTYPE html>
<html>
<head>
	<title>{optional settings::layout::title}{settings::layout::title}{/optional}{!optional settings::layout::title}{lang::login_screen::title}{/optional}</title>
	<!--[if (gt IE 8)|!(IE)]><!-->
	<script type="text/javascript">
		// redirect all browsers except of the IE8 and lower - for such IE8 use "some old login page" (this redirect is here since WC-6601)
		document.location = '?mobile=true';
	</script>
	<!--<![endif]-->
	{optional base}<base href="{base}" target="_blank">{/optional}
	<meta http-equiv="content-type" content="text/html; charset=utf-8" />
	<meta name="author" content="" />
	<meta name="description" content="" />
    <meta name="keywords" content="" />
	<meta name="robots" content="follow, all" />

	<meta name="viewport" content="width=640, user-scalable=no, target-densitydpi=326" />

	<link id="css_style1" rel="stylesheet" href="{base ''}css/mobile.css" type="text/css" />

	<script src="{base ''}scripts/jquery.js" type="text/javascript"></script>
	<script src="{base ''}scripts/modernizr.js" type="text/javascript"></script>
	<script src="{base ''}scripts/rsa.js" type="text/javascript"></script>
	<script src="{base ''}scripts/login_mobile.js" type="text/javascript"></script>
	<link rel="icon" type="image/gif" href="favicon.ico" />
</head>

<body class="{get::color settings::layout::login_style 'blue'}">

{optional message}
	<div id="msg_ok">
		<div id="msg_ok_text">
			<table cellspacing="0" cellpadding="0"><tr><td>{message}</td></tr></table>
		</div>
		<div class="clear"></div>
	</div>
{/optional}
{optional error}
	<div id="msg_x">
		<div id="msg_x_text">
			<table cellspacing="0" cellpadding="0"><tr><td>{error}</td></tr></table>
		</div>
		<div class="clear"></div>
	</div>
{/optional}

<div id="main_login">
	<form method="post" name="{hash}" action="index.html" id="login_form" target="_self">
	<div id="main_login_back">
		<div style="text-align:center;margin:10px;width:100%"><img src="{settings::layout::login_logo}" alt="{settings::layout::login_title}" style="height:100px;" /></div>
		<div id="login_box">
			<fieldset>
				<input type="hidden" name="_c" value="auth"/>
				<input type="hidden" name="ctz" id="ctz" value="{ctz}" />
				<input type="hidden" name="disable_ip_check" id="ipcheck" value="1"/>
				<input type="hidden" name="_n[js]" value="0" id="jscontrol"/>
				<input type="text" name="iw_username" class="login_login" id="login_login" placeholder="{login_username_title}"{!optional settings::restrictions::disable_autofill}{optional username} value="{username}"{/optional}{/optional} />
				<input type="password" name="password" class="login_pass" id="login_pass" placeholder="{lang::login_screen::pass}" />
				<input type="submit" name="_a[login]" class="nowebkit login_sent" id="login_sent" value="{lang::form_buttons::sign_in}" />
			</fieldset>
		</div>

	</div>

	<div id="main_login_foot">
		<input type="hidden" id="interface" name="to" value="{recommended_interface::main::nojs}"/>
		{!optional settings::restrictions::disable_interfaces}
		<div id="login_interface">
			<div id="login_interface_text">{lang::login_screen::interface}:</div>
			<div id="login_interface_select">
				<div id="interface_box">
				<select name="to" id="interface">
						{optional allowed_interfaces::basic}<option value="basic"{optional recommended_interface::main::js 'basic'} selected="selected"{/optional}>{lang::login_screen::basic}</option>{/optional}
						{optional allowed_interfaces::pda}<option value="pda"{optional recommended_interface::main::js 'pda'} selected="selected"{/optional}>{lang::login_screen::pda}</option>{/optional}
				</select>
				</div>
			</div>
			<div class="clear"></div>
		</div>
		{/optional}
		{!optional settings::restrictions::disable_languages}
		<div id="login_language">
			<div id="login_language_text">{lang::login_screen::lang}:</div>
			<div id="login_language_select">
				<div id="language_box">
				<select name="language" id="language">
					{dynamic languages}<option value="{.*::lang}"{optional *::selected} selected="selected"{/optional}>{.*::name}</option>
					{/dynamic}
				</select>
				</div>
			</div>
			<div class="clear"></div>
		</div>
		{/optional}
	</div>
	</form>
</div>

<div id="foot_space"></div>
<div class="clear"></div>

<input type="hidden" value="{time}" id="time" />

</body>
</html>
