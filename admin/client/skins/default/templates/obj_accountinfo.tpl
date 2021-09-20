<div class="panel error" iw-type="full" id="{anchor fi_account_is_disabled}" class="form-item" is-hidden="1">
	<div iw-flex-grid="fit">
	<div iw-flex-cell>
		<div iw-flex-grid="fit item-center">
		<div iw-flex-cell="none">
			<i class="panel-icon icon-warning"></i>
		</div>
		<div iw-flex-cell="half-padding item-center">
			<span class="panel-title">{ACCOUNTDETAIL::ACCOUNT_IS_DISABLED}</span>
		</div>
		</div>
	</div>
	</div>
</div>

<div iw-flex-grid="query 2 double-padding">

<!-- Account detail - Info - Left Col -->
<div iw-flex-cell>

	<!-- Account detail - Info - General -->
	<div class="form-section" id="{anchor fs_general}">
		<h3 class="box-content-title gamma">{ACCOUNTDETAIL::GENERAL}</h3>

		<div class="form-block" id="{anchor fb_general}">

			<div iw-flex-grid="query 2">

			<!-- Account detail - Info - General - Left Col -->
			<div iw-flex-cell>

				<div iw-flex-grid>

				<!-- Account detail - Info - General - First name -->
				<div iw-flex-cell id="{anchor fi_account_firstname}" class="form-item">
					<div class="form-label">
						<label class="label">{ACCOUNTDETAIL::NAME}</label>
					</div>
					<div class="form-row">
						<obj name="input_account_firstname" type="obj_input_text" tabindex="true">
							<placeholder>accountdetail::name</placeholder>
						</obj>
					</div>
				</div>

				<!-- Account detail - Info - General - Last name -->
				<div iw-flex-cell id="{anchor fi_account_lastname}" class="form-item">
					<div class="form-label">
						<label class="label">{ACCOUNTDETAIL::LASTNAME}</label>
					</div>
					<div class="form-row">
						<obj name="input_account_lastname" type="obj_input_text" tabindex="true">
							<placeholder>accountdetail::lastname</placeholder>
						</obj>
					</div>
				</div>

				<!-- Account detail - Info - General - User name -->
				<div iw-flex-cell id="{anchor fi_account_username}" class="form-item" {optional guest}is-hidden="1"{/optional}>
					<div class="form-label">
						<label class="label">{ACCOUNTDETAIL::USERNAME}</label>
					</div>
					<div class="form-row">
						<obj name="input_account_username" type="obj_input_text" tabindex="true">
							<placeholder>accountdetail::username</placeholder>
						</obj>
					</div>
				</div>

				<!-- Account detail - Info - General - Description -->
				<div iw-flex-cell id="{anchor fi_account_description}" class="form-item">
					<div class="form-label">
						<label class="label">{ACCOUNTDETAIL::DESCRIPTION}</label>
					</div>
					<div class="form-row">
						<obj name="input_account_description" type="obj_input_text" tabindex="true">
							<placeholder>accountdetail::description</placeholder>
						</obj>
					</div>
				</div>

				</div>

			</div>

			<!-- Account detail - Info - General - Right Col -->
			<div iw-flex-cell>

				<div iw-flex-grid>

				<!-- Account detail - Info - General - Account photo -->
				<div iw-flex-cell class="text-center">
					<div class="userhead large circle icon-user_default u-margin-half">
						<div id="{anchor userimage}" class="userhead-image"></div>
					</div>
				</div>

				<!-- Account detail - Info - General - Upload photo -->
				<div iw-flex-cell id="{anchor fi_account_upload_photo}" class="form-item">
					<div class="form-row margin">
						<obj name="button_upload_photo" type="obj_upload" css="text primary full icon-arrow-up" tabindex="true">
							<title>accountdetail::upload_photo</title>
						</obj>
					</div>
				</div>

				<!-- Account detail - Info - General - Change password -->
				<div iw-flex-cell id="{anchor fi_account_change_password}" class="form-item">
					<div class="form-row margin">
						<obj name="button_change_password" type="obj_button" css="text primary full" tabindex="true">
							<value>accountdetail::change_password</value>
						</obj>
					</div>
				</div>

				</div>

			</div>
			</div>

			<!-- Account detail - Info - General - Last time logged -->
			<div iw-flex-grid>

			<div iw-flex-cell id="{anchor fi_account_last_time_logged}" class="form-item">
				<div class="form-label">
					<div iw-flex-grid="2">
					<div iw-flex-cell="item-center">
						<label class="label">{ACCOUNTDETAIL::LAST_TIME_LOGGED}</label>
					</div>
					<div iw-flex-cell>
						<span class="u-normal-wrap weight-600"><span class="no-wrap"><span id="{anchor last_login_date}">00.00.0000</span> {ACCOUNTDETAIL::AT} <span id="{anchor last_login_time}">00:00:00</span></span> <span class="no-wrap">{ACCOUNTDETAIL::FROM} <span id="{anchor last_login_ip}">{ACCOUNTDETAIL::UNKNOWN_IP}</span></span></span>
					</div>
					</div>
				</div>
			</div>

			</div>

		</div>

		<!-- Account detail - Info - General - Aliases -->
		<div class="form-block" id="{anchor fb_aliases}" {optional guest}is-hidden="1"{/optional}>

			<div iw-flex-grid>

			<div iw-flex-cell id="{anchor fi_account_aliases}" class="form-item">
				<div class="form-label">
					<label class="label">{ACCOUNTDETAIL::ALIASES}</label>
				</div>
				<p class="form-desc">{ACCOUNTDETAIL_HELP::ALIASES}</p>

				<div id="{anchor aliases}">
					<obj name="multiple_add_alias" type="obj_input_multiple" css="text primary" tabindex="true">
						<placeholder>accountdetail::add_alias</placeholder>
					</obj>
				</div>

				<div class="form-row">
					<obj name="button_add_alias" type="obj_button" css="text primary" tabindex="true">
						<value>accountdetail::add_alias</value>
					</obj>
				</div>
			</div>

			</div>

		</div>

		<!-- Account detail - Info - Change user plan -->
		<h3 class="box-content-title gamma" is-hidden="1" id="{anchor fb_change_user_plan_title}">{ACCOUNTDETAIL::CHANGE_USER_PLAN}
			<obj name="plan_details" type="obj_button" css="text link" tabindex="true">
				<value>subscription::plan_details</value>
			</obj>
		</h3>

		<div class="form-block" id="{anchor fb_change_user_plan}" is-hidden="1"></div>

		<!-- Account detail - Info - Quotas -->
		<h3 class="box-content-title gamma" {optional guest}is-hidden="1"{/optional}>{ACCOUNTDETAIL::QUOTAS}</h3>
		<p class="box-content-desc" {optional guest}is-hidden="1"{/optional}>{ACCOUNTDETAIL_HELP::QUOTAS}</p>

		<div class="form-block" id="{anchor fb_quotas}" {optional guest}is-hidden="1"{/optional}>

			<div iw-flex-grid>

			<!-- Account detail - Info - Quotas - Emails sent -->
			<div iw-flex-cell id="{anchor fi_account_messagessenttoday}" class="form-item">
				<div class="form-row">
					<div iw-flex-grid="2">
					<div iw-flex-cell="item-center">
						<label class="label">{ACCOUNTDETAIL::NUMBERS_OF_EMAILS_SENT}</label>
					</div>
					<div iw-flex-cell>
						<obj name="quota_emails" type="obj_bar"></obj>
					</div>
					</div>
				</div>
			</div>

			<!-- Account detail - Info - Quotas - Storage usage -->
			<div iw-flex-cell id="{anchor fi_account_quota_emails}" class="form-item">
				<div class="form-row">
					<div iw-flex-grid="2">
					<div iw-flex-cell="item-center">
						<label class="label">{ACCOUNTDETAIL::STORAGE_USAGE}</label>
					</div>
					<div iw-flex-cell>
						<obj name="quota_storage" type="obj_bar"></obj>
					</div>
					</div>
				</div>
			</div>

			<!-- Account detail - Info - Quotas - Change quotas -->
			<div iw-flex-cell id="{anchor fi_account_quota_storage}" class="form-item">
				<div class="form-row">
					<obj name="button_change_quotas" type="obj_button" css="text primary" tabindex="true">
						<value>accountdetail::change_quotas</value>
					</obj>
				</div>
			</div>

			</div>

		</div>
	</div>

