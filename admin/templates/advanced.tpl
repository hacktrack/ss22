{optional strict}<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="{iso_language}" lang="{iso_language}">{/optional}
{!optional strict}<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>{/optional}
<head>
    {optional base}<base href="{base}" target="_blank">{/optional}
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="google" value="notranslate" />
	<title>{!optional calendar}{optional settings::layout::title}{settings::layout::title}{/optional}{!optional settings::layout::title}{lang::login_screen::title}{/optional}{/optional}{optional calendar}{lang::login_screen::public_calendar}{/optional}</title>
	{optional base}<base href="{base}"/>{/optional}
	<link rel="apple-touch-icon" href="icon.png" />
	<link sizes="64x64" href="icon64.ico" rel="icon" />
	<link sizes="16x16" href="favicon.gif" rel="icon" />
	<link rel="icon" type="image/gif" href="favicon.gif"/>
	<script type="text/javascript" src="{base ''}scripts/advanced.js"></script>
	<script type="text/javascript" src="scripts/rsa.js"></script>
	<script type="text/javascript" src="client/inc/startscript.js"></script>
</head>
<body id="bodyTag" onload="initOnLoad({optional forceLogin}1{/optional}{!optional forceLogin}{optional get::sid}1{/optional}{optional get::frm}1{/optional}{optional get::atoken}1{/optional}{/optional});">
<noscript>{lang::login_screen::js_turned_off_message_text} <a href="./basic/?jscrash&amp;sid={htmlspecialchars activeSID}">{lang::login_screen::js_turned_off_message_link}</a></noscript>
</body>
</html>