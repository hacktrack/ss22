{optional sendmessage}
<!-- Rulecard - Modal - Message - From -->
<div id="{anchor fi_from}" class="form-item">
	<div class="form-label">
		<label class="label">{RULEPOPUP::FROM}</label>
	</div>
	<div class="form-row">
		<div iw-flex-grid="fit group">
		<div iw-flex-cell>
			<obj name="input_from" type="obj_input_email" tabindex="true" css="group-left">
				<placeholder>rulepopup::from</placeholder>
			</obj>
		</div>
		<div iw-flex-cell="none">
			<obj name="button_from" type="obj_button" css="icon icon-folder small group-right inner-button" tabindex="true"></obj>
		</div>
		</div>
	</div>
</div>

<!-- Rulecard - Modal - Message - To -->
<div id="{anchor fi_to}" class="form-item">
	<div class="form-label">
		<label class="label">{RULEPOPUP::TO}</label>
	</div>
	<div class="form-row">
		<div iw-flex-grid="fit group">
		<div iw-flex-cell>
			<obj name="input_to" type="obj_input_email" tabindex="true" css="group-left">
				<placeholder>rulepopup::to</placeholder>
			</obj>
		</div>
		<div iw-flex-cell="none">
			<obj name="button_to" type="obj_button" css="icon icon-folder small group-right inner-button" tabindex="true"></obj>
		</div>
		</div>
	</div>
</div>

<!-- Rulecard - Modal - Message - Subject -->
<div id="{anchor fi_subject}" class="form-item">
	<div class="form-label">
		<label class="label">{RULEPOPUP::SUBJECT}</label>
	</div>
	<div class="form-row">
		<obj name="input_subject" type="obj_input_text" tabindex="true">
			<placeholder>rulepopup::subject</placeholder>
		</obj>
	</div>
</div>

<!-- Rulecard - Modal - Message - Text -->
<div id="{anchor fi_text}" class="form-item">
	<div class="form-label">
		<obj name="radio_text" type="obj_radio" group="message" tabindex="true">
			<label>rulepopup::text</label>
		</obj>
	</div>
	<div class="form-row large">
		<obj name="textarea_text" type="obj_textarea" tabindex="true">
			<placeholder>rulepopup::text</placeholder>
		</obj>
	</div>
</div>

{/optional}

{optional header}
<!-- Rulecard - Component - Header - Table -->
<div class="obj_messageheader u-flexit">
	<obj name="list" type="obj_loadable">
		<label>obj_messageheader_header</label>
		<value>obj_messageheader_item</value>
	</obj>
	<obj name="btn_add" type="obj_button" css="text primary full context" tabindex="true">
		<value>rulepopup::add_new_header_condition</value>
	</obj>
</div>

{/optional}

{optional header_add}
<!-- Rulecard - Component - Header - Add item -->
<div>
<!-- Rulecard - Component - Header - Action -->
<div id="{anchor fi_action}" class="form-item">
	<div class="form-label">
		<label class="label">{RULEPOPUP::ACTION}</label>
	</div>
	<div class="form-row">
		<obj name="dropdown_action" type="obj_dropdown_single" tabindex="true"></obj>
	</div>
</div>

<!-- Rulecard - Modal - Header - Header -->
<div id="{anchor fi_header}" class="form-item">
	<div class="form-label">
		<label class="label">{RULEPOPUP::HEADER}</label>
	</div>
	<div class="form-row">
		<obj name="input_header" type="obj_input_text" tabindex="true" css="group-left">
			<placeholder>rulepopup::header</placeholder>
		</obj>
	</div>
</div>

<!-- Rulecard - Modal - Header - Regex -->
<div id="{anchor fi_regex}" class="form-item">
	<div class="form-label">
		<obj name="toggle_regex" type="obj_toggle" tabindex="true">
			<toggle>regex</toggle>
			<label>rulepopup::match_regex</label>
		</obj>
	</div>
	<div class="form-row" id="{anchor regex}" is-hidden="1">
		<obj name="input_regex" type="obj_input_text" tabindex="true">
			<placeholder>rulepopup::regex</placeholder>
		</obj>
	</div>
</div>

<!-- Rulecard - Modal - Header - Value -->
<div id="{anchor fi_value}" class="form-item">
	<div class="form-label">
		<label class="label">{RULEPOPUP::VAL}</label>
	</div>
	<div class="form-row">
		<obj name="input_value" type="obj_input_text" tabindex="true">
			<placeholder>rulepopup::val</placeholder>
		</obj>
	</div>
</div>
</div>
{/optional}
