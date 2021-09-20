<table class="frmtbl">
	{optional domainadmin}
	<tr>
		<td class="th"><obj name="teamchat_notify" type="obj_checkbox" tabindex="true" css="switch right"><title>SETTINGS::TEAMCHAT_DIGEST_HELPER</title></obj></td>
	</tr>
	<tr>
		<td class="space">&nbsp;</td>
	</tr>
	{/optional}
	{noptional domainadmin}
	<tr>
		<td class="th"><obj name="u_gw_teamchat_dailynotify" type="obj_checkbox" tabindex="true" css="switch right"><title>SETTINGS::TEAMCHAT_DIGEST_DAILY</title></obj></td>
	</tr>
	<tr>
		<td class="th"><obj name="u_gw_teamchat_pinnotify" type="obj_checkbox" tabindex="true" css="switch right"><title>SETTINGS::TEAMCHAT_DIGEST_PIN</title></obj></td>
	</tr>
	<tr>
		<td class="th"><obj name="u_gw_teamchat_uploadnotify" type="obj_checkbox" tabindex="true" css="switch right"><title>SETTINGS::TEAMCHAT_DIGEST_FILE</title></obj></td>
	</tr>
	<tr>
		<td class="th"><obj name="u_gw_teamchat_mentionnotify" type="obj_checkbox" tabindex="true" css="switch right"><title>SETTINGS::TEAMCHAT_DIGEST_MENTION</title></obj></td>
	</tr>
	{/noptional}
</table>