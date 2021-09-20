{include ../basic/skin/fresh/tpl/_toolbar.top_event.main.tpl}

<div class="body">

<!-- {!optional request::all::view 'event.list'} form{/optional} -->

<input type="hidden" name="_s[default_page]" value="{htmlspecialchars info::page}"/>

{optional info::template}
	{include info::template}
{/optional}

</div>

{include ../basic/skin/fresh/tpl/_toolbar.bottom_event.main.tpl}