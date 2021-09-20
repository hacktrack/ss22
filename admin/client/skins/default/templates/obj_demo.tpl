<h3 class="box-content-title gamma">Includes</h3>
<p class="box-content-desc">Lorem lean startup ipsum product market fit customer development acquihire technical cofounder.</p>
<div iw-flex-grid="query 2 double-padding" class="form-block">

<!-- Input bytes -->
{include inc_form}
	{	"element_input_bytes": true,
		"name": "disabling_test",
		"label_toggle": "{ACCOUNTDETAIL::ACCOUNT_QUOTE_ENABLED}",
		"toggle_element": "input"
	}
{/include}

<!-- Row orientation -->
{include inc_form}
	{	"label_text": "{ACCOUNTDETAIL::ACCOUNT_QUOTE_ENABLED}",
		"name": "row_orientation",
		"element_button": true,
		"button_value": "Zóna lásky",
		"item_class": "margin row"
	}
{/include}

<!-- Input dropdown with toggle -->
{include inc_form}
	{	"element_input": true,
		"name": "input_dropdown_with_toggle",
		"input_type": "number",
		"label_toggle": "{ACCOUNTDETAIL::ACCOUNT_QUOTE_ENABLED}",
		"append_dropdown": true
	}
{/include}

<!-- Input inner button -->
{include inc_form}
	{	"element_input": true,
		"name": "input_inner_button",
		"input_type": "text",
		"label_text": "{ACCOUNTDETAIL::ACCOUNT_QUOTE_ENABLED}",
		"inner_button": true,
		"button_class": "text",
		"button_value": "accountdetail::account_quote_enabled"
	}
{/include}

<!-- Input append button -->
{include inc_form}
	{	"element_input": true,
		"name": "input_append_button",
		"input_type": "text",
		"label_text": "{ACCOUNTDETAIL::ACCOUNT_QUOTE_ENABLED}",
		"append_button": true,
		"button_class": "text  primary  icon-arrow-up",
		"button_value": "generic::upload_photo"
	}
{/include}

<!-- Input with inner label -->
{include inc_form}
	{	"element_input": true,
		"name": "input_with_inner_label",
		"input_type": "text",
		"label_text": "{ACCOUNTDETAIL::ACCOUNT_QUOTE_ENABLED}",
		"input_placeholder": "accountdetail::account_quote_enabled",
		"input_label": "Zóna lásky"
	}
{/include}

<!-- Dropdown with toggle -->
{include inc_form}
	{	"element_dropdown": true,
		"name": "dropdown_with_toggle",
		"label_toggle": "{ACCOUNTDETAIL::ACCOUNT_QUOTE_ENABLED}",
		"force_option": true
	}
{/include}

<!-- Toggle -->
{include inc_form}
	{	"name": "toggle",
		"label_toggle": "{ACCOUNTDETAIL::ACCOUNT_QUOTE_ENABLED}",
		"force_option": true
	}
{/include}

<!-- Text -->
{include inc_form}
	{	"label_text": "{ACCOUNTDETAIL::ACCOUNT_QUOTE_ENABLED}",
		"name": "text",
		"element_text": true,
		"text_value": "Zóna lásky"
	}
{/include}

<!-- Textarea -->
{include inc_form}
	{	"element_textarea": true,
		"name": "textarea",
		"label_text": "{ACCOUNTDETAIL::ACCOUNT_QUOTE_ENABLED}"
	}
{/include}


<div iw-flex-cell>
	<div iw-flex-grid>

		<!-- Toggle -->
		{include inc_form}
			{	"name": "toggle_1",
				"label_toggle": "{ACCOUNTDETAIL::ACCOUNT_QUOTE_ENABLED}"
			}
		{/include}
		{include inc_form}
			{	"name": "toggle_2",
				"label_toggle": "{ACCOUNTDETAIL::ACCOUNT_QUOTE_ENABLED}"
			}
		{/include}
		{include inc_form}
			{	"name": "toggle_3",
				"label_toggle": "{ACCOUNTDETAIL::ACCOUNT_QUOTE_ENABLED}",
				"hidden": true
			}
		{/include}

	</div>
