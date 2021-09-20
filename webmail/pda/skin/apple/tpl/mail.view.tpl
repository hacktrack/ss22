{anchor::mail.view.menu}
<form method="post" action="{request::path}" name="mail_view" target="_self">
	<input type="hidden" name="_c" value="item" />
	<input type="hidden" name="items[{item::id}]" value="on"/>
	<input type="hidden" name="container" value="{container::id}"/>
	<input type="hidden" name="type" value="{container::type}"/>
	<input type="hidden" name="_n[target]" value="{container::list_link}"/>



<div id="headers">
	<input type="hidden" id="aid" value="{htmlspecialchars item::aid}"/>
	<input type="hidden" id="reply_to" value="{dynamic item::aditional::reply_to}{optional *::caddress}{htmlspecialchars .*::caddress},{/optional}{/dynamic}"/>
	<input type="hidden" id="from" value="{dynamic item::aditional::from}{optional *::caddress}{htmlspecialchars .*::caddress},{/optional}{/dynamic}"/>
	<div class="fulldate">{item::aditional::fulldate}</div>
{optional item::html_new_window}<a href="{item::html_new_window}" target="_blank" title="{lang::form_buttons::show_html}">{lang::form_buttons::show_html}</a>{/optional}
	<table cellspacing="1" cellpadding="0"><!--class="pdawm_tab"-->
		<tr><th>{lang::email::from}</th>
			<td>{dynamic item::aditional::from}
				<a target="_self" href="?_n[p][main]=mail.compose&amp;to={htmlspecialchars .*::address}">{optional *::cdisplay}<strong>{htmlspecialchars .*::cdisplay}</strong><br />{htmlspecialchars .*::caddress}{/optional}{!optional *::cdisplay}{htmlspecialchars .*::caddress}{/optional}</a>{/dynamic}{!optional item::from}{lang::grid_mail::no_address}{/optional}
			</td>
		</tr>
		{optional item::aditional::cc}<tr><th>{lang::email::cc}</th><td>{dynamic item::aditional::cc}
					<a target="_self" href="?_n[p][main]=mail.compose&amp;to={htmlspecialchars .*::address}">{optional *::cdisplay}&quot;{htmlspecialchars .*::cdisplay}&quot;&lt;{htmlspecialchars .*::caddress}&gt;{/optional}{!optional *::cdisplay}{htmlspecialchars .*::caddress}{/optional}</a><br />
				{/dynamic}</td></tr>
		{/optional}
		
		{optional item::aditional::to_differs}
		{optional item::aditional::to}<tr><th>{lang::email::to}</th><td>{dynamic item::aditional::to}
					<a target="_self" href="?_n[p][main]=mail.compose&amp;to={htmlspecialchars .*::address}">{optional *::cdisplay}&quot;{htmlspecialchars .*::cdisplay}&quot;&lt;{htmlspecialchars .*::caddress}&gt;{/optional}{!optional *::cdisplay}{htmlspecialchars .*::caddress}{/optional}</a><br />
				{/dynamic}</td></tr>
		{/optional}
		{/optional}
		
		{optional item::attachments}
		<tr>
			<th class="attachments">{lang::attachment::attachments}</th>
			<td class="attachments">{dynamic item::attachments}<a class="attachment" href="{.*::link}"><span>({.*::size})</span><u>{htmlspecialchars .*::name}</u></a>{/dynamic}</td>
		</tr>{/optional}
		<tr><th class="subject">{lang::email::subject}</th>
		<td class="subject">{htmlspecialchars item::subject}{!optional item::subject}{lang::grid_mail::no_subject}{/optional}</td>
		</tr>
	</table>
</div>

<div class="separator"></div>

{optional item::plain_text_html}
<div id="body">{item::plain_text_html}</div>
{/optional}

<div class="actions moveToTop">
	<select name="multiple_mail_action_top">
		<option value="reply" >{lang::main_menu::reply_to_sender}</option>
		<option value="replytoall" >{lang::main_menu::reply_to_all}</option>
		<option value="forward" >{lang::main_menu::forward}</option>
		<option value="unread" >{lang::popup_items::mark_as_unread}</option>
		<option value="delete" >{lang::main_menu::delete}</option>
	</select>
	<input type="submit" name="_a[multiple_mail_action_top]" class="button blue ico_go" title="{lang::pda::go}" value="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" onclick="return confirm_select([['delete','{lang::confirmation::delete_mail}']],document.mail_view.multiple_mail_action_top);" />
</div>

</form>
<form method="post" target="_self" action="{info::link}">
<div class="d_compose">
	<h3>{lang::pda::fastre}</h3>
	<textarea name="_frm[html]" rows="5" cols="30">{optional item::fast_reply}{item::fast_reply}{/optional}{!optional item::fast_reply}{optional item::signature::text}{item::signature::text}{/optional}{/optional}</textarea>
</div>
				<input type="hidden" class="button" name="container" value="{container::id}" />
				<input type="hidden" class="button" name="type" value="{container::type}" />
				<input type="hidden" class="button" name="items[{item::id}]" value="on" />
				<input type="hidden" name="_frm[to]" value="{htmlspecialchars item::from}"/>
				<input type="hidden" name="_frm[subject]" value="Re: {htmlspecialchars item::subject}"/>
				
				<input type="hidden" name="_frm[options][type]" value="plain"/>
				<input type="hidden" value="item" name="_c"/>
				{anchor::mail.view.menu.reply}
</form>