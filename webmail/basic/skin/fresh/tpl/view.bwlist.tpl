{include ../basic/skin/fresh/tpl/_toolbar.top_view.bwlist.tpl}

<div class="body form">

	<input type="hidden" name="_c" value="item" />
	<input type="hidden" name="items[{item::id}]" value="on"/>
	<input type="hidden" name="container" value="{container::id}"/>
	<input type="hidden" name="type" value="{container::type}"/>
	<input type="hidden" name="_s[id]" value="{container::id}"/>
	<input type="hidden" name="_s[type]" value="{container::type}"/>

	<table cellspacing="0" cellpadding="0">
		<tr><td colspan="2"><h2>{lang::quarantine::new_item}</h2></td></tr>
		<tr>
			<td>{lang::settings::email} :&nbsp;</td><td><input type="text" name="email" class="inp_text"/></td>
		</tr>
	</table>

</div>

{include ../basic/skin/fresh/tpl/_toolbar.bottom_view.bwlist.tpl}