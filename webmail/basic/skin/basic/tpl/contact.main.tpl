<form action="{htmlspecialchars info::link}" method="post">

<input type="submit" name="_a[page_both]" value="1" class="almostHidden"/>
<input type="hidden" name="_s[default_page]" value="{htmlspecialchars info::page}"/>

<div class="cover-b wsto">
<div id="cover_a"><div id="cover_b">
<div class="commandLine">

<input type="hidden" name="_c" value="{info::controller}" />
<input type="hidden" name="container" value="{container::id}" />
<input type="hidden" name="type" value="{container::type}" />

<table class="wsto" cellpadding="0" cellspacing="0">
	<tr>
		<td>{include ../basic/skin/default/tpl/grid/_items_main_top.tpl}</td>
		<td>{include ../basic/skin/default/tpl/grid/_list_top.tpl}</td>
	</tr>
</table>

</div>
<div id="sizerWatcher" class="wsto">

<div class="wsto spacer">





<div class="grid">
{optional info::template}
	{include info::template}
{/optional}
</div>


<div class="cleaner"></div>
</div>

<div class="into-bottom-line-right" style="padding-top:12px; .padding-top:5px;">
	{include ../basic/skin/default/tpl/grid/_list_bottom.tpl}
</div>

{optional info::template '../basic/skin/basic/tpl/contact.list.tpl'}
{include ../basic/skin/default/tpl/grid/_items_main_bottom.tpl}
{/optional}

</div>
</div>
</div>
</div>

</form>