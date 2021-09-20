<div class="maxbox">
	<obj name="maintab" type="obj_tabs" css="noborder">
		<obj name="general" type="obj_tab">
			<value>IM::TAB_GENERAL</value>
			<draw form="frm_im_vcard_general"></draw>
		</obj>

		<obj name="work" type="obj_tab">
			<value>IM::TAB_WORK</value>
			<draw form="frm_im_vcard_work"></draw>
		</obj>

		<obj name="location" type="obj_tab">
			<value>IM::TAB_LOCATION</value>
			<obj name="location" type="obj_address" tabindex="true"><readonly>1</readonly></obj>
		</obj>

		<obj name="about" type="obj_tab">
			<value>IM::TAB_ABOUT</value>
			<draw form="frm_im_vcard_about"></draw>
		</obj>
	</obj>
</div>