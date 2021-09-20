
{optional item::html_new_window}<a href="{item::html_new_window}" target="_blank" title="{lang::form_buttons::show_html}">{lang::form_buttons::show_html}</a>{/optional}<form method="post" action="{request::path}" target="_self">
	<input type="hidden" name="_c" value="mailview" />
	<input type="hidden" name="items[{item::id}]" value="on"/>
	<input type="hidden" name="container" value="{container::id}"/>
<div id="headers">
	<table>
		<tr><td colspan="2"><strong class="subject">{htmlspecialchars item::subject}{!optional item::subject}{lang::grid_mail::no_subject}{/optional}</strong></td></tr>
		<tr><th>{lang::email::from}</th><td>{dynamic item::aditional::from}
					<a target="_self" href="?_n[p][main]=mail.compose&amp;to={.*::address}">{optional *::cdisplay}&quot;{.*::cdisplay}&quot;&lt;{.*::caddress}&gt;{/optional}{!optional *::cdisplay}{.*::caddress}{/optional}</a>{/dynamic}{!optional item::from}{lang::grid_mail::no_address}{/optional}</td></tr>
		{optional item::aditional::toshowpda}<tr><th>{lang::email::to}</th><td>{dynamic item::aditional::to}
					<a target="_self" href="?_n[p][main]=mail.compose&amp;to={.*::address}">{optional *::cdisplay}&quot;{.*::cdisplay}&quot;&lt;{.*::caddress}&gt;{/optional}{!optional *::cdisplay}{.*::caddress}{/optional}</a>
				{/dynamic}</td></tr>{/optional}<tr><th>{lang::email::date}</th><td>{item::aditional::fulldate}</td></tr>
		{optional item::attachments}
		<tr><th>{lang::attachment::attachments}</th>
		<td>{dynamic item::attachments}<a href="{.*::link}">{.*::name}({.*::size} kB)</a><br/>{/dynamic}</td></tr>
		{/optional}
	</table>
</div>


{optional item::plain_text_html}<div id="body">{item::plain_text_html}</div>{/optional}
<form method="post" action="?_n[p][main]=mail.compose&_n[w]=main">
<input type="hidden" value="item" name="_c"/>
<input type="hidden" name="container" value="{container::id}"/>
<input type="hidden" name="type" value="{container::type}"/>

<div class="buttons">
	<a target="_self" href="?_n[p][main]=mail.compose&amp;_n[w]=main&amp;_s[action]=reply&amp;_s[id]={container::id}&amp;_s[item]={item::id}" class="button" id="replyMail">{lang::main_menu::reply_to_sender}</a>
	<a target="_self"  href="?_n[p][main]=mail.compose&amp;_n[w]=main&amp;_s[action]=replytoall&amp;_s[id]={container::id}&amp;_s[item]={item::id}" class="button" id="replyMail">{lang::main_menu::reply_to_all}</a>
	<a target="_self"  href="?_n[p][main]=mail.compose&amp;_n[w]=main&amp;_s[action]=forward&amp;_s[id]={container::id}&amp;_s[item]={item::id}" class="button" id="forwardMail">{lang::popup_items::forward}</a>

	<input type="submit" class="button" value="{lang::popup_items::mark_as_unread}" name="_a[unread]" />
	<input type="submit" class="button" value="{lang::popup_items::delete}" onclick="return confirm('{lang::confirmation::delete_mail}');" name="_a[delete]" />
</div>


</form>