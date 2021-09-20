<!-- DG sort -->
<form method="post" name="grid_contact" action="{info::link}">
<fieldset style="display:none;">
<input type="hidden"  name="_s[page_current]" value="{info::page}"/>
<input type="submit" style="display:none;" name="_a[enter_click]" value="{lang::general::sort}"/>
<input type="hidden" value="{info::controller}" name="_c"/>
</fieldset>
{include ../pda/skin/pda/tpl/grid/_sort.tpl}
<!-- DG body -->
<div class="contact">
{dynamic items}
<div>
<table>
	<tr>
		<td><strong>{htmlspecialchars *::ITMCLASSIFYAS}</strong></td>
	</tr>
    {optional *::ITMCOMPANY}
	<tr>
		<td><small>{htmlspecialchars *::ITMCOMPANY}{optional *::ITMDEPARTMENT} - {/optional}{htmlspecialchars *::ITMDEPARTMENT}</small></td>
	</tr>
	{/optional}
	<tr>
		<td>
			{optional *::LCTEMAIL1}<a href="index.html?_n[p][main]=mail.compose&_n[w]=main&to={optional *::ITMCLASSIFYAS}&quot;{*::ITMCLASSIFYAS}&quot;&lt;{*::LCTEMAIL1}&gt;{/optional}{!optional *::ITMCLASSIFYAS}{*::LCTEMAIL1}{/optional}">{*::LCTEMAIL1}</a>{/optional}
			{optional *::LCTEMAIL2}<a href="index.html?_n[p][main]=mail.compose&_n[w]=main&to={optional *::ITMCLASSIFYAS}&quot;{*::ITMCLASSIFYAS}&quot;&lt;{*::LCTEMAIL2}&gt;{/optional}{!optional *::ITMCLASSIFYAS}{*::LCTEMAIL1}{/optional}">{*::LCTEMAIL2}</a>{/optional}
			{optional *::LCTEMAIL3}<a href="index.html?_n[p][main]=mail.compose&_n[w]=main&to={optional *::ITMCLASSIFYAS}&quot;{*::ITMCLASSIFYAS}&quot;&lt;{*::LCTEMAIL3}&gt;{/optional}{!optional *::ITMCLASSIFYAS}{*::LCTEMAIL3}{/optional}">{*::LCTEMAIL3}</a>{/optional}
		</td>
	</tr>
</table>
</div>
{/dynamic}
</div>

<!-- DG listing -->
{include ../pda/skin/pda/tpl/grid/_list.tpl}

<!-- DG toolbar -->
{dynamic buttons}{optional buttons}<input type="submit" name="{*::name}" value="{*::label}"{optional *::confirm} onclick="return confirm('{*::confirm}');"{/optional}{optional *::css} class="{*::css}"{/optional} />
{/optional}{/dynamic}
</form>