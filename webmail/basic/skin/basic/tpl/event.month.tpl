<table cellspacing="0" cellpadding="0" class="mTable">
<tr>
<th colspan="8" class="crossroad">
<!--
			<a class="fancyButton right" href="?_l=folder&p0=main&p1=content&p2=event.main&p3=item.fdr&p4={optional request::all::_s::id}{htmlspecialchars request::all::_s::id}{/optional}{!optional request::all::_s::id}{settings::default_folders::events}{/optional}&p5=E&_s[interval][start]={info::week::next_month::start}&_s[interval][end]={info::week::next_month::end}&amp;&view=event.month">&gt;&gt;&nbsp;</a>
			<a class="fancyButton left" href="?_l=folder&p0=main&p1=content&p2=event.main&p3=item.fdr&p4={optional request::all::_s::id}{htmlspecialchars request::all::_s::id}{/optional}{!optional request::all::_s::id}{settings::default_folders::events}{/optional}&p5=E&_s[interval][start]={info::week::previous_month::start}&_s[interval][end]={info::week::previous_month::end}&amp;&view=event.month">&lt;&lt;</a>
-->
			{info::week::month} {info::week::year}
		</th>
	</tr>
	{optional info::month::week_starts '1'}
	<tr>
		<th></th>
		<th>{lang::event_main::mon}</th>
		<th>{lang::event_main::tue}</th>
		<th>{lang::event_main::wed}</th>
		<th>{lang::event_main::thu}</th>
		<th>{lang::event_main::fri}</th>
		<th>{lang::event_main::sat}</th>
		<th>{lang::event_main::sun}</th>
	</tr>
	{/optional}
	{optional info::month::week_starts '2'}
	<tr>
		<th></th>
		<th>{lang::event_main::tue}</th>
		<th>{lang::event_main::wed}</th>
		<th>{lang::event_main::thu}</th>
		<th>{lang::event_main::fri}</th>
		<th>{lang::event_main::sat}</th>
		<th>{lang::event_main::sun}</th>
		<th>{lang::event_main::mon}</th>
	</tr>
	{/optional}
	{optional info::month::week_starts '3'}
	<tr>
		<th></th>
		<th>{lang::event_main::wed}</th>
		<th>{lang::event_main::thu}</th>
		<th>{lang::event_main::fri}</th>
		<th>{lang::event_main::sat}</th>
		<th>{lang::event_main::sun}</th>
		<th>{lang::event_main::mon}</th>
		<th>{lang::event_main::tue}</th>
	</tr>
	{/optional}
	{optional info::month::week_starts '4'}
	<tr>
		<th></th>
		<th>{lang::event_main::thu}</th>
		<th>{lang::event_main::fri}</th>
		<th>{lang::event_main::sat}</th>
		<th>{lang::event_main::sun}</th>
		<th>{lang::event_main::mon}</th>
		<th>{lang::event_main::tue}</th>
		<th>{lang::event_main::wed}</th>
	</tr>
	{/optional}
	{optional info::month::week_starts '5'}
	<tr>
		<th></th>
		<th>{lang::event_main::fri}</th>
		<th>{lang::event_main::sat}</th>
		<th>{lang::event_main::sun}</th>
		<th>{lang::event_main::mon}</th>
		<th>{lang::event_main::tue}</th>
		<th>{lang::event_main::wed}</th>
		<th>{lang::event_main::thu}</th>
	</tr>
	{/optional}
	{optional info::month::week_starts '6'}
	<tr>
		<th></th>
		<th>{lang::event_main::sat}</th>
		<th>{lang::event_main::sun}</th>
		<th>{lang::event_main::mon}</th>
		<th>{lang::event_main::tue}</th>
		<th>{lang::event_main::wed}</th>
		<th>{lang::event_main::thu}</th>
		<th>{lang::event_main::fri}</th>
	</tr>
	{/optional}
	{optional info::month::week_starts '7'}
	<tr>
		<th></th>
		<th>{lang::event_main::sun}</th>
		<th>{lang::event_main::mon}</th>
		<th>{lang::event_main::tue}</th>
		<th>{lang::event_main::wed}</th>
		<th>{lang::event_main::thu}</th>
		<th>{lang::event_main::fri}</th>
		<th>{lang::event_main::sat}</th>
	</tr>
	{/optional}
{dynamic info::month::nmw}
	<tr>
		<th><a href="?_l=folder&p0=main&p1=content&p2=event.main&p3=item.fdr&p4={optional request::all::_s::id}{htmlspecialchars request::all::_s::id}{/optional}{!optional request::all::_s::id}{settings::default_folders::events}{/optional}&p5=E&_s[interval][start]={.*::info::week_start}&_s[interval][end]={.*::info::week_end}&view=event.all">{.*::info::week_number}</a></th>
	{dynamic *::data}
		<td{optional *::tomonth} class="activeBox{optional *::active}Active{/optional}"{/optional}>
			<div>
				<div class="mInBox">
					<div class="dayLine"><a href="?_l=folder&p0=main&p1=content&p2=event.main&p3=item.fdr&p4={optional request::all::_s::id}{htmlspecialchars request::all::_s::id}{/optional}{!optional request::all::_s::id}{settings::default_folders::events}{/optional}&p5=E&_s[interval][start]={.*::intervals}&_s[interval][end]={.*::intervale}&view=event.all&type=day">{.*::value}</a></div>
					{dynamic *::allDayEvents}
						{optional *::class 'H'}
							{optional *::more}
								<div class="AllDayEventLine noPadding weatherBox">
									<img src="skin/basic/images/weather/{.*::more::icon}.gif" title="{.*::more::cond}"/>&nbsp;
									{optional info::settings::temperature 'F'}{.*::more::f_hi}°F{/optional}
									{!optional info::settings::temperature 'F'}{.*::more::c_hi}°C{/optional}
									{.*::more::loc}
								</div>
							{/optional}
							{!optional *::more}
								<div class="AllDayEventLine">{htmlspecialchars *::title}</div>
							{/optional}
						{/optional}
						{!optional *::class 'H'}
						<a href="{.*::link}" class="eventLine color_{.*::color}">{htmlspecialchars *::title}</a>
						{/optional}
					{/dynamic}
					
					{dynamic *::events}
						<a href="{.*::link}" class="eventLine color_{.*::color}" style=" overflow:hidden;">
								{.*::startT}-{.*::endT} {htmlspecialchars *::title}
						</a>
					{/dynamic}
					
				</div>
			</div>
		</td>
	{/dynamic}
	</tr>
{/dynamic}
	
</table>