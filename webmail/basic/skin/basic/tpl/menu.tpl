<input type="hidden" id="lang-menu-alert_restricted_access" value="{lang::menu::alert_restricted_access}" />

{!optional request::all::_n::p::main 'win.main.public'}
<input class="almostHidden" type="hidden" name="_a[search]" value="1"/>
{/optional}

<div class="logout">
	<table cellpadding="0" cellspacing="0">
		<tr>
			<td id="accountName">{title}</td>
			<td id="actionButtons">
				<a id="logout" href="{link::logout}" title="{lang::menu::logout}"></a>
				{!optional request::all::_n::p::main 'win.main.public'}
					{!optional lang::menu::help_url}<span id="help" title="{lang::menu::help}"></span>{/optional}
					{optional lang::menu::help_url}<a id="help" title="{lang::menu::help}" href="{lang::menu::help_url}" target="_blank"></a>{/optional}
					<a id="settings" title="{lang::menu::settings}" href="?_n[p][content]=settings&_n[p][main]=win.main.tree"></a>
				{/optional}
			</td>
		</tr>
	</table>
</div>

<div id="strankahlavicka">

<div class="menu-shadow nowrap">
<div class="menu-top-sizer"></div>
<div class="menu-top-box">




{!optional request::all::_n::p::main 'win.main.public'}



	{optional sType 'M'} <div class="relative placeholder">{/optional}
	{!optional sType} <div class="relative placeholder">{/optional}

	<a id="get_messages" href="{optional links::m}{links::m}{/optional}{!optional links::m}index.html?_l=folder&p0=main&p1=content&p2=mail.main&p3=item.fdr&p4=INBOX&_n[p][main]=win.main.tree&p5=M&_c=account&_a[sync]=1{/optional}"{optional sType 'M'} class="active"{/optional}{!optional sType}{!optional at 'settings'}{!optional at 'settings_section'} class="active"{/optional}{/optional}{/optional} title="{lang::menu::messages}"><span>{lang::menu::messages}</span></a>

	{optional sType 'M'}</div>{/optional}
	{!optional sType}</div>{/optional}
	

{optional settings::groupware::enabled}

{!optional settings::restrictions::disable_gw_types::C}
	{optional sType 'C'} <div class="relative placeholder">{/optional}

	<a id="address_book" href="{optional links::c}{links::c}{/optional}{!optional links::m}index.html?_l=folder&p0=main&p1=content&p2=contact.main&p3=item.fdr&p4={settings::default_folders::contacts}&_n[p][main]=win.main.tree&p5=C{/optional}"  class="{optional settings::restrictions::disable_gw_types::C}restricted {/optional}{optional sType 'C'}active{/optional}" title="{lang::menu::address_book}"><span>{lang::menu::address_book}</span></a>

	{optional sType 'C'} </div>{/optional}
{/optional}

{!optional settings::restrictions::disable_gw_types::E}
	{optional sType 'E'} <div class="relative placeholder">{/optional}

	<a id="calendar" href="{optional links::e}{links::e}{/optional}{!optional links::m}?_l=folder&p0=main&p1=content&p2=event.main&p3=item.fdr&p4={settings::default_folders::events}&_n[p][main]=win.main.tree&p5=E{/optional}" class="{optional settings::restrictions::disable_gw_types::E}restricted {/optional}{optional sType 'E'}active{/optional}" title="{lang::menu::calendar}"><span>{lang::menu::calendar}</span></a>

	{optional sType 'E'}</div>{/optional}
{/optional}

{!optional settings::restrictions::disable_gw_types::T}
	{optional sType 'T'} <div class="relative placeholder">{/optional}

	<a id="tasks" href="{optional links::t}{links::t}{/optional}{!optional links::m}?_l=folder&p0=main&p1=content&p2=tasks.main&p3=item.fdr&p4={settings::default_folders::tasks}&_n[p][main]=win.main.tree&p5=T{/optional}" class="{optional settings::restrictions::disable_gw_types::T}restricted {/optional}{optional sType 'T'}active{/optional}" title="{lang::menu::tasks}"><span>{lang::menu::tasks}</span></a>

	{optional sType 'T'}</div>{/optional}
{/optional}

