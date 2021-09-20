<div class="left">

<input type="hidden" name="_c" value="{info::controller}" />
<input type="hidden" name="container" value="{container::id}" />
<input type="hidden" name="type" value="{container::type}" />

<a href="#" class="fancyButton left print" onclick="window.print()">{lang::event_main::print}</a>

<a href="?_l=folder&p0=main&p1=content&p2=event.main&p3=item.fdr&p4={optional request::all::_s::id}{htmlspecialchars request::all::_s::id}{/optional}{!optional request::all::_s::id}{settings::default_folders::events}{/optional}&p5=E&view=event.month" class="fancyButton left">{lang::event_main::month_view}</a>
<a href="?_l=folder&p0=main&p1=content&p2=event.main&p3=item.fdr&p4={optional request::all::_s::id}{htmlspecialchars request::all::_s::id}{/optional}{!optional request::all::_s::id}{settings::default_folders::events}{/optional}&p5=E&type=week" class="fancyButton left">{lang::event_main::week_view}</a>
<a href="?_l=folder&p0=main&p1=content&p2=event.main&p3=item.fdr&p4={optional request::all::_s::id}{htmlspecialchars request::all::_s::id}{/optional}{!optional request::all::_s::id}{settings::default_folders::events}{/optional}&p5=E&type=day" class="fancyButton left">{lang::event_main::day_view}</a>
<a href="?_l=folder&p0=main&p1=content&p2=event.main&p3=item.fdr&p4={optional request::all::_s::id}{htmlspecialchars request::all::_s::id}{/optional}{!optional request::all::_s::id}{settings::default_folders::events}{/optional}&p5=E&view=event.list" class="fancyButton left">{lang::event_main::list}</a>
</div>