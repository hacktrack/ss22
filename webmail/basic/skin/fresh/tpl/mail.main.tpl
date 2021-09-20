{include ../basic/skin/fresh/tpl/_toolbar.top_mail.main.tpl}

<div class="body">
	<!-- datagrid -->
	<table class="datagrid" id="datagrid">
		<thead>
			<tr>
				<th class="th_check"><span>&nbsp;</span></th>
				<th class="th_check" colspan="2" style="width:50px"><span>&nbsp;</span></th>
				<th style="width: 30%"><span>{!optional container::isSent}{lang::mail_main::from}{/optional}{optional container::isSent}{lang::mail_main::to}{/optional}</span></th>
				<th style="width: 55%"><span>{lang::mail_main::subject}</span></th>
				<th class="th_check"><span>&nbsp;</span></th>
				<th style="width: 140px"><span>{lang::mail_main::received}</span></th>
			</tr>
		</thead>
		<tbody>
		{dynamic items}
			<tr{optional *::recent} class="recent bold"{/optional}>
				<td>
					<input class="inp_check" type="checkbox" name="{variable}[{.*::id}]"{optional *::checked} checked="checked"{/optional} value="on"/>
				</td>
				<td class="iconBox ico_mail_sf_{.*::smime_status}">
					<a class="icon" href="{.*::link}">
						{optional *::forwarded}
						<span class="flag_forward">
							{optional *::answered}<span class="flag_reply"></span>{/optional}
						</span>
						{/optional}
						{!optional *::forwarded}
							{optional *::answered}<span class="flag_reply"></span>{/optional}
						{/optional}
					</a>
				</td>
				<td class="iconBox {optional *::has_attachment 'true'}ico_att{/optional}">
					<div class="{optional *::priority}ico_priority_{.*::priority}{/optional}">
						<div class="{optional *::signed}ico_signed{/optional}"></div>
					</div>
				</td>
				<td>
					{!optional container::isSent}
					<a href="{.*::link}" title="{.*::from}">{htmlspecialchars .*::aditional::fromshow}</a>
					{/optional}
					{optional container::isSent}
					<a href="{.*::link}" title="{htmlspecialchars.*::to}">{htmlspecialchars .*::aditional::toshow}</a>
					{!optional *::aditional::toshow}<a href="{.*::link}" title="{lang::mail_main::no_address}"><span class="gray">{lang::mail_main::no_address}</span></a>{/optional}
					{/optional}
				</td>
				<td>
					{dynamic *::tags}
						<em class="tag" style="background-color:{.*::color}" title="{htmlspecialchars .*::tag}"></em>
					{/dynamic}
					<a href="{.*::link}" title="{.*::subject}">{!optional *::subject}<span class="gray">{lang::mail_main::no_subject}</span>{/optional}{.*::subject}</a>
				</td>
				<td class="iconBox flags {optional *::color} flag{.*::color}{/optional}{!optional *::color} flagZ{/optional}" title="{optional *::color}{.*::color}{/optional}{!optional *::color}Z{/optional}|{.*::id}"><div></div></td>
				<td><a href="{.*::link}" title="{.*::aditional::fulldate}">{.*::aditional::date}</a></td>
			</tr>
		{/dynamic}
		</tbody>
		{!optional items}
		<tfoot>
			<tr>
				<td colspan="7">
					{lang::string::no_item}
				</td>
			</tr>
		</tfoot>
		{/optional}
	</table>
</div>

<input type="hidden" id="sid" value="{htmlspecialchars info::sid}"/>
<input type="hidden" id="uid" value="{htmlspecialchars info::uid}"/>
<input type="hidden" id="fid" value="{htmlspecialchars container::id}"/>


{include ../basic/skin/fresh/tpl/_toolbar.bottom_mail.main.tpl}