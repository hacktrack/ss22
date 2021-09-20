<form method="post" action="?_n[w]=main&amp;_n[p][content]=grid.contact.select&amp;_s[data]=item.fdr&amp;_s[id]=__@@ADDRESSBOOK@@__&amp;_s[type]=C&amp;_dlg=grid_contact_select" enctype="multipart/form-data">

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
	{anchor::compose.menu.top}
	<table class="compose" width="100%">
		<tr>
			<th width="0">{optional settings::groupware::enabled}<input type="submit" class="button" name="_a[contacts_to]" value="{/optional}{lang::email::to}{optional settings::groupware::enabled}"/>{/optional}</th>
			<td width="100%"><input class="input" type="text" name="_frm[to]"{optional item::to} value="{htmlspecialchars item::to}"{/optional}{optional request::all::to} value="{htmlspecialchars request::all::to}"{/optional} /></td>
		</tr>
		<tr>
			<th>{optional settings::groupware::enabled}<input type="submit" class="button" name="_a[contacts_cc]" value="{/optional}{lang::email::cc}{optional settings::groupware::enabled}"/>{/optional}</th>
			<td><input class="input" type="text" name="_frm[cc]"{optional item::cc} value="{htmlspecialchars item::cc}"{/optional} id="cc_field"/></td>
		</tr>
		<tr>
			<th>{optional settings::groupware::enabled}<input type="submit" class="button" name="_a[contacts_bcc]" value="{/optional}{lang::email::bcc}{optional settings::groupware::enabled}"/>{/optional}</th>
			<td><input class="input" type="text" name="_frm[bcc]"{optional item::bcc} value="{htmlspecialchars item::bcc}"{/optional}/></td>
		</tr>
		<tr>
			<th>{lang::email::subject}</th>
			<td><input class="input" type="text" name="_frm[subject]"{optional item::subject} value="{htmlspecialchars item::subject}"{/optional}/></td>
		</tr>
		<tr>
			<td colspan="2" width="100%"><textarea class="input textarea" name="_frm[html]">{optional item::text}{item::text}{/optional}</textarea></td>
		</tr>
</table>
{anchor::compose.menu.bottom}
</form>