</div>

<!-- Input with button -->
{include inc_form}
	{	"element_input": true,
		"element_button": true,
		"button_class": "text  primary  icon-arrow-up",
		"button_value": "generic::upload_photo",
		"name": "input_with_button",
		"label_text": "{ACCOUNTDETAIL::ACCOUNT_QUOTE_ENABLED}",
		"input_placeholder": "accountdetail::account_quote_enabled"
	}
{/include}

</div>


<h3 class="box-content-title gamma">Toggle</h3>
<p class="box-content-desc">Lorem lean startup ipsum product market fit customer development acquihire technical cofounder.</p>
<div iw-flex-grid="query 2" class="form-block">

{include inc_form}
	{	"label_toggle": "Label with toggle",
		"name": "default"
	}
{/include}

{include inc_form}
	{	"label_toggle": "Disabled label with toggle",
		"toggle_disabled": true,
		"name": "disabled"
	}
{/include}

{include inc_form}
	{	"element_input": true,
		"label_toggle": "Label with toggle on an input",
		"name": "on_input"
	}
{/include}

</div>


<h3 class="box-content-title gamma">Radio</h3>
<p class="box-content-desc">Lorem lean startup ipsum product market fit customer development acquihire technical cofounder.</p>
<div iw-flex-grid="query 2" class="form-block">

<!-- Demo - Radio -->
{include inc_form}
	{	"element_radio":
		[
			{	"name": "radio1",
				"label": "radio1"
			},
			{	"name": "radio2",
				"label": "radio2"
			},
			{	"name": "radio3",
				"label": "radio3",
				"disabled": true
			}
		],
		"name": "demo_radio",
		"label_text": "Radio label"
	}
{/include}

<!-- Demo - Radio -->
{include inc_form}
	{	"element_radio":
		[
			{	"name": "radio4",
				"label": "radio4"
			},
			{	"name": "radio5",
				"label": "radio5"
			},
			{	"name": "radio6",
				"label": "radio6",
				"disabled": true
			}
		],
		"name": "demo_radio2",
		"label_text": "Radio label",
		"radio_class": "radio--block"
	}
{/include}

<!-- Demo - Colorpicker -->
{include inc_form}
	{	"element_colorpicker": [
			"default", "green-day", "code-orange", "peaches", "yellow-submarine", "deep-purple"
		],
		"name": "demo_colorpicker",
		"label_text": "Color picker radio"
	}
{/include}

</div>


<h3 class="box-content-title gamma">Checkbox</h3>
<p class="box-content-desc">Lorem lean startup ipsum product market fit customer development acquihire technical cofounder.</p>
<div iw-flex-grid="query 2" class="form-block">

<!-- Demo - Checkbox -->
{include inc_form}
	{	"element_checkbox":
		[
			{	"name": "checkbox1",
				"label": "checkbox1"
			},
			{	"name": "checkbox2",
				"label": "checkbox2"
			},
			{	"name": "checkbox3",
				"label": "checkbox3",
				"disabled": true
			}
		],
		"name": "demo_checkbox",
		"label_text": "Checkbox label"
	}
{/include}

<!-- Demo - Checkbox -->
{include inc_form}
	{	"element_checkbox":
		[
			{	"name": "checkbox4",
				"label": "checkbox4"
			},
			{	"name": "checkbox5",
				"label": "checkbox5"
			},
			{	"name": "checkbox6",
				"label": "checkbox6",
				"disabled": true
			}
		],
		"name": "demo_checkbox2",
		"label_text": "checkbox label",
		"checkbox_class": "checkbox--block"
	}
{/include}

</div>


<h3 class="box-content-title gamma">Icons</h3>
<p class="box-content-desc">Lorem lean startup ipsum product market fit customer development acquihire technical cofounder.</p>
<div iw-flex-grid class="form-block">

