<!-- White Labeling - Login screen -->
<div iw-flex-grid="query 2 double-padding" class="form__section" id="{anchor fs_login}">
<div iw-flex-cell>

	<h3 class="box-content-title gamma">{WHITELABELING::LOGIN_SKIN}</h3>
	<p class="box-content-desc">{WHITELABELING_HELP::LOGIN_SKIN}</p>

	<div iw-flex-grid>

	<div iw-flex-cell class="form__block form__block--border" id="{anchor fb_login_default}">
		<div iw-flex-grid>

		<!-- White Labeling - Login screen - Default -->
		{include inc_form}
			{	"element_button": true,
				"name": "login_default",
				"button_value": "whitelabeling::use_default"
			}
		{/include}

		</div>
	</div>

	<div iw-flex-cell class="form__block form__block--border" id="{anchor fb_login_logo}">
		<h4 class="form__block-title">{WHITELABELING::LOGIN_LOGO}</h4>
		<p class="form__block-desc">{WHITELABELING_HELP::LOGIN_LOGO}</p>
		<div iw-flex-grid>

		<!-- White Labeling - Login Screen - Login logo -->
		{include inc_form}
			{	"element_upload": true,
				"button_class": "text primary",
				"name": "logo_file",
				"force_option": true
			}
		{/include}

		<!-- White Labeling - Login Screen - Logo image (Hidden input) -->
		{include inc_form}
			{	"element_input": true,
				"input_type": "hidden",
				"item_class": "hide",
				"name": "login_logo_image_input",
				"force_option": true
			}
		{/include}

		</div>
	</div>

	<div iw-flex-cell class="form__block form__block--border" id="{anchor fb_login_skin_style}">
		<h4 class="form__block-title">{WHITELABELING::SKIN_STYLE}</h4>
		<p class="form__block-desc">{WHITELABELING_HELP::LOGIN_SKIN_STYLE}</p>
		<div iw-flex-grid>

		<!-- White Labeling - Login Screen - Colorpicker -->
		{include inc_form}
			{	"element_colorpicker": [
					"default", "shocking-blue", "green-day", "code-orange", "peaches", "yellow-submarine"
				],
				"name": "login_colorpicker",
				"label_text": "{WHITELABELING::CHOOSE_COLOR}",
				"force_option": true
			}
		{/include}

		</div>
	</div>

	<div iw-flex-cell class="form__block form__block--border" id="{anchor fb_login_background_image}">
		<h4 class="form__block-title">{WHITELABELING::BACKGROUND_IMG}</h4>
		<p class="form__block-desc">{WHITELABELING_HELP::LOGIN_BACKGROUND}</p>
		<div iw-flex-grid>

		<!-- White Labeling - Login Screen - Upload custom background -->
		{include inc_form}
			{	"element_upload": true,
				"button_class": "text primary",
				"name": "background_file",
				"button_value": "whitelabeling::upload_custom_background",
				"force_option": true
			}
		{/include}

		<!-- White Labeling - Login Screen - Background image -->
		{include inc_form}
			{	"element_imagepicker": [
					{	"color": "default",
						"index": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
					}
				],
				"color": "default",
				"name": "login_background_image",
				"label_text": "{WHITELABELING::CHOOSE_IMAGE}",
				"force_option": true
			}
		{/include}

		<!-- White Labeling - Login Screen - Background image (Hidden input) -->
		{include inc_form}
			{	"element_input": true,
				"input_type": "hidden",
				"item_class": "hide",
				"name": "login_background_image_input",
				"force_option": true
			}
		{/include}

		</div>
	</div>

	<div iw-flex-cell class="form__block form__block--border" id="{anchor fb_language}">
		<h4 class="form__block-title">{WHITELABELING::SERVER_LANGUAGE}</h4>
		<p class="form__block-desc">{WHITELABELING_HELP::SERVER_LANGUAGE}</p>
		<div iw-flex-grid>

		<!-- White Labeling - Login Screen - Language -->
		{include inc_form}
			{	"element_dropdown": true,
				"name": "language",
				"label_text": "{WHITELABELING::SERVER_LANGUAGE}",
				"force_option": true
			}
		{/include}

		</div>
	</div>

	<div iw-flex-cell class="form__block form__block--border" id="{anchor fb_login_page_options}">
		<h4 class="form__block-title">{WHITELABELING::LOGIN_PAGE_OPTIONS}</h4>
		<p class="form__block-desc">{WHITELABELING_HELP::LOGIN_PAGE_OPTIONS}</p>
		<div iw-flex-grid>

		<!-- White Labeling - Login Screen - Disable language -->
		{include inc_form}
			{	"name": "disable_language",
				"label_toggle": "whitelabeling::disable_language",
				"force_option": true
			}
		{/include}

		<!-- White Labeling - Login Screen - Disable remember me -->
		{include inc_form}
			{	"name": "disable_remember_me",
				"label_toggle": "whitelabeling::disable_remember_me",
				"force_option": true
			}
		{/include}

		<!-- White Labeling - Login Screen - Disable autofill -->
		{include inc_form}
			{	"name": "disable_autofill",
				"label_toggle": "whitelabeling::disable_autofill",
				"force_option": true
			}
		{/include}

		<!-- White Labeling - Login Screen - Disable sign up -->
		{include inc_form}
			{	"name": "disable_sign_up",
				"label_toggle": "whitelabeling::disable_sign_up",
				"force_option": true
			}
		{/include}

		<!-- White Labeling - Login Screen - Disable support link -->
		{include inc_form}
			{	"name": "disable_support_link",
				"label_toggle": "whitelabeling::disable_support_link",
				"element_checkbox":
				[
					{	"name": "phone_required",
						"label": "whitelabeling::require_contact_number",
						"value": "required"
					}
				],
				"item_class": "row",
				"force_option": true
			}
		{/include}

		<!-- White Labeling - Login Screen - Search -->
		{include inc_form}
			{	"element_input": true,
				"name": "search",
				"label_toggle": "whitelabeling::search",
				"input_placeholder": "whitelabeling::search_query",
				"description": "{WHITELABELING_HELP::SEARCH_QUERY}",
				"force_option": true
			}
		{/include}

		</div>
	</div>

	<div iw-flex-cell class="form__block form__block--border" id="{anchor fb_custom_fields}">
		<h4 class="form__block-title">{WHITELABELING::CUSTOM_SIGN_UP_FIELDS}</h4>
		<p class="form__block-desc">{WHITELABELING_HELP::CUSTOM_SIGN_UP_FIELDS}</p>
		<div iw-flex-grid>

		<!-- White Labeling - Custom fields - Nickname -->
		{include inc_form}
			{	"name": "nickname",
				"label_toggle": "whitelabeling::nickname",
				"element_checkbox":
				[
					{	"name": "nickname_required",
						"label": "whitelabeling::required",
						"value": "required"
					}
				],
				"item_class": "row",
				"force_option": true
			}
		{/include}

		<!-- White Labeling - Custom fields - Company -->
		{include inc_form}
			{	"name": "company",
				"label_toggle": "whitelabeling::company",
				"element_checkbox":
				[
					{	"name": "company_required",
						"label": "whitelabeling::required",
						"value": "required"
					}
				],
				"item_class": "row",
				"force_option": true
			}
		{/include}

		<!-- White Labeling - Custom fields - Job -->
		{include inc_form}
			{	"name": "job",
				"label_toggle": "whitelabeling::job",
				"element_checkbox":
				[
					{	"name": "job_required",
						"label": "whitelabeling::required",
						"value": "required"
					}
				],
				"item_class": "row",
				"force_option": true
			}
		{/include}

		<!-- White Labeling - Custom fields - Profession -->
		{include inc_form}
			{	"name": "profession",
				"label_toggle": "whitelabeling::profession",
				"element_checkbox":
				[
					{	"name": "profession_required",
						"label": "whitelabeling::required",
						"value": "required"
					}
				],
				"item_class": "row",
				"force_option": true
			}
		{/include}

		<!-- White Labeling - Custom fields - Mobile phone -->
		{include inc_form}
			{	"name": "mobile_phone",
				"label_toggle": "whitelabeling::mobile_phone",
				"element_checkbox":
				[
					{	"name": "mobile_phone_required",
						"label": "whitelabeling::required",
						"value": "required"
					}
				],
				"item_class": "row",
				"force_option": true
			}
		{/include}

		<!-- White Labeling - Custom fields - Work phone -->
		{include inc_form}
			{	"name": "work_phone",
				"label_toggle": "whitelabeling::work_phone",
				"element_checkbox":
				[
					{	"name": "work_phone_required",
						"label": "whitelabeling::required",
						"value": "required"
					}
				],
				"item_class": "row",
				"force_option": true
			}
		{/include}

		<!-- White Labeling - Custom fields - Home phone -->
		{include inc_form}
			{	"name": "home_phone",
				"label_toggle": "whitelabeling::home_phone",
				"element_checkbox":
				[
					{	"name": "home_phone_required",
						"label": "whitelabeling::required",
						"value": "required"
					}
				],
				"item_class": "row",
				"force_option": true
			}
		{/include}

		<!-- White Labeling - Custom fields - IM -->
		{include inc_form}
			{	"name": "im",
				"label_toggle": "whitelabeling::im",
				"element_checkbox":
				[
					{	"name": "im_required",
						"label": "whitelabeling::required",
						"value": "required"
					}
				],
				"item_class": "row",
				"force_option": true
			}
		{/include}

		<!-- White Labeling - Custom fields - Gender -->
		{include inc_form}
			{	"name": "gender",
				"label_toggle": "whitelabeling::gender",
				"element_checkbox":
				[
					{	"name": "gender_required",
						"label": "whitelabeling::required",
						"value": "required"
					}
				],
				"item_class": "row",
				"force_option": true
			}
		{/include}

		<!-- White Labeling - Custom fields - Birthday -->
		{include inc_form}
			{	"name": "birthday",
				"label_toggle": "whitelabeling::birthday",
				"element_checkbox":
				[
					{	"name": "birthday_required",
						"label": "whitelabeling::required",
						"value": "required"
					}
				],
				"item_class": "row",
				"force_option": true
			}
		{/include}

		<!-- White Labeling - Custom fields - Homepage -->
		{include inc_form}
			{	"name": "homepage",
				"label_toggle": "whitelabeling::homepage",
				"element_checkbox":
				[
					{	"name": "homepage_required",
						"label": "whitelabeling::required",
						"value": "required"
					}
				],
				"item_class": "row",
				"force_option": true
			}
		{/include}

		</div>
	</div>

	<div iw-flex-cell class="form__block form__block--border" id="{anchor fb_two_step_verification}">
		<h4 class="form__block-title">{WHITELABELING::TWO_STEP_VERIFICATION}</h4>
		<p class="form__block-desc">{WHITELABELING_HELP::TWO_STEP_VERIFICATION}</p>
		<div iw-flex-grid>

		<!-- White Labeling - Login Screen - Two step verification -->
		{include inc_form}
			{	"element_dropdown": true,
				"name": "two_step_verification",
				"label_toggle": "whitelabeling::verification_method",
				"force_option": true
			}
		{/include}

		</div>
	</div>

	<div iw-flex-cell class="form__block form__block--border" id="{anchor fb_login_social_integration}">
		<h4 class="form__block-title">{WHITELABELING::SOCIAL_INTEGRATION}</h4>
		<p class="form__block-desc">{WHITELABELING_HELP::SOCIAL_INTEGRATION}</p>
		<div iw-flex-grid>

		<!-- White Labeling - Login Screen - FB URL of page -->
		{include inc_form}
			{	"element_input": true,
				"name": "facebook",
				"label_toggle": "whitelabeling::disable_facebook_integration",
				"input_placeholder": "whitelabeling::facebook_page_url",
				"force_option": true
			}
		{/include}

		<!-- White Labeling - Login Screen - Twitter page URL -->
		{include inc_form}
			{	"element_input": true,
				"name": "twitter",
				"label_toggle": "whitelabeling::disable_twitter_integration",
				"input_placeholder": "whitelabeling::twitter_page_url",
				"force_option": true
			}
		{/include}

		<!-- White Labeling - Login Screen - Linkedin page URL -->
		{include inc_form}
			{	"element_input": true,
				"name": "linkedin",
				"label_toggle": "whitelabeling::disable_linkedin_integration",
				"input_placeholder": "whitelabeling::linkedin_page_url",
				"force_option": true
			}
		{/include}

		</div>
	</div>

	</div>

