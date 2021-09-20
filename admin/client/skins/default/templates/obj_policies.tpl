<div iw-flex-grid="query 2 double-padding">
<div iw-flex-cell>

	<h3 class="box-content-title gamma">{POLICIES::LOGIN_POLICY}</h3>
	<div iw-flex-grid class="form-block" id="{anchor fb_login_policy}">

	<!-- Policies - Login policy - Block user login accounts -->
	{include inc_form}
		{	"element_input": true,
			"input_type": "number",
			"label_toggle": "policies::block_user_login_accounts",
			"name": "block_user_login_accounts",
			"item_class": "row"
		}
	{/include}

	<!-- Policies - Login policy - Block user login time -->
	{include inc_form}
		{	"element_input": true,
			"input_type": "number",
			"input_label": "generic::minutes",
			"label_text": "{POLICIES::BLOCK_USER_LOGIN_TIME}",
			"name": "block_user_login_time",
			"item_class": "row"
		}
	{/include}

	<!-- Policies - Login policy - Login policy mode -->
	{include inc_form}
		{	"element_dropdown": true,
			"label_text": "{POLICIES::LOGIN_POLICY_MODE}",
			"name": "login_policy_mode"
		}
	{/include}

	<!-- Policies - Login policy - Require administrator -->
	{include inc_form}
		{	"label_toggle": "policies::require_administrator",
			"name": "require_administrator"
		}
	{/include}

	</div>
	<div iw-flex-grid class="form-block" id="{anchor fb_login_settings}">

	<!-- Policies - Login policy - Users login -->
	{include inc_form}
		{	"element_radio":
			[
				{	"name": "usernames",
					"label": "policies::usernames"
				},
				{	"name": "email_addresses",
					"label": "policies::email_addresses"
				}
			],
			"name": "users_login",
			"label_text": "{POLICIES::USERS_LOGIN}"
		}
	{/include}

	<!-- Policies - Login policy - Convert usernames -->
	{include inc_form}
		{	"label_toggle": "policies::convert_usernames",
			"name": "convert_usernames"
		}
	{/include}

	</div>
	<div iw-flex-grid class="form-block" id="{anchor fb_login_ip_restrictions}">

	<!-- Policies - Login policy - Account IP restriction -->
	{include inc_form}
		{	"label_toggle": "policies::account_ip_restriction",
			"name": "account_ip_restriction"
		}
	{/include}

	</div>

	<div class="form-block" id="{anchor fb_outlook_sync}">

		<!-- Policies - Outlook Sync -->
		<div class="panel" iw-type="block" id="{anchor outlook_sync}">
			<div iw-flex-grid>
			<div iw-flex-cell="6">
				<h4 class="panel-title delta">{CLIENT_APPLICATIONS::ICEWARP_OUTLOOK_SYNC}</h4>
				<p class="form-desc">{CLIENT_APPLICATIONS_HELP::ICEWARP_OUTLOOK_SYNC}</p>
			</div>
			<div iw-flex-cell="2 half-padding" class="text-right">
				<span class="panel-icon icon-outlook_sync"></span>
			</div>
			</div>
			<div iw-flex-grid>
			<div iw-flex-cell>
				<div class="button-group">
					<obj name="button_outlook_sync" type="obj_button" css="text primary" tabindex="true">
						<value>policies::manage</value>
					</obj>
				</div>
			</div>
			</div>
		</div>

	</div>

</div>
<div iw-flex-cell>

	<h3 class="box-content-title gamma">{POLICIES::PASSWORD_POLICY}</h3>
	<h4 class="form__block-title">{POLICIES::GENERAL}</h4>
	<div iw-flex-grid class="form-block" id="{anchor fb_general}">

	<!-- Policies - Password policy - General active -->
	{include inc_form}
		{	"label_toggle": "policies::active",
			"name": "general_active"
		}
	{/include}

	<!-- Policies - Password policy - Password cannot contain -->
	{include inc_form}
		{	"label_toggle": "policies::password_cannot_contain",
			"name": "password_cannot_contain"
		}
	{/include}

	<!-- Policies - Password policy - Enable password -->
	{include inc_form}
		{	"label_toggle": "policies::enable_password",
			"name": "enable_password"
		}
	{/include}

	</div>

	<h4 class="form__block-title">{POLICIES::PASSWORD_FORMAT}</h4>
	<div iw-flex-grid class="form-block" id="{anchor fb_password_format}">

	<!-- Policies - Password policy - Minimal password length -->
	{include inc_form}
		{	"element_input": true,
			"input_type": "number",
			"label_text": "{POLICIES::MINIMAL_PASSWORD_LENGTH}",
			"name": "minimal_password_length",
			"item_class": "row"
		}
	{/include}

	<!-- Policies - Password policy - Numeric -->
	{include inc_form}
		{	"element_input": true,
			"input_type": "number",
			"label_text": "{POLICIES::NUMERIC}",
			"name": "numeric",
			"item_class": "row"
		}
	{/include}

	<!-- Policies - Password policy - Non alpha-numeric -->
	{include inc_form}
		{	"element_input": true,
			"input_type": "number",
			"label_text": "{POLICIES::NON_ALPHA_NUMERIC}",
			"name": "non_alpha_numeric",
			"item_class": "row"
		}
	{/include}

	<!-- Policies - Password policy - Alpha -->
	{include inc_form}
		{	"element_input": true,
			"input_type": "number",
			"label_text": "{POLICIES::ALPHA}",
			"name": "alpha",
			"item_class": "row"
		}
	{/include}

	<!-- Policies - Password policy - Uppercase alpha -->
	{include inc_form}
		{	"element_input": true,
			"input_type": "number",
			"label_text": "{POLICIES::UPPERCASE_ALPHA}",
			"name": "uppercase_alpha",
			"item_class": "row"
		}
	{/include}

	</div>

	<h4 class="form__block-title">{POLICIES::PASSWORD_EXPIRATION}</h4>
	<div iw-flex-grid class="form-block" id="{anchor fb_password_expiration}">

	<!-- Policies - Password policy - Password expiration active -->
	{include inc_form}
		{	"label_toggle": "policies::active",
			"name": "password_expiration_active"
		}
	{/include}

	<!-- Policies - Password policy - Password expires after -->
	{include inc_form}
		{	"element_input": true,
			"input_type": "number",
			"input_label": "generic::days",
			"label_text": "{POLICIES::PASSWORD_EXPIRES_AFTER}",
			"name": "password_expires_after",
			"item_class": "row"
		}
	{/include}

	<!-- Policies - Password policy - Notify before expiration -->
	{include inc_form}
		{	"element_input": true,
			"input_type": "number",
			"input_label": "generic::days",
			"label_toggle": "policies::notify_before_expiration",
			"name": "notify_before_expiration",
			"item_class": "row"
		}
	{/include}

	</div>

	<h4 class="form__block-title">{POLICIES::PASSWORD_RETRIEVAL}</h4>
	<div iw-flex-grid class="form-block" id="{anchor fb_password_retrieval}">

	<!-- Policies - Password policy - Administrator passwords read exported -->
	{include inc_form}
		{	"label_toggle": "policies::admin_passwords_read_exported",
			"name": "admin_passwords_read_exported"
		}
	{/include}

	</div>

</div>
</div>
