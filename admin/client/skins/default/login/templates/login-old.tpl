<!doctype html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="{active_language::code}" lang="{active_language::code}">
<head>
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="google" value="notranslate" />
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no" />

	<!-- Apple touch icons -->
	<link rel="apple-touch-icon" sizes="57x57" href="apple-touch-icon-57x57.png">
	<link rel="apple-touch-icon" sizes="60x60" href="apple-touch-icon-60x60.png">
	<link rel="apple-touch-icon" sizes="72x72" href="apple-touch-icon-72x72.png">
	<link rel="apple-touch-icon" sizes="76x76" href="apple-touch-icon-76x76.png">
	<link rel="apple-touch-icon" sizes="114x114" href="apple-touch-icon-114x114.png">
	<link rel="apple-touch-icon" sizes="120x120" href="apple-touch-icon-120x120.png">
	<link rel="apple-touch-icon" sizes="144x144" href="apple-touch-icon-144x144.png">
	<link rel="apple-touch-icon" sizes="152x152" href="apple-touch-icon-152x152.png">
	<link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon-180x180.png">

	<!-- Favicon -->
	<link rel="icon" type="image/png" href="favicon-16x16.png" sizes="16x16">
	<link rel="icon" type="image/png" href="favicon-32x32.png" sizes="32x32">
	<link rel="icon" type="image/png" href="favicon-96x96.png" sizes="96x96">

	<!-- Google icons -->
	<link rel="icon" type="image/png" href="android-chrome-192x192.png" sizes="192x192">
	<meta name="theme-color" content="#0084d8">

	<!-- Microsoft icons -->
	<link rel="manifest" href="manifest.json">
	<meta name="msapplication-TileColor" content="#0084d8">
	<meta name="msapplication-TileImage" content="mstile-144x144.png">

	<!-- Add to homescreen for Chrome on Android -->
	<meta name="mobile-web-app-capable" content="yes">

	<!-- Add to homescreen for Safari on iOS -->
	<meta name="apple-mobile-web-app-capable" content="yes">
	<meta name="apple-mobile-web-app-status-bar-style" content="translucent-black">
	<meta name="apple-mobile-web-app-title" content="IceWarp WebAdmin">

	<!-- Turn on IE cleartype -->
	<meta http-equiv="cleartype" content="on">

	{!optional logged}
		<title>{lang::loginpage::title_admin}</title>
	{/optional}
	{!optional logged}
		<title>{lang::loginpage::title_admin}</title>
		<link rel="stylesheet" href="client/skins/default/css/login-old.css">
	{/optional}
	<base href="{base}"/>
