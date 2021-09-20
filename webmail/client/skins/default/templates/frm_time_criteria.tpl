<div id="{anchor message}" class="popupmaindialog">
	<div>
		<obj name="weekdays_enabled" type="obj_checkbox" ><title>EVENT::WEEKDAYS</title></obj>
	</div>
	<div class="weekdays" id="{anchor weekdays}">
		<obj name="weekdays_su" type="obj_checkbox" ><title>SHORT_DAYS::SUNDAY</title></obj>
		<obj name="weekdays_mo" type="obj_checkbox" ><title>SHORT_DAYS::MONDAY</title></obj>
		<obj name="weekdays_tu" type="obj_checkbox" ><title>SHORT_DAYS::TUESDAY</title></obj>
		<obj name="weekdays_we" type="obj_checkbox" ><title>SHORT_DAYS::WEDNESDAY</title></obj>
		<obj name="weekdays_th" type="obj_checkbox" ><title>SHORT_DAYS::THURSDAY</title></obj>
		<obj name="weekdays_fr" type="obj_checkbox" ><title>SHORT_DAYS::FRIDAY</title></obj>
		<obj name="weekdays_sa" type="obj_checkbox" ><title>SHORT_DAYS::SATURDAY</title></obj>
	</div>

	<div>
		<obj name="times_enabled" type="obj_checkbox" ><title>EVENT::BETWEEN_TIMES</title></obj>
	</div>
	<div class="times" id="{anchor times}">
		<obj name="times_from" type="obj_input" ><value>00:00</value></obj>
		<obj name="times_to" type="obj_input" ><value>00:00</value></obj>
	</div>

	<div>
		<obj name="dates_enabled" type="obj_checkbox" ><title>EVENT::BETWEEN_DATES</title></obj>
	</div>
	<div class="dates" id="{anchor dates}">
		<obj name="dates_from" type="obj_input_calendar" ></obj>
		<obj name="dates_to" type="obj_input_calendar" ></obj>
	</div>
</div>
