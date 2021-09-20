		{include ../basic/skin/fresh/tpl/_toolbar.top_groupware.tpl}
		
		<div class="body">
			<!-- datagrid -->
			<div>
				<table class="datagrid" id="datagrid">
				<thead>
					<tr>
						<th class="th_check"><span>&nbsp;</span></th>
						<th style="width: 35%" {optional aSort::column 'itmClassifyAs'} class="sort{dSort::itmClassifyAs::type}"{/optional}{optional aSort::column 'itmSortString'} class="sort{dSort::itmClassifyAs::type}"{/optional}><a href="index.html?_l=folder&amp;p0=main&amp;p1=content&amp;p2=contact.main&amp;p3=item.fdr&amp;p4={htmlspecialchars request::all::_s::id}&amp;p5=C&amp;_s[sort]={optional restrictions::sortstring}{dSort::itmSortString::orderby}{/optional}{!optional restrictions::sortstring}{dSort::itmClassifyAs::orderby}{/optional}{optional request::all::_s::search}&_s[search]={htmlspecialchars request::all::_s::search}{/optional}">{lang::contact_main::contact_name}</a></th>
						<th style="width: 25%" class="{optional aSort::column 'lctemail1'}sort{dSort::lctemail1::type}{/optional}"><a href="index.html?_l=folder&amp;p0=main&amp;p1=content&amp;p2=contact.main&amp;p3=item.fdr&amp;p4={htmlspecialchars request::all::_s::id}&amp;p5=C&amp;_s[sort]={dSort::lctemail1::orderby}{optional request::all::_s::search}&_s[search]={htmlspecialchars request::all::_s::search}{/optional}">{lang::contact_main::email}</a></th>
						<th style="width: 15%" class="{optional aSort::column 'itmCompany'}sort{dSort::itmCompany::type}{/optional}"><a href="index.html?_l=folder&amp;p0=main&amp;p1=content&amp;p2=contact.main&amp;p3=item.fdr&amp;p4={htmlspecialchars request::all::_s::id}&amp;p5=C&amp;_s[sort]={dSort::itmCompany::orderby}{optional request::all::_s::search}&_s[search]={htmlspecialchars request::all::_s::search}{/optional}">{lang::contact_main::company}</a></th>
						<th style="width: 15%" class="{optional aSort::column 'itmDepartment'} sort{dSort::itmDepartment::type}{/optional}"><a href="index.html?_l=folder&amp;p0=main&amp;p1=content&amp;p2=contact.main&amp;p3=item.fdr&amp;p4={htmlspecialchars request::all::_s::id}&amp;p5=C&amp;_s[sort]={dSort::itmDepartment::orderby}{optional request::all::_s::search}&_s[search]={htmlspecialchars request::all::_s::search}{/optional}">{lang::contact_main::department}</a></th>
						<th style="width: 10%" class="{optional aSort::column 'itmCategory'} sort{dSort::itmCategory::type}{/optional}"><a href="index.html?_l=folder&amp;p0=main&amp;p1=content&amp;p2=contact.main&amp;p3=item.fdr&amp;p4={htmlspecialchars request::all::_s::id}&amp;p5=C&amp;_s[sort]={dSort::itmCategory::orderby}{optional request::all::_s::search}&_s[search]={htmlspecialchars request::all::_s::search}{/optional}">{lang::contact_main::tags}</a></th>
					</tr>
				</thead>
				<tbody>
				{dynamic items}
					<tr>
						<td>
							<input class="inp_check" type="checkbox" name="{variable}[{.*::id}]"{optional *::checked} checked="checked"{/optional} value="on"/>
						</td>
						<td>
							<a href="?_l=item&p0=main&p1=content&p2={.*::page}&p3=item.fdr&p4={optional request::all::_s::id}{htmlspecialchars request::all::_s::id}{/optional}{!optional request::all::_s::id}{settings::default_folders::contacts}{/optional}&p5=C&p6={.*::ITM_ID}">{optional *::page 'contact.distribution'}[{/optional}{htmlspecialchars *::ITMCLASSIFYAS}{optional *::NOCA}<span class="gray">{lang::contact_main::no_name}{/optional}</span>{optional *::page 'contact.distribution'}]{/optional}</a>
						</td>
						<td class="td_link mail_links">
							{optional *::LCTEMAIL1}
								{!optional *::page 'contact.distribution'}
								<a href="?_n[p][content]=mail.compose&_n[p][main]=win.main.tree&to={optional *::ITMCLASSIFYAS}%22{htmlspecialchars .*::ITMCLASSIFYAS_URLESCAPED}%22%3C{htmlspecialchars .*::LCTEMAIL1_URLESCAPED}%3E{/optional}{!optional *::ITMCLASSIFYAS}{htmlspecialchars *::LCTEMAIL1}{/optional}">{htmlspecialchars *::LCTEMAIL1}</a>
								{/optional}
							{/optional}
							{optional *::LCTEMAIL2}
								<a href="?_n[p][content]=mail.compose&_n[p][main]=win.main.tree&to={optional *::ITMCLASSIFYAS}%22{htmlspecialchars .*::ITMCLASSIFYAS_URLESCAPED}%22%3C{htmlspecialchars .*::LCTEMAIL2_URLESCAPED}%3E{/optional}{!optional *::ITMCLASSIFYAS}{htmlspecialchars *::LCTEMAIL2}{/optional}">{htmlspecialchars *::LCTEMAIL2}</a>
							{/optional}
							{optional *::LCTEMAIL3}
								<a href="?_n[p][content]=mail.compose&_n[p][main]=win.main.tree&to={optional *::ITMCLASSIFYAS}%22{htmlspecialchars .*::ITMCLASSIFYAS_URLESCAPED}%22%3C{htmlspecialchars .*::LCTEMAIL3_URLESCAPED}%3E{/optional}{!optional *::ITMCLASSIFYAS}{htmlspecialchars *::LCTEMAIL3}{/optional}">{htmlspecialchars *::LCTEMAIL3}</a>
							{/optional}
							{!optional *::LCTEMAIL1}
							{!optional *::LCTEMAIL2}
							{!optional *::LCTEMAIL3}
								<span class="gray">{lang::contact_main::no_email}</span>
							{/optional}
							{/optional}
							{/optional}
						</td>
						<td>
							<a href="?_l=item&p0=main&p1=content&p2={.*::page}&p3=item.fdr&p4={optional request::all::_s::id}{htmlspecialchars request::all::_s::id}{/optional}{!optional request::all::_s::id}{settings::default_folders::contacts}{/optional}&p5=C&p6={.*::ITM_ID}">{htmlspecialchars *::ITMCOMPANY}</a>
						</td>
						<td>
							<a href="?_l=item&p0=main&p1=content&p2={.*::page}&p3=item.fdr&p4={optional request::all::_s::id}{htmlspecialchars request::all::_s::id}{/optional}{!optional request::all::_s::id}{settings::default_folders::contacts}{/optional}&p5=C&p6={.*::ITM_ID}">{htmlspecialchars *::ITMDEPARTMENT}</a>
						</td>
						<td>
							<a href="?_l=item&p0=main&p1=content&p2={.*::page}&p3=item.fdr&p4={optional request::all::_s::id}{htmlspecialchars request::all::_s::id}{/optional}{!optional request::all::_s::id}{settings::default_folders::contacts}{/optional}&p5=C&p6={.*::ITM_ID}">
								<div class="nowrap">
									{optional *::tags}
										{dynamic *::tags}
											<em class="tag withtext{optional *::light} light{/optional}" style="background-color:{htmlspecialchars *::color}" title="{htmlspecialchars *::tag}">{htmlspecialchars *::tag}</em>
										{/dynamic}
									{/optional}
								</div>
							</a>
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
			
		</div>
			
		{include ../basic/skin/fresh/tpl/_toolbar.bottom_groupware.tpl}