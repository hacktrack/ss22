<div class="maxbox">
	<obj name="maintab" type="obj_vtabs">
		<obj name="main" type="obj_tab" ondemand="true">
			<value>SETTINGS::MAIN</value>
			<draw form="frm_calendar_settings_main"></draw>
		</obj>
        {optional admin domainadmin gw_c gw_j gw_n gw_t gw_e}
		<obj name="default_settings" type="obj_tab" ondemand="true">
			<value>SETTINGS::DEFAULT_SETTINGS</value>
			<draw form="frm_calendar_settings_default"></draw>
		</obj>
		{/optional}

		{optional admin domainadmin gw_e}
		<obj name="reminder" type="obj_tab" ondemand="true">
			<value>REMINDER::REMINDER</value>
			<obj name="event" type="obj_form">
				<draw form="frm_calendar_settings_event"></draw>
			</obj>

			{noptional domainadmin}
			<obj name="gw" type="obj_form">
				<draw form="frm_calendar_settings_main_gw"></draw>
			</obj>
			{/noptional}
   		</obj>
        {/optional}

		{optional settings}
        {optional gw_e}
		<obj name="hollidays" type="obj_tab" ondemand="true">
			<value>SETTINGS::HOLIDAYS</value>
			<draw form="frm_holidays"></draw>
		</obj>
		{noptional disable_weather}
			<obj name="weather" type="obj_tab" css="weather_tab" ondemand="true">
				<value>SETTINGS::WEATHER</value>
				<draw form="frm_calendar_settings_weather"></draw>
			</obj>
		{/noptional}	
		{/optional}
		{/optional}
	</obj>
</div>