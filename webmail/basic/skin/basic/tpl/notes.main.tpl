<form action="{htmlspecialchars info::link}" method="post">

<input type="submit" name="_a[page_both]" value="1" class="almostHidden"/>
<input type="hidden" name="_s[default_page]" value="{htmlspecialchars info::page}"/>

<input type="hidden" name="_c" value="{info::controller}" />
<input type="hidden" name="container" value="{container::id}" />
<input type="hidden" name="type" value="{container::type}" />

<div class="cover-b wsto">
<div id="cover_a"><div id="cover_b">
<div class="commandLine">

<table class="wsto" cellpadding="0" cellspacing="0">
	<tr>
		<td>{include ../basic/skin/default/tpl/grid/_items_main_top.tpl}</td>
		<td>{include ../basic/skin/default/tpl/grid/_list_top.tpl}</td>
	</tr>
</table>

<div>

{optional info::showListing}
<div class="right">
{include ../basic/skin/default/tpl/grid/_list_top.tpl}
</div>
{/optional}

<div class="cleaner"></div>
</div>

</div>
<div id="sizerWatcher" class="wsto">

<div class="wsto spacer">




<div class="grid" style="">
<table cellspacing="0" cellpadding="0" class="tGrid">
	<tr>
		<th class="firstCol"></th>
		<th class="{optional aSort::column 'evntitle'} sort{dSort::evntitle::type}{/optional}"><a href="index.html?_l=folder&amp;p0=main&amp;p1=content&amp;p2=notes.main&amp;p3=item.fdr&amp;p4={htmlspecialchars request::all::_s::id}&amp;p5=N&amp;_s[sort]={dSort::evntitle::orderby}{optional request::all::_s::search}&_s[search]={htmlspecialchars request::all::_s::search}{/optional}">{lang::event_list::title}</a></th>
		<th style="width:30%"{optional aSort::column 'EVNTYPE'} class="sort{dSort::EVNTYPE::type}"{/optional}><a href="index.html?_l=folder&amp;p0=main&amp;p1=content&amp;p2=notes.main&amp;p3=item.fdr&amp;p4={htmlspecialchars request::all::_s::id}&amp;p5=N&amp;_s[sort]={dSort::EVNTYPE::orderby}{optional request::all::_s::search}&_s[search]={htmlspecialchars request::all::_s::search}{/optional}">{lang::notes::category}</a></th>
	</tr>
	{dynamic info::list}
	<tr>
		<td class="checkboxFirst"><input type="checkbox" name="items[{.*::id}]"/></td>
		<td>
			<div class="oFlowController">
				<a class="oFlowA" href="{.*::link}">{optional *::EVNTITLE}{htmlspecialchars *::EVNTITLE}{/optional}{!optional *::EVNTITLE}<span class="gray">{lang::event_main::no_title}</span>{/optional}</a>
			</div>
		</td>
		<td>
			<div class="oFlowController">
				<a class="oFlowA" href="{.*::link}">{.*::EVNTYPE}</a>
			</div>
		</td>
	</tr>
	{/dynamic}


</table>

{optional info::showListing}
<div class="into-bottom-line-right" style="padding-top:13px; .padding-top:7px;">
{include ../basic/skin/default/tpl/grid/_list_bottom.tpl}
</div>
{/optional}

</div>





</div>

<div class="into-bottom-line-right" style="padding-top:13px; .padding-top:7px;">
{include ../basic/skin/default/tpl/grid/_list_bottom.tpl}
</div>
{include ../basic/skin/default/tpl/grid/_items_main_bottom.tpl}

</div>
</div>
</div>
</div>
</form>