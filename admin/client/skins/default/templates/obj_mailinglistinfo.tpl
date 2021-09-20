<div iw-flex-grid="query 2 double-padding">
<!-- Mailing list - Properties - Left Col -->
<div iw-flex-cell>

	<!-- Mailing list - Properties - General details -->
	<div class="form-section" id="{anchor fs_general_details}">
		<h3 class="box-content-title gamma">{MAILINGLIST::GENERAL_DETAILS}</h3>
		<p class="box-content-desc">{MAILINGLIST_HELP::GENERAL_DETAILS}</p>

		<div class="form-block" id="{anchor fb_general_details}">

			<div iw-flex-grid>

				<!-- Mailing list - Properties - General details - Owner -->
				<div iw-flex-cell id="{anchor fi_owner}" class="form-item">
					<div class="form-label">
						<label class="label">{MAILINGLIST::OWNER}</label>
					</div>
					<div class="form-row">
						<div iw-flex-grid="fit">
						<div iw-flex-cell>
							<obj name="input_owner" type="obj_input_email" tabindex="true">
								<placeholder>mailinglist::owner</placeholder>
							</obj>
						</div>
						<div iw-flex-cell="none half-padding">
							<obj name="btn_owner" type="obj_button" css="text primary" tabindex="true">
								<value>generic::select</value>
							</obj>
						</div>
						</div>
					</div>
				</div>

				<!-- Mailing list - Properties - General details - Description -->
				<div iw-flex-cell id="{anchor fi_description}" class="form-item">
					<div class="form-label">
						<label class="label">{MAILINGLIST::DESCRIPTION}</label>
					</div>
					<div class="form-row">
						<obj name="input_description" type="obj_input_text" tabindex="true">
							<placeholder>mailinglist::description</placeholder>
						</obj>
					</div>
				</div>

				<!-- Mailing list - Properties - General details - Alias -->
				<div iw-flex-cell id="{anchor fi_alias}" class="form-item">
					<div class="form-label">
						<label class="label">{MAILINGLIST::ALIAS}</label>
					</div>
					<div id="{anchor aliases}"></div>
					<div class="form-row">
						<obj name="button_add_alias" type="obj_button" css="text primary" tabindex="true">
							<value>mailinglist::add_alias</value>
						</obj>
					</div>
				</div>

			</div>

		</div>

	</div>

	<!-- Mailing list - Properties - Members source -->
	<div class="form-section" id="{anchor fs_members_source}">
		<h3 class="box-content-title gamma">{MAILINGLIST::MEMBERS_SOURCE}</h3>
		<p class="box-content-desc">{MAILINGLIST_HELP::MEMBERS_SOURCE}</p>

		<div class="form-block" id="{anchor fb_members_source}">

			<div iw-flex-grid>

				<!-- Mailing list - Properties - Members source - Source -->
				<div iw-flex-cell id="{anchor fi_source}" class="form-item">
					<div class="form-label">
						<label class="label">{MAILINGLIST::SOURCE}</label>
					</div>
					<div class="form-row">
						<obj name="dropdown_source" type="obj_dropdown_single" tabindex="true"></obj>
					</div>
				</div>

			</div>

		</div>

	</div>

</div>

