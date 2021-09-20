<ul class="table-row" hash="#menu=domaindetail&amp;domain={item::urlencoded}">
	<li class="table__cell domainlist-name weight-600">{htmlspecialchars item::unpunied}</li>
	<li class="table__cell domainlist-type">{item::type}</li>
	<li class="table__cell domainlist-users hide-for-small text-center">{item::users}</li>
	<li class="table__cell domainlist-description">
		<div iw-flex-grid="fit">
		<div iw-flex-cell="item-center" class="ellipsis">
			<span>{htmlspecialchars item::description}</span>
		</div>
		{optional item::deletable}
		<div iw-flex-cell="none no-padding" class="domainlist-delete">
			<obj name="button_erase" type="obj_button" css="icon icon-delete-circle" tabindex="true"></obj>
		</div>
		{/optional}
		</div>
	</li>
</ul>
