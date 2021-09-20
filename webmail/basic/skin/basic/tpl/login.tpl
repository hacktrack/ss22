<div id="login.login">
<table>
	<tr>
		<th>
			<label for="username">{lang::login::user}</label>
		</th>
		<td>
			<input type="text" class="fancyInput" name="username" id="username"/>
		</td>
	</tr>
	<tr>
		<th>
			<label for="password">{lang::login::password}</label>
		</th>
		<td>
			<input type="password" class="fancyInput" name="password" id="password"/>
		</td>
	</tr>
	<tr>
		<th>
			<label for="remember">{lang::login::remember}</label>
		</th>
		<td>
			<select size="1" name="remember" id="remember" class="select">
				<option value="0">{lang::login::allways_ask}</option>
				<option value="1"{optional remember::type '1'} selected="selected"{/optional}>{lang::login::username}</option>
				<option value="2"{optional remember::type '2'} selected="selected"{/optional}>{lang::login::username_and_password}</option>
				<option value="3"{optional remember::type '3'} selected="selected"{/optional}>{lang::login::auto_login}</option>
			</select>
		</td>
	</tr>
	<tr>
		<th></th>
		<td>
			<input id="submit" type="submit" value="{lang::login::login}" class="fancyButton" name="_a[login]"/>
		</td>
	</tr>
</table>
<input type="hidden" name="hash" id="hash" value="{hash}"/>
<input type="hidden" name="_a[login]" value="login"/>
</div>