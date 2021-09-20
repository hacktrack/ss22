<div class="{css}">
	{dynamic block}
	<div class="block {block::*::css}">
		<span></span>
		<h2>{block::*::H}</h2>
		<p>{block::*::BODY}</p>
	</div>
	{/dynamic}
	{optional data::LINK_BOTTOM}<div class="center"><span class="link bottom">{data::LINK_BOTTOM}</span></div>{/optional}
</div>