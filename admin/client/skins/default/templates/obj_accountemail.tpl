<div iw-flex-grid="query 2 double-padding">
<div iw-flex-cell>

	<!-- Account detail - Email - Forwarder -->
        <div class="form-section" id="{anchor fs_forwarder}">
	<h3 class="box-content-title gamma">{ACCOUNTDETAIL::FORWARDER}</h3>
	<p class="box-content-desc">{ACCOUNTDETAIL_HELP::FORWARDER}</p>

	<div class="form-block" id="{anchor fb_forwarder}">

		<div iw-flex-grid="query 2">

		<!-- Account detail - Email - Forwarder - Forward to -->
		<div iw-flex-cell id="{anchor fi_email_forward}" class="form-item">
			<div class="form-label">
				<label class="label">{ACCOUNTDETAIL::FORWARD_TO}</label>
			</div>
			<div class="form-row">
				<obj name="input_email_forward" type="obj_input_text" tabindex="true"><placeholder>accountdetail::email</placeholder></obj>
			</div>

			<!-- Account detail - Email - Forwarder - Do not forward -->
			<div class="form-row" id="{anchor fi_email_do_not_forward}">
				<obj name="toggle_email_do_not_forward" type="obj_toggle" tabindex="true">
					<enabled>label_email_do_not_forward</enabled>
					<label>accountdetail::do_not_forward</label>
				</obj>
			</div>
		</div>

		<!-- Account detail - Email - Forwarder - Alternate email -->
		<div iw-flex-cell id="{anchor fi_email_alternate}" class="form-item">
			<div class="form-label">
				<label class="label">{ACCOUNTDETAIL::ALTERNATE_EMAIL}</label>
			</div>
			<div class="form-row">
				<obj name="input_email_alternate" type="obj_input_text" tabindex="true"><placeholder>accountdetail::email</placeholder></obj>
			</div>
		</div>

		<!-- Account detail - Email - Forwarder - Copy incoming mail -->
		<div iw-flex-cell id="{anchor fi_email_incoming}" class="form-item">
			<div class="form-label">
				<label class="label">{ACCOUNTDETAIL::COPY_INCOMING_MAIL}</label>
			</div>
			<div class="form-row">
				<obj name="input_email_incoming" type="obj_input_text" tabindex="true"><placeholder>accountdetail::email</placeholder></obj>
			</div>
		</div>

		<!-- Account detail - Email - Forwarder - Copy outgoing mail -->
		<div iw-flex-cell id="{anchor fi_email_outgoing}" class="form-item">
			<div class="form-label">
				<label class="label">{ACCOUNTDETAIL::COPY_OUTGOING_MAIL}</label>
			</div>
			<div class="form-row">
				<obj name="input_email_outgoing" type="obj_input_text" tabindex="true"><placeholder>accountdetail::email</placeholder></obj>
			</div>
		</div>

		</div>

	</div>
        </div>
</div>
<div iw-flex-cell>

	<!-- Account detail - Email - Responder -->
        <div class="form-section" id="{anchor fs_responder}">
	<h3 class="box-content-title gamma">{ACCOUNTDETAIL::RESPONDER}</h3>
	<p class="box-content-desc">{ACCOUNTDETAIL_HELP::RESPONDER}</p>

	<div class="form-block" id="{anchor fb_responder}">

		<div iw-flex-grid="query 2">

		<!-- Account detail - Email - Responder - Mode -->
		<div iw-flex-cell id="{anchor fi_email_mode}" class="form-item">
			<div class="form-label">
				<label class="label">{ACCOUNTDETAIL::MODE}</label>
			</div>
			<div class="form-row">
				<obj name="dropdown_email_mode" type="obj_dropdown_single" tabindex="true"></obj>
			</div>
		</div>

		<!-- Account detail - Email - Responder - Respond again after -->
		<div iw-flex-cell id="{anchor fi_email_again}" class="form-item">
			<div class="form-label">
				<label class="label">{ACCOUNTDETAIL::RESPOND_AGAIN_AFTER}</label>
			</div>
			<div class="form-row">
				<obj name="input_email_again" type="obj_input_number" tabindex="true"><placeholder>accountdetail::days</placeholder></obj>
			</div>
		</div>

		<!-- Account detail - Email - Responder - Respond only if between -->
		<div iw-flex-cell id="{anchor fi_email_from}" class="form-item">
			<div class="form-label">
				<label class="label">{ACCOUNTDETAIL::RESPOND_ONLY_IF_BETWEEN}</label>
			</div>
			<div class="form-row">
				<obj name="input_email_from" type="obj_input_date" tabindex="true"></obj>
			</div>
		</div>

		<div iw-flex-cell id="{anchor fi_email_to}" class="form-item">
			<div class="form-row margin">
				<obj name="input_email_to" type="obj_input_date" tabindex="true"></obj>
			</div>
		</div>

	    <!-- Account detail - Email - Responder - Respond to messages -->
		<div iw-flex-cell="full" id="{anchor fi_email_respond_to_messages}">
			<div class="form-row">
				<obj name="toggle_email_respond_to_messages" type="obj_toggle" tabindex="true">
					<label>accountdetail::respond_to_messages</label>
				</obj>
			</div>
		</div>

	    <!-- Account detail - Email - Responder - Message -->
		<div iw-flex-cell="full" id="{anchor fi_responder_message}" class="form-item">
			<div class="form-row">
				<obj name="btn_responder_message" type="obj_button" css="text primary" tabindex="true"><value>accountdetail::responder_message</value></obj>
			</div>
		</div>

		</div>

	</div>
        </div>
</div>
</div>

<!-- Account detail - Email - Antispam -->
<div class="form-section" id="{anchor fs_antispam}">
<h3 class="box-content-title gamma">{ACCOUNTDETAIL::ANTISPAM}</h3>
<p class="box-content-desc">{ACCOUNTDETAIL_HELP::ANTISPAM}</p>

<div class="form-block" id="{anchor fb_antispam}">
	<div iw-flex-grid="query 2">

	<!-- Account detail - Email - Antispam - Spam reports mode -->
	<div iw-flex-cell id="{anchor fi_email_reports}" class="form-item">
		<div class="form-label">
			<label class="label">{ACCOUNTDETAIL::SPAM_REPORTS_MODE}</label>
		</div>
		<div class="form-row">
			<obj name="dropdown_email_reports" type="obj_dropdown_single" tabindex="true"></obj>
		</div>
	</div>

	<!-- Account detail - Email - Antispam - Spam folder mode -->
	<div iw-flex-cell id="{anchor fi_email_folder}" class="form-item">
		<div class="form-label">
			<label class="label">{ACCOUNTDETAIL::SPAM_FOLDER_MODE}</label>
		</div>
		<div class="form-row">
			<obj name="dropdown_email_folder" type="obj_dropdown_single" tabindex="true"></obj>
		</div>
	</div>
	</div>

</div>
</div>
