<!-- Add new domain -->
<div iw-flex-grid id="{anchor add_new_domain}" is-hidden="1">

<!-- Add new account - Domain -->
<div iw-flex-cell id="{anchor fi_domain}" class="form-item">
	<div class="form-label">
		<label class="label">{GENERIC::DOMAIN_NAME}</label>
	</div>
	<div class="form-row">
		<obj name="input_domain" type="obj_input_text" tabindex="true"><placeholder>generic::domain_name</placeholder></obj>
	</div>
</div>
</div>

<!-- Add new account -->
<div iw-flex-grid id="{anchor add_new_account}">

<!-- Add new account - Plan selection -->
{optional type::user}
<div iw-flex-cell id="{anchor fi_plan}" class="form-item">
	<div class="form-label">
		<label class="label">{GENERIC::PLAN_SELECTION}</label>
		<obj name="plan_details" type="obj_button" css="text link" tabindex="true">
			<value>subscription::plan_details</value>
		</obj>
	</div>
	</div>
{/optional}

<div iw-flex-cell id="{anchor fi_plan_separator}"><hr></div>

<!-- Add new account - Name -->
{noptional type::mailinglist}
<div iw-flex-cell id="{anchor fi_name}" class="form-item">
	<div class="form-label">
		{optional type::group}
		<label class="label">{GENERIC::GROUP_NAME}</label>
		{/optional}
		{optional type::resource}
		<label class="label">{GENERIC::RESOURCE_NAME}</label>
		{/optional}
		{noptional type::group}{noptional type::resource}
		<label class="label">{GENERIC::FIRST_NAME}</label>
		{/noptional}{/noptional}
	</div>
	<div class="form-row">
		<obj name="input_name" type="obj_input_text" tabindex="true"><placeholder>generic::name</placeholder></obj>
	</div>
</div>
{/noptional}

<!-- Add new account - Surname -->
{optional type::user}
<div iw-flex-cell id="{anchor fi_surname}" class="form-item">
	<div class="form-label">
		<label class="label">{GENERIC::SURNAME}</label>
	</div>
	<div class="form-row">
		<obj name="input_surname" type="obj_input_text" tabindex="true"><placeholder>generic::surname</placeholder></obj>
	</div>
</div>
{/optional}

<!-- Add new account - Alias -->
{noptional type::domain}
<div iw-flex-cell id="{anchor fi_alias}" class="form-item">
	<div class="form-label">
		<label class="label">{GENERIC::ALIAS}</label>
	</div>
	<div class="form-row">
		<div iw-flex-grid="fit group">
		<div iw-flex-cell>
			<obj name="input_alias" type="obj_input_text" tabindex="true"><placeholder>generic::alias</placeholder></obj>
		</div>
		</div>
	</div>
</div>
{/noptional}

<!-- Add new account - Maliling list source -->
{optional type::mailinglist}
<div iw-flex-cell id="{anchor fi_source}" class="form-item">
	<div class="form-label">
		<label class="label">{MAILINGLIST::SOURCE}</label>
	</div>
	<div class="form-row">
		<div iw-flex-grid="fit group">
		<div iw-flex-cell>
			<obj name="dropdown_source" type="obj_dropdown_single" tabindex="true"></obj>
		</div>
		</div>
	</div>
</div>
{/optional}

<!-- Add new account - Password -->
{optional type::user}
<div iw-flex-cell id="{anchor fi_password}" class="form-item">
	<div class="form-label">
		<label class="label">{GENERIC::PASSWORD}</label>
	</div>
	<div class="form-row">
		<div iw-flex-grid="fit group">
		<div iw-flex-cell>
			<obj name="input_password" type="obj_input_text" tabindex="true" css="group-left"></obj>
			<span class="_error_placeholder" is-hidden="1">accountdetail::check_password_policy</span>
		</div>
		<div iw-flex-cell="none">
			<obj name="button_generate_password" type="obj_button" css="text group-right inner-button" tabindex="true"><placeholder>generic::password</placeholder><value>generic::generate</value></obj>
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
</div>
{/optional}

{optional type::resource}
<div iw-flex-cell id="{anchor fi_type}" class="form-item">
	<div class="form-label">
		<label class="label">{GENERIC::TYPE}</label>
	</div>
	<div class="form-row">
		<div iw-flex-grid="fit group">
		<div iw-flex-cell>
			<obj name="dropdown_type" type="obj_dropdown_single" tabindex="true"><placeholder>generic::type</placeholder></obj>
		</div>
		</div>
	</div>
</div>
{/optional}

</div>
