<div class="popupmaindialog">
<table class="frmtbl frmtbl100">
	<tr>
		<th class="th">{ATTENDEES::NAME}</th>
		<td class="td"><obj type="obj_input" name="name" tabindex="true" focus="true" css="obj_input_100"></obj></td>
	</tr>
	<tr>
		<th class="th">{ATTENDEES::EMAIL}</th>
		<td class="td"><obj name="email" type="obj_input" tabindex="true" css="obj_input_100">
			<restrictions>^([A-Za-z0-9\'\!\#\$\%\&\+\-\/\=\?\^\_\`\{\|\}\~\*][\.]?)+\@[a-zA-Z0-9]+([\.\-\_]?[a-zA-Z0-9])*\.[a-zA-Z]{2,}$</restrictions>
		</obj></td>
	</tr>
</table>
<p>{ALIAS::INSTRUCTIONS}</p>
</div>