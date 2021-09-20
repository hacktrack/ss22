<div>
	{optional request::get::p6}
	<div class="right topFix7">
		<input type="submit" name="_a[delete]" value="{lang::mail_main::delete}" class="fancyButton" alt="{lang::confirmation::delete_event}"/>
	</div>
	{/optional}
	
	{optional request::get::p6}
		<input type="submit" value="{lang::grid::save}" class="fancyButton none" name="_a[edit]"/>
	{/optional}
	{!optional request::get::p6}
		<input type="submit" name="_a[create]" value="{lang::event_main::save}" class="fancyButton"/>
	{/optional}
</div>