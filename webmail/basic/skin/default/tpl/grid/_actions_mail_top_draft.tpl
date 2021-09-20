<div class="left">
		<input type="hidden" name="_c" value="{info::controller}" />
		<input type="hidden" name="container" value="{container::id}" />
		<input type="hidden" name="type" value="{container::type}" />
		<input class="fancyButton" type="submit" value="{lang::mail_main::delete}" name="_a[delete]" alt="{lang::confirmation::delete_mail}"/>
		
		<select size="1" name="multiple_mail_action_top" id="multiple_mail_action_top">
			<option value="">{lang::mail_main::dws}:</option>
			<option value="copy">{lang::mail_main::copy}</option>
			<option value="move">{lang::mail_main::move}</option>
		</select>
		<select size="1" name="select_folder_top" id="select_folder_top" class="noJSShow">
			<option value="">{lang::mail_main::select_folder}:</option>
			
			{dynamic folders::personal}
			<option value="{.*::id}">{.*::label}</option>
			{/dynamic}
		</select>
		<input class="fancyButton" type="submit" name="_a[multiple_mail_action_top]" value="{lang::mail_main::doit}" />
</div>