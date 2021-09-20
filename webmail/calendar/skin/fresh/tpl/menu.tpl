	<div id="header1">
		<div class="account">
			{optional quota}
				<span class="quota"><span class="color" style="width:{quota::percentage}%; background-color:rgb({quota::color::r},{quota::color::g},{quota::color::b});"></span><span class="text">{quota::usage} / {quota::limit}</span></span>
			{/optional}
		</div>
		<div class="iconset">
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
			<td>
					<div>
						<input type="hidden" name="accountPublicOld"{optional request::all::email} value="{htmlspecialchars request::all::email}"{/optional} />
						<input id="account" name="accountPublic" type="text" class="inp_text" placeholder="{lang::event_main::account}"{optional request::all::email} value="{htmlspecialchars request::all::email}"{/optional} />
					</div>
			</td>
			<td>
				<input name="_a[account]" type="submit" value="{lang::tree::open}" class="inp_btn" />
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
			</td>
			<td>
				<input name="_a[search]" type="submit" value="{lang::menu::search}" class="inp_btn" />
			</td>
		</tr>
	</table>
	</form>
	</div>