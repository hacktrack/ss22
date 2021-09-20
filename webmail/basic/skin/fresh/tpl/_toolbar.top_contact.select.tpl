<!-- toolbar top -->
			<div class="toolbar">
			
			<input type="hidden" name="_c" value="{info::controller}" />
			<input type="hidden" name="container" value="{container::id}" />
			<input type="hidden" name="type" value="{container::type}" />
			
			<input type="hidden" name="_dlg[cancel_select][type]" value="select"/>
			<input type="hidden" name="_dlg[cancel_select][controller]" value="{dialog::controller}"/>
			<input type="hidden" name="_dlg[cancel_select][action]" value="cancel_select"/>
			<input type="hidden" name="_dlg[contact_select][type]" value="select" />
			<input type="hidden" name="_dlg[contact_select][controller]" value="{dialog::controller}"/>
			<input type="hidden" name="_dlg[contact_select][action]" value="{dialog::action}"/>
					
			<input type="hidden" name="_dlg[cancel_select][type]" value="select"/>
			
			<table class="toolbar">
				<tr>
					<td class="rbig">
						<input type="submit" value="{lang::mail_compose::add_contacts}" name="_dlg[contact_select][process]" class="inp_btn" />
					</td>
					<td>
						<input type="submit" value="{lang::mail_compose::cancel}" name="_dlg[cancel_select][process]" class="inp_btn" />
					</td>
					<th></th>
				</tr>
			</table>
			<table class="toolbar">
				<tr>
					<td class="lister">
						
						<input type="hidden" name="_s[default_page]" value="{htmlspecialchars info::page}"/>
						
						<input type="hidden" name="_c" value="{info::controller}" />
						<input type="hidden" name="container" value="{container::id}" />
						
						<input {!optional info::hasPrev}disabled="disabled"{/optional} class="inp_btn{!optional info::hasPrev} disabled{/optional}" type="submit" name="_a[first]" value="&lt;&lt;" title="{lang::mail_view::first}"/>
						<input {!optional info::hasPrev}disabled="disabled"{/optional} class="inp_btn{!optional info::hasPrev} disabled{/optional}" type="submit" name="_a[prev_five]" value="-5" title="{lang::mail_view::prev}"/>
						<input rel="{lang::messages::loading_prev_page}" {!optional info::hasPrev}disabled="disabled"{/optional} class="inp_btn{!optional info::hasPrev} disabled{/optional}{optional info::hasPrev} onPrev{/optional}" type="submit" name="_a[prev_top]" value="&lt;" title="{lang::mail_view::prev}"/>
						<span>{htmlspecialchars info::page '0'} / {info::total '0'}</span>
						<input type="hidden" value="{htmlspecialchars info::page}" name="_s[page_top]" id="pageTop"/>
						<input rel="{lang::messages::loading_next_page}" {!optional info::hasNext}disabled="disabled"{/optional} class="inp_btn{!optional info::hasNext} disabled{/optional}{optional info::hasNext} onNext{/optional}" type="submit" name="_a[next_top]" value="&gt;" title="{lang::mail_view::next}"/>
						<input {!optional info::hasNext}disabled="disabled"{/optional} class="inp_btn{!optional info::hasNext} disabled{/optional}" type="submit" name="_a[next_five]" value="+5" title="{lang::mail_view::next}"/>
						<input {!optional info::hasNext}disabled="disabled"{/optional} class="inp_btn{!optional info::hasNext} disabled{/optional}" type="submit" name="_a[last]" value="&gt;&gt;" title="{lang::mail_view::last}"/>
						
						<input type="hidden" value="1" id="pageTop_hidden"/>
						
					</td>
				</tr>
			</table>
			
			{optional info::checked}
			<div class="acenter selected_box">
				{lang::grid::number_of_items} <strong>{info::checked_count}</strong> <input type="submit" class="button" value="{lang::grid::clear}" name="_a[clear_selected]"/>
				{dynamic info::checked}
					<input type="hidden" name="{variable}[{.*}]" value="on" />
				{/dynamic}
			</div>
			{/optional}
			
			</div>
