<table class="frmtbl">
	<!-- Mail -->
	<tr>
		<td class="th"><obj name="mailfilter" type="obj_checkbox"><title>DEVICES::PAST_MAIL</title></obj></td>
		<td width="50%">
			<obj name="mailinterval" type="obj_select" css="max">
				<fill>
					<item>{DEVICES::SYNC_ALL}</item>
					<item>{DEVICES::ONE_DAY}</item>
					<item>{DEVICES::THREE_DAYS}</item>
					<item>{DEVICES::ONE_WEEK}</item>					
					<item>{DEVICES::TWO_WEEKS}</item>
					<item>{DEVICES::ONE_MONTH}</item>
				</fill>
				<disabled>1</disabled>
			</obj>
		</td>
	</tr>
	<tr>
		<td colspan="2">&nbsp;</td>
	</tr>
	<!-- Calendar -->
	<tr>
		<td class="th"><obj name="calendarfilter" type="obj_checkbox"><title>DEVICES::PAST_CALENDAR</title></obj></td>
		<td>
			<obj name="calendarinterval" type="obj_select" css="max">
				<fill>
					<item>{DEVICES::SYNC_ALL}</item>
					<item>{DEVICES::TWO_WEEKS}</item>
					<item>{DEVICES::ONE_MONTH}</item>
					<item>{DEVICES::THREE_MONTHS}</item>
					<item>{DEVICES::SIX_MONTHS}</item>
				</fill>
				<disabled>1</disabled>
			</obj>
		</td>
	</tr>
	<tr>
		<td colspan="2">&nbsp;</td>
	</tr>
	<!-- Tasks -->
	<tr>
		<td class="th"><obj name="tasksasevents" type="obj_checkbox"><title>DEVICES::SYNC_TASE</title></obj></td>
		<td>
			<obj name="taskssync" type="obj_select" css="max">
				<fill>
					<item>{DEVICES::SYNC_ALL}</item>
					<item>{DEVICES::INC_TASKS}</item>
				</fill>
				<disabled>1</disabled>
			</obj>
		</td>
	</tr>
	<tr>
		<td class="th"></td>
		<td>
			<obj name="taskssynctype" type="obj_select" css="max">
				<fill>
					<item>{DEVICES::NEW_CFOLDERS}</item>
					<item>{DEVICES::MERGE_TAKS}</item>
				</fill>
				<disabled>1</disabled>
			</obj>
		</td>
	</tr>
	<tr>
		<td colspan="2">&nbsp;</td>
	</tr>
	<!-- Notes -->
	<tr>
		<td class="th"><obj name="notesaseventsortasks" type="obj_checkbox"><title>DEVICES::SYNC_NOTE</title></obj></td>
		<td>
			<obj name="notessync" type="obj_select" css="max">
				<fill>
					<item key="1">{DEVICES::EVENTS}</item>
					<item key="2">{DEVICES::TASKS}</item>
					<item key="3">{DEVICES::INOTES}</item>
				</fill>
				<disabled>1</disabled>
			</obj>
		</td>
	</tr>
	<tr>
		<td class="th"></td>
		<td>
			<obj name="notessynctype" type="obj_select" css="max">
				<fill>
					<item>{DEVICES::NEW_FOLDERS}</item>
					<item>{DEVICES::MERGE_DEFAULT}</item>
				</fill>
				<disabled>1</disabled>
			</obj>
		</td>
	</tr>
</table>