</div>

<!-- White Labeling - Login screen - Preview -->
<div iw-flex-cell class="u-flexbox">
	<obj name="slider_login" type="obj_slider">
		<value>obj_whitelabeling_slider_login</value>
	</obj>
</div>
</div>


<!-- White Labeling - WebClient -->
<div iw-flex-grid="query 2 double-padding" class="form__section" id="{anchor fs_wc_skin}">
<div iw-flex-cell>

	<h3 class="box-content-title gamma">{WHITELABELING::WC_SKIN}</h3>
	<p class="box-content-desc">{WHITELABELING_HELP::WC_SKIN}</p>

	<div iw-flex-grid>

	<div iw-flex-cell class="form__block form__block--border" id="{anchor fb_wc_skin_default}">
		<div iw-flex-grid>

		<!-- White Labeling - WebClient - Default -->
		{include inc_form}
			{	"element_button": true,
				"name": "wc_default",
				"button_value": "whitelabeling::use_default"
			}
		{/include}

		</div>
	</div>

	<div iw-flex-cell class="form__block form__block--border" id="{anchor fb_wc_page_title}">
		<h4 class="form__block-title">{WHITELABELING::PAGE_TITLE}</h4>
		<p class="form__block-desc">{WHITELABELING_HELP::PAGE_TITLE}</p>
		<div iw-flex-grid>

		<!-- White Labeling - WebClient - Page title -->
		{include inc_form}
			{	"element_input": true,
				"name": "wc_page_title",
				"label_text": "{WHITELABELING::PAGE_TITLE}",
				"input_placeholder": "whitelabeling::page_title",
				"force_option": true
			}
		{/include}

		</div>
	</div>

	<div iw-flex-cell class="form__block form__block--border" id="{anchor fb_wc_skin_style}">
		<h4 class="form__block-title">{WHITELABELING::SKIN_STYLE}</h4>
		<p class="form__block-desc">{WHITELABELING_HELP::WC_SKIN_STYLE}</p>
		<div iw-flex-grid>

		<!-- White Labeling - WebClient - Skin -->
		{include inc_form}
			{	"element_dropdown": true,
				"name": "wc_skin",
				"label_text": "{WHITELABELING::SKIN}",
				"force_option": true
			}
		{/include}

		<!-- White Labeling - WebClient - Colorpicker -->
		{include inc_form}
			{	"element_colorpicker": [
					"default", "blue", "red", "green", "orange", "graphite", "black", "brown", "yellow", "pink"
				],
				"name": "wc_colorpicker",
				"label_text": "{WHITELABELING::SKIN_STYLE}",
				"force_option": true
			}
		{/include}

		</div>
	</div>

	</div>

