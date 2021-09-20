<table class="tGrid">
<!-- Grid head -->
{optional property::columns}{dynamic property::columns}<th></th><th>{*::label}</th>{/dynamic}{/optional}

<!-- Grid body -->
{optional property::rows}{dynamic property::rows}
<tr>
<td class="selectBox">
{optional property::select 'single'}<input type="radio" name="{property::storage}[{*::row}][selected]"/>{/optional}
{optional property::select 'multiple'}<input type="checkbox" name="{property::storage}[{*::row}][selected]"/>{/optional}
</td>
{dynamic *::columns}
<td>
<input type="hidden" name="{property::storage}[{*::row}][columns][{*::column}][value]" value="{*::value}"/>
{*::value}
</td>
{/dynamic}

</tr>
{/dynamic}
{/optional}
</table>

{optional buttons}
<div class="bottom_buttons">
{dynamic buttons}<input type="submit" name="_a[{*::name}]" value="{*::label}"{optional *::confirm} onclick="return confirm('{*::confirm}');"{/optional}{optional *::css} class="button {*::css}"{/optional}{!optional *::css} class="button"{/optional}/>
{/dynamic}</div>
{/optional}

{optional property::function}
<input type="hidden" name="function[{property::storage}]" value="{property::function}"/>
{/optional}