<div iw-flex-cell>

	{include inc_icon}
		{	"icon":
			[
				"add", "administrator", "arrow-back", "arrow-forward", "arrow-up", "arrow-down", "card", "close", "collaboration", "dashboard", "delete-circle", "dropup-arrow", "email", "expiration", "folder", "icewarp-logo", "licenses", "limits", "mailing-list", "menu", "mobile", "pause-circle", "plus-circle", "resources", "rules", "search-circle", "security", "sent", "server", "services", "settings", "storage", "support-circle", "terminal-circle", "user", "administrator_domain", "outlook_sync", "icewarp_desktop", "devices", "checkmark", "xmark", "hyphen", "user_default", "home", "facebook", "twitter", "linkedin", "apple", "android", "blackberry", "windows", "info", "warning", "logout", "spam", "journal", "documents", "notes", "webmail-circle", "edit-circle", "terminal", "webclient", "support", "dropdown-arrow", "search"
			]
		}
	{/include}
	<br>
	{include inc_icon}
		{"icon": ["to-all-users"]}
	{/include}
	<br>
	{include inc_icon}
		{"icon": ["to-folder"]}
	{/include}

</div>

</div>


<h3 class="box-content-title gamma">Bubbles</h3>
<p class="box-content-desc">Lorem lean startup ipsum product market fit customer development acquihire technical cofounder.</p>
<div iw-flex-grid="query 2" class="form-block">

{include inc_form}
	{	"element_input": true,
		"name": "left_top_primary_bubble",
		"label_text": "Left top primary bubble",
		"description": "&lt;div class=&quot;bubble top left primary is-visible&quot;&gt;<br>&nbsp;&nbsp;&nbsp;&nbsp;&lt;span&gt;I'm a left top primary bubble&lt;/span&gt;<br>&lt;/div&gt;"
	}
{/include}

{include inc_form}
	{	"element_input": true,
		"name": "right_top_warning_bubble",
		"label_text": "Right top warning bubble",
		"description": "&lt;div class=&quot;bubble top right warning is-visible&quot;&gt;<br>&nbsp;&nbsp;&nbsp;&nbsp;&lt;span&gt;I'm a left top warning bubble&lt;/span&gt;<br>&lt;/div&gt;"
	}
{/include}

{include inc_form}
	{	"element_input": true,
		"name": "left_bottom_error_bubble",
		"label_text": "Left bottom error bubble",
		"description": "&lt;div class=&quot;bubble bottom left error is-visible&quot;&gt;<br>&nbsp;&nbsp;&nbsp;&nbsp;&lt;span&gt;I'm a left bottom error bubble&lt;/span&gt;<br>&lt;/div&gt;"
	}
{/include}

{include inc_form}
	{	"element_input": true,
		"name": "right_bottom_success_bubble",
		"label_text": "Right bottom success bubble",
		"description": "&lt;div class=&quot;bubble bottom right success is-visible&quot;&gt;<br>&nbsp;&nbsp;&nbsp;&nbsp;&lt;span&gt;I'm a right bottom success bubble&lt;/span&gt;<br>&lt;/div&gt;"
	}
{/include}

</div>


<h3 class="box-content-title gamma">Selector</h3>
<p class="box-content-desc">Lorem lean startup ipsum product market fit customer development acquihire technical cofounder.</p>
<div iw-flex-grid="2 query" class="form-block">

<div iw-flex-cell class="form__item">
	<obj name="actionselect_1" type="obj_actionselect" css="form__element">
		<value>Actionselect</value>
	</obj>
</div>
<div iw-flex-cell class="form__item">
	<obj name="actionselect_0" type="obj_actionselect" css="form__element" button_css="icon secondary small icon-menu"></obj>
</div>

</div>


<h3 class="box-content-title gamma">Modal</h3>
<p class="box-content-desc">Lorem lean startup ipsum product market fit customer development acquihire technical cofounder.</p>
<div iw-flex-grid="none" class="form-block">

{include inc_form}
	{	"element_button": true,
		"button_class": "text primary",
		"button_value": "Account picker",
		"name": "_9"
	}
{/include}

{include inc_form}
	{	"element_button": true,
		"button_class": "text secondary",
		"button_value": "Create new account",
		"name": "create_new_account"
	}
{/include}

