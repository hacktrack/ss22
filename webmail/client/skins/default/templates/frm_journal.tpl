<div class="maxbox">
	<obj name="maintab" type="obj_tabs" css="noborder">
		<obj name="tab1" type="obj_tab" ondemand="true">
			<value>EVENT::GENERAL</value>
			<draw form="frm_journal_tab1"></draw>
		</obj>
		{noptional schedule}
		<obj name="tab2" type="obj_tab" ondemand="true">
			<value>TASK::ATTENDEES</value>
			<obj name="X_ATTENDEES" type="obj_attendees"><init><item>ATTENDEES</item><item>{owner}</item></init></obj>
		</obj>
		{/noptional}
		<obj name="tab3" type="obj_tab">
			<value>ATTACHMENT::ATTACHMENTS</value>
			<obj name="X_ATTACHMENTS" type="obj_upload_edit_select"></obj>
		</obj>
	</obj>
</div>