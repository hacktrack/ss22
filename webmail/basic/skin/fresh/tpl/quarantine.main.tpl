{include ../basic/skin/fresh/tpl/_toolbar.top_quarantine.bwlist.tpl}

<div class="body">
	
	<input type="hidden" name="_s[default_page]" value="{htmlspecialchars info::page}"/>


	<table class="datagrid" id="datagrid">
		<thead>
			<tr>
				<th class="th_check"><span>&nbsp;</span></th>
				<th style="width: 30%"><span>{lang::mail_main::sender}</span></th>
				<th style="width: 30%"><span>{lang::mail_main::subject}</span></th>
				<th style="width: 20%"><span>{lang::mail_main::owner}</span></th>
				<th style="width: 20%"><span>{lang::mail_main::domain}</span></th>
				<th style="width: 85px"><span>{lang::mail_main::date}</span></th>
			</tr>
		</thead>
		<tbody>
		{dynamic items}
		<tr>
			<td>
				<input class="inp_check" type="checkbox" name="{variable}[{.*::id}]"{optional *::checked} checked="checked"{/optional}/>
			</td>
			<td>
				<a href="{.*::link}">{htmlspecialchars .*::aditional::fromshow}</a>
			</td>
			<td>
				<a href="{.*::link}">{!optional *::subject}<span class="gray">{lang::mail_main::no_subject}</span>{/optional}{.*::subject}</a>
			</td>
			<td>
				<a href="{.*::link}">{htmlspecialchars .*::aditional::toshow}</a>
			</td>
			<td>
				<a href="{.*::link}">{htmlspecialchars .*::domain}</a>
			</td>
			<td>
				<span title="{.*::aditional::fulldate}">{.*::aditional::date}</span>
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
	<input type="hidden" id="sid" value="{info::sid}"/>
	<input type="hidden" id="uid" value="{info::uid}"/>
	<input type="hidden" id="fid" value=""/>

</div>

{include ../basic/skin/fresh/tpl/_toolbar.bottom_quarantine.bwlist.tpl}
