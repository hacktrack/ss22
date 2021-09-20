{optional treeType::full}
	{tree}
{/optional}

{optional treeType::simple}
<div id="main">
<div id="simpleTree">
	<a href="?_n[p][content]=mail.compose&_n[p][main]=win.main.tree"{optional activeLeftMenuTab::lmtnewmail} class="active"{/optional}>{lang::tree::new_message}</a>
	<br />
{dynamic leftMenu}
	<a href="?_l=folder&p0=main&p1=content&p2=mail{optional *::id 'Drafts'}.drafts{/optional}{!optional *::id 'Drafts'}.main{/optional}&p3=item.fdr&p4={*::id}&p5=M"{optional *::active} class="active"{/optional}>{*::label}</a>{/dynamic}
	<br />
	<a href="?_n[p][content]=manage.folders&_n[p][main]=win.main.tree"{optional activeLeftMenuTab::lmtfolders} class="active"{/optional}>{lang::tree::manage_folders}</a>
</div>
</div>
{/optional}