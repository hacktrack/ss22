<table class="frmtbl frmtbl100">
	<tr><th colspan="2">{TROUBLESHOOTING::HELPER}</th></tr>
	<tr><th colspan="2">{TROUBLESHOOTING::VALIDITY}</th></tr>
	{noptional link}
	<tr>
		<th>
			<obj name="validity" type="obj_select" tabindex="true" value="7200">
				<fill>
					<item key="7200">{SETTINGS::TIME_2}</item>
					<item key="43200">{SETTINGS::TIME_12}</item>
					<item key="86400">{SETTINGS::DAY_1}</item>
					<item key="172800">{SETTINGS::DAY_2}</item>
					<item key="604800">{SETTINGS::WEEK_1}</item>
				</fill>
			</obj>
		</th>
		<td class="td"><obj name="generate" type="obj_button" css="color1" value="TROUBLESHOOTING::GENERATE"></obj></td>
	</tr>
	{/noptional}
	{optional link}
	<tr>
		<th>{validity}</th>
		<td class="td"><obj name="remove" type="obj_button" css="color1" value="TROUBLESHOOTING::REMOVE"></obj></td>
	</tr>
	<tr><td colspan="2"><a href="{link}" target="_blank">{link}</a></td></tr>
	{/optional}
</table>
