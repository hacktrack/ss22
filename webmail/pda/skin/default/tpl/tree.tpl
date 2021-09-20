{optional treeType::full}
	{tree}
{/optional}

{optional treeType::simple}
<div id="main">
<div id="simpleTree">
	<a href="?_n[p][content]=compose.mail&_n[p][main]=win.main.tree"{optional activeLeftMenuTab::lmtnewmail} class="active"{/optional}>{lang::tree::new_message}</a>
	<br />
{dynamic leftMenu}
	<a href="?_l=folder&p0=main&p1=main&p2=grid.mail&p3=item.fdr&p4={*::id}&p5=M"{optional *::active} class="active"{/optional}>{*::label}</a>
{/dynamic}

	<br />
	<a href="?_n[p][content]=manage.folders&_n[p][main]=win.main"{optional activeLeftMenuTab::lmtfolders} class="active"{/optional}>{lang::tree::manage_folders}</a>

<br />

<input type="text" style="width:100px; border:#333 1px solid; margin-left:2px;"/> <input type="button" value="Search" style="border:#333 1px solid; margin-left:2px;"/>

</div>
</div>
{/optional}