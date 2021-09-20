<div class="maxbox">
	<obj name="maintab" type="obj_tabs" css="noborder">
		<obj name="mail_settings" type="obj_tab" ondemand="true">
			<value>SETTINGS::MAIL_SETTINGS</value>
			<draw form="frm_mail_settings_admin">
				<init>
					<item key="domainadmin">true</item>
				</init>
			</draw>
		</obj>
{optional im_access}
		<obj name="im_settings" type="obj_tab" ondemand="true">
			<value>SETTINGS::CHAT_SETTINGS</value>
			<draw form="frm_im_settings"></draw>
		</obj>
{/optional}
		<obj name="general_settings" type="obj_tab" ondemand="true">
			<value>SETTINGS::GENERAL_SETTINGS</value>
			<draw form="frm_general_settings">
				<init>
					<item key="domainadmin">true</item>
				</init>
			</draw>
		</obj>
		<obj name="calendar_settings" type="obj_tab" ondemand="true">
			<value>SETTINGS::CALENDAR_SETTINGS</value>
			<draw form="frm_calendar_settings">
				<init>
					<item key="domainadmin">true</item>
				</init>
			</draw>
		</obj>
	</obj>
</div>