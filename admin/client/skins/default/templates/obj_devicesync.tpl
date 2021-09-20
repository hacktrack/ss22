<div iw-flex-grid="query 2 double-padding">

<!-- Device detail - Synchronization - Left Col -->
<div iw-flex-cell>

	<!-- Device detail - Synchronization - Groupware -->
	<div class="form-section" id="{anchor fs_groupware_synchronization}">
		<h3 class="box-content-title gamma">{DEVICEDETAIL::GROUPWARE_SYNCHRONIZATION}</h3>
		<p class="box-content-desc">{DEVICEDETAIL_HELP::GROUPWARE_SYNCHRONIZATION}</p>

		<div class="form-block" id="{anchor fb_groupware_synchronization}">
			<div iw-flex-grid>

			<!-- Device detail - Synchronization - Groupware - Past mail items -->
			<div iw-flex-cell id="{anchor fi_past_mail_items}" class="form-item query">
				<div iw-flex-grid="query center 2">
				<div iw-flex-cell>
					<div class="form-label">
						<obj name="toggle_past_mail_items" type="obj_toggle" tabindex="true">
							<enabled>past_mail_items</enabled>
							<label>devicedetail::past_mail_items</label>
						</obj>
					</div>
				</div>
				<div iw-flex-cell>
					<div class="form-row" id="{anchor past_mail_items}">
						<obj name="dropdown_past_mail_items" type="obj_dropdown_single" tabindex="true">
							<disabled>1</disabled>
						</obj>
					</div>
				</div>
				</div>
			</div>

			<!-- Device detail - Synchronization - Groupware - Past calendar events -->
			<div iw-flex-cell id="{anchor fi_past_calendar_events}" class="form-item query">
				<div iw-flex-grid="query center 2">
				<div iw-flex-cell>
					<div class="form-label">
						<obj name="toggle_past_calendar_events" type="obj_toggle" tabindex="true">
							<enabled>past_calendar_events</enabled>
							<label>devicedetail::past_calendar_events</label>
						</obj>
					</div>
				</div>
				<div iw-flex-cell>
					<div class="form-row" id="{anchor past_calendar_events}">
						<obj name="dropdown_past_calendar_events" type="obj_dropdown_single" tabindex="true">
							<disabled>1</disabled>
						</obj>
					</div>
				</div>
				</div>
			</div>

			<!-- Device detail - Synchronization - Groupware - Sync tasks as calendar events -->
			<div iw-flex-cell id="{anchor fi_sync_tasks_as_calendar_events}" class="form-item query">
				<div iw-flex-grid="query center 2">
				<div iw-flex-cell>
					<div class="form-label">
						<obj name="toggle_sync_tasks_as_calendar_events" type="obj_toggle" tabindex="true">
							<enabled>sync_tasks_as_calendar_events</enabled>
							<label>devicedetail::sync_tasks_as_calendar_events</label>
						</obj>
					</div>
				</div>
				<div iw-flex-cell>
					<div class="form-row" id="{anchor sync_tasks_as_calendar_events}">
						<obj name="dropdown_sync_tasks_as_calendar_events" type="obj_dropdown_single" tabindex="true">
							<disabled>1</disabled>
						</obj>
					</div>
				</div>
				</div>
			</div>

			<!-- Device detail - Synchronization - Groupware - Synchronization type -->
			<div iw-flex-cell id="{anchor fi_tasks_synchronization_type}" class="form-item query">
				<div iw-flex-grid="query center 2">
				<div iw-flex-cell>
					<div class="form-label">
						<label class="label">{DEVICEDETAIL::TASKS_SYNCHRONIZATION_TYPE}</label>
					</div>
				</div>
				<div iw-flex-cell>
					<div class="form-row" id="{anchor tasks_synchronization_type}">
						<obj name="dropdown_tasks_synchronization_type" type="obj_dropdown_single" tabindex="true">
							<disabled>1</disabled>
						</obj>
					</div>
				</div>
				</div>
			</div>

			<!-- Device detail - Synchronization - Groupware - Sync notes as -->
			<div iw-flex-cell id="{anchor fi_sync_notes_as}" class="form-item query">
				<div iw-flex-grid="query center 2">
				<div iw-flex-cell>
					<div class="form-label">
						<obj name="toggle_sync_notes_as" type="obj_toggle" tabindex="true">
							<enabled>sync_notes_as</enabled>
							<label>devicedetail::sync_notes_as</label>
						</obj>
					</div>
				</div>
				<div iw-flex-cell>
					<div class="form-row" id="{anchor sync_notes_as}">
						<obj name="dropdown_sync_notes_as" type="obj_dropdown_single" tabindex="true">
							<disabled>1</disabled>
						</obj>
					</div>
				</div>
				</div>
			</div>

			<!-- Device detail - Synchronization - Groupware - Notes synchronization type -->
			<div iw-flex-cell id="{anchor fi_notes_synchronization_type}" class="form-item query">
				<div iw-flex-grid="query center 2">
				<div iw-flex-cell>
					<div class="form-label">
						<label class="label">{DEVICEDETAIL::NOTES_SYNCHRONIZATION_TYPE}</label>
					</div>
				</div>
				<div iw-flex-cell>
					<div class="form-row" id="{anchor notes_synchronization_type}">
						<obj name="dropdown_notes_synchronization_type" type="obj_dropdown_single" tabindex="true">
							<disabled>1</disabled>
						</obj>
					</div>
				</div>
				</div>
			</div>

			</div>
		</div>
	</div>

