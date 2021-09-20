<ul class="table-row _item-row" hash="menu=accountdetail&amp;account={encodeURIComponent item::id}&amp;type={item::type}" tabindex="true">
	<li class="table__cell table-select-row">
		<obj name="checkbox" type="obj_checkbox" tabindex="true"></obj>
	</li>
	<li class="table__cell userlist-name no-wrap">
		<div class="userhead circle icon-user_default">
			<div class="userhead-image"{optional item::image} style="background-image: url('{item::image}')"{/optional}></div>
		</div>
		<span class="weight-600 ellipsis">{optional item::name}{htmlspecialchars item::name}{/optional}</span>
	</li>
	<li class="table__cell userlist-account ellipsis">{htmlspecialchars item::unpunied}</li>
</ul>
