<div class="tabform">
	<h2>{ITEMVIEW::REVISIONS}{optional rev_data}<a href="javascript: void(0);" class="revisions">{FORM_BUTTONS::EDIT}</a>{/optional}</h2>
	<div class="revisions" id="{anchor revlist}">
		<a class="revision new">
			<span class="avatar"><span></span></span>
			<span class="name"><strong>{ITEMVIEW::NEW_REVISION}</strong></span>
			<span class="date"></span>
		</a>
		{dynamic rev_data}
		<a class="revision" rel="{rev_data::*::id}"{optional rev_data::*::title} title="{htmlspecialchars-double-quote rev_data::*::title}"{/optional}>
			<span class="avatar"><span style="background-image: url('{rev_data::*::avatar}')"></span></span>
			<span class="name"><strong>{htmlspecialchars rev_data::*::name}</strong></span>
			<span class="date">{htmlspecialchars rev_data::*::date}</span>
		</a>
		{/dynamic}
	</div>
</div>
