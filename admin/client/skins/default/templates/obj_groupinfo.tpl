<div iw-flex-grid="query 2 double-padding">
<!-- Group - Properties - Left Col -->
<div iw-flex-cell>

	<!-- Group - Properties - General details -->
	<div class="form-section" id="{anchor fs_general_details}">
		<h3 class="box-content-title gamma">{GROUP::GENERAL_DETAILS}</h3>
		<p class="box-content-desc">{GROUP_HELP::GENERAL_DETAILS}</p>

		<div class="form-block" id="{anchor fb_general_details}">

			<div iw-flex-grid>

				<!-- Group - Properties - General details - Name -->
				<div iw-flex-cell id="{anchor fi_owner}" class="form-item">
					<div class="form-label">
						<label class="label">{GROUP::NAME}</label>
					</div>
					<div class="form-row">
						<obj name="input_owner" type="obj_input_text" tabindex="true">
							<placeholder>group::name</placeholder>
						</obj>
					</div>
				</div>

				<!-- Group - Properties - General details - Description -->
				<div iw-flex-cell id="{anchor fi_description}" class="form-item">
					<div class="form-label">
						<label class="label">{GROUP::DESCRIPTION}</label>
					</div>
					<div class="form-row">
						<obj name="input_description" type="obj_input_text" tabindex="true">
							<placeholder>group::description</placeholder>
						</obj>
					</div>
				</div>

				<!-- Group - Properties - General details - Alias -->
				<div iw-flex-cell id="{anchor fi_alias}" class="form-item">
					<div class="form-label">
						<label class="label">{GROUP::ALIAS}</label>
					</div>
					<div id="{anchor aliases}">
						<obj name="multiple_add_alias" type="obj_input_multiple" css="text primary" tabindex="true">
							<placeholder>accountdetail::add_alias</placeholder>
						</obj>
					</div>
					<div class="form-row">
						<obj name="button_add_alias" type="obj_button" css="text primary" tabindex="true">
							<value>group::add_alias</value>
						</obj>
					</div>
				</div>

			</div>

		</div>

	</div>

	<!-- Group - Properties - Group sharing -->
	<div class="form-section" id="{anchor fs_group_sharing}">
		<h3 class="box-content-title gamma">{GROUP::GROUP_SHARING}</h3>
		<p class="box-content-desc">{GROUP_HELP::GROUP_SHARING}</p>

		<div class="form-block" id="{anchor fb_group_sharing}">

			<div iw-flex-grid>

				<!-- Group - Properties - Group sharing - Create a public folder -->
				<div iw-flex-cell id="{anchor fi_create_public_folder}" class="form-item">
					<div class="form-label">
						<obj name="toggle_create_public_folder" type="obj_toggle" tabindex="true">
							<toggle>create_public_folder</toggle>
							<label>group::create_public_folder</label>
						</obj>
					</div>
					<div class="form-row" id="{anchor create_public_folder}" is-hidden="1">
						<obj name="input_create_public_folder" type="obj_input_text" tabindex="true">
							<placeholder>group_placeholder::create_public_folder</placeholder>
						</obj>
					</div>
				</div>

				<!-- Group - Properties - Group sharing - Setup permissions and rights -->
				<div iw-flex-cell id="{anchor fi_setup_permissions}" class="form-item">
					<div class="form-row">
						<div iw-flex-grid="2">
						<div iw-flex-cell="item-center">
							<label class="label">{GROUP::SETUP_PERMISSIONS}</label>
						</div>
						<div iw-flex-cell>
							<obj name="btn_permissions" type="obj_button" css="text primary full inline" tabindex="true">
								<value>group::permissions</value>
							</obj>
						</div>
						</div>
					</div>
				</div>

			</div>

		</div>

	</div>

	<!-- Group - Properties - Group e-mail delivery -->
	<div id="{anchor group_email_delivery}" is-hidden="1">
		<div class="form-section" id="{anchor fs_group_email_delivery}">
			<h3 class="box-content-title gamma">{GROUP::GROUP_EMAIL_DELIVERY}</h3>
			<p class="box-content-desc">{GROUP_HELP::GROUP_EMAIL_DELIVERY}</p>

			<div class="form-block" id="{anchor fb_group_email_delivery}">

				<div iw-flex-grid>

					<!-- Group - Properties - Group e-mail delivery - Deliver mail to shared folder -->
					<div iw-flex-cell id="{anchor fi_deliver_mail}" class="form-item">
						<div class="form-row">
							<div iw-flex-grid="fit">
							<div iw-flex-cell>
								<obj name="dropdown_deliver_mail" type="obj_dropdown_single" tabindex="true"></obj>
							</div>
							<div iw-flex-cell="none item-center" class="no-wrap deliver_mail" status="1" id="{anchor deliver_mail_icon}">
								<i class="icon-status"></i>
							</div>
							</div>
						</div>
					</div>

					<!-- Group - Properties - Group e-mail delivery - Do not deliver to members with quota exceeded -->
					<div iw-flex-cell id="{anchor fi_do_not_deliver}" class="form-item">
						<div class="form-label">
							<obj name="toggle_do_not_deliver" type="obj_toggle" tabindex="true">
								<label>group::do_not_deliver</label>
							</obj>
						</div>
					</div>

				</div>

			</div>

		</div>
	</div>