{!optional settings::restrictions::disable_gw_types::N}
	{optional sType 'N'} <div class="relative placeholder">{/optional}
	<a id="notes" href="{optional links::n}{links::n}{/optional}{!optional links::m}?_l=folder&p0=main&p1=content&p2=notes.main&p3=item.fdr&p4={settings::default_folders::notes}&_n[p][main]=win.main.tree&p5=N{/optional}" class="{optional settings::restrictions::disable_gw_types::N}restricted {/optional}{optional sType 'N'}active{/optional}" title="{lang::menu::notes}"><span>{lang::menu::notes}</span></a>
	{optional sType 'N'}</div>{/optional}
{/optional}

{/optional}

{optional settings::quarantine::enabled}
	{optional sType 'Q'} <div class="relative placeholder">{/optional}
	{optional sType 'QL'} <div class="relative placeholder">{/optional}
	<a id="quarantine" href="{optional links::q}{links::q}{/optional}{!optional links::m}?_l=folder&p0=main&p1=content&p2=quarantine.main&p3=item.fdr&p4=Quarantine&_n[p][main]=win.main.tree&p5=Q{/optional}"{optional sType 'QL'} class="active"{/optional}{optional sType 'Q'} class="active"{/optional} title="{lang::menu::quarantine}"><span>{lang::menu::quarantine}</span></a>
	{optional sType 'QL'}</div>{/optional}
	{optional sType 'Q'}</div>{/optional}
{/optional}



{/optional}

<div id="searchBar">

 		{optional request::all::_n::p::main 'win.main.public'}
 		<input class="almostHidden" type="submit" name="_a[public_calendar_action]" value="1"/>
 		{/optional}
 		{!optional request::all::_n::p::main 'win.main.public'}
 		<input class="almostHidden" type="submit" name="_a[search]" value="1"/>
 		{/optional}

 		<table cellpadding="0" cellspacing="0">
 			<tr>
 				{optional request::all::_n::p::main 'win.main.public'}
				<td class="searchField">
 						{lang::event_main::account}
 						<input type="hidden"{optional request::all::email} value="{htmlspecialchars request::all::email}"{/optional} name="accountPublicOld"/>
	 					<input id="accountInput" type="text"{optional request::all::email} value="{htmlspecialchars request::all::email}"{/optional} name="accountPublic"/>
 				</td>
 				<td>
					<input type="image" class="none" id="searchButton" title="{lang::menu::searchBut}" src="../basic/skin/basic/images/account.gif" name="_a[account]" value="1"/>
				</td>
				<td>&nbsp;</td>
				<td class="searchField">
	 					{lang::event_main::search}
	 					<input type="hidden"{optional request::all::_s::search} value="{htmlspecialchars request::all::_s::search}"{/optional} name="searchOld" />
	 					<input id="searchInput" type="text"{optional request::all::_s::search} value="{htmlspecialchars request::all::_s::search}"{/optional} name="search" />
 				</td>
				<td>
				
					<input type="image" class="none" id="searchButton" title="{lang::menu::searchBut}" src="../basic/skin/basic/images/lupa.gif" name="_a[search]" value="1"/>
				</td>
				{/optional}
				{!optional request::all::_n::p::main 'win.main.public'}
 				<td class="searchField">
	 				<input id="searchInput2" type="text"{optional request::all::_s::search} value="{htmlspecialchars request::all::_s::search}"{/optional} name="search"{optional search::disabled} disabled="disabled"{/optional}/>
 				</td>
 				<td>
				
					{optional request::all::_dlg}<input type="hidden" name="_dlg" value="{_dlg}"/>{/optional}
					<input type="image" class="none" id="searchButton" title="{lang::menu::searchBut}"{optional search::disabled} disabled="disabled"{/optional} src="../basic/skin/basic/images/lupa.gif" name="_a[search]" value="1"/>
				</td>
				{/optional}
			</tr>
		</table>
		
		{optional request::all::_n::p::main 'win.main.public'}
 		<input class="almostHidden" type="submit" name="_a[public_calendar_action]" value="1"/>
 		{/optional}
 		{!optional request::all::_n::p::main 'win.main.public'}
 		<input class="almostHidden" type="submit" name="_a[search]" value="1"/>
 		{/optional}
		
		<div class="cleaner"></div>
</div>




</div>
</div>
</div>