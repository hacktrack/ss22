<form id="{id}" name="{name}" method="{method}"{optional rsa} rsa="{rsa}"{/optional} action="{optional parameters}{htmlspecialchars script}{parameters}{/optional}"{optional property::enctype} enctype="{property::enctype}"{/optional}{optional css} class="{css}"{/optional}>
	<fieldset style="display:none;">
		{optional controller}<input type="hidden" name="_c" value="{controller}" />{/optional}
		{optional view}<input type="hidden" name="_n[p][{window}]" value="{view}" />{/optional}
		{optional view}<input type="hidden" name="_n[w]" value="{window}" />{/optional}
		{dynamic variable}<input type="hidden" name="{*::var_name}" value="{*::var_value}" />{/dynamic}
	</fieldset>
	{body}
</form>