{include ../basic/skin/fresh/tpl/_toolbar.top_groupware.detail.tpl}
<div class="body form">

{optional item::id}
	<input type="hidden" name="item[id]" value="{item::id}" />
	<input type="hidden" name="items[{item::id}]"/>
	<h2>{lang::contact_main::contact}</h2>
{/optional}

{!optional item::id}
	<h2>{lang::hippa_detail::add} {optional request::all::add_new 'staff'}{lang::hippa_detail::staff}{/optional}{optional request::all::add_new 'patients'}{lang::hippa_detail::patient}{/optional}</h2>
{/optional}


<input type="hidden" name="item[category]" value="{request::all::add_new}" />
<table class="frmtbl">
	<tr>
		<th>{lang::login::username}</th>
		<td>
			<input type="text" class="inp_text"  name="item[username]" {optional item::name} value="{htmlspecialchars item::name}"{/optional} />
		</td>
	</tr>
	<tr>
		<th>{lang::login::full_name}</th>
		<td>
			<input type="text" class="inp_text"  name="item[name]" {optional item::name} value="{htmlspecialchars item::name}"{/optional} />
		</td>
	</tr>
	<!--<tr>
		<th>{lang::login::role}</th>
		<td>
			<select class="inp_text"  name="item[category]" {optional item::name} value="{htmlspecialchars item::name}"{/optional}>
				<option value="staff" {optional request::all::add_new 'staff'} selected="selected"{/optional}>Staff</option>
				<option value="patients" {optional request::all::add_new 'patients'} selected="selected"{/optional}>Patient</option>
			</select>
		</td>
	</tr>-->
	<tr>
		<th>{lang::hipaa::notify_email}</th>
		<td>
			<input type="text" class="inp_text"  name="item[notify_email]" {optional item::notify_email} value="{htmlspecialchars item::notify_email}"{/optional} />
		</td>
	</tr>
	<tr>
		<th>{lang::hipaa::notify_sms}</th>
		<td>
			<input type="text" class="inp_text"  name="item[notify_sms]" {optional item::notify_sms} value="{htmlspecialchars item::notify_sms}"{/optional} />
		</td>
	</tr>
	<tr>
		<td colspan="2">&nbsp;</td>
	</tr>

	<tr>
		<th>{lang::contact_main::street}</th>
		<td>
			<input type="text" class="inp_text"  name="item[street]" {optional item::street} value="{htmlspecialchars item::street}"{/optional} />
		</td>
	</tr>
	<tr>
		<th>{lang::contact_main::city}</th>
		<td>
			<input type="text" class="inp_text"  name="item[city]" {optional item::city} value="{htmlspecialchars item::city}"{/optional} />
		</td>
	</tr>
	<tr>
		<th>{lang::contact_main::state}</th>
		<td>
			<input type="text" class="inp_text"  name="item[state]" {optional item::state} value="{htmlspecialchars item::state}"{/optional} />
		</td>
	</tr>
	<tr>
		<th>{lang::contact_main::zip}</th>
		<td>
			<input type="text" class="inp_text"  name="item[zip]" {optional item::zip} value="{htmlspecialchars item::zip}"{/optional} />
		</td>
	</tr>
</table>

<label class="clear"></label>

</div>


{include ../basic/skin/fresh/tpl/_toolbar.bottom_groupware.detail.tpl}

