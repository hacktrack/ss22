<table class="frmtbl frmtbl100" height="100%">
	<tr>
		<th class="th">{SETTINGS::TEMPERATURE}</th>
		<td colspan="2">
			<obj name="temperature" type="obj_select" tabindex="true">
				<fill>
					<item key="C">{SETTINGS::C}</item>
					<item key="F">{SETTINGS::F}</item>
				</fill>
			</obj>
		</td>
	</tr>
	<tr>
		<td colspan="3" class="space">&nbsp;</td>
	</tr>
	<tr>
		<th class="th">{SETTINGS::CITY}</th>
		<td><obj name="x_city" type="obj_select_input" tabindex="true"></obj></td>
		<td class="td"><obj name="x_find" type="obj_button" tabindex="true"><value>FORM_BUTTONS::FIND</value></obj></td>
	</tr>
	<tr height="100%">
		<td colspan="3" class="msiebox" id="{anchor msiebox}"><div class="msiebox"><obj name="x_cities" type="obj_listbox" css="obj_listbox_max"></obj></div></td>
	</tr>
	<tr>
		<td colspan="3"><obj name="x_remove" type="obj_button"><value>FORM_BUTTONS::REMOVE</value></obj></td>
	</tr>
</table>