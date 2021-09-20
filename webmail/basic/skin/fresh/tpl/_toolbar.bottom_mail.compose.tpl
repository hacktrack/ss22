<!-- toolbar bottom -->
	
			<div class="toolbar toolbar2">
			
			<table class="toolbar">
				<tr>
					<td class="rspace">
						<input id="bottom_submit" type="submit" class="bfield inp_btn" name="_a[send]" value="{lang::mail_compose::send_message}" tabindex="10"/>
					</td>
					<td class="lspace">
						<input type="submit" class="bfield inp_btn" name="_a[save]" value="{lang::mail_compose::save_message}" tabindex="11"/>
					</td>
					<th></th>
					<td class="rbig">
						{lang::mail_compose::priority}
						<select{optional item::force::priority} disabled="disabled"{/optional} name="_frm[options][priority]" size="1"  tabindex="12">
							<!-- Obsolete <option value="highest"{optional item::options::priority '1'} selected="selected"{/optional}>{lang::mail_compose::highest}
							</option>-->
							<option value="high"{optional item::options::priority '2'} selected="selected"{/optional}>{lang::mail_compose::high}
							</option>
							<option value="normal"{optional item::options::priority '3'} selected="selected"{/optional}>{lang::mail_compose::normal}
							</option>
							<option value="low"{optional item::options::priority '4'} selected="selected"{/optional}>{lang::mail_compose::low}
							</option>
							<!-- Obsolete <option value="lowest"{optional item::options::priority '5'} selected="selected"{/optional}>{lang::mail_compose::lowest}
							</option>-->
						</select>
						{optional item::force::priority}
						<input type="hidden" name="_frm[options][priority]" value="{item::options::priority_val}"/>
						{/optional}
					</td>
					<td class="lbig rspace">
						<input{optional item::force::request_read_confirmation} disabled="disabled"{/optional} type="checkbox"{optional item::options::request_read_confirmation} checked="checked"{/optional} name="_frm[options][request_read_confirmation]" id="_frm[options][request_read_confirmation]" tabindex="13"/>{optional item::force::request_read_confirmation}<input type="hidden" name="_frm[options][request_read_confirmation]" value="{optional item::options::request_read_confirmation}1{/optional}{!optional item::options::request_read_confirmation}0{/optional}"/>{/optional}
                    </td>
                    <td class="rspace">
						<label for="_frm[options][request_read_confirmation]">{lang::mail_compose::rrc}</label>
					</td>
					<td class="rspace">
						<input{optional item::force::save_sent_message} disabled="disabled"{/optional} type="checkbox"{optional item::options::save_sent_message} checked="checked"{/optional} name="_frm[options][save_sent_message]" id="_frm[options][save_sent_message]" tabindex="14"/>{optional item::force::save_sent_message}<input type="hidden" name="_frm[options][save_sent_message]" id="_frm[options][save_sent_message]" value="{optional item::options::save_sent_message}1{/optional}{!optional item::options::save_sent_message}0{/optional}"/>{/optional}
                    </td>
                    <td>
						<label for="_frm[options][save_sent_message]">{lang::mail_compose::ssm}</label>
					</td>
				</tr>
			</table>
			</div>