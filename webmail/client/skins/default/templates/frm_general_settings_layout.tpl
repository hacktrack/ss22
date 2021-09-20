<table class="frmtbl">
	<tr>
		<th class="th">{SETTINGS::SKIN}</th>
		<td><obj name="skin" type="obj_select" tabindex="true"></obj></td>
		{optional domainadmin}<td><obj name="x_skin_set" type="obj_allow_settings"></obj></td>{/optional}
	</tr>
	<tr>
		<th class="th">{SETTINGS::SKIN_STYLE}</th>
		<td><obj name="skin_style" type="obj_select" tabindex="true"></obj></td>
		{optional domainadmin}<td><obj name="x_skin_style_set" type="obj_allow_settings"></obj></td>{/optional}
	</tr>
	<tr>
		<th class="th">{SETTINGS::FONT_WEIGHT}</th>
		<td><obj name="font_weight" type="obj_select" tabindex="true">
			<fill>
				<item key="auto">{COMMON::AUTO}</item>
				<item key="light">{SETTINGS::FONT_LIGHT}</item>
				<item key="normal">{SETTINGS::FONT_NORMAL}</item>
			</fill>
		</obj></td>
		{optional domainadmin}<td><obj name="x_font_weight_set" type="obj_allow_settings"></obj></td>{/optional}
	</tr>
	<tr>
		<th class="th" colspan="2"><obj name="night_mode" type="obj_checkbox" tabindex="true"><title>SETTINGS::NIGHT_MODE</title></obj></th>
	</tr>
	<tr>
		<td colspan="2" class="space">&nbsp;</td>
	</tr>

	{noptional disable_languages}
	<tr>
		<th class="th">{SETTINGS::LANGUAGE}</th>
		<td><obj name="language" type="obj_select" tabindex="true"></obj></td>
		{optional domainadmin}<td><obj name="x_language_set" type="obj_allow_settings"></obj></td>{/optional}
	</tr>
	{/noptional}
	<tr>
		<th class="th">{SETTINGS::INIT_PAGE}</th>
		<td><obj name="init_page" type="obj_select" tabindex="true">
			<fill>
				<item key="h">{SETTINGS::SHOW_HOME}</item>
				<item key="i">{SETTINGS::SHOW_INBOX}</item>
				<item key="r">{SETTINGS::REMEMBER_FOLDER}</item>
			</fill>
		</obj></td>
		{optional domainadmin}<td><obj name="x_init_page_set" type="obj_allow_settings"></obj></td>{/optional}
	</tr>
	<tr>
		<td colspan="2" class="space">&nbsp;</td>
	</tr>
	<tr>
		<th class="th">{SETTINGS::CONFIRM_EXIT}</th>
		<td>
		<obj name="confirm_exit" type="obj_select" tabindex="true">
			<fill>
				<item key="0">{SETTINGS::NEVER}</item>
				<item key="1">{SETTINGS::COMPOSE}</item>
				<item key="2">{SETTINGS::ALWAYS}</item>
			</fill>
		</obj>
		</td>
		{optional domainadmin}<td><obj name="x_confirm_exit_set" type="obj_allow_settings"></obj></td>{/optional}
	</tr>
	<tr>
		<th class="th">{SETTINGS::NOTIFICATIONS}</th>
		<td>
		<obj name="notifications" type="obj_select" tabindex="true">
			<fill>
				<item key="0">{SETTINGS::NOFOCUS}</item>
				<item key="1">{SETTINGS::ALWAYS}</item>
				<item key="2">{SETTINGS::NEVER}</item>
			</fill>
		</obj>
		</td>
		{optional domainadmin}<td><obj name="x_notifications_set" type="obj_allow_settings"></obj></td>{/optional}
	</tr>
	{optional domainadmin}
	<tr>
		<th class="th">{SETTINGS::LOGOUT_URL}</th>
		<td><obj name="logout_url" type="obj_input" tabindex="true"></obj></td>
		<td><obj name="x_logout_url_set" type="obj_allow_settings"><init>1</init></obj></td>
	</tr>
	<tr>
		<th class="th">{SETTINGS::ACTIVITY_MONITOR}</th>
		<td><obj name="activity" type="obj_input" css="obj_input_small" tabindex="true"></obj></td>
		<td><obj name="x_activity_set" type="obj_allow_settings"><init>1</init></obj></td>
	</tr>
	{/optional}
	<tr>
		<td colspan="2" class="space">&nbsp;</td>
	</tr>
	{optional domainadmin}
	<tr>
		<th class="th" colspan="2"><obj name="ssl_swfatt" type="obj_checkbox_inverse" tabindex="true"><title>SETTINGS::USE_SSLSWFATT</title></obj></th>
		<td><obj name="x_ssl_swfatt_set" type="obj_allow_settings"><init>1</init></obj></td>
	</tr>
	{/optional}
	<tr>
		<th class="th" colspan="2"><obj name="favorites" type="obj_checkbox" tabindex="true"><title>SETTINGS::SHOW_FAVORITES</title></obj></th>
		{optional domainadmin}<td><obj name="x_favorites_set" type="obj_allow_settings"></obj></td>{/optional}
	</tr>
	<tr>
		<th class="th" colspan="2"><obj name="disable_pdf" type="obj_checkbox_inverse" tabindex="true"><title>SETTINGS::USE_PDF</title></obj></th>
		{optional domainadmin}<td><obj name="x_disable_pdf_set" type="obj_allow_settings"></obj></td>{/optional}
	</tr>
	<tr>
		<th class="th">{SETTINGS::PREVIEW_DELAY}</th>
		<td><obj name="preview_delay" type="obj_input_number" tabindex="true"></obj></td>
		{optional domainadmin}<td><obj name="x_preview_delay_set" type="obj_allow_settings"><init>1</init></obj></td>{/optional}
	</tr>
	<tr>
		<td colspan="2" class="space">&nbsp;</td>
	</tr>
	<tr>
		<th class="th" colspan="2"><obj name="keep_search" type="obj_checkbox" tabindex="true"><title>SETTINGS::KEEP_SEARCH</title></obj></th>
		{optional domainadmin}<td><obj name="x_keep_search_set" type="obj_allow_settings"></obj></td>{/optional}
	</tr>
	<tr>
		<td colspan="2" class="space">&nbsp;</td>
	</tr>
	<tr>
		<th class="th">{SETTINGS::DATE_FORMAT}</th>
		<td><obj name="date_format" type="obj_select" tabindex="true"></obj></td>
		{optional domainadmin}<td><obj name="x_date_format_set" type="obj_allow_settings"></obj></td>{/optional}
	</tr>
	<tr>
		<th class="th">{SETTINGS::TIME_FORMAT}</th>
		<td><obj name="time_format" type="obj_select" tabindex="true">
			<fill>
				<item key="0">{SETTINGS::TIME_24}</item>
				<item key="1">{SETTINGS::TIME_12}</item>
			</fill>
			</obj></td>
		{optional domainadmin}<td><obj name="x_time_format_set" type="obj_allow_settings"></obj></td>{/optional}
	</tr>
	<tr>
		<th class="th">{SETTINGS::ALTERNATIVE_CALENDAR}</th>
		<td><obj name="alternative_calendar" type="obj_select" tabindex="true">
			<fill>
				<item key="1">{SETTINGS::GREGORIAN}</item>
				<item key="2">{SETTINGS::JALAALI}</item>
				<item key="3">{SETTINGS::HIJRI}</item>
				<item key="4">{SETTINGS::BUDDHA}</item>
			</fill>
			</obj></td>
		{optional domainadmin}<td><obj name="x_alternative_calendar_set" type="obj_allow_settings"></obj></td>{/optional}
	</tr>
	<tr>
		<td colspan="2">&nbsp;</td>
	</tr>
</table>