{include inc_form}
	{	"element_button": true,
		"button_class": "text error",
		"button_value": "Show error (unique)",
		"name": "show_error_unique"
	}
{/include}

{include inc_form}
	{	"element_button": true,
		"button_class": "text error",
		"button_value": "Show error (not unique)",
		"name": "show_error"
	}
{/include}

{include inc_form}
	{	"element_button": true,
		"button_class": "text warning",
		"button_value": "Show warning",
		"name": "show_warning"
	}
{/include}

{include inc_form}
	{	"element_button": true,
		"button_class": "text success",
		"button_value": "Show success",
		"name": "show_success"
	}
{/include}

{include inc_form}
	{	"element_button": true,
		"button_class": "text secondary",
		"button_value": "Show toast",
		"name": "show_toast"
	}
{/include}

</div>


<h3 class="box-content-title gamma">Bar</h3>
<p class="box-content-desc">Lorem lean startup ipsum product market fit customer development acquihire technical cofounder.</p>
<div iw-flex-grid="query 2" class="form-block">

	<div iw-flex-cell class="form__item">
		<obj name="bar_demo1" type="obj_bar" css="form__element"></obj>
	</div>

	<div iw-flex-cell class="form__item">
		<obj name="bar_demo2" type="obj_bar" css="form__element">
			<value>12</value>
			<label>12% of 2 TB</label>
		</obj>
	</div>

</div>


<h3 class="box-content-title gamma">Input</h3>
<p class="box-content-desc">Lorem lean startup ipsum product market fit customer development acquihire technical cofounder.</p>
<div iw-flex-grid="query 4" class="form-block">

{include inc_form}
	{	"element_input": true,
		"input_type": "text",
		"input_placeholder": "Text input",
		"name": "demo_text",
		"label_text": "Text input"
	}
{/include}

{include inc_form}
	{	"element_input": true,
		"input_type": "email",
		"input_placeholder": "Email input",
		"name": "demo_email",
		"label_text": "Email input"
	}
{/include}

{include inc_form}
	{	"element_input": true,
		"input_type": "date",
		"input_placeholder": "Date input",
		"name": "demo_date",
		"label_text": "Date input"
	}
{/include}

{include inc_form}
	{	"element_input": true,
		"input_type": "tel",
		"input_placeholder": "Tel input",
		"name": "demo_tel",
		"label_text": "Tel input"
	}
{/include}

{include inc_form}
	{	"element_input": true,
		"input_type": "password",
		"input_placeholder": "Password input",
		"name": "demo_password",
		"label_text": "Password input"
	}
{/include}

{include inc_form}
	{	"element_input": true,
		"input_type": "url",
		"input_placeholder": "URL input",
		"name": "demo_url",
		"label_text": "URL input"
	}
{/include}

{include inc_form}
	{	"element_input": true,
		"input_type": "search",
		"input_placeholder": "Search input",
		"name": "demo_search",
		"label_text": "Search input"
	}
{/include}

{include inc_form}
	{	"element_input": true,
		"input_type": "number",
		"input_placeholder": "Number input",
		"name": "demo_number",
		"label_text": "Number input"
	}
{/include}

{include inc_form}
	{	"element_input": true,
		"input_type": "text",
		"input_label": "Label",
		"input_placeholder": "Text input with label",
		"name": "demo_label",
		"label_text": "Text input with label"
	}
{/include}

{include inc_form}
	{	"element_input": true,
		"input_type": "text",
		"input_class": "has-error",
		"input_placeholder": "Text input with error",
		"name": "demo_error",
		"label_text": "Text input with error"
	}
{/include}

{include inc_form}
	{	"element_input": true,
		"input_value": "Editable value",
		"input_class": "is-editable",
		"name": "editable1",
		"label_text": "Editable input"
	}
{/include}

{include inc_form}
	{	"element_input": true,
		"name": "append",
		"label_text": "Input with appended dropdown",
		"append_dropdown": true
	}
{/include}

</div>


