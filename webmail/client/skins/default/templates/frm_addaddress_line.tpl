<table class="frmtbl frmtbl100">
{dynamic input}
	<tr>
		<td><obj type="obj_button" name="button_{input::*::name}" css="simple long_button"><value>{input::*::label}</value></obj></td>
		<td class="td"><obj type="obj_input" name="input_{input::*::name}" css="obj_input_100" tabindex="true"></obj></td>
	</tr>
{/dynamic}
</table>