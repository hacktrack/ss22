<ul class="table-row _item-row{optional item::disabled} disabled{/optional}" hash="menu=accountdetail&amp;account={encodeURIComponent item::id}&amp;type={item::type}" tabindex="true">
	<li class="table__cell table-select-row">
		<obj name="checkbox" type="obj_checkbox" tabindex="true"></obj>
	</li>
	<li class="table__cell userlist-name no-wrap hide-for-medium-down">
		<div class="userhead circle icon-user_default hide-for-medium-down">
			<div class="userhead-image"{optional item::image} style="background-image: url('{item::image}')"{/optional}></div>
		</div>
		<span class="weight-600 ellipsis">{optional item::name}{htmlspecialchars item::name}{/optional}</span>
	</li>
	<li class="table__cell userlist-account hide-for-medium-down ellipsis">{htmlspecialchars item::id}</li>
	<li class="table__cell userlist-name_and_account hide-for-large-up">
		<div class="weight-600 ellipsis">{optional item::name}{htmlspecialchars item::name}{/optional}</div>
		<div class="ellipsis">{htmlspecialchars item::id}</div>
	</li>
	<li class="table__cell userlist-quota hide-for-small">
		<span>{optional item::isQuota}<strong>{item::quota}%</strong> {ACCOUNTDETAIL::OF} <br class="hide-for-large-up">
		{item::quotaSize}{/optional}{noptional item::isQuota}{optional item::size}<strong>{item::size}</strong>{/optional}{/noptional}</span>
	</li>
	<li class="table__cell userlist-filter no-wrap">
		<span class="icon-user type_{item::type}{optional item::hasSubtype} subtype_{item::subtype}{/optional}"></span>
		<span class="hide-for-medium-down">{noptional item::hasSubtype}{item::type_str}{/noptional}{optional item::hasSubtype}{item::subtype_str}{/optional}</span>
	</li>
</ul>
