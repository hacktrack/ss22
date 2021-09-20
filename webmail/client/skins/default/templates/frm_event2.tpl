<div class="maxbox">
	<div class="header">
		<obj name="EVNTITLE" type="obj_input" tabindex="true" focus="true" css="obj_input_100 noborder title" placeholder="{EVENT::ENTER_TITLE}"></obj>
		<div id="{anchor header_right}" class="header_right"></div>
	</div>
	<div id="{anchor left_column}" class="left_column">
		<div id="{anchor left_content}" class="left_content">
			<div class="block time" id="{anchor block_time}">
				<div class="preview" id="{anchor time_preview}"></div>
				<table class="frmtbl frmtbl100">
					<tr>
						<th>{TIME_INTERVAL::ALL_DAY_EVENT}</th>
						<td>
							<obj name="allDay" tabindex="true" type="obj_checkbox"></obj>
						</td>
					</tr>
					<tr>
						<th>{EVENT::STARTS}</th>
						<td>
							<div class="days">
								<obj name="startDate" type="obj_input_calendar"><init><item></item><item>1</item></init></obj>
							</div>
							<obj name="startTime" type="obj_time" tabindex="true"><value>0</value></obj>
						</td>
					</tr>
					<tr>
						<th>{EVENT::ENDS}</th>
						<td>
							<div class="days">
								<obj name="endDate" type="obj_input_calendar"><init><item></item><item>1</item></init></obj>
							</div>
							<obj name="endTime" type="obj_time" tabindex="true"><value>0</value></obj>
						</td>
					</tr>
					<tr>
						<th>{TIME_INTERVAL::DURATION}</th>
						<td>
							<div class="days">
								<obj name="durationDays" type="obj_input" css="obj_input_small duration_days" tabindex="true"><value>0</value></obj>
								{TIME::DAYS}
							</div>
							<obj name="durationTime" type="obj_time" tabindex="true"><value>0</value><init>1</init></obj>
						</td>
					</tr>
					<tr>
						<th>{EVENT::TIMEZONE}</th>
						<td>
							<obj name="timezone" type="obj_timezones" tabindex="true"></obj>
							<obj name='tzlink' type='obj_label' css='tzlink'></obj>
						</td>
					</tr>
					<tr>
						<th>{EVENT::REPEAT}</th>
						<td>
							<obj name="X_REPEATING" type="obj_select" tabindex="true">
								<fill>
									<item key="0">{REPEATING::NOT_REPEATS}</item>
									<item key="D">{REPEATING::DAILY}</item>
									<item key="W">{REPEATING::WEEKLY}</item>
									<item key="F">{REPEATING::FORTNIGHTLY}</item>
									<item key="M">{REPEATING::MONTHLY}</item>
									<item key="Y">{REPEATING::YEARLY}</item>
									<item key="*">{SETTINGS::CUSTOM}</item>
								</fill>
							</obj>
						</td>
					</tr>
					<tr>
						<th>{REMINDER::REMIND1}</th>
						<td>
							<obj name="X_REMINDERS" type="obj_select" tabindex="true"></obj>
						</td>
					</tr>
					<tr>
						<th>{FOLDERS::EVENTS}</th>
						<td>
							<obj name="X_PATH" type="obj_selectfolder"><init><item>1</item><item>E,I,Y</item><item>i</item><item></item><item>1</item></init></obj>
							{noptional guest}<obj name="x_include_in_my_cal" type="obj_checkbox"><title>EVENT::INCLUDE_IN_MY_CALENDAR</title></obj>{/noptional}
						</td>
					</tr>
					<tr>
						<th>{EVENT::SHOW_AS}</th>
						<td>
							<obj name="X_EVNFLAGS" type="obj_select" tabindex="true">
								<fill>
									<item key="F">{EVENT::FREE}</item>
									<item key="T">{EVENT::TENTATIVE}</item>
									<item key="S">{EVENT::BUSY}</item>
									<item key="O">{EVENT::OUT_OF_OFFICE}</item>
								</fill>
							</obj>
						</td>
					</tr>
					{optional conference}
					<tr class="separator">
						<td colspan="2"><div></div></td>
					</tr>
					<tr class="conference">
						<th>{EVENT::ONLINECONFERENCE}</th>
						<td>
							<obj name="MEETING_ACTION" type="obj_checkbox" tabindex="true" css="conference_action nopadding"><disabled>1</disabled></obj>
						</td>
					</tr>
					<tr id="{anchor meeting_password}" class="conference_password hidden">
						<th>{EVENT::ONLINECONFERENCE_PASSWORD}</th>
						<td>
							<obj name="MEETING_PASSWORD" type="obj_password" tabindex="true" css="nopadding"><placeholder>{EVENT::ONLINECONFERENCE_PASSWORD_PLACEHOLDER}</placeholder></obj>
						</td>
					</tr>
					{/optional}
				</table>
				<div class="collapse" id="{anchor collapse_time}">{COMMON::COLLAPSE}</div>
			</div>

			<div class="block location active">
				<obj name="EVNLOCATION" type="obj_select_input" tabindex="true" placeholder="{EVENT::LOCATION}"></obj>
				<obj name="X_LOCMAP" type="obj_button_map_loc" css="img noborder transparent simple icon"></obj>
			</div>
			<div class="block attendees active" id="{anchor user_list_block}">
				<div id="{anchor user_list_preview}" class="user_list_preview">{ATTENDEES::ALL_ATTENDEES}</div>
				<div id="{anchor user_list_container}" class="user_list_container">
					<div id="{anchor user_list}" class="user_list"></div>
					<div id="{anchor user_list_collapse}" class="user_list_collapse">{COMMON::COLLAPSE}</div>
				</div>
				<obj name="x_suggest" type="obj_suggest_mail" tabindex="true"></obj>
				<obj name="x_address_book_icon" type="obj_button" css="img noborder transparent address_book simple icon ico"></obj>
			</div>
			<div class="block memo active">
				<table class="frmtbl frmtbl100">
					<tr>
						<td>
							<obj name="x_note" type="obj_label" css="note" value="{EVENT::ADD_NOTE}"></obj>
						</td>
					</tr>
					<tr>
						<td class="tags">
							<div id="{anchor add_tags}" class="add_tags"></div>
							<div class="preview" id="{anchor tags_preview}"></div>
							<obj css="edit" name="EVNTYPE" type="obj_categories" tabindex="true"></obj>
						</td>
					</tr>
				</table>
			</div>
			<div class="block attach active">
				<div class="preview" id="{anchor attach_preview}"></div>
				<obj css="edit" name="X_ATTACHMENTS" type="obj_upload_edit_select" ></obj>
			</div>
		</div>
	</div>
	<div class="start_conference" id="{anchor conference}">
		<obj name="_start_conference" type="obj_button" css="color3"><value>EVENT::JOINCONFERENCE</value></obj>
	</div>
	<div id="{anchor right_column}" class="right_column">
		<div id="{anchor right_content}" class="right_content">
			<obj name="x_freebusy" type="obj_freebusy"></obj>
		</div>
	</div>
</div>
