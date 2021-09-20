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
			{optional request::all::_s::id 'SPAM_QUEUE/Whitelist'}
			<input class="fancyButton" type="submit" value="{lang::mail_main::blacklist}" name="_a[blacklist]"/>
			{/optional}
			{optional request::all::_s::id 'SPAM_QUEUE/Blacklist'}
			<input class="fancyButton" type="submit" value="{lang::mail_main::whitelist}" name="_a[whitelist]"/>
			{/optional}
			<input class="fancyButton" type="submit" value="{lang::mail_main::delete}" name="_a[delete]" alt="{lang::confirmation::delete_quarantine}"/>
		</div>
		<div>
			{include ../basic/skin/default/tpl/grid/_actions_quarantine_select.tpl}
		</div>
	</div>
	

	<div class="commandLine">
	<table class="wsto" cellpadding="0" cellspacing="0">
		<tr>
			<td>
				{optional request::all::_s::id 'SPAM_QUEUE/Whitelist'}
				<input class="fancyButton" type="submit" value="{lang::mail_main::blacklist}" name="_a[blacklist]"/>
				{/optional}
				{optional request::all::_s::id 'SPAM_QUEUE/Blacklist'}
				<input class="fancyButton" type="submit" value="{lang::mail_main::whitelist}" name="_a[whitelist]"/>
				{/optional}
				<input class="fancyButton" type="submit" value="{lang::mail_main::delete}" name="_a[delete]" alt="{lang::confirmation::delete_quarantine}"/>
			</td>
			<td>
				<div class="right">
				{include ../basic/skin/default/tpl/grid/_list_top.tpl}
				</div>
			</td>
		</tr>
		<tr>
			<td colspan="2">
				{include ../basic/skin/default/tpl/grid/_actions_quarantine_select.tpl}
			</td>
		</tr>
	</table>
	</div>

	<div id="sizerWatcher" class="wsto">
	<table cellspacing="0" class="tGrid" id="tGrid">
		{dynamic items}
		<tr>
			<td class="iconBox">
				{include ../basic/skin/default/tpl/grid/_select.tpl}
			</td>
			
			<td class="iconBox">
				<a class="icon" href="{.*::link}">
				</a>
			</td>
			
			<td class="iconBox">
				<div>
					<div class="{optional *::signed}ico_signed{/optional}"></div>
				</div>
			</td>
			
			<td class="senderBox">
			<div class="senderBox">
			<a href="{.*::link}" title="{.*::from}">{.*::aditional::fromshow}</a>
			</div>
			</td>
			
			<td class="ownerBox">
			<div class="ownerBox">
			<a href="{.*::link}" title="{.*::to}">{.*::aditional::toshow}</a>
			</div>
			</td>
			
			<td class="domainBox"><div><a href="{.*::link}" title="{.*::domain}">{.*::domain}</a></div>
			</td>
			
			<td class="iconBox">
			<div></div>
			</td>
			
			<td class="dg_small dateBox"><a href="{.*::link}" title="{.*::aditional::fulldate}">{.*::aditional::date}</a>			</td>
		</tr>
		{/dynamic}
	</table>
	<input type="hidden" id="sid" value="{info::sid}"/>
	<input type="hidden" id="uid" value="{info::uid}"/>
	<input type="hidden" id="fid" value=""/>
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