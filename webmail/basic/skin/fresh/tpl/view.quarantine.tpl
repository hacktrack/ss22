{include ../basic/skin/fresh/tpl/_toolbar.top_quarantine.view.tpl}


<div class="body">

	<input type="hidden" name="_c" value="item" />
	<input type="hidden" name="items[{item::id}]" value="on"/>
	<input type="hidden" name="container" value="{container::id}"/>
	<input type="hidden" name="type" value="Q" />

	<table cellspacing="0" cellpadding="0" class="mailView" style="width:100%">
		<tr>
			<th class="mailHeader" style="width:200px">
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
									{optional item::all_headers}<a href="" id="showAllHeaders" class="noJSHide" title="{lang::mail_view::all_headers}">&nbsp;</a>{/optional}
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
					<a href="?_n[p][content]=mail.compose&amp;_n[p][main]=win.main.tree&amp;to={.*::address}">{optional *::cdisplay}&quot;{htmlspecialchars *::cdisplay}&quot;&lt;{htmlspecialchars *::caddress}&gt;{/optional}{!optional *::cdisplay}{htmlspecialchars *::caddress}{/optional}</a>
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
				<iframe id="mailFrame" name="mailFrame" title="Mail Content" frameborder="0" src="{htmlFrame::src}" style="width:100%"></iframe>
			</td>
		</tr>
		<tr>
			<td>
				<br />
				<div id="frsubmit" class="noJSShow">
					<input type="submit" value="{lang::mail_main::send_message}"  class="inp_btn" name="_a[fast_reply]"/>
				</div>
			</td>
		</tr>
	</table>

</div>