<div iw-flex-grid="query 2 double-padding">

<!-- Account detail - Limits - Left Col -->
<div iw-flex-cell>

	<!-- Account detail - Limits - Limits -->
	<div class="form-section" id="{anchor fs_limits}">
		<h3 class="box-content-title gamma">{ACCOUNTDETAIL::LIMITS}</h3>
		<p class="box-content-desc">{ACCOUNTDETAIL_HELP::LIMITS}</p>

		<div class="form-block" id="{anchor fb_limits}">

			<div iw-flex-grid>

			<!-- Account detail - Limits - Limits - Account quote enabled -->
			{include inc_form}
				{	"element_input_bytes": true,
					"name": "account_quote_enabled",
					"label_toggle": "accountdetail::account_quote_enabled",
					"toggle_element": "input"
				}
			{/include}

			<!-- Account detail - Limits - Limits - Send out limit -->
			<div iw-flex-cell id="{anchor fi_send_out_message_limit}" class="form-item">
				<div class="form-label">
					<obj name="toggle_send_out_limit" type="obj_toggle" tabindex="true">
						<checked>1</checked>
						<toggle>send_out_limit</toggle>
						<label>accountdetail::send_out_limit</label>
					</obj>
				</div>
			</div>

			<div iw-flex-cell id="{anchor send_out_limit}" is-hidden="1">
				<div iw-flex-grid="query 2">

				<!-- Account detail - Limits - Limits - Send out data limit -->
				{include inc_form}
					{	"element_input_bytes": true,
						"name": "send_out_data_limit",
						"label_text": "{ACCOUNTDETAIL::SEND_OUT_DATA_LIMIT}",
						"toggle_element": "input",
						"base_unit": "MB"
					}
				{/include}

				<!-- Account detail - Limits - Limits - Send out message limit -->
				<div iw-flex-cell id="{anchor fi_send_out_message_limit}" class="form-item">
					<div class="form-label">
						<label class="label">{ACCOUNTDETAIL::SEND_OUT_MESSAGE_LIMIT}</label>
					</div>
					<div class="form-row">
						<obj name="input_send_out_message_limit" type="obj_input_number" tabindex="true">
							<placeholder>accountdetail::amount_per_day</placeholder>
						</obj>
					</div>
				</div>

				</div>
			</div>

			<!-- Account detail - Limits - Limits - Max message size -->
			{include inc_form}
				{	"element_input_bytes": true,
					"name": "max_message_size",
					"label_text": "{ACCOUNTDETAIL::MAX_MESSAGE_SIZE}",
					"toggle_element": "input"
				}
			{/include}

			<!-- Account detail - Limits - Limits - Delete mail older than -->
			<div iw-flex-cell id="{anchor fi_delete_mail_older_than}" class="form-item">
				<div class="form-label">
					<obj name="toggle_delete_mail_older_than" type="obj_toggle" tabindex="true">
						<toggle>delete_mail_older_than</toggle>
						<label>accountdetail::delete_mail_older_than</label>
					</obj>
				</div>
				<div class="form-row" id="{anchor delete_mail_older_than}" is-hidden="1">
					<obj name="input_delete_mail_older_than" type="obj_input_number" tabindex="true">
						<placeholder>accountdetail::days</placeholder>
						<label>generic::days</label>
					</obj>
				</div>
			</div>

			<!-- Account detail - Limits - Limits - Delete Spam emails older than (Days) -->
			<div iw-flex-cell id="{anchor fi_delete_spam_older_than}" class="form-item">
				<div class="form-label">
					<obj name="toggle_delete_spam_older_than" type="obj_toggle" tabindex="true">
						<toggle>delete_spam_older_than</toggle>
						<label>accountdetail::delete_spam_older_than</label>
					</obj>
				</div>
				<div class="form-row" id="{anchor delete_spam_older_than}" is-hidden="1">
					<obj name="input_delete_spam_older_than" type="obj_input_number" tabindex="true">
						<placeholder>accountdetail::days</placeholder>
						<label>generic::days</label>
					</obj>
				</div>
			</div>

			<!-- Account detail - Limits - Limits - User can send to local domains only -->
			<div iw-flex-cell id="{anchor fi_user_can_send_to_local_domains_only}" class="form-item">
				<div class="form-label">
					<obj name="toggle_user_can_send_to_local_domains_only" type="obj_toggle" tabindex="true">
						<label>accountdetail::user_can_send_to_local_domains_only</label>
					</obj>
				</div>
			</div>

			<!-- Account detail - Limits - Limits - Disable access to POP3 (IMAP only account) -->
			{include inc_form}
				{	"name": "disable_access_to_pop3",
					"label_toggle": "accountdetail::disable_access_to_pop3"
				}
			{/include}

			</div>

		</div>
	</div>

