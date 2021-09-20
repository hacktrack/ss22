<form method="post">

<div class="into-bottom-line" style="padding-left:25px; padding-top:12px; .padding-top:7px; z-index:10000">
	<input type="submit" class="fancyButton" value="{lang::grid::save}" name="_a[save]"/>
</div>

<input type="hidden" name="_c" value="settings"/>
<input type="hidden" name="level" value="{property::level}"/>
{optional property::domain}<input type="hidden" name="domain" value="{property::domain}"/>{/optional}

<div class="cover-b wsto">
<div id="cover_a"><div id="cover_b">
<div class="commandLine">
{include ../basic/skin/basic/tpl/settings.control.tpl}
</div>
<div id="sizerWatcher" class="wsto">

<div class="wsto spacer">



<fieldset>
	<div>
		{body}
	</div>
</fieldset>



</div>
</div>
</div>
</div>
</div>
</form>