<form id="{form_id}" action="{script}" method="post">
<input type="hidden" name="namespace" value="none" />
<input type="hidden" name="action" value="none" />
<input type="hidden" name="sid" value="{sid}" />
<input type="hidden" name="folder" value="{folder}" />
<input type="hidden" name="view" value="{view}" />
<input type="hidden" name="__sent" value="1" />
<!--this submit have to be there in order to all submitted inputs will use this button-->
<input type="submit" name="__a_grid_refresh" value="{lang::general::refresh}" style="display:none;"/>
{table}
</form>