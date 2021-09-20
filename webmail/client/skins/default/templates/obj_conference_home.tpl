<div class="ico"></div>
<div class="label">{CONFERENCE::TITLE}</div>
<div class="buttons">
	<obj name="btn_start" type="obj_button" css="big start bold rounded color3"><value>CONFERENCE::MEET_NOW</value></obj>
	{optional schedule}
	<obj name="label" type="obj_label"><value>{COMMON::OR}</value></obj>
	<obj name="btn_schedule" type="obj_button" css="big simple rounded color1"><value>CONFERENCE::SCHEDULE</value></obj>
	{/optional}
</div>