</div>

<!-- Account detail - Limits - Right Col -->
<div iw-flex-cell>

	<!-- Account detail - Limits - Expiration -->
	<div class="form-section" id="{anchor fs_expiration}">
		<h3 class="box-content-title gamma">{ACCOUNTDETAIL::EXPIRATION}</h3>
		<p class="box-content-desc">{ACCOUNTDETAIL_HELP::EXPIRATION}</p>

		<div class="form-block" id="{anchor fb_expiration}">

			<div iw-flex-grid="query 2">

			<!-- Account detail - Limits - Expiration - Status -->
			<div iw-flex-cell id="{anchor fi_expiration_status}" class="form-item">
				<div class="form-label">
					<label class="label">{ACCOUNTDETAIL::STATUS}</label>
				</div>
				<div class="form-row">
					<obj name="dropdown_expiration_status" type="obj_dropdown_single" tabindex="true"></obj>
				</div>
			</div>

			<!-- Account detail - Limits - Expiration - Expires if inactive for -->
			<div iw-flex-cell id="{anchor fi_expires_if_inactive_for}" class="form-item">
				<div class="form-label">
					<label class="label">{ACCOUNTDETAIL::EXPIRES_IF_INACTIVE_FOR}</label>
				</div>
				<div class="form-row">
					<obj name="input_expires_if_inactive_for" type="obj_input_number" tabindex="true">
						<placeholder>accountdetail::days</placeholder>
						<label>generic::days</label>
					</obj>
				</div>
			</div>

			<!-- Account detail - Limits - Expiration - Expires on -->
			<div iw-flex-cell="full" id="{anchor fi_expires_on}" class="form-item">
				<div class="form-label">
					<obj name="toggle_expires_on" type="obj_toggle" tabindex="true">
						<toggle>expires_on</toggle>
						<label>accountdetail::expires_on</label>
					</obj>
				</div>
				<div class="form-row" id="{anchor expires_on}" is-hidden="1">
					<obj name="input_expires_on" type="obj_input_date" tabindex="true"></obj>
				</div>
			</div>

			<!-- Account detail - Limits - Expiration - Notify before expiration -->
			<div iw-flex-cell="full" id="{anchor fi_notify_before_expiration}" class="form-item">
				<div class="form-label">
					<obj name="toggle_notify_before_expiration" type="obj_toggle" tabindex="true">
						<toggle>notify_before_expiration</toggle>
						<label>accountdetail::notify_before_expiration</label>
					</obj>
				</div>
				<div class="form-row" id="{anchor notify_before_expiration}" is-hidden="1">
					<obj name="input_notify_before_expiration" type="obj_input_number" tabindex="true">
						<placeholder>accountdetail::days</placeholder>
						<label>generic::days</label>
					</obj>
				</div>
			</div>

			<!-- Account detail - Limits - Expiration - Delete account when expired -->
			<div iw-flex-cell="full" id="{anchor fi_delete_account_when_expired}" class="form-item">
				<div class="form-label">
					<obj name="toggle_delete_account_when_expired" type="obj_toggle" tabindex="true">
						<label>accountdetail::delete_account_when_expired</label>
					</obj>
				</div>
			</div>

			</div>

		</div>
	</div>

</div>
</div>
