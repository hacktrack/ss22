<!-- toolbar top -->
	
			<div class="toolbar">
			
			<table class="toolbar">
				<tr>
					<td class="rspace">
						<input class="inp_btn" type="submit" value="{lang::mail_main::deliver}" name="_a[deliver]"/>
					</td>
					<td class="rspace lspace">
						<input class="inp_btn" type="submit" value="{lang::mail_main::whitelist}" name="_a[whitelist]"/>
					</td>
					<td class="rspace lspace">
						<input class="inp_btn" type="submit" value="{lang::mail_main::blacklist}" name="_a[blacklist]"/>
					</td>
					<td class="rspace lspace">
						<input class="inp_btn" type="submit" value="{lang::mail_main::delete}" name="_a[delete]" alt="{lang::confirmation::delete_this_mail}"/>
					</td>
					<th></th>
				</tr>
			</table>
			<table class="toolbar">
				<tr>
					<td class="lister">
						<a title="{lang::mail_view::prev}" href="{!optional navigation::prev}#{/optional}{optional navigation::prev}{navigation::prev}{/optional}" class="button{!optional navigation::prev} disabled{/optional}"><span>&lt;</span></a>
					</td>
					<td class="lister lspace">
						<a title="{lang::mail_view::next}" href="{!optional navigation::next}#{/optional}{optional navigation::next}{navigation::next}{/optional}" class="button {!optional navigation::next} disabled{/optional}"><span>&gt;</span></a>
					</td>
				</tr>
			</table>
			</div>