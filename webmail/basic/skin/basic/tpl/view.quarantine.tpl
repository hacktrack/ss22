<div class="cover-b wsto quarantineBox">
<div id="cover_a"><div id="cover_b">
<div class="commandLine">
	<div class="right">
		<a title="{lang::mail_view::prev}" href="{!optional navigation::prev}#{/optional}{optional navigation::prev}{navigation::prev}{/optional}" class="fancyButton left{!optional navigation::prev} disabled{/optional}"><span>&lt;&lt;</span></a>
		<a title="{lang::mail_view::next}" href="{!optional navigation::next}#{/optional}{optional navigation::next}{navigation::next}{/optional}" class="fancyButton left{!optional navigation::next} disabled{/optional}"><span>&gt;&gt;</span></a>
	</div>

	<div>
		<form method="post" action="{request::path}">
			<div>
				<input type="hidden" name="_c" value="item" />
				<input type="hidden" name="items[{item::id}]" value="on"/>
				<input type="hidden" name="container" value="{container::id}"/>
				<input type="hidden" name="type" value="Q" />
				
				<input class="fancyButton" style="margin:0px;margin-right:4px;" type="submit" value="{lang::mail_main::deliver}" name="_a[deliver]"/>
				<input class="fancyButton" style="margin:0px;margin-right:4px;" type="submit" value="{lang::mail_main::whitelist}" name="_a[whitelist]"/>
				<input class="fancyButton" style="margin:0px;margin-right:4px;" type="submit" value="{lang::mail_main::blacklist}" name="_a[blacklist]"/>
				<input class="fancyButton" style="margin:0px;margin-right:4px;" type="submit" value="{lang::mail_main::delete}" name="_a[delete]" alt="{lang::confirmation::delete_this_mail}"/>
				
<!--
				<a href="?_n[p][content]=view.quarantine&amp;_n[p][main]=win.main.tree&amp;_s[action]=deliver&amp;_s[id]={container::id}&amp;_s[item]={item::id}" class="fancyButton left" id="replyMail">{lang::mail_main::deliver}</a>
				<a href="?_n[p][content]=view.quarantine&amp;_n[p][main]=win.main.tree&amp;_s[action]=whitelist&amp;_s[id]={container::id}&amp;_s[item]={item::id}" class="fancyButton left" id="replyMail">{lang::mail_main::whitelist}</a>
				<a href="?_n[p][content]=view.quarantine&amp;_n[p][main]=win.main.tree&amp;_s[action]=blacklist&amp;_s[id]={container::id}&amp;_s[item]={item::id}" class="fancyButton left" id="replyMail">{lang::mail_main::blacklist}</a>
				<a href="?_n[p][content]=view.quarantine&amp;_n[p][main]=win.main.tree&amp;_s[action]=delete&amp;_s[id]={container::id}&amp;_s[item]={item::id}" class="fancyButton left" id="replyMail">{lang::mail_main::delete}</a>
-->
			</div>
		</form>
	</div>

</div>
<div id="sizerWatcher" class="wsto" >

<div class="wsto spacer ">



<div class="grid obj_datagrid2 right wsto">
<!--
	<div>
		<a title="{lang::mail_view::next}" href="{!optional navigation::next}#{/optional}{optional navigation::next}{navigation::next}{/optional}" class="mailNext{!optional navigation::next}Disabled{/optional} right"></a>
		<a title="{lang::mail_view::prev}" href="{!optional navigation::prev}#{/optional}{optional navigation::prev}{navigation::prev}{/optional}" class="mailPrev{!optional navigation::prev}Disabled{/optional}"></a>
		<div class="cleaner"></div>
	</div>
	<br />
-->

	<div class="into-bottom-line-right" style="padding-top:12px; .padding-top:8px;">
		<a title="{lang::mail_view::prev}" href="{!optional navigation::prev}#{/optional}{optional navigation::prev}{navigation::prev}{/optional}" class="fancyButton left{!optional navigation::prev} disabled{/optional}"><span>&lt;&lt;</span></a>
		<a title="{lang::mail_view::next}" href="{!optional navigation::next}#{/optional}{optional navigation::next}{navigation::next}{/optional}" class="fancyButton left{!optional navigation::next} disabled{/optional}"><span>&gt;&gt;</span></a>
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
									{item::aditional::fulldate}&nbsp;
								</td>
								<td>
									{optional item::priority}<span class="ico_priority_{item::priority}">&nbsp;</span>{/optional}
								</td>
								<td>
									<a href="" id="showAllImages" class="noJSHide" title="{lang::mail_view::all_headers}">&nbsp;</a>
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
						<a href="?_l=folder&p0=main&p1=content&p2=contact.detail&p3=item.fdr&p4={settings::default_folders::contacts}&_n[p][main]=win.main.tree&p5=C{optional *::display}&amp;cname={*::display}{/optional}{optional *::address}&amp;mail={*::address}{/optional}">[+]</a>
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
					<a href="?_n[p][content]=mail.compose&amp;_n[p][main]=win.main.tree&amp;to={*::address}">{optional *::cdisplay}&quot;{*::cdisplay}&quot;&lt;{*::caddress}&gt;{/optional}{!optional *::cdisplay}{*::caddress}{/optional}</a>
					<a href="?_l=folder&p0=main&p1=content&p2=contact.detail&p3=item.fdr&p4={settings::default_folders::contacts}&_n[p][main]=win.main.tree&p5=C{optional *::display}&amp;cname={*::display}{/optional}{optional *::address}&amp;mail={*::address}{/optional}">[+]</a>
				{/dynamic}
				</div>
			</td>
		</tr>
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
							{htmlspecialchars *::name}<br />
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
	</table>

</div>


<div class="cleaner"></div>
</div>
</div>
</div>
</div>
</div>