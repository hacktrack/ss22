<!-- datagrid -->
			<div>
				<table class="datagrid" id="datagrid">
				<thead>
					<tr>
						<th class="th_check"><span>&nbsp;</span></th>
						<th class="th_check eventrepeat"><span><b>&nbsp;</b></span></th>
						<th{optional aSort::column 'evntitle'} class="sort{dSort::evntitle::type}"{/optional} style="width: 100%"><a href="index.html?_l=folder&amp;p0=main&amp;p1=content&amp;p2=event.main&amp;p3=item.fdr&amp;p4={rawurlencode request::all::_s::id}&amp;p5=E&amp;view=event.list&amp;_s[sort]={dSort::evntitle::orderby}{optional request::all::_s::search}&_s[search]={htmlspecialchars request::all::_s::search}{/optional}">{lang::event_list::title}</a></th>
						<th{optional aSort::column 'EVNSTARTTIME'} class="sort{dSort::EVNSTARTTIME::type}"{/optional} style="width: 150px"><a href="index.html?_l=folder&amp;p0=main&amp;p1=content&amp;p2=event.main&amp;p3=item.fdr&amp;p4={rawurlencode request::all::_s::id}&amp;p5=E&amp;view=event.list&amp;_s[sort]={dSort::EVNSTARTDATE::orderby},{dSort::EVNSTARTTIME::orderby}{optional request::all::_s::search}&_s[search]={htmlspecialchars request::all::_s::search}{/optional}">{lang::event_list::start}</a></th>
						<th{optional aSort::column 'EVNENDTIME'} class="sort{dSort::EVNENDTIME::type}"{/optional} style="width: 150px"><a href="index.html?_l=folder&amp;p0=main&amp;p1=content&amp;p2=event.main&amp;p3=item.fdr&amp;p4={rawurlencode request::all::_s::id}&amp;p5=E&amp;view=event.list&amp;_s[sort]={dSort::EVNENDDATE::orderby},{dSort::EVNENDTIME::orderby}{optional request::all::_s::search}&_s[search]={htmlspecialchars request::all::_s::search}{/optional}">{lang::event_list::end}</a></th>
						<th style="width:150px"{optional aSort::column 'EVNTYPE'} class="sort{dSort::EVNTYPE::type}"{/optional} style="width: 150px"><a href="index.html?_l=folder&amp;p0=main&amp;p1=content&amp;p2=event.main&amp;p3=item.fdr&amp;p4={rawurlencode request::all::_s::id}&amp;p5=E&amp;view=event.list&amp;_s[sort]={dSort::EVNTYPE::orderby}{optional request::all::_s::search}&_s[search]={htmlspecialchars request::all::_s::search}{/optional}">{lang::event_list::tags}</a></th>
					</tr>
				</thead>
				<tbody>
					{dynamic info::list}
					<tr>
						<td><input class="inp_check" type="checkbox" name="items[{.*::id}]"/></td>
						<td class="acenter eventrepeat">{optional *::recurrence}<b title="{lang::event_detail::repeat}">&nbsp;</b>{/optional}</td>
						<td>
						<a href="{.*::link}">
							{optional *::title}{htmlspecialchars *::title}{/optional}{!optional *::title}<span class="gray">{lang::event_main::no_title}</span>{/optional}
						</a>
						</td>
						<td>
						<span>{.*::startD}&nbsp;{.*::startT}</span>
						</td>
						<td>
						<span>{.*::endD}&nbsp;{.*::endT}</span>
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