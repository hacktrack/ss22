</table>

<div class="datagrid">
	<table class="datagrid">
	<!-- Grid head -->
	{optional property::columns}
	<thead>
	<tr>
	    <th class="th_check"><span>&nbsp;</span></th>
		{dynamic property::columns}<th><span>{*::label}</span></th>{/dynamic}
	</tr>
	</thead>
	{/optional}

	<!-- Grid body -->
	{optional property::rows}
	<tbody>
	{dynamic property::rows}
	<tr>
		<td>
		{optional property::select 'single'}<input type="radio" name="{property::storage}[{*::row}][selected]"/>{/optional}
		{optional property::select 'multiple'}<input type="checkbox" class="inp_check" name="{property::storage}[{*::row}][selected]"/>{/optional}
		</td>
		{dynamic *::columns}
		<td>
			<input type="hidden" name="{property::storage}[{*::row}][columns][{*::column}][value]" value="{*::value}"/>
			{*::value}
		</td>
		{/dynamic}
	</tr>
	{/dynamic}
	</tbody>
	{/optional}
	</table>
</div>

{optional buttons}
<div class="bottom_buttons">
{dynamic buttons}<input type="submit" style="margin-right: 10px" name="_a[{*::name}]" value="{*::label}"{optional *::confirm} onclick="return confirm('{*::confirm}');"{/optional}{optional *::css} class="button {*::css}"{/optional}{!optional *::css} class="button"{/optional}/>
{/dynamic}</div>
{/optional}

{optional property::function}
<input type="hidden" name="function[{property::storage}]" value="{property::function}"/>
{/optional}

<table class="frmtbl">