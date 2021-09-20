
<div id="shim"></div>
<div id="wrapper">

<div id="loginBox">
<div id="darkenBox">
<div id="loginBoxInner">

<form id="captcha" method="post">
	<fieldset>
	<legend>{lang::login::captcha}</legend>
	<h1>{lang::login::captcha}</h1>
	{captcha::info}
	<input type="hidden" class="fancyInput" name="captcha[uid]" id="captcha_uid" value="{captcha::uid}"/>
	<input type="hidden" name="session_start" value="1" />
	<input type="hidden" name="_dlg[captcha][action]" value="{dialog::action}" />
	<input type="hidden" name="_dlg[captcha][controller]" value="{dialog::controller}" />
	<input type="hidden" name="_dlg[captcha][type]" value="confirm" />
	<table>
		<tr>
			<th>
				<label for="username">{lang::login::captcha}</label>
			</th>
			<td>
				<img src="{captcha::url}" alt="Captcha" />
			</td>
		</tr>
		<tr>
			<th>
				<label for="username">{lang::login::word}</label>
			</th>
			<td>
				<input type="text" class="fancyInput" name="captcha[word]" id="captcha_word"/>
			</td>
		</tr>
		<tr>
			<th></th>
			<td>
				<input type="hidden" value="{lang::login::send}" name="_dlg[captcha][process]"/>
				<input type="submit" value="{lang::login::send}" class="fancyButton" name="_dlg[captcha][process]"/>
			</td>
		</tr>
	</table>
	<div id="errorBox">{dialog::error ''}</div>
	</fieldset>
</form>

</div>
</div>
</div>

</div>

<script>
	if (document.getElementById('captcha_word'))
	{
		document.getElementById('captcha_word').focus();
	}
</script>