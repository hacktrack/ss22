<form action="{htmlspecialchars info::link}" method="post">

<input type="submit" name="_a[page_both]" value="1" class="almostHidden"/>
<input type="hidden" name="_s[default_page]" value="{htmlspecialchars info::page}"/>

<div class="cover-b wsto">
<div id="cover_a"><div id="cover_b">
<div class="commandLine">

<div>

{include ../basic/skin/default/tpl/grid/_event.view.tpl}

{optional info::showListing}
<div class="right">
{include ../basic/skin/default/tpl/grid/_list_top.tpl}
</div>
{/optional}
{!optional info::showListing}
<div class="right topFix7">
{include ../basic/skin/default/tpl/grid/_event_listing.tpl}
</div>
{/optional}

<div class="cleaner"></div>
</div>

</div>
<div id="sizerWatcher" class="wsto">

{optional info::showListing}
<div class="into-bottom-line-right" style="padding-top:13px; .padding-top:4px;">
{include ../basic/skin/default/tpl/grid/_list_bottom.tpl}
</div>
{/optional}
{!optional info::showListing}
<div class="into-bottom-line-right" style="padding-top:13px; .padding-top:4px;">
{include ../basic/skin/default/tpl/grid/_event_listing.tpl}
</div>
{/optional}

{optional info::showListing}
{!optional request::all::_n::p::main 'win.main.public'}
<div class="into-bottom-line" style="padding-top:12px; .padding-top:3px;">
	<input type="submit" name="_a[delete]" value="{lang::mail_main::delete}" class="fancyButton" alt="{lang::confirmation::delete_event}"/>
</div>
{/optional}{/optional}

<div class="wsto spacer">




<div class="grid" style="">
{optional info::template}
	{include info::template}
{/optional}

</div>





</div>
</div>
</div>
</div>
</div>
</form>