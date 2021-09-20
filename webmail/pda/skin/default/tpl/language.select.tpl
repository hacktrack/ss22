<tr>
<td><label for="language">{lang::login::language}</label></td>
<td>
<select size="1" name="language" id="language" class="select">
{dynamic settings::language}
	<option value="{*::value}"{optional *::selected} selected="selected"{/optional}>{*::name}</option>
{/dynamic}
</select>
</td>
</tr>