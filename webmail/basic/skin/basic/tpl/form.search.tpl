<form id="{id}" name="{name}" method="{method}" action="{htmlspecialchars info::link}{optional parameters}{htmlspecialchars parameters}{/optional}"{optional enctype} enctype="{enctype}"{/optional} >
	<fieldset style="display:none;">
		{optional controller}<input type="hidden" name="_c" value="{htmlspecialchars controller}" />
		{/optional}{optional view}<input type="hidden" name="_n[p][{htmlspecialchars window}]" value="{htmlspecialchars view}" />
		{/optional}{optional view}<input type="hidden" name="_n[w]" value="{htmlspecialchars window}" />
		{/optional}{dynamic variable}<input type="hidden" name="{htmlspecialchars *::var_name}" value="{htmlspecialchars *::var_value}" />
		{/dynamic}<input type="hidden" value="{htmlspecialchars container::id}" name="container"/>
		{optional request::all::_s::distrib_id}<input type="hidden" name="_s[distrib_id]" value="{htmlspecialchars request::all::_s::distrib_id}"/>{/optional}
		<input type="hidden" value="{htmlspecialchars container::type}" name="type"/>
	</fieldset>
	{body}
</form>