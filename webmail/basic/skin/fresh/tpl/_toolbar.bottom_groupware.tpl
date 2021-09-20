<!-- toolbar bottom -->

			<div class="toolbar toolbar2">
		
			<input type="hidden" name="_c" value="{info::controller}" />
			<input type="hidden" name="container" value="{container::id}" />
			<input type="hidden" name="type" value="{container::type}" />
			<input type="hidden" name="select_folder_bottom" value="" id="select_folder_bottom"/>
			<input type="hidden" name="multiple_mail_action_bottom" value="" id="multiple_mail_action_bottom"/>
			<input type="hidden" name="_a[multiple_mail_action_bottom]" id="multiple_mail_action_bottom_action" value=""/>
		
			<table class="toolbar">
				<tr>
					{optional jscheck}
					<td class="lbig rbig">
						<div class="check mask noJSHide">
						<select class="block" id="action_select_bottom">
							<optgroup label="{lang::mail_main::select}">
							<option value="none" selected="selected">{lang::mail_main::none}</option>
							<option value="all">{lang::mail_main::all}</option>
							<option value="invert">{lang::mail_main::invert}</option>
							</optgroup>
						</select>
						<input type="checkbox" />
						</div>
					</td>
					<td class="lbig rspace">
						<div class="mask">
							<select class="block" id="action_move_bottom">
								<optgroup label="{lang::mail_main::move_to_folder}">
								<option></option>
								{dynamic folders::personal}
								<option value="{.*::id}">{.*::label}</option>
								{/dynamic}
								</optgroup>
							</select>
							<input type="submit" value="{lang::mail_main::move}" class="inp_btn" />
						</div>
					</td>
					<td class="rbig">
						<div class="mask">
							<select class="block" id="action_copy_bottom">
								<optgroup label="{lang::mail_main::copy_to_folder}">
								<option></option>
								{dynamic folders::personal}
								<option value="{.*::id}">{.*::label}</option>
								{/dynamic}
								</optgroup>
							</select>
							<input type="submit" value="{lang::mail_main::copy}" class="inp_btn" />
						</div>
					</td>
					{/optional}
					{!optional jscheck}
					<td class="rspace">
						<select class="inp_select" name="multiple_mail_action_bottom" id="action_more_bottom">
							<option value="">{lang::mail_main::dws}:</option>
								<option value="copy">{lang::mail_main::copy}</option>
								<option value="move">{lang::mail_main::move}</option>
						</select>
					</td>
					<td class="lbig rspace">
						<select class="inp_select" name="select_folder_bottom">
							<option value="">{lang::mail_main::select_folder}</option>
							{dynamic folders::personal}
							<option value="{.*::id}">{.*::label}</option>
							{/dynamic}
						</select>
					</td>
					<td class="rspace">
						<input type="submit" value="{lang::mail_main::doit}" class="inp_btn noJSShow" name="_a[multiple_mail_action_bottom]" id="action_more_bottom_button"/>
					</td>
					{/optional}
					<td class="lbig rbig">
						<input type="submit" value="{lang::mail_main::delete}" class="inp_btn" name="_a[delete]"/>
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
