<div class="into-bottom-line" style="padding-top:12px; .padding-top:4px;">
	{optional request::get::p6}
		<input type="submit" value="{lang::grid::save}" class="fancyButton none" name="_a[edit]"/>
	{/optional}
	{!optional request::get::p6}
		<input type="submit" name="_a[create]" value="{lang::event_main::save}" class="fancyButton"/>
	{/optional}
</div>
{optional request::get::p6}
<div class="into-bottom-line-right" style="padding-top:12px; .padding-top:7px;">
	<input type="submit" name="_a[delete]" value="{lang::mail_main::delete}" class="fancyButton" alt="{lang::confirmation::delete_event}"/>
</div>
{/optional}