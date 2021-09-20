{optional property::account}
{lang::settings::settings}
{/optional}

{optional request::all::domain '__new'}
<!--New Domain-->
<select name="navigate">
{optional property::available_domains}{dynamic property::available_domains}
{!optional *::set}<option value="{*::domain}">{*::domain}</option>{/optional}
{/dynamic}
{/optional}
</select>
{/optional}


{!optional request::all::domain '__new'}
{optional property::account}
<!--Navigate-->
<select name="navigate">
<option value="__user"{optional property::level 'user'} selected="selected"{/optional}>{lang::settings::user}</option>
{optional property::access::domain}{optional property::available_domains}{dynamic property::available_domains}
<option value="{*::domain}"{optional *::domain_selected} selected="selected"{/optional}>{*::domain}</option>
{/dynamic}{/optional}
<!--<option value="__new">{lang::settings::new_domain}</option>{/optional}-->
{optional property::access::admin}<option value="__admin"{optional property::level 'admin'} selected="selected"{/optional}>{lang::settings::admin}</option>{/optional}
</select>

<input type="submit" name="_a[navigate]" value="{lang::settings::navigate}" class="fancyButton"/>
{/optional}

{optional request::all::domain}<input type="submit" name="_a[remove_domain]" value="{lang::settings::remove}" class="fancyButton"/>{/optional}
{/optional}
