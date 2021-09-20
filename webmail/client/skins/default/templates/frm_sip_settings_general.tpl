<table class="frmtbl frmtbl100">
	<tr>
		<td colspan="4"><obj name="x_java" type="obj_radio" tabindex="true"></obj></td>
	</tr>
	<tr>
		<th class="th">&nbsp;</th>
		<td colspan="3" class="td"><obj name="start" type="obj_checkbox" tabindex="true"><title>SETTINGS::SIP_START</title></obj></td>
	</tr>
{optional esip_access}
	<tr>
		<td></td>
		<td colspan="3"><obj name="external" type="obj_checkbox" tabindex="true"><title>SETTINGS::SIP_EXTERNAL</title></obj></td>
	</tr>
	<tr>
		<td></td>
		<th class="th">&nbsp;</th>
		<th class="th">{FORM_ACCOUNTS::USERNAME}</th>
		<td class="td"><obj name="user" type="obj_input" tabindex="true"><disabled>true</disabled></obj></td>
	</tr>
	<tr>
		<td></td>
		<td></td>
		<th class="th">{FORM_ACCOUNTS::PASSWORD}</th>
		<td class="td"><obj name="pass" type="obj_password" tabindex="true"><disabled>true</disabled></obj></td>
	</tr>
	<tr>
		<td></td>
		<td></td>
		<th class="th">{FORM_ACCOUNTS::EXTENSION}</th>
		<td class="td"><obj name="ext" type="obj_input" tabindex="true"><disabled>true</disabled></obj></td>
	</tr>
	<tr>
	    <td></td>
	    <td></td>
	    <th class="th">{FORM_ACCOUNTS::SERVER_PROXY}</th>
	    <td class="td"><obj name="server" type="obj_input" tabindex="true"><disabled>true</disabled></obj></td>
	</tr>
{/optional}
	<tr>
		<td colspan="4">&nbsp;</td>
	</tr>
	<tr>
		<td colspan="4"><obj name="x_dial" type="obj_radio" tabindex="true"></obj></td>
	</tr>
{optional esip_access}
	<tr>
		<td colspan="4">&nbsp;</td>
	</tr>
	<tr>
		<td colspan="4"><obj name="x_dial_ext" type="obj_radio" tabindex="true"></obj></td>
	</tr>
	<tr>
	    <td></td>
	    <td colspan="3"><obj name="dial" type="obj_input" tabindex="true"></obj></td>
	</tr>
{/optional}
</table>