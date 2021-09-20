<div class="folder_list">
	{dynamic folders}
	{optional *::selected}<b>{/optional}<a href="?_l=folder&amp;p0=main&amp;p1=main&amp;p2={.*::page}&amp;p3=item.fdr&amp;p4={.*::id}&amp;p5={.*::type}"{optional *::active} class="active"{/optional}>{!optional *::selected}<span>&gt;</span>{/optional}{optional *::selected}<span class="bull">&bull;</span>{/optional}{.*::localizedName}{optional *::recent} ({.*::recent}){/optional}</a>{optional *::selected}</b>{/optional}<br/>{/dynamic}
</div>
