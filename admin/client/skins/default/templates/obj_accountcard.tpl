<!-- Account detail - Card - General -->
<div class="form-section" id="{anchor fs_general}">

	<h3 class="box-content-title gamma">{ACCOUNTDETAIL::GENERAL}</h3>
	<p class="box-content-desc">{ACCOUNTDETAIL_HELP::GENERAL}</p>

	<div iw-flex-grid="2 query">
	<!-- Account detail - Card - General - Left column -->
	<div iw-flex-cell>

		<div class="form-block" id="{anchor fb_general}">

			<div iw-flex-grid>

			<!-- Account detail - Card - General - Name -->
			<div iw-flex-cell id="{anchor fi_card_name}" class="form-item">
				<div class="form-label">
					<label class="label">{ACCOUNTDETAIL::NAME}</label>
				</div>
				<div class="form-row">
					<obj name="input_card_name" type="obj_input_text" tabindex="true"><placeholder>accountdetail::name</placeholder></obj>
				</div>
			</div>

			<!-- Account detail - Card - General - Surname -->
			<div iw-flex-cell id="{anchor fi_card_surname}" class="form-item">
				<div class="form-label">
					<label class="label">{ACCOUNTDETAIL::SURNAME}</label>
				</div>
				<div class="form-row">
					<obj name="input_card_surname" type="obj_input_text" tabindex="true"><placeholder>accountdetail::surname</placeholder></obj>
				</div>
			</div>

			<!-- Account detail - Card - General - Birthday -->
			<div iw-flex-cell id="{anchor fi_card_birthday}" class="form-item">
				<div class="form-label">
					<label class="label">{ACCOUNTDETAIL::BIRTHDAY}</label>
				</div>
				<div class="form-row">
					<obj name="input_card_birthday" type="obj_input_date" tabindex="true"></obj>
				</div>
			</div>

			<!-- Account detail - Card - General - Gender -->
			<div iw-flex-cell id="{anchor fi_card_gender}" class="form-item">
				<div class="form-label">
					<label class="label">{ACCOUNTDETAIL::GENDER}</label>
				</div>
				<div class="form-row">
					<obj name="dropdown_card_gender" type="obj_dropdown_single" tabindex="true"></obj>
				</div>
			</div>

			<!-- Account detail - Card - General - Anniversary -->
			<div iw-flex-cell id="{anchor fi_card_anniversary}" class="form-item">
				<div class="form-label">
					<label class="label">{ACCOUNTDETAIL::ANNIVERSARY}</label>
				</div>
				<div class="form-row">
					<obj name="input_card_anniversary" type="obj_input_date" tabindex="true"></obj>
				</div>
			</div>

			</div>

		</div>

	</div>

	<!-- Account detail - Card - General - Right column -->
	<div iw-flex-cell>

		<div class="form-block" id="{anchor fb_general}">

			<div iw-flex-grid>

			<!-- Account detail - Card - General - Company -->
			<div iw-flex-cell id="{anchor fi_card_company}" class="form-item">
				<div class="form-label">
					<label class="label">{ACCOUNTDETAIL::COMPANY}</label>
				</div>
				<div class="form-row">
					<obj name="input_card_company" type="obj_input_text" tabindex="true"><placeholder>accountdetail::company</placeholder></obj>
				</div>
			</div>

			<!-- Account detail - Card - General - Department -->
			<div iw-flex-cell id="{anchor fi_card_department}" class="form-item">
				<div class="form-label">
					<label class="label">{ACCOUNTDETAIL::DEPARTMENT}</label>
				</div>
				<div class="form-row">
					<obj name="input_card_department" type="obj_input_text" tabindex="true"><placeholder>accountdetail::department</placeholder></obj>
				</div>
			</div>

			<!-- Account detail - Card - General - Job -->
			<div iw-flex-cell id="{anchor fi_card_job}" class="form-item">
				<div class="form-label">
					<label class="label">{ACCOUNTDETAIL::JOB}</label>
				</div>
				<div class="form-row">
					<obj name="input_card_job" type="obj_input_text" tabindex="true"><placeholder>accountdetail::job</placeholder></obj>
				</div>
			</div>

			<!-- Account detail - Card - General - Manager -->
			<div iw-flex-cell id="{anchor fi_card_manager}" class="form-item">
				<div class="form-label">
					<label class="label">{ACCOUNTDETAIL::MANAGER}</label>
				</div>
				<div class="form-row">
					<obj name="input_card_manager" type="obj_input_text" tabindex="true"><placeholder>accountdetail::manager</placeholder></obj>
				</div>
			</div>

			<!-- Account detail - Card - General - Assistant -->
			<div iw-flex-cell id="{anchor fi_card_assistant}" class="form-item">
				<div class="form-label">
					<label class="label">{ACCOUNTDETAIL::ASSISTANT}</label>
				</div>
				<div class="form-row">
					<obj name="input_card_assistant" type="obj_input_text" tabindex="true"><placeholder>accountdetail::assistant</placeholder></obj>
				</div>
			</div>

			</div>

		</div>

	</div>
	</div>

