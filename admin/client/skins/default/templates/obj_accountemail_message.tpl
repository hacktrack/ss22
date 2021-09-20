<!-- Autorespond message -->
<div iw-flex-grid>

<!-- Autorespond message - From -->
<div iw-flex-cell id="{anchor fi_from}" class="form-item">
	<div class="form-label">
		<label class="label">{GENERIC::FROM}</label>
	</div>
	<div class="form-row">
		<div iw-flex-grid="fit group">
		<div iw-flex-cell>
			<obj name="input_from" type="obj_input_email" css="group-left" tabindex="true">
				<placeholder>generic::from</placeholder>
			</obj>
		</div>
		<div iw-flex-cell="none">
			<obj name="button_from" type="obj_button" css="icon icon-add small group-right inner-button" tabindex="true"></obj>
		</div>
		</div>
	</div>
</div>

<!-- Autorespond message - Subject -->
<div iw-flex-cell id="{anchor fi_subject}" class="form-item">
	<div class="form-label">
		<label class="label">{GENERIC::SUBJECT}</label>
	</div>
	<div class="form-row">
		<obj name="input_subject" type="obj_input_text" tabindex="true">
			<placeholder>generic::subject</placeholder>
		</obj>
	</div>
</div>

<!-- Autorespond message - Text -->
<div iw-flex-cell id="{anchor fi_text}" class="form-item">
	<div class="form-label">
		<label class="label">{GENERIC::TEXT}</label>
	</div>
	<div class="form-row large">
		<obj name="textarea_mesage_setup_text" type="obj_textarea" tabindex="true">
			<placeholder>generic::text</placeholder>
		</obj>
	</div>
</div>

</div>
