<tr>
		{optional checkfirst}
		<input id="{id}" type="checkbox" name="{name}"{optional value} value="{value}"{/optional} {optional css}class="{css}"{/optional}{optional property::events}{dynamic property::events} {*::name}="{*::value}"{/dynamic}{/optional} />
		<label for="{id}">{label}</label>
		{/optional}
		
		<td><label for="{id}">{property::label}</label></td>
		<td><input id="{id}" type="checkbox" name="{property::name}"{optional property::value} checked="checked"{/optional} {optional css}class="{css}"{/optional}{optional property::events}{dynamic property::events} {*::name}="{*::value}"{/dynamic}{/optional} /></td>
</tr>