<div class="maxbox">
	<obj name="maintab" type="obj_tabs" css="noborder">
		<obj name="tab1" type="obj_tab" ondemand="true">
			<value>TASK::GENERAL</value>
			<draw form="frm_task_tab1"></draw>
		</obj>
		<obj name="tab2" type="obj_tab" ondemand="true">
			<value>TASK::REPEATING</value>
			<obj name="X_REPEATING" type="obj_repeating"></obj>
		</obj>
		{noptional attendees}
		<obj name="tab5" type="obj_tab" ondemand="true">
			<value>TASK::ATTENDEES</value>
			<obj name="X_ATTENDEES" type="obj_attendees"><init><item>ATTENDEES</item><item>{owner}</item></init></obj>
		</obj>
		{/noptional}
		<obj name="tab4" type="obj_tab">
			<value>ATTACHMENT::ATTACHMENTS</value>
			<obj name="X_ATTACHMENTS" type="obj_upload_edit_select" ></obj>
		</obj>
	</obj>
</div>