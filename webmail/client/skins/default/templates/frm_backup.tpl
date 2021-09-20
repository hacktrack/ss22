<div class="maxbox">
	<obj name="maintab" type="obj_vtabs">
		<obj name="contact" type="obj_tab">
			<value>BACKUP::IMPORT</value>
			<draw form="frm_backup_import"></draw>
		</obj>
		{noptional disable_export}
		<obj name="csv" type="obj_tab">
			<value>BACKUP::EXPORT</value>
			<draw form="frm_backup_export"></draw>
		</obj>
		{/noptional}
		<obj name="gw" type="obj_tab">
			<value>BACKUP::GW</value>
			<draw form="frm_backup_gw"></draw>
		</obj>
	</obj>
</div>