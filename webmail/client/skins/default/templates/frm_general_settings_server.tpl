<table class="frmtbl">
	<tr>
		<th class="th">{SETTINGS::HTTP_PORT}</th>
		<td colspan="3"><obj name="http_port" type="obj_input" css="obj_input_small" tabindex="true"></obj></td>
	</tr>
	<tr>
		<th class="th">{SETTINGS::IMAPSERVER}</th>
		<td><obj name="imapserver" type="obj_input" tabindex="true"></obj></td>
		<th class="th">{SETTINGS::PORT}</th>
		<td><obj name="imapport" type="obj_input" css="obj_input_small" tabindex="true"></obj></td>
	</tr>
	<tr>
		<th class="th">{SETTINGS::SMTPSERVER}</th>
		<td><obj name="smtpserver" type="obj_input" tabindex="true"></obj></td>
		<th class="th">{SETTINGS::PORT}</th>
		<td><obj name="smtpport" type="obj_input" css="obj_input_small" tabindex="true"></obj></td>
	</tr>
	<tr>
		<th class="th">{SETTINGS::XMPPSERVER}</th>
		<td><obj name="xmppserver" type="obj_input" tabindex="true"></obj></td>
		<th class="th">{SETTINGS::PORT}</th>
		<td><obj name="xmppport" type="obj_input" css="obj_input_small" tabindex="true"></obj></td>
	</tr>
	<tr>
		<th class="th" colspan="4"><obj name="sso_only" type="obj_checkbox" tabindex="true"><title>SETTINGS::SSO_ONLY</title></obj></th>
	</tr>
	<tr>
		<th class="th" colspan="4"><obj name="logging_type" type="obj_checkbox" tabindex="true"><title>SETTINGS::LOGIN_WITH_EMAIL</title></obj></th>
	</tr>
	<tr>
		<th class="th" colspan="4"><obj name="collate" type="obj_checkbox" tabindex="true"><title>SETTINGS::COLLATE</title></obj></th>
	</tr>
	<tr>
        <th class="th">{SETTINGS::SERVER_LOGS}</th>
		<td colspan="3"><obj name="logs" type="obj_select" tabindex="true">
			<fill>
				<item key="0">{SETTINGS::SERVER_LOGS0}</item>
				<item key="2">{SETTINGS::SERVER_LOGS2}</item>
				<item key="3">{SETTINGS::SERVER_LOGS3}</item>
				<item key="4">{SETTINGS::SERVER_LOGS4}</item>
			</fill>
		</obj></td>
	</tr>
	<tr>
		<td colspan="4" class="space">&nbsp;</td>
	</tr>
	<tr>
		<th class="th" colspan="4"><obj name="http_secure_cookie" type="obj_checkbox" tabindex="true"><title>SETTINGS::HTTP_SECURE_COOKIE</title></obj></th>
	</tr>
	<tr>
		<th class="th">{SETTINGS::UPLOAD_LIMIT}</th>
		<td colspan="3"><obj name="upload_limit" type="obj_input" css="obj_input_small" tabindex="true"><restrictions>&gt;-1i</restrictions></obj></obj></td>
	</tr>
</table>
