<!-- toolbar top -->
		<div class="toolbar">
			
			<input type="hidden" name="_c" value="{info::controller}" />
			<input type="hidden" name="container" value="{container::id}" />
			<input type="hidden" name="type" value="{container::type}" />
			<input type="hidden" name="select_folder_top" value="" id="select_folder_top"/>
			<input type="hidden" name="multiple_mail_action_top" value="" id="multiple_mail_action_top"/>
			<input type="hidden" name="_a[multiple_mail_action_top]" id="multiple_mail_action_top_action" value=""/>
			
			<table class="toolbar">
				<tr>
				{!optional container::type 'C'}
					{optional jscheck}
					<td class="lbig rbig">
						<div class="check mask noJSHide">
						<select class="block" id="action_select_top">
							<optgroup label="{lang::mail_main::select}">
							<option value="none" selected="selected">{lang::mail_main::none}</option>
							<option value="all">{lang::mail_main::all}</option>
							<option value="invert">{lang::mail_main::invert}</option>
							</optgroup>
						</select>
						<input type="checkbox" />
						</div>
					</td>
					{/optional}
					<td class="lbig rbig">
						<input type="submit" value="{lang::mail_main::delete}" class="inp_btn" name="_a[delete]"/>
					</td>
				{/optional}
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
			</div>
