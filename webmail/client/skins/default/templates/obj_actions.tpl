<table class="frmtbl frmtbl100">
	<tr>
		<th class="th"><obj name="check_accept_delete" type="obj_checkbox"><title>FILTERS::MESSAGE</title></obj></th>
		<td>
			<obj name="accept_delete" type="obj_select">
				<value>REJECT</value>
				<fill>
					<item key="ACCEPT">{FILTERS::ACCEPT}</item>
					<item key="REJECT">{FILTERS::REJECT}</item>
					<item key="DELETE">{FILTERS::DELETE}</item>
					<item key="MARKSPAM">{FILTERS::SPAM}</item>
					<item key="QUARANTINE">{FILTERS::QUARANTINE}</item>
				</fill>
			</obj>
		</td>
	</tr>
	<tr>
		<th class="th" colspan="2"><obj name="check_stop_processing" type="obj_checkbox"><title>FILTERS::STOP_PROCESSING</title></obj></th>
	</tr>
	<tr {optional disable_fw}style="display: none"{/optional}>
		<th class="th" valign="top"><obj name="check_forward_to" type="obj_checkbox"><title>FILTERS::FORWARD_TO</title></obj></th>
		<td class="td">
			{noptional disable_ab}<div class="relative">{/noptional}<obj name="forward_to" type="obj_mail_suggest" css="border"></obj>{noptional disable_ab}<obj type="obj_button" name="btn_forward" css="ico img simple add transparent"><title>ADDRESS_BOOK::ADD_RECIPIENT</title></obj><obj name="check_forward_as_attachment" type="obj_checkbox"><title>FILTERS::FORWARD_AS_ATTACHMENT</title></obj></div>{/noptional}
		</td>
	</tr>
	<tr>
		<th class="th"><obj name="check_move_to" type="obj_checkbox"><title>FILTERS::MOVE_TO</title></obj></th>
		<td>
			<obj name="move_to" type="obj_selectfolder">
				<init>
					<item>1</item>
					<item>M</item>
				</init>
			</obj>
		</td>
	</tr>
	<tr>
		<th class="th"><obj name="check_copy_to" type="obj_checkbox"><title>FILTERS::COPY_TO</title></obj></th>
		<td>
			<obj name="copy_to" type="obj_selectfolder">
				<init>
					<item>1</item>
					<item>M</item>
				</init>
			</obj>
		</td>
	</tr>
	<tr>
		<th class="th" colspan="2"><obj name="check_encrypt" type="obj_checkbox"><title>FILTERS::ENCRYPT_MESSAGE</title></obj></th>
	</tr>
	<tr>
		<th class="th"><obj name="check_send_message" type="obj_checkbox"><title>FILTERS::SEND_MESSAGE</title></obj></th>
		<td>
			<obj name="send_message" type="obj_send_message"></obj>
		</td>
	</tr>
	<tr>
		<th class="th"><obj name="check_edit_header" type="obj_checkbox"><title>FILTERS::EDIT_HEADER</title></obj></th>
		<td>
			<obj name="edit_header" type="obj_edit_header"></obj>
		</td>
	</tr>
	<tr>
		<th class="th"><obj name="check_message_priority" type="obj_checkbox"><title>FILTERS::SET_MESSAGE_PRIORITY</title></obj></th>
		<td>
			<obj name="message_priority" type="obj_select">
				<value>3</value>
				<fill>
					<item key="1">{FILTERS::HIGHEST}</item>
					<item key="2">{FILTERS::HIGH}</item>
					<item key="3">{FILTERS::NORMAL}</item>
					<item key="4">{FILTERS::LOW}</item>
					<item key="5">{FILTERS::LOWEST}</item>
				</fill>
			</obj>
		</td>
	</tr>

	<tr>
		<th valign="top" class="th"><obj name="check_message_flags" type="obj_checkbox"><title>FILTERS::SET_MESSAGE_FLAG</title></obj></th>
		<td>
			<table class="frmtbl">
				<tr>
					<td valign="top"><obj name="message_flag1" type="obj_checkbox_list" ></obj></td>
					<td valign="top"><obj name="message_flag2" type="obj_checkbox_list" ></obj></td>
					<td valign="top"><obj name="message_flag3" type="obj_checkbox_list" ></obj></td>
				</tr>
				<tr>
					<td valign="top" colspan="3">
						<div>{FILTERS::CUSTOM_FLAGS}</div>
						<obj name="message_flag_custom" type="obj_input" ></obj>
					</td>
				</tr>
			</table>
		</td>
	</tr>
</table>
