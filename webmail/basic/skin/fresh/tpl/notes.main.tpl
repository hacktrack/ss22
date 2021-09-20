{include ../basic/skin/fresh/tpl/_toolbar.top_groupware.tpl}

<div class="body">
	<input type="hidden" name="_s[default_page]" value="{htmlspecialchars info::page}"/>

	<table class="datagrid" id="datagrid">
		<thead>
			<tr>
				<th class="th_check"><span>&nbsp;</span></th>
				<th class="{optional aSort::column 'evntitle'} sort{dSort::evntitle::type}{/optional}"><a href="index.html?_l=folder&amp;p0=main&amp;p1=content&amp;p2=notes.main&amp;p3=item.fdr&amp;p4={htmlspecialchars request::all::_s::id}&amp;p5=N&amp;_s[sort]={dSort::evntitle::orderby}{optional request::all::_s::search}&_s[search]={htmlspecialchars request::all::_s::search}{/optional}">{lang::event_list::title}</a>
				</th>
				<th><span>{lang::event_detail::notes}</span>
				</th>
				<th style="width:150px"{optional aSort::column 'EVNTYPE'} class="sort{dSort::EVNTYPE::type}"{/optional}><a href="index.html?_l=folder&amp;p0=main&amp;p1=content&amp;p2=notes.main&amp;p3=item.fdr&amp;p4={htmlspecialchars request::all::_s::id}&amp;p5=N&amp;_s[sort]={dSort::EVNTYPE::orderby}{optional request::all::_s::search}&_s[search]={htmlspecialchars request::all::_s::search}{/optional}">{lang::event_list::tags}</a>
				</th>
			</tr>
		</thead>
		<tbody>
		{dynamic info::list}
		<tr>
			<td>
				<input class="inp_check" type="checkbox" name="items[{.*::id}]"{optional *::checked} checked="checked"{/optional} value="on"/>
			</td>
			<td>
				<div>
					<a href="{.*::link}">{optional *::EVNTITLE}{htmlspecialchars *::EVNTITLE}{/optional}{!optional *::EVNTITLE}<span class="gray">{lang::event_main::no_title}</span>{/optional}</a>
				</div>
			</td>
			<td>
				<div>
					<a href="{.*::link}">{optional *::ADDONS::NOTE::NOTE_TEXT}{htmlspecialchars *::ADDONS::NOTE::NOTE_TEXT}{/optional}</a>
				</div>
			</td>
			<td>
				<div>
					<a href="{.*::link}">
						<div class="nowrap">
							{optional *::tags}
								{dynamic *::tags}
									<em class="tag withtext{optional *::light} light{/optional}" style="background-color:{htmlspecialchars *::color}" title="{htmlspecialchars *::tag}">{htmlspecialchars *::tag}</em>
								{/dynamic}
							{/optional}
						</div>
					</a>
				</div>
			</td>
		</tr>
		{/dynamic}
		</tbody>
		{!optional items}
		<tfoot>
			<tr>
				<td colspan="3">
					{lang::string::no_item}
				</td>
			</tr>
		</tfoot>
		{/optional}
	</table>

</div>

{include ../basic/skin/fresh/tpl/_toolbar.bottom_groupware.tpl}