{include ../basic/skin/fresh/tpl/_toolbar.top_mail.view.tpl}

<div class="body mailview">
	<input type="hidden" id="reply_to" value="{dynamic item::aditional::reply_to}{optional *::caddress}{htmlspecialchars .*::caddress},{/optional}{/dynamic}"/>
	<input type="hidden" id="from" value="{dynamic item::aditional::from}{optional *::caddress}{htmlspecialchars .*::caddress},{/optional}{/dynamic}"/>
	<table class="frmtbl frmtbl100">
		<tr>
			<th class="rbig">{lang::mail_view::from}:</th>
			<td>
				<a href="?_n[p][content]=mail.compose&amp;_n[p][main]=win.main.tree&amp;to={htmlspecialchars item::UEfrom}">{htmlspecialchars item::from}</a>
				{dynamic item::aditional::from}
				<a href="?_l=folder&p0=main&p1=content&p2=contact.detail&p3=item.fdr&p4={settings::default_folders::contacts}&_n[p][main]=win.main.tree&p5=C{optional *::display}&amp;cname={.*::display}{/optional}{optional *::address}&amp;mail={.*::address}{/optional}">[+]</a>
				{/dynamic}
			</td>
			<th rowspan="2">
				<a href="#" id="showAllHeaders" class="button" title="{lang::mail_view::all_headers}">{lang::mail_view::detail}</a>
			</th>
		</tr>
		<tr>
		    <th>{lang::mail_main::to}:</th>
		    <td id="to_header">
				{!optional item::aditional::to}
					<span>{lang::mail_main::no_address}</span>
				{/optional}
				{dynamic item::aditional::to}
					<span class="mail_item" style="white-space:normal">
						<span style="white-space:normal">
						<a href="?_n[p][content]=mail.compose&amp;_n[p][main]=win.main.tree&amp;to={.*::address}">{optional *::cdisplay}&quot;{htmlspecialchars *::cdisplay}&quot;&lt;{htmlspecialchars *::caddress}&gt;{/optional}{!optional *::cdisplay}{htmlspecialchars *::caddress}{/optional}</a>
						<a href="?_l=folder&p0=main&p1=content&p2=contact.detail&p3=item.fdr&p4={settings::default_folders::contacts}&_n[p][main]=win.main.tree&p5=C{optional *::display}&amp;cname={.*::display}{/optional}{optional *::address}&amp;mail={.*::address}{/optional}">[+]</a>
						</span>
					</span>
				{/dynamic}
				<span style="display:none;" id="show_all"><a href="#">[{lang::mail_main::show_all}]</a></span>
			</td>
		</tr>
		{optional item::cc}
		<tr>
			<th>{lang::mail_view::cc}</th>
			<td colspan="3">
				{dynamic item::aditional::cc}
					<a href="?_n[p][content]=mail.compose&amp;_n[p][main]=win.main.tree&amp;to={.*::address}">{optional *::cdisplay}&quot;{htmlspecialchars *::cdisplay}&quot;&lt;{htmlspecialchars *::caddress}&gt;{/optional}{!optional *::cdisplay}{htmlspecialchars *::caddress}{/optional}</a>
					<a href="?_l=folder&p0=main&p1=content&p2=contact.detail&p3=item.fdr&p4={settings::default_folders::contacts}&_n[p][main]=win.main.tree&p5=C{optional *::display}&amp;cname={.*::display}{/optional}{optional *::address}&amp;mail={.*::address}{/optional}">[+]</a>
				{/dynamic}
			</td>
		</tr>
		{/optional}
		{optional item::bcc}
		<tr>
			<th>{lang::mail_view::bcc}</th>
			<td colspan="3">
				<a href="?_n[p][content]=mail.compose&amp;_n[p][main]=win.main.tree&amp;to={htmlspecialchars item::bcc}">{htmlspecialchars item::bcc}</a>
				{dynamic item::aditional::bcc}
				<a href="?_l=folder&p0=main&p1=content&p2=contact.detail&p3=item.fdr&p4={settings::default_folders::contacts}&_n[p][main]=win.main.tree&p5=C{optional *::display}&amp;cname={.*::display}{/optional}{optional *::address}&amp;mail={.*::address}{/optional}">[+]</a>
				{/dynamic}
			</td>
		</tr>
		{/optional}
	</table>

    <!-- full headers -->
	{optional item::all_headers}<pre class="hidden" id="allHeaders">{htmlspecialchars item::all_headers}</pre>{/optional}

	<h2>{optional item::priority}<span class="ico_priority_{item::priority}"></span>{/optional}{!optional item::subject}<span class="gray">{lang::mail_main::no_subject}</span>{/optional}{htmlspecialchars item::subject}</h2>
	<h3>
		<span class="iconBox flags {optional item::color} flag{item::color}{/optional}{!optional item::color} flagZ{/optional}" title="{optional item::color}{item::color}{/optional}{!optional item::color}Z{/optional}|{item::id}"><span></span></span>
		{item::aditional::fulldate}
	</h3>
	
	<div class="nowrap">
		{optional item::tags}
			{dynamic item::tags}
				<em class="tag withtext{optional *::light} light{/optional}" style="background-color:{htmlspecialchars *::color}" title="{htmlspecialchars *::tag}">{htmlspecialchars *::tag}</em>
			{/dynamic}
		{/optional}
	</div>

	{optional item::attachments}
	<table class="frmtbl frmtbl100 tblatt">
		<tr>
			<th class="rbig">{lang::mail_view::attachments}:</th>
			<td>
				{optional item::attachments}
					<div>
						{dynamic item::attachments}
							<a href="{optional *::smart 1}{.*::url}{/optional}{!optional *::smart 1}{.*::link}{/optional}" title="{htmlspecialchars *::name}" class="ico_{htmlspecialchars .*::extension}">{htmlspecialchars *::name} ({htmlspecialchars *::size})</a>
						{/dynamic}
					</div>
				{/optional}
			</td>
			<th class="lspace">
				<a href="#" id="showAllImages" class="button" title="{lang::mail_view::all_images}">{lang::mail_view::all_images}</a>
			</th>
		</tr>
		{optional request::all::devel}
		<tr>
			<td colspan="2">
				{optional item::attachments}
					{dynamic item::attachments}
						{optional *::extension 'jpg'}<div class="imagePreview"><img src="{.*::preview}" /></div>{/optional}
						{optional *::extension 'jpeg'}<div class="imagePreview"><img src="{.*::preview}" /></div>{/optional}
						{optional *::extension 'png'}<div class="imagePreview"><img src="{.*::preview}" /></div>{/optional}
					{/dynamic}
				{/optional}
			</td>
		</tr>
		{/optional}
	</table>
	{/optional}
	
	{!optional item::arrayinfo::valid}
		<fieldset class="redbox">
			<h3>{lang::exceptions::unverified_signature}</h3>
		</fieldset>
	{/optional}
	
	{optional item::imip}
		<fieldset class="bluebox">
			<h3>{item::imip::title}</h3>
			{optional item::imip::hr::start}
			<div><strong>{lang::mail_view::blue_box_start}:</strong> {item::imip::hr::start}</div>
			{/optional}
			{optional item::imip::hr::end}
			<div><strong>{lang::mail_view::blue_box_end}:</strong> {item::imip::hr::end}</div>
			{/optional}
			
			{optional item::imip::description}
			<hr />
			<strong>{lang::mail_view::blue_box_description}:</strong>
			<div>{item::imip::description}</div>
			{/optional}
			<input type="hidden" value="{item::imip::uid}"/>
			{optional item::imip::method 'request'}
			<div class="controls">
				{optional item::imip::part_id}<input type="hidden" name="part_id" class="inp_btn right" value="{item::imip::part_id}" />{/optional}
				<input type="submit" name="_a[decline]" class="inp_btn right" value="{lang::mail_view::blue_box_decline}" />
				<input type="submit" name="_a[accept]" class="inp_btn right mrbig" value="{lang::mail_view::blue_box_accept}" />
			</div>
			{/optional}
			{optional item::imip::method 'counter'}
			<div class="controls">
				<input type="submit" name="_a[decline_counter]" class="inp_btn right" value="{lang::mail_view::blue_box_decline}" />
				<input type="submit" name="_a[accept_counter]" class="inp_btn right mrbig" value="{lang::mail_view::blue_box_accept}" />
			</div>
			{/optional}
		</fieldset>
	{/optional}
	{optional item::x_icewarp_server_request}
		{optional item::x_icewarp_server_request::method 'subscribe'}
			<fieldset class="bluebox">
				<h3>{htmlspecialchars item::x_icewarp_server_request::title}</h3>
				<br />
				<table>
					<tr>
						<td><strong>{lang::mail_view::folder_rights}:</strong></td>
						<td>&nbsp;</td>
						<td>
							{optional item::x_icewarp_server_request::rights_exploded::l}{lang::mail_view::read},{/optional}
							{optional item::x_icewarp_server_request::rights_exploded::k}{lang::mail_view::write},{/optional}
							{optional item::x_icewarp_server_request::rights_exploded::x}{lang::mail_view::delete},{/optional}
							{optional item::x_icewarp_server_request::rights_exploded::a}{lang::mail_view::administer}{/optional}
						</td>
					</tr>
					<tr>
						<td><strong>{lang::mail_view::items_rights}:</strong></td>
						<td>&nbsp;</td>
						<td>
							{optional item::x_icewarp_server_request::rights_exploded::r}{lang::mail_view::read},{/optional}
							{optional item::x_icewarp_server_request::rights_exploded::i}{lang::mail_view::write},{/optional}
							{optional item::x_icewarp_server_request::rights_exploded::w}{lang::mail_view::modify},{/optional}
							{optional item::x_icewarp_server_request::rights_exploded::t}{lang::mail_view::delete}{/optional}
						</td>
					</tr>
				</table>
				
				<div class="controls">
					<input type="hidden" name="subscribe_account" value="{item::x_icewarp_server_request::user}"/>
					<input type="hidden" name="subscribe_folder" value="{item::x_icewarp_server_request::folder}"/>
					<input type="submit" name="_a[subscribe_account]" class="inp_btn right" value="{lang::mail_view::blue_box_subscribe_account}" />
					<input type="submit" name="_a[subscribe_folder]" class="inp_btn right mrbig" value="{lang::mail_view::blue_box_subscribe_folder}" />
				</div>
			</fieldset>
		{/optional}
	{/optional}

	{optional item::unread}
	{optional item::confirm_addr}
	<input type="hidden" value="item" name="_c"/>
	<input type="hidden" value="{container::id}" name="container"/>
	<input type="hidden" value="{container::type}" name="type"/>
	<input type="hidden" value="{item::id}" name="_s[item]"/>
	<input type="submit" class="inp_btn big read_confirm infobox" value="{lang::mail_main::src}" name="_a[request_read]"/>
	{/optional}
	{/optional}

	{optional item::block_external}<a href="?_l=item&p0=main&p1=content&p2=mail.view&p3=item.fdr&p4={container::id}&p5={container::type}&p6={item::id}&show_external_images=1" class="button infobox" id="showExternalImages">{lang::mail_view::show_external_images}</a><br /><br />{/optional}

	<!-- mail -->
	<div class="mailFrame" style="">
		<iframe id="mailFrame" name="mailFrame" title="Mail Content" frameborder="0" src="{htmlFrame::src}" style=""></iframe>
	</div>

