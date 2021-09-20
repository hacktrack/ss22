		{include ../basic/skin/fresh/tpl/_toolbar.top_hipaa.tpl}
		
		<div class="body">
			<!-- datagrid -->
			<div>
				<table class="datagrid" id="datagrid">
				<thead>
					<tr>
						<th class="th_check"><span>&nbsp;</span></th>
						<!--<th style="width: 25%" class="{optional aSort::column 'email'}sort{dSort::email::type}{/optional}"><a href="index.html?_l=folder&amp;p0=main&amp;p1=content&amp;p2=hipaa.main&amp;p3=item.fdr&amp;p4={request::all::_s::id}&amp;p5=HIPAA&amp;_s[sort]={dSort::email::orderby}{optional request::all::_s::search}&_s[search]={request::all::_s::search}{/optional}">{lang::contact_main::email}</a></th>
						--><th style="width: 15%" class="{optional aSort::column 'fullname'}sort{dSort::fullname::type}{/optional}"><a href="index.html?_l=folder&amp;p0=main&amp;p1=content&amp;p2=hipaa.main&amp;p3=item.fdr&amp;p4={request::all::_s::id}&amp;p5=HIPAA&amp;_s[sort]={dSort::fullname::orderby}{optional request::all::_s::search}&_s[search]={request::all::_s::search}{/optional}">{lang::login::full_name}</a></th>
						<th style="width: 15%" class="{optional aSort::column 'type'} sort{dSort::type::type}{/optional}"><a href="index.html?_l=folder&amp;p0=main&amp;p1=content&amp;p2=hipaa.main&amp;p3=item.fdr&amp;p4={request::all::_s::id}&amp;p5=HIPAA&amp;_s[sort]={dSort::type::orderby}{optional request::all::_s::search}&_s[search]={request::all::_s::search}{/optional}">{lang::notes::category}</a></th>
					</tr>
				</thead>
				<tbody>
				{dynamic items}
					<tr>
						<td>
							<input class="inp_check" type="checkbox" name="{variable}[{.*::id}]"{optional *::checked} checked="checked"{/optional}/>
						</td>
						<!--<td class="td_link mail_links">
							{optional *::email}
								{!optional *::page 'contact.distribution'}
								<a href="?_n[p][content]=mail.compose&_n[p][main]=win.main.tree&to={optional *::fullname}%22{htmlspecialchars .*::fullname}%22%3C{htmlspecialchars .*::email}%3E{/optional}{!optional *::fullname}{htmlspecialchars *::email}{/optional}">{htmlspecialchars *::email}</a>
								{/optional}
							{/optional}
							{!optional *::email}
								<span class="gray">{lang::contact_main::no_email}</span>
							{/optional}
						</td>-->
						<td>
							<a href="{*::link}">{htmlspecialchars *::name}</a>
						</td>
						<td>
							<a href="{*::link}">{htmlspecialchars *::category}</a>
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
			
		{include ../basic/skin/fresh/tpl/_toolbar.bottom_hipaa.tpl}