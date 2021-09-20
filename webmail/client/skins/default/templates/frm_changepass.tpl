<div class="popupmaindialog">
<table class="frmtbl frmtbl100">
	{optional expire}
	<tr>
		<td colspan="2"><obj name="obj_label" type="obj_label"><value>{CONFIRMATION::EXPIRED_PASSWORD}</value></obj></td>
	</tr>
	<tr>
		<th colspan="2">&nbsp;</th>
	</tr>
	{/optional}
	<tr>
		<th class="th">{SETTINGS::OLD_PASSWORD}</th>
		<td><obj name="x_old_password" type="obj_password" tabindex="true" focus="true"></obj></td>
	</tr>
	<tr>
		<td colspan="2" class="space">&nbsp;</td>
	</tr>
	<tr>
		<th class="th">{SETTINGS::NEW_PASSWORD}</th>
		<td class="td"><obj name="x_new_password" type="obj_password" tabindex="true"></obj>{optional policy}<obj name="x_policy" type="obj_button" css="ico img policy transparent"></obj>{/optional}</td>
	</tr>
	<tr>
		<th class="th">{SETTINGS::NEW_PASSWORD_CONF}</th>
		<td><obj name="x_new_password_conf" type="obj_password" tabindex="true"></obj></td>
	</tr>
	<tr>
		<th></th>
		<td><obj name="x_info" type="obj_label" tabindex="true" css="error"></obj></td>
	</tr>
</table>
</div>