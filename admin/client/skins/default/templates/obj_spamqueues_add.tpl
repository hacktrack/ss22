<div>
<div iw-flex-grid>

<!-- Spam Queues - Add - Sender -->
<div iw-flex-cell id="{anchor fi_filter_sender}" class="form-item">
	<div class="form-label">
		<label class="label">{SPAMQUEUES_HEADER::SENDER}</label>
	</div>
	<div class="form-row">
		<obj name="input_sender" type="obj_input_text" tabindex="true">
			<placeholder>spamqueues_header::sender</placeholder>
		</obj>
	</div>
</div>

<!-- Spam Queues - Add - Owner -->
<div iw-flex-cell id="{anchor fi_filter_owner}" class="form__item">
	<label class="label form__label" title="{SPAMQUEUES_HEADER::OWNER}">
		<span class="label__text">{SPAMQUEUES_HEADER::OWNER}</span>
	</label>
	<obj name="button_filter_domain" type="obj_button" css="form__element form__group-right inner-button icon icon-user small" tabindex="true"></obj>
	<obj name="input_owner" type="obj_input_text" tabindex="true" css="form__element form__group-left">
		<placeholder>spamqueues_header::owner</placeholder>
	</obj>
</div>

</div>
</div>
