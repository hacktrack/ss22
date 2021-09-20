<tr>
	<th>
		<label for="{property::id}">{property::label}</label>
	</th>
	<td>
		<select size="1">
			{dynamic property::view::days}
			<option{optional *::selected} selected="selected"{/optional} value="{*::value}">{*::value}</option>
			{/dynamic}
		</select>
		<select size="1">
			{dynamic property::view::months}
			<option{optional *::selected} selected="selected"{/optional} value="{*::value}">{*::value}</option>
			{/dynamic}
		</select>
		<select size="1">
			{dynamic property::view::years}
			<option{optional *::selected} selected="selected"{/optional} value="{*::value}">{*::value}</option>
			{/dynamic}
		</select>
	</td>
</tr>
