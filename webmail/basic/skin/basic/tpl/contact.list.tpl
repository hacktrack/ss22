<table cellspacing="0" id="tGrid" class="tGrid contactGrid">
<tr>
	<th class="firstCol">&nbsp;</th>
	<th{optional aSort::column 'itmClassifyAs'} class="sort{dSort::itmClassifyAs::type}"{/optional}><a href="index.html?_l=folder&amp;p0=main&amp;p1=content&amp;p2=contact.main&amp;p3=item.fdr&amp;p4={htmlspecialchars request::all::_s::id}&amp;p5=C&amp;_s[sort]={dSort::itmClassifyAs::orderby}{optional request::all::_s::search}&_s[search]={htmlspecialchars request::all::_s::search}{/optional}">{lang::contact_main::contact_name}</a></th>
	<th class="tdSizeMedium{optional aSort::column 'lctemail1'} sort{dSort::lctemail1::type}{/optional}"><a href="index.html?_l=folder&amp;p0=main&amp;p1=content&amp;p2=contact.main&amp;p3=item.fdr&amp;p4={htmlspecialchars request::all::_s::id}&amp;p5=C&amp;_s[sort]={dSort::lctemail1::orderby}{optional request::all::_s::search}&_s[search]={htmlspecialchars request::all::_s::search}{/optional}">{lang::contact_main::email}</a></th>
	<th class="tdSizeSmall{optional aSort::column 'itmCompany'} sort{dSort::itmCompany::type}{/optional}"><a href="index.html?_l=folder&amp;p0=main&amp;p1=content&amp;p2=contact.main&amp;p3=item.fdr&amp;p4={htmlspecialchars request::all::_s::id}&amp;p5=C&amp;_s[sort]={dSort::itmCompany::orderby}{optional request::all::_s::search}&_s[search]={htmlspecialchars request::all::_s::search}{/optional}">{lang::contact_main::company}</a></th>
	<th class="tdSizeSmall{optional aSort::column 'itmDepartment'} sort{dSort::itmDepartment::type}{/optional}"><a href="index.html?_l=folder&amp;p0=main&amp;p1=content&amp;p2=contact.main&amp;p3=item.fdr&amp;p4={htmlspecialchars request::all::_s::id}&amp;p5=C&amp;_s[sort]={dSort::itmDepartment::orderby}{optional request::all::_s::search}&_s[search]={htmlspecialchars request::all::_s::search}{/optional}">{lang::contact_main::department}</a></th>

	<th class="tdSizeSmall nrb{optional aSort::column 'itmCategory'} sort{dSort::itmCategory::type}{/optional}"><a href="index.html?_l=folder&amp;p0=main&amp;p1=content&amp;p2=contact.main&amp;p3=item.fdr&amp;p4={htmlspecialchars request::all::_s::id}&amp;p5=C&amp;_s[sort]={dSort::itmCategory::orderby}{optional request::all::_s::search}&_s[search]={htmlspecialchars request::all::_s::search}{/optional}">{lang::contact_main::category}</a></th>
</tr>
{dynamic items}
<tr>
	<td class="contactGridTD iconBox"><input type="checkbox" name="items[{.*::id}]"/> </td>
	<td class="contactGridTD">
		<div class="oFlowController">
			<a class="oFlowA" href="?_l=item&p0=main&p1=content&p2={.*::page}&p3=item.fdr&p4={optional request::all::_s::id}{htmlspecialchars request::all::_s::id}{/optional}{!optional request::all::_s::id}{settings::default_folders::contacts}{/optional}&p5=C&p6={.*::ITM_ID}">
			{optional *::page 'contact.distribution'}[{/optional}{.*::ITMCLASSIFYAS}{optional *::NOCA}<span class="gray">{lang::contact_main::no_name}{/optional}</span>{optional *::page 'contact.distribution'}]{/optional}			
			</a>
		</div>
	</td>
	<td class="contactGridTD underlineLinks">
		<div class="oFlowController">
			{optional *::LCTEMAIL1}
				{!optional *::page 'contact.distribution'}
				<a class="oFlowA" href="?_n[p][content]=mail.compose&_n[p][main]=win.main.tree&to={optional *::ITMCLASSIFYAS}%22{.*::ITMCLASSIFYAS_URLESCAPED}%22%3C{.*::LCTEMAIL1}%3E{/optional}{!optional *::ITMCLASSIFYAS}{.*::LCTEMAIL1}{/optional}">{.*::LCTEMAIL1}</a>
				{/optional}		
			{/optional}
			{optional *::LCTEMAIL2}	
				{optional *::LCTEMAIL1}, {/optional}
				<a class="oFlowA" href="?_n[p][content]=mail.compose&_n[p][main]=win.main.tree&to={optional *::ITMCLASSIFYAS}%22{.*::ITMCLASSIFYAS_URLESCAPED}%22%3C{.*::LCTEMAIL2}%3E{/optional}{!optional *::ITMCLASSIFYAS}{.*::LCTEMAIL1}{/optional}">{.*::LCTEMAIL2}</a>
			{/optional}
			{optional *::LCTEMAIL3}
				{optional *::LCTEMAIL2 *::LCTEMAIL2}, {/optional}
				<a class="oFlowA" href="?_n[p][content]=mail.compose&_n[p][main]=win.main.tree&to={optional *::ITMCLASSIFYAS}%22{.*::ITMCLASSIFYAS_URLESCAPED}%22%3C{.*::LCTEMAIL3}%3E{/optional}{!optional *::ITMCLASSIFYAS}{.*::LCTEMAIL1}{/optional}">{.*::LCTEMAIL3}</a>
			{/optional}
			{!optional *::LCTEMAIL1}
			{!optional *::LCTEMAIL2}
			{!optional *::LCTEMAIL3}
				<span class="oFlowA" class="gray">{lang::contact_main::no_email}</span>
			{/optional}
			{/optional}
			{/optional}
		</div>
	</td>
	<td class="contactGridTD"><div class="oFlowController"><span class="oFlowA">{.*::ITMCOMPANY ''}</span></div></td>
	<td class="contactGridTD"><div class="oFlowController"><span class="oFlowA">{.*::ITMDEPARTMENT ''}</span></div></td>
	<td class="contactGridTD"><div class="oFlowController"><span class="oFlowA">{.*::ITMCATEGORY ''}</span></div></td>
</tr>
{/dynamic}
</table>