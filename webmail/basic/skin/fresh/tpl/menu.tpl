	<div id="header1">
		<div class="account">
			{htmlspecialchars title}
			{optional quota}
				<span class="quota"><span class="color" style="width:{quota::percentage}%; background-color:rgb({quota::color::r},{quota::color::g},{quota::color::b});"></span><span class="text">{quota::usage} / {quota::limit}</span></span>
			{/optional}
		</div>
		<div class="iconset">
			{optional lang::menu::help_url}
			<a href="{lang::menu::help_url}" class="ico_help" id="at_help" title="{lang::menu::help}" target="_blank"></a>
			{/optional}
			<a href="?_n[p][content]=settings&_n[p][main]=win.main.tree&_s[type]=S&view=section&section=general" class="ico_setting" id="at_settings" title="{lang::menu::settings}"></a>
			<a href="{link::logout}" class="ico_logout" id="at_logout" title="{lang::menu::logout}"></a>
		</div>
	</div>
	{optional error}<div id="notifier" class="error">{htmlspecialchars error::eid}</div>{/optional}
	{optional message}<div id="notifier" class="message">{htmlspecialchars message::id}</div>{/optional}
	{optional note}<div id="notifier" class="note">{note}</div>{/optional}


	<div id="header2"{optional menu_as_text} class="blind"{/optional}>
	<form class="search" action="{optional parameters}{htmlspecialchars info::link}{htmlspecialchars parameters}{/optional}" method="post">
	<table cellspacing="0" cellpadding="0">
		<tr>
			<td style="white-space:nowrap">
				<div class="iconset" style="position:static;">
					<a id="at_mails" href="{optional links::m}{links::m}{/optional}{!optional links::m}index.html?_l=folder&p0=main&p1=content&p2=mail.main&p3=item.fdr&p4=INBOX&_n[p][main]=win.main.tree&p5=M&_c=account&_a[sync]=1{/optional}" class="ico_mail" title="{lang::menu::messages}"><span>{lang::menu::messages}</span></a>
					{optional settings::groupware::enabled}
						{!optional settings::restrictions::disable_gw_types::C}
							<a id="at_contacts" href="{optional links::c}{links::c}{/optional}{!optional links::c}index.html?_l=folder&p0=main&p1=content&p2=contact.main&p3=item.fdr&p4={rawurlencode settings::default_folders::contacts}&_n[p][main]=win.main.tree&p5=C{/optional}" class="ico_contact" title="{lang::menu::contacts}"><span>{lang::menu::contacts}</span></a>
						{/optional}
						{!optional settings::restrictions::disable_gw_types::E}
							<a id="at_events" href="{optional links::e}{links::e}{/optional}{!optional links::e}?_l=folder&p0=main&p1=content&p2=event.main&p3=item.fdr&p4={rawurlencode settings::default_folders::events}&_n[p][main]=win.main.tree&p5=E{/optional}" class="ico_menucalendar" title="{lang::menu::calendar}"><span>{lang::menu::calendar}</span></a>
						{/optional}
						{!optional settings::restrictions::disable_gw_types::T}
							<a id="at_tasks" href="{optional links::t}{links::t}{/optional}{!optional links::t}?_l=folder&p0=main&p1=content&p2=tasks.main&p3=item.fdr&p4={rawurlencode settings::default_folders::tasks}&_n[p][main]=win.main.tree&p5=T{/optional}" class="ico_task" title="{lang::menu::tasks}"><span>{lang::menu::tasks}</span></a>
						{/optional}
						{!optional settings::restrictions::disable_gw_types::N}
							<a id="at_notes" href="{optional links::n}{links::n}{/optional}{!optional links::n}?_l=folder&p0=main&p1=content&p2=notes.main&p3=item.fdr&p4={rawurlencode settings::default_folders::notes}&_n[p][main]=win.main.tree&p5=N{/optional}" class="ico_note" title="{lang::menu::notes}"><span>{lang::menu::notes}</span></a>
						{/optional}
						{!optional settings::restrictions::disable_gw_types::F}
							<a id="at_files" href="{optional links::f}{links::f}{/optional}{!optional links::f}?_l=folder&p0=main&p1=content&p2=file.main&p3=item.fdr&p4={rawurlencode settings::default_folders::files}&_n[p][main]=win.main.tree&p5=F{/optional}" class="ico_file" title="{lang::menu::files}"><span>{lang::menu::files}</span></a>
						{/optional} 
					{/optional}
				</div>
			</td>
			<td style="width:100%">
				
					<div style="position:relative">
						<input id="search" name="search" type="text" class="inp_text{optional request::all::_s::search} active{/optional}" placeholder="{lang::menu::search}..."{optional request::all::_s::search} value="{htmlspecialchars request::all::_s::search}"{/optional}/>
					</div>
					<input type="hidden" name="_c" value="{info::controller}" />
					<input type="hidden" value="{container::id}" name="container"/>
					<input type="hidden" value="{container::type}" name="type"/>
					{optional request::all::_s::distrib_id}<input type="hidden" name="_s[distrib_id]" value="{request::all::_s::distrib_id}"/>{/optional}
					{dynamic variable}<input type="hidden" name="{.*::var_name}" value="{.*::var_value}" />{/dynamic}
			
					<input name="_a[search]" type="hidden" value="1"/>
			</td>
			<td>
				<input name="_a[search]" type="submit" value="{lang::menu::search}" class="inp_btn" />
			</td>
		</tr>
	</table>
	</form>
	</div>