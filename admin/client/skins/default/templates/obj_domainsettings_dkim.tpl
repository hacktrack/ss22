<!-- White Labeling - Login screen -->
<div iw-flex-grid= class="form__section" id="{anchor fs_dkim}">
<div iw-flex-cell>

	<h3 class="box-content-title gamma">{DKIM::WIZARD}</h3>
	<p class="box-content-desc">{DKIM_HELP::WIZARD}</p>

	<div iw-flex-grid>
	<div iw-flex-cell class="form__block" id="{anchor fb_dkim_steps}">

		<ul class="steps u-margin-top u-margin-bottom-neg">
			<li class="steps__item"></li>
			<li class="steps__item"></li>
			<li class="steps__item"></li>
		</ul>

	</div>
	<div iw-flex-cell is-hidden="1" class="form__block" id="{anchor fb_dkim_loader}">

		<div class="text-center">
			<img src="client/skins/default/images/loading/loader.gif" alt="loading..." title="Loading animation">
			<label class="label">{DKIM::LOADING}</label>
		</div>

	</div>
	<div iw-flex-cell is-hidden="1" class="form__block" id="{anchor fb_dkim_academy}">

		<div class="card card--legend">
			<legend class="card__legend"><span class="icon-hat"></span>Academy</legend>
			<div iw-flex-grid="query 2">

			<div iw-flex-cell class="u-margin-vertical">
				<a class="card__media" href="http://www.icewarp.com/academy-video/dkim/" target="_blank" rel="noopener noreferrer">
					<img src="client/skins/default/images/academy/zone-file.jpg" alt="{DKIM::ACADEMY_CAPTION}" title="{DKIM::ACADEMY_CAPTION}">
					<p class="card__media-text">{DKIM::ACADEMY_CAPTION}</p>
				</a>
			</div>
			<div iw-flex-cell class="u-margin-vertical">
				<div class="card__text">
					<h3 class="card__title">{DKIM::ACADEMY_TITLE}</h3>
					<p class="card__text-info">{DKIM::ACADEMY_TEXT}</p>
				</div>
			</div>

			</div>
		</div>

	</div>
	<div iw-flex-cell is-hidden="1" class="form__block" id="{anchor fb_dkim_selector}">
		<h4 class="form__block-title">{DKIM::DOMAIN_KEY_SELECTOR}</h4>
		<p class="form__block-desc">{DKIM_HELP::DOMAIN_KEY_SELECTOR}</p>
		<div iw-flex-grid>

		<!-- DKIM - Selector -->
		{include inc_form}
			{	"element_input": true,
				"input_placeholder": "DKIM::SELECTOR_PLACEHOLDER",
				"name": "selector",
				"label_text": "{DKIM::SELECTOR}"
			}
		{/include}

		</div>

	</div>
	<div iw-flex-cell is-hidden="1" class="form__block" id="{anchor fb_dkim_selector_record}">
		<h4 class="form__block-title">{DKIM::SELECTOR_RECORD}</h4>
		<p class="form__block-desc">{DKIM_HELP::SELECTOR_RECORD}</p>
		<div iw-flex-grid>

		<!-- DKIM - Selector record -->
		{include inc_form}
			{	"element_input": true,
				"input_readonly": true,
				"name": "record",
				"label_text": "{DKIM::SELECTOR_HOST}",
				"label_button": true,
				"label_button_value": "generic::copy_to_clipboard"
			}
		{/include}

		{include inc_form}
			{	"element_textarea": true,
				"textarea_readonly": true,
				"name": "key",
				"label_text": "{DKIM::SELECTOR_RECORD}",
				"label_button": true,
				"label_button_value": "generic::copy_to_clipboard"
			}
		{/include}

		<!-- DKIM - Sign outgoing mails with DKIM -->
		{include inc_form}
			{	"name": "sign_outgoing_mails",
				"label_toggle": "dkim::sign_outgoing_mails"
			}
		{/include}

		</div>

	</div>
	</div>

</div>
</div>


