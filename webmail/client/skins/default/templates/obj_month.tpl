<div class="header">
	<obj name="left1" type="obj_button" css="ico img transparent prev simple" title="{CALENDAR::PREVIOUS_MONTH}"></obj>
	<obj name="right1" type="obj_button" css="ico img transparent next" title="{CALENDAR::NEXT_MONTH}"></obj>

	<obj type="obj_select_input" name="year" css="year">
		<restrictions>
			<item>&gt;1355i</item>
			<item>&lt;2200i</item>
		</restrictions>
	</obj>

	<obj name="close" type="obj_button" css="ico img transparent close right simple" title="{FORM_BUTTONS::CLOSE}"></obj>
</div>

<div class="main"><div id="{anchor main}" class="block"></div></div>