<h3 class="box-content-title gamma">Dropdown</h3>
<p class="box-content-desc">Lorem lean startup ipsum product market fit customer development acquihire technical cofounder.</p>
<div iw-flex-grid="query 3" class="form-block">

{include inc_form}
	{	"element_dropdown": true,
		"name": "demo_normal",
		"label_text": "Normal dropdown"
	}
{/include}

{include inc_form}
	{	"element_dropdown": true,
		"dropdown_disabled": true,
		"name": "demo_disabled",
		"label_text": "Disabled dropdown"
	}
{/include}

{include inc_form}
	{	"element_dropdown": true,
		"dropdown_class": "is-editable",
		"name": "demo_editable",
		"label_text": "Editable dropdown"
	}
{/include}

</div>


<h3 class="box-content-title gamma">Textarea</h3>
<p class="box-content-desc">Lorem lean startup ipsum product market fit customer development acquihire technical cofounder.</p>
<div iw-flex-grid="query 3" class="form-block">

{include inc_form}
	{	"element_textarea": true,
		"textarea_placeholder": "Editable textarea",
		"name": "editable_textarea",
		"label_text": "Editable textarea"
	}
{/include}

{include inc_form}
	{	"element_textarea": true,
		"textarea_placeholder": "Readonly textarea",
		"textarea_readonly": true,
		"textarea_value": "a2wzamJsazUxbGs1bjFrbDUxbDNrNW4xM2xrNW4xbGs1MTNsazUYWFmNGM2MWRkY2M1ZThhMmRhYmVkZTBmM2I0ODJjZDlhZWE5NDM0ZA==",
		"name": "readonly_textarea",
		"label_text": "Readonly textarea",
		"label_button": true,
		"label_button_value": "generic::copy_to_clipboard"
	}
{/include}

{include inc_form}
	{	"element_textarea": true,
		"textarea_value": "Editable value",
		"textarea_class": "is-editable",
		"name": "editable3",
		"label_text": "Editable textarea"
	}
{/include}

</div>


<h3 class="box-content-title gamma">Button</h3>
<p class="box-content-desc">Lorem lean startup ipsum product market fit customer development acquihire technical cofounder.</p>

