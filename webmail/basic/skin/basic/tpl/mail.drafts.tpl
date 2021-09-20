<form action="{htmlspecialchars info::link}" method="post">

	<input type="submit" name="_a[page_both]" value="1" class="almostHidden"/>
	<input type="hidden" name="_s[default_page]" value="{htmlspecialchars info::page}"/>

<div class="cover-b wsto">
<div id="cover_a"><div id="cover_b">

<div class="into-bottom-line bl-tGrid">
		{include ../basic/skin/default/tpl/grid/_actions_mail_bottom_draft.tpl}
		{include ../basic/skin/default/tpl/grid/_actions_mail_select_draft.tpl}
</div>

<div class="into-bottom-line-right bl-tGrid">
	{include ../basic/skin/default/tpl/grid/_list_bottom.tpl}
</div>

<div class="commandLine">

	<table cellspacing="0" cellpadding="0" class="wsto">
		<tr>
			<td>
				{include ../basic/skin/default/tpl/grid/_actions_mail_top_draft.tpl}
			</td>
			<td align="right">
				{include ../basic/skin/default/tpl/grid/_list_top.tpl}
			</td>
		</tr>
	</table>
	{include ../basic/skin/default/tpl/grid/_actions_mail_select_draft.tpl}

</div>

<div id="sizerWatcher" class="wsto">
<div class="wsto spacer">




<div class="grid obj_datagrid2">
	<table cellspacing="0" class="tGrid" id="tGrid">
		{dynamic items}
		<tr{optional *::recent} class="recent"{/optional}>
			<td class="iconBox">
				<input type="checkbox" name="items[{*::id}]" {optional *::recent} class="unread"{/optional}{optional *::aditional::checked}checked="checked"{/optional}/>
			</td>
			<td class="iconBox">
				<a class="icon" href="{*::link}">
				</a>
			</td>
			<td class="fromBox"><a href="{*::link}" title="{*::to}">{*::aditional::toshow}{!optional *::aditional::toshow}<span class="gray">{lang::mail_main::no_address}</span>{/optional}</a></td>
			<td class="subjectBox"><div><a href="{*::link}" title="{*::subject}">{*::subject}{!optional *::subject}<span class="gray">{lang::mail_main::no_subject}</span>{/optional}</a></div></td>
			<td class="dg_small dateBox"><a href="{*::link}" title="{*::aditional::fulldate}">{*::aditional::date}</a></td>
		</tr>
		{/dynamic}
	</table>
</div>




</div>
</div>


</div>
</div>
</div>

</form>