</div>
<!-- Group - Properties - Right Col -->
<div iw-flex-cell>

	<!-- Group - Properties - Security -->
	<div class="form-section" id="{anchor fs_security}">
		<h3 class="box-content-title gamma">{GROUP::SECURITY}</h3>
		<p class="box-content-desc">{GROUP_HELP::SECURITY}</p>

		<div class="form-block" id="{anchor fb_security}">

			<div iw-flex-grid>

				<!-- Group - Properties - Security - Only members can post new messages -->
				<div iw-flex-cell id="{anchor fi_only_members_can_post}" class="form-item">
					<div class="form-label">
						<obj name="toggle_only_members_can_post" type="obj_toggle" tabindex="true">
							<label>group::only_members_can_post</label>
						</obj>
					</div>
				</div>

				<!-- Group - Properties - Security - Password protection -->
				<div iw-flex-cell id="{anchor fi_password_protection}" class="form-item">
					<div class="form-label">
						<obj name="toggle_password_protection" type="obj_toggle" tabindex="true">
							<toggle>password_protection</toggle>
							<label>group::password_protection</label>
						</obj>
					</div>
					<div class="form-row" id="{anchor password_protection}" is-hidden="1">
						<obj name="input_password_protection" type="obj_input_password" tabindex="true">
							<placeholder>generic::enter_password</placeholder>
						</obj>
					</div>
				</div>

				<!-- Group - Properties - Security - Max number of messages to send out in 1 minute -->
				<div iw-flex-cell id="{anchor fi_max_number_of_messages}" class="form-item">
					<div class="form-label">
						<label class="label">{GROUP::MAX_NUMBER_OF_MESSAGES}</label>
					</div>
					<div class="form-row">
						<obj name="input_max_number_of_messages" type="obj_input_number" tabindex="true">
							<placeholder>group::max_number_of_messages</placeholder>
						</obj>
					</div>
				</div>

			</div>

		</div>

	</div>

	<!-- Group - Properties - TeamChat -->
	<div class="form-section" id="{anchor fs_teamchat}" is-hidden="1">
		<h3 class="box-content-title gamma">{GROUP::TEAMCHAT}</h3>

		<div class="form__block" id="{anchor fb_teamchat}">
			<div iw-flex-grid>

			<!-- Group - Properties - TeamChat - Enable TeamChat -->
			{include inc_form}
				{	"name": "enable_teamchat",
					"label_toggle": "group::enable_teamchat",
					"description": "{GROUP_HELP::TEAMCHAT}"
				}
			{/include}

			</div>
		</div>
	</div>

	<!-- Group - Properties - Advanced settings -->
	<div id="{anchor advanced_settings}" is-hidden="1">
		<div class="form-section" id="{anchor fs_advanced_settings}">
			<h3 class="box-content-title gamma">{GROUP::ADVANCED_SETTINGS}</h3>
			<p class="box-content-desc">{GROUP_HELP::ADVANCED_SETTINGS}</p>

			<div class="form-block" id="{anchor fb_advanced_settings}">

				<div iw-flex-grid>

					<!-- Group - Properties - Advanced settings - Populate Global Address List (GAL) with all members -->
					<div iw-flex-cell id="{anchor fi_populate_gal}" class="form-item">
						<div class="form-label">
							<obj name="toggle_populate_gal" type="obj_toggle" tabindex="true">
								<label>group::populate_gal</label>
							</obj>
						</div>
						<p class="form-desc">{GROUP_HELP::POPULATE_GAL}</p>
					</div>

					<!-- Group - Properties - Advanced settings - Allow GAL export for other servers within distributed domain -->
					<div iw-flex-cell id="{anchor fi_allow_gal_export}" class="form-item">
						<div class="form-label">
							<obj name="toggle_allow_gal_export" type="obj_toggle" tabindex="true">
								<label>group::allow_gal_export</label>
							</obj>
						</div>
						<p class="form-desc">{GROUP_HELP::ALLOW_GAL_EXPORT}</p>
					</div>

					<!-- Group - Properties - Advanced settings - Organize GAL into hierarchical address book (HAB) -->
					<div iw-flex-cell id="{anchor fi_organize_gal}" class="form-item">
						<div class="form-label">
							<obj name="toggle_organize_gal" type="obj_toggle" tabindex="true">
								<label>group::organize_gal</label>
							</obj>
						</div>
						<p class="form-desc">{GROUP_HELP::ORGANIZE_GAL}</p>
					</div>

				</div>

			</div>
		</div>
	</div>

</div>
</div>
