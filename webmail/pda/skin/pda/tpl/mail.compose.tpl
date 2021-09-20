<form id="item_list" action="" method="post">
	<input type="hidden" name="__sent" value="1" />
	<input type="hidden" name="namespace" value="wmmessage" />
	<input type="hidden" name="action" value="" />
	<input type="hidden" name="sid" value="{sid}" />
	<input type="hidden" name="folder" value="INBOX" />{optional item}
	<input type="hidden" name="item" value="{item}" />{/optional}
	<input type="hidden" name="view" value="mail_list" />
	<input type="hidden" name="error_view" value="mail_compose" />
	{obj::menu::menu1}
	<table class="compose" width="100%">
		<tr>
			<th width="0"><input type="submit" class="button" name="__a_addto" value="{lang::email::to}"/></th>
			<td width="100%"><input type="text" name="mail_to"{optional mail_to} value="{htmlspecialchars mail_to}"{/optional}/></td>
		</tr>
		<tr>
			<th><input type="submit" class="button" name="__a_addcc" value="{lang::email::cc}"/></th>
			<td><input type="text" name="mail_cc"{optional mail_cc} value="{htmlspecialchars mail_cc}"{/optional}/></td>
		</tr>
		<tr>
			<th><input type="submit" class="button" name="__a_addbcc" value="{lang::datagrid_items_view::bcc}"/></th>
			<td><input type="text" name="mail_bcc"{optional mail_bcc} value="{htmlspecialchars mail_bcc}"{/optional}/></td>
		</tr>
		<tr>
			<th>{lang::email::subject}</th>
			<td><input type="text" name="mail_subject"{optional mail_subject} value="{htmlspecialchars mail_subject}"{/optional}/></td>
		</tr>
		<tr>
			<td colspan="2" width="100%"><textarea name="mail_body" rows="10" cols="25" width="100%" style="width: 100%;">{optional mail_body}{htmlspecialchars mail_body}{/optional}</textarea></td>
		</tr>
</table>
{include ../server/interface/skin/pda/template/menu/compose2.tpl}
</form>