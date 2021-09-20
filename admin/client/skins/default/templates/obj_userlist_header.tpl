<ul class="table-row">
	<li class="table__cell table-select-all">
		<obj name="checkbox" type="obj_checkbox" tabindex="true"></obj>
	</li>
	<li class="table__cell userlist-name hide-for-medium-down">{USERLIST_HEADER::NAME}</li>
	<li class="table__cell userlist-account hide-for-medium-down">{USERLIST_HEADER::ACCOUNT}</li>
	<li class="table__cell userlist-name_and_account hide-for-large-up">{USERLIST_HEADER::NAME_AND_ACCOUNT}</li>
	<li class="table__cell userlist-quota hide-for-small">{USERLIST_HEADER::QUOTA}</li>
	<li class="table__cell userlist-filter">
		<div iw-flex-grid="fit center">
		<div iw-flex-cell="none">
			<span class="table-dropdown-label hide-for-medium-down">{USERLIST_HEADER::TYPE}:</span>
		</div>
		<div iw-flex-cell="no-padding">
			<obj name="dropdown_userlist_filter" type="obj_dropdown_single" tabindex="true"></obj>
		</div>
	</li>
</ul>
