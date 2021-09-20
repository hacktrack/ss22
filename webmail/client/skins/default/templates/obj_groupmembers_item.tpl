<div class="member{optional item::admin} admin{/optional}{optional item::guest} guest{noptional item::confirmed} unconfirmed{/noptional}{/optional}" title="{item::fullname}">
	<div class="avatar unselectable{optional item::im} {item::im}{/optional}"><span style="background-image: url('{item::avatar}')"></span></div>
	<div class="name"><div>{htmlspecialchars item::name}</div></div>
	{noptional item::guest_user}
	<div class="control">
		<span class="mailto"></span>
		{optional has_kick_right}
		<span class="remove"></span>
		{/optional}
		{noptional item::guest}
			{optional item::hasim}
			<span class="im"></span>
			{/optional}
		{/noptional}
	</div>
	{/noptional}
</div>