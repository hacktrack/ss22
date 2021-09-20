<div iw-flex-grid="query 2 double-padding">

<!-- Domain detail - Properties - Left Col -->
<div iw-flex-cell>

	<!-- Domain detail - Properties - General -->
	<div class="form-section" id="{anchor fs_general}">
		<h3 class="box-content-title gamma">{DOMAINDETAIL::GENERAL}</h3>

		<div class="form-block" id="{anchor fb_general}">
			<div iw-flex-grid>

			<!-- Domain detail - Properties - General - Name -->
			{include inc_form}
				{	"element_input": true,
					"input_placeholder": "domaindetail::name",
					"element_button": true,
					"button_class": "text  primary",
					"button_value": "domaindetail::rename",
					"name": "domain_name",
					"label_text": "{DOMAINDETAIL::NAME}"
				}
			{/include}

			<!-- Domain detail - Properties - General - Description -->
			<div iw-flex-cell id="{anchor fi_domain_description}" class="form-item">
				<div class="form-label">
					<label class="label">{DOMAINDETAIL::DESCRIPTION}</label>
				</div>
				<div class="form-row">
					<obj name="input_domain_description" type="obj_input_text" tabindex="true">
						<placeholder>domaindetail::description</placeholder>
					</obj>
				</div>
			</div>

			<!-- Domain detail - Properties - General - Type -->
			<div iw-flex-cell id="{anchor fi_domain_type}" class="form-item">
				<div class="form-label">
					<label class="label">{DOMAINDETAIL::TYPE}</label>
				</div>
				<div class="form-row">
					<obj name="dropdown_domain_type" type="obj_dropdown_single" tabindex="true"></obj>
				</div>
			</div>

			<!-- Domain detail - Properties - General - Value -->
			<div iw-flex-cell id="{anchor fi_value}" class="form-item">
				<div class="form-label">
					<label class="label">{DOMAINDETAIL::VAL}</label>
				</div>
				<div class="form-row">
					<div iw-flex-grid="fit group">
					<div iw-flex-cell>
						<obj name="input_value" type="obj_input_text" css="group-left" tabindex="true">
							<placeholder>domaindetail::val</placeholder>
						</obj>
					</div>
					<div iw-flex-cell="none">
						<obj name="button_value" type="obj_button" css="icon icon-add small group-right inner-button" tabindex="true"></obj>
					</div>
					</div>
				</div>
			</div>

			<div iw-flex-cell id="{anchor verification}">
				<div iw-flex-grid="query 2">

				<!-- Domain detail - Properties - General - Verification -->
				<div iw-flex-cell id="{anchor fi_verification}" class="form-item">
					<div class="form-label">
						<label class="label">{DOMAINDETAIL::VERIFICATION}</label>
					</div>
					<div class="form-row">
						<obj name="dropdown_verification" type="obj_dropdown_single" tabindex="true"></obj>
					</div>
				</div>

				<!-- Domain detail - Properties - General - Password -->
				<div iw-flex-cell id="{anchor fi_password}" class="form-item">
					<div class="form-label">
						<label class="label">{DOMAINDETAIL::PASSWORD}</label>
					</div>
					<div class="form-row">
						<obj name="input_password" type="obj_input_password" tabindex="true">
							<placeholder>domaindetail::password</placeholder>
						</obj>
					</div>
				</div>

				</div>
			</div>

			</div>
		</div>

		<div class="form-block" id="{anchor fb_aliases}">
			<div iw-flex-grid>

			<!-- Domain detail - Properties - General - Administrator email -->
			<div iw-flex-cell id="{anchor fi_administrator_email}" class="form-item">
				<div class="form-label">
					<label class="label">{DOMAINDETAIL::ADMINISTRATOR_EMAIL}</label>
				</div>
				<div class="form-row">
					<obj name="input_administrator_email" type="obj_input_email" tabindex="true">
						<placeholder>domaindetail::administrator_email</placeholder>
					</obj>
				</div>
			</div>

			<!-- Domain detail - Properties - General - Aliases -->
			<div iw-flex-cell id="{anchor fi_aliases}" class="form-item">
				<div class="form-label">
					<label class="label">{DOMAINDETAIL::ALIASES}</label>
				</div>
				<p class="form-desc">{DOMAINDETAIL_HELP::ALIASES}</p>

				<div id="{anchor aliases}">
					<obj name="multiple_add_alias" type="obj_input_multiple" css="text primary" tabindex="true">
						<placeholder>accountdetail::add_alias</placeholder>
					</obj>
				</div>

				<div class="form-row">
					<obj name="button_add_alias" type="obj_button" css="text primary" tabindex="true">
						<value>domaindetail::add_alias</value>
					</obj>
				</div>
			</div>

			</div>
		</div>
	</div>
	<!-- Domain detail - Properties - Quotas -->
	<div class="form-section" id="{anchor fs_quotas}">
		<h3 class="box-content-title gamma">{DOMAINDETAIL::QUOTAS}</h3>
		<p class="box-content-desc">{DOMAINDETAIL_HELP::QUOTAS}</p>

		<div class="form-block" id="{anchor fb_quotas}">
			<div iw-flex-grid>

			<!-- Domain detail - Properties - Quotas - Numbers of emails sent -->
			<div iw-flex-cell id="{anchor fi_numbers_of_emails_sent}" class="form-item">
				<div class="form-row">
					<div iw-flex-grid="2">
					<div iw-flex-cell="item-center">
						<label class="label">{DOMAINDETAIL::NUMBERS_OF_EMAILS_SENT}</label>
					</div>
					<div iw-flex-cell>
						<obj name="quota_emails" type="obj_bar"></obj>
					</div>
					</div>
				</div>
			</div>

			<!-- Domain detail - Properties - Quotas - Storage usage -->
			<div iw-flex-cell id="{anchor fi_storage_usage}" class="form-item">
				<div class="form-row">
					<div iw-flex-grid="2">
					<div iw-flex-cell="item-center">
						<label class="label">{DOMAINDETAIL::STORAGE_USAGE}</label>
					</div>
					<div iw-flex-cell>
						<obj name="quota_storage" type="obj_bar"></obj>
					</div>
					</div>
				</div>
			</div>

			<!-- Domain detail - Properties - Quotas - Change quotas -->
			<div iw-flex-cell id="{anchor fi_account_quota_storage}" class="form-item">
				<div class="form-row">
					<obj name="button_change_quotas" type="obj_button" css="text primary" tabindex="true">
						<value>domaindetail::change_quotas</value>
					</obj>
				</div>
			</div>
			</div>
		</div>
	</div>

