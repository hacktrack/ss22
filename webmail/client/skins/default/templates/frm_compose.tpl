<div class="maxbox">
	<table class="frmtbl frmtblmax nospace">
		<tr>
			<td>
				{noptional disable_pe}
				<div class="box lpad compose from {optional hide_pe} extended{/optional}">
					<table class="frmtbl100 from">
						<tr class="sms_hide">
							<td class="nopad">
								<table>
									<tr>
										<th class="th vat label">{DATAGRID_ITEMS_VIEW::FROM}:</th>
										<td class="td vat from_select">
											<obj name="from" type="obj_select" css="max noborder"></obj>
										</td>
									</tr>
								</table>
							</td>
						</tr>
					</table>
				</div>
				{/noptional}

				<div class="box">
					<table class="frmtbl100">
						<tr class="bt">
							<th class="vat"><div class="switch" id="{anchor switch}" title="{COMPOSE::SHOW_ALL}"></div></th>

							{optional sms}
							<th class="th vat label"><obj name="lbl_sms" type="obj_label" css="lbl_header{noptional disable_ab} ab{/noptional}"><value>{COMPOSE::SMS}:</value></obj></th>
							<td class="td vat"><obj name="sms" type="obj_phone_suggest" css="noborder" tabindex="true"></obj></td>
							{/optional}

							{noptional sms}
							<th class="th vat label"><obj name="lbl_to" type="obj_label" css="lbl_header{noptional disable_ab} ab{/noptional}"><value>{DATAGRID_ITEMS_VIEW::TO}:</value></obj></th>
							<td class="td vat"><obj name="to" type="obj_mail_suggest" tabindex="true" css="noborder"></obj></td>

							{optional ext_ab}<td class="vat"><obj type="obj_button" name="btn_to_ext" css="ico img simple add_ext transparent"><title>ADDRESS_BOOK::ADD_RECIPIENT</title></obj></td>{/optional}
							{/noptional}
						</tr>
					</table>
				</div>

				<div class="box lpad compose{optional hide_cc} extended{/optional} cc">
					<table class="frmtbl100">
						<tr>
							<th class="th vat label"><obj name="lbl_cc" type="obj_label" css="lbl_header{noptional disable_ab} ab{/noptional}"><value>{DATAGRID_ITEMS_VIEW::CC}:</value></obj></th>
							<td class="td vat"><obj name="cc" type="obj_mail_suggest" css="obj_input_100 noborder" tabindex="true"></obj></td>

							{optional ext_ab}<td class="vat"><obj type="obj_button" name="btn_cc_ext" css="ico img simple add_ext transparent"><title>ADDRESS_BOOK::ADD_RECIPIENT</title></obj></td>{/optional}
						</tr>
					</table>
				</div>

				<div class="box lpad compose{optional hide_bcc} extended{/optional} bcc">
					<table class="frmtbl100">
						<tr>
							<th class="th vat label"><obj name="lbl_bcc" type="obj_label" css="lbl_header{noptional disable_ab} ab{/noptional}"><value>{DATAGRID_ITEMS_VIEW::BCC}:</value></obj></th>
							<td class="td vat"><obj name="bcc" type="obj_mail_suggest" css="obj_input_100 noborder" tabindex="true"></obj></td>

							{optional ext_ab}<td class="vat"><obj type="obj_button" name="btn_bcc_ext" css="ico img simple add_ext transparent"><title>ADDRESS_BOOK::ADD_RECIPIENT</title></obj></td>{/optional}
						</tr>
					</table>
				</div>

				{noptional disable_chat}{noptional sms}
				<div class="box lpad ico_teamchat chat compose extended">
					<table class="frmtbl100 border">
						<tr>
							<th class="th vat label"><obj name="lbl_chat" type="obj_label" css="lbl_header"><value>{CHAT::BCC}:</value></obj></th>
							<td class="td vat">
								<obj name="teamchat" type="obj_room_suggest" tabindex="true" css="noborder"><placeholder>{COMPOSE::TEAMCHAT_ROOM}</placeholder></obj>
							</td>
							<td>
								<div class="toggle teamchat message nodot" data-toggle="chat_message"></div>
							</td>
						</tr>
					</table>
				</div>

				<div class="box lpad rpad extended chat_message">
					<table class="frmtbl100">
						<tr>
							<td class="td vat tmcht_msg">
								<obj name="teamchat_message" type="obj_text_mentions" tabindex="true" css="comment"><placeholder>{COMPOSE::TEAMCHAT_COMMENT}</placeholder><disabled>1</disabled></obj>
							</td>
						</tr>
					</table>
				</div>
				{/noptional}{/noptional}

				<div class="box lpad rpad subject compose{optional sms} extended{/optional}">
					<table class="frmtbl100 border">
						<tr>
							<th class="th vat label">{DATAGRID_ITEMS_VIEW::SUBJECT}:</th>
							<td class="td vat"{optional ext_ab} colspan="2"{/optional}><obj name="subject" type="obj_input" css="obj_input_100 noborder" {noptional sms}tabindex="true"{/noptional}></obj></td>
						</tr>
					</table>
				</div>

			</td>
		</tr>
		<tr height="100%">
			<td class="msiebox" id="{anchor msiebox}">
				<div class="msiebox">{optional sms}<obj name="body" type="obj_text" tabindex="true" css="obj_textsms obj_text100"></obj>{/optional}{noptional sms}<obj name="body" type="obj_wysiwyg" tabindex="true"></obj>{/noptional}
				<div class="progressbar" id="{anchor progress}"></div>
			</div></td>
		</tr>
	</table>

<div class="mask" id="{anchor mask}"></div>
<div class="options" id="{anchor options}"></div>
<div class="options delay" id="{anchor delay}"></div>

{optional sms}
<div class="sms"><obj name="smsinfo" type="obj_label"></obj></div>
{/optional}

{noptional sms}
<!-- Attachment -->
<table class="frmtbl nospace frmtbl100 att_table">
	<tbody>
		<tr>
			{optional maxsize}<td class="maxsize"><obj name="maxsize" type="obj_progress" css="noborder"></obj></td>{/optional}
			<td class="td col1"><obj name="attach" type="obj_upload_list"></obj></td>
			<td class="col2" id="{anchor smart}"></td>
		</tr>
	</tbody>
</table>
{/noptional}
</div>
