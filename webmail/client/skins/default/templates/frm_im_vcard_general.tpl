<table class="frmtbl frmtbl100">
	<tr>
		<th class="th">{CONTACT::FULL_NAME}</th>
		<td class="td"><obj name="FN" type="obj_input" css="obj_input_100" tabindex="true"><readonly>1</readonly></obj></td>
		<td rowspan="5"><div class="avatar"><img id="{anchor avatar}" /></div></td>
	</tr>
	<tr>
		<th class="th">{CONTACT::NICK_NAME}</th>
		<td class="td"><obj name="NICKNAME" type="obj_input" css="obj_input_100" tabindex="true"><readonly>1</readonly></obj></td>
	</tr>
	<tr>
		<th class="th">{CONTACT::BIRTHDATE}</th>
		<td class="td"><obj name="BDAY" type="obj_input" css="obj_input_100" tabindex="true"><readonly>1</readonly></obj></td>
	</tr>
	<tr>
		<th class="th">{CONTACT::PHONE}</th>
		<td class="td"><obj name="NUMBER" type="obj_input_phone" tabindex="true"><readonly>1</readonly></obj></td>
	</tr>
	<tr>
		<th class="th">{CONTACT::WEB}</th>
		<td class="td"><obj name="URL" type="obj_input_url" css="obj_input_100" tabindex="true"><readonly>1</readonly></obj></td>
	</tr>
	<tr>
		<th class="th">{CONTACT::EMAIL_ADDRESS}</th>
		<td class="td"><obj name="USERID" type="obj_input_email" tabindex="true"><readonly>1</readonly></obj></td>
		{optional edit}<td><obj name="X_AVATAR" type="obj_upload"><readonly>1</readonly></obj></td>{/optional}
	</tr>
</table>