<div iw-flex-grid>
<div iw-flex-cell>
	<div class="form-label">
		<div iw-flex-grid><div iw-flex-cell>
			<label class="label">{ACCOUNTDETAIL::OLD_PASSWORD}</label>
		</div></div>
	</div>
	<div class="form-row">
		<div iw-flex-grid><div iw-flex-cell>
			<obj name="input_old_password" type="obj_input_password" tab="1" tabindex="true"></obj>
		</div></div>
	</div>

	<div class="form-label">
		<div iw-flex-grid><div iw-flex-cell>
			<label class="label">{ACCOUNTDETAIL::NEW_PASSWORD}</label>
		</div></div>
	</div>
	<div class="form-row">
		<div iw-flex-grid><div iw-flex-cell>
			<obj name="input_change_password" type="obj_input_password" tabindex="true"></obj>
		</div></div>
	</div>

	<div class="form-label">
		<div iw-flex-grid><div iw-flex-cell>
			<label class="label">{ACCOUNTDETAIL::PASSWORD_AGAIN}</label>
		</div></div>
	</div>
	<div class="form-row">
		<div iw-flex-grid><div iw-flex-cell>
			<obj name="input_change_password_again" type="obj_input_password" tabindex="true"></obj>
		</div></div>
	</div>

	<ul class="form-desc" id="{anchor pwdp}" is-hidden="1">
		<li id="{anchor pwdp_user_alias}" is-hidden="1">{ACCOUNTDETAIL::PASSWORD_POLICY_USERALIAS} <span></span></li>
		<li id="{anchor pwdp_min_length}" is-hidden="1">{ACCOUNTDETAIL::PASSWORD_POLICY_MINLENGTH} <span></span></li>
		<li id="{anchor pwdp_numeric_chars}" is-hidden="1">{ACCOUNTDETAIL::PASSWORD_POLICY_DIGITS} <span></span></li>
		<li id="{anchor pwdp_non_alpha_num_chars}" is-hidden="1">{ACCOUNTDETAIL::PASSWORD_POLICY_NONALPHANUM} <span></span></li>
		<li id="{anchor pwdp_alpha_chars}" is-hidden="1">{ACCOUNTDETAIL::PASSWORD_POLICY_ALPHA} <span></span></li>
		<li id="{anchor pwdp_upper_alpha_chars}" is-hidden="1">{ACCOUNTDETAIL::PASSWORD_POLICY_UPPERALPHA} <span></span></li>
	</ul>
</div>
</div>
