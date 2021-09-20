<div class="datepicker" id="{anchor dropdown}">
	<div class="datepicker-head">
		<div class="datepicker-month">
			<span class="datepicker-arrow icon-arrow-back" id="{anchor monthminus}"></span>
			<form class="datepicker-select dropdown">
				<select id="{anchor month}">
					<option>{DATETIME::JANUARY}</option>
					<option>{DATETIME::FEBRUARY}</option>
					<option>{DATETIME::MARCH}</option>
					<option>{DATETIME::APRIL}</option>
					<option>{DATETIME::MAY}</option>
					<option>{DATETIME::JUNE}</option>
					<option>{DATETIME::JULY}</option>
					<option>{DATETIME::AUGUST}</option>
					<option>{DATETIME::SEPTEMBER}</option>
					<option>{DATETIME::OCTOBER}</option>
					<option>{DATETIME::NOVEMBER}</option>
					<option>{DATETIME::DECEMBER}</option>
				</select>
			</form>
			<span class="datepicker-arrow icon-arrow-forward" id="{anchor monthplus}"></span>
		</div>
		<div class="datepicker-year">
			<span class="datepicker-arrow icon-arrow-back" id="{anchor yearminus}"></span>
			<span class="datepicker-select" id="{anchor year}"></span>
			<span class="datepicker-arrow icon-arrow-forward" id="{anchor yearplus}"></span>
		</div>
	</div>
	<table class="datepicker-calendar">
		<thead class="datepicker-names">
			<tr id="{anchor weekdays}"></tr>
		</thead>
		<tbody class="datepicker-dates" id="{anchor calendar}"></tbody>
	</table>
</div>
