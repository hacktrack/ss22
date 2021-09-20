{optional enable_banner}
<div class="frm_main_home_banner" id="{anchor banner}"></div>
{/optional}

{optional enable_quota enable_smsquota}
<table class="frmtbl nospace">
	{optional enable_quota}
		<tr>
			<th class="th" colspan="2"><h2>{SETTINGS::QUOTA_HOME}</h2></th>
		</tr>
		<tr>
			<th class="th"><obj name="quota" type="obj_progress"></obj></th>
			<td class="td"><obj name="x_quota" type="obj_label"></obj></td>
		</tr>
		<tr>
			<td colspan="2">&nbsp;</td>
		</tr>
	{/optional}
	{optional enable_smsquota}
		<tr>
			<th class="th" colspan="2"><h2>{SETTINGS::SMS_QUOTA}</h2></th>
		</tr>
		<tr>
			<th class="th"><obj name="smsquota" type="obj_progress"></obj></th>
			<td class="td"><obj name="x_smsquota" type="obj_label"></obj></td>
		</tr>
		<tr>
			<td colspan="2">&nbsp;</td>
		</tr>
	{/optional}
</table>
{/optional}


<h2>{HOME::LOGIN_INFO}</h2>
<div class="home_block">
<table class="frmtbl nospace">
	<tr>
		<th class="th">{SETTINGS::LAST_TIME}</th><td class="th"><obj name="x_last_time" type="obj_label"></obj></td>
		<th class="th">{SETTINGS::CURRENT_TIME}</th><td class="th"><obj name="x_current_time" type="obj_label"></obj></td>
	</tr>
	<tr>
		<th class="th">{SETTINGS::LAST_IP}</th><td><obj name="x_last_ip" type="obj_label"></obj></td>
		<th class="th">{SETTINGS::CURRENT_IP}</th><td><obj name="x_current_ip" type="obj_label"></obj></td>
	</tr>
</table>
</div>

{optional enable_application}
<h2>{HOME::LICENSES}</h2>
<a id="{anchor license}" class="home_block">{HOME::LICENSES_TEXT}</a>
{/optional}