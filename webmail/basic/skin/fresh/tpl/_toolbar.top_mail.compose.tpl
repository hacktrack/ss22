<!-- toolbar top -->
	
			<div class="toolbar">
			
			
			
			<table class="toolbar">
				<tr>
					<td class="rspace">
						<input id="top_submit" type="submit" class="bfield inp_btn ctrl_enter" name="_a[send]" value="{lang::mail_compose::send_message}" tabindex="10"/>
					</td>
					<td class="lspace">
						<input type="submit" class="bfield inp_btn ctrl_s" name="_a[save]" value="{lang::mail_compose::save_message}" tabindex="11"/>
					</td>
					<th></th>
					<td>
						<div class="noJSHide">
							{!optional item::force::type}
								<select{optional item::force::type} disabled="disabled"{/optional} id="selectType" name="_frm[options][type]" size="1">
									<option value="plain" {optional item::type 'text'}selected="selected"{/optional}>{lang::mail_compose::plain}
									</option>
									<option value="html" {optional item::type 'html'}selected="selected"{/optional}>{lang::mail_compose::html}
									</option>
								</select>
							{/optional}
							{optional item::force::type}
							<input type="hidden" name="_frm[options][type]" id="selectType" value="{optional item::type 'text'}plain{/optional}{!optional item::type 'text'}html{/optional}"/>
							{/optional}
							
						</div>
					</td>
				</tr>
			</table>
			</div>