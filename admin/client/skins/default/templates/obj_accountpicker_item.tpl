<ul class="table-row _item-row" hash="menu=accountdetail&amp;account={encodeURIComponent item::email}" tabindex="true">
	<li class="table__cell table-select-row">
		<obj name="checkbox" type="obj_checkbox" tabindex="true"></obj>
	</li>
	<li class="table__cell accountpicker-name_and_account">
		<div class="weight-600 ellipsis">{optional item::name}{item::name}{/optional}</div>
		<div class="ellipsis">{item::email}</div>
	</li>
	<li class="table__cell accountpicker-filter no-wrap">
		<span class="icon-user type_{item::type}{optional item::hasSubtype} subtype_{item::subtype}{/optional}"></span>
		<span class="hide-for-small">{noptional item::hasSubtype}{item::type_str}{/noptional}{optional item::hasSubtype}{item::subtype_str}{/optional}</span>
	</li>
</ul>
