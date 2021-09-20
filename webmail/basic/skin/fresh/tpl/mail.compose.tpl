{include ../basic/skin/fresh/tpl/_toolbar.top_mail.compose.tpl}

{!optional disable_dropbox}<script type="text/javascript" src="https://www.dropbox.com/static/api/2/dropins.js" id="dropboxjs" data-app-key="{dropbox_app_key}"></script>{/optional}

<div class="body form">

		<!--<form method="post" enctype="multipart/form-data" ddattacher="addFileField2" action="?_l=folder&p0=main&p1=content&p2=contact.select&p3=item.fdr&p4={settings::default_folders::contacts}&_n[p][main]=win.main.tree&p5=C">-->
		<input type="hidden" id="lang_leave_notice" value="{lang::mail_compose::leave_notice}"/>
		<input type="hidden" name="_frm[rfc_time]" id="timeInput" />

		<input type="hidden" name="_frm[sourceid]" {optional item::sourceid} value="{item::sourceid}"{/optional}/>
		<input type="hidden" name="_frm[sourcefolder]" {optional item::sourcefolder} value="{item::sourcefolder}"{/optional}/>
		<input type="hidden" name="_frm[sourceaccount]" {optional item::sourceaccount} value="{item::sourceaccount}"{/optional}/>
		<input type="hidden" name="_frm[sourceaction]" {optional item::sourceaction} value="{item::sourceaction}"{/optional}/>

		<input type="hidden" name="_frm[draftid]" {optional item::draftid} value="{item::draftid}"{/optional}/>
		<input type="hidden" name="_frm[draftfolder]" {optional item::draftfolder} value="{item::draftfolder}"{/optional}/>
		<input type="hidden" name="_frm[draftaccount]" {optional item::draftaccount} value="{item::draftaccount}"{/optional}/>
		<input type="hidden" name="_frm[mail_action]" {optional item::mail_action} value="{item::mail_action}"{/optional}/>
		<input type="hidden" name="_dlg[contact_select][actions]" value="contacts_to|contacts_cc|contacts_bcc" />
		<input type="hidden" name="_dlg[contact_select][referer]" value="mail.compose" />
		<input type="hidden" name="_dlg[contact_select][target]" value="content" />
		<input type="hidden" name="_dlg[contact_select][controller]" value="message" />
		<input type="hidden" name="_dlg[contact_select][parameters][all][_s][id]" value="{settings::default_folders::contacts}" />
		<input type="hidden" name="_dlg[contact_select][parameters][all][_s][filter]" value="((NOT (LCTEMAIL1 ='')) OR (NOT (LCTEMAIL2 ='')) OR (NOT (LCTEMAIL3 ='')))" />
		<input type="hidden" name="_dlg[contact_select][link]" value="?_l=folder&p0=main&p1=content&p2=contact.select&p3=item.fdr&p4={settings::default_folders::contacts}&_n[p][main]=win.main.tree&p5=C" />
		
		
		<input type="hidden" name="_dlg[file_select][actions]" value="add_item" />
		<input type="hidden" name="_dlg[file_select][referer]" value="mail.compose" />
		<input type="hidden" name="_dlg[file_select][target]" value="content" />
		<input type="hidden" name="_dlg[file_select][controller]" value="message" />
		<input type="hidden" name="_dlg[file_select][parameters][all][_s][id]" value="{settings::default_folders::files}" />
		<input type="hidden" name="_dlg[file_select][link]" value="?_l=folder&p0=main&p1=content&p2=file.select&p3=item.fdr&p4={settings::default_folders::files}&_n[p][main]=win.main.tree&p5=F" />
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

		<div id="email">
			<table id="infoTable" class="frmtbl frmtbl100">
			{optional item::personalities}
			{!optional settings::restrictions::disable_personalities}
				<tr>
					<th>{lang::mail_compose::alias}</th>
					<td>
						<select name="_frm[options][alias]" size="1">
							<option value="">---</option>
							{dynamic item::personalities}
								<!--<option{optional *::selected} selected="selected"{/optional} value="{.*::person}">{.*::person}</option>-->
								<option{optional *::selected} selected="selected"{/optional} value="{.*::email}">{.*::email}</option>
							{/dynamic}
						</select>
					</td>
				</tr>
			{/optional}
			{/optional}
				<tr>
					<th class="rcp">
					{optional settings::groupware::enabled}
						{!optional settings::restrictions::disable_gw_types::C}
							<input id="tobut" type="submit" class="inp_btn big" name="_a[contacts_to]" value="{lang::mail_compose::to}" />
							<span class="sizeHolder">&nbsp;{lang::mail_compose::to}</span>
						{/optional}
						{optional settings::restrictions::disable_gw_types::C}{lang::mail_compose::to}{/optional}
					{/optional}
					{!optional settings::groupware::enabled}
						{lang::mail_compose::to}
					{/optional}
					
					</th>
					<td>
						<div class="inp_text">
							<input id="toField" type="text" name="_frm[to]" class="inp_text suggest" tabindex="1"{optional item::to} value="{htmlspecialchars item::to}"{/optional}{optional request::form::to} value="{htmlspecialchars request::form::to}"{/optional}{optional request::all::to} value="{htmlspecialchars request::all::to}"{/optional}/>
						</div>
					</td>
				</tr>
				<tr>
					<th class="rcp">
					{optional settings::groupware::enabled}
						{!optional settings::restrictions::disable_gw_types::C}
							<input id="ccbut" class="inp_btn big" type="submit" name="_a[contacts_cc]" value="{lang::mail_compose::cc}" />
							<span class="sizeHolder">&nbsp;{lang::mail_compose::cc}</span>
						{/optional}
						{optional settings::restrictions::disable_gw_types::C}{lang::mail_compose::cc}{/optional}
					{/optional}
					{!optional settings::groupware::enabled}
						{lang::mail_compose::cc}
					{/optional}
					</th>
					<td>
						<div class="inp_text">
							<input id="ccField" type="text" name="_frm[cc]" class="inp_text suggest" tabindex="2"{optional item::cc} value="{htmlspecialchars item::cc}"{/optional}/>
						</div>
					</td>
				</tr>
				<tr>
					<th class="rcp">
					
					{optional settings::groupware::enabled}
						{!optional settings::restrictions::disable_gw_types::C}
						<input id="bccbut" class="inp_btn big" type="submit" name="_a[contacts_bcc]" value="{lang::mail_compose::bcc}" />
						<span class="sizeHolder">&nbsp;{lang::mail_compose::bcc}</span>
						{/optional}
						{optional settings::restrictions::disable_gw_types::C}{lang::mail_compose::bcc}{/optional}
					{/optional}
					{!optional settings::groupware::enabled}
						{lang::mail_compose::bcc}
					{/optional}
					</th>
					<td>
						<div class="inp_text">
							<input id="bccField" type="text" name="_frm[bcc]" class="inp_text suggest" tabindex="3"{optional item::bcc} value="{htmlspecialchars item::bcc}"{/optional}/>
						</div>
					</td>
				</tr>
				<tr>
					<th id="subject_th">{lang::mail_compose::subject}</th>
					<td>
						<div class="inp_text">
							<input id="subjectField" type="text" name="_frm[subject]" class="inp_text" tabindex="4" value="{optional item::prefix}{htmlspecialchars item::prefix}{/optional}{optional item::subject}{htmlspecialchars item::subject}{/optional}"/>
						</div>
					</td>
				</tr>
				<tr>
					<th id="attachments_th">
						{lang::mail_compose::attachments}
					</th>
					<td>
						<div id="attachments">
							<input type="file" name="_frm[attachment][]" size="45" id="attachments_first"/><input type="button" class="inp_btn noJSHide" onclick="addFileField()" value="+" id="addFileField2" /><input type="button" class="inp_btn noJSHide" onclick="removeMainFileField()" value="-"/>
							<!--
							<input type="hidden" name="_frm[attachment_s][admin@demo.com/Files/40e2885d3002][class]" value="item" />
							<input type="hidden" name="_frm[attachment_s][admin@demo.com/Files/40e2885d3002][fullpath]" value="admin@demo.com/Files/40e2885d3002" checked="checked"/>
							
							<span>
								<input type="checkbox" name="_frm[attachment_s][admin@demo.com/Files/40e2885d3002][process]" checked="checked"/>
								<span class="left attachmentLink ico_jpg" title="7.jpg">7.jpg</a>
							</span>
							-->
						</div>
					</td>
				</tr>
				<tr>
					<th></th>
					<td>
						{optional settings::groupware::enabled}
							{!optional settings::restrictions::disable_gw_types::F}
								<input type="submit" value="{lang::mail_compose::add_files_from_folder}" name="_a[add_item]" class="inp_btn" />
							{/optional}
						{/optional}
						{!optional settings::restrictions::disable_dropbox}
						<input type="button" value="{lang::mail_compose::add_files_from_dropbox}" class="inp_btn noJSHide" id="dropboxAddFiles"/>
						{/optional}
					</td>
				</tr>
				<tr>
					<th></th>
					<td id="attachmentsBox" colspan="2">
						{optional item::attachments}
							{dynamic item::attachments}
								<input type="hidden" name="_frm[attachment_s][{.*::fullpath}][class]" value="{.*::class}" />
								<input type="hidden" name="_frm[attachment_s][{.*::fullpath}][fullpath]" value="{.*::fullpath}" checked="checked"/>
	
								<span>
									<input type="checkbox" name="_frm[attachment_s][{.*::fullpath}][process]" checked="checked"/>
									<span class="left attachmentLink ico_{.*::extension}" title="{htmlspecialchars *::name}">{htmlspecialchars *::name}</span>
								</span>
							{/dynamic}
						{/optional}
					</td>
				</tr>
				{!optional disable_smart}
				<tr>
					<th>{lang::mail_compose::psa}</th>
					<td><input type="checkbox" name="_frm[options][smartAttach]" value="1" id="smartAttachCheckbox"{optional item::options::smartAttach} checked="checked"{/optional}/></td>
				</tr>
				{/optional}
			</table>
			<div class="fieldBox" id="taBox">
				{anchor::mainTextarea}
			</div>
		</div>
</div>
<input type="hidden" value="{htmlspecialchars uid}" id="uid"/>
{include ../basic/skin/fresh/tpl/_toolbar.bottom_mail.compose.tpl}
