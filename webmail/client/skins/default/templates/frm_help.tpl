<div class="maxbox">
	<obj name="maintab" type="obj_tabs" css="noborder">
		{noptional guest}
		<obj name="help" type="obj_tab" ondemand="true">
			<value>HELP::HELP</value>
		</obj>
		{/noptional}
		{optional chat}
		<obj name="chat" type="obj_tab" ondemand="true">
			<value>SETTINGS::TEAMCHAT</value>
		</obj>
		{/optional}
		<obj name="apps" type="obj_tab" ondemand="true">
			<value>WHATSNEW::APPS</value>
		</obj>
		{noptional guest}
		<obj name="license" type="obj_tab" ondemand="true">
			<value>LICENSE::LICENSE</value>
		</obj>
		{/noptional}
		<obj name="about" type="obj_tab" ondemand="true">
			<value>HELP::ABOUT</value>
		</obj>
	</obj>
</div>
