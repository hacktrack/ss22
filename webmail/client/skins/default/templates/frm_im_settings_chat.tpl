<table class="frmtbl">
<tr>
	<th class="th" colspan="2"><obj name="enter_send" type="obj_checkbox" tabindex="true"><title>SETTINGS::ENTER_SEND</title></obj></th>{optional domainadmin}<td><obj name="x_enter_send_set" type="obj_allow_settings"></obj></td>{/optional}
</tr>
<tr>
	<th class="th" colspan="2"><obj name="block_chat" type="obj_checkbox" tabindex="true"><title>SETTINGS::NEWLINE_CHAT</title></obj></th>{optional domainadmin}<td><obj name="x_block_chat_set" type="obj_allow_settings"></obj></td>{/optional}
</tr>
<tr>
	<th class="th" colspan="2"><obj name="smiles" type="obj_checkbox" tabindex="true"><title>SETTINGS::SMILES_CHAT</title></obj></th>{optional domainadmin}<td><obj name="x_smiles_set" type="obj_allow_settings"></obj></td>{/optional}
</tr>
<tr>
	<th class="th">{SETTINGS::ESC_CHAT}</th>
	<td>
			<obj name="esc" type="obj_select" tabindex="true" css="max">
			<fill>
				<item key="0">{SETTINGS::ESC_NOTHING}</item>
				<item key="1">{SETTINGS::ESC_MINIMIZE}</item>
				<item key="2">{SETTINGS::ESC_CLOSE}</item>
			</fill>
			</obj>
	</td>
	{optional domainadmin}<td><obj name="x_esc_set" type="obj_allow_settings"></obj></td>{/optional}
</tr>
</table>