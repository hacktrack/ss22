<div class="maxbox">
	<obj name="maintab" type="obj_vtabs">
		<obj name="primary" type="obj_tab" css="accounts_primary">
			<value>SETTINGS::PRIMARY_ACCOUNTS</value>
			<draw form="frm_accounts_primary"></draw>
		</obj>
		{noptional disable_troubleshooting}
		<obj name="troubleshooting" type="obj_tab" ondemand="true" css="troubleshooting">
			<value>SETTINGS::TROUBLESHOOTING</value>
			<obj name="X_TROUBLESHOOTING" type="obj_troubleshooting"></obj>
		</obj>
		{/noptional}
		{noptional disable_private_certs}
		<obj name="certificate" type="obj_tab" ondemand="true">
			<value>SETTINGS::PCERTIFICATE</value>
			<obj name="X_CERT" type="obj_upload_edit_cert"></obj>
		</obj>
		{/noptional}
		{noptional disable_otheraccounts}
		<obj name="other" type="obj_tab">
			<value>SETTINGS::OTHER_ACCOUNTS</value>
			<draw form="frm_mail_settings_groups"></draw>
		</obj>
		{/noptional}
		{noptional disable_private_certs}
		<obj name="certificate" type="obj_tab" ondemand="true">
			<value>SETTINGS::OAUTH</value>
			<obj name="X_OAUTH" type="frm_account_oauth_settings"></obj>
		</obj>
		{/noptional}
	</obj>
</div>
