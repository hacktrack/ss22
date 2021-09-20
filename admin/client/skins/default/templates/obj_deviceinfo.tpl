<div class="panel" iw-type="full" id="{anchor fi_activate_block}" class="form-item" is-hidden>
	<div iw-flex-grid="query fit">
	<div iw-flex-cell>
		<div iw-flex-grid="fit item-center">
		<div iw-flex-cell="none">
			<i class="panel-icon icon-info"></i>
		</div>
		<div iw-flex-cell="half-padding item-center">
			<span class="panel-title">{DEVICEDETAIL::DEVICE_IN_QUARANTINE}</span>
		</div>
		</div>
	</div>
	<div iw-flex-cell="none text-end">
		<div class="button-group">
			<obj name="button_activate_device" type="obj_button" css="text success" tabindex="true">
				<value>devicedetail::allow_device</value>
			</obj>
			<obj name="button_block_device" type="obj_button" css="text error" tabindex="true">
				<value>devicedetail::block_device</value>
			</obj>
		</div>
	</div>
	</div>
</div>

<div iw-flex-grid="query 2 double-padding">

<!-- Device detail - Info - Left Col -->
<div iw-flex-cell>

	<!-- Device detail - Info - Device info -->
	<div class="form-section" id="{anchor fs_device_info}">
		<h3 class="box-content-title gamma">{DEVICEDETAIL::DEVICE_INFO}</h3>
		<p class="box-content-desc">{DEVICEDETAIL_HELP::DEVICE_INFO}</p>

		<div class="form-block">

			<div iw-flex-grid="2">

			<!-- Device detail - Info - Device info - Account -->
			<div iw-flex-cell id="{anchor fi_account}" class="form-item">
				<div class="form-label">
					<label class="label">{DEVICEDETAIL::ACCOUNT}</label>
				</div>
				<div class="form-row">
					<span class="weight-600" id="{anchor account}"></span>
				</div>
			</div>

			<!-- Device detail - Info - Device info - Status -->
			<div iw-flex-cell id="{anchor fi_status}" class="form-item">
				<div class="form-row margin">
					<obj name="toggle_status" type="obj_toggle" tabindex="true">
						<disabled>1</disabled>
						<label>devicedetail::allow_block_device</label>
					</obj>
				</div>
			</div>

			<!-- Device detail - Info - Device info - Device name -->
			<div iw-flex-cell id="{anchor fi_device_name}" class="form-item">
				<div class="form-label">
					<label class="label">{DEVICEDETAIL::DEVICE_NAME}</label>
				</div>
				<div class="form-row">
					<obj name="input_device_name" type="obj_input_text" tabindex="true">
						<placeholder>devicedetail::device_name</placeholder>
					</obj>
				</div>
			</div>

			<!-- Device detail - Info - Device info - OS -->
			<div iw-flex-cell id="{anchor fi_os}" class="form-item">
				<div class="form-label">
					<label class="label">{DEVICEDETAIL::OS}</label>
				</div>
				<div class="form-row">
					<span class="weight-600" id="{anchor os}"></span>
				</div>
			</div>

			<!-- Device detail - Info - Device info - Type -->
			<div iw-flex-cell id="{anchor fi_type}" class="form-item">
				<div class="form-label">
					<label class="label">{DEVICEDETAIL::TYPE}</label>
				</div>
				<div class="form-row">
					<span class="weight-600" id="{anchor type}"></span>
				</div>
			</div>

			<!-- Device detail - Info - Device info - Model -->
			<div iw-flex-cell id="{anchor fi_model}" class="form-item">
				<div class="form-label">
					<label class="label">{DEVICEDETAIL::MODEL}</label>
				</div>
				<div class="form-row">
					<span class="weight-600" id="{anchor model}"></span>
				</div>
			</div>

			<!-- Device detail - Info - Device info - Registered -->
			<div iw-flex-cell id="{anchor fi_registered}" class="form-item">
				<div class="form-label">
					<label class="label">{DEVICEDETAIL::REGISTERED}</label>
				</div>
				<div class="form-row">
					<span class="weight-600" id="{anchor registered}"></span>
				</div>
			</div>

			<!-- Device detail - Info - Device info - Last sync -->
			<div iw-flex-cell id="{anchor fi_last_sync}" class="form-item">
				<div class="form-label">
					<label class="label">{DEVICEDETAIL::LAST_SYNC}</label>
				</div>
				<div class="form-row">
					<span class="weight-600" id="{anchor last_sync}"></span>
				</div>
			</div>
			</div>

		</div>
	</div>

</div>
<!-- Device detail - Info - Right Col -->
<div iw-flex-cell>

	<!-- Device detail - Info - Soft & Hard wipe -->
	<div class="form-section" id="{anchor fs_soft_and_hard_wipe}">
		<h3 class="box-content-title gamma">{DEVICEDETAIL::SOFT_HARD_WIPE}</h3>
		<p class="box-content-desc">{DEVICEDETAIL_HELP::SOFT_HARD_WIPE}</p>

		<div class="form-block">

			<div iw-flex-grid="query 2">

			<!-- Device detail - Info - Soft & Hard wipe - Soft wipe -->
			<div iw-flex-cell id="{anchor fi_soft_wipe}" class="form-item">
				<div class="form-row margin">
					<obj name="button_soft_wipe" type="obj_button" css="text primary full" tabindex="true">
						<value>devicedetail::soft_wipe</value>
					</obj>
				</div>
			</div>

			<!-- Device detail - Info - Soft & Hard wipe - Hard wipe -->
			<div iw-flex-cell id="{anchor fi_hard_wipe}" class="form-item">
				<div class="form-row margin">
					<obj name="button_hard_wipe" type="obj_button" css="text primary full" tabindex="true">
						<value>devicedetail::hard_wipe</value>
					</obj>
				</div>
			</div>
			</div>

		</div>
	</div>

</div>
</div>
