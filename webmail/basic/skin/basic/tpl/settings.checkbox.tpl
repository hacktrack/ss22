{optional property::label}
{!optional property::inline}<td>{/optional}

<label for="{property::id}">{property::label}</label>

{!optional property::inline}</td>{/optional}

{/optional}

{!optional property::inline}<td{!optional property::label} colspan="2"{/optional}>{/optional}

<input type="hidden" name="{property::old_name}" value="{property::value}"/>

{optional property::function_value}
<input type="hidden" name="{property::function_name}" value="{property::function_value}"/>
{/optional}

<input type="hidden" name="{property::name}" value="{optional property::inverse}1{/optional}{!optional property::inverse}0{/optional}"/>

<input id="{property::id}" type="checkbox" name="{property::name}"{optional property::checked} checked="checked"{/optional} value="{optional property::inverse}0{/optional}{!optional property::inverse}1{/optional}" {optional property::css}class="{property::css}"{/optional}{optional property::events}{dynamic property::events} {*::name}="{*::value}"{/dynamic}{/optional} />
{optional property::alabel}{property::alabel}{/optional}

{!optional property::inline}</td>{/optional}

{!optional property::hide_force}{include ../basic/skin/basic/tpl/settings.force.tpl}{/optional}