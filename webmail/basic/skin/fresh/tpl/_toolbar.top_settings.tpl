<!-- toolbar top -->
			<div class="toolbar">
			<table class="toolbar">
				<tr>
					<td class="rbig">
						<input type="submit" class="inp_btn" value="{lang::grid::save}" name="_a[save]"/>
						<input type="hidden" name="_c" value="settings"/>
						<input type="hidden" name="level" value="{property::level}"/>
						{optional property::domain}<input type="hidden" name="domain" value="{property::domain}"/>{/optional}
					</td>
					<th></th>
					<td>
						<!-- -->
						{optional request::all::domain '__new'}
							<!--New Domain-->
							<select name="navigate">
								{optional property::available_domains}
									{dynamic property::available_domains}
										{!optional .*::set}<option value="{.*::domain}">{.*::domain}</option>{/optional}
									{/dynamic}
								{/optional}
							</select>
						{/optional}
							
							
						{!optional request::all::domain '__new'}
							{optional property::account}
							<!--Navigate-->
								<select name="navigate">
									<option value="__user"{optional property::level 'user'} selected="selected"{/optional}>{lang::settings::user}</option>
									{optional property::access::admin}
										<option value="__admin"{optional property::level 'admin'} selected="selected"{/optional}>{lang::settings::admin}</option>
									{/optional}
									{optional property::access::domain}
										{optional property::available_domains}
										<optgroup label="{lang::settings::domains}">
											{dynamic property::available_domains}
												<!--{optional .*::set}<option value="{.*::domain}"{optional .*::domain_selected} selected="selected"{/optional}>{.*::domain}</option>{/optional}-->
												<option value="{.*::domain}"{optional .*::domain_selected} selected="selected"{/optional}>{.*::domain}</option>
											{/dynamic}
										</optgroup>
										{/optional}
										<!--<option value="__new">{lang::settings::new_domain}</option>-->
									{/optional}
								</select>
							{/optional}
							
							<!--{optional request::all::domain}<input type="submit" name="_a[remove_domain]" value="{lang::settings::remove}" class="fancyButton"/>{/optional}-->
						{/optional}
						<!-- -->
					</td>
					{!optional request::all::domain '__new'}
					{optional property::account}
					<td class="lbig">
						<input type="submit" name="_a[navigate]" value="{lang::settings::navigate}" class="inp_btn"/>
					</td>
					{/optional}
					{/optional}
				</tr>
			</table>
			</div>
