<div iw-flex-grid="query 2 double-padding">

<!-- Account detail - Limits - Domain limits Col -->
<div iw-flex-cell>

	<!-- Domain detail - Limits - Domain limits -->
	<div class="form-section" id="{anchor fs_domain_limits}">
		<h3 class="box-content-title gamma">{DOMAINDETAIL::DOMAIN_LIMITS}</h3>
		<p class="box-content-desc">{DOMAINDETAIL_HELP::DOMAIN_LIMITS}</p>

		<div class="form-block" id="{anchor fb_domain_limits}">
			<div iw-flex-grid>

			<!-- Domain detail - Limits - Domain limits - Maximum # of accounts -->
			<div iw-flex-cell id="{anchor fi_domain_maximum_number_of_accounts}" class="form-item">
				<div class="form-label">
					<label class="label">{DOMAINDETAIL::MAXIMUM_NUMBER_OF_ACCOUNTS}</label>
				</div>
				<div class="form-row">
					<obj name="input_domain_maximum_number_of_accounts" type="obj_input_number" tabindex="true">
						<placeholder>domaindetail::maximum_number_of_accounts</placeholder>
					</obj>
				</div>
			</div>

			<!-- Domain detail - Limits - Domain limits - Disk quota -->
			{include inc_form}
				{	"element_input_bytes": true,
					"name": "domain_disk_quota",
					"label_toggle": "domaindetail::disk_quota",
					"toggle_element": "input"
				}
			{/include}

			<!-- Domain detail - Limits - Domain limits - Daily send out limit for domain -->
			<div iw-flex-cell id="{anchor fi_domain_daily_send_out_limit}" class="form-item">
				<div class="form-label">
					<obj name="toggle_domain_daily_send_out_limit" type="obj_toggle" tabindex="true">
						<checked>1</checked>
						<toggle>domain_daily_send_out_limit</toggle>
						<label>domaindetail::daily_send_out_limit_for_domain</label>
					</obj>
				</div>
			</div>

			<div iw-flex-cell id="{anchor domain_daily_send_out_limit}" is-hidden="1">
				<div iw-flex-grid="query 2">

				<!-- Domain detail - Limits - Domain limits - Daily data limit -->
				{include inc_form}
					{	"element_input_bytes": true,
						"name": "domain_daily_data_limit",
						"label_text": "{DOMAINDETAIL::DAILY_DATA_LIMIT}",
						"toggle_element": "input"
					}
				{/include}

				<!-- Domain detail - Limits - Domain limits - Daily message count limit -->
				<div iw-flex-cell id="{anchor fi_domain_daily_message_count_limit}" class="form-item">
					<div class="form-label">
						<label class="label">{DOMAINDETAIL::DAILY_MESSAGE_COUNT_LIMIT}</label>
					</div>
					<div class="form-row">
						<obj name="input_domain_daily_message_count_limit" type="obj_input_number" tabindex="true"><placeholder>domaindetail::number_per_day</placeholder></obj>
					</div>
				</div>

				</div>
			</div>

			<!-- Domain detail - Limits - Domain limits - Disable login to this domain -->
			<div iw-flex-cell id="{anchor fi_domain_disable_login}" class="form-item">
				<div class="form-label">
					<obj name="toggle_domain_disable_login" type="obj_toggle" tabindex="true">
						<label>domaindetail::disable_login_to_this_domain</label>
					</obj>
				</div>
			</div>

			</div>
		</div>
	</div>

</div>

