<div class="maxbox">
	<obj name="maintab" type="obj_tabs" css="noborder">
{noptional guest}
			<obj name="general_settings" type="obj_tab" ondemand="true">
				<value>SETTINGS::GENERAL_SETTINGS</value>
				<draw form="frm_general_settings"></draw>
			</obj>
			<obj name="account_settings" type="obj_tab" ondemand="true">
				<value>SETTINGS::ACCOUNT_SETTINGS</value>
				<draw form="frm_account_settings"></draw>
			</obj>
			<obj name="mail_settings" type="obj_tab" ondemand="true">
				<value>SETTINGS::MAIL_SETTINGS</value>
				<draw form="frm_mail_settings"></draw>
			</obj>
	{optional gw_access}
			<obj name="calendar_settings" type="obj_tab">
				<value>SETTINGS::CALENDAR_SETTINGS</value>
				<draw form="frm_calendar_settings"></draw>
			</obj>
	{/optional}
{/noptional}

{optional im_access}
		<obj name="im_settings" type="obj_tab" ondemand="true">
			<value>SETTINGS::CHAT_SETTINGS</value>
			<draw form="frm_im_settings"></draw>
		</obj>
{/optional}
{optional chat_access guest}
		<obj name="teamchat_settings" type="obj_tab" ondemand="true">
			<value>SETTINGS::TEAMCHAT</value>
			<draw form="frm_teamchat_settings"></draw>
		</obj>
{/optional}

{noptional guest}
	{optional sip_access}
			<obj name="sip_settings" type="obj_tab" ondemand="true">
				<value>SETTINGS::SIP_SETTINGS</value>
				<draw form="frm_sip_settings"></draw>
			</obj>
	{/optional}
	{noptional disable_licenses}
			<obj name="licenses" type="obj_tab" ondemand="true">
				<value>LICENSE::LICENSES</value>
				<obj name="maintab" type="obj_vtabs">
					<obj name="desktop" type="obj_tab">
						<value>LICENSE::DESK</value>
						<draw form="frm_licenses_settings"></draw>
					</obj>
					<obj name="outlook" type="obj_tab">
						<value>LICENSE::OUT</value>
						<draw form="frm_licenses_settings"></draw>
					</obj>
				</obj>
			</obj>
	{/noptional}
			<obj name="backup" type="obj_tab" ondemand="true">
				<value>SETTINGS::IMPORTEXPORT_SETTINGS</value>
				<draw form="frm_backup"></draw>
			</obj>
{/noptional}
	</obj>
</div>
