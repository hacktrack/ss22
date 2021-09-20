<ul class="table-row _item-row" tabindex="true">
	<li class="table__cell table-select-row">
		<obj name="checkbox" type="obj_checkbox" tabindex="true"></obj>
	</li>
	<li class="table__cell rules-title no-wrap" id="{anchor rule_}{item::id}">
		<span class="icon-ruletype ruletype_{item::action_type} u-margin-right"></span>
		<span>{htmlspecialchars item::title}</span>
	</li>
	<li class="table__cell rules-up">
		<obj name="btn_move_up" type="obj_button" css="icon icon-arrow-up" tabindex="true"></obj>
	</li>
	<li class="table__cell rules-down">
		<obj name="btn_move_down" type="obj_button" css="icon icon-arrow-down" tabindex="true"></obj>
	</li>
</ul>
