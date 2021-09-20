<div>
	<input type="hidden" name="_c" value="{info::controller}" />
	<input type="hidden" name="container" value="{container::id}" />
	<input type="hidden" name="type" value="{container::type}" />
	
		{optional request::get::_n::p::content 'contact.distribution'}
			{optional request::all::action}
				<!--<input type="submit" name="_a[contact_save]" value="{lang::mail_main::save}" class="fancyButton left"/>-->
			{/optional}
			{!optional request::all::action}
				{!optional request::get::add_new}
					<!--<input type="submit" name="_a[delete]" value="{lang::mail_main::delete}" class="fancyButton right" alt="{lang::confirmation::delete_contact_distribution}"/>-->
				{/optional}
				<!--
				{optional item::ITM_ID}
					<input type="submit" name="_a[edit]" value="{lang::mail_main::save}" class="fancyButton left"/>
				{/optional}
				{!optional item::ITM_ID}
					<input type="submit" name="_a[create]" value="{lang::mail_main::save}" class="fancyButton left"/>
				{/optional}
				-->
			{/optional}
			<!--
			{optional request::all::action}
				<a href="{stornoLink}" class="fancyButton right">{lang::contact_main::cancel}</a>
			{/optional}
			{!optional request::all::action}
				<input class="fancyButton right" type="submit" name="_a[cancel_distrib]" value="{lang::contact_main::cancel}"/>
			{/optional}
			-->
		{/optional}
</div>