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


	<form action="{info::link}" method="post">

	<input type="submit" name="_a[page_both]" value="1" class="almostHidden"/>
	<input type="hidden" name="_s[default_page]" value="{htmlspecialchars info::page}"/>

	<div id="cover_a"><div id="cover_b">

	<div class="into-bottom-line bl-tGrid">
		<div>
			{include ../basic/skin/default/tpl/grid/_actions_quarantine_bottom.tpl}
		</div>
		<div>
			{include ../basic/skin/default/tpl/grid/_actions_quarantine_select.tpl}
		</div>
	</div>
	<div class="commandLine into-bottom-line-right">
		{include ../basic/skin/default/tpl/grid/_list_bottom.tpl}
	</div>

	<div class="commandLine">
	<table class="wsto" cellpadding="0" cellspacing="0">
		<tr>
			<td>
				{include ../basic/skin/default/tpl/grid/_actions_quarantine_top.tpl}
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
				<a class="icon" href="{*::link}">
				</a>
			</td>
			
			<td class="iconBox">
				<div>
					<div class="{optional *::signed}ico_signed{/optional}"></div>
				</div>
			</td>
			
			<td class="fromBox">
			<div class="fromBox">
			<a href="{*::link}" title="{*::from}">{*::aditional::fromshow}</a>
			</div>
			</td>
			
			<td class="subjectBox"><div><a href="{*::link}" title="{*::subject}">{!optional *::subject}<span class="gray">{lang::mail_main::no_subject}</span>{/optional}{*::subject}</a></div>
			</td>
			
			<td class="toBox">
			<div class="toBox">
			<a href="{*::link}" title="{*::to}">{*::aditional::toshow}</a>
			</div>
			</td>
			
			<td class="iconBox">
			<div></div>
			</td>
			
			<td class="dg_small dateBox"><a href="{*::link}" title="{*::aditional::fulldate}">{*::aditional::date}</a>			</td>
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