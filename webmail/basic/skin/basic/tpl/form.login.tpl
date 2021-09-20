<center>
	<form name="{id}_form" id="{id}"{optional method} method="{method}"{/optional}{optional script} action="{script}"{/optional}{optional enctype} enctype="{enctype}"{/optional} onsubmit="document.getElementById('jscontrol').value='1'; if (document.getElementById('remember').value==0 || document.getElementById('remember').value==1) { Login('{hash}',this); }">
	<input type="hidden" name="_c" value="{controller}" />
	<input type="hidden" name="_dlg[captcha][actions]" value="forgot|signup" />
	<input type="hidden" name="_dlg[captcha][controller]" value="auth" />
	<input type="hidden" name="_dlg[captcha][target]" value="main" />
	<input type="hidden" name="_n[p][{window}]" value="{view}" />
	<input type="hidden" name="_n[w]" value="{window}" />
	<input type="hidden" name="_n[js]" value="0" id="jscontrol"/>
	<input type="hidden" id="remember_type" value="{remember::type}" />
	<input type="hidden" id="autoLogin" value="{optional request::all::mid}no{/optional}{optional request::all::eid}no{/optional}{optional request::all::tid}no{/optional}"/>
	{dynamic variable}<input type="hidden" name="{*::var_name}" value="{*::var_value}{optional *}{/optional}" />{/dynamic}
	<input type="hidden" name="ctz" id="ctz" value="0" />

	<div id="l-main">
		<div class="welcome">{lang::login::welcome}</div>

		<div id="l-tabs">
			<div id="l-tabs-center-box" class="l-tabs-center-box{optional request::get::tab}{optional request::get::tab 'login'}-active{/optional}{/optional}{!optional request::get::tab}-active{/optional}">
				<div id="l-tabs-center">
				<!--      FIRST      -->
					<div class="l-tab-left{optional request::get::tab 'login'} l-active-tl-e{/optional}{!optional request::get::tab} l-active-tl-e{/optional} " id="login-left">
						<div id="login-right" class="{optional settings::restrictions::disable_forgot}{optional settings::restrictions::disable_signup} l-active-tr-e{/optional}{/optional} l-tab-right{optional request::get::tab 'forgot'} l-tab-right-no{/optional}{optional request::get::tab 'sign'}{optional settings::restrictions::disable_forgot} l-tab-right-no{/optional}{/optional} {optional request::get::tab 'login'} l-active-tr{/optional}{!optional request::get::tab} l-active-tr{/optional}">
							<a href="?_n[p][main]=win.login&amp;_n[w]=main&amp;tab=login" class="l-tab-center{optional request::get::tab 'login'} l-active{/optional}{!optional request::get::tab} l-active{/optional}" id="logintab">
								{lang::login::login}
							</a>
						</div>
					</div>
				<!--      /FIRST      -->
					{!optional settings::restrictions::disable_forgot}
					<div id="forgot-left" class="l-tab-left{optional request::get::tab 'login'} l-tab-left-no{/optional}{!optional request::get::tab} l-tab-left-no{/optional}{optional request::get::tab 'forgot'} l-active-tl{/optional}">
						<div id="forgot-right" class="l-tab-right{optional request::get::tab 'forgot'} l-active-tr{optional settings::restrictions::disable_signup}-e{/optional}{/optional}{optional request::get::tab 'sign'} l-tab-right-no{/optional}">
							<a id="forgottab" href="?_n[p][main]=win.login&amp;_n[w]=main&amp;tab=forgot" class="l-tab-center{optional request::get::tab 'forgot'} l-active{/optional}" >
								{lang::login::reset_password}
							</a>
						</div>
					</div>
					{/optional}
					{!optional settings::restrictions::disable_signup}
					<div id="sign-left" class="l-tab-left{optional request::get::tab 'sign'} l-active-tl{/optional}{optional request::get::tab 'forgot'} l-tab-left-no{/optional}{optional settings::restrictions::disable_forgot} l-tab-left-no{/optional}">
						<div id="sign-right" class="l-tab-right{optional request::get::tab 'sign'} l-active-tr-e{/optional}">
							<a id="signtab" href="?_n[p][main]=win.login&amp;_n[w]=main&amp;tab=sign" class="l-tab-center{optional request::get::tab 'sign'} l-active{/optional}" >
								{lang::login::sign_up}
							</a>
						</div>
					</div>
					{/optional}

				</div>
			</div>
		</div>

		<div id="l-top-right">
			<div id="l-top-left">
				<div id="l-top-center">
				</div>
			</div>
		</div>
		<div id="l-left">
			<div id="l-right">
				<div id="l-center">

					<img src="{optional request::all::_n::p::main 'win.main.public'}../basic/{/optional}{settings::logo_path}" alt="" id="logo"/>

					<div id="tab-login" class="{optional request::get::tab 'login'}show{/optional}{!optional request::get::tab}show{/optional}">
						<div style="padding-left:170px; .padding-left:160px">

							<table>
								<tr>
									<th style="width:150px">
										<label for="username">{optional settings::global::logging_type}{lang::login::email}{/optional}{!optional settings::global::logging_type}{lang::login::user}{/optional}</label>
									</th>
									<td>
										<input type="text" class="fancyInput" name="username" id="username"{optional request::errorData::form::username}value="{htmlspecialchars request::errorData::form::username}"{/optional}{!optional request::errorData::form::username}{optional remember::login} value="{remember::login}"{/optional}{/optional} autocomplete="off"/>
									</td>
								</tr>
								<tr>
									<th>
										<label for="password">{lang::login::password}</label>
									</th>
									<td>
										<input type="password" class="fancyInput" name="password" id="password"{optional remember::password} value="{htmlspecialchars remember::password}"{/optional}/>
									</td>
								</tr>
								{!optional settings::restrictions::disable_remember}
								<tr>
									<th>
										<label for="remember">{lang::login::remember}</label>
									</th>
									<td class="fancyInputBox">
										<select size="1" name="remember" id="remember" class="select">
											<option value="0">{lang::login::allways_ask}</option>
											<option value="1"{optional remember::type '1'} selected="selected"{/optional}>{lang::login::username}</option>
											<option value="2"{optional remember::type '2'} selected="selected"{/optional}>{lang::login::username_and_password}</option>
											<option value="3"{optional remember::type '3'} selected="selected"{/optional}>{lang::login::auto_login}</option>
										</select>
									</td>
								</tr>
								{/optional}
								{!optional settings::restrictions::disable_languages}
								<tr>
									<th>
										<label for="language">{lang::login::language}</label>
									</th>
									<td class="fancyInputBox">
										<select size="1" name="language" id="language" class="select">
										{dynamic settings::language}
											<option value="{*::value}"{optional *::selected} selected="selected"{/optional}>{*::name}</option>
										{/dynamic}
										</select>
									</td>
								</tr>
								{/optional}
								<tr>
									<td></td>
									<td style="display:none"><input type="checkbox" name="disable_ip_check" checked="checked"/> {lang::login::ip_check}</td>
								</tr>
								<tr>
									<td colspan="2" style="text-align:right; padding-top:15px;">{lang::login::switch}</td>
								</tr>
								<tr>
									<td colspan="2" style="text-align:right; padding-top:15px;">
										<input id="submit_but" type="submit" value="{lang::login::login}" class="fancyButton" name="_a[login]"/>
									</td>
								</tr>
							</table>

						</div>
						<div>
							<input type="hidden" name="hash" id="hash" value="{hash}"/>
							<input type="hidden" name="_a[login]" value="login"/>

							<noscript>
								<div class="noscript">
									<div class="acenter">{lang::login::no_javascript}
								</div>
							</noscript>
						</div>
					</div>

				</div>
			</div>
		</div>
		<div id="l-b-left"><div id="l-b-right"><div id="l-b-center">{anchor::footer}</div></div></div>
	</div>
</form>
</center>