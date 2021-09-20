<!-- DG toolbar -->
<input type="hidden" name="_s[page_current]" value="{info::page}"/>
{include ../pda/skin/apple/thtmlspecialchars pl/menu/contact.select.tpl}

<!-- DG sort -->
{include ../pda/skin/apple/tpl/grid/_sort.tpl}

<!-- DG body -->
<div class="contact contact_input">
	{dynamic items}
	<div>
		<h2>{htmlspecialchars *::ITMCLASSIFYAS}</h2>
		{optional *::ITMCOMPANY *::ITMDEPARTMENT}
		<h3>{htmlspecialchars *::ITMCOMPANY}{optional *::ITMDEPARTMENT} - {/optional}{htmlspecialchars *::ITMDEPARTMENT}</h3>
		{/optional}
		<p>
			{optional *::LCTEMAIL1}<span><input type="checkbox" name="items[{optional *::ITMCLASSIFYAS}&quot;{htmlspecialchars .*::ITMCLASSIFYAS}&quot; &lt;{/optional}{htmlspecialchars .*::LCTEMAIL1}{optional *::ITMCLASSIFYAS}&gt;{/optional}]" value="{htmlspecialchars .*::LCTEMAIL1}" /><label onclick="check_address(this)">{htmlspecialchars *::LCTEMAIL1}</label></span>{/optional}
			{optional *::LCTEMAIL2}<span><input type="checkbox" name="items[{optional *::ITMCLASSIFYAS}&quot;{htmlspecialchars .*::ITMCLASSIFYAS}&quot; &lt;{/optional}{htmlspecialchars .*::LCTEMAIL2}{optional *::ITMCLASSIFYAS}&gt;{/optional}]" value="{htmlspecialchars .*::LCTEMAIL2}" /><label onclick="check_address(this)">{htmlspecialchars *::LCTEMAIL2}</label></span>{/optional}
			{optional *::LCTEMAIL3}<span><input type="checkbox" name="items[{optional *::ITMCLASSIFYAS}&quot;{htmlspecialchars .*::ITMCLASSIFYAS}&quot; &lt;{/optional}{htmlspecialchars .*::LCTEMAIL3}{optional *::ITMCLASSIFYAS}&gt;{/optional}]" value="{htmlspecialchars .*::LCTEMAIL3}" /><label onclick="check_address(this)">{htmlspecialchars *::LCTEMAIL3}</label></span>{/optional}
		</p>
	</div>
	{/dynamic}
</div>

<!-- DG listing -->
{include ../pda/skin/apple/tpl/grid/_list.tpl}

<fieldset>
	<input type="submit" name="_dlg[grid_contact_select][process]" value="{lang::address_book::select_addresses}" class="button"/>
	<input type="hidden" name="_dlg[grid_contact_select][controller]" value="{dialog::controller}"/>
	<input type="hidden" name="_dlg[grid_contact_select][action]" value="{dialog::action}"/>
	<input type="hidden" name="_dlg[grid_contact_select][type]" value="select"/>
	
<input type="submit" class="button" name="_dlg[cancel_select][process]" value="{lang::form_buttons::cancel}"/>
<input type="hidden" name="_dlg[cancel_select][type]" value="select"/>
<input type="hidden" name="_dlg[cancel_select][controller]" value="{dialog::controller}"/>
<input type="hidden" name="_dlg[cancel_select][action]" value="cancel_select"/>
</fieldset>