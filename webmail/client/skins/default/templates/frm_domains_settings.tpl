<div class="domain_settings maxbox relative">
	<table class="frmtbl table1">
		<tr>
			<th class="th">{SETTINGS::DOMAIN}</th>
			<th class="th"><obj name="x_domain" type="obj_select" ></obj></th>
			<td><obj name="x_adddomain" type="obj_button" css="color1"><value>FORM_BUTTONS::ADD</value></obj></td>
		</tr>
	</table>

	<div class="maxbox"><obj name="domains" type="obj_listbox_settings" css="obj_listbox_max"><init>domain</init></obj></div>

	<table class="frmtbl table2">
		<tr>
			<td><obj name="x_editdomain" type="obj_button"><value>SETTINGS::EDIT_SETTINGS</value></obj></td>
			<td><obj name="x_remove" type="obj_button" css="color2"><value>FORM_BUTTONS::REMOVE</value></obj></td>
		</tr>
	</table>
</div>