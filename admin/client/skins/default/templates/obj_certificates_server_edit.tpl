<!-- Certificates - Properties - Error -->
<div iw-flex-grid id="{anchor errors}" is-hidden="1">
<div iw-flex-cell class="form__block">
	<h4 class="form__block-title">{CERTIFICATES::CERT_FAILURE}</h4>

	<div iw-flex-grid>

	<!-- Certificates - Properties - Error - Last certification attempt -->
	{include inc_form}
		{	"label_text": "{CERTIFICATES::LAST_CERT_ATTEMPT}",
			"name": "last_cert_attempt",
			"element_text": true,
			"text_value": "{error::when}"
		}
	{/include}

	<!-- Certificates - Properties - Error - Last certification attempt -->
	{include inc_form}
		{	"label_text": "{CERTIFICATES::ERROR}",
			"name": "error",
			"element_text": true,
			"text_value": "{error::message}",
			"text_class": "color-error"
		}
	{/include}

	<!-- Certificates - Properties - Error - Verification failed for -->
	{include inc_form}
		{	"label_text": "{CERTIFICATES::VER_FAILED_FOR}",
			"name": "ver_failed_for",
			"element_text": true,
			"text_value": "{dynamic error::faileddomains}{error::faileddomains::*}<br>{/dynamic}"
		}
	{/include}

	</div>
</div>
</div>

<!-- Certificates - Properties - CSR -->
<div iw-flex-grid id="{anchor csr}" is-hidden="1">
<div iw-flex-cell class="form__block">

	<p class="box-content-desc">{CERTIFICATES_HELP::CSR}</p>

	<div iw-flex-grid>

	{include inc_form}
		{	"element_button": true,
			"label_text": "{CERTIFICATES::EXPORT_CSR}",
			"name": "export_csr",
			"button_value": "generic::export",
			"item_class": "row"
		}
	{/include}

	{include inc_form}
		{	"element_input": true,
			"append_upload": true,
			"button_class": "text  primary  icon-arrow-up",
			"button_value": "generic::upload",
			"name": "bind_certificate",
			"label_text": "{CERTIFICATES::BIND_CERTIFICATE}",
			"input_placeholder": "certificates::bind_certificate"
		}
	{/include}

	</div>
</div>
</div>

<!-- Certificates - Properties - IP Binding -->
<div iw-flex-grid id="{anchor ip_binding}" is-hidden="1">
<div iw-flex-cell class="form__block">

	<div iw-flex-grid>

	<!-- Certificates - Properties - IP Binding - All/Selected -->
	{include inc_form}
		{	"name": "ips",
			"radio_class": "radio--block",
			"element_radio":
			[
				{	"name": "all_ips",
					"label": "certificates::all_ips"
				},
				{	"name": "selected_ips",
					"label": "certificates::selected_ips"
				}
			]
		}
	{/include}

	<!-- Certificates - Properties - IP Binding - IP Addresses -->
	<obj type="obj_multi" name="multi_ips" itemtype="obj_multi_cert_ip_addresses" style="width: 100%"></obj>

	</div>
</div>
</div>

<!-- Certificates - Properties - Details -->
<div iw-flex-grid id="{anchor details}" is-hidden="1">
<div iw-flex-cell class="form__block">
	<div iw-flex-grid>

	{optional issuer}
	<!-- Certificates - Properties - Details - Issuer -->
	<!-- Not using inc_form because of better optionals -->
	<div iw-flex-cell id="{anchor fi_issuer}" class= "form__item">
		<label class="label form__label" title="{CERTIFICATES::ISSUER}">
			<span class="label__text">{CERTIFICATES::ISSUER}</span>
		</label>
		<p id="{anchor issuer}" class="form__element form__element--text text">
			{optional issuerinfo::cn}{issuerinfo::cn}{/optional}
			<br>
			{optional issuerinfo::o}{issuerinfo::o}{/optional}
			{optional issuerinfo::ou}{issuerinfo::ou}{/optional}
			<br>
			{optional issuerinfo::locality}{issuerinfo::locality}{/optional}
			{optional issuerinfo::state}{issuerinfo::state},{/optional}
			{optional issuerinfo::c}{issuerinfo::c}{/optional}
			<br>
			{optional issuerinfo::email}{issuerinfo::email}{/optional}
		</p>
	</div>
	{/optional}

	{optional subject}
	<!-- Certificates - Properties - Details - Subject -->
	<!-- Not using inc_form because of better optionals -->
	<div iw-flex-cell id="{anchor fi_subject}" class= "form__item">
		<label class="label form__label" title="{CERTIFICATES::SUBJECT}">
			<span class="label__text">{CERTIFICATES::SUBJECT}</span>
		</label>
		<p id="{anchor subject}" class="form__element form__element--text text">
			{optional subjectinfo::cn}{subjectinfo::cn}{/optional}
			<br>
			{optional subjectinfo::o}{subjectinfo::o}{/optional}
			{optional subjectinfo::ou}{subjectinfo::ou}{/optional}
			<br>
			{optional subjectinfo::locality}{subjectinfo::locality}{/optional}
			{optional subjectinfo::state}{subjectinfo::state},{/optional}
			{optional subjectinfo::c}{subjectinfo::c}{/optional}
			<br>
			{optional subjectinfo::email}{subjectinfo::email}{/optional}
		</p>
	</div>
	{/optional}

	{optional fingerprint}
	<!-- Certificates - Properties - Details - Fingerprint -->
	{include inc_form}
		{	"label_text": "{CERTIFICATES::FINGERPRINT}",
			"name": "fingerprint",
			"element_text": true,
			"text_value": "{fingerprint}",
			"text_class": "u-break-word"
		}
	{/include}
	{/optional}

	<!-- Certificates - Properties - Details - Bits -->
	{include inc_form}
		{	"name": "bits",
			"element_text": true,
			"text_value": "{bits} {CERTIFICATES::BITS}",
			"text_class": "u-reset-margin"
		}
	{/include}

	<!-- Certificates - Properties - Details - Expiration -->
	{include inc_form}
		{	"name": "expiration",
			"element_text": true,
			"text_value": "{noptional iscsr}{CERTIFICATES::EXPIRATION} {expiration}{/noptional}"
		}
	{/include}

	</div>
</div>
</div>

<!-- Certificates - Properties - Domains -->
<div iw-flex-grid id="{anchor domains}" is-hidden="1">
<div iw-flex-cell class="form__block">
	<div iw-flex-grid>

	{include inc_form}
		{	"label_text": "{CERTIFICATES::CERT_DOMAINS}",
			"name": "cert_domains",
			"element_text": true,
			"text_value": "{dynamic hostname}{hostname::*}<br>{/dynamic}"
		}
	{/include}

	</div>
</div>
</div>


