<!-- Add certificate -->
<div iw-flex-grid>

<!-- Add certificate - Certificate -->
{include inc_form}
	{	"element_input": true,
		"append_upload": true,
		"button_class": "text  primary  icon-arrow-up",
		"button_value": "generic::upload",
		"name": "certificate",
		"label_text": "{CERTIFICATES::CERTIFICATE}",
		"input_placeholder": "certificates::certificate"
	}
{/include}

</div>
