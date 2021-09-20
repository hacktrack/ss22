<div class="popupmaindialog">
	<table class="frmtbl frmtbl100">
	{optional info}
		<tr>
			<th class="th">{info}</th>
		</tr>
		<tr>
			<td class="linetd">&nbsp;</td>
		</tr>
	{/optional}
 		<tr><td>
	{dynamic form}
		<div>
			<span>{form::*::name}</span>
			<obj name="{form::*::id}" type="{form::*::type}" css="obj_input_100" tabindex="true"></obj>
		</div>
	{/dynamic}
		</td></tr>
	</table>
</div>