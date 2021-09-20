
<!-- toolbar bottom -->
	
			<div class="toolbar toolbar2">
			
			<input type="hidden" name="_c" value="item" />
			<input type="hidden" name="items[{item::id}]" value="on"/>
			<input type="hidden" name="container" value="{container::id}"/>
			
			<table class="toolbar">
				<tr>
					<td class="rspace">
						<a href="?_n[p][content]=mail.compose&amp;_n[p][main]=win.main.tree&amp;_s[action]=reply&amp;_s[id]={container::id}&amp;_s[item]={item::id}" class="button" id="at_replyMail">{lang::mail_main::reply}</a>
					</td>
					<td class="lspace rspace">
						<a href="?_n[p][content]=mail.compose&amp;_n[p][main]=win.main.tree&amp;_s[action]=replytoall&amp;_s[id]={container::id}&amp;_s[item]={item::id}" class="button" id="at_replyMailAll">{lang::mail_main::reply_to_all}</a>
					</td>
					<td class="lspace rbig">
						<a href="?_n[p][content]=mail.compose&amp;_n[p][main]=win.main.tree&amp;_s[action]=forward&amp;_s[id]={container::id}&amp;_s[item]={item::id}" class="button" id="forwardMail">{lang::mail_main::forward}</a>
					</td>
					<td class="lbig rbig">
						<input type="submit" value="{lang::mail_main::delete}" class="inp_btn" name="_a[delete]" alt="{lang::confirmation::delete_this_mail}"/>
					</td>
					<td class="lbig rspace">
						<a href="{htmlFrame::src}" class="button printMail" target="_blank">{lang::mail_main::print}</a>
					</td>
					<td class="lspace rspace">
						<a href="{htmlFrame::src}" class="button" target="_top">{lang::mail_main::fullscreen}</a>
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