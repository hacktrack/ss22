<div class="form-block">

	<!-- Account detail - Licences - Enable client licence -->
	<div iw-flex-grid>
	{include inc_form}
		{	"name": "enable_client_licence",
			"label_toggle": "accountdetail::enable_client_licence"
		}
	{/include}
	</div>

	<div iw-flex-grid="query 2">
	<!-- Account detail - Licences - Description -->
	<div iw-flex-cell id="{anchor fi_licence_decription}" class="form-item">
		<div class="form-label">
			<label class="label">{ACCOUNTDETAIL::DESCRIPTION}</label>
		</div>
		<div class="form-row">
			<obj name="input_licence_description" type="obj_input_text" tabindex="true"><placeholder>accountdetail::description</placeholder></obj>
		</div>
		<p class="form-desc">{ACCOUNTDETAIL_HELP::LICENCE_DESCRIPTION}</p>
	</div>

	<!-- Account detail - Licences - Allowed activation count -->
	<div iw-flex-cell id="{anchor fi_licence_allowed_activation_count}" class="form-item">
		<div class="form-label">
			<label class="label">{ACCOUNTDETAIL::ALLOWED_ACTIVATION_COUNT}</label>
		</div>
		<div class="form-row">
			<obj name="input_licence_allowed_activation_count" type="obj_input_number" tabindex="true"><placeholder>accountdetail::allowed_activation_count</placeholder></obj>
		</div>
	</div>
	</div>

	<!-- Account detail - Licences - Activation key -->
	<div iw-flex-grid>
	<div iw-flex-cell>
		<div class="form-label">
			<label class="label">{ACCOUNTDETAIL::ACTIVATION_KEY}</label>
		</div>
		<div class="form-row large">
			<obj name="license" type="obj_textarea" tabindex="true" css="textarea"><placeholder>accountdetail::activation_key</placeholder><readonly>1</readonly></obj>
		</div>
		<p class="form-desc">{ACCOUNTDETAIL_HELP::ACTIVATION_KEY}</p>
		<div class="form-row large">
			<div class="button-group">
				<obj name="button_licence_generate_key" type="obj_button" css="text primary" tabindex="true"><value>accountdetail::generate_key</value></obj>
				<obj name="button_licence_send_key" type="obj_button" css="text primary" tabindex="true"><value>accountdetail::send_key_to_user_by_email</value></obj>
			</div>
		</div>
	</div>
	</div>

</div>