<div class="form-block">

	<div iw-flex-grid="query 2">
	<div iw-flex-cell>
		<div class="form-label">
			<div iw-flex-grid>
			<div iw-flex-cell>
				<label class="label">Auto width button</label>
			</div>
			</div>
		</div>
		<div class="form-row">
			<div iw-flex-grid>
			<div iw-flex-cell>
				<obj name="btn_" type="obj_button" css="text primary icon-arrow-up"><value>Longer button name</value></obj>
			</div>
			</div>
		</div>
	</div>
	<div iw-flex-cell>
		<div class="form-label">
			<div iw-flex-grid>
			<div iw-flex-cell>
				<label class="label">Full width button</label>
			</div>
			</div>
		</div>
		<div class="form-row">
			<div iw-flex-grid>
			<div iw-flex-cell>
				<obj name="btn_" type="obj_button" css="text primary full"><value>Full width</value></obj>
			</div>
			</div>
		</div>
	</div>
	</div>

	<div iw-flex-grid="query 2">
	<div iw-flex-cell>
		<div class="form-label">
			<div iw-flex-grid>
			<div iw-flex-cell>
				<label class="label">Auto width multiple buttons</label>
			</div>
			</div>
		</div>
		<div iw-flex-grid>
		<div iw-flex-cell>
			<div class="button-group">
				<obj name="btn_" type="obj_button" css="text grey"><value>Short name</value></obj>
				<obj name="btn_" type="obj_button" css="text warning"><value>Longer button name</value></obj>
				<obj name="btn_" type="obj_button" css="text success"><value>Click</value></obj>
			</div>
		</div>
		</div>
	</div>
	<div iw-flex-cell>
		<div class="form-label">
			<div iw-flex-grid>
			<div iw-flex-cell>
				<label class="label">Auto width button aligned right</label>
			</div>
			</div>
		</div>
		<div class="form-row">
			<div iw-flex-grid="content-end">
			<div iw-flex-cell="none">
				<obj name="btn_" type="obj_button" css="text primary disabled"><value>Disabled button</value></obj>
			</div>
			</div>
		</div>
	</div>
	</div>

	<div iw-flex-grid="query 2">
		<div iw-flex-cell>
			<div class="form-row margin">
				<div iw-flex-grid="fit">
				<div iw-flex-cell="item-center">
					<label class="label">Button with inline label</label>
				</div>
				<div iw-flex-cell="none">
					<obj name="btn_" type="obj_button" css="text secondary inline"><value>Auto width</value></obj>
				</div>
				</div>
			</div>
		</div>
		<div iw-flex-cell>
			<div class="form-row margin">
				<div iw-flex-grid="fit">
				<div iw-flex-cell="item-center">
					<label class="label">Borderless button</label>
				</div>
				<div iw-flex-cell="none">
					<obj name="btn_" type="obj_button" css="text borderless"><value>Borderless</value></obj>
				</div>
				</div>
			</div>
		</div>
	</div>

	<div iw-flex-grid>
	<div iw-flex-cell>
		<div class="form-label">
			<label class="label">Text button colors</label>
		</div>
		<div class="button-group">
			<obj name="btn_color" type="obj_button" css="text primary"><value>other::primary</value></obj>
			<obj name="btn_color" type="obj_button" css="text secondary"><value>other::secondary</value></obj>
			<obj name="btn_color" type="obj_button" css="text success"><value>other::success</value></obj>
			<obj name="btn_color" type="obj_button" css="text warning"><value>other::warning</value></obj>
			<obj name="btn_color" type="obj_button" css="text error"><value>other::error</value></obj>
			<obj name="btn_color" type="obj_button" css="text grey"><value>other::grey</value></obj>
			<obj name="btn_color" type="obj_button" css="text borderless"><value>other::borderless</value></obj>
		</div>

		<br>

		<div class="button-group">
			<obj name="btn_color" type="obj_button" css="text primary icon-arrow-up"><value>other::primary</value></obj>
			<obj name="btn_color" type="obj_button" css="text secondary icon-arrow-down"><value>other::secondary</value></obj>
			<obj name="btn_color" type="obj_button" css="text success icon-add"><value>other::success</value></obj>
			<obj name="btn_color" type="obj_button" css="text warning icon-close"><value>other::warning</value></obj>
			<obj name="btn_color" type="obj_button" css="text error icon-logout"><value>other::error</value></obj>
			<obj name="btn_color" type="obj_button" css="text grey icon-menu"><value>other::grey</value></obj>
		</div>
	</div>
	</div>

	<br>

	<div iw-flex-grid>
	<div iw-flex-cell>
		<div class="form-label">
			<label class="label">Icon button colors</label>
		</div>
		<div class="button-group">
			<obj name="btn_color" type="obj_button" css="icon primary icon-menu"></obj>
			<obj name="btn_color" type="obj_button" css="icon error icon-add"></obj>
			<obj name="btn_color" type="obj_button" css="icon grey icon-search-circle"></obj>
			<obj name="btn_color" type="obj_button" css="icon secondary icon-checkmark"></obj>
			<obj name="btn_color" type="obj_button" css="icon success icon-xmark"></obj>
			<obj name="btn_color" type="obj_button" css="icon warning icon-hyphen"></obj>
		</div>
	</div>
	</div>

</div>


<h3 class="box-content-title gamma">Form patterns</h3>
<p class="box-content-desc">Lorem lean startup ipsum product market fit customer development acquihire technical cofounder.</p>

