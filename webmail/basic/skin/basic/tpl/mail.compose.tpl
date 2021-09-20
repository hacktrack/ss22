<form method="post" enctype="multipart/form-data" ddattacher="addFileField2">
	<input type="hidden" id="lang_leave_notice" value="{lang::mail_compose::leave_notice}"/>
	<input type="hidden" name="_frm[html]" id="html" />
	<div class="cover-b wsto">
		<div id="cover_a">
			<div id="cover_b">

<input type="hidden" id="lang-mail_compose-block_type" value="{lang::mail_compose::block_type}"/>
<input type="hidden" id="lang-mail_compose-heading" value="{lang::mail_compose::heading}"/>
<input type="hidden" id="lang-mail_compose-paragraph" value="{lang::mail_compose::paragraph}"/>
<input type="hidden" id="lang-mail_compose-font" value="{lang::mail_compose::font}"/>
<input type="hidden" id="lang-mail_compose-size" value="{lang::mail_compose::size}"/>

<input type="hidden" id="lang-mail_compose-blockformat" value="{lang::mail_compose::blockformat}"/>
<input type="hidden" id="lang-mail_compose-left" value="{lang::mail_compose::left}"/>
<input type="hidden" id="lang-mail_compose-center" value="{lang::mail_compose::center}"/>
<input type="hidden" id="lang-mail_compose-right" value="{lang::mail_compose::right}"/>
<input type="hidden" id="lang-mail_compose-justify" value="{lang::mail_compose::justify}"/>
<input type="hidden" id="lang-mail_compose-unorderedlist" value="{lang::mail_compose::unorderedlist}"/>
<input type="hidden" id="lang-mail_compose-orderedlist" value="{lang::mail_compose::orderedlist}"/>
<input type="hidden" id="lang-mail_compose-indent" value="{lang::mail_compose::indent}"/>
<input type="hidden" id="lang-mail_compose-outdent" value="{lang::mail_compose::outdent}"/>
<input type="hidden" id="lang-mail_compose-fontformat" value="{lang::mail_compose::fontformat}"/>
<input type="hidden" id="lang-mail_compose-fontsize" value="{lang::mail_compose::fontsize}"/>
<input type="hidden" id="lang-mail_compose-bold" value="{lang::mail_compose::bold}"/>
<input type="hidden" id="lang-mail_compose-italic" value="{lang::mail_compose::italic}"/>
<input type="hidden" id="lang-mail_compose-underline" value="{lang::mail_compose::underline}"/>
<input type="hidden" id="lang-mail_compose-hyperlink" value="{lang::mail_compose::hyperlink}"/>
<input type="hidden" id="lang-mail_compose-image" value="{lang::mail_compose::image}"/>
<input type="hidden" id="lang-mail_compose-htmlsource" value="{lang::mail_compose::htmlsource}"/>
<input type="hidden" id="lang-mail_compose-image" value="{lang::mail_compose::image}"/>

<input type="hidden" id="lang-mail_compose-image_location" value="{lang::mail_compose::image_location}"/>
<input type="hidden" id="lang-mail_compose-image_alt" value="{lang::mail_compose::image_alt}"/>

<input type="hidden" id="settings-font_family" value="{font_family}"/>
<input type="hidden" id="settings-font_size" value="{font_size}"/>
<input type="hidden" id="settings-text_direction" value="{text_direction 'ltr'}"/>

