<div class="popupmaindialog">
	<table class="frmtbl">
		<tr><th class="th">{ATTENDEES::NAME}</th><td><obj name="CNTCONTACTNAME" focus="true" type="obj_input" tabindex="true"></obj></td></tr>
		<tr><th class="th">{ATTENDEES::EMAIL}</th><td>
		<obj name="CNTEMAIL" type="obj_input" tabindex="true">
			<restrictions>^([a-z0-9\'\!\#\$\%\&\+\-\/\=\?\^\_\`\{\|\}\~\*][\.]?)+\@[a-z0-9]+([\.\-\_]?[a-z0-9])*\.[a-z]{2,4}$</restrictions>
		</obj>
		</td></tr>
		<tr><th class="th">{ATTENDEES::ROLE}</th>
			<td>
				<obj name="CNTROLE" type="obj_select" tabindex="true">
				<value>Q</value>
				<fill>
					<item key="Q">{ATTENDEES::ROLE_Q}</item>
					<item key="S">{ATTENDEES::ROLE_S}</item>
					<item key="T">{ATTENDEES::ROLE_T}</item>
				</fill>
				</obj>
			</td>
		</tr>
		<tr><th class="th">{ATTENDEES::STATUS}</th>
			<td>
				<obj name="CNTSTATUS" type="obj_select" tabindex="true">
				<value>B</value>
				<fill>
					<item key="B">{ATTENDEES::STATUS_P}</item>
					<item key="A">{ATTENDEES::STATUS_A}</item>
					<item key="D">{ATTENDEES::STATUS_D}</item>
				</fill>
				</obj>
			</td>
		</tr>
	</table>
	<obj name="CNT_ID" type="obj_input" css="hidden"></obj>
</div>