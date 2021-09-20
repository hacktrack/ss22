<!-- Certificates - Wizard -->
<div class="box-content-inner" id="{anchor wizard}">

	<div class="wizard">

	{noptional reissue_cert}
	<!-- NEW -->
	<!-- Certificates - Wizard - Add existing -->
	{include inc_wizard_item}
		{	"name": "add_existing",
			"title_text": "{CERTIFICATES::ADD_EXISTING}",
			"help_text": "{CERTIFICATES_HELP::ADD_EXISTING}",
			"button_text": "generic::continue",
			"icon": "cert-ssl"
		}
	{/include}

	<!-- Certificates - Wizard - New IceWarp certificate -->
	{include inc_wizard_item}
		{	"name": "new_icewarp_cert",
			"title_text": "{CERTIFICATES::NEW_ICEWARP_CERT}",
			"help_text": "{CERTIFICATES_HELP::NEW_ICEWARP_CERT}",
			"button_text": "generic::continue",
			"icon": "cert-icewarp"
		}
	{/include}

	<!-- Certificates - Wizard - New CA certificate -->
	{include inc_wizard_item}
		{	"name": "new_ca_cert",
			"title_text": "{CERTIFICATES::NEW_CA_CERT}",
			"help_text": "{CERTIFICATES_HELP::NEW_CA_CERT}",
			"button_text": "generic::continue",
			"icon": "cert-authority"
		}
	{/include}

	<!-- Certificates - Wizard - New Let’s Encrypt certificate -->
	{include inc_wizard_item}
		{	"name": "new_lets_encrypt_cert",
			"title_text": "{CERTIFICATES::NEW_LETS_ENCRYPT_CERT}",
			"help_text": "{CERTIFICATES_HELP::NEW_LETS_ENCRYPT_CERT}",
			"button_text": "generic::continue",
			"icon": "cert-letsencrypt"
		}
	{/include}

	<!-- Certificates - Wizard - New self-signed certificate -->
	{include inc_wizard_item}
		{	"name": "new_self_signed_cert",
			"title_text": "{CERTIFICATES::NEW_SELF_SIGNED_CERT}",
			"help_text": "{CERTIFICATES_HELP::NEW_SELF_SIGNED_CERT}",
			"button_text": "generic::continue",
			"icon": "cert-signed",
			"icon_color": "dark"
		}
	{/include}
	{/noptional}


	{optional reissue_cert}
	<!-- REISSUE -->
	<!-- Certificates - Wizard - Reissue IceWarp certificate -->
	{include inc_wizard_item}
		{	"name": "new_icewarp_cert",
			"title_text": "{CERTIFICATES::REISSUE_ICEWARP_CERT}",
			"help_text": "{CERTIFICATES_HELP::NEW_ICEWARP_CERT}",
			"button_text": "generic::continue",
			"icon": "cert-icewarp"
		}
	{/include}

	<!-- Certificates - Wizard - Reissue CA certificate -->
	{include inc_wizard_item}
		{	"name": "new_ca_cert",
			"title_text": "{CERTIFICATES::REISSUE_CA_CERT}",
			"help_text": "{CERTIFICATES_HELP::NEW_CA_CERT}",
			"button_text": "generic::continue",
			"icon": "cert-authority"
		}
	{/include}

	<!-- Certificates - Wizard - Reissue Let’s Encrypt certificate -->
	{include inc_wizard_item}
		{	"name": "new_lets_encrypt_cert",
			"title_text": "{CERTIFICATES::REISSUE_LETS_ENCRYPT_CERT}",
			"help_text": "{CERTIFICATES_HELP::NEW_LETS_ENCRYPT_CERT}",
			"button_text": "generic::continue",
			"icon": "cert-letsencrypt"
		}
	{/include}

	<!-- Certificates - Wizard - Reissue self-signed certificate -->
	{include inc_wizard_item}
		{	"name": "new_self_signed_cert",
			"title_text": "{CERTIFICATES::REISSUE_SELF_SIGNED_CERT}",
			"help_text": "{CERTIFICATES_HELP::NEW_SELF_SIGNED_CERT}",
			"button_text": "generic::continue",
			"icon": "cert-signed",
			"icon_color": "dark"
		}
	{/include}
	{/optional}

	</div>
