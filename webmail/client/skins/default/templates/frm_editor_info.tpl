<div class="table panel">

	<div class="cell">
		<div class="label">{DOCUMENT::READ_ONLY_MODE}</div>
	</div>
	<div class="cell middle">
		{optional unlock}
		<div class="avatar"><img src="{src}"></div>
		<div class="name">{name}</div>
		<div class="button">{DOCUMENT::REQUEST_UNLOCK}</div>
		{/optional}
		{noptional unlock}
		<div class="name">{DOCUMENT::DOCUMENT_UNLOCKED}</div>
		<div class="button">{DOCUMENT::RELOAD}</div>
		{/noptional}
		<div class="cell last"></div>
	</div>
</div>