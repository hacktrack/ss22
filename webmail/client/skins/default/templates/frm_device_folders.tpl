<table class="frmtbl">
	<tr>
		<td colspan="2" class="caption">{DEVICES::PRIVATE_FOLDERS}</td>
	</tr>
	<tr>
		<th class="th">{DEVICES::GW_FOLDERS}</th>
		<td>
			<obj name="groupware" type="obj_select">
				<fill>
					<item>{DEVICES::DEFAULT_ONLY}</item>
					<item>{DEVICES::ALL_FOLDERS}</item>
					<item>{DEVICES::ALL_FOLDERS_MAIL}</item>
				</fill>
			</obj>
		</td>
	</tr>
	<tr>
		<th>{DEVICES::MAIL_FOLDERS}</th>
		<td>
			<obj name="mailfolders" type="obj_select">
				<fill>
					<item>{DEVICES::DEFAULT_ONLY}</item>
					<item>{DEVICES::ALL_FOLDERS}</item>
				</fill>
			</obj>
		</td>
	</tr>

	<tr>
		<td colspan="2">&nbsp;</td>
	</tr>

	<tr>
		<td colspan="2" class="caption">{DEVICES::SPECIAL_FOLDERS}</td>
	</tr>
	<tr>
		<td colspan="2"><obj name="archive" type="obj_checkbox"><title>DEVICES::ARCHIVE</title></obj></td>
	</tr>
	<tr>
		<td colspan="2"><obj name="publicfolders" type="obj_checkbox"><title>DEVICES::PUBLIC</title></obj></td>
	</tr>
	<tr>
		<td colspan="2"><obj name="sharedfolders" type="obj_checkbox"><title>DEVICES::SHARED</title></obj></td>
	</tr>
</table>