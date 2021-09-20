
<div    iw-flex-cell
        id              = "{_ins}#fi_{name}"
        class           = "
            form__item
            {optional item_class} {item_class} {/optional}"
        {optional hidden}
        is-hidden       = "1"
        {/optional}
>

    <!-- Force option -->
    {optional force_option}
        <obj name="force_{name}" type="obj_force_options"></obj>
    {/optional}

    <!-- ***** FORM DESCRIPTION ***** -->
    {optional description}
        <p class="form__desc">{description}</p>
    {/optional}


    <!-- ***** FORM ROW ***** -->
    <!-- Input, Dropdown, Textarea, Button -->

    <!-- Form - Input -->
    {optional element_input}
        <!-- Form - Upload -->
        {optional append_upload}
            <obj    name        = "upload_{name}"
                    type        = "obj_upload"
                    css         = "
                        form__element
                        form__group-right
                        icon-arrow-up
                        text
                        {optional upload_class} {upload_class} {/optional}
                        {noptional upload_class} primary {/noptional}"
                    tabindex    = "true"
            >
                <value>{upload_value}</value>
            </obj>
        {/optional}
        {optional append_dropdown}
            <obj    name        = "dropdown_{name}"
                    type        = "obj_dropdown_single"
                    css         = "
                        form__element
                        form__group-right"
                    tabindex    = "true"
            ></obj>
        {/optional}
        {optional append_button}
            <obj    name        = "button_{name}"

                    type        = "obj_button"
                    css         = "
                        form__element
                        form__group-right
                        {optional button_class} {button_class} {/optional}"
                    tabindex    = "true"
            >
                {optional button_value}<value>{button_value}</value>{/optional}
            </obj>
        {/optional}
        {optional inner_button}
            <obj    name        = "button_{name}"
                    type        = "obj_button"
                    css         = "
                        form__element
                        form__group-right
                        inner-button
                        {optional button_class} {button_class} {/optional}"
                    tabindex    = "true"
            >
                {optional button_value}<value>{button_value}</value>{/optional}
            </obj>
        {/optional}
        <obj    name        = "input_{name}"
                type        = "obj_input_{optional input_type}{input_type}{/optional}{noptional input_type}text{/noptional}"
                css         = "
                    form__element
                    {optional input_class} {input_class} {/optional}
                    {optional append_dropdown append_upload append_button inner_button} form__group-left {/optional}"
                {optional markdown}
                markdown    = "1"
                {/optional}
                tabindex    = "true">
            {optional input_placeholder}<placeholder>{input_placeholder}</placeholder>{/optional}
            {optional input_placeholder_plain}<placeholderPlain>{input_placeholder_plain}</placeholderPlain>{/optional}
            {optional input_value}<value>{input_value}</value>{/optional}
            {optional input_label}<label>{input_label}</label>{/optional}
            {optional input_readonly}<readonly>1</readonly>{/optional}
        </obj>
    {/optional}

    <!-- Form - Input bytes -->
    {optional element_input_bytes}
        <obj    name        = "input_{name}"
                type        = "obj_input_bytes"
                css         = "
                    form__group form__group--bytes"
                tabindex    = "true"
        >
            {optional input_bytes_placeholder}<placeholder>{input_bytes_placeholder}</placeholder>{/optional}
            {optional base_unit}<baseunit>{base_unit}</baseunit>{/optional}
            {optional max_unit}<maxunit>{max_unit}</maxunit>{/optional}
        </obj>
    {/optional}

    <!-- Form - Dropdown -->
    {optional element_dropdown}
        <obj    name        = "dropdown_{name}"
                type        = "obj_dropdown_single"
                css         = "
                    form__element
                    {optional dropdown_class} {dropdown_class} {/optional}"
                tabindex    = "true"
        >
            {optional dropdown_disabled}<disabled>1</disabled>{/optional}
            {optional dropdown_values}<filllang>{dropdown_values}</filllang>{/optional}
        </obj>
    {/optional}

    <!-- Form - Textarea -->
    {optional element_textarea}
        <obj    name        = "textarea_{name}"
                type        = "obj_textarea"
                css         = "
                    form__element
                    {optional textarea_class} {textarea_class} {/optional}"
                {optional markdown}
                markdown    = "1"
                {/optional}
                tabindex    = "true"
        >
            {optional textarea_placeholder}<placeholder>{textarea_placeholder}</placeholder>{/optional}
            {optional textarea_value}<value>{textarea_value}</value>{/optional}
            {optional textarea_readonly}<readonly>1</readonly>{/optional}
        </obj>
    {/optional}

    <!-- Form - Button -->
    {optional element_button}
        <obj    name        = "button_{name}"
                type        = "obj_button"
                css         = "
                    form__element
                    {optional button_class} {button_class} {/optional}
                    {noptional button_class} text primary {/noptional}"
                tabindex    = "true"
        >
            <value>{button_value}</value>
        </obj>
    {/optional}

    <!-- Form - Upload -->
    {optional element_upload}
        <obj    name        = "upload_{name}"
                type        = "obj_upload"
                css         = "
                    form__element
                    icon-arrow-up
                    text
                    {optional upload_class} {upload_class} {/optional}
                    {noptional upload_class} primary {/noptional}"
                tabindex    = "true"
        >
            {optional button_value}<title>{button_value}</title>{/optional}
        </obj>
    {/optional}

    <!-- Form - Checkbox -->
    {optional element_checkbox}
        <div class="form__element form__element--multi">
            {dynamic element_checkbox}
            <obj    name        = "checkbox_{element_checkbox::*::name}"
                    type        = "obj_checkbox"
                    css         = "
                        {optional checkbox_class} {checkbox_class} {/optional}
                        {optional element_radio::*::disabled} is-disabled {/optional}"
                    tabindex    = "true"
            >
                <label>{element_checkbox::*::label}</label>
                {optional element_checkbox::*::disabled}<disabled>1</disabled>{/optional}
            </obj>
            {/dynamic}
        </div>
    {/optional}

    <!-- Form - Radio -->
    {optional element_radio}
        <div class="form__element form__element--multi">
            {dynamic element_radio}
            <obj    name        = "radio_{element_radio::*::name}"
                    type        = "obj_radio"
                    group       = "{name}"
                    css         = "
                        radio--default
                        {optional radio_class} {radio_class} {/optional}
                        {optional element_radio::*::class} {element_radio::*::class} {/optional}
                        {optional element_radio::*::disabled} is-disabled {/optional}"
                    tabindex    = "true"
            >
                {optional element_radio::*::label}<label>{element_radio::*::label}</label>{/optional}
                {optional element_radio::*::disabled}<disabled>1</disabled>{/optional}
                {optional element_radio::*::value}<value>{element_radio::*::value}</value>{/optional}
            </obj>
            {/dynamic}
        </div>
    {/optional}

    <!-- Form - Colorpicker -->
    {optional element_colorpicker}
        <div class="form__element form__element--multi">
            {dynamic element_colorpicker}
            <obj    name        = "radio_{name}_{element_colorpicker::*}"
                    type        = "obj_radio"
                    group       = "{name}"
                    css         = "radio--colorpicker radio--{element_colorpicker::*}"
                    tabindex    = "true"
            >
                <value>{element_colorpicker::*}</value>
            </obj>
            {/dynamic}
        </div>
    {/optional}

    <!-- Form - Imagepicker -->
    {optional element_imagepicker}
        <div class="form__element form__element--multi form__element--imagepicker" id="{_ins}#{name}">
            {dynamic element_imagepicker}
            {dynamic element_imagepicker::*::index}
            <obj    name            = "radio_{name}_{element_imagepicker::*::color}_{element_imagepicker::*::index::*}"
                    type            = "obj_radio"
                    group           = "{name}"
                    css             = "radio--imagepicker"
                    tabindex        = "true"
                    iw-background   = "{element_imagepicker::*::color}_{element_imagepicker::*::index::*}"
            >
                <value>{element_imagepicker::*::color}_{element_imagepicker::*::index::*}</value>
            </obj>
            {/dynamic}
            {/dynamic}
        </div>
    {/optional}

    <!-- Form - Text -->
    {optional element_text}
        <p  id      = "{name}"
            class   = "
                form__element form__element--text text
                {optional text_class} {text_class} {/optional}"
        >{text_value}</p>
    {/optional}


    <!-- ***** FORM LABEL ***** -->
    <!-- Toggle label -->
    {optional label_toggle}
        <obj    name        = "toggle_{name}"
                type        = "obj_toggle"
                css         = "
                    form__label
                    {optional label_class} {label_class} {/optional}"
                tabindex    = "true"
        >
            <label>{label_toggle}</label>
            {optional toggle_disabled}<disabled>1</disabled>{/optional}
            {optional toggle_enables}<enables>{toggle_enables}</enables>{/optional}
            {optional toggle_element}<enables>{toggle_element}_{name}</enables>{/optional}
            {optional toggle_shows}<toggle>{toggle_shows}</toggle>{/optional}
        </obj>
    {/optional}

    <!-- Text label -->
    {optional label_text}
        <label  class="
                    label form__label
                    {optional label_button} flex {/optional}"
                title="{label_text}">
            <span class="label__text">{label_text}</span>
            {optional label_button}
            <obj    name        = "label_button_{name}"
                    type        = "obj_button"
                    css         = "
                        text borderless
                        form__element
                        label__button
                        {optional label_button_class} {label_button_class} {/optional}"
                    tabindex    = "true"
            >
                {optional label_button_value}<value>{label_button_value}</value>{/optional}
            </obj>
            {/optional}
        </label>
    {/optional}

</div>
