<div class="maxbox">
	<obj name="maintab" type="obj_vtabs">
		<obj name="general" type="obj_tab" ondemand="true">
			<value>SETTINGS::GENERAL</value>
			<draw form="frm_sip_settings_general"></draw>
		</obj>
		{optional allow_call_forwarding}
		<obj name="forward" type="obj_tab" ondemand="true">
			<value>SETTINGS::CALL_FORWARDING</value>
			<draw form="frm_sip_settings_forward"></draw>
		</obj>
		{/optional}
	</obj>
</div>