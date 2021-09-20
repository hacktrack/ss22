		<div class="left" id="at_menuLeft">
			<input type="hidden" id="aid" value="{htmlspecialchars email}"/>
			<div class="box">
				<div class="top">
				{optional folder_type 'M'}<a id="at_newMail" href="?_n[p][content]=mail.compose&_n[p][main]=win.main.tree"{optional activeLeftMenuTab::lmtnewmail} class="active"{/optional}>{lang::tree::new_message}</a>{/optional}
				{optional folder_type 'Q'}<span class="top"></span>{/optional}
				{optional folder_type 'QL'}<a href="{optional links::new}{links::new}{/optional}{!optional links::new}{topAction::link}{/optional}"{optional topAction::active} class="active"{/optional}>{lang::quarantine::add}</a>{/optional}
				{optional folder_type 'C'}
					<a id="at_newContact" href="{optional links::new}{links::new}{/optional}{!optional links::new}?_l=folder&amp;p0=main&amp;p1=content&amp;p2=contact.detail&amp;p3=item.fdr&amp;p4={optional request::all::_s::id}{rawurlencode request::all::_s::id}{/optional}{!optional request::all::_s::id}{rawurlencode settings::default_folders::contacts}{/optional}&amp;_n[p][main]=win.main.tree&amp;p5=C{/optional}&amp;add_new=1" class="{optional request::all::p2 'contact.detail'}{!optional request::all::p6}active{/optional}{/optional}">{lang::contact_main::add}</a>
					<a id="at_newDistributionList" href="{optional links::new}{links::new}{/optional}{!optional links::new}?_l=folder&amp;p0=main&amp;p1=content&amp;p2=contact.distribution&amp;p3=item.fdr&amp;p4={optional request::all::_s::id}{rawurlencode request::all::_s::id}{/optional}{!optional request::all::_s::id}{rawurlencode settings::default_folders::contacts}{/optional}&amp;_n[p][main]=win.main.tree&amp;p5=C{/optional}&amp;add_new=1" class="smaller {optional request::all::p2 'contact.distribution'}{!optional request::all::p6}active{/optional}{/optional}">{lang::contact_main::add_distribution}</a>
				{/optional}
				{optional folder_type 'E'}
					<a id="at_newEvent" href="{optional links::new}{links::new}{/optional}{!optional links::new}?_l=folder&amp;p0=main&amp;p1=content&amp;p2=event.detail&amp;p3=item.fdr&amp;p4={optional request::all::_s::id}{rawurlencode request::all::_s::id}{/optional}{!optional request::all::_s::id}{rawurlencode settings::default_folders::events}{/optional}&amp;_n[p][main]=win.main.tree&amp;p5=E{/optional}&amp;add_new=1{optional request::all::_s::interval::start}&amp;_s[interval][start]={htmlspecialchars request::all::_s::interval::start}{/optional}" class="{optional topAction::active}active{/optional}">{lang::event_main::add}</a>
				{/optional}
				{optional folder_type 'T'}<a id="at_newTask" href="{optional links::new}{links::new}{/optional}{!optional links::new}?_l=folder&amp;p0=main&amp;p1=content&amp;p2=tasks.detail&amp;p3=item.fdr&amp;p4={optional request::all::_s::id}{rawurlencode request::all::_s::id}{/optional}{!optional request::all::_s::id}{rawurlencode settings::default_folders::tasks}{/optional}&amp;_n[p][main]=win.main.tree&amp;p5=T{/optional}&amp;add_new=1" class="{optional topAction::active}active{/optional}">{lang::tasks_main::add}</a>{/optional}
				{optional folder_type 'N'}<a id="at_newNote" href="{optional links::new}{links::new}{/optional}{!optional links::new}?_l=folder&amp;p0=main&amp;p1=content&amp;p2=notes.detail&amp;p3=item.fdr&amp;p4={optional request::all::_s::id}{rawurlencode request::all::_s::id}{/optional}{!optional request::all::_s::id}{rawurlencode settings::default_folders::notes}{/optional}&amp;_n[p][main]=win.main.tree&amp;p5=N{/optional}&amp;add_new=1" class="{optional topAction::active}active{/optional}">{lang::notes::add}</a>{/optional}
				{optional folder_type 'F'}<a id="at_newFile" href="{optional links::new}{links::new}{/optional}{!optional links::new}?_l=folder&amp;p0=main&amp;p1=content&amp;p2=file.detail&amp;p3=item.fdr&amp;p4={optional request::all::_s::id}{rawurlencode request::all::_s::id}{/optional}{!optional request::all::_s::id}{rawurlencode settings::default_folders::files}{/optional}&amp;_n[p][main]=win.main.tree&amp;p5=F{/optional}&amp;add_new=1" class="{optional topAction::active}active{/optional}">{lang::files::add}</a>{/optional}
				{optional folder_type 'HIPAA'}
					<a id="at_newPatient" href="{optional links::new}{links::new}{/optional}{!optional links::new}?_l=folder&amp;p0=main&amp;p1=content&amp;p2=hipaa.detail&amp;p3=item.fdr&amp;p4=__@@HIPAA@@__&amp;_n[p][main]=win.main.tree&amp;p5=HIPAA{/optional}&amp;add_new=patients" class="{optional request::all::p2 'contact.detail'}{!optional request::all::p6}active{/optional}{/optional}">{lang::hipaa::new_patient}</a>
					<a id="at_newStaff" href="{optional links::new}{links::new}{/optional}{!optional links::new}?_l=folder&amp;p0=main&amp;p1=content&amp;p2=hipaa.detail&amp;p3=item.fdr&amp;p4=__@@HIPAA@@__&amp;_n[p][main]=win.main.tree&amp;p5=HIPAA{/optional}&amp;add_new=staff" class="{optional request::all::p2 'contact.distribution'}{!optional request::all::p6}active{/optional}{/optional}">{lang::hipaa::new_staff}</a>
				{/optional}
				</div>
				
				<div class="middle">
				{!optional folder_type 'HIPAA'}
				{dynamic leftMenu}
					{optional *::label}
						<a href="{optional links::folders}{links::folders}{/optional}{!optional links::folders}{.*::link}{/optional}{.*::link_suffix ''}"{!optional *::id '__@@ADDRESSBOOK@@__'} title="{htmlspecialchars .*::id}"{/optional} class="{optional *::active}active{/optional}{optional *::disabled} disabled{/optional}"><span>&bull;</span>{.*::label}{optional *::recent} ({.*::recent}){/optional}</a>
					{/optional}
				{/dynamic}
				{/optional}
				</div>

				{!optional folder_type 'S'}
				<div class="bottom">
				{optional folder_type 'M'}
					{optional settings::quarantine::enabled}
						{optional settings::bwlist::enabled}
						<a href="{optional links::fm}{links::fm}{/optional}{!optional links::fm}?_l=folder&p0=main&p1=content&p2=quarantine.main&p3=item.fdr&p4=Quarantine&p5=Q{/optional}" class="{optional sType 'QL'}active {/optional}{optional sType 'Q'}active {/optional}"><span>&bull;</span>{lang::menu::quarantine}</a>
						{/optional}
						{!optional settings::bwlist::enabled}
							{optional settings::bwlist::whitelist}
							<a href="{optional links::fm}{links::fm}{/optional}{!optional links::fm}?_l=folder&p0=main&p1=content&p2=quarantine.bwlist&p3=item.fdr&p4=SPAM_QUEUE%2FWhitelist&p5=QL{/optional}" class="{optional sType 'QL'}active {/optional}{optional sType 'Q'}active {/optional}"><span>&bull;</span>{lang::menu::quarantine}</a>
							{/optional}
							{!optional settings::bwlist::whitelist}
							<a href="{optional links::fm}{links::fm}{/optional}{!optional links::fm}?_l=folder&p0=main&p1=content&p2=quarantine.bwlist&p3=item.fdr&p4=SPAM_QUEUE%2FBlacklist&p5=QL{/optional}" class="{optional sType 'QL'}active {/optional}{optional sType 'Q'}active {/optional}"><span>&bull;</span>{lang::menu::quarantine}</a>
							{/optional}
						{/optional}
					{/optional}
				{/optional}
			

				{!optional folder_type 'Q'}
				{!optional folder_type 'HIPAA'}
				{!optional folder_type 'QL'}
				<a href="{optional links::fm}{links::fm}{/optional}{!optional links::fm}?_n[p][content]=manage.folders&_n[p][main]=win.main.tree&_s[type]={optional type 'Q'}M{/optional}{optional type 'QL'}M{/optional}{!optional type 'Q'}{!optional type 'QL'}{htmlspecialchars type}{/optional}{/optional}{/optional}" class="{optional activeLeftMenuTab::lmtfolders}active {/optional}"><span>&bull;</span>{lang::tree::manage_folders}</a>
				{/optional}
				{/optional}
				{/optional}
				</div>
				{/optional}

				<select class="button" id="menu_portrait">
                <optgroup label="{lang::tree::open_folder}">
				{dynamic leftMenu}
					<option value="{optional links::folders}{links::folders}{/optional}{!optional links::folders}{.*::link}{/optional}"{optional *::active} selected="selected"{/optional}{optional *::disabled} disabled="disabled"{/optional}>{.*::label}</option>
				{/dynamic}
				</optgroup>
				
                    <optgroup label="&nbsp;">
                    {optional settings::quarantine::enabled}
					{optional folder_type 'M'}
						{optional settings::bwlist::enabled}
						<option value="{optional links::fm}{links::fm}{/optional}{!optional links::fm}?_l=folder&p0=main&p1=content&p2=quarantine.main&p3=item.fdr&p4=Quarantine&p5=Q{/optional}"{optional sType 'QL'} selected="selected"{/optional}{optional sType 'Q'} selected="selected"{/optional}>{lang::menu::quarantine}</option>
						{/optional}
						{!optional settings::bwlist::enabled}
							{optional settings::bwlist::whitelist}
							<option value="{optional links::fm}{links::fm}{/optional}{!optional links::fm}?_l=folder&p0=main&p1=content&p2=quarantine.bwlist&p3=item.fdr&p4=SPAM_QUEUE%2FWhitelist&p5=QL{/optional}"{optional sType 'QL'} selected="selected"{/optional}{optional sType 'Q'} selected="selected"{/optional}>{lang::menu::quarantine}</option>
							{/optional}
							{!optional settings::bwlist::whitelist}
							<option value="{optional links::fm}{links::fm}{/optional}{!optional links::fm}?_l=folder&p0=main&p1=content&p2=quarantine.bwlist&p3=item.fdr&p4=SPAM_QUEUE%2FBlacklist&p5=QL{/optional}"{optional sType 'QL'} selected="selected"{/optional}{optional sType 'Q'} selected="selected"{/optional}>{lang::menu::quarantine}</option>
							{/optional}
						{/optional}
					{/optional}
					{/optional}

					{!optional folder_type 'S'}
					{!optional folder_type 'Q'}
					{!optional folder_type 'QL'}
					{!optional folder_type 'HIPAA'}
					<option value="{optional links::fm}{links::fm}{/optional}{!optional links::fm}?_n[p][content]=manage.folders&_n[p][main]=win.main.tree&_s[type]={optional type 'Q'}M{/optional}{optional type 'QL'}M{/optional}{!optional type 'Q'}{!optional type 'QL'}{htmlspecialchars type}{/optional}{/optional}{/optional}"{optional activeLeftMenuTab::lmtfolders} selected="selected"{/optional}>{lang::tree::manage_folders}</option>
	            	{/optional}
	            	{/optional}
	            	{/optional}
	            	{/optional}
	            	</optgroup>

				</select>
			</div>
		</div>