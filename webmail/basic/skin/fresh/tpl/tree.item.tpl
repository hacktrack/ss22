
<div>
	<span>&nbsp;</span>
		{optional item::_RIGHTS_::unlink}
			<a href="index.html?_n[p][content]=manage.folders&amp;_n[p][main]=win.main.tree&amp;_s[type]={request::all::_s::type}&amp;folder[active]={item::ueid}" class="ico f folder_link{item::linkedClass}">&nbsp;&nbsp;</a>
		{/optional}
		{!optional item::_RIGHTS_::unlink}
			{!optional item::_RIGHTS_::link}
				{optional item::linkedClass}
					<span class="ico f folder_link_dis" title="{lang::manage_folders::link}">&nbsp;&nbsp;</span>
				{/optional}
				{!optional item::linkedClass}
					{optional item::_RIGHTS_::showLinkCheckbox}
						<span class="ico f folder_link_empty" title="{lang::manage_folders::link}">&nbsp;&nbsp;</span>
					{/optional}
				{/optional}
			{/optional}
			{optional item::_RIGHTS_::link}
				<span class="ico f folder_link_dis" title="{lang::manage_folders::link}">&nbsp;&nbsp;</span>
			{/optional}
		{/optional}

		{optional item::_RIGHTS_::showIcon}
			<span class="ico f {item::icoClass} {item::linkedClass}{optional item::archive}archive{/optional}"><b>&nbsp;&nbsp;&nbsp;&nbsp;</b></span>
		{/optional}
		<span class="nobg">
			{optional item::_RIGHTS_::href}<a href="index.html?_n[p][content]=manage.folders&amp;_n[p][main]=win.main.tree&amp;_s[type]={request::all::_s::type}&amp;folder[active]={item::ueid}">{/optional}
				{optional item::active}<b>{/optional}
				{optional item::name '__@@VIRTUAL@@__'}{lang::manage_folders::virtual}{/optional}
				{!optional item::name '__@@VIRTUAL@@__'}
					{optional item::strong}<strong>{/optional}
					{htmlspecialchars item::name}
					{optional item::strong}</strong>{/optional}
					{optional item::link_name_forced}
						<em class="gray">({item::link_name_forced})</em>
					{/optional}
					{!optional item::link_name_forced}
						{optional item::link_name} <em class="gray">({item::link_name})</em>{/optional}
					{/optional}
				{/optional}
				{optional item::active}</b>{/optional}
				{optional item::_RIGHTS_::showLinkCheckbox}
				{optional item::_RIGHTS_::href}
				&nbsp;
				<em class="tree_open_folder">
					[<a href="?_l=folder&p0=main&p1=content&p2={optional request::all::_s::type 'M'}mail.main{/optional}{optional request::all::_s::type 'C'}contact.main{/optional}{optional request::all::_s::type 'E'}event.main{/optional}{optional request::all::_s::type 'T'}tasks.main{/optional}{optional request::all::_s::type 'N'}notes.main{/optional}{optional request::all::_s::type 'F'}file.main{/optional}&p3=item.fdr&p4={rawurlencode item::folder}&p5={request::all::_s::type}">{lang::tree::open}</a>]
				</em>
				{/optional}
				{/optional}
			{optional item::_RIGHTS_::href}</a>{/optional}
		</span>
</div>