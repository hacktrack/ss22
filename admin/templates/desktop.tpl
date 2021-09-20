<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
 <meta http-equiv="X-UA-Compatible" content="IE=edge" />
 <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
 <meta name="viewport" content="initial-scale=1,maximum-scale=1" />
 <meta name="format-detection" content = "telephone=no" />
 <meta name="google" content="notranslate" />
 <title>{!optional calendar}{optional settings::layout::title}{settings::layout::title}{/optional}{!optional settings::layout::title}{lang::login_screen::title}{/optional}{/optional}{optional calendar}{lang::login_screen::public_calendar}{/optional}</title>
 <link rel="stylesheet" type="text/css" href="{base ''}css/main.css" />
 <link rel="stylesheet" type="text/css" href="{base ''}css/keyboard.css" />
 <script type="text/javascript" src="{base ''}scripts/jquery.js"></script>
 <script type="text/javascript" src="{base ''}scripts/modernizr.js"></script>
 <script type="text/javascript" src="{base ''}scripts/outerClick.js"></script>
 <script type="text/javascript" src="{base ''}scripts/jquery.cookies.js"></script>
 <script type="text/javascript" src="{base ''}scripts/keyboard.js"></script>
 <script type="text/javascript" src="{base ''}scripts/rsa.js"></script>
 <script type="text/javascript" src="{base ''}scripts/main.js"></script>
 <style type="text/css">{divtcha::code::style}</style>
 <link rel="apple-touch-icon" href="icon.png" />
 <link sizes="64x64" href="icon64.ico" rel="icon" />
 <link sizes="16x16" href="favicon.gif" rel="icon" />
 <link rel="icon" type="image/gif" href="favicon.gif"/>
 {!optional nobase}{optional base}<base href="{base}"/>{/optional}{/optional}
