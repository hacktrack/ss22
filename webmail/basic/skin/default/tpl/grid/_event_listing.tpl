{optional request::all::view}
	{optional request::all::view 'event.month'}
		<a href="?_l=folder&amp;p0=main&amp;p1=content&amp;p2=event.main&amp;p3=item.fdr&amp;p4={optional request::all::_s::id}{htmlspecialchars request::all::_s::id}{/optional}{!optional request::all::_s::id}{settings::default_folders::events}{/optional}&amp;p5=E&amp;_s[interval][start]={info::week::next_month::start}&amp;_s[interval][end]={info::week::next_month::end}&amp;{!optional request::all::view}type={htmlspecialchars info::view_type}{/optional}{optional request::all::view}view={request::all::view}{/optional}" class="fancyButton right" title="{lang::mail_view::next}">&gt;</a>
	
		<a href="?_l=folder&amp;p0=main&amp;p1=content&p2=event.main&p3=item.fdr&p4={optional request::all::_s::id}{htmlspecialchars request::all::_s::id}{/optional}{!optional request::all::_s::id}{settings::default_folders::events}{/optional}&p5=E&_s[interval][start]={info::week::previous_month::start}&_s[interval][end]={info::week::previous_month::end}&amp;{!optional request::all::view}type={htmlspecialchars info::view_type}{/optional}{optional request::all::view}view={request::all::view}{/optional}" class="fancyButton right" title="{lang::mail_view::prev}">&lt;</a>
	{/optional}
{/optional}
{!optional request::all::view}
	{optional info::view_type}
		<a href="?_l=folder&amp;p0=main&amp;p1=content&amp;p2=event.main&amp;p3=item.fdr&amp;p4={optional request::all::_s::id}{htmlspecialchars request::all::_s::id}{/optional}{!optional request::all::_s::id}{settings::default_folders::events}{/optional}&amp;p5=E&amp;_s[interval][start]={info::all::next::start}&amp;_s[interval][end]={info::all::next::end}&amp;{!optional request::all::view}type={htmlspecialchars info::view_type}{/optional}{optional request::all::view}view={request::all::view}{/optional}" class="fancyButton right" title="{lang::mail_view::next}">&gt;</a>
	
		<a href="?_l=folder&amp;p0=main&amp;p1=content&p2=event.main&p3=item.fdr&p4={optional request::all::_s::id}{htmlspecialchars request::all::_s::id}{/optional}{!optional request::all::_s::id}{settings::default_folders::events}{/optional}&p5=E&_s[interval][start]={info::all::previous::start}&_s[interval][end]={info::all::previous::end}&amp;{!optional request::all::view}type={htmlspecialchars info::view_type}{/optional}{optional request::all::view}view={request::all::view}{/optional}" class="fancyButton right" title="{lang::mail_view::prev}">&lt;</a>
	{/optional}
{/optional}