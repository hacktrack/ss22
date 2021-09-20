<!-- Outlook Sync - Login credentials -->
<div id="{anchor login_credentials}">
	<h3 class="box-content-title gamma">{SYNCHRONIZATION::LOGIN_CREDENTIALS}</h3>
	<div iw-flex-grid>

		<!-- Outlook Sync - Login credentials - Login -->
		<div iw-flex-cell class="form__block" id="{anchor fb_synchronization_frequency_login}">
			<h4 class="form__block-title">{SYNCHRONIZATION::LOGIN}</h4>

			<div iw-flex-grid>

				<!-- Outlook Sync - Login credentials - Login - Line security -->
				{include inc_form}
					{	"name": "line_security",
						"label_toggle": "synchronization::line_security",
						"toggle_element": "dropdown",
						"element_dropdown": true,
						"item_class": "row"
					}
				{/include}

				<!-- Outlook Sync - Login credentials - Login - Authentication method -->
				{include inc_form}
					{	"name": "authentication_method",
						"label_toggle": "synchronization::authentication_method",
						"toggle_element": "dropdown",
						"element_dropdown": true,
						"item_class": "row"
					}
				{/include}

				<!-- Outlook Sync - Login credentials - Login - Login port -->
				{include inc_form}
					{	"name": "login_port",
						"label_toggle": "synchronization::login_port",
						"toggle_element": "input",
						"element_input": true,
						"input_type": "number",
						"input_label": "generic::port",
						"item_class": "row"
					}
				{/include}

				<!-- Outlook Sync - Login credentials - Login - Do not show login errors -->
				{include inc_form}
					{	"name": "do_not_show_login_errors",
						"label_toggle": "synchronization::do_not_show_login_errors",
						"toggle_element": "dropdown",
						"element_dropdown": true,
						"dropdown_class": "short",
						"dropdown_values": [
							"generic::off",
							"generic::on"
						],
						"item_class": "row"
					}
				{/include}

				<!-- Outlook Sync - Login credentials - Login - Do not show connection errors -->
				{include inc_form}
					{	"name": "do_not_show_connection_errors",
						"label_toggle": "synchronization::do_not_show_connection_errors",
						"toggle_element": "dropdown",
						"element_dropdown": true,
						"dropdown_class": "short",
						"dropdown_values": [
							"generic::off",
							"generic::on"
						],
						"item_class": "row"
					}
				{/include}

			</div>
		</div>
	</div>
</div>


<!-- Outlook Sync - Advanced -->
<div id="{anchor advanced}" class="hide">
	<h3 class="box-content-title gamma">{ACCOUNTDETAIL::ADVANCED}</h3>
	<div iw-flex-grid>

		<!-- Outlook Sync - Advanced - Synchronization -->
		<div iw-flex-cell class="form__block" id="{anchor fb_advanced_synchronization}">
			<h4 class="form__block-title">{ACCOUNTDETAIL::SYNCHRONIZATION}</h4>
			<p class="form__block-desc">{ACCOUNTDETAIL_HELP::ADVANCED}</p>

			<div iw-flex-grid>

				<!-- Outlook Sync - Advanced - Synchronization - Folder synchronization threshold -->
				{include inc_form}
					{	"name": "folder_synchronization_threshold",
						"label_toggle": "accountdetail::folder_synchronization_threshold",
						"toggle_element": "input",
						"element_input": true,
						"input_type": "number",
						"input_label": "generic::messages",
						"item_class": "row",
						"description": "{ACCOUNTDETAIL_PLACEHOLDER::FOLDER_SYNCHRONIZATION_THRESHOLD}"
					}
				{/include}

				<!-- Outlook Sync - Advanced - Synchronization - Threshold for full download -->
				{include inc_form}
					{	"name": "threshold_for_full_download",
						"label_toggle": "accountdetail::threshold_for_full_download",
						"toggle_enables": "input_threshold_for_full_download, dropdown_threshold_for_full_download, toggle_download_files",
						"element_dropdown": true,
						"element_input": true,
						"input_type": "number",
						"input_label": "generic::size_mb"
					}
				{/include}

				<!-- Outlook Sync - Advanced - Synchronization - Download files  -->
				{include inc_form}
					{	"name": "download_files",
						"label_toggle": "accountdetail::download_files",
						"item_class": "row"
					}
				{/include}

				<!-- __________________________________________________________ -->

				<!-- Outlook Sync - Advanced - Synchronization - Skip trash folder startup check -->
				{include inc_form}
					{	"name": "skip_trash_folder",
						"label_toggle": "synchronization::skip_trash_folder",
						"toggle_element": "dropdown",
						"element_dropdown": true,
						"dropdown_class": "short",
						"dropdown_values": [
							"generic::off",
							"generic::on"
						],
						"item_class": "row"
					}
				{/include}

				<!-- Outlook Sync - Advanced - Synchronization - Disable TNEF -->
				{include inc_form}
					{	"name": "disable_tnef",
						"label_toggle": "synchronization::disable_tnef",
						"toggle_element": "dropdown",
						"element_dropdown": true,
						"dropdown_class": "short",
						"dropdown_values": [
							"generic::off",
							"generic::on"
						],
						"item_class": "row"
					}
				{/include}

			</div>
		</div>
	</div>
