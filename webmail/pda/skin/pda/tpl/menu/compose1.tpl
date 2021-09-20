<table  width="100%">
	<tr>
		<td>
			<input type="submit" name="_a[go_to_main_page]" class="button" value="{lang::pda::home}" />
		</td>
		<th width="100%"></th>
		<td>
			<input type="submit" name="_a[logout][process]" class="button" onclick="changeFormMethod(event);" value="{lang::main_menu::logout}" />
			<input type="hidden" name="_a[logout][controller]" value="auth"/>
			<input type="hidden" name="_a[logout][action]" value="logout"/>
		</td>
	</tr>
</table>