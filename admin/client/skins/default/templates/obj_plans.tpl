{dynamic plans}
<div class="plans__item{optional plans::*::modifier} plans__item--{plans::*::modifier}{/optional}{optional plans::*::disabled} disabled{/optional}">
	{optional selectable}
	<div>
		<obj group="{prefix}" name="radio" type="obj_radio" tabindex="true" value="{plans::*::id}"></obj>
	</div>
	{/optional}
	{optional plans::*::icon}
	<span class="plans__icon"></span>
	{/optional}
	<div class="plans__label-wrap">
		{optional plans::*::label}<span class="plans__label">{plans::*::label}</span>{/optional}
		<span class="plans__users" {noptional plans::*::users}is-hidden{/noptional}>
			<span class="icon icon-user-ico"></span>
			<span class="u-inline">{plans::*::users}</span>
		</span>
	</div>
	<div class="plans__price-wrap" {noptional show_prices}is-hidden{/noptional}>
		<span class="plans__price">{plans::*::price}</span>
		{optional plans::*::price_per_user}
		<span class="plans__description">{optional yearly}{SUBSCRIPTION_PLANS::USER_PER_YEAR}{/optional}{noptional yearly}{SUBSCRIPTION_PLANS::USER_PER_MONTH}{/noptional}<span class="plans__colon">:</span>
			<span class="plans__price">{plans::*::price_per_user}</span>
		</span>
		{/optional}
	</div>
</div>
{/dynamic}
