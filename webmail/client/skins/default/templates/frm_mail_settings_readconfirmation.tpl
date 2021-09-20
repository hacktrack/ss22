<table class="frmtbl frmtbl100" height="100%">
	<tr>
		<th class="th">{SETTINGS::SEND_READ_CONFIRMATION}</th>
		<td>
			<obj name="send_confirmation" type="obj_select" tabindex="true" css="max">
			<fill>
				<item key="0">{SETTINGS::ASK_BEFORE}</item>
				<item key="1">{SETTINGS::ALWAYS}</item>
				<item key="2">{SETTINGS::NEVER}</item>				
			</fill>
			</obj>
		</td>
		{optional domainadmin}<td><obj name="x_send_confirmation_set" type="obj_allow_settings"></obj></td>{/optional}
	</tr>
	<tr>
		<th class="th">{SETTINGS::SUBJECT}</th>
		<td class="td"><obj name="subject" type="obj_input" css="obj_input_100" tabindex="true"></obj></td>
	</tr>
	<tr height="100%">
		<td colspan="2" class="msiebox" id="{anchor msiebox}"><div class="msiebox"><obj name="text" type="obj_text" tabindex="true" css="obj_text100"></obj></div></td>
	</tr>
</table>