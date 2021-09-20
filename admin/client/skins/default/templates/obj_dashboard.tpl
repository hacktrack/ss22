<div class="dashboard-current_traffic">

	<div class="dashboard-current_traffic-stats">

		<div iw-flex-grid="query 3" class="stat-group">
		<div iw-flex-cell class="stat-item">
			<div iw-flex-grid="fit center">
			<div iw-flex-cell>
				<span class="stat-name">{DASHBOARD::SMTP_CONNECTIONS}</span>
			</div>
			<div iw-flex-cell="none half-padding">
				<span class="stat-value" id="{anchor traffic_smtp}">-</span>
			</div>
			</div>
		</div>
		<div iw-flex-cell class="stat-item">
			<div iw-flex-grid="fit center">
			<div iw-flex-cell>
				<span class="stat-name">{DASHBOARD::IMAPPOP3_CONNECTIONS}</span>
			</div>
			<div iw-flex-cell="none half-padding">
				<span class="stat-value" id="{anchor traffic_mail}">-</span>
			</div>
			</div>
		</div>
		<div iw-flex-cell class="stat-item">
			<div iw-flex-grid="fit center">
			<div iw-flex-cell>
				<span class="stat-name">{DASHBOARD::WEB_CONNECTIONS}</span>
			</div>
			<div iw-flex-cell="none half-padding">
				<span class="stat-value" id="{anchor traffic_web}">-</span>
			</div>
			</div>
		</div>
		</div>

	</div>

	<div class="dashboard-current_traffic-options">

		<div iw-flex-grid="query">
		<div iw-flex-cell="6">

			<div iw-flex-grid="query 3">

			<!-- Dashboard - Current Traffic - Graph - Action -->
			<div iw-flex-cell id="{anchor fi_action}" class="form-item">
				<div class="form-label">
					<label class="label">{DASHBOARD::SERVICE}</label>
				</div>
				<div class="form-row">
					<obj name="dropdown_action" type="obj_dropdown_single" tabindex="true"></obj>
				</div>
			</div>

			<!-- Dashboard - Current Traffic - Graph - Time period -->
			<div iw-flex-cell id="{anchor fi_time_period}" class="form-item">
				<div class="form-label">
					<label class="label">{DASHBOARD::TIME_PERIOD}</label>
				</div>
				<div class="form-row">
					<obj name="dropdown_time_period" type="obj_dropdown_single" tabindex="true"></obj>
				</div>
			</div>

			<!-- Dashboard - Current Traffic - Graph - Category -->
			<div iw-flex-cell id="{anchor fi_category}" class="form-item">
				<div class="form-label">
					<label class="label">{DASHBOARD::CATEGORY}</label>
				</div>
				<div class="form-row">
					<obj name="dropdown_category" type="obj_dropdown_single" tabindex="true"></obj>
				</div>
			</div>

			</div>

		</div>

		<!-- Dashboard - Current Traffic - Graph - Cancel -->
		<div iw-flex-cell="2" id="{anchor fi_cancel}" class="form-item">
			<div class="form-row margin u-justify-end">
				<obj name="button_cancel" type="obj_button" css="text secondary" tabindex="true">
					<value>dashboard::cancel</value>
				</obj>
			</div>
		</div>

		</div>

	</div>

	<div class="dashboard-current_traffic-graph js-dashboard-current_traffic-graph ct-chart"></div>

</div>

<div class="dashboard-services_statuses" id="{anchor groups}"></div>
