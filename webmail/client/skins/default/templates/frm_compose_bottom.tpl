<table class="frmtbl frmtbl100 nospace">
	<tr>
		{noptional template}<th><obj name="x_btn_send" type="obj_button_menu" css="simple color1 pad"><value>COMPOSE::SEND</value><title>COMPOSE::SENDINFO</title></obj></th>{/noptional}
		{optional template}<th><obj name="x_btn_save" type="obj_button" css="simple color1 pad"><value>COMPOSE::SAVE</value><title>COMPOSE::SAVEINFO</title></obj></th>{/optional}
		{noptional sms}<th>
			<obj name="x_btn_att" type="{optional att_menu}obj_button_menu{/optional}{noptional att_menu}obj_button{/noptional}" css="simple pad ico ico_att"><value>COMPOSE::ATTACH_FILES</value></obj>
		</th>{/noptional}

		<td class="td upblock">{noptional sms}<obj name="attach_control" type="obj_upload_mail"></obj>{/noptional}</td>

		{noptional sms}{noptional template}
		<th><obj name="x_btn_confirm" type="obj_button" css="noborder transparent simple ico img confirm"><title>SETTINGS::REQUEST_READ_CONFIRMATION</title></obj></th>
		<th><obj name="x_btn_delivery" type="obj_button" css="noborder transparent simple ico img delivery"><title>COMPOSE::DELIVERY_REPORT</title></obj></th>
		{noptional disable_encryption_rule}
		<th><obj name="x_btn_encrypt" type="obj_button" css="noborder transparent simple ico img encrypt">{optional disable_encryption}<disabled>1</disabled>{/optional}<title>COMPOSE::ENCRYPT</title></obj></th>
		{/noptional}
		{noptional disable_signing_rule}
		<th><obj name="x_btn_sign" type="obj_button" css="noborder transparent simple ico img sign">{optional disable_signing}<disabled>1</disabled>{/optional}<title>COMPOSE::SIGN</title></obj></th>
		{/noptional}

		{noptional disable_smart}
		<th><obj name="x_btn_smart" type="obj_button" css="noborder transparent simple ico img smart"><title>SETTINGS::SMART_ATTACH</title></obj></th>
		{/noptional}

		<th><obj name="x_btn_options" type="obj_button" css="noborder transparent simple ico img settings"><title>COMPOSE::OPTIONS</title></obj></th>
		{/noptional}{/noptional}
	</tr>
</table>
