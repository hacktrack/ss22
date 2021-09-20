<table class="frmtbl">
	<tr>
		<td colspan="2"><obj name="u_as" type="obj_checkbox" tabindex="true"><title>SETTINGS::ANTISPAM</title></obj></td>
		{optional domainadmin}<td><obj name="x_u_as_set" type="obj_allow_settings"></obj></td>{/optional}
	</tr>
	<tr>
		<td colspan="2"><obj name="u_cr" type="obj_checkbox" tabindex="true"><title>SETTINGS::QUARANTINE</title></obj></td>
		{optional domainadmin}<td><obj name="x_u_cr_set" type="obj_allow_settings"></obj></td>{/optional}
	</tr>
	<tr>
		<th class="th">{SETTINGS::REPORTS_MODE}</th>
		<td>
		<obj name="u_quarantinereports" type="obj_select" tabindex="true">
			<fill>
				<item key="0">{SETTINGS::DISABLED}</item>
				<item key="1">{SETTINGS::DEFAULT}</item>
				<item key="3">{SETTINGS::ALL}</item>
				<item key="2">{SETTINGS::NEW_ITEMS}</item>
			</fill>
		</obj>
		</td>
		{optional domainadmin}<td><obj name="x_u_quarantinereports_set" type="obj_allow_settings"></obj></td>{/optional}
	</tr>
	<tr>
		<th class="th">{SETTINGS::SPAM_MODE}</th>
		<td>
		<obj name="u_spamfolder" type="obj_select" tabindex="true">
			<fill>
				<item key="0">{SETTINGS::DEFAULT}</item>
				<item key="2">{SETTINGS::USE_SPAM}</item>
				<item key="1">{SETTINGS::NOT_SPAM}</item>
			</fill>
		</obj>
		</td>
		{optional domainadmin}<td><obj name="x_u_spamfoldermode_set" type="obj_allow_settings"></obj></td>{/optional}
	</tr>
</table>