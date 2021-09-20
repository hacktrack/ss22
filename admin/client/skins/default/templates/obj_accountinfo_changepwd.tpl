<div iw-flex-grid>
<div iw-flex-cell>
	<!-- Account detail - Info - Change password - Password -->
	<div class="form-label">
		<div iw-flex-grid>
		<div iw-flex-cell>
			<label class="label">{ACCOUNTDETAIL::PASSWORD}</label>
		</div>
		</div>
	</div>
	<div class="form-row">
		<div iw-flex-grid="fit group">
		<div iw-flex-cell>
			<obj name="input_change_password" type="obj_input_text" tab="1" css="group-left" tabindex="true"></obj>
			<span class="_error_placeholder" is-hidden="1">accountdetail::password_not_saved</span>
		</div>
		<div iw-flex-cell="none">
			<obj name="button_generate_password" type="obj_button" css="text group-right inner-button" tabindex="true">
				<value>accountdetail::generate</value>
			</obj>
		</div>
		</div>
	</div>
	<ul class="form-desc" id="{anchor pwdp}" is-hidden="1">
		<li id="{anchor pwdp_useralias}">{ACCOUNTDETAIL::PASSWORD_POLICY_USERALIAS} <span></span></li>
		<li id="{anchor pwdp_minlength}">{ACCOUNTDETAIL::PASSWORD_POLICY_MINLENGTH} <span></span></li>
		<li id="{anchor pwdp_digits}">{ACCOUNTDETAIL::PASSWORD_POLICY_DIGITS} <span></span></li>
		<li id="{anchor pwdp_nonalphanum}">{ACCOUNTDETAIL::PASSWORD_POLICY_NONALPHANUM} <span></span></li>
		<li id="{anchor pwdp_alpha}">{ACCOUNTDETAIL::PASSWORD_POLICY_ALPHA} <span></span></li>
		<li id="{anchor pwdp_upperalpha}">{ACCOUNTDETAIL::PASSWORD_POLICY_UPPERALPHA} <span></span></li>
	</ul>
	<!-- Account detail - Info - Change password - Password again -->
	<!--
	<div class="form-label">
		<div iw-flex-grid>
		<div iw-flex-cell>
			<label class="label">{ACCOUNTDETAIL::PASSWORD_AGAIN}</label>
		</div>
		</div>
	</div>
	<div class="form-row">
		<div iw-flex-grid>
		<div iw-flex-cell>
			<obj name="input_change_password_again" type="obj_input_password" tab="1"></obj>
		</div>
		</div>
	</div>
	-->
	<!-- Account detail - Info - Change password - Must change password -->
	<div class="form-row" id="{anchor pwd_expire}" is-hidden='1'>
		<obj name="toggle_must_change_password" type="obj_toggle" tabindex="true">
			<label>accountdetail::must_change_password</label>
		</obj>
	</div>
</div>
</div>
