{dynamic groups}
<div iw-flex-grid="query 4" class="stat-group {optional groups::*::modifier}stat-group--{groups::*::modifier}{/optional}">
	{dynamic groups::*::stats}
	<div iw-flex-cell="{optional groups::*::stats::*::span}{groups::*::stats::*::span}{/optional}" class="stat-item override {optional groups::*::stats::*::modifier}stat-item--{groups::*::stats::*::modifier}{/optional}">
		<div iw-flex-grid="fit center">
			<div iw-flex-cell="none">
				<span class="icon icon-{groups::*::stats::*::icon}"></span>
			</div>
			<div
				iw-flex-cell="{optional groups::*::stats::*::button} none {/optional} half-padding"
				class="stat-text {optional groups::*::stats::*::class}{groups::*::stats::*::class}{/optional}"
			>
				<span class="stat-name">{groups::*::stats::*::name}</span>
				<span class="stat-value" title="{groups::*::stats::*::value}">
					{groups::*::stats::*::value}
					{optional groups::*::stats::*::suffix}
					<span id="{_ins}#{groups::*::stats::*::suffix}"></span>
					{/optional}
				</span>
			</div>
			{optional groups::*::stats::*::count}
			<div iw-flex-cell="none">
				<span class="stat-value">{groups::*::stats::*::count}</span>
			</div>
			{/optional}
			{optional groups::*::stats::*::button}
			<div class="text-right" iw-flex-cell="fit">
				<obj name="{groups::*::stats::*::button::name}" type="obj_button" css="text primary u-reset-margin" tabindex="true">
					<value>{groups::*::stats::*::button::label}</value>
				</obj>
			</div>
			{/optional}

		</div>
	</div>
	{/dynamic}
</div>
{/dynamic}
