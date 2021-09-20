<!-- DG sort -->
<input type="hidden"  name="_s[page_current]" value="{info::page}"/>
<input type="submit" style="display:none;" name="_a[enter_click]" value="{lang::general::sort}"/><input type="hidden" value="{info::controller}" name="_c"/>
{include ../pda/skin/pda/tpl/grid/_sort.tpl}

<!-- DG body -->
<div class="contact contact_input">
{dynamic items}
<div>
<table width="100%">
	<tr>
		<td><strong>{htmlspecialchars *::ITMCLASSIFYAS}</strong></th>
	</tr>
    {optional *::ITMCOMPANY}
	<tr>
		<td><small>{htmlspecialchars *::ITMCOMPANY}{optional *::ITMDEPARTMENT} - {/optional}{htmlspecialchars *::ITMDEPARTMENT}</small></td>
	</tr>
	{/optional}

	{optional *::LCTEMAIL1}<tr>
		<td><input type="checkbox" name="items[{optional *::ITMCLASSIFYAS}&quot;{*::ITMCLASSIFYAS}&quot; &lt;{/optional}{*::LCTEMAIL1}{optional *::ITMCLASSIFYAS}&gt;{/optional}]" value="{*::LCTEMAIL1}" /><label>{htmlspecialchars *::LCTEMAIL1}</label></td>
	</tr>{/optional}
	{optional *::LCTEMAIL2}<tr>
		<td><input type="checkbox" name="items[{optional *::ITMCLASSIFYAS}&quot;{*::ITMCLASSIFYAS}&quot; &lt;{/optional}{*::LCTEMAIL2}{optional *::ITMCLASSIFYAS}&gt;{/optional}]" value="{*::LCTEMAIL2}" /><label>{htmlspecialchars *::LCTEMAIL2}</label></td>
	</tr>{/optional}
	{optional *::LCTEMAIL3}<tr>
		<td><input type="checkbox" name="items[{optional *::ITMCLASSIFYAS}&quot;{*::ITMCLASSIFYAS}&quot; &lt;{/optional}{*::LCTEMAIL3}{optional *::ITMCLASSIFYAS}&gt;{/optional}]" value="{*::LCTEMAIL3}" /><label>{htmlspecialchars *::LCTEMAIL3}</label></td>
	</tr>{/optional}
</table>
</div>
{/dynamic}
</div>

<!-- DG listing -->
{include ../pda/skin/pda/tpl/grid/_list.tpl}

<!-- DG toolbar -->
{dynamic buttons}{optional buttons}<input type="submit" name="{*::name}" value="{*::label}"{optional *::confirm} onclick="return confirm('{*::confirm}');"{/optional}{optional *::css} class="{*::css}"{/optional} />
{/optional}{/dynamic}

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
</form>