</div>


<div class="body form">
	<h2>{lang::mail_main::fast_reply}</h2>
	<table class="frmtbl frmtbl100">
		<tr>
			<td class="mailHeader" colspan="2">
				<input type="hidden" name="_frm[rfc_time]" id="timeInput" />
				<input type="hidden" name="_c" value="item" />
				<input type="hidden" value="{container::id}" name="container"/>
				<input type="hidden" name="items[{item::id}]" value="on"/>
				<textarea name="_frm[html]" class="wh replyarea">{optional item::fast_reply}{item::fast_reply}{/optional}{!optional item::fast_reply}{optional item::signature::text}{item::signature::text}{/optional}{/optional}</textarea>
				<input type="hidden" name="_frm[to]" value="{htmlspecialchars item::from}"/>
				<input type="hidden" name="_frm[subject]" value="Re: {htmlspecialchars item::subject}"/>
				<input type="hidden" name="_frm[options][type]" value="plain"/>
			</td>
		</tr>
		<tr>
			<td>
				<div id="frsubmit" class="noJSShow">
					<input type="submit" value="{lang::mail_main::send_message}"  class="inp_btn" name="_a[fast_reply]"/>
				</div>
			</td>
		</tr>
	</table>
</div>

{include ../basic/skin/fresh/tpl/_toolbar.bottom_mail.view.tpl}