</div>

<!-- White Labeling - WebClient - Preview -->
<div iw-flex-cell class="u-flexbox">
	<obj name="slider_webmail_skin" type="obj_slider">
		<value>obj_whitelabeling_slider_webclient_skin</value>
	</obj>
</div>
</div>


<!-- White Labeling - WebAdmin -->
<div iw-flex-grid="query 2 double-padding" class="form__section" id="{anchor fs_wa_skin}">
<div iw-flex-cell>

	<h3 class="box-content-title gamma">{WHITELABELING::WA_SKIN}</h3>
	<p class="box-content-desc">{WHITELABELING_HELP::WA_SKIN}</p>

	<div iw-flex-grid>

	<div iw-flex-cell class="form__block form__block--border" id="{anchor fb_wa_default}">
		<div iw-flex-grid>

		<!-- White Labeling - WebAdmin - Default -->
		{include inc_form}
			{	"element_button": true,
				"name": "wa_default",
				"button_value": "whitelabeling::use_default"
			}
		{/include}

		</div>
	</div>

	<div iw-flex-cell class="form__block form__block--border" id="{anchor fb_wa_page_title}">
		<h4 class="form__block-title">{WHITELABELING::PAGE_TITLE}</h4>
		<p class="form__block-desc">{WHITELABELING_HELP::PAGE_TITLE}</p>
		<div iw-flex-grid>

		<!-- White Labeling - WebAdmin - Page title -->
		{include inc_form}
			{	"element_input": true,
				"name": "wa_page_title",
				"label_text": "{WHITELABELING::PAGE_TITLE}",
				"input_placeholder": "whitelabeling::page_title",
				"force_option": true
			}
		{/include}

		</div>
	</div>

	<div iw-flex-cell class="form__block form__block--border" id="{anchor fb_wa_skin_style}">
		<h4 class="form__block-title">{WHITELABELING::SKIN_STYLE}</h4>
		<p class="form__block-desc">{WHITELABELING_HELP::WA_SKIN_STYLE}</p>
		<div iw-flex-grid>

		<!-- White Labeling - WebAdmin - Colorpicker -->
		{include inc_form}
			{	"element_colorpicker": [
					"default", "shocking-blue", "green-day", "code-orange", "peaches", "yellow-submarine"
				],
				"name": "wa_colorpicker",
				"label_text": "{WHITELABELING::SKIN_STYLE}",
				"force_option": true
			}
		{/include}

		</div>
	</div>

	</div>

