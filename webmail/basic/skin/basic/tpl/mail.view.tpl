{optional item::unread}
{optional item::confirm_addr}
<center id="messageBox" class="from_content">
<form action="" method="post">
<div class="message_left">
	<div class="message_right">
		<div id="message" class="noslide">
			{lang::mail_main::src}
			<input type="hidden" value="item" name="_c"/>
			<input type="hidden" value="{container::id}" name="container"/>
			<input type="hidden" value="{container::type}" name="type"/>
			<input type="hidden" value="{item::id}" name="_s[item]"/>
			<input type="submit" class="fancyButton fancyButtonInline" value="{lang::common::yes}" name="_a[request_read]"/>
			<input type="submit" class="fancyButton fancyButtonInline" value="{lang::common::no}" name="no_request_read"/>
		</div>
		<div id="message_details">
		</div>
	</div>
</div>
</form>
</center>
{/optional}
{/optional}

<div class="cover-b wsto">
<div id="cover_a"><div id="cover_b">
<div class="commandLine">
	<div class="right">
		<a title="{lang::mail_view::prev}" href="{!optional navigation::prev}#{/optional}{optional navigation::prev}{navigation::prev}{/optional}" class="fancyButton left{!optional navigation::prev} disabled{/optional}"><span>&lt;</span></a>
		<a title="{lang::mail_view::next}" href="{!optional navigation::next}#{/optional}{optional navigation::next}{navigation::next}{/optional}" class="fancyButton left{!optional navigation::next} disabled{/optional}"><span>&gt;</span></a>
	</div>

	<div>
		<form method="post" action="{htmlspecialchars request::path}">
			<div>
				<input type="hidden" name="_c" value="mailview" />
				<input type="hidden" name="items[{item::id}]" value="on"/>
				<input type="hidden" name="container" value="{container::id}"/>

				<a href="?_n[p][content]=mail.compose&amp;_n[p][main]=win.main.tree&amp;_s[action]=reply&amp;_s[id]={container::id}&amp;_s[item]={item::id}" class="fancyButton left" id="replyMail">{lang::mail_main::reply}</a>
				<a href="?_n[p][content]=mail.compose&amp;_n[p][main]=win.main.tree&amp;_s[action]=replytoall&amp;_s[id]={container::id}&amp;_s[item]={item::id}" class="fancyButton left" id="replyMail">{lang::mail_main::reply_to_all}</a>

				<a href="?_n[p][content]=mail.compose&amp;_n[p][main]=win.main.tree&amp;_s[action]=forward&amp;_s[id]={container::id}&amp;_s[item]={item::id}" class="fancyButton left" id="forwardMail">{lang::mail_main::forward}</a>
				<input type="submit" value="{lang::mail_main::delete}" class="fancyButton left" name="_a[delete]" alt="{lang::confirmation::delete_this_mail}"/>
				<a href="{htmlFrame::src}" class="fancyButton" target="_blank" id="printMail">{lang::mail_main::print}</a>
				{optional item::block_external}<a href="?_l=item&p0=main&p1=content&p2=mail.view&p3=item.fdr&p4={container::id}&p5={container::type}&p6={item::id}&show_external_images=1" class="fancyButton" id="showExternalImages">{lang::mail_view::show_external_images}</a>{/optional}
			</div>
		</form>
	</div>

</div>
<div id="sizerWatcher" class="wsto">

<div class="wsto spacer ">