<!-- Domain detail - Limits - User limits Col -->
<div iw-flex-cell>

	<!-- Domain detail - Limits - User limits -->
	<div class="form-section" id="{anchor fs_user_limits}">
		<h3 class="box-content-title gamma">{DOMAINDETAIL::USER_LIMITS}</h3>
		<p class="box-content-desc">{DOMAINDETAIL_HELP::USER_LIMITS}</p>

		<div class="form-block" id="{anchor fb_user_limits}">
			<div iw-flex-grid>

			<!--Domain detail - Limits - User limits - Account size -->
			{include inc_form}
				{	"element_input_bytes": true,
					"name": "domain_account_size",
					"label_text": "{DOMAINDETAIL::ACCOUNT_SIZE}",
					"toggle_element": "input"
				}
			{/include}

			<!--Domain detail - Limits - User limits - Default max message size -->
			{include inc_form}
				{	"element_input_bytes": true,
					"name": "domain_default_max_message_size",
					"label_text": "{DOMAINDETAIL::DEFAULT_MAX_MESSAGE_SIZE}",
					"toggle_element": "input"
				}
			{/include}

			<!-- Domain detail - Limits - User limits - Daily send out limit for domain -->
			<div iw-flex-cell id="{anchor fi_domain_default_daily_send_out_limit}" class="form-item">
				<div class="form-label">
					<obj name="toggle_domain_default_daily_send_out_limit" type="obj_toggle" tabindex="true">
						<checked>1</checked>
						<toggle>domain_default_daily_send_out_limit_for_users</toggle>
						<label>domaindetail::default_daily_send_out_limit_for_users</label>
					</obj>
				</div>
			</div>

			<div iw-flex-cell id="{anchor domain_default_daily_send_out_limit_for_users}" is-hidden="1">
				<div iw-flex-grid="query 2">

				<!-- Domain detail - Limits - User limits - Daily data limit -->
				{include inc_form}
					{	"element_input_bytes": true,
						"name": "domain_user_daily_data_limit",
						"label_text": "{DOMAINDETAIL::DAILY_DATA_LIMIT}",
						"toggle_element": "input",
						"base_unit": "MB"
					}
				{/include}

				<!-- Domain detail - Limits - Domain limits - Daily message count limit -->
				<div iw-flex-cell id="{anchor fi_domain_user_daily_message_count_limit}" class="form-item">
					<div class="form-label">
						<label class="label">{DOMAINDETAIL::DAILY_MESSAGE_COUNT_LIMIT}</label>
					</div>
					<div class="form-row">
						<obj name="input_domain_user_daily_message_count_limit" type="obj_input_number" tabindex="true"><placeholder>domaindetail::number_per_day</placeholder></obj>
					</div>
				</div>

				</div>
			</div>

			<!-- Domain detail - Limits - Limits - Delete Spam emails older than (Days) -->
			<div iw-flex-cell id="{anchor fi_delete_spam_older_than}" class="form-item">
				<div class="form-label">
					<obj name="toggle_delete_spam_older_than" type="obj_toggle" tabindex="true">
						<toggle>delete_spam_older_than</toggle>
						<label>domaindetail::delete_spam_older_than</label>
					</obj>
				</div>
				<div class="form-row" id="{anchor delete_spam_older_than}" is-hidden="1">
					<obj name="input_delete_spam_older_than" type="obj_input_number" tabindex="true">
						<placeholder>domaindetail::days</placeholder>
						<label>generic::days</label>
					</obj>
				</div>

			</div>

			</div>
		</div>
	</div>

</div>

<!-- Domain detail - Limits - Domain expiration Col -->
<div iw-flex-cell>

	<!-- Domain detail - Limits - Domain expiration -->
	<div class="form-section" id="{anchor fs_domain_expiration}">
		<h3 class="box-content-title gamma">{DOMAINDETAIL::DOMAIN_EXPIRATION}</h3>
		<p class="box-content-desc">{DOMAINDETAIL_HELP::DOMAIN_EXPIRATION}</p>

		<div class="form-block" id="{anchor fb_domain_expiration}">
			<div iw-flex-grid>

			<!-- Domain detail - Limits - Domain expiration - Expires on -->
			<div iw-flex-cell="full" id="{anchor fi_domain_expires_on}" class="form-item">
				<div class="form-label">
					<obj name="toggle_domain_expires_on" type="obj_toggle" tabindex="true">
						<toggle>domain_expires_on</toggle>
						<label>domaindetail::expires_on</label>
					</obj>
				</div>
				<div class="form-row" id="{anchor domain_expires_on}" is-hidden="1">
					<obj name="input_domain_expires_on" type="obj_input_date" tabindex="true"></obj>
				</div>
			</div>

			<!-- Domain detail - Limits - Domain expiration - Notify before expiration -->
			<div iw-flex-cell="full" id="{anchor fi_domain_notify_before_expiration}" class="form-item">
				<div class="form-label">
					<obj name="toggle_domain_notify_before_expiration" type="obj_toggle" tabindex="true">
						<toggle>domain_notify_before_expiration</toggle>
						<label>domaindetail::notify_before_expiration</label>
					</obj>
				</div>
				<div class="form-row" id="{anchor domain_notify_before_expiration}" is-hidden="1">
					<obj name="input_domain_notify_before_expiration" type="obj_input_number" tabindex="true">
						<placeholder>domaindetail::days</placeholder>
						<label>generic::days</label>
					</obj>
				</div>
			</div>

			<!-- Domain detail - Limits - Domain expiration - Delete domain when expired -->
			<div iw-flex-cell="full" id="{anchor fi_domain_delete_domain_when_expired}" class="form-item">
				<div class="form-label">
					<obj name="toggle_domain_delete_domain_when_expired" type="obj_toggle" tabindex="true">
						<label>domaindetail::delete_domain_when_expired</label>
					</obj>
				</div>
			</div>
			</div>
		</div>
	</div>

</div>


</div>
