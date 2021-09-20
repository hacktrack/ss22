<div iw-flex-grid>

	<!-- Mailing list - Members - Rights -->
	{include inc_form}
		{	"name": "rights",
			"element_checkbox":
			[
				{	"name": "right_default",
					"label": "mailinglist::default",
					"value": "default"
				},
				{	"name": "right_post",
					"label": "mailinglist::post",
					"value": "post"
				},
				{	"name": "right_receive",
					"label": "mailinglist::receive",
					"value": "receive"
				},
				{	"name": "right_digest",
					"label": "mailinglist::digest",
					"value": "digest"
				}
			]
		}
	{/include}

</div>
