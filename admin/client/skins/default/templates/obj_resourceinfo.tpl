<div class="panel error" iw-type="full" id="{anchor fi_account_is_disabled}" class="form-item" is-hidden="1">
	<div iw-flex-grid="fit">
	<div iw-flex-cell>
		<div iw-flex-grid="fit item-center">
		<div iw-flex-cell="none">
			<i class="panel-icon icon-warning"></i>
		</div>
		<div iw-flex-cell="half-padding item-center">
			<span class="panel-title">{ACCOUNTDETAIL::ACCOUNT_IS_DISABLED}</span>
		</div>
		</div>
	</div>
	</div>
</div>

<!-- Resource - Info -->
<div class="form-section" id="{anchor fs_info}">
<h3 class="box-content-title gamma">{RESOURCE::GENERAL}</h3>

	<div iw-flex-grid="query 2 double-padding">

	<!-- Resource - Info - Detail -->
	<div iw-flex-cell>
		<div class="form-block" id="{anchor fb_detail}">

			<div iw-flex-grid="query 2">

			<!-- Resource - Info - Detail - Left Col -->
			<div iw-flex-cell>
				<div iw-flex-grid>

				<!-- Resource - Info - Detail - Alias -->
				{include inc_form}
					{	"element_input": true,
						"name": "alias",
						"label_text": "{RESOURCE::ALIAS}",
						"input_placeholder": "resource::alias"
					}
				{/include}

				<!-- Resource - Info - Detail - Name -->
				{include inc_form}
					{	"element_input": true,
						"name": "name",
						"label_text": "{RESOURCE::NAME}",
						"input_placeholder": "resource::name"
					}
				{/include}

				<!-- Resource - Info - Detail - Type -->
				{include inc_form}
					{	"element_dropdown": true,
						"name": "type",
						"label_text": "{RESOURCE::TYPE}"
					}
				{/include}

				</div>
			</div>

			<!-- Resource - Info - Detail - Right Col -->
			<div iw-flex-cell>

				<div iw-flex-grid>

				<!-- Resource - Info - Detail - Account photo -->
				<div iw-flex-cell class="text-center">
					<div class="userhead large circle icon-user_default u-margin-half" style="margin-top: 0">
						<div id="{anchor userimage}" class="userhead-image"></div>
					</div>
				</div>

				<!-- Resource - Info - Detail - Upload photo -->
				<div iw-flex-cell id="{anchor fi_account_upload_photo}" class="form-item">
					<div class="form-row margin">
						<obj name="button_upload_photo" type="obj_upload" css="text primary full icon-arrow-up" tabindex="true">
							<title>generic::upload_photo</title>
						</obj>
					</div>
				</div>

				<!-- Resource - Info - Detail - Permissions -->
				{include inc_form}
					{	"element_button": true,
						"name": "permissions",
						"button_value": "resource::permissions",
						"item_class": "margin",
						"button_class": "text  primary  full"
					}
				{/include}

				</div>

			</div>

			</div>
		</div>

	</div>

	<!-- Resource - Info - Options -->
	<div iw-flex-cell>

		<div class="form-block" id="{anchor fb_options}">

			<div iw-flex-grid>

			<!-- Resource - Info - Options - Temporarily unavailable -->
			{include inc_form}
				{	"name": "temporarily_unavailable",
					"label_toggle": "resource::temporarily_unavailable"
				}
			{/include}

			<!-- Resource - Info - Options - Allow conflicts -->
			{include inc_form}
				{	"name": "allow_conflicts",
					"label_toggle": "resource::allow_conflicts"
				}
			{/include}

			<!-- Resource - Info - Options - Send notification to user -->
			{include inc_form}
				{	"element_input": true,
					"name": "send_notification",
					"label_toggle": "resource::send_notification",
					"input_placeholder": "resource::send_notification",
					"button_class": "icon  icon-user  small",
					"inner_button": true
				}
			{/include}

			</div>

		</div>

	</div>

	</div>

</div>
