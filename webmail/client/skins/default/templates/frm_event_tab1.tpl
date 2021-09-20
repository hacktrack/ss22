<table class="frmtbl frmtbl100" height="100%">
<tr>
	<th class="th">{EVENT::TITLE}</th>
	<td class="td" colspan="4"><obj name="EVNTITLE" type="obj_input" tabindex="true" focus="true" css="obj_input_100"></obj></td>
</tr>
<tr>
	<th class="th">{EVENT::LOCATION}</th>
	<td colspan="2"><obj name="EVNLOCATION" type="obj_select_input" tabindex="true"></obj><obj name="X_LOCMAP" type="obj_button_map_loc" css="img noborder transparent simple"></obj></td>
	<th class="th show-as" rowspan="2">{EVENT::SHOW_AS}</th>
	<td class="td"><obj name="X_EVNFLAGS" type="obj_select" tabindex="true" css="max">
			<fill>
				<item key="F">{EVENT::FREE}</item>
				<item key="T">{EVENT::TENTATIVE}</item>
				<item key="S">{EVENT::BUSY}</item>
				<item key="O">{EVENT::OUT_OF_OFFICE}</item>
			</fill>
	</obj></td>
</tr>

{optional path}
<tr>
	<th class="th">{FOLDERS::EVENTS}</th>
	<td colspan="2"><obj name='X_PATH' type='obj_selectfolder'><init><item>1</item><item>E</item><item>i</item></init></obj></td>
	{optional conference}
	<td colspan="2"><obj name="MEETING_ACTION" type="obj_checkbox" tabindex="true" css="conference_action nopadding"><disabled>1</disabled><title>EVENT::ONLINECONFERENCE</title></obj></td>
	{/optional}
</tr>
{/optional}

{noptional path}
{optional conference}
<tr>
	<th class="th" colspan="3"></th>
	<td colspan="2"><obj name="MEETING_ACTION" type="obj_checkbox" tabindex="true" css="conference_action nopadding"><disabled>1</disabled><title>EVENT::ONLINECONFERENCE</title></obj></td>
</tr>
{/optional}
{/noptional}

<tr>
	<td colspan="5" class="space">&nbsp;</td>
</tr>

<tr>
	<th class="th" nowrap="nowrap">{TIME_INTERVAL::FROM}</th>
	<td><obj name="startDate" type="obj_input_calendar"><init><item></item><item>1</item></init></obj></td>
	<td><obj name="startTime" type="obj_time"><value>0</value></obj></td>
	<td class="td" colspan="2"><obj name='timezone' type='obj_timezones' css='max'></obj></td>
</tr>
<tr>
	<th class="th" nowrap="nowrap">{TIME_INTERVAL::TO}</th>
	<td><obj name="endDate" type="obj_input_calendar"><init><item></item><item>1</item></init></obj></td>
	<td><obj name="endTime" type="obj_time"><value>0</value></obj></td>
	<td colspan="2"><obj name='tzlink' type='obj_label' css='tzlink'></obj></td>
</tr>
<tr>
	<th class="th" nowrap="nowrap">{TIME_INTERVAL::DURATION}</th>
	<td>
		<table>
		<tr>
			<td><obj name="durationDays" type="obj_input" css="obj_input_small"><value>0</value></obj></td>
			<td class="pad5">{TIME_INTERVAL::DAYS}</td>
		</tr>
		</table>
	</td>
	<td><obj name="durationTime" type="obj_time"><value>0</value><init>1</init></obj></td>
	<td colspan="2"><obj name='allDay' type='obj_checkbox'><title>TIME_INTERVAL::ALL_DAY_EVENT</title></obj></td>
</tr>

<tr>
	<td colspan="5" class="space">&nbsp;</td>
</tr>
<tr>
	<td colspan="5"><obj name="X_REMINDERS" type="obj_reminder" tabindex="true"><init>EVENT_SETTINGS</init></obj></td>
</tr>
<tr>
	<td colspan="5" class="space">&nbsp;</td>
</tr>
<tr height="100%">
	<td colspan="5" class="msiebox" id="{anchor msiebox}"><div class="msiebox"><obj name="EVNNOTE" type="obj_wysiwyg" css="border2" tabindex="true"></obj></div></td>
</tr>
<tr>
	<td colspan="5" class="space">&nbsp;</td>
</tr>
<tr>
	<td colspan="5"><obj name="EVNTYPE" type="obj_categories" tabindex="true"></obj></td>
</tr>
</table>
