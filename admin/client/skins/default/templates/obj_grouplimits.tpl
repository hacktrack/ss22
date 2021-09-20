<div iw-flex-grid="query 2 double-padding">

<!-- Group detail - Limits - Left Col -->
<div iw-flex-cell>

	<!-- Group detail - Limits - Limits -->
	<div class="form-section" id="{anchor fs_limits}">
		<h3 class="box-content-title gamma">{ACCOUNTDETAIL::LIMITS}</h3>
		<p class="box-content-desc">{ACCOUNTDETAIL_HELP::LIMITS}</p>

		<div class="form-block" id="{anchor fb_limits}">

			<div iw-flex-grid>

			<!-- Group detail - Limits - Limits - Account disk quota -->
			{include inc_form}
				{	"element_input_bytes": true,
					"name": "account_quote_enabled",
					"label_toggle": "accountdetail::account_quote_enabled",
					"toggle_element": "input"
				}
			{/include}

			<!-- Group detail - Limits - Limits - Max file size -->
			{include inc_form}
				{	"element_input_bytes": true,
					"name": "max_file_size",
					"label_text": "{ACCOUNTDETAIL::MAX_FILE_SIZE}"
				}
			{/include}

			</div>

		</div>
	</div>

</div>
</div>
