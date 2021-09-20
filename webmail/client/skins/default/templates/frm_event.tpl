<div class="maxbox">
	<obj name="maintab" type="obj_tabs" css="noborder">
		<obj name="tab1" type="obj_tab" ondemand="true">
			<value>EVENT::GENERAL</value>
			<draw form="frm_event_tab1"></draw>
		</obj>
		{noptional noRepeat}
		<obj name="tab2" type="obj_tab" ondemand="true">
			<value>EVENT::REPEATING</value>
			<obj name="X_REPEATING" type="obj_repeating"></obj>
		</obj>
		{/noptional}
		<obj name="tab3" type="obj_tab" ondemand="true">
			<value>EVENT::SCHEDULE</value>
		</obj>
		<obj name="tab5" type="obj_tab">
			<value>ATTACHMENT::ATTACHMENTS</value>
			<obj name="X_ATTACHMENTS" type="obj_upload_edit_select" ></obj>
		</obj>
	</obj>
</div>