<table class="calendar monthViewTable">
	<thead>
	{dynamic info::month::nmw}
	<tr class="interval">
		<td colspan="7">
			<span><a href="?_l=folder&p0=main&p1=content&p2=event.main&p3=item.fdr&p4={optional request::all::_s::id}{rawurlencode request::all::_s::id}{/optional}{!optional request::all::_s::id}{rawurlencode settings::default_folders::events}{/optional}&p5=E&_s[interval][start]={.*::info::week_start}&_s[interval][end]={.*::info::week_end}">{.*::info::week_number} {lang::event_main::week}</a></span>
		</td>
	</tr>

	<tr class="days">
		{dynamic *::data}
		<th{!optional *::tomonth} class="outside"{/optional}><a{optional *::active} class="today"{/optional} href="?_l=folder&p0=main&p1=content&p2=event.main&p3=item.fdr&p4={optional request::all::_s::id}{rawurlencode request::all::_s::id}{/optional}{!optional request::all::_s::id}{rawurlencode settings::default_folders::events}{/optional}&p5=E&_s[interval][start]={.*::intervals}&_s[interval][end]={.*::intervale}&type=day">{.*::dim_name} {.*::day}</a></th>
		{/dynamic}
	</tr>

	<tr>
		{dynamic *::data}
		<td{!optional *::tomonth} class="outside"{/optional}>

			{dynamic *::allDayEvents}
				{optional *::class 'H'}
					{optional *::more}
						<div class="weather" title="{htmlspecialchars .*::more::loc}">
							<img src="skin/basic/images/weather/{.*::more::icon}.gif" title="{.*::more::cond}"/>
							{optional info::settings::temperature 'F'}{.*::more::f_hi}°F{/optional}
							{!optional info::settings::temperature 'F'}{.*::more::c_hi}°C{/optional}
							{.*::more::loc}
						</div>
					{/optional}

					{!optional *::more}
						<div class="holiday{optional *::type 'Public Holiday'} public{/optional}">{.*::title}</div>
					{/optional}

				{/optional}
				
				{!optional *::class 'H'}
				<a href="{.*::link}" class="color_{.*::color}"><span>
					{dynamic *::tags}
						<em class="tag" style="background-color:{.*::color}" title="{htmlspecialchars .*::tag}"></em>
					{/dynamic}
					{htmlspecialchars *::title}</span>
				</a>
				{/optional}
			{/dynamic}
			
			{dynamic *::events}
			<a href="{.*::link}" class="eventLine color_{.*::color}">
				<span>
					{dynamic *::tags}
						<em class="tag" style="background-color:{.*::color}" title="{htmlspecialchars .*::tag}"></em>
					{/dynamic}
					<i>{.*::startT}-{.*::endT}</i> {htmlspecialchars *::title}
				</span>
			</a>
			{/dynamic}

		</td>
		{/dynamic}
	</tr>
	<tr>
		<th colspan="7">&nbsp;</th>
	</tr>
	{/dynamic}
	</thead>
</table>