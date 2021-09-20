<ul class="eventtooltip">
	<li{optional reminder} class="reminder"{/optional}>{htmlspecialchars title}</li>
	{optional location}<li>{htmlspecialchars location}</li>{/optional}
	<li{optional recurrent} class="recurrence"{/optional}>
		{optional starttime}<em>{starttime}</em>{/optional} {start}
		{optional end} – {/optional}
		{optional endtime}<em>{endtime}</em>{/optional} {end}
		<em>{duration}</em>
	</li>

	{optional owner}<li class="owner"><em>{CALENDAR::OWNER}</em> {htmlspecialchars owner}</li>{/optional}

	{optional tags}{tags}{/optional}
</ul>