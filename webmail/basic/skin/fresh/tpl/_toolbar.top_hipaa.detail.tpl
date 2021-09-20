<!-- toolbar top -->

			<div class="toolbar">
			<input type="hidden" name="_c" value="{info::controller}" />
			<input type="hidden" name="container" value="{container::id}" />
			<input type="hidden" name="type" value="{container::type}" />
			
			<table class="toolbar">
				<tr>
				{!optional container::type 'C'}
					{optional item::id}
					<td class="rbig">
						<input type="submit" name="_a[edit]" value="{lang::mail_main::save}" class="inp_btn"/>
					</td>
					{/optional}
					{optional item::id}
					<td class="rbig">
						<input type="submit" name="_a[delete]" value="{lang::mail_main::delete}" class="inp_btn" alt="{lang::confirmation::delete_item}"/>
					</td>
					{/optional}
					{!optional item::id}
					<td class="rbig">
						{!optional request::all::action}
						<input type="submit" name="_a[create]" value="{lang::mail_main::save}" class="inp_btn ctrl_enter ctrl_s"/>
						{/optional}
						{optional request::all::action}
						<input type="submit" name="_a[contact_save]" value="{lang::mail_main::save}" class="inp_btn ctrl_enter ctrl_s"/>
						{/optional}
					</td>
					{optional request::all::action}
					<td class="rbig">
						<input type="submit" name="_a[contact_cancel]" value="{lang::contact_main::cancel}" class="inp_btn"/>
					<td>
					{/optional}
					{/optional}
					<th></th>
				{/optional}
				</tr>
			</table>
			</div>