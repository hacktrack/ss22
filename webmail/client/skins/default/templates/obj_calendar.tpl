<div class="header">
	<obj name="left1" type="obj_button" css="ico img transparent prev simple" title="{CALENDAR::PREVIOUS_MONTH}"></obj>
	<obj name="right1" type="obj_button" css="ico img transparent next" title="{CALENDAR::NEXT_MONTH}"></obj>

	{optional week}
	<obj type="obj_select" name="week" css="week"></obj>
	{/optional}

	<obj type="obj_select" name="month" css="month">
		<fill>
			{dynamic month_names}
				<item key="{month_names::*::index}">{month_names::*::month}</item>
			{/dynamic}
		</fill>
	</obj>

	<obj type="obj_select_input" name="year" css="year">
		<restrictions>
			<item>&gt;1355i</item>
			<item>&lt;2200i</item>
		</restrictions>
	</obj>

	<obj name="close" type="obj_button" css="ico img transparent close right simple" title="{FORM_BUTTONS::CLOSE}"></obj>
	<obj name="empty" type="obj_button" css="ico img transparent empty right simple" title="{COMMON::CLEAR}"></obj>
	<obj name="today" type="obj_button" css="ico img transparent today right simple" title="{CALENDAR::TODAY}"></obj>
</div>

<div id="{anchor main}"></div>
