<div class="grey top_toolbar">
<table cellpadding="0" cellspacing="1">
	<tr>
		<th>
		<select name="_s[sort]">
			{dynamic property::fields}<option value="{.*::orderby}"{optional *::selected} selected="selected"{/optional}>{.*::label}</option>
			{/dynamic}
		</select>
		</th>
		<td>&nbsp;&nbsp;<input type="submit" class="button ico_go small" name="_a[sort]" value="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" title="{lang::general::sort}"/></td>
	</tr>
</table>
</div>