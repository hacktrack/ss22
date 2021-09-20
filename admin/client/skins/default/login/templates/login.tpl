<!doctype html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="{active_language::code}" lang="{active_language::code}">
<head>
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="google" value="notranslate" />
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no" />
	<meta id="css-backgrounds">
	<meta id="css-settings">
	<meta id="css-colors">

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
	<title>
		{optional settings::resources::layout_settings::title}
			{htmlspecialchars settings::resources::layout_settings::title}
		{/optional}
		{!optional settings::resources::layout_settings::title}
			{lang::loginpage::title_admin}
		{/optional}
	</title>
	<base href="{base}"/>
	<link rel="stylesheet" href="client/skins/default/css/index.css">
</head>
<body{!optional logged} class="login skin-{settings::resources::layout_settings::skin_style 'default'} login--{settings::resources::layout_settings::login_background_theme}"{/optional}>
{!optional logged}
	<div class="login-wrap" iw-background="{settings::resources::layout_settings::login_background 'default_0'}">
		<header class="login-head">
			<div iw-flex-grid="fit">
			<div iw-flex-cell="none item-center">
			{optional settings::resources::layout_settings::login_logo}
				<img class="login-logo" src="{settings::resources::layout_settings::login_logo}" alt="">
			{/optional}
			{!optional settings::resources::layout_settings::login_logo}
				{include client/skins/default/login/images/login-logo.tpl}{/include}
			{/optional}
			</div>
			<div iw-flex-cell="text-end">
				<div class="selector"{!optional settings::old_interface} is-hidden='1'{/optional}>
					<div class="button text borderless u-reset-margin" iw-type="select">
						<input type="button" value="{lang::loginpage::new_interface}" id="interface_button">
					</div>
					<div class="menu vertical" iw-type="selector" is-hidden="1" id="interface_bubble">
						<div class="menu-wrap">
							<a class="menu-item">
								<span>{lang::loginpage::new_interface}</span>
							</a>
							<a class="menu-item" href="{settings::old_interface}">
								<span>{lang::loginpage::old_interface}</span>
							</a>
						</div>
					</div>
				</div>
				<div class="selector"{optional settings::resources::restrictions::disable_languages} is-hidden="1"{/optional}>
					<div class="button text borderless u-reset-margin" iw-type="select">
						<input type="button" value="{active_language::name}" id="language_button">
					</div>
					<div class="menu vertical" iw-type="selector" is-hidden="1" id="language_bubble">
						<div class="menu-wrap">
							{dynamic languages}
							<a href="#" class="menu-item _menu-dyk" code="{.*::code}"><span>{.*::name}</span></a>
							{/dynamic}
						</div>
					</div>
				</div>
			</div>
			</div>
		</header>
		<main class="login-body">
			<div class="login-heading text-center">
				<h1 class="login-heading-title alpha color-primary">
					{!optional settings::resources::layout_settings::login_title}
						{lang::loginpage::title_admin}
					{/optional}
					{optional settings::resources::layout_settings::login_title}
						{settings::resources::layout_settings::login_title}
					{/optional}
				</h1>
				<p class="login-heading-text">
					{!optional settings::resources::layout_settings::login_text}
						{lang::loginpage::sign_in_text}
					{/optional}
					{optional settings::resources::layout_settings::login_text}
						{settings::resources::layout_settings::login_text}
					{/optional}
				</p>
			</div>
			<div class="login-form">
				{optional settings::gatewayauthenticationsent}
					<p class="login-authsent">{lang::loginpage::auth_sent}</p>
				{/optional}
				{!optional settings::gatewayauthenticationsent}
				<form action="" method="post" name="{rsa::hashid}" timestamp="{rsa::timestamp}" id="login">
					<fieldset>
						<div class="login-input input{optional error} has-error{/optional}">
							<input name="username" type="text" placeholder="{optional settings::login_type}{lang::loginpage::email}{/optional}{!optional settings::login_type}{lang::loginpage::username}{/optional}" id="login_username"{optional settings::resources::restrictions::disable_autofill} autocomplete="off"{/optional}>
							<div class="bubble top error">
								<span id="error-emailRequired">{error}</span>
							</div>
						</div>
						{optional settings::gateway}
						<div class="login-input" iw-flex-grid="fit">
							<div class="login-divtcha" iw-flex-cell="item-center">
								<style>{settings::divtcha::style}</style>
								{settings::divtcha::content}
							</div>
							<div iw-flex-cell="no-padding">
								<div class="input{optional settings::divtcha::entered}{!optional settings::divtcha::checked} has-error{/optional}{/optional}">
									<input name="{settings::divtcha::name}" type="text" placeholder="{lang::loginpage::divtcha}" id="login_divtcha">
									{optional settings::divtcha::entered}{!optional settings::divtcha::checked}
									<div class="bubble top error">
										<span id="error-emailRequired">{lang::loginpage::wrong_captcha}</span>
									</div>
									{/optional}{/optional}
								</div>
							</div>
						</div>
						{/optional}
						{!optional settings::gateway}
						<div class="login-input input{optional error} has-error{/optional}">
							<input name="password" type="password" placeholder="{lang::loginpage::password}" id="login_pass"{optional settings::resources::restrictions::disable_autofill} autocomplete="off"{/optional}>
						</div>
						{/optional}
						<div class="login-input button full text primary">
							<input type="submit" value="{lang::loginpage::sign_in}">
						</div>
					</fieldset>
					{!optional settings::gateway}
					{!optional settings::resources::restrictions::disable_remember}
					<div iw-flex-grid="fit center">
					<div iw-flex-cell>
						<div class="checkbox">
							<input type="hidden" name="remember" value="0" />
							<input name="remember" id="rememberMe" type="checkbox" value="1">
							<i></i>
							<label class="label">{lang::loginpage::remember_me}</label>
						</div>
					</div>
					{optional settings::webmail_url}
					{optional settings::disable_changepass}
					<div iw-flex-cell="none text-end">
						<a href="{settings::webmail_url}?reset=1" class="login-remember u-inline underline" target="_blank">{lang::loginpage::forgotten_password}</a>
					</div>
					{/optional}
					{/optional}
					</div>
					{/optional}
					{/optional}

					<input type="hidden" name="language" value="{active_language::code}" id="language"/>
					<input type="hidden" name="action" value="login" />
				</form>
				{/optional}
			</div>
		</main>
	</div>
	<footer class="login-footer text-center">
		<p class="hide-for-small">{lang::loginpage::visit_text} <a href="{lang::loginpage::visit_url}" target="_blank" class="underline"><strong>{lang::loginpage::visit_link}</strong></a></p>
		<hr class="hide-for-small">
		<p class="color-grey">{lang::loginpage::powered_by}</p>
		<div class="login-share hide-for-small">
			{!optional settings::resources::restrictions::facebook_disabled}
				<a class="login-share-icon" href="{optional settings::resources::layout_settings::facebook_page_link}{settings::resources::layout_settings::facebook_page_link}{/optional}{!optional settings::resources::layout_settings::facebook_page_link}https://www.facebook.com/IceWarpInc{/optional}" target="_blank"><span class="icon-facebook"></span></a>
			{/optional}
			{!optional settings::resources::restrictions::twitter_disabled}
				<a class="login-share-icon" href="{optional settings::resources::layout_settings::twitter_page_link}{settings::resources::layout_settings::twitter_page_link}{/optional}{!optional settings::resources::layout_settings::twitter_page_link}https://twitter.com/icewarp{/optional}" target="_blank"><span class="icon-twitter"></span></a>
			{/optional}
			{!optional settings::resources::restrictions::linkedin_disabled}
				<a class="login-share-icon" href="{optional settings::resources::layout_settings::linkedin_page_link}{settings::resources::layout_settings::linkedin_page_link}{/optional}{!optional settings::resources::layout_settings::linkedin_page_link}https://www.linkedin.com/company/icewarp{/optional}" target="_blank"><span class="icon-linkedin"></span></a>
			{/optional}

		</div>
	</footer>
	<input type="hidden" id="lang-no-cookie" value="{htmlspecialchars lang::loginpage::no_cookie}"/>
	<script type="text/javascript" src="{base}client/inc/helpers_ext.js"></script>
	<script type="text/javascript" src="{base}client/skins/default/login/scripts/rsa.js"></script>
	<script type="text/javascript" src="{base}client/skins/default/login/scripts/main.js"></script>
	<script>window.onload=function(){ initLogin();}</script>
{/optional}
{optional logged}
	<script type="text/javascript" src="{base}client/inc/startscript.js"></script>
	<script>window.onload=function(){ initPRO({ {optional sid}sid:'{sid}'{/optional} }); }</script>
{/optional}
</body>
</html>
