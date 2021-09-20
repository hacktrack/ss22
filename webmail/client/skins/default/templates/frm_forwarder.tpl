<table class="frmtbl">
	<tr>
		<th class="th">{FORWARDER::FORWARD_TO}</th>
		<td><obj name="u_forwardto" type="obj_input" tabindex="true"></obj></td>
	</tr>
	{noptional disable_keep_emails}
	<tr>
		<th class="th"><obj name="u_null" type="obj_checkbox_inverse" tabindex="true"><title>FORWARDER::KEEP_COPY</title></obj></th>
		<td>&nbsp;</td>
	</tr>
	{/noptional}
	<tr>
		<th class="th"><obj name="u_forwardolder" type="obj_checkbox" tabindex="true"><title>FORWARDER::FORWARD_OLDER</title></obj></th>
		<td><obj name="u_forwardolderdays" type="obj_input" css="obj_input_small" tabindex="true"></obj></td>
	</tr>
	<tr>
		<th class="th">{FORWARDER::FORWARD_OLDER_TO}</th>
		<td><obj name="u_forwardolderto" type="obj_input" tabindex="true"></obj></td>
	</tr>
</table>
