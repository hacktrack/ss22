<div class="container" id="{anchor attach}"></div>
<div class="maxbox">
	<obj name="maintab" type="obj_tabs" css="noborder nobuttons">
		<obj name="tab1" type="obj_tab">
			<value>TASK::GENERAL</value>
			<draw form="frm_file_tab1"></draw>
		</obj>
		{optional revisions}
		<obj name="revisions" type="obj_tab" ondemand="true">
			<value>ITEM::REVISIONS</value>
			<draw form="frm_file_tab2"></draw>
		</obj>
		{/optional}
	</obj>
</div>