<table class="frmtbl">
<tr>
	<th rowspan="2">
		<obj name="type" type="obj_radio">
			<fill>
				<item key="1">REPEATING::DAY</item>
				<item key="2">REPEATING::THE</item>
			</fill>
		</obj>
	</th>
	<td>
		<table>
		<tr>
			<td><obj name="day_repetition" type="obj_input" css="obj_input_small" ></obj></td>
			<td>{REPEATING::OF_EVERY}</td>
			<td><obj name="month_repetition1" type="obj_input" css="obj_input_small" ></obj></td>
			<td>{REPEATING::MONTHS}</td>
		</tr>
		</table>
	</td>
</tr>
<tr>
	<td>
		<table>
			<tr>
				<td><obj name="week_no" type="obj_select" css="small"></obj></td>
				<td><obj name="day_of_week" type="obj_select" css="small120"></obj></td>
				<td nowrap="nowrap">{REPEATING::OF_EVERY}</td>
				<td><obj name="month_repetition2" type="obj_input" css="obj_input_small"></obj></td>
				<td nowrap="nowrap">{REPEATING::MONTHS}</td>
			</tr>
		</table>
	</td>
</tr>
</table>