</div>

<!-- White Labeling - WebAdmin - Preview  -->
<div iw-flex-cell class="u-flexbox">
	<obj name="slider_webadmin" type="obj_slider" css="hide">
		<value>obj_whitelabeling_slider_webadmin</value>
	</obj>
</div>
</div>


<!-- White Labeling - IceChat -->
<div iw-flex-grid="query 2 double-padding" class="form__section icechat" id="{anchor fs_ic_skin}">
<div iw-flex-cell>

	<h3 class="box-content-title gamma">{WHITELABELING::IC_SKIN}</h3>
	<p class="box-content-desc">{WHITELABELING_HELP::LOGIN_SKIN}</p>

	<div iw-flex-grid>

	<div iw-flex-cell class="form__block form__block--border" id="{anchor fb_ic_skin_default}">
		<div iw-flex-grid>

		<!-- White Labeling - IceChat - Default -->
		{include inc_form}
			{	"element_button": true,
				"name": "ic_default",
				"button_value": "whitelabeling::use_default"
			}
		{/include}

		</div>
	</div>

	<div iw-flex-cell class="form__block form__block--border" id="{anchor fb_ic_skin_style}">
		<h4 class="form__block-title">{WHITELABELING::SKIN_STYLE}</h4>
		<p class="form__block-desc">{WHITELABELING_HELP::LOGIN_SKIN_STYLE}</p>
		<div iw-flex-grid>

		<!-- White Labeling - IceChat - Colorpicker -->
		{include inc_form}
			{	"element_colorpicker": [
					"default", "red", "green", "orange", "graphite", "black", "brown", "yellow", "blue", "pink"
				],
				"name": "ic_colorpicker",
				"label_text": "{WHITELABELING::SKIN_STYLE}",
				"force_option": true
			}
		{/include}

		</div>
	</div>

	<div iw-flex-cell class="form__block form__block--border" id="{anchor fb_ic_background_image}">
		<h4 class="form__block-title">{WHITELABELING::BACKGROUND_IMG}</h4>
		<p class="form__block-desc">{WHITELABELING_HELP::LOGIN_BACKGROUND}</p>
		<div iw-flex-grid>

		<!-- White Labeling - IceChat - Upload custom background -->
		{include inc_form}
			{	"element_upload": true,
				"button_class": "text  primary  icon-arrow-up",
				"name": "ic_upload_image",
				"button_value": "whitelabeling::upload_custom_background",
				"force_option": true
			}
		{/include}

		<!-- White Labeling - IceChat - Background image -->
		{include inc_form}
			{	"element_imagepicker": [
					{	"color": "default",
						"index": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
					}
				],
				"color": "default",
				"name": "ic_background_image",
				"label_text": "{WHITELABELING::CHOOSE_IMAGE}",
				"force_option": true
			}
		{/include}

		<!-- White Labeling - IceChat - Background image (Hidden input) -->
		{include inc_form}
			{	"element_input": true,
				"input_type": "hidden",
				"item_class": "hide",
				"name": "ic_background_image_input",
				"force_option": true
			}
		{/include}

		</div>
	</div>

	</div>

