<div iw-flex-grid="query 4" class="stat-group stat-group--cloud">
<div iw-flex-cell class="stat-item override">
	<div iw-flex-grid="fit center">
	<div iw-flex-cell="none">
		<span class="icon icon-plan"></span>
	</div>
	<div iw-flex-cell="half-padding" class="u-normal-line-height">
		<span class="stat-name">{DASHBOARD::PLAN} <a class="u-margin-left-half" id="{anchor topstats_manageplan}">[{DASHBOARD::MANAGE}]</a></span>
		<span class="stat-value"><a id="{anchor topstats_plan}">{package}</a></span>
	</div>
	<div iw-flex-cell="half-padding none">
		<obj name="topstats_plan_box" type="obj_button" css="text success small u-reset-margin" tabindex="true">
			<value>dashboard::upgrade</value>
		</obj>
	</div>
	</div>
</div>
<div iw-flex-cell class="stat-item override">
	<div iw-flex-grid="fit center">
	<div iw-flex-cell="none">
		<span class="icon icon-server"></span>
	</div>
	<div iw-flex-cell="half-padding" class="u-normal-line-height">
		<span class="stat-name">{DASHBOARD::CLUSTER_ID}</span>
		<span class="stat-value" id="{anchor topstats_cluster_id}" title="{cluster}">{cluster}</span>
	</div>
	</div>
</div>
<div iw-flex-cell class="stat-item override">
	<div iw-flex-grid="fit center">
	<div iw-flex-cell="none">
		<span class="icon icon-price-2"></span>
	</div>
	<div iw-flex-cell="half-padding" class="u-normal-line-height">
		<span class="stat-name">{DASHBOARD::PRICE_USER_MONTH}</span>
		<span class="stat-value" id="{anchor topstats_total_cost}"></span>
	</div>
	</div>
</div>
<div iw-flex-cell class="stat-item override">
	<div iw-flex-grid="fit center">
	<div iw-flex-cell="none">
		<span class="icon icon-resources"></span>
	</div>
	<div iw-flex-cell="half-padding" class="u-normal-line-height">
		<span class="stat-name">{DASHBOARD::NEXT_BILLING}</span>
		<span class="stat-value" id="{anchor topstats_next_billing}">{nextbilling}</span>
	</div>
	</div>
</div>
</div>
