<table class="frmtbl frmtbl100 nospace">
	<tr>
		<th width="0%" class="th">
		<obj name="snooze" type="obj_select">
			<value>15</value>
			<fill>
				<item key="15">15 {TIME::MINUTES}</item>
				<item key="30">30 {TIME::MINUTES}</item>
				<item key="45">45 {TIME::MINUTES}</item>
				<item key="60">60 {TIME::MINUTES}</item>
				<item key="90">90 {TIME::MINUTES}</item>
				<item key="120">2 {TIME::HOURS}</item>
				<item key="240">4 {TIME::HOURS}</item>
				<item key="480">8 {TIME::HOURS}</item>
				<item key="720">12 {TIME::HOURS}</item>
				<item key="1440">1 {TIME::DAYS}</item>
				<item key="2880">2 {TIME::DAYS}</item>
				<item key="4320">3 {TIME::DAYS}</item>
				<item key="5760">4 {TIME::DAYS}</item>
				<item key="7200">5 {TIME::DAYS}</item>
				<item key="8640">6 {TIME::DAYS}</item>
				<item key="10080">7 {TIME::DAYS}</item>
			</fill>
		</obj>
		</th>
		<td width="100%"><obj name="btn_snooze" type="obj_button" css="snooze simple color1 noborder"><value>REMINDER::SNOOZE</value></obj></td>
		<td width="0%"><obj name="btn_dismiss" type="obj_button" css="cancel color2 simple noborder"><value>REMINDER::DISMISS</value></obj></td>
	</tr>
</table>