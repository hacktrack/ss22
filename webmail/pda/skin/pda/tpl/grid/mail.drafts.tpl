<!-- DG toolbar -->
<form method="post" name="grid_mail">
<fieldset style="display:none;">
<input type="hidden"  name="_s[page_current]" value="{info::page}"/>
<input type="submit" style="display:none;" name="_a[enter_click]" value="{lang::general::sort}"/>
<input type="hidden" value="{info::controller}" name="_c"/>
</fieldset>
<div class="sort">
		<input type="checkbox" id="checkall" onclick="pdaCheckAll('{variable}',this.checked,'grid_mail');" />
		<select name="sortBy">
			{dynamic property::fields}<option value="{*::orderby}"{optional *::sorted} selected="selected"{/optional}>{*::label}</option>
			{/dynamic}
		</select>
		<input type="submit" name="__a_grid_sort" value="{lang::general::sort}" class="button" />
		{container::id}
</div>

<!-- DG body (onclick because odd browser behavior)-->
<div class="mail_item" id="at_mail_grid">
{dynamic items}
<div{optional *::unread} class="unread"{/optional}>
	<table>
		<tr>
			<th width="0"><input type="checkbox" name="{variable}[{*::id}]" value="{*::id}" /></td>
			<td width="100%">
				<a href="{*::link}" onclick="location.href = this.href; return false;">
				<table cellpadding="0" cellspacing="0">
					<tr>
						<td width="100%"><a href="{.*::link}"><strong>{htmlspecialchars *::address}</strong></a></td>
					</tr>
					<tr>
						<td><a href="{.*::link}">{*::subject}</a></td>
					</tr>
					<tr>
						<td align="right"><a href="{.*::link}"><small>{*::aditional::size} {*::date_short}</small></a></td>
					</tr>
				</table>
				</a>
			</td>
		</tr>
	</table>
</div>
{/dynamic}
</div>

<!-- DG listing -->
{include ../pda/skin/pda/tpl/grid/_list.tpl}

{optional buttons}
<div class="bottom_buttons">
{dynamic buttons}<input type="submit" name="_a[{*::name}]" value="{*::label}"{optional *::confirm} onclick="return confirm('{*::confirm}');"{/optional}{optional *::css} class="button {*::css}"{/optional} />{/dynamic}
</div>
{/optional}
</form>