</div>

<!-- White Labeling - IceChat - Preview -->
<div iw-flex-cell class="u-flexbox">
	<obj name="slider_icechat_skin" type="obj_slider" css="slider--mobile">
		<value>obj_whitelabeling_slider_icechat_skin</value>
	</obj>
</div>
</div>


<!-- White Labeling - Banners -->
<div iw-flex-grid="query 2 double-padding" class="form__section" id="{anchor fs_banners}">
<div iw-flex-cell>

	<h3 class="box-content-title gamma">{WHITELABELING::BANNERS}</h3>
	<p class="box-content-desc">{WHITELABELING_HELP::BANNERS}</p>

	<div iw-flex-grid>

	<!-- White Labeling - Banners - AdSense settings -->
	{include inc_form}
		{	"element_input": true,
			"name": "adsense",
			"label_toggle": "whitelabeling::adsense_settings",
			"input_placeholder": "whitelabeling::adsense_customer_id",
			"description": "{WHITELABELING_HELP::ADSENSE_SETTINGS}",
			"force_option": true
		}
	{/include}

	<!-- White Labeling - Banners - Login banners -->
	<div iw-flex-cell class="form__block form__block--border" id="{anchor fb_login_banners}">
		<h4 class="form__block-title">{WHITELABELING::LOGIN_BANNERS}</h4>
		<p class="form__block-desc">{WHITELABELING_HELP::LOGIN_BANNERS}</p>
		<div iw-flex-grid>

		<!-- White Labeling - Banners - Login banners - Desktop - Banner type -->
		{include inc_form}
			{	"element_radio":
				[
					{	"name": "banner_desktop",
						"label": "whitelabeling::banner_none",
						"value": "none"
					},
					{	"name": "banner_desktop_url",
						"label": "whitelabeling::banner_url",
						"value": "url"
					},
					{	"name": "banner_desktop_code",
						"label": "whitelabeling::banner_code",
						"value": "code"
					}
				],
				"name": "banner_desktop_type",
				"label_text": "{WHITELABELING::DESKTOP_BANNER_TYPE}",
				"force_option": true
			}
		{/include}

		<!-- White Labeling - Banners - Login banners - Desktop - Banner image -->
		{include inc_form}
			{	"element_input": true,
				"name": "banner_desktop_url",
				"input_placeholder": "whitelabeling::banner_url",
				"description": "{WHITELABELING_HELP::BANNER_URL}"
			}
		{/include}

		<!-- White Labeling - Banners - Login banners - Desktop - Banner code -->
		{include inc_form}
			{	"element_input": true,
				"name": "banner_desktop_code",
				"input_placeholder": "whitelabeling::adsense_slot_id",
				"description": "{WHITELABELING_HELP::BANNER_CODE}"
			}
		{/include}

		<!-- White Labeling - Banners - Login banners - Mobile - Banner type -->
		{include inc_form}
			{	"element_radio":
				[
					{	"name": "banner_mobile",
						"label": "whitelabeling::banner_none",
						"value": "none"
					},
					{	"name": "banner_mobile_url",
						"label": "whitelabeling::banner_url",
						"value": "url"
					},
					{	"name": "banner_mobile_code",
						"label": "whitelabeling::banner_code",
						"value": "code"
					}
				],
				"name": "banner_mobile_type",
				"label_text": "{WHITELABELING::MOBILE_BANNER_TYPE}",
				"force_option": true
			}
		{/include}

		<!-- White Labeling - Banners - Login banners - Mobile - Banner image -->
		{include inc_form}
			{	"element_input": true,
				"name": "banner_mobile_url",
				"input_placeholder": "whitelabeling::banner_url",
				"description": "{WHITELABELING_HELP::BANNER_URL}"
			}
		{/include}

		<!-- White Labeling - Banners - Login banners - Mobile - Banner code -->
		{include inc_form}
			{	"element_input": true,
				"name": "banner_mobile_code",
				"input_placeholder": "whitelabeling::adsense_slot_id",
				"description": "{WHITELABELING_HELP::BANNER_CODE}"
			}
		{/include}

		</div>
	</div>

	<!-- White Labeling - Banners - WebClient banners -->
	<div iw-flex-cell class="form__block form__block--border" id="{anchor fb_wc_banners}">
		<h4 class="form__block-title">{WHITELABELING::WEBCLIENT_BANNERS}</h4>
		<p class="form__block-desc">{WHITELABELING_HELP::WEBCLIENT_BANNERS}</p>
		<div iw-flex-grid>

		<!-- White Labeling - Banners - WebClient banners - Top banner - Banner type -->
		{include inc_form}
			{	"element_radio":
				[
					{	"name": "banner_top",
						"label": "whitelabeling::banner_none",
						"value": "none"
					},
					{	"name": "banner_top_url",
						"label": "whitelabeling::banner_url",
						"value": "url"
					},
					{	"name": "banner_top_code",
						"label": "whitelabeling::banner_code",
						"value": "code"
					}
				],
				"name": "banner_top_type",
				"label_text": "{WHITELABELING::TOP_BANNER_TYPE}",
				"force_option": true
			}
		{/include}

		<!-- White Labeling - Banners - WebClient banners - Top banner - Banner image -->
		{include inc_form}
			{	"element_input": true,
				"name": "banner_top_url",
				"input_placeholder": "whitelabeling::banner_url",
				"description": "{WHITELABELING_HELP::BANNER_URL}"
			}
		{/include}

		<!-- White Labeling - Banners - WebClient banners - Top banner - Banner code -->
		{include inc_form}
			{	"element_input": true,
				"name": "banner_top_code",
				"input_placeholder": "whitelabeling::adsense_slot_id",
				"description": "{WHITELABELING_HELP::BANNER_CODE}"
			}
		{/include}

		<!-- White Labeling - Banners - WebClient banners - Bottom banner - Banner type -->
		{include inc_form}
			{	"element_radio":
				[
					{	"name": "banner_bottom",
						"label": "whitelabeling::banner_none",
						"value": "none"
					},
					{	"name": "banner_bottom_url",
						"label": "whitelabeling::banner_url",
						"value": "url"
					},
					{	"name": "banner_bottom_code",
						"label": "whitelabeling::banner_code",
						"value": "code"
					}
				],
				"name": "banner_bottom_type",
				"label_text": "{WHITELABELING::BOTTOM_BANNER_TYPE}",
				"force_option": true
			}
		{/include}

		<!-- White Labeling - Banners - WebClient banners - Bottom banner - Banner image -->
		{include inc_form}
			{	"element_input": true,
				"name": "banner_bottom_url",
				"input_placeholder": "whitelabeling::banner_url",
				"description": "{WHITELABELING_HELP::BANNER_URL}"
			}
		{/include}

		<!-- White Labeling - Banners - WebClient banners - Bottom banner - Banner code -->
		{include inc_form}
			{	"element_input": true,
				"name": "banner_bottom_code",
				"input_placeholder": "whitelabeling::adsense_slot_id",
				"description": "{WHITELABELING_HELP::BANNER_CODE}"
			}
		{/include}

		</div>
	</div>

	</div>

