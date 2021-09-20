<div class="calendar">

<div class="interval"><span>{optional request::all::type 'day'}{info::week::extended_day}{/optional}{!optional request::all::type 'day'}{info::week::extended_week}{/optional}</span></div>

<table class="calendar">
	<thead>
	<tr class="days">
    	<th class="time"></th>
		{dynamic info::all::events}
		<th style="width:{info::all::column_width}%">
			<a{optional *::active} class="today"{/optional} href="?_l=folder&p0=main&p1=content&p2=event.main&p3=item.fdr&p4={optional request::all::_s::id}{rawurlencode request::all::_s::id}{/optional}{!optional request::all::_s::id}{rawurlencode settings::default_folders::events}{/optional}&p5=E&_s[interval][start]={.*::start}&_s[interval][end]={.*::end}&type=day">
			{.*::dim_name} {.*::day}
			</a>
		</th>
		{/dynamic}
	</tr>

	{optional info::all::ade}
	<tr class="all">
		<th></th>
		{dynamic info::all::ade}
		<td>
			{dynamic *}
				{optional *::class 'H'}
					{optional *::more}
					<div class="weather">
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
					<a href="{.*::link}"{optional *::color} class=" color_{.*::color}"{/optional}><span>
						{dynamic *::tags}
							<em class="tag" style="background-color:{.*::color}" title="{htmlspecialchars .*::tag}"></em>
						{/dynamic}
						{htmlspecialchars *::title}{!optional *::title}{lang::event_main::no_title}{/optional}
					</span></a>
				{/optional}
			{/dynamic}
		</td>
		{/dynamic}
	</tr>
	{/optional}
	</thead>
</table>
<div class="calendar_cover" style="height:{info::max_end}px">
<table class="calendar" style="margin-top:-{info::min_start}px">
	<thead>
	<tr class="days">
		<th class="time" style="padding:0"></th>
		{dynamic info::all::events}
		<th style="width:{info::all::column_width}%; padding:0;">
			
		</th>
		{/dynamic}
	</tr>
	</thead>
	<tbody>
	<tr>
		<th>
			<i>0<sup>00</sup></i>
			<i>1<sup>00</sup></i>
			<i>2<sup>00</sup></i>
			<i>3<sup>00</sup></i>
			<i>4<sup>00</sup></i>
			<i>5<sup>00</sup></i>
			<i>6<sup>00</sup></i>
			<i>7<sup>00</sup></i>
			<i>8<sup>00</sup></i>
			<i>9<sup>00</sup></i>
			<i>10<sup>00</sup></i>
			<i>11<sup>00</sup></i>
			<i>12<sup>00</sup></i>
			<i>{optional info::time_format}13{/optional}{!optional info::time_format}1{/optional}<sup>00</sup></i>
			<i>{optional info::time_format}14{/optional}{!optional info::time_format}2{/optional}<sup>00</sup></i>
			<i>{optional info::time_format}15{/optional}{!optional info::time_format}3{/optional}<sup>00</sup></i>
			<i>{optional info::time_format}16{/optional}{!optional info::time_format}4{/optional}<sup>00</sup></i>
			<i>{optional info::time_format}17{/optional}{!optional info::time_format}5{/optional}<sup>00</sup></i>
			<i>{optional info::time_format}18{/optional}{!optional info::time_format}6{/optional}<sup>00</sup></i>
			<i>{optional info::time_format}19{/optional}{!optional info::time_format}7{/optional}<sup>00</sup></i>
			<i>{optional info::time_format}20{/optional}{!optional info::time_format}8{/optional}<sup>00</sup></i>
			<i>{optional info::time_format}21{/optional}{!optional info::time_format}9{/optional}<sup>00</sup></i>
			<i>{optional info::time_format}22{/optional}{!optional info::time_format}10{/optional}<sup>00</sup></i>
			<i>{optional info::time_format}23{/optional}{!optional info::time_format}11{/optional}<sup>00</sup></i>
		</th>

		{dynamic info::all::events}
		<td rowspan="24" style="width:{info::all::column_width}%">
			<div class="calendar_col_div">

			{dynamic *::items}
				<a href="{.*::link}" title="{.*::startT}-{.*::endT} {htmlspecialchars *::title}"{optional .*::color} class="color_{.*::color}"{/optional} style="top:{.*::start_big}px;left:{.*::left}%; height:{.*::size_big}px; width:{.*::width}%">
					<span>
					{dynamic *::tags}
						<em class="tag" style="background-color:{.*::color}" title="{htmlspecialchars .*::tag}"></em>
					{/dynamic}
					<!--OBSOLATE-<i>{.*::startT}-{.*::endT}</i>-->
					{htmlspecialchars *::title}{!optional *::title}{lang::event_main::no_title}{/optional}
					</span>
				</a>
			{/dynamic}

			</div>
		</td>
		{/dynamic}
	</tr>
	</tbody>
</table>
</div>
</div>