</div>


<!-- Outlook Sync - Synchronization -->
<div id="{anchor synchronization}" class="hide">
	<h3 class="box-content-title gamma">{ACCOUNTDETAIL::SYNCHRONIZATION}</h3>
	<div iw-flex-grid>

		<!-- Outlook Sync - Synchronization - Frequency -->
		<div iw-flex-cell class="form__block form__block--border" id="{anchor fb_synchronization_frequency}">
			<h4 class="form__block-title">{SYNCHRONIZATION::SYNCHRONIZATION_FREQUENCY}</h4>
			<p class="form__block-desc">{GENERIC::ENTER_TIME_IN_MINUTES}</p>

			<div iw-flex-grid>

				<!-- Outlook Sync - Synchronization - Frequency - Folder structure after -->
				{include inc_form}
					{	"name": "folder_structure_after",
						"label_toggle": "accountdetail::folder_structure_after",
						"toggle_element": "input",
						"element_input": true,
						"input_type": "number",
						"input_label": "generic::minutes",
						"item_class": "row"
					}
				{/include}

				<!-- Outlook Sync - Synchronization - Frequency - Selected priority folders -->
				{include inc_form}
					{	"name": "selected_priority_folders",
						"label_toggle": "accountdetail::selected_priority_folders",
						"toggle_element": "input",
						"element_input": true,
						"input_type": "number",
						"input_label": "generic::minutes",
						"item_class": "row"
					}
				{/include}

				<!-- Outlook Sync - Synchronization - Frequency - Selected standard folders -->
				{include inc_form}
					{	"name": "selected_standard_folders",
						"label_toggle": "accountdetail::selected_standard_folders",
						"toggle_element": "input",
						"element_input": true,
						"input_type": "number",
						"input_label": "generic::minutes",
						"item_class": "row"
					}
				{/include}

			</div>

		</div>

		<!-- Outlook Sync - Synchronization - Exceptions -->
		<div iw-flex-cell class="form__block" id="{anchor fb_synchronization_exceptions}">
			<h4 class="form__block-title">{SYNCHRONIZATION::SYNCHRONIZATION_EXCEPTIONS}</h4>
			<p class="form__block-desc">{ACCOUNTDETAIL_HELP::SYNCHRONIZATION}</p>

			<div iw-flex-grid>

				<!-- Outlook Sync - Synchronization - Exceptions - Content of folders -->
				{include inc_form}
					{	"name": "content_of_folders",
						"label_toggle": "accountdetail::content_of_folders",
						"toggle_element": "dropdown",
						"element_dropdown": true,
						"dropdown_class": "short",
						"dropdown_values": [
							"generic::off",
							"generic::on"
						],
						"item_class": "row"
					}
				{/include}

				<!-- Outlook Sync - Synchronization - Exceptions - GAL automatically -->
				{include inc_form}
					{	"name": "gal_automatically",
						"label_toggle": "accountdetail::gal_automatically",
						"toggle_element": "dropdown",
						"element_dropdown": true,
						"dropdown_class": "short",
						"dropdown_values": [
							"generic::off",
							"generic::on"
						],
						"item_class": "row"
					}
				{/include}

				<!-- Outlook Sync - Synchronization - Exceptions - Do not show progress -->
				{include inc_form}
					{	"name": "do_not_show_progress",
						"label_toggle": "synchronization::do_not_show_progress",
						"toggle_element": "dropdown",
						"element_dropdown": true,
						"dropdown_class": "short",
						"dropdown_values": [
							"generic::off",
							"generic::on"
						],
						"item_class": "row"
					}
				{/include}

				<!-- Outlook Sync - Synchronization - Exceptions - Automatically revert changes in read only folders -->
				{include inc_form}
					{	"name": "automatically_revert_changes",
						"label_toggle": "synchronization::automatically_revert_changes",
						"toggle_element": "dropdown",
						"element_dropdown": true,
						"dropdown_class": "short",
						"dropdown_values": [
							"generic::off",
							"generic::on"
						],
						"item_class": "row"
					}
				{/include}

			</div>

		</div>

	</div>
</div>


