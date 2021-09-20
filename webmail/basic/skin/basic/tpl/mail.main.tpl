<div class="cover-b wsto">

<div class="grid obj_datagrid2 wsto">

	{!optional items}
	<div id="cover_a"><div id="cover_b">

	<div class="commandLine">
	</div>

	<div id="sizerWatcher" class="wsto">
		<div id="noItem">{lang::string::no_item}</div>
	</div>

	{/optional}
	{optional items}


	<form action="{htmlspecialchars info::link}" method="post">

	<input type="submit" name="_a[page_both]" value="1" class="almostHidden"/>
	<input type="hidden" name="_s[default_page]" value="{htmlspecialchars info::page}"/>

	<div id="cover_a"><div id="cover_b">

	<div class="into-bottom-line bl-tGrid">
		<div>
			{include ../basic/skin/default/tpl/grid/_actions_mail_bottom.tpl}
		</div>
		<div>
			{include ../basic/skin/default/tpl/grid/_actions_mail_select.tpl}
		</div>
	</div>
	<div class="commandLine into-bottom-line-right">
		{include ../basic/skin/default/tpl/grid/_list_bottom.tpl}
	</div>

	<div class="commandLine">
	<table class="wsto" cellpadding="0" cellspacing="0">
		<tr>
			<td>
				{include ../basic/skin/default/tpl/grid/_actions_mail_top.tpl}
			</td>
			<td>
				<div class="right">
				{include ../basic/skin/default/tpl/grid/_list_top.tpl}
				</div>
			</td>
		</tr>
		<tr>
			<td colspan="2">
				{include ../basic/skin/default/tpl/grid/_actions_mail_select.tpl}
			</td>
		</tr>
	</table>
	</div>

	<div id="sizerWatcher" class="wsto">
	<table cellspacing="0" class="tGrid" id="tGrid">
		{dynamic items}
		<tr{optional *::recent} class="recent"{/optional}>
			<td class="iconBox{optional *::recent} unread{/optional}">
				{include ../basic/skin/default/tpl/grid/_select.tpl}
			</td>
			<td class="iconBox ico_mail_sf_{.*::smime_status}">
				<a class="icon" href="{.*::link}">
					{optional *::answered}
					<span class="flag_reply">
						{optional *::forwarded}<span class="flag_forward"></span>{/optional}
					</span>
					{/optional}
					{!optional *::answered}
						{optional *::forwarded}<span class="flag_forward"></span>{/optional}
					{/optional}
				</a>
			</td>
			<td class="iconBox {optional *::has_attachment 'true'}ico_att{/optional}">
				<div class="{optional *::priority}ico_priority_{.*::priority}{/optional}">
					<div class="{optional *::signed}ico_signed{/optional}"></div>
				</div>
			</td>
			<td class="fromBox">
			<div class="fromBox">
			{!optional container::isSent}
			<a href="{.*::link}" title="{htmlspecialchars.*::from}">{htmlspecialchars .*::aditional::fromshow}</a>
			{/optional}
			{optional container::isSent}
			<a href="{.*::link}" title="{htmlspecialchars.*::to}">{htmlspecialchars .*::aditional::toshow}</a>
			{!optional *::aditional::toshow}<a href="{.*::link}" title="{lang::mail_main::no_address}"><span class="gray">{lang::mail_main::no_address}</span></a>{/optional}
			{/optional}
			</div>
			</td>
			<td class="subjectBox"><div><a href="{.*::link}" title="{.*::subject}">{!optional *::subject}<span class="gray">{lang::mail_main::no_subject}</span>{/optional}{.*::subject}</a></div></td>
			<td class="iconBox flags {optional *::color} flag{.*::color}{/optional}{!optional *::color} flagZ{/optional}" title="{optional *::color}{.*::color}{/optional}{!optional *::color}Z{/optional}|{.*::id}"><div></div></td>
			<td class="dg_small dateBox"><a href="{.*::link}" title="{.*::aditional::fulldate}">{.*::aditional::date}</a></td>
		</tr>
		{/dynamic}
	</table>
	<input type="hidden" id="sid" value="{info::sid}"/>
	<input type="hidden" id="uid" value="{info::uid}"/>
	<input type="hidden" id="fid" value="{container::id}"/>
	</div>

{optional comment}
	<table class="wsto" cellpadding="0" cellspacing="0">
		<tr>
			<td>
				{include ../basic/skin/default/tpl/grid/_actions_mail_bottom.tpl}
			</td>
			<td>
				<div class="right">
				{include ../basic/skin/default/tpl/grid/_list_bottom.tpl}
				</div>
			</td>
		</tr>
		<tr>
			<td colspan="2">
				{include ../basic/skin/default/tpl/grid/_actions_mail_select.tpl}
			</td>
		</tr>
	</table>
{/optional}

	{/optional}

	</div></div>

</div>

</div>