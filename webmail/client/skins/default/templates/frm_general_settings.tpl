<div class="maxbox">
	<obj name="maintab" type="obj_vtabs">
		<obj name="layout" type="obj_tab" ondemand="true">
			<value>SETTINGS::LAYOUT</value>
			<draw form="frm_general_settings_layout"></draw>
		</obj>
		{optional settings}
		<obj name="folders" type="obj_tab" ondemand="true">
			<value>SETTINGS::FOLDERS_MAPPING</value>
			<draw form="frm_settings_folders"></draw>
		</obj>
		{/optional}
		<obj name="documents" type="obj_tab" ondemand="true">
			<value>SETTINGS::DOCUMENTS</value>
			<draw form="frm_settings_documents"></draw>
		</obj>
		{optional domainadmin}
		<obj name="login" type="obj_tab" ondemand="true">
			<value>SETTINGS::LOGIN_SCREEN</value>
			<draw form="frm_general_settings_login"></draw>
		</obj>
		{/optional}
		{noptional disable_antispam admin domainadmin}
		<obj name="antispam" type="obj_tab" ondemand="true">
			<value>SETTINGS::ANTISPAM</value>
			<draw form="frm_antispam"></draw>
		</obj>
		{/noptional}
		{optional admin}
		<obj name="reset" type="obj_tab" ondemand="true">
			<value>SETTINGS::RESETPASS</value>
			<draw form="frm_general_settings_reset"></draw>
		</obj>
		<obj name="server" type="obj_tab" ondemand="true">
			<value>SETTINGS::SERVER</value>
			<draw form="frm_general_settings_server"></draw>
		</obj>
		{/optional}
		{optional domainadmin}
		<obj name="homepage" type="obj_tab" ondemand="true">
			<value>SETTINGS::HOMEPAGE</value>
			<draw form="frm_general_settings_home"></draw>
		</obj>
		<obj name="restrictions" type="obj_tab" ondemand="true">
			<value>SETTINGS::RESTRICTIONS</value>
			<draw form="frm_general_settings_restrictions"></draw>
		</obj>
		<obj name="dropbox" type="obj_tab" ondemand="true">
			<value>SETTINGS::INTEGRATIONS</value>
			<draw form="frm_general_settings_dropbox"></draw>
		</obj>
		{/optional}
	</obj>
</div>