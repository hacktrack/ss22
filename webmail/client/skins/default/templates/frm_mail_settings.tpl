<div class="maxbox">
	<obj name="maintab" type="obj_vtabs">
		<obj name="general" type="obj_tab" ondemand="true">
			<value>SETTINGS::GENERAL</value>
			<draw form="frm_mail_settings_general"></draw>
		</obj>
		<obj name="mail_default" type="obj_tab" ondemand="true">
			<value>SETTINGS::DEFAULT_MAIL_SETTINGS</value>
			<draw form="frm_mail_settings_default"></draw>
		</obj>
		{noptional disable_autoresponder}
		<obj name="autoresponder" type="obj_tab" ondemand="true">
			<value>SETTINGS::AUTORESPONDER</value>
			<obj name="autoresponder" type="frm_autoresponder"></obj>
		</obj>
		{/noptional}
		{noptional disable_forwarder}
		<obj name="forwarder" type="obj_tab" ondemand="true">
			<value>SETTINGS::FORWARDER</value>
			<draw form="frm_forwarder"></draw>
		</obj>
		{/noptional}
		{noptional domainadmin}
		{optional rules}
		<obj name="rules" type="obj_tab" ondemand="true" css="rules">
			<value>SETTINGS::EDIT_RULES</value>
			<draw form="frm_rules"></draw>
		</obj>
		{/optional}
		{/noptional}
		<obj name="readconfirmation" type="obj_tab" ondemand="true">
			<value>SETTINGS::READ_CONFIRMATION</value>
			<draw form="frm_mail_settings_readconfirmation"></draw>
		</obj>
		<obj name="signature" type="obj_tab" ondemand="true" css="signature">
			<value>SETTINGS::SIGNATURE</value>
			<draw form="frm_mail_settings_signature"></draw>
		</obj>
		<obj name="alias" type="obj_tab" ondemand="true" css="alias">
			<value>SETTINGS::ALIASES</value>
			<draw form="frm_mail_settings_alias"></draw>
		</obj>
	</obj>
</div>