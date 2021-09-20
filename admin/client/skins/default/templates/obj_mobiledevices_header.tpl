<ul class="table-row">
	<li class="table__cell table-select-all">
		<obj name="checkbox" type="obj_checkbox" tabindex="true"></obj>
	</li>
	<li class="table__cell mobiledevices-name">{ACCOUNTDETAIL::DEVICE}</li>
	<li class="table__cell mobiledevices-last_sync hide-for-small">
		<div iw-flex-grid="1">
		<div iw-flex-cell>
			<span class="table-dropdown-label hide-for-medium-down">{ACCOUNTDETAIL::LAST_SYNC}:</span>
		</div>
		<div iw-flex-cell>
			<obj name="dropdown_last_sync_filter" type="obj_dropdown_single" tabindex="true"></obj>
		</div>
	</li>
	<li class="table__cell mobiledevices-status">
		<div iw-flex-grid="1">
		<div iw-flex-cell>
			<span class="table-dropdown-label hide-for-medium-down">{ACCOUNTDETAIL::STATUS}:</span>
		</div>
		<div iw-flex-cell>
			<obj name="dropdown_active_filter" type="obj_dropdown_single" tabindex="true"></obj>
		</div>
	</li>
</ul>
