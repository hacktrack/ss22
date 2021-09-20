<div class="popupmaindialog">
<table class="frmtbl">
{optional add}
<tr>
	<th class="th">{COMMON::EMAIL}</th>
	<td>
		<obj name="EMAIL" type="obj_input" focus="true" tabindex="true">
			<restrictions>
				<item>^([a-z0-9\'\!\#\$\%\&\+\-\/\=\?\^\_\`\{\|\}\~\*][\.]?)+\@[a-z0-9]+([\.\-\_]?[a-z0-9])*\.[a-z]{2,4}$</item>
				<item>{sPrimaryAccount}</item>
			</restrictions>
		</obj>
	</td>
</tr>
{/optional}
<tr>
	<th class="th">{FORM_ACCOUNTS::USERNAME}</th>
	<td>
		<obj name="USERNAME" type="obj_input" tabindex="true">
			<restrictions>^.+$</restrictions>
		</obj>
	</td>
</tr>
<tr>
	<th class="th">{FORM_ACCOUNTS::PASSWORD}</th>
	<td>
		<obj name="PASSWORD" type="obj_password" tabindex="true">
			<restrictions>^.+$</restrictions>
		</obj>
	</td>
</tr>
<tr><td colspan="2" class="space">&nbsp;</td></tr>
<tr>
	<th class="th">{FORM_ACCOUNTS::PROTOCOL}</th>
	<td>
		<obj name="PROTOCOL" type="obj_select" tabindex="true">
			<value>imap</value>
			<fill>
				<item key="imap">{ACCOUNT_TYPES::IMAP}</item>
				<item key="pop3">{ACCOUNT_TYPES::POP3}</item>
			</fill>
		</obj>
	</td>
</tr>
<tr>
	<th class="th">{FORM_ACCOUNTS::SERVER}</th>
	<td>
		<obj name="SERVER" type="obj_input" tabindex="true">
			<restrictions>.+</restrictions>
		</obj>
	</td>
</tr>
<tr>
	<th class="th">{FORM_ACCOUNTS::PORT}</th>
	<td>
		<obj name="PORT" type="obj_input" css="obj_input_small" tabindex="true">
			<restrictions>
				<item>&gt;0</item>
				<item>&lt;65536</item>
			</restrictions>
		</obj>
	</td>
</tr>
<tr><td colspan="2" class="space">&nbsp;</td></tr>
<tr>
	<th class="th">{SETTINGS::SENT_FOLDER}</th>
	<td class="td"><obj name="SENTFOLDER" type="obj_selectfolder" tabindex="true"><init><item></item><item>M</item><item>w</item></init></obj></td>
</tr>
<tr>
	<th class="th">{SETTINGS::TRASH_FOLDER}</th>
	<td class="td"><obj name="TRASHFOLDER" type="obj_selectfolder" tabindex="true"><init><item></item><item>M</item><item>w</item></init></obj></td>
</tr>
<tr><td colspan="2" class="space">&nbsp;</td></tr>
<tr>
	<th class="th">{FORM_ACCOUNTS::DESCRIPTION}</th>
	<td><obj name="DESCRIPTION" type="obj_input" tabindex="true"></obj></td>
</tr>
</table>
</div>