</div>

</div>

<!-- White Labeling - Conferencing screen -->
<div iw-flex-grid="query 2 double-padding" class="form__section" id="{anchor fs_conferencing}">
<div iw-flex-cell>

	<h3 class="box-content-title gamma">{WHITELABELING::CONFERENCING}</h3>
	<p class="box-content-desc">{WHITELABELING_HELP::CONFERENCING}</p>

	<div iw-flex-grid>

	<div iw-flex-cell class="form__block form__block--border" id="{anchor fb_conferencing_logo}">
		<h4 class="form__block-title">{WHITELABELING::CONFERENCING_LOGO}</h4>
		<p class="form__block-desc">{WHITELABELING_HELP::CONFERENCING_LOGO}</p>
		<div iw-flex-grid>

		<!-- White Labeling - Conferencing Screen - Conferencing logo -->
		{include inc_form}
			{	"element_upload": true,
				"button_class": "text primary",
				"name": "jitsi_logo_file",
				"force_option": true
			}
		{/include}

		<!-- White Labeling - Conferencing Screen - Logo image (Hidden input) -->
		{include inc_form}
			{	"element_input": true,
				"input_type": "hidden",
				"item_class": "hide",
				"name": "jitsi_logo_image_input",
				"force_option": true
			}
		{/include}

		</div>
	</div>

	</div>

</div>

</div>
