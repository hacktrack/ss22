{include ../basic/skin/fresh/tpl/_toolbar.top_file.select.tpl}

<div class="body">
	<input type="hidden" name="_s[default_page]" value="{htmlspecialchars info::page}"/>

	<table class="datagrid" id="datagrid">
		<thead>
			<tr>
				<th class="th_check"><span>&nbsp;</span></th>
				<th class="{optional aSort::column 'EVNTITLE'} sort{dSort::EVNTITLE::type}{/optional}"><a href="index.html?_l=folder&amp;p0=main&amp;p1=content&amp;p2=file.main&amp;p3=item.fdr&amp;p4={htmlspecialchars request::all::_s::id}&amp;p5=F&amp;_s[sort]={dSort::EVNTITLE::orderby}{optional request::all::_s::search}&_s[search]={htmlspecialchars request::all::_s::search}{/optional}">{lang::file_list::filename}</a>
				</th>
				<th class="{optional aSort::column 'EVNNOTE'} sort{dSort::EVNNOTE::type}{/optional}"><a href="index.html?_l=folder&amp;p0=main&amp;p1=content&amp;p2=file.main&amp;p3=item.fdr&amp;p4={htmlspecialchars request::all::_s::id}&amp;p5=F&amp;_s[sort]={dSort::EVNNOTE::orderby}{optional request::all::_s::search}&_s[search]={htmlspecialchars request::all::_s::search}{/optional}">{lang::file_list::description}</a>
				</th>
				<th class="{optional aSort::column 'EVN_MODIFIED'} sort{dSort::EVN_MODIFIED::type}{/optional}"><a href="index.html?_l=folder&amp;p0=main&amp;p1=content&amp;p2=file.main&amp;p3=item.fdr&amp;p4={htmlspecialchars request::all::_s::id}&amp;p5=F&amp;_s[sort]={dSort::EVN_MODIFIED::orderby}{optional request::all::_s::search}&_s[search]={htmlspecialchars request::all::_s::search}{/optional}">{lang::file_list::modified}</a>
				</th>
				<th class="{optional aSort::column 'EVNCOMPLETE'} sort{dSort::EVNCOMPLETE::type}{/optional}"><a href="index.html?_l=folder&amp;p0=main&amp;p1=content&amp;p2=file.main&amp;p3=item.fdr&amp;p4={htmlspecialchars request::all::_s::id}&amp;p5=F&amp;_s[sort]={dSort::EVNCOMPLETE::orderby}{optional request::all::_s::search}&_s[search]={htmlspecialchars request::all::_s::search}{/optional}">{lang::file_list::size}</a>
				</th>
				<th style="width:150px"{optional aSort::column 'EVNTYPE'} class="sort{dSort::EVNTYPE::type}"{/optional}><a href="index.html?_l=folder&amp;p0=main&amp;p1=content&amp;p2=file.main&amp;p3=item.fdr&amp;p4={htmlspecialchars request::all::_s::id}&amp;p5=F&amp;_s[sort]={dSort::EVNTYPE::orderby}{optional request::all::_s::search}&_s[search]={htmlspecialchars request::all::_s::search}{/optional}">{lang::file_list::tags}</a>
				</th>
			</tr>
		</thead>
		<tbody>
		{dynamic info::list}
		<tr>
		
			<td>
				<input class="inp_check" type="checkbox" name="items[{.*::id}][selected]"/>
				<input type="hidden" name="items[{.*::id}][class]" value="item"/>
				<input type="hidden" name="items[{.*::id}][fullpath]" value="{.*::fullpath}"/>
			</td>
			<td>
				<div>
					<a href="{.*::link}" class="file_link ico_{.*::extension}">{optional *::EVNTITLE}{htmlspecialchars *::EVNTITLE}{/optional}{!optional *::EVNTITLE}<span class="gray">{lang::event_main::no_title}</span>{/optional}</a>
				</div>
			</td>
			<td>
				<div>
					<a href="{.*::link}">{htmlspecialchars *::EVNNOTE}</a>
				</div>
			</td>
			<td>
				<div>
					<a href="{.*::link}">{htmlspecialchars *::EVN_MODIFIED}</a>
				</div>
			</td>
			<td>
				<div>
					<a href="{.*::link}">{htmlspecialchars *::EVNCOMPLETE}</a>
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
				<td colspan="6">
					{lang::string::no_item}
				</td>
			</tr>
		</tfoot>
		{/optional}
	</table>

</div>

{include ../basic/skin/fresh/tpl/_toolbar.bottom_file.select.tpl}