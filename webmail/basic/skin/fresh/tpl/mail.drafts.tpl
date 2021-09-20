		{include ../basic/skin/fresh/tpl/_toolbar.top_mail.main.tpl}
		
		<div class="body">
		
				<!-- datagrid -->
				<div>
					<table class="datagrid" id="datagrid">
					<thead>
						<tr>
							<th class="th_check"><span>&nbsp;</span></th>
							<th class="th_check" colspan="2"><span>&nbsp;</span></th>
							<th style="width: 30%"><span>{lang::mail_main::to}</span></th>
							<th style="width: 70%"><span>{lang::mail_main::subject}</span></th>
							<th style="width: 75px"><span>{lang::mail_main::saved}</span></th>
						</tr>
					</thead>
					<tbody>
					{dynamic items}
						<tr{optional *::recent} class="recent bold"{/optional}>
							<td>
								<input class="inp_check" type="checkbox" name="items[{.*::id}]"{optional *::checked} checked="checked"{/optional}/>
							</td>
							<td class="iconBox ico_mail_sf_{.*::smime_status}">
								<a class="icon" href="{.*::link}">
									{optional *::answered}
									<span class="flag_reply">
										{optional *::forwarded}<span class="flag_forward"></span>{/optional}
									</span>
									{/optional}
									{!optional *::answered}
										{optional *::forwarded}<span class="flag_forward"></span>{/optional}
									{/optional}
								</a>
							</td>
							<td></td>
							<td>
								{optional *::aditional::toshow}<a href="{.*::link}" title="{.*::aditional::toshow}">{.*::aditional::toshow}</a>{/optional}
							</td>
							<td>
								<a href="{.*::link}" title="{.*::subject}">{!optional *::subject}<span class="gray">{lang::mail_main::no_subject}</span>{/optional}{.*::subject}</a>
							</td>
							<td><a href="{.*::link}" title="{.*::aditional::fulldate}">{.*::aditional::date}</a></td>
						</tr>
					{/dynamic}
					</tbody>
					</table>
				</div>
				
</div>
				
		{include ../basic/skin/fresh/tpl/_toolbar.bottom_mail.main.tpl}



