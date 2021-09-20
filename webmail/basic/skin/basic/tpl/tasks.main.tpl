<form action="{info::link}" method="post">

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
		<th{optional aSort::column 'EVNTITLE'} class="sort{dSort::EVNTITLE::type}"{/optional}><a href="index.html?_l=folder&amp;p0=main&amp;p1=content&amp;p2=tasks.main&amp;p3=item.fdr&amp;p4={htmlspecialchars request::all::_s::id}&amp;p5=T&amp;_s[sort]={dSort::EVNTITLE::orderby}{optional request::all::_s::search}&_s[search]={htmlspecialchars request::all::_s::search}{/optional}">{lang::event_list::title}</a></th>
		<th style="width:100px"{optional aSort::column 'EVNSTARTTIME'} class="sort{dSort::EVNSTARTTIME::type}"{/optional}><a href="index.html?_l=folder&amp;p0=main&amp;p1=content&amp;p2=tasks.main&amp;p3=item.fdr&amp;p4={htmlspecialchars request::all::_s::id}&amp;p5=T&amp;_s[sort]={dSort::EVNSTARTDATE::orderby},{dSort::EVNSTARTTIME::orderby}{optional request::all::_s::search}&_s[search]={htmlspecialchars request::all::_s::search}{/optional}">{lang::event_list::start}</a></th>
		<th style="width:100px"{optional aSort::column 'EVNENDTIME'} class="sort{dSort::EVNENDTIME::type}"{/optional}><a href="index.html?_l=folder&amp;p0=main&amp;p1=content&amp;p2=tasks.main&amp;p3=item.fdr&amp;p4={htmlspecialchars request::all::_s::id}&amp;p5=T&amp;_s[sort]={dSort::EVNENDDATE::orderby},{dSort::EVNENDTIME::orderby}{optional request::all::_s::search}&_s[search]={htmlspecialchars request::all::_s::search}{/optional}">{lang::event_list::end}</a></th>
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
				<a class="oFlowA" href="{.*::link}">{.*::aditional::start}</a>
			</div>
		</td>
		<td>
			<div class="oFlowController">
				<a class="oFlowA" href="{.*::link}">{.*::aditional::due}</a>
			</div>
		</td>
	</tr>
	{/dynamic}


</table>



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