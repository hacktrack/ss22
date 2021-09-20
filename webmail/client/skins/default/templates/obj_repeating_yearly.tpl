<table class="frmtbl">
<tr>
	<td rowspan="2">
		<obj name="type" type="obj_radio">
			<fill>
				<item key="1">REPEATING::EVERY</item>
				<item key="2">REPEATING::THE</item>
			</fill>
		</obj>
	</td>
	<td>
		<table>
		<tr>
			<td><obj name="year_no" type="obj_select" css="small"></obj></td>
			<td>{REPEATING::YEAR_S}</td>
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
				<td>{REPEATING::OF}</td>
				<td><obj name="the_month" type="obj_select" css="small120"></obj></td>
			</tr>
		</table>
	</td>
</tr>
</table>