</div>

<div iw-flex-grid="2 query">
<!-- Account detail - Card - Phone -->
<div iw-flex-cell>

	<div class="form-section" id="{anchor fs_phone}">

		<h3 class="box-content-title gamma">{ACCOUNTDETAIL::PHONE}</h3>
		<p class="box-content-desc">{ACCOUNTDETAIL_HELP::PHONE}</p>

		<div class="form-block" id="{anchor fb_phone}">

			<div iw-flex-grid>
			<div iw-flex-cell id="{anchor fi_add_phone}" class="form-item">
				<div id="{anchor phones_values}"></div>
				<div class="form-row" id="{anchor phones_select}">
					<div iw-flex-grid="fit group">
					<div iw-flex-cell>
						<obj name="input_card_phone" type="obj_input_tel" css="inline group-left" tabindex="true"><placeholder>accountdetail::phone</placeholder></obj>
					</div>
					<div iw-flex-cell="none">
						<obj name="dropdown_phone_type" type="obj_dropdown_single" css="inline group-right" tabindex="true"></obj>
					</div>
					</div>
				</div>
				<div class="form-row">
					<obj name="button_add_phone" type="obj_button" css="text primary" tabindex="true">
						<value>accountdetail::add_phone</value>
					</obj>
				</div>
			</div>
			</div>

		</div>

	</div>

</div>

<!-- Account detail - Card - Email -->
<div iw-flex-cell>

	<div class="form-section" id="{anchor fs_email}">

		<h3 class="box-content-title gamma">{ACCOUNTDETAIL::EMAIL}</h3>
		<p class="box-content-desc">{ACCOUNTDETAIL_HELP::EMAIL}</p>

		<div class="form-block" id="{anchor fb_email}">

			<div iw-flex-grid>
			<div iw-flex-cell id="{anchor fi_add_email}" class="form-item">
				<div id="{anchor emails_values}"></div>
				<div class="form-row" id="{anchor emails_select}">
					<div iw-flex-grid="fit group">
					<div iw-flex-cell>
						<obj name="input_card_email" type="obj_input_email" css="inline group-left" tabindex="true"><placeholder>accountdetail::email</placeholder></obj>
					</div>
					<div iw-flex-cell="none">
						<obj name="dropdown_email_type" type="obj_dropdown_single" css="inline group-right" tabindex="true"></obj>
					</div>
					</div>
				</div>
				<div class="form-row">
					<obj name="button_add_email" type="obj_button" css="text primary" tabindex="true">
						<value>accountdetail::add_email</value>
					</obj>
				</div>
			</div>
			</div>

		</div>

	</div>

</div>

<!-- Account detail - Card - Website -->
<div iw-flex-cell>

	<div class="form-section" id="{anchor fs_website}">

		<h3 class="box-content-title gamma">{ACCOUNTDETAIL::WEBSITE}</h3>
		<p class="box-content-desc">{ACCOUNTDETAIL_HELP::WEBSITE}</p>

		<div class="form-block" id="{anchor fb_website}">

			<div iw-flex-grid>
			<div iw-flex-cell id="{anchor fi_card_website}" class="form-item">
				<div class="form-row">
					<obj name="input_card_website1" type="obj_input_text" css="inline" tabindex="true"><placeholder>accountdetail::website</placeholder></obj>
				</div>
				<div class="form-row">
					<obj name="input_card_website2" type="obj_input_text" css="inline" tabindex="true"><placeholder>accountdetail::website</placeholder></obj>
				</div>
			</div>
			</div>

		</div>

	</div>

</div>

<!-- Account detail - Card - Note -->
<div iw-flex-cell>

	<div class="form-section" id="{anchor fs_note}">

		<h3 class="box-content-title gamma">{ACCOUNTDETAIL::NOTE}</h3>
		<p class="box-content-desc">{ACCOUNTDETAIL_HELP::NOTE}</p>

		<div class="form-block" id="{anchor fb_note}">

			<div iw-flex-grid>
			<div iw-flex-cell id="{anchor fi_card_note}" class="form-item">
				<div class="form-row large">
					<obj name="textarea_card_note" type="obj_textarea" tabindex="true"><placeholder>accountdetail::note</placeholder></obj>
				</div>
			</div>
			</div>

		</div>

	</div>

</div>
</div>

