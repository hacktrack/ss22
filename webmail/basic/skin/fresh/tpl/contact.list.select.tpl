
{include ../basic/skin/fresh/tpl/_toolbar.top_contact.select.tpl}






		<div class="body">
			<!-- datagrid -->
			<div>
				<table class="datagrid" id="datagrid">
				<thead>
					<tr>
						<th class="th_check"><span>&nbsp;</span></th>
						<th style="width: 35%" class="{optional aSort::column 'lctemail1'}sort{dSort::lctemail1::type}{/optional}"><a href="index.html?_l=folder&amp;p0=main&amp;p1=content&amp;p2=contact.select&amp;p3=item.fdr&amp;p4={htmlspecialchars request::all::_s::id}&amp;p5=C&amp;_dlg=1&amp;_s[sort]={dSort::lctemail1::orderby}{optional request::all::_s::search}&_s[search]={request::all::_s::search}{/optional}">{lang::contact_main::email}</a></th>
						<th style="width: 35%" {optional aSort::column 'itmClassifyAs'} class="sort{dSort::itmClassifyAs::type}"{/optional}><a href="index.html?_l=folder&amp;p0=main&amp;p1=content&amp;p2=contact.select&amp;p3=item.fdr&amp;p4={htmlspecialchars request::all::_s::id}&amp;p5=C&amp;_dlg=1&amp;_s[sort]={optional restrictions::sortstring}{dSort::itmSortString::orderby}{/optional}{!optional restrictions::sortstring}{dSort::itmClassifyAs::orderby}{/optional}{optional request::all::_s::search}&_s[search]={request::all::_s::search}{/optional}">{lang::contact_main::contact_name}</a></th>
						<th style="width: 15%" class="{optional aSort::column 'itmCompany'}sort{dSort::itmCompany::type}{/optional}"><a href="index.html?_l=folder&amp;p0=main&amp;p1=content&amp;p2=contact.select&amp;p3=item.fdr&amp;p4={htmlspecialchars request::all::_s::id}&amp;p5=C&amp;_dlg=1&amp;_s[sort]={dSort::itmCompany::orderby}{optional request::all::_s::search}&_s[search]={request::all::_s::search}{/optional}">{lang::contact_main::company}</a></th>
						<th style="width: 15%" class="{optional aSort::column 'itmDepartment'} sort{dSort::itmDepartment::type}{/optional}"><a href="index.html?_l=folder&amp;p0=main&amp;p1=content&amp;p2=contact.select&amp;p3=item.fdr&amp;p4={htmlspecialchars request::all::_s::id}&amp;p5=C&amp;_dlg=1&amp;_s[sort]={dSort::itmDepartment::orderby}{optional request::all::_s::search}&_s[search]={request::all::_s::search}{/optional}">{lang::contact_main::department}</a></th>
						<th style="width: 10%" class="{optional aSort::column 'itmCategory'} sort{dSort::itmCategory::type}{/optional}"><a href="index.html?_l=folder&amp;p0=main&amp;p1=content&amp;p2=contact.select&amp;p3=item.fdr&amp;p4={htmlspecialchars request::all::_s::id}&amp;p5=C&amp;_dlg=1&amp;_s[sort]={dSort::itmCategory::orderby}{optional request::all::_s::search}&_s[search]={request::all::_s::search}{/optional}">{lang::contact_main::category}</a></th>
					</tr>
				</thead>
				<tbody>
				{dynamic items}
					<tr{optional *::recent} class="recent bold"{/optional}>
						<td colspan="2">
							<table cellspacing="0">
								<tr>
									<td>
										{optional *::LCTEMAIL1}
											{optional type 'multiple'}
											<input class="inp_check" type="checkbox" name="{variable}[{.*::ITM_ID}#EMAIL1][selected]"{optional *::checked} checked="checked"{/optional}/>
											<input type="hidden" name="{variable}[{.*::ITM_ID}#EMAIL1][address]" value="{!optional *::NOCA}&quot;{htmlspecialchars .*::ITMCLASSIFYAS}&quot;&lt;{/optional}{htmlspecialchars .*::LCTEMAIL1}{!optional *::NOCA}&gt;{/optional}"/>
											{/optional}
											{optional type 'single'}
											<input class="inp_check" type="radio" name="{variable}" value="{!optional *::NOCA}&quot;{htmlspecialchars .*::ITMCLASSIFYAS}&quot;&lt;{/optional}{htmlspecialchars .*::LCTEMAIL1}{!optional *::NOCA}&gt;{/optional}"{optional *::checked} checked="checked"{/optional}/>
											{/optional}
										{/optional}
										{!optional *::LCTEMAIL1}
											<span class="gray">{lang::contact_main::no_email}</span>
										{/optional}
									</td>
									<td>{optional *::ITMCLASS 'L'}[{htmlspecialchars .*::ITMCLASSIFYAS}]{/optional}{!optional *::ITMCLASS 'L'}{htmlspecialchars *::LCTEMAIL1}{/optional}</td>
								</tr>
								{optional *::LCTEMAIL2}
								<tr>
									<td>
										{optional type 'multiple'}
										<input class="inp_check" type="checkbox" name="{variable}[{.*::ITM_ID}#EMAIL2][selected]"{optional *::checked} checked="checked"{/optional}/>
										<input type="hidden" name="{variable}[{.*::ITM_ID}#EMAIL2][address]" value="{!optional *::NOCA}&quot;{htmlspecialchars .*::ITMCLASSIFYAS}&quot;&lt;{/optional}{htmlspecialchars *::LCTEMAIL2}{!optional *::NOCA}&gt;{/optional}"/>
										{/optional}
										{optional type 'single'}
										<input type="radio" name="{variable}" value="{!optional *::NOCA}&quot;{htmlspecialchars .*::ITMCLASSIFYAS}&quot;&lt;{/optional}{htmlspecialchars .*::LCTEMAIL2}{!optional *::NOCA}&gt;{/optional}"{optional *::checked} checked="checked"{/optional}/>
										{/optional}
									</td>
									<td>{htmlspecialchars *::LCTEMAIL2}</td>
								</tr>
								{/optional}
								{optional *::LCTEMAIL3}
								<tr>
									<td>
										{optional type 'multiple'}
										<input class="inp_check" type="checkbox" name="{variable}[{.*::ITM_ID}#EMAIL3][selected]"{optional *::checked} checked="checked"{/optional}/>
										<input type="hidden" name="{variable}[{.*::ITM_ID}#EMAIL3][address]" value="{!optional *::NOCA}&quot;{htmlspecialchars .*::ITMCLASSIFYAS}&quot;&lt;{/optional}{htmlspecialchars .*::LCTEMAIL3}{!optional *::NOCA}&gt;{/optional}"/>
										{/optional}
										{optional type 'single'}
										<input type="radio" name="{variable}" value="{!optional *::NOCA}&quot;{htmlspecialchars .*::ITMCLASSIFYAS}&quot;&lt;{/optional}{htmlspecialchars *::LCTEMAIL3}{!optional *::NOCA}&gt;{/optional}"{optional *::checked} checked="checked"{/optional}/>
										{/optional}
									</td>
									<td>{*::LCTEMAIL3DISPLAY}</td>
								</tr>
								{/optional}
							</table>
						</td>
						<td>
							<a href="?_l=item&p0=main&p1=content&p2={.*::page}&p3=item.fdr&p4={optional request::all::_s::id}{htmlspecialchars request::all::_s::id}{/optional}{!optional request::all::_s::id}{settings::default_folders::contacts}{/optional}&p5=C&p6={.*::ITM_ID}">{optional *::page 'contact.distribution'}[{/optional}{htmlspecialchars *::ITMCLASSIFYAS}{optional *::NOCA}<span class="gray">{lang::contact_main::no_name}{/optional}</span>{optional *::page 'contact.distribution'}]{/optional}</a>
						</td>
						<td>
							<span>{htmlspecialchars *::ITMCOMPANY}</span>
						</td>
						<td>
							<span>{htmlspecialchars *::ITMDEPARTMENT}</span>
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
			
		</div>


{include ../basic/skin/fresh/tpl/_toolbar.bottom_contact.select.tpl}