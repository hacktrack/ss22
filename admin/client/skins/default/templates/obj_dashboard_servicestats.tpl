<table class="service-table">
	<tbody>
	{dynamic items}
		<tr><td>{items::*::name}</td><td>{items::*::value}</td></tr>
	{/dynamic}
	</tbody>
</table>