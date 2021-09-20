<table class="frmtbl frmtbl100 calendar_main">
	{optional admin domainadmin gw_e gw_j}
	<tr>
		<th class="th">{SETTINGS::TIMEZONE}</th>
		<td class="td" colspan="2"><obj name="timezone" type="obj_timezones" tabindex="true" css="max"><init>{DEFAULT_SELECT::SERVERZONE}</init></obj></td>
		{optional domainadmin}<td><obj name="x_timezone_set" type="obj_allow_settings"></obj></td>{/optional}
	</tr>
	<tr>
		<th class="th">{SETTINGS::DAY_BEGINS_AT}</th>
		<td colspan="2"><obj name="day_begins" type="obj_select" tabindex="true" css="small"></obj></td>
		{optional domainadmin}<td><obj name="x_day_begins_set" type="obj_allow_settings"></obj></td>{/optional}
	</tr>
	<tr>
		<th class="th">{SETTINGS::DAY_ENDS_AT}</th>
		<td colspan="2"><obj name="day_ends" type="obj_select" tabindex="true" css="small"></obj></td>
		{optional domainadmin}<td><obj name="x_day_ends_set" type="obj_allow_settings"></obj></td>{/optional}
	</tr>
	{/optional}
	<tr>
		<td colspan="3"><obj name="begin_on_today" type="obj_checkbox" tabindex="true"><title>SETTINGS::WEEK_STARTS_TODAY</title></obj></td>
		{optional domainadmin}<td><obj name="x_begin_on_today_set" type="obj_allow_settings"></obj></td>{/optional}
	</tr>
	<tr>
		<th class="th">{SETTINGS::WEEK_BEGINS_ON}</th>
		<td colspan="2"><obj name="week_begins" type="obj_select" tabindex="true"></obj></td>
		{optional domainadmin}<td><obj name="x_week_begins_set" type="obj_allow_settings"></obj></td>{/optional}
	</tr>
	<tr>
	<td colspan="4">&nbsp;</td>
	</tr>
	<tr>
		<th class="th">{SETTINGS::WORKWEEK_BEGINS_ON}</th>
		<td colspan="2"><obj name="workweek_begins" type="obj_select" tabindex="true"></obj></td>
		{optional domainadmin}<td><obj name="x_workweek_begins_set" type="obj_allow_settings"></obj></td>{/optional}
	</tr>
	<tr>
		<th class="th">{SETTINGS::WORKWEEK_ENDS_ON}</th>
		<td colspan="2"><obj name="workweek_ends" type="obj_select" tabindex="true"></obj></td>
		{optional domainadmin}<td><obj name="x_workweek_ends_set" type="obj_allow_settings"></obj></td>{/optional}
	</tr>


	<!--tr>
		<th ><obj name="autoclear_trash" type="obj_checkbox" tabindex="true"><title>SETTINGS::CLEAR_GWTRASH</title></obj></th>
		<td colspan="2"><obj name="autoclear_trash_days" type="obj_input_number" css="obj_input_small" tabindex="true"><restrictions>&gt;-1i</restrictions></obj></obj></td>
		{optional domainadmin}<td><obj name="x_autoclear_trash_set" type="obj_allow_settings"></obj></td>{/optional}
	</tr-->
	<tr>
		<th class="th">{SETTINGS::ADDITIONAL_CALENDAR}</th>
		<td colspan="2"><obj name="alternative_calendar" type="obj_select" tabindex="true">
			<fill>
				<item key="-1">-</item>
				<item key="1">{SETTINGS::GREGORIAN}</item>
				<item key="2">{SETTINGS::JALAALI}</item>
				<item key="3">{SETTINGS::HIJRI}</item>
				<item key="4">{SETTINGS::BUDDHA}</item>
			</fill>
			</obj></td>
		{optional domainadmin}<td><obj name="x_alternative_calendar_set" type="obj_allow_settings"></obj></td>{/optional}
	</tr>
</table>
