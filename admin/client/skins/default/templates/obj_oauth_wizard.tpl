<div iw-flex-grid class="box-content-inner" id="{anchor details}">

	<div iw-flex-cell class="form__block" id="{anchor fb_company}">
		<div iw-flex-grid>

		{noptional new}
			{include inc_form}
				{	"element_input": true,
					"name": "id",
					"label_text": "{OAUTH::CLIENT_ID}",
					"item_class": "row",
					"input_readonly": true
				}
			{/include}
		{/noptional}

		{include inc_form}
			{	"element_input": true,
				"input_placeholder": "oauth::name",
				"name": "name",
				"label_text": "{OAUTH::NAME}",
				"item_class": "row"
			}
		{/include}

		{include inc_form}
			{	"element_input": true,
				"input_placeholder": "oauth::description",
				"name": "description",
				"label_text": "{OAUTH::DESCRIPTION}",
				"item_class": "row"
			}
		{/include}

		{include inc_form}
			{	"element_input": true,
				"input_placeholder": "oauth::redirect_uri",
				"name": "redirect_uri",
				"input_type": "url",
				"label_text": "{OAUTH::REDIRECT_URI}",
				"item_class": "row"
			}
		{/include}

		{include inc_form}
			{	"element_dropdown": true,
				"name": "auth_type",
				"label_text": "{OAUTH::AUTH_TYPE}",
				"item_class": "row"
			}
		{/include}

		</div>
	</div>

</div>
