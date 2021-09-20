<table class="frmtbl frmtbl100">
<tr>
	<th class="th" nowrap="nowrap">{TIME_INTERVAL::FROM}</th>
	<td><obj name="startDate" type="obj_input_calendar"><init><item></item><item>1</item></init></obj></td>
	<td><obj name="startTime" type="obj_time"><value>0</value></obj></td>
	<td id="{anchor tz}" width="100%"></td>
</tr>
<tr>
	<th class="th" nowrap="nowrap">{TIME_INTERVAL::TO}</th>
	<td><obj name="endDate" type="obj_input_calendar"><init><item></item><item>1</item></init></obj></td>
	<td><obj name="endTime" type="obj_time"><value>0</value></obj></td>
	<td id="{anchor dtzl}"></td>
</tr>
<tr>
	<th class="th" nowrap="nowrap">{TIME_INTERVAL::DURATION}</th>
	<td>
		<table>
		<tr>
			<td><obj name="durationDays" type="obj_input" css="obj_input_small"><value>0</value></obj></td>
			<td class="pad5">{TIME_INTERVAL::DAYS}</td>
		</tr>
		</table>
	</td>
	<td><obj name="durationTime" type="obj_time"><value>0</value><init>1</init></obj></td>
	<td id="{anchor all_day}"></td>
</tr>
</table>