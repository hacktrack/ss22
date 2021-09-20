<div class="popupmaindialog">
	<table class="frmtbl">
		<tr>
			<td class="th"><obj name="sound_notify" type="obj_checkbox" tabindex="true" css="switch right"><title>SETTINGS::SOUND_NOTIFY</title></obj></td>
		</tr>
		<tr>
			<td class="th"><obj name="visual_notify" type="obj_checkbox" tabindex="true" css="switch right"><title>SETTINGS::SYSTEM_NOTIFY</title></obj></td>
		</tr>
		<tr>
			<td class="space">&nbsp;</td>
		</tr>
		<tr>
			<td class="th"><obj name="smiles" type="obj_checkbox" tabindex="true" css="switch right"><title>SETTINGS::SMILES_CHAT</title></obj></td>
		</tr>
		<tr>
			<td class="space">&nbsp;</td>
		</tr>
	</table>
	{include frm_teamchat_settings_digest}
	{noptional disable_changepass}
		<table>
			<tr>
				<td class="space">&nbsp;</td>
			</tr>
			<tr>
				<td><obj name="x_password" type="obj_button" tabindex="true" css="color1"><value>LOGIN_SCREEN::CHANGE_PASSWORD</value></obj></td>
			</tr>
		</table>
	{/noptional}
</div>