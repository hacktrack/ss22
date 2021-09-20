<div class="left">
		<input type="hidden" name="_c" value="{info::controller}" />
		<input type="hidden" name="container" value="{container::id}" />
		<input type="hidden" name="type" value="{container::type}" />
		<input class="fancyButton" type="submit" value="{lang::mail_main::delete}" name="_a[delete]" alt="{lang::confirmation::delete_mail}"/>
		
<!--
		{optional settings::bwlist::blacklist}
		<input class="fancyButton" type="submit" value="{lang::mail_main::blacklist}" name="_a[blacklist]"/>
		{/optional}
		{optional settings::bwlist::whitelist}
		<input class="fancyButton" type="submit" value="{lang::mail_main::whitelist}" name="_a[whitelist]"/>
		{/optional}
-->

		&nbsp;&nbsp;&nbsp;
{optional jscheck}
		{!optional oldbrowser}
			<input class="fancyButton" type="submit" value="{lang::mail_main::move}" name="_a[move]"/>
			<input class="fancyButton" type="submit" value="{lang::mail_main::copy}" name="_a[copy]"/>
			&nbsp;&nbsp;&nbsp;
		{/optional}
{/optional}

		<select size="1" name="multiple_mail_action_top" id="multiple_mail_action_top">
			<option value="">{lang::mail_main::dws}:</option>
			{!optional container::isSent}
			<option value="read">{lang::mail_main::mar}</option>
			<option value="unread">{lang::mail_main::mau}</option>
			{optional settings::bwlist::whitelist}<option value="whitelist">{lang::mail_main::whitelist}</option>{/optional}
			{optional settings::bwlist::blacklist}<option value="blacklist">{lang::mail_main::blacklist}</option>{/optional}
			{/optional}
{!optional jscheck}
			<option value="copy">{lang::mail_main::copy}</option>
			<option value="move">{lang::mail_main::move}</option>
{/optional}
		</select>
		<select size="1" name="select_folder_top" id="select_folder_top" class="noJSShow">
			<option value="">{lang::mail_main::select_folder}:</option>
			
			{dynamic folders::personal}
			<option value="{.*::id}">{.*::label}</option>
			{/dynamic}
		</select>
		<input class="fancyButton" type="submit" name="_a[multiple_mail_action_top]" value="{lang::mail_main::doit}" />
</div>