<!-- Outlook Sync - Appearance -->
<div id="{anchor appearance}" class="hide">
	<h3 class="box-content-title gamma">{ACCOUNTDETAIL::APPEARANCE}</h3>
	<div iw-flex-grid>

		<!-- Outlook Sync - Appearance - Address Books -->
		<div iw-flex-cell class="form__block form__block--border" id="{anchor fb_appearance_address_books}">
			<h4 class="form__block-title">{SYNCHRONIZATION::ADDRESS_BOOKS}</h4>

			<div iw-flex-grid>

				<!-- Outlook Sync - Appearance - Address Books - Display address book names -->
				{include inc_form}
					{	"name": "display_address_book_names",
						"label_toggle": "accountdetail::display_address_book_names",
						"toggle_element": "dropdown",
						"element_dropdown": true,
						"item_class": "row",
						"description": "{ACCOUNTDETAIL_HELP::APPEARANCE}"
					}
				{/include}

			</div>
		</div>

		<!-- Outlook Sync - Appearance - New mail options -->
		<div iw-flex-cell class="form__block" id="{anchor fb_appearance_new_mail_options}">
			<h4 class="form__block-title">{SYNCHRONIZATION::NEW_MAIL_OPTIONS}</h4>

			<div iw-flex-grid>

				<!-- Outlook Sync - Appearance - New mail options - Show desktop notification -->
				{include inc_form}
					{	"name": "show_desktop_notification",
						"label_toggle": "synchronization::show_desktop_notification",
						"toggle_element": "dropdown",
						"element_dropdown": true,
						"dropdown_class": "short",
						"dropdown_values": [
							"generic::off",
							"generic::on"
						],
						"item_class": "row"
					}
				{/include}

				<!-- Outlook Sync - Appearance - New mail options - Hide notification after -->
				{include inc_form}
					{	"name": "hide_notification_after",
						"label_text": "{SYNCHRONIZATION::HIDE_NOTIFICATION_AFTER}",
						"element_input": true,
						"input_type": "number",
						"input_label": "generic::seconds",
						"item_class": "row"
					}
				{/include}

				<!-- Outlook Sync - Appearance - New mail options - Play default sound -->
				{include inc_form}
					{	"name": "play_default_sound",
						"label_toggle": "synchronization::play_default_sound",
						"toggle_element": "dropdown",
						"element_dropdown": true,
						"dropdown_class": "short",
						"dropdown_values": [
							"generic::off",
							"generic::on"
						],
						"item_class": "row"
					}
				{/include}

			</div>
		</div>
	</div>
</div>


<!-- Outlook Sync - Licence and updates -->
<div id="{anchor licence_and_updates}" class="hide">
	<h3 class="box-content-title gamma">{SYNCHRONIZATION::LICENCE_AND_UPDATES}</h3>
	<div iw-flex-grid>

		<!-- Outlook Sync - Licence and updates - Updates -->
		<div iw-flex-cell class="form__block" id="{anchor fb_licence_and_updates_updates}">
			<h4 class="form__block-title">{SYNCHRONIZATION::UPDATES}</h4>

			<div iw-flex-grid>

				<!-- Outlook Sync - Licence and updates - Updates - Check for updates -->
				{include inc_form}
					{	"name": "check_for_updates",
						"label_toggle": "synchronization::check_for_updates",
						"toggle_element": "dropdown",
						"element_dropdown": true,
						"dropdown_class": "short",
						"dropdown_values": [
							"generic::off",
							"generic::on"
						],
						"item_class": "row"
					}
				{/include}

			</div>
		</div>
	</div>
</div>


<!-- Outlook Sync - Logs -->
<div id="{anchor logs}" class="hide">
	<h3 class="box-content-title gamma">{SYNCHRONIZATION::LOGS}</h3>
	<div iw-flex-grid>

		<!-- Outlook Sync - Logs - Logs -->
		<div iw-flex-cell class="form__block" id="{anchor fb_logs_logs}">
			<h4 class="form__block-title">{SYNCHRONIZATION::LOGS}</h4>

			<div iw-flex-grid>

				<!-- Outlook Sync - Logs - Logs - Logging level -->
				{include inc_form}
					{	"name": "logging_level",
						"label_toggle": "synchronization::logging_level",
						"toggle_element": "dropdown",
						"element_dropdown": true,
						"item_class": "row"
					}
				{/include}

				<!-- Outlook Sync - Logs - Logs - Delete logs -->
				{include inc_form}
					{	"name": "delete_logs",
						"label_toggle": "synchronization::delete_logs",
						"toggle_element": "dropdown",
						"element_dropdown": true,
						"dropdown_class": "short",
						"dropdown_values": [
							"generic::off",
							"generic::on"
						],
						"item_class": "row"
					}
				{/include}

				<!-- Outlook Sync - Logs - Logs - Delete after specified days -->
				{include inc_form}
					{	"name": "delete_after_specified_days",
						"label_text": "{SYNCHRONIZATION::DELETE_AFTER_SPECIFIED_DAYS}",
						"element_input": true,
						"input_type": "number",
						"input_label": "generic::days",
						"item_class": "row"
					}
				{/include}

			</div>
		</div>
	</div>
</div>
