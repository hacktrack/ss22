<table class="frmtbl maintable">
	<thead>
		<tr>
			{dynamic days}
			<th>{optional days::*}{days::*}{/optional}</th>
			{/dynamic}
		</tr>
	</thead>
	<tbody>
		{dynamic weeks}
		<tr>
			{dynamic weeks::*}
			<td>
			{optional weeks::*::*::week}<span class="week">{weeks::*::*::week}</span>{/optional}
			{optional weeks::*::*::value}<a{optional weeks::*::*::class} class="{weeks::*::*::class}"{/optional} id="{_ins}/{weeks::*::*::value}">{weeks::*::*::label}</a>{/optional}
			</td>
			{/dynamic}
		</tr>
		{/dynamic}
	</tbody>
</table>
