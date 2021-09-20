<div class="ico"></div>
<div class="label">{CONFERENCE::SCHEDULE}</div>

<div class="schedule-form">
	<div class="schedule-title">
		<obj name="title" type="obj_input" tabindex="true" focus="true" css="obj_input_100 noborder transparent input-conference">
			<placeholder>{DATAGRID_ITEMS_VIEW::EVNTITLE}</placeholder>
		</obj>
		<obj name="label" type="obj_label" tabindex="true" css="">
			<value>{CONFERENCE::SET_PASSWORD}</value>
		</obj>
	</div>
	<div class="schedule-password hidden" id="{anchor password}">
		<obj name="password" type="obj_input" tabindex="true" css="obj_input_100 noborder transparent input-conference">
			<placeholder>{CONFERENCE::SET_PASSWORD_PLACEHOLDER}</placeholder>
		</obj>
	</div>
	<div class="schedule-date">
		<div class="schedule-start">
			<obj name="startdate" type="obj_input_calendar" tabindex="true" css="big noborder"><init><item></item><item>true</item></init></obj>
			<obj name="starttime" type="obj_time" tabindex="true" css="big noborder input-conference"></obj>
		</div>
		<div class="schedule-end">
			<obj name="enddate" type="obj_input_calendar" tabindex="true" css="big noborder"><init><item></item><item>true</item></init></obj>
			<obj name="endtime" type="obj_time" tabindex="true" css="big noborder input-conference"></obj>
		</div>
	</div>
	<div class="schedule-attendees"><obj name="attendees" tabindex="true" type="obj_mail_suggest" css="big noborder "></obj></div>
	<div class="schedule-note"><obj name="note" type="obj_wysiwyg" css="big noborder"><placeholder>EVENT::ADD_NOTE</placeholder></obj></div>
</div>
<div class="schedule-more"><span id="{anchor link_more}">{DOCUMENT::SHOW_MORE_OPTIONS}</span></div>

<div class="buttons">
	<obj name="btn_save" type="obj_button" tabindex="true" css="big start simple rounded color3"><value>FORM_BUTTONS::SAVE</value></obj>
</div>
