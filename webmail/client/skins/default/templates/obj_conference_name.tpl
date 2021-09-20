<div class="ico"></div>
<div class="label">{CONFERENCE::TITLE}</div>

<div class="input title">
	<obj name="name" type="obj_input" tabindex="true" focus="true" css="obj_input_100 noborder transparent input-conference">
		<placeholder>{CONFERENCE::TYPE_NAME}</placeholder>
	</obj>
	<obj name="label" type="obj_label" tabindex="true" css="">
		<value>{CONFERENCE::SET_PASSWORD}</value>
	</obj>
</div>
<div class="input password hidden" id="{anchor password}">
	<obj name="password" type="obj_input" tabindex="true" css="obj_input_100 noborder transparent input-conference">
		<placeholder>{CONFERENCE::SET_PASSWORD_PLACEHOLDER}</placeholder>
	</obj>
</div>

<div class="buttons">
	<obj name="btn_continue" type="obj_button" tabindex="true" css="big continue simple rounded color3">
		<value>CONFERENCE::START</value>
		<disabled>1</disabled>
	</obj>
</div>
