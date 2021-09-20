<table class="frmtbl frmtbl100">
	<tr>
		<td class="td"><obj name="save_sent_message" type="obj_checkbox" tabindex="true"><title>SETTINGS::SAVE_SENT_MESSAGE</title></obj></td>
		{optional domainadmin}<td><obj name="x_save_sent_message_set" type="obj_allow_settings"></obj></td>{/optional}
	</tr>
	<tr>
		<td><obj name="encrypt" type="obj_checkbox" tabindex="true"><title>SETTINGS::ENCRYPT</title></obj></td>
		{optional domainadmin}<td><obj name="x_encrypt_set" type="obj_allow_settings"></obj></td>{/optional}
	</tr>
	<tr>
		<td><obj name="sign" type="obj_checkbox" tabindex="true"><title>SETTINGS::SIGN</title></obj></td>
		{optional domainadmin}<td><obj name="x_sign_set" type="obj_allow_settings"></obj></td>{/optional}
	</tr>
	<tr>
		<td><obj name="read_confirmation" type="obj_checkbox" tabindex="true"><title>SETTINGS::REQUEST_READ_CONFIRMATION</title></obj></td>
		{optional domainadmin}<td><obj name="x_read_confirmation_set" type="obj_allow_settings"></obj></td>{/optional}
	</tr>
	<tr>
		<td><obj name="check_subject" type="obj_checkbox" tabindex="true"><title>SETTINGS::CHECK_SUBJECT</title></obj></td>
		{optional domainadmin}<td><obj name="x_check_subject_set" type="obj_allow_settings"></obj></td>{/optional}
	</tr>
	<tr>
		<td><obj name="append_vcard" type="obj_checkbox" tabindex="true"><title>SETTINGS::APPENDVCARD</title></obj></td>
		{optional domainadmin}<td><obj name="x_append_vcard_set" type="obj_allow_settings"></obj></td>{/optional}
	</tr>
	<tr>
		<td><obj name="text_direction_switch" type="obj_checkbox" tabindex="true"><title>SETTINGS::TEXT_DIRECTION_SWITCH</title></obj></td>
		{optional domainadmin}<td><obj name="x_text_direction_switch_set" type="obj_allow_settings"></obj></td>{/optional}
	</tr>

	<tr>
		<td colspan="2" class="space">&nbsp;</td>
	</tr>

	<tr>
		<td><obj name="sign_separator" type="obj_checkbox" tabindex="true"><title>SETTINGS::SIGNATURE_SEPARATOR</title></obj></td>
		{optional domainadmin}<td><obj name="x_sign_separator_set" type="obj_allow_settings"></obj></td>{/optional}
	</tr>
	<tr>
		<td><obj name="sign_top" type="obj_checkbox" tabindex="true"><title>SETTINGS::SIGNATURE_TO_TOP</title></obj></td>
		{optional domainadmin}<td><obj name="x_sign_top_set" type="obj_allow_settings"></obj></td>{/optional}
	</tr>

	<tr>
		<td colspan="2" class="space">&nbsp;</td>
	</tr>

	<tr>
		<th colspan="2">{SETTINGS::ALWAYS_SHOW_RCP}</th>
	</tr>
	<tr>
		<td><obj name="show_from" type="obj_checkbox" tabindex="true"><title>DATAGRID_ITEMS_VIEW::FROM</title></obj></td>
		{optional domainadmin}<td><obj name="x_show_from_set" type="obj_allow_settings"></obj></td>{/optional}
	</tr>
	<tr>
		<td><obj name="show_cc" type="obj_checkbox" tabindex="true"><title>DATAGRID_ITEMS_VIEW::CC</title></obj></td>
		{optional domainadmin}<td><obj name="x_show_cc_set" type="obj_allow_settings"></obj></td>{/optional}
	</tr>
	<tr>
		<td><obj name="show_bcc" type="obj_checkbox" tabindex="true"><title>DATAGRID_ITEMS_VIEW::BCC</title></obj></td>
		{optional domainadmin}<td><obj name="x_show_bcc_set" type="obj_allow_settings"></obj></td>{/optional}
	</tr>

	<tr>
		<td colspan="2" class="space">&nbsp;</td>
	</tr>
</table>

