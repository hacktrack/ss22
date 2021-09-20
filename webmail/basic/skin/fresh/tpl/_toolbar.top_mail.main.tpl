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
					{optional jscheck}
					<td class="lbig rbig">
						<div class="check mask noJSHide">
						<select class="block" id="action_select_top">
							<optgroup label="{lang::mail_main::select}">
							<option value="none" selected="selected">{lang::mail_main::none}</option>
							<option value="all">{lang::mail_main::all}</option>
							<option value="invert">{lang::mail_main::invert}</option>
							<option value="read">{lang::mail_main::read}</option>
							<option value="unread">{lang::mail_main::unread}</option>
							</optgroup>
						</select>
						<input type="checkbox" />
						</div>
					</td>
					<td class="lbig rspace">
						<div class="mask">
							<select class="block" id="action_move_top">
								<optgroup label="{lang::mail_main::move_to_folder}">
								<option value=""></option>
								{dynamic folders::personal}
								<option value="{.*::id}">{.*::label}</option>
								{/dynamic}
								</optgroup>
							</select>
							<input type="submit" value="{lang::mail_main::move}" class="inp_btn"/>
						</div>
					</td>
					<td class="rbig">
						<div class="mask">
							<select class="block" id="action_copy_top">
								<optgroup label="{lang::mail_main::copy_to_folder}">
								<option value=""></option>
								{dynamic folders::personal}
								<option value="{.*::id}">{.*::label}</option>
								{/dynamic}
								</optgroup>
							</select>
							<input type="submit" value="{lang::mail_main::copy}" class="inp_btn" />
						</div>
					</td>
					{/optional}
					{!optional container::isSent}
					<td class="rspace">
						<select class="inp_select" name="multiple_mail_action_top" id="action_more_top">
							<option value="">{lang::mail_main::dws}:</option>
							<option value="read">{lang::mail_main::mar}</option>
							<option value="unread">{lang::mail_main::mau}</option>
							{optional settings::bwlist::whitelist}<option value="whitelist">{lang::mail_main::whitelist}</option>{/optional}
							{optional settings::bwlist::blacklist}<option value="blacklist">{lang::mail_main::blacklist}</option>{/optional}
							{!optional jscheck}
								<option value="copy">{lang::mail_main::copy}</option>
								<option value="move">{lang::mail_main::move}</option>
							{/optional}
						</select>
					</td>
					{!optional jscheck}
					<td class="lbig rspace">
						<select class="inp_select" name="select_folder_top">
							<option value="">{lang::mail_main::select_folder}</option>
							{dynamic folders::personal}
							<option value="{.*::id}">{.*::label}</option>
							{/dynamic}
						</select>
					</td>
					{/optional}
					<td class="rspace">
						<input type="submit" value="{lang::mail_main::doit}" class="inp_btn noJSShow" name="_a[multiple_mail_action_top]" id="action_more_top_button"/>
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
