<center>
	<form id="{id}"{optional name} name="{name}"{/optional}{optional method} method="{method}"{/optional}{optional script} action="{script}"{/optional}{optional enctype} enctype="{enctype}"{/optional} onsubmit="document.getElementById('jscontrol').value='1'">
		<fieldset style="display:none;">		
			<input type="hidden" name="_c" value="{controller}" />
			<input type="hidden" name="_n[p][{window}]" value="{view}" />
			<input type="hidden" name="_n[w]" value="{window}" />
			<input type="hidden" name="_n[js]" value="0" id="jscontrol"/>
			{dynamic variable}<input type="hidden" name="{*::var_name}" value="{*::var_value}" />{/dynamic}
		</fieldset>
		<table>
		<tr>
		<td style="width:150px">
			<div class="logo"></div>
		</td>
		<td style="width:350px">
		<div class="fancyLabel">{lang::login::welcome}</div>
			<div style="overflow: hidden; width: 100%; position:relative; top:1px">
				<a href="#" class="tab activeTab" onclick="showhide('loginfulltab',this); return false" id="logintab">
					{lang::login::login}
				</a>
				<a href="#" class="tab" onclick="showhide('forgotfulltab',this); return false">
					{lang::login::reset_password}
				</a>
				<a href="#" class="tab" onclick="showhide('signupfulltab',this); return false">
					{lang::login::sign_up}
				</a>
			</div>
			<div style="overflow: hidden; width: 100%; height:2px; background-color:#efefef; border:#A0A0A0 1px solid">
			</div>
			<div style="height:125px;">
				<div id="loginfulltab">	
					<div>{body}</div>
				</div>
				<div id="forgotfulltab" class="hidden">
					<fieldset>	
					<table>
						<tr>
							<th>
								<label for="username">{lang::login::email} : </label>
							</th>
							<td>
								<input type="text" class="fancyInput" name="forgot_username" id="forgot_username"/>
							</td>
						</tr>					
						<tr>
							<th></th>
							<td>
								<input type="submit" value="Send" class="fancyButton" name="_a[reset]"/>
							</td>
						</tr>
					</table>
					</fieldset>
				</div>
				<div id="signupfulltab" class="hidden">
					<fieldset>	
					<table>
						<tr>
							<th>
								<label for="signup_username">{lang::login::username} : </label>
							</th>
							<td>
								<input type="text" class="fancyInput" name="signup_username" id="signup_username"/>
							</td>
						</tr>
						<tr>
							<th>
								<label for="signup_domain">{lang::login::domain} : </label>
							</th>
							<td>
								<select size="1" name="signup_domain" id="signup_domain">
									<option value="merakdemo.com">merakdemo.com</option>
								</select>
							</td>
						</tr>
						<tr>
							<th>
								<label for="signup_password">{lang::login::new_password} : </label>
							</th>
							<td>
								<input type="password" class="fancyInput" name="signup_password" id="signup_password"/>
							</td>
						</tr>
						<tr>
							<th>
								<label for="signup_confirmpassword">{lang::login::confirm_password} : </label>
							</th>
							<td>
								<input type="password" class="fancyInput" name="signup_confirmpassword" id="signup_confirmpassword"/>
							</td>
						</tr>
						<tr>
							<th>
								<label for="signup_name">{lang::login::full_name} : </label>
							</th> 
							<td>
								<input type="text" class="fancyInput" name="signup_name" id="signup_name"/>
							</td>
						</tr>
						<tr>
							<th>
								<label for="signup_aemail">{lang::login::alternative_email} : </label>
							</th>
							<td>
								<input type="text" class="fancyInput" name="signup_aemail" id="signup_aemail"/>
							</td>
						</tr>
						<tr>
							<th></th>
							<td>
								<input type="submit" value="Sign up" class="fancyButton" name="_a[signup]"/>
							</td>
						</tr>
					</table>
					</fieldset>
				</div>
			</div>
		</td>
		</tr>
		</table>
	</form>
</center>
