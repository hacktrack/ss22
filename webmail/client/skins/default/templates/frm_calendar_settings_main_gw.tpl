<table class="frmtbl">
	<tr>
		<td class="space"></td>
	</tr>
	{optional admin domainadmin gw_e}
	<tr>
		<th class="th">{SETTINGS::REMINDER_EMAIL}</th>
		<td class="td"><obj name="grpreminderemail" type="obj_input" tabindex="true"></obj></td>
	</tr>
	<tr>
		<th class="th" colspan="2"><obj name="grpdailyevents" type="obj_checkbox" tabindex="true"><title>SETTINGS::DAILY_EVENT_REPORT</title></obj></th>
	</tr>
	{/optional}
	{optional admin domainadmin gw_e gw_t}
	<tr>
		<th class="th" colspan="2"><obj name="grpremindersdisabled" type="obj_checkbox_inverse" tabindex="true"><title>SETTINGS::REMINDER_NOTIFICATION</title></obj></th>
	</tr>
	{/optional}
</table>