<div iw-flex-grid="query 2 double-padding">
<div iw-flex-cell>

	<div class="form-block">
		<div iw-flex-grid>

			<!-- Label with input -->
			<div iw-flex-cell id="{anchor fi_test}" class="form-item">
				<div class="form-label">
					<label class="label">Label with input</label>
				</div>
				<div class="form-row">
					<obj name="input_test" type="obj_input_text" tabindex="true">
						<placeholder>placeholder</placeholder>
					</obj>
				</div>
			</div>

			<!-- Label with dropdown -->
			<div iw-flex-cell id="{anchor fi_test}" class="form-item">
				<div class="form-label">
					<label class="label">Label with dropdown</label>
				</div>
				<div class="form-row">
					<obj name="dropdown_test" type="obj_dropdown_single" tabindex="true"></obj>
				</div>
			</div>

			<!-- Label with textarea -->
			<div iw-flex-cell id="{anchor fi_test}" class="form-item">
				<div class="form-label">
					<label class="label">Label with textarea</label>
				</div>
				<div class="form-row large">
					<obj name="input_test" type="obj_textarea" tabindex="true">
						<placeholder>placeholder</placeholder>
					</obj>
				</div>
			</div>

			<!-- Label with button -->
			<div iw-flex-cell id="{anchor fi_test}" class="form-item">
				<div class="form-row">
					<div iw-flex-grid="2">
					<div iw-flex-cell="item-center">
						<label class="label">Label with button</label>
					</div>
					<div iw-flex-cell>
						<obj name="button_test" type="obj_button" css="text primary full inline" tabindex="true">
							<value>Button</value>
						</obj>
					</div>
					</div>
				</div>
			</div>

		</div>
	</div>

</div>
<div iw-flex-cell>

	<div class="form-block">
		<div iw-flex-grid>

			<!-- Input with dropdown -->
			<div iw-flex-cell id="{anchor fi_test}" class="form-item">
				<div id="{anchor test}"></div>
				<div class="form-label">
					<label class="label">Input with dropdown</label>
				</div>
				<div class="form-row" id="{anchor test}">
					<div iw-flex-grid="fit group">
					<div iw-flex-cell>
						<obj name="input_test1" type="obj_input_tel" css="inline group-left" tabindex="true">
							<placeholder>placeholder</placeholder>
						</obj>
					</div>
					<div iw-flex-cell="none">
						<obj name="dropdown_test2" type="obj_dropdown_single" css="inline group-right" tabindex="true"></obj>
					</div>
					</div>
				</div>
			</div>

			<!-- Input with additional text -->
			<div iw-flex-cell id="{anchor fi_test}" class="form-item">
				<div class="form-label">
					<label class="label">Input with additional text</label>
				</div>
				<div class="form-row">
					<obj name="input_test" type="obj_input_number" tabindex="true">
						<placeholder>placeholder</placeholder>
						<label>label</label>
					</obj>
				</div>
			</div>

			<!-- Label with toggle -->
			<div iw-flex-cell id="{anchor fi_test}" class="form-item">
				<div class="form-row">
					<div iw-flex-grid="fit">
					<div iw-flex-cell="item-center none" class="form-item">
						<obj name="toggle_test" type="obj_toggle" tabindex="true"></obj>
					</div>
					<div iw-flex-cell="item-center half-padding">
						<label class="label">Label with toggle </label>
					</div>
					</div>
				</div>
			</div>

			<!-- Toggle hidden input with dropdown -->
			<div iw-flex-cell id="{anchor fi_test}" class="form-item">
				<div class="form-label">
					<div iw-flex-grid="fit">
					<div iw-flex-cell="none">
						<obj name="toggle_test" type="obj_toggle" tabindex="true"><toggle>test1</toggle></obj>
					</div>
					<div iw-flex-cell="item-center half-padding">
						<label class="label">Toggle input with dropdown</label>
					</div>
					</div>
				</div>
				<div class="form-row" id="{anchor test1}" is-hidden="1">
					<div iw-flex-grid="fit group">
					<div iw-flex-cell>
						<obj name="input_test" type="obj_input_number" css="inline group-left" tabindex="true">
							<placeholder>placeholder</placeholder>
						</obj>
					</div>
					<div iw-flex-cell="none">
						<obj name="dropdown_test" type="obj_dropdown_single" css="inline group-right" tabindex="true"></obj>
					</div>
					</div>
				</div>
			</div>

			<!-- Toggle hidden input -->
			<div iw-flex-cell="full" id="{anchor fi_test}" class="form-item">
				<div class="form-label">
					<div iw-flex-grid="fit">
					<div iw-flex-cell="item-center none">
						<obj name="toggle_test" type="obj_toggle" tabindex="true"><toggle>test2</toggle></obj>
					</div>
					<div iw-flex-cell="item-center half-padding">
						<label class="label">Toggle hidden input</label>
					</div>
					</div>
				</div>
				<div class="form-row" id="{anchor test2}" is-hidden="1">
					<obj name="input_test" type="obj_input_date" tabindex="true"></obj>
				</div>
			</div>

			<!-- Toggle with disabled dropdown -->
			<div iw-flex-cell id="{anchor fi_test}" class="form-item">
				<div iw-flex-grid="query center 2">
				<div iw-flex-cell>
					<div class="form-label">
						<div iw-flex-grid="fit">
						<div iw-flex-cell="none item-center">
							<obj name="toggle_test" type="obj_toggle" tabindex="true">
								<enabled>test3</enabled>
							</obj>
						</div>
						<div iw-flex-cell="item-center half-padding">
							<label class="label">Toggle with disabled dropdown</label>
						</div>
						</div>
					</div>
				</div>
				<div iw-flex-cell>
					<div class="form-row" id="{anchor test3}">
						<obj name="dropdown_test" type="obj_dropdown_single" tabindex="true">
							<disabled>1</disabled>
						</obj>
					</div>
				</div>
				</div>
			</div>

			<!-- Label with bar -->
			<div iw-flex-cell id="{anchor fi_test}" class="form-item">
				<div class="form-row">
					<div iw-flex-grid="2">
					<div iw-flex-cell="item-center">
						<label class="label">Label with bar</label>
					</div>
					<div iw-flex-cell>
						<obj name="test" type="obj_bar"></obj>
					</div>
					</div>
				</div>
			</div>

		</div>
	</div>