<div class="grid obj_datagrid2 right wsto">

	<div class="into-bottom-line-right" style="padding-top:12px; .padding-top:8px;">
		<a title="{lang::mail_view::prev}" href="{!optional navigation::prev}#{/optional}{optional navigation::prev}{navigation::prev}{/optional}" class="fancyButton left{!optional navigation::prev} disabled{/optional}"><span>&lt;</span></a>
		<a title="{lang::mail_view::next}" href="{!optional navigation::next}#{/optional}{optional navigation::next}{navigation::next}{/optional}" class="fancyButton left{!optional navigation::next} disabled{/optional}"><span>&gt;</span></a>
	</div>

	<table cellspacing="0" cellpadding="0" class="mailView">
		<tr>
			<th class="mailHeader">
				{lang::mail_view::subject}:
			</th>
			<td>
				<div>
					<span class="right">
						<table cellpadding="0" cellspacing="0">
							<tr>
								<td>
									{item::aditional::fulldate}
								</td>
								<td>
									{optional item::priority}<span class="ico_priority_{item::priority}">&nbsp;</span>{/optional}
								</td>
								<td>
									<a href="" id="showAllImages" class="noJSHide" title="{lang::mail_view::all_images}">&nbsp;</a>
									<a href="" id="showAllHeaders" class="noJSHide" title="{lang::mail_view::all_headers}">&nbsp;</a>
								</td>
							</tr>
						</table>
					</span>
					<b>{htmlspecialchars item::subject}</b>{!optional item::subject}<span class="gray">{lang::mail_main::no_subject}</span>{/optional}
				</div>
			</td>
		</tr>
		<tr>
			<th class="mailHeader">
				{lang::mail_view::from}
			</th>
			<td>
				<div>
					<a href="?_n[p][content]=mail.compose&amp;_n[p][main]=win.main.tree&amp;to={item::UEfrom}">{htmlspecialchars item::from}</a>
					{dynamic item::aditional::from}
						<a href="?_l=folder&p0=main&p1=content&p2=contact.detail&p3=item.fdr&p4={settings::default_folders::contacts}&_n[p][main]=win.main.tree&p5=C{optional *::display}&amp;cname={.*::display}{/optional}{optional *::address}&amp;mail={.*::address}{/optional}">[+]</a>
					{/dynamic}
				</div>
			</td>
		</tr>
		<tr>
			<th class="mailHeader">
				{lang::mail_main::to}:
			</th>
			<td>
				<div>
				{!optional item::aditional::to}
					<span class="gray">{lang::mail_main::no_address}</span>
				{/optional}
				{dynamic item::aditional::to}
					<a href="?_n[p][content]=mail.compose&amp;_n[p][main]=win.main.tree&amp;to={optional *::cdisplay}&quot;{htmlspecialchars *::cdisplay}&quot;&lt;{htmlspecialchars *::caddress}&gt;{/optional}{!optional *::cdisplay}{htmlspecialchars *::caddress}{/optional}">{optional *::cdisplay}&quot;{htmlspecialchars *::cdisplay}&quot;&lt;{htmlspecialchars *::caddress}&gt;{/optional}{!optional *::cdisplay}{htmlspecialchars *::caddress}{/optional}</a>
					<a href="?_l=folder&p0=main&p1=content&p2=contact.detail&p3=item.fdr&p4={settings::default_folders::contacts}&_n[p][main]=win.main.tree&p5=C{optional *::display}&amp;cname={.*::display}{/optional}{optional *::address}&amp;mail={.*::address}{/optional}">[+]</a>
				{/dynamic}
				</div>
			</td>
		</tr>
		{optional item::cc}
		<tr>
			<th class="mailHeader">
				{lang::mail_view::cc}
			</th>
			<td>
				<div>
					<a href="?_n[p][content]=mail.compose&amp;_n[p][main]=win.main.tree&amp;to={item::cc}">{htmlspecialchars item::cc}</a>
					{dynamic item::aditional::cc}
						<a href="?_l=folder&p0=main&p1=content&p2=contact.detail&p3=item.fdr&p4={settings::default_folders::contacts}&_n[p][main]=win.main.tree&p5=C{optional *::display}&amp;cname={.*::display}{/optional}{optional *::address}&amp;mail={.*::address}{/optional}">[+]</a>
					{/dynamic}
				</div>
			</td>
		</tr>
		{/optional}
		
		{optional item::attachments}
		<tr>
			<td colspan="2">&nbsp;</td>
		</tr>
		<tr>
			<th class="mailHeader">
				{lang::mail_view::attachments}:
			</th>
			<td>
				{optional item::attachments}
					<div>
						{dynamic item::attachments}
							<a href="{.*::link}" title="{htmlspecialchars *::name}">{htmlspecialchars *::name} ({htmlspecialchars *::size})</a><br />
						{/dynamic}
					</div>
				{/optional}
			</td>
		</tr>
		{/optional}

		{optional item::all_headers}
		<tr>
			<td colspan="2"><textarea class="hidden wsto" id="allHeaders">{item::all_headers}</textarea></td>
		</tr>
		{/optional}

		<tr>
			<td colspan="2">&nbsp;</td>
		</tr>
		<tr>
			<td class="mailItSelf" colspan="2">
				<iframe id="mailFrame" name="mailFrame" title="Mail Content" frameborder="0" src="{htmlFrame::src}"></iframe>
			</td>
		</tr>
		<tr>
			<td class="mailHeader" colspan="2">
			<br />
				<form method="post" action="?_n[p][content]=mail.compose&_n[p][main]=win.main.tree">
				<input type="hidden" name="_c" value="item" />
				<input type="hidden" value="{container::id}" name="container"/>
				<input type="hidden" name="items[{item::id}]" value="on"/>
				<b>{lang::mail_main::fast_reply}</b>
				<textarea name="_frm[html]" class="wh replyarea">{optional item::fast_reply}{item::fast_reply}{/optional}{!optional item::fast_reply}{optional item::signature::text}

{item::signature::text}
{/optional}{/optional}</textarea>

				<input type="hidden" name="_frm[to]" value="{htmlspecialchars item::from}"/>
				<input type="hidden" name="_frm[subject]" value="Re: {htmlspecialchars item::subject}"/>
				<input type="hidden" name="_frm[options][type]" value="plain"/>
				<div id="frsubmit" class="noJSShow">
				<input type="submit" value="{lang::mail_main::send_message}"  class="wh fancyButton fancyButtonLeft" name="_a[fast_reply]"/>
				</div>
				</form>
			</td>
		</tr>
	</table>

</div>


<div class="cleaner"></div>
</div>
</div>
</div>
</div>
</div>