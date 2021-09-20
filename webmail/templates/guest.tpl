<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
	<meta charset="utf-8">
	<meta http-equiv="x-ua-compatible" content="ie=edge">
	<title>{lang::login_screen::title}</title>
	<meta name="description" content="">
	<meta name="viewport" content="width=device-width, initial-scale=1">

	<link rel="apple-touch-icon" href="apple-touch-icon.png">

	<link rel="stylesheet" type="text/css" href="{base ''}css/guest.css">
</head>
<body>

	<header class="header">
		<img src="{base ''}images/login_logo.png" alt="IceWarp logo" title="IceWarp">
	</header>

	<main id="slide" class="slide" data-active="0">
		<div class="main main--invited" data-slide="0">
			<div class="heading">
				<h2 class="heading__title" id="guest_heading_title">{lang::login_screen::guest_invited_title}</h2>
			</div>
			<form class="form content" action="basic/" method="post" accept-charset="utf-8" name="{hash}" id="guest_form" autocomplete="off">
				<div class="row margin">
					<div class="list-item column">
						<span class="list-item__number">1</span>
						<p id="guest_heading_text">{lang::login_screen::guest_text_name}</p>
					</div>
					<div class="column">
						<label id="form_login_login" class="form__item {optional error}has-error{/optional}" for="login_login">
							<span class="form__label">{lang::login_screen::your_name}</span>
							<input class="form__input" type="text" name="name" value="{htmlspecialchars guest::name}" id="login_login" placeholder="{lang::login_screen::your_name_placeholder}">
							<div id="error_box" class="error-bubble">
								<p class="error-bubble__content">{error}</p>
							</div>
						</label>
					</div>
				</div>
				<div class="row">
					<div class="list-item column">
						<span class="list-item__number">2</span>
						<p id="guest_heading_password">{lang::login_screen::guest_text_password}</p>
					</div>
					<div class="column">
						<div>
							<label id="form_login_password" class="form__item {optional error}has-error{/optional}" for="login_password">
								<span class="form__label">{lang::login_screen::password}</span>
								<input class="form__input" type="password" name="password" id="login_password" placeholder="{lang::login_screen::password}">
								<div id="error_box" class="error-bubble">
									<p class="error-bubble__content">{error}</p>
								</div>
							</label>
						</div>
						<div>
							<label id="form_confirm_login_password" class="form__item {optional error}has-error{/optional}" for="confirm_login_password">
								<span class="form__label">{lang::login_screen::confirm_password}</span>
								<input class="form__input" type="password" name="confirm_password" id="confirm_login_password" placeholder="{lang::login_screen::confirm_password}">
								<div id="error_box" class="error-bubble">
									<p class="error-bubble__content">{error}</p>
								</div>
							</label>
						</div>
						<div>
							<input class="button" type="submit" name="login" id="login_sent" value="{lang::login_screen::verify_my_email}">
						</div>
						<input type="hidden" name="_c" value="auth"></input>
						<input type="hidden" name="_a[guest_confirm]" value="1"></input>
						<input type="hidden" name="email" id="login_guest_email" value="{htmlspecialchars guest::email}"></input>
						<input type="hidden" name="room" id="login_guest_room" value="{htmlspecialchars guest::room}"></input>
						<input type="hidden" name="sender" id="login_guest_sender" value="{htmlspecialchars guest::sender}"></input>
						<input type="hidden" name="hash" id="login_guest_hash" value="{htmlspecialchars guest::hash}"></input>
					</div>
				</div>
			</form>
		</div>
		<div class="main main--email" data-slide="1">
			<div class="heading">
				<h2 class="heading__title" id="guest_heading_title">{lang::login_screen::guest_email_title}</h2>
				<p class="heading__text">{lang::login_screen::guest_email_text}</p>
			</div>
			<div class="content">
				<img class="image" src="{base ''}images/automatic_emails.png" alt="Verify new TeamChat account">
			</div>
		</div>
	</main>

	<footer class="footer">
		<p class="footer__text">{lang::login_screen::guest_powered_by}</p>
		<div class="footer__social">
			<a class="footer__icon footer__icon--facebook" href="https://www.facebook.com/IceWarpInc" target="_blank"></a>
			<a class="footer__icon footer__icon--twitter" href="https://twitter.com/icewarp" target="_blank"></a>
			<a class="footer__icon footer__icon--linkedin" href="https://www.linkedin.com/company/icewarp" target="_blank"></a>
		</div>
	</footer>

	<input type="hidden" value="{time}" id="time" />
	<script>
		var App = {{language:'{language}',sender_name:'{guest::sender_name}'}};
	</script>
	<script src="{base ''}scripts/rsa.js" type="text/javascript"></script>
	<script src="{base ''}scripts/polyglot.min.js" type="text/javascript"></script>
	<script src="{base ''}scripts/request.js" type="text/javascript"></script>
	<script src="{base ''}scripts/i18n.js" type="text/javascript"></script>
	<script src="{base ''}scripts/guest.js" type="text/javascript"></script>

</body>
</html>
