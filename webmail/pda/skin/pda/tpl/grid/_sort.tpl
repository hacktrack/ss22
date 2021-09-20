<div class="sort">
<table cellpadding="0" cellspacing="1">
	<tr>
		<th>
		<select name="_s[sort]">
			{dynamic property::fields}<option value="{*::orderby}"{optional *::selected} selected="selected"{/optional}>{*::label}</option>
			{/dynamic}
		</select>
		</th>
		<td>&nbsp;<input type="submit" name="_a[sort]" value="{lang::general::sort}" class="button" /> <strong>{optional container::id '__@@ADDRESSBOOK@@__'}{lang::form_buttons::address_book}{/optional}{!optional container::id '__@@ADDRESSBOOK@@__'}{container::id}{/optional}</strong></td>
	</tr>
</table>
</div>