{optional property::show_force_domain}
<td class="ch1" title="{lang::settings::force_admin}">
	<input type="hidden" name="force[domain][{property::force_name}]" value="0"/>
	<input type="checkbox" name="force[domain][{property::force_name}]" value="1" {optional property::force_domain} checked="checked"{/optional}/>
</td>
{/optional}
{optional property::show_force_user}
<td class="ch2" title="{lang::settings::force_domain}">
	<input type="hidden" name="force[user][{property::force_name}]" value="0"/>
	<input type="checkbox" name="force[user][{property::force_name}]" value="1"{optional property::force_user} checked="checked"{/optional}{optional property::force_user_disabled} disabled="disabled"{/optional}/>
</td>
{/optional}