<div class="text-center" id="{anchor loading}">
	<img src="client/skins/default/images/loading/loader.gif" alt="{IFRAME::LOADING}..." title="Loading animation">
	<label class="label">{IFRAME::LOADING}</label>
</div>

<iframe id="{anchor iframe}" is-hidden="1"></iframe>

<div class="text-center" id="{anchor error}" is-hidden="1">
	<div>{IFRAME::SOMETHING_WENT_WRONG}</div>
	<div>{IFRAME::RELOAD_HELPER}</div>
	<img src="client/skins/default/images/iframe-error.svg" alt="error" title="Error">
	<obj name="reload" type="obj_button" css="text primary" tabindex="true">
		<value>IFRAME::RELOAD</value>
	</obj>
</div>

