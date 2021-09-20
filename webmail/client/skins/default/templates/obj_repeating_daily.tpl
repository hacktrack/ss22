<table class="frmtbl">
<tr>
	<td rowspan="2">
		<obj name="type" type="obj_radio">
			<fill>
				<item key="1"></item>
				<item key="2"></item>
			</fill>
		</obj>
	</td>
	<td><label for="{_ins}.type0">{REPEATING::EVERY}</label></td>
	<td><obj name="day_repetition" type="obj_input" css="obj_input_small" ></obj></td>
	<td>{REPEATING::DAYS}</td>
</tr>
<tr>
	<td colspan="3"><label for="{_ins}.type1">{REPEATING::EVERY_WEEKDAY}</label></td>
</tr>
</table>