<div class="maxbox">
	<obj name="maintab" type="obj_tabs" css="noborder">
		{optional gw}
		<obj name="sip" type="obj_tab" ondemand="true">
			<value>DIAL::PBOOK</value>
			<draw form="frm_dial_sip"></draw>
		</obj>
		{/optional}
		<obj name="dial" type="obj_tab" css="dial_tab" ondemand="true">
			<value>DIAL::DIAL</value>
			<draw form="frm_call"></draw>
		</obj>
		<obj name="history" type="obj_tab" ondemand="true">
			<value>DIAL::HISTORY</value>
			<draw form="frm_dial_history"></draw>
		</obj>
		<obj name="missed" type="obj_tab" ondemand="true">
			<value>DIAL::MISSED</value>
			<draw form="frm_dial_history"></draw>
		</obj>
		<obj name="incoming" type="obj_tab" ondemand="true">
			<value>DIAL::INCOMING</value>
			<draw form="frm_dial_history"></draw>
		</obj>
		<obj name="outgoing" type="obj_tab" ondemand="true">
			<value>DIAL::OUTGOING</value>
			<draw form="frm_dial_history"></draw>
		</obj>
	</obj>
</div>