</div>
</div>


<h3 class="box-content-title gamma">Folders</h3>
<p class="box-content-desc">Lorem lean startup ipsum product market fit customer development acquihire technical cofounder.</p>
<div class="form-block">

	<div iw-flex-grid="query">
	<div iw-flex-cell>

		<div class="folders">
			<ul class="folders-parent">
				<li class="folders-child active"><span class="folders-name">Praesent posuere</span></li>
				<li class="folders-child open"><span class="folders-name">Atneque</span>
					<ul class="folders-parent">
						<li class="folders-child"><span class="folders-name">second item second subitem first sub-subitem</span></li>
						<li class="folders-child open"><span class="folders-name">second item second subitem second sub-subitem</span>
							<ul class="folders-parent">
								<li class="folders-child"><span class="folders-name">Praesent posuere</span></li>
								<li class="folders-child"><span class="folders-name">Atneque</span></li>
								<li class="folders-child"><span class="folders-name">Nunc at neque</span></li>
							</ul>
						</li>
						<li class="folders-child"><span class="folders-name">second item second subitem third sub-subitem</span></li>
					</ul>
				</li>
				<li class="folders-child open"><span class="folders-name">Praesent posuere</span>
					<ul class="folders-parent">
						<li class="folders-child"><span class="folders-name">second item second subitem first sub-subitem</span></li>
						<li class="folders-child open"><span class="folders-name">second item second subitem second sub-subitem second item second subitem second sub-subitem</span>
							<ul class="folders-parent">
								<li class="folders-child"><span class="folders-name">Praesent posuere</span></li>
								<li class="folders-child"><span class="folders-name">Atneque</span></li>
								<li class="folders-child open"><span class="folders-name">Nunc at neque</span>
									<ul class="folders-parent">
										<li class="folders-child"><span class="folders-name">Praesent posuere</span></li>
										<li class="folders-child"><span class="folders-name">Atneque</span></li>
										<li class="folders-child"><span class="folders-name">Nunc at neque</span></li>
									</ul>
								</li>
							</ul>
						</li>
						<li class="folders-child"><span class="folders-name">second item second subitem third sub-subitem</span></li>
					</ul>
				</li>
				<li class="folders-child"><span class="folders-name">Nunc at neque</span></li>
			</ul>
		</div>

	</div>
	</div>

</div>
