<div class="tabform collaboration" id="{anchor content}">
	<div>
		<h2>
			{COLLABORATION::REALTIME_COLLABORATION}
			<obj type="obj_button" name="reset_link" css="color1 transparent reset_link"><value>COLLABORATION::RESET_LINK</value></obj>
		</h2>
		<div class="wrapper collaborate" id="{anchor collaborate}">
			<div class="title">{COLLABORATION::SHARE_WITH_OTHERS}</div>
			<div class="subtitle">{COLLABORATION::SHARE_WITH_OTHERS2}</div>
			<obj type="obj_checkbox" name="enabled" css="switch right"></obj>
		</div>
		<div class="wrapper editing hidden" id="{anchor editing}">
			<div class="title">{COLLABORATION::ALLOW_EDITTING}</div>
			<div class="subtitle">{COLLABORATION::ALLOW_EDITTING2}</div>
			<obj type="obj_checkbox" name="allowed_editing" css="switch right"></obj>
		</div>
		<div class="wrapper password" id="{anchor password}">
			<div>
				<div class="title">{COLLABORATION::PASSWORD_PROTECTION}</div>
				<div class="subtitle">{COLLABORATION::PASSWORD_PROTECTION2}</div>
				<obj type="obj_checkbox" name="password_protected" css="switch right"></obj>
			</div>
			<div class="input joined hidden" id="{anchor password_container}">
				<div><obj type="obj_password" name="password" placeholder="{COLLABORATION::PASSWORD_PLACEHOLDER}"></obj></div>
				<div><obj type="obj_button" name="save_password" css="color1 hidden"><value>FORM_BUTTONS::SAVE</value></obj></div>
			</div>
			<div class="confirm hidden" id="{anchor password_protected}">{COLLABORATION::PASSWORD_PROTECTED}</div>
		</div>
	</div>
	<div class="no-border" id="{anchor share}">
		<h2>{COLLABORATION::SHARING_ACTIONS}</h2>
		<div class="wrapper email noborder" id="{anchor email}">
			<div>
				<div class="title" id="{anchor email_toggle}">{COLLABORATION::SEND_BY_EMAIL}</div>
			</div>
			<div class="input joined hidden" id="{anchor email_container}">
				<div><div class="to obj_password">
					<obj name="email" type="obj_mail_suggest" tabindex="true" css="noborder"></obj>
					<obj name="address_book" type="obj_button" css="ico img simple transparent useradd"></obj>
				</div></div>
				<div><obj type="obj_button" name="send_email" css="color1"><value>COMPOSE::SEND</value></obj></div>
			</div>
		</div>
		<div class="wrapper link noborder">
			<div class="title" id="{anchor copy_to_clipboard}">{COLLABORATION::SHAREABLE_LINK}</div>
			<div class="confirm hidden" id="{anchor link_copied}">{NOTIFICATION::CLIPBOARD_LINK}</div>
		</div>
		<div class="wrapper teamchat hidden noborder" id="{anchor teamchat}">
			<div>
				<div class="title" id="{anchor teamchat_toggle}">{COLLABORATION::SHARE_TO_TEAMCHAT}</div>
			</div>
			<div class="input joined hidden" id="{anchor teamchat_container}">
				<div><div class="to obj_password">
					<obj name="teamchat" type="obj_room_suggest" tabindex="true" css="noborder"><placeholder>{COMPOSE::TEAMCHAT_ROOM}</placeholder></obj>
					<obj name="lbl_chat" type="obj_button" css="ico img simple transparent useradd"></obj>
				</div></div>
				<div><obj type="obj_button" name="send_teamchat" css="color1"><value>COMMON::SHARE</value></obj></div>
			</div>
		</div>
	</div>
</div>
<div class="tabform collaboration success" id="{anchor success}" class="hidden">
	<div class="back no-border">
		<obj name="back" type="obj_button" css="simple pad ico transparent prev"><value>FORM_BUTTONS::BACK</value></obj>
	</div>
	<div class="no-border">
		<div class="icon"></div>
		<div class="text" id="{anchor text}"></div>
	</div>
</div>
