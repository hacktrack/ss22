<div id="main">
<div id="simpleTree">

<div class="menuLeftSizeSet relative{optional activeLeftMenuTab::lmtnewmail} active{/optional}{optional topAction::active} activeAdd{/optional}">
	<a href="{optional links::new}{links::new}{/optional}{!optional links::new}{topAction::link}{/optional}" class="{optional topAction::type 'M'}{optional activeLeftMenuTab::lmtnewmail}active-{/optional}top{/optional}{!optional topAction::type 'M'}{optional topAction::active}activeAdd{/optional}{/optional}">{topAction::text}</a>
</div>

{optional request::all::_s::type 'C'}
		<div class="menuLeftSizeSet relative{optional request::all::p2 'contact.distribution'}{!optional request::all::p6} activeAdd{/optional}{/optional}">
			<a href="{optional links::new}{links::new}{/optional}{!optional links::new}?_l=folder&amp;p0=main&amp;p1=content&amp;p2=contact.distribution&amp;p3=item.fdr&amp;p4={optional request::all::_s::id}{htmlspecialchars request::all::_s::id}{/optional}{!optional request::all::_s::id}{settings::default_folders::contacts}{/optional}&amp;_n[p][main]=win.main.tree&amp;p5=C{/optional}&amp;add_new=1"{optional request::all::p2 'contact.distribution'} class="{!optional request::all::p6}activeAdd{/optional}"{/optional}>{lang::contact_main::add_distribution}</a>
		</div>
{/optional}

{dynamic leftMenu}
	{!optional *::active}
		<div class="menuLeftSizeSet relative">
			{optional *::disabled}
				<a href="#" title="{.*::id}" class="disabled"><span>{.*::label}</span></a>
			{/optional}
			{!optional *::disabled}
				<a href="{optional links::folders}{links::folders}{/optional}{!optional links::folders}?_l=folder&p0=main&p1=content&p2={.*::page}&p3=item.fdr&p4={.*::urlid}&p5={.*::type}{.*::link_suffix ''}{/optional}" title="{.*::id}"><span>{.*::label}</span></a>
			{/optional}
		</div>
	{/optional}
	{optional *::active}
		<div class="relative active">
		<a href="{optional links::folders}{links::folders}{/optional}{!optional links::folders}?_l=folder&p0=main&p1=content&p2={.*::page}&p3=item.fdr&p4={.*::urlid}&p5={.*::type}{.*::link_suffix ''}{/optional}" class="active{optional request::all::_s::type 'Q'}{optional *::islast}-bottom{/optional}{/optional}{optional request::all::_s::type 'QL'}{optional *::islast}-bottom{/optional}{/optional}" title="{.*::id}"><span>{.*::label}</span></a>
		</div>
	{/optional}
{/dynamic}

{!optional request::all::_s::type 'Q'}
{!optional request::all::_s::type 'QL'}
<div class="menuLeftSizeSet relative{optional activeLeftMenuTab::lmtfolders} active{/optional}">
	<a href="{optional links::fm}{links::fm}{/optional}{!optional links::fm}?_n[p][content]=manage.folders&_n[p][main]=win.main.tree&_s[type]={type}{/optional}" class="{optional activeLeftMenuTab::lmtfolders}active-{/optional}bottom">{lang::tree::manage_folders}</a>
</div>
{/optional}
{/optional}

</div>
<div class="cleaner"></div>
</div>