<form method="post" enctype="multipart/form-data" action="{action}">
<input type="hidden" name="_frm[sourceid]" {optional item::sourceid} value="{item::sourceid}"{/optional}/>
<input type="hidden" name="_frm[sourcefolder]" {optional item::sourcefolder} value="{item::sourcefolder}"{/optional}/>
<input type="hidden" name="_frm[sourceaccount]" {optional item::sourceaccount} value="{item::sourceaccount}"{/optional}/>
<input type="hidden" name="_frm[sourceaction]" {optional item::sourceaction} value="{item::sourceaction}"{/optional}/>

<input type="hidden" name="_frm[draftfolder]" {optional item::draftfolder} value="{item::draftfolder}"{/optional}/>
<input type="hidden" name="_frm[draftaccount]" {optional item::draftaccount} value="{item::draftaccount}"{/optional}/>
<input type="hidden" name="_frm[draftid]" {optional item::draftid} value="{item::draftid}"{/optional}/>
<input type="hidden" name="_frm[mail_action]" {optional item::mail_action} value="{item::mail_action}"{/optional}/>
<input type="hidden" name="_dlg[grid_contact_select][actions]" value="contacts_to|contacts_cc|contacts_bcc" />

<input type="hidden" name="_dlg[grid_contact_select][target]" value="main" />
<input type="hidden" name="_dlg[grid_contact_select][controller]" value="message" />
<input type="hidden" name="_dlg[grid_contact_select][parameters][all][_s][id]" value="__@@ADDRESSBOOK@@__" />
<input type="hidden" name="_dlg[grid_contact_select][parameters][all][_s][filter]" value="((NOT (LCTEMAIL1 ='')) OR (NOT (LCTEMAIL2 ='')) OR (NOT (LCTEMAIL3 ='')))" />
<input type="hidden" name="_frm[options][priority]" value="{optional item::options::priority '1'}highest{/optional}{optional item::options::priority '2'}high{/optional}{optional item::options::priority '3'}normal{/optional}{optional item::options::priority '4'}low{/optional}{optional item::options::priority '5'}lowest{/optional}"/>
<input type="hidden"{optional item::options::request_read_confirmation} value="1"{/optional} name="_frm[options][request_read_confirmation]" />
<input type="hidden"{optional item::options::save_sent_message} value="1"{/optional} name="_frm[options][save_sent_message]"/>
<input type="hidden" name="_c" value="message"/>
{optional item::in-reply-to}
<input type="hidden" name="_frm[in-reply-to]" value="{item::in-reply-to}"/>
{/optional}
{optional item::message_id}
<input type="hidden" name="_frm[message_id]" value="{item::message_id}"/>
{/optional}
{optional item::references}
<input type="hidden" name="_frm[references]" value="{item::references}"/>
{/optional}
	{anchor::compose.menu}
	<div class="d_compose">
		<table cellspacing="0" cellpadding="0">
			<tr>
				<th>{optional settings::groupware::enabled}<input type="submit" class="button" name="_a[contacts_to]" value="{/optional}{lang::email::to}{optional settings::groupware::enabled}"/><span class="hidden_widthholder">{lang::email::to}</span>{/optional}</th>
				<td><input type="text" name="_frm[to]"{optional item::to} value="{htmlspecialchars item::to}"{/optional}{optional request::all::to} value="{htmlspecialchars request::all::to}"{/optional}/></td>
				<th><input style="width:48px;" type="button" class="button ico_radiator" id="cc_bcc" value="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"/></th>
			</tr>
			<tr style="display:none" id="cc">
				<th>{optional settings::groupware::enabled}<input type="submit" class="button" name="_a[contacts_cc]" value="{/optional}{lang::email::cc}{optional settings::groupware::enabled}"/><span class="hidden_widthholder">{lang::email::cc}</span>{/optional}</th>
				<td colspan="2"><input type="text" name="_frm[cc]"{optional item::cc} value="{htmlspecialchars item::cc}"{/optional} id="cc_field"/></td>
			</tr>
			<tr style="display:none" id="bcc">
				<th>{optional settings::groupware::enabled}<input type="submit" class="button" name="_a[contacts_bcc]" value="{/optional}{lang::email::bcc}{optional settings::groupware::enabled}"/><span class="hidden_widthholder">{lang::email::bcc}</span>{/optional}</th>
				<td colspan="2"><input type="text" name="_frm[bcc]" {optional item::bcc} value="{htmlspecialchars item::bcc}"{/optional} /></td>
			</tr>
			<tr>
				<th>{lang::datagrid_items_view::subject}</th>
				<td colspan="2"><input type="text" name="_frm[subject]"{optional item::subject} value="{htmlspecialchars item::subject}"{/optional} /></td>
			</tr>
			{optional item::attachments}
			<tr>
				<th>{lang::email::attachments}</th>
				<td>
						{dynamic item::attachments}
							<input type="hidden" name="_frm[attachment_s][{.*::fullpath}][class]" value="{.*::class}" />
							<input type="hidden" name="_frm[attachment_s][{.*::fullpath}][fullpath]" value="{.*::fullpath}" checked="checked"/>

							<span>
								<input type="checkbox" name="_frm[attachment_s][{.*::fullpath}][process]" checked="checked" class="checkbox"/>
								<span class="left attachmentLink ico_{.*::extension}" title="{htmlspecialchars *::name}">{htmlspecialchars *::name}</span>
							</span>
						{/dynamic}
				</td>
			</tr>
			{/optional}
			
			<tr>
				<td colspan="3"><textarea name="_frm[html]" rows="10" cols="30">{optional item::text}{htmlspecialchars item::text}{/optional}</textarea>
				</td>
			</tr>
		</table>
	</div>
	{anchor::compose.menu_bottom}
</form>