</head>
<body id="bodyTag" class="{optional get::changepwd} bigger{/optional}{optional get::selfSignUp} bigger{/optional}{optional pwdPolicy::enable} pwp {/optional}{optional get::contactAdministrator} contact_support{/optional} {get::color settings::layout::login_style 'blue'} stripex">
<form method="post" action="{!optional get::contactAdministrator}{self}{optional get::changepwd}basic/{/optional}{optional get::forgotPassword}basic/{/optional}{optional get::selfSignUp}basic/{/optional}{!optional get::forgotPassword}{htmlspecialchars filtered_query_string}{/optional}{/optional}{optional get::contactAdministrator}./{/optional}" id="loginForm" name="{hash}" autocomplete="{optional settings::restrictions::disable_autofill}off{/optional}{!optional settings::restrictions::disable_autofill}on{/optional}">

	<input type="hidden" value="{htmlspecialchars filtered_query_string}" id="filtered_query_string" />
			
	<input type="hidden" name="_c" value="auth" />
	<input type="hidden" name="_n[p][main]" value="win.main.tree" id="npmain"/>
	<input type="hidden" name="_n[w]" value="main" />
	<input type="hidden" name="_n[js]" value="0" id="jscontrol"/>
	<input type="hidden" name="ctz" id="ctz" value="{ctz}" />
	<input type="hidden" name="disable_ip_check" id="ipcheck" value="1"/>

	<div id="shim"></div>
	<div id="wrapper"{optional forceLogin} style="display:none"{/optional}{!optional forceLogin}{optional get::frm} style="display:none"{/optional}{/optional}>
		<div id="loginBox" {optional get::selfSignUp} class="signup"{/optional}{optional get::changepwd} class="changepwd"{/optional}>
			<div id="logo"{optional settings::layout::logo} style="background-image:url('{settings::layout::logo}');"{/optional}></div>
			{optional pwdPolicy::enable}
				<ul id="passwordPolicyBox">
					{optional pwdPolicy::minlength}
					<li>
						{lang::login_screen::pw_policy_minlength} : {pwdPolicy::minlength}
					</li>
					{/optional}
					{optional pwdPolicy::digits}
					<li>
						{lang::login_screen::pw_policy_digits} : {pwdPolicy::digits}
					</li>
					{/optional}
					{optional pwdPolicy::alpha}
					<li>
						{lang::login_screen::pw_policy_alpha} : {pwdPolicy::alpha}
					</li>
					{/optional}
					{optional pwdPolicy::nonalphanum}
					<li>
						{lang::login_screen::pw_policy_nonalphanum} : {pwdPolicy::nonalphanum}
					</li>
					{/optional}
					{optional pwdPolicy::useralias}
					<li>
						{lang::login_screen::pw_policy_useralias}
					</li>
					{/optional}
					{optional pwdPolicy::uppercase}
					<li>
						{lang::login_screen::pw_policy_uppercase} : {pwdPolicy::uppercase}
					</li>
					{/optional}
				</ul>
				{/optional}
			{!optional calendar} <!--CALENDAR OPTIONAL START-->
				{!optional get::forgotPassword}{!optional get::selfSignUp}{!optional get::contactAdministrator} <!-- LOGIN -->
					{optional get::changepwd}
						<input type="hidden" value="1" name="_a[changepwd]"/>
						<input type="hidden" value="./" name="referer"/>
					{/optional}
					{!optional get::changepwd}
						<input type="hidden" value="1" name="_a[login]"/>
					{/optional}
			
					<div id="loginInputs">
						<input type="text" placeholder="{!optional settings::logging_type}{htmlspecialchars lang::login_screen::user}{/optional}{optional settings::logging_type}{htmlspecialchars lang::login_screen::email}{/optional}" title="{!optional settings::logging_type}{htmlspecialchars lang::login_screen::user}{/optional}{optional settings::logging_type}{htmlspecialchars lang::login_screen::email}{/optional}" class="text" id="inputUsername" name="iw_username" value="{!optional settings::restrictions::disable_autofill}{optional username}{username}{/optional}{/optional}" tabindex="1"/>
						{!optional settings::restrictions::disable_autofill}<div class="xbtn_box"><a href="?" class="xbtn{optional username} show{/optional}" id="usernameDelete">&times;</a></div>{/optional}
						<input type="password" placeholder="{!optional get::changepwd}{htmlspecialchars lang::login_screen::pass}{/optional}{optional get::changepwd}{htmlspecialchars lang::login_screen::old_pass}{/optional}" title="{!optional get::changepwd}{htmlspecialchars lang::login_screen::pass}{/optional}{optional get::changepwd}{htmlspecialchars lang::login_screen::old_pass}{/optional}" class="text keyboard_off_Input" autocomplete="{optional settings::restrictions::disable_autofill}off{/optional}{!optional settings::restrictions::disable_autofill}on{/optional}" type="password" id="inputPassword" name="password" value="{!optional password}{permanentLogin ''}{/optional}{password ''}" tabindex="2"/>
						
						{optional get::changepwd}
							<input autocomplete="off" type="password" id="inputPasswordNew" class="keyboard_off_Input text" name="passwordNew" tabindex="3" placeholder="{lang::login_screen::new_pass}" title="{lang::login_screen::new_pass}"/>
							<input autocomplete="off" type="password" id="inputPasswordCheck" class="keyboard_off_Input text" name="passwordCheck" tabindex="4" placeholder="{lang::login_screen::check_pass}" title="{lang::login_screen::check_pass}"/>
						{/optional}
						
						<div class="other">
							{!optional get::changepwd}
								{optional solution 2}
								<table cellspacing="0" cellpadding="0">
									<tr>
										{!optional settings::restrictions::disable_remember}
											<td style="width: 15px;"><input type="checkbox" id="auto_login" name="auto_login" value="1" {optional permanentLogin}checked="checked"{/optional} {!optional permanentLogin}{optional get::autoLogin}checked="checked"{/optional}{/optional}/></td>
											<td class="aleft" id="auto_login_td"><label for="auto_login">&nbsp;{lang::login_screen::keep_me_signed}</label></td>
										{/optional}
										{optional settings::restrictions::forgot}
											<td class="aright" id="forgot_password_td"><a href="?forgotPassword=1">{lang::reset_pass::reset_pass}</a></td>
										{/optional}
									</tr>
								</table>
								{/optional}
								{optional solution 1}
								<table cellspacing="0" cellpadding="0"><tr><td>&nbsp;</td></tr></table>
								{/optional}
							{/optional}
							{optional get::changepwd}
								<table cellspacing="0" cellpadding="0"><tr><td>&nbsp;</td></tr></table>
							{/optional}
						</div>
						<table cellspacing="0" cellpadding="0" style="width: 100%;">
							{!optional get::changepwd}
							<tr>
								<td id="submitTd" class="-submitFull-">
									<input type="submit" id="submitLogin" value="{lang::login_screen::login}" tabindex="3"/>
								</td>
								<td id="signTd">
									{!optional settings::restrictions::disable_signup}
										<a href="?selfSignUp=1" id="submitSign" class="input">{lang::sign_up::sign_up}</a>
									{/optional}
									{optional solution 1}
										<table>
											<tr>
											{!optional settings::restrictions::disable_remember}
												<td style="width: 15px;"><input type="checkbox" id="auto_login" name="auto_login" value="1" {optional permanentLogin}checked="checked"{/optional} {!optional permanentLogin}{optional get::autoLogin}checked="checked"{/optional}{/optional}/></td>
												<td class="aleft" id="auto_login_td"><label for="auto_login">&nbsp;{lang::login_screen::keep_me_signed}</label></td>
											{/optional}
											{optional settings::restrictions::forgot}
												<td class="aright" id="forgot_password_td"><a href="?forgotPassword=1">{lang::reset_pass::reset_pass}</a></td>
											{/optional}
											</tr>
										</table>
									{/optional}
								</td>
							</tr>
							{/optional}
							{optional get::changepwd}
							<td id="submitTd">
								<div id="submitLoginBoxChangePwd">
									<input type="submit" id="submitLogin" value="{lang::login_screen::change_password}" tabindex="4"/>
								</div>
							</td>
							{/optional}
						</table>
					</div>
				{/optional}{/optional}{/optional} <!-- LOGIN END -->
				{optional get::selfSignUp} <!-- SIGN UP -->
					<input type="hidden" value="{self}" name="referer"/>
					<input type="hidden" value="1" name="_a[signup]"/>
				
					<div id="loginInputs">
						
						<input type="text" class="text" name="signup_username" value="{eDataInfo::form::signup_username ''}" placeholder="{lang::sign_up::username}" title="{lang::sign_up::username}"/>
						<span class="btn btn_select pure full light" style="margin-bottom:10px;"><span><b><i><select size="1" name="signup_domain">{optional domains}{dynamic domains}<option value="{.*::domain}" {optional *::selected}selected="selected"{/optional}>{.*::domain}</option>{/dynamic}{/optional}</select><label>{lang::sign_up::domain}</label></i></b></span></span>
						<input type="password" class="text" name="signup_password" value="" placeholder="{lang::login_screen::pass}" title="{lang::login_screen::pass}"/>
						<input type="password" class="text" name="signup_confirmpassword" value="" placeholder="{lang::sign_up::confirm_pass}" title="{lang::sign_up::confirm_pass}"/>
						<input type="text" class="text" name="signup_name" value="{eDataInfo::form::signup_name ''}" placeholder="{lang::sign_up::fullname}" title="{lang::sign_up::fullname}"/>
						<input type="text" class="text" name="signup_aemail" value="{eDataInfo::form::signup_aemail ''}" placeholder="{lang::sign_up::alternative}" title="{lang::sign_up::alternative}"/>
						
						<table cellspacing="0" cellpadding="0" style="width: 100%;">
							<tr>
								<td id="submitTd">
									<input type="submit" id="submitLogin" value="{lang::login_screen::send}" tabindex="3"/>
								</td>
								<td id="signTd">
									<a href="?" id="submitSign" class="input">{lang::login_screen::cancel}</a>
								</td>
							</tr>
						</table>
					</div>
				{/optional} <!-- SIGN UP END -->
				{optional get::contactAdministrator} <!-- CONTACT ADMINISTRATOR PASSWORD-->
					
					<input type="hidden" value="{self}" name="referer"/>
				
					<div id="loginInputs">
						<input type="text" class="text" id="inputContactAdministrator" name="contact[email]" placeholder="{lang::login_screen::your_email}" title="{lang::login_screen::email}" value="{post::contact::email ''}"/>
						<textarea class="input text" placeholder="{lang::login_screen::text}" name="contact[text]" style="line-height:15px;">{post::contact::text ''}</textarea>
						<table>
							<tr>
								<td style="width:50%; text-align:center; padding-top:11px;vertical-align:top;">
									{divtcha::code::content}
								</td>
								<td style="width:50%" class="paddingLeftBox">
									<input type="text" class="text" name="{divtcha::input_name}" value="" placeholder="{lang::login_screen::antispam}" title="{lang::sign_up::username}"/>
								</td>
							</tr>
						</table>
						<table cellspacing="0" cellpadding="0" style="width: 100%;">
							<tr>
								<td id="submitTd">
									<input type="submit" class="submit" value="{lang::login_screen::send}" tabindex="3"/>
								</td>
								<td id="signTd">
									<a href="?" id="submitSign" class="input">{lang::login_screen::cancel}</a>
								</td>
							</tr>
						</table>
					</div>
				{/optional} <!-- FORGOT PASSWORD END -->
				{optional get::forgotPassword} <!-- FORGOT PASSWORD-->
					
					<input type="hidden" value="{self}" name="referer"/>
					<input type="hidden" value="1" name="_a[reset]"/>
				
					<div id="loginInputs">
						<input type="text" class="text" id="inputForgotPassword" name="forgot_username" placeholder="{lang::login_screen::email}" title="{lang::login_screen::email}"/>
						<table cellspacing="0" cellpadding="0" style="width: 100%;">
							<tr>
								<td id="submitTd">
									<input type="submit" id="submitLogin" value="{lang::login_screen::send}" tabindex="3"/>
								</td>
								<td id="signTd">
									<a href="?" id="submitSign" class="input">{lang::login_screen::cancel}</a>
								</td>
							</tr>
						</table>
					</div>
				{/optional} <!-- FORGOT PASSWORD END -->
			{/optional} <!--CALENDAR OPTIONAL END-->
			{optional calendar} <!--CALENDAR LOGIN START-->
				<div id="loginInputs">
					<input type="text" placeholder="{!optional settings::logging_type}{htmlspecialchars lang::login_screen::user}{/optional}{optional settings::logging_type}{htmlspecialchars lang::login_screen::email}{/optional}" title="{!optional settings::logging_type}{htmlspecialchars lang::login_screen::user}{/optional}{optional settings::logging_type}{htmlspecialchars lang::login_screen::email}{/optional}" class="text" id="inputUsername" name="username" value="{!optional settings::restrictions::disable_autofill}{optional username}{username}{/optional}{/optional}" tabindex="1"/>
					<input type="submit" value="{lang::login_screen::login}" id="submitLogin" class="submitLoginPC" name="_a[login]" tabindex="3"/>
					<input type="hidden" name="_a[login]" value="login"/>
				</div>
			{/optional} <!--CALENDAR LOGIN START-->
			<div id="errors">
				<div id="error_message"><table><tr><td>
						{optional error}
						<span class="error">
							{error}
							</span>
						{/optional}
						{optional message}<span class="message">{message}</span>{/optional}
					</td></tr></table></div>
			</div>
		</div>
	</div>
	<div id="footer">
		<div id="footerInner">
		</div>
		<div id="footerInfo">
			<center>
			<table cellspacing="0" cellpadding="0">
				<tr>
					<td id="footerActions" colspan="2">
						<table cellspacing="0" cellpadding="0" class="buttons_table">
							<tr>
								<td><div class="footerHeightHolder"></div></td>
								{!optional settings::restrictions::disable_languages}{optional languages}
								<td style="width: 33%;">
										<span class="btn btn_select pure_mobile full"><span><b><i><select size="1" name="language" id="selectLanguage">{dynamic languages}{optional .*::name}<option value="{.*::lang}"{optional *::selected} selected="selected"{/optional}>{.*::name}</option>{/optional}{/dynamic}</select><label>{dynamic languages}{optional .*::selected}{.*::name}{/optional}{/dynamic}</label></i></b></span></span>
								</td>
								{/optional}{/optional}
								{!optional calendar}{!optional licenseType 'simple'}{!optional get::forgotPassword}{!optional get::selfSignUp}{!optional settings::restrictions::disable_interfaces}{!optional get::changepwd}
								<td style="width: 33%;">
										<span class="btn btn_select pure_mobile full"><span><b><i><select size="1" name="to" id="to">{optional allowed_interfaces::advanced}<option value="pro" src="{base ''}client/skins/default/login/images/ico_desktop.png" class="image_option"{optional recomended_interface::main::nojs 'pro'} selected="selected"{/optional}>{lang::login_screen::pro}</option>{/optional}{optional allowed_interfaces::basic}<option value="basic" src="{base ''}client/skins/default/login/images/ico_tablet.png" class="image_option"{optional recomended_interface::main::nojs 'basic'} selected="selected"{/optional}>{lang::login_screen::basic}</option>{/optional}{optional allowed_interfaces::pda}<option value="pda" src="{base ''}client/skins/default/login/images/ico_mobile.png" class="image_option"{optional recomended_interface::main::nojs 'pda'} selected="selected"{/optional}>{lang::login_screen::pda}</option>{/optional}</select><label>{optional recomended_interface::main::nojs 'pro'}{lang::login_screen::pro}{/optional}{optional recomended_interface::main::nojs 'basic'}{lang::login_screen::basic}{/optional}{optional recomended_interface::main::nojs 'pda'}{lang::login_screen::pda}{/optional}</label></i></b></span></span>
										<input type="hidden" id="ri_js" value="{htmlspecialchars recomended_interface::main::js}"/>
								</td>
								{/optional}{/optional}{/optional}{/optional}{/optional}
								{!optional calendar}{!optional settings::restrictions::disable_licenses}
								<td style="width: 33%;">
									<a class="btn full btn_custom left_align" href="{url::install}?{OSCode}&lang={language}"><span><b><i><div>
										<div id="utilities">
											<div id="u_sizer">
												<div id="u_list">
													<div id="u_desktopClient" class="u_item">
														<div class="u_item_inner">
															<div><strong>{lang::utilities::iw_desktop_client}</strong></div>
															<div>{lang::utilities::iw_desktop_client_short}</div>
														</div>
													</div>
													<div id="u_outlookSync" class="u_item">
														<div class="u_item_inner">
															<div><strong>{lang::utilities::iw_outlook_sync}</strong></div>
															<div>{lang::utilities::iw_outlook_sync_short}</div>
														</div>
													</div>
													<div id="u_notifier" class="u_item">
														<div class="u_item_inner">
															<div><strong>{lang::utilities::iw_notifier}</strong></div>
															<div>{lang::utilities::iw_notifier_short}</div>
														</div>
													</div>
													<div id="u_calendar" class="u_item">
														<div class="u_item_inner">
															<div style="position:absolute;"><div style="font-weight: bold;height: 16px;left: -42px;position: relative;top: 10px;width: 24px;text-align:center;color:#6b6b6b;font-size:11px;line-height:15px;background-color:#fff;" id="date_day">8</div></div>
															<div><strong>{lang::utilities::calendar}</strong></div>
															<div>{lang::utilities::calendar_short}</div>
														</div>
													</div>
													<div id="u_freeBusy" class="u_item">
														<div class="u_item_inner">
															<div><strong>{lang::utilities::freebusy}</strong></div>
															<div>{lang::utilities::freebusy_short}</div>
														</div>
													</div>
													<div id="u_webDAV" class="u_item">
														<div class="u_item_inner">
															<div><strong>{lang::utilities::webdav}</strong></div>
															<div>{lang::utilities::webdav_short}</div>
														</div>
													</div>
												</div>
												<div id="u_description">
													<div id="u_calendar_description" class="u_description_item">
														<div><strong>{lang::utilities::internet_calendar}</strong></div>
														<div class="ajustify">
															{lang::utilities::internet_calendar_desc}
														</div>
														<br /><br />
														<div>
															<div class="aright"><small>{lang::utilities::internet_calendar_info_1}</small></div>
															<input type="text" class="text" value="{utilities::ical}" />
														</div>
														<div>
															<div class="aright"><small>{lang::utilities::internet_calendar_info_2}</small></div>
															<input type="text" class="text" value="{utilities::ical}?[email]" />
														</div>
														<div>
															<div class="aright"><small>{lang::utilities::basic_calendar}</small></div>
															<input type="text" class="text" value="{utilities::bcal}" />
														</div>
													</div>
													<div id="u_freeBusy_description" class="u_description_item">
														<div><strong>{lang::utilities::freebusy}</strong></div>
														<div class="ajustify">
															{lang::utilities::freebusy_desc}
														</div>
														<br /><br />
														<div>
															<div class="aright"><small>{lang::utilities::freebusy_url}</small></div>
															<input type="text" class="text" value="{utilities::freebusy}?[email]" />
														</div>
													</div>
													<div id="u_webDAV_description" class="u_description_item">
														<div><strong>{lang::utilities::webdav}</strong></div>
														<div class="ajustify">
															{lang::utilities::webdav_desc}
														</div>
														<br /><br />
														<div>
															<div class="aright"><small>{lang::utilities::webdav_info_1}</small></div>
															<input type="text" class="text" value="{utilities::webdav}[email]/" />
														</div>
														<div>
															<div class="aright"><small>{lang::utilities::webdav_info_2}</small></div>
															<input type="text" class="text" value="{utilities::webdav}[email]/[folder_name]" />
														</div>
													</div>
													<div id="u_notifier_description" class="u_description_item">
														<div><strong>{lang::utilities::iw_notifier}</strong></div>
														<div class="ajustify">
															{lang::utilities::notifier_desc}
														</div>
														<br /><br />
														<div>
															<div class="aright">
																<span href="{url::install}download/notifier-setup.exe">{lang::utilities::download_notifier}</span>
															</div>
															<div class="aright">
																<span href="{url::install}doc/notifier.pdf">{lang::utilities::notifier_guide}</span>
															</div>
														</div>
													</div>
													<div id="u_outlookSync_description" class="u_description_item">
														<div><strong>{lang::utilities::iw_outlook_sync}</strong></div>
														<div class="ajustify">
															{lang::utilities::outlook_sync_desc}
														</div>
														<br /><br />
														<div>
															<div class="aright">
																<span href="{url::install}download/outlook-sync.exe">{lang::utilities::download_outlook_sync}</span>
															</div>
															<div class="aright">
																<span href="{url::install}doc/outlooksyncguide.pdf">{lang::utilities::outlook_sync_guide}</span>
															</div>
														</div>
													</div>
													<div id="u_desktopClient_description" class="u_description_item">
														<div><strong>{lang::utilities::iw_desktop_client}</strong></div>
														<div class="ajustify">
															{lang::utilities::desktop_client_desc}
														</div>
														<br /><br />
														<div>
															<div class="aright">
																<span href="{url::install}download/desktop-setup.msi">{lang::utilities::download_desktop_client}</span>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>{lang::login_screen::utilities}</i></b></span></a>
								</td>
								{/optional}{/optional}{/optional}
								<td><div class="footerHeightHolder"></div></td>
							</tr>
						</table>
					</td>
				</tr>
				<tr id="copyright">
					<td colspan="2">
						{lang::login_screen::copy}{optional lang::login_screen::copy}{optional settings::restrictions::contact_support}{optional domain_admin_email} | {/optional}{/optional}{/optional}{optional settings::restrictions::contact_support}{optional domain_admin_email}<a href="?contactAdministrator=1">{lang::login_screen::contact_administrator}</a>{/optional}{/optional}
					</td>
				</tr>
			</table>
			</center>
		</div>
		<div id="footerBottom">
		</div>
	</div>
	
	{optional settings::restrictions::disable_interfaces}
		<input type="hidden" name="to" value="{optional recomended_interface::main::js}{recomended_interface::main::js}{/optional}{!optional recomended_interface::main::js}basic{/optional}"/>
	{/optional}
	{optional licenseType 'simple'}
		<input type="hidden" name="to" value="basic"/>
	{/optional}
	
	</form>
	
	<input type="hidden" value="{base ''}" id="baseMorseCode"/>
	{optional username}<input type="hidden" id="usernameSet" value="1"/>{/optional}
	{!optional calendar}<input type="hidden" id="self" value="{self}"/>{/optional}
	{optional time}<input type="hidden" id="time" value="{time}"/>{/optional}
	<input type="hidden" id="vk_lang" value="^{lang::login_screen::virtual_keyboard_01}^{lang::login_screen::virtual_keyboard_02}^^{lang::login_screen::virtual_keyboard_04}^{lang::login_screen::virtual_keyboard_05}^{lang::login_screen::virtual_keyboard_06}^{lang::login_screen::virtual_keyboard_07}^{lang::login_screen::virtual_keyboard_08}^^{lang::login_screen::virtual_keyboard_10}^{lang::login_screen::virtual_keyboard_11}"/>
	<input type="hidden" id="lang-login_screen-js_problem" value="{lang::login_screen::js_problem}"/>
	<iframe src="" id="saveFrame" class="almostHidden"></iframe>
	{optional picker}
	<div id="ee"><div class="eexbtn">&times;</div></div>
	<div id="eer"><div class="eexbtn">&times;</div></div>
	{/optional}
</body>
</html>