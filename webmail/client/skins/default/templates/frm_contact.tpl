<div class="maxbox">
	<obj name="maintab" type="obj_tabs" css="noborder">
		<obj name="tab1" type="obj_tab" ondemand="true">
			<value>CONTACT::GENERAL</value>
			<draw form="frm_contact_tab1"></draw>
		</obj>
		<obj name="tab2" type="obj_tab" ondemand="true">
			<value>CONTACT::PERSONAL</value>
			<draw form="frm_contact_tab2"></draw>
		</obj>
		<obj name="tab3" type="obj_tab" ondemand="true">
			<value>CONTACT::BUSINESS</value>
			<draw form="frm_contact_tab3"></draw>
		</obj>
		<obj name="tab4" type="obj_tab" ondemand="true">
			<value>CONTACT::OTHER</value>
			<obj name="ITMDESCRIPTION" type="obj_wysiwyg"></obj>
		</obj>
		<obj name="tab5" type="obj_tab" ondemand="true">
			<value>ATTACHMENT::ATTACHMENTS</value>
			<obj name="X_ATTACHMENTS" type="obj_upload_edit_select"></obj>
		</obj>
		<obj name="tab6" type="obj_tab" ondemand="true">
			<value>SETTINGS::CERTIFICATE</value>
			<obj name="X_CERT" type="obj_upload_edit_cert"><init>1</init></obj>
		</obj>
	</obj>
</div>