{dynamic fonts}
<input type="hidden" class="fonts" value="{.*::name}|{.*::family}"/>
{/dynamic}
				<div class="commandLine">
					<div class="fieldBox">
						<div class="right noJSHide">
							<select{optional item::force::type} disabled="disabled"{/optional} id="selectType" name="_frm[options][type]" size="1">
								<option value="plain" {optional item::type 'text'}selected="selected"{/optional}>{lang::mail_compose::plain}
								</option>
								<option value="html" {optional item::type 'html'}selected="selected"{/optional}>{lang::mail_compose::html}
								</option>
							</select>
							{optional item::force::type}
							<input type="hidden" name="_frm[options][type]" value="{item::type}"/>
							{/optional}
							
						</div>
						{include ../basic/skin/default/tpl/grid/_mail_compose.tpl}
					</div>
				</div>
				<div id="sizerWatcher" class="wsto">
					<div class="wsto spacer" id="mcSpacerInner">
						<input type="hidden" name="_frm[draftid]" {optional item::draftid} value="{item::draftid}"{/optional}/>
						<input type="hidden" name="_frm[draftfolder]" {optional item::draftfolder} value="{item::draftfolder}"{/optional}/>
						<input type="hidden" name="_frm[draftaccount]" {optional item::draftaccount} value="{item::draftaccount}"{/optional}/>
						<input type="hidden" name="_frm[mail_action]" {optional item::mail_action} value="{item::mail_action}"{/optional}/>
						<input type="hidden" name="_dlg[contact_select][actions]" value="contacts_to|contacts_cc|contacts_bcc" />
						<input type="hidden" name="_dlg[contact_select][referer]" value="mail.compose" />
						<input type="hidden" name="_dlg[contact_select][target]" value="content" />
						<input type="hidden" name="_dlg[contact_select][controller]" value="message" />
						<input type="hidden" name="_dlg[contact_select][parameters][all][_s][id]" value="{settings::default_folders::contacts}" />
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


						<div class="into-bottom-line-right cleaner">
							<div class="text-normal">					{lang::mail_compose::priority}
								<select{optional item::force::priority} disabled="disabled"{/optional} name="_frm[options][priority]" size="1"  tabindex="12">
									<option value="highest"{optional item::options::priority '1'} selected="selected"{/optional}>{lang::mail_compose::highest}
									</option>
									<option value="high"{optional item::options::priority '2'} selected="selected"{/optional}>{lang::mail_compose::high}
									</option>
									<option value="normal"{optional item::options::priority '3'} selected="selected"{/optional}>{lang::mail_compose::normal}
									</option>
									<option value="low"{optional item::options::priority '4'} selected="selected"{/optional}>{lang::mail_compose::low}
									</option>
									<option value="lowest"{optional item::options::priority '5'} selected="selected"{/optional}>{lang::mail_compose::lowest}
									</option>
								</select>
								{optional item::force::priority}
								<input type="hidden" name="_frm[options][priority]" value="{item::options::priority_val}"/>
								{/optional}
								
								<input{optional item::force::request_read_confirmation} disabled="disabled"{/optional} type="checkbox"{optional item::options::request_read_confirmation} checked="checked"{/optional} name="_frm[options][request_read_confirmation]" tabindex="13"/>{optional item::force::request_read_confirmation}<input type="hidden" name="_frm[options][request_read_confirmation]" value="{optional item::options::request_read_confirmation}1{/optional}{!optional item::options::request_read_confirmation}0{/optional}"/>{/optional}
								{lang::mail_compose::rrc}
								
								<input{optional item::force::save_sent_message} disabled="disabled"{/optional} type="checkbox"{optional item::options::save_sent_message} checked="checked"{/optional} name="_frm[options][save_sent_message]" tabindex="14"/>{optional item::force::save_sent_message}<input type="hidden" name="_frm[options][save_sent_message]" value="{optional item::options::save_sent_message}1{/optional}{!optional item::options::save_sent_message}0{/optional}"/>{/optional}
								{lang::mail_compose::ssm}

							</div>
						</div>

						<div class="into-bottom-line">
							<div class="text-normal">
								{include ../basic/skin/default/tpl/grid/_mail_compose.tpl}
							</div>
						</div>

						<div id="email">
							<table id="infoTable" cellpadding="0" cellspacing="0">
							{optional item::personalities}
							{!optional settings::restrictions::disable_personalities}
								<tr>
									<th>{lang::mail_compose::alias}</th>
									<td>
										<select name="_frm[options][alias]" size="1">
											<option value="">---</option>
											{dynamic item::personalities}
												<option{optional *::selected} selected="selected"{/optional} value="{.*::person}">{.*::person}</option>
											{/dynamic}
										</select>
									</td>
								</tr>
							{/optional}
							{/optional}
								<tr>
									<th>
									{optional settings::groupware::enabled}
										{!optional settings::restrictions::disable_gw_types::C}
											<input id="tobut" type="submit" class="wsto submitField mb2" name="_a[contacts_to]" value="{lang::mail_compose::to}" />
											<span class="sizeHolder">&nbsp;{lang::mail_compose::to}</span>
										{/optional}
										{optional settings::restrictions::disable_gw_types::C}{lang::mail_compose::to}{/optional}
									{/optional}
									{!optional settings::groupware::enabled}
										{lang::mail_compose::to}
									{/optional}
									
									</th>
									<td class="wsto">
										<div style="position:relative; width:100%; overflow:auto; height: 21px;">
											<input style="position:absolute; top:0; left:0;" id="toField" type="text" name="_frm[to]" class="field mb2" tabindex="1"{optional item::to} value="{htmlspecialchars item::to}"{/optional}{optional request::all::to} value="{htmlspecialchars request::all::to}"{/optional}/>
										</div>
									</td>
								</tr>
								<tr>
									<th>
									{optional settings::groupware::enabled}
										{!optional settings::restrictions::disable_gw_types::C}
											<input id="ccbut" class="wsto submitField mb2" type="submit" name="_a[contacts_cc]" value="{lang::mail_compose::cc}" />
											<span class="sizeHolder">&nbsp;{lang::mail_compose::cc}</span>
										{/optional}
										{optional settings::restrictions::disable_gw_types::C}{lang::mail_compose::cc}{/optional}
									{/optional}
									{!optional settings::groupware::enabled}
										{lang::mail_compose::cc}
									{/optional}
									</th>
									<td>
										<div style="position:relative; width:100%; overflow:auto; height: 21px;">
											<input style="position:absolute; top:0; left:0;" id="ccField" type="text" name="_frm[cc]" class="field mb2" tabindex="2"{optional item::cc} value="{htmlspecialchars item::cc}"{/optional}/>
										</div>
									</td>
								</tr>
								<tr>
									<th>
									
									{optional settings::groupware::enabled}
										{!optional settings::restrictions::disable_gw_types::C}
										<input id="bccbut" class="wsto submitField mb2" type="submit" name="_a[contacts_bcc]" value="{lang::mail_compose::bcc}" />
										<span class="sizeHolder">&nbsp;{lang::mail_compose::bcc}</span>
										{/optional}
										{optional settings::restrictions::disable_gw_types::C}{lang::mail_compose::bcc}{/optional}
									{/optional}
									{!optional settings::groupware::enabled}
										{lang::mail_compose::bcc}
									{/optional}
									
									</th>
									<td>
										<div style="position:relative; width:100%; overflow:auto; height: 21px;">
											<input style="position:absolute; top:0; left:0;" id="ccField" type="text" name="_frm[bcc]" class="field mb2" tabindex="3"{optional item::bcc} value="{htmlspecialchars item::bcc}"{/optional}/>
										</div>
									</td>
								</tr>
								<tr>
									<th id="subject_th">{lang::mail_compose::subject}</th>
									<td>
										<input id="subjectField" type="text" name="_frm[subject]" class="field" tabindex="4" value="{optional item::prefix}{htmlspecialchars item::prefix}{/optional}{optional item::subject}{htmlspecialchars item::subject}{/optional}"/>
									</td>
								</tr>
								<tr>
									<th id="attachments_th"><div style="white-space:nowrap">{lang::mail_compose::attachments}</div></th>
									<td>
										<div class="fieldHolder" id="attachments">
											<div>
												<input type="file" name="_frm[attachment][]" size="45" id="attachments_first"/><input type="button" class="bfield submitField noJSHide" onclick="addFileField()" value="+" id="addFileField2" />
											</div>
										</div>
										{optional item::attachments}
										<div id="attachmentsBox">
											{dynamic item::attachments}
											<div>
												<div class="attachmentDel left">
													<input type="hidden" name="_frm[attachment_s][{.*::fullpath}][class]" value="{.*::class}" />
													<input type="hidden" name="_frm[attachment_s][{.*::fullpath}][fullpath]" value="{.*::fullpath}" checked="checked"/>
													<input type="checkbox" name="_frm[attachment_s][{.*::fullpath}][process]" checked="checked"/>
												</div>
												<a class="left attachmentLink" href="{.*::link}" title="{htmlspecialchars *::name}">{htmlspecialchars *::name}</a>
												<div class="cleaner">
												</div>
											</div>
											{/dynamic}
										</div>
										{/optional}
									</td>
								</tr>
							</table>
							<div class="fieldBox" id="taBox">
								<textarea id="itemHTML" class="hidden">{item::html ''}</textarea>
								<textarea class="wysiwygEditor" name="_frm[html]" tabindex="5" id="mainTextarea" dir="{text_direction 'ltr'}">{item::text ''}</textarea>
								<!--
								<textarea class="wysiwygEditor" name="_frm[html]" tabindex="5" id="mainTextarea">{optional jscheck}{optional item::html}{htmlspecialchars item::html}{/optional}{/optional}{!optional jscheck}{optional item::text}{item::text}{/optional}{/optional}</textarea>
								-->
							</div>
						</div>

					</div>



				</div>
			</div>
		</div>
	</div>
</form>