</div>

<!-- Account detail - Info - Right Col -->
<div iw-flex-cell {optional guest}is-hidden="1"{/optional}>

	<!-- Account detail - Info - Permissions & Rights -->
	<div class="form-section" id="{anchor fs_permissions_and_rights}">
		<h3 class="box-content-title gamma">{ACCOUNTDETAIL::PERMISSIONS_AND_RIGHTS}</h3>
		<p class="box-content-desc">{ACCOUNTDETAIL_HELP::PERMISSIONS_AND_RIGHTS}</p>

		<div class="form-block" id="{anchor fb_permissions_and_rights}">

			<div iw-flex-grid>
			<div iw-flex-cell="6">

				<div iw-flex-grid>

				<!-- Account detail - Info - Permissions & Rights - SaaS plan -->
				<div iw-flex-cell id="{anchor fi_subscription_plan}" class="form-item" is-hidden>
					<div class="form-label">
						<label class="label">{ACCOUNTDETAIL::SUBSCRIPTION_PLAN}</label>
					</div>
					<div class="form-row">
						<obj name="dropdown_subscription_plan" type="obj_dropdown_single" tabindex="true"></obj>
					</div>
				</div>

				<!-- Account detail - Info - Permissions & Rights - Account type -->
				<div iw-flex-cell id="{anchor fi_account_type}" class="form-item">
					<div class="form-label">
						<label class="label">{ACCOUNTDETAIL::ACCOUNT_TYPE}</label>
					</div>
					<div class="form-row">
						<obj name="dropdown_account_type" type="obj_dropdown_single" tabindex="true"></obj>
					</div>
				</div>

				<!-- Account detail - Info - Permissions & Rights - Account state -->
				<div iw-flex-cell id="{anchor fi_account_active}" class="form-item">
					<div class="form-label">
						<label class="label">{ACCOUNTDETAIL::ACCOUNT_STATE}</label>
					</div>
					<div class="form-row">
						<obj name="dropdown_account_active" type="obj_dropdown_single" tabindex="true"></obj>
					</div>
					<p class="form-desc">{ACCOUNTDETAIL_HELP::ACCOUNT_STATE}</p>
				</div>

				</div>

			</div>

			<!-- Account detail - Info - Permissions & Rights - Account icon -->
			<div iw-flex-cell="2 half-padding" class="text-center">
				<div class="account">
					<span id="{anchor user_type_icon}" class="account-icon icon-user type_0"></span>
					<span id="{anchor user_state_icon}" class="account-state icon-state state_0"></span>
				</div>
			</div>

			</div>

		</div>
		<div class="form-block" id="{anchor fb_buttons}">

			<div iw-flex-grid>

			<!-- Account detail - Info - Permisions & Rights - 2 factor authentication -->
			<div iw-flex-cell class="form__item" id="{anchor fi_2_factor_authentication}">
				<label class="label form__label" title="{ACCOUNTDETAIL::TWO_FACTOR_AUTHENTICATION}">
					<span class="label__text">{ACCOUNTDETAIL::TWO_FACTOR_AUTHENTICATION}</span>
				</label>
				<p class="form__element form__element--text text" id="{anchor text_2_factor_authentication}">
					{ACCOUNTDETAIL::DISABLED}
				</p>
				<obj name="button_2_factor_authentication" type="obj_button" css="form__element text primary" tabindex="true">
					<value>generic::reset</value><disabled>1</disabled>
				</obj>
			</div>

			<!-- Account detail - Info - Permissions & Rights - Shared folders -->
			<div iw-flex-cell id="{anchor fi_shared_folders}" class="form-item">
				<div class="form-row">
					<div iw-flex-grid="2">
					<div iw-flex-cell="item-center">
						<label class="label">{ACCOUNTDETAIL::SHARED_FOLDERS}</label>
					</div>
					<div iw-flex-cell>
						<obj name="button_account_permissions" type="obj_button" css="text primary full inline" tabindex="true">
							<value>accountdetail::permissions</value>
						</obj>
					</div>
					</div>
				</div>
			</div>

			<!-- Account detail - Info - Permissions & Rights - Account features -->
			<div iw-flex-cell id="{anchor fi_account_features}" class="form-item">
				<div class="form-row">
					<div iw-flex-grid="2">
					<div iw-flex-cell="item-center">
						<label class="label">{ACCOUNTDETAIL::ACCOUNT_FEATURES}</label>
					</div>
					<div iw-flex-cell>
						<obj name="button_account_features" type="obj_button" css="text primary full inline" tabindex="true">
							<value>accountdetail::features</value>
						</obj>
					</div>
					</div>
				</div>
			</div>

			<!-- Account detail - Info - Permissions & Rights - Certificates -->
			<!--
			<div iw-flex-cell id="{anchor fi_certificates}" class="form-item">
				<div class="form-row">
					<div iw-flex-grid="2">
					<div iw-flex-cell="item-center">
						<label class="label">{ACCOUNTDETAIL::DIGITAL_CERTIFICATES}</label>
					</div>
					<div iw-flex-cell>
						<obj name="button_account_certificates" type="obj_button" css="text primary full inline" tabindex="true">
							<value>accountdetail::certificates</value>
						</obj>
					</div>
					</div>
				</div>
			</div>
			-->

			</div>

		</div>


		<!-- Account detail - Info - Client Applications -->
		<h3 class="box-content-title gamma">{CLIENT_APPLICATIONS::CLIENT_APPLICATIONS}</h3>
		<p class="box-content-desc">{CLIENT_APPLICATIONS_HELP::CLIENT_APPLICATIONS}</p>

		<div class="form-block" id="{anchor fb_client_applications}">

			<!-- Account detail - Info - Client Applications - Mobile devices -->
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
					<obj name="button_account_mobile_devices_manage" type="obj_button" css="text primary" tabindex="true">
						<value>accountdetail::manage</value>
					</obj>
				</div>
				</div>
			</div>

			<!-- Account detail - Info - Client Applications - Icewarp Outlook Sync -->
			<div class="panel" iw-type="block"  id="{anchor outlook_sync}">
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
							<a id="{anchor button_account_icewarp_outlook_sync_download}" tabindex="true">{ACCOUNTDETAIL::DOWNLOAD}</a>
						</form>
						<obj name="button_account_icewarp_outlook_sync_manage" type="obj_button" css="text primary" tabindex="true">
							<value>accountdetail::manage</value>
						</obj>
						<obj name="button_account_icewarp_outlook_sync_licenses" type="obj_button" css="text primary hide" tabindex="true">
							<value>accountdetail::licenses</value>
						</obj>
					</div>
				</div>
				</div>
			</div>

			<!-- Account detail - Info - Client Applications - Icewarp desktop -->
			<div class="panel" iw-type="block"  id="{anchor icewarp_desktop}">
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
							<a id="{anchor button_account_icewarp_desktop_download}" tabindex="true">{ACCOUNTDETAIL::DOWNLOAD}</a>
						</form>
						<obj name="button_account_icewarp_desktop_licenses" type="obj_button" css="text primary hide" tabindex="true">
							<value>accountdetail::licenses</value>
						</obj>
					</div>
				</div>
				</div>
			</div>

		</div>
	</div>
</div>
</div>

