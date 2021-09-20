<form id="{id}" name="{name}" method="{method}" action="{script}" {optional enctype} enctype="{enctype}"{/optional}{optional css} class="{css}"{/optional} onsubmit="pdaLogin('{hash}',this);" >
<fieldset style="display:none;">
	<input type="hidden" name="_c" value="{controller}" />
	<input type="hidden" name="_n[p][{window}]" value="{view}" />
	<input type="hidden" name="_n[w]" value="{window}" />
	{dynamic variable}<input type="hidden" name="{*::var_name}" value="{*::var_value}" />{/dynamic}
	<input type="checkbox" name="disable_ip_check" value="1" checked="checked"/>
</fieldset>
<table align="center">
<tr>
<td colspan="2"><div><img src="{settings::logo_path}" alt="Logo"/>&nbsp;</div></td>
</tr>
<tr>
<td>
{body}
</td>
</tr>
</table>
</form>