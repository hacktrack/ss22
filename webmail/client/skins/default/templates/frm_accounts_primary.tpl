<table class="frmtbl frmtbl100">
	<tr>
		<th>{COMMON::EMAIL}</th>
		<th class="caption">{account}</th>
	</tr>
	{optional enable_quota}
	<tr>
		<th class="th">{SETTINGS::QUOTA}</th>
		<td class="td"><obj name="progress" type="obj_progress"></obj></td>
	</tr>
	{/optional}
	{optional enable_smsquota}
	<tr>
		<th class="th">{SETTINGS::SMS_QUOTA}</th>
		<td class="td"><obj name="progress2" type="obj_progress"></obj></td>
	</tr>
	{/optional}
	<tr>
		<td colspan="2" class="space">&nbsp;</td>
	</tr>
	<tr>
		<th class="th">{SETTINGS::ACC_NAME}</th>
		<td class="td"><obj name="fullname" type="obj_input" focus="true" tabindex="true">{optional disable_accountedit}<disabled>1</disabled>{/optional}</obj></td>
	</tr>
	<!--tr>
		<th class="th">{SETTINGS::DESCRIPTION}</th>
		<td><obj name="description" type="obj_input" tabindex="true">{optional disable_accountedit}<disabled>1</disabled>{/optional}</obj></td>
	</tr-->

	{optional altmail}
	<tr>
		<th class="th">{SETTINGS::ALTERNATIVE_EMAIL}</th>
		<td><obj name="alternative" type="obj_input" tabindex="true">{noptional disable_accountedit}<placeholder>email@example.com</placeholder>{/noptional}{optional disable_accountedit}<disabled>1</disabled>{/optional}</obj></td>
	</tr>
	<tr>
		<th></th>
		<th class="caption">{SETTINGS::USED_FOR_PASSWORD_RECOVERY}</th>
	</tr>
	{/optional}

	<tr>
		<td colspan="2" class="hr">&nbsp;</td>
	</tr>

	{noptional disable_changepass}
	<tr>
		<th class="th">{FORM_ACCOUNTS::PASSWORD}</th>
		<td><obj name="x_password" type="obj_button" tabindex="true" css="color1"><value>LOGIN_SCREEN::CHANGE_PASSWORD</value></obj></td>
	</tr>
	<tr>
		<td colspan="2" class="space">&nbsp;</td>
	</tr>
	{/noptional}
	{optional enable_2f}
	<tr>
		<th class="th"></th>
		<td><obj name="x_2f" type="obj_button" tabindex="true" css="color1"><value>VERIFICATION::TWOSTEP</value></obj><obj name="x_2fl" type="obj_label" css="lable_2f"></obj></td>
	</tr>
	{/optional}
	<tr>
		<td colspan="2" class="space">&nbsp;</td>
	</tr>
	<tr>
		<th class="th">{SETTINGS::LAST_TIME}</th>
		<td><obj name="x_last_time" type="obj_label"></obj></td>
	</tr>
	<tr>
		<th class="th">{SETTINGS::LAST_IP}</th>
		<td><obj name="x_last_ip" type="obj_label"></obj></td>
	</tr>
</table>
