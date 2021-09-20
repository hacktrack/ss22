<div class="popupmaindialog">
	<table class="frmtbl frmtbl100">
		<tr>
			<th class="th">{SHARING::ITEMS}</th>
			<td><obj name="r" type="obj_checkbox"><title>SETTINGS::READ</title></obj></td>
			<td><obj name="i" type="obj_checkbox"><title>SETTINGS::WRITE</title></obj></td>
			<td><obj name="w" type="obj_checkbox"><title>SETTINGS::MODIFY</title></obj></td>
			<td class="td"><obj name="t" type="obj_checkbox"><title>SETTINGS::DELETE</title></obj></td>
		</tr>
		{optional teamchat}<tr>
			<td colspan="2"></td>
			<td colspan="3"><obj name="e" type="obj_checkbox"><title>SETTINGS::EDIT_DOCUMENT</title></obj></td>
		</tr>{/optional}
		<tr>
			<th class="th">{SHARING::FOLDER}</th>
			<td><obj name="l" type="obj_checkbox"><title>SETTINGS::READ</title></obj></td>
			<td><obj name="k" type="obj_checkbox"><title>SETTINGS::WRITE</title></obj></td>
			<td>{optional teamchat}<obj name="d" type="obj_checkbox"><title>SETTINGS::RENAME</title></obj>{/optional}</td>
			<td><obj name="x" type="obj_checkbox"><title>SETTINGS::DELETE</title></obj></td>
		</tr>
		<tr>
			<th class="th">{SHARING::ADMINISTRATION}</th>
			{optional teamchat}
				<td><obj name="b" type="obj_checkbox"><title>SETTINGS::INVITE</title></obj></td>
				<td><obj name="c" type="obj_checkbox"><title>SETTINGS::KICK</title></obj></td>
			{/optional}
			<td><obj name="a" type="obj_checkbox"><title>SETTINGS::ADMINISTER</title></obj></td>
		</tr>
	</table>
</div>
