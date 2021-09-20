<table cellspacing="0" cellpadding="0" class="tGrid tGridWW">
	<tr>
		<th colspan="{info::all::count}" class="crossroad">
			<a href="?_l=folder&p0=main&p1=content&p2=event.main&p3=item.fdr&p4={optional request::all::_s::id}{htmlspecialchars request::all::_s::id}{/optional}{!optional request::all::_s::id}{settings::default_folders::events}{/optional}&p5=E&_s[interval][start]={info::all::this::start}&_s[interval][end]={info::all::this::end}&amp;&type=week">{lang::event_main::week} {info::week::num} / {info::week::year}</a> 
		</th>
	</tr>

	<tr>
		<th></th>
	{dynamic info::all::events}
		<th class="calendar_days" style="width:{info::all::column_width}%">
			<div>
				<div>
					<a href="?_l=folder&p0=main&p1=content&p2=event.main&p3=item.fdr&p4={optional request::all::_s::id}{htmlspecialchars request::all::_s::id}{/optional}{!optional request::all::_s::id}{settings::default_folders::events}{/optional}&p5=E&_s[interval][start]={.*::start}&_s[interval][end]={.*::end}&type=day">
						{.*::info}
					</a>
				</div>
			</div>
		</th>
	{/dynamic}

	</tr>

	<tr>
		<th></th>
		{dynamic info::all::ade}
		<th class="calendar_ade vertical_top" style="width:{info::all::column_width}%">
			{dynamic *}
				{optional *::class 'H'}
					{optional *::more}
					<span class="noPadding weatherBox"><div>
						<img src="skin/basic/images/weather/{.*::more::icon}.gif" title="{.*::more::cond}"/>&nbsp;
						{optional info::settings::temperature 'F'}{.*::more::f_hi}°F{/optional}
						{!optional info::settings::temperature 'F'}{.*::more::c_hi}°C{/optional}
						{.*::more::loc}
					</div></span>
					{/optional}
					{!optional *::more}
					<span {optional *::type 'Public Holiday'} class="typeHoliday"{/optional}><div>{.*::title}</div></span>
					{/optional}
				{/optional}
				{!optional *::class 'H'}
					<a href="{.*::link}" class="{!optional *::color}gray{/optional} color_{.*::color}">{htmlspecialchars *::title}{!optional *::title}{lang::event_main::no_title}{/optional}</a>
				{/optional}
			{/dynamic}
		</th>
		{/dynamic}
	</tr>

	<tr class="calendar_hours"><th><div>0<sup>00</sup></div></th>

	{dynamic info::all::events}
	<td rowspan="24" class="calendar_col" style="width:{info::all::column_width}%">
		<div class="calendar_col_div">

		{dynamic *::items}
			<a href="{.*::link}" title="{.*::startT}-{.*::endT} {htmlspecialchars *::title}" class="event{optional *::micro} microEvent{/optional}" style="top:{.*::start}px;left:{.*::left}%; {!optional *::micro}height:{.*::size}px;{/optional} width:{.*::width}%">
				<span class="in color_{.*::color}{optional *::half} half{/optional}">
				{.*::startT}-{.*::endT}
				{htmlspecialchars *::title}{!optional *::title}<span class="gray">{lang::event_main::no_title}</span>{/optional}
				</span>
			</a>
		{/dynamic}

		</div>
	</td>
	{/dynamic}

	</tr>
	<tr class="calendar_hours"><th><div>1<sup>00</sup></div></th></tr>
	<tr class="calendar_hours"><th><div>2<sup>00</sup></div></th></tr>
	<tr class="calendar_hours"><th><div>3<sup>00</sup></div></th></tr>
	<tr class="calendar_hours"><th><div>4<sup>00</sup></div></th></tr>
	<tr class="calendar_hours"><th><div>5<sup>00</sup></div></th></tr>
	<tr class="calendar_hours"><th><div>6<sup>00</sup></div></th></tr>
	<tr class="calendar_hours"><th><div>7<sup>00</sup></div></th></tr>
	<tr class="calendar_hours"><th><div>8<sup>00</sup></div></th></tr>
	<tr class="calendar_hours"><th><div>9<sup>00</sup></div></th></tr>
	<tr class="calendar_hours"><th><div>10<sup>00</sup></div></th></tr>
	<tr class="calendar_hours"><th><div>11<sup>00</sup></div></th></tr>
	<tr class="calendar_hours"><th><div>12<sup>00</sup></div></th></tr>
	<tr class="calendar_hours"><th><div>13<sup>00</sup></div></th></tr>
	<tr class="calendar_hours"><th><div>14<sup>00</sup></div></th></tr>
	<tr class="calendar_hours"><th><div>15<sup>00</sup></div></th></tr>
	<tr class="calendar_hours"><th><div>16<sup>00</sup></div></th></tr>
	<tr class="calendar_hours"><th><div>17<sup>00</sup></div></th></tr>
	<tr class="calendar_hours"><th><div>18<sup>00</sup></div></th></tr>
	<tr class="calendar_hours"><th><div>19<sup>00</sup></div></th></tr>
	<tr class="calendar_hours"><th><div>20<sup>00</sup></div></th></tr>
	<tr class="calendar_hours"><th><div>21<sup>00</sup></div></th></tr>
	<tr class="calendar_hours"><th><div>22<sup>00</sup></div></th></tr>
	<tr class="calendar_hours"><th><div>23<sup>00</sup></div></th></tr>
</table>