</div>

<!-- Domain detail - Properties - Right Col -->
<div iw-flex-cell>

	<!-- Domain detail - Properties - Permisions & Rights -->
	<div class="form-section" id="{anchor fs_quotas}">
		<h3 class="box-content-title gamma">{DOMAINDETAIL::PERMISSIONS_AND_RIGHTS}</h3>
		<p class="box-content-desc">{DOMAINDETAIL_HELP::PERMISSIONS_AND_RIGHTS}</p>

		<div class="form-block" id="{anchor fb_permissions_and_rights}">
			<div iw-flex-grid>

			<!-- Domain detail - Properties - Permisions & Rights - Max allowed Subscription plan -->
			<div iw-flex-cell id="{anchor fi_max_allowed_plan}" class="form-item" is-hidden>
				<div class="form-label">
					<label class="label">{DOMAINDETAIL::MAX_ALLOWED_SUBSCRIPTION_PLAN}</label>
				</div>
				<div class="form-row">
					<obj name="dropdown_max_allowed_plan" type="obj_dropdown_single" tabindex="true"></obj>
				</div>
			</div>

			<!-- Domain detail - Properties - Permisions & Rights - Unknown accounts -->
			<div iw-flex-cell id="{anchor fi_unknown_accounts}" class="form-item">
				<div class="form-label">
					<label class="label">{DOMAINDETAIL::UNKNOWN_ACCOUNTS}</label>
				</div>
				<div class="form-row">
					<obj name="dropdown_unknown_accounts" type="obj_dropdown_single" tabindex="true"></obj>
				</div>
			</div>

			<!-- Domain detail - Properties - Permisions & Rights - Target email -->
			<div iw-flex-cell id="{anchor fi_target_email}" class="form-item">
				<div class="form-label">
					<label class="label">{DOMAINDETAIL::TARGET_EMAIL}</label>
				</div>
				<div class="form-row">
					<obj name="input_target_email" type="obj_input_email" tabindex="true">
						<placeholder>domaindetail::target_email</placeholder>
					</obj>
				</div>
			</div>

			</div>
		</div>

		<div class="form-block" id="{anchor fb_domain_features}">
			<div iw-flex-grid>

			<!-- Domain detail - Properties - Permisions & Rights - 2 factor authentication -->
			<div iw-flex-cell id="{anchor fi_2_factor_authentication}" class="form-item">
				<div class="form-row">
					<obj name="toggle_2_factor_authentication" type="obj_toggle" tabindex="true">
						<label>domaindetail::two_factor_authentication</label>
					</obj>
				</div>
			</div>

			<!-- Domain detail - Properties - Permisions & Rights - Instant messaging shared roster -->
			<div iw-flex-cell id="{anchor fi_instant_messaging_shared_roster}" class="form-item">
				<div class="form-row">
					<obj name="toggle_instant_messaging_shared_roster" type="obj_toggle" tabindex="true">
						<label>domaindetail::instant_messaging_shared_roster</label>
					</obj>
				</div>
			</div>

			<!-- Domain detail - Properties - Permisions & Rights - Domain features -->
			<div iw-flex-cell id="{anchor fi_features}" class="form-item">
				<div class="form-row">
					<div iw-flex-grid="2">
					<div iw-flex-cell="item-center">
						<label class="label">{DOMAINDETAIL::DOMAIN_FEATURES}</label>
					</div>
					<div iw-flex-cell>
						<obj name="button_domain_features" type="obj_button" css="text primary full inline" tabindex="true">
							<value>domaindetail::features</value>
						</obj>
					</div>
					</div>
				</div>
			</div>

			<!-- Domain detail - Properties - Permisions & Rights - DNS Validation -->
			<div iw-flex-cell id="{anchor fi_dns_validation}" class="form-item">
				<div class="form-row">
					<div iw-flex-grid="2">
					<div iw-flex-cell="item-center">
						<label class="label">{DOMAINDETAIL::DNS_VALIDATION}</label>
					</div>
					<div iw-flex-cell>
						<obj name="button_dns_validation" type="obj_button" css="text primary full inline" tabindex="true">
							<value>domaindetail::validation</value>
						</obj>
					</div>
					</div>
				</div>
			</div>

			<!-- Domain detail - Properties - Permisions & Rights - DKIM -->
			<div iw-flex-cell id="{anchor fi_dkim}" class="form-item">
				<div class="form-row">
					<div iw-flex-grid="2">
					<div iw-flex-cell="item-center">
						<label class="label">{DOMAINDETAIL::DKIM}</label>
					</div>
					<div iw-flex-cell>
						<obj name="button_dkim" type="obj_button" css="text primary full inline" tabindex="true">
							<value>domaindetail::DKIM</value>
						</obj>
					</div>
					</div>
				</div>
			</div>

			</div>
		</div>
	</div>

	<!-- Domain detail - Properties - Client Applications -->
	<h3 class="box-content-title gamma">{CLIENT_APPLICATIONS::CLIENT_APPLICATIONS}</h3>
	<p class="box-content-desc">{DOMAINDETAIL_HELP::CLIENT_APPLICATIONS}</p>

	<div class="form-block" id="{anchor fb_client_applications}">

		<!-- Domain detail - Properties - Client Applications - Mobile devices -->
		<div class="panel" iw-type="block" id="{anchor mobile_devices}">
			<div iw-flex-grid>
			<div iw-flex-cell="6">
				<h4 class="panel-title delta">{CLIENT_APPLICATIONS::MOBILE_DEVICES}</h4>
				<p class="form-desc">{CLIENT_APPLICATIONS_HELP::MOBILE_DEVICES}</p>
			</div>
			<div iw-flex-cell="2 half-padding" class="text-right">
				<span class="panel-icon icon-devices"></span>
			</div>
			</div>
			<div iw-flex-grid>
			<div iw-flex-cell>
				<div class="button-group">
					<obj name="button_domain_mobile_devices_manage" type="obj_button" css="text primary" tabindex="true">
						<value>domaindetail::manage</value>
					</obj>
				</div>
			</div>
			</div>
		</div>

		<!-- Domain detail - Properties - Client Applications - Outlook Sync -->
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
					<form class="button text primary">
						<a id="{anchor button_domain_icewarp_outlook_sync_download}" tabindex="true">{DOMAINDETAIL::DOWNLOAD}</a>
					</form>
					<obj name="button_domain_icewarp_outlook_sync_manage" type="obj_button" css="text primary" tabindex="true">
						<value>domaindetail::manage</value>
					</obj>
				</div>
			</div>
			</div>
		</div>

		<!-- Domain detail - Properties - Client Applications - Desktop client -->
		<div class="panel" iw-type="block" id="{anchor icewarp_desktop}">
			<div iw-flex-grid>
			<div iw-flex-cell="6">
				<h4 class="panel-title delta">{CLIENT_APPLICATIONS::ICEWARP_DESKTOP}</h4>
				<p class="form-desc">{CLIENT_APPLICATIONS_HELP::ICEWARP_DESKTOP}</p>
			</div>
			<div iw-flex-cell="2 half-padding" class="text-right">
				<span class="panel-icon icon-icewarp_desktop"></span>
			</div>
			</div>
			<div iw-flex-grid>
			<div iw-flex-cell>
				<div class="button-group">
					<form class="button text primary">
						<a id="{anchor button_domain_icewarp_desktop_download}" tabindex="true">{DOMAINDETAIL::DOWNLOAD}</a>
					</form>
				</div>
			</div>
			</div>
		</div>

	</div>

</div>
</div>
