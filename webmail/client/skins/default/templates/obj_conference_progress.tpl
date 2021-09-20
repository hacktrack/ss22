<div class="progress-header">
	<h1><span class="title" id="{anchor title}"></span> <span class="badge">{CONFERENCE::IN_PROGRESS}</span></h1>
	<h2 id="{anchor password_wrapper}">
		{EVENT::ONLINECONFERENCE_PASSWORD}:
		<obj name="MEETING_PASSWORD" type="obj_password" tabindex="true" css="nopadding password">
			<readonly>true</readonly>
		</obj>
	</h2>
	<h2 id="{anchor date}"></h2>
	<div class="progress-avatar"><span><obj name="avatar" type="obj_avatar" css="size32"></obj></span><span class="progress-organiser" id="{anchor organiser}"></span></div>
</div>
<div class="progress-attendees" id="{anchor attendees}">
	<h2>{CONFERENCE::ATTENDEES}</h2>
	<div class="list" id="{anchor list}"></div>
	<div class="show" id="{anchor show}">{CONFERENCE::SHOW_ATTENDEES}</div>
</div>
<div class="actions">
	<obj name="btn_link" type="obj_button" tabindex="true" css="link simple transparent color1"><value>COLLABORATION::SHAREABLE_LINK</value></obj>
	<obj name="btn_share" type="obj_button" tabindex="true" css="share simple transparent color1"><value>COLLABORATION::SHARE_TO_TEAMCHAT</value></obj>
	<obj name="btn_send" type="obj_button" tabindex="true" css="send simple transparent color1"><value>COLLABORATION::SEND_BY_EMAIL</value></obj>
</div>
