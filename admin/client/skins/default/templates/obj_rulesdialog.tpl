<div iw-flex-grid="query 2">

<!-- Rules dialog - Left Col -->
<div iw-flex-cell>

	<div iw-flex-grid>

	<!-- Rules dialog - Left Col - Conditions -->
	<div iw-flex-cell id="{anchor fi_conditions}" class="form-item">
		<div class="form-label">
			<label class="label">{RULES::CONDITIONS}</label>
		</div>
		<div>
			<obj name="tabs_conditions" type="obj_tabs"></obj>
		</div>
	</div>

	<!-- Rules dialog - Left Col - Actions -->
	<div iw-flex-cell id="{anchor fi_actions}" class="form-item">
		<div class="form-label">
			<label class="label">{RULES::ACTIONS}</label>
		</div>
		<div>
			<obj name="tabs_actions" type="obj_tabs"></obj>
		</div>
	</div>

	<!-- Rules dialog - Left Col - Title -->
	<div iw-flex-cell id="{anchor fi_title}" class="form-item">
		<div class="form-label">
			<label class="label">{RULES::TITLE}</label>
		</div>
		<div class="form-row">
			<obj name="input_title" type="obj_input_text" tabindex="true">
				<placeholder>rules::title</placeholder>
			</obj>
		</div>
	</div>

	</div>

</div>

<!-- Rules dialog - Right Col -->
<div iw-flex-cell class="u-flexit">

	<!-- Rules dialog - Left Col - Result -->
	<label class="form-label label u-flex-none">{RULES::RESULT}</label>
	<div class="rules_result well">
		<div class="rules_result-content" id="{anchor rules_result_conditions}"></div>
		<div class="rules_result-separator"></div>
		<div class="rules_result-content" id="{anchor rules_result_actions}"></div>
		<div class="rules_result-text" is-hidden="1">
			<p class="rules_result-title">{RULES::RESULT_TITLE}</p>
			<p class="rules_result-step">{RULES::RESULT_STEP_1}</p>
			<p class="rules_result-step">{RULES::RESULT_STEP_2}</p>
			<p class="rules_result-step">{RULES::RESULT_STEP_3}</p>
		</div>
	</div>

</div>

</div>
