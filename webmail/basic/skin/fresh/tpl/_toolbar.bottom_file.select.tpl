<!-- toolbar bottom -->

			<div class="toolbar toolbar2">
		
			<input type="hidden" name="_c" value="{info::controller}" />
			<input type="hidden" name="container" value="{container::id}" />
			<input type="hidden" name="type" value="{container::type}" />
			<input type="hidden" name="_dlg[cancel_select][type]" value="select"/>
			<input type="hidden" name="_dlg[cancel_select][controller]" value="{dialog::controller}"/>
			<input type="hidden" name="_dlg[cancel_select][action]" value="cancel_select"/>
			<input type="hidden" name="_dlg[file_select][type]" value="select" />
			<input type="hidden" name="_dlg[file_select][controller]" value="{dialog::controller}"/>
			<input type="hidden" name="_dlg[file_select][action]" value="{dialog::action}"/>
			<table class="toolbar">
				<tr>
					<td class="lbig rbig">
						<input type="submit" value="{lang::mail_compose::add_files}" name="_dlg[file_select][process]" class="inp_btn" />
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
						<input {!optional info::hasPrev}disabled="disabled"{/optional} class="inp_btn{!optional info::hasPrev} disabled{/optional}" type="submit" name="_a[prev_bottom]" value="&lt;" title="{lang::mail_view::prev}"/>
						<span>{htmlspecialchars info::page '0'} / {info::total '0'}</span>
						<input type="hidden" value="{htmlspecialchars info::page}" name="_s[page_bottom]" id="pageBottom"/>
						<input {!optional info::hasNext}disabled="disabled"{/optional} class="inp_btn{!optional info::hasNext} disabled{/optional}" type="submit" name="_a[next_bottom]" value="&gt;" title="{lang::mail_view::next}"/>
						<input {!optional info::hasNext}disabled="disabled"{/optional} class="inp_btn{!optional info::hasNext} disabled{/optional}" type="submit" name="_a[next_five]" value="+5" title="{lang::mail_view::next}"/>
						<input {!optional info::hasNext}disabled="disabled"{/optional} class="inp_btn{!optional info::hasNext} disabled{/optional}" type="submit" name="_a[last]" value="&gt;&gt;" title="{lang::mail_view::last}"/>
						
						<input type="hidden" value="1" id="pageBottom_hidden"/>
					</td>
				</tr>
			</table>
			</div>
