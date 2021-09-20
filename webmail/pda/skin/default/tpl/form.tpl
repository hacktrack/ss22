<form id="{id}"{optional name} name="{name}"{/optional} method="{method}" action="{script}{optional parameters}{parameters}{/optional}"{optional enctype} enctype="{enctype}"{/optional}{optional target} target="{target}"{/optional} >
	<fieldset style="display:none;">
		{optional controller}<input type="hidden" name="_c" value="{controller}" />{/optional}
		{optional view}<input type="hidden" name="_n[p][{window}]" value="{view}" />{/optional}
		{optional view}<input type="hidden" name="_n[w]" value="{window}" />{/optional}
		{dynamic variable}<input type="hidden" name="{*::var_name}" value="{*::var_value}" />{/dynamic}
	</fieldset>
	{body}
</form>