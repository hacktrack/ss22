	{optional property::label}
	{!optional property::inline}<th colspan="2">{/optional}

	<label for="{property::id}">{property::label}</label>
	
	{!optional property::inline}</th>{/optional}
	
	{/optional}
	{include ../basic/skin/basic/tpl/settings.force.tpl}
</tr>
<tr>
	<td colspan="{!optional property::show_force_domain}2{/optional}{optional property::show_force_user}{optional property::show_force_domain}4{/optional}{!optional property::show_force_domain}3{/optional}{/optional}">
		
		<input type="hidden" name="{property::old_name}" value="{htmlspecialchars property::value}"/>
		
		{optional property::function_value}
		<input type="hidden" name="{property::function_name}" value="{htmlspecialchars property::function_value}"/>
		{/optional}
		
		<textarea id="{property::id}" name="{property::name}"{optional property::css}class="{property::css}"{/optional}{optional property::events}{dynamic property::events} {.*::name}="{.*::value}"{/dynamic}{/optional} >{optional property::value}{htmlspecialchars property::value}{/optional}</textarea>
	</td>
