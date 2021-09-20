<table class="frmtbl frmtbl100">
	<tr>
		<th class="th">{SETTINGS::DEFAULT_FLAG}</th>
		<td class="td"><obj name="default_flag" type="obj_select" tabindex="true" css="default_flag"></obj></td>
		{optional domainadmin}<td><obj name="x_default_flag_set" type="obj_allow_settings"></obj></td>{/optional}
	</tr>
	<tr>
		<th class="th">{SETTINGS::FORWARD_MESSAGES}</th>
		<td class="td">
			<obj name="forward_messages" type="obj_select" tabindex="true">
				<value>inline</value>
				<fill>
					<item key="inline">{SETTINGS::INLINE}</item>
					<item key="as_attachment">{SETTINGS::AS_ATTACHMENT}</item>
				</fill>
			</obj>
		</td>
		{optional domainadmin}<td><obj name="x_forward_messages_set" type="obj_allow_settings"></obj></td>{/optional}
	</tr>
</table>

<table class="frmtbl frmtbl100">
	<tr>
		<td colspan="2"><obj name="sound_notify" type="obj_checkbox" tabindex="true"><title>SETTINGS::SOUND_NOTIFY</title></obj></td>
		{optional domainadmin}<td><obj name="x_sound_notify_set" type="obj_allow_settings"></obj></td>{/optional}
	</tr>
	<tr>
		<th class="th"><obj name="autoupdate" type="obj_checkbox" tabindex="true"><title>SETTINGS::AUTOUPDATE_MESSAGE</title></obj></th>
<td class="td"><obj name="autoupdate_minutes" type="obj_input_number" css="obj_input_small" tabindex="true"><restrictions>&gt;-1i</restrictions></obj></td>
		{optional domainadmin}<td><obj name="x_autoupdate_set" type="obj_allow_settings" tabindex="true"></obj></td>{/optional}
	</tr>
	<tr>
		<th class="th"><obj name="autosave" type="obj_checkbox" tabindex="true"><title>SETTINGS::AUTOSAVE_MESSAGE</title></obj></th>
		<td class="td"><obj name="autosave_minutes" type="obj_input_number" css="obj_input_small" tabindex="true"><restrictions>&gt;-1i</restrictions></obj></td>
		{optional domainadmin}<td><obj name="x_autosave_set" type="obj_allow_settings"></obj></td>{/optional}
	</tr>
	<tr>
		<th class="th"><obj name="autoclear_trash" type="obj_checkbox" tabindex="true"><title>SETTINGS::CLEAR_TRASH</title></obj></th>
		<td class="td"><obj name="autoclear_trash_days" type="obj_input_number" css="obj_input_small" tabindex="true"><restrictions>&gt;-1i</restrictions></obj></td>
		{optional domainadmin}<td><obj name="x_autoclear_trash_set" type="obj_allow_settings"></obj></td>{/optional}
	</tr>
	{optional settings domain_settings}
	<tr>
		<th class="th"><obj name="autoclear_spam" type="obj_checkbox" tabindex="true"><title>SETTINGS::CLEAR_SPAM</title></obj></th>
		<td class="td"><obj name="autoclear_spam_days" type="obj_input_number" css="obj_input_small" tabindex="true"><restrictions>&gt;-1i</restrictions></obj></td>
		{optional domainadmin}<td></td>{/optional}
	</tr>
	{/optional}
	<tr>
		<td colspan="2"><obj name="move_to_trash" type="obj_checkbox" tabindex="true"><title>SETTINGS::MOVE_TO_TRASH</title></obj></td>
		{optional domainadmin}<td><obj name="x_move_to_trash_set" type="obj_allow_settings"></obj></td>{/optional}
	</tr>
	<tr>
		<td colspan="2"><obj name="delete_emptyfolder" type="obj_checkbox" tabindex="true"><title>SETTINGS::DELETE_EMPTYFOLDER</title></obj></td>
		{optional domainadmin}<td><obj name="x_delete_emptyfolder_set" type="obj_allow_settings"></obj></td>{/optional}
	</tr>
{optional gw_access}
	<tr>
		<td colspan="2"><obj name="auto_recipient_to_addressbook" type="obj_checkbox" tabindex="true"><title>SETTINGS::AUTO_ADD_RECIPIENT_TO_ADDRESSBOOK</title></obj></td>
		{optional domainadmin}<td><obj name="x_auto_recipient_to_addressbook_set" type="obj_allow_settings"></obj></td>{/optional}
	</tr>
{/optional}

	<tr>
		<td colspan="2"><obj name="show_inline_images" type="obj_checkbox" tabindex="true"><title>SETTINGS::SHOW_IMAGES</title></obj></td>
		{optional domainadmin}<td><obj name="x_show_inline_images_set" type="obj_allow_settings"></obj></td>{/optional}
	</tr>
		<tr>
			<td colspan="2" class="tabsmall"><obj name="show_images" type="obj_checkbox" tabindex="true"><title>SETTINGS::SHOW_IMAGES_SPAM</title><disabled>1</disabled></obj></td>
			{optional domainadmin}<td><obj name="x_show_images_set" type="obj_allow_settings"></obj></td>{/optional}
		</tr>

	<tr>
		<td colspan="2"><obj name="auto_show_images" type="obj_checkbox" tabindex="true"><title>SETTINGS::AUTO_SHOW_IMAGES</title></obj></td>
		{optional domainadmin}<td><obj name="x_auto_show_images_set" type="obj_allow_settings"></obj></td>{/optional}
	</tr>
	<tr>
		<td colspan="2"><obj name="classic_prefix" type="obj_checkbox_inverse" tabindex="true"><value>0</value><title>SETTINGS::COUNT_SUBJECT</title></obj></td>
		{optional domainadmin}<td><obj name="x_classic_prefix_set" type="obj_allow_settings"></obj></td>{/optional}
	</tr>
	<tr>
		<td colspan="2"><obj name="search_primary" type="obj_checkbox" tabindex="true"><value>0</value><title>SETTINGS::SEARCH_PRIMARY</title></obj></td>
		{optional domainadmin}<td><obj name="x_search_primary_set" type="obj_allow_settings"></obj></td>{/optional}
	</tr>

{optional domainadmin}
	<tr>
		<td colspan="2"><obj name="smtp_relay" type="obj_checkbox" tabindex="true"><title>SETTINGS::SMTP_RELAY</title></obj></td>
		<td><obj name="x_smtp_relay_set" type="obj_allow_settings"><init>1</init></obj></td>
	</tr>

	<tr>
		<td colspan="2"><obj name="group_contacts_by_email" type="obj_checkbox" tabindex="true"><value>0</value><title>SETTINGS::GROUP_CONTACTS_BY_EMAIL</title></obj></td>
		{optional domainadmin}<td><obj name="x_group_contacts_by_email_set" type="obj_allow_settings"></obj></td>{/optional}
	</tr>

{/optional}
</table>
