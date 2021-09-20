<form method="post" name="grid_contact" action="{info::link}">
<fieldset style="display:none;">
<input type="hidden"  name="_s[page_current]" value="{info::page}"/>
<input type="submit" style="display:none;" name="_a[enter_click]" value="{lang::general::refresh}"/>
<input type="hidden" value="{info::controller}" name="_c"/>
</fieldset>
<!-- DG sort -->
{include ../pda/skin/apple/tpl/grid/_sort.tpl}

<!-- DG body -->
<div class="contact">
	{dynamic items}
	<div>
		<h2>{htmlspecialchars *::ITMCLASSIFYAS}</h2>
		{optional *::itmcompany *::ITMDEPARTMENT}
		<h3>{htmlspecialchars *::ITMCOMPANY}{optional *::ITMDEPARTMENT} - {/optional}{htmlspecialchars *::ITMDEPARTMENT}</h3>
		{/optional}

		<p>
			{optional *::LCTEMAIL1}<span><a href="index.html?_n[p][main]=mail.compose&amp;_n[w]=main&amp;to={optional *::ITMCLASSIFYAS}&quot;{htmlspecialchars .*::ITMCLASSIFYAS}&quot;&lt;{htmlspecialchars .*::LCTEMAIL1}&gt;{/optional}{!optional *::ITMCLASSIFYAS}{.*::LCTEMAIL1}{/optional}">{htmlspecialchars .*::LCTEMAIL1}</a></span>{/optional}
			{optional *::LCTEMAIL2}<span><a href="index.html?_n[p][main]=mail.compose&amp;_n[w]=main&amp;to={optional *::ITMCLASSIFYAS}&quot;{htmlspecialchars .*::ITMCLASSIFYAS}&quot;&lt;{htmlspecialchars .*::LCTEMAIL2}&gt;{/optional}{!optional *::ITMCLASSIFYAS}{.*::LCTEMAIL1}{/optional}">{htmlspecialchars .*::LCTEMAIL2}</a></span>{/optional}
			{optional *::LCTEMAIL3}<span><a href="index.html?_n[p][main]=mail.compose&amp;_n[w]=main&amp;to={optional *::ITMCLASSIFYAS}&quot;{htmlspecialchars .*::ITMCLASSIFYAS}&quot;&lt;{htmlspecialchars .*::LCTEMAIL3}&gt;{/optional}{!optional *::ITMCLASSIFYAS}{.*::LCTEMAIL3}{/optional}">{htmlspecialchars .*::LCTEMAIL3}</a></span>{/optional}
		</p>

	</div>
	{/dynamic}
</div>

<!-- DG listing-->
{include ../pda/skin/apple/tpl/grid/_list.tpl}

<!-- DG toolbar -->
{dynamic buttons}{optional buttons}<input type="submit" name="{.*::name}" value="{.*::label}"{optional *::confirm} onclick="return confirm('{.*::confirm}');"{/optional} />
{/optional}{/dynamic}
</form>