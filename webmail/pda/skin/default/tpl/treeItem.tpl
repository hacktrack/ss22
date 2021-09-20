{optional item::icoClass 'ico_accounts'}
		<div>
		<span>&nbsp;</span>
		<a class="ico f folder_new" href="?_n[p][content]=manage.folders&amp;_n[p][main]=win.main&amp;folder[action]=addNode&amp;folder[active]={item::ueid}" title="{lang::tree::add_folder}">&nbsp;</a>
		<span class="ico f {item::icoClass}">
		&nbsp;
		</span>
		<span class="nobg">
			<a href="{item::link}">
				{optional item::active}<b>{/optional} {item::name} {optional item::active}</b>{/optional}
			</a>
		</span>
		</div>
{/optional}

{optional item::icoClass 'folder_inbox'}
		<div>
		<span>&nbsp;</span>
		<a class="ico f folder_new" href="?_n[p][content]=manage.folders&amp;_n[p][main]=win.main&amp;folder[action]=addNode&amp;folder[active]={item::ueid}" title="{lang::tree::add_folder}">&nbsp;</a>
		<input type="checkbox" name="addFolder[]" value="{item::name}"/>
		<span class="ico f {item::icoClass}{item::linkedClass}">
		&nbsp;
		</span>
		<span class="nobg">
			<a href="{item::link}">
				{optional item::active}<b>{/optional} {item::name} {optional item::active}</b>{/optional}
			</a>
		</span>
		</div>
{/optional}

{optional item::icoClass 'folder_normal'}
		<div>
		<span>&nbsp;</span>
		<a class="ico f folder_new" href="?_n[p][content]=manage.folders&amp;_n[p][main]=win.main&amp;folder[action]=addNode&amp;folder[active]={item::ueid}" title="{lang::tree::add_folder}">&nbsp;</a>
		<input type="checkbox" name="addFolder[]" value="{item::name}"/>
		<span class="ico f {item::icoClass}{item::linkedClass}">
		&nbsp;
		</span>
		<span class="nobg">
			<a href="{item::link}">
				{optional item::active}<b>{/optional} {item::name} {optional item::active}</b>{/optional}
			</a>
		</span>
		</div>
{/optional}