</div>


<!-- Certificates - Details -->
<div iw-flex-grid class="box-content-inner" id="{anchor details}" is-hidden="1">

	<!-- Certificates - Details - Hostname -->
	<div iw-flex-cell class="form__block" id="{anchor fb_hostname}">
		<h4 class="form__block-title">{CERTIFICATES::HOSTNAMES}</h4>
		<div iw-flex-grid>

		<!-- Certificates - Details - Hostname - Hostname -->
		<obj type="obj_multi" name="multi_hostnames" itemtype="obj_multi_cert_hostnames" style="width: 100%"></obj>

		</div>
	</div>

	<!-- Certificates - Details - Reuse -->
	<div iw-flex-cell class="form__block" id="{anchor reuse}" is-hidden="1">
		<h4 class="form__block-title">{CERTIFICATES::KEY_PAIR}</h4>
		<div iw-flex-grid>

		<!-- Certificates - Details - Reuse - Key pair -->
		{include inc_form}
			{	"name": "reuse",
				"radio_class": "radio--block",
				"element_radio":
				[
					{	"name": "reuse",
						"label": "certificates::reuse"
					},
					{	"name": "generate",
						"label": "certificates::generate"
					}
				]
			}
		{/include}
		</div>

	</div>

	<!-- Certificates - Details - Company details -->
	<div iw-flex-cell class="form__block" id="{anchor fb_company}">
		<h4 class="form__block-title">{CERTIFICATES::COMPANY_DETAILS}</h4>
		<div iw-flex-grid>

		<!-- Certificates - Details - Company details - Email -->
		{include inc_form}
			{	"element_input": true,
				"input_placeholder": "certificates::email",
				"input_type": "email",
				"name": "email",
				"label_text": "{CERTIFICATES::EMAIL}",
				"item_class": "row"
			}
		{/include}

		<!-- Certificates - Details - Company details - Organization -->
		{include inc_form}
			{	"element_input": true,
				"input_placeholder": "certificates::organization",
				"name": "organization",
				"label_text": "{CERTIFICATES::ORGANIZATION}",
				"item_class": "row"
			}
		{/include}

		<!-- Certificates - Details - Company details - Unit -->
		{include inc_form}
			{	"element_input": true,
				"input_placeholder": "certificates::unit",
				"name": "unit",
				"label_text": "{CERTIFICATES::UNIT}",
				"item_class": "row"
			}
		{/include}

		<!-- Certificates - Details - Company details - City -->
		{include inc_form}
			{	"element_input": true,
				"input_placeholder": "certificates::city",
				"name": "city",
				"label_text": "{CERTIFICATES::CITY}",
				"item_class": "row"
			}
		{/include}

		<!-- Certificates - Details - Company details - State -->
		{include inc_form}
			{	"element_input": true,
				"input_placeholder": "certificates::state",
				"name": "state",
				"label_text": "{CERTIFICATES::STATE}",
				"item_class": "row"
			}
		{/include}

		<!-- Certificates - Details - Company details - Country -->
		{include inc_form}
			{	"element_input": true,
				"input_placeholder": "certificates::country",
				"name": "country",
				"label_text": "{CERTIFICATES::COUNTRY}",
				"item_class": "row"
			}
		{/include}

		</div>
	</div>

	<!-- Certificates - Details - Certificate settings -->
	<div iw-flex-cell class="form__block" id="{anchor fb_certificate}">
		<h4 class="form__block-title">{CERTIFICATES::CERTIFICATE_SETTINGS}</h4>
		<div iw-flex-grid>

		<!-- Certificates - Details - Certificate settings - Validity -->
		{include inc_form}
			{	"element_dropdown": true,
				"name": "validity",
				"label_text": "{CERTIFICATES::VALIDITY}",
				"item_class": "row"
			}
		{/include}

		<!-- Certificates - Details - Certificate settings - Bits -->
		{include inc_form}
			{	"element_input": true,
				"input_type": "number",
				"name": "bits",
				"label_text": "{CERTIFICATES::BITS}",
				"item_class": "row"
			}
		{/include}

		</div>
	</div>

</div>
