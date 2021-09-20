<table class="frmtbl frmtblmax">
<tr>
	<th class="th">{TASK::TITLE}</th>
	<td class="td"><obj name="EVNTITLE" type="obj_input" focus="true" css="obj_input_100" tabindex="true"></obj></td>
</tr>
<tr>
	<th class="th">{TASK::START_DATE}</th>
	<td><obj name="EVNENDDATE" type="obj_input_calendar"><init>empty</init></obj></td>
</tr>
<tr>
	<th class="th">{TASK::DUE_DATE}</th>
	<td><obj name="EVNSTARTDATE" type="obj_input_calendar"><init>empty</init></obj></td>
</tr>
<tr>
	<td colspan="2" class="space">&nbsp;</td>
</tr>
<tr>
	<td colspan="2"><obj name="X_REMINDERS" type="obj_reminder_task" tabindex="true"></obj></td>
</tr>
<tr>
	<td colspan="2" class="space">&nbsp;</td>
</tr>
<tr>
	<th class="th">{TASK::STATUS}</th>
	<td>
	<table class="frmtbl nospace">
		<th class="th">
			<obj name="EVNSTATUS" type="obj_select" tabindex="true" css="task_status"></obj>
		</th>
		<th class="th">{TASK::COMPLETE} [%]</th>
		<td>
			<obj name="X_EVNCOMPLETE" type="obj_select_input" css="small" tabindex="true">
				<fill>
					<item>0</item>
					<item>25</item>
					<item>50</item>
					<item>75</item>
					<item>100</item>
				</fill>
			</obj>
		</td>
	</table>
	</td>
</tr>
<tr>
	<th class="th">{SETTINGS::PRIORITY}</th>
	<td>
	<obj name="EVNPRIORITY" type="obj_select" tabindex="true">
		<fill>
			<item key="9">{EMAIL_PRIORITY::LOW}</item>
			<item key="0">{EMAIL_PRIORITY::MEDIUM}</item>
			<item key="1">{EMAIL_PRIORITY::HIGH}</item>
		</fill>
	</obj></td>
</tr>
<tr>
	<td colspan="2" class="space">&nbsp;</td>
</tr>
<tr height="100%">
	<td colspan="2" class="msiebox" id="{anchor msiebox}"><div class="msiebox"><obj name="EVNNOTE" type="obj_wysiwyg" css="border2" tabindex="true"></obj></div></td>
</tr>
<tr>
	<td colspan="2" class="space">&nbsp;</td>
</tr>
<tr>
	<td colspan="2"><obj name="EVNTYPE" type="obj_categories" tabindex="true"></obj></td>
</tr>
</table>
