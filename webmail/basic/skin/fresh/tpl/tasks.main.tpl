
{include ../basic/skin/fresh/tpl/_toolbar.top_groupware.tpl}

<div class="body">

	<input type="hidden" name="_s[default_page]" value="{htmlspecialchars info::page}"/>

	<table class="datagrid" id="datagrid">
		<thead>
			<tr>
				<th class="th_check"><span>&nbsp;</span></th>
				<th class="th_check"><span>&nbsp;</span></th>
				<th{optional aSort::column 'EVNTITLE'} class="sort{dSort::EVNTITLE::type}"{/optional}>
					<a href="index.html?_l=folder&amp;p0=main&amp;p1=content&amp;p2=tasks.main&amp;p3=item.fdr&amp;p4={htmlspecialchars request::all::_s::id}&amp;p5=T&amp;_s[sort]={dSort::EVNTITLE::orderby}{optional request::all::_s::search}&_s[search]={htmlspecialchars request::all::_s::search}{/optional}">{lang::event_list::title}</a>
				</th>
				<th style="width:150px"{optional aSort::column 'EVNSTARTTIME'} class="sort{dSort::EVNSTARTTIME::type}"{/optional}>
					<a href="index.html?_l=folder&amp;p0=main&amp;p1=content&amp;p2=tasks.main&amp;p3=item.fdr&amp;p4={htmlspecialchars request::all::_s::id}&amp;p5=T&amp;_s[sort]={dSort::EVNSTARTDATE::orderby},{dSort::EVNSTARTTIME::orderby}{optional request::all::_s::search}&_s[search]={htmlspecialchars request::all::_s::search}{/optional}">{lang::event_list::start}</a>
				</th>
				<th style="width:150px"{optional aSort::column 'EVNENDTIME'} class="sort{dSort::EVNENDTIME::type}"{/optional}>
					<a href="index.html?_l=folder&amp;p0=main&amp;p1=content&amp;p2=tasks.main&amp;p3=item.fdr&amp;p4={htmlspecialchars request::all::_s::id}&amp;p5=T&amp;_s[sort]={dSort::EVNENDDATE::orderby},{dSort::EVNENDTIME::orderby}{optional request::all::_s::search}&_s[search]={htmlspecialchars request::all::_s::search}{/optional}">{lang::event_list::end}</a>
				</th>
				<th style="width:150px"{optional aSort::column 'EVNTYPE'} class="sort{dSort::EVNTYPE::type}"{/optional}>
					<a href="index.html?_l=folder&amp;p0=main&amp;p1=content&amp;p2=tasks.main&amp;p3=item.fdr&amp;p4={htmlspecialchars request::all::_s::id}&amp;p5=T&amp;_s[sort]={dSort::EVNTYPE::orderby}{optional request::all::_s::search}&_s[search]={htmlspecialchars request::all::_s::search}{/optional}">{lang::event_list::tags}</a>
				</th>
			</tr>
		</thead>
		<tbody>
		{dynamic info::list}
		<tr>
			<td>
				<input class="inp_check" type="checkbox" name="items[{.*::id}]"{optional *::checked} checked="checked"{/optional} value="on"/>
			</td>
			<td class="acenter nopleft"><img src="skin/fresh/images/icons/ico_task_{htmlspecialchars .*::EVNSTATUS}.gif"/></td>
			<td>
				<div>
					<a href="{.*::link}">{optional *::EVNTITLE}{htmlspecialchars *::EVNTITLE}{/optional}{!optional *::EVNTITLE}<span class="gray">{lang::event_main::no_title}</span>{/optional}</a>
				</div>
			</td>
			<td>
				<div>
					<a href="{.*::link}">{.*::aditional::start}</a>
				</div>
			</td>
			<td>
				<div>
					<a href="{.*::link}">{.*::aditional::due}</a>
				</div>
			</td>
			<td>
				<div class="nowrap">
					{optional *::tags}
						{dynamic *::tags}
							<em class="tag withtext{optional *::light} light{/optional}" style="background-color:{htmlspecialchars *::color}" title="{htmlspecialchars *::tag}">{htmlspecialchars *::tag}</em>
						{/dynamic}
					{/optional}
				</div>
			</td>
		</tr>
		{/dynamic}
		</tbody>
		{!optional items}
		<tfoot>
			<tr>
				<td colspan="5">
					{lang::string::no_item}
				</td>
			</tr>
		</tfoot>
		{/optional}
	</table>

</div>


{include ../basic/skin/fresh/tpl/_toolbar.bottom_groupware.tpl}