<table class="frmtbl frmtbl100">
	{noptional disable_smart}
	<tr>
		<th class="th">{SETTINGS::SMART_ATTACH}</th>
		<td><obj name="smart_attach" type="obj_select" tabindex="true">
			<fill>
				<item key="0">{COMMON::NO}</item>
				<item key="1">{COMMON::YES}</item>
				<item key="#1024">&gt; 1{UNITS::MB}</item>
				<item key="#5120">&gt; 5{UNITS::MB}</item>
				<item key="#10240">&gt; 10{UNITS::MB}</item>
				<item key="#20480">&gt; 20{UNITS::MB}</item>
				<item key="#51200">&gt; 50{UNITS::MB}</item>
			</fill>
			</obj></td>
		{optional domainadmin}<td><obj name="x_smart_attach_set" type="obj_allow_settings"></obj></td>{/optional}
	</tr>
	{/noptional}
	<tr>
		<th class="th">{SETTINGS::MESSAGE_FORMAT}</th>
		<td>
			<obj name="html_message" type="obj_select" tabindex="true">
				<fill>
					<item key="1">{COMPOSE::HTML}</item>
					<item key="0">{COMPOSE::TEXT}</item>
				</fill>
			</obj>
		</td>
	{optional domainadmin}<td><obj name="x_html_message_set" type="obj_allow_settings"></obj></td>{/optional}
	</tr>
	<tr>
		<th class="th">{SETTINGS::RE_MESSAGE_FORMAT}</th>
		<td>
			<obj name="reply_message" type="obj_select" tabindex="true">
				<fill>
					<item key="0">{COMMON::AUTO}</item>
					<item key="1">{COMPOSE::TEXT}</item>
					<item key="2">{COMPOSE::HTML}</item>
				</fill>
			</obj>
		</td>
	{optional domainadmin}<td><obj name="x_reply_message_set" type="obj_allow_settings"></obj></td>{/optional}
	</tr>
	<tr>
		<th class="th">{SETTINGS::PRIORITY}</th>
		<td>
			<obj name="priority" type="obj_select" tabindex="true">
				<fill>
					<item key="2">{EMAIL_PRIORITY::HIGH}</item>
					<item key="3">{EMAIL_PRIORITY::NORMAL}</item>
					<item key="4">{EMAIL_PRIORITY::LOW}</item>
				</fill>
			</obj>
		</td>
	{optional domainadmin}<td><obj name="x_priority_set" type="obj_allow_settings"></obj></td>{/optional}
	</tr>
	<tr>
		<th class="th">{SETTINGS::SPELL_LANGUAGE}</th>
		<td class="td"><obj name="spellchecker" type="obj_select" tabindex="true"></obj></td>
		{optional domainadmin}<td><obj name="x_spellchecker_set" type="obj_allow_settings"></obj></td>{/optional}
	</tr>

	<tr><th class="th">{RICH::DIRECTION}</th><td>
	<obj name="text_direction" type="obj_select" tabindex="true">
		<fill>
			<item key="LTR">{RICH::LTR}</item>
			<item key="RTL">{RICH::RTL}</item>
		</fill>
	</obj></td>{optional domainadmin}<td><obj name="x_text_direction_set" type="obj_allow_settings"></obj></td>{/optional}</tr>
	<tr><th class="th">{RICH::FONT}</th><td><obj name="font_family" type="obj_select" tabindex="true"></obj></td>{optional domainadmin}<td><obj name="x_font_family_set" type="obj_allow_settings"></obj></td>{/optional}</tr>
	<tr><th class="th">{RICH::SIZE}</th><td>
	<obj name="font_size" type="obj_select" tabindex="true">
		<fill>
            <item>{SETTINGS::DEFAULT}</item>
			<item key="10px">10</item>
			<item key="13px">13</item>
			<item key="16px">16</item>
			<item key="18px">18</item>
			<item key="24px">24</item>
			<item key="32px">32</item>
		</fill>
	</obj></td>{optional domainadmin}<td><obj name="x_font_size_set" type="obj_allow_settings"></obj></td>{/optional}</tr>

	{noptional domainadmin disable_personalities}
	<tr><th class="th">{SETTINGS::ALIAS}</th><td><obj name="from" type="obj_select" css="max" tabindex="true"></obj></td></tr>
	{/noptional}

	<tr><th class="th">{SETTINGS::REPLY_MYSELF}</th><td><obj name="reply_myself" type="obj_select" tabindex="true"><fill><item key="0">{SETTINGS::NEVER}</item><item key="cc">{DATAGRID_ITEMS_VIEW::CC}</item><item key="bcc">{DATAGRID_ITEMS_VIEW::BCC}</item></fill></obj></td>{optional domainadmin}<td><obj name="x_reply_myself_set" type="obj_allow_settings"></obj></td>{/optional}</tr>

	{optional admin domainadmin replyto}
	<tr><th class="th">{SETTINGS::REPLY_TO}</th><td><obj name="reply_to_address" type="obj_input" css="obj_input_100" tabindex="true"></obj></td>{optional domainadmin}<td><obj name="x_reply_to_address_set" type="obj_allow_settings"></obj></td>{/optional}</tr>
	{/optional}

	<tr>
		<td colspan="2" class="space">&nbsp;</td>
	</tr>
	<tr>
		<th class="th">{SETTINGS::SEND_BUTTON}</th>
		<td><obj name="send_undo" type="obj_select" tabindex="true">
			<fill>
				<item key="1">{COMPOSE::SEND_UNDO}</item>
				<item key="0">{COMPOSE::SEND_NOW}</item>
			</fill></obj></td>{optional domainadmin}<td><obj name="x_send_undo_set" type="obj_allow_settings"></obj></td>{/optional}
	</tr>
	<tr>
		<th class="th">{SETTINGS::CTRL_ENTER}</th>
		<td><obj name="ctrl_enter" type="obj_select" tabindex="true">
			<fill>
				<item>{COMPOSE::SEND_UNDO}</item>
				<item>{COMPOSE::SEND_NOW}</item>
				{optional allow_delay_send}
				<item>{COMPOSE::SEND_WITH_DELAY}</item>
				{/optional}
			</fill></obj></td>{optional domainadmin}<td><obj name="x_ctrl_enter_set" type="obj_allow_settings"></obj></td>{/optional}
	</tr>

	{optional allow_delay_send}
	<tr><th class="th">{SETTINGS::SEND_DELAY}</th><td>
	<obj name="send_delay" type="obj_input_number" css="obj_input_small" tabindex="true"><restrictions>&gt;-1i</restrictions></obj></td>{optional domainadmin}<td><obj name="x_send_delay_set" type="obj_allow_settings"></obj></td>{/optional}</tr>
	{/optional}

	{noptional domainadmin}
	<tr><th class="th">{SETTINGS::RCPT_SUGGEST}</th><td><obj name="x_btn_rcptcache" type="obj_button" css="color1" tabindex="true"><value>SETTINGS::RCPT_CACHE</value><disabled>1</disabled></obj></td></tr>
	{/noptional}
</table>
