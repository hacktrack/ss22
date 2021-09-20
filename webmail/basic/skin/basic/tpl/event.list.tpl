<table cellspacing="0" cellpadding="0" class="tGrid">
	<tr>
		<th class="firstCol"></th>
		<th{optional aSort::column 'evntitle'} class="sort{dSort::evntitle::type}"{/optional}><a href="index.html?_l=folder&amp;p0=main&amp;p1=content&amp;p2=event.main&amp;p3=item.fdr&amp;p4={htmlspecialchars request::all::_s::id}&amp;p5=E&amp;view=event.list&amp;_s[sort]={dSort::evntitle::orderby}{optional request::all::_s::search}&_s[search]={htmlspecialchars request::all::_s::search}{/optional}" class="titleColumn">{lang::event_list::title}</a></th>
		<th style="width:120px"{optional aSort::column 'EVNSTARTTIME'} class="sort{dSort::EVNSTARTTIME::type}"{/optional}><a href="index.html?_l=folder&amp;p0=main&amp;p1=content&amp;p2=event.main&amp;p3=item.fdr&amp;p4={htmlspecialchars request::all::_s::id}&amp;p5=E&amp;view=event.list&amp;_s[sort]={dSort::EVNSTARTDATE::orderby},{dSort::EVNSTARTTIME::orderby}{optional request::all::_s::search}&_s[search]={htmlspecialchars request::all::_s::search}{/optional}">{lang::event_list::start}</a></th>
		<th style="width:120px"{optional aSort::column 'EVNENDTIME'} class="sort{dSort::EVNENDTIME::type}"{/optional}><a href="index.html?_l=folder&amp;p0=main&amp;p1=content&amp;p2=event.main&amp;p3=item.fdr&amp;p4={htmlspecialchars request::all::_s::id}&amp;p5=E&amp;view=event.list&amp;_s[sort]={dSort::EVNENDDATE::orderby},{dSort::EVNENDTIME::orderby}{optional request::all::_s::search}&_s[search]={htmlspecialchars request::all::_s::search}{/optional}">{lang::event_list::end}</a></th>
	</tr>
	{dynamic info::list}
	<tr>
		<td class="checkboxFirst"><input type="checkbox" name="items[{.*::id}]"/> </td>
		<td>
		<a href="{.*::link}">{optional *::title}{htmlspecialchars *::title}{/optional}{!optional *::title}<span class="gray">{lang::event_main::no_title}</span>{/optional}</a>
		</td>
		<td>
		<div class="oFlowController"><span class="oFlowA fs11">{.*::startD}&nbsp;{.*::startT}</span></div>
		</td>
		<td>
		<div class="oFlowController"><span class="oFlowA fs11">{.*::endD}&nbsp;{.*::endT}</span></div>
		</td>
	</tr>
	{/dynamic}


</table>