<!-- Mailing list - Properties - Right Col -->
<div iw-flex-cell>

	<!-- Mailing list - Properties - Security -->
	<div class="form-section" id="{anchor fs_security}">
		<h3 class="box-content-title gamma">{MAILINGLIST::SECURITY}</h3>
		<p class="box-content-desc">{MAILINGLIST_HELP::SECURITY}</p>

		<div class="form-block" id="{anchor fb_security}">

			<div iw-flex-grid>

				<!-- Mailing list - Properties - Security - Only members can post new messages -->
				<div iw-flex-cell id="{anchor fi_only_members_can_post}" class="form-item">
					<div class="form-label">
						<obj name="toggle_only_members_can_post" type="obj_toggle" tabindex="true">
							<label>mailinglist::only_members_can_post</label>
						</obj>
					</div>
				</div>

				<!-- Mailing list - Properties - Security - Password protection -->
				<div iw-flex-cell id="{anchor fi_password_protection}" class="form-item">
					<div class="form-label">
						<label class="label">{MAILINGLIST::PASSWORD_PROTECTION}</label>
					</div>
					<div class="form-row">
						<obj name="dropdown_password_protection" type="obj_dropdown_single" tabindex="true"></obj>
					</div>
				</div>

				<!-- Mailing list - Properties - Security - Password -->
				<div iw-flex-cell id="{anchor fi_password}" class="form-item">
					<div class="form-label">
						<label class="label">{MAILINGLIST::PASSWORD}</label>
					</div>
					<div class="form-row">
						<obj name="input_password" type="obj_input_password" tabindex="true" tabindex="true">
							<placeholder>mailinglist::password</placeholder>
						</obj>
					</div>
				</div>

				<!-- Mailing list - Properties - Security - Default rights -->
				<div iw-flex-cell id="{anchor fi_default_rights}" class="form-item">
					<div class="form-label">
						<label class="label">{MAILINGLIST::DEFAULT_RIGHTS}</label>
					</div>
					<div class="form-row">
						<obj name="dropdown_default_rights" type="obj_dropdown_single" tabindex="true"></obj>
					</div>
				</div>

				<!-- Mailing list - Properties - Security - Max number of messages to send out in 1 minute -->
				<div iw-flex-cell id="{anchor fi_max_number_of_messages}" class="form-item">
					<div class="form-label">
						<label class="label">{MAILINGLIST::MAX_NUMBER_OF_MESSAGES}</label>
					</div>
					<div class="form-row">
						<obj name="input_max_number_of_messages" type="obj_input_number" tabindex="true">
							<placeholder>mailinglist::max_number_of_messages</placeholder>
						</obj>
					</div>
				</div>

			</div>

		</div>

	</div>

	<!-- Mailing list - Properties - Settings -->
	<div class="form-section" id="{anchor fs_settings}">
		<h3 class="box-content-title gamma">{MAILINGLIST::SETTINGS}</h3>
		<p class="box-content-desc">{MAILINGLIST_HELP::SETTINGS}</p>

		<div class="form-block" id="{anchor fb_settings}">

			<div iw-flex-grid>

				<!-- Mailing list - Properties - Settings - Send to sender -->
				<div iw-flex-cell id="{anchor fi_send_to_sender}" class="form-item">
					<div class="form-label">
						<obj name="toggle_send_to_sender" type="obj_toggle" tabindex="true">
							<label>mailinglist::send_to_sender</label>
						</obj>
					</div>
				</div>

				<!-- Mailing list - Properties - Settings - Forward copy to owner -->
				<div iw-flex-cell id="{anchor fi_forward_copy_to_owner}" class="form-item">
					<div class="form-label">
						<obj name="toggle_forward_copy_to_owner" type="obj_toggle" tabindex="true">
							<label>mailinglist::forward_copy_to_owner</label>
						</obj>
					</div>
				</div>

				<!-- Mailing list - Properties - Settings - Remove failed email addresses -->
				<div iw-flex-cell id="{anchor fi_remove_failed_email_addresses}" class="form-item">
					<div class="form-label">
						<obj name="toggle_remove_failed_email_addresses" type="obj_toggle" tabindex="true">
							<label>mailinglist::remove_failed_email_addresses</label>
						</obj>
					</div>
				</div>

				<!-- Mailing list - Properties - Settings - Do not deliver to members with quota exceeded -->
				<div iw-flex-cell id="{anchor fi_do_not_deliver}" class="form-item">
					<div class="form-label">
						<obj name="toggle_do_not_deliver" type="obj_toggle" tabindex="true">
							<label>mailinglist::do_not_deliver</label>
						</obj>
					</div>
				</div>

			</div>

		</div>

	</div>

</div>
</div>