</head>
<body{!optional logged} class="login"{/optional}>
{!optional logged}

	<div class="login-wrap">
		<div class="login-header">
			<div class="login-logo">
				<img class="login-logo-image" src="{base}client/skins/default/login/images/login-logo.jpg" width="169" height="43">
			</div>
			<div class="login-language">
				<select id="languages">
					{dynamic languages}
						<option value="{.*::code}" {optional *::active}selected{/optional}>{.*::name}</option>
					{/dynamic}
				</select>
			</div>
		</div>
		<div class="login-headline">
			<center>
				<h1>{lang::loginpage::oops_headline}</h1>
				<p>{lang::loginpage::oops_text}</p>
			</center>
		</div>
		<div class="login-browsers">
			<center>
				<div class="browser-table-wrap">
					<div class="browser-group browser-recommended">
						<table class="browser-group-title">
							<tbody><tr><td></td><td class="border-clear"><h3>{lang::loginpage::recommended}</h3></td><td></td></tr></tbody>
						</table>
						<div class="browser-table">
							<div class="browser-item browser-chrome">
								<a class="browser-anchor" target="_blank" href="https://www.google.com/chrome/browser">
									<img class="browser-image" src="{base}client/skins/default/login/images/browser-chrome.jpg" width="64" height="64" alt="Chrome">
									<div class="browser-text">
										<span class="browser-name">{lang::loginpage::chrome}</span>
										<span class="browser-support">{lang::loginpage::supported_version} 30.0+</span>
									</div>
								</a>
							</div>
						</div>
					</div>
					<div class="browser-group browser-supported">
						<table class="browser-group-title">
							<tbody><tr><td></td><td class="border-clear"><h3>{lang::loginpage::supported}</h3></td><td></td></tr></tbody>
						</table>
						<div class="browser-table">
							<div class="browser-item browser-explorer">
								<a class="browser-anchor" target="_blank" href="http://windows.microsoft.com/en-us/internet-explorer/download-ie">
									<img class="browser-image" src="{base}client/skins/default/login/images/browser-explorer.jpg" width="64" height="64" alt="Internet Explorer">
									<div class="browser-text">
										<span class="browser-name">{lang::loginpage::explorer}</span>
										<span class="browser-support">{lang::loginpage::supported_version} 10.0+</span>
									</div>
								</a>
							</div>
							<div class="browser-item browser-firefox">
								<a class="browser-anchor" target="_blank" href="https://www.mozilla.org/firefox/new">
									<img class="browser-image" src="{base}client/skins/default/login/images/browser-firefox.jpg" width="64" height="64" alt="Firefox">
									<div class="browser-text">
										<span class="browser-name">{lang::loginpage::firefox}</span>
										<span class="browser-support">{lang::loginpage::supported_version} 28.0+</span>
									</div>
								</a>
							</div>
							<div class="browser-item browser-safari">
								<a class="browser-anchor" target="_blank" href="https://support.apple.com/downloads/#safari">
									<img class="browser-image" src="{base}client/skins/default/login/images/browser-safari.jpg" width="64" height="64" alt="Safari">
									<div class="browser-text">
										<span class="browser-name">{lang::loginpage::safari}</span>
										<span class="browser-support">{lang::loginpage::supported_version} 7.0+</span>
									</div>
								</a>
							</div>
							<div class="browser-item browser-opera">
								<a class="browser-anchor" target="_blank" href="http://www.opera.com/download">
									<img class="browser-image" src="{base}client/skins/default/login/images/browser-opera.jpg" width="64" height="64" alt="Opera">
									<div class="browser-text">
										<span class="browser-name">{lang::loginpage::opera}</span>
										<span class="browser-support">{lang::loginpage::supported_version} 17.0+</span>
									</div>
								</a>
							</div>
						</div>
					</div>
				</div>
			</center>
		</div>
	</div>
	<div class="login-footer">
		<center>
			<p class="padding">{lang::loginpage::visit_text} <a class="bold underline" href="http://www.icewarp.com/">{lang::loginpage::visit_link}</a></p>
			<hr>
			<p class="padding grey">{lang::loginpage::powered_by}</p>
			<div class="social-wrap">
				<a target="_blank" href="https://www.facebook.com/IceWarpInc">
					<img class="social-icon social-fb" src="{base}client/skins/default/login/images/social-fb.jpg">
				</a>
				<a target="_blank" href="https://twitter.com/icewarp">
					<img class="social-icon social-tw" src="{base}client/skins/default/login/images/social-tw.jpg">
				</a>
				<a target="_blank" href="https://www.linkedin.com/company/icewarp">
					<img class="social-icon social-in" src="{base}client/skins/default/login/images/social-in.jpg">
				</a>
			</div>
		</center>
	</div>
	<!-- UI interaction script -->
	<script type="text/javascript" src="{base}client/inc/helpers_ext.js"></script>
	<script type="text/javascript" src="{base}client/skins/default/login/scripts/old-main.js"></script>
	<!-- Responsivity script -->
	<script>
		var body = document.getElementsByTagName("BODY")[0];
		var small = 594;
		var medium = 909;

		window.onload=function(){
			initPage();
		}

		window.onresize=function(){
			var w = window.innerWidth
			|| document.documentElement.clientWidth
			|| document.body.clientWidth;

			if (w < small) {
				body.className='login small';
			} else if (w < medium) {
				body.className='login medium';
			} else {
				body.className='login large';
			}
		};
		window.onresize();
		// setTimeout(function(){ window.onresize(); }, 500);
	</script>
{/optional}
</body>
</html>