<div iw-flex-grid>
<div iw-flex-cell>

	<!-- Account detail - Card - Address -->
	<div class="form-section" id="{anchor fs_address}">

		<h3 class="box-content-title gamma">{ACCOUNTDETAIL::ADDRESS}</h3>
		<p class="box-content-desc">{ACCOUNTDETAIL_HELP::ADDRESS}</p>

		<div class="form-block" id="{anchor fb_address}">

			<h4 class="form-block-title delta">{ACCOUNTDETAIL::WORK_ADDRESS}</h4>

			<div iw-flex-grid="query">

			<!-- Account detail - Card - Address - Work - Street -->
			<div iw-flex-cell="4" id="{anchor fi_card_work_street}" class="form-item">
				<div class="form-label">
					<label class="label">{ACCOUNTDETAIL::STREET}</label>
				</div>
				<div class="form-row">
					<obj name="input_card_work_street" type="obj_input_text" tabindex="true"><placeholder>accountdetail::street</placeholder></obj>
				</div>
			</div>

			<!-- Account detail - Card - Address - Work - City -->
			<div iw-flex-cell="2" id="{anchor fi_card_work_city}" class="form-item">
				<div class="form-label">
					<label class="label">{ACCOUNTDETAIL::CITY}</label>
				</div>
				<div class="form-row">
					<obj name="input_card_work_city" type="obj_input_text" tabindex="true"><placeholder>accountdetail::city</placeholder></obj>
				</div>
			</div>

			<!-- Account detail - Card - Address - Work - Zip -->
			<div iw-flex-cell="2" id="{anchor fi_card_work_zip}" class="form-item">
				<div class="form-label">
					<label class="label">{ACCOUNTDETAIL::ZIP}</label>
				</div>
				<div class="form-row">
					<obj name="input_card_work_zip" type="obj_input_text" tabindex="true"><placeholder>accountdetail::zip</placeholder></obj>
				</div>
			</div>
			</div>

			<div iw-flex-grid="query 4">

			<!-- Account detail - Card - Address - Work - State / County -->
			<div iw-flex-cell id="{anchor fi_card_work_state_county}" class="form-item">
				<div class="form-label">
					<label class="label">{ACCOUNTDETAIL::STATE_COUNTY}</label>
				</div>
				<div class="form-row">
					<obj name="input_card_work_state_county" type="obj_input_text" tabindex="true"><placeholder>accountdetail::state_county</placeholder></obj>
				</div>
			</div>

			<!-- Account detail - Card - Address - Work - Country -->
			<div iw-flex-cell id="{anchor fi_card_work_country}" class="form-item">
				<div class="form-label">
					<label class="label">{ACCOUNTDETAIL::COUNTRY}</label>
				</div>
				<div class="form-row">
					<obj name="input_card_work_country" type="obj_input_text" tabindex="true"><placeholder>accountdetail::country</placeholder></obj>
				</div>
			</div>
			</div>

		</div>

		<div class="form-block" id="{anchor fb_home_address}">

			<h4 class="form-block-title delta">{ACCOUNTDETAIL::HOME_ADDRESS}</h4>

			<div iw-flex-grid="query">

			<!-- Account detail - Card - Address - Home - Street -->
			<div iw-flex-cell="4" id="{anchor fi_card_home_street}" class="form-item">
				<div class="form-label">
					<label class="label">{ACCOUNTDETAIL::STREET}</label>
				</div>
				<div class="form-row">
					<obj name="input_card_home_street" type="obj_input_text" tabindex="true"><placeholder>accountdetail::street</placeholder></obj>
				</div>
			</div>

			<!-- Account detail - Card - Address - Home - City -->
			<div iw-flex-cell="2" id="{anchor fi_card_home_city}" class="form-item">
				<div class="form-label">
					<label class="label">{ACCOUNTDETAIL::CITY}</label>
				</div>
				<div class="form-row">
					<obj name="input_card_home_city" type="obj_input_text" tabindex="true"><placeholder>accountdetail::city</placeholder></obj>
				</div>
			</div>

			<!-- Account detail - Card - Address - Home - Zip -->
			<div iw-flex-cell="2" id="{anchor fi_card_home_zip}" class="form-item">
				<div class="form-label">
					<label class="label">{ACCOUNTDETAIL::ZIP}</label>
				</div>
				<div class="form-row">
					<obj name="input_card_home_zip" type="obj_input_text" tabindex="true"><placeholder>accountdetail::zip</placeholder></obj>
				</div>
			</div>
			</div>

			<div iw-flex-grid="query 4">

			<!-- Account detail - Card - Address - Home - State / County -->
			<div iw-flex-cell id="{anchor fi_card_home_state_county}" class="form-item">
				<div class="form-label">
						<label class="label">{ACCOUNTDETAIL::STATE_COUNTY}</label>
				</div>
				<div class="form-row">
						<obj name="input_card_home_state_county" type="obj_input_text" tabindex="true"><placeholder>accountdetail::state_county</placeholder></obj>
				</div>
			</div>

			<!-- Account detail - Card - Address - Home - Country -->
			<div iw-flex-cell id="{anchor fi_card_home_country}" class="form-item">
				<div class="form-label">
					<label class="label">{ACCOUNTDETAIL::COUNTRY}</label>
				</div>
				<div class="form-row">
					<obj name="input_card_home_country" type="obj_input_text" tabindex="true"><placeholder>accountdetail::country</placeholder></obj>
				</div>
			</div>
			</div>

		</div>

	</div>

</div>
</div>
