<!-- Rulecard -->

<!-- Rulecard - Buttons -->
<div class="rulecard-buttons">
	{optional action_sendmessage action_header}
	<obj name="button_settings" type="obj_button" css="icon small icon-settings rulecard-settings rulecard-button"></obj>
	{/optional}
	<obj name="button_delete" type="obj_button" css="icon grey icon-delete rulecard-delete rulecard-button"></obj>
	<obj name="expand" type="obj_button" css="icon small icon-dropdown-arrow rulecard-expand rulecard-button"></obj>
</div>

<!-- Rulecard - Content -->
<div class="rulecard-content">

	<!-- Rulecard - Label -->
	<h4 class="rulecard-title" id="{anchor title}"><span class="weight-600" id="{anchor title_bold}"></span><span id="{anchor title_regular}"></span></h4>

	<div class="rulecard-component">
		<div iw-flex-grid>

		<!-- Rulecard - Component - ACTIONS -->
		{optional action_copyfolder}

		<!-- Rulecard - Component - Copy to folder -->
		<div iw-flex-cell id="{anchor fi_copy_to_folder}" class="form-item">
			<div class="form-label">
				<label class="label">{RULECARD::COPY_TO_FOLDER}</label>
			</div>
			<div class="form-row">
				<div iw-flex-grid="fit group">
				<div iw-flex-cell>
					<obj name="input_copy_to_folder" type="obj_input_text" tabindex="true" css="group-left">
						<placeholder>rulecard::copy_to_folder</placeholder>
					</obj>
				</div>
				<div iw-flex-cell="none">
					<obj name="button_folderpicker" type="obj_button" css="icon icon-folder small group-right inner-button" tabindex="true"></obj>
				</div>
				</div>
			</div>
		</div>

		{/optional}

		{optional action_movefolder}

		<!-- Rulecard - Component - Move to folder -->
		<div iw-flex-cell id="{anchor fi_move_to_folder}" class="form-item">
			<div class="form-label">
				<label class="label">{RULECARD::MOVE_TO_FOLDER}</label>
			</div>
			<div class="form-row">
				<div iw-flex-grid="fit group">
				<div iw-flex-cell>
					<obj name="input_move_to_folder" type="obj_input_text" tabindex="true" css="group-left">
						<placeholder>rulecard::move_to_folder</placeholder>
					</obj>
				</div>
				<div iw-flex-cell="none">
					<obj name="button_folderpicker" type="obj_button" css="icon icon-folder small group-right inner-button" tabindex="true"></obj>
				</div>
				</div>
			</div>
		</div>

		{/optional}

		{optional action_forward}

		<!-- Rulecard - Component - Email address -->
		<div iw-flex-cell id="{anchor fi_email_address}" class="form-item">
			<div class="form-label">
				<label class="label">{RULECARD::EMAIL_ADDRESS}</label>
			</div>
			<div class="form-row">
				<div iw-flex-grid="fit group">
				<div iw-flex-cell>
					<obj name="input_email_address" type="obj_input_email" tabindex="true" css="group-left">
						<placeholder>rulecard::email_address</placeholder>
					</obj>
				</div>
				<div iw-flex-cell="none">
					<obj name="button_email_address" type="obj_button" css="icon icon-folder small group-right inner-button" tabindex="true"></obj>
				</div>
				</div>
			</div>
			<div class="form-row large">
				<obj name="forward_as_attachment" type="obj_checkbox" tabindex="true">
					<label>rulecard::forward_as_attachment</label>
				</obj>
			</div>
		</div>

		{/optional}

		{optional action_messageaction}

		<!-- Rulecard - Component - Accept / Reject / Delete / Spam / Quarantine -->
		<div iw-flex-cell id="{anchor fi_action}" class="form-item">
			<div class="form-label">
				<label class="label">{RULECARD::ACTION}</label>
			</div>
			<div class="form-row large">
				<obj name="radio_accept" type="obj_radio" group="action" tabindex="true">
					<label>rulecard::accept</label>
				</obj>
				<obj name="radio_reject" type="obj_radio" group="action" tabindex="true">
					<label>rulecard::reject</label>
				</obj>
				<obj name="radio_delete" type="obj_radio" group="action" tabindex="true">
					<label>rulecard::delete</label>
				</obj>
				<obj name="radio_spam" type="obj_radio" group="action" tabindex="true">
					<label>rulecard::spam</label>
				</obj>
				<obj name="radio_quarantine" type="obj_radio" group="action" tabindex="true">
					<label>rulecard::quarantine</label>
				</obj>
			</div>
		</div>

		{/optional}


		{optional action_flags}

		<!-- Rulecard - Component - Message flags - Flags -->
		<div iw-flex-cell id="{anchor fi_message_flags}" class="form-item">
			<div class="form-label">
				<label class="label">{RULECARD::FLAGS}</label>
			</div>
			<div class="form-row large">
				<obj name="checkbox_flagged" type="obj_checkbox" tabindex="true">
					<label>rulecard::flagged</label>
				</obj>
				<obj name="checkbox_seen" type="obj_checkbox" tabindex="true">
					<label>rulecard::seen</label>
				</obj>
				<obj name="checkbox_junk" type="obj_checkbox" tabindex="true">
					<label>rulecard::junk</label>
				</obj>
				<obj name="checkbox_non_junk" type="obj_checkbox" tabindex="true">
					<label>rulecard::non_junk</label>
				</obj>
			</div>
		</div>

		<!-- Rulecard - Component - Message flags - String -->
		<div iw-flex-cell id="{anchor fi_message_string}" class="form-item">
			<div class="form-label">
				<label class="label">{RULECARD::STRING}</label>
			</div>
			<div class="form-row large">
				<obj name="checkbox_label_1" type="obj_checkbox" tabindex="true">
					<label>rulecard::label_1</label>
				</obj>
				<obj name="checkbox_label_2" type="obj_checkbox" tabindex="true">
					<label>rulecard::label_2</label>
				</obj>
				<obj name="checkbox_label_3" type="obj_checkbox" tabindex="true">
					<label>rulecard::label_3</label>
				</obj>
				<obj name="checkbox_label_4" type="obj_checkbox" tabindex="true">
					<label>rulecard::label_4</label>
				</obj>
				<obj name="checkbox_label_5" type="obj_checkbox" tabindex="true">
					<label>rulecard::label_5</label>
				</obj>
				<obj name="checkbox_label_6" type="obj_checkbox" tabindex="true">
					<label>rulecard::label_6</label>
				</obj>
			</div>
		</div>

		<div iw-flex-cell id="{anchor fi_message_string}" class="form-item">
			<div class="form-label">
				<label class="label">{RULECARD::CUSTOM_FLAGS}</label>
			</div>
			<div class="form-row large">
					<obj name="input_custom_flags" type="obj_input_text" tabindex="true"></obj>
			</div>
		</div>

		{/optional}

		<!-- Rulecard - Component - CONDITIONS -->
		{optional condition_from condition_to condition_subject condition_cc condition_replyto condition_date condition_body condition_customheader condition_anyheader condition_attachname condition_sender condition_recipient condition_remoteip condition_rdns}

		<!-- Rulecard - Component - String condition -->
		<div iw-flex-cell class="form-item">
			<div class="form-label">
				<label class="label">{RULECARD::STRING_CONDITION}</label>
			</div>
		</div>

		{optional v11_4}
		<!-- Version 11.4 -->
		<!-- Rulecard - Component - String condition - Radio -->
		<div iw-flex-cell id="{anchor fi_string_condition_radio}" class="form-item">
			<div>
				<obj name="radio_single_string" type="obj_radio" group="string_condition" tabindex="true">
					<label>rulecard::single_string</label>
				</obj>
				<obj name="radio_all_items_match" type="obj_radio" group="string_condition" tabindex="true">
					<label>rulecard::all_items_match</label>
				</obj>
				<obj name="radio_one_item_matches" type="obj_radio" group="string_condition" tabindex="true">
					<label>rulecard::one_item_matches</label>
				</obj>
			</div>
			<hr>
		</div>
		{/optional}

		<!-- Rulecard - Component - String condition - Function -->
		<div iw-flex-cell id="{anchor fi_string_condition_function}" class="form-item">
			<div class="form-label">
				<label class="label">{RULECARD::FUNCTION}</label>
			</div>
			<div class="form-row">
				<obj name="dropdown_string_condition_function" type="obj_dropdown_single" tabindex="true"></obj>
			</div>
		</div>

		<!-- Rulecard - Component - String condition - String -->
		<div iw-flex-cell id="{anchor fi_string_condition_string}" class="form-item">
			<div class="form-label">
				<label class="label">{RULECARD::STRING}</label>
			</div>
			<div class="form-row">
				<div iw-flex-grid="fit group">
				<div iw-flex-cell>
					<obj name="input_string_condition_string" type="obj_input_text" tabindex="true" css="group-left">
						<placeholder>rulecard::string</placeholder>
					</obj>
				</div>
				<div iw-flex-cell="none">
					<obj name="button_string_condition_string" type="obj_button" css="icon icon-user small group-right inner-button" tabindex="true"></obj>
				</div>
				</div>
			</div>
		</div>

		<div iw-flex-cell id="{anchor fi_string_condition_checkbox}" class="form-item">
			<div class="form-row large">
				<obj name="checkbox_match_case" type="obj_checkbox" tabindex="true">
					<label>rulecard::match_case</label>
				</obj>
				<obj name="checkbox_whole_word" type="obj_checkbox" tabindex="true">
					<label>rulecard::whole_word</label>
				</obj>
				{optional condition_body}
				<obj name="checkbox_parse_xml" type="obj_checkbox" tabindex="true">
					<label>rulecard::parse_xml</label>
				</obj>
				{/optional}
			</div>
		</div>

		{/optional}

		<!-- IMPLEMENTED -->
		{optional condition_senderrecipient}

		<!-- Rulecard - Component - Sender / Recipient -->
		<div iw-flex-cell class="form-item">
			<div class="form-label">
				<label class="label">{RULECARD::SENDER_RECIPIENT}</label>
			</div>
			<div class="form-row large">
				<div iw-flex-grid>

				<!-- Rulecard - Component - Sender / Recipient - Sender / Recipient Radio -->
				<div iw-flex-cell id="{anchor fi_sender_recipient}" class="form-item">
					<obj name="radio_sender" type="obj_radio" group="sender_recipient" tabindex="true">
						<label>rulecard::sender</label>
					</obj>
					<obj name="radio_recipient" type="obj_radio" group="sender_recipient" tabindex="true">
						<label>rulecard::recipient</label>
					</obj>
				</div>

				<!-- Rulecard - Component - Sender / Recipient - Local / Remote -->
				<div iw-flex-cell id="{anchor fi_local_remote}" class="form-item">
					<obj name="radio_local" type="obj_radio" group="local_remote" tabindex="true">
						<label>rulecard::local</label>
					</obj>
					<obj name="radio_remote" type="obj_radio" group="local_remote" tabindex="true">
						<label>rulecard::remote</label>
					</obj>
				</div>

				<!-- Rulecard - Component - Sender / Recipient - Ignore / User [doesn't] exists -->
				<div iw-flex-cell id="{anchor fi_ignore_user}" class="form-item">
					<obj name="radio_ignore" type="obj_radio" group="ignore_user" tabindex="true">
						<label>rulecard::ignore</label>
					</obj>
					<obj name="radio_user_exists" type="obj_radio" group="ignore_user" tabindex="true">
						<label>rulecard::user_exists</label>
					</obj>
					<obj name="radio_user_doesnt_exists" type="obj_radio" group="ignore_user" tabindex="true">
						<label>rulecard::user_doesnt_exists</label>
					</obj>
				</div>

				</div>
			</div>
		</div>

		<!-- Rulecard - Component - Sender / Recipient - Member of -->
		<div iw-flex-cell id="{anchor fi_member_of}" class="form-item">
			<div class="form-label">
				<label class="label">{RULECARD::MEMBER_OF}</label>
			</div>
			<div class="form-row">
				<div iw-flex-grid="fit group">
				<div iw-flex-cell>
					<obj name="input_member_of" type="obj_input_text" tabindex="true" css="group-left">
						<placeholder>rulecard::member_of</placeholder>
					</obj>
				</div>
				<div iw-flex-cell="none">
					<obj name="button_member_of" type="obj_button" css="icon icon-folder small group-right inner-button" tabindex="true"></obj>
				</div>
				</div>
			</div>
		</div>

		{/optional}

		{optional condition_dnsbl}

		<!-- Rulecard - Component - DNSBL Server - DNSBL Server -->
		<div iw-flex-cell id="{anchor fi_dnsbl_server}" class="form-item">
			<div class="form-label">
				<label class="label">{RULECARD::DNSBL_SERVER}</label>
			</div>
			<div class="form-row">
				<obj name="input_dnsbl_server" type="obj_input_text" tabindex="true">
					<placeholder>rulecard::dnsbl_server</placeholder>
				</obj>
			</div>
		</div>

		<!-- Rulecard - Component - DNSBL Server - Regex -->
		<div iw-flex-cell id="{anchor fi_regex}" class="form-item">
			<div class="form-label">
				<label class="label">{RULECARD::REGEX}</label>
			</div>
			<div class="form-row">
				<obj name="input_regex" type="obj_input_text" tabindex="true">
					<placeholder>rulecard::regex</placeholder>
				</obj>
			</div>
		</div>

		{/optional}

		{optional condition_spamscore}

		<div iw-flex-cell>
			<div iw-flex-grid>

				<!-- Rulecard - Component - Spam score - Score -->
				<div iw-flex-cell="5" id="{anchor fi_spam_score}" class="form-item">
					<div class="form-label">
						<label class="label">{RULECARD::SCORE}</label>
					</div>
					<div class="form-row">
						<obj name="dropdown_spam_score" type="obj_dropdown_single" tabindex="true"></obj>
					</div>
				</div>

				<!-- Rulecard - Component - Spam score - Than -->
				<div iw-flex-cell="3" id="{anchor fi_spam_score_than}" class="form-item">
					<div class="form-label">
						<label class="label">{RULECARD::THAN}</label>
					</div>
					<div class="form-row">
						<obj name="input_spam_score_than" type="obj_input_number" tabindex="true"></obj>
					</div>
				</div>
			</div>

		</div>

		{/optional}

		{optional condition_size}

		<div iw-flex-cell>
			<div iw-flex-grid="2">

				<!-- Rulecard - Component - Message size - Message size -->
				<div iw-flex-cell id="{anchor fi_message_size}" class="form-item">
					<div class="form-label">
						<label class="label">{RULECARD::MESSAGE_SIZE}</label>
					</div>
					<div class="form-row">
						<obj name="dropdown_message_size" type="obj_dropdown_single" tabindex="true"></obj>
					</div>
				</div>

				<!-- Rulecard - Component - Message size - Than -->
				<div iw-flex-cell id="{anchor fi_message_size_than}" class="form-item">
					<div class="form-label">
						<label class="label">{RULECARD::THAN}</label>
					</div>
					<div class="form-row">
						<div iw-flex-grid="fit group">
						<div iw-flex-cell>
							<obj name="input_message_size_than" type="obj_input_number" css="inline group-left" tabindex="true"></obj>
						</div>
						<div iw-flex-cell="none">
							<obj name="dropdown_message_size_than" type="obj_dropdown_single" css="inline group-right" tabindex="true"></obj>
						</div>
						</div>
					</div>
				</div>
			</div>

		</div>

		{/optional}

		{optional condition_priority action_priority}

		<!-- Rulecard - Component - Message priority -->
		<div iw-flex-cell id="{anchor fi_message_priority}" class="form-item">
			<div class="form-label">
				<label class="label">{RULECARD::MESSAGE_PRIORITY}</label>
			</div>
			<div class="form-row">
				<obj name="dropdown_message_priority" type="obj_dropdown_single" tabindex="true"></obj>
			</div>
		</div>

		{/optional}

		{optional condition_time}

		<!-- Rulecard - Component - Time criteria -->
		<div iw-flex-cell class="form-item">
			<div class="form-label">
				<label class="label">{RULECARD::TIME_CRITERIA}</label>
			</div>
		</div>

		<!-- Rulecard - Component - Time criteria - Weekdays -->
		<div iw-flex-cell id="{anchor fi_weekdays}" class="form-item">
			<div class="form-label">
				<obj name="toggle_weekdays" type="obj_toggle" tabindex="true">
					<toggle>weekdays</toggle>
					<label>rulecard::weekdays</label>
				</obj>
			</div>
			<div class="form-row large" id="{anchor weekdays}" is-hidden="1">
				<obj name="checkbox_monday" type="obj_checkbox" tabindex="true">
					<label>rulecard::monday</label>
				</obj>
				<obj name="checkbox_tuesday" type="obj_checkbox" tabindex="true">
					<label>rulecard::tuesday</label>
				</obj>
				<obj name="checkbox_wednesday" type="obj_checkbox" tabindex="true">
					<label>rulecard::wednesday</label>
				</obj>
				<obj name="checkbox_thursday" type="obj_checkbox" tabindex="true">
					<label>rulecard::thursday</label>
				</obj>
				<obj name="checkbox_friday" type="obj_checkbox" tabindex="true">
					<label>rulecard::friday</label>
				</obj>
				<obj name="checkbox_saturday" type="obj_checkbox" tabindex="true">
					<label>rulecard::saturday</label>
				</obj>
				<obj name="checkbox_sunday" type="obj_checkbox" tabindex="true">
					<label>rulecard::sunday</label>
				</obj>
			</div>
		</div>

		<!-- Rulecard - Component - Time criteria - Between times -->
		<div iw-flex-cell id="{anchor fi_between_times}" class="form-item">
			<div class="form-label">
				<obj name="toggle_between_times" type="obj_toggle" tabindex="true">
					<toggle>between_times</toggle>
					<label>rulecard::between_times</label>
				</obj>
			</div>
			<div class="form-row" id="{anchor between_times}" is-hidden="1">
				<div iw-flex-grid="fit">
				<div iw-flex-cell>
					<obj name="input_time_from" type="obj_input_text" tabindex="true">
						<placeholder>generic::hh_mm</placeholder>
					</obj>
				</div>
				<div iw-flex-cell>
					<obj name="input_time_to" type="obj_input_text" tabindex="true">
						<placeholder>generic::hh_mm</placeholder>
					</obj>
				</div>
				</div>
			</div>
		</div>

		<!-- Rulecard - Component - Time criteria - Between dates -->
		<div iw-flex-cell id="{anchor fi_between_dates}" class="form-item">
			<div class="form-label">
				<obj name="toggle_between_dates" type="obj_toggle" tabindex="true">
					<toggle>between_dates</toggle>
					<label>rulecard::between_dates</label>
				</obj>
			</div>
			<div class="form-row" id="{anchor between_dates}" is-hidden="1">
				<div iw-flex-grid="fit">
				<div iw-flex-cell>
					<obj name="input_date_from" type="obj_input_date" tabindex="true"></obj>
				</div>
				<div iw-flex-cell>
					<obj name="input_date_to" type="obj_input_date" tabindex="true"></obj>
				</div>
				</div>
			</div>
		</div>

		{/optional}

		<!-- NOT IMPLEMENTED -->
		<!-- Version 11.4 -->
		{optional condition_antivirus}

		<!-- Rulecard - Component - Antivirus -->
		<div iw-flex-cell class="form-item">
			<div class="form-label">
				<label class="label">{RULECARD::ANTIVIRUS}</label>
			</div>
		</div>

		<!-- Rulecard - Component - Antivirus - Checkbox -->
		<div iw-flex-cell id="{anchor fi_antivirus_checkbox}" class="form-item">
			<div class="form-row large">
				<obj name="checkbox_message_virus" type="obj_checkbox" tabindex="true">
					<label>rulecard::message_virus</label>
				</obj>
				<obj name="checkbox_message_password" type="obj_checkbox" tabindex="true">
					<label>rulecard::message_password</label>
				</obj>
				<obj name="checkbox_message_not_virus" type="obj_checkbox" tabindex="true">
					<label>rulecard::message_not_virus</label>
				</obj>
			</div>
		</div>

		{/optional}

		{optional condition_executable}

		<!-- Rulecard - Component - Executable - Executable -->
		<div iw-flex-cell id="{anchor fi_executable}" class="form-item">
			<div class="form-label">
				<label class="label">{RULECARD::EXECUTABLE}</label>
			</div>
			<div class="form-row">
				<div iw-flex-grid="fit group">
				<div iw-flex-cell>
					<obj name="input_executable" type="obj_input_text" tabindex="true" css="group-left">
						<placeholder>rulecard::executable</placeholder>
					</obj>
				</div>
				<div iw-flex-cell="none">
					<obj name="button_executable" type="obj_button" css="icon icon-folder small group-right inner-button" tabindex="true"></obj>
				</div>
				</div>
			</div>
		</div>

		<!-- Rulecard - Component - Executable - Type -->
		<div iw-flex-cell id="{anchor fi_type}" class="form-item">
			<div class="form-label">
				<label class="label">{RULECARD::TYPE}</label>
			</div>
			<div class="form-row">
				<obj name="dropdown_type" type="obj_dropdown_single" tabindex="true"></obj>
			</div>
		</div>

		{/optional}

		{optional condition_db_connections}

		<!-- Rulecard - Component - DB Connections - DB Connection -->
		<div iw-flex-cell id="{anchor fi_db_connection}" class="form-item">
			<div class="form-label">
				<label class="label">{RULECARD::DB_CONNECTION}</label>
			</div>
			<div class="form-row">
				<div iw-flex-grid="fit group">
				<div iw-flex-cell>
					<obj name="input_db_connection" type="obj_input_text" tabindex="true" css="group-left">
						<placeholder>rulecard::db_connection</placeholder>
					</obj>
				</div>
				<div iw-flex-cell="none">
					<obj name="button_db_connection" type="obj_button" css="icon icon-folder small group-right inner-button" tabindex="true"></obj>
				</div>
				</div>
			</div>
		</div>

		<!-- Rulecard - Component - DB Connections - SQL Statement -->
		<div iw-flex-cell id="{anchor fi_sql_statement}" class="form-item">
			<div class="form-label">
				<label class="label">{RULECARD::SQL_STATEMENT}</label>
			</div>
			<div class="form-row">
				<obj name="input_sql_statement" type="obj_input_text" tabindex="true">
					<placeholder>rulecard::sql_statement</placeholder>
				</obj>
			</div>
		</div>

		{/optional}

		{optional condition_rfc2822}

		<!-- Rulecard - Component - RFC2822 Message Violation -->
		<div iw-flex-cell class="form-item">
			<div class="form-label">
				<label class="label">{RULECARD::RFC2822}</label>
			</div>
		</div>

		<!-- Rulecard - Component - RFC2822 Message Violation - Checkbox -->
		<div iw-flex-cell id="{anchor fi_rfc2822}" class="form-item">
			<div class="form-row large">
				<obj name="checkbox_bare_lfs" type="obj_checkbox" css="u-block" tabindex="true">
					<label>rulecard::bare_lfs</label>
				</obj>
				<obj name="checkbox_eof" type="obj_checkbox" css="u-block" tabindex="true">
					<label>rulecard::eof</label>
				</obj>
				<obj name="checkbox_crlf" type="obj_checkbox" css="u-block" tabindex="true">
					<label>rulecard::crlf</label>
				</obj>
				<obj name="checkbox_0x00" type="obj_checkbox" css="u-block" tabindex="true">
					<label>rulecard::zerobyte</label>
				</obj>
				<obj name="checkbox_remove_mime" type="obj_checkbox" css="u-block" tabindex="true">
					<label>rulecard::remove_mime</label>
				</obj>
				<obj name="checkbox_change_mime" type="obj_checkbox" css="u-block" tabindex="true">
					<label>rulecard::change_mime</label>
				</obj>
			</div>
		</div>

		{/optional}

		{optional condition_directmessage}

		<!-- Rulecard - Component - Direct Message - Checkboxes -->
		<div iw-flex-cell id="{anchor fi_directmessage}" class="form-item">
			<div class="form-row large">
				<obj name="checkbox_userisonlyrecipient" type="obj_checkbox" css="checkbox--block" tabindex="true">
					<label>rulecard::userisonlyrecipient</label>
				</obj>
				<obj name="checkbox_checkuserinto" type="obj_checkbox" css="checkbox--block" tabindex="true">
					<label>rulecard::checkuserinto</label>
				</obj>
				<obj name="checkbox_checkuserincc" type="obj_checkbox" css="checkbox--block" tabindex="true">
					<label>rulecard::checkuserincc</label>
				</obj>
				<obj name="checkbox_checkuserinbcc" type="obj_checkbox" css="checkbox--block" tabindex="true">
					<label>rulecard::checkuserinbcc</label>
				</obj>
			</div>
		</div>

		{/optional}

		</div>
	</div>

</div>

<!-- Rulecard - Arrows -->
<div class="rulecard-arrows">
	<obj name="button_rule_up" type="obj_button" css="icon icon-arrow-up rulecard-arrow"></obj>
	<obj name="button_rule_down" type="obj_button" css="icon icon-arrow-down rulecard-arrow"></obj>
</div>

<!-- Rulecard - Gate -->
<div class="rulecard-gate">
	<obj name="button_not" type="obj_button" css="text small grey rulecard-gate-boolean">
		<value>generic::not</value>
	</obj>
	<obj name="actionselect_logic_gate" type="obj_actionselect" css="rulecard-gate-select" button_css="select text small primary" display="select">
		<value>generic::or</value>
	</obj>
</div>
