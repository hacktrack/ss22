<div class="maxbox">
	<obj name="maintab" type="obj_vtabs">
		<obj name="general" type="obj_tab" ondemand="true">
			<value>SETTINGS::GENERAL</value>
			<draw form="frm_teamchat_settings_general"></draw>
		</obj>
		{optional digest_allowed domainadmin}
		<obj name="digest" type="obj_tab" ondemand="true">
			<value>SETTINGS::TEAMCHAT_DIGEST</value>
			<draw form="frm_teamchat_settings_digest"></draw>
		</obj>
		{/optional}
	</obj>
</div>
