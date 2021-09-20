<table class="obj_repeating_tbl">
	<tr>
		<td class="obj_repeating_td1">
			<obj name="radio_repeats" type="obj_radio">
				<fill>
					<item key="no_repeats">REPEATING::NOT_REPEATS</item>
					<item key="daily">REPEATING::DAILY</item>
					<item key="weekly">REPEATING::WEEKLY</item>
					<item key="monthly">REPEATING::MONTHLY</item>
					<item key="yearly">REPEATING::YEARLY</item>
				</fill>
			</obj>
		</td>
		<td class="obj_repeating_td2" id="{anchor container}"></td>
	</tr>
	<tr>
		<th class="obj_repeating_th" colspan="2">{REPEATING::END_DATE}</th>
	</tr>
	<tr>
		<td>
			<obj name="radio_ends" type="obj_radio" css="obj_repeating_radio">
			<fill>
				<item key="0">REPEATING::NO_END</item>
				<item key="1">REPEATING::UNTIL</item>
				<item key="2">REPEATING::COUNT</item>
			</fill>
			</obj>
		</td>
		<td valign="bottom">
		<table class="frmtbl">
			<tr><td></td></tr>
			<tr><td><obj name="RCRENDDATE" type="obj_input_calendar" ></obj></td></tr>
			<tr><td><obj name="RCRCOUNT" type="obj_input" css="obj_input_small" ></obj></td></tr>
		</table>
		</td>
	</tr>
</table>