</div>

<!-- Device detail - Synchronization - Right Col -->
<div iw-flex-cell>

	<!-- Device detail - Synchronization - Private special folders -->
	<div class="form-section" id="{anchor fs_private_special_folders}">
		<h3 class="box-content-title gamma">{DEVICEDETAIL::PRIVATE_SPECIAL_FOLDERS}</h3>
		<p class="box-content-desc">{DEVICEDETAIL_HELP::PRIVATE_SPECIAL_FOLDERS}</p>

		<div class="form-block" id="{anchor fb_private_special_folders}">

			<div iw-flex-grid>

			<!-- Device detail - Synchronization - Private special folders - GroupWare folders -->
			<div iw-flex-cell id="{anchor fi_groupware_folders}" class="form-item">
				<div class="form-label">
					<label class="label">{DEVICEDETAIL::GROUPWARE_FOLDERS}</label>
				</div>
				<div class="form-row">
					<obj name="dropdown_groupware_folders" type="obj_dropdown_single" tabindex="true"></obj>
				</div>
			</div>

			<!-- Device detail - Synchronization - Private special folders - Mail folders -->
			<div iw-flex-cell id="{anchor fi_mail_folders}" class="form-item">
				<div class="form-label">
					<label class="label">{DEVICEDETAIL::MAIL_FOLDERS}</label>
				</div>
				<div class="form-row">
					<obj name="dropdown_mail_folders" type="obj_dropdown_single" tabindex="true"></obj>
				</div>
			</div>

			<!-- Device detail - Synchronization - Private special folders - Shared folders -->
			<div iw-flex-cell id="{anchor fi_shared_folders}" class="form-item">
				<div class="form-label">
					<obj name="toggle_shared_folders" type="obj_toggle" tabindex="true">
						<label>devicedetail::shared_folders</label>
					</obj>
				</div>
			</div>

			<!-- Device detail - Synchronization - Private special folders - Archive -->
			<div iw-flex-cell id="{anchor fi_archive}" class="form-item">
				<div class="form-label">
					<obj name="toggle_archive" type="obj_toggle" tabindex="true">
						<label>devicedetail::archive</label>
					</obj>
				</div>
			</div>

			<!-- Device detail - Synchronization - Private special folders - Public folders -->
			<div iw-flex-cell id="{anchor fi_public_folders}" class="form-item">
				<div class="form-label">
					<obj name="toggle_public_folders" type="obj_toggle" tabindex="true">
						<label>devicedetail::public_folders</label>
					</obj>
				</div>
			</div>

		</div>
	</div>

</div>

</div>
