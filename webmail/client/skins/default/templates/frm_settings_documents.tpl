<table class="frmtbl">
	{noptional disable_autorevision}
	{optional settings}
	<tr>
		<td colspan="2"><obj name="x_ownautorevisionmode" type="obj_checkbox" tabindex="true"><title>SETTINGS::AUTOREVISION_MODE</title></obj></td>
	</tr>
	{/optional}
	{/noptional}
	<tr>
		<td class="th"><obj name="autosave" type="obj_checkbox" tabindex="true"><title>SETTINGS::AUTOSAVE_DOCUMENTS</title></obj></td>
		<td class="td"><obj name="autosave_minutes" type="obj_input_number" css="obj_input_small" tabindex="true"><restrictions>&gt;-1i</restrictions></obj></obj></td>
		{optional domainadmin}<td><obj name="x_autosave_set" type="obj_allow_settings"></obj></td>{/optional}
	</tr>
	<tr>
		<th class="th"><obj name="disable_office" type="obj_checkbox_inverse" tabindex="true"><title>SETTINGS::USE_OFFICE</title></obj></th>
		<td class="td"><obj name="office_app" type="obj_select" css="obj_select x_disable_office_set" tabindex="true"><disabled>1</disabled></obj></td>
		{optional domainadmin}<td><obj name="x_disable_office_set" type="obj_allow_settings"></obj></td>{/optional}
	</tr>
</table>